'use strict';

/* ==============================================================
   レベルアップ・スキルツリーシステム
   ============================================================== */

/** レベル上限 */
const MAX_LEVEL = 20;

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
  64300,  // Lv 20（上限）
];

/* ==============================================================
   スキルツリー定義
   各ルート 15 ノード。ノードコスト合計は各ルート 30 SP。
   プレイヤーが Lv20 までに獲得できる SP は最大 65 pt
   （5の倍数レベルは +5pt、それ以外は +3pt）なので
   約 2 ルートを完走できるバランスに設定。
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
        description: '高速の一撃（ATK×1.8 / MP:10）',
        mpCost: 10, bonuses: {}, cost: 2, requires: 'sw_05',
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
        description: '2 回連続攻撃（MP:12）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'sw_09',
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
        description: '雷を纏った強斬り（ATK×2.2 / MP:15）',
        mpCost: 15, bonuses: {}, cost: 3, requires: 'sw_12',
      },
      {
        id: 'sw_14', name: '絶剣',
        type: 'stat', description: 'ATK +10',
        bonuses: { atk: 10 }, cost: 3, requires: 'sw_13',
      },
      {
        id: 'sw_15', name: '必殺剣',
        type: 'skill', skillId: 'death_blow',
        description: '全力を込めた一撃（ATK×3.0 / MP:25）',
        mpCost: 25, bonuses: {}, cost: 3, requires: 'sw_14',
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
        description: '炎の魔法（ATK×1.6 / MP:8）',
        mpCost: 8, bonuses: {}, cost: 2, requires: 'mg_05',
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
        description: '雷の魔法（ATK×1.8 / MP:12）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'mg_08',
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
        description: '自分を回復する（HP+40+Lv×3 / MP:12）',
        mpCost: 12, bonuses: {}, cost: 3, requires: 'mg_11',
      },
      {
        id: 'mg_13', name: 'ブリザド',
        type: 'skill', skillId: 'blizzard',
        description: '氷の魔法（ATK×2.2 / MP:15）',
        mpCost: 15, bonuses: {}, cost: 3, requires: 'mg_12',
      },
      {
        id: 'mg_14', name: '大魔力',
        type: 'stat', description: 'ATK +5 / MP +20',
        bonuses: { atk: 5, mp: 20 }, cost: 3, requires: 'mg_13',
      },
      {
        id: 'mg_15', name: '大魔法陣',
        type: 'skill', skillId: 'grand_magic',
        description: '究極の魔法攻撃（ATK×3.0 / MP:30）',
        mpCost: 30, bonuses: {}, cost: 3, requires: 'mg_14',
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
        description: '聖なる光で回復（HP+30+Lv×2 / MP:8）',
        mpCost: 8, bonuses: {}, cost: 2, requires: 'cl_05',
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
        description: '自分に ATK+15 バフ（3 ターン / MP:10）',
        mpCost: 10, bonuses: {}, cost: 2, requires: 'cl_08',
      },
      {
        id: 'cl_10', name: '回復の詩',
        type: 'stat', description: 'HP +20 / MP +8',
        bonuses: { hp: 20, mp: 8 }, cost: 2, requires: 'cl_09',
      },
      {
        id: 'cl_11', name: '大回復',
        type: 'skill', skillId: 'big_heal',
        description: '大きく HP を回復（HP+50+Lv×3 / MP:15）',
        mpCost: 15, bonuses: {}, cost: 3, requires: 'cl_10',
      },
      {
        id: 'cl_12', name: '聖域',
        type: 'skill', skillId: 'sanctuary',
        description: '防御バリア（DEF+25 / 2 ターン / MP:12）',
        mpCost: 12, bonuses: {}, cost: 3, requires: 'cl_11',
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
        description: '神聖な力で大回復（HP+60+Lv×4 / MP:30）',
        mpCost: 30, bonuses: {}, cost: 3, requires: 'cl_14',
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
        description: '足を払う（ATK×1.2 / MP:8 / 30%でスタン）',
        mpCost: 8, bonuses: {}, cost: 2, requires: 'wt_05',
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
        description: '敵の攻撃力を 2 ターン低下（MP:10）',
        mpCost: 10, bonuses: {}, cost: 2, requires: 'wt_08',
      },
      {
        id: 'wt_10', name: '突破口',
        type: 'stat', description: 'ATK +5 / HP +15',
        bonuses: { atk: 5, hp: 15 }, cost: 2, requires: 'wt_09',
      },
      {
        id: 'wt_11', name: '体当たり',
        type: 'skill', skillId: 'body_slam',
        description: '強烈な体当たりでスタン（ATK×1.6 / MP:10）',
        mpCost: 10, bonuses: {}, cost: 3, requires: 'wt_10',
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
        description: '強打＋敵の攻撃力を 2 ターン低下（ATK×2.0 / MP:15）',
        mpCost: 15, bonuses: {}, cost: 3, requires: 'wt_13',
      },
      {
        id: 'wt_15', name: '不屈の戦士',
        type: 'stat', description: 'ATK +5 / DEF +5 / HP +30',
        bonuses: { atk: 5, def: 5, hp: 30 }, cost: 3, requires: 'wt_14',
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
 * スキルポイント付与: 5 の倍数レベルは 5pt、それ以外は 3pt
 * Lv1→20 で最大 65pt 獲得できる
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

    // スキルポイント付与（5 の倍数レベルは 5pt、それ以外は 3pt）
    // Lv2〜20 でのトータル: 5倍数レベル4回×5pt=20pt + 残15レベル×3pt=45pt = 計65pt
    const pointsGained = (player.level % 5 === 0) ? 5 : 3;
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

    return `
      <div class="st-node ${stateClass}" ${onclickAttr}>
        <div class="st-node-header">
          <span class="st-node-icon">${typeIcon}</span>
          <span class="st-node-name">${node.name}</span>
          <span class="st-node-cost">${node.cost} SP</span>
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
      // 居合斬り: ATK×1.8
      const raw = Math.floor(player.effectiveAttack * 1.8) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚔ ${player.name} は「居合斬り」で斬り込んだ！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'chain_slash': {
      // 連続斬り: 2 回攻撃
      const dmg1 = player.calcAttackDamage(enemy);
      enemy.takeDamage(dmg1);
      let dmg2 = 0;
      if (enemy.isAlive()) {
        dmg2 = player.calcAttackDamage(enemy);
        enemy.takeDamage(dmg2);
      }
      log(`⚔⚔ ${player.name} は「連続斬り」で 2 回攻撃！ → ${enemy.name} に ${dmg1}＋${dmg2} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'thunder_slash': {
      // 雷光斬り: ATK×2.2
      const raw = Math.floor(player.effectiveAttack * 2.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚡ ${player.name} は「雷光斬り」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'death_blow': {
      // 必殺剣: ATK×3.0
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 6)), 'deal');
      enemy.takeDamage(dmg);
      log(`💀 ${player.name} は「必殺剣」を振りおろした！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
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
      // 祝福: ATK +15 バフ 3 ターン
      game.playerAtkBuff = { bonus: 15, turnsLeft: 3 };
      log(`🌟 ${player.name} は「祝福」を唱えた！ 3 ターン ATK +15`, 'player-action');
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
      // 聖域: DEF +25 バフ 2 ターン
      game.shieldActive = { defenseBonus: 25, turnsLeft: 2 };
      log(`🛡 ${player.name} は「聖域」を展開した！ 2 ターン DEF +25`, 'player-action');
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
      // 足払い: ATK×1.2 + 30%の確率で次ターン行動不能
      const raw = Math.floor(player.effectiveAttack * 1.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 3)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.30;
      game.enemyStunned = stunned;
      if (stunned) {
        log(`💥 ${player.name} は「足払い」を決めた！ → ${enemy.name} に ${dmg} ダメージ！次のターン行動不能！`, 'player-action');
      } else {
        log(`💥 ${player.name} は「足払い」を決めた！ → ${enemy.name} に ${dmg} ダメージ！（スタン不発）`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'intimidate': {
      // 威嚇: 敵 ATK ×0.7 バフ（2 ターン）
      game.enemyAtkDebuff = { factor: 0.7, turnsLeft: 2 };
      log(`😤 ${player.name} は「威嚇」した！ → ${enemy.name} の攻撃力が 2 ターン低下！`, 'player-action');
      break;
    }

    case 'body_slam': {
      // 体当たり: ATK×1.6 + スタン
      const raw = Math.floor(player.effectiveAttack * 1.6) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      game.enemyStunned = true;
      log(`💥 ${player.name} は「体当たり」を仕掛けた！ → ${enemy.name} に ${dmg} ダメージ！スタン！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'devastating_blow': {
      // 破壊の一撃: ATK×2.0 + 敵 ATK デバフ（2 ターン）
      const raw = Math.floor(player.effectiveAttack * 2.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      game.enemyAtkDebuff = { factor: 0.8, turnsLeft: 2 };
      log(`💢 ${player.name} は「破壊の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！攻撃力が 2 ターン低下！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    default:
      break;
  }

  // スキル使用後はプレイヤーターンを終了し、敵のターンへ進む
  afterPlayerTurn();
}
