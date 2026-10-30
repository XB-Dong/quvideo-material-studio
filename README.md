# 疏影 · 素材制作工作室

小影科技2027校招全栈开发笔试项目，作者董信步。浏览模板、上传图片、提交Java后台制作任务，在等待期间继续使用网站，从个人作品查看阶段、失败原因和成功图片。制作使用可控模拟生成器。

P2为最后一轮开发与交付验收，账户功能和最终材料正在核验。最终版本、实际检查与附件清单见[验收说明](docs/submission/VERIFICATION.md)；本段在正式封存时更新，不将历史绿CI冒称本轮已通过。

## 启动

需要Linux Docker Engine与支持`--wait`的Docker Compose。无需在宿主机安装Node、Java、Maven或MySQL。

```sh
docker compose up --build
```

打开[http://localhost:3000](http://localhost:3000/)。默认演示配置可直接运行；自定义配置复制`.env.example`为`.env`。首次拉取镜像/依赖需要网络，运行中的模板、示例、山水与结果图片均来自本地资源。MySQL和文件分别保存在`mysql-data`、`material-files`命名卷；正常停止用`docker compose down`保留数据。

浏览器通过Next同源`/api/*`与`/media/*`代理访问Java，Java通过MyBatis连接`mysql:3306/material_studio`；业务执行和持久化全部在Java/MySQL。默认仅前端3000端口对宿主机开放，后端和MySQL使用Compose内部网络。

## 界面与动态演示

浅色纸面、蓝紫线条，首页山水随鼠标移动由雾变清晰；模板卡、制作页、任务阶段和预览使用连续且受控的动态。系统减少动态效果、后台与离屏时自动保护资源，不设置手动暂停控件。桌面完成主要布局，375px小屏可完成核心流程。

正式交付提供首页山水交互和制作/历史流程两份真实GIF；录制文件与版本待验收后放入`docs/submission/media/`并在此展示。动图只展示真实页面操作，不替代功能测试或硬件性能证据。

## 技术版本与结构

| 部分 | 版本 |
| --- | --- |
| 前端 | Next.js16.4.3 App Router、React/react-dom19.3.1、TypeScript5.9.3 |
| 客户端查询 | TanStack Query5.105.0 |
| 开发类型 | @types/react与react-dom19.3.0 |
| 动效 | CSS/SVG/WAAPI、Canvas2D；Orbit适配React Bits |
| 前端工具 | Vitest5.0.5、RTL16.3.2、ESLint9.39.2；Node22.22.0-alpine |
| 后端 | Java21、Spring Boot3.5.16、MyBatis Starter3.0.5 |
| 构建/数据库 | Maven3.9.11、MySQL8.4.13、Flyway |
| 独立验收 | Python3.12.12、Playwright1.58.2；实际浏览器/renderer按证据记录 |

npm准确版本/完整性在`frontend/package-lock.json`，Java由`pom.xml`与Boot BOM管理；容器基础镜像固定digest。账户密码派生使用JDK提供的PBKDF2，不增加应用外部身份服务。

```text
frontend/              App Router、同源代理、页面/组件与行为测试
backend/               Java服务、MyBatis、Flyway、离线图片、JUnit
specs/                 API、任务/前端状态、数据模型与本轮账户契约
tests/                 独立API、浏览器、账户及资源验收容器入口
docs/submission/       最终验收、演示与提交说明
docs/reports/          给作者看的逐条符合性报告
docs/waves/            需求追踪、历史阶段、独立审阅与实际证据
compose.yaml           frontend、backend、mysql及持久卷
compose.test.yaml      隔离前端/Java/MySQL/独立检查
.github/workflows/     push、pull_request与手动CI
```

## 身份与个人作品

保留访客直接体验，并提供注册、登录、退出和账户设置。账户接口/界面以P2最终验证结果为准：

- 访客可浏览、上传、制作和查看自己的作品；清cookie/到期后不能找回未注册访客身份。
- 注册使用昵称、邮箱和密码，将当前访客升级为账户，保留现有素材与任务；邮箱是本地登录标识，未进行邮件所有权验证。
- 登录已有账户后读取该账户历史，不自动合并另一个访客的作品。退出撤销当前会话并返回新访客；重新登录可恢复账户记录。
- 账户设置展示昵称/邮箱，支持改昵称及校验当前密码后改密码；改密码撤销该账户全部旧会话并为当前客户端新签会话。
- 密码12～128字符。服务端保存带随机盐的PBKDF2-HMAC-SHA256派生值，不保存明文。会话为随机不透明token，DB只存SHA256哈希；cookie为HttpOnly、SameSite=Lax、Path=/，HTTPS配置Secure。

页面顶部提供身份入口，“我的作品”展示当前身份的记录。普通窗口与无痕窗口可验证两个独立身份；也可注册两个合成账户对比历史。任务、素材和结果均由Java按session确定owner，业务请求不接受可伪造的userId。读取他人私有资源返回404。

身份转换使用持久Provider串行处理、请求generation与取消保护；旧查询/401/上传/提交不得覆盖新身份。密码输入错误与会话失效分开处理。未知结果的认证POST不自动重发，先向Java重新读取真实session。

## 模板、素材与初始化

Flyway负责空库结构/种子初始化和版本升级：V1结构，V2分类/四模板，V3本地照片key，V4账户凭据扩展（本轮实现与验收中）；既有迁移不重写。模板覆盖1/2/3张图，图片数量/MIME/最大字节数从Java接口读取。

`backend/src/main/resources/demo/`包含可直接选择上传的`postcard.png`、`pet.png`、`story.png`、`portrait.png`及生产封面/预置结果。图片限制为JPEG/PNG、单文件5MiB、最多2000万像素；服务端校验实际内容、大小和数量并写文件卷，浏览器预览blob不能代替上传。

照片衍生和水墨资源随源码可离线使用；作者/资源页/许可/hash见[来源清单](THIRD-PARTY-NOTICES.md)。需要重做素材时使用`backend/scripts/Dockerfile.assets`与`assets/p1.1/README.md`提供的工具容器，应用启动不需要运行素材生成脚本。

## 配置

`.env.example`均为本地演示值，无真实凭据。实际部署应配置自己的密码与HTTPS。

| 配置 | 默认/作用 |
| --- | --- |
| MYSQL_DATABASE / MYSQL_USER / MYSQL_PASSWORD / MYSQL_ROOT_PASSWORD | MySQL初始化；material_studio/material_app与演示密码 |
| JAVA_DB_URL / JAVA_DB_USERNAME / JAVA_DB_PASSWORD | Java连接；改数据库名/用户时同步修改 |
| APP_PUBLIC_ORIGIN | 写请求允许Origin，默认http://localhost:3000 |
| FRONTEND_PORT | 默认3000，变端口时同步APP_PUBLIC_ORIGIN |
| SESSION_COOKIE_SECURE / SESSION_TTL_DAYS | 本地HTTP false；HTTPS true；默认7天 |
| TASK_QUEUE_CAPACITY | 默认20，单执行线程FIFO |
| SIMULATION_CONTROLS_ENABLED | 演示默认true；false时请求不得携带simulation |
| SIMULATION_ASSET_CHECK_DELAY_MS | 默认1000ms |
| SIMULATION_GENERATE_DELAY_MS | 默认5000ms |
| SIMULATION_FINALIZE_DELAY_MS | 默认1000ms |

Compose内`BACKEND_INTERNAL_URL=http://backend:8080`、`STORAGE_ROOT=/data/materials`；前者不公开给浏览器。健康检查等待数据库、Java与前端代理就绪。

## 主要接口与后台执行

完整请求/响应见[OpenAPI](specs/api.yaml)，本轮账户语义见[身份契约](specs/p2/identity.md)。

| 方法/路径 | 请求与响应要点 |
| --- | --- |
| GET/POST /api/session | 读取/确保身份，返回userId/displayName/expiresAt/kind/email/emailVerified，设置安全会话cookie |
| POST /api/auth/register | displayName/email/password；201账户Session，升级访客保留作品 |
| POST /api/auth/login、/logout | 登录email/password或退出；200真实Session，轮换/撤销旧cookie |
| PATCH /api/account/profile | displayName；账户设置，200 Session，访客403 |
| POST /api/account/password | currentPassword/newPassword；200新Session，撤销全部旧会话 |
| GET /api/categories、/templates?categoryId=... | Java读取分类/模板列表，标题/封面/描述/素材要求 |
| GET /api/templates/{id} | 单模板，不存在404 |
| POST /api/assets | multipart templateId/file；201 id/url/mimeType/sizeBytes/width/height |
| POST /api/tasks | templateId、按槽位assetIds、可选simulation；202已受理Task |
| GET /api/tasks?activeOnly=true&limit=20&cursor=... | 当前用户历史/活跃页，items/nextCursor |
| GET /api/tasks/{id} | 只读服务端Task状态与三步快照 |
| GET /media/demo/{key} | 公开本地示例 |
| GET /media/assets/{id}、/results/{taskId} | 当前owner上传/成功原PNG |
| GET /media/results/{taskId}?thumbnail=true | 同鉴权512px等比JPEG卡片图；无query与预览保持完整原PNG |

Task包含id、templateId/title、createdAt、status、stage、failedStage、failureCode/reason、resultUrl、单调version和三条steps。错误为code/message/requestId；查询错误不等于执行失败。

任务记录事务完成后派发到Java有界单线程FIFO，受理不等待制作。顺序为ASSET_CHECK→GENERATE→FINALIZE，每步开始/结束独立落MySQL，等待期间不持有事务。失败停止后续（NOT_STARTED），保存失败阶段/原因；最终步骤成功与Task/结果成功同事务提交。查询不推进任务，终态不回退。

前端每个活动任务独立跟踪，终态/无活动/离页停止自动查询；刷新从Java恢复历史与活跃分页。上传version/controller、提交锁、身份generation和终态合并防旧响应串扰。POST制作结果未知时先刷新历史，不自动重发。

## 五分钟演示

1. 用访客切分类，打开1/2/3图模板，观察要求；上传仓库示例，预览、替换、移除并验证非法文件反馈。
2. 提交后立即创建第二任务，查看排队/独立阶段；刷新或关闭页面再打开“我的作品”，后台继续。
3. 成功后预览原图；用开发者工具暂时阻断任务GET，保留真实任务并显示查询异常，解除后恢复。
4. 注册保存当前访客作品；退出/登录原账户恢复历史。另一浏览器/另一账户无法读取这些任务、素材和结果。
5. 按下面配置指定每个阶段失败和调慢耗时，与成功任务并存观察。

### 指定失败与耗时

浏览器已有访客/账户会话时在控制台执行，不读取token：

```js
const template = (await (await fetch('/api/templates')).json())
  .find(t => t.requiredImageCount === 1);
const image = await (await fetch('/media/demo/pet.png')).blob();
const form = new FormData();
form.append('templateId', template.id);
form.append('file', new File([image], 'sample.png', { type: 'image/png' }));
const asset = await (await fetch('/api/assets', { method: 'POST', body: form })).json();
const response = await fetch('/api/tasks', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ templateId: template.id, assetIds: [asset.id],
    simulation: { failAt: 'GENERATE',
      delayMs: { assetCheck: 1000, generate: 8000, finalize: 1000 } } })
});
console.log(response.status, await response.json());
```

`failAt`依次用ASSET_CHECK、GENERATE、FINALIZE可重复指定失败，null为成功。每阶段0～30000ms；配置随任务保存快照，不改变已受理任务。多次调用能观察队列和多任务；“我的作品”刷新会发现新任务。

## 构建、测试与CI

全部项目安装/构建/测试/运行在容器：

```sh
# 前端lint、类型检查和行为测试
docker compose -f compose.yaml -f compose.test.yaml run --build --rm --no-deps frontend-check
# Java单元/真实MySQL集成测试及package，独立临时mysql-test
docker compose -f compose.yaml -f compose.test.yaml run --build --rm backend-check
# 生产镜像
docker compose build backend frontend
# 启动后通过Next入口做独立API检查
docker compose up --detach --wait --wait-timeout 240
docker compose -f compose.yaml -f compose.test.yaml run --build --rm api-check
# 停止临时测试数据库，不删除产品卷
docker compose -f compose.yaml -f compose.test.yaml stop mysql-test
```

[GitHub Actions](https://github.com/XB-Dong/quvideo-material-studio/actions)在push/PR执行前端lint/type/test/build、Java真实MySQL verify/package、三服务集成及现有P1.1/P1.2浏览器/视觉/资源/真实后台检查。P2新增账户独立入口集成后在验收说明列出；每条结果绑定真实SHA/命令/exit，不把配置存在当执行通过。

浏览器验收使用实际部署40位TESTED_COMMIT，Bash `export TESTED_COMMIT=$(git rev-parse HEAD)`，PowerShell `$env:TESTED_COMMIT=(git rev-parse HEAD)`；源码ZIP没有.git时采用外部manifest的源码SHA。原P1.1/P1.2命令与边界保存在[工具说明](tests/p1.1/README.md)、[子页工具](tests/p1.2/README.md)。截图/录制与无截图性能分开，measure读取指标后才截图；真实物理设备和硬件GPU未测不冒称通过。

## 已完成范围、限制与取舍

最终每条完成/未完成/未验证在给作者单独提供的逐条符合性报告中说明；评估者可直接阅读[验收说明](docs/submission/VERIFICATION.md)。本轮报告尚在按实际运行补齐。

生成器使用预置本地结果，不真实使用上传图生成。单后端实例、有界单线程队列，不做集群/消息队列；服务重启不自动续跑，启动就绪前将遗留QUEUED/RUNNING标为FAILED/INTERRUPTED，保留既有终态。没有受理幂等、自动重试或断点续跑，未知POST需先确认历史。孤立上传尚无自动清理/配额。

账户是本地作业登录方案，邮箱未验证，无找回邮件/第三方账号；访客清cookie无法恢复，注册账户可重登恢复。密码/身份保护有对应测试，不冒称生产安全审计。开发与验收只用合成数据。

## 部署、备份与回滚

无需公网部署。选定验收commit后在Docker构建启动，确认健康与成功/失败、多任务/身份。备份要同时包含MySQL和文件卷，并保留配套镜像。先停止受理/后端，再导出DB与文件，可保证一致性；具体Bash容器命令见[交付与恢复说明](docs/delivery.md)。

回滚先保存当前证据和成套备份，使用与schema版本匹配的前后端及SQL/文件恢复；V4账户迁移不能用删除卷或只退一个镜像来回滚。P0/P1图片key升级也要求匹配数据库与文件快照，历史隔离恢复记录由作者保留，本轮实际验证与边界见验收说明；不是生产演练。

## 实际投入与AI工作流

使用Codex辅助开发。Leader拆分官方要求、冻结契约/所有权和任务；Backend与Frontend在独立工作树实现并写行为测试；Acceptance独立验收，释放席位后的Reviewer只读审代码/来源/报告；Leader处置发现、集成和复验。

真实修正例：审阅发现最终阶段成功和任务成功分属两个事务，DB故障会留下矛盾状态，修改为原子提交并增加故障回滚测试；另有旧401/身份切换/提交锁竞态，补generation与迟到响应回归。动效中也根据实际trace/CLS定位桥接强制布局及margin塌陷，再以无截图流程和逐轮测量复验。未提交私人聊天、账号或全部提示词，实际模型未知时不编造。

人工投入未独立计时，按需求阅读/指导/试用等活动粗估约2～4小时（低置信度估算，非实测）；截至P1.2的四个已记录执行区间合计约8.34小时会话墙钟，含CI等待，不含未计时准备/后续修正/P2，不累加并行Agent。P2另记录实际起止/核对/修正，最终汇总见[投入记录](docs/audit/effort.md)。

## 来源、许可与提交

业务代码由本项目实现；开发方法参考ccagent/classroom-annotator的规格追踪、任务包/所有权和独立验收，未复制其业务代码。照片来自逐项登记的Unsplash资源，山水来自The Met公开领域吴云画作，React Bits适配代码保留MIT+Commons Clause全文，不能简称纯MIT；完整来源/复用范围见[THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md)。

私有仓库链接需读取授权；默认交付完整源码ZIP与可复制提交说明，附精确验收commit和SHA256。用户指定的两份GIF随交付展示；交卷附件总数不超过6、单个<100MB。原题倒计时不是约定截止日期，最终提交由作者在原渠道完成，源码打包或完成CI不会自动交卷。

未来公开仓库前另核对第三方许可与全历史披露面。当前完整题面/原始参考图、邮件参考图及内部绝对路径不因项目原创许可而自动获得公开授权；公开准备结论在本轮审核报告说明。本轮不改仓库可见性或重写历史。
