layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'verificationCode',
        elem: '#verificationCode',
        height: 'full-120',
        page: true,
        url: '/customerCare/verificationCode/list',
        cols: [[
             {type: 'numbers', title: '序号'},
            {field: 'mobile', title: '手机号', align: 'center', width: 160},
            {field: 'status', title: '发送状态', align: 'center', width: 300},
            {field: 'statusDesc', title: '状态详情', align: 'center', width: 300},
            {field: 'notifyTime', title: '发送时间', align: 'center', width: 300,templet: d => dateTimeFormat(d.createTime)},
        ]]
    });

    t.on('tool(verificationCode)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('verificationCode', {where: d.field});
        return false;
    });


    t.on('sort(verificationCode)', o => t.reload('verificationCode', {where: {sort: o.field, sortOrder: o.type}}));

});