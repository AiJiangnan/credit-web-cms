layui.use('table', () => {
    const [$, table] = [layui.jquery, layui.table];

    table.render({
        id: 'admin',
        elem: '#admin',
        height: 'full-20',
        page: true,
        url: '/admin.json',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'username', title: '用户名', width: 80},
            {field: 'realname', title: '姓名', width: 80},
            {field: 'phone', title: '手机号码', width: 120},
            {field: 'address', title: '地址', width: 80},
            {field: 'isAdmin', title: '是否为管理员', width: 130, align: 'center', sort: true, templet: d => d.isAdmin ? '否' : '是'},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]],
        toolbar: '#toolbar'
    });

    table.on('tool(admin)', obj => {
        let data = obj.data;
        if (obj.event === 'allot') {
            console.log(data);
        }
    });

    $('#add').click(() => {
        alert('add');
    });

    $('#edit').click(() => {
        const rows = table.checkStatus('admin');
        if (!rows.isAll) {
            layer.msg('请选择您要修改的行！');
            return;
        }
        layer.alert(JSON.stringify(rows));
    });

    $('#delete').click(() => {
        alert('delete');
    });

    $('#refresh').click(() => {
        table.reload('admin');
    });

});