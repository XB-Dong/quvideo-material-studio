# P0 集成运行检查

时间：2026-10-29，+08:00。环境：Windows 上 Docker Desktop Linux Engine 29.3.1、Compose 5.1.1；应用安装、构建、测试和运行均在 Linux 容器，不在宿主机执行项目 npm/Maven/Python 脚本。宿主 Python 只做文档检查。

## 源码和运行基准

集成提交 4328a3b9518c6ce572e796d29ce4496805be28f0 包含后端修复 365e30cd2fa547f2ada44230ee9c5396d7106591、前端修复 406a48e6e872cbd559fd9a1d10c6dfd3ae466aae 和审核关闭记录。后续交付文档不改变应用代码；若代码再次变化需复验受影响项。

## 实际结果

| 操作 | 结果 |
| --- | --- |
| compose 配置校验、MySQL 首次健康 | 通过；MySQL 实测 8.4.13，命名卷最初新建 |
| docker compose build backend | 通过，Java21 app.jar；生产打包跳过重复数据库测试，单独 verify 已执行 |
| docker compose build frontend | 通过，Next16.4.3、TypeScript、全部页面/API/media路由；身份修复后已重建 |
| docker compose up --detach --wait | 三服务健康；首次 Flyway V1/V2、四模板与本地图片可用 |
| frontend-check 完整命令 | 17:48:42，lint 无警告、typecheck 通过、Vitest 16/16，退出0 |
| backend-check 完整命令 | 17:48:27，JUnit 12/12，0错误/失败/跳过，6个真实MySQL集成 + 6个pipeline，JAR构建成功，退出0 |
| 独立 API 黑盒 | 8/8，11.840秒，退出0，原集成基准620eb4a；详见 acceptance/live-api-620eb4a.md；最终版本另由CI覆盖 |
| OpenAPI 专用schema校验 | Python3.12.12容器 + openapi-spec-validator0.7.2，修正描述逗号引号后 /specs/api.yaml: OK，退出0 |

命令入口均与 README/CI 一致。frontend-check 与 backend-check 原始本机日志在运行机临时目录；本文保留结果与精确基准，未将包下载日志或含环境属性的整份报告入库。

## 失败与修正

- 第一次完整 OpenAPI 校验发现 Error.message 行内描述逗号被 YAML 解析为额外字段；加引号后复验通过，只修语法，没有改 API 语义。
- BuildKit 第一次 Maven 镜像认证遇到网络/DNS失败；官方镜像直接拉取后继续，非行为 Red。
- 后端最初 Java record 的 finalize 命名无法编译，改内部 finalizeMs 并保留 JSON finalize；随后完整编译通过。
- 队列拒绝 afterCommit 的事务陷阱、最终完成分事务问题、旧401与提交锁身份竞态均有修复/回归/独立处置记录。
- Flyway 对 MySQL8.4 发出超出其已测试8.1范围的提示；真实迁移及集成检查通过，未抑制提示。ByteBuddy/JVM测试工具提示保留，不视为产品失败。
