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

accounts-browser.mjs现已按实际UI语义实现（仍未运行）：375真实触摸chooser与注册保留、键盘进入设置、昵称/密码/错误与退出重登录；跨路由真实SetCookie锁；真实200+SetCookie但截断body的未知结果GET恢复；真实已执行后abort的未知结果不重POST；真实已撤销cookie迟到401；迟到上传与已受理任务清理/继续。gates增加延迟实际执行GET，确保401来自被撤销旧token，不伪造身份；所有网络门控不进无截图性能。未知JSON截断只模拟不可读响应，真实账户写入与cookie来自服务器，证据必须如实说明。失败消息仅首行且合成secret脱敏，request headers/body不落报告。

## 精确源码ZIP比对

verify-archive.py可选--source-tree-index <JSON>，格式sourceCommit=精确候选SHA、files=[{path,blobOid,type:blob,mode:100644或100755}]。索引必须由Acceptance独立读取git ls-tree -r --full-tree -z <精确SHA>生成，不能拿Root打包entries当独立Git树来源；Git元数据读取可在宿主，应用/测试不在宿主运行。校验器无需容器内Git，计算SHA1(blob+空格+文件字节数+NUL+原字节)逐文件对比；archive comment读到的精确commit也必须匹配。

ZIP自身package-policy由精确Git blob对照约束；expected为Git所有非政策排除文件，导出不准缺文件/多未跟踪文件/改字节。硬性禁止政策排掉frontend/backend/tests/.github/assets及根运行/许可入口；私有协调/题面/邮件图/用户报告、原RB许可、本地demo/ink、素材重做输入与来源分别检查。curated来源不含cachePath/本机Windows路径，合法https不能误报成本机路径。无索引仅结构检查，报告completeSourceComparedToGit=false，不能称完整源码验证。标准Git archive README-only数据探针实读40字节commit comment；不是最终候选或CLEAN。

archive_checks_test.py仅合成ZIP/JSON数据，容器stdlib unittest测试正常导出、字节篡改、少资产、夹私有文件、错commit、政策擅排tests与cachePath七类行为及entries/oid索引schema兼容，实际8/8 exit0；不运行任何应用/浏览器。最终候选到来后仍需真实校验+新解压空卷运行，不能用这些数据测试替代。

## 已执行状态与最终媒体取证

前文待运行是历史设计：冻结81a3de8候选已完成独立ZIP逐blob比对、新解压空卷API8/浏览器8及V3→V4升级。实际失败/命令见P2 handoff。首页初稿全帧审核发现尾段第二处未充分回雾（P2-FINAL-02），原WebM/GIF及诊断保留。仅重录首页一次：MEDIA_HEADED=1，run-media-headed.sh在官方工具镜像启动Xvfb并等socket就绪，Chromium使用镜像捆绑版本。真实两路径不变，尾指针移到排除区header10,10，自然等待6000ms；只读canvas同坐标初始/清晰/尾部像素与edge，普通viewport截图animations=allow提供一次实际render机会，再无输入flush1500ms。没有更改产品fog/blur/alpha或复制静帧。common默认headless不变，账户CI不受媒体变量影响。

同一WebM仅trim前2.2秒无输入段，10fps、1200×750；home最终18.9秒/189帧/18367297B，creation仍15.66秒/188帧/12086707B。inspect-media.mjs全周期decode，media-all-frames.mjs逐帧连续6×6分镜；diagnose-media-tail.mjs只读比较同坐标WebM/GIF压缩前后，不把编码时钟与JS时钟假设为固定偏移。两片合计377帧12板，审阅称全帧序列审核，不称原生实时播放/硬件流畅实测。所有原视频/分镜只存仓库外，最终两GIF及脱敏清单在规定路径。
