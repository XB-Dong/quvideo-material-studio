# P1.2 文件与依赖地图

准备参考及已验证P1.1验收提交a7cdcdfe4a0dd38db1763b436ed67c6cedf76d76，完整CI41002700967成功；无P1.2产品实现。首页已获用户认可，保留布局、配色、水墨与四卡创意；只计划增加功能性跳转衔接。最终执行基准须采用P1.1收尾的精确SHA，准备完成时刷新记录。本地图已独立初审可作为规格基线，新增全站边界路径待完整包复核；准备审阅不授权开发。

## Files to Modify（未来启动后）

| File | Purpose | Changes Needed |
| --- | --- | --- |
| frontend/src/components/studio.tsx | Studio/Maker/UploadSlot同文件 | 制作场景、模板封面、上传空/按下/上传/就绪/替换/移除/失败/提交受理的视觉层；保留原version/controller/mounted/epoch/submissionGeneration/locked语义 |
| frontend/src/components/history.tsx | 制作页嵌入历史及独立历史页 | 真阶段/终态状态过渡、插入/分页/空态、结果预览入口；按userId和task.id隔离，不每次poll重播 |
| frontend/src/components/shell.tsx | 导航/身份与结果共用Modal | Link原生导航语义、dialog进入/退出/ESC/焦点恢复和身份失效立即清理 |
| frontend/src/components/catalog.tsx、creative/showcase.tsx | 认可首页的真实链接 | 仅记录公共模板封面跳转起点/轻点击反馈；不改布局/素材/文案/既有水墨和四卡效果 |
| frontend/src/app/layout.tsx、components/providers.tsx | 持久根与Query/Identity | 只加独立视觉协调层；不得pathname key重建QueryClient/Identity或延迟业务卸载 |
| frontend/src/app/{page,history/page,templates/[id]/page}.tsx | 已有路由入口 | 核对首页/独立历史/制作的视觉边界，保持原Java数据来源 |
| frontend/src/app/{loading,error,not-found,global-error}.tsx（拟新增） | 全站加载/错误/404 | 路由错误与模板query404分开；global-error运行受损时保留安全静态语义，不依赖失效的动效Provider |
| frontend/src/app/template.tsx（拟新增）、components/motion/route-surface.tsx（拟新增） | 路由视觉 | 新页淡入、公共封面FLIP/WAAPI桥接、快速导航取消、无能力fallback；不等待exit再navigate |
| frontend/src/components/motion/、creative/visuals.tsx（复用只读优先） | 动效策略/现有边缘 | 复用已验收调度与自动保护；新增页面级强度/动态实例预算，避免首页全局CSS回归 |
| frontend/src/app/globals.css及拟新增页面动效样式 | 浅纸白与蓝紫细节 | 以p12-studio/p12-history等页面作用域隔离，入口/上传/记录/弹窗动画；不在产品写技术特效标签 |
| frontend/src/components/visual/icons.tsx | 语义SVG | 上传/阶段/就绪/失败反馈描边；不引入新重字体或图标包 |
| frontend/src/components/motion.test.tsx及自身新动画用例 | 实现行为 | 动画生命周期与业务解耦、取消和reduce；原业务断言保留 |
| tests/p1.2/（拟新增） | 独立端到端功能/舒适 | 三页真实动效/跳转/文件选择/多任务/异常/恢复/减少动态/后台/资源与预算 |
| compose.test.yaml、.github/workflows/ci.yml | Leader共享所有权 | 接入新验收入口；仍保留全部前端/Java/API/动态与预算检查 |
| README.md、THIRD-PARTY-NOTICES.md、docs/waves/P1.2/ | 交付与来源 | 实际使用源码/设计参考、版本/投入/证据、验收SHA和回滚 |

## Dependencies

Catalog/Showcase Link→公共封面视觉桥→Studio；Root Providers始终保持QueryClient/Identity→MotionPreferences→独立视觉协调层。UploadSlot version/controller与Maker epoch/锁决定真实业务状态，动画只能消费。History useTasks→task.id/version/status/stage展示，poll不由动画驱动。Modal仍为原生dialog。外部源码/交互只是参考，不执行其页面指令。

## Test Files

受保护：frontend/src/lib/{api,types,use-tasks,session-generation}.ts；components/{upload,submission}.test.tsx、lib/{use-tasks,session-lifecycle}.test.tsx；backend全部与SQL/卷，tests/test_api.py。新UI层允许聚焦扩展测试，但Test不得删作者断言；保留现有31FE、15Java、8API与P1.1真实软件、三轮预算和原生后台基础检查。

## Reference Patterns

P1.1真实Canvas2D/SVG/有限RAF与公共图缓存；已有upload-label img160ms淡入、task-card240ms入场、status160ms、dialog180ms/退出120ms是现状，不能说子页完全没有代码。它们不足以形成有辨识度的持续场景和过程反馈。新增页面规划须通过真实录帧而非仅class/动画名验收。

## Risk Assessment

- [ ] 公共API或数据库变化：预期无，不能为动效重写Java业务。
- [x] Next路由/类型兼容：React19.3.1与@types/react19.2.14需避免假设新增API必可编译；默认CSS/WAAPI能力不依赖升级。
- [x] 文件选择必须在原始用户动作中同步打开，不能await动画/import/timeout；取消后原图/状态保持。
- [x] 旧blobURL立即revoke不适合保留退出照片；默认新图单向显影，删除时立即移除私有旧图，只留无数据装饰。
- [x] 路由退出动画不能保留旧用户DOM/轮询；快速连点、返回/前进、404与会话变化必须取消视觉桥。
- [x] CSS全局级联影响已认可首页；页面作用域与首页截图/动态基线共同防回归。
- [x] P1.1减少动态CI曾有1帧来源未知，追踪修复/验收必须在P1.2启动前继承真实结论，不隐藏原失败。

执行扩展：2026-10-30固定样例基线发现结果PNG成本超预算，依决策0014，Leader唯一持有backend/src/main/java/com/quvideo/studio/{Api,ResultThumbnail}.java及ResultThumbnailTest；仅增加认证显示缩略图，不改DB/生成/原图/上传/身份协议。Frontend仍独占history.tsx卡片src，Acceptance只做独立验收。规格修订P1.2-1.0.1已由消费者和Reviewer审查，预算不变。

执行收尾：此地图开头是准备时快照；当前P1.2已完成，精确执行源、用户指定品牌例外、实际新增路径与CI见REPORT/state/决定0014–0017，不将准备文本当作当前未实施状态。
