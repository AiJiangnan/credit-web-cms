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
            {field: 'status', title: '状态', align: 'center', width: 130,templet: d => d.status == '1' ? '启用' : '禁用'},
            {title: '操作', width: 160, align: 'center', toolbar: '#tool'}
        ]]
    });
    
    t.on('tool(banner)', o => {
        let [e, d] = [o.event, o.data];
       
        if (e === 'edit') {
            layer.open({
                title: '修改轮播图',
                type: 2,
                content: ['../app/editBanner.html', 'no'],
                area: ['520px', '620px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                    	if (k === 'status') continue;
                        if (k === 'startTime'||k === 'endTime') {
                        	 continue;
                         }
                        
                        f.find("input[name='" + k + "']").val(d[k]);
                       
                    }
                    f.find("input[name='status'][value=" + d.status + "]").next().find("i").click();
                    
                    f.find("#imgLinkShow").attr("src",d.imgLink);
                    f.find("#shareIconShow").attr("src",d.shareIcon);
                    f.find("input[name='start']").val(dateTimeFormat(d.startTime));
                    f.find("input[name='end']").val(dateTimeFormat(d.endTime));
                }
//                end: () => {
//                    if (sessionStorage.getItem('user')) {
//                        let u = JSON.parse(sessionStorage.getItem('user'));
//                        u.state = (u.state === 'true');
//                        o.update(u);
//                        sessionStorage.removeItem('user');
//                    }
//                }
            });
        }
        
    });
    
    
    $('#add').click(() => {
        layer.open({
            title: '新建管理员',
            type: 2,
            content: ['../app/editBanner.html', 'no'],
            area: ['520px', '620px'],
        });
    });
    
    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('banner', {where: d.field});
        return false;
    });


    $('#refresh').click(() => t.reload('banner', {where: null}));
});