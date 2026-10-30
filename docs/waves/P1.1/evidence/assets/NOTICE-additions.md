# 交给Leader的来源登记

请将以下内容合入根THIRD-PARTY-NOTICES及README资产说明（本Agent无根文件写权限）。

- 水墨装饰背景：吴云（Wu Yun, 1811–1883），1854《仙霞新霁图》/Landscape，The Metropolitan Museum of Art，藏品737785/2024.549.47。[资源页](https://www.metmuseum.org/art/collection/search/737785)，[Open Access / CC0](https://www.metmuseum.org/hubs/open-access)。原始下载DP-42597-004.jpg；原图及衍生SHA、完整裁切/调色/编码参数见P1.1 production-manifest.json。
- 使用范围：`frontend/public/ink/landscape.webp`，浅色水墨装饰，同一资源供清晰/雾层；裁切去摄影边框/色卡/题跋、去黄转冷纸色、缩放与WebP编码。
- 转换工具：Pillow11.3.0（HPND许可，https://github.com/python-pillow/Pillow/blob/11.3.0/LICENSE），仅构建工具，无前端新增runtime依赖。构建容器Python3.12.12-slim锁digest；重做命令见assets/p1.1/README.md。
