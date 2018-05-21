layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'admin',
        elem: '#admin',
        height: 'full-70',
        page: constants.LAYUIPAGE,
        url: '/user',
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

    t.on('tool(admin)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'allot') {
            layer.open({
                title: '分配角色',
                type: 2,
                content: '/system/adminrole.html?id=' + d.id,
                area: ['300px', '400px'],
                btn: ['确认', '取消'],
                yes: (i, l) => {
                    let f = layer.getChildFrame('form', i);
                    let roleIds = [];
                    f.serializeArray().map((e, i) => roleIds.push(e.value));
                    if (roleIds.length > 0) {
                        $.post('/user/role', {userId: d.id, roleIds: JSON.stringify(roleIds)}, data => {
                            if (data.code === 0) {
                                layer.msg(data.data, constants.SUCCESS);
                                layer.close(i);
                            }
                        }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                    } else {
                        layer.msg('分配角色不能为空！', constants.LOCK);
                    }
                },
                btn2: (i, l) => layer.close(i)
            });
        }
        if (e === 'edit') {
            layer.open({
                title: '修改管理员',
                type: 2,
                content: ['/system/editadmin.html', 'no'],
                area: ['300px', '260px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        if (k === 'gender') {
                            f.find("input[name='gender'][value=" + d.gender + "]").prop('checked', true);
                        } else {
                            f.find("input[name='" + k + "']").val(d[k]);
                        }
                    }
                },
                end: () => getSession('user', d => o.update(d))
            });
        }
        if (e === 'onoff') {
            let s = d.state;
            const m = r(s ? '停用' : '启用');
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
            content: ['/system/newadmin.html', 'no'],
            area: ['300px', '380px']
        });
    });

    $('#refresh').click(() => t.reload('admin', {where: null}));

    f.on('submit(submit)', d => {
        t.reload('admin', {page: {curr: 1}, where: d.field});
        return false;
    });

    t.on('sort(admin)', o => t.reload('admin', {where: {sort: o.field, sortOrder: o.type}}));
});