---
title: create-react-app
subtitle: "流程套路"
date: 2018-05-30 09:45:33
tags: 
	- 笔记
	- 读书笔记
layout: post
author: "Trekerz"
header-img: "/bing/OldTownTallinn_ZH-CN4833535739_1920x1080.jpg"
---







1. 使用`npx`创建一个react项目

   ```sh
   npx create-react-app test
   ```

   如果是想要创建Typescript版的项目，则使用下面这条命令：

   ```sh
   npx create-react-app test --typescript
   ```

2. 编辑`.editorconfig`文件

   `.editorconfig`是用来统一项目编码格式的文件，在某些ide中，不需要插件即可生效，但在 VScode 里需要安装`EditorConfig for VS Code`才能使该文件生效。下面是`.editorconfig`的一段示例代码：

   ```sh
   # http://editorconfig.org
   root = true
   
   [*]
   indent_style = space
   indent_size = 4
   charset = utf-8
   trim_trailing_whitespace = true
   insert_final_newline = true
   
   [*.md]
   trim_trailing_whitespace = false
   ```

3. 安装`less`支持

   使用 `create-react-app` 安装的react应用默认是把webpack的配置、工具都隐藏来(不可以配置)的，如果要安装`less`，就需要先把webpack的配置、工具都暴露出来。`create-react-app` 就提供这样的一个暴露命令：

   ```sh
   npm run eject
   ```

   然后，安装 `less` 及其类型文件：

   ```sh
   npm install -D less less-loader
   ```

   最后，在 `config/webpack.config.js` 中配置`less-loader`：

   ```js
   module.exports = {
     ...
     module: {
     ...
       {
         test: lessRegex,
         exclude: lessModuleRegex,
         use: getStyleLoaders(
           {
             importLoaders: 2,
             sourceMap: isEnvProduction && shouldUseSourceMap,
           },
           'less-loader'
         ),
         sideEffects: true,
       },
       {
         test: lessModuleRegex,
         use: getStyleLoaders(
           {
             importLoaders: 2,
             sourceMap: isEnvProduction && shouldUseSourceMap,
             modules: true,
             getLocalIdent: getCSSModuleLocalIdent,
           },
           'less-loader'
         ),
       },
       ...
     }
     ...
   }
   ```

   安装测试库`Enzyme`

   ```sh
   npm install -D enzyme @types/enzyme react-addons-test-utils
   ```

   接着为`Enzyme`安装react适配器：

   ```sh
   npm install -D enzyme-adapter-react-16
   ```

   注意不同的react版本对应不同的`enzyme-adapter-react`版本。

4. 安装状态管理工具`Redux`（或`MobX`）

   ```sh
   npm install -S redux react-redux @types/react-redux
   ```

   具体使用请看：[添加状态管理](https://juejin.im/post/59e817f851882521ae146334#heading-10)





<br/>



<center>--end--</center>



<br/>





