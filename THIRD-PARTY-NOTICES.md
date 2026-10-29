# 来源与复用说明

## 题目与截图

需求来源为用户在本会话粘贴的“小影科技2027校招 全栈开发笔试题”，作者标识董信步。参考截图由用户另行提供，保存在 docs/requirements/images/；只作为本次作业设计参考，不声明持有原图版权，不将截图或其品牌、宠物/人物照片直接作为产品模板素材。

公开原图链接记录在需求文档，产品运行不依赖这些远程链接。题面上传交卷控件的 6 文件/100MB 限制不是产品上传限制。

## 开发方法参考

- [ccagent](https://github.com/XB-Dong/ccagent)，读取时 main 提交 `bc964298d49ad399ae325f57068c9149502b8c62`，主要参考 AGENTS.md、CONSTITUTION.md、NEXT-WAVES.md 的规格追踪、波次目录和所有权方式。
- [classroom-annotator](https://github.com/XB-Dong/classroom-annotator)，读取时 main 提交 `d31971124cfcbad19e9b56efd54f6f963d618310`，主要参考 P0-PLAN.md、AGENTS.md 的原生子 Agent、任务包、工作树、独立验收与交接方式。

本项目重新撰写适用于笔试的规则和规格，未复制两个项目的业务代码或运行配置。历史授权、凭据、具体模型、云主机和截止时间不复用。

## 后续依赖与素材

实际依赖包括 Next.js 16.4.3、React 19.3.1、TypeScript 5.9.3、TanStack Query 5.105.0、Vitest 5.0.5、RTL 16.3.2、ESLint 9.39.2；前端准确版本与许可信息随 package-lock.json 和原包提供。Java 使用 Spring Boot 3.5.16、MyBatis Starter 3.0.5、Boot 管理的 Flyway/MySQL Connector，版本由 pom 与 BOM 固定；原包许可随 Maven 制品提供。未复制第三方业务实现。

后端四张 600×900 原创程序生成 PNG 在 backend/src/main/resources/demo/，用于封面、示例上传和预置结果；生成器 backend/scripts/generate_demo.py 只使用 Python 标准库，没有外部照片或付费资源。Docker 基础镜像为官方 Node、Maven/Temurin、MySQL、Python，Dockerfile/Compose 锁定 digest。

若 P1 改用外部素材，逐项登记资源页、许可、作者、获取日期和使用位置，保存离线文件；当前 NEXT-WAVES 的链接仅是后续筛选入口，没有把这些网站上的素材纳入 P0。
