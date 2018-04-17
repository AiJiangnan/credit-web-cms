layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'record',
        elem: '#record',
        height: 'full-110',
        page: true,
        url: '/collect/record',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'updateTime', title: '实际还款时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.updateTime)},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 100},
            {field: 'collectUser', title: '催收人员', align: 'center', width: 100},
            {field: 'payTime', title: '放款时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.payTime)},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 130, templet: d => dateFormat(d.repaymentPlanDate)},
            {field: 'actualTotalAmount', title: '实还金额', align: 'center', width: 120},
            {field: 'payState', title: '划扣状态', align: 'center', width: 120},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(record)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:6em;"><b>客户姓名：</b></td>
                        <td>${d.name}</td>
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
        if (e === 'collectinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:5em;"><b>合同金额：</b></td>
                        <td>${d.contractAmount}</td>
                    </tr>
                    <tr>
                        <td><b>期数：</b></td>
                        <td>${d.totalPeriod}</td>
                    </tr>
                    <tr>
                        <td><b>订单号：</b></td>
                        <td>${d.orderNo}</td>
                    </tr>
                    <tr>
                        <td><b>逾期费：</b></td>
                        <td>${d.totalInterestPenalty}</td>
                    </tr>
                    <tr>
                        <td><b>是否减免：</b></td>
                        <td>${d.reduceAmount}</td>
                    </tr>
                    <tr>
                        <td><b>减免金额：</b></td>
                        <td>${d.reduceAmount}</td>
                    </tr>
                    <tr>
                        <td><b>划扣平台：</b></td>
                        <td>${d.payOrgType}</td>
                    </tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('record', {where: d.field});
        return false;
    });

    t.on('sort(record)', o => t.reload('record', {where: {sort: o.field, sortOrder: o.type}}));

});