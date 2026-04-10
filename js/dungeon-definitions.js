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


  /* ── D13〜D24 通常ダンジョン ──────────────────────────── */

  /* ────────────────────────────────────────
     ダンジョン 13: 神々の試練場（推奨 Lv 52〜）
     ──────────────────────────────────────── */
  {
    id: 13,
    name: '神々の試練場',
    recommendedLevel: 52,
    normalEnemies: [
      { name: '試練の守護獣', hp: 2202, maxHp: 2202, attack: 726, defense: 327, expReward: 1250 },
      { name: '神話の戦士', hp: 2380, maxHp: 2380, attack: 696, defense: 351, expReward: 1261 },
      { name: '神の試練体', hp: 2023, maxHp: 2023, attack: 762, defense: 307, expReward: 1238 },
    ],
    rareEnemy: { name: '試練の番神', hp: 2320, maxHp: 2320, attack: 982, defense: 428, expReward: 2440 },
    boss: { name: '試練神ラシオン', hp: 11305, maxHp: 11305, attack: 1047, defense: 547, expReward: 7140 },
    rareChance: 0.15,
    drops: {
      common:           '神々の試練石',
      commonDropRate:    0.50,
      rares:            ['神話の羽根', '試練の結晶'],
      rareDropRate:      0.75,
      boss:             '試練神の心臓',
      bossDropRate:      0.25,
      bossRare:         '神々の加護',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 14: 永劫の氷獄（推奨 Lv 58〜）
     ──────────────────────────────────────── */
  {
    id: 14,
    name: '永劫の氷獄',
    recommendedLevel: 58,
    normalEnemies: [
      { name: '氷獄の凍死者', hp: 2620, maxHp: 2620, attack: 864, defense: 389, expReward: 1487 },
      { name: 'ニブルヘイムの霜精', hp: 2832, maxHp: 2832, attack: 828, defense: 418, expReward: 1501 },
      { name: '永劫の氷剣士', hp: 2407, maxHp: 2407, attack: 906, defense: 365, expReward: 1473 },
    ],
    rareEnemy: { name: '氷獄の封印者', hp: 2761, maxHp: 2761, attack: 1168, defense: 510, expReward: 2903 },
    boss: { name: '氷獄神フィンブル', hp: 13453, maxHp: 13453, attack: 1246, defense: 651, expReward: 8497 },
    rareChance: 0.15,
    drops: {
      common:           '永劫の氷塊',
      commonDropRate:    0.50,
      rares:            ['ニブルヘイムの氷晶', '氷獄の破片'],
      rareDropRate:      0.75,
      boss:             '氷獄番人の核',
      bossDropRate:      0.25,
      bossRare:         '永劫の凍結核',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 15: 業火の煉獄（推奨 Lv 64〜）
     ──────────────────────────────────────── */
  {
    id: 15,
    name: '業火の煉獄',
    recommendedLevel: 64,
    normalEnemies: [
      { name: '煉獄の炎鬼', hp: 3118, maxHp: 3118, attack: 1028, defense: 463, expReward: 1769 },
      { name: '業火の焦炎使', hp: 3370, maxHp: 3370, attack: 986, defense: 497, expReward: 1786 },
      { name: '地獄の炎番', hp: 2865, maxHp: 2865, attack: 1079, defense: 435, expReward: 1753 },
    ],
    rareEnemy: { name: '煉獄の主', hp: 3286, maxHp: 3286, attack: 1390, defense: 607, expReward: 3455 },
    boss: { name: '煉獄神プロメ', hp: 16009, maxHp: 16009, attack: 1483, defense: 775, expReward: 10111 },
    rareChance: 0.15,
    drops: {
      common:           '煉獄の炎石',
      commonDropRate:    0.50,
      rares:            ['業火の灰', '煉獄の魔核'],
      rareDropRate:      0.75,
      boss:             '炎獄番人の炎核',
      bossDropRate:      0.25,
      bossRare:         '業火の意志',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 16: 冥界の回廊（推奨 Lv 70〜）
     ──────────────────────────────────────── */
  {
    id: 16,
    name: '冥界の回廊',
    recommendedLevel: 70,
    normalEnemies: [
      { name: '冥界の亡者', hp: 3710, maxHp: 3710, attack: 1223, defense: 551, expReward: 2106 },
      { name: '死の回廊の番人', hp: 4011, maxHp: 4011, attack: 1173, defense: 592, expReward: 2126 },
      { name: '黒衣の死霊', hp: 3409, maxHp: 3409, attack: 1283, defense: 517, expReward: 2086 },
    ],
    rareEnemy: { name: '冥王の使者', hp: 3910, maxHp: 3910, attack: 1654, defense: 722, expReward: 4111 },
    boss: { name: '冥界神ハデル', hp: 19051, maxHp: 19051, attack: 1765, defense: 922, expReward: 12032 },
    rareChance: 0.15,
    drops: {
      common:           '冥界の黒晶',
      commonDropRate:    0.50,
      rares:            ['亡者の涙', '冥王の破片'],
      rareDropRate:      0.75,
      boss:             '冥界の扉の鍵',
      bossDropRate:      0.25,
      bossRare:         '冥王の魂石',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 17: 神域の迷宮（推奨 Lv 76〜）
     ──────────────────────────────────────── */
  {
    id: 17,
    name: '神域の迷宮',
    recommendedLevel: 76,
    normalEnemies: [
      { name: '神域の迷宮番人', hp: 4415, maxHp: 4415, attack: 1456, defense: 656, expReward: 2506 },
      { name: '聖域の魔物', hp: 4773, maxHp: 4773, attack: 1396, defense: 704, expReward: 2530 },
      { name: '神の使徒', hp: 4057, maxHp: 4057, attack: 1527, defense: 616, expReward: 2482 },
    ],
    rareEnemy: { name: '神域の守護者', hp: 4653, maxHp: 4653, attack: 1969, defense: 859, expReward: 4892 },
    boss: { name: '神域神レイオス', hp: 22670, maxHp: 22670, attack: 2100, defense: 1098, expReward: 14318 },
    rareChance: 0.15,
    drops: {
      common:           '神域の聖石',
      commonDropRate:    0.50,
      rares:            ['神域の羽衣', '聖域の魔法陣'],
      rareDropRate:      0.75,
      boss:             '神域番人の核',
      bossDropRate:      0.25,
      bossRare:         '神域の威光',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 18: 天上の聖域（推奨 Lv 82〜）
     ──────────────────────────────────────── */
  {
    id: 18,
    name: '天上の聖域',
    recommendedLevel: 82,
    normalEnemies: [
      { name: '天上の光天使', hp: 5254, maxHp: 5254, attack: 1732, defense: 781, expReward: 2982 },
      { name: '聖域の守護騎士', hp: 5680, maxHp: 5680, attack: 1661, defense: 838, expReward: 3010 },
      { name: '天界の光精霊', hp: 4828, maxHp: 4828, attack: 1817, defense: 733, expReward: 2953 },
    ],
    rareEnemy: { name: '天上の聖典守護者', hp: 5538, maxHp: 5538, attack: 2343, defense: 1022, expReward: 5822 },
    boss: { name: '天上神ルシエル', hp: 26978, maxHp: 26978, attack: 2499, defense: 1306, expReward: 17039 },
    rareChance: 0.15,
    drops: {
      common:           '天上の光晶',
      commonDropRate:    0.50,
      rares:            ['天使の翼', '聖域の光核'],
      rareDropRate:      0.75,
      boss:             '聖域守護者の心臓',
      bossDropRate:      0.25,
      bossRare:         '天上の祝福',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 19: 虚無の断層（推奨 Lv 88〜）
     ──────────────────────────────────────── */
  {
    id: 19,
    name: '虚無の断層',
    recommendedLevel: 88,
    normalEnemies: [
      { name: '虚無の断層体', hp: 6252, maxHp: 6252, attack: 2061, defense: 929, expReward: 3548 },
      { name: '消滅の魔人', hp: 6759, maxHp: 6759, attack: 1977, defense: 997, expReward: 3582 },
      { name: '断層の侵食者', hp: 5745, maxHp: 5745, attack: 2163, defense: 872, expReward: 3514 },
    ],
    rareEnemy: { name: '虚無の消滅使', hp: 6590, maxHp: 6590, attack: 2788, defense: 1217, expReward: 6928 },
    boss: { name: '虚無神ニヒル', hp: 32103, maxHp: 32103, attack: 2974, defense: 1554, expReward: 20276 },
    rareChance: 0.15,
    drops: {
      common:           '虚無の断層石',
      commonDropRate:    0.50,
      rares:            ['消滅の核', '断層の破片'],
      rareDropRate:      0.75,
      boss:             '断層番人の核',
      bossDropRate:      0.25,
      bossRare:         '虚無の消滅核',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 20: 時の終焉（推奨 Lv 94〜）
     ──────────────────────────────────────── */
  {
    id: 20,
    name: '時の終焉',
    recommendedLevel: 94,
    normalEnemies: [
      { name: '時崩の番人', hp: 7440, maxHp: 7440, attack: 2453, defense: 1106, expReward: 4222 },
      { name: '終焉の時計守', hp: 8043, maxHp: 8043, attack: 2353, defense: 1186, expReward: 4263 },
      { name: '崩壊の時間魔', hp: 6836, maxHp: 6836, attack: 2574, defense: 1038, expReward: 4182 },
    ],
    rareEnemy: { name: '終焉の時神使', hp: 7842, maxHp: 7842, attack: 3318, defense: 1448, expReward: 8244 },
    boss: { name: '終焉神テルミナ', hp: 38203, maxHp: 38203, attack: 3539, defense: 1850, expReward: 24128 },
    rareChance: 0.15,
    drops: {
      common:           '崩壊の時計石',
      commonDropRate:    0.50,
      rares:            ['終焉の砂時計', '時崩の破片'],
      rareDropRate:      0.75,
      boss:             '終焉番人の核',
      bossDropRate:      0.25,
      bossRare:         '時の終焉の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 21: 創世の地（推奨 Lv 110〜）
     ──────────────────────────────────────── */
  {
    id: 21,
    name: '創世の地',
    recommendedLevel: 110,
    normalEnemies: [
      { name: '原初の光体', hp: 8853, maxHp: 8853, attack: 2919, defense: 1316, expReward: 5025 },
      { name: '創世の魔物', hp: 9571, maxHp: 9571, attack: 2799, defense: 1412, expReward: 5073 },
      { name: '宇宙誕生の精霊', hp: 8135, maxHp: 8135, attack: 3063, defense: 1235, expReward: 4977 },
    ],
    rareEnemy: { name: '原初の神格体', hp: 9332, maxHp: 9332, attack: 3948, defense: 1723, expReward: 9810 },
    boss: { name: '創世神ゲネシス', hp: 45462, maxHp: 45462, attack: 4211, defense: 2201, expReward: 28713 },
    rareChance: 0.15,
    drops: {
      common:           '創世の原子',
      commonDropRate:    0.50,
      rares:            ['宇宙誕生の光', '原初の魔核'],
      rareDropRate:      0.75,
      boss:             '創世神の結晶',
      bossDropRate:      0.25,
      bossRare:         '宇宙の始まりの欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 22: 魂の審判場（推奨 Lv 130〜）
     ──────────────────────────────────────── */
  {
    id: 22,
    name: '魂の審判場',
    recommendedLevel: 130,
    normalEnemies: [
      { name: '審判の魂鬼', hp: 10535, maxHp: 10535, attack: 3474, defense: 1566, expReward: 5979 },
      { name: '次元の断罪者', hp: 11389, maxHp: 11389, attack: 3331, defense: 1680, expReward: 6036 },
      { name: '魂の審判体', hp: 9681, maxHp: 9681, attack: 3645, defense: 1469, expReward: 5922 },
    ],
    rareEnemy: { name: '審判の主神使', hp: 11105, maxHp: 11105, attack: 4698, defense: 2050, expReward: 11674 },
    boss: { name: '審判神ジャッジメント', hp: 54099, maxHp: 54099, attack: 5011, defense: 2620, expReward: 34168 },
    rareChance: 0.15,
    drops: {
      common:           '審判の結晶石',
      commonDropRate:    0.50,
      rares:            ['次元の魂片', '審判の炎核'],
      rareDropRate:      0.75,
      boss:             '審判神の証',
      bossDropRate:      0.25,
      bossRare:         '魂の審判印',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 23: 神域の頂（推奨 Lv 160〜）
     ──────────────────────────────────────── */
  {
    id: 23,
    name: '神域の頂',
    recommendedLevel: 160,
    normalEnemies: [
      { name: '頂の神格体', hp: 12537, maxHp: 12537, attack: 4134, defense: 1864, expReward: 7116 },
      { name: '全次元の頂神兵', hp: 13553, maxHp: 13553, attack: 3964, defense: 1999, expReward: 7183 },
      { name: '神域の頂点守', hp: 11520, maxHp: 11520, attack: 4337, defense: 1748, expReward: 7048 },
    ],
    rareEnemy: { name: '頂点の神格使', hp: 13215, maxHp: 13215, attack: 5591, defense: 2440, expReward: 13892 },
    boss: { name: '頂神オムニコス', hp: 64378, maxHp: 64378, attack: 5963, defense: 3117, expReward: 40660 },
    rareChance: 0.15,
    drops: {
      common:           '頂の神聖核',
      commonDropRate:    0.50,
      rares:            ['全次元の光片', '頂点の結晶'],
      rareDropRate:      0.75,
      boss:             '頂神の心臓',
      bossDropRate:      0.25,
      bossRare:         '神域の頂の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 24: 絶対なる混沌（推奨 Lv 190〜）
     ──────────────────────────────────────── */
  {
    id: 24,
    name: '絶対なる混沌',
    recommendedLevel: 190,
    normalEnemies: [
      { name: '混沌絶対体', hp: 14919, maxHp: 14919, attack: 4919, defense: 2218, expReward: 8467 },
      { name: '終焉の混沌魔', hp: 16128, maxHp: 16128, attack: 4718, defense: 2379, expReward: 8548 },
      { name: '絶対の破壊神兵', hp: 13709, maxHp: 13709, attack: 5161, defense: 2081, expReward: 8387 },
    ],
    rareEnemy: { name: '混沌絶対の使', hp: 15725, maxHp: 15725, attack: 6653, defense: 2903, expReward: 16532 },
    boss: { name: '絶対神カオスロード・オメガ', hp: 180000, maxHp: 180000, attack: 12000, defense: 5800, expReward: 100000 },
    rareChance: 0.15,
    drops: {
      common:           '絶対混沌の核片',
      commonDropRate:    0.50,
      rares:            ['終焉の混沌核', '絶対の破壊石'],
      rareDropRate:      0.75,
      boss:             '混沌絶対神の証',
      bossDropRate:      0.25,
      bossRare:         '絶対なる混沌の力',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 25: 創造の揺籃（推奨 Lv 200〜）
     ──────────────────────────────────────── */
  {
    id: 25,
    name: '創造の揺籃',
    recommendedLevel: 200,
    normalEnemies: [
      { name: '揺籃の守護者', hp: 21600, maxHp: 21600, attack: 6370, defense: 2850, expReward: 11760 },
      { name: '原初の生命体', hp: 23000, maxHp: 23000, attack: 6695, defense: 3300, expReward: 12000 },
      { name: '創造の番人', hp: 18400, maxHp: 18400, attack: 6955, defense: 2700, expReward: 11640 },
    ],
    rareEnemy: { name: '揺籃の使者', hp: 22000, maxHp: 22000, attack: 7150, defense: 4500, expReward: 24000 },
    boss: { name: '創造神プリモルディア', hp: 250000, maxHp: 250000, attack: 15000, defense: 7000, expReward: 150000 },
    rareChance: 0.15,
    drops: {
      common:           '揺籃の創造石',
      commonDropRate:    0.50,
      rares:            ['原初の生命核', '創造の息吹'],
      rareDropRate:      0.75,
      boss:             '揺籃守護者の心臓',
      bossDropRate:      0.25,
      bossRare:         '創造の揺籃の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 26: 滅却の荒野（推奨 Lv 220〜）
     ──────────────────────────────────────── */
  {
    id: 26,
    name: '滅却の荒野',
    recommendedLevel: 220,
    normalEnemies: [
      { name: '滅却の荒者', hp: 28800, maxHp: 28800, attack: 7514, defense: 3484, expReward: 14374 },
      { name: '荒野の破壊兵', hp: 30667, maxHp: 30667, attack: 7893, defense: 4032, expReward: 14667 },
      { name: '滅却の魔将', hp: 24533, maxHp: 24533, attack: 8200, defense: 3300, expReward: 14213 },
    ],
    rareEnemy: { name: '滅却の使者', hp: 29333, maxHp: 29333, attack: 8233, defense: 5225, expReward: 28747 },
    boss: { name: '滅却神デバステーター', hp: 333333, maxHp: 333333, attack: 18333, defense: 8667, expReward: 183333 },
    rareChance: 0.15,
    drops: {
      common:           '滅却の荒野石',
      commonDropRate:    0.50,
      rares:            ['滅却の灰塵', '荒野の破滅核'],
      rareDropRate:      0.75,
      boss:             '滅却番人の証',
      bossDropRate:      0.25,
      bossRare:         '滅却の荒野の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 27: 虚空の迷宮（推奨 Lv 240〜）
     ──────────────────────────────────────── */
  {
    id: 27,
    name: '虚空の迷宮',
    recommendedLevel: 240,
    normalEnemies: [
      { name: '虚空の迷子', hp: 36000, maxHp: 36000, attack: 8656, defense: 4116, expReward: 16986 },
      { name: '迷宮の幻影', hp: 38333, maxHp: 38333, attack: 9091, defense: 4767, expReward: 17333 },
      { name: '虚空の番人', hp: 30667, maxHp: 30667, attack: 9445, defense: 3900, expReward: 16786 },
    ],
    rareEnemy: { name: '虚空の使者', hp: 36667, maxHp: 36667, attack: 9316, defense: 6175, expReward: 33973 },
    boss: { name: '虚空神ラビリンドラ', hp: 416667, maxHp: 416667, attack: 21667, defense: 10333, expReward: 216667 },
    rareChance: 0.15,
    drops: {
      common:           '虚空の迷宮石',
      commonDropRate:    0.50,
      rares:            ['虚空の断片', '迷宮の虚無核'],
      rareDropRate:      0.75,
      boss:             '虚空番人の心臓',
      bossDropRate:      0.25,
      bossRare:         '虚空の迷宮の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 28: 神話の戦場（推奨 Lv 260〜）
     ──────────────────────────────────────── */
  {
    id: 28,
    name: '神話の戦場',
    recommendedLevel: 260,
    normalEnemies: [
      { name: '神話の戦士', hp: 43200, maxHp: 43200, attack: 9800, defense: 4750, expReward: 19600 },
      { name: '戦場の英雄兵', hp: 46000, maxHp: 46000, attack: 10300, defense: 5500, expReward: 20000 },
      { name: '神話の将軍', hp: 36800, maxHp: 36800, attack: 10700, defense: 4500, expReward: 19400 },
    ],
    rareEnemy: { name: '神話の使者', hp: 44000, maxHp: 44000, attack: 11000, defense: 7500, expReward: 40000 },
    boss: { name: '神話神エピカロス', hp: 500000, maxHp: 500000, attack: 25000, defense: 12000, expReward: 250000 },
    rareChance: 0.15,
    drops: {
      common:           '神話の戦場石',
      commonDropRate:    0.50,
      rares:            ['神話の血晶', '戦場の英雄核'],
      rareDropRate:      0.75,
      boss:             '神話番人の証',
      bossDropRate:      0.25,
      bossRare:         '神話の戦場の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 29: 因果の螺旋（推奨 Lv 280〜）
     ──────────────────────────────────────── */
  {
    id: 29,
    name: '因果の螺旋',
    recommendedLevel: 280,
    normalEnemies: [
      { name: '因果の番人', hp: 59400, maxHp: 59400, attack: 12250, defense: 5938, expReward: 24500 },
      { name: '螺旋の運命体', hp: 63250, maxHp: 63250, attack: 12873, defense: 6875, expReward: 25000 },
      { name: '因果の魔将', hp: 50600, maxHp: 50600, attack: 13375, defense: 5625, expReward: 24250 },
    ],
    rareEnemy: { name: '因果の使者', hp: 60500, maxHp: 60500, attack: 13475, defense: 8906, expReward: 50000 },
    boss: { name: '因果神カウザリス', hp: 650000, maxHp: 650000, attack: 30000, defense: 14500, expReward: 325000 },
    rareChance: 0.15,
    drops: {
      common:           '因果の螺旋石',
      commonDropRate:    0.50,
      rares:            ['因果の結晶', '螺旋の運命核'],
      rareDropRate:      0.75,
      boss:             '因果守護者の心臓',
      bossDropRate:      0.25,
      bossRare:         '因果の螺旋の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 30: 永劫の試練（推奨 Lv 300〜）
     ──────────────────────────────────────── */
  {
    id: 30,
    name: '永劫の試練',
    recommendedLevel: 300,
    normalEnemies: [
      { name: '永劫の試練兵', hp: 75600, maxHp: 75600, attack: 14700, defense: 7125, expReward: 29400 },
      { name: '試練の守護者', hp: 80500, maxHp: 80500, attack: 15450, defense: 8250, expReward: 30000 },
      { name: '永劫の番人', hp: 64400, maxHp: 64400, attack: 16050, defense: 6750, expReward: 29100 },
    ],
    rareEnemy: { name: '永劫の使者', hp: 77000, maxHp: 77000, attack: 16500, defense: 11250, expReward: 60000 },
    boss: { name: '永劫神エターニア', hp: 800000, maxHp: 800000, attack: 35000, defense: 17000, expReward: 400000 },
    rareChance: 0.15,
    drops: {
      common:           '永劫の試練石',
      commonDropRate:    0.50,
      rares:            ['永劫の試練核', '試練の永久晶'],
      rareDropRate:      0.75,
      boss:             '永劫番人の証',
      bossDropRate:      0.25,
      bossRare:         '永劫の試練の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 31: 絶対零域（推奨 Lv 320〜）
     ──────────────────────────────────────── */
  {
    id: 31,
    name: '絶対零域',
    recommendedLevel: 320,
    normalEnemies: [
      { name: '零域の氷兵', hp: 102600, maxHp: 102600, attack: 18130, defense: 8788, expReward: 39200 },
      { name: '絶対零度の番人', hp: 109250, maxHp: 109250, attack: 19040, defense: 10175, expReward: 40000 },
      { name: '零域の魔将', hp: 87400, maxHp: 87400, attack: 19795, defense: 8325, expReward: 38800 },
    ],
    rareEnemy: { name: '零域の使者', hp: 104500, maxHp: 104500, attack: 19943, defense: 13181, expReward: 78400 },
    boss: { name: '零域神アブソリュート・フリーズ', hp: 1000000, maxHp: 1000000, attack: 42500, defense: 21000, expReward: 500000 },
    rareChance: 0.15,
    drops: {
      common:           '絶対零域の氷晶',
      commonDropRate:    0.50,
      rares:            ['絶対零度の核', '零域の永久氷'],
      rareDropRate:      0.75,
      boss:             '零域番人の心臓',
      bossDropRate:      0.25,
      bossRare:         '絶対零域の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 32: 天地崩壊（推奨 Lv 350〜）
     ──────────────────────────────────────── */
  {
    id: 32,
    name: '天地崩壊',
    recommendedLevel: 350,
    normalEnemies: [
      { name: '崩壊の天空兵', hp: 129600, maxHp: 129600, attack: 21560, defense: 10450, expReward: 49000 },
      { name: '大地崩壊の番人', hp: 138000, maxHp: 138000, attack: 22660, defense: 12100, expReward: 50000 },
      { name: '天地の魔将', hp: 110400, maxHp: 110400, attack: 23540, defense: 9900, expReward: 48500 },
    ],
    rareEnemy: { name: '崩壊の使者', hp: 132000, maxHp: 132000, attack: 24200, defense: 16500, expReward: 100000 },
    boss: { name: '崩壊神カタクリズマ', hp: 1200000, maxHp: 1200000, attack: 50000, defense: 25000, expReward: 600000 },
    rareChance: 0.15,
    drops: {
      common:           '天地崩壊の核片',
      commonDropRate:    0.50,
      rares:            ['崩壊の天空核', '大地崩壊の破片'],
      rareDropRate:      0.75,
      boss:             '天地崩壊番人の証',
      bossDropRate:      0.25,
      bossRare:         '天地崩壊の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 33: 無限の深淵（推奨 Lv 380〜）
     ──────────────────────────────────────── */
  {
    id: 33,
    name: '無限の深淵',
    recommendedLevel: 380,
    normalEnemies: [
      { name: '深淵の番人', hp: 172800, maxHp: 172800, attack: 27930, defense: 13300, expReward: 63700 },
      { name: '無限の奈落兵', hp: 184000, maxHp: 184000, attack: 29340, defense: 15400, expReward: 65000 },
      { name: '深淵の魔将', hp: 147200, maxHp: 147200, attack: 30480, defense: 12600, expReward: 63050 },
    ],
    rareEnemy: { name: '深淵の使者', hp: 176000, maxHp: 176000, attack: 30723, defense: 19950, expReward: 127400 },
    boss: { name: '深淵神インフィニ・アビス', hp: 1400000, maxHp: 1400000, attack: 52500, defense: 27500, expReward: 700000 },
    rareChance: 0.15,
    drops: {
      common:           '無限の深淵石',
      commonDropRate:    0.50,
      rares:            ['深淵の無限核', '無限の奈落晶'],
      rareDropRate:      0.75,
      boss:             '深淵番人の心臓',
      bossDropRate:      0.25,
      bossRare:         '無限の深淵の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 34: 神滅の地（推奨 Lv 420〜）
     ──────────────────────────────────────── */
  {
    id: 34,
    name: '神滅の地',
    recommendedLevel: 420,
    normalEnemies: [
      { name: '神滅の破壊兵', hp: 216000, maxHp: 216000, attack: 34300, defense: 16150, expReward: 78400 },
      { name: '滅神の番人', hp: 230000, maxHp: 230000, attack: 36050, defense: 18700, expReward: 80000 },
      { name: '神滅の魔将', hp: 184000, maxHp: 184000, attack: 37450, defense: 15300, expReward: 77600 },
    ],
    rareEnemy: { name: '神滅の使者', hp: 220000, maxHp: 220000, attack: 38500, defense: 25500, expReward: 160000 },
    boss: { name: '神滅神ゴッドスレイヤー', hp: 1600000, maxHp: 1600000, attack: 55000, defense: 30000, expReward: 800000 },
    rareChance: 0.15,
    drops: {
      common:           '神滅の地の核片',
      commonDropRate:    0.50,
      rares:            ['神滅の破壊核', '滅神の証明石'],
      rareDropRate:      0.75,
      boss:             '神滅番人の証',
      bossDropRate:      0.25,
      bossRare:         '神滅の地の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 35: 終焉の彼方（推奨 Lv 460〜）
     ──────────────────────────────────────── */
  {
    id: 35,
    name: '終焉の彼方',
    recommendedLevel: 460,
    normalEnemies: [
      { name: '終焉の番人', hp: 297000, maxHp: 297000, attack: 44100, defense: 20900, expReward: 98000 },
      { name: '彼方の終焉兵', hp: 316250, maxHp: 316250, attack: 46305, defense: 24200, expReward: 100000 },
      { name: '終焉の魔将', hp: 253000, maxHp: 253000, attack: 48070, defense: 19800, expReward: 97000 },
    ],
    rareEnemy: { name: '終焉の使者', hp: 302500, maxHp: 302500, attack: 49500, defense: 33000, expReward: 196000 },
    boss: { name: '終焉神エンドレス・オメガ', hp: 1800000, maxHp: 1800000, attack: 57500, defense: 32500, expReward: 900000 },
    rareChance: 0.15,
    drops: {
      common:           '終焉彼方の核片',
      commonDropRate:    0.50,
      rares:            ['彼方の終焉核', '終焉の彼方晶'],
      rareDropRate:      0.75,
      boss:             '終焉番人の心臓',
      bossDropRate:      0.25,
      bossRare:         '終焉の彼方の欠片',
      bossRareDropRate:  0.08,
    },
  },

  /* ────────────────────────────────────────
     ダンジョン 36: 絶対なる頂点（推奨 Lv 500〜）
     ──────────────────────────────────────── */
  {
    id: 36,
    name: '絶対なる頂点',
    recommendedLevel: 500,
    normalEnemies: [
      { name: '頂点の絶対兵', hp: 378000, maxHp: 378000, attack: 53900, defense: 25650, expReward: 117600 },
      { name: '絶対頂点の番人', hp: 402500, maxHp: 402500, attack: 56650, defense: 29700, expReward: 120000 },
      { name: '至高の魔将', hp: 322000, maxHp: 322000, attack: 58850, defense: 24300, expReward: 116400 },
    ],
    rareEnemy: { name: '頂点の使者', hp: 385000, maxHp: 385000, attack: 60500, defense: 40500, expReward: 240000 },
    boss: { name: '絶対頂点神アルティメット・ゼロ', hp: 2000000, maxHp: 2000000, attack: 60000, defense: 35000, expReward: 1000000 },
    rareChance: 0.15,
    drops: {
      common:           '絶対頂点の核片',
      commonDropRate:    0.50,
      rares:            ['頂点の絶対核', '絶対なる至高晶'],
      rareDropRate:      0.75,
      boss:             '絶対頂点神の証',
      bossDropRate:      0.25,
      bossRare:         '絶対なる頂点の欠片',
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

  /* ──────────────────────────────────────────
     超級（推奨 Lv 100）：チケット4枚確定
     ────────────────────────────────────────── */
  superAdvanced: {
    name: 'チケットダンジョン【超級】',
    recommendedLevel: 100,
    normalEnemies: [
      { name: '幻影のスライム',     hp: 9500,  maxHp: 9500,  attack: 3150, defense: 1420, expReward: 5400 },
      { name: '黄金の財宝番',       hp: 10200, maxHp: 10200, attack: 3020, defense: 1520, expReward: 5410 },
      { name: '混沌の守銭奴改',     hp: 8800,  maxHp: 8800,  attack: 3280, defense: 1320, expReward: 5390 },
    ],
    rareEnemy: { name: 'チケットドラゴン改', hp: 50000, maxHp: 50000, attack: 4400, defense: 2320, expReward: 10800 },
    boss:      { name: '超級チケット番人',   hp: 55000, maxHp: 55000, attack: 4600, defense: 2420, expReward: 33000 },
    rareChance:           0.05,
    normalTicketDropRate: 0.05,
    bossTicketDropRate:   1.00,
    ticketDragonDrop:     4,
  },

  /* ──────────────────────────────────────────
     超上級（推奨 Lv 200）：チケット5枚確定
     ────────────────────────────────────────── */
  superElite: {
    name: 'チケットダンジョン【超上級】',
    recommendedLevel: 200,
    normalEnemies: [
      { name: '絶対のスライム',     hp: 24000, maxHp: 24000, attack: 7800, defense: 3600, expReward: 13500 },
      { name: '究極の財宝番',       hp: 25500, maxHp: 25500, attack: 7500, defense: 3800, expReward: 13510 },
      { name: '終焉の守銭奴',       hp: 22500, maxHp: 22500, attack: 8100, defense: 3400, expReward: 13490 },
    ],
    rareEnemy: { name: '究極チケットドラゴン', hp: 120000, maxHp: 120000, attack: 11000, defense: 5800, expReward: 27000 },
    boss:      { name: '絶対チケット番人',     hp: 130000, maxHp: 130000, attack: 11500, defense: 6000, expReward: 82000 },
    rareChance:           0.05,
    normalTicketDropRate: 0.08,
    bossTicketDropRate:   1.00,
    ticketDragonDrop:     5,
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

  /* 超級（推奨 Lv 100） */
  superAdvanced: {
    name: 'XPダンジョン【超級】',
    recommendedLevel: 100,
    normalEnemies: [
      { name: 'エメラルドコングロマリット', hp: 9800,  maxHp: 9800,  attack: 3180, defense: 1440, expReward: 14400 },
      { name: 'エメラルドアークデーモン',   hp: 10500, maxHp: 10500, attack: 3050, defense: 1540, expReward: 14600 },
      { name: 'エメラルドグランドレイス',   hp: 9100,  maxHp: 9100,  attack: 3310, defense: 1340, expReward: 14200 },
    ],
    normalExpReward: 14400,
    rareChance:      0.15,
    rareEnemy: { name: 'エメラルドアルカナ',   hp: 10200, maxHp: 10200, attack: 4450, defense: 1950, expReward: 28800 },
    boss:      { name: 'エメラルドオメガ',     hp: 56000, maxHp: 56000, attack: 4700, defense: 2550, expReward: 144000 },
    rareBoss:  { name: 'エメラルドインフィニティ', hp: 70000, maxHp: 70000, attack: 5400, defense: 2850, expReward: 432000 },
    rareBossChance: 0.15,
  },
  /* 超上級（推奨 Lv 200） */
  superElite: {
    name: 'XPダンジョン【超上級】',
    recommendedLevel: 200,
    normalEnemies: [
      { name: 'エメラルド絶対体',     hp: 24500, maxHp: 24500, attack: 7900, defense: 3650, expReward: 100000 },
      { name: 'エメラルド終焉の使',   hp: 26000, maxHp: 26000, attack: 7600, defense: 3850, expReward: 102000 },
      { name: 'エメラルド混沌の核',   hp: 23000, maxHp: 23000, attack: 8200, defense: 3450, expReward: 98000 },
    ],
    normalExpReward: 100000,
    rareChance:      0.15,
    rareEnemy: { name: 'エメラルド絶対神使',     hp: 25500, maxHp: 25500, attack: 11200, defense: 4600, expReward: 200000 },
    boss:      { name: 'エメラルド絶対神',        hp: 155000, maxHp: 155000, attack: 12000, defense: 6100, expReward: 1000000 },
    rareBoss:  { name: 'エメラルド超越神',        hp: 200000, maxHp: 200000, attack: 14000, defense: 7200, expReward: 3000000 },
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

  /* E: D13〜D15（推奨 Lv 67） */
  E: {
    name: 'レアモンダンジョン【E】',
    recommendedLevel: 67,
    dungeonIds: [13, 14, 15],
  },
  /* F: D16〜D18（推奨 Lv 85） */
  F: {
    name: 'レアモンダンジョン【F】',
    recommendedLevel: 85,
    dungeonIds: [16, 17, 18],
  },
  /* G: D19〜D21（推奨 Lv 113） */
  G: {
    name: 'レアモンダンジョン【G】',
    recommendedLevel: 113,
    dungeonIds: [19, 20, 21],
  },
  /* H: D22〜D24（推奨 Lv 193） */
  H: {
    name: 'レアモンダンジョン【H】',
    recommendedLevel: 193,
    dungeonIds: [22, 23, 24],
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

  /* 超級（推奨 Lv 100） */
  superAdvanced: {
    name: 'スキルダンジョン【超級】',
    recommendedLevel: 100,
    normalEnemies: [
      { name: 'スキルデストロイヤー',   hp: 9600,  maxHp: 9600,  attack: 3200, defense: 1450, expReward: 0 },
      { name: 'ルーンクラッシャー',     hp: 10300, maxHp: 10300, attack: 3070, defense: 1550, expReward: 0 },
      { name: 'アンチスペルゴーレム',   hp: 8900,  maxHp: 8900,  attack: 3330, defense: 1350, expReward: 0 },
    ],
    rareChance:       0.05,
    rareEnemy: { name: 'スキルマスター改',       hp: 10100, maxHp: 10100, attack: 4480, defense: 1980, expReward: 0 },
    boss:      { name: '超級スキルストーン番人', hp: 58000, maxHp: 58000, attack: 4720, defense: 2550, expReward: 0 },
    normalDropRate: 0.04,
    rareDropRate:   0.80,
    bossDropRate:   1.00,
  },
  /* 超上級（推奨 Lv 200） */
  superElite: {
    name: 'スキルダンジョン【超上級】',
    recommendedLevel: 200,
    normalEnemies: [
      { name: 'スキル絶滅体',         hp: 24000, maxHp: 24000, attack: 7850, defense: 3620, expReward: 0 },
      { name: '終焉のスペルイーター',   hp: 25500, maxHp: 25500, attack: 7550, defense: 3820, expReward: 0 },
      { name: '混沌のエンチャンター',   hp: 22500, maxHp: 22500, attack: 8150, defense: 3420, expReward: 0 },
    ],
    rareChance:       0.05,
    rareEnemy: { name: '絶対スキルロード',            hp: 25000, maxHp: 25000, attack: 11150, defense: 4580, expReward: 0 },
    boss:      { name: '絶対なるスキルストーン番人', hp: 160000, maxHp: 160000, attack: 12100, defense: 6200, expReward: 0 },
    normalDropRate: 0.08,
    rareDropRate:   1.00,
    bossDropRate:   1.00,
  },
};

/** スキルダンジョンの討伐数 */
const SKILL_DUNGEON_ENEMY_COUNT = 30;

/** スキルストーンのアイテム名 */
const SKILL_STONE_NAME = 'スキルストーン';

