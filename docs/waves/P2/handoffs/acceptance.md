# P2 独立验收/媒体交接（进行中）

- taskId/rootTaskId：P2-VERIFY、P2-MEDIA；waveId P2；specVersion P2-1.0.0。
- Leader实际派发base8c9f91af73d0ad5203162b504856b9f02b2990d6，managed worktree codex/p2-acceptance。旧包not_dispatched与准备措辞由明确启动/本次派发覆盖，未混作执行禁止。
- requested model/reasoning继承，实际provider/model/reasoning均null，不虚构路由或独立结果。
- 允许路径tests/p2、P2/evidence/acceptance与本handoff、最终两成片GIF；未修改产品/CI/Compose/旧helper/作者测试。没有push、共享应用重启或正式交卷。

当前仅实现独立脚本和方案，**尚未执行P2应用/浏览器/安装/验收/录制**。等待Leader提供冻结集成源、候选ZIP/entries/manifest、3301独立空卷与独占运行窗口。脚本存在不算通过，不能沿用P1.2/旧P2准备绿记录作为本轮账户验证。

tests/p2/common.mjs支持BASE_URL/APP_PUBLIC_ORIGIN/RELAY_HOST/RELAY_PORT/RELAY_ENABLED，3301本地relay转独立frontend:3000。accounts-api.mjs覆盖访客升级保留任务与素材、规范邮箱/重复/并发唯一失败回滚、两个账户/访客不合并、前端同源PATCH状态/code/cookie、AUTH_INVALID不失去访客、运行任务跨退出登录、旧token/私图、改密全部旧会话失效、三步顺序与三处指定失败终态。仅合成凭据/cookie留内存；输出不保存token值。

浏览器真实锁/迟到Set-Cookie/旧401/未知POST/上传任务/375与键盘的受控响应设计见tests/p2/README，等唯一Frontend提供实际语义选择器后实现，不把API测试替代前端竞态。原87条由Leader逐项报告，本角色按源码/实际命令/精确SHA提供证据，不将未运行条款写通过。

Alpine独立验收与官方Playwright媒体Dockerfile已准备，均tests构建上下文并沿原p1精确锁；媒体官方digest、ffmpeg/CJK且使用捆绑Chromium，避免外置Alpine路径。待全部性能结束才录真实WebM/GIF，原录制仓库外，工具指针辅助如实记录、不改产品显雾/动画/阶段。成片目标20MB/硬限100MB，两个规定路径由本角色独占；最终需Reviewer整段真实播放核验。

后续补入：精确测试/应用/ZIP SHA、命令/环境/起止+08/退出码、所有失败/处置/独立结果、原始证据hash与限制、媒体帧率/时长/尺寸/字节/工具/模拟配置。当前无P2运行结果与真实GIF，不签G02/最终完成。

更新：根据精确UI候选8c0f6c614e8a4002e7ac993e6b3f64bc2eb5cd86读取dialog/settings/header标签，accounts-browser.mjs已写8组实际UI/竞态场景。gates使用独立APIjar转发真实Cookie响应，支持真实执行后截断body/abort，以及旧请求延迟到token撤销后真实获取401；不靠伪造session或cookie证明隔离。375上传用真正touchscreen chooser，账户设置由键盘Enter进入。额外全页pageerror0守卫。

唯一已运行检查：容器node --check解析所有tests/p2/*.mjs，退出0；无模块执行/产品请求/浏览器启动/应用录制，不签P2运行通过。原应用/候选仍等Leader冻结部署，媒体和迁移/ZIP运行未开始。

## 首次集成候选功能预验（不是最终ZIP/CLEAN）

实际产品1b38655d71a8f9c9001d7402d4adf12ee7d35cf4；第一轮主harness c10dddedecc2663e8c568cdaa9a1df57696a5f0f，修正后受影响harness 3d883db575777dc450355ac9d5bbbad7e334a8c2。Leader从源构建p2-candidate，3301/Origin3301/新空mysql-data与material-files已healthy后授权本角色运行。原生产3000与卷未动。本角色只在primary读取/运行指定Compose入口，没有up/down或写共享文件。

命令：设置TESTED_COMMIT=1b38655、P2_BASE_URL=http://localhost:3301、APP_PUBLIC_ORIGIN同3301、P2_EVIDENCE_DIR=<own>/runtime/p2-1b38655，primary执行docker compose -p p2-candidate -f compose.yaml -f compose.test.yaml run --build --rm --no-deps browser-p2-check accounts-api.mjs；随后同入口不build执行accounts-browser.mjs。首次工具APK/锁依赖构建约两分钟，属环境准备，未标作行为Red。

API8/8实际exit0：注册保owner/原任务、重复/并发唯一失败不半升级、账户/访客不合并与media404、前端PATCH200/400/401/403及code/cookie、AUTH_INVALID保访客、运行任务logout/login恢复、改密全部旧会话401、三阶段顺序/三处指定失败/终态版本不回退。首报告scope有旧“unexecuted until frozen”脚手架文字，原JSON保留；实际执行以本节、capturedAt和8项began/completedAt为准，后续源码已修正此陈旧描述。

浏览器首轮7pass/1harnessfail(exit1)原样保留。最后case局部const history遮蔽导航函数，history is not a function，是测试实现错误，不判产品失败；原root P2-VERIFY一次修复f8bf614。只用P2_CASE=Accepted old task（显式selection）在新子目录重建工具/复验该项1/1 exit0；默认CI仍完整8，未合称一次完整8全绿。其余真实SetCookieheld期间cookie不先落浏览器、全局锁跨clientLink、未知POST仅GET恢复/不重写、真实已撤销token迟到401released后新账户保留、上传blob与迟到201隔离、375实际注册/设置/改密/退出重登录及JS0错误均有通过证据。任务单例修复后证明Java受理旧任务继续、迟到202不混入B、重登录A恢复成功。Cookie/password只内存，未落storageState。

实际截图：raw account-375.png及account-review/desktop-register.png、desktop-account.png、desktop-header.png、mobile-account.png、mobile-header.png。额外account-review入口为本树新增脚本只读挂到工具（同1b产品），真实桌面空注册表单/合成账户设置、375header及ESC还焦点、无横溢出，exit0；仅功能/审图用途，不冒称性能或本角色独立G01。Reviewer已收到精确路径。

所有预验raw在own runtime/p2-1b38655，脱敏hash/环境/来源汇总1b38655-preliminary-summary.json。所有Chrome已退出；媒体未录，旧整套必需性能/最终CI、最终ZIP解压空卷、V3升级和GIF/报告还未完成，不签最终VERIFY/CLEAN。

## 冻结候选ZIP、独立cleanroom与V3升级

候选source81a3de8da97790744cbc7e4540a568e697093fd6（应用树相对预验1b相同），Root提供源码ZIP6780082B/SHA256499656253158ba15ef91d5910e22637ba897cd1e09293dc030a7bd2516ca5cf7。Acceptance独立git ls-tree -r --full-tree -z读取725条路径/模式/blobOID，与Root索引全等；强化checker214实际逐个验证261个导出文件的Git blob/来源comment、完整expected集合、policy不删code/tests/assets/入口、私文档/题面/邮件图排除、根及RB许可、demo/ink/重做输入/curated来源，全部exit0。索引与原始报告保存在仓库外acceptance-cleanroom-evidence/81a...。

先确认p2-cleanroom无旧容器/卷，解压原ZIP到全新外部cleanroom/81a...，无.git。仅在该目录用FRONTEND_PORT3302/APP_PUBLIC_ORIGIN3302执行docker compose -p p2-cleanroom up --build --detach --wait --wait-timeout240，exit0/三服务healthy，18:12:40+08创建新mysql-data/material-files。Docker已有依赖与Java包装缓存层被复用（输入已逐Git blob核对），Next生产构建实际执行；本项不冒称完全--no-cache重新下载/Java冷编译。最终远端完整构建/测试另行门槛。

在解压包内同Compose入口设置TESTED_COMMIT=81a、P2_BASE_URL/Origin3302、仓库外OUTPUT，API完整8/8 exit0（18:13:45+08），browser默认未筛选完整8/8 exit0（18:16:20+08）。这次确为一次完整browser8通过，首次1b的工具失败仍保留。构建/运行后再次比对宿主解压目录261文件，全部与ZIP字节一致，未产生.git或宿主依赖/构建缓存。完整旧性能/远端CI/最后媒体与封存仍未用本项替代。

V3升级：Root另从精确7bbfd027758002cc519fc889cea3c8a2b5233717在外部private-validation/v3-source构建p2-v3-upgrade3304，新卷18:13:01+08创建。Acceptance实际只读核V1/V2/V3无V4，用f9769e0 keeper工具经原V3 Next代理在18:17:33种合成guest/上传/三终态(2success+1GENERATEfail)，保留canonical任务语义hash与图片原bytes SHA；cookie只在持续运行的API jar RAM，未写token文件。随后Leader按明确协作仅将backend切至81a，新backend18:18:54 healthy，MySQL/旧前端原容器和文件卷保持，写非secret空控制标记。keeper18:18:55完成：旧userId/session仍GUEST，三份终态完整语义（只规范JSON对象键序、数组顺序保持）及上传/结果字节不变；旧访客再注册账户仍同owner/原历史，旧token401。实际exit0。

独立docker exec MySQL只读SELECT证明Flyway1/2/3/4全部success、任务SUCCEEDED2/FAILED1、账户凭据1。docker inspect核旧mysql/前端创建时间和实际material-files挂载仍p2-v3-upgrade原卷；不使用或复制生产3000数据库。升级保留旧V3前端代理，明确不冒称3304完整81前端。相关curated与原始仓库外位置见81a3de8-cleanroom-summary.json及81a3de8-v3-v4-upgrade-pass.json。

媒体仅新增只读同源原landscape/实际fog edgeEnergy采样脚本和两段无遮挡路径选择（metadata保点/来源/映射），仅容器parse；未运行采样/录制，等全部性能结束。未改变产品paint/mask/alpha/位置。当前尚不签最终P2 G02/CI/MEDIA/SEAL。

## 两份真实媒体成片（独立审核待签）

Leader确认所有原有性能步骤结束后，才用p2-cleanroom3302精确81a source开始MEDIA；未与性能重叠。官方工具镜像sha256cb51b21ab05075171b47d5fe5aa8e9641e0d7181abbc5d2b3220c87a09a78655，实际Node24.13.0/Chromium145.0.7632.6/ffmpeg6.1.1-3ubuntu5；与账户/性能工具Chromium149分开记录，不冒称同driver。

首页通过只读原landscape+实际fog能量，在110个可见候选中选无遮挡两路径1070,460→1170,460及800,370→900,370，真实鼠标逐点移动/停留/最终无输入4200ms自然回雾。只加工具指针SVG显示真实pointer位置，不改app图/alpha/blur/mask/位置/阶段，不叠技术注释。源WebM与首19秒GIF保留外部。经Leader明确采纳，仅裁前3秒无输入正常bootstrap：严格早于首stroke脚本start3.560s，保守保留≥560ms原fog，且视频记录起点早于该脚本时钟；全部stroke/停留/4200ms尾段保留，无拼接/变速/倒放。元数据列原action、nominal -3000ms offset和编码时钟lead未精确计量限制，不把脚本时钟冒称精确逐帧时戳。

最终home-ink.gif：1200×750/12fps/192帧/16秒，12441767B，SHA256e0f1b133bd9389bb1b42de470308c49bc18553b1e82b71cc41e21075d030e63d。creation-history.gif：1200×750/12fps/188帧/15.66秒，12086707B，SHA256a9f294456dbcae08114712e58cd89581ea0bad131d1b8a30ab5b643923a8a9f6。两份均低于20MB目标/100MB硬限。

制作片为真实chooser仓库fixture→上传→真实202→Java普通默认成功三阶段，另排指定GENERATE失败(delay每步500ms)，原PNG预览/ESC→个人历史两结果。没有假切阶段、改变app效果或用户数据。两片pageerror0，原录制/metadata在仓库外private-validation/media/81a3de8，成片仅规定docs/submission/media两文件。

inspect-media.mjs对实际最终GIF全周期解码exit0，ffprobe确认帧数/尺寸/fps/时长，并生成每秒4×5 chronological storyboard和关键fog/clear/refog/制作结果PNG，放外部inspection-final。本角色已实读全时段board与关键清晰帧，未冒称human播放或独立美学签署；Reviewer仍需最终整段时序/全秒board与关键帧核验。摘要/原WebM与首GIFhash/原动作/trim/工具命令见media-manifest.json，成片未自动提交考试或公开发布。

MEDIA补充全帧审核：按Leader同root要求，只对两最终GIF做工具解码/缩略分镜，不重录或改GIF。home192帧→6板，creation188帧→6板，每板6×6/36帧、每帧240×150，fN连续原帧号+实际GIF PTS标签；末板home12真帧+24空格，creation8真帧+28空格。两片共380/380覆盖、总12板，全部cycle decode0，原成片SHA未变。外部inspection-final/all-frames/{home-ink,creation-history}/board-01..06.png，index含逐帧时间/板起止/空格/文件hash。独立Reviewer应逐板看全帧及已有fullsize关键帧；准确称“全帧序列审阅”，不是原生实时播放/硬件流畅实测。外部板不增加提交附件，脱敏索引media-all-frames-index.json可追溯。

## P2-FINAL-02：初稿回雾证据缺口与唯一有界重录

本节覆盖上文初稿“回雾已充分展示”的不准确结论，不删除原失败。Reviewer逐380帧与关键大图发现首页末尾第二处仍清晰；同坐标原WebM末edge10.07/初始2.33、GIF末edge13.46/MAE10.80，确认初稿不足以证明完整回雾。原尾不是全帧完全冻结，编码时钟相对JS动作未准确测量，不判产品故障或全renderer冻结。原manifest另存media-initial-incomplete-refog.json，原数据诊断media-initial-tail-diagnosis.json；raw初片/所有旧板仍仓库外保留，rootTaskId始终P2-MEDIA。

Leader授权唯一实际首页重录：同81a产品/3302/两条原路径，headed Chromium145+Xvfb。先前xvfb-run基础设施启动未产生Node/Chromium/录制，停止仅自己容器后改明确socket-ready wrapper；不算产品失败或另一次实际app录制。实际录制report capturedAt为2026-10-30T10:51:09Z（18:51:09+08），最终decode/index于18:57+08完成，所有完成命令exit0；工具image cb51b21ab05075171b47d5fe5aa8e9641e0d7181abbc5d2b3220c87a09a78655。docker run --init --entrypoint sh，MEDIA_HEADED=1、PERFORMANCE_FINISHED=1、MEDIA_KIND=home-ink、TESTED_COMMIT=81a3de8、BASE_URL/Origin3302、RELAY_HOST=frontend、RELAY_PORT3000，挂own tests/p2只读+外部R2证据+规定GIF输出，执行run-media-headed.sh /checks/new/record-media.mjs。未改产品或creation片，没有再跑性能。

真实尾指针移到header10,10（排除区，不新增背景笔触），自然6000ms；两区canvas在普通viewport截图前即精确恢复初始像素（MAE0/maxDiff0及SHA相同），截图allow后再无输入flush1500ms仍相同。记录见media-headed-ink-recovery.json。原WebM21.12秒，纯前缀trim2.2秒、正常时间采样10fps不变速；首stroke JS2.873秒，保守保留至少673ms初雾，但不杜撰JS/video恒定clockoffset。全动作、6000ms尾、一次render机会与flush均留片，无拼接、复制静帧或效果参数改动。

最终home-ink.gif现在1200×750/10fps/189帧/18.9秒，18367297B，SHA256e78acdca36ea21535222ce4188629351afd9a064940d98a32979dcbfec78c119。creation原SHA a9f294456dbcae08114712e58cd89581ea0bad131d1b8a30ab5b643923a8a9f6、188帧/15.66秒/12086707B完全不变。两片均小于20MB。新decoded末同区WebM edge2.03/初2.34/clear7.94、MAE1.75；GIF edge6.28/初7.04/clear10.70、MAE1.96（palette压缩与canvas算法不同不跨量纲比较）。只读诊断脚本曾用WebM时长推GIF末帧越界，无完整frame数据；改各格式自身duration取点后exit0，未再次录制。诊断结果media-headed-tail-diagnosis.json。

新inspection-headed-r2全周期decode两片exit0，逐377/377帧12板，home189/6板、creation188/6板。media-all-frames-index.json更新精确GIF/板hash与逐帧PTS。外部private-validation/media/81a3de8/inspection-headed-r2/all-frames/{home-ink,creation-history}/board-01..06.png；关键大图home frame0/0.5/3.3/5.5/9.3/12.8/18.5.png。Acceptance实读最终18.5大图可见尾指针header及原雾；Reviewer新全帧审核待签，不把像素/全decode冒称独立美学或原生实时播放。actualModel/provider/reasoning仍null。此工作无push/公开/交卷/产品重启。

## 最终Source A：独立数据校验与运行证据等价

Source A为110894f926d64816d5a8b5d9e5bcabd2554412ed。Acceptance独立宿主Git读取ls-tree -r --full-tree -z，共775条，逐mode/type/oid/path对Root索引完全一致；没有拿Root索引作为独立来源。以自身索引在容器p2-candidate-browser-p2-check运行verify-archive.py，源码ZIP37315734B，SHA256a4a133692d0e804408ceeb6de12b87569df3eefccb71acb19c09afc885e98f92；306/306导出文件逐Git blob字节匹配，18项检查全部pass/exit0（含40字节Git archive commit comment、完整expected集合、私有排除、许可与本地素材输入）。外部独立索引/全entries报告在P2/acceptance-final-evidence/110894f...，不是新增运行证据。

另逐Git对象比较已实际cleanroom验证的81a3de8→A：frontend/backend/assets/.github/Compose两入口/.env.example/.editorconfig/.gitignore/旧三波测试与P2 API/browser/gates、锁/迁移等共23对象完全相同，涵盖整个产品树与构建、初始化、CI执行入口。此前81a空卷3302 API8+browser8、独立V3→V4数据保留、完整CI41038592540可按同执行源链引用，不冒称本次重启了最终ZIP/再次全性能或独立轮询CI。

tests/p2新增/更新部分是已实际使用的独立ZIP/迁移/媒体/取证工具；common.mjs唯一运行差异为MEDIA_HEADED显式字符串1才启headed，默认仍headless，Compose/CI环境无此变化；账户API/browser/gates原对象相同。文件清单与具体对象hash见110894f-final-source-equivalence.json。本次仅Git/JSON/ZIP数据检查，无应用/浏览器/性能执行、无生产重启或卷操作。

这份新证据在Source A冻结之后产生，只合并到后续reportCommit，不声称A的ZIP已含自身新增报告。若最终只改报告/metadata/导出policy，应再作data-only范围/导出完整性比对。actualModel/provider仍null，正式交卷/公开/邮箱工作未启动。
