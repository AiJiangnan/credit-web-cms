layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'role',
        elem: '#role',
        height: 'full-70',
        page: constants.LAYUIPAGE,
        url: '/role',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'name', title: '角色名称', align: 'center', width: 120},
            {field: 'description', title: '角色描述', align: 'center', width: 200},
            {field: 'enabled', title: '状态', align: 'center', width: 80, sort: true, templet: '#enabled'},
            {title: '操作', width: 350, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(role)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'detail') {
            $.get('/role/users/' + d.id, data => {
                if (data.code === 0) {
                    let res = '<table class="layui-table" lay-skin="nob" style="margin:0;"><tr>';
                    const users = data.data;
                    for (let i = 0, n = users.length; i < n; i++) {
                        res += `<td>${users[i].realname}</td>`;
                        if ((i + 1) % 2 === 0) res += '</tr><tr>';
                    }
                    res += `<tr><td colspan="2">总计：${r(users.length)}</td></tr>`;
                    res += '</table>';
                    alertinfo(res);
                }
            });
        }
        if (e === 'allot') {
            layer.open({
                title: '分配菜单',
                type: 2,
                content: '/system/rolemenu.html?id=' + d.id,
                area: ['300px', '400px'],
                btn: ['确认', '取消'],
                yes: (i, l) => {
                    let f = layer.getChildFrame('form', i);
                    let menuIds = [];
                    f.serializeArray().map((e, i) => menuIds.push(e.value));
                    if (menuIds.length < 1) {
                        layer.msg('分配菜单不能为空！', constants.LOCK);
                        return;
                    }
                    $.post('/role/menu', {roleId: d.id, menuIds: JSON.stringify(menuIds)}, data => {
                        if (data.code === 0) {
                            layer.msg(data.data, constants.SUCCESS);
                            layer.close(i);
                        }
                    }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                },
                btn2: (i, l) => layer.close(i)
            });
        }
        if (e === 'edit') {
            layer.open({
                title: '修改角色',
                type: 2,
                content: ['/system/editrole.html', 'no'],
                area: ['300px', '180px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                },
                end: () => getSession('role', d => o.update(d))
            });
        }
        if (e === 'onoff') {
            let s = d.enabled;
            const m = r(s ? '停用' : '启用');
            layer.confirm(`你确定要${m}该角色！`, constants.WARM, i => {
                $.post('/role', {id: d.id, enabled: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`角色${m}成功！`, constants.SUCCESS);
                        o.update({enabled: !s});
                        return;
                    }
                    layer.msg(`角色${m}失败！`, constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要' + r`删除` + '该角色吗？', constants.WARM, i => {
                $.post('/role/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('角色删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });

    $('#add').click(() => {
        layer.open({
            title: '新建角色',
            type: 2,
            content: ['/system/newrole.html', 'no'],
            area: ['300px', '220px']
        });
    });

    $('#refresh').click(() => t.reload('role', {where: null}));

    f.on('submit(submit)', d => {
        t.reload('role', {page: {curr: 1}, where: d.field});
        return false;
    });

    t.on('sort(role)', o => t.reload('role', {where: {sort: o.field, sortOrder: o.type}}));

});