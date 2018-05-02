layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    $.get('/collect/companylist', d => {
        laytplrender(stateTpl, 'stateView', d.data);
        f.render('select');
    });

    t.render({
        id: 'companycollect',
        elem: '#companycollect',
        height: 'full-110',
        page: true,
        url: '/collect/companycollect',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 260, templet: d => `<a href="/collection/detail.html?applyId=${d.applyId}&userId=${d.userId}&applyNo=${d.applyNo}&from=0">${d.applyNo}</a>`},
            {field: 'collectCompany', title: '催收公司', align: 'center', width: 100},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'contractAmount', title: '合同金额', align: 'center', width: 100, templet: d => rmbFormat(d.contractAmount)},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 120, sort: true, templet: d => dateFormat(d.repaymentPlanDate)},
            {title: '操作', width: 220, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(companycollect)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'allotinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:7em;"><b>委案时间：</b></td><td>${dateFormat(d.updateTime)}</td></tr>
                    <tr><td><b>委案逾期天数：</b></td><td>${d.lateDays}</td></tr>
                    <tr><td><b>委案金额：</b></td><td>${rmbFormat(d.planTotalAmount)}</td></tr>
                    <tr><td><b>委托催收金额：</b></td><td>${rmbFormat(d.repaymentAmount)}</td></tr>
                </table>`);
        }
        if (e === 'repayinfo') {
            $.get('/repayment/' + d.applyId, p => {
                if (p.code === 0) {
                    let repay = p.data;
                    check(repay);
                    alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                        <tr><td style="width:8em;"><b>客户姓名：</b></td><td>${d.name}</td></tr>
                        <tr><td><b>进件渠道：</b></td><td>${d.sdChannel}</td></tr>
                        <tr><td><b>违约天数：</b></td><td>${repay.overdueDays}</td></tr>
                        <tr><td><b>逾期费：</b></td><td>${rmbFormat(repay.totalInterestPenalty)}</td></tr>
                        <tr><td><b>应还总额：</b></td><td>${rmbFormat(repay.planTotalAmount)}</td></tr>
                        <tr><td><b>已还款金额：</b></td><td>${rmbFormat(repay.actualTotalAmount)}</td></tr>
                        <tr><td><b>已减免金额：</b></td><td>${rmbFormat(repay.reduceAmount)}</td></tr>
                        <tr><td><b>剩余应还款金额：</b></td><td>${rmbFormat(repay.planTotalAmount - repay.actualTotalAmount - repay.reduceAmount)}</td></tr>
                        <tr><td><b>还款状态：</b></td><td>${getStatus(repay.state)}</td></tr>
                    </table>`);
                } else {
                    parent.layer.msg('没有该合同还款计划信息！', constants.ERROR);
                }
            }).fail(() => layer.msg('服务器错误！', constants.FAIL));
        }
    });

    f.on('submit(submit)', d => {
        t.reload('companycollect', {where: d.field});
        return false;
    });

    f.on('submit(export)', d => {
        location = `/collect/companycollect/export?${$('.layui-form').serialize()}`;
        return false;
    });

    t.on('sort(companycollect)', o => t.reload('companycollect', {where: {sort: o.field, sortOrder: o.type}}));

});