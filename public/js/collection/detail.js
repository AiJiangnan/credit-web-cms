layui.use(['element', 'table', 'form'], () => {
    const [$, e, t, f] = [layui.jquery, layui.element, layui.table, layui.form];
    const [applyId, applyNo, userId, from, channel] = [getQueryStr('applyId'), getQueryStr('applyNo'), getQueryStr('userId'), getQueryStr('from'), getQueryStr('channel')];

    let partId;

    const getNankName = bankNum => {
        let bankName = '';
        $.ajax({
            method: 'GET',
            async: false,
            url: '/info/bankname/' + bankNum,
            success: d => {
                bankName = d.data ? d.data : '';
            }
        });
        return bankName;
    };

    const collectInfo = () => {
        // 展示工具栏
        if (from === '1') {
            $('#reduce').removeClass('layui-hide');
            $('#repayView').removeClass('layui-hide');
            $('#log').removeClass('layui-hide');
            $('#black').removeClass('layui-hide');
        }
        // 申请信息
        $.get('/info/user/' + userId, {applyId: applyId}, d => {
            if (d.code === 0) {
                check(d.data);
                d.data.channel = channel;
                laytplrender(userInfoTpl, 'userInfoView', d.data);
            }
        });
        // 减免记录
        t.render({
            id: 'reducelog',
            elem: '#reducelog',
            url: '/info/reduce/' + applyId,
            cols: [[
                {type: 'numbers', title: '序号'},
                {field: 'reduceOverdueFee', title: '减免逾期费', align: 'center', width: 120, templet: d => rmbFormat(d.reduceOverdueFee)},
                {field: 'applyTime', title: '申请时间', align: 'center', width: 120, templet: d => dateFormat(d.applyTime)},
                {field: 'state', title: '审批结果', align: 'center', width: 120, templet: d => getStatus(d.state)}
            ]]
        });
        // 部分还款记录
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
                {field: 'status', title: '还款状态', align: 'center', width: 100, templet: d => getStatus(d.status)},
                {title: '操作', width: 100, align: 'center', toolbar: '#tool'}
            ]],
            done: (r, c, count) => {
                r.data.map((e, i) => {
                    if (e.status === 'init') {
                        partId = e.id;
                        $('#logo').attr('class', 'layui-badge-dot');
                    }
                });
                if (from === '0') {
                    $('[data-field="9"]').css('display', 'none');
                }
            }
        });
        // 借款记录
        t.render({
            id: 'loanlog',
            elem: '#loanlog',
            url: '/info/loan/' + userId,
            cols: [[
                {type: 'numbers', title: '序号'},
                {field: 'applyNo', title: '申请编号', align: 'center', width: 120},
                {field: '', title: '借款日期', align: 'center', width: 120, templet: d => getLoanTimeFromApplyNo(d.applyNo)},
                {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 110, templet: d => dateFormat(d.repaymentPlanDate)},
                {field: 'updateTime', title: '实还时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.updateTime)},
                {field: 'overdueDays', title: '逾期天数', align: 'center', width: 100},
                {field: 'planTotalAmount', title: '应还金额', align: 'center', width: 100, templet: d => rmbFormat(d.planTotalAmount)},
                {field: 'reduceAmount', title: '减免金额', align: 'center', width: 100, templet: d => rmbFormat(d.reduceAmount)},
                {field: 'actualTotalAmount', title: '实还金额', align: 'center', width: 100, templet: d => rmbFormat(d.actualTotalAmount)},
                {field: 'payOrgType', title: '还款类型', align: 'center', width: 100, templet: d => getStatus(d.payOrgType)}
            ]]
        });
        // 还款失败记录
        t.render({
            id: 'repayfaillog',
            elem: '#repayfaillog',
            url: '/info/repayfail/' + applyId,
            cols: [[
                {type: 'numbers', title: '序号'},
                {field: 'updateTime', title: '还款时间', align: 'center', width: 180, templet: d => dateTimeFormat(d.updateTime)},
                {field: 'accountNum', title: '还款卡号', align: 'center', width: 120},
                {field: 'bankName', title: '还款银行', align: 'center', width: 100, templet: d => getNankName(d.accountNum)},
                {field: 'collectUser', title: '催收人员', align: 'center', width: 110},
                {field: 'capital', title: '应还本金', align: 'center', width: 120, templet: d => rmbFormat(d.capital)},
                {field: 'interest', title: '应还利息', align: 'center', width: 120, templet: d => rmbFormat(d.interest)},
                {field: 'totalInterestPenalty', title: '应还逾期费', align: 'center', width: 120, templet: d => rmbFormat(d.totalInterestPenalty)},
                {field: 'reduceAmount', title: '减免金额', align: 'center', width: 120, templet: d => rmbFormat(d.reduceAmount)},
                {field: 'actualTotalAmount', title: '实还总额', align: 'center', width: 120, templet: d => rmbFormat(d.actualTotalAmount)},
                {field: 'payOrgType', title: '还款类型', align: 'center', width: 120, templet: d => getStatus(d.payOrgType)},
                {field: 'remark', title: '失败原因', align: 'center', width: 100}
            ]]
        });
        // 逾期信息
        t.render({
            id: 'overduelog',
            elem: '#overduelog',
            url: '/info/overdue/' + userId,
            cols: [[
                {type: 'numbers', title: '序号'},
                {field: '', title: '当前时间', align: 'center', width: 120, templet: d => dateFormat('now')},
                {field: 'repaymentPlanDate', title: '最后还款日', align: 'center', width: 120, templet: d => dateFormat(d.repaymentPlanDate)},
                {field: 'overdueDays', title: '违约天数', align: 'center', width: 100},
                {field: 'capital', title: '本金', align: 'center', width: 100, templet: d => rmbFormat(d.capital)},
                {field: 'interest', title: '应还利息', align: 'center', width: 100, templet: d => rmbFormat(d.interest)},
                {field: 'totalInterestPenalty', title: '逾期费', align: 'center', width: 100, templet: d => rmbFormat(d.totalInterestPenalty)},
                {field: 'planTotalAmount', title: '应还总额', align: 'center', width: 100, templet: d => rmbFormat(d.planTotalAmount)},
                {field: 'accountNum', title: '银行卡号', align: 'center', width: 160}
            ]]
        });
        // 电话催收
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
        // 划扣银行卡
        $.get('/repayment/bankcard', {userId: userId}, d => {
            const banks = d.data.userBindBanks;
            laytplrender(bankTpl, 'bankView', banks);
            banks.map((e, i) => {
                if (e.isDefault === '1') {
                    $('option[value="' + e.bankInfoId + '"]').prop('selected', 'selected');
                }
            });
            f.render();
        });
        // 划扣金额
        $.get('/repayment/amount', {applyId: applyId}, d => {
            if (d.code !== 0) {
                layer.msg(d.msg, constants.ERROR);
                return;
            }
            $('[name="amount"]').val(d.data);
        });
    };
    collectInfo();

    e.on('tab(tab)', data => {
        const i = data.index;
        if (i === 0) {
            collectInfo();
        }
        if (i === 1) {
            // 联系人详单
            $.get('/info/phonelog/' + userId, {channel: channel, applyId: applyId}, d => {
                if (d.code === 0) {
                    if (d.data.proportion === undefined) {
                        d.data = JSON.parse(d.data);
                    }
                    $('#rate').html(d.data.proportion ? (rmbFormat(d.data.proportion * 100) + '%') : '无');
                    laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
                }
            });
        }
        if (i === 2) {
            // 手机通讯录
            t.render({
                id: 'contacts',
                elem: '#contacts',
                page: constants.LAYUIPAGE,
                url: '/info/contacts/' + userId,
                cols: [[
                    {type: 'numbers', title: '序号'},
                    {field: 'name', title: '姓名', align: 'center', width: 180},
                    {
                        field: 'phone',
                        title: '手机号码',
                        align: 'center',
                        width: 160,
                        templet: d => d.phone.replace(',', '')
                    },
                ]]
            });
        }
    });

    f.on('submit(submit)', d => {
        const phone = $('[name="phone"]').val();
        $.get('/info/phonelog/' + userId, {phone: phone, channel: channel, applyId: applyId}, d => {
            if (d.code === 0) {
                if (d.data.proportion === undefined) {
                    d.data = JSON.parse(d.data);
                }
                $('#rate').html(d.data.proportion ? (rmbFormat(d.data.proportion * 100) + '%') : '无');
                laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
            }
        });
        return false;
    });

    f.on('submit(repay)', d => {
        let repay = d.field;
        repay.applyId = applyId;
        const i = parent.layer.load(0, {shade: 0.1});
        $.post('/repayment', repay, data => {
            if (data.code === 0) {
                layer.msg(data.data, constants.SUCCESS);
            } else {
                layer.msg(data.msg, constants.ERROR);
            }
            parent.layer.close(i);
        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
        return false;
    });

    $('#repay').click(() => {
        $.get('/repayment/amount', {applyId: applyId}, d => {
            if (d.data === 0) {
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

    t.on('tool(partlog)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'confirm') {
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
        }
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

});