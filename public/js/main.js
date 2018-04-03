layui.config({
    base: '../js/layui/app/'
}).use('app', function () {
    const $ = layui.jquery;
    layui.app.set({
        type: 'iframe'
    }).init();

    $.get('show', data => $('#show').html(data));

    if (!sessionStorage.getItem("layer")) {
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            area: '300px;',
            shade: 0.8,
            id: 'LAY_layuipro',
            btn: ['取消'],
            btnAlign: 'c',
            moveType: 1,
            content: '<div style="padding: 30px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">够范科技管理系统<br><br>欢迎使用够范科技新系统！<br>有什么问题及时反馈，够范科技开发人员将全力维护、升级。<br><br> ^_^</div>'
        });
    }
    sessionStorage.setItem("layer", true);
});