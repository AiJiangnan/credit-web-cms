layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'role',
        elem: '#role',
        height: 'full-70',
        page: true,
        url: '/role',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'name', title: '角色名称', align: 'center', width: 120},
            {field: 'description', title: '角色描述', align: 'center', width: 200},
            {field: 'enabled', title: '状态', align: 'center', width: 80, sort: true, templet: '#enabled'},
            {title: '操作', width: 300, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(role)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'allot') {
            layer.open({
                title: '分配菜单',
                type: 2,
                content: '/system/rolemenu.html',
                area: ['300px', '400px'],
                btn: ['确认', '取消'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    f.attr('data-id', d.id);
                },
                yes: (i, l) => {
                    let f = layer.getChildFrame('form', i);
                    let menuIds = [];
                    f.find(':checked').map((i, e) => menuIds.push($(e).val()));
                    if (menuIds.length < 1) {
                        layer.msg('分配菜单不能为空！', {icon: 5});
                        return;
                    }
                    $.post('/role/menu', {roleId: d.id, menuIds: JSON.stringify(menuIds)}, data => {
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
                title: '修改角色',
                type: 2,
                content: ['/system/editrole.html', 'no'],
                area: ['300px', '220px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                    f.find("input[name='enabledbox']").attr('checked', d.enabled);
                },
                end: () => {
                    if (sessionStorage.getItem('role')) {
                        let u = JSON.parse(sessionStorage.getItem('role'));
                        u.enabled = (u.enabled === 'true');
                        o.update(u);
                        sessionStorage.removeItem('role');
                    }
                }
            });
        }
        if (e === 'onoff') {
            let s = d.enabled;
            const m = '<span style="color:red;">' + (s ? '停用' : '启用') + '</span>';
            layer.confirm(`你确定要${m}该角色！`, {icon: 0}, i => {
                $.post('/role', {id: d.id, enabled: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`角色${m}成功！`, {icon: 1});
                        o.update({enabled: !s});
                        return;
                    }
                    layer.msg(`角色${m}失败！`, {icon: 2});
                });
                layer.close(i);
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要<span style="color:red;">删除</span>该角色吗？', {icon: 5}, i => {
                $.post('/role/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, {icon: 1});
                        o.del();
                        return;
                    }
                    layer.msg('角色删除失败！', {icon: 2});
                });
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
        t.reload('role', {where: d.field});
        return false;
    });

    t.on('sort(role)', o => t.reload('role', {where: {sort: o.field, sortOrder: o.type}}));

});