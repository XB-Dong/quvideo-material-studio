# P1.2 参考与取舍

仅启动前研究：已阅读下列官方页面/公开示例与源码说明，未声称在用户浏览器实际观看或测过外部交互帧率。静态分镜是自己的计划，不是已实现产品；外部站点素材不复制到运行页面。

| 来源 | 采用的交互思路 | 在疏影的对应与取舍 |
| --- | --- | --- |
| [Next官方Frames示例](https://react-view-transitions-demo.labs.vercel.dev/) / [官方源码说明](https://github.com/nextjs/react-view-transitions-demo) | 公共缩略图与详情的连续关系 | 首页模板封面→详情示例，头部稳定；不套用整页私有快照或复制示例照片 |
| [Next16.4.3转场指南](https://nextjs.org/docs/app/guides/view-transitions) / [React19.3 ViewTransition](https://react.dev/reference/react/ViewTransition) | 以真实导航驱动共享视觉 | 当前runtime版本匹配，补开发类型；新页CSS入场与公共图原生增强分开，fallback不阻导航 |
| [Next useLinkStatus](https://nextjs.org/docs/app/api-reference/functions/use-link-status) | 慢导航有局部反馈、快预取无闪烁 | 真实pending约100ms才显示固定尺寸细反馈；不人为延长加载 |
| [Aceternity File Upload](https://ui.aceternity.com/components/file-upload) | 上传位微交互与文件卡片转换 | 借鉴按下/入图/边框语言，保留本项目原生file input和Java上传，不复制整套实现或新增drag/drop要求 |
| [Motion Layout示例](https://motion.dev/examples/react-layout-animation) / [AnimatePresence](https://motion.dev/docs/react-animate-presence) | 元素空间关系与短进出 | 任务插入/预览与CSS/WAAPI呈现，不为exit保留旧业务树，不增加Motion运行依赖 |
| [React Aria FileTrigger](https://react-aria.adobe.com/FileTrigger) | 原生选择器与可访问激活 | 点/Enter/首tap保持直接选择，无await动画，不复制身份或上传逻辑 |
| [React Bits ClickSpark](https://reactbits.dev/animations/click-spark) / [StarBorder](https://reactbits.dev/animations/star-border) | 局部短点、沿边星光 | 只用于真实操作和当前上传位；4–6点/短寿命，不全站烟花；候选原组件包含RAF，须改为有界/可停，非纯CSS库 |
| [MDN WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) | 可取消动画句柄 | 每次视觉动作可cancel，身份/路由/媒体变化立即收尾 |

ClickSpark/StarBorder实际registry3源码文件hash、imports/deps与完整许可类型见reactbits-audit.json；没有安装、vendoring或修改产品。许可沿用完整MIT+Commons Clause声明，不简称纯MIT。NPM开发类型元数据/peer/integrity见dependency-plan.json，准备只读，不更新锁。官方文档可作为版本依据，但实际兼容仍须启动后在已锁容器验证。

原生ViewTransition的effect时序是明确兼容风险：官方说明useEffect可能晚于finished；BASE必须用上传/提交/轮询的逐时abort/卸载证据决定可用路径，不能只因版本匹配就认为不会影响业务。完整Link+CSS/WAAPI基线路径始终可交付。
