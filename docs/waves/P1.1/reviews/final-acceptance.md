# P1.1 当前范围独立验收签署

记录时间：2026-10-30T12:10:00.746193+08:00。角色Acceptance `/root/p11_acceptance`；规格P1.1-1.0.1。requestedModel/reasoning继承会话，actualProvider/model/reasoning无独立路由证据，均null。

**结论：当前范围的本地G02通过，无开放blocking/major。** 用户明确“那就不管邮件先”，仅将P11-CI-MAIL/MAIL-01暂缓，未把邮件标成已解决。远端完整CI与最终源码交付由Leader核对；本次签署时远端CI正在运行，不能据此宣称全波次交付已完成。

## 范围变化与源码复核

实际只读审阅决定0012、requirements/ci-mail、PLAN、ACCEPTANCE、state、ACCEPT/DELIVERY任务包及旧交接。95293c1746a86b7c7d78e5306b43d8884bc13c15只更改协调文档与状态，ACCEPT移除MAIL需求/依赖，DELIVERY移除CI-MAIL前置；两者仍保留独立技术/舒适、美学及完整CI门槛。账号设置和邮箱规则均未改，不自动恢复邮件治理或开始下一波。

用git diff实际核对应用运行基准64e919aac25cacf7f1193b4a361071e5d03ef635至候选95293c1的frontend、backend、assets、独立API测试及业务规格，差异为空。frontend树两端均为 `1aca76b916f76a29fb7b07ee9d73fea3c41511b7`，backend树两端均为 `42a455b9abc6f1e354b2e0e79d795a6a50a24783`。此次契约补丁不改变应用或测试执行行为，因此已有64e9真实运行证据仍适用；没有重跑产品或冒称重新部署95293c1。

## 已执行证据与复核

原运行由本Acceptance执行，当前再次读取主工作区保存的JSON核对SHA、逐项结果与阈值：

| 子门槛 | 结果与证据 |
| --- | --- |
| 功能/真实业务 | [22/22](../evidence/acceptance/64e9-functional.json)，包含品牌/去控件与gallery、稳定ID卡片、Enter与真coarse首次tap、身份dialog焦点、上传/多任务、503≠执行失败与恢复、刷新/终态停轮询及历史404 |
| 真实动态与生命周期 | [6/6](../evidence/acceptance/64e9-visual.json)，合成器锐度.788→9.135→.776，四卡显影/像素/波纹、边框实际变化，resize后hero真实离屏Orbit0/RAF0、返回恢复，reduce/路由清理 |
| 默认软件交互舒适 | [交互采样通过](../evidence/acceptance/64e9-interaction-performance.json)：指针/四卡/分类和30秒连续闲置，无候选交互longtask，错误0；初始化长任务单独保留 |
| 真后台 | [原生CDP标签切换](../evidence/acceptance/64e9-native-visibility.json)：同窗口真实trusted hidden事件，RAF0/GPU0并恢复Orbit；headed Compose实际重建与运行退出0，未覆写visibility |
| 绝对预算 | [三轮全部通过](../evidence/acceptance/64e9-measurement.json)：每轮JS167230B≤192215；图432428/624408/511434B≤819200；CLS最大.000107502≤.1，errors0。保留CDP图片类型/图片MIME、CSS/fetch/ImageBitmap传输、重复请求和inline成本，不以中位数替代门槛 |
| 延后代码 | 交互后新请求JS0B≤122880；已加载创意计入首载，不把此观测误称未加载bundle的完整清单 |
| 回归构建 | 已审读[Leader实际容器检查](../evidence/leader-checks.json)：最终前端lint/type/31测试与构建通过，Java15、API8通过；其运行角色/SHA/未加--no-deps造成旧版服务替换的环境事件均明确。最终64e9独立浏览器结果在稳定部署后重新采集 |
| 独立美学 | [另一Reviewer的G01签署](implementation-review.md)：VIS-01关闭，4/4/4.5/4/4.5；本Acceptance不代替该作者审图评分 |

本次只读复核没有削减预算、删除失败断言、用capability fixture替代默认真实动态或将截图性能当无截图性能。历史6f测试脚本失败、背景major及修正计数继续保留，原mail-pending交接和旧检查JSON是其时点记录，本签署依据明确用户范围变化替代其中的当前MAIL前置结论，不追改历史。

## 限制与后续

物理硬件GPU、真实Windows最小化和真实手机性能仍未验证；后台结论限容器Xvfb真标签切换，触屏为实际coarse媒体与首tap的浏览器模拟。邮件暂缓且未解决，属于用户排除的本轮范围；不能把规则未执行写成已治理成功。远端CI当前未在本文件确认，完整交付由Leader在对应精确SHA的frontend/backend/integration全通过后签署。本Reviewer只写本文件，未修改其他文件、旧worktree分支或应用，也未重复运行产品测试。
