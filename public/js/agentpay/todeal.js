layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'todeal',
        elem: '#todeal',
        height: 'full-110',
        page: true,
        url: '/agentpay/todeal',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'applyNo', title: '申请单号', align: 'center', width: 100},
            {field: 'repaymentDate', title: '还款日期', align: 'center', width: 130},
            {field: 'repaymentAccountName', title: '还款账户名', align: 'center', width: 100},
            {field: 'repaymentAccount', title: '还款账户', align: 'center', width: 100},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 100},
            {field: 'planTotalAmount', title: '应还总额', align: 'center', width: 100},
            {field: 'actualTotalAmount', title: '已还款金额', align: 'center', width: 100},
            {field: 'residualAmount', title: '剩余应还款金额', align: 'center', width: 140},
            {field: 'reduceAmount', title: '减免金额', align: 'center', width: 100},
            {field: 'actualAmount', title: '实际还额金额', align: 'center', width: 100},
            {field: 'planState', title: '是否逾期', align: 'center', width: 100},
            {field: 'isPartRepayment', title: '是否部分还款', align: 'center', width: 140},
            {title: '对公还款操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(todeal)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:6em;"><b>客户姓名：</b></td>
                        <td>${d.name}</td>
                    </tr>
                    <tr>
                        <td><b>注册渠道：</b></td>
                        <td>${d.signChannel}</td>
                    </tr>
                    <tr>
                        <td><b>手机号码：</b></td>
                        <td>${d.phone}</td>
                    </tr>
                    <tr>
                        <td><b>身份证号码：</b></td>
                        <td>${d.idcard}</td>
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
        t.reload('todeal', {where: d.field});
        return false;
    });

    t.on('sort(todeal)', o => t.reload('todeal', {where: {sort: o.field, sortOrder: o.type}}));

});