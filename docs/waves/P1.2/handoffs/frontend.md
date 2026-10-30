# P12-R1 Frontend首稿交接

- taskIds/rootTaskIds: P12-FOUND, P12-ROUTE, P12-STUDIO, P12-HISTORY, P12-DIALOG
- baseCommit: 33170a5ae33cc63882f73c329dbd88eda6f5e70c
- specVersion: P1.2-1.0.0
- implementationCommits: 7e01614 → d3f0207 → 4e55e3e → e30a407 → b0806fc → 1106d41
- role: Frontend (sole writer); actualProvider/model/reasoning: null, inherited current session
- observed work period: 2026-10-30约12:46–13:00+08:00；非人工投入精确计时

## 实现

独立持久VisualJourney层，只记录同源/media/demo/公共模板封面rect/URL，原Next Link onNavigate立即执行，不等待动画。原生React VT未启用，不保留旧业务树或root/private快照。新页CSS200ms入场、公共封面260ms WAAPI桥、真实useLinkStatus100ms后细线、局部6粒短点260ms；快速导航、popstate、session-expired、reduce/hidden与卸载取消，不留空RAF。

制作/嵌入/独立历史用最多两条低频纸面SVG路径。上传只消费原EMPTY/UPLOADING/READY/ERROR：原生label/input同步选择，不额外input.click，不改choose/clear的version/controller/blob/onChange协议；空位/按压/预览显露/不定量细边/就绪勾线/错误/替换与移除状态反馈。提交锁和POST原样，受理message与记录继续以真实服务器为准。

历史保持useTasks，TaskFrame只消费真实status/stage变化；阶段节点按服务端steps/currentstage，只有一个活跃任务强调，初次恢复终态不播放成功显影，refetch不重播。缩略图打开原生dialog，当前实际图片节点200ms展开/关闭120ms，不clone私有图；ESC/身份卸载立即清理。loading/error/not-found/global-error覆盖框架边界；模板query404单独StatePanel，有真实重试/返回。

首页原布局/素材/水墨裁切/雾数值/四卡/Orbit未改，只加Link反馈与publicId。Ink单Image Promise缓存避免enabled初始false→true/路由重建重复请求；每个effect仍独立canvas/监听/RAF取消。无新增runtime依赖、无package/lock改动；QueryClient/Identity实例及受保护lib/旧业务测试零差异。

## 实际检查与失败

容器 `docker compose -p p12-front-test -f compose.yaml -f compose.test.yaml run --build --rm --no-deps frontend-check`：首轮global-error原生a被Next lint拒绝，已改Link；Modal effect捕获警告改稳定entryref。第二轮lint/typecheck/原31tests通过。随后添加useLinkStatus时漏import被lint准确拦截，修正后最终04:58:03UTC对应12:58:03+08:00 lint/typecheck/34tests全部通过，exit0，含新3项公共源拒绝/身份立即取消桥/reduce清短粒子行为测试。未删改任何原测试。

`docker compose -p p12-front-test -f compose.yaml build frontend` 在b0806fc通过Next16.4.3 compile/TypeScript/static route/生产镜像，exit0；1106d41新增小改由Leader集成构建覆盖。格式仅使用一次性Node22.22.0-alpine容器npx prettier3.6.2，无宿主产品执行。

## 未验证与下一步

作者未自签G01/G02；实际页面、多帧、导航/chooser时序、三页三轮成本、truecoarse与后台由独立Acceptance/Reviewer审。主服务未由作者重启，未push。Root发现原pet结果PNG卡片成本超过固定样例预算，拟冻结认证thumbnail=true变体；待契约后Frontend仅卡片消费，预览保原PNG，不擅自降质/换样例。任何同根因修正保留原任务ID与失败证据。


## 缩略图契约消费

Leader于e9becdb冻结P1.2-1.0.1/决定0014后，仅History结果卡片的img src加thumbnail=true（保留既有query连接规则）及loading=lazy；Modal preview.resultUrl仍无改动，原PNG完整字节用于实际预览。私有图不进入公共桥缓存，Java认证/no-store/nosniff与512px/JPEG编码由Leader实现和验收。删除上传图后只让无数据空图标短入场，原blob仍立即回收。


## P12-ROUTE 首轮美学修复

采纳独立Reviewer实际多帧发现的major：原始FLIP将竖卡片按X/Y分别缩放到横示例图，过程使人脸非等比。修正为一个公共img固定层的left/top/width/height260ms几何衔接，其object-fit:cover始终按自然比例裁切，不再使用各轴scale。此层仍不拦操作，取消入口原样；一个短几何动画的真实交互成本与多帧由独立验收复核。自有生命周期测试额外守卫关键帧含尺寸且无transform非等比缩放，不替代实际美学复验。


Reviewer实际ERROR截图minor已采纳：无preview时不渲染hover胶囊，JPEG/PNG/格式错误说明不被覆盖；原label/input和error语义未改。已实际view该截图确认触发。最终对应容器检查继续由实际session输出记录，不改独立故障边界fixture。


## P12-FOUND/SCENE 离屏与弹窗暂停修复

真实容器浏览器复现：匿名会话上传201/提交慢任务202，在focus上传位后滚出视窗，slot与task的bottom均小于0，p12-flow和p12-node仍running；身份dialog打开后task node也仍running。复现仅为保证两个区域真正离屏加入底部1000px空白滚动脚手架，没有改业务或伪造任务状态。原始报告位于忽略的runtime/p12-offscreen-owner/repro.json。

给UploadSlot/TaskFrame/Maker根节点接现有纯视觉IntersectionObserver，CSS以足够specificity暂停离屏上传边、任务node/orbit、提交操作反馈；dialog打开时暂停这些背景循环，dialog自身正常入出保留。上传请求/轮询/组件挂载/slot版本等业务不随离屏取消。新聚焦测试验证IO失交/恢复、断开与业务子节点仍保留。backdrop伪元素单独覆盖motion-static与系统reduce，避免仅通配后代遗漏。实际集成浏览器复验仍由独立Acceptance执行。

离屏修自测首轮新测试漏导入hook被TypeScript阻止，改精确import后05:12:47UTC/13:12:47+08:00容器lint/typecheck/35tests全部通过（原31+4视觉行为）。未弱化检查。脱敏修前实际浏览器报告见evidence/frontend/offscreen-before.json，报告明确部署SHA由Leader日志记录，不能将当前worktree HEAD冒充共享运行源。


## P12-DIALOG 冷原图major修复

独立Acceptance对5e2原PNG延迟600ms复现：img0×0/小dialog在load后跳为702×468/760×606且无图动画。作者实际view cold-open图后采纳。新增ResultPreview：从当前缩略图只取自然宽高比作为元数据，固定702px/视窗限宽高比例画框，原PNG未加载时即占最终空间；同步showModal不变。真实load/缓存complete后只对当前真实img节点做一次200ms等比轻显影，不克隆或缓存私有像素。媒体/隐藏、身份失效、开始关闭/ESC和卸载取消待load动画监听和Animation；普通加载状态仍能落到真实就绪/错误静态内容。失败文案保留同框和可用关闭。

首轮新测试在身份失效后用默认accessible role找已隐藏img而失败，改为失效前持有节点再验证隐藏/不动画，未改变产品保护。最终05:19:21UTC/13:19:21+08:00容器lint/typecheck/39tests全通过，包含冷load单次显影/预留、媒体提前取消、身份隐去与失败、close起点取消4新用例；原35不减。隔离Chromium实际CSS支持验证为true，1440×1000画框在图片未加载时702×468；完整dialog冷延迟多帧仍待独立复验。


## 收尾状态边界修复

UploadSlot状态class随上传完成而重写，纯class IO标记可能丢失；Observer改为同时写不由React管理的data-p12-offscreen，暂停CSS以该属性覆盖。扩展既有IO行为用例：离屏后class从empty变ready，暂停属性仍保留，真正回到视窗才移除；不触碰上传请求/版本或任务查询。

采纳Acceptance实际route错误恢复major：合法JSON中坏title渲染失败后持久Query缓存保坏data，Next reset可循环回错误页。仅app/error“重新加载”改真正window.location.reload()，符合文案并重新获取正常响应，Cookie/Java任务与原记录不清除；global-error已独立通过的reset不变。完整恢复动作由独立浏览器复验。

此收尾小补丁容器05:22:39UTC/13:22:39+08:00 lint/typecheck/39tests再次全部通过，exit0；未改原31业务保护，未削减视觉用例。
