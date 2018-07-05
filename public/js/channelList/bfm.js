layui.use(['table', 'laydate'], () => {

        const [$, t, f] = [layui.jquery, layui.table, layui.form];

        layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

        t.render({
            id: 'bfm',
            elem: '#bfm',
            height: 'full-80',
            page: constants.LAYUIPAGE,
            url: '/channel/data?sourceType=53',
            cols: [[
                {type: 'numbers', title: '序号'},
                {field: 'date', title: '日期', align: 'center', width: 100},
                {field: 'registerCount', title: '注册数', align: 'center', width: 80},
                {field: 'applyCount', title: '进件数', align: 'center', width: 100},
                {field: 'confirmNum', title: '批贷数', align: 'center', width: 100},
                {
                    field: 'confirmAmount',
                    title: '批货额（单位：万）',
                    align: 'center',
                    width: 180,
                    templet: d => rmbFormat(d.confirmAmount)
                },
                {field: 'sourceType', title: '渠道号', align: 'center', width: 100, templet: d => getChannel(d.sourceType)}
            ]]
        });

        f.on('submit(submit)', d => {
            t.reload('bfm', {page: {curr: 1}, where: d.field});
            return false;
        });


    }
)