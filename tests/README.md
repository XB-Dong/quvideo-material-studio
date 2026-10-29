# 独立 API 验收

此目录由独立验收角色编写，使用 Python 标准库 HTTP 客户端访问真实服务，不导入前后端实现。所有运行在容器内，无 pip 依赖。PNG 由测试用 struct/zlib 原创生成；只使用匿名合成身份。

## 入口

```text
docker build -t material-acceptance ./tests
docker run --rm --network <compose-network> -e BASE_URL=http://frontend:3000 -e APP_PUBLIC_ORIGIN=http://localhost:3000 -e TESTED_COMMIT=<integrated-sha> material-acceptance
```

Compose 集成时使用此 Dockerfile 的默认 CMD：`python -m unittest -v test_api`。BASE_URL 是容器网络地址；APP_PUBLIC_ORIGIN 是应用实际允许的浏览器来源，两者可能不同。真实服务应已健康，启用模拟配置，使用本地演示 HTTP Cookie 设置。

## 覆盖与边界

八组用例覆盖分类/模板/封面、会话 cookie、真实上传/非法素材、参数/Origin 校验、202 提前受理及无查询执行、三个指定失败阶段与中断、并行持有多个任务与 activeOnly 分页、个人历史与资产/结果隔离、终态重复查询。

套件不驱动重启或停止共享服务；重启中断、浏览器断网交互、375px、键盘与焦点、CI 和备份恢复由主 Agent 安排独立操作并记录。API 黑盒通过不等于 UI 用例通过。失败保留具体 HTTP 响应与断言；网络/启动失败不能当作业务 Red。套件会写入演示数据库中的匿名合成记录和小图片，建议使用独立测试卷。
