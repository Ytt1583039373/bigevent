// 加载layui的form模块
var form = layui.form;

// ------------------ 完成数据回填 -------------------------
function renderUser() {
    $.ajax({
        url: '/my/user/userinfo',
        success: function(res) {
            // console.log(res)
            if (res.status === 0) {
                // 数据回填
                // 使用layui提供的数据回填方法
                // form.val('表单的lay-filter属性值', '对象形式的数据(对象的key要和表单各项的name属性值相同)');
                form.val('user', res.data);
            }
        }
    })
}
renderUser();
$('#userInfo').on('submit', function(e) {
    e.preventDefault()
    var data = $(this).serialize()
    $.ajax({
        type: 'POST',
        url: '/my/user/userinfo',
        data: data,
        success: function(res) {
            // 无论成功还是失败，都要提示
            layer.msg(res.message);
            if (res.status === 0) {
                window.parent.getUserInfo();
            }
        }
    });
})
$('#reset').on('click', function(e) {
    e.preventDefault()
    renderUser();
})