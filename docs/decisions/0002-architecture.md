# 决定 0002 轻量实现与兼容系列

日期：2026-10-29；状态：本项目设计基线，补丁锁定与运行验证在 P0 R0。

采用 Next.js 16 App Router + React 19 + TypeScript 5 + Node.js 22；Java 21 + Spring Boot 3.5 + MyBatis Spring Boot Starter 3.0；MySQL 8.4；npm 和 Maven。Java 全权拥有模板、文件、身份、任务、查询与持久化。Next 只做页面与同源转发，不承担业务状态机。

依据：[Next.js 16 升级说明](https://nextjs.org/docs/app/guides/upgrading/version-16)列出的 Node.js 最低版本为 20.9；[Spring Boot 3.5 系统要求](https://docs.spring.io/spring-boot/3.5/system-requirements.html)要求至少 Java 17；[MyBatis 官方兼容矩阵](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)将 Starter 3.0 系列对应到 Boot 3.2–3.5 与 Java 17+。这些证明系列搭配依据，不能代替本项目构建测试。

R0 核实该系列可用的安全补丁，提交准确版本、npm 锁文件、Maven 依赖和镜像 digest；不使用浮动 latest。若需要跨系列改变，更新本决定和契约后验证。Next 16 使用单独 ESLint CLI，不能把 next build 当 lint/typecheck 的替代。

采用 Java 有界单线程 FIFO 执行器和 MySQL 状态持久化，不引入 MQ/Redis。任务先事务提交，再派发；拒绝派发要落失败状态。各阶段短事务写入边界，耗时模拟不持有事务。重启自动续跑不做，但启动时将遗留非终态收束为可解释的中断失败。

身份用后端随机不透明会话 token 的 HttpOnly Cookie，数据库只保存 token 哈希；同源入口避免浏览器直接跨域。用户没有注册密码服务。文件使用后端命名卷，私有素材和结果均经 Java 鉴权接口读取，不直接暴露静态磁盘目录。

前端使用 TanStack Query 管理服务器查询，上传槽位与提交态独立存储。轮询仅服务于非终态任务，查询错误独立于任务失败；缓存键带用户标识、任务 ID，响应有版本防倒退。具体规则见 specs/frontend-state.md。
