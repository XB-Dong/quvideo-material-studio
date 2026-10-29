# 核心验收场景

版本：1.0.0。以下是待执行测试设计，编号用于证据追踪。

| 用例 | 层级 | 场景与断言 |
| --- | --- | --- |
| BE-01 | JUnit | 用可控 sleeper/handler 执行三个步骤，断言顺序、开始/结束边界与成功结果；查询不调用 handler |
| BE-02 | JUnit 参数化 | 三个阶段分别注入失败，当前步失败、后续未开始、失败阶段/原因入库、终态不回退 |
| BE-03 | Service/事务集成 | 阻塞 worker，用 latch 证明受理先返回、记录已提交，再释放 worker；回滚时不派发 |
| BE-04 | 集成 | 队列满、结果写盘失败、素材丢失均可解释收束；查询不存在任务无副作用 |
| BE-05 | MySQL 集成 | 两用户交叉 taskId/assetId/media 读取与提交均 404；持久化后重建查询服务仍有历史 |
| BE-06 | 上传集成 | 正常 JPEG/PNG、超大小、数量错误、重复 assetId、伪 MIME/损坏图、路径文件名、尺寸超限 |
| BE-07 | MySQL 集成 | 启动中断收束非终态，成功/失败不受影响；迁移与种子第二次启动不重置历史 |
| FE-01 | Vitest/RTL | A/B deferred 响应乱序，A 失败 B 成功，卡片/错误/结果始终独立 |
| FE-02 | Vitest/RTL | 后台 RUNNING 遇 GET 500，仍是运行态且显示查询异常，恢复后得到成功；服务端 FAILED 才显示制作失败 |
| FE-03 | 假计时器 | 单任务终态停止，其余任务继续；全部终态无轮询；卸载清理；请求无重叠；活跃任务超过一页时全部恢复 |
| FE-04 | deferred/假计时器 | 用户 epoch 切换及迟到旧响应不能写入新缓存；低 version 不能覆盖终态 |
| FE-05 | RTL | 上传替换/移除时旧请求返回无效；失败不 READY；提交条件、202 解锁和连续提交 |
| FE-06 | RTL | 历史首次失败与有数据后失败区分；未知 POST 结果不自动重复提交；重试入口能恢复 |
| INT-01 | Compose | 干净卷首次启动三服务、迁移、种子、模板封面与预置结果可用 |
| INT-02 | Compose/浏览器 | 上传 → 202 → 关页等待 → 重开历史成功预览，刷新活跃任务继续变化 |
| INT-03 | Compose/浏览器 | 连续三任务：慢成功、指定 GENERATE 失败、排队成功；展示阶段、时间与结果各自正确 |
| INT-04 | Compose/浏览器 | 网络暂时阻断 GET，界面不变成制作失败；恢复查询；无痕窗口无对方记录 |
| UI-01 | 人工浏览器 | 列表分类、双栏详情、空/加载/失败、375px、小键盘 Tab、预览 Esc/焦点返回 |
| CI-01 | GitHub Actions | push/PR 的 lint/typecheck/test/build 与 Java verify、真实 MySQL 集成均有对应提交运行记录 |
| DOC-01 | 交付核对 | README 九项、锁文件、初始化、素材许可、备份回滚、验收 commit 和源码可读性 |

后端测试对阶段顺序与副作用做断言，不通过真实长 sleep 等待；异步时使用 latch 和有界等待。集成测试使用真实 MySQL 容器（Testcontainers 或 CI service），不把 mock/H2 测试当 MySQL 验证。前端用 deferred promise 控制竞态，不只测试静态文案。端到端自动浏览器测试不强制，但人工浏览器闭环要记录环境与实际结果。

证据最少包含：caseId、requirementIds、specVersion、testedCommit、环境、命令或操作、起止时间、exitCode（人工用结果）、expected/actual、附件位置。产品未运行时保持 not_run；源码可证明实现与运行结果分开列。
