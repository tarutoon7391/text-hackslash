'use strict';

/* ==============================================================
   画面遷移管理
   ============================================================== */

/**
 * 指定した画面を表示し、他の画面を非表示にする
 * @param {string} screenName - 'login' | 'lobby' | 'dungeon-select' | 'battle' | 'inventory' | 'skill-tree' | 'encyclopedia' | 'ranking'
 */
function showScreen(screenName) {
  const screens = ['login', 'lobby', 'dungeon-select', 'battle', 'inventory', 'skill-tree', 'encyclopedia', 'ranking', 'gacha'];
  screens.forEach(name => {
    const el = document.getElementById(`screen-${name}`);
    if (el) el.style.display = name === screenName ? 'block' : 'none';
  });
  game.currentScreen = screenName;
}

/* ==============================================================
   ロビー画面
   ============================================================== */

/** ロビー画面全体を描画する */
function renderLobby() {
  renderLobbyStatus();
}

/** ロビー画面のプレイヤーステータスを更新する */
function renderLobbyStatus() {
  if (!game.player) return;

  const p   = game.player;
  const nxt = (typeof expToNextLevel === 'function') ? expToNextLevel() : '---';
  const maxLv = (typeof MAX_LEVEL !== 'undefined') ? MAX_LEVEL : 20;
  const atLv = p.level >= maxLv;

  const el = document.getElementById('lobby-player-status');
  if (!el) return;

  const skillList = (p.learnedSkills.length > 0)
    ? p.learnedSkills.map(id => {
        const def = (typeof SKILL_DEFINITIONS !== 'undefined')
          ? SKILL_DEFINITIONS.find(s => s.id === id) : null;
        return def ? def.name : id;
      }).join(' / ')
    : 'なし';

  const hpPct  = Math.max(0, Math.min(100, (p.hp  / p.maxHp) * 100));
  const mpPct  = Math.max(0, Math.min(100, (p.mp  / p.maxMp) * 100));

  el.innerHTML = `
    <div class="lobby-stat-line">名前: <strong>${p.name}</strong></div>
    <div class="lobby-stat-line">Lv: <strong>${p.level}</strong> / ${maxLv}</div>
    <div class="lobby-stat-line">EXP: ${p.exp}　${atLv ? '（最大レベル）' : `→ 次のレベルまで ${nxt}`}</div>
    <div class="lobby-stat-line">ATK: ${p.attack}　DEF: ${p.defense}</div>
    <div class="hp-label">HP: ${p.hp} / ${p.maxHp}</div>
    <div class="hp-bar-outer"><div class="hp-bar-inner${hpPct <= 25 ? ' danger' : hpPct <= 50 ? ' warning' : ''}" style="width:${hpPct}%"></div></div>
    <div class="mp-label">MP: ${p.mp} / ${p.maxMp}</div>
    <div class="hp-bar-outer"><div class="mp-bar-inner" style="width:${mpPct}%"></div></div>
    <div class="lobby-stat-line">スキルツリーポイント: <strong>${p.skillPoints} pt</strong></div>
    <div class="lobby-stat-line">習得スキル: ${skillList}</div>
    <div class="lobby-stat-line">🎫 ガチャチケット: <strong>${p.gachaTickets || 0}</strong> 枚</div>
  `;
}

/* ==============================================================
   HP バーと HP ラベルを更新する（戦闘画面用）
   ============================================================== */

function updateHpBar(barId, labelId, current, max) {
  const bar   = document.getElementById(barId);
  const label = document.getElementById(labelId);
  if (!bar || !label) return;
  const pct = Math.max(0, Math.min(100, (current / max) * 100));

  bar.style.width       = pct + '%';
  label.textContent     = `HP: ${current} / ${max}`;

  bar.classList.remove('danger', 'warning');
  if (pct <= 25) {
    bar.classList.add('danger');
  } else if (pct <= 50) {
    bar.classList.add('warning');
  }
}

/** プレイヤーステータス全体を更新する（戦闘画面） */
function renderPlayerStatus() {
  const p = game.player;
  if (!p) return;

  const nameEl = document.getElementById('player-name');
  if (nameEl) nameEl.textContent = p.name;

  const detailEl = document.getElementById('player-detail');
  if (detailEl) detailEl.textContent =
    `ATK: ${p.attack}  DEF: ${p.defense}  LV: ${p.level}  EXP: ${p.exp}  MP: ${p.mp}/${p.maxMp}`;

  updateHpBar('player-hp-bar', 'player-hp-label', p.hp, p.maxHp);

  // MP バーを更新する
  const mpBar   = document.getElementById('player-mp-bar');
  const mpLabel = document.getElementById('player-mp-label');
  if (mpBar && mpLabel) {
    const mpPct = Math.max(0, Math.min(100, (p.mp / p.maxMp) * 100));
    mpBar.style.width   = mpPct + '%';
    mpLabel.textContent = `MP: ${p.mp} / ${p.maxMp}`;
  }
}

/** 敵ステータス全体を更新する */
function renderEnemyStatus() {
  const e = game.enemy;
  if (!e) return;

  const nameEl = document.getElementById('enemy-name');
  if (nameEl) nameEl.textContent = e.name;

  const detailEl = document.getElementById('enemy-detail');
  if (detailEl) detailEl.textContent =
    `ATK: ${e.attack}  DEF: ${e.defense}  EXP報酬: ${e.expReward}`;

  updateHpBar('enemy-hp-bar', 'enemy-hp-label', e.hp, e.maxHp);
}

/** アクションボタンの有効 / 無効を切り替える */
function setButtonsEnabled(enabled) {
  ['btn-attack', 'btn-skill', 'btn-flee'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !enabled;
  });
}

/* ==============================================================
   ログ出力関数
   ============================================================== */

function log(text, cssClass = 'system') {
  const area = document.getElementById('log-area');
  if (!area) return;
  const line = document.createElement('div');
  line.className  = `log-line ${cssClass}`;
  line.textContent = text;
  area.appendChild(line);
  area.scrollTop = area.scrollHeight;
}

function clearLog() {
  const area = document.getElementById('log-area');
  if (area) area.innerHTML = '';
}
