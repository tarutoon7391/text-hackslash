'use strict';

/* ==============================================================
   ダンジョンシステム（進行管理・ドロップ処理・特殊ダンジョン）
   ============================================================== */

/* ==============================================================
   ダンジョン画面の初期表示
   ============================================================== */

/**
 * @typedef {Object} SpecialDungeonEntry
 * @property {string} icon        - ダンジョンを表すアイコン文字
 * @property {string} name        - ダンジョン名
 * @property {string} description - 簡単な説明文
 * @property {Function} onEnter   - 「選択する」ボタンを押したときに呼び出す関数
 */

/**
 * 特殊ダンジョンの定義リスト。
 * 新しい特殊ダンジョンを追加する場合はここに追加する。
 * @type {SpecialDungeonEntry[]}
 */
const SPECIAL_DUNGEON_LIST = [
  {
    icon: '🎫',
    name: 'ガチャチケダンジョン',
    description: 'ガチャチケットを獲得できる特殊ダンジョン。全 30 体を討伐してクリアすると獲得チケットがインベントリに加算されます。',
    onEnter() {
      showScreen('gacha-dungeon-difficulty');
      renderGachaDungeonDifficultySelect();
    },
  },
  {
    icon: '✨',
    name: 'XPダンジョン',
    description: '経験値特化のダンジョン。エメラルド系モンスターが出現。全 30 体を討伐してクリアすると獲得EXPがキャラクターに反映されます。',
    onEnter() {
      showScreen('xp-dungeon-difficulty');
      renderXpDungeonDifficultySelect();
    },
  },
  {
    icon: '💎',
    name: 'レアモンダンジョン',
    description: '対応ダンジョンのレアモン・ボスが出現する素材収集特化ダンジョン。全 30 体を討伐してクリアすると獲得素材がインベントリに追加されます。',
    onEnter() {
      showScreen('raremon-dungeon-select');
      renderRaremonDungeonSelect();
    },
  },
  {
    icon: '🎓',
    name: 'スキルダンジョン',
    description: 'スキルストーンを入手できるダンジョン。全 30 体を討伐してクリアするとスキルストーンがインベントリに追加されます。',
    onEnter() {
      showScreen('skill-dungeon-difficulty');
      renderSkillDungeonDifficultySelect();
    },
  },
];

/** ダンジョンタイプ選択画面（通常 / 特殊）を描画する */
function renderDungeonTypeSelect() {
  const list = document.getElementById('dungeon-type-list');
  list.innerHTML = '';

  // 通常ダンジョン
  const normalItem = document.createElement('div');
  normalItem.className = 'dungeon-item';
  normalItem.innerHTML = `
    <div class="dungeon-info">
      <span class="dungeon-name">🗺 通常ダンジョン</span>
      <span class="dungeon-meta">D1〜D12 の通常ダンジョンに挑戦する</span>
    </div>
    <button class="dungeon-enter-btn" onclick="showScreen('dungeon-select'); renderDungeonSelect();">▶ 選択する</button>
  `;
  list.appendChild(normalItem);

  // 特殊ダンジョン
  const specialItem = document.createElement('div');
  specialItem.className = 'dungeon-item';
  specialItem.innerHTML = `
    <div class="dungeon-info">
      <span class="dungeon-name">✨ 特殊ダンジョン</span>
      <span class="dungeon-meta">報酬が特殊なダンジョンに挑戦する</span>
    </div>
    <button class="dungeon-enter-btn" onclick="showScreen('special-dungeon-select'); renderSpecialDungeonSelect();">▶ 選択する</button>
  `;
  list.appendChild(specialItem);
}

/** 特殊ダンジョン選択画面を描画する */
function renderSpecialDungeonSelect() {
  const list = document.getElementById('special-dungeon-list');
  list.innerHTML = '';

  SPECIAL_DUNGEON_LIST.forEach(dungeon => {
    const item = document.createElement('div');
    item.className = 'dungeon-item';

    const btn = document.createElement('button');
    btn.className = 'dungeon-enter-btn';
    btn.textContent = '▶ 選択する';
    btn.addEventListener('click', () => dungeon.onEnter());

    item.innerHTML = `
      <div class="dungeon-info">
        <span class="dungeon-name">${dungeon.icon} ${dungeon.name}</span>
        <span class="dungeon-meta">${dungeon.description}</span>
      </div>
    `;
    item.appendChild(btn);
    list.appendChild(item);
  });
}

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
  game.playerCondense    = null;
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
    { key: 'beginner',      label: '初級',  icon: '🌱' },
    { key: 'intermediate',  label: '中級',  icon: '⚔' },
    { key: 'advanced',      label: '上級',  icon: '🔥' },
    { key: 'superAdvanced', label: '超級',  icon: '💥' },
    { key: 'superElite',    label: '超上級', icon: '👑' },
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
  game.playerCondense    = null;
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
 * 撤退時は探索中に獲得したチケットをプレイヤーに持ち帰らせる
 */
function retreatFromGachaDungeon() {
  const tickets = game.dungeon.ticketsEarned;
  game.player.gachaTickets = (game.player.gachaTickets || 0) + tickets;
  log(`🚪 チケットダンジョンから撤退した。探索中に獲得したガチャチケット ${tickets} 枚を持ち帰った。`, 'result');

  // ロビーに戻る際にHPとMPを全回復する
  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  // 撤退時に自動セーブ
  autoSave();

  showScreen('lobby');
  renderLobby();
}


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
    { key: 'beginner',      label: '初級',  icon: '🌱' },
    { key: 'intermediate',  label: '中級',  icon: '⚔' },
    { key: 'advanced',      label: '上級',  icon: '🔥' },
    { key: 'superAdvanced', label: '超級',  icon: '💥' },
    { key: 'superElite',    label: '超上級', icon: '👑' },
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
  game.playerCondense    = null;
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
  const xp = game.dungeon.xpEarned;
  gainExp(xp);
  log(`🚪 XPダンジョンから撤退した。探索中に獲得した EXP ${xp} を持ち帰った。`, 'result');

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
  game.playerCondense    = null;
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

/** レアモンダンジョンからの撤退処理 */
function retreatFromRaremonDungeon() {
  transferDungeonMaterials();
  log('🚪 レアモンダンジョンから撤退した。探索中に獲得した素材を持ち帰った。', 'result');

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
    { key: 'beginner',      label: '初級',  icon: '🌱' },
    { key: 'intermediate',  label: '中級',  icon: '⚔' },
    { key: 'advanced',      label: '上級',  icon: '🔥' },
    { key: 'superAdvanced', label: '超級',  icon: '💥' },
    { key: 'superElite',    label: '超上級', icon: '👑' },
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
  game.playerCondense    = null;
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
  const stones = game.dungeon.skillStonesEarned;
  if (stones > 0) {
    game.player.materials[SKILL_STONE_NAME] = (game.player.materials[SKILL_STONE_NAME] || 0) + stones;
    recordItemUnlock(SKILL_STONE_NAME);
  }
  log(`🚪 スキルダンジョンから撤退した。探索中に獲得した ${SKILL_STONE_NAME} ${stones} 個を持ち帰った。`, 'result');

  game.player.hp = game.player.maxHp;
  game.player.mp = game.player.maxMp;

  autoSave();
  showScreen('lobby');
  renderLobby();
}
