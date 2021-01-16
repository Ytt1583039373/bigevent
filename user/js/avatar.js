//---------------------------实例化-------------------
var $image = $('#image')
var option = {
        // 纵横比(宽高比)
        aspectRatio: 1, // 正方形
        // 指定预览区域
        preview: '.img-preview' // 指定预览区的类名（选择器）
    }
    // - 调用cropper方法，创建剪裁区
$image.cropper(option);
//-----------------------------给上传按钮注册点击事件触发文件上传-----------------------------
$('#chooseFile').on('click', function() {
    $('#file').trigger('click')
});
//给提交文件注册改变是事件 获取文件
$('#file').on('change', function() {
    if (this.files.length > 0) {
        //得到图片的第一个名字 路径
        var fileObj = this.files[0];
        //创建一个临时的url
        var url = URL.createObjectURL(fileObj);
        $image.cropper('destroy').attr('src', url).cropper(option);
    }
});
$('#sure').on('click', function() {
    //裁剪图片获得canvas
    var canvas = $image.cropper('getCroppedCanvas', { width: 30, height: 30 });
    var base64 = canvas.toDataURL('canvas');
    $.ajax({
        type: 'POST',
        url: '/my/user/avatar',
        data: { avatar: base64 },
        success: function(res) {
            layer.msg(res.message)
            if (res.status === 0) {
                window.parent.getUserInfo();
            }
        }
    })
})