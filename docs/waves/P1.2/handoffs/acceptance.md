# P1.2 独立验收交接

- taskId/rootTaskId: P12-ACCEPT；roundId: P12-R1；waveId: P1.2。
- 派发精确 base: `33170a5ae33cc63882f73c329dbd88eda6f5e70c`；当前契约 P1.2-1.0.1（认证缩略图契约扩展）。原准备包的 prepared 状态、旧 base 由 Leader 的授权派发覆盖。
- 最新实际应用源码：`3008c09f16bf2b29d23191e88c4db8062b17a99e`；当前六项主验收 harness：`e14153121128dcea5250705ab8f2cc38c1bfebe9`。下方原阶段证据保留当时应用8a3f8bd、主harness b3b2149、相位审图CLI d793346的准确来源；最新结果见本文末更新。源码版本与脚本版本分别记录，未把后续文档提交冒充部署。
- 角色 Acceptance；requestedModel/reasoning 继承；实际 provider/model/reasoning 均 null，未验证。未创建子 agent。
- 写入仅 tests/p1.2/、本 evidence/acceptance/ 与本交接。P1.1 的 accept.mjs 图片就绪修复曾获单文件转交，独立提交 b07366e；未改其它旧 helper、产品、根 CI、Compose、锁或契约。

本地技术与舒适度 G02 通过，依据为下列明确标注版本的连续证据；远端完整 CI 与 Leader 最终集成签收仍待 Leader 实际核验。邮件已由用户明确暂缓，不宣称已处理。未启动下一波、未提交试卷。

## 实际结果

| 检查 | 应用与结果 | 证据 |
|---|---|---|
| 原有及扩展功能 | 5e2af4c 25/25；键盘/真 coarse 首触导航、真实 chooser、取消保图、多上传位/旧响应、重复提交锁、2 成功 + 指定失败、503 与任务失败区分、刷新/终态停轮询、身份/404 | 5e2-functional.json |
| 子页像素、持续场景、refetch、dialog、reduce、离屏、缩略图、框架错误 | b2d0a6a 首轮 14 pass / 2 selector fail；保持原失败，修正唯一导航和整段 banner 匹配后严格 cold 六项 6/6。合计 16 个独立必需案例均有通过证据，未声称一次完整 16/16 运行 | b2d-visual-first-14-pass-2-selector-fail.json、b2d-cold-six-pass.json |
| 新 RO 转场归因 | 8a：原 connect 堆栈强制 Layout 15.884ms 消失；普通 natural/Next 与 Playwright visibility 的布局仍保留。trace 只用于归因 | 8a-ro-trace-comparison.json、8a-route-diagnosis.json |
| 制作页 CLS 有界诊断 | 8a 三轮 0 / .000094198 / .000106944；原 56px margin 塌陷不再出现 | 8a-studio-cls-diagnosis-pass.json |
| 正式三页各三轮 | 8a 九轮逐轮通过，最大首 JS gzip 186817B ≤192215、图片 560902B ≤819200、CLS .025753123 ≤.1、每轮 errors0 | 8a-measure-nine-pass.json |
| 无截图真实操作与常态 30 秒 | 8a 所有操作窗口 longtask 候选0、errors0、延后 JS3381B；含真实 Link、chooser/取消/替换/移除、连续制作、真实原 PNG 预览、历史/身份 | 8a-interact-pass.json |
| 大合法文件 | 同一真实 chooser 选择容器真实文件；4194304B JPEG，后端接收字节一致，480×640；不冒称20MP性能 | 8a-interact-pass.json、b2d-upload-transport-ab.json |
| 原生后台/恢复 | 8a 主 Compose 重建真实 headed/Xvfb 入口；首页、制作、历史三页同窗口切真标签，trusted hidden、RAF0/GPU0/动画停；历史原 PNG 冷请求在 hidden 完成也不重播显影 | 8a-native-three-pass.json |
| 最后差异审图与首触上传 | 8a 真 GET loading/ready；公共桥原260ms WAAPI70/150/230ms受控相位后清理；真 coarse=true/fine=false/touch1，首次触摸 chooser 在截图前，同次手势/单事件，取消保图 | 8a-affected-review-pass.json；raw affected-review-r4 PNG |
| 预算守卫 | 容器 Node 测试4/4；重单轮不能靠中位数通过、JS固定上限与请求异常不能被掩盖 | tests/p1.2/budgets.test.mjs；实际退出0 |

5e2→最终8a后端及身份/API/controller/轮询实现无差异；后续视觉差异依次由实际 cold、边界恢复、离屏、RO、正式预算与原生检查覆盖。原31前端、Java/API受保护检查由 Leader 执行并在最终 CI 全跑；本交接不伪称由本角色再跑全部旧单测。最终远端仍会一次运行完整25与完整16聚合。

## 失败、修复与有界重诊断

所有实际失败均保留在本 evidence 与 ignored raw，不重置 rootTaskId，不放宽门槛。

- 基线制作/历史图片超预算：两真实原 PNG 与重复水墨请求；Leader 引入同鉴权的512px缩略图，原 PNG/数据库/生成不变。独立验证 MIME/尺寸/原图 hash/有效与无效参数、未终态/未知404、跨身份404/过期401、no-store/no-sniff及实际响应时刻。
- 冷原图0尺寸导致 dialog 大幅跳变、无显影；真实 render fault 的 app/error retry 无法恢复；聚焦上传位/活动任务离屏及 dialog 背景继续循环：分别提供失败与复验证据，FE 在原边界修复。query404 没有冒充框架错误，两类真实 React render fault 均运行并恢复。
- 首次 interaction 的真实 route54ms：trace 定位 connect 同步 getBoundingClientRect 的 Layout，FE 改自然 RO 阶段，最终无截图操作通过。未凭猜测改 Ink。
- 大文件 buffer 方式在 URL 创建前611–729ms：同字节同 chooser 的磁盘路径 A/B 为0候选，修 harness 传输方法，真实4194304B上传未删减。
- 正式旧九轮 studio2 CLS .177731882；有界三轮再现 .179281270，定位 MAIN56px margin 塌陷，FE 仅用 Studio main flow-root/min-height修正。最终九轮全部独立通过，没有用中位数替代重单轮。
- native 第二页首次返回 DOM 对象导致 CDP returnByValue 序列化失败；改语义相同的布尔谓词后主 Compose 三页通过，不把工具错误标作产品回归。
- 差异截图的首次 outstanding unroute 工具错误已修；随后即时 main100→92严格等式连续失败2次，按协议停重试查源码，确认规定 p12-page-in 从8px入场；改等待实际有限 Animation.finished 后才比较稳态。两个失败保留，未再靠 sleep；原 CLS 门槛未动。详见 8a-affected-review-harness-failures.json。

## 命令、环境、时间与限制

所有产品执行/安装/构建只在容器。测试 worktree 为 `C:/Users/dongx/.codex/worktrees/p11-acceptance/杭州小影AIcoding`。默认 Node22.22、Playwright1.58.2、Chromium149.0.7827.53，ANGLE SwiftShader；headed 使用 Xvfb。没有并发性能浏览器、没有截图/trace栈混入正式 interaction；measure在指标读取之后才截图。

有完成时间戳的本轮证据范围为 2026-10-30 12:52:27 至14:21+08，早于12:52的准备开始时刻未精确记录；不能把 capturedAt 伪作命令开始时间。最终 interaction完成14:12:45、九轮14:14:54、native14:15:45、差异截图14:18:52+08。各 JSON 保留原 UTC capturedAt。

主要命令（完整来源与结果见 JSON、tests/p1.2/README.md）：

```text
docker run --rm -e TESTED_COMMIT=8a3f8bd12c1fc889566e82f9c2ad95cd96544524 -v <worktree>/tests/p1.2:/checks/new:ro -v <raw-subdir>:/evidence material-studio-browser-p11-check /checks/new/{diagnose-route,interact,measure,affected-review}.mjs
P12_MEASURE_PAGES=studio P12_TRACE_LAYOUT=1  # 仅限定三轮诊断；正式measure未设置筛选
docker compose -f compose.yaml -f compose.test.yaml run --build --rm --no-deps browser-p12-headed
docker run --rm --entrypoint node -v <worktree>/tests/p1.2:/checks/new:ro material-studio-browser-p11-check --test /checks/new/budgets.test.mjs
```

headed命令按 Leader 明确授权仅在 primary 读取/执行，未写共享源码；TESTED_COMMIT 为8a，P12_EVIDENCE_DIR 指向本 worktree ignored runtime/p12-8a。最终各入口退出0；旧失败退出1详见保留证据。未重启或删除共享应用/数据卷，无 remote push。

限制：本地软件渲染不代表硬件 GPU 或 Windows/IAB 实体最小化；chooser以 Chromium intercepted chooser 与空选文件模拟取消，未控制 OS 对话框窗口；截图中的桥相位为真实原动画受控暂停观察，不宣称默认时序；大JPEG是尾padding传输，不宣称20MP解码。独立 G01 由 Reviewer 实读图单独签，不把作者/本角色自查冒称美学审核。

raw位于本 worktree `runtime/p12-*`，manifest为 p12-raw-manifest.json；完整trace/PNG/4MiB测试输入不进Git，synthetic.storage-state认证文件默认禁写、显式调试产生的旧文件只留ignored且不进manifest/CI普通artifact。归档worktree前请Leader将raw安全保存到其受控证据目录并复核hash；不要手动删除工作树。后续只等待完整远端CI与Leader签收，不启动新工作。

## 远端 CI 41012646536 的离屏前置诊断与复验

首轮最终CI c7f2af6 的前后端、旧P1.1检查已过，新P1.2视觉14通过/2离屏失败，完整原visual与lifecycle失败保留。原harness失败时未存IO/属性快照，不能先断言产品漏停。随后只读native IO诊断240e59e7a8710195aaf4e55daad56b1066a9279d实际复现：slot几何bottom -561.59、hidden=false、原200ms仍无新false/data=false/动画running；恰一次viewport render后真实false交付，data=true、CSS/动画paused，恢复真实true后running。第二轮带真实bringToFront前后记录，两项原checkpoint本来已暂停。无证据支持持续CSS漏停，未改产品。

Leader实读诊断后授权唯一正式harness修正：只读nativeIO审计；保留原200/250 checkpoint；几何确认后恰一次viewport screenshot allow；shot后500ms内必须有本轮目标false，立即原0running无限动画标准，恢复必须有本轮true并running。缺事件明示trigger prerequisite failure且exit1，不靠超时放宽或反复补帧。新增焦点/可见/非reduce/dialog0/active emphasis与服务端仍RUNNING守卫；只将活动mock延长至4+10+2=16s防自然结束假绿，seed35s不变。observer回调this/entries/observer与原生一致，不覆值/不dispatch假事件；25ms定时只读轮询不申请补充RAF。

局部正式两项最终代码实际exit0，证据8a-lifecycle-native-trigger-pass.json，应用8a不变。中间两次相同功能pass属于增加callback this忠实转发、显式allow、无RAF轮询后的必要局部复验，不是失败重试求偶然绿。原无截图interaction、九轮measure和native入口未改、结果继续有效。远端最新失败保持事实，等待新harness完整CI，不能据此提前声称远端通过。

## CI 41016072989：完整功能/视觉通过，首次提交性能仍待处理

本轮远端fabdb38fc0ed8f948cef8b4e77dccdf401f23059前后端/旧P1.1已过，P1.2实际一次完整25功能与16视觉（含nativeIO前置两项）全部pass，原JSON已保留。没有重跑已通过前功。新失败在无截图interaction：submit0窗口10510.6–10861.1内at10738.1/duration76ms，非route或4MiB阶段；errors0/lazy3381B/真实4194304B正确。原失败不删除、不放宽50ms或添加任意筛选。

有界诊断第一次只trace首次提交，发现响应后Reactcommit69ms、CPU31.906ms在history tasks.map日期toLocaleString；第二次根据Leader要求将trace起点提前至大图选择前，保留READY→立即submit顺序，仍在API202后Reactcommit61ms复现，CPU29.241ms精确script24/column19943，对应部署chunk2jhh2aiuzz49e.js列19942与history.tsx185–191的createdAt.toLocaleString(zh-CN,month/day/hour/minute)。API POST8411.866→2028505.493，Reactcommit8513.8–8574.8，首卡DOM8575.6；普通Layout8583.5之后11.46ms，无旧connect强制布局/Ink主导证据。另有click复合54/80ms含Playwright hit-test与提交状态React，诊断开销如实保留。

这些是有时间线和CPU源位置的首次日期格式化成本候选，不能将无trace的CI76ms全量归因冒称已证实；已交Leader决定针对实际源的有界优化与后续无截图复验。当前未改产品/门槛/无截图interact，整体远端仍失败，后续正式九轮/native尚未在该CI运行，不宣称整体通过。

## 最终3008源码：日期热点修复与用户直接授权品牌corner

Leader已部署3008c09f16bf2b29d23191e88c4db8062b17a99e，明确health=healthy后开始本轮检查。8a→3008仅history日期纯helper及用户直接要求wordmark角标（去方框/重复字/英文caption）；身份/API/controller/轮询/creative/Ink/globals无差异。旧8a与CI失败证据不覆盖。

首先独立真图：1440 header92/x32、375 header76/x16，可访问名和唯一可见词为疏影，真实键盘Enter/true coarse首tap原生Link返回首页4稳定ID、无溢出。Reviewer已实际view desktop-home/header与mobile-home/header并明确局部G01通过（本角色不代签）。用户可查看raw runtime/p12-3008/brand-review/。原25内品牌check同步保护这些属性；单独CLI验证相同实际语义，不重新跑已通过的完整25业务。

截图浏览器彻底close后，新容器/新Chrome运行原磁盘path interaction，未改代码/50ms标准/大图READY立即submit顺序，无Intl warming：全部真实阶段及30秒常态longtask候选0、errors0、lazy3381B，4MiB真实4194304B480×640保持，exit0。随后同一原measure新代码三页各3轮全部逐轮pass：最大首JS186789B≤192215、图片588726B≤819200、CLS .016538101≤.1、errors0。具体每轮在3008-measure-nine-pass.json，不以中位数替代单轮。

性能全部结束后，独立日期显示检查：3条真实记录与原zh-CN本地calendar一致；另以声明的合法ISO响应fixture覆盖UTC/AsiaShanghai/AmericaNewYork共6个context/18条真实React日期文本比较（年/闰日跨界与美国spring DST），全部等于原Intl形状。仅GET历史响应createdAt变更，后端未改，状态仅内存不落cookie；Intl比较绝不发生在原performance浏览器，不声称预热收益。

本地G02更新为3008源码通过，摘要3008-local-g02-summary.json。继承远端41016072989已实际一次全25/16通过及8a未变模块native3/离屏/身份业务证据；新的品牌断言和最终源码仍待Leader完整远端CI核验。不声称已经远端全绿、不改邮件暂缓、不启动下一波。最新raw及hash已入manifest，归档前仍需Leader安全保存ignored证据。
