# 数据模型规格

版本：1.0.0。MySQL 8.4、InnoDB、utf8mb4；所有时间保存 UTC 并以 ISO 8601 返回，页面按本地时区展示。UUID 由后端生成并使用一致的字符串格式。下列为迁移设计，尚无实际 SQL。

| 表 | 关键字段 | 约束与索引 |
| --- | --- | --- |
| users | id, display_name, created_at | id 主键；不存真实邮箱密码 |
| sessions | id, user_id, token_hash, expires_at, created_at | token_hash 唯一；user_id 外键；不存明文 token |
| categories | id, title, sort_order | id 主键 |
| templates | id, category_id, title, description, cover_key, required_image_count, accepted_mime_types, max_file_size_bytes, result_key, sort_order | category 外键；required_image_count>0；种子图可访问 |
| assets | id, user_id, storage_key, original_name, mime_type, size_bytes, width, height, created_at | user 外键；storage_key 唯一；原名仅展示并转义 |
| tasks | id, user_id, template_id, template_title, status, stage, failed_stage, failure_code, failure_reason, result_key, version, simulation_json, created_at, started_at, completed_at, updated_at | (user_id,created_at,id) 历史索引；status 索引；version 从 1 单调递增 |
| task_assets | task_id, asset_id, slot_index | (task_id,slot_index) 主键；(task_id,asset_id) 唯一；快照关联不可变 |
| task_steps | task_id, stage, status, started_at, completed_at, failure_reason | (task_id,stage) 主键；NOT_STARTED/RUNNING/SUCCEEDED/FAILED |

status=QUEUED/RUNNING/SUCCEEDED/FAILED；stage 与 failed_stage 仅允许 ASSET_CHECK/GENERATE/FINALIZE 或 null。业务层与 SQL 约束保持一致。失败原因可理解但不含堆栈、磁盘路径或凭据；失败码供测试和界面识别。

创建任务时预建三条 NOT_STARTED 步骤；开始/完成阶段时与 tasks 在同一事务更新。终态更新使用条件 WHERE status IN ('QUEUED','RUNNING') 或 version 条件防止覆盖；RUNNING 的 stage 推进只允许顺序，任何终态不得回退。即使执行器是单线程，也要通过条件更新避免迟到回调。

历史列表按 created_at DESC,id DESC 稳定排序，采用游标分页，单页默认 20、最多 50。activeOnly=true 时仅返回 QUEUED/RUNNING，同样带游标，前端读取全部活跃页以恢复跟踪。任务查询提供完整 steps 和 version，历史列表返回同样结构以简化缓存。无删除任务或资产接口，孤立上传在本题可保留并说明占盘限制。

## 初始化与素材

后端迁移创建全部表结构，包括 users/sessions，并初始化分类/模板种子；匿名用户与会话记录在运行时插入，不预置固定身份。准备四个模板：旅行明信片（创意，2图）、宠物肖像（宠物，1图）、三格故事（创意，3图）、光影头像（人像，1图）。使用原创合成 JPEG/PNG；生成脚本、封面、示例上传、预置结果入仓库。不能依赖付费、内部服务或浏览器 blob URL。

迁移文件放 backend/src/main/resources/db/migration/，版本唯一、Leader 分配；采用 Flyway（MySQL 支持模块需匹配版本）。迁移首次初始化数据库，后续重启不覆盖任务。不要同时让 MySQL init 脚本和 Flyway 创建相同表。必须真实 MySQL 验证，H2 不替代 MySQL 兼容性证据。
