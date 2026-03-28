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
    this.learnedSkills  = s.learnedSkills  ? [...s.learnedSkills]  : [];
    this.materials      = s.materials      ? { ...s.materials }    : {};
    this.equipment      = s.equipment      ? { ...s.equipment }    : {};
    this.ownedEquipment = s.ownedEquipment ? [...s.ownedEquipment] : [];
    this.dungeonProgress = s.dungeonProgress ? { ...s.dungeonProgress } : {};

    /** 図鑑: モンスター遭遇フラグ・討伐フラグ・討伐回数 */
    this.encounterFlags  = s.encounterFlags  ? { ...s.encounterFlags }  : {};
    this.defeatFlags     = s.defeatFlags     ? { ...s.defeatFlags }     : {};
    this.defeatCounts    = s.defeatCounts    ? { ...s.defeatCounts }    : {};

    /** 図鑑: アイテム解鎖フラグ */
    this.itemUnlockFlags = s.itemUnlockFlags ? { ...s.itemUnlockFlags } : {};

    /** スキルポイントで強化した累計量 */
    this.spAtk = s.spAtk ?? 0;
    this.spDef = s.spDef ?? 0;
    this.spHp  = s.spHp  ?? 0;
    this.spMp  = s.spMp  ?? 0;

    /** 有効ステータスを初期化 */
    this.attack  = this.attackBase;
    this.defense = this.defenseBase;
    this.recalcStats();
  }

  /**
   * 有効ステータス（attack / defense / maxHp / maxMp）を再計算する
   * ベース値 + スキルポイント補正 + 装備補正
   */
  recalcStats() {
    this.attack  = this.attackBase  + this.spAtk;
    this.defense = this.defenseBase + this.spDef;
    this.maxHp   = this.maxHpBase   + this.spHp;
    this.maxMp   = this.maxMpBase   + this.spMp;

    Object.values(this.equipment).forEach(eqId => {
      if (!eqId) return;
      const eq = EQUIPMENT_DEFINITIONS.find(e => e.id === eqId);
      if (!eq) return;
      this.attack  += eq.stats.attack  || 0;
      this.defense += eq.stats.defense || 0;
      this.maxHp   += eq.stats.maxHp   || 0;
      this.maxMp   += eq.stats.maxMp   || 0;
    });

    this.hp = Math.min(this.hp, this.maxHp);
    this.mp = Math.min(this.mp, this.maxMp);
  }

  /** 通常攻撃ダメージを計算して返す（会心効果を含む） */
  calcAttackDamage(target) {
    const raw = this.attack - Math.floor(target.defense * DEFENSE_FACTOR);
    const dmg = Math.max(1, raw + randInt(-2, 2));
    return applyEquipmentEffects(dmg, 'deal');
  }

  /** 生存確認 */
  isAlive() { return this.hp > 0; }

  /** ダメージを受ける（被ダメージ軽減装備を含む）。実際に受けたダメージを返す */
  takeDamage(amount) {
    const reduced = applyEquipmentEffects(amount, 'take');
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
    const raw = this.attack - Math.floor(target.defense * DEFENSE_FACTOR);
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
    id:         null,
    enemyIndex: 0,
    materials:  [],
  },
  shieldActive:  null,
  enemyPoisoned: null,
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

  const dmg = game.player.calcAttackDamage(game.enemy);
  game.enemy.takeDamage(dmg);
  log(`▶ ${game.player.name} の攻撃！ → ${game.enemy.name} に ${dmg} ダメージ！`, 'player-action');
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

/** プレイヤーのターン終了後の処理 */
function afterPlayerTurn() {
  renderPlayerStatus();

  if (!game.enemy.isAlive()) {
    endBattle('win');
    return;
  }

  game.state = GameState.ENEMY_TURN;
  setTimeout(doEnemyTurn, ENEMY_TURN_DELAY_MS);
}

/** 敵のターン処理 */
function doEnemyTurn() {
  if (game.state !== GameState.ENEMY_TURN) return;

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

  // シールド効果を適用
  if (game.shieldActive && game.shieldActive.turnsLeft > 0) {
    rawDmg = Math.max(1, rawDmg - game.shieldActive.defenseBonus);
    game.shieldActive.turnsLeft--;
    if (game.shieldActive.turnsLeft <= 0) {
      game.shieldActive = null;
      log('🛡 シールドの効果が切れた。', 'system');
    }
  }

  const actualDmg = game.player.takeDamage(rawDmg);
  log(`◀ ${game.enemy.name} の攻撃！ → ${game.player.name} に ${actualDmg} ダメージ！`, 'enemy-action');
  renderPlayerStatus();

  if (!game.player.isAlive()) {
    endBattle('lose');
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
    log(`🏆 ${game.enemy.name} を倒した！ EXP +${exp}`, 'result');

    // 図鑑: 討伐を記録する
    recordMonsterDefeat(game.enemy.name);

    // ドロップ処理
    processDrop();

    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'special');

    // EXP 加算とレベルアップチェック
    gainExp(exp);

    const isBoss = game.dungeon.enemyIndex === DUNGEON_ENEMY_COUNT - 1;
    game.dungeon.enemyIndex++;

    showDungeonNav(true, isBoss);

  } else if (result === 'lose') {
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'enemy-action');
    log(`☠ ${game.player.name} は力尽きた…`, 'enemy-action');
    log('💀 ダンジョン内で獲得した素材をすべて失った。', 'special');
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'enemy-action');

    setTimeout(failDungeon, 1500);
  }
}

/* ==============================================================
   スキルパネル
   ============================================================== */

/** スキル選択パネルを表示する */
function showSkillPanel() {
  const panel  = document.getElementById('skill-panel');
  const player = game.player;

  const btns = SKILL_DEFINITIONS
    .filter(s => player.learnedSkills.includes(s.id))
    .map(s => {
      const noMp = player.mp < s.mpCost;
      return `<button class="skill-btn${noMp ? ' disabled' : ''}" ${noMp ? 'disabled' : ''} onclick="useSkill('${s.id}')">
        ${s.name}（MP:${s.mpCost}）<br><small>${s.description}</small>
      </button>`;
    })
    .join('');

  if (!btns) {
    panel.innerHTML = '<span class="skill-none">習得済みスキルなし</span><button class="skill-cancel-btn" onclick="cancelSkillPanel()">キャンセル</button>';
  } else {
    panel.innerHTML = btns + '<button class="skill-cancel-btn" onclick="cancelSkillPanel()">キャンセル</button>';
  }
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
   スキルポイント画面
   ============================================================== */

function renderSkillPoints() {
  const p = game.player;
  document.getElementById('sp-remaining').textContent = `残りポイント: ${p.skillPoints} pt`;
  document.getElementById('sp-atk').textContent = `攻撃力:   ${p.attack}  (ベース ${p.attackBase}  + SP ${p.spAtk}  + 装備)`;
  document.getElementById('sp-def').textContent = `防御力:   ${p.defense}  (ベース ${p.defenseBase}  + SP ${p.spDef}  + 装備)`;
  document.getElementById('sp-hp').textContent  = `最大 HP:  ${p.maxHp}  (ベース ${p.maxHpBase}  + SP ${p.spHp}  + 装備)`;
  document.getElementById('sp-mp').textContent  = `最大 MP:  ${p.maxMp}  (ベース ${p.maxMpBase}  + SP ${p.spMp}  + 装備)`;

  const hasSp = p.skillPoints > 0;
  ['sp-btn-atk','sp-btn-def','sp-btn-hp','sp-btn-mp'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !hasSp;
  });
}

function spendSkillPoint(stat) {
  const p = game.player;
  if (p.skillPoints <= 0) return;
  p.skillPoints--;

  if (stat === 'atk') { p.attackBase  += 3; p.spAtk += 3; }
  if (stat === 'def') { p.defenseBase += 2; p.spDef += 2; }
  if (stat === 'hp')  { p.maxHpBase   += 10; p.spHp += 10; }
  if (stat === 'mp')  { p.maxMpBase   += 8;  p.spMp += 8;  }

  p.recalcStats();
  renderSkillPoints();
  renderLobbyStatus();
}

/* ==============================================================
   ゲーム起動・初期化
   ============================================================== */

function initGame() {
  const s = INITIAL_PLAYER_STATS;
  game.player = new Player({
    ...s,
    maxHpBase:   s.maxHp,
    maxMpBase:   s.maxMp,
    spAtk: 0, spDef: 0, spHp: 0, spMp: 0,
  });

  game.enemy        = null;
  game.state        = null;
  game.battleCount  = 0;
  game.dungeon      = { id: null, enemyIndex: 0, materials: [] };
  game.shieldActive  = null;
  game.enemyPoisoned = null;

  showScreen('lobby');
  renderLobby();
}

initGame();
