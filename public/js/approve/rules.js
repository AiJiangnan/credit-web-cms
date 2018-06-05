layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    f.on('submit(submit)', d => {
        $.get('/risk/rules/' + d.field.applyNum, d => {
            if (d.code === 0) {
                console.log(d.data)
                laytplrender(rulesTpl, 'rulesView', d.data);
                laytplrender(resultsTpl, 'resultsView', d.data.riskResults);
            }
        });
        return false;

    });
});


/*
t.render({
    id: 'rules',
    elem: '#rules',
    height: 'full-180',
    url: '/risk/rules/' + d.field.applyNum,
    cols: [[
        {type: 'checkbox'},
        {type: 'numbers', title: '序号'},
        {field: 'whetherWhiteList', title: '是否白名单用户', align: 'center', width: 100, templet: d => d.whetherWhiteList ? '是' : '否'},
        {field: 'whetherXjbkLoans', title: '是否现金白卡复贷用户', align: 'center', width: 100, templet: d => d.whetherXjbkLoans ? '是' : '否'},
        {field: 'whetherChangePhone', title: '是否更换手机号用户', align: 'center', width: 100, templet: d => d.whetherChangePhone ? '是' : '否'}
    ]]
});*/
