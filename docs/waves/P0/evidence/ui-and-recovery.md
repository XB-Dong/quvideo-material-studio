# 浏览器与恢复验证

日期：2026-10-29，+08:00；应用代码基准 4328a3b9518c6ce572e796d29ce4496805be28f0。浏览器为本机 Codex in-app browser，真实访问 localhost:3000；未用接口日志冒充浏览器操作。

## 实际页面操作

选择“创意图片”后只显示旅行明信片/三格故事，恢复全部后四模板可见。进入宠物肖像，用真实文件选择器上传仓库 pet.png，观察上传中、预览和提交解锁。提交后“任务已受理”并可再次提交；完成后预览对话框打开，Esc 关闭，焦点返回 aria-label=预览宠物肖像 按钮。连续两任务结果各自保留；刷新页面从 Java 恢复两条历史。

桌面测试设置1280×900，DOM测得 innerWidth=1280、scrollWidth=1265，无横向溢出，详情左制作右历史；小屏375×812测得 scrollWidth=360、上传控件存在且通过真实选择器再次上传 portrait.png，提交/历史仍可操作。恢复默认视口后继续。截图保存在 ui/，主要为真实成功与小屏历史；截图捕获较状态变化滞后，不把成功截图冒充处理中证据。处理中/排队以实际 AX 观察和独立 API 证据佐证。

原生全页 screenshot 接口一次返回无法捕获，改用已支持的 getScreenshot 成功保存。一次恢复按钮点击时页面已自动恢复、按钮已消失，读取当前 AX 确认提示消失；没有盲目重复点击。

## 查询异常与硬重启

17:52:21 使用 docker compose kill -s SIGKILL backend，前端保留原 QUEUED 卡片；点击刷新后显示“查询暂时异常，保留上次状态”，没有把任务直接写为制作失败。恢复 backend 后点击恢复查询，读到 Java 的 INTERRUPTED 失败；旧成功记录保持，随后查询异常提示消失。

重启前直接从 MySQL 读到：046630c2… SUCCEEDED/FINALIZE；e3050a57… RUNNING/GENERATE；88ba9c44… QUEUED/null。重启后相同记录为：SUCCEEDED、FAILED/GENERATE/INTERRUPTED、FAILED/null/INTERRUPTED。两个活跃状态都被启动收束，终态未回退。88ba9c44…是浏览器创建的任务，页面显示可理解中断原因。

辅助长任务脚本原先预期第一个任务仍运行，但实际操作时它已完成；停止该辅助等待器，依据杀进程前后真实 SQL 与浏览器记录核验实际运行/排队任务，不将辅助器标为通过。无产品功能修改。

## 合成备份恢复

17:55 停止 backend 后，在 mysql 容器 mysqldump --single-transaction --no-tablespaces 导出 material_studio，恢复到隔离 schema p0_restore_check_20261029；tasks、assets、task_steps 数量对比返回 1/1/1。用只读挂载 material-files 的临时后端镜像 helper 打 tar，再解到临时目录，逐文件 cmp 全部通过，输出 FILE_BACKUP_RESTORE_PASS。随后 backend 恢复健康。

这里只验证本地合成数据的备份与恢复，不声称生产部署/生产回滚已进行。未删除产品库或命名卷；没有真实用户数据、token或SQL备份进入Git。
