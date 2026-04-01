'use strict';

/**
 * メンテナンスモード設定
 * enabled を true にしてデプロイするとメンテナンス画面が表示される。
 * アップデート完了後に false に戻してデプロイすればメンテナンス解除。
 */
const MAINTENANCE = {
  enabled: true,
  message: 'アップデート作業中です。3分ほどお待ちください🔧',
};
