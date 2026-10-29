# 多 Agent 角色与准备状态

准备阶段只定义角色和任务，不运行开发 Agent。P0 启动后使用一主最多三子，默认模型/推理设置继承会话；不继承旧项目具体型号。工作树在主 checkout 外，通过 app 管理，分支用 codex/ 前缀。只读审查无需可写开发工作树，但必须限定读取与输出路径。

| 角色 | 角色文件 | 职责与边界 |
| --- | --- | --- |
| Leader | [主控](leader/ROLE.md) | 契约、共享配置、依赖、调度、所有权、集成、最终报告 |
| Frontend | [前端](frontend/ROLE.md) | frontend/ 与其自身行为测试，前端 Dockerfile |
| Backend | [后端](backend/ROLE.md) | backend/、迁移与自身测试、后端 Dockerfile |
| Test/Acceptance | [独立验收](acceptance/ROLE.md) | tests/ 和分配的证据；不覆盖实现者测试 |
| Reviewer | [专项只读审核](reviewer/ROLE.md) | 释放席位后读指定 diff/契约，输出发现；不改产品 |

所有角色共享 [协议](PROTOCOL.md)。任务包位于 docs/waves/P0/tasks/，未授权时不得派发。模型实际 provider/model/reasoning 无独立证据则 null，不通过自述确认。若未来需要外部 GLM，先另行决定工具、数据权限与成本，不作为当前隐含门槛。
