/* ========================================
   tarot-knowledge.js — Complete Knowledge Base
   5 classic texts synthesized into a rule engine:
   葵花宝典 · 其实你已经很塔罗了 · 塔罗全书
   你可以再塔罗一点 · 78度的智慧 (Rachel Pollack)
   ======================================== */

const TarotKnowledge = (() => {
  // ═══════════════════════════════════════════
  // 1. COMPLETE REVERSAL BACKTRACKING CHAINS
  // Source: 你可以再塔罗一点 — when reversed, return to
  // the previous card's lesson in the same suit
  // ═══════════════════════════════════════════
  const REVERSAL_CHAINS = (() => {
    const buildMinorChain = () => {
      const suits = ['wands','cups','swords','pentacles'];
      const chain = {};
      // Ace(1) reversed → return to 10; 2 reversed → return to Ace; etc.
      for (const suit of suits) {
        chain[suit] = {};
        for (let n = 2; n <= 10; n++) chain[suit][n] = n - 1;
        chain[suit][1] = 10; // Ace → 10
      }
      return chain;
    };
    const MAJOR_SEQUENCE = {
      0:'world', 1:'fool', 2:'magician', 3:'high-priestess', 4:'empress',
      5:'emperor', 6:'hierophant', 7:'lovers', 8:'chariot',
      9:'strength', 10:'hermit', 11:'wheel-of-fortune', 12:'justice',
      13:'hanged-man', 14:'death', 15:'temperance', 16:'devil',
      17:'tower', 18:'star', 19:'moon', 20:'sun', 21:'judgment',
    };
    const MAJOR_LESSONS = {
      fool: { en: 'the courage to leap without knowing', zh: '无知无畏的勇气' },
      magician: { en: 'mastery of your tools and will', zh: '对工具与意志的掌控' },
      'high-priestess': { en: 'trusting inner wisdom over outer authority', zh: '信任内在智慧胜过外在权威' },
      empress: { en: 'nurturing creativity and abundance', zh: '孕育创造与丰盛' },
      emperor: { en: 'establishing order and boundaries', zh: '建立秩序与边界' },
      hierophant: { en: 'honoring tradition while seeking your own truth', zh: '尊重传统同时寻求自己的真理' },
      lovers: { en: 'making conscious choices from the heart', zh: '从心做出有意识的选择' },
      chariot: { en: 'harmonizing opposing forces through will', zh: '以意志调和相反的力量' },
      strength: { en: 'gentle power over brute force', zh: '以柔克刚的力量' },
      hermit: { en: 'finding wisdom in solitude', zh: '在独处中找到智慧' },
      'wheel-of-fortune': { en: 'accepting the cycles beyond your control', zh: '接纳你无法控制的循环' },
      justice: { en: 'taking responsibility for cause and effect', zh: '为因果承担责任的勇气' },
      'hanged-man': { en: 'voluntary surrender and seeing from a new angle', zh: '自愿的臣服与全新视角' },
      death: { en: 'releasing what must end so new life can begin', zh: '放下必须结束的，让新生命开始' },
      temperance: { en: 'the alchemy of blending opposites into wholeness', zh: '将对立融合为完整的炼金术' },
      devil: { en: 'recognizing and breaking free from self-imposed chains', zh: '认清并挣脱自我施加的枷锁' },
      tower: { en: 'allowing false structures to crumble for authentic rebuilding', zh: '让虚假的结构崩塌以便真实地重建' },
      star: { en: 'opening to hope and inspiration after crisis', zh: '在危机后向希望与灵感敞开' },
      moon: { en: 'navigating the shadow without losing your way', zh: '穿越阴影而不迷失方向' },
      sun: { en: 'full expression of your authentic, joyful self', zh: '全然表达真实喜乐的自己' },
      judgment: { en: 'answering the call to your highest purpose', zh: '回应最高使命的召唤' },
      world: { en: 'integration of all lessons into wholeness', zh: '将所有课程整合为完整' },
    };
    return { minor: buildMinorChain(), MAJOR_SEQUENCE, MAJOR_LESSONS };
  })();

  // ═══════════════════════════════════════════
  // 2. CARD POSITION SYSTEM
  // The SAME card means different things in different spread positions
  // Source: All 5 texts synthesized
  // ═══════════════════════════════════════════
  const POSITION_MODIFIERS = {
    past: {
      role: 'past', en: 'The Root · 过往之根',
      frame: { en: 'This energy has already flowed through your life. Its seeds were planted — what grew from them stands before you now.', zh: '此能量已流过你的生命。种子已然播下——由此生长之物此刻立于你面前。' },
      majorShift: { en: 'A great force shaped your past — its lesson may still echo in your present choices.', zh: '一股伟大的力量塑造了你的过去——其课题至今仍在你当下的选择中回响。' },
      minorShift: { en: 'The everyday patterns of before have crystallized into now. Look back with compassion, not regret.', zh: '曾经的日常模式已凝结为此刻。用慈悲而非悔恨回望。' },
      reversedShift: { en: 'Something in your past remains unresolved — a lesson half-learned, a wound half-healed.', zh: '你过去的某件事仍未解决——学到一半的功课，愈合一半的伤口。' },
    },
    present: {
      role: 'present', en: 'The Crossroads · 当下之 crossroads',
      frame: { en: 'This force stands at the center of your now — the still point where past pivots into future. The choice before you is alive.', zh: '这股力量正立于你此刻的中心——过去转向未来的静点。你面前的选择是活的。' },
      majorShift: { en: 'A Major Arcana in your present signals a soul-level turning point. This is not ordinary time.', zh: '大阿尔卡纳立于当下，昭示灵魂层面的转折。此刻并非平凡之时。' },
    },
    future: {
      role: 'future', en: 'The Horizon · 未来之 horizon',
      frame: { en: 'A shape gathers on the skyline — not fixed fate, but a probable destination born of present momentum. Your choices now will meet you there.', zh: '一个轮廓在天际聚集——不是注定的命运，而是当前动量孕育的可能终点。你此刻的选择将在那里与你会合。' },
    },
    obstacle: {
      role: 'obstacle', en: 'The Shadow · 暗影',
      frame: { en: 'This card crosses you — not to defeat you, but to reveal where your power is being called to grow. The obstacle IS the way.', zh: '这张牌横亘于前——不是为了打败你，而是揭示你的力量在何处被召唤生长。阻碍即是道路。' },
    },
    advice: {
      role: 'advice', en: 'The Whisper · 低语',
      frame: { en: 'The stars offer a suggestion. This energy is not what will happen — it is what you are invited to embody. Wear it like a cloak, and see how the world responds.', zh: '星辰献上一则建议。这股能量不是将要发生之事——而是你被邀请去成为的样子。披上它如同一件斗篷，看世界如何回应。' },
    },
    environment: {
      role: 'environment', en: 'The Surround · 周遭',
      frame: { en: 'This card describes the air you breathe — the people, circumstances, and invisible currents of your world. It is not you, but it touches you.', zh: '这张牌描绘你所呼吸的空气——你世界中的人、环境与无形之流。它不是你，但它触碰着你。' },
    },
    outcome: {
      role: 'outcome', en: 'The Destination · 终点',
      frame: { en: 'All currents converge here. This is not a sentence but a signpost — the likely destination of your present course, should nothing shift.', zh: '万流于此汇聚。这不是判决而是路标——你若不变，此乃当前航向的可能终点。' },
    },
    self: {
      role: 'self', en: 'The Mirror · 镜中',
      frame: { en: 'How you see yourself — or how the world sees you. This card is the face you wear, knowingly or not.', zh: '你如何看待自己——或世界如何看待你。这张牌是你所戴的面孔，无论你是否知晓。' },
    },
    foundation: {
      role: 'foundation', en: 'The Bedrock · 基石',
      frame: { en: 'Beneath all that is visible, this root holds. It may be unseen, but everything stands upon it.', zh: '在一切可见之下，这根脉在支撑。它或许不被看见，但万物立于其上。' },
    },
    hope_fear: {
      role: 'hope_fear', en: 'The Double Face · 双面',
      frame: { en: 'What you most long for and what you most dread often wear the same mask. This card mirrors both.', zh: '你最渴望的与最恐惧的，常常戴着同一张面具。这张牌映照两者。' },
    },
  };

  // ═══════════════════════════════════════════
  // 3. SUIT NARRATIVE ARCS
  // Source: 其实你已经很塔罗了 — each suit is a character's life story
  // ═══════════════════════════════════════════
  const SUIT_STORIES = {
    wands: {
      name: 'Wands · 权杖', element: 'fire',
      character: { en: 'The Adventurer', zh: '冒险者' },
      arc: {
        1: { en: 'A spark ignites — the adventurer feels the first stirring of a great journey. Pure potential, undirected fire.', zh: '火花点燃——冒险者感受到伟大旅程的第一次涌动。纯粹的可能，未定向的火焰。' },
        2: { en: 'The world spreads before them. They hold the globe, weighing which direction calls most strongly. A decision brews.', zh: '世界在眼前展开。手握地球，掂量哪个方向呼唤最强烈。一个决定在酝酿。' },
        3: { en: 'Ships sail toward the horizon — plans become action. The adventurer steps onto the shore of a new land.', zh: '船驶向地平线——计划化为行动。冒险者踏上新的土地。' },
        4: { en: 'A home is built in foreign soil. Celebration, stability, the first fruits of the journey. But rest is temporary.', zh: '在异乡建起家园。庆祝、稳定、旅程的初果。但休息是暂时的。' },
        5: { en: 'Conflict erupts — five voices, five directions. The adventurer learns that chaos is not the enemy; it is the forge.', zh: '冲突爆发——五种声音、五个方向。冒险者学到，混乱不是敌人；它是锻炉。' },
        6: { en: 'Victory. Recognition. The laurel crown. But the adventurer knows: this triumph is a milestone, not the destination.', zh: '胜利。认可。桂冠加身。但冒险者知道：这胜利是里程碑，不是终点。' },
        7: { en: 'They stand alone on the hill, defending what they have built. The challenge comes from below — doubt, opposition, fatigue. They hold.', zh: '独自立于山丘，捍卫所建。挑战来自下方——怀疑、反对、疲惫。他们坚守。' },
        8: { en: 'Wands fly — the adventurer releases all plans into motion. Speed, freedom, the wind at their back. Everything accelerates.', zh: '权杖飞翔——冒险者将一切计划释放入运动。速度、自由、风在背后。一切加速。' },
        9: { en: 'Wounded but standing. They lean on the staff of experience, surveying the battleground of the past. Every scar is a teacher.', zh: '受伤但站立。倚靠经验之杖，审视过往的战场。每一道伤疤都是老师。' },
        10: { en: 'Burdened by all they have taken on. The weight of responsibility bends the back. The lesson: not everything must be carried alone.', zh: '肩负所有。责任的重量压弯了脊梁。课题：并非一切都需独自承担。' },
      },
    },
    cups: {
      name: 'Cups · 圣杯', element: 'water',
      character: { en: 'The Lover', zh: '爱者' },
      arc: {
        1: { en: 'The heart overflows. A new feeling, a new connection — love in its purest, most undirected form, like a spring breaking through stone.', zh: '心满溢。新的感觉、新的连接——爱在其最纯净、最未定向的形态，如泉水破石而出。' },
        2: { en: 'Two souls meet as equals. The Caduceus above them: healing through connection. A promise is exchanged without words.', zh: '两个灵魂对等相遇。赫尔墨斯之杖在上：通过连结而疗愈。一个无需言语的承诺被交换。' },
        3: { en: 'Joy multiplies. The circle widens — friendship, celebration, community. But abundance can become excess if not grounded.', zh: '喜悦倍增。圈子扩大——友谊、庆祝、社群。但丰盛若无根基亦可变为放纵。' },
        4: { en: 'The cup offered by the divine hand goes unnoticed. The Lover sits beneath the tree, staring at three cups on the ground — what is missing feels larger than what is present.', zh: '神圣之手递来的杯被忽略了。爱者坐在树下，盯着地上的三只杯——缺失之物比存在之物感觉更大。' },
        5: { en: 'Three cups have spilled. Two remain standing behind. The Lover grieves what was lost — but the standing cups hold the seed of tomorrow.', zh: '三只杯倾覆。两只仍立于身后。爱者为所失而哀悼——但立着的杯中握着明日的种子。' },
        6: { en: 'A child offers flowers in a cup. Nostalgia, innocence, the sweetness of what was. The Lover revisits the garden of memory — but must not build a home there.', zh: '一个孩子用杯子献上花朵。怀旧、天真、曾经的甜美。爱者重访记忆的花园——但不能在那里建家。' },
        7: { en: 'Seven cups float, each a different world. The Lover stands paralyzed by possibility. Which vision is real? Which is mirage? The test of discernment.', zh: '七只杯漂浮，每一只一个不同的世界。爱者被可能性麻痹。哪个幻象是真？哪个是蜃楼？辨别力的考验。' },
        8: { en: 'The Lover walks away from stacked cups toward bare mountains. The familiar no longer nourishes. A deeper thirst drives them into the unknown.', zh: '爱者离开叠起的杯子走向荒山。熟悉的不再滋养。更深的渴望驱使他们进入未知。' },
        9: { en: 'Contentment. The wish fulfilled. The Lover sits before nine cups, arms crossed in satisfaction — but is this the end of longing, or merely a rest stop?', zh: '满足。愿望实现。爱者坐于九杯之前，双臂交叠于满足之中——但这是渴望的终点，还只是一个歇脚处？' },
        10: { en: 'The rainbow arcs over a family, a home, a garden. Emotional fulfillment, not as a destination but as a living ecosystem. Love has become a place to dwell.', zh: '彩虹跨越家庭、家园、花园。情感的圆满，不是终点而是一个活着的生态系统。爱已成为一个可以栖居的地方。' },
      },
    },
    swords: {
      name: 'Swords · 宝剑', element: 'air',
      character: { en: 'The Thinker', zh: '思者' },
      arc: {
        1: { en: 'A blade crowned with victory and olive branch. The mind awakens — clarity, truth, the first cut through confusion. But a sword is double-edged; every insight wounds an old belief.', zh: '冠以胜利与橄榄枝的剑刃。心智觉醒——清明、真相、斩破困惑的第一刀。但剑是双刃的；每一个洞察都伤及一个旧信念。' },
        2: { en: 'Blindfolded, the Thinker holds crossed swords before the chest. A choice must be made, but the eyes are closed. The intellect has reached its limit — only intuition can break the stalemate.', zh: '蒙着眼，思者胸前交叉双剑。必须做出选择，但眼已闭上。理智已达极限——只有直觉能打破僵局。' },
        3: { en: 'Three swords pierce a heart. Pain, grief, the wound of truth. The Thinker learns: some knowledge comes at a cost. The heart that breaks open can hold more than the heart that stays sealed.', zh: '三把剑穿透一颗心。痛、悲伤、真相之伤。思者学到：有些知识是有代价的。破开的心能容纳比密封的心更多的东西。' },
        4: { en: 'Rest. The Thinker lies still in a sanctuary. The mind must sleep to integrate what it has learned. This is not escape — it is the necessary silence before the next thought.', zh: '安息。思者静卧于圣所。心智必须沉睡以整合所学。这不是逃避——是下一个念头前的必要静默。' },
        5: { en: 'A victor smirks while losers retreat. The Thinker has won — but at what cost? The empty victory, the hollow argument. Winning can be the greatest loss if connection is the price.', zh: '胜利者冷笑而败者离去。思者赢了——但代价是什么？空洞的胜利、虚无的争论。如果代价是连接，赢可以是最大的输。' },
        6: { en: 'A ferry carries figures across water. The Thinker journeys from turbulence toward calm — but the six swords are still in the boat. The mind carries its weapons even into healing.', zh: '渡船载人穿越水面。思者从动荡驶向平静——但六把剑仍在船上。心智即便在疗愈中也携带武器。' },
        7: { en: 'A figure sneaks away with five swords, leaving two behind. Strategy, cunning, the art of working around obstacles. The Thinker learns that not every battle must be fought head-on.', zh: '一人携五剑潜逃，留下两把。策略、机巧、绕行障碍的艺术。思者学到：并非每场战斗都必须正面交锋。' },
        8: { en: 'A bound and blindfolded figure surrounded by eight swords — but the ground is not fully enclosed. The prison is partly real, partly imagined. The Thinker\'s task: distinguish which is which.', zh: '被绑缚蒙眼的人被八把剑包围——但地面并未完全封锁。监狱一半是真实的，一半是想象的。思者的任务：分辨何者为真何者为幻。' },
        9: { en: 'Sleepless in the dark, nine swords on the wall. The Thinker wrestles with demons of the mind — anxiety, guilt, the stories we tell ourselves at 3 AM. Dawn will reveal that most were shadows.', zh: '黑暗中无眠，墙上九把剑。思者与心魔搏斗——焦虑、愧疚、凌晨三点对自己讲的故事。黎明将揭示其中大多数只是影子。' },
        10: { en: 'A figure face-down, ten swords in the back. The ultimate defeat of the intellect — the moment when thinking cannot save you. But look: dawn breaks on the horizon. Rock bottom is also solid ground.', zh: '一人俯卧，十剑穿背。理智的终极失败——思考无法拯救你的那一刻。但看：天边曙光初现。谷底也是坚实的地面。' },
      },
    },
    pentacles: {
      name: 'Pentacles · 星币', element: 'earth',
      character: { en: 'The Builder', zh: '建造者' },
      arc: {
        1: { en: 'A hand extends a golden coin from a cloud, hovering above a garden of lilies. The Builder receives the first seed of prosperity — pure potential, unearned, a gift from the invisible.', zh: '一只手从云中伸出金色钱币，悬于百合花园之上。建造者收到繁荣的第一粒种子——纯粹的可能，非劳所得，来自无形之中的礼物。' },
        2: { en: 'The Builder juggles two coins, ships riding waves behind. Balance is not stillness — it is constant micro-adjustment. The dance of managing resources, time, and energy begins.', zh: '建造者抛接两枚钱币，身后船行波浪。平衡不是静止——是持续的微调。管理资源、时间与精力的舞蹈开始了。' },
        3: { en: 'Three figures collaborate on a cathedral — craftsman, patron, and architect. The Builder learns: great things are not built alone. Skill meets vision meets resource.', zh: '三人协作建大教堂——匠人、资助者与建筑师。建造者学到：伟大之物非一人可建。技艺遇见愿景遇见资源。' },
        4: { en: 'A figure clutches four coins — crown, feet, arms wrapped around them. The Builder has accumulated, but fear of loss has become a cage. Security can become a prison if held too tightly.', zh: '一人紧抓四枚钱币——头顶、脚下、臂中。建造者已积累，但对失去的恐惧已成为牢笼。抓得太紧，安全也会变成监狱。' },
        5: { en: 'Two figures pass a lighted church in the snow, ragged and excluded. The Builder faces scarcity — of money, of belonging, of spirit. The warm light seen through the window is both a promise and a taunt.', zh: '两人衣衫褴褛经过雪中亮灯的教堂，被排斥在外。建造者面对匮乏——钱财的、归属的、精神的匮乏。窗中透出的暖光既是承诺也是嘲弄。' },
        6: { en: 'A wealthy figure distributes coins to beggars, scales in hand. The Builder now has enough to give — but the lesson is in the balance. Giving that creates dependency is not generosity. Receiving with dignity is also an art.', zh: '富人向乞丐分发钱币，手持天平。建造者现在有了可以给予的东西——但课题在于平衡。创造依赖的给予不是慷慨。有尊严地接受也是一种艺术。' },
        7: { en: 'The Builder leans on a staff, staring at a vine bearing coins — not yet ripe. The long pause between planting and harvest. Patience is not passive; it is active trust in the invisible growth beneath the soil.', zh: '建造者倚杖而立，凝视着结出钱币的藤蔓——尚未成熟。播种与收获之间漫长的停顿。耐心不是被动；是对土壤下无形生长的主动信任。' },
        8: { en: 'A craftsman hammers a coin, surrounded by finished work. The Builder has entered the flow of mastery — repetition, refinement, the joy of skill becoming art. The work becomes its own reward.', zh: '匠人锤打钱币，周围是完成的作品。建造者已进入精通的流动——重复、精炼、技艺成为艺术的喜悦。工作本身成为奖赏。' },
        9: { en: 'A woman in a vineyard, falcon on arm, nine coins clustered behind. The Builder now enjoys self-sufficiency — not wealth to flaunt, but wealth as freedom. The garden is hers because she cultivated it.', zh: '葡萄园中的女人，臂上立隼，身后九枚钱币。建造者现在享受自给自足——不是炫耀的财富，而是作为自由的财富。花园是她的，因为她耕耘了它。' },
        10: { en: 'An elder, a couple, a child, two dogs, a castle archway. The Builder\'s legacy — not money alone, but lineage, community, a world made more stable for those who come after. The coin has become a civilization.', zh: '老人、夫妇、孩子、两犬、城堡拱门。建造者的遗产——不单是金钱，而是血脉、社群、一个为后来者建得更稳固的世界。钱币已化为文明。' },
      },
    },
  };

  // ═══════════════════════════════════════════
  // 4. COURT CARD SYSTEM
  // Source: 葵花宝典 + 你可以再塔罗一点
  // Court = Person (primary) OR Event (secondary)
  // King=Fire of suit, Queen=Water of suit,
  // Knight=Air of suit, Page=Earth of suit
  // ═══════════════════════════════════════════
  const COURT_SYSTEM = {
    rankTraits: {
      king: {
        title: { en: 'The King', zh: '国王' },
        elementRole: 'fire-of',
        persona: { en: 'Mature authority, mastery, external expression of power. A leader who has integrated the suit\'s wisdom into action.', zh: '成熟的权威、精通、力量的外在表达。已将牌组智慧融入行动的领导者。' },
        asPerson: { en: 'An established figure of authority or an older man embodying this suit\'s mastery.', zh: '一位权威人物或体现此牌组精通之道的年长男性。' },
        asQuerent: { en: 'You are being called to lead, to master, to take full responsibility for this domain of your life.', zh: '你被召唤去领导、精通、为此生活领域承担全部责任。' },
        reversed: { en: 'Authority corrupted — either tyranny or weakness. The king has lost his crown from within.', zh: '权威腐化——或是暴政或是软弱。国王从内心失去了王冠。' },
      },
      queen: {
        title: { en: 'The Queen', zh: '王后' },
        elementRole: 'water-of',
        persona: { en: 'Inner mastery, nurturing wisdom, receptive power. A guide who embodies the suit\'s essence from within.', zh: '内在精通、滋养智慧、接收的力量。从内在体现牌组本质的指引者。' },
        asPerson: { en: 'A nurturing authority figure or a woman who embodies the inner qualities of this suit.', zh: '一位滋养他人的权威或体现此牌组内在特质的女性。' },
        asQuerent: { en: 'You are being called to nurture, to listen within, to express this energy through care rather than force.', zh: '你被召唤去滋养、向内倾听、通过关怀而非力量来表达这股能量。' },
        reversed: { en: 'The nurturer has become the smotherer, or has neglected herself to care for others.', zh: '滋养者变成了窒息者，或因照顾他人而忽略了自己。' },
      },
      knight: {
        title: { en: 'The Knight', zh: '骑士' },
        elementRole: 'air-of',
        persona: { en: 'Action, pursuit, the quest. The Knight embodies the suit\'s energy in motion — sometimes reckless, always passionate.', zh: '行动、追求、征程。骑士在运动中体现牌组的能量——有时鲁莽、总是热忱。' },
        asPerson: { en: 'A young adult (20s-30s) in active pursuit, or anyone on a mission related to this suit.', zh: '一个正在积极追求的年轻人，或任何与此牌组相关的使命中的人。' },
        asQuerent: { en: 'You are in the thick of the chase. Move with purpose, but do not let speed blind you to the terrain.', zh: '你正在追逐之中。有目的地行动，但不要让速度蒙蔽你对地形的觉察。' },
        reversed: { en: 'The quest has stalled or become reckless. Restlessness without direction. Burnout from chasing the wrong horizon.', zh: '征程停滞或变得鲁莽。没有方向的躁动。追逐错误地平线的消耗殆尽。' },
      },
      page: {
        title: { en: 'The Page', zh: '侍从' },
        elementRole: 'earth-of',
        persona: { en: 'The beginner, the student, the spark of potential. The Page holds the suit\'s seed — curious, open, unformed but fertile.', zh: '初学者、学生、潜能的火花。侍从握着牌组的种子——好奇、开放、未定型但肥沃。' },
        asPerson: { en: 'A young person or a beginner on a journey of learning related to this suit. Also: a message or invitation.', zh: '一个年轻人或在此牌组相关领域中学习的初学者。也代表：一条消息或邀请。' },
        asQuerent: { en: 'You stand at the threshold of a new skill or understanding. Embrace the beginner\'s mind — it is more powerful than the expert\'s certainty.', zh: '你站在新技能或新理解的门槛上。拥抱初学者之心——它比专家的确信更有力量。' },
        reversed: { en: 'The student refuses to learn. Immaturity, delayed messages, fear of taking the first step.', zh: '学生拒绝学习。不成熟、延宕的消息、害怕迈出第一步。' },
      },
    },
    suitModifiers: {
      wands: { realm: 'passion, creativity, ambition', realmZh: '热情、创造、野心', question: 'Where does your fire want to go?', questionZh: '你的火焰想往哪里去？' },
      cups: { realm: 'emotion, love, intuition', realmZh: '情感、爱、直觉', question: 'What does your heart truly feel?', questionZh: '你的心真正感受到了什么？' },
      swords: { realm: 'intellect, truth, justice', realmZh: '理智、真理、正义', question: 'What does your mind know that you have not yet spoken?', questionZh: '你的心智知道什么你尚未说出的东西？' },
      pentacles: { realm: 'body, wealth, craft', realmZh: '身体、财富、技艺', question: 'What are you building with your hands and your days?', questionZh: '你用双手和日子在建造什么？' },
    },
  };

  // ═══════════════════════════════════════════
  // 5. NUMBER PATTERN SYSTEM
  // Source: 葵花宝典 解牌六步法 Step 4 + 你可以再塔罗一点
  // ═══════════════════════════════════════════
  const NUMBER_PATTERNS = {
    1: {
      title: { en: 'The Seed · 种子', zh: '种子之数' },
      many: { en: 'Multiple Aces appear — new beginnings are calling from several directions at once. The universe is offering you many doors. Choose the one that makes your heart beat faster, not the one that looks safest.', zh: '多张Ace出现——新的开始从多个方向同时呼唤。宇宙正向你提供许多扇门。选择那扇让你的心跳加速的，而非看起来最安全的。' },
    },
    2: {
      title: { en: 'The Duality · 二元', zh: '二元之数' },
      many: { en: 'The number 2 repeats — duality, choice, partnership are the central themes. Two forces are at work in your life; the task is not to choose one over the other, but to hold both in creative tension.', zh: '数字2重复出现——二元、选择、伙伴是核心主题。两股力量在你的生活中运作；任务不是择一弃一，而是将两者保持在创造性的张力中。' },
    },
    3: {
      title: { en: 'The Creation · 创造', zh: '创造之数' },
      many: { en: 'The number 3 echoes — creation, growth, the first fruits of synthesis. What was two becomes three; the child of your efforts is being born across multiple domains.', zh: '数字3回响——创造、成长、合成的初果。二生三；你努力的结晶正在多个领域中诞生。' },
    },
    4: {
      title: { en: 'The Foundation · 根基', zh: '根基之数' },
      many: { en: 'The number 4 anchors — stability, structure, the four corners of your world are being reinforced. But beware: too much 4 energy can become rigidity. A foundation is for building upon, not for locking down.', zh: '数字4锚定——稳定、结构、你世界的四角正在被加固。但需警惕：过多的4能量可能变成僵硬。根基是为建造其上，而非封锁。' },
    },
    5: {
      title: { en: 'The Crisis · 危机', zh: '危机之数' },
      many: { en: 'The number 5 storms — conflict, disruption, change across multiple fronts. This is not punishment; it is the fire that burns away what was already dying. The 5 is the most alive of numbers — it refuses stagnation.', zh: '数字5风暴——冲突、打破、多个前线的变化。这不是惩罚；这是烧掉本已垂死之物的火。5是最有生命力的数字——它拒绝停滞。' },
    },
    6: {
      title: { en: 'The Harmony · 和谐', zh: '和谐之数' },
      many: { en: 'The number 6 restores — harmony, balance, beauty returning after the storm. Communication flows, relationships heal. The sixth day of creation was when everything was declared good.', zh: '数字6恢复——和谐、平衡、风暴过后美的回归。沟通流动、关系愈合。创世的第六天，万物被宣告为好的。' },
    },
    7: {
      title: { en: 'The Assessment · 审视', zh: '审视之数' },
      many: { en: 'The number 7 pauses — across multiple areas of your life, it is time to step back and evaluate. What has your effort yielded? What needs to change? The seventh day is for rest and reflection.', zh: '数字7暂停——在你生活的多个领域，是时候退后一步评估了。你的努力产生了什么？什么需要改变？第七天是为休息与反思而设的。' },
    },
    8: {
      title: { en: 'The Movement · 行动', zh: '行动之数' },
      many: { en: 'The number 8 accelerates — action, progress, momentum building in several directions. Things that have been stalled are now moving. The infinity symbol is an 8 on its side — endless possibility.', zh: '数字8加速——行动、进展、多个方向的动量积聚。停滞之事正在移动。无穷大符号是横躺的8——无限可能。' },
    },
    9: {
      title: { en: 'The Culmination · 圆满', zh: '圆满之数' },
      many: { en: 'The number 9 nears completion — multiple cycles are approaching their end. The harvest is almost ready, but the final ripening requires patience. Do not rush the last chapter.', zh: '数字9将近完成——多个循环接近尾声。收获几乎准备就绪，但最后的成熟需要耐心。不要催促最后一章。' },
    },
    10: {
      title: { en: 'The Completion · 完成', zh: '完成之数' },
      many: { en: 'The number 10 closes cycles — endings across multiple domains. But every 10 is also a 1+0 = a new Ace waiting to emerge. Completion is not the end; it is the threshold of the next beginning.', zh: '数字10收束循环——多个领域的终结。但每个10也是1+0=一张等待浮现的新Ace。完成不是终点；它是下一个开始的门槛。' },
    },
  };

  // ═══════════════════════════════════════════
  // 6. ELEMENT DYNAMICS — THE DEEP RULES
  // Source: 葵花宝典 四要素交互 + 78度的智慧
  // ═══════════════════════════════════════════
  const ELEMENT_DYNAMICS = {
    elements: {
      fire: {
        name: 'Fire', nameZh: '火', suit: 'wands', polarity: 'yang',
        nature: { en: 'Active, expanding, warming, drying. The spark of will, the drive to create, the courage to act.', zh: '活跃、扩张、温暖、干燥。意志的火花、创造的驱力、行动的勇气。' },
        excess: { en: 'Burnout, aggression, impatience. Fire unchecked consumes its own fuel.', zh: '耗尽、攻击性、急躁。不受控制的火焰会消耗自身燃料。' },
        absence: { en: 'Apathy, lack of motivation, creative block. Without fire, life grows cold.', zh: '冷漠、缺乏动力、创造阻塞。没有火，生命变得冰冷。' },
        gift: { en: 'Courage — the willingness to begin, to risk, to burn brightly even when the outcome is unknown.', zh: '勇气——愿意开始、愿意冒险、即便结果未知也要明亮燃烧的意愿。' },
      },
      water: {
        name: 'Water', nameZh: '水', suit: 'cups', polarity: 'yin',
        nature: { en: 'Receptive, flowing, cooling, moistening. The depth of feeling, the current of intuition, the ocean of the unconscious.', zh: '接纳、流动、冷却、滋润。感受的深度、直觉的流动、潜意识的海洋。' },
        excess: { en: 'Emotional overwhelm, drowning in feelings, loss of boundaries. Water without banks becomes a flood.', zh: '情感淹没、沉溺感受、失去边界。没有堤岸的水变成洪水。' },
        absence: { en: 'Emotional numbness, disconnection from intuition, dryness of the heart.', zh: '情感麻木、与直觉失联、心灵干涸。' },
        gift: { en: 'Feeling — the capacity to be moved, to connect deeply, to let the heart lead where the mind cannot map.', zh: '感受——被触动、深度连接、让心引领理智无法绘制之地的能力。' },
      },
      air: {
        name: 'Air', nameZh: '风', suit: 'swords', polarity: 'yang',
        nature: { en: 'Clear, moving, cooling, drying. The blade of thought, the wind of communication, the sky of ideas.', zh: '清晰、移动、冷却、干燥。思想的刀刃、沟通的风、思想的天空。' },
        excess: { en: 'Overthinking, coldness, detachment from feeling. Air without warmth becomes a gale that uproots rather than refreshes.', zh: '过度思考、冷漠、与感受分离。没有温度的空气变成连根拔起的狂风而非清新的微风。' },
        absence: { en: 'Confusion, inability to articulate, mental fog. Without air, clarity suffocates.', zh: '困惑、无法表达、心智迷雾。没有风，清明窒息。' },
        gift: { en: 'Clarity — the power to cut through confusion, to name what is true, to speak with precision and purpose.', zh: '清明——斩破困惑、为真相命名、以精准和目的言说的力量。' },
      },
      earth: {
        name: 'Earth', nameZh: '土', suit: 'pentacles', polarity: 'yin',
        nature: { en: 'Stable, dense, cooling, drying. The ground of the body, the weight of coins, the patience of stone.', zh: '稳定、密实、冷却、干燥。身体的大地、钱币的重量、石头的耐心。' },
        excess: { en: 'Stagnation, materialism, resistance to change. Earth without water becomes desert; without fire, frozen tundra.', zh: '停滞、物质主义、抗拒变化。没有水的土变成荒漠；没有火的土变成冻原。' },
        absence: { en: 'Instability, impracticality, disconnection from body and resources.', zh: '不稳定、不切实际、与身体和资源的失联。' },
        gift: { en: 'Manifestation — the ability to ground vision into reality, to build with patience, to trust the slow work of growth.', zh: '显化——将愿景落地为现实、以耐心建造、信任缓慢生长的力量。' },
      },
    },
    polarityRule(source, target) {
      const samePol = source.polarity === target.polarity;
      const diffPol = !samePol;
      const crossPol = diffPol && source.suit && target.suit &&
        ((source.suit === 'wands' && target.suit === 'cups') ||  // fire+water
         (source.suit === 'cups' && target.suit === 'wands') ||  // water+fire
         (source.suit === 'swords' && target.suit === 'pentacles') || // air+earth
         (source.suit === 'pentacles' && target.suit === 'swords')); // earth+air
      if (samePol) return {
        type: 'harmonious',
        en: `${source.name} and ${target.name} share polarity — they strengthen each other.`,
        zh: `${source.nameZh}与${target.nameZh}极性相同——它们互相增强。`,
      };
      if (crossPol) return {
        type: 'challenging',
        en: `${source.name} and ${target.name} are cross-element — tension, but also the creative friction that births new forms.`,
        zh: `${source.nameZh}与${target.nameZh}相克——存在张力，但也是诞生新形式的创造性摩擦。`,
      };
      return {
        type: 'neutral',
        en: `${source.name} and ${target.name} coexist — neither clashing nor merging. Each keeps its own nature.`,
        zh: `${source.nameZh}与${target.nameZh}共存——既不冲突也不融合，各自保持本性。`,
      };
    },
  };

  // ═══════════════════════════════════════════
  // 7. METHODOLOGY — 6-STEP INTERPRETATION
  // Source: 葵花宝典 解牌秘籍
  // ═══════════════════════════════════════════
  const METHODOLOGY = {
    sixSteps: [
      {
        id: 'step1', name: 'Major/Minor Ratio', nameZh: '大小比例',
        fn(cards) {
          const majors = cards.filter(c => c.data?.arcana === 'major').length;
          const minors = cards.length - majors;
          const ratio = majors / (cards.length || 1);
          if (ratio >= 0.5) return {
            level: 'deep',
            en: 'The Great Arcana dominate — this is soul-work, not surface business. Forces larger than your daily will are in motion. The question touches your deepest becoming.',
            zh: '大阿尔卡纳之主——此为灵魂之事，非表面之务。超越日常意志的力量在运转。此问触及你最深的成为。',
          };
          if (ratio <= 0.15 || majors === 0) return {
            level: 'practical',
            en: 'The Minor Arcana hold the stage — this is the realm of daily life, where your choices and habits, not cosmic forces, shape the outcome. Your agency is strong here.',
            zh: '小阿尔卡纳占据舞台——此为日常生活的领域，你的选择与习惯而非宇宙之力决定了结果。你的主动权在此处是强大的。',
          };
          return {
            level: 'balanced',
            en: 'A balanced weave — sacred and ordinary dance together. Both your deeper journey and your daily choices matter here.',
            zh: '平衡的交织——神圣与日常共舞。你更深的旅途与日常的选择在此同样重要。',
          };
        },
      },
      {
        id: 'step2', name: 'Suit Distribution', nameZh: '牌组分布',
        fn(cards) {
          const counts = { wands: 0, cups: 0, swords: 0, pentacles: 0, major: 0 };
          cards.forEach(c => {
            if (c.data?.arcana === 'major') counts.major++;
            else if (counts.hasOwnProperty(c.data?.suit)) counts[c.data.suit]++;
          });
          const total = cards.length;
          const dominant = Object.entries(counts).filter(([,c]) => c > 0).sort((a,b) => b[1] - a[1]);
          if (dominant.length === 0) return null;
          const top = dominant[0];
          const pct = top[1] / total;
          const suitNames = {
            wands: { en: 'Fire/Wands dominates', zh: '火/权杖主导' },
            cups: { en: 'Water/Cups dominates', zh: '水/圣杯主导' },
            swords: { en: 'Air/Swords dominates', zh: '风/宝剑主导' },
            pentacles: { en: 'Earth/Pentacles dominates', zh: '土/星币主导' },
            major: { en: 'Major Arcana dominate', zh: '大阿尔卡纳主导' },
          };
          const suitInsights = {
            wands: { en: 'This is a question driven by passion, action, and creative fire. The spirit of enterprise — or the restlessness it brings — is the central force.', zh: '这是一个由热情、行动与创造之火驱动的问题。进取精神——或它带来的不安——是核心力量。' },
            cups: { en: 'Emotions run deep here — love, connection, intuition, and the heart\'s hidden currents are shaping everything else. The question beneath the question may be about feeling, not fact.', zh: '情感在此处流淌甚深——爱、连接、直觉与心底的暗流正在塑造一切。问题背后的问题可能与感受有关，而非事实。' },
            swords: { en: 'The mind is the battlefield. Ideas, conflicts, truth-telling, and the double-edged nature of clarity. This is a question where perception itself is the key.', zh: '心智是战场。思想、冲突、真相之言、清明的双刃本质。这是一个感知本身即是关键的问题。' },
            pentacles: { en: 'The material world anchors this question — money, body, work, the tangible results of effort. Even if the question seems otherwise, practical concerns are at the root.', zh: '物质世界锚定此问——金钱、身体、工作、努力的具体结果。即使问题看似不同，实际关切仍藏于根部。' },
            major: { en: 'The Great Arcana dominate — archetypal forces, soul lessons, the big story rather than the daily detail.', zh: '大阿尔卡纳主导——原型力量、灵魂课题、宏大叙事而非日常细节。' },
          };
          if (pct >= 0.4) return { ...suitInsights[top[0]], dominant: top[0], pct };
          return { en: 'The suits are evenly distributed — no single force dominates. The situation calls for integration across all dimensions.', zh: '牌组分布均匀——无单一力量主导。情境要求在一切维度上的整合。', dominant: 'balanced', pct: 0 };
        },
      },
      {
        id: 'step3', name: 'Reversal Ratio', nameZh: '逆位比例',
        fn(reversedCount, total) {
          const ratio = reversedCount / (total || 1);
          if (ratio >= 0.6) return {
            en: 'More than half the cards are reversed — energy is turned inward, blocked, or working beneath the surface. This is not a negative sign but a call to deeper looking. What you resist seeing may hold the greatest gift. The situation may involve hidden factors, internal struggles, or timing that has not yet ripened.',
            zh: '过半牌呈逆位——能量内转、被阻、或在表面之下运作。这不是负面的信号，而是更深刻审视的召唤。你所抗拒看见的，可能藏着最大的礼物。此情境可能涉及隐藏因素、内在斗争、或尚未成熟的时间。',
          };
          if (ratio >= 0.25) return {
            en: 'Several cards appear reversed — some energies are working indirectly. Pause and reflect: where in your life are you pushing when you should be receiving? Where might a different angle reveal what you\'ve been missing?',
            zh: '数张牌呈逆位——部分能量在间接运作。暂停反思：在你生命的何处，你在本该接受时却用力推动？在何处，一个不同的角度可能揭示你一直忽略的东西？',
          };
          return {
            en: 'Most cards stand upright — energies flow openly and directly. The path, while not without its lessons, is relatively clear.',
            zh: '多数牌正位——能量开放而直接地流动。道路虽非无课，但仍相对清晰。',
          };
        },
      },
      {
        id: 'step4', name: 'Number Patterns', nameZh: '数字模式',
        fn(numberCounts) {
          const repeated = Object.entries(numberCounts).filter(([,c]) => c >= 2).map(([n, c]) => ({ number: parseInt(n), count: c }));
          if (repeated.length === 0) return null;
          return repeated.map(r => {
            const pattern = NUMBER_PATTERNS[r.number];
            if (!pattern) return { ...r, en: `${r.count} cards share the number ${r.number}.`, zh: `${r.count}张牌共有数字${r.number}。` };
            return {
              ...r,
              title: pattern.title,
              en: `${r.count} cards bear the number ${r.number} — ${pattern.title.en}. ${pattern.many.en}`,
              zh: `${r.count}张牌带有数字${r.number}——${pattern.title.zh}。${pattern.many.zh}`,
            };
          });
        },
      },
      {
        id: 'step5', name: 'Similar & Opposite Cards', nameZh: '近似与对立牌',
        fn(cards) {
          const pairs = [];
          const seen = new Set();
          for (let i = 0; i < cards.length; i++) {
            for (let j = i + 1; j < cards.length; j++) {
              const a = cards[i]?.data, b = cards[j]?.data;
              if (!a || !b) continue;
              const key = [Math.min(a.id,b.id), Math.max(a.id,b.id)].join('-');
              if (seen.has(key)) continue;
              seen.add(key);

              // Same element = mutually reinforcing
              const aEl = a.element || ({wands:'fire',cups:'water',swords:'air',pentacles:'earth'}[a.suit]);
              const bEl = b.element || ({wands:'fire',cups:'water',swords:'air',pentacles:'earth'}[b.suit]);
              if (aEl && bEl && aEl === bEl) {
                const elInfo = ELEMENT_DYNAMICS.elements[aEl];
                pairs.push({
                  type: 'similar', subtype: 'same-element', cards: [i, j],
                  en: `${a.nameEn} & ${b.nameEn} — both carry ${elInfo?.name || aEl}. Their energies amplify one another. ${elInfo?.nature?.en?.split('.')[0] || ''}.`,
                  zh: `${a.name}与${b.name}——同属${elInfo?.nameZh || aEl}元素。能量互相放大。${elInfo?.nature?.zh?.split('。')[0] || ''}。`,
                });
              }

              // Same number across suits = resonance
              if (a.number && b.number && a.number === b.number && a.suit !== b.suit) {
                const pat = NUMBER_PATTERNS[a.number];
                pairs.push({
                  type: 'similar', subtype: 'same-number', cards: [i, j],
                  en: `${a.nameEn} & ${b.nameEn} — both bear the number ${a.number}, the ${pat?.title?.en || 'energy'}. The same life-theme echoes across ${a.suit} and ${b.suit}, two voices singing the same note.`,
                  zh: `${a.name}与${b.name}——共载数字${a.number}，${pat?.title?.zh || '同一能量'}。同一生命主题在${a.suit}与${b.suit}之间回响，两个声音唱着同一个音符。`,
                });
              }

              // Major Arcana polarity pairs (light/shadow, active/receptive)
              const majorPolarities = {
                magician: ['high-priestess'], empress: ['emperor'], hierophant: ['hermit'],
                lovers: ['devil'], chariot: ['strength'], 'wheel-of-fortune': ['moon'],
                justice: ['judgment'], death: ['temperance'], tower: ['star'],
                sun: ['moon'], fool: ['world'], 'hanged-man': ['death'],
                strength: ['hermit'], empress: ['death'], emperor: ['tower'],
                lovers: ['judgment'], 'high-priestess': ['moon'], magician: ['devil'],
              };
              for (const [k, vals] of Object.entries(majorPolarities)) {
                if ((a.id === k && vals.includes(b.id)) || (b.id === k && vals.includes(a.id))) {
                  pairs.push({
                    type: 'polarity', subtype: 'major-archetype', cards: [i, j],
                    en: `${a.nameEn} & ${b.nameEn} form a sacred polarity — two faces of one mystery. One faces outward, the other inward. Together they map the full terrain of this life-lesson.`,
                    zh: `${a.name}与${b.name}构成神圣的两极——同一奥秘的两张面孔。一张朝外，一张向内。两者共同描绘了这一生命课题的完整版图。`,
                  });
                }
              }

              // Conflicting elements
              const conflictMatrix = [['fire','water'], ['air','earth']];
              if (aEl && bEl) {
                for (const [x, y] of conflictMatrix) {
                  if ((aEl === x && bEl === y) || (aEl === y && bEl === x)) {
                    pairs.push({
                      type: 'opposite', subtype: 'element-conflict', cards: [i, j],
                      en: `${a.nameEn} (${aEl}) & ${b.nameEn} (${bEl}) — cross-element tension. Fire and water make steam; air and earth make dust. This friction is creative, not destructive — it asks for synthesis, not surrender.`,
                      zh: `${a.name}（${aEl}）与${b.name}（${bEl}）——跨元素张力。火与水成蒸汽；风与土成尘。这摩擦是创造性的而非破坏性的——它要求的是综合，而非投降。`,
                    });
                  }
                }
              }

              // Same suit sequential = story arc fragment
              if (a.suit && b.suit && a.suit === b.suit && a.number && b.number) {
                const diff = Math.abs(a.number - b.number);
                if (diff <= 2) {
                  pairs.push({
                    type: 'similar', subtype: 'suit-neighbor', cards: [i, j],
                    en: `${a.nameEn} & ${b.nameEn} — neighboring chapters in the ${a.suit} story. They show how one state naturally evolves into the next within this suit's journey.`,
                    zh: `${a.name}与${b.name}——${a.suit}故事中相邻的章节。它们展示了在此牌组旅程中，一个状态如何自然演化为下一个。`,
                  });
                }
              }

              // Court card + same suit minor = court figure interacting with their realm
              if (a.rank && b.suit === ({wands:'wands',cups:'cups',swords:'swords',pentacles:'pentacles'}[a.suit]) && b.number) {
                pairs.push({
                  type: 'similar', subtype: 'court-realm', cards: [i, j],
                  en: `${a.nameEn} (${a.rank}) oversees the energy of ${b.nameEn} — the court figure brings their quality to bear on this suit-number dynamic.`,
                  zh: `${a.name}（${a.rank}）守护着${b.name}的能量——宫廷人物将其品质带入此牌组数字的动态之中。`,
                });
              }
            }
          }
          // Deduplicate: keep max 6 most meaningful pairs, prioritizing polarity > element-conflict > same-element > same-number
          const priority = { 'polarity': 0, 'opposite': 1, 'similar': 2 };
          pairs.sort((x, y) => (priority[x.type]||3) - (priority[y.type]||3));
          return pairs.slice(0, 6);
        },
      },
      {
        id: 'step6', name: 'Story Integration', nameZh: '故事串联',
        fn(cards, spread, step1, step2) {
          // Determine narrative arc type
          const positions = cards.map((c, i) => {
            const pos = spread?.positions?.[i];
            if (!pos) return null;
            const n = (pos.name || '').toLowerCase();
            const nz = pos.nameZh || '';
            const combined = n + nz;
            if (/past|过去|曾经|之前|以往|往昔/.test(combined)) return 'past';
            if (/present|现在|当前|目前|此刻|当下|今/.test(combined)) return 'present';
            if (/future|将来|之后|未来|以后|前景/.test(combined)) return 'future';
            if (/obstacle|阻碍|挑战|困难|障碍|block|challenge|cross/.test(combined)) return 'obstacle';
            if (/advice|建议|指导|指引|启示/.test(combined)) return 'advice';
            if (/environment|环境|外部|周围|surrounding|氛围/.test(combined)) return 'environment';
            if (/outcome|结果|最终|结局|ending|result/.test(combined)) return 'outcome';
            if (/hope|fear|希望|恐惧|期望|担忧/.test(combined)) return 'hope_fear';
            if (/foundation|基础|根基|根源|basis|bottom|root/.test(combined)) return 'foundation';
            if (/self|自我|自己|本人|querent|significator/.test(combined)) return 'self';
            if (pos.index === 0) return 'past';
            if (pos.index === 1) return 'present';
            return 'context';
          });

          const hasPast = positions.some(p => p === 'past');
          const hasFuture = positions.some(p => p === 'future');
          const hasObstacle = positions.some(p => p === 'obstacle');
          const hasOutcome = positions.some(p => p === 'outcome');
          const majorCount = cards.filter(c => c.data?.arcana === 'major').length;
          const reversedCount = cards.filter(c => c.isReversed).length;
          const totalCards = cards.length;

          let arcType = 'linear';
          if (hasPast && hasFuture && hasOutcome && totalCards >= 5) arcType = 'journey';
          else if (hasObstacle && reversedCount > totalCards / 3) arcType = 'hero';
          else if (majorCount >= totalCards / 2) arcType = 'destiny';
          else if (totalCards <= 2) arcType = 'whisper';
          else if (reversedCount >= totalCards / 2) arcType = 'inner-alchemy';

          const arcTypes = {
            journey: {
              en: 'A pilgrimage unfolds — from the seeds of the past, through the crossroads of the present, toward the horizon that beckons. Each card is a waystation. The thread connecting them is woven not by fate alone but by the choices you make at every step.',
              zh: '一段朝圣之旅徐徐展开——从过去的种子，穿越当下的十字路口，向着召唤的地平线。每张牌都是一座驿站。连接它们的线，并非仅由命运织成，更由你每一步的选择所编织。',
            },
            hero: {
              en: 'The hero\'s path — descent before ascent, wound before wisdom. The obstacles here are not punishments but initiations. You are being forged in the passage between who you were and who you are becoming. Every trial is a gate; every gate, once passed, cannot be passed again.',
              zh: '英雄之途——先降后升，先伤后智。此处的障碍不是惩罚，而是入门礼。你正在"曾经是谁"与"正在成为谁"之间的通道中被锻造。每一次考验都是一道门；每一道门，一旦穿过，便不可复返。',
            },
            destiny: {
              en: 'The Great Arcana have gathered — this is not a chapter of ordinary life but a soul-turning. Archetypal forces move through these cards like weather systems through a landscape. Their language is myth; their gift is transformation.',
              zh: '大阿尔卡纳集结——这不是平凡生活的一章，而是灵魂的转向。原型之力如同穿越地景的气候系统般越过这些牌面。它们的语言是神话；它们的礼物是蜕变。',
            },
            whisper: {
              en: 'A quiet oracle — not every message thunders. These cards speak in the register of everyday grace, where the sacred hides in the ordinary and wisdom wears the face of the familiar. Listen closely; the softest voice often carries the deepest truth.',
              zh: '一道轻声的神谕——并非每条消息都雷霆万钧。这些牌以日常恩典的音量诉说，神圣藏于平凡，智慧戴着熟悉的面孔。近前倾听；最轻柔的声音往往承载最深的真相。',
            },
            'inner-alchemy': {
              en: 'The energy has turned inward — more than half these cards appear reversed. This is not a sign of blockage but of alchemy: the work happening beneath the surface, in the dark, where seeds germinate and souls are tempered. The outward story is quiet because the inward story is volcanic.',
              zh: '能量已经内转——过半牌面呈逆位。这不是阻塞的迹象，而是炼金术的证明：工作在表面之下、在黑暗中进行，种子在此发芽，灵魂在此淬炼。外在的故事安静，因为内在的故事如火如荼。',
            },
            linear: {
              en: 'A clear arc — cause meeting effect, intention meeting outcome. The cards trace a line through your question, and that line, followed with presence and honesty, leads somewhere true.',
              zh: '一条清晰的弧线——因遇果，意图遇见结局。牌面在你的问题中描出一条线，若以临在与诚实循之，便能抵达真实之地。',
            },
          };
          const arc = arcTypes[arcType];

          // Build causal chain with element-based transitions
          const chain = cards.map((c, i) => {
            const card = c.data;
            const posRole = positions[i];
            let phaseEn = '', phaseZh = '';
            if (posRole === 'past') { phaseEn = 'the seed planted'; phaseZh = '已播之种'; }
            else if (posRole === 'present') { phaseEn = 'the pivot now turning'; phaseZh = '正在转动的枢纽'; }
            else if (posRole === 'future') { phaseEn = 'the horizon forming'; phaseZh = '正在成形的地平线'; }
            else if (posRole === 'obstacle') { phaseEn = 'the fire that tempers'; phaseZh = '淬炼之火'; }
            else if (posRole === 'advice') { phaseEn = 'wisdom offered'; phaseZh = '赐予的智慧'; }
            else if (posRole === 'outcome') { phaseEn = 'destination crystallizing'; phaseZh = '正在结晶的终点'; }
            else if (posRole === 'environment') { phaseEn = 'the air you breathe'; phaseZh = '你呼吸的空气'; }
            else if (posRole === 'foundation') { phaseEn = 'the ground beneath'; phaseZh = '脚下之基'; }
            else if (posRole === 'hope_fear') { phaseEn = 'the double face'; phaseZh = '双面之镜'; }
            else { phaseEn = 'a thread in the weave'; phaseZh = '织体中的一缕'; }
            return { card, index: i, posRole, phaseEn, phaseZh };
          });

          // Detect the overall emotional/energetic curve
          const firstHalfMajors = cards.slice(0, Math.ceil(totalCards/2)).filter(c => c.data?.arcana === 'major').length;
          const secondHalfMajors = cards.slice(Math.ceil(totalCards/2)).filter(c => c.data?.arcana === 'major').length;
          let curve = 'steady';
          if (secondHalfMajors > firstHalfMajors) curve = 'rising';
          else if (firstHalfMajors > secondHalfMajors + 1) curve = 'deepening';
          if (positions[0] === 'past' && positions[totalCards-1] === 'outcome') curve = 'transformation';

          const curveNames = {
            rising: { en: 'The energy rises as the spread unfolds — lighter, clearer, more resolved with each card.', zh: '能量随着牌阵展开而上升——每张牌都更轻盈、更清晰、更趋于解决。' },
            deepening: { en: 'The story deepens as it goes — surface concerns give way to root truths. The early cards ask "what"; the later cards answer "why."', zh: '故事愈发深沉——表面关切让位于根源真相。前面的牌问"什么"；后面的牌答"为什么"。' },
            transformation: { en: 'A complete arc of transformation — the opening and closing cards mirror each other across a bridge of change. You are not the same person at the end of this spread.', zh: '一段完整的蜕变弧线——首尾之牌隔着一道变迁之桥遥遥相映。在这牌阵的尽头，你已不是同一个人。' },
            steady: { en: 'A steady, integrated flow — no dramatic swerves but a deepening coherence as each card adds its voice to the chorus.', zh: '平稳而整合的流动——没有剧烈的转向，但随着每张牌将自己的声音加入合唱，内在的连贯性愈发深厚。' },
          };

          return { arcType, arc, chain, curve: curveNames[curve] };
        },
      },
    ],
    questionRules: [
      { en: 'Focus on what you can influence, not what is fixed.', zh: '专注于你能影响之事，而非已定之局。' },
      { en: 'Ask "How can I..." rather than "Will I..." — the cards guide action, not prediction.', zh: '问"我如何能……"而非"我会不会……"——牌引导行动，而非预言。' },
      { en: 'Be specific — a clear question receives a clear answer. "Tell me about my love life" is a fog; "What blocks me from deeper connection?" is a key.', zh: '明确具体——清晰的问题才能得到清晰的回答。"说说我的感情生活"是一片雾；"什么阻碍了我获得更深的连接？"是一把钥匙。' },
      { en: 'Limit your scope to the next 1-2 years — beyond that, the threads multiply beyond any single pattern.', zh: '将范围限制在未来1-2年内——超出此时，线索繁复，超越任何单一图景。' },
    ],
  };

  // ═══════════════════════════════════════════
  // 8. TEMPLATE LIBRARY — 500+ blocks
  // Context-aware reading templates organized by:
  // domain × questionType × sentiment × position × spreadType
  // ═══════════════════════════════════════════
  const TEMPLATE_LIBRARY = {
    // ── Summary templates — concise plain-language overview (3-5 sentences) ──
    summary: {
      love: {
        anxious: [
          { zh: '你的心现在悬在一段关系上，充满了不确定。牌面显示这件事比表面看起来更复杂——你感受到的不安，其实是直觉在提醒你别忽略某些信号。核心建议是：先别急着做决定，给自己一点空间看清全貌。', en: 'Your heart is hanging on a relationship, full of uncertainty. The cards show this is more complex than it appears — your anxiety is actually intuition warning you not to ignore certain signals. The core advice: don\'t rush to decide, give yourself space to see the full picture.' },
          { zh: '一段感情让你感到不安，或者说——你怕失去什么。牌面说：恐惧本身不是坏事，它在告诉你什么对你真正重要。现在的关键是搞清你怕的究竟是失去对方，还是失去自己在这段关系里的位置。', en: 'A relationship is making you uneasy — or rather, you fear losing something. The cards say: fear itself is not bad, it tells you what truly matters. The key now is to figure out whether you fear losing them, or losing your place in this relationship.' },
          { zh: '感情的张力正在升高，你可能在反复想"是不是我做错了什么"。放松——牌面没有指向任何人的错。它指向的是一个模式：你太想在不确定中抓住确定，反而让自己更累。先松手，答案会在平静时浮现。', en: 'The tension in your relationship is rising. You may be replaying "did I do something wrong." Relax — the cards point to no one\'s fault. They point to a pattern: you want certainty so badly in uncertainty that you exhaust yourself. Let go first, answers emerge in calm.' },
        ],
        hopeful: [
          { zh: '一段新的可能正在靠近——也许是新的人，也许是旧关系的新阶段。牌面透露出希望，但也提醒你：别急着把所有期待都放进一个人身上。让事情自然生长，好东西经得起等待。', en: 'A new possibility is approaching — maybe a new person, maybe a new phase in an old relationship. The cards show hope, but remind you: don\'t rush to put all expectations into one person. Let things grow naturally; good things can wait.' },
          { zh: '你的心是敞开的，这很好。牌面说你现在正处于一个适合"接收"的状态——接收爱、接收理解、接收新的连接。保持这份开放，但也保持基本的判断力。不是每扇打开的门都值得进。', en: 'Your heart is open — that\'s good. The cards say you\'re in a receptive state — ready to receive love, understanding, new connections. Stay open, but keep your judgment. Not every open door is worth entering.' },
        ],
        painful: [
          { zh: '你在经历分手或关系破裂的痛苦。牌面首先要告诉你的是：这不是你的终点。每段结束都带着一份礼物——虽然现在看起来裹在一团乱七八糟的包装纸里。给自己时间哀悼，但别在废墟里建房子。', en: 'You are going through the pain of breakup or breakdown. The cards first want to tell you: this is not your ending. Every ending carries a gift — even if it now looks wrapped in a mess. Give yourself time to grieve, but don\'t build a house in the ruins.' },
          { zh: '心碎的感觉很真实，也很痛。但牌面反复出现一个信息：你失去的是一段关系，不是你爱与被爱的能力。这种能力在你身体里完好无损。现在的关键是不要把"这段关系结束了"解读成"我不够好"。', en: 'Heartbreak feels real and painful. But the cards repeat one message: you lost a relationship, not your ability to love and be loved. That ability is intact within you. The key: don\'t translate "this relationship ended" into "I\'m not enough."' },
        ],
        confused: [
          { zh: '你不确定这个人对你到底是什么感觉，也不确定自己对TA是什么感觉。牌面说：这种困惑不是因为信息不够——而是因为你同时接收了太多矛盾的信号。先停一停，问自己一个更简单的问题：和这个人在一起时，你更像自己，还是更不像自己？', en: 'You\'re unsure what this person feels about you, or even what you feel about them. The cards say: this confusion isn\'t from lack of information — it\'s from too many contradictory signals. Pause and ask a simpler question: with this person, are you more yourself, or less?' },
        ],
      },
      career: {
        anxious: [
          { zh: '工作上的不确定感正在消耗你。牌面显示你面临一个关键的转折点——可能是一个决定要做、一个变化要适应。核心建议：与其担心"选错了怎么办"，不如问自己"哪个选择让我更接近我想要的活法"。', en: 'Career uncertainty is draining you. The cards show a pivotal moment — a decision to make, a change to adapt to. Core advice: instead of worrying "what if I choose wrong," ask "which choice brings me closer to the life I want to live."' },
          { zh: '你可能感到被低估或者被困住了。牌面说：你的焦虑是有道理的——现状确实需要改变。但它不一定需要你"彻底推翻一切"。有时只是挪动一小步，整个局面就会松动。', en: 'You may feel undervalued or stuck. The cards say: your anxiety is valid — the current situation does need change. But it doesn\'t require "overthrowing everything." Sometimes just a small shift can loosen the whole pattern.' },
        ],
        hopeful: [
          { zh: '一个机会正在酝酿——可能是跳槽、晋升，或者一个全新的方向。牌面鼓励你朝着它走，但也提醒：别因为"终于有希望了"就忽略细节。认真看看这个新机会背后的实际条件。', en: 'An opportunity is brewing — a job change, promotion, or a whole new direction. The cards encourage you to move toward it, but remind: don\'t ignore details because "finally there\'s hope." Look carefully at the actual conditions behind this opportunity.' },
        ],
        confused: [
          { zh: '你在纠结要不要换工作、转方向。牌面说：与其在两个选项之间反复比较，不如先搞清一件事——你真正想要的是"离开现在的"，还是"走向想要的"。这两个方向看起来相似，走起来完全不同。', en: 'You\'re torn about changing jobs or directions. The cards say: instead of comparing two options endlessly, first figure out one thing — do you truly want to "leave the current" or "walk toward what you want." These look similar but feel completely different.' },
        ],
      },
      wealth: {
        anxious: [
          { zh: '你现在对钱的事感到压力。牌面显示，问题的核心可能不在数字上——而在你对钱的某种深层信念上。比如"我不配拥有这么多"或"钱多了会出问题"。这些念头比具体的财务数字更值得你关注。', en: 'You\'re stressed about money. The cards show the core issue may not be the numbers — but a deeper belief about money. Like "I don\'t deserve abundance" or "more money brings problems." These thoughts deserve more attention than the actual figures.' },
        ],
        hopeful: [
          { zh: '财务状况在好转，或者一个新的财路正在显现。牌面鼓励你把握机会，但也提醒：财富的增长需要与之匹配的"容器"——也就是你的心态和规划能力。先准备好容器，水流进来才不会漏掉。', en: 'Your financial situation is improving, or a new source is appearing. The cards encourage you to seize it, but remind: growing wealth needs a matching "container" — your mindset and planning ability. Prepare the container first so the water doesn\'t leak.' },
        ],
      },
      study: {
        anxious: [
          { zh: '考试或学业的压力让你有点喘不过气。牌面说：你现在最需要的不是"再努力一点"，而是调整一下方法或者心态。死磕和坚持是两回事——前者让你累，后者让你成长。', en: 'Exam or study pressure is overwhelming you. The cards say: what you need most now isn\'t "work harder," but to adjust your method or mindset. Grinding and persevering are different — one exhausts you, the other grows you.' },
        ],
      },
      destiny: {
        general: [
          { zh: '你对人生的方向感到迷茫。牌面提醒你：迷茫不是迷路，只是你正在从一个旧的导航系统切换到新的。旧的答案不再适用了，新的还没有成形。这段空白期本身就是一种生长。', en: 'You feel lost about life\'s direction. The cards remind: confusion isn\'t being lost, it\'s switching from an old navigation system to a new one. Old answers no longer apply, new ones haven\'t formed. This blank period is itself a form of growth.' },
          { zh: '你在追问人生的意义。牌面的回应是：意义不是"找到"的，是"活出来"的。别等一个从天而降的答案——看看你每天都愿意把时间花在什么上面。那就是你现在的人生方向。', en: 'You\'re asking about life\'s meaning. The cards respond: meaning isn\'t "found," it\'s "lived." Don\'t wait for an answer from the sky — look at what you willingly spend time on every day. That is your current life direction.' },
        ],
      },
      general: {
        fallback: [
          { zh: '你问了一个对你很重要的问题。牌面的核心信息是：情况在流动，不是固定的。你现在看到的只是整个故事的一个章节，别把一章当全本。保持觉察，下一步会在合适的时间显现。', en: 'You asked a question that matters to you. The cards\' core message: the situation is fluid, not fixed. What you see now is just one chapter, not the whole book. Stay aware, and the next step will reveal itself at the right time.' },
        ],
      },
    },

    // ── Summary V2 — natural paragraph templates with placeholder slots ──
    summaryV2: {
      love: {
        anxious: {
          single: [
            {
              zh: '{keywordEcho}，牌面看得分明。{mainCardInsight}你不是在胡思乱想——你的心只是比别人更早察觉到了什么。{reversalNote}先别急着要一个结果，把呼吸放慢，答案会自己浮上来的。{adviceHint}',
              en: '{keywordEcho}, the cards see it clearly. {mainCardInsight}You are not overthinking — your heart simply sensed something before your mind could catch up. {reversalNote}Don\'t rush for an answer just yet. Slow your breath, and the clarity will rise on its own. {adviceHint}'
            },
            {
              zh: '{domainFrame}，有些不安是值得认真对待的信号，不是需要被压下去的噪音。{mainCardInsight}{reversalNote}你不是没有力量——你只是把力量都花在了担心上。收回来，放回自己身上。{adviceHint}',
              en: '{domainFrame}, some anxieties are signals worth heeding, not noise to be silenced. {mainCardInsight}{reversalNote}You are not powerless — you have simply poured your power into worry. Gather it back and place it where it belongs: within yourself. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这就是牌面想让你看到的东西。{keywordEcho}，这些事在你心里绕了很久了——牌面没有绕，它直接指到了核心。{reversalNote}信任你的直觉，它比你想象的更清醒。{adviceHint}',
              en: '{mainCardInsight}This is what the cards want you to see. {keywordEcho}, these thoughts have been circling in your heart for a while — the cards don\'t circle; they point straight to the core. {reversalNote}Trust your intuition; it knows more than you give it credit for. {adviceHint}'
            },
            {
              zh: '{reversalNote}{mainCardInsight}{domainFrame}，有时候我们害怕的并不是事情本身，而是"不确定"这三个字。把不确定摊在牌面上看一看，你会发现它没有那么可怕。{adviceHint}',
              en: '{reversalNote}{mainCardInsight}{domainFrame}, sometimes what we fear is not the thing itself but the word "uncertainty." Lay that uncertainty out on the table and look at it — you may find it less frightening than it seemed. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你的在意本身就是一种珍贵的东西——它说明你的心是活的、是认真的。{mainCardInsight}{reversalNote}不安会过去，但你在这段关系里学到的东西会留下来。{adviceHint}',
              en: '{domainFrame}, the fact that you care so deeply is itself something precious — it means your heart is alive and sincere. {mainCardInsight}{reversalNote}The anxiety will pass, but what you learn about yourself through this connection will stay. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面看得分明。{mainCardInsight}{cardJourney}亲爱的，别急着在外面找答案——牌面反复指向的，是你需要先回到自己心里那个安静的地方。{adviceHint}',
              en: '{keywordEcho}, the cards see it clearly. {mainCardInsight}{cardJourney}Dear one, don\'t rush to find answers out there — the cards keep pointing you back to the quiet place within. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你的心是诚实的——它知道自己在乎什么、害怕什么。{mainCardInsight}{reversalNote}你不是被困住了，你只是在找一个确认。而这个确认，应该先从你对自己的信任开始。{cardJourney}{adviceHint}',
              en: '{domainFrame}, your heart is honest — it knows what it cares about and what it fears. {mainCardInsight}{reversalNote}You are not stuck; you are simply looking for confirmation. And that confirmation should start with trusting yourself first. {cardJourney}{adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{keywordEcho}——你看，牌面已经把这些缠绕的线一根一根理出来了。{reversalNote}不安不会一夜消失，但每看清一点，它就轻一点。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{keywordEcho} — see, the cards have already begun untangling those knotted threads one by one. {reversalNote}The anxiety won\'t vanish overnight, but with every bit of clarity, it grows lighter. {adviceHint}'
            },
            {
              zh: '{domainFrame}，有时候一段关系里最累的不是吵架，而是"悬着"。{mainCardInsight}{cardJourney}牌面在帮你把"悬着"的东西放下来——先放下来，再看它是什么。{adviceHint}',
              en: '{domainFrame}, sometimes the most exhausting thing in a relationship isn\'t the arguing — it\'s the "hanging in the air." {mainCardInsight}{cardJourney}The cards are helping you set that weight down — set it down first, then look at what it is. {adviceHint}'
            },
            {
              zh: '{cardJourney}{mainCardInsight}{reversalNote}{domainFrame}，你不必在今天解决所有问题。牌面只是给了你一张地图——走哪条路、什么时候走，是你自己的节奏。{adviceHint}',
              en: '{cardJourney}{mainCardInsight}{reversalNote}{domainFrame}, you don\'t have to solve everything today. The cards have only given you a map — which path to walk, and when, is at your own pace. {adviceHint}'
            }
          ]
        },
        hopeful: {
          single: [
            {
              zh: '{domainFrame}，一股温暖的能量正在靠近你的心。{mainCardInsight}这不是盲目的乐观——牌面真的看到了一些值得你期待的东西。{adviceHint}',
              en: '{domainFrame}, a warm energy is drawing close to your heart. {mainCardInsight}This is not blind optimism — the cards genuinely see something worth looking forward to. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面的回应比你想的更温柔。{mainCardInsight}{reversalNote}好的缘分不需要你踮起脚尖去够——它会在你站稳的时候走到你面前。{adviceHint}',
              en: '{keywordEcho}, the cards\' response is gentler than you might expect. {mainCardInsight}{reversalNote}The right connection doesn\'t ask you to stand on tiptoe to reach it — it walks toward you when you are standing steady. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{domainFrame}，你心里那个"万一呢"的小声音，牌面听到了——它给的回答是：值得相信一次。{reversalNote}把心打开一条缝，让光有机会照进来。{adviceHint}',
              en: '{mainCardInsight}{domainFrame}, that small voice inside you whispering "what if" — the cards heard it, and their answer is: it\'s worth believing this time. {reversalNote}Open your heart just a crack, and let the light find its way in. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你之前走的路没有白走——那些弯弯绕绕把你带到了现在这个位置，而这个位置，牌面看着是好的。{mainCardInsight}{adviceHint}',
              en: '{domainFrame}, the road you\'ve walked has not been wasted — all those twists and turns have brought you to where you are now, and from where the cards sit, this is a good place to be. {mainCardInsight}{adviceHint}'
            },
            {
              zh: '{keywordEcho}，你看，牌面没有皱眉。{mainCardInsight}{domainFrame}，有时候幸福来的时候不需要你做什么——你只需要别把它挡在门外。{reversalNote}{adviceHint}',
              en: '{keywordEcho}, look — the cards are not frowning. {mainCardInsight}{domainFrame}, sometimes happiness arrives without asking you to do anything — you just need to not shut the door on it. {reversalNote}{adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，一股温暖的能量正在靠近。{mainCardInsight}{cardJourney}好的事情需要时间——就像花开有它的季节，你的心也有它自己的节奏。{adviceHint}',
              en: '{domainFrame}, a warm energy is drawing near. {mainCardInsight}{cardJourney}Good things take time — just as flowers bloom in their season, your heart has its own rhythm. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面在笑了。{mainCardInsight}{cardJourney}你值得这份期待——不是因为"应该"，而是因为你已经在不知不觉中准备好了。{adviceHint}',
              en: '{keywordEcho}, the cards are smiling. {mainCardInsight}{cardJourney}You deserve this hope — not because you "should," but because, without realizing it, you are already ready. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，有些缘分不是"找到"的，而是"走到"的。你已经在路上了，而且方向是对的。{reversalNote}{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, some connections are not "found" — they are "arrived at." You are already on the path, and the direction is true. {reversalNote}{adviceHint}'
            },
            {
              zh: '{domainFrame}，你的心最近是不是轻了一点？{cardJourney}{mainCardInsight}牌面看到的不是幻想，而是一扇正在打开的门。{adviceHint}',
              en: '{domainFrame}, has your heart felt a little lighter lately? {cardJourney}{mainCardInsight}What the cards see is not a fantasy but a door that is opening. {adviceHint}'
            },
            {
              zh: '{keywordEcho}——牌面给出的画面比你想的更明亮。{domainFrame}{mainCardInsight}{cardJourney}{reversalNote}别怕期待落空。这次，期待本身就是一种力量。{adviceHint}',
              en: '{keywordEcho} — the picture the cards are painting is brighter than you think. {domainFrame}{mainCardInsight}{cardJourney}{reversalNote}Don\'t be afraid of disappointment. This time, the hope itself is a form of strength. {adviceHint}'
            }
          ]
        },
        confused: {
          single: [
            {
              zh: '{keywordEcho}，你的混乱不是因为你"看不清"——恰恰是因为你看了太多角度，每个角度都有道理。{domainFrame}{mainCardInsight}牌面帮你拨开一层雾，先只看这一件事。{adviceHint}',
              en: '{keywordEcho}, your confusion is not because you "can\'t see clearly" — it\'s precisely because you see from too many angles, and each one makes sense. {domainFrame}{mainCardInsight}The cards are parting one layer of fog for you; let\'s just look at this one thing first. {adviceHint}'
            },
            {
              zh: '{domainFrame}，当脑子里有很多声音的时候，最响的那个不一定是最对的。{mainCardInsight}{reversalNote}牌面在帮你把音量调小一点——调小之后，你会听到自己真正在想什么。{adviceHint}',
              en: '{domainFrame}, when there are many voices in your head, the loudest one is not always the truest. {mainCardInsight}{reversalNote}The cards are helping you turn the volume down — once it\'s quieter, you\'ll hear what you really think. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这是牌面切到核心的第一刀。{keywordEcho}，你不需要在"所有的可能性"里做选择——你只需要在"这一张牌指向的方向"上先走一步。{adviceHint}',
              en: '{mainCardInsight}That is the cards\' first cut to the core. {keywordEcho}, you don\'t need to choose among "all the possibilities" — you only need to take one step in the direction this card is pointing. {adviceHint}'
            },
            {
              zh: '{domainFrame}，迷雾本身不可怕——可怕的是你觉得"应该"什么都看清。{keywordEcho}{mainCardInsight}{reversalNote}看不清的时候，先凭感觉走一步，牌面说这一步是对的方向。{adviceHint}',
              en: '{domainFrame}, the fog itself is not frightening — what\'s frightening is the feeling that you "should" see everything clearly. {keywordEcho}{mainCardInsight}{reversalNote}When you can\'t see clearly, take one step on instinct — the cards say it\'s the right direction. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面没有给你一个"标准答案"——它给的是一个方向感。{mainCardInsight}{reversalNote}在感情里，方向感比标准答案重要得多。{adviceHint}',
              en: '{keywordEcho}, the cards aren\'t giving you a "standard answer" — they\'re giving you a sense of direction. {mainCardInsight}{reversalNote}In matters of the heart, direction matters far more than definitive answers. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面把这几张摊开之后，画面其实比你想的清楚。{domainFrame}{mainCardInsight}{cardJourney}你的迷茫不是因为前面的路消失了——是因为岔路太多。牌面在帮你一条一条看清楚。{adviceHint}',
              en: '{keywordEcho}, once the cards are laid out, the picture is actually clearer than you think. {domainFrame}{mainCardInsight}{cardJourney}Your confusion is not because the road ahead has vanished — it\'s because there are too many forks. The cards are helping you see each one clearly. {adviceHint}'
            },
            {
              zh: '{domainFrame}，有时候心乱不是因为不知道答案，是因为知道了但不甘心。{mainCardInsight}{cardJourney}{reversalNote}牌面替你说出了那个你一直知道但不太想面对的东西——说出来之后，反而轻松了。{adviceHint}',
              en: '{domainFrame}, sometimes the heart is restless not because you don\'t know the answer, but because you know it and aren\'t ready to accept it. {mainCardInsight}{cardJourney}{reversalNote}The cards have spoken aloud what you\'ve known all along but weren\'t ready to face — and saying it out loud actually brings relief. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{keywordEcho}——你看，牌面把每条线的走向都指出来了。{domainFrame}，你不必今天就决定终点，你只需要看懂下一步。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{keywordEcho} — see, the cards have traced the direction of every thread. {domainFrame}, you don\'t need to decide the destination today; you only need to understand the next step. {adviceHint}'
            },
            {
              zh: '{domainFrame}，混乱常常是重新排列的前兆——就像一副牌洗开之后，要重新理好之前那几秒的散乱。{cardJourney}{mainCardInsight}{reversalNote}{adviceHint}',
              en: '{domainFrame}, confusion is often the precursor to rearrangement — like the scattered moment right after a deck is shuffled, just before it\'s put back in order. {cardJourney}{mainCardInsight}{reversalNote}{adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面在看这件事的时候没有绕弯子。{mainCardInsight}{cardJourney}{reversalNote}你的直觉其实一直在线——它只是被太多的"万一"盖住了。牌面帮你掀开那层布。{adviceHint}',
              en: '{keywordEcho}, the cards are not beating around the bush on this one. {mainCardInsight}{cardJourney}{reversalNote}Your intuition has actually been online all along — it\'s just buried under too many "what-ifs." The cards are helping you lift that cloth. {adviceHint}'
            }
          ]
        },
        painful: {
          single: [
            {
              zh: '{keywordEcho}，疼就是疼——牌面不想用漂亮话绕开它。{mainCardInsight}你不是在"失败"里，你是在"整理"中。给自己一点时间和温柔，伤口不是需要被跳过的东西，而是需要被穿过的地方。{adviceHint}',
              en: '{keywordEcho}, pain is pain — the cards won\'t pretty-talk around it. {mainCardInsight}You are not in "failure"; you are in "sorting through." Give yourself time and tenderness. Wounds are not something to skip over, but something to walk through. {adviceHint}'
            },
            {
              zh: '{domainFrame}，有些结束不是惩罚，是保护——只是当下的你还看不到那个保护的轮廓。{mainCardInsight}{reversalNote}允许自己难过，同时也要知道：难过不是你的终点，是你经过的地方。{adviceHint}',
              en: '{domainFrame}, some endings are not punishment but protection — it\'s just that you can\'t yet see the shape of that protection from where you stand. {mainCardInsight}{reversalNote}Give yourself permission to grieve, and also know this: grief is not your destination; it is a place you pass through. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}牌面看到了你心里那个还在流血的地方。{keywordEcho}，你不是一个人扛着这些——牌面在这里，读到你的痛了。{reversalNote}疼是真的，但你比你想象的要完整得多。{adviceHint}',
              en: '{mainCardInsight}The cards see the place in your heart that is still bleeding. {keywordEcho}, you are not carrying this alone — the cards are here, and they have read your pain. {reversalNote}The hurt is real, but you are far more whole than you imagine. {adviceHint}'
            },
            {
              zh: '{domainFrame}，爱过的人会在心里留下痕迹——这痕迹不是伤疤，是地图上的一条线。{keywordEcho}{mainCardInsight}有一天你会回头看这段路，发现它把你带到了一个更好的自己面前。{adviceHint}',
              en: '{domainFrame}, those we have loved leave marks on our hearts — not scars, but lines on a map. {keywordEcho}{mainCardInsight}One day you will look back on this stretch of road and realize it brought you face to face with a better version of yourself. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面接住了你的情绪，没有躲开。{domainFrame}{mainCardInsight}{reversalNote}心碎过的人不是碎了——是被重新捏成了一个更有深度的形状。{adviceHint}',
              en: '{keywordEcho}, the cards caught your feelings without flinching. {domainFrame}{mainCardInsight}{reversalNote}A heart that has been broken is not shattered — it has been remolded into a shape of greater depth. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面看到这一段路走得不容易。{mainCardInsight}{cardJourney}你不是在倒退——你是在穿过一条隧道。隧道是暗的，但它一定通向另一头。{reversalNote}{adviceHint}',
              en: '{keywordEcho}, the cards see that this stretch has not been easy. {mainCardInsight}{cardJourney}You are not moving backward — you are passing through a tunnel. The tunnel is dark, but it absolutely leads to the other side. {reversalNote}{adviceHint}'
            },
            {
              zh: '{domainFrame}，有些痛不是"想开点"就能过去的——牌面懂这个。{mainCardInsight}{cardJourney}{reversalNote}伤口有它自己的愈合节奏，你急不了，也不需要急。牌面陪着你，一张一张地看。{adviceHint}',
              en: '{domainFrame}, some hurts can\'t be resolved with "just cheer up" — the cards understand this. {mainCardInsight}{cardJourney}{reversalNote}Wounds have their own rhythm of healing; you can\'t rush it, and you don\'t need to. The cards are here with you, reading one card at a time. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面的每一张都看到了你的故事。{domainFrame}{mainCardInsight}{cardJourney}你不是"放不下"——你只是"还在感受"。感受够了，手自然就松开了。{adviceHint}',
              en: '{keywordEcho}, every card on the table has read your story. {domainFrame}{mainCardInsight}{cardJourney}You are not "unable to let go" — you are simply "still feeling." When you have felt enough, your hand will loosen on its own. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}牌面在说：这段经历改变了你，但没有毁掉你。{reversalNote}{domainFrame}，疼痛里有信息——它告诉你什么是你在意的、什么对你来说是真的。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}The cards are saying: this experience changed you, but it did not destroy you. {reversalNote}{domainFrame}, there is information inside the pain — it tells you what you care about, what is real to you. {adviceHint}'
            },
            {
              zh: '{domainFrame}，最难熬的那一段你已经走完了——牌面能看得到。{cardJourney}{mainCardInsight}现在不是要你"重新开始"，而是让你慢慢坐起来，看看周围。阳光没有离开，只是你刚才在隧道里。{adviceHint}',
              en: '{domainFrame}, the hardest part — you have already walked through it; the cards can see that. {cardJourney}{mainCardInsight}Now is not about asking you to "start over," but about slowly sitting up and looking around. The sun never left — you were just in the tunnel. {adviceHint}'
            }
          ]
        },
        neutral: {
          single: [
            {
              zh: '{domainFrame}，此刻的能量是平稳的——没有大起大落，但有机缘在悄悄生长。{mainCardInsight}{reversalNote}平稳不等于无聊，它是让你有机会看清楚自己真正想要什么。{adviceHint}',
              en: '{domainFrame}, the energy right now is steady — no dramatic highs or lows, but something is quietly growing. {mainCardInsight}{reversalNote}Steady does not mean boring; it means you have a chance to see clearly what you truly want. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面看到的是一段"正在沉淀"的时期。{mainCardInsight}感情的事有时候不需要推动——它需要的是观察和感受。看清楚了，下一步自然就有了。{adviceHint}',
              en: '{keywordEcho}, what the cards see is a period of "settling." {mainCardInsight}Matters of the heart sometimes don\'t need pushing — they need observing and feeling. Once you see clearly, the next step emerges on its own. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{domainFrame}，这张牌是一面镜子——它不替你决定什么，但它让你看清自己现在的样子。{reversalNote}看清，往往比急着行动更有力量。{adviceHint}',
              en: '{mainCardInsight}{domainFrame}, this card is a mirror — it doesn\'t decide anything for you, but it lets you see yourself as you are right now. {reversalNote}Seeing clearly is often more powerful than rushing to act. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，牌面铺开的是一张缓缓展开的图。{mainCardInsight}{cardJourney}不是每段感情都需要"结论"——有时候它需要的是一双安静注视的眼睛。{adviceHint}',
              en: '{domainFrame}, the cards have laid out a picture that unfolds slowly. {mainCardInsight}{cardJourney}Not every relationship needs a "conclusion" — sometimes it just needs a pair of quietly watching eyes. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面在讲一个关于"节奏"的故事。{mainCardInsight}{cardJourney}{reversalNote}你的心知道什么时候该快、什么时候该慢——牌面只是帮你在旁边标注了几个路标。{adviceHint}',
              en: '{keywordEcho}, the cards are telling a story about rhythm. {mainCardInsight}{cardJourney}{reversalNote}Your heart knows when to speed up and when to slow down — the cards have only placed a few signposts along the way. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，这段关系有它自己的生命力——你不必替它呼吸，但你可以为它浇水。观察它怎么长，比指挥它怎么长要智慧得多。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, this connection has its own life force — you don\'t need to breathe for it, but you can water it. Watching how it grows is far wiser than commanding how it should grow. {adviceHint}'
            }
          ]
        }
      },
    
      career: {
        anxious: {
          single: [
            {
              zh: '{keywordEcho}，你的焦虑牌面读到了——它跟"能力"没关系，跟"在意"有关系。{mainCardInsight}{domainFrame}，在乎自己做的事是好是坏的人，才会紧张。{reversalNote}{adviceHint}',
              en: '{keywordEcho}, the cards read your anxiety — it has nothing to do with "ability" and everything to do with "caring." {mainCardInsight}{domainFrame}, only people who care about whether they do good work get nervous. {reversalNote}{adviceHint}'
            },
            {
              zh: '{domainFrame}，有些不确定的阶段是必要的——就像飞机穿过云层时的颠簸，不代表航线错了。{mainCardInsight}{reversalNote}你正在穿过一段"看不清"的时期，但方向是对的。{adviceHint}',
              en: '{domainFrame}, some periods of uncertainty are necessary — like turbulence when a plane passes through clouds; it doesn\'t mean the route is wrong. {mainCardInsight}{reversalNote}You are passing through a stretch of low visibility, but your heading is true. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}牌面指出的东西可能跟你担心的事情不完全一样——请仔细听。{keywordEcho}，有时候我们焦虑的只是焦虑本身，而不是事情。{domainFrame}，把事情和情绪分开看，牌面在帮你做这件事。{adviceHint}',
              en: '{mainCardInsight}What the cards are pointing to may not be exactly what you\'re worried about — listen carefully. {keywordEcho}, sometimes we are anxious about the anxiety itself, not the situation. {domainFrame}, separate the situation from the emotion; the cards are helping you do exactly that. {adviceHint}'
            },
            {
              zh: '{reversalNote}{mainCardInsight}{domainFrame}，工作上的风暴来的时候，最重要的是站住，不是跑。你站住了——牌面看到你还在岗位上、还在思考、还在找方向，这本身就是一种力量。{adviceHint}',
              en: '{reversalNote}{mainCardInsight}{domainFrame}, when a storm comes through your work life, the most important thing is to stand firm, not to run. And you have stood firm — the cards see you still at your post, still thinking, still seeking direction. That itself is a form of strength. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面看到了你肩上的重量。{domainFrame}{mainCardInsight}你不是不够好——你只是对自己要求太高，高到忘了回头看已经走了多远。{reversalNote}{adviceHint}',
              en: '{keywordEcho}, the cards see the weight on your shoulders. {domainFrame}{mainCardInsight}You are not inadequate — you simply hold yourself to a standard so high that you forget to look back at how far you\'ve already come. {reversalNote}{adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面把这几张铺开之后，路线其实比你想的清晰。{domainFrame}{mainCardInsight}{cardJourney}你的职业直觉不差——它只是在嘈杂中被淹没了。牌面帮你把音量调对。{adviceHint}',
              en: '{keywordEcho}, with these cards laid out, the route is actually clearer than you think. {domainFrame}{mainCardInsight}{cardJourney}Your professional instincts are not off — they\'ve just been drowned out by the noise. The cards are helping you find the right volume. {adviceHint}'
            },
            {
              zh: '{domainFrame}，站在十字路口的感觉不好受——牌面知道。{mainCardInsight}{cardJourney}{reversalNote}你不必在今天决定整个职业生涯的方向。牌面只是说：接下来这一步，往这边走。{adviceHint}',
              en: '{domainFrame}, standing at a crossroads is not a pleasant feeling — the cards know that. {mainCardInsight}{cardJourney}{reversalNote}You don\'t need to decide the direction of your entire career today. The cards are only saying: the next step, go this way. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{keywordEcho}——这些信号不是来吓你的，是来提醒你的。{domainFrame}，焦虑有时候是一个很尽责的哨兵，但它不一定认得清敌人和路人。牌面在帮你重新校准。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{keywordEcho} — these signals are not here to frighten you; they are here to alert you. {domainFrame}, anxiety is sometimes a very dutiful sentry, but it can\'t always tell an enemy from a passerby. The cards are helping you recalibrate. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你害怕的"掉队"可能根本不存在——你只是在走一条跟别人不一样的路。{cardJourney}{mainCardInsight}{reversalNote}不一样的路上有不同的风景，牌面看到了一些别人看不到的东西在你前方。{adviceHint}',
              en: '{domainFrame}, the "falling behind" you fear may not even exist — you are simply walking a path different from others. {cardJourney}{mainCardInsight}{reversalNote}A different path has different scenery, and the cards see things ahead of you that others cannot. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面没有回避你担心的问题，但它给出了一个比你预期更宽的视角。{cardJourney}{mainCardInsight}{reversalNote}你不是在走下坡路——你是在转弯。转弯的时候感觉像失控，但其实你手在方向盘上。{adviceHint}',
              en: '{keywordEcho}, the cards haven\'t sidestepped the issue you\'re worried about, but they\'ve offered a wider perspective than you expected. {cardJourney}{mainCardInsight}{reversalNote}You are not on a downward slope — you are making a turn. Turning feels like losing control, but your hands are actually on the wheel. {adviceHint}'
            }
          ]
        },
        hopeful: {
          single: [
            {
              zh: '{domainFrame}，牌面看到了一扇正在打开的门——不是"可能"打开，是"正在"打开。{mainCardInsight}你的努力没有被忽略，那些加班、那些反复修改、那些咬牙坚持的时刻，牌面都看到了。{adviceHint}',
              en: '{domainFrame}, the cards see a door opening — not "might" open, but "is" opening. {mainCardInsight}Your efforts have not gone unnoticed; the late nights, the revisions, the moments of gritting your teeth and pushing through — the cards see them all. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面的回应是温暖的、有分量的。{mainCardInsight}{domainFrame}，你的价值正在被看到——可能不是立刻，但方向是对的，气流是顺的。{adviceHint}',
              en: '{keywordEcho}, the cards\' response is warm and carries weight. {mainCardInsight}{domainFrame}, your value is being recognized — maybe not instantly, but the direction is right and the currents are favorable. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这是牌面给出的确认。{domainFrame}，有时候好消息来之前是安静的——安静不是没动静，是蓄力。你已经在正确的跑道上，保持你的航向。{adviceHint}',
              en: '{mainCardInsight}This is the confirmation the cards offer. {domainFrame}, sometimes good news is quiet before it arrives — quiet doesn\'t mean nothing is happening; it means energy is gathering. You are on the right runway; maintain your heading. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你的成长不是"突然"发生的——它是一点一点累积到现在，刚好到了能被看到的阶段。{mainCardInsight}不要因为还没拿到结果就否定过程。过程已经在说话了。{adviceHint}',
              en: '{domainFrame}, your growth did not happen "suddenly" — it accumulated bit by bit until it reached the stage where it can now be seen. {mainCardInsight}Don\'t dismiss the process just because the outcome hasn\'t arrived yet. The process is already speaking. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，牌面展开的画面是流动的——不是在"等"什么，而是在"往"一个方向走。{mainCardInsight}{cardJourney}你对工作的热情不是盲目的——牌面看到它是有根基的、有方向的。{adviceHint}',
              en: '{domainFrame}, the picture the cards unfold is in motion — not "waiting" for something, but "heading" somewhere. {mainCardInsight}{cardJourney}Your passion for your work is not blind — the cards see that it has roots and direction. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面给了你一个值得认真对待的积极信号。{mainCardInsight}{cardJourney}职业上的好消息往往不是"中彩票"那种——它是一种慢慢变成现实的"对的方向"。{adviceHint}',
              en: '{keywordEcho}, the cards have given you a positive signal worth taking seriously. {mainCardInsight}{cardJourney}Good news in your career is rarely the "lottery win" kind — it\'s the kind that slowly materializes as "the right direction." {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，你之前种下的东西正在发芽——不是一夜之间长成大树，但根已经扎下去了。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, what you planted before is now sprouting — not an overnight tree, but the roots have taken hold. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你的能力正在被重新评估——而且评估的方向是往上走的。{cardJourney}{mainCardInsight}不要因为谦虚而低估了自己正在上升的轨迹。牌面觉得你应该知道这件事。{adviceHint}',
              en: '{domainFrame}, your abilities are being reassessed — and the trajectory is upward. {cardJourney}{mainCardInsight}Don\'t underestimate your rising path out of modesty. The cards think you should know this. {adviceHint}'
            }
          ]
        },
        confused: {
          single: [
            {
              zh: '{keywordEcho}，站在岔路口的感觉牌面看到了。{domainFrame}{mainCardInsight}你不是不知道往哪走——你是在两个（或更多）"对"的选项之间卡住了。牌面帮你掂一掂轻重。{adviceHint}',
              en: '{keywordEcho}, the cards see you standing at the fork. {domainFrame}{mainCardInsight}You do know where to go — you\'re stuck between two (or more) "right" options. The cards are helping you weigh them. {adviceHint}'
            },
            {
              zh: '{domainFrame}，信息太多的时候，我们需要往回退一步——退到"我到底要什么"这个原点。{mainCardInsight}{reversalNote}牌面在帮你做减法，减掉那些别人的期待、社会的标准，剩下你自己的声音。{adviceHint}',
              en: '{domainFrame}, when there\'s too much information, we need to step back — back to the origin point of "what do I actually want?" {mainCardInsight}{reversalNote}The cards are helping you subtract: subtract others\' expectations, subtract society\'s standards, and what remains is your own voice. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这是牌面给你切出的核心线索。{keywordEcho}，职业上的迷茫期不是浪费——它是你在重新校准自己的价值观。{domainFrame}，迷茫的人往往比"很清楚"的人更接近真实的自己。{adviceHint}',
              en: '{mainCardInsight}This is the core clue the cards have cut for you. {keywordEcho}, a period of career confusion is not a waste — it\'s you recalibrating your values. {domainFrame}, those who are confused are often closer to their true selves than those who are "very clear." {adviceHint}'
            },
            {
              zh: '{domainFrame}，你不需要在今天就选出一条"完美的路"。{keywordEcho}{mainCardInsight}{reversalNote}牌面建议你先选一个"值得试一下的方向"，走几步看看。路是在走的过程中变清楚的。{adviceHint}',
              en: '{domainFrame}, you don\'t need to pick a "perfect path" today. {keywordEcho}{mainCardInsight}{reversalNote}The cards suggest you pick a "direction worth trying," take a few steps, and see. The path becomes clearer in the walking. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面把你心里那团乱的线一根一根抽出来看了。{domainFrame}{mainCardInsight}{cardJourney}你不是"没有方向"——你是有太多方向，每个都有一点道理。牌面在帮你排序。{adviceHint}',
              en: '{keywordEcho}, the cards have pulled out each tangled thread from your heart and looked at them one by one. {domainFrame}{mainCardInsight}{cardJourney}You don\'t "lack direction" — you have too many directions, each with a bit of logic. The cards are helping you sort them. {adviceHint}'
            },
            {
              zh: '{domainFrame}，职业选择最难的地方是：每个选项都有"对的"部分，也有"不对"的部分。{mainCardInsight}{cardJourney}{reversalNote}牌面没有替你选——它帮你看清每个选项的"重量"，然后你自己掂。{adviceHint}',
              en: '{domainFrame}, the hardest part of career choices is that every option has a "right" part and a "not right" part. {mainCardInsight}{cardJourney}{reversalNote}The cards haven\'t chosen for you — they\'ve helped you see the "weight" of each option, and the weighing is yours. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{keywordEcho}——你看，这些路线牌面都帮你标出来了。{domainFrame}，"选不出来"的时候，往往是因为你把两个完全不同的东西放在同一个秤上比。牌面帮你分开称。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{keywordEcho} — see, the cards have marked out all these routes for you. {domainFrame}, when you "can\'t choose," it\'s often because you\'re weighing two completely different things on the same scale. The cards are helping you weigh them separately. {adviceHint}'
            },
            {
              zh: '{domainFrame}，迷雾不是你的敌人——它是逼你慢下来、看清楚再走的自然机制。{cardJourney}{mainCardInsight}{reversalNote}慢下来之后你会发现，有些选项根本不是你真正想要的，只是你以前来不及细想。{adviceHint}',
              en: '{domainFrame}, the fog is not your enemy — it\'s a natural mechanism that forces you to slow down and see clearly before moving. {cardJourney}{mainCardInsight}{reversalNote}Once you slow down, you\'ll find that some options were never really what you wanted — you just hadn\'t had time to think them through before. {adviceHint}'
            }
          ]
        },
        neutral: {
          single: [
            {
              zh: '{domainFrame}，此刻的牌面是平稳的、观察性的。{mainCardInsight}这不是"没有事情发生"——这是"事情在你看不到的地方稳步推进"。保持你的节奏就好。{adviceHint}',
              en: '{domainFrame}, the cards right now are steady and observational. {mainCardInsight}This is not "nothing is happening" — this is "things are progressing steadily where you can\'t yet see." Keep your rhythm. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面给出的是一张"当下状态"的快照——不煽动、也不安慰，只是如实呈现。{mainCardInsight}在职场里，能看清现状本身就是一种稀缺的能力。{adviceHint}',
              en: '{keywordEcho}, the cards offer a snapshot of your "current state" — not agitating, not comforting, just presenting things as they are. {mainCardInsight}In the workplace, being able to see things clearly is itself a rare ability. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{domainFrame}，有些阶段不需要做重大决定——它需要的是"维护"和"观察"。不是每个季节都是播种季或收获季，有些季节就是用来生长的。{adviceHint}',
              en: '{mainCardInsight}{domainFrame}, some phases don\'t need major decisions — they need "maintenance" and "observation." Not every season is for planting or harvesting; some seasons are simply for growing. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，牌面铺出的是一张"进行中"的地图。{mainCardInsight}{cardJourney}你不是卡住了——你是在一个需要稳扎稳打的阶段。稳，不是慢，是每一步都踩实。{adviceHint}',
              en: '{domainFrame}, the cards have laid out an "in progress" map. {mainCardInsight}{cardJourney}You are not stuck — you are in a phase that calls for steady, solid steps. Steady is not slow; it means every step lands firmly. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面讲的是一个"持续建设"的故事。{mainCardInsight}{cardJourney}职业发展不是冲刺——是长跑。你现在呼吸均匀、脚步不乱，这就是最好的状态。{adviceHint}',
              en: '{keywordEcho}, the cards are telling a story of "sustained building." {mainCardInsight}{cardJourney}Career development is not a sprint — it\'s a long-distance run. Your breathing is steady and your pace is even; this is the best state to be in. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，你的职业轨迹有自己的逻辑——不需要跟任何人比。牌面看到的是一条"属于你自己的上升曲线"，它不陡，但它是持续往上走的。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, your career trajectory has its own logic — it doesn\'t need to be compared to anyone else\'s. The cards see an "upward curve that belongs to you" — not steep, but consistently rising. {adviceHint}'
            }
          ]
        }
      },
    
      wealth: {
        anxious: {
          single: [
            {
              zh: '{keywordEcho}，钱的事压在心上确实重——牌面不跟你绕弯子。{mainCardInsight}{domainFrame}，紧张是正常的，但恐慌不是——恐慌会挡住你本来能看到的出路。先深呼吸，再看牌面怎么说的。{adviceHint}',
              en: '{keywordEcho}, money troubles do sit heavy on the heart — the cards won\'t dance around that. {mainCardInsight}{domainFrame}, stress is normal, but panic is not — panic blocks the exits you would otherwise be able to see. Take a breath first, then see what the cards have to say. {adviceHint}'
            },
            {
              zh: '{domainFrame}，财富的流向跟水一样——它不会永远在一个地方，也不会永远离开。{mainCardInsight}{reversalNote}你现在的紧张说明你对"安全感"有意识，这是个好信号。接下来看牌面怎么调整你的方向。{adviceHint}',
              en: '{domainFrame}, the flow of wealth is like water — it doesn\'t stay in one place forever, and it doesn\'t leave forever either. {mainCardInsight}{reversalNote}Your current stress shows you are conscious of "security," which is a good signal. Now let\'s see how the cards adjust your direction. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这是牌面对你财务状况的核心判断。{keywordEcho}，你担心的那些事情里，有一些是真实的信号，有一些只是焦虑的投影。牌面帮你分开这两样。{adviceHint}',
              en: '{mainCardInsight}This is the cards\' core assessment of your financial situation. {keywordEcho}, among the things you\'re worried about, some are real signals, and some are just projections of anxiety. The cards are helping you separate the two. {adviceHint}'
            },
            {
              zh: '{reversalNote}{mainCardInsight}{domainFrame}，财务紧张的时候，最重要的是止住"恐慌性决策"——人在怕的时候做的决定，往往是亏得最多的。牌面帮你把情绪挪开一点，看清楚数字背后的东西。{adviceHint}',
              en: '{reversalNote}{mainCardInsight}{domainFrame}, when finances are tight, the most important thing is to stop "panic decisions" — decisions made in fear are often the most costly. The cards are helping you shift the emotion aside just enough to see what\'s behind the numbers. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面看到你的财务状况正在经历一段"需要重新整理"的时期。{mainCardInsight}{cardJourney}{domainFrame}，整理不等于崩盘——它只是把每样东西放回它该在的地方。{adviceHint}',
              en: '{keywordEcho}, the cards see that your finances are going through a period that "needs reorganizing." {mainCardInsight}{cardJourney}{domainFrame}, reorganizing is not the same as collapsing — it\'s just putting everything back where it belongs. {adviceHint}'
            },
            {
              zh: '{domainFrame}，钱的焦虑常常不是"不够"——是"不确定"。{mainCardInsight}{cardJourney}{reversalNote}牌面帮你把"不确定"变成"可以一件一件处理的事情"。能处理的，就没那么可怕。{adviceHint}',
              en: '{domainFrame}, money anxiety is often not about "not enough" — it\'s about "uncertainty." {mainCardInsight}{cardJourney}{reversalNote}The cards are helping turn "uncertainty" into "things that can be dealt with one at a time." What can be dealt with is far less frightening. {adviceHint}'
            },
            {
              zh: '{cardJourney}{mainCardInsight}{keywordEcho}——你看，进出的流向牌面都展示出来了。{domainFrame}，你不是在"亏空"里，你是在"调整期"里。这两个词的区别，牌面希望你分清楚。{adviceHint}',
              en: '{cardJourney}{mainCardInsight}{keywordEcho} — see, the cards have shown you the flow in and out. {domainFrame}, you are not in "deficit"; you are in an "adjustment period." The cards want you to understand the difference between these two words. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你的财富故事还没有写到转折那一章——但转折在前面，不是在后头。{mainCardInsight}{cardJourney}{reversalNote}守住现在的底线，同时留心牌面指出的新方向。{adviceHint}',
              en: '{domainFrame}, your wealth story hasn\'t reached the turning chapter yet — but the turn is ahead, not behind. {mainCardInsight}{cardJourney}{reversalNote}Hold your current baseline while keeping an eye on the new directions the cards are pointing to. {adviceHint}'
            }
          ]
        },
        hopeful: {
          single: [
            {
              zh: '{domainFrame}，牌面看到了流动的迹象——不是"暴富"那种，是"缓缓回温"那种。{mainCardInsight}你的财务状况正在从"紧张"转向"稳定"，这个过程值得被注意到。{adviceHint}',
              en: '{domainFrame}, the cards see signs of movement — not the "sudden riches" kind, but the "slowly warming up" kind. {mainCardInsight}Your financial situation is shifting from "tight" to "stable," and this process is worth noticing. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面对你的财务走向是温和看好的。{mainCardInsight}{domainFrame}，钱的事跟心态有非常直接的关系——你心态在转好，流向就会跟着转。{adviceHint}',
              en: '{keywordEcho}, the cards are gently optimistic about your financial direction. {mainCardInsight}{domainFrame}, money matters have a very direct relationship with mindset — as your mindset improves, the flow follows. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这个信号值得认真听。{domainFrame}，财富的积累有时候不是靠"多挣"，而是靠"堵住漏的地方"。牌面看到你有能力把漏洞补上。{adviceHint}',
              en: '{mainCardInsight}This signal is worth listening to carefully. {domainFrame}, wealth accumulation is sometimes not about "earning more" but about "plugging the leaks." The cards see that you have the ability to seal those leaks. {adviceHint}'
            },
            {
              zh: '{domainFrame}，安全感的建立是一层一层叠上去的——不是忽然就有了一座山。{mainCardInsight}你现在叠的每一层，牌面都看到了。不要嫌慢——叠得慢的才结实。{adviceHint}',
              en: '{domainFrame}, security is built layer by layer — a mountain does not appear all at once. {mainCardInsight}The cards see every layer you are laying down now. Don\'t resent the slowness — what is laid slowly is laid solidly. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，牌面展开的是一幅"渐入佳境"的画面。{mainCardInsight}{cardJourney}财富的增长有自己的节奏——它不跟你急，你也别跟它急。方向是对的，就继续走。{adviceHint}',
              en: '{domainFrame}, the cards have unfolded a picture of "gradually entering better territory." {mainCardInsight}{cardJourney}Wealth growth has its own rhythm — it\'s not rushing you, so don\'t rush it. If the direction is right, keep walking. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面的态度是"谨慎乐观"——不是画大饼，是真看到了有利的变化。{mainCardInsight}{cardJourney}你之前的一些决定，牌面看到它们的果实正在路上。不是什么洪流，但会是一股持续的水流。{adviceHint}',
              en: '{keywordEcho}, the cards\' stance is "cautious optimism" — not painting rosy fantasies, but genuinely seeing favorable shifts. {mainCardInsight}{cardJourney}Some of your earlier decisions — the cards see their fruits on the way. Not a flood, but a steady stream. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，你正在建立一个更健康的"财富关系"——不只是数字，是你跟钱之间的相处方式。这个关系理顺了，数字自然会跟上来。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, you are building a healthier "wealth relationship" — not just numbers, but the way you and money coexist. Once this relationship is sorted, the numbers will follow naturally. {adviceHint}'
            },
            {
              zh: '{domainFrame}，好运气不是天上掉下来的——它是你之前的"对的选择"累积到了能结果子的时候。{cardJourney}{mainCardInsight}牌面在帮你确认：你走在果实会来的那条路上。{adviceHint}',
              en: '{domainFrame}, good fortune doesn\'t fall from the sky — it\'s what happens when your earlier "right choices" accumulate to the point of bearing fruit. {cardJourney}{mainCardInsight}The cards are confirming: you are on the path where the fruit will come. {adviceHint}'
            }
          ]
        },
        neutral: {
          single: [
            {
              zh: '{domainFrame}，此刻的财务状况是"平稳运行"的状态。{mainCardInsight}平稳不是坏事——它给你空间去观察、去规划、去把基础打得更牢。{adviceHint}',
              en: '{domainFrame}, your financial state right now is one of "steady operation." {mainCardInsight}Steady is not bad — it gives you room to observe, to plan, and to strengthen the foundation. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面看到的是一个"可以观望和调整"的窗口期。{mainCardInsight}财富管理不需要时时刻刻做重大决定——有时候最好的策略就是继续你已经在做的事。{adviceHint}',
              en: '{keywordEcho}, the cards see a window period for "observing and adjusting." {mainCardInsight}Wealth management doesn\'t need major decisions at every moment — sometimes the best strategy is to keep doing what you\'re already doing. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{domainFrame}，金钱的流动有它的呼吸节奏——有进有出，不是每一刻都需要干预。现在的状态是健康的，保持觉察就好。{adviceHint}',
              en: '{mainCardInsight}{domainFrame}, the flow of money has its own breathing rhythm — in and out. Not every moment needs intervention. The current state is healthy; just stay aware. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，牌面铺出的是一条"有节奏的"财富路径——不是暴起暴落，是稳中有升。{mainCardInsight}{cardJourney}你对钱的态度在成熟，而这个成熟本身就是一种财富。{adviceHint}',
              en: '{domainFrame}, the cards have laid out a "rhythmic" wealth path — not wild swings, but steady with upward lean. {mainCardInsight}{cardJourney}Your attitude toward money is maturing, and that maturity itself is a form of wealth. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面在讲一个"持续经营"的故事。{mainCardInsight}{cardJourney}财富不是一场短跑，甚至不是一场长跑——它是一种生活方式。你现在的生活方式，方向是对的。{adviceHint}',
              en: '{keywordEcho}, the cards are telling a story of "sustained management." {mainCardInsight}{cardJourney}Wealth is not a sprint, not even a marathon — it\'s a way of life. And your current way of life is pointed in the right direction. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，你的财务直觉是可以信任的——它不激进，也不怯懦，它在中间那条"对的线"上。继续保持这种平衡。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, your financial instincts are trustworthy — neither aggressive nor timid, but on that middle "right line." Continue maintaining this balance. {adviceHint}'
            }
          ]
        }
      },
    
      study: {
        anxious: {
          single: [
            {
              zh: '{keywordEcho}，考试的压力牌面看到了——那种"脑子塞满但不知道考不考得到"的感觉，是最磨人的。{mainCardInsight}{domainFrame}，先跟你说一件重要的事：你的价值不等于你的分数。牌面在帮你，但你先要把这个等式拆掉。{adviceHint}',
              en: '{keywordEcho}, the cards see the pressure of exams — that feeling of "head stuffed full but no idea if it\'ll be on the test" is the most wearing kind. {mainCardInsight}{domainFrame}, let me tell you something important first: your worth does not equal your score. The cards are helping you, but you need to break that equation first. {adviceHint}'
            },
            {
              zh: '{domainFrame}，紧张到睡不着的时候，知识是不会进脑子的——这不是你的错，是生理机制。{mainCardInsight}{reversalNote}牌面建议你先处理状态，再处理内容。状态对了，学一小时顶焦虑状态的三小时。{adviceHint}',
              en: '{domainFrame}, when you\'re too anxious to sleep, knowledge won\'t enter your brain — this isn\'t your fault, it\'s biology. {mainCardInsight}{reversalNote}The cards suggest you address your state first, then the content. With the right state, one hour of study equals three hours of anxious study. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这是牌面对你学习状态的判断。{keywordEcho}，你担心的那个结果还没有发生——你现在能做的最有用的事，是把你已经会的东西巩固好，而不是去追那些"万一考到怎么办"的东西。{adviceHint}',
              en: '{mainCardInsight}This is the cards\' assessment of your study state. {keywordEcho}, the outcome you\'re worried about hasn\'t happened yet — the most useful thing you can do right now is solidify what you already know, rather than chasing every "what if it\'s on the test." {adviceHint}'
            },
            {
              zh: '{domainFrame}，学习焦虑的人有一个共同点——他们其实很认真。不认真的人是不会焦虑的。{keywordEcho}{mainCardInsight}你的认真牌面看到了，现在它要帮你把"认真"用在"对的地方"，而不是耗在"担心"上。{adviceHint}',
              en: '{domainFrame}, people with study anxiety share one trait — they are actually very diligent. People who don\'t care don\'t get anxious. {keywordEcho}{mainCardInsight}The cards see your diligence, and now they want to help you channel that diligence into "the right places" rather than burning it on "worry." {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面看到了你备考路上的每一个坎。{domainFrame}{mainCardInsight}{cardJourney}学习不是一条直线——它是有起伏的，有些阶段就是会卡住。卡住不等于退步，它有时候是知识在"整合"。{adviceHint}',
              en: '{keywordEcho}, the cards see every hurdle on your study journey. {domainFrame}{mainCardInsight}{cardJourney}Learning is not a straight line — it has its rises and falls, and some stages are simply stuck. Stuck does not mean regressing; sometimes it\'s knowledge "integrating." {adviceHint}'
            },
            {
              zh: '{domainFrame}，考试是一个节点，不是一个终点——牌面希望你记住这句话。{mainCardInsight}{cardJourney}{reversalNote}你过去的积累不会因为一次考试就被否定。牌面看到的东西比你担心的大得多、远得多。{adviceHint}',
              en: '{domainFrame}, an exam is a node, not an endpoint — the cards want you to remember this. {mainCardInsight}{cardJourney}{reversalNote}Your past accumulation will not be negated by a single test. What the cards see is much bigger and further-reaching than what you\'re worried about. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{keywordEcho}——你看，学习的路径牌面帮你画出来了。{domainFrame}，现在不是"全面进攻"的时候，是"重点防守加关键突破"的时候。把力气用在刀刃上。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{keywordEcho} — see, the cards have drawn your learning path for you. {domainFrame}, now is not the time for "all-out offense" but for "focused defense plus key breakthroughs." Put your energy where it counts most. {adviceHint}'
            },
            {
              zh: '{domainFrame}，心态是成绩的一半——这不是鸡汤，这是脑科学。{cardJourney}{mainCardInsight}{reversalNote}牌面在帮你调整心态：你已经做了你能做的准备，剩下的不是"能不能考好"，是"能不能在考场上把你会的东西发挥出来"。{adviceHint}',
              en: '{domainFrame}, mindset is half the grade — this is not platitude, this is brain science. {cardJourney}{mainCardInsight}{reversalNote}The cards are helping you adjust your mindset: you have prepared what you could; what remains is not "can I do well" but "can I bring out what I know on test day." {adviceHint}'
            }
          ]
        },
        hopeful: {
          single: [
            {
              zh: '{domainFrame}，牌面看到你的努力是有方向的、有积累的。{mainCardInsight}学习这件事最公平的地方就是——功夫下在哪里，哪里就会有回响。你的功夫没有白下。{adviceHint}',
              en: '{domainFrame}, the cards see that your efforts have direction and accumulation. {mainCardInsight}The fairest thing about learning is — wherever you put in the work, there will be an echo. Your work has not been wasted. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面的回应是肯定的、温暖的。{mainCardInsight}{domainFrame}，你正在一个"从量变到质变"的临界点上。可能你自己还没感觉到，但牌面感觉到了——那些知识点正在你脑子里自动连接起来。{adviceHint}',
              en: '{keywordEcho}, the cards\' response is affirming and warm. {mainCardInsight}{domainFrame}, you are at the tipping point of "quantitative change becoming qualitative change." You may not feel it yet, but the cards feel it — those bits of knowledge are connecting themselves in your mind. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这个信号是来给你信心的。{domainFrame}，学习是一条长长的坡道——有时候你看不到尽头，但你的速度一直在。保持住，你会比预期更早看到成果。{adviceHint}',
              en: '{mainCardInsight}This signal is here to give you confidence. {domainFrame}, learning is a long ramp — sometimes you can\'t see the end, but your speed is steady. Keep it up, and you\'ll see results sooner than expected. {adviceHint}'
            },
            {
              zh: '{domainFrame}，你的学习方法和节奏是适合你的——这一点牌面看到了。{mainCardInsight}不要因为别人的进度而怀疑自己的速度。你是你，你的路是你的路。{adviceHint}',
              en: '{domainFrame}, your study methods and pace suit you — the cards see this. {mainCardInsight}Don\'t doubt your own speed because of someone else\'s progress. You are you, and your path is your path. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，牌面展开的是一幅"持续积累、稳步上升"的画面。{mainCardInsight}{cardJourney}学习这件事最怕的不是"学不会"，是"不学了"。而你在路上，并且走得不错。{adviceHint}',
              en: '{domainFrame}, the cards have unfolded a picture of "steady accumulation, gradual rise." {mainCardInsight}{cardJourney}What\'s most feared in learning is not "can\'t learn" but "stopped learning." And you are on the path, and walking well. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面在告诉你：你的努力正在从"播种期"进入"生长期"。{mainCardInsight}{cardJourney}生长是需要时间的——你不能每天扒开土看根发了没有。但你浇的水、施的肥，土壤都记住了。{adviceHint}',
              en: '{keywordEcho}, the cards are telling you: your efforts are moving from "planting season" into "growing season." {mainCardInsight}{cardJourney}Growth takes time — you can\'t dig up the soil every day to check if roots have formed. But the water and nutrients you\'ve added — the soil remembers. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，你的学习有深度——不是"背下来"那种浅层的知道，是"真正理解"那种深层的掌握。这种深度会在关键时刻帮到你。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, your learning has depth — not the shallow kind of "memorized it," but the deep kind of "truly understood it." This depth will serve you at critical moments. {adviceHint}'
            },
            {
              zh: '{domainFrame}，好的学习状态不是"时时刻刻都在学"——是"学的时候专注，休息的时候真正休息"。{cardJourney}{mainCardInsight}牌面看到你在往这个方向调整，而且调得不错。{adviceHint}',
              en: '{domainFrame}, a good study state is not "studying every waking moment" — it\'s "focused when studying, truly resting when resting." {cardJourney}{mainCardInsight}The cards see you adjusting in this direction, and adjusting well. {adviceHint}'
            }
          ]
        },
        neutral: {
          single: [
            {
              zh: '{domainFrame}，此刻的学习状态是"正在进行中"——不焦虑，也不懈怠，是一个健康的中间态。{mainCardInsight}保持这个节奏就好。学习最好的状态就是这种"平和的专注"。{adviceHint}',
              en: '{domainFrame}, your study state right now is "in progress" — not anxious, not slack, a healthy middle state. {mainCardInsight}Keep this rhythm. The best state for learning is exactly this "calm focus." {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面看到的是一个需要"持续投入、保持耐心"的阶段。{mainCardInsight}学习没有捷径——但有好方法。你现在的方法是对的，坚持下去。{adviceHint}',
              en: '{keywordEcho}, the cards see a phase that calls for "sustained investment and patience." {mainCardInsight}There are no shortcuts in learning — but there are good methods. Your current method is sound; stick with it. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{domainFrame}，学习是给自己的一种长期投资——不像股票每天看涨跌，它更像种树，你要相信它在长，即使你每天看不到变化。{adviceHint}',
              en: '{mainCardInsight}{domainFrame}, learning is a long-term investment in yourself — not like checking stock prices daily; it\'s more like planting a tree. Trust that it\'s growing, even when you can\'t see the daily changes. {adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{domainFrame}，牌面铺出的是一条"踏实而稳定"的学习路径。{mainCardInsight}{cardJourney}你不是在冲刺，你是在建地基——地基越扎实，上面的楼层才能盖得越高。{adviceHint}',
              en: '{domainFrame}, the cards have laid out a "solid and steady" learning path. {mainCardInsight}{cardJourney}You are not sprinting; you are building a foundation — the more solid the foundation, the higher the floors above can go. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，牌面在讲一个"循序渐进"的故事。{mainCardInsight}{cardJourney}知识的积累就像滚雪球——开始的时候很慢、很小，但一旦核心形成了，它就开始自己滚大了。{adviceHint}',
              en: '{keywordEcho}, the cards are telling a story of "step by step." {mainCardInsight}{cardJourney}Knowledge accumulation is like a snowball — slow and small at first, but once the core forms, it starts rolling bigger on its own. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}{cardJourney}{domainFrame}，学习是唯一一件"别人抢不走"的事情。你每多懂一点，那个"一点"就永远是你的了。牌面看到你的累积正在形成一个完整的体系。{adviceHint}',
              en: '{mainCardInsight}{cardJourney}{domainFrame}, learning is the one thing "no one can take from you." Every bit more you understand, that bit is yours forever. The cards see your accumulation forming into a complete system. {adviceHint}'
            }
          ]
        }
      },
    
      destiny: {
        general: {
          single: [
            {
              zh: '{keywordEcho}，牌面对命运的提问从来不轻率回答——它给的不是"预言"，是一面镜子。{mainCardInsight}{domainFrame}，你问的问题很大，牌面的回应也不会小。仔细听。{adviceHint}',
              en: '{keywordEcho}, the cards never answer questions of destiny lightly — what they offer is not a "prediction" but a mirror. {mainCardInsight}{domainFrame}, the question you ask is big, and the cards\' response will not be small. Listen carefully. {adviceHint}'
            },
            {
              zh: '{domainFrame}，人问命运的时候，往往是因为走到了一个需要"意义"的路口——不是不知道路怎么走，是不知道为什么走。{mainCardInsight}{reversalNote}牌面不会替你回答"为什么"，但它会让你看到你已经在路上留下了什么痕迹。{adviceHint}',
              en: '{domainFrame}, when people ask about destiny, it\'s usually because they\'ve arrived at a junction that demands "meaning" — not that they don\'t know which way to go, but they don\'t know why to go. {mainCardInsight}{reversalNote}The cards won\'t answer the "why" for you, but they will show you what traces you\'ve already left on the path. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这张牌是你命运故事里当下最重要的一页。{keywordEcho}，命运不是一个"写好的剧本"——它更像一条河，有流向，但你怎么划船是你的事。牌面帮你看到流向。{adviceHint}',
              en: '{mainCardInsight}This card is the most important page in your destiny story right now. {keywordEcho}, destiny is not a "pre-written script" — it\'s more like a river with a current; how you steer the boat is up to you. The cards help you see the current. {adviceHint}'
            },
            {
              zh: '{domainFrame}，有时候我们需要把眼光拉远——远到能看见自己这一生大致的轮廓，然后再拉回来，看当下这一步。{reversalNote}{mainCardInsight}远看是方向，近看是脚步。两样你都需要。{adviceHint}',
              en: '{domainFrame}, sometimes we need to pull our gaze far back — far enough to see the broad outline of this life — and then pull it back to see this immediate step. {reversalNote}{mainCardInsight}From afar you see direction; up close you see footsteps. You need both. {adviceHint}'
            },
            {
              zh: '{keywordEcho}，你心里那个关于"我这一生到底要做什么"的声音，牌面听到了。{domainFrame}{mainCardInsight}答案不是一个名词——它是一个动词。不是"成为什么"，是"怎么去走"。{reversalNote}{adviceHint}',
              en: '{keywordEcho}, that voice inside you asking "what am I meant to do with this life" — the cards heard it. {domainFrame}{mainCardInsight}The answer is not a noun — it\'s a verb. Not "what to become," but "how to walk." {reversalNote}{adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，命运的问题牌面用了几张牌来回应——因为这个问题的重量，一张牌装不下。{domainFrame}{mainCardInsight}{cardJourney}你不是被命运推着走的人——你是有能力跟命运对话的人。牌面就是这场对话的翻译。{adviceHint}',
              en: '{keywordEcho}, the cards used several cards to answer your destiny question — because the weight of this question cannot fit in a single card. {domainFrame}{mainCardInsight}{cardJourney}You are not someone pushed along by fate — you are someone capable of conversing with it. The cards are the translator for this conversation. {adviceHint}'
            },
            {
              zh: '{domainFrame}，一个人的命运不是一条直线——它有很多章节、很多转折、很多看似无关却暗中相连的线索。{mainCardInsight}{cardJourney}{reversalNote}牌面帮你把这些线索串起来了，你可以清楚地看到：你是怎样一路走到这里的。{adviceHint}',
              en: '{domainFrame}, a person\'s destiny is not a straight line — it has many chapters, many turns, many threads that seem unrelated but are secretly connected. {mainCardInsight}{cardJourney}{reversalNote}The cards have strung these threads together for you; you can clearly see: this is how you walked all the way here. {adviceHint}'
            },
            {
              zh: '{cardJourney}{mainCardInsight}{keywordEcho}——这就是你的命运图景，不多不少，刚好是你正在活出来的样子。{domainFrame}，命运的智慧在于：它不告诉你会发生什么，它告诉你什么是重要的。{adviceHint}',
              en: '{cardJourney}{mainCardInsight}{keywordEcho} — this is the picture of your destiny, no more and no less than what you are living out right now. {domainFrame}, the wisdom of destiny is this: it doesn\'t tell you what will happen; it tells you what matters. {adviceHint}'
            },
            {
              zh: '{domainFrame}，牌面展开的不是"预言书"，是"航海图"。{mainCardInsight}{cardJourney}海上的天气会变，但你知道自己在哪片海域、往哪个方向航行——这比知道"明天会不会下雨"重要得多。{adviceHint}',
              en: '{domainFrame}, what the cards have unfolded is not a "book of prophecy" but a "nautical chart." {mainCardInsight}{cardJourney}The weather at sea will change, but knowing which waters you\'re in and which direction you\'re sailing — that matters far more than knowing "will it rain tomorrow." {adviceHint}'
            },
            {
              zh: '{reversalNote}{mainCardInsight}{cardJourney}{domainFrame}，命运从来不要求你"做对每一个选择"——它只要求你"对自己诚实"。你诚实地走到今天，牌面看到了，也尊重了。{adviceHint}',
              en: '{reversalNote}{mainCardInsight}{cardJourney}{domainFrame}, destiny never demands that you "make every choice right" — it only asks that you "be honest with yourself." You have walked to today with honesty; the cards see that and respect it. {adviceHint}'
            }
          ]
        }
      },
    
      general: {
        fallback: {
          single: [
            {
              zh: '{keywordEcho}，牌面已经给出了它的回应。{mainCardInsight}这不是一个模棱两可的答案——牌面在用自己的语言跟你说一件它认为重要的事。{reversalNote}{adviceHint}',
              en: '{keywordEcho}, the cards have given their response. {mainCardInsight}This is not a vague answer — the cards are speaking to you in their own language about something they consider important. {reversalNote}{adviceHint}'
            },
            {
              zh: '{domainFrame}，很多时候我们找牌面不是因为"不知道"，而是因为想找一个"确认"。{mainCardInsight}牌面给出的确认就在这里，你可以相信你看到的。{adviceHint}',
              en: '{domainFrame}, often we turn to the cards not because we "don\'t know" but because we want "confirmation." {mainCardInsight}The confirmation the cards offer is right here; you can trust what you see. {adviceHint}'
            },
            {
              zh: '{mainCardInsight}这是牌面为你抽出的核心信息。{keywordEcho}，牌面不会替你走路——但它会在路上给你一点光，让你看清楚脚下这一步。{reversalNote}{adviceHint}',
              en: '{mainCardInsight}This is the core message the cards have drawn for you. {keywordEcho}, the cards won\'t walk the path for you — but they will give you a bit of light along the way, so you can see this next step clearly. {reversalNote}{adviceHint}'
            }
          ],
          multi: [
            {
              zh: '{keywordEcho}，牌面已经把该说的都摊在桌面上了。{mainCardInsight}{cardJourney}你不是在黑暗中——你手里有了一张地图。地图不会替你走路，但它会让你知道：你不是在瞎走。{adviceHint}',
              en: '{keywordEcho}, the cards have laid out everything they need to say on the table. {mainCardInsight}{cardJourney}You are not in the dark — you now hold a map. The map won\'t walk for you, but it will let you know: you are not wandering blindly. {adviceHint}'
            },
            {
              zh: '{domainFrame}，牌面串联起来的这条线索，值得你花时间好好感受。{mainCardInsight}{cardJourney}{reversalNote}有些事情当时看不明白，回头看的时候才会发现——哦，原来每一件事都有它的位置。{adviceHint}',
              en: '{domainFrame}, this thread the cards have strung together is worth taking time to feel deeply. {mainCardInsight}{cardJourney}{reversalNote}Some things don\'t make sense in the moment; only when you look back do you realize — ah, everything had its place. {adviceHint}'
            },
            {
              zh: '{cardJourney}{mainCardInsight}{domainFrame}，牌面的智慧不在于"替你决定"，而在于"帮你看懂你本来就知道、但一直不太确定的东西"。{reversalNote}{adviceHint}',
              en: '{cardJourney}{mainCardInsight}{domainFrame}, the wisdom of the cards is not in "deciding for you" but in "helping you understand what you already knew but were never quite sure of." {reversalNote}{adviceHint}'
            }
          ]
        }
      }
    },

    // ── Core conflict frames (24 types) ──
    CONFLICT_FRAMES: {
    relationship_deterioration: {
      zh: '你知道这段关系出了问题，但不知道该修、该等、还是该走。',
      en: "You know something's wrong in this relationship, but you don't know whether to fix it, wait it out, or walk away."
    },
    decision_paralysis: {
      zh: '两个选项在心里反复拉扯，每一个都有放不下的理由，于是你停在原地。',
      en: 'Two options keep pulling at your heart — each has reasons you can\'t let go of, so you stay stuck in place.'
    },
    career_uncertainty: {
      zh: '你站在路口，不知道继续走下去还是换一条路——两条路都看不清尽头。',
      en: 'You\'re at a crossroads, unsure whether to keep going or switch paths — and neither road shows where it leads.'
    },
    hope_vs_reality: {
      zh: '你心里有个很想相信的东西，但现实一遍遍泼冷水，你累了。',
      en: 'There\'s something you desperately want to believe in, but reality keeps pouring cold water on it — and you\'re tired.'
    },
    self_worth_doubt: {
      zh: '你觉得自己不够好——但这个感觉不是事实，它只是你重复了太多次的话。',
      en: 'You feel like you\'re not good enough — but this feeling isn\'t the truth, it\'s just a line you\'ve repeated too many times.'
    },
    financial_pressure: {
      zh: '钱的问题压在心口，不只是数字的压力，更是对未来的不安。',
      en: 'Money troubles sit heavy on your chest — it\'s not just the numbers, it\'s the anxiety about what comes next.'
    },
    academic_burnout: {
      zh: '你学得很累，但更累的是不确定这一切努力到底值不值得。',
      en: 'You\'re exhausted from studying, but what drains you more is not knowing if any of this hard work is worth it.'
    },
    loneliness: {
      zh: '身边有人，但心里是空的。你想被理解，却又不知道该怎么开口。',
      en: 'People are around you, but inside feels hollow. You want to be understood, yet you don\'t know how to start the conversation.'
    },
    betrayal_recovery: {
      zh: '信任碎了一地，你蹲在那里一边捡一边问自己：还能拼回去吗？',
      en: 'Trust shattered on the ground. You\'re picking up the pieces, asking yourself: can this ever be put back together?'
    },
    identity_crisis: {
      zh: '你突然不认识自己了——过去的你、现在的你、想成为的你，三个影子在打架。',
      en: 'You suddenly don\'t recognize yourself — your past self, present self, and the person you want to become are all at war.'
    },
    family_conflict: {
      zh: '血缘是最复杂的关系——爱和责任搅在一起，你不知道该成全谁。',
      en: 'Blood ties are the most complicated bond — love and obligation tangled up, and you don\'t know whose needs to honor first.'
    },
    grief: {
      zh: '那个人或那个东西不在了，但心的重量一点没轻。你不需要"振作起来"，你只需要时间。',
      en: 'That person or thing is gone, but the weight on your heart hasn\'t lifted at all. You don\'t need to "cheer up" — you just need time.'
    },
    jealousy: {
      zh: '你看着别人拥有的，心里又酸又苦，然后转头责怪自己不该这样想。',
      en: 'You look at what others have, feeling sour and bitter — then you turn around and blame yourself for feeling that way.'
    },
    stagnation: {
      zh: '日子像卡住的磁带，重复、循环、没有进展。你怕自己就这样"定住了"。',
      en: 'Life feels like a stuck tape loop — repeating, cycling, going nowhere. You\'re afraid you might just stay "stuck" like this forever.'
    },
    fear_of_commitment: {
      zh: '不是不想，是不敢。你怕一旦选择，就失去了其他所有的可能。',
      en: 'It\'s not that you don\'t want to — you don\'t dare. You\'re afraid that once you choose, you\'ll lose every other possibility.'
    },
    imposter_syndrome: {
      zh: '你做到了，但你不信。你总觉得别人早晚会发现你"其实没那么厉害"。',
      en: 'You made it, but you don\'t believe it. Deep down you feel like people will eventually discover you\'re "not really that good."'
    },
    transition_anxiety: {
      zh: '旧的生活已经回不去了，新的还没到——你悬在中间，脚不着地。',
      en: 'The old life is already behind you, the new one hasn\'t arrived yet — and you\'re suspended in between, with nothing solid under your feet.'
    },
    unrequited: {
      zh: '你捧着一颗心，对方却没伸手接。最难的不是被拒绝，是不知道要不要继续等。',
      en: 'You\'re holding out your heart, but their hands aren\'t reaching for it. The hardest part isn\'t the rejection — it\'s not knowing whether you should keep waiting.'
    },
    burnout: {
      zh: '你不是懒，你是被掏空了。那种"动不起来了"的感觉，不是意志力的问题。',
      en: 'You\'re not lazy — you\'re emptied out. That "I just can\'t move anymore" feeling isn\'t a willpower problem.'
    },
    comparison: {
      zh: '你拿自己的幕后花絮去比别人的精选集，然后觉得自己输了——这公平吗？',
      en: 'You\'re comparing your behind-the-scenes footage to everyone else\'s highlight reel, then feeling like you lost — is that really fair?'
    },
    creative_block: {
      zh: '脑子里有一团雾，想法就在雾后面，但你伸手抓不到。',
      en: 'There\'s a fog in your mind, and the ideas are right behind it — but every time you reach for them, your hand comes back empty.'
    },
    trust_issue: {
      zh: '你不是不想信，是你以前信过，然后被伤得不轻。现在的防线是那时候建起来的。',
      en: 'It\'s not that you don\'t want to trust — you trusted before, and got deeply hurt for it. The walls you have now were built back then.'
    },
    regret: {
      zh: '你反复回到那个路口，想象如果选了另一条路会怎样——但那个路口已经在你身后了。',
      en: 'You keep going back to that intersection, imagining what would have happened if you\'d taken the other road — but that crossroads is already behind you.'
    },
    fear_of_failure: {
      zh: '你不是怕做不好，你是怕"做不好"这件事证明了你一直以来的担心——你确实不够格。',
      en: 'You\'re not afraid of failing — you\'re afraid that failing will prove what you\'ve been worried about all along: that you really aren\'t enough.'
    },
  },

    // ── Card personalities (78 cards × 3 domains) ──
    CARD_PERSONALITIES: {

    // ── MAJOR ARCANA (22) ──────────────────

    fool: {
      general: { zh: '它像个天真的孩子，一脚踩出去不管下面是路还是悬崖——但往往是路。', en: 'Like an innocent child stepping forward, not knowing if it\'s a path or a cliff — but it\'s usually a path.' },
      love: { zh: '它让你想起第一次喜欢一个人的样子：什么都不怕，什么都不想，纯得发光。', en: 'It reminds you of the first time you fell for someone: fearless, thoughtless, glowing with innocence.' },
      career: { zh: '它说：经验是好东西，但有时候"不懂"反而让你看到别人看不到的。', en: 'It says: experience is valuable, but sometimes not knowing lets you see what others miss.' },
    },

    magician: {
      general: { zh: '它像舞台上那个准备了十年的魔术师，手指一翻，世界就变了——你知道那不是魔法，是实力。', en: 'Like a magician who practiced for ten years backstage — one flick of the wrist and the world shifts. You know it\'s not magic, it\'s mastery.' },
      love: { zh: '它不劝你等待缘分，它让你把想法变成行动——想见的人就去见，想说的话就去说。', en: 'It doesn\'t tell you to wait for fate — it tells you to turn intention into action. Go see the person. Say the words.' },
      career: { zh: '你手里有工具，有才华，有资源。它问你：你还在等什么？', en: 'You have the tools, the talent, the resources. It asks: what are you still waiting for?' },
    },

    'high-priestess': {
      general: { zh: '她坐在两个世界之间，不说话，只是看着你。她知道的比你多，但她说：你自己来悟。', en: 'She sits between two worlds, silent, just watching you. She knows more than you do, but she says: figure it out yourself.' },
      love: { zh: '有些答案不在聊天记录里，不在对方的表情里——在你半夜睡不着时心里浮现的那个声音里。', en: 'Some answers aren\'t in the chat history, not in their expressions — they\'re in the voice that surfaces when you lie awake at night.' },
      career: { zh: '别急着问别人该怎么办。你最深的直觉已经在给你指路了，你只是还没静下来听。', en: 'Don\'t rush to ask others what to do. Your deepest intuition is already pointing the way — you just haven\'t been still enough to hear it.' },
    },

    empress: {
      general: { zh: '她像一个永远给你留一碗热汤的人，告诉你：你值得被滋养，你值得丰盛。', en: 'She\'s like someone who always saves you a bowl of hot soup, telling you: you deserve to be nourished, you deserve abundance.' },
      love: { zh: '爱不是换取，不是谈判。她就是那个"想要就给你"的大方，让人放松下来做自己。', en: 'Love isn\'t a trade, isn\'t a negotiation. She\'s that generous spirit that says "if I want to give, I give" — letting you relax and just be yourself.' },
      career: { zh: '创造力不是挤出来的，是养出来的。给自己一点空间、一点美、一点不赶时间的闲。', en: 'Creativity isn\'t squeezed out — it\'s nurtured. Give yourself some space, some beauty, some unhurried leisure.' },
    },

    emperor: {
      general: { zh: '他像你那个不怎么说话但什么事都安排妥帖的父亲。严厉，但你知道那个肩膀靠得住。', en: 'Like a father of few words who quietly takes care of everything. Stern, but you know that shoulder can be leaned on.' },
      love: { zh: '爱不只是心跳，也是承诺。他提醒你：浪漫很好，但"说了算数"才是关系的地基。', en: 'Love isn\'t just heartbeats — it\'s commitment. He reminds you: romance is great, but "meaning what you say" is the foundation of any relationship.' },
      career: { zh: '别飘了，该定下来的就定下来。规则不是束缚，是你自己给自己搭的屋顶。', en: 'Stop drifting — lock in what needs to be locked in. Rules aren\'t shackles, they\'re the roof you build over your own head.' },
    },

    hierophant: {
      general: { zh: '他像个教了很多年书的老师，说话慢条斯理。你嫌他老派，但后来发现那些道理是真的。', en: 'Like a teacher who\'s taught for decades, speaking slowly and deliberately. You found him old-fashioned — until you realized those truths were real.' },
      love: { zh: '有些爱不需要惊天动地。仪式感不是形式主义——是你在对对方说"我是认真的"。', en: 'Some love doesn\'t need fireworks. Ritual isn\'t empty formality — it\'s your way of saying "I\'m serious about you."' },
      career: { zh: '找个好师傅，尊重那些走过这条路的人。不用重新发明轮子。', en: 'Find a good mentor. Respect those who\'ve walked this road before you. No need to reinvent the wheel.' },
    },

    lovers: {
      general: { zh: '它像一面镜子，照出你心里早就知道的答案——你只是还不敢认。', en: 'It\'s like a mirror reflecting the answer your heart already knows — you just haven\'t dared to own it yet.' },
      love: { zh: '两个人站在一起很容易，两颗心在一起才叫选择。它问的是后者。', en: 'Two people standing together is easy. Two hearts truly together — that takes a choice. It\'s asking about the latter.' },
      career: { zh: '不是选左边还是右边，是选"你"还是"别人眼中的你"。这个选择比薪水数字重要得多。', en: 'It\'s not choosing left or right — it\'s choosing between "you" and "the you that others expect." That choice matters far more than any salary figure.' },
    },

    chariot: {
      general: { zh: '它像一个咬着牙往前冲的人，两只手拽着往不同方向跑的野兽。不服输，但也确实很累。', en: 'Like someone charging forward with gritted teeth, both hands pulling on wild beasts running opposite directions. Won\'t give up — but is genuinely exhausted.' },
      love: { zh: '两个人在拉扯，你自己也在拉扯。但你心里知道方向——方向盘在你手里。', en: 'Two people pulling, and you\'re pulling against yourself too. But you know the direction — the wheel is in your hands.' },
      career: { zh: '压力大到爆表，但终点线就在前面。现在不是怀疑的时候——是冲的时候。', en: 'The pressure is off the charts, but the finish line is right ahead. Now isn\'t the time for doubt — it\'s time to charge.' },
    },

    strength: {
      general: { zh: '她不是那个喊得最大声的人。她只是轻轻按住狮子的头，眼神平静——那比吼叫有用。', en: 'She\'s not the loudest one in the room. She just gently rests her hand on the lion\'s head, eyes calm — that works better than roaring.' },
      love: { zh: '真正的力量不是在争吵里赢，是在快要爆炸的时候还能按住自己说：我们好好说话。', en: 'Real strength isn\'t winning the argument — it\'s holding yourself back when you\'re about to explode and saying: let\'s talk this through properly.' },
      career: { zh: '不用跟谁刚正面。耐心和温柔也是一种力量——而且往往比你想象的更能成事。', en: 'No need to confront head-on. Patience and gentleness are also forms of strength — and they often get things done better than you\'d imagine.' },
    },

    hermit: {
      general: { zh: '他不合群不是因为他讨厌人，是因为他在找一样东西——那个东西，只有在安静的时候才出现。', en: 'He\'s not antisocial because he dislikes people — he\'s searching for something that only appears in the quiet.' },
      love: { zh: '有时候你需要离开人群、离开对方，才能想清楚自己到底是什么感觉。退一步，不是退场。', en: 'Sometimes you need to step away from the crowd — and from the other person — just to figure out what you actually feel. Taking a step back isn\'t the same as walking away.' },
      career: { zh: '别刷招聘网站了，也别刷别人的动态了。答案在你自己的节奏里，不在别人的进度条里。', en: 'Stop refreshing job boards and other people\'s updates. The answer is in your own rhythm, not in anyone else\'s progress bar.' },
    },

    'wheel-of-fortune': {
      general: { zh: '它像个站在轮盘旁边的侍者，微笑着告诉你：运气来了，但别问为什么——它就是来了。', en: 'Like an attendant standing by the roulette wheel, smiling as he tells you: luck is here. Don\'t ask why — it just is.' },
      love: { zh: '有些相遇就是没有理由的。你觉得是"命中注定"，其实只是时机刚好踩到了对的节拍上。', en: 'Some encounters have no reason. You think it\'s "destiny" — but really it\'s just timing landing on the right beat.' },
      career: { zh: '机会正在转过来。你不需要控制结果——你只需要在它经过你面前的时候伸手。', en: 'Opportunity is spinning toward you. You don\'t need to control the outcome — you just need to reach out when it passes in front of you.' },
    },

    justice: {
      general: { zh: '她手里拿着秤，不看人，只看因果。她不是冷酷——她只是在说：你做了什么，就会收到什么。', en: 'She holds a scale, looking at causes not faces. She isn\'t cold — she\'s just saying: what you put out will come back.' },
      love: { zh: '关系里没有谁"欠"谁——如果你一直在称重量，说明这段关系已经变成交易了。', en: 'In relationships, nobody "owes" anybody — if you\'re constantly weighing the balance, this relationship has already become a transaction.' },
      career: { zh: '你付出了多少、偷了多少懒，到最后都会在秤上。不过别怕——只要你在秤这头加码，秤会动的。', en: 'What you put in and where you cut corners — it all shows up on the scale eventually. Don\'t worry though — add weight to your side and the scale will move.' },
    },

    'hanged-man': {
      general: { zh: '他倒挂着，世界在他眼里颠倒了。别人觉得他奇怪，但他看到的风景确实不一样。', en: 'He hangs upside down, the world flipped in his eyes. People think he\'s strange, but the view really is different from where he\'s sitting.' },
      love: { zh: '停下追逐，停下猜测，停下把对方的每句话翻来覆去地分析。倒过来看一看，也许根本不是你想的那样。', en: 'Stop chasing, stop guessing, stop dissecting every word they said. Look at it upside down — maybe it\'s not at all what you thought.' },
      career: { zh: '你一直往前冲，也许该停一下了。不是放弃，是换个角度看——你那堵"死路"，换个方向可能是门。', en: 'You\'ve been charging forward — maybe it\'s time to pause. Not to quit, but to see from another angle. That "dead end" of yours might be a door from a different direction.' },
    },

    death: {
      general: { zh: '它走过来的时候，你知道有东西要走了。它不是残忍——它是在给你腾地方。', en: 'When it walks toward you, you know something is leaving. It\'s not cruelty — it\'s making room for you.' },
      love: { zh: '有些人的离开不是为了惩罚你，是为了让你不再被困在一段已经不呼吸的关系里。', en: 'Some people leave not to punish you, but to free you from a relationship that\'s already stopped breathing.' },
      career: { zh: '那个机会没了、那个计划黄了——深呼吸。旧的树不枯，下面那个新的种子发不了芽。', en: 'That opportunity fell through, that plan collapsed — take a deep breath. If the old tree doesn\'t wither, the new seed underneath can\'t sprout.' },
    },

    temperance: {
      general: { zh: '她像一个慢慢调酒的人，不紧不慢，这个加一点那个加一点——最后那杯东西就是刚刚好。', en: 'Like someone mixing a drink slowly — unhurried, a little of this, a little of that — until it tastes just right.' },
      love: { zh: '太快会烫着，太慢会凉掉。两个人的温度要调到一起才能喝。不急，慢慢来。', en: 'Too fast and you\'ll get burned, too slow and it goes cold. Two people\'s temperatures need to blend before you can drink. Take your time.' },
      career: { zh: '狂加班和彻底躺平之间有一条路。它不走极端，但走得稳。', en: 'There\'s a path between working yourself to death and completely giving up. It avoids extremes, but it\'s steady.' },
    },

    devil: {
      general: { zh: '它咧嘴一笑：你以为锁住你的是别人吗？看看自己手里的钥匙。', en: 'It grins: you think someone else locked you up? Look at the key in your own hand.' },
      love: { zh: '那种"离不开"的感觉——是爱，还是只是怕一个人？它让你区分这两样东西。', en: 'That "I can\'t leave" feeling — is it love, or just fear of being alone? It makes you tell the difference.' },
      career: { zh: '高薪、头衔、稳定——你是真的想要，还是只是不敢不要？', en: 'The high salary, the title, the stability — do you genuinely want them, or are you just afraid to not have them?' },
    },

    tower: {
      general: { zh: '它是一声雷，劈开你一直装作看不见的东西。疼，但亮了。', en: 'It\'s a thunderclap that splits open everything you\'ve been pretending not to see. It hurts — but now it\'s lit.' },
      love: { zh: '轰的一声，你以为坚固的东西塌了。但你在废墟里站起来之后发现：原来这个"塌掉的东西"早就有裂缝了。', en: 'Boom — what you thought was solid comes crashing down. But once you stand up in the rubble, you realize: this "solid thing" has been cracking for a long time.' },
      career: { zh: '被裁、失败、翻车——它来得又快又狠。但它清空的那块地上，能建的东西比原来大得多。', en: 'Laid off, failed, crashed — it comes fast and hard. But on the ground it clears, you can build something much bigger than what stood there before.' },
    },

    star: {
      general: { zh: '暴风雨终于停了。她赤脚踩在泥里，抬头看见云缝里的第一颗星——原来天没有塌。', en: 'The storm has finally passed. Barefoot in the mud, she looks up and sees the first star through a break in the clouds — the sky didn\'t fall after all.' },
      love: { zh: '上一段伤正在愈合。不是不疼了，是你能在疼的间隙里感到一点暖。爱还会来的。', en: 'The last wound is healing. It doesn\'t mean it stopped hurting — it means you can feel warmth in the gaps between the pain. Love will come again.' },
      career: { zh: '你累了很久了。现在你可以把水壶倒满，抬头看看天——下一步不需要马上知道。', en: 'You\'ve been tired for a long time. Now you can refill your pitcher and look up at the sky — you don\'t need to know the next step right away.' },
    },

    moon: {
      general: { zh: '月光下什么都变形了。只有一条小路隐隐约约——它说：我知道你怕，但你得走下去。', en: 'Under moonlight, everything distorts. Only a faint path is visible — it says: I know you\'re scared, but you have to keep walking.' },
      love: { zh: '你猜来猜去，满脑子是对方到底怎么想。但月亮的建议是：别相信半夜三点脑子里编的故事。', en: 'You keep guessing, your head full of what the other person might be thinking. But the Moon\'s advice is: don\'t trust the stories your 3 a.m. brain makes up.' },
      career: { zh: '前路看不清，信息不全，各种传言满天飞。这段路不好走，但它保证一件事：穿过这段雾，你就什么都不怕了。', en: 'The road ahead is unclear, information is incomplete, rumors fly everywhere. This part of the journey is hard — but it guarantees one thing: once you walk through this fog, nothing will scare you anymore.' },
    },

    sun: {
      general: { zh: '它像个大晴天里的小孩，笑得毫无理由——就是开心。它告诉你：你也值得这样。', en: 'Like a kid on a sunny day, laughing for no reason at all — just happy. It tells you: you deserve this too.' },
      love: { zh: '醒过来想到那个人就笑了。不是轰轰烈烈，就是暖烘烘的、稳稳当当的。这就是太阳式的爱。', en: 'You wake up, think of that person, and smile. It\'s not fireworks — it\'s warm, steady, safe. That\'s Sun-style love.' },
      career: { zh: '你做的事正在发光。别人看得见，你也自己看得见。不用解释，享受这一刻。', en: 'What you\'re doing is shining. Others can see it, and so can you. No need to explain — just enjoy this moment.' },
    },

    judgement: {
      general: { zh: '它像一个闹钟，不是叫你起床，是叫你醒来——你准备好回应那个一直在等你的事了。', en: 'It\'s like an alarm clock — not to wake you up, but to wake you UP. You\'re ready to answer the call that\'s been waiting for you.' },
      love: { zh: '也许你还需要跟过去说一次再见——不是发消息，是在心里正式地把那段故事画个句号。', en: 'Maybe you need to say goodbye to the past one more time — not by sending a message, but by formally closing that chapter in your heart.' },
      career: { zh: '有个声音一直在叫你，你没敢答应。现在时候到了——它说：你可以了。', en: 'A voice has been calling you for a while, and you haven\'t dared to answer. Now the time has come — it says: you\'re ready.' },
    },

    world: {
      general: { zh: '它像一个完整的圆，起点和终点连在一起。你回头看才发现：那些弯路、那些疼，全都有用。', en: 'Like a complete circle where the start and the end connect. Looking back, you finally see: every detour, every ache — it all served a purpose.' },
      love: { zh: '不是"找到了完美的人"，是"和你在一起，我不需要完美"。这才是终点站。', en: 'It\'s not "I found the perfect person" — it\'s "with you, I don\'t need to be perfect." That\'s the final stop.' },
      career: { zh: '一个阶段圆满了。你可以停下来庆祝——不是结束，是一段路走完了，该领奖了。', en: 'A chapter has come full circle. You can pause and celebrate — it\'s not the end, it\'s just that a stretch of road is complete and it\'s time to collect your trophy.' },
    },

    // ── WANDS (14) — Fire, passion, action, creativity ──

    'ace-of-wands': {
      general: { zh: '一个火花劈下来——它不管你有没有准备，它就是来了。', en: 'A spark shoots down — it doesn\'t care if you\'re ready or not. It\'s just here.' },
      love: { zh: '那种突然想要靠近某个人的冲动，像火苗一样，"蹭"地亮了。', en: 'That sudden urge to get closer to someone, flaring up like a flame — poof, it\'s lit.' },
      career: { zh: '一个新想法让你手痒。别让它凉掉——趁热动手。', en: 'A new idea is making your fingers itch. Don\'t let it cool down — jump on it while it\'s hot.' },
    },

    'two-of-wands': {
      general: { zh: '手里握着球，眼睛看着远方。它在做计划——不急，但已经在选了。', en: 'Holding a globe, eyes on the horizon. It\'s making plans — unhurried, but already choosing.' },
      love: { zh: '你对一个人有期待，但还在犹豫要不要往前走那一步。', en: 'You have expectations about someone, but you\'re still hesitating to take that step forward.' },
      career: { zh: '世界很大，你有能力去任何地方。现在不是冲，是把方向看准了。', en: 'The world is big and you have the ability to go anywhere. Now isn\'t about charging — it\'s about getting the direction right.' },
    },

    'three-of-wands': {
      general: { zh: '船已经开出去了，你在岸上看它走远。不是结束，是播种后的等待。', en: 'The ship has already sailed — you\'re watching it go from the shore. It\'s not an ending, it\'s the waiting after the seeds are sown.' },
      love: { zh: '你已经表达了心意，剩下的交给时间。不用反复确认——种子在地下已经在动了。', en: 'You\'ve expressed how you feel. Leave the rest to time. No need to keep checking — the seed is already moving underground.' },
      career: { zh: '你的计划已经启动了。现在什么都不用做——盯着看反而容易拔苗助长。', en: 'Your plan is already in motion. Now do nothing — staring at it too hard will just make you pull up the sprout before it\'s ready.' },
    },

    'four-of-wands': {
      general: { zh: '花环挂起来了，桌子也摆好了。它说：来，坐下，庆祝你已经走了这么远。', en: 'The garlands are up and the table is set. It says: come, sit down, celebrate how far you\'ve already come.' },
      love: { zh: '一段关系到了可以公开庆祝的阶段——不是终点，但值得好好吃顿饭。', en: 'A relationship has reached the stage where it can be openly celebrated — not the finish line, but definitely worth a good meal together.' },
      career: { zh: '项目落地了、团队稳了——别急着冲下一个目标，先喝一杯再说。', en: 'The project landed, the team is stable — don\'t rush to the next target. Have a drink first.' },
    },

    'five-of-wands': {
      general: { zh: '五根棍子撞在一起，乒乒乓乓。它说：你现在有点烦，但这不一定是坏事——火花就是这么撞出来的。', en: 'Five rods clashing together, clanging and banging. It says: you\'re a bit annoyed right now, but this isn\'t necessarily bad — sparks fly from collision.' },
      love: { zh: '你们在吵——观点、习惯、小事情。但吵不散的架，其实是在磨合。', en: 'You\'re arguing — opinions, habits, little things. But fights that don\'t break you are actually shaping you together.' },
      career: { zh: '团队在打架、方案在PK、你在中间很头疼。但好消息是：最终出来的东西往往更好。', en: 'The team is fighting, proposals are battling, you\'re caught in the middle with a headache. Good news though: what comes out in the end is usually better.' },
    },

    'six-of-wands': {
      general: { zh: '骑着白马被欢呼——别害羞，别人是真心为你鼓掌。你做到了。', en: 'Riding a white horse, cheered on — don\'t be shy. People are genuinely clapping for you. You did it.' },
      love: { zh: '你的付出被看到了。对方投来的那个眼神——你懂的。', en: 'Your efforts have been noticed. That look they just gave you — you know what it means.' },
      career: { zh: '升职、获奖、被认可——别说什么"只是运气"，这就是你应得的。', en: 'Promotion, award, recognition — don\'t say "it\'s just luck." This is what you deserve.' },
    },

    'seven-of-wands': {
      general: { zh: '一个人站在高处往下打——有点吃力，但站得高的人是你。', en: 'One person standing on high ground, striking downward — it\'s a struggle, but you\'re the one holding the high ground.' },
      love: { zh: '你们的关系有人不看好、有人指手画脚。但你不需要所有人的同意——你只需要守住自己的选择。', en: 'Some people don\'t approve of your relationship, some are giving unsolicited advice. But you don\'t need everyone\'s blessing — you just need to defend your own choice.' },
      career: { zh: '有人质疑你、有人竞争、有人等着看你跌倒。但你在上面，他们在下面——保持就赢了。', en: 'People are questioning you, competing with you, waiting for you to fall. But you\'re on top and they\'re below — just hold your ground and you win.' },
    },

    'eight-of-wands': {
      general: { zh: '八支箭飞在空中——消息、变化、事情一个接一个。它说：坐稳了，要加速了。', en: 'Eight arrows flying through the air — news, changes, things coming one after another. It says: buckle up, we\'re accelerating.' },
      love: { zh: '对方的消息突然来了、约会突然定了、进展突然快了。别慌——这是好事。', en: 'Their message came suddenly, the date was set suddenly, things are moving fast suddenly. Don\'t panic — this is a good thing.' },
      career: { zh: '拖延了很久的事情突然全部开始动了。准备好，接下来两周会很忙——但也很爽。', en: 'Everything that\'s been stalled is suddenly all moving at once. Get ready — the next two weeks will be busy, but satisfying.' },
    },

    'nine-of-wands': {
      general: { zh: '身上有伤，但手里棍子还攥得紧紧的。它说：你很累了，但你比你以为的能扛。', en: 'Bruised and battered, but still gripping that rod tight. It says: you\'re exhausted, but you can take more than you think.' },
      love: { zh: '你已经受过伤了，现在有人靠近的时候你第一反应是防备。但你这根棍子不一定非得挡人——它也能撑着你。', en: 'You\'ve been hurt before, so now your first reaction when someone gets close is to raise your guard. But that rod doesn\'t have to be for blocking — it can also just hold you up.' },
      career: { zh: '做了这么多、熬了这么久，就差最后一小段了。别在最后一步前面放弃。', en: 'You\'ve done so much, endured so long — just one last stretch to go. Don\'t quit right before the final step.' },
    },

    'ten-of-wands': {
      general: { zh: '抱着一大捆棍子，腰都快弯到地上了。它问你：你扛的这些，真的全部需要你亲自扛吗？', en: 'Carrying a huge bundle of rods, back bent nearly to the ground. It asks you: do you really need to carry all of these by yourself?' },
      love: { zh: '你把两个人的问题都扛在自己肩上——对方的情绪、关系的前途、鸡毛蒜皮。但一段关系是两个人抬的，不是你一个人搬的。', en: 'You\'re carrying both people\'s problems on your own shoulders — their emotions, the relationship\'s future, every little thing. But a relationship is something two people lift together, not something one person hauls alone.' },
      career: { zh: '你接到了一个比你想象中重的任务。硬扛也行，但——你能找人分担一块吗？', en: 'You took on a task heavier than you imagined. You can tough it out, sure — but can you find someone to share a piece of it?' },
    },

    'page-of-wands': {
      general: { zh: '小孩拿着一根大棍子，眼睛亮晶晶的：我想试试！——那个"试试"就是一切的开始。', en: 'A kid holding a big rod, eyes sparkling: I wanna try! — that "try" is where everything begins.' },
      love: { zh: '刚生出来的好感，还没有太多顾虑。不用急着定义它——让这个阶段多待一会儿。', en: 'A newborn crush, not yet weighed down by too many worries. No need to define it quickly — let this stage hang around a little longer.' },
      career: { zh: '一个新技能让你兴奋。学它，玩它，别一开始就想"这能赚钱吗"。', en: 'A new skill has you excited. Learn it, play with it — don\'t start with "can this make money?"' },
    },

    'knight-of-wands': {
      general: { zh: '他骑着马冲过来，火急火燎——帅是帅，但有时候不太看路。', en: 'He comes charging in on horseback, full of fire — impressive, yes, but sometimes doesn\'t watch where he\'s going.' },
      love: { zh: '那个突然对你很热情、然后又突然消失的人——他倒不是故意的，他就是停不下来。', en: 'That person who suddenly goes all in on you, then suddenly disappears — it\'s not that they mean harm, they just can\'t stop moving.' },
      career: { zh: '热情高涨，想立刻干票大的。先等一下——确认方向再冲，冲起来就帅了。', en: 'Enthusiasm is high, want to do something big immediately. Wait a moment — confirm your direction first, then charge. That\'s when it looks good.' },
    },

    'queen-of-wands': {
      general: { zh: '她坐在宝座上，气场全开。不是咄咄逼人那种——是那种你走进来就知道：这屋里她说了算。', en: 'She sits on her throne, full presence. Not the aggressive kind — more the "you walk in and immediately know she runs this room" kind.' },
      love: { zh: '她爱得热烈但不黏人。你跟她在一起会觉得自己变好了——不是因为她照顾你，是因为她启发你。', en: 'She loves passionately but isn\'t clingy. Being with her makes you feel like a better version of yourself — not because she takes care of you, but because she inspires you.' },
      career: { zh: '你的光芒别人看得见。别收——你的自信不是傲慢，是你真的做得到。', en: 'People can see your light. Don\'t dim yourself — your confidence isn\'t arrogance, it\'s because you genuinely can do it.' },
    },

    'king-of-wands': {
      general: { zh: '他身上有火，但火是烧在炉子里的——热而不乱。他看了一眼远方，然后开始走。', en: 'He has fire, but it\'s contained in a hearth — warm, not wild. He glances at the horizon, then starts walking.' },
      love: { zh: '他不会给你一百条消息证明他爱你——但你要什么，他会用行动铺路。', en: 'He won\'t send you a hundred messages to prove his love — but whatever you need, he\'ll pave the way with action.' },
      career: { zh: '你是那种能带着一群人往前走的人。不是靠吼，是靠方向感和说到做到。', en: 'You\'re the kind of person who can lead a group forward — not by shouting, but by having a clear direction and doing what you say.' },
    },

    // ── CUPS (14) — Water, emotion, relationships, intuition ──

    'ace-of-cups': {
      general: { zh: '一个杯子满了，水溢出来。那是心里有爱，藏不住的样子。', en: 'A cup full to the brim, water spilling over. That\'s what it looks like when there\'s love in the heart that can\'t be hidden.' },
      love: { zh: '新的感情正在涌上来——可能是对一个人，可能是对自己，也可能只是对生活重新有了喜欢。', en: 'New emotion is welling up — maybe for a person, maybe for yourself, maybe just falling back in love with being alive.' },
      career: { zh: '如果你做的事情让你心里有温度——那就对了。别用数字衡量一切。', en: 'If what you\'re doing gives you warmth in your heart — that\'s the right thing. Don\'t measure everything by numbers.' },
    },

    'two-of-cups': {
      general: { zh: '两个人端着杯子面对面——不是在交换筹码，是在交换真心。', en: 'Two people holding cups, face to face — not trading chips, but trading hearts.' },
      love: { zh: '这不是权衡利弊之后的选择，是"我也不知道为什么，就是想跟你站在一起"。', en: 'This isn\'t a choice made after weighing pros and cons — it\'s "I don\'t know why, I just want to stand beside you."' },
      career: { zh: '找到一个对的人合作——你们在一起做的东西，比各自单打独斗有意思多了。', en: 'Find the right person to collaborate with — what you make together will be so much more interesting than what either of you could do alone.' },
    },

    'three-of-cups': {
      general: { zh: '三个朋友举着杯子跳舞。不是应酬，是那种笑到肚子疼的开心。', en: 'Three friends dancing with cups raised. Not networking — the kind of joy where you laugh until your stomach hurts.' },
      love: { zh: '爱情不只是两个人的事——你们的感情在朋友们的祝福里被看见、被庆祝。', en: 'Love isn\'t just between two people — your relationship is seen and celebrated in the blessings of friends.' },
      career: { zh: '团建不是浪费时间——那种一起扛过事、一起喝过酒的交情，是工作中最保值的东西。', en: 'Team bonding isn\'t a waste of time — the camaraderie of having struggled together and drunk together is the most durable asset in work.' },
    },

    'four-of-cups': {
      general: { zh: '面前三杯满满的，它偏盯着地上那杯空的发呆。不是不知足，是心不在焉。', en: 'Three full cups in front of it, yet it stares at the one empty one on the ground. Not ungrateful — just somewhere else in its head.' },
      love: { zh: '有人对你好，但你心里好像没什么感觉。没感觉就是没感觉——不用勉强自己感动。', en: 'Someone is treating you well, but your heart doesn\'t seem to feel much. No feeling is no feeling — don\'t force yourself to be moved.' },
      career: { zh: '你坐着发呆，对周围的选项提不起兴趣。也许不是你懒——是这些选项都不是你真正想要的。', en: 'You\'re sitting there spacing out, unexcited by the options around you. Maybe you\'re not lazy — maybe none of these options are what you actually want.' },
    },

    'five-of-cups': {
      general: { zh: '三杯倒了，但还有两杯立着。它偏要盯着倒掉的那三个。它说：哭一会儿没关系——哭完记得回头看看。', en: 'Three cups spilled, but two are still standing. Yet it insists on staring at the three that fell. It says: it\'s okay to cry for a while — just remember to turn around when you\'re done.' },
      love: { zh: '失去的那个人很大很大，大到你看不见其他东西。但你不是什么都没有了——你只是还没准备好去看。', en: 'The person you lost feels so huge that you can\'t see anything else. But you haven\'t lost everything — you\'re just not ready to look yet.' },
      career: { zh: '那个项目砸了、那个机会飞了。你很失望。但旁边两个还在那里的机会，你没看到。', en: 'That project crashed, that opportunity flew away. You\'re deeply disappointed. But the two chances still standing beside you — you haven\'t noticed them.' },
    },

    'six-of-cups': {
      general: { zh: '一个小孩送花给另一个小孩。没有计算，没有条件——就是想把好的东西给你。', en: 'One child giving flowers to another. No calculation, no conditions — just wanting to give you something good.' },
      love: { zh: '你想起了最初心动的样子——不是怀念哪个人，是怀念那个敢毫无保留去爱的自己。', en: 'You remembered what it felt like when your heart first fluttered — not missing a specific person, but missing the version of you who dared to love without reservation.' },
      career: { zh: '也许你正在做的事情，跟你小时候的某个梦想有关。回去看看那一页——说不定有线索。', en: 'What you\'re doing now might connect to a childhood dream of yours. Go back and look at that page — there might be a clue there.' },
    },

    'seven-of-cups': {
      general: { zh: '七个杯子漂在空中，每个里面装着不同的梦。它说：好看归好看——你只能选一个。', en: 'Seven cups floating in the air, each holding a different dream. It says: they\'re beautiful, sure — but you can only pick one.' },
      love: { zh: '眼花缭乱——这个也不错，那个也挺好。但你得问自己：哪个是你真的想要，哪个是你觉得"应该"想要？', en: 'Dazzling choices — this one looks good, that one seems nice too. But you need to ask yourself: which one do you truly want, and which one do you just feel like you "should" want?' },
      career: { zh: '选项太多反而动不了。选那个让你早上醒过来有动力起床的——那才是真的。', en: 'Too many options and you end up frozen. Pick the one that makes you actually want to get out of bed in the morning — that\'s the real one.' },
    },

    'eight-of-cups': {
      general: { zh: '它把杯子一个一个摞好，然后转身走了。不是赌气，是真的够了。', en: 'It stacks the cups neatly, one by one, then turns and walks away. Not in anger — it\'s genuinely had enough.' },
      love: { zh: '离开不是因为你不好，也不是因为不爱你——是因为有些关系像已经喝完的酒，再待下去只是空杯子。', en: 'Leaving isn\'t because you weren\'t good enough, or because love wasn\'t there — it\'s because some relationships are like wine already finished. Staying longer is just empty glasses.' },
      career: { zh: '你在一份工作或一条路上待了很久。现在心里有个声音说：该走了。不是失败——是毕业了。', en: 'You\'ve been in this job or on this path for a long time. Now a voice inside says: it\'s time to go. Not a failure — a graduation.' },
    },

    'nine-of-cups': {
      general: { zh: '它靠在椅子上，面前九个杯子，笑得像个刚刚吃饱的人。它说：你想要的，正在来的路上。', en: 'It leans back in its chair, nine cups lined up before it, smiling like someone who just had a satisfying meal. It says: what you want is on its way.' },
      love: { zh: '你许的那个愿望正在实现。可能不是按你想象的方式——但结果会让你满意。', en: 'That wish you made is coming true. Maybe not in the form you imagined — but the outcome will satisfy you.' },
      career: { zh: '你最近的努力快要有结果了。不是"终于完了"，是"终于等到了"。', en: 'Your recent hard work is about to pay off. Not "finally over" — more like "finally here."' },
    },

    'ten-of-cups': {
      general: { zh: '彩虹挂在天上，一家人在下面跳舞。不是完美的生活——但每个角落里都有"值得"两个字。', en: 'A rainbow in the sky, a family dancing beneath it. Not a perfect life — but every corner has the word "worth it" written on it.' },
      love: { zh: '你找到了那种"在一起不说话也很舒服"的人。这才是真正的"在一起"。', en: 'You\'ve found someone you can be silent with and still feel comfortable. That\'s what "being together" really means.' },
      career: { zh: '你的工作和生活终于不再互相打架了。不是牺牲工作换生活，是两边都在滋养你。', en: 'Your work and your life have finally stopped fighting each other. It\'s not about sacrificing work for life — it\'s that both are nourishing you.' },
    },

    'page-of-cups': {
      general: { zh: '一条小鱼从杯子里探出头来——它说："看！" 这个小孩式的惊喜就是一切的开始。', en: 'A little fish pokes its head out of the cup — it says: "Look!" This childlike wonder is where everything begins.' },
      love: { zh: '有人偷偷喜欢你——也许会有一个笨拙又可爱的小举动让你发现。', en: 'Someone has a secret crush on you — maybe an awkward but cute little gesture will give it away.' },
      career: { zh: '一个让你心里"咯噔"一下的想法来了。别用逻辑把它踢出去——先记下来。', en: 'An idea just came that made your heart skip. Don\'t kick it out with logic — write it down first.' },
    },

    'knight-of-cups': {
      general: { zh: '他骑着白马慢悠悠地过来，手捧酒杯，眼神温柔。不是来征服的——是来表白的。', en: 'He rides over slowly on a white horse, holding a cup, eyes gentle. He\'s not here to conquer — he\'s here to confess.' },
      love: { zh: '那个温温柔柔、有点敏感的人正在靠近。别催他——他的表达方式像水，不猛，但能渗透到你心里。', en: 'That gentle, somewhat sensitive person is getting closer. Don\'t rush them — their way of expressing is like water, not forceful but able to seep into your heart.' },
      career: { zh: '一个跟艺术、情感、创意有关的方向在等着你。它不太赚钱——但它能养活你心里的那部分。', en: 'A direction related to art, emotion, or creativity awaits you. It might not make you rich — but it can feed that part of your soul.' },
    },

    'queen-of-cups': {
      general: { zh: '她的杯子很深，什么情绪她都接得住。不是因为没感觉——是因为她懂得，情绪是会过的。', en: 'Her cup runs deep — she can hold any emotion. Not because she\'s numb, but because she understands: feelings pass through.' },
      love: { zh: '她是那个在你崩溃时不说"别哭了"而说"我懂"的人。那种安全感，比任何承诺都有用。', en: 'She\'s the one who, when you fall apart, doesn\'t say "stop crying" but says "I understand." That kind of safety is more powerful than any promise.' },
      career: { zh: '直觉是你的超能力。当数据和逻辑说不通的时候，你心里那个"感觉不对"往往是正确的。', en: 'Intuition is your superpower. When data and logic don\'t add up, that "something feels off" in your gut is often right.' },
    },

    'king-of-cups': {
      general: { zh: '海浪拍岸，他坐在中间岿然不动。情感在他这里是深海，不是风浪。', en: 'Waves crash against the shore, but he sits in the middle, unshaken. Emotion, in him, is the deep ocean — not the surface storm.' },
      love: { zh: '他不会说很多甜言蜜语——但他会在你崩溃的时候稳稳地站在那里，像海一样包容。', en: 'He won\'t shower you with sweet words — but when you fall apart, he\'ll stand there steady, as accepting as the sea.' },
      career: { zh: '你在高压环境下反而更冷静。别人慌了的时候，你就是那个定海神针。', en: 'You get calmer under high pressure. When everyone else is panicking, you\'re the anchor that steadies the ship.' },
    },

    // ── SWORDS (14) — Air, intellect, conflict, truth ──

    'ace-of-swords': {
      general: { zh: '一把剑劈开迷雾——真相露了出来。它不温柔，但它干净。', en: 'A sword cleaves through the fog — the truth is exposed. It\'s not gentle, but it\'s clean.' },
      love: { zh: '有些话终于说出口了——可能有点伤人，但不说出来更伤人。', en: 'Some words finally came out — they might sting, but keeping them inside would have hurt more.' },
      career: { zh: '一个清晰的想法或决策正在形成。别怕它的锋利——它帮你切断犹豫。', en: 'A clear thought or decision is taking shape. Don\'t fear its sharpness — it\'s helping you cut through indecision.' },
    },

    'two-of-swords': {
      general: { zh: '蒙着眼睛，两把剑交叉在胸前——它看不到，也不想看到。不是不知道选哪个，是根本不想选。', en: 'Blindfolded, two swords crossed over its chest — it can\'t see, and doesn\'t want to. It\'s not that it doesn\'t know which to choose — it doesn\'t want to choose at all.' },
      love: { zh: '你假装看不懂对方的暗示，对方假装看不穿你的逃避。两个人心知肚明——但没人捅破。', en: 'You pretend you don\'t see their hints, and they pretend they don\'t see through your avoidance. Both of you know — but nobody breaks the silence.' },
      career: { zh: '你站在路口，两边都有道理。但"不选"也是一种选择——而且是最耗人的那种。', en: 'You stand at the crossroads, both sides making sense. But "not choosing" is also a choice — and it\'s the most draining kind.' },
    },

    'three-of-swords': {
      general: { zh: '三把剑穿过一颗心——疼。但剑把心里的脓也放出来了。', en: 'Three swords through a heart — it hurts. But the swords also drained the infection that was there.' },
      love: { zh: '被伤到了。不是你不够好，是有些事就是会发生。疼是真的，但你会好——也是真的。', en: 'You got hurt. Not because you weren\'t enough — some things just happen. The pain is real — but so is the fact that you\'ll heal.' },
      career: { zh: '你的方案被否了、你的努力不被认可、你的信任被辜负。心疼一下自己，然后收拾收拾——下一把剑可以用来开路。', en: 'Your proposal got rejected, your efforts went unrecognized, your trust was betrayed. Grieve for yourself a moment, then pack it up — the next sword can be used to blaze a trail.' },
    },

    'four-of-swords': {
      general: { zh: '它躺平了——不是懒，是挂免战牌。脑子打了太久的仗，现在需要停火。', en: 'It\'s lying flat — not out of laziness, but calling a truce. The mind has been at war too long — it needs a ceasefire now.' },
      love: { zh: '吵了太多架，想了太多事。现在不是解决问题的时候——现在是各自冷静的时候。', en: 'Too much fighting, too much thinking. Now isn\'t the time to solve the problem — it\'s time for each person to cool down separately.' },
      career: { zh: '你到了那种"脑子已经不转了"的状态。别硬撑了——真正的效率是在你休息好了之后才回来的。', en: 'You\'ve reached that "brain just won\'t work anymore" state. Don\'t force it — real efficiency only comes back after you\'ve had proper rest.' },
    },

    'five-of-swords': {
      general: { zh: '它打赢了，地上倒了一堆剑。但赢了之后一个人站在那边——好像也没多开心。', en: 'It won the fight — swords scattered on the ground. But standing there alone after the victory — somehow it doesn\'t feel that great.' },
      love: { zh: '你在吵架里赢了——把对方说得哑口无言。但你看着对方不说话的样子，心里更难受了。', en: 'You won the argument — left them speechless. But watching them sit there silent, you feel worse than before.' },
      career: { zh: '为了赢可以不计代价——但你真的需要"赢"吗？踩了别人的胜利，有时候代价比输了还大。', en: 'You could win at any cost — but do you really need to "win"? A victory won by stepping on others sometimes costs more than losing.' },
    },

    'six-of-swords': {
      general: { zh: '船上载着六把剑，驶向对岸。不回头，不是不怀念——是知道那边有更好的等在前面。', en: 'A boat carrying six swords, sailing to the far shore. Not looking back — not because it doesn\'t miss what was, but because it knows something better awaits ahead.' },
      love: { zh: '你带着伤痕慢慢走出来了。不是一夜之间放下的，是一点一点划到河对岸的。', en: 'You\'re slowly making your way out, carrying your scars. Not an overnight release — it was crossing the river one paddle stroke at a time.' },
      career: { zh: '你正在离开一个让你不舒服的环境。路上有点冷，风有点大——但船头向着阳光那一边。', en: 'You\'re leaving an environment that wasn\'t good for you. The journey is a bit cold and windy — but the bow is pointed toward the sunlight.' },
    },

    'seven-of-swords': {
      general: { zh: '它抱着一堆剑蹑手蹑脚地溜走。不是正直的做法——但它有自己的苦衷。', en: 'It tiptoes away, arms full of stolen swords. Not the most honorable move — but it has its reasons.' },
      love: { zh: '有人在关系中藏着事、留着备选、揣着自己的小算盘。你感觉到了——相信那个感觉。', en: 'Someone in the relationship is hiding things, keeping backup options, nursing their own little calculations. You feel it — trust that feeling.' },
      career: { zh: '做事可以灵活，但别弯过头了。走捷径和砸自己招牌——有时候分不清。', en: 'Flexibility is fine, but don\'t bend too far. Shortcuts and reputation-destroyers — sometimes it\'s hard to tell the difference.' },
    },

    'eight-of-swords': {
      general: { zh: '被绑住了，但绳子其实很松——是你自己不敢挣开。困住你的不是外面的剑，是你脑子里的"我不行"。', en: 'Tied up, but the ropes are actually pretty loose — you just don\'t dare to wriggle free. What traps you isn\'t the swords outside, it\'s the "I can\'t" inside your head.' },
      love: { zh: '你觉得自己被困在一段关系或一种状态里——但其实没有人锁门。是你在怕推门之后的事。', en: 'You feel trapped in a relationship or a situation — but nobody actually locked the door. It\'s what might happen after you push it open that scares you.' },
      career: { zh: '你觉得没得选——但那些限制是你自己画出来的。换个角度看一眼：那些"不能"是真的不能，还是你不敢？', en: 'You think you have no options — but those limitations are ones you drew yourself. Take a different look: are those "can\'ts" really impossible, or are you just afraid?' },
    },

    'nine-of-swords': {
      general: { zh: '半夜三点，它坐起身来，脑子里把所有最坏的情况演了一遍——但那些情况，一个都还没发生。', en: 'At 3 a.m., it sits up and replays every worst-case scenario in its head — but none of those scenarios have actually happened yet.' },
      love: { zh: '你为一段关系焦虑到睡不着觉。但半夜编的故事，天亮之后看看——大部分都不是真的。', en: 'You\'re so anxious about a relationship you can\'t sleep. But the stories your mind writes at midnight — looked at in the morning light, most of them aren\'t real.' },
      career: { zh: '你把自己卷进了想象中的灾难。"万一呢？"它问——但"万一好起来呢？"也是同一个"万一"。', en: 'You\'ve spiraled into an imaginary disaster. "What if it goes wrong?" it asks — but "what if it goes right?" is the same "what if."' },
    },

    'ten-of-swords': {
      general: { zh: '十把剑插在背上——看起来没救了。但它说：到底了。到底了之后，每一个方向都是往上。', en: 'Ten swords in the back — it looks hopeless. But it says: this is the bottom. Once you hit the bottom, every direction is upward.' },
      love: { zh: '被伤透了。不是一般的伤心——是那种让你觉得这辈子再也没办法爱了的那种。但人类的心不是这么工作的。它会好。', en: 'Shattered. Not the ordinary kind of heartbreak — the kind that makes you feel like you\'ll never be able to love again. But the human heart doesn\'t work that way. It will heal.' },
      career: { zh: '项目完了、口碑砸了、方向断了。不是你的失败——是一个版本的结束。下一个版本，你从零开始画。', en: 'The project is dead, your reputation took a hit, the path is cut off. It\'s not your failure — it\'s the end of one version. The next version, you get to draw from scratch.' },
    },

    'page-of-swords': {
      general: { zh: '手里挥舞着剑——有点毛躁，但眼睛很亮。它是那个总爱问"为什么"的小孩。', en: 'Swinging a sword around — a bit reckless, but eyes sharp and bright. It\'s that kid who always loves to ask "why."' },
      love: { zh: '用脑子谈恋爱的类型——会分析、会推理、会把对方的言行整理成一份报告。偶尔也问问心：你到底什么感觉？', en: 'The intellectual dater — analyzes, deduces, compiles the other person\'s words and actions into a report. Try asking your heart once in a while: how do you actually feel?' },
      career: { zh: '学新东西的时候到了。不是那种看看就好的学——是那种钻进去、跟别人辩论、把一个问题搞清楚的那种。', en: 'Time to learn something new — not the casual browse-and-forget kind of learning, but the deep dive, debate-with-others, get-to-the-bottom-of-it kind.' },
    },

    'knight-of-swords': {
      general: { zh: '他骑着马呼啸而过——脑子比嘴快，嘴比脑子快。速度是他的本事，也是他的毛病。', en: 'He gallops past in a whirlwind — mind faster than mouth, mouth faster than mind. Speed is both his gift and his flaw.' },
      love: { zh: '一个说话直来直去、不跟你绕弯子的人。可能有点伤人——但你知道他是真的。', en: 'Someone who speaks straight, no beating around the bush. Might sting a little — but you know they\'re real.' },
      career: { zh: '行动要快，但别跳过检查步骤。如果有人在旁边提醒你"等一下"，听一次——就一次。', en: 'Move fast, but don\'t skip the check step. If someone next to you says "hold on a second," listen — just that once.' },
    },

    'queen-of-swords': {
      general: { zh: '她坐在那里，眼神剖开一切。不是没感情——是感情要经过脑子才放行。', en: 'She sits there, her gaze cutting through everything. Not emotionless — just that emotions need to pass through the mind before being let out.' },
      love: { zh: '她不会为了一段关系牺牲自己的原则。跟她在一起，你得接受一个事实：她自己就是自己的底线。', en: 'She won\'t sacrifice her principles for a relationship. Being with her, you have to accept one thing: she IS her own bottom line.' },
      career: { zh: '清晰的边界是你的铠甲。学会说"不"——那不是不配合，那是专业。', en: 'Clear boundaries are your armor. Learn to say "no" — that\'s not being uncooperative, that\'s being professional.' },
    },

    'king-of-swords': {
      general: { zh: '他开口之前，脑子里已经把一件事拆成了十份。冷静到有点冷——但在他面前，你撒不了谎，也懒得撒谎。', en: 'Before he opens his mouth, he\'s already dissected the matter into ten parts. Calm to the point of cold — but in front of him, you can\'t lie, and you don\'t feel like trying.' },
      love: { zh: '他的爱是经过思考的、有边界的、不会为任何人失去理智的。听起来不浪漫——但跟这样的人在一起，你不会被坑。', en: 'His love is thought-through, boundaried, and not about to lose reason for anyone. Doesn\'t sound romantic — but with someone like this, you\'ll never get played.' },
      career: { zh: '分析力和判断力是你的王牌。在这个信息爆炸的世界里，能看清楚的人不多——你是其中一个。', en: 'Analysis and judgment are your trump cards. In a world flooded with information, not many people can see clearly — you\'re one of them.' },
    },

    // ── PENTACLES (14) — Earth, material, work, body ──

    'ace-of-pentacles': {
      general: { zh: '一枚金币从云里递出来——实实在在的机会，不是画饼。', en: 'A gold coin handed down from the clouds — a tangible opportunity, not empty promises.' },
      love: { zh: '一段"接地气"的关系的开始——不是飘在空中的浪漫，是愿意跟你一起买菜做饭的那种。', en: 'The start of a "grounded" relationship — not romance floating in the clouds, but someone willing to go grocery shopping and cook with you.' },
      career: { zh: '一个能赚钱、能落地、能让你长本事的机会来了——接住它。', en: 'An opportunity that can make money, get real, and build your skills has arrived — catch it.' },
    },

    'two-of-pentacles': {
      general: { zh: '两只手玩着两个金币，像是在变戏法。它说：生活就是在有限的时间和精力里排优先级。', en: 'Two hands juggling two coins, like a street performer. It says: life is about prioritizing within limited time and energy.' },
      love: { zh: '工作和感情在抢你的时间，你在中间左支右绌。能撑住——但别忘了你是人，不是机器。', en: 'Work and love are fighting for your time, and you\'re stretched between them. You can manage — but don\'t forget you\'re human, not a machine.' },
      career: { zh: '同时做几件事的状态——累但还能转。关键是：别让任何一个球掉在地上。', en: 'Juggling multiple things at once — tiring but still manageable. Key point: don\'t let any ball hit the ground.' },
    },

    'three-of-pentacles': {
      general: { zh: '三个人一起看图纸——石匠、牧师、建筑师。各有所长，一起做出来比哪一个单独都强。', en: 'Three people looking at blueprints together — stonemason, clergyman, architect. Each has their strength, and together they build better than any one alone.' },
      love: { zh: '你和对方在"磨合期"——不是天生契合，是愿意花时间把两个人的形状调到合适。这种努力本身就很有爱。', en: 'You and your partner are in the "adjustment phase" — not naturally a perfect fit, but willing to spend time shaping yourselves to each other. That effort itself is love.' },
      career: { zh: '合作、团队、把各自的专业拼到一起。你不是一个人在干——这正是用武之地。', en: 'Collaboration, teamwork, piecing together everyone\'s expertise. You\'re not working alone — this is exactly where you shine.' },
    },

    'four-of-pentacles': {
      general: { zh: '它紧紧抱着四枚金币，一步都不肯松。安全是有了，但两只手都抱着金币，怎么去接新的呢？', en: 'It clutches four coins tightly, refusing to let go of a single one. Safety is secured — but with both hands full of coins, how can you receive anything new?' },
      love: { zh: '你把心捂得太紧了——不是不想爱，是怕一旦松手就会受伤。但你防住了伤害，也防住了爱。', en: 'You\'re holding your heart too tight — not that you don\'t want to love, but you\'re afraid that loosening your grip means getting hurt. But you\'re guarding against pain and love at the same time.' },
      career: { zh: '你守着现有的，不敢动。但安全感不等于成长——有些机会需要你腾出手。', en: 'You\'re clinging to what you have, afraid to move. But security isn\'t the same as growth — some opportunities require you to free up your hands.' },
    },

    'five-of-pentacles': {
      general: { zh: '两个人在雪地里经过教堂——里面有光，但他们不知道门是不是为他们开的。其实门根本没锁。', en: 'Two people walking past a church in the snow — there\'s light inside, but they don\'t know if the door is open for them. It was never locked.' },
      love: { zh: '你觉得被冷落了、被遗忘了、配不上好的东西。但你只是站在教堂外面——里面有光，门也没锁。', en: 'You feel neglected, forgotten, unworthy of good things. But you\'re just standing outside the church — there\'s light inside, and the door was never locked.' },
      career: { zh: '找不到路、没资源、没人拉你一把。但你身边其实有人在——试着开口问一下。有时候求助本身，就是那把钥匙。', en: 'No path in sight, no resources, no one reaching out to help. But there are people around you — try asking. Sometimes asking for help is the key itself.' },
    },

    'six-of-pentacles': {
      general: { zh: '一只手在给，一只手在收。施与受之间是平等的——没有谁高谁低。', en: 'One hand giving, one hand receiving. Between giving and receiving, there\'s equality — no one is above or below.' },
      love: { zh: '爱不是一个人给、一个人接。是今天我给你一点，明天你拉我一把——轮着来。', en: 'Love isn\'t one person giving and the other receiving. It\'s today I give you some, tomorrow you pull me up — taking turns.' },
      career: { zh: '有人愿意帮你一把——别因为不好意思就推掉。接受帮助不是欠债，是给别人一个做善事的机会。', en: 'Someone is willing to give you a hand — don\'t push it away out of embarrassment. Accepting help isn\'t debt, it\'s giving someone a chance to do a good deed.' },
    },

    'seven-of-pentacles': {
      general: { zh: '它站在树下，看着果实的生长。不是闲着——是认真在看：哪些果子该留，哪些该剪，这棵树还值不值得继续种。', en: 'Standing under the tree, watching the fruit grow. Not idle — carefully assessing: which fruit to keep, which to prune, and whether this tree is still worth tending.' },
      love: { zh: '你投入了很多，现在开始犹豫：这个人、这段关系，值不值得继续。不是在质疑——是在评估。', en: 'You\'ve invested a lot, and now you\'re hesitating: is this person, this relationship, worth continuing. Not questioning in doubt — assessing honestly.' },
      career: { zh: '你做了很多，成果还没出来。这个阶段最难熬——但也是最关键的：别在果实出来之前把树砍了。', en: 'You\'ve put in a lot, but the results haven\'t surfaced yet. This phase is the hardest to endure — but also the most crucial: don\'t cut down the tree before the fruit appears.' },
    },

    'eight-of-pentacles': {
      general: { zh: '它低头敲着一枚又一枚金币，不抬头，不做梦。它说：功夫就是时间堆出来的，没捷径。', en: 'It hammers coin after coin, head down, no daydreaming. It says: craftsmanship is accumulated time — no shortcuts.' },
      love: { zh: '好的关系不是天生的——是练出来的。像手艺一样，天天做、天天修、天天用心。', en: 'A good relationship isn\'t born — it\'s practiced. Like a craft, done every day, refined every day, tended with care every day.' },
      career: { zh: '你正在打基础。可能很闷、很重复、没人看得到——但这是你将来手里那个"拿得出手的本事"。', en: 'You\'re building your foundation. It might be dull, repetitive, invisible to others — but this is that "real skill" you\'ll one day be proud of.' },
    },

    'nine-of-pentacles': {
      general: { zh: '她站在花园里，一只鸟停在她手背上。她拥有的一切都是她自己挣的——不需要任何人证明她的价值。', en: 'She stands in her garden, a bird resting on her gloved hand. Everything she has, she earned herself — she needs no one to validate her worth.' },
      love: { zh: '她一个人的生活过得漂亮极了——不需要谁来"完整"她。如果来了，是锦上添花；没来，她也很好。', en: 'She lives a beautiful life on her own — doesn\'t need anyone to "complete" her. If someone comes, it\'s the cherry on top; if not, she\'s still doing great.' },
      career: { zh: '你靠自己走到了今天。经济独立、能力过硬。这份底气和自信——谁也拿不走。', en: 'You\'ve made it this far on your own: financially independent, solidly capable. This confidence and poise — no one can take it away from you.' },
    },

    'ten-of-pentacles': {
      general: { zh: '三代同堂，有楼有狗有花园。不是暴富——是那种"攒了一辈子终于把日子过成这样"的踏实。', en: 'Three generations under one roof, with a house, a dog, a garden. Not sudden riches — that steady "spent a lifetime building this life" kind of groundedness.' },
      love: { zh: '一段"能过一辈子"的关系——不是轰轰烈烈，是每天醒来有你在旁边，各自有自己的事，但根在一起。', en: 'A "for a lifetime" kind of relationship — not fireworks, but waking up every day with you beside, each with your own things, but rooted together.' },
      career: { zh: '你建立的东西正在变成可以传承的财富——不只是钱，是经验、人脉、名声。你在种一棵大树。', en: 'What you\'re building is becoming a legacy — not just money, but experience, connections, reputation. You\'re planting a great tree.' },
    },

    'page-of-pentacles': {
      general: { zh: '小孩捧着金币，左看右看——他不是在数钱，他是在琢磨：这个东西是怎么造出来的？', en: 'A kid holding a gold coin, examining it from every angle — not counting money, but wondering: how was this thing made?' },
      love: { zh: '那种笨笨的、踏实的追求方式——不会说情话，但记得你喜欢吃的东西，每次见面都给你带一小份。', en: 'That clumsy, earnest way of courting — can\'t say sweet things, but remembers what you like to eat and brings you a little bit every time you meet.' },
      career: { zh: '学一门硬本事的时候到了。不是速成的捷径——是一本书一本书、一件事一件事做出来的。', en: 'Time to learn a solid skill. Not a quick-hack shortcut — book by book, task by task, built the real way.' },
    },

    'knight-of-pentacles': {
      general: { zh: '他骑在马上不动——不是卡住了，是在检查每一个细节。慢到他身边的人都快疯了，但他没翻过车。', en: 'He sits on his horse, not moving — not stuck, but checking every detail. So slow that those around him are losing their minds, but he\'s never once crashed.' },
      love: { zh: '他不会给你心跳加速的感觉——但他会把你的事当成他自己的事，一点一滴地做。', en: 'He won\'t give you heart-racing butterflies — but he\'ll treat your business like his own, handling it bit by bit.' },
      career: { zh: '稳扎稳打就是你的节奏。别羡慕那些冲得快的——你每步踩得实，将来的路就比别人长。', en: 'Steady and solid is your rhythm. Don\'t envy those who sprint — every step you take is planted firmly, so your road ahead will stretch farther than theirs.' },
    },

    'queen-of-pentacles': {
      general: { zh: '她的房子烧着暖炉，桌上摆着吃的。她把你按在椅子上：先吃饱，事等一下再说。', en: 'Her house has a warm fire going, food on the table. She pushes you into a chair: eat first — everything else can wait.' },
      love: { zh: '她爱你的方式是"把你照顾好"——不是控制，是真的担心你有没有吃饭、有没有睡好。', en: 'Her way of loving you is "taking good care of you" — not controlling, but genuinely worried about whether you\'ve eaten and slept well.' },
      career: { zh: '你把工作和生活调和得刚刚好——不亏钱，不亏身体，不亏心里。这是一种很难得的智慧。', en: 'You\'ve balanced work and life just right — not losing money, not losing your health, not losing your soul. That\'s a rare kind of wisdom.' },
    },

    'king-of-pentacles': {
      general: { zh: '他坐在那里，像一棵老树——根深、叶茂、不说话但让人觉得安全。钱和本事都在他手里，但他不炫耀。', en: 'He sits there like an old tree — deep-rooted, full-leaved, silent but radiating safety. Money and mastery in his hands, but he doesn\'t flaunt them.' },
      love: { zh: '他的爱是那种"我把一切都准备好了，你只需要做你自己"的安全感。不是浪漫电影——是真实的生活。', en: 'His love is that "I\'ve prepared everything — you just need to be yourself" kind of safety. Not a romantic movie — real life.' },
      career: { zh: '你已经在一个领域深耕到了可以昂首挺胸的程度。帮帮你身后的人——你的经验对他们来说就是灯塔。', en: 'You\'ve cultivated your field to the point where you can hold your head high. Help those behind you — your experience, to them, is a lighthouse.' },
    },

  },

    // ── Opening passages — by domain × questionType × sentiment ──
    openings: {
      love: {
        choice: {
          anxious: [
            { zh: '在爱的岔路口站久了，脚会疼的。我能感觉到你心里的拉扯——两边都重要，两边都怕选错。牌已经在你的面前，让我们不急着下判断，先看看每张牌各自在为哪个方向说话。先从你内心最柔软也最不确定的那个角落说起……', en: 'Standing too long at love\'s crossroads makes your feet ache. I can feel your inner pull — both sides matter, both sides scare you. The cards are before you now. Let\'s not rush to judge — let\'s see which direction each card speaks for. Starting from the softest, most uncertain corner of your heart…' },
            { zh: '每一个"该不该继续"的问题背后，都藏着一份已经积了很久的疲惫。我看到了。你问的是要不要走，但牌面会先帮你看看：是什么让你一直留到了现在。那些让你留下的东西，是否还值得你再留一会儿。', en: 'Behind every "should I stay or go" question is a fatigue that has been building for a long time. I see it. You\'re asking whether to leave, but the cards will first help you see: what has kept you here all this time. And whether it\'s still worth staying a little longer.' },
          ],
          hopeful: [
            { zh: '一段新的感情可能性正浮现在你面前。你既有期待，也有拿不准——这很正常。牌面会帮你梳理：这种好感是建立在什么之上的？你们各自能给对方什么？让我们从第一张牌开始，看这段潜在的关系有没有结实的根。', en: 'A new romantic possibility is emerging before you. You\'re hopeful but unsure — that\'s normal. The cards will help you sort: what is this attraction built on? What can you each offer? Let\'s start with the first card and see if this potential bond has solid roots.' },
            { zh: '两颗心在慢慢靠近的感觉，既甜又让人有点慌。你怕看错了信号，又怕错过了缘分——这种小心翼翼的期待，牌面全都读得到。星辰不会替你推开门，但会先帮你看看门那边是什么。放轻松，我们一张一张来看。', en: 'The feeling of two hearts slowly drawing closer — sweet and a little nerve-wracking. You\'re afraid of reading the wrong signals, but also afraid of missing a real connection. The cards can feel all of that careful hope. The stars won\'t open the door for you, but they\'ll help you peek through first. Relax — let\'s look at each card one by one.' },
          ],
        },
        guidance: {
          anxious: [
            { zh: '你不确定这段关系会不会好起来。你来找牌，是想听到一句"会好起来的"——但星辰不会只给你安慰。它们更尊重你：它们会指给你看，哪里是你可以使力的地方，哪里是你需要放下的。接下来的牌面，就是这份实实在在的地图。', en: 'You\'re not sure if this relationship will get better. You came to the cards wanting to hear "it will be okay" — but the stars won\'t just comfort you. They respect you more: they\'ll show you where you can push, and where you need to let go. The cards ahead are that real, practical map.' },
            { zh: '一段感情走到了让人不安的阶段，你甚至不确定自己在这段关系里到底是什么位置。这样的迷茫很耗人。牌面今天要做的事不是给你保证，而是帮你看清现状的纹理——你们之间到底在发生什么、你在其中的角色、以及哪些东西其实一直在你的手里。', en: 'A relationship has reached a stage that leaves you unsettled — you\'re not even sure where you stand in it anymore. This kind of confusion is exhausting. What the cards will do today isn\'t to give you guarantees, but to help you see the texture of your current reality: what\'s actually happening between you, your role in it, and what has always been in your hands.' },
          ],
          painful: [
            { zh: '一段让你很痛的感情经历——可能是结束、背叛、或者漫长的消耗。你来找牌，也许是想问"还会好吗"——但更深的问题可能是"我到底哪里做错了"。牌面不会陪你找谁的错，但它们会陪你看清：这段经历在你生命里留下了什么，你又该带着什么继续走下去。', en: 'A relationship experience that hurt you deeply — maybe an ending, betrayal, or long erosion. You came to ask "will it get better" — but deeper down you may be asking "what did I do wrong." The cards won\'t help you find fault, but they\'ll help you see: what this experience left in you, and what to carry forward.' },
            { zh: '感情里的伤，不是时间久了就自动痊愈的——它需要我们回头去看、去理解。你愿意来牌前坐下，本身就是一种勇气的证明。牌面会像一双温和的手，帮你翻开心底那些你一直不敢碰的感受。不是要让你再痛一次，而是让你终于能看清伤口真正需要什么。', en: 'Wounds in love don\'t heal just because time passes — they need us to look back and understand. Your willingness to sit before the cards is itself proof of courage. The cards will be like gentle hands, helping you open up the feelings you\'ve been too scared to touch. Not to hurt you again, but so you can finally see what the wound truly needs.' },
          ],
        },
        exploration: {
          confused: [
            { zh: '你有些看不清这段关系——看不清对方，也看不清自己。你来找牌，想寻找一个镜子。牌确实是一面很好的镜子：它不会说谎，也不会讨好。接下来的解读，让我们从那张最能反映你当下真实处境的牌开始……', en: 'You can\'t quite see this relationship clearly — you can\'t see them, or yourself. You came to the cards seeking a mirror. The cards are indeed a good mirror: they don\'t lie, and they don\'t flatter. Let\'s begin with the card that most reflects your current true situation…' },
            { zh: '你站在一段关系的迷雾里，看不清前路。这种感觉不陌生吧——心明明在里面，但脑子怎么也想不清楚。牌面不会急着驱散这场雾，因为有些雾是在保护你，让你在真正做出决定之前，先收集好所有该看到的信息。让我们从最靠近你的那张牌，开始一场诚实的凝视。', en: 'You\'re standing in the fog of a relationship, unable to see the road ahead. This feeling isn\'t unfamiliar, is it — your heart is in it, but your mind just can\'t get clear. The cards won\'t rush to disperse this fog, because some fog is protecting you, giving you time to gather all the information you need before making a real decision. Let\'s begin an honest look from the card closest to you.' },
          ],
        },
        breakup: {
          painful: [
            { zh: '一段关系的结束，像心里被拿走了一块东西。不管是你主动离开还是被离开，那种"空缺"的感觉都是真实存在的。牌面不想急着让你"好起来"——它想先陪你在那个空缺里坐一会儿，看清那里曾经有过什么、现在留了什么、以后还能长出什么。', en: 'The end of a relationship is like a piece taken from your heart. Whether you left or were left, that feeling of emptiness is real. The cards won\'t rush you to "get better" — they want to sit with you in that empty space first, to see what was once there, what remains now, and what can grow there in the future.' },
            { zh: '分手的痛不只在于失去那个人，更在于你对自己讲的那个故事被打断了。你曾想象过的未来画面突然没有了落脚的地方。牌面愿意做你的听众和引路人——它不会粉饰已发生的事，但它会陪着你重新整理那些散落的碎片，然后一点点看见：哪些碎片本来就是不该属于你的。', en: 'The pain of a breakup isn\'t just about losing that person — it\'s about the story you were telling yourself being abruptly cut off. The future scenes you once imagined suddenly have nowhere to land. The cards are willing to be your listener and guide — they won\'t gloss over what happened, but they\'ll help you gather the scattered pieces and gradually see: some pieces were never meant to be yours in the first place.' },
            { zh: '离婚或一段漫长陪伴的终结，痛的不是一个瞬间，而是一个漫长的解构过程——共同的朋友、习惯、甚至你对家庭的理解，都在这段时间里被重新定义。牌面不会轻飘飘地说"一切都会好的"，但它会和你一起诚实地盘点：在这场人生的重大变化里，什么是你真正失去了的，什么是你其实早已暗自松一口气放下的。', en: 'A divorce or the end of a long companionship — the pain isn\'t one moment but a long deconstruction: shared friends, habits, even your understanding of family are being redefined during this time. The cards won\'t lightly say "everything will be fine," but they\'ll honestly take inventory with you: in this major life change, what have you truly lost, and what have you actually already quietly felt relieved to let go of.' },
          ],
        },
        conflict: {
          anxious: [
            { zh: '你们又吵架了——或者冷战、或者积累了太多说不清的摩擦。你来找牌，心里既委屈又不甘。星辰看待争吵的方式和我们不太一样：它们不是看谁对谁错，而是看这段关系里哪里在"漏水"。牌面会帮你找到那个漏水的缝隙——不是让你去修补谁，而是让你明白真正的张力在哪里。', en: 'You fought again — or went silent, or accumulated too many unnamed frictions. You came to the cards feeling both wronged and unwilling to let go. The stars see arguments differently than we do: they don\'t look for who\'s right, but where this relationship is "leaking." The cards will help you find that crack — not so you can fix anyone, but so you can understand where the real tension lives.' },
            { zh: '关系里的冲突是一种很奇怪的信号：它既是距离，也是沟通——只是沟通的方式太刺人了。你此刻心里的火和委屈，牌面都感受得到。但牌不会只停留在情绪的表面，它们会沉到你真正在争执的那个"地基"上：你怕的是什么？对方要的是什么？你们之间那个反复出现的模式到底是什么？', en: 'Conflict in a relationship is a strange signal: it\'s both distance and communication — just communicated too sharply. The anger and hurt you carry right now, the cards can feel it. But they won\'t stay on the surface of emotion. They\'ll sink down to the real foundation of your argument: what are you afraid of? What does the other person truly want? What is the recurring pattern between you that keeps showing up?' },
            { zh: '争吵过后安静下来的时候，你心里可能有个声音在问："我们还能走下去吗？"这个问题的重量，舍不得放下，又不敢问出口。牌面今天就面对这个问题——但它不会替你回答"能"或"不能"。它会带你去看你们关系的土壤：根还在不在？养分还够不够？这比一句结论重要得多。', en: 'In the quiet after a fight, there might be a voice inside asking: "Can we still go on?" The weight of this question — you can\'t let it go, yet you dare not ask it out loud. The cards will face this question today — but they won\'t answer "yes" or "no" for you. They\'ll take you to see the soil of your relationship: are the roots still there? Is the nourishment still enough? That matters far more than a one-word answer.' },
          ],
        },
        ['new-love']: {
          hopeful: [
            { zh: '你最近遇到一个人，或者还没有真遇到、只是感觉自己准备好了。那种心里又开始有星星的感觉——好久没有过了吧？牌面会用一种温柔而清醒的方式陪你看：这份期待里有多少是对真实的人的回应，有多少是对"爱"这个感受本身的渴望。两者都没有错，但分清楚了，航路会更稳。', en: 'You recently met someone — or maybe you haven\'t really met them yet, but you feel ready. That feeling of stars lighting up in your heart again — it\'s been a while, hasn\'t it? The cards will gently and clearly help you see: how much of this anticipation is responding to a real person, and how much is a longing for the feeling of love itself. Neither is wrong, but once you can tell them apart, the course ahead will be steadier.' },
            { zh: '遇见一个新的人就像翻开一本还没读过的书——封面让人心动，但内容还是个谜。你此刻小心翼翼地、怕太热情又怕太冷淡，这种心情很珍贵。牌面今天的任务不是"预测"这段关系的结局，而是帮你读一读这本书的前几页：你看见的是真正的篇章，还是只是你希望看到的投影。', en: 'Meeting someone new is like opening a book you haven\'t read — the cover moves your heart, but the contents are still a mystery. You\'re treading carefully now, afraid of being too eager or too distant — this tenderness is precious. The cards\' job today isn\'t to "predict" where this goes, but to help you read the first few pages: are you seeing real chapters, or just the projection of what you hope to find.' },
          ],
        },
        ['long-term']: {
          confused: [
            { zh: '在一起很久了。说不上哪里不对，但就是觉得少了什么——像是房间里有一层灰，看不清也擦不掉。这不是失败，而是所有长关系都会经历的一种"倦怠"期。牌面会用一种不带批判的眼光，帮你看清这段关系在时间的长河里到底发生了什么：那些被习惯淹没的温柔，那些被日常拖累的激情，是否还有被重新唤醒的可能。', en: 'You\'ve been together a long time. Nothing is specifically wrong, but something feels missing — like a layer of dust in the room, invisible but you can\'t wipe it away. This isn\'t failure; it\'s a kind of lull that every long relationship goes through. The cards will look with you without judgment, helping you see what has truly happened in this long river of time: the tenderness drowned by routine, the passion weighed down by daily life — and whether they can be awakened again.' },
            { zh: '一段走了很远的关系，现在你有点恍惚：是爱情变成了亲情，还是爱情已经悄悄退场了？这个问题不好问出口，但它一直压在你的心里。牌面会陪你去分辨这两种状态的区别——不是让你做结论，而是让你在看清楚之后，内心有一个真正属于自己的答案。有时星辰不说话，但它们会把光打在那些你一直在回避的角落里。', en: 'A relationship that has come a long way, and now you feel a bit dazed: has love become kinship, or has love quietly exited? This question is hard to ask out loud, but it weighs on your heart. The cards will help you distinguish between these two states — not to force a conclusion, but so that after seeing clearly, you can have an answer that truly belongs to you. Sometimes the stars don\'t speak — they just shine light into the corners you\'ve been avoiding.' },
          ],
        },
      },
      career: {
        choice: {
          anxious: [
            { zh: '你在事业的岔路口反复权衡利弊，越算越焦虑。牌面不会替你做决定——但那不是坏事。它们会照亮每个选项的底牌：那些你没看到的风险、那些你低估的优势。最终的选择权在你手里，但牌能让你手里握的牌更多一些。', en: 'You\'re weighing pros and cons at a career crossroads, and the more you calculate, the more anxious you get. The cards won\'t decide for you — but that\'s not a bad thing. They\'ll illuminate what\'s under each option: risks you didn\'t see, strengths you underestimated. The final choice is yours, but the cards give you more cards to hold.' },
            { zh: '面对职业上的两种可能，你反复在心里排练——选了A会怎样，选了B失去什么。这样来回翻转，人已经很累了。牌面不急着让你选，它先带你看一件事：在这两个选项背后，你真正在追求的是什么？是安全感、是成长、是被认可、还是别的东西？先看清欲望的根，选择会自然地浮出来。', en: 'Facing two career possibilities, you\'ve been rehearsing in your mind — what if I choose A, what will I lose with B. Flipping back and forth, you\'re already exhausted. The cards won\'t rush you to choose. They\'ll first help you see: behind these two options, what are you truly pursuing? Security, growth, recognition, or something else? Once you see the root of your desire, the choice will surface naturally.' },
          ],
        },
        guidance: {
          confused: [
            { zh: '你觉得事业上有点"走到瓶颈"了——不是不努力，而是努力的方向好像不太对。牌面会帮你从更高一点的地方俯瞰全局：你现在的阶段、你的核心优势、你现在最该投入的方向。有时瓶颈不是墙，只是需要你转弯。', en: 'You feel like you\'ve hit a ceiling in your career — not that you\'re not working hard, but the direction might not be right. The cards will help you see from a higher vantage: your current phase, your core strengths, where to invest now. Sometimes a bottleneck isn\'t a wall — it just needs you to turn.' },
            { zh: '工作的方向越来越模糊，每天早上起来身体去上班了，心里还停在原地。你不缺能力，你缺的是"往哪走"的清晰信号。牌面会做一件简单但重要的事：帮你重新连接你的资源和你的直觉。你其实比你想象中更清楚答案——只是信息太多、噪音太大，你需要星辰帮你调一调频率。', en: 'The direction of your work is getting blurrier — every morning your body goes to work, but your heart stays behind. You don\'t lack ability; you lack a clear signal of "where to go." The cards will do something simple but essential: reconnect your resources with your intuition. You actually know the answer better than you think — there\'s just too much information and noise. You need the stars to help you tune the frequency.' },
          ],
        },
        stuck: {
          confused: [
            { zh: '你被困在现在的工作里——可能害怕变动、可能简历还没准备好、可能只是不知道除了这个还能做什么。这种"卡住"的感觉非常真实，也非常磨人。牌面看得到你的疲惫，但它不会催你跳出去。它会先帮你看清：你真正被困住的东西是什么——是环境、是技能、还是你对自己的认知？辨识清楚枷锁的材质，解锁就有了方向。', en: 'You feel trapped in your current job — maybe you\'re afraid of change, maybe your CV isn\'t ready, maybe you just don\'t know what else you could do. This "stuck" feeling is very real and deeply draining. The cards see your exhaustion, but they won\'t push you to jump. They\'ll first help you see: what is actually trapping you — the environment, your skills, or your belief about yourself? Once you know the material of the lock, the key becomes possible.' },
            { zh: '日复一日做着自己不再有热情的工作，像穿着不合脚的鞋走很长的路。你知道该换，但不知道往哪换、能不能换。牌面会给你的不是一个"完美职业方向"，而是一份诚实的自我报告：你身上被这份工作磨掉的自信，和你身上一直没被用起来的潜能。先看清楚自己的底盘，再讨论车的方向——这个顺序很重要。', en: 'Day after day doing work you no longer feel passion for — like walking a long road in shoes that don\'t fit. You know you should change, but you don\'t know where to go, or whether you even can. What the cards will give you isn\'t a "perfect career direction" but an honest self-report: the confidence this job has worn away, and the potential in you that has never been used. First, see your own foundation clearly — then discuss the direction of the car. This order matters.' },
          ],
        },
      },
      wealth: {
        guidance: {
          anxious: [
            { zh: '财富的问题从来不只是数字问题——它涉及你对"安全感"的理解、你对"足够"的定义。牌面会从这两个根开始看起，然后才进入具体的事。因为如果根是松的，再多的数字也填不满那个洞。', en: 'Wealth questions are never just about numbers — they involve your understanding of "security," your definition of "enough." The cards will start from these roots before getting into specifics. Because if the root is loose, no amount of money can fill that hole.' },
          ],
        },
      },
      study: {
        guidance: {
          anxious: [
            { zh: '你正为了某个目标在拼命努力——考试、论文、申请。但你隐隐觉得自己在"用蛮力"，效率不高。牌面会帮你看到：你现在的学习方式哪里有效、哪里该换。学习这件事，走对路比走得快重要一百倍。', en: 'You\'re working hard toward a goal — exam, thesis, application. But you have a nagging feeling you\'re using "brute force" and the efficiency is low. The cards will help you see: what\'s working in your approach, what needs to change. In learning, going the right way is a hundred times more important than going fast.' },
            { zh: '学习到了某个阶段，你开始怀疑：我这么拼命到底是为了什么？这个目标真的是我想要的，还是别人告诉我"应该"要的？牌面愿意陪你先不急着往前冲，先停下来做一件很重要的事——厘清你的动力是来自热爱、恐惧、还是惯性。只有校准了内在的罗盘，你的每一分努力才不会白费。', en: 'At a certain stage of your studies, you start to wonder: what am I pushing so hard for? Is this goal really what I want, or is it what someone told me I "should" want? The cards are willing to stop with you before you charge forward — to do something very important: clarify whether your motivation comes from passion, fear, or habit. Only when your inner compass is calibrated will every ounce of your effort not go to waste.' },
          ],
        },
      },
      destiny: {
        exploration: {
          confused: [
            { zh: '你在某个安静的瞬间，忽然问了自己一个很大的问题：我到底要过什么样的人生？这个追问本身，就是觉醒的开始。牌面不会给你一个"标准答案"，但它们会像镜子一样，一片一片地映出你灵魂中已经存在的渴望——那些被你日常琐事淹没的声音。', en: 'In a quiet moment, you suddenly asked yourself a big question: what kind of life do I truly want? This question itself is the beginning of awakening. The cards won\'t give you a "standard answer," but like mirrors, they\'ll reflect piece by piece the desires already in your soul — voices drowned out by daily noise.' },
            { zh: '命运是一个很大的词，但你对它的好奇是很具体、很个人的。你来，不是要星辰给你一条标注好的路线，而是想听到自己内心最深处的回音。牌面今天的解读就像一场安静的山谷对话——你喊出你的困惑，山谷以牌面的符号回给你。那个回音不是别人，是更真实版本的你自己。', en: 'Destiny is a big word, but your curiosity about it is specific and personal. You came not for the stars to give you a marked route, but to hear the deepest echo from within yourself. Today\'s reading is like a quiet dialogue in a valley — you call out your confusion, and the valley answers back through the symbols of the cards. That echo isn\'t someone else; it\'s a truer version of you.' },
          ],
        },
        purpose: {
          confused: [
            { zh: '你活到了现在，该做的事都做了，但心里有一个声音一直在问："就这样了吗？"这种感觉不是贪婪，不是不知足——它是在提醒你：你的灵魂还有未被使用的部分。牌面会和你一起探索那个"还未活出来的自己"藏在什么地方，以及你现在距离它到底有多远。', en: 'You\'ve lived to this point — you\'ve done what needed to be done — but a voice inside keeps asking: "Is this it?" This feeling isn\'t greed or ingratitude — it\'s reminding you that parts of your soul are still unused. The cards will explore with you where that "unlived self" is hidden, and how far you actually are from it right now.' },
            { zh: '人生意义这个话题有时让人感到沉重，因为它没有标准答案。你来找牌，也许是想在这种漂泊感中找到一个锚。星辰不会替你把锚抛下去，但它们会帮你先看清这片水域：你的天赋在哪一层、你的热情在哪条流、你曾经在哪里感到过真正的"对，就是这里"。这些坐标凑在一起，就是一份属于你自己的星图。', en: 'The topic of life purpose can sometimes feel heavy, because it has no standard answer. You came to the cards perhaps looking for an anchor in this floating feeling. The stars won\'t drop the anchor for you, but they\'ll help you first see these waters: at what depth your gifts lie, in which current your passion flows, and where you once felt truly "yes, right here." These coordinates together form a star chart that belongs only to you.' },
          ],
        },
      },
      general: {
        fallback: [
          { zh: '你带着一个问题来到牌前。这个问题对你来说很重要——重要到足够让你抽出时间、静下心来、向一个古老的智慧系统敞开了自己。这本身就是值得尊重的一步。接下来的解读，牌面不会替代你的判断，但它们会做一件比"告诉答案"更好的事：它们会帮你把问题看透。', en: 'You brought a question to the cards. This question matters to you — enough to make time, quiet your mind, and open yourself to an ancient wisdom system. That alone is a step worthy of respect. The cards won\'t replace your judgment, but they\'ll do something better than "giving answers": they\'ll help you see through the question.' },
        ],
      },
    },
    // ── Card-in-context templates — by position role × domain ──
    card_in_context: {
      past: {
        love: [
          { zh: '回望来路，{cardName}在"过去"的位置揭示了一段已经经历的感情动态。这张牌描绘的能量不是凭空消失的——它已经融入了你，成为你现在看感情的方式的一部分。如果你在现在的感情里反复遇到同一种模式，也许根源就在这里。', en: 'Looking back, {cardName} in the "past" position reveals an emotional dynamic you\'ve already lived. This energy didn\'t vanish — it\'s been absorbed into you, becoming part of how you now see relationships. If you keep running into the same pattern in love, the root may be here.' },
          { zh: '{cardName}在你的来路上留下了它的印记。它不是"已经过去了就没了"——它像一条河流的上游，决定了现在水质的清浊。理解这张牌，就是理解你现在为什么会对某类人特别敏感，对某类情况特别回避。', en: '{cardName} has left its mark on your path here. It\'s not "gone because it\'s past" — like the upstream of a river, it determines the clarity of the current water. Understanding this card is understanding why you\'re sensitive to certain people and avoidant of certain situations.' },
        ],
        career: [
          { zh: '过去的职业经历中，{cardName}的能量留下了痕迹。它可能代表某个关键的决定、一段重要的关系、或者一次失败或成功——不管是什么，它塑造了你现在的职业版图。看看它，也许就能理解为什么你现在会站在这个位置。', en: 'In your past career, the energy of {cardName} left its mark. It might represent a key decision, an important relationship, or a failure or success — whatever it was, it shaped your current career landscape. Seeing it clearly may help you understand why you\'re standing where you are now.' },
          { zh: '你职业生涯的上一章节中，{cardName}扮演了一个你不一定意识到的角色。它可能是一个你学到了东西但没被公平对待的项目、一个你当时觉得"浪费了时间"现在才发现有用的岗位——或者是那个教会了你"不值得"的经历。过去的不是翻篇了，它是你职业地基的一部分。', en: 'In the previous chapter of your career, {cardName} played a role you may not have fully realized. It could be a project where you learned something but weren\'t treated fairly, a position you thought was "a waste of time" that now proves useful — or the experience that taught you what you\'re not willing to tolerate. The past isn\'t just over — it\'s part of your career foundation.' },
        ],
        general: [
          { zh: '{cardName}处在"过去"的位置，它的能量已经流过你的人生。它所代表的经历——无论喜悦还是艰难——都已经沉淀为你的一部分。它不是来让你后悔的，而是来告诉你：你已经从那里走到了这里。', en: '{cardName} sits in the "past" position — its energy has already flowed through your life. The experience it represents — whether joyful or difficult — has settled into who you are. It\'s not here to make you regret; it\'s here to show: you\'ve already walked from there to here.' },
        ],
      },
      present: {
        love: [
          { zh: '此刻感情的核心，凝聚在{cardName}这张牌上。它不是来描述你"应该怎样"的——它只是诚实地映照出你现在实际的状态：你真实的渴望、你未说出口的不安、你在这段关系里真正在意的部分。看这张牌，就是在看镜子里的自己。', en: 'Right now, the core of your love life centers on {cardName}. It\'s not here to tell you "how you should be" — it honestly mirrors your actual state: your real desires, your unspoken unease, what you truly care about in this relationship. Looking at this card is looking in a mirror.' },
          { zh: '{cardName}就是此刻你感情世界的缩影。你所有的小动作、深夜的反复思量、发出去又撤回的消息——所有这些，都在这一张牌的能量里凝聚成了一个可以看清的形状。花时间认识它，就是花时间认识你自己。', en: '{cardName} encapsulates your emotional world right now. All your small gestures, late-night overthinking, messages sent and unsent — all of this crystallizes into a visible shape in this card\'s energy. Spending time with it is spending time with yourself.' },
        ],
        career: [
          { zh: '{cardName}正站在你事业的现在时刻。它描述了你目前的工作状态——可能是一个挑战、一个机会、或者一种日复一日的模式。注意这张牌在说：你现在的处境不是"碰巧就这样了"，它有形成的原因和走出来的方向。', en: '{cardName} stands at the present moment of your career. It describes your current work state — maybe a challenge, an opportunity, or a daily pattern. Notice what this card is saying: your current situation didn\'t happen "by accident." It has causes and directions out.' },
          { zh: '此刻的职业生涯，被{cardName}的能量包围着。你可能正在某个项目的半途中、某段官僚程序的等待里、或某个角色的调整期。牌面不会告诉你"该不该继续"，但它会让你看到：处于这张牌所代表的阶段，你最不该浪费的是什么——是时间、是机会、还是一个难得的积累窗口。', en: 'Your career at this moment is surrounded by the energy of {cardName}. You may be in the middle of a project, waiting through bureaucracy, or in a role transition. The card won\'t tell you "stay or leave," but it will show you: in the phase this card represents, what you most shouldn\'t waste — time, opportunity, or a rare window of accumulation.' },
        ],
        general: [
          { zh: '{cardName}正位于你的当下——此时此刻最活跃的那股能量。它是你的十字路口，也是你的立足点。从这里出发，每一种选择都在它提供的背景中展开。理解这张牌，就是理解你现在的"起跑线"。', en: '{cardName} is at your present — the most active energy right now. It is both your crossroads and your foothold. Every choice from here unfolds against the backdrop it provides. Understanding this card is understanding your "starting line" right now.' },
        ],
      },
      future: {
        love: [
          { zh: '前路之上，{cardName}已经在地平线上隐隐浮现。它不是一个确定的结局——没有一张牌是——但它是一个强烈的"可能性信号"。如果现在的趋势继续下去，这股能量就会出现在你感情的下一段路途上。你喜欢这个方向吗？不喜欢的话，现在还有时间调整。', en: 'On the road ahead, {cardName} is already faintly visible on the horizon. It\'s not a fixed outcome — no card is — but it\'s a strong "possibility signal." If current trends continue, this energy will appear in the next stretch of your love life. Do you like this direction? If not, there\'s still time to adjust.' },
        ],
        career: [
          { zh: '在事业的前方，{cardName}隐隐现出了轮廓。它告诉你：如果当前的轨迹不变，你会走向怎样的职业场景。注意，它不是在预测命运——它是在给你看"如果不做调整会走到哪"。如果你看到的不是你想要的，改变航向的最佳时间就是现在。', en: 'In your career future, {cardName} is taking shape. It tells you: if the current trajectory holds, what kind of professional scene you\'re heading toward. Note: it\'s not predicting fate — it\'s showing "where you\'ll end up if nothing changes." If what you see isn\'t what you want, the best time to adjust course is now.' },
          { zh: '{cardName}在你职业道路的前方立了一块路牌。别把它当终点站——它是"当前速度下的下一个路口"。它可能在描绘一个晋升、一个转型、或一个你需要警惕的坑。关键不是它说了什么，而是你看到这个路口的时候，是想踩油门、踩刹车、还是方向盘打到底调头。那个反应才是你的指南针。', en: '{cardName} has set a signpost ahead on your career path. Don\'t take it as the final station — it\'s "the next intersection at your current speed." It may be depicting a promotion, a pivot, or a pothole to watch for. The key isn\'t what it says, but whether, upon seeing this junction, you want to accelerate, brake, or turn the wheel all the way. That reaction is your compass.' },
        ],
        general: [
          { zh: '{cardName}抬起手指向你的未来——不是判决，而是路标。它说："按你现在的走法，你会走到这里。"这话的价值不在于准不准，而在于你是否喜欢那个方向。不喜欢？现在就是转弯的时刻。', en: '{cardName} lifts its hand toward your future — not a sentence, but a signpost. It says: "at your current pace and direction, you\'ll arrive here." The value isn\'t in whether it\'s accurate, but whether you like that direction. If not, now is the time to turn.' },
        ],
      },
      obstacle: {
        love: [
          { zh: '在感情的路上，{cardName}设下了一道坎。这坎不一定是"对方有问题"或"你有问题"——它提示的是一个模式：某个反复出现的互动方式、某种你自己都没注意到的防御。牌面不是在说"你遇到了坏人"；它在说"你的感情模式里有一个结，而这个结正在被触及"。看见它，就等于解了一半。', en: 'On your path of love, {cardName} marks a hurdle. This hurdle isn\'t necessarily "they have a problem" or "you have a problem" — it signals a pattern: a recurring way of interacting, a defense mechanism you haven\'t noticed yourself. The card isn\'t saying "you met a bad person"; it\'s saying "there\'s a knot in your relationship pattern, and it\'s being touched right now." See it, and you\'ve already untied half of it.' },
          { zh: '{cardName}在"障碍"的位置指向了你感情中一个微妙的阻碍——不是你不够好，也不是TA不够好，而是某种你们之间的动力已经偏离了平衡。可能是给予和接收失衡了、可能是安全感分配不匀了、可能是有一方习惯了迁就而另一方习惯了不珍惜。牌面帮你看清这个失衡在哪——修复的第一步永远是"看见"。', en: '{cardName} in the "obstacle" position points to a subtle blockage in your love life — not that you\'re not enough, not that they\'re not enough, but that a certain dynamic between you has gone off balance. Maybe giving and receiving are lopsided, maybe security is unevenly distributed, maybe one has gotten used to accommodating and the other to taking for granted. The card helps you see where the imbalance is — the first step of repair is always "seeing."' },
        ],
        general: [
          { zh: '横在你面前的，是{cardName}所象征的这股能量。障碍不一定是坏事——有时候它是一扇锁了门，里面的课程是你必须学的。这张牌就是在告诉你：你的挑战是什么，以及为什么偏偏是这个挑战出现在了你面前。', en: 'What stands before you is the energy {cardName} represents. Obstacles aren\'t always bad — sometimes they\'re a locked door, and the lesson inside is one you must learn. This card tells you: what your challenge is, and why this particular challenge appeared before you.' },
          { zh: '{cardName}横亘在你的路上。它不是来打败你的——它是来唤醒你的。每道障碍都对应着一个你还没有完全掌握的东西。看看这张牌在教什么：是勇气、是耐心、是边界、还是放下？学会那个东西，这道障碍就变成了台阶。', en: '{cardName} stands across your path. It\'s not here to defeat you — it\'s here to awaken you. Every obstacle corresponds to something you haven\'t fully mastered. See what this card is teaching: courage, patience, boundaries, or letting go? Master that, and this obstacle becomes a stepping stone.' },
          { zh: '{cardName}是一道被精心放置在路上的门槛。门槛的存在不是为了阻止你——而是为了确认你是否真的准备好进入下一段。许多人遇到障碍的第一反应是绕开、或者硬撞。牌面建议第三种方式：停下来，认真地看这道障碍的形状。它的形状就是你需要学习的那个东西的形状。', en: '{cardName} is a threshold deliberately placed on your path. It\'s not here to stop you — but to confirm whether you\'re truly ready to enter the next phase. Most people\'s first reaction to an obstacle is to go around it, or crash through it. The cards suggest a third way: pause, and seriously study the shape of this obstacle. Its shape is the shape of the thing you need to learn.' },
        ],
      },
      advice: {
        love: [
          { zh: '关于感情，{cardName}给的忠告不在"分不分"上——在"怎么活"上。它可能在说：你需要更多的独立空间，或你需要学会表达而不是忍住，或你需要先修复和自己的关系再进入和他的关系。牌面的建议从来不指向对方；它指向的永远是你——那个唯一能让你变得更完整的人。', en: 'About love, the advice from {cardName} isn\'t about "stay or leave" — it\'s about "how to live." It may be saying: you need more independence, or you need to learn to express rather than suppress, or you need to repair your relationship with yourself before entering one with them. The cards\' advice never points to the other person; it always points to you — the only person who can make you more whole.' },
          { zh: '在感情中，{cardName}送来了一份你未必想听、但确实用得上的忠告。有时候最好的感情建议不是"怎么让对方更爱你"，而是"你怎么才能在感情里不丢了自己"。牌面的建议往往直指这个——因为丢了你自己，就算对方给了你一切，你也会觉得不够。', en: 'In love, {cardName} delivers advice you may not want to hear but genuinely need. Sometimes the best relationship advice isn\'t "how to make them love you more," but "how to not lose yourself in love." The cards\' advice often points right here — because if you lose yourself, even if they give you everything, it still won\'t feel like enough.' },
        ],
        general: [
          { zh: '{cardName}给出的建议很清楚。它不是在说"你应该这样"，而是在说"如果你愿意试试这个角度，事情会打开新的空间"。建议从来不等于命令。你可以试试看，也可以保持现状——但至少要知道还有另一种可能的活法。', en: 'The advice from {cardName} is clear. It\'s not saying "you should do this," but rather "if you\'re willing to try this angle, new space will open up." Advice is never a command. You can try it, or keep things as they are — but at least know there\'s another possible way to live.' },
          { zh: '星辰通过{cardName}递来了一份忠告。注意它不是来自外面的说教——它来自你的牌阵，来自你放大了的直觉。所以如果这份建议让你觉得"好像有点对"，请认真对待它。那是你自己的智慧，借了一张牌的面孔来见你。', en: 'The stars offer counsel through {cardName}. Note: this isn\'t external preaching — it comes from your spread, from your amplified intuition. So if this advice feels "somehow right," take it seriously. It\'s your own wisdom, wearing the face of a card to meet you.' },
          { zh: '{cardName}把它的忠告轻放在你面前——不是砸下来的，是放下来的。好的建议从来不会让你觉得自己很差；它只会让你觉得"哦，原来还可以这样想"。如果这份建议触动了你心里某个地方，在那个触动处多停留一会儿。那里就是生长点。', en: '{cardName} places its counsel gently before you — not dropped, but laid down. Good advice never makes you feel inadequate; it only makes you think "oh, I could see it that way." If this advice touches somewhere in your heart, stay there a little longer. That\'s where growth happens.' },
        ],
      },
      outcome: {
        love: [
          { zh: '感情的长远走向由{cardName}来描绘。它不是"你们一定会怎样"的判决——而是"如果现有的模式不改变，你们会走到这里"。注意看这张牌的能量：它是温暖的还是沉重的、是开放的还是封闭的、是流动的还是凝固的。那些特质，就是你现在的感情模式在时间里的投影。', en: 'The long-term trajectory of your love life is shown by {cardName}. It\'s not a verdict of "you two will definitely..." — but "if current patterns persist, this is where you\'ll arrive." Notice the energy of this card: is it warm or heavy, open or closed, flowing or frozen? Those qualities are the projection of your current relationship patterns through time.' },
          { zh: '{cardName}在结局的位置上，说出了一个你不一定敢大声承认的东西——你希望这段感情走向哪里。它可能是你最渴望的画面，也可能是一个你需要准备的告别。无论哪种，这张牌都值得你非常诚实地面对。因为你对这份结局的下意识反应——是松了口气还是胸口发紧——已经告诉了你比牌面更多的东西。', en: '{cardName} in the outcome position says something you may not have dared to admit out loud — where you actually hope this relationship goes. It may be the picture you most long for, or a farewell you need to prepare for. Either way, this card deserves your total honesty. Because your gut reaction to this outcome — relief or tightness in the chest — has already told you more than the card itself.' },
        ],
        general: [
          { zh: '最终的走向由{cardName}来描绘。它不是一个"必定发生"的结局——而是一个"按现有轨迹最可能到达的目的地"。你现在对这份终极位置的反应，也许比这张牌本身更有意义。如果你看着它觉得安心，说明你走对了路；如果你觉得不安，那不安本身就是最好的导航。', en: 'The final direction is depicted by {cardName}. It\'s not an "inevitable" outcome — but the "most likely destination given the current trajectory." Your reaction to this destination may matter more than the card itself. If it brings peace, you\'re on the right path; if unease, that unease is itself the best navigation.' },
          { zh: '{cardName}是牌阵赠予你的最后一道图景。它不是一个必须到达的终点，而是一束照向终点的光。光不逼你走，也不押着你走——它只是让你看清楚那个方向的样子。现在的你，比刚才更清楚地知道自己正在往哪个方向走。那个知道本身，就是这份解读最核心的收获。', en: '{cardName} is the final image the spread offers you. It\'s not a destination you must reach, but a light shining toward the horizon. The light doesn\'t push you or force you — it only helps you see what that direction looks like. Right now, you know more clearly which way you\'re heading than you did before. That knowing itself is the core gift of this reading.' },
        ],
      },
      self: {
        love: [
          { zh: '在感情这个领域里，{cardName}直接映出了你的模样——不是你在社交媒体上的样子，不是你在约会时精心营造的形象，而是你在最亲密关系里真实的存在状态。这张牌可能在说：你在感情里是那个"更害怕失去的人"、是那个"习惯了要照顾对方情绪的人"、或者是那个"不太敢索要自己想要的东西的人"。认出这些，你就开始了。', en: 'In the realm of love, {cardName} directly reflects who you are — not the version on social media, not the image you carefully craft on dates, but your real presence in the most intimate relationship. This card may be saying: in love, you\'re the one "more afraid of losing," the one "used to managing their emotions," or the one who "doesn\'t quite dare to ask for what you want." Recognize these, and you\'ve begun.' },
          { zh: '{cardName}在"自我"的位置上提出一个温柔但直接的问题：你在感情里，是你的"完整版"还是"删减版"？删减版——为了迎合对方而藏起某些部分的自己。完整版——即使那些部分不完美，也敢让它们被看到。牌面不评判你是哪个版本，它只是提醒你：删减得太多太久了，你会需要花同样多的时间把那些部分找回来。', en: '{cardName} in the "self" position asks a gentle but direct question: in love, are you your "full version" or the "edited version"? The edited version — hiding parts of yourself to please them. The full version — letting even the imperfect parts be seen. The card doesn\'t judge which version you are; it only reminds: if you\'ve been editing too much, too long, it will take just as much time to recover those lost parts.' },
        ],
        general: [
          { zh: '关于此刻的你自己，{cardName}给出了一面清晰的镜子。它反映的是"你现在的状态"——不是你想表现出来的样子，不是别人眼中的你，而是你独处时真实的状态。接纳这个版本，改变才可能发生。', en: 'About yourself right now, {cardName} offers a clear mirror. It reflects "your current state" — not the version you want to show, not how others see you, but the real you when you\'re alone. Accept this version, and change becomes possible.' },
          { zh: '{cardName}给了你一张自画像——也许不是你喜欢的那张，但它画得很真。真实的东西有一种"不美但可靠"的品质。别急着修饰或否认；看看这张牌指出的那个特质——它可能恰恰是你当前处境里最需要被你自己承认的东西。承认不是认输，是认路。', en: '{cardName} has drawn you a self-portrait — maybe not one you like, but it\'s honest. Truth has a quality of being "not pretty but reliable." Don\'t rush to touch it up or deny it; look at the trait this card points to — it may be exactly what you most need to acknowledge in your current situation. Acknowledging isn\'t admitting defeat — it\'s admitting where you actually stand.' },
        ],
      },
      environment: {
        love: [
          { zh: '在感情环境里，{cardName}映照出包围着你的社交与关系氛围——你们的共同朋友、家人的态度、社会圈子的期待。这些外部力量无形但有力：它们能让一段其实还不错的感情显得"有问题"，也能让一段确实有问题的感情看起来"还过得去"。牌面帮你看清这些微妙的外部压力，让你分辨哪些声音是你自己的、哪些是环境的。', en: 'In your love environment, {cardName} mirrors the social and relational atmosphere around you — mutual friends, family attitudes, social-circle expectations. These external forces are invisible but powerful: they can make a decent relationship seem "problematic," and a truly troubled one seem "fine." The card helps you see these subtle external pressures, so you can distinguish which voices are your own and which belong to the environment.' },
          { zh: '{cardName}描绘了你的"关系气候"——不单是你们两个人的事，还包括那些你说不清但感受得到的氛围：朋友是不是认可、家里人是不是在催、你们共同的生活圈子是不是在给你们空间。有时候一段关系的问题不是出在两个人身上，而是出在他们所处的"土壤"里。这张牌让你看看那片土壤。', en: '{cardName} depicts your "relationship climate" — not just things between the two of you, but the atmosphere you can sense without being able to name: whether friends approve, whether family is pushing, whether your shared social circle gives you space. Sometimes a relationship\'s problem isn\'t in the two people — it\'s in the "soil" they\'re planted in. This card lets you look at that soil.' },
        ],
        general: [
          { zh: '你周围的环境，如同{cardName}所示——它描绘的是"氛围"，是包围着你的那些人和事的气场。环境不像你自己那么容易被改变，但你可以选择如何应对它。这张牌帮你看清：你身处怎样的能量场中。', en: 'Your environment, as shown by {cardName} — it depicts the "atmosphere," the aura of people and things around you. Environment isn\'t as easy to change as yourself, but you can choose how to respond to it. This card helps you see: what energy field you\'re in.' },
          { zh: '{cardName}画出了你此刻身处的这片天地——你周围的人、你接收到的信息、你浸泡在其中的文化或氛围。环境有时候比你自己的意志更有力——它帮着你或者拦着你，你都不一定意识得到。看清环境的好处是：一旦看清了，你就能决定是要适应它、离开它、还是在它里面为自己辟出一块不同的空间。', en: '{cardName} sketches the world around you right now — the people near you, the information reaching you, the culture or atmosphere you\'re steeped in. Environment is sometimes more powerful than your own will — helping or hindering you without you even noticing. The benefit of seeing it clearly: once you do, you can decide whether to adapt to it, leave it, or carve out a different space within it for yourself.' },
        ],
      },
      hopes: {
        general: [
          { zh: '你内心深处的渴望在{cardName}中找到了回响。这张牌说的是那些连你自己都不一定敢大声说出来的期待——对爱、对成功、对某种生活的向往。注意它和现实之间的落差：那个落差不说明你错了，但也许说明你该调整期待，或者调整路线。', en: 'Your deepest hopes find an echo in {cardName}. This card speaks of the expectations you may not dare to say out loud — longings for love, success, a certain kind of life. Notice the gap between it and reality: that gap doesn\'t mean you\'re wrong, but perhaps you need to adjust expectations, or adjust your route.' },
          { zh: '{cardName}是牌阵中那扇朝向"更好版本"的窗。它映出了你的理想——那种你私下里偷偷想过但觉得"不太可能吧"的生活。牌的职责不是打击你的理想，而是让你诚实地面对它：这份渴望是走在成为现实的路上、还是被你锁在了"以后再说"的抽屉里太久了？渴望不是用来实现的，但它值得被认真地看一眼。', en: '{cardName} is the window in the spread that faces toward a "better version." It reflects your ideal — the kind of life you\'ve privately imagined but thought "that\'s probably not realistic." The card\'s job isn\'t to crush your ideals, but to have you face them honestly: is this longing on its way to becoming real, or has it been locked in the "I\'ll get to it later" drawer too long? Longing isn\'t just for achieving — but it\'s worth looking at seriously.' },
        ],
      },
    },

    // ── Practical advice templates — by domain × sentiment ──
    practical_advice: {
      love: {
        anxious: [
          { zh: '说白了：你现在最需要的不是答案，是空间。退后一步，让自己冷静三天。三天后你再回来看这件事，很多东西会自己变清楚。', en: 'Frankly: what you need most right now isn\'t an answer, it\'s space. Step back and give yourself three days to calm down. When you look at this again after three days, many things will clarify themselves.' },
          { zh: '试一个简单的方法：把你脑子里所有关于这段关系的担忧写在一张纸上，然后在每条旁边回答"这是我确定的还是我猜的"。你会发现多数让你不安的东西都是猜的——不是真的。', en: 'Try a simple exercise: write down every worry about this relationship on paper, then next to each one answer "is this something I know, or something I\'m guessing." You\'ll find most of what bothers you is guessing — not real.' },
          { zh: '你现在的情绪很强烈，这很正常。但在这种状态下做任何"要不要分手/要不要表白"之类的重大决定，大概率会后悔。等一等。等到你觉得平静了——哪怕只有一点点——再做决定。', en: 'Your emotions are intense right now — that\'s normal. But making any big decision like "should I break up / should I confess" in this state will likely lead to regret. Wait. Until you feel calm — even just a little — then decide.' },
          { zh: '如果对方的态度忽冷忽热，你用不着去猜为什么。一个简单的事实：一个人如果在乎你，你不会需要反复确认这一点。与其花精力解读TA的模糊信号，不如把那份精力用在让自己开心的事上——后者的回报是确定的。', en: 'If they blow hot and cold, you don\'t need to guess why. A simple fact: if someone truly cares about you, you won\'t need to keep confirming it. Instead of spending energy decoding their mixed signals, put that energy into something that reliably makes you happy — the return on that is certain.' },
          { zh: '你反复在想"是不是我哪里做得不够好"。停。关系是两个人的事，别把所有责任往自己身上扛。先分清哪些是你的部分、哪些是对方的。属于你的那部分你可以改进，但不属于你的部分——你替TA扛了对谁都没好处。', en: 'You keep replaying "what did I do wrong." Stop. A relationship involves two people — don\'t carry all the weight on your own shoulders. First separate what\'s yours from what\'s theirs. The part that\'s yours, you can work on. But the part that\'s theirs — carrying it for them helps no one.' },
        ],
        hopeful: [
          { zh: '你的期待是好的，但记住：一段健康的关系不是"终于有人来救我了"，而是"我自己活得不错，有人愿意加入"。保持你的独立性，那恰恰是最迷人的部分。', en: 'Your hope is good, but remember: a healthy relationship isn\'t "someone finally came to save me," it\'s "I\'m doing well on my own, and someone wants to join." Maintain your independence — that\'s exactly the most attractive part.' },
          { zh: '如果这是新感情，别急着把所有情绪都投进去。好东西需要在低火慢炖中成熟。先做朋友，再做伴侣——这个顺序从来不会错。', en: 'If this is new love, don\'t rush to invest all your emotions at once. Good things need to simmer on low heat. Be friends first, partners later — this order is never wrong.' },
          { zh: '你的心门现在是打开的，这很好。但在完全投入之前，先观察三件事：TA怎么对待服务人员、TA怎么处理分歧、TA怎么描述前任。这三个小窗口能看到一个人的全貌——比你听TA说了多少"我喜欢你"都管用。', en: 'Your heart is open — that\'s good. But before diving all the way in, observe three things: how they treat service staff, how they handle disagreements, how they describe their ex. These three small windows reveal a person\'s full character — more than any amount of "I like you" ever will.' },
          { zh: '新鲜感很迷人，但它不是地基。花时间看看这个人的日常——不是约会时的样子，而是TA独处时的样子。长期关系过的不是周末，是日常。一个能在平淡中让你安心的人，比一个只在精彩中让你兴奋的人，更适合走远路。', en: 'New-relationship energy is intoxicating, but it\'s not a foundation. Take time to see this person\'s daily self — not the date-night version, but who they are when alone. A long-term relationship isn\'t lived on weekends; it\'s lived in the ordinary. Someone who brings you peace in the plain moments is better suited for the long road than someone who only excites you during the highlights.' },
        ],
        painful: [
          { zh: '我知道你很痛。但请记住一个简单的身体事实：你在哭、在失眠、在吃不下饭——你的身体在替你承受情绪。从现在开始，每天至少做一件照顾身体的事：好好吃一顿、出去走十分钟、早点睡。身体撑住了，心才能慢慢愈合。', en: 'I know you\'re hurting. But remember a simple physical fact: you\'re crying, not sleeping, not eating — your body is carrying your emotions for you. Starting today, do at least one thing daily to care for your body: eat well, walk for ten minutes, sleep early. When the body holds, the heart can slowly heal.' },
          { zh: '分手后的这段时间，少看点"TA过得怎么样"的信息。每次看都是在用自己的手撕刚刚结痂的伤口。把关注从TA那里拿回来，放在自己身上。你不需要知道TA的近况来证明自己过得好。', en: 'During this post-breakup period, check less on "how they\'re doing." Every check is re-tearing a wound that just started scabbing. Take your attention back from them and put it on yourself. You don\'t need to know how they\'re doing to prove you\'re doing well.' },
          { zh: '我知道你现在听到"时间会治愈一切"会烦。但换个说法：你不会"忘记"，但你会"吸收"。就像身体吸收了一道旧伤，留下疤但不再痛。这个过程不能加速，但可以被善待——对自己好一点，别拿别人的错误惩罚自己太久。', en: 'I know hearing "time heals everything" is annoying right now. But let me rephrase: you won\'t "forget," but you will "absorb." Like the body absorbs an old injury — a scar remains, but the pain fades. This process can\'t be sped up, but it can be treated kindly. Be gentle with yourself — don\'t punish yourself for someone else\'s mistakes.' },
          { zh: '如果你总是在想TA——那很正常。但每次想到TA的时候，同时也想一件关于自己的好的事。这个练习不是为了忘记，是为了平衡：你的故事不只有TA。你的故事里有你的力量、你的温柔、那些在没有TA的时候也闪闪发光的部分。', en: 'If you keep thinking about them — that\'s normal. But every time you think about them, also think of one good thing about yourself. This practice isn\'t for forgetting — it\'s for balance: your story isn\'t only about them. Your story contains your strength, your tenderness, the parts that shine even without them.' },
        ],
        confused: [
          { zh: '你搞不清楚这段关系到底是好是坏。教你一个判断标准：不看TA说了什么，看TA做了什么。对方的行为比对方的话语诚实一百倍。最近三个月，TA的行为让你感觉温暖还是寒心？', en: 'You can\'t tell if this relationship is good or bad. Here\'s a test: don\'t look at what they say, look at what they do. Actions are a hundred times more honest than words. In the last three months, have their actions made you feel warm or cold?' },
        ],
      },
      career: {
        anxious: [
          { zh: '务实地说：先别忙着做"我的人生方向是什么"这么宏大的决定。从最小的一件事开始：明天上班时，把注意力放在"今天哪个小时的工作让我最有干劲"。连续观察一周，你会看到自己的能量地图。比任何职业测试都准。', en: 'Practically speaking: don\'t rush to make a grand "what\'s my life direction" decision. Start with the smallest thing: tomorrow at work, pay attention to "which hour of work gave me the most energy." Track this for a week and you\'ll see your energy map. More accurate than any career test.' },
          { zh: '如果你在考虑换工作：不要因为"讨厌现在"而跳，要因为"想要某个未来"而跳。这两者的区别是：前者会让你在下一份工作里遇到一样的问题，后者才会实际改变你的处境。', en: 'If you\'re considering changing jobs: don\'t jump because you "hate the current one," jump because you "want a certain future." The difference: the first will bring the same problems to your next job, the second will actually change your situation.' },
          { zh: '你怕的不是工作本身，是那种"被困住"的感觉。这周做一件事：更新你的简历。不是为了投，而是为了让自己看到——你积累了多少可以带走的能力。看到那些，你会觉得自己不那么被动。你不是被困住了，你只是在等待一个值得跳的时机。', en: 'What you fear isn\'t the work itself — it\'s that "stuck" feeling. Do one thing this week: update your resume. Not to send it out, but to see for yourself — how much portable skill and experience you\'ve accumulated. Seeing it will make you feel less passive. You\'re not trapped; you\'re just waiting for the right moment to move.' },
          { zh: '别用"我是不是走错了路"这种大问题压自己。换一个小问题："接下来的一个月，我可以在工作中多做哪个类型的任务？"小问题比大问题容易回答，而且答案往往通向同一个地方。一步一步来，方向会在行走中自己变清楚。', en: 'Stop crushing yourself with big questions like "am I on the wrong path?" Swap it for a smaller one: "in the next month, what type of tasks can I do more of at work?" Small questions are easier to answer than big ones, and the answers often lead to the same destination. Take it step by step — the direction will clarify itself as you walk.' },
        ],
        confused: [
          { zh: '你面对的选择可能不是A还是B的问题。有时候两个选项都不对，真正值得你去的是第三个——你还没看到的那个。在选A和B之前，先问自己：除了这两条路，还有没有我没想到的可能性？', en: 'The choice you\'re facing might not be A vs B. Sometimes both options are wrong, and what\'s worth pursuing is a third — one you haven\'t seen yet. Before choosing A or B, ask: besides these two paths, is there a possibility I haven\'t thought of?' },
          { zh: '有一个办法可以帮你做出决定：假设你已经选了A，体验那种感觉一整天。第二天假设你选了B，再体验一整天。你的身体会告诉你哪个更对——胃不骗人，肩膀的松紧也不骗人。身体知道头脑还在纠结的答案。', en: 'Here\'s a method to help you decide: pretend you\'ve already chosen Option A, and live with that feeling for a full day. The next day, pretend you chose Option B, and live with that. Your body will tell you which feels more right — the stomach doesn\'t lie, and neither does the tightness in your shoulders. The body knows the answer the mind is still debating.' },
          { zh: '如果你在两个选项之间反复摇摆了很久，那很可能两个选项都不够好。真正值得你的东西，它会让你感到一种"虽然怕但还想往前走"的冲动——不是"两个都不好，选一个不那么差的"。别急着在差的里面挑，先等等看有没有第三个。', en: 'If you\'ve been swinging between two options for a long time, chances are neither is good enough. What\'s truly worth your time will make you feel "I\'m scared but I still want to move toward it" — not "both are bad, let me pick the less terrible one." Don\'t rush to pick from bad options. Wait and see if a third one appears.' },
        ],
      },
      wealth: {
        anxious: [
          { zh: '财务焦虑的本质不是"钱不够"，是"控制感的缺失"。你做两件事：第一，把你所有的收入和支出列清楚——不确定的东西一旦变成数字写到纸上，焦虑就减了一半。第二，从这个月开始，不管多困难，固定存下收入的5%。比例小是为了让你不难坚持——坚持比多少重要。', en: 'The essence of financial anxiety isn\'t "not enough money" — it\'s "lack of control." Do two things: First, list all your income and expenses clearly — once uncertainty becomes numbers on paper, anxiety halves. Second, starting this month, no matter how hard, save 5% of income. Small so you can sustain it — consistency matters more than amount.' },
        ],
        hopeful: [
          { zh: '机会在靠近，但每一个理财的机会都值得你花时间去核实。别因为"这个机会看起来很对"就跳进去。花三天查资料、问懂行的人、搞清楚它到底是怎么运作的。三天换后面三年不后悔，很值。', en: 'Opportunity is approaching, but every financial opportunity deserves time to verify. Don\'t jump in just because "it looks right." Spend three days researching, asking people who know, understanding exactly how it works. Three days to avoid three years of regret is totally worth it.' },
        ],
      },
      study: {
        anxious: [
          { zh: '学习效率低下的时候，最该做的不是"更努力"，而是"换方法"。试试：把要学的内容分成小块，每25分钟集中学一块，然后休息5分钟。学完四块休息久一点。这个方法很老套，但就是因为有效才老套。', en: 'When study efficiency is low, what you need most isn\'t "work harder" but "change methods." Try: break content into small chunks, focus on one chunk for 25 minutes, then rest 5 minutes. After four chunks, take a longer break. This method is old-fashioned, but it\'s old-fashioned precisely because it works.' },
        ],
      },
      destiny: {
        confused: [
          { zh: '不知道往哪走的时候，别坐在家里空想。去试着做点什么——任何你有一点点兴趣的事。行动本身会产生新的反馈、新的感受、新的线索。方向不是想出来的，是走出来的。', en: 'When you don\'t know which way to go, don\'t sit at home thinking. Go try something — anything you have even a little interest in. Action itself generates new feedback, new feelings, new clues. Direction isn\'t thought out; it\'s walked out.' },
          { zh: '也许你现在的迷茫不是因为你少了什么，而是因为你正在蜕皮。蛇蜕皮的时候眼睛最模糊，但那是成长的一部分。给自己时间，别强迫自己"马上想清楚"。', en: 'Maybe your current confusion isn\'t because you\'re missing something, but because you\'re shedding skin. A snake\'s vision is blurriest during shedding — but that\'s part of growth. Give yourself time. Don\'t force yourself to "figure it out immediately."' },
        ],
      },
      general: {
        anxious: [
          { zh: '不管具体是什么事——当你觉得要撑不住的时候，先处理身体：深呼吸五次、喝一杯温水、把手掌放在膝盖上感受温度。身体稳住了，思维才有着陆的地方。别小看这几分钟；它们是你在混乱中为自己争取的一小片"有序"。', en: 'Whatever it is — when you feel like you can\'t hold on anymore, attend to your body first: five deep breaths, a glass of warm water, place your palms on your knees and feel the warmth. When the body steadies, the mind has somewhere to land. Don\'t underestimate these few minutes — they\'re a small patch of "order" you carve out for yourself in the chaos.' },
          { zh: '焦虑是你内心一个很尽责的保安——它不停地巡逻、拉警报。但它分不清"真正的危险"和"只是不确定"。你不需要开除它，只需要给它更新一下情报：现在没有生命危险，只是有些事还没答案。没答案不等于危险，只是需要多等一会儿。', en: 'Anxiety is a very diligent security guard in your psyche — it patrols nonstop and sounds alarms. But it can\'t tell the difference between "real danger" and "just uncertainty." You don\'t need to fire it — just update its intel: there\'s no life-threatening danger right now, just some things that don\'t have answers yet. No answers doesn\'t equal danger; it just means waiting a little longer.' },
        ],
        hopeful: [
          { zh: '好事在靠近。你现在要做的不是"让它快点来"，而是"准备好接住它的容器"。整理一下你的日程、你的精力分配、你的心情——让空间出来。好东西不会挤进一个已经塞满的人生。清出一点空间，它会自己找到路。', en: 'Something good is approaching. What you need to do now isn\'t "make it come faster" but "prepare a container to receive it." Organize your schedule, your energy, your mindset — make room. Good things won\'t squeeze into an already-packed life. Clear some space, and it will find its own way in.' },
          { zh: '你感觉到某种正向的变化在酝酿。相信这个感觉，但别把它当成"马上就会好"的承诺。希望不是用来消耗的——是用来陪伴你一步一步走的。像一盏灯笼：它不替你走路，但它让你看得见脚下的每一步。', en: 'You sense a positive change brewing. Trust that feeling, but don\'t treat it as a promise that "everything will be good immediately." Hope isn\'t meant to be spent — it\'s meant to accompany you step by step. Like a lantern: it doesn\'t walk the road for you, but it lets you see each step beneath your feet.' },
        ],
      },
    },

    // ── Transition phrases — by narrative logic type ──
    transitions: {
      contrast: [
        { zh: '然而这还不是全部——另一股能量从牌阵的另一端发出了不同的声音……', en: 'Yet this isn\'t the whole story — another energy speaks from the far side of the spread…' },
        { zh: '话虽如此，旁边的那张牌给了我们一个值得深思的补充……', en: 'That said, the card beside it offers a thought-provoking addition…' },
        { zh: '但如果换个角度去看，刚才的节奏会有一个微妙的反转……', en: 'But seen from another angle, the rhythm we just heard takes a subtle turn…' },
        { zh: '表面上好像是这样——但牌面的有意思之处在于，下一张牌提出了另一种可能……', en: 'On the surface it seems so — but the interesting thing about these cards is, the next one offers another possibility…' },
        { zh: '前一张牌的声音是低沉的，但紧接着的这张——它的音调刚好相反，像同一架钢琴的低音键和高音键被同时按下。', en: 'The previous card\'s voice was low, but this next one — its tone is the opposite, like the low and high keys of the same piano pressed at once.' },
        { zh: '这里出现了一个有意思的张力：前面的牌和接下来的这张在说着不同的话，但它们可能都是对的——只是各自站在故事的不同侧面上。好的解读不是选一边站，而是让两边的光同时照进来。', en: 'An interesting tension appears here: the previous card and this next one are saying different things, but they may both be right — each standing on a different side of the story. A good reading doesn\'t pick a side; it lets light pour in from both directions.' },
      ],
      reinforce: [
        { zh: '这还不是全部——更值得注意的是，这股能量在下面的牌中得到了呼应……', en: 'That\'s not all — more notably, this energy finds an echo in the card below…' },
        { zh: '如果说前面那张牌是一个字，那么下一张牌就是同一种语言的完整句子——它们在说同一件事，只是更详细了。', en: 'If the previous card was a single word, the next is a full sentence in the same language — saying the same thing, just in more detail.' },
        { zh: '两张牌在这里形成了一个"重音"——命运在同一个地方敲了两次门。', en: 'Two cards form an "emphasis" here — destiny knocked twice at the same door.' },
        { zh: '这股能量在牌阵中不止一次出现——它在用不同的面孔、不同的措辞，但核心是同一个信息。当一件事被反复提到，往往不是因为你没听懂，而是因为它重要到命运想让你多听几遍。', en: 'This energy appears more than once in the spread — with different faces, different wording, but the core message is the same. When something keeps being mentioned, it\'s usually not because you didn\'t get it — it\'s because it matters enough for destiny to want you to hear it more than once.' },
        { zh: '读到这，你应该有了一种"似曾相识"的感觉——对，这股能量你刚才就看到过。它只是换了一张牌重新出现，像一个说了两遍的叮嘱。重复在牌阵里从来不是啰嗦——是强调，是关键的信号。', en: 'By now you probably have a sense of deja vu — yes, you\'ve seen this energy before. It just reappeared in another card, like an instruction said twice. Repetition in a spread is never redundancy — it\'s emphasis, a crucial signal.' },
      ],
      causal: [
        { zh: '正因如此，这股能量引出了下面这张牌所代表的变化……', en: 'Precisely because of this, this energy gives rise to the shift represented by the next card…' },
        { zh: '前面那张牌留下的影响，顺理成章地落在了这里……', en: 'The influence left by the previous card naturally lands here…' },
        { zh: '这不是巧合——先有前面的因，才结出了这颗果。让我们看看这颗果子是什么。', en: 'This isn\'t coincidence — the cause came first, now this fruit follows. Let\'s see what this fruit is.' },
        { zh: '一根线从上一张牌牵到了这一张——中间没有断过。这就是因果在牌阵中的脉络。', en: 'A thread runs from the last card to this one — unbroken. This is the thread of cause and effect in the spread.' },
        { zh: '你有没有感觉到——前面那张牌留下的东西，在这里变成了另一种形态？不是消失了，是转化了。因果循环在牌阵里从来不是"甲导致乙"这么简单；更多的时候是"甲的能量引发了乙的觉醒"。', en: 'Do you sense it — what the previous card left behind has transformed into something else here? Not disappeared — transformed. Cause and effect in a spread is never as simple as "A leads to B"; more often, it\'s "the energy of A triggered the awakening of B."' },
        { zh: '你会发现前面的事和这里的事之间有一个你可以理解的"因为所以"——不是逻辑公式那种，是人生故事那种。每一个"所以"都有它的"因为"，牌阵就是把这些因果链摊开给你看。', en: 'You\'ll notice a "because-therefore" connection between what came before and what\'s here now — not the logical-formula kind, but the life-story kind. Every "therefore" has its "because," and the spread is laying these causal chains open for you to see.' },
      ],
      question: [
        { zh: '你不妨问问自己：如果这张牌是一面镜子，它照出了你的什么？', en: 'You might ask yourself: if this card were a mirror, what would it reflect about you?' },
        { zh: '读到此处，你是否也感受到一种隐约的共鸣？有时候身体比头脑更早知道答案。', en: 'Reading this, do you feel a faint resonance? Sometimes the body knows the answer before the mind.' },
        { zh: '这张牌在邀请你做一个觉察练习：在你正在经历的这件事里，哪里是你可控的，哪里不是你该负责的？', en: 'This card invites an awareness exercise: in what you\'re going through, what\'s within your control, and what isn\'t your responsibility?' },
        { zh: '暂停一下。别急着往下读。回头再看一眼刚才那张牌的描述——哪句话让你心里"咯噔"了一下？那个瞬间值得你多花几秒钟。它可能比后续所有的解读都更精准地戳中了要害。', en: 'Pause. Don\'t rush to read on. Look back at the previous card\'s description — which sentence made your heart skip a beat? That moment is worth a few more seconds. It may have hit the mark more precisely than everything that follows.' },
        { zh: '你现在脑子里可能会冒出一个声音——"但万一……"、"可是……"。那个"但"后面的内容是重要的。别压住它。牌面能处理的不是你的"确定"，恰恰是你的"不确定"。把你心里那个"但"带进来。', en: 'A voice might pop up in your head right now — "but what if...", "however...". The content after that "but" is important. Don\'t suppress it. What the cards can work with isn\'t your certainty — it\'s precisely your uncertainty. Bring that "but" with you.' },
      ],
      summary: [
        { zh: '牌面到这里，故事的各条线索已经在你的面前交汇。让我们把你走过来的每一步收拢在一起，看一看整幅图景的形状……', en: 'At this point in the spread, the threads of the story have converged before you. Let\'s gather each step you\'ve walked and look at the shape of the whole picture…' },
        { zh: '读完了每一张牌，现在是时候把它们拼成一张完整的地图了。单独的牌是片段——合在一起，它们才讲出一个完整的、只属于你的故事。下面，让我们把所有的线索拉在一起……', en: 'Having read each card, it\'s time to assemble them into a complete map. Individual cards are fragments — only together do they tell a full story, one that belongs uniquely to you. Now, let\'s pull all the threads together…' },
        { zh: '从第一张牌走到现在，你已经看了好几层、好几个角度的信息。在结束之前，让我们把刚才分开看的每一个部分重新整合——像一个乐队，各个乐器分开演奏过之后，该来一次合奏了。', en: 'From the first card to now, you\'ve seen information from several layers and angles. Before we finish, let\'s reintegrate every part we\'ve examined separately — like an orchestra, where each instrument has played solo, and now it\'s time to play together.' },
      ],
    },

    // ── Closing passages — by sentiment × result tendency × card count ──
    closings: {
      simple: [
        { zh: '牌已诉尽其言。将它的低语智慧带入你的今日，让星光指引你的步伐。最真实的预言，是唤醒你内在预言者的那一个。', en: 'The card has spoken its piece. Carry its whispered wisdom into your day, and let the starlight guide your step. The truest oracle is the one that awakens the oracle within you.' },
        { zh: '一张牌，一个词——但它足够重，足够你咀嚼一整天。别急着"想明白"；有些启示不是用脑子懂的，是用日子过明白的。带着它走吧，在一个不经意的下午你会突然懂了。', en: 'One card, one word — but heavy enough to chew on all day. Don\'t rush to "figure it out"; some revelations aren\'t understood with the mind — they\'re understood by living them. Carry it with you; on some unremarkable afternoon, you\'ll suddenly get it.' },
        { zh: '星光透过一张牌落在你手上。它不是答案，不是命令，不是预言——它是一扇窗。窗外的风景你看了一眼，现在该回到自己的路上。但你已经不一样了：你瞥了一眼更大的图景，那一眼会跟着你。', en: 'Starlight falls through a single card into your hands. It isn\'t an answer, a command, or a prophecy — it\'s a window. You\'ve glimpsed the view outside; now return to your path. But you\'re not the same: you\'ve caught a glimpse of a bigger picture, and that glimpse will stay with you.' },
      ],
      moderate: [
        { zh: '这便是牌面揭示的图景——过去与未来的丝线，光与影的交织，全都编入你生命中那独一无二的故事。记住：星辰不命令；它们照亮。你做出的选择、你召唤的勇气、你敢给予的爱——才是所有魔法中最真实的那一种。向前走，不是作为一个被告知了命运的人，而是作为手中握着丝线的人。', en: 'Such is the picture the cards have revealed — threads of past and future, light and shadow, woven into your one irreplaceable story. Remember: the stars do not command; they illuminate. The choices you make, the courage you summon, the love you dare to give — that is the truest magic of all. Walk forward not as one who has been told their fate, but as one who now holds the thread.' },
        { zh: '星辰在此刻选择了静默。不是因为无话可说，而是因为它们已经把能给你的都放进了牌面之中。剩下的那部分——你如何解读、如何感受、如何行动——那才是你独特旅程中最有价值的部分。带着这份图景走吧。牌不替你做决定，但决定从此有了方向。', en: 'The stars choose silence now. Not because they have nothing to say, but because they\'ve already given you everything in these cards. What remains — how you interpret, how you feel, how you act — that is the most valuable part of your unique journey. Go with this picture. The cards won\'t decide for you, but decisions now have direction.' },
        { zh: '牌阵的图景已经完整——过去与现在在此刻交接，未来在几缕若隐若现的线里。你不是来被预测命运的，你是来重新掌握了方向盘的方向。牌给的不是终点的坐标，而是路程中的伴侣。接下来的路，你走——它们只是告诉你脚下的土是什么质地。', en: 'The picture is now complete — past and present meet in this moment, future traced in faint, shimmering lines. You didn\'t come here to be predicted; you came to regain your grip on the wheel. The cards haven\'t given you coordinates for the destination — they\'ve given you a companion for the journey. The road ahead, you walk — they\'ve only told you what the ground beneath your feet is made of.' },
        { zh: '图景已经完整地铺在了你的面前——不是判决书，更接近一张手工绘制的航海图。有的海域标注了礁石，有的风向在提醒你扬帆。但真正的航行从这一刻才开始——从你合上这张解读、回到现实生活的第一个选择开始。星辰已经说了它们的部分，现在该你了。', en: 'The full picture lies before you — not a sentence, closer to a hand-drawn nautical chart. Some waters are marked with reefs, some winds urge you to raise your sails. But the real voyage begins now — from the moment you close this reading and return to the first choice of your ordinary life. The stars have spoken their part; now it\'s yours.' },
        { zh: '牌在这一刻完成了它们的任务——不是揭晓秘密，而是让秘密以一种你能承受的方式变轻。你此刻携带的认知比来时多了一些，但比答案更重要的，是你多了一份看向自己人生的新角度。剩下的不是"应验"，而是"启发"。带着启发走，比带着预言走自由得多。', en: 'The cards have completed their task — not by revealing secrets, but by making those secrets lighter in a way you can bear. You leave carrying more awareness than when you arrived, but more important than answers is the new lens you now have for looking at your own life. What remains isn\'t "verification" but "inspiration." Walking with inspiration is far freer than walking with a prophecy.' },
      ],
      deep: [
        { zh: '如此，星镜渐暗，其影沉入记忆的静谧与明日的种子之中。牌面所揭示的不是判决而是路标——一幅图景，美丽而复杂，独一无二且不可更改地属于你。你不是这故事的被动读者；你是它活生生的作者。现在，去——在同一片自有时间以来便见证了一切人间悲欢的星空之下，以觉醒的双手书写下一章。当你归来之时，牌依然在此。', en: 'And so the celestial mirror dims, its images settling into the quiet of memory and the seed of tomorrow. What the cards have shown is not a sentence but a signpost — a pattern, beautiful and complex, uniquely and irrevocably yours. You are not a passive reader of this story; you are its living author. Go now, under the same stars that have witnessed every human joy and sorrow since the beginning of time, and write the next chapter with awakened hands. The cards will be here when you return.' },
        { zh: '七张牌——七重门。每一扇你都推开过，每一扇后面你都看见了平时不会看见的东西。完整的解读到这里，但你与这些画面之间的关系刚刚开始。往后几天，你可能会在现实里突然想起某张牌——那时你才真正懂了它的意思。解读不是一次性的；它是一个缓慢展开的过程。', en: 'Seven cards — seven doors. You\'ve pushed each one open, and behind each you saw things you don\'t normally see. The full reading ends here, but your relationship with these images has just begun. In the days ahead, a card may suddenly surface in your mind during an ordinary moment — that\'s when you\'ll truly understand what it meant. A reading isn\'t a one-time event; it\'s a slow unfolding.' },
        { zh: '牌面的格局已经在你面前完整地铺开——如同一面由七十余张古老图像精心编织的织锦，每一根丝线都连着你的故事。现在，闭上眼睛，做一次深呼吸，然后睁开：世界还是刚才那个世界，但你看它的眼神已经换过了。这才是牌阵真正的力量——不是改变命运，是改变目光。', en: 'The full pattern of the spread lies before you — like a tapestry woven from seventy-some ancient images, every thread connected to your story. Now close your eyes, take one deep breath, then open them: the world is still the same world, but your eyes have changed. That is the true power of the spread — not changing fate, but changing how you see.' },
      ],
      hopeful: [
        { zh: '最后一张牌翻过来了——而它带来的气息是温暖的。星辰没有忽略你的等待。它们想让你知道：你种下的那些东西，有一些已经在土里悄悄地发了芽。也许现在还看不见，但它们没有死。继续保持你已经在做的——方向是对的，剩下的就是耐心和季节的流转。', en: 'The final card turns — and the air it brings is warm. The stars haven\'t forgotten your waiting. They want you to know: some of what you planted has already quietly germinated in the soil. You may not see it yet, but they haven\'t died. Keep doing what you\'re already doing — the direction is right, what remains is patience and the turning of seasons.' },
        { zh: '牌阵收束在一片温和的光里。不是耀眼的白光——是那种黄昏时分透过树叶洒在桌面上的暖金色。它在说：你的路还在，你没有走错，你的坚持已经开始在看不见的地方凝结成形。继续走，别急——好消息不怕晚。', en: 'The spread gathers into gentle light. Not blinding white — but the warm gold that filters through leaves onto a table at dusk. It says: your path is still here, you haven\'t gone the wrong way, your persistence is already crystallizing in places you can\'t yet see. Keep walking — good news isn\'t afraid of arriving late.' },
        { zh: '温暖的气息从牌面升起来——那不是安慰，是一种安静的确信。牌面不承诺结果，但它们确实在说：你身上有些东西在变得更强韧，更柔韧，更准备好了。图景在朝光的方向移动。你不必强迫自己乐观；你只需要注意到——光确实在那里。', en: 'A warmth rises from the cards — not comfort, but quiet reassurance. They don\'t promise an outcome, but they are saying: something in you is growing stronger, more flexible, readier. The picture is moving toward the light. You don\'t need to force optimism; you only need to notice — the light is really there.' },
      ],
      tough: [
        { zh: '牌面的信息并不轻松——但它们之所以难听，恰恰是因为它们说了真话。你也许不喜欢现在看到的，但至少你知道自己在面对什么了。真相有时候是苦的，但苦药治病。允许自己难受，但别陷在里面。这股能量会过去——它只是路过的，不是定居的。', en: 'The cards\' message isn\'t easy — but it\'s precisely because they\'re hard to hear that they\'re telling the truth. You may not like what you see, but at least you now know what you\'re facing. Truth is sometimes bitter, but bitter medicine heals. Allow yourself to feel bad, but don\'t get stuck there. This energy will pass — it\'s just visiting, not settling.' },
        { zh: '牌面没有说你想听的话，但它们说了你需要听的话。这两者之间的差距，就是成长的起点。你现在可能会想关掉页面——但请等一等。最难受的往往是最有用的那一部分。允许自己不舒服，但不要转身就走。这股力量的用意是唤醒你，不是压垮你。', en: 'The cards didn\'t say what you wanted to hear, but they said what you needed to hear. The gap between the two — that\'s where growth begins. You might want to close this page right now — but wait. The hardest parts are often the most useful ones. Allow yourself to feel uncomfortable, but don\'t walk away. This force is here to wake you, not crush you.' },
        { zh: '这份解读像一阵冷风——不舒适，但清醒。星辰不会为了照顾你此刻的温柔而不说实话，因为它们太尊重你了。你完全有权利感觉不好、感觉沉重、感觉不想接受。但在这些感觉之下，也许有一个更深的你不知道在说："终于——有人愿意跟我直说了。"', en: 'This reading comes as a cold wind — uncomfortable, but sobering. The stars won\'t spare you the truth just to protect your tenderness, because they respect you too much. You have every right to feel bad, feel heavy, feel resistant. But beneath those feelings, a deeper part of you might be whispering: "finally — someone is being straight with me."' },
      ],
      empowered: [
        { zh: '牌面大多数以正位呈现——这不是巧合。你正处于一个内在力量汇聚的时刻，你的意志、你的清晰、你的行动力都在上升期。这不是说不会有挑战，而是说你面对挑战的资源比以往更多。牌的肯定不是来让你松懈的——是来提醒你：你有能力，现在是用它的时候了。', en: 'Most cards appear upright — this is no coincidence. You are in a moment when inner forces are converging: your will, your clarity, your capacity for action are all on the rise. This doesn\'t mean there won\'t be challenges — it means you have more resources to face them than before. The cards\' affirmation isn\'t here to let you coast — it\'s here to remind you: you have the ability, now is the time to use it.' },
        { zh: '这份解读的能量是上升的、聚集的、向外推动的。牌在说：你不再是被动的等待者——你现在是行动者。力量的格局已经变了。困难还会有，但你与困难之间的关系不再是"被欺负"的，而是"可以面对"的。这个微妙的转变，就是力量的本质。', en: 'The energy of this reading is ascending, gathering, pushing outward. The cards are saying: you are no longer a passive waiter — you are now the one who acts. The power dynamic has shifted. Difficulties will still come, but your relationship to them is no longer one of being bullied — it\'s one of being able to face them. That subtle shift is the essence of strength.' },
        { zh: '牌面的能量是清晰的、向前的——一种少见的"绿灯"时刻。在这短暂的窗口里，阻力最小、支持最多、你的方向感和行动力都对齐了。这种时刻不常来，所以来了就要认真对待。不是让你莽撞，而是让你有意识地、有策略地往前走。星辰在说：走。', en: 'The energy in this spread is clear and forward-moving — a rare "green light" moment. In this brief window, resistance is at its lowest, support at its highest, and your sense of direction and capacity for action are aligned. These moments don\'t come often, so when they do, take them seriously. Not to rush recklessly, but to move forward with awareness and strategy. The stars are saying: go.' },
      ],
      gentle: [
        { zh: '这个话题很柔软，星辰用同样的温柔来回应。牌面没有尖锐的论断、没有紧迫的催促——更像是深夜写给你的一封短信，措辞斟酌了又斟酌。你需要的是理解，不是解决方案。牌面给你的，首先是这个："我懂——在你开口之前我已经在听了。"', en: 'This topic is tender, and the stars respond with equal tenderness. The cards hold no sharp judgments, no urgent pushing — more like a late-night letter written to you, every word weighed and reweighed. What you need is understanding, not solutions. What the cards give you, first and foremost, is this: "I understand — I was already listening before you spoke."' },
        { zh: '有些问题不适合用力去"解决"——它们需要的是被温柔地托住，像一个易碎的碗。牌面选择了轻柔的声调：不催促、不判断、不过度解读。这份解读更像一只伸向你的手——你随时可以握住，也随时可以放下。节奏完全由你来定。', en: 'Some questions aren\'t meant to be "solved" with force — they need to be held gently, like a fragile bowl. The cards have chosen a soft voice: no pushing, no judging, no over-interpreting. This reading is more like a hand reaching toward you — you can take it anytime, and put it down anytime. The pace is entirely yours.' },
      ],
    },

    // ── Question echo templates — weave user\'s keywords into the reading ──
    question_echo: {
      love: {
        breakup: [
          { zh: '你问到分手——星辰对此的回应，不只是关于一段关系的结束，更是关于一颗心如何重新学会为自己跳。', en: 'You asked about the breakup — the stars\' response isn\'t just about the end of a relationship, but about how a heart relearns to beat for itself.' },
          { zh: '你心里装着"分手"这两个字来找牌——但牌面想跟你聊的不只是"分开"，更是分开之后，那个空出来的位置上，你要放什么进去。', en: 'You came to the cards with "breakup" in your heart — but what the cards want to discuss isn\'t just "separation," it\'s what you\'ll place into that empty space afterward.' },
        ],
        conflict: [
          { zh: '吵架、冷战、矛盾——这些词在你的问题里反复出现。牌面不会站任何一方，但它们会帮你从更高的地方看这场冲突：它真正的导火索是什么，以及为什么你们两个都觉得自己有理。', en: 'Arguments, cold wars, conflict — these words echo through your question. The cards won\'t take sides, but they\'ll help you see from above: what really sparked this, and why you both feel justified.' },
          { zh: '你写了关于"矛盾"和"冲突"——牌面听到了。但在探入这场对立之前，先留意一件事：冲突的表面往往是"谁对谁错"，但冲突的底层通常是"谁被谁理解了"。也许问题的关键不是争赢，而是你们各自能不能让对方感觉"被听见了"。', en: 'You wrote about "conflict" and "tension" — the cards heard. But before diving into this opposition, notice one thing: on the surface, conflict is about "who\'s right and who\'s wrong," but underneath, it\'s usually about "who feels understood by whom." Maybe the key isn\'t winning the argument — it\'s whether each of you can make the other feel heard.' },
          { zh: '矛盾和冲突在你的文字里是热的——说明你在乎。牌面不打算劝你"冷静下来"，因为情绪有它的价值。但牌面会帮你拆解这场对峙：哪里是原则问题、哪里是沟通方式的问题、哪里是你自己之前积累的委屈借这个机会爆发了。拆开之后，冲突就没那么可怕了。', en: 'The conflict in your words runs hot — that tells me you care. The cards aren\'t going to tell you to "calm down," because emotion has its value. But they will help you take this confrontation apart: what\'s a principle issue, what\'s a communication-style issue, what\'s accumulated resentment finding an outlet. Once taken apart, conflict becomes less intimidating.' },
        ],
        breakup: [
          { zh: '你问到分手——星辰对此的回应，不只是关于一段关系的结束，更是关于一颗心如何重新学会为自己跳。', en: 'You asked about the breakup — the stars\' response isn\'t just about the end of a relationship, but about how a heart relearns to beat for itself.' },
          { zh: '你心里装着"分手"这两个字来找牌——但牌面想跟你聊的不只是"分开"，更是分开之后，那个空出来的位置上，你要放什么进去。', en: 'You came to the cards with "breakup" in your heart — but what the cards want to discuss isn\'t just "separation," it\'s what you\'ll place into that empty space afterward.' },
          { zh: '你在问关于一段已经结束或正在结束的关系——牌面理解这个问题的重量。结束不是一个事件，是一个过程。牌面会陪你看：哪些部分已经真正"断了"，哪些部分的线还在你身上牵着，以及你能为那个牵着的部分做什么——是剪断，还是重新编成别的东西。', en: 'You\'re asking about a relationship that has ended or is ending — the cards understand the weight of this question. An ending isn\'t an event, it\'s a process. The cards will help you see: which parts have truly "severed," which threads are still attached to you, and what you can do about the attached ones — cut them, or weave them into something else.' },
        ],
        uncertainty: [
          { zh: '你的问题里弥漫着一种"不确定"——不确定对方在想什么、不确定自己该不该继续、不确定这段关系会通往哪里。牌面不急着给你一个结论，但会帮你把不确定拆成几个更具体的问题——因为"模糊"一旦有了轮廓，就没那么让人慌了。', en: 'Your question is filled with uncertainty — unsure what they\'re thinking, unsure whether to continue, unsure where this relationship leads. The cards won\'t rush to give you a conclusion, but they\'ll help break "uncertainty" into a few more specific questions — because once "blur" gets an outline, it\'s far less unsettling.' },
          { zh: '不确定感——也许是你现在最消耗情绪的敌人。牌面听到了你的犹豫、你的观望、你的反复掂量。你要知道：不确定感本身不是问题——它是一种"信号"，说明你有一些信息还没拿到、有一些自己的感受还没正视。牌面会帮你看清是哪些信息、哪些感受。', en: 'Uncertainty — perhaps your most draining emotional enemy right now. The cards heard your hesitation, your waiting and watching, your endless weighing. Know this: uncertainty itself isn\'t the problem — it\'s a "signal" that there\'s some information you haven\'t yet gathered, some feelings of your own you haven\'t yet faced. The cards will help you see which information, which feelings.' },
        ],
      },
      career: {
        stuck: [
          { zh: '你的问题里藏着一种"卡住了"的感觉——不是不努力，而是努力的方向好像堵住了。牌面听到了这种进退两难。它不会对你说"再坚持一下就好了"——那种话太空了。它会帮你看：堵住你的是环境、是你自己的能力瓶颈、还是你其实在一条你并不真的想走的路。', en: 'Your question holds a "stuck" feeling — not that you\'re not trying, but that the path of your effort seems blocked. The cards heard this dilemma. They won\'t give you the empty "just hang in there" — they\'ll help you see: is the blockage in the environment, in your own skill ceiling, or in the fact that you\'re on a road you don\'t truly want to be on.' },
          { zh: '"卡住"这种感觉——在牌面的视角里，往往不是"没有路"，而是"有路但看不清楚"。你碰到了一种停滞期，这在任何职业道路上都是正常的。牌面会从比你平时更高的地方俯瞰你的处境：你的位置在整个大图景里是什么样的，以及离你最近的那个"松动"在哪里。', en: '"Stuck" — from the cards\' perspective, this usually isn\'t "no path" but "a path that\'s hard to see." You\'ve hit a plateau, which is normal on any career journey. The cards will view your situation from a higher vantage than you normally use: what your position looks like in the bigger picture, and where the nearest "give" is — the place where movement can first happen.' },
        ],
        change: [
          { zh: '跳槽、转行、改变方向——你的问题充满了"动"的渴望。但牌面要先问一句：你是想离开一种状态，还是想走向一个目标？离开和被吸引走的是两条看似平行实则完全不同的路。', en: 'Job hopping, career change, new direction — your question is full of the urge to "move." But the cards ask first: do you want to leave a state, or walk toward a goal? Running from and being drawn toward are two paths that look parallel but are completely different.' },
          { zh: '你的文字里有一个"变"字——牌面收到了。但关于变化，牌面有一句老实话：不是每个"想走"都值得立刻行动，也不是每个"犹豫"都代表胆小。牌面会帮你区分：你的想变是出于一时的挫败感，还是源自一个持续的、越来越清晰的内在召唤。', en: 'There\'s a word "change" in your writing — the cards received it. But about change, the cards have a frank observation: not every urge to leave deserves immediate action, and not every hesitation is cowardice. The cards will help you distinguish: is your desire for change born from temporary frustration, or from a persistent, increasingly clear inner calling.' },
        ],
      },
      wealth: {
        stress: [
          { zh: '钱的压力从你的问题里透出来——那种"赚得不够、存不下来、看不到头"的感觉。牌面不会敷衍你"钱会有的"，但会帮你看得更实：你目前财务问题的核心是收入问题、支出问题还是结构问题。不同的因，不同的路。', en: 'Financial stress seeps through your question — that feeling of "not earning enough, can\'t save, no end in sight." The cards won\'t brush you off with "money will come," but will help you see more concretely: is the core of your financial issue one of income, spending, or structure? Different causes, different paths.' },
          { zh: '你问到了和钱有关的事——也许是一笔债务、一项投资、或者对未来的不安。牌面首先注意到的是：你对财富的焦虑不只是"数字焦虑"。它的底下往往连着更深的线——你对安全感的需要、你对独立的定义、你对自己"值多少钱"的潜意识。这些线不看清，数字永远不够。', en: 'You asked about money — perhaps a debt, an investment, or anxiety about the future. What the cards notice first: your financial anxiety isn\'t just "number anxiety." Beneath it run deeper threads — your need for security, your definition of independence, your subconscious beliefs about what you\'re "worth." Without seeing these threads, the numbers will never feel like enough.' },
        ],
      },
      study: {
        pressure: [
          { zh: '考试、论文、申请——你问的事情带着一种"倒计时"的重量。牌面感觉到了那种紧绷。但牌面想先提醒你：你担心的不是"学不会"，而是"来不及"。这两者不同——前者需要时间，后者需要策略。牌面会帮你看哪一种才是真正的问题。', en: 'Exams, thesis, applications — your question carries the weight of a countdown. The cards feel that tension. But they want to remind you first: what worries you isn\'t "can\'t learn" but "won\'t be in time." These are different — one needs time, the other needs strategy. The cards will help you see which is the real issue.' },
          { zh: '学习的压力从你的问题里透出来——也许是某个决定性的考试、或者一项快到期的工作。牌面的回应不会跟你说"努力就好"。它会帮你看得更实：你目前的投入产出比、你的精力管理、以及你有没有把"辛苦"和"效率"搞混。辛苦不一定会带来结果——聪明地走才更靠近。', en: 'Study pressure comes through your question — perhaps a decisive exam, or work nearing a deadline. The cards won\'t just say "try your best." They\'ll help you see more practically: your current input-to-output ratio, your energy management, and whether you\'re confusing "effort" with "efficiency." Working hard doesn\'t guarantee results — walking smart gets you closer.' },
        ],
      },
      general: {
        reflection: [
          { zh: '你带着一个安静的问题来到牌前——不是紧急的恐慌，不是尖锐的冲突，更像是一个人在深夜对自己说的话。牌面会以同样的深度来回应：不急躁、不简化，认真对待你的每一个字。因为最深的领悟往往不是从"问题"来的，是从"自问"来的。', en: 'You brought a quiet question to the cards — not urgent panic, not sharp conflict, more like something you say to yourself late at night. The cards will respond at the same depth: unrushed, unsimplified, taking every word seriously. Because the deepest insights often don\'t come from "questions" — they come from "self-questioning."' },
          { zh: '你的问题不像在"问"——更像是在"思索"。牌面接收到了这种频率。它不会用答案来堵住你的思考，而是会像一个懂你的交谈对象，帮你延展你的思路、标记你的盲点、把你潜意识的低语译成更清晰的语言。你不是来要一个方向的——你是来确认你已经隐约感觉到但还不敢确定的那个东西。', en: 'Your question doesn\'t feel like "asking" — more like "wondering." The cards receive this frequency. They won\'t shut down your thinking with an answer; instead, like a conversation partner who gets you, they\'ll help you extend your thoughts, mark your blind spots, and translate your subconscious whispers into clearer language. You didn\'t come for a direction — you came to confirm something you already sensed but haven\'t yet dared to be sure of.' },
        ],
        fallback: [
          { zh: '你的问题在牌阵中找到了回响——星辰确实听见了。接下来的每一段解读，都和你写下的那些字有着具体的联系。注意看，你会发现你的原话被以你想象不到的方式回应了。', en: 'Your question has found its echo in the spread — the stars have indeed heard. Every section of this reading has a concrete connection to the words you wrote. Look closely, and you\'ll see your own words answered in ways you didn\'t expect.' },
        ],
      },
    },

    // ── Template selector engine ──
    select(library, key, domain, sentiment, questionType) {
      domain = domain || 'general';
      sentiment = sentiment || 'general';
      questionType = questionType || 'general';

      const pick = (obj) => {
        // Try most specific match first, then fall back
        if (!obj) return null;
        if (obj[domain]) {
          const d = obj[domain];
          if (d[questionType] && d[questionType][sentiment]) return d[questionType][sentiment];
          if (d[questionType]) {
            const qt = d[questionType];
            if (Array.isArray(qt)) return qt;
            if (qt[sentiment]) return qt[sentiment];
            // pick first available
            const keys = Object.keys(qt);
            if (keys.length > 0) return qt[keys[0]];
          }
          if (d[sentiment]) return d[sentiment];
          const dKeys = Object.keys(d);
          for (const k of dKeys) {
            if (k !== 'fallback' && Array.isArray(d[k])) return d[k];
          }
          if (d.fallback) return d.fallback;
        }
        if (obj.general) {
          if (obj.general.fallback) return obj.general.fallback;
          if (obj.general[sentiment]) return obj.general[sentiment];
          const gKeys = Object.keys(obj.general);
          if (gKeys.length > 0 && Array.isArray(obj.general[gKeys[0]])) return obj.general[gKeys[0]];
        }
        // Ultimate fallback: find any array
        for (const dk of Object.keys(obj)) {
          for (const ik of Object.keys(obj[dk])) {
            if (Array.isArray(obj[dk][ik])) return obj[dk][ik];
          }
        }
        return null;
      };

      let pool = pick(library);
      if (!pool) return null;
      if (!Array.isArray(pool)) return pool;
      // Pick random variant
      return pool[Math.floor(Math.random() * pool.length)];
    },

    selectOpening(domain, questionType, sentiment) {
      return this.select(this.openings, 'openings', domain, sentiment, questionType);
    },
    selectSummary(domain, sentiment) {
      return this.select(this.summary, 'summary', domain, sentiment, 'general');
    },
    selectSummaryV2(domain, sentiment, cardCount, a) {
      const cardKey = cardCount <= 1 ? 'single' : 'multi';
      const lib = this.summaryV2;
      // Direct navigation: domain → sentiment → cardKey
      let pool = lib[domain]?.[sentiment]?.[cardKey];
      if (!Array.isArray(pool) || pool.length === 0) {
        pool = lib[domain]?.[sentiment]?.multi;
      }
      if (!Array.isArray(pool) || pool.length === 0) {
        const d = lib[domain];
        if (d) {
          const firstSent = Object.keys(d).find(k => Array.isArray(d[k]?.[cardKey]));
          if (firstSent) pool = d[firstSent][cardKey];
        }
      }
      if (!Array.isArray(pool) || pool.length === 0) {
        pool = lib.general?.fallback?.[cardKey];
      }
      if (!Array.isArray(pool) || pool.length === 0) {
        pool = lib.general?.fallback?.multi;
      }
      if (!Array.isArray(pool) || pool.length === 0) return null;

      // ── Scoring + dedup ──
      if (a) {
        const self = this;
        const scored = pool.map(function(tpl, idx) {
          return { tpl: tpl, idx: idx, score: self._scoreTemplate(tpl, a) };
        }).filter(function(s) { return s.score >= 0; });

        if (scored.length > 0) {
          scored.sort(function(a, b) { return b.score - a.score; });
          // Remove recently used templates (last 3)
          const recent = self._recentSummaryTemplates || [];
          const fresh = scored.filter(function(s) {
            return recent.indexOf(self._templateSig(s.tpl)) === -1;
          });
          const candidates = fresh.length >= 2 ? fresh : scored;
          // Pick randomly from top 3 (or fewer)
          const topN = Math.min(3, candidates.length);
          const pick = candidates[Math.floor(Math.random() * topN)];
          // Track in recent list
          if (!self._recentSummaryTemplates) self._recentSummaryTemplates = [];
          self._recentSummaryTemplates.push(self._templateSig(pick.tpl));
          if (self._recentSummaryTemplates.length > 3) self._recentSummaryTemplates.shift();
          return pick.tpl;
        }
      }

      // Fallback: random pick
      return pool[Math.floor(Math.random() * pool.length)];
    },

    _templateSig(tpl) {
      // Simple signature: first 20 chars of zh template
      return (tpl.zh || '').substring(0, 20);
    },

    _scoreTemplate(tpl, a) {
      var score = 0;
      var tags = tpl.matchTags || {};
      var sentiment = a.keywords?.sentiment || [];
      var qType = a.keywords?.questionType || a.qType || 'general';
      var timeFrame = a.keywords?.timeFrame || 'ongoing';

      // Sentiment match (highest weight)
      if (tags.preferredSentiment && sentiment.some(function(s) { return tags.preferredSentiment.indexOf(s) >= 0; })) {
        score += 3;
      }
      // Question type match
      if (tags.preferredQType && tags.preferredQType.indexOf(qType) >= 0) {
        score += 2;
      }
      // Time frame match
      if (tags.preferredTime && tags.preferredTime.indexOf(timeFrame) >= 0) {
        score += 2;
      }
      // Exclude if template requires reversal but none present
      if (tags.requiresReversal && a.reversedCount === 0) {
        score -= 5;
      }
      // Exclude if template requires major but none present
      if (tags.requiresMajor && !a.cards.some(function(c) { return c.data?.arcana === 'major'; })) {
        score -= 3;
      }
      return score;
    },
    selectCardContext(positionRole, domain) {
      const ctx = this.card_in_context;
      domain = domain || 'general';
      if (ctx[positionRole]) {
        if (ctx[positionRole][domain]) return ctx[positionRole][domain][Math.floor(Math.random() * ctx[positionRole][domain].length)];
        if (ctx[positionRole].general) return ctx[positionRole].general[Math.floor(Math.random() * ctx[positionRole].general.length)];
      }
      return null;
    },
    selectAdvice(domain, sentiment) {
      return this.select(this.practical_advice, 'advice', domain, sentiment, 'general');
    },
    selectTransition(type) {
      const pool = this.transitions[type] || this.transitions.contrast;
      return pool[Math.floor(Math.random() * pool.length)];
    },
    selectClosing(sentiment, cardCount, uprightRatio) {
      if (cardCount <= 1) return this.closings.simple[Math.floor(Math.random() * this.closings.simple.length)];
      if (sentiment === 'empowered' || (uprightRatio != null && uprightRatio > 0.7)) {
        return this.closings.empowered[Math.floor(Math.random() * this.closings.empowered.length)];
      }
      if (sentiment === 'gentle' || sentiment === 'painful' || sentiment === 'heartbreak') {
        return this.closings.gentle[Math.floor(Math.random() * this.closings.gentle.length)];
      }
      if (sentiment === 'hopeful') return this.closings.hopeful[Math.floor(Math.random() * this.closings.hopeful.length)];
      if (sentiment === 'anxious') return this.closings.tough[Math.floor(Math.random() * this.closings.tough.length)];
      if (cardCount >= 7) return this.closings.deep[Math.floor(Math.random() * this.closings.deep.length)];
      return this.closings.moderate[Math.floor(Math.random() * this.closings.moderate.length)];
    },
    selectEcho(domain, keywords) {
      const echo = this.question_echo;
      if (echo[domain] && keywords && keywords.length > 0) {
        // Try to match keywords against topic names
        const topicKeys = Object.keys(echo[domain]);
        for (const topic of topicKeys) {
          const pool = echo[domain][topic];
          if (Array.isArray(pool) && pool.length > 0) {
            // Check if any user keyword relates to this topic
            const matched = keywords.some(k => {
              const kwLower = k.toLowerCase();
              return topic.includes(kwLower) ||
                (topic === 'conflict' && /吵架|矛盾|冲突|冷战|不合/.test(k)) ||
                (topic === 'breakup' && /分手|分开|离婚|复合|前任/.test(k)) ||
                (topic === 'uncertainty' && /不确定|不知道|看不清|拿不准|犹豫/.test(k)) ||
                (topic === 'change' && /跳槽|辞职|换|转行|创业|改变/.test(k)) ||
                (topic === 'stuck' && /困|瓶颈|停滞|走不动|没进展/.test(k)) ||
                (topic === 'stress' && /压力|焦虑|紧张|喘不过气|累/.test(k)) ||
                (topic === 'pressure' && /考试|考研|考公|成绩|复习|论文/.test(k));
            });
            if (matched) return pool[Math.floor(Math.random() * pool.length)];
          }
        }
        // No specific match — return any domain echo
        const domainEchoes = Object.values(echo[domain]).flat();
        if (domainEchoes.length > 0) return domainEchoes[Math.floor(Math.random() * domainEchoes.length)];
      }
      // Fallback: general reflection echo or first available
      if (echo.general) {
        const general = echo.general.reflection || echo.general.fallback || echo.general;
        const pool = Array.isArray(general) ? general : Object.values(echo.general).flat();
        if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)];
      }
      return null;
    },
    fill(template, vars) {
      if (!template) return {};
      const fillStr = (str) => {
        if (!str) return '';
        let result = str;
        for (const [k, v] of Object.entries(vars)) {
          result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v || '');
        }
        return result;
      };
      return { zh: fillStr(template.zh), en: fillStr(template.en) };
    },
  };

  // Backwards-compatible alias — legacy code references NARRATIVE.openings, etc.
  const NARRATIVE = {
    openings: (() => {
      const o = { love: {}, career: {}, wealth: {}, study: {}, destiny: {}, general: {} };
      // Extract first variant from each opening pool
      const extract = (domain, qt, sent) => {
        const pool = TEMPLATE_LIBRARY.openings[domain]?.[qt]?.[sent];
        if (Array.isArray(pool) && pool.length > 0) return pool[0];
        return null;
      };
      for (const domain of ['love','career','wealth','study','destiny']) {
        const best = extract(domain, 'guidance', 'anxious') || extract(domain, 'guidance', 'confused') ||
                     extract(domain, 'exploration', 'confused') || extract(domain, 'choice', 'anxious');
        if (best) o[domain] = best;
      }
      const gf = TEMPLATE_LIBRARY.openings.general?.fallback?.[0];
      if (gf) o.general = gf;
      return o;
    })(),
    transitions: TEMPLATE_LIBRARY.transitions.contrast.concat(TEMPLATE_LIBRARY.transitions.reinforce).concat(TEMPLATE_LIBRARY.transitions.causal).concat(TEMPLATE_LIBRARY.transitions.question).concat(TEMPLATE_LIBRARY.transitions.summary),
    closings: TEMPLATE_LIBRARY.closings,
  };

  // ═══════════════════════════════════════════
  // 9. QUESTION SYSTEM
  // Source: 你可以再塔罗一点 50+ samples + 葵花宝典
  // ═══════════════════════════════════════════
  // ═══════════════════════════════════════════
  // QUESTION GUIDANCE — Five-Layer System
  // Layer 1: Spread-aware placeholders
  // Layer 2: Adaptive real-time follow-ups
  // Layer 3: Missing info detection
  // Layer 4: Keyword extraction (structured)
  // Layer 5: Spread-specific context guidance
  // ═══════════════════════════════════════════
  const QUESTION_GUIDANCE = {
    // ── Layer 1: Spread-aware placeholders ──
    spreadPlaceholders: {
      'celtic-cross': {
        zh: '凯尔特十字是最完整的牌阵。将你的故事完整地告诉星辰——前因、现状、心中所困、暗中期许……',
        en: 'The Celtic Cross is the most complete spread. Tell the stars your full story — what brought you here, what weighs on you, what you secretly hope for…'
      },
      'three-card': { zh: '过去埋下的种子，现在生长的枝叶，未来结出的果实。三张牌，一条时间线。你想看清哪一段路？', en: 'Past seeds, present branches, future fruit. Three cards, one timeline. Which part of your path do you wish to see?' },
      'single': { zh: '有时答案很简单，只需一张牌、一句话。你心中此刻最想问的那个问题是什么？', en: 'Sometimes the answer is simple — one card, one word. What is the one question burning in your heart right now?' },
      'relationship': { zh: '关系的镜子映照最深的真相。说说这段关系——它从哪里开始，现在卡在哪里，你真正的感受是什么？', en: 'The relationship mirror reflects the deepest truths. Tell me about this bond — where it began, where it is stuck, what you truly feel.' },
      'venus': { zh: '在维纳斯的注视下，爱变得无所遁形。你的心、对方的心、你们之间未曾言说的——都说出来吧。', en: 'Under Venus\'s gaze, love cannot hide. Your heart, theirs, the unspoken between you — speak it all.' },
      'helen': { zh: '海伦站在抉择的岔路口。你在犹豫什么？两个方向各有什么值得你眷恋、又各有什么让你不安？', en: 'Helen stands at the crossroads of choice. What are you torn between? What draws you to each path, and what gives you pause?' },
      'sacred-triangle': { zh: '神圣三角映照过去、现在、未来。你正站在哪一段时光里？是什么让你回头，又是什么催你前行？', en: 'The Sacred Triangle mirrors past, present, and future. Which moment are you standing in? What pulls you back, what pushes you forward?' },
      'horus': { zh: '荷鲁斯之眼注视着你灵魂的本质。你内心真正的渴望是什么？什么在阻挡你成为本应成为的自己？', en: 'The Eye of Horus gazes upon your soul\'s essence. What does your spirit truly yearn for? What blocks you from becoming who you are meant to be?' },
      'work-cycle': { zh: '事业的周期如日升月落。你现在正处于哪个阶段——播种、耕耘、收获，还是寒冬休整？', en: 'The work cycle turns like sun and moon. Which phase are you in — sowing, tilling, harvesting, or winter rest?' },
      'kether-cross': { zh: '王冠十字直达灵性之巅。你的灵魂在呼唤什么？在这物质的喧嚣中，什么声音被淹没了？', en: 'The Kether Cross reaches toward the spiritual summit. What is your soul calling for? Amid the noise of the material world, what voice has been drowned out?' },
      'alchemical-lion': { zh: '炼金狮转化苦难为黄金。你正在经历什么蜕变？旧的壳已经裂开，新的你将要展露什么模样？', en: 'The Alchemical Lion transforms suffering into gold. What metamorphosis are you undergoing? The old shell has cracked — what will the new you reveal?' },
      'four-elements': { zh: '地火水风，四大元素构成你的世界。你觉得自己在哪一元素上失衡了？太务实了，还是太飘忽了？', en: 'Earth, fire, water, wind — four elements make up your world. Which element feels out of balance? Too grounded, or too adrift?' },
      'giza-pyramid': { zh: '吉萨金字塔层层递进，从地基到塔尖。你的问题的根基是什么？走到哪一层卡住了？', en: 'The Giza Pyramid rises layer by layer, from foundation to apex. What is the root of your question? At which level are you stuck?' },
      'hexagram': { zh: '六芒星交织天与地、阴与阳。你生命中的对立面是什么？哪两股力量正在拉扯你？', en: 'The Hexagram weaves heaven and earth, yin and yang. What opposites are at play in your life? Which two forces are pulling at you?' },
      'thothmosis': { zh: '透特之书翻开命运的篇章。你想问的这件事，在你生命中已经演了多久？第一幕是什么时候开始的？', en: 'The Book of Thoth opens a chapter of destiny. How long has this question been unfolding in your life? When did the first act begin?' },
      'horseshoe': { zh: '马蹄牌阵从过去奔向未来。你现在走到了弧线的哪个位置？前方隐约可见的是什么？', en: 'The Horseshoe gallops from past to future. Where on the arc are you now? What looms faintly ahead?' },
      'tree-of-life': { zh: '生命之树十个圆质，从王冠到王国。你的灵性旅程走到了哪一环？是上升还是下降？', en: 'The Tree of Life spans ten sephiroth, from Crown to Kingdom. Where on your spiritual journey are you? Ascending or descending?' },
      'zodiac': { zh: '黄道十二宫映射你人生的全景。你此刻最关注的领域是爱、事业、家庭，还是内在探索？', en: 'The Zodiac maps the full landscape of your life. Which domain calls to you most — love, career, family, or inner exploration?' },
      'faith': { zh: '信念之星的五芒映照你的虔诚。你信仰什么？什么在考验你的信念？坚持还是放手？', en: 'The Star of Faith reflects your devotion. What do you believe in? What tests your faith? Hold on or let go?' },
      'choice': { zh: '抉择之路摆在面前。两条路各通向什么？你害怕错过什么，又渴望获得什么？', en: 'The path of choice lies before you. What lies down each road? What do you fear losing, and what do you long to gain?' },
      'reinforcement': { zh: '力量强化阵为你锚定当下的能量。现在最需要被加强的是什么？是什么在消耗你？', en: 'The Reinforcement spread anchors your current energy. What most needs strengthening now? What is draining you?' },
      'action-result': { zh: '行动与结果——因果的链条清晰可见。你正打算做什么？那个行动最可能的回响是什么？', en: 'Action and Result — the chain of cause and effect. What are you about to do? What echo is that action most likely to return?' },
      'shaka-wo': { zh: '释迦之轮转动因果。你的烦恼从何而来？执着在哪一处？放下什么可以让你解脱？', en: 'The Wheel of Shakyamuni turns with karma. Where does your suffering come from? What are you clinging to? What would release bring?' },
      'ancestral-tree': { zh: '先祖之树扎根于血脉的记忆。你的问题的根源在家族历史中能找到什么线索？什么模式在重复？', en: 'The Ancestral Tree is rooted in blood memory. What clues to your question lie in family history? What patterns repeat?' },
      'essence': { zh: '本质之镜只映照灵魂最核心的模样。你究竟是谁？剥去所有身份之后，剩下的那个你是什么样的？', en: 'The Essence Mirror reflects only the soul\'s core. Who are you really? Strip away all identities — what remains?' },
      'daily-triangle': { zh: '每日三角照映晨昏。今天最重要的一件事是什么？你带着什么心情走入今天的？', en: 'The Daily Triangle illuminates dawn to dusk. What matters most today? What mood do you carry into this day?' },
    },
    // Default fallback
    _defaultPlaceholder: { zh: '将心中所惑凝于笔尖——写得越具体，星辰的回应便越清晰。', en: 'Hold your question in your heart, then write it down — the more specific you are, the clearer the stars will answer.' },

    getPlaceholder(spread) {
      const sid = spread?.id || '';
      const tmpl = this.spreadPlaceholders[sid];
      if (tmpl) return tmpl.zh + '\n\n' + tmpl.en;
      if (spread?.category) {
        const catPlaceholders = {
          love: '说说你心中的那份感情——它开始于何时，卡在哪里，你最深的渴望和最大的恐惧各是什么？\n\nTell me about this love — when did it begin, where is it stuck, what do you most desire and most fear?',
          career: '说说你的事业之惑——你现在处于什么阶段？是选择、困境、还是对未来的不确定？\n\nTell me about your career question — what phase are you in? A choice, a challenge, or uncertainty ahead?',
          wealth: '说说你与财富的关系——你的困惑是关于收入、投资、债务，还是对金钱的深层信念？\n\nTell me about your relationship with money — income, investment, debt, or deeper beliefs about wealth?',
          study: '说说你的学业之路——在学什么，卡在哪里，是为了考试、论文、还是人生方向？\n\nTell me about your studies — what are you learning, where are you stuck, is it exams, thesis, or life direction?',
          destiny: '说说你对命运的叩问——是什么让你开始追问人生的意义？哪一刻让你感到迷茫？\n\nTell me about your destiny question — what made you start asking about life\'s meaning? Which moment brought the confusion?',
        };
        const fallback = catPlaceholders[spread.category];
        if (fallback) return fallback;
      }
      return this._defaultPlaceholder.zh + '\n\n' + this._defaultPlaceholder.en;
    },

    // ── Layer 2: Adaptive real-time follow-ups ──
    adaptiveRefinements: {
      tooBroad: [
        { trigger: ['感情','爱情','恋爱','喜欢','暗恋'], response: { zh: '你提到了感情——是关于正在进行的关系，还是已经结束的？是明确的关系还是暧昧阶段？多说一点，星辰能看得更清楚。', en: 'You mentioned love — is this about an ongoing relationship or one that has ended? Is it clear or ambiguous? Tell me more so the stars can see clearly.' }},
        { trigger: ['工作','事业','职业'], response: { zh: '事业是个很大的话题。是想换方向、解决当下的困境、还是规划长远的路？', en: 'Career is a vast subject. Are you considering a change, resolving a current challenge, or planning a long-term path?' }},
        { trigger: ['钱','财运','财富','投资','理财'], response: { zh: '财富的问题可以很具体也可以很深远。你最关心的是当下的收入、长期的积累，还是对金钱的心态？', en: 'Questions about wealth can be practical or profound. Are you most concerned about current income, long-term accumulation, or your mindset around money?' }},
        { trigger: ['学习','考试','学业'], response: { zh: '学业之路有很多岔口。你是在准备一场考试、选择专业方向，还是在思考学习本身的意义？', en: 'The path of learning has many forks. Are you preparing for an exam, choosing a direction, or reflecting on the meaning of learning itself?' }},
        { trigger: ['命运','人生','未来','运势'], response: { zh: '命运是个宏大的词。你最近遇到了什么具体的事，让你开始思考人生的方向？', en: 'Destiny is a grand word. What specific event recently made you start thinking about the direction of your life?' }},
      ],
      decisionPoint: [
        { trigger: ['该不该','要不要','是否应该','怎么选','选哪个','应该','or','还是','抉择'], response: { zh: '这是个重要的抉择。在抽牌之前，要不要先说说是什么让你犹豫？两个选项各有什么好和不好的？', en: 'This is a significant decision. Before drawing cards, would you share what makes you hesitate? What are the pros and cons of each option?' }},
      ],
      tooSpecific: [
        { trigger: [], response: { zh: '你写得很具体，这很好。如果愿意，可以在下方补充更多背景——事情从何时开始的，涉及谁，你的感受如何。', en: 'You\'ve been very specific — that\'s excellent. If you\'d like, add more context below — when did this begin, who is involved, how do you feel?' }},
      ],
      mixedTopics: [
        { trigger: [], response: { zh: '你同时提到了几个不同的事情。一次占卜聚焦一个问题会更精准。你想先问哪个？', en: 'You\'ve mentioned several different things. Focusing on one question per reading is more precise. Which would you like to ask first?' }},
      ],
    },

    getAdaptiveHint(question) {
      if (!question || question.trim().length < 3) return null;
      const q = question.toLowerCase();

      // Check for decision keywords
      let isDecision = false;
      const decisionTriggers = ['该不该','要不要','是否应该','怎么选','选哪个','应该','or','还是','抉择'];
      for (const t of decisionTriggers) {
        if (q.includes(t)) { isDecision = true; break; }
      }

      // Count topic keywords for mixed topic detection
      const topicKeywords = {
        love: ['感情','爱情','恋爱','喜欢','暗恋','分手','复合','男朋友','女朋友','老公','老婆','对象','前任'],
        career: ['工作','事业','职业','跳槽','辞职','升职','公司','老板','同事','面试','工资'],
        wealth: ['钱','财运','财富','投资','理财','收入','负债','赚钱','花钱'],
        study: ['学习','考试','学业','考研','高考','论文','留学','学校','成绩'],
      };
      const hitTopics = [];
      for (const [topic, kws] of Object.entries(topicKeywords)) {
        if (kws.some(k => q.includes(k))) hitTopics.push(topic);
      }

      // Mixed topics
      if (hitTopics.length >= 2) {
        const tmpl = this.adaptiveRefinements.mixedTopics[0].response;
        return { zh: tmpl.zh, en: tmpl.en };
      }

      // Decision point
      if (isDecision) {
        const tmpl = this.adaptiveRefinements.decisionPoint[0].response;
        return { zh: tmpl.zh, en: tmpl.en };
      }

      // Too broad: only one topic keyword and short question
      if (hitTopics.length === 1 && q.length < 15) {
        const cat = this.adaptiveRefinements.tooBroad;
        for (const item of cat) {
          if (item.trigger.some(t => q.includes(t))) {
            return { zh: item.response.zh, en: item.response.en };
          }
        }
      }

      // Well-formed: question is specific enough
      if (q.length >= 15) {
        const tmpl = this.adaptiveRefinements.tooSpecific[0].response;
        return { zh: tmpl.zh, en: tmpl.en };
      }

      return null;
    },

    // ── Layer 3: Missing info detection ──
    missingInfoChecks: [
      { check: 'noEmotion', test(q) { return !/[担心害怕焦虑不安紧张恐惧开心期待希望迷茫困惑犹豫纠结痛苦难过伤心].*/.test(q) && q.length > 10; },
        prompt: { zh: '说说你的感受吧——担心？期待？还是迷茫？这些情绪本身也是重要的线索。', en: 'Tell me how you feel — worried? hopeful? lost? These emotions themselves are important clues.' }},
      { check: 'noTimeRef', test(q) { return !/[曾经过去以前之前已经最近现在目前当下此刻将来未来以后多久].*/.test(q) && q.length > 10; },
        prompt: { zh: '这件事持续多久了？刚刚开始，还是纠缠已久？时间本身也会说话。', en: 'How long has this been going on? Just beginning, or entangled for a while? Time itself speaks.' }},
      { check: 'noSubject', test(q) { return !/[我你他她它我们你们他们自己别人对方].*/.test(q) && q.length > 8; },
        prompt: { zh: '这件事涉及谁？只有你自己，还是还有其他人？说出他们会让画面更完整。', en: 'Who is involved? Just yourself, or others too? Naming them completes the picture.' }},
      { check: 'tooAbstract', test(q) { return q.length > 15 && !/[事情具体例子最近一次发生当时那天].*/.test(q) && /[命运人生意义灵魂].*/.test(q); },
        prompt: { zh: '试着说一个具体的例子——最近一次让你产生这个疑问的事情是什么？', en: 'Try giving a concrete example — what was the most recent event that raised this question?' }},
      { check: 'oneSided', test(q) { return /[他她对方].*[怎么想感觉感受].*/.test(q) && !/[我也自己].*/.test(q); },
        prompt: { zh: '关系是互动的事。除了对方的感受，你自己的想法和态度也很重要。', en: 'Relationships are mutual. Beyond their feelings, your own thoughts and attitude matter too.' }},
    ],

    getMissingPrompts(question) {
      if (!question || question.trim().length < 8) return [];
      return this.missingInfoChecks
        .filter(c => c.test(question))
        .map(c => c.prompt)
        .slice(0, 2);
    },

    // ── Layer 4: Keyword extraction (structured) ──
    extractKeywords(question, context) {
      const combined = ((question || '') + ' ' + (context || '')).toLowerCase();
      const result = { domain: 'general', questionType: 'general', sentiment: [], timeFrame: null, keywords: [], entities: {}, coreConflict: null };

      // Sentiment detection
      const sentimentMap = {
        anxious: ['担心','害怕','焦虑','不安','紧张','恐惧','失眠','压力','怕','忧'],
        hopeful: ['期待','希望','盼望','憧憬','梦想','等待','想要','渴望'],
        confused: ['迷茫','不知道','困惑','犹豫','徘徊','纠结','矛盾','不知','迷'],
        determined: ['决定','一定','必须','坚定','决心','无论如何','肯定'],
        painful: ['痛苦','难过','伤心','分手','失去','结束','崩溃','哭','痛'],
      };
      for (const [sent, kws] of Object.entries(sentimentMap)) {
        if (kws.some(k => combined.includes(k))) result.sentiment.push(sent);
      }
      if (result.sentiment.length === 0) result.sentiment.push('neutral');

      // Time frame
      if (/[曾经过去以前之前已经].*/.test(combined)) result.timeFrame = 'past';
      else if (/[现在目前当下此刻正在].*/.test(combined)) result.timeFrame = 'present';
      else if (/[将来未来以后会不会能否是否].*/.test(combined)) result.timeFrame = 'future';
      else if (/[马上立刻最近下周下个月今年].*/.test(combined)) result.timeFrame = 'immediate';
      else result.timeFrame = 'ongoing';

      // Domain detection
      const domainKws = {
        love: ['爱','情','恋','喜欢','暗恋','分手','复合','男朋友','女朋友','老公','老婆','对象','前任','他','她','婚姻','结婚','离婚'],
        career: ['工作','职业','事业','公司','老板','同事','升职','面试','工资','创业','跳槽','辞职'],
        wealth: ['钱','财','理财','投资','负债','存钱','收入','赚钱','花钱','经济','基金','股票','贷款'],
        study: ['学习','考试','学校','大学','学生','老师','课程','成绩','考研','高考','论文','留学'],
        destiny: ['使命','命运','灵魂','意义','人生','方向','召唤','天命','灵性','成长'],
      };
      const domainScores = {};
      for (const [d, kws] of Object.entries(domainKws)) {
        domainScores[d] = kws.filter(k => combined.includes(k)).length;
      }
      const best = Object.entries(domainScores).sort((a, b) => b[1] - a[1])[0];
      if (best[1] > 0) result.domain = best[0];

      // Question type
      if (/[该不该要不要是否应该怎么选选哪个还是抉择or]/.test(combined)) result.questionType = 'choice';
      else if (/[会不会将.*吗未来.*会预测将要是否].*/.test(combined)) result.questionType = 'prediction';
      else if (/[怎么如何怎样怎么办如何改善].*/.test(combined)) result.questionType = 'guidance';
      else if (/[为什么为何原因什么意思怎么回事].*/.test(combined)) result.questionType = 'exploration';

      // Keywords extraction
      const allKws = [...new Set(Object.values(domainKws).flat())];
      result.keywords = allKws.filter(k => combined.includes(k));

      // Entity extraction (simple)
      const personEntities = ['男朋友','女朋友','老公','老婆','对象','前任','老板','同事','老师','朋友','父母','妈妈','爸爸','孩子'];
      for (const e of personEntities) {
        if (combined.includes(e)) result.entities.person = e;
      }
      const eventEntities = ['分手','吵架','冷战','面试','考试','生病','辞职','跳槽','搬家'];
      for (const e of eventEntities) {
        if (combined.includes(e)) result.entities.event = e;
      }

      // Core conflict detection
      if (result.sentiment.includes('painful') && result.domain === 'love') result.coreConflict = 'relationship_deterioration';
      else if (result.sentiment.includes('confused') && result.questionType === 'choice') result.coreConflict = 'decision_paralysis';
      else if (result.sentiment.includes('anxious') && result.domain === 'career') result.coreConflict = 'career_uncertainty';
      else if (result.sentiment.includes('hopeful') && result.questionType === 'prediction') result.coreConflict = 'hope_vs_reality';

      return result;
    },

    // ── Layer 5: Context guidance (spread-specific context placeholder) ──
    getContextPlaceholder(spread) {
      const sid = spread?.id || '';
      const map = {
        'celtic-cross': { zh: '凯尔特十字最需要完整的背景。说说这件事从什么时候开始、涉及谁、你此刻的心情如何？背景越完整，解读越深入。', en: 'The Celtic Cross needs full context. When did this begin, who is involved, what are you feeling now? The more complete the background, the deeper the reading.' },
        'relationship': { zh: '补充更多背景：你们认识多久了？现在的关系状态是什么？最近一次让你觉得"需要问牌"的事情是什么？', en: 'Add more context: How long have you known each other? What\'s the current state? What was the most recent event that made you feel "I need to ask the cards"?' },
        'three-card': { zh: '三张牌串联时间的线索。你说的这件事，过去的关键节点是什么？现在卡在哪里？对未来的期待或担忧是什么？', en: 'Three cards thread the timeline. What was the key turning point in the past? Where are you stuck now? What hopes or fears do you hold for the future?' },
        'choice': { zh: '补充每个选项的具体情况——选项A是什么样的？选项B又是什么样的？你倾向于哪个，为什么又犹豫？', en: 'Describe each option concretely — what does option A look like? Option B? Which do you lean toward, and why do you hesitate?' },
      };
      const tmpl = map[sid];
      if (tmpl) return tmpl.zh + '\n\n' + tmpl.en;
      if (spread?.category === 'love') {
        return '补充更多关于这段感情的背景——怎么认识的、在一起多久了、现在最大的困扰是什么、你希望的结果是什么？\n\nAdd more context — how did you meet, how long have you been together, what troubles you most now, what outcome do you hope for?';
      }
      if (spread?.category === 'career') {
        return '补充更多事业背景——你在这个行业多久了、当前岗位的瓶颈是什么、你对未来的职业愿景是什么？\n\nAdd more career context — how long in this industry, what is the bottleneck in your current role, what is your career vision?';
      }
      return '分享更多背景——事情从何时开始、涉及谁、你此刻的感受。星辰映照得越清晰，解读便越贴近你的处境。\n\nShare more background — when did this begin, who is involved, what do you feel now? The clearer the stars reflect, the closer the reading will touch your situation.';
    },

    // ── Legacy API compatibility ──
    classify(question) {
      if (!question) return 'general';
      const q = question.toLowerCase();
      if (/should i|要不要|该不该|是否|should|whether|or|还是|选择|抉择/.test(q)) return 'choice';
      if (/what will|will i|would i|会不会|会.*吗|将.*吗|未来.*会|预测|将要/.test(q)) return 'prediction';
      if (/how can|how do|how should|how to|怎么|如何|怎样|怎么才能|如何改善|怎么办/.test(q)) return 'guidance';
      if (/why|为什么|为何|原因|what does.*mean|什么意思|怎么回事/.test(q)) return 'exploration';
      return 'general';
    },
    detectDomain(question) {
      if (!question) return 'general';
      const q = question.toLowerCase();
      const domainKws = {
        love: ['love','relationship','partner','marriage','dating','breakup','crush','boyfriend','girlfriend','wife','husband','romance','heart','date','couple','divorce','affair','ex','他','她','喜欢','暗恋','分手','复合','恋爱','感情','爱情','对象','伴侣','结婚','离婚','前任','追求','表白','相亲','暧昧','老公','老婆','男朋友','女朋友','婚姻','情'],
        career: ['career','job','work','business','promotion','boss','colleague','interview','salary','startup','company','office','professional','hire','fired','quit','resign','工作','职业','事业','公司','老板','同事','升职','面试','工资','创业','跳槽','辞职','招聘','上班','行业','项目','团队','管理'],
        wealth: ['money','wealth','finance','invest','debt','save','budget','income','financial','poor','rich','spend','钱','财','理财','投资','负债','存钱','收入','财务','赚钱','花钱','经济','基金','股票','贷款','生意','消费'],
        study: ['study','learn','exam','test','school','college','university','degree','student','teacher','course','grade','academic','knowledge','education','学习','考试','学校','大学','学位','学生','老师','课程','成绩','知识','教育','考研','高考','论文','留学'],
        destiny: ['purpose','meaning','destiny','fate','soul','spiritual','path','direction','life','future','calling','使命','命运','灵魂','意义','人生','方向','未来','召唤','天命','精神','灵性','成长','转变','运势','前景','缘分','机会'],
      };
      const scores = {};
      for (const [d, kws] of Object.entries(domainKws)) {
        scores[d] = kws.filter(k => q.includes(k.toLowerCase())).length;
      }
      const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
      return best[1] > 0 ? best[0] : 'general';
    },
    isVague(question) {
      if (!question || question.trim().length < 8) return true;
      return /感情怎么样|事业怎么样|财运怎么样|人生怎么样|未来怎么样|tell me about (my )?(love|career|life)|what about (my )?(love|career|money|life)/i.test(question);
    },
    getRefinements(question) {
      const domain = this.detectDomain(question);
      const adaptive = this.getAdaptiveHint(question);
      if (adaptive) return [{ zh: adaptive.zh, en: adaptive.en }];
      // Fallback: return 2 missing info prompts
      const missing = this.getMissingPrompts(question);
      return missing.slice(0, 2);
    },
  };

  // Backwards-compatible alias
  const QUESTION_SYSTEM = QUESTION_GUIDANCE;

  // ═══════════════════════════════════════════
  // 10. TIMING
  // Source: 葵花宝典
  // ═══════════════════════════════════════════
  const TIMING = {
    zodiacData: {
      4: { sign:'Aries',signZh:'白羊座',start:'03-21',end:'04-20' },
      5: { sign:'Taurus',signZh:'金牛座',start:'04-21',end:'05-20' },
      6: { sign:'Gemini',signZh:'双子座',start:'05-21',end:'06-20' },
      7: { sign:'Cancer',signZh:'巨蟹座',start:'06-21',end:'07-21' },
      8: { sign:'Leo',signZh:'狮子座',start:'07-22',end:'08-22' },
      9: { sign:'Virgo',signZh:'处女座',start:'08-23',end:'09-22' },
      11: { sign:'Libra',signZh:'天秤座',start:'09-23',end:'10-22' },
      13: { sign:'Scorpio',signZh:'天蝎座',start:'10-23',end:'11-22' },
      14: { sign:'Sagittarius',signZh:'射手座',start:'11-23',end:'12-21' },
      15: { sign:'Capricorn',signZh:'摩羯座',start:'12-22',end:'01-19' },
      17: { sign:'Aquarius',signZh:'水瓶座',start:'01-20',end:'02-18' },
      18: { sign:'Pisces',signZh:'双鱼座',start:'02-19',end:'03-20' },
    },
    suitSeasons: {
      wands: { season:'Spring',seasonZh:'春', en: 'Wands bring the vigor of spring — a time of new shoots, bold beginnings, and the fire of initiative. Look for the opening within the next season.', zh: '权杖带来春日的活力——新芽萌发、大胆开启、进取之火。在下一个季节内留意开端的出现。' },
      cups: { season:'Summer',seasonZh:'夏', en: 'Cups flow with the fullness of summer — a time of ripening emotion, deep connection, and the heart\'s high tide. The fruition arrives in the warm season.', zh: '圣杯随夏日的丰盈流淌——情感成熟、深度连接、心灵涨潮之时。果实在温暖的季节到来。' },
      swords: { season:'Autumn',seasonZh:'秋', en: 'Swords cut with the clarity of autumn — a time of harvest, truth-telling, and the mind\'s sharp edge. Resolution comes as the leaves fall.', zh: '宝剑以秋日的清明切割——收获、直言真相、心智利刃之时。落叶飘零之际，答案浮现。' },
      pentacles: { season:'Winter',seasonZh:'冬', en: 'Pentacles rest in the stillness of winter — a time of preservation, slow building, and the earth\'s deep patience. The foundation sets in the quiet months.', zh: '星币在冬日的静谧中安住——保存、缓慢建造、大地深沉耐心之时。根基在寂静的月份奠定。' },
    },
    lunarPhases: {
      0: { phase:'New Moon',phaseZh:'新月', en: 'The Fool aligns with the New Moon — a seed moment, invisible yet potent. Begin in darkness; the light will find you.', zh: '愚人与新月对齐——种子的时刻，无形却充满潜力。在黑暗中开始；光会找到你。' },
      1: { phase:'Waxing Crescent',phaseZh:'蛾眉月', en: 'The Magician heralds the Waxing Crescent — the first sliver of intention made visible. Gather your tools; the working has begun.', zh: '魔术师预示蛾眉月——意图的第一缕可见之光。收拢你的工具；工作已经开始。' },
      2: { phase:'First Quarter',phaseZh:'上弦月', en: 'The High Priestess sits at the First Quarter — half-hidden, half-revealed. Trust what you sense more than what you see.', zh: '女祭司坐于上弦月——半隐半现。信任你所感的甚于你所见的。' },
      3: { phase:'Waxing Gibbous',phaseZh:'盈凸月', en: 'The Empress blesses the Waxing Gibbous — abundance swells toward fullness. Nurture what grows; it is almost ripe.', zh: '皇后祝福盈凸月——丰饶向圆满膨胀。滋养正在生长的；它已接近成熟。' },
      18: { phase:'Full Moon',phaseZh:'满月', en: 'The Moon card under the Full Moon — revelation and illusion dance as one. What is hidden will surface; what surfaces may not be what it seems.', zh: '月亮牌在满月之下——启示与幻象共舞。隐藏的将会浮现；浮现的未必如其所见。' },
    },
    elementSpeeds: {
      fire: { speed:'Fast',speedZh:'快', en: 'Fire moves swiftly — days to weeks. The spark catches quickly; be ready to act when it does.', zh: '火行迅疾——数日至数周。火星迅速点燃；准备好在那时行动。' },
      water: { speed:'Moderate',speedZh:'中速', en: 'Water moves at the pace of feeling — weeks to a month. Let the current carry; do not push the river.', zh: '水以感受的节奏流动——数周至一月。让水流承载；不要推动河流。' },
      air: { speed:'Variable',speedZh:'变化', en: 'Air shifts like thought — sudden clarity or prolonged uncertainty. The answer comes when the mind quiets.', zh: '风如思绪般变幻——突然的清明或漫长的犹疑。当心智安静时，答案自来。' },
      earth: { speed:'Slow',speedZh:'慢', en: 'Earth takes its time — months to seasons. The root grows before the branch shows. Trust the unseen foundation.', zh: '土从缓——数月至数季。根在枝显现之前已生长。信任看不见的根基。' },
    },
    methods: {
      number: function(num) {
        if (num === 0) return { en: 'The Fool appears — timing cannot be fixed, for the leap has no hour. Trust the unfolding.', zh: '愚人现身——时机不可确定，因为那一跃没有固定的时刻。信任展开的过程。' };
        if (num <= 3) return { num, unit:'days',unitZh:'天', en: `The cards suggest a short horizon — about ${num} days. Watch closely in the coming days.`, zh: `牌面暗示一个短暂的视野——约${num}天。在接下来的日子里密切留意。` };
        if (num <= 7) return { num, unit:'weeks',unitZh:'周', en: `A matter of weeks — approximately ${num}. Let patience be your companion.`, zh: `数周之内——约${num}周。让耐心为伴。` };
        return { num, unit:'months',unitZh:'个月', en: `The stars point to roughly ${num} months. This is not a countdown but a season of ripening.`, zh: `星辰指向约${num}个月。这不是倒计时，而是一个成熟的季节。` };
      },
      zodiac(num) {
        const entry = TIMING.zodiacData[num];
        if (!entry) return null;
        return {
          en: `Card ${num} is linked to ${entry.sign} (${entry.start}–${entry.end}). The stars suggest this zodiac season as a window of heightened alignment — a time when the energies of this card are most accessible.`,
          zh: `牌号${num}关联${entry.signZh}（${entry.start}–${entry.end}）。星辰建议将此星座时节视为高度对齐的窗口——此时此牌的能量最为通达。`,
        };
      },
      suitSeason(suit) {
        const entry = TIMING.suitSeasons[suit];
        if (!entry) return null;
        return { en: entry.en, zh: entry.zh };
      },
      lunarPhase(cards) {
        const firstMajor = cards.find(c => c.data?.arcana === 'major');
        if (!firstMajor) return null;
        const num = firstMajor.data.number;
        if (TIMING.lunarPhases[num]) {
          const lp = TIMING.lunarPhases[num];
          return { en: lp.en, zh: lp.zh };
        }
        const generalPhases = [
          { en: 'The cards reflect a waxing energy — things are building toward fullness. The next two weeks hold the key.', zh: '牌面反映渐盈的能量——事物正趋向圆满。未来两周是关键。' },
          { en: 'A waning energy surrounds this reading — time to release, reflect, and prepare the ground for the next cycle.', zh: '渐亏的能量环绕此解读——释放、反思、为下一个周期准备土壤的时刻。' },
        ];
        const pick = generalPhases[num % 2];
        return pick || null;
      },
      elementalCycle(cards) {
        const allElements = [];
        cards.forEach(c => {
          const el = c.data?.element || ({wands:'fire',cups:'water',swords:'air',pentacles:'earth'}[c.data?.suit]);
          if (el) allElements.push(el);
        });
        if (allElements.length === 0) return null;
        const dominant = allElements.sort((a,b) =>
          allElements.filter(v=>v===a).length - allElements.filter(v=>v===b).length
        ).pop();
        const speed = TIMING.elementSpeeds[dominant];
        if (!speed) return null;
        return { en: speed.en, zh: speed.zh };
      },
    },
  };

  // ═══════════════════════════════════════════
  // 11. UTILITY FUNCTIONS
  // ═══════════════════════════════════════════
  const UTILS = {
    countSuits(cards) {
      const counts = { wands:0, cups:0, swords:0, pentacles:0, major:0 };
      cards.forEach(dc => {
        const card = dc.data || (typeof getCardById === 'function' ? getCardById(dc.cardId) : null);
        if (!card) return;
        if (card.arcana === 'major') counts.major++;
        else if (counts.hasOwnProperty(card.suit)) counts[card.suit]++;
      });
      return counts;
    },
    countElements(cards) {
      const el = { fire:0, water:0, air:0, earth:0 };
      const s2e = { wands:'fire', cups:'water', swords:'air', pentacles:'earth' };
      cards.forEach(dc => {
        const card = dc.data || (typeof getCardById === 'function' ? getCardById(dc.cardId) : null);
        if (!card) return;
        if (card.element) el[card.element] = (el[card.element]||0) + 1;
        else if (card.suit && s2e[card.suit]) el[s2e[card.suit]] = (el[s2e[card.suit]]||0) + 1;
      });
      return el;
    },
    countNumbers(cards) {
      const counts = {};
      cards.forEach(dc => {
        const card = dc.data || (typeof getCardById === 'function' ? getCardById(dc.cardId) : null);
        if (!card?.number) return;
        counts[card.number] = (counts[card.number]||0) + 1;
      });
      return counts;
    },
    countReversed(drawnCards) { return drawnCards.filter(dc => dc.isReversed).length; },
    getReversalLesson(card) {
      if (!card) return null;
      if (card.arcana === 'major') {
        const prevKey = REVERSAL_CHAINS.MAJOR_SEQUENCE[card.number];
        const lesson = REVERSAL_CHAINS.MAJOR_LESSONS[prevKey];
        return lesson ? { ...lesson, previousCard: prevKey } : null;
      }
      if (card.suit && card.number && REVERSAL_CHAINS.minor[card.suit]) {
        const prevNum = REVERSAL_CHAINS.minor[card.suit][card.number];
        if (prevNum !== undefined) {
          return {
            en: `The lesson of the ${prevNum} of this suit was not fully mastered — return and complete it before this energy can flow freely.`,
            zh: `此牌组中数字${prevNum}的课题未被完全掌握——回去完成它，然后这股能量才能自由流动。`,
            previousNumber: prevNum,
          };
        }
      }
      return null;
    },
    getCourtInterpretation(card, isReversed) {
      if (!card || !['king','queen','knight','page'].includes(card.rank)) return null;
      const rankInfo = COURT_SYSTEM.rankTraits[card.rank];
      const suitInfo = COURT_SYSTEM.suitModifiers[card.suit];
      if (!rankInfo || !suitInfo) return null;
      const r = isReversed ? 'reversed' : 'upright';
      return {
        rank: card.rank, suit: card.suit,
        persona: rankInfo.persona,
        description: r === 'upright' ? rankInfo.asPerson : rankInfo.reversed,
        querentMeaning: r === 'upright' ? rankInfo.asQuerent : { en: rankInfo.reversed.en, zh: rankInfo.reversed.zh },
        realm: suitInfo,
        question: suitInfo.question,
        questionZh: suitInfo.questionZh,
      };
    },
  };

  // ═══════════════════════════════════════════
  // 12. THREE-ROW CONSCIOUSNESS FRAMEWORK
  // Source: 78度的智慧 (Rachel Pollack)
  // Major Arcana layered into 3 rows of 7 cards each
  // Row 1: Conscious (I-VII)  — ego, outer mastery
  // Row 2: Subconscious (VIII-XIV) — inner work, shadow
  // Row 3: Superconscious (XV-XXI) — cosmic, liberation
  // Fool (0) stands outside all rows — the ever-present potential
  // World (21) completes the journey — integration of all three
  // ═══════════════════════════════════════════
  const THREE_ROWS = {
    rows: {
      conscious: {
        name: 'Conscious · 意识层', number: 1, range: [1, 7],
        cards: ['magician','high-priestess','empress','emperor','hierophant','lovers','chariot'],
        meaning: {
          en: 'The Conscious Row — the ego\'s journey of mastering the outer world. These cards speak of identity, choice, authority, and the building of a self that can stand in the world. When this row dominates, the question is about outer action, relationship, and worldly identity.',
          zh: '意识层——小我的外在世界掌控之旅。这些牌关乎身份、选择、权威、以及一个能够立于世间的自我的建立。当此行主导时，问题关乎外在行动、关系与世俗身份。',
        },
        excess: {
          en: 'Too many cards in the Conscious Row suggest over-identification with the outer self — doing without being, acting without reflecting.',
          zh: '意识层牌过多暗示过度认同外在自我——只有"做"没有"是"，只有行动没有反思。',
        },
        absence: {
          en: 'No cards in the Conscious Row suggests the question bypasses the surface self entirely — the real work is happening at deeper or higher levels.',
          zh: '意识层无牌暗示此问题完全绕过了表面自我——真正的工作在更深或更高的层面进行。',
        },
      },
      subconscious: {
        name: 'Subconscious · 潜意识层', number: 2, range: [8, 14],
        cards: ['strength','hermit','wheel-of-fortune','justice','hanged-man','death','temperance'],
        meaning: {
          en: 'The Subconscious Row — the inward journey of transformation, shadow-work, and the alchemical marriage of opposites. Here the hero withdraws from the outer world to face the inner depths. When this row dominates, the question is about inner change, healing, and the hidden forces shaping outer events.',
          zh: '潜意识层——向内转变、阴影工作、对立面的炼金结合之旅。英雄从外在世界撤回，面对内在的深渊。当此行主导时，问题关乎内在转变、疗愈、以及塑造外在事件的隐藏力量。',
        },
        excess: {
          en: 'Too many cards in the Subconscious Row suggest being stuck in introspection — the inner work is rich, but it may be time to bring those insights back to the surface.',
          zh: '潜意识层牌过多暗示陷入内省——内在工作很丰富，但或许该将这些洞察带回表层了。',
        },
        absence: {
          en: 'No cards in the Subconscious Row suggests the question is being approached purely through external action or spiritual ideals — the messy, human, feeling middle is being skipped.',
          zh: '潜意识层无牌暗示问题纯粹通过外在行动或灵性理想在处理——混乱、人性、感受丰富的中间层被跳过了。',
        },
      },
      superconscious: {
        name: 'Superconscious · 超意识层', number: 3, range: [15, 21],
        cards: ['devil','tower','star','moon','sun','judgment','world'],
        meaning: {
          en: 'The Superconscious Row — the encounter with forces larger than the personal self. Shadow and liberation, destruction and renewal, cosmic darkness and cosmic light. When this row dominates, the question touches something transpersonal — a soul contract, a collective pattern, a destiny-level unfolding.',
          zh: '超意识层——与超越个人自我之力量的相遇。阴影与解放、毁灭与重生、宇宙之暗与宇宙之光。当此行主导时，问题触及某种超越个人之物——一份灵魂契约、一种集体模式、一个命运级别的展开。',
        },
        excess: {
          en: 'Too many cards in the Superconscious Row suggest the ground is too thin — too much cosmic energy, not enough practical footing. Ground these vast forces in daily life.',
          zh: '超意识层牌过多暗示根基太薄——宇宙能量过多，实际立足点不足。将这些广阔的力量扎根于日常生活之中。',
        },
        absence: {
          en: 'No cards in the Superconscious Row suggests the question is being kept safely within the personal sphere — but the soul may be calling for a wider view.',
          zh: '超意识层无牌暗示问题被安全地限制在个人领域——但灵魂可能在呼唤更宽广的视野。',
        },
      },
    },
    analyze(cards) {
      const majors = cards.filter(c => c.data?.arcana === 'major');
      if (majors.length === 0) return null;
      const counts = { conscious: 0, subconscious: 0, superconscious: 0, fool: 0 };
      const detail = [];
      majors.forEach(c => {
        const id = c.data.id;
        if (id === 'fool') { counts.fool++; detail.push({ card: c, row: 'fool' }); return; }
        let found = false;
        for (const [rowName, row] of Object.entries(this.rows)) {
          if (row.cards.includes(id)) {
            counts[rowName]++;
            detail.push({ card: c, row: rowName });
            found = true;
            break;
          }
        }
        if (!found) detail.push({ card: c, row: 'unknown' });
      });
      const total = majors.length;
      const dominantRow = Object.entries(counts).filter(([,c]) => c > 0).sort((a,b) => b[1] - a[1])[0];
      const pct = dominantRow ? dominantRow[1] / total : 0;
      const rowInfo = this.rows[dominantRow?.[0]];
      return { counts, detail, dominantRow: dominantRow?.[0], pct, rowInfo, totalMajors: total };
    },
    buildSummary(analysis) {
      if (!analysis || analysis.totalMajors === 0) return null;
      const { dominantRow, pct, rowInfo, counts } = analysis;
      let en = '', zh = '';
      if (counts.fool > 0) {
        en += `The Fool appears ${counts.fool > 1 ? `${counts.fool} times` : ''} outside all rows — a wild card of pure potential, untethered from the three-tiered journey. `;
        zh += `愚人出现于三层之外——纯粹可能的百搭牌，不受三层之旅的约束。`;
      }
      if (rowInfo && pct >= 0.4) {
        en += `The ${rowInfo.name} dominates (${Math.round(pct*100)}%). ${rowInfo.meaning.en}`;
        zh += `${rowInfo.name}主导（${Math.round(pct*100)}%）。${rowInfo.meaning.zh}`;
      } else if (rowInfo) {
        en += `The Major Arcana distribute across all three rows — conscious, subconscious, and superconscious forces are in dialogue.`;
        zh += `大阿尔卡纳分布于全部三层——意识、潜意识与超意识之力正在对话。`;
      }
      // Absence warnings
      for (const [rname, rdata] of Object.entries(this.rows)) {
        if (counts[rname] === 0 && analysis.totalMajors >= 3) {
          en += ` ${rdata.absence.en}`;
          zh += ` ${rdata.absence.zh}`;
        }
        if (counts[rname] >= 3) {
          en += ` ${rdata.excess.en}`;
          zh += ` ${rdata.excess.zh}`;
        }
      }
      return { en, zh, dominantRow, rowInfo };
    },
  };

  // ═══════════════════════════════════════════
  // 13. CARD DIGNITY SYSTEM
  // Source: 葵花宝典 + 其实你已经很塔罗了
  // How neighboring cards strengthen or weaken each other
  // ═══════════════════════════════════════════
  const CARD_DIGNITY = {
    analyze(cards, spread) {
      const results = [];
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]?.data;
        if (!card) continue;
        let score = 0;
        const modifiers = [];
        const neighbors = [];
        if (i > 0 && cards[i-1]?.data) neighbors.push({ side: 'left', card: cards[i-1].data, idx: i-1 });
        if (i < cards.length - 1 && cards[i+1]?.data) neighbors.push({ side: 'right', card: cards[i+1].data, idx: i+1 });

        for (const nb of neighbors) {
          const cEl = card.element || ({wands:'fire',cups:'water',swords:'air',pentacles:'earth'}[card.suit]);
          const nEl = nb.card.element || ({wands:'fire',cups:'water',swords:'air',pentacles:'earth'}[nb.card.suit]);

          // Same element neighbor = strengthened (+2)
          if (cEl && nEl && cEl === nEl) {
            score += 2;
            modifiers.push({
              type: 'strengthened', source: nb.card.id, side: nb.side,
              en: `Strengthened by ${nb.card.nameEn} — same element (${cEl}) resonance. Energy flows unimpeded.`,
              zh: `被${nb.card.name}增强——同元素（${cEl}）共鸣。能量畅流无阻。`,
            });
          }
          // Conflicting element neighbor = challenged (-1)
          const conflictPairs = [['fire','water'], ['air','earth']];
          for (const [x, y] of conflictPairs) {
            if (cEl && nEl && ((cEl === x && nEl === y) || (cEl === y && nEl === x))) {
              score -= 1;
              modifiers.push({
                type: 'challenged', source: nb.card.id, side: nb.side,
                en: `Challenged by ${nb.card.nameEn} — cross-element tension (${cEl} & ${nEl}). Integration required.`,
                zh: `被${nb.card.name}挑战——跨元素张力（${cEl}与${nEl}）。需要整合。`,
              });
            }
          }
          // Major Arcana neighbor = amplified (+1 for being noticed by archetypal force)
          if (nb.card.arcana === 'major' && card.arcana === 'minor') {
            score += 1;
            modifiers.push({
              type: 'amplified', source: nb.card.id, side: nb.side,
              en: `Amplified by the presence of ${nb.card.nameEn} — a Major Arcana casts its archetypal light on this card.`,
              zh: `因${nb.card.name}的在场而被放大——大阿尔卡纳将其原型之光照在这张牌上。`,
            });
          }
          // Same number resonance (+1)
          if (card.number && nb.card.number && card.number === nb.card.number && card.suit !== nb.card.suit) {
            score += 1;
            modifiers.push({
              type: 'resonance', source: nb.card.id, side: nb.side,
              en: `Number ${card.number} resonates with ${nb.card.nameEn} — the same life-theme echoes across suits.`,
              zh: `数字${card.number}与${nb.card.name}共鸣——同一生命主题跨牌组回响。`,
            });
          }
          // Court + same-suit minor = court oversees
          if (card.rank && nb.card.suit) {
            const courtSuit = ({wands:'wands',cups:'cups',swords:'swords',pentacles:'pentacles'})[card.suit];
            if (courtSuit === nb.card.suit) {
              score += 1;
              modifiers.push({
                type: 'overseeing', source: nb.card.id, side: nb.side,
                en: `${card.nameEn} (${card.rank}) oversees ${nb.card.nameEn} — the court figure brings mastery to this suit energy.`,
                zh: `${card.name}（${card.rank}）照看${nb.card.name}——宫廷人物为这股牌组能量带来精通之力。`,
              });
            }
          }
        }

        // Reversal effect on dignity: reversed cards lose influence
        if (cards[i].isReversed && score > 0) {
          score = Math.max(0, score - 2);
          modifiers.push({
            type: 'diminished', source: 'reversed',
            en: 'Reversed — this card\'s outward influence is muted. Its energy works inwardly.',
            zh: '逆位——此牌的外在影响力被减弱。其能量向内运作。',
          });
        }

        const level = score >= 3 ? 'exalted' : score >= 1 ? 'dignified' : score <= -1 ? 'weakened' : 'neutral';
        const levelNames = {
          exalted: { en: 'Exalted · 极强', zh: '极为有力' },
          dignified: { en: 'Dignified · 有力', zh: '有力' },
          neutral: { en: 'Neutral · 中性', zh: '中性' },
          weakened: { en: 'Weakened · 受制', zh: '受制' },
        };
        results.push({ index: i, card, score, level, levelName: levelNames[level], modifiers });
      }
      return results;
    },
  };

  // ═══════════════════════════════════════════
  // 14. CONTRADICTORY CARDS
  // Source: 你可以再塔罗一点 — when cards give opposing guidance
  // ═══════════════════════════════════════════
  const CONTRADICTORY = {
    // Resolution axis: each pair of opposites and how to reconcile them
    axes: {
      'action-wait': {
        actionKeys: ['chariot','magician','knight','eight','wands','emperor','judgment','sun','fool'],
        waitKeys: ['hanged-man','hermit','four','moon','high-priestess','temperance','seven'],
        resolution: {
          en: 'One force urges action; another counsels patience. The wisdom is in the sequence: prepare inwardly (the waiting card), then act when the inner work is complete. Not "either/or" but "first/then."',
          zh: '一方催促行动；另一方劝告耐心。智慧在于顺序：先做内在的准备（等待之牌），内在工作完成之时再行动。不是"要么/要么"，而是"先/后"。',
        },
      },
      'hold-letgo': {
        holdKeys: ['emperor','hierophant','six','nine','four','pentacles','justice','strength'],
        letgoKeys: ['death','tower','fool','hanged-man','eight','five','swords'],
        resolution: {
          en: 'One voice says hold on; another says let go. Ask: is what you\'re holding a treasure or a cage? Structure that serves your growth is worth keeping; structure that limits it must fall. The cards don\'t disagree — they distinguish between what to preserve and what to release.',
          zh: '一个声音说坚持；另一个说放手。去问：你紧握的是珍宝还是牢笼？服务于你成长的结构值得保留；限制它的结构必须崩塌。牌并不矛盾——它们在帮你区分哪些该留存、哪些该释出。',
        },
      },
      'speak-silence': {
        speakKeys: ['magician','chariot','justice','sun','judgment','queen','page','eight'],
        silenceKeys: ['high-priestess','hermit','moon','four','seven','hanged-man'],
        resolution: {
          en: 'One card wants words; another values silence. The resolution: speak from stillness, not from anxiety. The truth that emerges in silence (the quiet card) is the truth worth speaking (the expressive card).',
          zh: '一张牌想要言语；另一张珍视沉默。解法：从静定中发言，而非从焦虑中。于沉默中浮现的真相（静默之牌），才是值得说出的真相（表达之牌）。',
        },
      },
      'change-stay': {
        changeKeys: ['death','tower','fool','wheel-of-fortune','chariot','five','eight','three'],
        stayKeys: ['four','six','nine','ten','hanged-man','temperance','two','empress'],
        resolution: {
          en: 'One card demands change; another anchors stability. Wisdom: change the inner pattern, and the outer structure can evolve rather than collapse. Or: keep the foundation, renovate the house.',
          zh: '一张牌要求改变；另一张锚定稳定。智慧：改变内在模式，外在结构便能演进而非崩塌。或者：保留地基，翻修房屋。',
        },
      },
    },
    detect(cards) {
      const issues = [];
      const allKeys = cards.map(c => {
        const data = c.data;
        if (!data) return [];
        const keys = [data.id, data.suit, data.rank, String(data.number)];
        if (data.arcana === 'major') keys.push('major');
        return keys.filter(Boolean);
      });

      for (const [axisName, axis] of Object.entries(this.axes)) {
        // Dynamically resolve the two key groups (naming varies by axis)
        const keyGroups = Object.entries(axis).filter(([k]) => k.endsWith('Keys'));
        if (keyGroups.length < 2) continue;
        const [groupAName, groupAKeys] = keyGroups[0];
        const [groupBName, groupBKeys] = keyGroups[1];

        let scoreA = 0, scoreB = 0;
        const cardsA = [], cardsB = [];
        cards.forEach((c, i) => {
          if (!c.data) return;
          const cardKeys = allKeys[i];
          const isA = groupAKeys.some(k => cardKeys.includes(k));
          const isB = groupBKeys.some(k => cardKeys.includes(k));
          if (isA && !isB) { scoreA++; cardsA.push(c.data); }
          if (isB && !isA) { scoreB++; cardsB.push(c.data); }
        });
        if (scoreA >= 1 && scoreB >= 1) {
          issues.push({
            axis: axisName, axisData: axis,
            activeCards: cardsA, passiveCards: cardsB,
            activeScore: scoreA, passiveScore: scoreB,
          });
        }
      }
      return issues;
    },
    buildResolution(issues) {
      if (!issues || issues.length === 0) return null;
      let en = '', zh = '';
      issues.forEach(issue => {
        const activeNames = issue.activeCards.map(c => c.nameEn).join(' + ');
        const passiveNames = issue.passiveCards.map(c => c.nameEn).join(' + ');
        const activeNamesZh = issue.activeCards.map(c => c.name).join('+');
        const passiveNamesZh = issue.passiveCards.map(c => c.name).join('+');
        en += `${activeNames} push forward while ${passiveNames} pull back. ${issue.axisData.resolution.en}\n`;
        zh += `${activeNamesZh}向前推进而${passiveNamesZh}向后牵引。${issue.axisData.resolution.zh}\n`;
      });
      return { en: en.trim(), zh: zh.trim() };
    },
  };

  // ═══════════════════════════════════════════
  // 15. GATE CARDS (门坎牌)
  // Source: 78度的智慧
  // Cards signaling a threshold — a crossing from one state to another
  // ═══════════════════════════════════════════
  const GATE_CARDS = {
    gates: {
      death: {
        name: 'Death', nameZh: '死神',
        en: 'The great release. A gate that can only be passed by letting go — of an identity, a relationship, a chapter, a way of being. What dies is not you but what you have outgrown. Cross this threshold empty-handed; you will receive what you need on the other side.',
        zh: '伟大的释放。一道只能通过放手才能通过的门——放下一种身份、一段关系、一个篇章、一种存在方式。死去的不是你，而是你已超越的东西。空手穿越此门；在另一边你将得到你需要的。',
      },
      tower: {
        name: 'Tower', nameZh: '高塔',
        en: 'The shattering gate. Only structures built on falsehood cannot pass through. The tower falls not to destroy you but to free you from what you built on sand. The lightning is truth; the falling stones are liberation.',
        zh: '粉碎之门。只有建于虚假之上的结构无法通过。高塔倒下不是为了摧毁你，而是为了将你从建在沙上的东西中解放。那闪电是真相；落石是解放。',
      },
      judgment: {
        name: 'Judgment', nameZh: '审判',
        en: 'The awakening gate. A summons you cannot ignore — the call to rise, to answer, to become what you were always meant to be. This gate does not judge you; it calls you to stop judging yourself and start living your true calling.',
        zh: '觉醒之门。一道你无法忽视的召唤——起身、回应、成为你始终注定成为的人。这道门不审判你；它召唤你停止审判自己，开始活出你真正的使命。',
      },
      'hanged-man': {
        name: 'Hanged Man', nameZh: '倒吊人',
        en: 'The surrender gate. You cannot push through this threshold with will or cleverness. It opens only when you stop struggling, let yourself be suspended, and see the world from an angle you never chose. The view from here changes everything.',
        zh: '臣服之门。你无法用意志或机巧推开这道门。只有当你停止挣扎、让自己悬置、从你从未选择的角度看世界时，它才会开启。从这里看到的景象改变一切。',
      },
      moon: {
        name: 'Moon', nameZh: '月亮',
        en: 'The shadow gate. You must walk through what you fear to reach what you are becoming. This is a night passage — you will not see clearly, but you will feel truly. Trust the moonlight, not the map. The gate opens inward.',
        zh: '阴影之门。你必须穿过你所恐惧的，才能抵达你正在成为的。这是一段夜行——你不会看得清楚，但你会感受得真实。信任月光，不信任地图。此门向内开启。',
      },
      world: {
        name: 'World', nameZh: '世界',
        en: 'The completion gate. The final threshold of a great cycle. You arrive not to end but to integrate — everything you have been, everything you have learned, woven now into wholeness. Pass through this gate and a new cycle begins on the other side.',
        zh: '圆满之门。一个大周期的最后门槛。你抵达不是为了结束，而是为了整合——你所曾是的一切、所学到的一切，此刻织成完整。穿越此门，另一边将开启新的轮回。',
      },
      fool: {
        name: 'Fool', nameZh: '愚人',
        en: 'The leap gate. The only way through is to trust and step forward without knowing. Every other gate requires something of you; this one requires you to release the need to know. The abyss you fear is actually the next ground rising to meet you.',
        zh: '飞跃之门。唯一的通过方式是信任，并在不知中迈步向前。其他每道门都需要你给出什么；这道门需要你放下"要知道"的需求。你害怕的深渊，其实是下一片大地正在升起来接住你。',
      },
      chariot: {
        name: 'Chariot', nameZh: '战车',
        en: 'The triumph gate. You pass through by harnessing opposites — the two sphinxes, the inner contradictions — and driving them toward a single goal. This gate tests not your strength but your ability to hold tension without breaking.',
        zh: '凯旋之门。你通过驾驭对立而穿越——两只斯芬克斯、内在的矛盾——驱使它们朝向同一目标。这道门考验的不是你的力量，而是你在不崩溃的情况下承受张力的能力。',
      },
    },
    detect(cards) {
      const found = [];
      cards.forEach((c, i) => {
        const id = c.data?.id;
        if (id && this.gates[id]) {
          found.push({ ...this.gates[id], index: i, card: c.data, id });
        }
      });
      return found;
    },
  };

  // ═══════════════════════════════════════════
  // 16. HEALTH CORRESPONDENCES
  // Source: 你可以再塔罗一点 + 塔罗全书
  // ═══════════════════════════════════════════
  const HEALTH = {
    suitBody: {
      wands: {
        en: 'Wands govern the head, spine, and the fire of the nervous system. They speak of energy levels, inflammation, and the body\'s drive to act.',
        zh: '权杖主管头部、脊柱与神经系统之火。关乎能量水平、炎症与身体行动之驱力。',
      },
      cups: {
        en: 'Cups govern the heart, circulation, and the water of the emotional body. They speak of fluid balance, hormonal rhythms, and the heart\'s capacity to feel and heal.',
        zh: '圣杯主管心脏、循环系统与情绪体之水。关乎体液平衡、荷尔蒙节律与心灵感受与疗愈之能。',
      },
      swords: {
        en: 'Swords govern the lungs, breath, and the air of the mind-body connection. They speak of stress, anxiety, respiratory health, and the sharp edge where thought affects the flesh.',
        zh: '宝剑主管肺、呼吸与身心连接之风。关乎压力、焦虑、呼吸系统健康，以及思想影响肉身的锋利边界。',
      },
      pentacles: {
        en: 'Pentacles govern the bones, skin, and the earth of the physical foundation. They speak of nutrition, grounding, chronic conditions, and the slow wisdom of the body.',
        zh: '星币主管骨骼、皮肤与身体根基之土。关乎营养、扎根、慢性状况与身体缓慢的智慧。',
      },
    },
    majorHealth: {
      death: { en: 'Major transformation in health — a healing crisis, a necessary purge, the body shedding what no longer serves.', zh: '健康的重大转变——疗愈危机、必要的清除、身体在舍弃不再服务之物。' },
      temperance: { en: 'Balance restored — the body finding its natural equilibrium. Excellent card for recovery and integration.', zh: '平衡恢复——身体找到其自然的中道。极好的康复与整合之牌。' },
      star: { en: 'Healing and renewal. The body\'s regenerative capacity is strong now.', zh: '疗愈与更新。身体的再生能力此刻极强。' },
      moon: { en: 'Hidden conditions, misdiagnosis possible, the need to look deeper for root causes.', zh: '隐藏的问题、可能误诊、需要更深入地寻找根源。' },
      sun: { en: 'Vitality at its peak. Recovery, strength, the body in its most radiant state.', zh: '生命力在巅峰。康复、力量、身体处于最光芒的状态。' },
      tower: { en: 'Sudden health event — a wake-up call from the body demanding immediate attention.', zh: '突发的健康事件——身体发出的、要求立即注意的警钟。' },
      devil: { en: 'Addiction patterns, chronic conditions rooted in habit, the body reflecting unexamined attachments.', zh: '成瘾模式、根植于习惯的慢性问题、身体反映未被审视的执着。' },
    },
    buildNote(cards) {
      const suits = { wands: 0, cups: 0, swords: 0, pentacles: 0 };
      const majorNotes = [];
      cards.forEach(c => {
        if (c.data?.suit && suits.hasOwnProperty(c.data.suit)) suits[c.data.suit]++;
        if (c.data?.arcana === 'major' && this.majorHealth[c.data.id]) {
          majorNotes.push(this.majorHealth[c.data.id]);
        }
      });
      const dominant = Object.entries(suits).sort((a,b) => b[1] - a[1])[0];
      let en = '', zh = '';
      if (dominant && dominant[1] > 0 && this.suitBody[dominant[0]]) {
        en += `The spread's dominant suit (${dominant[0]}, ${dominant[1]} cards) suggests attention to: ${this.suitBody[dominant[0]].en}`;
        zh += `牌阵主导牌组（${dominant[0]}, ${dominant[1]}张）提示关注：${this.suitBody[dominant[0]].zh}`;
      }
      majorNotes.forEach(n => { en += ' ' + n.en; zh += ' ' + n.zh; });
      if (!en) return null;
      return { en, zh };
    },
  };

  // ═══════════════════════════════════════════
  // 17. COLOR SYMBOLISM
  // Source: 其实你已经很塔罗了
  // ═══════════════════════════════════════════
  const COLOR_SYMBOLISM = {
    colors: {
      white: { en: 'Purity, clarity, spiritual light, the blank page before creation.', zh: '纯净、清明、灵性之光、创造之前的空白页。' },
      black: { en: 'The void, the mystery, fertile darkness from which all form emerges.', zh: '虚空、奥秘、一切形式从中诞生的肥沃黑暗。' },
      red: { en: 'Passion, life force, action, desire, the blood of courage and sacrifice.', zh: '热情、生命力、行动、欲望、勇气与牺牲之血。' },
      blue: { en: 'Intuition, depth, the unconscious, spiritual receptivity, cool truth.', zh: '直觉、深度、潜意识、灵性接纳、冷静的真相。' },
      yellow: { en: 'Intellect, clarity, consciousness, solar will, the light of the mind.', zh: '理智、清明、意识、太阳意志、心智之光。' },
      green: { en: 'Growth, healing, fertility, nature\'s abundance, the heart\'s unfolding.', zh: '成长、疗愈、丰产、自然的丰饶、心的展开。' },
      purple: { en: 'Royalty, spiritual authority, the union of red passion and blue wisdom.', zh: '尊贵、灵性权威、红色热情与蓝色智慧的结合。' },
      gold: { en: 'Divine radiance, achievement, the sun\'s blessing, spiritual treasure.', zh: '神圣光辉、成就、太阳的赐福、灵性宝藏。' },
      silver: { en: 'Lunar reflection, intuition, the feminine divine, dreams and memory.', zh: '月之映照、直觉、神圣阴性能量、梦境与记忆。' },
      grey: { en: 'Neutrality, the veil between worlds, the unknown, the liminal space.', zh: '中性、世界之间的帷幕、未知、阈限空间。' },
      orange: { en: 'Creative fire, vitality, ambition, the spark before the flame.', zh: '创造之火、活力、野心、火焰之前的火花。' },
      brown: { en: 'Earthiness, grounding, the body, the material foundation of all spiritual work.', zh: '土性、接地、身体、一切灵性工作的物质基础。' },
    },
    dominantInCards(cards) {
      // Map card keywords to likely dominant colors
      const colorHints = {
        fire: ['red','orange','gold'], water: ['blue','silver','purple'],
        air: ['yellow','white','grey'], earth: ['green','brown','gold'],
        major: {
          fool: ['white','yellow'], magician: ['red','yellow','white'],
          'high-priestess': ['blue','silver','white'], empress: ['green','gold','red'],
          emperor: ['red','purple','gold'], hierophant: ['red','blue','gold'],
          lovers: ['green','blue','gold'], chariot: ['silver','blue','gold'],
          strength: ['yellow','red','gold'], hermit: ['grey','blue','silver'],
          'wheel-of-fortune': ['blue','purple','gold'], justice: ['red','purple','gold'],
          'hanged-man': ['blue','grey','silver'], death: ['black','white','grey'],
          temperance: ['white','gold','red'], devil: ['black','red','orange'],
          tower: ['grey','black','orange'], star: ['blue','silver','white'],
          moon: ['silver','blue','grey'], sun: ['yellow','gold','orange'],
          judgment: ['blue','gold','white'], world: ['purple','green','gold'],
        },
      };
      return colorHints;
    },
  };

  // ═══════════════════════════════════════════
  // 18. PAIR RULES — dynamic card pair insights
  // Supplements the static TAROT_COMBINATIONS with rule-based pair detection
  // ═══════════════════════════════════════════
  const PAIR_RULES = {
    // Generate insights for any two cards based on rules
    analyze(a, b) {
      if (!a?.data || !b?.data) return null;
      const c1 = a.data, c2 = b.data;
      const results = [];

      // Rule: Major + Major = archetypal dialogue
      if (c1.arcana === 'major' && c2.arcana === 'major') {
        results.push({
          type: 'archetypal-dialogue',
          en: `${c1.nameEn} and ${c2.nameEn} — two archetypal forces in conversation. Their interaction transcends the personal and touches the mythic dimension of your question.`,
          zh: `${c1.name}与${c2.name}——两股原型之力在对话。它们的互动超越个人维度，触及你问题中的神话层面。`,
        });
      }

      // Rule: Same number across suits
      if (c1.number && c2.number && c1.number === c2.number && c1.suit !== c2.suit) {
        const pat = NUMBER_PATTERNS[c1.number];
        results.push({
          type: 'number-resonance',
          en: `Number ${c1.number} resonates: the ${pat?.title?.en || 'same energy'} expresses through ${c1.suit} (${c1.nameEn}) and ${c2.suit} (${c2.nameEn}) — two paths, one lesson.`,
          zh: `数字${c1.number}共鸣：${pat?.title?.zh || '同一能量'}通过${c1.suit}（${c1.name}）与${c2.suit}（${c2.name}）各自表达——两条道路，同一个课题。`,
        });
      }

      // Rule: Court + Minor of same suit
      const rankToSuit = { wands: 'wands', cups: 'cups', swords: 'swords', pentacles: 'pentacles' };
      if (c1.rank && c2.suit && rankToSuit[c1.suit] === c2.suit) {
        results.push({
          type: 'court-realm',
          en: `${c1.nameEn} (${c1.rank}) meets ${c2.nameEn} in the realm of ${c1.suit} — the court figure embodies the quality that this numbered card is learning to express.`,
          zh: `${c1.name}（${c1.rank}）在${c1.suit}的领域中遇到${c2.name}——宫廷人物体现了此数字牌正在学习表达的品质。`,
        });
      }

      // Rule: Sequential Majors = a chapter unfolding
      if (c1.arcana === 'major' && c2.arcana === 'major' && c1.number !== undefined && c2.number !== undefined) {
        const diff = Math.abs(c1.number - c2.number);
        if (diff === 1) {
          results.push({
            type: 'sequential-majors',
            en: `The Major Arcana appear in sequence — ${c1.nameEn} then ${c2.nameEn}. The Fool's journey unfolds in order; one initiation leads naturally to the next.`,
            zh: `大阿尔卡纳依次出现——${c1.name}然后${c2.name}。愚人之旅有序展开；一个入门自然而然地导向下一个。`,
          });
        }
      }

      // Rule: Elemental opposition = creative tension
      const c1El = c1.element || ({wands:'fire',cups:'water',swords:'air',pentacles:'earth'}[c1.suit]);
      const c2El = c2.element || ({wands:'fire',cups:'water',swords:'air',pentacles:'earth'}[c2.suit]);
      if (c1El && c2El) {
        const conflictPairs = [['fire','water'], ['air','earth']];
        for (const [x, y] of conflictPairs) {
          if ((c1El === x && c2El === y) || (c1El === y && c2El === x)) {
            results.push({
              type: 'elemental-opposition',
              en: `${c1.nameEn} (${c1El}) and ${c2.nameEn} (${c2El}) engage in elemental opposition — ${c1El} and ${c2El} are cosmic complements disguised as opponents. Their friction generates the creative heat from which new understanding is forged.`,
              zh: `${c1.name}（${c1El}）与${c2.name}（${c2El}）进行着元素对立——${c1El}与${c2El}是伪装成对手的宇宙互补。它们的摩擦产生创造性的热量，从中锻造出新的理解。`,
            });
          }
        }
      }

      return results.length > 0 ? results : null;
    },
  };

  // ═══════════════════════════════════════════
  // Expand METHODOLOGY.questionRules to 9 principles
  // ═══════════════════════════════════════════
  METHODOLOGY.questionRules.push(
    { en: 'One question per reading. Multiple questions blur the answer.', zh: '一次只问一个问题。多个问题会模糊答案。' },
    { en: 'Avoid yes/no questions — the cards tell stories, not verdicts. Reframe as "What do I need to understand about..."', zh: '避免是否类问题——牌讲述的是故事，不是判决。重新框定为"关于……我需要理解什么"。' },
    { en: 'Questions about other people\'s feelings are unreliable — ask instead about your own role in the dynamic.', zh: '关于他人感受的问题不可靠——转而询问你在此动力中扮演的角色。' },
    { en: 'The best questions begin with "How can I..." or "What is the lesson in..." — they open doors rather than seeking fixed answers.', zh: '最好的问题以"我如何能……"或"……中的课题是什么"开头——它们打开门而非寻找固定的答案。' },
    { en: 'If you feel fear while asking, pause — fear narrows the question. Reframe from a place of curiosity, not dread.', zh: '如果提问时感到恐惧，暂停——恐惧会收窄问题。从好奇而非惧怕出发重新框定。' },
  );

// ═══════════════════════════════════════════
// Runtime merge: new summaryV2 templates (196 entries)
// Merges into TEMPLATE_LIBRARY.summaryV2 on script load
// ═══════════════════════════════════════════
(function() {
  var src = {"love":{"anxious":{"single":[{"zh":"说真的，{entityEcho}你这段时间心里一直揪着吧。{conflictNote}{mainCardInsight}不是让你放弃，是让你换个方式去爱。{adviceHint}","en":"Honestly, {entityEcho} your heart has been clenched tight for a while now. {conflictNote}{mainCardInsight} It's not asking you to give up — it's asking you to love differently. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"别怕。{timeContext}这点不安是正常的。关键是，{mainCardInsight}{conflictNote}{adviceHint}","en":"Don't be afraid. {timeContext} This unease is completely normal. The key thing is, {mainCardInsight}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"你看啊，{cardPersonality}{entityEcho}——不是你想的那样糟糕。{conflictNote}{mainCardInsight}深呼吸一下，{adviceHint}","en":"Look, {cardPersonality}{entityEcho} — it's not as bad as you think. {conflictNote}{mainCardInsight} Take a deep breath. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{conflictNote}这不是失控，是变化。{entityEcho}你要相信，{adviceHint}","en":"{questionTypeFrame} Plainly speaking, {mainCardInsight}{conflictNote} This isn't losing control — it's change. {entityEcho} You need to trust that {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}你看这几张牌连在一起，其实是一句话：{cardJourney}{conflictNote}别急，给自己一点时间。{adviceHint}","en":"{entityEcho} Look at these cards connected together — they're really saying one thing: {cardJourney}{conflictNote} Don't rush. Give yourself some time. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"别怕。{timeContext}{cardJourney}{mainCardInsight}{conflictNote}你看，到头来牌在跟你说的是——别自己吓自己。{adviceHint}","en":"Don't be afraid. {timeContext}{cardJourney}{mainCardInsight}{conflictNote} You see, what the cards are really telling you is — don't scare yourself. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}出来了，跟其他牌组合在一起想告诉你：{cardJourney}{conflictNote}{entityEcho}说到底，{adviceHint}","en":"{cardPersonality} came out, and combined with the other cards it wants to tell you: {cardJourney}{conflictNote}{entityEcho} At the end of the day, {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}但你仔细看整个局面，{cardJourney}{conflictNote}{entityEcho}{adviceHint}","en":"{questionTypeFrame}{mainCardInsight} But look closely at the whole picture — {cardJourney}{conflictNote}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"说白了，{entityEcho}牌面给你画了一张地图：{cardJourney}{domainFrame}{conflictNote}这条路虽然不平，但能走。{adviceHint}","en":"Plainly speaking, {entityEcho} the cards have drawn you a map: {cardJourney}{domainFrame}{conflictNote} The road is bumpy, but it's walkable. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}}]},"hopeful":{"single":[{"zh":"你的直觉是对的。{entityEcho}{mainCardInsight}这条路走得通。{conflictNote}{adviceHint}","en":"Your intuition is right. {entityEcho}{mainCardInsight} This path can work. {conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它想告诉你的是：{mainCardInsight}{entityEcho}这种好感觉不是假的，{adviceHint}","en":"{timeContext}{cardPersonality} What it wants to tell you is: {mainCardInsight}{entityEcho} This good feeling isn't fake. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"你看啊，{questionTypeFrame}{mainCardInsight}{conflictNote}说真的，{entityEcho}你已经在路上了。{adviceHint}","en":"Look, {questionTypeFrame}{mainCardInsight}{conflictNote} Honestly, {entityEcho} you're already on the way. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"其实，{mainCardInsight}{entityEcho}——{conflictNote}{domainFrame}{adviceHint}","en":"Actually, {mainCardInsight}{entityEcho} — {conflictNote}{domainFrame}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}],"multi":[{"zh":"{entityEcho}这几张牌排在一起的样子很好看——{cardJourney}它们在说，{mainCardInsight}{conflictNote}这一步走对了。{adviceHint}","en":"{entityEcho} The way these cards line up is beautiful — {cardJourney} They're saying, {mainCardInsight}{conflictNote} This step is the right one. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}你看，整个牌面都在呼应你心里的期待。{mainCardInsight}{entityEcho}{adviceHint}","en":"{timeContext}{cardJourney} Look, the whole spread is echoing what your heart hopes for. {mainCardInsight}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}带着一群牌来告诉你一个好消息：{cardJourney}{conflictNote}{entityEcho}相信这个过程。{adviceHint}","en":"{cardPersonality} brought a group of cards to tell you good news: {cardJourney}{conflictNote}{entityEcho} Trust the process. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{cardJourney}{conflictNote}{entityEcho}这个方向是对的，{adviceHint}","en":"{questionTypeFrame} To be blunt, {mainCardInsight}{cardJourney}{conflictNote}{entityEcho} This direction is right. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"{domainFrame}你听我说——{cardJourney}{mainCardInsight}{entityEcho}{conflictNote}你已经比大多数人勇敢了。{adviceHint}","en":"{domainFrame} Listen to me — {cardJourney}{mainCardInsight}{entityEcho}{conflictNote} You're already braver than most people. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}}]},"confused":{"single":[{"zh":"看不清的时候，先走一步。{entityEcho}{conflictNote}{mainCardInsight}不用什么都想明白再动。{adviceHint}","en":"When you can't see clearly, just take one step. {entityEcho}{conflictNote}{mainCardInsight} You don't need to figure everything out before you move. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}这种模糊的感觉其实很正常。{cardPersonality}它在跟你说——{mainCardInsight}{conflictNote}别急，雾会散的。{adviceHint}","en":"{timeContext} This foggy feeling is actually very normal. {cardPersonality} It's telling you — {mainCardInsight}{conflictNote} Don't worry, the fog will lift. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"其实，{entityEcho}你不是不知道，你只是不确定。{mainCardInsight}{conflictNote}牌在帮你确认你本来就知道的事。{adviceHint}","en":"Actually, {entityEcho} it's not that you don't know — you're just not sure. {mainCardInsight}{conflictNote} The cards are helping you confirm what you already knew. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{questionTypeFrame}你看，{mainCardInsight}{domainFrame}{conflictNote}{entityEcho}答案没你想的那么远。{adviceHint}","en":"{questionTypeFrame} Look, {mainCardInsight}{domainFrame}{conflictNote}{entityEcho} The answer isn't as far away as you think. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}牌面像一面镜子，把碎片拼给你看：{cardJourney}{conflictNote}说真的，{mainCardInsight}{adviceHint}","en":"{entityEcho} The spread is like a mirror, piecing the fragments together for you: {cardJourney}{conflictNote} Honestly, {mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}你不是看不清，你是看了太多可能性。{mainCardInsight}{conflictNote}{entityEcho}先盯住一个方向。{adviceHint}","en":"{timeContext}{cardJourney} It's not that you can't see — you're seeing too many possibilities. {mainCardInsight}{conflictNote}{entityEcho} Focus on one direction first. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}的位置很关键，它跟周围的牌在说：{cardJourney}{conflictNote}{entityEcho}表面上乱，实际上有脉络。{adviceHint}","en":"{cardPersonality}'s position is key — together with the surrounding cards it says: {cardJourney}{conflictNote}{entityEcho} On the surface it's messy, but underneath there's a thread. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{domainFrame}{cardJourney}{conflictNote}{entityEcho}别急，给自己一点时间。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{domainFrame}{cardJourney}{conflictNote}{entityEcho} Take your time. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"说白了，{entityEcho}这几张牌给你画了一条路出来：{cardJourney}{mainCardInsight}{conflictNote}不用全看懂，先跟着走一步。{adviceHint}","en":"Plainly, {entityEcho} these cards have drawn a path for you: {cardJourney}{mainCardInsight}{conflictNote} You don't need to understand it all — just follow it one step. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}}]},"painful":{"single":[{"zh":"很难受吧。{entityEcho}{mainCardInsight}允许自己难过。{conflictNote}{adviceHint}","en":"It hurts, doesn't it. {entityEcho}{mainCardInsight} Give yourself permission to grieve. {conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}这个阶段是难熬的，我知道。{cardPersonality}它在陪着你——{mainCardInsight}{conflictNote}{adviceHint}","en":"{timeContext} This phase is hard to get through, I know. {cardPersonality} It's staying with you — {mainCardInsight}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"说真的，{entityEcho}痛就是痛，不用假装没事。{mainCardInsight}{conflictNote}但这个痛不是终点。{adviceHint}","en":"Honestly, {entityEcho} pain is pain — you don't have to pretend you're fine. {mainCardInsight}{conflictNote} But this pain is not the destination. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}不是你的错。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} It's not your fault. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}牌面没有骗你，这条路是疼的。{cardJourney}{conflictNote}但你看最后一站——{mainCardInsight}它在等你。{adviceHint}","en":"{entityEcho} The cards aren't lying to you — this path hurts. {cardJourney}{conflictNote} But look at the final stop — {mainCardInsight} It's waiting for you. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}我不跟你说\"没事的\"，因为有事。{cardJourney}{mainCardInsight}{conflictNote}但会变好的，不是鸡汤，是牌说的。{adviceHint}","en":"{timeContext} I won't tell you 'it's fine,' because it's not. {cardJourney}{mainCardInsight}{conflictNote} But it will get better — not a platitude, the cards are saying it. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{domainFrame}你看，{cardJourney}{entityEcho}{conflictNote}难受本身是痊愈的一部分。{mainCardInsight}{adviceHint}","en":"{domainFrame} Look, {cardJourney}{entityEcho}{conflictNote} The pain itself is part of the healing. {mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在这个位置出现，它懂你的疼。{cardJourney}{conflictNote}{entityEcho}慢慢来，{adviceHint}","en":"{cardPersonality} appearing in this position — it understands your pain. {cardJourney}{conflictNote}{entityEcho} Take it slowly. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"你听我说——{entityEcho}{mainCardInsight}{cardJourney}{conflictNote}你会从这件事里走出来的，而且比之前更完整。{adviceHint}","en":"Listen to me — {entityEcho}{mainCardInsight}{cardJourney}{conflictNote} You will walk out of this, and more whole than before. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}}]},"determined":{"single":[{"zh":"你已经决定了，牌只是在确认。{entityEcho}{mainCardInsight}{conflictNote}尊重你自己的选择。{adviceHint}","en":"You've already decided — the cards are just confirming. {entityEcho}{mainCardInsight}{conflictNote} Honor your own choice. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在支持你的选择——{mainCardInsight}{entityEcho}{conflictNote}你比你以为的要坚定。{adviceHint}","en":"{timeContext}{cardPersonality} It supports your choice — {mainCardInsight}{entityEcho}{conflictNote} You're more resolute than you think. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{entityEcho}——{conflictNote}你已经有答案了，牌帮你再推一把。{adviceHint}","en":"{questionTypeFrame} To be blunt, {mainCardInsight}{entityEcho} — {conflictNote} You already have the answer. The cards are just giving you a push. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}整个牌阵都在呼应你的决定——{cardJourney}{mainCardInsight}{conflictNote}走下去，别回头。{adviceHint}","en":"{entityEcho} The entire spread echoes your decision — {cardJourney}{mainCardInsight}{conflictNote} Walk forward, don't look back. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote}这份笃定是你自己给的，牌只是回响了它。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote} This certainty comes from you — the cards are just echoing it. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}跟周围的牌配合得很好——{cardJourney}{conflictNote}{entityEcho}你的方向是对的，节奏由你掌控。{adviceHint}","en":"{cardPersonality} pairs well with the surrounding cards — {cardJourney}{conflictNote}{entityEcho} Your direction is right, and you control the pace. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote}你不需要更多信息了，你需要的是行动。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote} You don't need more information — you need action. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["prediction"],"preferredTime":["immediate"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}]},"neutral":{"single":[{"zh":"咱们一件事一件事看清楚。{entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","en":"Let's look at things one at a time. {entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它给出的信息很清晰：{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} The information it gives is very clear: {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}你看，{mainCardInsight}{entityEcho}——{conflictNote}情况没有太复杂，{adviceHint}","en":"{questionTypeFrame} Look, {mainCardInsight}{entityEcho} — {conflictNote} The situation isn't too complicated. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}整副牌阵给你拆开了看——{cardJourney}{mainCardInsight}{conflictNote}客观来说，局面是可控的。{adviceHint}","en":"{entityEcho} Let's break down the whole spread — {cardJourney}{mainCardInsight}{conflictNote} Objectively speaking, the situation is manageable. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}逻辑很清楚，不用想得太复杂。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} The logic is clear — don't overcomplicate it. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}和整体牌面的关系是这样的：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality}'s relationship with the overall spread is like this: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote}信息量够了，你可以基于这个做判断。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote} There's enough information — you can make judgments based on this. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}]}},"career":{"anxious":{"single":[{"zh":"工作的事本来就让人操心。{entityEcho}{mainCardInsight}{conflictNote}别怕，牌告诉你的是——你不是走投无路。{adviceHint}","en":"Work stuff is naturally stressful. {entityEcho}{mainCardInsight}{conflictNote} Don't worry — what the cards are telling you is: you're not at a dead end. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"别怕。{timeContext}这种职场焦虑很正常。关键是，{mainCardInsight}{conflictNote}{adviceHint}","en":"Don't be afraid. {timeContext} This kind of workplace anxiety is normal. The key is, {mainCardInsight}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}它看到了你的处境——{entityEcho}{mainCardInsight}{conflictNote}不是你的能力问题，是时机。{adviceHint}","en":"{cardPersonality} sees your situation — {entityEcho}{mainCardInsight}{conflictNote} It's not about your ability, it's about timing. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{entityEcho}——{conflictNote}这不是绝路，是转弯。{adviceHint}","en":"{questionTypeFrame} To be blunt, {mainCardInsight}{entityEcho} — {conflictNote} This isn't a dead end, it's a turn. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}你抽的这几张职业牌不是在吓你——{cardJourney}{conflictNote}{mainCardInsight}别自己给自己加戏。{adviceHint}","en":"{entityEcho} The career cards you drew aren't trying to scare you — {cardJourney}{conflictNote}{mainCardInsight} Don't add drama in your own head. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}整个牌阵看下来，{mainCardInsight}{conflictNote}{entityEcho}工作有波折是正常的，没有过不去的坎。{adviceHint}","en":"{timeContext}{cardJourney} Looking at the whole spread, {mainCardInsight}{conflictNote}{entityEcho} Bumps at work are normal — there's no hurdle you can't overcome. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}这张牌在工作问题上很实在，它跟其他牌的互动在说：{cardJourney}{conflictNote}{entityEcho}{adviceHint}","en":"{cardPersonality} This card is very straightforward about work matters — its interaction with the other cards says: {cardJourney}{conflictNote}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{domainFrame}{cardJourney}{conflictNote}{entityEcho}稳住，事情没你想的那么糟。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{domainFrame}{cardJourney}{conflictNote}{entityEcho} Steady — things aren't as bad as you think. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"{entityEcho}说白了，{cardJourney}{mainCardInsight}{conflictNote}你缺的不是能力，是确认。牌给你这个确认了。{adviceHint}","en":"{entityEcho} To be honest, {cardJourney}{mainCardInsight}{conflictNote} What you lack isn't ability — it's confirmation. The cards are giving you that now. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}}]},"hopeful":{"single":[{"zh":"你的职业嗅觉是对的。{entityEcho}{mainCardInsight}{conflictNote}这个方向有东西。{adviceHint}","en":"Your professional instincts are right. {entityEcho}{mainCardInsight}{conflictNote} There's something in this direction. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它给你指了一个很明确的方向：{mainCardInsight}{entityEcho}{adviceHint}","en":"{timeContext}{cardPersonality} It's pointing you in a very clear direction: {mainCardInsight}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}你看，{mainCardInsight}{entityEcho}——{conflictNote}机会已经在路上了。{adviceHint}","en":"{questionTypeFrame} Look, {mainCardInsight}{entityEcho} — {conflictNote} The opportunity is already on its way. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"其实，{mainCardInsight}{entityEcho}{domainFrame}{conflictNote}你之前的积累没有白费。{adviceHint}","en":"Actually, {mainCardInsight}{entityEcho}{domainFrame}{conflictNote} None of your previous efforts have been wasted. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}],"multi":[{"zh":"{entityEcho}整个职业牌阵给你画了一条上升曲线——{cardJourney}{mainCardInsight}{conflictNote}这个方向值得投入。{adviceHint}","en":"{entityEcho} The whole career spread draws an upward curve for you — {cardJourney}{mainCardInsight}{conflictNote} This direction is worth investing in. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}你看这几张牌的气很顺，{mainCardInsight}{entityEcho}{conflictNote}你之前做的功课要兑现了。{adviceHint}","en":"{timeContext}{cardJourney} The energy across these cards flows smoothly — {mainCardInsight}{entityEcho}{conflictNote} The work you put in before is about to pay off. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}在这个职业牌阵里很有话语权——{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} has a strong voice in this career spread — {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{domainFrame}{cardJourney}{entityEcho}{conflictNote}你已经准备得比大多数人充分了。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{domainFrame}{cardJourney}{entityEcho}{conflictNote} You're already better prepared than most people. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"说白了，{entityEcho}{cardJourney}{mainCardInsight}{conflictNote}事业这件事上，你的直觉比你想象的准。{adviceHint}","en":"Frankly, {entityEcho}{cardJourney}{mainCardInsight}{conflictNote} When it comes to career, your instincts are sharper than you realize. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}}]},"confused":{"single":[{"zh":"职业路看不清的时候，先做好手头的事。{entityEcho}{mainCardInsight}{conflictNote}不是每条路都要一眼望到底。{adviceHint}","en":"When you can't see your career path clearly, focus on what's in front of you. {entityEcho}{mainCardInsight}{conflictNote} Not every road needs to be seen to its end. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在跟你说——{mainCardInsight}{entityEcho}{conflictNote}先不用急着做决定。{adviceHint}","en":"{timeContext}{cardPersonality} It's telling you — {mainCardInsight}{entityEcho}{conflictNote} You don't need to rush a decision right now. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}其实，{mainCardInsight}{entityEcho}——{conflictNote}迷茫本身也是一种信号：你该停下来看看方向了。{adviceHint}","en":"{questionTypeFrame} Actually, {mainCardInsight}{entityEcho} — {conflictNote} Confusion itself is a signal: it's time to pause and check your direction. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"说真的，{entityEcho}{domainFrame}{mainCardInsight}{conflictNote}你不是没方向，是你要求自己必须想得很清楚才能动。{adviceHint}","en":"Honestly, {entityEcho}{domainFrame}{mainCardInsight}{conflictNote} It's not that you have no direction — it's that you demand perfect clarity before you move. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}}],"multi":[{"zh":"{entityEcho}牌面给你的职业图景是模糊的，但关键节点是清楚的——{cardJourney}{mainCardInsight}{conflictNote}抓住那几个节点就够了。{adviceHint}","en":"{entityEcho} The career picture the cards give you is fuzzy, but the key nodes are clear — {cardJourney}{mainCardInsight}{conflictNote} Grabbing those few nodes is enough. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}与其想太多，不如先走一步看看。{adviceHint}","en":"{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Rather than overthinking, take one step and see. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}在职业问题上很诚实——{cardJourney}{conflictNote}{entityEcho}它没骗你，现在就是看不清。但这不代表没路。{adviceHint}","en":"{cardPersonality} is very honest about career questions — {cardJourney}{conflictNote}{entityEcho} It's not lying to you: things are unclear right now. But that doesn't mean there's no path. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote}迷雾会散，但你不要坐着等它散。{adviceHint}","en":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote} The fog will lift, but don't just sit and wait for it to. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}]},"painful":{"single":[{"zh":"工作上的挫折真的很消耗人。{entityEcho}{mainCardInsight}{conflictNote}但你不是被工作定义的。{adviceHint}","en":"Career setbacks are truly draining. {entityEcho}{mainCardInsight}{conflictNote} But you are not defined by your job. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}这个坎的确难受。{cardPersonality}它看到了——{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext} This hurdle genuinely hurts. {cardPersonality} sees it — {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}这种失败不是你一个人的。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} This kind of failure isn't yours alone. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}牌面很诚实——工作上的这个局面是疼的。{cardJourney}{conflictNote}但你看走势，{mainCardInsight}{adviceHint}","en":"{entityEcho} The spread is honest — this career situation hurts. {cardJourney}{conflictNote} But look at the trend — {mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}你不会一直待在这个位置的。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} You won't stay in this position forever. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在这个位置出现不是巧合——{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}牌知道你这段时间不好过。{adviceHint}","en":"{cardPersonality} didn't appear in this position by accident — {cardJourney}{conflictNote}{entityEcho}{mainCardInsight} The cards know you've been having a rough time. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"determined":{"single":[{"zh":"你在事业上已经有主意了。{entityEcho}{mainCardInsight}{conflictNote}牌只是在帮你确认：你的判断没问题。{adviceHint}","en":"You already have a plan for your career. {entityEcho}{mainCardInsight}{conflictNote} The cards are just confirming: your judgment is sound. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在支持你的职业判断——{mainCardInsight}{entityEcho}{adviceHint}","en":"{timeContext}{cardPersonality} It's backing your career judgment — {mainCardInsight}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{entityEcho}——{conflictNote}别犹豫了，你已经想好了。{adviceHint}","en":"{questionTypeFrame} To be blunt, {mainCardInsight}{entityEcho} — {conflictNote} Stop hesitating — you've already figured it out. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["prediction"],"preferredTime":["immediate"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}整个牌阵都在为你的决定背书——{cardJourney}{mainCardInsight}{conflictNote}这个跳槽/转型/坚持，值得。{adviceHint}","en":"{entityEcho} The whole spread is endorsing your decision — {cardJourney}{mainCardInsight}{conflictNote} This move/transition/persistence is worth it. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote}你已经有足够的筹码去做了。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote} You already have enough chips to make your move. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}跟工作牌阵的配合很果断——{cardJourney}{conflictNote}{entityEcho}当机立断比反复权衡有用。{adviceHint}","en":"{cardPersonality} paired with this career spread is decisive — {cardJourney}{conflictNote}{entityEcho} Decisive action beats endless deliberation. {adviceHint}","matchTags":{"preferredSentiment":["determined"],"preferredQType":["exploration"],"preferredTime":["immediate"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"neutral":{"single":[{"zh":"职业上的事，咱们客观看看。{entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","en":"Career matters — let's look at them objectively. {entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在工作问题上给出的信息很务实：{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} The information it gives on work matters is very practical: {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}数据都是客观的，决策是你自己的。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} The data is objective — the decision is yours. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}牌阵给你的职业信息拆开来看——{cardJourney}{mainCardInsight}{conflictNote}稳步走比冲刺好。{adviceHint}","en":"{entityEcho} Let's unpack the career information the spread gives you — {cardJourney}{mainCardInsight}{conflictNote} Steady progress beats sprinting. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}按自己的节奏来，不用跟别人比。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Go at your own pace — no need to compare with others. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在整体牌阵里给出了一个很理性的提示：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} gives a very rational hint within the overall spread: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]}},"wealth":{"anxious":{"single":[{"zh":"钱的事最让人睡不着。{entityEcho}{mainCardInsight}{conflictNote}别怕，牌告诉你——局面是可控的。{adviceHint}","en":"Money matters are what keep us up at night. {entityEcho}{mainCardInsight}{conflictNote} Don't worry — the cards tell you: the situation is manageable. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"别怕。{timeContext}财务上的焦虑人人都有。{mainCardInsight}{conflictNote}{entityEcho}{adviceHint}","en":"Don't be afraid. {timeContext} Everyone has financial anxiety. {mainCardInsight}{conflictNote}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}它在财务问题上很直接——{mainCardInsight}{entityEcho}{conflictNote}不是没钱，是节奏没调好。{adviceHint}","en":"{cardPersonality} is very direct about financial matters — {mainCardInsight}{entityEcho}{conflictNote} It's not that there's no money — the rhythm just needs adjusting. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{entityEcho}——{conflictNote}开源比节流重要，牌是这么说的。{adviceHint}","en":"{questionTypeFrame} To be blunt, {mainCardInsight}{entityEcho} — {conflictNote} Growing income matters more than cutting costs — that's what the cards say. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}财务牌阵不是来吓你的——{cardJourney}{conflictNote}{mainCardInsight}有些支出是暂时的，有些流入在路上了。{adviceHint}","en":"{entityEcho} The finance spread isn't here to scare you — {cardJourney}{conflictNote}{mainCardInsight} Some expenses are temporary, and some income is on the way. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}钱的流动是有周期的，现在不是低谷的底。{adviceHint}","en":"{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Money flows in cycles — you're not at the bottom. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{domainFrame}{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}别被数字吓到，牌局比数字更能说明趋势。{adviceHint}","en":"{domainFrame}{cardJourney}{conflictNote}{entityEcho}{mainCardInsight} Don't let the numbers scare you — the spread says more about the trend than the numbers do. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在财富问题上给出了清晰的路线：{cardJourney}{conflictNote}{entityEcho}先稳住再图进。{adviceHint}","en":"{cardPersonality} gives a clear route on wealth matters: {cardJourney}{conflictNote}{entityEcho} Stabilize first, then advance. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"hopeful":{"single":[{"zh":"财务上你的感觉是准的。{entityEcho}{mainCardInsight}{conflictNote}有好事在酝酿。{adviceHint}","en":"Your financial intuition is on point. {entityEcho}{mainCardInsight}{conflictNote} Something good is brewing. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在财务上给了你一个绿灯：{mainCardInsight}{entityEcho}{adviceHint}","en":"{timeContext}{cardPersonality} It's giving you a green light on finances: {mainCardInsight}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}你的理财思路没毛病。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} Your financial approach isn't wrong. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"其实，{mainCardInsight}{entityEcho}{domainFrame}{conflictNote}你会看到数字往上走的。{adviceHint}","en":"Actually, {mainCardInsight}{entityEcho}{domainFrame}{conflictNote} You'll see the numbers go up. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}],"multi":[{"zh":"{entityEcho}财富牌阵的箭头是向上的——{cardJourney}{mainCardInsight}{conflictNote}你之前的投入要有回报了。{adviceHint}","en":"{entityEcho} The wealth spread's arrow points up — {cardJourney}{mainCardInsight}{conflictNote} Your previous investments are about to pay off. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote}钱方面，好运气已经在门口了。{adviceHint}","en":"{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote} In terms of money, good luck is already at the door. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["immediate"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}在财富牌阵里是个好兆头——{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} is a good omen in the wealth spread — {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote}该来的都会来。{adviceHint}","en":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote} What's meant to come will come. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}]},"confused":{"single":[{"zh":"财务上账目乱的时候，先理清楚一条线。{entityEcho}{mainCardInsight}{conflictNote}不用一次全搞明白。{adviceHint}","en":"When your finances are a mess, start by untangling one thread. {entityEcho}{mainCardInsight}{conflictNote} You don't need to figure it all out at once. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在帮你看清一件事：{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} It's helping you see one thing clearly: {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}你看，{mainCardInsight}{entityEcho}——{conflictNote}看不清数字的时候，看趋势。{adviceHint}","en":"{questionTypeFrame} Look, {mainCardInsight}{entityEcho} — {conflictNote} When you can't see the numbers, look at the trend. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}财富牌阵虽然有点乱，但主线不差——{cardJourney}{mainCardInsight}{conflictNote}重点是找到你的安全阀。{adviceHint}","en":"{entityEcho} The wealth spread is a bit messy, but the main thread isn't bad — {cardJourney}{mainCardInsight}{conflictNote} The key is finding your safety valve. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}你现在缺的不是钱，是一个清晰的计划。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} What you lack right now isn't money — it's a clear plan. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在这个牌阵里的角色是指路人：{cardJourney}{conflictNote}{entityEcho}只要方向定了，数字慢慢调。{adviceHint}","en":"{cardPersonality}'s role in this spread is as a guide: {cardJourney}{conflictNote}{entityEcho} As long as the direction is set, the numbers can be adjusted gradually. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"painful":{"single":[{"zh":"财务压力真的很磨人。{entityEcho}{mainCardInsight}{conflictNote}但你正在想办法，这本身就值得肯定。{adviceHint}","en":"Financial pressure is truly grinding. {entityEcho}{mainCardInsight}{conflictNote} But you're looking for solutions — that alone deserves recognition. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它知道你现在不容易——{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} It knows things are tough for you right now — {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}穷则变，变则通。这句话不是鸡汤。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} When you hit a wall, you change — and when you change, you break through. This isn't just a platitude. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}牌面没有粉饰——财务状况现在是紧的。{cardJourney}{conflictNote}但你看后面的牌，{mainCardInsight}{adviceHint}","en":"{entityEcho} The spread doesn't sugarcoat — finances are tight right now. {cardJourney}{conflictNote} But look at the later cards — {mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}这段紧日子不会永远持续。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} These tight times won't last forever. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在这个位置，它在跟你说：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}挺过去，你就是你自己的靠山。{adviceHint}","en":"{cardPersonality} in this position is telling you: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight} Get through this, and you'll be your own rock. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"neutral":{"single":[{"zh":"财富这件事，咱们摆开来看。{entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","en":"Wealth matters — let's lay them out and look at them. {entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在财务上给出的判断很稳：{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} Its financial judgment is very steady: {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}数据不会撒谎，你心里也有数。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} The data doesn't lie, and you know it in your gut too. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}财富牌阵给你拆得很细——{cardJourney}{mainCardInsight}{conflictNote}收入、支出、储蓄，每一块都有话说。{adviceHint}","en":"{entityEcho} The wealth spread breaks things down in detail — {cardJourney}{mainCardInsight}{conflictNote} Income, spending, savings — each piece has something to say. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}稳健比激进更适合现在的你。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Steadiness suits you better than aggression right now. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在整个牌阵里给出了一个很务实的提示：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} gives a very pragmatic hint within the whole spread: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]}},"study":{"anxious":{"single":[{"zh":"考试、学业——压力大是正常的。{entityEcho}{mainCardInsight}{conflictNote}你不是不会，你是太紧张了。{adviceHint}","en":"Exams, academics — stress is normal. {entityEcho}{mainCardInsight}{conflictNote} It's not that you can't — you're just too tense. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"别怕。{timeContext}学业上的焦虑谁都有过。{mainCardInsight}{conflictNote}{entityEcho}{adviceHint}","en":"Don't be afraid. {timeContext} Everyone has had academic anxiety. {mainCardInsight}{conflictNote}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}它在学业问题上很温柔——{mainCardInsight}{entityEcho}{conflictNote}你的基础不差，差的是信心。{adviceHint}","en":"{cardPersonality} is gentle about academic matters — {mainCardInsight}{entityEcho}{conflictNote} Your foundation isn't weak — what you lack is confidence. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{entityEcho}——{conflictNote}方法比焦虑有用一万倍。{adviceHint}","en":"{questionTypeFrame} To be blunt, {mainCardInsight}{entityEcho} — {conflictNote} Method is ten thousand times more useful than anxiety. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}学业牌阵不是来打击你的——{cardJourney}{conflictNote}{mainCardInsight}你缺的不是天赋，是把节奏调回来。{adviceHint}","en":"{entityEcho} The study spread isn't here to knock you down — {cardJourney}{conflictNote}{mainCardInsight} What you lack isn't talent — it's getting your rhythm back. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}学习是个长跑，别被眼前的坎绊住心态。{adviceHint}","en":"{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Learning is a marathon — don't let the current hurdle trip up your mindset. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{domainFrame}{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}你之前的努力不是白费的，牌看到了。{adviceHint}","en":"{domainFrame}{cardJourney}{conflictNote}{entityEcho}{mainCardInsight} Your previous efforts weren't wasted — the cards can see it. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在学业牌阵里给出了明确的信号：{cardJourney}{conflictNote}{entityEcho}别跟别人比，跟你自己比。{adviceHint}","en":"{cardPersonality} gives a clear signal in the study spread: {cardJourney}{conflictNote}{entityEcho} Don't compare with others — compare with yourself. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"hopeful":{"single":[{"zh":"你的学习方向是对的。{entityEcho}{mainCardInsight}{conflictNote}坚持住，效果会慢慢出来的。{adviceHint}","en":"Your study direction is right. {entityEcho}{mainCardInsight}{conflictNote} Keep at it — results will show gradually. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在学业上给了你一个肯定的答复：{mainCardInsight}{entityEcho}{adviceHint}","en":"{timeContext}{cardPersonality} It gives you an affirmative answer on academics: {mainCardInsight}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}你会考过的，牌比你的焦虑诚实。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} You'll pass — the cards are more honest than your anxiety. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"其实，{mainCardInsight}{entityEcho}{domainFrame}{conflictNote}你已经比上次进步了很多。{adviceHint}","en":"Actually, {mainCardInsight}{entityEcho}{domainFrame}{conflictNote} You've already improved a lot compared to last time. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}],"multi":[{"zh":"{entityEcho}学业牌阵的气很正——{cardJourney}{mainCardInsight}{conflictNote}你之前的积累快要爆发了。{adviceHint}","en":"{entityEcho} The energy of the study spread is very aligned — {cardJourney}{mainCardInsight}{conflictNote} Your accumulation is about to burst through. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote}学习这件事，量变到质变就差最后一下了。{adviceHint}","en":"{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote} In studying, you're just one final push away from the qualitative leap. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["immediate"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}在学业上是个很积极的信号——{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} is a very positive signal for studies — {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote}天道酬勤，牌是相信这一套的。{adviceHint}","en":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote} Hard work pays off — the cards believe in this. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}]},"confused":{"single":[{"zh":"学不进去的时候，不是你不行，是方法该换了。{entityEcho}{mainCardInsight}{conflictNote}{adviceHint}","en":"When you can't absorb anything, it's not that you can't — it's time to switch methods. {entityEcho}{mainCardInsight}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在提醒你：{mainCardInsight}{entityEcho}{conflictNote}别跟教材硬刚，换个角度。{adviceHint}","en":"{timeContext}{cardPersonality} It's reminding you: {mainCardInsight}{entityEcho}{conflictNote} Don't fight the textbook head-on — try a different angle. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}你看，{mainCardInsight}{entityEcho}——{conflictNote}暂时卡住是大脑在处理信息。{adviceHint}","en":"{questionTypeFrame} Look, {mainCardInsight}{entityEcho} — {conflictNote} Getting stuck temporarily just means your brain is processing. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}学业牌阵看着乱，实际上是告诉你该休息了——{cardJourney}{mainCardInsight}{conflictNote}不休息学不进去的。{adviceHint}","en":"{entityEcho} The study spread looks messy, but it's actually telling you to rest — {cardJourney}{mainCardInsight}{conflictNote} You can't learn without resting. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}先把最薄的那本书啃完，建立信心。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Start by finishing the thinnest book first — build your confidence. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在学业问题上很懂你：{cardJourney}{conflictNote}{entityEcho}你不是笨，你是被信息淹没了。{adviceHint}","en":"{cardPersonality} really gets you on this study issue: {cardJourney}{conflictNote}{entityEcho} You're not slow — you're drowning in information. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"painful":{"single":[{"zh":"学习受挫的滋味不好受。{entityEcho}{mainCardInsight}{conflictNote}但一次考不好不代表你不行。{adviceHint}","en":"The taste of academic failure is bitter. {entityEcho}{mainCardInsight}{conflictNote} But one bad exam doesn't mean you're incapable. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它看到了你的挫败——{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} It sees your frustration — {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}你不是失败的，你只是在路上摔了一跤。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} You're not a failure — you just tripped on the road. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}牌面看到了你的努力，也看到了你的委屈——{cardJourney}{conflictNote}{mainCardInsight}这条路不是直的，但你能走完。{adviceHint}","en":"{entityEcho} The spread sees your effort and your frustration — {cardJourney}{conflictNote}{mainCardInsight} This road isn't straight, but you can finish it. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}成绩不是衡量你价值的尺子。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Grades aren't the ruler that measures your worth. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在这个位置出现，它在心疼你：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}慢慢来，学习是一辈子的事。{adviceHint}","en":"{cardPersonality} appearing in this position — it feels for you: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight} Take it slow — learning is a lifelong thing. {adviceHint}","matchTags":{"preferredSentiment":["painful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"neutral":{"single":[{"zh":"学业方面，咱们客观分析一下。{entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","en":"Academics — let's analyze objectively. {entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在学习上给出的判断很清醒：{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} Its judgment on studying is very clear-headed: {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}方法对了一切都顺。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} When the method is right, everything flows. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}学业牌阵给你的信息很结构化——{cardJourney}{mainCardInsight}{conflictNote}按部就班就是最快的路。{adviceHint}","en":"{entityEcho} The study spread gives you very structured information — {cardJourney}{mainCardInsight}{conflictNote} Step by step is the fastest way. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}把大目标拆成小任务，一个一个来。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Break the big goal into small tasks — tackle them one by one. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在整个牌阵里给了你一个学习的窍门：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} gives you a study trick within the whole spread: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]}},"destiny":{"anxious":{"single":[{"zh":"人生大方向的事谁都会焦虑。{entityEcho}{mainCardInsight}{conflictNote}别怕，你这艘船没偏航。{adviceHint}","en":"Everyone gets anxious about life's big direction. {entityEcho}{mainCardInsight}{conflictNote} Don't worry — your ship isn't off course. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}人生的这个路口让人心慌是正常的。{cardPersonality}它在跟你说——{mainCardInsight}{conflictNote}{adviceHint}","en":"{timeContext} It's normal to feel panicked at this crossroads. {cardPersonality} It's telling you — {mainCardInsight}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}说白了，{mainCardInsight}{entityEcho}——{conflictNote}你不是迷路了，你是在重新选路。{adviceHint}","en":"{questionTypeFrame} To be blunt, {mainCardInsight}{entityEcho} — {conflictNote} You're not lost — you're choosing a new road. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}人生的牌阵给你铺开了一条路——{cardJourney}{mainCardInsight}{conflictNote}别怕，你走的路比你以为的宽。{adviceHint}","en":"{entityEcho} Life's spread lays out a path for you — {cardJourney}{mainCardInsight}{conflictNote} Don't be afraid — your road is wider than you think. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}命运不会给你过不去的坎。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Fate won't give you a hurdle you can't overcome. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在人生大方向上给了你一颗定心丸：{cardJourney}{conflictNote}{entityEcho}船到桥头自然直。{adviceHint}","en":"{cardPersonality} gives you reassurance on life's direction: {cardJourney}{conflictNote}{entityEcho} Things will work out when the time comes. {adviceHint}","matchTags":{"preferredSentiment":["anxious"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"hopeful":{"single":[{"zh":"人生的方向感，你其实一直都有。{entityEcho}{mainCardInsight}{conflictNote}牌只是在提醒你别忘了。{adviceHint}","en":"Your sense of life direction — you've actually always had it. {entityEcho}{mainCardInsight}{conflictNote} The cards are just reminding you not to forget. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在人生层面给了你一个很强的信号：{mainCardInsight}{entityEcho}{adviceHint}","en":"{timeContext}{cardPersonality} It gives you a strong signal on the life level: {mainCardInsight}{entityEcho}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}你的路是对的，走下去就是了。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} Your path is right — just keep walking. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["prediction"],"preferredTime":["future"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}人生的牌阵告诉你一个很朴素的事：{cardJourney}{mainCardInsight}{conflictNote}你正在成为你应该成为的人。{adviceHint}","en":"{entityEcho} The life spread tells you something very simple: {cardJourney}{mainCardInsight}{conflictNote} You're becoming the person you're meant to be. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote}命运这件事上，你的直觉比你想象的可信。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote} When it comes to destiny, your intuition is more trustworthy than you think. {adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在命运牌阵里给了你一张通行证：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} gives you a pass in the destiny spread: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["hopeful"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"confused":{"single":[{"zh":"看不清人生方向的时候，先走好脚下的路。{entityEcho}{mainCardInsight}{conflictNote}大方向是在走的过程中慢慢清唽的。{adviceHint}","en":"When you can't see life's direction, focus on the road beneath your feet. {entityEcho}{mainCardInsight}{conflictNote} The big picture clears up as you walk. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它理解你的困惑——{mainCardInsight}{entityEcho}{conflictNote}人生不是一道有标准答案的题。{adviceHint}","en":"{timeContext}{cardPersonality} It understands your confusion — {mainCardInsight}{entityEcho}{conflictNote} Life isn't a question with a standard answer. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}你看，{mainCardInsight}{entityEcho}——{conflictNote}迷茫是人生给你留的空白，不是错误。{adviceHint}","en":"{questionTypeFrame} Look, {mainCardInsight}{entityEcho} — {conflictNote} Confusion is the blank space life leaves for you — not a mistake. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}人生的牌阵没有给你一个标准答案，但它给了你方向——{cardJourney}{mainCardInsight}{conflictNote}跟着感觉走一段，不用怕。{adviceHint}","en":"{entityEcho} The life spread doesn't give you a standard answer, but it gives you direction — {cardJourney}{mainCardInsight}{conflictNote} Walk with your gut feeling for a while — no need to be afraid. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}有时候不知道要去哪，反而走得更远。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Sometimes not knowing where you're going lets you go further. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在这个位置很温柔——{cardJourney}{conflictNote}{entityEcho}人生没有白走的路，每一步都算数。{adviceHint}","en":"{cardPersonality} is very gentle in this position — {cardJourney}{conflictNote}{entityEcho} In life, no step is wasted — every step counts. {adviceHint}","matchTags":{"preferredSentiment":["confused"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]},"neutral":{"single":[{"zh":"人生这件事，咱们拉开来看。{entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","en":"Life — let's step back and look at it. {entityEcho}{mainCardInsight}{conflictNote}{domainFrame}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardPersonality}它在人生的维度上给出了一个很稳的观察：{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext}{cardPersonality} It gives a very steady observation on the life dimension: {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}{mainCardInsight}{entityEcho}——{conflictNote}人生没有完美路径，但有适合你的那条。{adviceHint}","en":"{questionTypeFrame}{mainCardInsight}{entityEcho} — {conflictNote} Life has no perfect path, but there's one that suits you. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["prediction"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}}],"multi":[{"zh":"{entityEcho}人生的全景牌阵给你拉开来看——{cardJourney}{mainCardInsight}{conflictNote}节奏比速度重要。{adviceHint}","en":"{entityEcho} The full panorama of the life spread opens up for you — {cardJourney}{mainCardInsight}{conflictNote} Rhythm matters more than speed. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["guidance"],"preferredTime":["ongoing"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho}时间是你的朋友，不是你的敌人。{adviceHint}","en":"{domainFrame}{timeContext}{cardJourney}{mainCardInsight}{conflictNote}{entityEcho} Time is your friend, not your enemy. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"domain_first"}},{"zh":"{cardPersonality}在命运牌阵里给了你一个很中肯的提示：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} gives you a very sound hint in the destiny spread: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["exploration"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}]}},"general":{"fallback":{"single":[{"zh":"你看啊，{mainCardInsight}{entityEcho}——{conflictNote}牌不会骗人，它只是用它的方式说话。{adviceHint}","en":"Look, {mainCardInsight}{entityEcho} — {conflictNote} The cards don't lie — they just speak in their own way. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{timeContext}说白了，{cardPersonality}想跟你说的话其实很简单——{mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","en":"{timeContext} Plainly, what {cardPersonality} wants to tell you is really simple — {mainCardInsight}{entityEcho}{conflictNote}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{questionTypeFrame}你说呢，{mainCardInsight}{entityEcho}——{conflictNote}事情没那么复杂，是你想太多了。{adviceHint}","en":"{questionTypeFrame} You know, {mainCardInsight}{entityEcho} — {conflictNote} Things aren't that complicated — you're overthinking it. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"其实，{entityEcho}{domainFrame}{mainCardInsight}{conflictNote}牌在做一个很简单的提醒——回到你自己。{adviceHint}","en":"Actually, {entityEcho}{domainFrame}{mainCardInsight}{conflictNote} The cards are making a very simple reminder — come back to yourself. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"说真的，{cardPersonality}{mainCardInsight}{entityEcho}{conflictNote}牌在给你一个信号——你不需要问太多人，你自己的判断就够了。{adviceHint}","en":"Honestly, {cardPersonality}{mainCardInsight}{entityEcho}{conflictNote} The cards are sending you a signal — you don't need to ask too many people. Your own judgment is enough. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}}],"multi":[{"zh":"{entityEcho}整个牌阵看下来，其实就是一个词——{mainCardInsight}{cardJourney}{conflictNote}别想太多，走就是了。{adviceHint}","en":"{entityEcho} Looking at the whole spread, it really comes down to one word — {mainCardInsight}{cardJourney}{conflictNote} Don't overthink — just walk. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}},{"zh":"{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote}牌面没有惊天动地的大事，但每一张都在认真回答你。{adviceHint}","en":"{timeContext}{cardJourney}{mainCardInsight}{entityEcho}{conflictNote} The spread has no earth-shattering revelations, but every card is earnestly answering you. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"time_first"}},{"zh":"{cardPersonality}带着周围的牌形成一个很清晰的画面：{cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","en":"{cardPersonality} with the surrounding cards forms a very clear picture: {cardJourney}{conflictNote}{entityEcho}{mainCardInsight}{adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"card_first"}},{"zh":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote}答案一直就在你手里，牌只是帮你摊开来看看。{adviceHint}","en":"{questionTypeFrame}{domainFrame}{mainCardInsight}{cardJourney}{entityEcho}{conflictNote} The answer has always been in your hands — the cards just help you spread it out and look. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"question_first"}},{"zh":"说白了，{entityEcho}{cardJourney}{mainCardInsight}{conflictNote}不是每件事都需要一个宏大的解释，有时候牌说的就是你已经在做的事。{adviceHint}","en":"To be plain, {entityEcho}{cardJourney}{mainCardInsight}{conflictNote} Not everything needs a grand explanation — sometimes the cards are just describing what you're already doing. {adviceHint}","matchTags":{"preferredSentiment":["neutral"],"preferredQType":["general"],"preferredTime":["present"],"requiresReversal":false,"requiresMajor":false,"structure":"entity_first"}}]}}};
  var tgt = TEMPLATE_LIBRARY.summaryV2;
  for (var d in src) {
    if (!tgt[d]) { tgt[d] = {}; }
    for (var s in src[d]) {
      if (!tgt[d][s]) { tgt[d][s] = {}; }
      for (var ck in src[d][s]) {
        if (!tgt[d][s][ck]) { tgt[d][s][ck] = []; }
        var arr = src[d][s][ck];
        if (Array.isArray(arr)) { tgt[d][s][ck] = tgt[d][s][ck].concat(arr); }
      }
    }
  }
})();

  // --- PUBLIC API ---
  return {
    REVERSAL_CHAINS,
    POSITION_MODIFIERS,
    SUIT_STORIES,
    COURT_SYSTEM,
    NUMBER_PATTERNS,
    ELEMENT_DYNAMICS,
    METHODOLOGY,
    NARRATIVE,
    TEMPLATE_LIBRARY,
    QUESTION_SYSTEM,
    QUESTION_GUIDANCE,
    TIMING,
    UTILS,
    THREE_ROWS,
    CARD_DIGNITY,
    CONTRADICTORY,
    GATE_CARDS,
    HEALTH,
    COLOR_SYMBOLISM,
    PAIR_RULES,
  };
})();

