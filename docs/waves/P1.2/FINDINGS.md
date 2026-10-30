# P1.2问题处置

由Leader处置；作者自测、独立审核、运行环境与产品故障分别记录，不以文字计划或静态类名证明实际效果。沿原rootTaskId累计，不通过改阶段重置失败次数。

| Finding / rootTaskId | 触发及位置 | 预期 / 实际 | Leader处置 / 复验 |
| --- | --- | --- | --- |
| IMG-01 / P12-BASE, P12-DELIVERY | 固定2成功1失败；History原PNG卡片 | 首屏全部图片≤819200B；旧制作/历史约1.45MB，每成功PNG约665k | 接受major并关闭。认证512px缩图仅卡片，原PNG/预算/样例保留；18Java与独立auth/hash检查通过，8a正式九轮图片最大560902B，制作176902B/历史133554B |
| ROUTE-01 / P12-ROUTE | 正常Link进入pet详情；journey.tsx公共桥 | 主体等比；首稿scaleX/Y造成狗脸拉长 | 接受major。35c53df修几何裁切，5e2实际生产Animation相位70/150/230ms视图与默认Link分别复验，Reviewer关闭；相位fixture不冒充默认帧率 |
| UPLOAD-01 / P12-STUDIO | 无图ERROR仍hover/focus；上传覆盖胶囊 | 格式说明清楚；胶囊压文字 | 接受minor。e71a3ba仅有preview时显示，Reviewer在5e2真实错误重选复验关闭 |
| LIFE-01 / P12-FOUND | 聚焦上传/活动task滚出视口，打开身份dialog | 循环视觉暂停、业务继续；作者实际复现仍running | 接受major并关闭。纯视觉IO/data标记、背景互斥与backdrop保护；独立离屏/恢复通过，8a真实三页后台及冷PNG加载RAF0/GPU0/动画停止 |
| PREVIEW-01 / P12-DIALOG | 独立600ms原PNG受控延迟；首次开预览 | 弹窗即时且空间稳定，原图就绪短显露；实际img0×0、dialog199×138，load后img702×468、dialog760×606，无图自身动画 | 接受major并关闭。固定自然比例/真实load单次显影；b2严格cold6、Reviewer708ms冷图及8a后台冷加载通过，原PNG和同步showModal保留 |
| STATE-01 / P12-DIALOG | 真React渲染错误/恢复正常响应后点击app/error重载按钮 | 能恢复工作台；reset仍读坏查询缓存、10秒无input，global-error恢复正常 | 接受major并关闭。仅app/error按文案真实reload，cookie/任务/Query协议保持；独立两框架错误界面及真实input恢复通过，非用query404代替 |
| EMPHASIS-01 / P12-DIALOG | 独立MutationObserver记录dialog.open同一时点 | 短点/弹窗互斥；6个240ms p12-dot与200ms dialog/180ms backdrop同时running，持续场景则已paused | 接受minor并关闭。仅移除结果按钮短点，独立在dialog打开同一时点断言无bloom通过，非晚采样回避 |
| PERF-01 / P12-ROUTE, P12-ACCEPT | 无截图真实Link阶段 | 不出现可归因效果的>50ms任务；54ms由React29ms与桥connect24ms聚合，含强制Layout15.884ms | 接受并关闭。RO自然布局阶段消除原connect强制布局堆栈；8a独立无截图所有操作及30秒longtask0，未凭猜测改Ink或只挪计量窗口 |
| PERF-HARNESS-01 / P12-ACCEPT | 4MiB自动化buffer注入 | 真实文件传输；729ms，A/B再次buffer611ms/真实磁盘path0，均4194304B和480×640 JPEG | 确认为工具成本并关闭。保留同一chooser/同字节大文件，改真实磁盘path，8a正式interaction longtask0；原失败与A/B保留 |
| CLS-01 / P12-STUDIO | 三页九轮冷上下文studio-2 | 每轮CLS≤.1；原.177731882，有界复现.179281，main margin塌陷上移56px | 接受major并关闭。仅Studio flow-root/稳定初高，8a正式制作三轮≤.000121，全部九轮≤.025754；不靠均值或删轮次 |

当前产品8a3f8bd12c1fc889566e82f9c2ad95cd96544524已部署，作者41FE/lint/type通过；独立本地G01/G02均签署，版本继承及实际新运行分别见交接。全部产品发现关闭，完整CI/Leader最终交付仍待完成。截图harness遇到两次100→92即时等式失败后按原root停重诊，确认规定8px有限入场，改等真实Animation.finished比较稳态；原失败保留，不动正式CLS门槛。

继承P11-ACCEPT：41004518076图片load前即时断言失败，真实load/error等待修复与500ms受控有效/坏图证据保留。41009662714再现reduce1RAF时，native flagtrue但原生事件未交付/所有RAF未前进；独立review后给像素功能测试一次真实viewport渲染机会，要求本次trusted事件及原清理硬断言。8a本机6视觉通过，c7远端P11视觉步骤通过，完整CI仍进行中。底层浏览器停帧根因未证实，不能把图片修复或新渲染前置宣称为已确认的产品根因修复。

首次提交76ms / P12-STUDIO：fab完整CI的P12功能25/视觉16通过，但无截图首提交76ms，Leader接受并保留。两次独立限定CPU采样在卡片toLocaleString有29–32ms热点；仅改本地Date字段显示，原时区/ISO保留。3008三时区18条实际文字比较与相同无截图交互longtask0，正式九轮逐轮通过，局部关闭，完整新CI待复验。当前部署3008取代上文历史8a，作者48FE通过；最新G01/G02均已更新，见REPORT与交接。

最终处置：验收ff8a896/完整CI41021360156通过全部原必需检查，首次提交76ms修复在正式原无截图流程复验longtask0。当前产品无开放blocking/major；12KiB规划目标未达到、硬预算通过的限制保留，实际硬件未测不冒充通过。
