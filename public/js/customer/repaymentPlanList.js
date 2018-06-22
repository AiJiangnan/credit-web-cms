layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'repaymentPlan',
        elem: '#repaymentPlan',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        url: '/customerCare/repaymentPlan/list',
        cols: [[
             {field: 'name', title: '姓名', align: 'center', width: 110},
             {field: 'phone', title: '手机号', align: 'center', width: 130},
             {field: 'idcard', title: '身份证', align: 'center', width: 130},
             {field: 'applyNum', title: '申请单号', align: 'center', width: 230},
             {field: 'status', title: '状态', align: 'center', width: 110, templet: d => getStatus(d.status)},
             {field: 'planDate', title: '应还款日期', align: 'center', width: 130,templet: d => dateFormat(d.planDate)},
             {field: 'applyAmount', title: '本金', align: 'center', width: 110},
             {field: 'interestFee', title: '利息', align: 'center', width: 110},
             {field: 'lateFee', title: '逾期费', align: 'center', width: 110},
             {field: 'productType', title: '贷款期数', align: 'center', width: 130, templet: d => getProductType(d.productType)},
             {field: 'channel', title: '进件渠道', align: 'center', width: 130, templet: d => getStatus(d.channel)},
             {field: 'loanCount', title: '首贷', align: 'center', width: 130, templet: d => d.loanCount>1?'复贷':"首贷"},
           
        ]]
    });

    t.on('tool(repaymentPlan)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    f.on('submit(submit)', d => {
        t.reload('repaymentPlan', {page: {curr: 1}, where: d.field});
        return false;
    });
    
    
    f.on('submit(export)', d => {
        location = '/customerCare/repaymentPlan/export?' + $('.layui-form').serialize();
        return false;
    });


    t.on('sort(repaymentPlan)', o => t.reload('repaymentPlan', {where: {sort: o.field, sortOrder: o.type}}));

});