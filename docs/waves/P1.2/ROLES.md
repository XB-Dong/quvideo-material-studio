# P1.2 多Agent角色与所有权

Leader+最多三子。当前仅独立准备Reviewer，不启动P1.2开发worker/worktree；下表在准备门槛通过后依已获条件式授权派发。继承当前模型/推理，实际provider/model/reasoning无证据均null。

| 角色 | 独占路径/任务 | 责任 |
| --- | --- | --- |
| Leader | BASE/DELIVERY；specs/p1.2、依赖package/lock、CI/Compose、状态/导航/集成/交付 | 版本/类型与基准、预算/来源冻结、共享文件owner转交、集成与最终签署 |
| 唯一Frontend | FOUND→ROUTE→STUDIO→HISTORY→DIALOG；app/layout（视觉包装）、app/template/loading/error/not-found/global-error、components/providers（仅视觉包装）、components/studio/history/shell、motion视觉层、页面作用域CSS/图标、自身测试 | 同一作者顺序实现，所有业务生命周期保持；不改受保护lib/SQL/Java或独立测试 |
| Acceptance | tests/p1.2、专属evidence/handoff | 提前设计，真实动作/多帧/性能/媒体/业务独立验收；新共享helper须Leader显式转交 |
| Reviewer | 分配的reviews文件；产品/测试只读 | 中间子页和最终各场景逐页美学，记录问题与实际复验，不能由作者自签 |

无需新Asset或Backend角色：沿用已认可素材和Java业务。Frontend、Acceptance并行；Reviewer在首个真实子页可审时启用，最多三子，不占空闲角色。套用docs/agents/PROTOCOL.md的精确SHA/specVersion/rootTaskId/有界修复与交接字段。准备文本不授权执行。

保护frontend/src/lib/{api,types,use-tasks,session-generation}.ts和原upload/submission/session/use-tasks测试；Maker/UploadSlot与History虽为视觉owner文件，其业务锁/版本/取消/身份协议不能重写。QueryClient/Identity位置与实例不变。package/lock由Leader修改，若临时转交须记录唯一owner后收回。
