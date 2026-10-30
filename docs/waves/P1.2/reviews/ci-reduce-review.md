# 旧P11实时reduce CI失败的独立诊断审核

原rootTaskId **P11-ACCEPT**，不因当前P1.2改名或清零历史。Reviewer为`p11_design_review`，实际provider/model/reasoning均null。只读源码与已下载原始证据，唯一写本文件；未开浏览器、运行产品/测试、改MotionPreferences/Orbit/CI/harness或占用Acceptance性能窗口。

**结论：本次可以定位pending请求与Orbit的IO/wake调用结构相符，但不足以签“产品unmount漏cancel”或“CDP根因已证明”。Leader提出的单次真实渲染前置修正可接受，必须保留原失败与硬断言，并按下述边界验证。它是功能harness方案的审核，不是CI/G02通过或根因最终关闭。**

## 读到的证据

远端e4e候选CI41009662714，frontend/backend成功，integration旧P11 visual六项中五项通过，实时reduce失败`1 !== 0`。原始`runtime/p12-remote-41009662714/{browser-evidence.zip,integration.log,reduce-before-assert.json}`保持原样。

| 字段 | a | b | 含义及限制 |
| --- | --- | --- | --- |
| observedAt | 33329ms | 33574.1ms | 页面evaluate任务能够执行，不证明渲染步骤正在推进。 |
| reduce / hidden | true / false | true / false | 查询当前匹配值与文档可见性，不等于已向旧MQL对象交付change。 |
| motionStatic / orbit | false / 1 | false / 1 | Provider仍是动态分支，Orbit还在DOM；尚未看到其因reduce卸载。 |
| rafPending / rafExecuted | 1 / 222 | 1 / 222 | 约245ms内既未执行也未取消；不是“仍不断执行动画”的证据。 |
| native media-change trace | 0 | 0 | init已挂诊断MQL listener；当前history没有本次原生change。不能据此判断底层浏览器的确切原因。 |
| pending | id238，32808.2ms，callback f | 相同 | 堆栈是lazy chunk的`v`经IntersectionObserver.threshold请求；与Orbit源码IO→wake→RAF结构一致。 |

最后一次execute为id236、31278.9ms；随后id237请求后取消，恢复视窗过程中32808.2ms仅新请求id238，直到b仍无execute。旧trace保留256项，此段没有后续大量事件冲走本次media-change的迹象。

已读`MotionPreferences`、`OrbitImages`、`tests/p1.1/visual.mjs/common.mjs`，以及旧CI41001166550失败/本地12次最小与CPU4全视觉通过的诊断记录。后者明确写未本地复现且根因未知，不能以历史绿替换此次远端失败。

## 源码与判断

`MotionPreferences`先同步读取MQL并注册原生change，回调才更新systemReduced；enabled变false时CreativeShowcase不再挂Orbit。Orbit的destroy会标记destroyed、cancel当前st.raf并断开IO/监听。当前motionStatic=false且Orbit仍在，因此本次快照尚未走到这一产品卸载分支，不能仅凭id238判destroy遗漏。

Orbit自身onMotion会更新reduced后wake；frame有速度缓降，若父策略没有及时卸载仍可能短时安排帧。这是必须在**真实事件已交付**条件下继续验证的产品边界，不能因目前事件缺失就宣称整个产品已排除问题。

前一个offscreen用例恢复viewport/scroll后只等待Orbit节点存在，不能保证新实例已实际走过一次渲染帧。本次所有RAF同时停止执行、原生MQL事件缺失，而普通evaluate仍能运行，支持“渲染/媒体通知前置可能没推进”的假设，但不是其确定原因。浏览器/driver状态、事件交付和产品更新必须分别记录。

CSSOM View把MQL change定义为媒体匹配变化的事件通知，并要求该步骤产生trusted事件；HTML将媒体评估/报告变化纳入渲染更新阶段。因此读取matches=true并不替代事件与渲染前置。这里只用标准解释可区分的阶段，不借标准反推本次Chromium内部故障。[CSSOM View](https://drafts.csswg.org/cssom-view/#evaluate-media-queries-and-report-changes)、[HTML渲染更新](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering)。

## 可接受的有界harness方案

1. 固定同产品SHA、浏览器/driver、完整既有视觉序列，记录emulate前匹配值、时间、motionStatic/Orbit、Hero可见交集、hidden/focus和RAF history。节点存在不冒称动画已运行；不能以测试自身RAF polling增量充当Orbit执行。
2. 在`emulateMedia(reduce)`后，仅**一次**普通viewport真实截图/原生captureScreenshot提供渲染机会；不使用fullPage、不用animations:disabled、不改document.hidden、能力消息或DOM、不手工dispatch MQL change，不由失败后循环截图碰绿。记录截图前后及耗时；这是已有像素功能用例，不是无截图性能采样。
3. 既有init listener必须观察到本轮时间范围内`media-change(matches=true,isTrusted=true)`，有界500ms事件前置，超时仍fail。不能接受前一轮旧事件、仅matches=true或脚本伪造事件。保留前置开始/结束及原生事件时间，不能把截图开销隐为产品响应性能。
4. 继续保留原500ms/200ms两次采样和**RAF0、GPU0、executed不增、无无限运行CSS**断言；另外建议硬断言a/b的motionStatic=true、Orbit=0、hidden=false，并确认Hero仍可见，避免截图/离屏偶然停帧代替Provider正确响应。
5. 若原生事件已到达仍不能清理，按真实产品/调度故障追踪pending owner及cancel/unmount证据；若事件交付后由产品自行进入static、卸载Orbit并清帧，只能支持“原harness缺少真实通知/渲染前置”的结论。没有原生事件仍是失败/未验证，不能降级为跳过或给CI绿色。

该方案没有替产品调用cancel，也没有放宽RAF0。普通截图可能改变后续帧推进，所以必须保留原不含该前置的失败及新完整轨迹，并对比解释；不能声称仅新增截图就证明浏览器bug根因。无需给产品加轮询MQL或无根据改Orbit缓降逻辑。

## 验证与交接

Leader独占`tests/p1.1/visual.mjs`的本次有界修复；所有实际容器执行/CI结果由其或Acceptance记录。本Reviewer当前只审核方案；尚未亲自运行A/B，也未看到新CI成功，不写通过结果。保留原P11-ACCEPT累计记录，同一修复思路两次无效后须转有证据的有界诊断，不追加sleep或反复重跑碰运气。产品美学报告不因本诊断被重写，P1.2最终G02仍等待包括该门槛在内的真实结果。

## 已落地harness差异的最后核对

已实际只读核对`0d444fd87d208d522bd366c2674c12ba6824c6a0`与其parent：唯一可执行代码差异为`tests/p1.1/visual.mjs`（另两项为Leader决定/问题追踪文档），产品MotionPreferences/Orbit未修改。本审核不启动浏览器或运行该脚本。

- `emulateMedia(reduce)`后只调用一次`page.screenshot({fullPage:false, animations:'allow'})`，普通viewport且不禁动画；没有dispatch媒体change、设置hidden、修改能力或失败后补帧循环。
- 截图前后保存beforeEmulate/beforeRender/afterRender、sequenceStart、renderDurationMs到`reduce-render-delivery.json`；原`reduce-before-assert.json`继续保留a/b及delivery/Hero。旧远端失败ZIP/轨迹不覆盖。
- 原init trace中必须有`kind=media-change/matches=true/trusted=true/at>=sequenceStart`，故不能用旧事件或仅matches真代替。`waitForFunction`显式`polling:20`，不会使用默认RAF polling自身帧制造“产品动画运行”证据；超时仍失败。
- 原500ms/200ms两次采样、RAF0/GPU0、执行数不增及无无限运行CSS的硬断言保留；新增a/b motionStatic=true、a/b Orbit=0、hidden=false及Hero仍与视口相交，防离屏刚好停帧掩盖Provider未响应。
- restore保留原300ms后再用有界timer polling确认nonstatic、Orbit重新挂载。该检查证明恢复分支/节点可用，**不单独证明Orbit位置已经前进或真实帧率**，报告须按实际证据表述。

**源码审核可接受，未见以截图替产品清理或放宽门槛的改动。** 精确时序边界：当前500ms是**截图完成后**等待本次trusted事件的有界poll，并非从emulate调用开始绝对500ms交付承诺；截图耗时单列，不能混称为产品响应性能。单次截图调用也不声称浏览器内部严格只产生一个帧。原有500/200观察窗口没有删除，截图功能路径不能冒充无截图性能路径。

此刻尚未运行本机或新CI；没有因此确认CDP内部根因、关闭原未知诊断或签G02。后续若真实事件到达却static/卸载/RAF断言失败，仍按产品问题查；若事件没有交付，仍失败，不能跳过。唯一审核文件至此冻结，可随候选封存；需要新增证据时由Leader明确派发后再补，不改旧失败。
