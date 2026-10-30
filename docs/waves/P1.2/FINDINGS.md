# P1.2问题处置

由Leader处置；作者自测、独立审核、运行环境与产品故障分别记录，不以文字计划或静态类名证明实际效果。沿原rootTaskId累计，不通过改阶段重置失败次数。

| Finding / rootTaskId | 触发及位置 | 预期 / 实际 | Leader处置 / 复验 |
| --- | --- | --- | --- |
| IMG-01 / P12-BASE, P12-DELIVERY | 固定2成功1失败；History原PNG卡片 | 首屏全部图片≤819200B；旧制作/历史约1.45MB，每成功PNG约665k | 接受major。决定0014认证512px缩图，仅卡片，完整原PNG/预算/样例保留；18Java通过、独立auth/hash/512检查通过，最终逐页预算待独立报告 |
| ROUTE-01 / P12-ROUTE | 正常Link进入pet详情；journey.tsx公共桥 | 主体等比；首稿scaleX/Y造成狗脸拉长 | 接受major。35c53df修几何裁切，5e2实际生产Animation相位70/150/230ms视图与默认Link分别复验，Reviewer关闭；相位fixture不冒充默认帧率 |
| UPLOAD-01 / P12-STUDIO | 无图ERROR仍hover/focus；上传覆盖胶囊 | 格式说明清楚；胶囊压文字 | 接受minor。e71a3ba仅有preview时显示，Reviewer在5e2真实错误重选复验关闭 |
| LIFE-01 / P12-FOUND | 聚焦上传/活动task滚出视口，打开身份dialog | 循环视觉暂停、业务继续；作者实际复现仍running | 接受major。bb5a27a接纯视觉IO/ref、背景互斥及backdrop reduce/hidden，35FE通过；集成65fd2a1，独立复验待最后候选 |
| PREVIEW-01 / P12-DIALOG | 独立600ms原PNG受控延迟；首次开预览 | 弹窗即时且空间稳定，原图就绪短显露；实际img0×0、dialog199×138，load后img702×468、dialog760×606，无图自身动画 | 接受major。Frontend补自然比例元数据预留/真实load后单次可取消显影，原图及立即showModal保持；独立冷加载/取消/失败/美学复验待最后候选 |

另继承P11-ACCEPT原根因：远端41004518076在图片load前即时检查失败，b073修真实load/error事件等待且坏图仍拒绝，0d75集成。原失败JSON和500ms受控有效/坏图证据保留；最终CI待执行。更早reduce单帧未确认异常保持追踪，不宣称此次图片修复解决它。
