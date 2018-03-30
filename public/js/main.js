layui.use('jquery', () => {
    const $ = layui.jquery;
    let flag = true;
    $.post('show', u => {
        $('#name').html(u.realname);
        $.get('user/menu', p => {
            laytplrender(menu, 'menu-view', p);
            elem();
        });
    });

    $('#tit').click(() => {
        let step = 5;
        let w1 = flag ? 0 : -200;
        let w2 = flag ? 200 : 0;
        let id = setInterval(() => {
            w1 = flag ? w1 - step : w1 + step;
            w2 = flag ? w2 - step : w2 + step;
            $('.layui-side').css('left', w1);
            $('.layui-body').css('left', w2);
            $('.layui-footer').css('left', w2);
            if (flag && (w1 === -200 || w2 === 0) || w1 === 0 || w2 === 200) {
                flag = !flag;
                clearInterval(id);
            }
        }, 1);
    });
});

const elem = () => layui.use('element', () => {
    const e = layui.element;
    e.on('nav(menu)', m => {
        if (hasTab(m[0].id)) {
            e.tabChange('tab', m[0].id);
        } else {
            e.tabAdd('tab', {
                id: m[0].id,
                title: m[0].textContent + ' <i class="layui-icon layui-tab-close" onclick="deleteTab(' + m[0].id + ')">&#x1006;</i>',
                content: '<iframe frameborder="0" scrolling="no" style="width:100%;" src="' + m[0].attributes[1].value + '"></iframe>'
            });
            e.tabChange('tab', m[0].id);
        }

        frameWH();
        layui.jquery(window).resize(function () {
            frameWH();
        });
    });
});

const deleteTab = id => layui.element.tabDelete('tab', id);
const frameWH = () => layui.jquery("iframe").css("height", layui.jquery('.layui-tab-card').height() - 48 + "px");