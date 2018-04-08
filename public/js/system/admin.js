layui.use(['table'], () => {
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
            // console.log(r);
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
                        layer.msg('管理员<span style="color:red;">删除</span>成功！', {icon: 1});
                        o.del();
                        return;
                    }
                    layer.msg('管理员<span style="color:red;">删除</span>失败！', {icon: 2});
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

    t.on('sort(admin)', obj => {
        t.reload('admin', {where: {sort: obj.field, sortOrder: obj.type}});
    });
});