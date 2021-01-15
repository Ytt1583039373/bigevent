//--------------------------两个盒子的切换功能-----------------------------------
$('.login a').on('click', function() {
    $('.login').hide().next().show()
})
$('.register a').on('click', function() {
    $('.login').show().next().hide()
})