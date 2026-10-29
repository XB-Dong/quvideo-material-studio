# P1 文件与依赖地图

基准：07300db74eefe5d8d1ecf979de314450bf5f2a78；P0 验收4dd397f。2026-10-29 主 Agent 已读取现有组件、状态 Hook、样式、种子及16项前端测试，审阅本地图。用户已明确启动P1；Leader复读P0源文件/测试/Compose后确认本地图可用于实现。

## Files to Modify

| File | Purpose | Changes Needed |
| --- | --- | --- |
| docs/waves/P1/、specs/p1/ | 准备与规格 | 计划、视觉方向、素材清单、动效、角色、任务、验收与状态 |
| frontend/src/app/globals.css | 未来P1主题与响应式 | 现有823行，青柠强调色；改为浅中性底色、蓝紫细节的token、动效分层和减弱规则 |
| frontend/src/components/catalog.tsx | 未来P1列表 | 分类、封面、入场、hover/focus与图像加载 |
| frontend/src/components/studio.tsx | 未来P1制作 | 上传反馈、布局、提交按钮动画；保持UploadSlot/Maker生命周期 |
| frontend/src/components/history.tsx | 未来P1历史 | 按task.id稳定key进行卡片/状态动画；保持请求错误分离 |
| frontend/src/components/shell.tsx | 未来P1公共壳/弹窗 | 品牌、导航、动效开关与原生dialog进退场、Esc/焦点 |
| frontend/src/components/providers.tsx | 未来P1动效配置 | 只增加隔离的动效Provider；不重建身份Provider或QueryClient |
| frontend/src/components/react-bits/、creative/、motion/ | 未来P1创意适配 | 七组件源/完整许可、本地适配、互斥控制器、惰性加载、偏好与资源清理；同一Frontend写入 |
| backend/src/main/java/com/quvideo/studio/Api.java、FilesService.java | 未来P1公开资源 | demo现在硬编码image/png；JPEG封面必须允许key+明确MIME最小适配，私有结果PNG不变 |
| frontend/package.json、package-lock.json | 未来P1依赖 | Motion/OGL候选及七组件源码启动时验证并锁定；Leader单写 |
| backend/src/main/resources/demo/ 与 V3迁移 | 未来P1素材接入 | 新资源与新key；保留旧结果文件及V1/V2，不更改业务API |
| tests/、.github/workflows/、README | 未来P1验收交付 | 添加动效/图像/可访问性门槛，保留全部P0检查 |

## Dependencies

Java模板coverUrl → Next Catalog/Studio；私有resultUrl → History/Modal；TanStack useTasks/identity generation → 实际业务状态 → 视觉动画。动画不能决定业务状态或延后取消请求。

## Test Files

frontend/src/lib/use-tasks.test.tsx、session-lifecycle.test.tsx、components/upload.test.tsx、submission.test.tsx 为P0的16测试保护线。backend JUnit12、tests/test_api.py8组独立接口保护业务。新增P1动效/对比度/断点/素材/性能验收，不能以截图替代状态回归。

## Reference Patterns

P0 波次目录、任务包/交接/证据与一主最多三子机制继续使用。P1角色按视觉工作重排，明确唯一文件owner，不让两个前端Agent同时修改globals.css或Shell。

## Risk Assessment

- API语义保持；素材key改变必须采用新V3迁移和向后兼容文件，既有成功结果不可被覆盖。
- 卡片重挂载、退出动画等待、弹窗focus、旧401与提交锁是高风险回归点。
- React Bits七项均需实现但分区互斥，美学/舒适分别审核；候选源码许可为MIT + Commons Clause，不能写成纯MIT。
- 版本化JPEG封面/PNG结果、公开demo MIME适配与成套快照回滚/再次升级必须一致。
- 安装/构建/产品测试均在容器；开发工作树使用独立Compose project，不能覆盖主环境。主环境升级前保留P0镜像及匹配数据库/文件快照。
