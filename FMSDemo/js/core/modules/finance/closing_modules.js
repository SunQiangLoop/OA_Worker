/**
 * 期末处理模块组 (Period End Processing Modules)
 * 包含：期末中心、自动转账、结账向导
 * 解决 file:// 协议下的跨域安全限制
 */

(function() {
    if (!window.VM_MODULES) window.VM_MODULES = {};

    // ── 工具函数 ──────────────────────────────────────────────────
    const lsGet = (k) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch(e){return null;} };
    const lsSet = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); return true; } catch(e){return false;} };
    const ssGet = (k) => { try { const v=sessionStorage.getItem(k); return v?JSON.parse(v):null; } catch(e){return null;} };
    const ssSet = (k,v) => { try { sessionStorage.setItem(k,JSON.stringify(v)); return true; } catch(e){return false;} };
    const fmt = (n) => (Math.round(n*100)/100).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});

    function getStepDone(period, key) {
        const doneMap = lsGet('QM_StepsDone') || {};
        return !!(doneMap[period] && doneMap[period][key]);
    }

    // =========================================================================
    // 1. 期末处理中心 (原 final_processing1.html)
    // =========================================================================
    window.VM_MODULES['PeriodEndCenter'] = function(contentArea) {
        const period = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0,7);
        
        const STEPS = [
            { key: 'autoTransfer', label: '自动转账', icon: '🔄', desc: '自动执行计提税金方案，生成记账凭证', url: 'AutoTransferTax' },
            { key: 'amort',        label: '凭证摊销', icon: '📉', desc: '按摊销计划生成本期摊销凭证',             url: '#' },
            { key: 'accrue',       label: '凭证预提', icon: '📋', desc: '执行预提方案，计提本期应预提费用',       url: '#' },
            { key: 'adjust',       label: '账务调整', icon: '🔀', desc: '期末往来对冲、科目重分类、坏账计提',     url: '#' },
            { key: 'profit',       label: '结转损益', icon: '秤', desc: '将损益科目余额结转至本年利润科目',       url: 'ClosingWizardProfit' },
            { key: 'close',        label: '总账结账', icon: '🔒', desc: '完成最终结账，锁定本期账务数据',         url: 'ClosingWizardClose' },
        ];

        let currentIdx = STEPS.findIndex(s => !getStepDone(period, s.key));
        if (currentIdx === -1) currentIdx = STEPS.length;

        const html = `
        <style>
            .pe-main { padding: 20px; max-width: 1200px; margin: 0 auto; font-family: sans-serif; }
            .pe-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; border: 1px solid #f3f4f6; }
            .pe-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
            .pe-title::before { content: ''; width: 4px; height: 18px; background: #3b82f6; border-radius: 2px; }
            .pe-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            .pe-step-card { border: 1.5px solid #f3f4f6; border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.2s; position: relative; }
            .pe-step-card:hover { border-color: #3b82f6; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .pe-step-card.done { border-color: #a7f3d0; background: #f0fdf4; }
            .pe-step-icon { font-size: 32px; margin-bottom: 12px; display: block; }
            .pe-step-name { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
            .pe-step-desc { font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 16px; }
            .pe-status { font-size: 11px; padding: 2px 8px; border-radius: 10px; font-weight: 600; }
            .pe-status.done { background: #d1fae5; color: #065f46; }
            .pe-status.ready { background: #dbeafe; color: #1d4ed8; }
            .pe-status.pending { background: #f3f4f6; color: #9ca3af; }
            .pe-btn { background: #3b82f6; color: #fff; border: none; padding: 6px 16px; border-radius: 6px; font-size: 13px; cursor: pointer; }
            .pe-step-bar { display: flex; align-items: center; margin-bottom: 30px; padding: 0 20px; }
            .pe-bar-item { flex: 1; text-align: center; position: relative; }
            .pe-bar-circle { width: 32px; height: 32px; border-radius: 50%; background: #e5e7eb; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; color: #9ca3af; margin-bottom: 8px; position: relative; z-index: 2; border: 3px solid #fff; }
            .pe-bar-circle.done { background: #34d399; color: #fff; }
            .pe-bar-circle.active { background: #3b82f6; color: #fff; }
            .pe-bar-line { position: absolute; top: 16px; left: 50%; width: 100%; height: 2px; background: #e5e7eb; z-index: 1; }
            .pe-bar-item:last-child .pe-bar-line { display: none; }
            .pe-bar-line.done { background: #34d399; }
        </style>
        <div class="pe-main">
            <div class="pe-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <div class="pe-title" style="margin-bottom:0">期末处理流程进度 (${period})</div>
                    <div style="background:#eff6ff; color:#1d4ed8; padding:4px 12px; border-radius:20px; font-size:13px; font-weight:600;">当前期间: ${period}</div>
                </div>
                <div class="pe-step-bar">
                    ${STEPS.map((s, i) => `
                        <div class="pe-bar-item">
                            <div class="pe-bar-line ${getStepDone(period, s.key) ? 'done' : ''}"></div>
                            <div class="pe-bar-circle ${getStepDone(period, s.key) ? 'done' : (i === currentIdx ? 'active' : '')}">${getStepDone(period, s.key) ? '✓' : i+1}</div>
                            <div style="font-size:12px; color:${i === currentIdx ? '#3b82f6' : '#6b7280'}">${s.label}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="pe-grid">
                ${STEPS.map((step, idx) => {
                    const isDone = getStepDone(period, step.key);
                    const isReady = idx === currentIdx;
                    return `
                        <div class="pe-step-card ${isDone ? 'done' : ''}" onclick="loadContent('${step.url}')">
                            <span class="pe-step-icon">${step.icon}</span>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <div class="pe-step-name">${step.label}</div>
                                <span class="pe-status ${isDone ? 'done' : (isReady ? 'ready' : 'pending')}">${isDone ? '已完成' : (isReady ? '进行中' : '待处理')}</span>
                            </div>
                            <div class="pe-step-desc">${step.desc}</div>
                            <div style="text-align:right">
                                <button class="pe-btn" style="${isDone ? 'background:#059669' : ''}">${isDone ? '查看' : '进入'} →</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        `;
        contentArea.innerHTML = html;
    };

    // =========================================================================
    // 2. 自动转账 - 计提税金 (原 final_processing.html)
    // =========================================================================
    window.VM_MODULES['AutoTransferTax'] = function(contentArea) {
        const period = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0,7);
        const vouchers = window.getManualVouchers ? window.getManualVouchers() : (ssGet('ManualVouchers') || []);
        
        // 计算逻辑
        const periodVouchers = vouchers.filter(v =>
            (v.status === '已记账' || v.status === '已过账' || v.status === '已审核' || v.status === '待审核') &&
            ((v.date||'').startsWith(period) || v.period === period)
        );

        let credit222101 = 0, debit222101 = 0;
        periodVouchers.forEach(v => {
            (v.lines||[]).forEach(l => {
                const fullAccount = (l.accountCode || l.account || '').toString().trim();
                const code = fullAccount.split(' ')[0].replace(/\./g, '');
                if (code === '222101' || (code === '2221' && !fullAccount.includes('城建') && !fullAccount.includes('教育'))) {
                    credit222101 += parseFloat((l.credit||'0').toString().replace(/,/g,'')) || 0;
                    debit222101  += parseFloat((l.debit||'0').toString().replace(/,/g,'')) || 0;
                }
            });
        });
        const vatBase = Math.max(credit222101 - debit222101, 0);
        const tax1 = Math.round(vatBase * 0.07 * 100) / 100;
        const tax2 = Math.round(vatBase * 0.03 * 100) / 100;
        const tax3 = Math.round(vatBase * 0.02 * 100) / 100;
        const totalTax = tax1 + tax2 + tax3;

        const isDone = getStepDone(period, 'autoTransfer');

        const html = `
        <style>
            .at-main { padding: 20px; max-width: 900px; margin: 0 auto; }
            .at-card { background: #fff; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); margin-bottom: 20px; }
            .at-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
            .at-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px; }
            .at-info-box { background: #f9fafb; border: 1px solid #eee; padding: 15px; border-radius: 8px; }
            .at-val { font-size: 20px; font-weight: 700; margin-top: 5px; }
            .at-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
            .at-table th { background: #f9fafb; padding: 10px; text-align: left; border-bottom: 2px solid #eee; }
            .at-table td { padding: 10px; border-bottom: 1px solid #f3f4f6; }
            .at-btn { background: #3b82f6; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; }
            .at-btn:disabled { background: #ccc; cursor: not-allowed; }
            .at-alert { padding: 12px 16px; border-radius: 8px; background: #f0fdf4; color: #065f46; border: 1px solid #a7f3d0; margin-bottom: 20px; display: ${isDone ? 'block' : 'none'}; }
        </style>
        <div class="at-main">
            <div style="margin-bottom:20px"><button onclick="loadContent('PeriodEndCenter')" style="cursor:pointer; background:none; border:none; color:#3b82f6">← 返回期末处理</button></div>
            <div class="at-header">
                <div>
                    <h2 style="font-size:20px; margin-bottom:5px">🔄 自动转账 — 计提税金及附加</h2>
                    <div style="font-size:13px; color:#6b7280">根据本期增值税余额，自动计提城建税、教育费附加等</div>
                </div>
                <div style="background:#eff6ff; color:#1d4ed8; padding:4px 12px; border-radius:20px; font-size:13px; font-weight:600;">期间: ${period}</div>
            </div>

            <div class="at-alert">✅ 本期计提税金凭证已生成，可在凭证审核中心查看。</div>

            <div class="at-card">
                <h3 style="font-size:15px; margin-bottom:15px">📊 本期增值税基础数据</h3>
                <div class="at-info-grid">
                    <div class="at-info-box">
                        <div style="font-size:11px; color:#9ca3af">应交增值税余额</div>
                        <div class="at-val">¥${fmt(vatBase)}</div>
                    </div>
                    <div class="at-info-box">
                        <div style="font-size:11px; color:#9ca3af">城建税(7%)</div>
                        <div class="at-val" style="color:#dc2626">¥${fmt(tax1)}</div>
                    </div>
                    <div class="at-info-box">
                        <div style="font-size:11px; color:#9ca3af">教育附加(3%)</div>
                        <div class="at-val" style="color:#dc2626">¥${fmt(tax2)}</div>
                    </div>
                    <div class="at-info-box">
                        <div style="font-size:11px; color:#9ca3af">地方教育附加(2%)</div>
                        <div class="at-val" style="color:#dc2626">¥${fmt(tax3)}</div>
                    </div>
                </div>
            </div>

            <div class="at-card">
                <h3 style="font-size:15px; margin-bottom:10px">📋 待生成凭证明细</h3>
                <table class="at-table">
                    <thead><tr><th>摘要</th><th>科目</th><th>借方</th><th>贷方</th></tr></thead>
                    <tbody>
                        <tr><td>计提城建税/教育附加</td><td>税金及附加</td><td>¥${fmt(totalTax)}</td><td></td></tr>
                        <tr><td>计提城市维护建设税</td><td>222102 应交城建税</td><td></td><td>¥${fmt(tax1)}</td></tr>
                        <tr><td>计提教育费附加</td><td>222103 应交教育费附加</td><td></td><td>¥${fmt(tax2)}</td></tr>
                        <tr><td>计提地方教育附加</td><td>222104 应交地方教育附加</td><td></td><td>¥${fmt(tax3)}</td></tr>
                    </tbody>
                </table>
                <div style="text-align:right">
                    <button class="at-btn" id="execAtBtn" ${isDone || vatBase === 0 ? 'disabled' : ''} onclick="window.doAutoTransferAction()">执行并生成凭证</button>
                </div>
            </div>
        </div>
        `;
        contentArea.innerHTML = html;

        // 挂载执行逻辑到全局，方便 onclick 调用
        window.doAutoTransferAction = function() {
            if (!confirm(`确认生成本期计提税金凭证？总额: ¥${fmt(totalTax)}`)) return;
            
            const currentVouchers = window.getManualVouchers ? window.getManualVouchers() : (ssGet('ManualVouchers') || []);
            const existing = currentVouchers.filter(v => v.id && v.id.startsWith('转-'));
            let maxSeq = 0;
            existing.forEach(v => { const n=parseInt((v.id||'').split('-')[1]||'0'); if(n>maxSeq) maxSeq=n; });
            const newId = '转-' + String(maxSeq+1).padStart(4,'0');
            
            const taxCode = currentVouchers.some(v => (v.lines||[]).some(l => (l.accountCode||'').startsWith('5403'))) ? '5403' : '6403';
            
            const newV = {
                id: newId, date: period + '-28', period: period, amount: totalTax.toFixed(2),
                summary: `${period} 期末计提税金及附加`, user: '系统自动转账', status: '待审核',
                type: '转账凭证', voucherType: '转账凭证', sourceType: 'AutoTransfer',
                lines: [
                    { summary: '计提税金及附加', accountCode: taxCode, account: taxCode + ' 税金及附加', debit: totalTax.toFixed(2), credit: '' },
                    { summary: '计提城建税', accountCode: '222102', account: '222102 应交城建税', debit: '', credit: tax1.toFixed(2) },
                    { summary: '计提教育费附加', accountCode: '222103', account: '222103 应交教育费附加', debit: '', credit: tax2.toFixed(2) },
                    { summary: '计提地方教育附加', accountCode: '222104', account: '222104 应交地方教育附加', debit: '', credit: tax3.toFixed(2) }
                ]
            };
            
            currentVouchers.unshift(newV);
            if (window.saveManualVouchers) window.saveManualVouchers(currentVouchers);
            else ssSet('ManualVouchers', currentVouchers);

            // 标记完成
            const doneMap = lsGet('QM_StepsDone') || {};
            if (!doneMap[period]) doneMap[period] = {};
            doneMap[period]['autoTransfer'] = true;
            lsSet('QM_StepsDone', doneMap);

            alert(`✅ 凭证 ${newId} 已生成！`);
            loadContent('AutoTransferTax');
        };
    };

    // =========================================================================
    // 3. 结账向导 (原 final_processing2.html)
    // =========================================================================
    window.VM_MODULES['ClosingWizardProfit'] = function(contentArea) { renderClosingStep(contentArea, 'profit'); };
    window.VM_MODULES['ClosingWizardClose'] = function(contentArea) { renderClosingStep(contentArea, 'close'); };

    function renderClosingStep(contentArea, step) {
        const period = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0,7);
        const status = lsGet('QM_ClosingStatus') || { profitDone: false, closed: false };
        const isDone = (step === 'profit' ? status.profitDone : status.closed);

        const html = `
        <style>
            .cw-main { padding: 20px; max-width: 800px; margin: 0 auto; }
            .cw-card { background: #fff; border-radius: 12px; padding: 30px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); text-align: center; }
            .cw-icon { font-size: 60px; margin-bottom: 20px; display: block; }
            .cw-title { font-size: 24px; font-weight: 700; margin-bottom: 15px; }
            .cw-desc { font-size: 15px; color: #6b7280; line-height: 1.6; margin-bottom: 30px; }
            .cw-btn { background: #3b82f6; color: #fff; border: none; padding: 12px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
            .cw-btn.done { background: #059669; }
        </style>
        <div class="cw-main">
            <div style="margin-bottom:20px"><button onclick="loadContent('PeriodEndCenter')" style="cursor:pointer; background:none; border:none; color:#3b82f6">← 返回期末处理</button></div>
            <div class="cw-card">
                <span class="cw-icon">${step === 'profit' ? '⚖️' : '🔒'}</span>
                <h2 class="cw-title">${step === 'profit' ? '结转本期损益' : '期末总账结账'}</h2>
                <div class="cw-desc">
                    ${step === 'profit' 
                        ? `将本期所有收入、费用科目余额结转至“本年利润”科目。结转后损益类科目余额将清零。<br>目标期间: <b>${period}</b>`
                        : `完成本期最终结账，系统将锁定该期间所有账务数据，不可再修改凭证。同时将余额结转至下期。<br>目标期间: <b>${period}</b>`}
                </div>
                ${isDone 
                    ? `<div style="color:#059669; font-weight:700; margin-bottom:20px">✅ 该步骤已完成</div>`
                    : `<button class="cw-btn" onclick="window.doClosingAction('${step}')">开始执行</button>`
                }
                ${isDone && step === 'profit' ? `<button class="cw-btn" onclick="loadContent('ClosingWizardClose')">下一步: 最终结账 →</button>` : ''}
            </div>
        </div>
        `;
        contentArea.innerHTML = html;

        window.doClosingAction = function(s) {
            if (!confirm(`确认要执行 ${s === 'profit' ? '结转损益' : '最终结账'} 吗？`)) return;
            
            const curStatus = lsGet('QM_ClosingStatus') || { profitDone: false, closed: false };
            if (s === 'profit') {
                curStatus.profitDone = true;
                // 模拟生成结转凭证逻辑...
                alert('✅ 损益结转成功，已生成结转凭证。');
            } else {
                curStatus.closed = true;
                // 联动修改主系统期间状态
                try {
                    const periods = JSON.parse(sessionStorage.getItem('FinanceAccountPeriods') || '[]');
                    periods.forEach(p => { if(p.period === period) p.status = '已关闭'; });
                    sessionStorage.setItem('FinanceAccountPeriods', JSON.stringify(periods));
                } catch(e){}
                alert(`🎉 ${period} 会计期间已成功结账并锁定！`);
            }
            lsSet('QM_ClosingStatus', curStatus);
            loadContent(s === 'profit' ? 'ClosingWizardProfit' : 'ClosingWizardClose');
        };
    };

})();
