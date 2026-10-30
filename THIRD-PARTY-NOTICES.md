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

## P1产品素材与图形源码

四张具体Unsplash许可照片已接入本地Java资源：Shutter Speed雪山（2026-01-04）、Joe Caione白犬（2018-08-15）、Tiko Giorgadze霓虹人像（2018-02-25）、Pawel Czerwinski蓝紫流体（2020-12-08）。原始资源页、下载URL、作者、获取日期和源SHA见[原图清单](docs/waves/P1/references/manifest.json)，生产JPEG/PNG的实际尺寸、字节、裁切焦点与hash见[生产清单](docs/waves/P1/evidence/assets/production-manifest.json)。各具体页已核对[Unsplash License](https://unsplash.com/license)，未采用Unsplash+；作者不代表代言本项目。产品运行不外链。转换开发工具Pillow11.3.0（MIT-CMU）只在工具容器，不进入Java依赖。P0原创四PNG与V1/V2仍保留。

七项React Bits组件已按TS-CSS源码接入frontend/src/components/react-bits/，版权David Haz，完整[MIT + Commons Clause License Condition v1.0](frontend/src/components/react-bits/LICENSE.md)随源码保留，不能简称纯MIT。原始14文件hash、registry源URL及独立GitHub许可提交见[源冻结](docs/waves/P1/evidence/leader-baseline/source-freeze.json)，本地适配见[ADAPTATIONS](frontend/src/components/react-bits/ADAPTATIONS.md)。registry与GitHub内容等价性没有自动断言；本项目将组件集成为应用，不单独分发组件/工具库。

实际图形依赖OGL1.0.11为Unlicense，准确版本/完整包完整性在frontend/package-lock.json及原NPM包。普通动效采用CSS+React；曾验证的Motion候选已因无实际import而移除。验收用Playwright1.58.2（Apache-2.0）、Alpine Chromium/SwiftShader及Noto CJK等包在独立工具镜像安装，不作为前端产品包或外链资源；准确浏览器和driver按各次报告记录，包许可随原发行包提供。

## P1.1水墨与创意适配

水墨装饰取自吴云（1811–1883）1854《仙霞新霁图》/Landscape，The Metropolitan Museum of Art藏品737785/2024.549.47。[藏品页](https://www.metmuseum.org/art/collection/search/737785)及[Open Access/CC0](https://www.metmuseum.org/hubs/open-access)提供公开领域依据。原始DP-42597-004.jpg裁掉摄影边框、色卡和题跋，调为冷浅纸色并编码为frontend/public/ink/landscape.webp。来源/裁切/源与产图哈希见[P1.1清单](docs/waves/P1.1/evidence/assets/production-manifest.json)，[容器转换](assets/p1.1/README.md)固定Pillow11.3.0（[HPND许可](https://github.com/python-pillow/Pillow/blob/11.3.0/LICENSE)），不增加产品运行依赖。

P1.1默认使用原生Canvas2D/CSS/SVG实现擦雾、光晕、点阵/网点/水波/像素及边框；Orbit使用已有上游适配。未运行的上游shader与实际采用代码、Glare Hover/Magic Bento的边缘设计参考在[适配说明](frontend/src/components/react-bits/ADAPTATIONS.md)分别登记，不将保留源码等同实际运行。

## P1.2交互设计与显示衍生

跳转封面桥、六点点击反馈、上传/阶段/弹窗使用项目自行实现的CSS/SVG/WAAPI；Next Link/useLinkStatus与原生dialog保留语义。React官方ViewTransition/Next Frames、React Aria FileTrigger、Aceternity File Upload、Motion布局与React Bits ClickSpark/StarBorder仅借鉴交互思路，未复制新组件源码或安装Motion/Aceternity。逐项来源与registry审计见[P1.2参考](docs/waves/P1.2/references/README.md)，原有React Bits许可证继续保留。开发类型@types/react及react-dom更新至19.3.0，未新增产品运行依赖。

认证结果卡片的512px白底JPEG由Java标准ImageIO按已有本地结果生成显示衍生，不增加第三方图片或外链。原PNG及用户上传不修改，弹窗预览使用完整原图；源照片许可与归属沿用P1素材清单。
