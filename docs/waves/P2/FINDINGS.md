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

## 最终验收处置更新

P2-AUTH-01：CI81a真实MySQL26项及独立账户API8/浏览器8、V3到V4旧guest升级均通过，closed。P2-PROV-01：Reviewer复核1b清理及9bd真实300文件ZIP/原许可/零旧组件，当前分发处置closed，原Git历史未来公开边界另列。P2-FINAL-01：报告R09错误把本轮时间显示归于跨时区浏览器，接受minor，改为E-FE本地日历测试并由Reviewer复核closed。

P2-FINAL-02 / P2-MEDIA：Reviewer实看全部380帧指出首页首稿末段仍清晰；Acceptance只读原WebM/GIF同坐标确认第二处尾回雾未充分进入录制，非仅trim问题，未据此断言产品坏或全renderer冻结。保留初稿/诊断/失败证据，执行一次有界headed+Xvfb真实自然停留重录；不改产品参数、不拼静态帧。该媒体子项当前open，待新片同坐标实值/全帧独立复验。

P2-FINAL-02复验：唯一实际新录使用headed+Xvfb，未改产品。自然6000ms后截图前两区画布MAE0，新WebM/GIF末同区接近初雾；Reviewer实际看新377全帧/12板及关键大图，确认末回雾，closed。旧片/原诊断保留；Xvfb PID1启动与越过末帧采样错误另记工具前置，不当作业务Red。制作片未改。

P2-FINAL-03 / P2-VERIFY：最终111提交CI41046555176 frontend/backend成功，P11 visual离屏检查1!=0、后续reduce因前例未恢复viewport而cascade。原pipeline失败保留、111附件标为撤回不提交；诊断orbit/raf实际值和原生render机会后修真实根因，既有断言、预算与CI不可削弱。Acceptance唯一获tests/p1.1/visual.mjs诊断和场景finally恢复写权；Frontend只读产品代码分析，无并行浏览器。

P2-FINAL-03局部复验：CI333真实callback映射到Ink frame、Orbit已取消；本地原600ms诊断未复现，但10,10可信目标MAIN/非排除，证明setup能误触合法尾迹，CI现场pointer因果不完整不补造。正式改用可见footer/a真实排除点与一次正常viewport render前置，600ms后原globalRAF0/Orbit0直接断言、finally真恢复；formal6/6容器exit0，独立Reviewer源审接受，不改产品/common/CI/预算，无失败后补帧兜底。该项局部修正接受，整体P2-VERIFY待正常完整远端CI重跑，111附件已withdrawn。
