# P1.1独立浏览器验收

使用tests为Docker上下文：`docker build -f tests/p1.1/Dockerfile -t material-p11-browser tests`。镜像锁Node基础digest，复用P1锁定的Playwright1.58.2依赖；产品构建/安装/执行仅容器。

容器入口分别为 `accept.mjs`（品牌/真实卡片/触屏/上传多任务与查询异常/刷新/终态停止）、`visual.mjs`（真实软件默认擦雾清晰度/边框像素/四卡/生命周期）、`interact.mjs`（无截图性能与30秒连续运行）、`measure.mjs`（三次冷浏览器逐轮预算）。每个入口必须设置TESTED_COMMIT为实际已部署的40位SHA。BASE_URL默认http://localhost:3000，RELAY_HOST本机host.docker.internal或Compose内frontend，OUTPUT_DIR默认/evidence。证据目录挂载到ignored runtime。

示例：`docker run --rm -e TESTED_COMMIT=<exact-sha> -v <absolute-runtime-dir>:/evidence material-p11-browser accept.mjs`。Docker启动后内部localhost:3000 TCP转发到产品3000，以保持同源与原业务Origin校验。不要并发多个脚本到同一证据目录；无需修改共享服务。

measure按CDP Image类别或image MIME计算全部真实响应encodedDataLength，包含CSS/fetch/ImageBitmap与重复URL，包含头开销保守计量。内嵌data:image在HTML/CSS/JS中的encoded literal bytes也计入图片预算；载体成本继续保留，不能用inline逃预算。每轮都保存请求明细与JS gzip(level9)，不以中位数代替守卫。所有延后请求单独在interact记录，限122880B。截图/像素读回仅用于visual功能，不冒充舒适性能。

P1旧gallery/手动按钮专属验收不再适用；业务块从原独立验收保留并继续运行。美学评分由另一Reviewer完成；本目录测试通过也不单独代表最终G02，仍需真实后台切换/源审核与邮件作用域实际证据。native-visibility.mjs复用原生CDP真标签切换，在带Xvfb的headed镜像运行（不覆写document.hidden）；仅default路径。预算守卫回归用 `node --test budgets.test.mjs`。

## CI生命周期诊断

visual独立启用audit({traceRaf:true})，最近256个RAF注册/执行/取消事件、pending callback名称/注册stack与媒体change事件有界保存；reduce断言之前先写reduce-before-assert.json，失败也保留a/b、motion-static/Orbit/媒体。其他脚本不启用stack采集，无截图性能仍不使用visual日志。DIAGNOSTIC_CPU_RATE仅用于显式CPU降速的功能诊断，报告记录真实rate，不作为性能通过证据。diagnose-raf.mjs以12次真实resize/离屏/回顶/reduce与0/16/100ms时序诊断；不覆写媒体状态，不增加固定等待或放宽RAF0。
