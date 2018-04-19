layui.use('form', () => {
    const [$, form] = [layui.jquery, layui.form];
    form.on('submit(login)', formData => {
        $.post('login', formData.field, data => {
            if (data === 0) {
                location = "main.html";
            } else {
                layer.msg(data, constants.FAIL);
            }
        }).fail(() => layer.msg('服务器错误！'), constants.FAIL);
        return false;
    });
});