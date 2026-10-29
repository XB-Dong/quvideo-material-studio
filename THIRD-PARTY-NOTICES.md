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

若 P1 改用外部素材，逐项登记资源页、许可、作者、获取日期和使用位置，保存离线文件；P0没有采用外部照片。P1准备阶段下载的候选仅位于docs/waves/P1/references/assets/，尚未替换产品图。


## P1 准备候选（尚未接入产品）

2026-10-29保存四张具体Unsplash许可照片，仅用于本仓库的P1方向评审：Shutter Speed的雪山（2026-01-04）、Joe Caione的白犬（2018-08-15）、Tiko Giorgadze的霓虹人像（2018-02-25）、Pawel Czerwinski的蓝紫抽象（2020-12-08）。具体源页、下载URL、作者、日期、SHA256、尺寸和用途见[候选清单](docs/waves/P1/references/manifest.json)，各页许可已核对[Unsplash License](https://unsplash.com/license)。未采用Unsplash+；作者与本项目无代言关系。生产衍生图待P1-ASSET转换后补全记录。

React Bits七组件当前仅只读研究官方registry，未复制产品源码；源提交、每文件哈希、变体与依赖见[审计记录](docs/waves/P1/references/reactbits-audit.json)。[上游许可](https://github.com/DavidHDev/react-bits/blob/e12c22192ac7b4b452c5e2feb9b586d74765d696/LICENSE.md)为MIT + Commons Clause License Condition v1.0，版权David Haz，不能简称纯MIT；P1实现时将完整许可/版权随集成源码保存、记录修改，不单独分发组件或工具包。Motion14.7.1（MIT）与OGL1.0.11（Unlicense）为候选，尚未安装；启动后验证锁定并登记实际采用版本与完整许可。
