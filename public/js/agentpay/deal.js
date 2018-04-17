layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'deal',
        elem: '#deal',
        height: 'full-70',
        page: true,
        // url: '/agentpay/deal',
        url: '/role',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'batchNo', title: '批次号', align: 'center', width: 120},
            {field: 'agentpayType', title: '划扣平台', align: 'center', width: 130},
            {field: 'createTime', title: '创建时间', align: 'center', width: 130},
            {field: 'totalNum', title: '总条数', align: 'center', width: 130},
            {field: 'totalAmount', title: '总金额', align: 'center', width: 100},
            {field: 'successNum', title: '成功条数', align: 'center', width: 120},
            {field: 'successAmount', title: '成功金额', align: 'center', width: 130},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(deal)', o => {
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
        t.reload('deal', {where: d.field});
        return false;
    });

    t.on('sort(deal)', o => t.reload('deal', {where: {sort: o.field, sortOrder: o.type}}));

});