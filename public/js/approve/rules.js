layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    f.on('submit(submit)', d => {
        $.get('/risk/rules/' + d.field.applyNum, d => {
            if (d.code === 0) {
                laytplrender(rulesTpl, 'rulesView', d.data);
                laytplrender(resultsTpl, 'resultsView', d.data.riskResults);
            }
        });
        return false;

    });
});

