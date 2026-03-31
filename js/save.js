'use strict';

/* ==============================================================
   認証・セーブ機能（ログイン方式）
   ============================================================== */

const API_URL = 'https://lomo-s2409009.ssl-lolipop.jp/public_html/api.php';

/** 認証情報（セッション中のみメモリに保持、localStorageには保存しない）
 *  API仕様上、全てのセーブリクエストにユーザー名とパスワードが必要なため保持する */
let auth = { username: null, password: null };

/** 自動セーブのタイマーID */
let autoSaveIntervalId = null;

/** 自動セーブの間隔（ミリ秒） */
const AUTO_SAVE_INTERVAL_MS = 30 * 1000;

// ── ログイン画面の UI ──────────────────────────────────────────────

/** ログイン画面のメッセージを更新する */
function showLoginMsg(text, type) {
  const el = document.getElementById('login-msg');
  if (!el) return;
  el.textContent = text;
  el.className   = type;
}

/** ログイン・新規登録ボタンの有効/無効を切り替える */
function setLoginButtonsEnabled(enabled) {
  ['btn-login', 'btn-register'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.disabled = !enabled;
  });
}

// ── セーブデータ構築 / 復元 ───────────────────────────────────────

/** プレイヤーのセーブデータを組み立てる */
function buildSaveData() {
  const p = game.player;
  return {
    name:            p.name,
    level:           p.level,
    exp:             p.exp,
    hp:              p.hp,
    maxHp:           p.maxHp,
    mp:              p.mp,
    maxMp:           p.maxMp,
    attackBase:      p.attackBase,
    defenseBase:     p.defenseBase,
    maxHpBase:       p.maxHpBase,
    maxMpBase:       p.maxMpBase,
    skillPoints:     p.skillPoints,
    learnedSkills:   p.learnedSkills,
    favoriteSkills:  p.favoriteSkills,
    skillTreeNodes:  p.skillTreeNodes,
    materials:       p.materials,
    equipment:       p.equipment,
    ownedEquipment:  p.ownedEquipment,
    enhanceLevels:   p.enhanceLevels,
    dungeonProgress: p.dungeonProgress,
    encounterFlags:  p.encounterFlags,
    defeatFlags:     p.defeatFlags,
    defeatCounts:    p.defeatCounts,
    itemUnlockFlags: p.itemUnlockFlags,
    gachaTickets:    p.gachaTickets,
    permanentItems:  p.permanentItems,
  };
}

/**
 * ロードしたセーブデータをゲームに反映する。
 * 古いセーブデータとの互換性を保つためにデフォルト値で補完する。
 */
function applyLoadedSave(saved) {
  game.player = new Player({
    name:            saved.name            ?? INITIAL_PLAYER_STATS.name,
    hp:              saved.hp              ?? INITIAL_PLAYER_STATS.hp,
    maxHp:           saved.maxHp           ?? INITIAL_PLAYER_STATS.maxHp,
    mp:              saved.mp              ?? INITIAL_PLAYER_STATS.mp,
    maxMp:           saved.maxMp           ?? INITIAL_PLAYER_STATS.maxMp,
    attackBase:      saved.attackBase      ?? INITIAL_PLAYER_STATS.attackBase,
    defenseBase:     saved.defenseBase     ?? INITIAL_PLAYER_STATS.defenseBase,
    maxHpBase:       saved.maxHpBase       ?? (saved.maxHp ?? INITIAL_PLAYER_STATS.maxHp),
    maxMpBase:       saved.maxMpBase       ?? (saved.maxMp ?? INITIAL_PLAYER_STATS.maxMp),
    level:           saved.level           ?? 1,
    exp:             saved.exp             ?? 0,
    skillPoints:     saved.skillPoints     ?? 0,
    learnedSkills:   saved.learnedSkills   ?? [],
    favoriteSkills:  saved.favoriteSkills  ?? [],
    skillTreeNodes:  saved.skillTreeNodes  ?? {},
    materials:       saved.materials       ?? {},
    equipment:       saved.equipment       ?? {},
    ownedEquipment:  saved.ownedEquipment  ?? [],
    enhanceLevels:   saved.enhanceLevels   ?? {},
    dungeonProgress: saved.dungeonProgress ?? {},
    encounterFlags:  saved.encounterFlags  ?? {},
    defeatFlags:     saved.defeatFlags     ?? {},
    defeatCounts:    saved.defeatCounts    ?? {},
    itemUnlockFlags: saved.itemUnlockFlags ?? {},
    gachaTickets:    saved.gachaTickets    ?? 0,
    permanentItems:  saved.permanentItems  ?? {},
  });
  game.dungeon = { id: null, enemyIndex: 0, materials: [] };
}

/** デフォルトの初期プレイヤーを生成してゲームに設定する */
function initPlayerDefault() {
  const s = INITIAL_PLAYER_STATS;
  game.player = new Player({
    ...s,
    maxHpBase: s.maxHp,
    maxMpBase: s.maxMp,
  });
  game.dungeon = { id: null, enemyIndex: 0, materials: [] };
}

// ── API 通信 ──────────────────────────────────────────────────────

/** API にリクエストを送る共通関数 */
async function apiRequest(body) {
  const response = await fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  // response.json() はレスポンスが JSON でない場合に Safari では
  // "The string did not match the expected pattern." という
  // ブラウザ固有のエラーを投げるため、テキストとして取得してから
  // 手動でパースする。BOM や前後の空白も除去して対応する。
  const text = await response.text();
  try {
    return JSON.parse(text.replace(/^\uFEFF/, '').trim());
  } catch (_e) {
    console.error('JSON パース失敗:', _e, 'レスポンス冒頭:', text.substring(0, 200));
    throw new Error(`サーバーから不正なレスポンスが返されました（ステータス: ${response.status}）`);
  }
}

// ── ログイン処理 ──────────────────────────────────────────────────

/** ログインボタン押下時の処理 */
async function loginUser() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if (!username) { showLoginMsg('⚠ ユーザー名を入力してください。', 'error'); return; }
  if (!password) { showLoginMsg('⚠ パスワードを入力してください。', 'error'); return; }

  setLoginButtonsEnabled(false);
  showLoginMsg('⏳ ログイン中…', 'loading');

  try {
    const result = await apiRequest({ action: 'login', username, password });

    if (result.status !== 'ok' && !result.success && !result.save) {
      const errMsg = result.message || result.error || 'ログインに失敗しました';
      showLoginMsg(`❌ ${errMsg}`, 'error');
      return;
    }

    // 認証情報をメモリに保持
    auth.username = username;
    auth.password = password;

    // セーブデータを反映してロビーへ
    if (result.save) {
      applyLoadedSave(result.save);
      // マイグレーション: 全回復スキル取得済みの場合、神聖なうたい寝に自動移行する
      if (game.player.learnedSkills.includes('full_recovery')) {
        game.player.learnedSkills = game.player.learnedSkills.map(
          s => s === 'full_recovery' ? 'holy_slumber' : s
        );
      }
      log('📂 ゲームデータをロードしました。', 'result');
      log(`  名前: ${game.player.name}  LV: ${game.player.level}  EXP: ${game.player.exp}`, 'result');
    } else {
      initPlayerDefault();
    }

    startAutoSaveTimer();
    showScreen('lobby');
    renderLobby();
  } catch (err) {
    showLoginMsg(`❌ 通信エラー: ${err.message}`, 'error');
  } finally {
    setLoginButtonsEnabled(true);
  }
}

// ── 新規登録処理 ──────────────────────────────────────────────────

/** 新規登録ボタン押下時の処理 */
async function registerUser() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if (!username) { showLoginMsg('⚠ ユーザー名を入力してください。', 'error'); return; }
  if (!password) { showLoginMsg('⚠ パスワードを入力してください。', 'error'); return; }

  setLoginButtonsEnabled(false);
  showLoginMsg('⏳ 新規登録中…', 'loading');

  try {
    const result = await apiRequest({ action: 'register', username, password });

    if (result.status !== 'ok' && !result.success) {
      const errMsg = result.message || result.error || '登録に失敗しました';
      showLoginMsg(`❌ ${errMsg}`, 'error');
      return;
    }

    // 認証情報をメモリに保持
    auth.username = username;
    auth.password = password;

    // 初期データでロビーへ（再ログイン不要）
    initPlayerDefault();
    startAutoSaveTimer();
    showScreen('lobby');
    renderLobby();
  } catch (err) {
    showLoginMsg(`❌ 通信エラー: ${err.message}`, 'error');
  } finally {
    setLoginButtonsEnabled(true);
  }
}

// ── ログアウト処理 ────────────────────────────────────────────────

/** ログアウトボタン押下時の処理：セーブしてからログイン画面に戻る */
async function logoutUser() {
  // セーブしてからログアウト
  await autoSave();

  stopAutoSaveTimer();
  auth.username = null;
  auth.password = null;
  game.player   = null;

  // ガチャ履歴をクリアする（別アカウントに引き継がれないようにする）
  const gachaLogEl = document.getElementById('gacha-log');
  if (gachaLogEl) gachaLogEl.innerHTML = '';

  // ログイン画面のフォームをクリア
  const userInput = document.getElementById('login-username');
  const passInput = document.getElementById('login-password');
  if (userInput) userInput.value = '';
  if (passInput) passInput.value = '';
  showLoginMsg('', '');

  showScreen('login');
}

// ── 自動セーブ ────────────────────────────────────────────────────

/**
 * 現在のゲームデータをサーバーにセーブする（サイレント）。
 * ログインしていない場合は何もしない。
 */
async function autoSave() {
  if (!auth.username || !auth.password || !game.player) return;
  try {
    await apiRequest({
      action:   'save',
      username: auth.username,
      password: auth.password,
      save:     buildSaveData(),
    });
  } catch (_err) {
    // 自動セーブの失敗は無視する
  }
}

/** 30秒ごとの自動セーブタイマーを開始する */
function startAutoSaveTimer() {
  stopAutoSaveTimer();
  autoSaveIntervalId = setInterval(autoSave, AUTO_SAVE_INTERVAL_MS);
}

/** 自動セーブタイマーを停止する */
function stopAutoSaveTimer() {
  if (autoSaveIntervalId !== null) {
    clearInterval(autoSaveIntervalId);
    autoSaveIntervalId = null;
  }
}
