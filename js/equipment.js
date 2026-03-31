'use strict';

/* ==============================================================
   装備システム（インベントリ・クラフト・強化）
   ============================================================== */


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
  legend:   'レジェンド',
  charm:    'チャーム',
  limited:  '限定',
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

  const player = game.player;
  const slots = ['頭', '胴', '足', '靴', 'アクセサリー', '武器', 'チャーム'];
  el.innerHTML = slots.map(slot => {
    const eqId  = player.equipment[slot];
    const eq    = eqId ? EQUIPMENT_DEFINITIONS.find(e => e.id === eqId) : null;
    const enhLv = (eq && player.enhanceLevels[eqId]) || 0;

    if (!eq) {
      return `<div class="eq-row"><span class="eq-slot">[${slot}]</span><span class="eq-unequipped">未装備</span></div>`;
    }

    const label = enhLv > 0 ? `${eq.name} +${enhLv}` : eq.name;
    const statsHtml = buildEnhancedStatsStr(eq, enhLv, player.level);
    const unequipBtn = `<button class="inv-btn" onclick="unequipItem('${slot}')">外す</button>`;
    // チャームスロットは強化不可
    const isCharmSlot = slot === 'チャーム';
    const canEnh = !isCharmSlot ? canAffordEnhancement(eq, enhLv + 1) : false;
    const enhBtn = !isCharmSlot
      ? `<button class="inv-btn enhance-btn${canEnh ? '' : ' disabled'}" onclick="showEnhanceModal('${eqId}')">⬆ 強化</button>`
      : '';
    return `<div class="eq-row"><div class="eq-info"><span class="eq-slot">[${slot}]</span><span class="eq-name">${label}</span></div><div class="eq-controls"><span class="eq-stats">${statsHtml}</span>${unequipBtn}${enhBtn}</div></div>`;
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
  // チャームアイテム（rarity='charm'）は「チャーム」タブ選択時のみ表示し、
  // 通常フィルター（すべて・ノーマル・レアなど）には含めない
  // 限定アイテム（rarity='limited'）は「限定」タブ選択時にレシピ入手済みのもののみ表示する
  const filtered = EQUIPMENT_DEFINITIONS.filter(eq => {
    const eqRarity = eq.rarity || 'normal';
    // チャームは「チャーム」タブ専用
    if (eqRarity === 'charm') return craftFilterRarity === 'charm';
    // 「チャーム」タブ選択中は非チャームを非表示
    if (craftFilterRarity === 'charm') return false;
    // 「限定」タブ選択中はレシピ入手済みの限定装備のみ表示
    if (craftFilterRarity === 'limited') {
      if (eqRarity !== 'limited') return false;
      // レシピ不要の限定装備は常に表示、レシピ必須の場合は入手済みのみ表示
      if (!eq.requiresRecipe) return true;
      return !!player.permanentItems[eq.requiresRecipe];
    }
    if (craftFilterSlot !== 'all' && eq.slot !== craftFilterSlot) return false;
    if (craftFilterRarity !== 'all' && eqRarity !== craftFilterRarity) return false;
    return true;
  });

  el.innerHTML = filtered.map(eq => {
    // 既に所持または装備中のものはスキップ
    const isEquipped = Object.values(player.equipment).includes(eq.id);
    const isOwned    = player.ownedEquipment.includes(eq.id);

    // 成長型武器の表示ステータスは現在レベル基準で計算する
    const displayStats = eq.isGrowth
      ? computeGrowthStats(eq, player.level)
      : eq.stats;

    // 素材が足りているか判定
    const canCraft = Object.entries(eq.recipe).every(
      ([mat, cnt]) => (player.materials[mat] || 0) >= cnt
    );

    // レシピ必須フラグ
    const hasRequiredRecipe = !eq.requiresRecipe || !!player.permanentItems[eq.requiresRecipe];

    // 素材ごとに足りているか判定し色分け表示するHTML
    const recipeHtml = `<div class="craft-recipe">${
      Object.entries(eq.recipe)
        .map(([mat, cnt]) => {
          const have = player.materials[mat] || 0;
          const ok   = have >= cnt;
          return `<span class="craft-mat ${ok ? 'ok' : 'ng'}">${mat}×${cnt}</span>`;
        })
        .join('<span class="craft-mat-sep"> + </span>')
    }</div>`;

    const statsStr  = buildStatsStr(displayStats);
    const eqRarity  = eq.rarity || 'normal';
    const rarityLabel = RARITY_LABELS[eqRarity] || 'ノーマル';
    const rarityBadge = `<span class="rarity-badge rarity-${eqRarity}">${rarityLabel}</span>`;

    // レベル連動型効果の場合は現在レベルでの実効値を末尾に追記する
    let effectDescDisplay = eq.effectDesc;
    if (eq.effectType === 'mpRegen' && eq.effectLevelCoeff !== undefined) {
      const currentMpRegen = Math.max(1, Math.floor(player.level * eq.effectLevelCoeff));
      effectDescDisplay = `${eq.effectDesc}（現在: MP+${currentMpRegen}/ターン）`;
    }

    // 成長型武器の補足情報
    const growthNote = eq.isGrowth
      ? `<div class="craft-stats growth-note">⬆ 成長型：レベルアップで強化（Lv${player.level}時点のステータス）</div>`
      : '';

    // レシピ未入手の場合の表示
    const recipeNote = (!hasRequiredRecipe)
      ? `<div class="craft-recipe-lock">🔒 レシピ未入手（ガチャから入手可能）</div>`
      : '';

    // チャームは強化不可
    const isCharm = eq.slot === 'チャーム';

    if (isOwned || isEquipped) {
      // 所持済み → 装備ボタンを表示（未装備スロットの場合）
      if (!isEquipped) {
        const ownedEnhLv = player.enhanceLevels[eq.id] || 0;
        const ownedDisplayName = ownedEnhLv > 0 ? `${eq.name} +${ownedEnhLv}` : eq.name;
        const canEnh = !isCharm && canAffordEnhancement(eq, ownedEnhLv + 1);
        const enhBtn = isCharm ? '' : `<button class="inv-btn enhance-btn${canEnh ? '' : ' disabled'}" onclick="showEnhanceModal('${eq.id}')">⬆ 強化</button>`;
        // 強化済みの場合は強化分を黄色で表示する
        const ownedStatsStr = buildEnhancedStatsStr(eq, ownedEnhLv, player.level);
        return `
          <div class="craft-item owned">
            <div class="craft-name">[${eq.slot}] ${ownedDisplayName}${rarityBadge}</div>
            <div class="craft-stats">${ownedStatsStr}　${effectDescDisplay}</div>
            ${growthNote}
            <button class="inv-btn" onclick="equipItem('${eq.id}')">装備する</button>
            ${enhBtn}
          </div>`;
      }
      // 装備中は craft-list では表示しない
      return '';
    }

    const canCraftFull = canCraft && hasRequiredRecipe;
    const btnHtml = canCraftFull
      ? `<button class="inv-btn" onclick="craftItem('${eq.id}')">クラフト</button>`
      : `<button class="inv-btn disabled" disabled>クラフト不可</button>`;

    return `
      <div class="craft-item ${canCraftFull ? '' : 'insufficient'}">
        <div class="craft-name">[${eq.slot}] ${eq.name}${rarityBadge}</div>
        <div class="craft-stats">${statsStr}　${effectDescDisplay}</div>
        ${growthNote}
        ${recipeNote}
        ${recipeHtml}
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

/**
 * 強化済み装備のステータス表示 HTML 文字列を生成する
 * 強化分は黄色文字で (+ XX) 形式で表示する
 * @param {object} eq          - 装備定義
 * @param {number} enhLv       - 強化レベル
 * @param {number} playerLevel - プレイヤーレベル（成長型武器用）
 * @returns {string} HTML 文字列
 */
function buildEnhancedStatsStr(eq, enhLv, playerLevel) {
  const baseStats = eq.isGrowth ? computeGrowthStats(eq, playerLevel) : eq.stats;

  if (enhLv <= 0) {
    return buildStatsStr(baseStats);
  }

  /**
   * 強化ボーナスを黄色の (+ XX) 形式で返す
   * @param {number} bonus
   * @returns {string}
   */
  const bonusSpan = bonus => bonus > 0 ? `<span class="enhance-bonus">(+${bonus})</span>` : '';

  const parts = [];

  if (eq.isGrowth) {
    // 成長型特殊強化: 全ステータス × (1 + 0.1 × enhLv)
    const factor   = 1 + 0.1 * enhLv;
    const atkTotal = Math.floor(baseStats.attack  * factor);
    const defTotal = Math.floor(baseStats.defense * factor);
    const hpTotal  = Math.floor(baseStats.maxHp   * factor);
    const mpTotal  = Math.floor(baseStats.maxMp   * factor);
    if (atkTotal > 0) parts.push(`ATK+${atkTotal}${bonusSpan(atkTotal - baseStats.attack)}`);
    if (defTotal > 0) parts.push(`DEF+${defTotal}${bonusSpan(defTotal - baseStats.defense)}`);
    if (hpTotal  > 0) parts.push(`HP+${hpTotal}${bonusSpan(hpTotal - baseStats.maxHp)}`);
    if (mpTotal  > 0) parts.push(`MP+${mpTotal}${bonusSpan(mpTotal - baseStats.maxMp)}`);
  } else {
    const boost      = getEnhanceStatBoost(eq);
    const totalBonus = enhLv * boost;
    const slot       = eq.slot;
    const atkBonus   = slot === '武器' ? totalBonus : 0;
    const defBonus   = ['頭', '胴', '足', '靴'].includes(slot) ? totalBonus : 0;
    const hpBonus    = slot === 'アクセサリー' ? totalBonus : 0;

    const atkTotal = (baseStats.attack  || 0) + atkBonus;
    const defTotal = (baseStats.defense || 0) + defBonus;
    const hpTotal  = (baseStats.maxHp   || 0) + hpBonus;
    const mpTotal  =  baseStats.maxMp   || 0;

    if (atkTotal > 0) parts.push(`ATK+${atkTotal}${bonusSpan(atkBonus)}`);
    if (defTotal > 0) parts.push(`DEF+${defTotal}${bonusSpan(defBonus)}`);
    if (hpTotal  > 0) parts.push(`HP+${hpTotal}${bonusSpan(hpBonus)}`);
    if (mpTotal  > 0) parts.push(`MP+${mpTotal}`);
  }

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

  // レシピ必須チェック
  if (eq.requiresRecipe && !player.permanentItems[eq.requiresRecipe]) {
    alert('このアイテムのクラフトレシピを入手していません！');
    return;
  }

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

  // 同スロットにすでに装備があれば取り外しデータだけ更新する
  // （recalcStatsは後でまとめて呼ぶことでHP差分を正確に算出する）
  if (player.equipment[eq.slot]) {
    delete player.equipment[eq.slot];
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
 * critChance は全装備の値を合算して 1 回だけ判定し、会心の一撃が重複しないようにする
 * @param {number} rawDamage - 計算済みダメージ量
 * @param {'take'|'deal'} direction - take: 被ダメージ, deal: 与ダメージ
 * @returns {number} 効果適用後のダメージ
 */
function applyEquipmentEffects(rawDamage, direction) {
  let dmg = rawDamage;
  const player = game.player;

  // 会心率を全装備から合算し、1 回だけ判定する（重複適用を防ぐ）
  let totalCritChance = 0;

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
      totalCritChance += eq.effectValue;
    }
  });

  // 会心判定は合算した確率（最大 1.0）で 1 回のみ行う
  if (direction === 'deal' && totalCritChance > 0) {
    if (Math.random() < Math.min(totalCritChance, 1.0)) {
      dmg = Math.floor(dmg * 1.5);
      log('✦ 会心の一撃！', 'special');
    }
  }

  return dmg;
}

/**
 * 攻撃ターン開始時に MP を回復する装備効果を処理する（金の聖剣・蒼銀の剣）
 * effectLevelCoeff が定義されている場合はプレイヤーレベル × 係数（端数切り捨て・最低1）で計算する
 */
function applyMpRegenEffect() {
  const player = game.player;
  let mpRegen = 0;

  Object.values(player.equipment).forEach(eqId => {
    if (!eqId) return;
    const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === eqId);
    if (eq && eq.effectType === 'mpRegen') {
      if (eq.effectLevelCoeff !== undefined) {
        mpRegen += Math.max(1, Math.floor(player.level * eq.effectLevelCoeff));
      } else {
        mpRegen += eq.effectValue;
      }
    }
  });

  if (mpRegen > 0) {
    player.mp = Math.min(player.maxMp, player.mp + mpRegen);
  }
}

/* ==============================================================
   装備強化システム
   ============================================================== */

/**
 * 装備がどのダンジョンに対応しているかを返す
 * レシピの素材からダンジョンを特定する
 * @param {object} eq - 装備定義
 * @returns {object|null} - ダンジョン定義またはnull
 */
function getEquipmentDungeon(eq) {
  const recipeKeys = Object.keys(eq.recipe);
  for (const mat of recipeKeys) {
    const dungeon = DUNGEON_DEFINITIONS.find(d =>
      d.drops.common === mat ||
      (d.drops.rares || []).includes(mat) ||
      d.drops.boss === mat ||
      d.drops.bossRare === mat
    );
    if (dungeon) return dungeon;
  }
  return null;
}

/**
 * ダンジョン番号(D1=index0 〜 D12=index11)ごとの強化加算ベース値
 * 2ずつ増加: D1=2, D2=4, ..., D12=24
 * ダンジョン軸とレア度軸が同等の影響を与えるよう設計
 * 例: D1→D6 の差(10) ≈ ノーマル→ボスレアの差(10)
 * インデックス: [D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12]
 */
const DUNGEON_ENHANCE_BASES = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

/**
 * レア度ごとの強化加算値
 * ノーマル < レア < ボスレア < エンド < レジェンド の順で大きくなる
 * 各ランクごとに5ずつ増加（2ランク分=10 ≈ ダンジョン5段分=10）
 */
const RARITY_ENHANCE_ADDS = {
  normal:   0,
  rare:     5,
  bossRare: 10,
  end:      15,
  legend:   20,
};

/**
 * 装備1強化レベルあたりのステータス上昇量を返す
 * ダンジョン軸（D1→D12）× レア度軸（ノーマル→レジェンド）で段階的に上昇
 * @param {object} eq - 装備定義
 * @returns {number} - 1強化レベルあたりの上昇値
 */
function getEnhanceStatBoost(eq) {
  const dungeon = getEquipmentDungeon(eq);
  if (!dungeon) return 2;
  const dIdx  = DUNGEON_DEFINITIONS.indexOf(dungeon);
  const base  = DUNGEON_ENHANCE_BASES[dIdx] ?? 2;
  const rarity = eq.rarity || 'normal';
  const rarityAdd = RARITY_ENHANCE_ADDS[rarity] ?? 0;
  return Math.max(1, base + rarityAdd);
}

/**
 * 装備の強化コストを計算する
 * ノーマル: そのダンジョンのコモン素材のみを強化後レベル数分
 * レア: そのダンジョンのコモン・レア素材を強化後レベル数分
 * ボスレア: そのダンジョンのコモン・レア・ボスレア素材を強化後レベル数分
 * エンド: 対応ダンジョン範囲のボスレア素材のみを強化後レベル数分
 *   - D1〜D6エンド: D1〜D6のボスレア素材を各nextLevel個
 *   - D7〜D12エンド: D7〜D12のボスレア素材を各nextLevel個
 * レジェンド: 対応ダンジョン範囲のボスレア素材のみを（強化後レベル+1）個
 *   - D6レジェンド: D1〜D6のボスレア素材を各2個スタート
 *   - D12レジェンド: D7〜D12のボスレア素材を各2個スタート
 * 限定（isSpecialEnhance）: ミスリル×nextLevel + 蒼天晶×nextLevel
 * @param {object} eq - 装備定義
 * @param {number} nextLevel - 強化後のレベル
 * @returns {object} - { 素材名: 必要数, ... }
 */
function getEnhanceCost(eq, nextLevel) {
  // 特殊強化: 蒼銀の剣など isSpecialEnhance フラグのある装備
  if (eq.isSpecialEnhance) {
    return { 'ミスリル': nextLevel, '蒼天晶': nextLevel };
  }

  const rarity = eq.rarity || 'normal';
  const cost = {};

  if (rarity === 'legend') {
    // レジェンドアイテム: 対応ダンジョン範囲のボスレア素材のみ消費
    // 強化後レベル+1個からスタート（例: レベル1→2個, レベル2→3個）
    // 現在のレジェンド装備はD6（legend_acc_ancient）とD12（legend_acc_chaos）の2種のみ
    // D6レジェンド(dungeonIndex 0-5) → D1〜D6のボスレア素材を使用
    // D12レジェンド(dungeonIndex 6-11) → D7〜D12のボスレア素材を使用
    const dungeon  = getEquipmentDungeon(eq);
    const dIdx     = dungeon ? DUNGEON_DEFINITIONS.indexOf(dungeon) : DUNGEON_DEFINITIONS.length - 1;
    const halfPoint = Math.floor(DUNGEON_DEFINITIONS.length / 2);
    const start    = dIdx < halfPoint ? 0 : halfPoint;
    const end      = dIdx < halfPoint ? halfPoint : DUNGEON_DEFINITIONS.length;
    const matCount = nextLevel + 1;
    for (let i = start; i < end; i++) {
      cost[DUNGEON_DEFINITIONS[i].drops.bossRare] = matCount;
    }
    return cost;
  }

  if (rarity === 'end') {
    // エンドアイテム: 対応ダンジョン範囲のボスレア素材のみ消費（レジェンドより少ない量）
    // D1〜D6エンド → D1〜D6のボスレア素材 × nextLevel個
    // D7〜D12エンド → D7〜D12のボスレア素材 × nextLevel個
    const dungeon  = getEquipmentDungeon(eq);
    const dIdx     = dungeon ? DUNGEON_DEFINITIONS.indexOf(dungeon) : DUNGEON_DEFINITIONS.length - 1;
    const dungeonMidpoint = Math.floor(DUNGEON_DEFINITIONS.length / 2);
    const start    = dIdx < dungeonMidpoint ? 0 : dungeonMidpoint;
    const end      = dIdx < dungeonMidpoint ? dungeonMidpoint : DUNGEON_DEFINITIONS.length;
    for (let i = start; i < end; i++) {
      cost[DUNGEON_DEFINITIONS[i].drops.bossRare] = nextLevel;
    }
    return cost;
  }

  // ノーマル/レア/ボスレア: そのダンジョンの素材を消費
  const dungeon = getEquipmentDungeon(eq);
  if (!dungeon) return {};

  // ノーマル: コモン素材のみ
  cost[dungeon.drops.common] = nextLevel;
  if (rarity === 'normal') return cost;

  // レア以上: コモン + レア素材
  if (dungeon.drops.rares && dungeon.drops.rares[0]) {
    cost[dungeon.drops.rares[0]] = nextLevel;
  }
  if (rarity === 'rare') return cost;

  // ボスレア: コモン + レア + ボスレア素材
  cost[dungeon.drops.bossRare] = nextLevel;
  return cost;
}

/**
 * 強化に必要な素材が揃っているかチェックする
 * @param {object} eq - 装備定義
 * @param {number} nextLevel - 強化後のレベル
 * @returns {boolean}
 */
function canAffordEnhancement(eq, nextLevel) {
  const cost = getEnhanceCost(eq, nextLevel);
  if (Object.keys(cost).length === 0) return false;
  const mats = game.player.materials;
  return Object.entries(cost).every(([mat, cnt]) => (mats[mat] || 0) >= cnt);
}

/** 現在強化モーダルに表示中の装備ID */
let enhanceModalEqId = null;

/**
 * 強化モーダルを表示する
 * @param {string} eqId - 装備ID
 */
function showEnhanceModal(eqId) {
  enhanceModalEqId = eqId;
  renderEnhanceModal();
  const overlay = document.getElementById('enhance-modal-overlay');
  if (overlay) overlay.style.display = 'flex';
}

/** 強化モーダルを閉じる */
function closeEnhanceModal() {
  const overlay = document.getElementById('enhance-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  enhanceModalEqId = null;
}

/** 強化モーダルの内容を描画する */
function renderEnhanceModal() {
  const content = document.getElementById('enhance-modal-content');
  if (!content || !enhanceModalEqId) return;

  const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === enhanceModalEqId);
  if (!eq) return;

  const player    = game.player;
  const currentLv = player.enhanceLevels[enhanceModalEqId] || 0;
  const nextLv    = currentLv + 1;
  const cost      = getEnhanceCost(eq, nextLv);
  const mats      = player.materials;
  const canAfford = Object.entries(cost).every(([m, c]) => (mats[m] || 0) >= c);

  const displayName = currentLv > 0 ? `${eq.name} +${currentLv}` : eq.name;

  // スロット別の強化ボーナス説明
  let statBonusStr = '';
  if (eq.isSpecialEnhance) {
    // 成長型特殊強化: 全ステータス10%増し（現在のレベルベース値から計算）
    const gs = (typeof computeGrowthStats !== 'undefined')
      ? computeGrowthStats(eq, game.player.level)
      : eq.stats;
    const factor = 0.1;
    statBonusStr = `ATK+${Math.floor(gs.attack * factor)} / DEF+${Math.floor(gs.defense * factor)} / HP+${Math.floor(gs.maxHp * factor)} / MP+${Math.floor(gs.maxMp * factor)}（全ステータス10%増し）`;
  } else {
    const slot = eq.slot;
    const boost = getEnhanceStatBoost(eq);
    if (slot === '武器') statBonusStr = `ATK +${boost}`;
    else if (['頭', '胴', '足', '靴'].includes(slot)) statBonusStr = `DEF +${boost}`;
    else if (slot === 'アクセサリー') statBonusStr = `HP +${boost}`;
  }

  // 必要素材リスト
  const matRows = Object.entries(cost).map(([mat, cnt]) => {
    const have = mats[mat] || 0;
    const ok   = have >= cnt;
    return `<div class="enhance-mat-row ${ok ? 'ok' : 'insufficient'}">
      <span class="enhance-mat-name">${mat}</span>
      <span class="enhance-mat-count">${have} / ${cnt}</span>
    </div>`;
  }).join('');

  const btnHtml = canAfford
    ? `<button class="inv-btn enhance-confirm-btn" onclick="confirmEnhance()">⬆ 強化する (+${nextLv})</button>`
    : `<button class="inv-btn disabled" disabled>⬆ 強化する（素材不足）</button>`;

  content.innerHTML = `
    <div class="enhance-modal-title">[ ENHANCE ]</div>
    <div class="enhance-modal-info">
      <div class="enhance-eq-name">${displayName}</div>
      <div class="enhance-level-info">現在: <strong>+${currentLv}</strong> → 強化後: <strong>+${nextLv}</strong></div>
      <div class="enhance-stat-bonus">強化ボーナス: ${statBonusStr}</div>
    </div>
    <div class="enhance-mat-section">
      <div class="enhance-mat-title">必要素材：</div>
      ${matRows || '<span class="inv-empty">素材情報なし</span>'}
    </div>
    ${btnHtml}
  `;
}

/** 強化を実行する */
function confirmEnhance() {
  if (!enhanceModalEqId) return;

  const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === enhanceModalEqId);
  if (!eq) return;

  const player    = game.player;
  const currentLv = player.enhanceLevels[enhanceModalEqId] || 0;
  const nextLv    = currentLv + 1;
  const cost      = getEnhanceCost(eq, nextLv);

  // 再度素材チェック（二重送信防止）
  const mats = player.materials;
  const canAfford = Object.entries(cost).every(([m, c]) => (mats[m] || 0) >= c);
  if (!canAfford) {
    renderEnhanceModal();
    return;
  }

  // 素材を消費する
  Object.entries(cost).forEach(([mat, cnt]) => {
    player.materials[mat] = (player.materials[mat] || 0) - cnt;
  });

  // 強化レベルを更新する
  player.enhanceLevels[enhanceModalEqId] = nextLv;

  // ステータスを再計算する
  player.recalcStats();

  closeEnhanceModal();
  renderInventory();
  renderLobbyStatus();
}

