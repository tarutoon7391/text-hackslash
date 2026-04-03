// ranking.js — ランキング機能

// 現在表示中のタブ ('level' | 'legend')
let currentRankingTab = 'level';

/**
 * ランキング画面を開くたびにAPIを叩いて最新データを取得・描画する
 */
async function renderRanking() {
  currentRankingTab = 'level';

  // タブの初期状態をリセット
  document.getElementById('ranking-tab-level').classList.add('active');
  document.getElementById('ranking-tab-legend').classList.remove('active');
  document.getElementById('ranking-level-list').style.display = '';
  document.getElementById('ranking-legend-list').style.display = 'none';

  // リストをクリア
  document.getElementById('ranking-level-list').innerHTML = '';
  document.getElementById('ranking-legend-list').innerHTML = '';
  document.getElementById('ranking-error').style.display = 'none';
  document.getElementById('ranking-error').textContent = '';

  // ローディング表示
  document.getElementById('ranking-loading').style.display = '';

  try {
    // save.js の apiRequest を使うことで、エラーハンドリングを統一する。
    // ログイン中であればユーザー名・パスワードも渡す（サーバーが認証を要求する場合に対応）。
    const data = await apiRequest({
      action:   'ranking',
      username: auth.username || undefined,
      password: auth.password || undefined,
    });

    if (!data.success) {
      throw new Error(data.message || 'ランキングの取得に失敗しました');
    }

    document.getElementById('ranking-loading').style.display = 'none';

    const myName = auth.username || '';

    // レベルランキング描画
    renderRankingList(
      'ranking-level-list',
      data.levelRanking || [],
      myName,
      (entry) => `Lv.${entry.level}`,
      (entry) => Number(entry.level)
    );

    // レジェンド所持数ランキング描画
    renderRankingList(
      'ranking-legend-list',
      data.legendRanking || [],
      myName,
      (entry) => `${entry.legendCount}個`,
      (entry) => Number(entry.legendCount)
    );

  } catch (e) {
    document.getElementById('ranking-loading').style.display = 'none';
    const errEl = document.getElementById('ranking-error');
    errEl.textContent = `⚠ ランキングの取得に失敗しました。しばらく時間をおいてから再度お試しください。`;
    errEl.style.display = '';
    console.error('ランキング取得エラー:', e.message);
  }
}

/**
 * ランキングリストをDOMに描画する
 * @param {string} containerId  描画先要素のID
 * @param {Array}  entries      APIレスポンスのエントリ配列
 * @param {string} myName       自分のユーザー名
 * @param {Function} valueFn   エントリから表示文字列を返す関数
 * @param {Function} sortKeyFn エントリからソートキー（数値）を返す関数
 */
function renderRankingList(containerId, entries, myName, valueFn, sortKeyFn) {
  const container = document.getElementById(containerId);

  // 降順ソート
  const sorted = [...entries].sort((a, b) => sortKeyFn(b) - sortKeyFn(a));

  const top20 = sorted.slice(0, 20);
  const myRank = sorted.findIndex((e) => e.username === myName) + 1; // 0ならば圏外
  const myInTop20 = myRank >= 1 && myRank <= 20;

  let html = '';

  // TOP20
  top20.forEach((entry, idx) => {
    const rank = idx + 1;
    const isMe = entry.username === myName;
    const rankLabel = getRankLabel(rank);
    const rankClass = getRankClass(rank);
    const rowClass = `ranking-row${rankClass ? ` ${rankClass}` : ''}${isMe ? ' ranking-row-me' : ''}`;

    html += `<div class="${rowClass}">`;
    html += `<span class="ranking-rank">${rankLabel}</span>`;
    html += `<span class="ranking-name">${escapeHtml(entry.username)}${isMe ? ' 👤' : ''}</span>`;
    html += `<span class="ranking-value">${escapeHtml(valueFn(entry))}</span>`;
    html += `</div>`;
  });

  // 自分が圏外の場合
  if (!myInTop20 && myName) {
    html += `<div class="ranking-separator">・・・</div>`;
    if (myRank > 0) {
      const myEntry = sorted[myRank - 1];
      html += `<div class="ranking-row ranking-row-me">`;
      html += `<span class="ranking-rank">${myRank}位</span>`;
      html += `<span class="ranking-name">${escapeHtml(myEntry.username)} 👤</span>`;
      html += `<span class="ranking-value">${escapeHtml(valueFn(myEntry))}</span>`;
      html += `</div>`;
    } else {
      html += `<div class="ranking-row ranking-row-me">`;
      html += `<span class="ranking-rank">圏外</span>`;
      html += `<span class="ranking-name">${escapeHtml(myName)} 👤</span>`;
      html += `<span class="ranking-value">—</span>`;
      html += `</div>`;
    }
  }

  container.innerHTML = html;
}

/**
 * 順位に応じた表示ラベルを返す
 */
function getRankLabel(rank) {
  if (rank === 1) return '🥇 1位';
  if (rank === 2) return '🥈 2位';
  if (rank === 3) return '🥉 3位';
  return `${rank}位`;
}

/**
 * 順位に応じたCSSクラスを返す
 */
function getRankClass(rank) {
  if (rank === 1) return 'ranking-row-gold';
  if (rank === 2) return 'ranking-row-silver';
  if (rank === 3) return 'ranking-row-bronze';
  return '';
}

/**
 * ランキングタブを切り替える
 * @param {'level'|'legend'} tab
 */
function switchRankingTab(tab) {
  currentRankingTab = tab;

  document.getElementById('ranking-tab-level').classList.toggle('active', tab === 'level');
  document.getElementById('ranking-tab-legend').classList.toggle('active', tab === 'legend');
  document.getElementById('ranking-level-list').style.display = tab === 'level' ? '' : 'none';
  document.getElementById('ranking-legend-list').style.display = tab === 'legend' ? '' : 'none';
}

/**
 * XSS対策: HTML特殊文字をエスケープする
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
