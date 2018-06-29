layui.use(['table', 'upload', 'laydate'], () => {
    const [$, t, f, u] = [layui.jquery, layui.table, layui.form, layui.upload];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'todeal',
        elem: '#todeal',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        url: '/agentpay/todeal',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'applyNo', title: '申请单号', align: 'center', width: 100},
            {field: 'repaymentDate', title: '还款日期', align: 'center', width: 100, templet: d => dateFormat(d.repaymentDate)},
            {field: 'repaymentAccountName', title: '还款账户名', align: 'center', width: 100},
            {field: 'repaymentAccount', title: '还款账户', align: 'center', width: 100},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 100},
            {field: 'planTotalAmount', title: '应还总额', align: 'center', width: 100, templet: d => rmbFormat(d.planTotalAmount)},
            {field: 'actualTotalAmount', title: '已还款金额', align: 'center', width: 100, templet: d => rmbFormat(d.actualTotalAmount)},
            {field: 'residualAmount', title: '剩余应还款金额', align: 'center', width: 140, templet: d => rmbFormat(d.residualAmount)},
            {field: 'reduceAmount', title: '减免金额', align: 'center', width: 100, templet: d => rmbFormat(d.reduceAmount)},
            {field: 'actualAmount', title: '实际还额金额', align: 'center', width: 140, templet: d => rmbFormat(d.actualAmount)},
            {field: 'planState', title: '状态', align: 'center', width: 100, templet: d => getStatus(d.planState)},
            {field: 'isPartRepayment', title: '是否部分还款', align: 'center', width: 140, templet: d => d.isPartRepayment ? '是' : '否'},
            {field: 'createUsername', title: '创建人', align: 'center', width: 100},
            {title: '对公还款操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    const todealfn = (state, orderNo, note) => {
        const i = parent.layer.load(0, {shade: 0.1});
        $.post('/agentpay/todeal', {state: state, orderNo: orderNo, note: note}, d => {
            if (d.code === 0) {
                layer.msg(d.data, constants.SUCCESS);
                t.reload('todeal');
            } else {
                layer.msg(d.msg, constants.ERROR);
            }
            parent.layer.close(i);
        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
    };

    t.on('tool(todeal)', o => {
        let [e, d] = [o.event, o.data];
        if (!d.orderNo) {
            layer.msg('没有订单号！', constants.LOCK);
            return;
        }
        check(d);
        if (e === 'success') {
            todealfn(true, d.orderNo, null);
        }
        if (e === 'failure') {
            layer.prompt({title: '请输入失败原因'}, (v, i, e) => {
                if (!v) {
                    layer.msg('失败原因不能为空！', constants.LOCK);
                    return;
                }
                todealfn(false, d.orderNo, v);
                layer.close(i);
            });
        }
    });

    u.render({
        elem: '#alipay',
        url: '/agentpay/todeal/upload/',
        accept: 'file',
        exts: 'xls',
        before: o => {
            layer.load();
        },
        done: res => {
            if (res.code === 0) {
                t.reload('todeal');
                layer.closeAll('loading');
                location = "/agentpay/alipay/export?filename=" + res.data;
            } else {
                layer.msg(res.msg, constants.ERROR);
            }
        }
    });

    f.on('submit(submit)', d => {
        t.reload('todeal', {page: {curr: 1}, where: d.field});
        return false;
    });

    f.on('submit(export)', d => {
        location = '/agentpay/todeal/export?' + $('.layui-form').serialize();
        return false;
    });

    $('#alipay').click(() => {
        return false;
    });

    t.on('sort(todeal)', o => t.reload('todeal', {where: {sort: o.field, sortOrder: o.type}}));

});