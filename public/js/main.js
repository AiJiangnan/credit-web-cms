layui.config({
    base: '../js/layui/app/'
}).use('app', function () {
    const $ = layui.jquery;
    layui.app.set({type: 'iframe'});

    $.get('/user/show', data => $('#show').html(data));

    $.get('menus', data => {
        const [l, g] = [layui.laytpl, menusTpl.innerHTML];
        l(g).render(data, h => $('#menuView').html(h));
        layui.element.init();
        layui.app.init();
    }).fail(() => location = '/');

    // 初始化渠道信息
    $.get('/channel/all', d => {
        let channel = [];
        if (d.code === 0) {
            d.data.map((e, i) => {
                if (e.channelNumber) channel.push({code: e.channelNumber, name: e.channelName});
            });
            sessionStorage.setItem('channel', JSON.stringify(channel));
        } else {
            layer.msg('没有获取到渠道信息！', constants.ERROR);
        }
    });

    if (!sessionStorage.getItem("layer")) {
        layer.open({
            type: 1,
            title: false,
            closeBtn: false,
            area: '300px;',
            shade: 0.8,
            btn: ['取消'],
            btnAlign: 'c',
            moveType: 1,
            content: '<div style="padding: 30px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;">够范科技管理系统<br><br>欢迎使用够范科技新系统！<br>有什么问题及时反馈，够范科技开发人员将全力维护、升级。<br><br> ^_^</div>'
        });
    }
    sessionStorage.setItem("layer", true);
});