layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'admin',
        elem: '#admin',
        height: 'full-70',
        page: true,
        url: '/user',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'username', title: '用户名', align: 'center', width: 100},
            {field: 'realname', title: '姓名', align: 'center', width: 120},
            {field: 'gender', title: '性别', align: 'center', width: 80, templet: '#gender'},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'state', title: '状态', align: 'center', width: 80, align: 'center', sort: true, templet: '#state'},
            {title: '操作', width: 300, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(admin)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'allot') {
            layer.open({
                title: '分配角色',
                type: 2,
                content: '/system/adminrole.html',
                area: ['220px', '300px'],
                btn: ['确认', '取消'],
                success: (l, i) => {
                    // 把userId放到子页面的form上
                    let f = layer.getChildFrame('form', i);
                    f.attr('data-id', d.id);
                },
                yes: (i, l) => {
                    let f = layer.getChildFrame('form', i);
                    let roleIds = [];
                    f.find(':checked').map((i, e) => roleIds.push($(e).val()));
                    if (roleIds.length < 1) {
                        layer.msg('分配角色不能为空！', {icon: 5});
                        return;
                    }
                    $.post('/user/role', {userId: d.id, roleIds: JSON.stringify(roleIds)}, data => {
                        if (data.code === 0) {
                            layer.msg(data.data, {icon: 1});
                            layer.close(i);
                        }
                    });
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
                content: ['/system/editadmin.html', 'no'],
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
            layer.confirm(`你确定要${m}该管理员！`, {icon: 0}, i => {
                $.post('/user', {id: d.id, state: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`管理员${m}成功！`, {icon: 1});
                        o.update({state: !s});
                        return;
                    }
                    layer.msg(`管理员${m}失败！`, {icon: 2});
                });
                layer.close(i);
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要<span style="color:red;">删除</span>该管理员吗？', {icon: 5}, i => {
                $.post('/user/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, {icon: 1});
                        o.del();
                        return;
                    }
                    layer.msg('管理员删除失败！', {icon: 2});
                });
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

    $('#refresh').click(() => t.reload('admin'));

    f.on('submit(submit)', d => {
        t.reload('admin', {where: d.field});
        return false;
    });

    t.on('sort(admin)', o => t.reload('admin', {where: {sort: o.field, sortOrder: o.type}}));
});