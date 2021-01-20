//项目通用文件
var baseUrl = 'http://www.itcbc.com:8080';
$.ajaxPrefilter(function(option) {
    option.url = baseUrl + option.url;
    //headers 公共样式
    option.headers = {
        Authorization: localStorage.getItem('token')
    };
    // 判断complete 身份如果身份认证失败跳转回 登录页面
    option.complete = function(xhr) {
        var res = xhr.responseJSON;
        if (res && res.status === 1 && res.message === '身份认证失败！') {
            // 清除掉过期的token
            localStorage.removeItem('token');
            // 跳转到登录页 (location.pathname 表示url的路径部分)
            if (location.pathname === '/index.html') {
                location.href = './login.html';
            } else {
                window.parent.location.href = '../login.html';
            }
        }
        // 其他错误
        if (res && res.status === 1) {
            layer.msg(res.message);
        }
    }
})