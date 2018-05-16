layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    
    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    t.render({
        id: 'faceRecognition',
        elem: '#faceRecognition',
        height: 'full-120',
        page: true,
        url: '/customerCare/faceRecognition/list',
        cols: [[
             {type: 'numbers', title: '序号'},
            {field: 'idcardName', title: '用户名', align: 'center', width: 130},
            {field: 'idcardNumber', title: '反馈内容', align: 'center', width: 210},
            {field: 'confidence', title: '置信度', align: 'center', width: 160},
            {field: 'threshold', title: '对比参照值', align: 'center', width: 130},
            {field: 'errorMessage', title: '错误原因', align: 'center', width: 330},
            {field: 'createTime', title: '创建日期', align: 'center', width: 210,templet: d => dateTimeFormat(d.createTime)},
        ]]
    });

    t.on('tool(faceRecognition)', o => {
        let [e, d] = [o.event, o.data];
        check(d);
    });
    
    
    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('faceRecognition', {where: d.field});
        return false;
    });


    t.on('sort(faceRecognition)', o => t.reload('faceRecognition', {where: {sort: o.field, sortOrder: o.type}}));

});