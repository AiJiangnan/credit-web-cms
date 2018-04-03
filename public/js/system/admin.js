layui.use(['table'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'admin',
        elem: '#admin',
        height: 'full-70',
        page: true,
        url: '/user',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'username', title: '用户名', align: 'center', width: 80},
            {field: 'realname', title: '姓名', align: 'center', width: 120},
            {field: 'gender', title: '性别', align: 'center', width: 80, templet: d => d.gender ? '<i class="layui-icon">&#xe662;</i>' : '<i class="layui-icon">&#xe661;</i>'},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'state', title: '状态', align: 'center', width: 80, align: 'center', sort: true, templet: d => d.state ? '启用' : '<span style="color:red">禁用</span>'},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(admin)', obj => {
        let data = obj.data;
        if (obj.event === 'allot') {
            console.log(data);
        }
    });

    t.on('sort(admin)', obj => {
        t.reload('admin', {where: {sort: obj.field, sortOrder: obj.type}});
    });

    $('#add').click(() => {
        parent.layer.open({
            title: '新建管理员',
            type: 2,
            content: ['/system/newadmin.html', 'no'],
            area: ['300px', '380px'],
            end: () => t.reload('admin')
        });
    });

    $('#edit').click(() => {
        let rows = t.checkStatus('admin');
        if (rows.data.length === 0) {
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