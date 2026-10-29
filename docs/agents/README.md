# 多 Agent 角色与协作

用户已授权P1实现、验证与交付。P1使用[专用角色表](../waves/P1/ROLES.md)：Leader、Frontend Visual/Creative/Motion、Asset Integration、Test/Acceptance和只读Reviewer；以下通用角色定义保留P0职责背景，实际派发按活跃波次路径和所有权，进度见[P1报告](../waves/P1/REPORT.md)。

准备阶段只定义角色和任务，不运行开发 Agent。P0 启动后使用一主最多三子，默认模型/推理设置继承会话；不继承旧项目具体型号。工作树在主 checkout 外，通过 app 管理，分支用 codex/ 前缀。只读审查无需可写开发工作树，但必须限定读取与输出路径。

| 角色 | 角色文件 | 职责与边界 |
| --- | --- | --- |
| Leader | [主控](leader/ROLE.md) | 契约、共享配置、依赖、调度、所有权、集成、最终报告 |
| Frontend | [前端](frontend/ROLE.md) | frontend/ 与其自身行为测试，前端 Dockerfile |
| Backend | [后端](backend/ROLE.md) | backend/、迁移与自身测试、后端 Dockerfile |
| Test/Acceptance | [独立验收](acceptance/ROLE.md) | tests/ 和分配的证据；不覆盖实现者测试 |
| Reviewer | [专项只读审核](reviewer/ROLE.md) | 释放席位后读指定 diff/契约，输出发现；不改产品 |

所有角色共享 [协议](PROTOCOL.md)。任务包位于对应docs/waves/<wave>/tasks/，未授权时不得派发。模型实际provider/model/reasoning无独立证据则null，不通过自述确认。
