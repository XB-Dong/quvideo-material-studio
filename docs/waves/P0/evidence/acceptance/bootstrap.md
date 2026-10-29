# 独立验收入口准备记录

日期：2026-10-29；执行角色：Acceptance；基准：0d2627243e1a8e86eb33f5f975d202cf56d135b3；规格：1.0.0。

已创建 tests/test_api.py 八组黑盒用例与不依赖 pip 的 Python 容器入口。测试使用真实 HTTP、独立 cookie jar 和原创有效 PNG，不导入产品实现。覆盖范围和未覆盖部分见 tests/README.md。

## 实际命令与结果

- `docker manifest inspect python:3.12.12-slim --verbose`：失败，Docker Hub registry 连接等待超时；基础设施失败，不是业务 Red。
- `docker pull python:3.12.12-slim`：成功，取得 digest sha256:f3fa41d74a768c2fce8016b98c191ae8c1bacd8f1152870a3f9f87d350920b7c，已锁定 Dockerfile。
- `docker build -t material-acceptance:local ./tests`：退出 0。
- `docker run --rm --entrypoint python material-acceptance:local -c ...`：对 test_api.py 执行 ast.parse、模块导入、生成 PNG signature 断言，退出 0，输出 PASS。
- `git diff --check`：退出 0。

所有项目代码检查均在容器内执行。此记录证明测试入口可构建和加载，不证明业务套件通过。17:24+08:00 时产品尚未集成，实时 API 八组测试保持 not_run；UI、重启、备份、CI 未由此入口验证。
