# 决定0009 GPU能力检测与舒适度策略

独立Acceptance在be43ab9候选、实际SwiftShader环境做无截图/trace的GL计时，确认强制loseContext同步主线程开销：Glow约131ms、Halftone约56ms、Pixel约76ms；对应真实长任务。此性能major保留原值，不以删断言或降低门槛处理。普通业务/布局测试与七项创意功能证据分别保留。

最终实现将一次必要的能力探测放入专用Worker的1×1 OffscreenCanvas。Worker使用标准failIfMajorPerformanceCaveat并读取实际renderer；识别SwiftShader/llvmpipe/softpipe/software时默认不启用六个GPU装饰，保留SVG Orbit、CSS操作反馈、图片及全部业务。探测本身不在主线程创建/释放GL；须释放确认后才允许主GPUowner，Worker/Blob URL/监听有界清理。Worker无、不支持、异常或超时均用静态图片安全回退。

标准caveat属性不能单独作为性能证明：当前测试浏览器显式SwiftShader flags仍允许该属性下创建context，故还要检查实际renderer。标准定义依据[Khronos WebGL规范](https://registry.khronos.org/webgl/specs/latest/1.0/)；最终行为由实际探针和测试证明，不能只引用规范。

正常硬件和性能足够时，七组件位置、行为、最大两个运动系统/一个已分配存活GPU上下文均保留；低FPS/系统reduce/手动静态/离屏/后台/页面卸载仍分别测试。源码不提供URL/localStorage等生产强制开关。

验证分两条明确路径：默认软件环境按真实能力策略验舒适与业务；独立软件功能fixture只模拟preflight的硬件允许结果，用实际SwiftShader执行七组件/互斥/释放，报告真实driver和fixture条件，不把强制软件的慢driver当舒适通过。实际硬件设备的性能只在有原生实测证据时声明，缺项如实标未验证。静态/无能力路径不能替代七组件功能覆盖，七项全关不能获得创意通过。

本决定细化P1-QUALITY-01既有低性能降级要求，保持P1-1.2.0范围及双门槛。Frontend负责源及行为测试，Acceptance独立设计并执行两条路径，Reviewer复核视觉/节奏/证据，Leader集成处置与最终签署。
