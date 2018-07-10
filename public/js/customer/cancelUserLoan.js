layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    laytplrender(sourceTypeTpl, 'sourceTypeView', getSession('channel'));
    f.render('select');

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});
    let colums = [{type: 'numbers', title: '序号'}];
    let columsData = {
        choice: ['sourceType', 'channel', 'applyNum', 'incomeTime', 'approveTime', 'name','phone', 'status','tool'],
        sourceType: {field: 'sourceType', title: '注册渠道', align: 'center', width: 100, templet: d => getChannel(d.sourceType)},
        channel: {field: 'channel', title: '进件渠道', align: 'center', width: 100, templet: d => getStatus(d.channel)},
        applyNum: {field: 'applyNum', title: '申请编号', align: 'center', width: 240},
        incomeTime: {field: 'incomeTime', title: '申请时间', align: 'center', width: 160, sort: true, templet: d => dateTimeFormat(d.incomeTime)},
        approveTime: {field: 'approveTime', title: '审批时间', align: 'center', width: 160, sort: true, templet: d => dateTimeFormat(d.approveTime)},
        payTime: {field: 'payTime', title: '放款时间', align: 'center', width: 160, sort: true, templet: d => dateTimeFormat(d.payTime)},
        repayTime: {field: 'repayTime', title: '还款时间', align: 'center', width: 160, sort: true, templet: d => dateTimeFormat(d.repayTime)},
        whetherWhiteList: {file: 'whetherWhiteList', title: '是否白名单', align: 'center', width: 100, templet: d => d.whetherWhiteList ? '是' : '否'},
        gpsAddress: {field: 'gpsAddress', title: '定位位置', align: 'center', width: 200},
        name: {field: 'name', title: '姓名', align: 'center', width: 100},
        phone: {field: 'phone', title: '手机号码', align: 'center', width: 130},
        status: {field: 'status', title: '审核状态', align: 'center', width: 100, templet: d => getStatus(d.status)},
        refuseNote: {field: 'refuseNote', title: '机器拒贷原因', align: 'center', width: 100},
        whetherAudit: {field: 'whetherAudit', title: '是否人工决策', align: 'center', width: 100, templet: d => d.whetherAudit ? '是' : '否'},
        loanCount: {field: 'loanCount', title: '是否复贷', align: 'center', width: 100, templet: d => d.loanCount > 0 ? '是' : '否'},
        loanCount: {field: 'loanCount', title: '贷款次数', align: 'center', width: 100},
        auditName: {field: 'auditName', title: '审核员', align: 'center', width: 100},
        applyAmount: {field: 'applyAmount', title: '申请金额', align: 'center', width: 100, templet: d => rmbFormat(d.applyAmount)},
        actualAmount: {field: 'actualAmount', title: '批贷金额', align: 'center', width: 100, templet: d => rmbFormat(d.applyAmount)},
        tool: {title: '操作', width: 100, align: 'center', toolbar: '#tool'}
    };

    const dataRender = () => {
        if (getSession('colums')) {
            columsData.choice = getSession('colums');
        }
        columsData.choice.map((e, i) => colums.push(columsData[e]));
        t.render({
            id: 'cancelUserLoan',
            elem: '#cancelUserLoan',
            height: 'full-160',
            page: constants.LAYUIPAGE,
            url: '/approve/integrate',
            cols: [colums]
        });
    };

    dataRender();

    $('#choose').click(() => {
        colums = [{type: 'numbers', title: '序号'}];
        layer.open({
            title: '选择展示字段',
            type: 2,
            content: '/approve/colums.html',
            area: ['300px', '400px'],
            btn: ['确认', '取消'],
            success: () => setSession('choose', columsData.choice),
            yes: (i, l) => {
                columsData.choice = [];
                const f = layer.getChildFrame('form', i);
                const c = f.serializeArray();
                if (c.length < 1) {
                    layer.msg('展示字段不能为空！', constants.LOCK);
                    return;
                }
                c.map((e, i) => columsData.choice.push(e.value));
                setSession('colums', columsData.choice);
                dataRender();
                layer.close(i);
            },
            btn2: (i, l) => layer.close(i)
        });
        return false;
    });

    f.on('submit(submit)', d => {
        t.reload('cancelUserLoan', {page: {curr: 1}, where: d.field});
        return false;
    });
    f.on('submit(export)', d => {
        location = '/approve/integrate/export?' + $('.layui-form').serialize();
        return false;
    });

    t.on('sort(cancelUserLoan)', o => t.reload('cancelUserLoan', {where: {sort: o.field, sortOrder: o.type}}));

    t.on('checkbox(cancelUserLoan)', o => {
        const d = t.checkStatus('cancelUserLoan');
        if (d.data.length > 0) {
            $('#cancel').parent().show('fast');
        } else {
            $('#cancel').parent().hide('fast');
        }
    });

    // $('#cancel').click(() => {
    //     const d = t.checkStatus('cancelUserLoan');
    //     let applyId = "";
    //     let phone = "";
    //     let name = "";
    //     let incomeTime = "";
    //     d.data.map((e, i) => {
    //         applyId = e.applyId;
    //         phone = e.phone;
    //         incomeTime = e.incomeTime;
    //         name = e.name;
    //     });
    //     if (applyId.length < 1) return;
    //     layer.confirm(`当前选择 的是姓名为${name} ，手机号为${phone}在${incomeTime}的借款，确定取消？`, constants.CONFIRM, i => {
    //         $.post('/approve/cancel', {applyId: applyId}, data => {
    //             if (data.code === 0) {
    //                 layer.msg(data.data, constants.SUCCESS);
    //                 t.reload('cancelUserLoan');
    //             } else {
    //                 layer.msg(data.msg, constants.ERROR);
    //             }
    //         }).fail(() => layer.msg('服务器错误！', constants.FAIL));
    //         // $('#cancel').parent().hide('fast');
    //         layer.close(i);
    //     });
    // });


    t.on('tool(cancelUserLoan)', o => {
        let [e, d] = [o.event, o.data];
        // const d = t.checkStatus('cancelUserLoan');
        let applyId = "";
        let phone = "";
        let name = "";
        let incomeTime = "";
            applyId = d.id;
            phone = d.phone;
            incomeTime = d.incomeTime;
            name = d.name;
        layer.confirm(`当前选择 的是姓名为${name} ，手机号为${phone}在${dateTimeFormat(incomeTime)}的借款，确定取消？`, constants.CONFIRM, i => {
            $.post('/approve/cancel', {applyId: applyId}, data => {
                if (data.code === 0) {
                    layer.msg(data.data, constants.SUCCESS);
                    t.reload('cancelUserLoan');
                } else {
                    layer.msg(data.msg, constants.ERROR);
                }
            }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            // $('#cancel').parent().hide('fast');
            layer.close(i);
        });

    });

});

