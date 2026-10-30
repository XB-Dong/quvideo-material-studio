# P2 前端交接

- rootTaskId / taskId：P2-FE-USER；specVersion：P2-1.0.0。
- 精确执行基线：`8c9f91af73d0ad5203162b504856b9f02b2990d6`；分支：`codex/p2-frontend`。
- 实现提交：`43ce903d1f188d3015ad2fee3d3a82eddede0204`（持久身份锁及代理）、`ec0b286dd152ee98f591149d9a7da6104fa18414`（账户界面及校验）。
- 执行环境：Windows PowerShell，所有项目检查在 Docker 容器；作者模型、推理设置无法核实，均为 `null`。
- 本交接为作者自查，不能替代独立验收或 Leader 的完成签署。

## 实现与边界

明确显示访客身份与登录／注册入口；账户表单按需懒加载。注册提示保留当前访客作品，登录提示不合并访客作品。新增 `/account`，提供个人资料、昵称、密码、个人作品入口及退出。沿用原生 Link、既有 Modal 的焦点／ESC 与视觉，首页其他内容及水墨、字标、页脚未改。

原会话初始化、重试与注册／登录／退出／改密／昵称共用持久身份串行队列。视图关闭或路由变化不撤销已经发出的 Cookie 写请求，也不会放行第二次身份写入；旧响应仍按代际失效。切身份清除私有查询与会话数据，昵称修改保留所有者代际。未知写入结果仅用 GET session 核对，不自动重发 POST。`AUTH_INVALID` 是表单错误，不派发会话失效事件。PATCH 复用原通用代理。

昵称 trim 后按 Unicode code point 计数 1–30；密码保留原始字符，按 code point 计数 12–128。不用 HTML 的 UTF-16 minLength/maxLength 阻止合法 emoji。密码只存在当前表单和请求局部变量，不持久化、记录或加入查询缓存；请求完成清空当前密码输入。服务端仍为权威校验。

修改路径：`frontend/src/components/providers.tsx`、`shell.tsx`、`account/**`、`account-lifecycle.test.tsx`、`account-forms.test.tsx`、`frontend/src/app/account/**`、`account.css`、`frontend/src/app/api/[...path]/route.ts`、`frontend/src/lib/{api,types}.ts`。原上传、提交、轮询与会话保护测试没有修改。

## 实际检查

所有时间为 2026-10-30，UTC+08。检查目录为已分配的 managed worktree `C:/Users/dongx/.codex/worktrees/p12-submit-frontend/杭州小影AIcoding`，未启动／重启共享服务。

| 命令 | 时间与结果 | 范围 |
| --- | --- | --- |
| `docker compose -p p2-fe-test -f compose.yaml -f compose.test.yaml run --build --rm --no-deps frontend-check` | 首轮 lint 发现测试 Probe 在 render 中赋值，exit 非 0；改为 effect 后重跑通过 | 作者测试写法修正，没有削弱断言；该轮精确时刻未单独留存，不补造 |
| 同上 | 17:24:05 左右，exit 0 | lint、TypeScript、53 测试（原48 + 账户生命周期5） |
| `docker build -t p2-fe-author --target runner frontend` | UI 首稿阶段，exit 0 | Next 生产构建、类型检查及含 `/account` 的静态入口生成；完成时刻未单独记录。最终 UI 提交的整合构建由 Leader 统一执行，避免重复构建 |
| 同上 frontend-check 命令 | 17:30:55–17:30:59，exit 0 | lint、TypeScript、58 测试（原48 + 生命周期5 + 表单2 + Unicode校验3）；日志位于忽略文件 `runtime-p2-fe-check.log` |
| `git diff --check` | 17:31 左右，exit 0 | 无空白错误 |

新增行为覆盖：初始化／重试与认证共享锁，消费者关闭后不解锁；AUTH_INVALID 不清访客；未知注册只 GET 恢复、不重 POST；昵称不重置身份代际；旧 401 不污染新账户；emoji 长度与确认密码；完成后清空密码。

## 验收入口与限制

Header：`登录 / 注册`；账户链接 accessible name 为 `账户设置`。弹窗标题 `登录疏影账户`／`注册疏影账户`；字段 `昵称`、`邮箱`、`密码`、`确认密码`；按钮 `登录账户`／`注册并保留作品`；沿用 `关闭对话框` 和 ESC。账户页字段 `昵称`、`当前密码`、`新密码`、`确认新密码`，按钮 `保存昵称`、`修改密码`、`退出登录`。表单 `aria-busy` 与全局身份锁一致。

作者未进行真实后端联调、跨浏览器 Cookie 注入、移动端截图或性能预算验收，未声称这些通过。服务端吊销旧 session、注册同 userId、权限隔离与真实迟到 Set-Cookie 由独立验收使用整合栈验证。账户表单按需加载，没有新增运行时依赖，但最终 JS 数量仍需整合产物核验。没有推送远端、改配置／CI／契约或操作邮箱。
