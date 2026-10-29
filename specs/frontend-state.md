# 前端异步状态与查询生命周期

版本：1.0.0；覆盖 R-03、R-07 至 R-10、R-12。

## 状态分离

| 区域 | 状态 | 规则 |
| --- | --- | --- |
| 上传槽位 | EMPTY/UPLOADING/READY/ERROR | 各槽独立保存 file、previewUrl、assetId、错误和 requestVersion |
| 提交 | IDLE/SUBMITTING/UNKNOWN_OUTCOME/ERROR | 与后台任务状态独立；202 后立刻退出 SUBMITTING |
| 后台任务 | QUEUED/RUNNING/SUCCEEDED/FAILED | 仅由 Java 响应更新，按 taskId 分开保存 |
| 查询 | loading/error/dataUpdatedAt | 查询错误不能修改 task.status/failedStage/failureReason |

本地 ObjectURL 只用于选图即时预览；收到 Java assetId 后才算 READY。替换或移除递增 slot requestVersion 并取消旧请求，旧响应即使返回也不得覆盖新槽位；及时 revoke ObjectURL（不能在仍显示时撤销）。替换上传失败显示重试/重新选择，不保留可误提交的旧 assetId。上传完整成功、恰好所需数量、会话有效且未提交中才允许提交。

202 接收后插入/合并该任务，并允许继续提交新任务。任务保存素材快照，后续替换槽位不影响旧任务。POST 超时/网络失败的受理结果不确定，不将后台标失败，也不自动重发；提供刷新历史确认的入口。

## 查询与竞态

使用 TanStack Query：session 单次初始化；模板是公开键，个人历史键含 userId，任务键为 ['task',userId,taskId]。用 task.version 合并，低于已知版本的响应丢弃，终态数据不能被旧的历史/POST/轮询响应改回非终态。

历史列表首次进入读取 Java；同时以 activeOnly=true 分页读取全部未结束任务直到 nextCursor=null，避免首页之外的活跃任务刷新后失去跟踪。活跃查询缓存键同样包含 userId，所有响应按 version 合并；每次重新挂载重新发现活跃任务。列表重取可以由显式刷新、分页、提交后触发，不设置无条件定时列表轮询。每个非终态任务详情约 2 秒查询一次；使用完成后再调度或库内不重叠请求，终态关闭 interval。无活跃任务无自动轮询。不要为每次 render 重新创建计时器。

首次历史请求失败显示错误与重试；已有数据时查询失败保留已有卡片，单独显示“状态暂时无法更新/最后更新时间”并提供恢复按钮，当前任务可以继续定时查询但保持有限频率，不立即无限重试。成功恢复后清查询错误。失败状态只有服务端 Task.status=FAILED 才显示“制作失败”。

所有 queryFn 接收 AbortSignal。离开详情/历史页面时销毁定时器和订阅、取消挂载请求，任务仍由后台处理。会话变化或 401 时取消旧用户全部请求、递增身份 epoch、移除旧个人缓存，再显示新身份；回调须核对 epoch 与 userId 后才写缓存，不能仅依赖网络 abort。进入新页面重新读后台历史。

## 必须可测试的纯规则与交互

- A/B 响应乱序，A 失败不会写到 B；每个查询缓存键包含身份和任务。
- 相同任务低 version 响应不能覆盖高 version/终态。
- GET 500/超时只影响查询状态，不影响后台任务状态；手动恢复有效。
- 上传旧响应晚于替换/移除时不恢复旧 assetId。
- 卸载后不再请求，用户切换后旧回调无效；所有终态后计时器停止。
- 提交受理后按钮退出提交态，新任务可创建；未知受理结果不自动重发。

使用 Vitest、React Testing Library、可控假计时器与 deferred promise；测试真实状态合并/Hook 行为，避免只断言实现内部对象快照。
