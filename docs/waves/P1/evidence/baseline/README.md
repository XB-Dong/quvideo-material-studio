# P0 同条件浏览器基线

任务P1-BASE（Leader委派给Acceptance），派发基准eb8df6661bc4da4f4946e1eb79d730e43200844a；实际产品源码基准07300db74eefe5d8d1ecf979de314450bf5f2a78，二者frontend/backend产品树相同。主站P0重建/健康后测量，采集期间未部署P1且Leader暂停CPU密集构建。

工具提交0fa127d359735b1ab229ff6da9e567b0895c6643；容器imageId sha256:3a512680e6e906ac8071c7f748da12bbdb25dbdcdc5e99c9f536416773d8cd52。Node22.22.0固定digest、Playwright1.58.2、Alpine Chromium149.0.7827.53、Noto CJK字体；前后测量应复用此浏览器依赖层。软件WebGL ANGLE SwiftShader，不冒充真实GPU体验。

命令：docker run --rm --mount type=bind,source=<absolute baseline evidence directory>,target=/evidence -e TESTED_COMMIT=07300db74eefe5d8d1ecf979de314450bf5f2a78 material-p1-browser:1.58.2。退出码0。基线目录由Acceptance独占；未修改产品/身份策略/服务/数据库。

三次1440×1000、DPR1、新context+CDP禁缓存、无CPU/网络限速，networkidle后观察8秒；应用经透明TCP转发保留localhost Origin，所有接口响应均非错误。JS请求gzip(level9)归一总量均156375B；图片encodedBody总量均21967B。CLS为0.00010090422453703703、0.00008521739818431714、0.00008841805163724924，中位0.00008841805163724924。长任务数1/0/0，pageerror均0。

原值/时间/资源/长任务条目在measurement.json，截图run-1/2/3.png；截图已view_image检查文字和布局。第一轮长任务是无指针交互的初始加载期间，不直接归因于CSS动画或后续尚不存在的特效。报告区分实际CDP编码传输与JS归一压缩值，不把gzip归一数称为浏览器实际总传输。服务端缓存可预热，客户端每轮禁缓存。

本结果仅供P1前后比较，不证明P1创意、美学、舒适或新页面已通过。最终需按相同浏览器/视口/缓存/网络CPU条件三轮采集，另触发七组件计算全部延后创意体积并实际检查资源清理。


## 图形能力核验说明

后续在同一Alpine镜像的空白页实际核验，canvas.getContext('webgl2')返回null，而pointer:fine为true；default/EGL/ANGLE-GL/Vulkan也不支持。因此本文原“软件WebGL”描述只代表请求启动flags，实际图形环境为WebGL不可用。原始三轮结果仍保留，适合作静态页面字节/CLS参照，不能当有WebGL效果时的公平帧率基线。P1首轮因此没有GL挂载，应记为工具环境限制，不作为产品行为Red。将以支持WebGL的官方浏览器环境重测P0/P1，不能拿两种环境的性能直接比较。
