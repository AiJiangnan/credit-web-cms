layui.use(['table', 'laydate'], () => {

        const [$, t, f] = [layui.jquery, layui.table, layui.form];

        layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

        t.render({
            id: 'statis',
            elem: '#statis',
            height: 'full-80',
            page: constants.LAYUIPAGE,
            url: '/channel/data',
            cols: [[
                // {type: 'checkbox'},
                {type: 'numbers', title: '序号'},
                {field: 'date', title: '日期', align: 'center', width: 100},
                {
                    field: 'registerCount',
                    title: '注册数',
                    align: 'center',
                    width: 80,
                    templet: d => d.registerCount ? d.registerCount : '0'
                },
                {
                    field: 'applyCount',
                    title: '进件数',
                    align: 'center',
                    width: 100,
                    templet: d => d.applyCount ? d.applyCount : '0'
                },
                {
                    field: 'confirmNum',
                    title: '批贷数',
                    align: 'center',
                    width: 100,
                    templet: d => d.confirmNum ? d.confirmNum : '0'
                },
                {field: 'confirmAmount', title: '批货额（单位：万）', align: 'center', width: 180},
                {field: 'sourceType', title: '渠道号', align: 'center', width: 100, templet: d => getChannel(d.sourceType)}
            ]]
        });

        f.on('submit(submit)', d => {
            t.reload('statis', {page: {curr: 1}, where: d.field});
            return false;
        });


    }
)