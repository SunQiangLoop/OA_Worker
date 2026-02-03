// js/modules/finance/treasury.js

// 提交收款单
window.submitCollection = function() {
    const id = document.getElementById('col-id').value;
    const payer = document.getElementById('col-payer').value;
    const amount = document.getElementById('col-amount').value;
    const bank = document.getElementById('col-bank').value;
    const date = document.getElementById('col-date').value;
    const remark = document.getElementById('col-remark').value;

    if (!payer || !amount) return alert("❌ 请填写付款方和金额！");

    const newRecord = {
        id: id, payer: payer, amount: parseFloat(amount).toFixed(2),
        bank: bank, date: date, remark: remark, status: '待核销'
    };

    let list = JSON.parse(sessionStorage.getItem('CollectionRecords') || "[]");
    list.unshift(newRecord);
    sessionStorage.setItem('CollectionRecords', JSON.stringify(list));

    if (typeof addAuditLog === 'function') {
        addAuditLog({
            level: '低风险', time: new Date().toLocaleString(), user: '出纳', 
            module: '资金管理', action: '录入收款', detail: `流水:${id}, 金额:${amount}`
        });
    }

    alert("✅ 收款单录入成功！");
    loadContent('FundCollectionEntry');
}