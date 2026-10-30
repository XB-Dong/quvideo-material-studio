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

## 性能诊断与大文件选择方法

interact的4MiB样例先存真实容器磁盘，再由同一真实filechooser选择路径，浏览器走本地文件机制而非Playwright小buffer转base64/atob注入。A/B实测原buffer方式在createObjectURL前611–729ms，磁盘路径0longtask；上传实际4194304B、480×640 JPEG保持。原失败不删除，禁止因此删除大文件测试。

diagnose-upload-transport.mjs与diagnose-route.mjs仅诊断，trace不算舒适通过。measure可用P12_MEASURE_PAGES=studio、P12_TRACE_LAYOUT=1限定3轮并记录节点rect/API时序/DOMready定位CLS；正式默认仍三页九轮、所有原阈值。不得用筛选诊断代替完整预算验收。

affected-review.mjs只在全部无截图采样结束后运行，供有界差异审图：真实延迟模板响应的loading/ready、产品原260ms公共桥WAAPI暂停于70/150/230ms观察后恢复并清理、真正coarse上下文首次触摸chooser与取消保图。相位截图明确属于受控审图，不证明默认时序性能。稳态main对比等待真实p12-page-in有限动画结束，规定8px入场不能误报成布局塌陷；原CLS逐轮门槛仍由measure独立执行。此辅助入口不加入六项CI聚合重复执行。

## 原生离屏事件前置

lifecycle.mjs只在像素功能检查使用只读lifecycle-observer审计，不用于无截图性能。保留原200/250ms快照；确认几何离屏后，恰一次普通viewport screenshot（fullPage=false、animations=allow），随后500ms内必须收到本轮该真实产品observer的false事件，立即保留data/CSS/Animation.pending/currentTime/ready并执行0个running无限动画断言。restore同样要求本轮true且恢复动画。定时器25ms只读轮询，不请求补充RAF帧；缺事件明确是trigger prerequisite失败，仍exit1，无循环截图/手工暂停。slot焦点、前台/非reduce/dialog0和task emphasis/服务端仍RUNNING|QUEUED都须真实成立。仅该活动任务模拟fixture调整为4+10+2=16秒，防自然终态假绿；seed35秒deadline、原预算/业务路径不变。diagnose-lifecycle.mjs保留原checkpoint前后证据供复现。

## CI 首次提交长任务诊断

diagnose-submit.mjs严格保留原chooser/取消/替换/移除、4MiB真实路径、READY后立即真实submit顺序，从大文件选择前启动CDP trace，只追踪首次提交/受理/卡片插入。不跑后30秒求绿；trace/CPU采样只用于归因，不作为舒适门槛通过。完整trace与公共构建chunk在ignored raw，不能把诊断开销当普通性能或删掉原CI长任务。原无截图interact不改。

## 品牌与日期显示

brand-review.mjs只用于用户授权品牌corner的有界审图：桌面/375，纯中文唯一疏影Link、键盘/真coarse首tap、header92/76、原x32/16与无溢出。随后另context核对3条日期与原zh-CN本地calendar显示一致；整个浏览器退出后才启动全新原interaction浏览器，不给性能预热Intl。原25项accept的品牌check内同步固定这些语义/几何，不增加重复完整测试。品牌独立G01由Reviewer实读截图，未替代日期/性能G02。
