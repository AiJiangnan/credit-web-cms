layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    let field = {};

    $.get('/risk/enum', d => {
        d.field.map((e, i) => {
            field[e.value] = e.detail;
        });
    });

    const getField = str => {
        if (!str) return '-';
        return field[str]
    };

    t.render({
        id: 'rule',
        elem: '#rule',
        height: 'full-70',
        page: true,
        url: '/risk/rule',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'productName', title: '产品名称', align: 'center', width: 100},
            {field: 'ruleName', title: '规则名称', align: 'center', width: 140},
            {field: 'type', title: '类型', align: 'center', width: 80, templet: '#type'},
            {field: 'whetherBlacklist', title: '是否加入黑名单', align: 'center', width: 140, templet: d => d.whetherBlacklist ? '是' : '否'},
            {field: 'detail', title: '详情', align: 'center', width: 100},
            {field: 'ruleList', title: '规则列表', align: 'center', width: 100},
            {field: 'logical', title: '逻辑关系', align: 'center', width: 100},
            {field: 'field', title: '字段', align: 'center', width: 120, templet: d => getField(d.field)},
            {field: 'determine', title: '比较符', align: 'center', width: 120},
            {field: 'param', title: '比较参数', align: 'center', width: 100},
            {field: 'closed', title: '状态', align: 'center', width: 80, templet: '#closed'},
            {title: '操作', width: 300, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(rule)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'rule') {
            if (d.ruleName) sessionStorage.setItem('ruleNames', d.ruleList);
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
                    $.post('/risk/rule', {id: d.id, ruleList: ruleNames}, data => {
                        if (data.code === 0) {
                            layer.msg(data.data, constants.SUCCESS);
                            o.update({ruleList: ruleNames});
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
                title: '修改规则',
                type: 2,
                content: ['/rcs/deal/rule.html', 'no'],
                area: ['400px', '460px'],
                success: (l, i) => {
                    sessionStorage.setItem('rule', JSON.stringify(d));
                }
            });
        }
        if (e === 'onoff') {
            let s = d.closed;
            const m = '<span style="color:red;">' + (!s ? '停用' : '启用') + '</span>';
            layer.confirm(`你确定要${m}该规则！`, constants.WARM, i => {
                $.post('/risk/rule', {id: d.id, closed: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`规则${m}成功！`, constants.SUCCESS);
                        o.update({closed: !s});
                        return;
                    }
                    layer.msg(`规则${m}失败！`, constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要' + r`删除` + '该规则吗？', constants.FAIL, i => {
                $.post('/risk/rule/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('规则删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });

    $('#add').click(() => {
        layer.open({
            title: '新建规则',
            type: 2,
            content: ['/rcs/deal/rule.html', 'no'],
            area: ['450px', '460px']
        });
    });

    $('#refresh').click(() => t.reload('rule', {where: null}));

    f.on('submit(submit)', d => {
        t.reload('rule', {where: d.field});
        return false;
    });

    t.on('sort(rule)', o => t.reload('rule', {where: {sort: o.field, sortOrder: o.type}}));
});