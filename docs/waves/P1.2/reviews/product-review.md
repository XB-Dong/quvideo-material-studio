# P1.2 独立产品审核

Reviewer：`p11_design_review`，唯一可写此报告，产品/测试/设置只读；actualProvider/model/reasoning均为null。执行基准`33170a5ae33cc63882f73c329dbd88eda6f5e70c`。

**最终G01通过：实际帧验证版本`7bd5436fce19486688e7064f59ce45f973e34ba4`，经末段有界差异审核，视觉评分沿用于`b2d0a6aa16a4a6890e58b2b92d6f672bfc466c9c`。ROUTE-01、UPLOAD-01、DIALOG-01、STATE-01均已实际复核关闭，无开放美学发现；最后短点互斥minor的运行补证由Acceptance承担。** G02/完整业务/预算/性能/CI不代签。下文保留首轮失败、相位复验、5e2冷图暂签撤回与最后修复，不将失败追改成通过。

## 结果缩略图契约审查

已只读检查现有Java `Api.java`、`RequestFilter.java`、`FilesService`结果读取路径、Next媒体代理及History卡片/预览调用。固定2成功+1失败样例的原PNG使首屏超预算；保留原样例、记录与819200B门槛，增加专用投递尺寸是合理修复，不能隐藏记录或缩小验收样例。

**意见：可冻结该有界契约，无架构blocking/major。** Leader已接受下面细节，落入规格/OpenAPI/决定并由对应owner实施后再验证；不是对未实现代码的通过结论。

- 现有认证GET `/media/results/{id}`可选`thumbnail=true`；不传或false仍返回原PNG及逐字节相同内容，原Task.resultUrl不变。无新DB字段/任务生成/上传变更，不增加运行依赖。
- 每次必须先以当前会话确认owner且SUCCEEDED，再读图/转换；无会话401、其他owner/不存在/未成功404。原private no-store、nosniff保留，Next代理已有query/cookie透传及no-store，无需为此改变受保护业务代理。
- JPEG等比缩小到最长边≤512px，绝不放大/裁切；透明像素需明确合成白/纸白。固定合理编码质量并在实际卡片验锐度/色彩，不靠极低质量获得预算绿。图片解码/编码失败属于请求异常，不改变成功任务状态或原图。
- 不落公开衍生文件或公共缓存，避免共享结果URL绕过认证；不为缩略图额外保存旧用户画面。同步转换的尺寸/解码/编码成本需记录，不能只证明网络字节下降。
- 前端唯一History作者仅将卡片img src指向缩略图；结果dialog继续原resultUrl，不能将JPEG缩图放大冒充原PNG。图片内在比例/卡片预留区域不变，解码前不能造成CLS。

实施后必须有：原PNG/hash与预览原图不变、thumbnail JPEG可解码/尺寸/不放大/透明处理、未认证/他人/过期/未成功访问、固定2成功+1失败三轮全请求图片成本，以及正常默认软件路径生成延迟/交互记录。Leader拥有Java新ResultThumbnail/Api及自身测试，Frontend拥有History卡片src，Acceptance独立验原图/认证/预算，保持单文件唯一写入者。

## 首稿页面审阅状态

Leader已通知部署`530876ab2a81d78fda1a7725d5367021d79acf26`，旧Java结果路径尚未改。独立功能截图在`runtime/p12-review-530876a/`（Git忽略）；浏览器动作均在现有工具容器中进行，使用localhost转发访问现有栈，不重启共享服务。此时结果图片成本及水墨重复请求为已知待修问题，不声称预算通过。待实际逐图查看后追加场景评分/发现；独立Acceptance负责无截图性能与最终G02。

### 首轮实际动作与发现

工具容器`material-p1-browser:gpu`，Chromium149.0.7827.53，1440×1000默认软件路径，无能力fixture；独立会话只使用本地演示图片作为合成上传。实际原生Link由首页pet卡进入工作台；真实上传请求前加900ms网络延迟拍UPLOADING，继而实际Java返回READY；点击制作并观察ASSET_CHECK→GENERATE→成功，再以已有模拟控制创建一成功/一GENERATE失败。此为真实后台样例，未用前端定时文字代任务。

已实际查看studio空/有任务、上传中/READY/非法文件ERROR/移除、两阶段与成功、2成功+1失败记录、结果与身份dialog、独立/空历史、查询503保留已有记录、模板query404/延迟加载/请求503及全站404截图。上传/任务请求真实；查询和模板503由浏览器网络响应fixture构造，清楚区别于执行失败。两张间隔650/700ms的稳定场景截图可见波纹线段位置改变。`review-runtime.json`记录pageerrors=[]；独立375×812 context在截图前测coarse=true/fine=false/touch=1，其制作页全图已实际查看。没有把全页截图之后可能改变的媒体状态当首tap证明。

#### ROUTE-01 · major · 公共封面桥非等比拉伸

- 位置：`frontend/src/components/motion/journey.tsx`的`VisualJourney/connect()`，将overlay先设目标示例图宽高，再做`scale(sourceWidth/targetWidth,sourceHeight/targetHeight)`。
- 触发：正常从首页竖版pet卡进入横向示例图；实际原生Link点击后立刻截图，无页面篡改。
- 预期：图像主体保持本征比例，矩形画幅可裁切/变化；短转场不应产生明显人物/宠物形变。
- 实际：`studio-empty-a.png`清楚拍到巨幅狗脸被纵向拉长，桥在中途覆盖Maker邻近上传位置；稳定终态才恢复正常。260ms虽短，仍是用户指定跳转美感的关键路径。
- 证据：`runtime/p12-review-530876a/studio-empty-a.png`；同时查看稳定`studio-empty-b.png`作对照。
- 处置：Leader与Frontend接受。Frontend已提交35c53df，改用left/top/width/height几何衔接及object-fit:cover，去除图像X/Y独立scale；此刻尚待实际部署中间帧独立复验，**open**。

#### UPLOAD-01 · minor · 无预览错误态的覆盖提示与格式说明重叠

- 位置：UploadSlot无preview的ERROR分支与`.upload-overlay` hover/focus样式。
- 触发：已有图片替换为非法text/plain文件，ERROR移除旧预览；光标/焦点仍在上传位。
- 预期：上传位标题/格式与错误文字独立清楚，重选入口可点。
- 实际：白色“选择照片”胶囊压在JPEG/PNG说明上，上传位已有原生label说明，形成无益重叠。
- 证据：`runtime/p12-review-530876a/upload-error.png`。
- 建议/状态：仅有preview时显示覆盖提示，或无图ERROR沿用EMPTY规则；不动label/input同步动作。已发Frontend，**open**。

首轮G01不通过：ROUTE路径的创意贴合/动态观感不足4，不能用稳定终态截图掩盖。其余稳定页面暂未发现blocking/major，等上述修复及缩略图新部署实际复验后再给完整逐场景评分；全站框架error/global-error当前仅源码审阅，未真实触发，不标已验。

## 最终候选实际复验

实际部署`5e2af4c7c89f7a4374e7d6ce947af6ff7070f95c`，Leader记录frontend镜像dbebdbba/backend32de4d2c。独立容器运行元数据起点2026-10-30 13:07:05（UTC+8），Chromium149.0.7827.53，默认软件策略、1440×1000，以及独立375×812触摸context；正常动作没有能力伪造。原始证据`runtime/p12-review-5e2af4c/`（Git忽略）。此后只读`git diff 5e2af4c HEAD -- frontend backend`为空，后续文档提交未改变该产品。

### 实际核对与关闭

1. **UPLOAD-01 closed**：实际替换为非法text/plain，hover无预览ERROR上传位并查看`upload-error-hover.png`，胶囊已不渲染，标题/格式/错误各自清楚；源码仅在slot.preview时呈现overlay，label与原取消语义保留。不是只检查CSS类名。
2. **ROUTE-01 closed**：源码已以left/top/width/height几何变化加object-fit:cover取代X/Y非等比transform。正常Link导航实际执行；初次CDP screencast只采到首页帧，`route-00..02.jpg`保留且不冒称拍到中间帧。随后独立进行**受控视觉相位读回**：仅对实际生产创建的桥Animation暂停并seek到70/150/230ms，实际截图与`bridge-phase-readback.json`确认objectFit=cover、transform=none、自然图480×640，在变化画框内保持本征比例；已实际逐图查看，不再出现首轮长条脸。恢复播放后overlay清除（cleaned=true）。该读回是视觉检查fixture，不作为默认时序、即时卸载或无截图性能通过证据；这些由Acceptance以默认真实路径另验。
3. **真实缩略/原图分工**：实际两张成功卡片src均带thumbnail=true，natural size为512×341；dialog使用无query原resultUrl，natural size为960×640。已查看卡片与`result-dialog.png`，正常尺寸毛发/草地层次清楚，预览保持较高细节，无裁切变形或明显JPEG坏块。源码与决策0014/P1.2-1.0.1一致；原图字节hash、访问隔离和预算不是只凭观感签署。
4. **制作/上传/任务/记录/两dialog**：重新实际执行本地合成JPEG上传、UPLOADING→READY、制作受理、素材检查→模拟生成→成功；以真实模拟参数补第二成功与GENERATE失败。逐图查看空制作、上传、READY、失败/移除、嵌入记录、独立历史与空历史、查询503保留、成功预览和身份dialog。场景波纹在间隔650/700ms的多帧中位置变化；正文/原照片不随波纹移动，任务只在真实server状态变化后更新。两类dialog实际打开并ESC关闭。正常运行pageerrors=[]；没有用截图读回替代性能结论。
5. **小屏**：截图前实际测得coarse=true/fine=false/touch=1，`mobile-studio.png`已查看。左Maker/右历史自然堆叠，上传位、主按钮、错误/记录空间清楚，无可见横向溢出；此运行以setInputFiles选择合成文件，未冒称自己打开OS文件选择窗口，原生chooser/首次tap行为由独立Acceptance验证。
6. **边界真实触发**：最终模板query404与全站404分别实际导航；普通查询503与任务执行失败各自表达。另用两个独立context的浏览器fault fixture触发真实React边界：先route.fetch真实JSON，仅将模板title替换为对象，走app/error并实际显示“页面暂时无法打开”；仅将session.displayName替换为对象使页面及其Shell fallback失败，走global-error并实际显示“工作台暂时无法打开”。两个fixture各命中1次，截图`route-error.png/global-error.png`已查看；没有更改产品或保留此响应到其他context。解除规则后点击重载的动作已记录，但是否完整恢复应以Acceptance断言为准，单凭URL不签恢复。global-error是规格规定的安全静态例外，不要求根运行受损时继续装饰。
7. **加载与普通请求错误**：530首轮已通过延迟模板响应/503实际看到并查看`template-loading.png/template-request-error.png`；对应StatePanel/loading/error/not-found源文件相对最终候选无diff，最终又实际查看同系列真实error/404，故沿用未受修复影响的加载/请求错误视觉证据，不虚构第二次加载采集。

### 逐场景G01评分

分值满分5，每项单独≥4，不以平均抵消不足。依据为上述实际动作/截图和源修复复核；准备分镜未用于产品评分。

| 场景 | 构图层级 | 创意贴合 | 配色 | 节奏 | 克制留白 | 依据 |
| --- | --- | --- | --- | --- | --- | --- |
| 首页回归 | 4 | 4 | 4.5 | 4 | 4.5 | 原Hero/四卡/水墨与蓝紫细边保留，实际首页图无新增区块或技术解释，功能桥轻量增强。 |
| 公共封面→制作 | 4 | 4 | 4.5 | 4 | 4 | 修正相位图中画框改变而照片不被拉伸，最终入口/工作台固定；正常导航与相位fixture边界分开。 |
| 制作空/有记录 | 4.5 | 4 | 4.5 | 4 | 4.5 | 左侧封面与上传、右侧记录对齐；蓝紫细波建立持续场景，正文和照片稳定。 |
| 上传中/READY/失败/移除 | 4 | 4.5 | 4.5 | 4 | 4 | 原图清楚，点/线不定量反馈到勾线/安静失败，错误重叠已消失；未出现虚构进度。 |
| 嵌入历史阶段/混合终态 | 4 | 4.5 | 4.5 | 4 | 4 | 三阶段节点与正文一致，失败原因清楚；成功缩略图清晰，多卡不各自强闪。 |
| 独立历史有记录/查询异常 | 4.5 | 4 | 4.5 | 4 | 4.5 | 标题/纸面卡片/数量清楚，503横条保留卡片与结果，画面不误作全任务失败。 |
| 独立/嵌入空记录 | 4 | 4 | 4.5 | 4 | 4.5 | 少量图标、波线、返回入口建立方向；留白容纳后续记录，没有另加营销区域。 |
| 结果预览dialog | 4.5 | 4 | 4.5 | 4 | 4.5 | 原PNG主导，模糊backdrop弱化背景，关闭与标题明确，照片比例保持。 |
| 身份dialog | 4.5 | 4 | 4.5 | 4 | 4.5 | 身份图标/名称/说明层级清楚，短进入退出与全站语言一致，文字不装饰化。 |
| 加载/请求失败/模板query404 | 4 | 4 | 4.5 | 4 | 4.5 | 同系列纸面图标/细波与明确返回/重试，加载不伪装成功、失败不遮原因。 |
| 全站404/app error | 4 | 4 | 4.5 | 4 | 4.5 | 真实路由/渲染错误呈完整浅色面板，主动作和返回关系清楚，背景不压文字。 |
| global-error安全静态 | 4 | 4 | 4.5 | 4 | 4 | 实际根级故障回退保留品牌、真实提示和重载/返回；按规格明确静态，避免依赖失效Provider。 |

上述为**冷加载新发现前的场景暂评**；ROUTE-01、UPLOAD-01全部closed，但不能代表尚未验证的冷原图。原始已加载预览评分保留，当前G01结论以后续DIALOG-01为准。所有候选图片都是合成/公开示例，不包含用户真实上传。原始图/故障记录保持Git忽略，不以截图阶段的时间或动画fixture代签G02。

### DIALOG-01 · major · 首次冷原图预览坍缩后骤增，真实load未触发预览动画

- 发现来源：独立Acceptance在同一5e2实际候选使用600ms原PNG响应延迟复现；Leader接受，本Reviewer随后实际读取其`runtime/p12-5e2/cold-preview/cold-preview.json`并view `cold-open.png/cold-loaded.png`核实。此项由Acceptance运行，未冒称本Reviewer首轮就覆盖了冷加载。
- 位置：`shell.tsx` Modal只在mount effect测`.preview-image`几何并启动动画；History预览图加载前未预留自然比例空间。
- 触发：结果卡片已用JPEG缩略图，第一次打开未缓存的原PNG；网络响应真实延迟600ms，无私有图快照。
- 预期：原生dialog立即打开并保留稳定原图画幅，图到达后单次、可取消、保持比例显露；不可等原PNG才打开，也不可让小空弹窗突然长大。
- 实际：pending时img为0×0，dialog约199×138；load后img702×468、dialog760×606，画面明显跳变；load与load+100ms图像动画均[]，mounted时零几何导致没有实际原图显影。
- 严重性：影响用户指定结果预览关键过程；冷预览构图/节奏不足4，**G01暂不通过**。已加载终态漂亮不能掩盖此过程。
- 处置：Frontend补自然比例元数据占位与真实load触发的单次可取消显影/等比origin；保持同步open、私有图立即清除与业务保护。此刻**open，待新SHA冷/暖与取消/重入实际复验**。

### STATE-01 · major · 路由错误解除故障后重新加载未恢复工作台

- 发现来源：独立Acceptance真实边界fixture，证据`runtime/p12-5e2/boundaries/boundaries.json`已由本Reviewer实际读取：route error retry fail，input等待10000ms超时，intercepts=1；global-error retry pass。这是操作/恢复失败，不能用错误页截图美观代替。
- 位置：`app/error.tsx`仅调用React边界reset，原QueryClient中的坏模板数据仍在；模板title对象触发错误后解除网络fixture并点击“重新加载”不能恢复真实文件输入。
- 预期：用户明确点击恢复后能够重新获取正确数据并进入工作台，Cookie/任务记录仍保留。
- 处置/状态：Leader接受，Frontend拟将该动作改为真实页面reload，避免只reset后读取同一坏缓存。不改业务查询协议或重置身份。**open**，待最后实际部署重试断言；本Reviewer此前只记录点击后URL，未将URL不变冒充恢复通过。

## 签署边界

本Reviewer只签上述实际版本的美学与发现复验。未运行/代签Java18、原FE/API检查、原生filechooser/默认路由取消时序/真正后台、三轮全部预算、30秒无截图性能或完整远端CI；以对应独立Acceptance/Leader实际结果为准。真实硬件/实体手机未测不称通过。产品视觉源码若再改变，应明确影响并复审；文档/测试证据提交本身不改变本次产品视觉结论。

## 最后受影响点复验与G01签署

实际部署`7bd5436fce19486688e7064f59ce45f973e34ba4`，Leader通知13:24:08（UTC+8）健康，frontend manifest11ae67b7/backend32de4d2c。最后独立容器运行复用Acceptance在Git忽略目录保存的合成会话，没有新建任务、查看真实个人上传、重启共享栈或在性能窗口并发浏览器。证据在`runtime/p12-review-7bd5436/affected-review.json`和5张PNG；已实际逐图查看，不只采集后列文件。此时`git diff 7bd5436 HEAD -- frontend backend`为空。

### DIALOG-01 closed

真实原PNG响应由网络fixture保持pending供观察，至少600ms，实测hold708ms（包含功能读回时间，不是纯网络性能采样）。原生dialog立即open，pending时自然宽度0，但frame已经约701×467、dialog759×605；load后frame702×467、dialog760×606。差异是进入动画/像素取整量级，不再从199×138小空框跳到760×606。

已实际查看`cold-pending.png/cold-loaded.png`：纸面和照片画幅稳定，加载文案居中，原图到达后填入同一画幅。独立load监听在load+20ms记录到真实running动画：opacity .3→1、translate约11.14px/1.10px、**统一scale(.96)**→none，200ms；settled时动画[]。没有暂停/seek此原图动画；与前述路由相位fixture不同。照片比例保持，无明显弹窗骤变。

`image-error.png`显示真实503原图加载失败后同画幅清楚提示，关闭入口仍可用。实际ESC及reduce条件下ESC后dialog数量均0；只取消/关闭视觉，没有延迟保留私有图片。相应图片不是拿JPEG缩略放大替换原PNG。

### STATE-01 closed

最后部署再次在独立context用真实模板JSON的title对象触发app/error；解除fixture后点击“重新加载”，**实际等待到文件input重新挂载并计数1**，`route-recovered.png`已查看，工作台确实恢复。故不再用“URL仍相同”作为成功依据。输入、Cookie/身份与后台任务方案未为此重写。

### IO与模态背景的受影响范围

源码复核离屏标识从易被React状态class覆盖的形式收敛到独立data属性，CSS仅暂停装饰，不停业务；冷pending/load/settled的实际采样均无running背景动画，截图中背景安静，结果是主强调。`image-error`在新点击刚发生时的即时快照仍记录9个短点击/hover反馈，记录未含iterations，**不把它声称为持续循环已通过或已证实失败**；reduce即时sample也在媒体事件settle前取样，不能据此代签稳态取消。对应真正离屏/背景/媒体生命周期和短效果互斥仍由Acceptance按完整默认路径判断，不以美学签署覆盖G02。

### 最终评分衔接

仅重评受影响场景，未再重跑未改变的全站流程：最后源码相对5e2的改变集中在IO/模态原图/错误恢复，未改变已查看的首页、场景/上传/列表构图及路由等比修复。上面的逐场景五维评分仍适用；**结果预览（冷/暖/失败）的最终五维为4.5/4.5/4.5/4/4.5，app/error恢复场景为4/4/4.5/4/4.5**。初次冷图失败时的暂签撤回已保留，现凭新实现与真实复验恢复最终G01通过。

最终状态：**G01 passed；ROUTE-01/UPLOAD-01/DIALOG-01/STATE-01全部closed，无开放审核发现。G02 pending independent Acceptance，完整交付与CI待Leader确认。** 本Reviewer写入至此结束，不更改产品或后续封存文件；若后续产品有新改动，按影响范围重审，不能沿用本签署自动覆盖。

## 最后短点互斥minor的有界差异审核

独立Acceptance随后在7bd捕获dialog.open同一时点6个240ms点击光点与dialog/backdrop并行，确认违反已冻结的短效果互斥。先前本Reviewer即时采样只保留了running条目、缺少iterations/同一时点归因，因此没有提前将其当通过；现在保留原采样与独立确证，不称它本来不存在。

已实际只读核对`git diff 7bd5436..b2d0a6a -- frontend backend`：**唯一产品文件为history.tsx**，去掉结果按钮的`onPointerDown clickFeedback`调用及未使用的import（1行变更、1行删除）；没有样式、布局、图像、ResultPreview、PNG路径、业务状态或冷图行为改变。结果按钮仍原生onClick立即打开dialog，预览本身已有清楚反馈，移除额外光点没有新的美学缺口。

因此本Reviewer将**G01及非受影响场景评分沿用于`b2d0a6aa16a4a6890e58b2b92d6f672bfc466c9c`**，保留7bd真实帧与冷加载实测的精确版本，不冒称重拍了b2。没有再启动浏览器、读取UI或占用无截图性能窗口。删除后的同一时点无bloom证据、其他互斥/生命周期及完整G02由独立Acceptance在实际部署补测；源码差异审核不代替该运行结果。

唯一审核文件至此冻结，可由Leader提交；无新产品美学问题时不继续修改。后续完整交付/CI仍由Leader按精确集成提交签署。
