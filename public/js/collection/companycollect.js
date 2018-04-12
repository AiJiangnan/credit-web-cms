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
            {field: 'applyNo', title: '申请编号', align: 'center', width: 120},
            {field: 'collectCompany', title: '催收公司', align: 'center', width: 100},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 100},
            {field: 'contractAmount', title: '合同金额', align: 'center', width: 130},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 130, sort: true, align: 'center', templet: d => dateFormat(d.repaymentPlanDate)},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(companycollect)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'allotinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:7em;"><b>委案时间：</b></td>
                        <td>${dateFormat(d.updateTime)}</td>
                    </tr>
                    <tr>
                        <td><b>委案逾期天数：</b></td>
                        <td>${d.lateDays}</td>
                    </tr>
                    <tr>
                        <td><b>委案金额：</b></td>
                        <td>${d.contractAmount}</td>
                    </tr>
                    <tr>
                        <td><b>委托催收金额：</b></td>
                        <td>${d.contractAmount + d.totalInterestPenalty}</td>
                    </tr>
                </table>`);
        }
        if (e === 'repayinfo') {
            $.get('/repayment/' + d.applyId, p => {
                if (p.code === 0) {
                    alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:8em;"><b>客户姓名：</b></td>
                        <td>${d.name}</td>
                    </tr>
                    <tr>
                        <td><b>进件渠道：</b></td>
                        <td>${d.sdChannel}</td>
                    </tr>
                    <tr>
                        <td><b>违约天数：</b></td>
                        <td>${p.overdueDays}</td>
                    </tr>
                    <tr>
                        <td><b>逾期费：</b></td>
                        <td>${d.overdueFee}</td>
                    </tr>
                    <tr>
                        <td><b>应还总额：</b></td>
                        <td>${d.planTotalAmount}</td>
                    </tr>
                    <tr>
                        <td><b>已还款金额：</b></td>
                        <td>${d.actualTotalAmount}</td>
                    </tr>
                    <tr>
                        <td><b>剩余应还款金额：</b></td>
                        <td>${d.planTotalAmount - d.actualTotalAmount}</td>
                    </tr>
                    <tr>
                        <td><b>还款状态：</b></td>
                        <td>${d.state}</td>
                    </tr>
                </table>`);
                } else {
                    parent.layer.msg('没有该合同还款计划信息！', {icon: 5});
                }
            });

        }
    });

    f.on('submit(submit)', d => {
        t.reload('companycollect', {where: d.field});
        return false;
    });

    t.on('sort(companycollect)', o => t.reload('companycollect', {where: {sort: o.field, sortOrder: o.type}}));

});