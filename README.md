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

## 78 张塔罗牌

每次抽牌从完整 78 张牌中等概率随机抽取，允许重复。题目不会固定绑定卡牌；一次抽牌后，翻牌动画、详情、下载及分享图共同使用同一份结果。

情绪分类完全使用产品提供的清单：雀跃态 20 张、沉思态 20 张、疗愈态 19 张、应激态 19 张。配置集中在 `app/tarotData.ts`。所有牌当前沿用正位展示；情绪标签是卡牌的设计分类，不是对用户心理状态的判断。解读是本地编写的自我探索文案，按问题主题选取提示，不调用 AI 或预测服务。

分享图由当前牌面、牌名和三条建议实时合成，预览与下载使用同一张 840 × 1482 PNG，避免图片与文字不一致。牌面会裁切后嵌入原分享卡的弧形窗口，文字沿用原设计的“标题＋三条建议＋品牌页脚”结构；问题只在当前页面中处理，不写入分享图片。

### 牌面来源

经典 Rider–Waite–Smith 牌面由 Pamela Colman Smith 绘制，采用 [Wikimedia Commons Geldard 全套 78 张素材](https://commons.wikimedia.org/wiki/Category:Rider-Waite-Smith_tarot_deck_(Geldard))。导入时逐张核对 Commons 标注的 Public domain 许可；未改变图像内容，使用其 960 × 1646 高清缩略图。各文件来源、作者、许可与校验值见 `public/assets/tarot/sources.json`。图片随站点部署，不依赖外部图片服务器。

数据与素材验证（Node.js 24）：`node --test tests/tarot.test.mjs`。
