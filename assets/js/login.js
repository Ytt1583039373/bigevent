//--------------------------两个盒子的切换功能-----------------------------------
$('.login a').on('click', function() {
    $('.login').hide().next().show()
})
$('.register a').on('click', function() {
    $('.login').show().next().hide()
});
//---------------------注册功能--------------------
//表单提交 =>阻止默认行为=>收集表单数据=>ajax
$('.register form').on('submit', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: '/api/reguser',
        data: data,
        success: function(res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 转换为dom对象 调用reset方法(dom方法)清空表单
                $('.register form')[0].reset()
                    //登录盒子显示 注册盒子隐藏
                $('.login').show().next().hide()
            }
        }

    })
});
//--------------自定义表单验证--------------------------
//使用layui的-form 模块
//只要使用layui 模块必须先加载
var form = layui.form;
form.verify({
    //键(验证规则):值(验证方法)
    user: [/^[a-zA-Z0-9]{2,10}$/, '用户名只能是数组字母,且2~10位'],
    len: [/^\S{6,12}$/, '密码6~12位且不能有空格'],
    same: function(val) {
        //形参表示使用该验证规则的输入框的值(谁用这个规则,val的值就是谁的值)
        if (val !== $('.pwd').val()) {
            return '两次密码不一致'
        }
    }
});