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

/** 核心辅助：追加【数据变更】日志 */
function addDataChangeLog(changeLog) {
    let logs = JSON.parse(sessionStorage.getItem('GlobalDataChangeLogs') || "[]");
    logs.unshift(changeLog);
    sessionStorage.setItem('GlobalDataChangeLogs', JSON.stringify(logs));
}

/** 核心辅助：追加审计日志 */
function addAuditLog(newLog) {
    let logs = JSON.parse(sessionStorage.getItem('GlobalAuditLogs') || "[]");
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
