# P11-ACCEPT：异步图片前置条件修正

原rootTaskId P11-ACCEPT。Run41004518076失败在accept的desktop Java cards stable IDs，尚未进入visual，不是reduce复现。原acceptance.json逐字保留ci-41004518076-image-fail.json。

根因：页面模板Link存在并不证明图片已完成异步下载/解码；旧断言立即读取complete/naturalWidth，错误地把未ready判成坏图。没有产品bug证据，不重启页面掩盖，也不降低naturalWidth>0与complete标准。

唯一owner转交为tests/p1.1/accept.mjs。修正为先使真实图片进入视口触发lazy，再等真实load/error事件，complete且naturalWidth>0才通过；同步已完成图直接检查，坏图即时拒绝，最长5s有界且卸事件/清timer。没有盲加sleep或放宽标准。

IMAGE_READINESS_SELF_CHECK=1通过同一waitForImage实现执行受控验证：页面真实img响应先gate再延迟500ms，旧即时表达式为false；正常真实JPEG响应完成后complete=true/naturalWidth>0；另一200但损坏JPEG必须拒绝。容器material-studio-browser-p11-check执行，TESTED_COMMIT64e919，exit0，结果ci-image-readiness-check.json。500ms是测试HTTP响应延迟，不是生产验收等待，正常测试使用事件。未跑整个suite，也不冒称完整远端通过。

原reduce未知问题和其他修复计数保留，本图片异步前置根因仅修正1次；P12后续脚本复用事件前置原则。产品/CI/锁未改，未push或重启服务。
