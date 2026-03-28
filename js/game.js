'use strict';

/* ==============================================================
   ゲームバランス定数
   数値を変えるだけでバランス調整が簡単にできる
   ============================================================== */

/** 防御力の軽減係数（通常攻撃） */
const DEFENSE_FACTOR       = 0.5;
/** スキル攻撃倍率 */
const SKILL_MULTIPLIER     = 1.8;
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
  name:    '勇者',
  hp:      100,
  maxHp:   100,
  attack:  18,
  defense: 8,
  level:   1,
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
  /**
   * @param {string} name    - キャラクター名
   * @param {number} hp      - 現在 HP
   * @param {number} maxHp   - 最大 HP
   * @param {number} attack  - 攻撃力
   * @param {number} defense - 防御力
   * @param {number} level   - レベル
   */
  constructor(name, hp, maxHp, attack, defense, level) {
    this.name    = name;
    this.hp      = hp;
    this.maxHp   = maxHp;
    this.attack  = attack;
    this.defense = defense;
    this.level   = level;
    this.exp     = 0;      // 経験値（将来の育成機能用）
  }

  /** 通常攻撃ダメージを計算して返す */
  calcAttackDamage(target) {
    // 攻撃力からターゲットの防御力を引き、最低 1 ダメージを保証する
    const raw = this.attack - Math.floor(target.defense * DEFENSE_FACTOR);
    return Math.max(1, raw + randInt(-2, 2));
  }

  /**
   * スキル攻撃ダメージを計算して返す
   * 通常攻撃の SKILL_MULTIPLIER 倍の威力（将来的にMPコストなど追加予定）
   */
  calcSkillDamage(target) {
    const raw = Math.floor(this.attack * SKILL_MULTIPLIER) - Math.floor(target.defense * SKILL_DEFENSE_FACTOR);
    return Math.max(1, raw + randInt(-1, 3));
  }

  /** 生存確認 */
  isAlive() {
    return this.hp > 0;
  }

  /** ダメージを受ける */
  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  /** HP を回復する（maxHp を超えない） */
  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
  }
}

/* ==============================================================
   敵クラス
   ============================================================== */
class Enemy {
  /**
   * @param {string} name       - 敵の名前
   * @param {number} hp         - 現在 HP
   * @param {number} maxHp      - 最大 HP
   * @param {number} attack     - 攻撃力
   * @param {number} defense    - 防御力
   * @param {number} expReward  - 撃破時の獲得経験値
   */
  constructor(name, hp, maxHp, attack, defense, expReward) {
    this.name      = name;
    this.hp        = hp;
    this.maxHp     = maxHp;
    this.attack    = attack;
    this.defense   = defense;
    this.expReward = expReward;
  }

  /** 通常攻撃ダメージを計算して返す */
  calcAttackDamage(target) {
    const raw = this.attack - Math.floor(target.defense * DEFENSE_FACTOR);
    return Math.max(1, raw + randInt(-2, 2));
  }

  /** 生存確認 */
  isAlive() {
    return this.hp > 0;
  }

  /** ダメージを受ける */
  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }
}

/* ==============================================================
   敵データテーブル
   敵を追加するにはこの配列にオブジェクトを追加するだけでよい
   ============================================================== */
const ENEMY_TABLE = [
  { name: 'スライム',       hp: 20,  maxHp: 20,  attack: 6,  defense: 2,  expReward: 10 },
  { name: 'ゴブリン',       hp: 30,  maxHp: 30,  attack: 9,  defense: 4,  expReward: 18 },
  { name: 'コウモリ',       hp: 18,  maxHp: 18,  attack: 8,  defense: 1,  expReward: 12 },
  { name: 'スケルトン',     hp: 35,  maxHp: 35,  attack: 11, defense: 6,  expReward: 25 },
  { name: 'オーク',         hp: 50,  maxHp: 50,  attack: 14, defense: 8,  expReward: 35 },
  { name: 'ダークウィザード', hp: 28, maxHp: 28,  attack: 18, defense: 3,  expReward: 40 },
  { name: 'ドラゴン',       hp: 80,  maxHp: 80,  attack: 22, defense: 12, expReward: 80 },
];

/* ==============================================================
   ゲーム状態管理
   ============================================================== */
const GameState = {
  PLAYER_TURN: 'player_turn', // プレイヤーのターン
  ENEMY_TURN:  'enemy_turn',  // 敵のターン
  BATTLE_END:  'battle_end',  // 戦闘終了
};

/** ゲーム全体の状態を保持するオブジェクト */
let game = {
  player:       null,  // Player インスタンス
  enemy:        null,  // Enemy インスタンス
  state:        null,  // GameState の値
  battleCount:  0,     // 連戦カウンター
};

/* ==============================================================
   戦闘ロジック
   ============================================================== */

/** 新しい敵をランダムに生成して返す（テーブルからコピー） */
function spawnEnemy() {
  const template = pick(ENEMY_TABLE);
  // テーブルの値を使って新しい Enemy インスタンスを作成
  return new Enemy(
    template.name,
    template.hp,
    template.maxHp,
    template.attack,
    template.defense,
    template.expReward
  );
}

/**
 * プレイヤーのアクションを処理する
 * @param {string} action - 'attack' | 'skill' | 'flee'
 */
function playerAction(action) {
  // プレイヤーのターン以外は受け付けない
  if (game.state !== GameState.PLAYER_TURN) return;

  // アクション中はボタンを無効化
  setButtonsEnabled(false);

  switch (action) {
    case 'attack':
      doPlayerAttack();
      break;
    case 'skill':
      doPlayerSkill();
      break;
    case 'flee':
      doPlayerFlee();
      break;
    default:
      break;
  }
}

/** 通常攻撃処理 */
function doPlayerAttack() {
  const dmg = game.player.calcAttackDamage(game.enemy);
  game.enemy.takeDamage(dmg);
  log(`▶ ${game.player.name} の攻撃！ → ${game.enemy.name} に ${dmg} ダメージ！`, 'player-action');
  renderEnemyStatus();
  afterPlayerTurn();
}

/** スキル攻撃処理 */
function doPlayerSkill() {
  const dmg = game.player.calcSkillDamage(game.enemy);
  game.enemy.takeDamage(dmg);
  log(`✨ ${game.player.name} のスキル【烈火斬】！ → ${game.enemy.name} に ${dmg} ダメージ！`, 'special');
  renderEnemyStatus();
  afterPlayerTurn();
}

/** 逃げる処理（FLEE_SUCCESS_RATE の確率で成功） */
function doPlayerFlee() {
  const success = Math.random() < FLEE_SUCCESS_RATE;
  if (success) {
    log(`🚪 ${game.player.name} は逃げ出した！`, 'result');
    endBattle('fled');
  } else {
    log(`${game.player.name} は逃げようとしたが、失敗した！`, 'system');
    afterPlayerTurn();
  }
}

/** プレイヤーのターン終了後の処理 */
function afterPlayerTurn() {
  // 敵の HP チェック
  if (!game.enemy.isAlive()) {
    endBattle('win');
    return;
  }
  // 敵のターンへ移行（少し遅延して自然な演出を出す）
  game.state = GameState.ENEMY_TURN;
  setTimeout(doEnemyTurn, ENEMY_TURN_DELAY_MS);
}

/** 敵のターン処理（現在はランダム攻撃のみ） */
function doEnemyTurn() {
  if (game.state !== GameState.ENEMY_TURN) return;

  const dmg = game.enemy.calcAttackDamage(game.player);
  game.player.takeDamage(dmg);
  log(`◀ ${game.enemy.name} の攻撃！ → ${game.player.name} に ${dmg} ダメージ！`, 'enemy-action');
  renderPlayerStatus();

  // プレイヤーの HP チェック
  if (!game.player.isAlive()) {
    endBattle('lose');
    return;
  }

  // プレイヤーのターンへ戻す
  game.state = GameState.PLAYER_TURN;
  log('─'.repeat(LOG_SEPARATOR_LENGTH), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');
  setButtonsEnabled(true);
}

/**
 * 戦闘終了処理
 * @param {string} result - 'win' | 'lose' | 'fled'
 */
function endBattle(result) {
  game.state = GameState.BATTLE_END;
  setButtonsEnabled(false);

  if (result === 'win') {
    const exp = game.enemy.expReward;
    game.player.exp += exp;
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'special');
    log(`🏆 ${game.enemy.name} を倒した！ EXP +${exp}`, 'result');
    log(`累計 EXP: ${game.player.exp}`, 'result');
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'special');
    renderPlayerStatus();
    showNextBtn(true, '▶ 次の戦闘へ');
  } else if (result === 'lose') {
    // デスペナルティ調整: レベルとEXPは維持し、HPのみ最大値に回復して復活
    game.player.hp = game.player.maxHp;
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'enemy-action');
    log(`☠ ${game.player.name} は力尽きた…`, 'enemy-action');
    log('💀 しかし経験は失われなかった。立ち上がれ、勇者よ。', 'special');
    log('═'.repeat(LOG_SEPARATOR_LENGTH), 'enemy-action');
    renderPlayerStatus();
    showNextBtn(true, '🔄 立ち上がる（HPが回復した）');
  } else if (result === 'fled') {
    showNextBtn(true, '▶ 次の戦闘へ');
  }
}

/* ==============================================================
   戦闘開始 / 次の戦闘 / リセット
   ============================================================== */

/** 新しい戦闘を開始する */
function startBattle() {
  game.battleCount++;
  game.enemy = spawnEnemy();
  game.state = GameState.PLAYER_TURN;

  clearLog();
  log(`=== 戦闘 ${game.battleCount} 開始 ===`, 'special');
  log(`${game.enemy.name} が現れた！`, 'system');
  log('─'.repeat(LOG_SEPARATOR_LENGTH), 'system');
  log('あなたのターンです。アクションを選んでください。', 'system');

  renderPlayerStatus();
  renderEnemyStatus();
  setButtonsEnabled(true);
  showNextBtn(false);
}

/** 「次の戦闘へ」または「立ち上がる」ボタン押下時の処理 */
function nextBattle() {
  startBattle();
}

/** ゲームを初期状態に戻す */
function initGame() {
  // プレイヤーを初期ステータスで作成（INITIAL_PLAYER_STATS で一元管理）
  const s      = INITIAL_PLAYER_STATS;
  game.player  = new Player(s.name, s.hp, s.maxHp, s.attack, s.defense, s.level);
  game.enemy       = null;
  game.state       = null;
  game.battleCount = 0;

  clearLog();
  log('★ テキスト ハクスラ RPG へようこそ！', 'special');
  log('「次の戦闘へ」ボタンを押して最初の戦闘を始めましょう。', 'system');

  renderPlayerStatus();

  // 敵ステータスは空白にする
  document.getElementById('enemy-name').textContent   = '???';
  document.getElementById('enemy-hp-label').textContent = 'HP: — / —';
  document.getElementById('enemy-hp-bar').style.width  = '0%';
  document.getElementById('enemy-detail').textContent  = '— / — / —';

  setButtonsEnabled(false);
  showNextBtn(true, '▶ 最初の戦闘を開始');
}

/* ==============================================================
   ゲーム起動
   ============================================================== */
initGame();
