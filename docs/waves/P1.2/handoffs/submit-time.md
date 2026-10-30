# P12-HISTORY / PERF-02 时间显示热点修复

- baseCommit: fabdb38fc0ed8f948cef8b4e77dccdf401f23059
- worktree: p12-submit-frontend；branch codex/p12-submit-frontend
- specVersion: P1.2-1.0.1
- role: sole Frontend；actualProvider/model/reasoning=null，继承会话

只替换History time内容的toLocaleString调用为visual/task-time.ts本地Date getters+padStart2，仍用原createdAt构造Date，保浏览器本地时区、MM/DD HH:mm和午夜00；time.dateTime原ISO、API/日期数据、任务状态与轮询完全不动。无Intl formatter创建/提前warming，无依赖或样式修改；无效日期保Chrome旧Invalid Date文本。

已读独立8a-submit-first/ready-order CPU诊断：两次限定复现的post-202 commit段中约29–32ms热点命中格式化回调/样本column19943。此优化针对已定位热点，不将诊断69/61ms等同原CI76ms完整来源，也不声称优化后真实交互已过50ms；需Leader部署后独立同无截图路径复验。

隔离Chromium149实际核对UTC/AsiaShanghai/AmericaNewYork，15有效样例含跨年/跨日/DST和3无效样例，getter文本与旧zh-CN全部一致；证据task-time-locale-check.json。不访问或预热应用，非性能通过。

容器frontend-check lint/typecheck/48tests（原41+7）通过，exit0；新7单测覆盖2位padding、午夜、本地年/月/闰日边界和3非法输入。同一测试分别TZ=UTC与TZ=Asia/Shanghai容器各7/7通过，防UTC切片错误。没有改原测试/业务lib/包锁/Java/CI/样式，未启动/重启服务或push；生产build与最终性能由Leader集成验证。
