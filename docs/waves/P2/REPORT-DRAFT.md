# 小影要求逐条符合性报告——P2基线底稿

给董信步阅读。此稿在启动前建立，记录目前“如何实现、证据在哪、最终还需核对什么”，不能当作已签署最终报告提交。正式稿在P2最后开发、完整验收后生成到docs/reports/，绑定最终源码/CI/ZIP及实际动图。

基线7bbfd027758002cc519fc889cea3c8a2b5233717；最新远端CI41024631245三job success；准备期随后实际读取日志与browser-evidence JSON，摘要见evidence/preparation/ci-baseline.json。详细历史ff8a896/41021360156的48前端、18Java、8API和独立浏览器证据可追溯。源码实现与运行效果分开记录；下述“历史验证”不冒称对最终ZIP刚执行。

| 官方要求 | 我们如何满足 | 源码与已有证据 | P2最终核对/边界 |
| --- | --- | --- | --- |
| R-01 技术栈与职责 | Next App Router/React/TS；Java Spring Boot/MyBatis/MySQL。Next只做同源代理，模板/上传/任务/身份/历史均由Java执行并写MySQL | frontend/src/app、src/lib/proxy.ts；backend/pom.xml、Api.java、Db.java；package-lock、Compose、README版本表；历史真实MySQL及CI | 最终锁文件/镜像/README一致，实际干净三服务启动；不将仅有页面当全栈实现 |
| R-02 模板分类与数据 | Java从MySQL读取分类和四模板，覆盖1/2/3图；卡片/筛选/详情使用接口数据；本地合法JPEG/PNG可离线访问 | Api/Db，V2/V3 SQL，catalog.tsx、demo资源；历史API与筛选/稳定模板ID验证 | 最终ZIP含数据和封面；原图资源许可与来源独立核对，不依赖外链 |
| R-03 详情与真实上传 | 按模板渲染上传位，选择/预览/替换/移除/反馈；客户端与Java校验数量、JPEG/PNG、5MiB及真实内容，存文件卷；version/controller处理替换/迟到响应，未就绪与提交锁防重复 | studio.tsx、FilesService.java、Tasks.java；upload/submission测试、DatabaseIntegrationTest；历史真实chooser与非法素材检查 | 双端约束是项目选择，不把题目交卷100MB当产品限制；最终加载/空/404/失败和真实上传闭环复验 |
| R-04 受理与异步 | 创建记录事务提交后派发有界单线程FIFO，POST返回202及task.id；后续Java执行，不依赖浏览器保持打开 | Tasks.create/afterCommit、Processing.dispatch；commitBeforeDispatchAndRollbackDoesNotDispatch；历史无查询任务仍完成 | 慢任务202先返回、关页/不查询仍完成，独立容器验证 |
| R-05 三阶段和查询 | ASSET_CHECK→GENERATE→FINALIZE，步骤开始/结束/失败独立写库；整体QUEUED/RUNNING/SUCCEEDED/FAILED，阶段、version、失败和结果地址持久化；GET只读，终态不退 | Pipeline、Processing、Db、Tasks.get/history；PipelineTest、最终事务回滚测试；specs/task-lifecycle.md | 最终观察三步与DB/接口一致，不靠前端定时文案；成功原PNG可预览 |
| R-06 可控失败与耗时 | simulation.failAt支持三阶段指定失败，delayMs每阶段0～30000ms；失败后return、后续NOT_STARTED；配置快照随任务保存 | Simulation.java、Pipeline.run、README可复制fetch示例；failureStopsFollowingHandlers三阶段与API检查 | 实际各阶段失败/原因/后续未开始和调慢排队；不要求随机失败、自动重试 |
| R-07 前端异步状态 | 上传、提交、受理、任务等待/处理中/终态分别表达；POST成功解锁并加入历史。查询503只显示queryError保留服务端task，提供恢复 | studio/history、use-tasks、types；keeps server state on query outage、submission未知POST用例；历史真实停机恢复 | 最终断开GET再恢复与真实执行失败并列演示，不能把请求失败篡改成FAILED |
| R-08 多任务与生命周期 | userId+task.id隔离query；每个非终态2秒跟踪，终态false；活跃分页恢复、signal取消、generation/version/终态合并防旧响应污染 | use-tasks.ts、types.ts、providers/api/session-generation；逆序A失败B成功、停止/卸载/用户切换/迟到401测试 | 最终连续多任务、离页清理和无待处理停轮询；不因动效延迟业务卸载 |
| R-09 刷新恢复与结果 | Java历史返回createdAt/状态/原因/结果；刷新从后端恢复并继续跟踪未结束任务；卡片认证缩图、弹窗完整原PNG | Tasks.history、history.tsx、result-preview、Api结果鉴权；历史刷新/分页/原图hash与冷加载证据 | 最终刷新恢复、成功可预览；重启不续跑是明确非目标，不能混同浏览器刷新恢复 |
| R-10 用户身份与个人记录 | 后端随机不透明token、DB仅哈希；HttpOnly/SameSite=Lax cookie关联用户，owner查询/媒体鉴权。普通/无痕隔离 | Identity/RequestFilter/Db；README身份演示；跨owner task/asset/result404与过期401检查 | 最终两独立cookie上下文隔离；匿名身份清cookie无法找回，不承诺生产账户或跨设备 |
| R-11 视觉与基本可用性 | 列表/详情左制作右历史/独立历史有清晰层级，浅纸白蓝紫线条与疏影品牌；375px可操作，原生Link/input/dialog、标签/焦点/ESC；用户指定动态已集成 | 页面/Shell、globals/journey CSS；P1～P1.2独立美学/舒适与键盘/coarse证据；后续两项定点检查 | 最终当前页与流程GIF，重点山水擦雾；参考UI主要结构而非逐像素，不扩展会员/账单/语言等题外功能 |
| R-12 CI与关键测试 | push/PR/手动Actions保留前端lint/type/测试/构建、Java真实MySQL测试/package及集成；核心测试覆盖顺序/失败中断、多任务、查询异常≠执行失败 | .github/workflows/ci.yml、compose.test.yaml；PipelineTest、DatabaseIntegrationTest、use-tasks.test.tsx；基线CI已绿 | 精确最终候选的真实logs/产物核对，不以“配置存在”代替跑过；不删除现有门槛 |
| R-13 源码材料与README | 当前完整源、准确版本/锁、V1～V3结构/种子、CI、README都存在；原题九类说明大部分已有 | 根README、specs/api.yaml、docs/audit/effort.md、THIRD-PARTY-NOTICES；P0交付与P1.2报告 | 统一最终入口、九子项详表如下、用户报告/版本/ZIP和读取权限；最终验收commit必须40位 |
| R-14 推荐容器交付 | compose.yaml默认启动frontend/backend/mysql，健康依赖、Flyway初始化、离线素材、持久卷与Dockerfile/演示配置俱全 | compose.yaml、前后端Dockerfile、.env.example、迁移/demo；历史干净GitHub runner实际构建启动 | 本项目已采纳推荐项；最终从解压ZIP+空卷一次启动成功；无需公网地址或真实部署截图 |

## R-13 的九项逐条说明

| 子项 | 目前说明/实现 | 正式报告必须绑定的证据/补齐 |
| --- | --- | --- |
| R-13.1 技术版本、结构、命令和连接 | README版本表、目录、Compose内命令、Next→Java→MySQL连接 | 对照锁/pom/基础镜像，容器逐项命令结果，最终源码版本 |
| R-13.2 配置、初始化、数据/素材 | .env.example只有演示值；Flyway V1/V2/V3；Java demo与本地ink | 新库首次启动结果和包内容，配置变端口时APP_PUBLIC_ORIGIN同步说明 |
| R-13.3 API、状态、阶段与执行 | OpenAPI及README主要请求/响应；状态/steps/version与事务后FIFO | 接口示例与真实实现一致（含thumbnail参数），独立阶段边界与只读查询证据 |
| R-13.4 成功/失败/耗时/多任务/刷新演示 | README有可复制simulation和5步演示 | 实际三处失败、慢任务、多任务刷新；真实流程GIF作展示，不用GIF替代断言 |
| R-13.5 身份与记录方案 | 匿名cookie与DB哈希/owner；普通/无痕演示 | 两用户记录/素材/结果隔离和身份丢失限制 |
| R-13.6 完成/未完成、限制、投入、重启 | 已列单实例、不续跑/遗留任务INTERRUPTED、未知POST、无幂等/自动重试、孤立素材未清理 | 最终事实表，人工粗估/已记会话墙钟/未知分列，不能用网上数据伪装计时 |
| R-13.7 部署/回滚 | Compose、DB+文件成套备份、匹配schema回滚；历史隔离恢复证据 | 命令可读/路径正确；按变化决定是否重跑隔离恢复，不操作当前产品卷 |
| R-13.8 是否使用AI及实际工作流 | 已明确Codex；Leader拆分/上下文/唯一writer/独立审查/失败修复；真实最终事务与身份竞态、布局/性能例子 | 精简为能解释的真实例子，引用实际修复/验证，不提交私人聊天/账号、不给不可验证模型贴标签 |
| R-13.9 脚手架、代码和素材来源 | 第三方清单、具体照片/水墨和React Bits适配、完整附加许可 | 校对根原创许可范围、所有分发文件、未来公开审计与待处理，不把应用公开等同组件可重新许可 |

## 提交规则与非目标

源码ZIP及说明通过用户收到题目的原渠道交，由用户最终确认；最多6文件且单个<100MB。仓库仍私有，默认ZIP保障评估者读取。不给倒计时生成截止承诺，不自动点击交卷或联系招聘方。截图附件按用户要求改为真实GIF，尤其首页山水擦雾。

真实AI/支付/复杂后台/会员/第三方账号/国际化/多区域/集群MQ运维/重启自动续跑不在原题范围；幂等、断点续跑、自动重试是可讨论取舍，不虚构为必须补齐的缺陷。实体设备/物理Windows最小化/硬件GPU、未真实注入的极限磁盘等只写未验证。

正式稿末尾填写：实际验收/打包commit、CI与关键命令、GIF来源版本/真实录制条件、文件哈希、尚未验证/已知限制、投入与签署时间。当前这些P2最终结果尚不存在。

## 用户确认的账户与展示范围

当前匿名身份/个人记录有实现；注册、登录、退出、改资料/密码尚未实现，明确由P2-BE-USER/P2-FE-USER开发、P2-VERIFY独立验。保留访客，注册升级保留原作品，登录不自动合并其他访客记录，退出撤销旧session。账户表单/个人中心可见，不只一段匿名说明。真实GIF由P2-MEDIA录制，首页山水为重点。最终报告对requirement-checklist.json的87条均列证据/版本/结果/限制，Leader发现其他不满足项另建可验证task，不用本底稿代替开发。
