# 集成版本独立 API 验收

- caseIds: INT-01/API 部分、INT-02/API 无查询执行部分、INT-03、INT-04/身份隔离部分、BE-05/06 部分
- requirementIds: R-02、R-03、R-04、R-05、R-06、R-08、R-09、R-10
- specVersion: 1.0.0
- testedCommit: 620eb4a8778b9399c31e980fcc19df0919b393a5
- testSourceCommit: 43e2f0c23abade2ce81bb17b5fcb704665da9a15（测试源码和固定镜像版本；后续为文档）
- actor: Independent Acceptance
- environment: Docker Desktop Linux containers，material-studio_default 网络，frontend:3000 → Java backend:8080 → MySQL 8.4.13
- startedAt: 2026-10-29T09:40:35Z（17:40:35+08:00）
- suiteElapsedSeconds: 11.840
- exitCode: 0

## 实际命令

```text
docker run --rm --network material-studio_default -e BASE_URL=http://frontend:3000 -e APP_PUBLIC_ORIGIN=http://localhost:3000 -e TESTED_COMMIT=620eb4a8778b9399c31e980fcc19df0919b393a5 material-acceptance:local
```

运行期间未启动、停止或修改共享服务。使用已经健康的真实三服务，写入仅为合成匿名身份与 PNG。

## 实际结果

```text
test_01_public_catalog_categories_and_local_images ... ok
test_02_identity_is_backend_cookie_and_reused ... ok
test_03_upload_actual_file_validation_and_private_read ... ok
test_04_submit_parameter_validation_and_origin ... ok
test_05_accepts_before_generation_and_executes_without_queries ... ok
test_06_each_failure_stops_subsequent_steps ... ok
test_07_multiple_tasks_active_pagination_and_history_refresh ... ok
test_08_foreign_tasks_assets_results_are_private ... ok

Ran 8 tests in 11.840s
OK
```

## 结论与边界

八组真实 HTTP 用例全部通过：验证了本地封面、分类过滤、匿名 cookie、实际上传字节、非法素材/参数与 Origin、202 在长生成未完成时返回、四秒期间无查询仍完成、三阶段记录与各阶段失败中断、多任务和 activeOnly 分页、终态重复读取稳定、个人历史与他人任务/素材/结果隔离。

这次运行没有观察到业务失败。没有验证浏览器 UI、实际断网提示、轮询停止/用户竞态、重启、备份恢复、干净卷初始化或 GitHub CI；这些需各自证据。代码审阅发现 FE-REV-01/02 的修复尚在进行，API 通过不能将其标为解决。
