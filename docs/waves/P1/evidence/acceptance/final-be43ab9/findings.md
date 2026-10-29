# be43ab9 独立浏览器验收发现

实际应用SHA be43ab9ee1c70b0fc648978b99f0e944015c0c67；Chromium149.0.7827.53+实际可用SwiftShader，1440×1000/DPR1，CPU/网络不限速。不是硬件GPU性能结论。

## ACCEPT-PERF-01 major / open

触发：正常进入/移动后离开Glow或画廊，使组件卸载并同步调用WEBGL_lose_context.loseContext。无截图、无Playwright trace的专门脚本interact.mjs复测仍出现主线程长任务。

预期：特效不产生可归因>50ms长任务，真实操作保持响应。实际：直接计时loseContext，Glow退出131.3ms（对应135ms longtask），Halftone56.1ms，Pixel76ms。getContext/compile/link/parameter/texture/draw调用未见>50ms；因此不能把全部卡顿归于截图读回。raw interaction-performance.json、phases与native调用计时可复核。

已向Leader和Frontend报告，待其实现/能力降级方案与新部署后复验；不能以美学分或关闭全部创意代替。软件环境限制必须明确，强制软件七项功能证据不能代签该环境舒适通过。

## 验收工具和场景修正

第一次完整GL预验29pass/1fail，Electric固定60ms采样太早；在600ms合法事件窗口内轮询已捕获真实active Electric。七项分别有active截图/GL或Orbit位移，见相邻final-be43ab9-recheck目录。

第二次29pass/1fail发生在静态切换前提：它紧接受控context-lost及多次切换，Pixel未能重新活跃，可能已进入低FPS降级。静态用例改为新页面独立正常初始状态，仍要求切换前真实active GPU，切换后GPU0/RAF0且刷新持久化；不删断言。

第一次无截图性能采样默认文件名被第二次覆盖，第一次关键数值从真实工具输出恢复到interaction-performance-first.json，明确标reconstructed/null timestamp；第二次raw完整保存。后续各次独立输出目录。

## 已通过范围与限制

真实上传、连续两个任务、指定查询503保持任务原状态/恢复、指定GENERATE真实失败、刷新恢复/预览/终态停轮询、三模式浅色布局/内容/无技术注释/dialog焦点/404已在实际部署上执行。初始性能三轮JS gzip归一166199B（比P0+9824B）、图519086B、CLS中位0.0001466627，页错误0，见performance/measurement.json；后载实际请求JS gzip总52569B，预算通过。

受控visibility fixture不冒称真实后台Tab；headless多Tab visibility仍visible，Root将原生补。整体舒适门槛当前**未签署通过**，需性能major闭环和最终SHA复核。美学由独立Reviewer签署。
