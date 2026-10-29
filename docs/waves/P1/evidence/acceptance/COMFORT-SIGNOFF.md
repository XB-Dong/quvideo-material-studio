# P1 独立使用舒适度签署

签署角色：Test/Acceptance（原生子Agent p1_acceptance，非前端作者、非美学Reviewer）。rootTaskId P1-ACCEPT；specVersion P1-1.2.0。实际应用源码 **716518e6087fbb0ec17abf55b4b68f00cd327a84**；采集日期2026-10-30（Asia/Shanghai；JSON保留UTC原值）。实际模型路由未知null。

**当前状态：asset_budget_recheck_pending，G02整体签署暂停。** 原716本地清单及功能证据保留；远端CI2新实测图片996880/996880/757983B，前两轮超过800KiB，形成开放major ACCEPT-BUDGET-02。以下历史本地通过不再代表全预算通过，待JPEG优化新SHA复验后重新签署。 此签署不代替独立美学G01、远端CI最终结果或Leader交付签署。真实软件默认路径与七创意功能路径分别验证，不能互相代替。

## 环境和执行

所有浏览器/应用安装、运行和检查在Docker Linux容器内完成；未在宿主安装项目依赖或执行应用。默认测试为1440×1000、DPR1、无CPU/网络节流、Chromium149.0.7827.53、Playwright1.58.2。375×812旧综合测试配置hasTouch/isMobile，但执行page.mouse.move后实际coarse=false；它只证明该375混合输入路径，不当作coarse证据。独立touch-only补测实际coarse=true/fine=false/hover=false/maxTouchPoints=1；另补1280×900。使用实际localhost:3000同Origin TCP转发，未绕过业务身份/CSRF。工具版本见tests/p1/package-lock.json与Dockerfile。

浏览器镜像material-p1-browser:gpu ID `sha256:4c5d985c59a8b4f49ab92da300f865fdf3b580a340021377601c4b4daebbeea6`；空白页实际WebGL2可用，renderer为ANGLE/Vulkan SwiftShader Device (Subzero)。前后基线复用同一驱动/依赖层。headed镜像`sha256:f95b4a9396dcc86e3886f619dd3bd550103ccc5ffb7f7bf8fab0b62412d0fe64`增加Xvfb，不冒充物理GPU。

生产默认Worker实际allowed=false、released=true、reason=software-renderer；主线程不分配效果GL。七创意功能验证以浏览器fixture仅将实际已释放的Worker回包allowed改true，保留真实SwiftShader renderer和fixtureApplied；这是强制允许的功能证据，**不是硬件性能或软件特效舒适证据**。产品无URL/localStorage强制GPU开关。

## 逐项核验

| 舒适项 | 结论与证据 |
| --- | --- |
| 阅读不被装饰遮挡、浅色/蓝紫细节、无前端特效说明 | pass。default目录桌面/375截图；实际body背景rgb(247,248,252)，页面正文无七组件名或鼠标体验引导。Electric专用五帧文字/主次入口保持完整，绘制透明区81%以上，外缘细线。美学评分由独立Reviewer提供。 |
| 原生cursor、键盘focus与对话框 | pass。final-716518-1280/layout.json两页cursor=auto、Tab focus-visible=true、outline=solid。desktop/reduce/mobile实际dialog Escape后焦点返回；结果预览Escape关闭。 |
| 点击/输入/Tab/滚动不阻塞 | pass（默认实测环境）。默认无截图性能脚本实际覆盖hero/四页签/CTA，交互阶段1435.3ms以后无longtask；主GL调用0；最大RAF间隔16.8ms。真实上传/连续提交/恢复查询/预览操作完成。初始197/95ms两长任务单列，不冒称整个页面零长任务。 |
| 无持续闪烁、动画不过度占位 | pass。逐项真实组件draw与Orbit位移；完整页面截图与trace本地观察；Electric仅600ms窗口/独立冷却后触发。强制软件读回会扰动时序，只作功能性证据。 |
| 手动静态、系统reduce、运行时切换和刷新 | pass。default22/0；final-716518-ci-isolated31/0。切换前live GPU>0，切后GPU0/Orbit0/RAFpending0且250ms executed不变；刷新静态偏好保留。reduce首载及运行时零GL。coarse由独立touch-only实际媒体查询证明，旧mobile测试不证明coarse。 |
| 375px/coarse和桌面1280/1440 | pass。final-716518-default截图/JSON与final-716518-1280两页补充。旧mobile实际coarse=false，仅证明375混合输入布局。final-716518-touch/touch.json独立375真coarse首载及touchscreen.tap分类→模板正文：coarse=true/fine=false/hover=false/maxTouchPoints=1，GL分配0/Orbit0/RAFpending0；路由后250ms RAFexecuted保持2不再执行。scrollWidth375，无mouse事件，不依赖hover。 |
| 离屏/后台/静态资源释放 | pass。ci-isolated每项fresh page，切前真实active GPU，等待真实释放后断言GL0；后台另由final-716518-native原生Chrome/Xvfb同windowId双tab自然切换，trusted visibilitychange hidden后Orbit0/GL0/RAFpending0，回到app恢复Orbit。没有注入hidden或合成事件。 |
| 页签/卸载/弹窗/身份与旧请求 | pass。四页签切换旧owner释放且peakAllocated1；原P0 use-tasks/identity保护代码未改，Root最终31前端行为测试含卸载/身份/401/旧请求版本保护通过。真实多任务、刷新、503恢复和终态停止轮询独立浏览器通过。P0行为测试证据属于Root运行，未冒称由本Agent重跑。 |
| 至多两个系统、一个已分配存活GL | pass。Orbit SVG与单个active owner并存，实际peakAllocated=1；六GL逐项实际draw>0并记录owner，Electric接管独立记录。静态0RAF/GL，无额外并行Canvas owner。 |
| 图形不可用/context lost/降级 | pass。真实软件能力检测静态退化、保留SVG/业务；功能fixture内原生WEBGL_lose_context后真实GL释放、poster完整、页签仍操作。低FPS策略的边界/取消由前端行为测试验证；软件renderer未被误当硬件。 |
| 前后包体/图片/CLS与交互trace | asset_budget_recheck_pending：CI2图片前两轮996880B超过800KiB；原本地三轮只描述本地事实，不覆盖此失败。原值如下。默认无截图交互性能和强制功能读回分开。trace.zip仅本地忽略，不入Git以免包含合成匿名Cookie。 |
| P0全部回归及升级/回滚 | pass，采用并核对Root的integration/final-checks.json：31前端含原16、15Java含原12、8API均exit0；源码protected lib diff为空。Asset隔离四阶段真实旧结果SHA一致、恢复Flyway1/2后再升级1/2/3，upgrade-observations.json/UPGRADE-VERIFICATION.md保留首次权限失败和修正。不是将P0旧通过当本次通过。 |

## 七创意与Electric证据

final-716518-functional-verified：31pass/0fail，六GL各自活跃截图与draw>0，Orbit真实位置变化。该轮精确五帧采样使用产品600ms时长，独立warm activation间隔>=2.2秒；采样实际结束476/555/384/366/468ms，全小于600。30ms第一次628ms无效保留；后一次555ms有效。180→350目标帧合成器变化384像素。所有精确截图时间以electric-compositor-sequence.json为准；目标offset不等于实际采样时间。无白块、正文/主次入口未被覆盖的观察交给独立Reviewer复核。

CI1（40915531767）default22通过、functional27通过4失败已保存ci-40915531767/functional-failed.json：Electric截屏1090/766ms越窗；reduce固定150ms等待不够且失败后未finally恢复，污染后续contextloss/static。保留失败，未改产品450/600ms。两次无效采样后重新界定工具：精确截图独立模式；常规CI在原生draw内同步读回live framebuffer，必须彩色像素>0、至少两个不同签名、透明>80%，报告exact序列未采集。每个生命周期新页并finally恢复，最多5秒等真实释放，功能等待上限不宣称舒适释放时延。修正后本地31/0（ci-isolated），Electric draw3/colored2105/透明81.38%/三个不同签名，liveAtCapture=true。CI2由Leader单独跟踪，不在此伪称已经完成。

## 同条件三次原始测量

P0（baseline/gpu-supported）JS gzip156375B三次一致；图片21967B；CLS中位0.00009354383680555556；初始长任务1/0/0。原无SwiftShader驱动基线仍保留并更正实际WebGL不可用，不用于公平GPU比较。

P1（final-716518-startup）：JS gzip168190B三次一致，增加11815B<35KiB；延后创意脚本实际54362B<120KiB（含观察到的Worker脚本）。图片280189/519086/757983B，中位519086B，**最大757983B<800KiB**，不只报中位数。每轮新增重复3张hero图恰为238897B；冷缓存/禁用缓存条件下可观察到4/7/10请求，资源URL/字节原值完整保存，不虚构各次准确DOM触发因果。CLS三次0.00016423611111111112/0.00015758623288001543/0.0001707908347800926，中位0.00016423611111111112<0.1；初始长任务3/1/1，pageerror0。

final-716518-default-performance独立默认无截图/trace采样：主GL0，交互长任务0，最大RAF间隔16.8ms。worker探针893.3ms/release10.5ms在worker，不当作主线程阻塞。原be43软件loseContext同步131.3/56.1/76ms重大舒适发现保留；当前默认软件路径避免这些主GL分配/释放，不用强制软件功能测试替代舒适结论。

## 限制、失败与最终交接

未验证物理硬件GPU性能、物理Windows最小化、多设备FPS。实际原生浏览器后台已验证，不再以受控visibility fixture冒充该证据。硬件允许分支七项绘制和资源释放有真实软件driver功能证据，硬件性能不可由fixture推断。截图/RGBA功能样本不用于性能阈值。

Xvfb首版xvfb-run挂起、Playwright focus emulation导致无法自然hidden的尝试不是产品Red；raw CDP取消框架页管理后有界双tab成功。正式run-headed.sh首次因Windows CRLF sh退出1，转LF后6.79秒两模式通过，根目录gitattributes已规定LF。未删除原失败场景/报告。

本签署仅Independent Acceptance的已验环境/范围。独立Reviewer负责G01和REV-05最终处置，Leader负责最终CI2/精确集成commit、私有交付和整体P1完成。无自动下一波/公网发布/交卷。


补充澄清（2026-10-30T01:22+08:00）：旧综合mobile case的hasTouch配置不能代替实际pointer媒体值，原JSON coarse=false保留。新touch.mjs全程仅touchscreen.tap、无page.mouse.move，实际coarse=true并断言，不将模拟器配置当观测事实。4.71秒独立执行exit0。主综合case更名为actual media and GPU allocation audit，避免继续暗示它验证coarse。


## CI2预算新发现（封存前审计）

ACCEPT-BUDGET-02，major，位置首页实际公开图请求预算。GitHub Actions40919563180/head e62444d104f2e4e58a497103ad8865cafb5f4948，独立runner三轮图片996880/996880/757983B，13/13/10个真实图片请求；最大996880>819200，且transferSize/CDP证明真实传输，不是仅资源列表缓存重复。CI功能22/31绿不代表预算绿。新证据ci2-budget/measurement.json及Root integration/ci2-browser-summary.json。

Leader有界修复仅四JPEG编码86/4:4:4→82/4:2:0，尺寸480×640/裁切/颜色/PNG/业务/前端不改；预算800KiB不变，考虑四组hero目标<750KiB留余量。收到新精确部署SHA与healthy通知前不采样。复验default22、functional31、startup三轮与无截图interact，touch/native可快跑，界面新截图供Reviewer；源代码相同部分可明确引用旧31FE及精确Electric五帧等价证据，不伪造新SHA下重跑。

预算guard补强（4c37d7b）：measure先写完整measurement与每轮断言值，再真实失败退出。check-budgets对CI2原报告重算已明确exit1；该Red依据真实996880B，不是人为构造样本。旧本地原报告重算exit0只是验证各轮判定差别，不解除当前pending。lazy实际总gzip<=120KiB也成独立退出门槛，后续functional应32项。
