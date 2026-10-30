# P2 验收与准备门槛

当前仅定义规则，全部执行项pending_execution。已有源码/CI事实见BASELINE，不将其写成P2执行结果。

| Gate | 可观察验收 | 证据/owner |
| --- | --- | --- |
| PREP | 计划/契约/地图/角色/包/基线/逐条底稿/媒体/投入口径完整；精确可达SHA、无循环依赖；独立准备审核无未处置blocking/major | data-only核对及preparation-review；Leader |
| REQ | R-01～R-14及R-13九子项逐条对应源码、命令/运行SHA、实际结果/限制/结论；历史和最终不混 | 用户报告；Leader，Final Reviewer只读 |
| ENTRY | 最终README可独立读懂版本/初始化/配置/连接/运行/演示/限制/AI/来源/回滚；旧阶段为历史索引 | Leader/Final Reviewer |
| USER | 注册/登录/退出/昵称与邮箱/改资料/改密、访客保留、注册作品保留、旧session撤销、未知POST和迟到cookie/数据/401隔离，V4升级 | BE/FE作者测试及Acceptance独立实际场景，不拿旧匿名证据代替 |
| CORE | 三阶段顺序/边界/失败中断/查询只读/终态；真实上传/受理异步、多任务、查询异常≠失败、停止/取消/身份隔离、刷新/预览 | 现有Java/FE/API及独立实际记录；Acceptance |
| CI | 精确候选前端lint/type/test/build、Java真实MySQL测试/package及所有现有CI必需项通过，无skip或放宽 | CI URL/SHA/jobs/必要产物/exit；Leader核对 |
| CLEAN | VERIFY前Leader生成候选ZIP并绑定SHA，先从该包在仓库外全新目录、独立Compose项目/空卷构建并up --build，健康/本地素材/初始化/闭环通过；不依赖现有app/数据库；SEAL再核最终包可执行树/运行命令等价及entries/hash，改变则重验 | 容器版本/命令/源/时间/exit及日志摘要；Acceptance |
| MEDIA | 两个真实GIF：首页山水鼠标擦雾为重点，另含上传/任务/历史；可播放、不过度压缩、无敏感数据，Reviewer看整段 | MEDIA要求/记录/元数据/hash；Acceptance录，Final Reviewer审 |
| PACK | ZIP包含源/锁/SQL种子/demo/CI/Compose/README/必要许可，无凭据/缓存/运行数据；每附件<100MB，总<=6；哈希/解压复验 | archive entries/检查/manifest；Leader |
| READ | 私库链接不冒称可读；默认ZIP实际可读；若改为只交repo则有特定评估者授权验证 | 提交说明与权限事实；Leader |
| PROV | 全部分发代码/素材来源与适用许可明确、原许可保留、原创授权范围单列；未知项有处置 | provenance-review及Leader逐项接受/拒绝/暂缓理由 |
| OPEN | 当前树+Git全refs/历史和相关附件披露面有审计；题面/邮件图/个人路径/受限许可有具体去留、历史影响与未来操作方案 | 公开准备审计；不等于已公开或全部可任意重新许可 |
| TRUTH | 人工粗估与记录/未知分开；实际AI工作流及修正例；未实现/未验证/非目标如实列出，不虚构工时或独立审核 | effort、用户报告、签署 |
| SEAL | Leader核对集成版本/CI/源包/报告/动图、提交说明/manifest一致，说明已满足与剩余公开前事项，停止 | 最终签署与仓库外清单；用户自行交卷 |

独立公开准备审计可以给出“未来公开前仍需操作/授权”的结论；公开可见性本身不是小影必需项。若存在会影响本次合法源码分发的许可问题，不得仅放到未来，必须在提交门槛前处置或如实标阻塞。行为失败/环境阻塞/历史通过分别记录；同根因两次无效修复后有界重诊，不换任务重置。

PREP通过后仍停在ready_not_started。P2运行全部在容器，准备阶段只做文档/JSON/路径/Git元数据核对，不启动产品测试、录制或打包。
