# P1.1 独立产品审核

当前结论：**已在实际部署 `64e919aac25cacf7f1193b4a361071e5d03ef635` 独立复验，VIS-01 closed，G01 通过；无开放 blocking/major/minor。** 五维最新评分为4、4、4.5、4、4.5。G02 由独立 Acceptance 汇总，本审核不代签；邮件也不在本 Reviewer 的执行权限内。以下保留6f5f首轮不通过及修复复验全过程，不将旧失败改写成通过。

## 范围与方法

- Reviewer：`p11_design_review`，任务 `P11-REVIEW`，规格 `P1.1-1.0.0`。actualProvider/model/reasoning 均为 `null`，继承当前会话且实际路由无法独立核实。
- 源码及实际部署：`6f5f156527646eac0adc00c96c641968f0f60017`，Leader 已确认现有服务健康。只读审查 `visuals.tsx`、`showcase.tsx`、Catalog、Shell、偏好策略、CSS、来源/适配清单、前端行为测试及独立验收入口。
- 2026-10-30 11:35–11:36（UTC+8）独立使用现有 `material-p1-browser:gpu` 工具容器中的 Chromium `149.0.7827.53`，未改生产能力消息，原软件绘图启动参数；通过容器 localhost TCP 转发访问现有服务，未重启共享栈、安装产品依赖或修改源码。
- 实际查看 1440×1000 桌面、390×844 小屏页面，四卡 hover、四张间隔700ms动态帧、真实鼠标擦拭/4000ms回雾。小屏虽传入 `isMobile:true/hasTouch:true`，本 Reviewer 后续采样显示媒体可能在全页截图后变为 fine，因此自己的390图只作布局证据，不冒称已验证真触屏；最终真 coarse证据见复验段。不是静态方向板评分。截图会扰动时间，不能作为无截图性能证据。
- 独立原始证据在 Git 忽略的 `runtime/p11-review-6f5f-correct-origin/`：`review-runtime.json`、`desktop-home.png`、`mobile-home.png`、`demo-*-hover.png`、`motion-0..3.png`、`ink-stroke.png`、`ink-refog.png`。
- 首次使用 `host.docker.internal` 作为页面 Origin 被既有服务端来源校验拒绝；原始失败截图保留在 `runtime/p11-review-6f5f/`，随后已用 localhost 转发纠正。此环境问题不是产品缺陷，也未用于美学评分。

## 发现

### VIS-01 · major · 默认水墨被放大成整屏灰雾，缺少浅纸留白与正常可辨的山水

- 位置：`frontend/src/components/creative/visuals.tsx:66` 的全视窗 cover 缩放、`:70` 的 `blur(9px)`；`frontend/src/app/globals.css:1675` 的固定全屏/0.85不透明度与章节标题局部纸白底共同放大观感。
- 触发：正常默认首页不移动鼠标，或小屏首页静止态；不依赖失败请求或能力 fixture。
- 预期：按 P11-INK-01/design，正常就能辨认浅墨山石/树木；纸白仍占主导，画心位于 Hero 留白/页边/间隙。鼠标擦出同画面更清晰笔触，触屏的静态底也应呈现浅墨，而不是必须擦拭才能辨认画作。
- 实际：1600×560横卷按 `max(viewportWidth/imageWidth, viewportHeight/imageHeight)` 放大裁成狭窄局部，再叠9px模糊。1440×1000首屏与390×844手机中，大片中灰轮廓填满全部空白，像失焦灰团；桌面擦拭后局部才辨认树石。章节标题/右侧短句的白色小矩形又呈贴片感。源图自身清晰、轻色且无题字，问题在运行时铺图/雾层编排。
- 证据：正确 Origin 的 `desktop-home.png`、`mobile-home.png`、`ink-stroke.png` 与产图 `frontend/public/ink/landscape.webp` 已实际逐图查看。
- 修复建议：限制横卷的显示尺寸/画幅，以宽度或明确 Hero 画幅构图，保留上下纸白及自然边缘融合；减弱常态模糊和灰墨覆盖，默认仍认得山水，擦拭仍有真实锐度差。浅纸阅读区域应连续自然。不得通过隐藏水墨/停止默认动态/关闭擦拭消除问题。修复后重新拍桌面、真触摸、擦拭与回雾，重新检查像素清晰差和预算。
- 首轮状态：`open`，已发 Leader。后续实际修复复验关闭，见末段。

## 首轮 G01 逐项评价

| 维度 | 分数 | 实际依据 |
| --- | --- | --- |
| 构图层级 | 4/5 | 中文品牌、单主要入口、分类与四张实际模板层级清楚；独立 gallery 已删除，卡片文字/数量稳定。 |
| 创意贴合 | 4/5 | 四种互动作用于实际可进入详情的照片；细方点与粗圆点显影可辨，水波与局部像素尾迹各有性格；擦镜与水墨相关，非另加无关作品墙。 |
| 浅色配色 | 3/5 | 蓝紫限于操作和细边，白卡干净；但默认大面积中灰失焦水墨压过浅纸色，VIS-01 未满足。 |
| 动态节奏 | 4/5 | 多帧实际见42秒Orbit和不同流线/分段边缘持续运动；主内容未跳动，当前卡才有强互动，无手动暂停/动态按钮。未将截图序列当性能证明。 |
| 克制留白 | 3/5 | 文字本身不拥挤，但 Hero/章节周围空白被高密灰雾填满，纸白标题贴片破坏整体，VIS-01 未满足。 |

五维必须逐项≥4；本轮不通过，不以平均分抵消不足。

## 源码与功能核对

1. 当前可见品牌为疏影，metadata/icon 同步；仅去除 `yingzuo-static` 单一视觉键，未清 Cookie/其他本地数据。受保护 `frontend/src/lib/`、上传/提交业务实现及 Java/SQL 相对封存 P1 的 diff 为空，身份/QueryClient 未因动效重挂。
2. 原系统 reduce/可见性策略保留；边框通过 IntersectionObserver 离屏暂停，卡片在退出/滚动/其他卡激活/卸载时清帧和粒子，背景缓存/监听在 effect 清理中释放。四卡 `id/src` 为 effect 依赖，分类不会按索引串图。完整真实后台/性能与业务独立结果由 Acceptance 提供，不能仅据源码断言通过。
3. 最新 Dither/Halftone 确实按原图亮度一次生成细方点/粗圆点缓存，透明羽化窗口显露真实底图；已独立截图查看。不是纯彩色网格被误称显影。getImageData 位于缓存生成，未在指针帧读回。
4. 原生Canvas2D/SVG作为默认软件基础，不依赖给探针造硬件消息；upstream Orbit 仍实际挂载。四卡效果/边框 DOM overlay `pointer-events:none`，整卡一个 Link，未增加吞首次触屏的点击控制。默认边框确有连续锯齿线、流光、呼吸/追光、像素分段差别；当前不另将电弧强度判作 major。
5. 本轮实际四卡激活计数逐一均为1；真实擦拭图可见同山石/树木细节，4000ms后回雾。完整像素差/清晰度与路由/reduce释放亦有独立 Acceptance 的 `visual-r2` 结果，但其5项功能通过不代替本美学门槛。
6. 产图63202字节，实算SHA256 `0296ab7afba92c21bb53e9558b599881ce05f9607ff0485dbaa370bff35ccd96` 与清单一致；原参考SHA256 `846674ae63b4e6a51e8b60079120861711dc62afbd0d585bffb6e2e0dbad1e60` 亦一致。清单、转换参数、Met CC0来源与THIRD-PARTY-NOTICES齐备；上游来源/实际本地适配在ADAPTATIONS分开登记，没有把未挂载shader写成已运行。

## 边界与后续

本轮只写本审核文件，不修改准备审核、规格、state、产品、测试或邮箱设置。没有审查实际邮箱规则或代签邮件任务。G02、全部CI/三轮预算/30秒无截图性能/真后台和业务门槛等待独立 Acceptance 在最终实际部署版本完成；真实硬件性能仍不能从SwiftShader推断。VIS-01修复后保留本轮失败证据，以新精确SHA追加独立复验，不追改本轮为通过。

## VIS-01 修复独立复验与最终 G01

2026-10-30 11:41（UTC+8），实际部署源码 `64e919aac25cacf7f1193b4a361071e5d03ef635`，Leader记录镜像标识 `d069a52c91a321bf47bd5c80014e5593ba385d7ae1c9ca4a31248109446336c3`。随后主树 `ea8821c37d8bea9332f0244caa0611b47535a006` 相对该部署的 frontend diff 为空；本轮仍以实际部署64e9标记证据。

已只读复核新 `paint()`：横卷按宽度且不超过原图尺寸，固定纸面起点；同 clear 缓存叠加上下渐隐和左侧阅读纸白，fog由同一缓存4px模糊形成；章节标题贴片移除。没有另换原图、关掉水墨或停掉默认动态。

本 Reviewer 再次独立启动现有工具容器，以未修改的默认软件路径拍摄并**实际查看** `runtime/p11-review-64e9/{desktop-home,ink-stroke,ink-refog,motion-a,motion-b,mobile-home}.png` 与 `review-runtime.json`。桌面初始能辨横向山水层次，Hero左侧与模板区纸白连续；擦拭仍清楚显露相同山石/树木笔触，约4秒自然回雾。两张动态帧可见Orbit位置/边框段位变化，未出现静态替换。卡片区与文案不再被灰雾包围。自己的390截图用于小屏布局；其截图后metadata实际为coarse=false/fine=true/touch=0，故不将其用于触摸行为判定。

另实际读取独立 Acceptance 的 `C:/Users/dongx/.codex/worktrees/p11-acceptance/杭州小影AIcoding/runtime/p11-64e9/accept/acceptance.json` 并查看 `mobile-catalog.png`：同一部署SHA，`mobile: true coarse first tap direct navigation` 的实际采样为coarse=true/fine=false/hover=false，通过首次tap进入详情。其375×812已加载的真实小屏画面为浅墨局部、大片纸白和四张照片；无需擦拭才能使用。该运行由Acceptance执行，本Reviewer独立审读与审图，未冒称自己执行其触摸动作。

**VIS-01：closed。** 实现针对放大和雾层原因修复；默认仍呈现绘画并保留更清晰擦镜，没有靠全隐藏装饰过关。

| 最终维度 | 分数 | 复验依据 |
| --- | --- | --- |
| 构图层级 | 4/5 | 品牌、Hero入口、分类与四卡仍清楚，标题保护从贴片变为连续浅纸；Hero左右权重保留。 |
| 创意贴合 | 4/5 | 可点击模板上的四种图像互动与缓慢多边框，配合可擦清的真实山水；不是独立噱头区。仍为本地基础适配，未冒称全部上游shader实际运行。 |
| 浅色配色 | 4.5/5 | 全页主色已恢复近白纸色，浅墨限制在Hero画幅；蓝紫操作/细边与照片形成清楚层次，未形成深色蓝紫背景。 |
| 动态节奏 | 4/5 | 实拍仍有慢Orbit、持续边段和可辨的短时擦拭；文案/入口固定，没有额外文字提示或暂停开关。性能门槛另验。 |
| 克制留白 | 4.5/5 | Hero左侧和模板区大面积连续纸白，章节间隙干净，水墨渐隐自然；照片与边缘是前景主体，触摸小屏也未再整屏填灰。 |

最终 **G01 passed**，范围为本次实际部署的默认软件视觉体验与已核查的响应式页面。**G02 pending independent Acceptance**；本报告不声称尚未完成的三轮性能、真后台、邮箱或完整交付已通过。后续产品视觉源码改变应重新判断本结论是否仍适用。
