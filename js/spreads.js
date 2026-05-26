/* ========================================
   spreads.js — 26 Classic Tarot Spreads (Bilingual)
   Categorized by life domain for flip-book navigation
   ======================================== */

const TAROT_SPREADS = [
  // ═══════════════════════════════════════════
  // 恋爱心语 · Love (3 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'relationship', category: 'love',
    name: 'Relationship Mirror', nameZh: '关系之镜', icon: '♥', cardCount: 7,
    shortDesc: 'See into any relationship deeply', shortDescZh: '深度透视两人关系',
    description: 'Seven cards illuminating the full dynamic between two people — romantic, platonic, or professional. From your feelings to their heart, from obstacles to common ground.',
    descriptionZh: '七张牌照亮两人之间的完整动态——无论爱情、友情还是合作关系。从你的感受到对方的内心，从障碍到连接点。',
    bestFor: 'Best for: romantic confusion, friendship tension, understanding any 1-on-1 bond', bestForZh: '适合：感情困惑、友情矛盾、理解任何一对一关系',
    positions: [
      { index:1, name:'Your Feelings', nameZh:'你的感受', description:'What you truly feel in this connection', descriptionZh:'在这段关系中你真正的感受' },
      { index:2, name:'Their Feelings', nameZh:'对方的感受', description:'What they truly feel in this connection', descriptionZh:'对方在这段关系中真正的感受' },
      { index:3, name:'The Bond', nameZh:'关系现状', description:'The living connection between you', descriptionZh:'你们之间鲜活的连接' },
      { index:4, name:'Obstacle', nameZh:'障碍', description:'What stands between you', descriptionZh:'横亘在你们之间的阻碍' },
      { index:5, name:'Common Ground', nameZh:'连接点', description:'The thread that holds you together', descriptionZh:'将你们维系在一起的纽带' },
      { index:6, name:'Advice', nameZh:'建议', description:'How to nurture this bond', descriptionZh:'如何滋养这段关系' },
      { index:7, name:'Future', nameZh:'未来发展', description:'Where this relationship leads', descriptionZh:'这段关系的发展方向' },
    ],
  },
  {
    id: 'venus', category: 'love',
    name: 'Venus Mirror', nameZh: '维纳斯之镜', icon: '♀', cardCount: 8,
    shortDesc: 'Venus-inspired love oracle', shortDescZh: '以维纳斯之名，观爱之全貌',
    description: 'Named for the goddess of love, eight cards map the full landscape of a romantic connection — what each brings, what blocks the way, and where the deeper current flows.',
    descriptionZh: '以爱神维纳斯之名，八张牌描绘一段感情的全景——彼此带来什么，什么挡在路上，以及更深的暗流流向何方。',
    bestFor: 'Best for: deep romantic exploration, new love, rekindling connection', bestForZh: '适合：深入探索恋情、新感情、重燃爱火',
    positions: [
      { index:1, name:'Your Heart', nameZh:'你的心', description:'Your true feelings and desires', descriptionZh:'你真实的感受与渴望' },
      { index:2, name:'Their Heart', nameZh:'对方的心', description:'Their true feelings and desires', descriptionZh:'对方真实的感受与渴望' },
      { index:3, name:'The Spark', nameZh:'吸引力', description:'What draws you together', descriptionZh:'将你们吸引在一起的力量' },
      { index:4, name:'The Shadow', nameZh:'暗面', description:'The unspoken tension between you', descriptionZh:'你们之间未曾言说的张力' },
      { index:5, name:'Your Gift', nameZh:'你的礼物', description:'What you bring to this connection', descriptionZh:'你为这段关系带来的礼物' },
      { index:6, name:'Their Gift', nameZh:'对方的礼物', description:'What they bring to this connection', descriptionZh:'对方为这段关系带来的礼物' },
      { index:7, name:'Venus\'s Counsel', nameZh:'维纳斯的忠告', description:'The goddess\'s advice for this love', descriptionZh:'爱神维纳斯对这份爱的忠告' },
      { index:8, name:'Destiny of Two', nameZh:'两人之命', description:'Where this connection is headed', descriptionZh:'这段关系走向何方' },
    ],
  },
  {
    id: 'helen', category: 'love',
    name: 'Helen\'s Choice', nameZh: '海伦之择', icon: '⚜', cardCount: 6,
    shortDesc: 'For matters of the heart at a crossroads', shortDescZh: '心有千千结，海伦为你解',
    description: 'Named for Helen of Troy, whose face launched a thousand ships — this spread helps when the heart stands at a crossroads between duty, desire, and destiny.',
    descriptionZh: '以特洛伊的海伦命名——她的面容发动了千艘战舰。当心在责任、渴望与命运之间左右为难时，此牌阵助你明辨。',
    bestFor: 'Best for: love triangles, difficult romantic choices, heart vs. mind dilemmas', bestForZh: '适合：感情三角、艰难的爱情抉择、心与理智的冲突',
    positions: [
      { index:1, name:'What the Heart Knows', nameZh:'心之所知', description:'The truth your heart already holds', descriptionZh:'你的心已经知晓的真相' },
      { index:2, name:'What the Mind Argues', nameZh:'理智之辩', description:'What reason says, for and against', descriptionZh:'理性在为你争辩什么' },
      { index:3, name:'What Others Expect', nameZh:'他人之期', description:'The weight of outside expectations', descriptionZh:'外界期望的重量' },
      { index:4, name:'The Hidden Cost', nameZh:'隐藏的代价', description:'What each path would truly cost', descriptionZh:'每条路真正的代价' },
      { index:5, name:'The Soul\'s Choice', nameZh:'灵魂之选', description:'The path that aligns with your deeper self', descriptionZh:'与你深层自我对齐的道路' },
      { index:6, name:'Helen\'s Whisper', nameZh:'海伦的低语', description:'The final counsel of a heart that chose', descriptionZh:'曾做出选择的心灵最后的低语' },
    ],
  },

  // ═══════════════════════════════════════════
  // 事业征途 · Career (4 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'celtic-cross', category: 'career',
    name: 'Celtic Cross', nameZh: '凯尔特十字', icon: '✧', cardCount: 10,
    shortDesc: 'The most comprehensive classic spread', shortDescZh: '最经典全面的牌阵',
    description: 'Ten cards cross-analyze from multiple dimensions — the heart of the matter, obstacles, past roots, future horizons, and final outcome. The gold standard for deep inquiry.',
    descriptionZh: '十张牌从多个维度交叉分析——问题核心、阻碍、过往根源、未来地平线与最终结局。深度求索的黄金标准。',
    bestFor: 'Best for: major life decisions, complex situations needing comprehensive insight', bestForZh: '适合：重大人生决策、复杂困境、需要全方位洞察的局面',
    positions: [
      { index:1, name:'Present', nameZh:'现状', description:'The heart of the matter', descriptionZh:'问题核心所在' },
      { index:2, name:'Challenge', nameZh:'阻碍', description:'What crosses you', descriptionZh:'横亘在你面前的事物' },
      { index:3, name:'Root', nameZh:'根源', description:'The foundation beneath', descriptionZh:'问题之下的根基' },
      { index:4, name:'Past', nameZh:'过去', description:'What has passed but still echoes', descriptionZh:'已逝去但仍有余音的回响' },
      { index:5, name:'Crown', nameZh:'目标', description:'Your highest aspiration', descriptionZh:'你最高的期许' },
      { index:6, name:'Near Future', nameZh:'近未来', description:'What approaches soon', descriptionZh:'即将来临之事' },
      { index:7, name:'Self', nameZh:'态度', description:'Your true stance', descriptionZh:'你真实的立场' },
      { index:8, name:'Environment', nameZh:'环境', description:'The world around you', descriptionZh:'围绕你的环境' },
      { index:9, name:'Hopes & Fears', nameZh:'希望与恐惧', description:'What stirs within', descriptionZh:'内心涌动之物' },
      { index:10, name:'Outcome', nameZh:'结果', description:'Where this path leads', descriptionZh:'此路通往何方' },
    ],
  },
  {
    id: 'sacred-triangle', category: 'career',
    name: 'Sacred Triangle', nameZh: '圣三角', icon: '△', cardCount: 4,
    shortDesc: 'Heaven · Earth · Self — three forces shaping your path', shortDescZh: '天 · 地 · 人——三才并观',
    description: 'Rooted in the Chinese philosophy of Heaven-Earth-Humanity (天地人), four cards trace the interplay of cosmic timing, grounded reality, and personal agency in your career.',
    descriptionZh: '根植于天地人三才哲学，四张牌追溯天时、地利、人和在事业中的交织互动。',
    bestFor: 'Best for: balanced perspective on any situation — past/present/future + core', bestForZh: '适合：需平衡视角的任何局面——天地人三才全景',
    positions: [
      { index:1, name:'Heaven', nameZh:'天时', description:'Cosmic timing and opportunities beyond your control', descriptionZh:'天时：超越你掌控的宇宙时机与机遇' },
      { index:2, name:'Earth', nameZh:'地利', description:'Your environment, resources, and practical ground', descriptionZh:'地利：你的环境、资源与现实基础' },
      { index:3, name:'Humanity', nameZh:'人和', description:'Your skills, relationships, and personal power', descriptionZh:'人和：你的技能、人际关系与个人力量' },
      { index:4, name:'Synthesis', nameZh:'三才合一', description:'How these three forces weave together', descriptionZh:'三才合一：三股力量如何交织' },
    ],
  },
  {
    id: 'horus', category: 'career',
    name: 'Eye of Horus', nameZh: '荷罗斯之眼', icon: '☉', cardCount: 5,
    shortDesc: 'Egyptian wisdom for professional clarity', shortDescZh: '古埃及智慧，事业明灯',
    description: 'From the Egyptian Book of the Dead — five cards arranged as the Eye of Horus reveal what you see clearly, what remains hidden, and the action that restores balance.',
    descriptionZh: '源自埃及亡灵书——五张牌排列为荷罗斯之眼，揭示你所看清的、仍隐藏的、以及恢复平衡的行动。',
    bestFor: 'Best for: career crossroads, protection in professional battles, hidden workplace dynamics', bestForZh: '适合：职业十字路口、职场竞争中的守护、洞悉隐藏的人际动态',
    positions: [
      { index:1, name:'The Pupil', nameZh:'瞳孔', description:'What you see most clearly — the central truth', descriptionZh:'你看得最清之物——核心真相' },
      { index:2, name:'The Brow', nameZh:'眉角', description:'What protects you — your strengths and allies', descriptionZh:'保护你之物——你的力量与盟友' },
      { index:3, name:'The Tear', nameZh:'泪痕', description:'What you have lost or sacrificed — the hidden wound', descriptionZh:'你所失去或牺牲之物——隐藏的伤口' },
      { index:4, name:'The Scar', nameZh:'伤痕', description:'The lesson etched by past professional trials', descriptionZh:'过往职业试炼铭刻的教训' },
      { index:5, name:'The Restoration', nameZh:'复原之视', description:'Horus\'s eye restored — the action that heals and clarifies', descriptionZh:'荷罗斯之眼复原——疗愈与澄清的行动' },
    ],
  },
  {
    id: 'work-cycle', category: 'career',
    name: 'Work Cycle', nameZh: '工作周期', icon: '⟳', cardCount: 6,
    shortDesc: 'Navigate your professional season', shortDescZh: '识你职场四季',
    description: 'Based on the natural cycle of work — planting, tending, harvesting, and resting. Six cards map where you are in the cycle and what each phase asks of you.',
    descriptionZh: '基于工作的自然周期——播种、养护、收获、休养。六张牌描绘你处于周期的哪个阶段，以及每个阶段对你有什么要求。',
    bestFor: 'Best for: project planning, career rhythm check, knowing when to push or rest', bestForZh: '适合：项目规划、职业节奏检查、何时推进何时休整',
    positions: [
      { index:1, name:'Current Season', nameZh:'当前季节', description:'Where you are in the work cycle now', descriptionZh:'你当前在工作周期中所处的位置' },
      { index:2, name:'What to Plant', nameZh:'播种什么', description:'New skills, projects, or directions to begin', descriptionZh:'需要开始的新技能、项目或方向' },
      { index:3, name:'What to Tend', nameZh:'养护什么', description:'What needs patience and consistent effort', descriptionZh:'需要耐心与持续努力的事物' },
      { index:4, name:'What to Harvest', nameZh:'收获什么', description:'Fruits ready to be gathered now', descriptionZh:'此刻可以收获的果实' },
      { index:5, name:'What to Release', nameZh:'释出什么', description:'Projects, habits, or roles that have served their purpose', descriptionZh:'已完成使命的项目、习惯或角色' },
      { index:6, name:'Next Season', nameZh:'下一季节', description:'What the coming cycle holds', descriptionZh:'下一个周期蕴含什么' },
    ],
  },

  // ═══════════════════════════════════════════
  // 财富之匙 · Wealth (3 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'kether-cross', category: 'wealth',
    name: 'Kether Cross', nameZh: '凯特尔十字', icon: '✴', cardCount: 6,
    shortDesc: 'From matter to crown — the ladder of abundance', shortDescZh: '从物质到王冠——丰盛的天梯',
    description: 'Inspired by the Kabbalistic Sephira of Kether (the Crown), six cards trace the path from material wealth to spiritual abundance. True prosperity integrates both.',
    descriptionZh: '以卡巴拉生命之树的第一原质"王冠"为灵感，六张牌追溯从物质财富到灵性丰盛的阶梯。真正的富足两者兼备。',
    bestFor: 'Best for: financial planning, wealth-building strategy, manifesting abundance', bestForZh: '适合：财务规划、建立财富策略、显化丰盛',
    positions: [
      { index:1, name:'Kingdom', nameZh:'王国', description:'Your material foundation — income, assets, security', descriptionZh:'你的物质基础——收入、资产与安全感' },
      { index:2, name:'Foundation', nameZh:'根基', description:'The beliefs and habits beneath your finances', descriptionZh:'你财务状况之下的信念与习惯' },
      { index:3, name:'Flow', nameZh:'流动', description:'How money moves through your life — giving and receiving', descriptionZh:'金钱如何在你生命中流动——给予与接收' },
      { index:4, name:'The Block', nameZh:'阻塞', description:'What restricts your flow of abundance', descriptionZh:'限制你富足之流的事物' },
      { index:5, name:'The Key', nameZh:'钥匙', description:'The insight or action that unlocks greater flow', descriptionZh:'开启更大丰盛的洞见或行动' },
      { index:6, name:'Crown', nameZh:'王冠', description:'The highest expression of abundance available to you', descriptionZh:'你所能获得的最高的丰盛表达' },
    ],
  },
  {
    id: 'alchemical-lion', category: 'wealth',
    name: 'Alchemical Lion', nameZh: '炼金术狮子', icon: '🜂', cardCount: 5,
    shortDesc: 'Transform lead into gold — alchemy of resources', shortDescZh: '化铅为金——资源的炼金术',
    description: 'Five cards representing the alchemical stages of material transformation: Salt (body/resources), Mercury (mind/strategy), Sulfur (will/desire), Calcination (breaking down), and Coagulation (rebuilding).',
    descriptionZh: '五张牌代表物质转化的炼金术阶段：盐（身体/资源）、汞（心智/策略）、硫（意志/渴望）、煅烧（瓦解）和凝结（重建）。',
    bestFor: 'Best for: transforming scarcity mindset, unlocking prosperity, material breakthroughs', bestForZh: '适合：转化匮乏心态、开启富足、物质层面的突破',
    positions: [
      { index:1, name:'Salt · 盐', nameZh:'物质基础', description:'What you have — your current resources and security', descriptionZh:'你所拥有的——当前资源与安全感' },
      { index:2, name:'Mercury · 汞', nameZh:'心智策略', description:'What you know — your financial wisdom and strategy', descriptionZh:'你所知的——财务智慧与策略' },
      { index:3, name:'Sulfur · 硫', nameZh:'意志之火', description:'What you desire — your true financial goals and drives', descriptionZh:'你所渴望的——真正的财务目标与动力' },
      { index:4, name:'Calcination · 煅烧', nameZh:'破旧', description:'What must be burned away — limiting beliefs and habits', descriptionZh:'必须烧毁的——限制性信念与习惯' },
      { index:5, name:'Coagulation · 凝结', nameZh:'立新', description:'What will crystallize — the new financial form emerging', descriptionZh:'即将结晶的——正在形成的新财务形态' },
    ],
  },
  {
    id: 'four-elements', category: 'wealth',
    name: 'Four Elements', nameZh: '四元素', icon: '⊹', cardCount: 4,
    shortDesc: 'Fire · Water · Air · Earth — elemental balance', shortDescZh: '火 · 水 · 风 · 土——元素平衡',
    description: 'Four cards representing the elemental forces shaping your material life: Fire (action), Water (emotion), Air (thought), Earth (matter).',
    descriptionZh: '以火水风土四大元素为框架，分析问题在不同能量层面的表现。',
    bestFor: 'Best for: holistic wealth check — balancing earning, spending, saving, and investing', bestForZh: '适合：全面财富检视——平衡赚、花、存、投四个方面',
    positions: [
      { index:1, name:'Fire', nameZh:'火', description:'Action & passion — the spark that drives you', descriptionZh:'行动与热情——驱动你的火花' },
      { index:2, name:'Water', nameZh:'水', description:'Emotion & intuition — the flow beneath the surface', descriptionZh:'情感与直觉——表面之下的潜流' },
      { index:3, name:'Air', nameZh:'风', description:'Thought & communication — the clarity of your mind', descriptionZh:'思想与沟通——你的思维清晰度' },
      { index:4, name:'Earth', nameZh:'土', description:'Matter & reality — the tangible ground you stand on', descriptionZh:'物质与现实——你所立足的坚实大地' },
    ],
  },

  // ═══════════════════════════════════════════
  // 学业明灯 · Study (2 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'giza-pyramid', category: 'study',
    name: 'Giza Pyramid', nameZh: '基沙金字塔', icon: '▲', cardCount: 5,
    shortDesc: 'Ascend from knowledge to revelation', shortDescZh: '从知识登向启示',
    description: 'Five cards arranged as the Great Pyramid — ascending from the broad foundation of what you know toward the apex of revealed understanding. For students, scholars, and seekers of wisdom.',
    descriptionZh: '五张牌排列如大金字塔——从广阔的知识根基向上攀升至启示之巅。为学生、学者与真理探索者而设。',
    bestFor: 'Best for: exam preparation, learning strategy, building knowledge step by step', bestForZh: '适合：考试准备、学习策略、一步步构建知识体系',
    positions: [
      { index:1, name:'Foundation', nameZh:'基座', description:'What you already know — your existing knowledge base', descriptionZh:'你已知的——现有的知识基础' },
      { index:2, name:'Ascending', nameZh:'攀升', description:'What you are currently learning — the growing edge', descriptionZh:'你正在学习的事物——成长的边界' },
      { index:3, name:'Chamber', nameZh:'密室', description:'The hidden insight within the known material', descriptionZh:'已知材料中隐藏的洞见' },
      { index:4, name:'Gallery', nameZh:'长廊', description:'The path of integration — connecting ideas into understanding', descriptionZh:'整合之路——将概念连接为理解' },
      { index:5, name:'Apex', nameZh:'塔尖', description:'The revelation — the unified vision that crowns your study', descriptionZh:'启示——为你学业加冕的统一视野' },
    ],
  },
  {
    id: 'hexagram', category: 'study',
    name: 'Hexagram', nameZh: '六芒星', icon: '⬡', cardCount: 7,
    shortDesc: 'Seven dimensions of deep analysis', shortDescZh: '七个维度的深度分析',
    description: 'Seven cards in a hexagram star — past roots, present reality, future currents, and the inner and outer forces that shape your path of learning and growth.',
    descriptionZh: '七张牌排列成六芒星——过去的根源、当下的现实、未来的暗流，以及塑造你学习与成长道路的内外之力。',
    bestFor: 'Best for: intellectual crossroads, research direction, finding your scholarly path', bestForZh: '适合：学术十字路口、研究方向选择、找到你的治学之道',
    positions: [
      { index:1, name:'Past', nameZh:'过去', description:'The root of your current learning path', descriptionZh:'你当前学习道路的根源' },
      { index:2, name:'Present', nameZh:'现在', description:'Your current learning reality', descriptionZh:'你当前的学习现状' },
      { index:3, name:'Future', nameZh:'未来', description:'Where your studies naturally lead', descriptionZh:'你的学业自然走向何方' },
      { index:4, name:'Action', nameZh:'对策', description:'The best approach to learning now', descriptionZh:'当前最佳的学习方法' },
      { index:5, name:'Environment', nameZh:'环境', description:'External support and distractions', descriptionZh:'外部支持与干扰' },
      { index:6, name:'Inner Self', nameZh:'内心', description:'Your deeper motivation and hidden resistance', descriptionZh:'你深层的动机与隐藏的抗拒' },
      { index:7, name:'Outcome', nameZh:'结果', description:'The fruit of your learning journey', descriptionZh:'你学习旅程的果实' },
    ],
  },

  // ═══════════════════════════════════════════
  // 人际星河 · Relations (2 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'thothmosis', category: 'relations',
    name: 'Thoth\'s Mirror', nameZh: '图特摩斯之镜', icon: '☿', cardCount: 5,
    shortDesc: 'Read the social constellation around you', shortDescZh: '阅览你周围的社交星图',
    description: 'Named for Thoth, Egyptian god of writing and wisdom, five cards illuminate a social dynamic — friendship, community, or professional network.',
    descriptionZh: '以埃及书写与智慧之神图特命名，五张牌照亮一段社交动态——友谊、社群或职业网络。',
    bestFor: 'Best for: communication breakdowns, social dynamics, understanding others true intentions', bestForZh: '适合：沟通障碍、社交动态、理解他人的真实意图',
    positions: [
      { index:1, name:'You', nameZh:'你', description:'Your role and energy in this social constellation', descriptionZh:'你在这社交星图中的角色与能量' },
      { index:2, name:'The Other', nameZh:'对方', description:'The other person or group\'s energy', descriptionZh:'对方或团体的能量' },
      { index:3, name:'The Bridge', nameZh:'桥梁', description:'What connects you — shared ground and purpose', descriptionZh:'连接你们的——共同的立场与目标' },
      { index:4, name:'The Shadow', nameZh:'暗面', description:'Unspoken dynamics, jealousy, or hidden agendas', descriptionZh:'未曾言说的动态、嫉妒或隐藏的意图' },
      { index:5, name:'The Light', nameZh:'光明', description:'The highest potential of this connection', descriptionZh:'这段关系的最高潜能' },
    ],
  },
  {
    id: 'horseshoe', category: 'relations',
    name: 'Horseshoe', nameZh: '马蹄铁', icon: '∩', cardCount: 7,
    shortDesc: 'Classic English school — the arc of connection', shortDescZh: '经典英国学派——关系之弧',
    description: 'Seven cards in a horseshoe arc from past to future, external to internal — a time-tested spread for understanding any interpersonal dynamic.',
    descriptionZh: '七张牌呈马蹄形排列，从过去到未来、从外界影响到内心期待，循序渐进地理解任何人际动态。',
    bestFor: 'Best for: understanding how a relationship evolved and where it is heading', bestForZh: '适合：理解关系如何演变及未来走向',
    positions: [
      { index:1, name:'Past', nameZh:'过去', description:'Historical context of this relationship', descriptionZh:'这段关系的历史背景' },
      { index:2, name:'Present', nameZh:'现在', description:'The core dynamic now', descriptionZh:'当前核心动力' },
      { index:3, name:'Hidden', nameZh:'隐藏影响', description:'Unseen currents shaping this connection', descriptionZh:'塑造这段关系的未见暗流' },
      { index:4, name:'Obstacle', nameZh:'障碍', description:'What blocks harmony', descriptionZh:'阻碍和谐的事物' },
      { index:5, name:'External', nameZh:'外界态度', description:'How others perceive this relationship', descriptionZh:'他人如何看待这段关系' },
      { index:6, name:'Advice', nameZh:'建议', description:'The best course to strengthen this bond', descriptionZh:'加强这段纽带的最佳方式' },
      { index:7, name:'Outcome', nameZh:'最终结果', description:'The likely evolution of this connection', descriptionZh:'这段关系可能的演变' },
    ],
  },

  // ═══════════════════════════════════════════
  // 命运之轮 · Destiny (4 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'tree-of-life', category: 'destiny',
    name: 'Tree of Life', nameZh: '生命之树', icon: '𖧷', cardCount: 10,
    shortDesc: 'Kabbalistic spiritual spread — the full soul map', shortDescZh: '卡巴拉灵性牌阵——完整的灵魂地图',
    description: 'Based on the Kabbalistic Tree of Life, ten Sephiroth ascend from the material kingdom to the divine crown. The deepest map of spiritual journey available in tarot.',
    descriptionZh: '源自卡巴拉生命之树的灵性牌阵，十个原质从物质的王国层层上升到神圣的王冠。塔罗中最深刻的灵性旅程地图。',
    bestFor: 'Best for: spiritual life audit, major life transitions, finding your soul purpose', bestForZh: '适合：灵性生命审视、重大人生转折、寻找灵魂使命',
    positions: [
      { index:1, name:'Kingdom', nameZh:'王国', description:'Physical manifestation — your life on the ground', descriptionZh:'物质显化——你在地上的生活' },
      { index:2, name:'Foundation', nameZh:'基础', description:'The bedrock beneath your current situation', descriptionZh:'你当前处境下的基石' },
      { index:3, name:'Splendor', nameZh:'光辉', description:'Drive, passion, and the fire of action', descriptionZh:'驱动力、热情与行动之火' },
      { index:4, name:'Victory', nameZh:'胜利', description:'Emotion, connection, and the water of feeling', descriptionZh:'情感、连接与感受之水' },
      { index:5, name:'Beauty', nameZh:'美丽', description:'The balancing center — harmony and integration', descriptionZh:'平衡的中心——和谐与整合' },
      { index:6, name:'Severity', nameZh:'严厉', description:'Discipline, limits, and the refining fire', descriptionZh:'纪律、界限与炼净之火' },
      { index:7, name:'Mercy', nameZh:'慈悲', description:'Grace, expansion, and generous love', descriptionZh:'恩典、扩展与慷慨之爱' },
      { index:8, name:'Understanding', nameZh:'理解', description:'Intuitive wisdom and deep knowing', descriptionZh:'直觉智慧与深层知晓' },
      { index:9, name:'Wisdom', nameZh:'智慧', description:'Divine inspiration and creative vision', descriptionZh:'神圣灵感与创造性的远见' },
      { index:10, name:'Crown', nameZh:'王冠', description:'Ultimate unity — the highest truth available', descriptionZh:'终极合一——你所能企及的最高真理' },
    ],
  },
  {
    id: 'zodiac', category: 'destiny',
    name: 'Zodiac Wheel', nameZh: '黄道十二宫', icon: '◎', cardCount: 12,
    shortDesc: 'A full life panorama — every house illuminated', shortDescZh: '全方位人生星图——十二宫尽览',
    description: 'Twelve cards mapped to the zodiac houses, covering every domain of life from identity to the unconscious. For annual readings and complete life assessment.',
    descriptionZh: '以黄道十二宫为框架，从十二个人生领域进行全面解读。适合年度大占卜和完整人生评估。',
    bestFor: 'Best for: annual forecast, complete life overview across all 12 domains', bestForZh: '适合：年度预测、十二人生领域的全面总览',
    positions: [
      { index:1, name:'Self', nameZh:'自我', description:'Identity, appearance, and life direction', descriptionZh:'身份、形象与人生方向' },
      { index:2, name:'Wealth', nameZh:'财富', description:'Values, resources, and material security', descriptionZh:'价值观、资源与物质安全感' },
      { index:3, name:'Communication', nameZh:'沟通', description:'Learning, expression, and siblings', descriptionZh:'学习、表达与兄弟姐妹' },
      { index:4, name:'Home', nameZh:'家庭', description:'Roots, sanctuary, and ancestral patterns', descriptionZh:'根源、庇护所与祖先模式' },
      { index:5, name:'Love', nameZh:'爱情', description:'Creativity, romance, and joy', descriptionZh:'创造力、浪漫与喜悦' },
      { index:6, name:'Work', nameZh:'工作', description:'Daily life, health, and service', descriptionZh:'日常生活、健康与服务' },
      { index:7, name:'Partnership', nameZh:'关系', description:'Union, balance, and committed bonds', descriptionZh:'结合、平衡与承诺的纽带' },
      { index:8, name:'Transformation', nameZh:'深层', description:'Depth psychology, shared resources, rebirth', descriptionZh:'深层心理、共享资源与重生' },
      { index:9, name:'Belief', nameZh:'信念', description:'Philosophy, travel, and higher learning', descriptionZh:'哲学、旅行与高等学问' },
      { index:10, name:'Career', nameZh:'事业', description:'Vocation, legacy, and public standing', descriptionZh:'天职、遗产与公众地位' },
      { index:11, name:'Community', nameZh:'社交', description:'Friends, groups, and shared ideals', descriptionZh:'朋友、群体与共同理想' },
      { index:12, name:'Unconscious', nameZh:'潜意识', description:'Hidden truths, karma, and spiritual completion', descriptionZh:'隐藏的真相、业力与灵性圆满' },
    ],
  },
  {
    id: 'faith', category: 'destiny',
    name: 'Faith Weaver', nameZh: '信念之织', icon: '✧', cardCount: 5,
    shortDesc: 'Weave belief into destiny', shortDescZh: '以信念织就命运',
    description: 'Five cards exploring the architecture of belief that shapes your destiny — what to release, what to embrace, the hidden lesson, the unexpected gift, and the path forward.',
    descriptionZh: '五张牌探索塑造你命运的信念架构——释放什么、拥抱什么、隐藏的课题、意外之礼与前行之路。',
    bestFor: 'Best for: crisis of belief, rebuilding trust in life, finding inner anchor', bestForZh: '适合：信念危机、重建对生活的信任、找到内心锚点',
    positions: [
      { index:1, name:'Release', nameZh:'放下', description:'The belief or attachment that no longer serves', descriptionZh:'不再服务于你的信念或执着' },
      { index:2, name:'Embrace', nameZh:'拥抱', description:'The quality or truth you are called to embody', descriptionZh:'你被召唤去体现的品质或真理' },
      { index:3, name:'The Lesson', nameZh:'课题', description:'The core teaching woven through your current chapter', descriptionZh:'编织在你当前篇章中的核心教诲' },
      { index:4, name:'The Gift', nameZh:'礼物', description:'The unexpected blessing hidden in your challenge', descriptionZh:'隐藏在你挑战中的意外祝福' },
      { index:5, name:'The Weaver\'s Path', nameZh:'织者之路', description:'The thread to follow — your next step into destiny', descriptionZh:'追随的线索——你迈入命运的下一步' },
    ],
  },
  {
    id: 'three-card', category: 'destiny',
    name: 'Three Threads', nameZh: '三缕丝线', icon: '◇', cardCount: 3,
    shortDesc: 'Past · Present · Future — the weave of time', shortDescZh: '过去 · 现在 · 未来——时间之织',
    description: 'Three cards laid in a timeline reveal the flow of past influence, present state, and future direction. Simple, elegant, and surprisingly deep.',
    descriptionZh: '三张牌按时间线解读过去的影响、现在的状态和未来的走向。简洁、优雅而深邃。适合日常占卜。',
    bestFor: 'Best for: quick clarity on any situation — past influences, present state, future direction', bestForZh: '适合：任何局面的快速澄清——过去影响、现状、未来方向',
    positions: [
      { index:1, name:'Past', nameZh:'过去', description:'What shaped this moment', descriptionZh:'塑造此刻的过往' },
      { index:2, name:'Present', nameZh:'现在', description:'The current state', descriptionZh:'当前状态' },
      { index:3, name:'Future', nameZh:'未来', description:'What unfolds ahead', descriptionZh:'未来展开的图景' },
    ],
  },

  // ═══════════════════════════════════════════
  // 抉择时刻 · Decision (3 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'choice', category: 'decision',
    name: 'Crossroads', nameZh: '二选一', icon: '↔', cardCount: 5,
    shortDesc: 'A light at the fork in the road', shortDescZh: '两难抉择的明灯',
    description: 'When you face two paths, five cards illuminate each one — where you stand, where each path leads, and what awaits at the end of each road.',
    descriptionZh: '面临两个选择的十字路口时，五张牌照亮每条路——你站在何处、每条路通往何方、以及每条路尽头等待着什么。',
    bestFor: 'Best for: binary decisions, crossroads moments, comparing two clear paths', bestForZh: '适合：二选一决定、十字路口时刻、比较两条清晰路径',
    positions: [
      { index:1, name:'Crossroads', nameZh:'当前状况', description:'Where you stand now — the heart of the choice', descriptionZh:'你站立之处——选择的核心' },
      { index:2, name:'Path A', nameZh:'选择A的走向', description:'Where the first path leads — its trajectory', descriptionZh:'第一条路的走向' },
      { index:3, name:'Path B', nameZh:'选择B的走向', description:'Where the second path leads — its trajectory', descriptionZh:'第二条路的走向' },
      { index:4, name:'Outcome A', nameZh:'选择A的结果', description:'The fruit of the first path — where it ultimately arrives', descriptionZh:'第一条路的果实——最终抵达之处' },
      { index:5, name:'Outcome B', nameZh:'选择B的结果', description:'The fruit of the second path — where it ultimately arrives', descriptionZh:'第二条路的果实——最终抵达之处' },
    ],
  },
  {
    id: 'reinforcement', category: 'decision',
    name: 'Reinforcement', nameZh: '加强牌阵', icon: '⛊', cardCount: 4,
    shortDesc: 'Clarify and strengthen your decision', shortDescZh: '明晰并加强你的决定',
    description: 'When you have already chosen a direction but seek confirmation and wisdom. Four cards reinforce your decision or reveal the adjustments needed.',
    descriptionZh: '当你已选择方向但需要确认和智慧时。四张牌加强你的决定，或揭示需要调整之处。',
    bestFor: 'Best for: seeking confirmation after a decision, strengthening resolve', bestForZh: '适合：决定后寻求确认、坚定决心和信心',
    positions: [
      { index:1, name:'Your Choice', nameZh:'你的选择', description:'The decision as you currently see it', descriptionZh:'你当前所见的决定' },
      { index:2, name:'What Strengthens', nameZh:'加强之力', description:'The energy that supports and validates your choice', descriptionZh:'支持并验证你选择的能量' },
      { index:3, name:'What Challenges', nameZh:'挑战之点', description:'The aspect of your choice that needs refinement', descriptionZh:'你选择中需要调整的方面' },
      { index:4, name:'The Adjusted Path', nameZh:'调整之途', description:'Your choice, refined — the optimal way forward', descriptionZh:'你选择的最优前行之路' },
    ],
  },
  {
    id: 'action-result', category: 'decision',
    name: 'Action & Consequence', nameZh: '行为与结果', icon: '⇌', cardCount: 4,
    shortDesc: 'See the hidden cost and benefit of each path', shortDescZh: '看清每条路的隐藏代价与收获',
    description: 'Four cards weighing what happens if you act versus if you don\'t — plus the hidden factor each path conceals.',
    descriptionZh: '四张牌权衡行动与不行动各自的结果——以及每条路径隐藏的因素。',
    bestFor: 'Best for: weighing action vs. inaction, understanding consequences before moving', bestForZh: '适合：权衡行动与不行动的后果、行动前三思',
    positions: [
      { index:1, name:'If You Act', nameZh:'若你行动', description:'The likely outcome if you take this step', descriptionZh:'若你迈出这一步的可能结果' },
      { index:2, name:'If You Wait', nameZh:'若你等待', description:'The likely outcome if you hold back', descriptionZh:'若你按兵不动的可能结果' },
      { index:3, name:'Hidden Cost', nameZh:'隐藏代价', description:'What neither path shows — the unspoken price', descriptionZh:'两条路都未显示的——未曾言说的代价' },
      { index:4, name:'Hidden Gift', nameZh:'隐藏礼物', description:'The unexpected blessing either path could bring', descriptionZh:'任何一条路都可能带来的意外祝福' },
    ],
  },

  // ═══════════════════════════════════════════
  // 家庭港湾 · Family (2 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'shaka-wo', category: 'family',
    name: 'Shaka\'s Hearth', nameZh: '沙卡乌炉火', icon: '⌂', cardCount: 7,
    shortDesc: 'Ancient family oracle — read the household soul', shortDescZh: '古老的家宅神谕——读取家族之魂',
    description: 'Named for the West African wisdom tradition of home and lineage. Seven cards illuminate the deep currents of family — roots, dynamics, unspoken bonds, and the fire that warms the hearth.',
    descriptionZh: '以西非家园与世系的智慧传统命名。七张牌照亮家庭的深层暗流——根源、动态、无声的纽带，以及温暖炉灶的火焰。',
    bestFor: 'Best for: family harmony, home dynamics, understanding ancestral patterns', bestForZh: '适合：家庭和睦、家庭动态、理解祖辈传承模式',
    positions: [
      { index:1, name:'The Hearth', nameZh:'炉火', description:'The central fire of your home — what keeps it warm', descriptionZh:'你家的中心之火——什么使它温暖' },
      { index:2, name:'Ancestral Thread', nameZh:'祖辈之线', description:'The inherited pattern — gift or burden from those before', descriptionZh:'继承的模式——前人的礼物或负担' },
      { index:3, name:'Current Dynamic', nameZh:'当前动力', description:'The living energy flowing through your household now', descriptionZh:'此刻流经你家的鲜活能量' },
      { index:4, name:'The Unspoken', nameZh:'无声之言', description:'What everyone feels but no one says', descriptionZh:'每个人都感受到却无人说出口的事' },
      { index:5, name:'Each Soul', nameZh:'家中诸魂', description:'The individual journeys within the shared space', descriptionZh:'共享空间内的个体旅程' },
      { index:6, name:'What Heals', nameZh:'疗愈之方', description:'The balm for old wounds — how to restore harmony', descriptionZh:'旧伤的膏药——如何恢复和谐' },
      { index:7, name:'The Hearth Tomorrow', nameZh:'明日炉火', description:'The future warmth of your home — what you are building', descriptionZh:'你家的未来温暖——你正在建造什么' },
    ],
  },
  {
    id: 'ancestral-tree', category: 'family',
    name: 'Ancestral Tree', nameZh: '祖荫之树', icon: '⬥', cardCount: 6,
    shortDesc: 'Trace the roots and branches of your lineage', shortDescZh: '追溯家族根脉与枝桠',
    description: 'Six cards mapping the living tree of your family — deep roots, rising sap, branching choices, and the fruit your lineage bears through you.',
    descriptionZh: '六张牌描绘你家族的活树——深根、升液、分枝的选择，以及你的血脉通过你结出的果实。',
    bestFor: 'Best for: healing family wounds, understanding your place in lineage, generational patterns', bestForZh: '适合：疗愈家族创伤、理解你在家族中的位置、代际模式',
    positions: [
      { index:1, name:'Deep Root', nameZh:'深根', description:'The ancestral gift passed down through generations', descriptionZh:'代代相传的祖先恩赐' },
      { index:2, name:'Rising Sap', nameZh:'上升之液', description:'The living energy flowing from past into present', descriptionZh:'从过去流入现在的鲜活能量' },
      { index:3, name:'Your Branch', nameZh:'你的枝桠', description:'Your unique place in the family tree', descriptionZh:'你在家族树中独一无二的位置' },
      { index:4, name:'Crossed Branches', nameZh:'交错之枝', description:'Family dynamics — where branches support or compete', descriptionZh:'家庭动态——枝条在哪里相互支撑或竞争' },
      { index:5, name:'Pruning', nameZh:'修剪', description:'What pattern or story needs to be released', descriptionZh:'需要释放的模式或故事' },
      { index:6, name:'The Fruit', nameZh:'果实', description:'The gift your lineage offers the future through you', descriptionZh:'你的血脉通过你献给未来的礼物' },
    ],
  },

  // ═══════════════════════════════════════════
  // 快速启迪 · Quick (3 spreads)
  // ═══════════════════════════════════════════
  {
    id: 'single', category: 'quick',
    name: 'Single Card', nameZh: '单张牌', icon: '◈', cardCount: 1,
    shortDesc: 'One card, one truth — pure and direct', shortDescZh: '每日一牌，简洁明心',
    description: 'The simplest form of divination. One card for daily guidance, meditation focus, or a direct answer to a clear question.',
    descriptionZh: '只抽一张牌，最简单直接的占卜方式。适合每日运势指引、冥想焦点或对清晰问题的直接回答。',
    bestFor: 'Best for: daily guidance, quick answers, a moment of reflection', bestForZh: '适合：每日指引、快速解答、片刻静思',
    positions: [
      { index:1, name:'Message', nameZh:'启示', description:'The most important message for you now', descriptionZh:'此刻对你最重要的讯息' },
    ],
  },
  {
    id: 'essence', category: 'quick',
    name: 'Three Essences', nameZh: '三元含意', icon: '∴', cardCount: 3,
    shortDesc: 'Body · Mind · Spirit — your whole self', shortDescZh: '身 · 心 · 灵——你的全我',
    description: 'Three cards for the three centers of being: the body\'s wisdom, the mind\'s clarity, and the spirit\'s calling. A quick but holistic reading.',
    descriptionZh: '三张牌对应存在的三个中心：身体的智慧、心智的清明与灵性的召唤。快速而整体的解读。',
    bestFor: 'Best for: mind-body-spirit alignment check, holistic self-reflection', bestForZh: '适合：身心灵对齐检查、全人自我反思',
    positions: [
      { index:1, name:'Body', nameZh:'身', description:'Physical state, health, material needs, grounded action', descriptionZh:'身体状态、健康、物质需求与踏实的行动' },
      { index:2, name:'Mind', nameZh:'心', description:'Mental state, thoughts, communication, clarity sought', descriptionZh:'心理状态、思想、沟通与寻求的清明' },
      { index:3, name:'Spirit', nameZh:'灵', description:'Spiritual state, higher calling, soul-level guidance', descriptionZh:'灵性状态、更高召唤与灵魂层面的指引' },
    ],
  },
  {
    id: 'daily-triangle', category: 'quick',
    name: 'Morning Star', nameZh: '晨星', icon: '⛧', cardCount: 3,
    shortDesc: 'Today\'s energy · Challenge · Gift', shortDescZh: '今日能量 · 挑战 · 礼物',
    description: 'A quick morning spread for daily navigation. Three cards: the prevailing energy of the day, the challenge to meet with grace, and the gift hidden in the ordinary.',
    descriptionZh: '每日导航的晨间速占。三张牌：今日主导能量、需以优雅面对的挑战、以及藏于平凡中的礼物。',
    bestFor: 'Best for: morning intention-setting, navigating the day ahead', bestForZh: '适合：晨间设定意图、指引一天的航向',
    positions: [
      { index:1, name:'Today\'s Energy', nameZh:'今日能量', description:'The prevailing force shaping your day', descriptionZh:'塑造你今日的主导力量' },
      { index:2, name:'Today\'s Challenge', nameZh:'今日挑战', description:'The growth edge you will meet today', descriptionZh:'你今天将遇到的成长边缘' },
      { index:3, name:'Today\'s Gift', nameZh:'今日礼物', description:'The blessing waiting in the ordinary moments', descriptionZh:'藏于平凡时刻中的祝福' },
    ],
  },
];

// --- Category metadata for flip-book navigation ---
const SPREAD_CATEGORIES = [
  { id: 'love', name: '恋爱心语', nameEn: 'Matters of the Heart', icon: '♥', desc: 'Love, romance, and the heart\'s deep questions', descZh: '爱情、浪漫与心灵深处的叩问' },
  { id: 'career', name: '事业征途', nameEn: 'Career & Purpose', icon: '◆', desc: 'Work, vocation, and the path of purpose', descZh: '事业、使命与天职之路' },
  { id: 'wealth', name: '财富之匙', nameEn: 'Keys to Abundance', icon: '●', desc: 'Money, resources, and the flow of prosperity', descZh: '金钱、资源与富足之流' },
  { id: 'study', name: '学业明灯', nameEn: 'Lamp of Learning', icon: '◇', desc: 'Study, knowledge, and the scholar\'s journey', descZh: '学业、求知与学者的旅途' },
  { id: 'relations', name: '人际星河', nameEn: 'Constellation of Relations', icon: '○', desc: 'Friendship, community, and social bonds', descZh: '友谊、社群与社交纽带' },
  { id: 'destiny', name: '命运之轮', nameEn: 'Wheel of Destiny', icon: '✧', desc: 'Life purpose, spiritual path, and the grand pattern', descZh: '人生使命、灵性道途与宏大图景' },
  { id: 'decision', name: '抉择时刻', nameEn: 'Hour of Decision', icon: '↔', desc: 'Choices, crossroads, and the weight of consequence', descZh: '选择、十字路口与抉择之重' },
  { id: 'family', name: '家庭港湾', nameEn: 'Hearth & Haven', icon: '⌂', desc: 'Home, family, roots, and belonging', descZh: '家庭、根源与归属' },
  { id: 'quick', name: '快速启迪', nameEn: 'Quick Oracle', icon: '◈', desc: 'Fast readings for daily guidance and clarity', descZh: '快速占卜，每日指引与清明' },
];

function getSpreadsByCategory(catId) {
  return TAROT_SPREADS.filter(s => s.category === catId);
}

function getCategoryById(catId) {
  return SPREAD_CATEGORIES.find(c => c.id === catId);
}
