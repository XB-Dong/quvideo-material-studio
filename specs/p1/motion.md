# P1 动效与生命周期契约

版本P1-1.1.0。动效跟随真实操作和服务端状态，不能生成假进度。统一easing为cubic-bezier(0.22,1,0.36,1)，退出用较短ease-in。进入只在首次出现/真实状态变更时运行，轮询响应不重复播放。

| ID/元素 | 触发 | 默认规则 | 结束、取消与静态模式 |
| --- | --- | --- | --- |
| M01 背景光晕 | 页面可见 | 静态蓝紫渐变，不增加持续运动系统；主要动态由RB05/局部创意承担 | 装饰pointer-events:none；不能挡文字和焦点 |
| M02 分类 | 用户选择 | 选中底纹160ms；结果opacity+Y8px，220ms | 旧请求取消仍即时；不等待退出后才发新请求；静态即换 |
| M03 模板卡 | 进入视区/hover/focus | 首次220ms，stagger40ms最多240ms；hover抬升3px和轻边光160ms | 不逐次滚动重放；触屏无hover依赖；静态只改变边框 |
| M04 按钮 | pointer/keyboard | press scale0.98，100ms；focus清晰轮廓 | 真实提交锁即时生效；取消/blur复位；静态无scale |
| M05 上传 | 选图/响应/替换 | 预览淡入160ms，成功状态交叉淡入；上传显示文字/小图标 | assetId就绪由响应决定；移除先abort/revoke再动画；旧图不阻挡新选择 |
| M06 新任务卡 | 收到202 | 按task.id进入，opacity+Y10px，240ms | 立即退出submitting；不得重置Maker或卡片状态 |
| M07 阶段/终态 | stage/status实际变更 | 标签160ms，成功图200ms淡入；失败原因即时出现 | version相同不重播；查询异常保留卡片；减少运动仅文字/实色 |
| M08 弹窗 | 打开/关闭/Esc/背景 | opacity+scale0.98，进入180ms退出120ms | 关闭请求立即进入closing，最长120ms完成native close和焦点返回；Esc可直接关闭；静态模式立即关闭；不重复showModal |
| M09 Skeleton/运行态 | 数据pending/RUNNING | skeleton低对比shimmer≤1.6s，spinner可持续 | 静态显示固定骨架和状态文字；终态/卸载/后台立即停止 |
| M10 Toast/提示 | 成功受理/请求异常 | 150ms淡入，错误不自动隐藏 | 提示不抢焦点；关键原因可持续读取 |

## 实现选择

CSS处理hover/focus/press、骨架、背景；React进入/退出及真实状态过渡采用Motion候选14.7.1。2026-10-29官方npm元数据标识MIT、peerReact支持18/19，契合现有React19.3.1；准备阶段未安装、未运行兼容测试。P1-BASE容器安装准确版本并提交锁文件，不顺带升级Next/React/查询库。

使用LazyMotion/m等按需能力，按[官方包体建议](https://motion.dev/docs/react-reduce-bundle-size)测最终产物，不将文档中的库大小当本项目实测。原则上不启用与本需求无关的拖拽/3D功能；若布局动画需要额外feature包，Leader记录包体成本和替代方案。

用独立MotionProvider包装视觉，保持QueryClient/IdentityProvider实例；task key只用task.id。动画组件不持有请求，不复制任务状态机，不通过exit等待保留已失效身份的查询。移除页面时请求清理在React生命周期立即执行，不能等动画完成。

SSR不访问window/localStorage；首次渲染以静态可操作内容为基准，客户端确认偏好后启用运动，避免水合错配。减少动态效果偏好变化需要实时响应；静态模式仍提供可感知状态。

## 减弱与退出边界

MotionConfig按用户偏好配置，CSS同时覆盖prefers-reduced-motion；手动静态只可进一步减少运动，不能覆盖系统reduce。装饰循环和视差禁用，内容以opacity或直接显示替代；重要状态不依赖动画才出现。[Motion官方说明](https://motion.dev/docs/react-accessibility)与[W3C交互动画说明](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)作为实现参考，不宣称全站WCAG认证。

原生dialog关闭与视觉退出需可取消且幂等：快速开关/再次Esc/用户切换/路由卸载均不产生僵尸遮罩、重复focus或悬空timer。达到120ms仍等待退出的实现应立即降级直接关闭。所有animation frame/timer/matchMedia监听在卸载清理，后台标签停装饰动效。

## 与创意组件协同

七组件按[react-bits.md](react-bits.md)逐项实现，和本表共用偏好/可见性/资源控制。Motion14.7.1和OGL1.0.11为待容器验证的候选，启动后Leader锁依赖。真实操作反馈优先；Electric短事件先暂停低优先装饰，不叠第三系统。系统reduce或手动静态切换即时释放资源，不能只用CSS把仍运行的Canvas隐藏。
