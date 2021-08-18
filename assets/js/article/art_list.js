$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date){
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth()+1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y+'-'+m+'-'+d+' '+hh+':'+mm+':'+ss
    }

    // 定义补零函数
    function padZero(n){
       return n>9?n:'0'+n
    }

    //   定义一个查询的参数对象，将来请求数据的时候  
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum:1, //页码值,默认请求第一页的数据
        pagesize:2, //每页显示几条数据,默认2条
        cate_id:'', //文章分类的id
        state:'',   //文章发布状态
    } 

    initTable()
    initCate()
    // 获取文章列表数据
    function initTable(){
        $.ajax({
            method:'get',
            url:'/my/article/list',
            data:q,
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取文章数据失败')
                }
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    
    // 初始化文章分类
    function initCate(){
        $.ajax({
            type:'get',
            url:'/my/article/cates',
            success:function(res){
                if(res.status!==0){
                    return layer.msg('获取分类数据失败')
                }
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单表单submit事件
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total){
        // 调用laypage.render()方法渲染分页结构
        laypage.render({
            elem:'pageBox', //分页容器的id
            count:total,
            limit:q.pagesize,
            curr:q.pagenum,
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],
            // 分页切换时触发jump回调
            // 触发jump回调的方式有两种
            // 1.点击页码的时候 2.只要调用了laypage.render()方法就会触发
            jump:function(obj,first){
                //可以通过first的值来判断是通过哪种方式触发jump回调
                // 如first的值为true则说明是方式2触发的

                // 把最新的页码值赋值给 q
                q.pagenum = obj.curr
                // 把最新的条目数赋值给q
                q.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表并渲染表格
                if(!first){
                    initTable()
                }
            }
        })
    }

    $('tbody').on('click','#btn-edit',function(e){
        var id = $(this).attr('data-id')
        location.href = '/article/art_edit.html?id='+id
    })

    $('tbody').on('click','#btn-del',function(){
        var len = $('#btn-del').length
        // 获取到文章的id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                type:'get',
                url:'/my/article/delete/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当数据删除后需要判断当前页中是否还有剩余数据
                    // 如果没有剩余的数据，则让页码值-1
                    if(len===1){
                        // 如果len的值为一，说明删除完毕后，页面上就没有数据了
                        // 页码值最小必须是1
                        q.pagenum=q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
          });
    })
})