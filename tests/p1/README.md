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
