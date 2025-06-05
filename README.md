# E-commerce-sample

## 介绍

项目分为两端：前台产品端以及后台管理端

- 前端原型：[即时设计](https://js.design/f/Yn1hry?p=Op-YPiTbAH&mode=design)

- 技术栈：PrimeReact + Next.js (AppRouter) + TypeScript + Nginx

## Git commit提交规范
- type（必须） : commit 的类别，只允许使用下面几个标识：
  feat : 新功能
  fix : 修复bug
  docs : 文档改变
  style : 代码格式改变
  refactor : 某个已有功能重构
  perf : 性能优化
  test : 增加测试
  build : 改变了build工具 如 grunt换成了 npm
  revert : 撤销上一次的 commit
  chore : 构建过程或辅助工具的变动
- scope（可选） : 用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。
- subject（必须） : commit 的简短描述，不超过50个字符。
遵循 Angular 的提交规范。

## 如何启动
```shell
npm i
npm run dev
```

使用浏览器打开[http://localhost:3000](http://localhost:3000)查看结果。

您可以通过修改`app/page.tsx` 来开始编辑页面。页面会在您编辑文件时自动更新。

本项目使用 [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) 自动优化并加载 Vercel 的新字体系列 [Geist](https://vercel.com/font)。

## Nginx的配置
Nginx版本没有影响，该项目没有用到高端有版本区分的服务，LaoeGaoci的版本为: `nginx-1.26.2`，在Nginx目录下建立文件夹E-commerce/。
设置`nginx.conf`文件
```
  listen  65;
  server_name  localhost;
```
```
  location / {
    root   D:/nginx/nginx-1.26.2/E-commerce/;  
  }
```

## 更多
要了解更多关于 Next.js ，React，PrimeReact的信息，请查看以下资源：

- [nginx配置教程](https://www.cnblogs.com/hanease/p/15890509.html)
- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的功能和 API。
- [学习 Next.js](https://nextjs.org/learn) - 一个交互式的 Next.js 教程。
- React中文：[创建一个 React 应用 – React 中文文档](https://zh-hans.react.dev/learn/creating-a-react-app)
- TypeScript：[TypeScript中文网 · TypeScript——JavaScript的超集](https://www.tslang.cn/)
- PrimeReact官网：[PrimeReact - React UI Component Library](https://primereact.org/templates/)

您可以查看 [Next.js GitHub 代码库](https://github.com/vercel/next.js) - 欢迎您提供反馈和贡献！
