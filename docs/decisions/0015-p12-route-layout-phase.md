# 公共封面桥的布局读取时机

2026-10-30执行修正，P12-ROUTE原root。独立b2d诊断再次捕获54.126ms RunMicrotasks：React调度/提交29.124ms，VisualJourney connect24.461ms；connect的getBoundingClientRect栈触发UpdateLayoutTree4.303ms及Layout15.884ms。原始trace保留，诊断不是预算通过结果。水墨初始化曾列为候选，目前未证实主导，不据猜测修改首页背景。

选择：只查找公共目标，不在React提交的微任务里立即强制读取全页布局。通过ResizeObserver在浏览器完成正常布局后取得目标几何；读取后断开观察再创建唯一fixed桥，不能修改被观察目标尺寸。[MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)说明回调发生在绘制前，并警示回调修改观测尺寸可能造成循环，因此明确disconnect-before-write。

Link、文件选择及业务卸载时序不改变；generation、路由/身份/reduce/hidden取消、700ms边界及公共源白名单保持。缺少RO时保留完整CSS/Link反馈，不靠延长业务等待或保留旧业务树。修复须证明connect强制布局减少/消失、实际公共图转场仍可见且能取消，再运行无截图交互门槛；不能只用setTimeout把长任务移出计量窗口。
