# 网页封面编码与传输预算修复

2026-10-30T01:36:16+08:00；根任务P1-ASSET，需求P1-VIS-02/P1-QUALITY-01/P1-DEL-01。本轮由Leader明确委派一次有界图片编码优化，基准为资产分支cd2b51964cab97a427c33fdc3b502c0d706d7f66；不改业务、API、DBkeys、迁移或测试断言。

## 原因与范围

Leader报告真实CI两次首视口imageEncodedBytes均996880B，另一次757983B，CDP wire也约1MB；hero多处展示的请求确实累积，不能当缓存命中忽略。沿用原预算，不隐藏请求或放宽门槛。本Agent不独立声称下载/验证这些CI记录，其来源为Leader派发。

只将4张*-p1-cover.jpg从JPEG quality86、4:4:4调整为quality82、4:2:0，保留progressive/optimize、原始照片、裁切焦点、RGB色彩、480×640尺寸和图片URL。源照片与PNG结果未重新着色，所有私有结果业务不变。

| 封面 | 原字节 | 新字节 | SHA256前12位（旧→新） |
| --- | ---: | ---: | --- |
| postcard | 55356 | 46077 | 418f5364df2b → c7a1e1f22bc6 |
| pet | 62962 | 42971 | 4ec3421dec61 → b7b9edefaa2b |
| portrait | 41292 | 27440 | 37a82ff47ff6 → 8ace67bd3023 |
| story | 120579 | 66128 | 2eed78f2f5fc → 8ea2c133b92e |

四图总量280189→182616B。按Leader给出的实际最坏请求权重4×(postcard+pet+story)+portrait，原996880B→648144B（约633KiB），较750KiB目标768000B留119856B余量。这是源图字节加权估算，不冒充新版本浏览器wire实测；Root仍需集成后复验/CI。

## 真实验证

在原material-p1-assets-tools镜像（Python3.12.12固定digest、Pillow11.3.0）执行转换与重复转换；两个输出manifest和资产逐字节一致。原四PNG、四P1结果PNG、三SQL迁移、Api.java/FilesService.java共13文件前后SHA不变；逐文件及完整新旧封面哈希见cover-budget-optimization.json，生产清单已记录quality82/4:2:0和新哈希。

已分别view_image查看全部四封面：雪山边缘与围栏、宠物毛发/耳部、人像五官轮廓与眼镜、抽象图流体纹理仍可辨，保留完整原裁切，不靠降分辨率达标。与未压缩裁切图PSNR约42.95/39.31/40.97/29.71dB，仅作压缩诊断；抽象图高饱和细纹更受色度采样影响，数值不等同视觉评分，实际页面与独立审核仍归Leader。

转换脚本只改封面编码参数并将参数显式记入manifest。未改Java生产/测试、V1/V2/V3、原PNG/结果PNG或前端。原15Java/8API和升级回滚证据在前提交；这次未将旧结果冒充新JPEG实测，Root负责新集成版本后端构建、15Java/8API、浏览器和CI。

许可/作者/来源不变。Leader正在纠正root/NOTICE素材工具许可，本轮不修改NOTICE-additions.md，避免覆盖其工作。所有素材安装/转换在容器内，主站服务未由本Agent改动。
