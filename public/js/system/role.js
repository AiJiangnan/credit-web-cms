layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'role',
        elem: '#role',
        height: 'full-70',
        page: true,
        url: '/role.json',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'code', title: '编号', width: 80},
            {field: 'name', title: '角色名称', width: 120},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(role)', obj => {
        let data = obj.data;
        if (obj.event === 'allot') {
            console.log(data);
        }
    });

    $('#add').click(() => layer.msg('add'));

    $('#edit').click(() => {
        const rows = t.checkStatus('role');
        if (!rows.isAll) {
            layer.msg('请选择您要修改的行！');
            return;
        }
        layer.alert(JSON.stringify(rows));
    });

    $('#delete').click(() => layer.msg('delete'));

    $('#refresh').click(() => {
        t.reload('role');
    });

    f.on('submit(submit)', d => {
        t.reload('role', {where: d.field});
        return false;
    });

});