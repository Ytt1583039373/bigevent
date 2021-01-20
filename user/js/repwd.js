$('form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/my/user/updatepwd',
        data: data,
        success: function(res) {

            layer.msg(res.message);
            if (res.status === 0) {
                // 修改成功后，清空token，跳转到登录页，重新登录
                localStorage.removeItem('token');
                // 让父页面跳转
                window.parent.location.href = '../login.html';
            }
        }
    })
});
var form = layui.form;
// 1. 密码长度6~12位 （三个input都需要用）
// 2. 新密码和原密码不能一样 （新密码使用）
// 3. 两次新密码必须一致 （重复密码使用）

form.verify({
    // 1. 密码长度6~12位 （三个input都需要用）
    len: [/^\S{6,12}$/, '长度必须6~12位且不能出现空格'],

    // 2. 新密码和原密码不能一样 （新密码使用）
    diff: function(val) {
        if (val === $('input[name=oldPwd]').val()) {
            return '新密码不能和原密码一致'
        }
    },

    // 3. 两次新密码必须一致 （重复密码使用）
    same: function(val) {
        if (val !== $('input[name=newPwd]').val()) {
            return '两次新密码不一致';
        }
    }
});