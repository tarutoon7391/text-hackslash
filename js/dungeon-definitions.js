'use strict';

/* ==============================================================
   ダンジョン定義テーブル
   通常ダンジョン・ガチャ・XP・レアモン・スキルダンジョンの定義データ
   ============================================================== */

/**
 * ダンジョン定義テーブル
 * 各ダンジョンに通常敵・レア敵・ボスを定義する
 * expReward は各敵の獲得経験値
 */
const DUNGEON_DEFINITIONS = [
  /* ──────────────────────────────────────────
     ダンジョン 1: スライムの洞窟（推奨 Lv 1〜3）
     ────────────────────────────────────────── */
  {
    id: 1,
    name: 'スライムの洞窟',
    recommendedLevel: 1,
    normalEnemies: [
      { name: 'スライム',       hp: 40,  maxHp: 40,  attack: 12, defense: 3,  expReward: 10 },
      { name: 'ビッグスライム', hp: 65,  maxHp: 65,  attack: 14, defense: 6,  expReward: 18 },
      { name: 'ブルースライム', hp: 50,  maxHp: 50,  attack: 13, defense: 4,  expReward: 14 },
    ],
    rareEnemy: { name: 'メタルスライム', hp: 8,   maxHp: 8,   attack: 15, defense: 40, expReward: 80 },
    boss: { name: 'キングスライム', hp: 250, maxHp: 250, attack: 25, defense: 12, expReward: 150 },
    rareChance: 0.15,
    drops: {
      common:           '革',
      commonDropRate:    0.50,
      rares:            ['キラースライム核', 'スライムクリスタル'],
      rareDropRate:      0.80,
      boss:             'キングゼリー',
      bossDropRate:      0.30,
      bossRare:         '王冠の欠片',
      bossRareDropRate:  0.10,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 2: ゴブリンの森（推奨 Lv 4〜6）
     ────────────────────────────────────────── */
  {
    id: 2,
    name: 'ゴブリンの森',
    recommendedLevel: 4,
    normalEnemies: [
      { name: 'ゴブリン',         hp: 80,  maxHp: 80,  attack: 28, defense: 10, expReward: 30 },
      { name: 'ゴブリンアーチャー', hp: 70, maxHp: 70,  attack: 35, defense: 7,  expReward: 28 },
      { name: 'ゴブリン戦士',      hp: 110, maxHp: 110, attack: 25, defense: 18, expReward: 35 },
    ],
    rareEnemy: { name: 'ゴブリンシャーマン', hp: 70,  maxHp: 70,  attack: 50, defense: 8,  expReward: 110 },
    boss: { name: 'ゴブリンキング',     hp: 440, maxHp: 440, attack: 55, defense: 30, expReward: 280 },
    rareChance: 0.15,
    drops: {
      common:           '鉄',
      commonDropRate:    0.50,
      rares:            ['シャーマンの杖', '森の魔石'],
      rareDropRate:      0.80,
      boss:             '王の紋章',
      bossDropRate:      0.30,
      bossRare:         '覇王の証',
      bossRareDropRate:  0.10,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 3: 骸骨の墓地（推奨 Lv 7〜9）
     ────────────────────────────────────────── */
  {
    id: 3,
    name: '骸骨の墓地',
    recommendedLevel: 7,
    normalEnemies: [
      { name: 'スケルトン',         hp: 130, maxHp: 130, attack: 48, defense: 20, expReward: 55 },
      { name: 'ゾンビ',             hp: 170, maxHp: 170, attack: 40, defense: 26, expReward: 50 },
      { name: 'スケルトンアーチャー', hp: 100, maxHp: 100, attack: 56, defense: 14, expReward: 60 },
    ],
    rareEnemy: { name: 'リッチ',      hp: 120, maxHp: 120, attack: 80, defense: 16, expReward: 160 },
    boss: { name: 'デスナイト',  hp: 680, maxHp: 680, attack: 72, defense: 42, expReward: 380 },
    rareChance: 0.15,
    drops: {
      common:           '金',
      commonDropRate:    0.50,
      rares:            ['呪いの骨', '死霊の涙'],
      rareDropRate:      0.80,
      boss:             '死神の鎌',
      bossDropRate:      0.30,
      bossRare:         '冥府の鍵',
      bossRareDropRate:  0.10,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 4: 溶岩の洞窟（推奨 Lv 11〜13）
     ────────────────────────────────────────── */
  {
    id: 4,
    name: '溶岩の洞窟',
    recommendedLevel: 11,
    normalEnemies: [
      { name: 'サラマンダー',   hp: 200, maxHp: 200, attack: 78, defense: 32, expReward: 90 },
      { name: 'マグマゴーレム', hp: 270, maxHp: 270, attack: 72, defense: 50, expReward: 95 },
      { name: 'ファイアバット', hp: 150, maxHp: 150, attack: 88, defense: 25, expReward: 88 },
    ],
    rareEnemy: { name: 'ラーヴァゴーレム', hp: 250, maxHp: 250, attack: 115, defense: 52, expReward: 220 },
    boss: { name: 'フレイムドラゴン', hp: 1100, maxHp: 1100, attack: 130, defense: 70, expReward: 650 },
    rareChance: 0.15,
    drops: {
      common:           'ダイヤ',
      commonDropRate:    0.50,
      rares:            ['溶岩石', '炎晶石'],
      rareDropRate:      0.75,
      boss:             '竜の炎石',
      bossDropRate:      0.30,
      bossRare:         '炎竜の魂',
      bossRareDropRate:  0.10,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 5: 魔王の城（推奨 Lv 15〜17）
     ────────────────────────────────────────── */
  {
    id: 5,
    name: '魔王の城',
    recommendedLevel: 15,
    normalEnemies: [
      { name: 'デーモン',     hp: 340, maxHp: 340, attack: 120, defense: 56, expReward: 155 },
      { name: 'ダークエルフ', hp: 280, maxHp: 280, attack: 138, defense: 46, expReward: 162 },
      { name: 'シャドウ',     hp: 240, maxHp: 240, attack: 145, defense: 42, expReward: 158 },
    ],
    rareEnemy: { name: 'ダークナイト', hp: 360, maxHp: 360, attack: 180, defense: 76, expReward: 320 },
    boss: { name: '魔王',         hp: 1700, maxHp: 1700, attack: 200, defense: 100, expReward: 1000 },
    rareChance: 0.15,
    drops: {
      common:           '竜鱗',
      commonDropRate:    0.50,
      rares:            ['闇の結晶', '虚無の欠片'],
      rareDropRate:      0.75,
      boss:             '魔王の心臓',
      bossDropRate:      0.25,
      bossRare:         '魔王の魂',
      bossRareDropRate:  0.08,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 6: 古代遺跡（推奨 Lv 18〜20）
     ────────────────────────────────────────── */
  {
    id: 6,
    name: '古代遺跡',
    recommendedLevel: 18,
    normalEnemies: [
      { name: '遺跡の番人',   hp: 460, maxHp: 460, attack: 165, defense: 68, expReward: 200 },
      { name: '古代の精霊',   hp: 380, maxHp: 380, attack: 178, defense: 58, expReward: 210 },
      { name: '石像ゴーレム', hp: 540, maxHp: 540, attack: 155, defense: 82, expReward: 205 },
    ],
    rareEnemy: { name: '遺跡の守護神', hp: 480, maxHp: 480, attack: 225, defense: 95, expReward: 420 },
    boss: { name: '古代神将',         hp: 2300, maxHp: 2300, attack: 260, defense: 135, expReward: 1300 },
    rareChance: 0.15,
    drops: {
      common:           '古代石',
      commonDropRate:    0.50,
      rares:            ['精霊の羽根', '遺跡の石板'],
      rareDropRate:      0.75,
      boss:             '遺跡守護者の胆石',
      bossDropRate:      0.25,
      bossRare:         '古代の叡智',
      bossRareDropRate:  0.08,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 7: 深海の神殿（推奨 Lv 22〜25）
     ────────────────────────────────────────── */
  {
    id: 7,
    name: '深海の神殿',
    recommendedLevel: 22,
    normalEnemies: [
      { name: 'ディープシーサーペント', hp: 620, maxHp: 620, attack: 215, defense: 90, expReward: 280 },
      { name: '深海クラーケン',         hp: 750, maxHp: 750, attack: 200, defense: 105, expReward: 290 },
      { name: '海底亡霊',               hp: 540, maxHp: 540, attack: 235, defense: 78, expReward: 275 },
    ],
    rareEnemy: { name: '深海の邪神使', hp: 640, maxHp: 640, attack: 290, defense: 120, expReward: 560 },
    boss: { name: '深海神リヴァイアサン', hp: 3000, maxHp: 3000, attack: 330, defense: 175, expReward: 1700 },
    rareChance: 0.15,
    drops: {
      common:           '深海珊瑚',
      commonDropRate:    0.50,
      rares:            ['深海魚の鱗', '海神の宝珠'],
      rareDropRate:      0.75,
      boss:             '深海神の牙',
      bossDropRate:      0.25,
      bossRare:         '深海神の加護',
      bossRareDropRate:  0.08,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 8: 宇宙の彼方（推奨 Lv 27〜30）
     ────────────────────────────────────────── */
  {
    id: 8,
    name: '宇宙の彼方',
    recommendedLevel: 27,
    normalEnemies: [
      { name: 'スターゴーレム',   hp: 820, maxHp: 820, attack: 275, defense: 118, expReward: 380 },
      { name: '銀河の亡霊',       hp: 700, maxHp: 700, attack: 295, defense: 102, expReward: 375 },
      { name: 'コスモデーモン',   hp: 930, maxHp: 930, attack: 260, defense: 130, expReward: 385 },
    ],
    rareEnemy: { name: '星の番人', hp: 850, maxHp: 850, attack: 370, defense: 155, expReward: 740 },
    boss: { name: '星神アストラル', hp: 3800, maxHp: 3800, attack: 405, defense: 215, expReward: 2200 },
    rareChance: 0.15,
    drops: {
      common:           '星屑の欠片',
      commonDropRate:    0.50,
      rares:            ['隕石鉄', '宇宙水晶'],
      rareDropRate:      0.75,
      boss:             '星の守護者の核',
      bossDropRate:      0.25,
      bossRare:         '星神の加護',
      bossRareDropRate:  0.08,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 9: 異世界の迷宮（推奨 Lv 31〜34）
     ────────────────────────────────────────── */
  {
    id: 9,
    name: '異世界の迷宮',
    recommendedLevel: 31,
    normalEnemies: [
      { name: '異界の魔人',   hp: 1000, maxHp: 1000, attack: 345, defense: 148, expReward: 500 },
      { name: '次元の裂け目', hp: 880,  maxHp: 880,  attack: 370, defense: 130, expReward: 495 },
      { name: '異界の悪魔',   hp: 1100, maxHp: 1100, attack: 330, defense: 162, expReward: 505 },
    ],
    rareEnemy: { name: '異界の封印者', hp: 1050, maxHp: 1050, attack: 465, defense: 195, expReward: 980 },
    boss: { name: '異界の覇王', hp: 4700, maxHp: 4700, attack: 495, defense: 260, expReward: 2800 },
    rareChance: 0.15,
    drops: {
      common:           '異界の石',
      commonDropRate:    0.50,
      rares:            ['魔界の結晶', '異界の魔石'],
      rareDropRate:      0.75,
      boss:             '迷宮守護者の核',
      bossDropRate:      0.25,
      bossRare:         '異界の力',
      bossRareDropRate:  0.08,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 10: 夢幻の庭園（推奨 Lv 36〜39）
     ────────────────────────────────────────── */
  {
    id: 10,
    name: '夢幻の庭園',
    recommendedLevel: 36,
    normalEnemies: [
      { name: '夢幻の妖精',   hp: 1200, maxHp: 1200, attack: 420, defense: 180, expReward: 640 },
      { name: '幻影の騎士',   hp: 1350, maxHp: 1350, attack: 400, defense: 200, expReward: 650 },
      { name: '夢食いの魔物', hp: 1100, maxHp: 1100, attack: 445, defense: 165, expReward: 645 },
    ],
    rareEnemy: { name: '夢幻の女神使', hp: 1280, maxHp: 1280, attack: 565, defense: 240, expReward: 1250 },
    boss: { name: '夢神フォルサム', hp: 5800, maxHp: 5800, attack: 600, defense: 315, expReward: 3600 },
    rareChance: 0.15,
    drops: {
      common:           '夢の花',
      commonDropRate:    0.50,
      rares:            ['幻想の羽根', '夢幻の水晶'],
      rareDropRate:      0.75,
      boss:             '夢主の心',
      bossDropRate:      0.25,
      bossRare:         '夢神の加護',
      bossRareDropRate:  0.08,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 11: 時空の裂け目（推奨 Lv 41〜44）
     ────────────────────────────────────────── */
  {
    id: 11,
    name: '時空の裂け目',
    recommendedLevel: 41,
    normalEnemies: [
      { name: '時の守護者',   hp: 1500, maxHp: 1500, attack: 505, defense: 225, expReward: 820 },
      { name: '空間断層体',   hp: 1650, maxHp: 1650, attack: 485, defense: 245, expReward: 830 },
      { name: '次元の亡霊',   hp: 1380, maxHp: 1380, attack: 530, defense: 208, expReward: 815 },
    ],
    rareEnemy: { name: '時空の支配者', hp: 1580, maxHp: 1580, attack: 680, defense: 295, expReward: 1600 },
    boss: { name: '時空神クロノス', hp: 7200, maxHp: 7200, attack: 720, defense: 380, expReward: 4600 },
    rareChance: 0.15,
    drops: {
      common:           '時空の欠片',
      commonDropRate:    0.50,
      rares:            ['時の砂', '空間の結晶'],
      rareDropRate:      0.75,
      boss:             '時空守護者の核',
      bossDropRate:      0.25,
      bossRare:         '時空の奇跡',
      bossRareDropRate:  0.08,
    },
  },

  /* ──────────────────────────────────────────
     ダンジョン 12: 混沌の神殿（推奨 Lv 46〜50）
     ────────────────────────────────────────── */
  {
    id: 12,
    name: '混沌の神殿',
    recommendedLevel: 46,
    normalEnemies: [
      { name: '混沌の魔将',   hp: 1850, maxHp: 1850, attack: 610, defense: 275, expReward: 1050 },
      { name: 'カオスデーモン', hp: 2000, maxHp: 2000, attack: 585, defense: 295, expReward: 1060 },
      { name: '虚無の騎士',   hp: 1700, maxHp: 1700, attack: 640, defense: 258, expReward: 1040 },
    ],
    rareEnemy: { name: '混沌の覇神使', hp: 1950, maxHp: 1950, attack: 825, defense: 360, expReward: 2050 },
    boss: { name: '混沌神カオスロード', hp: 9500, maxHp: 9500, attack: 880, defense: 460, expReward: 6000 },
    rareChance: 0.15,
    drops: {
      common:           '混沌の結晶',
      commonDropRate:    0.50,
      rares:            ['虚空の欠片', '混沌の石板'],
      rareDropRate:      0.75,
      boss:             '混沌神の心臓',
      bossDropRate:      0.25,
      bossRare:         '混沌の力',
      bossRareDropRate:  0.08,
    },
  },
];

/** 1 ダンジョンあたりの敵数（ボス含む） */
const DUNGEON_ENEMY_COUNT = 15;


/* ==============================================================
   ガチャチケダンジョン定義
   各難易度のモンスター・ドロップ率を定義する
   ============================================================== */

/**
 * ガチャチケダンジョンの難易度別定義
 * normalTicketDropRate: 通常敵のチケットドロップ率
 * bossTicketDropRate:   ボスのチケットドロップ率
 * ticketDragonDrop:     チケットドラゴン（レア）の確定ドロップ枚数
 */
const GACHA_DUNGEON_DEFINITIONS = {
  /* ──────────────────────────────────────────
     初級（推奨 Lv 20）
     ────────────────────────────────────────── */
  beginner: {
    name: 'チケットダンジョン【初級】',
    recommendedLevel: 20,
    normalEnemies: [
      { name: 'トレジャースライム', hp: 420,  maxHp: 420,  attack: 158, defense: 62,  expReward: 195 },
      { name: 'コイン番兵',         hp: 490,  maxHp: 490,  attack: 166, defense: 72,  expReward: 200 },
      { name: '金貨の亡霊',         hp: 370,  maxHp: 370,  attack: 172, defense: 55,  expReward: 192 },
    ],
    rareEnemy: { name: 'チケットドラゴン', hp: 2400, maxHp: 2400, attack: 268, defense: 140, expReward: 420 },
    boss:      { name: 'チケット番人',     hp: 2600, maxHp: 2600, attack: 278, defense: 148, expReward: 1350 },
    rareChance:           0.05,
    normalTicketDropRate: 0.01,
    bossTicketDropRate:   0.30,
    ticketDragonDrop:     1,
  },

  /* ──────────────────────────────────────────
     中級（推奨 Lv 30）
     ────────────────────────────────────────── */
  intermediate: {
    name: 'チケットダンジョン【中級】',
    recommendedLevel: 30,
    normalEnemies: [
      { name: 'シルバースライム', hp: 760,  maxHp: 760,  attack: 270, defense: 108, expReward: 385 },
      { name: 'チケット守衛',     hp: 880,  maxHp: 880,  attack: 258, defense: 122, expReward: 390 },
      { name: '宝の番兵',         hp: 670,  maxHp: 670,  attack: 285, defense: 96,  expReward: 382 },
    ],
    rareEnemy: { name: 'チケットドラゴン', hp: 3900, maxHp: 3900, attack: 400, defense: 212, expReward: 760 },
    boss:      { name: 'チケット大番人',   hp: 4100, maxHp: 4100, attack: 415, defense: 220, expReward: 2300 },
    rareChance:           0.05,
    normalTicketDropRate: 0.02,
    bossTicketDropRate:   0.50,
    ticketDragonDrop:     2,
  },

  /* ──────────────────────────────────────────
     上級（推奨 Lv 50）
     ────────────────────────────────────────── */
  advanced: {
    name: 'チケットダンジョン【上級】',
    recommendedLevel: 50,
    normalEnemies: [
      { name: '幻のスライム', hp: 1900, maxHp: 1900, attack: 620, defense: 278, expReward: 1060 },
      { name: '混沌の守銭奴', hp: 2050, maxHp: 2050, attack: 598, defense: 298, expReward: 1065 },
      { name: '虚無の財宝番', hp: 1750, maxHp: 1750, attack: 648, defense: 260, expReward: 1055 },
    ],
    rareEnemy: { name: 'チケットドラゴン',   hp: 9800,  maxHp: 9800,  attack: 870, defense: 458, expReward: 2100 },
    boss:      { name: '伝説のチケット番人', hp: 10500, maxHp: 10500, attack: 900, defense: 475, expReward: 6500 },
    rareChance:           0.05,
    normalTicketDropRate: 0.03,
    bossTicketDropRate:   1.00,
    ticketDragonDrop:     3,
  },
};

/** ガチャチケダンジョンの討伐数 */
const GACHA_DUNGEON_ENEMY_COUNT = 30;


/* ==============================================================
   XPダンジョン定義
   ============================================================== */

/**
 * XPダンジョン難易度別定義
 * エメラルド系モンスターが出現する経験値特化ダンジョン
 * 通常モンEXP: 推奨Lv帯レアモンの2倍程度
 * ボスEXP: 通常の10倍 / レアボスEXP: 通常の30倍
 */
const XP_DUNGEON_DEFINITIONS = {
  /* 初級（推奨 Lv 20） */
  beginner: {
    name: 'XPダンジョン【初級】',
    recommendedLevel: 20,
    normalEnemies: [
      { name: 'エメラルドスライム',  hp: 430, maxHp: 430, attack: 160, defense: 64,  expReward: 840 },
      { name: 'エメラルドゴーレム',  hp: 510, maxHp: 510, attack: 153, defense: 78,  expReward: 860 },
      { name: 'エメラルドウォーム',  hp: 370, maxHp: 370, attack: 170, defense: 55,  expReward: 820 },
    ],
    normalExpReward: 840,
    rareChance:      0.15,
    rareEnemy: { name: 'エメラルドゴースト', hp: 500, maxHp: 500, attack: 225, defense: 95,  expReward: 1680 },
    boss:      { name: 'エメラルドガーディアン', hp: 2400, maxHp: 2400, attack: 260, defense: 135, expReward: 8400 },
    rareBoss:  { name: 'エメラルドキング',     hp: 3200, maxHp: 3200, attack: 300, defense: 155, expReward: 25200 },
    rareBossChance: 0.15,
  },
  /* 中級（推奨 Lv 30） */
  intermediate: {
    name: 'XPダンジョン【中級】',
    recommendedLevel: 30,
    normalEnemies: [
      { name: 'エメラルドサーペント',   hp: 800, maxHp: 800, attack: 272, defense: 110, expReward: 1480 },
      { name: 'エメラルドドレイク',     hp: 920, maxHp: 920, attack: 260, defense: 126, expReward: 1500 },
      { name: 'エメラルドウィッチ',     hp: 700, maxHp: 700, attack: 292, defense: 98,  expReward: 1460 },
    ],
    normalExpReward: 1480,
    rareChance:      0.15,
    rareEnemy: { name: 'エメラルドデビル', hp: 860, maxHp: 860, attack: 380, defense: 156, expReward: 2960 },
    boss:      { name: 'エメラルドデーモン',   hp: 4000, maxHp: 4000, attack: 416, defense: 218, expReward: 14800 },
    rareBoss:  { name: 'エメラルドエンペラー', hp: 5200, maxHp: 5200, attack: 480, defense: 248, expReward: 44400 },
    rareBossChance: 0.15,
  },
  /* 上級（推奨 Lv 50） */
  advanced: {
    name: 'XPダンジョン【上級】',
    recommendedLevel: 50,
    normalEnemies: [
      { name: 'エメラルドコロッサス',    hp: 1900, maxHp: 1900, attack: 622, defense: 280, expReward: 4100 },
      { name: 'エメラルドドラゴン',      hp: 2060, maxHp: 2060, attack: 600, defense: 300, expReward: 4120 },
      { name: 'エメラルドレヴィアタン',  hp: 1750, maxHp: 1750, attack: 650, defense: 262, expReward: 4060 },
    ],
    normalExpReward: 4100,
    rareChance:      0.15,
    rareEnemy: { name: 'エメラルドリッチ',     hp: 1960, maxHp: 1960, attack: 832, defense: 365, expReward: 8200 },
    boss:      { name: 'エメラルドゴッド',      hp: 9600, maxHp: 9600, attack: 890, defense: 465, expReward: 41000 },
    rareBoss:  { name: 'エメラルドオーバーロード', hp: 12000, maxHp: 12000, attack: 1020, defense: 530, expReward: 123000 },
    rareBossChance: 0.15,
  },
};

/** XPダンジョンの討伐数 */
const XP_DUNGEON_ENEMY_COUNT = 30;

/* ==============================================================
   レアモンダンジョン定義
   ============================================================== */

/**
 * レアモンダンジョン難易度別定義（A〜D）
 * 対応ダンジョンのレアモン＋ボスが出現する素材収集特化ダンジョン
 * 通常枠: レアモン90% / ボス10%
 * 30体目: 対応3ダンジョンのボスからランダム1体（均等）
 */
const RAREMON_DUNGEON_DEFINITIONS = {
  /* A: D1〜D3（推奨 Lv D3より少し上 = Lv 10） */
  A: {
    name: 'レアモンダンジョン【A】',
    recommendedLevel: 10,
    dungeonIds: [1, 2, 3],
  },
  /* B: D4〜D6（推奨 Lv D6より少し上 = Lv 21） */
  B: {
    name: 'レアモンダンジョン【B】',
    recommendedLevel: 21,
    dungeonIds: [4, 5, 6],
  },
  /* C: D7〜D9（推奨 Lv D9より少し上 = Lv 35） */
  C: {
    name: 'レアモンダンジョン【C】',
    recommendedLevel: 35,
    dungeonIds: [7, 8, 9],
  },
  /* D: D10〜D12（推奨 Lv D12より少し上 = Lv 50） */
  D: {
    name: 'レアモンダンジョン【D】',
    recommendedLevel: 50,
    dungeonIds: [10, 11, 12],
  },
};

/** レアモンダンジョンの討伐数 */
const RAREMON_DUNGEON_ENEMY_COUNT = 30;

/** レアモンスター出現率（通常枠） */
const RAREMON_DUNGEON_RARE_CHANCE = 0.90;

/* ==============================================================
   スキルダンジョン定義
   ============================================================== */

/**
 * スキルダンジョン難易度別定義
 * スキルストーンを入手できるダンジョン
 */
const SKILL_DUNGEON_DEFINITIONS = {
  /* 初級（推奨 Lv 20） */
  beginner: {
    name: 'スキルダンジョン【初級】',
    recommendedLevel: 20,
    normalEnemies: [
      { name: 'スペルキャスター',  hp: 440, maxHp: 440, attack: 162, defense: 66,  expReward: 0 },
      { name: 'ルーンウォーリアー', hp: 500, maxHp: 500, attack: 155, defense: 75,  expReward: 0 },
      { name: 'マジックドール',    hp: 380, maxHp: 380, attack: 172, defense: 57,  expReward: 0 },
    ],
    rareChance:       0.05,
    rareEnemy: { name: 'スペルマスター',    hp: 520, maxHp: 520, attack: 228, defense: 97, expReward: 0 },
    boss:      { name: 'スキルストーン番人', hp: 2500, maxHp: 2500, attack: 262, defense: 138, expReward: 0 },
    normalDropRate: 0.005,
    rareDropRate:   0.10,
    bossDropRate:   0.30,
  },
  /* 中級（推奨 Lv 30） */
  intermediate: {
    name: 'スキルダンジョン【中級】',
    recommendedLevel: 30,
    normalEnemies: [
      { name: 'グリモワール番兵',    hp: 810, maxHp: 810, attack: 274, defense: 112, expReward: 0 },
      { name: 'スキルイーター',      hp: 930, maxHp: 930, attack: 262, defense: 128, expReward: 0 },
      { name: 'エンチャントゴーレム', hp: 710, maxHp: 710, attack: 294, defense: 100, expReward: 0 },
    ],
    rareChance:       0.05,
    rareEnemy: { name: 'グリモワール守護者', hp: 870, maxHp: 870, attack: 384, defense: 158, expReward: 0 },
    boss:      { name: 'スキルストーン大番人', hp: 4100, maxHp: 4100, attack: 418, defense: 222, expReward: 0 },
    normalDropRate: 0.01,
    rareDropRate:   0.30,
    bossDropRate:   0.50,
  },
  /* 上級（推奨 Lv 50） */
  advanced: {
    name: 'スキルダンジョン【上級】',
    recommendedLevel: 50,
    normalEnemies: [
      { name: 'スキルクロマー',   hp: 1920, maxHp: 1920, attack: 625, defense: 282, expReward: 0 },
      { name: 'ラストスペル',     hp: 2070, maxHp: 2070, attack: 602, defense: 302, expReward: 0 },
      { name: 'ソウルハーベスター', hp: 1770, maxHp: 1770, attack: 652, defense: 265, expReward: 0 },
    ],
    rareChance:       0.05,
    rareEnemy: { name: 'スキルロード',        hp: 1980, maxHp: 1980, attack: 836, defense: 368, expReward: 0 },
    boss:      { name: '伝説のスキルストーン番人', hp: 10000, maxHp: 10000, attack: 895, defense: 468, expReward: 0 },
    normalDropRate: 0.02,
    rareDropRate:   0.50,
    bossDropRate:   1.00,
  },
};

/** スキルダンジョンの討伐数 */
const SKILL_DUNGEON_ENEMY_COUNT = 30;

/** スキルストーンのアイテム名 */
const SKILL_STONE_NAME = 'スキルストーン';

