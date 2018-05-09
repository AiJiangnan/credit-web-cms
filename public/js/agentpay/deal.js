layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'deal',
        elem: '#deal',
        height: 'full-80',
        page: true,
        url: '/agentpay/deal',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'batchNo', title: '批次号', align: 'center', width: 240, templet: d => `<a href="/agentpay/detail.html?batchId=${d.batchId}">${d.batchNo}</a>`},
            {field: 'agentpayType', title: '划扣平台', align: 'center', width: 100, templet: d => getStatus(d.agentpayType)},
            {field: 'createTime', title: '创建时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.createTime)},
            {field: 'totalNum', title: '总条数', align: 'center', width: 80},
            {field: 'totalAmount', title: '总金额', align: 'center', width: 80, templet: d => rmbFormat(d.totalAmount)},
            {field: 'successNum', title: '成功条数', align: 'center', width: 100},
            {field: 'successAmount', title: '成功金额', align: 'center', width: 100, templet: d => rmbFormat(d.successAmount)},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    const submit = (fn, no) => {
        $.post(`/agentpay/${fn}`, {batchNo: no}, d => {
            if (d.code === 0) {
                layer.msg(d.data, constants.SUCCESS);
                t.reload('deal');
            } else {
                layer.msg(d.msg, constants.ERROR);
            }
        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
    };

    t.on('tool(deal)', o => {
        let [e, d] = [o.event, o.data];
        if (!d.batchNo) {
            layer.msg('没有找到批次号！', constants.LOCK);
            return;
        }
        if (e === 'pay') {
            layer.confirm('你确定放款？', constants.WARM, i => {
                submit(e, d.batchNo);
                layer.close(i);
            });
        } else if (e === 'repay') {
            layer.confirm('你确定再次划扣？', constants.WARM, i => {
                submit(e, d.batchNo);
                layer.close(i);
            });
        } else {
            submit(e, d.batchNo);
        }
    });

    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('deal', {where: d.field});
        return false;
    });

    t.on('sort(deal)', o => t.reload('deal', {where: {sort: o.field, sortOrder: o.type}}));

});