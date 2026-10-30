# P1.1启动前准备报告

版本P1.1-1.0.0，基准e485792。启动前准备已完成，P1.1尚未启动。完成范围：需求/五份规格、文件地图、9任务DAG、唯一Frontend及独立角色、验收矩阵、来源/许可/import审计、静态方向板和本仓库CI邮件治理方案。文件地图与完整准备材料均已独立只读审阅通过。

## 这版准备明确的变化

- 品牌疏影；产品执行时统一页头/页脚/metadata/标识，历史证据与业务身份/数据库保持。
- 删除动态/静态及暂停/继续按钮，默认可视区持续动态，忽略旧静态偏好；自动reduce/后台/离屏/性能保护保留。
- 浅色水墨鼠标擦雾，电弧/流光/追光/像素边框，三种以上可见差异；软件默认也有真实2D/CSS/SVG动态。
- 删除灵感作品专区，四效果进入探索灵感真实Link卡片；原图信息、分类、点击、键盘/触屏和Java业务继续。
- 邮件仅本仓库CI，旧失败截图耗时强匹配旧run，最新三次已绿；选定可撤销定向归档/标签方案，不改账号全局、不关闭必要检查，不声称已停止GitHub投递。

## 证据与边界

[计划](PLAN.md)、[角色](ROLES.md)、[地图](CONTEXT-MAP.md)、[验收](ACCEPTANCE.md)、[静态提案](references/README.md)、[CI只读审计](evidence/ci-mail-readonly-audit.json)。提案使用公开领域吴云山水参考和P1已署名的卡片图片；它是SVG/PNG文档示意，不是产品截图或动效运行证据。

准备中只有本地文档/JSON/SVG与PNG参考渲染、只读源码/官方网页/CI元数据检查，没有修改或运行frontend/backend/tests/CI/Compose，没有安装依赖、重启网站、创建开发工作树或配置邮箱规则。当前运行产品仍为P1映作。G01/G02与P1.1运行验证全部not_run。

## 准备检查结果

[独立审阅](reviews/preparation-review.md)无开放blocking/major/minor；PREP-01已修正：Acceptance最终签署同时依赖CARDS与CI-MAIL，视觉/业务检查可提前进行，邮箱子项不能提前报完成。文件地图的CI范围也已与仅本仓库规则对齐。

data-only检查实际通过：9任务、9需求、packet/state依赖一致且无环，3参考文件尺寸/哈希与6候选源码审计、许可、相对链接及SVG/PNG有效；git差异证明产品和P0/P1历史相对e485未改变。最终文件哈希清单与再次检查结果保存在validation/preparation-files.json及validation/result.json。检查入口为 `python docs/waves/P1.1/validation/check_preparation.py`，仅标准库读文件与git差异，不是产品测试。

## 交付与投入

准备只本地Git提交，不推远端，避免现有workflow给本次文档变更发新通知；未用skip-ci或修改workflow掩盖检查。用户明确启动P1.1后，Leader刷新精确SHA，优先执行P11-CI-MAIL，再按任务表派发并行开发。

本次准备未从第一条动作完整计时，不填伪精确总工时；有直接时钟观测2026-10-30T10:49:35+08:00，这不是准备起点。最终封存时间记state，人工投入未知；未来6–10小时为执行投入估算，不是已耗或截止。模型默认继承会话，实际路由无独立证据保持null。
