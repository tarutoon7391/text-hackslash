'use strict';

/* ==============================================================
   セーブ・ロード機能
   ロリポップ上の PHP API を使ったパスワードベースのセーブ・ロード
   ============================================================== */

/** API のエンドポイント URL */
const API_URL = 'https://lomo-s2409009.ssl-lolipop.jp/public_html/api.php';

/**
 * セーブ・ロード結果メッセージを表示する
 * @param {string} text      - 表示テキスト
 * @param {string} type      - 'success' | 'error' | 'loading'
 */
function showSaveLoadMsg(text, type) {
  const el = document.getElementById('saveload-msg');
  el.textContent = text;
  // 既存クラスをクリアして新しいクラスをセット
  el.className = type;
}

/**
 * セーブ・ロードボタンの有効 / 無効を切り替える
 * @param {boolean} enabled - true で有効、false で無効（通信中）
 */
function setSaveLoadButtonsEnabled(enabled) {
  document.getElementById('btn-save').disabled = !enabled;
  document.getElementById('btn-load').disabled = !enabled;
}

/**
 * 現在のゲームデータをセーブする
 * パスワードを入力して API に送信する
 */
async function saveGame() {
  const password = document.getElementById('password-input').value.trim();

  // パスワード未入力チェック
  if (!password) {
    showSaveLoadMsg('⚠ パスワードを入力してください。', 'error');
    return;
  }

  // プレイヤーが初期化されていない場合は保存不可
  if (!game.player) {
    showSaveLoadMsg('⚠ ゲームが開始されていません。', 'error');
    return;
  }

  // セーブするデータを構築する
  const saveData = {
    name:    game.player.name,
    level:   game.player.level,
    hp:      game.player.hp,
    maxHp:   game.player.maxHp,
    attack:  game.player.attack,
    defense: game.player.defense,
    exp:     game.player.exp,
    items:   [],  // 将来のアイテム拡張用
  };

  // 通信中はボタンを無効化してローディング表示
  setSaveLoadButtonsEnabled(false);
  showSaveLoadMsg('⏳ セーブ中…', 'loading');

  try {
    const response = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        action:   'save',
        password: password,
        save:     saveData,
      }),
    });

    const result = await response.json();

    if (result.status === 'ok' || result.success || response.ok) {
      // セーブ成功
      showSaveLoadMsg('✅ セーブしました！', 'success');
      log('💾 ゲームデータをセーブしました。', 'result');
    } else {
      // API からエラーが返ってきた場合
      const errMsg = result.message || result.error || '不明なエラー';
      showSaveLoadMsg(`❌ セーブ失敗: ${errMsg}`, 'error');
      log(`❌ セーブに失敗しました: ${errMsg}`, 'enemy-action');
    }
  } catch (err) {
    // ネットワークエラーなど
    showSaveLoadMsg(`❌ 通信エラー: ${err.message}`, 'error');
    log(`❌ セーブ通信エラー: ${err.message}`, 'enemy-action');
  } finally {
    // 通信完了後にボタンを再有効化
    setSaveLoadButtonsEnabled(true);
  }
}

/**
 * ゲームデータをロードする
 * パスワードを使って API からデータを取得し、ゲームに反映する
 */
async function loadGame() {
  const password = document.getElementById('password-input').value.trim();

  // パスワード未入力チェック
  if (!password) {
    showSaveLoadMsg('⚠ パスワードを入力してください。', 'error');
    return;
  }

  // 通信中はボタンを無効化してローディング表示
  setSaveLoadButtonsEnabled(false);
  showSaveLoadMsg('⏳ ロード中…', 'loading');

  try {
    const response = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        action:   'load',
        password: password,
      }),
    });

    const result = await response.json();

    // API レスポンスのエラー判定
    if (!response.ok || result.error || (!result.save && !result.data)) {
      const errMsg = result.message || result.error || 'データが見つかりませんでした';
      showSaveLoadMsg(`❌ ロード失敗: ${errMsg}`, 'error');
      log(`❌ ロードに失敗しました: ${errMsg}`, 'enemy-action');
      return;
    }

    // API から返るセーブデータを取り出す（フィールド名の違いに対応）
    const saved = result.save || result.data;

    // ロードしたデータでプレイヤーを復元する（プレイヤーが未初期化の場合はデフォルト値を使う）
    if (!game.player) {
      const defaultStats = INITIAL_PLAYER_STATS;
      game.player = new Player(
        defaultStats.name, defaultStats.hp, defaultStats.maxHp,
        defaultStats.attack, defaultStats.defense, defaultStats.level
      );
    }
    game.player.name    = saved.name    ?? game.player.name;
    game.player.level   = saved.level   ?? game.player.level;
    game.player.hp      = saved.hp      ?? game.player.hp;
    game.player.maxHp   = saved.maxHp   ?? game.player.maxHp;
    game.player.attack  = saved.attack  ?? game.player.attack;
    game.player.defense = saved.defense ?? game.player.defense;
    game.player.exp     = saved.exp     ?? game.player.exp;

    // プレイヤーステータスを画面に反映する
    renderPlayerStatus();

    showSaveLoadMsg('✅ ロードしました！', 'success');
    log('📂 ゲームデータをロードしました。', 'result');
    log(`  名前: ${game.player.name}  LV: ${game.player.level}  EXP: ${game.player.exp}`, 'result');
  } catch (err) {
    // ネットワークエラーなど
    showSaveLoadMsg(`❌ 通信エラー: ${err.message}`, 'error');
    log(`❌ ロード通信エラー: ${err.message}`, 'enemy-action');
  } finally {
    // 通信完了後にボタンを再有効化
    setSaveLoadButtonsEnabled(true);
  }
}
