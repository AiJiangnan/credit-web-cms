layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'distribute',
        elem: '#distribute',
        height: 'full-110',
        page: true,
        url: '/approve/distribute',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'channel', title: '进件渠道', align: 'center', width: 100},
            {field: 'applyNum', title: '申请编号', align: 'center', width: 120},
            {field: 'name', title: '姓名', align: 'center', width: 80, templet: '#gender'},
            {field: 'incomeTime', title: '进件日期', align: 'center', width: 120, sort: true},
            {field: 'loanCount', title: '是否复贷', align: 'center', width: 100, align: 'center', templet: '#loanCount'},
            {field: 'status', title: '审核状态', align: 'center', width: 100, align: 'center', templet: '#state'},
            {field: 'registerTime', title: '入网时间', align: 'center', width: 100, align: 'center'},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(distribute)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:5em;"><b>姓　　名：</b></td>
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
                        <td><b>身份证号：</b></td>
                        <td>${d.idcard}</td>
                    </tr>
                    <tr>
                        <td><b>定位位置：</b></td>
                        <td title="${d.gpsAddress}">${lessaddress(d.gpsAddress)}</td>
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
        console.log(d);
    });
});