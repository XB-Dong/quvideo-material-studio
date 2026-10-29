# React Bits来源与适配

官方TS-CSS registry源码；14文件原始哈希和源URL见docs/waves/P1/evidence/leader-baseline/source-freeze.json，GitHub许可提交e12c22192ac7b4b452c5e2feb9b586d74765d696。registry与GitHub内容等价性不作断言。版权David Haz，完整MIT + Commons Clause见LICENSE.md。

适配：外层独立偏好/可见性/互斥/idle控制；WebGL卸载主动loseContext；DPR上限1.5、Electric像素预算1MP；Pixel点数上限24；浅色颜色与props由产品适配层提供。原源码保留，第三方文件独立关闭lint规则，产品控制器正常lint/测试。实际运行验收由独立Acceptance完成。

局部SafeEffect边界记录canvas并在卸载前释放context，覆盖上游未返回cleanup的失败路径；FPS跳过首秒初始化、按owner局部降级。Dither/Ripple/Halftone图片未就绪时透明显示底层poster；Dither/Halftone半径使用像素，限制容器范围。Motion候选库未被产品import，M01–M10采用CSS/React状态触发。

默认GPU策略：单次具名Blob Worker以1×1 OffscreenCanvas/caveat=true预检真实renderer，排除SwiftShader等软件renderer，先确认探针GL释放再授main owner；Worker不支持/失败/超时只回静态图片，不在main创建慢探针。正常硬件六源实际创建带caveat=true（OGL显式预创建canvas后交Renderer）。没有生产强制开关。局部performance.measure只记录探针与真实release耗时，不发送/保存用户数据。软件功能fixture和默认舒适分开由独立验收记录，前者不冒充硬件性能。

Electric额外首帧适配：resize/首次完整draw前透明，产品层外缘环形裁剪保护文字；保留原shader动态，light热芯混白比例0.85降至0.15，与浅色细蓝紫边缘相符。实际多帧图由独立Reviewer复核。
