layui.use(['element', 'table', 'form'], () => {
    const [$, e, t, f] = [layui.jquery, layui.element, layui.table, layui.form];

    const applyId = getQueryStr('applyId');
    const applyNo = getQueryStr('applyNo');
    const userId = getQueryStr('userId');
    const from = getQueryStr('from');

    let partId;

    laytplrender(setTpl, 'setView', from);

    $.get('/info/phonelog/' + userId, d => {
        if (d.code === 0) {
            $('#rate').html(d.data.proportion + '%');
            laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
        }
    });

    $.get('/info/user/' + userId, d => {
        if (d.code === 0) {
            laytplrender(userInfoTpl, 'userInfoView', d.data);
        }
    });

    f.on('submit(submit)', d => {
        $.get('/info/phonelog/' + userId + '?' + $('.layui-form').serialize(), d => {
            if (d.code === 0) {
                $('#rate').html(d.data.proportion + '%');
                laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
            }
        });
        return false;
    });

    t.render({
        id: 'partlog',
        elem: '#partlog',
        url: '/repayment/part/' + applyId,
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'partAmount', title: '本次还款金额', align: 'center', width: 120, templet: d => rmbFormat(d.partAmount)},
            {field: 'currentPlanTotalAmount', title: '应还款总金额', align: 'center', width: 120, templet: d => rmbFormat(d.currentPlanTotalAmount)},
            {field: 'currentActualTotalAmount', title: '已还款金额', align: 'center', width: 110, templet: d => rmbFormat(d.currentActualTotalAmount)},
            {field: 'reduceAmount', title: '减免金额', align: 'center', width: 100, templet: d => rmbFormat(d.reduceAmount)},
            {field: '', title: '剩余应还款金额', align: 'center', width: 140, templet: d => rmbFormat(d.currentPlanTotalAmount - d.currentActualTotalAmount - d.reduceAmount)},
            {field: 'createTime', title: '申请时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.createTime)},
            {field: 'repaymentTime', title: '还款时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.repaymentTime)},
            {field: 'status', title: '还款状态', align: 'center', width: 100, templet: d => getStatus(d.status)}
        ]],
        done: (r, c, count) => {
            r.data.map((e, i) => {
                if (e.status === 'init') {
                    partId = e.id;
                    return;
                }
            });
        }
    });


    $('#repay').click(() => {
        $.get('/repayment/amount', {applyId: applyId}, d => {
            if (d.data == 0) {
                layer.msg('该订单已结清！', constants.HAPPY);
            } else {
                layer.open({
                    title: '划扣',
                    type: 2,
                    content: [`/collection/deal/repay.html?applyId=${applyId}&userId=${userId}`, 'no'],
                    area: ['360px', '260px']
                });
            }
        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
    });

    $('#todeal').click(() => {
        $.get('/repayment/amount', {applyId: applyId}, d => {
            if (d.data == 0) {
                layer.msg('该订单已结清！', constants.HAPPY);
            } else {
                layer.open({
                    title: '对公还款',
                    type: 2,
                    content: [`/collection/deal/todeal.html?applyId=${applyId}&userId=${userId}`, 'no'],
                    area: ['320px', '380px']
                });
            }
        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
    });

    $('#log').click(() => {
        layer.open({
            title: '添加催收记录',
            type: 2,
            content: [`/collection/deal/collectlog.html?applyId=${applyId}`, 'no'],
            area: ['380px', '380px']
        });
    });

    $('#reduce').click(() => {
        layer.open({
            title: '添加减免申请',
            type: 2,
            content: [`/collection/deal/reduce.html?applyId=${applyId}`, 'no'],
            area: ['280px', '200px']
        });
    });

    $('#part').click(() => {
        if (!partId) {
            layer.msg('没有获取到有效部分还款！', constants.LOCK);
            return;
        }
        layer.prompt({title: '部分还款金额'}, (v, i, e) => {
            if (!regex.AMOUNT.test(v)) {
                layer.msg('输入金额有误！', constants.LOCK);
                return;
            }
            $.post('/repayment/part', {id: partId, applyId: applyId, partAmount: v}, d => {
                if (d.code === 0) {
                    t.reload('partlog');
                    layer.msg(d.data, constants.SUCCESS);
                } else {
                    layer.msg(d.msg, constants.ERROR);
                }
            }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            layer.close(i);
        });
    });

    $('#black').click(() => {
        layer.confirm('你确定将该用户加入黑名单？', constants.CONFIRM, ii => {
            layer.prompt({title: '加入黑名单原因'}, (v, i, e) => {
                if (!v || v === '') {
                    layer.msg('原因不能为空！', constants.LOCK);
                    return;
                }
                $.post('/collect/black', {userId: userId, message: v}, d => {
                    if (d.code === 0) {
                        layer.msg(d.data, constants.SUCCESS);
                        layer.close(i);
                    } else {
                        layer.msg(d.msg, constants.ERROR);
                    }
                }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            });
            layer.close(ii);
        });
    });

    e.on('collapse()', d => {
        if (!d.show) return;
        const id = d.title.attr('id');
        if (id === 'c1') {

        }
        if (id === 'c2') {
            t.render({
                id: 'reducelog',
                elem: '#reducelog',
                // url: '/repayment/part/' + applyId,
                cols: [[
                    {type: 'numbers', title: '序号'},
                    {field: '', title: '本次还款金额', align: 'center', width: 120, templet: d => rmbFormat(d.partAmount)},
                    {field: '', title: '应还款总金额', align: 'center', width: 120, templet: d => rmbFormat(d.currentPlanTotalAmount)},
                    {field: '', title: '已还款金额', align: 'center', width: 110, templet: d => rmbFormat(d.currentActualTotalAmount)},
                    {field: '', title: '减免金额', align: 'center', width: 100, templet: d => rmbFormat(d.reduceAmount)},
                    {field: '', title: '剩余应还款金额', align: 'center', width: 140, templet: d => rmbFormat(d.currentPlanTotalAmount - d.currentActualTotalAmount - d.reduceAmount)},
                    {field: '', title: '申请时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.createTime)},
                    {field: '', title: '还款时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.repaymentTime)},
                    {field: '', title: '还款状态', align: 'center', width: 100, templet: d => getStatus(d.status)}
                ]]
            });
        }
        if (id === 'c3') {
            t.reload('partlog');
        }
        if (id === 'c4') {
            t.render({
                id: 'loanlog',
                elem: '#loanlog',
                // url: '/repayment/part/' + applyId,
                cols: [[
                    {type: 'numbers', title: '序号'},
                    {field: '', title: '本次还款金额', align: 'center', width: 120, templet: d => rmbFormat(d.partAmount)},
                    {field: '', title: '应还款总金额', align: 'center', width: 120, templet: d => rmbFormat(d.currentPlanTotalAmount)},
                    {field: '', title: '已还款金额', align: 'center', width: 110, templet: d => rmbFormat(d.currentActualTotalAmount)},
                    {field: '', title: '减免金额', align: 'center', width: 100, templet: d => rmbFormat(d.reduceAmount)},
                    {field: '', title: '剩余应还款金额', align: 'center', width: 140, templet: d => rmbFormat(d.currentPlanTotalAmount - d.currentActualTotalAmount - d.reduceAmount)},
                    {field: '', title: '申请时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.createTime)},
                    {field: '', title: '还款时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.repaymentTime)},
                    {field: '', title: '还款状态', align: 'center', width: 100, templet: d => getStatus(d.status)}
                ]]
            });
        }
        if (id === 'c5') {
            t.render({
                id: 'repayfaillog',
                elem: '#repayfaillog',
                url: '/info/repayfail/' + applyId,
                cols: [[
                    {type: 'numbers', title: '序号'},
                    {field: 'updateTime', title: '还款时间', align: 'center', width: 120, templet: d => dateTimeFormat(d.updateTime)},
                    {field: 'accountNum', title: '还款卡号', align: 'center', width: 120},
                    {field: 'collectUser', title: '催收人员', align: 'center', width: 110},
                    {field: 'capital', title: '实还本金', align: 'center', width: 120, templet: d => rmbFormat(d.capital)},
                    {field: 'interest', title: '实还利息', align: 'center', width: 120, templet: d => rmbFormat(d.interest)},
                    {field: 'totalInterestPenalty', title: '实还逾期费', align: 'center', width: 120, templet: d => rmbFormat(d.totalInterestPenalty)},
                    {field: 'reduceAmount', title: '减免金额', align: 'center', width: 120, templet: d => rmbFormat(d.reduceAmount)},
                    {field: 'actualTotalAmount', title: '实还总额', align: 'center', width: 120, templet: d => rmbFormat(d.actualTotalAmount)},
                    {field: 'payOrgType', title: '还款类型', align: 'center', width: 120, templet: d => getStatus(d.payOrgType)},
                    {field: 'remark', title: '失败原因', align: 'center', width: 100}
                ]]
            });
        }
        if (id === 'c6') {
            t.render({
                id: 'overduelog',
                elem: '#overduelog',
                url: '/info/overdue/' + userId,
                cols: [[
                    {type: 'numbers', title: '序号'},
                    {field: '', title: '当前时间', align: 'center', width: 120, templet: d => dateFormat('now')},
                    {field: 'repaymentPlanDate', title: '最后还款日', align: 'center', width: 120, templet: d => dateFormat(d.repaymentPlanDate)},
                    {field: 'overdueDays', title: '违约天数', align: 'center', width: 100},
                    {field: 'interest', title: '应还利息', align: 'center', width: 100, templet: d => rmbFormat(d.interest)},
                    {field: 'totalInterestPenalty', title: '逾期费', align: 'center', width: 100, templet: d => rmbFormat(d.totalInterestPenalty)},
                    {field: 'planTotalAmount', title: '应还总额', align: 'center', width: 100, templet: d => rmbFormat(d.planTotalAmount)},
                    {field: 'accountNum', title: '银行卡号', align: 'center', width: 160}
                ]]
            });
        }
        if (id === 'c7') {
            t.render({
                id: 'collectlog',
                elem: '#collectlog',
                url: '/collect/log/' + applyId,
                cols: [[
                    {type: 'numbers', title: '序号'},
                    {field: 'important', title: '是否重要', align: 'center', width: 100, templet: d => d.important ? r`是` : '否'},
                    {field: 'remindTime', title: '提醒日期', align: 'center', width: 100, templet: d => dateFormat(d.remindTime)},
                    {field: 'createTime', title: '添加时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.createTime)},
                    {field: 'applyNo', title: '申请编号', align: 'center', width: 120, templet: d => applyNo},
                    {field: 'name', title: '客户姓名', align: 'center', width: 100},
                    {field: 'collectUser', title: '催收人员', align: 'center', width: 100},
                    {field: 'collectStateRemark', title: '催收状态', align: 'center', width: 180},
                    {field: 'collectRemark', title: '催收记录', align: 'center', width: 180}
                ]]
            });
        }
    });

    e.on('nav(detail)', e => {
        const id = $(e).attr('id');
        if (id === 'n1') {
            $('#page1').show('fast');
            $('#page2').hide('fast');
        } else if (id === 'n2') {
            $('#page1').hide('fast');
            $('#page2').show('fast');
        }
    });

});