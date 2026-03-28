'use strict';

/* ==============================================================
   UI 更新関数
   ============================================================== */

/** HP バーと HP ラベルを更新する */
function updateHpBar(barId, labelId, current, max) {
  const bar   = document.getElementById(barId);
  const label = document.getElementById(labelId);
  const pct   = Math.max(0, Math.min(100, (current / max) * 100));

  bar.style.width = pct + '%';
  label.textContent = `HP: ${current} / ${max}`;

  // HP 残量に応じて色を変える
  bar.classList.remove('danger', 'warning');
  if (pct <= 25) {
    bar.classList.add('danger');
  } else if (pct <= 50) {
    bar.classList.add('warning');
  }
}

/** プレイヤーステータス全体を更新する */
function renderPlayerStatus() {
  const p = game.player;
  document.getElementById('player-name').textContent   = p.name;
  document.getElementById('player-detail').textContent =
    `ATK: ${p.attack}  DEF: ${p.defense}  LV: ${p.level}  EXP: ${p.exp}`;
  updateHpBar('player-hp-bar', 'player-hp-label', p.hp, p.maxHp);
}

/** 敵ステータス全体を更新する */
function renderEnemyStatus() {
  const e = game.enemy;
  document.getElementById('enemy-name').textContent   = e.name;
  document.getElementById('enemy-detail').textContent =
    `ATK: ${e.attack}  DEF: ${e.defense}  EXP報酬: ${e.expReward}`;
  updateHpBar('enemy-hp-bar', 'enemy-hp-label', e.hp, e.maxHp);
}

/** アクションボタンの有効 / 無効を切り替える */
function setButtonsEnabled(enabled) {
  ['btn-attack', 'btn-skill', 'btn-flee'].forEach(id => {
    document.getElementById(id).disabled = !enabled;
  });
}

/** 「次の戦闘へ」ボタンの表示 / 非表示を切り替える */
function showNextBtn(show, label) {
  const btn = document.getElementById('next-btn');
  btn.style.display = show ? 'block' : 'none';
  if (label) btn.textContent = label;
}

/* ==============================================================
   ログ出力関数
   ============================================================== */

/**
 * バトルログにメッセージを追加する
 * @param {string} text      - 表示テキスト
 * @param {string} cssClass  - log-line に付与するクラス名
 */
function log(text, cssClass = 'system') {
  const area = document.getElementById('log-area');
  const line = document.createElement('div');
  line.className = `log-line ${cssClass}`;
  line.textContent = text;
  area.appendChild(line);
  // 常に最新行が見えるようにスクロール
  area.scrollTop = area.scrollHeight;
}

/** ログエリアを空にする */
function clearLog() {
  document.getElementById('log-area').innerHTML = '';
}
