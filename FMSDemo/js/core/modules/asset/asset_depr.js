// js/modules/asset/asset_depr.js

/** 执行月度折旧计算 */
window.executeDepreciation = function(period) {
    if(!confirm(`确认执行【${period}】的固定资产折旧计算吗？`)) return;

    alert("⏳ 正在计算所有在用资产折旧额...");
    
    // 模拟计算过程
    // 1. 读取卡片
    const assets = JSON.parse(sessionStorage.getItem('AssetCards') || "[]");
    let totalDepr = 0;
    let count = 0;

    assets.forEach(a => {
        if(a.status === '使用中') {
            // 简单按 5% 残值，5年折旧，年折旧率 19%
            let monthDepr = (parseFloat(a.originalValue) * 0.95) / (5 * 12);
            totalDepr += monthDepr;
            count++;
            
            // 更新卡片累计折旧
            let oldDepr = parseFloat(a.accumulatedDepr.replace(/,/g, ''));
            a.accumulatedDepr = (oldDepr + monthDepr).toFixed(2);
            a.netValue = (parseFloat(a.originalValue) - parseFloat(a.accumulatedDepr)).toFixed(2);
        }
    });

    // 保存更新后的卡片
    sessionStorage.setItem('AssetCards', JSON.stringify(assets));

    // 2. 生成折旧凭证 (调用会计引擎)
    if(typeof runAccountingEngine === 'function') {
        // 需要先在 GLOBAL_TEMPLATES 里配一个 'TPL_DEPR' 模板
        // 这里暂时模拟
        console.log("调用引擎生成折旧凭证...");
    }

    alert(`✅ 计算完成！\n\n涉及资产：${count} 项\n本月折旧总额：${totalDepr.toLocaleString()} 元`);
    loadContent('AssetDepreciation');
}