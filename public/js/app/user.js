layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    t.render({
        id: 'appUser',
        elem: '#appUser',
        height: 'full-120',
        page: true,
        url: '/app/user/list',
        cols: [[
             {type: 'numbers', title: '序号'},
            {field: 'username', title: '账号', align: 'center', width: 160},
            {field: 'realName', title: '真实姓名', align: 'center', width: 110},
            {field: 'idcard', title: '身份证号', align: 'center', width: 230},
            {field: 'inviteCode', title: '推荐码', align: 'center', width: 110},
            {field: 'sourceType', title: '注册来源', align: 'center', width: 230},
            {field: 'createDate', title: '注册时间', align: 'center',width: 230,templet: d => dateTimeFormat(d.createDate)},
        ]]
    });

    t.on('tool(appUser)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('appUser', {where: d.field});
        return false;
    });


    t.on('sort(appUser)', o => t.reload('appUser', {where: {sort: o.field, sortOrder: o.type}}));

});