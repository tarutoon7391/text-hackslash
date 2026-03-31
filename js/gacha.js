'use strict';

/* ==============================================================
   ガチャシステム
   ============================================================== */

/**
 * ガチャ排出テーブル
 * type:      'material' | 'key' | 'limitedMaterial' | 'recipe' | 'book'
 * rarity:    'common' | 'rare' | 'bossRare' | 'key' | 'limited' | 'recipe' | 'book'
 * permanent: true → 一度入手したら排出テーブルから除外し確率を他に配分する
 * flag:      permanent アイテムの入手済みフラグ名（player.permanentItems[flag]）
 */
const GACHA_TABLE = [
  /* ── コモン素材 ── */
  { id: 'gacha_leather',   name: '革',           type: 'material',         rarity: 'common',   weight: 90 },
  { id: 'gacha_iron',      name: '鉄',           type: 'material',         rarity: 'common',   weight: 90 },
  { id: 'gacha_gold',      name: '金',           type: 'material',         rarity: 'common',   weight: 90 },
  { id: 'gacha_diamond',   name: 'ダイヤ',       type: 'material',         rarity: 'common',   weight: 90 },
  { id: 'gacha_dragon',    name: '竜鱗',         type: 'material',         rarity: 'common',   weight: 90 },

  /* ── レア素材 ── */
  { id: 'gacha_killer',    name: 'キラースライム核', type: 'material',     rarity: 'rare',     weight: 50 },
  { id: 'gacha_shaman',    name: 'シャーマンの杖',  type: 'material',      rarity: 'rare',     weight: 50 },
  { id: 'gacha_bone',      name: '呪いの骨',        type: 'material',      rarity: 'rare',     weight: 50 },
  { id: 'gacha_lava',      name: '溶岩石',          type: 'material',      rarity: 'rare',     weight: 50 },
  { id: 'gacha_dark',      name: '闇の結晶',        type: 'material',      rarity: 'rare',     weight: 50 },

  /* ── ボスレア素材 ── */
  { id: 'gacha_crown',     name: '王冠の欠片',  type: 'material',          rarity: 'bossRare', weight: 20 },
  { id: 'gacha_overlord',  name: '覇王の証',    type: 'material',          rarity: 'bossRare', weight: 20 },
  { id: 'gacha_death',     name: '冥府の鍵の欠片', type: 'material',       rarity: 'bossRare', weight: 20 },
  { id: 'gacha_flame',     name: '炎竜の魂',    type: 'material',          rarity: 'bossRare', weight: 20 },
  { id: 'gacha_demon',     name: '魔王の魂',    type: 'material',          rarity: 'bossRare', weight: 20 },

  /* ── ダンジョンの鍵 ── */
  { id: 'key_xp',          name: 'XPダンジョンの鍵',       type: 'key', rarity: 'key', weight: 27 },
  { id: 'key_raremon',     name: 'レアモンダンジョンの鍵', type: 'key', rarity: 'key', weight: 27 },
  { id: 'key_skill',       name: 'スキルダンジョンの鍵',   type: 'key', rarity: 'key', weight: 26 },

  /* ── 限定素材 ── */
  { id: 'gacha_mithril',   name: 'ミスリル',  type: 'limitedMaterial', rarity: 'limited', weight: 30 },
  { id: 'gacha_souten',    name: '蒼天晶',    type: 'limitedMaterial', rarity: 'limited', weight: 30 },

  /* ── クラフトレシピ（永続品） ── */
  {
    id: 'recipe_aogin',
    name: '蒼銀の剣のレシピ',
    type: 'recipe',
    rarity: 'recipe',
    permanent: true,
    flag: 'hasRecipeAogin',
    weight: 20,
  },

  /* ── スキルツリーの書（永続品） ── */
  {
    id: 'book_makenshi',
    name: '魔剣士の書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookMakenshi',
    weight: 10,
  },
];

/** レアリティ別の演出色 */
const GACHA_RARITY_COLORS = {
  common:   '#00ff41',
  rare:     '#00ccff',
  bossRare: '#aa44ff',
  key:      '#ffaa00',
  limited:  '#ffdd00',
  recipe:   '#ff8800',
  book:     '#ff2244',
};

/** レアリティ別の表示ラベル */
const GACHA_RARITY_LABELS = {
  common:   'コモン',
  rare:     'レア',
  bossRare: 'ボスレア',
  key:      '鍵',
  limited:  '限定',
  recipe:   'レシピ',
  book:     '書',
};

/* ==============================================================
   ガチャロジック
   ============================================================== */

/**
 * ガチャ排出プールを構築する
 * 永続品を取得済みの場合はプールから除外し、重みを残りアイテムに均等配分する
 * @returns {Array<object>}
 */
function buildGachaPool() {
  const p = game.player;
  const pool          = [];
  let   removedWeight = 0;

  GACHA_TABLE.forEach(item => {
    if (item.permanent && p.permanentItems[item.flag]) {
      removedWeight += item.weight;
      return;
    }
    pool.push({ ...item });
  });

  // 除外分の重みを残りアイテムに均等配分する
  if (removedWeight > 0 && pool.length > 0) {
    const bonus = removedWeight / pool.length;
    pool.forEach(item => { item.weight += bonus; });
  }

  return pool;
}

/**
 * 重み付き抽選で1件選ぶ
 * @param {Array<object>} pool
 * @returns {object}
 */
function weightedPick(pool) {
  const total = pool.reduce((sum, item) => sum + item.weight, 0);
  let   r     = Math.random() * total;
  for (const item of pool) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return pool[pool.length - 1];
}

/**
 * ガチャを指定回数引いて結果配列を返す
 * 永続品を引いた後は即フラグを立て、以降の抽選では排出されないようにする
 * @param {number} times
 * @returns {Array<object>}
 */
function drawGacha(times) {
  const results = [];
  for (let i = 0; i < times; i++) {
    const pool = buildGachaPool();
    const item = weightedPick(pool);
    results.push(item);
    // 永続品を引いたら即フラグを立て次の抽選に反映する
    if (item.permanent) {
      game.player.permanentItems[item.flag] = true;
    }
  }
  return results;
}

/**
 * ガチャ結果をインベントリに反映する
 * @param {Array<object>} results
 */
function applyGachaResults(results) {
  const p = game.player;
  results.forEach(item => {
    if (item.type === 'material' || item.type === 'limitedMaterial' || item.type === 'key') {
      p.materials[item.name] = (p.materials[item.name] || 0) + 1;
    }
    // recipe / book は drawGacha 内でフラグ設定済みのためここでは処理不要
  });
}

/* ==============================================================
   ガチャ画面の描画・操作
   ============================================================== */

/** ガチャ画面全体を描画する */
function renderGachaScreen() {
  if (!game.player) return;
  const p       = game.player;
  const tickets = p.gachaTickets || 0;

  // ログインアカウントが変わった場合に前のアカウントの履歴が残らないようクリアする
  const logEl = document.getElementById('gacha-log');
  if (logEl) logEl.innerHTML = '';

  const statusEl = document.getElementById('gacha-status');
  if (statusEl) {
    statusEl.innerHTML = `🎫 所持ガチャチケット: <strong>${tickets}</strong> 枚`;
  }

  const permEl = document.getElementById('gacha-perm-status');
  if (permEl) {
    const hasRecipe = p.permanentItems.hasRecipeAogin   ? '✅ 入手済み' : '❌ 未入手';
    const hasBook   = p.permanentItems.hasBookMakenshi  ? '✅ 入手済み' : '❌ 未入手';
    permEl.innerHTML =
      `<span>📜 蒼銀の剣のレシピ: ${hasRecipe}</span>` +
      `<span>📖 魔剣士の書: ${hasBook}</span>`;
  }

  const btn1  = document.getElementById('btn-gacha-1');
  const btn10 = document.getElementById('btn-gacha-10');
  if (btn1)  btn1.disabled  = tickets < 1;
  if (btn10) btn10.disabled = tickets < 10;
}

/** 1回ガチャを引く */
function executeGachaOnce() {
  const p = game.player;
  if ((p.gachaTickets || 0) < 1) return;
  p.gachaTickets -= 1;
  const results = drawGacha(1);
  applyGachaResults(results);
  renderGachaScreen();
  showGachaAnimation(results);
}

/** 10連ガチャを引く */
function executeGachaTen() {
  const p = game.player;
  if ((p.gachaTickets || 0) < 10) return;
  p.gachaTickets -= 10;
  const results = drawGacha(10);
  applyGachaResults(results);
  renderGachaScreen();
  showGachaAnimation(results);
}

/**
 * ガチャ結果を1件ずつ順番に表示するアニメーション演出
 * @param {Array<object>} results
 */
function showGachaAnimation(results) {
  const logEl = document.getElementById('gacha-log');
  if (!logEl) return;

  logEl.innerHTML = '';

  const header = document.createElement('div');
  header.className   = 'gacha-summoning';
  header.textContent = '--- 召喚中 ---';
  logEl.appendChild(header);

  const INTERVAL_MS = 420;

  results.forEach((item, idx) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className  = 'gacha-result-line';
      line.style.color = GACHA_RARITY_COLORS[item.rarity] || '#00ff41';

      const rarityLabel = GACHA_RARITY_LABELS[item.rarity] || '';

      if (item.type === 'recipe') {
        line.textContent = `✦ クラフトレシピ「${item.name}」を入手！`;
      } else if (item.type === 'book') {
        line.textContent = `✦ スキルの書「${item.name}」を入手！`;
      } else if (item.type === 'key') {
        line.textContent = `🗝 [${rarityLabel}] ${item.name} を入手！`;
      } else if (item.type === 'limitedMaterial') {
        line.textContent = `💎 [${rarityLabel}] ${item.name} × 1 を入手！`;
      } else {
        line.textContent = `● [${rarityLabel}] ${item.name} × 1 を入手！`;
      }

      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;

      // 最後の結果を表示したらヘッダーテキストを変える
      if (idx === results.length - 1) {
        header.textContent = '--- 召喚完了 ---';
        header.style.color = '#00ccff';
      }
    }, (idx + 1) * INTERVAL_MS);
  });
}

/**
 * 排出率一覧をガチャログエリアに表示する
 * 永続品はフラグにより確率が変動するため、現在のプール状態で計算する
 * 入手済みの永続品は「入手済み」と表示する
 */
function showGachaRates() {
  const logEl = document.getElementById('gacha-log');
  if (!logEl) return;
  if (!game.player) return;

  const p = game.player;

  // 現在のプールで合計重みを計算する（入手済み永続品は除外済み）
  const pool        = buildGachaPool();
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);

  logEl.innerHTML = '';

  const header = document.createElement('div');
  header.className   = 'gacha-summoning';
  header.textContent = '--- 排出率一覧 ---';
  logEl.appendChild(header);

  GACHA_TABLE.forEach(item => {
    const line = document.createElement('div');
    line.className  = 'gacha-result-line';
    line.style.color = GACHA_RARITY_COLORS[item.rarity] || '#00ff41';

    const rarityLabel = GACHA_RARITY_LABELS[item.rarity] || '';

    // 入手済み永続品かどうか判定する
    const isObtained = item.permanent && p.permanentItems[item.flag];

    if (isObtained) {
      line.textContent = `[${rarityLabel}] ${item.name} - 入手済み`;
    } else {
      // 有効プール内でのこのアイテムの現在重みを取得する
      const poolItem = pool.find(pi => pi.id === item.id);
      if (poolItem) {
        const percent = (poolItem.weight / totalWeight * 100).toFixed(2);
        line.textContent = `[${rarityLabel}] ${item.name} - ${percent}%`;
      } else {
        line.textContent = `[${rarityLabel}] ${item.name} - 0.00%`;
      }
    }

    logEl.appendChild(line);
  });
}

