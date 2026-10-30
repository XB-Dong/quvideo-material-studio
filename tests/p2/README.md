# P2 独立验收与媒体工具

状态：脚本实现中，尚未对P2候选运行；不能将脚本存在视为通过。base8c9f91af73d0ad5203162b504856b9f02b2990d6，rootTaskId P2-VERIFY / P2-MEDIA，契约P2-1.0.0。产品冻结/ZIP与独占窗口由Leader提供。旧P11/P12/FE/Java/API门槛保持，不重写其共享helper。

两个Dockerfile构建上下文均tests：p2/Dockerfile为原精确Playwright锁+Alpine Chromium/CJK，账户/浏览器功能；p2/Dockerfile.media为官方Playwright1.58.2镜像digest+同锁+ffmpeg/CJK，仅录制转码，使用捆绑Chromium（不设置Alpine executablePath）。所有运行/安装/编码只在容器。无需新产品依赖。CI仅执行独立验收，不自动生成GIF。

配置：TESTED_COMMIT是40位实际部署SHA；BASE_URL默认http://localhost:3000，APP_PUBLIC_ORIGIN默认BASE_URL.origin；RELAY_HOST默认host.docker.internal，RELAY_PORT默认3000。BASE_URL=http://localhost:3301时自动本地监听3301→RELAY_HOST:3000；隔离Compose网络可将RELAY_HOST设frontend服务名。RELAY_ENABLED=0用于工具能直接访问BASE_URL的环境。不能只改Origin却继续向旧3000产品发请求。OUTPUT_DIR仅挂ignored/仓库外脱敏证据。

accounts-api.mjs通过前端同源入口验真实账户/访客和三步任务，错误PATCH400/401/403与200均走Next；不直连Java。合成密码/随机example.test邮箱、cookie仅内存，输出不含cookie值/密码/hash。检查逐项停止在首失败，后依赖步骤不冒称运行。完整源码包独立空卷验证、浏览器竞态与迁移仍需后续运行，不能以HTTP验收代替。

## 浏览器独立设计（待集成选择器冻结后落实）

1. 访客真实上传/连续任务→注册保原user/原记录；另账户乙/访客登录甲不合并；在Java运行任务时切换再登录恢复。
2. 注册/登录/退出/改昵称/改密，重复点击真实POST数为1；合适autocomplete/label、错误恢复、375px/键盘/焦点。账户AUTH_INVALID不触发访客session-expired。
3. 用真实route.fetch执行认证请求后持有真实response（保留Set-Cookie）再跨路由，发起第二认证动作必须被持久Provider锁阻止；释放后GETsession与Cookie实际一致。不会伪造cookie值或仅看JS回调。
4. 查询/上传/任务POST旧响应与旧401分别持有，开始身份转换即清旧私图/blob/任务；释放后不能覆盖新用户。未知POST由服务端真实执行后浏览器中断返回，要求GETsession恢复、绝不自动再次POST。
5. 身份对话框/关闭/路由不释放全局认证锁，改密使其他浏览器旧会话401，私有预览无旧帧；原query错误≠任务失败/终态停轮询不减。

## 真实GIF设计（性能全部结束后）

home-ink：1440桌面约14秒真实连续pointer输入，两个背景区域、停留/回雾，保留真实卡片/边框；工具录制指针辅助仅绘制鼠标位置、不改变产品clear/fog/mask。creation-history：真实选择仓库fixture、上传、受理/Java阶段/成功、历史/原图与另一失败记录约20秒。模拟延迟明确记录，不能假改阶段或拼接顺序。真实WebM原录制存仓库外，ffmpeg palettegen/paletteuse约10fps/GIF目标20MB/硬限100MB；记录版本/源SHA/动作/fps/时长/尺寸/帧数/字节/hash，成片只写规定两个路径。Reviewer全段播放独立审核，GIF不代替断言。
