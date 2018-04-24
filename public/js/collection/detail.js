layui.use(['element', 'table'], () => {
    const [$, e, t] = [layui.jquery, layui.element, layui.table];

    const applyId = getQueryStr('applyId');
    const applyNo = getQueryStr('applyNo');
    const userId = getQueryStr('userId');
    const from = getQueryStr('from');

    laytplrender(setTpl, 'setView', from);

    t.render({
        id: 'collectlog',
        elem: '#collectlog',
        url: '/collect/log/' + applyId,
        page: false,
        cols: [[
            {type: 'numbers', title: '序号'},
            {field: 'important', title: '是否重要', align: 'center', width: 100, templet: d => d.important ? r`是` : '否'},
            {field: 'remindTime', title: '提醒日期', align: 'center', width: 100, templet: d => dateFormat(d.remindTime)},
            {field: 'createTime', title: '添加时间', align: 'center', width: 160, templet: d => dateTimeFormat(d.createTime)},
            {field: 'applyNo', title: '申请编号', align: 'center', width: 120, templet: d => applyNo},
            {field: 'name', title: '客户姓名', align: 'center', width: 100},
            {field: 'collectUser', title: '催收人员', align: 'center', width: 100},
            {field: 'collectStateRemark', title: '催收状态', align: 'center', width: 180},
            {field: 'collectRemark', title: '催收记录', align: 'center', width: 180}
        ]]
    });

    $('#repay').click(() => {
        layer.open({
            title: '划扣',
            type: 2,
            content: [`/collection/deal/repay.html?applyId=${applyId}&userId=${userId}`, 'no'],
            area: ['360px', '260px']
        });
    });

    $('#todeal').click(() => {
        layer.open({
            title: '划扣',
            type: 2,
            content: [`/collection/deal/todeal.html?applyId=${applyId}&userId=${userId}`, 'no'],
            area: ['320px', '380px']
        });
    });

    $('#log').click(() => {
        layer.open({
            title: '添加催收记录',
            type: 2,
            content: [`/collection/deal/collectlog.html?applyId=${applyId}`, 'no'],
            area: ['380px', '380px']
        });
    });

    $('#reduce').click(() => {
        layer.open({
            title: '添加减免申请',
            type: 2,
            content: [`/collection/deal/reduce.html?applyId=${applyId}`, 'no'],
            area: ['280px', '200px']
        });
    });

    $('#part').click(() => {
        layer.prompt({title: '部分还款金额'}, (v, i, e) => {
            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(v)) {
                layer.msg('输入金额有误！', constants.LOCK);
                return;
            }
            $.post('/repayment/part', {applyId: applyId, partAmount: v}, d => {
                if (d.code === 0) {
                    layer.msg(d.data, constants.SUCCESS);
                } else {
                    layer.msg(d.msg, constants.ERROR);
                }
            }).fail(() => layer.msg('服务器错误！', constants.FAIL));
            layer.close(i);
        });
    });

    e.on('collapse()', d => {
        if (!d.show) return;
        const id = d.title.attr('id');
        if (id === 'c1') {

        }
        if (id === 'c2') {

        }
        if (id === 'c3') {

        }
        if (id === 'c4') {

        }
        if (id === 'c5') {

        }
        if (id === 'c6') {

        }
        if (id === 'c7') {
            t.reload('collectlog');
        }
    });

    e.on('nav(detail)', e => {
        const id = $(e).attr('id');
        if (id === 'n1') {
            $('#page1').show('fast');
            $('#page2').hide('fast');
        } else if (id === 'n2') {
            $('#page1').hide('fast');
            $('#page2').show('fast');
        }
    });

});