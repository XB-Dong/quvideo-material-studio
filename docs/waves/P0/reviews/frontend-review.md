# 前端独立只读代码审阅

日期：2026-10-29；准确提交：fb9476a9162c42f5312bd2579330daf91c55ee17；规格：1.0.0；范围：frontend/ 异步、身份、上传、提交和同源代理。读取源码与现有测试，未修改产品，未执行浏览器操作。

## FE-REV-01 旧请求的 401 可使新身份失效

- 严重度：major，R-08 身份切换时旧请求不得影响当前身份。
- 位置：frontend/src/lib/api.ts 的 api 错误响应分支；frontend/src/components/providers.tsx 的 session-expired listener。
- 触发：旧身份请求返回 401，客户端仍在异步读取错误 body；同时旧请求被取消，用户重新连接身份。`response.json().catch(() => ({}))` 完成后，旧请求继续派发全局 session-expired。特别是 body 读取因 abort 而失败时，catch 仍让流程继续。
- 实际：api 未检查请求 AbortSignal，也没有附带身份/epoch；Provider 无条件增加 epoch、清除 session 和全部个人缓存。旧 401 因此可以清掉新身份。
- 预期：只有当前身份的有效请求才触发身份失效；取消或旧身份响应应被忽略。
- 建议：将失效通知关联到请求所属身份 generation，Provider 校验后处理；至少先过滤 aborted 请求，并加入“旧 401 在重连后返回”的 deferred 回归。
- 证据：静态控制流；已有 useTasks 旧数据测试 mock 了 api，不能覆盖真实 api 的全局副作用。尚未浏览器/测试复现。

## FE-REV-02 身份切换未取消并清理旧提交锁

- 严重度：major，R-08 用户切换清理与 R-03/R-07 可继续操作。
- 位置：frontend/src/components/studio.tsx 的 Maker 生命周期 effect、session.userId effect、submit finally。
- 触发：旧身份 POST /api/tasks 仍 pending，其他请求 401 触发会话失效；用户重新连接得到新身份，Maker 没有卸载。
- 实际：userId effect 仅重置 slots/message，没有 abort pending POST，也没有清理 locked/submitting；新身份所有上传位仍因 submitting=true 禁用，直到旧请求完成。旧请求 finally 也不检查 identity/submission generation。
- 预期：切换身份立即取消旧提交的客户端跟踪、重置提交锁，不让旧 finally 改动新提交状态；服务端已受理任务继续运行，不自动重发。
- 建议：identity-change cleanup 同时 abort/reset，使用独立 submission generation 防旧 finally 解锁新请求；加入 pending POST → expire/reconnect 的回归。
- 证据：静态控制流。已有提交测试没有覆盖身份在提交过程中变化。

## 已核对与限制

模板/媒体同源转发保留 Cookie、Origin、状态码并关闭缓存；上传有独立槽位版本、abort、卸载与 ObjectURL 清理；任务缓存带 userId/taskId，version/终态合并防倒退；活跃列表分页发现、各任务终态停轮询、查询错误和后台失败分离均已有实现与针对性测试。本次未发现上述两项之外的额外阻断或重大问题。

前端 13 项测试/lint/type/build 的既有结果来自实现角色，不能归为本审核的执行证据；实际浏览器界面、断网恢复、键盘/焦点和窄屏待独立操作。两项发现已上报 Leader，等待处置和修复提交复核。

## 修复独立复核

2026-10-29，独立读取准确修复提交 406a48e6e872cbd559fd9a1d10c6dfd3ae466aae（包括源码 diff 和三项新增回归），结论如下：

| 发现 | 修复与回归 | 处置 |
| --- | --- | --- |
| FE-REV-01 | api 在请求开始捕获 session generation，401 body 结束后校验请求未 abort 且 generation 仍当前；失效事件携带 generation，Provider 再次校验并在重连/失效/清理时递增。session-lifecycle.test.tsx 新增“旧 401 body 延迟到重连后”和“已 abort 请求的晚到 401”两项回归，使用真实 api 函数而非将它整体 mock 掉 | 源码与回归设计独立复核通过，采纳并关闭 |
| FE-REV-02 | Maker 在身份变化时 abort/null pending、递增 submissionGeneration、释放锁和 submitting、清空旧素材；success/catch/finally 均有身份 epoch 与提交 generation 约束。新增 deferred 旧 POST → 身份失效/重连 → 新 POST → 旧响应晚到回归，断言旧 finally 不解锁新提交 | 源码与回归设计独立复核通过，采纳并关闭 |

本次没有发现上述修复引入的新阻断或重大问题。Frontend 实现者报告总计 16 测试及生产构建通过；本角色本次只做准确提交的源码/测试审阅，没有重复执行其测试，运行结论应引用实现者/Leader 对应证据。实际浏览器、网络故障界面和键盘/小屏仍由 Leader 后续验收，不能以本记录替代。
