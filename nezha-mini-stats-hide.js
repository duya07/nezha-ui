(function () {
  'use strict';

  // 配置项：可通过 window.MiniStatsConfig 覆盖
  // 例如：
  // window.MiniStatsConfig = { hideMiniStats: true, hideParentSection: true };
  const DEFAULT_CONFIG = { hideMiniStats: true, hideParentSection: true };

  const TARGET_SELECTOR = '.server-info .mb-2.flex.flex-wrap.items-center.gap-4';

  function hideMiniStats() {
    const cfg = Object.assign({}, DEFAULT_CONFIG, window.MiniStatsConfig || {});
    if (!cfg.hideMiniStats) return;

    const targetEl = document.querySelector(TARGET_SELECTOR);
    if (!targetEl) return;

    if (cfg.hideParentSection) {
      const parentSection = targetEl.closest('section');
      if (parentSection) {
        parentSection.style.display = 'none';
      } else {
        targetEl.style.display = 'none';
      }
    } else {
      targetEl.style.display = 'none';
    }
  }

  const observer = new MutationObserver(hideMiniStats);
  const root = document.querySelector('#root') || document.body;

  if (root) {
    observer.observe(root, { childList: true, subtree: true });
    hideMiniStats();
  }
})();
