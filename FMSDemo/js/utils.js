// js/utils.js

// --- 全局变量 ---
var g_currentVoucher = null;
var g_currentInvoice = null;
var g_currentRecon = null;
var g_isClosingReady = false;

// --- 凭证数据：仅在当前会话保留（刷新不丢，关闭/重新打开会丢） ---
function getManualVouchers() {
    const raw = sessionStorage.getItem('ManualVouchers') || "[]";
    try {
        const list = JSON.parse(raw);
        return Array.isArray(list) ? list : [];
    } catch (error) {
        return [];
    }
}

function saveManualVouchers(list) {
    const payload = JSON.stringify(list || []);
    sessionStorage.setItem('ManualVouchers', payload);
}

// --- 凭证号生成：统一使用 前缀-0001 形式 ---
function getNextVoucherSeqStrict(word) {
    const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const prefix = (word || "记").toString();
    let maxSeq = 0;
    list.forEach(v => {
        const id = (v.id || "").toString().trim();
        const match = id.match(new RegExp(`^${prefix}-\\d+$`));
        if (!match) return;
        const parts = id.split("-");
        const seq = parseInt(parts[1], 10);
        if (Number.isFinite(seq) && seq > maxSeq) maxSeq = seq;
    });
    return maxSeq + 1;
}

function generateSequentialVoucherId(word) {
    const seq = typeof window.getNextVoucherSeqStrict === "function"
        ? window.getNextVoucherSeqStrict(word)
        : getNextVoucherSeqStrict(word);
    if (typeof window.formatVoucherId === "function") {
        return window.formatVoucherId(word, seq);
    }
    const prefix = (word || "记").toString();
    return `${prefix}-${String(seq).padStart(4, "0")}`;
}

window.getNextVoucherSeqStrict = getNextVoucherSeqStrict;
window.generateSequentialVoucherId = generateSequentialVoucherId;
window.getManualVouchers = getManualVouchers;
window.saveManualVouchers = saveManualVouchers;

/**
 * 初始化演示凭证数据
 * 若 ManualVouchers 为空，且种子数据文件已加载（__voucherSeedRows），
 * 则自动将种子凭证写入 sessionStorage，保证期末结转有数据可操作。
 */
function initVouchersFromSeed() {
    try {
        const existing = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
        const seed = Array.isArray(window.__voucherSeedRows) ? window.__voucherSeedRows : [];
        if (existing.length === 0 && seed.length > 0) {
            sessionStorage.setItem('ManualVouchers', JSON.stringify(seed));
            console.log('[系统] 已加载演示凭证种子数据，共', seed.length, '张凭证。');
        }
    } catch (e) {
        console.warn('[系统] 加载凭证种子数据失败：', e);
    }
}
// 页面加载完成后立即执行（DOMContentLoaded 之前 script 都已执行，延迟 0ms 确保 seed 文件已加载）
setTimeout(initVouchersFromSeed, 0);

/**
 * 当前登录会话信息（可由登录模块覆写）
 * ip 与 ipLocation 在真实系统中应由服务端下发；此处为演示用模拟值。
 */
window.CURRENT_SESSION = window.CURRENT_SESSION || {
    company:    '广州顺达物流科技有限公司',
    ip:         '112.96.18.47',
    ipLocation: '广东省·广州市·天河区'
};

/** 核心辅助：追加【数据变更】日志 */
function addDataChangeLog(changeLog) {
    let logs = JSON.parse(sessionStorage.getItem('GlobalDataChangeLogs') || "[]");
    // 自动补充公司和IP信息
    if (!changeLog.company)    changeLog.company    = (window.CURRENT_SESSION || {}).company    || '';
    if (!changeLog.ip)         changeLog.ip         = (window.CURRENT_SESSION || {}).ip         || '';
    if (!changeLog.ipLocation) changeLog.ipLocation = (window.CURRENT_SESSION || {}).ipLocation || '';
    logs.unshift(changeLog);
    sessionStorage.setItem('GlobalDataChangeLogs', JSON.stringify(logs));
}

/** 核心辅助：追加审计日志（自动注入所属公司、IP 及归属地） */
function addAuditLog(newLog) {
    let logs = JSON.parse(sessionStorage.getItem('GlobalAuditLogs') || "[]");
    // 自动补充公司和IP信息（调用方也可显式传入以覆盖）
    if (!newLog.company)    newLog.company    = (window.CURRENT_SESSION || {}).company    || '';
    if (!newLog.ip)         newLog.ip         = (window.CURRENT_SESSION || {}).ip         || '';
    if (!newLog.ipLocation) newLog.ipLocation = (window.CURRENT_SESSION || {}).ipLocation || '';
    logs.unshift(newLog);
    sessionStorage.setItem('GlobalAuditLogs', JSON.stringify(logs));
}

/** 辅助：生成表格行 */
function generateTableRows(count, rowGenerator) {
    let rows = '';
    for (let i = 1; i <= count; i++) {
        rows += rowGenerator(i);
    }
    return rows;
}

/** 辅助：数字转中文大写金额 */
function numberToChinese(money) {
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const cnIntRadice = ['', '拾', '佰', '仟'];
    const cnIntUnits = ['', '万', '亿', '兆'];
    const cnDecUnits = ['角', '分'];
    const cnInteger = '整';
    const cnIntLast = '圆';
    const maxNum = 999999999999.99;

    money = parseFloat(money);
    if (money >= maxNum) return '金额过大';
    if (money === 0) return cnNums[0] + cnIntLast + cnInteger;

    let chineseStr = '';
    let integerNum = Math.floor(money);
    let decimalNum = Math.round((money - integerNum) * 100);

    if (integerNum > 0) {
        let zeroCount = 0;
        let intLen = integerNum.toString().length;
        for (let i = 0; i < intLen; i++) {
            let n = integerNum.toString().substr(i, 1);
            let p = intLen - i - 1;
            let q = p / 4;
            let m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) chineseStr += cnNums[0];
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) chineseStr += cnIntUnits[q];
        }
        chineseStr += cnIntLast;
    }

    if (decimalNum > 0) {
        let jiao = Math.floor(decimalNum / 10);
        let fen = decimalNum % 10;
        if (jiao > 0) chineseStr += cnNums[jiao] + cnDecUnits[0];
        if (fen > 0) chineseStr += cnNums[fen] + cnDecUnits[1];
    } else {
        chineseStr += cnInteger;
    }
    return chineseStr;
}

// =========================================================================
// ★★★ 全局帐套管理工具函数 ★★★
// =========================================================================

/** 随帐套切换一起保存/恢复的 sessionStorage 键列表 */
window._ACCT_SNAPSHOT_KEYS = [
    'ManualVouchers', 'AcctSubjects', 'OpeningBalances',
    'PeriodEndClosingHistory', 'TaxAccrualRules', 'AccountingStandard',
    'EngineMappings', 'AutoVoucherTemplates', 'AuxiliaryItems',
    'AcctAuxiliary', 'FinanceAccountPeriods'
];

/** 把当前全局数据保存到当前帐套的快照 */
window.saveCurrentAcctSetSnapshot = function() {
    const code = sessionStorage.getItem('CurrentAcctSetCode');
    if (!code) return;
    const snapshot = {};
    window._ACCT_SNAPSHOT_KEYS.forEach(k => {
        const v = sessionStorage.getItem(k);
        if (v !== null) snapshot[k] = v;
    });
    sessionStorage.setItem('AcctSetData_' + code, JSON.stringify(snapshot));
};

/** 从快照恢复指定帐套数据到全局 sessionStorage，返回 true/false */
window.loadAcctSetSnapshot = function(code) {
    const raw = sessionStorage.getItem('AcctSetData_' + code);
    if (!raw) return false;
    try {
        const snap = JSON.parse(raw);
        window._ACCT_SNAPSHOT_KEYS.forEach(k => sessionStorage.removeItem(k));
        Object.entries(snap).forEach(([k, v]) => { if (v !== undefined) sessionStorage.setItem(k, v); });
        return true;
    } catch (e) { return false; }
};

/** 初始化新帐套：按会计准则写入默认科目，其余数据全部清空 */
window.initAcctSetData = function(code, principle) {
    // ACCOUNTING_STANDARD_TEMPLATES 在 view_manager.js 中定义，此函数在用户操作时调用，届时已加载
    const stdKey = (principle === '小企业准则') ? 'small' : 'enterprise';
    let subjects = [];
    try {
        if (typeof ACCOUNTING_STANDARD_TEMPLATES !== 'undefined') {
            subjects = ACCOUNTING_STANDARD_TEMPLATES[stdKey] || [];
        }
    } catch (e) { subjects = []; }

    const snap = {
        ManualVouchers:          '[]',
        AcctSubjects:            JSON.stringify(subjects),
        OpeningBalances:         '[]',
        PeriodEndClosingHistory: '[]',
        AccountingStandard:      stdKey
    };
    sessionStorage.setItem('AcctSetData_' + code, JSON.stringify(snap));
};

/** 切换全局帐套：保存当前 → 加载新帐套 → 更新标识 → 刷新界面 */
window.switchAcctSet = function(newCode, newNameRaw) {
    if (!newCode) return;
    const newName = (newNameRaw || '').replace('（已停用）', '').trim();
    const currentCode = sessionStorage.getItem('CurrentAcctSetCode');
    if (currentCode === newCode) return;

    // 1. 保存当前帐套数据
    if (currentCode) {
        window.saveCurrentAcctSetSnapshot();
    } else {
        // 首次切换（无当前帐套）：若目标帐套快照为空，把当前全局数据（含种子凭证）存入
        const targetSnapRaw = sessionStorage.getItem('AcctSetData_' + newCode);
        const targetSnap = targetSnapRaw ? JSON.parse(targetSnapRaw) : {};
        const targetVouchers = JSON.parse(targetSnap.ManualVouchers || '[]');
        const currentVouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
        if (targetVouchers.length === 0 && currentVouchers.length > 0) {
            const snap = {};
            window._ACCT_SNAPSHOT_KEYS.forEach(k => {
                const v = sessionStorage.getItem(k);
                if (v !== null) snap[k] = v;
            });
            sessionStorage.setItem('AcctSetData_' + newCode, JSON.stringify(snap));
        }
    }

    // 2. 加载新帐套快照
    const loaded = window.loadAcctSetSnapshot(newCode);
    if (!loaded) {
        alert('帐套「' + newName + '」数据快照不存在，请先在帐套管理中启用该帐套以完成初始化。');
        window.updateGlobalAcctSetSelector();
        return;
    }

    // 3. 更新当前帐套标识
    sessionStorage.setItem('CurrentAcctSetCode', newCode);
    sessionStorage.setItem('CurrentAcctSetName', newName);

    // 4. 更新帐套选择器（含页面内的下拉）
    window.updateGlobalAcctSetSelector();
};

/** 重建 header 中全局帐套选择器的 options，并同步显示当前帐套名 */
window.updateGlobalAcctSetSelector = function() {
    const sel = document.getElementById('global-acct-set-select');
    if (!sel) return;

    const currentCode = sessionStorage.getItem('CurrentAcctSetCode') || '';
    const treeData    = JSON.parse(sessionStorage.getItem('AcctSetTree') || '[]');
    const opts        = [];

    if (!currentCode) {
        opts.push('<option value="" disabled selected style="color:#999;">-- 请选择帐套 --</option>');
    }

    function collectNodes(nodes, prefix) {
        nodes.forEach(n => {
            const isEnabled   = n.status === 'enabled';
            const selected    = n.code === currentCode ? 'selected' : '';
            const disabled    = isEnabled ? '' : 'disabled';
            const style       = isEnabled ? '' : 'style="color:#bbb;"';
            const suffix      = isEnabled ? '' : '（已停用）';
            opts.push(`<option value="${n.code}" ${selected} ${disabled} ${style}>${prefix}${n.name}${suffix}</option>`);
            if (n.children && n.children.length) collectNodes(n.children, prefix + '　');
        });
    }

    if (treeData.length === 0) {
        opts.push('<option value="" disabled>-- 暂无帐套 --</option>');
    } else {
        collectNodes(treeData, '');
    }

    sel.innerHTML = opts.join('');
};
