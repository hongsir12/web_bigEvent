$(function(){
    var form = layui.form
    var layer = layui.layer
    // 自定义校验规则
    form.verify({
        pwd: [
            //自定义了一个叫pwd的校验规则
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        samePwd:function(value){
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同！'
            }
        },
        repwd:function(value){  //校验两次密码是否一致
            // 通过形参拿到再确认密码框的内容
            // 还需要拿到密码框中的内容
            // 然后进行比较
            // 判断失败则return一个提示消息
            var pwd = $('[name=newPwd]').val()
            if(pwd !==value){
                return '两次输入的密码不一致'
            }
        }
    })


    //监听表单的提交事件
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        $.ajax({
            type:'post',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
               if(res.status!=0){
                   return layer.msg('原密码错误！')
               }
               layer.msg('修改密码成功')
            //    $('#btnReset').click()
            // 重置表单
            $('.layui-form')[0].reset()
            }
        })
    })
})