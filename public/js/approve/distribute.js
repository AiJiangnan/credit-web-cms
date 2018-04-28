layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    let channel = JSON.parse(sessionStorage.getItem('channel'));

    laytplrender(sourceTypeTpl, 'sourceTypeView', channel);
    f.render('select');

    const getChannel = c => {
        let name = '0';
        channel.map((e, i) => {
            if (e.code === c) {
                name = e.name;
            }
        });
        return name;
    };

    t.render({
        id: 'distribute',
        elem: '#distribute',
        height: 'full-120',
        page: true,
        url: '/approve/distribute',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'sourceType', title: '注册渠道', align: 'center', width: 100, templet: d => getChannel(d.sourceType)},
            {field: 'channel', title: '进件渠道', align: 'center', width: 100, templet: d => getStatus(d.channel)},
            {field: 'incomeTime', title: '进件日期', align: 'center', width: 120, sort: true, templet: d => dateFormat(d.incomeTime)},
            {field: 'applyNum', title: '申请编号', align: 'center', width: 120},
            {field: 'name', title: '姓名', align: 'center', width: 100},
            {field: 'phone', title: '手机号码', align: 'center', width: 100},
            {field: 'loanCount', title: '是否复贷', align: 'center', width: 100, templet: d => d.loanCount > 0 ? '是' : '否'},
            {field: 'status', title: '审核状态', align: 'center', width: 100, templet: d => getStatus(d.status)},
            {field: 'registerTime', title: '入网时间', align: 'center', width: 120, templet: d => dateFormat(d.registerTime)},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(distribute)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:5em;"><b>姓　　名：</b></td><td>${d.name}</td></tr>
                    <tr><td><b>注册渠道：</b></td><td>${getChannel(d.sourceType)}</td></tr>
                    <tr><td><b>手机号码：</b></td><td>${d.phone}</td></tr>
                    <tr><td><b>身份证号：</b></td><td>${d.idcard}</td></tr>
                    <tr><td><b>定位位置：</b></td><td title="${d.gpsAddress}">${lessaddress(d.gpsAddress)}</td></tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('distribute', {where: d.field});
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
        d.data.map((e, i) => applyIds.push(e.id));
        layer.open({
            title: '分配审核人员',
            type: 2,
            content: '/approve/admin.html',
            area: ['300px', '400px'],
            btn: ['确认', '取消'],
            yes: (i, l) => {
                let f = layer.getChildFrame('form', i);
                const userId = f.find(':checked').val();
                if (!userId) {
                    layer.msg('没有选择信审专员！', constants.LOCK);
                    return;
                }
                $.post('/approve/distribution', {auditUid: userId, applyIds: JSON.stringify(applyIds)}, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        t.reload('distribute');
                    } else {
                        layer.msg('分配失败！', constants.ERROR);
                    }
                    $('#allot').parent().hide('fast');
                    layer.close(i);
                }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            },
            btn2: (i, l) => {
                layer.close(i);
            }
        });
    });
});