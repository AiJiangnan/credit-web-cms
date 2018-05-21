layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    $.get('/risk/channel?page=0&limit=10000', d => {
        laytplrender(channelTpl, 'channelView', d.data);
        f.render('select');
    });

    t.render({
        id: 'product',
        elem: '#product',
        height: 'full-70',
        page: constants.LAYUIPAGE,
        url: '/risk/product',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'channelName', title: '渠道名称', align: 'center', width: 100},
            {field: 'productName', title: '产品名称', align: 'center', width: 100},
            {field: 'closed', title: '状态', align: 'center', width: 80, templet: '#closed'},
            {field: 'updateTime', title: '修改时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.updateTime)},
            {title: '操作', width: 280, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(product)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'edit') {
            layer.open({
                title: '修改产品',
                type: 2,
                content: [`/rcs/deal/product.html?channel=${d.channelId}`, 'no'],
                area: ['300px', '300px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        if (k === 'channelId') {
                            continue;
                        }
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                }
            });
        }
        if (e === 'onoff') {
            let s = d.closed;
            const m = r(!s ? '停用' : '启用');
            layer.confirm(`你确定要${m}该产品！`, constants.WARM, i => {
                $.post('/risk/product', {id: d.id, closed: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`产品${m}成功！`, constants.SUCCESS);
                        o.update({closed: !s});
                        return;
                    }
                    layer.msg(`产品${m}失败！`, constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要' + r`删除` + '该产品吗？', constants.FAIL, i => {
                $.post('/risk/product/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('产品删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });

    $('#add').click(() => {
        layer.open({
            title: '新建产品',
            type: 2,
            content: ['/rcs/deal/product.html', 'no'],
            area: ['300px', '300px']
        });
    });

    $('#refresh').click(() => t.reload('product', {where: null}));

    f.on('submit(submit)', d => {
        t.reload('product', {page: {curr: 1}, where: d.field});
        return false;
    });

    t.on('sort(product)', o => t.reload('product', {where: {sort: o.field, sortOrder: o.type}}));
});