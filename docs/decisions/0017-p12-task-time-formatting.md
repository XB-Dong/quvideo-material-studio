# 首次任务卡片的时间显示成本

fab/CI41016072989的正式无截图交互在首次提交窗口捕获76ms任务。独立两次限定诊断在受理后卡片提交中记录69/61ms React任务，CPU采样约31.906/29.241ms命中history的toLocaleString调用。诊断不冒充无追踪性能，也不将原CI76ms全量归于同一函数；没有证据指向已修桥接或水墨主导。

采用轻量UI格式函数：原生Date本地getMonth/getDate/getHours/getMinutes和两位补零，保留MM/DD HH:mm、浏览器本地时区、原time dateTime ISO及Invalid Date行为。无依赖、无Intl初始化预热，不靠把成本提前搬出交互窗口。原任务数据、排序、查询与身份均不变。

作者Chrome149三个timezone的15有效/3无效对照文字一致；48前端测试通过，UTC/Shanghai额外测试均过。独立部署3008后，相同真实大文件选择→READY立即首次提交→多任务/预览/30秒无截图流程longtask0、errors0；同样保留50ms门槛、4MiB字节和原PNG。新三页九轮也逐轮通过。完整远端仍待核对，不将此局部结果写作最终CI已通过。
