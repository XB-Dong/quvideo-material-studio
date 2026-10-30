# 6f5f测试脚本修正

部署产品SHA6f5f156527646eac0adc00c96c641968f0f60017不变。

- ACCEPT-FORBIDDEN根因：从原业务验收提取块后缺少forbidden常量；首次19pass/3fail是测试ReferenceError，不冒充产品Red。补常量后21pass/1fail，原三个ReferenceError关闭（同根因修正1次）。
- VISUAL-POINT根因：选点只在hero-art且该区域被Orbit容器占据，找不到留白。扩大到intro内真实无控件暴露山水选点；5/5通过，真实合成器边缘能量从.687增至4.10后回雾.682。测试修正1次，没有放宽像素/清晰度标准。
- TOUCH-SAMPLING根因：全页截图放在触屏媒体测量之前，Chromium截图设备指标流程可能改变模拟指针；先测实际coarse/fine/hover并首次tap再拍照，22/22通过（修正1次）。未覆写matchMedia或事件制造coarse，不隐瞒失败。

当前只证明功能与生命周期子项；Reviewer已发现背景过度放大/灰雾的产品major，G01不通过；最终性能/原生后台/整体G02等待修正后的精确SHA，邮件子项还需Leader实际证据。所有失败、原始截图和输出在ignored runtime/p11-6f5f保留。
