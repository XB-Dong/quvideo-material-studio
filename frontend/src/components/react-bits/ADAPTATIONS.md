# React Bits来源与适配

当前P2交付：只保留实际使用的OrbitImages及必要context-lifecycle/原许可。六组未mounted组件源码和OGL依赖已清理，页面仍使用自写Canvas2D/CSS/SVG视觉基础。以下P1/P1.1段落是当时历史适配记录，不是当前文件清单；来源哈希保留供审计，不提供独立组件包。

官方TS-CSS registry源码；14文件原始哈希和源URL见docs/waves/P1/evidence/leader-baseline/source-freeze.json，GitHub许可提交e12c22192ac7b4b452c5e2feb9b586d74765d696。registry与GitHub内容等价性不作断言。版权David Haz，完整MIT + Commons Clause见LICENSE.md。

适配：外层独立偏好/可见性/互斥/idle控制；WebGL卸载主动loseContext；DPR上限1.5、Electric像素预算1MP；Pixel点数上限24；浅色颜色与props由产品适配层提供。原源码保留，第三方文件独立关闭lint规则，产品控制器正常lint/测试。实际运行验收由独立Acceptance完成。

局部SafeEffect边界记录canvas并在卸载前释放context，覆盖上游未返回cleanup的失败路径；FPS跳过首秒初始化、按owner局部降级。Dither/Ripple/Halftone图片未就绪时透明显示底层poster；Dither/Halftone半径使用像素，限制容器范围。Motion候选库未被产品import，M01–M10采用CSS/React状态触发。

默认GPU策略：单次具名Blob Worker以1×1 OffscreenCanvas/caveat=true预检真实renderer，排除SwiftShader等软件renderer，先确认探针GL释放再授main owner；Worker不支持/失败/超时只回静态图片，不在main创建慢探针。正常硬件六源实际创建带caveat=true（OGL显式预创建canvas后交Renderer）。没有生产强制开关。局部performance.measure只记录探针与真实release耗时，不发送/保存用户数据。软件功能fixture和默认舒适分开由独立验收记录，前者不冒充硬件性能。

Electric额外首帧适配：resize/首次完整draw前透明，产品层外缘环形裁剪保护文字；保留原shader动态，light热芯混白比例0.85降至0.15，与浅色细蓝紫边缘相符。实际多帧图由独立Reviewer复核。


## P1.1: functional card and software-base integration

The P1.1 default path deliberately uses the new local `creative/visuals.tsx` Canvas2D/SVG implementations. These are inspired adaptations, not claims that upstream WebGL shaders execute. Dither's small square veil, Halftone's larger ink circles, Ripple's localized image displacement/rings and Pixel's bounded short square trail now follow stable template IDs on functional Link covers. The original four shader sources remain vendored for provenance; they are not mounted by the P1.1 default catalog. No WebGL context is allocated by these base effects.

OrbitImages is still the actual upstream adapter, with 42s duration and hoverSpeed=1/hoverScale=1; user controls and hover pause were removed. Glow Cursor's visual role is a subtle violet shadow on the feathered ink clarity trail using the same local painting, not another full-screen shader. Electric Border's visual role uses a locally authored jagged SVG perimeter with a traveling dash; it is continuous rather than P1's 600ms shader pulse.

Glare Hover inspires the narrow traveling edge and pointer-local cover response; Magic Bento inspires the low-intensity proximity edge. Neither full upstream demo nor icon dependency is copied or installed. Existing upstream license and all historical source/author notices remain. New native source is project code. Every effect label/data attribute is internal DOM metadata; no technical explanation text is shown to users.

Runtime inventory: one bounded ink RAF only while trails are alive (24 points/3500ms/30fps), one RAF only on the current pointer/focus cover (global visual ownership), one actual upstream Orbit group while visible, four SVG card contours and one CTA contour. Border contours pause when offscreen; automatic reduced-motion/background stops motion through existing provider lifecycle. Public image caches are reused; no pixel readbacks or per-frame React state updates. Actual performance and aesthetic acceptance remain independent validation, not asserted by this source note.
