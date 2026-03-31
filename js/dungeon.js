'use strict';

/* ==============================================================
   ダンジョンシステム
   各ダンジョンの定義・進行管理・ドロップ処理
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
   ダンジョン画面の初期表示
   ============================================================== */

/** ダンジョン選択画面を描画する */
function renderDungeonSelect() {
  const list = document.getElementById('dungeon-list');
  list.innerHTML = '';

  DUNGEON_DEFINITIONS.forEach(dungeon => {
    const cleared = game.player.dungeonProgress[dungeon.id] === true;

    const item = document.createElement('div');
    item.className = 'dungeon-item';

    item.innerHTML = `
      <div class="dungeon-info">
        <span class="dungeon-name">${dungeon.name}</span>
        <span class="dungeon-meta">推奨 Lv ${dungeon.recommendedLevel}〜　${cleared ? '✅ クリア済み' : '　　　　　　'}</span>
      </div>
      <button class="dungeon-enter-btn" onclick="enterDungeon(${dungeon.id})">⚔ 挑戦する</button>
    `;
    list.appendChild(item);
  });
}

/* ==============================================================
   ダンジョン進行
   ============================================================== */

/**
 * ダンジョンに入る
 * @param {number} dungeonId - ダンジョン ID（1〜12）
 */
function enterDungeon(dungeonId) {
  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === dungeonId);
  if (!dungeon) return;

  // ダンジョン状態を初期化
  game.dungeon = {
    id:        dungeonId,
    enemyIndex: 0,
    materials: [],  // 今回のダンジョンで獲得した素材
  };

  // バトル画面に遷移する
  showScreen('battle');

  // 戦闘開始前に MP を最大値まで回復する
  game.player.mp = game.player.maxMp;

  startNextDungeonBattle();
}

/**
 * ダンジョン内で次の敵との戦闘を開始する
 */
function startNextDungeonBattle() {
  // ガチャチケダンジョンの場合は専用処理へ分岐する
  if (game.dungeon.isGachaDungeon) {
    startNextGachaDungeonBattle();
    return;
  }
  if (game.dungeon.isXpDungeon) {
    startNextXpDungeonBattle();
    return;
  }
  if (game.dungeon.isRaremonDungeon) {
    startNextRaremonDungeonBattle();
    return;
  }
  if (game.dungeon.isSkillDungeon) {
    startNextSkillDungeonBattle();
    return;
  }

  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === game.dungeon.id);
  if (!dungeon) return;

  const idx = game.dungeon.enemyIndex;  // 0〜14

  // 敵テンプレートを決定する
  let template;
  if (idx === DUNGEON_ENEMY_COUNT - 1) {
    // 15 体目はボス
    template = dungeon.boss;
    log('─'.repeat(40), 'special');
    log('💀 ボスが現れた！', 'special');
  } else {
    // チャーム効果: 対応ダンジョンではレアモンスター出現率2倍
    const effectiveRareChance = isCharmActiveForDungeon(dungeon.id)
      ? Math.min(1.0, dungeon.rareChance * 2)
      : dungeon.rareChance;

    // レア出現判定
    const isRare = Math.random() < effectiveRareChance;
    template = isRare ? dungeon.rareEnemy : pick(dungeon.normalEnemies);
    if (isRare) {
      log('✨ レアモンスターが現れた！', 'special');
    }
  }

  // 新しい Enemy インスタンスを生成
  game.enemy = new Enemy(
    template.name,
    template.hp,
    template.maxHp,
    template.attack,
    template.defense,
    template.expReward
  );

  game.state             = GameState.PLAYER_TURN;
  game.battleCount++;
  game.shieldActive      = null;
  game.enemyPoisoned     = null;
  game.playerAtkBuff     = null;
  game.enemyStunned      = false;
  game.enemyAtkDebuff    = null;
  game.playerRegen       = null;
  game.playerDelayedHeal = null;

  // 図鑑: 遭遇を記録する（勝敗・逃げを問わず）
  recordMonsterEncounter(game.enemy.name);

  clearLog();
  log(`=== ${dungeon.name} に入った！ 全 ${DUNGEON_ENEMY_COUNT} 体を倒せ！ ===`, 'special');
  // チャーム効果の発動通知（最初の戦闘時のみ）
  if (idx === 0 && isCharmActiveForDungeon(dungeon.id)) {
    const activeCharmId  = game.player.equipment['チャーム'];
    const activeCharmDef = EQUIPMENT_DEFINITIONS.find(e => e.id === activeCharmId);
    log(`🍀 ${activeCharmDef.name} の効果が発動中！レア/ボスレアドロップ2倍＆レアモンスター出現率2倍`, 'special');
  }
  updateDungeonInfo();
  log(`=== 戦闘 ${idx + 1} / ${DUNGEON_ENEMY_COUNT} ===`, 'special');
  log(`${game.enemy.name} が現れた！`, 'system');
  log('─'.repeat(40), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');

  renderPlayerStatus();
  renderEnemyStatus();
  setButtonsEnabled(true);
  showDungeonNav(false);
}

/**
 * ダンジョン進行ナビゲーション（次の敵へ / 撤退する）を表示する
 * @param {boolean} show
 * @param {boolean} isBossKill - ボスを倒した場合
 */
function showDungeonNav(show, isBossKill) {
  const panel      = document.getElementById('dungeon-nav-panel');
  const btnNext    = document.getElementById('btn-next-enemy');
  const btnRetreat = document.getElementById('btn-retreat');

  panel.style.display = show ? 'flex' : 'none';

  if (show) {
    if (isBossKill) {
      // ボス撃破 → ダンジョン完了
      btnNext.textContent    = '🏆 ロビーへ戻る';
      btnNext.onclick        = completeDungeon;
      btnRetreat.style.display = 'none';
    } else {
      btnNext.textContent      = '▶ 次の敵へ進む';
      btnNext.onclick          = startNextDungeonBattle;
      btnRetreat.style.display = 'inline-block';
      btnRetreat.onclick       = retreatFromDungeon;
    }
  }
}

/**
 * ダンジョン情報（何体目か）を更新する
 */
function updateDungeonInfo() {
  const el = document.getElementById('dungeon-info');
  if (!el) return;

  if (game.dungeon.isGachaDungeon) {
    const def = GACHA_DUNGEON_DEFINITIONS[game.dungeon.gachaDifficulty];
    if (!def) return;
    el.textContent =
      `📍 ${def.name}  [ ${game.dungeon.enemyIndex + 1} / ${GACHA_DUNGEON_ENEMY_COUNT} 体目 ]`;
    return;
  }
  if (game.dungeon.isXpDungeon) {
    const def = XP_DUNGEON_DEFINITIONS[game.dungeon.xpDifficulty];
    if (!def) return;
    el.textContent = `📍 ${def.name}  [ ${game.dungeon.enemyIndex + 1} / ${XP_DUNGEON_ENEMY_COUNT} 体目 ]`;
    return;
  }
  if (game.dungeon.isRaremonDungeon) {
    const def = RAREMON_DUNGEON_DEFINITIONS[game.dungeon.raremonVariant];
    if (!def) return;
    el.textContent = `📍 ${def.name}  [ ${game.dungeon.enemyIndex + 1} / ${RAREMON_DUNGEON_ENEMY_COUNT} 体目 ]`;
    return;
  }
  if (game.dungeon.isSkillDungeon) {
    const def = SKILL_DUNGEON_DEFINITIONS[game.dungeon.skillDifficulty];
    if (!def) return;
    el.textContent = `📍 ${def.name}  [ ${game.dungeon.enemyIndex + 1} / ${SKILL_DUNGEON_ENEMY_COUNT} 体目 ]`;
    return;
  }

  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === game.dungeon.id);
  if (!dungeon) return;
  el.textContent =
    `📍 ${dungeon.name}  [ ${game.dungeon.enemyIndex + 1} / ${DUNGEON_ENEMY_COUNT} 体目 ]`;
}

/* ==============================================================
   ドロップ処理
   ============================================================== */

/**
 * 現在のダンジョンに対してチャーム効果が発動しているか確認する
 * @param {number} dungeonId - ダンジョン ID
 * @returns {boolean} - チャームが有効な場合は true
 */
function isCharmActiveForDungeon(dungeonId) {
  const charmId  = game.player.equipment['チャーム'];
  if (!charmId) return false;
  const charmDef = EQUIPMENT_DEFINITIONS.find(e => e.id === charmId);
  return !!(charmDef && charmDef.charmDungeonId === dungeonId);
}

/**
 * 敵撃破時にドロップ素材を決定して game.dungeon.materials に追加する
 */
function processDrop() {
  // ガチャチケダンジョンの場合は専用のドロップ処理へ分岐する
  if (game.dungeon.isGachaDungeon) {
    processGachaDrop();
    return;
  }
  if (game.dungeon.isXpDungeon) {
    processXpDrop();
    return;
  }
  if (game.dungeon.isRaremonDungeon) {
    processRaremonDrop();
    return;
  }
  if (game.dungeon.isSkillDungeon) {
    processSkillDrop();
    return;
  }

  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === game.dungeon.id);
  if (!dungeon) return;

  const drops = dungeon.drops;
  const idx   = game.dungeon.enemyIndex;
  const isRareSpawn = game.enemy.name === dungeon.rareEnemy.name;
  const isBoss      = idx === DUNGEON_ENEMY_COUNT - 1;

  // チャーム効果: 対応ダンジョンではレア/ボスレアドロップ率2倍
  const charmActive = isCharmActiveForDungeon(dungeon.id);

  if (isBoss) {
    // ボス: ボスレアドロップ判定（別枠、最低確率）
    if (drops.bossRare) {
      const effectiveBossRareRate = charmActive
        ? Math.min(1.0, drops.bossRareDropRate * 2)
        : drops.bossRareDropRate;
      if (Math.random() < effectiveBossRareRate) {
        addDungeonMaterial(drops.bossRare);
        log(`🌟 ${drops.bossRare} を入手した！`, 'result');
      }
    }
    // ボス通常ドロップ判定
    const roll = Math.random();
    if (roll < drops.bossDropRate) {
      addDungeonMaterial(drops.boss);
      log(`💎 ${drops.boss} を入手した！`, 'result');
    } else {
      addDungeonMaterial(drops.common);
      log(`📦 ${drops.common} を入手した。`, 'result');
    }
  } else if (isRareSpawn) {
    // レア敵: 2種のレアからランダムに1つ選んで高確率でドロップ
    const effectiveRareDropRate = charmActive
      ? Math.min(1.0, drops.rareDropRate * 2)
      : drops.rareDropRate;
    const roll = Math.random();
    if (roll < effectiveRareDropRate) {
      const rareDrop = pick(drops.rares);
      addDungeonMaterial(rareDrop);
      log(`✨ ${rareDrop} を入手した！`, 'result');
    } else {
      addDungeonMaterial(drops.common);
      log(`📦 ${drops.common} を入手した。`, 'result');
    }
  } else {
    // 通常敵: commonDropRate の確率でコモン素材をドロップ（未設定の場合は確定ドロップ）
    if (Math.random() < (drops.commonDropRate ?? 1.0)) {
      addDungeonMaterial(drops.common);
      log(`📦 ${drops.common} を入手した。`, 'result');
    }
  }
}

/**
 * ダンジョン一時素材バッグに素材を追加する
 * @param {string} materialName
 */
function addDungeonMaterial(materialName) {
  const existing = game.dungeon.materials.find(m => m.name === materialName);
  if (existing) {
    existing.count++;
  } else {
    game.dungeon.materials.push({ name: materialName, count: 1 });
  }
  // 図鑑: アイテム解鎖を記録する
  recordItemUnlock(materialName);
}

/* ==============================================================
   ダンジョン完了 / 撤退 / 死亡
   ============================================================== */

/** ダンジョンクリア処理（ボス撃破後） */
function completeDungeon() {
  // 特殊ダンジョンの場合は専用のクリア処理へ分岐する
  if (game.dungeon.isGachaDungeon)    { completeGachaDungeon();   return; }
  if (game.dungeon.isXpDungeon)       { completeXpDungeon();      return; }
  if (game.dungeon.isRaremonDungeon)  { completeRaremonDungeon(); return; }
  if (game.dungeon.isSkillDungeon)    { completeSkillDungeon();   return; }

  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === game.dungeon.id);
  if (!dungeon) return;

  // クリア済みフラグを立てる
  game.player.dungeonProgress[dungeon.id] = true;

  // 獲得素材をプレイヤーのインベントリに移す
  transferDungeonMaterials();

  log('', 'system');
  log(`🏆 ${dungeon.name} をクリアした！`, 'special');
  log('獲得素材をインベントリに追加しました。', 'result');

  // ロビーに戻る際にHPとMPを全回復する
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  // ダンジョンクリア時に自動セーブ
  autoSave();

  showScreen('lobby');
  renderLobby();
}

/** 撤退処理 */
function retreatFromDungeon() {
  // 特殊ダンジョンの場合は専用の撤退処理へ分岐する
  if (game.dungeon.isGachaDungeon)   { retreatFromGachaDungeon();   return; }
  if (game.dungeon.isXpDungeon)      { retreatFromXpDungeon();      return; }
  if (game.dungeon.isRaremonDungeon) { retreatFromRaremonDungeon(); return; }
  if (game.dungeon.isSkillDungeon)   { retreatFromSkillDungeon();   return; }

  // 獲得素材をプレイヤーのインベントリに移す（撤退は持ち帰り可）
  transferDungeonMaterials();
  log('🚪 ダンジョンから撤退した。獲得素材を持ち帰った。', 'result');

  // ロビーに戻る際にHPとMPを全回復する
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  // 撤退時に自動セーブ
  autoSave();

  showScreen('lobby');
  renderLobby();
}

/**
 * 死亡によるダンジョン失敗処理
 * 獲得済み素材は全て失う
 */
function failDungeon() {
  game.dungeon.materials = [];

  if (game.dungeon.isGachaDungeon) {
    // ガチャチケダンジョン: 探索中のチケットは没収
    game.dungeon.ticketsEarned = 0;
    log('💀 探索中に獲得したガチャチケットをすべて失った…', 'enemy-action');
  } else if (game.dungeon.isXpDungeon) {
    game.dungeon.xpEarned = 0;
    log('💀 探索中に獲得したEXPをすべて失った…', 'enemy-action');
  } else if (game.dungeon.isSkillDungeon) {
    game.dungeon.skillStonesEarned = 0;
    log('💀 探索中に獲得したスキルストーンをすべて失った…', 'enemy-action');
  } else {
    log('💀 ダンジョン内で獲得した素材をすべて失った…', 'enemy-action');
  }

  // HPとMPを最大値で復活（デスペナルティなし）
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;
  renderPlayerStatus();

  // 死亡時に自動セーブ
  autoSave();

  showScreen('lobby');
  renderLobby();
}

/**
 * ダンジョン一時素材をプレイヤーのインベントリに移す
 */
function transferDungeonMaterials() {
  game.dungeon.materials.forEach(item => {
    if (!game.player.materials[item.name]) {
      game.player.materials[item.name] = 0;
    }
    game.player.materials[item.name] += item.count;
  });
  game.dungeon.materials = [];
}

/* ==============================================================
   ガチャチケダンジョン
   ============================================================== */

/**
 * ガチャチケダンジョンの難易度選択画面を描画する
 */
function renderGachaDungeonDifficultySelect() {
  const list = document.getElementById('gacha-dungeon-difficulty-list');
  if (!list) return;
  list.innerHTML = '';

  const difficulties = [
    { key: 'beginner',     label: '初級', icon: '🌱' },
    { key: 'intermediate', label: '中級', icon: '⚔' },
    { key: 'advanced',     label: '上級', icon: '🔥' },
  ];

  difficulties.forEach(({ key, label, icon }) => {
    const def = GACHA_DUNGEON_DEFINITIONS[key];
    const item = document.createElement('div');
    item.className = 'dungeon-item';
    item.innerHTML = `
      <div class="dungeon-info">
        <span class="dungeon-name">${icon} チケットダンジョン ${label}</span>
        <span class="dungeon-meta">
          推奨 Lv ${def.recommendedLevel}〜　全 ${GACHA_DUNGEON_ENEMY_COUNT} 体討伐
          　通常チケットドロップ: ${(def.normalTicketDropRate * 100).toFixed(0)}%
          　ボスドロップ: ${(def.bossTicketDropRate * 100).toFixed(0)}%
          　チケットドラゴン確定 ${def.ticketDragonDrop} 枚
        </span>
      </div>
      <button class="dungeon-enter-btn" onclick="enterGachaDungeon('${key}')">🎫 挑戦する</button>
    `;
    list.appendChild(item);
  });
}

/**
 * ガチャチケダンジョンに入る
 * @param {string} difficulty - 'beginner' | 'intermediate' | 'advanced'
 */
function enterGachaDungeon(difficulty) {
  const def = GACHA_DUNGEON_DEFINITIONS[difficulty];
  if (!def) return;

  // ガチャダンジョン状態を初期化
  game.dungeon = {
    id:             null,
    enemyIndex:     0,
    materials:      [],
    isGachaDungeon: true,
    gachaDifficulty: difficulty,
    ticketsEarned:  0,
  };

  showScreen('battle');

  // 入場時に MP を最大値まで回復する
  game.player.mp = game.player.maxMp;

  startNextDungeonBattle();
}

/**
 * ガチャチケダンジョン内で次の敵との戦闘を開始する
 */
function startNextGachaDungeonBattle() {
  const def = GACHA_DUNGEON_DEFINITIONS[game.dungeon.gachaDifficulty];
  if (!def) return;

  const idx = game.dungeon.enemyIndex;  // 0〜29

  let template;
  let isRareSpawn = false;

  if (idx === GACHA_DUNGEON_ENEMY_COUNT - 1) {
    // 30 体目はボス
    template = def.boss;
    log('─'.repeat(40), 'special');
    log('💀 ボスが現れた！', 'special');
  } else {
    // レアモンスター（チケットドラゴン）出現判定: 5%
    isRareSpawn = Math.random() < def.rareChance;
    template = isRareSpawn ? def.rareEnemy : pick(def.normalEnemies);
    if (isRareSpawn) {
      log('✨ チケットドラゴンが現れた！', 'special');
    }
  }

  game.enemy = new Enemy(
    template.name,
    template.hp,
    template.maxHp,
    template.attack,
    template.defense,
    template.expReward
  );

  game.state             = GameState.PLAYER_TURN;
  game.battleCount++;
  game.shieldActive      = null;
  game.enemyPoisoned     = null;
  game.playerAtkBuff     = null;
  game.enemyStunned      = false;
  game.enemyAtkDebuff    = null;
  game.playerRegen       = null;
  game.playerDelayedHeal = null;

  // 図鑑: 遭遇を記録する
  recordMonsterEncounter(game.enemy.name);

  clearLog();
  log(`=== ${def.name} ===`, 'special');
  log(`全 ${GACHA_DUNGEON_ENEMY_COUNT} 体を倒してクリアせよ！`, 'special');
  updateDungeonInfo();
  log(`=== 戦闘 ${idx + 1} / ${GACHA_DUNGEON_ENEMY_COUNT} ===`, 'special');
  log(`${game.enemy.name} が現れた！`, 'system');
  log('─'.repeat(40), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');

  renderPlayerStatus();
  renderEnemyStatus();
  setButtonsEnabled(true);
  showDungeonNav(false);
}

/**
 * ガチャチケダンジョンのドロップ処理
 * ドロップはガチャチケットのみ（素材はドロップしない）
 */
function processGachaDrop() {
  const def         = GACHA_DUNGEON_DEFINITIONS[game.dungeon.gachaDifficulty];
  if (!def) return;

  const idx          = game.dungeon.enemyIndex;
  const isBoss       = idx === GACHA_DUNGEON_ENEMY_COUNT - 1;
  const isTicketDragon = game.enemy.name === def.rareEnemy.name;

  if (isBoss) {
    // ボス: bossTicketDropRate の確率でチケットを1枚ドロップ
    if (Math.random() < def.bossTicketDropRate) {
      game.dungeon.ticketsEarned += 1;
      log(`🎫 ガチャチケット ×1 を入手した！（探索合計: ${game.dungeon.ticketsEarned} 枚）`, 'result');
    }
  } else if (isTicketDragon) {
    // チケットドラゴン: 確定ドロップ
    const drop = def.ticketDragonDrop;
    game.dungeon.ticketsEarned += drop;
    log(`🎫 チケットドラゴンからガチャチケット ×${drop} を入手した！（探索合計: ${game.dungeon.ticketsEarned} 枚）`, 'result');
  } else {
    // 通常敵: normalTicketDropRate の確率でチケットを1枚ドロップ
    if (Math.random() < def.normalTicketDropRate) {
      game.dungeon.ticketsEarned += 1;
      log(`🎫 ガチャチケット ×1 を入手した！（探索合計: ${game.dungeon.ticketsEarned} 枚）`, 'result');
    }
  }
}

/**
 * ガチャチケダンジョンクリア処理
 * クリア時のみ獲得チケットをセーブデータに加算する
 */
function completeGachaDungeon() {
  const def     = GACHA_DUNGEON_DEFINITIONS[game.dungeon.gachaDifficulty];
  const tickets = game.dungeon.ticketsEarned;

  // 獲得チケットをプレイヤーに加算する（クリア時のみ）
  game.player.gachaTickets = (game.player.gachaTickets || 0) + tickets;

  log('', 'system');
  log(`🏆 ${def ? def.name : 'チケットダンジョン'} をクリアした！`, 'special');
  log(`🎫 ガチャチケット ${tickets} 枚をインベントリに追加しました。`, 'result');

  // ロビーに戻る際にHPとMPを全回復する
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  // クリア時に自動セーブ
  autoSave();

  showScreen('lobby');
  renderLobby();
}

/**
 * ガチャチケダンジョンの撤退処理
 * 撤退時は探索中に獲得したチケットは没収される
 */
function retreatFromGachaDungeon() {
  // チケットは没収（セーブデータには反映しない）
  game.dungeon.ticketsEarned = 0;
  log('🚪 チケットダンジョンから撤退した。探索中に獲得したチケットは没収された。', 'result');

  // ロビーに戻る際にHPとMPを全回復する
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  // 撤退時に自動セーブ
  autoSave();

  showScreen('lobby');
  renderLobby();
}

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

/* ==============================================================
   共通ヘルパー
   ============================================================== */

/** 特殊ダンジョン（30体）かどうか確認する */
function isSpecialDungeon() {
  return !!(
    game.dungeon.isGachaDungeon   ||
    game.dungeon.isXpDungeon      ||
    game.dungeon.isRaremonDungeon ||
    game.dungeon.isSkillDungeon
  );
}

/* ==============================================================
   XPダンジョン
   ============================================================== */

/** XPダンジョン難易度選択画面を描画する */
function renderXpDungeonDifficultySelect() {
  const list = document.getElementById('xp-dungeon-difficulty-list');
  if (!list) return;
  list.innerHTML = '';

  const keyName  = 'XPダンジョンの鍵';
  const keyCount = (game.player.materials[keyName] || 0);

  const difficulties = [
    { key: 'beginner',     label: '初級', icon: '🌱' },
    { key: 'intermediate', label: '中級', icon: '⚔' },
    { key: 'advanced',     label: '上級', icon: '🔥' },
  ];

  difficulties.forEach(({ key, label, icon }) => {
    const def  = XP_DUNGEON_DEFINITIONS[key];
    const item = document.createElement('div');
    item.className = 'dungeon-item';
    item.innerHTML = `
      <div class="dungeon-info">
        <span class="dungeon-name">${icon} XPダンジョン ${label}</span>
        <span class="dungeon-meta">
          推奨 Lv ${def.recommendedLevel}〜　全 ${XP_DUNGEON_ENEMY_COUNT} 体討伐
          　通常 EXP: ${def.normalExpReward}　ボスEXP: ${def.normalExpReward * 10}　レアボスEXP: ${def.normalExpReward * 30}
          　レアモン出現率: ${(def.rareChance * 100).toFixed(0)}%
          　入場: XPダンジョンの鍵×1（所持: ${keyCount}）
        </span>
      </div>
      <button class="dungeon-enter-btn" ${keyCount < 1 ? 'disabled' : ''} onclick="enterXpDungeon('${key}')">✨ 挑戦する</button>
    `;
    list.appendChild(item);
  });
}

/**
 * XPダンジョンに入る
 * @param {string} difficulty - 'beginner' | 'intermediate' | 'advanced'
 */
function enterXpDungeon(difficulty) {
  const def = XP_DUNGEON_DEFINITIONS[difficulty];
  if (!def) return;

  const keyName = 'XPダンジョンの鍵';
  if ((game.player.materials[keyName] || 0) < 1) {
    log('❌ XPダンジョンの鍵が足りません。', 'system');
    return;
  }

  // 鍵を1枚消費する
  game.player.materials[keyName] -= 1;
  if (game.player.materials[keyName] <= 0) {
    delete game.player.materials[keyName];
  }

  // ダンジョン状態を初期化する
  game.dungeon = {
    id:           null,
    enemyIndex:   0,
    materials:    [],
    isXpDungeon:  true,
    xpDifficulty: difficulty,
    xpEarned:     0,
  };

  showScreen('battle');
  game.player.mp = game.player.maxMp;
  startNextDungeonBattle();
}

/** XPダンジョン内で次の戦闘を開始する */
function startNextXpDungeonBattle() {
  const def = XP_DUNGEON_DEFINITIONS[game.dungeon.xpDifficulty];
  if (!def) return;

  const idx = game.dungeon.enemyIndex;

  let template;

  if (idx === XP_DUNGEON_ENEMY_COUNT - 1) {
    // 30体目: 15%でレアボス、85%で通常ボス
    if (Math.random() < def.rareBossChance) {
      template = def.rareBoss;
      log('─'.repeat(40), 'special');
      log('💎 レアボスが現れた！', 'special');
    } else {
      template = def.boss;
      log('─'.repeat(40), 'special');
      log('💀 ボスが現れた！', 'special');
    }
  } else {
    const isRareSpawn = Math.random() < def.rareChance;
    template = isRareSpawn ? def.rareEnemy : pick(def.normalEnemies);
    if (isRareSpawn) {
      log('✨ レアモンスターが現れた！', 'special');
    }
  }

  game.enemy = new Enemy(
    template.name,
    template.hp,
    template.maxHp,
    template.attack,
    template.defense,
    template.expReward
  );

  game.state             = GameState.PLAYER_TURN;
  game.battleCount++;
  game.shieldActive      = null;
  game.enemyPoisoned     = null;
  game.playerAtkBuff     = null;
  game.enemyStunned      = false;
  game.enemyAtkDebuff    = null;
  game.playerRegen       = null;
  game.playerDelayedHeal = null;

  recordMonsterEncounter(game.enemy.name);

  clearLog();
  log(`=== ${def.name} ===`, 'special');
  log(`全 ${XP_DUNGEON_ENEMY_COUNT} 体を倒してクリアせよ！　クリア時のみEXPを獲得できます。`, 'special');
  updateDungeonInfo();
  log(`=== 戦闘 ${idx + 1} / ${XP_DUNGEON_ENEMY_COUNT} ===`, 'special');
  log(`${game.enemy.name} が現れた！`, 'system');
  log('─'.repeat(40), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');

  renderPlayerStatus();
  renderEnemyStatus();
  setButtonsEnabled(true);
  showDungeonNav(false);
}

/** XPダンジョンのドロップ処理（EXP積み立て） */
function processXpDrop() {
  const exp = game.enemy.expReward;
  game.dungeon.xpEarned += exp;
  log(`⬆ EXP +${exp}（XPダンジョン内：クリア時に獲得）　探索合計: ${game.dungeon.xpEarned}`, 'result');
}

/** XPダンジョンクリア処理 */
function completeXpDungeon() {
  const def = XP_DUNGEON_DEFINITIONS[game.dungeon.xpDifficulty];
  const xp  = game.dungeon.xpEarned;

  log('', 'system');
  log(`🏆 ${def ? def.name : 'XPダンジョン'} をクリアした！`, 'special');
  log(`⬆ EXP ${xp} をインベントリに追加しました。`, 'result');

  gainExp(xp);

  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  autoSave();
  showScreen('lobby');
  renderLobby();
}

/** XPダンジョンからの撤退処理 */
function retreatFromXpDungeon() {
  game.dungeon.xpEarned = 0;
  log('🚪 XPダンジョンから撤退した。探索中に獲得したEXPは没収された。', 'result');

  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  autoSave();
  showScreen('lobby');
  renderLobby();
}

/* ==============================================================
   レアモンダンジョン
   ============================================================== */

/** レアモンダンジョン選択画面を描画する */
function renderRaremonDungeonSelect() {
  const list = document.getElementById('raremon-dungeon-list');
  if (!list) return;
  list.innerHTML = '';

  const keyName  = 'レアモンダンジョンの鍵';
  const keyCount = (game.player.materials[keyName] || 0);

  const variants = [
    { key: 'A', icon: '🔵', desc: 'D1〜D3のレアモン・ボス' },
    { key: 'B', icon: '🟡', desc: 'D4〜D6のレアモン・ボス' },
    { key: 'C', icon: '🟠', desc: 'D7〜D9のレアモン・ボス' },
    { key: 'D', icon: '🔴', desc: 'D10〜D12のレアモン・ボス' },
  ];

  variants.forEach(({ key, icon, desc }) => {
    const def  = RAREMON_DUNGEON_DEFINITIONS[key];
    const item = document.createElement('div');
    item.className = 'dungeon-item';
    item.innerHTML = `
      <div class="dungeon-info">
        <span class="dungeon-name">${icon} レアモンダンジョン ${key}</span>
        <span class="dungeon-meta">
          推奨 Lv ${def.recommendedLevel}〜　全 ${RAREMON_DUNGEON_ENEMY_COUNT} 体討伐　${desc}
          　レアモン出現率: ${(RAREMON_DUNGEON_RARE_CHANCE * 100).toFixed(0)}%　ボス出現率: ${((1 - RAREMON_DUNGEON_RARE_CHANCE) * 100).toFixed(0)}%
          　入場: レアモンダンジョンの鍵×1（所持: ${keyCount}）
        </span>
      </div>
      <button class="dungeon-enter-btn" ${keyCount < 1 ? 'disabled' : ''} onclick="enterRaremonDungeon('${key}')">💎 挑戦する</button>
    `;
    list.appendChild(item);
  });
}

/**
 * レアモンダンジョンに入る
 * @param {string} variant - 'A' | 'B' | 'C' | 'D'
 */
function enterRaremonDungeon(variant) {
  const def = RAREMON_DUNGEON_DEFINITIONS[variant];
  if (!def) return;

  const keyName = 'レアモンダンジョンの鍵';
  if ((game.player.materials[keyName] || 0) < 1) {
    log('❌ レアモンダンジョンの鍵が足りません。', 'system');
    return;
  }

  game.player.materials[keyName] -= 1;
  if (game.player.materials[keyName] <= 0) {
    delete game.player.materials[keyName];
  }

  game.dungeon = {
    id:               null,
    enemyIndex:       0,
    materials:        [],
    isRaremonDungeon: true,
    raremonVariant:   variant,
  };

  showScreen('battle');
  game.player.mp = game.player.maxMp;
  startNextDungeonBattle();
}

/** レアモンダンジョン内で次の戦闘を開始する */
function startNextRaremonDungeonBattle() {
  const def = RAREMON_DUNGEON_DEFINITIONS[game.dungeon.raremonVariant];
  if (!def) return;

  const idx            = game.dungeon.enemyIndex;
  const sourceDungeons = def.dungeonIds.map(id => DUNGEON_DEFINITIONS.find(d => d.id === id)).filter(Boolean);

  let template;

  if (idx === RAREMON_DUNGEON_ENEMY_COUNT - 1) {
    // 30体目: 対応3ダンジョンのボスからランダム1体
    const bossDungeon = pick(sourceDungeons);
    template = bossDungeon.boss;
    game.dungeon.finalBossSourceId = bossDungeon.id;
    log('─'.repeat(40), 'special');
    log(`💀 ${template.name} が現れた！（最終ボス）`, 'special');
  } else if (Math.random() < RAREMON_DUNGEON_RARE_CHANCE) {
    // 通常枠: レアモン90%
    const rareDungeon = pick(sourceDungeons);
    template = rareDungeon.rareEnemy;
    game.dungeon.currentEnemySourceId = rareDungeon.id;
    game.dungeon.currentEnemyIsRare   = true;
    log('✨ レアモンスターが現れた！', 'special');
  } else {
    // 通常枠: ボス10%
    const bossDungeon = pick(sourceDungeons);
    template = bossDungeon.boss;
    game.dungeon.currentEnemySourceId = bossDungeon.id;
    game.dungeon.currentEnemyIsRare   = false;
    log('─'.repeat(40), 'special');
    log('💀 ボスモンスターが現れた！', 'special');
  }

  game.enemy = new Enemy(
    template.name,
    template.hp,
    template.maxHp,
    template.attack,
    template.defense,
    template.expReward
  );

  game.state             = GameState.PLAYER_TURN;
  game.battleCount++;
  game.shieldActive      = null;
  game.enemyPoisoned     = null;
  game.playerAtkBuff     = null;
  game.enemyStunned      = false;
  game.enemyAtkDebuff    = null;
  game.playerRegen       = null;
  game.playerDelayedHeal = null;

  recordMonsterEncounter(game.enemy.name);

  clearLog();
  log(`=== ${def.name} ===`, 'special');
  log(`全 ${RAREMON_DUNGEON_ENEMY_COUNT} 体を倒してクリアせよ！`, 'special');
  updateDungeonInfo();
  log(`=== 戦闘 ${idx + 1} / ${RAREMON_DUNGEON_ENEMY_COUNT} ===`, 'special');
  log(`${game.enemy.name} が現れた！`, 'system');
  log('─'.repeat(40), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');

  renderPlayerStatus();
  renderEnemyStatus();
  setButtonsEnabled(true);
  showDungeonNav(false);
}

/** レアモンダンジョンのドロップ処理 */
function processRaremonDrop() {
  const def = RAREMON_DUNGEON_DEFINITIONS[game.dungeon.raremonVariant];
  if (!def) return;

  const idx            = game.dungeon.enemyIndex;
  const isFinalBoss    = (idx === RAREMON_DUNGEON_ENEMY_COUNT - 1);
  const sourceDungeons = def.dungeonIds.map(id => DUNGEON_DEFINITIONS.find(d => d.id === id)).filter(Boolean);

  if (isFinalBoss) {
    // 30体目ボス: ボスレア素材を確定ドロップ
    const src   = sourceDungeons.find(d => d.id === game.dungeon.finalBossSourceId) || pick(sourceDungeons);
    const drops = src.drops;

    if (drops.bossRare) {
      addDungeonMaterial(drops.bossRare);
      log(`🌟 ${drops.bossRare} を確定入手した！`, 'result');
    }
    if (Math.random() < drops.bossDropRate) {
      addDungeonMaterial(drops.boss);
      log(`💎 ${drops.boss} を入手した！`, 'result');
    }
  } else if (game.dungeon.currentEnemyIsRare) {
    // レアモンスター: レア素材ドロップ
    const src   = sourceDungeons.find(d => d.id === game.dungeon.currentEnemySourceId) || pick(sourceDungeons);
    const drops = src.drops;

    if (Math.random() < drops.rareDropRate) {
      const rareDrop = pick(drops.rares);
      addDungeonMaterial(rareDrop);
      log(`✨ ${rareDrop} を入手した！`, 'result');
    }
  } else {
    // ボスモンスター（通常枠 10%出現分）: ボス素材＋ボスレア素材
    const src   = sourceDungeons.find(d => d.id === game.dungeon.currentEnemySourceId) || pick(sourceDungeons);
    const drops = src.drops;

    if (drops.bossRare && Math.random() < drops.bossRareDropRate) {
      addDungeonMaterial(drops.bossRare);
      log(`🌟 ${drops.bossRare} を入手した！`, 'result');
    }
    if (Math.random() < drops.bossDropRate) {
      addDungeonMaterial(drops.boss);
      log(`💎 ${drops.boss} を入手した！`, 'result');
    }
  }
}

/** レアモンダンジョンクリア処理 */
function completeRaremonDungeon() {
  const def = RAREMON_DUNGEON_DEFINITIONS[game.dungeon.raremonVariant];

  transferDungeonMaterials();

  log('', 'system');
  log(`🏆 ${def ? def.name : 'レアモンダンジョン'} をクリアした！`, 'special');
  log('獲得素材をインベントリに追加しました。', 'result');

  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  autoSave();
  showScreen('lobby');
  renderLobby();
}

/** レアモンダンジョンからの撤退処理（没収） */
function retreatFromRaremonDungeon() {
  game.dungeon.materials = [];
  log('🚪 レアモンダンジョンから撤退した。探索中に獲得した素材は没収された。', 'result');

  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  autoSave();
  showScreen('lobby');
  renderLobby();
}

/* ==============================================================
   スキルダンジョン
   ============================================================== */

/** スキルダンジョン難易度選択画面を描画する */
function renderSkillDungeonDifficultySelect() {
  const list = document.getElementById('skill-dungeon-difficulty-list');
  if (!list) return;
  list.innerHTML = '';

  const keyName  = 'スキルダンジョンの鍵';
  const keyCount = (game.player.materials[keyName] || 0);

  const difficulties = [
    { key: 'beginner',     label: '初級', icon: '🌱' },
    { key: 'intermediate', label: '中級', icon: '⚔' },
    { key: 'advanced',     label: '上級', icon: '🔥' },
  ];

  difficulties.forEach(({ key, label, icon }) => {
    const def  = SKILL_DUNGEON_DEFINITIONS[key];
    const item = document.createElement('div');
    item.className = 'dungeon-item';
    item.innerHTML = `
      <div class="dungeon-info">
        <span class="dungeon-name">${icon} スキルダンジョン ${label}</span>
        <span class="dungeon-meta">
          推奨 Lv ${def.recommendedLevel}〜　全 ${SKILL_DUNGEON_ENEMY_COUNT} 体討伐
          　通常モンドロップ: ${(def.normalDropRate * 100).toFixed(1)}%　レアモンドロップ: ${(def.rareDropRate * 100).toFixed(0)}%
          　ボスドロップ: ${(def.bossDropRate * 100).toFixed(0)}%　レアモン出現率: ${(def.rareChance * 100).toFixed(0)}%
          　入場: スキルダンジョンの鍵×1（所持: ${keyCount}）
        </span>
      </div>
      <button class="dungeon-enter-btn" ${keyCount < 1 ? 'disabled' : ''} onclick="enterSkillDungeon('${key}')">🎓 挑戦する</button>
    `;
    list.appendChild(item);
  });
}

/**
 * スキルダンジョンに入る
 * @param {string} difficulty - 'beginner' | 'intermediate' | 'advanced'
 */
function enterSkillDungeon(difficulty) {
  const def = SKILL_DUNGEON_DEFINITIONS[difficulty];
  if (!def) return;

  const keyName = 'スキルダンジョンの鍵';
  if ((game.player.materials[keyName] || 0) < 1) {
    log('❌ スキルダンジョンの鍵が足りません。', 'system');
    return;
  }

  game.player.materials[keyName] -= 1;
  if (game.player.materials[keyName] <= 0) {
    delete game.player.materials[keyName];
  }

  game.dungeon = {
    id:                null,
    enemyIndex:        0,
    materials:         [],
    isSkillDungeon:    true,
    skillDifficulty:   difficulty,
    skillStonesEarned: 0,
  };

  showScreen('battle');
  game.player.mp = game.player.maxMp;
  startNextDungeonBattle();
}

/** スキルダンジョン内で次の戦闘を開始する */
function startNextSkillDungeonBattle() {
  const def = SKILL_DUNGEON_DEFINITIONS[game.dungeon.skillDifficulty];
  if (!def) return;

  const idx = game.dungeon.enemyIndex;

  let template;

  if (idx === SKILL_DUNGEON_ENEMY_COUNT - 1) {
    template = def.boss;
    log('─'.repeat(40), 'special');
    log('💀 ボスが現れた！', 'special');
  } else {
    const isRareSpawn = Math.random() < def.rareChance;
    template = isRareSpawn ? def.rareEnemy : pick(def.normalEnemies);
    if (isRareSpawn) {
      log('✨ レアモンスターが現れた！', 'special');
    }
  }

  game.enemy = new Enemy(
    template.name,
    template.hp,
    template.maxHp,
    template.attack,
    template.defense,
    template.expReward
  );

  game.state             = GameState.PLAYER_TURN;
  game.battleCount++;
  game.shieldActive      = null;
  game.enemyPoisoned     = null;
  game.playerAtkBuff     = null;
  game.enemyStunned      = false;
  game.enemyAtkDebuff    = null;
  game.playerRegen       = null;
  game.playerDelayedHeal = null;

  recordMonsterEncounter(game.enemy.name);

  clearLog();
  log(`=== ${def.name} ===`, 'special');
  log(`全 ${SKILL_DUNGEON_ENEMY_COUNT} 体を倒してクリアせよ！　クリア時のみスキルストーンを獲得できます。`, 'special');
  updateDungeonInfo();
  log(`=== 戦闘 ${idx + 1} / ${SKILL_DUNGEON_ENEMY_COUNT} ===`, 'special');
  log(`${game.enemy.name} が現れた！`, 'system');
  log('─'.repeat(40), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');

  renderPlayerStatus();
  renderEnemyStatus();
  setButtonsEnabled(true);
  showDungeonNav(false);
}

/** スキルダンジョンのドロップ処理 */
function processSkillDrop() {
  const def = SKILL_DUNGEON_DEFINITIONS[game.dungeon.skillDifficulty];
  if (!def) return;

  const idx    = game.dungeon.enemyIndex;
  const isBoss = idx === SKILL_DUNGEON_ENEMY_COUNT - 1;
  const isRare = game.enemy.name === def.rareEnemy.name;

  let dropRate;
  if (isBoss) {
    dropRate = def.bossDropRate;
  } else if (isRare) {
    dropRate = def.rareDropRate;
  } else {
    dropRate = def.normalDropRate;
  }

  if (Math.random() < dropRate) {
    game.dungeon.skillStonesEarned += 1;
    log(`🎓 ${SKILL_STONE_NAME} ×1 を入手した！（探索合計: ${game.dungeon.skillStonesEarned} 個）`, 'result');
  }
}

/** スキルダンジョンクリア処理 */
function completeSkillDungeon() {
  const def    = SKILL_DUNGEON_DEFINITIONS[game.dungeon.skillDifficulty];
  const stones = game.dungeon.skillStonesEarned;

  if (stones > 0) {
    game.player.materials[SKILL_STONE_NAME] = (game.player.materials[SKILL_STONE_NAME] || 0) + stones;
    recordItemUnlock(SKILL_STONE_NAME);
  }

  log('', 'system');
  log(`🏆 ${def ? def.name : 'スキルダンジョン'} をクリアした！`, 'special');
  log(`🎓 ${SKILL_STONE_NAME} ${stones} 個をインベントリに追加しました。`, 'result');

  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  autoSave();
  showScreen('lobby');
  renderLobby();
}

/** スキルダンジョンからの撤退処理 */
function retreatFromSkillDungeon() {
  game.dungeon.skillStonesEarned = 0;
  log('🚪 スキルダンジョンから撤退した。探索中に獲得したスキルストーンは没収された。', 'result');

  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  autoSave();
  showScreen('lobby');
  renderLobby();
}
