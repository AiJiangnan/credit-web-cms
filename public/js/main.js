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

    $('#show').click(() => {
        layer.open({
            title: '修改密码',
            type: 2,
            content: '/system/password.html',
            area: ['300px', '240px'],
            btn: ['确认', '取消'],
            yes: (i, l) => {
                let f = layer.getChildFrame('form', i);
                const pwd = f.find('[name="password"]').val();
                const oldpwd = f.find('[name="oldpassword"]').val();
                const repwd = f.find('[name="check"]').val();
                if (pwd === '' || repwd === '' || oldpwd === '') {
                    layer.msg('必填项不能为空！', constants.LOCK);
                    return;
                }
                if (!(/(.+){6,12}$/.test(pwd))) {
                    layer.msg('密码必须6到12位！', constants.LOCK);
                    return;
                }
                if (pwd !== repwd) {
                    layer.msg('两次密码输入不一致！', constants.LOCK);
                    return;
                }
                $.post('/user/password', {password: pwd, oldpassword: oldpwd}, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        layer.close(i);
                        location = '/';
                    } else {
                        layer.msg(data.msg, constants.ERROR);
                    }
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
            },
            btn2: (i, l) => {
                layer.close(i);
            }
        });
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