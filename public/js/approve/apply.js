layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'apply',
        elem: '#apply',
        height: 'full-170',
        page: true,
        url: '/approve/apply',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'channel', title: '进件渠道', align: 'center', width: 90},
            {field: 'incomeTime', title: '申请时间', align: 'center', width: 140, sort: true, templet: d => dateFormat(d.incomeTime)},
            {field: 'registerTime', title: '入网时间', align: 'center', width: 140, templet: d => dateFormat(d.registerTime)},
            {field: 'applyNum', title: '申请编号', align: 'center', width: 120},
            {field: 'rejectLoanCount', title: '拒贷数', align: 'center', width: 80, align: 'center', templet: '#loanCount'},
            {field: 'loanCount', title: '申请次数', align: 'center', width: 100, sort: true, align: 'center', templet: '#state'},
            {field: 'loanCount', title: '放款次数', align: 'center', width: 100, sort: true, align: 'center'},
            {field: 'refuseNote', title: '机器拒绝原因', align: 'center', width: 120, align: 'center'},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(apply)', o => {
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
                        <td><b>号码归属地：</b></td>
                        <td>${d.phoneLoc}</td>
                    </tr>
                    <tr>
                        <td><b>定位位置：</b></td>
                        <td title="${d.gpsAddress}">${lessaddress(d.gpsAddress)}</td>
                    </tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('apply', {where: d.field});
        return false;
    });

    t.on('sort(apply)', o => t.reload('apply', {where: {sort: o.field, sortOrder: o.type}}));

    t.on('checkbox(apply)', o => {
        if (o.checked) {
            $('#allot').parent().show('fast');
        } else {
            $('#allot').parent().hide('fast');
        }
    });

    $('#allot').click(() => {
        const d = t.checkStatus('apply');
    });
});