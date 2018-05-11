layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'banner',
        elem: '#banner',
        height: 'full-70',
        page: true,
        url: '/app/banner/list',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'name', title: '名称', align: 'center', width: 160},
            {field: 'bannerDesc', title: '描述', align: 'center', width: 280},
            {field: 'orderNo', title: '排序', align: 'center', width: 110},
            {field: 'startTime', title: '起始时间', align: 'center', width: 160,templet: d => dateTimeFormat(d.startTime)},
            {field: 'endTime', title: '终止时间', align: 'center', width: 160,templet: d => dateTimeFormat(d.endTime)},
            {field: 'status', title: '状态', align: 'center', width: 130,templet: d => d.status == '1' ? '是' : '否'},
            {title: '操作', width: 160, align: 'center', toolbar: '#tool'}
        ]]
    });
    
    t.on('tool(banner)', o => {
        let [e, d] = [o.event, o.data];
       
        if (e === 'edit') {
            layer.open({
                title: '修改管理员',
                type: 2,
                content: ['../system/editadmin.html', 'no'],
                area: ['300px', '300px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        if (k === 'gender') continue;
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                    f.find("input[name='gender'][value=" + d.gender + "]").prop('checked', true);
                    f.find("input[name='statebox']").attr('checked', d.state);
                },
                end: () => {
                    if (sessionStorage.getItem('user')) {
                        let u = JSON.parse(sessionStorage.getItem('user'));
                        u.state = (u.state === 'true');
                        o.update(u);
                        sessionStorage.removeItem('user');
                    }
                }
            });
        }
        
    });
    
    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('banner', {where: d.field});
        return false;
    });


    $('#refresh').click(() => t.reload('banner', {where: null}));
});