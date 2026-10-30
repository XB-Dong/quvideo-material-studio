# 本仓库CI邮件治理

版本P1.1-1.0.1。用户最新明确“那就不管邮件先”，本项暂缓，不再阻塞推送、CI或本轮完成；以下方案保留供未来用户另行请求，当前不执行。用户已确认仅处理XB-Dong/quvideo-material-studio的CI邮件，必要时使用邮箱定向规则；不授权关闭账号全部Actions邮件。P1.1已启动，实际邮箱接入/生效状态见evidence/ci-mail-execution.json；不发送测试邮件。

## 已核实事实

截图是GitHub Checks workflow run通知。只读REST核对：旧失败40915531767的frontend63秒、backend135秒、integration414秒，与截图1:03/2:15/6:54完全一致；最新封存40925928248/e485三项success，前两轮40923131462/a250与40919563180/e624也success。没有Message-ID/原邮件头，因此是强匹配，不伪称查到具体邮箱消息。失败原因/修复在P1证据保留，不能把旧邮件当当前新故障，也不能称未来不会再失败。

GitHub官方说明Actions可为触发的运行发送邮件，失败/成功/取消等由通知偏好决定。个人通知设置与仓库Watch/提交邮件不是同一机制；workflow.yml没有可据此关闭个人Actions邮件的通用notifications.email字段。网站没有SMTP/发信业务，不为此添加邮件服务。

## 启动后的选定方案

1. 在用户实际接收该邮件的已连接邮箱中，只读查找本仓库Actions通知，核验发件人、实际主题/仓库标记与通知类别。不把截图正文当真实主题头，不假定邮箱一定是Gmail；缺连接时只询问必要的邮箱提供方/连接，不索要密码。
2. 预览严格定向规则：已核实GitHub发件人 AND 精确仓库标记 AND 实际Actions通知特征。正例为本仓库CI失败/成功等通知；反例覆盖其他仓库、人工PR/issue、提及、安全通知。不能只凭github.com域或仓库名全归档。
3. 应用可撤销的“跳过收件箱/归档并加CI标签”，不删除、不标垃圾、不取消其他仓库通知。按确认的范围可处理已匹配历史CI邮件；保留诊断可查与GitHub网页检查结果。这只改变收件箱呈现，GitHub仍可能投递，不能宣称停止源站发信。
4. 同时保持CI真实健康：旧失败留证，新视觉/选择器/预算真实失败必须修复；保留前端lint/type/tests/build、Java/MySQL、API、浏览器及逐轮预算。Leader批量推送可审阅版本，避免每个局部修字都推送；不使用skip-ci、continue-on-error、删失败断言或关闭检查解决邮件。
5. 验证：只用真实既有样本和合成正反例预览，不主动给用户发新测试邮件；保留规则作用域/动作与命中结果的脱敏证据。不把个人地址、完整邮件/退订链接/token存Git；记录账号级Actions设置未变。若实际邮箱无法提供该定向能力，报告具体限制与可导入规则，邮件任务不得虚报完成。

原邮件前置条件已由用户明确暂缓撤销；本轮继续正常推送/CI，不能把暂缓写成邮件已解决。账号级停邮件、其他仓库、营销/安全/人工PR邮件均不在范围。

官方依据：[Actions运行通知](https://docs.github.com/en/actions/concepts/workflows-and-actions/notifications-for-workflow-runs)、[通知配置](https://docs.github.com/en/subscriptions-and-notifications/get-started/configuring-notifications)。当前允许正常推送；CI检查入口可随新视觉契约更新，不修改账号通知开关，不关闭必要检查。
