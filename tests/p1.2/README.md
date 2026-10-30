# P1.2独立验收

构建上下文tests，Dockerfile p1.2/Dockerfile；复用p1精确Playwright锁，不改原共享helper。所有执行仅容器。TESTED_COMMIT必须是实际部署40位SHA，使用BASE_URL localhost3000与TCP relay到RELAY_HOST（Docker host或frontend）。输出挂载ignored runtime，脚本/应用SHA分别记录。

目前入口measure.mjs对首页、制作、历史各3轮（后两页每轮固定seed2成功+1失败）；baseline-actions.mjs记录旧版真实chooser/取消/离页URL释放基线。complete/naturalWidth异步前置使用事件等待，禁止即时断言把未ready当坏图。budgets.test.mjs沿用原4个行为守卫。

图片CDP Image或image MIME覆盖CSS/fetch/bitmap真实网络与重复请求，内嵌data:image载体字节也计图片预算；绝不去重/中位数代替逐轮门槛。首JS192215、延后122880、图819200、CLS.1和errors0维持。大合法用户上传成本另列、原图预览成本保留，不能把其从事实记录删除。

示例运行：docker run --rm -e TESTED_COMMIT=<actualSHA> -v <absolute>/tests/p1.2:/checks/new:ro -v <raw>:/evidence material-studio-browser-p11-check /checks/new/measure.mjs。需Node22/Chromium149/Playwright1.58.2同driver条件。最终accept/lifecycle/visual/interact入口将在集成应用后执行；当前基线不证明P12产品通过。

## 完整CI入口

- accept.mjs：原22项与P12真实chooser/取消/键盘同图、上传并发/旧响应/清除/失败、路由桥/前进后退/快连点/私有URL清理，共25项。图片前置事件等待保留原像素标准。
- visual.mjs是统一聚合器：原5项子页像素/refetch/dialog/reduce + lifecycle2项离屏/恢复 + thumbnail1项认证/原图 + coldPreview6项冷加载/取消/错误/reduce/路由/401清理 + boundaries2项真实框架错误/重试，共16项。不得再在CI重复执行四helper。
- interact.mjs：无截图/无trace栈的真实连续路径、原生chooser上传/取消/替换/移除、4MiB合法JPEG尾padding的真实传输（不冒称20MP性能）、受理/任务/原图预览/身份/历史/30秒常态。
- measure.mjs：三页各3冷上下文，固定两成功一失败，全图片逐请求与JS/CLS守卫。
- --test budgets.test.mjs：4个原预算行为守卫。
- native-visibility.mjs：独立Dockerfile.headed+Xvfb真浏览器标签切换覆盖三页，实际ready条件后才切换，hidden RAF0/GPU0/动画暂停/公共overlay清理。

预计上述一次5–7分钟，不含首次镜像网络构建。独立lifecycle.mjs、thumbnail.mjs、cold-preview.mjs入口只供有界复现；正常统一由visual调用。cold独立CLI默认诊断，REQUIRE_COLD_CHECKS=1开启与聚合器相同的严格几何/显影检查。所有harness版本/应用SHA与失败需分开记录。synthetic.storage-state.json仅显式本地SAVE_SYNTHETIC_STORAGE_STATE=1才写，默认CI不写认证状态，不可进入Git/CI普通artifact。

fixtures用原API验收35秒全任务有界deadline，并记录每ID状态/阶段/version/steps时间线，避免把共享单队列其他会话的长任务阻塞当成自身模拟耗时；不因此改变预算或业务等待规则。
