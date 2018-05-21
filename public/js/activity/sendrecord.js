layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'send',
        elem: '#send',
        height: 'full-180',
        page: true,
        url: '/activity/send',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'batchId', title: '批次号', align: 'center', width: 270, sort: true},
            {field: 'sendNum', title: '发送数量', align: 'center', width: 100},
            {field: 'operatorName', title: '操作人', align: 'center', width: 120, sort: true},
            {field: 'createTime', title: '创建时间', align: 'center', width: 170, sort: true,templet: d => dateFormat(d.createTime)},
            {field: 'updateTime', title: '修改时间', align: 'center', width: 170, sort: true,templet: d => dateFormat(d.updateTime)},
            {title: '操作', width: 120, align: 'center', toolbar: '#tool'}
        ]]
    });

    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('send', {where: d.field});
        $('#allot').parent().hide('fast');
        return false;
    });

    t.on('tool(send)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'revocation') {
            layer.confirm('你确定要' + r`撤回` + '该优惠券活动吗？', constants.FAIL, i => {
                $.post('/activity/'+d.batchId, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('优惠券删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            })
        }

    });

});