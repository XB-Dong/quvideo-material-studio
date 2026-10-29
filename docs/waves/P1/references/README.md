# P1 视觉参考与素材候选

检索/核对日期：2026-10-29。方向板为本项目浅色留白、蓝紫细节的原创排版提案：[direction-board.svg](direction-board.svg) / [PNG预览](direction-board.png)，不是已实现产品截图。四张授权候选原图已保存并用view_image人工看图，当前仅位于准备目录。

## 参考选择

| 参考 | 来源和核对 | 借鉴与取舍 |
| --- | --- | --- |
| [FluxArt](https://dribbble.com/shots/27174552-Futuristic-AI-Design-Platform-Dashboard-FluxArt) | Gopal Chatterjee / Blend wrk 的作者页；说明和色卡包含深蓝、紫色与卡片布局 | 仅借鉴工作台分区和图片优先层级；本项目采用浅色底，不沿用其深色大背景 |
| [AI Photo Editor](https://dribbble.com/shots/25826908-AI-Generated-Photo-Editor-Web-App-UI-UX) | Nafisa Tarannum Disha 的作者页；公开色卡#1356FE/#9636D8等 | 仅参考局部蓝紫强调；本项目背景/大面板为浅中性色，正文用炭灰 |
| [Linear](https://linear.app/) | 当前官方首页内容层级已核对 | 借鉴产品信息与操作分层、留白节奏；不复制其素材或页面结构 |
| [2026 Webby动画奖](https://winners.webbyawards.com/winners/websites-and-mobile-sites/features-design/best-use-of-animation-or-motion-graphics) | 官方年度动画/动效获奖类别 | 作为本年优秀动效案例入口；页面交互本身要在P1实际浏览测试，获奖不等于适合本题全部照搬 |
| [Motion](https://motion.dev/docs/react-accessibility) | 官方减弱动效与React指南 | 用于生命周期与无障碍实现；不把库承诺当本项目FPS测量 |

上述设计候选已阅读公开作者说明/色卡/官方内容；没有把静态设计稿称为可操作网站，也未宣称已完整体验参考站的动画。Reflect参考页的浏览器读取两次超时，本轮不将其作为已观察的视觉/体验依据。Dribbble图片不进入产品素材包。

## 已选的四个照片候选

| 本地预览 | 作者/公开源页 | 推荐用途与看图结论 |
| --- | --- | --- |
| [旅行](assets/travel.jpg) | Shutter Speed：[雪山与粉色天空](https://unsplash.com/photos/snow-covered-mountains-under-a-pink-sky-gH2wZOYK-KQ)，2026-01-04 | 旅行明信片；蓝灰山体+低饱和粉天，安静、真实；裁切保留山峰 |
| [宠物](assets/pet.jpg) | Joe Caione：[奔跑白犬](https://unsplash.com/photos/shallow-focus-photography-of-white-shih-tzu-puppy-running-on-the-grass-qO-PIF84Vxg)，2018-08-15 | 宠物肖像；主体鲜明、有动势；焦点在画面右侧，竖裁切保留耳部 |
| [人像](assets/portrait.jpg) | Tiko Giorgadze：[霓虹人像](https://unsplash.com/photos/woman-face-with-purple-lights-N19l9MJCpFQ)，2018-02-25 | 光影头像；蓝/洋红互补，以单张照片提供局部色彩重点；不扩大为人物代言 |
| [抽象](assets/abstract.jpg) | Pawel Czerwinski：[蓝紫流体](https://unsplash.com/photos/purple-and-blue-abstract-painting-vBc7xy65us8)，2020-12-08 | 三格故事的作品图片参考；高频纹理只在图片内使用，不直接承载正文 |

四个具体资源页均显示Free to use under Unsplash License，已核对[许可页](https://unsplash.com/license)，记录源页/作者并保留本地候选。未将Unsplash+候选纳入。images.unsplash.com取得的是带明确width/quality的JPEG版本，没有对原作品重新署名。

## 热度与时效依据

旅行为2026发表作品；宠物、抽象、人像是较早但适配本主题的作品。官方搜索索引摘要分别显示旅行约9千、宠物约49万、抽象约4.9万、人像约6千下载；这些是本次检索的缓存摘要，不是当天实时排名或“2026新作”。本轮以风格/构图/可用性作为主选择，高下载量作为补充，执行时再次核对具体资源页。

文件大小、尺寸、SHA256与候选状态见[manifest.json](manifest.json)。生产压缩、素材key迁移与历史结果保护按[素材契约](../../../../specs/p1/assets.md)，准备原图不会直接替换P0资源。


## 用户指定的 React Bits 创意

[七组件编排契约](../../../../specs/p1/react-bits.md)记录Dither Veil、Glow Cursor、Ripple Distortion、Halftone Reveal、Orbit Images、Pixel Trail、Electric Border的官方单页、位置/强度、互斥与退化；[源码审计](reactbits-audit.json)记录七个TS-CSS registry及14文件哈希、源提交、依赖和许可。已读源码/官方说明，没有把上游demo体验或本项目运行效果标为通过。

来源为[React Bits](https://reactbits.dev/c/animations)、[官方仓库](https://github.com/DavidHDev/react-bits)和该提交[许可](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/LICENSE.md)。许可是MIT + Commons Clause，不是纯MIT。OGL1.0.11元数据为Unlicense（[官方registry](https://registry.npmjs.org/ogl/1.0.11)）；无额外npm依赖的Glow/Halftone/Pixel/Electric仍使用WebGL2。依赖列表不能当资源成本结论。

方向板用于主题/构图，七组件的动态效果需P1在本地实际实现后看运行录制。最终创意/美学和使用舒适度分别独立签署，任一不通过均需修正再审。


创意分区可视提案：[creative-scene-map.svg](creative-scene-map.svg)；它是静态编排示意，实际动画与舒适度待P1实现验收。


配色以瓷白#F7F8FC、纯白#FFFFFF和炭灰#202433为主，蓝#4F63D8与紫#7961C5用于线条/边缘/图标/少量主操作。深色参考只借鉴分区与图像层级，不沿用其整页背景；原照片保留自然颜色。13组不透明实色对比度见[contrast-check.json](contrast-check.json)。PNG由本SVG渲染并已人工检查，属于方向提案，不代表实际产品或动态验收。
