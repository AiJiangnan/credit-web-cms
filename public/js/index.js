layui.use('form', () => {
    const [$, form] = [layui.jquery, layui.form];
    form.on('submit(login)', formData => {
        $.post('login', formData.field, data => {
            if (data === 0) {
                location = "main.html";
            } else {
                layer.msg(data, {icon: 5});
            }
        });
        return false;
    });
});