// 迷你概览条增加半透明背景
(function () {
  'use strict';

  const TARGET_SELECTOR = '.server-info .mb-2.flex.flex-wrap.items-center.gap-4';

  function styleMiniStats() {
    const targetEl = document.querySelector(TARGET_SELECTOR);
    if (!targetEl || targetEl.dataset.miniStatsStyled === 'true') return;

    // 半透明背景 + 毛玻璃 + 阴影（与哪吒其他卡片一致）
    targetEl.classList.add(
      'bg-card/70',
      'backdrop-blur-md',
      'shadow-lg',
      'dark:shadow-none',
      'border',
      'border-white/10'
    );

    // 更圆润
    targetEl.style.borderRadius = '18px';

    // 更舒服的内边距
    targetEl.style.padding = '12px 20px';

    // 调整间距
    targetEl.classList.remove('mb-2');
    targetEl.classList.add('mb-3');

    targetEl.dataset.miniStatsStyled = 'true';
  }

  const observer = new MutationObserver(styleMiniStats);
  const root = document.querySelector('#root') || document.body;

  if (root) {
    observer.observe(root, { childList: true, subtree: true, attributes: true });
    styleMiniStats();
  }
})();
