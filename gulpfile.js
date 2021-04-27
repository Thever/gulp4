//  导入必要的资源(CMD语法)
const gulp = require('gulp')

//  1.创建一个打包css任务
//  导入插件 gulp-cssmin 压缩css文件
const cssmin = require('gulp-cssmin')
//  导入插件 gulp-autoprefixer 添加css前缀
const autoPrefixer = require('gulp-autoprefixer')
//  导入插件 gulp-sass 将sass转换成css
const sass = require('gulp-sass')
//  导入 gulp-uglify 压缩js文件
const uglify = require('gulp-uglify')
//  导入 gulp-babel 把 ES6 转换成 ES5
const babel = require('gulp-babel')
//  导入 gulp-htmlmin 来打包压缩html
const htmlmin = require('gulp-htmlmin')
//  导入 gulp-imagemin 来无损压缩图片,需要安装三个资源包，就没成功过
// const imagemin = require('gulp-imagemin')
//  导入 del 删除目录
const del = require('del')
//  导入 gulp-webserver 来启动本地服务器
const webserver = require('gulp-webserver')
//  导入 gulp-file-include 来打包组件
const fileInclude = require('gulp-file-include')


//  gulp3写法，gulp.task定义名称和处理方法调用
//  定义任务名称为cssHandle, 处理逻辑
// gulp.task('cssHandler', function(){
//     /* 需要不过该任务的结束，需要吧这个流return出去，这样task就会处理流了 */
//     //  找到源文件
//     return gulp.src('./src/css/*.css')
//     //  添加前缀,兼容最近2个版本的浏览器
//     //  官方建议在package.json中添加 browserlist属性或者配置 .browserslistrc
//     .pipe(autoPrefixer())
//     //  压缩文件(去掉多余空格)
//     .pipe(cssmin())
//     //  输出到目录
//     .pipe(gulp.dest('./dist/css/'))
// })

//  处理css文件，添加前缀，去除多余换行空格
//  gulp4写法,声明处理函数,再在gulpfile.js中把函数导出就行了
//  声明函数导出使用即可
const cssHandler = function(){
    //  匹配css文件
    return gulp.src('./src/css/*.css')
    //  添加前缀,兼容最近2个版本的浏览器
    .pipe(autoPrefixer())
    //  压缩文件(去掉多余空格)
    .pipe(cssmin())
    //  输出到目录
    .pipe(gulp.dest('./dist/css/'))
}

//  处理sass文件
const sassHandler = function(){
    //  匹配sass文件
    return gulp.src('./src/sass/*.scss')
    //  将sass文件转化成css文件
    .pipe(sass())
    // //  css文件添加兼容前缀
    // .pipe(autoPrefixer())
    // //  压缩css文件
    // .pipe(cssmin())
    // //  输出到目录
    .pipe(gulp.dest('./dist/sass/'))
}

//  处理.js文件
const jsHandler = function(){
    return gulp
        //  目录扫描
        .src('./src/js/*.js')
        //  ES6转化成ES5
        .pipe(babel({
            //  gulp-babel@7,presets:['es2015'],当然你也需要安装
            presets:['@babel/env']
        }))
        //  ES5代码压缩
        .pipe(uglify())
        //  输出代码
        .pipe(gulp.dest('./dist/js/'))
}

//  处理.html
const htmlHandler = function(){
    return gulp
        //  扫描文件
        .src('./src/pages/*.html')
        //  打包组装件
        .pipe(fileInclude({
            //  根据配置导入对应的 html 片段
            //  自定义标识符
            prefix:'@-@',
            //  基准目录，你的组件文件的位置
            basepath:'./src/components'
        }))
        //  处理内容
        .pipe(htmlmin({
            //  通过配置参数来压缩
            //  移除空格
            collapseWhitespace: true,
            //  移除空的属性(仅限于原生属性)
            removeEmptyAttributes: true,
            //  移除 checked 类似的布尔值属性
            collapseBooleanAttributes:true,
            //  移除属性上的双引号
            removeAttributeQuotes:true,
            //  压缩内嵌式 css 代码(只能压缩，不能自动添加前缀) --> 处理html中style标签内的css
            minifyCSS:true,
            //  压缩内嵌式 js 代码(只能压缩，不能转码处理兼容性) --> 处理html中script中的内容
            minifyJS:true,
            //  移除 style 和 link 标签上的 type 属性
            removeStyleLinkTypeAttributes:true,
            //  移除 script 标签上默认的type属性
            removeScriptTypeAttributes:true,
        }))
        //  输出资源
        .pipe(gulp.dest('./dist/pages/'))
}

//  处理图片
const imgHandler = function(){
    return gulp
        //  目录扫描
        .src('./src/images/**')
        //  无损压缩图片
        // .pipe(imagemin())
        //  输出资源
        .pipe(gulp.dest('./dist/images'))
}

//  处理 videos
const videoHandler = function(){
    return gulp
        //  目录扫描
        .src('./src/videos/**')
        //  输出资源
        .pipe(gulp.dest('./dist/videos'))
}

//  处理 audios
const audiosHandler = function(){
    return gulp
    //  目录扫描
    .src('./src/audios/**')
    //  输出资源
    .pipe(gulp.dest('./dist/audios'))
}
//  打包第三方(lib文件夹)
const libHandler = function(){
    return gulp
        .src('./src/lib/**/*')
        .pipe(gulp.dest('./dist/lib'))
}
//  打包字体文件
const fontHandler = function(){
    return gulp
        .src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'))
}

//  删除输出目录
const delHandler = function(){
    //  del直接执行即可,不需要流
    //  以数组形式传递要删除的文件夹
    return del(['./dist/'])
}

//  配置本地服务器
const webHandler = function(){
    return gulp
        .src('./dist')
        .pipe(webserver({
            //  域名,可以配置自定义域名
            host:'localhost',
            // host:'www.jojo.com',
            //  端口号
            port:'8080',
            //  热重启，替换文件自动重启
            livereload:true,
            //  默认打开哪一个文件(从 dist 目录以后的目录开始书写)
            open: './pages/login.html',
            //  配置代理,多个代理就配置多个
            proxies:[
                //  每一个代理就是一个对象数据类型
                //  注意:如果没有代理，不要写空对象
                {
                    //  代理标识符
                    source:'/dt',
                    //  代理目标地址
                    target:'https://www.duitang.com/napi/vienna/feed/list/by_common/'
                }
            ]
        }))
}

//  创建监控任务
const watchHandler = function(){
    //  使用gulp.watch监控, gulp.watch(监控的文件，调用的方法)
    gulp.watch('./src/css/*.css', cssHandler)
    gulp.watch('./src/sass/*.scss', sassHandler)
    gulp.watch('./src/js/*.js', jsHandler)
    gulp.watch('./src/pages/*.html', htmlHandler)
    gulp.watch('./src/images/**', imgHandler)
    gulp.watch('./src/videos/**', videoHandler)
    gulp.watch('./src/audios/**', audiosHandler)
    gulp.watch('./src/lib/**/*', libHandler)
    gulp.watch('./src/fonts/**/*', fontHandler)
    gulp.watch('./src/css/*.css', cssHandler)
}

//  导出功能函数
module.exports.cssHandler = cssHandler
module.exports.sassHandler = sassHandler
module.exports.jsHandler = jsHandler
module.exports.htmlHandler = htmlHandler
module.exports.imgHandler = imgHandler
module.exports.videoHandler = videoHandler
module.exports.audiosHandler = audiosHandler
module.exports.libHandler = libHandler
module.exports.fontHandler = fontHandler
module.exports.delHandler = delHandler

//  配置默认任务，执行必要的任务
//  使用gulp.series() 或 gulp.parallel()
//  这两个方法的返回值是一个函数，返回值可以直接被当做任务函数使用
//  使用 task 的方式创建一个 default 任务
//  默认任务为啥要叫default?
//  gulp default 可以省略 default,直接用gulp执行，其他指令不行
//  方式1:
// gulp.task('default', function(){
//     delHandler()
//     return gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audiosHandler,libHandler,fontHandler)()
// })

//  方式2：
// module.exports.default = gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audiosHandler,libHandler,fontHandler)

//  保证删除输出目录优先，用gulp.series同步执行，再打包对应资源
// module.exports.default = gulp.series(
//     delHandler,
//     gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audiosHandler,libHandler,fontHandler)
// )

//  添加完毕服务器任务后，修改default
// module.exports.default = gulp.series(
//     delHandler,
//     gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audiosHandler,libHandler,fontHandler),
//     webHandler
// )

//  添加监控任务后，修改default
module.exports.default = gulp.series(
    delHandler,
    gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler,imgHandler,videoHandler,audiosHandler,libHandler,fontHandler),
    webHandler,
    watchHandler
)