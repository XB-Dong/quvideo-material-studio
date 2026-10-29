# 原生标签隐藏诊断与验证

应用源码716518e6087fbb0ec17abf55b4b68f00cd327a84；Leader执行，独立Acceptance复验另记，本文不自签独立舒适门槛。实际结果见native-visibility.json：容器headed Chromium149.0.7827.53、Xvfb、原生CDP，两个目标的Browser.getWindowForTarget窗口ID相同，Target.activateTarget切换真实标签。页面没有覆盖document.hidden或手工派发visibilitychange。

默认策略：切前Orbit1/GPU0；条件GPU功能fixture：切前Orbit1/真实GPU1。两者隐藏后均收到isTrusted=true的visibilitychange，document.hidden=true、Orbit0、GPU0、RAFpending0；重新激活后visible、Orbit1。fixture只模拟已释放Worker允许消息，原软件renderer保留；不冒充硬件性能或物理Windows/IAB最小化。

环境诊断：Playwright1.58.2的实际容器源码playwright-core/lib/server/chromium/crPage.js:412在自己的session启用focus emulation。另建session关闭模拟仍不能解除原session的影响，headed两页在同window仍保持visible，不能算产品后台失败。最终工具直接在容器启动Chromium、使用原生CDP创建页面，避免Playwright页面模拟。官方[Emulation协议](https://chromedevtools.github.io/devtools-protocol/tot/Emulation/)与[Target协议](https://chromedevtools.github.io/devtools-protocol/tot/Target/)为命令依据。

原生工具第一次在新incognito context尚无窗口时使用newWindow=false，返回“no browser is open”，没有进入产品断言；failure.json保留。改为首目标显式新建窗口、控制目标同窗口新标签后退出0。这里的环境失败没有作为产品Red。

复验工具及有界Xvfb启动入口交接给Acceptance纳入tests/p1；独立执行结果与最终舒适清单以其交接报告为准。原xvfb-run readiness卡住和Playwright隐藏未发生的尝试亦由Acceptance保留。
