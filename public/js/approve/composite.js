layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    laytplrender(sourceTypeTpl, 'sourceTypeView', getSession('channel'));
    f.render('select');

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});
    let colums = [{type: 'numbers', title: '序号'}];
    let columsData = {
        choice: ['sourceType', 'channel', 'applyNum', 'incomeTime', 'approveTime', 'whetherWhiteList', 'status'],
        sourceType: {field: 'sourceType', title: '注册渠道', align: 'center', width: 100, templet: d => getChannel(d.sourceType)},
        channel: {field: 'channel', title: '进件渠道', align: 'center', width: 100, templet: d => getStatus(d.channel)},
        applyNum: {field: 'applyNum', title: '申请编号', align: 'center', width: 240, templet: d => `<a target="_blank" href="/approve/detail.html?applyId=${d.id}&userId=${d.userId}&applyNo=${d.applyNum}&channel=${d.channel}">${d.applyNum}</a>`},
        incomeTime: {field: 'incomeTime', title: '申请时间', align: 'center', width: 160, sort: true, templet: d => dateTimeFormat(d.incomeTime)},
        approveTime: {field: 'approveTime', title: '审批时间', align: 'center', width: 160, sort: true, templet: d => dateTimeFormat(d.approveTime)},
        whetherWhiteList: {file: 'whetherWhiteList', title: '是否白名单', align: 'center', width: 100, templet: d => d.whetherWhiteList ? '是' : '否'},
        gpsAddress: {field: 'gpsAddress', title: '定位位置', align: 'center', width: 200},
        name: {field: 'name', title: '姓名', align: 'center', width: 100},
        phone: {field: 'phone', title: '手机号码', align: 'center', width: 140},
        status: {field: 'status', title: '审核状态', align: 'center', width: 100, templet: d => getStatus(d.status)},
        refuseNote: {field: 'refuseNote', title: '机器拒贷原因', align: 'center', width: 100},
        whetherAudit: {field: 'whetherAudit', title: '是否人工决策', align: 'center', width: 100, templet: d => d.whetherAudit ? '是' : '否'},
        loanCount: {field: 'loanCount', title: '是否复贷', align: 'center', width: 100, templet: d => d.loanCount > 0 ? '是' : '否'},
        loanCount: {field: 'loanCount', title: '贷款次数', align: 'center', width: 100},
        auditName: {field: 'auditName', title: '审核员', align: 'center', width: 100},
        applyAmount: {field: 'applyAmount', title: '申请金额', align: 'center', width: 100, templet: d => rmbFormat(d.applyAmount)},
        actualAmount: {field: 'actualAmount', title: '批贷金额', align: 'center', width: 100, templet: d => rmbFormat(d.applyAmount)}
    };

    const dataRender = () => {
        if (getSession('colums')) {
            columsData.choice = getSession('colums');
        }
        columsData.choice.map((e, i) => colums.push(columsData[e]));
        t.render({
            id: 'composite',
            elem: '#composite',
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
        t.reload('composite', {page: {curr: 1}, where: d.field});
        return false;
    });
    f.on('submit(export)', d => {
        location = '/approve/integrate/export?' + $('.layui-form').serialize();
        return false;
    });

    t.on('sort(composite)', o => t.reload('composite', {where: {sort: o.field, sortOrder: o.type}}));

});