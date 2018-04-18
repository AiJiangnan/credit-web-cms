layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'confirm',
        elem: '#confirm',
        height: 'full-70',
        page: true,
        // url: '/agentpay/confirm',
        url: '/role',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'orderNo', title: '申请编号', align: 'center', width: 100},
            {field: 'accountName', title: '账户名', align: 'center', width: 80},
            {field: 'bankName', title: '银行名', align: 'center', width: 80},
            {field: 'accountNumber', title: '银行卡号', align: 'center', width: 120},
            {field: 'agreeAmount', title: '合同金额', align: 'center', width: 100},
            {field: 'amount', title: '放款金额', align: 'center', width: 100},
            {field: 'productType', title: '借款期限', align: 'center', width: 100},
            {field: 'applyTime', title: '进件时间', align: 'center', width: 140},
            {field: 'approveTime', title: '审核时间', align: 'center', width: 140},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(confirm)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:5em;"><b>姓　　名：</b></td>
                        <td>${d.accountName}</td>
                    </tr>
                    <tr>
                        <td><b>手机号码：</b></td>
                        <td>${d.phone}</td>
                    </tr>
                    <tr>
                        <td><b>身份证号：</b></td>
                        <td>${d.idcard}</td>
                    </tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('confirm', {where: d.field});
        return false;
    });

    t.on('sort(confirm)', o => t.reload('confirm', {where: {sort: o.field, sortOrder: o.type}}));

    t.on('checkbox(confirm)', o => {
        const d = t.checkStatus('confirm');
        if (d.data.length > 0) {
            $('#rongbao').parent().show('fast');
        } else {
            $('#rongbao').parent().hide('fast');
        }
    });

    $('#rongbao').click(() => {
        const d = t.checkStatus('confirm');
        let applyIds = [];
        d.data.map((e, i) => applyIds.push(e.id));
        /*layer.open({
            title: '分配审核人员',
            type: 2,
            content: '/approve/admin.html',
            area: ['300px', '400px'],
            btn: ['确认', '取消'],
            yes: (i, l) => {
                let f = layer.getChildFrame('form', i);
                const userId = f.find(':checked').val();
                if (!userId) {
                    layer.msg('没有选择信审专员！', {icon: 5});
                    return;
                }
                $.post('/approve/distribution', {auditUid: userId, applyIds: JSON.stringify(applyIds)}, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, {icon: 1});
                        layer.close(i);
                    }
                    layer.msg(data.msg, {icon: 5});
                    layer.close(i);
                });
            },
            btn2: (i, l) => {
                layer.close(i);
            }
        });*/

        $('#xianfeng').click(() => {

        });
    });
});