# P2执行冻结与交付选择

2026-10-30用户明确启动P2；开发基准8c9f91af73d0ad5203162b504856b9f02b2990d6，准备封存66fdfe4。Leader独占共享契约/集成/报告，Backend/Frontend分别持Java账户与UI生命周期，Acceptance独立检查/媒体，Backend释放后Reviewer进入。启动后不向用户提问。

身份按specs/p2/identity.md：注册升级原guest userId保留作品并撤销旧guest会话；登录不合并访客历史；退出签新guest；改密撤销全账户旧token。原R-10匿名身份本来有实现，账户是用户确认的本轮范围，不篡改原题要求。昵称/密码字符按Unicode code point，双方校验已同步，冻结API发布在specs/api.yaml。

前端持久Provider串行原session初始化/重试与所有认证动作，避免旧Set-Cookie覆盖新身份。Next PATCH由Frontend唯一writer补导出，沿用通用proxy。后端作者检查发现MyBatis一级缓存导致等待user锁后仍见旧session；真实并发401用例失败保留，锁查询flushCache与账户READ_COMMITTED修复后作者26项通过。独立运行与迁移尚需验证，不将作者自测冒称独立验收。

源码ZIP采用**项目文件直接位于ZIP根目录**（README.md、compose.yaml等），评估者解压到一个新目录即可运行；不额外加目录前缀。这与独立verify-archive.py的必需entries一致。候选/最终包都绑定精确source SHA、entries与hash；后续纯报告/GIF差异记录清楚，执行文件/运行命令改变则重新验证。

工具媒体镜像固定官方Playwright1.58.2-noble manifest，独立于Alpine资源测量镜像。录制在性能窗口后，原始视频与私有证据在仓库外；两脱敏真实GIF由Acceptance独占写入docs/submission/media，作为源码展示和外部附件。根MIT仅许可原创部分，保留React Bits附加许可与照片/题面等例外；公开/历史重写/交卷不授权。
