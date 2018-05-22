layui.use(['table', 'laydate'], () => {
    const [$, t, f] = [layui.jquery, layui.table, layui.form];

    layui.laydate.render({elem: '#date1', range: true, format: constants.DATE_RANGE});
    layui.laydate.render({elem: '#date2', range: true, format: constants.DATE_RANGE});

    const getCouponName = id => {
        let res;
        $.ajax({
            url: '/coupon/' + id,
            async: false,
            success: p => {
                if (p.code === 0) {
                    res = p.data;
                }
            }
        });
        return res ? res : '-';
    };

    const getTaskTime  = (str1,str2,str3,str4,str5) => {
        var i=0;
        if (str1!=null){
            i+=1;
        }
        if (str2!=null){
            i+=2;
        }
        if (str3!=null){
            i+=4;
        }
        if (str4!=null){
            i+=8;
        }
        if (str5!=null){
            i+=16;
        }
        if (i==16) {
            return '每天'+str5+':00'
        } else if (i==20) {
            return '每周'+str3+'  '+str5+':00';
        } else if (i==24) {
            return '每月'+str4+'日'+str5+':00';
        } else if (i==22) {
            return '每年'+str2+'月'+'周'+str3+'  '+str5+':00';
        } else if (i==26) {
            return '每年'+str2+'月'+str4+'日'+str5+':00';
        } else if (i==23) {
            return str1+'年'+str2+'月'+'周'+str3+'  '+str5+':00';
        } else if (i==27) {
            return str1+'年'+str2+'月'+str4+'日'+str5+':00';
        } else {
            return r`数据错误`;
        }
    };

    /**
     * 获取定时任务状态
     * @param str
     * @returns {string}
     */
    const getTaskStatus = str => {
        if (str == 'on') {
            return '开启';
        } else if (str == 'off') {
            return '关闭';
        } else {
            return r`数据错误`;
        }
    };

    t.render({
        id: 'task',
        elem: '#task',
        height: 'full-180',
        page: true,
        url: '/activity/task',
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'},
            {field: 'name', title: '活动名称', align: 'center', width: 130},
            {field: 'couponName', title: '优惠券', align: 'center', width: 130, sort: true,templet: d => getCouponName(d.couponId)},
            {field: 'startTime', title: '开始时间', align: 'center', width: 110, sort: true,templet: d => dateFormat(d.startTime)},
            {field: 'endTime', title: '结束时间', align: 'center', width: 110, sort: true,templet: d => dateFormat(d.endTime)},
            {field: 'taskTime', title: '发送时间', align: 'center', width: 260,templet: d => getTaskTime(d.year,d.month,d.week,d.day,d.hour)},
            {field: 'status', title: '状态', align: 'center', width: 80, sort: true,templet: d => getTaskStatus(d.status)},
            {field: 'createTime', title: '创建时间', align: 'center', width: 110, sort: true,templet: d => dateFormat(d.createTime)},
            {field: 'updateTime', title: '修改时间', align: 'center', width: 110, sort: true,templet: d => dateFormat(d.updateTime)},
            {title: '操作', width: 200, align: 'center', toolbar: '#tool'}
        ]]
    });

    f.on('submit(submit)', d => {
        d.field.page = 1;
        t.reload('task', {where: d.field});
        $('#allot').parent().hide('fast');
        return false;
    });

    $('#add').click(() => {
        layer.open({
            title: '新增优惠券',
            type: 2,
            content: ['/activity/addcoupontask.html', 'no'],
            area: ['600px', '650px']
        });
    });

    $('#send').click(() => {
        layer.open({
            title: '发送优惠券',
            type: 2,
            content: ['/activity/sendcoupon.html', 'no'],
            area: ['300px', '450px']
        });
    });

    $('#refresh').click(() => t.reload('task', {where: null}));

    t.on('tool(task)', o => {
        let [e, d] = [o.event, o.data];
        if (e === 'upd') {
            layer.open({
                title: '修改定时任务',
                type: 2,
                content: ['/activity/updcoupontask.html?id='+d.id+"&couponid="+d.couponId, 'no'],
                area: ['550px', '650px'],
                success: (l, i) => {
                    let f = layer.getChildFrame('form', i);
                    for (let k in d) {
                        if (k === 'gender') continue;
                        f.find("input[name='" + k + "']").val(d[k]);
                    }
                    f.find("option[value='" + d.status + "']").prop('selected', true);
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
            layer.confirm('你确定要' + r`删除` + '该优惠券任务吗？', constants.FAIL, i => {
                $.post('/task/' + d.id, data => {
                    if (data.code === 0) {
                        layer.msg(data.data, constants.SUCCESS);
                        o.del();
                        return;
                    }
                    layer.msg('优惠券任务删除失败！', constants.ERROR);
                }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
                layer.close(i);
            });
        }
        if (e === 'couponuser') {
            layer.open({
                title: '展示优筛选信息',
                type: 2,
                content: ['/activity/couponuser.html?id='+d.id, 'no'],
                area: ['300px', '350px'],
                success: (l, i) => {
                },
            });
        }
    });
})
;