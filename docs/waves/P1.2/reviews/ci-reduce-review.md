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

## CI41012646536离屏IO失败的有界诊断方案审查

依Leader新派发重新打开本诊断文件；产品美学报告保持冻结，不启动浏览器/测试/性能，不修改产品或helper。原P11-ACCEPT记录和累计失败保持，P12离屏按既有LIFE-01/P12-FOUND、P12-ACCEPT追踪，不把相似症状当作同一已证实根因或换波清零。

### 已读到的当前结果

CI候选`c7f2af60f2ef23102eb2838d0066007248db1363`，run41012646536：Leader报告旧P11全过，含新MQL交付前置；已实际读取`runtime/p12-remote-41012646536/integration.log/lifecycle.json`，P12 visual为14pass/2fail，失败分别为focused upload offscreen仍animate、active task offscreen仍animate。原生命周期JSON只保存失败字符串；没有失败时完整IO callback/data属性快照，不能据它补造未采集的通知状态。

已只读检查现有`tests/p1.2/lifecycle.mjs`：scroll/resize后等200/250ms，读取负BCR及getAnimations；未审计产品原生IO回调是否实际送达。`useSceneVisibility`在实际IO callback内切换class与data-p12-offscreen，CSS以该属性暂停上传/任务的持续动画。因此“BCR已负”只是几何条件，不能直接等同产品observer已收到false；同样也不能因为新MQL门槛成功，就认定本次IO一定是同一个headless/CDP原因。

### 接受的诊断边界（等待实证，不提前采用根因结论）

1. **审计真实产品observer**：启动时透明记录原生IntersectionObserver实际callback和原始entries；保留observer/target标识、本次序列时间、isIntersecting/intersectionRatio、rootBounds/boundingClientRect，以及原产品callback前后class/data属性。参数和值原样转交，不能制造false entry、调用takeRecords消耗通知、手动写data属性或自己暂停动画。只新建一个测试probe observer收到false，不足以证明产品observer的回调已交付。
2. **不要伪造可信标记**：IO callback不是MediaQueryList Event，没有标准isTrusted属性。原生来源由调用链/真实entry审计说明，不能照搬MQL的trusted=true字段冒充浏览器证据。
3. **单次固定渲染前置**：在实际目标已滚离视口后，一次普通viewport截图，fullPage=false、animations=allow；保存截图前后BCR、focus/媒体/可见性、IO记录、data属性和动画状态/iterations。不用元素截图把目标滚回，不循环补帧、不追加sleep、不调用Animation.cancel/pause或改visibility/media去获得绿。
4. **几何、通知、产品反应分开验证**：截图前后目标仍必须在视口外且为同一真实节点；本次原生callback需isIntersecting=false，产品自己设置data-p12-offscreen，随后该目标的running infinite数必须为0。500ms内缺少本次真实通知仍fail；通知已交付/data已生效但仍无限running，则按产品CSS/调度错误追踪，不用再次截图绕过。
5. **保持刺激真实**：离屏上传位仍保有原焦点，不能因截图blur而失去聚焦动画；reduce=false、hidden=false、没有dialog造成全局暂停。任务仍为真实active且强调资格未因后台自然终态消失，记录真实server状态/version；不能拿任务成功后没有动画伪装离屏暂停。业务请求/任务后台执行继续。
6. **恢复也要交付链证据**：回到视口后真实IO记录恢复true、产品移除离屏属性、原场景持续动画恢复；不重建节点或重建业务/身份以替代恢复。任何通知超时或恢复失败都保留原始结果，不把未验证写成成功。

**该一次渲染+原生IO审计方案可作为有界调查接受，是否进入harness修正须等Acceptance实际轨迹。** 如果一次正常渲染后确实收到本轮false并由产品自行暂停，只支持“旧功能harness缺少通知/渲染前置”的证据方向；不是已定位CDP内部bug。若通知已到仍不暂停，则保留产品失败。任何情况下无限动画暂停门槛不放宽，旧2fail不覆盖，G02不代签。

本轮只追加方案审核，无新增浏览器运行或产品结论；后续Leader/Acceptance依据实证决定有界实现及复验，沿原root累计，不重复无变化重跑碰绿。

## 独立原生IO实证复核与采用意见

已只读核对`fd7edb801ea7f67c032c97300d59a176d1aef925`新增的`8a-lifecycle-diagnosis-first.json`、`8a-lifecycle-diagnosis-foreground.json`及`tests/p1.2/diagnose-lifecycle.mjs`。两份独立Acceptance实证均标记真实产品`8a3f8bd12c1fc889566e82f9c2ad95cd96544524`；本Reviewer没有启动浏览器或重跑诊断。

首次诊断确实复现上传位的前置缺口：原检查点1867.7ms，目标bottom=-561.59375、dataOffscreen=false、无限`p12-flow`仍running、hidden=false且焦点仍为INPUT；产品observer4在此之前只有663.6ms的true通知。一次普通viewport截图后，1995.4ms同observer收到原生false，随后2504.5ms样本的几何仍为bottom=-561.59375、焦点仍为INPUT，产品自行设置dataOffscreen=true，`p12-flow`变paused。恢复后2571.1ms原生true、2677.4ms属性移除且动画running。这条链支持“原几何检查点尚未交付离屏通知”，没有用失焦、目标回到视口或手动停动画获得暂停。

原生审计保留真实IntersectionObserver构造器，对产品callback收到的原始entries先记录、再原样调用；未制造entry、手动写属性或取消动画。entry中offscreen值是**原产品callback之前**读取，因此false通知行仍为offscreen=false，而后续状态为true，不能误读为产品未响应。截图是一次普通viewport采样，不禁动画；恢复另有一次固定截图，均不是失败后循环补帧。

限制必须保留：首次诊断的task在原检查点就已dataOffscreen=true、`p12-node` paused；foreground诊断的slot与task也都在原检查点暂停。foreground文件明确hasFocus=true、hidden=false，不能据此反推远端CI task同因，或把问题统称后台标签页。两份诊断均不是远端失败当时的完整轨迹，不证明Chromium/CDP内部根因。诊断helper的waitForFunction采用默认RAF polling；它不修改IO entry，但不能拿该调查脚本作无截图性能/产品RAF数量证据，正式harness应显式timer polling。

**方案可以进入有界harness修正。** 上传位已有真实通知前置缺失的局部实证；任务用例采用同一明确前置，是为了今后实际证明其通知链，而非宣称本次已复现任务根因。Acceptance独占正式helper，仍须保存before/assert/restore审计，验证同一目标离屏、原焦点/active任务/媒体/可见性、真实本轮false、产品data属性与0 running infinite，及恢复true后属性移除/动画恢复；一次viewport渲染后500ms缺事件仍fail，不放宽原暂停门槛，不以截图或测试手工清理代替产品。正式源码到达后还需最后差异审核。

本次仅确认独立实证及方案采用边界，不签新CI或G02，不修改已冻结G01，远端原2fail与首次失败轨迹继续保留。

## 正式IO harness最终差异与局部证据核对

已只读核对正式集成`6883a558c057f56fe5b4046c2c3a9ebf44e40faf`的`tests/p1.2/lifecycle.mjs`、新增`lifecycle-observer.mjs`与`8a-lifecycle-native-trigger-pass.json`。该提交没有产品、CI配置或无截图性能入口差异；本Reviewer未运行脚本或启动浏览器。

- 保留原200/250ms几何诊断点及失败现场保存；每次离屏/恢复几何触发后固定一次`fullPage:false, animations:'allow'`截图，无循环补帧、属性覆写、伪通知或Animation控制。回调使用`callback.call(observer,entries,observer)`，保持原生this及原始参数。
- 原生记录必须属于本轮序列之后的目标上传位/精确taskId，匹配真实false或恢复true；截图后等待上限500ms，显式`polling:25`，不申请测试RAF。准确边界是**通知发生在本轮几何操作序列中**：若在原200/250ms内已正常交付，同样有效，不要求截图之后才新发生；500ms也不包含单列截图开销。不能将它写成浏览器绝对500ms通知性能保证。
- 暂停断言保留且加强：目标截图前后仍离屏、属性生效、无限动画仍存在但0 running且computed animationPlayState全部paused；恢复真实相交/true、离屏属性移除并重新running。还要求hidden=false、hasFocus=true、reduce=false、dialog=0；上传位仍focusWithin，任务仍emphasis=true，服务端状态必须QUEUED/RUNNING且version未倒退。不会以自然终态、失焦或全局保护代替离屏暂停。
- 真实活动fixture改为4+10+2=16秒，为局部观察保留活跃窗口；没有削减预算、改变产品模拟协议或删原离屏要求。正式helper现在保存原检查点和断言时的完整IO/状态，即便失败也不再只留下字符串。

已读独立Acceptance局部结果：应用仍为`8a3f8bd12c1fc889566e82f9c2ad95cd96544524`，捕获时间`2026-10-30T06:40:58.459Z`，两项status均pass；handoff记录对应容器入口exit0。上传位原检查点已经data=true/paused，离屏采样bottom=-561.59375、focusWithin=true，恢复后data=false/running；任务原检查点同样已暂停，离屏采样bottom=-1106.09375、emphasis=true，服务端RUNNING/ASSET_CHECK/version2，恢复data=false/running。两项全过程hidden=false、hasFocus=true、reduce=false、dialog0。该正式通过样本验证通知已交付时产品能自行暂停/恢复，**不是再次复现截图促成事件**；此前first诊断才提供局部通知缺失实证。

**最终源码与两项局部证据审核可接受，本审核文件冻结，可随候选封存。** 上传位的旧前置缺口已被实际区分；远端task失败当时缺原生通知审计，根因仍未确定，不按相似表象关闭为已证明的CDP故障。本地两项通过不等于新完整远端CI成功，不签G02，不改G01及产品视觉适用源；下一次完整CI必须保留原失败与新前置轨迹。
