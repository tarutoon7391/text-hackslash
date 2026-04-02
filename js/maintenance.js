'use strict';

/**
 * メンテナンスモード設定
 * enabled を true にしてデプロイするとメンテナンス画面が表示される。
 * アップデート完了後に false に戻してデプロイすればメンテナンス解除。
 */
const MAINTENANCE = {
  enabled: false,
  message: 'メンテナンス中です。 🔧情報はこちらから ▶︎ https://discord.gg/KTGPJuuMY ',
};
