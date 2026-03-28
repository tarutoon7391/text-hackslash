'use strict';

/* ==============================================================
   図鑑システム
   ============================================================== */

/** 現在アクティブなタブ ('monster' | 'item') */
let encCurrentTab = 'monster';

/* ==============================================================
   データ収集ヘルパー
   ============================================================== */

/**
 * すべてのモンスターをダンジョン定義から収集して返す
 * 各ダンジョンの通常敵・レア敵・ボスを順番に列挙する
 * @returns {Array<{name:string, dungeonName:string, dungeonId:number, monsterType:string}>}
 */
function getAllMonsters() {
  const monsters = [];

  DUNGEON_DEFINITIONS.forEach(dungeon => {
    dungeon.normalEnemies.forEach(e => {
      if (!monsters.find(m => m.name === e.name)) {
        monsters.push({
          name:        e.name,
          dungeonName: dungeon.name,
          dungeonId:   dungeon.id,
          monsterType: 'normal',
        });
      }
    });

    if (!monsters.find(m => m.name === dungeon.rareEnemy.name)) {
      monsters.push({
        name:        dungeon.rareEnemy.name,
        dungeonName: dungeon.name,
        dungeonId:   dungeon.id,
        monsterType: 'rare',
      });
    }

    if (!monsters.find(m => m.name === dungeon.boss.name)) {
      monsters.push({
        name:        dungeon.boss.name,
        dungeonName: dungeon.name,
        dungeonId:   dungeon.id,
        monsterType: 'boss',
      });
    }
  });

  return monsters;
}

/**
 * 指定モンスターが落とす可能性のある素材一覧を返す
 * @param {{dungeonId:number, monsterType:string}} monsterEntry
 * @returns {string[]}
 */
function getMonsterDrops(monsterEntry) {
  const dungeon = DUNGEON_DEFINITIONS.find(d => d.id === monsterEntry.dungeonId);
  if (!dungeon) return [];

  switch (monsterEntry.monsterType) {
    case 'normal': return [dungeon.drops.common];
    case 'rare':   return [dungeon.drops.rare, dungeon.drops.common];
    case 'boss':   return [dungeon.drops.boss, dungeon.drops.common];
    default:       return [];
  }
}

/**
 * すべてのアイテムを収集して返す（素材 + 装備）
 * 素材はダンジョンドロップから、装備は EQUIPMENT_DEFINITIONS から収集する
 * @returns {Array<{name:string, type:string, howToGet:string, effect:string, slot?:string}>}
 */
function getAllItems() {
  const items = [];
  const seen  = new Set();

  // 素材: ダンジョンドロップ定義から収集する
  DUNGEON_DEFINITIONS.forEach(dungeon => {
    const d = dungeon.drops;

    const addMat = (name, howToGet) => {
      if (!name || seen.has(name)) return;
      seen.add(name);
      items.push({ name, type: '素材', howToGet, effect: 'クラフト素材として使用' });
    };

    addMat(d.common, `${dungeon.name} のドロップ（通常）`);
    addMat(d.rare,   `${dungeon.name} のレアドロップ`);
    addMat(d.boss,   `${dungeon.name} のボスドロップ`);
  });

  // 装備: EQUIPMENT_DEFINITIONS から収集する
  EQUIPMENT_DEFINITIONS.forEach(eq => {
    if (seen.has(eq.name)) return;
    seen.add(eq.name);

    const recipeStr = Object.entries(eq.recipe)
      .map(([mat, cnt]) => `${mat}×${cnt}`)
      .join(' + ');

    // stats 文字列と effectDesc を組み合わせて効果文字列を作る
    const statsStr = buildStatsStr(eq.stats);
    const parts    = [];
    if (statsStr !== '---') parts.push(statsStr);
    if (eq.effectDesc !== '---') parts.push(eq.effectDesc);

    items.push({
      name:     eq.name,
      type:     '装備',
      howToGet: `クラフト（${recipeStr}）`,
      effect:   parts.length > 0 ? parts.join(' / ') : '---',
      slot:     eq.slot,
    });
  });

  return items;
}

/* ==============================================================
   図鑑画面の描画
   ============================================================== */

/** 図鑑画面全体を描画する */
function renderEncyclopedia() {
  encCurrentTab = encCurrentTab || 'monster';
  updateEncCounts();

  const monsterList = document.getElementById('enc-monster-list');
  const itemList    = document.getElementById('enc-item-list');
  const monsterTab  = document.getElementById('enc-tab-monster');
  const itemTab     = document.getElementById('enc-tab-item');

  if (encCurrentTab === 'monster') {
    if (monsterList) monsterList.style.display = 'block';
    if (itemList)    itemList.style.display    = 'none';
    if (monsterTab)  monsterTab.classList.add('active');
    if (itemTab)     itemTab.classList.remove('active');
    renderEncMonsterList();
  } else {
    if (monsterList) monsterList.style.display = 'none';
    if (itemList)    itemList.style.display    = 'block';
    if (monsterTab)  monsterTab.classList.remove('active');
    if (itemTab)     itemTab.classList.add('active');
    renderEncItemList();
  }
}

/** コンプリート率のカウント表示を更新する */
function updateEncCounts() {
  const allMonsters = getAllMonsters();
  const allItems    = getAllItems();
  const p           = game.player;

  const defeatedCount = allMonsters.filter(m => p.defeatFlags[m.name]).length;
  const unlockedCount = allItems.filter(i => p.itemUnlockFlags[i.name]).length;

  const monsterTab = document.getElementById('enc-tab-monster');
  const itemTab    = document.getElementById('enc-tab-item');

  if (monsterTab) {
    monsterTab.textContent = `🐲 モンスター図鑑 ${defeatedCount}/${allMonsters.length}`;
  }
  if (itemTab) {
    itemTab.textContent = `💎 アイテム図鑑 ${unlockedCount}/${allItems.length}`;
  }
}

/** モンスターリストを描画する */
function renderEncMonsterList() {
  const el = document.getElementById('enc-monster-list');
  if (!el) return;

  const allMonsters = getAllMonsters();
  const p           = game.player;

  el.innerHTML = allMonsters.map(m => {
    const encountered = !!p.encounterFlags[m.name];
    const defeated    = !!p.defeatFlags[m.name];

    if (!encountered && !defeated) {
      return `<div class="enc-entry unknown"><span class="enc-name">???</span></div>`;
    }

    const nameClass = defeated ? 'enc-name' : 'enc-name dim';
    return `<div class="enc-entry ${defeated ? 'defeated' : 'encountered'}" onclick="showMonsterModal('${m.name}')">
      <span class="${nameClass}">${m.name}</span>
      <span class="enc-meta">${m.dungeonName}</span>
    </div>`;
  }).join('');
}

/** アイテムリストを描画する */
function renderEncItemList() {
  const el = document.getElementById('enc-item-list');
  if (!el) return;

  const allItems = getAllItems();
  const p        = game.player;

  el.innerHTML = allItems.map(item => {
    const unlocked = !!p.itemUnlockFlags[item.name];

    if (!unlocked) {
      return `<div class="enc-entry unknown"><span class="enc-name">???</span></div>`;
    }

    return `<div class="enc-entry unlocked" onclick="showItemModal('${item.name}')">
      <span class="enc-name">${item.name}</span>
      <span class="enc-meta enc-type-badge">[${item.type}]</span>
    </div>`;
  }).join('');
}

/* ==============================================================
   タブ切り替え
   ============================================================== */

/**
 * 図鑑タブを切り替える
 * @param {'monster'|'item'} tab
 */
function switchEncTab(tab) {
  encCurrentTab = tab;
  renderEncyclopedia();
}

/* ==============================================================
   詳細モーダル
   ============================================================== */

/**
 * モンスター詳細モーダルを表示する
 * @param {string} name - モンスター名
 */
function showMonsterModal(name) {
  const allMonsters = getAllMonsters();
  const m           = allMonsters.find(mon => mon.name === name);
  if (!m) return;

  const p           = game.player;
  const encountered = !!p.encounterFlags[m.name];
  const defeated    = !!p.defeatFlags[m.name];

  if (!encountered && !defeated) return;

  const drops    = getMonsterDrops(m);
  const dropsStr = defeated
    ? drops.join('、')
    : drops.map(() => '???').join('、');
  const countStr = defeated ? `${p.defeatCounts[m.name] || 0} 回` : '—';

  const content = `
    <h3 class="enc-modal-title">${m.name}</h3>
    <div class="enc-modal-row">
      <span class="enc-modal-label">出現ダンジョン</span>
      <span>${m.dungeonName}</span>
    </div>
    <div class="enc-modal-row">
      <span class="enc-modal-label">討伐回数</span>
      <span>${countStr}</span>
    </div>
    <div class="enc-modal-row">
      <span class="enc-modal-label">ドロップアイテム</span>
      <span>${dropsStr}</span>
    </div>
  `;
  openEncModal(content);
}

/**
 * アイテム詳細モーダルを表示する
 * @param {string} name - アイテム名
 */
function showItemModal(name) {
  const allItems = getAllItems();
  const item     = allItems.find(i => i.name === name);
  if (!item) return;

  const p = game.player;
  if (!p.itemUnlockFlags[item.name]) return;

  const slotStr = item.slot ? `（${item.slot}スロット）` : '';
  const content = `
    <h3 class="enc-modal-title">${item.name}</h3>
    <div class="enc-modal-row">
      <span class="enc-modal-label">種別</span>
      <span>${item.type}${slotStr}</span>
    </div>
    <div class="enc-modal-row">
      <span class="enc-modal-label">入手方法</span>
      <span>${item.howToGet}</span>
    </div>
    <div class="enc-modal-row">
      <span class="enc-modal-label">効果</span>
      <span>${item.effect}</span>
    </div>
  `;
  openEncModal(content);
}

/**
 * モーダルを開いてコンテンツを設定する
 * @param {string} contentHtml
 */
function openEncModal(contentHtml) {
  const overlay = document.getElementById('enc-modal-overlay');
  const content = document.getElementById('enc-modal-content');
  if (!overlay || !content) return;
  content.innerHTML = contentHtml;
  overlay.style.display = 'flex';
}

/** モーダルを閉じる */
function closeEncModal() {
  const overlay = document.getElementById('enc-modal-overlay');
  if (overlay) overlay.style.display = 'none';
}

/* ==============================================================
   記録関数（他モジュールから呼び出される）
   ============================================================== */

/**
 * モンスターとの遭遇を記録する（戦闘開始時に呼び出す）
 * @param {string} name - モンスター名
 */
function recordMonsterEncounter(name) {
  if (!game.player) return;
  game.player.encounterFlags[name] = true;
}

/**
 * モンスターの討伐を記録する（勝利時のみ呼び出す）
 * @param {string} name - モンスター名
 */
function recordMonsterDefeat(name) {
  if (!game.player) return;
  game.player.defeatFlags[name]  = true;
  game.player.defeatCounts[name] = (game.player.defeatCounts[name] || 0) + 1;
}

/**
 * アイテムの解鎖を記録する（ドロップ時またはクラフト時に呼び出す）
 * @param {string} name - アイテム名
 */
function recordItemUnlock(name) {
  if (!game.player) return;
  game.player.itemUnlockFlags[name] = true;
}
