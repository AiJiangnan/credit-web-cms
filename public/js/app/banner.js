layui.use('table', () => {
	
	 const appConstants = {
	    	    STATUS: {
	    	    	  credit: '分期',
	    	    	  mall: '商城',
	    	    }
	    	};
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'banner',
        elem: '#banner',
        height: 'full-70',
        page: constants.LAYUIPAGE,
        url: '/app/banner/list',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'channel', title: 'APP', align: 'center', width: 160,templet: d => appConstants.STATUS[d.channel]},
            {field: 'name', title: '名称', align: 'center', width: 160},
            {field: 'bannerDesc', title: '描述', align: 'center', width: 280},
            {field: 'orderNo', title: '排序', align: 'center', width: 110},
            {field: 'startTime', title: '起始时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.startTime)},
            {field: 'endTime', title: '终止时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.endTime)},
            {field: 'status', title: '状态', align: 'center', width: 130, templet: '#status'},
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
                area: ['520px', '640px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                    	console.log(k+"："+d[k])
                    	if (k === 'status') continue;
                    	if (k === 'channel') continue;
                    	if (k === 'applyCreditScore'&&d[k] == '0') continue;
                        if (k === 'startTime' || k === 'endTime') {
                            continue;
                        }
                        f.find("input[name='" + k + "']").val(d[k]);

                    }
                    f.find("input[name='status'][value=" + d.status + "]").prop('checked', true);
                    f.find("input[name='channel'][value=" + d.channel + "]").prop('checked', true);
                    f.find("option[value='" + d.applyCreditScoreRank + "']").prop('selected', true);
                    f.find("#imgLinkShow").attr("src", d.imgLink);
                    if(d.shareIcon){
                    	console.log("ddd")
                    	f.find("#shareIconShow").attr("src", d.shareIcon);
                    	f.find("#shareIconShow").removeClass("layui-hide");
                    }
                    
                    f.find("input[name='start']").val(dateTimeFormat(d.startTime));
                    f.find("input[name='end']").val(dateTimeFormat(d.endTime));
                },
                end: () => getSession('editBanner', d => o.update(d))
            });
        }

    });


    $('#add').click(() => {
        layer.open({
            title: '新建轮播图',
            type: 2,
            content: ['../app/editBanner.html', 'no'],
            area: ['520px', '620px'],
            end: () => t.reload('banner', {where: null})
        });
    });

    f.on('submit(submit)', d => {
        t.reload('banner', {page: {curr: 1}, where: d.field});
        return false;
    });


    $('#refresh').click(() => t.reload('banner', {where: null}));
});