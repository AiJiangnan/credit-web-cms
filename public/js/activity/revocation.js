layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    t.render({
        id: 'revocation',
        elem: '#revocation',
        height: 'full-180',
        page: true,
        url: '/activity/revocation',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'batchId', title: '批次号', align: 'center', width: 270, sort: true},
            {field: 'revocationNum', title: '撤回成功数', align: 'center', width: 100},
            {field: 'unrevocationNum', title: '撤回失败数', align: 'center', width: 100},
            {field: 'operatorName', title: '操作人', align: 'center', width: 120, sort: true},
            {field: 'createTime', title: '创建时间', align: 'center', width: 170, sort: true,templet: d => dateFormat(d.createTime)},
            {field: 'updateTime', title: '修改时间', align: 'center', width: 170, sort: true,templet: d => dateFormat(d.updateTime)},
        ]]
    });

    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('revocation', {where: d.field});
        $('#allot').parent().hide('fast');
        return false;
    });

    t.on('sort(revocation)', o => {
        t.reload('revocation', {where: {sort: o.field, sortOrder: o.type}});
        $('#allot').parent().hide('fast');
    });

    t.on('checkbox(revocation)', o => {
        const d = t.checkStatus('revocation');
        if (d.data.length > 0) {
            $('#allot').parent().show('fast');
        } else {
            $('#allot').parent().hide('fast');
        }
    });

})
;