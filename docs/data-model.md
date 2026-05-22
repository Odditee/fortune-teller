# 数据模型设计

## Card (卡牌)
```js
{
  id: Number,           // 1-78
  name: String,         // 中文名
  nameEn: String,       // 英文名
  arcana: 'major'|'minor',
  suit: 'wands'|'cups'|'swords'|'pentacles'|null,
  number: Number|null,  // 牌面数字
  element: String,      // 火/水/风/土
  keywords: [String],   // 双语关键词
  upright: {
    meaning: String,    // 正位含义
    symbolism: String,  // 象征意象
    story: String,      // 历史典故
    cases: [String],    // 事件案例
  },
  reversed: {
    meaning: String,
    symbolism: String,
    story: String,
    cases: [String],
  }
}
```

## Spread (牌阵)
```js
{
  id: String,           // 英文标识
  name: String, nameZh: String,
  icon: String,         // Unicode符号
  cardCount: Number,    // 牌数
  shortDesc: String, shortDescZh: String,
  description: String, descriptionZh: String,
  suitableFor: [String],
  positions: [{
    index: Number,
    name: String, nameZh: String,
    description: String, descriptionZh: String,
  }],
}
```

## DrawnCard (抽牌结果)
```js
{
  cardId: Number,       // 1-78
  isReversed: Boolean,  // 是否逆位
}
```

## ReadingRecord (历史记录)
```js
{
  id: String,           // 自动生成
  timestamp: Number,    // Unix毫秒
  question: String,
  spreadId: String,
  spreadName: String,
  spreadIcon: String,
  cards: [DrawnCard],
  interpretation: String, // AI解读HTML
  notes: String,          // 用户备注
}
```

## AppState (运行时状态)
```js
{
  currentPage: String,
  selectedSpread: Spread|null,
  drawMode: 'circle'|'number'|null,
  question: String,
  drawnCards: [DrawnCard],
  readingResult: String|null,
}
```

## IndexedDB 结构
- Database: `tarot-db` v1
- Object Store: `readings` (keyPath: id, index: timestamp)
- Object Store: `settings` (keyPath: key)
