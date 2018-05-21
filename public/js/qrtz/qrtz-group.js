layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];
    t.render({
        id: 'qrtz-group',
        elem: '#qrtz-group',
        height: 'full-120',
        page: false,
        url: '/qrtzTriggerGroup/selectList',
        cols: [[
            {field: 'id', title: 'ID', align: 'center', width: 100},
            {field: 'name', title: '名称', align: 'center', width: 100},
            {field: 'title', title: '标题', align: 'center', width: 100},
            {field: 'addressList', title: '地址列表', align: 'center', width: 100},
            {field: 'createTime', title: '创建时间', align: 'center', width: 100,templet: d => dateFormat(d.createTime,)}
        ]]
    });
});