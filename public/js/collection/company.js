layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'company',
        elem: '#company',
        height: 'full-70',
        page: true,
        url: '/collect/company',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'name', title: '公司名称', align: 'center', width: 180},
            {field: 'nickname', title: '公司简称', align: 'center', width: 120},
            {field: 'phone', title: '联系电话', align: 'center', width: 120},
            {field: 'linkmanName', title: '联系人名称', align: 'center', width: 120},
            {field: 'linkmanPhone', title: '联系人电话', align: 'center', width: 120},
            {field: 'state', title: '状态', align: 'center', width: 80, sort: true, templet: '#state'},
            {title: '操作', width: 200, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(company)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'info') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:5em;"><b>委案单数：</b></td><td>${d.entrustNum}</td></tr>
                    <tr><td><b>委案金额：</b></td><td>${d.entrustAmount}</td></tr>
                    <tr><td><b>成功单数：</b></td><td>${d.successNum}</td></tr>
                    <tr><td><b>成功金额：</b></td><td>${d.successAmount}</td></tr>
                </table>`);
        }
        if (e === 'onoff') {
            let s = d.state;
            const m = '<span style="color:red;">' + (s ? '停用' : '启用') + '</span>';
            layer.confirm(`你确定要${m}该外包公司！`, constants.WARM, i => {
                $.post('/collect/company', {id: d.id, state: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`外包公司${m}成功！`, constants.SUCCESS);
                        o.update({state: !s});
                        return;
                    }
                    layer.msg(`外包公司${m}失败！`, constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });


    $('#add').click(() => {
        layer.open({
            title: '新建外包公司',
            type: 2,
            content: ['/collection/newcompany.html', 'no'],
            area: ['300px', '350px']
        });
    });

    $('#refresh').click(() => t.reload('company', {where: null}));

    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('company', {where: d.field});
        return false;
    });

    t.on('sort(company)', o => t.reload('company', {where: {sort: o.field, sortOrder: o.type}}));
});