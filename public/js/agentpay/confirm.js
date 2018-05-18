layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'confirm',
        elem: '#confirm',
        height: 'full-80',
        page: constants.LAYUIPAGE,
        url: '/agentpay/confirm',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'orderNo', title: '申请编号', align: 'center', width: 100},
            {field: 'accountName', title: '账户名', align: 'center', width: 80},
            {field: 'bankName', title: '银行名', align: 'center', width: 100},
            {field: 'accountNumber', title: '银行卡号', align: 'center', width: 100},
            {field: 'agreeAmount', title: '合同金额', align: 'center', width: 100, templet: d => rmbFormat(d.agreeAmount)},
            {field: 'amount', title: '放款金额', align: 'center', width: 100, templet: d => rmbFormat(d.amount)},
            {field: 'productType', title: '借款期限', align: 'center', width: 100, templet: d => getProductType(d.productType)},
            {field: 'applyTime', title: '进件时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.applyTime)},
            {field: 'approveTime', title: '审核时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.approveTime)},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(confirm)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:5em;"><b>姓　　名：</b></td><td>${d.accountName}</td></tr>
                    <tr><td><b>手机号码：</b></td><td>${d.phone}</td></tr>
                    <tr><td><b>身份证号：</b></td><td>${d.idcard}</td></tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('confirm', {page: {curr: 1}, where: d.field});
        $('#rongbao').parent().hide('fast');
        return false;
    });

    t.on('sort(confirm)', o => {
        t.reload('confirm', {where: {sort: o.field, sortOrder: o.type}})
        $('#rongbao').parent().hide('fast');
    });

    t.on('checkbox(confirm)', o => {
        const d = t.checkStatus('confirm');
        if (d.data.length > 0) {
            $('#rongbao').parent().show('fast');
        } else {
            $('#rongbao').parent().hide('fast');
        }
    });

    const createBatch = agentpayType => {
        const d = t.checkStatus('confirm');
        let total = 0;
        let applyIds = [];
        d.data.map((e, i) => {
            applyIds.push(e.applyId);
            total = total + e.agreeAmount;
        });
        if (applyIds.length < 1) return;
        layer.confirm(`当前共选择 ${applyIds.length} 条数据，共 ${total} 元，是否继续？`, i => {
            $.post('/agentpay/confirm', {agentpayType: agentpayType, applyIds: JSON.stringify(applyIds)}, data => {
                if (data.code === 0) {
                    layer.msg(data.data, {icon: 1});
                    t.reload('confirm');
                } else {
                    layer.msg(data.msg, {icon: 5});
                }
            }).fail(() => layer.msg('服务器错误！', {icon: 5}));
            $('#rongbao').parent().hide('fast');
            layer.close(i);
        });
    };

    $('#rongbao').click(() => createBatch('REAPAL'));
    $('#xianfeng').click(() => createBatch('UCF'));
});
