# P1.1 文件与依赖地图

基准e485792839d6c3af1a6587a8964f983250366b39；P1产品验收a2505ec。当前仅准备，未授权实现。用户截图作为现有“探索灵感”卡片布局参考；下一版品牌为“疏影”。Leader已读取下面源文件和原测试；独立p11_design_review已只读审阅本地图通过，确认可作为规格准备基线。

## Files to Modify（启动后）

| File | Purpose | Changes Needed |
| --- | --- | --- |
| frontend/src/components/shell.tsx、frontend/src/app/layout.tsx、frontend/public/icon.svg | 品牌与导航 | 可见“映作”改“疏影”，删MotionToggle；保留身份、导航、原生dialog与焦点生命周期 |
| frontend/src/components/motion/preferences.tsx、providers.tsx | 动态策略 | 正常默认持续动态；移除手动静态与旧yingzuo-static影响；保留reduce/后台/离屏/能力保护，不重挂QueryClient或Identity |
| frontend/src/components/creative/showcase.tsx | Hero与效果调度 | 删灵感作品/gallery-tabs/gallery-panel及暂停/继续；Orbit可视区低速连续，取消hover/focus手动暂停契约 |
| frontend/src/components/catalog.tsx | 真实模板卡 | Dither/Ripple/Halftone/Pixel按template.id映射到真实Link卡封面；分类不串图/效果、直接导航、不加效果注释 |
| frontend/src/components/creative/（新背景/边框/卡片适配） | 新视觉能力 | Canvas2D擦雾、CSS/SVG多边框基础路径；单卡WebGL增强，低能力也有真实动态 |
| frontend/src/app/globals.css | 浅色水墨主题 | 水墨背层与阅读纸面分离；蓝紫边框、层级、焦点、触屏/系统reduce自动样式 |
| frontend/src/components/react-bits/及ADAPTATIONS.md | 复用来源 | 保留许可/上游来源，迁移已有七种视觉语言；新增候选仅提取所需能力，不照搬整套demo |
| frontend/public/（未来背景衍生图）、素材转换脚本 | 水墨资源 | 启动后生成本地轻量背景，合法来源/哈希/预算；不改原模板/结果图片、Java业务或迁移 |
| frontend/src/components/motion.test.tsx、gpu-policy.test.ts及新自身用例 | 实现行为 | 去按钮后的旧偏好、系统reduce、分类/卡ID隔离、资源互斥/卸载 |
| tests/p1/与未来tests/p1.1/ | 独立验收 | 替换失效UI断言，保留业务回归；原生后台/真实coarse；图片统计包含CSS/fetch/位图而不只img |
| .github/workflows/ci.yml、CI辅助检测脚本 | CI与邮件任务的只读基线 | 核对旧失败与现有检查；通知通过本仓库定向邮箱规则处理，默认不调整触发器/文档分流，不关闭必要检查。若新视觉验收接入确需改CI，由Leader记录独占所有权后执行 |
| README、当前导航/规格/状态/交付 | 计划与追踪 | 新品牌/新交互/CI通知方案、实际证据与限制；P0/P1历史原件不追改 |

## Dependencies

Java模板接口→Catalog→按稳定ID的卡片视觉；Shell→Motion策略与身份；背景/边框/卡片→统一调度→实际Canvas2D/WebGL释放。Next代理、任务轮询与会话generation独立于视觉。GitHub自动发信来自Actions账号通知，网站没有邮件服务，不能用改Java假装处理邮件。

## Test Files

受保护：frontend/src/lib/api.ts、types.ts、use-tasks.ts、session-generation.ts及其原业务测试；components/upload.test.tsx、submission.test.tsx。Java15与tests/test_api.py8项保持。P1的31前端测试中仅手动按钮/旧gallery专属断言按新需求替换，不删除多任务/旧响应/401/提交锁保护。

## Reference Patterns

P1 SafeEffect/context-lifecycle登记真实GL、Worker预检与弱设备保护；原生CDP标签隐藏工具；逐轮预算guard与保存失败；P1图像预算漏检已真实修复，不得在新CSS背景中再漏计。品牌内部兼容标识可保留，cookie/Java包/库名/卷/仓库不随UI改名。

## Risk Assessment

- [ ] 公共业务API变化：预期无；如发现必要变更先记录owner与消费者。
- [ ] 数据库迁移：预期无；不改V1/V2/V3、不清历史。
- [x] 视觉/配置变化：按钮、布局、品牌、背景、多边框与CI触发需独立规格。
- [x] 去按钮但沿用旧静态localStorage会造成永久静态；必须单独验证。
- [x] 新水墨若占唯一GPU，软件默认路径可能全静态；基础能力须2D/CSS/SVG可见。
- [x] 多卡全开、背景遮字、动态闪烁、点击被Canvas截获、旧gallery查询残留和CSS图片漏预算是重点风险。
- [x] 邮件账号设置可能影响其他仓库；准备只读，启动后按用户选择的作用域执行。
