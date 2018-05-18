layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    
    const driveConstants = {
    	    STATUS: {
    	    	  1: '无更新',
    	    	  2: '可更新',
    	    	  3: '强制更新',
    	    }
    	};
    
    const typeConstants = {
    	    STATUS: {
    	    	  1: '安卓',
    	    	  2: 'IOS',
    	    }
    	};
    
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'version',
        elem: '#version',
        height: 'full-120',
        page: constants.LAYUIPAGE,
        url: '/app/version/list',
        cols: [[
             {type: 'numbers', title: '序号'},
            {field: 'versionName', title: '版本名称', align: 'center', width: 110},
            {field: 'type', title: '系统版本', align: 'center', width: 110,templet: d => typeConstants.STATUS[d.type]},
            {field: 'versionNum', title: '版本号', align: 'center', width: 110},
            {field: 'versionDate', title: '创建时间', align: 'center', width: 160,templet: d => dateTimeFormat(d.versionDate)},
            {field: 'versionStatus', title: '版本更新状态', align: 'center', width: 130,templet: d => driveConstants.STATUS[d.type]},
            {field: 'versionDesc', title: '版本说明', align: 'center', width: 180},
            {field: 'url', title: '版本地址', align: 'center', width: 200},
            {title: '操作', width: 160, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(version)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'del') {
            layer.confirm('确定要' + r`删除` + '该APP版本？', constants.FAIL, i => {
                $.post('/app/version/del/'+d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('版本删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });
    
    $('#add').click(() => {
        layer.open({
            title: '新建版本',
            type: 2,
            content: ['/app/addversion.html', 'no'],
            area: ['400px', '380px']
        });
    });
    f.on('submit(submit)', d => {
        t.reload('version', {page: {curr: 1}, where: d.field});
        return false;
    });


    t.on('sort(version)', o => t.reload('version', {where: {sort: o.field, sortOrder: o.type}}));

});