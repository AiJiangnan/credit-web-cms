// 颜色标签
const r = str => `<span style="color:red;">${str}</span>`;
const g = str => `<span style="color:green;">${str}</span>`;
const constants = {
    // 表单输入日期范围格式
    DATE_RANGE: 'yyyyMMdd',
    // 状态
    STATUS: {
        // 还款状态
        wait_repayment: '待还款',
        already_repayment: '已还款',
        overdue_wait_repayment: '逾期未还款',
        overdue_already_repayment: '逾期结清',
        repaying: '还款中',
        // 批次状态
        no_pay: '生成批次未放款',
        no_confirm: '放款未查询',
        pay_again: '需再次划扣',
        processing: '处理中',
        finish: '处理完成',
        // 放款状态（批次详情状态）
        loaning: '放款中',
        successed: '放款成功',
        failed: '放款失败',
        second: '待再次划扣',
        // 合同状态枚举
        unconfirm: '未确认',
        confirmed: '已确认',
        canceled: '已取消',
        // 审核
        wait_audit: '待审核',
        pass_loan: '通过审核',
        refuse_loan: r`拒贷`,
        person_audit: '进入人工审核',
        // 审批减免
        pass: g`批准`,
        no_pass: '驳回',
        undo: r`未审批`,
        // 划扣平台
        REAPAL: '融宝',
        UCF: '先锋'
    },
    // 弹出图标示意
    WARM: {icon: 0},
    SUCCESS: {icon: 1},
    ERROR: {icon: 2},
    CONFIRM: {icon: 3},
    LOCK: {icon: 4},
    FAIL: {icon: 5},
    HAPPY: {icon: 6}
};

/**
 * 获取状态
 * @param str
 */
const getStatus = str => constants.STATUS[str];
const getProductType = str => {
    if (str === '1') {
        return '7天';
    } else if (str === '2') {
        return '14天';
    } else {
        return r`数据错误`;
    }
};
/**
 * 非空判断
 * @param obj
 */
const check = obj => {
    for (let k in obj) {
        obj[k] = obj[k] ? obj[k] : Number.isFinite(obj[k]) ? 0 : '-';
    }
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
const alertinfo = info => parent.layer.open({type: 0, title: false, btn: false, content: info, shade: 0.1, shadeClose: true, anim: 5, isOutAnim: false, resize: false});

/**
 * 将详细地址缩写成省（自治区）市（区、自治州）
 * @param address
 * @returns {*|string}
 */
const lessaddress = address => {
    const exec = (/.*?(省|自治区)/.exec(address) ? /.*?(市|自治州)/ : /.*?区/).exec(address);
    return exec ? exec[0] : r`无有效地址`;
};

/**
 * 人民币金额格式化
 * @param rmb
 */
const rmbFormat = rmb => {
    if (Number.isFinite(rmb)) {
        return Math.round(rmb * 100) / 100;
    }
    return '0.00';
};

/**
 * 日期格式化
 * @param str
 * @returns {string}
 */
const dateFormat = str => {
    if (!str) return '-';
    const date = new Date();
    date.setTime(str);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

/**
 * 日期时间格式化
 * @param str
 * @returns {string}
 */
const dateTimeFormat = str => {
    if (!str) return '-';
    const date = new Date();
    date.setTime(str);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

/**
 * 获取URL中GET参数
 * @param name
 * @returns {name}
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
