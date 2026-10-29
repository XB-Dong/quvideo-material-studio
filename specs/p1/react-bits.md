# P1 React Bits 创意编排与双重验收

版本P1-1.1.0。用户增量要求：合理丰富地使用React Bits，特别是Dither Veil、Glow Cursor、Ripple Distortion、Halftone Reveal、Orbit Images、Pixel Trail、Electric Border；同时保证美学与使用舒适度。七种均为本波必需创意，不能仅全部关闭后声称舒适通过。

## 来源与接入基线

用户入口为[Swarm Cursor](https://reactbits.dev/c/animations/swarm-cursor)，其分类索引已核对，实际七页入口见下表。[官方源仓库](https://github.com/DavidHDev/react-bits)在本轮读取的main为e12c22192ac7b4b452c5e2feb9b586d74765d696，采用TS-CSS变体，适配本项目而不是引入整个示例网站。

已只读取得七个官方registry JSON、读取imports并记录每文件SHA，见docs/waves/P1/references/reactbits-audit.json；没有执行CLI、安装或复制组件到产品。Dither Veil和Ripple Distortion依赖ogl ^1.0.11，其余五项没有React以外registry依赖。OGL1.0.11官方元数据为Unlicense，作为启动时锁定候选；Pixel Trail源码未检出减弱动效分支，必须加项目级适配。其余源码出现相关字符串也不等于本项目已验证减弱行为。

React Bits当前[许可](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/LICENSE.md)标为MIT + Commons Clause，不写成纯MIT。实现时保留版权/完整许可、来源、上游SHA、所选文件哈希和本地改动记录，按许可将组件集成于本应用，不单独打包分发组件库。官网registry文件与GitHub提交不自动视为同一版本，按记录的文件内容逐项核对后再冻结。

## 页面分区与七种创意的工作

首页结构保持“创作引导 → 实用模板网格 → 紧凑灵感体验区”。顶部文字/导航、上传、任务、身份和真实结果预览都保持清晰稳定；不以扭曲图片掩盖真实内容。

| ID/组件与官方页 | 产品位置/目的 | 正常桌面触发与强度 | 舒适/低性能/静态降级 |
| --- | --- | --- | --- |
| RB01 [Dither Veil](https://reactbits.dev/animations/dither-veil) | 灵感体验区默认“色彩显影”页签，公开抽象图由点阵显色 | 指针局部揭示色彩，影响半径≤面板宽12%，过渡300–500ms；只在该区工作 | 直接显示原图，保留切换/说明；不遮主模板信息 |
| RB02 [Glow Cursor](https://reactbits.dev/animations/glow-cursor) | 首页hero留白处的蓝紫柔光，强化创意氛围 | fine pointer且hover设备；微光≤0.12opacity，半径≤48px，停止移动后≤500ms衰减并停RAF；保留原生鼠标 | 进入链接/表单/主工作区/体验区/弹窗即隐藏；coarse pointer、静态或reduce不启用 |
| RB03 [Ripple Distortion](https://reactbits.dev/animations/ripple-distortion) | 灵感体验区“水面涟漪”页签，公开旅行图的触感 | 移动时局部位移目标≤6px，离开≤600ms平复，文本层完全独立 | 原图或一次轻淡入；上传预览和结果始终原样 |
| RB04 [Halftone Reveal](https://reactbits.dev/animations/halftone-reveal) | 体验区“网点印刷”页签，公开人像的印刷显影 | 网点到原图的局部揭示，约280–400ms；离开平静恢复，不反复自动闪换 | 原图；键盘按钮可查看静态色彩版，不依赖hover取信息 |
| RB05 [Orbit Images](https://reactbits.dev/animations/orbit-images) | hero右侧三张公开作品环绕，展示创作多样性 | 一组，周期≥30s，图片不翻滚、文字不跟转；暂停入口可见 | 900px以下静态叠卡/横列；hover/focus暂停；reduce/离屏/标签后台停止 |
| RB06 [Pixel Trail](https://reactbits.dev/animations/pixel-trail) | 体验区“像素笔触”页签，明确的局部试玩 | 仅该面板追踪，粒子上限24，尾迹≤450ms；离开清理；不全站跟随 | 静态纹理/短淡入；触屏不拦截滚动，键盘仍能换页签/退出 |
| RB07 [Electric Border](https://reactbits.dev/animations/electric-border) | 一个主CTA/当前选择外缘，强调行动 | hover/focus进入时≤600ms轻电弧，冷却≥2s；低亮蓝紫小段边，不全框高频闪烁 | 普通focus/边框；提交中停止；控件大小/位置/可点击区域不变 |

体验区四个页签只渲染一个活动效果，保留可见名称和静态图，不将新效果分散成四个业务路由。普通桌面/系统无reduce/足够性能时，验收操作脚本必须能实际触发七种；移动/静态模式按上表降级是完整功能的一部分。页面上不展示框架/组件技术名作为操作术语。

## 并发与注意力预算

- 同一视口最多两个活跃运动系统；其中同时存活的已分配WebGL上下文最多一个（不是只数正在运行的RAF）。Dither/Ripple使用OGL，Glow/Halftone/Pixel/Electric源码也使用原生WebGL2；无额外依赖不等于无GPU资源。背景光晕改为静态渐变，避免与Orbit额外叠加持续运动。
- Hero默认Orbit + 指针移动时Glow；体验区进入交互时暂停Orbit并关Glow，体验区仅一个选中效果运行。Electric Border短事件不得叠出第三活跃系统，控制器先暂停低优先装饰；若原装饰拥有WebGL则先卸载/释放并确认上下文所有权退出，再挂载Electric。结束后先释放Electric，再按可见/偏好条件恢复原效果。
- M02–M10操作过渡也纳入活动预算，操作发生时先暂停低优先装饰；同次批量入场算一个系统，独立持续循环各自计数。多任务运行可用静态文字/状态点，不能让每张卡都单独持续旋转。
- Dither/Ripple/Halftone/Pixel互斥，不在同一图片叠四层。优先级为“真实操作反馈 > 当前体验 > 背景装饰”。
- 上传和历史主工作区不启用全局光标/像素/图片扭曲；已有任务卡保留M01–M10中的克制状态过渡，原生cursor/focus始终可辨。
- 全局“动态效果”快捷控制一键切换静态，详细偏好仍可在身份面板读取；系统reduce优先，不允许手动强行动画覆盖系统。

## 生命周期与性能

独立EffectBoundary管理用户偏好、IntersectionObserver、document.visibilityState、pointer类型、活动分区和性能降级；组件自身声明支持reduce也仍需项目级控制。WebGL由唯一token拥有者持有；跨组件切换先卸载/销毁旧renderer、纹理及上下文（按实际API实现dispose/必要时lose-context），确认释放后才授予新token。仅cancel RAF或display:none不算释放。卸载/切页/换页签/静态切换立即清监听/RAF/observer/纹理/WebGL资源，不等待退出动画。SSR仅静态poster，客户端惰性装载TS组件，不能顶层访问window或在每次轮询重建shader。

WebGL画布DPR上限1.5，活动像素目标≤1MP，离屏停止；context lost或持续明显掉帧时局部回退原图，不能卡住主表单。可见且交互时FPS连续2秒低于45作为起始降级阈值，先排除标签后台和初始化阶段；实际阈值在BASE同环境测试后冻结。运行数据只用于当前页面局部控制。

首屏增加的JS gzip目标仍≤35KiB；延后加载的全部创意增量总目标≤120KiB，必须测真实构建（含OGL/Motion/适配器），不得仅报首屏隐藏总成本。首屏图片预算800KiB包含Orbit/体验poster；复用已加载URL并按视口懒加载。无可归因的>50ms特效长任务、无阻塞点击/滚动/Tab、无持续闪烁为硬性舒适检查。

## 双门槛审核

**创意/美学门槛**：七项都有可触发实现、位置有目的，与蓝紫视觉一致；构图/层级、创意贴合度、色彩一致、动效节奏、克制留白五项各1–5分，独立Reviewer评分均≥4才通过。不能靠一张静态截图证明动效，也不能只展示上游demo。

**使用舒适门槛**：Acceptance逐项实测阅读不被遮挡、原生cursor/focus、点击/输入/滚动不受干扰、无刺眼闪烁、静态/reduce完整、375px/触屏降级、离屏/卸载资源清理、性能预算及全部P0回归；任何一项严重问题都不通过，不能用美学高分抵消。

Reviewer和Acceptance分别签署结论，Leader复现并处理发现，最终两门槛都通过、无未关闭blocking/major才能completed。不通过先调强度/频率/范围/并发和实现，再复审；不能静默删掉指定组件或将所有效果关闭作为“创意验收通过”。
