# P0 运行与交付计划

本文是待实现的操作规约，不能作为当前可执行产品说明。P0 完成后用真实验证的命令、版本与输出更新 README。

## 容器与连接

根目录 compose.yaml 包含 frontend（Node 22 多阶段构建/Next standalone）、backend（Maven/JDK 21 构建与精简 JRE）、mysql（8.4）。只有前端映射 3000；前端通过 BACKEND_INTERNAL_URL=http://backend:8080 转发同源 API/media，Java 通过 JAVA_DB_URL 连接 mysql:3306/material_studio。所有敏感值从本地 .env 注入，不进入 Git 或前端 NEXT_PUBLIC 变量。

配置键以 .env.example 为准。数据库密码示例只供本地，启动 README 说明复制示例并替换；实际 Compose 校验必需值。SESSION_COOKIE_SECURE 对本地 HTTP 为 false，HTTPS 为 true；APP_PUBLIC_ORIGIN 用于写请求来源检查。STORAGE_ROOT 绑定命名文件卷；MySQL 用单独命名卷。默认模拟检查/生成/整理分别 1000/5000/1000ms、队列 20、演示控制启用。

第一次运行 `docker compose up --build` 完成健康等待、迁移、种子与素材准备，后续重启不重置历史。所有服务均应使用非 root 应用用户（MySQL 镜像按其官方行为），配置健康检查与有界重启。P0 记录准确镜像版本/digest与实际启动日志。

## CI 与检查入口

`.github/workflows/ci.yml` 在 push 和 pull_request 触发，permissions: contents: read；不注入真实业务凭据。前端容器执行 npm ci → eslint → tsc --noEmit → Vitest → next build，后端 Maven 容器执行 mvn -B verify，包含 JUnit 与真实 MySQL 集成。Testcontainers 需要 Docker 时在 Linux GitHub runner 或 Compose 测试环境执行，不能在无 Docker 情况下静默跳过仍宣称通过。

采用 compose.test.yaml 定义测试镜像/服务，保证安装、测试、构建和运行都可在容器执行。准确命令、service 名称与 frontend package scripts 在 R0 落地；当前不创建会因缺少源码而必然失败的空 CI，也不提交以条件跳过全部检查的伪 CI。

## 演示脚本

1. 启动三服务，打开 localhost:3000，创建匿名身份，切换分类并进入 2 图模板。
2. 使用仓库提供的两张样例图上传；检查预览、移除、替换、类型/大小限制；提交后立即在历史见任务 ID 与排队/阶段。
3. 立即创建第二任务；刷新、离页再返回，确认两个任务独立变化并预览成功图。
4. 指定失败用浏览器已有会话向 POST /api/tasks 发送相同合法 assetIds 与 simulation.failAt。ASSET_CHECK、GENERATE、FINALIZE 各演示一次；截图/响应核验后续步骤 NOT_STARTED。最终 README 提供可复制的请求示例，不要求正式页面提供模拟控制。

```json
{
  "templateId": "demo-postcard",
  "assetIds": ["<first uploaded asset UUID>", "<second uploaded asset UUID>"],
  "simulation": {
    "failAt": "GENERATE",
    "delayMs": {"assetCheck": 1500, "generate": 10000, "finalize": 1500}
  }
}
```

5. 延迟用请求 simulation.delayMs 调整，或修改默认环境变量重建 backend；入库快照令旧任务不受新默认值影响。启用模拟控制仅为本地演示；关闭后请求带 simulation 返回 400。
6. DevTools 临时阻断任务 GET，确认提示查询异常而不是制作失败；解除后手动恢复。POST 结果不确定时先刷新历史，不自动重发。
7. 另开无痕窗口，确认另一匿名用户没有前者历史；以他人 taskId/assetId/media 不能读取或提交。清 Cookie 丢失原身份是已知限制。
8. 成功结果跨刷新保留；重启 backend 时非终态为 INTERRUPTED 失败、终态保持，明确不是自动续跑。

## 部署与回滚

无需公网部署。验收从干净环境构建指定 commit；先备份 MySQL 和文件卷，再部署新镜像及迁移，记录实际 SHA、迁移版本和健康结果。以成功制作、失败注入、历史恢复做 smoke check，不以健康端点代替业务验证。

回滚前停止受理/停后端，保留失败环境证据；切回上一已验证镜像。仅当数据库 schema 向后兼容时直接回退代码；不兼容则恢复匹配的 MySQL 备份和同一时间点文件卷后启动对应版本。不得在普通回滚步骤中 `down -v` 删除用户数据。最终提供备份/恢复具体容器命令，并用合成数据实际验证一次。

## 最终交付检查

完整 frontend/backend、准确版本与 lockfile/pom、SQL 迁移和种子、本地素材与来源、Dockerfile/Compose、push/PR CI、关键测试、需求证据矩阵、README、实际投入、AI 实例和限制。明确 acceptanceCommit（业务验证 SHA）和 reportCommit（封存报告 SHA），避免同一提交自引用。

私有仓库默认评估者无法读取；在最终沟通前由用户选择授予指定 GitHub 账号读取或提供 `git archive` 源码包，不擅自公开仓库、不邀请未知账号。源码包不包含 .env、.git、node_modules、target、.next 或运行卷，保留 CI 与本地样例。交卷由用户通过原沟通渠道完成，交卷后不可修改。
