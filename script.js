/**
 * テキストハックスラッシュ - ランディングページ JS
 * スクロールトリガーによるリビールアニメーション・インタラクション
 */

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------------------
     1. スクロールトリガーリビール（IntersectionObserver）
        ※ ヒーローセクションは CSS @keyframes で自動表示
     -------------------------------------------------- */
  const scrollTargets = document.querySelectorAll(
    '.feature-card, .gallery-item, .cta-content > *, .footer-inner > *'
  );

  scrollTargets.forEach(el => el.classList.add('scroll-reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  scrollTargets.forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------
     2. セクションタイトルのスクロールリビール
     -------------------------------------------------- */
  const sectionHeaders = document.querySelectorAll('.features-header, .gallery-header, .cta-banner .cta-content');
  sectionHeaders.forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
  });

  /* --------------------------------------------------
     4. ギャラリーアイテム：時間差リビール
     -------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
  });

  /* --------------------------------------------------
     5. フィーチャーカード：ホバー時にパーティクル演出
     -------------------------------------------------- */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => spawnParticles(card));
  });

  function spawnParticles(parent) {
    const emojis = ['✨', '⭐', '💥', '🎉', '💫'];
    for (let i = 0; i < 4; i++) {
      const span = document.createElement('span');
      span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      span.style.cssText = `
        position: absolute;
        pointer-events: none;
        font-size: ${0.9 + Math.random() * 0.7}rem;
        left: ${10 + Math.random() * 80}%;
        top: ${10 + Math.random() * 80}%;
        animation: particleFly 0.8s ease-out forwards;
        z-index: 10;
      `;
      parent.appendChild(span);
      setTimeout(() => span.remove(), 850);
    }
  }

  /* CSS でパーティクルアニメーションを動的に登録 */
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particleFly {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
      }
    `;
    document.head.appendChild(style);
  }

  /* --------------------------------------------------
     3. ナビゲーション：CTAボタンのパルスアニメーション
     -------------------------------------------------- */
  const primaryBtn = document.querySelector('.btn-primary');
  if (primaryBtn) {
    let pulsing = true;
    function pulseLoop() {
      if (!pulsing) return;
      primaryBtn.animate(
        [
          { transform: 'scale(1)',    boxShadow: '4px 5px 0 rgba(7,59,76,.45)' },
          { transform: 'scale(1.05)', boxShadow: '6px 7px 0 rgba(7,59,76,.45)' },
          { transform: 'scale(1)',    boxShadow: '4px 5px 0 rgba(7,59,76,.45)' },
        ],
        { duration: 1600, easing: 'ease-in-out' }
      ).onfinish = () => {
        setTimeout(pulseLoop, 2000);
      };
    }
    setTimeout(pulseLoop, 2500);

    // ホバー中はパルスを一時停止
    primaryBtn.addEventListener('mouseenter', () => { pulsing = false; });
    primaryBtn.addEventListener('mouseleave', () => {
      pulsing = true;
      setTimeout(pulseLoop, 500);
    });
  }

  /* --------------------------------------------------
     6. スムーススクロール（インライン <a href="#...">）
     -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
