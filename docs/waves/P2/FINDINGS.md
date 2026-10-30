# P2准备审阅处置

以下仅为准备文件发现；不把未编码方案的问题冒称实际产品失败。正式实现发现另按原rootTaskId记录，失败次数不得重置。

| Finding | Leader判断与处置 | 修订与复核 |
| --- | --- | --- |
| P2-PREP-01 major，同源PATCH消费与owner缺失 | 接受。Leader实读现有catch-all只有GET/POST，通用proxy已能透传method/body。准备中明确Frontend独占route.ts的PATCH导出，原GET/POST不动；规格/地图/角色/packet/state同步，Acceptance通过前端入口验证200/400/401/403、code/cookie | 已修准备，未改产品；Reviewer在1790a91独立复核关闭 |
| P2-PREP-02 minor，最终迁移清单漏V4 | 接受。最终ZIP清单明确V1～V4账户迁移与种子，实际entries核对；不能仅因旧V1～V3存在就算新账户包完整 | 已修DELIVERABLES；Reviewer在1790a91独立复核关闭 |
| P2-PREP-03 minor，VERIFY前候选包生产点不明确 | 接受。DOCS末/VERIFY前Leader生成冻结候选ZIP+entries/manifest到仓库外确定根路径；VERIFY绑定该包hash，SEAL重包核对可执行/命令/必要项与最终entries/hash，执行内容变更重验，非执行文档/GIF差异明示 | PLAN/DELIVERABLES/ACCEPTANCE、DOCS/VERIFY/SEAL包与state同步；Reviewer在1790a91独立复核关闭 |

Leader另修计数字段：总追踪单元87=原题R条款69+提交/验收规则8+用户账户/动图/公开准备10；不是“官方有87项独立要求”。不改变原R编号。最终GIF由Acceptance独占两指定文件，Leader写README/说明引用，防止docs/submission父路径多人竞争。

准备修订仍不授权P2执行。独立准备审核结论见reviews/preparation-review.md，产品/账户/GIF/最终包均没有借此标为已验收。

最终准备处置：Reviewer实际复核1790a91后3项全部closed，无开放blocking/major/minor。PREP通过，仍停在ready_not_started。新账户/动图/最终包等产品门槛未执行，不因准备签署变为已完成。

## 执行发现

P2-AUTH-01 / P2-BE-USER：作者同guest并发注册用例发现等待user锁后二次require读到MyBatis一级缓存旧session，实际409而预期旧token401。Leader接受major；账户READ_COMMITTED+锁SELECT flushCache强制重读，作者26Java通过，失败保留，独立/CI复验待执行，不冒称准备审核证明运行。

P2-PROV-01 / P2-AUDIT：Reviewer指出六组未挂载上游完整组件源码不应以应用集成名义附送。Leader接受，唯一删除12文件与无引用OGL并更新当前来源范围，实际Orbit/原许可/效果保持；Git历史不改，未来公开审计单列。待独立复核/新构建验证。
