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
      { name: 'スライム',       hp: 20,  maxHp: 20,  attack: 6,  defense: 2,  expReward: 10 },
      { name: 'ビッグスライム', hp: 35,  maxHp: 35,  attack: 8,  defense: 4,  expReward: 18 },
      { name: 'ブルースライム', hp: 25,  maxHp: 25,  attack: 7,  defense: 3,  expReward: 14 },
    ],
    rareEnemy: { name: 'メタルスライム', hp: 5,   maxHp: 5,   attack: 10, defense: 28, expReward: 80 },
    boss: { name: 'キングスライム', hp: 130, maxHp: 130, attack: 15, defense: 8,  expReward: 150 },
    rareChance: 0.15,
    drops: {
      common:       '革',
      rare:         'キラースライム核',
      rareDropRate:  0.80,
      boss:         'キングゼリー',
      bossDropRate:  0.30,
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
      { name: 'ゴブリン',         hp: 45,  maxHp: 45,  attack: 18, defense: 6,  expReward: 30 },
      { name: 'ゴブリンアーチャー', hp: 38, maxHp: 38,  attack: 22, defense: 4,  expReward: 28 },
      { name: 'ゴブリン戦士',      hp: 60,  maxHp: 60,  attack: 16, defense: 10, expReward: 35 },
    ],
    rareEnemy: { name: 'ゴブリンシャーマン', hp: 40,  maxHp: 40,  attack: 32, defense: 5,  expReward: 110 },
    boss: { name: 'ゴブリンキング',     hp: 220, maxHp: 220, attack: 32, defense: 18, expReward: 280 },
    rareChance: 0.15,
    drops: {
      common:       '鉄',
      rare:         'シャーマンの杖',
      rareDropRate:  0.80,
      boss:         '王の紋章',
      bossDropRate:  0.30,
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
      { name: 'スケルトン',         hp: 70,  maxHp: 70,  attack: 30, defense: 12, expReward: 55 },
      { name: 'ゾンビ',             hp: 90,  maxHp: 90,  attack: 25, defense: 15, expReward: 50 },
      { name: 'スケルトンアーチャー', hp: 55, maxHp: 55,  attack: 35, defense: 8,  expReward: 60 },
    ],
    rareEnemy: { name: 'リッチ',      hp: 65,  maxHp: 65,  attack: 52, defense: 10, expReward: 160 },
    boss: { name: 'デスナイト',  hp: 350, maxHp: 350, attack: 45, defense: 25, expReward: 380 },
    rareChance: 0.15,
    drops: {
      common:       '金',
      rare:         '呪いの骨',
      rareDropRate:  0.80,
      boss:         '死神の鎌',
      bossDropRate:  0.30,
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
      { name: 'サラマンダー',   hp: 110, maxHp: 110, attack: 50, defense: 20, expReward: 90 },
      { name: 'マグマゴーレム', hp: 145, maxHp: 145, attack: 45, defense: 28, expReward: 95 },
      { name: 'ファイアバット', hp: 80,  maxHp: 80,  attack: 55, defense: 15, expReward: 88 },
    ],
    rareEnemy: { name: 'ラーヴァゴーレム', hp: 130, maxHp: 130, attack: 72, defense: 32, expReward: 220 },
    boss: { name: 'フレイムドラゴン', hp: 550, maxHp: 550, attack: 78, defense: 42, expReward: 650 },
    rareChance: 0.15,
    drops: {
      common:       'ダイヤ',
      rare:         '溶岩石',
      rareDropRate:  0.75,
      boss:         '竜の炎石',
      bossDropRate:  0.30,
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
      { name: 'デーモン',     hp: 175, maxHp: 175, attack: 75, defense: 35, expReward: 155 },
      { name: 'ダークエルフ', hp: 145, maxHp: 145, attack: 85, defense: 28, expReward: 162 },
      { name: 'シャドウ',     hp: 125, maxHp: 125, attack: 90, defense: 25, expReward: 158 },
    ],
    rareEnemy: { name: 'ダークナイト', hp: 190, maxHp: 190, attack: 112, defense: 48, expReward: 320 },
    boss: { name: '魔王',         hp: 850, maxHp: 850, attack: 125, defense: 62, expReward: 1000 },
    rareChance: 0.15,
    drops: {
      common:       '竜鱗',
      rare:         '闇の結晶',
      rareDropRate:  0.75,
      boss:         '魔王の心臓',
      bossDropRate:  0.25,
    },
  },
];

/** 1 ダンジョンあたりの敵数（ボス含む） */
const DUNGEON_ENEMY_COUNT = 15;

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
 * @param {number} dungeonId - ダンジョン ID（1〜5）
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
    // レア出現判定
    const isRare = Math.random() < dungeon.rareChance;
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

  game.state      = GameState.PLAYER_TURN;
  game.battleCount++;
  game.shieldActive   = null;
  game.enemyPoisoned  = null;

  // 図鑑: 遭遇を記録する（勝敗・逃げを問わず）
  recordMonsterEncounter(game.enemy.name);

  clearLog();
  log(`=== ${dungeon.name} に入った！ 全 ${DUNGEON_ENEMY_COUNT} 体を倒せ！ ===`, 'special');
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
  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === game.dungeon.id);
  if (!dungeon) return;
  const el = document.getElementById('dungeon-info');
  if (el) {
    el.textContent =
      `📍 ${dungeon.name}  [ ${game.dungeon.enemyIndex + 1} / ${DUNGEON_ENEMY_COUNT} 体目 ]`;
  }
}

/* ==============================================================
   ドロップ処理
   ============================================================== */

/**
 * 敵撃破時にドロップ素材を決定して game.dungeon.materials に追加する
 */
function processDrop() {
  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === game.dungeon.id);
  if (!dungeon) return;

  const drops = dungeon.drops;
  const idx   = game.dungeon.enemyIndex;
  const isRareSpawn = game.enemy.name === dungeon.rareEnemy.name;
  const isBoss      = idx === DUNGEON_ENEMY_COUNT - 1;

  if (isBoss) {
    // ボス: 低確率でボス専用素材, 外れたらコモン素材
    const roll = Math.random();
    if (roll < drops.bossDropRate) {
      addDungeonMaterial(drops.boss);
      log(`💎 ${drops.boss} を入手した！`, 'result');
    } else {
      addDungeonMaterial(drops.common);
      log(`📦 ${drops.common} を入手した。`, 'result');
    }
  } else if (isRareSpawn) {
    // レア敵: 高確率でレア素材, 外れたらコモン素材
    const roll = Math.random();
    if (roll < drops.rareDropRate) {
      addDungeonMaterial(drops.rare);
      log(`✨ ${drops.rare} を入手した！`, 'result');
    } else {
      addDungeonMaterial(drops.common);
      log(`📦 ${drops.common} を入手した。`, 'result');
    }
  } else {
    // 通常敵: コモン素材確定
    addDungeonMaterial(drops.common);
    log(`📦 ${drops.common} を入手した。`, 'result');
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
  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === game.dungeon.id);
  if (!dungeon) return;

  // クリア済みフラグを立てる
  game.player.dungeonProgress[dungeon.id] = true;

  // 獲得素材をプレイヤーのインベントリに移す
  transferDungeonMaterials();

  log('', 'system');
  log(`🏆 ${dungeon.name} をクリアした！`, 'special');
  log('獲得素材をインベントリに追加しました。', 'result');

  showScreen('lobby');
  renderLobby();
}

/** 撤退処理 */
function retreatFromDungeon() {
  // 獲得素材をプレイヤーのインベントリに移す（撤退は持ち帰り可）
  transferDungeonMaterials();
  log('🚪 ダンジョンから撤退した。獲得素材を持ち帰った。', 'result');

  showScreen('lobby');
  renderLobby();
}

/**
 * 死亡によるダンジョン失敗処理
 * 獲得済み素材は全て失う
 */
function failDungeon() {
  game.dungeon.materials = [];
  log('💀 ダンジョン内で獲得した素材をすべて失った…', 'enemy-action');

  // HP を最大値で復活（デスペナルティなし）
  game.player.hp = game.player.maxHp;
  renderPlayerStatus();

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
