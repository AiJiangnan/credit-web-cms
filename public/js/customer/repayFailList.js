layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'agentpay',
        elem: '#agentpay',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        url: '/customerCare/repayFail/list',
        cols: [[
             {type: 'numbers', title: '序号'},
             {field: 'name', title: '姓名', align: 'center', width: 130},
             {field: 'idcard', title: '身份证号', align: 'center', width: 130},
             {field: 'phone', title: '手机号', align: 'center', width: 130},
             {field: 'applyNo', title: '申请单号', align: 'center', width: 180},
            {field: 'accountNum', title: '还款失败卡号', align: 'center', width: 180},
            {field: 'bankName', title: '银行卡名称', align: 'center', width: 130},
            {field: 'amount', title: '还款金额', align: 'center', width: 130},
            {field: 'orderNo', title: '还款订单号', align: 'center', width: 150},
            {field: 'remark', title: '失败原因', align: 'center', width: 130},
        ]]
    });

    t.on('tool(agentpay)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    f.on('submit(submit)', d => {
        t.reload('agentpay', {page: {curr: 1}, where: d.field});
        return false;
    });


    t.on('sort(agentpay)', o => t.reload('agentpay', {where: {sort: o.field, sortOrder: o.type}}));

});