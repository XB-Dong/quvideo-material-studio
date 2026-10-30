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
