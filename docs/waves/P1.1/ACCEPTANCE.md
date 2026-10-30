# P1.1 验收矩阵

版本P1.1-1.0.1；实际应用源码64e919aac25cacf7f1193b4a361071e5d03ef635。本地技术/视觉与独立G01通过；用户明确暂缓MAIL-01，技术/舒适门槛保留，独立当前范围G02与远端完整CI通过。证据见[evidence/acceptance](evidence/acceptance/64e9-functional.json)、[独立美学](reviews/implementation-review.md)及[报告](REPORT.md)。

| ID | 必测场景 | 通过条件 | 当前 |
| --- | --- | --- | --- |
| BRAND-01 | 三页/两dialog/metadata/favicon | 当前可见疏影，无映作残留；历史证据不追改，旧身份/作品保留 | passed locally on 64e9 |
| AUTO-01 | 首载、旧yingzuo-static=true、hover/focus、30秒闲置 | 无动态/静态/暂停/继续按钮；正常持续边缘/Orbit、真实擦雾，不靠隐藏开关开启 | passed locally on 64e9 |
| AUTO-02 | 系统reduce实时切换/原生后台/离屏/卸载 | 自动降注意力与实际RAF/上下文释放，返回按新策略恢复，不重置业务会话 | passed locally on 64e9 |
| INK-01 | 正常软件默认模式移动轨迹 | 模糊山水可辨；同坐标笔触变清晰、连续轨迹/柔回雾；不是光圈或静态fallback，真实像素/清晰度与序列证据 | passed locally on 64e9 |
| EDGE-01 | 正常软件3种以上边框/当前卡/主入口 | 电弧、流光、追光等差异可辨，持续可见；读字稳定、无大白块/闪烁/位移 | passed locally on 64e9 |
| CARD-01 | 四真实模板/切分类/快速进出 | 按ID不串图/效果/错误；标题数量不变；无gallery/作品题材tabs，原图信息可读 | passed locally on 64e9 |
| CARD-02 | 全卡点击/Tab Enter/触屏首次点击 | 唯一Link直接详情，无Canvas抢事件，无等动画完才能导航；触屏只tap不先mouse.move，记录实际coarse/fine/hover | passed locally on 64e9 |
| LIFE-01 | 背景+边框+当前卡、resize/30秒循环/异常图形 | ≤1存活主WebGL、有界2D与监听/纹理、无每卡重context；软件也有基础动效，异常仍可制作 | passed locally on 64e9 |
| PERF-01 | 相同驱动/条件3次基线与新版本 | 每轮全图片≤819200、JS≤192215、CLS≤.1、pageerror0；延后JS≤122880，背景CSS/fetch/位图及内嵌图不漏计、不去重 | passed locally on 64e9 |
| PERF-02 | 无截图真实指针/分类/上传/键盘/滚动 | 无归因于效果的>50ms交互longtask；初始化与交互分开；拍照/强制软件FBO不冒充性能 | passed locally on 64e9 |
| REG-01 | 前端、Java/MySQL、8API、真实业务 | 原业务保护通过；多任务/查询503≠执行失败、身份/401/旧响应/提交锁/刷新/终态停止等不退化 | passed locally on 64e9 |
| MAIL-01 | 旧CI通知、当前CI、规则正反例/生效范围 | 仅目标仓库Actions；不影响其他仓库/PR/安全邮件；归档可撤销、原件可查、不新发测试邮件、账号开关不变；不能称源站已停止投递 | deferred_by_user |
| G01 | 独立美学 | 构图层级、创意贴合、浅色配色、节奏、克制留白逐项≥4/5；基于真实默认体验/动态，不只示意图 | passed 4/4/4.5/4/4.5 |
| G02 | 独立舒适 | 上述操作/媒体/资源/性能/P0全部通过；与美学分开，任何blocking/major不通过 | passed current scope; MAIL deferred |
| DEL-01 | 完整CI、来源、报告、部署/回滚、源码包 | 实际验收与封存SHA明确、邮箱动作脱敏、实际投入/AI流程/限制真实；然后停止 | passed at a7cdcdf; MAIL deferred |

默认软件路径与正常硬件增强分开。卡片原shader可用明确fixture补功能，但背景/边框/主要交互必须在未改能力消息的默认路径实际可见，不能只靠fixture“看见效果”。真实硬件实机未测如实写未验证。

旧P1手动开关/gallery断言已不符合新需求：在新tests/p1.1中替换，原多任务/会话业务断言继续。原31前端中的业务保护不能以重写视觉测试为由删除；Java15/API8保持。先拍真实动态，再独立验美学与舒适；准备Reviewer通过不是G01/G02通过。

远端验收a7cdcdfe4a0dd38db1763b436ed67c6cedf76d76，[三项完整CI成功](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/41002700967)，浏览器22/22、视觉6/6、原生后台、无截图性能与三轮预算均过。第一次41001166550的reduce1帧失败保留，追踪增强后未复现，不伪称确认根因。
