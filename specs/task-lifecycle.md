# 后台任务生命周期

版本：1.0.0；覆盖 R-04 至 R-06、R-09。三步骤来自 Java 执行与持久化，不由请求查询驱动。

## 状态与阶段

| 当前状态 | 允许后继 | 含义 |
| --- | --- | --- |
| QUEUED，stage=null | RUNNING/ASSET_CHECK；或 FAILED | 已建记录，等待执行；派发拒绝或进程中断可直接失败 |
| RUNNING/ASSET_CHECK | RUNNING/GENERATE；或 FAILED | 检查上传文件与素材快照 |
| RUNNING/GENERATE | RUNNING/FINALIZE；或 FAILED | 按配置延迟，返回预置结果候选 |
| RUNNING/FINALIZE | SUCCEEDED；或 FAILED | 整理结果文件与记录地址 |
| SUCCEEDED | 无 | resultUrl 非空，completedAt 非空，后续查询保持成功 |
| FAILED | 无 | failureCode/reason 非空；阶段失败时 failedStage 非空 |

每次运行阶段依次记录：步骤 RUNNING + 时间 → 执行/延迟 → 步骤 SUCCEEDED + 时间。失败则当前步骤 FAILED、task FAILED、保存失败阶段与原因，后续步骤保持 NOT_STARTED，不执行其 handler。终态 stage 保留最后进入阶段；队列拒绝尚未进入步骤为 null。

正常成功时三步骤均成功；最终写任务 SUCCEEDED 时保留 stage=FINALIZE。错误边界涵盖注入失败、文件丢失、结果写盘、意外异常、派发拒绝。不能吞掉异常令任务永久 RUNNING；DB 不可用时尝试有界记录，记录失败仍需日志，并在下次启动收束遗留记录，不能保证数据库完全不可用时即时持久化错误。

## 可重复模拟

创建体可含 `simulation={failAt:null|ASSET_CHECK|GENERATE|FINALIZE,delayMs:{assetCheck:1000,generate:5000,finalize:1000}}`，仅当 SIMULATION_CONTROLS_ENABLED=true 时允许。未启用而传入该字段返回 400。每个延迟范围 0–30000 ms，默认值来自配置。入库保存该任务快照，后续改默认配置不改变已受理任务。

失败注入在对应步骤进入后、完成前触发；同阶段可先经过设定延迟以便观察，failureCode=SIMULATED_FAILURE，原因例如“模拟生成阶段按演示配置失败”。不随机失败。允许 0 延迟用于测试，业务顺序与 DB 边界仍完整；页面不保证观察到每一个极短中间态，以 steps 记录核验。

## 事务与提交

校验与 INSERT 在一个事务中完成后投递，接口返回 202 Task，不等制作完成。可在 worker 启动前已返回 QUEUED，也可已进入 RUNNING，但响应必须是真实记录。模拟耗时不能计入受理等待；不以硬性毫秒 SLA 代替这个结构性要求。

前端禁用提交只能防同一请求重复点击，不承诺受理幂等。POST 网络结果不确定时先刷新历史，提示“提交结果未确认”，不自动重发。记录可按 createdAt 辨认；精确幂等 token 是非目标。

## 重启边界

Java 启动、对外健康就绪前，扫描 QUEUED/RUNNING，统一标 FAILED、failureCode=INTERRUPTED、reason=服务重启导致任务中断，请重新提交；running 步骤写失败，尚未开始保持 NOT_STARTED。无当前阶段则 failedStage=null。不是自动续跑，也不是原题强制项，而是避免历史永久卡住的选择。

优雅关闭停止受理并等待当前任务一个有限窗口，剩余任务下次启动按中断处理。只支持单后端实例，该扫描不能用于多实例部署。已成功/失败任务不得被启动清理修改。文件卷与 DB 同时丢失不在恢复承诺内。
