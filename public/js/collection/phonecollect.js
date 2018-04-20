layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    $.get('/collect/0', d => {
        laytplrender(stateTpl, 'stateView', JSON.parse(d.data));
        f.render('select');
    });

    t.render({
        id: 'phonecollect',
        elem: '#phonecollect',
        height: 'full-120',
        page: true,
        url: '/collect/phonecollect',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 240, templet: d => `<a href="/collection/detail.html?applyId=${d.applyId}&userId=${d.userId}&applyNo=${d.applyNo}&from=1">${d.applyNo}</a>`},
            {field: 'updateTime', title: '分配时间', align: 'center', width: 100, templet: d => dateFormat(d.updateTime)},
            {field: 'remindTime', title: '提醒日期', align: 'center', width: 100, templet: d => dateFormat(d.remindTime)},
            {field: 'lastCollectTime', title: '最近催收时间', align: 'center', width: 120, templet: d => dateFormat(d.lastCollectTime)},
            {field: 'lastCollectStateRemark', title: '催收状态', align: 'center', width: 110},
            {field: 'contractAmount', title: '合同金额', align: 'center', width: 100, templet: d => rmbFormat(d.contractAmount)},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 120, sort: true, templet: d => dateFormat(d.repaymentPlanDate)},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(phonecollect)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:6em;"><b>客户姓名：</b></td><td>${d.name}</td></tr>
                    <tr><td><b>注册渠道：</b></td><td>${d.signChannel}</td></tr>
                    <tr><td><b>手机号码：</b></td><td>${d.phone}</td></tr>
                    <tr><td><b>身份证号码：</b></td><td>${d.idcard}</td></tr>
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
                    parent.layer.msg('没有该合同还款计划信息！', {icon: 5});
                }
            }).fail(() => layer.msg('服务器错误！', {icon: 5}));

        }
    });

    f.on('submit(submit)', d => {
        t.reload('phonecollect', {where: d.field});
        return false;
    });

    t.on('sort(phonecollect)', o => t.reload('phonecollect', {where: {sort: o.field, sortOrder: o.type}}));

});