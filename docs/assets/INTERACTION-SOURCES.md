# 交互设计参考与实际复用

公共模板封面衔接、新页入场、上传状态、任务阶段与预览，使用本项目实现的CSS/SVG/WAAPI。Next Link/useLinkStatus与原生input/dialog保留真实导航/文件选择/焦点语义。

- Next官方示例与文档：https://github.com/nextjs/react-view-transitions-demo 、https://nextjs.org/docs/app/api-reference/functions/use-link-status
- React转场说明：https://react.dev/reference/react/ViewTransition
- React Aria原生文件选择：https://react-aria.adobe.com/FileTrigger
- Motion空间关系参考：https://motion.dev/examples/react-layout-animation
- React Bits ClickSpark/StarBorder交互思路：https://reactbits.dev/animations/click-spark 、https://reactbits.dev/animations/star-border
- MDN可取消动画API：https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API

这些只作交互思路参考，没有引入额外Motion/Aceternity代码或运行依赖。实际公共封面桥采用原Link+有界CSS/WAAPI，未启用未经旧业务卸载时序验证的原生ViewTransition；用户上传与私有结果不作跨路由快照。

Orbit实际使用React Bits适配并保留原附加许可。山水擦雾、卡片点阵/网点/水波/像素与边缘角色由本项目Canvas2D/CSS/SVG实现；P2不附送六组未使用的上游组件源码。来源哈希、照片、水墨与当前文件清单见provenance.json，历史研究/私人参考留作者私有记录。
