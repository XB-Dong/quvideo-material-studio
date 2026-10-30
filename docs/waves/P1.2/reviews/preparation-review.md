# P1.2 独立启动前准备审阅

**最终结论：P1.2启动前准备审阅通过，无开放blocking/major/minor；PREP-01已修正并复核关闭。** 文件地图、完整规格、任务依赖与所有权、静态分镜及验收方案可作为执行基线。所有P1.2产品美学/舒适/业务/性能门槛仍为`not_run`。用户最新明确“1.2准备好了直接启动不用报告了”，Leader在本审阅与data-only检查通过后直接派发，无需再次确认；本审阅本身不是产品验收。

Reviewer为`p11_design_review`沿用原只读席位；actualProvider/model/reasoning均为`null`，继承当前会话且实际路由未知。唯一可写文件为本审核文件。此轮只读取源码/准备材料/官方文档、查看静态分镜，未创建worktree、安装依赖或运行产品/浏览器/性能脚本。

## 地图初审

已读`docs/waves/P1.2/CONTEXT-MAP.md`、最新AGENTS及真实`studio.tsx/history.tsx/shell.tsx/providers.tsx/globals.css`。地图可作为后续规格与任务划分的基线；下述完整覆盖项应在最终计划中补齐后复核。

- 现状描述准确：上传照片已有160ms淡入、task-card有240ms入场、status有160ms过渡、dialog有180ms进入与120ms退出；History原pulse在后面的CSS被`animation:none`覆盖。Shell复用水墨，但Maker/History阅读与操作区域排除擦拭。应表达“已有短过渡，缺乏成体系的子页场景和过程反馈”，不能写成子页完全没有动画。
- `Studio`内嵌`History`，独立`HistoryPage`又复用同一组件。两个场景须共用受控动效，避免制作页和独立页各套无法兼容的状态逻辑。
- `UploadSlot`的version/controller/mounted/revoke、Maker的epoch/locked/submissionGeneration，以及History按userId重挂和task.id稳定key均是现有正确边界。视觉只能消费真实状态，不能延迟其取消或把私有旧画面作为退出副本保存。
- 地图的已认可首页保护、唯一写入者、原31/15/8与业务测试保护、CI基线前置均合理。
- 完整页面覆盖建议补列`frontend/src/app/{page,history/page,templates/[id]/page}.tsx`作为路由只读入口，以及拟新增`not-found.tsx/error.tsx/loading.tsx`的所有权与测试（若由P1.2实现这些状态）。现有模板query404反馈不能等同任意无匹配路由的全站404。

## 供完整计划采用的审阅要点

1. **状态可信**：上传没有真实字节进度接口时使用indeterminate，不虚构百分比/倒计时。任务阶段只由Java快照切换；相同task/version的poll不能每轮重播入场。查询异常保留任务原状态，不能播放“执行失败”动画。
2. **导航即时且原生**：原Link在首个动作触发，不await退出。公共封面桥仅允许同源公开模板封面，不能采全页私有DOM快照，不能保留blob/上传/结果图。Ctrl/Meta/Shift点击、新标签、返回前进、外链与快速连点保持浏览器语义；未知目标/404/失败时取消桥并显示正常页面。
3. **文件选择不受装饰约束**：input/label同步触发原生选择器，不等待import/timeout/动画。取消选择保留当前状态；同文件重选可再次change。替换/移除/会话失效立即清除旧私有图与请求，只允许无数据装饰壳完成视觉退场。不能以“照片交叉淡出”延长URL或身份DOM生命周期。
4. **列表与布局稳定**：记录按task.id隔离；新增/分页小范围入场，批次stagger和总时长封顶，不能让50条记录依次等候。真实结果图片原样预览，动画用于框架/显影，不对用户图片施加持续变形。状态容器预留尺寸，图片解码与状态标签变化不造成布局跳动。
5. **层级与持续动态**：制作页可用蓝紫轮廓/空槽微光建立场景，上传中与当前任务才承担主运动；历史不让每张终态卡永远闪动。视窗内的实例、RAF/CSS时序应明确上限，Dialog/工作区自动降装饰，reduce/后台/离屏/卸载彻底清理。不新增动态/暂停按钮或用户可见特效解释。
6. **首页与依赖保护**：新增样式用p12页面作用域；首页只允许功能链接轻点击与公共封面桥，不重做已认可布局/配色/素材/四卡水墨。默认CSS/WAAPI+原Link即可；参考Motion/Next ViewTransition等不意味着采用新实验API或整套运行依赖。任何采用决策需兼容所锁Next/React/TS类型并在文档区分参考和实用代码。
7. **真实验收**：最终美学逐页覆盖制作、独立/嵌入历史、上传各状态、结果/身份dialog、空/错误/404，不用首页通过替代子页评分。舒适检查包括原生文件取消、快速导航/返回前进、身份过期时立即私有画面清除、终态停止与多任务异常；产品/浏览器执行仅容器，并分开无截图性能与截图功能证据。

## 完整包正式审阅

已读P1.2的PLAN、ROLES、CONTEXT-MAP、ACCEPTANCE、state、9个task packets、PREPARATION-REPORT及data-only checker源码，`specs/p1.2/{requirements,design,architecture,comfort}.md`，references README、React Bits审计与dependency-plan、根AGENTS/原则/导航。准备锚点为已验证的`a7cdcdfe4a0dd38db1763b436ed67c6cedf76d76`；派发时仍须由Leader按协议刷新精确执行SHA。

| 核对项 | 结论与依据 |
| --- | --- |
| 全流程覆盖 | 11项需求覆盖首页保护、持续子页、导航、全部上传状态、真实任务、两类dialog、全站边界、可访问性、成本、双审与交付。初审要求的route入口与loading/error/not-found/global-error路径已补；global-error在根受损时安全静态是明确例外。 |
| 角色与任务 | 9任务，唯一Frontend按FOUND→ROUTE→STUDIO→HISTORY→DIALOG顺序写重叠文件；Acceptance与Reviewer各自独立，Leader持有依赖锁/CI/契约与集成。BASE先冻结兼容和预算，ACCEPT/REVIEW最终依赖DIALOG，DELIVERY依赖双审核；无循环或同时写同一产品文件的安排。 |
| 首页与业务 | 首页限定功能点击/公共封面衔接，页面样式作用域隔离；Query/Identity持久实例、31FE/15Java/8API、多任务/异常/旧响应/version/epoch/取消/终态保护均明确保留。 |
| 动作与资源 | 上传未知进度只不定量；原生选择器与Link即时动作；不留私有旧图/整页快照；仅公共demo封面可作跨路由桥。列表每批前6项、错相总等待≤125ms；视窗实例/短粒子/RAF及自动保护有明确限制。 |
| 独立验收 | 制作/独立与嵌入历史/结果和身份dialog/边界逐页五维≥4，不能以首页或静态分镜代签。默认软件、真coarse/键盘/后台、文件取消、路由竞态、三页三轮预算及无截图30秒路径分开取证，原绝对门槛保持。 |
| 来源与依赖 | React Bits两个候选3个源码文件登记URL/hash/import/deps/RAF，许可保留MIT+Commons Clause，不称纯CSS；Motion/Aceternity/React Aria是交互参考，无新增Motion运行依赖。开发类型19.3.0仅计划，尚未安装或改锁。 |
| 状态与授权 | 当前准备state执行false、产品gates not_run、无P1.2开发worktree/安装/重启。已补用户条件式直接启动授权；邮件继续暂缓，未变为新阶段前置。 |

### PREP-01 · minor · 原生ViewTransition与业务effect清理时序需要专门验证

- 位置：最初`specs/p1.2/architecture.md`路由段与P12-BASE可观察验收。当前上传/提交/useTasks依赖effect cleanup；只命名公共图、关闭root快照本身不能证明取消时机保持。
- 触发/预期：带上传/提交/活跃轮询的页面在原生转场中离开；预期其取消/卸载按原Link基线执行，不等220–280ms装饰结束。
- 依据：本Reviewer独立读取[Next16.4.3官方指南](https://nextjs.org/docs/app/guides/view-transitions)与[React19.3 ViewTransition参考](https://react.dev/reference/react/ViewTransition)，确认版本/API支持，也核对官方对effect可能延迟至finished的说明。版本可用不等于当前业务清理自动安全。
- 处置：Leader接受并在architecture增加专节、BASE验收和NAV/LIFE矩阵加入逐时导航/卸载/abort/poll停止/finished比较。完整路由基线明确为Link+CSS/WAAPI公共图，原生仅在BASE实测安全的场景启用；若延期而不改受保护协议无法保证，则该路径选择完整兜底，不削弱取消断言、不保留旧业务树。
- 复核：已实际重读上述修正及PLAN/REPORT/参考风险说明，**closed**。这是执行BASE中必要的兼容验证，不要求准备阶段运行，也没有声称该兼容已经通过。

### 静态分镜实际审图

已通过view_image实际查看`references/motion-storyboard.png`，不是只读文件存在。浅纸/白卡/蓝紫细线延续已认可方向；模板到工作台、上传空/上传中/READY、制作受理/排队/阶段/结果、预览与空/404关系清楚。失败分支从上传中独立引出，没有READY→ERROR误链；排队节点为灰。图中产品区域没有特效名/技术说明标签，外部注释是启动前动作说明。图片沿用已登记照片。此处只评规划表达，不为未来产品G01/G02打分。

### P1.1基线与检查边界

已只读核对`remote-ci-a7cdcdf.json`和`remote-ci-a7cdcdf-artifacts.json`：同一精确SHA、run41002700967，frontend/backend/integration三个jobs均success；工件记录22项accept、6项visual、native隐藏RAF0/GPU0、无长任务与三轮预算通过。此REST/工件采集由Leader执行，本Reviewer审读其脱敏证据，未冒称自己重新运行CI。旧reduce一帧失败与未确认根因边界保留；后续成功不证明已定位根因。

已读data-only checker并复核其执行false/产品not_run、9任务/11需求覆盖、依赖数组/DAG、链接、许可/候选/开发类型计划、SVG/PNG及产品相对基准未改的检查范围。Leader报告其实际通过；本Reviewer未运行产品或把源码检查当运行测试。独立`git diff --stat a7cdcdf -- frontend backend tests assets .github compose.yaml compose.test.yaml`无输出，当前P1.2仍无产品变更。

Leader在收敛本审核后的state/报告、生成准备文件hash/result时应再次运行data-only检查并封存，随后依用户已给条件式授权直接进入BASE。所有P1.2产品门槛维持not_run，需在实际执行提交另行取证；本文件不签未来产品、硬件性能、部署或邮件动作。
