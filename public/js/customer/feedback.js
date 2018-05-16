layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'feedback',
        elem: '#feedback',
        height: 'full-120',
        page: true,
        url: '/app/feedBack/list',
        cols: [[
             {type: 'numbers', title: '序号'},
            {field: 'userName', title: '用户名', align: 'center', width: 160},
            {field: 'content', title: '反馈内容', align: 'center', width: 300},
            {field: 'createTime', title: '创建日期', align: 'center', width: 300,templet: d => dateTimeFormat(d.createTime)},
            {title: '操作', width: 180, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(feedback)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
        if (e === 'deviceInfo') {
            alertinfo(`<table class="layui-table" lay-skin="nob" style="margin:0;">
                    <tr><td style="width:6em;"></tr>
                    <tr><td><b>客户端类型：</b></td><td>${d.clientType}</td></tr>
            		<tr><td><b>App版本：</b></td><td>${d.appVersion}</td></tr>
            		<tr><td><b>手机型号：</b></td><td>${d.deviceModel}</td></tr>
            		<tr><td><b>IMEI：</b></td><td>${d.deviceId}</td></tr>
            		<tr><td><b>联系电话：</b></td><td>${d.contactNo}</td></tr>
            		<tr><td><b>反馈意见：</b></td><td>${d.content}</td></tr>
            		<tr><td><b>最后更新时间：</b></td><td>${d.createTime}</td></tr>
            		<tr><td><b>创建时间：</b></td><td>${d.updateTime}</td></tr>
                </table>`);
        }
    });
    
    
    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('feedback', {where: d.field});
        return false;
    });


    t.on('sort(feedback)', o => t.reload('feedback', {where: {sort: o.field, sortOrder: o.type}}));

});