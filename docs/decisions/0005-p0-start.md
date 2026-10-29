# 决定 0005 P0 启动与底座所有权

2026-10-29 17:15+08:00，用户明确“启动P0开发”。此前准备停止限制由本次启动授权替代；执行完整 P0，完成后报告，不自动交卷或进入 P1。

主 Agent 已复读需求、架构、数据、状态、前端、UI、验收与协作协议，审阅本次文件地图。暂无产品代码或测试。为避免 Leader 顺序搭建所有源码的无效等待，将 P0-BOOT 的分区底座明确转交：

| Owner | 允许写入 | 当前任务及依赖 |
| --- | --- | --- |
| Frontend Agent | frontend/ 全部，包括依赖锁、配置、Dockerfile 和自身测试 | BOOT 前端部分 → FE-CATALOG → FE-TASK，自身骨架后可连续推进 |
| Backend Agent | backend/ 全部，包括 pom、迁移 V1/V2、素材生成脚本/文件、Dockerfile 和自身测试 | BOOT 后端部分 → BE-CATALOG → BE-TASK，自身骨架后可连续推进 |
| Acceptance Agent | tests/ 全部、独立验收证据与自己的交接 | BOOT 测试入口设计；产品集成后执行 ACCEPT |
| Leader | specs/、docs 共享状态、根 Compose/test Compose、CI、.env.example、集成和交付 | 协调版本和接口，验证三服务后更新 BOOT 门槛 |

三工作树从同一准确启动提交分支；使用现有 specs/api.yaml 1.0.0 为冻结接口。前端代理 /api 和 /media 到 BACKEND_INTERNAL_URL；Java 端口 8080、Actuator /actuator/health；前端端口 3000。backend JAR 名 app.jar。测试采用容器；不在宿主机运行项目安装/测试脚本。共享契约变更先报告 Leader。迁移号 V1/V2 由 Backend 本次独占，其他 Agent 不添加迁移。

启动时 Docker CLI 可用但 Linux daemon 不可用，允许启动本机 Docker Desktop（隐藏窗口）进行隔离运行；不新增系统自启动项。若运行环境受阻，继续独立实现与测试准备，并保留未验证事实。

## 本次文件地图审阅

新增 frontend/、backend/、tests/、compose.yaml、compose.test.yaml、.github/workflows/ci.yml；更新 README、配置和状态。依赖方向：前端/独立验收 → API 契约 → Java/MyBatis → MySQL/卷。测试优先覆盖三步顺序/失败中断和前端多任务/查询异常。风险为首次数据库迁移、依赖解析、文件卷权限及请求竞态；没有旧业务 API 兼容性负担。地图已由 Leader 审阅，可进入实施。
