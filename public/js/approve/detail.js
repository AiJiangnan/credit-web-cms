layui.use(['element', 'table', 'form'], () => {
    const [$, e, f, t] = [layui.jquery, layui.element, layui.form, layui.table];
    const [applyId, applyNo, userId, from] = [getQueryStr('applyId'), getQueryStr('applyNo'), getQueryStr('userId'), getQueryStr('from')];

    let channel = JSON.parse(sessionStorage.getItem('channel'));
    laytplrender(setTpl, 'setView', from);
    f.render();

    const getChannel = c => {
        let name = '0';
        channel.map((e, i) => {
            if (e.code === c) {
                name = e.name;
            }
        });
        return name;
    };

    const getLateDays = id => {
        let res;
        $.ajax({
            url: '/repayment/' + id,
            async: false,
            success: p => {
                if (p.code === 0) {
                    res = p.data.overdueDays;
                }
            }
        });
        return res ? res : '-';
    };

    $.get('/info/operator/' + userId, d => {
        if (d.code === 0) {
            check(d.data.reportVo);
            check(d.data.behaviorDetection);
            laytplrender(reportTpl, 'reportView', d.data.reportVo);
            laytplrender(monthTpl, 'monthView', d.data.monthlyBillList);
            laytplrender(fraudTpl, 'fraudView', d.data.fraudDetection);
            laytplrender(behaviorTpl, 'behaviorView', d.data.behaviorDetection);
            laytplrender(linkTpl, 'linkView', d.data.emergencyContactVo);
        }
    });

    $.get('/info/applyinfo/' + userId, {applyId: applyId}, d => {
        if (d.code === 0) {
            check(d.data);
            laytplrender(applyInfoTpl, 'applyInfoView', d.data);
            let res = '';
            d.data.historyApplyNumList.map((e, i) => {
                res += `<a href="/approve/detail.html?applyId=${e.applyId}&userId=${e.userId}&applyNo=${e.applyNum}" style="margin-right:15px;display:inline-block;">${e.applyNum}</a>`;
            });
            $('#his').html(res);
        }
    });


    f.on('submit(submit)', d => {
        $.get('/info/phonelog/' + userId + '?' + $('#phonelog').serialize(), d => {
            if (d.code === 0) {
                $('#rate').html(d.data.proportion + '%');
                laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
            }
        });
        return false;
    });

    f.on('submit(c-submit)', d => {
        t.reload('contacts', {page: {curr: 1}, where: d.field});
        return false;
    });
    f.on('submit(approve)', d => {
        const flag = !!d.field.flag;
        const remark = d.field.remark;
        layer.confirm('确认' + (flag ? r`批贷` : r`拒贷`) + '该订单？', i => {
            $.post('/approve/audit', {flag: flag, remark: remark, applyIds: JSON.stringify([applyId])}, data => {
                if (data.code === 0) {
                    layer.msg(data.data, constants.SUCCESS);
                    $('#setView').hide();
                } else {
                    layer.msg(data.msg, constants.ERROR);
                }
            }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
            layer.close(i);
        });
        return false;
    });

    e.on('tab(tab)', data => {
        const i = data.index;
        if (i === 0) {
            $.get('/info/operator/' + userId, d => {
                if (d.code === 0) {
                    check(d.data.reportVo);
                    laytplrender(reportTpl, 'reportView', d.data.reportVo);
                }
            });
        }
        if (i === 1) {
            $.get('/info/phonelog/' + userId, d => {
                if (d.code === 0) {
                    $('#rate').html((d.data.proportion * 100) + '%');
                    laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
                }
            });
        }
        if (i === 2) {
            t.render({
                id: 'contacts',
                elem: '#contacts',
                page: true,
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
        if (i === 3) {
            t.render({
                id: 'history',
                elem: '#history',
                page: true,
                url: '/info/history/' + userId,
                cols: [[
                    {type: 'numbers', title: '序号'},
                    {
                        field: 'sourceType',
                        title: '注册渠道',
                        align: 'center',
                        width: 100,
                        templet: d => getChannel(d.sourceType)
                    },
                    {field: 'applyNum', title: '申请编号', align: 'center', width: 200},
                    {
                        field: 'incomeTime',
                        title: '申请时间',
                        align: 'center',
                        width: 160,
                        templet: d => dateTimeFormat(d.incomeTime)
                    },
                    {field: 'status', title: '流程状态', align: 'center', width: 120, templet: d => getStatus(d.status)},
                    {field: 'refuseNote', title: '拒贷原因', align: 'center', width: 160},
                    {field: '', title: '逾期天数', align: 'center', width: 100, templet: d => getLateDays(d.id)}
                ]]
            });
        }
        if (i === 4) {
            $.get('/info/idcard/' + userId, d => {
                if (d.code === 0) {
                    $('#idcard').attr('src', d.data.idcardFrontSide);
                    $('#idcardback').attr('src', d.data.idcardBackSide);
                }
            });
        }

    });

});