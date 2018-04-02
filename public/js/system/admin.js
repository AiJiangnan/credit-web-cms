layui.use(['table'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'admin',
        elem: '#admin',
        height: 'full-70',
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
        ]]
    });

    t.on('tool(admin)', obj => {
        let data = obj.data;
        if (obj.event === 'allot') {
            console.log(data);
        }
    });

    $('#add').click(() => layer.msg('add'));

    $('#edit').click(() => {
        const rows = t.checkStatus('admin');
        if (!rows.isAll) {
            layer.msg('请选择您要修改的行！');
            return;
        }
        layer.alert(JSON.stringify(rows));
    });

    $('#delete').click(() => layer.msg('delete'));

    $('#refresh').click(() => t.reload('admin'));

    // $('#search').click(() => {
    //     layer.open({
    //         type: 1,
    //         id: 's',
    //         title: '查询栏',
    //         offset: ['60px', '160px'],
    //         content: $('#menu'),
    //         btn: ['查询', '重置'],
    //         btnAlign: 'c',
    //         shade: 0,
    //         yes: function () {
    //             layer.closeAll();
    //         }
    //     });
    // });

    f.on('submit(submit)', d => {
        t.reload('admin', {where: d.field});
        return false;
    });

});