layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#dater', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#datea', range: true, format: constants.DATE_RANGE});

    let total = 0;

    $.get('/collect/overdue?total=total', data => {
        let d = data.data[0];
        total = d.recordTotalRate;
        $('#total').html(`<td style="width:100px;">总数</td><td style="width:80px;">${d.total}</td>
                            <td style="width:80px;">${rmbFormat(d.contractAmount)}</td>
                            <td style="width:80px;">${rmbFormat(d.recordContractAmount)}</td>
                            <td style="width:80px;">${rmbFormat(d.recordContractAmount / d.contractAmount * 100) + '%'}</td>
                            <td style="width:80px;">${rmbFormat(d.recordTotalAmount)}</td>
                            <td style="width:80px;">${rmbFormat(d.recordTotalRate) + '%'}</td>
                            <td style="width:80px;">${d.todayTotal}</td>
                            <td style="width:80px;">${d.todayRecordTotal}</td>`);
    });

    t.render({
        id: 'overdue',
        elem: '#overdue',
        height: 'full-130',
        page: false,
        url: '/collect/overdue',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'collectUser', title: '姓名', align: 'center', width: 100, templet: d => d.recordTotalRate < total ? r(d.collectUser) : d.collectUser},
            {field: 'total', title: '分案户数', align: 'center', width: 100},
            {field: 'contractAmount', title: '分案金额', align: 'center', width: 120, templet: d => rmbFormat(d.contractAmount)},
            {field: 'recordContractAmount', title: '回收本息', align: 'center', width: 120, templet: d => rmbFormat(d.recordContractAmount)},
            {field: '', title: '本息回款率', align: 'center', width: 120, templet: d => rmbFormat(d.recordContractAmount / d.contractAmount * 100) + '%'},
            {field: 'recordTotalAmount', title: '回收总金额', align: 'center', width: 120, templet: d => rmbFormat(d.recordTotalAmount)},
            {field: 'recordTotalRate', title: '总回款率', align: 'center', width: 100, templet: d => rmbFormat(d.recordTotalRate) + '%'},
            {field: 'todayTotal', title: '今日分案户', align: 'center', width: 120},
            {field: 'todayRecordTotal', title: '今日回收户', align: 'center', width: 120},
        ]]
    });

    f.on('submit(submit)', form => {
        $.get('/collect/overdue?total=total', form.field, data => {
            let d = data.data[0];
            total = d.recordTotalRate;
            $('#total').html(`<td style="width:100px;">总数</td><td style="width:80px;">${d.total}</td>
                            <td style="width:80px;">${rmbFormat(d.contractAmount)}</td>
                            <td style="width:80px;">${rmbFormat(d.recordContractAmount)}</td>
                            <td style="width:80px;">${rmbFormat(d.recordContractAmount / d.contractAmount * 100) + '%'}</td>
                            <td style="width:80px;">${rmbFormat(d.recordTotalAmount)}</td>
                            <td style="width:80px;">${rmbFormat(d.recordTotalRate) + '%'}</td>
                            <td style="width:80px;">${d.todayTotal}</td>
                            <td style="width:80px;">${d.todayRecordTotal}</td>`);
            t.reload('overdue', {where: form.field});
        });
        return false;
    });
});