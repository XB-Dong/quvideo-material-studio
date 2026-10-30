# Leader审核处置

- VIS-01 / major：采纳。6f5f实际页面横卷高度cover变巨型灰雾，独立美学未过；原失败保留。Frontend在7eafbf8改有限横幅、同图渐隐、4px雾并去阅读贴片；主集成64e919。Reviewer实际复验关闭，G01为4/4/4.5/4/4.5。Leader亦实际查看修复前后desktop/mobile及原图，不以代码检查代替视觉。
- Dither/Halftone语义偏弱：Acceptance在首次部署前发现只叠点，采纳原图亮度缓存/透明显影修复34ece41，最终actual visual测真实alpha/像素。不是只保留vendor代码便称完成。
- 首轮验收工具自身遗漏常量/选点/截屏媒体时序：按同根因日志修正，原失败保留；不把工具错误当产品业务Red。
- Leader运行API验收漏--no-deps触发同源码服务替换：已告知各角色，停止并发；API8实际通过，修复版稳定部署后功能/visual重新通过，最终性能另在无负载环境采样。无持久卷删除。
- MAIL-01：等待可操作的实际邮箱。连接失败不视为规则生效，账户全局设置未改，不允许以关CI/skip-ci换无邮件；首次远端push仍待此项。
