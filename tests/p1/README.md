# P1 独立浏览器验收

所有依赖/浏览器与应用执行均在容器。工具依赖锁在package-lock.json，Node基础镜像固定digest；Alpine Chromium准确版本/镜像ID随每次采集记录，前后比较必须复用同一已构建镜像。

```powershell
docker build -t material-p1-browser:1.58.2 tests/p1
# outputPath为宿主机的绝对证据目录；不重建或重启应用
# TESTED_COMMIT填实际部署应用源码的精确SHA
$env:TESTED_COMMIT="<exact-sha>"
docker run --rm --mount "type=bind,source=$outputPath,target=/evidence" -e TESTED_COMMIT material-p1-browser:1.58.2
```

浏览器访问容器内http://localhost:3000，经透明TCP转发到host.docker.internal:3000，保持原有Origin/Cookie策略；不是绕过CSRF。默认视口1440×1000、DPR1、不限CPU/网络，三次新context+禁用缓存，每次networkidle后观察8秒。WebGL指定ANGLE SwiftShader软件渲染，不冒充真实GPU性能。服务端缓存可预热，客户端每轮冷缓存。报告实际CDP/ResourceTiming传输体积，并独立对收到的JS体做gzip level9归一化；此值不是源文件体积或JS总构建产物。

measurement.json记录每次原始资源、响应状态、JS gzip归一值、图片encoded body、CLS条目、长任务条目及截图；不得把初始加载长任务直接归因于特效。静态首页基线不能证明七项创意、交互流畅或舒适门槛通过。最终采集必须先确认部署SHA及运行环境未变化。


`node accept.mjs`提供独立浅色/内容/布局/分类/键盘dialog/制作页/空历史/不存在模板检查。Docker入口可覆盖为`docker run ... material-p1-browser:1.58.2 accept.mjs`；同样需要OUTPUT_DIR挂载和精确TESTED_COMMIT。它会输出acceptance.json和desktop/reduce/mobile截图，失败退出1。脚本还包含四画廊/hero/CTA互动、GPU唯一性/静态清理、真实上传多任务/查询异常恢复/指定后台失败/终态停轮询。后台/离屏/context-lost、实际交互性能和迁移仍需独立取证；所有P1脚本都须在集成部署上实际运行后才有通过结论，脚本存在不构成舒适门槛全过。


图形环境要求：Alpine Chromium将SwiftShader拆为独立chromium-swiftshader包，必须显式安装。只写--use-angle=swiftshader启动参数不代表WebGL可用；采集前用空白页原生getContext(webgl2)和UNMASKED_RENDERER_WEBGL验证实际能力，measure.mjs会保存observedWebGL。旧未安装驱动的基线保留但不能用于有图形效果时的公平性能比较。当前GPU环境Chromium149.0.7827.53、SwiftShader真实renderer已实测，P0/P1需复用同一image和相同参数。


常规 CI 的 Electric 用同步原生 draw 后的 RGBA 样本证明真实存活时绘制、彩色边缘、连续签名变化与大于80%透明区域；该功能性读回会扰动软件渲染，不用于舒适/性能签署。精确600ms合成器五帧以 `EXACT_ELECTRIC_SEQUENCE=1` 单独采集，默认CI报告明确标记未采集；不能用普通CI替代该独立视觉证据。生命周期每项用新的页面状态，finally恢复媒体/偏好，最多5秒等待真实GPU/Orbit/RAF释放；该功能等待上限不是产品效果时长或舒适延迟承诺。

原生后台验证（不使用 Playwright 的 focus emulation）：先 `docker build -t material-p1-browser:headed -f tests/p1/Dockerfile.headed tests/p1`，再用相同 evidence 挂载及 TESTED_COMMIT，`docker run --rm --network material-studio_default --mount "type=bind,source=$outputPath,target=/evidence" -e RELAY_HOST=frontend -e TESTED_COMMIT material-p1-browser:headed`。Dockerfile使用有界10秒的Xvfb socket就绪检查；raw CDP确认app/control同windowId，Target.activateTarget自然切tab，记录browser-trusted visibilitychange和真实GPU/Orbit/RAF释放与恢复；不改document.hidden或派发合成事件。每个CDP请求10秒超时。它证明容器原生浏览器后台生命周期，不证明物理Windows最小化或硬件GPU性能。

`node layout.mjs` 是1280×900两页补充检查：真实scrollWidth、原生cursor、Tab的focus-visible/outline与截图；同样只在上述容器运行。正式Dockerfile.headed默认继承README首先构建的material-p1-browser:1.58.2；本次已建测试环境实际复用了material-p1-browser:gpu同一依赖层，不要求干净用户预先有gpu标签。

`node touch.mjs`提供独立375 touch-only核验：配置hasTouch/isMobile后必须实际断言pointer:coarse true/fine false/hover false与maxTouchPoints，首载起全程只touchscreen.tap，不用mouse移动改变主要输入类型；检查分类→模板正文、GL/Orbit/RAF静态和375无溢出。原accept.mjs的375混合输入实际媒体值保留报告，不能单以hasTouch声称coarse已验。
