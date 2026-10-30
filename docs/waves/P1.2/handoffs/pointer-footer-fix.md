# 两项针对性修正

- rootTaskId: P12-POINTER-FOOTER-FIX
- baseCommit: e32635e8439a450f3a7c80b0019dbe20167d1b39
- branch: codex/p12-pointer-footer；worktree干净后创建
- role: sole Frontend；actualProvider/model/reasoning=null，继承会话

实际容器Chromium读取1280×800视窗：Ink位图1280×800，CSS画布却1280×1356.515625，路由动画surface在fill both结束仍为identity transform matrix，fixed以整页动画祖先为包含块。鼠标(840,300)旧位图点显示在(840,508.693)，滚动300后变(840,208.693)。因此偏移来自挂载层坐标空间，非画作或光圈半径。

只把InkBackdrop从Shell移到根layout的Providers内部、路由template之外，保留MotionPreferences自动策略；visuals.tsx/画作/强度/尾迹/全部CSS零改。局部浏览器DOM候选移位点检显示rect1280×800且同光标中心(840,300)，已实际view候选截图确认负z层纸面仍可见，无需CSS补丁。候选DOM点检不冒充已部署新源，Leader集成后做一次rect点检即可，实际观感由用户验收。

footer左侧换为语义外链“阳光魔力小牛马”→https://github.com/XB-Dong，新标签noopener noreferrer；其余footer内容和业务不改。

命令：Docker浏览器只读坐标诊断；一次性Node容器Prettier格式两文件；docker compose -p p12-front-test -f compose.yaml -f compose.test.yaml run --build --rm --no-deps frontend-check。08:05:56UTC/16:05:56+08:00 lint/typecheck/既有48tests均pass，exit0；diff-check通过，无新增实现镜像测试。没有重启共享服务或push，没有另开wave/正式G01/G02全盘验收。生产build由Leader集成一次完成，随后本地预览交用户自行验收。
