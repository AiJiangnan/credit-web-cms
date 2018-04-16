const constants = {
    // 表单输入日期范围格式
    DATE_RANGE: 'yyyyMMdd'
};

/**
 * 模板引擎
 * @param tpl 模板
 * @param viewId 视图ID
 * @param data 数据
 */
const laytplrender = (tpl, viewId, data) => layui.use('laytpl', () => {
    const [l, g, v] = [layui.laytpl, tpl.innerHTML, document.getElementById(viewId)];
    l(g).render(data, h => v.innerHTML = h);
});

/**
 * 父级页面弹窗，用于显示详情
 * @param info
 */
const alertinfo = info => {
    parent.layer.open({
        type: 0,
        title: false,
        btn: false,
        content: info,
        shade: 0.1,
        shadeClose: true,
        anim: 5,
        isOutAnim: false,
        resize: false
    });
};

/**
 * 将详细地址缩写成省（自治区）市（区、自治州）
 * @param address
 * @returns {*|string}
 */
const lessaddress = address => {
    const exec = (/.*?(省|自治区)/.exec(address) ? /.*?(市|自治州)/ : /.*?区/).exec(address);
    return exec ? exec[0] : '<span style="color:red;">无有效地址</span>';
};

/**
 * 日期格式化
 * @param str
 * @returns {string}
 */
const dateFormat = str => {
    const date = new Date();
    date.setTime(str);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 日期时间格式化
 * @param str
 * @returns {string}
 */
const dateTimeFormat = str => {
    const date = new Date();
    date.setTime(str);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

/**
 * 获取URL中GET参数
 * @param name
 * @returns {any}
 */
const getQueryStr = name => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const res = location.search.substr(1).match(reg);
    return res != null ? decodeURIComponent(res[2]) : null;
};

layui.use('jquery', () => {
    const $ = layui.jquery;
    $('.morebtn').click(() => {
        $('.morebtn');
        if ($('.morebtn').hasClass('in')) {
            $('#more').hide('slow');
            $('#more').children().children(':text').map((i, e) => $(e).val(''));
            $('.morebtn').removeClass('in');
            $('.morebtn').children().html('&#xe61a;');
        } else {
            $('#more').show('slow');
            $('.morebtn').addClass('in');
            $('.morebtn').children().html('&#xe619;');
        }
    });
});
