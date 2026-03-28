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

  /* ─── D1 レア追加分（キラースライム核 + スライムクリスタル） ─── */

  {
    id: 'd1_rare_helm',
    name: 'スライム粘液の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 8, maxHp: 20, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.08,
    effectDesc: 'ダメージ軽減(8%の確率)',
    recipe: { 'キラースライム核': 1, 'スライムクリスタル': 1 },
  },
  {
    id: 'd1_rare_legs',
    name: 'スライム液の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 8, maxHp: 15, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'キラースライム核': 1, 'スライムクリスタル': 1 },
  },
  {
    id: 'd1_rare_boots',
    name: 'スライム芯の靴',
    slot: '靴',
    rarity: 'rare',
    stats: { attack: 0, defense: 5, maxHp: 12, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'キラースライム核': 1, 'スライムクリスタル': 1 },
  },
  {
    id: 'd1_rare_acc',
    name: 'スライム結晶のリング',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 0, defense: 0, maxHp: 15, maxMp: 10 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'キラースライム核': 1, 'スライムクリスタル': 1 },
  },
  {
    id: 'd1_rare_weapon',
    name: 'スライム核の短剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 10, defense: 0, maxHp: 0, maxMp: 5 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'キラースライム核': 2, 'スライムクリスタル': 1 },
  },

  /* ─── D1 ボスレア追加分（王冠の欠片 + キングゼリー） ─── */

  {
    id: 'd1_boss_helm',
    name: '王冠の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 10, maxHp: 25, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.10,
    effectDesc: 'ダメージ軽減(10%の確率)',
    recipe: { '王冠の欠片': 1, 'キングゼリー': 1 },
  },
  {
    id: 'd1_boss_armor',
    name: 'ゼリー王の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 20, maxHp: 30, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '王冠の欠片': 1, 'キングゼリー': 1 },
  },
  {
    id: 'd1_boss_legs',
    name: '王冠の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 12, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '王冠の欠片': 1, 'キングゼリー': 1 },
  },
  {
    id: 'd1_boss_boots',
    name: 'ゼリー王の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 8, maxHp: 15, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '王冠の欠片': 1, 'キングゼリー': 1 },
  },
  {
    id: 'd1_boss_weapon',
    name: 'ゼリー王の剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 15, defense: 0, maxHp: 10, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.10,
    effectDesc: '会心率+10%',
    recipe: { '王冠の欠片': 1, 'キングゼリー': 1 },
  },

  /* ─── D2 レア追加分（シャーマンの杖 + 森の魔石） ─── */

  {
    id: 'd2_rare_helm',
    name: '森の魔兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 12, maxHp: 25, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.08,
    effectDesc: 'ダメージ軽減(8%の確率)',
    recipe: { 'シャーマンの杖': 1, '森の魔石': 1 },
  },
  {
    id: 'd2_rare_armor',
    name: '魔術師の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 20, maxHp: 0, maxMp: 12 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'シャーマンの杖': 1, '森の魔石': 1 },
  },
  {
    id: 'd2_rare_legs',
    name: '森の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 14, maxHp: 15, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'シャーマンの杖': 1, '森の魔石': 1 },
  },
  {
    id: 'd2_rare_boots',
    name: '魔法の靴',
    slot: '靴',
    rarity: 'rare',
    stats: { attack: 0, defense: 8, maxHp: 0, maxMp: 10 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'シャーマンの杖': 1, '森の魔石': 1 },
  },
  {
    id: 'd2_rare_acc',
    name: '魔石のお守り',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 8, defense: 0, maxHp: 0, maxMp: 12 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { 'シャーマンの杖': 1, '森の魔石': 1 },
  },

  /* ─── D2 ボスレア追加分（覇王の証 + 王の紋章） ─── */

  {
    id: 'd2_boss_helm',
    name: 'ゴブリン王の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 25, maxHp: 40, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.12,
    effectDesc: 'ダメージ軽減(12%の確率)',
    recipe: { '覇王の証': 1, '王の紋章': 1 },
  },
  {
    id: 'd2_boss_legs',
    name: '覇王の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 22, maxHp: 30, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '覇王の証': 1, '王の紋章': 1 },
  },
  {
    id: 'd2_boss_boots',
    name: '覇王の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 16, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '覇王の証': 1, '王の紋章': 1 },
  },
  {
    id: 'd2_boss_acc',
    name: '王紋の指輪',
    slot: 'アクセサリー',
    rarity: 'bossRare',
    stats: { attack: 12, defense: 8, maxHp: 20, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.10,
    effectDesc: '会心率+10%',
    recipe: { '覇王の証': 1, '王の紋章': 1 },
  },
  {
    id: 'd2_boss_weapon',
    name: 'ゴブリン王の戦斧',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 32, defense: 5, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.12,
    effectDesc: '会心率+12%',
    recipe: { '覇王の証': 1, '王の紋章': 1 },
  },

  /* ─── D3 レア追加分（呪いの骨 + 死霊の涙） ─── */

  {
    id: 'd3_rare_helm',
    name: '呪骨の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 16, maxHp: 30, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.10,
    effectDesc: 'ダメージ軽減(10%の確率)',
    recipe: { '呪いの骨': 1, '死霊の涙': 1 },
  },
  {
    id: 'd3_rare_armor',
    name: '死霊の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 26, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '呪いの骨': 1, '死霊の涙': 1 },
  },
  {
    id: 'd3_rare_legs',
    name: '呪われた脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 18, maxHp: 25, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '呪いの骨': 1, '死霊の涙': 1 },
  },
  {
    id: 'd3_rare_acc',
    name: '死霊の涙の首飾り',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 0, defense: 0, maxHp: 25, maxMp: 15 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '呪いの骨': 1, '死霊の涙': 1 },
  },
  {
    id: 'd3_rare_weapon',
    name: '呪骨の剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 28, defense: 5, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.10,
    effectDesc: '会心率+10%',
    recipe: { '呪いの骨': 2, '死霊の涙': 1 },
  },

  /* ─── D3 ボスレア追加分（冥府の鍵 + 死神の鎌） ─── */

  {
    id: 'd3_boss_helm',
    name: '死騎士の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 30, maxHp: 50, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.15,
    effectDesc: 'ダメージ軽減(15%の確率)',
    recipe: { '冥府の鍵': 1, '死神の鎌': 1 },
  },
  {
    id: 'd3_boss_armor',
    name: '死騎士の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 50, maxHp: 30, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.15,
    effectDesc: 'ダメージ軽減(15%の確率)',
    recipe: { '冥府の鍵': 1, '死神の鎌': 1 },
  },
  {
    id: 'd3_boss_legs',
    name: '死騎士の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 32, maxHp: 30, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '冥府の鍵': 1, '死神の鎌': 1 },
  },
  {
    id: 'd3_boss_boots',
    name: '死騎士の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 24, maxHp: 20, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '冥府の鍵': 1, '死神の鎌': 1 },
  },
  {
    id: 'd3_boss_acc',
    name: '死神の鎌の首飾り',
    slot: 'アクセサリー',
    rarity: 'bossRare',
    stats: { attack: 18, defense: 10, maxHp: 20, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.15,
    effectDesc: '会心率+15%',
    recipe: { '冥府の鍵': 1, '死神の鎌': 1 },
  },

  /* ─── D4 レア追加分（溶岩石 + 炎晶石） ─── */

  {
    id: 'd4_rare_helm',
    name: '溶岩の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 22, maxHp: 45, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.12,
    effectDesc: 'ダメージ軽減(12%の確率)',
    recipe: { '溶岩石': 1, '炎晶石': 1 },
  },
  {
    id: 'd4_rare_armor',
    name: '炎晶の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 38, maxHp: 30, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '溶岩石': 1, '炎晶石': 1 },
  },
  {
    id: 'd4_rare_legs',
    name: '溶岩の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 26, maxHp: 35, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '溶岩石': 1, '炎晶石': 1 },
  },
  {
    id: 'd4_rare_acc',
    name: '炎晶のブレスレット',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 15, defense: 10, maxHp: 0, maxMp: 10 },
    effectType: 'critChance',
    effectValue: 0.10,
    effectDesc: '会心率+10%',
    recipe: { '溶岩石': 1, '炎晶石': 1 },
  },
  {
    id: 'd4_rare_weapon',
    name: '炎晶の剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 42, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.12,
    effectDesc: '会心率+12%',
    recipe: { '溶岩石': 2, '炎晶石': 1 },
  },

  /* ─── D4 ボスレア追加分（炎竜の魂 + 竜の炎石） ─── */

  {
    id: 'd4_boss_armor',
    name: '炎竜の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 62, maxHp: 60, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.20,
    effectDesc: 'ダメージ軽減(20%の確率)',
    recipe: { '炎竜の魂': 1, '竜の炎石': 1 },
  },
  {
    id: 'd4_boss_legs',
    name: '炎竜の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 45, maxHp: 45, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '炎竜の魂': 1, '竜の炎石': 1 },
  },
  {
    id: 'd4_boss_boots',
    name: '炎竜の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 32, maxHp: 30, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '炎竜の魂': 1, '竜の炎石': 1 },
  },
  {
    id: 'd4_boss_acc',
    name: '竜の炎石の首飾り',
    slot: 'アクセサリー',
    rarity: 'bossRare',
    stats: { attack: 20, defense: 15, maxHp: 30, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.15,
    effectDesc: '会心率+15%',
    recipe: { '炎竜の魂': 1, '竜の炎石': 1 },
  },
  {
    id: 'd4_boss_weapon',
    name: '炎竜の剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 70, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.18,
    effectDesc: '会心率+18%',
    recipe: { '炎竜の魂': 1, '竜の炎石': 1 },
  },

  /* ─── D5 レア追加分（闇の結晶 + 虚無の欠片） ─── */

  {
    id: 'd5_rare_helm',
    name: '虚無の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 32, maxHp: 60, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.15,
    effectDesc: 'ダメージ軽減(15%の確率)',
    recipe: { '闇の結晶': 1, '虚無の欠片': 1 },
  },
  {
    id: 'd5_rare_armor',
    name: '闇の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 52, maxHp: 50, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.12,
    effectDesc: 'ダメージ軽減(12%の確率)',
    recipe: { '闇の結晶': 1, '虚無の欠片': 1 },
  },
  {
    id: 'd5_rare_legs',
    name: '虚無の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 36, maxHp: 40, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '闇の結晶': 1, '虚無の欠片': 1 },
  },
  {
    id: 'd5_rare_boots',
    name: '闇の靴',
    slot: '靴',
    rarity: 'rare',
    stats: { attack: 0, defense: 26, maxHp: 30, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '闇の結晶': 1, '虚無の欠片': 1 },
  },
  {
    id: 'd5_rare_weapon',
    name: '闇の魔剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 55, defense: 0, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.15,
    effectDesc: '会心率+15%',
    recipe: { '闇の結晶': 2, '虚無の欠片': 1 },
  },

  /* ─── D5 ボスレア追加分（魔王の魂 + 魔王の心臓） ─── */

  {
    id: 'd5_boss_helm',
    name: '魔王の冠',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 48, maxHp: 80, maxMp: 20 },
    effectType: 'damageReduction',
    effectValue: 0.20,
    effectDesc: 'ダメージ軽減(20%の確率)',
    recipe: { '魔王の魂': 1, '魔王の心臓': 1 },
  },
  {
    id: 'd5_boss_legs',
    name: '魔王の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 52, maxHp: 60, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '魔王の魂': 1, '魔王の心臓': 1 },
  },
  {
    id: 'd5_boss_boots',
    name: '魔王の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 38, maxHp: 40, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '魔王の魂': 1, '魔王の心臓': 1 },
  },
  {
    id: 'd5_boss_acc',
    name: '魔王の心臓の首飾り',
    slot: 'アクセサリー',
    rarity: 'bossRare',
    stats: { attack: 30, defense: 20, maxHp: 40, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.18,
    effectDesc: '会心率+18%',
    recipe: { '魔王の魂': 1, '魔王の心臓': 1 },
  },
  {
    id: 'd5_boss_weapon',
    name: '魔王の戦刀',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 90, defense: 10, maxHp: 0, maxMp: 0 },
    effectType: 'critChance',
    effectValue: 0.22,
    effectDesc: '会心率+22%',
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

  /* ─── D6 レア追加分（精霊の羽根 + 遺跡の石板） ─── */

  {
    id: 'd6_rare_helm',
    name: '精霊の古代兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 38, maxHp: 75, maxMp: 15 },
    effectType: 'damageReduction',
    effectValue: 0.17,
    effectDesc: 'ダメージ軽減(17%の確率)',
    recipe: { '精霊の羽根': 1, '遺跡の石板': 1 },
  },
  {
    id: 'd6_rare_armor',
    name: '遺跡の守護鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 62, maxHp: 60, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.14,
    effectDesc: 'ダメージ軽減(14%の確率)',
    recipe: { '精霊の羽根': 1, '遺跡の石板': 1 },
  },
  {
    id: 'd6_rare_legs',
    name: '精霊の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 42, maxHp: 50, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '精霊の羽根': 1, '遺跡の石板': 1 },
  },
  {
    id: 'd6_rare_acc',
    name: '古代の羽根飾り',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 28, defense: 18, maxHp: 30, maxMp: 15 },
    effectType: 'critChance',
    effectValue: 0.17,
    effectDesc: '会心率+17%',
    recipe: { '精霊の羽根': 1, '遺跡の石板': 1 },
  },
  {
    id: 'd6_rare_weapon',
    name: '精霊の石板剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 66, defense: 0, maxHp: 0, maxMp: 10 },
    effectType: 'critChance',
    effectValue: 0.17,
    effectDesc: '会心率+17%',
    recipe: { '精霊の羽根': 2, '遺跡の石板': 1 },
  },

  /* ─── D6 ボスレア追加分（古代の叡智 + 遺跡守護者の胆石） ─── */

  {
    id: 'd6_boss_helm',
    name: '古代神将の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 58, maxHp: 100, maxMp: 25 },
    effectType: 'damageReduction',
    effectValue: 0.23,
    effectDesc: 'ダメージ軽減(23%の確率)',
    recipe: { '古代の叡智': 1, '遺跡守護者の胆石': 1 },
  },
  {
    id: 'd6_boss_armor',
    name: '古代神将の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 90, maxHp: 75, maxMp: 25 },
    effectType: 'damageReduction',
    effectValue: 0.23,
    effectDesc: 'ダメージ軽減(23%の確率)',
    recipe: { '古代の叡智': 1, '遺跡守護者の胆石': 1 },
  },
  {
    id: 'd6_boss_legs',
    name: '古代神将の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 62, maxHp: 72, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '古代の叡智': 1, '遺跡守護者の胆石': 1 },
  },
  {
    id: 'd6_boss_boots',
    name: '古代神将の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 45, maxHp: 52, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '古代の叡智': 1, '遺跡守護者の胆石': 1 },
  },
  {
    id: 'd6_boss_weapon',
    name: '古代神将の聖剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 108, defense: 12, maxHp: 0, maxMp: 15 },
    effectType: 'critChance',
    effectValue: 0.23,
    effectDesc: '会心率+23%',
    recipe: { '古代の叡智': 1, '遺跡守護者の胆石': 1 },
  },
  {
    id: 'd6_boss_acc',
    name: '古代神将の首飾り',
    slot: 'アクセサリー',
    rarity: 'bossRare',
    stats: { attack: 40, defense: 28, maxHp: 52, maxMp: 18 },
    effectType: 'critChance',
    effectValue: 0.23,
    effectDesc: '会心率+23%',
    recipe: { '古代の叡智': 1, '遺跡守護者の胆石': 1 },
  },

  /* ─── D7 レア追加分（深海魚の鱗 + 海神の宝珠） ─── */

  {
    id: 'd7_rare_helm',
    name: '深海魚の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 48, maxHp: 92, maxMp: 20 },
    effectType: 'damageReduction',
    effectValue: 0.18,
    effectDesc: 'ダメージ軽減(18%の確率)',
    recipe: { '深海魚の鱗': 1, '海神の宝珠': 1 },
  },
  {
    id: 'd7_rare_armor',
    name: '海神の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 78, maxHp: 75, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.15,
    effectDesc: 'ダメージ軽減(15%の確率)',
    recipe: { '深海魚の鱗': 1, '海神の宝珠': 1 },
  },
  {
    id: 'd7_rare_legs',
    name: '深海の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 52, maxHp: 62, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '深海魚の鱗': 1, '海神の宝珠': 1 },
  },
  {
    id: 'd7_rare_acc',
    name: '海神の宝珠ネックレス',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 35, defense: 22, maxHp: 38, maxMp: 20 },
    effectType: 'critChance',
    effectValue: 0.18,
    effectDesc: '会心率+18%',
    recipe: { '深海魚の鱗': 1, '海神の宝珠': 1 },
  },
  {
    id: 'd7_rare_weapon',
    name: '海神の剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 80, defense: 0, maxHp: 0, maxMp: 12 },
    effectType: 'critChance',
    effectValue: 0.18,
    effectDesc: '会心率+18%',
    recipe: { '深海魚の鱗': 2, '海神の宝珠': 1 },
  },

  /* ─── D7 ボスレア追加分（深海神の加護 + 深海神の牙） ─── */

  {
    id: 'd7_boss_helm',
    name: 'リヴァイアサンの兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 72, maxHp: 125, maxMp: 30 },
    effectType: 'damageReduction',
    effectValue: 0.25,
    effectDesc: 'ダメージ軽減(25%の確率)',
    recipe: { '深海神の加護': 1, '深海神の牙': 1 },
  },
  {
    id: 'd7_boss_armor',
    name: 'リヴァイアサンの鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 112, maxHp: 95, maxMp: 30 },
    effectType: 'damageReduction',
    effectValue: 0.25,
    effectDesc: 'ダメージ軽減(25%の確率)',
    recipe: { '深海神の加護': 1, '深海神の牙': 1 },
  },
  {
    id: 'd7_boss_legs',
    name: 'リヴァイアサンの脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 78, maxHp: 88, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '深海神の加護': 1, '深海神の牙': 1 },
  },
  {
    id: 'd7_boss_boots',
    name: 'リヴァイアサンの靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 56, maxHp: 65, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '深海神の加護': 1, '深海神の牙': 1 },
  },
  {
    id: 'd7_boss_weapon',
    name: '深海神の牙剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 132, defense: 15, maxHp: 0, maxMp: 18 },
    effectType: 'critChance',
    effectValue: 0.25,
    effectDesc: '会心率+25%',
    recipe: { '深海神の加護': 1, '深海神の牙': 1 },
  },

  /* ─── D8 レア追加分（隕石鉄 + 宇宙水晶） ─── */

  {
    id: 'd8_rare_helm',
    name: '隕石の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 60, maxHp: 110, maxMp: 25 },
    effectType: 'damageReduction',
    effectValue: 0.19,
    effectDesc: 'ダメージ軽減(19%の確率)',
    recipe: { '隕石鉄': 1, '宇宙水晶': 1 },
  },
  {
    id: 'd8_rare_armor',
    name: '宇宙の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 96, maxHp: 88, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.16,
    effectDesc: 'ダメージ軽減(16%の確率)',
    recipe: { '隕石鉄': 1, '宇宙水晶': 1 },
  },
  {
    id: 'd8_rare_legs',
    name: '星屑の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 65, maxHp: 75, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '隕石鉄': 1, '宇宙水晶': 1 },
  },
  {
    id: 'd8_rare_acc',
    name: '宇宙水晶の腕輪',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 42, defense: 28, maxHp: 45, maxMp: 25 },
    effectType: 'critChance',
    effectValue: 0.20,
    effectDesc: '会心率+20%',
    recipe: { '隕石鉄': 1, '宇宙水晶': 1 },
  },
  {
    id: 'd8_rare_weapon',
    name: '隕石鉄の大剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 96, defense: 0, maxHp: 0, maxMp: 15 },
    effectType: 'critChance',
    effectValue: 0.20,
    effectDesc: '会心率+20%',
    recipe: { '隕石鉄': 2, '宇宙水晶': 1 },
  },

  /* ─── D8 ボスレア追加分（星神の加護 + 星の守護者の核） ─── */

  {
    id: 'd8_boss_helm',
    name: '星神の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 90, maxHp: 155, maxMp: 35 },
    effectType: 'damageReduction',
    effectValue: 0.27,
    effectDesc: 'ダメージ軽減(27%の確率)',
    recipe: { '星神の加護': 1, '星の守護者の核': 1 },
  },
  {
    id: 'd8_boss_armor',
    name: '星神の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 140, maxHp: 118, maxMp: 35 },
    effectType: 'damageReduction',
    effectValue: 0.27,
    effectDesc: 'ダメージ軽減(27%の確率)',
    recipe: { '星神の加護': 1, '星の守護者の核': 1 },
  },
  {
    id: 'd8_boss_legs',
    name: '星神の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 98, maxHp: 108, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '星神の加護': 1, '星の守護者の核': 1 },
  },
  {
    id: 'd8_boss_boots',
    name: '星神の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 70, maxHp: 80, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '星神の加護': 1, '星の守護者の核': 1 },
  },
  {
    id: 'd8_boss_weapon',
    name: '星神の聖剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 158, defense: 18, maxHp: 0, maxMp: 22 },
    effectType: 'critChance',
    effectValue: 0.27,
    effectDesc: '会心率+27%',
    recipe: { '星神の加護': 1, '星の守護者の核': 1 },
  },

  /* ─── D9 レア追加分（魔界の結晶 + 異界の魔石） ─── */

  {
    id: 'd9_rare_helm',
    name: '魔界の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 75, maxHp: 130, maxMp: 30 },
    effectType: 'damageReduction',
    effectValue: 0.20,
    effectDesc: 'ダメージ軽減(20%の確率)',
    recipe: { '魔界の結晶': 1, '異界の魔石': 1 },
  },
  {
    id: 'd9_rare_armor',
    name: '異界の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 118, maxHp: 105, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.17,
    effectDesc: 'ダメージ軽減(17%の確率)',
    recipe: { '魔界の結晶': 1, '異界の魔石': 1 },
  },
  {
    id: 'd9_rare_legs',
    name: '魔界の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 80, maxHp: 90, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '魔界の結晶': 1, '異界の魔石': 1 },
  },
  {
    id: 'd9_rare_acc',
    name: '異界の魔石の指輪',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 52, defense: 35, maxHp: 55, maxMp: 30 },
    effectType: 'critChance',
    effectValue: 0.22,
    effectDesc: '会心率+22%',
    recipe: { '魔界の結晶': 1, '異界の魔石': 1 },
  },
  {
    id: 'd9_rare_weapon',
    name: '魔界の結晶剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 116, defense: 0, maxHp: 0, maxMp: 18 },
    effectType: 'critChance',
    effectValue: 0.22,
    effectDesc: '会心率+22%',
    recipe: { '魔界の結晶': 2, '異界の魔石': 1 },
  },

  /* ─── D9 ボスレア追加分（異界の力 + 迷宮守護者の核） ─── */

  {
    id: 'd9_boss_helm',
    name: '異界覇王の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 112, maxHp: 190, maxMp: 40 },
    effectType: 'damageReduction',
    effectValue: 0.28,
    effectDesc: 'ダメージ軽減(28%の確率)',
    recipe: { '異界の力': 1, '迷宮守護者の核': 1 },
  },
  {
    id: 'd9_boss_armor',
    name: '異界覇王の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 175, maxHp: 145, maxMp: 40 },
    effectType: 'damageReduction',
    effectValue: 0.28,
    effectDesc: 'ダメージ軽減(28%の確率)',
    recipe: { '異界の力': 1, '迷宮守護者の核': 1 },
  },
  {
    id: 'd9_boss_legs',
    name: '異界覇王の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 122, maxHp: 132, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '異界の力': 1, '迷宮守護者の核': 1 },
  },
  {
    id: 'd9_boss_boots',
    name: '異界覇王の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 88, maxHp: 98, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '異界の力': 1, '迷宮守護者の核': 1 },
  },
  {
    id: 'd9_boss_weapon',
    name: '異界の力の大剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 190, defense: 22, maxHp: 0, maxMp: 28 },
    effectType: 'critChance',
    effectValue: 0.28,
    effectDesc: '会心率+28%',
    recipe: { '異界の力': 1, '迷宮守護者の核': 1 },
  },

  /* ─── D10 レア追加分（幻想の羽根 + 夢幻の水晶） ─── */

  {
    id: 'd10_rare_helm',
    name: '夢幻の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 92, maxHp: 155, maxMp: 38 },
    effectType: 'damageReduction',
    effectValue: 0.21,
    effectDesc: 'ダメージ軽減(21%の確率)',
    recipe: { '幻想の羽根': 1, '夢幻の水晶': 1 },
  },
  {
    id: 'd10_rare_armor',
    name: '幻想の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 145, maxHp: 125, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.18,
    effectDesc: 'ダメージ軽減(18%の確率)',
    recipe: { '幻想の羽根': 1, '夢幻の水晶': 1 },
  },
  {
    id: 'd10_rare_legs',
    name: '夢幻の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 98, maxHp: 108, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '幻想の羽根': 1, '夢幻の水晶': 1 },
  },
  {
    id: 'd10_rare_acc',
    name: '夢幻の水晶の首飾り',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 62, defense: 42, maxHp: 68, maxMp: 36 },
    effectType: 'critChance',
    effectValue: 0.23,
    effectDesc: '会心率+23%',
    recipe: { '幻想の羽根': 1, '夢幻の水晶': 1 },
  },
  {
    id: 'd10_rare_weapon',
    name: '夢幻の大剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 138, defense: 0, maxHp: 0, maxMp: 22 },
    effectType: 'critChance',
    effectValue: 0.23,
    effectDesc: '会心率+23%',
    recipe: { '幻想の羽根': 2, '夢幻の水晶': 1 },
  },

  /* ─── D10 ボスレア追加分（夢神の加護 + 夢主の心） ─── */

  {
    id: 'd10_boss_helm',
    name: '夢神の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 138, maxHp: 232, maxMp: 50 },
    effectType: 'damageReduction',
    effectValue: 0.29,
    effectDesc: 'ダメージ軽減(29%の確率)',
    recipe: { '夢神の加護': 1, '夢主の心': 1 },
  },
  {
    id: 'd10_boss_armor',
    name: '夢神の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 215, maxHp: 178, maxMp: 50 },
    effectType: 'damageReduction',
    effectValue: 0.29,
    effectDesc: 'ダメージ軽減(29%の確率)',
    recipe: { '夢神の加護': 1, '夢主の心': 1 },
  },
  {
    id: 'd10_boss_legs',
    name: '夢神の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 150, maxHp: 162, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '夢神の加護': 1, '夢主の心': 1 },
  },
  {
    id: 'd10_boss_boots',
    name: '夢神の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 108, maxHp: 120, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '夢神の加護': 1, '夢主の心': 1 },
  },
  {
    id: 'd10_boss_weapon',
    name: '夢神の幻剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 228, defense: 28, maxHp: 0, maxMp: 35 },
    effectType: 'critChance',
    effectValue: 0.29,
    effectDesc: '会心率+29%',
    recipe: { '夢神の加護': 1, '夢主の心': 1 },
  },

  /* ─── D11 レア追加分（時の砂 + 空間の結晶） ─── */

  {
    id: 'd11_rare_helm',
    name: '時空の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 112, maxHp: 185, maxMp: 45 },
    effectType: 'damageReduction',
    effectValue: 0.22,
    effectDesc: 'ダメージ軽減(22%の確率)',
    recipe: { '時の砂': 1, '空間の結晶': 1 },
  },
  {
    id: 'd11_rare_armor',
    name: '空間の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 178, maxHp: 150, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.19,
    effectDesc: 'ダメージ軽減(19%の確率)',
    recipe: { '時の砂': 1, '空間の結晶': 1 },
  },
  {
    id: 'd11_rare_legs',
    name: '時空の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 120, maxHp: 132, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '時の砂': 1, '空間の結晶': 1 },
  },
  {
    id: 'd11_rare_acc',
    name: '時の砂の指輪',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 75, defense: 52, maxHp: 82, maxMp: 45 },
    effectType: 'critChance',
    effectValue: 0.25,
    effectDesc: '会心率+25%',
    recipe: { '時の砂': 1, '空間の結晶': 1 },
  },
  {
    id: 'd11_rare_weapon',
    name: '時空の大剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 165, defense: 0, maxHp: 0, maxMp: 26 },
    effectType: 'critChance',
    effectValue: 0.25,
    effectDesc: '会心率+25%',
    recipe: { '時の砂': 2, '空間の結晶': 1 },
  },

  /* ─── D11 ボスレア追加分（時空の奇跡 + 時空守護者の核） ─── */

  {
    id: 'd11_boss_helm',
    name: '時空神の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 168, maxHp: 282, maxMp: 62 },
    effectType: 'damageReduction',
    effectValue: 0.30,
    effectDesc: 'ダメージ軽減(30%の確率)',
    recipe: { '時空の奇跡': 1, '時空守護者の核': 1 },
  },
  {
    id: 'd11_boss_armor',
    name: '時空神の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 262, maxHp: 215, maxMp: 62 },
    effectType: 'damageReduction',
    effectValue: 0.30,
    effectDesc: 'ダメージ軽減(30%の確率)',
    recipe: { '時空の奇跡': 1, '時空守護者の核': 1 },
  },
  {
    id: 'd11_boss_legs',
    name: '時空神の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 185, maxHp: 198, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '時空の奇跡': 1, '時空守護者の核': 1 },
  },
  {
    id: 'd11_boss_boots',
    name: '時空神の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 132, maxHp: 148, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '時空の奇跡': 1, '時空守護者の核': 1 },
  },
  {
    id: 'd11_boss_weapon',
    name: '時空神の剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 272, defense: 35, maxHp: 0, maxMp: 42 },
    effectType: 'critChance',
    effectValue: 0.30,
    effectDesc: '会心率+30%',
    recipe: { '時空の奇跡': 1, '時空守護者の核': 1 },
  },

  /* ─── D12 レア追加分（虚空の欠片 + 混沌の石板） ─── */

  {
    id: 'd12_rare_helm',
    name: '混沌の兜',
    slot: '頭',
    rarity: 'rare',
    stats: { attack: 0, defense: 135, maxHp: 220, maxMp: 55 },
    effectType: 'damageReduction',
    effectValue: 0.23,
    effectDesc: 'ダメージ軽減(23%の確率)',
    recipe: { '虚空の欠片': 1, '混沌の石板': 1 },
  },
  {
    id: 'd12_rare_armor',
    name: '虚空の鎧',
    slot: '胴',
    rarity: 'rare',
    stats: { attack: 0, defense: 215, maxHp: 178, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.20,
    effectDesc: 'ダメージ軽減(20%の確率)',
    recipe: { '虚空の欠片': 1, '混沌の石板': 1 },
  },
  {
    id: 'd12_rare_legs',
    name: '混沌の脚甲',
    slot: '足',
    rarity: 'rare',
    stats: { attack: 0, defense: 145, maxHp: 158, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '虚空の欠片': 1, '混沌の石板': 1 },
  },
  {
    id: 'd12_rare_acc',
    name: '虚空の欠片の首飾り',
    slot: 'アクセサリー',
    rarity: 'rare',
    stats: { attack: 92, defense: 62, maxHp: 98, maxMp: 55 },
    effectType: 'critChance',
    effectValue: 0.27,
    effectDesc: '会心率+27%',
    recipe: { '虚空の欠片': 1, '混沌の石板': 1 },
  },
  {
    id: 'd12_rare_weapon',
    name: '混沌の大剣',
    slot: '武器',
    rarity: 'rare',
    stats: { attack: 198, defense: 0, maxHp: 0, maxMp: 32 },
    effectType: 'critChance',
    effectValue: 0.27,
    effectDesc: '会心率+27%',
    recipe: { '虚空の欠片': 2, '混沌の石板': 1 },
  },

  /* ─── D12 ボスレア追加分（混沌の力 + 混沌神の心臓） ─── */

  {
    id: 'd12_boss_helm',
    name: '混沌神の兜',
    slot: '頭',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 202, maxHp: 342, maxMp: 78 },
    effectType: 'damageReduction',
    effectValue: 0.32,
    effectDesc: 'ダメージ軽減(32%の確率)',
    recipe: { '混沌の力': 1, '混沌神の心臓': 1 },
  },
  {
    id: 'd12_boss_armor',
    name: '混沌神の鎧',
    slot: '胴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 318, maxHp: 262, maxMp: 78 },
    effectType: 'damageReduction',
    effectValue: 0.32,
    effectDesc: 'ダメージ軽減(32%の確率)',
    recipe: { '混沌の力': 1, '混沌神の心臓': 1 },
  },
  {
    id: 'd12_boss_legs',
    name: '混沌神の脚甲',
    slot: '足',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 225, maxHp: 240, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '混沌の力': 1, '混沌神の心臓': 1 },
  },
  {
    id: 'd12_boss_boots',
    name: '混沌神の靴',
    slot: '靴',
    rarity: 'bossRare',
    stats: { attack: 0, defense: 162, maxHp: 178, maxMp: 0 },
    effectType: 'none',
    effectDesc: '---',
    recipe: { '混沌の力': 1, '混沌神の心臓': 1 },
  },
  {
    id: 'd12_boss_weapon',
    name: '混沌神の破壊剣',
    slot: '武器',
    rarity: 'bossRare',
    stats: { attack: 330, defense: 42, maxHp: 0, maxMp: 52 },
    effectType: 'critChance',
    effectValue: 0.32,
    effectDesc: '会心率+32%',
    recipe: { '混沌の力': 1, '混沌神の心臓': 1 },
  },
  {
    id: 'd12_boss_acc',
    name: '混沌神の首飾り',
    slot: 'アクセサリー',
    rarity: 'bossRare',
    stats: { attack: 125, defense: 85, maxHp: 162, maxMp: 72 },
    effectType: 'critChance',
    effectValue: 0.32,
    effectDesc: '会心率+32%',
    recipe: { '混沌の力': 1, '混沌神の心臓': 1 },
  },

  /* ─── エンドアイテム（D6〜D12対応、計7種類） ─── */

  /* D6: アクセサリー（レジェンドランク） — D1〜D6の全素材を大量消費 */
  {
    id: 'legend_acc_ancient',
    name: '古代の叡智の護符',
    slot: 'アクセサリー',
    rarity: 'legend',
    stats: { attack: 80, defense: 60, maxHp: 200, maxMp: 60 },
    effectType: 'critChance',
    effectValue: 0.30,
    effectDesc: '会心率+30%',
    recipe: {
      '革': 20, 'キラースライム核': 5, 'スライムクリスタル': 5, '王冠の欠片': 2,
      '鉄': 20, 'シャーマンの杖': 5, '森の魔石': 5, '覇王の証': 2,
      '金': 20, '呪いの骨': 5, '死霊の涙': 5, '冥府の鍵': 2,
      'ダイヤ': 20, '溶岩石': 5, '炎晶石': 5, '炎竜の魂': 2,
      '竜鱗': 20, '闇の結晶': 5, '虚無の欠片': 5, '魔王の魂': 2,
      '古代石': 20, '精霊の羽根': 5, '遺跡の石板': 5, '古代の叡智': 2,
    },
  },

  /* D7: 武器 — 深海珊瑚×25 + 深海魚の鱗×3 + 海神の宝珠×3 + 深海神の加護×1 */
  {
    id: 'end_weapon_abyss',
    name: '深海神の覇剣',
    slot: '武器',
    rarity: 'end',
    stats: { attack: 195, defense: 0, maxHp: 0, maxMp: 65 },
    effectType: 'critChance',
    effectValue: 0.35,
    effectDesc: '会心率+35%',
    recipe: { '深海魚の鱗': 3, '海神の宝珠': 3, '深海神の加護': 1, '深海珊瑚': 25 },
  },

  /* D8: 頭 — 星屑の欠片×25 + 隕石鉄×3 + 宇宙水晶×3 + 星神の加護×1 */
  {
    id: 'end_helm_star',
    name: '星神の覇者兜',
    slot: '頭',
    rarity: 'end',
    stats: { attack: 0, defense: 92, maxHp: 230, maxMp: 52 },
    effectType: 'damageReduction',
    effectValue: 0.30,
    effectDesc: 'ダメージ軽減(30%の確率)',
    recipe: { '隕石鉄': 3, '宇宙水晶': 3, '星神の加護': 1, '星屑の欠片': 25 },
  },

  /* D9: 胴 — 異界の石×25 + 魔界の結晶×3 + 異界の魔石×3 + 異界の力×1 */
  {
    id: 'end_armor_otherworld',
    name: '異界の覇者鎧',
    slot: '胴',
    rarity: 'end',
    stats: { attack: 0, defense: 148, maxHp: 142, maxMp: 32 },
    effectType: 'damageReduction',
    effectValue: 0.30,
    effectDesc: 'ダメージ軽減(30%の確率)',
    recipe: { '魔界の結晶': 3, '異界の魔石': 3, '異界の力': 1, '異界の石': 25 },
  },

  /* D10: 足 — 夢の花×25 + 幻想の羽根×3 + 夢幻の水晶×3 + 夢神の加護×1 */
  {
    id: 'end_legs_dream',
    name: '夢神の覇者脚甲',
    slot: '足',
    rarity: 'end',
    stats: { attack: 0, defense: 178, maxHp: 188, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.32,
    effectDesc: 'ダメージ軽減(32%の確率)',
    recipe: { '幻想の羽根': 3, '夢幻の水晶': 3, '夢神の加護': 1, '夢の花': 25 },
  },

  /* D11: 靴 — 時空の欠片×25 + 時の砂×3 + 空間の結晶×3 + 時空の奇跡×1 */
  {
    id: 'end_boots_spacetime',
    name: '時空神の覇者靴',
    slot: '靴',
    rarity: 'end',
    stats: { attack: 0, defense: 210, maxHp: 205, maxMp: 0 },
    effectType: 'damageReduction',
    effectValue: 0.33,
    effectDesc: 'ダメージ軽減(33%の確率)',
    recipe: { '時の砂': 3, '空間の結晶': 3, '時空の奇跡': 1, '時空の欠片': 25 },
  },

  /* D12: アクセサリー（レジェンドランク） — D7〜D12の全素材を大量消費 */
  {
    id: 'legend_acc_chaos',
    name: '混沌神の超越護符',
    slot: 'アクセサリー',
    rarity: 'legend',
    stats: { attack: 150, defense: 120, maxHp: 400, maxMp: 120 },
    effectType: 'critChance',
    effectValue: 0.40,
    effectDesc: '会心率+40%',
    recipe: {
      '深海珊瑚': 20, '深海魚の鱗': 5, '海神の宝珠': 5, '深海神の加護': 2,
      '星屑の欠片': 20, '隕石鉄': 5, '宇宙水晶': 5, '星神の加護': 2,
      '異界の石': 20, '魔界の結晶': 5, '異界の魔石': 5, '異界の力': 2,
      '夢の花': 20, '幻想の羽根': 5, '夢幻の水晶': 5, '夢神の加護': 2,
      '時空の欠片': 20, '時の砂': 5, '空間の結晶': 5, '時空の奇跡': 2,
      '混沌の結晶': 20, '虚空の欠片': 5, '混沌の石板': 5, '混沌の力': 2,
    },
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
  legend:   'レジェンド',
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
  const slots = ['頭', '胴', '足', '靴', 'アクセサリー', '武器'];
  el.innerHTML = slots.map(slot => {
    const eqId  = player.equipment[slot];
    const eq    = eqId ? EQUIPMENT_DEFINITIONS.find(e => e.id === eqId) : null;
    const enhLv = (eq && player.enhanceLevels[eqId]) || 0;
    const label = eq
      ? (enhLv > 0 ? `${eq.name} +${enhLv}` : eq.name)
      : '（未装備）';
    const unequipBtn = eq
      ? `<button class="inv-btn" onclick="unequipItem('${slot}')">外す</button>`
      : '';
    const canEnh = eq ? canAffordEnhancement(eq, enhLv + 1) : false;
    const enhBtn = eq
      ? `<button class="inv-btn enhance-btn${canEnh ? '' : ' disabled'}" onclick="showEnhanceModal('${eqId}')">⬆ 強化</button>`
      : '';
    return `<div class="eq-row"><span class="eq-slot">[${slot}]</span> <span>${label}</span>${unequipBtn}${enhBtn}</div>`;
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
        const ownedEnhLv = player.enhanceLevels[eq.id] || 0;
        const ownedDisplayName = ownedEnhLv > 0 ? `${eq.name} +${ownedEnhLv}` : eq.name;
        const canEnh = canAffordEnhancement(eq, ownedEnhLv + 1);
        const enhBtn = `<button class="inv-btn enhance-btn${canEnh ? '' : ' disabled'}" onclick="showEnhanceModal('${eq.id}')">⬆ 強化</button>`;
        return `
          <div class="craft-item owned">
            <div class="craft-name">[${eq.slot}] ${ownedDisplayName}${rarityBadge}</div>
            <div class="craft-stats">${statsStr}　${eq.effectDesc}</div>
            <button class="inv-btn" onclick="equipItem('${eq.id}')">装備する</button>
            ${enhBtn}
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
 * 装備の強化コストを計算する
 * 強化コスト式: 必要素材数 = 強化後レベル
 * 例: +0→+1は各素材1個, +1→+2は各素材2個, +2→+3は各素材3個
 * @param {object} eq - 装備定義
 * @param {number} nextLevel - 強化後のレベル
 * @returns {object} - { 素材名: 必要数, ... }
 */
function getEnhanceCost(eq, nextLevel) {
  const rarity = eq.rarity || 'normal';
  const cost = {};

  if (rarity === 'end' || rarity === 'legend') {
    // エンド/レジェンドアイテム: 全ダンジョン分のコモン・レア・ボスレア素材を消費
    // レジェンドはエンドと同じコスト構造（レシピが全素材大量消費のためバランス上適切）
    DUNGEON_DEFINITIONS.forEach(d => {
      cost[d.drops.common] = (cost[d.drops.common] || 0) + nextLevel;
      if (d.drops.rares && d.drops.rares[0]) {
        cost[d.drops.rares[0]] = (cost[d.drops.rares[0]] || 0) + nextLevel;
      }
      cost[d.drops.bossRare] = (cost[d.drops.bossRare] || 0) + nextLevel;
    });
    return cost;
  }

  // ノーマル/レア/ボスレア: そのダンジョンのコモン・レア・ボスレア素材を消費
  const dungeon = getEquipmentDungeon(eq);
  if (!dungeon) return {};

  cost[dungeon.drops.common] = nextLevel;
  if (dungeon.drops.rares && dungeon.drops.rares[0]) {
    cost[dungeon.drops.rares[0]] = nextLevel;
  }
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
  const slot = eq.slot;
  let statBonusStr = '';
  if (slot === '武器') statBonusStr = 'ATK +3';
  else if (['頭', '胴', '足', '靴'].includes(slot)) statBonusStr = 'DEF +2';
  else if (slot === 'アクセサリー') statBonusStr = 'HP +5';

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
      <div class="enhance-mat-title">必要素材（コスト式: 各素材 × 強化後レベル）：</div>
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

