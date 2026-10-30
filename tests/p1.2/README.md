# P1.2独立验收

构建上下文tests，Dockerfile p1.2/Dockerfile；复用p1精确Playwright锁，不改原共享helper。所有执行仅容器。TESTED_COMMIT必须是实际部署40位SHA，使用BASE_URL localhost3000与TCP relay到RELAY_HOST（Docker host或frontend）。输出挂载ignored runtime，脚本/应用SHA分别记录。

目前入口measure.mjs对首页、制作、历史各3轮（后两页每轮固定seed2成功+1失败）；baseline-actions.mjs记录旧版真实chooser/取消/离页URL释放基线。complete/naturalWidth异步前置使用事件等待，禁止即时断言把未ready当坏图。budgets.test.mjs沿用原4个行为守卫。

图片CDP Image或image MIME覆盖CSS/fetch/bitmap真实网络与重复请求，内嵌data:image载体字节也计图片预算；绝不去重/中位数代替逐轮门槛。首JS192215、延后122880、图819200、CLS.1和errors0维持。大合法用户上传成本另列、原图预览成本保留，不能把其从事实记录删除。

示例运行：docker run --rm -e TESTED_COMMIT=<actualSHA> -v <absolute>/tests/p1.2:/checks/new:ro -v <raw>:/evidence material-studio-browser-p11-check /checks/new/measure.mjs。需Node22/Chromium149/Playwright1.58.2同driver条件。最终accept/lifecycle/visual/interact入口将在集成应用后执行；当前基线不证明P12产品通过。
