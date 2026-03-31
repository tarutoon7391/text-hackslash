'use strict';

/* ==============================================================
   レベルアップ・スキルツリーシステム
   ============================================================== */

/** レベル上限 */
const MAX_LEVEL = 50;

/**
 * 各レベルに達するために必要な累計 EXP テーブル（インデックス = レベル - 1）
 */
const EXP_TABLE = [
  0,      // Lv 1
  700,    // Lv 2
  1500,   // Lv 3
  2400,   // Lv 4
  3800,   // Lv 5
  5300,   // Lv 6
  6900,   // Lv 7
  9200,   // Lv 8
  11500,  // Lv 9
  13800,  // Lv 10
  16100,  // Lv 11
  19900,  // Lv 12
  23900,  // Lv 13
  27900,  // Lv 14
  31900,  // Lv 15
  38300,  // Lv 16
  44800,  // Lv 17
  51300,  // Lv 18
  57800,  // Lv 19
  64300,  // Lv 20
  71300,  // Lv 21
  79300,  // Lv 22
  87800,  // Lv 23
  96800,  // Lv 24
  106800, // Lv 25
  117300, // Lv 26
  128300, // Lv 27
  140300, // Lv 28
  152800, // Lv 29
  165800, // Lv 30
  179800, // Lv 31
  194300, // Lv 32
  209300, // Lv 33
  225300, // Lv 34
  243300, // Lv 35
  262300, // Lv 36
  282300, // Lv 37
  303300, // Lv 38
  325300, // Lv 39
  350300, // Lv 40
  376300, // Lv 41
  403300, // Lv 42
  431300, // Lv 43
  460300, // Lv 44
  492300, // Lv 45
  525300, // Lv 46
  559300, // Lv 47
  594300, // Lv 48
  630300, // Lv 49
  670300, // Lv 50（上限）
];

/* ==============================================================
   スキルツリー定義
   各ルート 22 ノード（既存15 + 新規7）。
   各ルートのノードコスト合計: 既存30SP + 新規17SP = 47SP × 4ルート = 全ノード合計 188SP。
   プレイヤーが Lv50 までに獲得できる SP は最大 191 pt
   （Lv2〜20は5の倍数は5pt・それ以外は3pt=65pt、Lv21〜50は5の倍数は5pt・それ以外は4pt=126pt）
   191pt - 188pt = 3pt の余裕があり、全ノードを完走可能。
   ============================================================== */

const SKILL_TREE_DEFINITIONS = [

  /* ──────────────────────────────────────────────────────────
     剣士ルート（攻撃特化）
     ATK ボーナスが充実し、高倍率の斬撃スキルを習得できる
     MP 消費は少なめ
     ────────────────────────────────────────────────────────── */
  {
    id:          'swordsman',
    name:        '剣士',
    description: '攻撃特化ルート。ATK ボーナスが最も高く、強力な斬撃スキルを習得できる。MP 消費は少なめ。',
    nodes: [
      {
        id: 'sw_01', name: '鍛錬の型',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: null,
      },
      {
        id: 'sw_02', name: '剣の心得',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: 'sw_01',
      },
      {
        id: 'sw_03', name: '居合の構え',
        type: 'stat', description: 'ATK +4',
        bonuses: { atk: 4 }, cost: 1, requires: 'sw_02',
      },
      {
        id: 'sw_04', name: '剣技練磨',
        type: 'stat', description: 'ATK +5',
        bonuses: { atk: 5 }, cost: 1, requires: 'sw_03',
      },
      {
        id: 'sw_05', name: '鉄壁の肉体',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'sw_04',
      },
      {
        id: 'sw_06', name: '居合斬り',
        type: 'skill', skillId: 'iai_slash',
        description: '高速の一撃（ATK×1.5 / MP:12 / 25%で防御を無視する会心）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'sw_05',
      },
      {
        id: 'sw_07', name: '猛攻の型',
        type: 'stat', description: 'ATK +6',
        bonuses: { atk: 6 }, cost: 2, requires: 'sw_06',
      },
      {
        id: 'sw_08', name: '荒ぶる刃',
        type: 'stat', description: 'ATK +6',
        bonuses: { atk: 6 }, cost: 2, requires: 'sw_07',
      },
      {
        id: 'sw_09', name: '戦士の心',
        type: 'stat', description: 'HP +20',
        bonuses: { hp: 20 }, cost: 2, requires: 'sw_08',
      },
      {
        id: 'sw_10', name: '連続斬り',
        type: 'skill', skillId: 'chain_slash',
        description: '3 回連続攻撃（MP:15）',
        mpCost: 15, bonuses: {}, cost: 2, requires: 'sw_09',
      },
      {
        id: 'sw_11', name: '剣聖の修練',
        type: 'stat', description: 'ATK +8',
        bonuses: { atk: 8 }, cost: 3, requires: 'sw_10',
      },
      {
        id: 'sw_12', name: '鋼の意志',
        type: 'stat', description: 'DEF +5 / HP +15',
        bonuses: { def: 5, hp: 15 }, cost: 3, requires: 'sw_11',
      },
      {
        id: 'sw_13', name: '雷光斬り',
        type: 'skill', skillId: 'thunder_slash',
        description: '雷を纏った強斬り（ATK×2.0 / MP:18）',
        mpCost: 18, bonuses: {}, cost: 3, requires: 'sw_12',
      },
      {
        id: 'sw_14', name: '絶剣',
        type: 'stat', description: 'ATK +10',
        bonuses: { atk: 10 }, cost: 3, requires: 'sw_13',
      },
      {
        id: 'sw_15', name: '必殺剣',
        type: 'skill', skillId: 'death_blow',
        description: '防御を無視する必殺の一撃（ATK×2.5 / MP:25 / 防御無視）',
        mpCost: 25, bonuses: {}, cost: 3, requires: 'sw_14',
      },
      {
        id: 'sw_16', name: '剣聖の極意',
        type: 'stat', description: 'ATK +10',
        bonuses: { atk: 10 }, cost: 2, requires: 'sw_15',
      },
      {
        id: 'sw_17', name: '流星斬り',
        type: 'skill', skillId: 'shooting_star',
        description: '光速の 2 連撃（ATK×1.3×2 / MP:22）',
        mpCost: 22, bonuses: {}, cost: 2, requires: 'sw_16',
      },
      {
        id: 'sw_18', name: '剣聖の真髄',
        type: 'stat', description: 'ATK +12',
        bonuses: { atk: 12 }, cost: 2, requires: 'sw_17',
      },
      {
        id: 'sw_19', name: '影縫い',
        type: 'stat', description: 'DEF +8 / HP +20',
        bonuses: { def: 8, hp: 20 }, cost: 2, requires: 'sw_18',
      },
      {
        id: 'sw_20', name: '崩壊斬り',
        type: 'skill', skillId: 'ruin_slash',
        description: '存在を断つ斬撃（ATK×3.0 / MP:35）',
        mpCost: 35, bonuses: {}, cost: 3, requires: 'sw_19',
      },
      {
        id: 'sw_21', name: '神剣の境地',
        type: 'stat', description: 'ATK +15 / HP +30',
        bonuses: { atk: 15, hp: 30 }, cost: 3, requires: 'sw_20',
      },
      {
        id: 'sw_22', name: '天地無用剣',
        type: 'skill', skillId: 'peerless_blade',
        description: '天地を貫く 3 連撃（ATK×1.4×3 / MP:45）',
        mpCost: 45, bonuses: {}, cost: 3, requires: 'sw_21',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     魔法ルート（魔法攻撃特化）
     MP ボーナスが最も高く、高威力の魔法攻撃と回復魔法を習得できる
     ────────────────────────────────────────────────────────── */
  {
    id:          'mage',
    name:        '魔法',
    description: '魔法攻撃特化ルート。MP が大幅に増え、高威力の攻撃魔法と回復魔法を習得できる。',
    nodes: [
      {
        id: 'mg_01', name: '魔法の才能',
        type: 'stat', description: 'MP +8',
        bonuses: { mp: 8 }, cost: 1, requires: null,
      },
      {
        id: 'mg_02', name: '初級魔法',
        type: 'stat', description: 'MP +8',
        bonuses: { mp: 8 }, cost: 1, requires: 'mg_01',
      },
      {
        id: 'mg_03', name: '魔力の流れ',
        type: 'stat', description: 'MP +10',
        bonuses: { mp: 10 }, cost: 1, requires: 'mg_02',
      },
      {
        id: 'mg_04', name: '炎の心得',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: 'mg_03',
      },
      {
        id: 'mg_05', name: '魔法防壁',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'mg_04',
      },
      {
        id: 'mg_06', name: 'ファイア',
        type: 'skill', skillId: 'fire',
        description: '炎の魔法（ATK×1.6 / MP:20）',
        mpCost: 20, bonuses: {}, cost: 2, requires: 'mg_05',
      },
      {
        id: 'mg_07', name: '魔法練磨',
        type: 'stat', description: 'MP +12',
        bonuses: { mp: 12 }, cost: 2, requires: 'mg_06',
      },
      {
        id: 'mg_08', name: '高速詠唱',
        type: 'stat', description: 'ATK +5',
        bonuses: { atk: 5 }, cost: 2, requires: 'mg_07',
      },
      {
        id: 'mg_09', name: 'サンダー',
        type: 'skill', skillId: 'thunder',
        description: '雷の魔法（ATK×1.8 / MP:28）',
        mpCost: 28, bonuses: {}, cost: 2, requires: 'mg_08',
      },
      {
        id: 'mg_10', name: '魔法回復',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 2, requires: 'mg_09',
      },
      {
        id: 'mg_11', name: '上位魔法',
        type: 'stat', description: 'MP +15',
        bonuses: { mp: 15 }, cost: 3, requires: 'mg_10',
      },
      {
        id: 'mg_12', name: '治癒魔法',
        type: 'skill', skillId: 'heal_magic',
        description: '自分を回復する（HP+40+Lv×3 / MP:18）',
        mpCost: 18, bonuses: {}, cost: 3, requires: 'mg_11',
      },
      {
        id: 'mg_13', name: 'ブリザド',
        type: 'skill', skillId: 'blizzard',
        description: '氷の魔法（ATK×2.2 / MP:38）',
        mpCost: 38, bonuses: {}, cost: 3, requires: 'mg_12',
      },
      {
        id: 'mg_14', name: '大魔力',
        type: 'stat', description: 'ATK +5 / MP +20',
        bonuses: { atk: 5, mp: 20 }, cost: 3, requires: 'mg_13',
      },
      {
        id: 'mg_15', name: '大魔法陣',
        type: 'skill', skillId: 'grand_magic',
        description: '究極の魔法攻撃（ATK×3.0 / MP:65）',
        mpCost: 65, bonuses: {}, cost: 3, requires: 'mg_14',
      },
      {
        id: 'mg_16', name: '魔力覚醒',
        type: 'stat', description: 'ATK +8 / MP +20',
        bonuses: { atk: 8, mp: 20 }, cost: 2, requires: 'mg_15',
      },
      {
        id: 'mg_17', name: 'メテオ',
        type: 'skill', skillId: 'meteor',
        description: '隕石の魔法（ATK×2.8 / MP:55）',
        mpCost: 55, bonuses: {}, cost: 2, requires: 'mg_16',
      },
      {
        id: 'mg_18', name: '超魔力',
        type: 'stat', description: 'ATK +8 / MP +25',
        bonuses: { atk: 8, mp: 25 }, cost: 2, requires: 'mg_17',
      },
      {
        id: 'mg_19', name: '魔力爆発',
        type: 'skill', skillId: 'magic_explosion',
        description: '魔力を爆発させる（ATK×3.5 / MP:85）',
        mpCost: 85, bonuses: {}, cost: 2, requires: 'mg_18',
      },
      {
        id: 'mg_20', name: '大魔力覚醒',
        type: 'stat', description: 'ATK +10 / MP +30',
        bonuses: { atk: 10, mp: 30 }, cost: 3, requires: 'mg_19',
      },
      {
        id: 'mg_21', name: 'リジェネ',
        type: 'skill', skillId: 'regen',
        description: '再生の魔法（3ターン HP+20+Lv×0.5/ターン / MP:28）',
        mpCost: 28, bonuses: {}, cost: 3, requires: 'mg_20',
      },
      {
        id: 'mg_22', name: '時空魔法',
        type: 'skill', skillId: 'spacetime_magic',
        description: '時空を歪める魔法（ATK×5.0 / MP:120）',
        mpCost: 120, bonuses: {}, cost: 3, requires: 'mg_21',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     僧侶ルート（回復・バフ特化）
     HP/MP/DEF がバランスよく伸び、回復魔法とバフスキルを習得できる
     ────────────────────────────────────────────────────────── */
  {
    id:          'cleric',
    name:        '僧侶',
    description: '回復・バフ特化ルート。HP と MP が大幅に増え、回復魔法と防御バフを習得できる。',
    nodes: [
      {
        id: 'cl_01', name: '聖なる心',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: null,
      },
      {
        id: 'cl_02', name: '癒しの手',
        type: 'stat', description: 'MP +8',
        bonuses: { mp: 8 }, cost: 1, requires: 'cl_01',
      },
      {
        id: 'cl_03', name: '祈りの力',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'cl_02',
      },
      {
        id: 'cl_04', name: '生命の泉',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: 'cl_03',
      },
      {
        id: 'cl_05', name: '霊力強化',
        type: 'stat', description: 'MP +10',
        bonuses: { mp: 10 }, cost: 1, requires: 'cl_04',
      },
      {
        id: 'cl_06', name: 'ホーリーライト',
        type: 'skill', skillId: 'holy_light',
        description: '聖なる光で回復（HP+30+Lv×2 / MP:12）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'cl_05',
      },
      {
        id: 'cl_07', name: '聖壁の守り',
        type: 'stat', description: 'DEF +5',
        bonuses: { def: 5 }, cost: 2, requires: 'cl_06',
      },
      {
        id: 'cl_08', name: '神聖な鎧',
        type: 'stat', description: 'DEF +5 / HP +20',
        bonuses: { def: 5, hp: 20 }, cost: 2, requires: 'cl_07',
      },
      {
        id: 'cl_09', name: '祝福',
        type: 'skill', skillId: 'bless',
        description: '自分に ATK+25 バフ（5 ターン / MP:15）',
        mpCost: 15, bonuses: {}, cost: 2, requires: 'cl_08',
      },
      {
        id: 'cl_10', name: '回復の詩',
        type: 'stat', description: 'HP +20 / MP +8',
        bonuses: { hp: 20, mp: 8 }, cost: 2, requires: 'cl_09',
      },
      {
        id: 'cl_11', name: '大回復',
        type: 'skill', skillId: 'big_heal',
        description: '大きく HP を回復（HP+50+Lv×3 / MP:22）',
        mpCost: 22, bonuses: {}, cost: 3, requires: 'cl_10',
      },
      {
        id: 'cl_12', name: '聖域',
        type: 'skill', skillId: 'sanctuary',
        description: '防御バリア（DEF+40 / 4 ターン / MP:18）',
        mpCost: 18, bonuses: {}, cost: 3, requires: 'cl_11',
      },
      {
        id: 'cl_13', name: '神の恵み',
        type: 'stat', description: 'HP +30 / MP +15',
        bonuses: { hp: 30, mp: 15 }, cost: 3, requires: 'cl_12',
      },
      {
        id: 'cl_14', name: '復活の光',
        type: 'stat', description: 'HP +25',
        bonuses: { hp: 25 }, cost: 3, requires: 'cl_13',
      },
      {
        id: 'cl_15', name: '神聖魔法',
        type: 'skill', skillId: 'divine_heal',
        description: '神聖な力で大回復（HP+60+Lv×4 / MP:42）',
        mpCost: 42, bonuses: {}, cost: 3, requires: 'cl_14',
      },
      {
        id: 'cl_16', name: '聖なる覚醒',
        type: 'stat', description: 'HP +35 / MP +20',
        bonuses: { hp: 35, mp: 20 }, cost: 2, requires: 'cl_15',
      },
      {
        id: 'cl_17', name: '祝福の歌',
        type: 'skill', skillId: 'battle_hymn',
        description: '戦いの歌で ATK+40（6 ターン / MP:22）',
        mpCost: 22, bonuses: {}, cost: 2, requires: 'cl_16',
      },
      {
        id: 'cl_18', name: '神の慈悲',
        type: 'stat', description: 'HP +40 / DEF +10',
        bonuses: { hp: 40, def: 10 }, cost: 2, requires: 'cl_17',
      },
      {
        id: 'cl_19', name: '神の護り',
        type: 'skill', skillId: 'divine_shield',
        description: '神の盾で大幅防御（DEF+80 / 5 ターン / MP:30）',
        mpCost: 30, bonuses: {}, cost: 2, requires: 'cl_18',
      },
      {
        id: 'cl_20', name: '天恵の光',
        type: 'stat', description: 'HP +30 / MP +20',
        bonuses: { hp: 30, mp: 20 }, cost: 3, requires: 'cl_19',
      },
      {
        id: 'cl_21', name: '神聖なうたい寝',
        type: 'skill', skillId: 'holy_slumber',
        description: '神聖な歌声で眠りを誘い、3ターン後にHPを大回復する（HP+100+Lv×4 / MP:55）',
        mpCost: 55, bonuses: {}, cost: 3, requires: 'cl_20',
      },
      {
        id: 'cl_22', name: '奇跡の加護',
        type: 'stat', description: 'HP +50 / DEF +15 / MP +20',
        bonuses: { hp: 50, def: 15, mp: 20 }, cost: 3, requires: 'cl_21',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     戦士ルート（デバフ・バランス特化）
     ATK/DEF/HP がバランスよく伸び、スタンやデバフスキルを習得できる
     ────────────────────────────────────────────────────────── */
  {
    id:          'warrior',
    name:        '戦士',
    description: 'デバフ・バランス特化ルート。ATK/DEF/HP が均等に伸び、敵を弱体化させるスキルを習得できる。',
    nodes: [
      {
        id: 'wt_01', name: '体術の基礎',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: null,
      },
      {
        id: 'wt_02', name: '防御の構え',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'wt_01',
      },
      {
        id: 'wt_03', name: '鍛え上げた体',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: 'wt_02',
      },
      {
        id: 'wt_04', name: '俊敏',
        type: 'stat', description: 'ATK +3 / DEF +2',
        bonuses: { atk: 3, def: 2 }, cost: 1, requires: 'wt_03',
      },
      {
        id: 'wt_05', name: '粘り強さ',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: 'wt_04',
      },
      {
        id: 'wt_06', name: '足払い',
        type: 'skill', skillId: 'trip',
        description: '足を払う（ATK×1.2 / MP:12 / 15%でスタン＋必ずATK低下）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'wt_05',
      },
      {
        id: 'wt_07', name: '剛腕',
        type: 'stat', description: 'ATK +5',
        bonuses: { atk: 5 }, cost: 2, requires: 'wt_06',
      },
      {
        id: 'wt_08', name: '鉄壁',
        type: 'stat', description: 'DEF +5 / HP +10',
        bonuses: { def: 5, hp: 10 }, cost: 2, requires: 'wt_07',
      },
      {
        id: 'wt_09', name: '威嚇',
        type: 'skill', skillId: 'intimidate',
        description: '敵の攻撃力を 3 ターン大幅低下（MP:15）',
        mpCost: 15, bonuses: {}, cost: 2, requires: 'wt_08',
      },
      {
        id: 'wt_10', name: '突破口',
        type: 'stat', description: 'ATK +5 / HP +15',
        bonuses: { atk: 5, hp: 15 }, cost: 2, requires: 'wt_09',
      },
      {
        id: 'wt_11', name: '体当たり',
        type: 'skill', skillId: 'body_slam',
        description: '強烈な体当たり（ATK×1.6 / MP:15 / 20%でスタン＋必ずATK大幅低下）',
        mpCost: 15, bonuses: {}, cost: 3, requires: 'wt_10',
      },
      {
        id: 'wt_12', name: '鋼鉄の肉体',
        type: 'stat', description: 'DEF +8 / HP +25',
        bonuses: { def: 8, hp: 25 }, cost: 3, requires: 'wt_11',
      },
      {
        id: 'wt_13', name: '戦闘の覚醒',
        type: 'stat', description: 'ATK +8',
        bonuses: { atk: 8 }, cost: 3, requires: 'wt_12',
      },
      {
        id: 'wt_14', name: '破壊の一撃',
        type: 'skill', skillId: 'devastating_blow',
        description: '強打＋敵の攻撃力を 3 ターン大幅低下（ATK×2.0 / MP:22）',
        mpCost: 22, bonuses: {}, cost: 3, requires: 'wt_13',
      },
      {
        id: 'wt_15', name: '不屈の戦士',
        type: 'stat', description: 'ATK +5 / DEF +5 / HP +30',
        bonuses: { atk: 5, def: 5, hp: 30 }, cost: 3, requires: 'wt_14',
      },
      {
        id: 'wt_16', name: '覚醒の咆哮',
        type: 'stat', description: 'ATK +8 / DEF +8',
        bonuses: { atk: 8, def: 8 }, cost: 2, requires: 'wt_15',
      },
      {
        id: 'wt_17', name: '大地砕き',
        type: 'skill', skillId: 'earth_crash',
        description: '大地を砕く一撃（ATK×2.2 / MP:22 / 15%でスタン＋必ずATK大幅低下）',
        mpCost: 22, bonuses: {}, cost: 2, requires: 'wt_16',
      },
      {
        id: 'wt_18', name: '鋼鉄の意志',
        type: 'stat', description: 'DEF +12 / HP +35',
        bonuses: { def: 12, hp: 35 }, cost: 2, requires: 'wt_17',
      },
      {
        id: 'wt_19', name: '滅却の一撃',
        type: 'skill', skillId: 'annihilation',
        description: '敵を滅却する強打（ATK×3.0 ＋ 3ターンATK壊滅的デバフ / MP:32）',
        mpCost: 32, bonuses: {}, cost: 2, requires: 'wt_18',
      },
      {
        id: 'wt_20', name: '無双の体',
        type: 'stat', description: 'ATK +10 / DEF +10 / HP +40',
        bonuses: { atk: 10, def: 10, hp: 40 }, cost: 3, requires: 'wt_19',
      },
      {
        id: 'wt_21', name: '戦神の覚醒',
        type: 'skill', skillId: 'battle_trance',
        description: '戦神として覚醒（ATK+35 ＋ DEF+25 / 4ターン / MP:38）',
        mpCost: 38, bonuses: {}, cost: 3, requires: 'wt_20',
      },
      {
        id: 'wt_22', name: '鬼神の一撃',
        type: 'skill', skillId: 'ogre_strike',
        description: '鬼神の力を込めた大一撃（ATK×4.0 / MP:55 / 25%でスタン＋必ずATK強力低下）',
        mpCost: 55, bonuses: {}, cost: 3, requires: 'wt_21',
      },
    ],
  },
];

/**
 * スキル定義テーブル（スキルツリーのスキルマスから収集）
 * showSkillPanel() や useSkill() で使用する
 */
const SKILL_DEFINITIONS = (() => {
  const defs = [];
  SKILL_TREE_DEFINITIONS.forEach(route => {
    route.nodes
      .filter(n => n.type === 'skill')
      .forEach(n => {
        defs.push({
          id:          n.skillId,
          name:        n.name,
          mpCost:      n.mpCost || 0,
          description: n.description,
          route:       route.id,
        });
      });
  });
  return defs;
})();

/* ==============================================================
   EXP 加算・レベルアップ処理
   ============================================================== */

/**
 * EXP を加算してレベルアップを処理する
 * スキルポイント付与:
 *   Lv2〜20: 5の倍数レベルは5pt、それ以外は3pt（合計65pt）
 *   Lv21〜50: 5の倍数レベルは5pt、それ以外は4pt（合計126pt）
 *   Lv1〜50 総計: 191pt（全ノード合計188ptに対して3pt余裕）
 * @param {number} expGained - 獲得 EXP 量
 */
function gainExp(expGained) {
  const player = game.player;
  if (player.level >= MAX_LEVEL) {
    log(`EXP +${expGained}（レベル上限）`, 'result');
    return;
  }

  player.exp += expGained;

  // 連続レベルアップを処理する
  while (player.level < MAX_LEVEL && player.exp >= EXP_TABLE[player.level]) {
    player.level++;

    // レベルアップによる自然成長
    player.attackBase  += 1;
    player.defenseBase += 1;
    player.maxHpBase   += 5;
    player.maxMpBase   += 3;

    // スキルポイント付与（5の倍数は5pt、Lv21以降の非5倍数は4pt、Lv20以下は3pt）
    let pointsGained;
    if (player.level % 5 === 0) {
      pointsGained = 5;
    } else if (player.level > 20) {
      pointsGained = 4;
    } else {
      pointsGained = 3;
    }
    player.skillPoints += pointsGained;

    log(`⬆ レベルが ${player.level} に上がった！スキルポイントを ${pointsGained}pt 獲得！`, 'special');

    // ステータス再計算（装備含む）
    player.recalcStats();
    // HP / MP を最大値まで回復（レベルアップボーナス）
    player.hp = player.maxHp;
    player.mp = player.maxMp;
  }

  renderPlayerStatus();
}

/**
 * 次のレベルまでの残り EXP を返す
 * @returns {number}
 */
function expToNextLevel() {
  const player = game.player;
  if (player.level >= MAX_LEVEL) return 0;
  return EXP_TABLE[player.level] - player.exp;
}

/* ==============================================================
   スキルツリー画面の描画
   ============================================================== */

/** 現在表示中のルートタブ */
let skillTreeCurrentRoute = 'swordsman';

/** スキルツリー画面を描画する */
function renderSkillTree() {
  const p = game.player;

  // 残りポイント表示
  const remaining = document.getElementById('st-remaining');
  if (remaining) remaining.textContent = `残りポイント: ${p.skillPoints} pt`;

  // タブのアクティブ状態を更新
  document.querySelectorAll('.st-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === skillTreeCurrentRoute);
  });

  // 現在のルートを取得
  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === skillTreeCurrentRoute);
  if (!route) return;

  // ルート説明
  const descEl = document.getElementById('st-route-desc');
  if (descEl) descEl.textContent = route.description;

  // ノードリストを描画
  const nodeList = document.getElementById('st-node-list');
  if (!nodeList) return;

  const acquiredIds = p.skillTreeNodes[skillTreeCurrentRoute] || [];

  const html = route.nodes.map((node, idx) => {
    const isAcquired   = acquiredIds.includes(node.id);
    const prevAcquired = !node.requires || acquiredIds.includes(node.requires);
    const canAfford    = p.skillPoints >= node.cost;

    let stateClass;
    if (isAcquired)        stateClass = 'acquired';
    else if (prevAcquired) stateClass = 'available';
    else                   stateClass = 'locked';

    const clickable   = !isAcquired && prevAcquired;
    const onclickAttr = clickable
      ? `onclick="acquireSkillNode('${skillTreeCurrentRoute}', '${node.id}')"`
      : '';

    const typeIcon = node.type === 'skill' ? '✨' : '📈';

    let statusText;
    if (isAcquired)        statusText = '✓ 取得済み';
    else if (!prevAcquired) statusText = '🔒 前のノードを取得してください';
    else if (!canAfford)   statusText = `⚠ SP が足りません（必要 ${node.cost} pt）`;
    else                   statusText = `▶ クリックして取得（${node.cost} SP 消費）`;

    const arrow = idx < route.nodes.length - 1 ? '<div class="st-node-arrow">↓</div>' : '';

    // スキルマスのみお気に入りボタンを表示する
    let favoriteBtn = '';
    if (node.type === 'skill' && node.skillId) {
      const isFav = p.favoriteSkills.includes(node.skillId);
      favoriteBtn = `<button class="st-favorite-btn${isFav ? ' active' : ''}" onclick="event.stopPropagation(); toggleFavoriteSkill('${node.skillId}')" title="${isFav ? 'お気に入りを解除' : 'お気に入りに登録'}">${isFav ? '★' : '☆'}</button>`;
    }

    return `
      <div class="st-node ${stateClass}" ${onclickAttr}>
        <div class="st-node-header">
          <span class="st-node-icon">${typeIcon}</span>
          <span class="st-node-name">${node.name}</span>
          <span class="st-node-cost">${node.cost} SP</span>
          ${favoriteBtn}
        </div>
        <div class="st-node-desc">${node.description}</div>
        <div class="st-node-status">${statusText}</div>
      </div>${arrow}`;
  }).join('');

  nodeList.innerHTML = html;
}

/**
 * スキルツリーのルートタブを切り替える
 * @param {string} routeId
 */
function switchSkillTreeTab(routeId) {
  skillTreeCurrentRoute = routeId;
  renderSkillTree();
}

/**
 * スキルのお気に入り登録・解除をトグルする
 * @param {string} skillId - スキル ID
 */
function toggleFavoriteSkill(skillId) {
  const p = game.player;
  const idx = p.favoriteSkills.indexOf(skillId);
  if (idx === -1) {
    p.favoriteSkills.push(skillId);
  } else {
    p.favoriteSkills.splice(idx, 1);
  }
  renderSkillTree();
}

/**
 * スキルツリーのノードを取得する
 * @param {string} routeId - ルート ID
 * @param {string} nodeId  - ノード ID
 */
function acquireSkillNode(routeId, nodeId) {
  const p = game.player;

  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === routeId);
  if (!route) return;

  const node = route.nodes.find(n => n.id === nodeId);
  if (!node) return;

  // 既に取得済みか確認
  if (!p.skillTreeNodes[routeId]) p.skillTreeNodes[routeId] = [];
  if (p.skillTreeNodes[routeId].includes(nodeId)) return;

  // 前のノードが取得されているか確認
  if (node.requires && !p.skillTreeNodes[routeId].includes(node.requires)) return;

  // SP が足りるか確認
  if (p.skillPoints < node.cost) {
    alert('スキルポイントが足りません！');
    return;
  }

  // ノードを取得
  p.skillPoints -= node.cost;
  p.skillTreeNodes[routeId].push(nodeId);

  // スキルマスの場合は learnedSkills に追加
  if (node.type === 'skill' && node.skillId) {
    if (!p.learnedSkills.includes(node.skillId)) {
      p.learnedSkills.push(node.skillId);
    }
  }

  // ステータス再計算
  p.recalcStats();

  // 画面を再描画
  renderSkillTree();
  renderLobbyStatus();
}

/* ==============================================================
   スキル使用（戦闘中に呼ばれる）
   ============================================================== */

/**
 * スキルを使用する
 * @param {string} skillId - 使用するスキル ID
 */
function useSkill(skillId) {
  if (game.state !== GameState.PLAYER_TURN) return;

  const skill = SKILL_DEFINITIONS.find(s => s.id === skillId);
  if (!skill) return;

  const player = game.player;
  const enemy  = game.enemy;

  if (player.mp < skill.mpCost) {
    log('⚠ MP が足りない！', 'system');
    return;
  }

  setButtonsEnabled(false);
  hideSkillPanel();

  player.mp -= skill.mpCost;
  applyMpRegenEffect();

  switch (skillId) {

    /* ── 剣士スキル ── */

    case 'iai_slash': {
      // 居合斬り: ATK×1.5 / 25%で防御を無視する会心
      const crit = Math.random() < 0.25;
      const defFactor = crit ? 0 : SKILL_DEFENSE_FACTOR;
      const raw = Math.floor(player.effectiveAttack * 1.5) - Math.floor(enemy.defense * defFactor);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      if (crit) {
        log(`⚔✨ ${player.name} は「居合斬り」で会心！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
      } else {
        log(`⚔ ${player.name} は「居合斬り」で斬り込んだ！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'chain_slash': {
      // 連続斬り: 3 回攻撃
      const dmg1 = player.calcAttackDamage(enemy);
      enemy.takeDamage(dmg1);
      let dmg2 = 0;
      if (enemy.isAlive()) {
        dmg2 = player.calcAttackDamage(enemy);
        enemy.takeDamage(dmg2);
      }
      let dmg3 = 0;
      if (enemy.isAlive()) {
        dmg3 = player.calcAttackDamage(enemy);
        enemy.takeDamage(dmg3);
      }
      log(`⚔⚔⚔ ${player.name} は「連続斬り」で 3 回攻撃！ → ${enemy.name} に ${dmg1}＋${dmg2}＋${dmg3} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'thunder_slash': {
      // 雷光斬り: ATK×2.0
      const raw = Math.floor(player.effectiveAttack * 2.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚡ ${player.name} は「雷光斬り」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'death_blow': {
      // 必殺剣: ATK×2.5 / 防御完全無視
      const raw = Math.floor(player.effectiveAttack * 2.5);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 6)), 'deal');
      enemy.takeDamage(dmg);
      log(`💀 ${player.name} は「必殺剣」で防御を貫いた！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 魔法スキル ── */

    case 'fire': {
      // ファイア: ATK×1.6
      const raw = Math.floor(player.effectiveAttack * 1.6) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      log(`🔥 ${player.name} は「ファイア」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'thunder': {
      // サンダー: ATK×1.8
      const raw = Math.floor(player.effectiveAttack * 1.8) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚡ ${player.name} は「サンダー」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'heal_magic': {
      // 治癒魔法: HP 回復（40 + Lv×3）
      const healAmt = 40 + player.level * 3;
      player.heal(healAmt);
      log(`💚 ${player.name} は「治癒魔法」を唱えた！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'blizzard': {
      // ブリザド: ATK×2.2
      const raw = Math.floor(player.effectiveAttack * 2.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      log(`🌨 ${player.name} は「ブリザド」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'grand_magic': {
      // 大魔法陣: ATK×3.0
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      log(`✨ ${player.name} は「大魔法陣」を展開した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 僧侶スキル ── */

    case 'holy_light': {
      // ホーリーライト: HP 回復（30 + Lv×2）
      const healAmt = 30 + player.level * 2;
      player.heal(healAmt);
      log(`✨ ${player.name} は「ホーリーライト」を使った！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'bless': {
      // 祝福: ATK +25 バフ 5 ターン
      game.playerAtkBuff = { bonus: 25, turnsLeft: 5 };
      log(`🌟 ${player.name} は「祝福」を唱えた！ 5 ターン ATK +25`, 'player-action');
      break;
    }

    case 'big_heal': {
      // 大回復: HP 回復（50 + Lv×3）
      const healAmt = 50 + player.level * 3;
      player.heal(healAmt);
      log(`💚 ${player.name} は「大回復」を唱えた！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'sanctuary': {
      // 聖域: DEF +40 バフ 4 ターン
      game.shieldActive = { defenseBonus: 40, turnsLeft: 4 };
      log(`🛡 ${player.name} は「聖域」を展開した！ 4 ターン DEF +40`, 'player-action');
      break;
    }

    case 'divine_heal': {
      // 神聖魔法: HP 回復（60 + Lv×4）
      const healAmt = 60 + player.level * 4;
      player.heal(healAmt);
      log(`🌟 ${player.name} は「神聖魔法」を唱えた！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    /* ── 戦士スキル ── */

    case 'trip': {
      // 足払い: ATK×1.2 + 15%の確率でスタン＋常時ATK低下デバフ
      const raw = Math.floor(player.effectiveAttack * 1.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 3)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.15;
      game.enemyStunned = stunned;
      // 常時ATK低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.85, turnsLeft: 2 };
      if (stunned) {
        log(`💥 ${player.name} は「足払い」を決めた！ → ${enemy.name} に ${dmg} ダメージ！次のターン行動不能＋ATK低下！`, 'player-action');
      } else {
        log(`💥 ${player.name} は「足払い」を決めた！ → ${enemy.name} に ${dmg} ダメージ！ATK低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'intimidate': {
      // 威嚇: 敵 ATK ×0.55（3 ターン）- 大幅強化版
      game.enemyAtkDebuff = { factor: 0.55, turnsLeft: 3 };
      log(`😤 ${player.name} は「威嚇」した！ → ${enemy.name} の攻撃力が 3 ターン大幅低下！`, 'player-action');
      break;
    }

    case 'body_slam': {
      // 体当たり: ATK×1.6 + 20%の確率でスタン＋常時ATK大幅低下デバフ
      const raw = Math.floor(player.effectiveAttack * 1.6) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.20;
      game.enemyStunned = stunned;
      // 常時ATK大幅低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.80, turnsLeft: 3 };
      if (stunned) {
        log(`💥 ${player.name} は「体当たり」を仕掛けた！ → ${enemy.name} に ${dmg} ダメージ！スタン＋ATK大幅低下！`, 'player-action');
      } else {
        log(`💥 ${player.name} は「体当たり」を仕掛けた！ → ${enemy.name} に ${dmg} ダメージ！ATK大幅低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'devastating_blow': {
      // 破壊の一撃: ATK×2.0 + 敵 ATK デバフ（3 ターン・大幅強化版）
      const raw = Math.floor(player.effectiveAttack * 2.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      game.enemyAtkDebuff = { factor: 0.65, turnsLeft: 3 };
      log(`💢 ${player.name} は「破壊の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！攻撃力が 3 ターン大幅低下！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 剣士新スキル ── */

    case 'shooting_star': {
      // 流星斬り: ATK×1.3 の 2 連撃
      const raw1 = Math.floor(player.effectiveAttack * 1.3) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg1 = applyEquipmentEffects(Math.max(1, raw1 + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg1);
      let dmg2 = 0;
      if (enemy.isAlive()) {
        const raw2 = Math.floor(player.effectiveAttack * 1.3) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        dmg2 = applyEquipmentEffects(Math.max(1, raw2 + randInt(-2, 4)), 'deal');
        enemy.takeDamage(dmg2);
      }
      log(`🌠 ${player.name} は「流星斬り」で 2 連撃！ → ${enemy.name} に ${dmg1}＋${dmg2} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ruin_slash': {
      // 崩壊斬り: ATK×3.0
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚔ ${player.name} は「崩壊斬り」を振りおろした！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'peerless_blade': {
      // 天地無用剣: ATK×1.4 の 3 連撃
      const hits = [];
      for (let i = 0; i < 3; i++) {
        if (!enemy.isAlive()) break;
        const raw = Math.floor(player.effectiveAttack * 1.4) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 6)), 'deal');
        enemy.takeDamage(dmg);
        hits.push(dmg);
      }
      log(`✴ ${player.name} は「天地無用剣」で 3 連撃！ → ${enemy.name} に ${hits.join('＋')} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 魔法新スキル ── */

    case 'meteor': {
      // メテオ: ATK×2.8
      const raw = Math.floor(player.effectiveAttack * 2.8) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      log(`☄ ${player.name} は「メテオ」を召喚した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'magic_explosion': {
      // 魔力爆発: ATK×3.5
      const raw = Math.floor(player.effectiveAttack * 3.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 8)), 'deal');
      enemy.takeDamage(dmg);
      log(`💥 ${player.name} は「魔力爆発」を発動した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'regen': {
      // リジェネ: 3ターン毎ターンHP回復 (+20/turn)
      game.playerRegen = { hpPerTurn: 20 + Math.floor(player.level * 0.5), turnsLeft: 3 };
      log(`💚 ${player.name} は「リジェネ」を唱えた！ 3 ターン HP 回復効果！`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'spacetime_magic': {
      // 時空魔法: ATK×5.0
      const raw = Math.floor(player.effectiveAttack * 5.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-6, 10)), 'deal');
      enemy.takeDamage(dmg);
      log(`🌀 ${player.name} は「時空魔法」を展開した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 僧侶新スキル ── */

    case 'battle_hymn': {
      // 祝福の歌: ATK+40 バフ 6 ターン
      game.playerAtkBuff = { bonus: 40, turnsLeft: 6 };
      log(`🎶 ${player.name} は「祝福の歌」を歌った！ 6 ターン ATK +40`, 'player-action');
      break;
    }

    case 'divine_shield': {
      // 神の護り: DEF+80 バフ 5 ターン
      game.shieldActive = { defenseBonus: 80, turnsLeft: 5 };
      log(`🛡 ${player.name} は「神の護り」を展開した！ 5 ターン DEF +80`, 'player-action');
      break;
    }

    case 'holy_slumber': {
      // 神聖なうたい寝: 3ターン後にHPを大回復（遅延回復）
      const healAmt = 100 + player.level * 4;
      game.playerDelayedHeal = { healAmt, turnsLeft: 3 };
      log(`🎵 ${player.name} は「神聖なうたい寝」を歌った！ 3 ターン後に HP +${healAmt} が回復する…`, 'player-action');
      break;
    }

    /* ── 戦士新スキル ── */

    case 'earth_crash': {
      // 大地砕き: ATK×2.2 + 15%スタン＋常時ATK大幅低下デバフ
      const raw = Math.floor(player.effectiveAttack * 2.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.15;
      game.enemyStunned = stunned;
      // 常時ATK大幅低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.70, turnsLeft: 3 };
      if (stunned) {
        log(`🌋 ${player.name} は「大地砕き」を放った！ → ${enemy.name} に ${dmg} ダメージ！スタン＋ATK大幅低下！`, 'player-action');
      } else {
        log(`🌋 ${player.name} は「大地砕き」を放った！ → ${enemy.name} に ${dmg} ダメージ！ATK大幅低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'annihilation': {
      // 滅却の一撃: ATK×3.0 + 壊滅的 ATK デバフ（3 ターン）
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      game.enemyAtkDebuff = { factor: 0.50, turnsLeft: 3 };
      log(`💀 ${player.name} は「滅却の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！攻撃力が壊滅的に低下！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'battle_trance': {
      // 戦神の覚醒: ATK+35 バフ 4 ターン + DEF+25 バフ 4 ターン
      game.playerAtkBuff = { bonus: 35, turnsLeft: 4 };
      game.shieldActive  = { defenseBonus: 25, turnsLeft: 4 };
      log(`⚡ ${player.name} は「戦神の覚醒」を発動！ 4 ターン ATK +35 / DEF +25`, 'player-action');
      break;
    }

    case 'ogre_strike': {
      // 鬼神の一撃: ATK×4.0 + 25%スタン＋常時ATK強力低下デバフ
      const raw = Math.floor(player.effectiveAttack * 4.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-5, 9)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.25;
      game.enemyStunned = stunned;
      // 常時ATK強力低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.60, turnsLeft: 3 };
      if (stunned) {
        log(`👹 ${player.name} は「鬼神の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！スタン＋ATK強力低下！`, 'player-action');
      } else {
        log(`👹 ${player.name} は「鬼神の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！ATK強力低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    default:
      break;
  }

  // スキル使用後はプレイヤーターンを終了し、敵のターンへ進む
  afterPlayerTurn();
}
