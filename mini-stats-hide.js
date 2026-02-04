// 隐藏迷你概览条
(function() {
    'use strict';
    
    // 目标选择器：匹配你发的 HTML 代码中的那个 div class
    const TARGET_SELECTOR = '.server-info .mb-2.flex.flex-wrap.items-center.gap-4';

    const observer = new MutationObserver(() => {
        const cfg = window.MiniStatsConfig || { hideMiniStats: true, hideParentSection: true };
        
        if (!cfg.hideMiniStats) return;

        const targetEl = document.querySelector(TARGET_SELECTOR);
        
        if (targetEl) {
            // 如果配置为隐藏父级section (推荐)，则隐藏 section
            if (cfg.hideParentSection) {
                const parentSection = targetEl.closest('section');
                if (parentSection) {
                    parentSection.style.display = 'none';
                } else {
                    targetEl.style.display = 'none';
                }
            } else {
                // 否则只隐藏里面的内容
                targetEl.style.display = 'none';
            }
        }
    });

    const root = document.querySelector('#root') || document.body;
    if (root) {
        observer.observe(root, { childList: true, subtree: true });
    }
})();
