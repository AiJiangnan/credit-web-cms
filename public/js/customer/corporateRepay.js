layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'corporate',
        elem: '#corporate',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        url: '/customerCare/corporateRepay/list',
        cols: [[
             {type: 'numbers', title: '序号'},
             {field: 'applyNo', title: '申请单号', align: 'center', width: 260},
             {field: 'name', title: '客户姓名', align: 'center', width: 130},
             {field: 'phone', title: '手机号', align: 'center', width: 180},
            {field: 'planTotalAmount', title: '合同金额', align: 'center', width: 180},
            {field: 'repaymentDate', title: '应还款日期', align: 'center', width: 255,templet: d => dateFormat(d.repaymentDate)},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(corporate)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    t.on('tool(corporate)', o => {
        let [e, d] = [o.event, o.data];
        
        if (e === 'corporateRepay') {
            layer.open({
                title: '修改手机号',
                type: 2,
                content: ['/customer/corporateRepayFrom.html', 'no'],
                area: ['400px', '360px'], 
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        if (k === 'applyId') {
                            f.find("input[name='applyId']").val(d[k]);
                        } 
                    }
                },
                end: () => {t.reload('corporate', {page: {curr: 1}, where: d.field});}
            });
        }
    });

    f.on('submit(submit)', d => {
        t.reload('corporate', {page: {curr: 1}, where: d.field});
        return false;
    });

});