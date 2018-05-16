layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'agentpay',
        elem: '#agentpay',
        height: 'full-120',
        page: true,
        url: '/customerCare/agentpay/list',
        cols: [[
             {type: 'numbers', title: '序号'},
             {field: 'accountName', title: '姓名', align: 'center', width: 130},
             {field: 'phone', title: '手机号', align: 'center', width: 130},
             {field: 'idcard', title: '身份证号', align: 'center', width: 180},
            {field: 'accountNumber', title: '卡号', align: 'center', width: 180},
            {field: 'orderNo', title: '订单号', align: 'center', width: 255},
            {field: 'amount', title: '放款金额', align: 'center', width: 130},
            {field: 'dealResult', title: '失败原因', align: 'center', width: 130},
            {field: 'applyTime', title: '申请时间', align: 'center', width: 160,templet: d => dateTimeFormat(d.applyTime)},
            {field: 'approveTime', title: '审核时间', align: 'center', width: 160,templet: d => dateTimeFormat(d.approveTime)},
        ]]
    });

    t.on('tool(agentpay)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('agentpay', {where: d.field});
        return false;
    });


    t.on('sort(agentpay)', o => t.reload('agentpay', {where: {sort: o.field, sortOrder: o.type}}));

});