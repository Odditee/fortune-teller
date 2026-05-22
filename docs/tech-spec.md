# 技术方案说明

## 技术选型

| 层级 | 技术 | 理由 |
|------|------|------|
| 前端框架 | 无框架，纯 HTML/CSS/JS | 降低复杂度，适合单页应用 |
| 3D牌圈 | Three.js v0.160 (CDN/ES Module) | 78张牌3D排列 + 射线检测选牌 |
| 本地存储 | IndexedDB (localStorage 降级) | 存储历史记录和设置 |
| AI解读 | Anthropic Claude API (Sonnet) | 高质量中文解读，按量付费 |
| 音效 | Web Audio API | 合成音效，无需外部音频文件 |
| 字体 | Google Fonts (Cinzel, Cormorant Garamond, EB Garamond) | 欧式古典衬线字体 |

## 架构设计

### 页面状态机
```
spread-select → question → draw (number/circle) → reveal
                                                      ↓
                                                  history (只读回放)
```

### 脚本加载顺序
1. cards.js — 78张牌数据（底层数据）
2. spreads.js — 10种牌阵定义
3. effects.js — 星空背景、粒子、Toast
4. audio.js — Web Audio API 音效
5. history.js — IndexedDB 存储
6. api.js — Claude API 调用
7. circle.js — Three.js 牌圈
8. app.js — 主逻辑（依赖以上所有模块）

### Three.js 加载方式
使用 `<script type="importmap">` 映射 Three.js CDN 路径，circle.js 中 `await import('three')` 动态加载。

## API 集成

### 请求格式
- Endpoint: `https://api.anthropic.com/v1/messages`
- Model: `claude-sonnet-4-6`
- Max Tokens: 1500
- Temperature: 0.8
- System Prompt: 资深塔罗解读师角色设定

### 混合内容策略
- 78张牌含义 → 预置JS数据（约95KB）
- 综合解读 → AI实时生成（500-800字/次）
- 离线降级 → 展示预置内容摘要

### 费用估算
- 每次解读约 500-800 tokens 输出 + ~2000 tokens 输入
- 约 ¥0.15-0.50/次
- 每日1次 ≈ ¥3-8/月

## 兼容性
- 目标浏览器：Chrome, Safari (MacBook Air)
- Three.js WebGL 需要现代浏览器
- IndexedDB 所有现代浏览器均支持
