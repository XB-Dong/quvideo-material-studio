# P1.2认证结果缩略图

状态：2026-10-30执行中冻结；specVersion P1.2-1.0.1。Frontend与Acceptance完成消费者影响检查，Reviewer审查无架构阻断，产品观感与运行验收仍待测。

固定两成功一失败样例的制作/历史首屏各请求两个665118B的pet结果，原基线约1.45MB，超过819200B。保留预算、原样例、所有记录与完整网络计量，不通过删记录、换小模板或去重统计规避。

现有认证GET `/media/results/{id}`增加可选boolean `thumbnail`，默认false。缺省/false继续返回原PNG全部字节；true在相同会话、owner及SUCCEEDED检查后返回等比最长边512px、不放大的JPEG卡片图。白色合成透明背景，JPEG质量固定0.88，不裁切；解码/编码失败属于媒体请求错误，不修改任务状态。无新数据库字段、依赖或公开缓存，无持久衍生文件。响应`no-store`、`nosniff`，Next原代理透传query/cookie并继续no-store。

Frontend只将结果卡片img改用`?thumbnail=true`；点击弹窗仍使用原resultUrl，原PNG和用户上传均不修改。服务端转换耗时与原图弹窗流量分别记录。未知/他人/未成功404、无效会话401；非法boolean返回400。

Leader唯一持有Api.java、新ResultThumbnail.java及对应单元测试；Frontend仍独占history.tsx；Acceptance只写独立tests/p1.2。此为P12-PERF-01的有界实现扩展，不增设Backend角色。需测四类素材、尺寸/比例/小图/白底、真实认证/跨用户/终态、原图hash、三轮逐页实际图片成本及可读观感。
