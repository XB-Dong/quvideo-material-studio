# P2 来源、分发与未来公开独立审核

rootTaskId：P2-AUDIT；specVersion：P2-1.0.0；Reviewer：p11_design_review；actualProvider/model/reasoning均为null。初审源`63f2318592a2e50349e4ae37b7f4d1e08d4e9319`，UI补读源8c0f6c6；只读源码/Git/许可/元数据，未改产品、运行容器或浏览器、commit、push、改public或历史。

## 实际依据

已读LICENSE、THIRD-PARTY-NOTICES、React Bits LICENSE/ADAPTATIONS、P1源冻结及素材生产manifest、P1.1水墨manifest、P2 Leader history-inventory/history-pattern-inspection。另独立执行本地for-each-ref、rev-list --all/--objects、历史路径log及高置信凭据格式的Git历史文本差异检查，只输出路径/commit元数据，不打印匹配正文。采样时为29 refs、265 commits、3193 reachable objects，因其他角色继续提交不是最终冻结计数。

独立检查覆盖当时本地全部可达refs（含heads/remotes/codex snapshots/turn-diffs），不是仅main；高置信GitHub/AWS/key-header模式未返回命中。该扫描不是所有凭据形态、所有二进制内容的人工审核，也不覆盖不可达对象、GitHub远端缓存/Actions/PR附件或未提交文件，不构成“仓库无秘密”保证。Leader早期249commit等元数据明确为较早快照，没有混充当前统计。

当前树及历史包含docs/requirements/images/UI-01～03/identity-reference、P1.1 references/assets/user-ci-mail-reference.png和user-template-reference.png；Git log可追至abdf231/5fe26c7/325bfd8等引入提交。本机绝对路径仍出现在部分文档/JSON；仅HEAD删图或脱敏并不从其他refs/历史移除。未读取真实邮箱或用户上传，未擅自删除历史。

2026-10-30只读核对官方来源：[React Bits冻结提交许可](https://raw.githubusercontent.com/DavidHDev/react-bits/e12c22192ac7b4b452c5e2feb9b586d74765d696/LICENSE.md)、[Unsplash许可](https://unsplash.com/license)、[The Met Open Access](https://www.metmuseum.org/hubs/open-access)。本地React Bits许可SHA256实际为`4bdd1fa59a6b7d5954bc3b213dbc34e455c635a94bbcecf9293553797d0fad02`，与源冻结一致；registry和该GitHub提交源码逐文件等价性仍未断言。许可允许应用内集成并限制组件自身分发，不能以根MIT覆盖第三方条款。

## P2-PROV-01 · major · 未使用组件源码仍作为集合分发

- 位置：frontend/src/components/react-bits下DitherVeil、GlowCursor、RippleDistortion、HalftoneReveal、PixelTrail、ElectricBorder各tsx/css，共12文件；LICENSE/NOTICES的应用集成说明。
- 触发：从初审树完整打包源码ZIP，或以后直接将同树公开。
- 预期：分发保留实际集成的Orbit、必要适配与完整许可；没有运行用途的上游组件不作为独立源码集合随交付继续传播，或另有明确授权依据。
- 实际：showcase仅lazy import Orbit，六组件没有产品import；它们被保留“供来源”，却仍是完整可复用组件源码。上游许可对应用集成和组件本身再分发有不同边界，单写“属于应用”不能消除这些未使用文件的分发疑点。此项是交付范围需处置的许可风险，不宣称Orbit应用集成被禁止，也不作司法定性。
- 建议：从当前交付树移除未用12文件及仅它们需要的OGL依赖（先核使用再容器更新锁），保留Orbit/必要适配/原许可/历史来源哈希与真实说明；源码、锁、NOTICES及受影响测试同步。不重写历史，不静默改变认可视觉。
- 处置：Leader已明确接受并持有唯一清理；**初审open，待精确清理源及结果复核**。不能仅列未来公开待办而继续把未处置的同文件打入本次源码包。

## 其他来源与双门槛

根LICENSE仅授原创部分MIT，明确排除第三方、照片、题面/参考图、工具依赖；未将全仓误称纯MIT。照片生产manifest提供四作者/具体页/源与产图hash，衍生图仍保留Unsplash条款，非重新授权；通用许可允许使用/修改/分发但不允许直接售卖原图或复制竞争图库。吴云水墨源有The Met藏品ID/CC0与裁切产图记录，运行只用本地衍生；本次没有逐张重下载原照片，也不把工具Pillow许可核对冒充全部依赖法律审计。Pillow MIT-CMU原文来源已校正，工具/基础镜像许可不由根MIT取代。

**本次提交与未来公开必须分别判断。** 当前作业默认源码ZIP，无.git，不要求改私库可见性；拟提交包应排除无运行必要的原邮件图、私人协调/未脱敏证据，清理规则与引用完整性须Leader记录并由Final Reviewer核最终entries。原题资料归原权利人，不能随原创许可宣称可任意转授权；必要R编号和本项目自己撰写的说明可保留。公开前还须检查全部相关refs/历史及远端附件，给出原仓库历史处理或干净快照的可执行选项，但不在P2擅自history rewrite/force-push/创建替代公开仓库。

当前结论：**PROV待P2-PROV-01处置及最终包检查；OPEN不判可直接公开。** 全历史存在已知披露面，未来操作需另获授权；本地有限模式无命中不替代秘密审计或远端清理。最后源码包/GIF/报告的实际分发内容和第三方保留由P2-REVIEW在精确最终版本另核，当前不是封存签署。

## 1b清理与源码包过滤设计复核

已只读核对精确`1b38655d71a8f9c9001d7402d4adf12ee7d35cf4`：六组件12份tsx/css实际删除，package.json与锁内OGL顶层及node_modules记录同步删除；react-bits当前只剩OrbitImages.tsx/css、context-lifecycle、LICENSE和ADAPTATIONS。实际Orbit import仍在，原许可保留，NOTICES/ADAPTATIONS明确旧适配段落是历史而非当前文件清单。Leader提供清理后容器lint/type/58tests exit0为作者检查，本Reviewer没有运行或冒称独立通过。

**P2-PROV-01在1b源码层closed**，没有用笼统免责替代实际清理。历史refs仍可访问旧组件，未改历史；当前完整应用集成Orbit与保留原许可的范围和独立组件集合分发不同。最终ZIP还需检查真实entries，不能仅用HEAD清理证明所有交付文件已排除。

另只读审阅Leader当时正在收敛的`.gitattributes`、`docs/submission/{package-policy.json,SOURCE-PACKAGE.md}`、`docs/assets/provenance.json`；它们是持续更新的工作树规则草案，尚非已冻结最终归档证据。设计明确使用Git export-ignore排除内部协调/完整题面、原邮件参考图、用户报告等，保留全部前后端/tests/CI/配置/锁/迁移/素材/许可、六项素材重做输入、来源与脱敏最终证据。新当前来源清单不带旧cachePath，未修改旧审计记录来掩盖路径。

已用显式参数的git check-attr读取当时185个跟踪frontend/backend/tests/.github文件，直接export-ignore命中0；六项重做输入均未设置忽略，docs/requirements目录、原邮件图及本审核文件设为忽略，当前来源清单/成片目录/独立验收目录未忽略。首个stdin管道受PowerShell CR影响的结果未作依据，改为显式路径参数后核对。此属性检查不等于已经生成并核对ZIP，也不保证未扫描的父目录/后续新路径或所有Markdown链接完整。

**过滤设计可采用，最终包/PROV完整门槛仍pending。** Leader应在精确deliveryCommit冻结规则、重新生成排除清单，独立scanner比对所有产品文件/必要父目录及归档真实entries，检出不该保留的原资料和不该缺少的许可/素材。README/NOTICES应改向包内可读入口，明确“完整应用源+记录过的导出规则”，不能假称无筛选全Git目录。最后按包hash解压运行、限制与许可/附件复核仍是P2-VERIFY/P2-REVIEW；OPEN历史未处置结论不因ZIP过滤改变。
