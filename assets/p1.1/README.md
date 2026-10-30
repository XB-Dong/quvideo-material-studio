# 疏影水墨背景资源

唯一生产文件为`frontend/public/ink/landscape.webp`（1600×560，63202B）；雾层与清晰层共用同一文件。原参考已在准备材料保存，无需运行时访问博物馆或下载资源。

## 容器重做

在仓库根目录执行：

```powershell
docker build -t material-p11-assets-tools -f assets/p1.1/Dockerfile .
docker run --rm --mount "type=bind,source=$($PWD.Path),target=/workspace" material-p11-assets-tools python assets/p1.1/prepare_ink.py
```

POSIX shell将mount换为`--mount "type=bind,source=$(pwd),target=/workspace"`。所有转换在容器执行，宿主机不需Pillow。基础镜像锁digest，Pillow锁11.3.0，实际libwebp1.5.0；生产manifest记录全部参数、库版本、源与输出哈希。`trial_encoding.py`可重做9组有界编码试验，不改生产文件。

## 来源与取舍

吴云（1811–1883），1854《仙霞新霁图》/Landscape，The Met藏品737785，2024.549.47。[官方资源页](https://www.metmuseum.org/art/collection/search/737785)标Public Domain，[Open Access](https://www.metmuseum.org/hubs/open-access)采用CC0。画心裁切为原4000×3000中的`(0,1050,3000,2100)`，去摄影黑边、色卡、上方题跋；去黄转冷浅纸色。源码和衍生来源详见[交付来源清单](../../docs/assets/provenance.json)。转换脚本重做后仍输出阶段记录`docs/waves/P1.1/evidence/assets/production-manifest.json`；该记录不作为应用启动依赖。

首轮1800px/quality70为139282B，超过80KiB已留失败证据；随后有界试验选1600px、0.4px纸纹平滑与quality40，保留山石/树木笔触，低于64KiB目标。三次实际容器转换输出逐字节一致。原图与最终衍生已实际查看；资产自查不代表真实页面动效、首屏总预算或独立G01/G02通过。
