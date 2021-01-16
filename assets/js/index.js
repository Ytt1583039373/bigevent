//获取用户信息
//修改昵称和修改头像以后需要再次调用
function getUserInfo() {
    //获取个人信息接口
    $.ajax({
        url: '/my/user/userinfo',
        success: function(res) {
            if (res.status === 0) {
                var name = res.data.nicknamed || res.data.username
                $('.username').text(name)
            }
            //设置头像(优先使用)
            if (res.data.user_pic) {
                //说明有图片
                $('.layui-nav-img').attr('src', res.data.user_pic).show()
                $('.text-avatar').hide()
            } else {
                var first = name.substr(0, 1).toUpperCase()
                $('.text-avatar').text(first).css('display', 'inline-block')
            }
        }
    })
}
getUserInfo();
//点击退出按钮 注册事件
$('#logoout').on('click', function(e) {
    //阻止a连接跳转
    e.preventDefault();
    //询问层确定退出之后 删除tonken 跳转到登录页
    layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function(index) {
        //do something
        localStorage.removeItem('token');
        location.href = './login.html'

        layer.close(index);
    });
})