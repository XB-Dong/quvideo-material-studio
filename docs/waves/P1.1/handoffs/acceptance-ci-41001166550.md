# P11-ACCEPT：CI reduce失败的有界诊断

原rootTaskId仍P11-ACCEPT，规格P1.1-1.0.1。baseCommit 95293c1746a86b7c7d78e5306b43d8884bc13c15。原worktree clean后创建codex/p11-ci-acceptance，未切主分支、重启产品、推送或修改产品代码。模型继承，actual路由null。

CI run41001166550的原visual.json已从下载artifact逐字保留ci-41001166550-visual-fail.json：前4项通过，reduce第5项1 !== 0失败，最后route RAF0且reduce true。该失败报告缺少a/b完整状态与注册来源，因此尚不能确认其RAF属于产品循环还是工具，也不能从末route媒体状态倒推前一步具体状态。远端后续perf未执行，不标CI通过。

已做两组诊断而非盲加等待：

1. 新material-studio-browser-p11-check容器，真实本地应用64e919（与95293c1产品相同），12次resize→真离屏→回顶→真实emulateMedia reduce，开始前间距0/16/100ms，仍500/200ms采样。12次a/b均RAF0、motion-static=true、Orbit0、reduce=true。
2. 完整visual前四像素/卡片交互+同reduce链，CPU4x降速功能诊断，6/6通过，仍未复现。CPU4不是舒适性能证据。没有伪造matchMedia/visibility、延长固定等待、放宽RAF0或删除断言。

本地pass不能证明CI根因已解决。Frontend只读指出Orbit自己onMotion存在缓减，而正常parent unmount应立即取消；无失败stack证实，未据猜测改产品。当前结论为根因未确认，远端门槛仍待完整通过。

提交内容仅增可选有界RAF tracing（默认false、只有visual启用），记录pendingcallback名称/注册stack、最近256事件、媒体change、motion-static/Orbit；reduce断言前a/b写独立JSON并保留失败。visual控制台仅摘要，完整trace留artifact，不影响无截图interact的诊断配置。DIAGNOSTIC_CPU_RATE仅显式诊断时使用，正常CI默认1。此可审补丁用于下一次CI即使重现也有来源证据，不冒称修复了已证实的工具根因。

真实命令：docker run --rm -e TESTED_COMMIT=64e919aac25cacf7f1193b4a361071e5d03ef635 -v <worktree>/tests/p1.1:/checks/new:ro -v <raw>:/evidence material-studio-browser-p11-check /checks/new/diagnose-raf.mjs；完整visual另加DIAGNOSTIC_CPU_RATE=4，均exit0。容器node --check三个改动脚本通过，git diff --check通过。所有运行仅容器。

原始trace在ignored runtime/p11-ci-raf-diagnosis、runtime/p11-ci-raf-full-cpu4，精简结果及逐文件hash在ci-41001166550-local-diagnosis.json。原P11-ACCEPT的三项历史脚本修正不重置；本CI未知RAF根因尚未进行无证据修复，只有诊断观测。下一步Leader集成此诊断补丁、运行完整CI；若重现依据pending stack移交对应产品owner；若再次同根因修正无效达到两次，保持原rootTaskId重新有界诊断，不以不断增timeout结案。
