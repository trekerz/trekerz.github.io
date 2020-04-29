---
title: Webpack4总结
subtitle: "附带优化思路"
date: 2020-03-20 13:57:59
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---



1. ### entry / output

   ```js
   module.exports = {
     entry: './index.js',
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'index.bundle.js'
     }
   }
   
   // 或
   
   module.exports = {
     entry: [
       index: './index.js',
       main: './main.js'
     ],
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: '[name].bundle.js'
     }
   }
   ```

2. ### Loader

   ##### (1) url-loader

   ```js
   // 将图片转成base64
   // 需导入url-loader、file-loader
   module.exports = {
     module: {
   		rules: [
         {
           test: /\.(png|jpg|gif)$/i,
           use: [
             {
               loader: 'url-loader',
               options: {
                 limit: 8192
               }
             }
           ]
         }
       ]
     }
   }
   ```

   ##### (2) babel-loader

   ```js
   // 需导入babel-loader
   module.exports = {
     module: {
   		rules: [
         {
           test: /\.m?js$/,
           exclude: /(node_module|bower_components)/,
           use: [
             {
               loader: 'babel-loader',
               options: {
                 presets: ['@babel/preset-env'],
                 plugins: [
                   // 转换react jsx
                   '@babel-plugin-transform-react-jsx'
                 ]
               }
             }
           ]
         }
       ]
     }
   }
   ```

   ##### (3) sass-loader

   ```js
   // 需导入sass-loader、node-sass
   module.exports = {
     module: {
   		rules: [
         {
           test: /\.scss$/,
           use: [
             'style-loader',
             'css-loader',
             'sass-loader'
           ]
         }
       ]
     }
   }
   ```

3. ### Plugin

   ##### (1) miniCssExtractPlugin

   ```js
   // 作用：把css从js文件分离出来
   module.exports = {
     plugins: [
       new MiniCssExtractPlugin({
         filename: '[name].css',
         chunkFilename: '[id].css'
       })
     ]
     module: {
   		rules: [
         {
           test: /\.scss$/,
           use: [
             process.env.NODE_ENV !== 'production' ?
     					'style-loader' : MiniCssExtractPlugin.loader,
             'css-loader',
             'sass-loader'
           ]
         }
       ]
     }
   }
   ```

   ##### (2) DefinePlugin

   ```js
   // 用于定义公共变量，例如服务器地址
   module.exports = {
     plugins: [
       new webpack.DefinePlugin({
         'SERVER_URL': JSON.stringify('http://www.baidu.com')
       })
     ]
   }
   ```

   ##### (3) HtmlWebpackPlugin

   ```js
   // 需导入html-webpack-plugin
   module.exports = {
     plugins: [
       new HtmlWebpackPlugin({
         title: 'website title',
         filename: 'index.html',
         template: 'template.html'
       })
     ]
   }
   
   // 模板语法举例
   <%= htmlWebpackPlugin.options.title %>
   ```

4. ##### Hot Module Replacement

   ```js
   // 需要导入webpack-dev-server
   module.exports = {
     devServer: {
       contentBase: path.join(__dirname, 'dist'),
       compress: true,
       port: 8080
     }
   }
   ```







## 附：webpack打包优化实践

1. ### 性能查看工具

   (1) `webpack-bundle-analyzer`：以图表的形式展示各包的内部情况；

   (2) `speed-measure-webpack-plugin`：给出各个`Plugins`和各个`Loaders`的耗时；

2. ### `entry`优化

   ##### (1) 把公共模块合成单独的入口

   注意：这里只是合成，但这些模块还是没有从主文件`index`中抽离。

   ```js
   entry: {
       vendor: [
         'react',
         'react-dom',
         'react-router-dom',
         'react-router',
         'redux',
         'react-redux',
         'echarts'
       ],
       index: paths.appIndexJs,
       polyfills: require.resolve('./polyfills')
     },
   ```

3. ### `optimization`优化

##### (1) 使用`splitChunks`抽离代码（结合`webpack-bundle-analyzer`来操作）

```js
optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // ≥2次引用的公共模块
        commons: {
          chunks: 'all',
          minChunks: 2
        },
        // index页面
        index: {
          test: /moment|lodash|react-dom/,
          chunks: 'all',
          name: 'vendor~index',
          enforce: true
        },
        'antd': {
          test: /antd/,
          chunks: 'all',
          name: 'antd',
          enforce: true
        },
      }
    }
}
```

##### (2) 优化`minimizer`性能

- `js`压缩混淆是`webpack`编译中最耗时的任务之一，可以开启多线程与缓存，同时关闭`sourceMap`。

```js
minimizer: [
  // UglifyJs替代品
  new TerserJSPlugin({
    parallel: true, // 多核编译
    cache: true, // 开启缓存
    sourceMap: false, // 关闭sourceMap
    terserOptions: {
      parse: {
        ecma: 2017, // es8
      },
      compress: {
        drop_debugger: true,
        drop_console: true,
        ecma: 5,
        warnings: false
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      }
    },
  }),
  // 优化、压缩css资源
  new OptimizeCSSAssetsPlugin({})
],
```

1. ### 打包时间、加载时间的优化方向

   ##### (1) 细节优化

   - [**babel-plugin-import**](https://link.zhihu.com/?target=https%3A//github.com/ant-design/babel-plugin-import) **按需加载**

     例如`antd`、`lodash`、`material-ui`，可以使用 ；

   - **排除无用语言包**

     例如`date-fns`使用 [ContextReplacementPlugin](https://link.zhihu.com/?target=https%3A//webpack.js.org/plugins/context-replacement-plugin/)。

   - **特定的库有专门的`webpack`插件**

     例如 antd 使用 [antd-dayjs-webpack-plugin](https://link.zhihu.com/?target=https%3A//github.com/ant-design/antd-dayjs-webpack-plugin) 替换 moment 成 dayjs，例如 lodash 使用 [lodash-webpack-plugin](https://link.zhihu.com/?target=https%3A//github.com/lodash/lodash-webpack-plugin) 进一步减小打包体积。

   - **配置`noParse`**

     像`jquery`这种`npm`包就是一个单文件的依赖，可以配`module.noParse`，这样 `webpack`就不会去解析其中的依赖关系。

   ##### (2) 大优化

   - **路由懒加载`require.ensure()`、`import()`**

     一些动态加载插件都是使用`import()`来实现。但要注意：`react-loadable`本身并不实现动态加载，只实现一个加载流程框架，代码的动态导入功能是外部调用传入的。

   - **合理配置`exclude`属性**

     例如：`babel-loader`我们一般配置`exclude：/node_modules/`，告诉`webpack`模块路径匹配`/node_modules/`的模块不用`babel-loader`处理。

   - **使用`DllPlugin`将依赖单独打包（作用类似`splitChunks`）**

     使用`DllPlugin`将依赖单独打包成`dll.bundle.js`，同时会生成一份`json`配置表，用来告诉`webpack`在编译时排除这些模块；

     再用`add-asset-html-webpack-plugin`将`dll.bundle.js`通过`script`标签插到 `index.html`，这样你开发时打包的代码只有业务代码，大大减少了打包体积。

   - **配置`external`**

     所谓`external`就是告诉`webpack`哪些模块我会通过`script`加载的，**在打包的时候不用处理这些依赖**，例如`lodash`，`moment`，有条件的公司可以将这些依赖部署到 CDN 上。

   - **利用多线程**

     使用`babel`编译`TypeScript`，`fork-ts-checker-webpack-plugin`检查 `TypeScript`类型，而不是使用`ts-loader`串行编译和检查类型；

     使用`thread-loader`让`loader`跑在线程池里（[有限制](https://www.webpackjs.com/loaders/thread-loader/#用法)）。

2. ### 其它情况

   ##### (1) `electron`

   因为 webpack 使用 babel 来编译代码，所以优化 babel 配置也是优化 webpack 打包配置。例如 `babel-preset-env` 用到了`browserslist` 来针对兼容环境提供 `polyfill` 和转换语法。

   假设你是写 electron 项目，那就可以配置 browerslist 兼容到 electron 对应版本即可；

   而且 electron 环境下就不要配置 postcss 的 autoprefixer 插件去自动添加浏览器头了。

   ##### (2) 其它配置

   对于有些插件例如 `@babel/plugin-proposal-class-properties`，还可以配置 `loose` 选项来减小转换后的代码体积。

3. ### 非`webpack`优化（微前端）

   工具：[qiankun](https://github.com/umijs/qiankun)



参考资料：

1. [前端react单页应用项目太大，导致开发环境编译过慢，有什么解决思路么？](https://www.zhihu.com/question/388239916)

<br/>



<center>--end--</center>



<br/>