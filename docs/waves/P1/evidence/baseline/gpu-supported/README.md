# 支持WebGL的P0公平比较基线

真实P0旧镜像:p0-07300db、独立material-p0-reference_default网络、干净V1/V2种子与旧PNG；并非把V3新素材当P0。应用源码07300db74eefe5d8d1ecf979de314450bf5f2a78。Root暂停密集build后3轮采集。

镜像material-p1-browser:gpu，ID a2b62742b7be78dedbe449de8d7dd9e850f7be88b0055c0ef17f3e3fdec293dd。Node22.22.0/Playwright1.58.2/Chromium149.0.7827.53/NotoCJK，同旧工具版本；明确增装chromium-swiftshader149.0.7827.53-r0。空白页WebGL2真实支持，renderer为ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)。条件与实际renderer见measurement.json。

命令：docker run --rm --network material-p0-reference_default --mount type=bind,source=<absolute evidence directory>,target=/evidence -e RELAY_HOST=frontend -e TESTED_COMMIT=07300db74eefe5d8d1ecf979de314450bf5f2a78 material-p1-browser:gpu。退出0；透明relay为localhost3000→独立frontend3000，保留Origin/Cookie。

JS gzip归一值三轮均156375B、公开图片encodedBody三轮均21967B。CLS三轮0.00007731334544994214 / 0.00010470430350597993 / 0.00009354383680555556，中位0.00009354383680555556；长任务1/0/0，pageerror均0。1440×1000、DPR1、无CPU/网络限速、新context禁缓存、networkidle后观察8秒；三轮原值/资源/renderer与截图均保留。此基线用于与后续同图形依赖层P1比较，不能拿不同浏览器或静态/交互不同场景的分数混合。

环境失败记录：MCR官方全浏览器镜像769.8MB层长时间停滞，停止客户端；精简Debian Node备用FROM因auth.docker.io被DNS指到异常IPv6连接失败，未重试相同无效路径。最终通过Alpine明确拆包只增约5MiB驱动解决。它们都是基础设施事件，不是产品行为Red。
