$(function(){
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname:function(value){
            if(value.length>6){
                return "昵称长度必须在1-6个字符之间"
            }
        }
    })

    initUserinfo()

    // 初始化用户基本信息
    function initUserinfo(){
        $.ajax({
            type:'get',
            url:'/my/userinfo',
            success:function(res){
                if(res.status!=0){
                    return layer.msg('获取用户信息失败')
                }
                //调用form.val快速给表单赋值
                form.val('formUserInfo',res.data)
            }
        })
    }

    //重置表单数据
    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserinfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            type:'post',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!=0){
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 调用父页面中的方法，重新渲染用户头像信息
                window.parent.getUserInfo()
            }
        })
    })
})