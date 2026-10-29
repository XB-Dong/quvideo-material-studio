# 映作 素材制作工作室

小影科技 2027 校招全栈开发笔试项目，作者董信步。浏览模板、上传图片、提交后台制作任务，在等待期间继续使用网站，最后从个人历史预览结果。制作使用可控的模拟器，不调用真实 AI。

P0 已完成，验收 commit 为 4dd397f2f5b2cb74ca21aba08482d0cae5b0a0de；[GitHub CI 三任务通过](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40854073869)。后续封存提交只更新交付文档，应用源码与验收版本一致。详见 [P0 报告](docs/waves/P0/REPORT.md)和[验收矩阵](docs/waves/P0/ACCEPTANCE.md)。下一阶段蓝紫色视觉、优质素材及交互动画要求已记录在 [NEXT-WAVES](NEXT-WAVES.md)，尚未启动。

## 一条命令启动

需要可用的 Linux Docker Engine 与 Docker Compose（支持 --wait）。无需宿主机 Node、Java、Maven 或 MySQL。

```sh
docker compose up --build
```

打开 [本地网站](http://localhost:3000)。默认演示配置可直接启动；自定义时复制 .env.example 为 .env。首次镜像与依赖下载需要网络，运行中的封面、示例和结果全部来自本地资源。默认只向宿主机映射前端 3000 端口，Java 与 MySQL 在 Compose 网络中访问。停止用 `docker compose down`，命名卷会保留上传与历史；不要将 down --volumes 作为日常停止或回滚步骤。

## 技术版本与目录

| 部分 | 准确版本 |
| --- | --- |
| 前端 | Next.js 16.4.3 App Router、React/react-dom 19.3.1、TypeScript 5.9.3 |
| 客户端状态 | TanStack Query 5.105.0 |
| 前端工具 | Vitest 5.0.5、RTL 16.3.2、ESLint 9.39.2 |
| 前端运行时 | Node.js 22.22.0-alpine |
| 后端 | Java 21、Spring Boot 3.5.16、MyBatis Starter 3.0.5 |
| 构建与数据库 | Maven 3.9.11、MySQL 8.4.13，Flyway 迁移 |
| 独立验收 | Python 3.12.12 标准库 unittest |

前端 npm 精确依赖与传递依赖在 package-lock.json；Java 传递版本由 Boot BOM 与 pom.xml 管理。Dockerfile、Compose 已锁定基础镜像 digest。系列搭配依据见 [架构决定](docs/decisions/0002-architecture.md)，实际构建与测试记录见交接/验收证据。

```text
frontend/              Next App Router、页面、请求代理、组件与行为测试
backend/               Java 服务、MyBatis SQL、Flyway、图片、生成脚本与 JUnit
tests/                 独立 API 黑盒验收及容器入口
specs/                 OpenAPI、数据、状态机、前端生命周期、UI 与验收规格
docs/requirements/     题目 R-01～R-14 和参考图
docs/waves/P0/         计划、任务包、状态、交接、审核与证据
compose.yaml           frontend、backend、mysql 与持久卷
compose.test.yaml      前端检查、Java/MySQL 检查、独立 API 验收
.github/workflows/     push / pull_request / 手动 CI
```

Java 提供全部业务与持久化。浏览器的 /api/* 和 /media/* 由 Next 在请求时转发至 backend:8080，保留会话、状态码和内容类型，个人数据不缓存。后端 JDBC 连接 mysql:3306；数据库 schema 和分类/模板由 Flyway V1/V2 初始化，再次启动不会重置任务。数据库与文件分别持久化于 mysql-data、material-files 命名卷。

## 容器内构建和测试

```sh
# lint、TypeScript 和前端行为测试
docker compose -f compose.yaml -f compose.test.yaml run --build --rm --no-deps frontend-check

# Java 单元/真实 MySQL 集成测试及 JAR 构建，使用独立临时 mysql-test
docker compose -f compose.yaml -f compose.test.yaml run --build --rm backend-check

# 前后端生产镜像构建
docker compose build backend frontend

# 启动后通过 Next 同源入口做独立业务验收
docker compose up --detach --wait --wait-timeout 240
docker compose -f compose.yaml -f compose.test.yaml run --build --rm api-check

# 单独停止测试数据库（不会删除产品命名卷）
docker compose -f compose.yaml -f compose.test.yaml stop mysql-test
```

frontend-check 实际执行 npm ci（镜像构建）及 npm run lint、npm run typecheck、npm test -- --run。backend-check 执行 mvn -B verify，测试包含真实 MySQL，不以 H2 替代。生产 JAR 镜像打包阶段不重复运行数据库测试，CI 的 Java verify 是独立必需门槛。源码包保留全部检查配置。

[GitHub Actions](https://github.com/XB-Dong/quvideo-material-studio/actions) 对 push/PR 执行前端检查/生产构建、Java verify，以及完整三服务 API 验收。具体运行是否通过以对应 commit 的实际记录为准，不把配置存在当作执行通过。

## 配置

.env.example 都是本地演示值，不含真实凭据。生产用途需替换密码与 HTTPS 配置。

| 配置 | 用途/默认 |
| --- | --- |
| MYSQL_DATABASE / MYSQL_USER / MYSQL_PASSWORD / MYSQL_ROOT_PASSWORD | MySQL 初始化；默认 material_studio/material_app 和演示密码 |
| JAVA_DB_URL / JAVA_DB_USERNAME / JAVA_DB_PASSWORD | Java JDBC；改数据库名/账号时也要同步此三项 |
| APP_PUBLIC_ORIGIN | 写请求允许来源，默认 http://localhost:3000 |
| FRONTEND_PORT | 宿主机端口，默认 3000；改端口要同步 APP_PUBLIC_ORIGIN |
| SESSION_COOKIE_SECURE / SESSION_TTL_DAYS | 本地 HTTP 为 false，HTTPS 为 true；有效期默认 7 天 |
| TASK_QUEUE_CAPACITY | 默认 20，执行线程数 1 |
| SIMULATION_CONTROLS_ENABLED | 演示时 true；false 时请求不得携带 simulation |
| SIMULATION_ASSET_CHECK_DELAY_MS | 默认 1000 |
| SIMULATION_GENERATE_DELAY_MS | 默认 5000 |
| SIMULATION_FINALIZE_DELAY_MS | 默认 1000 |

STORAGE_ROOT 在 Compose 内固定 /data/materials 并挂卷；BACKEND_INTERNAL_URL 在 Compose 内固定 http://backend:8080，不能放在浏览器公开配置中。健康检查等待 MySQL、Java 和前端代理就绪。

## 接口与后台执行

详细字段见 [OpenAPI](specs/api.yaml)。

| 方法与路径 | 请求/响应要点 |
| --- | --- |
| POST /api/session | 创建或复用匿名会话，返回 userId/displayName/expiresAt，设置 HttpOnly Cookie |
| GET /api/session | 读取身份；无身份 401，不隐式建用户 |
| GET /api/categories | 分类 id/title |
| GET /api/templates?categoryId=... | 模板数组：标题/封面/描述/图片数量/MIME/最大字节数 |
| GET /api/templates/{id} | 单模板，不存在 404 |
| POST /api/assets | multipart 的 templateId、file；201 返回 id/url/mimeType/sizeBytes/width/height |
| POST /api/tasks | templateId、按槽位顺序 assetIds、可选 simulation；202 返回已受理 Task |
| GET /api/tasks?activeOnly=true&limit=20&cursor=... | 当前用户历史/活跃任务，items 和 nextCursor |
| GET /api/tasks/{id} | 只读状态快照，含步骤和单调 version |
| GET /media/demo/{key} | 公开本地示例 |
| GET /media/assets/{id}、/media/results/{taskId} | 当前用户的上传和成功结果图 |

Task 包含 id、templateId/title、createdAt、status、stage、failedStage、failureCode/reason、resultUrl、version 和三条 steps。请求异常返回 code/message/requestId；查询错误不代表任务执行失败。

任务在事务完成后派发到 Java 有界单线程 FIFO 队列，受理请求不等待生成。顺序为 ASSET_CHECK（素材检查）→ GENERATE（模拟生成）→ FINALIZE（结果整理）；每步开始/结束独立写 MySQL，模拟等待不持有事务。某步失败后后续 NOT_STARTED。最终步骤成功与任务/结果成功同事务提交；派发拒绝用独立事务保存 QUEUE_FULL。查询不推进任务，终态不回退。

前端区分上传、提交、任务和查询状态。受理后退出“提交中”，可继续创建。每个活跃任务独立轮询，结束或离页后停止；刷新读取历史和全部活跃页恢复跟踪。版本、身份 generation 和取消信号防止旧响应污染。POST 网络结果不确定时先刷新历史，不自动重发。

## 五分钟演示

1. 打开网站，切换创意图片/人像/宠物。四个本地模板覆盖 1/2/3 张图，详情按要求展示上传位。
2. 本地素材位于 backend/src/main/resources/demo/：postcard.png、pet.png、story.png、portrait.png。上传其中图片，预览、替换、移除；类型仅 JPEG/PNG、单文件 5 MiB、最多 2000 万像素，服务端验证真实内容。
3. 提交成功后立刻再建一个任务；查看各自排队/阶段/结果。刷新、离页再回来，或关闭页面等待后重开历史，后台继续处理。
4. 在成功卡片点击预览。网络面板临时阻断任务 GET，可见“查询异常”而保留任务状态，解除后恢复查询。
5. 普通与无痕窗口分别打开：两者匿名用户不同，历史、上传和结果互相隔离。顶部身份面板显示当前用户。

### 指定阶段失败与耗时

本地演示默认启用控制。可在浏览器开发者工具控制台执行以下请求；沿用当前 HttpOnly 会话，不读取 token：

```js
const templates = await (await fetch('/api/templates')).json();
const template = templates.find(t => t.requiredImageCount === 1);
const image = await (await fetch('/media/demo/pet.png')).blob();
const form = new FormData();
form.append('templateId', template.id);
form.append('file', new File([image], 'sample.png', { type: 'image/png' }));
const asset = await (await fetch('/api/assets', { method: 'POST', body: form })).json();
const response = await fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    templateId: template.id,
    assetIds: [asset.id],
    simulation: {
      failAt: 'GENERATE',
      delayMs: { assetCheck: 1000, generate: 8000, finalize: 1000 }
    }
  })
});
console.log(response.status, await response.json());
```

将 failAt 依次改为 ASSET_CHECK、GENERATE、FINALIZE 可重复验证对应失败；null 为成功。每阶段延迟 0～30000ms。查看“我的作品”或手动刷新历史，新建任务会被发现。任务保存模拟配置快照，改默认配置不会改变已受理任务。多次调用可以观察排队；无需随机失败或正式页面调试控件。

## 身份、恢复与限制

后端生成随机不透明会话 token，数据库只存 SHA256 哈希。Cookie 为 HttpOnly、SameSite=Lax、Path=/；Java 从会话确定用户，业务请求不接受 userId。读他人任务/素材/结果统一 404。匿名身份适合作业演示，不是生产账户服务；清 Cookie 或过期后创建新身份，旧记录无法找回，不支持跨设备迁移。

服务重启不会自动续跑：启动健康就绪前将遗留 QUEUED/RUNNING 标记 FAILED/INTERRUPTED，保留可理解原因；既有成功/失败保持。只支持单后端实例。没有幂等受理、自动重试或断点续跑；请求结果不确定需人工确认历史。预置结果不真实使用上传图生成；孤立上传保留，尚无清理策略和存储配额。备份需同时包含 MySQL 与文件卷。

## 部署、备份与回滚

无需公网部署。选定验收 commit 后，在 Docker 环境构建并启动，核验健康、成功/失败、多任务和历史。保留上一版本镜像及匹配的数据备份。

以下为 Bash 终端中的 Docker 命令，备份放仓库外的本地目录；SQL/tar 操作都在容器中执行：

```sh
docker compose exec -T mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --no-tablespaces "$MYSQL_DATABASE"' > material-db.sql
docker compose exec -T backend tar -C /data/materials -czf - . > material-files.tgz
```

完整一致备份应先停止受理/停止 backend，再导出 DB；文件卷可由临时 helper 容器读取（示例见 [交付说明](docs/delivery.md)）。上述在线导出适合无任务写入时的演示备份。回滚先停受理、保留证据并切回上一镜像；仅 schema 向后兼容时直接回退代码，否则恢复匹配时间点 DB 和文件卷后启动对应版本。不得通过删除命名卷来回滚。本地合成备份恢复的实际证据在 P0 报告中，不能等同生产演练。

## 实际投入、AI 工作流与来源

[投入与取舍](docs/audit/effort.md)按实际执行记录：P0 从 2026-10-29 17:15+08:00 开始；用户实际人工投入未精确计量，待作者填写，不将并行 Agent 时间相加为人类工时。已完成/未完成/未验证在验收矩阵分别列出，最终报告给出测试版本和已知限制。

使用 Codex：Leader 拆解规格与任务，前后端在独立 worktree 实现并自测，独立 Agent 审核/黑盒验收，Leader 复现处置、合入及容器验证。真实修正例：审阅发现最终阶段成功与任务成功分属两个事务，DB 故障会产生矛盾状态；修为原子提交并增加故障回滚测试。另发现旧401与提交锁身份竞态，修为请求身份 generation 与提交代数保护并补回归。详见 [审核记录](docs/waves/P0/reviews/backend-review.md)、[前端审核](docs/waves/P0/reviews/frontend-review.md)和交接证据。未提交私人聊天、账号或全部提示词。

业务代码由本项目实现；开发方法参考 ccagent/classroom-annotator。示例图片为仓库 Python 标准库脚本生成的原创程序图形，封面和结果均可离线使用；原题截图仅作布局参考。框架、工具和来源见 [THIRD-PARTY-NOTICES](THIRD-PARTY-NOTICES.md)。不用付费或内部服务。

私有仓库交付需由作者授予评估者读取或生成 `git archive --format=zip --output=<仓库外路径>/source.zip HEAD`；源码包保留 CI、迁移和本地素材，不含 .env、依赖缓存或运行卷。最终交卷由用户在原沟通渠道完成。
