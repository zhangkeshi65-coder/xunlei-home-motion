# 迅雷首页动效

移动端交互动效演示：主题选择、抽卡动画、解读和分享图。

在线访问：https://zhangkeshi65-coder.github.io/xunlei-home-motion/

## 开发和构建

使用 Node.js 24 和 pnpm：

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

静态构建输出为 `dist-pages/`。将构建结果同步到 `docs/` 后提交，GitHub Pages 从 `main` 分支的 `/docs` 目录发布。

## 迁移说明

原 Sites 第 17 版（7b499e7136b513dd9cfb7a93def3d5049803ebfc）的页面、动画和资源保留。独立 Vite 入口替代 Cloudflare 服务端发布；相对资源路径支持仓库子目录；无数据库或后端接口依赖。`docs/.nojekyll` 保证静态文件直接发布。

系统分享与剪贴板依赖浏览器支持及权限。页面为演示，原有占位按钮未扩展为真实业务功能。
