# 开发执行步骤

## Phase 1: 项目基础设施 ✅
- [x] 创建项目目录结构
- [x] 创建 CLAUDE.md 指引文件
- [x] 创建标准文档 (requirements, tech-spec, design-spec, data-model, implementation-steps)

## Phase 2: 静态UI搭建 ✅
- [x] 星空背景动画 (Canvas粒子)
- [x] 主页面布局框架 (6个页面区域 + 导航)
- [x] 深蓝黑 + 银色冷光配色
- [x] 欧式古典衬线字体引入 (Cinzel, Cormorant Garamond, EB Garamond)

## Phase 3: 牌阵选择功能 ✅
- [x] 10种经典牌阵定义 (中英双语)
- [x] 牌阵选择界面 (卡片式网格布局)
- [x] 点击选择牌阵 → 进入提问页面

## Phase 4: 抽牌功能 ✅
- [x] 方式A: 数字输入 (1-78, 防重复验证)
- [x] 方式B: 牌圈交互 (Three.js 3D牌圈, 鼠标拖拽旋转, 点击选牌)
- [x] 正位/逆位随机判定
- [x] 抽牌音效 + 粒子特效

## Phase 5: 牌面展示 ✅
- [x] 牌面翻转动画 (CSS 3D transform)
- [x] 几何花纹牌面设计
- [x] 牌位信息显示 (中英双语)

## Phase 6: 内容系统 ✅
- [x] 22张大阿尔卡那完整内容 (含义、象征、典故、案例)
- [x] 56张小阿尔卡那模板化内容
- [x] 牌面详情弹窗 (点击查看完整释义)

## Phase 7: AI解读集成 ✅
- [x] Claude API 接入
- [x] Prompt 设计 (结合问题+牌阵+牌义)
- [x] API Key 本地存储 + 弹窗设置
- [x] 离线降级方案 (预置内容摘要)

## Phase 8: 历史记录 ✅
- [x] IndexedDB 存储 (localStorage降级)
- [x] 历史列表页面
- [x] 历史详情回放

## Phase 9: 打磨优化
- [ ] 过渡动画完善
- [ ] 响应式适配
- [ ] 性能优化
- [ ] 浏览器全流程测试
