layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#dater', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#datea', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'overdue',
        elem: '#overdue',
        height: 'full-120',
        page: false,
        url: '/collect/overdue',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'collectUser', title: '姓名', align: 'center', width: 100},
            {field: 'total', title: '分案户数', align: 'center', width: 100},
            {field: 'contractAmount', title: '分案金额', align: 'center', width: 100, templet: d => rmbFormat(d.contractAmount)},
            {field: 'recordContractAmount', title: '回收本息', align: 'center', width: 100, templet: d => rmbFormat(d.recordContractAmount)},
            {field: '', title: '本息回款率', align: 'center', width: 120, templet: d => d.recordContractAmount / d.contractAmount},
            {field: 'recordTotalAmount', title: '回收总金额', align: 'center', width: 120, templet: d => rmbFormat(d.recordTotalAmount)},
            {field: 'recordTotalRate', title: '总回款率', align: 'center', width: 100},
            {field: 'todayTotal', title: '今日分案户', align: 'center', width: 120},
            {field: 'todayRecordTotal', title: '今日回收户', align: 'center', width: 120},
        ]]
    })
});