layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'rule',
        elem: '#rule',
        height: 'full-70',
        page: true,
        url: '/risk/rule',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'username', title: '用户名', align: 'center', width: 120},
            {field: 'realname', title: '姓名', align: 'center', width: 120},
            {field: 'gender', title: '性别', align: 'center', width: 80, templet: '#gender'},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'state', title: '状态', align: 'center', width: 80, sort: true, templet: '#state'},
            {title: '操作', width: 300, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(rule)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'allot') {
            layer.open({
                title: '分配角色',
                type: 2,
                content: '/system/rulerole.html',
                area: ['300px', '400px'],
                btn: ['确认', '取消'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    f.attr('data-id', d.id);
                },
                yes: (i, l) => {
                    let f = layer.getChildFrame('form', i);
                    let roleIds = [];
                    f.find(':checked').map((i, e) => roleIds.push($(e).val()));
                    if (roleIds.length < 1) {
                        layer.msg('分配角色不能为空！', constants.LOCK);
                        return;
                    }
                    $.post('/user/role', {userId: d.id, roleIds: JSON.stringify(roleIds)}, data => {
                        if (data.code === 0) {
                            layer.msg(data.data, constants.SUCCESS);
                            layer.close(i);
                        }
                    }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                },
                btn2: (i, l) => {
                    layer.close(i);
                }
            });
        }
        if (e === 'edit') {
            layer.open({
                title: '修改管理员',
                type: 2,
                content: ['/system/editrule.html', 'no'],
                area: ['300px', '300px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        if (k === 'gender') continue;
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                    f.find("input[name='gender'][value=" + d.gender + "]").prop('checked', true);
                    f.find("input[name='statebox']").attr('checked', d.state);
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
        if (e === 'onoff') {
            let s = d.state;
            const m = '<span style="color:red;">' + (s ? '停用' : '启用') + '</span>';
            layer.confirm(`你确定要${m}该管理员！`, constants.WARM, i => {
                $.post('/user', {id: d.id, state: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`管理员${m}成功！`, constants.SUCCESS);
                        o.update({state: !s});
                        return;
                    }
                    layer.msg(`管理员${m}失败！`, constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要' + r`删除` + '该管理员吗？', constants.FAIL, i => {
                $.post('/user/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('管理员删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });


    $('#add').click(() => {
        layer.open({
            title: '新建管理员',
            type: 2,
            content: ['/system/newrule.html', 'no'],
            area: ['300px', '380px']
        });
    });

    $('#refresh').click(() => t.reload('rule', {where: null}));

    f.on('submit(submit)', d => {
        t.reload('rule', {where: d.field});
        return false;
    });

    t.on('sort(rule)', o => t.reload('rule', {where: {sort: o.field, sortOrder: o.type}}));
});