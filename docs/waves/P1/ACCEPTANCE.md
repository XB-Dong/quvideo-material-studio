# P1 验收矩阵与取证计划

版本P1-1.2.0。当前全部产品项not_run；P0的通过是基线，不是P1结果。准备检查只验证计划与来源工件。每条证据须带commit、环境、时间、命令/操作、预期/实际与限制。

| 要求 | 场景/检查 | 主要任务 | 预期门槛 | 状态 |
| --- | --- | --- | --- | --- |
| VIS-01 | V01三页两弹窗/主题一致 | VISUAL | 瓷白/白/浅灰大面板，蓝紫只作小面积细节；token一致，层级/留白/状态清晰；普通文字4.5:1，大字3:1 | not_run |
| VIS-02 | A01四模板封面/成功图/来源 | ASSET | 本地可用，裁切不伤主体，正确MIME，许可/哈希/尺寸/预算可追踪 | not_run |
| MOTION-01 | M01–M10逐项操作 | MOTION | 分类/hover/focus/press/上传/新卡/阶段/弹窗均有反馈；快速连续操作无残留 | not_run |
| MOTION-02 | V02装饰/运行/加载 | MOTION | 蓝紫氛围不挡交互，真实状态驱动，不假百分比 | not_run |
| VIS-01、CREATIVE-01 | T01前端文案巡检 | VISUAL、CREATIVE、REVIEW | 全部页面/弹窗/悬停态无特效名、技术说明或体验引导；画廊按作品内容命名；必要操作/状态/无障碍文案完整 | not_run |
| UX-01 | U01桌面1280/1440及375 | VISUAL、ACCEPT | 无横向溢出，触控/Tab/预览Esc/焦点返回、长错误可读 | not_run |
| QUALITY-01 | U02系统reduce/手动静态/实时切换 | MOTION、ACCEPT | 装饰停止，大幅运动消失；重要状态仍即时可读，偏好刷新保留 | not_run |
| QUALITY-01 | P01包体与加载 | BASE、ACCEPT | 同条件前后比较，新增路由JS gzip目标≤35KiB；全部延后创意JS新增体积目标≤120KiB（含Motion/OGL/适配）；首视口公开图含Orbit/poster目标≤800KiB | not_run |
| QUALITY-01 | P02流畅度/布局稳定 | ACCEPT | 无可见卡顿，交互动画不产生>50ms归因长任务；CLS目标≤0.1；记录实际trace | not_run |
| REG-01 | R01原16前端测试+新增动效用例 | VISUAL、MOTION | 原行为全部通过；卸载/身份/401/提交锁/版本保护不退化 | not_run |
| REG-01 | R02原12Java+8API | ASSET、ACCEPT | 顺序/失败/归属等通过；新资源key/MIME可预览 | not_run |
| REG-01 | R03旧结果/迁移回滚 | ASSET、ACCEPT | 新旧数据均可读；旧结果升级前后SHA一致，V1/V2不变；成套快照恢复含Flyway历史，P0→P1→回滚P0→再次P1可重做 | not_run |
| CREATIVE-01 | RB01–RB07七项真实操作 | CREATIVE、REVIEW | 正常桌面逐项触发并录制；不是上游demo/全关效果；在浅色实页自然融合，无黑底Canvas块/过曝，目的明确 | not_run |
| CREATIVE-01、QUALITY-01 | C01资源互斥/切换/恢复 | CREATIVE、ACCEPT | 同视口≤2活跃系统、≤1已分配存活WebGL；Electric接管前释放旧context，离屏/后台/静态/卸载清理 | not_run |
| REVIEW-01 | G01独立创意/美学 | REVIEW | 构图层级、创意贴合、浅色与蓝紫比例、节奏、克制留白各≥4/5，独立签署 | not_run |
| REVIEW-01 | G02独立使用舒适度 | ACCEPT | 下方全部舒适项通过，独立签署；无开放blocking/major | not_run |
| DEL-01 | D01干净Compose/CI/README/报告 | DELIVERY | 真实CI通过，应用/来源/使用/预算/限制/回滚/验收SHA完整 | not_run |

## 性能取证

P0没有可比的性能/包体测量，P1-BASE必须在07300db代码/同一浏览器/相同视口/网络CPU设置下取初值，包含构建产物和实际请求。前后至少3次记录中位数与原值，报告缓存/图片预热条件，不能拿不同环境的Lighthouse分数比较。

35KiB/120KiB/800KiB是项目起始预算，不是库声明或已测结果。若增加必要能力超过预算，Leader先给归因、替代方案和真实测量再调整，不能隐藏体积。单张公开封面目标≤180KiB/上限250KiB；私有结果单独计，不透过共享优化缓存拿Cookie图片。频繁动画只用transform/opacity或证明可接受的属性；不要求本轮实现自动Lighthouse平台。

## 新增行为测试

使用Vitest/RTL的matchMedia与可控动画完成回调，测试静态偏好和取消；测试dialog快速开关/Esc/路由卸载、旧退出回调不恢复焦点到已卸载元素；轮询重复相同version不重播；动画退出不延迟abort/清身份，图片错误有fallback。以真实组件/Hook行为断言，不仅snapshot。

人工浏览器记录普通/静态两模式、375px与桌面、实际多任务/查询失败/恢复、连续更换上传、身份变化与预览。CSS无法由JSDOM证明的布局/FPS/颜色必须在浏览器核验；截图不能证明动效完成，至少保留操作序列/屏幕录制或trace及观察结果。

## 七项必测演示与退化

| 场景 | 正常桌面真实动作 | 退化/结束核验 |
| --- | --- | --- |
| RB01 Dither Veil | 进入创意作品面板移动指针，观察局部点阵显色 | 切页签立刻卸载，静态显示完整原图 |
| RB02 Glow Cursor | hero留白移动后停指针，柔光衰减≤500ms | 进入操作区/弹窗隐藏释放；原生光标保留，触屏无依赖 |
| RB03 Ripple Distortion | 旅行作品页签移动，局部位移目标≤6px | ≤600ms平复；文字不动，真实结果不扭曲 |
| RB04 Halftone Reveal | 人像作品页签局部显影280–400ms | 原图/键盘静态替代，切页签释放context |
| RB05 Orbit Images | hero观察≥30s周期、悬停/聚焦/暂停按钮 | ≤900px叠卡、reduce/后台/离屏停止；主入口不被推走 |
| RB06 Pixel Trail | 宠物作品面板移动，上限24粒子 | 尾迹≤450ms、离开释放、不拦截滚动 |
| RB07 Electric Border | 指定CTA hover/focus，≤600ms且冷却≥2s | 提交中停；原focus仍清晰；Glow上下文先释放再接管，结束后反序恢复 |

所有数字为项目待验证的起始规格，不能冒充上游原生支持或本轮实测。改阈值需记录实际测量/原因/规格修订，并重新审核双门槛。

## 双门槛签署清单

美学由独立Reviewer观察完整页面与实际交互，五维逐项写评分、依据、发现及复验，不取平均分掩盖某项低分；每维≥4/5才通过。创意实现者不能自签独立评分。

舒适由Acceptance独立逐项标pass/fail并附环境/证据：阅读不遮挡；原生cursor和键盘focus；点击/输入/Tab/滚动不阻塞；无持续闪烁；静态/reduce含实时切换；375px和coarse pointer；离屏/后台/卸载/页签/弹窗/身份变化的资源与旧请求清理；最多两个活动系统和一个已分配存活context；WebGL不可用/context lost/FPS降级；前后包体/图像/CLS/trace预算；全部P0回归。任何未通过项都不能以高美学分抵消。

先记录有创意的正常模式，再测静态/降级，两者都要通过。Leader复核两份独立签署、处置并复验所有blocking/major；准备文件的只读审阅不构成产品G01/G02通过。
