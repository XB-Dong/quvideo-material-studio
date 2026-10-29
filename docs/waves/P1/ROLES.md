# P1 多 Agent 角色与文件所有权

职责表示任务角色，不代表常驻进程。默认继承当前会话模型/推理设置，实际路由无证据则null。准备阶段没有开发Agent；启动后原生一主最多三子，独立app-managed外部worktree、codex/分支和精确基准提交。

| 角色 | 任务 | 独占写入范围 | 交付 |
| --- | --- | --- | --- |
| Leader | BASE、DIRECTION、DELIVERY | specs/p1、共享docs/state、frontend/package*.json、CI/Compose和依赖/集成 | 冻结契约、预算/owner、版本、集成证据与最终报告 |
| Frontend Visual/Creative/Motion | VISUAL→CREATIVE→MOTION顺序推进 | globals.css、前端视觉样式/动效组件、catalog/studio/history/shell；providers仅分配的动效包装与自身测试 | 完整页面、七创意与互斥/降级、动效/减弱、行为测试、截图与提交 |
| Asset Integration | ASSET | backend/demo新增版本资源、生产转换脚本、V3迁移、FilesService允许key与Api.java公开demo MIME最小改动和自身测试 | 封面/结果、来源/哈希、兼容/回滚验证 |
| Test/Acceptance | ACCEPT | tests/p1、分配的验收证据与报告草稿 | 独立舒适门槛签署（可访问性/交互/性能/P0回归）；不改产品或实现者测试 |
| Reviewer | REVIEW，资产席位释放后启用 | 分配的reviews文件；代码只读 | 独立创意/美学五维评分签署；有位置/触发/严重度的发现及复验建议，Leader处置 |

## 明确的共享边界

- globals.css、Shell、Studio、History同一时间只有Frontend写入，视觉任务完成后显式依次转入创意与操作动效任务，不开两个并发前端写分支。
- package.json/lock由Leader安装/锁定。Frontend交付所需Motion/OGL与七组件import/能力清单；不能各自升级查询库或Next版本。
- 新动效Provider不得替代/重挂QueryClient或IdentityProvider；api.ts、use-tasks.ts、types.ts、session-generation.ts为P0受保护区域，改动需独立问题、owner转交和回归。
- V1/V2不可改，V3由Asset Integration独占。schema与业务API默认不变，任何新增public路径/MIME必须同步契约及测试。
- 基线/性能采集与CI由Leader统一环境，Acceptance执行独立核验，不能拼接不同设备分数制造提升。

## 交接和集成

任务包包含根任务、SHA、规格版本、路径、依赖和验收；改角色/工作树后复读。交接含精确实现/测试SHA、命令、时间、环境、结果、失败和限制，新增素材附来源/许可/哈希。Leader核对再合入，集成版本再验证。

审核发现按accepted/rejected/deferred给理由；作者自测不标独立验收。归档工作树前保留需要的忽略测试报告；主Agent负责最终封存和停止。
