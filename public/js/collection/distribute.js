layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    laytplrender(sourceTypeTpl, 'sourceTypeView', getSession('channel'));
    f.render('select');

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    $.get('/collect/0', d => {
        laytplrender(stateTpl, 'stateView', JSON.parse(d.data));
        f.render('select');
    });

    t.render({
        id: 'distribute',
        elem: '#distribute',
        height: 'full-180',
        page: constants.LAYUIPAGE,
        url: '/collect',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'collectUser', title: '催收人员', align: 'center', width: 100, templet: '#collectUser'},
            {field: 'collectWay', title: '分配状态', align: 'center', width: 100, sort: true, templet: '#collectWay'},
            {field: 'updateTime', title: '分配日期', align: 'center', width: 120, sort: true, templet: d => dateFormat(d.updateTime)},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 120, templet: d => `<a href="/collection/detail.html?applyId=${d.applyId}&userId=${d.userId}&applyNo=${d.applyNo}&from=0">${d.applyNo}</a>`},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'contractAmount', title: '合同金额', align: 'center', width: 100, templet: d => rmbFormat(d.contractAmount)},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 120, sort: true, templet: d => dateFormat(d.repaymentPlanDate)},
            {field: 'lastCollectStateRemark', title: '最近催收状态', align: 'center', width: 120},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(distribute)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:6em;"><b>客户姓名：</b></td><td>${d.name}</td></tr>
                    <tr><td><b>注册渠道：</b></td><td>${getChannel(d.signChannel)}</td></tr>
                    <tr><td><b>手机号码：</b></td><td>${d.phone}</td></tr>
                    <tr><td><b>身份证号码：</b></td><td>${d.idcard}</td></tr>
                </table>`);
        }
        if (e === 'repayinfo') {
            $.get('/repayment/' + d.applyId, p => {
                if (p.code === 0) {
                    let repay = p.data;
                    check(repay);
                    alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                        <tr><td style="width:8em;"><b>客户姓名：</b></td><td>${d.name}</td></tr>
                        <tr><td><b>进件渠道：</b></td><td>${getStatus(d.sdChannel)}</td></tr>
                        <tr><td><b>违约天数：</b></td><td>${repay.overdueDays}</td></tr>
                        <tr><td><b>逾期费：</b></td><td>${rmbFormat(repay.totalInterestPenalty)}</td></tr>
                        <tr><td><b>应还总额：</b></td><td>${rmbFormat(repay.planTotalAmount)}</td></tr>
                        <tr><td><b>已还款金额：</b></td><td>${rmbFormat(repay.actualTotalAmount)}</td></tr>
                        <tr><td><b>已减免金额：</b></td><td>${rmbFormat(repay.reduceAmount)}</td></tr>
                        <tr><td><b>剩余应还款金额：</b></td><td>${rmbFormat(repay.planTotalAmount - repay.actualTotalAmount - repay.reduceAmount)}</td></tr>
                        <tr><td><b>还款状态：</b></td><td>${getStatus(repay.state)}</td></tr>
                    </table>`);
                } else {
                    parent.layer.msg('没有该合同还款计划信息！', constants.FAIL);
                }
            }).fail(() => layer.msg('服务器错误！', constants.FAIL));

        }
    });

    f.on('submit(export)', d => {
        location = '/collect/export?' + $('.layui-form').serialize();
        return false;
    });

    f.on('submit(submit)', d => {
        t.reload('distribute', {page: {curr: 1}, where: d.field});
        $('#allot').parent().hide('fast');
        return false;
    });

    t.on('sort(distribute)', o => {
        t.reload('distribute', {where: {sort: o.field, sortOrder: o.type}});
        $('#allot').parent().hide('fast');
    });

    t.on('checkbox(distribute)', o => {
        const d = t.checkStatus('distribute');
        if (d.data.length > 0) {
            $('#allot').parent().show('fast');
        } else {
            $('#allot').parent().hide('fast');
        }
    });

    $('#allot').click(() => {
        const d = t.checkStatus('distribute');
        let applyIds = [];
        d.data.map((e, i) => applyIds.push(e.applyId));
        if (applyIds.length < 1) return;
        layer.open({
            title: '分配审核人员',
            type: 2,
            content: '/collection/admin.html',
            area: ['400px', '400px'],
            btn: ['确认', '取消'],
            yes: (i, l) => {
                let f = layer.getChildFrame('form', i);
                const userId = f.find(':checked').val();
                const userName = f.find(':checked').attr('title');
                if (!userId) {
                    layer.msg('没有选择催收人员！', constants.LOCK);
                    return;
                }
                $.post('/collect/phoneallot', {collectUserId: userId, collectUserName: userName, applyIds: JSON.stringify(applyIds)}, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        t.reload('distribute');
                    } else {
                        layer.msg("分配失败！", constants.ERROR);
                    }
                    $('#allot').parent().hide('fast');
                    layer.close(i);
                }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            },
            btn2: (i, l) => layer.close(i)
        });
    });

    $('#company').click(() => {
        layer.open({
            title: '分配外包催收',
            type: 2,
            content: '/collection/com.html',
            area: ['600px', '450px'],
            btn: ['确认', '取消'],
            yes: (i, l) => {
                let f = layer.getChildFrame('form', i);
                const companyIds = f.find(':checked');
                const planDate = f.find(':text').val();
                if (!planDate) {
                    layer.msg('没有选择应还款日期！', constants.LOCK);
                    return;
                }
                if (companyIds.length < 1) {
                    layer.msg('没有选择外包公司！', constants.LOCK);
                    return;
                }
                let company = [];
                companyIds.map((i, e) => company.push($(e).val()));
                $.post('/collect/companyallot', {planDate: planDate, companyIds: JSON.stringify(company)}, data => {
                    if (data.code === 0 || data.code === 3) {
                        layer.msg(data.data, constants.SUCCESS);
                        if (data.code === 0) {
                            t.reload('distribute');
                        }
                    } else {
                        layer.msg(data.msg, constants.ERROR);
                    }
                    $('#allot').parent().hide('fast');
                    layer.close(i);
                }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            },
            btn2: (i, l) => layer.close(i)
        });
    });

    $('.morebtn').click(() => {
        if ($('.morebtn').hasClass('in')) {
            $('#more').hide('slow');
            $('#more').children().children(':text').map((i, e) => $(e).val(''));
            $('.morebtn').removeClass('in');
            $('.morebtn').children().html('&#xe61a;');
        } else {
            $('#more').show('slow');
            $('.morebtn').addClass('in');
            $('.morebtn').children().html('&#xe619;');
        }
    });
});