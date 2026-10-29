# P1 前端视觉与交互提升计划

版本P1-1.1.0；2026-10-29。P0已完成并封存07300db，验收4dd397f三项CI通过。用户当前请求P1启动前所有准备，并增量指定React Bits七种创意及美学/舒适双重审核。本轮授权文档、研究、候选素材、可视方向板和只读审阅；产品实现待用户启动。

## 范围与结果

交付统一蓝紫的列表、制作、历史、身份/预览弹窗，四套优质本地素材、自然操作动画及七种有目的的创意效果。需求见[requirements](../../../specs/p1/requirements.md)，七组件位置、强度、生命周期、降级和双门槛见[React Bits契约](../../../specs/p1/react-bits.md)。

首页采用“轻量创作引导 → 实用模板网格 → 紧凑灵感体验区”：Orbit Images和Glow Cursor位于引导，Electric Border强调一个行动入口；Dither Veil、Ripple Distortion、Halftone Reveal、Pixel Trail在四个互斥页签中体验。上传、任务和真实结果保持稳定清晰。七项均可在正常桌面实际触发，不能靠全部关闭通过创意验收。

蓝紫背景使用静态渐变；同视口最多两个活跃运动系统、一个WebGL上下文。全局一键静态、系统reduce优先、移动端/低性能/离屏降级；优先保证操作和阅读。业务边界与P0状态机制保持，性能、可访问性和完整P0回归都在本波验收。

## 已准备与启动门槛

需求、文件地图、方向板、四候选来源/哈希、七组件源码/依赖/许可审计、视觉与动效规格、迁移/回滚、角色/所有权、九个任务包和验收矩阵已形成。准备经文档检查和独立只读审阅后为ready_for_user_start，executionAuthorized=false；这不等于P1实际美学/舒适已通过。用户明确启动后，R0锁定最新精确SHA、复核来源许可、采集容器/浏览器基线及验证依赖，再派发开发。

## 波次内任务

| 顺序 | 任务 | Owner | 依赖与门槛 |
| --- | --- | --- | --- |
| R0 | P1-BASE | Leader | 用户启动；P0同环境性能/包体、回归基线；验证锁定Motion14.7.1/OGL1.0.11候选与组件来源 |
| R0 | P1-DIRECTION | Leader | 启动后冻结布局、七效果/双门槛、来源、预算与唯一文件owner |
| R1并行 | P1-ASSET | Asset Integration | BASE+DIRECTION；JPEG封面/PNG结果、V3/allowlist/公开demo MIME、旧结果兼容与回滚再升级 |
| R1 | P1-VISUAL | Frontend | BASE+DIRECTION；tokens/完整布局/组件状态/静态体验区骨架，读取Java真实coverUrl |
| R2 | P1-CREATIVE | 同一Frontend Agent | VISUAL；接入七个TS-CSS组件、局部互斥与资源控制器，保留许可和来源 |
| R2 | P1-MOTION | 同一Frontend Agent | CREATIVE；M01–M10操作动画、统一偏好与动效编排；保留请求/身份/任务生命周期 |
| R0–R3 | P1-ACCEPT | Test/Acceptance | 可提前设计；运行验收等ASSET+CREATIVE+MOTION集成，独立签署舒适/性能/P0回归 |
| R3 | P1-REVIEW | Reviewer | 资产席位释放后可早审；最终核对七项与全部证据，独立签署创意/美学 |
| R4 | P1-DELIVERY | Leader | 两门槛通过、无开放blocking/major；CI、干净Compose、README/报告/来源/源码包/回滚，随后停止 |

## 多 Agent 与所有权

一主最多三子。R0/R1为Frontend、Asset Integration、Acceptance；资产完成释放席位给Reviewer。Frontend同一写入者依次VISUAL→CREATIVE→MOTION，避免并发改globals.css/Shell。角色职责、文件边界与交接见[ROLES](ROLES.md)，任务包不是执行授权。

Leader单写共享依赖、specs、CI/Compose、state和集成。Frontend不因动画改useTasks/api/identity generation；真实缺陷独立记录、转交owner、回归。Asset只允许资源、V3、FilesService及Api.java公开demo MIME最小适配，不改任务/身份业务。Acceptance签舒适门槛，Reviewer签美学门槛，Leader处置并复验；作者自测不能替代两份独立结论。

## 时间与修复预算

增量七组件后的有效投入估算10–14小时：基线/方向/依赖约1–2h，素材与视觉并行约2–3h，创意适配/互斥/降级约3–4h，操作动效/独立验收/修复/交付约4–5h；有交叉重叠。该值是投入估算，不是承诺截止；无用户确认的绝对截止，不从题面倒计时推算。记录实际墙钟、并行角色与未知人工投入。

每项任务60–90分钟检查成果/依赖。相同根因两次无效修复后重新诊断、记录有界替代路径，保持原任务修复计数。预算不足如实报告，不能删掉七项创意、降低双门槛或牺牲P0回归。

## 完成与停止

验收矩阵全部强制项有实际实现/证据：七项正常桌面演示、美学五维各≥4/5、舒适全部通过；桌面/375px/键盘/静态/reduce、动态并发/资源清理、许可/包体/性能、16前端/12Java/8API及CI。旧结果字节保留，P0→P1→快照回滚P0→再次P1可执行。交付验收SHA、报告SHA、来源与未验证分支后停止，后续波次另行安排。


创意分区可视提案：[七创意场景图](references/creative-scene-map.svg)；它是静态编排示意，实际动画与舒适度待P1实现验收。
