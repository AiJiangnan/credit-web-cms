layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    t.render({
        id: 'appUser',
        elem: '#appUser',
        height: 'full-120',
        page: true,
        url: '/customerCare/appUser/list',
        cols: [[
             {type: 'numbers', title: '序号'},
            {field: 'username', title: '账号', align: 'center', width: 160},
            {field: 'realName', title: '真实姓名', align: 'center', width: 110},
            {field: 'idcard', title: '身份证号', align: 'center', width: 230},
            {field: 'enabled', title: '状态', align: 'center', width: 230, templet: '#enabled'},
            {field: 'createDate', title: '注册时间', align: 'center',width: 230,templet: d => dateTimeFormat(d.createDate)},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(appUser)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'onoff') {
            let s = d.enabled;
            const m = '<span style="color:red;">' + (s ? '禁用' : '启用') + '</span>';
            layer.confirm(`你确定要${m}该用户员！`, constants.WARM, i => {
                $.post('/customerCare/appUser/disable/'+d.id, {userId: d.id, enabled: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`管理员${m}成功！`, constants.SUCCESS);
                        o.update({enabled: !s});
                        return;
                    }
                    layer.msg(`管理员${m}失败！`, constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });
    
    
    f.on('submit(submit)', d => {
        t.reload('appUser', {page: {curr: 1}, where: d.field});
        return false;
    });


    t.on('sort(appUser)', o => t.reload('appUser', {where: {sort: o.field, sortOrder: o.type}}));

});