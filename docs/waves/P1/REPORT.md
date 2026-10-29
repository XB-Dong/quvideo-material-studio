# P1实现、验证与交付报告

规格P1-1.2.0。浅色界面、蓝紫细节、四套本地照片、七项创意及操作反馈已完成；独立美学与舒适复验、带预算守卫的CI3全部通过。Leader已关闭所有产品blocking/major并接受本轮交付。

## 验证版本

最终本地部署及新资产验收源码：**a2505ecdedf04ad432476d5bdfb1eda02e0fe926**。相对716518仅优化四张JPEG封面的网页编码，480×640、来源、裁切与色彩方向不变；前端可执行代码、Java代码、迁移及结果PNG均未变，见[等价核对](evidence/integration/asset-only-runtime-equivalence.json)。旧716518的合法Electric五帧及1280专项证据按这一明确边界引用，新1440/375、图形功能、原生后台、触屏和性能均按a250重新执行。

报告/源码封存commit是包含本报告和最终state的提交，读取`git rev-parse HEAD`或源码包文件名；不将报告SHA、运行源码与CI验收SHA混写。

## 完成内容

- 瓷白背景、白面板、炭灰文字；蓝紫用于细线、边框、图标、选中态和少量主操作。列表、制作、历史及身份/预览弹窗统一，保留键盘焦点和小屏操作。
- Java接口提供模板及图片；四套合法照片全部本地化，JPEG封面与真PNG预置结果可离线访问。封面采用quality82/4:2:0，未降尺寸或改裁切；[生产清单](evidence/assets/production-manifest.json)记录来源、作者、许可、尺寸和哈希。
- 七项真实React Bits TS-CSS源码接入：Hero的Orbit/局部Glow/主入口Electric，以及四题材画廊的Dither、Ripple、Halftone、Pixel。页面不出现技术名称、效果注释或鼠标体验说明；普通操作使用CSS/React真实状态反馈。
- 静态SSR、系统reduce优先、手动静态偏好、低能力/触屏/离屏/后台降级、单GPU owner、DPR/像素预算与资源清理。Worker探针确认释放后才允许主GPU；实际软件/未知环境禁六GPU装饰，保留照片、SVG环绕和CSS操作。
- 保留P0的Java三阶段异步执行、任务/步骤持久化、上传与提交校验、会话隔离、多个任务独立、查询异常区分、刷新恢复、终态停止轮询及旧请求保护。受保护lib没有修改。

## 实际验证与独立签署

所有产品安装、构建、测试及浏览器执行均在Docker Linux容器。当前网站保留在localhost:3000。

| 项目 | 结果与证据 |
| --- | --- |
| 前端lint/type/行为测试/构建 | 31测试通过，含原16；前端执行代码与716518相同，[原始集成记录](evidence/integration/final-checks.json)和等价核对可复核，新CI再次执行 |
| Java/MySQL测试及打包 | 新a250实际15测试全部通过，含原12 |
| 独立API验收 | 新a250实际8项全部通过；与15Java/新镜像构建及健康启动同见[新集成记录](evidence/integration/cover-optimized-checks.json) |
| 默认浏览器 | 新a250 22项通过，含真实上传、多任务、查询503恢复、指定阶段失败、刷新、预览、终态停轮询 |
| 七创意功能与延后预算 | 新a250 32项通过；实际软件driver+明确允许消息fixture，不冒充硬件性能 |
| 原生后台/触屏 | 新a250两个原生标签模式通过；同windowId、trusted hidden事件后Orbit/GPU/RAF0，返回恢复。触屏实测coarse=true/fine=false，仅touchscreen.tap，GL/Orbit/RAF0 |
| 桌面/小屏 | 新1440/375实际页面通过；1280两页、键盘focus/cursor按相同执行代码证据引用。旧综合mobile coarse=false保留，独立touch专项证明实际coarse，不能根据配置推断 |
| 升级、回滚与旧结果 | 隔离P0→P1→匹配快照P0→再P1通过，Flyway及旧结果SHA保持；新编码未变PNG/Java/SQL十三文件，旧主卷27文件字节核对通过 |

[独立美学审核](reviews/implementation-review.md)已在新a250实际页面续签：构图、创意贴合、色彩、节奏、克制留白五维各4/5，REV-01～05关闭。Reviewer实际查看新四JPEG及新桌面/375页面；Electric代码/样式未变，明确引用716518合法五帧，不冒称重新采样。

[独立舒适签署](evidence/acceptance/COMFORT-SIGNOFF.md)按新a250完成本地复验，完整原值见[总索引](evidence/acceptance/FINAL-a2505ec.json)。Leader结合CI3实际预算守卫已关闭图片预算问题并接受双门槛，见[最终处置](reviews/leader-disposition.md)。

## 同条件测量

Chromium149.0.7827.53、Playwright1.58.2、同SwiftShader驱动/依赖层；1440×1000、DPR1、新context、禁客户端缓存、无CPU/网络节流，networkidle后观察8秒。P0为07300db旧镜像及独立V1/V2库。JS是响应体gzip(level9)归一值，图片是ResourceTiming encodedBody原值，不等同统一实际压缩传输量。所有重复请求都计入，未按URL去重或只挑中位数。

| 项目 | P0 | 最终a250本地原值 | 门槛 |
| --- | --- | --- | --- |
| 首屏JS | 156375B | 三轮均168190B，增加11815B | 增加≤35840B，通过 |
| 延后脚本 | 无 | 57422B，含共享延后代码及观察到的Worker | ≤122880B，通过 |
| 公开图片 | 三轮均21967B | 446891/182616/403920B，最大446891B | 每轮≤819200B，通过 |
| CLS | 中位0.0000935438 | 0.0001514910/0.0001578402/0.0001642361 | 每轮≤0.1，通过 |
| 默认交互 | 无相同特效场景 | 1085ms开始交互后长任务0、主GL0、最大RAF间隔16.8ms | 无截图/trace独立采样 |

初始加载仍有113/85ms长任务及约316.6ms最大帧间隔；不能宣称整个页面零长任务或全程16.8ms。强制软件图形读回与截图会扰动时序，不作为舒适性能证据。原值：[P0](evidence/baseline/gpu-supported/measurement.json)、[a250三轮](evidence/acceptance/final-a2505ec-startup/measurement.json)、[默认交互](evidence/acceptance/final-a2505ec-default-performance/interaction-performance.json)、[延后脚本](evidence/acceptance/final-a2505ec-functional/lazy-scripts.json)。

## 真实问题与处置

1. 修复重复六图、图片失败串题材、图标缺字、空上传位遮文案；Electric首帧白块改为透明就绪帧、2px边环裁剪和独立文字层。五次独立合法激活captureEnd为476/555/384/366/468ms，晚期画面差384像素；628ms无效attempt保留。这些是分段采样，不是同一次连续录像。
2. 原软件driver同步loseContext约131/56/76ms导致真实长任务；Worker能力预检及默认软件降级修复默认路径，最终主GL0/交互长任务0。功能fixture仍明确记录软件driver，不冒充硬件舒适。
3. CI1功能27/4失败：截图RPC越播放窗口、固定等待与媒体偏好污染后项。保留失败，改为独立精确截图模式、常规真实draw/变化像素证据、fresh/finally及真实资源归零等待。没有改产品450/600ms，也不把5秒功能等待上限称为舒适时延。
4. **ACCEPT-BUDGET-02**：CI2虽然功能全绿，但图片实际996880/996880/757983B，前两轮超过800KiB，原G02暂停。没有去重或放宽预算；四封面q86/4:4:4改为q82/4:2:0，总量280189→182616B。同重复模式加权648144B仅为估算，新本地原值已逐轮通过。新增CI守卫先保存完整原值，再对每轮图片/CLS/错误/JS增量断言；原CI2重算真实exit1，延后JS也必须≤120KiB。见[编码修复](evidence/assets/image-budget-repair.md)、[修正账本](evidence/acceptance/repair-ledger.json)及CI3结果。
5. 匹配回滚曾遇tar安全filter丢失UID导致600文件不可读，修为UID/GID10001；真实后台曾被Xvfb wrapper及Playwright focus模拟阻挡，改有界启动和原生CDP，同窗真实标签事件独立复验通过。基础设施失败没有包装为产品Red。

## CI与交付

CI1 [40915531767](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40915531767)失败保留；CI2 [40919563180](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40919563180)功能成功但图片预算漏检，不能作为最终验收。最终CI3为[a250 / 40923131462](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40923131462)，frontend/backend/integration全部success，含新预算守卫，最终验收commit为**a2505ecdedf04ad432476d5bdfb1eda02e0fe926**。见[实际远端状态](evidence/integration/ci-40923131462.json)和[CI三轮原值](evidence/integration/ci3-measurement.json)：图片182616/182616/492968B，每轮均通过原800KiB上限。

私有仓库：[XB-Dong/quvideo-material-studio](https://github.com/XB-Dong/quvideo-material-studio)。源码包由封存HEAD执行git archive生成，保留源码、锁文件、CI、迁移及本地素材，不含.env、依赖、数据库、运行卷或trace ZIP。忽略的合成会话trace已复制仓库外并校验哈希，开发工作树归档工具因活动任务锁拒绝，三树保留，未手工删除或绕过；主站和持久卷保留，独立P0基线栈/测试库已停止。启动/演示/匹配回滚见README。最终交卷和后续波次由用户决定。

## 限制、投入与AI工作流

物理硬件GPU性能、物理Windows/IAB最小化及全设备帧率未测。容器原生浏览器后台已实际验证；手工visibility fixture另记，不相互冒充。单后端、本地文件、匿名身份、重启收束失败而非自动续跑、无受理幂等/自动重试/孤立上传清理的P0边界继续适用。结果是预置PNG，不真实处理输入。

Leader冻结契约/依赖/owner并集成交付；唯一Frontend按VISUAL→CREATIVE→MOTION顺序写；Asset处理来源/图片/MIME/回滚；Acceptance独立功能/舒适/性能，资产席位释放后Reviewer独立美学，最多三个活跃子Agent。真实模型路由没有证据，保持null。问题均经过输入上下文、实际失败、修改、容器复验与独立处置，不提交私人聊天或凭据。来源许可见THIRD-PARTY-NOTICES，实际投入与取舍见[投入记录](../../audit/effort.md)。

实际区间：2026-10-29T22:52:38+08:00至2026-10-30T01:52:15.1733709+08:00封存时，约179.6分钟AI会话墙钟；准确记录见state。并行Agent时间不累加为人类工时，作者人工投入未精确计量，待作者补充。封存后CI确认及清理另属交付尾部，不伪称已在封存区间内完成。