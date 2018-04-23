layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'strategy',
        elem: '#strategy',
        height: 'full-70',
        page: true,
        url: '/risk/policy',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'policyName', title: '策略名称', align: 'center', width: 120},
            {field: 'sort', title: '排序', align: 'center', width: 80},
            {field: 'ruleName', title: '规则名称', align: 'center', width: 120},
            {field: 'whetherPass', title: '是否通过规则', align: 'center', width: 120, templet: d => d.whetherPass ? '是' : '否'},
            {field: 'closed', title: '状态', align: 'center', width: 120, templet: '#closed'},
            {field: 'updateTime', title: '修改时间', align: 'center', width: 160, sort: true, templet: d => dateTimeFormat(d.updateTime)},
            {title: '操作', width: 300, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(strategy)', o => {
            let [e, d] = [o.event, o.data];
            if (e === 'rule') {
                if (d.ruleName) sessionStorage.setItem('ruleNames', d.ruleName);
                layer.open({
                    title: '选择规则',
                    type: 2,
                    content: '/rcs/deal/rulelist.html',
                    area: ['600px', '450px'],
                    btn: ['确认', '取消'],
                    yes: (i, l) => {
                        let f = layer.getChildFrame('form', i);
                        const ruleName = f.find(':checked');
                        if (ruleName.length < 1) {
                            layer.msg('没有选择任何规则！', constants.LOCK);
                            return;
                        }
                        let ruleNames = '';
                        ruleName.map((i, e) => {
                            ruleNames += $(e).val();
                            if (i !== ruleName.length - 1) ruleNames += ',';
                        });
                        $.post('/risk/policy', {id: d.id, ruleName: ruleNames}, data => {
                            if (data.code === 0) {
                                layer.msg(data.data, constants.SUCCESS);
                                o.update({ruleName: ruleNames});
                            } else {
                                layer.msg(data.msg, constants.ERROR);
                            }
                            layer.close(i);
                        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
                    },
                    btn2: (i, l) => {
                        layer.close(i);
                    }
                });
            }
            if (e === 'edit') {
                layer.open({
                    title: '修改策略',
                    type: 2,
                    content: ['/rcs/deal/strategy.html', 'no'],
                    area: ['400px', '240px'],
                    success: (l, i) => {
                        let f = layer.getChildFrame('form', i);
                        for (let k in d) {
                            if (k === 'whetherPass') continue;
                            f.find("input[name='" + k + "']").val(d[k]);
                        }
                        f.find("input[name='whetherPass'][value=" + (d.whetherPass ? '1' : '0') + "]").prop('checked', true);
                    }
                });
            }
            if (e === 'onoff') {
                let s = d.closed;
                const m = '<span style="color:red;">' + (!s ? '停用' : '启用') + '</span>';
                layer.confirm(`你确定要${m}该策略！`, constants.WARM, i => {
                    $.post('/risk/policy', {id: d.id, closed: !s}, data => {
                        if (data.code === 0) {
                            layer.msg(`策略${m}成功！`, constants.SUCCESS);
                            o.update({closed: !s});
                            return;
                        }
                        layer.msg(`策略${m}失败！`, constants.ERROR);
                    }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                    layer.close(i);
                });
            }
            if (e === 'del') {
                layer.confirm('你确定要' + r`删除` + '该策略吗？', constants.FAIL, i => {
                    $.post('/risk/policy/' + d.id, data => {
                        if (data.code === 0) {
                            layer.msg(data.data, constants.SUCCESS);
                            o.del();
                            return;
                        }
                        layer.msg('策略删除失败！', constants.ERROR);
                    }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                    layer.close(i);
                });
            }
        }
    );


    $('#add').click(() => {
        layer.open({
            title: '新建策略',
            type: 2,
            content: ['/rcs/deal/strategy.html', 'no'],
            area: ['400px', '240px']
        });
    });

    $('#refresh').click(() => t.reload('strategy', {where: null}));

    f.on('submit(submit)', d => {
        t.reload('strategy', {where: d.field});
        return false;
    });

    t.on('sort(strategy)', o => t.reload('strategy', {where: {sort: o.field, sortOrder: o.type}}));
});