// ==UserScript==
// @version      2.0
// @description  哪吒详情页直接展示网络波动卡片（网络延迟置顶版）
// @author       Modified based on nodeseek post
// ==/UserScript==

(function () {
    'use strict';

    // "网络" 按钮选择器
    const selectorNetworkButton = '.server-info-tab .relative.cursor-pointer.text-stone-400.dark\\:text-stone-500';

    // Tab 切换区域
    const selectorTabSection = '.server-info section.flex.items-center.my-2.w-full';

    // 详情图表视图 (包含 .server-charts 的 div)
    const selectorDetailCharts = '.server-info > div:has(.server-charts)';

    // 网络图表视图 (关键修改：使用更稳健的选择器，选择非第一个且不包含详情图表的 div)
    // 这样即使交换了位置，也不会选错
    const selectorNetworkCharts = '.server-info > div:not(:first-child):not(:has(.server-charts))';

    let hasClicked = false;
    let divVisible = false;

    // 新增：交换位置函数 (参考旧代码逻辑)
    function swapPositions() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv && networkDiv && detailDiv.parentNode === networkDiv.parentNode) {
            // 判断顺序：如果 detailDiv 在 networkDiv 之前（Document Position 4 表示 Following），说明需要交换
            // 我们希望 Network 在 Detail 前面
            if (detailDiv.compareDocumentPosition(networkDiv) & Node.DOCUMENT_POSITION_FOLLOWING) {
                // 将 networkDiv 插入到 detailDiv 之前
                detailDiv.parentNode.insertBefore(networkDiv, detailDiv);
                console.log('[UserScript] 已调整顺序：网络延迟已置顶');
            }
        }
    }

    function forceBothVisible() {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        if (detailDiv) {
            detailDiv.style.display = 'block';
        }
        if (networkDiv) {
            networkDiv.style.display = 'block';
        }
    }

    function hideTabSection() {
        const section = document.querySelector(selectorTabSection);
        if (section) {
            section.style.display = 'none';
        }
    }

    function tryClickNetworkButton() {
        const btn = document.querySelector(selectorNetworkButton);
        if (btn && !hasClicked) {
            btn.click();
            hasClicked = true;
            console.log('[UserScript] 已点击网络按钮');
            // 点击后延迟执行：显示全部 + 交换位置
            setTimeout(() => {
                forceBothVisible();
                swapPositions(); 
            }, 500);
        }
    }

    function tryClickPeak(retryCount = 10, interval = 200) {
        const peakBtn = document.querySelector('#Peak');
        if (peakBtn) {
            peakBtn.click();
            console.log('[UserScript] 已点击 Peak 按钮');
        } else if (retryCount > 0) {
            setTimeout(() => tryClickPeak(retryCount - 1, interval), interval);
        }
    }

    const observer = new MutationObserver(() => {
        const detailDiv = document.querySelector(selectorDetailCharts);
        const networkDiv = document.querySelector(selectorNetworkCharts);

        const isDetailVisible = detailDiv && getComputedStyle(detailDiv).display !== 'none';
        const isNetworkVisible = networkDiv && getComputedStyle(networkDiv).display !== 'none';

        const isAnyDivVisible = isDetailVisible || isNetworkVisible;

        if (isAnyDivVisible && !divVisible) {
            hideTabSection();
            tryClickNetworkButton();
            // 稍微延迟一点执行交换，确保元素已渲染
            setTimeout(swapPositions, 100);
            setTimeout(() => tryClickPeak(15, 200), 300);
        } else if (!isAnyDivVisible && divVisible) {
            hasClicked = false;
        }

        divVisible = isAnyDivVisible;

        // 持续监控：确保两个都显示，且顺序正确
        if (detailDiv && networkDiv) {
            if (!isDetailVisible || !isNetworkVisible) {
                forceBothVisible();
            }
            // 每次变动都检查顺序，如果 React 重新渲染把顺序还原了，这里会再次把它换回来
            swapPositions();
        }
    });

    const root = document.querySelector('#root');
    if (root) {
        observer.observe(root, {
            childList: true,
            attributes: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
        console.log('[UserScript] 观察器已启动 (置顶版)');
    }
})();
