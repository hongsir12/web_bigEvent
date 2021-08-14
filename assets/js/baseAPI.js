// 每次调用$.get()或$.post()或$.ajax()的时候，会先调用ajaxPrefilter这个函数
// 在该函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统一请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    // console.log(options.url)
})