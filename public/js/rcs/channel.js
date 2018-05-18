layui.use('table', () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    t.render({
        id: 'channel',
        elem: '#channel',
        height: 'full-70',
        page: constants.LAYUIPAGE,
        url: '/risk/channel',
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'channelName', title: '渠道名称', align: 'center', width: 100, edit: 'text'},
            {field: 'closed', title: '状态', align: 'center', width: 100, templet: '#closed'},
            {field: 'updateTime', title: '修改日期', align: 'center', width: 160, templet: d => dateTimeFormat(d.updateTime)},
            {title: '操作', width: 200, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(channel)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'onoff') {
            let s = d.closed;
            const m = '<span style="color:red;">' + (!s ? '停用' : '启用') + '</span>';
            layer.confirm(`你确定要${m}该渠道！`, constants.WARM, i => {
                $.post('/risk/channel', {id: d.id, closed: !s}, data => {
                    if (data.code === 0) {
                        layer.msg(`渠道${m}成功！`, constants.SUCCESS);
                        o.update({closed: !s});
                        return;
                    }
                    layer.msg(`渠道${m}失败！`, constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要' + r`删除` + '该渠道吗？', constants.FAIL, i => {
                $.post('/risk/channel/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('渠道删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });

    $('#add').click(() => {
        layer.prompt({title: '请输入渠道名'}, (v, i, e) => {
            $.post('/risk/channel', {channelName: v, closed: 0}, d => {
                if (d.code === 0) {
                    layer.msg(d.data, constants.SUCCESS);
                    t.reload('channel');
                } else {
                    layer.msg(d.msg, constants.ERROR);
                }
            }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            layer.close(i);
        });
    });

    $('#refresh').click(() => t.reload('channel', {where: null}));

    t.on('edit(channel)', o => {
        const [id, v] = [o.data.id, o.value];
        $.post('/risk/channel', {id: id, channelName: v}, d => {
            if (d.code === 0) {
                layer.msg(d.data, constants.SUCCESS);
            } else {
                layer.msg(d.msg, constants.ERROR);
                t.reload('channel');
            }
        }).fail(() => layer.msg('服务器错误！', constants.FAIL));
    });

    f.on('submit(submit)', d => {
        t.reload('channel', {page: {curr: 1}, where: d.field});
        return false;
    });

    t.on('sort(channel)', o => t.reload('channel', {where: {sort: o.field, sortOrder: o.type}}));
});