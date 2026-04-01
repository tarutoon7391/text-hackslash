'use strict';

/* ==============================================================
   お知らせ機能
   - 既読管理: localStorage の 'lastReadNewsId' に最後に閲覧した
     ニュースの id を保存する。
   - 未読バッジ: id="news-badge" 要素を表示/非表示にする。
     renderLobby() から updateNewsBadge() を呼び出すこと。
   ============================================================== */

const NEWS_STORAGE_KEY = 'lastReadNewsId';

/**
 * date 降順でソートされたニュース配列を返す。
 * @returns {Array}
 */
function getSortedNews() {
  if (!Array.isArray(NEWS_DEFINITIONS) || NEWS_DEFINITIONS.length === 0) return [];
  return NEWS_DEFINITIONS.slice().sort(
    (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)
  );
}

/**
 * 最新ニュース（date 降順の先頭）の id を返す。
 * @returns {string|null}
 */
function getLatestNewsId() {
  const sorted = getSortedNews();
  return sorted.length > 0 ? sorted[0].id : null;
}

/**
 * 未読ニュースが 1 件以上あるかを返す。
 * @returns {boolean}
 */
function hasUnreadNews() {
  const latestId = getLatestNewsId();
  if (!latestId) return false;
  const lastReadId = localStorage.getItem(NEWS_STORAGE_KEY);
  return lastReadId !== latestId;
}

/**
 * 最新ニュースを既読にする（localStorage を更新する）。
 */
function markNewsAsRead() {
  const latestId = getLatestNewsId();
  if (latestId) {
    localStorage.setItem(NEWS_STORAGE_KEY, latestId);
  }
}

/**
 * ロビーの「📢 お知らせ」ボタンの未読バッジ表示を更新する。
 * renderLobby() から呼び出すこと。
 */
function updateNewsBadge() {
  const badge = document.getElementById('news-badge');
  if (!badge) return;
  badge.style.display = hasUnreadNews() ? 'block' : 'none';
}

/**
 * お知らせ一覧を描画し、既読状態を更新する。
 * index.html のお知らせボタン onclick から呼び出すこと。
 */
function renderNews() {
  const container = document.getElementById('news-list');
  if (!container) return;

  const sorted = getSortedNews();

  if (sorted.length === 0) {
    container.innerHTML = '<p class="news-empty">現在お知らせはありません。</p>';
    markNewsAsRead();
    updateNewsBadge();
    return;
  }

  // 描画前に「未読だったニュース」を特定する。
  // lastReadId より新しい（降順で前にある）ものが未読。
  // lastReadId が null（初回）の場合は全件未読。
  const lastReadId = localStorage.getItem(NEWS_STORAGE_KEY);
  const lastReadIndex = lastReadId
    ? sorted.findIndex((n) => n.id === lastReadId)
    : -1;
  // lastReadIndex == -1 → 全件未読（初回 or 保存 id が見つからない場合）
  // lastReadIndex == 0  → 全件既読
  // lastReadIndex >  0  → sorted[0..lastReadIndex-1] が未読

  container.innerHTML = sorted.map((news, idx) => {
    const isNew = lastReadIndex === -1 || idx < lastReadIndex;
    const newBadge = isNew ? '<span class="news-new-badge">NEW</span>' : '';
    return `<div class="news-item${isNew ? ' news-item-unread' : ''}">
      <div class="news-item-header">
        ${newBadge}<span class="news-date">${escapeHtml(news.date)}</span>
        <span class="news-title">${escapeHtml(news.title)}</span>
      </div>
      <div class="news-content">${escapeHtml(news.content)}</div>
    </div>`;
  }).join('');

  // 描画後に既読化してバッジを消す
  markNewsAsRead();
  updateNewsBadge();
}

/**
 * HTML エスケープユーティリティ。
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
