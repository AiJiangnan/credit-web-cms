layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'composite',
        elem: '#composite',
        height: 'full-170',
        page: true,
        url: '/approve/integrate',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'channel', title: '进件渠道', align: 'center', width: 100},
            {field: 'applyNum', title: '申请编号', align: 'center', width: 120},
            {field: 'name', title: '姓名', align: 'center', width: 80, templet: '#gender'},
            {field: 'incomeTime', title: '申请时间', align: 'center', width: 120},
            {field: 'approveTime', title: '审批时间', align: 'center', width: 100, align: 'center', sort: true, templet: '#state'},
            {field: 'applyAmount', title: '申请金额', align: 'center', width: 100, align: 'center', sort: true, templet: '#state'},
            {field: 'status', title: '审核状态', align: 'center', width: 100, align: 'center', templet: '#state'},
            {title: '操作', width: 200, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(composite)', o => {
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
                        <td><b>白名单：</b></td>
                        <td>${d.whetherWhiteList}</td>
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
        if (e === 'loaninfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr>
                        <td style="width:7em;"><b>申请编号：</b></td>
                        <td>${d.name}</td>
                    </tr>
                    <tr>
                        <td><b>进件渠道：</b></td>
                        <td>${d.sourceType}</td>
                    </tr>
                    <tr>
                        <td><b>审核状态：</b></td>
                        <td>${d.status}</td>
                    </tr>
                    <tr>
                        <td><b>机器拒贷原因：</b></td>
                        <td>${d.refuseNote}</td>
                    </tr>
                    <tr>
                        <td><b>是否人工决策：</b></td>
                        <td>${d.isAudit}</td>
                    </tr>
                    <tr>
                        <td><b>批贷金额：</b></td>
                        <td>${d.actualAmount}</td>
                    </tr>
                    <tr>
                        <td><b>贷款次数：</b></td>
                        <td>${d.loanCount}</td>
                    </tr>
                    <tr>
                        <td><b>申请金额：</b></td>
                        <td>${d.applyAmount}</td>
                    </tr>
                </table>`);
        }
    });

    f.on('submit(submit)', d => {
        console.log(d.field);
        t.reload('composite', {where: d.field});
        return false;
    });

    t.on('sort(composite)', o => t.reload('composite', {where: {sort: o.field, sortOrder: o.type}}));

    $('.morebtn').click(() => {
        $('.morebtn');
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