layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});
    let colums = [{type: 'numbers', title: '序号'}];
    let columsData = {
        choice: ['sourceType', 'channel', 'applyNum', 'incomeTime', 'approveTime', 'gpsAddress'],
        sourceType: {field: 'sourceType', title: '注册渠道', align: 'center', width: 100},
        channel: {field: 'channel', title: '进件渠道', align: 'center', width: 100},
        applyNum: {field: 'applyNum', title: '申请编号', align: 'center', width: 240},
        incomeTime: {field: 'incomeTime', title: '申请时间', align: 'center', width: 100, sort: true, templet: d => dateFormat(d.incomeTime)},
        approveTime: {field: 'approveTime', title: '审批时间', align: 'center', width: 100, sort: true, templet: d => dateFormat(d.approveTime)},
        gpsAddress: {field: 'gpsAddress', title: '定位位置', align: 'center', width: 200},
        name: {field: 'name', title: '姓名', align: 'center', width: 100},
        phone: {field: 'phone', title: '手机号码', align: 'center', width: 140},
        status: {field: 'status', title: '审核状态', align: 'center', width: 100, templet: d => getStatus(d.status)},
        refuseNote: {field: 'refuseNote', title: '机器拒贷原因', align: 'center', width: 100},
        whetherAudit: {field: 'whetherAudit', title: '是否人工决策', align: 'center', width: 100, templet: d => d.whetherAudit ? '是' : '否'},
        loanCount: {field: 'loanCount', title: '是否复贷', align: 'center', width: 100, templet: d => d.loanCount > 0 ? '是' : '否'},
        loanCount: {field: 'loanCount', title: '贷款次数', align: 'center', width: 100},
        name: {field: 'name', title: '审核员', align: 'center', width: 100},
        applyAmount: {field: 'applyAmount', title: '申请金额', align: 'center', width: 100, templet: d => rmbFormat(d.applyAmount)},
        actualAmount: {field: 'actualAmount', title: '批贷金额', align: 'center', width: 100, templet: d => rmbFormat(d.applyAmount)}
    };

    const dataRender = () => {
        columsData.choice.map((e, i) => colums.push(columsData[e]));
        t.render({
            id: 'composite',
            elem: '#composite',
            height: 'full-180',
            page: true,
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
            success: () => {
                sessionStorage.setItem('choose', JSON.stringify(columsData.choice));
            },
            yes: (i, l) => {
                columsData.choice = [];
                let f = layer.getChildFrame('form', i);
                let find = f.find(':checked');
                if (find.length < 1) {
                    layer.msg('展示字段不能为空！', constants.LOCK);
                    return;
                }
                find.map((i, e) => {
                    columsData.choice.push($(e).val());
                    if (i === find.length - 1) {
                        dataRender();
                    }
                });
                layer.close(i);
            },
            btn2: (i, l) => {
                layer.close(i);
            }
        });
        return false;
    });

    t.on('tool(composite)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:5em;"><b>姓　　名：</b></td><td>${d.name}</td></tr>
                    <tr><td><b>注册渠道：</b></td><td>${d.sourceType}</td></tr>
                    <tr><td><b>白名单：</b></td><td>${d.whetherWhiteList ? '是' : '否'}</td></tr>
                    <tr><td><b>手机号码：</b></td><td>${d.phone}</td></tr>
                    <tr><td><b>身份证号：</b></td><td>${d.idcard}</td></tr>
                    <tr><td><b>定位位置：</b></td><td title="${d.gpsAddress}">${lessaddress(d.gpsAddress)}</td></tr>
                </table>`);
        }
        if (e === 'loaninfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:7em;"><b>申请编号：</b></td><td>${d.applyNum}</td></tr>
                    <tr><td><b>进件渠道：</b></td><td>${d.channel}</td></tr>
                    <tr><td><b>审核状态：</b></td><td>${getStatus(d.status)}</td></tr>
                    <tr><td><b>机器拒贷原因：</b></td><td>${d.refuseNote}</td></tr>
                    <tr><td><b>是否人工决策：</b></td><td>${d.whetherAudit ? '是' : '否'}</td></tr>
                    <tr><td><b>批贷金额：</b></td><td>${rmbFormat(d.actualAmount)}</td></tr>
                    <tr><td><b>贷款次数：</b></td><td>${d.loanCount}</td></tr>
                    <tr><td><b>申请金额：</b></td><td>${rmbFormat(d.applyAmount)}</td></tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('composite', {where: d.field});
        return false;
    });

    t.on('sort(composite)', o => t.reload('composite', {where: {sort: o.field, sortOrder: o.type}}));

});