# P1 独立实现与美学审核

## 最终独立美学签署

当前有效续签：**a2505ecdedf04ad432476d5bdfb1eda02e0fe926**，时间2026-10-30T01:40:57+08:00。此次仅4张JPEG编码优化，Reviewer已分别查看四个新文件及该版本真实desktop-catalog/desktop-studio/mobile-catalog/mobile-studio/desktop-task-results页面，画质、构图、色彩可接受；五维维持各4/5，G01美学通过。前端所有可执行代码、Java业务/迁移、PNG结果和旧文件与716518相同，七效果与Electric合法五帧明确按代码等价引用716518证据，并非声称重采了精确五帧。**G02仍待新版本实际传输预算与独立舒适复验；648144等估算不能替代实测，本续签不代表项目整体通过。**

签署时间：2026-10-30T00:47:53+08:00；appSourceCommit：**716518e6087fbb0ec17abf55b4b68f00cd327a84**；规格P1-1.2.0。Reviewer `/root/p1_review` 对源码、实际图像与独立浏览器原始数据复核后，**P1-REVIEW 美学门槛通过，REV-01～REV-05均关闭，无开放blocking/major**。历史阶段的pending/失败保留在下文，不覆盖本节最终结论。此签署不能替代Acceptance的舒适签署或Leader的最终集成/CI结论。

| 维度 | 分数 / 5 | 实际依据 |
| --- | --- | --- |
| 构图与层级 | 4 | 桌面首屏文字/主操作与三张环绕作品分区清楚，四模板统一卡片；375px制作页堆叠完整；重复六图已消除，上传/任务/结果信息稳定可读 |
| 创意贴合 | 4 | 七项均有真实源码和实际绘制/运动证据；Orbit陈列作品、Glow局部留白、Electric仅主操作边缘、四题材画廊承载图像效果，未做技术名称展台 |
| 色彩一致 | 4 | 瓷白/白面板/炭灰文字主导，蓝紫集中于线条/边缘/图标/少量动作，照片维持自然颜色；点阵/网点限于作品内部 |
| 动效节奏 | 4 | Orbit位移与36s慢周期、操作短过渡；Electric五个独立warm激活窗口内边缘形态有变化且文字不动；静态/reduce路径保留信息，不将软件强制功能运行的慢loss当舒适表现 |
| 克制与留白 | 4 | 单GPU互斥证据、画廊只呈现当前题材；Electric限窄环、无大白块和跨区泛光，状态文字和上传区不被特效覆盖，前端无技术注释 |

### REV-05实际关闭依据

实际view_image `final-716518-functional-verified/electric-frame-0/30/90/180/350.png` 五张合法取证图：CTA蓝底文字、描述及次链接始终清楚，未见旧大白块，电边仅为细蓝紫外缘。`electric-compositor-sequence.json`记录实际captureEnd为476/555/384/366/468ms，全在原600ms事件窗口内；30ms首次628ms超窗无效样本原样保留，第二次555ms才纳入。180→350两次合法激活采样的合成差异384像素；这些是独立warm激活的分段样本，不虚称同一次激活连续视频或精确0/30ms快照。结合真实draw、非零彩色像素、不同FBO签名与源码opacity-ready/环形mask/overflow/文字z1，确认效果真实绘制且视觉范围受限，关闭REV-05。

Reviewer还实际查看该同版本目录的active-glow/ripple/halftone/dither/pixel及desktop-task-results等图；读取acceptance.json中31pass/0fail、实际SwiftShader renderer、executionMode=simulated-hardware-preflight_actual-software-driver_functional-only以及preflight实际allowed=false/released=true后fixture仅改allowed的记录，核对Orbit实际位移和每项GPU peak=1。未把单个context分配、单张静态图或上游demo当作七项全部证明。

### 签署范围与限制

已验默认软件路径保持Orbit/CSS/业务且禁六主GPU；条件GPU路径的美学/绘制/互斥功能由实际软件driver加明确preflight允许fixture复核，**不等于正常硬件设备帧率或释放性能已实测**。原强制软件loss131/56/76ms和旧白块、超窗取证失败均保留。原生浏览器标签后台已由独立Acceptance验证（容器Chrome149、同窗口raw CDP真实切页，见final-716518-native/native-visibility.json；两模式均trusted hidden=true、Orbit/GPU/待执行RAF归零，返回恢复Orbit）。物理Windows/IAB最小化、真实硬件性能及全设备流畅度仍未验证；默认最后无截图性能与舒适完整性由Acceptance独立负责。不能据本美学评分声称全设备性能保证。子Agent的IAB入口不可用，Reviewer基于实际取证图/数据与源码联合审核，未冒称亲自操作IAB。

后续若修改应用样式、shader、capability策略或生命周期，受影响部分需按新app SHA复验；纯报告/CI文件变更不自动改变此appSourceCommit的视觉结论。

## 历史审核过程


- taskId/rootTaskId：P1-REVIEW；specVersion：P1-1.2.0。
- Reviewer：原生Agent `/root/p1_review`；actualProvider/model/reasoning：null（未独立验证）。
- 当前源码审阅：1bd5f67fd10ecba1147b1a99b5891275a058c2ab；实际已看截图：0728b3df08d3949ce1326b67cf7f3ecf646e65bd。两者不能混作同一运行证据。
- 工作范围：只读产品与证据，只写本审核报告；没有安装依赖、修改产品、覆盖测试或签署舒适度结论。
- 当时阶段结论：四项发现已关闭，Electric及性能待取证；现以顶部当前有效续签和716518原始签署为准。

## 已检查

读工程原则、协议、角色/任务、需求与设计/动效/React Bits/素材规格并复核文件地图。Git比对P0受保护lib没有修改；providers仅增加稳定MotionPreferences包装，QueryClient和Identity实例结构保留。检查单owner控制、native/OGL卸载loseContext、偏好监听清理、对话框120ms关闭/卸载取消、task.id与stage/status键、来源许可、V3和资源MIME。

实际view_image查看独立Acceptance的precheck-0728b3d下desktop-catalog.png、mobile-studio.png、desktop-task-results.png。浅色/白面板主导、蓝紫小面积强调、图片和任务信息层级方向正确；这些静态图不能证明七特效或交互节奏。

## 发现

| ID / 严重度 | 位置、触发及实际 | 期望与建议 | 状态 |
| --- | --- | --- | --- |
| P1-REV-01 major | CreativeShowcase的poster-stack始终render，正常桌面Orbit又render同三图，只有aria-hidden未视觉隐藏；实际桌面截图出现重复六张和拥挤重叠。1bd5f67同逻辑仍在 | 正常只显示Orbit三图；loading/error/reduce/小屏保留静态poster，切换不能空白 | 8688a85源修复已读；部署后运行待复验 |
| P1-REV-02 minor | PublicImage的failed状态不随src改变，图加载失败后gallery换有效题材仍显示postcard fallback | 将失败状态按src隔离或图片按src重挂，保留真正失败时fallback | 8688a85源修复已读；待运行复核 |
| P1-REV-03 minor | 0728b3d Alpine截图刷新/制作按钮的Unicode装饰符显示缺字方框，aria操作仍可用 | 使用自绘内联SVG或可靠的跨平台图形，复核新浏览器截图 | 8688a85已加SVG/空位隐藏；待新截图复核 |
| P1-REV-04 minor | 0728b3d上传空位hover overlay“选择照片”压住JPEG说明 | 空位去掉叠加或单独排版，预览替换可继续overlay | 8688a85已加SVG/空位隐藏；待新截图复核 |

Leader已明确accepted上述四项：消除重复图层、恢复有效图片、避免字体缺字和上传文字遮盖；均派给唯一Frontend owner。关闭状态须基于新实现SHA独立复核，不能把作者自测当独立复验。

## 证据边界与最终门槛

Alpine Chromium原生空白页不能创建WebGL，独立Acceptance正更换支持环境；该基础设施失败不计作产品Red，也不能将七特效标为通过。最终须查看同版本普通桌面七项真实活跃交互/录制或运行取证，检查加载/停止/强度与浅色融合后再给构图层级、创意贴合、色彩比例、节奏、克制留白五维逐项评分，每维≥4/5且无未关闭major/blocking才签署美学通过。舒适度由Acceptance单独签署。

修复源码复核：8688a85a5c5d990c634f51f2c3facfb04f7a583b（主集成为ec44ad1）。`:has(.orbit-container)`只在真实Orbit DOM存在时隐藏poster，失败/加载/静态保留poster；PublicImage按failedSrc隔离；空上传overlay隐藏；refresh/spark/empty改内联SVG。新增WeakMap登记真实已分配context，SafeEffect清理不再调用getContext，避免fallback反而创建GPU。以上仅源修复通过，运行关闭仍待准确部署版本。


## be43候选运行复核

实际部署源码be43ab9ee1c70b0fc648978b99f0e944015c0c67，已读其真实运行证据目录`docs/waves/P1/evidence/acceptance/final-be43ab9`（取证阶段位于Acceptance工作树）。Reviewer另实际view_image查看desktop-catalog、mobile-studio、active-glow、active-dither、active-halftone、active-pixel；子Agent尝试独立IAB时返回不可用，因此不声称Reviewer自己操作过IAB。

- REV-01：新桌面hero只见Orbit三图，无重复poster；其正常运动有650ms前后位置数据，关闭major。
- REV-02：failedSrc按源隔离，已有“bad→good源”真实组件行为用例；源码与24项测试证据复核关闭。
- REV-03：新375px制作图中refresh/spark/empty均为清晰SVG，不再缺字，关闭。
- REV-04：新375px空上传位只有主标题及JPEG说明，没有overlay叠字，关闭。

证据声明observedWebGL.supported=true，actual renderer为ANGLE/Vulkan SwiftShader driver。Orbit有前后位置差；Glow与Dither/Ripple/Halftone/Pixel各有活跃live GPU和图片取证，累计已看到六项，peakAllocated为1。Dither/Halftone的点阵/网点与局部原图显色可见；Pixel局部粒子不覆盖界面文字，Glow弱而不遮内容。Electric在该次60ms采样失败，Acceptance正在合法600ms窗口内补测，不提前标通过。

浅色层级、蓝紫细节、内容与状态可读、3:4画廊完整构图均符合方向；Dither/Halftone的蓝色处理仅限作品内部，没有把主界面变为深色。最终创意贴合与节奏评分仍须补Electric及独立无截图交互取证，故本节没有输出假定的五项通过分数。


## GPU舒适策略复核（d720候选）

已读决定0009、gpu-policy的Worker/OffscreenCanvas探测、六组件failIfMajorPerformanceCaveat以及WeakMap释放。初始assessment只在Worker创建1×1上下文，loss确认后消息，主线程完成terminate/revoke再resolve，组件只在allowed&&released启用；模块cached避免模式切换重探，abort不缓存，异常/超时静态回退，无前端技术说明或生产强制开关。源码未发现新的blocking。

be43软件driver的同步loseContext131/56/76ms原值必须保留；d720默认software禁六GPU的实测与正常硬件允许fixture必须分别说明，实际硬件设备性能不能由fixture代替。

### P1-REV-05 major：Electric活跃帧遮挡

Reviewer实际view_image `final-be43ab9-recheck/active-electric.png`看到hero左侧约226×176纯白矩形，覆盖开始创作、描述与次链接。已报Root和Frontend要求排查透明清屏、MARGIN画布布局、首帧/层级或截图时序。d720 functional新帧没有该白块，但单帧不能排除初始化闪白；需修复或足够取证排除后再关闭，不将“GL分配成功”当作美学完成。

当前状态：REV-01到04关闭；REV-05待处置；默认性能策略运行复核与五维签署待最终证据。


## 716518候选源码与取证边界

当前部署源码716518e6087fbb0ec17abf55b4b68f00cd327a84。已读Electric初始化/resize先opacity0、完整draw且有效尺寸才ready、CTA外扩2px环形exclude/xor mask、overflow clip与独立文字z1。该结构可限制大画布只在按钮边缘显示，不再允许MARGIN跨出遮正文；未知/通用masked renderer保守静态的新纯分类器也已复核，无外部闭包的Worker字符串可执行边界清楚。

已实际查看新functional的electric-frame-0/90/350与Dither/Pixel活跃图，但其中Electric序列intended0/30/90/180/350ms对应actual3099/6071/9232/11913/14621ms，均超600ms事件窗口，不能将这些后期静态图冒称首帧或据diff0判产品故障。Acceptance已保留该工具问题并改在浏览器内算像素计数重新采样。真实draw2、colored2099、透明81.5157%及两buffer签名不同支持shader确有绘制，但需与mask后的可见边缘/窗口内画面共同验证。

默认716518报告22pass/0fail已读；默认software main GPU0与交互阶段无loss长任务的d720实际取证支持决定0009的已验software舒适路径。实际物理硬件性能、真实OS后台行为仍未验证，不由software功能fixture替代。REV-05等待合法窗口多帧/最终图，不提前关闭或给虚假五维通过分数。

最终范围补记：Reviewer已读独立Acceptance的final-716518-native/native-visibility.json，准确app SHA仍716518；默认和允许消息fixture均为同window原生Target.activateTarget切页，无visibility覆写/派发事件，trusted事件与资源归零/恢复记录成立。此补记只更新原生标签后台验证范围，不改变五维评分、产品或此前硬件/物理Windows最小化未测限制。


## JPEG预算修复限定复核

新app源码a2505ecdedf04ad432476d5bdfb1eda02e0fe926。已git diff核对：frontend/src只新增ADAPTATIONS文档说明，无可执行前端改动；Java代码/迁移/所有PNG未变，生产资源只有四个480×640 JPEG变更。manifest记录quality82、4:2:0、progressive/optimize及新字节数/SHA，裁切中心和自然颜色策略不变。

Reviewer已实际view_image新postcard/pet/story/portrait四JPEG：雪山纹理、宠物毛发/耳部、人像霓虹及抽象线条在卡片展示尺度可接受，未见明显色块损伤或主体裁切变化。随后实际查看独立Acceptance `final-a2505ec-default` 下desktop-catalog、desktop-studio、mobile-catalog、mobile-studio和desktop-task-results五张新版本实际截图，页面保持浅色、清楚层级与图片优先，蓝紫细节没有扩大，故构图/贴合/色彩/节奏/克制五项维持4/5。新375px页面操作区和图片布局均可读，没有横向拥挤或新编码导致的可见质量退化。

性能预算失败原值996880不删除，修复估算不是实测。G02预算与舒适需由Acceptance用新实际浏览器报告及budget guard复验后独立续签；本节只续签G01视觉，不先行宣布整体完成。原生标签后台独立验证范围保留，物理Windows/IAB最小化与真实硬件GPU性能仍未测。
