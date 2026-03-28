'use strict';

/* ==============================================================
   セーブ・ロード機能
   ============================================================== */

const API_URL = 'https://lomo-s2409009.ssl-lolipop.jp/public_html/api.php';

function showSaveLoadMsg(text, type) {
  const el = document.getElementById('saveload-msg');
  if (!el) return;
  el.textContent = text;
  el.className   = type;
}

function setSaveLoadButtonsEnabled(enabled) {
  ['btn-save', 'btn-load'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !enabled;
  });
}

async function saveGame() {
  const password = document.getElementById('password-input').value.trim();
  if (!password) { showSaveLoadMsg('⚠ パスワードを入力してください。', 'error'); return; }
  if (!game.player) { showSaveLoadMsg('⚠ ゲームが開始されていません。', 'error'); return; }

  const p = game.player;
  const saveData = {
    name:            p.name,
    level:           p.level,
    exp:             p.exp,
    hp:              p.hp,
    maxHp:           p.maxHp,
    mp:              p.mp,
    maxMp:           p.maxMp,
    attackBase:      p.attackBase,
    defenseBase:     p.defenseBase,
    maxHpBase:       p.maxHpBase,
    maxMpBase:       p.maxMpBase,
    spAtk:           p.spAtk,
    spDef:           p.spDef,
    spHp:            p.spHp,
    spMp:            p.spMp,
    skillPoints:     p.skillPoints,
    learnedSkills:   p.learnedSkills,
    skillTreeNodes:  p.skillTreeNodes,
    materials:       p.materials,
    equipment:       p.equipment,
    ownedEquipment:  p.ownedEquipment,
    enhanceLevels:   p.enhanceLevels,
    dungeonProgress: p.dungeonProgress,
    encounterFlags:  p.encounterFlags,
    defeatFlags:     p.defeatFlags,
    defeatCounts:    p.defeatCounts,
    itemUnlockFlags: p.itemUnlockFlags,
  };

  setSaveLoadButtonsEnabled(false);
  showSaveLoadMsg('⏳ セーブ中…', 'loading');

  try {
    const response = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'save', password, save: saveData }),
    });
    const result = await response.json();
    if (result.status === 'ok' || result.success || response.ok) {
      showSaveLoadMsg('✅ セーブしました！', 'success');
      log('💾 ゲームデータをセーブしました。', 'result');
    } else {
      const errMsg = result.message || result.error || '不明なエラー';
      showSaveLoadMsg(`❌ セーブ失敗: ${errMsg}`, 'error');
      log(`❌ セーブに失敗しました: ${errMsg}`, 'enemy-action');
    }
  } catch (err) {
    showSaveLoadMsg(`❌ 通信エラー: ${err.message}`, 'error');
    log(`❌ セーブ通信エラー: ${err.message}`, 'enemy-action');
  } finally {
    setSaveLoadButtonsEnabled(true);
  }
}

async function loadGame() {
  const password = document.getElementById('password-input').value.trim();
  if (!password) { showSaveLoadMsg('⚠ パスワードを入力してください。', 'error'); return; }

  setSaveLoadButtonsEnabled(false);
  showSaveLoadMsg('⏳ ロード中…', 'loading');

  try {
    const response = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'load', password }),
    });
    const result = await response.json();

    if (!response.ok || result.error || (!result.save && !result.data)) {
      const errMsg = result.message || result.error || 'データが見つかりませんでした';
      showSaveLoadMsg(`❌ ロード失敗: ${errMsg}`, 'error');
      return;
    }

    const saved = result.save || result.data;

    // ロードしたデータでプレイヤーを復元する
    game.player = new Player({
      name:            saved.name            ?? INITIAL_PLAYER_STATS.name,
      hp:              saved.hp              ?? INITIAL_PLAYER_STATS.hp,
      maxHp:           saved.maxHp           ?? INITIAL_PLAYER_STATS.maxHp,
      mp:              saved.mp              ?? INITIAL_PLAYER_STATS.mp,
      maxMp:           saved.maxMp           ?? INITIAL_PLAYER_STATS.maxMp,
      attackBase:      saved.attackBase      ?? INITIAL_PLAYER_STATS.attackBase,
      defenseBase:     saved.defenseBase     ?? INITIAL_PLAYER_STATS.defenseBase,
      maxHpBase:       saved.maxHpBase       ?? (saved.maxHp ?? INITIAL_PLAYER_STATS.maxHp),
      maxMpBase:       saved.maxMpBase       ?? (saved.maxMp ?? INITIAL_PLAYER_STATS.maxMp),
      spAtk:           saved.spAtk           ?? 0,
      spDef:           saved.spDef           ?? 0,
      spHp:            saved.spHp            ?? 0,
      spMp:            saved.spMp            ?? 0,
      level:           saved.level           ?? 1,
      exp:             saved.exp             ?? 0,
      skillPoints:     saved.skillPoints     ?? 0,
      learnedSkills:   saved.learnedSkills   ?? [],
      skillTreeNodes:  saved.skillTreeNodes  ?? {},
      materials:       saved.materials       ?? {},
      equipment:       saved.equipment       ?? {},
      ownedEquipment:  saved.ownedEquipment  ?? [],
      enhanceLevels:   saved.enhanceLevels   ?? {},
      dungeonProgress: saved.dungeonProgress ?? {},
      encounterFlags:  saved.encounterFlags  ?? {},
      defeatFlags:     saved.defeatFlags     ?? {},
      defeatCounts:    saved.defeatCounts    ?? {},
      itemUnlockFlags: saved.itemUnlockFlags ?? {},
    });

    game.dungeon = { id: null, enemyIndex: 0, materials: [] };

    // マイグレーション: 全回復スキル取得済みの場合、神聖なうたい寝に自動移行する
    if (game.player.learnedSkills.includes('full_recovery')) {
      game.player.learnedSkills = game.player.learnedSkills.map(
        s => s === 'full_recovery' ? 'holy_slumber' : s
      );
    }

    showSaveLoadMsg('✅ ロードしました！', 'success');
    log('📂 ゲームデータをロードしました。', 'result');
    log(`  名前: ${game.player.name}  LV: ${game.player.level}  EXP: ${game.player.exp}`, 'result');

    renderLobby();
  } catch (err) {
    showSaveLoadMsg(`❌ 通信エラー: ${err.message}`, 'error');
    log(`❌ ロード通信エラー: ${err.message}`, 'enemy-action');
  } finally {
    setSaveLoadButtonsEnabled(true);
  }
}
