layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'deal',
        elem: '#deal',
        height: 'full-70',
        page: true,
        url: '/agentpay/deal',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'batchNo', title: '批次号', align: 'center', width: 160},
            {field: 'agentpayType', title: '划扣平台', align: 'center', width: 100, templet: d => getStatus(d.agentpayType)},
            {field: 'createTime', title: '创建时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.createTime)},
            {field: 'totalNum', title: '总条数', align: 'center', width: 80},
            {field: 'totalAmount', title: '总金额', align: 'center', width: 80},
            {field: 'successNum', title: '成功条数', align: 'center', width: 100},
            {field: 'successAmount', title: '成功金额', align: 'center', width: 100},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(deal)', o => {
        let [e, d] = [o.event, o.data];
    });

    f.on('submit(submit)', d => {
        t.reload('deal', {where: d.field});
        return false;
    });

    t.on('sort(deal)', o => t.reload('deal', {where: {sort: o.field, sortOrder: o.type}}));

});