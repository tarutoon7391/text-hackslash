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

    // 暗殺者パッシブ: 最初のノード取得済みの場合、最終HP最大値・防御力を半減する
    if (this.currentJob === 'assassin' && (this.skillTreeNodes['assassin'] || []).includes('as_01')) {
      this.maxHp   = Math.floor(this.maxHp   * 0.5);
      this.defense = Math.floor(this.defense * 0.5);
    }

    // 賢者パッシブ sg_12 (魔力増幅): 最大MPを1.3倍にする
    if (this.currentJob === 'sage' && (this.skillTreeNodes['sage'] || []).includes('sg_12')) {
      this.maxMp = Math.floor(this.maxMp * 1.3);
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
    if (atkMult !== 1.0) base = Math.floor(base * atkMult);
    // 魔力凝縮が有効（かつ発動ターン以降）であれば攻撃力を倍増する
    if (game.playerCondense && !game.playerCondense.justSet) {
      base = Math.floor(base * game.playerCondense.atkMultiplier);
    }
    // 狂戦士パッシブ: HP50%以下で2倍、HP25%以下で4倍（最終攻撃力に乗る）
    if (this.currentJob === 'berserker' && (this.skillTreeNodes['berserker'] || []).includes('bk_01')) {
      // maxHp が0以下の場合は倍率を適用しない（安全フォールバック）
      const hpRatio = this.maxHp > 0 ? this.hp / this.maxHp : 1;
      if (hpRatio <= 0.25) {
        base = base * 4;
      } else if (hpRatio <= 0.5) {
        base = base * 2;
      }
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

  /** HP を回復する（maxHp を超えない） */
  heal(amount) { this.hp = Math.min(this.maxHp, this.hp + amount); }
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
  shieldActive:      [],     // [{ source: string, defenseBonus: N, turnsLeft: N }] — シールド・聖域（複数バフ重複可）
  enemyPoisoned:     null,   // { active: bool, damage: N, turnsLeft: N }
  playerAtkBuff:     null,   // { bonus: N, turnsLeft: N } — 祝福スキル
  playerCondense:    null,   // { atkMultiplier: N, dmgMultiplier: N, justSet: bool } — 魔力凝縮
  enemyStunned:      false,  // 足払い・体当たりによるスタン
  enemyAtkDebuff:    null,   // { factor: 0.7, turnsLeft: N } — 威嚇・破壊の一撃
  playerRegen:       null,   // { hpPerTurn: N, turnsLeft: N } — リジェネスキル
  playerDelayedHeal: null,   // { healAmt: N, turnsLeft: N } — 神聖なうたい寝（遅延回復）
  playerSageBuff:    null,   // { atkMultiplier: N, defMultiplier: N, turnsLeft: N } — 強化魔法（倍率バフ）
  playerSageMegaBuff: null,  // { atkMultiplier: N, defMultiplier: N, turnsLeft: N } — 全体強化（倍率バフ）
  playerMakenshiAwakeningBuff: null, // { atkMultiplier: N, defMultiplier: N, turnsLeft: N } — 魔剣士の覚醒（倍率バフ）
  divineJudgmentActive: null, // { turnsLeft: N } — 神聖無双：反撃確率100%フラグ
  turnDamageDealt:   0,      // このターンにプレイヤーが与えた総ダメージ（賢者吸魔パッシブ用）
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

  // MP回復攻撃パッシブ（魔剣士 mk_06）が有効かチェック
  const hasMpRecovery = (player.skillTreeNodes['makenshi'] || []).includes('mk_06');

  // 暗殺者パッシブチェック
  const assassinNodes = player.skillTreeNodes['assassin'] || [];
  const hasDefPierce  = player.currentJob === 'assassin' && assassinNodes.includes('as_08');
  const hasCrit70     = player.currentJob === 'assassin' && assassinNodes.includes('as_11');
  const hasCrit50     = player.currentJob === 'assassin' && assassinNodes.includes('as_06');
  // 超会心（as_11）が有効なら70%、会心強化（as_06）なら50%
  const critChance    = hasCrit70 ? 0.70 : (hasCrit50 ? 0.50 : 0);
  const isCrit        = critChance > 0 && Math.random() < critChance;

  if (hasMpRecovery) {
    // 通常攻撃の0.6倍ダメージ・MP +30 回復（maxMp を超えない）
    const rawDmg = player.calcAttackDamage(enemy);
    const dmg    = Math.max(1, Math.floor(rawDmg * 0.6));
    enemy.takeDamage(dmg);
    game.turnDamageDealt += dmg;
    const mpBefore = player.mp;
    player.mp = Math.min(player.maxMp, player.mp + 30);
    const mpGained = player.mp - mpBefore;
    log(`⚔✨ ${player.name} の「MP回復攻撃」！ → ${enemy.name} に ${dmg} ダメージ！MP +${mpGained} 回復！`, 'player-action');
    renderPlayerStatus();
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

  renderEnemyStatus();
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
}

/** プレイヤーのリジェネ効果を処理する */
function tickPlayerRegen() {
  if (game.playerRegen && game.playerRegen.turnsLeft > 0) {
    const healAmt = game.playerRegen.hpPerTurn;
    game.player.heal(healAmt);
    game.playerRegen.turnsLeft--;
    log(`💚 リジェネで HP +${healAmt} 回復！（残${game.playerRegen.turnsLeft}ターン）`, 'player-action');
    renderPlayerStatus();
    if (game.playerRegen.turnsLeft <= 0) {
      game.playerRegen = null;
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

/** 敵のターン処理 */
function doEnemyTurn() {
  if (game.state !== GameState.ENEMY_TURN) return;

  // スタン判定（足払い・体当たりの効果）
  if (game.enemyStunned) {
    game.enemyStunned = false;
    log(`⚡ ${game.enemy.name} はスタンして行動できない！`, 'system');
    tickPlayerBuffs();
    tickPlayerRegen();
    tickPlayerDelayedHeal();
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

  // 魔力凝縮中は被ダメージ増加（凝縮エネルギーを溜めているため隙が大きい）
  if (game.playerCondense && !game.playerCondense.justSet) {
    rawDmg = Math.floor(rawDmg * game.playerCondense.dmgMultiplier);
  }

  // シールド効果を適用（配列管理：全バフの defenseBonus を合算して適用）
  if (game.shieldActive.length > 0) {
    const totalBonus = game.shieldActive.reduce((sum, b) => sum + b.defenseBonus, 0);
    rawDmg = Math.max(1, rawDmg - totalBonus);
    const expired = [];
    game.shieldActive.forEach(b => {
      b.turnsLeft--;
      if (b.turnsLeft <= 0) expired.push(b.source);
    });
    game.shieldActive = game.shieldActive.filter(b => b.turnsLeft > 0);
    if (expired.length > 0) {
      log('🛡 防御バフの効果が切れた。', 'system');
    }
  }

  const actualDmg = game.player.takeDamage(rawDmg);
  log(`◀ ${game.enemy.name} の攻撃！ → ${game.player.name} に ${actualDmg} ダメージ！`, 'enemy-action');
  renderPlayerStatus();

  // 聖騎士パッシブ: 被攻撃時にカウンター攻撃（神聖無双発動中は100%、通常時は30%）
  if (game.player.currentJob === 'paladin' &&
      (game.player.skillTreeNodes['paladin'] || []).includes('pl_15') &&
      game.player.isAlive()) {
    const counterChance = (game.divineJudgmentActive && game.divineJudgmentActive.turnsLeft > 0) ? 1.0 : 0.30;
    if (Math.random() < counterChance) {
      const counterDmg = Math.max(1, Math.floor(game.player.attack * 0.8));
      game.enemy.takeDamage(counterDmg);
      log(`🛡 「反撃の構え」発動！カウンター攻撃で ${game.enemy.name} に ${counterDmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
    }
  }

  if (!game.player.isAlive()) {
    endBattle('lose');
    return;
  }

  // プレイヤー ATK バフのターン管理
  tickPlayerBuffs();
  tickPlayerRegen();
  tickPlayerDelayedHeal();

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
        return `<button class="skill-btn${noMp ? ' disabled' : ''}" ${noMp ? 'disabled' : ''} onclick="useSkill('${s.id}')">
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
  game.playerRegen       = null;
  game.playerDelayedHeal = null;
  game.playerSageBuff    = null;
  game.playerSageMegaBuff = null;
  game.playerMakenshiAwakeningBuff = null;
  game.divineJudgmentActive = null;
  game.turnDamageDealt   = 0;

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
