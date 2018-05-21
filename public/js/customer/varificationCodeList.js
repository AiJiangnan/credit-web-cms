layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'verificationCode',
        elem: '#verificationCode',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        url: '/customerCare/verificationCode/list',
        cols: [[
             {type: 'numbers', title: '序号'},
            {field: 'phone', title: '手机号', align: 'center', width: 160},
            {field: 'code', title: '验证码', align: 'center', width: 300},
            {field: 'content', title: '发送内容', align: 'center', width: 300},
            {field: 'createDate', title: '发送时间', align: 'center', width: 300,templet: d => dateTimeFormat(d.createDate)},
        ]]
    });

    t.on('tool(verificationCode)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    f.on('submit(submit)', d => {
        t.reload('verificationCode', {page: {curr: 1}, where: d.field});
        return false;
    });


    t.on('sort(verificationCode)', o => t.reload('verificationCode', {where: {sort: o.field, sortOrder: o.type}}));

});