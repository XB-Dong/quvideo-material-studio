# P2 Backend账户实现交接

- taskId/rootTaskId：P2-BE-USER；specVersion：P2-1.0.0。
- baseCommit：8c9f91af73d0ad5203162b504856b9f02b2990d6；派发元数据857950cf1eb4e5469246e0b0525998be3c1b990f。
- implementationCommit：9084efd4d75665af8e930edf0b6f9819dff2f4d1。
- branch/worktree：codex/p2-backend；C:/Users/dongx/.codex/worktrees/p2-backend/杭州小影AIcoding。
- role：唯一Backend writer，actualProvider/model/reasoning均null；没有独立验收或Reviewer签署。
- requirementIds：U-01～U-04、R-10.a、R-08.e及账户迁移/会话隔离相关条款。

## 实现

新增AccountApi/AccountService、PasswordHasher、AuthThrottle、V4__accounts.sql与两个作者测试类；仅扩展Identity/Db，原Api、Pipeline、Tasks、V1～V3、依赖、Compose和前端均未修改。五API按冻结契约，Session仅白名单userId/displayName/expiresAt/kind/email/emailVerified，无密码/盐/hash/token字段。

访客注册在同一user上增加唯一规范邮箱凭据，保留任务/素材，撤销其全部旧sessions并新签；已有账户登录不合并访客记录，撤销当前cookie对应旧session；退出撤销当前后新建guest；改昵称保留owner，改密码验证旧密、撤销账户全部旧sessions并重签。cookie在服务事务返回后写，HttpOnly/Lax/Path与Secure配置保留。原匿名GET/POST session继续可用。

JDK PBKDF2WithHmacSHA256，600000迭代、16字节随机盐、32字节派生值，constant-time比较，未知邮箱执行dummy派生后仍统一AUTH_INVALID。登录失败按邮箱/来源哈希，5次失败/5分钟，10000 bucket上限及TTL；成功不计失败。昵称/密码长度使用Unicode codePointCount（1～30、12～128），邮箱trim/lowercase/254基本格式。邮箱未验证，不假称验证或邮件找回。

账户专用TransactionTemplate设READ_COMMITTED，先识别user再锁users行、锁后重新确认cookie/身份/凭据。Db.lockUser明确flushCache=true，避免MyBatis同事务一级cache在等待锁后复用旧session。原任务事务隔离配置不改。

## 实际作者检查与失败

所有构建/测试仅在容器，独立项目p2-be-test，真实MySQL8.4.13；Java21.0.9、Boot3.5.16。命令：

`docker compose -p p2-be-test -f compose.yaml -f compose.test.yaml run --build --rm backend-check`

- 首轮新增PasswordAndAuthTest的var复合声明编译失败，已改为分别声明；不是业务Red。
- 第二轮2026-10-30T17:17:16+08:00：旧18+新增6，共24测试、0失败/错误/跳过，verify及JAR package exit0。
- 追加同guest并发升级及未知/无cookie退出两个行为用例；首次新增Future泛型推断为Object编译失败，改为显式MvcResult，不是产品Red。
- 17:22:26实际行为失败：同guest并发第二请求409，严格预期旧token401。诊断发现MyBatis一级cache复用锁前session；仅在lockUser加flushCache=true，保留401硬断言，没有把409放宽为通过。
- 最终2026-10-30T17:24:35+08:00：**26测试（旧18不删+新增8）全过，0失败/错误/跳过，verify/package exit0**。新增账户集成6、密码/节流2；覆盖正常/非法/冲突/并发、guest作品保留、登录/退出旧token、跨身份素材/结果、资料、改密其他设备旧token失效、回滚恢复、dummy/随机盐和TTL。
- git diff --check通过。格式仅在容器临时使用google-java-format1.25.2，jar SHA256为25157797a0a972c2290b5bc71530c4f7ad646458025e3484412a6e5a9b8c9aa6，不进Git或运行依赖。
- 测试结束仅停止自己p2-be-test的mysql-test，未删除卷、未操作material-studio共享栈。

原始失败/成功日志已复制到ignored runtime/p2-be-author/（runtime-be-check.log、runtime-be-check-2.log、runtime-be-check-final.log、runtime-be-check-3.log、runtime-be-check-4.log及格式日志）。它们含合成测试请求，不提交Git；归档worktree前Leader需保留必要原始证据。开始未另精确计时，派发约17:09，首个已记工具时间17:14，最终检查17:24:35；这不是人类工时。

## 边界和下一步

作者使用MockMvc调用Java+真实MySQL，尚未通过Next同源PATCH或真实浏览器，未宣称独立验收/完整CI/部署通过。V4空库应用和后续校验已实际发生；V3数据副本升级、迁移回滚与干净最终ZIP仍由Acceptance按计划独立验证，不能以本次测试冒称已验证。

Leader cherry-pick实现和本交接后集成；Frontend补PATCH透传并消费新增字段/错误code，保留原身份/上传/任务generation保护。注册/login错误401 AUTH_INVALID不等于当前guest失效，前端需按code处理。原始失败保留，独立Reviewer接管释放席位后审实现；本人未push、未重启共享预览、未改公开状态或交卷。
