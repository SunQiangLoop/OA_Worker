// js/core/modules/finance/writeoff.js
// 核销管理模块 - 应收核销 / 应付核销 / 报销核销

// ============================================================
// 工具函数
// ============================================================

function _woGenerateId() {
    const today = new Date();
    const dateStr = today.getFullYear().toString()
        + String(today.getMonth() + 1).padStart(2, '0')
        + String(today.getDate()).padStart(2, '0');
    const prefix = 'HX-' + dateStr + '-';
    const list = JSON.parse(sessionStorage.getItem('WriteOffRecords') || '[]');
    const re = new RegExp('^HX-' + dateStr + '-(\\d+)$');
    // 兼容旧格式 WO-XXXX
    let max = 0;
    list.forEach(r => {
        const m = (r.id || '').match(re);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + String(max + 1).padStart(4, '0');
}

function _woGenerateVoucherId(prefix) {
    const vouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
    const re = new RegExp('^' + prefix + '-(\\d+)$');
    let max = 0;
    vouchers.forEach(v => {
        const m = (v.id || '').match(re);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + '-' + String(max + 1).padStart(4, '0');
}

/**
 * 计算收款单/付款单的可用余额（总金额 - 已核销金额）
 */
function _getRcvAvailableAmount(rcvId) {
    if (!rcvId) return 0;
    const rcvList = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    const rcv = rcvList.find(r => r.id === rcvId);
    if (!rcv) {
        // 尝试付款单
        const payList = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
        const pay = payList.find(r => r.id === rcvId);
        if (!pay) return 0;
        const payTotal = parseFloat((pay.totalAmount || '0').toString().replace(/,/g, '')) || 0;
        const payUsed = JSON.parse(sessionStorage.getItem('WriteOffRecords') || '[]')
            .filter(w => w.rcvId === rcvId && w.status !== '已撤销')
            .reduce((sum, w) => sum + (parseFloat(w.writeOffAmount) || 0), 0);
        return Math.max(payTotal - payUsed, 0);
    }
    const total = parseFloat((rcv.totalAmount || '0').toString().replace(/,/g, '')) || 0;
    const used = JSON.parse(sessionStorage.getItem('WriteOffRecords') || '[]')
        .filter(w => w.rcvId === rcvId && w.status !== '已撤销')
        .reduce((sum, w) => sum + (parseFloat(w.writeOffAmount) || 0), 0);
    return Math.max(total - used, 0);
}

// ============================================================
// 全局弹窗注入
// ============================================================

window._injectWriteOffModals = function () {
    if (document.getElementById('wo-modal')) return;

    const modalHTML = `
        <!-- 核销弹窗 -->
        <div id="wo-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
            <div style="background:#fff;border-radius:10px;width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 8px 30px rgba(0,0,0,0.3);">
                <div style="background:#2c3e50;color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;font-size:16px;" id="wo-modal-title">核销操作</h3>
                    <button onclick="window.closeWriteOffModal()" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1;">×</button>
                </div>
                <div style="padding:20px;">
                    <input type="hidden" id="wo_type" value="">
                    <input type="hidden" id="wo_bill_id" value="">

                    <!-- 单据信息摘要 -->
                    <div style="background:#f0f4f8;border-radius:6px;padding:12px 16px;margin-bottom:16px;font-size:13px;">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            <div><span style="color:#7f8c8d;">账款号：</span><strong id="wo_display_bill" style="font-family:monospace;"></strong></div>
                            <div><span style="color:#7f8c8d;">客户：</span><strong id="wo_display_party"></strong></div>
                            <div><span style="color:#7f8c8d;">账期：</span><span id="wo_display_period" style="color:#2980b9;"></span></div>
                            <div><span style="color:#7f8c8d;">未核销余额：</span><strong id="wo_display_remain" style="color:#e74c3c;"></strong></div>
                        </div>
                    </div>

                    <!-- 关联收款单（AR/AP 场景） -->
                    <div style="margin-bottom:4px;">
                        <label style="font-weight:bold;color:#2c3e50;display:block;margin-bottom:6px;">关联收款单
                            <span style="font-weight:normal;color:#7f8c8d;font-size:12px;">（选择后核销金额不能超过可用余额）</span>
                        </label>
                        <select id="wo_rcv_id" onchange="window.onWoRcvChange()" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;font-size:13px;">
                            <option value="">-- 无关联收款单（直接核销） --</option>
                        </select>
                        <div id="wo-rcv-hint" style="margin-top:4px;font-size:12px;color:#27ae60;display:none;"></div>
                    </div>

                    <!-- 运单批量选择（AR核销专用） -->
                    <div id="wo-waybill-section" style="display:none;margin-bottom:16px;margin-top:12px;">
                        <label style="font-weight:bold;color:#2c3e50;display:block;margin-bottom:6px;">批量选择核销运单
                            <span style="font-weight:normal;color:#7f8c8d;font-size:12px;">（勾选本次核销的运单，金额自动合计）</span>
                        </label>
                        <div id="wo-waybill-list" style="max-height:200px;overflow-y:auto;border:1px solid #ddd;border-radius:4px;padding:8px;background:#fafafa;"></div>
                        <div id="wo-waybill-total" style="margin-top:6px;font-size:12px;color:#2980b9;font-weight:bold;"></div>
                    </div>

                    <!-- 金额 & 日期 -->
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                        <div>
                            <label style="font-weight:bold;color:#2c3e50;display:block;margin-bottom:4px;">核销金额 <span style="color:#e74c3c;">*</span></label>
                            <input type="number" id="wo_amount" placeholder="本次核销金额" step="0.01" min="0.01"
                                style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
                        </div>
                        <div>
                            <label style="font-weight:bold;color:#2c3e50;display:block;margin-bottom:4px;">核销日期 <span style="color:#e74c3c;">*</span></label>
                            <input type="date" id="wo_date" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
                        </div>
                    </div>

                    <div style="margin-bottom:20px;">
                        <label style="font-weight:bold;color:#2c3e50;display:block;margin-bottom:4px;">备注</label>
                        <textarea id="wo_remark" rows="2" placeholder="核销备注（可选）"
                            style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;resize:vertical;font-family:inherit;"></textarea>
                    </div>

                    <div style="display:flex;gap:10px;justify-content:flex-end;">
                        <button onclick="window.closeWriteOffModal()"
                            style="padding:8px 20px;background:#f8f9fa;border:1px solid #ddd;border-radius:4px;cursor:pointer;">取消</button>
                        <button onclick="window.confirmWriteOff()"
                            style="padding:8px 24px;background:#2980b9;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">确认核销</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 补录发票关联弹窗 -->
        <div id="link-inv-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;align-items:center;justify-content:center;">
            <div style="background:#fff;border-radius:10px;width:440px;box-shadow:0 8px 30px rgba(0,0,0,0.3);">
                <div style="background:#8e44ad;color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;font-size:16px;">补录发票关联</h3>
                    <button onclick="document.getElementById('link-inv-modal').style.display='none'"
                        style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1;">×</button>
                </div>
                <div style="padding:20px;">
                    <input type="hidden" id="link_wo_id">
                    <input type="hidden" id="link_wo_type">
                    <p style="color:#7f8c8d;font-size:13px;margin-top:0;">核销记录已完成，请选择补开的发票进行关联，完成补票操作。</p>
                    <label style="font-weight:bold;display:block;margin-bottom:6px;">选择发票</label>
                    <select id="link_inv_no"
                        style="width:100%;padding:8px;border:1px solid #ddd;border-radius:4px;margin-bottom:16px;box-sizing:border-box;">
                        <option value="">-- 请选择发票 --</option>
                    </select>
                    <div style="display:flex;gap:10px;justify-content:flex-end;">
                        <button onclick="document.getElementById('link-inv-modal').style.display='none'"
                            style="padding:8px 20px;background:#f8f9fa;border:1px solid #ddd;border-radius:4px;cursor:pointer;">取消</button>
                        <button onclick="window.confirmLinkInvoice()"
                            style="padding:8px 20px;background:#8e44ad;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">确认关联</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.id = 'wo-modals-container';
    container.innerHTML = modalHTML;
    document.body.appendChild(container);
};

// 页面加载后注入弹窗
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window._injectWriteOffModals);
} else {
    window._injectWriteOffModals();
}

// ============================================================
// 收款单选择联动
// ============================================================

window.onWoRcvChange = function () {
    const rcvId = (document.getElementById('wo_rcv_id').value || '').trim();
    const hint = document.getElementById('wo-rcv-hint');
    if (!rcvId) {
        if (hint) { hint.style.display = 'none'; hint.textContent = ''; }
        return;
    }
    const available = _getRcvAvailableAmount(rcvId);
    if (hint) {
        hint.style.display = 'block';
        hint.textContent = '可用余额：¥' + available.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
        hint.style.color = available > 0 ? '#27ae60' : '#e74c3c';
    }
};

// ============================================================
// 运单勾选联动（AR专用）
// ============================================================

window.onWoWaybillChange = function () {
    const checks = document.querySelectorAll('#wo-waybill-list input[type="checkbox"]:checked');
    let total = 0;
    checks.forEach(cb => { total += parseFloat(cb.dataset.amount || '0'); });
    const amtField = document.getElementById('wo_amount');
    if (amtField) amtField.value = total > 0 ? total.toFixed(2) : '';
    const totalEl = document.getElementById('wo-waybill-total');
    if (totalEl) {
        totalEl.textContent = checks.length > 0
            ? '已选 ' + checks.length + ' 条，合计：¥' + total.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
            : '';
    }
};

// ============================================================
// 应收核销弹窗（以 ARStatement 为源）
// ============================================================

window.openARWriteOffModal = function (arId, client, unverified, rcvIdEnc, invNoEnc) {
    window._injectWriteOffModals();
    const modal = document.getElementById('wo-modal');
    if (!modal) return;

    const rcvIdHint = rcvIdEnc ? decodeURIComponent(rcvIdEnc) : '';
    const invNoHint = invNoEnc ? decodeURIComponent(invNoEnc) : '';

    // 查找AR账款详情
    const arList = JSON.parse(sessionStorage.getItem('ARStatements') || '[]');
    const ar = arList.find(a => a.id === arId) || {};

    document.getElementById('wo_type').value    = 'AR';
    document.getElementById('wo_bill_id').value = arId;
    document.getElementById('wo_display_bill').textContent   = arId;
    document.getElementById('wo_display_party').textContent  = client;
    document.getElementById('wo_display_period').textContent = ar.period || '-';
    document.getElementById('wo_display_remain').textContent = '¥' + parseFloat(unverified).toLocaleString('zh-CN', { minimumFractionDigits: 2 });
    document.getElementById('wo_date').value    = new Date().toISOString().split('T')[0];
    document.getElementById('wo_remark').value  = '';

    // 填充关联收款单下拉（筛选同客户、有可用余额的已审核收款单）
    const rcvList = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    const matchRcv = rcvList.filter(r => {
        if (r.status !== '已审核') return false;
        const isForClient = r.customer === client ||
            (Array.isArray(r.details) && r.details.some(d => d.waybillNo === arId));
        if (!isForClient) return false;
        return _getRcvAvailableAmount(r.id) > 0;
    });
    const rcvSel = document.getElementById('wo_rcv_id');
    rcvSel.innerHTML = '<option value="">-- 无关联收款单（直接核销） --</option>' +
        matchRcv.map(r => {
            const avail = _getRcvAvailableAmount(r.id);
            const selected = r.id === rcvIdHint ? ' selected' : '';
            return `<option value="${r.id}"${selected}>${r.id}  可用¥${avail.toFixed(2)}  ${r.date}</option>`;
        }).join('');

    // 显示收款单可用余额提示
    const hint = document.getElementById('wo-rcv-hint');
    if (rcvIdHint && hint) {
        const avail = _getRcvAvailableAmount(rcvIdHint);
        if (avail > 0) {
            hint.style.display = 'block';
            hint.style.color = '#27ae60';
            hint.textContent = '可用余额：¥' + avail.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
        }
    } else if (hint) {
        hint.style.display = 'none';
    }

    // 显示该对账单（RC）对应的客户付款记录（SET）
    const allStmts = JSON.parse(sessionStorage.getItem('ARStatements') || '[]');
    const rcSets = allStmts.filter(a => a.fromSettlement === true && a.reconId === arId && !a.applied);
    const waybillSection = document.getElementById('wo-waybill-section');
    const waybillList = document.getElementById('wo-waybill-list');
    if (rcSets.length > 0) {
        waybillSection.style.display = 'block';
        const wbLabel = waybillSection.querySelector('label');
        if (wbLabel) {
            wbLabel.innerHTML = '选择本次核销的付款记录 <span style="font-weight:normal;color:#7f8c8d;font-size:12px;">（勾选客户提交的付款，金额自动合计）</span>';
        }
        waybillList.innerHTML = rcSets.map(s => {
            const amt = parseFloat((s.amount || '0').toString().replace(/,/g, '')) || 0;
            return `<label style="display:flex;align-items:center;gap:8px;padding:6px 4px;border-bottom:1px solid #eee;cursor:pointer;font-size:13px;">
                <input type="checkbox" value="${s.id}" data-amount="${amt.toFixed(2)}" checked onchange="window.onWoWaybillChange()">
                <span style="font-family:monospace;color:#27ae60;flex:1;">${s.id}</span>
                <span style="color:#7f8c8d;">${s.period || ''}</span>
                <span style="color:#2980b9;font-weight:bold;">¥${amt.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                ${s.receiptFile ? `<span style="color:#27ae60;font-size:11px;margin-left:4px;">📎 ${s.receiptFile}</span>` : ''}
            </label>`;
        }).join('');
        window.onWoWaybillChange();
    } else {
        waybillSection.style.display = 'none';
        document.getElementById('wo_amount').value = parseFloat(unverified).toFixed(2);
    }

    modal.style.display = 'flex';
};

// AP / Expense 使用原通用入口
window.openWriteOffModal = function (type, billId, counterparty, remainingAmount) {
    window._injectWriteOffModals();
    const modal = document.getElementById('wo-modal');
    if (!modal) return;

    document.getElementById('wo_type').value    = type;
    document.getElementById('wo_bill_id').value = billId;
    document.getElementById('wo_display_bill').textContent  = billId;
    document.getElementById('wo_display_party').textContent = counterparty;
    const displayPeriod = document.getElementById('wo_display_period');
    if (displayPeriod) displayPeriod.textContent = '';
    const displayRemain = document.getElementById('wo_display_remain');
    if (displayRemain) displayRemain.textContent = '¥' + parseFloat(remainingAmount).toLocaleString('zh-CN', { minimumFractionDigits: 2 });
    document.getElementById('wo_amount').value  = parseFloat(remainingAmount).toFixed(2);
    document.getElementById('wo_date').value    = new Date().toISOString().split('T')[0];
    document.getElementById('wo_remark').value  = '';

    // 隐藏运单选择区（AP/Expense不需要）
    const waybillSection = document.getElementById('wo-waybill-section');
    if (waybillSection) waybillSection.style.display = 'none';

    const hint = document.getElementById('wo-rcv-hint');
    if (hint) { hint.style.display = 'none'; hint.textContent = ''; }

    // 收款单下拉（AP场景：显示付款单，过滤已用完的）
    const rcvSel = document.getElementById('wo_rcv_id');
    if (type === 'AP') {
        const payList = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
        const match = payList.filter(r => {
            if (r.status !== '已审核') return false;
            if (r.vendor !== counterparty) return false;
            return _getRcvAvailableAmount(r.id) > 0;
        });
        rcvSel.innerHTML = '<option value="">-- 无关联付款单 --</option>' +
            match.map(r => {
                const avail = _getRcvAvailableAmount(r.id);
                return `<option value="${r.id}">${r.id}  可用¥${avail.toFixed(2)}  ${r.date}</option>`;
            }).join('');
    } else {
        rcvSel.innerHTML = '<option value="">-- 无关联收款单 --</option>';
    }

    modal.style.display = 'flex';
};

window.closeWriteOffModal = function () {
    const modal = document.getElementById('wo-modal');
    if (modal) modal.style.display = 'none';
};

// ============================================================
// 确认核销
// ============================================================

window.confirmWriteOff = function () {
    const type         = document.getElementById('wo_type').value;
    const primaryBillId= document.getElementById('wo_bill_id').value;
    const counterparty = document.getElementById('wo_display_party').textContent;
    const amount       = parseFloat(document.getElementById('wo_amount').value) || 0;
    const date         = document.getElementById('wo_date').value;
    const remark       = document.getElementById('wo_remark').value;
    const rcvId        = (document.getElementById('wo_rcv_id').value || '').trim();

    if (amount <= 0)  return alert('核销金额必须大于 0');
    if (!date)        return alert('请填写核销日期');

    // 收款单金额校验：核销金额不能超过收款单可用余额
    if (rcvId) {
        const available = _getRcvAvailableAmount(rcvId);
        if (available <= 0) {
            return alert('所选收款单可用余额为 ¥0，请重新选择收款单。');
        }
        if (amount > available + 0.005) {
            return alert(
                '核销失败：核销金额（¥' + amount.toFixed(2) + '）超过收款单可用余额（¥' + available.toFixed(2) + '）。\n\n' +
                '请调整核销金额或选择其他收款单。'
            );
        }
    }

    // 收集批量选择的AR ID（AR模式下）
    let selectedArIds = [];
    if (type === 'AR') {
        const checks = document.querySelectorAll('#wo-waybill-list input[type="checkbox"]:checked');
        checks.forEach(cb => selectedArIds.push(cb.value));
        if (selectedArIds.length === 0) {
            selectedArIds = [primaryBillId];
        }
    }

    const woId = _woGenerateId();

    // 凭证字号：AR→收，AP→付，Expense→转（用 let 允许模板覆盖）
    let voucherPrefix = type === 'AR' ? '收' : type === 'AP' ? '付' : '转';

    // 模板名称映射
    const tplNameMap = { AR: '应收核销', AP: '应付核销', Expense: '报销核销' };
    const tplName = tplNameMap[type] || '应收核销';

    // 生成会计凭证
    let voucherId = '';
    try {
        const summary = remark || (counterparty + ' 核销 ' + (selectedArIds.length > 1 ? selectedArIds.join(',') : primaryBillId));

        // ── 优先使用会计引擎自定义模板 ────────────────────────────────
        let tplStore = {};
        try { tplStore = JSON.parse(localStorage.getItem('EngineVoucherTemplates') || '{}'); } catch(e){}
        if (!tplStore[tplName]) {
            try { tplStore = JSON.parse(sessionStorage.getItem('EngineVoucherTemplates') || '{}'); } catch(e){}
        }
        const tpl = tplStore[tplName];

        let lines = [];
        if (tpl && tpl.entries && tpl.entries.length) {
            // 使用引擎模板生成分录
            // 计算借方合计和贷方条目数，处理含税科目的金额拆分
            const debitEntries  = tpl.entries.filter(e => e.dir === '借');
            const creditEntries = tpl.entries.filter(e => e.dir === '贷');
            // 检测是否有税金科目（科目代码以222开头，或科目名含"税"）
            const taxEntry = creditEntries.length > 1
                ? creditEntries.find(e => /^222/.test(e.subjectCode || '') || (e.subjectName || '').includes('税'))
                : null;
            const TAX_RATE = 0.09;
            const taxAmt  = taxEntry ? parseFloat((amount * TAX_RATE / (1 + TAX_RATE)).toFixed(2)) : 0;
            const netAmt  = taxEntry ? parseFloat((amount - taxAmt).toFixed(2)) : 0;

            lines = tpl.entries.map(e => {
                let entryAmt = amount; // 默认全额
                if (taxEntry) {
                    const isTax = e === taxEntry;
                    const isNonTaxCredit = e.dir === '贷' && !isTax;
                    if (isTax) entryAmt = taxAmt;
                    else if (isNonTaxCredit) entryAmt = netAmt;
                }
                return {
                    summary: e.summary || summary,
                    account: ((e.subjectCode || '') + ' ' + (e.subjectName || '')).trim(),
                    debit:   e.dir === '借' ? entryAmt.toFixed(2) : '',
                    credit:  e.dir === '贷' ? entryAmt.toFixed(2) : ''
                };
            });
            voucherPrefix = tpl.voucherWord || voucherPrefix;
        } else {
            // ── 降级：使用内置默认分录 ─────────────────────────────────
            const methods = JSON.parse(sessionStorage.getItem('ConfigPaymentMethods') || '[]');
            const pm = methods.find(m => m.subjectCode && m.subjectName) || { subjectCode: '1002', subjectName: '银行存款' };
            if (type === 'AR') {
                lines = [
                    { summary, account: pm.subjectCode + ' ' + pm.subjectName, debit: amount.toFixed(2), credit: '' },
                    { summary, account: '1122 应收账款',                        debit: '',              credit: amount.toFixed(2) }
                ];
            } else if (type === 'AP') {
                lines = [
                    { summary, account: '2202 应付账款',                        debit: amount.toFixed(2), credit: '' },
                    { summary, account: pm.subjectCode + ' ' + pm.subjectName, debit: '',              credit: amount.toFixed(2) }
                ];
            } else {
                lines = [
                    { summary, account: '6602 管理费用',                        debit: amount.toFixed(2), credit: '' },
                    { summary, account: pm.subjectCode + ' ' + pm.subjectName, debit: '',              credit: amount.toFixed(2) }
                ];
            }
        }

        voucherId = _woGenerateVoucherId(voucherPrefix);
        let vouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
        const waybillNoStr = type === 'AR' && selectedArIds.length > 0 ? selectedArIds.join(',') : '';
        vouchers.unshift({
            id: voucherId, date, amount: amount.toFixed(2),
            summary, user: '核销确认', status: '未审核',
            waybillNo: waybillNoStr,
            lines, sourceType: 'WriteOff', sourceId: woId
        });
        sessionStorage.setItem('ManualVouchers', JSON.stringify(vouchers));
    } catch (e) {
        console.warn('核销凭证生成失败:', e);
    }

    // 保存核销记录（billId 记录所有批量选中的AR，逗号分隔）
    const billIdStr = type === 'AR' && selectedArIds.length > 0 ? selectedArIds.join(',') : primaryBillId;
    const woRecord = {
        id: woId, type,
        billId: billIdStr,
        rcvId, counterparty,
        writeOffAmount: amount.toFixed(2), date,
        remark, voucherId, status: '已核销',
        createdAt: new Date().toISOString()
    };
    let woList = JSON.parse(sessionStorage.getItem('WriteOffRecords') || '[]');
    woList.unshift(woRecord);
    sessionStorage.setItem('WriteOffRecords', JSON.stringify(woList));

    // 更新 CustomerRecons RC对账单状态（部分核销/已核销）
    if (type === 'AR') {
        const rcId = primaryBillId;
        let recons = JSON.parse(sessionStorage.getItem('CustomerRecons') || '[]');
        const rcEntry = recons.find(r => r.id === rcId);
        if (rcEntry) {
            const allWOsNow = JSON.parse(sessionStorage.getItem('WriteOffRecords') || '[]');
            const totalApplied = allWOsNow.filter(w => w.billId === rcId)
                .reduce((s, w) => s + parseFloat(w.writeOffAmount || '0'), 0);
            const rcTotal = parseFloat((rcEntry.amount || '0').toString().replace(/[¥,\s]/g, '')) || 0;
            rcEntry.status = totalApplied >= rcTotal - 0.005 ? '已核销' : '部分核销';
            sessionStorage.setItem('CustomerRecons', JSON.stringify(recons));
        }
        // 标记已核销的SET付款记录
        let arStmts = JSON.parse(sessionStorage.getItem('ARStatements') || '[]');
        let stmtChanged = false;
        selectedArIds.forEach(setId => {
            const s = arStmts.find(a => a.id === setId);
            if (s) { s.applied = true; stmtChanged = true; }
        });
        if (stmtChanged) sessionStorage.setItem('ARStatements', JSON.stringify(arStmts));
    }

    // 更新应收账款台账（按比例分配到各AR，或各自按全额写销）
    if (type === 'AR' && selectedArIds.length > 0) {
        if (selectedArIds.length === 1) {
            _updateARStatementByArId(selectedArIds[0], amount);
        } else {
            // 多AR：计算各AR的未核销金额，按比例分配核销金额
            const arList = JSON.parse(sessionStorage.getItem('ARStatements') || '[]');
            let totalUnverified = 0;
            const arAmounts = {};
            selectedArIds.forEach(id => {
                const a = arList.find(x => x.id === id);
                const unv = a ? parseFloat((a.unverified || a.amount || '0').toString().replace(/,/g, '')) || 0 : 0;
                arAmounts[id] = unv;
                totalUnverified += unv;
            });
            if (totalUnverified > 0) {
                let remaining = amount;
                selectedArIds.forEach((id, idx) => {
                    const isLast = idx === selectedArIds.length - 1;
                    const share = isLast ? remaining : Math.min(parseFloat((amount * arAmounts[id] / totalUnverified).toFixed(2)), arAmounts[id]);
                    _updateARStatementByArId(id, share);
                    remaining -= share;
                });
            }
        }
    }

    // 更新 BizWaybills 核销状态
    if (type === 'AR' && selectedArIds.length > 0) {
        const rcId = primaryBillId;
        let waybills = JSON.parse(sessionStorage.getItem('BizWaybills') || '[]');
        let wbChanged = false;
        // 标记 SET 关联运单（arSettlementId 匹配）
        selectedArIds.forEach(setId => {
            waybills.forEach(w => {
                if (w.arSettlementId === setId) {
                    w.writeOffStatus = '已核销';
                    wbChanged = true;
                }
            });
        });
        // 若 RC 已全额核销，同时标记所有 RC 运单
        const reconsList = JSON.parse(sessionStorage.getItem('CustomerRecons') || '[]');
        const rcRec = reconsList.find(r => r.id === rcId);
        if (rcRec && rcRec.status === '已核销') {
            waybills.forEach(w => {
                if (w.reconId === rcId) {
                    w.writeOffStatus = '已核销';
                    wbChanged = true;
                }
            });
        }
        if (wbChanged) sessionStorage.setItem('BizWaybills', JSON.stringify(waybills));
    }

    if (typeof addAuditLog === 'function') {
        addAuditLog({
            level: '低风险', time: new Date().toLocaleString(), user: '当前用户',
            module: type === 'AR' ? '应收核销' : type === 'AP' ? '应付核销' : '报销核销',
            action: '核销确认',
            detail: '核销单号:' + woId + ', 来源账款:' + billIdStr +
                (rcvId ? ', 收款单:' + rcvId : '') +
                ', 金额:' + amount.toFixed(2)
        });
    }

    const arCountDesc = type === 'AR' && selectedArIds.length > 1 ? '\n核销运单数：' + selectedArIds.length + ' 条' : '';

    alert('✅ 核销成功！\n核销单号：' + woId +
        '\n核销金额：¥' + amount.toFixed(2) + arCountDesc +
        (voucherId ? '\n已生成凭证：' + voucherId : ''));

    window.closeWriteOffModal();
    const moduleMap = { AR: 'ARWriteOff', AP: 'APWriteOff', Expense: 'ExpenseWriteOff' };
    if (typeof loadContent === 'function') loadContent(moduleMap[type] || 'ARWriteOff');
};

// ============================================================
// 补录发票关联
// ============================================================

window.openLinkInvoiceModal = function (woId, woType) {
    window._injectWriteOffModals();
    const modal = document.getElementById('link-inv-modal');
    if (!modal) return;

    document.getElementById('link_wo_id').value   = woId;
    document.getElementById('link_wo_type').value = woType;

    const outputInvoices = JSON.parse(sessionStorage.getItem('OutputInvoices') || '[]');
    const inputInvoices  = JSON.parse(sessionStorage.getItem('InputInvoices')  || '[]');
    let available = woType === 'AP'
        ? inputInvoices.filter(i => i.status !== '已核销')
        : outputInvoices.filter(i => i.status === '已开票');

    const sel = document.getElementById('link_inv_no');
    sel.innerHTML = '<option value="">-- 请选择发票 --</option>' +
        available.map(i => {
            const no = i.no || i.number || i.id;
            return `<option value="${no}">${no}  ${i.client || i.supplier || ''}  ¥${i.total || i.amount || ''}</option>`;
        }).join('');

    modal.style.display = 'flex';
};

window.confirmLinkInvoice = function () {
    const woId      = document.getElementById('link_wo_id').value;
    const woType    = document.getElementById('link_wo_type').value;
    const invoiceNo = document.getElementById('link_inv_no').value;

    if (!invoiceNo) return alert('请选择要关联的发票');

    let woList = JSON.parse(sessionStorage.getItem('WriteOffRecords') || '[]');
    const wo   = woList.find(w => w.id === woId);
    if (!wo) return alert('核销记录不存在');

    wo.invoiceNo     = invoiceNo;
    wo.invoiceStatus = '已关联';
    sessionStorage.setItem('WriteOffRecords', JSON.stringify(woList));

    _updateInvoiceWriteOffStatus(woType, invoiceNo);

    document.getElementById('link-inv-modal').style.display = 'none';
    alert('✅ 已成功关联发票 ' + invoiceNo + '，补票操作完成！');

    const moduleMap = { AR: 'ARWriteOff', AP: 'APWriteOff', Expense: 'ExpenseWriteOff' };
    if (typeof loadContent === 'function') loadContent(moduleMap[woType] || 'ARWriteOff');
};

// ============================================================
// 内部工具
// ============================================================

function _updateInvoiceWriteOffStatus(type, invoiceNo) {
    if (type === 'AP') {
        let invoices = JSON.parse(sessionStorage.getItem('InputInvoices') || '[]');
        const inv = invoices.find(i => (i.no || i.number || i.id) === invoiceNo);
        if (inv) { inv.status = '已核销'; sessionStorage.setItem('InputInvoices', JSON.stringify(invoices)); }
    } else {
        let invoices = JSON.parse(sessionStorage.getItem('OutputInvoices') || '[]');
        const inv = invoices.find(i => i.no === invoiceNo);
        if (inv) { inv.status = '已核销'; sessionStorage.setItem('OutputInvoices', JSON.stringify(invoices)); }
    }
}

/**
 * 按 AR 账款 ID 直接更新应收账款台账余额
 */
function _updateARStatementByArId(arId, amount) {
    let arList = JSON.parse(sessionStorage.getItem('ARStatements') || '[]');
    const ar = arList.find(a => a.id === arId);
    if (!ar) return;

    const unverified = parseFloat((ar.unverified || ar.amount || '0').toString().replace(/,/g, '')) || 0;
    const verified   = parseFloat((ar.verified   || '0').toString().replace(/,/g, '')) || 0;
    const toVerify   = Math.min(unverified, amount);

    ar.verified   = (verified + toVerify).toFixed(2);
    ar.unverified = Math.max(unverified - toVerify, 0).toFixed(2);
    ar.status     = parseFloat(ar.unverified) <= 0 ? '已结算' : '部分结算';

    sessionStorage.setItem('ARStatements', JSON.stringify(arList));
}
