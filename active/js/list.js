var data = {
    pagenum: 1, //表示获取第n页的数据
    pagesize: 2, //表示每页显示几条数据
}

function renderArticle() {
    $.ajax({
        url: '/my/article/list',
        data: data,
        success: function(res) {
            var str = template('tpl-article', res);
            $('tbody').html(str)
                //获取服务器数据总数
            showPage(res.total)
        }
    })
}
renderArticle();
template.defaults.imports.dateFormat = function(time) {
    let date = new Date(time)
    var y = date.getFullYear();
    var m = addZero(date.getMonth() + 1);
    var d = addZero(date.getDate());
    // 时分秒自己写
    return y + '-' + m + '-' + d;
}

// 补零函数
function addZero(n) {
    return n < 10 ? '0' + n : n;
}
//修改页面点击  给data重新赋值重新获取ajax请求
var laypage = layui.laypage;
//执行一个laypage实例
function showPage(t) {
    laypage.render({
        elem: 'page', //注意，这里的 test1 是 ID，不用加 # 号
        count: t, //数据总数，从服务端得到
        limit: data.pagesize, //每页显示的条数
        curr: data.pagenum,
        jump: function(obj, first) {
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            //首次不执行
            if (!first) {
                //do something
                data.pagesize = obj.limit;
                data.pagenum = obj.curr;
                renderArticle()
            }
        },
    })
}
//--------------------------------------搜索模块-------------------------------------
//获取本地服务的数据 根据数据回填到列表中 根据搜索内容重新回填
var form = layui.form;
$.ajax({
    url: '/my/category/list',
    success: function(res) {

        var str = template('tpl-category', res);
        $('#fl').html(str)
        form.render('select')
    }
});
//----------------------------根据搜索的内容重新渲染页面------------------------------
$('#screen').on('submit', function(e) {
        e.preventDefault()
        var cate_id = $('#fl').val();
        var state = $('#state').val();

        if (cate_id) {
            data.cate_id = cate_id
        } else {
            delete data.cate_id
        };
        if (state) {
            data.state = state
        } else {
            delete data.state
        }
        //重置页码
        data.pagenum = 1;
        renderArticle()
    })
    //----------------------------------给删除按钮注册事件------------------------------------
$('tbody').on('click', 'button:contains("删除")', function(e) {
        var id = $(this).data('id')
        var that = this

        layer.confirm('你真的要删除吗?', { icon: 3, title: '提示' }, function(index) {
            //先删除js中的元素
            $(that).parents('tr').remove()

            $.ajax({
                url: '/my/article/delete/' + id,
                success: function(res) {
                    layer.msg(res.message);
                    if (res.status === 0) {
                        if ($('tbody').children().length > 0) {
                            renderArticle();
                        } else {
                            data.pagenum--;
                            if (data.pagenum === 0) return;
                            renderArticle();
                        }
                    }
                }
            })
            layer.close(index);
        });

    })
    //--------------------------------------------编辑按钮注册事件---------------------------------------------------