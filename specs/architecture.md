# 系统架构规格

版本：1.0.0；覆盖 R-01、R-04、R-05、R-09、R-10、R-14。本文描述待实现行为。

## 请求与运行边界

浏览器 → Next.js 同源 `/api/*` 与 `/media/*` 转发 → Java → MySQL/文件卷。Next 转发必须保留 Cookie、Set-Cookie、状态码和内容类型；禁止缓存个人接口，避免把内部 backend:8080 地址返回浏览器。公开封面也从同源 media 入口提供。

三服务为 frontend、backend、mysql。前端公开 3000 端口；后端和数据库默认仅 Compose 网络访问。健康检查先等 MySQL 可用及迁移完成，再接业务。图片/结果用独立命名卷；卷与数据库都需备份。

## Java 模块

| 模块 | 职责 |
| --- | --- |
| identity | 会话创建/验证，token 哈希，当前用户上下文 |
| template | 分类、模板、种子读取，公开封面 |
| asset | multipart 上传、真实类型校验、大小限制、文件落盘、归属 |
| task | 受理事务、任务/素材快照、状态只读查询、个人历史 |
| processing | 有界执行器、素材检查/模拟生成/结果整理、阶段边界与失败 |
| media | 白名单路径映射、公开示例与鉴权私有图 |
| common | 错误响应、requestId、UTC 时间、统一异常处理 |

Controller 只适配协议；Service 负责规则/事务；MyBatis Mapper 显式 SQL。禁止在查询接口里 sleep、推进阶段或使用前端计时伪造后端执行。

## 任务受理与资源边界

在请求事务中验证模板、图片数量/顺序/唯一性/归属/类型/大小/文件存在性、模拟参数范围，写入 QUEUED 任务和素材及模拟配置快照。事务成功后投递 executor；失败不投递。用 AFTER_COMMIT 监听或显式事务返回后的派发，避免 @Async 同类调用失效。

单线程处理、有限排队容量，默认 20；不要求并行。执行器拒绝时将已建任务保存为 FAILED、failureCode=QUEUE_FULL、stage=null，受理仍返回任务 ID。启动时遗留的 QUEUED/RUNNING 转为 INTERRUPTED 失败；不续跑。等待队列本身不持久化为可恢复调度器。

阶段执行前后用独立短事务记录 task_steps 和 tasks，模拟延迟在事务外。成功写 resultUrl 与 SUCCEEDED 必须原子完成；结果文件先写临时文件后原子改名，再提交 DB，数据库失败时保留可清理孤立文件且不能报告成功。

上传单文件 5 MiB（模板可约束），请求体略高于单文件限制；文件数量由模板控制。验证 JPEG/PNG magic bytes 与可解码尺寸，拒绝损坏图和扩展名伪装；限制像素尺寸（计划最大 20 MP）防解码耗尽。文件名由服务器生成，不能使用原始文件名拼接路径。

## 身份与隐私

POST /api/session 在无有效 Cookie 时创建 anonymous user 和高熵 token。Cookie 名 material_session，HttpOnly、SameSite=Lax、Path=/，HTTPS 时 Secure；演示 HTTP 时由环境配置。会话有效期计划 7 天，不承诺永久跨设备身份。GET /api/session 不创建身份，无有效 Cookie 返回 401；会话初始化由前端单次协调，避免并发创建多个匿名身份。

Java 按会话解析 userId，业务请求不接收可伪造 userId。task/asset/result 查询条件均带当前用户，不归属资源与不存在资源统一 404。公开分类/模板/封面不需要会话；个人响应 Cache-Control: no-store。写请求检查允许的同源 Origin，cookie 使用 SameSite。无注册、找回、账户迁移；清 Cookie 后成为新用户，旧记录不自动找回，README 解释限制。

不提供生产“任意用户 ID 切换”接口。演示使用普通与无痕窗口，前端若会话变化/失效先停止查询、清空个人数据再初始化新身份。上传与结果不直接映射静态目录。
