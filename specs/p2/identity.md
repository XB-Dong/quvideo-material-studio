# P2 用户与账户契约

specVersion：P2-1.0.0，准备规格。用户已明确选择“注册、登录、退出及账户设置；保留访客体验”。这是用户指定的最终开发范围；原题R-10允许匿名身份，不能倒称旧匿名实现为未做身份隔离。当前下面的注册/登录/账户设置尚未实现。

## 用户可见流程

- 未登录可直接浏览、上传、提交、看本访客历史。顶部清楚显示“访客”及登录/注册入口，不再只藏在“当前身份”说明里。
- 注册：昵称、邮箱、密码/确认，成功后成为注册账户，当前访客userId不变，已有上传、排队/运行/完成任务保留；会话令牌轮换。注册重复提交由前端锁与DB唯一约束处理，升级撤销该user的全部旧访客sessions后签新token。
- 登录：邮箱+密码；返回该账户的个人记录。登录已有账户不自动合并当前访客作品，提交前提示这个边界；原访客后台任务仍由Java执行，不因换账户取消。
- 个人中心/账户设置：昵称、登录邮箱、当前账户状态、个人作品入口、修改昵称、校验当前密码后修改密码、退出。邮箱是本地登录标识，不声称已邮件验证；不显示密码/哈希/token。
- 退出：服务端撤销当前会话并返回新访客身份，立即清理旧账户界面、缓存/未完成请求及私有预览。重新登录同账户可恢复其后台记录。
- 保持已认可浅色界面/动效、语义表单和原生dialog焦点/ESC/错误反馈；密码管理器autocomplete正确，提交锁和错误恢复明确。

原题账户示意中的账单、会员、订阅、第三方条款体系不扩成业务。当前选择包含已登录改密码，不包括邮箱找回密码/发信验证、第三方账号、删除账户/作品；不渲染不可用假按钮。如需上述能力另列真实范围，不能假称已实现。

## Java API（冻结后实现）

原GET/POST /api/session继续可用，旧匿名场景保持。Session保留userId/displayName/expiresAt，增加kind（GUEST/ACCOUNT）、email（访客null）、emailVerified（本地账户false）。后端实际响应总带新字段；前端Session类型可以兼容旧fixture缺字段并按GUEST归一，不能删原行为断言来编译通过。

| 接口 | 输入 | 成功/失败语义 |
| --- | --- | --- |
| POST /api/auth/register | displayName,email,password；当前有效访客cookie | 201 Session；原user升级，原历史不搬家；唯一邮箱冲突409；非访客409；字段错误400 |
| POST /api/auth/login | email,password | 200 Session+新cookie；撤销当前cookie对应session后换为目标账户；不存在/错密码统一401 AUTH_INVALID，不返回凭据细节 |
| POST /api/auth/logout | 当前cookie，无userId | 200新GUEST Session；旧cookie对应服务端session撤销；未知/过期会话也可安全落到新访客，不恢复旧账户 |
| PATCH /api/account/profile | displayName | 200 Session；仅ACCOUNT可用，访客403 ACCOUNT_REQUIRED；邮箱只读，昵称不改变owner |
| POST /api/account/password | currentPassword,newPassword | 200同ACCOUNT新Session；错旧密400可理解原因；撤销此账户全部旧sessions后签新会话；旧密码/旧token均不可用 |

Next同源消费路径：Frontend独占frontend/src/app/api/[...path]/route.ts的PATCH导出扩展，继续调用现有lib/proxy通用method/body转发，不改原GET/POST。Backend实现PATCH /api/account/profile后，Acceptance必须通过localhost前端入口验证账户200、访客403、过期401、非法字段400、Origin403及错误code/cookie透传，不能只测Java直连。此为启动后的开发任务，本轮不修改route。

所有写接口沿用同源Origin检查/HttpOnly/SameSite=Lax/Path=/与配置Secure；凭据不放URL、localStorage、日志或返回JSON。服务端从session识别user，不信请求userId。

## 持久化与验证

计划Flyway V4新增一对一account_credentials：user_id外键、唯一规范化邮箱、password_algorithm/iterations/salt/hash、updated_at；users.display_name沿用。旧V1～V3和已有访客/任务无破坏性重建。Leader先冻结V4编号再明确转交Backend独占该文件。所有SQL由MyBatis参数绑定，邮箱唯一冲突正确回滚，不能留下半注册状态。

邮箱trim/lowercase，最大254字符并作基本格式校验；昵称trim后1～30字符；密码12～128字符，服务端限制请求长度且不静默截断，确认密码在前端验证。邮箱所有权未验证必须在说明与界面语义中准确呈现。

密码拟采用JDK PBKDF2WithHmacSHA256、600000迭代、至少16随机盐字节、32字节派生值；算法参数随hash存储，比较用constant-time方法。绝不能用当前session用的单次SHA256来存密码。未知邮箱执行等价dummy校验；登录失败按规范化标识与来源作有界单实例节流（5次失败/5分钟，TTL清理及容量上限），成功不误计失败。新cookie使用现有安全随机32字节token，DB仅存其SHA256。实现阶段记录实际算法成本，不在主线程UI做密码派生。

事务保证注册升级+凭据+session轮换一致；登录/退出/改密码的旧session撤销与新session建立一致。改密码后其他浏览器旧token401，不影响已经受理的后台任务。升级迁移可在旧数据副本验证，不运行于用户当前产品卷；回滚使用V3/V4匹配备份，不能直接用V3旧程序读取新库后声称已验证。

## 前端生命周期保护

所有身份转换在持久Provider共享单一串行锁与generation，不能只锁表单。关闭弹窗/切路由不允许第二个并发认证mutation的Set-Cookie覆盖；仅忽略JS回调不能阻止浏览器接受旧cookie。动作开始即停止旧query、清空私有预览/上传临时URL并使旧响应失效；服务端成功才落新Session并按userId重新取历史。离页、旧401、迟到注册/登录、双击、退出途中查询返回不得污染当前身份。

写请求结果未知时不自动重发注册/登录/退出/改密；以GET /api/session恢复真实身份，区分网络错误与认证错误；AUTH_INVALID的401不能当作现有访客会话过期，必须按错误code避免误派session-expired。改昵称保留当前owner和任务，仅更新展示。保留现有任务提交锁、上传version/controller与终态合并；确需providers/types/API错误处理变更由Leader显式转交Frontend，审新测试与旧保护全保留。

## 必需行为证据

Java：正确/错误输入、唯一邮箱并发、PBKDF2盐/算法与正确/错误密码、事务回滚、注册保留访客历史、登录旧cookie撤销、注销后旧token401、账户/访客权限、修改昵称/密码及其他会话失效、跨user task/asset/result仍404、旧库V4升级与空库。

前端：显式入口、注册/登录/退出/改资料/改密码成功与失败、双击锁、身份切换时迟到401/查询/提交/上传不串、未知响应恢复、刷新/重新登录恢复本账户记录、键盘/375px、密码不进入缓存。独立验收包括两个账户+访客并存、一个账户后台运行中切换再登录、旧cookie失效和私有媒体不可读。

官方参考（2026-10-30核对）：[OWASP密码存储](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)、[会话管理](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)。这是本地作业账户方案，不冒称已完成生产账户服务审计。
