# P11-ACCEPT独立验收交接

- taskId/rootTaskId: P11-ACCEPT；waveId: P1.1；roundId: P11-R1；specVersion: P1.1-1.0.0
- role: Acceptance；requestedModel/reasoning: inherit_current_session；actualProvider/model/reasoning: null（无独立路由证据）
- 派发baseCommit: c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef
- 最终application testedCommit: **64e919aac25cacf7f1193b4a361071e5d03ef635**，由Leader部署并提供image d069a52c91a321bf47bd5c80014e5593ba385d7ae1c9ca4a31248109446336c3。测试源码与应用SHA分开，不把仅文档/脚本后续集成假称重新部署。
- 最终harness/evidence implementationCommit: **b6536f4576619d54dcd175704cc122139cb6ce36**；此前依次06aa526、5ce4512、e00df45、fa4e619。该commit包含最后离屏断言及全部测试源码。此交接文档是后续记录，不改产品或测试行为。
- requirementIds: P11-QUALITY-01、P11-REG-01、P11-MAIL-01；相关BRAND/AUTO/INK/EDGE/CARD可观察场景也覆盖。
- 状态：**本地应用技术/舒适运行检查passed；整体P11-ACCEPT等待MAIL实际证据，尚未签署全部完成**。独立美学由Reviewer另签，不以本文件代替；GitHub CI与远端交付由Leader核对。

## 实际检查

| 检查 | 实际结果 | 证据 |
| --- | --- | --- |
| 旧P1 comparator | 原始三轮与最终全图片三轮均保留；最终JS168190、图341031/407535/497352B、inline0，逐轮预算pass | evidence/acceptance/p1-baseline*.json |
| 三种媒体功能 | **22/22**；疏影/无手动按钮及gallery、Java真实4卡、直接Enter与首次touch、身份dialog Escape/focus、上传、双成功+指定GENERATE失败、503≠任务失败与恢复查询、刷新结果/终态停止轮询、历史/404 | 64e9-functional.json |
| 真coarse | context hasTouch/isMobile后实测coarse:true、fine:false、hover:false，未先mouse.move；首次touch进入详情；375首页与制作页完整截图 | functional对应check与raw accept/mobile-*.png |
| 创意实际像素/生命周期 | **6/6**；合成器清晰度边缘能量.788→9.135→.776；四卡纸点→清晰照片/像素/波纹，单卡退出清理；至少三种边缘且改变791像素；真实离屏hero.bottom=-299.5，Orbit0/RAF0后返回；reduce RAF0/GPU0、路由卸载RAF0 | 64e9-visual.json |
| 无截图性能 | 指针/四卡/分类/30秒连续空闲，候选交互longtask0、pageerrors0、存活主GPU0；初始longtask单独保留，没有声称整页零longtask | 64e9-interaction-performance.json |
| 三轮绝对预算 | 首载JS每轮**167230B**≤192215；全图片**432428/624408/511434B**≤819200；CLS **.0000857/.0001075/.0001043**≤.1；每轮errors0；inline0。CDP Image或图片MIME/重复请求、CSS/fetch/ImageBitmap传输全部计；内嵌图encodedliteral成本也计 | 64e9-measurement.json |
| 延后脚本 | 首载之后四卡交互无新JS请求，0B≤122880；创意已计入上述首载总量。这是观测范围，不冒称额外未加载代码的完整bundle inventory | interaction-performance与measurement每请求清单 |
| 原生后台 | 新root headed Dockerfile通过Compose实际重建并运行exit0；Xvfb真标签Target.activateTarget、浏览器trusted hidden事件，RAF0/GPU0并恢复Orbit；没有覆写document.hidden | 64e9-native-visibility.json |
| 预算守卫 | 4/4容器node:test：边界、单轮越界、JS越界、错误不可忽略 | tests/p1.1/budgets.test.mjs |

## 命令、环境与所有权

所有应用/浏览器执行均在容器，未在宿主机安装或执行项目npm/Java脚本。脚本语法检查用material-p1-browser:gpu容器node --check，退出0。测试浏览器Chromium149.0.7827.53、Playwright1.58.2、ANGLE/SwiftShader；默认生产策略，没有硬件能力fixture；1440×1000/DPR1、375×812真touch。多轮预算保持同浏览器/driver/无CPU网络节流条件。

最终功能/性能各容器示例（分别OUTPUT_DIR挂载独立目录）：

```sh
docker run --rm -e TESTED_COMMIT=64e919aac25cacf7f1193b4a361071e5d03ef635 -e OUTPUT_DIR=/evidence -v <worktree>/tests/p1.1:/checks/new:ro -v <raw-dir>:/evidence material-p1-browser:gpu /checks/new/accept.mjs
# 同样方式visual.mjs、interact.mjs、measure.mjs；均exit0
```

原生后台特意使用Leader新加的可交付入口，主工作区仅执行（无源码写入）：

```sh
TESTED_COMMIT=64e919aac25cacf7f1193b4a361071e5d03ef635 P11_EVIDENCE_DIR=<worktree>/runtime/p11-64e9 docker compose -f compose.yaml -f compose.test.yaml run --build --rm --no-deps browser-p11-headed
```

真实运行时PowerShell设置上述env；未运行without --no-deps的服务重建命令，未重启共享服务或删卷。约11:37 Leader报告另一次API检查意外重建旧6f前后端，已暂停页面动作；本轮64e9所有结论在后续明确稳定部署后重新采样，未将该环境事件算业务Red。产品源码、root CI/Compose/锁文件均由各owner维护，本角色只写tests/p1.1、专属证据及此交接。

## 失败与限制

6f5f首次测试脚本forbidden引用遗漏、ink选点误限Orbit区域各修正1次；截图前测touch媒体的采样顺序修正1次，原始21/1失败与全部结果保留，未覆写媒体查询伪造pass。触屏异常的唯一因果未另做实验隔离，不将推测当已证实Chromium缺陷。见6f5f-test-repair-log及对应failJSON。Reviewer的背景灰雾major由Frontend修正，64e9运行在修正后，不删除原失败或换task计数。

实际物理硬件GPU、真实Windows最小化/手机设备性能未验证；后台证明范围为容器Xvfb中真实浏览器标签切换。业务前端31、Java15/API8结果由Leader另保留，此处不冒称本角色执行其全部单元/集成命令。MAIL尚无可操作邮箱规则证据，不签最终完整G02/ACCEPT通过，不推送远端。

## 原始证据与时间

原始文件位于此worktree的ignored **runtime/p11-64e9/**，另有runtime/p11-6f5f、p11-baseline、p11-baseline-final失败/旧版记录。64e9-raw-files.json列出逐文件bytes/SHA256；Leader在app归档前须保存需要的ignored原件，不能指望Git snapshot保存。最终desktop/mobile图在runtime/p11-64e9/accept/*-catalog.png，擦拭序列在visual-final，性能在interact/measure，原生后台在native。

本角色未从首动作独立精确计时，不伪填总工时；每次实际JSON capturedAt为UTC时间戳，对照报告用+08:00。交接记录时间2026-10-30T11:49:55.574609+08:00。人类实际投入未知，平行Agent时间不相加。下一步：Leader集成此harness/evidence、核对独立美学与全部CI，完成已确认范围MAIL或如实报告待连接，再签最终交付。仅使用app工具归档，勿手动删除worktree。
