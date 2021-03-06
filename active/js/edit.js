let form = layui.form;
var id = new URLSearchParams(location.search).get('id')


//--------------------------处理分封面图片-----------------------

var $image = $('#image');
var option = {
    // 宽高比
    aspectRatio: 400 / 280,
    autoCropArea: 1, // 让剪裁框铺满整个剪裁区
    // 设置预览区的选择器
    preview: '.img-preview'
};
$image.cropper(option);
//点击选择封面 触发文件域点击
$('button:contains("选择封面")').on('click', function() {
    $('#file').trigger('click')
});
$('#file').on('change', function() {
    var fileObj = this.files[0]
    var url = URL.createObjectURL(fileObj);
    $image.cropper('destroy').attr('src', url).cropper(option)
});
// -----------------------------------获取下拉框数据 渲染到页面--------------------------------

$.ajax({
    url: '/my/category/list',
    success: function(res) {
        var str = template('tpl-category', res);
        $('select[name="cate_id"]').html(str)
        form.render('select');
        $.ajax({
            // url: '/my/article/:id', // 把 :id 换成真实的id即可
            url: '/my/article/' + id,
            success: function(res) {
                // console.log(res);
                // 获取到详情后，做数据回填 (使用layui提供的 form.val())
                form.val('article', res.data);
                // 一定先做数据回填，然后在把 textarea 换成 富文本编辑器
                initEditor();
                // 更换图片(销毁剪裁区 --> 更换图片 --> 重建剪裁区)
                $image.cropper('destroy').attr('src', baseUrl + '/' + res.data.cover_img).cropper(option);
            }
        });
    }
});


//-----------------------------------------完成添加文章-----------------------------------------
$('#add-form').on('submit', function(e) {
    e.preventDefault();
    // 收集表单数据(必须是FormData)
    var fd = new FormData(this);

    // fd对象中，有content，但是值为空； 根本就没有 图片
    // 1. 获取富文本编辑器里面的内容，并不是追加到fd中，而是更改fd里面的内容
    fd.set('content', tinyMCE.activeEditor.getContent());

    // 2. 剪裁图片，转成 blob 形参（二进制形式或文件对象形式），追加到fd中
    var canvas = $image.cropper('getCroppedCanvas', {
        width: 400,
        height: 280
    });

    // 把canvas图片转成二进制形式
    canvas.toBlob(function(blob) {
        // 追加文件对象到fd中
        fd.append('cover_img', blob);

        // 检查一下，fd对象中，是否取得了接口要求的所有参赛
        // fd.forEach((val, key) => {
        //     console.log(key, val);
        // });
        // return;
        // 发送ajax请求，完成最终的添加
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            success: function(res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    // 添加成功，跳转到 文章列表 页面
                    location.href = './list.html'
                }
            },
            processData: false, // 不要处理数据；意思是不要把对象形式的fd转换成查询字符串形式
            contentType: false // 不要加默认的请求头（application/x-www-form-urlencoded），让浏览器自行设置请求头
        });
    });
})