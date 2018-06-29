layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});

    /**
     * 使用节点
     * @param str
     * @returns {string}
     */
    const getUseUodePoints = str => {
        if (str == '1') {
            return '放款时';
        } else if (str == '2') {
            return '还款时';
        } else {
            return r`数据错误`;
        }
    };

    /**
     * 获取优惠券类型
     * @param str
     * @returns {string}
     */
    const getType = str => {
        if (str == '-') {
            return '减免券';
        } else if (str == '*') {
            return '折扣券';
        } else if (str == '0') {
            return '免息券';
        } else {
            return r`数据错误`;
        }
    };

    /**
     * 获取优惠券信息状态
     * @param str
     * @returns {string}
     */
    const getCouponStatus = str => {
        if (str == 'on') {
            return '开启';
        } else if (str == 'off') {
            return '关闭';
        } else {
            return r`数据错误`;
        }
    };

    /**
     * 获取作用位置
     * @param str
     * @returns {string}
     */
    const getInteractionSite = str => {
        if (str == 'service_fee') {
            return '服务费';
        } else if (str == 'letter_fee') {
            return '信审费';
        } else if (str == 'interest') {
            return '利息';
        } else {
            return r`数据错误`;
        }
    };

    t.render({
        id: 'info',
        elem: '#info',
        height: 'full-180',
        page: true,
        url: '/activity/info',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'useUodePoints', title: '使用节点', align: 'center', width: 100, templet: d => getUseUodePoints(d.useUodePoints)},
            {field: 'type', title: '类型', align: 'center', width: 100, templet: d => getType(d.type)},
            {field: 'name', title: '优惠券名称', align: 'center', width: 120},
            {field: 'price', title: '优惠券金额', align: 'center', width: 120},
            {field: 'validity', title: '有效时长', align: 'center', width: 120,sort: true},
            {field: 'status', title: '状态', align: 'center', width: 120,sort: true,templet: d => getCouponStatus(d.status)},
            // {field: 'interactionSite', title: '作用位置', align: 'center', width: 120,templet: d => getInteractionSite(d.interactionSite)},
            {field: 'createTime', title: '创建时间', align: 'center', width: 170, sort: true,templet: d => dateFormat(d.createTime)},
            {field: 'updateTime', title: '修改时间', align: 'center', width: 170, sort: true,templet: d => dateFormat(d.updateTime)},
            {title: '操作', width: 140, align: 'center', toolbar: '#tool'}
        ]]
    });

    t.on('tool(coupon)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'upd') {
            layer.open({
                title: '修改优惠券',
                type: 2,
                content: ['/activity/updcouponinfo.html', 'no'],
                area: ['300px', '500px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        if (k === 'gender') continue;
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                    if (d.useUodePoints===1){
                        f.find("option[value='0']").remove();
                        f.find("option[value='interest']").remove();
                    }else if (d.useUodePoints===2){
                        f.find("option[value='letter_fee']").remove();
                        f.find("option[value='service_fee']").remove();
                    }
                    f.find("option[value='" + d.useUodePoints + "']").prop('selected', 'selected');
                    f.find("option[value='" + d.status + "']").prop('selected', 'selected');
                    // f.find("option[value='" + d.interactionSite + "']").prop('selected', 'selected');
                    f.find("option[value='" + d.type + "']").prop('selected', 'selected');
                    f.render();
                },
                end: () => {
                    if (sessionStorage.getItem('coupon')) {
                        let u = JSON.parse(sessionStorage.getItem('coupon'));
                        u.state = (u.state === 'true');
                        o.update(u);
                        sessionStorage.removeItem('coupon');
                    }
                }
            });
        }
        if (e === 'del') {
            layer.confirm('你确定要' + r`删除` + '该优惠券活动吗？', constants.FAIL, i => {
                $.post('/coupon/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('优惠券删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
    });

    $('#add').click(() => {
        layer.open({
            title: '新增优惠券',
            type: 2,
            content: ['/activity/addcouponinfo.html', 'no'],
            area: ['300px', '500px']
        });
    });

    $('#refresh').click(() => t.reload('info', {where: null}));

    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('info', {where: d.field});
        return false;
    });
});