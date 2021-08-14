$(function(){
    // 点击去注册账号的链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登陆的链接
    $('#link_login').on('click',function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })


    //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // 自定义校验规则
    form.verify({
        pwd: [
            //自定义了一个叫pwd的校验规则
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        repwd:function(value){  //校验两次密码是否一致
            // 通过形参拿到再确认密码框的内容
            // 还需要拿到密码框中的内容
            // 然后进行比较
            // 判断失败则return一个提示消息
            var pwd = $('.reg-box [name=password]').val()
            if(pwd !==value){
                return '两次输入的密码不一致'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit',function(e){
        e.preventDefault()
        $.post(
        '/api/reguser',
        {
            username:$('#form_reg [name=username]').val(),
            password:$('#form_reg [name=password]').val(),
        },
        function(res){
            if(res.status!=0){
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登陆')
            $('#link_login').click()
        })
    })

    //监听登陆表单的提交事件
    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            type:'post',
            // 快速获取表单中的数据
            data:$(this).serialize(),
            success:function(res){
                // console.log(res.token)
                if(res.status!=0){
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功')
                // 将登陆成功得到的token字符串保存到localStorage
                localStorage.setItem('token',res.token)
                // 跳转到后台主页
                location.href='/index.html'
            }
        })
    })
})