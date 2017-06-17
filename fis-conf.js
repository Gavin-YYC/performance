/****************************** 环境变量 ******************************/
fis.set('localPath', '/src');
fis.set('pubPath', '/static');
fis.set('noModPath', '${localPath}/libs/noMod');

/****************************** 编译范围 ******************************/
fis.set('project.file', ['/src']);
fis.set('project.ignore', [
  '/src',
  '/node_modules/**',
  '.DS_store',
  'npm-debug.log',
  'fis-conf.js',
  'package.json',
  '**.md'
]);
fis.set('project.fileType.text', 'vue');

/****************************** 语言解析 ******************************/
// vue 相关
// 参考：https://github.com/ccqgithub/fis3-parser-vue-component
fis
  .match('${localPath}/**.vue', {
    rExt: '.js',
    isMod: true,
    useSameNameRequire: true,
    parser: fis.plugin('vue-component', {
      cssScopeFlag: 'vuec'
    })
  })
  // .vue文件，es6解析
  .match('${localPath}/**.vue:js', {
    parser: [
      fis.plugin('babel-5.x'),
      fis.plugin('translate-es3ify', null, 'append')
    ]
  })
  // .vue文件，less解析
  .match('${localPath}/{**.vue:less,**.less, **.css}', {
    rExt: 'css',
    parser: [fis.plugin('less-2.x')],
    postprocessor: fis.plugin('autoprefixer', {
      "browsers": ['Firefox >= 20', 'Safari >= 6', 'Explorer >= 9', 'Chrome >= 12', "ChromeAndroid >= 4.0"]
    })
  })
  .match('${localPath}/**.js', {
    isMod: true,
    parser: [
      fis.plugin('babel-5.x'),
      fis.plugin('translate-es3ify', null, 'append')
    ]
  });

/****************************** 发布目录 ******************************/
// 公共文件
fis
  .match('${localPath}}/**.js', {
    isMod: true,
    release: false
  })
  .match('${noModPath}/mod.js', {
    isMod: false,
    parser: null,
    release: '${pubPath}/js/mod.js'
  });

// 业务文件
fis
  .match('${localPath}/index.html', {
    useHash: false,
    useCache : false,
    release: '${pubPath}/index.html'
  })
  .match('${localPath}/(**.{js,vue})', {
    isMod: true,
    release: '${pubPath}/js/$1'
  })
  .match('${localPath}/(**.json)', {
    release: '${pubPath}/config/$1'
  })
  // lib文件夹下所有js文件一起打包
  .match('${localPath}/lib/**.{js,vue}', {
    packTo: '${pubPath}/js/pkg_lib.js'
  })
  // lib文件夹下所有css文件一起打包
  .match('${localPath}/lib/**.{css, less}', {
    packTo: '${pubPath}/css/pkg_lib.css'
  })
  .match('${localPath}/template/(**.less)', {
    release: false
  })
  // template文件夹下的所有css文件一起打包
  .match('${localPath}/template/(**.{vue:less, css})', {
    packTo: '${pubPath}/css/pkg_activity.css'
  });

/****************************** 模块化配置 ******************************/
fis.hook('commonjs', {
  extList: ['.js', '.vue'],
  baseUrl: './src/',
  // 必须指定，要不然fis查找会出错
  paths: {
    "vue": 'libs/js/vue/vue.min.js'
  }
});

/*模块化加载器配置*/
fis.match('::package', {
  postpackager: fis.plugin('loader', {
    allInOne: true,         // 合并页面下的js、css
    sourceMap: true,        //是否生成依赖map文件
    useInlineMap: true      //是否将sourcemap作为内嵌脚本输出
  })
});

/****************************** 测试 / 发布 ******************************/
// 调试环境下，不合并、压缩
fis
  .media('debug')
  .match('*.{js,css,png,vue}', {
    useHash: true,
    useSprite: false,
    optimizer: null
  })
  // vue, vue-resource 文件打包
  .match('${localPath}/libs/js/{vue,vue-resource,underscore}/**.js', {
    packTo: '${pubPath}/js/pkg_vue.js',
    release: '${pubPath}/js/pkg_vue.js',
    optimizer: false
  })
  .match('pkg_vue.js',     { optimizer: false } )                         // 该文件不能再次丑化
  .match('*', {
    deploy: [
      // packTo的文件不进行再次发布
      fis.plugin('skip-packed', {}),
      fis.plugin('http-push', {
        receiver: 'http://115.182.215.159/receiver.php',
        to: TARGET_PATH
      })
    ]
  });

// 代码发布时
fis.media('qa')
  .match('*.{js,css,png,vue}',   { useHash: true })                         // 添加指纹
  .match('*.{js,vue}',           { optimizer: fis.plugin('uglify-js') })    // js 压缩
  // vue, vue-resource 文件打包
  .match('${localPath}/libs/js/{vue,vue-resource,underscore}/**.js', {
    packTo: '${pubPath}/js/pkg_vue.js',
    release: '${pubPath}/js/pkg_vue.js',
    optimizer: false
  })
  .match('pkg_vue.js',     { optimizer: false } )                         // 该文件不能再次丑化
  .match('*.css',          { optimizer: fis.plugin('clean-css')})         // css压缩
  .match('*.{png,jpg}',    { optimizer: fis.plugin('png-compressor') })   // 图片压缩
  .match('::package',      { spriter: fis.plugin('csssprites') })         // 图片合并，需要添加：?__sprite
  .match('*.css',          { useSprite: true })                           // 对 CSS 进行图片合并
  .match('*', {
    deploy: [
      // packTo的文件不进行再次发布
      fis.plugin('skip-packed', {}),
      fis.plugin('http-push', {
        receiver: 'http://115.182.215.159/receiver.php',
        to: TARGET_PATH
      })
    ]
  });
