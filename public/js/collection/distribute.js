layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'distribute',
        elem: '#distribute',
        height: 'full-170',
        page: true,
        // url: '/collect',
        url: '/role',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'contractAmount', title: '合同金额', align: 'center', width: 120},
            {field: 'collectUser', title: '催收人员', align: 'center', width: 120},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 120},
            {field: 'repaymentPlanDate', title: '应还款日期', align: 'center', width: 130, sort: true, align: 'center', templet: '#loanCount'},
            {field: 'lastCollectState', title: '最近催收状态', align: 'center', width: 120, align: 'center', templet: '#state'},
            {field: 'collectWay', title: '分配状态', align: 'center', width: 100, sort: true, align: 'center'},
            {field: 'updateTime', title: '分配日期', align: 'center', width: 130, sort: true, align: 'center', templet: d => dateFormat(d.updateTime)},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(distribute)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:6em;"><b>姓　　名：</b></td>
                        <td>${d.name}</td>
                    </tr>
                    <tr>
                        <td><b>注册渠道：</b></td>
                        <td>${d.sourceType}</td>
                    </tr>
                    <tr>
                        <td><b>手机号码：</b></td>
                        <td>${d.phone}</td>
                    </tr>
                    <tr>
                        <td><b>身份证号码：</b></td>
                        <td>${d.phoneLoc}</td>
                    </tr>
                </table>`);
        }
        if (e === 'repayinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:8em;"><b>客户姓名：</b></td>
                        <td>${d.name}</td>
                    </tr>
                    <tr>
                        <td><b>进件渠道：</b></td>
                        <td>${d.channel}</td>
                    </tr>
                    <tr>
                        <td><b>违约天数：</b></td>
                        <td>${d.sourceType}</td>
                    </tr>
                    <tr>
                        <td><b>逾期费：</b></td>
                        <td>${d.phone}</td>
                    </tr>
                    <tr>
                        <td><b>应还总额：</b></td>
                        <td>${d.phoneLoc}</td>
                    </tr>
                    <tr>
                        <td><b>已还款金额：</b></td>
                        <td>${d.phoneLoc}</td>
                    </tr>
                    <tr>
                        <td><b>剩余应还款金额：</b></td>
                        <td>${d.phoneLoc}</td>
                    </tr>
                    <tr>
                        <td><b>还款状态：</b></td>
                        <td>${d.phoneLoc}</td>
                    </tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('distribute', {where: d.field});
        return false;
    });

    t.on('sort(distribute)', o => t.reload('distribute', {where: {sort: o.field, sortOrder: o.type}}));

    t.on('checkbox(distribute)', o => {
        if (o.checked) {
            $('#allot').parent().show('fast');
        } else {
            $('#allot').parent().hide('fast');
        }
    });

    $('#allot').click(() => {
        const d = t.checkStatus('distribute');
    });
});