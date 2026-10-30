# P2 账户实现独立源码审核

rootTaskId：P2-AUDIT；specVersion：P2-1.0.0；Reviewer：p11_design_review；actualProvider/model/reasoning均为null。初审集成源`63f2318592a2e50349e4ae37b7f4d1e08d4e9319`，原执行base `8c9f91af73d0ad5203162b504856b9f02b2990d6`；账户UI补读源`8c0f6c614e8a4002e7ac993e6b3f64bc2eb5cd86`。只写指定审核/交接文件，未运行项目、容器或浏览器，未commit。

## 已读实现及判断

已读P2-AUDIT包、identity/API与角色契约，Java AccountApi/AccountService/Identity/PasswordHasher/AuthThrottle/Db/RequestFilter/Errors/V4及账户作者测试；前端Providers/API/types/session-generation、Next catch-all PATCH、账户dialog/settings/validation/header样式及生命周期作者测试。作者26/53/58等测试结果由作者提供，本报告不将它们写作独立运行。

Java注册在事务中锁原user并二次require，凭据唯一约束、昵称、旧sessions撤销和新session一起提交；cookie在事务返回后才写响应。注册保留userId，任务/素材owner不搬迁。登录锁目标账户后重新读取凭据，成功才撤销当前cookie对应session；错误凭据不撤销原身份。READ_COMMITTED及lockUser flushCache避免锁后沿用旧MyBatis查询。改密同账户锁后校验旧密，替换hash/撤销全部旧sessions/签新session同事务；logout未知cookie也得到新访客。Profile仅ACCOUNT且不更换owner。MyBatis参数绑定、V4一对一/唯一邮箱与旧表增量边界明确。

密码使用JDK PBKDF2WithHmacSHA256、600000次、16随机盐字节及256位派生，参数随凭据保存、MessageDigest.isEqual比较；无邮箱执行dummy派生。session仍随机32字节token、DB哈希，响应没有hash/token字段。节流按规范化邮箱与服务端remoteAddr组合键，失败5次后429、5分钟TTL及10000容量上限；这是单实例约束，不声称分布式/精确终端IP防护。未来若变更算法参数，当前verify只接受本固定算法/次数，需要单独设计兼容迁移，不能借此声称已支持自动rehash。

Provider模块级identityTail涵盖初始化/重试/认证/恢复，即便组件重挂也串行cookie写请求；busy同步ref防双击，未因关闭视图abort正在写cookie的fetch。generation在身份动作开始推进并清个人query/session，旧数据和旧401按generation失效；AUTH_INVALID不广播session-expired，合法失败可恢复原身份。未知POST只尝试GET session，不自动重复原写请求；恢复失败保留错误/恢复入口，不能将提示当作已知道服务端结果。nickname-only更新不推进owner generation，保护原上传/制作。此前准备发现的PATCH导出已真实加入同源route，继续通用proxy，不改变GET/POST。

UI代码有明确访客/登录注册/账户设置入口、注册保留作品/登录不合并提示、邮箱未验证说明、昵称/邮箱和改密/退出。表单label、密码管理器autocomplete、确认密码、Unicode code point校验、busy禁用、提交后清密码都有实现。未加手机号、邮箱验证、账单或不可用功能按钮。设置页身份转换时旧账户内容随session清空；真正Cookie覆盖、响应迟到、媒体清理与焦点/375px仍须独立实际验证。

## 结论与必须保留的运行边界

**本轮源码审阅未发现可直接证实的开放blocking/major实现缺陷，可进入独立集成验收；不等于USER/CORE/CI/G01/G02通过。** 账户首稿UI仅源码审阅，未看到真实页面或GIF，不能给美学分数。没有以缺少作者测试覆盖推断功能一定错误，也没有新增无关业务需求。

Acceptance应重点保留：两账户+访客真实cookie隔离、注册升级保留正在执行任务、重复邮箱/同guest并发升级、旧token及他人媒体拒绝、改密其他会话失效；初始化/重试与认证重叠、关闭弹窗/路由后仍串行、旧401/上传/提交迟到、未知POST与GET恢复失败再恢复；真实前端Origin PATCH及错误code/cookie、V3副本升级/空库、最终新候选全部原检查。模块串行锁只作用于同一页面JS模块实例，不宣称跨标签页/设备分布式锁；新登录多上下文操作按实际Cookie语义记录限制。

来源分发发现见provenance-review.md，尚待Leader清理后复核；该处置独立于账户代码审查。本报告后续仅按明确新候选/真实证据补受影响审核，最终逐条报告/包/GIF由P2-REVIEW另审。

## 1b账户画面有限独立审图

已实际用view_image查看独立Acceptance提供的6张PNG：`runtime/p2-1b38655/account-review/{desktop-register,desktop-account,desktop-header,mobile-account,mobile-header}.png`及`runtime/p2-1b38655/account-375.png`，绝对来源根为`C:/Users/dongx/.codex/worktrees/p11-acceptance/杭州小影AIcoding/`。同时读取account-review.json，testedCommit为`1b38655d71a8f9c9001d7402d4adf12ee7d35cf4`、capturedAt=`2026-10-30T09:54:05.231Z`；不是以当前后续文档HEAD冒充截图源。

画面使用合成example.test账户、空密码输入；桌面注册是实际空表单dialog，分隔/字段/主操作清楚，背景退后而不压表单。账户设置桌面资料/密码两栏、退出独立一行，纸白卡片与墨灰标题、淡紫线/操作延续首页，邮箱未验证说明及作品入口可见。375px资料/密码/退出自然堆叠，输入/按钮未被截断；两张不同合成状态的375图分别显示默认设置与改密完成提示，信息层级稳定。字标没有因账户入口重新变回徽章，页头保留呼吸感。未见需新增blocking/major的构图/可操作性问题。

独立JSON记录桌面1440/scrollWidth1440/header92、小屏375/scrollWidth375/header76/coarse=true；注册ESC还焦点为true。这些来自Acceptance真实运行，不冒称本Reviewer自己点击过。静态图无法证明默认动画节奏、密码提交、Cookie覆盖、错误恢复、所有键盘路径或物理手机表现；截图工具退出也不等于后续性能通过。

**所见账户稳定画面的有限美学审核通过**：桌面注册及桌面设置五维（构图/贴合/配色/节奏/留白）4.5/4/4.5/4/4.5，小屏设置4/4/4.5/4/4.5。这里节奏仅指稳定界面的信息与操作排序，没有多帧证据，不签动画时序。未提供的小屏注册、登录错误/忙态等画面不以这组截图代验；全站G01/G02、USER、最终CI/包/87条报告及真实GIF仍待独立完整结果。

1b上游未用源码/OGL清理没有改账户表单或真实运行Orbit，来源发现已在provenance-review源码层关闭。当前不新增产品修改建议，不启浏览器或容器。
