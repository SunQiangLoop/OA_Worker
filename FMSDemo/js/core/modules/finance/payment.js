// js/core/modules/finance/payment.js
// 收款单 / 付款单 业务逻辑模块

// ============================================================
// 工具函数
// ============================================================

function _pmEsc(v) {
    return String(v == null ? "" : v)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function _pmFmt(amount) {
    const n = parseFloat(amount);
    if (isNaN(n)) return "0.00";
    return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function _pmStatusBadge(s) {
    const map = { '草稿': '#95a5a6', '待审核': '#e67e22', '已审核': '#27ae60' };
    const color = map[s] || '#bdc3c7';
    return `<span style="background:${color};color:#fff;padding:2px 8px;border-radius:10px;font-size:11px;">${_pmEsc(s)}</span>`;
}

// ============================================================
// 收款单 (ReceiptVoucher) 业务逻辑
// ============================================================

window.generateReceiptId = function () {
    const list = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    const re = /^RCV-(\d+)$/;
    let max = 0;
    list.forEach(r => {
        const m = (r.id || '').match(re);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return 'RCV-' + String(max + 1).padStart(4, '0');
};

window.openReceiptForm = function (id) {
    const modal = document.getElementById('receipt-modal');
    if (!modal) return;
    const titleEl = document.getElementById('rcv-modal-title');

    if (id) {
        const list = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
        const rec = list.find(r => r.id === id);
        if (!rec) return;
        if (titleEl) titleEl.textContent = '编辑收款单';
        document.getElementById('rcv-id').value = rec.id;
        document.getElementById('rcv-customer').value = rec.customer || '';
        document.getElementById('rcv-date').value = rec.date || '';
        document.getElementById('rcv-method').value = rec.payMethod || '银行转账';
        document.getElementById('rcv-total').value = rec.totalAmount || '';
        document.getElementById('rcv-summary').value = rec.summary || '';
        window._rcvDetails = JSON.parse(JSON.stringify(rec.details || []));
    } else {
        if (titleEl) titleEl.textContent = '新建收款单';
        document.getElementById('rcv-id').value = window.generateReceiptId();
        document.getElementById('rcv-customer').value = '';
        document.getElementById('rcv-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('rcv-method').value = '银行转账';
        document.getElementById('rcv-total').value = '';
        document.getElementById('rcv-summary').value = '';
        window._rcvDetails = [];
    }
    window.renderReceiptDetails();
    modal.style.display = 'flex';
};

window.closeReceiptModal = function () {
    const modal = document.getElementById('receipt-modal');
    if (modal) modal.style.display = 'none';
};

window.renderReceiptDetails = function () {
    const tbody = document.getElementById('rcv-detail-body');
    if (!tbody) return;
    const details = window._rcvDetails || [];
    if (details.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#aaa;padding:18px;">暂无运单明细，点击下方"添加运单"</td></tr>`;
        return;
    }
    tbody.innerHTML = details.map((d, i) => `
        <tr>
            <td><input type="text" value="${_pmEsc(d.waybillNo || '')}"
                oninput="window._rcvDetails[${i}].waybillNo=this.value"
                placeholder="运单号" style="width:130px;padding:5px;border:1px solid #dde3ea;border-radius:4px;"></td>
            <td><input type="number" value="${d.arAmount || ''}"
                oninput="window._rcvDetails[${i}].arAmount=parseFloat(this.value)||0"
                placeholder="应收金额" style="width:110px;padding:5px;border:1px solid #dde3ea;border-radius:4px;text-align:right;"></td>
            <td><input type="number" value="${d.recvAmount || ''}"
                oninput="window._rcvDetails[${i}].recvAmount=parseFloat(this.value)||0;window.calcReceiptTotal()"
                placeholder="本次收款" style="width:110px;padding:5px;border:1px solid #dde3ea;border-radius:4px;text-align:right;"></td>
            <td style="text-align:center;">
                <button onclick="window.removeReceiptDetail(${i})"
                    style="padding:3px 8px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;">删除</button>
            </td>
        </tr>
    `).join('');
};

window.addReceiptDetail = function () {
    if (!window._rcvDetails) window._rcvDetails = [];
    window._rcvDetails.push({ waybillNo: '', arAmount: '', recvAmount: '' });
    window.renderReceiptDetails();
};

window.removeReceiptDetail = function (index) {
    window._rcvDetails.splice(index, 1);
    window.renderReceiptDetails();
    window.calcReceiptTotal();
};

window.calcReceiptTotal = function () {
    const details = window._rcvDetails || [];
    const total = details.reduce((sum, d) => sum + (parseFloat(d.recvAmount) || 0), 0);
    if (total > 0) {
        const el = document.getElementById('rcv-total');
        if (el) el.value = total.toFixed(2);
    }
};

window.saveReceipt = function () {
    const id = (document.getElementById('rcv-id').value || '').trim();
    const customer = (document.getElementById('rcv-customer').value || '').trim();
    const date = (document.getElementById('rcv-date').value || '').trim();
    const payMethod = (document.getElementById('rcv-method').value || '').trim();
    const totalAmountRaw = (document.getElementById('rcv-total').value || '').trim();
    const summary = (document.getElementById('rcv-summary').value || '').trim();

    if (!customer) return alert('请填写客户名称');
    if (!totalAmountRaw || parseFloat(totalAmountRaw) <= 0) return alert('请填写有效的收款金额');

    const totalAmount = parseFloat(totalAmountRaw).toFixed(2);
    const details = (window._rcvDetails || []).filter(d => d.waybillNo || parseFloat(d.recvAmount) > 0);

    let list = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    const existing = list.find(r => r.id === id);
    const rec = {
        id,
        customer,
        date,
        payMethod,
        totalAmount,
        summary,
        details,
        status: existing ? existing.status : '草稿',
        relatedVoucherId: existing ? (existing.relatedVoucherId || '') : '',
        createdAt: existing ? existing.createdAt : new Date().toISOString()
    };

    if (existing) {
        Object.assign(existing, rec);
    } else {
        list.unshift(rec);
    }

    sessionStorage.setItem('ReceiptVouchers', JSON.stringify(list));

    if (typeof addAuditLog === 'function') {
        addAuditLog({
            level: '低风险', time: new Date().toLocaleString(), user: '当前用户',
            module: '收款单', action: existing ? '编辑' : '新建',
            detail: `单号:${id}, 客户:${customer}, 金额:${totalAmount}`
        });
    }

    window.closeReceiptModal();
    loadContent('ReceiptVoucher');
};

window.submitReceiptForReview = function (id) {
    let list = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    const rec = list.find(r => r.id === id);
    if (!rec) return;
    if (rec.status !== '草稿') return alert('只有草稿状态的收款单可以提交审核');
    rec.status = '待审核';
    sessionStorage.setItem('ReceiptVouchers', JSON.stringify(list));
    loadContent('ReceiptVoucher');
};

window.approveReceipt = function (id) {
    if (!confirm(`确认审核通过收款单 ${id}？`)) return;
    let list = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    const rec = list.find(r => r.id === id);
    if (!rec) return;
    rec.status = '已审核';
    sessionStorage.setItem('ReceiptVouchers', JSON.stringify(list));
    loadContent('ReceiptVoucher');
};

window.generateReceiptVoucher = function (id) {
    let list = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    const rec = list.find(r => r.id === id);
    if (!rec) return;
    if (!['待审核', '已审核'].includes(rec.status)) {
        return alert('请先提交审核，再生成凭证');
    }
    if (rec.relatedVoucherId) {
        return alert(`已关联凭证：${rec.relatedVoucherId}`);
    }

    if (typeof window.generateVoucherFromEngineTemplate !== 'function') {
        return alert('会计引擎未加载，请刷新页面');
    }

    const result = window.generateVoucherFromEngineTemplate('收款单', {
        type: '收款单',
        date: rec.date,
        amount: rec.totalAmount,
        client: rec.customer,
        clientName: rec.customer,
        id: rec.id,
        summary: `${rec.customer} 收款 ${rec.id}`
    });

    if (result && result.success) {
        rec.relatedVoucherId = result.voucherId;
        sessionStorage.setItem('ReceiptVouchers', JSON.stringify(list));
        alert(`✅ 凭证已生成：${result.voucherId}\n请前往凭证审核中心审核`);
        loadContent('ReceiptVoucher');
    } else {
        alert('❌ 生成失败：未找到"收款单"映射模板\n请先在【会计引擎 → 收付款单 → 收款单】中配置分录模板');
    }
};

window.deleteReceipt = function (id) {
    if (!confirm(`确认删除收款单 ${id}？此操作不可恢复。`)) return;
    let list = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
    list = list.filter(r => r.id !== id);
    sessionStorage.setItem('ReceiptVouchers', JSON.stringify(list));
    loadContent('ReceiptVoucher');
};

// ============================================================
// 付款单 (PaymentVoucher) 业务逻辑
// ============================================================

window.generatePaymentId = function () {
    const list = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
    const re = /^PAY-(\d+)$/;
    let max = 0;
    list.forEach(r => {
        const m = (r.id || '').match(re);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return 'PAY-' + String(max + 1).padStart(4, '0');
};

window.openPaymentForm = function (id) {
    const modal = document.getElementById('payment-modal');
    if (!modal) return;
    const titleEl = document.getElementById('pay-modal-title');

    if (id) {
        const list = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
        const rec = list.find(r => r.id === id);
        if (!rec) return;
        if (titleEl) titleEl.textContent = '编辑付款单';
        document.getElementById('pay-id').value = rec.id;
        document.getElementById('pay-vendor').value = rec.vendor || '';
        document.getElementById('pay-vendortype').value = rec.vendorType || '承运商';
        document.getElementById('pay-date').value = rec.date || '';
        document.getElementById('pay-method').value = rec.payMethod || '银行转账';
        document.getElementById('pay-total').value = rec.totalAmount || '';
        document.getElementById('pay-summary').value = rec.summary || '';
        window._payDetails = JSON.parse(JSON.stringify(rec.details || []));
    } else {
        if (titleEl) titleEl.textContent = '新建付款单';
        document.getElementById('pay-id').value = window.generatePaymentId();
        document.getElementById('pay-vendor').value = '';
        document.getElementById('pay-vendortype').value = '承运商';
        document.getElementById('pay-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('pay-method').value = '银行转账';
        document.getElementById('pay-total').value = '';
        document.getElementById('pay-summary').value = '';
        window._payDetails = [];
    }
    window.renderPaymentDetails();
    modal.style.display = 'flex';
};

window.closePaymentModal = function () {
    const modal = document.getElementById('payment-modal');
    if (modal) modal.style.display = 'none';
};

window.renderPaymentDetails = function () {
    const tbody = document.getElementById('pay-detail-body');
    if (!tbody) return;
    const details = window._payDetails || [];
    if (details.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#aaa;padding:18px;">暂无单据明细，点击下方"添加明细"</td></tr>`;
        return;
    }
    tbody.innerHTML = details.map((d, i) => `
        <tr>
            <td><input type="text" value="${_pmEsc(d.billNo || '')}"
                oninput="window._payDetails[${i}].billNo=this.value"
                placeholder="运单号/批次号" style="width:130px;padding:5px;border:1px solid #dde3ea;border-radius:4px;"></td>
            <td><input type="number" value="${d.apAmount || ''}"
                oninput="window._payDetails[${i}].apAmount=parseFloat(this.value)||0"
                placeholder="应付金额" style="width:110px;padding:5px;border:1px solid #dde3ea;border-radius:4px;text-align:right;"></td>
            <td><input type="number" value="${d.payAmount || ''}"
                oninput="window._payDetails[${i}].payAmount=parseFloat(this.value)||0;window.calcPaymentTotal()"
                placeholder="本次付款" style="width:110px;padding:5px;border:1px solid #dde3ea;border-radius:4px;text-align:right;"></td>
            <td style="text-align:center;">
                <button onclick="window.removePaymentDetail(${i})"
                    style="padding:3px 8px;background:#e74c3c;color:#fff;border:none;border-radius:4px;cursor:pointer;">删除</button>
            </td>
        </tr>
    `).join('');
};

window.addPaymentDetail = function () {
    if (!window._payDetails) window._payDetails = [];
    window._payDetails.push({ billNo: '', apAmount: '', payAmount: '' });
    window.renderPaymentDetails();
};

window.removePaymentDetail = function (index) {
    window._payDetails.splice(index, 1);
    window.renderPaymentDetails();
    window.calcPaymentTotal();
};

window.calcPaymentTotal = function () {
    const details = window._payDetails || [];
    const total = details.reduce((sum, d) => sum + (parseFloat(d.payAmount) || 0), 0);
    if (total > 0) {
        const el = document.getElementById('pay-total');
        if (el) el.value = total.toFixed(2);
    }
};

window.savePayment = function () {
    const id = (document.getElementById('pay-id').value || '').trim();
    const vendor = (document.getElementById('pay-vendor').value || '').trim();
    const vendorType = (document.getElementById('pay-vendortype').value || '').trim();
    const date = (document.getElementById('pay-date').value || '').trim();
    const payMethod = (document.getElementById('pay-method').value || '').trim();
    const totalAmountRaw = (document.getElementById('pay-total').value || '').trim();
    const summary = (document.getElementById('pay-summary').value || '').trim();

    if (!vendor) return alert('请填写付款对象');
    if (!totalAmountRaw || parseFloat(totalAmountRaw) <= 0) return alert('请填写有效的付款金额');

    const totalAmount = parseFloat(totalAmountRaw).toFixed(2);
    const details = (window._payDetails || []).filter(d => d.billNo || parseFloat(d.payAmount) > 0);

    let list = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
    const existing = list.find(r => r.id === id);
    const rec = {
        id,
        vendor,
        vendorType,
        date,
        payMethod,
        totalAmount,
        summary,
        details,
        status: existing ? existing.status : '草稿',
        relatedVoucherId: existing ? (existing.relatedVoucherId || '') : '',
        createdAt: existing ? existing.createdAt : new Date().toISOString()
    };

    if (existing) {
        Object.assign(existing, rec);
    } else {
        list.unshift(rec);
    }

    sessionStorage.setItem('PaymentVouchers', JSON.stringify(list));

    if (typeof addAuditLog === 'function') {
        addAuditLog({
            level: '低风险', time: new Date().toLocaleString(), user: '当前用户',
            module: '付款单', action: existing ? '编辑' : '新建',
            detail: `单号:${id}, 对象:${vendor}(${vendorType}), 金额:${totalAmount}`
        });
    }

    window.closePaymentModal();
    loadContent('PaymentVoucher');
};

window.submitPaymentForReview = function (id) {
    let list = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
    const rec = list.find(r => r.id === id);
    if (!rec) return;
    if (rec.status !== '草稿') return alert('只有草稿状态的付款单可以提交审核');
    rec.status = '待审核';
    sessionStorage.setItem('PaymentVouchers', JSON.stringify(list));
    loadContent('PaymentVoucher');
};

window.approvePayment = function (id) {
    if (!confirm(`确认审核通过付款单 ${id}？`)) return;
    let list = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
    const rec = list.find(r => r.id === id);
    if (!rec) return;
    rec.status = '已审核';
    sessionStorage.setItem('PaymentVouchers', JSON.stringify(list));
    loadContent('PaymentVoucher');
};

window.generatePaymentVoucher = function (id) {
    let list = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
    const rec = list.find(r => r.id === id);
    if (!rec) return;
    if (!['待审核', '已审核'].includes(rec.status)) {
        return alert('请先提交审核，再生成凭证');
    }
    if (rec.relatedVoucherId) {
        return alert(`已关联凭证：${rec.relatedVoucherId}`);
    }

    if (typeof window.generateVoucherFromEngineTemplate !== 'function') {
        return alert('会计引擎未加载，请刷新页面');
    }

    const result = window.generateVoucherFromEngineTemplate('付款单', {
        type: '付款单',
        date: rec.date,
        amount: rec.totalAmount,
        client: rec.vendor,
        clientName: rec.vendor,
        id: rec.id,
        summary: `${rec.vendor} 付款 ${rec.id}`
    });

    if (result && result.success) {
        rec.relatedVoucherId = result.voucherId;
        sessionStorage.setItem('PaymentVouchers', JSON.stringify(list));
        alert(`✅ 凭证已生成：${result.voucherId}\n请前往凭证审核中心审核`);
        loadContent('PaymentVoucher');
    } else {
        alert('❌ 生成失败：未找到"付款单"映射模板\n请先在【会计引擎 → 收付款单 → 付款单】中配置分录模板');
    }
};

window.deletePayment = function (id) {
    if (!confirm(`确认删除付款单 ${id}？此操作不可恢复。`)) return;
    let list = JSON.parse(sessionStorage.getItem('PaymentVouchers') || '[]');
    list = list.filter(r => r.id !== id);
    sessionStorage.setItem('PaymentVouchers', JSON.stringify(list));
    loadContent('PaymentVoucher');
};
