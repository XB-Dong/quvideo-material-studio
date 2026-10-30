# P1.2问题处置

由Leader处置；作者自测、独立审核、运行环境与产品故障分别记录，不以文字计划或静态类名证明实际效果。沿原rootTaskId累计，不通过改阶段重置失败次数。

| Finding / rootTaskId | 触发及位置 | 预期 / 实际 | Leader处置 / 复验 |
| --- | --- | --- | --- |
| IMG-01 / P12-BASE, P12-DELIVERY | 固定2成功1失败；History原PNG卡片 | 首屏全部图片≤819200B；旧制作/历史约1.45MB，每成功PNG约665k | 接受major。决定0014认证512px缩图，仅卡片，完整原PNG/预算/样例保留；18Java通过、独立auth/hash/512检查通过，最终逐页预算待独立报告 |
| ROUTE-01 / P12-ROUTE | 正常Link进入pet详情；journey.tsx公共桥 | 主体等比；首稿scaleX/Y造成狗脸拉长 | 接受major。35c53df修几何裁切，5e2实际生产Animation相位70/150/230ms视图与默认Link分别复验，Reviewer关闭；相位fixture不冒充默认帧率 |
| UPLOAD-01 / P12-STUDIO | 无图ERROR仍hover/focus；上传覆盖胶囊 | 格式说明清楚；胶囊压文字 | 接受minor。e71a3ba仅有preview时显示，Reviewer在5e2真实错误重选复验关闭 |
| LIFE-01 / P12-FOUND | 聚焦上传/活动task滚出视口，打开身份dialog | 循环视觉暂停、业务继续；作者实际复现仍running | 接受major。bb5a27a接纯视觉IO/ref、背景互斥及backdrop reduce/hidden，35FE通过；集成65fd2a1，独立复验待最后候选 |
| PREVIEW-01 / P12-DIALOG | 独立600ms原PNG受控延迟；首次开预览 | 弹窗即时且空间稳定，原图就绪短显露；实际img0×0、dialog199×138，load后img702×468、dialog760×606，无图自身动画 | 接受major。Frontend补自然比例元数据预留/真实load后单次可取消显影，原图及立即showModal保持；独立冷加载/取消/失败/美学复验待最后候选 |
| STATE-01 / P12-DIALOG | 真React渲染错误/恢复正常响应后点击app/error重载按钮 | 能恢复工作台；reset仍读坏查询缓存、10秒无input，global-error恢复正常 | 接受major。仅app/error的“重新加载”改真正location.reload，保留cookie/任务，不改Query/身份协议；7bd5436已部署，独立恢复复验待交接 |
| EMPHASIS-01 / P12-DIALOG | 独立MutationObserver记录dialog.open同一时点 | 短点/弹窗互斥；6个240ms p12-dot与200ms dialog/180ms backdrop同时running，持续场景则已paused | 接受minor。仅移除结果按钮pointerdown短点，让弹窗自身作强调；不会用晚采样掩盖，独立增加同一时点无bloom断言 |
| PERF-01 / P12-ACCEPT | 无截图真实Link阶段 | 不出现可归因效果的>50ms任务；捕获54ms候选，来源尚未确认 | 保留失败，独立trace归因中；不凭猜测改代码或重复抽样碰运气 |
| PERF-HARNESS-01 / P12-ACCEPT | 4MiB自动化buffer注入 | 真实文件传输；捕获729ms，A/B再次buffer611ms/真实磁盘path0，均服务器4194304B和480×640 JPEG | 确认为测试工具注入成本。保持同一真实chooser和大文件，只改磁盘path；原失败/A/B字节及时序均保留，最终无截图重测待做 |
| CLS-01 / P12-STUDIO | 三页九轮冷上下文studio-2 | 每轮CLS≤.1；实际.177731882，另两轮约.0608 | 接受major，独立补sources/前后rect归因中；不用均值或删轮次规避。全部9轮JS/图片/errors已过，仍不能签G02 |

最后本地产品候选7bd5436fce19486688e7064f59ce45f973e34ba4已集成IO持久data标记（不受slot状态class覆盖）、冷图固定画幅/真实load显露、错误页真刷新。作者39FE/lint/type全过；Leader生产构建并于13:24:08只重启frontend，DB与文件卷保持。上述未关闭项以独立最后候选证据为准，作者通过不能代替G01/G02。

另继承P11-ACCEPT原根因：远端41004518076在图片load前即时检查失败，b073修真实load/error事件等待且坏图仍拒绝，0d75集成。原失败JSON和500ms受控有效/坏图证据保留；最终CI待执行。更早reduce单帧未确认异常保持追踪，不宣称此次图片修复解决它。
