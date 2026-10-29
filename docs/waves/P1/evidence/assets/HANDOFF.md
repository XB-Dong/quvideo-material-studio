# P1-ASSET交接

完成时间2026-10-29T23:17:28+08:00；task/rootTask=P1-ASSET；规格P1-1.2.0。角色Asset Integration；继承模型/推理，实际provider/model/reasoning无独立证据均null。

派发基准7997279301ce28c1bf1ee5e15d971aa7243a645c（消息覆盖准备锚点）；app-managed工作树p1-assets、分支codex/p1-assets。实现cdfd9f513141d2879470c299b8c806f832174a99；验证/格式39eb7d5eaf5f49864a25abd29653b2642fadabed。此后只完善证据/禁止测试脚本生成pycache，没有产品逻辑变化。

需求P1-VIS-02/P1-REG-01/P1-DEL-01。改动仅backend/demo新增8图、V3、FilesService显式key/MIME、Api公开demo一行、3测试、backend/scripts工具、本evidence。V1/V2/旧PNG/私有结果/身份/任务逻辑未改。root NOTICE由Leader整合NOTICE-additions。

验证：Pillow11.3.0固定容器生成，封面480×640（避免640原图无意义放大），全部≤180KiB；真PNG≤1MiB/长边≤1600，保留RGB/完整构图。逐图元数据/源许可/hash/crop见production-manifest；源四图和pet/portrait衍生已view_image核对主体。转换器二次执行逐字节一致，正式restore helper在另一测试卷实跑2文件权限10001:10001及旧结果SHA通过，见tool-recheck.json。

容器Java/MySQL verify两次15全过（原12+新3），最终精确39eb7d5源码见java-final.txt，初次见java-check.txt；生产runtime镜像构建成功。独立project material-p1-assets/23010执行P0→P1→匹配DB/文件快照恢复P0→再次P1：旧task结果SHA始终961395304cad3ebd27b95d42426c9f3bfdeedb9e5f562edc728d1ee1d3430101；旧记录/归属保持，后三阶段外人404；新JPEG URL/MIME及新任务真PNG SHA匹配。Flyway恢复1/2，再升1/2/3。见upgrade-observations、flyway两个文本。初始P0未做foreign检查记null。

实际失败：首次安全tar data filter丢失UID，600文件变root，Java10001读失败；定位后显式恢复UID/GID，从匹配快照重做，回滚/再升通过。rootTask修复计数1，未删门槛。首次源码编辑GBK解码在写前失败，改PYTHONUTF8；不作为行为Red。容器导入tests模块生成的宿主pycache会清理，并已禁止后续写入。

所有安装/转换/格式工具/产品脚本均容器执行。主material-studio/卷/3000未由本Agent更改。命令及重做说明见UPGRADE-VERIFICATION。快照/合成cookie仅专属容器卷或忽略runtime，不进Git。仅验证单机演示/合成数据，恢复丢失快照后新记录，正式恢复先备份并说明窗口；P1前端视觉/动态/性能/独立双门槛不是本结果。Root需集成复验、NOTICE/README整合与最终交付。


## 封存前网页封面预算

封面现采用JPEG quality82、4:2:0，尺寸/裁切/来源/颜色不变；4×前三图+portrait最坏加权由996880B降至648144B，低于750KiB目标。重复转换字节一致，13个PNG/迁移/API文件SHA保留。全部四封面已view_image复核；新浏览器实测/15Java/8API由Leader执行。详细新旧参数/大小/hash和限制见image-budget-repair.md、cover-budget-optimization.json，生产manifest已同步。NOTICE未修改。
