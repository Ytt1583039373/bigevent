//  ----------------------------- 统一修改ajax选项 ---------------------------

var baseUrl = 'http://www.itcbc.com:8080';
$.ajaxPrefilter(function(option) {
    option.url = baseUrl + option.url;
    option.headers = {
        Authorization: localStorage.getItem('token')
    };
    option.complete = function(xhr) {
        var res = xhr.responseJSON;
        if (res && res.status === 1 && res.message == "身份认证失败！") {

            localStorage.removeItem('token');
            location.href = './login.html';
        }
    }
})

// ----------------------------- 获取分类，渲染到页面中 ---------------------------
function renderCategory() {
    $.ajax({
        url: '/my/category/list',
        success: function(res) {
            if (res.status === 0) {
                var html = template('tpl-list', res);
                $('tbody').html(html)
            }
        }
    })
}
renderCategory();
// ------------------------------------删除功能-------------------------
$('tbody').on('click', '.del', function() {
    var id = $(this).data('id');
    layer.confirm('你是否要删除吗？', function(index) {

        $.ajax({
            url: '/my/category/delete',
            data: { id: id },
            success: function(res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    renderCategory();
                }
            },
        })
        layer.close(index);
    })

});
// ------------------------------------添加功能-------------------------
// 声明一个变量，让它表示弹层；后面关闭弹层时会用到它。
var addIndex;
// 一、点击添加分类，实现弹层
$('button:contains("添加类别")').on('click', function() {
    addIndex = layer.open({
        type: 1,
        title: '添加类别',
        content: $('#tpl-add').html(), // 内容在HTML中
        area: ['500px', '250px'],
    });
});
$('body').on('submit', '#add-form', function(e) {
    e.preventDefault();
    // 规律：如果没有图片上传，一般都不使用FormData。
    // 具体：还得看接口要求
    var data = $(this).serialize(); // 一定要检查input是否有正确的name属性
    // ajax提交数据，完成添加
    console.log(data);
    $.ajax({
        type: 'POST',
        url: '/my/category/add',
        data: data,
        success: function(res) {
            // 无论成功失败，都提示
            layer.msg(res.message);
            // 添加成功
            if (res.status === 0) {
                renderCategory();
                // 关闭弹层
                layer.close(addIndex);
            }
        },
    });
});

// -----------------------------------------修改功能------------------------
var editIndex;
$('body').on('click', 'button:contains("编辑")', function() {
    // 获取事件源上的 三个 data-xxx 属性值
    var cont = $(this).data();
    // console.log(cont); // { name: 'xx', alias: 'xx', id: 2 }
    // editIndex 表示当前的弹层；关闭弹层的时候，需要用到它
    editIndex = layer.open({
        type: 1,
        title: '编辑文章分类',
        content: $('#tpl-edit').html(),
        area: ['500px', '250px'],
        // 弹层弹出后的回调，不要和ajax中的success弄混了
        success: function() {
            // 数据回填(不要忘记id)
            $('#edit-form input[name="name"]').val(cont.name);
            $('#edit-form input[name="alias"]').val(cont.alias);
            $('#edit-form input[name="id"]').val(cont.id);
        }
    });
});
$('body').on('submit', '#edit-form', function(e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        url: '/my/category/update',
        type: 'POST',
        data: data,
        success: function(res) {
            layer.msg(res.message)
            if (res.status === 0) {
                renderCategory();
            }
        }
    })
    layer.close(editIndex)
})