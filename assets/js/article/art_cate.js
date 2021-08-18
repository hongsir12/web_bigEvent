$(function(){
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类列表
    function initArtCateList(){
        $.ajax({
            type:'get',
            url:'/my/article/cates',
            success:function(res){
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }
    // 添加类别按钮绑定事件
    var indexAdd = null
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type:'1',
            area:['550px','250px'],
            title:'添加文章分类',
            content:$('#dialog-add').html(),
        })
    })

    // 通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        $.ajax({
            type:'post',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    layer.msg('添加类别失败')
                }
                $('#form-add')[0].reset()
                layer.msg('添加类别成功')
                initArtCateList()
                // 根据索引关闭对应弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理形式为编辑按钮绑定单击事件
    var indexEdit = null
    $('tbody').on('click','#btn-edit',function(e){
        indexEdit = layer.open({
            type:'1',
            area:['550px','250px'],
            title:'修改文章分类',
            content:$('#dialog-edit').html(),
        })
        var id = $(this).attr('data-id')
        // 发起请求获取对应分类的数据
        $.ajax({
            type:'get',
            url:'/my/article/cates/'+id,
            success:function(res){
                form.val('form-edit',res.data)
            }
        })
    })

    // 通过代理形式为修改分类表单绑定submit事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        $.ajax({
            type:'post',
            url:'/my/article/updatecate',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理形式为删除按钮绑定单击事件
    $('body').on('click','#btn-del',function(e){
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){   
            $.ajax({
                type:'get',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if(res.status!==0){
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList()
                }
            })
            
          });
    })
})