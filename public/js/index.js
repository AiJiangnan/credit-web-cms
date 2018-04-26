layui.use('form', () => {
    const [$, form] = [layui.jquery, layui.form];
    form.on('submit(login)', formData => {
        $.post('/user/login', formData.field, data => {
            if (data === 0) {
                location = "main.html";
            } else {
                layer.msg(data, constants.FAIL);
            }
        }).fail(() => {
            console.log('login error!');
            location = '/'
        });
        return false;
    });
});