layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#dater', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#datea', range: true, format: constants.DATE_RANGE});


    t.render({
        id: 'overdue',
        elem: '#overdue',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        // url: '/collect/overdue',
        cols: [[
            {field: 'name', title: '姓名', align: 'center', width: 80},
            {field: 'accounts', title: '分案户数', align: 'center', width: 100},
            {field: 'splitamount', title: '分案金额', align: 'center', width: 100},
            {field: 'recovery', title: '回收本息', align: 'center', width: 100},
            {field: 'paybackrate', title: '本息回款率', align: 'center', width: 120},
            {field: 'totalrecovered', title: '回收总金额', align: 'center', width: 120},
            {field: 'overduefee', title: '回收逾期费', align: 'center', width: 120},
            {field: 'totalpaybackrate', title: '总回款率', align: 'center', width: 100},
            {field: 'ranking ', title: '排名', align: 'center', width: 80, sort: true},
            {field: 'dayaccounts', title: '今日分案户', align: 'center', width: 120},
            {field: 'dayrecover', title: '今日回收户', align: 'center', width: 120},
        ]]
    })
});