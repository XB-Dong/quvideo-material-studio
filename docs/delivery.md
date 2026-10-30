# 部署、备份与回滚

日常启动和配置以根README为入口。下面命令使用Bash，所有SQL、文件归档和应用执行均在Docker容器；宿主机只做Docker编排与文件重定向。默认项目名`material-studio`，目录中不要放真实用户数据或凭据。需要HTTPS部署时配置真实数据库密码、APP_PUBLIC_ORIGIN与SESSION_COOKIE_SECURE=true；本作业不要求公网部署。

## 部署

从约定验收commit或带SHA256的源码ZIP获取完整应用。初次运行`docker compose up --build`，检查三服务健康、模板本地图片和成功/指定失败/历史恢复闭环。Flyway首次创建V1～V4，已有V3仅增加账户扩展，不覆盖旧模板或任务。升级前保存配套代码/镜像及数据库、文件成套备份，不能把健康端点当作业务验证。

## 一致备份

下面以已启动的默认项目为例，备份目录在源码仓库之外。停止backend阻止新写入，再导出数据库和文件；备份含个人记录、会话哈希及用户上传，不提交Git或附在交卷材料中。

```sh
mkdir -p ../material-backup
docker compose stop backend
docker compose exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump -uroot --single-transaction --no-tablespaces "$MYSQL_DATABASE"' > ../material-backup/db.sql
docker run --rm --user 0 --volumes-from "$(docker compose ps --all --quiet backend)":ro --mount type=bind,src="$(cd ../material-backup && pwd)",dst=/backup --entrypoint sh "$(docker compose images --quiet backend)" -c 'tar -C /data/materials -czf /backup/files.tgz .'
docker compose up --detach --wait backend
```

另记录`docker compose images`、验收commit、配置版本和备份时间，配置凭据单独安全保存。后端重启会把遗留非终态任务标记为INTERRUPTED失败，不会自动续跑；已经成功/失败的终态保持。

## 隔离恢复与版本回退

先在**新的项目名和空卷**恢复，避免直接覆盖仍可使用的旧实例。选择与备份schema匹配的源码目录/镜像，数据库配置须与备份一致。以下示例将恢复实例放在3303；执行前确认该端口空闲，`material-restore`没有旧卷。不要在普通回滚中删除原项目卷。

```sh
export FRONTEND_PORT=3303
export APP_PUBLIC_ORIGIN=http://localhost:3303
docker compose -p material-restore build backend frontend
docker compose -p material-restore up --detach --wait mysql
docker compose -p material-restore exec -T mysql sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -uroot "$MYSQL_DATABASE"' < ../material-backup/db.sql
docker compose -p material-restore run --rm --no-deps --user 0 --volume "$(cd ../material-backup && pwd):/backup:ro" --entrypoint sh backend -c 'tar --no-same-owner -C /data/materials -xzf /backup/files.tgz && chown -R 10001:10001 /data/materials'
docker compose -p material-restore up --detach --wait --wait-timeout 240
```

检查旧身份/任务/图片、成功制作、失败中断及私有资源隔离后，再安排切换入口或对应端口。版本回退必须同时选择匹配的schema和文件备份；尤其V4账户扩展不能仅退前端或删除V4迁移记录。若需要原端口，先停止旧前端，再以对应配置启动已验证实例，旧库和文件卷保留至确认恢复。

这些是可复用操作步骤；本轮实际执行到哪里、使用何种合成数据和结果，见[验收说明](submission/VERIFICATION.md)。未在真实生产环境演练，不宣称零停机发布。

## 交付

默认给招聘方源码ZIP，不依赖其能读取私有仓库；完整前后端、锁文件、SQL/种子、本地素材、CI和Compose保留。包内不含.git、.env、构建缓存、数据库或上传目录。导出策略见[源码包范围](submission/SOURCE-PACKAGE.md)，最终包SHA256和验收commit由仓库外版本清单给出，避免提交自引用。

提交由作者在原沟通渠道手动完成，最多6附件、单个小于100MB，交卷后不可改。P2没有更改仓库可见性、联系招聘方或替作者交卷。未来公开完整Git历史前仍需处理原题资料、邮件截图与私人路径披露；本次过滤后的源码包不等于历史已经清理。
