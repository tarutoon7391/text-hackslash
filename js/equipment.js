'use strict';

/* ==============================================================
   装備・クラフトシステム
   ============================================================== */

/**
 * 装備定義テーブル
 * slot: 頭 | 胴 | 足 | 靴 | アクセサリー | 武器
 * stats: { attack, defense, maxHp, maxMp } の加算値
 * effectType: 'critChance' | 'damageReduction' | 'none'
 * effectValue: エフェクトの強度（0.0〜1.0）
 */
const EQUIPMENT_DEFINITIONS = [

  /* ─── 武器 ─── */
  {
    id: 'leather_dagger',
    name: '革の短剣',
    slot: '武器',
    stats: { attack: 5, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '革': 3 },
  },
  {
    id: 'iron_sword',
    name: '鉄の剣',
    slot: '武器',
    stats: { attack: 15, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.10,
    effectDesc: '会心率+10%',
    recipe: { '鉄': 3 },
  },
  {
    id: 'gold_sword',
    name: '金の聖剣',
    slot: '武器',
    stats: { attack: 25, defense: 0, maxHp: 0, maxMp: 10 },
    effectType: 'mpRegen',
    effectValue: 2,
    effectDesc: '毎ターン MP+2',
    recipe: { '金': 3 },
  },
  {
    id: 'diamond_sword',
    name: 'ダイヤの剣',
    slot: '武器',
    stats: { attack: 40, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.15,
    effectDesc: '会心率+15%',
    recipe: { 'ダイヤ': 3 },
  },
  {
    id: 'dragon_greatsword',
    name: '竜鱗の大剣',
    slot: '武器',
    stats: { attack: 60, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.20,
    effectDesc: '会心率+20%',
    recipe: { '竜鱗': 4 },
  },

  /* ─── 頭 ─── */
  {
    id: 'leather_helm',
    name: '革の兜',
    slot: '頭',
    stats: { attack: 0, defense: 0, maxHp: 10, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.10,
    effectDesc: 'ダメージ軽減(10%の確率)',
    recipe: { '革': 2 },
  },
  {
    id: 'iron_helm',
    name: '鉄の兜',
    slot: '頭',
    stats: { attack: 0, defense: 5, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '鉄': 2 },
  },
  {
    id: 'gold_crown',
    name: '金の冠',
    slot: '頭',
    stats: { attack: 0, defense: 8, maxHp: 30, maxMp: 10 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '金': 2 },
  },
  {
    id: 'diamond_helm',
    name: 'ダイヤの兜',
    slot: '頭',
    stats: { attack: 0, defense: 12, maxHp: 45, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'ダイヤ': 2 },
  },
  {
    id: 'dragon_helm',
    name: '竜鱗の兜',
    slot: '頭',
    stats: { attack: 0, defense: 20, maxHp: 65, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '竜鱗': 3 },
  },

  /* ─── 胴 ─── */
  {
    id: 'leather_armor',
    name: '革の鎧',
    slot: '胴',
    stats: { attack: 0, defense: 5, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '革': 4 },
  },
  {
    id: 'iron_armor',
    name: '鉄の鎧',
    slot: '胴',
    stats: { attack: 0, defense: 15, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '鉄': 4 },
  },
  {
    id: 'gold_armor',
    name: '金の鎧',
    slot: '胴',
    stats: { attack: 0, defense: 25, maxHp: 0, maxMp: 15 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '金': 4 },
  },
  {
    id: 'diamond_armor',
    name: 'ダイヤの鎧',
    slot: '胴',
    stats: { attack: 0, defense: 40, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'ダイヤ': 4 },
  },
  {
    id: 'dragon_armor',
    name: '竜鱗の鎧',
    slot: '胴',
    stats: { attack: 0, defense: 60, maxHp: 0, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.15,
    effectDesc: 'ダメージ軽減(15%の確率)',
    recipe: { '竜鱗': 5 },
  },

  /* ─── 足 ─── */
  {
    id: 'leather_legs',
    name: '革の脚甲',
    slot: '足',
    stats: { attack: 0, defense: 3, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '革': 2 },
  },
  {
    id: 'iron_legs',
    name: '鉄の脚甲',
    slot: '足',
    stats: { attack: 0, defense: 10, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '鉄': 2 },
  },
  {
    id: 'gold_legs',
    name: '金の脚甲',
    slot: '足',
    stats: { attack: 0, defense: 16, maxHp: 10, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '金': 2 },
  },
  {
    id: 'diamond_legs',
    name: 'ダイヤの脚甲',
    slot: '足',
    stats: { attack: 0, defense: 25, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'ダイヤ': 2 },
  },
  {
    id: 'dragon_legs',
    name: '竜鱗の脚甲',
    slot: '足',
    stats: { attack: 0, defense: 35, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '竜鱗': 2 },
  },

  /* ─── 靴 ─── */
  {
    id: 'leather_boots',
    name: '革の靴',
    slot: '靴',
    stats: { attack: 0, defense: 2, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '革': 1 },
  },
  {
    id: 'iron_boots',
    name: '鉄の靴',
    slot: '靴',
    stats: { attack: 0, defense: 6, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '鉄': 1 },
  },
  {
    id: 'gold_boots',
    name: '金の靴',
    slot: '靴',
    stats: { attack: 0, defense: 10, maxHp: 0, maxMp: 5 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '金': 1 },
  },
  {
    id: 'diamond_boots',
    name: 'ダイヤの靴',
    slot: '靴',
    stats: { attack: 0, defense: 15, maxHp: 10, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'ダイヤ': 1 },
  },
  {
    id: 'dragon_boots',
    name: '竜鱗の靴',
    slot: '靴',
    stats: { attack: 0, defense: 22, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '竜鱗': 1 },
  },

  /* ─── アクセサリー ─── */
  {
    id: 'leather_band',
    name: '革のバンド',
    slot: 'アクセサリー',
    stats: { attack: 0, defense: 0, maxHp: 5, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '革': 1 },
  },
  {
    id: 'iron_ring',
    name: '鉄の指輪',
    slot: 'アクセサリー',
    stats: { attack: 5, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '鉄': 1 },
  },
  {
    id: 'gold_necklace',
    name: '金のネックレス',
    slot: 'アクセサリー',
    stats: { attack: 0, defense: 0, maxHp: 10, maxMp: 20 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '金': 1 },
  },
  {
    id: 'diamond_pendant',
    name: 'ダイヤの首飾り',
    slot: 'アクセサリー',
    stats: { attack: 0, defense: 0, maxHp: 30, maxMp: 10 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'ダイヤ': 2 },
  },
  {
    id: 'dragon_bracelet',
    name: '竜鱗のブレスレット',
    slot: 'アクセサリー',
    stats: { attack: 15, defense: 10, maxHp: 0, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '竜鱗': 2 },
  },

  /* ─── レアクラフト装備（ダンジョン別） ─── */

  /* D1: スライムの洞窟 — キラースライム核 + スライムクリスタル */
  {
    id: 'slime_liquid_armor',
    name: 'スライム溶解鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 12, maxHp: 30, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.12,
    effectDesc: 'ダメージ軽減(12%の確率)',
    recipe: { 'キラースライム核': 1, 'スライムクリスタル': 1 },
  },

  /* D2: ゴブリンの森 — シャーマンの杖 + 森の魔石 */
  {
    id: 'forest_magic_sword',
    name: '森の魔刀',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 24, defense: 0, maxHp: 0, maxMp: 8 },
    effectType: 'critChance',
    effectValue: 0.12,
    effectDesc: '会心率+12%',
    recipe: { 'シャーマンの杖': 1, '森の魔石': 1 },
  },

  /* D3: 骸骨の墓地 — 呪いの骨 + 死霊の涙 */
  {
    id: 'cursed_iron_boots',
    name: '呪いの鉄靴',
    slot: '靴',
    rarity: 'rare',
    stats: { attack: 0, defense: 22, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '呪いの骨': 1, '死霊の涙': 1 },
  },

  /* D4: 溶岩の洞窟 — 溶岩石 + 炎晶石 */
  {
    id: 'magma_greaves',
    name: '溶岩の戦闘靴',
    slot: '靴',
    rarity: 'rare',
    stats: { attack: 0, defense: 32, maxHp: 30, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '溶岩石': 1, '炎晶石': 1 },
  },

  /* D5: 魔王の城 — 闇の結晶 + 虚無の欠片 */
  {
    id: 'void_bracelet',
    name: '虚無のブレスレット',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 22, defense: 15, maxHp: 20, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.15,
    effectDesc: '会心率+15%',
    recipe: { '闇の結晶': 1, '虚無の欠片': 1 },
  },

  /* ─── ボスレアクラフト装備（ダンジョン別） ─── */

  /* D1: 王冠の欠片 + キングゼリー */
  {
    id: 'king_jelly_ring',
    name: 'ゼリーキングの指輪',
    slot: 'アクセサリー',
    rarity: 'bossRare',
    stats: { attack: 8, defense: 8, maxHp: 30, maxMp: 15 },
    effectType: 'critChance',
    effectValue: 0.12,
    effectDesc: '会心率+12%',
    recipe: { '王冠の欠片': 1, 'キングゼリー': 1 },
  },

  /* D2: 覇王の証 + 王の紋章 */
  {
    id: 'goblin_king_armor',
    name: 'ゴブリン王の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 40, maxHp: 40, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.15,
    effectDesc: 'ダメージ軽減(15%の確率)',
    recipe: { '覇王の証': 1, '王の紋章': 1 },
  },

  /* D3: 冥府の鍵 + 死神の鎌 */
  {
    id: 'death_knight_weapon',
    name: '死騎士の魔剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 58, defense: 0, maxHp: 0, maxMp: 12 },
    effectType: 'critChance',
    effectValue: 0.18,
    effectDesc: '会心率+18%',
    recipe: { '冥府の鍵': 1, '死神の鎌': 1 },
  },

  /* D4: 炎竜の魂 + 竜の炎石 */
  {
    id: 'flame_dragon_helm',
    name: '炎竜の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 48, maxHp: 70, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.22,
    effectDesc: 'ダメージ軽減(22%の確率)',
    recipe: { '炎竜の魂': 1, '竜の炎石': 1 },
  },

  /* D5: 魔王の魂 + 魔王の心臓 */
  {
    id: 'demon_king_robe',
    name: '魔王の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 10, defense: 75, maxHp: 60, maxMp: 20 },
    effectType: 'damageReduction',
    effectValue: 0.25,
    effectDesc: 'ダメージ軽減(25%の確率)',
    recipe: { '魔王の魂': 1, '魔王の心臓': 1 },
  },

  /* ─── エンドアイテム（ダンジョンごとに1種類、計5種類） ─── */

  /* D1: 頭 — 革×25 + キラースライム核×3 + スライムクリスタル×3 + 王冠の欠片×1 */
  {
    id: 'end_helm_cavern',
    name: '洞窟の覇者兜',
    slot: '頭',
    rarity: 'end',
    stats: { attack: 0, defense: 38, maxHp: 100, maxMp: 20 },
    effectType: 'damageReduction',
    effectValue: 0.22,
    effectDesc: 'ダメージ軽減(22%の確率)',
    recipe: { 'キラースライム核': 3, 'スライムクリスタル': 3, '王冠の欠片': 1, '革': 25 },
  },

  /* D2: 胴 — 鉄×25 + シャーマンの杖×3 + 森の魔石×3 + 覇王の証×1 */
  {
    id: 'end_armor_forest',
    name: '森の覇者鎧',
    slot: '胴',
    rarity: 'end',
    stats: { attack: 0, defense: 65, maxHp: 60, maxMp: 10 },
    effectType: 'damageReduction',
    effectValue: 0.20,
    effectDesc: 'ダメージ軽減(20%の確率)',
    recipe: { 'シャーマンの杖': 3, '森の魔石': 3, '覇王の証': 1, '鉄': 25 },
  },

  /* D3: 足 — 金×20 + 呪いの骨×3 + 死霊の涙×3 + 冥府の鍵×1 */
  {
    id: 'end_legs_graveyard',
    name: '墓地の覇者脚甲',
    slot: '足',
    rarity: 'end',
    stats: { attack: 0, defense: 68, maxHp: 70, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.20,
    effectDesc: 'ダメージ軽減(20%の確率)',
    recipe: { '呪いの骨': 3, '死霊の涙': 3, '冥府の鍵': 1, '金': 20 },
  },

  /* D4: 靴 — ダイヤ×20 + 溶岩石×3 + 炎晶石×3 + 炎竜の魂×1 */
  {
    id: 'end_boots_lava',
    name: '溶岩の覇者靴',
    slot: '靴',
    rarity: 'end',
    stats: { attack: 0, defense: 82, maxHp: 90, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.25,
    effectDesc: 'ダメージ軽減(25%の確率)',
    recipe: { '溶岩石': 3, '炎晶石': 3, '炎竜の魂': 1, 'ダイヤ': 20 },
  },

  /* D5: 武器 — 竜鱗×25 + 闇の結晶×3 + 虚無の欠片×3 + 魔王の魂×1 */
  {
    id: 'end_weapon_demon_king',
    name: '魔王の覇剣',
    slot: '武器',
    rarity: 'end',
    stats: { attack: 130, defense: 0, maxHp: 0, maxMp: 40 },
    effectType: 'critChance',
    effectValue: 0.30,
    effectDesc: '会心率+30%',
    recipe: { '闇の結晶': 3, '虚無の欠片': 3, '魔王の魂': 1, '竜鱗': 25 },
  },
];

/* ==============================================================
   インベントリ画面の描画
   ============================================================== */

/** クラフトリストの絞り込みフィルタ状態 */
let craftFilterSlot   = 'all';
let craftFilterRarity = 'all';

/** レア度の表示ラベルマッピング */
const RARITY_LABELS = {
  normal:   'ノーマル',
  rare:     'レア',
  bossRare: 'ボスレア',
  end:      'エンド',
};

/** インベントリ画面を描画する */
function renderInventory() {
  renderMaterialsList();
  renderEquippedList();
  renderCraftFilterTabs();
  renderCraftList();
}

/** 所持素材一覧を描画する */
function renderMaterialsList() {
  const el = document.getElementById('materials-list');
  if (!el) return;

  const mats = game.player.materials;
  const keys = Object.keys(mats).filter(k => mats[k] > 0);

  if (keys.length === 0) {
    el.innerHTML = '<span class="inv-empty">素材なし</span>';
    return;
  }

  el.innerHTML = keys.map(k => `<span class="mat-item">${k} × ${mats[k]}</span>`).join('');
}

/** 現在装備中の一覧を描画する */
function renderEquippedList() {
  const el = document.getElementById('equipped-list');
  if (!el) return;

  const slots = ['頭', '胴', '足', '靴', 'アクセサリー', '武器'];
  el.innerHTML = slots.map(slot => {
    const eqId  = game.player.equipment[slot];
    const eq    = eqId ? EQUIPMENT_DEFINITIONS.find(e => e.id === eqId) : null;
    const label = eq ? eq.name : '（未装備）';
    const btn   = eq
      ? `<button class="inv-btn" onclick="unequipItem('${slot}')">外す</button>`
      : '';
    return `<div class="eq-row"><span class="eq-slot">[${slot}]</span> <span>${label}</span>${btn}</div>`;
  }).join('');
}

/** クラフトフィルタータブのアクティブ状態を更新する */
function renderCraftFilterTabs() {
  const slotTabs   = document.getElementById('craft-slot-tabs');
  const rarityTabs = document.getElementById('craft-rarity-tabs');

  if (slotTabs) {
    slotTabs.querySelectorAll('.craft-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === craftFilterSlot);
    });
  }
  if (rarityTabs) {
    rarityTabs.querySelectorAll('.craft-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === craftFilterRarity);
    });
  }
}

/**
 * クラフトリストの部位フィルタを設定する
 * @param {string} slot - 'all' または部位名
 */
function setCraftSlotFilter(slot) {
  craftFilterSlot = slot;
  renderCraftFilterTabs();
  renderCraftList();
}

/**
 * クラフトリストのレア度フィルタを設定する
 * @param {string} rarity - 'all' | 'normal' | 'rare' | 'bossRare' | 'end'
 */
function setCraftRarityFilter(rarity) {
  craftFilterRarity = rarity;
  renderCraftFilterTabs();
  renderCraftList();
}

/** クラフト可能な装備一覧を描画する */
function renderCraftList() {
  const el = document.getElementById('craft-list');
  if (!el) return;

  const player = game.player;

  // フィルタリング
  const filtered = EQUIPMENT_DEFINITIONS.filter(eq => {
    if (craftFilterSlot !== 'all' && eq.slot !== craftFilterSlot) return false;
    const eqRarity = eq.rarity || 'normal';
    if (craftFilterRarity !== 'all' && eqRarity !== craftFilterRarity) return false;
    return true;
  });

  el.innerHTML = filtered.map(eq => {
    // 既に所持または装備中のものはスキップ
    const isEquipped = Object.values(player.equipment).includes(eq.id);
    const isOwned    = player.ownedEquipment.includes(eq.id);

    // 素材が足りているか判定
    const canCraft = Object.entries(eq.recipe).every(
      ([mat, cnt]) => (player.materials[mat] || 0) >= cnt
    );

    const recipeStr = Object.entries(eq.recipe)
      .map(([mat, cnt]) => `${mat}×${cnt}`)
      .join(' + ');

    const statsStr  = buildStatsStr(eq.stats);
    const eqRarity  = eq.rarity || 'normal';
    const rarityLabel = RARITY_LABELS[eqRarity] || 'ノーマル';
    const rarityBadge = `<span class="rarity-badge rarity-${eqRarity}">${rarityLabel}</span>`;

    if (isOwned || isEquipped) {
      // 所持済み → 装備ボタンを表示（未装備スロットの場合）
      if (!isEquipped) {
        return `
          <div class="craft-item owned">
            <div class="craft-name">[${eq.slot}] ${eq.name}${rarityBadge}</div>
            <div class="craft-stats">${statsStr}　${eq.effectDesc}</div>
            <button class="inv-btn" onclick="equipItem('${eq.id}')">装備する</button>
          </div>`;
      }
      // 装備中は craft-list では表示しない
      return '';
    }

    const btnHtml = canCraft
      ? `<button class="inv-btn" onclick="craftItem('${eq.id}')">クラフト（${recipeStr}）</button>`
      : `<button class="inv-btn disabled" disabled>クラフト不可（${recipeStr}）</button>`;

    return `
      <div class="craft-item ${canCraft ? '' : 'insufficient'}">
        <div class="craft-name">[${eq.slot}] ${eq.name}${rarityBadge}</div>
        <div class="craft-stats">${statsStr}　${eq.effectDesc}</div>
        ${btnHtml}
      </div>`;
  }).join('');
}

/**
 * stats オブジェクトを表示文字列に変換する
 * @param {{ attack:number, defense:number, maxHp:number, maxMp:number }} stats
 * @returns {string}
 */
function buildStatsStr(stats) {
  const parts = [];
  if (stats.attack  > 0) parts.push(`ATK+${stats.attack}`);
  if (stats.defense > 0) parts.push(`DEF+${stats.defense}`);
  if (stats.maxHp   > 0) parts.push(`HP+${stats.maxHp}`);
  if (stats.maxMp   > 0) parts.push(`MP+${stats.maxMp}`);
  return parts.length > 0 ? parts.join(' / ') : '---';
}

/* ==============================================================
   クラフト・装備操作
   ============================================================== */

/**
 * アイテムをクラフトする
 * @param {string} eqId - 装備 ID
 */
function craftItem(eqId) {
  const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === eqId);
  if (!eq) return;

  const player = game.player;

  // 素材チェック
  const canCraft = Object.entries(eq.recipe).every(
    ([mat, cnt]) => (player.materials[mat] || 0) >= cnt
  );
  if (!canCraft) {
    alert('素材が足りません！');
    return;
  }

  // 素材を消費する
  Object.entries(eq.recipe).forEach(([mat, cnt]) => {
    player.materials[mat] -= cnt;
  });

  // インベントリに追加
  player.ownedEquipment.push(eqId);

  // 図鑑: アイテム解鎖を記録する
  recordItemUnlock(eq.name);

  // 画面を再描画
  renderInventory();
}

/**
 * 装備を装着する
 * @param {string} eqId
 */
function equipItem(eqId) {
  const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === eqId);
  if (!eq) return;

  const player = game.player;

  // 同スロットにすでに装備があれば外す
  if (player.equipment[eq.slot]) {
    unequipItem(eq.slot);
  }

  player.equipment[eq.slot] = eqId;
  player.recalcStats();

  renderInventory();
  renderLobbyStatus();
}

/**
 * 装備を外す
 * @param {string} slot - 装備スロット名
 */
function unequipItem(slot) {
  const player = game.player;
  const eqId = player.equipment[slot];
  if (!eqId) return;

  delete player.equipment[slot];
  player.recalcStats();

  renderInventory();
  renderLobbyStatus();
}

/**
 * 装備効果をダメージ計算時に適用する
 * プレイヤーが受けるダメージに対して critChance / damageReduction を処理する
 * @param {number} rawDamage - 計算済みダメージ量
 * @param {'take'|'deal'} direction - take: 被ダメージ, deal: 与ダメージ
 * @returns {number} 効果適用後のダメージ
 */
function applyEquipmentEffects(rawDamage, direction) {
  let dmg = rawDamage;
  const player = game.player;

  Object.values(player.equipment).forEach(eqId => {
    if (!eqId) return;
    const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === eqId);
    if (!eq) return;

    if (direction === 'take' && eq.effectType === 'damageReduction') {
      // effectValue の確率で発動し、ダメージを 50% に軽減する
      if (Math.random() < eq.effectValue) {
        dmg = Math.floor(dmg * 0.5);
      }
    }
    if (direction === 'deal' && eq.effectType === 'critChance') {
      // 会心率: ダメージ 1.5 倍
      if (Math.random() < eq.effectValue) {
        dmg = Math.floor(dmg * 1.5);
        log('✦ 会心の一撃！', 'special');
      }
    }
  });

  return dmg;
}

/**
 * 攻撃ターン開始時に MP を回復する装備効果を処理する（金の聖剣）
 */
function applyMpRegenEffect() {
  const player = game.player;
  let mpRegen = 0;

  Object.values(player.equipment).forEach(eqId => {
    if (!eqId) return;
    const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === eqId);
    if (eq && eq.effectType === 'mpRegen') {
      mpRegen += eq.effectValue;
    }
  });

  if (mpRegen > 0) {
    player.mp = Math.min(player.maxMp, player.mp + mpRegen);
  }
}
