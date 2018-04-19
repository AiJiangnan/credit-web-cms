layui.use(['tree', 'form', 'laytpl'], () => {
    const [$, f, p] = [layui.jquery, layui.form, parent];

    $.get('/resource', d => load(d.data));

    f.on('submit(submit)', d => {
        $.post('/resource', d.field, data => {
            if (data.code === 0) {
                reload();
                $('#setting').hide('fast');
                p.layer.msg(data.data, {icon: 1});
                return;
            }
            p.layer.msg(data.msg, {icon: 2});
        });
        return false;
    });

    $('#add').click(() => {
        $('form')[0].reset();
        $.get('/resource', d => laytplrender(parentIdTpl, 'parentIdView', d.data));
        $('#delete').addClass('layui-btn-disabled');
        $('#delete').removeAttr('data-id');
        $('#setting').show('fast');
    });

    $('#delete').click(() => {
        let id = $('#delete').attr('data-id');
        if (id) {
            layer.confirm('你确定要' + r`删除` + '该菜单吗？', {icon: 5}, i => {
                $.post('/resource/' + id, data => {
                    if (data.code === 0) {
                        reload();
                        $('#setting').hide('fast');
                        layer.msg(data.data, {icon: 1});
                        return;
                    }
                    layer.msg('菜单删除失败！', {icon: 2});
                });
                layer.close(i);
            });
        }
    });

    $('#refresh').click(() => {
        reload();
    });

    $('#cancel').click(() => {
        $('#setting').hide('fast');
    });

    const load = data => {
        $('#menu').html('');
        layui.tree({
            elem: '#menu',
            nodes: data,
            click: n => {
                $('#setting').show('fast');
                laytplrender(parentIdTpl, 'parentIdView', data);
                for (let k in n) {
                    $('[name="' + k + '"]').val(n[k]);
                }
                $(':input[type="number"]').val(n.listOrder);
                $('#delete').removeClass('layui-btn-disabled');
                $('#delete').attr('data-id', n.id);
                f.render();
            }
        });
    };

    const reload = () => $.get('/resource', d => load(d.data));

});