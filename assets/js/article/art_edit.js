$(function () {
    var layer = layui.layer
    var form = layui.form

    var url = location.search //获取url中"?"符后的字串 ('?modFlag=business&role=1')
    var theRequest = new Object()
    if (url.indexOf('?') != -1) {
        var str = url.substr(1) //substr()方法返回从参数值开始到结束的字符串；
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1]
        }
        var art_id = theRequest.id //此时的theRequest就是我们需要的参数；
    }

    
    // 初始化富文本编辑器
    initEditor()
    initContent()
    initCate()

    // 定义加载文章分类方法
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render()方法
                form.render()
            }
        })
    }

    function initContent(){
        $.ajax({
            type:'get',
            url:'/my/article/'+ art_id,
            success:function(res){
                console.log(res)
                $('[name=title]').val(res.data.title)
                $('[value='+res.data.Id+']').attr('selected')
                $('[name=content]').html(res.data.content)
                $('#image').attr('src',res.data.cover_img)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件
    $('#coverFile').on('change', function (e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单，快速创建一个formData对象
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd中
        fd.append('state', art_state)

        // 将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象存储到fd中
                fd.append('cover_img', blob)
                // 发起ajax数据请求
                publishArticle(fd)
            })
    })


    // 定义更新文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/edit',
            data: fd,
            //注意：如果向服务器提交的是formData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('更新文章失败')
                }
                layer.msg('更新文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }
})