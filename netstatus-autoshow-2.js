// ==UserScript==
// @version      2.1
// @description  哪吒详情页直接展示网络波动卡片（网络延迟置顶版）
// @author       Modified based on nodeseek post
// ==/UserScript==

(function () {
    'use strict';

    // "网络" 按钮选择器
    const selectorNetworkButton =
        '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';

    // Tab 切换栏区域
    const selectorTabSection =
        '.server-info section.flex.items-center.my-2.w-full';

    // 整个详情页容器
    const selectorContainer =
        '.server-info';

    // 详情图表区域（包含 .server-charts 的 div）
    const selectorDetailCharts =
        '.server-info > div:has(.server-charts)';

    // 网络图表区域（非首个且不包含详情图表的 div）
    const selectorNetworkCharts =
        '.server-info > div:not(:first-child):not(:has(.server-charts))';

    // 是否已点击过“网络”按钮
    let hasClicked = false;

    // 当前页面 URL（用于 SPA 路由检测）
    let lastUrl = location.href;

    // 监听 URL 变化（单页应用切换页面时重置状态）
    function checkUrlChange() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            hasClicked = false;
            console.log('[UserScript] 检测到路由变化，状态已重置');
        }
    }

    // 自动点击“网络”按钮加载网络图表
    function tryClickNetworkButton() {
        if (hasClicked) return;

        const btn = document.querySelector(selectorNetworkButton);
        if (btn) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已点击网络按钮');

            // 等待图表渲染完成后执行布局调整
            setTimeout(() => {
                forceBothVisible();
                swapIfNeeded();
            }, 300);
        }
    }

    // 隐藏原本的 Tab 切换栏
    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.setProperty('display', 'none', 'important');
        }
    }

    // 强制显示详情图表和网络图表
    function forceBothVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            detailDiv.style.setProperty('display', 'block', 'important');
        }
        if (networkDiv) {
            networkDiv.style.setProperty('display', 'block', 'important');
        }
    }

    // 如果网络图表在详情图表后面，则交换顺序，实现置顶
    function swapIfNeeded() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (
            detailDiv &&
            networkDiv &&
            detailDiv.parentNode === networkDiv.parentNode
        ) {
            if (
                detailDiv.compareDocumentPosition(networkDiv) &
                Node.DOCUMENT_POSITION_FOLLOWING
            ) {
                detailDiv.parentNode.insertBefore(networkDiv, detailDiv);
                console.log('[UserScript] 已调整顺序：网络延迟已置顶');
            }
        }
    }

    // 主逻辑：执行点击、隐藏、显示、排序等操作
    function injectLayout() {
        checkUrlChange();

        const container = document.querySelector(selectorContainer);
        if (!container) return;

        tryClickNetworkButton();
        hideTabSection();
        forceBothVisible();
        swapIfNeeded();
    }

    // 启动 MutationObserver 监听 DOM 变化（适配 React 重渲染）
    function startObserver() {
        const root = document.querySelector('#root');
        if (!root) return;

        let debounceTimer = null;

        const observer = new MutationObserver(() => {
            if (debounceTimer) return;

            debounceTimer = setTimeout(() => {
                debounceTimer = null;
                injectLayout();
            }, 50);
        });

        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class'],
        });

        console.log('[UserScript] 观察器已启动（置顶优化版）');
    }

    // 启动监听
    startObserver();

    // 兜底定时执行，防止极端情况下未触发
    setInterval(injectLayout, 60000);

})();
