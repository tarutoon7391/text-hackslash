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
  { id: 'key_xp',          name: 'XPダンジョンの鍵',       type: 'key', rarity: 'key', weight: 25 },
  { id: 'key_raremon',     name: 'レアモンダンジョンの鍵', type: 'key', rarity: 'key', weight: 25 },
  { id: 'key_skill',       name: 'スキルダンジョンの鍵',   type: 'key', rarity: 'key', weight: 25 },

  /* ── 限定素材 ── */
  { id: 'gacha_mithril',   name: 'ミスリル',  type: 'limitedMaterial', rarity: 'limited', weight: 30 },
  { id: 'gacha_souten',    name: '蒼天晶',    type: 'limitedMaterial', rarity: 'limited', weight: 30 },

  /* ── 上級職専用武器の限定素材 ── */
  { id: 'gacha_sunstone',     name: 'サンストーン',   type: 'limitedMaterial', rarity: 'limited', weight: 15 },
  { id: 'gacha_seikoushou',   name: '聖光晶',         type: 'limitedMaterial', rarity: 'limited', weight: 15 },
  { id: 'gacha_darkopal',     name: 'ダークオパール',  type: 'limitedMaterial', rarity: 'limited', weight: 15 },
  { id: 'gacha_obsidian',     name: '黒曜石',         type: 'limitedMaterial', rarity: 'limited', weight: 15 },
  { id: 'gacha_malachite',    name: 'マラカイト',      type: 'limitedMaterial', rarity: 'limited', weight: 15 },
  { id: 'gacha_suishou',      name: '翠晶',           type: 'limitedMaterial', rarity: 'limited', weight: 15 },
  { id: 'gacha_bloodstone',   name: 'ブラッドストーン', type: 'limitedMaterial', rarity: 'limited', weight: 15 },
  { id: 'gacha_kouenteki',    name: '紅炎石',          type: 'limitedMaterial', rarity: 'limited', weight: 15 },

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
  {
    id: 'recipe_seisou',
    name: '神聖の穿槍のレシピ',
    type: 'recipe',
    rarity: 'recipe',
    permanent: true,
    flag: 'hasRecipeSeisou',
    weight: 10,
  },
  {
    id: 'recipe_kokuyou',
    name: '黒曜の短剣のレシピ',
    type: 'recipe',
    rarity: 'recipe',
    permanent: true,
    flag: 'hasRecipeKokuyou',
    weight: 10,
  },
  {
    id: 'recipe_suiken',
    name: '翠賢の杖のレシピ',
    type: 'recipe',
    rarity: 'recipe',
    permanent: true,
    flag: 'hasRecipeSuiken',
    weight: 10,
  },
  {
    id: 'recipe_kyouketsu',
    name: '狂血斧のレシピ',
    type: 'recipe',
    rarity: 'recipe',
    permanent: true,
    flag: 'hasRecipeKyouketsu',
    weight: 10,
  },

  /* ── スキルツリーの書（永続品） ── */
  {
    id: 'book_makenshi',
    name: '魔剣士の書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookMakenshi',
    weight: 20,
  },
  {
    id: 'book_paladin',
    name: '聖騎士の書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookPaladin',
    weight: 20,
  },
  {
    id: 'book_assassin',
    name: '暗殺者の書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookAssassin',
    weight: 20,
  },
  {
    id: 'book_sage',
    name: '賢者の書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookSage',
    weight: 20,
  },
  {
    id: 'book_berserker',
    name: '狂戦士の書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookBerserker',
    weight: 20,
  },
];

/**
 * ガチャ排出テーブル Part2
 * D13〜D24の素材・ダンジョン鍵（×10）・特級職のスキルの書
 */
const GACHA_TABLE_PART2 = [
  /* ── D13 神々の試練場 素材 ── */
  { id: 'p2_d13_common',   name: '神々の試練石',     type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d13_rare1',    name: '神話の羽根',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d13_rare2',    name: '試練の結晶',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d13_boss',     name: '試練神の心臓',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d13_bossRare', name: '神々の加護',         type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D14 永劫の氷獄 素材 ── */
  { id: 'p2_d14_common',   name: '永劫の氷塊',         type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d14_rare1',    name: 'ニブルヘイムの氷晶', type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d14_rare2',    name: '氷獄の破片',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d14_boss',     name: '氷獄番人の核',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d14_bossRare', name: '永劫の凍結核',       type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D15 業火の煉獄 素材 ── */
  { id: 'p2_d15_common',   name: '煉獄の炎石',         type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d15_rare1',    name: '業火の灰',           type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d15_rare2',    name: '煉獄の魔核',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d15_boss',     name: '炎獄番人の炎核',     type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d15_bossRare', name: '業火の意志',         type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D16 冥界の回廊 素材 ── */
  { id: 'p2_d16_common',   name: '冥界の黒晶',         type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d16_rare1',    name: '亡者の涙',           type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d16_rare2',    name: '冥王の破片',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d16_boss',     name: '冥界の扉の鍵',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d16_bossRare', name: '冥王の魂石',         type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D17 神域の迷宮 素材 ── */
  { id: 'p2_d17_common',   name: '神域の聖石',         type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d17_rare1',    name: '神域の羽衣',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d17_rare2',    name: '聖域の魔法陣',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d17_boss',     name: '神域番人の核',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d17_bossRare', name: '神域の威光',         type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D18 天上の聖域 素材 ── */
  { id: 'p2_d18_common',   name: '天上の光晶',         type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d18_rare1',    name: '天使の翼',           type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d18_rare2',    name: '聖域の光核',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d18_boss',     name: '聖域守護者の心臓',   type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d18_bossRare', name: '天上の祝福',         type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D19 虚無の断層 素材 ── */
  { id: 'p2_d19_common',   name: '虚無の断層石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d19_rare1',    name: '消滅の核',           type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d19_rare2',    name: '断層の破片',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d19_boss',     name: '断層番人の核',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d19_bossRare', name: '虚無の消滅核',       type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D20 時の終焉 素材 ── */
  { id: 'p2_d20_common',   name: '崩壊の時計石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d20_rare1',    name: '終焉の砂時計',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d20_rare2',    name: '時崩の破片',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d20_boss',     name: '終焉番人の核',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d20_bossRare', name: '時の終焉の欠片',     type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D21 創世の地 素材 ── */
  { id: 'p2_d21_common',   name: '創世の原子',         type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d21_rare1',    name: '宇宙誕生の光',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d21_rare2',    name: '原初の魔核',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d21_boss',     name: '創世神の結晶',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d21_bossRare', name: '宇宙の始まりの欠片', type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D22 魂の審判場 素材 ── */
  { id: 'p2_d22_common',   name: '審判の結晶石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d22_rare1',    name: '次元の魂片',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d22_rare2',    name: '審判の炎核',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d22_boss',     name: '審判神の証',         type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d22_bossRare', name: '魂の審判印',         type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D23 神域の頂 素材 ── */
  { id: 'p2_d23_common',   name: '頂の神聖核',         type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d23_rare1',    name: '全次元の光片',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d23_rare2',    name: '頂点の結晶',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d23_boss',     name: '頂神の心臓',         type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d23_bossRare', name: '神域の頂の欠片',     type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D24 絶対なる混沌 素材 ── */
  { id: 'p2_d24_common',   name: '絶対混沌の核片',     type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d24_rare1',    name: '終焉の混沌核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d24_rare2',    name: '絶対の破壊石',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d24_boss',     name: '混沌絶対神の証',     type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d24_bossRare', name: '絶対なる混沌の力',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D25 創造の揺籃 素材 ── */
  { id: 'p2_d25_common',   name: '揺籃の創造石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d25_rare1',    name: '原初の生命核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d25_rare2',    name: '創造の息吹',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d25_boss',     name: '揺籃守護者の心臓',   type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d25_bossRare', name: '創造の揺籃の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D26 滅却の荒野 素材 ── */
  { id: 'p2_d26_common',   name: '滅却の荒野石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d26_rare1',    name: '滅却の灰塵',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d26_rare2',    name: '荒野の破滅核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d26_boss',     name: '滅却番人の証',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d26_bossRare', name: '滅却の荒野の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D27 虚空の迷宮 素材 ── */
  { id: 'p2_d27_common',   name: '虚空の迷宮石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d27_rare1',    name: '虚空の断片',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d27_rare2',    name: '迷宮の虚無核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d27_boss',     name: '虚空番人の心臓',     type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d27_bossRare', name: '虚空の迷宮の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D28 神話の戦場 素材 ── */
  { id: 'p2_d28_common',   name: '神話の戦場石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d28_rare1',    name: '神話の血晶',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d28_rare2',    name: '戦場の英雄核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d28_boss',     name: '神話番人の証',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d28_bossRare', name: '神話の戦場の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D29 因果の螺旋 素材 ── */
  { id: 'p2_d29_common',   name: '因果の螺旋石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d29_rare1',    name: '因果の結晶',         type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d29_rare2',    name: '螺旋の運命核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d29_boss',     name: '因果守護者の心臓',   type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d29_bossRare', name: '因果の螺旋の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D30 永劫の試練 素材 ── */
  { id: 'p2_d30_common',   name: '永劫の試練石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d30_rare1',    name: '永劫の試練核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d30_rare2',    name: '試練の永久晶',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d30_boss',     name: '永劫番人の証',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d30_bossRare', name: '永劫の試練の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D31 絶対零域 素材 ── */
  { id: 'p2_d31_common',   name: '絶対零域の氷晶',     type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d31_rare1',    name: '絶対零度の核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d31_rare2',    name: '零域の永久氷',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d31_boss',     name: '零域番人の心臓',     type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d31_bossRare', name: '絶対零域の欠片',     type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D32 天地崩壊 素材 ── */
  { id: 'p2_d32_common',   name: '天地崩壊の核片',     type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d32_rare1',    name: '崩壊の天空核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d32_rare2',    name: '大地崩壊の破片',     type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d32_boss',     name: '天地崩壊番人の証',   type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d32_bossRare', name: '天地崩壊の欠片',     type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D33 無限の深淵 素材 ── */
  { id: 'p2_d33_common',   name: '無限の深淵石',       type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d33_rare1',    name: '深淵の無限核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d33_rare2',    name: '無限の奈落晶',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d33_boss',     name: '深淵番人の心臓',     type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d33_bossRare', name: '無限の深淵の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D34 神滅の地 素材 ── */
  { id: 'p2_d34_common',   name: '神滅の地の核片',     type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d34_rare1',    name: '神滅の破壊核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d34_rare2',    name: '滅神の証明石',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d34_boss',     name: '神滅番人の証',       type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d34_bossRare', name: '神滅の地の欠片',     type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D35 終焉の彼方 素材 ── */
  { id: 'p2_d35_common',   name: '終焉彼方の核片',     type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d35_rare1',    name: '彼方の終焉核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d35_rare2',    name: '終焉の彼方晶',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d35_boss',     name: '終焉番人の心臓',     type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d35_bossRare', name: '終焉の彼方の欠片',   type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── D36 絶対なる頂点 素材 ── */
  { id: 'p2_d36_common',   name: '絶対頂点の核片',     type: 'material', rarity: 'common',   weight: 80 },
  { id: 'p2_d36_rare1',    name: '頂点の絶対核',       type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d36_rare2',    name: '絶対なる至高晶',     type: 'material', rarity: 'rare',     weight: 15 },
  { id: 'p2_d36_boss',     name: '絶対頂点神の証',     type: 'material', rarity: 'bossRare', weight: 5 },
  { id: 'p2_d36_bossRare', name: '絶対なる頂点の欠片', type: 'material', rarity: 'bossRare', weight: 5 },

  /* ── ダンジョンの鍵3種（排出数×10） ── */
  { id: 'p2_key_xp',       name: 'XPダンジョンの鍵',       type: 'key', rarity: 'key', weight: 25, count: 10 },
  { id: 'p2_key_raremon',  name: 'レアモンダンジョンの鍵', type: 'key', rarity: 'key', weight: 25, count: 10 },
  { id: 'p2_key_skill',    name: 'スキルダンジョンの鍵',   type: 'key', rarity: 'key', weight: 25, count: 10 },

  /* ── 特級職のスキルの書（永続品） ── */
  {
    id: 'book_crusader',
    name: 'クルセイダーの書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookCrusader',
    weight: 20,
  },
  {
    id: 'book_phantom',
    name: 'ファントムの書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookPhantom',
    weight: 20,
  },
  {
    id: 'book_oracle',
    name: 'オラクルの書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookOracle',
    weight: 20,
  },
  {
    id: 'book_catastrophe',
    name: 'カタストロフの書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookCatastrophe',
    weight: 20,
  },
  {
    id: 'book_runeknight',
    name: 'ルーンナイトの書',
    type: 'book',
    rarity: 'book',
    permanent: true,
    flag: 'hasBookRuneKnight',
    weight: 20,
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
  return _buildPool(GACHA_TABLE);
}

/**
 * ガチャpart2の排出プールを構築する
 * @returns {Array<object>}
 */
function buildGachaPool2() {
  return _buildPool(GACHA_TABLE_PART2);
}

/**
 * 指定テーブルから排出プールを構築する内部ヘルパー
 * @param {Array<object>} table
 * @returns {Array<object>}
 */
function _buildPool(table) {
  const p = game.player;
  const pool          = [];
  let   removedWeight = 0;

  table.forEach(item => {
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
 * ガチャpart2を1回引いて結果配列を返す
 * @returns {Array<object>}
 */
function drawGachaPart2() {
  const pool = buildGachaPool2();
  const item = weightedPick(pool);
  if (item.permanent) {
    game.player.permanentItems[item.flag] = true;
  }
  return [item];
}

/**
 * ガチャ結果をインベントリに反映する
 * @param {Array<object>} results
 */
function applyGachaResults(results) {
  const p = game.player;
  results.forEach(item => {
    if (item.type === 'material' || item.type === 'limitedMaterial' || item.type === 'key') {
      const qty = item.count || 1;
      p.materials[item.name] = (p.materials[item.name] || 0) + qty;
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
    const hasRecipe        = p.permanentItems.hasRecipeAogin     ? '✅ 入手済み' : '❌ 未入手';
    const hasBook          = p.permanentItems.hasBookMakenshi    ? '✅ 入手済み' : '❌ 未入手';
    const hasBookPaladin   = p.permanentItems.hasBookPaladin     ? '✅ 入手済み' : '❌ 未入手';
    const hasBookAssassin  = p.permanentItems.hasBookAssassin    ? '✅ 入手済み' : '❌ 未入手';
    const hasBookSage      = p.permanentItems.hasBookSage        ? '✅ 入手済み' : '❌ 未入手';
    const hasBookBerserker = p.permanentItems.hasBookBerserker   ? '✅ 入手済み' : '❌ 未入手';
    const hasRecipeSeisou    = p.permanentItems.hasRecipeSeisou    ? '✅ 入手済み' : '❌ 未入手';
    const hasRecipeKokuyou   = p.permanentItems.hasRecipeKokuyou   ? '✅ 入手済み' : '❌ 未入手';
    const hasRecipeSuiken    = p.permanentItems.hasRecipeSuiken    ? '✅ 入手済み' : '❌ 未入手';
    const hasRecipeKyouketsu = p.permanentItems.hasRecipeKyouketsu ? '✅ 入手済み' : '❌ 未入手';
    permEl.innerHTML =
      `<span>📜 蒼銀の剣のレシピ: ${hasRecipe}</span>` +
      `<span>📖 魔剣士の書: ${hasBook}</span>` +
      `<span>📖 聖騎士の書: ${hasBookPaladin}</span>` +
      `<span>📖 暗殺者の書: ${hasBookAssassin}</span>` +
      `<span>📖 賢者の書: ${hasBookSage}</span>` +
      `<span>📖 狂戦士の書: ${hasBookBerserker}</span>` +
      `<span>📜 神聖の穿槍のレシピ: ${hasRecipeSeisou}</span>` +
      `<span>📜 黒曜の短剣のレシピ: ${hasRecipeKokuyou}</span>` +
      `<span>📜 翠賢の杖のレシピ: ${hasRecipeSuiken}</span>` +
      `<span>📜 狂血斧のレシピ: ${hasRecipeKyouketsu}</span>`;
  }

  const btn1  = document.getElementById('btn-gacha-1');
  const btn10 = document.getElementById('btn-gacha-10');
  if (btn1)  btn1.disabled  = tickets < 1;
  if (btn10) btn10.disabled = tickets < 10;

  // Part2ボタンの活性制御（チケット×10必要）
  const btnPart2 = document.getElementById('btn-gacha-part2');
  if (btnPart2) btnPart2.disabled = tickets < 10;

  const permEl2 = document.getElementById('gacha-perm-status-part2');
  if (permEl2) {
    const hasBookCrusader    = p.permanentItems.hasBookCrusader    ? '✅ 入手済み' : '❌ 未入手';
    const hasBookPhantom     = p.permanentItems.hasBookPhantom     ? '✅ 入手済み' : '❌ 未入手';
    const hasBookOracle      = p.permanentItems.hasBookOracle      ? '✅ 入手済み' : '❌ 未入手';
    const hasBookCatastrophe = p.permanentItems.hasBookCatastrophe ? '✅ 入手済み' : '❌ 未入手';
    const hasBookRuneKnight  = p.permanentItems.hasBookRuneKnight  ? '✅ 入手済み' : '❌ 未入手';
    permEl2.innerHTML =
      `<span>📖 クルセイダーの書: ${hasBookCrusader}</span>` +
      `<span>📖 ファントムの書: ${hasBookPhantom}</span>` +
      `<span>📖 オラクルの書: ${hasBookOracle}</span>` +
      `<span>📖 カタストロフの書: ${hasBookCatastrophe}</span>` +
      `<span>📖 ルーンナイトの書: ${hasBookRuneKnight}</span>`;
  }
}

/** ガチャPart1/Part2を切り替える */
function switchGachaPart(part) {
  const content1 = document.getElementById('gacha-content-part1');
  const content2 = document.getElementById('gacha-content-part2');
  const btn1     = document.getElementById('gacha-part-btn-1');
  const btn2     = document.getElementById('gacha-part-btn-2');

  if (part === 1) {
    if (content1) content1.style.display = '';
    if (content2) content2.style.display = 'none';
    if (btn1) { btn1.classList.add('active'); }
    if (btn2) { btn2.classList.remove('active'); }
  } else {
    if (content1) content1.style.display = 'none';
    if (content2) content2.style.display = '';
    if (btn1) { btn1.classList.remove('active'); }
    if (btn2) { btn2.classList.add('active'); }
  }

  // ログをクリアする
  const logEl = document.getElementById('gacha-log');
  if (logEl) logEl.innerHTML = '';
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

/** Part2ガチャを引く（チケット×10消費・1回抽選） */
function executeGachaTenPart2() {
  const p = game.player;
  if ((p.gachaTickets || 0) < 10) return;
  p.gachaTickets -= 10;
  const results = drawGachaPart2();
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
        const qty = item.count || 1;
        line.textContent = `🗝 [${rarityLabel}] ${item.name} ×${qty} を入手！`;
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
 * 素材はレアリティカテゴリ別にまとめて表示し、永続品は入手済み判定付きで表示する
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

  /** カテゴリヘッダー行を追加する */
  function addCatHeader(text) {
    const el = document.createElement('div');
    el.className   = 'gacha-result-line';
    el.style.color = '#ffffff';
    el.textContent = text;
    logEl.appendChild(el);
  }

  /** IDリストの合計確率行を追加する */
  function addRateLineByIds(label, ids, color) {
    const totalW = ids.reduce((sum, id) => {
      const pi = pool.find(item => item.id === id);
      return sum + (pi ? pi.weight : 0);
    }, 0);
    const percent = (totalW / totalWeight * 100).toFixed(2);
    const el = document.createElement('div');
    el.className   = 'gacha-result-line';
    el.style.color = color;
    el.textContent = `  ${label}: ${percent}%`;
    logEl.appendChild(el);
  }

  /** 永続品グループ行を追加する（全入手済みなら「入手済み」表示） */
  function addPermGroupLine(label, ids, color) {
    const allObtained = ids.every(id => {
      const item = GACHA_TABLE.find(i => i.id === id);
      return item && p.permanentItems[item.flag];
    });
    const el = document.createElement('div');
    el.className   = 'gacha-result-line';
    el.style.color = color;
    if (allObtained) {
      el.textContent = `  ${label} - 入手済み`;
    } else {
      const totalW = ids.reduce((sum, id) => {
        const pi = pool.find(item => item.id === id);
        return sum + (pi ? pi.weight : 0);
      }, 0);
      const percent = (totalW / totalWeight * 100).toFixed(2);
      el.textContent = `  ${label} - ${percent}%`;
    }
    logEl.appendChild(el);
  }

  // 【素材】
  addCatHeader('【素材】');
  const commonIds   = GACHA_TABLE.filter(i => i.rarity === 'common'   && i.type === 'material').map(i => i.id);
  const rareIds     = GACHA_TABLE.filter(i => i.rarity === 'rare'     && i.type === 'material').map(i => i.id);
  const bossRareIds = GACHA_TABLE.filter(i => i.rarity === 'bossRare' && i.type === 'material').map(i => i.id);
  addRateLineByIds(`コモン素材（${commonIds.length}種）`,    commonIds,   GACHA_RARITY_COLORS.common);
  addRateLineByIds(`レア素材（${rareIds.length}種）`,         rareIds,     GACHA_RARITY_COLORS.rare);
  addRateLineByIds(`ボスレア素材（${bossRareIds.length}種）`, bossRareIds, GACHA_RARITY_COLORS.bossRare);

  // 【限定素材】（weight===30の2種が蒼銀系限定素材、weight===15の8種が上級職武器素材）
  addCatHeader('【限定素材】');
  const limitedBasicIds    = GACHA_TABLE.filter(i => i.type === 'limitedMaterial' && i.weight >= 30).map(i => i.id);
  const limitedAdvancedIds = GACHA_TABLE.filter(i => i.type === 'limitedMaterial' && i.weight <  30).map(i => i.id);
  addRateLineByIds(`限定素材（${limitedBasicIds.length}種）`,       limitedBasicIds,    GACHA_RARITY_COLORS.limited);
  addRateLineByIds(`上級職武器素材（${limitedAdvancedIds.length}種）`, limitedAdvancedIds, GACHA_RARITY_COLORS.limited);

  // 【ダンジョンの鍵】
  addCatHeader('【ダンジョンの鍵】');
  const keyIds    = GACHA_TABLE.filter(i => i.type === 'key').map(i => i.id);
  const totalKeyW = keyIds.reduce((sum, id) => {
    const pi = pool.find(item => item.id === id);
    return sum + (pi ? pi.weight : 0);
  }, 0);
  const keyPercent = (totalKeyW / totalWeight * 100).toFixed(2);
  const keyLine = document.createElement('div');
  keyLine.className   = 'gacha-result-line';
  keyLine.style.color = GACHA_RARITY_COLORS.key;
  keyLine.textContent = `  XP鍵 / レアモン鍵 / スキル鍵（各1個）: ${keyPercent}%`;
  logEl.appendChild(keyLine);

  // 【永続品】
  addCatHeader('【永続品】');
  // 蒼銀の剣レシピは個別表示
  const aoginItem = GACHA_TABLE.find(i => i.id === 'recipe_aogin');
  if (aoginItem) {
    const isObtained = p.permanentItems[aoginItem.flag];
    const el = document.createElement('div');
    el.className   = 'gacha-result-line';
    el.style.color = GACHA_RARITY_COLORS.recipe;
    if (isObtained) {
      el.textContent = `  ${aoginItem.name} - 入手済み`;
    } else {
      const poolItem = pool.find(pi => pi.id === aoginItem.id);
      const percent  = poolItem ? (poolItem.weight / totalWeight * 100).toFixed(2) : '0.00';
      el.textContent = `  ${aoginItem.name} - ${percent}%`;
    }
    logEl.appendChild(el);
  }
  // 上級職武器レシピ4種をまとめて表示
  const recipeIds = ['recipe_seisou', 'recipe_kokuyou', 'recipe_suiken', 'recipe_kyouketsu'];
  addPermGroupLine(`各種レシピ（${recipeIds.length}種）`, recipeIds, GACHA_RARITY_COLORS.recipe);
  // スキルの書5種をまとめて表示
  const bookIds = GACHA_TABLE.filter(i => i.type === 'book').map(i => i.id);
  addPermGroupLine(`各種スキルの書（${bookIds.length}種）`, bookIds, GACHA_RARITY_COLORS.book);
}

/**
 * Part2の排出率一覧をガチャログエリアに表示する
 * 素材はレアリティカテゴリ別にまとめて表示し、永続品はグループ表示する
 */
function showGachaRatesPart2() {
  const logEl = document.getElementById('gacha-log');
  if (!logEl) return;
  if (!game.player) return;

  const p = game.player;

  // 現在のプールで合計重みを計算する（入手済み永続品は除外済み）
  const pool        = buildGachaPool2();
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);

  logEl.innerHTML = '';

  const header = document.createElement('div');
  header.className   = 'gacha-summoning';
  header.textContent = '--- Part2 排出率一覧 ---';
  logEl.appendChild(header);

  /** カテゴリヘッダー行を追加する */
  function addCatHeader(text) {
    const el = document.createElement('div');
    el.className   = 'gacha-result-line';
    el.style.color = '#ffffff';
    el.textContent = text;
    logEl.appendChild(el);
  }

  /** IDリストの合計確率行を追加する */
  function addRateLineByIds(label, ids, color) {
    const totalW = ids.reduce((sum, id) => {
      const pi = pool.find(item => item.id === id);
      return sum + (pi ? pi.weight : 0);
    }, 0);
    const percent = (totalW / totalWeight * 100).toFixed(2);
    const el = document.createElement('div');
    el.className   = 'gacha-result-line';
    el.style.color = color;
    el.textContent = `  ${label}: ${percent}%`;
    logEl.appendChild(el);
  }

  // 【素材】
  addCatHeader('【素材】');
  const commonIds   = GACHA_TABLE_PART2.filter(i => i.rarity === 'common'   && i.type === 'material').map(i => i.id);
  const rareIds     = GACHA_TABLE_PART2.filter(i => i.rarity === 'rare'     && i.type === 'material').map(i => i.id);
  const bossRareIds = GACHA_TABLE_PART2.filter(i => i.rarity === 'bossRare' && i.type === 'material').map(i => i.id);
  addRateLineByIds(`コモン素材（${commonIds.length}種）`,    commonIds,   GACHA_RARITY_COLORS.common);
  addRateLineByIds(`レア素材（${rareIds.length}種）`,         rareIds,     GACHA_RARITY_COLORS.rare);
  addRateLineByIds(`ボスレア素材（${bossRareIds.length}種）`, bossRareIds, GACHA_RARITY_COLORS.bossRare);

  // 【ダンジョンの鍵】
  addCatHeader('【ダンジョンの鍵】');
  const keyIds    = GACHA_TABLE_PART2.filter(i => i.type === 'key').map(i => i.id);
  const totalKeyW = keyIds.reduce((sum, id) => {
    const pi = pool.find(item => item.id === id);
    return sum + (pi ? pi.weight : 0);
  }, 0);
  const keyPercent = (totalKeyW / totalWeight * 100).toFixed(2);
  const keyLine = document.createElement('div');
  keyLine.className   = 'gacha-result-line';
  keyLine.style.color = GACHA_RARITY_COLORS.key;
  keyLine.textContent = `  XP鍵 / レアモン鍵 / スキル鍵（各×10）: ${keyPercent}%`;
  logEl.appendChild(keyLine);

  // 【永続品】
  addCatHeader('【永続品】');
  const bookIds     = GACHA_TABLE_PART2.filter(i => i.type === 'book').map(i => i.id);
  const allObtained = bookIds.every(id => {
    const item = GACHA_TABLE_PART2.find(i => i.id === id);
    return item && p.permanentItems[item.flag];
  });
  const permEl = document.createElement('div');
  permEl.className   = 'gacha-result-line';
  permEl.style.color = GACHA_RARITY_COLORS.book;
  if (allObtained) {
    permEl.textContent = `  各種スキルの書（${bookIds.length}種） - 入手済み`;
  } else {
    const totalW = bookIds.reduce((sum, id) => {
      const pi = pool.find(item => item.id === id);
      return sum + (pi ? pi.weight : 0);
    }, 0);
    const percent = (totalW / totalWeight * 100).toFixed(2);
    permEl.textContent = `  各種スキルの書（${bookIds.length}種） - ${percent}%`;
  }
  logEl.appendChild(permEl);
}
