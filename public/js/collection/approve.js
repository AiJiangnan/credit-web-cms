layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'approve',
        elem: '#approve',
        height: 'full-110',
        page: true,
        url: '/repayment/reduce',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 100},
            {field: 'applyTime', title: '申请时间', align: 'center', width: 100, templet: d => dateFormat(d.applyTime)},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'createUsername', title: '催收人员', align: 'center', width: 100},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 100, templet: d => dateFormat(d.repaymentPlanDate)},
            {field: 'planTotalAmount', title: '应还款金额', align: 'center', width: 100, templet: d => rmbFormat(d.planTotalAmount - d.reduceOverdueFee)},
            {field: 'reduceOverdueFee', title: '减免金额', align: 'center', width: 100, templet: d => rmbFormat(d.reduceOverdueFee)},
            {field: 'planState', title: '还款状态', align: 'center', width: 100, templet: d => getStatus(d.planState)},
            {field: 'applyRemark', title: '申请详情', align: 'center', width: 130},
            {field: 'state', title: '操作', align: 'center', width: 80, templet: d => getStatus(d.state)}
        ]]
    });


    f.on('submit(submit)', d => {
        t.reload('approve', {where: d.field});
        $('#pass').parent().hide('fast');
        return false;
    });

    t.on('sort(approve)', o => {
        t.reload('approve', {where: {sort: o.field, sortOrder: o.type}});
        $('#pass').parent().hide('fast');
    });

    t.on('checkbox(approve)', o => {
        const d = t.checkStatus('approve');
        let v = 0;
        d.data.map((e, i) => {
            if (e.state === 'undo') v++;
        });
        if (v > 0) {
            $('#pass').parent().show('fast');
        } else {
            $('#pass').parent().hide('fast');
        }
    });

    const approve = pass => {
        const m = pass ? '批准' : '驳回';
        const d = t.checkStatus('approve');
        let ids = [];
        d.data.map((e, i) => {
            if (e.state === 'undo') ids.push(e.id);
        });
        if (ids.length < 1) {
            layer.msg('没有选择未审批数据！', constants.LOCK);
            return;
        }
        layer.confirm(`你确认${m}这 ${ids.length} 笔减免申请？`, constants.WARM, i => {
            $.post('/repayment/dealreduce', {reduceIds: JSON.stringify(ids), pass: pass}, d => {
                if (d.code === 0) {
                    layer.msg(d.data, constants.SUCCESS);
                    t.reload('approve');
                } else {
                    layer.msg(d.data.msg, constants.ERROR);
                }
                $('#pass').parent().hide('fast');
                layer.close(i);
            }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
        });
    };

    $('#pass').click(() => approve(true));
    $('#nopass').click(() => approve(false));
});