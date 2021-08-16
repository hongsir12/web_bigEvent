// 每次调用$.get()或$.post()或$.ajax()的时候，会先调用ajaxPrefilter这个函数
// 在该函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统一请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 统一为有权限的接口设置请求头
    if(options.url.indexOf('/my/')!==-1){
        options.headers = {
            Authorization:localStorage.getItem('token')||''
        }
    }

    //全局同一挂载complete函数
    //无论成功还是失败，最终都会执行complete回调函数
    options.complete = function(res){
        // complete回调函数中可以通过res.responseJSON拿到服务器响应回来的数据
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
    
})