# P0 需求验收矩阵

验收代码提交：4dd397f2f5b2cb74ca21aba08482d0cae5b0a0de。2026-10-29 GitHub Actions 的 frontend/backend/integration 三任务均通过；后续封存只更新文档。用例编号表示设计与覆盖方向，实际执行子项以证据记录为准，不把全部防御分支都称为已跑过。

| 需求 | 规格 | 主要任务 | 验收用例 | 实现 | 运行证据 |
| --- | --- | --- | --- | --- | --- |
| R-01 | architecture、data-model、api | BOOT、BE-CATALOG、BE-TASK | INT-01、CI-01 | 完成 | 三服务与真实MySQL；CI绿 |
| R-02 | api、ui、data-model | BE-CATALOG、FE-CATALOG | INT-01、UI-01 | 完成 | 独立API目录/分类/封面；浏览器筛选 |
| R-03 | architecture、frontend-state、ui | BE-CATALOG、FE-CATALOG | BE-06、FE-05、UI-01 | 完成 | 类型/大小/损坏/数量/替换竞态测试；真实文件选择器 |
| R-04 | task-lifecycle | BE-TASK | BE-03、INT-02 | 完成 | 事务/回滚测试、慢任务202、无查询仍完成 |
| R-05 | task-lifecycle、data-model | BE-TASK、FE-TASK | BE-01、BE-02、FE-04 | 完成 | 顺序边界、三步记录、终态稳定、最终事务回滚 |
| R-06 | task-lifecycle、api | BE-TASK | BE-02、BE-04、INT-03 | 完成 | 三阶段失败/后续未开始、队列拒绝持久化 |
| R-07 | frontend-state | FE-TASK | FE-02、FE-06、INT-04 | 完成 | 查询故障保留状态；真实停机/恢复；未知POST不重发 |
| R-08 | frontend-state | FE-TASK | FE-01、FE-03、FE-04、INT-03 | 完成 | 多任务/停止轮询/离页/迟到401/身份及提交代数回归 |
| R-09 | data-model、frontend-state | BE-TASK、FE-TASK | BE-05、BE-07、INT-02 | 完成 | 浏览器刷新恢复、活跃分页、硬重启中断且保留终态 |
| R-10 | architecture | BE-CATALOG、FE-CATALOG、ACCEPT | BE-05、INT-04 | 完成 | 两会话不同Cookie、交叉task/asset/result/提交被拒绝 |
| R-11 | ui | FE-CATALOG、FE-TASK | UI-01 | 完成 | 桌面双栏/375px上传与历史、Tab/预览Esc焦点返回 |
| R-12 | acceptance、delivery | BOOT、ACCEPT、DELIVERY | BE-01/02、FE-01/02、CI-01 | 完成 | 16前端/12Java/8独立API；push CI三任务全绿 |
| R-13 | requirements、delivery | DELIVERY | DOC-01 | 完成 | README/锁文件/SQL/本地素材/报告/投入与AI实例 |
| R-14 推荐/本项目自选 | architecture、delivery | BOOT、ACCEPT、DELIVERY | INT-01、DOC-01 | 完成 | 干净GitHub runner compose构建启动及API通过 |

规格在根目录 specs/；用例见 [acceptance](../../../specs/acceptance.md)。所有任务文件名使用 P0- 前缀，表内缩写用于阅读。每个验证结果应附 testedCommit、环境、时间、命令/操作和实际结果。非目标不列为缺陷；未完成必需项不得改为可选。

证据入口：[集成检查](evidence/integrated-checks.md)、[独立API](evidence/acceptance/live-api-620eb4a.md)、[浏览器/重启/备份](evidence/ui-and-recovery.md)、[CI](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40854073869)、[P0报告](REPORT.md)。超大像素、磁盘耗尽等防御分支没有逐项真实注入，源码实现不冒充该分支运行证据。
