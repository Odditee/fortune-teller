# 塔罗占卜 Web 应用 — AI 助手工作指引

## 项目概述
在 MacBook Air 上运行的塔罗牌占卜网页应用。用户是不懂代码的小白。
核心功能：选择牌阵 → 抽牌 → AI解读 → 历史记录。
UI：星空银色冷光主题，欧式古典字体，中英双语。

## 技术栈
- 纯 HTML + CSS + JavaScript
- Three.js（CDN，牌圈3D交互）
- IndexedDB（本地存储）
- Anthropic Claude API（AI解读）
- Web Audio API（合成音效）

## 标准文档索引
| 文档 | 路径 |
|------|------|
| 需求规格 | docs/requirements.md |
| 技术方案 | docs/tech-spec.md |
| 设计规范 | docs/design-spec.md |
| 数据模型 | docs/data-model.md |
| 执行步骤 | docs/implementation-steps.md |

## 开发日志
- 路径：dev-logs/YYYY-MM-DD.md
- 每次会话结束前更新

## 协作机制（重要）
**逐项确认机制：** 任何涉及多个修改点的任务，必须将每个决策点拆成选择题（AskUserQuestion），逐项让用户确认后再执行。不得一次性列出所有问题让用户批量回答，也不得跳过确认直接实施。

## 开发原则
1. 渐进式推进，按Phase顺序执行
2. 一次一个模块，完成验证后再推进
3. 先跑通再优化
4. 每步浏览器验证
5. 更新日志
6. 逐项确认：多修改点任务 → 每个决策点用选择题方式逐项确认 → 确认一项执行一项

## 关键文件
- 入口：src/index.html
- 样式：src/css/main.css
- 主逻辑：src/js/app.js
- 卡牌数据：src/js/cards.js
- 牌阵：src/js/spreads.js
- 历史：src/js/history.js
- 牌圈：src/js/circle.js
- 特效：src/js/effects.js
- 音效：src/js/audio.js
- API：src/js/api.js
