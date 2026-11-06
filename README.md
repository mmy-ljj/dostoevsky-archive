# 陀思妥耶夫斯基：人的深处

独立静态网站，介绍陀思妥耶夫斯基的八部作品与生平。与诗间项目分开，不共享页面或密钥。

## 预览

在本项目目录运行 `python -m http.server 8089 --bind 127.0.0.1`，浏览器打开 `http://127.0.0.1:8089/`。页面需要 HTTP 服务才能使用 Three.js 模块。

## 体验

- Seedance 三幕视频直接作为全屏背景，以整页滚动进度推进真实视频时间，从开场到页脚持续显示，Three.js VideoTexture 提供轻微折射波纹，字幕按章节同步切换。
- 第一版 Seedance 三幕短片经过本地暗色调处理，可在“播放完整短片”内正常观看。三幅新哥特图用于章节展示、作品配图和静态模式，没有额外调用收费视频生成。
- 阅读区配图有连续视差，生平时间线随滚动高亮，底部提供全程影像进度与静态阅读切换。
- 八部作品的原创导读、人物与阅读建议，本页展开；分类、搜索与本地书架。
- 作家生平、公有领域肖像、外部英文译本入口及来源标注。
- 作家和拉斯克尔尼科夫 AI 对话入口，未接后端明确显示固定示例；可用浏览器系统朗读。
- 不支持 WebGL、资源加载失败或减少动态效果时，保留静帧、章节按钮与全部书目。

## 对话后端

复制 `.env.example` 为 `.env`，在本机填写自己的对话密钥和管理口令。Node 22/24：`node --env-file=.env persona-server.mjs`。网站的“连接设置”填写 `http://localhost:8787/api/character-chat`。外部部署使用 HTTPS 后端，并更新 `ALLOWED_ORIGINS`。GitHub Pages 只能托管前端，不能运行 Node 后端；不要把 `.env` 提交到仓库。

网站右上角的 API 配置可将对话与可选语音密钥发送到自己部署的后端；不会把密钥写入静态源码或 localStorage。

## 发布

可将本项目根目录单独发布到静态托管服务。入口为 `index.html`；`assets`、`vendor`、CSS 与 JS 必须同时上传。无需构建命令，不依赖第三方 CDN。

## 资料与许可

作品介绍为原创导读，不是完整中文译文。外部英文版本入口见页面；肖像来自 Wikimedia Commons 的彼罗夫 1872 年公有领域作品；Noto Serif SC 许可位于 `assets/dostoevsky/OFL.txt`，Three.js 许可位于 `vendor/THREE-LICENSE.txt`。哥特画面为表现主义文学演绎，不是历史复原。

## 本次卡牌与书房素材

八张作品封面由 RunningHub Seedream 5.0 Pro 生成，映射见 `assets/covers/manifest.js`。桌面拖拽、手机横滑，点击后本页展开导读。

八张书房与人物关键帧由 RunningHub Nano Banana Pro 生成，预览 `assets/study/preview.html`。视频尚未提交；门缝与门槛机位未通过连续性检查，不能直接拼接为进门镜头。

## Mini 背景电影

新版为8段行进镜头合并约40秒，另有5秒作家呼吸眨眼待机循环。`assets/scroll-film-v2/video-preview.html` 可正常播放。页面按栏目锚点分配镜头，导读展开时保持作品区当前镜头，结尾新增书房会面区，到达后播放独立待机。低动态模式保留静帧。生成任务和报价记录在 `production/scroll-film-v2/mini-clips`。
