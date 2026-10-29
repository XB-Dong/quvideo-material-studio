# 后端独立只读代码审阅

日期：2026-10-29；审阅提交：b7059b153b07d723da0fb7ab6aa1a82e71ab18ca；规格版本：1.0.0；角色：Independent Acceptance 临时承担只读审核。未修改产品源码，未将静态审阅称为运行验证。

## 新发现

### BE-REV-01 结果整理完成与任务成功不是同一事务

- 严重度：major；涉及 R-05/R-06 的失败阶段与步骤一致性。
- 位置：backend/src/main/java/com/quvideo/studio/Pipeline.java 的 run；Processing.java 的 end、success、fail；Db.java 的 failStep。
- 触发：结果文件已整理成功，`store.end(id,"FINALIZE")` 提交后，`store.success(id)` 的数据库更新事务发生可恢复异常；随后失败写入事务成功。
- 实际：FINALIZE 的 task_steps 已是 SUCCEEDED；catch 将 tasks 置 FAILED、failedStage=FINALIZE，但 failStep 仅更新 RUNNING，不能将该步骤标失败。因此界面/查询可同时看到任务在结果整理阶段失败，而全部三步都成功。
- 预期：结果整理步骤成功与任务/resultKey 成功应原子提交；成功持久化失败时结果整理步骤也不能保留成功的矛盾记录。
- 建议：在一个事务中完成 FINALIZE 步骤及任务成功，或采用等价的一致边界；为最终成功持久化故障添加回归测试，验证失败阶段、步骤和任务一致。
- 证据性质：对该准确提交调用顺序与 SQL 条件的静态推导，尚未故障注入运行。已向 Leader 报告，等待处置与复验。

## 已知正在修复的事项

Leader 在派发前已发现 afterCommit 队列拒绝路径复用 REQUIRED 事务的陷阱；Backend 正改为独立新事务，并增加队列饱和回归。SQL 阶段顺序保护也在增强。这两项不是本审阅的新发现，不能在未复核修复提交前标为解决。

## 核对范围与限制

读取 API、MyBatis SQL、身份/上传/私有媒体、受理/后台/模拟、异常处理、迁移、配置及已有测试。模板/历史读接口不执行 pipeline；任务/素材/结果按当前会话归属过滤；图片有真实解码/大小/尺寸检查；受理建记录与 dispatch 用事务后回调隔开。除上述新发现及已知修复项外，本次未发现额外阻断或重大问题。

编译、MySQL 运行及独立 API 黑盒验收由集成后的实际执行验证，本记录不预判通过。
