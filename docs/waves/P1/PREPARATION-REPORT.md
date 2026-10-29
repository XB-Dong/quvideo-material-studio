# P1 启动前准备报告

完成时间2026-10-29T22:22:24+08:00，规格P1-1.1.0。P0封存07300db；本轮只准备文档、候选素材、来源审计、方向板与独立只读审阅。P1产品开发未启动，依赖/页面/数据库/服务未修改，实际产品美学和舒适门槛仍not_run。

## 准备交付

- [波次计划](PLAN.md)：九任务包、依赖/交接、投入估算10–14h、完成与停止条件。
- [角色与唯一文件所有权](ROLES.md)：Leader，Frontend视觉→创意→操作动效，Asset Integration，Acceptance；资产完成释放席位给Reviewer，最多一主三子。
- [需求](../../../specs/p1/requirements.md)、[视觉](../../../specs/p1/design.md)、[素材](../../../specs/p1/assets.md)、[操作动效](../../../specs/p1/motion.md)、[七创意契约](../../../specs/p1/react-bits.md)和[验收矩阵](ACCEPTANCE.md)。
- [来源/素材参考](references/README.md)、[主题方向板](references/direction-board.svg)、[七创意场景图](references/creative-scene-map.svg)：原创静态提案，四张候选已保存并看图，尚未接入生产。
- [素材清单](references/manifest.json)、[React Bits审计](references/reactbits-audit.json)、[检查脚本](validation/check_preparation.py)和[独立准备审阅](reviews/preparation-review.md)。

## 七创意与克制规则

Hero使用Orbit Images与低强度Glow Cursor，单个CTA使用Electric Border；Dither Veil、Ripple Distortion、Halftone Reveal、Pixel Trail放在四个互斥的局部体验页签。七项正常桌面均可触发，上传和真实结果保持原样。

同视口≤2活跃系统、≤1已分配存活WebGL；切换先释放旧context。提供全局静态/系统reduce、触屏/小屏、离屏/后台和性能降级。美学由Reviewer五维各≥4/5，舒适由Acceptance逐项全部通过；两份独立签署，无开放blocking/major才完成，不能全部关效果来代替创意。

## 验证范围

准备检查结果见[validation/result.json](validation/result.json)；验证九任务/需求映射/无环依赖、授权false、来源哈希、两SVG XML、相对链接及P0产品文件未变。四张JPEG已人工看图并检查尺寸/哈希；主题板仅是静态编排，未将其标为实际动画或运行页面。

P0历史验收CI为[40854073869](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40854073869)，封存提交CI为[40855032487](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40855032487)，此前核对均success。P1未安装Motion/OGL，未验证运行兼容/帧率/真实包体/新素材生产裁切，未运行P1产品测试；这些是启动后BASE及独立验收的工作，不能引用P0结果代替。

来源核对采用公开作者/官方文档及registry只读研究；外部设计网站部分只有说明/色卡可读，不声称已经完整体验其动画。React Bits为MIT + Commons Clause，OGL为Unlicense，详细出处在来源说明。原始题目和用户截图作为设计参考，不转为产品素材。

## 下一步与边界

准备审阅已闭环，state为ready_for_user_start，executionAuthorized保持false。用户明确启动P1时Leader先复核最新精确基准/来源/许可、记录实际开始与基线，按九任务依赖派发；所有构建/依赖安装/产品测试继续在容器中。投入10–14h是后续估算；本次准备未连续计时，未虚构实际工时，完成时间在验证/审阅记录。

采用AI协作：Leader读取P0及原项目范式→拆解规格与任务→查官方来源/素材→生成文档和静态板→只读Reviewer找出MIME、Flyway回滚、许可与WebGL所有权问题→修正规格并复审。未使用私人对话或凭据作为交付内容。准备完成不自动进入开发或下一波次。
