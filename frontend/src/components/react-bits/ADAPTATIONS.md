# React Bits来源与适配

官方TS-CSS registry源码；14文件原始哈希和源URL见docs/waves/P1/evidence/leader-baseline/source-freeze.json，GitHub许可提交e12c22192ac7b4b452c5e2feb9b586d74765d696。registry与GitHub内容等价性不作断言。版权David Haz，完整MIT + Commons Clause见LICENSE.md。

适配：外层独立偏好/可见性/互斥/idle控制；WebGL卸载主动loseContext；DPR上限1.5、Electric像素预算1MP；Pixel点数上限24；浅色颜色与props由产品适配层提供。原源码保留，第三方文件独立关闭lint规则，产品控制器正常lint/测试。实际运行验收由独立Acceptance完成。
