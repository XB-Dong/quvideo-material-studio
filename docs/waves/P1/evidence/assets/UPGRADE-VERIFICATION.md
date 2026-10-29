# 素材升级、回滚与再升级验证

隔离project `material-p1-assets`，端口23010，MySQL和素材卷均是该project专有；没有操作主project `material-studio`。P0镜像`material-studio-backend:p0-07300db`、前端`material-studio-frontend:p0-07300db`；P1后端来自本工作树`cdfd9f513141d2879470c299b8c806f832174a99`的生产源树，镜像`material-p1-assets-backend:upgrade`。前端故意保持P0，仅验证Java资源/数据库兼容，不宣称P1视觉验收。

四阶段实际操作及SHA见upgrade-observations.json；Flyway历史恢复为1/2，再升级为1/2/3见两个flyway文本。初始P0阶段只生成所有者历史结果，外国用户隔离在P1/恢复P0/再P1分别实测；没有把初始阶段未做的foreign检查写成通过。

## 重做入口

以下是Docker编排命令，项目脚本均在工具容器中运行。先从仓库根目录构建工具：

```sh
docker build -f backend/scripts/Dockerfile.assets -t material-p1-assets-tools .
docker run --rm -v "$PWD:/workspace" material-p1-assets-tools python backend/scripts/prepare_p1_assets.py
docker build --target runtime -t material-p1-assets-backend:upgrade backend
```

使用compose.yaml叠加本目录upgrade.compose.yaml且固定`-p material-p1-assets`，默认后端P0，`ASSET_TEST_BACKEND_IMAGE=material-p1-assets-backend:upgrade`切换P1。每次`up --no-build --detach --wait`必须等待健康。客户端命令：

```sh
docker run --rm --network material-p1-assets_default -v "$PWD:/workspace" -e BASE_URL=http://frontend:3000 -e APP_PUBLIC_ORIGIN=http://localhost:23010 material-p1-assets-tools python backend/scripts/assert_asset_upgrade.py p0
```

该客户端后续参数依次为p1、p0-restored、p1-again；测试Cookie仅存忽略的runtime目录，不能入Git。新旧task结果逐次验证服务端URL/字节、所有者和外人404；P1新task必须复制真正的新PNG。

P0步骤通过后停止此project backend，MySQL容器内用`mysqldump --single-transaction --no-tablespaces`保存整个数据库含Flyway历史到`/tmp/p1-assets-p0.sql`；素材卷用工具容器的`shutil.make_archive('/snapshot/files','gztar','/data/materials')`保存至独立snapshot卷。数据库dump与文件archive不进Git。P1检查后再次停止backend，将此dump恢复到同一测试数据库（dump含drop table以恢复包括Flyway在内的原表），文件按下方入口恢复：

```sh
docker run --rm --volumes-from material-p1-assets-backend-1 -v material-p1-assets-snapshot:/snapshot -v "$PWD:/workspace" material-p1-assets-tools python backend/scripts/restore_p1_asset_snapshot.py
```

回切P0启动并验证，再切P1验证；V3必须重新执行。快照以后新记录将从恢复数据库消失，执行前应保留当前匹配备份并说明窗口。本次均为隔离合成数据，无主用户数据窗口。

## 实际发现与修正

首次恢复使用Python tar的安全data filter，文件被解包为root所有、mode0600；Java UID10001读历史结果失败。先检查归属/文件实际存在，定位为恢复权限，不改变业务代码；恢复入口明确chown10001:10001后重做匹配DB/文件恢复，恢复P0与再次P1均通过。该失败保留，不把首次失败包装为通过。源码编辑首次命令遇Windows默认GBK解码，未写成功；使用PYTHONUTF8后正确执行，不把环境错误当行为测试Red。

## 限制

本次验证单机本地卷、演示镜像和合成任务；不支持快照后记录自动合并。P1前端动态/性能由独立Acceptance验证。恢复脚本仅用于明确的/data/materials容器挂载点，不针对任意宿主目录递归操作。工具Pillow11.3.0精确锁定；生成器保留RGB与完整结果构图，原图不足建议分辨率时不无意义放大。
