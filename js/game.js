'use strict';

/* ==============================================================
   ゲームバランス定数
   ============================================================== */

/** 防御力の軽減係数（通常攻撃） */
const DEFENSE_FACTOR       = 0.5;
/** スキル攻撃時の防御軽減係数（通常より低い） */
const SKILL_DEFENSE_FACTOR = 0.4;
/** 逃げる成功率（0.0 〜 1.0） */
const FLEE_SUCCESS_RATE    = 0.5;
/** 敵ターン開始までの遅延（ミリ秒） */
const ENEMY_TURN_DELAY_MS  = 700;
/** ログセパレーター行の文字数 */
const LOG_SEPARATOR_LENGTH = 40;

/** プレイヤーの初期ステータス（バランス調整はここで行う） */
const INITIAL_PLAYER_STATS = {
  name:          '勇者',
  hp:            100,
  maxHp:         100,
  mp:            40,
  maxMp:         40,
  attackBase:    18,
  defenseBase:   8,
  level:         1,
  exp:           0,
  skillPoints:   0,
  learnedSkills: [],
};

/* ==============================================================
   ユーティリティ関数
   ============================================================== */

/** min 以上 max 以下の整数乱数を返す */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 配列からランダムに 1 要素を返す */
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

/* ==============================================================
   プレイヤークラス
   ============================================================== */
class Player {
  constructor(s) {
    this.name           = s.name          ?? '勇者';
    this.hp             = s.hp            ?? 100;
    this.maxHp          = s.maxHp         ?? 100;
    this.mp             = s.mp            ?? 40;
    this.maxMp          = s.maxMp         ?? 40;
    this.attackBase     = s.attackBase    ?? 18;
    this.defenseBase    = s.defenseBase   ?? 8;
    this.maxHpBase      = s.maxHpBase     ?? 100;
    this.maxMpBase      = s.maxMpBase     ?? 40;
    this.level          = s.level         ?? 1;
    this.exp            = s.exp           ?? 0;
    this.skillPoints    = s.skillPoints   ?? 0;
    this.learnedSkills   = s.learnedSkills   ? [...s.learnedSkills]  : [];
    /** お気に入り登録済みスキルIDの配列 */
    this.favoriteSkills  = s.favoriteSkills  ? [...s.favoriteSkills] : [];
    this.materials      = s.materials      ? { ...s.materials }    : {};
    this.equipment      = s.equipment      ? { ...s.equipment }    : {};
    this.ownedEquipment = s.ownedEquipment ? [...s.ownedEquipment] : [];
    this.enhanceLevels  = s.enhanceLevels  ? { ...s.enhanceLevels } : {};
    this.dungeonProgress = s.dungeonProgress ? { ...s.dungeonProgress } : {};

    /** 図鑑: モンスター遭遇フラグ・討伐フラグ・討伐回数 */
    this.encounterFlags  = s.encounterFlags  ? { ...s.encounterFlags }  : {};
    this.defeatFlags     = s.defeatFlags     ? { ...s.defeatFlags }     : {};
    this.defeatCounts    = s.defeatCounts    ? { ...s.defeatCounts }    : {};

    /** 図鑑: アイテム解鎖フラグ */
    this.itemUnlockFlags = s.itemUnlockFlags ? { ...s.itemUnlockFlags } : {};

    /**
     * スキルツリーの取得済みノード一覧
     * キー: ルート ID、値: 取得済みノード ID の配列
     */
    this.skillTreeNodes = s.skillTreeNodes
      ? Object.fromEntries(
          Object.entries(s.skillTreeNodes).map(([k, v]) => [k, [...v]])
        )
      : {};

    /** 有効ステータスを初期化 */
    /** ガチャチケット枚数 */
    this.gachaTickets   = s.gachaTickets   ?? 0;

    /**
     * 永続品の入手済みフラグ
     * hasRecipeAogin: 蒼銀の剣のレシピ取得済み
     * hasBookMakenshi: 魔剣士の書取得済み
     */
    this.permanentItems = s.permanentItems ? { ...s.permanentItems } : {};

    /**
     * 現在の職業ID
     * null | 'paladin' | 'assassin' | 'sage' | 'berserker'
     */
    this.currentJob = s.currentJob ?? null;

    /**
     * スキルの書の消費済みフラグ
     */
    this.usedBooks = s.usedBooks ? { ...s.usedBooks } : {};

    /** 有効ステータスを初期化 */
    this.attack  = this.attackBase;
    this.defense = this.defenseBase;
    this.recalcStats();
  }

  /**
   * 有効ステータス（attack / defense / maxHp / maxMp）を再計算する
   * ベース値 + スキルツリーボーナス + 装備補正
   */
  recalcStats() {
    // 最大HP変化によるHP補正のために、現在の最大HPを保持する
    const prevMaxHp = this.maxHp;

    // スキルツリーによるステータスボーナスを集計する
    let stAtk = 0, stDef = 0, stHp = 0, stMp = 0;
    if (typeof SKILL_TREE_DEFINITIONS !== 'undefined') {
      SKILL_TREE_DEFINITIONS.forEach(route => {
        const acquiredIds = this.skillTreeNodes[route.id] || [];
        route.nodes.forEach(node => {
          if (acquiredIds.includes(node.id) && node.bonuses) {
            stAtk += node.bonuses.atk || 0;
            stDef += node.bonuses.def || 0;
            stHp  += node.bonuses.hp  || 0;
            stMp  += node.bonuses.mp  || 0;
          }
        });
      });
    }

    this.attack  = this.attackBase  + stAtk;
    this.defense = this.defenseBase + stDef;
    this.maxHp   = this.maxHpBase   + stHp;
    this.maxMp   = this.maxMpBase   + stMp;

    Object.values(this.equipment).forEach(eqId => {
      if (!eqId) return;
      const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === eqId);
      if (!eq) return;

      const enhLv = this.enhanceLevels[eqId] || 0;

      if (eq.isGrowth) {
        // 成長型武器: プレイヤーレベルに応じたステータスを計算する
        const gs = (typeof computeGrowthStats !== 'undefined')
          ? computeGrowthStats(eq, this.level)
          : eq.stats;
        const factor = 1 + 0.1 * enhLv;
        this.attack  += Math.floor(gs.attack  * factor);
        this.defense += Math.floor(gs.defense * factor);
        this.maxHp   += Math.floor(gs.maxHp   * factor);
        this.maxMp   += Math.floor(gs.maxMp   * factor);
      } else {
        this.attack  += eq.stats.attack  || 0;
        this.defense += eq.stats.defense || 0;
        this.maxHp   += eq.stats.maxHp   || 0;
        this.maxMp   += eq.stats.maxMp   || 0;

        // 装備強化ボーナスを加算する（ダンジョン×レア度に応じた上昇幅）
        if (enhLv > 0) {
          const boost = getEnhanceStatBoost(eq);
          if (eq.slot === '武器') {
            this.attack += enhLv * boost;
          } else if (['頭', '胴', '足', '靴'].includes(eq.slot)) {
            this.defense += enhLv * boost;
          } else if (eq.slot === 'アクセサリー') {
            this.maxHp += enhLv * boost;
          }
        }
      }
    });

    // 蒼銀の剣×魔剣士シナジー: mk_01（魔力の心得）取得済みフラグ かつ 蒼銀の剣を装備中
    // → 会心率以外の全ステータス（ATK・DEF・HP・MP）を 1.2 倍にする
    // ※ HP/MP 調整の前にシナジーを適用することで、繰り返し呼出し時に倍率が累積しないようにする
    const hasMakenshiSynergy = !!(this.permanentItems && this.permanentItems.hasMakenshiSynergy);
    const hasAoginNoKen = Object.values(this.equipment).includes('aogin_no_ken');
    if (hasMakenshiSynergy && hasAoginNoKen) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // 神聖の穿槍×聖騎士シナジー: pl_01 取得済み かつ 神聖の穿槍を装備中
    // → 会心率以外の全ステータス×1.2倍
    const hasPaladinSynergy  = this.currentJob === 'paladin'   && (this.skillTreeNodes['paladin']   || []).includes('pl_01');
    const hasSeisouNoSou     = Object.values(this.equipment).includes('seisou_no_sou');
    if (hasPaladinSynergy && hasSeisouNoSou) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // 黒曜の短剣×暗殺者シナジー: as_01 取得済み かつ 黒曜の短剣を装備中
    // → 会心率以外の全ステータス×1.2倍
    const hasAssassinSynergy = this.currentJob === 'assassin'  && (this.skillTreeNodes['assassin']  || []).includes('as_01');
    const hasKokuyouNoTanken = Object.values(this.equipment).includes('kokuyou_no_tanken');
    if (hasAssassinSynergy && hasKokuyouNoTanken) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // 翠賢の杖×賢者シナジー: sg_01 取得済み かつ 翠賢の杖を装備中
    // → 会心率以外の全ステータス×1.2倍
    const hasSageSynergy     = this.currentJob === 'sage'      && (this.skillTreeNodes['sage']      || []).includes('sg_01');
    const hasSuikenNoTsue    = Object.values(this.equipment).includes('suiken_no_tsue');
    if (hasSageSynergy && hasSuikenNoTsue) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // 狂血斧×狂戦士シナジー: bk_01 取得済み かつ 狂血斧を装備中
    // → 会心率以外の全ステータス×1.2倍
    const hasBerserkerSynergy = this.currentJob === 'berserker' && (this.skillTreeNodes['berserker'] || []).includes('bk_01');
    const hasKyouketsuNoOno   = Object.values(this.equipment).includes('kyouketsu_no_ono');
    if (hasBerserkerSynergy && hasKyouketsuNoOno) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // 賢者パッシブ sg_12 (魔力増幅): 最大MPを1.3倍にする
    if (this.currentJob === 'sage' && (this.skillTreeNodes['sage'] || []).includes('sg_12')) {
      this.maxMp = Math.floor(this.maxMp * 1.3);
    }

    // オラクルパッシブ oc_passive_03 (オラクルマナ): 最大MPを1.5倍にする
    if (this.currentJob === 'oracle' && (this.skillTreeNodes['oracle'] || []).includes('oc_passive_03')) {
      this.maxMp = Math.floor(this.maxMp * 1.5);
    }

    // 特級職刻印系パッシブ：専用武器装備時に全ステータス×1.2（上級職シナジーと同一パターン）
    // クルセイダー cr_passive_01 ＋ 神聖の穿槍（seisou_no_sou）
    const hasCrusaderSynergy    = this.currentJob === 'crusader'    && (this.skillTreeNodes['crusader']    || []).includes('cr_passive_01');
    if (hasCrusaderSynergy && hasSeisouNoSou) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // ファントム ph_passive_01 ＋ 黒曜の短剣（kokuyou_no_tanken）
    const hasPhantomSynergy     = this.currentJob === 'phantom'     && (this.skillTreeNodes['phantom']     || []).includes('ph_passive_01');
    if (hasPhantomSynergy && hasKokuyouNoTanken) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // オラクル oc_passive_01 ＋ 翠賢の杖（suiken_no_tsue）
    const hasOracleSynergy      = this.currentJob === 'oracle'      && (this.skillTreeNodes['oracle']      || []).includes('oc_passive_01');
    if (hasOracleSynergy && hasSuikenNoTsue) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // カタストロフ ct_passive_01 ＋ 狂血斧（kyouketsu_no_ono）
    const hasCatastropheSynergy = this.currentJob === 'catastrophe' && (this.skillTreeNodes['catastrophe'] || []).includes('ct_passive_01');
    if (hasCatastropheSynergy && hasKyouketsuNoOno) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // ルーンナイト rk_passive_01 ＋ 蒼銀の剣（aogin_no_ken）
    const hasRuneKnightSynergy  = this.currentJob === 'rune_knight' && (this.skillTreeNodes['rune_knight'] || []).includes('rk_passive_01');
    if (hasRuneKnightSynergy && hasAoginNoKen) {
      this.attack  = Math.floor(this.attack  * 1.2);
      this.defense = Math.floor(this.defense * 1.2);
      this.maxHp   = Math.floor(this.maxHp   * 1.2);
      this.maxMp   = Math.floor(this.maxMp   * 1.2);
    }

    // 最大HPが増加した場合は現在HPも差分だけ増加させる
    // 最大HPが減少した場合は現在HPを新しい最大HPにクランプする
    const hpDelta = this.maxHp - prevMaxHp;
    if (hpDelta > 0) {
      this.hp = Math.min(this.maxHp, this.hp + hpDelta);
    } else {
      this.hp = Math.min(this.hp, this.maxHp);
    }
    this.mp = Math.min(this.mp, this.maxMp);
  }

  /**
   * 祝福スキルの ATK バフ・魔力凝縮を含めた実効攻撃力を返す
   */
  get effectiveAttack() {
    const bonus = (game.playerAtkBuff && game.playerAtkBuff.turnsLeft > 0)
      ? game.playerAtkBuff.bonus : 0;
    let base = this.attack + bonus;
    // mk_10 魔剣の極意パッシブ: 現在MPの割合に応じてATKが上昇（魔剣士職のみ）
    if (this.currentJob === 'makenshi' && (this.skillTreeNodes['makenshi'] || []).includes('mk_10')) {
      const mpRatio = this.maxMp > 0 ? this.mp / this.maxMp : 0;
      base = Math.floor(base * (1 + mpRatio));
    }
    // 魔剣士の覚醒 ATK倍率バフ
    if (game.playerMakenshiAwakeningBuff && game.playerMakenshiAwakeningBuff.turnsLeft > 0) {
      base = Math.floor(base * game.playerMakenshiAwakeningBuff.atkMultiplier);
    }
    // 倍率バフ（強化魔法・全体強化）を適用する（乗算で相乗）
    let atkMult = 1.0;
    if (game.playerSageBuff && game.playerSageBuff.turnsLeft > 0)
      atkMult *= game.playerSageBuff.atkMultiplier;
    if (game.playerSageMegaBuff && game.playerSageMegaBuff.turnsLeft > 0)
      atkMult *= game.playerSageMegaBuff.atkMultiplier;
    // 特級職バフ：ルーン付与（ルーンナイト）
    if (game.runeGrantActive) atkMult *= game.runeGrantAtkMult;
    // 特級職バフ：天啓強化（オラクル）
    if (game.oracleEnhanceBuff) atkMult *= game.oracleEnhanceBuff.atkMult;
    // 特級職バフ：オラクルバースト（オラクル）
    if (game.oracleBurstActive) atkMult *= game.oracleBurstActive.atkMult;
    // 特級職バフ：破滅の傷（カタストロフ）
    if (game.ctRuinousWoundBuff) atkMult *= game.ctRuinousWoundBuff.atkMult;
    // 特級職バフ：ルーンストライク自ATKバフ
    if (game.runeStrikeAtkBuff) atkMult *= game.runeStrikeAtkBuff.factor;
    // 特級職バフ：ファントム攻撃回避後ATKバフ（影の極致）
    if (game.phantomAvoidBuff && game.phantomAvoidBuff.turnsLeft > 0) atkMult *= game.phantomAvoidBuff.factor;
    // 特級職パッシブ：神聖の要塞スタン後ATK×1.5バフ（クルセイダー）
    if (game.crusaderStunAtkBuff && game.crusaderStunAtkBuff.turnsLeft > 0) atkMult *= game.crusaderStunAtkBuff.factor;
    // 特級職パッシブ：ルーン獲得当ターン限定ATK倍率（ルーンナイト）
    if (game.runeKnightPassiveAtkMult !== 1.0) atkMult *= game.runeKnightPassiveAtkMult;
    if (atkMult !== 1.0) base = Math.floor(base * atkMult);
    // 魔力凝縮が有効（かつ発動ターン以降）であれば攻撃力を倍増する
    if (game.playerCondense && !game.playerCondense.justSet) {
      base = Math.floor(base * game.playerCondense.atkMultiplier);
    }
    // 狂血斧: 装備中は職業問わず ATK×1.5倍
    if (Object.values(this.equipment).includes('kyouketsu_no_ono')) {
      base = Math.floor(base * 1.5);
    }
    return Math.floor(base);
  }

  /**
   * DEF 倍率バフを適用した実効防御力を返す
   */
  get effectiveDefense() {
    let mult = 1.0;
    if (game.playerSageBuff && game.playerSageBuff.turnsLeft > 0)
      mult *= game.playerSageBuff.defMultiplier;
    if (game.playerSageMegaBuff && game.playerSageMegaBuff.turnsLeft > 0)
      mult *= game.playerSageMegaBuff.defMultiplier;
    // 魔剣士の覚醒 DEF倍率バフ
    if (game.playerMakenshiAwakeningBuff && game.playerMakenshiAwakeningBuff.turnsLeft > 0)
      mult *= game.playerMakenshiAwakeningBuff.defMultiplier;
    // 特級職バフ：天啓強化（オラクル）
    if (game.oracleEnhanceBuff) mult *= game.oracleEnhanceBuff.defMult;
    // 特級職バフ：オラクルバースト（オラクル）
    if (game.oracleBurstActive) mult *= game.oracleBurstActive.defMult;
    return Math.floor(this.defense * mult);
  }

  /**
   * 通常攻撃ダメージを計算して返す（会心効果・ATK バフを含む）
   */
  calcAttackDamage(target) {
    const raw = this.effectiveAttack - Math.floor(target.defense * DEFENSE_FACTOR);
    const dmg = Math.max(1, raw + randInt(-2, 2));
    return applyEquipmentEffects(dmg, 'deal');
  }

  /** 生存確認 */
  isAlive() { return this.hp > 0; }

  /** ダメージを受ける（被ダメージ軽減装備を含む）。実際に受けたダメージを返す */
  takeDamage(amount) {
    let reduced = applyEquipmentEffects(amount, 'take');
    // 聖騎士パッシブ: 被ダメージ軽減（聖盾pl_06: 10%、神聖防壁pl_12: +20%）
    if (this.currentJob === 'paladin') {
      const nodes = this.skillTreeNodes['paladin'] || [];
      let dmgReduction = 0;
      if (nodes.includes('pl_06')) dmgReduction += 0.10;
      if (nodes.includes('pl_12')) dmgReduction += 0.20;
      if (dmgReduction > 0) {
        reduced = Math.max(1, Math.floor(reduced * (1 - dmgReduction)));
      }
    }
    this.hp = Math.max(0, this.hp - reduced);
    return reduced;
  }

  /** HP を回復する（maxHp を超えない）。狂血斧装備中はHP回復を完全に無効化する。 */
  heal(amount) {
    if (Object.values(this.equipment).includes('kyouketsu_no_ono')) return;
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }
}

/* ==============================================================
   敵クラス
   ============================================================== */
class Enemy {
  constructor(name, hp, maxHp, attack, defense, expReward) {
    this.name      = name;
    this.hp        = hp;
    this.maxHp     = maxHp;
    this.attack    = attack;
    this.defense   = defense;
    this.expReward = expReward;
    this.poisoned  = false;
  }

  calcAttackDamage(target) {
    const def = target.effectiveDefense ?? target.defense;
    const raw = this.attack - Math.floor(def * DEFENSE_FACTOR);
    return Math.max(1, raw + randInt(-2, 2));
  }

  isAlive()       { return this.hp > 0; }
  takeDamage(amt) { this.hp = Math.max(0, this.hp - amt); }

  /** DEFデバフを適用した実効防御力を返す（スキルダメージ計算用） */
  get effectiveDefense() {
    let def = this.defense;
    if (game.enemyDefDebuff && game.enemyDefDebuff.turnsLeft > 0) {
      def = Math.floor(def * game.enemyDefDebuff.factor);
    }
    return def;
  }
}

/* ==============================================================
   ゲーム状態管理
   ============================================================== */
const GameState = {
  PLAYER_TURN: 'player_turn',
  ENEMY_TURN:  'enemy_turn',
  BATTLE_END:  'battle_end',
};

let game = {
  player:         null,
  enemy:          null,
  state:          null,
  battleCount:    0,
  currentScreen:  'lobby',
  dungeon: {
    id:              null,
    enemyIndex:      0,
    materials:       [],
    isGachaDungeon:  false,  // ガチャチケダンジョン中フラグ
    gachaDifficulty: null,   // 'beginner' | 'intermediate' | 'advanced'
    ticketsEarned:   0,      // 今回の探索で獲得したチケット数
  },
  shieldActive:      [],     // [{ defenseBonus: N, turnsLeft: N, source: 'skillId', name: '...' }] — DEFバフ（複数重複可）
  enemyPoisoned:     null,   // { active: bool, damage: N, turnsLeft: N }
  playerAtkBuff:     null,   // { bonus: N, turnsLeft: N } — 祝福スキル
  playerCondense:    null,   // { atkMultiplier: N, dmgMultiplier: N, justSet: bool } — 魔力凝縮
  enemyStunned:      false,  // 足払い・体当たりによるスタン
  enemyAtkDebuff:    null,   // { factor: 0.7, turnsLeft: N } — 威嚇・破壊の一撃
  playerRegen:       [],     // [{ hpPerTurn: N, turnsLeft: N, source: 'skillId', preTurn: bool }] — リジェネスキル（複数重複可）
  playerDelayedHeal: null,   // { healAmt: N, turnsLeft: N } — 神聖なうたい寝（遅延回復）
  playerSageBuff:    null,   // { atkMultiplier: N, defMultiplier: N, turnsLeft: N } — 強化魔法（倍率バフ）
  playerSageMegaBuff: null,  // { atkMultiplier: N, defMultiplier: N, turnsLeft: N } — 全体強化（倍率バフ）
  playerMakenshiAwakeningBuff: null, // { atkMultiplier: N, defMultiplier: N, turnsLeft: N } — 魔剣士の覚醒（倍率バフ）
  divineJudgmentActive: null, // { turnsLeft: N } — 神聖無双：反撃の構え100%化用フラグ
  turnDamageDealt:   0,      // このターンにプレイヤーが与えた総ダメージ（賢者吸魔パッシブ用）
  // 特級職バトル状態（バトル開始時に初期化）
  phantomAvoidChance:       0,     // ファントム攻撃無効化確率（%整数）
  phantomAvoidSuccessCount: 0,     // バトル中の攻撃無効化成功回数（亡霊の死撃用）
  pendingEffects:           [],    // 遅延エフェクト配列
  runeGrantActive:          false, // ルーン付与発動中フラグ
  runeGrantAtkMult:         1.0,   // ルーン付与ATK倍率
  runeGrantDmgMult:         1.0,   // ルーン付与被ダメ倍率
  runeReleaseActive:        false, // ルーン解放発動中フラグ（スキル効果×2）
  runeReleaseUsed:          false, // ルーン解放使用済みフラグ（バトル中1回）
  runeStrikeAtkBuff:        null,  // ルーンストライクATKバフ
  enemyDefDebuff:           null,  // 敵DEFデバフ { factor: N, turnsLeft: N, source: '...' }
  enemyAmpDmgActive:        null,  // 敵被ダメ増加（災厄の咆哮）{ factor: N, turnsLeft: N }
  crusaderApocCooldown:     0,     // クルセイドアポカリプスクールダウン
  phantomBladeDoT:          null,  // 亡霊の刃毎ターン追加ダメージ
  phantomDeathStrikeActive: null,  // 亡霊の死撃避け追加中
  prophecyActive:           null,  // 予言系スキル待機状態
  oracleProphecyFlowActive: false, // 予言の奔流発動中フラグ
  oracleEnhanceBuff:        null,  // 天啓強化バフ
  oracleBurstActive:        null,  // オラクルバーストバフ
  oracleSpiritActive:       null,  // 天啓聖魔召喚状態
  divinePunishmentDoT:      null,  // 神罰魔法毎ターンDoT
  divineJudgmentDebuff:     null,  // 神罰魔法敵デバフ
  ctRuinousWoundBuff:       null,  // 破滅の傷バフ（カタストロフ）
  phantomAvoidBuff:         null,  // ファントム無効化後ATKバフ
  crusaderStunAtkBuff:      null,  // クルセイダー：神聖の要塞スタン後ATK×1.5バフ { factor: 1.5, turnsLeft: 1 }
  oracleManaNotified:       false, // オラクルマナ初回発動通知フラグ
  phantomEyeAutoAttackReady: false, // 亡霊の眼（ph_passive_04）：次ターン自動攻撃フラグ
  runeKnightPassiveAtkMult: 1.0,  // ルーン獲得（rk_passive_02）：当ターン限定ATK倍率（使用後1.0にリセット）
};

/* ==============================================================
   戦闘ロジック
   ============================================================== */

function playerAction(action) {
  if (game.state !== GameState.PLAYER_TURN) return;

  switch (action) {
    case 'attack':
      setButtonsEnabled(false);
      hideSkillPanel();
      doPlayerAttack();
      break;
    case 'skill':
      // スキルパネルを表示（ターン消費なし）
      setButtonsEnabled(false);
      showSkillPanel();
      break;
    case 'flee':
      setButtonsEnabled(false);
      hideSkillPanel();
      doPlayerFlee();
      break;
    default:
      break;
  }
}

/** 通常攻撃処理 */
function doPlayerAttack() {
  applyMpRegenEffect();

  const player = game.player;
  const enemy  = game.enemy;

  // === 特級職パッシブ: 亡霊の眼（ph_passive_04）自動攻撃（前のターン回避成功時に発動） ===
  if (game.phantomEyeAutoAttackReady) {
    game.phantomEyeAutoAttackReady = false;
    if (enemy.isAlive()) {
      const eyeDmg = Math.max(1, Math.floor(player.effectiveAttack * 4.0));
      enemy.takeDamage(eyeDmg);
      game.turnDamageDealt += eyeDmg;
      log(`👁 「亡霊の眼」発動！ATK×4自動攻撃 → ${enemy.name} に ${eyeDmg} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      if (!enemy.isAlive()) {
        afterPlayerTurn();
        return;
      }
    }
  }

  // === 特級職パッシブ: ルーン獲得（rk_passive_02） / ルーン強化（rk_passive_03） ===
  const runeKnightNodes = player.skillTreeNodes['rune_knight'] || [];
  if (player.currentJob === 'rune_knight' && runeKnightNodes.includes('rk_passive_02')) {
    // rk_passive_03 有効時: 1/2の確率で2回実施、各回1/3の確率で発動
    // rk_passive_02 のみ: 1/3の確率で1回実施
    const hasBoostedRune = runeKnightNodes.includes('rk_passive_03');
    const maxTries = (hasBoostedRune && Math.random() < 0.5) ? 2 : 1;
    let atkMultAcc = 1.0;
    for (let t = 0; t < maxTries; t++) {
      if (Math.random() < (1 / 3)) {
        const roll = randInt(1, 3);
        if (roll === 1) {
          atkMultAcc *= 1.2;
          log(`✨ 「ルーン獲得」発動！このターンATK×1.2！`, 'player-action');
        } else if (roll === 2) {
          const rkHeal = Math.floor(player.maxHp * 0.10);
          player.heal(rkHeal);
          log(`✨ 「ルーン獲得」発動！HP +${rkHeal} 回復！`, 'player-action');
          renderPlayerStatus();
        } else {
          const rkMpHeal = Math.floor(player.maxMp * 0.05);
          player.mp = Math.min(player.maxMp, player.mp + rkMpHeal);
          log(`✨ 「ルーン獲得」発動！MP +${rkMpHeal} 回復！`, 'player-action');
          renderPlayerStatus();
        }
      }
    }
    if (atkMultAcc > 1.0) {
      game.runeKnightPassiveAtkMult = atkMultAcc;
      if (atkMultAcc > 1.2) {
        log(`💎 ルーン強化！ATK×${atkMultAcc.toFixed(2)}倍`, 'player-action');
      }
    }
  }

  // MP回復攻撃パッシブ（魔剣士 mk_06）が有効かチェック
  const hasMpRecovery = (player.skillTreeNodes['makenshi'] || []).includes('mk_06');

  // 翠賢の杖: 賢者装備中のみ通常攻撃が特殊効果に変化
  const hasSuikenNoTsue = Object.values(player.equipment).includes('suiken_no_tsue');
  const suikenActive    = player.currentJob === 'sage' && hasSuikenNoTsue;

  // 暗殺者パッシブチェック
  const assassinNodes = player.skillTreeNodes['assassin'] || [];
  const hasDefPierce  = player.currentJob === 'assassin' && assassinNodes.includes('as_08');
  const hasCrit70     = player.currentJob === 'assassin' && assassinNodes.includes('as_11');
  const hasCrit50     = player.currentJob === 'assassin' && assassinNodes.includes('as_06');
  // 超会心（as_11）が有効なら70%、会心強化（as_06）なら50%
  const critChance    = hasCrit70 ? 0.70 : (hasCrit50 ? 0.50 : 0);
  const isCrit        = critChance > 0 && Math.random() < critChance;

  // 黒曜の短剣: 暗殺者装備中のみ30%の確率で追加ターン獲得（攻撃前に判定）
  const hasKokuyouNoTanken = Object.values(player.equipment).includes('kokuyou_no_tanken');
  const kokuyouExtraTurn   = player.currentJob === 'assassin' && hasKokuyouNoTanken && Math.random() < 0.30;

  // ファントムパッシブチェック
  const phantomNodes     = player.skillTreeNodes['phantom'] || [];
  const hasPhantomCrit40 = player.currentJob === 'phantom' && phantomNodes.includes('ph_passive_04');
  const hasPhantomCrit20 = player.currentJob === 'phantom' && phantomNodes.includes('ph_passive_02');
  const hasPhantomPierce = player.currentJob === 'phantom' && phantomNodes.includes('ph_passive_03');
  let phantomCritChance  = 0;
  if (hasPhantomCrit40)      phantomCritChance = 0.40;
  else if (hasPhantomCrit20) phantomCritChance = 0.20;
  const isPhantomCrit    = phantomCritChance > 0 && Math.random() < phantomCritChance;

  if (hasMpRecovery) {
    // 通常攻撃の0.6倍ダメージ・蒼銀の剣の段階式計算に基づくMP回復（maxMp を超えない）
    const rawDmg = player.calcAttackDamage(enemy);
    const dmg    = Math.max(1, Math.floor(rawDmg * 0.6));
    enemy.takeDamage(dmg);
    game.turnDamageDealt += dmg;
    const mpBefore = player.mp;
    player.mp = Math.min(player.maxMp, player.mp + calcAoginMpRegen(player.level));
    const mpGained = player.mp - mpBefore;
    log(`⚔✨ ${player.name} の「MP回復攻撃」！ → ${enemy.name} に ${dmg} ダメージ！MP +${mpGained} 回復！`, 'player-action');
    renderPlayerStatus();
  } else if (suikenActive) {
    // 翠賢の杖: MP20以上で火力×1.4倍（MP20消費）、MP20未満で杖で殴る（ATK×0.8倍）
    if (player.mp >= 20) {
      player.mp -= 20;
      const rawDmg = player.calcAttackDamage(enemy);
      const dmg    = applyEquipmentEffects(Math.max(1, Math.floor(rawDmg * 1.4)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`🔮 ${player.name} の「翠賢の杖」魔力攻撃！ → ${enemy.name} に ${dmg} ダメージ！（MP -20）`, 'player-action');
      renderPlayerStatus();
    } else {
      // MP不足: ATK×0.8倍・MP消費なし
      const raw = Math.floor(player.effectiveAttack * 0.8) - Math.floor(enemy.defense * DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 2)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`🪄 ${player.name} は「翠賢の杖」で殴った！ → ${enemy.name} に ${dmg} ダメージ！（MP不足）`, 'player-action');
    }
  } else if (isPhantomCrit) {
    // ファントム会心（虚影の鋭気 or 亡霊の眼）: 防御完全無視の会心攻撃
    const raw = Math.floor(player.effectiveAttack * 1.5);
    const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 2)), 'deal');
    enemy.takeDamage(dmg);
    game.turnDamageDealt += dmg;
    const critSrc = hasPhantomCrit40 ? '亡霊の眼' : '虚影の鋭気';
    log(`💥 「${critSrc}」会心発動！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
  } else if (hasPhantomPierce) {
    // ファントムピアース（ph_passive_03）: 通常攻撃が常に防御無視
    const raw = Math.floor(player.effectiveAttack);
    const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 2)), 'deal');
    enemy.takeDamage(dmg);
    game.turnDamageDealt += dmg;
    log(`👻 「ファントムピアース」発動！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
  } else if (isCrit) {
    // 暗殺者会心: 防御完全無視の会心攻撃
    const raw = Math.floor(player.effectiveAttack * 1.5);
    const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 2)), 'deal');
    enemy.takeDamage(dmg);
    game.turnDamageDealt += dmg;
    log(`💥 ${player.name} の会心攻撃！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
  } else if (hasDefPierce) {
    // 防御貫通（as_08）: 通常攻撃が防御を無視する
    const raw = Math.floor(player.effectiveAttack);
    const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 2)), 'deal');
    enemy.takeDamage(dmg);
    game.turnDamageDealt += dmg;
    log(`🗡 ${player.name} の防御貫通攻撃！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
  } else {
    const dmg = player.calcAttackDamage(enemy);
    enemy.takeDamage(dmg);
    game.turnDamageDealt += dmg;
    log(`▶ ${player.name} の攻撃！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
  }

  // ルーン獲得ATK倍率をリセット
  game.runeKnightPassiveAtkMult = 1.0;

  renderEnemyStatus();

  // === 特級職パッシブ: オラクルマナ（oc_passive_03）：MP<130なら最大MPの15%回復 ===
  const oracleNodes = player.skillTreeNodes['oracle'] || [];
  if (player.currentJob === 'oracle' && oracleNodes.includes('oc_passive_03') && player.mp < 130) {
    if (!game.oracleManaNotified) {
      game.oracleManaNotified = true;
      log(`🔮 オラクルマナが発動可能になった！`, 'player-action');
    }
    const ocMpHeal = Math.floor(player.maxMp * 0.15);
    player.mp = Math.min(player.maxMp, player.mp + ocMpHeal);
    log(`🔮 「オラクルマナ」発動！MP +${ocMpHeal} 回復！`, 'player-action');
    renderPlayerStatus();
  }

  // 黒曜の短剣: 追加ターン処理（暗殺者装備中のみ・敵が生存時に発動）
  if (kokuyouExtraTurn && enemy.isAlive()) {
    log(`⚡ 「黒曜の短剣」の効果発動！敵の行動をスキップして追加ターン獲得！`, 'player-action');
    // 賢者吸魔パッシブを適用してからターンダメージをリセット
    applySageLifeDrain();
    game.turnDamageDealt = 0;
    // 魔力凝縮の状態を進める（justSet なら false に変更、凝縮中なら解除）
    if (game.playerCondense) {
      if (game.playerCondense.justSet) {
        game.playerCondense.justSet = false;
      } else {
        game.playerCondense = null;
      }
    }
    renderPlayerStatus();
    game.state = GameState.PLAYER_TURN;
    log('─'.repeat(LOG_SEPARATOR_LENGTH), 'system');
    log('追加ターン！アクションを選んでください。', 'system');
    setButtonsEnabled(true);
    return;
  }

  afterPlayerTurn();
}

/** 逃げる/撤退処理 */
function doPlayerFlee() {
  const success = Math.random() < FLEE_SUCCESS_RATE;
  if (success) {
    log(`🚪 ${game.player.name} はダンジョンから撤退した！`, 'result');
    game.state = GameState.BATTLE_END;
    retreatFromDungeon();
  } else {
    log(`${game.player.name} は逃げようとしたが、失敗した！`, 'system');
    afterPlayerTurn();
  }
}

/** 賢者パッシブ: このターンの与ダメージの一部をHP回復する */
// 吸魔の回収率定数
const SAGE_DRAIN_RATE_BASE = 0.05; // sg_06 吸魔: 5%
// ※ sg_12 (魔力増幅) はMP最大値倍率パッシブに変更されたため、ここでは参照しない（recalcStats で処理）
function applySageLifeDrain() {
  const player = game.player;
  if (player.currentJob !== 'sage') return;
  if (game.turnDamageDealt <= 0) return;
  const nodes = player.skillTreeNodes['sage'] || [];
  let drainRate = 0;
  if (nodes.includes('sg_06')) drainRate += SAGE_DRAIN_RATE_BASE;
  if (drainRate <= 0) return;
  const healAmt = Math.max(1, Math.floor(game.turnDamageDealt * drainRate));
  player.heal(healAmt);
  log(`💚 吸魔：与えたダメージから HP +${healAmt} 回収！`, 'player-action');
  renderPlayerStatus();
}

/** プレイヤーのターン終了後の処理 */
function afterPlayerTurn() {
  // 賢者パッシブ: 与ダメージの一部をHP回復する
  applySageLifeDrain();
  game.turnDamageDealt = 0;

  // 魔力凝縮の状態を進める
  // justSet=true: 発動したばかりのターン → 次のターンに持ち越すため false に変更するだけ
  // justSet=false: 凝縮中に行動した → 消費して解除する
  if (game.playerCondense) {
    if (game.playerCondense.justSet) {
      game.playerCondense.justSet = false;
    } else {
      game.playerCondense = null;
    }
  }

  // ファントムパッシブ: ターン終了時に攻撃無効化確率を加算する
  // ph_passive_02 (虚影の鋭気): +10%、ph_passive_03 (ファントムピアース): +5%
  if (game.player.currentJob === 'phantom') {
    const phNodes = game.player.skillTreeNodes['phantom'] || [];
    if (phNodes.includes('ph_passive_02')) {
      game.phantomAvoidChance += 10;
    }
    if (phNodes.includes('ph_passive_03')) {
      game.phantomAvoidChance += 5;
    }
  }

  renderPlayerStatus();

  if (!game.enemy.isAlive()) {
    endBattle('win');
    return;
  }

  game.state = GameState.ENEMY_TURN;
  setTimeout(doEnemyTurn, ENEMY_TURN_DELAY_MS);
}

/** プレイヤーのバフターンを進める */
function tickPlayerBuffs() {
  if (game.playerAtkBuff && game.playerAtkBuff.turnsLeft > 0) {
    game.playerAtkBuff.turnsLeft--;
    if (game.playerAtkBuff.turnsLeft <= 0) {
      game.playerAtkBuff = null;
      log('🌟 祝福の効果が切れた。', 'system');
    }
  }
  if (game.playerSageBuff && game.playerSageBuff.turnsLeft > 0) {
    game.playerSageBuff.turnsLeft--;
    if (game.playerSageBuff.turnsLeft <= 0) {
      game.playerSageBuff = null;
      log('📖 強化魔法の効果が切れた。', 'system');
    }
  }
  if (game.playerSageMegaBuff && game.playerSageMegaBuff.turnsLeft > 0) {
    game.playerSageMegaBuff.turnsLeft--;
    if (game.playerSageMegaBuff.turnsLeft <= 0) {
      game.playerSageMegaBuff = null;
      log('📖 全体強化の効果が切れた。', 'system');
    }
  }
  if (game.playerMakenshiAwakeningBuff && game.playerMakenshiAwakeningBuff.turnsLeft > 0) {
    game.playerMakenshiAwakeningBuff.turnsLeft--;
    if (game.playerMakenshiAwakeningBuff.turnsLeft <= 0) {
      game.playerMakenshiAwakeningBuff = null;
      log('🌌 魔剣士の覚醒の効果が切れた。', 'system');
    }
  }
  if (game.divineJudgmentActive && game.divineJudgmentActive.turnsLeft > 0) {
    game.divineJudgmentActive.turnsLeft--;
    if (game.divineJudgmentActive.turnsLeft <= 0) {
      game.divineJudgmentActive = null;
      log('🌟 神聖無双の反撃強化効果が切れた。', 'system');
    }
  }
  // 特級職バフ：クルセイダー神聖の要塞スタン後ATK×1.5バフのターン管理
  if (game.crusaderStunAtkBuff && game.crusaderStunAtkBuff.turnsLeft > 0) {
    game.crusaderStunAtkBuff.turnsLeft--;
    if (game.crusaderStunAtkBuff.turnsLeft <= 0) {
      game.crusaderStunAtkBuff = null;
      log('✝ 「神聖の要塞」ATKバフの効果が切れた。', 'system');
    }
  }
  // 敵DEFデバフのターン管理（スキルによる設定）
  if (game.enemyDefDebuff && game.enemyDefDebuff.turnsLeft > 0 && game.enemyDefDebuff.turnsLeft < 999) {
    game.enemyDefDebuff.turnsLeft--;
    if (game.enemyDefDebuff.turnsLeft <= 0) {
      game.enemyDefDebuff = null;
    }
  }
}

/**
 * プレイヤーのリジェネ効果を処理する
 * @param {boolean} preTurn - true: 敵攻撃前リジェネ / false: 敵攻撃後リジェネ
 */
function tickPlayerRegen(preTurn = false) {
  for (let i = game.playerRegen.length - 1; i >= 0; i--) {
    const regen = game.playerRegen[i];
    if (regen.preTurn !== preTurn) continue;
    const healAmt = regen.hpPerTurn;
    game.player.heal(healAmt);
    regen.turnsLeft--;
    log(`💚 リジェネで HP +${healAmt} 回復！（残${regen.turnsLeft}ターン）`, 'player-action');
    renderPlayerStatus();
    if (regen.turnsLeft <= 0) {
      game.playerRegen.splice(i, 1);
      log('リジェネの効果が切れた。', 'system');
    }
  }
}

/** 神聖なうたい寝の遅延回復を処理する */
function tickPlayerDelayedHeal() {
  if (!game.playerDelayedHeal) return;
  game.playerDelayedHeal.turnsLeft--;
  if (game.playerDelayedHeal.turnsLeft <= 0) {
    const healAmt = game.playerDelayedHeal.healAmt;
    game.player.heal(healAmt);
    game.playerDelayedHeal = null;
    log(`✨ 「神聖なうたい寝」の加護が発動！ HP +${healAmt} 回復！`, 'player-action');
    renderPlayerStatus();
  } else {
    log(`🎵 「神聖なうたい寝」の加護まで残り ${game.playerDelayedHeal.turnsLeft} ターン…`, 'system');
  }
}

/**
 * 遅延エフェクト（pendingEffects）を処理する
 * ターン終了時に呼ばれ、各エフェクトのturnsLeftを-1し、0になったら発動して削除する
 */
function processPendingEffects() {
  const player = game.player;
  const enemy  = game.enemy;

  for (let i = game.pendingEffects.length - 1; i >= 0; i--) {
    const eff = game.pendingEffects[i];
    eff.turnsLeft--;

    if (eff.turnsLeft <= 0) {
      // エフェクト発動
      switch (eff.type) {
        case 'heal': {
          player.heal(eff.value);
          log(`💚 「${eff.skillId}」遅延回復発動！HP +${eff.value} 回復！`, 'player-action');
          renderPlayerStatus();
          break;
        }
        case 'damage_noDef': {
          const dName = eff.msgTemplate || eff.skillId;
          if (enemy.isAlive()) {
            enemy.takeDamage(eff.value);
            log(`💥 「${dName}」発動！ → ${enemy.name} に ${eff.value} ダメージ！（防御無視）`, 'player-action');
            renderEnemyStatus();
          }
          break;
        }
        case 'debuff_atkFactor': {
          // 次ターン敵ATKデバフ（ルーン爆裂斬）
          if (!game.enemyAtkDebuff || game.enemyAtkDebuff.factor > eff.value) {
            game.enemyAtkDebuff = { factor: eff.value, turnsLeft: 1 };
          }
          log(`💢 遅延デバフ発動：${enemy.name} のATK×${eff.value}デバフ（1ターン）！`, 'system');
          break;
        }
        case 'self_debuff_atkdef': {
          // 自ATK・DEFデバフ（ルーンカタクリズム）
          if (!game.pendingRkSelfDebuff) {
            game.pendingRkSelfDebuff = { factor: eff.value, turnsLeft: 1 };
          }
          log(`⚠ ルーンカタクリズムの反動：自ATK・DEF×${eff.value}デバフが発動！（1ターン）`, 'system');
          break;
        }
        case 'self_debuff_def': {
          // 自DEFデバフ（亡霊の死撃）
          if (!game.pendingPhDefDebuff) {
            game.pendingPhDefDebuff = { factor: eff.value, turnsLeft: 99 };
          }
          log(`⚠ 亡霊の死撃の代償：自DEFが1/3に低下した！`, 'system');
          break;
        }
        case 'self_damage_pct': {
          // 自傷ダメージ（破滅の傷）
          const selfDmg = Math.floor(player.maxHp * eff.value);
          player.hp = Math.max(1, player.hp - selfDmg);
          log(`💀 「破滅の傷」自傷：HP -${selfDmg} ！`, 'player-action');
          renderPlayerStatus();
          break;
        }
        case 'damage_phantom_death': {
          // 亡霊の死撃遅延ダメージ（無効化回数×ATK×20）
          if (enemy.isAlive()) {
            const countM = game.phantomAvoidSuccessCount > 0
              ? game.phantomAvoidSuccessCount * eff.value.mult
              : eff.value.fallbackMult;
            const phdDmg = Math.max(1, Math.floor(player.effectiveAttack * countM));
            enemy.takeDamage(phdDmg);
            log(`👻💀 「亡霊の死撃」発動！（無効化${game.phantomAvoidSuccessCount}回 × ATK×${eff.value.mult}）→ ${enemy.name} に ${phdDmg} ダメージ！`, 'player-action');
            renderEnemyStatus();
          }
          break;
        }
        case 'avoid_add': {
          // 攻撃無効化確率加算（ファントムアビス）
          game.phantomAvoidChance += eff.value;
          break;
        }
        case 'prophecy_01': {
          // 予言魔法発動
          if (enemy.isAlive()) {
            const pDmg = eff.value.dmg;
            enemy.takeDamage(pDmg);
            log(`🔮 「予言魔法」発動！ → ${enemy.name} に ${pDmg} ダメージ！`, 'player-action');
            renderEnemyStatus();
            // オラクルパッシブ oc_passive_02 (予言の加護): 予言魔法ダメージ後に最大HP・MP各5%回復
            if (player.currentJob === 'oracle' && (player.skillTreeNodes['oracle'] || []).includes('oc_passive_02')) {
              const ocHpHeal = Math.floor(player.maxHp * 0.05);
              const ocMpHeal = Math.floor(player.maxMp * 0.05);
              player.heal(ocHpHeal);
              player.mp = Math.min(player.maxMp, player.mp + ocMpHeal);
              log(`✨ 「予言の加護」発動！HP +${ocHpHeal}・MP +${ocMpHeal} 回復！`, 'player-action');
              renderPlayerStatus();
            }
          }
          const pHeal = eff.value.heal;
          player.heal(pHeal);
          log(`🔮 「予言魔法」HP +${pHeal} 回復！`, 'player-action');
          renderPlayerStatus();
          if (game.prophecyActive && game.prophecyActive.type === 'oc_skill_01') {
            game.prophecyActive = null;
          }
          break;
        }
        case 'debuff_enemy_multiturn': {
          // クルセイドアポカリプス段階デバフ
          if (eff.value.atk !== undefined) {
            if (!game.divineJudgmentDebuff) game.divineJudgmentDebuff = { atkFactor: 1.0, defFactor: 1.0, permanent: false };
            game.divineJudgmentDebuff.atkFactor = Math.min(game.divineJudgmentDebuff.atkFactor, eff.value.atk || 1.0);
            if (eff.value.atk === 0) game.enemyAtkDebuff = { factor: 0, turnsLeft: 1 };
            else if (eff.value.atk < 1) game.enemyAtkDebuff = { factor: eff.value.atk, turnsLeft: 1 };
            if (eff.value.def !== undefined && eff.value.def < 1) game.enemyDefDebuff = { factor: eff.value.def, turnsLeft: 1, source: 'cr_skill_05' };
          }
          break;
        }
        default:
          break;
      }

      // 発動済みエフェクトを削除
      game.pendingEffects.splice(i, 1);

      // 敵が倒れた場合は即座に戦闘終了
      if (enemy && !enemy.isAlive()) {
        endBattle('win');
        return;
      }
    }
  }
}

/** 敵のターン処理 */
function doEnemyTurn() {
  if (game.state !== GameState.ENEMY_TURN) return;

  // スタン判定（足払い・体当たりの効果）
  if (game.enemyStunned) {
    game.enemyStunned = false;
    log(`⚡ ${game.enemy.name} はスタンして行動できない！`, 'system');
    tickPlayerBuffs();
    tickPlayerRegen(true);
    tickPlayerRegen(false);
    tickPlayerDelayedHeal();
    processPendingEffects();
    game.state = GameState.PLAYER_TURN;
    log('─'.repeat(LOG_SEPARATOR_LENGTH), 'system');
    log('あなたのターンです。アクションを選んでください。', 'system');
    setButtonsEnabled(true);
    return;
  }

  // 毒ダメージ（毒は敵ターン開始時に適用）
  if (game.enemyPoisoned && game.enemyPoisoned.active) {
    const poisonDmg = game.enemyPoisoned.damage;
    game.enemy.takeDamage(poisonDmg);
    game.enemyPoisoned.turnsLeft--;
    log(`☠ ${game.enemy.name} は毒で ${poisonDmg} ダメージを受けた！（残${game.enemyPoisoned.turnsLeft}ターン）`, 'player-action');
    renderEnemyStatus();

    if (!game.enemy.isAlive()) {
      endBattle('win');
      return;
    }
    if (game.enemyPoisoned.turnsLeft <= 0) {
      game.enemyPoisoned = null;
      log('毒が解けた。', 'system');
    }
  }

  // ファントムパッシブ①（完全幻影）：敵ターン開始時に攻撃無効化確率+20%加算
  if (game.player.currentJob === 'phantom') {
    const phantomNodes = game.player.skillTreeNodes['phantom'] || [];
    if (phantomNodes.includes('ph_06')) {
      game.phantomAvoidChance += 20;
    }
    // 亡霊の死撃アクティブ中は追加加算
    if (game.phantomDeathStrikeActive && game.phantomDeathStrikeActive.turnsLeft > 0) {
      game.phantomAvoidChance += game.phantomDeathStrikeActive.avoidAdd;
      game.phantomDeathStrikeActive.turnsLeft--;
      if (game.phantomDeathStrikeActive.turnsLeft <= 0) game.phantomDeathStrikeActive = null;
    }
  }

  // 攻撃無効化判定（ファントム攻撃回避システム）
  if (game.phantomAvoidChance > 0) {
    const avoidRoll = Math.random() * 100;
    const avoidChance = game.phantomAvoidChance;
    game.phantomAvoidChance = 0; // ターン終了後に0リセット
    if (avoidRoll < avoidChance) {
      // 無効化成功
      log(`✨ ${game.player.name} は ${game.enemy.name} の攻撃を無効化した！`, 'player-action');
      game.phantomAvoidSuccessCount++;
      // ファントムパッシブ②（影の極致）：無効化成功後次ターンATK×1.5バフ
      if (game.player.currentJob === 'phantom') {
        const phantomNodes = game.player.skillTreeNodes['phantom'] || [];
        if (phantomNodes.includes('ph_12')) {
          if (!game.playerAtkBuff) game.playerAtkBuff = { bonus: 0, turnsLeft: 0 };
          // 一時的ATK倍率バフ（次ターン有効）
          game.phantomAvoidBuff = { factor: 1.5, turnsLeft: 1 };
          log(`🌟 「影の極致」発動！次ターンATK×1.5バフ！`, 'player-action');
        }
        // 亡霊の眼（ph_passive_04）：無効化成功後次ターンATK×4自動攻撃セット
        if (phantomNodes.includes('ph_passive_04')) {
          game.phantomEyeAutoAttackReady = true;
          log(`👁 「亡霊の眼」感知！次ターンにATK×4自動攻撃が発動する！`, 'player-action');
        }
      }
      tickPlayerBuffs();
      tickPlayerRegen(true);
      tickPlayerRegen(false);
      tickPlayerDelayedHeal();
      processPendingEffects();
      game.state = GameState.PLAYER_TURN;
      log('─'.repeat(LOG_SEPARATOR_LENGTH), 'system');
      log('あなたのターンです。アクションを選んでください。', 'system');
      setButtonsEnabled(true);
      return;
    }
    // 無効化失敗：通常攻撃を受ける
  } else {
    game.phantomAvoidChance = 0;
  }

  // 敵攻撃前リジェネを適用（聖騎士リジェネ系スキル）
  tickPlayerRegen(true);

  // 敵の通常攻撃
  let rawDmg = game.enemy.calcAttackDamage(game.player);

  // 敵 ATK デバフを適用（威嚇・破壊の一撃）
  if (game.enemyAtkDebuff && game.enemyAtkDebuff.turnsLeft > 0) {
    rawDmg = Math.floor(rawDmg * game.enemyAtkDebuff.factor);
    game.enemyAtkDebuff.turnsLeft--;
    if (game.enemyAtkDebuff.turnsLeft <= 0) {
      game.enemyAtkDebuff = null;
      log(`${game.enemy.name} のデバフが解けた。`, 'system');
    }
  }

  // 神罰魔法デバフ（オラクル）
  if (game.divineJudgmentDebuff) {
    rawDmg = Math.floor(rawDmg * game.divineJudgmentDebuff.atkFactor);
  }

  // 魔力凝縮中は被ダメージ増加（凝縮エネルギーを溜めているため隙が大きい）
  if (game.playerCondense && !game.playerCondense.justSet) {
    rawDmg = Math.floor(rawDmg * game.playerCondense.dmgMultiplier);
  }

  // ルーン付与中は被ダメージ増加
  if (game.runeGrantActive) {
    rawDmg = Math.floor(rawDmg * game.runeGrantDmgMult);
  }

  // シールド効果を適用（DEFバフ：複数重複可）
  // クルセイダーパッシブ③（絶対防壁）：シールド中の被ダメージを0にする
  let absoluteShield = false;
  if (game.player.currentJob === 'crusader') {
    const crNodes = game.player.skillTreeNodes['crusader'] || [];
    if (crNodes.includes('cr_15') && game.shieldActive.length > 0) {
      absoluteShield = true;
    }
  }
  if (absoluteShield) {
    rawDmg = 0;
    game.shieldActive = game.shieldActive
      .map(s => ({ ...s, turnsLeft: s.turnsLeft - 1 }))
      .filter(s => {
        if (s.turnsLeft <= 0) {
          log(`🛡 ${s.name}の効果が切れた。`, 'system');
          return false;
        }
        return true;
      });
    log(`🛡 「絶対防壁」発動！シールド中のダメージを完全に無効化した！`, 'player-action');
  } else if (game.shieldActive.length > 0) {
    const totalBonus = game.shieldActive.reduce((sum, s) => sum + s.defenseBonus, 0);
    rawDmg = Math.max(1, rawDmg - totalBonus);
    game.shieldActive = game.shieldActive
      .map(s => ({ ...s, turnsLeft: s.turnsLeft - 1 }))
      .filter(s => {
        if (s.turnsLeft <= 0) {
          log(`🛡 ${s.name}の効果が切れた。`, 'system');
          return false;
        }
        return true;
      });
  }

  // クルセイダーパッシブ①（聖域の守護）：被ダメージ15%軽減（絶対防壁中はすでに0のため適用しない）
  if (!absoluteShield && game.player.currentJob === 'crusader') {
    const crNodes = game.player.skillTreeNodes['crusader'] || [];
    if (crNodes.includes('cr_06')) {
      rawDmg = Math.max(1, Math.floor(rawDmg * 0.85));
    }
    // 神聖障壁（cr_passive_02）：被ダメージ5%軽減＋攻撃してきた敵を10%でスタン
    if (crNodes.includes('cr_passive_02')) {
      rawDmg = Math.max(1, Math.floor(rawDmg * 0.95));
      const stunChance = crNodes.includes('cr_passive_04') ? 0.15 : 0.10;
      if (Math.random() < stunChance) {
        game.enemyStunned = true;
        const stunSrc = crNodes.includes('cr_passive_04') ? 'クルセイドカウンター' : '神聖障壁';
        log(`✝ 「${stunSrc}」発動！${game.enemy.name} をスタンさせた！`, 'player-action');
      }
    }
    // 神聖の要塞（cr_passive_03）：被ダメージさらに10%軽減、敵スタン時ATK×1.5バフ付与
    if (crNodes.includes('cr_passive_03')) {
      rawDmg = Math.max(1, Math.floor(rawDmg * 0.90));
      if (game.enemyStunned) {
        game.crusaderStunAtkBuff = { factor: 1.5, turnsLeft: 1 };
        log(`✝ 「神聖の要塞」発動！次ターンATK×1.5バフ！`, 'player-action');
      }
    }
    // クルセイドカウンター（cr_passive_04）：被攻撃時10%でダメージ無効化、30%でATK×2反撃（独立判定）
    if (crNodes.includes('cr_passive_04')) {
      if (Math.random() < 0.10) {
        rawDmg = 0;
        log(`✝ 「クルセイドカウンター」発動！ダメージを無効化した！`, 'player-action');
      }
      if (Math.random() < 0.30 && game.enemy.isAlive()) {
        const ctrDmg = Math.max(1, Math.floor(game.player.attack * 2.0));
        game.enemy.takeDamage(ctrDmg);
        log(`✝ 「クルセイドカウンター」反撃！ → ${game.enemy.name} に ${ctrDmg} ダメージ！（ATK×2）`, 'player-action');
        renderEnemyStatus();
      }
    }
  }

  // カタストロフ被ダメ増加（disaster_howl）
  if (game.enemyAmpDmgActive && game.enemyAmpDmgActive.turnsLeft > 0) {
    rawDmg = Math.floor(rawDmg * game.enemyAmpDmgActive.factor);
    game.enemyAmpDmgActive.turnsLeft--;
    if (game.enemyAmpDmgActive.turnsLeft <= 0) {
      game.enemyAmpDmgActive = null;
    }
  }

  if (rawDmg > 0) {
    const actualDmg = game.player.takeDamage(rawDmg);
    log(`◀ ${game.enemy.name} の攻撃！ → ${game.player.name} に ${actualDmg} ダメージ！`, 'enemy-action');
    renderPlayerStatus();
  }

  // カタストロフパッシブ：死線の執念（ct_passive_02）：致死ダメージをHP1で生存（探索中1回限り）
  if (!game.player.isAlive() &&
      game.player.currentJob === 'catastrophe' &&
      (game.player.skillTreeNodes['catastrophe'] || []).includes('ct_passive_02') &&
      !game.player.deathDefied) {
    game.player.hp = 1;
    game.player.deathDefied = true;
    log(`💀 「死線の執念」が発動！HP1で生き残った！`, 'player-action');
    renderPlayerStatus();
  }

  // 亡霊の刃パッシブDoT（毎ターン追加ダメージ）
  if (game.phantomBladeDoT && game.phantomBladeDoT.active && game.enemy.isAlive()) {
    const dotDmg = Math.max(1, Math.floor(game.player.effectiveAttack * game.phantomBladeDoT.baseMult));
    game.enemy.takeDamage(dotDmg);
    log(`👻 「亡霊の刃」追加ダメージ：${game.enemy.name} に ${dotDmg} ダメージ！（防御無視）`, 'player-action');
    renderEnemyStatus();
  }

  // 神罰魔法DoT（毎ターン追加ダメージ）
  if (game.divinePunishmentDoT && game.divinePunishmentDoT.active && game.enemy.isAlive()) {
    const dotDmg2 = Math.max(1, Math.floor(game.player.effectiveAttack * game.divinePunishmentDoT.mult));
    game.enemy.takeDamage(dotDmg2);
    log(`🔮 「神罰魔法」追加ダメージ：${game.enemy.name} に ${dotDmg2} ダメージ！`, 'player-action');
    renderEnemyStatus();
  }

  // 聖騎士パッシブ: 被攻撃時にカウンター攻撃（神聖無双発動中は100%、通常時は30%）
  if (game.player.currentJob === 'paladin' &&
      (game.player.skillTreeNodes['paladin'] || []).includes('pl_15') &&
      game.player.isAlive()) {
    const counterChance = (game.divineJudgmentActive && game.divineJudgmentActive.turnsLeft > 0) ? 1.0 : 0.30;
    if (Math.random() < counterChance) {
      const seisouEquipped = Object.values(game.player.equipment).includes('seisou_no_sou');
      let counterMult = 0.8;
      if (seisouEquipped) {
        const seisouEnhLv = game.player.enhanceLevels['seisou_no_sou'] || 0;
        counterMult = 0.8 * (1.5 + 0.1 * seisouEnhLv);
      }
      const counterDmg = Math.max(1, Math.floor(game.player.attack * counterMult));
      game.enemy.takeDamage(counterDmg);
      const seisouMsg = seisouEquipped ? '（神聖の穿槍強化）' : '';
      log(`🛡 「反撃の構え」発動！カウンター攻撃で ${game.enemy.name} に ${counterDmg} ダメージ！${seisouMsg}`, 'player-action');
      // クルセイダーパッシブ②（聖なる反撃）：カウンター時HP5%回復
      if (game.player.currentJob === 'crusader') {
        const crNodes = game.player.skillTreeNodes['crusader'] || [];
        if (crNodes.includes('cr_12')) {
          const healAmt = Math.floor(game.player.maxHp * 0.05);
          game.player.heal(healAmt);
          log(`✝ 「聖なる反撃」：HP +${healAmt} 回復！`, 'player-action');
          renderPlayerStatus();
        }
      }
      renderEnemyStatus();
    }
  }

  if (!game.enemy.isAlive()) {
    endBattle('win');
    return;
  }

  if (!game.player.isAlive()) {
    endBattle('lose');
    return;
  }

  // プレイヤー ATK バフのターン管理
  tickPlayerBuffs();
  tickPlayerRegen(false);
  tickPlayerDelayedHeal();
  processPendingEffects();

  // ファントム無効化バフのカウントダウン
  if (game.phantomAvoidBuff && game.phantomAvoidBuff.turnsLeft > 0) {
    game.phantomAvoidBuff.turnsLeft--;
    if (game.phantomAvoidBuff.turnsLeft <= 0) {
      game.phantomAvoidBuff = null;
    }
  }

  // クルセイドアポカリプスのクールダウン
  if (game.crusaderApocCooldown > 0) {
    game.crusaderApocCooldown--;
    if (game.crusaderApocCooldown <= 0) {
      log(`✝ 「クルセイドアポカリプス」が再使用可能になった！`, 'system');
    }
  }

  // 天啓聖魔：召喚中のランダム行動
  if (game.oracleSpiritActive && game.oracleSpiritActive.turnsLeft > 0 && game.enemy.isAlive()) {
    const pat = randInt(1, 3);
    if (pat === 1) {
      const spDmgRaw = Math.floor(game.player.effectiveAttack * 3.0) - Math.floor(game.enemy.defense * SKILL_DEFENSE_FACTOR);
      const spDmg = applyEquipmentEffects(Math.max(1, spDmgRaw), 'deal');
      game.enemy.takeDamage(spDmg);
      log(`🔮 聖魔が攻撃！ → ${game.enemy.name} に ${spDmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
    } else if (pat === 2) {
      const spHeal = Math.floor(game.player.maxHp * 0.10);
      game.player.heal(spHeal);
      log(`🔮 聖魔が回復！HP +${spHeal} 回復！`, 'player-action');
      renderPlayerStatus();
    }
    game.oracleSpiritActive.turnsLeft--;
    if (game.oracleSpiritActive.turnsLeft <= 0) {
      log(`🔮 聖魔が消えた。4ターン目に聖魔暴走が使用可能になった！（天啓聖魔を再度使用してください）`, 'system');
    }
  }

  if (!game.enemy.isAlive()) {
    endBattle('win');
    return;
  }

  game.state = GameState.PLAYER_TURN;
  log('─'.repeat(LOG_SEPARATOR_LENGTH), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');
  setButtonsEnabled(true);
}

/**
 * 戦闘終了処理
 * @param {'win'|'lose'} result
 */
function endBattle(result) {
  game.state = GameState.BATTLE_END;
  setButtonsEnabled(false);
  hideSkillPanel();

  if (result === 'win') {
    const exp = game.enemy.expReward;

    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'special');
    if (game.dungeon.isXpDungeon || game.dungeon.isSkillDungeon) {
      log(`🏆 ${game.enemy.name} を倒した！`, 'result');
    } else {
      log(`🏆 ${game.enemy.name} を倒した！ EXP +${exp}`, 'result');
    }

    // 図鑑: 討伐を記録する
    recordMonsterDefeat(game.enemy.name);

    // ドロップ処理
    processDrop();

    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'special');

    // EXP 加算とレベルアップチェック
    // XPダンジョンはprocessXpDropで積み立て、スキルダンジョンはEXP0のため直接付与しない
    if (!game.dungeon.isXpDungeon && !game.dungeon.isSkillDungeon) {
      gainExp(exp);
    }

    // 特殊ダンジョン（30体）かどうかでボス判定の基準を切り替える
    // GACHA_DUNGEON_ENEMY_COUNT と XP/RAREMON/SKILL_DUNGEON_ENEMY_COUNT はすべて 30
    const isBoss = (
      game.dungeon.isGachaDungeon   ||
      game.dungeon.isXpDungeon      ||
      game.dungeon.isRaremonDungeon ||
      game.dungeon.isSkillDungeon
    )
      ? game.dungeon.enemyIndex === GACHA_DUNGEON_ENEMY_COUNT - 1
      : game.dungeon.enemyIndex === DUNGEON_ENEMY_COUNT - 1;
    game.dungeon.enemyIndex++;

    showDungeonNav(true, isBoss);

  } else if (result === 'lose') {
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'enemy-action');
    log(`☠ ${game.player.name} は力尽きた…`, 'enemy-action');
    if (game.dungeon.isGachaDungeon) {
      log('💀 探索中に獲得したガチャチケットをすべて失った。', 'special');
    } else if (game.dungeon.isXpDungeon) {
      log('💀 探索中に獲得したEXPをすべて失った。', 'special');
    } else if (game.dungeon.isSkillDungeon) {
      log('💀 探索中に獲得したスキルストーンをすべて失った。', 'special');
    } else if (game.dungeon.isRaremonDungeon) {
      log('💀 探索中に獲得した素材をすべて失った。', 'special');
    } else {
      log('💀 ダンジョン内で獲得した素材をすべて失った。', 'special');
    }
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'enemy-action');

    setTimeout(failDungeon, 1500);
  }
}

/* ==============================================================
   スキルパネル
   ============================================================== */

/** スキルパネルで現在選択中のルートタブ */
let _skillPanelRoute = null;

/** スキル選択パネルを表示する（route: タブで選択するルートID、'all' ですべて表示、'favorite' でお気に入り表示） */
function showSkillPanel(route) {
  const panel  = document.getElementById('skill-panel');
  const player = game.player;

  // 各ルートの習得済みスキルをまとめる
  const routeDefMap = {};
  SKILL_TREE_DEFINITIONS.forEach(r => { routeDefMap[r.id] = r; });

  const routeMap = {};
  SKILL_DEFINITIONS.forEach(s => {
    if (player.learnedSkills.includes(s.id)) {
      if (!routeMap[s.route]) {
        const routeDef = routeDefMap[s.route];
        routeMap[s.route] = { name: routeDef ? routeDef.name : s.route, skills: [] };
      }
      routeMap[s.route].skills.push(s);
    }
  });

  const availableRoutes = SKILL_TREE_DEFINITIONS.filter(r => routeMap[r.id]);

  // 習得済みスキルが1つもない場合
  if (availableRoutes.length === 0) {
    panel.innerHTML = '<span class="skill-none">習得済みスキルなし</span>'
      + '<button class="skill-cancel-btn" onclick="cancelSkillPanel()">キャンセル</button>';
    panel.style.display = 'flex';
    return;
  }

  // 選択中のタブが有効でない場合はデフォルトタブに切り替え
  // お気に入りスキルが存在する場合は「お気に入り」タブを初期表示とする
  if (!route || (route !== 'all' && route !== 'favorite' && !routeMap[route])) {
    const hasFavorites = SKILL_DEFINITIONS.some(
      s => player.favoriteSkills.includes(s.id) && player.learnedSkills.includes(s.id)
    );
    route = hasFavorites ? 'favorite' : 'all';
  }
  _skillPanelRoute = route;

  // 「すべて」タブ + 習得済みルートのタブ + お気に入りタブ HTML
  const allTab = `<button class="skill-tab-btn${route === 'all' ? ' active' : ''}" onclick="showSkillPanel('all')">すべて</button>`;
  const routeTabs = availableRoutes
    .map(r => {
      const isActive = r.id === route;
      return `<button class="skill-tab-btn${isActive ? ' active' : ''}" onclick="showSkillPanel('${r.id}')">${r.name}</button>`;
    })
    .join('');
  const favoriteTab = `<button class="skill-tab-btn skill-tab-favorite${route === 'favorite' ? ' active' : ''}" onclick="showSkillPanel('favorite')">★お気に入り</button>`;
  const tabsHtml = allTab + routeTabs + favoriteTab;

  // 表示するスキル一覧を決定
  let displaySkills;
  if (route === 'all') {
    displaySkills = availableRoutes.flatMap(r => routeMap[r.id].skills);
  } else if (route === 'favorite') {
    displaySkills = SKILL_DEFINITIONS.filter(
      s => player.favoriteSkills.includes(s.id) && player.learnedSkills.includes(s.id)
    );
  } else {
    displaySkills = routeMap[route].skills;
  }

  // お気に入りタブで登録なしの場合
  let listHtml;
  if (route === 'favorite' && displaySkills.length === 0) {
    listHtml = '<span class="skill-none">スキルツリーからお気に入り登録してください</span>';
  } else {
    // スキルボタン HTML
    listHtml = displaySkills
      .map(s => {
        const noMp = player.mp < s.mpCost;
        const noHp = (() => {
          // HP消費スキルの使用条件チェック
          switch (s.id) {
            case 'blood_price':        return player.hp <= 30;
            case 'self_harm_strike':   return player.hp / player.maxHp <= 0.20;
            case 'berserk_rampage':    return player.hp / player.maxHp <= 0.30;
            case 'annihilation_strike': return player.hp / player.maxHp <= 0.50;
            default: return false;
          }
        })();
        const disabled = noMp || noHp;
        return `<button class="skill-btn${disabled ? ' disabled' : ''}" ${disabled ? 'disabled' : ''} onclick="useSkill('${s.id}')">
          ${s.name}（MP:${s.mpCost}）<br><small>${s.description}</small>
        </button>`;
      })
      .join('');
  }

  panel.innerHTML = `<div class="skill-tabs">${tabsHtml}</div>`
    + `<div class="skill-list">${listHtml}</div>`
    + '<button class="skill-cancel-btn" onclick="cancelSkillPanel()">キャンセル</button>';
  panel.style.display = 'flex';
}

function hideSkillPanel() {
  const panel = document.getElementById('skill-panel');
  if (panel) panel.style.display = 'none';
}

function cancelSkillPanel() {
  hideSkillPanel();
  if (game.state === GameState.PLAYER_TURN) setButtonsEnabled(true);
}

/* ==============================================================
   ゲーム起動・初期化
   ============================================================== */

function initGame() {
  game.player            = null;
  game.enemy             = null;
  game.state             = null;
  game.battleCount       = 0;
  game.dungeon           = { id: null, enemyIndex: 0, materials: [], isGachaDungeon: false, gachaDifficulty: null, ticketsEarned: 0 };
  game.shieldActive      = [];
  game.enemyPoisoned     = null;
  game.playerAtkBuff     = null;
  game.playerCondense    = null;
  game.enemyStunned      = false;
  game.enemyAtkDebuff    = null;
  game.playerRegen       = [];
  game.playerDelayedHeal = null;
  game.playerSageBuff    = null;
  game.playerSageMegaBuff = null;
  game.playerMakenshiAwakeningBuff = null;
  game.divineJudgmentActive = null;
  game.turnDamageDealt   = 0;
  // 特級職バトル状態を初期化する（initGame）
  game.phantomAvoidChance       = 0;
  game.phantomAvoidSuccessCount = 0;
  game.pendingEffects           = [];
  game.runeGrantActive          = false;
  game.runeGrantAtkMult         = 1.0;
  game.runeGrantDmgMult         = 1.0;
  game.runeReleaseActive        = false;
  game.runeReleaseUsed          = false;
  game.runeStrikeAtkBuff        = null;
  game.enemyDefDebuff           = null;
  game.enemyAmpDmgActive        = null;
  game.crusaderApocCooldown     = 0;
  game.phantomBladeDoT          = null;
  game.phantomDeathStrikeActive = null;
  game.prophecyActive           = null;
  game.oracleProphecyFlowActive = false;
  game.oracleEnhanceBuff        = null;
  game.oracleBurstActive        = null;
  game.oracleSpiritActive       = null;
  game.divinePunishmentDoT      = null;
  game.divineJudgmentDebuff     = null;
  game.ctRuinousWoundBuff       = null;
  game.phantomAvoidBuff         = null;
  game.crusaderStunAtkBuff      = null;
  game.oracleManaNotified       = false;
  game.phantomEyeAutoAttackReady = false;
  game.runeKnightPassiveAtkMult = 1.0;

  // メンテナンスモードチェック
  if (MAINTENANCE.enabled) {
    // メンテナンス画面のメッセージを設定
    const msgEl = document.getElementById('maintenance-message');
    if (msgEl) {
      msgEl.textContent = MAINTENANCE.message;
    }
    showScreen('maintenance');
    return; // 以降のゲーム初期化を中断
  }

  showScreen('login');
}

initGame();
