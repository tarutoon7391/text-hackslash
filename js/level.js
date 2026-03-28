'use strict';

/* ==============================================================
   レベルアップ・スキルシステム
   ============================================================== */

/** レベル上限 */
const MAX_LEVEL = 20;

/**
 * 各レベルに達するために必要な累計 EXP テーブル（インデックス = レベル - 1）
 * 差分: 50, 100, 150, 200, 250, 300, 350, 400, 450, 550, 650, 750, 850, 950, 1100, 1250, 1400, 1550, 1700
 */
const EXP_TABLE = [
  0,      // Lv 1
  50,     // Lv 2
  150,    // Lv 3
  300,    // Lv 4
  500,    // Lv 5
  750,    // Lv 6
  1050,   // Lv 7
  1400,   // Lv 8
  1800,   // Lv 9
  2250,   // Lv 10
  2800,   // Lv 11
  3450,   // Lv 12
  4200,   // Lv 13
  5050,   // Lv 14
  6000,   // Lv 15
  7100,   // Lv 16
  8350,   // Lv 17
  9750,   // Lv 18
  11300,  // Lv 19
  13000,  // Lv 20（上限）
];

/**
 * スキル定義テーブル
 * learnLevel: 習得レベル  mpCost: 消費 MP
 */
const SKILL_DEFINITIONS = [
  {
    id: 'heal',
    name: 'ヒール',
    learnLevel: 2,
    mpCost: 8,
    description: '自分の HP を回復する',
  },
  {
    id: 'fireball',
    name: 'ファイアボール',
    learnLevel: 4,
    mpCost: 12,
    description: '敵に大ダメージを与える',
  },
  {
    id: 'shield',
    name: 'シールド',
    learnLevel: 6,
    mpCost: 10,
    description: '1ターン防御力+20',
  },
  {
    id: 'poison',
    name: 'ポイズン',
    learnLevel: 8,
    mpCost: 10,
    description: '敵に毒を付与（3ターン継続）',
  },
  {
    id: 'swift_strike',
    name: '神速',
    learnLevel: 10,
    mpCost: 15,
    description: '2回連続攻撃する',
  },
];

/**
 * EXP を加算してレベルアップを処理する
 * @param {number} expGained - 獲得 EXP 量
 */
function gainExp(expGained) {
  const player = game.player;
  if (player.level >= MAX_LEVEL) {
    log(`EXP +${expGained}（レベル上限）`, 'result');
    return;
  }

  player.exp += expGained;

  // 連続レベルアップを処理する
  while (player.level < MAX_LEVEL && player.exp >= EXP_TABLE[player.level]) {
    player.level++;

    // レベルアップによる自然成長
    player.attackBase  += 1;
    player.defenseBase += 1;
    player.maxHpBase   += 5;
    player.maxMpBase   += 3;

    // スキルポイント付与（3の倍数レベルは 2pt、それ以外は 1pt）
    const pointsGained = (player.level % 3 === 0) ? 2 : 1;
    player.skillPoints += pointsGained;

    log(`⬆ レベルが ${player.level} に上がった！スキルポイントを ${pointsGained}pt 獲得！`, 'special');

    // スキル習得チェック
    SKILL_DEFINITIONS.forEach(skill => {
      if (skill.learnLevel === player.level && !player.learnedSkills.includes(skill.id)) {
        player.learnedSkills.push(skill.id);
        log(`✨ 新しいスキル「${skill.name}」を覚えた！`, 'special');
      }
    });

    // ステータス再計算（装備含む）
    player.recalcStats();
    // HP / MP を最大値まで回復（レベルアップボーナス）
    player.hp = player.maxHp;
    player.mp = player.maxMp;
  }

  renderPlayerStatus();
}

/**
 * スキルを使用する（戦闘中に呼ばれる）
 * @param {string} skillId - 使用するスキル ID
 */
function useSkill(skillId) {
  if (game.state !== GameState.PLAYER_TURN) return;

  const skill = SKILL_DEFINITIONS.find(s => s.id === skillId);
  if (!skill) return;

  const player = game.player;
  const enemy  = game.enemy;

  if (player.mp < skill.mpCost) {
    log('⚠ MP が足りない！', 'system');
    return;
  }

  // アクション中はボタンを無効化
  setButtonsEnabled(false);
  hideSkillPanel();

  player.mp -= skill.mpCost;

  switch (skillId) {
    case 'heal': {
      // 回復量: 基本 30 + レベル×2
      const healAmt = 30 + player.level * 2;
      player.heal(healAmt);
      log(`💚 ${player.name} は「ヒール」を使った！ HP+${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'fireball': {
      const raw = Math.floor(player.attack * 2.5) - Math.floor(enemy.defense * 0.3);
      const dmg = Math.max(1, raw + randInt(-2, 4));
      enemy.takeDamage(dmg);
      log(`🔥 ${player.name} は「ファイアボール」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'shield': {
      // シールド状態を 1 ターンセット
      game.shieldActive = { defenseBonus: 20, turnsLeft: 1 };
      log(`🛡 ${player.name} は「シールド」を張った！ 1ターン防御力+20`, 'player-action');
      break;
    }

    case 'poison': {
      game.enemyPoisoned = { active: true, damage: 8, turnsLeft: 3 };
      if (enemy.poisoned) {
        log(`☠ ${player.name} は「ポイズン」を使った！ → ${enemy.name} の毒を上書きした！`, 'player-action');
      } else {
        log(`☠ ${player.name} は「ポイズン」を使った！ → ${enemy.name} に毒を付与！`, 'player-action');
      }
      enemy.poisoned = true;
      break;
    }

    case 'swift_strike': {
      const dmg1 = player.calcAttackDamage(enemy);
      enemy.takeDamage(dmg1);
      let dmg2 = 0;
      if (enemy.isAlive()) {
        dmg2 = player.calcAttackDamage(enemy);
        enemy.takeDamage(dmg2);
      }
      log(`⚡ ${player.name} は「神速」で2回攻撃！ → ${enemy.name} に ${dmg1} + ${dmg2} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    default:
      break;
  }

  // スキルが回復のみの場合はターン消費なし（HPを回復してもターンは進む）
  afterPlayerTurn();
}

/**
 * 次のレベルまでの残り EXP を返す
 * @returns {number}
 */
function expToNextLevel() {
  const player = game.player;
  if (player.level >= MAX_LEVEL) return 0;
  return EXP_TABLE[player.level] - player.exp;
}
