layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    laytplrender(sourceTypeTpl, 'sourceTypeView', getSession('channel'));
    f.render('select');

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'apply',
        elem: '#apply',
        height: 'full-180',
        page: constants.LAYUIPAGE,
        url: '/approve/apply',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'sourceType', title: '注册渠道', align: 'center', width: 100, templet: d => getChannel(d.sourceType)},
            {field: 'channel', title: '进件渠道', align: 'center', width: 100, templet: d => getStatus(d.channel)},
            {field: 'incomeTime', title: '申请时间', align: 'center', width: 120, sort: true, templet: d => dateFormat(d.incomeTime)},
            {field: 'registerTime', title: '入网时间', align: 'center', width: 120, templet: d => dateFormat(d.registerTime)},
            {field: 'phone', title: '手机号码', align: 'center', width: 120},
            {field: 'applyNum', title: '申请编号', align: 'center', width: 120, templet: d => `<a target="_blank" href="/approve/detail.html?applyId=${d.id}&userId=${d.userId}&applyNo=${d.applyNum}&from=1">${d.applyNum}</a>`},
            {field: 'gpsAddress', title: '定位位置', align: 'center', width: 120},
            {field: 'loanCount', title: '放款次数', align: 'center', width: 100, sort: true},
            {field: 'refuseNote', title: '机器拒绝原因', align: 'center', width: 120},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(apply)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'userinfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:6em;"><b>姓　　名：</b></td><td>${d.name}</td></tr>
                    <tr><td><b>注册渠道：</b></td><td>${getChannel(d.sourceType)}</td></tr>
                    <tr><td><b>手机号码：</b></td><td>${d.phone}</td></tr>
                    <tr><td><b>号码归属地：</b></td><td>${d.phoneLoc}</td></tr>
                    <tr><td><b>定位位置：</b></td><td title="${d.gpsAddress}">${lessaddress(d.gpsAddress)}</td></tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        t.reload('apply', {page: {curr: 1}, where: d.field});
        $('#allot').parent().hide('fast');
        return false;
    });

    t.on('sort(apply)', o => {
        t.reload('apply', {where: {sort: o.field, sortOrder: o.type}});
        $('#allot').parent().hide('fast');
    });

    t.on('checkbox(apply)', o => {
        const d = t.checkStatus('apply');
        if (d.data.length > 0) {
            $('#allot').parent().show('fast');
        } else {
            $('#allot').parent().hide('fast');
        }
    });

    $('#allot').click(() => {
        const d = t.checkStatus('apply');
        let applyIds = [];
        d.data.map((e, i) => applyIds.push(e.id));
        layer.open({
            title: '批贷',
            type: 2,
            content: ['/approve/approve.html', 'no'],
            area: ['300px', '200px'],
            btn: ['确认', '取消'],
            yes: (i, l) => {
                let f = layer.getChildFrame('form', i);
                const flag = !!f.find(':checked').val();
                const remark = f.find(':text').val();
                $.post('/approve/audit', {flag: flag, remark: remark, applyIds: JSON.stringify(applyIds)}, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        t.reload('apply');
                    } else {
                        layer.msg(data.msg, constants.ERROR);
                    }
                    $('#allot').parent().hide('fast');
                    layer.close(i);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
            },
            btn2: (i, l) => layer.close(i)
        });
    });

    $('.morebtn').click(() => {
        if ($('.morebtn').hasClass('in')) {
            $('#more').hide('slow');
            $('#more').children().children(':text').map((i, e) => $(e).val(''));
            $('.morebtn').removeClass('in');
            $('.morebtn').children().html('&#xe61a;');
        } else {
            $('#more').show('slow');
            $('.morebtn').addClass('in');
            $('.morebtn').children().html('&#xe619;');
        }
    });
});