layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    $.get('/userrole', d => {
        d.data.map((e, i) => {
            if (e === 'CSZG')
                $('#btn').append('<button class="layui-btn layui-btn-primary layui-btn-sm" lay-submit lay-filter="export" title="导出"><i class="layui-icon">&#xe61e;</i></button>');
        });
    });

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'record',
        elem: '#record',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        url: '/collect/record',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'updateTime', title: '实际还款时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.updateTime)},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 100},
            {field: 'collectUser', title: '催收人员', align: 'center', width: 100},
            {field: 'payTime', title: '放款时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.payTime)},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 120, templet: d => dateFormat(d.repaymentPlanDate)},
            {field: 'actualTotalAmount', title: '实还金额', align: 'center', width: 100, templet: d => rmbFormat(d.actualTotalAmount)},
            {field: 'payState', title: '部分还款', align: 'center', width: 100, templet: d => d.payState ? '是' : '否'},
            {field: 'type', title: '还款状态', align: 'center', width: 100, templet: d => getStatus(d.type)},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(record)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:6em;"><b>客户姓名：</b></td><td>${d.name}</td></tr>
                    <tr><td><b>手机号码：</b></td><td>${d.phone}</td></tr>
                    <tr><td><b>身份证号码：</b></td><td>${d.idcard}</td></tr>
                </table>`);
        }
        if (e === 'collectinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:5em;"><b>合同金额：</b></td><td>${d.contractAmount}</td></tr>
                    <tr><td><b>期数：</b></td><td>${getProductType(d.productType)}</td></tr>
                    <tr><td><b>订单号：</b></td><td>${d.orderNo}</td></tr>
                    <tr><td><b>逾期费：</b></td><td>${rmbFormat(d.totalInterestPenalty)}</td></tr>
                    <tr><td><b>是否减免：</b></td><td>${d.reduceAmount > 0 ? '是' : '否'}</td></tr>
                    <tr><td><b>减免金额：</b></td><td>${rmbFormat(d.reduceAmount)}</td></tr>
                    <tr><td><b>划扣平台：</b></td><td>${getStatus(d.payOrgType)}</td></tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('record', {page: {curr: 1}, where: d.field});
        return false;
    });

    f.on('submit(export)', d => {
        location = `/collect/record/export?${$('.layui-form').serialize()}`;
        return false;
    });

    t.on('sort(record)', o => t.reload('record', {where: {sort: o.field, sortOrder: o.type}}));

});