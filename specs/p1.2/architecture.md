# P1.2 动效实现与业务边界

版本P1.2-1.0.1。选定原Link+CSS/WAAPI公共图层为完整路由基线路径，CSS负责页面/状态入场和低频细边，少量SVG/WAAPI负责局部点击/图标/结果预览；React19.3原生ViewTransition仅在BASE实测取消/卸载及时性通过的安全场景启用增强；没有新增Motion运行依赖计划。Next16.4.3官方当前文档说明AppRouter无需配置支持原生转场，开发类型拟从19.2.14/19.2.3精确补为@types/react与react-dom19.3.0。NPM元数据已只读核对；启动BASE在容器验证并更新锁，不在准备阶段安装。

## 路由

继续使用Next Link/onNavigate和现有prefetch。onPointerDown只发装饰反馈；onNavigate仅针对实际客户端内部导航记录公共template.id/coverUrl，修饰键/中键/新页/外链/下载保持原生。任何业务导航不await动画、setTimeout或动态import。pending提示按真实useLinkStatus，固定尺寸且约100ms后才显现，预取快路由没有pending也正常。

原生ViewTransition只命名PUBLIC模板封面图，不包整个上传/历史主树，不捕获blob、私有结果或用户DOM；禁止默认root整页快照，实施时明确root view-transition-name:none并在真实伪元素/截图中验证。公共图外的正文用新页入场CSS，旧业务组件按Next原时机卸载，不用mode=wait保留旧轮询/请求。浏览器不支持时仍有按下+入场；CSS/WAAPI桥接只作为同公共图范围的增强兜底，任何兼容失败立即正常导航。

视觉协调器位于持久根的独立层，不对QueryClientProvider/IdentityProvider加pathname key或替换实例。每次导航有递增generation，仅保留一份公共图描述/可取消动画；快速连点、后退、路由失败、未知模板、会话变化、reduce/后台/卸载都清理。它不读写任务状态、不改变session-generation协议。

## 上传与任务

UploadSlot现有version/controller/mounted/preview回收、Maker locked/epoch/submissionGeneration和useTasks全部保留。动画只消费EMPTY/UPLOADING/READY/ERROR及submitting/受理事件，不在animationend修改业务状态；不把原生file input click放到Promise/RAF/timeout后。文件取消无状态变化；替换先按既有取消/旧响应保护执行，新图onload单向显露，旧私有URL不为动画延迟回收。

历史动画以userId+task.id为边界，版本变化只影响对应badge/当前阶段；身份变更清视觉缓存与覆盖层。首次恢复既有终态直接呈现，不庆祝；同终态refetch不重播。布局测量只在ID集合真实改变时进行一次FLIP，不在每轮poll/每帧读布局，不让动画改任务顺序、轮询数量或后端阶段。

## 弹窗与资源

原生dialog/showModal/焦点陷阱语义保留；打开同步建立模态后才做CSS/WAAPI，不await动画。关闭按钮最多120ms视觉收束但一次性注销；ESC、会话失效、父卸载立即取消/移除私有节点。监听animationcancel、隐藏/减少动态时直接收尾，timer/RAF/Animation.cancel始终幂等清理，关闭期间不能收到迟到上传/预览结果污染另一用户。

所有动画注册为可取消句柄，业务清理立即执行；全局仅一个按需点击/转场协调器，短效果结束后不留空RAF。静止页面靠低成本CSS/SVG边缘，不为每个任务/上传位建立循环RAF或GPU。P1.1的自动媒体/后台/离屏策略和已处理的CI诊断结论作为启动基线继承。

## 全站边界

新增app/loading.tsx、error.tsx、not-found.tsx覆盖路由框架边界，保留Studio自身模板query404处理；global-error.tsx是根运行受损时的安全静态回退，不依赖Motion/Identity Provider。所有错误仍有语义化重试/返回，不为动效隐藏错误或强制创建匿名身份。

## 原生转场的effect时序兼容门槛

React官方ViewTransition说明useEffect可能延迟到转场finished之后执行。当前上传/提交/useTasks依赖effect cleanup，因此公共封面命名/root快照关闭本身不能证明旧业务取消时机不变。BASE在原生路径逐时记录导航触发、旧组件unmount/cleanup、上传/提交AbortController、旧轮询停止、转场finished，比较普通Link基线，覆盖快连点/慢图/后台/身份切换。旧业务清理不能等220–280ms动画结束才执行。

若原生路径延期且不修改受保护协议无法保证，则该路径直接选Link+CSS/WAAPI公共图层兜底，原生仅保留实测安全场景；所有视觉效果仍需成立，不能削弱取消/旧响应断言或为共享封面保留旧业务树。此为执行BASE中有界兼容验证，不在准备期运行或先声称兼容通过。

## 认证结果显示变体（P1.2-1.0.1）

固定样例结果图片超过原预算，按[决策0014](../../docs/decisions/0014-p12-authenticated-result-thumbnails.md)冻结认证缩略图扩展。GET /media/results/{id}?thumbnail=true返回等比最长边512px、不放大、白底、质量0.88的JPEG，仅用于卡片；无query/false及预览始终原PNG字节。owner/会话/SUCCEEDED授权、no-store/nosniff保持；不持久化衍生文件、不改DB/任务/上传。Leader专有Api/ResultThumbnail及其测试，Frontend仅消费卡片src，Acceptance独立验认证/完整原图/逐页成本。预算与固定样例保持。
