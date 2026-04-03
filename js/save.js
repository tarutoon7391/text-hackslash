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
    currentJob:      p.currentJob,
    usedBooks:       p.usedBooks,
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
    currentJob:      saved.currentJob      ?? null,
    usedBooks:       saved.usedBooks       ?? {},
  });

  // 壊れたセーブデータのクリーンアップ:
  // currentJob 以外の職業のスキルツリーに習得済みノードが残っている場合、
  // またはアンロックフラグが残っている場合はリセットして SP を返還する
  const p = game.player;
  let cleanupDone = false;
  JOB_IDS.forEach(jobId => {
    if (jobId === p.currentJob) return;
    const flag = getJobUnlockFlag(jobId);
    const hasNodes = (p.skillTreeNodes[jobId] || []).length > 0;
    if (p.permanentItems[flag] || hasNodes) {
      resetJobSkillTree(jobId);
      delete p.permanentItems[flag];
      cleanupDone = true;
    }
  });
  // makenshiルートのクリーンアップ
  if (p.currentJob !== 'makenshi') {
    const makenshiFlag = getJobUnlockFlag('makenshi');
    const hasMakenshiNodes = (p.skillTreeNodes['makenshi'] || []).length > 0;
    if (p.permanentItems[makenshiFlag] || hasMakenshiNodes) {
      resetJobSkillTree('makenshi');
      delete p.permanentItems[makenshiFlag];
      cleanupDone = true;
    }
  }
  // クリーンアップが行われた場合はステータスを再計算し、永続効果を確実に除去する
  if (cleanupDone) {
    p.recalcStats();
  }

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
    const parsed = JSON.parse(text.replace(/^\uFEFF/, '').trim());
    // サーバーが 4xx/5xx を返した場合でも JSON が取れた場合はそのまま返す
    // （呼び出し側で success / status を確認して処理する）
    return parsed;
  } catch (_e) {
    console.error('JSON パース失敗:', _e, 'レスポンス冒頭:', text.substring(0, 200));
    // HTTP ステータスに応じて分かりやすいメッセージを返す
    if (response.status >= 500) {
      throw new Error('サーバーで問題が発生しました。しばらく時間をおいてから再度お試しください。');
    }
    if (response.status >= 400) {
      throw new Error('サーバーとの通信に失敗しました。再度ログインするか、しばらく時間をおいてからお試しください。');
    }
    throw new Error('サーバーから不正なレスポンスが返されました。しばらく時間をおいてから再度お試しください。');
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

  // 自動セーブの失敗カウントをリセットする
  autoSaveFailCount    = 0;
  autoSaveFailNotified = false;

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

/** 自動セーブの連続失敗回数 */
let autoSaveFailCount = 0;

/** 自動セーブ失敗を通知済みかどうか */
let autoSaveFailNotified = false;

/**
 * 現在のゲームデータをサーバーにセーブする（サイレント）。
 * ログインしていない場合は何もしない。
 * 連続して失敗した場合はゲームログに警告を表示する。
 */
async function autoSave() {
  if (!auth.username || !auth.password || !game.player) return;
  try {
    const result = await apiRequest({
      action:   'save',
      username: auth.username,
      password: auth.password,
      save:     buildSaveData(),
    });
    // 成功した場合は失敗カウントをリセットする
    if (result && (result.status === 'ok' || result.success)) {
      autoSaveFailCount = 0;
      autoSaveFailNotified = false;
    } else if (result && (result.status === 'error' || result.message)) {
      // サーバーがエラーを返した場合
      autoSaveFailCount++;
      _notifyAutoSaveFailureIfNeeded(result.message);
    }
  } catch (_err) {
    autoSaveFailCount++;
    _notifyAutoSaveFailureIfNeeded(_err.message);
  }
}

/**
 * 一定回数以上の自動セーブ失敗を検知した場合にゲームログで警告する。
 * @param {string} [serverMessage] - サーバーから返ってきたエラーメッセージ（任意）
 */
function _notifyAutoSaveFailureIfNeeded(serverMessage) {
  const FAIL_THRESHOLD = 3;
  if (autoSaveFailCount >= FAIL_THRESHOLD && !autoSaveFailNotified) {
    autoSaveFailNotified = true;
    const msg = serverMessage
      ? `⚠ 自動セーブに失敗し続けています。データが保存されていない可能性があります。（${serverMessage}）`
      : '⚠ 自動セーブに失敗し続けています。データが保存されていない可能性があります。';
    if (typeof log === 'function') {
      log(msg, 'error');
    } else {
      console.warn(msg);
    }
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
