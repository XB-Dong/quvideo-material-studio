# P0 需求验收矩阵

所有产品状态初始为未实现/未运行。准备文档存在不意味着功能完成。实现、验证和证据在 P0 按实际提交更新。

| 需求 | 规格 | 主要任务 | 验收用例 | 实现 | 运行证据 |
| --- | --- | --- | --- | --- | --- |
| R-01 | architecture、data-model、api | BOOT、BE-CATALOG、BE-TASK | INT-01、CI-01 | 未实现 | not_run |
| R-02 | api、ui、data-model | BE-CATALOG、FE-CATALOG | INT-01、UI-01 | 未实现 | not_run |
| R-03 | architecture、frontend-state、ui | BE-CATALOG、FE-CATALOG | BE-06、FE-05、UI-01 | 未实现 | not_run |
| R-04 | task-lifecycle | BE-TASK | BE-03、INT-02 | 未实现 | not_run |
| R-05 | task-lifecycle、data-model | BE-TASK、FE-TASK | BE-01、BE-02、FE-04 | 未实现 | not_run |
| R-06 | task-lifecycle、api | BE-TASK | BE-02、BE-04、INT-03 | 未实现 | not_run |
| R-07 | frontend-state | FE-TASK | FE-02、FE-06、INT-04 | 未实现 | not_run |
| R-08 | frontend-state | FE-TASK | FE-01、FE-03、FE-04、INT-03 | 未实现 | not_run |
| R-09 | data-model、frontend-state | BE-TASK、FE-TASK | BE-05、BE-07、INT-02 | 未实现 | not_run |
| R-10 | architecture | BE-CATALOG、FE-CATALOG、ACCEPT | BE-05、INT-04 | 未实现 | not_run |
| R-11 | ui | FE-CATALOG、FE-TASK | UI-01 | 未实现 | not_run |
| R-12 | acceptance、delivery | BOOT、ACCEPT、DELIVERY | BE-01/02、FE-01/02、CI-01 | 未实现 | not_run |
| R-13 | requirements、delivery | DELIVERY | DOC-01 | 准备工件部分 | not_run |
| R-14 推荐/本项目自选 | architecture、delivery | BOOT、ACCEPT、DELIVERY | INT-01、DOC-01 | 未实现 | not_run |

规格在根目录 specs/；用例见 [acceptance](../../../specs/acceptance.md)。所有任务文件名使用 P0- 前缀，表内缩写用于阅读。每个验证结果应附 testedCommit、环境、时间、命令/操作和实际结果。非目标不列为缺陷；未完成必需项不得改为可选。
