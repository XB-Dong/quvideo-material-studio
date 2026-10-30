# 验收说明

业务验收commit：`81a3de8da97790744cbc7e4540a568e697093fd6`。完整CI[41038592540](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/41038592540)于2026-10-30T10:26:49Z完成，frontend/backend/integration全部success。当前交付在这个业务执行树上补入本轮证据、来源说明、独立包/迁移/媒体工具、报告和GIF；最终deliveryCommit及ZIP SHA256由源码包外的版本清单锁定，避免自引用。

## 实际验证

所有安装、构建、测试、应用与媒体转换都在Linux容器；宿主只做Git、文本/元数据与Docker编排。

| 检查 | 实际结果 | 可复核记录 |
| --- | --- | --- |
| 前端 | eslint、tsc、12文件58项行为测试、Next生产构建通过 | `../waves/P2/evidence/ci/41038592540/log-excerpts.json`及`41038592540-run.json` |
| Java | 真实MySQL下26项，0失败/错误/跳过；mvn verify/package通过 | 同上，含Pipeline/DatabaseIntegration/AccountIntegration/PasswordAndAuth/Thumbnail/Demo分项 |
| 原业务API | 8/8：分类本地图、身份、真实上传校验、参数/Origin、异步无查询推进、三阶段失败、多任务/分页恢复、私有资源 | 同log-excerpts；执行入口`tests/test_api.py` |
| 原页面与动态 | P1.1功能22/22、视觉6/6；P1.2功能25/25、视觉16/16、边界2/2、冷预览6/6、生命周期2/2、缩图检查 | `../waves/P2/evidence/ci/41038592540/p11-browser/`与`p12-browser/` |
| 资源与后台 | 无截图连续交互均pass、交互longTasks空；首页3轮、三页共9轮预算逐轮通过；原生后台隐藏释放/恢复均通过；预算guard各4项 | 上述interaction/measure/native JSON，包含renderer、网络/CPU/缓存和限制 |
| 账户与真实竞态 | API8/8、浏览器完整8/8，375px、真实延迟Set-Cookie/未知POST、旧401/上传/受理任务隔离 | `../waves/P2/evidence/ci/41038592540/p2-browser/` |
| 源码包空卷 | 候选261文件逐Git blob相同，ZIP6780082字节/hash499656…；仓库外解压无.git、新Compose项目/3302/两个空卷，构建健康、API8/浏览器8 | `../waves/P2/evidence/acceptance/81a3de8-cleanroom-summary.json`及exact-archive/API/browser文件 |
| 旧库升级 | 精确7bb V3→81a V4，同合成卷/原V3代理；原访客、2成功+1失败完整快照和上传/结果bytes不变；注册保owner/历史、撤旧token | `../waves/P2/evidence/acceptance/81a3de8-v3-v4-upgrade-pass.json` |

候选包在初次核验时尚不含最终GIF/报告；最终源码包另对照全部导出文件、业务执行树、CI/Compose/锁/迁移/素材与运行入口，新增独立工具各自已有实际执行记录。最终条目数/hash与候选不同须在版本清单明示，不直接把旧包改名交付。Docker依赖/Java打包缓存按精确输入复用，Next构建实际执行，不冒称全量禁缓存重新下载。

## 真实动图

- `media/home-ink.gif`：1200×750、12fps、16秒/192帧，12441767字节，SHA256 `e0f1b133bd9389bb1b42de470308c49bc18553b1e82b71cc41e21075d030e63d`。
- `media/creation-history.gif`：1200×750、12fps、15.66秒/188帧，12086707字节，SHA256 `a9f294456dbcae08114712e58cd89581ea0bad131d1b8a30ab5b643923a8a9f6`。

两者均从81a真实页面录制、全周期解码exit0，单个小于20MB。首页只从原WebM裁去前3秒无输入bootstrap段，保留两段真实鼠标清晰轨迹和自然回雾，不拼接/加速/更改产品雾层；另一个完整保留真实chooser、上传、POST202、Java阶段、原图预览及成功/失败历史。原始视频、首稿hash、trim命令、动作/采样点及实际工具版本见`../waves/P2/evidence/acceptance/media-manifest.json`；原WebM不随源码包或交卷附件分发。

媒体工具为固定digest官方Playwright1.58.2镜像，实际Chromium145.0.7632.6/Node24.13.0/FFmpeg6.1.1，与Alpine Chromium149软件性能环境分别记录。录制含仅辅助显示实际pointermove的工具鼠标箭头，未加产品技术特效注释。独立审核按全时段/全帧分镜和关键原尺寸帧核内容，并读取完整解码证据；这种方法不冒称原生播放器实时播放或物理设备流畅实测。

## 五分钟核对

按根README运行`docker compose up --build`并打开localhost:3000。访客切分类→1/2/3图模板→上传预览/替换/移除→连续制作→刷新/离页恢复→成功原图预览；按README指定三阶段failAt和delayMs，观察失败中断。暂时阻断任务GET只应显示查询异常，解除后恢复，不能把任务改失败。

注册当前访客保留作品；退出得到新访客，登录原账户恢复；另一窗口/账户不能访问原任务/素材/结果。账户设置改昵称不变owner，改密撤销全部旧session；邮箱未验证。登录错误不清掉当前访客身份，未知认证POST先GET恢复，不自动重复提交。

## 边界与材料

生成器为本地预置结果；单实例有界FIFO，无自动续跑、受理幂等、断点重试。重启将遗留非终态标FAILED/INTERRUPTED，终态不变。访客清cookie不可找回；账户无验证邮件/找回/第三方登录，尚无孤立上传自动清理与配额。真实GPU、所有物理小屏和公网生产安全未测；不把软件浏览器、GIF或文档当这些验证。

人工2～4小时是低置信度估计，不是实测；已记录AI会话区间和真实工作流/修正例见`../audit/effort.md`。部署与成套备份/隔离恢复步骤见`../delivery.md`，本轮V3升级不等于生产灾备恢复演练。

源码包保留全部前后端、测试、CI、配置、锁、SQL/种子、合法本地素材与许可，过滤范围见`SOURCE-PACKAGE.md`。私库不保证招聘方可读，默认交ZIP。作者报告与版本清单单独提供，最多6文件、单个小于100MB；由作者在原渠道交卷，P2不代交或公开仓库。原Git历史公开前处理见`PUBLIC-RELEASE.md`。
