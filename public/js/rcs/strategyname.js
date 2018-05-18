layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'strategyname',
        elem: '#strategyname',
        height: 'full-70',
        page: constants.LAYUIPAGE,
        url: '/risk/policyName',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'policyName', title: '策略名称', align: 'center', width: 120},
            {field: 'ruleName', title: '规则名称', align: 'center', width: 140},
            {field: 'sort', title: '排序', align: 'center', width: 80},
            {field: 'updateTime', title: '修改时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.updateTime)},
            {title: '操作', width: 300, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(strategyname)', o => {
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
                    $.post('/risk/policyName', {id: d.id, ruleName: ruleNames}, data => {
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
                title: '修改策略名称',
                type: 2,
                content: ['/rcs/deal/strategyname.html', 'no'],
                area: ['300px', '180px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                },
                end: () => {
                    if (sessionStorage.getItem('user')) {
                        let u = JSON.parse(sessionStorage.getItem('user'));
                        u.state = (u.state === 'true');
                        o.update(u);
                        sessionStorage.removeItem('user');
                    }
                }
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要' + r`删除` + '该策略名称吗？', constants.FAIL, i => {
                $.post('/risk/policyName/' + d.id, {policyName: d.policyName}, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('策略名称删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });


    $('#add').click(() => {
        layer.open({
            title: '新建策略名称',
            type: 2,
            content: ['/rcs/deal/strategyname.html', 'no'],
            area: ['300px', '180px']
        });
    });

    $('#refresh').click(() => t.reload('strategyname', {where: null}));

    f.on('submit(submit)', d => {
        t.reload('strategyname', {page: {curr: 1}, where: d.field});
        return false;
    });

    t.on('sort(strategyname)', o => t.reload('strategyname', {where: {sort: o.field, sortOrder: o.type}}));
});