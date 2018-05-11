layui.use(['element', 'table', 'form'], () => {
    const [$, e, f, t] = [layui.jquery, layui.element, layui.form, layui.table];
    const [applyId, applyNo, userId] = [getQueryStr('applyId'), getQueryStr('applyNo'), getQueryStr('userId')];


    $.get('/info/operator/' + userId, d => {
        if (d.code === 0) {
            check(d.data.reportVo);
            check(d.data.behaviorDetection);
            laytplrender(reportTpl, 'reportView', d.data.reportVo);
            laytplrender(monthTpl, 'monthView', d.data.monthlyBillList);
            laytplrender(fraudTpl, 'fraudView', d.data.fraudDetection);
            laytplrender(behaviorTpl, 'behaviorView', d.data.behaviorDetection);
            laytplrender(linkTpl, 'linkView', d.data.emergencyContactVo);
        }
    });

    $.get('/info/applyinfo/' + userId, {applyId: applyId}, d => {
        if (d.code === 0) {
            check(d.data);
            laytplrender(applyInfoTpl, 'applyInfoView', d.data);
        }
    });

    f.on('submit(submit)', d => {
        $.get('/info/phonelog/' + userId + '?' + $('.layui-form').serialize(), d => {
            if (d.code === 0) {
                $('#rate').html(d.data.proportion + '%');
                laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
            }
        });
        return false;
    });

    f.on('submit(c-submit)', d => {
        d.field.page = 1;
        t.reload('contacts', {where: d.field});
        return false;
    });

    e.on('tab(tab)', data => {
        const i = data.index;
        if (i === 0) {
            $.get('/info/operator/' + userId, d => {
                if (d.code === 0) {
                    check(d.data.reportVo);
                    laytplrender(reportTpl, 'reportView', d.data.reportVo);
                }
            });
        }
        if (i === 1) {
            $.get('/info/phonelog/' + userId, d => {
                if (d.code === 0) {
                    $('#rate').html(d.data.proportion + '%');
                    laytplrender(phonelogTpl, 'phonelogView', d.data.contactList);
                }
            });
        }
        if (i === 2) {
            t.render({
                id: 'contacts',
                elem: '#contacts',
                // height: 'full-180',
                page: true,
                url: '/info/contacts/' + userId,
                cols: [[
                    {type: 'checkbox'},
                    {type: 'numbers', title: '序号'},
                    {field: 'name', title: '姓名', align: 'center', width: 180},
                    {field: 'phone', title: '手机号码', align: 'center', width: 160, templet: d => d.phone.replace(',', '')},
                ]]
            });
        }
        if (i === 3) {

        }
        if (i === 4) {
            $.get('/info/idcard/' + userId, d => {
                if (d.code === 0) {
                    $('#idcard').attr('src', d.data.idcardFrontSide);
                    $('#idcardback').attr('src', d.data.idcardBackSide);
                }
            });
        }
    });

});