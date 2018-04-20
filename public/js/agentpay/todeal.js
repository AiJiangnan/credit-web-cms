layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'todeal',
        elem: '#todeal',
        height: 'full-120',
        page: true,
        url: '/agentpay/todeal',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'applyNo', title: '申请单号', align: 'center', width: 100},
            {field: 'repaymentDate', title: '还款日期', align: 'center', width: 100, templet: d => dateFormat(d.repaymentDate)},
            {field: 'repaymentAccountName', title: '还款账户名', align: 'center', width: 100},
            {field: 'repaymentAccount', title: '还款账户', align: 'center', width: 100},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 100},
            {field: 'planTotalAmount', title: '应还总额', align: 'center', width: 100},
            {field: 'actualTotalAmount', title: '已还款金额', align: 'center', width: 100},
            {field: 'residualAmount', title: '剩余应还款金额', align: 'center', width: 140},
            {field: 'reduceAmount', title: '减免金额', align: 'center', width: 100},
            {field: 'actualAmount', title: '实际还额金额', align: 'center', width: 140},
            {field: 'planState', title: '是否逾期', align: 'center', width: 100},
            {field: 'isPartRepayment', title: '是否部分还款', align: 'center', width: 140},
            {title: '对公还款操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    const todealfn = (state, orderNo) => {
        $.post('/agentpay/todeal', {state: state, orderNo: orderNo}, d => {
            if (d.code === 0) {
                layer.msg(d.data, constants.SUCCESS);
                t.reload('todeal');
            } else {
                layer.msg(d.msg, constants.ERROR);
            }
        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
    };

    t.on('tool(todeal)', o => {
        let [e, d] = [o.event, o.data];
        if (!d.applyNo) {
            layer.msg('没有订单号！', constants.LOCK);
            return;
        }
        check(d);
        if (e === 'success') {
            todealfn(true, d.applyNo);
        }
        if (e === 'failure') {
            todealfn(false, d.applyNo);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('todeal', {where: d.field});
        return false;
    });

    t.on('sort(todeal)', o => t.reload('todeal', {where: {sort: o.field, sortOrder: o.type}}));

});