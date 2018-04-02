layui.use('table', () => {
    const [$, table] = [layui.jquery, layui.table];

    table.render({
        id: 'role',
        elem: '#role',
        height: 'full-20',
        page: true,
        url: '/role.json',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'code', title: '编号', width: 80},
            {field: 'name', title: '角色名称', width: 120},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]],
        toolbar: '#barDemo'
    });

    table.on('tool(role)', obj => {
        let data = obj.data;
        if (obj.event === 'allot') {
            console.log(data);
        }
    });

    $('#add').click(() => {
        alert('add');
    });

    $('#edit').click(() => {
        const rows = table.checkStatus('role');
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
        table.reload('role');
    });

});