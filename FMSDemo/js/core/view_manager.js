/**
 * 模块代码与中文名称映射 (保持不变)
 */
function getModuleName(code) {
    const names = {
        Dashboard: "首页",
        SettlementWaybill: "运单挂帐",
        SettlementTrunk: "干线批次挂帐",
        SettlementShortHaul: "短途批次挂帐",
        PriceManagement: "价格管理",
        ReconSite: "网点对账",
        ReconCustomer: "客户对账",
        ReconCarrier: "承运商对账",
        ReconDriver: "司机对账",
        ReconDiffHandle: "对账差异处理",
        ARCollectionVerify: "运单结算",
        ARAgeAnalysis: "客户账龄分析",
        APTrunkBatchSettlement: "干线批次结算",
        APShortBatchSettlement: "短途批次结算",
        APInvoiceManage: "进项发票台账",
        FundCustomerAcct: "客户资金账户",
        FundWallet: "司机/网点钱包",
        ExpenseLoan: "借款单",
        SettlementEngineConfig: "会计引擎配置",
        ExpenseRepay: "还款单",
        ExpenseDaily: "日常费用报销",
        ExpenseTravel: "差旅报销",
        ExpenseCompensation: "酬金结算",
        TaxInputInvoice: "进项发票台账",
        TaxOutputInvoice: "销项发票台账",
        TaxRateConfig: "税率配置",
        BudgetPlanning: "预算编制",
        BudgetExecutionAnalysis: "预算执行分析",
        BudgetPerformance: "绩效考核",
        RiskSensitiveLog: "敏感操作日志",
        RiskDataChange: "数据变更明细",
        AcctSubject: "会计科目",
        AcctSet: "会计账套",
        AcctPeriod: "会计期间",
        AcctAuxiliary: "辅助核算项",
        AssetCard: "资产卡片",
        AssetDepreciation: "折旧计算",
        PaymentMethodConfig: "收支方式配置",
        AssetChange: "资产变动",
        VoucherEntryReview: "凭证录入",
        FinanceVoucherAudit: "凭证审核中心",
        SubjectSummary: "科目汇总表",
        PeriodEndProfit: "结转损益",
        PeriodEndClose: "月末结账",
        AcctSubjectBalance: "科目余额表",
        AcctSubjectDetail: "科目明细账",
        ReportBalanceSheet: "资产负债表",
        ReportIncomeStatement: "利润损益表",
        ReportCashFlow: "现金流量表",
        ReportTrialBalance: "试算平衡表",
        ReportVehicleProfit: "单车线路盈亏分析",
        ReportCustomerProfit: "客户毛利分析",
        ReportARAPAge: "应收应付账龄分析",
        BankStatementSync: "银行对账单同步",
        OnlinePayment: "线上支付/代收付",
        BankBalanceQuery: "银行余额实时查询",
        AccountingStandardSetting: "基础设置",
        FinanceOpeningBalance: "期初余额录入",
        Permission: "权限管理",
        DriverProfileDetail: "司机档案详情",

    };
    return names[code] || "未知模块";
}

const ACCOUNTING_STANDARD_TEMPLATES = {
    small: [
        { code: "1001", name: "库存现金", type: "资产", direction: "借", aux: "无", status: "启用", remark: "日常现金收付" },
        { code: "1002", name: "银行存款", type: "资产", direction: "借", aux: "银行账户", status: "启用", remark: "银行往来资金" },
        { code: "1122", name: "应收账款", type: "资产", direction: "借", aux: "客户", status: "启用", remark: "客户应收款" },
        { code: "1123", name: "预付账款", type: "资产", direction: "借", aux: "供应商", status: "启用", remark: "预付供应商款项" },
        { code: "1221", name: "其他应收款", type: "资产", direction: "借", aux: "部门/员工", status: "启用", remark: "押金或借款" },
        { code: "1403", name: "原材料", type: "资产", direction: "借", aux: "无", status: "启用", remark: "消耗性物料" },
        { code: "1601", name: "固定资产", type: "资产", direction: "借", aux: "车辆/设备", status: "启用", remark: "车辆与设备" },
        { code: "1701", name: "累计折旧", type: "资产", direction: "贷", aux: "车辆/设备", status: "启用", remark: "固定资产折旧" },
        { code: "2001", name: "短期借款", type: "负债", direction: "贷", aux: "无", status: "启用", remark: "银行或机构短贷" },
        { code: "2202", name: "应付账款", type: "负债", direction: "贷", aux: "供应商/司机", status: "启用", remark: "承运商与供应商" },
        { code: "2211", name: "应付职工薪酬", type: "负债", direction: "贷", aux: "员工", status: "启用", remark: "工资与福利" },
        { code: "2221", name: "应交税费", type: "负债", direction: "贷", aux: "税种", status: "启用", remark: "税费计提" },
        { code: "4001", name: "实收资本", type: "权益", direction: "贷", aux: "股东", status: "启用", remark: "股东出资" },
        { code: "4101", name: "资本公积", type: "权益", direction: "贷", aux: "无", status: "启用", remark: "资本溢价" },
        { code: "4104", name: "未分配利润", type: "权益", direction: "贷", aux: "无", status: "启用", remark: "留存收益" },
        { code: "5001", name: "主营业务成本", type: "成本", direction: "借", aux: "项目/线路", status: "启用", remark: "运输成本" },
        { code: "6001", name: "主营业务收入", type: "损益", direction: "贷", aux: "客户/项目", status: "启用", remark: "运费收入" },
        { code: "6601", name: "管理费用", type: "损益", direction: "借", aux: "部门/员工", status: "启用", remark: "管理费用汇总" },
        { code: "6401", name: "运输成本", type: "成本", direction: "借", aux: "车辆/线路", status: "启用", remark: "车辆运输成本" },
        { code: "6601-01", name: "管理费用-办公", type: "损益", direction: "借", aux: "部门", status: "启用", remark: "办公与管理支出" }
    ],
    enterprise: [
        { code: "1001", name: "库存现金", type: "资产", direction: "借", aux: "无", status: "启用", remark: "日常现金收付" },
        { code: "1002", name: "银行存款", type: "资产", direction: "借", aux: "银行账户", status: "启用", remark: "银行往来资金" },
        { code: "1012", name: "其他货币资金", type: "资产", direction: "借", aux: "无", status: "启用", remark: "汇票/保证金" },
        { code: "1121", name: "应收票据", type: "资产", direction: "借", aux: "客户", status: "启用", remark: "商业汇票" },
        { code: "1122", name: "应收账款", type: "资产", direction: "借", aux: "客户", status: "启用", remark: "客户应收款" },
        { code: "1123", name: "预付账款", type: "资产", direction: "借", aux: "供应商", status: "启用", remark: "预付供应商款项" },
        { code: "1231", name: "其他应收款", type: "资产", direction: "借", aux: "部门/员工", status: "启用", remark: "押金或借款" },
        { code: "1405", name: "库存商品", type: "资产", direction: "借", aux: "无", status: "启用", remark: "待销售货物" },
        { code: "1601", name: "固定资产", type: "资产", direction: "借", aux: "车辆/设备", status: "启用", remark: "车辆与设备" },
        { code: "1701", name: "累计折旧", type: "资产", direction: "贷", aux: "车辆/设备", status: "启用", remark: "固定资产折旧" },
        { code: "2001", name: "短期借款", type: "负债", direction: "贷", aux: "无", status: "启用", remark: "银行或机构短贷" },
        { code: "2202", name: "应付账款", type: "负债", direction: "贷", aux: "供应商/司机", status: "启用", remark: "承运商与供应商" },
        { code: "2211", name: "应付职工薪酬", type: "负债", direction: "贷", aux: "员工", status: "启用", remark: "工资与福利" },
        { code: "2221", name: "应交税费", type: "负债", direction: "贷", aux: "税种", status: "启用", remark: "税费计提" },
        { code: "2241", name: "其他应付款", type: "负债", direction: "贷", aux: "部门/员工", status: "启用", remark: "保证金与应付" },
        { code: "4001", name: "实收资本", type: "权益", direction: "贷", aux: "股东", status: "启用", remark: "股东出资" },
        { code: "4101", name: "资本公积", type: "权益", direction: "贷", aux: "无", status: "启用", remark: "资本溢价" },
        { code: "4103", name: "盈余公积", type: "权益", direction: "贷", aux: "无", status: "启用", remark: "法定盈余" },
        { code: "4104", name: "未分配利润", type: "权益", direction: "贷", aux: "无", status: "启用", remark: "留存收益" },
        { code: "5001", name: "主营业务成本", type: "成本", direction: "借", aux: "项目/线路", status: "启用", remark: "运输成本" },
        { code: "5301", name: "研发支出", type: "成本", direction: "借", aux: "项目", status: "启用", remark: "信息化或研发" },
        { code: "6001", name: "主营业务收入", type: "损益", direction: "贷", aux: "客户/项目", status: "启用", remark: "运费收入" },
        { code: "6051", name: "其他业务收入", type: "损益", direction: "贷", aux: "客户", status: "启用", remark: "延伸业务收入" },
        { code: "6601", name: "管理费用", type: "损益", direction: "借", aux: "部门/员工", status: "启用", remark: "管理费用汇总" },
        { code: "6602", name: "销售费用", type: "损益", direction: "借", aux: "部门/项目", status: "启用", remark: "市场与销售" },
        { code: "6701", name: "财务费用", type: "损益", direction: "借", aux: "银行账户", status: "启用", remark: "利息与手续费" }
    ]
};

const DEFAULT_VOUCHER_SUMMARY_TEMPLATES = [
    { code: "001", summary: "支付司机运费", mnemonic: "ZFSJYF", category: "自动保存摘要" },
    { code: "0101", summary: "提现", mnemonic: "TX", category: "往来" },
    { code: "0102", summary: "收款", mnemonic: "SK", category: "往来" },
    { code: "0103", summary: "付款", mnemonic: "FK", category: "往来" },
    { code: "0201", summary: "支付职工工资", mnemonic: "ZFGZ", category: "费用" },
    { code: "0202", summary: "支付水电费", mnemonic: "ZFSDF", category: "费用" },
    { code: "0203", summary: "支付租金", mnemonic: "ZFZJ", category: "费用" },
    { code: "0204", summary: "报销差旅费", mnemonic: "BXCLF", category: "费用" },
    { code: "0205", summary: "报销电话费", mnemonic: "BXDHF", category: "费用" },
    { code: "0206", summary: "报销招待费", mnemonic: "BXZDF", category: "费用" },
    { code: "0301", summary: "结转生产成本", mnemonic: "JZSCCB", category: "结转" },
    { code: "0302", summary: "结转制造费用", mnemonic: "JZZZFY", category: "结转" },
    { code: "0303", summary: "结转销售成本", mnemonic: "JZXSCB", category: "结转" },
    { code: "9901", summary: "转款", mnemonic: "ZK", category: "其他" }
];

function cloneVoucherSummaryTemplates(list) {
    return list.map(item => ({ ...item }));
}

function persistVoucherSummaryTemplates(list) {
    localStorage.setItem("VoucherSummaryTemplates", JSON.stringify(list));
    sessionStorage.setItem("VoucherSummaryTemplates", JSON.stringify(list));
}

function getVoucherSummaryTemplates() {
    const raw = localStorage.getItem("VoucherSummaryTemplates");
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                const normalized = parsed.filter(item => item && item.summary);
                if (normalized.length > 0) {
                    return normalized;
                }
            }
        } catch (error) {
            // fall through to default
        }
    }
    const fallback = cloneVoucherSummaryTemplates(DEFAULT_VOUCHER_SUMMARY_TEMPLATES);
    persistVoucherSummaryTemplates(fallback);
    return fallback;
}

window.addVoucherSummaryTemplateRow = function () {
    const tbody = document.getElementById("summary-template-body");
    if (!tbody) return;
    const rowHtml = `
        <tr>
            <td><input type="text" placeholder="例如：0101"></td>
            <td><input type="text" placeholder="摘要"></td>
            <td><input type="text" placeholder="助记码"></td>
            <td><input type="text" placeholder="类别"></td>
            <td><button class="btn-primary summary-template-action" onclick="removeVoucherSummaryTemplateRow(this)">删除</button></td>
        </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", rowHtml);
};

window.removeVoucherSummaryTemplateRow = function (btn) {
    const row = btn && btn.closest ? btn.closest("tr") : null;
    if (row) row.remove();
};

window.saveVoucherSummaryTemplates = function () {
    const tbody = document.getElementById("summary-template-body");
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const list = rows.map(row => {
        const inputs = row.querySelectorAll("input");
        const code = inputs[0]?.value.trim() || "";
        const summary = inputs[1]?.value.trim() || "";
        const mnemonic = inputs[2]?.value.trim() || "";
        const category = inputs[3]?.value.trim() || "";
        if (!summary) return null;
        return { code, summary, mnemonic, category };
    }).filter(Boolean);

    if (!list.length) {
        alert("请至少保留一个摘要模板。");
        return;
    }

    persistVoucherSummaryTemplates(list);
    alert("凭证摘要模板已保存。");
};

window.resetVoucherSummaryTemplates = function () {
    const confirmed = confirm("确认恢复默认摘要模板？");
    if (!confirmed) return;
    const list = cloneVoucherSummaryTemplates(DEFAULT_VOUCHER_SUMMARY_TEMPLATES);
    persistVoucherSummaryTemplates(list);
    loadContent("AccountingStandardSetting");
};

function getAccountingStandardState() {
    const standard = localStorage.getItem("AccountingStandard");
    const vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
    const locked = Boolean(standard) && vouchers.length > 0;
    return { standard, locked };
}

function getSubjectCodeSetting() {
    const raw = localStorage.getItem("SubjectCodeSetting");
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.lengths) && parsed.lengths.length > 0) {
                return parsed;
            }
        } catch (error) {
            // fall through to default
        }
    }
    return { levels: 3, lengths: [4, 2, 2] };
}

function saveSubjectCodeSetting() {
    const levelCountEl = document.getElementById("subject-level-count");
    const levelCount = parseInt(levelCountEl ? levelCountEl.value : "3", 10);
    const lengths = [];
    for (let i = 1; i <= levelCount; i++) {
        const input = document.getElementById(`subject-length-${i}`);
        const val = parseInt(input ? input.value : "", 10);
        if (!val || val < 1) {
            alert("请填写有效的科目编码长度。");
            return;
        }
        lengths.push(val);
    }
    const setting = { levels: levelCount, lengths: lengths };
    localStorage.setItem("SubjectCodeSetting", JSON.stringify(setting));
    sessionStorage.setItem("SubjectCodeSetting", JSON.stringify(setting));
    if (typeof window.updateSubjectCodeInputs === "function") {
        window.updateSubjectCodeInputs(levelCount, lengths);
    }
    if (typeof window.applySubjectCodeSettingToSubjects === "function") {
        window.applySubjectCodeSettingToSubjects(setting);
    }
    alert("科目级次与编码长度已保存。");
}

window.updateSubjectCodeInputs = function(levelCount, lengths) {
    const selectEl = document.getElementById("subject-level-count");
    const level = levelCount || parseInt(selectEl ? selectEl.value : "3", 10);
    const inputs = Array.from(document.querySelectorAll("input[id^='subject-length-']"))
        .sort((a, b) => {
            const ai = parseInt(a.id.split("-").pop() || "0", 10);
            const bi = parseInt(b.id.split("-").pop() || "0", 10);
            return ai - bi;
        });
    const resolvedLengths = Array.isArray(lengths) && lengths.length
        ? lengths
        : inputs.map((input, idx) => {
            const val = parseInt(input ? input.value : "", 10);
            if (Number.isFinite(val) && val > 0) return val;
            return idx === 0 ? 4 : 2;
        });
    inputs.forEach((input, idx) => {
        const i = idx + 1;
        if (i <= level) {
            input.style.display = "";
            const nextVal = resolvedLengths[idx] || (i === 1 ? 4 : 2);
            if (!input.value || parseInt(input.value, 10) < 1 || Array.isArray(lengths)) {
                input.value = nextVal;
            }
        } else {
            input.style.display = "none";
        }
    });
    const exampleEl = document.getElementById("subject-code-example");
    if (exampleEl) {
        const parts = Array.from({ length: level }, (_, idx) => resolvedLengths[idx] || (idx === 0 ? 4 : 2));
        const baseLen = parts[0];
        let code = "1".padEnd(baseLen, "0");
        const chain = [code];
        for (let i = 1; i < parts.length; i += 1) {
            const seg = "1".padStart(parts[i], "0");
            code += seg;
            chain.push(code);
        }
        exampleEl.textContent = `示例：级次=${level}，长度=${parts.join("/")}，对应 ${chain.join(" → ")}。`;
    }
};

window.applySubjectCodeSettingToSubjects = function(setting) {
    const list = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]");
    if (!list.length) return;
    const levels = setting.levels || 3;
    const lengths = setting.lengths || [4, 2, 2];
    const maxLen = lengths.slice(0, levels).reduce((sum, val) => sum + val, 0);
    list.forEach(item => {
        const raw = (item.code || "").toString().replace(/\D/g, "");
        if (raw.length > maxLen) {
            item.code = raw.slice(0, maxLen);
        } else {
            item.code = raw;
        }
    });
    sessionStorage.setItem("AcctSubjects", JSON.stringify(list));
    localStorage.setItem("AcctSubjects", JSON.stringify(list));
    const vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
    if (vouchers.length) {
        vouchers.forEach(v => {
            if (!Array.isArray(v.lines)) return;
            v.lines.forEach(line => {
                const rawAccount = (line.account || "").toString();
                const match = rawAccount.match(/^(\d+)\s*/);
                if (match) {
                    const code = match[1];
                    const trimmed = code.slice(0, maxLen);
                    if (trimmed && trimmed !== code) {
                        line.account = rawAccount.replace(code, trimmed);
                    }
                }
                if (line.accountCode) {
                    const raw = line.accountCode.toString().replace(/\D/g, "");
                    if (raw.length > maxLen) line.accountCode = raw.slice(0, maxLen);
                    else line.accountCode = raw;
                }
            });
        });
        sessionStorage.setItem("ManualVouchers", JSON.stringify(vouchers));
    }
    if (typeof window.updateSubjectDatalist === "function") {
        window.updateSubjectDatalist("");
    }
};

function applyAccountingStandardSetting() {
    const selected = document.querySelector('input[name="acct-standard"]:checked');
    if (!selected) {
        alert("请先选择会计准则。");
        return;
    }

    const { standard, locked } = getAccountingStandardState();
    const nextStandard = selected.value;

    if (locked && standard) {
        alert("已有凭证数据，当前会计准则已锁定，无法修改。");
        return;
    }

    if (standard && standard !== nextStandard) {
        const confirmed = confirm("切换会计准则将覆盖当前科目模板，确认继续？");
        if (!confirmed) return;
    }

    const template = ACCOUNTING_STANDARD_TEMPLATES[nextStandard] || [];
    localStorage.setItem("AccountingStandard", nextStandard);
    sessionStorage.setItem("AcctSubjects", JSON.stringify(template));
    localStorage.setItem("AcctSubjects", JSON.stringify(template));
    alert("会计准则已保存，系统已初始化科目模板。");
    loadContent("AccountingStandardSetting");
}

// ============================================
// ★★★ 财务测试数据生成器 (执行一次即可) ★★★
// ============================================
// function initDemoFinanceData() {
//     const demoVouchers = [
//         { id: "记20251001", date: "2025-10-01", summary: "收到股东注资", status: "已审核", lines: [{ digest: "收到股东注资", account: "1002 银行存款", debit: 1000000, credit: 0 }, { digest: "收到股东注资", account: "4001 实收资本", debit: 0, credit: 1000000 }] },
//         { id: "记20251002", date: "2025-10-02", summary: "支付办公室房租", status: "已审核", lines: [{ digest: "支付房租", account: "6602 管理费用-房租", debit: 20000, credit: 0 }, { digest: "支付房租", account: "1002 银行存款", debit: 0, credit: 20000 }] },
//         { id: "记20251005", date: "2025-10-05", summary: "收到京东运费", status: "已审核", lines: [{ digest: "收到运费", account: "1002 银行存款", debit: 50000, credit: 0 }, { digest: "收到运费", account: "1122 应收账款", debit: 0, credit: 50000 }] },
//         { id: "记20251008", date: "2025-10-08", summary: "支付中石化油费", status: "已审核", lines: [{ digest: "预充油卡", account: "1123 预付账款", debit: 10000, credit: 0 }, { digest: "银行转账", account: "1002 银行存款", debit: 0, credit: 10000 }] },
//         { id: "记20251012", date: "2025-10-12", summary: "计提本月工资", status: "已审核", lines: [{ digest: "计提工资", account: "6601 管理费用-工资", debit: 50000, credit: 0 }, { digest: "计提工资", account: "6401 运输成本-司机工资", debit: 80000, credit: 0 }, { digest: "计提工资", account: "2211 应付职工薪酬", debit: 0, credit: 130000 }] },
//         { id: "记20251015", date: "2025-10-15", summary: "确认干线收入", status: "已审核", lines: [{ digest: "干线运费收入", account: "1122 应收账款", debit: 200000, credit: 0 }, { digest: "干线运费收入", account: "6001 主营业务收入", debit: 0, credit: 200000 }] },
//         { id: "记20251018", date: "2025-10-18", summary: "采购办公电脑", status: "已审核", lines: [{ digest: "采购电脑", account: "1601 固定资产", debit: 15000, credit: 0 }, { digest: "采购电脑", account: "1002 银行存款", debit: 0, credit: 15000 }] },
//         { id: "记20251020", date: "2025-10-20", summary: "支付车辆维修费", status: "已审核", lines: [{ digest: "维修费", account: "6402 运输成本-维修", debit: 3500, credit: 0 }, { digest: "维修费", account: "1001 库存现金", debit: 0, credit: 3500 }] },
//         { id: "记20251022", date: "2025-10-22", summary: "提取备用金", status: "已审核", lines: [{ digest: "提现", account: "1001 库存现金", debit: 5000, credit: 0 }, { digest: "提现", account: "1002 银行存款", debit: 0, credit: 5000 }] },
//         { id: "记20251025", date: "2025-10-25", summary: "收到零担运费", status: "已审核", lines: [{ digest: "现金收入", account: "1001 库存现金", debit: 800, credit: 0 }, { digest: "现金收入", account: "6001 主营业务收入", debit: 0, credit: 800 }] },
//         { id: "记20251028", date: "2025-10-28", summary: "支付承运商运费", status: "已审核", lines: [{ digest: "付运费", account: "2202 应付账款", debit: 40000, credit: 0 }, { digest: "付运费", account: "1002 银行存款", debit: 0, credit: 40000 }] },
//         { id: "记20251030", date: "2025-10-30", summary: "结转本月成本", status: "已审核", lines: [{ digest: "结转成本", account: "6403 劳务成本", debit: 20000, credit: 0 }, { digest: "结转成本", account: "2202 应付账款", debit: 0, credit: 20000 }] }
//     ];
//     sessionStorage.setItem('ManualVouchers', JSON.stringify(demoVouchers));
//     console.log("✅ 成功生成 12 笔财务凭证数据！请刷新查看余额表。");
//     alert("测试数据已注入！\n包含了：现金、银行、应收、应付、收入、成本、费用等各类科目。");
// }


// 执行初始化（若存在）
if (typeof initDemoFinanceData === "function") {
    initDemoFinanceData();
}

/**
 * 加载内容到内容区，并更新菜单激活状态
 */
function loadContent(moduleCode, element = null) {
    const contentArea = document.getElementById("content-area");
    const allItems = document.querySelectorAll(".menu-item, .sub-menu-item");

    const { standard } = getAccountingStandardState();
    if (!standard && moduleCode !== "AccountingStandardSetting") {
        moduleCode = "AccountingStandardSetting";
        element = null;
    }

    window.g_currentModule = moduleCode;

    allItems.forEach((item) => item.classList.remove("active"));

    if (element) {
        element.classList.add("active");
    } else {
        const defaultItem = document.querySelector(
            `.menu-item[onclick*="'${moduleCode}'"]`
        );
        if (defaultItem) defaultItem.classList.add("active");
    }

    let contentHTML = `<h2>${getModuleName(moduleCode)}</h2>`;

    // =========================================================================
    // 核心页面逻辑开始
    // =========================================================================

    if (moduleCode === "Dashboard") {
        // ===============================================
        // 1. 定义数据结构
        // ===============================================

        // A. 模拟顶部的核心财务指标 (让老板第一眼看到钱)
        const kpiData = [
            { label: "本月预估营收", value: "¥ 1,285,400.00", trend: "+12.5%", trendType: "up", icon: "💰", bg: "linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)" },
            { label: "待付运费总额", value: "¥ 432,100.00", trend: "+5.2%", trendType: "down", icon: "📉", bg: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)" },
            { label: "当前资金池余额", value: "¥ 892,000.00", trend: "安全", trendType: "safe", icon: "🛡️", bg: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
            { label: "本月待处理单据", value: "128 笔", trend: "需关注", trendType: "warn", icon: "🔔", bg: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)" }
        ];

        // B. 系统架构导航 (四大支柱)
        const systemArch = [
            {
                title: "财务管理中心",
                icon: "💴",
                theme: "blue",
                color: "#e6f7ff",
                borderColor: "#1890ff",
                modules: [
                    { name: "运单挂帐", code: "SettlementWaybill" },
                    { name: "应收管理", code: "ARCustomerStatement" },
                    { name: "应付管理", code: "APTrunkBatchSettlement" },
                    { name: "发票管理", code: "TaxInputInvoice" },
                    { name: "异动管理", code: "AbnormalManagement" },
                    { name: "对帐管理", code: "ReconManage" },
                    { name: "计费报价", code: "PriceManagement" }
                ]
            },
            {
                title: "出纳管理中心",
                icon: "🏦",
                theme: "purple",
                color: "#f9f0ff",
                borderColor: "#722ed1",
                modules: [
                    { name: "资金账户", code: "FundCustomerAcct" },
                    { name: "干线批次结算", code: "APTrunkBatchSettlement" },
                    { name: "短途批次结算", code: "APShortBatchSettlement" },
                    { name: "钱包管理", code: "FundWallet" }, // 合并司机/网点钱包
                    { name: "资金流水明细", code: "ARCollectionVerify" } // 或 BankStatementSync
                ]
            },
            {
                title: "总账中心",
                icon: "📈",
                theme: "green",
                color: "#f6ffed",
                borderColor: "#52c41a",
                modules: [
                    { name: "会计基础", code: "AcctSubject" }, // 原: 会计基础
                    { name: "凭证管理", code: "VoucherQueryPrint" },
                    { name: "会计引擎", code: "SettlementEngineConfig" },
                    { name: "期末处理", code: "PeriodEndClose" },
                    { name: "会计报表", code: "ReportBalanceSheet" }, // 原: 法定报表
                    { name: "总账", code: "ReportGeneralLedger" },
                    { name: "管理报表", code: "ReportIncomeStatement" } // 原: 管理报表
                ]
            },
            {
                title: "系统配置",
                icon: "⚙️",
                theme: "orange",
                color: "#fff7e6",
                borderColor: "#fa8c16",
                modules: [
                    { name: "基础设置", code: "AccountingStandardSetting" },
                    { name: "收支方式配置", code: "PaymentMethodConfig" },
                    { name: "权限分配", code: "Permission" },
                    { name: "操作日志", code: "RiskSensitiveLog" }
                ]
            }
        ];

        const styleFix = `
        <style>
            /* 顶部 KPI 卡片区 */
            .kpi-wrapper {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
                margin-bottom: 30px;
            }
            .kpi-card {
                border-radius: 10px;
                padding: 20px;
                color: white;
                box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                position: relative;
                overflow: hidden;
                transition: transform 0.3s;
            }
            .kpi-card:hover { transform: translateY(-5px); }
            .kpi-label { font-size: 13px; opacity: 0.9; margin-bottom: 8px; }
            .kpi-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; font-family: 'Helvetica Neue', sans-serif; }
            .kpi-footer { font-size: 12px; opacity: 0.8; display: flex; align-items: center; }
            .kpi-icon { position: absolute; right: 20px; top: 20px; font-size: 40px; opacity: 0.2; }

            /* 核心导航卡片区 */
            .nav-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr); /* 两列布局，看起来更稳重 */
                gap: 24px;
            }
            .nav-card {
                background: #fff;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.06);
                padding: 24px;
                border: 1px solid #f0f0f0;
                transition: all 0.3s;
            }
            .nav-card:hover {
                box-shadow: 0 12px 24px rgba(0,0,0,0.12);
            }
            
            /* 导航卡片头部 */
            .nav-header {
                display: flex;
                align-items: flex-start;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #f5f5f5;
            }
            .nav-icon-box {
                width: 48px; height: 48px;
                border-radius: 10px;
                display: flex; align-items: center; justify-content: center;
                font-size: 24px;
                margin-right: 15px;
                background: #f0f5ff;
            }
            .nav-title-group h3 { margin: 11px; font-size: 18px; color: #333; }
            .nav-title-group p { margin: 4px 0 0 0; font-size: 13px; color: #999; }

            /* 模块列表 */
            .module-list {
                display: grid;
                grid-template-columns: repeat(3, 1fr); /* 内部三列 */
                gap: 12px;
            }
            .module-item {
                display: flex;
                align-items: center;
                font-size: 13px;
                color: #555;
                padding: 8px 10px;
                border-radius: 6px;
                cursor: pointer;
                background: #f9f9f9;
                transition: all 0.2s;
            }
            .module-item:hover {
                background: #e6f7ff;
                color: #1890ff;
                padding-left: 15px; /* 悬停右移效果 */
            }
            .module-item::before {
                content: "•";
                color: #ccc;
                margin-right: 8px;
                font-size: 16px;
            }
            .module-item:hover::before { color: #1890ff; }

            @media (max-width: 1200px) { .nav-grid { grid-template-columns: 1fr; } .kpi-wrapper { grid-template-columns: repeat(2, 1fr); } }
        </style>
    `;

        // ===============================================
        // 3. 生成 HTML
        // ===============================================

        // 生成 KPI HTML
        const kpiHTML = kpiData.map(k => `
        <div class="kpi-card" style="background: ${k.bg}">
            <div class="kpi-label">${k.label}</div>
            <div class="kpi-value">${k.value}</div>
            <div class="kpi-footer">
                <span>${k.trendType === 'up' ? '▲' : (k.trendType === 'down' ? '▼' : '●')} ${k.trend}</span>
            </div>
            <div class="kpi-icon">${k.icon}</div>
        </div>
    `).join('');

        // 生成导航卡片 HTML
        // 生成导航卡片 HTML
        const navHTML = systemArch.map(group => `
        <div class="nav-card">
            <div class="nav-header">
                <div class="nav-icon-box" style="color: ${group.color}; background: ${group.color}15;">
                    ${group.icon}
                </div>
                <div class="nav-title-group">
                    <h3>${group.title}</h3>
                </div>
            </div>
            <div class="module-list">
                ${group.modules.map(mod => `
                    <div class="module-item" onclick="loadContent('${mod.code}')">
                        ${mod.name}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

        contentHTML = `
        ${styleFix}
        <div style="margin-bottom: 25px;">
            <h2 style="margin: 0; font-size: 22px; color: #333;">首页</h2>
        </div>

        <div class="kpi-wrapper">
            ${kpiHTML}
        </div>

        <div class="nav-grid">
            ${navHTML}
        </div>
    `;
    }

    // =========================================================================
    // 1. 运单挂帐 (SettlementWaybill) - [最终版：含货物信息字段]
    // =========================================================================
	    else if (moduleCode === "SettlementWaybill") {
	        // 1. 初始化数据
	        let waybills = JSON.parse(sessionStorage.getItem("BizWaybills"));

	        // 运单挂账表头字段（按用户给定字段补齐）
	        const accrualColumns = [
	            { key: "site", label: "网点" },
	            { key: "waybillNo", label: "运单号", filter: { id: "wb_f_waybillNos", placeholder: "支持批量搜索" } },
	            { key: "goodsNo", label: "货号", filter: { id: "wb_f_goodsNos", placeholder: "支持批量搜索" } },
	            { key: "createdAt", label: "开单时间" },
	            { key: "originStation", label: "发站" },
	            { key: "destinationStation", label: "到站" },
	            { key: "routeLine", label: "路由" },
	            { key: "shipper", label: "发货人" },
	            { key: "consignee", label: "收货人" },
	            { key: "waybillAccrualStatus", label: "运单挂账状态", align: "center", filter: { id: "wb_f_waybill_status", type: "select", options: ["", "未挂账", "已挂账", "对账中", "已开票"] } },
	            { key: "cashPay", label: "现付", align: "right" },
	            { key: "cashPayAccrualStatus", label: "现付挂账状态", align: "center" },
	            { key: "arrivePay", label: "到付", align: "right" },
	            { key: "arrivePayAccrualStatus", label: "到付挂账状态", align: "center" },
	            { key: "monthlyPay", label: "月结", align: "right" },
	            { key: "monthlyPayAccrualStatus", label: "月结挂账状态", align: "center" },
	            { key: "cashReturn", label: "现返", align: "right" },
	            { key: "cashReturnAccrualStatus", label: "现返挂账状态", align: "center" },
	            { key: "debtReturn", label: "欠返", align: "right" },
	            { key: "debtReturnAccrualStatus", label: "欠返挂账状态", align: "center" },
	            { key: "transferFeeTotal", label: "中转费合计", align: "right" },
	            { key: "transferFeeAccrualStatus", label: "中转费挂账状态", align: "center" },
	            { key: "codAmount", label: "代收货款", align: "right" },
	            { key: "codAccrualStatus", label: "代收货款挂账状态", align: "center" },
	            { key: "codServiceFee", label: "货款手续费", align: "right" },
	            { key: "codServiceFeeAccrualStatus", label: "货款手续费挂账状态", align: "center" },
	            { key: "pickupFee", label: "单票提货费", align: "right" },
	            { key: "pickupFeeAccrualStatus", label: "单票提货费挂账状态", align: "center" },
	            { key: "warehouseFee", label: "到站单票进仓费", align: "right" },
	            { key: "warehouseFeeAccrualStatus", label: "到站单票进仓费挂账状态", align: "center" },
	            { key: "advanceFee", label: "开单垫付费", align: "right" },
	            { key: "advanceFeeAccrualStatus", label: "垫付费挂账状态", align: "center" },
	            { key: "collectFreight", label: "代收运费", align: "right" },
	            { key: "collectFreightAccrualStatus", label: "代收运费挂账状态", align: "center" },
	            { key: "remark", label: "运单备注" },
	            { key: "flag", label: "运单标识" },
	        ];

	        const excelWaybills =             [
	                        {
                                    "seq": "1",
                                    "orderNo": "YD2601131639000125",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131639000227",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:39:23",
                                    "loadAt": "2026-01-13 18:00:25",
                                    "unloadAt": "2026-01-15 10:38:37",
                                    "finishAt": "2026-01-15 14:26:33",
                                    "freightAmount": "5300",
                                    "taxRate": "6%",
                                    "taxAmount": "338.3",
                                    "driver": "房毛斗/17280055706",
                                    "plate": "豫NN2450",
                                    "goodsPack": "配件/20",
                                    "weightVolume": "32000.0/120.0",
                                    "origin": "徐州徐工玖行能源科技有限公司",
                                    "destination": "赤岸镇",
                                    "paidAmount": "5300",
                                    "paidAt": "2026-01-15 17:33:43",
                        },
                        {
                                    "seq": "2",
                                    "orderNo": "YD2601131621000123",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131621000223",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:21:35",
                                    "loadAt": "2026-01-13 16:45:12",
                                    "unloadAt": "2026-01-14 13:42:05",
                                    "finishAt": "2026-01-14 13:45:45",
                                    "freightAmount": "2000",
                                    "taxRate": "6%",
                                    "taxAmount": "127.66",
                                    "driver": "平杰/18755497760",
                                    "plate": "皖CC9056",
                                    "goodsPack": "配件/18",
                                    "weightVolume": "8000.0/18.0",
                                    "origin": "安徽卓基工业设备有限公司",
                                    "destination": "无锡市标准件厂有限公司",
                                    "paidAmount": "2000",
                                    "paidAt": "2026-01-14 17:41:07",
                        },
                        {
                                    "seq": "3",
                                    "orderNo": "YD2601131617000122",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131617000221",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:17:06",
                                    "loadAt": "2026-01-13 16:40:35",
                                    "unloadAt": "2026-01-14 11:52:22",
                                    "finishAt": "2026-01-15 09:57:53",
                                    "freightAmount": "3000",
                                    "taxRate": "6%",
                                    "taxAmount": "191.49",
                                    "driver": "李春阳/18019838831",
                                    "plate": "皖M4C508",
                                    "goodsPack": "饮品/2400",
                                    "weightVolume": "33.2/0.001",
                                    "origin": "今麦郎饮品(天长)有限公司",
                                    "destination": "倍乐生商贸公司物流中心",
                                    "paidAmount": "3000",
                                    "paidAt": "2026-01-15 15:15:05",
                        },
                        {
                                    "seq": "4",
                                    "orderNo": "YD2601131616000121",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131616000219",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:16:03",
                                    "loadAt": "2026-01-13 20:44:32",
                                    "unloadAt": "2026-01-14 13:18:51",
                                    "finishAt": "2026-01-15 09:58:13",
                                    "freightAmount": "2100",
                                    "taxRate": "6%",
                                    "taxAmount": "134.04",
                                    "driver": "杨兆拍/17351883288",
                                    "plate": "苏BY7552",
                                    "goodsPack": "饮品/2400",
                                    "weightVolume": "33.2/0.001",
                                    "origin": "今麦郎饮品(天长)有限公司",
                                    "destination": "长泾镇",
                                    "paidAmount": "2100",
                                    "paidAt": "2026-01-15 15:15:06",
                        },
                        {
                                    "seq": "5",
                                    "orderNo": "YD2601131536000117",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131536000211",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 15:36:07",
                                    "loadAt": "2026-01-13 19:10:40",
                                    "unloadAt": "2026-01-14 14:31:53",
                                    "finishAt": "2026-01-16 14:12:00",
                                    "freightAmount": "2000",
                                    "taxRate": "6%",
                                    "taxAmount": "127.66",
                                    "driver": "蔡银刚/18119566359",
                                    "plate": "皖LE8339",
                                    "goodsPack": "电器/500",
                                    "weightVolume": "12000.0/60.0",
                                    "origin": "安徽省 合肥市 长丰县 岗集镇合淮路8号中国南山·合肥智慧物流港",
                                    "destination": "江苏省 苏州市 常熟市 人和路10号常熟宥望电商智能交付中心",
                                    "paidAmount": "2000",
                                    "paidAt": "2026-01-16 17:28:37",
                        },
                        {
                                    "seq": "6",
                                    "orderNo": "YD2601131535000116",
                                    "creator": "朱树伟/18905693469/合肥诚才物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131535000209",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 15:35:13",
                                    "loadAt": "2026-01-13 19:29:51",
                                    "unloadAt": "2026-01-14 10:03:35",
                                    "finishAt": "2026-01-16 14:12:11",
                                    "freightAmount": "1300",
                                    "taxRate": "6%",
                                    "taxAmount": "82.98",
                                    "driver": "杨占杰/13913942613",
                                    "plate": "苏AF6661",
                                    "goodsPack": "电器/500",
                                    "weightVolume": "12000.0/60.0",
                                    "origin": "安徽省 合肥市 长丰县 岗集镇合淮路8号中国南山·合肥智慧物流港",
                                    "destination": "江苏省 南京市 栖霞区 龙潭街道港城路2号蔚然(南京)动力科技有限公司",
                                    "paidAmount": "1300",
                                    "paidAt": "2026-01-16 17:28:44",
                        },
                        {
                                    "seq": "8",
                                    "orderNo": "YD2601131456000114",
                                    "creator": "王翠娟/18013266866/昆山江南达物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131456000203",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:56:06",
                                    "loadAt": "2026-01-13 17:48:31",
                                    "unloadAt": "2026-01-15 14:00:07",
                                    "finishAt": "2026-01-15 14:16:03",
                                    "freightAmount": "6750",
                                    "taxRate": "6%",
                                    "taxAmount": "430.85",
                                    "driver": "潘庆和/13206345218",
                                    "plate": "鲁AT2888",
                                    "goodsPack": "电子产品/60",
                                    "weightVolume": "28000.0/0.001",
                                    "origin": "德阳南服务区(京昆高速北京方向)225",
                                    "destination": "安徽金瑞玻纤金瑞玻纤厂288",
                                    "paidAmount": "6750",
                                    "paidAt": "2026-01-15 17:33:13",
                        },
                        {
                                    "seq": "9",
                                    "orderNo": "YD2601131432000111",
                                    "creator": "张延辉/18705157801/江苏速淳物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131432000197",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:32:28",
                                    "loadAt": "2026-01-14 09:12:21",
                                    "unloadAt": "2026-01-15 16:51:12",
                                    "finishAt": "2026-01-16 14:00:42",
                                    "freightAmount": "6650",
                                    "taxRate": "6%",
                                    "taxAmount": "424.47",
                                    "driver": "孔令松/15327502779",
                                    "plate": "鄂H06D10",
                                    "goodsPack": "化肥/1",
                                    "weightVolume": "0.0/0.001",
                                    "origin": "湖北凯龙楚兴化工集团有限公司",
                                    "destination": "金华瑞尔生物科技有限公司",
                                    "paidAmount": "6650",
                                    "paidAt": "2026-01-16 17:28:48",
                        },
                        {
                                    "seq": "10",
                                    "orderNo": "YD2601131419000109",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131419000193",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:19:17",
                                    "loadAt": "2026-01-13 14:28:51",
                                    "unloadAt": "2026-01-14 10:12:28",
                                    "finishAt": "2026-01-14 12:39:48",
                                    "freightAmount": "1800",
                                    "taxRate": "6%",
                                    "taxAmount": "114.89",
                                    "driver": "王元敏/15056735592",
                                    "plate": "皖LD0889",
                                    "goodsPack": "木托盘/750",
                                    "weightVolume": "27.0/160.0",
                                    "origin": "常州市杰隆工具有限公司",
                                    "destination": "远洋物流四期肥东物流园",
                                    "paidAmount": "1800",
                                    "paidAt": "2026-01-14 17:41:21",
                        },
                        {
                                    "seq": "11",
                                    "orderNo": "YD2601131406000105",
                                    "creator": "胥智芳/17805133633/南京笨鸟物流有限责任公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131406000185",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:06:24",
                                    "loadAt": "2026-01-13 17:38:59",
                                    "unloadAt": "2026-01-14 15:50:57",
                                    "finishAt": "2026-01-14 19:24:01",
                                    "freightAmount": "2000",
                                    "taxRate": "6.3%",
                                    "taxAmount": "134.47",
                                    "driver": "闫爱斌/15562668016",
                                    "plate": "鲁AU6678",
                                    "goodsPack": "消泡剂/28",
                                    "weightVolume": "28000.0/40.0",
                                    "origin": "仪征冠宏化工研究有限公司",
                                    "destination": "济南圣泉环保科技有限公司",
                                    "paidAmount": "2000",
                                    "paidAt": "2026-01-15 15:15:07",
                        },
                        {
                                    "seq": "12",
                                    "orderNo": "YD2601131400000102",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131400000179",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:00:42",
                                    "loadAt": "2026-01-13 15:17:24",
                                    "unloadAt": "2026-01-14 16:40:23",
                                    "finishAt": "2026-01-15 09:40:52",
                                    "freightAmount": "3500",
                                    "taxRate": "6%",
                                    "taxAmount": "223.4",
                                    "driver": "谢永化/13979421476",
                                    "plate": "赣FF1760",
                                    "goodsPack": "配件/20",
                                    "weightVolume": "32000.0/120.0",
                                    "origin": "江西翼邦生物技术有限公司",
                                    "destination": "揭阳高新区",
                                    "paidAmount": "3500",
                                    "paidAt": "2026-01-15 15:15:13",
                        },
                        {
                                    "seq": "13",
                                    "orderNo": "YD2601131357000101",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131357000177",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:57:20",
                                    "loadAt": "2026-01-13 14:02:26",
                                    "unloadAt": "2026-01-13 20:09:40",
                                    "finishAt": "2026-01-14 12:40:04",
                                    "freightAmount": "1800",
                                    "taxRate": "6%",
                                    "taxAmount": "114.89",
                                    "driver": "邓二斯麻乃/15809306991",
                                    "plate": "甘N74881",
                                    "goodsPack": "木托盘/750",
                                    "weightVolume": "27.0/160.0",
                                    "origin": "新北区蒲田农场",
                                    "destination": "远洋物流四期肥东物流园",
                                    "paidAmount": "1800",
                                    "paidAt": "2026-01-14 17:41:23",
                        },
                        {
                                    "seq": "14",
                                    "orderNo": "YD2601131329000094",
                                    "creator": "吴红国/13856606515/池州市姚街老屋运输有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131329000161",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:29:59",
                                    "loadAt": "2026-01-13 13:48:07",
                                    "unloadAt": "2026-01-16 10:11:12",
                                    "finishAt": "2026-01-16 12:44:52",
                                    "freightAmount": "13500",
                                    "taxRate": "6%",
                                    "taxAmount": "861.7",
                                    "driver": "翁伟/15838622789",
                                    "plate": "豫PR9151",
                                    "goodsPack": "海绵卷/135",
                                    "weightVolume": "4.8/138.0",
                                    "origin": "安徽财纳伽善科技有限公司",
                                    "destination": "广西中投木业有限责任公司",
                                    "paidAmount": "13500",
                                    "paidAt": "2026-01-16 17:28:53",
                        },
                        {
                                    "seq": "15",
                                    "orderNo": "YD2601131327000092",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131327000159",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:27:04",
                                    "loadAt": "2026-01-13 15:42:37",
                                    "unloadAt": "2026-01-14 12:54:17",
                                    "finishAt": "2026-01-14 21:12:38",
                                    "freightAmount": "1700",
                                    "taxRate": "6%",
                                    "taxAmount": "108.51",
                                    "driver": "徐长奎/15020105580",
                                    "plate": "鲁RV5528",
                                    "goodsPack": "配件/18",
                                    "weightVolume": "10000.0/25.0",
                                    "origin": "江苏新众亚智能物流装备制造有限公司",
                                    "destination": "江苏天成科技集团(南通饲料有限公司)",
                                    "paidAmount": "1700",
                                    "paidAt": "2026-01-15 15:16:05",
                        },
                        {
                                    "seq": "16",
                                    "orderNo": "YD2601131324000091",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131324000157",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:24:12",
                                    "loadAt": "2026-01-13 13:26:38",
                                    "unloadAt": "2026-01-14 09:35:52",
                                    "finishAt": "2026-01-14 12:40:22",
                                    "freightAmount": "4500",
                                    "taxRate": "6%",
                                    "taxAmount": "287.23",
                                    "driver": "岳喜友/15855098070",
                                    "plate": "皖M97863",
                                    "goodsPack": "托盘纸/500",
                                    "weightVolume": "20.0/160.0",
                                    "origin": "安徽永盛印务科技有限公司-南门",
                                    "destination": "中国邮政速递转运中心",
                                    "paidAmount": "4500",
                                    "paidAt": "2026-01-14 17:41:27",
                        },
                        {
                                    "seq": "17",
                                    "orderNo": "YD2601131323000090",
                                    "creator": "胥智芳/17805133633/南京笨鸟物流有限责任公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131323000155",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:23:48",
                                    "loadAt": "2026-01-13 17:21:38",
                                    "unloadAt": "2026-01-14 10:38:29",
                                    "finishAt": "2026-01-14 11:08:03",
                                    "freightAmount": "1250",
                                    "taxRate": "6.3%",
                                    "taxAmount": "84.04",
                                    "driver": "曹新山/18265821116",
                                    "plate": "鲁RJ5015",
                                    "goodsPack": "消泡剂/28",
                                    "weightVolume": "28000.0/75.0",
                                    "origin": "江苏巴德聚氨酯股份有限公司",
                                    "destination": "仪征冠宏化工研究有限公司",
                                    "paidAmount": "1250",
                                    "paidAt": "2026-01-14 17:41:35",
                        },
                        {
                                    "seq": "18",
                                    "orderNo": "YD2601131236000086",
                                    "creator": "朱树伟/18905693469/合肥诚才物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131236000149",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 12:36:25",
                                    "loadAt": "2026-01-13 18:38:06",
                                    "unloadAt": "2026-01-14 09:34:12",
                                    "finishAt": "2026-01-16 14:11:22",
                                    "freightAmount": "2200",
                                    "taxRate": "6%",
                                    "taxAmount": "140.43",
                                    "driver": "付成勇/13856999596",
                                    "plate": "皖AC1306",
                                    "goodsPack": "电器/1000",
                                    "weightVolume": "30.0/130.0",
                                    "origin": "安徽省 合肥市 肥西县 美的安得物流安得智联皖北分公司",
                                    "destination": "江苏省南京市栖霞区龙潭街道港城路2号蔚然(南京)动力科技有限公司",
                                    "paidAmount": "2200",
                                    "paidAt": "2026-01-16 17:28:54",
                        },
                        {
                                    "seq": "19",
                                    "orderNo": "YD2601131217000084",
                                    "creator": "董长于/15212085999/天长市乐运物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131217000145",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 12:17:32",
                                    "loadAt": "2026-01-13 14:08:47",
                                    "unloadAt": "2026-01-14 02:43:53",
                                    "finishAt": "2026-01-14 11:51:35",
                                    "freightAmount": "3300",
                                    "taxRate": "6%",
                                    "taxAmount": "210.64",
                                    "driver": "王翔/18455058005",
                                    "plate": "苏A4B002",
                                    "goodsPack": "配件/1668",
                                    "weightVolume": "8000.0/53.0",
                                    "origin": "天长市嘉丰美术用品有限公司",
                                    "destination": "上海剑成供应链科技有限公司",
                                    "paidAmount": "3300",
                                    "paidAt": "2026-01-14 17:41:37",
                        },
                        {
                                    "seq": "20",
                                    "orderNo": "YD2601131202000081",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131202000139",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 12:02:17",
                                    "loadAt": "2026-01-13 12:47:45",
                                    "unloadAt": "2026-01-14 16:52:21",
                                    "finishAt": "2026-01-15 15:15:53",
                                    "freightAmount": "3200",
                                    "taxRate": "6%",
                                    "taxAmount": "204.26",
                                    "driver": "曹子柱/13634400808",
                                    "plate": "黑ACM678",
                                    "goodsPack": "木托盘/750",
                                    "weightVolume": "27.0/160.0",
                                    "origin": "沈阳惠众环通包装股份有限公司",
                                    "destination": "予智(哈尔滨)供应链管理有限公司",
                                    "paidAmount": "3200",
                                    "paidAt": "2026-01-15 17:34:24",
                        },
                        {
                                    "seq": "21",
                                    "orderNo": "YD2601151024000090",
                                    "creator": "陈萍/13914450625/南京联畅物流股份有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601151024000157",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 10:24:55",
                                    "loadAt": "2026-01-15 10:55:32",
                                    "unloadAt": "2026-01-16 12:59:17",
                                    "finishAt": "2026-01-16 16:14:29",
                                    "freightAmount": "4700",
                                    "taxRate": "6%",
                                    "taxAmount": "300",
                                    "driver": "王广战/18751601622",
                                    "plate": "苏CPG169",
                                    "goodsPack": "电缆/10",
                                    "weightVolume": "28000.0/70.0",
                                    "origin": "江苏江扬电缆有限公司",
                                    "destination": "创园大道",
                                    "paidAmount": "4700",
                                    "paidAt": "2026-01-16 17:23:54",
                        },
                        {
                                    "seq": "22",
                                    "orderNo": "YD2601151010000087",
                                    "creator": "黄光辉/15016793637/怀化飞鸿物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601151010000153",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 10:10:48",
                                    "loadAt": "2026-01-16 11:42:21",
                                    "unloadAt": "2026-01-17 15:02:27",
                                    "finishAt": "2026-01-17 15:52:53",
                                    "freightAmount": "5075",
                                    "taxRate": "6.5%",
                                    "taxAmount": "352.81",
                                    "driver": "罗香颖/18977821852",
                                    "plate": "桂MF2892",
                                    "goodsPack": "三聚磷酸钠/1",
                                    "weightVolume": "35000.0/0.001",
                                    "origin": "六塘工业园六塘工业园兴发厂",
                                    "destination": "东莞市嘉吉实业有限公司",
                                    "paidAmount": "5075",
                                    "paidAt": "2026-01-17 17:50:26",
                        },
                        {
                                    "seq": "23",
                                    "orderNo": "YD2601150959000082",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150959000143",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:59:13",
                                    "loadAt": "2026-01-15 10:17:44",
                                    "unloadAt": "2026-01-16 11:40:05",
                                    "finishAt": "2026-01-17 13:44:04",
                                    "freightAmount": "5000",
                                    "taxRate": "6%",
                                    "taxAmount": "319.14999999999998",
                                    "driver": "王成强/13921777996",
                                    "plate": "苏CV3966",
                                    "goodsPack": "配件/20",
                                    "weightVolume": "32000.0/120.0",
                                    "origin": "徐州徐工玖行能源科技有限公司",
                                    "destination": "赤岸镇",
                                    "paidAmount": "5000",
                                    "paidAt": "2026-01-17 17:50:27",
                        },
                        {
                                    "seq": "24",
                                    "orderNo": "YD2601150958000081",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150958000141",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:58:33",
                                    "loadAt": "2026-01-15 10:24:34",
                                    "unloadAt": "2026-01-17 10:42:24",
                                    "finishAt": "2026-01-17 13:43:47",
                                    "freightAmount": "11500",
                                    "taxRate": "6%",
                                    "taxAmount": "734.04",
                                    "driver": "周生/18566580964",
                                    "plate": "渝DB9836",
                                    "goodsPack": "配件/20",
                                    "weightVolume": "32000.0/120.0",
                                    "origin": "德阳欣旺达新能源有限公司",
                                    "destination": "丰巢快递柜(飞毛腿6号宿舍楼负一楼4号丰巢柜)",
                                    "paidAmount": "11500",
                                    "paidAt": "2026-01-17 17:50:32",
                        },
                        {
                                    "seq": "25",
                                    "orderNo": "YD2601150954000080",
                                    "creator": "陈萍/13914450625/南京联畅物流股份有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150954000139",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:54:35",
                                    "loadAt": "2026-01-15 10:06:16",
                                    "unloadAt": "2026-01-16 14:07:52",
                                    "finishAt": "2026-01-16 16:14:43",
                                    "freightAmount": "4700",
                                    "taxRate": "6%",
                                    "taxAmount": "300",
                                    "driver": "刘庆昌/13585382618",
                                    "plate": "苏CLD796",
                                    "goodsPack": "电缆/10",
                                    "weightVolume": "28000.0/70.0",
                                    "origin": "江苏江扬电缆有限公司",
                                    "destination": "创园大道",
                                    "paidAmount": "4700",
                                    "paidAt": "2026-01-16 17:23:55",
                        },
                        {
                                    "seq": "26",
                                    "orderNo": "YD2601150929000059",
                                    "creator": "杨贵洲/18651837187/镇江市贵邦物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150929000101",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:29:54",
                                    "loadAt": "2026-01-15 17:06:46",
                                    "unloadAt": "2026-01-16 10:16:11",
                                    "finishAt": "2026-01-16 10:16:48",
                                    "freightAmount": "4000",
                                    "taxRate": "6%",
                                    "taxAmount": "255.32",
                                    "driver": "周玉清/13235347968",
                                    "plate": "鲁NE3553",
                                    "goodsPack": "工业品/6000",
                                    "weightVolume": "28000.0/150.0",
                                    "origin": "科冠工业集团",
                                    "destination": "山东欧曼汽车环保科技有限公司",
                                    "paidAmount": "4000",
                                    "paidAt": "2026-01-16 17:17:35",
                        },
                        {
                                    "seq": "27",
                                    "orderNo": "YD2601150927000056",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150927000099",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:27:15",
                                    "loadAt": "2026-01-15 10:57:18",
                                    "unloadAt": "2026-01-15 14:14:06",
                                    "finishAt": "2026-01-15 17:38:37",
                                    "freightAmount": "500",
                                    "taxRate": "6%",
                                    "taxAmount": "31.91",
                                    "driver": "王东/19855005951",
                                    "plate": "苏AE2028",
                                    "goodsPack": "配件/12",
                                    "weightVolume": "8000.0/25.0",
                                    "origin": "安徽卓基工业设备有限公司",
                                    "destination": "南京布雷博制动系统有限公司",
                                    "paidAmount": "500",
                                    "paidAt": "2026-01-16 11:07:10",
                        },
                        {
                                    "seq": "28",
                                    "orderNo": "YD2601150923000052",
                                    "creator": "黄光辉/15016793637/怀化飞鸿物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150923000095",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:23:05",
                                    "loadAt": "2026-01-15 11:45:59",
                                    "unloadAt": "2026-01-16 20:54:38",
                                    "finishAt": "2026-01-16 21:03:20",
                                    "freightAmount": "4930",
                                    "taxRate": "6.5%",
                                    "taxAmount": "342.73",
                                    "driver": "韦远锋/13737952533",
                                    "plate": "桂BL0969",
                                    "goodsPack": "三聚磷酸钠/1",
                                    "weightVolume": "35000.0/0.001",
                                    "origin": "六塘工业园六塘工业园兴发厂",
                                    "destination": "东莞市嘉吉实业有限公司",
                                    "paidAmount": "4930",
                                    "paidAt": "2026-01-17 17:50:29",
                        },
                        {
                                    "seq": "29",
                                    "orderNo": "YD2601150920000050",
                                    "creator": "吴红国/13856606515/池州市姚街老屋运输有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150920000093",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:20:36",
                                    "loadAt": "2026-01-15 19:56:10",
                                    "unloadAt": "2026-01-16 13:31:38",
                                    "finishAt": "2026-01-16 15:30:13",
                                    "freightAmount": "5200",
                                    "taxRate": "6%",
                                    "taxAmount": "331.91",
                                    "driver": "权良波/19965556276",
                                    "plate": "皖N73639",
                                    "goodsPack": "海绵卷/135",
                                    "weightVolume": "4.8/138.0",
                                    "origin": "安徽财纳伽善科技有限公司",
                                    "destination": "温州正森环保科技有限公司",
                                    "paidAmount": "5200",
                                    "paidAt": "2026-01-16 17:24:20",
                        },
                        {
                                    "seq": "30",
                                    "orderNo": "YD2601150851000025",
                                    "creator": "张延辉/18705157801/江苏速淳物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150851000047",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 08:51:29",
                                    "loadAt": "2026-01-15 11:51:40",
                                    "unloadAt": "2026-01-16 10:35:58",
                                    "finishAt": "2026-01-16 14:01:50",
                                    "freightAmount": "2100",
                                    "taxRate": "6%",
                                    "taxAmount": "134.04",
                                    "driver": "张顺民/15056111618",
                                    "plate": "皖M7B225",
                                    "goodsPack": "化肥/1",
                                    "weightVolume": "0.0/0.001",
                                    "origin": "锦泰生物科技(安徽)有限公司",
                                    "destination": "江苏福齐天生物科技有限公司",
                                    "paidAmount": "2100",
                                    "paidAt": "2026-01-16 17:24:19",
                        },
                        
            ];

        // 强制重置数据以显示乐享模板字段
        const shouldResetWaybills =
            !waybills ||
            !waybills.length ||
            !waybills[0].orderNo ||
            waybills.length !== excelWaybills.length ||
            waybills[0].orderNo !== excelWaybills[0].orderNo;

        if (shouldResetWaybills) {
            waybills = excelWaybills.map((row, index) => {
                const status = "未挂帐";
                const totalAmount = row.freightAmount || row.paidAmount || "0";
                const bizDate = row.createdAt ? row.createdAt.slice(0, 10) : "";
                return {
                    id: row.orderNo,
                    client: row.creator,
                    bizDate,
                    route: `${row.origin} -> ${row.destination}`,
                    goods: row.goodsPack,
                    weight: row.weightVolume,
                    totalAmount,
                    status,
                    details: {},
                    reconId: "",
                    ...row,
                };
            });
            sessionStorage.setItem("BizWaybills", JSON.stringify(waybills));
            sessionStorage.setItem("WaybillPendingReset", "1");
        } else if (!sessionStorage.getItem("WaybillPendingReset") && waybills && waybills.length) {
            waybills = waybills.map((item) => ({
                ...item,
                status: "未挂帐",
                reconId: "",
            }));
            sessionStorage.setItem("BizWaybills", JSON.stringify(waybills));
            sessionStorage.setItem("WaybillPendingReset", "1");
        }

        // 兼容旧状态（待结算/已结算） -> 未挂帐/已挂帐
        if (waybills && waybills.length) {
            let statusChanged = false;
            waybills = waybills.map((item) => {
                let status = item.status;
                if (status === "待结算") {
                    status = "未挂帐";
                    statusChanged = true;
                } else if (status === "已结算") {
                    status = "已挂帐";
                    statusChanged = true;
                }
                return { ...item, status };
            });
            if (statusChanged) {
                sessionStorage.setItem("BizWaybills", JSON.stringify(waybills));
            }
        }

        if (!window.settlementWaybillSetPage) {
            window.settlementWaybillSetPage = function (page) {
                window._settlementWaybillPage = page;
                loadContent("SettlementWaybill");
            };
        }

	        if (!window.settlementWaybillSetPageSize) {
	            window.settlementWaybillSetPageSize = function (size) {
	                window._settlementWaybillPageSize = Number(size) || 10;
	                window._settlementWaybillPage = 1;
	                loadContent("SettlementWaybill");
	            };
	        }

	        if (!window.settlementWaybillApplyFilters) {
	            window.settlementWaybillApplyFilters = function () {
	                const getVal = (id) => {
	                    const el = document.getElementById(id);
	                    return el ? (el.value || "").toString().trim() : "";
	                };
	                window._settlementWaybillFilters = {
	                    site: getVal("wb_q_site"),
	                    dateStart: getVal("wb_q_date_start"),
	                    dateEnd: getVal("wb_q_date_end"),
	                    route: getVal("wb_q_route"),
	                    origin: getVal("wb_q_origin"),
	                    destination: getVal("wb_q_dest"),
	                    waybillNos: getVal("wb_f_waybillNos"),
	                    goodsNos: getVal("wb_f_goodsNos"),
	                    status: getVal("wb_f_waybill_status"),
	                };
	                window._settlementWaybillPage = 1;
	                loadContent("SettlementWaybill");
	            };
	        }

	        if (!window.settlementWaybillResetFilters) {
	            window.settlementWaybillResetFilters = function () {
	                window._settlementWaybillFilters = {};
	                window._settlementWaybillPage = 1;
	                loadContent("SettlementWaybill");
	            };
	        }

	        if (!window.settlementWaybillExport) {
	            window.settlementWaybillExport = function () {
	                const cols = window._settlementWaybillExportColumns || [];
	                const data = window._settlementWaybillExportData || [];
	                if (!cols.length) return alert("未找到可导出的列。");
	                const escapeCsv = (val) => {
	                    const s = (val ?? "").toString();
	                    if (/[\",\\n\\r]/.test(s)) return `\"${s.replace(/\"/g, '\"\"')}\"`;
	                    return s;
	                };
	                const lines = [];
	                lines.push(cols.map((c) => escapeCsv(c.label)).join(","));
	                data.forEach((row) => {
	                    lines.push(cols.map((c) => escapeCsv(row[c.key] ?? "")).join(","));
	                });
	                const blob = new Blob([lines.join("\\n")], { type: "text/csv;charset=utf-8" });
	                const a = document.createElement("a");
	                const url = URL.createObjectURL(blob);
	                a.href = url;
	                a.download = `运单挂账_${new Date().toISOString().slice(0, 10)}.csv`;
	                document.body.appendChild(a);
	                a.click();
	                a.remove();
	                setTimeout(() => URL.revokeObjectURL(url), 500);
	            };
	        }

	        if (!window.settlementWaybillPrint) {
	            window.settlementWaybillPrint = function () {
	                window.print();
	            };
	        }

	        if (!window.settlementWaybillToolbarSettle) {
	            window.settlementWaybillToolbarSettle = function () {
	                const checked = Array.from(document.querySelectorAll(".wb-check:checked"));
	                if (!checked.length) return alert("请先勾选需要挂账的运单。");
	                if (checked.length > 1) return alert("当前演示版一次只支持对单票挂账，请逐票操作。");
	                const id = checked[0].value;
	                if (typeof window.settleWaybill === "function") {
	                    window.settleWaybill(id);
	                } else {
	                    alert("未找到挂账逻辑 (settleWaybill)。");
	                }
	            };
	        }

		        if (!window.settlementWaybillToolbarCancel) {
		            window.settlementWaybillToolbarCancel = function () {
		                const checked = Array.from(document.querySelectorAll(".wb-check:checked"));
		                if (!checked.length) return alert("请先勾选需要取消挂账的运单。");
		                if (checked.length > 1) return alert("当前演示版一次只支持对单票取消挂账，请逐票操作。");
		                const id = checked[0].value;
		                if (typeof window.cancelWaybill === "function") {
		                    window.cancelWaybill(id);
		                } else {
		                    alert("未找到取消挂账逻辑 (cancelWaybill)。");
		                }
		            };
		        }

		        if (!window.settlementWaybillUpdateSelection) {
		            window.settlementWaybillUpdateSelection = function () {
		                const moneyKeys = Array.isArray(window._settlementWaybillMoneyKeys)
		                    ? window._settlementWaybillMoneyKeys
		                    : [];
		                const rowMap = window._settlementWaybillRowMap || {};
		                const toNumber = (raw) => {
		                    const s = (raw ?? "").toString().replace(/,/g, "").trim();
		                    if (!s) return 0;
		                    const n = Number(s);
		                    return Number.isFinite(n) ? n : 0;
		                };
		                const fmt = (n) => {
		                    if (!n) return "";
		                    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
		                };

		                const checked = Array.from(document.querySelectorAll(".wb-check:checked"));
		                const ids = checked.map((cb) => cb.value).filter(Boolean);
		                const sums = {};
		                moneyKeys.forEach((k) => { sums[k] = 0; });
		                ids.forEach((id) => {
		                    const row = rowMap[id];
		                    if (!row) return;
		                    moneyKeys.forEach((k) => {
		                        sums[k] += toNumber(row[k]);
		                    });
		                });

		                const countEl = document.getElementById("wb_sel_count");
		                if (countEl) countEl.textContent = `${ids.length}单`;
		                moneyKeys.forEach((k) => {
		                    const el = document.getElementById(`wb_sel_sum_${k}`);
		                    if (!el) return;
		                    el.textContent = fmt(sums[k]);
		                });
		            };
		        }

		        const filters = window._settlementWaybillFilters || {};

	        const esc = (val) => (val ?? "").toString()
	            .replace(/&/g, "&amp;")
	            .replace(/</g, "&lt;")
	            .replace(/>/g, "&gt;")
	            .replace(/\"/g, "&quot;")
	            .replace(/'/g, "&#39;");

	        const parseTokens = (raw) => {
	            const text = (raw || "").toString().trim();
	            if (!text) return [];
	            return text
	                .split(/[\n,，;；\\s]+/)
	                .map((t) => t.trim())
	                .filter(Boolean);
	        };

	        const parseDateOnly = (raw) => {
	            const s = (raw || "").toString().trim();
	            if (!s) return null;
	            const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
	            if (!m) return null;
	            const d = new Date(`${m[1]}T00:00:00`);
	            return Number.isNaN(d.getTime()) ? null : d;
	        };

	        const normalizeAccrualStatus = (raw) => {
	            const s = (raw || "").toString().trim();
	            if (!s) return "";
	            // 兼容页面老用词：挂帐 -> 挂账
	            if (s === "未挂帐") return "未挂账";
	            if (s === "已挂帐") return "已挂账";
	            return s.replace(/挂帐/g, "挂账");
	        };

	        const toNumber = (raw) => {
	            const s = (raw ?? "").toString().replace(/,/g, "").trim();
	            if (!s) return 0;
	            const n = Number(s);
	            return Number.isFinite(n) ? n : 0;
	        };

	        const formatMoney = (raw) => {
	            const n = toNumber(raw);
	            if (!n) return "";
	            return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
	        };

	        const decoratedWaybills = (Array.isArray(waybills) ? waybills : []).map((w, idx) => {
	            const site = w && w.site ? w.site : (idx % 2 === 0 ? "专线A" : "专线B");
	            const waybillNo = (w && (w.id || w.orderNo)) ? (w.id || w.orderNo) : "";
	            const goodsNo = (w && (w.goodsNo || w.driverOrderNo)) ? (w.goodsNo || w.driverOrderNo) : "";
	            const createdAt = (w && w.createdAt) ? w.createdAt : (w && w.bizDate ? w.bizDate : "");
	            const originStation = w && w.origin ? w.origin : "";
	            const destinationStation = w && w.destination ? w.destination : "";
	            const routeLine = w && w.routeLine ? w.routeLine : (site === "专线A" ? "专线A->专线B" : "专线B->专线A");
	            const shipper = w && w.shipper ? w.shipper : (w && w.creator ? (w.creator.split("/")[0] || "") : "");
	            const consignee = w && w.consignee ? w.consignee : "";
	            const waybillAccrualStatus = normalizeAccrualStatus(w && w.status ? w.status : "");

	            const baseAmount = (w && (w.totalAmount || w.freightAmount || w.amount || w.paidAmount)) ? (w.totalAmount || w.freightAmount || w.amount || w.paidAmount) : "";
	            const cashPay = formatMoney(baseAmount);
	            const cashPayAccrualStatus = waybillAccrualStatus;

	            return {
	                ...w,
	                site,
	                waybillNo,
	                goodsNo,
	                createdAt,
	                originStation,
	                destinationStation,
	                routeLine,
	                shipper,
	                consignee,
	                waybillAccrualStatus,
	                cashPay,
	                cashPayAccrualStatus,
	                arrivePay: "",
	                arrivePayAccrualStatus: "",
	                monthlyPay: "",
	                monthlyPayAccrualStatus: "",
	                cashReturn: "",
	                cashReturnAccrualStatus: "",
	                debtReturn: "",
	                debtReturnAccrualStatus: "",
	                transferFeeTotal: "",
	                transferFeeAccrualStatus: "",
	                codAmount: "",
	                codAccrualStatus: "",
	                codServiceFee: "",
	                codServiceFeeAccrualStatus: "",
	                pickupFee: "",
	                pickupFeeAccrualStatus: "",
	                warehouseFee: "",
	                warehouseFeeAccrualStatus: "",
	                advanceFee: "",
	                advanceFeeAccrualStatus: "",
	                collectFreight: "",
	                collectFreightAccrualStatus: "",
	                remark: (w && w.remark) ? w.remark : "",
	                flag: (w && w.flag) ? w.flag : "",
	            };
	        });

	        const waybillNosFilter = parseTokens(filters.waybillNos);
	        const goodsNosFilter = parseTokens(filters.goodsNos);
	        const statusFilter = (filters.status || "").toString().trim();
	        const siteFilter = (filters.site || "").toString().trim();
	        const routeFilter = (filters.route || "").toString().trim();
	        const originFilter = (filters.origin || "").toString().trim();
	        const destFilter = (filters.destination || "").toString().trim();
	        const dateStart = parseDateOnly(filters.dateStart);
	        const dateEnd = parseDateOnly(filters.dateEnd);

	        const filteredWaybills = decoratedWaybills.filter((w) => {
	            if (siteFilter && w.site !== siteFilter) return false;
	            if (statusFilter && w.waybillAccrualStatus !== statusFilter) return false;
	            if (routeFilter && !(w.routeLine || "").includes(routeFilter)) return false;
	            if (originFilter && !(w.originStation || "").includes(originFilter)) return false;
	            if (destFilter && !(w.destinationStation || "").includes(destFilter)) return false;
	            if (waybillNosFilter.length) {
	                const id = (w.waybillNo || w.id || "").toString();
	                if (waybillNosFilter.length === 1) {
	                    if (!id.includes(waybillNosFilter[0])) return false;
	                } else {
	                    const set = new Set(waybillNosFilter);
	                    if (!set.has(id)) return false;
	                }
	            }
	            if (goodsNosFilter.length) {
	                const id = (w.goodsNo || "").toString();
	                if (goodsNosFilter.length === 1) {
	                    if (!id.includes(goodsNosFilter[0])) return false;
	                } else {
	                    const set = new Set(goodsNosFilter);
	                    if (!set.has(id)) return false;
	                }
	            }
	            if (dateStart || dateEnd) {
	                const d = parseDateOnly(w.createdAt);
	                if (!d) return false;
	                if (dateStart && d < dateStart) return false;
	                if (dateEnd && d > dateEnd) return false;
	            }
	            return true;
	        });

	        const pageSize = window._settlementWaybillPageSize || 10;
	        const totalPages = Math.max(1, Math.ceil(filteredWaybills.length / pageSize));
	        let currentPage = window._settlementWaybillPage || 1;
	        if (currentPage > totalPages) currentPage = totalPages;

	        const pageStart = (currentPage - 1) * pageSize;
		        const pagedWaybills = filteredWaybills.slice(pageStart, pageStart + pageSize);

		        const moneyKeys = accrualColumns
		            .filter((c) => c && c.align === "right" && c.key)
		            .map((c) => c.key);

		        const sumMoney = (list) => {
		            const sums = {};
		            moneyKeys.forEach((k) => { sums[k] = 0; });
		            (Array.isArray(list) ? list : []).forEach((row) => {
		                moneyKeys.forEach((k) => {
		                    sums[k] += toNumber(row[k]);
		                });
		            });
		            return sums;
		        };

		        const totalSums = sumMoney(filteredWaybills);
		        const fmtSum = (n) => {
		            if (!n) return "";
		            return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
		        };

		        // 供导出使用
		        window._settlementWaybillExportColumns = accrualColumns;
		        window._settlementWaybillExportData = filteredWaybills;
		        window._settlementWaybillMoneyKeys = moneyKeys;
		        window._settlementWaybillRowMap = Object.fromEntries(pagedWaybills.map((w) => [w.id, w]));

		        const renderCell = (w, col) => {
		            let value = w[col.key];
		            if (col.key === "waybillNo") {
		                const id = esc(value || w.id || "");
		                return `<a class="wb-link" href="javascript:void(0)">${id}</a>`;
		            }
		            if (col.align === "right") {
		                const text = esc(value || "");
		                const isPos = toNumber(value) > 0;
		                const isSettled = (w.waybillAccrualStatus || "") === "已挂账";
		                const cls = isSettled ? "is-settled" : (isPos ? "is-pos" : "");
		                return `<span class="wb-money ${cls}">${text}</span>`;
		            }
		            return esc(value || "");
		        };

		        const dataRows = pagedWaybills
		            .map((w, idx) => {
		                const rowNo = pageStart + idx + 1;
		                return `<tr>
		                        <td class="sticky-left-1 wb-rowno">${rowNo}</td>
		                        <td class="sticky-left-2">
		                            <input type="checkbox" class="wb-check" value="${esc(w.id)}" data-client="${esc(w.client || "")}" onchange="settlementWaybillUpdateSelection()">
		                        </td>
		                        ${accrualColumns.map((col) => {
		                            const alignStyle = col.align ? ` style="text-align:${col.align};"` : "";
		                            return `<td${alignStyle}>${renderCell(w, col)}</td>`;
		                        }).join("")}
		                    </tr>`;
		            })
		            .join("");

		        const fillerCount = Math.max(0, pageSize - pagedWaybills.length);
		        const fillerRows = fillerCount
		            ? Array.from({ length: fillerCount }).map(() => {
		                return `<tr class="wb-empty-row">
		                        <td class="sticky-left-1 wb-rowno">&nbsp;</td>
		                        <td class="sticky-left-2">&nbsp;</td>
		                        ${accrualColumns.map((col) => {
		                            const alignStyle = col.align ? ` style="text-align:${col.align};"` : "";
		                            return `<td${alignStyle}>&nbsp;</td>`;
		                        }).join("")}
		                    </tr>`;
		            }).join("")
		            : "";

		        const rows = dataRows + fillerRows;

		        const siteOptions = Array.from(new Set(decoratedWaybills.map((w) => w.site))).sort();
		        const siteSelectHtml = `
		            <option value="">全部</option>
		            ${siteOptions.map((opt) => `<option value="${esc(opt)}" ${filters.site === opt ? "selected" : ""}>${esc(opt)}</option>`).join("")}
		        `;

			        const buildFilterCell = (col) => {
			            if (!col.filter) {
			                return `<th class="sticky-filter"><input class="wb-filter-input wb-filter-input--blank" disabled></th>`;
			            }
		            const f = col.filter;
		            if (f.type === "select") {
		                const opts = Array.isArray(f.options) ? f.options : [""];
		                const current = (filters.status || "").toString();
		                return `<th class="sticky-filter"><select id="${esc(f.id)}" class="wb-filter-select">${opts.map((opt) => {
		                    const label = opt || "全部";
		                    const selected = opt && current === opt ? "selected" : (!opt && !current ? "selected" : "");
		                    return `<option value="${esc(opt)}" ${selected}>${esc(label)}</option>`;
		                }).join("")}</select></th>`;
		            }
		            const val = f.id === "wb_f_waybillNos" ? (filters.waybillNos || "") : (f.id === "wb_f_goodsNos" ? (filters.goodsNos || "") : "");
		            const extraClass = (f.placeholder || "").includes("批量") ? " wb-filter-input--batch" : "";
		            return `<th class="sticky-filter"><input id="${esc(f.id)}" class="wb-filter-input${extraClass}" placeholder="${esc(f.placeholder || "")}" value="${esc(val)}"></th>`;
			        };

		        const buildFooterCells = (mode) => {
		            const isSelected = mode === "sel";
		            const countId = isSelected ? "wb_sel_count" : "wb_total_count";
		            const countText = isSelected ? "0单" : `${filteredWaybills.length}单`;
		            return accrualColumns.map((col) => {
		                const alignStyle = col.align ? ` style="text-align:${col.align};"` : "";
		                if (col.key === "waybillNo") {
		                    return `<td${alignStyle}><span id="${esc(countId)}" class="wb-foot__count">${esc(countText)}</span></td>`;
		                }
		                if (col.align === "right") {
		                    const id = isSelected ? `wb_sel_sum_${col.key}` : `wb_total_sum_${col.key}`;
		                    const val = isSelected ? "" : fmtSum(totalSums[col.key] || 0);
		                    return `<td${alignStyle}><span id="${esc(id)}" class="wb-foot__amt">${esc(val)}</span></td>`;
		                }
		                return `<td${alignStyle}>&nbsp;</td>`;
		            }).join("");
		        };

		        contentHTML += `
		                    <h2>运单挂账</h2>

	                    <div class="wb-querybar">
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">网点</div>
	                            <select id="wb_q_site" class="wb-q-control">
	                                ${siteSelectHtml}
	                            </select>
	                        </div>
	                        <div class="wb-q-item wb-q-item--date">
	                            <div class="wb-q-label">开单时间</div>
	                            <div class="wb-q-date">
	                                <input id="wb_q_date_start" class="wb-q-control" type="date" value="${esc(filters.dateStart || "")}">
	                                <span class="wb-q-date__sep">~</span>
	                                <input id="wb_q_date_end" class="wb-q-control" type="date" value="${esc(filters.dateEnd || "")}">
	                            </div>
	                        </div>
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">路由</div>
	                            <input id="wb_q_route" class="wb-q-control" type="text" value="${esc(filters.route || "")}">
	                        </div>
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">发站</div>
	                            <input id="wb_q_origin" class="wb-q-control" type="text" value="${esc(filters.origin || "")}">
	                        </div>
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">到站</div>
	                            <input id="wb_q_dest" class="wb-q-control" type="text" value="${esc(filters.destination || "")}">
	                        </div>
	                        <button class="wb-btn wb-btn--primary" onclick="settlementWaybillApplyFilters()">查询</button>
	                        <button class="wb-btn" onclick="settlementWaybillResetFilters()">重置</button>
	                    </div>

		                    <div class="wb-toolbar">
		                        <div class="wb-toolbar__left">
		                            <button class="wb-btn" onclick="settlementWaybillToolbarSettle()">挂账</button>
		                            <button class="wb-btn" onclick="settlementWaybillToolbarCancel()">取消挂账</button>
		                        </div>
		                        <div class="wb-toolbar__right">
	                            <button class="wb-btn" onclick="settlementWaybillExport()">导出</button>
	                            <button class="wb-btn" onclick="settlementWaybillPrint()">打印</button>
		                            <div class="wb-pager">
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(1)" ${currentPage <= 1 ? "disabled" : ""}>|&lt;</button>
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(${Math.max(1, currentPage - 1)})" ${currentPage <= 1 ? "disabled" : ""}>&lt;</button>
	                                <span class="wb-pager__text">第</span>
	                                <span class="wb-pager__page">${currentPage}</span>
	                                <span class="wb-pager__text">页/共${totalPages}页</span>
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(${Math.min(totalPages, currentPage + 1)})" ${currentPage >= totalPages ? "disabled" : ""}>&gt;</button>
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(${totalPages})" ${currentPage >= totalPages ? "disabled" : ""}>&gt;|</button>
	                                <select class="wb-pager__size" onchange="settlementWaybillSetPageSize(this.value)">
	                                    <option value="10" ${pageSize === 10 ? "selected" : ""}>0-9</option>
	                                    <option value="30" ${pageSize === 30 ? "selected" : ""}>0-29</option>
	                                </select>
		                            </div>
		                        </div>
		                    </div>

		                    <div class="settlement-waybill-table wb-accrual-table" style="--sticky-left-1:46px; --sticky-left-2:46px;">
		                        <table class="data-table" style="white-space:nowrap;">
		                            <thead>
		                                <tr>
		                                    <th class="sticky-header sticky-left-1"><span class="wb-funnel" title="筛选"></span></th>
		                                    <th class="sticky-header sticky-left-2"><input type="checkbox" onclick="toggleAll(this); settlementWaybillUpdateSelection();"></th>
		                                    ${accrualColumns.map((col) => `<th class="sticky-header"${col.align ? ` style="text-align:${col.align};"` : ""}>${esc(col.label)}</th>`).join("")}
		                                </tr>
		                                <tr>
		                                    <th class="sticky-filter sticky-left-1">筛选</th>
		                                    <th class="sticky-filter sticky-left-2"></th>
		                                    ${accrualColumns.map((col) => buildFilterCell(col)).join("")}
		                                </tr>
		                            </thead>
		                            <tbody>${rows || `<tr><td colspan="${accrualColumns.length + 2}" style="text-align:center; color:#999; padding:18px;">暂无数据</td></tr>`}</tbody>
		                            <tfoot>
		                                <tr class="wb-foot wb-foot--sel">
		                                    <td class="sticky-left-1 wb-foot__label">选中</td>
		                                    <td class="sticky-left-2"></td>
		                                    ${buildFooterCells("sel")}
		                                </tr>
		                                <tr class="wb-foot wb-foot--total">
		                                    <td class="sticky-left-1 wb-foot__label">合计</td>
		                                    <td class="sticky-left-2"></td>
		                                    ${buildFooterCells("total")}
		                                </tr>
		                            </tfoot>
		                        </table>
		                    </div>
		                `;
		    }

    // =========================================================================
    // 5. 干线批次挂帐 (SettlementTrunk) - [数据升级：支持详尽费用明细]
    // =========================================================================
    else if (moduleCode === "SettlementTrunk") {
        let trunkBatches = JSON.parse(sessionStorage.getItem('TrunkBatches'));

        // 如果数据结构里没有 unloading (卸车费)，强制刷新数据
        if (trunkBatches && trunkBatches.length > 0 && trunkBatches[0].fees.unloading === undefined) {
            trunkBatches = null;
        }

        if (!trunkBatches || trunkBatches.length < 5) {
            trunkBatches = [];
            const routeMap = [
                { r: "上海->北京", b: "上海浦东分拨中心", dest: "北京顺义转运场" },
                { r: "广州->武汉", b: "广州白云转运中心", dest: "武汉东西湖分拨" },
                { r: "成都->西安", b: "成都双流集散仓", dest: "西安沣东转运中心" },
                { r: "深圳->长沙", b: "深圳宝安分拨中心", dest: "长沙雨花集散地" },
                { r: "杭州->郑州", b: "杭州萧山转运场", dest: "郑州经开分拨" }
            ];
            const drivers = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十", "郑十一", "卫十二"];
            const batchStatuses = ["运输中", "已到达", "已卸车", "已发车"];
            const payTypes = ["现付", "到付", "回单付", "月结"];

            for (let i = 1; i <= 10; i++) {
                const isSettled = i <= 3;
                const currentPayType = payTypes[i % 4];
                const routeInfo = routeMap[i % 5];
                const dateBase = `2025-11-${10 + i}`;

                // ★★★ 费用构成模拟 ★★★
                const baseFee = 2500 + (i * 100); // 干线费
                const loadFee = 200;              // 装车费
                const unloadFee = i % 2 === 0 ? 150 : 0; // 卸车费 (偶数行有)
                const abnFee = i % 3 === 0 ? 50 : 0;     // 异动费 (每3行有)
                const otherFee = i % 5 === 0 ? 100 : 0;  // 其他费 (每5行有)

                const total = baseFee + loadFee + unloadFee + abnFee + otherFee;

                trunkBatches.push({
                    id: `APC2511${i.toString().padStart(3, '0')}`,
                    branch: routeInfo.b,
                    route: routeInfo.r,
                    plate: `沪A${1000 + i}`,
                    driver: drivers[i - 1],
                    date: dateBase,
                    batchStatus: batchStatuses[i % 4],
                    settlementStatus: isSettled ? "已挂帐" : "未挂帐",
                    paymentType: currentPayType,

                    totalAmount: total,
                    paidAmount: isSettled ? total : 0,

                    // ★★★ 详细费用结构 ★★★
                    fees: {
                        trunk: baseFee,         // 干线费
                        loading: loadFee,       // 装车费
                        unloading: unloadFee,   // 卸车费
                        abnormal: abnFee,       // 异动费
                        abnormalDesc: "停车费", // 异动说明
                        other: otherFee,        // 其他费
                        otherDesc: "雨布耗材"   // 其他说明
                    },

                    timeline: [
                        { time: `${dateBase} 08:30`, event: "创建批次，等待装车" },
                        { time: `${dateBase} 10:30`, event: "司机已发车" },
                        { time: `${dateBase} 23:45`, event: `预计到达【${routeInfo.dest}】` }
                    ]
                });
            }
            sessionStorage.setItem('TrunkBatches', JSON.stringify(trunkBatches));
        }

        // 渲染表格 (保持原样，只做简单展示)
        const rows = trunkBatches.map(row => {
            let batchBadge = "";
            switch (row.batchStatus) {
                case '已卸车': batchBadge = `<span style="color:#27ae60; border:1px solid #27ae60; padding:1px 4px; border-radius:3px; font-size:11px;"> 已卸车</span>`; break;
                case '运输中': batchBadge = `<span style="color:#3498db; border:1px solid #3498db; padding:1px 4px; border-radius:3px; font-size:11px;"> 运输中</span>`; break;
                default: batchBadge = `<span style="color:#f39c12; border:1px solid #f39c12; padding:1px 4px; border-radius:3px; font-size:11px;">${row.batchStatus}</span>`;
            }

            let typeBadge = "";
            if (row.paymentType === '现付') typeBadge = `<span style="color:#e67e22; background:#fff7e6; padding:2px 6px; border-radius:4px;"> 现付</span>`;
            else if (row.paymentType === '到付') typeBadge = `<span style="color:#2980b9; background:#e6f7ff; padding:2px 6px; border-radius:4px;"> 到付</span>`;
            else if (row.paymentType === '回单付') typeBadge = `<span style="color:#8e44ad; background:#f3e5f5; padding:2px 6px; border-radius:4px;"> 回单付</span>`;
            else typeBadge = `<span style="color:#16a085; background:#e8f8f5; padding:2px 6px; border-radius:4px;"> 月结</span>`;

            const moneyHtml = row.settlementStatus === '已挂帐'
                ? `<div style="color:#27ae60; font-weight:bold; font-size:15px;">${row.totalAmount.toLocaleString()} <span style="font-size:12px">✔</span></div>`
                : `<div style="color:#e74c3c; font-weight:bold; font-size:15px;">${row.totalAmount.toLocaleString()}</div>`;

            let actionBtn = row.settlementStatus === '已挂帐'
                ? `<span style="color:#ccc; font-size:12px;">已转应付</span>`
                : `<button class="btn-primary" style="padding:4px 10px; font-size:12px;" onclick="sendToAP('${row.id}')">挂帐</button>`;

            return `
            <tr>
                <td><a href="javascript:void(0)" onclick="viewTrunkDetail('${row.id}')" style="font-weight:bold; color:#3498db;">${row.id}</a></td>
                <td>${row.branch}</td>
                <td><span style="color:#333; font-weight:500;">${row.route}</span></td>
                <td><div style="font-weight:bold;">${row.plate}</div><div style="font-size:12px; color:#666;">${row.driver}</div></td>
                <td>${batchBadge}</td>
                <td>${typeBadge}</td>
                <td style="text-align:right;">${moneyHtml}</td>
                <td style="text-align:right; font-size:12px; color:#999;"> </td>
                <td>${row.settlementStatus === '已挂帐' ? '<span style="color:#27ae60;">已挂帐</span>' : '<span style="color:#e74c3c;">未挂帐</span>'}</td>
                <td>${actionBtn}</td>
            </tr>
        `;
        }).join('');

        contentHTML += `
        <h2>干线批次挂帐 (Trunk Settlement)</h2>
        <div class="filter-area" style="display:flex; gap:10px; margin-bottom:15px;">
            <input type="text" placeholder="批次号/车牌" style="padding:8px; border:1px solid #ccc;">
            <select style="padding:8px; border:1px solid #ccc;"><option>全部支付方式</option><option>现付</option><option>到付</option><option>回单付</option><option>月结</option></select>
            <button class="btn-primary">查询</button>
        </div>
        <table class="data-table">
            <thead><tr><th>批次号</th><th>出发网点</th><th>线路</th><th>车辆/司机</th><th>批次状态</th><th>支付方式</th><th style="text-align:right;">总运费</th><th style="text-align:right;">费用备注</th><th>结算状态</th><th>操作</th></tr></thead>
            <tbody>${rows}</tbody>
        </table>
    `;
    }

    // =========================================================================
    // 5.1 干线批次详情页 (SettlementTrunkDetail) - [全字段固定展示版]
    // =========================================================================
    else if (moduleCode === "SettlementTrunkDetail") {
        const id = window.g_currentTrunkId;
        const list = JSON.parse(sessionStorage.getItem('TrunkBatches') || "[]");
        const item = list.find(i => i.id === id);

        if (!item) {
            contentHTML += `<div style="padding:20px;"><h3>⚠️ 数据缺失</h3><button class="btn-primary" onclick="loadContent('SettlementTrunk')">返回列表</button></div>`;
        } else {
            // 1. 时间轴 (保持不变)
            const timelineHtml = item.timeline ? item.timeline.map((t, index) => {
                const isLast = index === item.timeline.length - 1;
                const color = isLast ? '#27ae60' : '#3498db';
                return `
              <div style="display:flex; margin-bottom:0;">
                  <div style="width:140px; text-align:right; padding-right:15px; color:#999; font-size:12px; padding-top:2px;">${t.time}</div>
                  <div style="position:relative; border-left:2px solid #eee; padding-left:20px; padding-bottom:20px;">
                      <div style="position:absolute; left:-6px; top:4px; width:10px; height:10px; border-radius:50%; background:${color}; border:2px solid white; box-shadow:0 0 0 1px ${color};"></div>
                      <div style="font-size:13px; color:#333; font-weight:${isLast ? 'bold' : 'normal'}">${t.event}</div>
                  </div>
              </div>`}).join('') : '';

            // ★★★ 2. 费用明细 (核心修改：全字段列举，0元留空) ★★★
            const fees = item.fees || {};
            let feeRows = "";

            // 辅助函数：如果金额>0显示金额，否则显示 "-"；说明栏同理
            const fmtVal = (val) => (val && val > 0) ? val.toLocaleString() : '-';
            const fmtDesc = (val, desc) => (val && val > 0) ? desc : '';

            // (1) 干线费
            feeRows += `
            <tr>
                <td>干线运费</td>
                <td style="text-align:right; font-weight:bold;">${fmtVal(fees.trunk)}</td>
                <td style="text-align:right; color:#999;">${fmtDesc(fees.trunk, '基础运费')}</td>
            </tr>`;

            // (2) 装车费
            feeRows += `
            <tr>
                <td>装车费</td>
                <td style="text-align:right;">${fmtVal(fees.loading)}</td>
                <td style="text-align:right; color:#999;">${fmtDesc(fees.loading, '始发操作')}</td>
            </tr>`;

            // (3) 卸车费
            feeRows += `
            <tr>
                <td>卸车费</td>
                <td style="text-align:right;">${fmtVal(fees.unloading)}</td>
                <td style="text-align:right; color:#999;">${fmtDesc(fees.unloading, '到达操作')}</td>
            </tr>`;

            // (4) 异动费用
            feeRows += `
            <tr>
                <td style="${fees.abnormal > 0 ? 'color:#d35400;' : ''}">异动费用</td>
                <td style="text-align:right; ${fees.abnormal > 0 ? 'color:#d35400;' : ''}">${fmtVal(fees.abnormal)}</td>
                <td style="text-align:right; color:#999;">${fmtDesc(fees.abnormal, fees.abnormalDesc)}</td>
            </tr>`;

            // (5) 其他费用
            feeRows += `
            <tr>
                <td>其他费用</td>
                <td style="text-align:right;">${fmtVal(fees.other)}</td>
                <td style="text-align:right; color:#999;">${fmtDesc(fees.other, fees.otherDesc)}</td>
            </tr>`;


            const actionBtn = item.settlementStatus === '已挂帐'
                ? `<button class="btn-primary" disabled style="background:#ccc; cursor:not-allowed;">已转应付</button>`
                : `<button class="btn-primary" style="background:#27ae60;" onclick="sendToAP('${item.id}')">发起挂帐</button>`;

            contentHTML += `
            <div style="margin-bottom:20px;">
                <button class="btn-primary" style="background:#95a5a6; padding:5px 15px;" onclick="loadContent('SettlementTrunk')"> < 返回列表</button>
                <h2 style="display:inline-block; margin-left:15px; vertical-align:middle;">批次详情：<span style="color:#2980b9;">${item.id}</span></h2>
            </div>

            <div style="display:flex; gap:20px;">
                <div style="flex:1;">
                    <div style="background:white; padding:20px; border-radius:8px; margin-bottom:20px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                        <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">🚛 运输信息</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; font-size:14px;">
                            <div><label style="color:#999;">出发网点：</label> <b>${item.branch}</b></div>
                            <div><label style="color:#999;">线路：</label> <b>${item.route}</b></div>
                            <div><label style="color:#999;">状态：</label> <b style="color:#2980b9">${item.batchStatus}</b></div>
                            <div><label style="color:#999;">车牌：</label> ${item.plate}</div>
                            <div><label style="color:#999;">司机：</label> ${item.driver}</div>
                            <div><label style="color:#999;">发车时间：</label> ${item.date}</div>
                        </div>
                    </div>
                    <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                        <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">📍 运输轨迹 (Tracking)</h3>
                        <div style="padding-top:10px;">${timelineHtml}</div>
                    </div>
                </div>

                <div style="flex:1; height:fit-content; background:white; padding:20px; border-radius:8px; border-top:4px solid #e67e22; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin-top:0;">💰 费用结算</h3>
                        <span style="padding:4px 8px; border-radius:4px; font-size:12px; ${item.settlementStatus === '已挂帐' ? 'background:#e6f7ff;color:#2980b9' : 'background:#fff7e6;color:#e67e22'}">
                            ${item.settlementStatus}
                        </span>
                    </div>
                    <table class="data-table">
                        <thead><tr><th>费用项目</th><th style="text-align:right">金额 (RMB)</th><th style="text-align:right">备注</th></tr></thead>
                        <tbody>
                            ${feeRows}
                            <tr style="font-weight:bold; background:#f9f9f9; border-top:2px solid #eee;">
                                <td>应付总额</td>
                                <td style="text-align:right; font-size:18px; color:#e74c3c;">${item.totalAmount.toLocaleString()}</td>
                                <td style="text-align:right;">${item.paymentType}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="margin-top:30px; text-align:right;">${actionBtn}</div>
                </div>
            </div>
          `;
        }
    }

    // =========================================================================
    // 应付管理：仅保留两个子模块（先做空白页）
    // =========================================================================
    else if (moduleCode === "APTrunkBatchSettlement") {
        contentHTML += `<div style="height:600px;"></div>`;
    }
    else if (moduleCode === "APShortBatchSettlement") {
        contentHTML += `<div style="height:600px;"></div>`;
    }
    // 旧模块下线（保留入口以避免老逻辑跳转时报错）
    else if (moduleCode === "APPaymentApply" || moduleCode === "APPrepayment" || moduleCode === "APPaymentVerify") {
        contentHTML += `<div style="padding:20px; color:#999;">该模块已下线，请使用【应付管理 > 干线批次结算 / 短途批次结算】。</div>`;
    }


    // =========================================================================
    // ★★★ [优化版] 科目余额表 (含方向判断 + 借贷平衡) ★★★
    // =========================================================================
    else if (moduleCode === "AcctSubjectBalance") {
        let vouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        let balanceMap = {};
        let totalDebit = 0; // 借方总计
        let totalCredit = 0; // 贷方总计

        // 1. 汇总逻辑
        vouchers.forEach(v => {
            if (v.lines) {
                v.lines.forEach(line => {
                    let fullAccount = line.account || "9999 未知科目";
                    let code = fullAccount.split(' ')[0];
                    let name = fullAccount.split(' ')[1] || fullAccount;

                    if (!balanceMap[code]) {
                        // 初始化：direction 1为借(Asset/Cost), -1为贷(Liability/Equity/Income)
                        // 简单规则：1/5/6开头通常在借方(成本费用)，2/3/4/6(收入)开头通常在贷方
                        // 这里做个简易判断：
                        let dir = 1;
                        if (code.startsWith('2') || code.startsWith('3') || code.startsWith('4') || (code.startsWith('6') && name.includes('收入'))) {
                            dir = -1;
                        }

                        balanceMap[code] = {
                            name: name,
                            dir: dir, // 方向
                            open: 0, // 模拟期初
                            debit: 0,
                            credit: 0
                        };
                    }

                    balanceMap[code].debit += parseFloat(line.debit || 0);
                    balanceMap[code].credit += parseFloat(line.credit || 0);
                });
            }
        });

        // 2. 生成行
        let rows = Object.keys(balanceMap).sort().map(code => {
            let item = balanceMap[code];

            // ★★★ 核心：根据方向计算期末余额 ★★★
            // 如果是借方科目：期初 + 借 - 贷
            // 如果是贷方科目：期初 + 贷 - 借
            let close = 0;
            let dirText = "";

            if (item.dir === 1) {
                dirText = "借";
                close = item.open + item.debit - item.credit;
            } else {
                dirText = "贷";
                close = item.open + item.credit - item.debit;
            }

            // 累加总计
            totalDebit += item.debit;
            totalCredit += item.credit;

            return `
            <tr>
                <td><b>${code}</b></td>
                <td>${item.name}</td>
                <td style="text-align:center; color:#999; font-size:12px;">${dirText}</td>
                <td style="text-align:right; color:#999;">${item.open.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style="text-align:right;">${item.debit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style="text-align:right;">${item.credit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td style="text-align:right; font-weight:bold; color:#2c3e50;">${close.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td>
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#fff; color:#3498db; border:1px solid #3498db;" 
                        onclick="window.openSubjectDetail('${code}', '${item.name}')">
                        明细
                    </button>
                </td>
            </tr>
        `;
        }).join('');

        // 3. 试算平衡行 (Footer)
        let balanceColor = Math.abs(totalDebit - totalCredit) < 0.01 ? '#27ae60' : '#e74c3c';
        let balanceText = Math.abs(totalDebit - totalCredit) < 0.01 ? '✔ 试算平衡' : '❌ 不平衡';

        rows += `
        <tr style="background:#f9f9f9; font-weight:bold; border-top:2px solid #ddd;">
            <td colspan="3" style="text-align:center;">合计 (Total)</td>
            <td>-</td>
            <td style="text-align:right; color:#2980b9;">${totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td style="text-align:right; color:#2980b9;">${totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td style="text-align:right; color:${balanceColor};">${balanceText}</td>
            <td></td>
        </tr>
    `;

        contentHTML += `
        <h2>📊 科目余额表 (Subject Balance Sheet)</h2>
        <div style="margin-bottom:15px; display:flex; gap:10px;">
            <div style="background:#fff; padding:10px 20px; border-left:4px solid #3498db; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <span style="color:#7f8c8d; font-size:12px;">资产总额</span><br>
                <b>${(totalDebit).toLocaleString()}</b>
            </div>
            <div style="background:#fff; padding:10px 20px; border-left:4px solid #27ae60; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <span style="color:#7f8c8d; font-size:12px;">凭证张数</span><br>
                <b>${vouchers.length} 张</b>
            </div>
             <button class="btn-primary" onclick="initDemoFinanceData()" style="margin-left:auto; background:#95a5a6;">🔄 重置测试数据</button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th style="width:100px;">科目编码</th>
                    <th>科目名称</th>
                    <th style="width:50px;">方向</th>
                    <th style="text-align:right;">期初余额</th>
                    <th style="text-align:right;">本期借方</th>
                    <th style="text-align:right;">本期贷方</th>
                    <th style="text-align:right;">期末余额</th>
                    <th style="width:80px;">操作</th>
                </tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="8" style="text-align:center">暂无数据，请点击右上角重置数据</td></tr>'}</tbody>
        </table>
    `;
    }

    // =========================================================================
    // ★★★ [新增模块 2] 科目明细账 (详情页) ★★★
    // =========================================================================
    else if (moduleCode === "AcctSubjectDetail") {
        // 1. 获取当前要查看的科目 (从 sessionStorage 读取)
        let currentCode = sessionStorage.getItem('CurrentSubjectCode');
        let currentName = sessionStorage.getItem('CurrentSubjectName');

        if (!currentCode) {
            contentHTML += `<p style="color:red">请先从【科目余额表】选择一个科目查看。</p>`;
        } else {
            // 2. 筛选该科目的所有分录
            let vouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
            let ledgerRows = [];
            let runningBalance = 0; // 滚存余额

            // 按日期排序
            vouchers.sort((a, b) => new Date(a.date) - new Date(b.date));

            vouchers.forEach(v => {
                if (v.lines) {
                    v.lines.forEach(line => {
                        // 只有包含当前科目的行才显示
                        if (line.account.startsWith(currentCode)) {
                            let debit = parseFloat(line.debit || 0);
                            let credit = parseFloat(line.credit || 0);
                            runningBalance += (debit - credit); // 简单计算余额方向

                            ledgerRows.push(`
                            <tr>
                                <td>${v.date}</td>
                                <td><a href="#">${v.id}</a></td>
                                <td>${line.digest || v.summary || '-'}</td>
                                <td style="text-align:right; color:#27ae60;">${debit ? debit.toLocaleString() : ''}</td>
                                <td style="text-align:right; color:#e74c3c;">${credit ? credit.toLocaleString() : ''}</td>
                                <td style="text-align:right; font-weight:bold;">${runningBalance.toLocaleString()}</td>
                            </tr>
                        `);
                        }
                    });
                }
            });

            contentHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h2>📖 科目明细账：<span style="color:#3498db;">${currentCode} ${currentName}</span></h2>
                <button class="btn-primary" onclick="loadContent('AcctSubjectBalance')">⬅ 返回余额表</button>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>日期</th><th>凭证号</th><th>摘要</th>
                        <th style="text-align:right;">借方金额</th>
                        <th style="text-align:right;">贷方金额</th>
                        <th style="text-align:right;">余额</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background:#fafafa; font-weight:bold;">
                        <td>-</td><td>-</td><td>期初余额</td>
                        <td></td><td></td>
                        <td style="text-align:right;">0.00</td>
                    </tr>
                    ${ledgerRows.join('') || '<tr><td colspan="6" style="text-align:center">该科目本期无发生额</td></tr>'}
                </tbody>
            </table>
        `;
        }
    }


    // =========================================================================
    // 6. 短途批次挂帐 (SettlementShortHaul) - [同城配送/接送货]
    // =========================================================================
    else if (moduleCode === "SettlementShortHaul") {
        let shortBatches = JSON.parse(sessionStorage.getItem('ShortBatches'));

        // 初始化模拟数据
        if (!shortBatches || shortBatches.length < 5) {
            shortBatches = [];
            const areas = ["浦东新区配送", "徐汇-闵行专线", "虹桥机场提货", "宝山仓库-市区", "松江工业区接货"];
            const drivers = ["刘一", "陈二", "张三丰", "李小龙", "王五", "赵六", "钱七", "孙八", "周九", "吴十"];
            // 短途特有的计费模式
            const feeTypes = ["按趟计费", "按重量计费", "按票数计费"];

            for (let i = 1; i <= 10; i++) {
                const isSettled = i <= 3;
                const type = feeTypes[i % 3];

                // 模拟工作量
                const orderCount = 5 + Math.floor(Math.random() * 10); // 5-15票
                const totalWeight = 200 + Math.floor(Math.random() * 800); // 200-1000kg

                // 根据模式计算运费
                let baseFee = 0;
                if (type === "按趟计费") baseFee = 300;
                if (type === "按重量计费") baseFee = totalWeight * 0.8; // 0.8元/kg
                if (type === "按票数计费") baseFee = orderCount * 30;   // 30元/票

                // 杂费
                const multiPointFee = i % 2 === 0 ? 50 : 0; // 多点费
                const upstairsFee = i % 5 === 0 ? 30 : 0;   // 上楼费
                const total = Math.round(baseFee + multiPointFee + upstairsFee);

                shortBatches.push({
                    id: `ASH2601${i.toString().padStart(3, '0')}`,
                    area: areas[i % 5],
                    driver: drivers[i - 1],
                    plate: `沪C${8000 + i}`, // 蓝牌货车
                    date: `2026-01-${10 + i}`,
                    status: isSettled ? "已挂帐" : "未挂帐",

                    // ★★★ 短途核心字段 ★★★
                    workload: { count: orderCount, weight: totalWeight }, // 工作量
                    feeType: type, // 计费模式

                    totalAmount: total,
                    fees: {
                        base: baseFee,
                        multiPoint: multiPointFee,
                        upstairs: upstairsFee,
                        other: 0
                    }
                });
            }
            sessionStorage.setItem('ShortBatches', JSON.stringify(shortBatches));
        }

        const rows = shortBatches.map(row => {
            // 计费模式标签
            let typeBadge = "";
            if (row.feeType === '按趟计费') typeBadge = `<span style="color:#2c3e50; background:#ecf0f1; padding:2px 6px; border-radius:4px; font-size:11px;">🚚 按趟 (包车)</span>`;
            else if (row.feeType === '按重量计费') typeBadge = `<span style="color:#d35400; background:#fdebd0; padding:2px 6px; border-radius:4px; font-size:11px;">⚖️ 按重 (${row.workload.weight}kg)</span>`;
            else typeBadge = `<span style="color:#2980b9; background:#eaf2f8; padding:2px 6px; border-radius:4px; font-size:11px;">🔢 按票 (${row.workload.count}票)</span>`;

            // 金额显示
            const moneyHtml = row.status === '已挂帐'
                ? `<div style="color:#27ae60; font-weight:bold;">${row.totalAmount.toLocaleString()} ✔</div>`
                : `<div style="color:#e74c3c; font-weight:bold;">${row.totalAmount.toLocaleString()}</div>`;

            // 杂费简述
            let extraStr = [];
            if (row.fees.multiPoint > 0) extraStr.push(`多点:${row.fees.multiPoint}`);
            if (row.fees.upstairs > 0) extraStr.push(`上楼:${row.fees.upstairs}`);
            const extraDesc = extraStr.length > 0 ? `<div style="font-size:11px; color:#999;">含: ${extraStr.join('+')}</div>` : '';

            const actionBtn = row.status === '已挂帐'
                ? `<span style="color:#ccc; font-size:12px;">已转应付</span>`
                : `<button class="btn-primary" style="padding:4px 10px; font-size:12px;" onclick="settleShortHaul('${row.id}')">挂帐</button>`;

            return `
            <tr>
                <td><a href="javascript:void(0)" onclick="viewShortHaulDetail('${row.id}')" style="font-weight:bold; color:#3498db;">${row.id}</a></td>
                <td>
                    <div style="font-weight:bold;">${row.area}</div>
                    <div style="font-size:12px; color:#999;">${row.date}</div>
                </td>
                <td>${row.driver} <span style="color:#ccc">|</span> ${row.plate}</td>
                <td>
                    <div style="font-weight:bold;">${row.workload.count} 票</div>
                    <div style="font-size:12px; color:#666;">${row.workload.weight} kg</div>
                </td>
                <td>${typeBadge}</td>
                <td style="text-align:right;">
                    ${moneyHtml}
                    ${extraDesc}
                </td>
                <td>
                    ${row.status === '已挂帐' ? '<span style="color:#27ae60;">已挂帐</span>' : '<span style="color:#e74c3c;">未挂帐</span>'}
                </td>
                <td>${actionBtn}</td>
            </tr>
        `;
        }).join('');

        contentHTML += `
        <h2>短途批次挂帐 (City Delivery Settlement)</h2>
        <div class="filter-area" style="display:flex; gap:10px; margin-bottom:15px;">
            <input type="text" placeholder="批次/司机/区域" style="padding:8px; border:1px solid #ccc;">
            <select style="padding:8px; border:1px solid #ccc;"><option>全部模式</option><option>按趟</option><option>按重量</option></select>
            <select style="padding:8px; border:1px solid #ccc;"><option>全部状态</option><option>未挂帐</option><option>已挂帐</option></select>
            <button class="btn-primary">查询</button>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>短途批次号</th><th>配送区域/时间</th><th>司机/车辆</th>
                    <th>工作量 (票/重)</th><th>计费模式</th>
                    <th style="text-align:right;">应付总额 (含杂费)</th><th>状态</th><th>操作</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        <div style="margin-top:10px; color:#999; font-size:12px;">
            * 提示：短途运费通常包含 <b>基础运费 + 多点费 + 上楼费</b>。
        </div>
    `;
    }

    // =========================================================================
    // 6.1 短途批次详情页 (SettlementShortHaulDetail) - [新增]
    // =========================================================================
    else if (moduleCode === "SettlementShortHaulDetail") {
        const id = window.g_currentShortId;
        const list = JSON.parse(sessionStorage.getItem('ShortBatches') || "[]");
        const item = list.find(i => i.id === id);

        if (!item) {
            contentHTML += `<div style="padding:20px;"><h3>数据丢失</h3><button class="btn-primary" onclick="loadContent('SettlementShortHaul')">返回</button></div>`;
        } else {
            // 模拟该批次下的具体订单 (Waybills)
            const mockOrders = [
                { no: "YD001", addr: "南京路步行街1号", w: 50, vol: 0.2, fee: "-" },
                { no: "YD002", addr: "陆家嘴金融中心", w: 120, vol: 0.5, fee: "-" },
                { no: "YD003", addr: "张江高科园区", w: 80, vol: 0.3, fee: "-" }
            ].map(o => `
              <tr>
                  <td>${o.no}</td>
                  <td>${o.addr}</td>
                  <td>${o.w} kg</td>
                  <td>${o.vol} m³</td>
                  <td style="color:#999;">(合并计费)</td>
              </tr>
          `).join('');

            const fees = item.fees;

            contentHTML += `
            <div style="margin-bottom:20px;">
                <button class="btn-primary" style="background:#95a5a6; padding:5px 15px;" onclick="loadContent('SettlementShortHaul')"> < 返回列表</button>
                <h2 style="display:inline-block; margin-left:15px; vertical-align:middle;">短途详情：<span style="color:#2980b9;">${item.id}</span></h2>
            </div>

            <div style="display:flex; gap:20px;">
                <div style="flex:2; background:white; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                    <h3 style="margin-top:0; border-bottom:1px solid #eee; padding-bottom:10px;">📦 配送任务清单 (${item.workload.count}票)</h3>
                    <table class="data-table" style="font-size:13px;">
                        <thead><tr><th>运单号</th><th>收货地址</th><th>重量</th><th>体积</th><th>分摊运费</th></tr></thead>
                        <tbody>
                            ${mockOrders}
                            <tr><td colspan="5" style="text-align:center; color:#999;">... (此处省略其余订单) ...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style="flex:1; height:fit-content; background:white; padding:20px; border-radius:8px; border-top:4px solid #2980b9; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                     <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin-top:0;">💰 费用结算</h3>
                        <span style="padding:4px 8px; border-radius:4px; font-size:12px; ${item.status === '已挂帐' ? 'background:#e6f7ff;color:#2980b9' : 'background:#fff7e6;color:#e67e22'}">
                            ${item.status}
                        </span>
                    </div>
                    
                    <div style="margin-bottom:15px; font-size:14px; color:#555;">
                        <div>计费模式：<b>${item.feeType}</b></div>
                        <div>总工作量：<b>${item.workload.weight} kg / ${item.workload.count} 票</b></div>
                    </div>

                    <table class="data-table">
                        <thead><tr><th>费用项</th><th style="text-align:right">金额</th></tr></thead>
                        <tbody>
                            <tr><td>基础运费</td><td style="text-align:right; font-weight:bold;">${fees.base.toLocaleString()}</td></tr>
                            <tr><td>多点提送费</td><td style="text-align:right;">${fees.multiPoint}</td></tr>
                            <tr><td>上楼/搬运费</td><td style="text-align:right;">${fees.upstairs}</td></tr>
                            <tr><td>其他</td><td style="text-align:right;">${fees.other}</td></tr>
                            <tr style="font-weight:bold; background:#f9f9f9; border-top:2px solid #eee;">
                                <td>合计</td>
                                <td style="text-align:right; font-size:18px; color:#e74c3c;">${item.totalAmount.toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="margin-top:30px; text-align:right;">
                         ${item.status === '已挂帐'
                    ? `<button class="btn-primary" disabled style="background:#ccc;">已转应付</button>`
                    : `<button class="btn-primary" style="background:#27ae60;" onclick="settleShortHaul('${item.id}')">发起挂帐</button>`
                }
                    </div>
                </div>
            </div>
          `;
        }
    }


    // =========================================================================
    //  网点对账 (ReconSite) - [增强版：含催办/明细/调整/自动结算方向]
    // =========================================================================
    else if (moduleCode === "ReconSite") {
        // 1. 初始化数据 (带缓存，模拟真实业务场景)
        let siteRecons = JSON.parse(sessionStorage.getItem('SiteRecons'));
        if (!siteRecons || siteRecons.length === 0) {
            siteRecons = [
                {
                    id: "WD202511-001",
                    name: "上海浦东金桥分部",
                    type: "直营",
                    period: "2025-11",
                    ar: 50000.00,  // 面单费、中转费 (公司收网点)
                    ap: 12000.00,  // 派送费 (公司付网点)
                    // 净额 +38,000 (网点欠公司 -> 转应收)
                    status: "待网点确认",
                    diff: "无差异"
                },
                {
                    id: "WD202511-002",
                    name: "杭州余杭加盟点",
                    type: "加盟",
                    period: "2025-11",
                    ar: 15000.00,
                    ap: 48000.00,
                    // 净额 -33,000 (公司欠网点 -> 转应付)
                    status: "待网点确认",
                    diff: "有异议"
                },
                {
                    id: "WD202511-003",
                    name: "苏州工业园区网点",
                    type: "加盟",
                    period: "2025-11",
                    ar: 20000.00,
                    ap: 22500.00,
                    // 净额 -2,500
                    status: "已确认",
                    diff: "已调整"
                }
            ];
            sessionStorage.setItem('SiteRecons', JSON.stringify(siteRecons));
        }

        // 2. 渲染表格行
        const rows = siteRecons.map(r => {
            // 计算净额：应收(AR) - 应付(AP)
            const netAmount = r.ar - r.ap;

            // 样式逻辑
            let netStyle = "";
            let netText = "";
            if (netAmount > 0) {
                netStyle = "color:#27ae60; font-weight:bold;"; // 绿色：网点要给钱
                netText = `+${netAmount.toLocaleString()}`;
            } else if (netAmount < 0) {
                netStyle = "color:#e74c3c; font-weight:bold;"; // 红色：公司要付钱
                netText = netAmount.toLocaleString();
            } else {
                netText = "0.00";
            }

            // 操作按钮逻辑 (核心交互)
            let actions = "";

            if (r.status === '待网点确认') {
                // 场景：网点还没确认 -> 催办 + 调整
                actions = `
                <a href="javascript:void(0)" onclick="urgeSite('${r.id}')" style="color:#e67e22;">🔔 催办</a>
                <span style="color:#eee">|</span>
                <a href="javascript:void(0)" onclick="adjustSiteRecon('${r.id}')" style="color:#3498db;">✎ 调整</a>
            `;
            } else if (r.status === '已确认') {
                // 场景：已确认 -> 根据正负值决定生成什么单据
                if (netAmount < 0) {
                    // 公司欠网点 -> 生成应付
                    actions = `<button class="btn-primary" style="background:#e74c3c; padding:2px 8px; font-size:12px;" onclick="generateSiteAP('${r.id}', '${Math.abs(netAmount)}')">💸 转应付单</button>`;
                } else {
                    // 网点欠公司 -> 生成应收
                    actions = `<button class="btn-primary" style="background:#27ae60; padding:2px 8px; font-size:12px;" onclick="generateSiteAR('${r.id}', '${netAmount}')">💰 转应收单</button>`;
                }
            } else {
                actions = `<span style="color:#999">已完成</span>`;
            }

            return `
            <tr>
                <td><a href="javascript:void(0)" onclick="viewSiteDetail('${r.id}')" style="font-weight:bold; text-decoration:underline; color:#333;">${r.id}</a></td>
                <td>${r.name}<br><span style="font-size:12px; color:#999;">${r.type}</span></td>
                <td>${r.period}</td>
                <td style="text-align:right;">${r.ar.toLocaleString()}</td>
                <td style="text-align:right;">${r.ap.toLocaleString()}</td>
                <td style="text-align:right; background:#f9f9f9; ${netStyle}">${netText}</td>
                <td>
                    <span style="${r.status === '待网点确认' ? 'color:#f39c12' : 'color:#2980b9'}">${r.status}</span>
                </td>
                <td>${actions}</td>
            </tr>
        `;
        }).join('');

        contentHTML += `
        <h2>网点对账 </h2>
        <p style="color: #7f8c8d;">
            全网网点资金结算中心。系统自动执行 <b>应收(面单/中转)</b> 与 <b>应付(派送/补贴)</b> 的轧差计算。
        </p>
        
        <div class="filter-area" style="background:white; padding:15px; margin-bottom:20px; border-radius:6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display:flex; gap:15px; flex-wrap:wrap;">
                <input type="month" value="2025-11" style="padding:8px; border:1px solid #ccc;">
                <input type="text" placeholder="网点名称/编号" style="padding:8px; border:1px solid #ccc; width:200px;">
                <select style="padding:8px; border:1px solid #ccc;">
                    <option>全部状态</option>
                    <option>待网点确认</option>
                    <option>已确认</option>
                </select>
                <button class="btn-primary">查询</button>
                <button class="btn-primary" style="background-color:#f39c12; margin-left:auto;" onclick="alert('已向 12 家未确认网点发送站内信和短信提醒！')">🔥 一键催办</button>
            </div>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>对账单号</th>
                    <th>网点信息</th>
                    <th>账期</th>
                    <th style="text-align:right;">本方应收 (RMB)<br><span style="font-size:10px; font-weight:normal;">(面单/罚款)</span></th>
                    <th style="text-align:right;">本方应付 (RMB)<br><span style="font-size:10px; font-weight:normal;">(派送费/奖励)</span></th>
                    <th style="text-align:right;">结算净额 (RMB)<br><span style="font-size:10px; font-weight:normal;">(应收 - 应付)</span></th>
                    <th>状态</th>
                    <th style="width:180px;">操作</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
    }

    // =========================================================================
    // 2.1 网点对账明细 (ReconSiteDetail) - [查看明细页面]
    // =========================================================================
    else if (moduleCode === "ReconSiteDetail") {
        const id = window.g_currentSiteId || "未知单号";
        contentHTML += `
        <div style="margin-bottom:15px;">
            <button class="btn-primary" style="background:#95a5a6; padding:5px 15px;" onclick="loadContent('ReconSite')"> < 返回列表</button>
            <h2 style="display:inline-block; margin-left:15px; vertical-align:middle;">对账详情：<span style="color:#2980b9;">${id}</span></h2>
        </div>
        
        <div style="display:flex; gap:20px;">
            <div style="flex:1; background:white; padding:15px; border-top:3px solid #27ae60;">
                <h3 style="color:#27ae60; margin-top:0;">📥 本方应收明细 (Income)</h3>
                <table class="data-table">
                    <thead><tr><th>费用类型</th><th>单量</th><th>金额</th></tr></thead>
                    <tbody>
                        <tr><td>电子面单费</td><td>5,000票</td><td style="text-align:right;">15,000.00</td></tr>
                        <tr><td>中转费</td><td>5,000票</td><td style="text-align:right;">5,000.00</td></tr>
                        <tr><td>遗失罚款</td><td>1票</td><td style="text-align:right;">200.00</td></tr>
                        <tr style="font-weight:bold; background:#f0f9f0;"><td>小计</td><td>-</td><td style="text-align:right;">20,200.00</td></tr>
                    </tbody>
                </table>
            </div>

            <div style="flex:1; background:white; padding:15px; border-top:3px solid #e74c3c;">
                <h3 style="color:#e74c3c; margin-top:0;">📤 本方应付明细 (Expense)</h3>
                <table class="data-table">
                    <thead><tr><th>费用类型</th><th>单量</th><th>金额</th></tr></thead>
                    <tbody>
                        <tr><td>派送费</td><td>12,000票</td><td style="text-align:right;">24,000.00</td></tr>
                        <tr><td>操作补贴</td><td>-</td><td style="text-align:right;">500.00</td></tr>
                        <tr style="font-weight:bold; background:#fff0f0;"><td>小计</td><td>-</td><td style="text-align:right;">24,500.00</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
      `;
    }


    // =========================================================================
    // 2. 客户对账 (ReconCustomer) - [修复版：独立变量]
    // =========================================================================
    else if (moduleCode === "ReconCustomer") {
        let recons = JSON.parse(sessionStorage.getItem("CustomerRecons"));
        if (!Array.isArray(recons)) recons = [];

        // 注意：这里使用的是 recons 变量
        const rows = recons
            .map((r) => {
                let statusColor = "#333";
                let action = "";
                let statusNote = "";

                if (r.status === "待客户确认") {
                    statusColor = "#f39c12";
                    action = `<button class="btn-primary" style="padding:4px 8px; font-size:12px;" onclick="confirmRecon('${r.id}')">登记客户确认结果</button>`;
                } else if (r.status === "已确认" || (r.status && r.status.indexOf("已确认") === 0)) {
                    statusColor = "#27ae60";
                    action = `<button onclick="applyInvoiceFromRecon('${r.id}', '${r.client}', '${r.amount}')" class="btn-primary" style="padding:4px 8px; font-size:12px;">申请开票</button>`;
                    if (r.status.indexOf("人工登记") !== -1) {
                        const tooltip = `确认人：${r.confirmBy || "-"}\n附件：${r.confirmAttachment || "-"}`;
                        statusNote = `<span title="${tooltip}" style="display:inline-block; margin-left:6px; padding:2px 6px; font-size:11px; color:#2c3e50; background:#eef6ff; border:1px solid #bcd9ff; border-radius:10px;">人工登记</span>`;
                    }
                } else if (r.status === "已开票") {
                    statusColor = "#2980b9";
                    action = `<span style="color:#999;">已开票</span>`;
                } else {
                    statusColor = "#999";
                    action = `<span style="color:#ccc;">流程结束</span>`;
                }

                return `<tr>
                        <td>
                            <a href="javascript:void(0)" onclick="viewReconDetails('${r.id
                    }')" style="color:#3498db; font-weight:bold; text-decoration:underline;">${r.id
                    }</a>
                            <span style="font-size:12px; color:#999; margin-left:5px;">(${r.waybillCount || "-"
                    }单)</span>
                        </td>
                        <td>${r.client}</td>
                        <td>${r.period}</td>
                        <td style="text-align:right; font-weight:bold;">${r.amount
                    }</td>
                        <td><span style="color:${statusColor}; font-weight:bold;">${r.status
                    }</span>${statusNote}</td>
                        <td>${action}</td>
                    </tr>`;
            })
            .join("");

        const emptyReconRow =
            rows || '<tr><td colspan="6" style="text-align:center; color:#999;">暂无对账单数据，请先在运单挂帐生成对账单。</td></tr>';

        contentHTML += `
                    <h2>客户对账 </h2>
                    <div class="filter-area" style="background:white;padding:15px;margin-bottom:20px;">
                        <button class="btn-primary" onclick="loadContent('ReconCustomer')">刷新列表</button>
                    </div>
                    <table class="data-table">
                        <thead><tr><th>对账单号 (点击查看运单明细)</th><th>客户名称</th><th>对账期间</th><th style="text-align:right;">应收金额</th><th>状态</th><th>操作</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>
                    <div id="recon-confirm-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.55); z-index:999;">
                        <div style="position:absolute; top:8%; left:50%; transform:translateX(-50%); width:620px; background:white; padding:20px; border-radius:8px;">
                            <h3 style="margin-top:0;">登记客户确认结果 <button onclick="closeReconConfirmModal()" style="float:right;">&times;</button></h3>
                            <div style="margin-bottom:12px; color:#666; font-size:12px;">请上传完整的微信聊天截图、邮件截图或盖章对账单扫描件。</div>
                            <div style="margin-bottom:12px;">
                                <label style="display:block; color:#666; margin-bottom:5px;">确认人姓名</label>
                                <input id="recon_confirm_name" type="text" placeholder="例如：对方财务王总" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                            <div style="margin-bottom:12px;">
                                <label style="display:block; color:#666; margin-bottom:5px;">确认时间</label>
                                <input id="recon_confirm_time" type="datetime-local" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                            <div style="margin-bottom:12px;">
                                <label style="display:block; color:#666; margin-bottom:5px;">确认凭证 <span style="color:#e74c3c;">*</span></label>
                                <input id="recon_confirm_file" type="file" style="width:100%; padding:6px;">
                            </div>
                            <div style="margin-bottom:12px;">
                                <label style="display:block; color:#666; margin-bottom:5px;">备注说明</label>
                                <input id="recon_confirm_remark" type="text" placeholder="例如：客户对运费无异议，但要求下周再开票" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                            </div>
                            <div style="text-align:right; border-top:1px solid #eee; padding-top:12px;">
                                <input type="hidden" id="recon_confirm_id">
                                <button class="btn-primary" style="background:#95a5a6;" onclick="closeReconConfirmModal()">取消</button>
                                <button class="btn-primary" style="background:#27ae60;" onclick="submitReconConfirm()">提交登记</button>
                            </div>
                        </div>
                    </div>
                `;
    }

    // =========================================================================
    // 2.1. 对账单详情页 (ReconDetail) - [新增：表格化明细]
    // =========================================================================
    else if (moduleCode === 'ReconDetail') {
        // 1. 获取当前要查看的对账单对象
        const recon = window.g_currentRecon || { id: '-', client: '-', amount: '0', period: '-' };

        // 2. 从运单库查找关联的运单 (这是核心：根据 reconId 筛选)
        const allWaybills = JSON.parse(sessionStorage.getItem('BizWaybills') || "[]");

        // 筛选逻辑：只找 reconId 等于当前对账单号的运单
        const details = allWaybills.filter(w => w.reconId === recon.id);

        // 3. 生成明细行 HTML
        const rows = details.map((d, index) => {
            // 简单的负数判断 (退款标红)
            const amtNum = parseFloat(d.totalAmount ? d.totalAmount.replace(/,/g, '') : "0");
            const isRefund = amtNum < 0;
            const color = isRefund ? '#c0392b' : '#333';
            const typeLabel = isRefund ? '<span style="color:red; font-weight:bold;">[退款]</span> ' : '';

            return `
                <tr style="color:${color}; background-color: ${isRefund ? '#fff0f0' : '#fff'};">
                    <td>${index + 1}</td>
                    <td><strong>${d.id}</strong></td>
                    <td>${d.bizDate || '-'}</td>
                    <td>${d.route || '常规路线'}</td>
                    <td>${typeLabel}${d.goods || '普通货物'}</td>
                    <td>${d.weight || '-'}</td>
                    <td style="text-align:right; font-weight:bold;">${d.totalAmount || d.amount}</td>
                    <td>${d.status}</td>
                </tr>
            `;
        }).join('');

        const emptyRow = rows ? '' : '<tr><td colspan="8" style="text-align:center; padding:20px; color:#999;">暂无关联运单明细，请检查数据源。</td></tr>';

        const reconConfirmInfo = (recon && recon.confirmAttachment)
            ? `
            <div style="background:#f8fbff; border:1px solid #d9e9ff; padding:12px 14px; border-radius:6px; margin:10px 0 15px;">
                <div style="font-weight:bold; color:#2c3e50; margin-bottom:6px;">客户确认信息</div>
                <div style="font-size:12px; color:#555;">确认人：${recon.confirmBy || "-"} | 时间：${recon.confirmTime || "-"}</div>
                <div style="font-size:12px; color:#555; margin-top:6px;">
                    凭证附件：
                    <a href="${recon.confirmAttachmentDataUrl || '#'}" ${recon.confirmAttachmentDataUrl ? `download="${recon.confirmAttachment}"` : ''} style="color:#3498db;">
                        ${recon.confirmAttachment}
                    </a>
                </div>
                ${recon.confirmRemark ? `<div style="font-size:12px; color:#777; margin-top:6px;">备注：${recon.confirmRemark}</div>` : ''}
            </div>
            `
            : "";

        contentHTML += `
            <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:10px; align-items:center;">
                    <button class="btn-primary" style="background-color: #95a5a6;" onclick="loadContent('ReconCustomer')"> < 返回列表</button>
                    <h2>对账单详情：<span style="color:#2980b9;">${recon.id}</span></h2>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:14px; color:#666;">客户名称</div>
                    <div style="font-weight:bold; font-size:16px;">${recon.client}</div>
                </div>
            </div>

            <div class="filter-area" style="background:white; padding:20px; margin-bottom:20px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; border-left: 5px solid #2980b9;">
                <div>
                    <span style="font-weight:bold; font-size:18px;">本单总额：<span style="color:#e74c3c; font-family:'Courier New';">${recon.amount}</span> RMB</span>
                    <span style="margin-left:20px; color:#666;">| &nbsp; 账期：${recon.period} &nbsp; | &nbsp; 包含单据：<strong>${details.length}</strong> 笔</span>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-primary" style="background-color:#27ae60;" onclick="alert('模拟：正在导出 Excel...')">📥 导出 Excel</button>
                    <button class="btn-primary" style="background-color:#34495e;" onclick="window.print()">🖨 打印清单</button>
                </div>
            </div>

            ${reconConfirmInfo}

            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width:50px;">序号</th>
                        <th>运单号</th>
                        <th>业务日期</th>
                        <th>运输路线</th>
                        <th>货物名称</th>
                        <th>计费重量/单位</th>
                        <th style="text-align:right;">应收金额 (RMB)</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                    ${emptyRow}
                </tbody>
            </table>
        `;
    }


    // =========================================================================
    // 3. 承运商对账 (ReconCarrier)
    // =========================================================================
    else if (moduleCode === "ReconCarrier") {
        contentHTML += `
                    <h2>承运商对账</h2>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="承运商名称/编号" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">对账状态 (全部)</option>
                                <option>待核算</option>
                                <option>待承运商确认</option>
                                <option>已确认</option>
                            </select>
                            <input type="date" placeholder="批次日期范围" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <button class="btn-primary">查询</button>
                            <button class="btn-primary" style="background-color: #2980b9;">生成对账单</button>
                        </div>
                    </div>
                    
                    <h3>承运商对账单列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>对账单号</th>
                                <th>承运商名称</th>
                                <th>批次数量</th>
                                <th>应付总额 (RMB)</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>DZ202511-CY003</td>
                                <td>迅达快运</td>
                                <td>10</td>
                                <td>125,000.00</td>
                                <td><span style="color: #f39c12;">待承运商确认</span></td>
                                <td><a href="#" style="color:#3498db;">查看</a> | <a href="#" style="color:#e74c3c;">催办</a></td>
                            </tr>
                            <tr>
                                <td>DZ202510-CY001</td>
                                <td>远航物流</td>
                                <td>8</td>
                                <td>90,000.00</td>
                                <td><span style="color: #27ae60;">已确认</span></td>
                                <td><a href="#" style="color:#3498db;">转应付</a> | <a href="#" style="color:#34495e;">打印</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 4. 司机对账 (ReconDriver)
    // =========================================================================
    else if (moduleCode === "ReconDriver") {
        contentHTML += `
                    <h2>司机对账 (酬金/费用)</h2>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="司机姓名/工号/手机号" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">对账类型 (全部)</option>
                                <option>酬金结算</option>
                                <option>报销费用</option>
                            </select>
                            <input type="date" placeholder="结算周期" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <h3>司机结算单列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>结算单号</th>
                                <th>司机姓名</th>
                                <th>结算周期</th>
                                <th>结算类型</th>
                                <th>应付金额 (RMB)</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>JS202511-SJ020</td>
                                <td>李师傅</td>
                                <td>2025-11-01 ~ 11-15</td>
                                <td>酬金结算</td>
                                <td>4,500.00</td>
                                <td><span style="color: #f39c12;">待支付</span></td>
                                <td><a href="#" style="color:#27ae60;">转支付</a> | <a href="#" style="color:#3498db;">详情</a></td>
                            </tr>
                            <tr>
                                <td>JS202511-SJ021</td>
                                <td>王师傅</td>
                                <td>2025-11-01 ~ 11-15</td>
                                <td>报销费用</td>
                                <td>800.00</td>
                                <td><span style="color: #c0392b;">待审批</span></td>
                                <td><a href="#" style="color:#e74c3c;">审批</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 5. 对账差异处理 (ReconDiffHandle)
    // =========================================================================
    else if (moduleCode === "ReconDiffHandle") {
        contentHTML += `
                    <h2>对账差异处理</h2>
                    <p style="color: #7f8c8d;">集中处理所有对账单中，系统记录与外部对象反馈存在不一致的差异记录。</p>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">对账对象类型</option>
                                <option>客户</option>
                                <option>网点</option>
                                <option>承运商</option>
                            </select>
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">差异处理状态</option>
                                <option>待财务分析</option>
                                <option>待对方确认</option>
                                <option>已结算</option>
                            </select>
                            <button class="btn-primary">查询差异</button>
                        </div>
                    </div>

                    <h3>差异记录列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>对账单号</th>
                                <th>差异对象</th>
                                <th>差异金额 (RMB)</th>
                                <th>差异类型</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>DZ202510-KH005</td>
                                <td>阳光制造 (客户)</td>
                                <td>+350.00</td>
                                <td>运费计算错误</td>
                                <td><span style="color: #f39c12;">待财务分析</span></td>
                                <td><a href="#" style="color:#e74c3c;">分析/调整</a> | <a href="#" style="color:#3498db;">详情</a></td>
                            </tr>
                            <tr>
                                <td>DZ202510-WD002</td>
                                <td>广州白云网点</td>
                                <td>-100.00</td>
                                <td>代收货款遗漏</td>
                                <td><span style="color: #27ae60;">已结算</span></td>
                                <td><a href="#" style="color:#3498db;">查看记录</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 6. 运单结算 (ARCollectionVerify)
    // =========================================================================
    else if (moduleCode === "ARCollectionVerify") {
        let waybills = JSON.parse(sessionStorage.getItem("BizWaybills") || "[]");

        if (!window.arWaybillSetTab) {
            window.arWaybillSetTab = function (tabKey) {
                window._arWaybillTab = tabKey || "all";
                window._arWaybillPage = 1;
                loadContent("ARCollectionVerify");
            };
        }

        if (!window.arWaybillSetPage) {
            window.arWaybillSetPage = function (page) {
                window._arWaybillPage = page;
                loadContent("ARCollectionVerify");
            };
        }

        if (!window.arWaybillSetPageSize) {
            window.arWaybillSetPageSize = function (size) {
                window._arWaybillPageSize = Number(size) || 10;
                window._arWaybillPage = 1;
                loadContent("ARCollectionVerify");
            };
        }

        if (!window.arWaybillApplyFilters) {
            window.arWaybillApplyFilters = function () {
                const getVal = (id) => {
                    const el = document.getElementById(id);
                    return el ? (el.value || "").toString().trim() : "";
                };
                window._arWaybillFilters = {
                    waybillNos: getVal("ar_f_waybillNos"),
                    dateStart: getVal("ar_q_date_start"),
                    dateEnd: getVal("ar_q_date_end"),
                    destSite: getVal("ar_q_dest_site"),
                };
                window._arWaybillPage = 1;
                loadContent("ARCollectionVerify");
            };
        }

        if (!window.arWaybillResetFilters) {
            window.arWaybillResetFilters = function () {
                window._arWaybillFilters = {};
                window._arWaybillPage = 1;
                loadContent("ARCollectionVerify");
            };
        }

        if (!window.arWaybillUpdateSelection) {
            window.arWaybillUpdateSelection = function () {
                const moneyKeys = Array.isArray(window._arWaybillMoneyKeys) ? window._arWaybillMoneyKeys : [];
                const rowMap = window._arWaybillRowMap || {};
                const toNumber = (raw) => {
                    const s = (raw ?? "").toString().replace(/,/g, "").trim();
                    if (!s) return 0;
                    const n = Number(s);
                    return Number.isFinite(n) ? n : 0;
                };
                const fmt = (n) => {
                    if (!n) return "";
                    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                };

                const checked = Array.from(document.querySelectorAll(".ar-check:checked"));
                const ids = checked.map((cb) => cb.value).filter(Boolean);
                const sums = {};
                moneyKeys.forEach((k) => { sums[k] = 0; });
                ids.forEach((id) => {
                    const row = rowMap[id];
                    if (!row) return;
                    moneyKeys.forEach((k) => { sums[k] += toNumber(row[k]); });
                });

                const countEl = document.getElementById("ar_sel_count");
                if (countEl) countEl.textContent = `${ids.length}单`;
                moneyKeys.forEach((k) => {
                    const el = document.getElementById(`ar_sel_sum_${k}`);
                    if (!el) return;
                    el.textContent = fmt(sums[k]);
                });
            };
        }

        if (!window.arWaybillToolbarSettle) {
            window.arWaybillToolbarSettle = function () {
                const checked = Array.from(document.querySelectorAll(".ar-check:checked"));
                if (!checked.length) return alert("请先勾选需要结算的运单。");
                const ids = checked.map((cb) => cb.value).filter(Boolean);
                const list = JSON.parse(sessionStorage.getItem("BizWaybills") || "[]");
                let changed = false;
                list.forEach((item) => {
                    if (!item || !ids.includes(item.id)) return;
                    item.settlementStatus = "已结算";
                    changed = true;
                });
                if (changed) sessionStorage.setItem("BizWaybills", JSON.stringify(list));
                loadContent("ARCollectionVerify");
            };
        }

        if (!window.arWaybillAddToBatch) {
            window.arWaybillAddToBatch = function () {
                const checked = Array.from(document.querySelectorAll(".ar-check:checked"));
                if (!checked.length) return alert("请先勾选需要加入批单夹的运单。");
                alert(`已加入批单夹（演示）：${checked.length} 票`);
            };
        }

        if (!window.arWaybillExport) {
            window.arWaybillExport = function () {
                const cols = window._arWaybillExportColumns || [];
                const data = window._arWaybillExportData || [];
                if (!cols.length) return alert("未找到可导出的列。");
                const escapeCsv = (val) => {
                    const s = (val ?? "").toString();
                    if (/[\",\\n\\r]/.test(s)) return `\"${s.replace(/\"/g, '\"\"')}\"`;
                    return s;
                };
                const lines = [];
                lines.push(cols.map((c) => escapeCsv(c.label)).join(","));
                data.forEach((row) => {
                    lines.push(cols.map((c) => escapeCsv(row[c.key] ?? "")).join(","));
                });
                const blob = new Blob([lines.join("\\n")], { type: "text/csv;charset=utf-8" });
                const a = document.createElement("a");
                const url = URL.createObjectURL(blob);
                a.href = url;
                a.download = `运单结算_${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 500);
            };
        }

        if (!window.arWaybillPrint) {
            window.arWaybillPrint = function () { window.print(); };
        }

        const filters = window._arWaybillFilters || {};
        const currentTab = window._arWaybillTab || "all";

        const esc = (val) => (val ?? "").toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");

        const parseTokens = (raw) => {
            const text = (raw || "").toString().trim();
            if (!text) return [];
            return text.split(/[\n,，;；\\s]+/).map((t) => t.trim()).filter(Boolean);
        };

        const parseDateOnly = (raw) => {
            const s = (raw || "").toString().trim();
            if (!s) return null;
            const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
            if (!m) return null;
            const d = new Date(`${m[1]}T00:00:00`);
            return Number.isNaN(d.getTime()) ? null : d;
        };

        const toNumber = (raw) => {
            const s = (raw ?? "").toString().replace(/,/g, "").trim();
            if (!s) return 0;
            const n = Number(s);
            return Number.isFinite(n) ? n : 0;
        };

        const fmtMoney = (raw) => {
            const n = toNumber(raw);
            if (!n) return "";
            return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        };

        // 顶部费用类型 tabs（样式按截图，逻辑先做筛选展示）
        const tabItems = [
            { key: "all", label: "全部" },
            { key: "cash", label: "现付" },
            { key: "debt", label: "欠付" },
            { key: "arrive", label: "到付" },
            { key: "monthly", label: "月结" },
            { key: "back", label: "回付" },
            { key: "card", label: "货到打卡" },
            { key: "cod", label: "货款扣" },
            { key: "codFee", label: "货款手续费" },
            { key: "abn", label: "异动" },
            { key: "cashReturn", label: "现返" },
            { key: "debtReturn", label: "欠返" },
            { key: "rebate", label: "回扣" },
            { key: "pickup", label: "单票提货费" },
            { key: "tax", label: "税费" },
            { key: "transfer", label: "中转费" },
            { key: "warehouse", label: "到站单票进仓费" },
            { key: "advance", label: "垫付费" },
        ];

        // 表头字段（含筛选行空白框、选中/合计、填充空格网格等前面4点）
	        const cols = [
	            { key: "site", label: "网点" },
	            { key: "waybillNo", label: "运单号", filter: { id: "ar_f_waybillNos", placeholder: "支持批量搜索，多个单号用 逗号/加号/回车/空格 分隔" } },
	            { key: "createdAt", label: "开单时间" },
	            { key: "destSite", label: "目的网点" },
	            { key: "operator", label: "经办人" },
	            { key: "shipper", label: "发货人" },
	            { key: "consignee", label: "收货人" },
	            { key: "goodsName", label: "货物名称" },
	            { key: "cashPay", label: "现付", align: "right" },
	            { key: "arrivePay", label: "到付", align: "right" },
	            { key: "backPay", label: "回付", align: "right" },
	            { key: "monthlyPay", label: "月结", align: "right" },
	            { key: "cardPay", label: "货到打卡", align: "right" },
	            { key: "debtPay", label: "欠付", align: "right" },
	            { key: "cashReturn", label: "现返", align: "right" },
	            { key: "debtReturn", label: "欠返", align: "right" },
	            { key: "pickupFee", label: "单票提货费", align: "right" },
	            { key: "transferFeeTotal", label: "中转费合计", align: "right" },
	            { key: "warehouseFee", label: "到站单票进仓费", align: "right" },
	        ];

	        const decorate = (w, idx) => {
            const site = w && w.site ? w.site : (idx % 2 === 0 ? "专线A" : "专线B");
            const waybillNo = (w && (w.id || w.orderNo)) ? (w.id || w.orderNo) : "";
            const createdAt = w && w.createdAt ? w.createdAt : (w && w.bizDate ? w.bizDate : "");
            const destSite = w && w.destination ? w.destination : "";
            const operator = w && w.operator ? w.operator : ((idx % 3 === 0) ? "强" : "test");
            const shipper = w && w.creator ? (w.creator.split("/")[0] || "") : (w && w.shipper ? w.shipper : "");
            const consignee = w && w.consignee ? w.consignee : (w && w.receiver ? w.receiver : "");
            const goodsName = w && w.goodsPack ? w.goodsPack : (w && w.goodsName ? w.goodsName : "");

	            const baseAmount = (w && (w.totalAmount || w.freightAmount || w.amount || w.paidAmount)) ? (w.totalAmount || w.freightAmount || w.amount || w.paidAmount) : "";
	            const baseNum = toNumber(baseAmount) || (200 + (idx % 7) * 100);

	            // 运单结算常见费用类型（用于演示填充金额列）
	            const feeTypePool = [
	                "现付",
	                "到付",
	                "回付",
	                "月结",
	                "货到打卡",
	                "欠付",
	                "现返",
	                "欠返",
	                "单票提货费",
	                "中转费合计",
	                "到站单票进仓费",
	            ];
	            const feeType = (w && w.feeType) ? w.feeType : feeTypePool[idx % feeTypePool.length];

	            const cashPay = feeType === "现付" ? fmtMoney(baseNum) : "";
	            const arrivePay = feeType === "到付" ? fmtMoney(baseNum) : "";
	            const backPay = feeType === "回付" ? fmtMoney(baseNum) : "";
	            const monthlyPay = feeType === "月结" ? fmtMoney(baseNum) : "";
	            const cardPay = feeType === "货到打卡" ? fmtMoney(baseNum) : "";
	            const debtPay = feeType === "欠付" ? fmtMoney(baseNum) : "";
	            const cashReturn = feeType === "现返" ? fmtMoney(Math.max(0, baseNum * 0.1)) : "";
	            const debtReturn = feeType === "欠返" ? fmtMoney(Math.max(0, baseNum * 0.1)) : "";
	            const pickupFee = feeType === "单票提货费" ? fmtMoney(Math.max(0, baseNum * 0.06)) : "";
	            const transferFeeTotal = feeType === "中转费合计" ? fmtMoney(Math.max(0, baseNum * 0.2)) : "";
	            const warehouseFee = feeType === "到站单票进仓费" ? fmtMoney(Math.max(0, baseNum * 0.04)) : "";

            const settlementStatus = w && w.settlementStatus ? w.settlementStatus : "";

	            return {
	                ...w,
                site,
                waybillNo,
                createdAt,
                destSite,
                operator,
                shipper,
                consignee,
                goodsName,
	                cashPay,
	                arrivePay,
	                monthlyPay,
	                backPay,
	                cardPay,
	                debtPay,
	                cashReturn,
	                debtReturn,
	                pickupFee,
	                transferFeeTotal,
	                warehouseFee,
	                settlementStatus,
	                _feeType: feeType,
	            };
	        };

        const decorated = (Array.isArray(waybills) ? waybills : []).map(decorate);

        const waybillNosFilter = parseTokens(filters.waybillNos);
        const dateStart = parseDateOnly(filters.dateStart);
        const dateEnd = parseDateOnly(filters.dateEnd);
        const destSiteFilter = (filters.destSite || "").toString().trim();

	        const matchesTab = (row) => {
	            if (currentTab === "all") return true;
	            if (currentTab === "cash") return toNumber(row.cashPay) > 0;
	            if (currentTab === "debt") return toNumber(row.debtPay) > 0;
	            if (currentTab === "arrive") return toNumber(row.arrivePay) > 0;
	            if (currentTab === "monthly") return toNumber(row.monthlyPay) > 0;
	            if (currentTab === "back") return toNumber(row.backPay) > 0;
	            if (currentTab === "card") return toNumber(row.cardPay) > 0;
	            if (currentTab === "cashReturn") return toNumber(row.cashReturn) > 0;
	            if (currentTab === "debtReturn") return toNumber(row.debtReturn) > 0;
	            if (currentTab === "pickup") return toNumber(row.pickupFee) > 0;
	            if (currentTab === "transfer") return toNumber(row.transferFeeTotal) > 0;
	            if (currentTab === "warehouse") return toNumber(row.warehouseFee) > 0;
	            return true;
	        };

        const filtered = decorated.filter((row) => {
            if (!matchesTab(row)) return false;
            if (destSiteFilter && !(row.destSite || "").includes(destSiteFilter)) return false;
            if (waybillNosFilter.length) {
                const id = (row.waybillNo || row.id || "").toString();
                if (waybillNosFilter.length === 1) {
                    if (!id.includes(waybillNosFilter[0])) return false;
                } else {
                    const set = new Set(waybillNosFilter);
                    if (!set.has(id)) return false;
                }
            }
            if (dateStart || dateEnd) {
                const d = parseDateOnly(row.createdAt);
                if (!d) return false;
                if (dateStart && d < dateStart) return false;
                if (dateEnd && d > dateEnd) return false;
            }
            return true;
        });

        const pageSize = window._arWaybillPageSize || 10;
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        let currentPage = window._arWaybillPage || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const pageStart = (currentPage - 1) * pageSize;
        const pageRows = filtered.slice(pageStart, pageStart + pageSize);

        const moneyKeys = cols.filter((c) => c.align === "right").map((c) => c.key);
        const sumMoney = (list) => {
            const sums = {};
            moneyKeys.forEach((k) => { sums[k] = 0; });
            (Array.isArray(list) ? list : []).forEach((row) => {
                moneyKeys.forEach((k) => { sums[k] += toNumber(row[k]); });
            });
            return sums;
        };
        const totalSums = sumMoney(filtered);
        const fmtSum = (n) => (n ? n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) : "");

        // 供导出/选中统计使用
        window._arWaybillExportColumns = cols;
        window._arWaybillExportData = filtered;
        window._arWaybillMoneyKeys = moneyKeys;
        window._arWaybillRowMap = Object.fromEntries(pageRows.map((r) => [r.id, r]));

        const renderCell = (row, col) => {
            const value = row[col.key];
            if (col.key === "waybillNo") {
                const id = esc(value || row.id || "");
                return `<a class="wb-link" href="javascript:void(0)">${id}</a>`;
            }
            if (col.align === "right") {
                const text = esc(value || "");
                const isPos = toNumber(value) > 0;
                const isSettled = (row.settlementStatus || "") === "已结算";
                const cls = isSettled ? "is-settled" : (isPos ? "is-pos" : "");
                return `<span class="wb-money ${cls}">${text}</span>`;
            }
            return esc(value || "");
        };

        const dataHtml = pageRows.map((row, idx) => {
            const rowNo = pageStart + idx + 1;
            return `<tr>
                        <td class="sticky-left-1 wb-rowno">${rowNo}</td>
                        <td class="sticky-left-2"><input type="checkbox" class="ar-check" value="${esc(row.id)}" onchange="arWaybillUpdateSelection()"></td>
                        ${cols.map((c) => `<td${c.align ? ` style="text-align:${c.align};"` : ""}>${renderCell(row, c)}</td>`).join("")}
                    </tr>`;
        }).join("");

        const fillerCount = Math.max(0, pageSize - pageRows.length);
        const fillerHtml = fillerCount ? Array.from({ length: fillerCount }).map(() => {
            return `<tr class="wb-empty-row">
                        <td class="sticky-left-1 wb-rowno">&nbsp;</td>
                        <td class="sticky-left-2">&nbsp;</td>
                        ${cols.map((c) => `<td${c.align ? ` style="text-align:${c.align};"` : ""}>&nbsp;</td>`).join("")}
                    </tr>`;
        }).join("") : "";

        const buildFilterCell = (col) => {
            if (!col.filter) {
                return `<th class="sticky-filter"><input class="wb-filter-input wb-filter-input--blank" disabled></th>`;
            }
            const f = col.filter;
            const extraClass = (f.placeholder || "").includes("批量") ? " wb-filter-input--batch" : "";
            const val = f.id === "ar_f_waybillNos" ? (filters.waybillNos || "") : "";
            return `<th class="sticky-filter"><input id="${esc(f.id)}" class="wb-filter-input${extraClass}" placeholder="${esc(f.placeholder || "")}" value="${esc(val)}"></th>`;
        };

        const buildFooterCells = (mode) => {
            const isSelected = mode === "sel";
            const countId = isSelected ? "ar_sel_count" : "ar_total_count";
            const countText = isSelected ? "0单" : `${filtered.length}单`;
            return cols.map((col) => {
                const alignStyle = col.align ? ` style="text-align:${col.align};"` : "";
                if (col.key === "waybillNo") {
                    return `<td${alignStyle}><span id="${esc(countId)}" class="wb-foot__count">${esc(countText)}</span></td>`;
                }
                if (col.align === "right") {
                    const id = isSelected ? `ar_sel_sum_${col.key}` : `ar_total_sum_${col.key}`;
                    const val = isSelected ? "" : fmtSum(totalSums[col.key] || 0);
                    return `<td${alignStyle}><span id="${esc(id)}" class="wb-foot__amt">${esc(val)}</span></td>`;
                }
                return `<td${alignStyle}>&nbsp;</td>`;
            }).join("");
        };

        const tabsHtml = tabItems.map((t) => {
            const active = t.key === currentTab ? " is-active" : "";
            return `<button class="ar-tab${active}" onclick="arWaybillSetTab('${esc(t.key)}')">${esc(t.label)}</button>`;
        }).join("");

        contentHTML += `
            <h2>运单结算</h2>

            <div class="ar-tabs">
                <div class="ar-tabs__rail">${tabsHtml}</div>
                <select class="ar-tabs__select" onchange="arWaybillSetTab(this.value)">
                    ${tabItems.map((t) => `<option value="${esc(t.key)}" ${t.key === currentTab ? "selected" : ""}>${esc(t.label)}</option>`).join("")}
                </select>
            </div>

            <div class="wb-querybar">
                <div class="wb-q-item">
                    <div class="wb-q-label">运单号</div>
                    <input id="ar_f_waybillNos" class="wb-q-control" type="text" value="${esc(filters.waybillNos || "")}" placeholder="支持批量搜索，多个单号用 逗号/加号/回车/空格 分隔">
                </div>
                <div class="wb-q-item wb-q-item--date">
                    <div class="wb-q-label">开单时间</div>
                    <div class="wb-q-date">
                        <input id="ar_q_date_start" class="wb-q-control" type="date" value="${esc(filters.dateStart || "")}">
                        <span class="wb-q-date__sep">~</span>
                        <input id="ar_q_date_end" class="wb-q-control" type="date" value="${esc(filters.dateEnd || "")}">
                    </div>
                </div>
                <div class="wb-q-item">
                    <div class="wb-q-label">目的网点</div>
                    <input id="ar_q_dest_site" class="wb-q-control" type="text" value="${esc(filters.destSite || "")}">
                </div>
                <button class="wb-btn wb-btn--primary" onclick="arWaybillApplyFilters()">查询</button>
                <button class="wb-btn" onclick="arWaybillResetFilters()">重置</button>
            </div>

            <div class="wb-toolbar">
                <div class="wb-toolbar__left">
                    <button class="wb-btn" onclick="arWaybillToolbarSettle()">结算</button>
                </div>
                <div class="wb-toolbar__right">
                    <button class="wb-btn" onclick="arWaybillExport()">导出</button>
                    <button class="wb-btn" onclick="arWaybillPrint()">打印</button>
                    <div class="wb-pager">
                        <button class="wb-pager__btn" onclick="arWaybillSetPage(1)" ${currentPage <= 1 ? "disabled" : ""}>|&lt;</button>
                        <button class="wb-pager__btn" onclick="arWaybillSetPage(${Math.max(1, currentPage - 1)})" ${currentPage <= 1 ? "disabled" : ""}>&lt;</button>
                        <span class="wb-pager__text">第</span>
                        <span class="wb-pager__page">${currentPage}</span>
                        <span class="wb-pager__text">页/共${totalPages}页</span>
                        <button class="wb-pager__btn" onclick="arWaybillSetPage(${Math.min(totalPages, currentPage + 1)})" ${currentPage >= totalPages ? "disabled" : ""}>&gt;</button>
                        <button class="wb-pager__btn" onclick="arWaybillSetPage(${totalPages})" ${currentPage >= totalPages ? "disabled" : ""}>&gt;|</button>
                        <select class="wb-pager__size" onchange="arWaybillSetPageSize(this.value)">
                            <option value="10" ${pageSize === 10 ? "selected" : ""}>0-9</option>
                            <option value="30" ${pageSize === 30 ? "selected" : ""}>0-29</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="settlement-waybill-table wb-accrual-table ar-table" style="--sticky-left-1:46px; --sticky-left-2:46px;">
                <table class="data-table" style="white-space:nowrap;">
                    <thead>
                        <tr>
                            <th class="sticky-header sticky-left-1"><span class="wb-funnel" title="筛选"></span></th>
                            <th class="sticky-header sticky-left-2"><input type="checkbox" onclick="document.querySelectorAll('.ar-check').forEach(cb => cb.checked = this.checked); arWaybillUpdateSelection();"></th>
                            ${cols.map((c) => `<th class="sticky-header"${c.align ? ` style="text-align:${c.align};"` : ""}>${esc(c.label)}</th>`).join("")}
                        </tr>
                        <tr>
                            <th class="sticky-filter sticky-left-1">筛选</th>
                            <th class="sticky-filter sticky-left-2"></th>
                            ${cols.map((c) => buildFilterCell(c)).join("")}
                        </tr>
                    </thead>
                    <tbody>${(dataHtml + fillerHtml) || `<tr><td colspan="${cols.length + 2}" style="text-align:center; color:#999; padding:18px;">暂无数据</td></tr>`}</tbody>
                    <tfoot>
                        <tr class="wb-foot wb-foot--sel">
                            <td class="sticky-left-1 wb-foot__label">选中</td>
                            <td class="sticky-left-2"></td>
                            ${buildFooterCells("sel")}
                        </tr>
                        <tr class="wb-foot wb-foot--total">
                            <td class="sticky-left-1 wb-foot__label">合计</td>
                            <td class="sticky-left-2"></td>
                            ${buildFooterCells("total")}
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
    }

    // =========================================================================
    // 7. 客户账龄分析 (AR Age Analysis)
    // =========================================================================
    else if (moduleCode === "ARAgeAnalysis") {
        contentHTML += `
                    <h2>客户账龄分析</h2>
                    <p style="color: #7f8c8d;">分析应收账款的账期分布，帮助管理层识别坏账风险。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="客户名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">截止日期 (本月)</option>
                                <option>上月</option>
                                <option>本季度</option>
                            </select>
                            <button class="btn-primary">查询</button>
                            <button style="background-color: #34495e; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">生成分析报表</button>
                        </div>
                    </div>
                    
                    <h3>应收账款账龄分布 (截止 2025-11-30)</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>客户名称</th>
                                <th>总应收 (RMB)</th>
                                <th>< 30天 (RMB)</th>
                                <th>30-60天 (RMB)</th>
                                <th>60-90天 (RMB)</th>
                                <th>> 90天 (RMB)</th>
                                <th>风险等级</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>阳光制造</td>
                                <td>35,000.00</td>
                                <td>15,000.00</td>
                                <td>10,000.00</td>
                                <td>5,000.00</td>
                                <td>5,000.00</td>
                                <td><span style="color: #e74c3c; font-weight: bold;">高</span></td>
                            </tr>
                            <tr>
                                <td>远景贸易</td>
                                <td>12,000.00</td>
                                <td>12,000.00</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td>0.00</td>
                                <td><span style="color: #27ae60;">低</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <p style="margin-top: 15px; color: #7f8c8d;">* 图表区域（饼图或柱状图）可在此处展示。</p>
                `;
    }

    // APPrepayment / APPaymentVerify 页面已下线（应付管理仅保留两个批次结算入口）

    // =========================================================================
    // 18. 供应商发票管理/进项台账 (APInvoiceManage) - [核心：OCR与认证抵扣]
    // =========================================================================
    else if (moduleCode === "APInvoiceManage") {
        // 1. 初始化模拟数据 (模拟从税务局底账库同步的数据)
        let inputInvoices = JSON.parse(sessionStorage.getItem('InputInvoices'));
        if (!inputInvoices || inputInvoices.length === 0) {
            inputInvoices = [
                {
                    id: "INV-IN-20251101",
                    code: "3100193130",
                    number: "18902233",
                    supplier: "中国石化销售有限公司",
                    type: "专票",
                    rate: "13%",
                    amount: 5000.00, // 不含税
                    tax: 650.00,     // 税额
                    total: 5650.00,  // 价税合计
                    date: "2025-11-01",
                    status: "未认证", // 状态流：未认证 -> 已认证 -> 已抵扣
                    risk: "正常"
                },
                {
                    id: "INV-IN-20251102",
                    code: "1100192240",
                    number: "22093344",
                    supplier: "顺丰速运有限公司",
                    type: "专票",
                    rate: "9%",
                    amount: 2000.00,
                    tax: 180.00,
                    total: 2180.00,
                    date: "2025-11-05",
                    status: "已认证",
                    risk: "正常"
                },
                {
                    id: "INV-IN-20251103",
                    code: "4400183320",
                    number: "88990011",
                    supplier: "某不知名耗材店",
                    type: "普票",
                    rate: "1%",
                    amount: 300.00,
                    tax: 3.00,
                    total: 303.00,
                    date: "2025-11-10",
                    status: "无需认证", // 普票不能抵扣
                    risk: "重复报销疑点" // 风控标识
                }
            ];
            sessionStorage.setItem('InputInvoices', JSON.stringify(inputInvoices));
        }

        // 2. 渲染列表
        const rows = inputInvoices.map(inv => {
            // 状态徽标颜色
            let statusBadge = "";
            if (inv.status === '已认证') statusBadge = `<span class="badge badge-success">✔ 已认证</span>`;
            else if (inv.status === '未认证') statusBadge = `<span class="badge badge-warning" style="cursor:pointer;" onclick="verifyInvoice('${inv.id}')">⏳ 点击认证</span>`;
            else statusBadge = `<span class="badge" style="background:#eee; color:#999;">${inv.status}</span>`;

            // 风险提示
            let riskTag = "";
            if (inv.risk !== '正常') {
                riskTag = `<span style="color:#e74c3c; font-size:12px;">⚠️ ${inv.risk}</span>`;
            } else {
                riskTag = `<span style="color:#27ae60; font-size:12px;">🛡️ 验真通过</span>`;
            }

            // 按钮交互
            const actionBtn = inv.status === '未认证'
                ? `<button class="btn-primary" style="padding:2px 8px; font-size:12px;" onclick="verifyInvoice('${inv.id}')">联网查验</button>`
                : `<button class="btn-primary" style="background:#fff; color:#333; border:1px solid #ccc; padding:2px 8px; font-size:12px;" onclick="viewInvoiceImg('${inv.number}')">查看影像</button>`;

            return `
            <tr>
                <td>
                    <div style="font-weight:bold; color:#3498db;">${inv.number}</div>
                    <div style="font-size:12px; color:#999;">代码: ${inv.code}</div>
                </td>
                <td>
                    <div style="font-weight:bold;">${inv.supplier}</div>
                    <div style="font-size:12px;">${inv.date} | ${inv.type}</div>
                </td>
                <td style="text-align:right;">${inv.amount.toLocaleString()}</td>
                <td style="text-align:right; color:#27ae60;">${inv.tax.toLocaleString()}</td>
                <td style="text-align:right; font-weight:bold;">${inv.total.toLocaleString()}</td>
                <td>${statusBadge}<br>${riskTag}</td>
                <td>${actionBtn}</td>
            </tr>
        `;
        }).join('');

        contentHTML += `
        <h2>进项发票台账  🧾</h2>
        <p style="color: #7f8c8d;">
            全员报销与供应商结算的发票归集中心。支持 <b>OCR智能识票</b>、<b>国税联网验真</b> 及 <b>进项税额抵扣</b> 统计。
        </p>

        <div class="dashboard-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom:20px;">
            <div class="kpi-card" style="border-left: 4px solid #3498db;">
                <div class="kpi-title">📅 本月认证税额 (抵扣)</div>
                <div class="kpi-value" style="color:#3498db;">830.00</div>
                <div class="kpi-trend">预计节省税金</div>
            </div>
            <div class="kpi-card" style="border-left: 4px solid #f39c12;">
                <div class="kpi-title">⏳ 待认证发票</div>
                <div class="kpi-value" style="color:#f39c12;">1 张</div>
                <div class="kpi-trend">涉及税额 650.00</div>
            </div>
            <div class="kpi-card" style="border-left: 4px solid #27ae60;">
                <div class="kpi-title">📥 票夹总张数</div>
                <div class="kpi-value">142</div>
                <div class="kpi-trend">电子票占比 85%</div>
            </div>
            <div class="kpi-card" style="border-left: 4px solid #e74c3c;">
                <div class="kpi-title">⚠️ 风险/红字发票</div>
                <div class="kpi-value" style="color:#e74c3c;">2</div>
                <div class="kpi-trend">重复报销拦截</div>
            </div>
        </div>

        <div class="filter-area" style="background:white; padding:15px; margin-bottom:20px; border-radius:6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; gap:10px;">
                    <input type="text" placeholder="发票号码/代码" style="padding:8px; border:1px solid #ccc; width:150px;">
                    <input type="text" placeholder="销方名称" style="padding:8px; border:1px solid #ccc; width:150px;">
                    <select style="padding:8px; border:1px solid #ccc;">
                        <option>全部状态</option>
                        <option>未认证</option>
                        <option>已认证</option>
                        <option>异常/作废</option>
                    </select>
                    <button class="btn-primary">🔍 查询</button>
                </div>
                <div style="display:flex; gap:10px;">
                    <button class="btn-primary" style="background:#8e44ad;" onclick="simulateOCR()">📸 OCR 拍照识票</button>
                    <button class="btn-primary" style="background:#27ae60;">📥 批量导入 (OFD/PDF)</button>
                    <button class="btn-primary" style="background:#fff; color:#333; border:1px solid #ccc;">导出台账</button>
                </div>
            </div>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>发票号码/代码</th>
                    <th>销方信息</th>
                    <th style="text-align:right;">金额 (不含税)</th>
                    <th style="text-align:right;">税额 (抵扣额)</th>
                    <th style="text-align:right;">价税合计</th>
                    <th>验真/认证状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>

        <div id="ocr-upload-zone" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;">
            <div style="background:white; width:500px; margin:100px auto; padding:30px; border-radius:8px; text-align:center;">
                <h3>📸 智能票据识别</h3>
                <div style="border:2px dashed #ccc; padding:40px; margin:20px 0; background:#f9f9f9;">
                    <p style="color:#999;">拖拽发票文件(PDF/JPG/OFD)到此处</p>
                    <p>或</p>
                    <button class="btn-primary">选择文件</button>
                </div>
                <div id="ocr-progress" style="display:none; margin-top:20px;">
                    <p>正在连接国税底账库查验...</p>
                    <div style="width:100%; height:10px; background:#eee; border-radius:5px; overflow:hidden;">
                        <div style="width:60%; height:100%; background:#3498db;"></div>
                    </div>
                </div>
                <button class="btn-primary" style="background:#999; margin-top:20px;" onclick="closeOCR()">取消</button>
            </div>
        </div>
    `;
    }


    // =========================================================================
    // 19. 客户资金账户 (FundCustomerAcct) - [读取已审核数据]
    // =========================================================================
    else if (moduleCode === "FundCustomerAcct") {
        let accounts = JSON.parse(sessionStorage.getItem('CustomerAccounts') || "[]");

        // 初始化账户数据 (保持不变)
        if (accounts.length === 0) {
            accounts = [
                { id: "C001", name: "京东物流", balance: 50000, credit: 100000, lastUpdate: "2025-11-20" },
                { id: "C002", name: "顺丰速运", balance: 12000, credit: 50000, lastUpdate: "2025-11-22" }
            ];
            sessionStorage.setItem('CustomerAccounts', JSON.stringify(accounts));
        }

        // ★★★★★ 核心修复开始 ★★★★★

        // 1. 读取出纳系统的凭证 (FinanceVouchers)
        let cashierVouchers = JSON.parse(sessionStorage.getItem('FinanceVouchers') || "[]");

        // 2. 读取会计系统的凭证 (ManualVouchers) - 就是你截图里那个列表
        let financeVouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");

        // 3. 合并并筛选
        let availableVouchers = [];

        // 筛选出纳凭证 (条件：类型=收款 且 状态=已审核)
        cashierVouchers.forEach(v => {
            if (v.type === '收款' && v.status === '已审核') {
                // 统一数据格式，因为两边的字段可能略有不同
                availableVouchers.push({
                    id: v.id,
                    amount: v.amount,
                    target: v.target || "未知付款方",
                    sourceType: "出纳台"
                });
            }
        });

        // 筛选会计凭证 (条件：类型包含"收款" 且 状态=已审核或已记账)
        financeVouchers.forEach(v => {
            // voucher.js 保存的 type 可能是 "收款凭证"，所以用 includes 判断
            // status 可能是 "已审核" 或 "已记账"
            const isReceipt = v.type && v.type.includes('收款');
            const isAudited = v.status === '已审核' || v.status === '已记账';

            if (isReceipt && isAudited) {
                // 这里的 v.target 在会计凭证里可能没有，需要用摘要(lines[0].summary)代替
                const summary = (v.lines && v.lines[0]) ? v.lines[0].summary : "手动凭证";
                availableVouchers.push({
                    id: v.id,
                    amount: v.amount, // 注意：ManualVouchers存的是字符串，可能需要 parseFloat，但显示时字符串也行
                    target: summary,
                    sourceType: "会计端"
                });
            }
        });

        // ★★★★★ 核心修复结束 ★★★★★

        let voucherOptions = `<option value="">-- 请选择关联的收款凭证 --</option>`;
        availableVouchers.forEach(v => {
            // data-amount 用于后续校验
            voucherOptions += `<option value="${v.id}" data-amount="${v.amount}">[${v.sourceType}] ${v.id} | ¥${v.amount} | ${v.target}</option>`;
        });

        const rows = accounts.map(acc => `
        <tr>
            <td>${acc.id}</td>
            <td><b>${acc.name}</b></td>
            <td style="text-align:right; font-size:16px; color:#27ae60; font-weight:bold;">${acc.balance.toLocaleString()}</td>
            <td>${acc.lastUpdate}</td>
            <td>
                <button class="btn-primary" style="padding:2px 8px; background:#f39c12;" onclick="openTopUpVerifyModal('${acc.id}', '${acc.name}')">充值入账</button>
            </td>
        </tr>
    `).join('');

        contentHTML += `
        <h2>客户资金账户 (Customer Fund Accounts)</h2>
        <div style="background:#e8f8f5; padding:10px; border-radius:4px; margin-bottom:15px; border:1px solid #27ae60;">
            
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>客户编码</th><th>客户名称</th><th style="text-align:right;">当前余额</th><th>最后变动</th><th>操作</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>

        <div id="topUpModal" style="display:none; position:fixed; top:20%; left:30%; width:40%; background:white; border:1px solid #ccc; padding:20px; box-shadow:0 5px 15px rgba(0,0,0,0.2); z-index:100;">
            <h3 style="color:#f39c12;">💰 客户充值 (资金入账)</h3>
            <p>正在为客户：<b id="tu_customer_name" style="font-size:16px;"></b> 充值</p>
            <input type="hidden" id="tu_customer_id">

            <div style="margin-bottom:15px; background:#f9f9f9; padding:10px; border-radius:4px;">
                <label style="display:block; margin-bottom:5px; color:#666;">1. 关联资金凭证 (必选)：</label>
                <select id="tu_voucher_select" style="width:100%; padding:8px; border:1px solid #ddd;" onchange="autoFillAmount(this)">
                    ${availableVouchers.length > 0 ? voucherOptions : '<option value="">(无可用凭证，请先去审核)</option>'}
                </select>
            </div>

            <div style="margin-bottom:15px;">
                <label style="display:block; margin-bottom:5px; color:#666;">2. 确认入账金额 (必须与凭证一致)：</label>
                <input type="number" id="tu_input_amount" placeholder="请手动输入金额以进行核对" style="width:100%; padding:8px; border:1px solid #ddd;">
            </div>

            <div style="text-align:right; margin-top:20px;">
                <button onclick="document.getElementById('topUpModal').style.display='none'">取消</button>
                <button class="btn-primary" onclick="performTopUp()">校验并充值</button>
            </div>
        </div>
    `;
    }


    // =========================================================================
    // 3. 司机/网点钱包 (FundWallet)
    // =========================================================================
    else if (moduleCode === "FundWallet") {
        contentHTML += `
                    <h2>司机/网点钱包管理</h2>
                    <p style="color: #7f8c8d;">管理司机和网点的内部虚拟账户，用于支付酬金、报销或收取代收货款。</p>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="姓名/网点名称/钱包ID" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">用户类型</option>
                                <option>司机</option>
                                <option>网点</option>
                            </select>
                            <button class="btn-primary">查询</button>
                            <button class="btn-primary" style="background-color: #f39c12;">批量提现审批</button>
                        </div>
                    </div>

                    <h3>钱包账户列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>钱包ID</th>
                                <th>用户类型</th>
                                <th>姓名/名称</th>
                                <th>当前余额 (RMB)</th>
                                <th>待提现金额 (RMB)</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>WLT5001</td>
                                <td>司机</td>
                                <td>李师傅</td>
                                <td><strong style="color: #2980b9;">8,500.00</strong></td>
                                <td>1,000.00</td>
                                <td><a href="#" style="color:#f39c12;">提现审批</a> | <a href="#" style="color:#3498db;">流水</a></td>
                            </tr>
                            <tr>
                                <td>WLT5002</td>
                                <td>网点</td>
                                <td>上海分拨中心</td>
                                <td><strong style="color: #2980b9;">12,000.00</strong></td>
                                <td>0.00</td>
                                <td><a href="#" style="color:#3498db;">充值/扣款</a> | <a href="#" style="color:#3498db;">流水</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }


    // =========================================================================
    // 13. 还款单 (Expense Repay)
    // =========================================================================
    else if (moduleCode === "ExpenseRepay") {
        contentHTML += `
                    <h2>还款单</h2>
                    <p style="color: #7f8c8d;">记录员工对已批准的借款进行归还的单据，用于结清借款余额。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="还款单号 / 还款人" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">状态 (全部)</option>
                                <option>待入账</option>
                                <option>已入账</option>
                            </select>
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">+ 登记还款</button>
                    </div>

                    <h3>还款单列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>还款单号</th>
                                <th>还款人</th>
                                <th>还款金额 (RMB)</th>
                                <th>关联借款单号</th>
                                <th>还款方式</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>HK202511005</td>
                                <td>王五</td>
                                <td>500.00</td>
                                <td>JQ202510002</td>
                                <td>银行转账</td>
                                <td><span style="color: #f39c12;">待入账</span></td>
                                <td><a href="#" style="color:#3498db;">确认入账</a></td>
                            </tr>
                            <tr>
                                <td>HK202511006</td>
                                <td>张三</td>
                                <td>1,000.00</td>
                                <td>JQ202510001</td>
                                <td>现金</td>
                                <td><span style="color: #27ae60;">已入账</span></td>
                                <td><a href="#" style="color:#3498db;">查看</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 14. 日常费用报销 (Expense Daily)
    // =========================================================================
    else if (moduleCode === "ExpenseDaily") {
        contentHTML += `
            <div class="expense-daily">
                <div class="expense-daily__hero">
                    <div>
                        <div class="expense-daily__title">日常费用报销</div>
                        <div class="expense-daily__subtitle">FMS 报销单与 OA 审批流自动联动，审批完成后自动进入待付款池。</div>
                        <div class="expense-daily__meta">
                            <span>审批流模板：大额资金支出审批流</span>
                            <span id="expense-daily-last-sync">上次同步：-</span>
                        </div>
                    </div>
                    <div class="expense-daily__hero-actions">
                        <button class="btn-primary" onclick="openExpenseDailyModal()">+ 新建报销单</button>
                        <button class="btn-primary btn-ghost" onclick="syncExpenseDailyFromOA()">同步 OA 审批</button>
                    </div>
                </div>

                <div class="expense-daily__kpis">
                    <div class="expense-kpi">
                        <div class="expense-kpi__label">审批中</div>
                        <div class="expense-kpi__value" id="expense-kpi-pending">0</div>
                        <div class="expense-kpi__meta">等待审批处理</div>
                    </div>
                    <div class="expense-kpi">
                        <div class="expense-kpi__label">审批通过</div>
                        <div class="expense-kpi__value" id="expense-kpi-approved">0</div>
                        <div class="expense-kpi__meta">进入付款池</div>
                    </div>
                    <div class="expense-kpi">
                        <div class="expense-kpi__label">已拒绝</div>
                        <div class="expense-kpi__value" id="expense-kpi-rejected">0</div>
                        <div class="expense-kpi__meta">需重新提交</div>
                    </div>
                    <div class="expense-kpi">
                        <div class="expense-kpi__label">已付款</div>
                        <div class="expense-kpi__value" id="expense-kpi-paid">0</div>
                        <div class="expense-kpi__meta">完成结算</div>
                    </div>
                </div>

                <div class="expense-daily__filters">
                    <div class="expense-filter">
                        <label>关键词</label>
                        <input id="expense-daily-filter-keyword" type="text" placeholder="报销单号 / 申请人">
                    </div>
                    <div class="expense-filter">
                        <label>费用类型</label>
                        <select id="expense-daily-filter-type">
                            <option value="">全部类型</option>
                            <option value="办公费">办公费</option>
                            <option value="业务招待费">业务招待费</option>
                            <option value="通讯费">通讯费</option>
                            <option value="差旅费">差旅费</option>
                            <option value="培训费">培训费</option>
                        </select>
                    </div>
                    <div class="expense-filter">
                        <label>状态</label>
                        <select id="expense-daily-filter-status">
                            <option value="">全部状态</option>
                            <option value="审批中">审批中</option>
                            <option value="审批通过">审批通过</option>
                            <option value="已拒绝">已拒绝</option>
                            <option value="待付款">待付款</option>
                            <option value="已付款">已付款</option>
                            <option value="未同步">未同步</option>
                        </select>
                    </div>
                    <div class="expense-filter expense-filter--actions">
                        <button class="btn-primary" onclick="renderExpenseDailyList()">查询</button>
                        <button class="btn-ghost" onclick="resetExpenseDailyFilters()">重置</button>
                    </div>
                </div>

                <div class="expense-daily__grid expense-daily__grid--single">
                    <div class="expense-daily__table-card">
                        <div class="expense-daily__table-head">
                            <span>日常报销单列表</span>
                            <div class="expense-daily__table-actions">
                                <button class="btn-ghost" onclick="renderExpenseDailyList()">刷新列表</button>
                            </div>
                        </div>
                        <div class="expense-daily__table-wrap">
                            <table class="data-table expense-daily-table">
                                <thead>
                                    <tr>
                                        <th>报销单号</th>
                                        <th>报销人</th>
                                        <th>费用类型</th>
                                        <th style="text-align:right;">报销金额</th>
                                        <th>OA 审批</th>
                                        <th>当前节点</th>
                                        <th>付款状态</th>
                                        <th>提交日期</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody id="expense-daily-tbody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div id="expense-daily-modal" class="subject-modal">
                <div class="subject-modal-mask" onclick="closeExpenseDailyModal()"></div>
                <div class="expense-daily-modal">
                    <div class="expense-daily-modal__header">
                        <div>
                            <div class="expense-daily-modal__title">新建日常费用报销</div>
                            <div class="expense-daily-modal__subtitle">提交后将自动发起 OA 审批流程</div>
                        </div>
                        <button class="btn-ghost" onclick="closeExpenseDailyModal()">关闭</button>
                    </div>
                    <div class="expense-daily-modal__body">
                        <div class="expense-form-grid">
                            <div class="expense-form-item">
                                <label>报销人</label>
                                <input id="expense_daily_applicant" type="text" placeholder="例如：孙强">
                            </div>
                            <div class="expense-form-item">
                                <label>所属部门</label>
                                <input id="expense_daily_department" type="text" placeholder="例如：技术部">
                            </div>
                            <div class="expense-form-item">
                                <label>费用类型</label>
                                <select id="expense_daily_type">
                                    <option value="办公费">办公费</option>
                                    <option value="业务招待费">业务招待费</option>
                                    <option value="通讯费">通讯费</option>
                                    <option value="差旅费">差旅费</option>
                                    <option value="培训费">培训费</option>
                                </select>
                            </div>
                            <div class="expense-form-item">
                                <label>报销金额 (RMB)</label>
                                <input id="expense_daily_amount" type="number" min="0" step="0.01" placeholder="0.00" oninput="updateExpenseDailyPayable()">
                            </div>
                            <div class="expense-form-item">
                                <label>发票数量</label>
                                <input id="expense_daily_invoice" type="number" min="0" step="1" placeholder="0">
                            </div>
                            <div class="expense-form-item">
                                <label>冲销借款</label>
                                <div class="expense-form-toggle">
                                    <input id="expense_daily_offset_toggle" type="checkbox" onchange="updateExpenseDailyPayable()">
                                    <span>本次报销冲销借款</span>
                                </div>
                            </div>
                            <div class="expense-form-item expense-form-item--full" id="expense-daily-offset-row">
                                <label>冲销金额</label>
                                <input id="expense_daily_offset_amount" type="number" min="0" step="0.01" placeholder="0.00" oninput="updateExpenseDailyPayable()">
                            </div>
                            <div class="expense-form-item expense-form-item--full">
                                <label>报销说明</label>
                                <textarea id="expense_daily_reason" rows="3" placeholder="填写用途或报销说明"></textarea>
                            </div>
                        </div>
                        <div class="expense-daily-modal__summary">
                            <div>
                                应付金额
                                <span id="expense-daily-payable">0.00</span>
                            </div>
                            <div class="expense-daily-modal__summary-tip">审批通过后自动进入待付款池</div>
                        </div>
                    </div>
                    <div class="expense-daily-modal__footer">
                        <button class="btn-ghost" onclick="closeExpenseDailyModal()">取消</button>
                        <button class="btn-primary" onclick="submitExpenseDailyForm()">提交 OA 审批</button>
                    </div>
                </div>
            </div>

            <div id="expense-daily-detail-modal" class="subject-modal">
                <div class="subject-modal-mask" onclick="closeExpenseDailyDetail()"></div>
                <div class="expense-daily-detail">
                    <div class="expense-daily-detail__header">
                        <div>
                            <div class="expense-daily-detail__title">报销单据详情</div>
                            <div class="expense-daily-detail__subtitle">物流行业标准费用报销单据</div>
                        </div>
                        <button class="btn-ghost" onclick="closeExpenseDailyDetail()">关闭</button>
                    </div>
                    <div class="expense-daily-detail__body" id="expense-daily-detail-content"></div>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // 15. 差旅报销 (Expense Travel)
    // =========================================================================
    else if (moduleCode === "ExpenseTravel") {
        contentHTML += `
                    <h2>差旅报销</h2>
                    <p style="color: #7f8c8d;">管理出差申请关联的交通、住宿、补贴等报销，通常与差旅申请单关联。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="报销单号 / 目的地" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">状态 (全部)</option>
                                <option>待审批</option>
                                <option>已批准</option>
                            </select>
                            <input type="text" placeholder="关联差旅申请号" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">+ 新增差旅报销</button>
                    </div>

                    <h3>差旅报销单列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>报销单号</th>
                                <th>报销人</th>
                                <th>出差事由</th>
                                <th>报销总额 (RMB)</th>
                                <th>冲借款金额</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CL202511003</td>
                                <td>李四</td>
                                <td>拜访深圳客户</td>
                                <td>4,500.00</td>
                                <td>3,000.00</td>
                                <td><span style="color: #f39c12;">待审批</span></td>
                                <td><a href="#" style="color:#3498db;">查看/审批</a></td>
                            </tr>
                            <tr>
                                <td>CL202510001</td>
                                <td>张三</td>
                                <td>参加行业会议</td>
                                <td>2,100.00</td>
                                <td>0.00</td>
                                <td><span style="color: #27ae60;">已批准</span></td>
                                <td><a href="#" style="color:#3498db;">查看</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }



    // =========================================================================
    // 16. 酬金结算 (Expense Compensation)
    // =========================================================================
    else if (moduleCode === "ExpenseCompensation") {
        contentHTML += `
                    <h2>酬金结算</h2>
                    <p style="color: #7f8c8d;">处理与运单或批次关联的司机、网点的服务费、提成或奖励等结算。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="结算批次号 / 对象名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">结算对象</option>
                                <option>司机</option>
                                <option>网点</option>
                            </select>
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">状态 (全部)</option>
                                <option>待发放</option>
                                <option>已发放</option>
                            </select>
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">批量生成付款单</button>
                    </div>

                    <h3>酬金结算列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>结算单号</th>
                                <th>结算对象</th>
                                <th>对象名称</th>
                                <th>酬金总额 (RMB)</th>
                                <th>结算周期</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>CJ202511001</td>
                                <td>司机</td>
                                <td>王师傅</td>
                                <td>3,800.00</td>
                                <td>2025-11</td>
                                <td><span style="color: #f39c12;">待发放</span></td>
                                <td><a href="#" style="color:#3498db;">查看/支付</a></td>
                            </tr>
                            <tr>
                                <td>CJ202511002</td>
                                <td>网点</td>
                                <td>西区网点</td>
                                <td>15,000.00</td>
                                <td>2025-10</td>
                                <td><span style="color: #27ae60;">已发放</span></td>
                                <td><a href="#" style="color:#3498db;">查看</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    } // =========================================================================
    // 17. 运单挂账 (Pending Waybill)
    // =========================================================================
    // else if (moduleCode === "PendingWaybill") {
    //     contentHTML += `
    //                 <h2>运单挂账</h2>
    //                 <p style="color: #7f8c8d;">记录因特殊原因（如客户信用额度不足、数据异常等）无法正常结算的运单，等待后续处理。</p>
    //                 <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    //                     <div style="display: flex; gap: 15px; flex-wrap: wrap;">
    //                         <input type="text" placeholder="运单号 / 客户名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
    //                         <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    //                             <option value="">挂账原因 (全部)</option>
    //                             <option>信用额度超限</option>
    //                             <option>结算数据待确认</option>
    //                             <option>客户争议</option>
    //                         </select>
    //                         <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    //                             <option value="">处理状态 (全部)</option>
    //                             <option>待处理</option>
    //                             <option>已解除</option>
    //                         </select>
    //                         <button class="btn-primary">查询</button>
    //                     </div>
    //                 </div>
                    
    //                 <div class="action-bar" style="margin-bottom: 15px;">
    //                     <button class="btn-primary" style="background-color: #f39c12;">批量解除挂账</button>
    //                 </div>

    //                 <h3>运单挂账列表</h3>
    //                 <table class="data-table">
    //                     <thead>
    //                         <tr>
    //                             <th>运单号</th>
    //                             <th>客户名称</th>
    //                             <th>应收金额 (RMB)</th>
    //                             <th>挂账日期</th>
    //                             <th>挂账原因</th>
    //                             <th>状态</th>
    //                             <th>操作</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         <tr>
    //                             <td>YD202511015</td>
    //                             <td>Epsilon科技</td>
    //                             <td>8,000.00</td>
    //                             <td>2025-11-20</td>
    //                             <td>信用额度超限</td>
    //                             <td><span style="color: #e74c3c; font-weight: bold;">待处理</span></td>
    //                             <td><a href="#" style="color:#3498db;">查看详情</a> | <a href="#" style="color:#27ae60;">解除挂账</a></td>
    //                         </tr>
    //                         <tr>
    //                             <td>YD202511016</td>
    //                             <td>Delta制造</td>
    //                             <td>1,500.00</td>
    //                             <td>2025-11-19</td>
    //                             <td>结算数据待确认</td>
    //                             <td><span style="color: #e74c3c; font-weight: bold;">待处理</span></td>
    //                             <td><a href="#" style="color:#3498db;">查看详情</a> | <a href="#" style="color:#27ae60;">解除挂账</a></td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //             `;
    // }

    // =========================================================================
    // 18. 异动挂账 (Pending Abnormal)
    // =========================================================================
    // else if (moduleCode === "PendingAbnormal") {
    //     contentHTML += `
    //                 <h2>异动挂账</h2>
    //                 <p style="color: #7f8c8d;">记录因运输过程中的异常或赔付产生的费用调整（如超期罚款、理赔费用），等待最终定损核算。</p>
    //                 <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    //                     <div style="display: flex; gap: 15px; flex-wrap: wrap;">
    //                         <input type="text" placeholder="异动单号 / 关联运单号" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
    //                         <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    //                             <option value="">异动类型 (全部)</option>
    //                             <option>破损赔付</option>
    //                             <option>超期罚款</option>
    //                             <option>异常处理费</option>
    //                         </select>
    //                         <button class="btn-primary">查询</button>
    //                     </div>
    //                 </div>
                    
    //                 <div class="action-bar" style="margin-bottom: 15px;">
    //                     <button class="btn-primary" style="background-color: #27ae60;">+ 新增异动挂账</button>
    //                 </div>

    //                 <h3>异动挂账列表</h3>
    //                 <table class="data-table">
    //                     <thead>
    //                         <tr>
    //                             <th>异动单号</th>
    //                             <th>关联运单号</th>
    //                             <th>异动类型</th>
    //                             <th>挂账金额 (RMB)</th>
    //                             <th>挂账对象</th>
    //                             <th>状态</th>
    //                             <th>操作</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         <tr>
    //                             <td>YDZ202511003</td>
    //                             <td>YD202511010</td>
    //                             <td>破损赔付</td>
    //                             <td>-2,500.00 (应收减少)</td>
    //                             <td>客户A</td>
    //                             <td><span style="color: #f39c12;">待定损</span></td>
    //                             <td><a href="#" style="color:#3498db;">定损/处理</a></td>
    //                         </tr>
    //                         <tr>
    //                             <td>YDZ202511004</td>
    //                             <td>YD202511011</td>
    //                             <td>超期罚款</td>
    //                             <td>1,000.00 (应付增加)</td>
    //                             <td>承运商B</td>
    //                             <td><span style="color: #27ae60;">已核算</span></td>
    //                             <td><a href="#" style="color:#3498db;">查看</a></td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //             `;
    // }

    // =========================================================================
    // 11. 异动管理 (AbnormalManagement) - [业务端：异动登记台]
    // =========================================================================
    else if (moduleCode === "AbnormalManagement") {

        // 1. 初始化数据 (如果没有数据，给几条示例)
        let list = JSON.parse(sessionStorage.getItem('AbnormalEvents') || "[]");
        if (list.length === 0) {
            list = [
                {
                    id: "YC2025120101",
                    date: "2025-12-01",
                    waybill: "YD10086",
                    type: "货物破损",
                    desc: "外包装破损，客户拒收",
                    reporter: "客服部-王五",
                    opsResult: "司机张三全责，赔付500元", // 定责结果
                    suggestAmount: 500,
                    status: "待入账"
                }
            ];
            sessionStorage.setItem('AbnormalEvents', JSON.stringify(list));
        }

        // 2. 渲染列表
        const rows = list.map(item => {
            let statusTag = "";

            if (item.status === '待入账') {
                statusTag = `<span style="background:#fff7e6; color:#e67e22; padding:2px 8px; border-radius:4px; border:1px solid #ffe58f;">⏳ 等待财务入账</span>`;
            } else {
                statusTag = `<span style="background:#e8f8f5; color:#27ae60; padding:2px 8px; border-radius:4px; border:1px solid #a9dfbf;">✔ 财务已处理</span>`;
            }

            return `
            <tr>
                <td>${item.id}</td>
                <td>${item.date}</td>
                <td><b style="color:#2980b9;">${item.waybill}</b></td>
                <td>${item.type}</td>
                <td>${item.opsResult}</td> <td style="font-weight:bold; color:#c0392b;">${item.suggestAmount}</td>
                <td>${item.reporter}</td>
                <td>${statusTag}</td>
            </tr>
        `;
        }).join('');

        contentHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #eee;">
            <div>
                <h2 style="margin:0; color:#2c3e50;">🚨 异动登记台 (Abnormal Registration)</h2>
                <p style="margin:5px 0 0 0; color:#7f8c8d; font-size:13px;">业务部门使用：在此录入异常事件，并判定责任归属。保存后数据将自动推送到财务部。</p>
            </div>
            <div>
                <button class="btn-primary" style="background:#e74c3c; padding:8px 20px; font-size:14px;" onclick="openRegisterModal()">+ 新增异动登记</button>
            </div>
        </div>

        <div style="background:white; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); overflow:hidden;">
            <table class="data-table" style="width:100%; border-collapse:collapse;">
                <thead style="background:#f8f9fa;">
                    <tr>
                        <th>登记编号</th><th>登记日期</th><th>关联运单号</th><th>异常类型</th>
                        <th style="width:25%;">定责结果 (责任方)</th>
                        <th>涉及金额</th><th>登记人</th><th>状态</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>

        <div id="registerModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;">
            <div style="position:absolute; top:10%; left:50%; transform:translateX(-50%); width:500px; background:white; border-radius:8px; box-shadow:0 5px 25px rgba(0,0,0,0.2);">
                
                <div style="padding:15px 20px; border-bottom:1px solid #eee; background:#f9f9f9; border-radius:8px 8px 0 0;">
                    <h3 style="margin:0; color:#e74c3c;">📝 录入新异动</h3>
                </div>
                
                <div style="padding:20px;">
                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">1. 关联运单号：</label>
                        <input type="text" id="reg_waybill" placeholder="例如：YD10086" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                    </div>

                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">2. 异常类型：</label>
                        <select id="reg_type" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                            <option value="货物破损">📦 货物破损</option>
                            <option value="货物丢失">❌ 货物丢失</option>
                            <option value="时效延误">⏰ 时效延误</option>
                            <option value="服务投诉">🤬 服务投诉</option>
                        </select>
                    </div>

                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">3. 责任判定 (谁负责)：</label>
                        <input type="text" id="reg_liability" placeholder="例如：司机张三全责 / 承运商原因" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                    </div>

                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">4. 处罚/赔偿金额 (¥)：</label>
                        <input type="number" id="reg_amount" placeholder="0.00" style="width:100%; padding:10px; border:1px solid #ddd; border-radius:4px; font-size:16px; font-weight:bold; color:#c0392b;">
                    </div>

                    <div style="margin-bottom:15px;">
                        <label style="display:block; font-weight:bold; margin-bottom:5px;">5. 详细描述/备注：</label>
                        <textarea id="reg_desc" rows="2" placeholder="填写事故详情..." style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;"></textarea>
                    </div>
                </div>

                <div style="padding:15px 20px; border-top:1px solid #eee; text-align:right; background:#f9f9f9; border-radius:0 0 8px 8px;">
                    <button onclick="document.getElementById('registerModal').style.display='none'" style="padding:8px 15px; margin-right:10px; background:white; border:1px solid #ccc; cursor:pointer; border-radius:4px;">取消</button>
                    <button class="btn-primary" onclick="saveNewAbnormal()" style="padding:8px 20px; border-radius:4px; background:#e74c3c;">确认录入</button>
                </div>
            </div>
        </div>
    `;
    }

    // =========================================================================
    // 19. 其他挂账 (Pending Other)
    // =========================================================================
    // else if (moduleCode === "PendingOther") {
    //     contentHTML += `
    //                 <h2>其他挂账</h2>
    //                 <p style="color: #7f8c8d;">记录非运单和异动产生的、需财务部门单独跟进和解除的临时性或特殊性挂账。</p>
    //                 <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
    //                     <div style="display: flex; gap: 15px; flex-wrap: wrap;">
    //                         <input type="text" placeholder="挂账单号 / 摘要" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
    //                         <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
    //                             <option value="">挂账类型 (全部)</option>
    //                             <option>系统接口差异</option>
    //                             <option>临时借支</option>
    //                         </select>
    //                         <button class="btn-primary">查询</button>
    //                     </div>
    //                 </div>
                    
    //                 <div class="action-bar" style="margin-bottom: 15px;">
    //                     <button class="btn-primary" style="background-color: #27ae60;">+ 新增其他挂账</button>
    //                     <button class="btn-primary" style="background-color: #f39c12;">批量标记已处理</button>
    //                 </div>

    //                 <h3>其他挂账列表</h3>
    //                 <table class="data-table">
    //                     <thead>
    //                         <tr>
    //                             <th>挂账单号</th>
    //                             <th>金额 (RMB)</th>
    //                             <th>方向</th>
    //                             <th>挂账日期</th>
    //                             <th>摘要/说明</th>
    //                             <th>状态</th>
    //                             <th>操作</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         <tr>
    //                             <td>QT202511001</td>
    //                             <td>500.00</td>
    //                             <td>应付</td>
    //                             <td>2025-11-18</td>
    //                             <td>系统运费计算接口差异</td>
    //                             <td><span style="color: #e74c3c; font-weight: bold;">待处理</span></td>
    //                             <td><a href="#" style="color:#3498db;">查看</a> | <a href="#" style="color:#27ae60;">标记解除</a></td>
    //                         </tr>
    //                         <tr>
    //                             <td>QT202511002</td>
    //                             <td>1,200.00</td>
    //                             <td>应收</td>
    //                             <td>2025-11-17</td>
    //                             <td>临时客户借款</td>
    //                             <td><span style="color: #27ae60;">已处理</span></td>
    //                             <td><a href="#" style="color:#3498db;">查看</a></td>
    //                         </tr>
    //                     </tbody>
    //                 </table>
    //             `;
    // }

    // =========================================================================
    // 20. 进项发票台账 (Tax Input Invoice)
    // =========================================================================
    else if (moduleCode === "TaxInputInvoice") {
        contentHTML += `
                    <h2>进项发票台账 (收到的发票)</h2>
                    <p style="color: #7f8c8d;">记录和管理从供应商收到的进项发票，作为抵扣税款和成本核算的依据。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="发票号码 / 供应商名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">认证状态 (全部)</option>
                                <option>待认证</option>
                                <option>已认证</option>
                                <option>作废</option>
                            </select>
                            <input type="date" placeholder="开票日期范围" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">+ 手动录入发票</button>
                        <button class="btn-primary" style="background-color: #3498db;">批量导入/OCR</button>
                        <button class="btn-primary" style="background-color: #f39c12;">批量勾选认证</button>
                    </div>

                    <h3>进项发票列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>发票号码</th>
                                <th>供应商名称</th>
                                <th>金额 (RMB)</th>
                                <th>税额 (RMB)</th>
                                <th>价税合计 (RMB)</th>
                                <th>开票日期</th>
                                <th>认证状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1300055215</td>
                                <td>A设备供应</td>
                                <td>9,090.91</td>
                                <td>909.09</td>
                                <td>10,000.00</td>
                                <td>2025-11-15</td>
                                <td><span style="color: #f39c12;">待认证</span></td>
                                <td><a href="#" style="color:#3498db;">详情/操作</a></td>
                            </tr>
                            <tr>
                                <td>1300055216</td>
                                <td>B运输服务</td>
                                <td>4,716.98</td>
                                <td>283.02</td>
                                <td>5,000.00</td>
                                <td>2025-11-10</td>
                                <td><span style="color: #27ae60;">已认证</span></td>
                                <td><a href="#" style="color:#3498db;">查看</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 21. 销项发票台账 (TaxOutputInvoice) - [最终联动版]
    // =========================================================================
    else if (moduleCode === "TaxOutputInvoice") {
        // 1. 读取【待开票队列】(来自运单和对账单的推送)
        const pendingQueue = JSON.parse(
            sessionStorage.getItem("PendingInvoiceQueue") || "[]"
        );

        // 生成待开票行 (黄色背景)
        const pendingRows = pendingQueue
            .map(
                (item, index) => `
                    <tr style="background-color: #fffbe6; border-left: 3px solid #f1c40f;">
                        <td style="color:#999;">(自动生成)</td>
                        <td>${item.client} <span style="font-size:12px;color:#666;">[来源:${item.sourceId}]</span></td>
                        <td style="font-weight:bold;">${item.amount}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><span style="color: #f39c12; font-weight:bold;">待开票</span></td>
                        <td>
                            <button class="btn-primary" style="padding:4px 8px; font-size:12px;" onclick="generateInvoiceFromQueue('${item.sourceId}', '${item.client}', '${item.amount}', ${index})">立即开票</button>
                        </td>
                    </tr>
                `
            )
            .join("");

        // 2. 读取【已开票记录】
        const invoices = JSON.parse(
            sessionStorage.getItem("OutputInvoices") || "[]"
        );
        const invoiceRows = invoices
            .map(
                (inv) => `
                    <tr>
                        <td>${inv.no}</td>
                        <td>${inv.client}</td>
                        <td>${inv.amount}</td>
                        <td>${inv.tax}</td>
                        <td>${inv.total}</td>
                        <td>${inv.date}</td>
                        <td><span style="color:#27ae60;font-weight:bold;">已开票</span></td>

                        <td><a href="javascript:void(0)" onclick="viewInvoiceDetail('${inv.no}')" style="color:#3498db;">查看</a></td>
                    </tr>
                `
            )
            .join("");

        contentHTML += `
                    <h2>销项发票台账</h2>
                    <p style="color:#7f8c8d;">此处集中处理来自各业务模块的开票申请。</p>
                    
                    <div class="action-bar" style="margin-bottom:15px;">
                        <button class="btn-primary" onclick="loadContent('TaxOutputInvoice')">刷新待办任务</button>
                    </div>

                    <table class="data-table">
                        <thead><tr><th>发票号</th><th>客户/对象</th><th>金额</th><th>税额</th><th>价税合计</th><th>开票日期</th><th>状态</th><th>操作</th></tr></thead>
                        <tbody>
                            ${pendingRows} ${invoiceRows} ${pendingRows.length === 0 && invoiceRows.length === 0
                ? '<tr><td colspan="8" style="text-align:center;color:#ccc;">暂无开票任务，请去结算/对账模块发起。</td></tr>'
                : ""
            }
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 22. 发票详情页 (InvoiceDetail) - [终极修正版：自动算税 + 完美UI]
    // =========================================================================
    else if (moduleCode === "InvoiceDetail") {
        // 1. 获取基础数据
        let inv = window.g_currentInvoice || {
            no: "253420000002",
            date: "2025年11月24日",
            clientName: "演示客户公司",
            clientTaxId: "9132xxxxxxxx",
            sellerName: "乐享物流有限公司",
            sellerTaxId: "9131xxxxxxxx",
            amount: "1,000.00", // 基础金额
        };

        // 2. ★★★ 核心修复：强制重新计算税额和总价 ★★★
        // 去掉逗号转数字
        const rawAmount = parseFloat(inv.amount.toString().replace(/,/g, "")) || 0;
        const taxRateVal = 0.09; // 9% 税率
        const rawTax = rawAmount * taxRateVal;
        const rawTotal = rawAmount + rawTax;

        // 格式化回字符串 (保留2位小数)
        inv.amount = rawAmount.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        inv.taxRate = "9%";
        inv.tax = rawTax.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        inv.total = rawTotal.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        // 生成大写金额
        inv.totalCn =
            typeof convertCurrency === "function"
                ? convertCurrency(rawTotal)
                : "（金额计算中...）";

        // 发票专用色 (深红褐色)
        const inkColor = "#b15b36";
        const borderStyle = `1px solid ${inkColor}`;

        contentHTML += `
                    <div style="margin-bottom:20px; display:flex; justify-content:space-between;">
                        <button class="btn-primary" style="background-color: #95a5a6;" onclick="loadContent('TaxOutputInvoice')"> < 返回列表</button>
                        <div>
                            <button class="btn-primary" style="background-color: #3498db;">🖨 打印发票</button>
                            <button class="btn-primary" style="background-color: #27ae60;">下载 PDF</button>
                        </div>
                    </div>

                    <div style="background: #fff; padding: 30px; border: 1px solid #ccc; width: 950px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-family: 'SimSun', 'Songti SC', serif; color: ${inkColor}; box-sizing: border-box;">
                        
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; padding: 0 10px;">
                            <div style="width: 20%;">
                                <div style="width: 80px; height: 80px; border: 1px solid #ddd; padding: 2px; background:#fff; display:flex; align-items:center; justify-content:center; color:#000; font-size:10px;">
                                    (二维码)
                                </div>
                            </div>
                            <div style="text-align: center; flex: 1; padding-top: 10px;">
                                <h4 style="font-size: 32px; font-family: 'KaiTi', 'STKaiti', serif; font-weight: bold; margin: 0; letter-spacing: 3px; color: ${inkColor}; border-bottom: 2px double ${inkColor}; display: inline-block; padding-bottom: 5px;">电子发票（增值税专用发票）</h2>
                            </div>
                            <div style="width: 25%; text-align: right; line-height: 1.6; font-size: 14px; font-weight: bold; color: ${inkColor};">
                                <div>发票代码：<span style="color:#000;">031001900111</span></div>
                                <div>发票号码：<span style="color:#000;">${inv.no}</span></div>
                                <div>开票日期：<span style="color:#000;">${inv.date}</span></div>
                                <div>校&nbsp;验&nbsp;码：<span style="color:#000;">1234 5678 9012 3456 7890</span></div>
                            </div>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; border: 2px solid ${inkColor}; font-size: 13px;">
                            
                            <tr>
                                <td style="width: 25px; padding: 15px 5px; text-align: center; border-right: ${borderStyle}; border-bottom: ${borderStyle}; line-height: 1.4;">
                                    购<br>买<br>方
                                </td>
                                <td style="width: 55%; padding: 6px 10px; border-right: ${borderStyle}; border-bottom: ${borderStyle}; line-height: 1.8; color: #333;">
                                    <div><span style="color:${inkColor}">名　　　　称：</span>${inv.clientName}</div>
                                    <div><span style="color:${inkColor}">纳税人识别号：</span><span style="font-family:Arial;">${inv.clientTaxId}</span></div>
                                    <div><span style="color:${inkColor}">地 址、电 话：</span>上海市浦东新区... 021-88888888</div>
                                    <div><span style="color:${inkColor}">开户行及账号：</span>招商银行... 6225xxxxxxxx</div>
                                </td>
                                <td style="width: 25px; padding: 15px 5px; text-align: center; border-right: ${borderStyle}; border-bottom: ${borderStyle}; line-height: 1.4;">
                                    密<br>码<br>区
                                </td>
                                <td style="padding: 6px; border-bottom: ${borderStyle}; font-family: 'Courier New', monospace; font-size: 12px; color: #333; word-break: break-all;">
                                    &lt;01*&gt;56*9&gt;81/02-8&lt;3*&lt;-31&lt;/02&lt;&lt;53+
                                    <br>*&gt;-6+77/&gt;+&lt;51*&lt;-/5+56*9&gt;81/02-8
                                    <br>&lt;3*&lt;-31&lt;4&gt;2*9&lt;&lt;01+/8&lt;7+&gt;-2*5&lt;1
                                </td>
                            </tr>

                            <tr style="text-align: center; color: ${inkColor}; background-color: transparent;">
                                <td colspan="4" style="padding: 0; border-bottom: ${borderStyle};">
                                    <table style="width: 100%; border-collapse: collapse; text-align: center;">
                                        <tr>
                                            <td style="width: 30%; padding: 5px; border-right: ${borderStyle};">货物或应税劳务、服务名称</td>
                                            <td style="width: 10%; padding: 5px; border-right: ${borderStyle};">规格型号</td>
                                            <td style="width: 5%;  padding: 5px; border-right: ${borderStyle};">单位</td>
                                            <td style="width: 10%; padding: 5px; border-right: ${borderStyle};">数量</td>
                                            <td style="width: 15%; padding: 5px; border-right: ${borderStyle};">单价</td>
                                            <td style="width: 15%; padding: 5px; border-right: ${borderStyle};">金额</td>
                                            <td style="width: 5%;  padding: 5px; border-right: ${borderStyle};">税率</td>
                                            <td style="width: 10%; padding: 5px;">税额</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr style="height: 150px; vertical-align: top; color: #000;">
                                <td colspan="4" style="padding: 0; border-bottom: ${borderStyle};">
                                    <table style="width: 100%; border-collapse: collapse; text-align: center; font-family: Arial;">
                                        <tr>
                                            <td style="width: 30%; padding: 8px; text-align: left; border-right: ${borderStyle};">*物流辅助服务*运输服务费</td>
                                            <td style="width: 10%; border-right: ${borderStyle};"></td>
                                            <td style="width: 5%;  border-right: ${borderStyle};">项</td>
                                            <td style="width: 10%; text-align: right; padding-right: 5px; border-right: ${borderStyle};">1</td>
                                            <td style="width: 15%; text-align: right; padding-right: 5px; border-right: ${borderStyle};">${inv.amount}</td>
                                            <td style="width: 15%; text-align: right; padding-right: 5px; border-right: ${borderStyle};">${inv.amount}</td>
                                            <td style="width: 5%;  text-align: right; padding-right: 5px; border-right: ${borderStyle};">${inv.taxRate}</td>
                                            <td style="width: 10%; text-align: right; padding-right: 5px;">${inv.tax}</td>
                                        </tr>
                                        <tr><td style="border-right: ${borderStyle}; height: 100px;"></td><td style="border-right: ${borderStyle};"></td><td style="border-right: ${borderStyle};"></td><td style="border-right: ${borderStyle};"></td><td style="border-right: ${borderStyle};"></td><td style="border-right: ${borderStyle};"></td><td style="border-right: ${borderStyle};"></td><td></td></tr>
                                    </table>
                                </td>
                            </tr>

                            <tr style="height: 30px; color: ${inkColor}; border-bottom: ${borderStyle};">
                                <td colspan="4" style="padding: 0;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="width: 30%; text-align: center; border-right: ${borderStyle}; padding: 5px;">合　　　　计</td>
                                            <td style="width: 40%; border-right: ${borderStyle};"></td>
                                            <td style="width: 15%; border-right: ${borderStyle}; text-align: right; padding-right: 5px; color: #000; font-family: Arial;">¥${inv.amount}</td>
                                            <td style="width: 15%; text-align: right; padding-right: 5px; color: #000; font-family: Arial;">¥${inv.tax}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr style="height: 35px; border-bottom: ${borderStyle};">
                                <td colspan="4" style="padding: 0;">
                                    <div style="display:flex; align-items:center; height: 100%;">
                                        <div style="width: 23%; text-align: center; border-right: ${borderStyle}; height: 100%; padding-top: 8px; box-sizing:border-box;">价税合计 (大写)</div>
                                        <div style="flex: 1; padding-left: 15px; display:flex; align-items:center; height: 100%;">
                                            <span style="border: 1px solid ${inkColor}; border-radius: 50%; padding: 0 3px; font-size: 10px; margin-right: 8px; color:${inkColor};">ⓧ</span>
                                            <span style="font-family: 'KaiTi'; font-size: 16px; color: #000;">${inv.totalCn}</span>
                                        </div>
                                        <div style="width: 30%; text-align: right; padding-right: 10px; color: ${inkColor};">
                                            (小写) <span style="color: #000; font-family: Arial;">¥${inv.total}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="width: 25px; padding: 15px 5px; text-align: center; border-right: ${borderStyle}; line-height: 1.4;">
                                    销<br>售<br>方
                                </td>
                                <td colspan="3" style="padding: 6px 10px; line-height: 1.8; color: #333;">
                                    <div><span style="color:${inkColor}">名　　　　称：</span>${inv.sellerName}</div>
                                    <div><span style="color:${inkColor}">纳税人识别号：</span><span style="font-family:Arial;">${inv.sellerTaxId}</span></div>
                                    <div><span style="color:${inkColor}">地 址、电 话：</span>滁州市... 0550-8888888</div>
                                    <div><span style="color:${inkColor}">开户行及账号：</span>工行... 1234567890</div>
                                </td>
                            </tr>
                        </table>

                        <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 14px; padding: 0 10px;">
                            <div style="width: 25%;">收款人：李财务</div>
                            <div style="width: 25%;">复核：张主管</div>
                            <div style="width: 25%;">开票人：管理员</div>
                            <div style="width: 25%;">销售方：(章)</div>
                        </div>

                    </div>
                `;
    }

    // =========================================================================
    // 22. 税率配置 (Tax Rate Config)
    // =========================================================================
    else if (moduleCode === "TaxRateConfig") {
        contentHTML += `
                    <h2>税率配置</h2>
                    <p style="color: #7f8c8d;">管理系统中使用的所有税率和税种配置，包括增值税、附加税等，确保计费和开票准确。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="税种名称 / 编码" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">状态 (全部)</option>
                                <option>启用</option>
                                <option>停用</option>
                            </select>
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">+ 新增税率配置</button>
                    </div>

                    <h3>税率配置列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>税种名称</th>
                                <th>税率 (%)</th>
                                <th>税收编码</th>
                                <th>生效日期</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>增值税 - 一般计税</td>
                                <td>9%</td>
                                <td>304020101</td>
                                <td>2019-04-01</td>
                                <td><span style="color: #27ae60;">启用</span></td>
                                <td><a href="#" style="color:#3498db;">编辑</a> | <a href="#" style="color:#e74c3c;">停用</a></td>
                            </tr>
                            <tr>
                                <td>增值税 - 小规模</td>
                                <td>3%</td>
                                <td>304020102</td>
                                <td>2019-01-01</td>
                                <td><span style="color: #27ae60;">启用</span></td>
                                <td><a href="#" style="color:#3498db;">编辑</a> | <a href="#" style="color:#e74c3c;">停用</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }
    // =========================================================================
    // 23. 预算编制 (Budget Planning)
    // =========================================================================
    else if (moduleCode === "BudgetPlanning") {
        contentHTML += `
                    <h2>预算编制</h2>
                    <p style="color: #7f8c8d;">按年度/季度/部门/科目编制和管理公司的运营预算。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">预算年度</option>
                                <option>2026</option>
                                <option>2025</option>
                            </select>
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">预算版本</option>
                                <option>初稿</option>
                                <option>终版</option>
                                <option>调整版A</option>
                            </select>
                            <input type="text" placeholder="部门名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">+ 新增预算版本</button>
                        <button class="btn-primary" style="background-color: #3498db;">下载预算模板</button>
                        <button class="btn-primary" style="background-color: #f39c12;">导入预算数据</button>
                    </div>

                    <h3>2025年度预算概览 (终版)</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>部门/科目</th>
                                <th>年度预算总额 (RMB)</th>
                                <th>一季度</th>
                                <th>二季度</th>
                                <th>三季度</th>
                                <th>四季度</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>销售部 - 差旅费</td>
                                <td>500,000.00</td>
                                <td>150,000.00</td>
                                <td>150,000.00</td>
                                <td>100,000.00</td>
                                <td>100,000.00</td>
                                <td><a href="#" style="color:#3498db;">编辑详情</a></td>
                            </tr>
                            <tr>
                                <td>运营部 - 车辆维护费</td>
                                <td>800,000.00</td>
                                <td>200,000.00</td>
                                <td>200,000.00</td>
                                <td>200,000.00</td>
                                <td>200,000.00</td>
                                <td><a href="#" style="color:#3498db;">编辑详情</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 24. 预算执行分析 (Budget Analysis)
    // =========================================================================
    else if (moduleCode === "BudgetAnalysis") {
        contentHTML += `
                    <h2>预算执行分析</h2>
                    <p style="color: #7f8c8d;">实时跟踪和比较实际发生费用与预算金额，监控预算使用情况，并预警超支风险。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">预算周期</option>
                                <option>本年度</option>
                                <option>本季度</option>
                                <option>本月</option>
                            </select>
                            <input type="text" placeholder="部门/科目筛选" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="summary-cards" style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <div class="card" style="flex: 1; padding: 15px; border-radius: 6px; background-color: #e8f5e9; border-left: 5px solid #27ae60;">
                            <h4>预算总额 (本年)</h4>
                            <p style="font-size: 24px; color: #27ae60;">12,000,000.00</p>
                        </div>
                        <div class="card" style="flex: 1; padding: 15px; border-radius: 6px; background-color: #fff3e0; border-left: 5px solid #f39c12;">
                            <h4>实际发生 (本年)</h4>
                            <p style="font-size: 24px; color: #f39c12;">8,500,000.00</p>
                        </div>
                        <div class="card" style="flex: 1; padding: 15px; border-radius: 6px; background-color: #fbecec; border-left: 5px solid #e74c3c;">
                            <h4>超支风险预警</h4>
                            <p style="font-size: 24px; color: #e74c3c;">2个科目</p>
                        </div>
                    </div>

                    <h3>预算执行明细</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>部门</th>
                                <th>费用科目</th>
                                <th>预算金额 (RMB)</th>
                                <th>实际发生 (RMB)</th>
                                <th>预算差异 (RMB)</th>
                                <th>执行率 (%)</th>
                                <th>趋势</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>销售部</td>
                                <td>差旅费</td>
                                <td>500,000.00</td>
                                <td>450,000.00</td>
                                <td>+50,000.00</td>
                                <td>90.0%</td>
                                <td><span style="color: #27ae60;">达标</span></td>
                            </tr>
                            <tr>
                                <td>运营部</td>
                                <td>车辆维护费</td>
                                <td>800,000.00</td>
                                <td>850,000.00</td>
                                <td>-50,000.00</td>
                                <td>106.3%</td>
                                <td><span style="color: #e74c3c; font-weight: bold;">超支</span></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 25. 绩效考核 (Performance Assessment)
    // =========================================================================
    else if (moduleCode === "PerformanceAssessment") {
        contentHTML += `
                    <h2>绩效考核</h2>
                    <p style="color: #7f8c8d;">基于财务数据（如成本控制、利润率、回款率）对部门或个人进行绩效评估。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">考核周期</option>
                                <option>2025 Q4</option>
                                <option>2025 Q3</option>
                            </select>
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">考核对象类型</option>
                                <option>部门</option>
                                <option>员工</option>
                            </select>
                            <input type="text" placeholder="考核对象名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #3498db;">发起绩效计算</button>
                        <button class="btn-primary" style="background-color: #f39c12;">导出考核结果</button>
                    </div>

                    <h3>2025 Q4 部门绩效结果</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>考核对象 (部门)</th>
                                <th>回款率目标</th>
                                <th>实际回款率 (%)</th>
                                <th>成本控制目标</th>
                                <th>实际成本偏差 (%)</th>
                                <th>综合得分</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>销售部</td>
                                <td>98.0%</td>
                                <td>99.5%</td>
                                <td>±3%</td>
                                <td>+1.2%</td>
                                <td>95.0</td>
                                <td><a href="#" style="color:#3498db;">查看明细</a></td>
                            </tr>
                            <tr>
                                <td>运营部</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>±5%</td>
                                <td>-6.5%</td>
                                <td>80.5</td>
                                <td><a href="#" style="color:#3498db;">查看明细</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }
    // =========================================================================
    // 23. 预算编制 (Budget Planning)
    // =========================================================================
    else if (moduleCode === "BudgetPlanning") {
        contentHTML += `
                    <h2>预算编制</h2>
                    <p style="color: #7f8c8d;">按年度/季度/部门/科目编制和管理公司的运营预算。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">预算年度</option>
                                <option>2026</option>
                                <option>2025</option>
                            </select>
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">预算版本</option>
                                <option>初稿</option>
                                <option>终版</option>
                                <option>调整版A</option>
                            </select>
                            <input type="text" placeholder="部门名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">+ 新增预算版本</button>
                        <button class="btn-primary" style="background-color: #3498db;">下载预算模板</button>
                        <button class="btn-primary" style="background-color: #f39c12;">导入预算数据</button>
                    </div>

                    <h3>2025年度预算概览 (终版)</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>部门/科目</th>
                                <th>年度预算总额 (RMB)</th>
                                <th>一季度</th>
                                <th>二季度</th>
                                <th>三季度</th>
                                <th>四季度</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>销售部 - 差旅费</td>
                                <td>500,000.00</td>
                                <td>150,000.00</td>
                                <td>150,000.00</td>
                                <td>100,000.00</td>
                                <td>100,000.00</td>
                                <td><a href="#" style="color:#3498db;">编辑详情</a></td>
                            </tr>
                            <tr>
                                <td>运营部 - 车辆维护费</td>
                                <td>800,000.00</td>
                                <td>200,000.00</td>
                                <td>200,000.00</td>
                                <td>200,000.00</td>
                                <td>200,000.00</td>
                                <td><a href="#" style="color:#3498db;">编辑详情</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 24. 预算执行分析 (Budget Execution Analysis) - 修正代码名称
    // =========================================================================
    else if (moduleCode === "BudgetExecutionAnalysis") {
        contentHTML += `
                    <h2>预算执行分析</h2>
                    <p style="color: #7f8c8d;">实时跟踪和比较实际发生费用与预算金额，监控预算使用情况，并预警超支风险。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">预算周期</option>
                                <option>本年度</option>
                                <option>本季度</option>
                                <option>本月</option>
                            </select>
                            <input type="text" placeholder="部门/科目筛选" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="summary-cards" style="display: flex; gap: 20px; margin-bottom: 20px;">
                        <div class="card" style="flex: 1; padding: 15px; border-radius: 6px; background-color: #e8f5e9; border-left: 5px solid #27ae60;">
                            <h4>预算总额 (本年)</h4>
                            <p style="font-size: 24px; color: #27ae60;">12,000,000.00</p>
                        </div>
                        <div class="card" style="flex: 1; padding: 15px; border-radius: 6px; background-color: #fff3e0; border-left: 5px solid #f39c12;">
                            <h4>实际发生 (本年)</h4>
                            <p style="font-size: 24px; color: #f39c12;">8,500,000.00</p>
                        </div>
                        <div class="card" style="flex: 1; padding: 15px; border-radius: 6px; background-color: #fbecec; border-left: 5px solid #e74c3c;">
                            <h4>超支风险预警</h4>
                            <p style="font-size: 24px; color: #e74c3c;">2个科目</p>
                        </div>
                    </div>

                    <h3>预算执行明细</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>部门</th>
                                <th>费用科目</th>
                                <th>预算金额 (RMB)</th>
                                <th>实际发生 (RMB)</th>
                                <th>预算差异 (RMB)</th>
                                <th>执行率 (%)</th>
                                <th>趋势</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>销售部</td>
                                <td>差旅费</td>
                                <td>500,000.00</td>
                                <td>450,000.00</td>
                                <td>+50,000.00</td>
                                <td>90.0%</td>
                                <td><span style="color: #27ae60;">达标</span></td>
                            </tr>
                            <tr>
                                <td>运营部</td>
                                <td>车辆维护费</td>
                                <td>800,000.00</td>
                                <td>850,000.00</td>
                                <td>-50,000.00</td>
                                <td>106.3%</td>
                                <td><span style="color: #e74c3c; font-weight: bold;">超支</span></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 25. 绩效考核 (Budget Performance) - 修正代码名称
    // =========================================================================
    else if (moduleCode === "BudgetPerformance") {
        contentHTML += `
                    <h2>绩效考核</h2>
                    <p style="color: #7f8c8d;">基于财务数据（如成本控制、利润率、回款率）对部门或个人进行绩效评估。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">考核周期</option>
                                <option>2025 Q4</option>
                                <option>2025 Q3</option>
                            </select>
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">考核对象类型</option>
                                <option>部门</option>
                                <option>员工</option>
                            </select>
                            <input type="text" placeholder="考核对象名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #3498db;">发起绩效计算</button>
                        <button class="btn-primary" style="background-color: #f39c12;">导出考核结果</button>
                    </div>

                    <h3>2025 Q4 部门绩效结果</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>考核对象 (部门)</th>
                                <th>回款率目标</th>
                                <th>实际回款率 (%)</th>
                                <th>成本控制目标</th>
                                <th>实际成本偏差 (%)</th>
                                <th>综合得分</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>销售部</td>
                                <td>98.0%</td>
                                <td>99.5%</td>
                                <td>±3%</td>
                                <td>+1.2%</td>
                                <td>95.0</td>
                                <td><a href="#" style="color:#3498db;">查看明细</a></td>
                            </tr>
                            <tr>
                                <td>运营部</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>±5%</td>
                                <td>-6.5%</td>
                                <td>80.5</td>
                                <td><a href="#" style="color:#3498db;">查看明细</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 26. 敏感操作日志 (RiskSensitiveLog) - [最终版：支持多条记录共存]
    // =========================================================================
    else if (moduleCode === "RiskSensitiveLog") {
        // 1. 读取所有动态日志 (数组)
        const logsStr = sessionStorage.getItem("GlobalAuditLogs");
        let dynamicRowsHTML = "";

        if (logsStr) {
            const logs = JSON.parse(logsStr);
            // 2. 循环生成每一行 HTML
            dynamicRowsHTML = logs
                .map((log) => {
                    // 根据风险等级决定颜色
                    const badgeColor =
                        log.level === "高危"
                            ? "#e74c3c"
                            : log.level === "中风险"
                                ? "#f39c12"
                                : "#3498db";
                    const actionColor = log.level === "高危" ? "#c0392b" : "#333";

                    return `
                            <tr style="background-color: #fff0f0; animation: highlight 2s;">
                                <td><span style="background:${badgeColor}; color:white; padding:2px 6px; border-radius:4px; font-size:12px;">● ${log.level
                        }</span></td>
                                <td>${log.time}</td>
                                <td><strong>${log.user}</strong></td>
                                <td>${log.ip}</td>
                                <td>${log.module}</td>
                                <td style="color: ${actionColor}; font-weight:bold;">${log.action
                        }</td>
                                <td>${log.detail}</td>
                                <td>
                                    <a href="javascript:void(0)" onclick="alert('【系统快照】\\n----------------\\n数据指纹：Hash-${Math.floor(
                            Math.random() * 10000000
                        )}')" style="color:#3498db;">查看快照</a>
                                </td>
                            </tr>
                        `;
                })
                .join(""); // 将数组拼接成字符串
        }

        contentHTML += `
                    <h2>敏感操作日志 🛡️</h2>
                    <p style="color: #7f8c8d;">系统的“黑匣子”，记录所有涉及资金安全、内控合规的高风险操作行为。审计数据不可删除。</p>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items:center;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">风险等级 (全部)</option>
                                <option value="high">🔴 高危</option>
                                <option value="medium">🟠 中风险</option>
                            </select>
                            <input type="text" placeholder="操作人 / 关键词" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <button class="btn-primary">🔍 审计查询</button>
                            <button class="btn-primary" style="background-color: #34495e;">导出审计报告</button>
                        </div>
                    </div>
                    
                    <h3>敏感操作记录 (实时更新)</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>风险等级</th>
                                <th>操作时间</th>
                                <th>操作人 (账号)</th>
                                <th>IP 地址</th>
                                <th>操作模块</th>
                                <th>操作行为</th>
                                <th>关键参数 / 详情</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            ${dynamicRowsHTML}

                            <tr>
                                <td><span style="background:#e74c3c; color:white; padding:2px 6px; border-radius:4px; font-size:12px;">● 高危</span></td>
                                <td>2025-11-22 14:30:05</td>
                                <td><strong>管理员 (admin)</strong></td>
                                <td>192.168.1.88</td>
                                <td>月末结账</td>
                                <td style="color: #c0392b; font-weight:bold;">执行反结账</td>
                                <td>目标期间：2025年11期</td>
                                <td><a href="javascript:void(0)" onclick="alert('快照数据已归档')" style="color:#3498db;">查看快照</a></td>
                            </tr>
                             <tr>
                                <td><span style="background:#f39c12; color:white; padding:2px 6px; border-radius:4px; font-size:12px;">● 中风险</span></td>
                                <td>2025-11-21 16:40:00</td>
                                <td>系统管理员</td>
                                <td>10.0.0.5</td>
                                <td>计费规则配置</td>
                                <td>修改规则费率</td>
                                <td>干线运费：2.5 -> 2.8</td>
                                <td><a href="javascript:void(0)" onclick="alert('变更前：2.5\\n变更后：2.8')" style="color:#3498db;">对比变更</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 28. 数据变更明细 (RiskDataChange) - [修复读取逻辑]
    // =========================================================================
    else if (moduleCode === "RiskDataChange") {
        // 1. 从 SessionStorage 读取动态日志
        const logsStr = sessionStorage.getItem("GlobalDataChangeLogs");
        let dynamicRowsHTML = "";

        if (logsStr) {
            const logs = JSON.parse(logsStr);
            // 遍历生成 HTML
            dynamicRowsHTML = logs
                .map(
                    (log) => `
                        <tr style="background-color: #fff0f0; animation: highlight 2s;">
                            <td>${log.time}</td>
                            <td><strong>${log.user}</strong></td>
                            <td>${log.object}</td>
                            <td>${log.objId}</td>
                            <td style="color: #2980b9; font-weight:bold;">${log.field}</td>
                            <td style="color: #999; text-decoration: line-through;">${log.oldVal}</td>
                            <td style="color: #e74c3c; font-weight:bold;">${log.newVal}</td>
                            <td><a href="javascript:void(0)" onclick="viewDataChangeDetail(this)" style="color:#3498db;">查看详情</a></td>
                        </tr>
                    `
                )
                .join("");
        }

        contentHTML += `
                    <h2>数据变更明细 📝</h2>
                    <p style="color: #7f8c8d;">详细记录核心基础数据（如客户资料、科目余额、资产卡片）的每一次修改，包括修改前后的值。</p>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="变更人 / 记录ID" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">变更对象 (全部)</option>
                                <option>客户档案</option>
                                <option>供应商档案</option>
                            </select>
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <h3>数据变更记录列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width: 160px;">变更时间</th>
                                <th style="width: 100px;">变更人</th>
                                <th style="width: 120px;">变更对象</th>
                                <th style="width: 120px;">对象 ID</th>
                                <th style="width: 150px;">字段名称</th>
                                <th>原值 (Old)</th>
                                <th>新值 (New)</th>
                                <th style="width: 80px;">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            ${dynamicRowsHTML}

                            <tr>
                                <td>2025-11-21 16:30:00</td>
                                <td>李出纳</td>
                                <td>供应商档案</td>
                                <td>SUP-0088</td>
                                <td style="color: #c0392b; font-weight:bold;">银行账号</td>
                                <td style="color: #999; text-decoration: line-through;">6222...8888</td>
                                <td style="color: #c0392b; font-weight:bold;">6222...9999</td>
                                <td><a href="javascript:void(0)" onclick="viewDataChangeDetail(this)" style="color:#3498db;">查看详情</a></td>
                            </tr>
                            <tr>
                                <td>2025-11-21 14:15:22</td>
                                <td>张销售</td>
                                <td>客户档案</td>
                                <td>CUST-1024</td>
                                <td style="color: #2980b9; font-weight:bold;">信用额度</td>
                                <td style="color: #999;">50,000.00</td>
                                <td style="color: #27ae60; font-weight:bold;">100,000.00</td>
                                <td><a href="javascript:void(0)" onclick="viewDataChangeDetail(this)" style="color:#3498db;">查看详情</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 29. 会计科目 (Acct Subject) - [全量完整版]
    // =========================================================================
    else if (moduleCode === "AcctSubject") {
        // 1. 读取存储的科目数据 (如果没有则使用默认的全量数据)
        let storedAccounts = JSON.parse(sessionStorage.getItem("AcctSubjects"));

        if (!storedAccounts) {
            // ★★★ 初始化全量科目数据 (基于的 Excel 和标准会计准则) ★★★
            storedAccounts = [
                // --- 资产类 (1) ---
                {
                    code: "1001",
                    name: "库存现金",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "企业的库存现金",
                },
                {
                    code: "1002",
                    name: "银行存款",
                    type: "资产",
                    direction: "借",
                    aux: "银行账户",
                    status: "启用",
                    remark: "企业存入银行或其他金融机构的各种款项",
                },
                {
                    code: "1012",
                    name: "其他货币资金",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "银行汇票、本票、信用卡存款等",
                },
                {
                    code: "1101",
                    name: "交易性金融资产",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "短期持有的股票、债券、基金等",
                },
                {
                    code: "1121",
                    name: "应收票据",
                    type: "资产",
                    direction: "借",
                    aux: "客户",
                    status: "启用",
                    remark: "商业汇票",
                },
                {
                    code: "1122",
                    name: "应收账款",
                    type: "资产",
                    direction: "借",
                    aux: "客户",
                    status: "启用",
                    remark: "因销售商品、提供劳务应收取的款项",
                },
                {
                    code: "1123",
                    name: "预付账款",
                    type: "资产",
                    direction: "借",
                    aux: "供应商",
                    status: "启用",
                    remark: "预付给供应商的款项",
                },
                {
                    code: "1131",
                    name: "应收股利",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "应收取的现金股利",
                },
                {
                    code: "1132",
                    name: "应收利息",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "应收取的利息",
                },
                {
                    code: "1221",
                    name: "其他应收款",
                    type: "资产",
                    direction: "借",
                    aux: "往来单位,员工",
                    status: "启用",
                    remark: "除应收账款外的其他各种应收暂付款项",
                },
                {
                    code: "122101",
                    name: "押金",
                    type: "资产",
                    direction: "借",
                    aux: "往来单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "122102",
                    name: "保证金",
                    type: "资产",
                    direction: "借",
                    aux: "往来单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "122103",
                    name: "员工借款",
                    type: "资产",
                    direction: "借",
                    aux: "员工",
                    status: "启用",
                    remark: "备用金等",
                },
                {
                    code: "1231",
                    name: "坏账准备",
                    type: "资产",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "应收款项的备抵科目",
                },
                {
                    code: "1511",
                    name: "长期股权投资",
                    type: "资产",
                    direction: "借",
                    aux: "被投资单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1521",
                    name: "投资性房地产",
                    type: "资产",
                    direction: "借",
                    aux: "项目",
                    status: "启用",
                    remark: "为赚取租金或资本增值而持有的房地产",
                },
                {
                    code: "1531",
                    name: "长期应收款",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1601",
                    name: "固定资产",
                    type: "资产",
                    direction: "借",
                    aux: "资产类别",
                    status: "启用",
                    remark: "使用寿命超过一年的有形资产",
                },
                {
                    code: "160101",
                    name: "房屋及建筑物",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "160102",
                    name: "交通运输设备",
                    type: "资产",
                    direction: "借",
                    aux: "车辆",
                    status: "启用",
                    remark: "物流车辆",
                },
                {
                    code: "160103",
                    name: "办公家具及设备",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "160104",
                    name: "电子设备",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "电脑、打印机等",
                },
                {
                    code: "1602",
                    name: "累计折旧",
                    type: "资产",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "固定资产的备抵科目",
                },
                {
                    code: "1604",
                    name: "在建工程",
                    type: "资产",
                    direction: "借",
                    aux: "项目",
                    status: "启用",
                    remark: "正在建设中的资产",
                },
                {
                    code: "1605",
                    name: "工程物资",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1606",
                    name: "固定资产清理",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1701",
                    name: "无形资产",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "专利权、软件著作权等",
                },
                {
                    code: "1702",
                    name: "累计摊销",
                    type: "资产",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "无形资产的备抵科目",
                },
                {
                    code: "1801",
                    name: "长期待摊费用",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "摊销期在一年以上的费用",
                },
                {
                    code: "1811",
                    name: "递延所得税资产",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1901",
                    name: "待处理财产损溢",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "盘盈盘亏处理",
                },

                // --- 负债类 (2) ---
                {
                    code: "2001",
                    name: "短期借款",
                    type: "负债",
                    direction: "贷",
                    aux: "银行",
                    status: "启用",
                    remark: "1年内的借款",
                },
                {
                    code: "2101",
                    name: "交易性金融负债",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2201",
                    name: "应付票据",
                    type: "负债",
                    direction: "贷",
                    aux: "供应商",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2202",
                    name: "应付账款",
                    type: "负债",
                    direction: "贷",
                    aux: "供应商",
                    status: "启用",
                    remark: "购买材料、接受劳务应付的款项",
                },
                {
                    code: "2203",
                    name: "预收账款",
                    type: "负债",
                    direction: "贷",
                    aux: "客户",
                    status: "启用",
                    remark: "预收的运费等",
                },
                {
                    code: "2211",
                    name: "应付职工薪酬",
                    type: "负债",
                    direction: "贷",
                    aux: "部门",
                    status: "启用",
                    remark: "工资、奖金、社保等",
                },
                {
                    code: "2221",
                    name: "应交税费",
                    type: "负债",
                    direction: "贷",
                    aux: "税种",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222101",
                    name: "应交增值税",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222102",
                    name: "应交企业所得税",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222103",
                    name: "应交城建税",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222104",
                    name: "应交教育费附加",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2231",
                    name: "应付利息",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2232",
                    name: "应付股利",
                    type: "负债",
                    direction: "贷",
                    aux: "股东",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2241",
                    name: "其他应付款",
                    type: "负债",
                    direction: "贷",
                    aux: "往来单位",
                    status: "启用",
                    remark: "除主营业务外的应付暂收款项",
                },
                {
                    code: "224101",
                    name: "代收货款",
                    type: "负债",
                    direction: "贷",
                    aux: "客户",
                    status: "启用",
                    remark: "物流代收款",
                },
                {
                    code: "224102",
                    name: "保证金",
                    type: "负债",
                    direction: "贷",
                    aux: "往来单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2401",
                    name: "递延收益",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2501",
                    name: "长期借款",
                    type: "负债",
                    direction: "贷",
                    aux: "银行",
                    status: "启用",
                    remark: "1年以上的借款",
                },
                {
                    code: "2701",
                    name: "长期应付款",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2801",
                    name: "预计负债",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2901",
                    name: "递延所得税负债",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },

                // --- 权益类 (4) ---
                {
                    code: "4001",
                    name: "实收资本",
                    type: "权益",
                    direction: "贷",
                    aux: "股东",
                    status: "启用",
                    remark: "投资者投入资本",
                },
                {
                    code: "4002",
                    name: "资本公积",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "4101",
                    name: "盈余公积",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "从净利润中提取的公积金",
                },
                {
                    code: "4103",
                    name: "本年利润",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "当期实现的净利润或亏损",
                },
                {
                    code: "4104",
                    name: "利润分配",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "利润分配及历年亏损弥补",
                },

                // --- 损益类 (6) ---
                {
                    code: "6001",
                    name: "主营业务收入",
                    type: "损益",
                    direction: "贷",
                    aux: "客户,项目",
                    status: "启用",
                    remark: "运输服务收入",
                },
                {
                    code: "600110",
                    name: "其他营业收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6051",
                    name: "其他业务收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "原材料销售、租金收入等",
                },
                {
                    code: "6101",
                    name: "公允价值变动损益",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6111",
                    name: "投资收益",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6301",
                    name: "营业外收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "与经营无直接关系的收入",
                },
                {
                    code: "6401",
                    name: "主营业务成本",
                    type: "损益",
                    direction: "借",
                    aux: "项目",
                    status: "启用",
                    remark: "运输成本、燃油费等",
                },
                {
                    code: "6402",
                    name: "其他业务成本",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "640301",
                    name: "营业税金及附加",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "城建税、教育费附加等",
                },
                {
                    code: "6601",
                    name: "销售费用",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "销售过程中发生的费用",
                },
                {
                    code: "6602",
                    name: "管理费用",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "管理部门发生的费用",
                },
                {
                    code: "660201",
                    name: "工资",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660202",
                    name: "社保费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660203",
                    name: "办公费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660204",
                    name: "保险费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660205",
                    name: "房租费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660206",
                    name: "水电费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660207",
                    name: "物业费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660208",
                    name: "招待费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660209",
                    name: "差旅费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660210",
                    name: "交通费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660211",
                    name: "通讯费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660212",
                    name: "修缮费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660213",
                    name: "招聘费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660214",
                    name: "固定资产折旧费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660215",
                    name: "低值易耗品",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6603",
                    name: "财务费用",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "利息支出、手续费等",
                },
                {
                    code: "660301",
                    name: "汇款手续费",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660302",
                    name: "代收手续费",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660303",
                    name: "利息收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "注意：利息收入记财务费用贷方",
                },
                {
                    code: "6701",
                    name: "资产减值损失",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6711",
                    name: "营业外支出",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "与经营无直接关系的支出",
                },
                {
                    code: "6801",
                    name: "所得税费用",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6901",
                    name: "以前年度损益调整",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
            ];
            sessionStorage.setItem("AcctSubjects", JSON.stringify(storedAccounts));
        }

        // 2. 排序：按科目编码排序，保证父子顺序
        storedAccounts.sort((a, b) => a.code.localeCompare(b.code));

        // 3. 生成表格 HTML
        const subjectSetting = getSubjectCodeSetting();
        const getSubjectLevelByCode = (code) => {
            let total = 0;
            for (let i = 0; i < subjectSetting.levels; i++) {
                total += subjectSetting.lengths[i] || 0;
                if (code.length === total) return i + 1;
            }
            return 1;
        };

        const buildSubjectRows = (list) => list.map((item) => {
            const statusClass = item.status === "启用" ? "status-enabled" : "status-disabled";
            const controlDirection = item.controlDirection || "否";
            return `
                        <tr id="row-${item.code}" data-code="${item.code}" data-name="${item.name}" data-type="${item.type}">
                            <td style="text-align:center;">
                                <input type="checkbox" class="subject-select" data-code="${item.code}">
                            </td>
                            <td class="val-code"><strong>${item.code}</strong></td>
                            <td class="val-name">${item.name}</td>
                            <td>${item.type}</td>
                            <td>${item.aux || "-"}</td>
                            <td class="val-dir">${item.direction}</td>
                            <td class="val-status">
                                <span class="status-pill ${statusClass}">${item.status}</span>
                            </td>
                            <td class="val-remark" style="color:#777; font-size:12px;">${item.remark || "-"
                }</td>
                            <td class="val-control">${controlDirection}</td>
                        </tr>
                    `;
        }).join("");

        const typeOrder = ["资产", "负债", "权益", "成本", "损益"];
        const typeLabels = {
            "资产": "资产",
            "负债": "负债",
            "权益": "权益",
            "成本": "成本",
            "损益": "损益"
        };
        const levelLengths = [];
        let lengthTotal = 0;
        for (let i = 0; i < subjectSetting.levels; i++) {
            lengthTotal += subjectSetting.lengths[i] || 0;
            if (lengthTotal) levelLengths.push(lengthTotal);
        }
        const level1Len = levelLengths[0] || 4;
        const level2Len = levelLengths[1] || (level1Len + 2);

        const renderTreeLeaf = (item, levelClass) => `
            <div class="subject-tree-leaf ${levelClass}">
                <button type="button" class="subject-tree-link" data-prefix="${item.code}" data-type="${item.type}" onclick="event.stopPropagation(); filterSubjectTree('${item.code}', '${item.type}', this)">
                    ${item.code} ${item.name}
                </button>
            </div>
        `;

        const renderTreeLevel2 = (list, parent) => {
            const children = list.filter(it => it.code.startsWith(parent.code) && it.code.length > parent.code.length);
            const level2Nodes = children.filter(it => it.code.length <= level2Len);
            if (!level2Nodes.length) {
                const leafNodes = children.length ? children.map(it => renderTreeLeaf(it, "level-2")).join("") : "";
                return leafNodes ? `<div class="subject-tree-children">${leafNodes}</div>` : "";
            }
            return `
                <div class="subject-tree-children">
                    ${level2Nodes.map(level2 => {
                        const descendants = children.filter(it => it.code.startsWith(level2.code) && it.code.length > level2.code.length);
                        const descendantHtml = descendants.length
                            ? `<div class="subject-tree-children">${descendants.map(it => renderTreeLeaf(it, "level-3")).join("")}</div>`
                            : "";
                        return `
                            <details class="subject-tree-section">
                                <summary>
                                    <span class="subject-tree-caret"></span>
                                    <button type="button" class="subject-tree-link" data-prefix="${level2.code}" data-type="${level2.type}" onclick="event.stopPropagation(); filterSubjectTree('${level2.code}', '${level2.type}', this)">
                                        ${level2.code} ${level2.name}
                                    </button>
                                </summary>
                                ${descendantHtml}
                            </details>
                        `;
                    }).join("")}
                </div>
            `;
        };

        const renderTreeByType = (type) => {
            const list = storedAccounts.filter(item => item.type === type);
            const level1Nodes = list.filter(item => item.code.length <= level1Len);
            if (!level1Nodes.length) return "";
            return level1Nodes.map(level1 => `
                <details class="subject-tree-section" open>
                    <summary>
                        <span class="subject-tree-caret"></span>
                        <button type="button" class="subject-tree-link" data-prefix="${level1.code}" data-type="${level1.type}" onclick="event.stopPropagation(); filterSubjectTree('${level1.code}', '${level1.type}', this)">
                            ${level1.code} ${level1.name}
                        </button>
                    </summary>
                    ${renderTreeLevel2(list, level1)}
                </details>
            `).join("");
        };

        const subjectTreeHtml = typeOrder.map(type => `
            <details class="subject-tree-section subject-tree-type" open>
                <summary>
                    <span class="subject-tree-caret"></span>
                    <button type="button" class="subject-tree-link subject-tree-type-link" data-prefix="" data-type="${type}" onclick="event.stopPropagation(); filterSubjectTree('', '${type}', this)">
                        ${typeLabels[type]}
                    </button>
                </summary>
                <div class="subject-tree-children">
                    ${renderTreeByType(type)}
                </div>
            </details>
        `).join("");

        window.filterSubjectTree = function (prefix, type, el) {
            window._subjectTreeFilterPrefix = prefix || "";
            window._subjectTreeFilterType = type || "";
            document.querySelectorAll(".subject-tree-link").forEach(node => node.classList.remove("is-active"));
            if (el && el.classList) el.classList.add("is-active");
            sessionStorage.setItem("SubjectTreeFilter", JSON.stringify({
                prefix: window._subjectTreeFilterPrefix,
                type: window._subjectTreeFilterType
            }));
            if (typeof window.renderSubjectTablePage === "function") {
                window.renderSubjectTablePage(1);
            }
        };

        const savedFilterRaw = sessionStorage.getItem("SubjectTreeFilter") || "{}";
        let savedFilter = {};
        try {
            savedFilter = JSON.parse(savedFilterRaw) || {};
        } catch (error) {
            savedFilter = {};
        }
        window._subjectTreeFilterPrefix = savedFilter.prefix || "";
        window._subjectTreeFilterType = savedFilter.type || "";
        window._subjectList = storedAccounts;
        window._subjectPageSize = 50;
        window._subjectCurrentPage = 1;

        const getFilteredSubjectList = () => {
            const input = document.getElementById("subject-search-input");
            const query = input ? input.value.trim().toLowerCase() : "";
            const prefix = window._subjectTreeFilterPrefix || "";
            const type = window._subjectTreeFilterType || "";
            return storedAccounts.filter(item => {
                const code = (item.code || "").toLowerCase();
                const name = (item.name || "").toLowerCase();
                const matched = !query || code.includes(query) || name.includes(query);
                const prefixMatched = !prefix || item.code.startsWith(prefix);
                const typeMatched = !type || item.type === type;
                return matched && prefixMatched && typeMatched;
            });
        };

        window.renderSubjectTablePage = function (page = 1) {
            const list = getFilteredSubjectList();
            const pageSize = window._subjectPageSize || 50;
            const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
            const nextPage = Math.min(Math.max(1, page), totalPages);
            window._subjectCurrentPage = nextPage;
            const start = (nextPage - 1) * pageSize;
            const slice = list.slice(start, start + pageSize);
            const tbody = document.getElementById("subject-table-body");
            if (tbody) {
                tbody.innerHTML = slice.length
                    ? buildSubjectRows(slice)
                    : `<tr><td colspan="9" style="text-align:center; padding:20px;">暂无数据</td></tr>`;
            }
            if (typeof window.updateSubjectPagination === "function") {
                window.updateSubjectPagination(list.length, nextPage, pageSize);
            }
        };

        window.updateSubjectPagination = function (total, page, pageSize) {
            const wrap = document.getElementById("subject-pagination");
            if (!wrap) return;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));
            const maxButtons = 5;
            let start = Math.max(1, page - 2);
            let end = Math.min(totalPages, start + maxButtons - 1);
            if (end - start < maxButtons - 1) {
                start = Math.max(1, end - maxButtons + 1);
            }
            let buttons = "";
            for (let i = start; i <= end; i++) {
                buttons += `<button class="page-btn ${i === page ? "is-active" : ""}" onclick="renderSubjectTablePage(${i})">${i}</button>`;
            }
            wrap.innerHTML = `
                <div class="subject-pagination-left">共 ${total} 条，每页 ${pageSize} 条</div>
                <div class="subject-pagination-right">
                    <button class="page-btn" ${page === 1 ? "disabled" : ""} onclick="renderSubjectTablePage(${page - 1})">上一页</button>
                    ${buttons}
                    <button class="page-btn" ${page === totalPages ? "disabled" : ""} onclick="renderSubjectTablePage(${page + 1})">下一页</button>
                    <span class="page-jump">跳至</span>
                    <input id="subject-page-input" type="number" min="1" max="${totalPages}" value="${page}">
                    <button class="page-btn" onclick="jumpSubjectPage()">确定</button>
                </div>
            `;
        };

        window.jumpSubjectPage = function () {
            const input = document.getElementById("subject-page-input");
            const totalPages = Math.max(1, Math.ceil((getFilteredSubjectList().length || 0) / (window._subjectPageSize || 50)));
            const page = input ? parseInt(input.value || "1", 10) : 1;
            window.renderSubjectTablePage(Math.min(Math.max(1, page), totalPages));
        };

        contentHTML += `
                    <h2>会计科目 </h2>
                    <p style="color: #7f8c8d;">管理企业的会计科目体系。支持多级科目设置（如 1001 -> 100101）。</p>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input id="subject-search-input" type="text" placeholder="科目编码 / 名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;" onkeyup="searchSubjects(event)">
                            <button class="btn-primary" onclick="searchSubjects()">查询</button>
                        </div>
                    </div>
                    
                    <div class="subject-toolbar">
                        <button class="btn-primary" onclick="addSubject()">+ 添加</button>
                        <button class="btn-primary" onclick="addSubjectSameLevel()">+ 添加同级</button>
                        <button class="btn-primary" onclick="addSubjectChild()">+ 添加下级</button>
                        <button class="btn-primary" onclick="editSelectedSubject()">✎ 修改</button>
                        <button class="btn-primary btn-danger" onclick="deleteSelectedSubjects()">🗑 删除</button>
                        <button class="btn-primary btn-success" onclick="setSubjectStatusBulk('启用')">✔ 启用</button>
                        <button class="btn-primary btn-warning" onclick="setSubjectStatusBulk('停用')">⛔ 禁用</button>
                        <button class="btn-primary" onclick="triggerImportSubjects()">⬇ 导入</button>
                        <button class="btn-primary" onclick="exportSubjectsToCSV()">⬆ 导出</button>
                        <input id="subject-import-input" type="file" accept=".csv" style="display:none;" onchange="importSubjectsFromCSV(this)">
                    </div>

                    <div class="subject-layout">
                        <div class="subject-tree-panel">
                            <div class="subject-tree-header">
                                <button type="button" class="subject-tree-link subject-tree-root is-active" data-prefix="" data-type="" onclick="filterSubjectTree('', '', this)">会计科目</button>
                            </div>
                            <div class="subject-tree-body">
                                ${subjectTreeHtml}
                            </div>
                        </div>
                        <div class="subject-table-panel">
                            <div class="subject-table-wrap">
                                <table class="data-table subject-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 42px; text-align:center;">
                                                <input type="checkbox" onclick="toggleAllSubjects(this.checked)">
                                            </th>
                                            <th style="width: 120px;">科目编码</th>
                                            <th>科目名称</th>
                                            <th style="width: 90px;">科目类型</th>
                                            <th style="width: 120px;">辅助核算</th>
                                            <th style="width: 90px;">余额方向</th>
                                            <th style="width: 90px;">状态</th>
                                            <th>备注</th>
                                            <th style="width: 110px;">控制发生方向</th>
                                        </tr>
                                    </thead>
                                    <tbody id="subject-table-body">
                                        ${buildSubjectRows(storedAccounts.slice(0, 50))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="subject-pagination" id="subject-pagination"></div>
                        </div>
                    </div>

                    <div class="subject-modal" id="subject-form-modal">
                        <div class="subject-modal-mask" onclick="closeSubjectForm()"></div>
                        <div class="subject-form-panel" id="subject-form-panel" data-code="">
                            <div class="subject-form-header">修改</div>
                            <div class="subject-form-body">
                                <div>
                                    <label>科目编码</label>
                                    <input id="subject-form-code" type="text" disabled>
                                </div>
                                <div>
                                    <label>科目名称</label>
                                    <input id="subject-form-name" type="text">
                                </div>
                                <div>
                                    <label>科目类别</label>
                                    <select id="subject-form-type">
                                        <option value="资产">资产</option>
                                        <option value="负债">负债</option>
                                        <option value="权益">权益</option>
                                        <option value="成本">成本</option>
                                        <option value="损益">损益</option>
                                    </select>
                                </div>
                                <div>
                                    <label>余额方向</label>
                                    <div class="subject-form-inline">
                                        <label><input type="radio" name="subject-form-direction" value="借">借</label>
                                        <label><input type="radio" name="subject-form-direction" value="贷">贷</label>
                                    </div>
                                </div>
                                <div>
                                    <label>控制发生方向</label>
                                    <div class="subject-form-inline">
                                        <label><input type="radio" name="subject-form-control" value="否">否</label>
                                        <label><input type="radio" name="subject-form-control" value="是">是</label>
                                    </div>
                                </div>
                                <div>
                                    <label>备注</label>
                                    <textarea id="subject-form-remark"></textarea>
                                </div>
                                <div>
                                    <label>辅助核算</label>
                                    <div class="subject-form-inline">
                                        <label><input type="checkbox" name="subject-form-aux" value="客户">客户</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="供应商">供应商</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="部门">部门</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="员工">员工</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="项目">项目</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="车辆">车辆</label>
                                    </div>
                                </div>
                            </div>
                            <div class="subject-form-footer">
                                <button class="btn-primary" onclick="saveSubjectForm()">确定</button>
                                <button class="btn-primary" style="background:#95a5a6;" onclick="closeSubjectForm()">取消</button>
                            </div>
                        </div>
                    </div>
                `;

        setTimeout(() => {
            const prefix = window._subjectTreeFilterPrefix || "";
            const type = window._subjectTreeFilterType || "";
            const selector = `.subject-tree-link[data-prefix="${prefix}"][data-type="${type}"]`;
            const link = document.querySelector(selector) || document.querySelector(".subject-tree-root");
            if (typeof window.filterSubjectTree === "function") {
                window.filterSubjectTree(prefix, type, link);
            } else if (typeof window.renderSubjectTablePage === "function") {
                window.renderSubjectTablePage(1);
            }
        }, 0);
    }

    // =========================================================================
    // 30. 会计账套 (Acct Set)
    // =========================================================================
    else if (moduleCode === "AcctSet") {

        // 动态获取数据
        let books = window.getAccountBooks ? window.getAccountBooks() : [];

        // 如果没有数据，初始化两条
        if (books.length === 0) {
            books = [
                { id: "1", code: "001", name: "集团总账套", status: "已启用" },
            ];
            sessionStorage.setItem('FinanceAccountBooks', JSON.stringify(books));
        }

        const rows = books.map(b => `
        <tr>
            <td>${b.code}</td>
            <td>${b.name}</td>
            <td><span style="color:${b.status === '已启用' ? '#27ae60' : '#f39c12'};">${b.status}</span></td>
            <td>
                <a href="javascript:void(0)" onclick="loadContent('SettlementEngineConfig', this)">设置</a>  | 
                <a href="javascript:void(0)" onclick="window.copyAccountBook('${b.id}')">复制</a> | 
                <a href="javascript:void(0)" onclick="window.deleteAccountBook('${b.id}')" style="color:#e74c3c;">删除</a>
                <span style="margin-left:12px;">
                    <label class="acct-switch">
                        <input type="checkbox" ${b.status === '已启用' ? 'checked' : ''} onchange="window.toggleAccountBookStatus('${b.id}')">
                        <span class="acct-slider"></span>
                    </label>
                </span>
            </td>
        </tr>
    `).join('');

        contentHTML += `
        <h2>会计账套管理</h2>
        <style>
            .acct-switch { position: relative; display: inline-block; width: 44px; height: 22px; vertical-align: middle; }
            .acct-switch input { opacity: 0; width: 0; height: 0; }
            .acct-slider { position: absolute; cursor: pointer; inset: 0; background: #cbd5e1; transition: .2s; border-radius: 999px; }
            .acct-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; top: 2px; background: #fff; transition: .2s; border-radius: 50%; box-shadow: 0 1px 2px rgba(0,0,0,.2); }
            .acct-switch input:checked + .acct-slider { background: #27ae60; }
            .acct-switch input:checked + .acct-slider:before { transform: translateX(22px); }
        </style>
        <div class="action-bar" style="margin-bottom: 15px;">
            <button class="btn-primary" onclick="window.addAccountBook()">+ 新增账套</button>
        </div>
        <table class="data-table">
            <thead>
                <tr><th>账套编码</th><th>账套名称</th><th>状态</th><th>操作</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;

    }

    // =========================================================================
    // 31. 会计期间 (Acct Period) - 的最新修改版
    // =========================================================================
    else if (moduleCode === "AcctPeriod") {
        const books = window.getAccountBooks ? window.getAccountBooks() : [];
        const currentYear = new Date().getFullYear();
        const incomeTemplate = typeof window.getIncomeStatementTemplate === "function"
            ? window.getIncomeStatementTemplate()
            : [];
        const parseCodes = (value) => (value || "")
            .toString()
            .split(/[,，]/)
            .map(item => item.trim())
            .filter(Boolean);
        const matchCode = (code, codes) => codes.some(prefix => code.startsWith(prefix));
        const calcTemplateAmount = (codes, op) => {
            if (!codes.length) return 0;
            let total = 0;
            vouchers.forEach((v) => {
                if (v.status === "已审核" || v.status === "已记账" || v.status === "已过账") {
                    if (!v.lines) return;
                    v.lines.forEach((line) => {
                        const account = line.account ? line.account.trim() : "";
                        const code = account.split(" ")[0];
                        if (!code || !matchCode(code, codes)) return;
                        const debit = parseFloat(line.debit) || 0;
                        const credit = parseFloat(line.credit) || 0;
                        if (op === "-") {
                            total += debit - credit;
                        } else {
                            total += credit - debit;
                        }
                    });
                }
            });
            return total;
        };
        if (window.ensureAccountPeriodsForBook) {
            books.forEach(book => window.ensureAccountPeriodsForBook(book, currentYear));
        }
        const periods = window.getAccountPeriods ? window.getAccountPeriods() : [];
        const bookOptions = books.map(b => `<option value="${b.id}">${b.name}</option>`).join("");
        const periodOptions = Array.from(new Set(periods.map(p => p.period)))
            .sort()
            .map(p => `<option value="${p}">${p}</option>`).join("");

        const rows = periods
            .sort((a, b) => {
                const bookA = a.bookName || "";
                const bookB = b.bookName || "";
                if (bookA !== bookB) {
                    return bookA.localeCompare(bookB, "zh-Hans-CN");
                }
                return a.period.localeCompare(b.period);
            })
            .map((item, idx) => {
                const statusColor = item.status === "已开启" ? "#27ae60" : item.status === "已关闭" ? "#e67e22" : "#f39c12";
                return `
                    <tr data-book="${item.bookId}" data-period="${item.period}" data-status="${item.status}">
                        <td style="text-align:center;"><input type="checkbox" class="period-select" data-id="${item.id}"></td>
                        <td>${item.site || "-"}</td>
                        <td>${item.bookName || "-"}</td>
                        <td>${item.period}</td>
                        <td><span style="color:${statusColor}; font-weight:600;">● ${item.status}</span></td>
                    </tr>
                `;
            }).join("");

        contentHTML += `
                    <h2>会计期间</h2>
                    <p style="color: #7f8c8d;">账套新增后自动生成当年 12 期，会计期间按账套进行管理。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 16px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
                            <label style="color:#666;">账套名称</label>
                            <select id="period-filter-book" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                                <option value="">全部</option>
                                ${bookOptions}
                            </select>
                            <label style="color:#666;">会计期间</label>
                            <select id="period-filter-period" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 160px;">
                                <option value="">全部</option>
                                ${periodOptions}
                            </select>
                            <label style="color:#666;">状态</label>
                            <select id="period-filter-status" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 140px;">
                                <option value="">全部</option>
                                <option value="已开启">已开启</option>
                                <option value="未开启">未开启</option>
                                <option value="已关闭">已关闭</option>
                            </select>
                            <button class="btn-primary" onclick="filterAcctPeriods()">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 12px;">
                        <button class="btn-primary" onclick="createNextYearPeriods()">➕ 新增</button>
                        <button class="btn-primary" onclick="setPeriodStatusBulk('已开启')">✅ 开启</button>
                        <button class="btn-primary" onclick="setPeriodStatusBulk('未开启')">⛔ 关闭</button>                      
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width:40px; text-align:center;"><input type="checkbox" onclick="toggleAllPeriods(this.checked)"></th>
                                <th>网点</th>
                                <th>账套名称</th>
                                <th>会计期间</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody id="acct-period-body">
                            ${rows}
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 32. 辅助核算项 (Acct Auxiliary)
    // =========================================================================
    else if (moduleCode === "AcctAuxiliary") {
        const AUX_TYPES = [
            { key: "dept", label: "部门", en: "Department" },
            { key: "customer", label: "客户", en: "Customer" },
            { key: "vendor", label: "供应商", en: "Supplier" },
            { key: "employee", label: "职员", en: "Employee" },
            { key: "project", label: "项目", en: "Project" },
            { key: "inventory", label: "存货", en: "Inventory" }
        ];

        const AUX_GUIDE = {
            dept: {
                title: "部门 (Department)",
                accounts: [
                    "6602 管理费用（行政、财务、人事部的支出）",
                    "6601 销售费用（销售部的支出）",
                    "5001 运输成本（车队/调度部的支出）"
                ],
                remark: "用于费用归集与绩效考核。将费用科目开启“部门”核算后，可统计各部门每月的经费支出（如办公费、差旅费），支持部门预算管理。"
            },
            customer: {
                title: "客户 (Customer)",
                accounts: [
                    "1122 应收账款（最核心）",
                    "2203 预收账款（或合同负债）",
                    "6001 主营业务收入"
                ],
                remark: "用于往来对账与收入分析。挂载在应收账款时，可按客户查看“谁欠我多少运费”及账龄分析；挂载在收入科目时，可统计各客户的业绩贡献。"
            },
            vendor: {
                title: "供应商 (Supplier)",
                accounts: [
                    "2202 应付账款（核心：付给外协车队或司机的钱）",
                    "1123 预付账款（预付油卡或定金）",
                    "6401 主营业务成本（外协运费成本）"
                ],
                remark: "用于应付账款管理与成本归集。在物流场景下，供应商不仅指卖东西的公司，也包含外协车队和个体司机。用于核算欠供应商多少运费，以及统计采购成本。"
            },
            employee: {
                title: "职员 (Employee)",
                accounts: [
                    "1221 其他应收款（核心：员工借款/备用金）",
                    "2241 其他应付款（员工垫付未报销款）"
                ],
                remark: "用于个人往来核算。主要用于管理员工的备用金借支（如司机借支路费）、出差借款，以及工资核算辅助。"
            },
            project: {
                title: "项目 (Project)",
                accounts: [
                    "5001 / 6401 运输成本",
                    "6001 主营业务收入"
                ],
                remark: "用于独立盈亏核算。在物流行业，项目通常对应“运输线路”（如：上海-北京专线）或“大型合同项目”。开启后可生成该项目的独立利润表，分析该项目赚不赚钱。"
            },
            inventory: {
                title: "存货 (Inventory)",
                accounts: [
                    "1403 原材料（油品、轮胎、尿素）",
                    "1405 低值易耗品"
                ],
                remark: "用于物资进销存管理。物流企业主要用于管理油料、轮胎、零配件的入库与领用，精确核算车辆的物料消耗成本。"
            }
        };

        const AUX_DEFAULTS = {
            dept: [
                { code: "001", name: "人事行政", remark: "", enabled: true },
                { code: "002", name: "财务部", remark: "", enabled: true },
                { code: "003", name: "股东/董事会", remark: "", enabled: true },
                { code: "004", name: "技术部", remark: "", enabled: true },
                { code: "005", name: "数据中心", remark: "", enabled: true },
                { code: "006", name: "滁州运营部", remark: "", enabled: true },
                { code: "007", name: "滁州销售部", remark: "", enabled: true },
                { code: "008", name: "销售部", remark: "", enabled: true },
                { code: "009", name: "新媒体部", remark: "", enabled: true },
                { code: "011", name: "总经理", remark: "", enabled: true },
                { code: "012", name: "市场推广部", remark: "", enabled: true },
                { code: "013", name: "中山大区", remark: "", enabled: true },
                { code: "014", name: "滁州办公室", remark: "", enabled: true }
            ],
            customer: [
                { code: "001", name: "客户1", remark: "", enabled: true },
                { code: "002", name: "客户2", remark: "", enabled: true },
                { code: "003", name: "客户3", remark: "", enabled: true }
            ],
            vendor: [
                { code: "V01", name: "供应商1", remark: "", enabled: true },
                { code: "V02", name: "供应商2", remark: "", enabled: true }
            ],
            employee: [
                { code: "E01", name: "张三", remark: "", enabled: true },
                { code: "E02", name: "李四", remark: "", enabled: true }
            ],
            project: [
                { code: "P04", name: "地方项目", remark: "", enabled: true },
                { code: "P03", name: "食品项目", remark: "", enabled: true },
                { code: "P02", name: "华东项目", remark: "", enabled: true },
                { code: "P01", name: "华南项目", remark: "", enabled: true }
            ],
            inventory: [
                { code: "S01", name: "存货A", remark: "", enabled: true },
                { code: "S02", name: "存货B", remark: "", enabled: true }
            ]
        };

        const getAuxStorageKey = (type) => `AuxiliaryData:${type}`;
        const ensureAuxList = (type) => {
            const key = getAuxStorageKey(type);
            const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                } catch (error) {
                    // fallback to defaults
                }
            }
            const seeded = (AUX_DEFAULTS[type] || []).map(item => ({ ...item }));
            sessionStorage.setItem(key, JSON.stringify(seeded));
            localStorage.setItem(key, JSON.stringify(seeded));
            return seeded;
        };
        const saveAuxList = (type, list) => {
            sessionStorage.setItem(getAuxStorageKey(type), JSON.stringify(list));
            localStorage.setItem(getAuxStorageKey(type), JSON.stringify(list));
        };

        let currentType = sessionStorage.getItem("AuxCurrentType") || "dept";
        if (!AUX_TYPES.some(item => item.key === currentType)) currentType = "dept";
        window._auxCurrentType = currentType;

        window.renderAuxiliaryList = function () {
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type);
            const query = (document.getElementById("aux-search-input")?.value || "").trim().toLowerCase();
            const filtered = list.filter(item => {
                if (!query) return true;
                return (item.code || "").toLowerCase().includes(query) || (item.name || "").toLowerCase().includes(query);
            });
            const tbody = document.getElementById("aux-table-body");
            if (!tbody) return;
            tbody.innerHTML = filtered.map(item => `
                <tr>
                    <td style="text-align:center;"><input type="checkbox" class="aux-select" data-code="${item.code}"></td>
                    <td class="aux-actions-cell">
                        <button class="aux-icon-btn" onclick="editAuxiliaryItem('${item.code}')">✎</button>
                        <button class="aux-icon-btn danger" onclick="deleteAuxiliaryItem('${item.code}')">🗑</button>
                    </td>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.remark || "-"}</td>
                    <td>
                        <button class="aux-toggle ${item.enabled ? "is-on" : "is-off"}" onclick="toggleAuxiliaryStatus('${item.code}')">
                            ${item.enabled ? "已启用" : "未启用"}
                        </button>
                    </td>
                </tr>
            `).join("") || `<tr><td colspan="6" style="text-align:center; padding:20px;">暂无数据</td></tr>`;
        };

        window.renderAuxiliaryGuide = function () {
            const type = window._auxCurrentType || "dept";
            const guide = AUX_GUIDE[type] || { title: "", accounts: [], remark: "" };
            const panel = document.getElementById("aux-guide");
            if (!panel) return;
            const accountsHtml = (guide.accounts || []).map(item => `<li>${item}</li>`).join("");
            panel.innerHTML = `
                <div class="aux-guide-block">
                    <div class="aux-guide-title">${guide.title || ""}</div>
                    <div class="aux-guide-subtitle">推荐挂载科目：</div>
                    <ul class="aux-guide-list">${accountsHtml || "<li>暂无</li>"}</ul>
                </div>
                <div class="aux-guide-block">
                    <div class="aux-guide-subtitle">备注</div>
                    <div class="aux-guide-remark">${guide.remark || "暂无"}</div>
                </div>
            `;
        };

        window.setAuxiliaryType = function (type, btn) {
            window._auxCurrentType = type;
            sessionStorage.setItem("AuxCurrentType", type);
            document.querySelectorAll(".aux-tab").forEach(tab => tab.classList.remove("is-active"));
            if (btn && btn.classList) btn.classList.add("is-active");
            document.getElementById("aux-search-input").value = "";
            window.renderAuxiliaryList();
            window.renderAuxiliaryGuide();
        };

        window.searchAuxiliary = function (event) {
            if (event && event.key && event.key !== "Enter") return;
            window.renderAuxiliaryList();
        };

        window.resetAuxiliarySearch = function () {
            const input = document.getElementById("aux-search-input");
            if (input) input.value = "";
            window.renderAuxiliaryList();
        };

        window.toggleAuxiliaryQuickAdd = function () {
            const panel = document.getElementById("aux-quick-add");
            if (!panel) return;
            panel.classList.toggle("is-visible");
        };

        window.saveAuxiliaryQuickAdd = function () {
            const type = window._auxCurrentType || "dept";
            const codeInput = document.getElementById("aux-code-input");
            const nameInput = document.getElementById("aux-name-input");
            const remarkInput = document.getElementById("aux-remark-input");
            const code = codeInput ? codeInput.value.trim() : "";
            const name = nameInput ? nameInput.value.trim() : "";
            if (!code || !name) {
                alert("请填写编码与名称。");
                return;
            }
            const list = ensureAuxList(type);
            if (list.some(item => item.code === code)) {
                alert("编码已存在，请更换。");
                return;
            }
            list.unshift({
                code,
                name,
                remark: remarkInput ? remarkInput.value.trim() : "",
                enabled: true
            });
            saveAuxList(type, list);
            if (codeInput) codeInput.value = "";
            if (nameInput) nameInput.value = "";
            if (remarkInput) remarkInput.value = "";
            window.renderAuxiliaryList();
        };

        window.toggleAuxiliaryStatus = function (code) {
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type);
            const item = list.find(row => row.code === code);
            if (!item) return;
            item.enabled = !item.enabled;
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.editAuxiliaryItem = function (code) {
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type);
            const item = list.find(row => row.code === code);
            if (!item) return;
            const name = prompt("请输入名称：", item.name || "");
            if (name === null) return;
            const remark = prompt("请输入备注：", item.remark || "");
            if (remark === null) return;
            item.name = name.trim() || item.name;
            item.remark = remark.trim();
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.deleteAuxiliaryItem = function (code) {
            if (!confirm("确认删除该辅助项吗？")) return;
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type).filter(row => row.code !== code);
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.deleteSelectedAuxiliary = function () {
            const selected = Array.from(document.querySelectorAll(".aux-select:checked")).map(cb => cb.dataset.code);
            if (!selected.length) {
                alert("请先勾选要删除的行。");
                return;
            }
            if (!confirm("确认删除选中的辅助项吗？")) return;
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type).filter(row => !selected.includes(row.code));
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.toggleAllAuxiliary = function (checked) {
            document.querySelectorAll(".aux-select").forEach(cb => {
                cb.checked = checked;
            });
        };

        const tabButtons = AUX_TYPES.map(item => `
            <button class="aux-tab ${item.key === currentType ? "is-active" : ""}" onclick="setAuxiliaryType('${item.key}', this)">${item.label}</button>
        `).join("");

        contentHTML += `
                    <h2>辅助核算项</h2>
                    <p style="color: #7f8c8d;">定义和管理除科目外的辅助核算项目（如客户、供应商、项目、部门），用于精细化管理分析。</p>
                    <div class="auxiliary-panel">
                        <div class="aux-tabs">${tabButtons}</div>
                        <div class="aux-toolbar">
                            <div class="aux-search">
                                <input id="aux-search-input" type="text" placeholder="搜索编码/名称" onkeyup="searchAuxiliary(event)">
                                <button class="aux-icon-btn" onclick="searchAuxiliary()">🔍</button>
                                <button class="aux-icon-btn" onclick="resetAuxiliarySearch()">↻</button>
                            </div>
                            <div class="aux-actions">
                                <button class="btn-primary" onclick="toggleAuxiliaryQuickAdd()">新增</button>
                                <button class="btn-primary btn-danger" onclick="deleteSelectedAuxiliary()">删除</button>
                                <button class="btn-primary">导入</button>
                                <button class="btn-primary">导出</button>
                            </div>
                        </div>
                        <div class="aux-guide" id="aux-guide"></div>
                        <div class="aux-quick-add" id="aux-quick-add">
                            <input id="aux-code-input" type="text" placeholder="编码">
                            <input id="aux-name-input" type="text" placeholder="名称">
                            <input id="aux-remark-input" type="text" placeholder="备注">
                            <button class="btn-primary" onclick="saveAuxiliaryQuickAdd()">保存</button>
                        </div>
                        <div class="aux-table-wrap">
                            <table class="data-table aux-table">
                                <thead>
                                    <tr>
                                        <th style="width:40px; text-align:center;"><input type="checkbox" onclick="toggleAllAuxiliary(this.checked)"></th>
                                        <th style="width:90px;">操作</th>
                                        <th style="width:120px;">编码</th>
                                        <th>名称</th>
                                        <th>备注</th>
                                        <th style="width:120px;">启用状态</th>
                                    </tr>
                                </thead>
                                <tbody id="aux-table-body"></tbody>
                            </table>
                        </div>
                    </div>
                `;

        setTimeout(() => {
            window.renderAuxiliaryList();
            window.renderAuxiliaryGuide();
        }, 0);
    }

    // =========================================================================
    // 34. 资产卡片 (AssetCard) - [数据增强版：含无形资产]
    // =========================================================================
    else if (moduleCode === "AssetCard") {
        // 1. 读取数据 (如果为空，则初始化 6 条典型数据)
        let assets = JSON.parse(sessionStorage.getItem("AssetCards"));

        if (!assets || assets.length === 0) {
            assets = [
                // 1. 固定资产 - 生产工具 (重卡)
                {
                    code: "FA-TRUCK-001",
                    name: "斯堪尼亚重卡 (苏E88888)",
                    category: "运输车辆",
                    dept: "运输部",
                    model: "G450",
                    originalValue: "850,000.00",
                    accumulatedDepr: "150,000.00",
                    netValue: "700,000.00",
                    status: "使用中",
                    image: "https://img.icons8.com/color/96/truck.png",
                },
                // 2. 固定资产 - 配送工具 (轻客)
                {
                    code: "FA-VAN-005",
                    name: "公司打印机电脑设备",
                    category: "公司设备",
                    dept: "行政部",
                    model: "N800",
                    originalValue: "120,000.00",
                    accumulatedDepr: "20,000.00",
                    netValue: "100,000.00",
                    status: "使用中",
                    image: "img/computer.ico",
                },
                // 3. ★ 无形资产 - 软件 (您特别要求的)
                {
                    code: "IA-SOFT-001",
                    name: "自研物流CRM管理系统",
                    category: "无形资产",
                    dept: "研发部",
                    model: "V2.0 企业版",
                    originalValue: "500,000.00",
                    accumulatedDepr: "100,000.00",
                    netValue: "400,000.00",
                    status: "使用中",
                    image: "https://img.icons8.com/color/100/code.png",
                },
                // 4. 固定资产 - 仓储设备
                {
                    code: "FA-EQP-022",
                    name: "合力3吨柴油叉车",
                    category: "仓储设备",
                    dept: "仓储部",
                    model: "CPCD30",
                    originalValue: "65,000.00",
                    accumulatedDepr: "15,000.00",
                    netValue: "50,000.00",
                    status: "使用中",
                    image: "https://img.icons8.com/color/97/fork-lift.png",
                },
                // 5. 无形资产 - 资质许可
                {
                    code: "IA-LIC-002",
                    name: "道路运输经营许可证",
                    category: "无形资产",
                    dept: "总经办",
                    model: "长期许可",
                    originalValue: "20,000.00",
                    accumulatedDepr: "5,000.00",
                    netValue: "15,000.00",
                    status: "使用中",
                    image: "https://img.icons8.com/color/98/certificate.png",
                },
                // 6. 其他资产 - 办公装修
                {
                    code: "OA-DEC-001",
                    name: "总部办公室装修工程",
                    category: "长期待摊费用",
                    dept: "行政部",
                    model: "-",
                    originalValue: "300,000.00",
                    accumulatedDepr: "120,000.00",
                    netValue: "180,000.00",
                    status: "使用中",
                    image: "img/fixHouse.ico",
                },
            ];
            sessionStorage.setItem("AssetCards", JSON.stringify(assets));
        }

        // 2. 生成表格行 (保持之前的逻辑)
        const rows = assets
            .map((a) => {
                const imgUrl = a.image || "https://via.placeholder.com/40?text=Asset";
                const statusColor = a.status === "使用中" ? "#27ae60" : "#999";
                // 特殊标记无形资产
                const typeLabel =
                    a.category === "无形资产"
                        ? '<span style="background:#e6f7ff; color:#1890ff; font-size:10px; padding:2px 4px; border-radius:2px;">无形</span> '
                        : "";

                return `
                        <tr>
                            <td style="text-align:center;">
                                <img src="${imgUrl}" style="width: 32px; height: 32px; object-fit: contain; cursor: pointer;" title="点击预览">
                            </td>
                            <td>
                                <div style="font-weight:bold; color:#2980b9;">${a.code}</div>
                                <div style="font-size:12px; color:#666;">${typeLabel}${a.category}</div>
                            </td>
                            <td>
                                <div>${a.name}</div>
                                <div style="font-size:12px; color:#999;">${a.model}</div>
                            </td>
                            <td>${a.dept}</td>
                            <td style="text-align:right;">${a.originalValue}</td>
                            <td style="text-align:right; color:#e74c3c;">${a.accumulatedDepr}</td>
                            <td style="text-align:right; font-weight:bold;">${a.netValue}</td>
                            <td><span style="color:${statusColor}; font-weight:bold;">${a.status}</span></td>
                            <td>
                                <a href="javascript:void(0)" onclick="editAssetCard('${a.code}')" style="color:#3498db;">编辑</a> | 
                                <a href="javascript:void(0)" onclick="disposeAsset(this, '${a.code}')" style="color:#e74c3c;">处置</a>
                            </td>
                        </tr>
                    `;
            })
            .join("");

        contentHTML += `
                    <h2>固定/无形资产卡片 </h2>
                    <p style="color: #7f8c8d;">统一管理公司的固定资产（车辆、设备）及无形资产（软件、牌照），支持分类折旧与摊销。</p>
                    
                    <div class="filter-area" style="background:white; padding:15px; margin-bottom:20px; border-radius:6px;">
                        <div style="display: flex; gap: 15px; align-items:center;">
                            <input type="text" placeholder="资产名称/编码" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">资产类别 (全部)</option>
                                <option>运输车辆</option>
                                <option>无形资产</option>
                                <option>仓储设备</option>
                            </select>
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;" onclick="openAddAssetModal()">+ 新增资产</button>
                        <button class="btn-primary" style="background-color: #f39c12;">打印盘点表</button>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width:50px;">图</th>
                                <th>资产编码/类别</th>
                                <th>资产名称/规格</th>
                                <th>部门</th>
                                <th style="text-align:right;">原值</th>
                                <th style="text-align:right;">累计折旧/摊销</th>
                                <th style="text-align:right;">净值</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                    
                    `;
    }


    // =========================================================================
    // 60. 司机档案管理 (DriverProfile) - [运力中心核心]
    // =========================================================================
    else if (moduleCode === "DriverProfile") {
        // 1. 初始化模拟数据 (包含资质、车型、评级)
        let drivers = JSON.parse(sessionStorage.getItem('DriverList'));
        if (!drivers || drivers.length === 0) {
            drivers = [
                {
                    id: "DRV-2025001", name: "张伟", phone: "13811112222",
                    plate: "沪A·B8899", carType: "17.5米 | 厢式",
                    license: "A2", certStatus: "正常", expiryDate: "2026-05-20",
                    bankCard: "建设银行 (尾号8899)", deposit: 5000.00,
                    score: 4.9, status: "启用", tags: ["金牌司机", "干线专跑"]
                },
                {
                    id: "DRV-2025002", name: "李强", phone: "13900009999",
                    plate: "苏E·X7788", carType: "9.6米 | 高栏",
                    license: "B2", certStatus: "即将过期", expiryDate: "2025-12-01",
                    bankCard: "招商银行 (尾号1234)", deposit: 2000.00,
                    score: 4.5, status: "启用", tags: ["短途王"]
                },
                {
                    id: "DRV-2025003", name: "王建国", phone: "15066667777",
                    plate: "浙B·C5566", carType: "4.2米 | 厢式",
                    license: "C1", certStatus: "已过期", expiryDate: "2024-11-01",
                    bankCard: "-", deposit: 0.00,
                    score: 3.2, status: "黑名单", tags: ["多次货损", "投诉多"]
                }
            ];
            sessionStorage.setItem('DriverList', JSON.stringify(drivers));
        }

        // 2. 渲染列表
        const rows = drivers.map(d => {
            // 状态与资质样式
            let statusStyle = d.status === '启用' ? 'color:#27ae60; background:#f0f9f0;' : 'color:#e74c3c; background:#fff0f0;';

            let certBadge = "";
            if (d.certStatus === '正常') certBadge = `<span style="color:#27ae60">✔ 正常</span>`;
            else if (d.certStatus === '即将过期') certBadge = `<span style="color:#f39c12; font-weight:bold;">⚠️ 30天内过期</span>`;
            else certBadge = `<span style="color:#e74c3c; font-weight:bold;">🚫 已过期</span>`;

            // 标签渲染
            const tagHtml = d.tags.map(t => `<span style="font-size:10px; border:1px solid #ccc; padding:1px 4px; border-radius:3px; color:#666; margin-right:3px;">${t}</span>`).join('');

            // 评分星星
            const stars = "⭐".repeat(Math.floor(d.score));

            return `
            <tr>
                <td>
                    <div style="font-weight:bold; color:#2980b9; cursor:pointer;" onclick="viewDriverDetail('${d.id}')">${d.name}</div>
                    <div style="font-size:12px; color:#666;">${d.phone}</div>
                </td>
                <td>
                    <div style="font-weight:bold;">${d.plate}</div>
                    <div style="font-size:12px; color:#999;">${d.carType}</div>
                </td>
                <td>
                    <div>${d.license} 驾照</div>
                    <div style="font-size:12px;">有效期至: ${d.expiryDate}</div>
                </td>
                <td>${certBadge}</td>
                <td style="text-align:right;">
                    <div>押金: <span style="font-weight:bold;">${d.deposit.toLocaleString()}</span></div>
                    <div style="font-size:12px; color:#999;">${d.bankCard}</div>
                </td>
                <td>
                    <div style="color:#f39c12;">${d.score} ${stars}</div>
                    <div style="margin-top:2px;">${tagHtml}</div>
                </td>
                <td><span style="padding:2px 6px; border-radius:4px; font-size:12px; ${statusStyle}">${d.status}</span></td>
                <td>
                    <a href="javascript:void(0)" onclick="viewDriverDetail('${d.id}')" style="color:#3498db;">详情</a>
                    <span style="color:#ddd">|</span>
                    ${d.status === '黑名单'
                    ? `<a href="javascript:void(0)" onclick="toggleDriverStatus('${d.id}')" style="color:#27ae60;">解禁</a>`
                    : `<a href="javascript:void(0)" onclick="toggleDriverStatus('${d.id}')" style="color:#e74c3c;">拉黑</a>`
                }
                </td>
            </tr>
        `;
        }).join('');

        contentHTML += `
        <h2>司机档案库  🚚</h2>
        <p style="color: #7f8c8d;">全平台运力资源中心。管理司机 <b>身份资质</b>、<b>车辆信息</b>、<b>收款账户</b> 及 <b>信用评级</b>。</p>

        <div class="dashboard-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom:20px;">
            <div class="kpi-card" style="border-top: 4px solid #3498db;">
                <div class="kpi-title">👨‍✈️ 注册司机总数</div>
                <div class="kpi-value">3,420</div>
                <div class="kpi-trend">本月新增 +45</div>
            </div>
            <div class="kpi-card" style="border-top: 4px solid #27ae60;">
                <div class="kpi-title">✅ 活跃/接单中</div>
                <div class="kpi-value" style="color:#27ae60;">1,208</div>
                <div class="kpi-trend">运力利用率 35%</div>
            </div>
            <div class="kpi-card" style="border-top: 4px solid #f39c12;">
                <div class="kpi-title">⚠️ 证件临期/过期</div>
                <div class="kpi-value" style="color:#f39c12;">12</div>
                <div class="kpi-trend">需立即介入审核</div>
            </div>
            <div class="kpi-card" style="border-top: 4px solid #e74c3c;">
                <div class="kpi-title">🚫 黑名单/冻结</div>
                <div class="kpi-value" style="color:#e74c3c;">5</div>
                <div class="kpi-trend">严重违规拦截</div>
            </div>
        </div>

        <div class="filter-area" style="background:white; padding:15px; margin-bottom:20px; border-radius:6px; display:flex; justify-content:space-between;">
            <div style="display:flex; gap:10px;">
                <input type="text" placeholder="姓名/手机号" style="padding:8px; border:1px solid #ccc; width:140px;">
                <input type="text" placeholder="车牌号" style="padding:8px; border:1px solid #ccc; width:120px;">
                <select style="padding:8px; border:1px solid #ccc;">
                    <option>所有车型</option>
                    <option>17.5米</option>
                    <option>9.6米</option>
                    <option>4.2米</option>
                </select>
                <select style="padding:8px; border:1px solid #ccc;">
                    <option>所有状态</option>
                    <option>正常</option>
                    <option>临期预警</option>
                    <option>黑名单</option>
                </select>
                <button class="btn-primary">查询</button>
            </div>
            <div>
                
                <button class="btn-primary" style="background:#27ae60;">+ 新增司机</button>
            </div>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>司机信息</th>
                    <th>主驾车辆</th>
                    <th>资质/证件效期</th>
                    <th>合规状态</th>
                    <th style="text-align:right;">财务信息</th>
                    <th>信用评分</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
    }

    // =========================================================================
    // 61. 司机详情页 (DriverProfileDetail) - [360度画像]
    // =========================================================================
    else if (moduleCode === "DriverProfileDetail") {
        const driverId = window.g_currentDriverId || "DRV-2025001";
        // 实际开发中根据ID从数据库取，这里模拟取第一条
        const d = JSON.parse(sessionStorage.getItem('DriverList'))[0];

        contentHTML += `
        <div style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <button class="btn-primary" style="background:#95a5a6; padding:5px 15px;" onclick="loadContent('DriverProfile')"> < 返回列表</button>
                <h2 style="display:inline-block; margin-left:15px; vertical-align:middle;">司机档案：<span style="color:#2980b9;">${d.name}</span> <span style="font-size:14px; color:#666; font-weight:normal;">(${d.phone})</span></h2>
            </div>
            <div>
                 <button class="btn-primary" style="background:#e67e22;" onclick="alert('已发送更新证件通知短信')">🔔 催更证件</button>
                 <button class="btn-primary">💾 保存修改</button>
            </div>
        </div>

        <div style="display:flex; gap:20px; align-items:flex-start;">
            
            <div style="width:250px; background:white; padding:20px; border-radius:8px; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <div style="width:100px; height:100px; background:#eee; border-radius:50%; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; font-size:40px;">👨‍✈️</div>
                <h3 style="margin:0;">${d.name}</h3>
                <p style="color:#666; font-size:13px;">注册日期：2023-01-15</p>
                <div style="margin:15px 0; border-top:1px solid #eee; border-bottom:1px solid #eee; padding:15px 0;">
                    <div style="font-size:24px; color:#f39c12; font-weight:bold;">${d.score}</div>
                    <div style="font-size:12px; color:#999;">综合评分 (5.0满分)</div>
                </div>
                <div style="text-align:left; font-size:13px; line-height:2;">
                    <div>累计接单：<span style="float:right; font-weight:bold;">1,203 单</span></div>
                    <div>准点率：<span style="float:right; font-weight:bold; color:#27ae60;">98.5%</span></div>
                    <div>货损率：<span style="float:right; font-weight:bold;">0.01%</span></div>
                </div>
            </div>

            <div style="flex:1; background:white; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                
                <div style="border-bottom:1px solid #eee; margin-bottom:20px; display:flex; gap:30px;">
                    <div style="padding-bottom:10px; border-bottom:3px solid #3498db; color:#3498db; font-weight:bold; cursor:pointer;">基本信息</div>
                    <div style="padding-bottom:10px; cursor:pointer; color:#666;">车辆绑定 (2)</div>
                    <div style="padding-bottom:10px; cursor:pointer; color:#666;">收款账户</div>
                    <div style="padding-bottom:10px; cursor:pointer; color:#666;">证件影像</div>
                </div>

                <h4 style="border-left:4px solid #3498db; padding-left:10px; margin-top:0;">👤 身份信息</h4>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-bottom:20px;">
                    <div><label style="color:#999; font-size:12px;">身份证号</label><div style="font-weight:bold;">32010219800101XXXX</div></div>
                    <div><label style="color:#999; font-size:12px;">驾驶证档案号</label><div style="font-weight:bold;">123456789012</div></div>
                    <div><label style="color:#999; font-size:12px;">准驾车型</label><div style="font-weight:bold;">${d.license} (包含C1/B2)</div></div>
                    <div><label style="color:#999; font-size:12px;">初次领证日期</label><div>2010-05-20 (驾龄15年)</div></div>
                    <div><label style="color:#999; font-size:12px;">从业资格证号</label><div>320000001122</div></div>
                    <div><label style="color:#999; font-size:12px;">证件有效期</label><div style="color:#27ae60;">${d.expiryDate}</div></div>
                </div>

                <h4 style="border-left:4px solid #f39c12; padding-left:10px;">🚚 常用车辆</h4>
                <table class="data-table" style="margin-bottom:20px;">
                    <thead><tr><th>车牌号</th><th>类型</th><th>载重</th><th>绑定时间</th><th>状态</th></tr></thead>
                    <tbody>
                        <tr><td>${d.plate}</td><td>${d.carType}</td><td>30吨</td><td>2023-01-15</td><td><span style="color:#27ae60">● 使用中</span></td></tr>
                        <tr><td>苏E·88888</td><td>9.6米 高栏</td><td>18吨</td><td>2024-06-10</td><td><span style="color:#999">● 备用</span></td></tr>
                    </tbody>
                </table>

                <h4 style="border-left:4px solid #27ae60; padding-left:10px;">💳 结算账户 (用于运费打款)</h4>
                <div style="background:#f9f9f9; padding:15px; border-radius:6px; border:1px dashed #ccc;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span style="font-weight:bold;">中国建设银行 (储蓄卡)</span>
                        <span style="color:#27ae60;">✅ 鉴权通过</span>
                    </div>
                    <div>卡号：6217 0000 8888 9999</div>
                    <div>户名：张伟</div>
                    <div>开户行：建行上海浦东支行</div>
                </div>

            </div>
        </div>
      `;
    }

    // =========================================================================
    // 61. 司机详情页 (DriverProfileDetail) - [360度画像]
    // =========================================================================
    else if (moduleCode === "DriverList") {
        const driverId = window.g_currentDriverId || "DRV-2025001";
        // 实际开发中根据ID从数据库取，这里模拟取第一条
        const d = JSON.parse(sessionStorage.getItem('DriverList'))[0];

        contentHTML += `
        <div style="margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <button class="btn-primary" style="background:#95a5a6; padding:5px 15px;" onclick="loadContent('DriverProfile')"> < 返回列表</button>
                <h2 style="display:inline-block; margin-left:15px; vertical-align:middle;">司机档案：<span style="color:#2980b9;">${d.name}</span> <span style="font-size:14px; color:#666; font-weight:normal;">(${d.phone})</span></h2>
            </div>
            <div>
                 <button class="btn-primary" style="background:#e67e22;" onclick="alert('已发送更新证件通知短信')">🔔 催更证件</button>
                 <button class="btn-primary">💾 保存修改</button>
            </div>
        </div>

        <div style="display:flex; gap:20px; align-items:flex-start;">
            
            <div style="width:250px; background:white; padding:20px; border-radius:8px; text-align:center; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                <div style="width:100px; height:100px; background:#eee; border-radius:50%; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; font-size:40px;">👨‍✈️</div>
                <h3 style="margin:0;">${d.name}</h3>
                <p style="color:#666; font-size:13px;">注册日期：2023-01-15</p>
                <div style="margin:15px 0; border-top:1px solid #eee; border-bottom:1px solid #eee; padding:15px 0;">
                    <div style="font-size:24px; color:#f39c12; font-weight:bold;">${d.score}</div>
                    <div style="font-size:12px; color:#999;">综合评分 (5.0满分)</div>
                </div>
                <div style="text-align:left; font-size:13px; line-height:2;">
                    <div>累计接单：<span style="float:right; font-weight:bold;">1,203 单</span></div>
                    <div>准点率：<span style="float:right; font-weight:bold; color:#27ae60;">98.5%</span></div>
                    <div>货损率：<span style="float:right; font-weight:bold;">0.01%</span></div>
                </div>
            </div>

            <div style="flex:1; background:white; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05);">
                
                <div style="border-bottom:1px solid #eee; margin-bottom:20px; display:flex; gap:30px;">
                    <div style="padding-bottom:10px; border-bottom:3px solid #3498db; color:#3498db; font-weight:bold; cursor:pointer;">基本信息</div>
                    <div style="padding-bottom:10px; cursor:pointer; color:#666;">车辆绑定 (2)</div>
                    <div style="padding-bottom:10px; cursor:pointer; color:#666;">收款账户</div>
                    <div style="padding-bottom:10px; cursor:pointer; color:#666;">证件影像</div>
                </div>

                <h4 style="border-left:4px solid #3498db; padding-left:10px; margin-top:0;">👤 身份信息</h4>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-bottom:20px;">
                    <div><label style="color:#999; font-size:12px;">身份证号</label><div style="font-weight:bold;">32010219800101XXXX</div></div>
                    <div><label style="color:#999; font-size:12px;">驾驶证档案号</label><div style="font-weight:bold;">123456789012</div></div>
                    <div><label style="color:#999; font-size:12px;">准驾车型</label><div style="font-weight:bold;">${d.license} (包含C1/B2)</div></div>
                    <div><label style="color:#999; font-size:12px;">初次领证日期</label><div>2010-05-20 (驾龄15年)</div></div>
                    <div><label style="color:#999; font-size:12px;">从业资格证号</label><div>320000001122</div></div>
                    <div><label style="color:#999; font-size:12px;">证件有效期</label><div style="color:#27ae60;">${d.expiryDate}</div></div>
                </div>

                <h4 style="border-left:4px solid #f39c12; padding-left:10px;">🚚 常用车辆</h4>
                <table class="data-table" style="margin-bottom:20px;">
                    <thead><tr><th>车牌号</th><th>类型</th><th>载重</th><th>绑定时间</th><th>状态</th></tr></thead>
                    <tbody>
                        <tr><td>${d.plate}</td><td>${d.carType}</td><td>30吨</td><td>2023-01-15</td><td><span style="color:#27ae60">● 使用中</span></td></tr>
                        <tr><td>苏E·88888</td><td>9.6米 高栏</td><td>18吨</td><td>2024-06-10</td><td><span style="color:#999">● 备用</span></td></tr>
                    </tbody>
                </table>

                <h4 style="border-left:4px solid #27ae60; padding-left:10px;">💳 结算账户 (用于运费打款)</h4>
                <div style="background:#f9f9f9; padding:15px; border-radius:6px; border:1px dashed #ccc;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span style="font-weight:bold;">中国建设银行 (储蓄卡)</span>
                        <span style="color:#27ae60;">✅ 鉴权通过</span>
                    </div>
                    <div>卡号：6217 0000 8888 9999</div>
                    <div>户名：张伟</div>
                    <div>开户行：建行上海浦东支行</div>
                </div>

            </div>
        </div>
      `;
    }

    // =========================================================================
    // 35. 折旧计算 (Asset Depreciation)
    // =========================================================================
    else if (moduleCode === "AssetDepreciation") {
        contentHTML += `
                    <h2>折旧计算</h2>
                    <p style="color: #7f8c8d;">执行每月固定资产折旧的自动计算、预览和记账凭证生成。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">会计期间</option>
                                <option>2025年11期</option>
                                <option>2025年10期</option>
                            </select>
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">计算状态</option>
                                <option>待计算</option>
                                <option>已完成</option>
                            </select>
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">执行本月折旧计算</button>
                        <button class="btn-primary" style="background-color: #3498db;">生成折旧凭证</button>
                    </div>

                    <h3>折旧计算结果 (2025年11期)</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>折旧期间</th>
                                <th>资产总数</th>
                                <th>参与折旧资产数</th>
                                <th>本期折旧总额 (RMB)</th>
                                <th>计算状态</th>
                                <th>凭证状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>2025年11期</td>
                                <td>150</td>
                                <td>148</td>
                                <td>38,500.00</td>
                                <td><span style="color: #27ae60;">已完成</span></td>
                                <td><span style="color: #f39c12;">待生成</span></td>
                                <td><a href="#" style="color:#3498db;">查看明细</a> | <a href="#" style="color:#3498db;">生成凭证</a></td>
                            </tr>
                            <tr>
                                <td>2025年10期</td>
                                <td>150</td>
                                <td>148</td>
                                <td>38,500.00</td>
                                <td><span style="color: #27ae60;">已完成</span></td>
                                <td><span style="color: #27ae60;">已生成</span></td>
                                <td><a href="#" style="color:#3498db;">查看凭证</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 36. 资产变动 (Asset Change)
    // =========================================================================
    else if (moduleCode === "AssetChange") {
        contentHTML += `
                    <h2>资产变动</h2>
                    <p style="color: #7f8c8d;">记录固定资产的增加、减少、转移和价值调整等变动事件。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="资产编码 / 变动单号" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">变动类型 (全部)</option>
                                <option>新增</option>
                                <option>报废</option>
                                <option>部门转移</option>
                            </select>
                            <input type="date" placeholder="变动日期范围" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">+ 登记新增资产</button>
                        <button class="btn-primary" style="background-color: #f39c12;">登记资产处置</button>
                    </div>

                    <h3>资产变动记录列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>变动单号</th>
                                <th>资产名称</th>
                                <th>变动类型</th>
                                <th>变动日期</th>
                                <th>涉及金额 (RMB)</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ZD20251101</td>
                                <td>重型牵引车 02</td>
                                <td><span style="color: #27ae60;">新增</span></td>
                                <td>2025-11-15</td>
                                <td>380,000.00</td>
                                <td><span style="color: #27ae60;">已完成</span></td>
                                <td><a href="#" style="color:#3498db;">查看卡片</a></td>
                            </tr>
                            <tr>
                                <td>ZD20251102</td>
                                <td>旧打印机</td>
                                <td><span style="color: #e74c3c;">报废</span></td>
                                <td>2025-11-18</td>
                                <td>-1,500.00 (处置损失)</td>
                                <td><span style="color: #27ae60;">已完成</span></td>
                                <td><a href="#" style="color:#3498db;">查看详情</a></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 37. 凭证录入 (VoucherEntryReview) - [智能交互重构版]
    // =========================================================================

    else if (moduleCode === "VoucherEntryReview") {
        // 1. 读取历史凭证列表
        const savedVouchers = JSON.parse(
            sessionStorage.getItem("ManualVouchers") || "[]"
        );
        const sessionSubjects = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]");
        const localSubjects = JSON.parse(localStorage.getItem("AcctSubjects") || "[]");
        let subjectList = Array.isArray(sessionSubjects) ? sessionSubjects : [];
        if (subjectList.length < 2 && Array.isArray(localSubjects) && localSubjects.length > 1) {
            subjectList = localSubjects;
        }
        if (subjectList.length < 2 && typeof ACCOUNTING_STANDARD_TEMPLATES !== "undefined") {
            const standardKey = localStorage.getItem("AccountingStandard")
                || sessionStorage.getItem("AccountingStandard")
                || "enterprise";
            const standardList = ACCOUNTING_STANDARD_TEMPLATES[standardKey]
                || ACCOUNTING_STANDARD_TEMPLATES.enterprise
                || ACCOUNTING_STANDARD_TEMPLATES.small
                || [];
            if (standardList.length) {
                subjectList = standardList;
            }
        }
        if (subjectList.length > 1) {
            sessionStorage.setItem("AcctSubjects", JSON.stringify(subjectList));
        }
        const normalizeSubjectCode = window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, ""));
        window.normalizeVoucherSubjectCode = normalizeSubjectCode;
        window._voucherSubjectList = subjectList;
        const subjectOptions = subjectList.length
            ? subjectList.map(item => {
                const normalized = normalizeSubjectCode(item.code);
                const code = normalized || item.code || "";
                const name = item.name || "";
                const displayValue = `${code} ${name}`.trim();
                return displayValue ? `<option value="${displayValue}"></option>` : "";
            }).join("")
            : `<option value="">暂无科目</option>`;
        window._voucherSubjectOptions = subjectOptions;
        const subjectMap = {};
        subjectList.forEach(item => {
            if (item.code) subjectMap[item.code] = item;
            const normalized = normalizeSubjectCode(item.code);
            if (normalized) subjectMap[normalized] = item;
        });
        window._voucherSubjectMap = subjectMap;
        const summaryTemplates = getVoucherSummaryTemplates();
        const summaryTemplateOptions = summaryTemplates.map(item => `<option value="${item.summary}">${item.summary}</option>`).join("");
        const summaryTemplateDatalist = summaryTemplates.map(item => `<option value="${item.summary}"></option>`).join("");

        // 2. 生成列表行 HTML (★修改了这里：增加了状态判断和操作按钮★)
        const voucherRows = savedVouchers.map((v) => {
            let statusBadge = "";
            let actionBtns = "";

            // 默认状态处理 (防止旧数据没状态)
            const currentStatus = v.status || "待审核";

            // --- 状态与按钮逻辑 ---
            if (currentStatus === "待审核") {
                statusBadge = `<span style="color:#f39c12; background:#fef9e7; padding:2px 6px; border-radius:4px; border:1px solid #f39c12;">⏳ 待审核</span>`;
                // 待审核 -> 显示【审核】
                actionBtns = `
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#27ae60;" onclick="auditVoucher('${v.id}')">审核</button>
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#c0392b;" onclick="deleteVoucher('${v.id}')">删除</button>
                `;
            } else if (currentStatus === "已审核") {
                statusBadge = `<span style="color:#3498db; background:#ebf5fb; padding:2px 6px; border-radius:4px; border:1px solid #3498db;">🛡️ 已审核</span>`;
                // 已审核 -> 显示【过账】
                actionBtns = `
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#8e44ad;" onclick="postVoucher('${v.id}')">⚡ 过账</button>
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#95a5a6;" onclick="unAuditVoucher('${v.id}')">反审</button>
                `;
            } else if (currentStatus === "已记账" || currentStatus === "已过账") {
                statusBadge = `<span style="color:#27ae60; background:#eafaf1; padding:2px 6px; border-radius:4px; border:1px solid #27ae60;">✔ 已记账</span>`;
                // 已记账 -> 显示【冲销】
                actionBtns = `
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#e74c3c;" onclick="reverseVoucher('${v.id}')">⛔ 冲销</button>
                `;
            } else if (currentStatus === "已驳回") {
                statusBadge = `<span style="color:#e74c3c; background:#fef0f0; padding:2px 6px; border-radius:4px; border:1px solid #e74c3c;">⛔ 已驳回</span>`;
                actionBtns = `
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#2980b9;" onclick="editRejectedVoucher('${v.id}')">修改</button>
                    <button class="btn-primary" style="padding:2px 8px; font-size:12px; background:#c0392b;" onclick="deleteVoucher('${v.id}')">删除</button>
                `;
            } else if (currentStatus === "已冲销") {
                statusBadge = `<span style="color:#999; text-decoration:line-through;">❌ 已冲销</span>`;
                actionBtns = `<span style="color:#ccc; font-size:12px;">已作废</span>`;
            }

            const amountValue =
                parseFloat((v.amount || "0").toString().replace(/,/g, "")) || 0;
            const isReverseVoucher =
                v.isRed ||
                (typeof v.id === "string" && v.id.includes("-REV")) ||
                amountValue < 0;
            const baseId =
                typeof v.id === "string" ? v.id.replace(/-REV.*$/, "") : "";
            const originVoucher =
                baseId && baseId !== v.id
                    ? savedVouchers.find((item) => item.id === baseId)
                    : null;
            const originLine =
                originVoucher && originVoucher.lines && originVoucher.lines[0];
            const originSummary =
                originVoucher &&
                (originVoucher.summary ||
                    (originLine && (originLine.summary || originLine.digest)) ||
                    "");
            const lineSummary =
                v.summary ||
                (v.lines && v.lines[0] && (v.lines[0].summary || v.lines[0].digest)) ||
                "";
            const stripReversePrefix = (text) =>
                (text || "").toString().replace(/^冲销[:：]?\s*/i, "").trim();
            const baseSummary =
                stripReversePrefix(lineSummary) ||
                stripReversePrefix(originSummary) ||
                "-";
            let summaryText = baseSummary;
            if (isReverseVoucher && baseSummary !== "-") {
                const raw = (lineSummary || v.summary || "").toString().trim();
                summaryText = raw.startsWith("冲销") ? raw : `冲销：${baseSummary}`;
            }
            const reverseTag = isReverseVoucher
                ? "冲销"
                : v.status === "已冲销"
                ? "已冲销"
                : "-";

            return `<tr>
                <td><a href="javascript:void(0)" onclick="openVoucherDetail('${v.id}')" style="color:#3498db; font-weight:bold;">${v.id}</a></td>
                <td>${v.date}</td>
                <td>${reverseTag}</td>
                <td>${summaryText}</td>
                <td style="text-align:right; font-weight:bold;">${parseFloat(v.amount).toLocaleString()}</td>
                <td>${v.user || 'system'}</td>
                <td>${statusBadge}</td>
                <td>${actionBtns}</td>
            </tr>`;
        }).join("");

        // 3. 页面 HTML 组装 (保留了你原来的录入表单结构)
        contentHTML += `
        <div class="voucher-entry-shell">
            <div class="voucher-entry-toolbar">
                <button class="btn-primary" onclick="resetSmartForm()">新增</button>
                <button class="btn-primary" onclick="saveSmartVoucher()">保存</button>
                <button class="btn-primary" onclick="saveSmartVoucher()">提交</button>
                <div class="voucher-entry-toolbar-spacer"></div>
                <button class="btn-primary btn-ghost" onclick="loadContent('Dashboard')">退出</button>
            </div>

            <div class="voucher-entry-title" id="voucher-entry-title">记账凭证</div>

            <div class="voucher-entry-header">
                <div class="voucher-field">
                    <label>账簿</label>
                    <input type="text" placeholder="账簿">
                </div>
                <div class="voucher-field">
                    <label>日期</label>
                    <input id="voucher-date" type="date" value="${new Date().toISOString().split("T")[0]}">
                </div>
                <div class="voucher-field">
                    <label>凭证字</label>
                    <select id="voucher-word" onchange="syncVoucherWord()">
                        <option value="记">记</option>
                        <option value="收">收</option>
                        <option value="付">付</option>
                        <option value="转">转</option>
                    </select>
                </div>
                <div class="voucher-field">
                    <label>凭证号</label>
                    <div class="voucher-id" id="current-v-id">记-0001</div>
                </div>
                <div class="voucher-field">
                    <label>附件数</label>
                    <input type="number" min="0" value="0">
                </div>
            </div>

            <div class="voucher-entry-actions">
                <button class="btn-primary" onclick="addVoucherLineRow()">新增行</button>
                <button class="btn-primary btn-ghost" onclick="removeLastVoucherLineRow()">删除行</button>
            </div>

            <div class="voucher-entry-table-wrap">
                <table class="voucher-entry-table">
                    <thead>
                        <tr>
                            <th style="width:60px;">序号</th>
                            <th style="width:200px;">摘要</th>
                            <th style="width:260px;">科目名称</th>
                            <th style="width:180px;">辅助核算项目</th>
                            <th style="width:120px;">借方金额</th>
                            <th style="width:120px;">贷方金额</th>
                            <th style="width:70px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="entry-lines-body">
                        <tr class="entry-line-row">
                            <td class="entry-index">1</td>
                            <td><input class="entry-summary" type="text" list="voucher-summary-templates" oninput="updateSmartPreview()" placeholder="摘要" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;"></td>
                            <td>
                                <div class="subject-picker">
                                    <input class="entry-subject" autocomplete="off" oninput="handleSubjectInputChange(this)" oncompositionend="handleSubjectInputChange(this)" onblur="handleSubjectBlur(this)" placeholder="科目名称/编码" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;">
                                    <button type="button" class="subject-toggle" onclick="toggleSubjectDropdown(this)">▾</button>
                                    <div class="subject-dropdown"></div>
                                </div>
                            </td>
                            <td>
                                <select class="entry-aux" onchange="updateSmartPreview()" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;">
                                    <option value="">无</option>
                                </select>
                            </td>
                            <td><input class="entry-debit" type="number" oninput="updateSmartPreview()" placeholder="0.00" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;"></td>
                            <td><input class="entry-credit" type="number" oninput="updateSmartPreview()" placeholder="0.00" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;"></td>
                            <td style="text-align:center;"><button class="btn-primary" style="background:#e74c3c; padding:2px 6px;" onclick="removeVoucherLineRow(this)">-</button></td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align:center; font-weight:bold;">合计</td>
                            <td id="entry-total-debit" style="text-align:right; font-weight:bold;">0.00</td>
                            <td id="entry-total-credit" style="text-align:right; font-weight:bold;">0.00</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
        <div class="voucher-records-panel">
            <div class="voucher-records-header">
                <h3>凭证记录</h3>
                <div class="voucher-records-meta">
                    共 <span id="voucher-record-count">0</span> 条
                </div>
            </div>
            <div class="voucher-records-table-wrap">
                <table class="voucher-records-table">
                    <thead>
                        <tr>
                            <th style="width:60px;">序号</th>
                            <th style="width:140px;">凭证号</th>
                            <th style="width:120px;">日期</th>
                            <th style="width:120px;">类型</th>
                            <th>摘要</th>
                            <th style="width:120px;">金额</th>
                            <th style="width:120px;">状态</th>
                            <th style="width:100px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="voucher-records-body"></tbody>
                </table>
            </div>
            <div class="voucher-records-pagination" id="voucher-records-pagination"></div>
        </div>
        <datalist id="voucher-summary-templates">${summaryTemplateDatalist}</datalist>
    `;

        setTimeout(() => {
            if (typeof window.updateSubjectCodeInputs === "function") {
                window.updateSubjectCodeInputs();
            }
            if (typeof window.addVoucherLineRow === "function") {
                const rowCount = document.querySelectorAll(".entry-line-row").length;
                if (rowCount === 0) window.addVoucherLineRow();
            }
            if (typeof window.updateSmartPreview === "function") {
                window.updateSmartPreview();
            }
            if (typeof window.updateEntryRowIndex === "function") {
                window.updateEntryRowIndex();
            }
            document.querySelectorAll(".entry-line-row").forEach(row => {
                const subjectValue = row.querySelector(".entry-subject")?.value || "";
                if (typeof window.updateAuxiliaryOptionsForRow === "function") {
                    window.updateAuxiliaryOptionsForRow(row, subjectValue);
                }
                if (typeof window.updateSubjectNameForRow === "function") {
                    window.updateSubjectNameForRow(row, subjectValue);
                }
            });
            if (typeof window.syncVoucherWord === "function") {
                window.syncVoucherWord();
            }
            if (typeof window.updateSubjectDatalist === "function") {
                window.updateSubjectDatalist("");
            }
            if (typeof window.renderVoucherRecordPage === "function") {
                window.renderVoucherRecordPage();
            }
        }, 100);
    }

// =========================================================================
  // ★★★ [修复版] 凭证处理中心 ★★★
  // =========================================================================
  else if (moduleCode === "FinanceVoucherAudit") {
    const seedRows = Array.isArray(window.__voucherSeedRows) ? window.__voucherSeedRows : [];
    const normalizeNumber = (value) => {
        if (value === null || value === undefined) return "";
        const text = value.toString().trim();
        if (!text) return "";
        const num = parseFloat(text.replace(/,/g, ""));
        return Number.isFinite(num) ? num.toString() : text;
    };
    const normalizeDate = (value) => {
        if (!value) return "";
        const text = value.toString().trim();
        if (!text) return "";
        if (text.includes("-")) return text;
        const serial = parseFloat(text);
        if (!Number.isFinite(serial)) return text;
        const utc = Math.floor(serial - 25569);
        if (!Number.isFinite(utc)) return text;
        const date = new Date(utc * 86400 * 1000);
        if (Number.isNaN(date.getTime())) return text;
        return date.toISOString().slice(0, 10);
    };
    const buildVouchersFromSeed = (rows) => {
        const map = new Map();
        rows.forEach(row => {
            const id = (row.id || "").toString().trim();
            if (!id) return;
            const voucher = map.get(id) || {
                id,
                date: normalizeDate(row.date),
                amount: normalizeNumber(row.amount),
                summary: (row.summary || "").toString().trim(),
                user: (row.user || "").toString().trim() || "导入",
                auditUser: (row.auditUser || "").toString().trim(),
                status: (row.auditUser || "").toString().trim() ? "已审核" : "待审核",
                lines: []
            };
            const accountCode = (row.accountCode || "").toString().trim();
            const accountName = (row.accountName || "").toString().trim();
            const account = [accountCode, accountName].filter(Boolean).join(" ").trim();
            voucher.lines.push({
                summary: (row.summary || "").toString().trim(),
                account: account,
                accountCode: accountCode,
                accountName: accountName,
                aux: (row.aux || "").toString().trim(),
                debit: normalizeNumber(row.debit),
                credit: normalizeNumber(row.credit)
            });
            if (!voucher.summary && row.summary) voucher.summary = row.summary.toString().trim();
            if (!voucher.amount && row.amount) voucher.amount = normalizeNumber(row.amount);
            if (!voucher.date && row.date) voucher.date = normalizeDate(row.date);
            if (!voucher.user && row.user) voucher.user = row.user.toString().trim();
            if (!voucher.auditUser && row.auditUser) voucher.auditUser = row.auditUser.toString().trim();
            if (voucher.auditUser) voucher.status = "已审核";
            map.set(id, voucher);
        });
        return Array.from(map.values());
    };

    window.ensureVoucherSeedData = function(force) {
        const existing = window.getManualVouchers ? window.getManualVouchers() : [];
        if (existing.length && !force) {
            return { loaded: false, count: existing.length, message: `已存在 ${existing.length} 张凭证` };
        }
        if (!seedRows.length) {
            return { loaded: false, count: 0, message: "未检测到可导入的Excel数据" };
        }
        const list = buildVouchersFromSeed(seedRows);
        if (typeof window.saveManualVouchers === "function") {
            window.saveManualVouchers(list);
        } else {
            sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        }
        return { loaded: true, count: list.length, message: `已导入 ${list.length} 张凭证` };
    };

    window.reloadVoucherSeedData = function() {
        if (!confirm("确认从Excel重新导入凭证？\n此操作将覆盖当前凭证数据。")) return;
        const result = window.ensureVoucherSeedData(true);
        alert(result.message || "已重新导入");
        loadContent('FinanceVoucherAudit');
    };

    const seedResult = window.ensureVoucherSeedData(false);
    const seedNotice = seedResult ? seedResult.message : "";
    const allVouchers = window.getManualVouchers
        ? window.getManualVouchers()
        : JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const statusWeight = { "待审核": 1, "已审核": 2, "已过账": 3, "已记账": 3, "已驳回": 4, "已冲销": 5, "已作废": 6 };
    allVouchers.sort((a, b) => (statusWeight[a.status] || 9) - (statusWeight[b.status] || 9));

    window.getCurrentLoginName = function() {
        return sessionStorage.getItem("CurrentUserName")
            || localStorage.getItem("CurrentUserName")
            || "当前用户";
    };

    window.getSelectedVoucherIds = function() {
        const ids = Array.from(document.querySelectorAll(".voucher-select:checked"))
            .map(cb => cb.dataset.voucherId)
            .filter(Boolean);
        return Array.from(new Set(ids));
    };

    window.updateVoucherActionButtons = function() {
        const hasSelection = window.getSelectedVoucherIds().length > 0;
        document.querySelectorAll(".voucher-center__action").forEach(btn => {
            btn.disabled = !hasSelection;
        });
    };

    window.toggleVoucherGroupSelection = function(checkbox) {
        if (!checkbox) return;
        const voucherId = checkbox.dataset.voucherId;
        if (!voucherId) return;
        document.querySelectorAll(`.voucher-select[data-voucher-id="${voucherId}"]`).forEach(cb => {
            cb.checked = checkbox.checked;
        });
        window.updateVoucherActionButtons();
    };

    window.toggleAllVoucherSelection = function(checked) {
        document.querySelectorAll(".voucher-select").forEach(cb => {
            cb.checked = checked;
        });
        window.updateVoucherActionButtons();
    };

    window.applyVoucherAction = function(action) {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            alert("请先选择凭证。");
            return;
        }
        const actionMap = {
            audit: "审核",
            unaudit: "反审",
            post: "记账",
            reverse: "冲销",
            void: "作废"
        };
        const actionLabel = actionMap[action] || "操作";
        if (!confirm(`确认对选中凭证执行${actionLabel}吗？`)) return;

        let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        const idSet = new Set(ids);

        if (action === "audit") {
            list.forEach(item => {
                if (idSet.has(item.id)) {
                    if (item.status === "已作废" || item.status === "已冲销") return;
                    item.status = "已审核";
                }
            });
        } else if (action === "unaudit") {
            list.forEach(item => {
                if (idSet.has(item.id)) {
                    if (item.status === "已作废" || item.status === "已冲销") return;
                    item.status = "待审核";
                }
            });
        } else if (action === "post") {
            list.forEach(item => {
                if (idSet.has(item.id)) {
                    if (item.status === "已作废" || item.status === "已冲销") return;
                    item.status = "已记账";
                }
            });
        } else if (action === "reverse") {
            const stripRevSuffix = (id) => (id || "").toString().replace(/-REV.*$/i, "");
            const parseIdParts = (id) => {
                const base = stripRevSuffix(id);
                const match = base.match(/^(.*?)(\d+)\s*$/);
                if (!match) return { base, prefix: base, num: null, width: 0 };
                return {
                    base,
                    prefix: match[1],
                    num: parseInt(match[2], 10),
                    width: match[2].length
                };
            };
            const buildReverseSummary = (voucher) => {
                const { num } = parseIdParts(voucher.id);
                const dateText = (voucher.date || "").toString();
                let month = "";
                let day = "";
                const date = new Date(dateText);
                if (!Number.isNaN(date.getTime())) {
                    month = `${date.getMonth() + 1}`;
                    day = `${date.getDate()}`;
                } else if (dateText.includes("-")) {
                    const parts = dateText.split("-");
                    if (parts.length >= 3) {
                        month = `${parseInt(parts[1], 10) || ""}`;
                        day = `${parseInt(parts[2], 10) || ""}`;
                    }
                }
                const seqText = num !== null ? `${num}` : (stripRevSuffix(voucher.id) || "");
                const datePart = month && day ? `${month} 月 ${day} 日` : "";
                const rawSummary = (voucher.summary || (voucher.lines && voucher.lines[0] && (voucher.lines[0].summary || voucher.lines[0].digest)) || "").toString();
                const cleanSummary = rawSummary.replace(/^冲销[:：]?\s*/i, "").trim();
                const suffix = cleanSummary ? `：${cleanSummary}` : "";
                if (datePart && seqText) return `冲销 ${datePart}第 ${seqText} 号凭证${suffix}`;
                if (seqText) return `冲销 第 ${seqText} 号凭证${suffix}`;
                return "冲销凭证";
            };
            const generateReverseId = (list, originalId) => {
                const parts = parseIdParts(originalId);
                if (!parts.width) return stripRevSuffix(originalId) || originalId;
                let maxSeq = parts.num || 0;
                list.forEach(item => {
                    const base = stripRevSuffix(item.id);
                    if (!base.startsWith(parts.prefix)) return;
                    const match = base.match(/^(.*?)(\d+)\s*$/);
                    if (!match) return;
                    if (match[1] !== parts.prefix) return;
                    const num = parseInt(match[2], 10);
                    if (Number.isFinite(num) && num > maxSeq) maxSeq = num;
                });
                const nextSeq = maxSeq + 1;
                const padded = String(nextSeq).padStart(parts.width, "0");
                return `${parts.prefix}${padded}`;
            };
            const newVouchers = [];
            list.forEach(item => {
                if (!idSet.has(item.id)) return;
                if (item.status === "已冲销" || item.status === "已作废") return;
                item.status = "已冲销";
                const redVoucher = JSON.parse(JSON.stringify(item));
                redVoucher.id = generateReverseId(list, item.id);
                redVoucher.date = new Date().toISOString().split('T')[0];
                redVoucher.status = "已记账";
                redVoucher.amount = -Math.abs(item.amount);
                redVoucher.summary = buildReverseSummary(item);
                redVoucher.isRed = true;
                redVoucher.reverseOf = item.id;
                if (redVoucher.lines) {
                    redVoucher.lines.forEach(line => {
                        if (line.debit) line.debit = -Math.abs(line.debit);
                        if (line.credit) line.credit = -Math.abs(line.credit);
                        if (line.summary !== undefined) line.summary = redVoucher.summary;
                        if (line.digest !== undefined) line.digest = redVoucher.summary;
                    });
                }
                newVouchers.push(redVoucher);
            });
            if (newVouchers.length) {
                list = [...newVouchers, ...list];
            }
        } else if (action === "void") {
            list.forEach(item => {
                if (!idSet.has(item.id)) return;
                if (item.status === "已作废" || item.status === "已冲销") return;
                item.voidedAt = new Date().toISOString();
                item.voidedBy = window.getCurrentLoginName ? window.getCurrentLoginName() : "系统";
                item.voidBackup = item.voidBackup || {
                    amount: item.amount,
                    lines: item.lines ? JSON.parse(JSON.stringify(item.lines)) : []
                };
                item.status = "已作废";
                item.amount = "0.00";
                if (item.lines) {
                    item.lines.forEach(line => {
                        line.debit = 0;
                        line.credit = 0;
                    });
                }
            });
        }

        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        loadContent('FinanceVoucherAudit');
    };

    window.openCashierReviewModal = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            alert("请先选择凭证。");
            return;
        }
        if (document.getElementById("cashier-review-modal")) return;
        const modal = document.createElement("div");
        modal.id = "cashier-review-modal";
        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.45); display:flex; align-items:center; justify-content:center; z-index:9999;";
        modal.innerHTML = `
            <div style="background:#fff; padding:20px 24px; border-radius:12px; min-width:320px; box-shadow:0 12px 32px rgba(15,23,42,0.18);">
                <div style="font-size:16px; font-weight:600; margin-bottom:8px;">出纳复核</div>
                <div style="color:#475569; font-size:13px;">确认进行出纳签字吗？</div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                    <button class="btn-primary btn-ghost" onclick="closeCashierReviewModal()">取消</button>
                    <button class="btn-primary" onclick="confirmCashierReview()">确认</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.closeCashierReviewModal = function() {
        const modal = document.getElementById("cashier-review-modal");
        if (modal) modal.remove();
    };

    window.confirmCashierReview = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            window.closeCashierReviewModal();
            return;
        }
        const currentUser = window.getCurrentLoginName();
        let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        const idSet = new Set(ids);
        list.forEach(item => {
            if (!idSet.has(item.id)) return;
            item.cashierUser = currentUser;
            item.bookkeeperUser = currentUser;
            item.status = "已记账";
        });
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        window.closeCashierReviewModal();
        loadContent('FinanceVoucherAudit');
    };

    window.exportSelectedVouchers = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            alert("请先选择凭证。");
            return;
        }
        const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        const idSet = new Set(ids);
        const payload = list.filter(item => idSet.has(item.id));
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `vouchers_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const SOURCE_TYPE_LABELS = {
        waybill: "运单号",
        batch: "批次号",
        reimbursement: "报销单号",
        manual: "原单",
        mixed: "原单"
    };

    const normalizeSourceType = (value) => {
        const text = (value || "").toString().trim().toLowerCase();
        if (!text) return "";
        if (["waybill", "运单", "yd", "ship"].includes(text)) return "waybill";
        if (["batch", "批次", "pc"].includes(text)) return "batch";
        if (["reimbursement", "报销", "expense"].includes(text)) return "reimbursement";
        if (["none", "manual", "人工", "手工"].includes(text)) return "manual";
        return text;
    };

    const extractDocIdsFromSummary = (summary) => {
        const text = (summary || "").toString();
        if (!text) return { reimbursement: [], waybill: [], batch: [] };
        const pushUnique = (list, value) => {
            if (!value) return;
            if (!list.includes(value)) list.push(value);
        };
        const ids = {
            reimbursement: [],
            waybill: [],
            batch: []
        };
        const patterns = [
            { type: "reimbursement", regex: /\bBX\d{6,}(?:[-_]\d+)?\b/gi },
            { type: "waybill", regex: /\bYD\d{4,}(?:[-_]\d+)?\b/gi },
            { type: "batch", regex: /\b(?:PC|APC|ASH)\d{3,}(?:[-_]\d+)?\b/gi }
        ];
        patterns.forEach(({ type, regex }) => {
            let match;
            while ((match = regex.exec(text)) !== null) {
                pushUnique(ids[type], match[0]);
            }
        });
        return ids;
    };

    const inferDocsFromSummary = (voucher) => {
        const summary = (voucher.summary || "").toString();
        if (!summary) return null;
        const docMap = extractDocIdsFromSummary(summary);
        const entries = Object.entries(docMap).filter(([, ids]) => ids.length);
        if (!entries.length) return null;
        if (entries.length === 1) {
            const [type, ids] = entries[0];
            return { type, ids };
        }
        const mixedIds = entries.flatMap(([type, ids]) => {
            const label = SOURCE_TYPE_LABELS[type] || type;
            return ids.map((id) => `${label}: ${id}`);
        });
        return { type: "mixed", ids: mixedIds };
    };

    const extractDriverFromSummary = (summary) => {
        const text = (summary || "").toString().trim();
        if (!text) return "";
        let match = text.match(/司机[:：\s]*([A-Za-z0-9\u4e00-\u9fa5·]{1,20})/);
        if (match && match[1]) return match[1];
        match = text.match(/驾驶员[:：\s]*([A-Za-z0-9\u4e00-\u9fa5·]{1,20})/);
        if (match && match[1]) return match[1];
        const tokens = text
            .split(/[-—–~|/]/)
            .map((item) => item.trim())
            .filter(Boolean);
        if (tokens.length > 1) {
            const tail = tokens[tokens.length - 1];
            if (tail && !/\d/.test(tail) && tail.length <= 12) return tail;
        }
        return "";
    };

    const calcVoucherAmountFromLines = (voucher) => {
        if (!voucher) return 0;
        let debit = 0;
        let credit = 0;
        const lines = Array.isArray(voucher.lines) ? voucher.lines : [];
        lines.forEach((line) => {
            const d = parseFloat((line.debit || line.jf || "0").toString().replace(/,/g, ""));
            const c = parseFloat((line.credit || line.df || "0").toString().replace(/,/g, ""));
            if (Number.isFinite(d)) debit += d;
            if (Number.isFinite(c)) credit += c;
        });
        const total = Math.max(Math.abs(debit), Math.abs(credit));
        if (total > 0) return total;
        const fallback = parseFloat((voucher.amount || "0").toString().replace(/,/g, ""));
        return Number.isFinite(fallback) ? Math.abs(fallback) : 0;
    };

    const resolveRelatedDocs = (voucher) => {
        if (!voucher) return null;
        if (Array.isArray(voucher.relatedDocs) && voucher.relatedDocs.length) {
            const normalized = voucher.relatedDocs
                .map((doc) => {
                    const type = normalizeSourceType(doc.type || doc.category || doc.sourceType);
                    const id = (doc.id || doc.no || doc.code || "").toString().trim();
                    return type && id ? { type, id } : null;
                })
                .filter(Boolean);
            if (!normalized.length) return null;
            const typeSet = new Set(normalized.map((doc) => doc.type));
            if (typeSet.size === 1) {
                const type = normalized[0].type;
                const ids = normalized.map((doc) => doc.id);
                return { type, ids };
            }
            return { type: "mixed", ids: normalized.map((doc) => `${SOURCE_TYPE_LABELS[doc.type] || doc.type}: ${doc.id}`) };
        }
        if (Array.isArray(voucher.sourceDocs) && voucher.sourceDocs.length) {
            const type = normalizeSourceType(voucher.sourceDocType || voucher.sourceType || "waybill");
            const ids = voucher.sourceDocs.map((doc) => doc.toString().trim()).filter(Boolean);
            return ids.length ? { type, ids } : null;
        }
        if (voucher.sourceType && (voucher.sourceNo || voucher.sourceId)) {
            const type = normalizeSourceType(voucher.sourceType);
            const raw = (voucher.sourceNo || voucher.sourceId || "").toString().trim();
            if (!type || !raw) return null;
            const ids = raw
                .split(/[,，;\n]/)
                .map((val) => val.trim())
                .filter(Boolean);
            if (!ids.length) return null;
            if (!["waybill", "batch", "reimbursement", "manual", "mixed"].includes(type)) {
                const allWaybill = ids.every((id) => /^YD/i.test(id));
                const allBatch = ids.every((id) => /^PC/i.test(id));
                if (allWaybill) return { type: "waybill", ids };
                if (allBatch) return { type: "batch", ids };
            }
            return { type, ids };
        }
        const inferred = inferDocsFromSummary(voucher);
        if (inferred) return inferred;
        if (voucher.sourceType === "none") {
            return { type: "manual", ids: [] };
        }
        return null;
    };

    window.openRelatedDocDrawer = function(trigger) {
        if (!trigger) return;
        const typeKey = trigger.dataset.docType || "";
        const ids = (trigger.dataset.docIds || "")
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean);
        const voucherId = trigger.dataset.voucherId || "-";
        const displayType = SOURCE_TYPE_LABELS[typeKey] || typeKey || "关联原单";
        const waybills = JSON.parse(sessionStorage.getItem("BizWaybills") || "[]");
        const vouchers = window.getManualVouchers
            ? window.getManualVouchers()
            : JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const voucher = vouchers.find((item) => item.id === voucherId);
        const summaryText = (voucher && (voucher.summary
            || (voucher.lines && voucher.lines[0] && (voucher.lines[0].summary || voucher.lines[0].digest))
            || "")) || "";
        const summaryDriver = extractDriverFromSummary(summaryText);
        const fallbackAmount = calcVoucherAmountFromLines(voucher);
        const formatDocAmount = (value) => {
            const num = parseFloat((value || "0").toString().replace(/,/g, ""));
            if (!num) return "-";
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };
        const rowsHtml = ids.length
            ? ids.map((id) => {
                const match = typeKey === "waybill"
                    ? waybills.find((wb) => wb.id === id || wb.orderNo === id)
                    : null;
                const amount = match
                    ? (match.totalAmount || match.freightAmount || match.amount || match.paidAmount)
                    : fallbackAmount;
                const driver = match
                    ? (match.driver || match.driverName || match.driverInfo || "-")
                    : (summaryDriver || "-");
                return `
                    <div class="source-doc-table__row">
                        <span class="source-doc-table__id">${id}</span>
                        <span class="source-doc-table__amount">${formatDocAmount(amount)}</span>
                        <span class="source-doc-table__driver">${driver}</span>
                    </div>
                `;
            }).join("")
            : `<div class="source-doc-table__empty">暂无关联原单</div>`;

        let drawer = document.getElementById("source-doc-drawer");
        if (!drawer) {
            drawer = document.createElement("div");
            drawer.id = "source-doc-drawer";
            drawer.className = "source-doc-drawer";
            document.body.appendChild(drawer);
        }
        drawer.innerHTML = `
            <div class="source-doc-mask" onclick="closeRelatedDocDrawer()"></div>
            <div class="source-doc-panel" role="dialog" aria-modal="true">
                <div class="source-doc-panel__header">
                    <div>
                <div class="source-doc-panel__title">关联原单明细 (Associated Documents)</div>
                <div class="source-doc-panel__sub">凭证号：${voucherId} · ${displayType}</div>
                    </div>
                    <button class="source-doc-panel__close" onclick="closeRelatedDocDrawer()">关闭</button>
                </div>
                <div class="source-doc-panel__body">
                    <div class="source-doc-panel__section">
                        <div class="source-doc-panel__label">原单清单</div>
                        <div class="source-doc-table">
                            <div class="source-doc-table__head">
                                <span>原单号</span>
                                <span class="source-doc-table__amount">金额</span>
                                <span>相关人</span>
                            </div>
                            ${rowsHtml}
                        </div>
                    </div>
                    <div class="source-doc-panel__hint">点击单号可跳转至对应业务单据详情（示意）。</div>
                </div>
            </div>
        `;
        requestAnimationFrame(() => drawer.classList.add("is-visible"));
    };

    window.closeRelatedDocDrawer = function() {
        const drawer = document.getElementById("source-doc-drawer");
        if (!drawer) return;
        drawer.classList.remove("is-visible");
    };

    const parseAccount = (text) => {
        const cleaned = (text || "").toString().trim();
        if (!cleaned) return { code: "-", name: "-" };
        const match = cleaned.match(/^([0-9-]+)\s*(.*)$/);
        if (match) {
            const code = match[1] || "-";
            const name = (match[2] || "").trim() || "-";
            return { code, name };
        }
        return { code: "-", name: cleaned };
    };

    const formatAmount = (value) => {
        const num = parseFloat((value || "0").toString().replace(/,/g, ""));
        if (!num) return "";
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const rowsData = [];
    allVouchers.forEach(v => {
        const lines = Array.isArray(v.lines) && v.lines.length
            ? v.lines
            : [{ summary: v.summary || "", account: "", debit: v.amount || "", credit: "" }];
        const lineCount = lines.length;
        lines.forEach((line, idx) => rowsData.push({ voucher: v, line, lineIndex: idx, lineCount }));
    });

    window._voucherAuditAllRows = rowsData;
    window._voucherAuditRowsData = rowsData;
    window._voucherAuditFilter = { tab: "all" };
    window._voucherAuditSearch = window._voucherAuditSearch || { docType: "", docNo: "" };

    const matchVoucherDocSearch = (voucher) => {
        const search = window._voucherAuditSearch || {};
        const docType = (search.docType || "").toString().trim().toLowerCase();
        const docNo = (search.docNo || "").toString().trim().toLowerCase();
        if (!docType && !docNo) return true;
        const info = resolveRelatedDocs(voucher);
        if (!info || !Array.isArray(info.ids) || info.ids.length === 0) return false;
        const normalizedType = normalizeSourceType(info.type || "");
        if (docType && normalizeSourceType(docType) !== normalizedType) return false;
        if (!docNo) return true;
        return info.ids.some((id) => id.toString().toLowerCase().includes(docNo));
    };

    window.applyVoucherAuditFilter = function() {
        const filter = window._voucherAuditFilter || { tab: "all" };
        const allRows = window._voucherAuditAllRows || [];
        const normalized = (status) => (status || "待审核").toString().trim();
        const filtered = allRows.filter(item => {
            const v = item.voucher || {};
            const status = normalized(v.status);
            if (!matchVoucherDocSearch(v)) return false;
            if (filter.tab === "pending") {
                return status === "待审核";
            }
            if (filter.tab === "cashier") {
                return (status === "已审核" || status === "已记账" || status === "已过账") && !v.cashierUser;
            }
            if (filter.tab === "diff") {
                return ["已驳回", "已冲销", "已作废"].includes(status);
            }
            return true;
        });
        window._voucherAuditRowsData = filtered;
    };

    window.applyVoucherAuditSearch = function() {
        const typeEl = document.getElementById("voucher-doc-type");
        const noEl = document.getElementById("voucher-doc-no");
        window._voucherAuditSearch = {
            docType: typeEl ? typeEl.value : "",
            docNo: noEl ? noEl.value : ""
        };
        window.applyVoucherAuditFilter();
        window.renderVoucherAuditPage(1);
    };

    window.setVoucherAuditTab = function(tab) {
        window._voucherAuditFilter = { tab: tab || "all" };
        document.querySelectorAll(".voucher-center__tab").forEach(btn => {
            btn.classList.remove("is-active");
        });
        const active = document.querySelector(`.voucher-center__tab[data-tab="${tab}"]`);
        if (active) active.classList.add("is-active");
        window.applyVoucherAuditFilter();
        window.renderVoucherAuditPage(1);
    };

    window.renderVoucherAuditPage = function(page = 1) {
        const perPage = 30;
        const total = window._voucherAuditRowsData.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        const current = Math.min(Math.max(page, 1), totalPages);
        const start = (current - 1) * perPage;
        const slice = window._voucherAuditRowsData.slice(start, start + perPage);
        const tbody = document.getElementById("voucher-center-body");
        const pager = document.getElementById("voucher-center-pagination");
        if (!tbody || !pager) return;

        const renderStatus = (status) => {
            const value = status || "待审核";
            if (value === "已冲销" || value === "已作废") {
                return `<span class="voucher-status is-void">已作废</span>`;
            }
            if (value === "已记账" || value === "已过账") {
                return `<span class="voucher-status is-posted">已记账</span>`;
            }
            if (value === "已审核") {
                return `<span class="voucher-status is-audited">已审核</span>`;
            }
            return `<span class="voucher-status is-pending">未审核</span>`;
        };

        const SOURCE_DOC_ICONS = {
            waybill: "🚛",
            batch: "📦",
            reimbursement: "🧾",
            mixed: "📄",
            manual: "📄"
        };

        const buildRelatedDocsHtml = (voucher) => {
            const info = resolveRelatedDocs(voucher);
            if (!info || !Array.isArray(info.ids) || info.ids.length === 0) return "";
            const typeKey = info.type || "manual";
            const ids = info.ids;
            const icon = SOURCE_DOC_ICONS[typeKey] || "📄";
            return `
                <button type="button" class="source-badge source-badge--${typeKey}"
                    data-doc-type="${typeKey}"
                    data-doc-ids="${ids.join(",")}"
                    data-voucher-id="${voucher.id || ""}"
                    onclick="openRelatedDocDrawer(this)">
                    <span class="source-badge__icon">${icon}</span>
                    <span class="source-badge__count">${ids.length}</span>
                </button>
            `;
        };

        tbody.innerHTML = slice.map((item, index) => {
            const v = item.voucher || {};
            const line = item.line || {};
            const { code, name } = parseAccount(line.account);
            const auxCode = line.auxCode || "";
            const auxName = line.auxName || "";
            const aux = auxCode || auxName
                ? [auxCode, auxName].filter(Boolean).join(" ")
                : (line.aux || line.auxiliary || "-");
            const summary = line.summary || line.digest || v.summary || "-";
            const auditUser = v.auditUser || (["已审核", "已记账"].includes(v.status) ? "系统审核" : "-");
            const maker = v.user || "system";
            const statusTag = renderStatus(v.status);
            const relatedDocs = item.lineIndex === 0 ? buildRelatedDocsHtml(v) : "";

            return `
                <tr>
                    <td style="text-align:center;">
                        <input type="checkbox" class="voucher-select" data-voucher-id="${v.id}" onchange="toggleVoucherGroupSelection(this)">
                    </td>
                    <td>${start + index + 1}</td>
                    <td>${v.date || "-"}</td>
                    <td><a href="javascript:void(0)" onclick="openVoucherDetail('${v.id}')" class="voucher-link">${v.id || "-"}</a></td>
                    <td class="amount-cell">${formatAmount(v.amount)}</td>
                    <td>${auditUser}</td>
                    <td>${maker}</td>
                    <td class="summary-cell">${summary}</td>
                    <td class="related-docs-cell">${relatedDocs}</td>
                    <td>${statusTag}</td>
                    <td>${code}</td>
                    <td>${name || "-"}</td>
                    <td>${aux || "-"}</td>
                    <td class="amount-cell">${formatAmount(line.debit)}</td>
                    <td class="amount-cell">${formatAmount(line.credit)}</td>
                </tr>
            `;
        }).join("") || `<tr><td colspan="15" class="empty-row">暂无数据</td></tr>`;

        const maxButtons = 5;
        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        window._voucherAuditPager = { totalPages, current };
        let pagerHtml = `
            <button ${current === 1 ? "disabled" : ""} onclick="renderVoucherAuditPage(1)">首页</button>
            <button ${current === 1 ? "disabled" : ""} onclick="renderVoucherAuditPage(${current - 1})">上一页</button>
        `;
        for (let i = startPage; i <= endPage; i += 1) {
            pagerHtml += `<button class="${i === current ? "is-active" : ""}" onclick="renderVoucherAuditPage(${i})">${i}</button>`;
        }
        pagerHtml += `
            <button ${current === totalPages ? "disabled" : ""} onclick="renderVoucherAuditPage(${current + 1})">下一页</button>
            <button ${current === totalPages ? "disabled" : ""} onclick="renderVoucherAuditPage(${totalPages})">末页</button>
            <span style="margin-left:8px; color:#94a3b8;">跳至</span>
            <input id="voucher-page-input" type="number" min="1" max="${totalPages}" value="${current}" style="width:70px; margin:0 6px; padding:4px 6px; border:1px solid #e2e8f0; border-radius:6px;">
            <button onclick="jumpVoucherAuditPage()">GO</button>
            <span style="margin-left:6px; color:#94a3b8;">/ ${totalPages} 页</span>
        `;
        pager.innerHTML = pagerHtml;

        const input = document.getElementById("voucher-page-input");
        if (input && !input.dataset.bound) {
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    window.jumpVoucherAuditPage();
                }
            });
            input.dataset.bound = "1";
        }

        if (typeof window.updateVoucherActionButtons === "function") {
            window.updateVoucherActionButtons();
        }
    };

    window.jumpVoucherAuditPage = function() {
        const input = document.getElementById("voucher-page-input");
        const totalPages = window._voucherAuditPager ? window._voucherAuditPager.totalPages : 1;
        if (!input) return;
        const raw = parseInt(input.value, 10);
        if (!Number.isFinite(raw)) return;
        const target = Math.min(Math.max(raw, 1), totalPages);
        window.renderVoucherAuditPage(target);
    };

    contentHTML += `
            <div class="voucher-center">
            <div class="voucher-center__toolbar">
                <div class="voucher-center__actions">
                    <button class="btn-primary btn-ghost voucher-center__action" onclick="applyVoucherAction('audit')" disabled>审核</button>
                    <button class="btn-primary btn-ghost voucher-center__action" onclick="applyVoucherAction('unaudit')" disabled>反审</button>
                    <button class="btn-primary btn-ghost voucher-center__action" onclick="openCashierReviewModal()" disabled>出纳复核</button>
                    <button class="btn-primary btn-ghost voucher-center__action" onclick="applyVoucherAction('reverse')" disabled>冲销</button>
                    <button class="btn-primary btn-ghost voucher-center__action" onclick="applyVoucherAction('void')" disabled>作废</button>
                    <button class="btn-primary btn-ghost voucher-center__action" onclick="exportSelectedVouchers()" disabled>导出</button>
                </div>
                <div class="voucher-center__seed" style="margin-top:8px; color:#475569; font-size:12px;">${seedNotice}</div>
                <div class="voucher-center__filters">
                    <div class="voucher-filter">
                        <label>凭证类别</label>
                        <select>
                            <option>全部</option>
                            <option>记账凭证</option>
                            <option>收款凭证</option>
                            <option>付款凭证</option>
                        </select>
                    </div>
                    <div class="voucher-filter">
                        <label>制单日期</label>
                        <div class="voucher-filter__range">
                            <input type="date">
                            <span>~</span>
                            <input type="date">
                        </div>
                    </div>
                    <div class="voucher-filter">
                        <label>摘要</label>
                        <input type="text" id="voucher-filter-summary" placeholder="输入摘要关键词">
                    </div>
                    <div class="voucher-filter voucher-filter--composite">
                        <label>组合查询</label>
                        <div class="voucher-filter__combo">
                            <div class="voucher-filter__combo-item">
                                <span class="voucher-filter__combo-label">来源类型</span>
                                <select id="voucher-doc-type">
                                    <option value="">全部</option>
                                    <option value="waybill">运单</option>
                                    <option value="batch">批次</option>
                                    <option value="reimbursement">报销</option>
                                </select>
                            </div>
                            <div class="voucher-filter__combo-item">
                                <span class="voucher-filter__combo-label">单据号</span>
                                <input type="text" id="voucher-doc-no" placeholder="例如：YD2601...">
                            </div>
                        </div>
                    </div>
                    <div class="voucher-filter">
                        <label>科目编码</label>
                        <input type="text" placeholder="例如：100201">
                    </div>
                    <div class="voucher-filter">
                        <label>金额</label>
                        <div class="voucher-filter__range">
                            <input type="number" placeholder="最小值">
                            <span>~</span>
                            <input type="number" placeholder="最大值">
                        </div>
                    </div>
                    <div class="voucher-filter">
                        <label>会计期间</label>
                        <div class="voucher-filter__range">
                            <select>
                                <option>2025.09</option>
                                <option>2025.10</option>
                                <option>2025.11</option>
                            </select>
                            <span>~</span>
                            <select>
                                <option>2025.10</option>
                                <option>2025.11</option>
                                <option>2025.12</option>
                            </select>
                        </div>
                    </div>
                    <div class="voucher-filter voucher-filter__query">
                        <button class="btn-primary" onclick="applyVoucherAuditSearch()">查询</button>
                    </div>
                </div>
                <div class="voucher-center__tabs">
                    <button class="voucher-center__tab is-active" data-tab="all" onclick="setVoucherAuditTab('all')">全部凭证</button>
                    <button class="voucher-center__tab" data-tab="pending" onclick="setVoucherAuditTab('pending')">待审核</button>
                    <button class="voucher-center__tab" data-tab="cashier" onclick="setVoucherAuditTab('cashier')">待出纳复核</button>
                    <button class="voucher-center__tab" data-tab="diff" onclick="setVoucherAuditTab('diff')">差异凭证</button>
                </div>
            </div>

            <div class="voucher-center__table-wrap">
                <table class="voucher-center__table">
                    <thead>
                        <tr>
                            <th style="width:40px; text-align:center;">
                                <input type="checkbox" onclick="toggleAllVoucherSelection(this.checked)">
                            </th>
                            <th style="width:60px;">序号</th>
                            <th style="width:110px;">制单日期</th>
                            <th style="width:110px;">凭证字号</th>
                            <th style="width:120px;">凭证总金额</th>
                            <th style="width:90px;">审核人</th>
                            <th style="width:90px;">制单人</th>
                            <th>摘要</th>
                            <th style="width:60px; text-align:center;">关联单</th>
                            <th style="width:100px;">状态</th>
                            <th style="width:110px;">科目编码</th>
                            <th style="width:140px;">科目名称</th>
                            <th style="width:160px;">辅助项</th>
                            <th style="width:110px;">借方</th>
                            <th style="width:110px;">贷方</th>
                        </tr>
                    </thead>
                    <tbody id="voucher-center-body">
                        <tr><td colspan="15" class="empty-row">暂无数据</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="voucher-center__pagination" id="voucher-center-pagination"></div>
        </div>
    `;
    setTimeout(() => {
        if (typeof window.updateVoucherActionButtons === "function") {
            window.updateVoucherActionButtons();
        }
        if (typeof window.applyVoucherAuditFilter === "function") {
            window.applyVoucherAuditFilter();
        }
        if (typeof window.renderVoucherAuditPage === "function") {
            window.renderVoucherAuditPage(1);
        }
    }, 0);
  }

    // =========================================================================
    // 22. 凭证详情页 (VoucherDetail) - [最终修复版：自动计算合计金额]
    // =========================================================================
    else if (moduleCode === "VoucherDetail") {
        // 1. 尝试获取传递的基础信息
        let v = g_currentVoucher || { id: "无数据" };

        // 自动回捞完整数据
        if (v.id) {
            const allVouchers = JSON.parse(
                sessionStorage.getItem("ManualVouchers") || "[]"
            );
            const fullData = allVouchers.find((item) => item.id === v.id);
            if (fullData) v = fullData;
        }

        // 数据兜底
        if (!v.lines) v.lines = [];

        // ★★★ 核心修复：现场重新计算合计金额 (不再依赖 v.debit) ★★★
        let calcDebit = 0;
        let calcCredit = 0;

        v.lines.forEach((line) => {
            // 兼容不同字段名并去逗号
            const dStr = (line.jf || line.debit || "0").toString().replace(/,/g, "");
            const cStr = (line.df || line.credit || "0").toString().replace(/,/g, "");

            calcDebit += parseFloat(dStr) || 0;
            calcCredit += parseFloat(cStr) || 0;
        });

        // 格式化为字符串 (保留2位小数)
        const totalDebitStr = calcDebit.toFixed(2);
        const totalCreditStr = calcCredit.toFixed(2);
        // ★★★ 修复结束 ★★★

        // 解析日期
        const dateVal = v.date || new Date().toISOString().slice(0, 10);
        const dateObj = new Date(dateVal);
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        // ============================================================
        // ★★★ 核心修复：根据凭证号首字判断大标题 ★★★
        // ============================================================
        let titleText = "记 账 凭 证"; // 默认兜底
        let wordText = "记";         // 默认字号

        // 获取凭证号的第一个字 (例如 "收2025..." -> "收")
        const firstChar = v.id ? v.id.charAt(0) : "记";

        if (firstChar === '收') {
            titleText = "收 款 凭 证";
            wordText = "收";
        } else if (firstChar === '付') {
            titleText = "付 款 凭 证";
            wordText = "付";
        } else if (firstChar === '转') {
            titleText = "转 账 凭 证";
            wordText = "转";
        }

        // 凭证字 (右上角显示用)
        const voucherWord = firstChar;
        // 样式保持不变
        const voucherStyle = `
                    <style>
                        .voucher-box {
                            font-family: "SimSun", "Songti SC", serif;
                            color: #333;
                            width: 1000px;
                            margin: 0 auto;
                            padding: 30px;
                            background: #fff;
                            position: relative;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                            border: 1px solid #ddd;
                        }
                        .v-title-container { text-align: center; margin-bottom: 10px; position: relative; }
                        .v-title {
                            font-size: 36px; font-weight: bold; letter-spacing: 15px;
                            display: inline-block; border-bottom: 3px double #333;
                            padding-bottom: 5px; margin-bottom: 5px; text-shadow: 0.5px 0 0 #333;
                        }
                        .v-header-info {
                            display: flex; justify-content: space-between; align-items: flex-end;
                            margin-bottom: 5px; font-size: 15px; padding: 0 5px;
                        }
                        .v-date-group span {
                            display: inline-block; border-bottom: 1px solid #333;
                            width: 50px; text-align: center; margin: 0 2px; font-family: Arial;
                        }
                        .v-table { width: 100%; border-collapse: collapse; border: 2px solid #333; }
                        .v-table th, .v-table td {
                            border: 1px solid #333; height: 40px; vertical-align: middle; font-size: 15px;
                        }
                        .v-table th { text-align: center; font-weight: bold; padding: 5px; }
                        
                        /* 金额网格背景 */
                        .money-grid-bg {
                            background-image: linear-gradient(to right, transparent 95%, #ddd 95%);
                            background-size: 9.09% 100%; 
                            font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold;
                            letter-spacing: 6px; text-align: right; padding-right: 3px; overflow: hidden;
                        }
                        .money-header-row div {
                            display: flex; justify-content: space-between; padding: 0 2px;
                            color: #666; font-weight: normal; transform: scale(0.95); font-size: 12px;
                        }
                        .money-header-row span { flex: 1; text-align: center; border-right: 1px solid #eee; }
                        .money-header-row span:last-child { border: 0; }
                        .v-footer {
                            margin-top: 15px; display: flex; justify-content: space-between; font-size: 14px; padding: 0 10px;
                        }
                        .v-footer span {
                            display: inline-block; width: 70px; border-bottom: 1px solid #333; height: 20px; text-align: center;
                        }
                        .attachment-side { position: absolute; right: -25px; top: 110px; width: 20px; font-size: 13px; line-height: 1.2; text-align: center; }
                    </style>
                `;

        // 动态生成分录行
        const waybills = JSON.parse(sessionStorage.getItem("BizWaybills") || "[]");
        const sourceId = v.sourceNo || v.sourceId || v.waybillNo || v.bill_no;
        const matchedWaybill = sourceId ? waybills.find(w => w.id === sourceId) : null;
        const companyName = v.clientName || (matchedWaybill && matchedWaybill.client) || "";
        let linesHTML = "";
        const minRows = 5;
        const loopCount = Math.max(v.lines.length, minRows);

        for (let i = 0; i < loopCount; i++) {
            const line = v.lines[i] || {};

            const rawSummary = line.summary || line.zy || "";
            const summary = rawSummary && companyName
                ? (rawSummary.includes(companyName) ? rawSummary : `${rawSummary} - ${companyName}`)
                : rawSummary;
            const accountStr = line.account || line.km || "";
            let debit = line.debit || line.jf || "";
            let credit = line.credit || line.df || "";

            let subjectCode = (line.accountCode || "").toString().trim();
            let subjectName = (line.accountName || "").toString().trim();

            if (!subjectCode || !subjectName) {
                let fallbackName = accountStr;
                let fallbackCode = subjectCode;
                const match = accountStr.match(/^([0-9-]+)\s*(.*)$/);
                if (match) {
                    fallbackCode = match[1];
                    fallbackName = match[2].trim();
                } else if (/^[0-9-]+$/.test(accountStr)) {
                    fallbackCode = accountStr;
                    fallbackName = "";
                }
                if (!subjectCode) subjectCode = fallbackCode || "";
                if (!subjectName) subjectName = fallbackName || "";
            }

            const auxCode = line.auxCode || "";
            const auxName = line.auxName || "";
            let auxDisplay = "";
            if (auxCode || auxName) {
                auxDisplay = [auxCode, auxName].filter(Boolean).join(" ");
            } else if (line.aux) {
                auxDisplay = line.aux;
            } else if (line.auxiliary) {
                auxDisplay = line.auxiliary;
            }

            const debitVal = debit ? debit.toString().replace(/,/g, "") : "";
            const creditVal = credit ? credit.toString().replace(/,/g, "") : "";
            const rowColor = v.isRed ? "color: red;" : "";

            linesHTML += `
                        <tr style="${rowColor}">
                            <td style="padding:0 8px;">${summary}</td>
                            <td style="padding:0 8px;">${subjectName || "-"}</td>
                            <td style="padding:0 8px; text-align:center;">${subjectCode || "-"}</td>
                            <td style="text-align:center;">${auxDisplay || "-"
                }</td>
                            <td class="money-grid-bg">${debitVal}</td>
                            <td class="money-grid-bg">${creditVal}</td>
                        </tr>
                    `;
        }

        contentHTML += `
        ${voucherStyle}
        
        <div style="margin-bottom:20px; display:flex; justify-content:space-between;">
            <button class="btn-primary" style="background-color: #95a5a6;" onclick="loadContent('FinanceVoucherAudit')"> < 返回列表</button>
            <div>
                <button class="btn-primary" style="background-color: #3498db;" onclick="window.print()">🖨 打印凭证</button>
            </div>
        </div>

        <div class="voucher-box">
            <div class="v-title-container">
                <div class="v-title">${titleText}</div>
                
                <div style="position:absolute; right:10px; top:10px; font-size:14px;">${wordText}字第 ${v.id.replace(/\D/g, "")} 号</div>
            </div>

            <div class="v-header-info">
                <div style="visibility:hidden;">占位</div>
                <div class="v-date-group">
                    <span>${y}</span>年<span>${m}</span>月<span>${d}</span>日
                </div>
                <div style="visibility:hidden;">占位</div>
            </div>

            <table class="v-table">
                <thead>
                    <tr>
                        <th rowspan="2" style="width: 15%;">摘 要</th>
                        <th rowspan="2" style="width: 15%;">总账科目</th>
                        <th rowspan="2" style="width: 15%;">明细科目</th>
                        <th rowspan="2" style="width: 15%;">辅助项</th>
                        <th style="width: 20%;">借 方 金 额</th>
                        <th style="width: 20%;">贷 方 金 额</th>
                    </tr>
                    <tr class="money-header-row">
                        <th style="padding:0;">
                            <div style="border:none;">
                                <span>千</span><span>百</span><span>十</span><span>万</span><span>千</span><span>百</span><span>十</span><span>元</span><span>角</span><span>分</span>
                            </div>
                        </th>
                        <th style="padding:0;">
                            <div style="border:none;">
                                <span>千</span><span>百</span><span>十</span><span>万</span><span>千</span><span>百</span><span>十</span><span>元</span><span>角</span><span>分</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${linesHTML}
                    <tr style="${v.isRed ? "color:red;" : ""}">
                        <td colspan="3" style="text-align: left; padding-left: 20px; font-weight: bold;">合　　计</td>
                        <td></td>
                        <td class="money-grid-bg">
                            <span style="float:left; font-size:12px; margin-top:3px; margin-left:5px;">¥</span>
                            ${totalDebitStr}
                        </td>
                        <td class="money-grid-bg">
                            <span style="float:left; font-size:12px; margin-top:3px; margin-left:5px;">¥</span>
                            ${totalCreditStr}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="attachment-side">附<br>单<br>据<br><br><strong>1</strong><br><br>张</div>

            <div class="v-footer">
                <div>财务主管：<span>___________</span></div>
                <div>记账：<span>${v.bookkeeperUser || ""}</span></div>
                <div>出纳：<span>${v.cashierUser || ""}</span></div>
                <div>审核：<span>${v.auditUser || "张三"}</span></div>
                <div>制单：<span>${v.user || "系统引擎"}</span></div>
            </div>
        </div>
    `;
    }


    // =========================================================================
    // 57. 权限管理 (Permission) - [RBAC模型 + 数据范围控制]
    // =========================================================================
    else if (moduleCode === "Permission") {
        // 1. 初始化角色数据 (支持缓存)
        // 预设了三个经典财务角色：CFO、会计、出纳
        let roleData = JSON.parse(sessionStorage.getItem('RoleConfig'));
        if (!roleData) {
            roleData = [
                {
                    id: 'role_cfo',
                    name: '财务总监 (CFO)',
                    desc: '全公司数据可见，拥有一级审批权',
                    scope: 'all', // all=全公司, dept=本部门, self=仅本人
                    perms: ['dashboard', 'report', 'audit', 'approval', 'setup']
                },
                {
                    id: 'role_acct',
                    name: '总账会计',
                    desc: '负责凭证录入、结账与报表出具',
                    scope: 'dept',
                    perms: ['voucher', 'ledger', 'settlement', 'asset', 'invoice']
                },
                {
                    id: 'role_cashier',
                    name: '出纳专员',
                    desc: '负责资金收付，严禁接触总账与审核',
                    scope: 'self',
                    perms: ['treasury', 'bank', 'expense']
                }
            ];
            sessionStorage.setItem('RoleConfig', JSON.stringify(roleData));
        }

        // 2. 获取当前选中的角色 (默认第一个)
        const currentRoleId = window.g_currentRoleSelect || 'role_cfo';
        const currentRole = roleData.find(r => r.id === currentRoleId) || roleData[0];

        // 3. 生成左侧角色列表 HTML
        const roleListHtml = roleData.map(r => {
            const isActive = r.id === currentRoleId ? 'background:#e6f7ff; border-right:3px solid #1890ff;' : '';
            return `
            <div onclick="switchRole('${r.id}')" style="padding:15px; cursor:pointer; border-bottom:1px solid #eee; transition:all 0.2s; ${isActive}">
                <div style="font-weight:bold; color:#333;">${r.name}</div>
                <div style="font-size:12px; color:#999; margin-top:4px;">${r.desc}</div>
            </div>
        `;
        }).join('');

        // 4. 辅助函数：检查权限是否被选中
        const isChecked = (code) => currentRole.perms.includes(code) ? 'checked' : '';

        contentHTML += `
        <h2>角色与权限管理 (RBAC) 🛡️</h2>
        <p style="color: #7f8c8d;">
            配置系统角色的功能访问权与数据可见性。系统内置 <b>不相容职责互斥(SoD)</b> 检查。
        </p>

        <div style="display:flex; height: 650px; border:1px solid #ddd; border-radius:8px; overflow:hidden; background:white;">
            
            <div style="width: 280px; background:#f9f9f9; border-right:1px solid #ddd; display:flex; flex-direction:column;">
                <div style="padding:15px; border-bottom:1px solid #ddd; background:#fff;">
                    <button class="btn-primary" style="width:100%;" onclick="alert('新增角色功能待开发')">+ 新增角色</button>
                </div>
                <div style="flex:1; overflow-y:auto;">
                    ${roleListHtml}
                </div>
            </div>

            <div style="flex:1; padding:25px; overflow-y:auto;">
                
                <div style="border-bottom:1px solid #eee; padding-bottom:20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="margin:0; color:#2c3e50;">正在配置：<span style="color:#2980b9;">${currentRole.name}</span></h3>
                        <p style="margin:5px 0 0 0; color:#7f8c8d; font-size:13px;">角色ID: ${currentRole.id}</p>
                    </div>
                    <div>
                        <button class="btn-primary" style="background:#e74c3c;" onclick="deleteRole()">删除角色</button>
                    </div>
                </div>

                <div style="background:#fffbe6; border:1px solid #ffe58f; padding:15px; border-radius:6px; margin-bottom:25px;">
                    <label style="font-weight:bold; display:block; margin-bottom:10px;">👁️ 数据可见范围 (Data Scope)</label>
                    <select id="scope-select" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                        <option value="all" ${currentRole.scope === 'all' ? 'selected' : ''}>🏢 全公司数据 (适合老板/CFO/审计)</option>
                        <option value="dept" ${currentRole.scope === 'dept' ? 'selected' : ''}>📂 仅本部门数据 (适合部门经理)</option>
                        <option value="self" ${currentRole.scope === 'self' ? 'selected' : ''}>👤 仅本人数据 (适合普通员工)</option>
                    </select>
                    <div style="font-size:12px; color:#d48806; margin-top:5px;">* 修改此选项将影响该角色用户在报表和列表中看到的数据量。</div>
                </div>

                <h4 style="border-left:4px solid #3498db; padding-left:10px; margin-bottom:15px;">功能模块授权</h4>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    
                    <div class="perm-card" style="border:1px solid #eee; padding:15px; border-radius:6px;">
                        <label style="font-weight:bold; display:block; margin-bottom:10px; color:#2c3e50;">
                            <input type="checkbox" disabled checked> 📖 账务核算
                        </label>
                        <div style="margin-left:20px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <label><input type="checkbox" class="perm-chk" value="voucher" ${isChecked('voucher')}> 凭证录入</label>
                            <label><input type="checkbox" class="perm-chk" value="audit" ${isChecked('audit')}> 凭证审核 <span style="color:red;font-size:10px">(互斥)</span></label>
                            <label><input type="checkbox" class="perm-chk" value="ledger" ${isChecked('ledger')}> 账簿查询</label>
                            <label><input type="checkbox" class="perm-chk" value="settlement" ${isChecked('settlement')}> 业务结算</label>
                        </div>
                    </div>

                    <div class="perm-card" style="border:1px solid #eee; padding:15px; border-radius:6px;">
                        <label style="font-weight:bold; display:block; margin-bottom:10px; color:#2c3e50;">
                            <input type="checkbox" disabled checked> 💰 资金与收付
                        </label>
                        <div style="margin-left:20px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <label><input type="checkbox" class="perm-chk" value="treasury" ${isChecked('treasury')}> 收付款执行</label>
                            <label><input type="checkbox" class="perm-chk" value="expense" ${isChecked('expense')}> 费用报销</label>
                            <label><input type="checkbox" class="perm-chk" value="approval" ${isChecked('approval')}> 资金审批</label>
                        </div>
                    </div>

                    <div class="perm-card" style="border:1px solid #eee; padding:15px; border-radius:6px;">
                        <label style="font-weight:bold; display:block; margin-bottom:10px; color:#2c3e50;">
                            <input type="checkbox" disabled checked> 🧾 税务管理
                        </label>
                        <div style="margin-left:20px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <label><input type="checkbox" class="perm-chk" value="invoice" ${isChecked('invoice')}> 销项/进项发票</label>
                            <label><input type="checkbox" class="perm-chk" value="tax" ${isChecked('tax')}> 纳税申报表</label>
                        </div>
                    </div>

                    <div class="perm-card" style="border:1px solid #eee; padding:15px; border-radius:6px;">
                        <label style="font-weight:bold; display:block; margin-bottom:10px; color:#2c3e50;">
                            <input type="checkbox" disabled checked> 📊 报表与系统
                        </label>
                        <div style="margin-left:20px; display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                            <label><input type="checkbox" class="perm-chk" value="dashboard" ${isChecked('dashboard')}> 经营仪表盘</label>
                            <label><input type="checkbox" class="perm-chk" value="report" ${isChecked('report')}> 三大财务报表</label>
                            
                            <label><input type="checkbox" class="perm-chk" value="log" ${isChecked('log')}> 操作日志</label>
                        </div>
                    </div>
                </div>

                <div style="margin-top:30px; border-top:1px solid #eee; padding-top:20px; text-align:right;">
                    <button class="btn-primary" style="background:#95a5a6; margin-right:10px;" onclick="loadContent('Permission')">重置</button>
                    <button class="btn-primary" style="background:#27ae60; padding:10px 30px;" onclick="saveRoleConfig('${currentRole.id}')">💾 保存配置</button>
                </div>

            </div>
        </div>
    `;
    }

    // =========================================================================
    // 43. 结转损益 (PeriodEndProfit) - [逻辑修复版：默认未结转 + 真实计算]
    // =========================================================================
    else if (moduleCode === "PeriodEndProfit") {
        const meta = typeof getCurrentPeriodMeta === "function"
            ? getCurrentPeriodMeta()
            : { year: "2026", periodNo: 1, label: "2026年1期", key: "2026-1" };
        const periodLabel = meta.label || `${meta.year}年${meta.periodNo}期`;
        const periodStr = typeof getCurrentPeriodString === "function"
            ? getCurrentPeriodString(meta)
            : `${meta.year}-${String(meta.periodNo).padStart(2, "0")}`;
        const closingStatus = typeof window.getPeriodEndClosingStatus === "function"
            ? window.getPeriodEndClosingStatus(periodStr)
            : null;
        const legacyTransferred = sessionStorage.getItem(`${meta.key}-ProfitTransferred`) === "true";
        const legacyAmount = sessionStorage.getItem(`${meta.key}-ProfitAmount`);
        const isTransferred = closingStatus ? closingStatus.status === "done" : legacyTransferred;
        const profitAmount = closingStatus && closingStatus.amounts
            ? closingStatus.amounts.profit
            : (legacyAmount ? parseFloat(legacyAmount) : null);
        const formatAmount = (value) => {
            if (value === null || value === undefined || Number.isNaN(value)) return "-";
            return Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 });
        };
        const statusText = isTransferred ? "已结转" : "未结转";
        const statusColor = isTransferred ? "#27ae60" : "#c0392b";
        const amountText = isTransferred
            ? `<span style="color: #2980b9; font-weight:bold;">${formatAmount(profitAmount)}</span>`
            : '<span style="color: #f39c12;">待执行 (系统自动计算)</span>';
        const timeText = isTransferred && closingStatus ? closingStatus.time : "-";
        const legacyVoucher = sessionStorage.getItem(`${meta.key}-ProfitVoucher`);
        const vouchers = closingStatus && closingStatus.vouchers
            ? closingStatus.vouchers
            : { tax: [], income: legacyVoucher ? [legacyVoucher] : [], cost: [] };
        const normalizeVoucherList = (value) => {
            if (Array.isArray(value)) return value.filter(Boolean);
            if (!value || value === "-") return [];
            return [value];
        };
        const renderVoucherLink = (id) => {
            if (!id || id === "-") return "-";
            return `<a href="javascript:void(0)" onclick="openVoucherDetail('${id}')" style="color:#3498db;">${id}</a>`;
        };
        const renderVoucherGroup = (list) => {
            if (!list.length) return "-";
            return list.map(renderVoucherLink).join("、");
        };
        const voucherText = isTransferred
            ? `
            <div class="closing-voucher-list">
                <div>税金：${renderVoucherGroup(normalizeVoucherList(vouchers.tax))}</div>
                <div>收入：${renderVoucherGroup(normalizeVoucherList(vouchers.income))}</div>
                <div>成本：${renderVoucherGroup(normalizeVoucherList(vouchers.cost))}</div>
            </div>
            `
            : "-";
        const actionHtml = isTransferred
            ? `<a href="javascript:void(0)" onclick="reversePeriodEndClosing('${periodLabel}')" style="color:#e74c3c;">冲回</a>`
            : `<button onclick="requestPeriodEndClosing('${periodLabel}')" class="btn-primary" style="padding:4px 8px; font-size:12px;">一键结转</button>`;

        contentHTML += `
                    <h2>结转损益 🔄</h2>
                    <p style="color: #7f8c8d;">执行期末自动操作，将税金、收入、成本费用按模板结转至本年利润。</p>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <span style="font-weight:bold;">当前期间：<span style="color:#2980b9; font-size:16px;">${periodLabel}</span></span>
                        <button class="btn-primary" style="margin-left:12px;" onclick="loadContent('PeriodEndProfit')">刷新状态</button>
                        <button class="btn-primary btn-ghost" style="margin-left:6px;" onclick="loadContent('AccountingStandardSetting')">模板配置</button>
                    </div>

                    <h3>结转历史记录</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>期间</th>
                                <th>操作时间</th>
                                <th>损益净额 (RMB)</th>
                                <th>结转凭证号</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="row-${meta.key}" style="${isTransferred ? "background:#f0fdf4" : ""}">
                                <td>${periodLabel}</td>
                                <td class="time-cell">${timeText}</td>
                                <td class="amount-cell">${amountText}</td>
                                <td class="voucher-cell">${voucherText}</td>
                                <td class="status-cell"><span style="color: ${statusColor}; font-weight: bold;">${statusText}</span></td>
                                <td class="action-cell">${actionHtml}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 44. 月末结账 (PeriodEndClose) - [修复版：反结账逻辑闭环]
    // =========================================================================
    else if (moduleCode === "PeriodEndClose") {
        // 1. 读取结账状态
        const isClosed = sessionStorage.getItem("2026-1-MonthClosed") === "true";

        if (isClosed) {
            // --- 场景 A：已结账状态 (显示反结账) ---
            contentHTML += `
                        <h2>月末结账  🔒</h2>
                        
                        <div style="background: #e8f5e9; padding: 40px; text-align: center; border: 1px solid #27ae60; border-radius: 8px; margin-top: 20px;">
                            <h1 style="color: #27ae60; margin: 0;">✅ 2026年1期 已结账</h1>
                            <p style="color: #666; margin-top: 10px;">当前会计期间已切换至 <strong>2026年2期</strong>。</p>
                            <p style="color: #666;">历史数据已锁定，禁止录入、修改或删除凭证。</p>
                            
                            <div style="margin-top: 30px;">
                                <button class="btn-primary" style="background-color: #e74c3c; padding: 10px 30px; font-size: 16px;" onclick="executeReOpen()">⏪ 申请反结账 (回退)</button>
                            </div>
                            <p style="font-size:12px; color:#999; margin-top:10px;">* 反结账操作将记录高危审计日志</p>
                        </div>
                    `;
        } else {
            // --- 场景 B：未结账状态 (显示检查表) ---
            contentHTML += `
                        <h2>月末结账  🔒</h2>
                        <p style="color: #7f8c8d;">执行期末结账，锁定当期数据。结账前需通过所有系统检查。</p>
                        
                        <div class="filter-area" style="background-color: white; padding: 15px; margin-bottom: 20px;">
                            <span style="font-weight:bold;">当前会计期间：<span style="color:#2980b9; font-size:18px;">2026年1期</span></span>
                            <button class="btn-primary" onclick="refreshClosingCheck()" style="margin-left:15px;">🔄 刷新检查状态</button>
                        </div>
                        
                        <div class="action-bar" style="margin-bottom: 15px;">
                            <button id="btnExecuteClose" class="btn-primary" style="background-color: #95a5a6; cursor: not-allowed;" onclick="executeMonthEndClose()" disabled>执行月末结账</button>
                        </div>

                        <h3>结账前检查清单</h3>
                        <table class="data-table">
                            <thead><tr><th>检查项</th><th>状态</th><th>提示信息</th><th>操作</th></tr></thead>
                            <tbody id="checkListBody">
                                <tr><td colspan="4" style="text-align:center; color:#999;">请点击“刷新检查状态”开始自检...</td></tr>
                            </tbody>
                        </table>
                    `;

            // 自动触发一次检查
            setTimeout(refreshClosingCheck, 200);
        }
    }

    // =========================================================================
    // 44. 试算平衡表 (ReportTrialBalance)
    // =========================================================================
    else if (moduleCode === "ReportTrialBalance") {
        const books = window.getAccountBooks ? window.getAccountBooks() : [];
        const vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const periodOptions = Array.from(new Set(vouchers
            .map(v => v.date)
            .filter(Boolean)
            .map(date => date.slice(0, 7))))
            .sort()
            .map(period => `<option value="${period}">${period}</option>`).join("");
        const defaultPeriod = new Date().toISOString().slice(0, 7);

        contentHTML += `
            <h2>试算平衡表</h2>
            <p style="color:#7f8c8d;">依据科目与凭证发生额生成试算平衡结果，支持按期间查看。</p>
            <div style="background:white; padding:15px; border-radius:6px; box-shadow:0 2px 4px rgba(0,0,0,0.05); margin-bottom:16px; display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
                <label>账簿</label>
                <select style="padding:8px 10px; border:1px solid #ccc; border-radius:4px; min-width:200px;">
                    <option value="">综合账簿</option>
                    ${books.map(b => `<option value="${b.id}">${b.name}</option>`).join("")}
                </select>
                <label>期间</label>
                <select id="trial-filter-period" style="padding:8px 10px; border:1px solid #ccc; border-radius:4px; min-width:140px;">
                    <option value="">全部</option>
                    ${periodOptions}
                </select>
                <label>币别</label>
                <input type="text" value="综合本位币" readonly style="padding:8px 10px; border:1px solid #ccc; border-radius:4px; min-width:160px; background:#f7f9fa;">
                <input id="trial-balance-result" type="text" value="试算结果平衡" readonly style="padding:8px 10px; border:1px solid #ccc; border-radius:4px; min-width:200px; background:#f7f9fa;">
                <button class="btn-primary" onclick="filterTrialBalance()">查询</button>
            </div>

            <div class="trial-balance-wrap">
                <table class="data-table trial-balance-table">
                    <thead>
                        <tr style="background:#f5f6f8;">
                            <th rowspan="2" class="trial-col-code">科目编码</th>
                            <th rowspan="2" class="trial-col-name">科目名称</th>
                            <th colspan="2" class="trial-group">期初余额</th>
                            <th colspan="2" class="trial-group">本期发生</th>
                            <th colspan="2" class="trial-group">期末余额</th>
                        </tr>
                        <tr style="background:#f5f6f8;">
                            <th class="trial-num">借方</th>
                            <th class="trial-num">贷方</th>
                            <th class="trial-num">借方</th>
                            <th class="trial-num">贷方</th>
                            <th class="trial-num">借方</th>
                            <th class="trial-num">贷方</th>
                        </tr>
                    </thead>
                    <tbody id="trial-balance-body"></tbody>
                    <tfoot id="trial-balance-foot"></tfoot>
                </table>
            </div>
        `;

        setTimeout(() => {
            const periodSelect = document.getElementById("trial-filter-period");
            if (periodSelect && periodSelect.querySelector(`option[value="${defaultPeriod}"]`)) {
                periodSelect.value = defaultPeriod;
            }
            if (typeof window.renderTrialBalance === "function") {
                window.renderTrialBalance({ period: periodSelect ? periodSelect.value : "" });
            }
        }, 100);
    }

    // =========================================================================
    // 45. 资产负债表 (ReportBalanceSheet) - [清空版：纯净数据]
    // =========================================================================
    else if (moduleCode === "ReportBalanceSheet") {
        // 1. 获取本年利润 (这是让报表平衡的关键！)
        // 利润表算出的“净利润”，最终会变成资产负债表里的“权益”
        const profitResult =
            typeof calculateRealProfit === "function"
                ? calculateRealProfit()
                : { profit: 0 };
        const currentProfit = profitResult.profit;

        // 2. 初始化报表结构
        // 我们把期初余额全部设为 0，只保留科目壳子，这样数据才干净
        let subjectBalances = {
            1001: 0,
            1002: 0,
            1122: 0,
            1601: 0, // 资产类
            2202: 0,
            2203: 0,
            2221: 0, // 负债类
            4001: 0,
            4103: 0, // 权益类
        };

        // 3. 遍历凭证，累加发生额 (只算已生效的)
        const vouchers = JSON.parse(
            sessionStorage.getItem("ManualVouchers") || "[]"
        );

        vouchers.forEach((v) => {
            if (v.status === "已审核" || v.status === "已记账") {
                if (v.lines) {
                    v.lines.forEach((line) => {
                        const code = line.account.split(" ")[0]; // 取科目代码
                        const debit = parseFloat(line.debit) || 0;
                        const credit = parseFloat(line.credit) || 0;

                        // 动态初始化：如果凭证里用了新科目，自动加进来，初始为0
                        if (subjectBalances[code] === undefined) subjectBalances[code] = 0;

                        // ★★★ 核心计算公式 ★★★
                        // 资产 (1开头)：借加贷减
                        if (code.startsWith("1")) {
                            subjectBalances[code] += debit - credit;
                        }
                        // 负债 (2开头) & 权益 (4开头)：贷加借减
                        else if (code.startsWith("2") || code.startsWith("4")) {
                            subjectBalances[code] += credit - debit;
                        }
                        // 损益类 (6开头) 不在这里直接算，而是通过下面的 currentProfit 汇总进来
                    });
                }
            }
        });

        // 4. 注入本年利润 (这一步是平账的核心)
        // 把利润表算出来的钱，塞进 "4103 本年利润"
        subjectBalances["4103"] = (subjectBalances["4103"] || 0) + currentProfit;

        // 5. 分类与渲染（支持模板联动）
        let assets = { total: 0, items: [] };
        let liabilities = { total: 0, items: [] };
        let equity = { total: 0, items: [] };

        const parseCodes = (value) => (value || "")
            .toString()
            .split(/[,，]/)
            .map(item => item.trim())
            .filter(Boolean);
        const matchCode = (code, codes) => codes.some(prefix => code.startsWith(prefix));
        const calcBalanceByCodes = (codes, op) => {
            if (!codes.length) return 0;
            let total = 0;
            Object.keys(subjectBalances).forEach(code => {
                if (!matchCode(code, codes)) return;
                const val = subjectBalances[code] || 0;
                total += (op === "-" ? -val : val);
            });
            return total;
        };

        const defaultBalanceTemplate = [
            { name: "流动资产：", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "货币资金", type: "流动资产", codesA: "1001,1002,1012", opA: "+", codesB: "", opB: "+" },
            { name: "交易性金融资产", type: "流动资产", codesA: "1101", opA: "+", codesB: "", opB: "+" },
            { name: "应收票据", type: "流动资产", codesA: "1121", opA: "+", codesB: "", opB: "+" },
            { name: "应收账款", type: "流动资产", codesA: "1122", opA: "+", codesB: "", opB: "+" },
            { name: "预付款项", type: "流动资产", codesA: "1123", opA: "+", codesB: "", opB: "+" },
            { name: "应收利息", type: "流动资产", codesA: "1132", opA: "+", codesB: "", opB: "+" },
            { name: "应收股利", type: "流动资产", codesA: "1131", opA: "+", codesB: "", opB: "+" },
            { name: "其他应收款", type: "流动资产", codesA: "1221", opA: "+", codesB: "", opB: "+" },
            { name: "存货", type: "流动资产", codesA: "1403,1405", opA: "+", codesB: "", opB: "+" },
            { name: "一年内到期的非流动资产", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "其他流动资产", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "流动资产合计", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "非流动资产：", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期应收款", type: "非流动资产", codesA: "1531", opA: "+", codesB: "", opB: "+" },
            { name: "长期股权投资", type: "非流动资产", codesA: "1511", opA: "+", codesB: "", opB: "+" },
            { name: "投资性房地产", type: "非流动资产", codesA: "1521", opA: "+", codesB: "", opB: "+" },
            { name: "固定资产", type: "非流动资产", codesA: "1601", opA: "+", codesB: "", opB: "+" },
            { name: "在建工程", type: "非流动资产", codesA: "1604", opA: "+", codesB: "", opB: "+" },
            { name: "工程物资", type: "非流动资产", codesA: "1605", opA: "+", codesB: "", opB: "+" },
            { name: "固定资产清理", type: "非流动资产", codesA: "1606", opA: "+", codesB: "", opB: "+" },
            { name: "生产性生物资产", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "油气资产", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "无形资产", type: "非流动资产", codesA: "1701", opA: "+", codesB: "", opB: "+" },
            { name: "开发支出", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "商誉", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期待摊费用", type: "非流动资产", codesA: "1801", opA: "+", codesB: "", opB: "+" },
            { name: "递延所得税资产", type: "非流动资产", codesA: "1811", opA: "+", codesB: "", opB: "+" },
            { name: "其他非流动资产", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "非流动资产合计", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "资产总计", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },

            { name: "流动负债：", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "短期借款", type: "流动负债", codesA: "2001", opA: "+", codesB: "", opB: "+" },
            { name: "交易性金融负债", type: "流动负债", codesA: "2101", opA: "+", codesB: "", opB: "+" },
            { name: "应付票据", type: "流动负债", codesA: "2201", opA: "+", codesB: "", opB: "+" },
            { name: "应付账款", type: "流动负债", codesA: "2202", opA: "+", codesB: "", opB: "+" },
            { name: "预收款项", type: "流动负债", codesA: "2203", opA: "+", codesB: "", opB: "+" },
            { name: "应付职工薪酬", type: "流动负债", codesA: "2211", opA: "+", codesB: "", opB: "+" },
            { name: "应交税费", type: "流动负债", codesA: "2221", opA: "+", codesB: "", opB: "+" },
            { name: "应付利息", type: "流动负债", codesA: "2231", opA: "+", codesB: "", opB: "+" },
            { name: "应付股利", type: "流动负债", codesA: "2232", opA: "+", codesB: "", opB: "+" },
            { name: "其他应付款", type: "流动负债", codesA: "2241", opA: "+", codesB: "", opB: "+" },
            { name: "一年内到期的非流动负债", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "其他流动负债", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "流动负债合计", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "非流动负债：", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期借款", type: "非流动负债", codesA: "2501", opA: "+", codesB: "", opB: "+" },
            { name: "应付债券", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期应付款", type: "非流动负债", codesA: "2701", opA: "+", codesB: "", opB: "+" },
            { name: "专项应付款", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "预计负债", type: "非流动负债", codesA: "2801", opA: "+", codesB: "", opB: "+" },
            { name: "递延所得税负债", type: "非流动负债", codesA: "2901", opA: "+", codesB: "", opB: "+" },
            { name: "其他非流动负债", type: "非流动负债", codesA: "2401", opA: "+", codesB: "", opB: "+" },
            { name: "负债合计", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },

            { name: "所有者权益（或股东权益）：", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "实收资本（或股本）", type: "所有者权益", codesA: "4001", opA: "+", codesB: "", opB: "+" },
            { name: "资本公积", type: "所有者权益", codesA: "4002", opA: "+", codesB: "", opB: "+" },
            { name: "减：库存股", type: "所有者权益", codesA: "", opA: "-", codesB: "", opB: "+" },
            { name: "盈余公积", type: "所有者权益", codesA: "4101", opA: "+", codesB: "", opB: "+" },
            { name: "一般风险准备", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "未分配利润", type: "所有者权益", codesA: "4103,4104", opA: "+", codesB: "", opB: "+" },
            { name: "归属于母公司所有者权益合计", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "少数股东权益", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "所有者权益合计", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "负债及所有者权益总计", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" }
        ];

        const balanceTemplate = typeof window.getBalanceSheetTemplate === "function"
            ? window.getBalanceSheetTemplate()
            : [];

        const templateRows = balanceTemplate && balanceTemplate.length
            ? balanceTemplate
            : defaultBalanceTemplate;

        templateRows.forEach(item => {
            const type = (item.type || "").toString();
            const codesA = parseCodes(item.codesA);
            const codesB = parseCodes(item.codesB);
            const val = calcBalanceByCodes(codesA, item.opA || "+") + calcBalanceByCodes(codesB, item.opB || "+");
            const row = { name: item.name || "", balance: val };
            if (type.includes("资产")) {
                assets.items.push(row);
                assets.total += val;
            } else if (type.includes("负债")) {
                liabilities.items.push(row);
                liabilities.total += val;
            } else {
                equity.items.push(row);
                equity.total += val;
            }
        });

        // 6. 生成 HTML 行 (左右对齐)
        const maxRows = Math.max(
            assets.items.length,
            liabilities.items.length + equity.items.length
        );
        let rowsHTML = "";

        for (let i = 0; i < maxRows; i++) {
            const lineNo = i + 1;
            const lItem = assets.items[i] || { name: "", balance: "" };

            // 右侧：先放负债，再放权益
            let rItem = { name: "", balance: "" };
            if (i < liabilities.items.length) {
                rItem = liabilities.items[i];
            } else {
                const eqIndex = i - liabilities.items.length;
                if (eqIndex < equity.items.length) rItem = equity.items[eqIndex];
            }

            const lEnd =
                lItem.balance !== ""
                    ? lItem.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })
                    : "";
            const rEnd =
                rItem.balance !== ""
                    ? rItem.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })
                    : "";
            const lLine = lItem.name ? lineNo : "";
            const rLine = rItem.name ? lineNo : "";

            rowsHTML += `
                <tr>
                    <td class="bs-row-no">${lineNo}</td>
                    <td class="bs-check"><input type="checkbox"></td>
                    <td class="bs-name">${lItem.name}</td>
                    <td class="bs-line">${lLine}</td>
                    <td class="bs-num"></td>
                    <td class="bs-num">${lEnd}</td>
                    <td class="bs-name">${rItem.name}</td>
                    <td class="bs-line">${rLine}</td>
                    <td class="bs-num"></td>
                    <td class="bs-num">${rEnd}</td>
                </tr>
            `;
        }

        // 7. 平衡检查
        // 资产 = 负债 + 权益 (允许 0.01 的计算误差)
        const rightTotal = liabilities.total + equity.total;
        const isBalanced = Math.abs(assets.total - rightTotal) < 0.01;

        contentHTML += `
            <div class="balance-sheet-page">
                <div class="balance-sheet-toolbar">
                    <div class="balance-sheet-field">
                        <label>账套</label>
                        <select>
                            <option>测试账套</option>
                            <option>正式账套</option>
                        </select>
                    </div>
                    <div class="balance-sheet-field">
                        <label>会计期间</label>
                        <select>
                            <option>${new Date().toISOString().slice(0, 7)}</option>
                            <option>2025-12</option>
                            <option>2025-11</option>
                        </select>
                    </div>
                    <div class="balance-sheet-field">
                        <label>过账状态</label>
                        <select>
                            <option>已过账</option>
                            <option>未过账</option>
                        </select>
                    </div>
                    <button class="btn-primary balance-sheet-search">查询</button>
                </div>

                <div class="balance-sheet-actions">
                    <div class="balance-sheet-status ${isBalanced ? "is-ok" : "is-bad"}">
                        ${isBalanced ? "✅ 报表平衡" : "❌ 报表不平"}
                    </div>
                    <div class="balance-sheet-action-buttons">
                        <button class="btn-primary btn-ghost">导出</button>
                        <button class="btn-primary btn-ghost">打印</button>
                        <button class="btn-primary btn-ghost">设置</button>
                    </div>
                </div>

                <div class="balance-sheet-table-wrap">
                    <table class="balance-sheet-table">
                        <thead>
                            <tr>
                                <th style="width:50px;"></th>
                                <th style="width:50px;"></th>
                                <th>资产</th>
                                <th style="width:80px;">行号</th>
                                <th style="width:120px;">年初数</th>
                                <th style="width:120px;">期末数</th>
                                <th>负债及所有者权益</th>
                                <th style="width:80px;">行号</th>
                                <th style="width:120px;">年初数</th>
                                <th style="width:120px;">期末数</th>
                            </tr>
                            <tr class="balance-sheet-filter-row">
                                <th>筛选</th>
                                <th></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHTML ||
                '<tr><td colspan="10" style="text-align:center; padding:20px; color:#94a3b8;">暂无数据，请先录入凭证</td></tr>'
                }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2"></td>
                                <td class="bs-total-label">资产总计</td>
                                <td></td>
                                <td></td>
                                <td class="bs-total-num">${assets.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                                <td class="bs-total-label">负债及权益总计</td>
                                <td></td>
                                <td></td>
                                <td class="bs-total-num">${rightTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
    }


    // =========================================================================
    // 46. 利润损益表 (ReportIncomeStatement) 
    // =========================================================================
    else if (moduleCode === "ReportIncomeStatement") {
        let data = {
            income: 0,
            cost: 0,
            saleExp: 0,
            adminExp: 0,
            finExp: 0,
            tax: 0,
        };
        const vouchers = JSON.parse(
            sessionStorage.getItem("ManualVouchers") || "[]"
        );

        vouchers.forEach((v) => {
            if (v.status === "已审核" || v.status === "已记账") {
                if (v.lines) {
                    v.lines.forEach((line) => {
                        const account = line.account ? line.account.trim() : "";
                        const code = account.split(" ")[0];
                        const val = parseFloat(line.debit) || 0;
                        const valCredit = parseFloat(line.credit) || 0;

                        // ★★★ 智能匹配逻辑 (同时匹配代码和中文) ★★★

                        // 1. 收入 (60开头 或 包含"收入") - 通常记贷方
                        if (
                            code.startsWith("60") ||
                            code.startsWith("61") ||
                            code.startsWith("63") ||
                            account.includes("收入")
                        ) {
                            data.income += valCredit;
                        }
                        // 2. 成本 (64开头 或 包含"成本") - 通常记借方
                        else if (
                            code.startsWith("6401") ||
                            code.startsWith("6402") ||
                            account.includes("成本")
                        ) {
                            data.cost += val;
                        }
                        // 3. 税金 (640301 或 包含"税金")
                        else if (code.startsWith("640301") || account.includes("税金")) {
                            data.tax += val;
                        }
                        // 4. 销售费用 (6601 或 包含"销售")
                        else if (code.startsWith("6601") || account.includes("销售")) {
                            data.saleExp += val;
                        }
                        // 5. 管理费用 (6602 或 包含"管理"、"办公"、"工资")
                        else if (
                            code.startsWith("6602") ||
                            account.includes("管理") ||
                            account.includes("办公") ||
                            account.includes("工资")
                        ) {
                            data.adminExp += val;
                        }
                        // 6. 财务费用 (6603 或 包含"财务"、"利息")
                        else if (
                            code.startsWith("6603") ||
                            account.includes("财务") ||
                            account.includes("利息")
                        ) {
                            data.finExp += val;
                        }
                    });
                }
            }
        });

        // 计算利润
        const opProfit =
            data.income -
            data.cost -
            data.tax -
            data.saleExp -
            data.adminExp -
            data.finExp;
        const netProfit = opProfit; // 简化

        const fmt = (num) =>
            num.toLocaleString("en-US", { minimumFractionDigits: 2 });
        const color = (num) =>
            num < 0 ? "color: #e74c3c; font-weight:bold;" : "color: #333;";

        const currentYear = new Date().getFullYear();
        const monthLabels = Array.from({ length: 12 }, (_, i) => `${currentYear}-${i + 1}月`);
        const parseCodes = (value) => (value || "")
            .toString()
            .split(/[,，]/)
            .map(item => item.trim())
            .filter(Boolean);
        const matchCode = (code, codes) => codes.some(prefix => code.startsWith(prefix));
        const calcTemplateAmount = (codes, op) => {
            if (!codes.length) return 0;
            let total = 0;
            vouchers.forEach((v) => {
                if (v.status === "已审核" || v.status === "已记账" || v.status === "已过账") {
                    if (!v.lines) return;
                    v.lines.forEach((line) => {
                        const account = line.account ? line.account.trim() : "";
                        const code = account.split(" ")[0];
                        if (!code || !matchCode(code, codes)) return;
                        const debit = parseFloat(line.debit) || 0;
                        const credit = parseFloat(line.credit) || 0;
                        total += op === "-" ? (debit - credit) : (credit - debit);
                    });
                }
            });
            return total;
        };
        const incomeTemplate = (() => {
            const raw = sessionStorage.getItem("IncomeStatementTemplate");
            if (!raw) return [];
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        })();
        const rows = (incomeTemplate && incomeTemplate.length ? incomeTemplate : [
            { name: "一、营业总收入", codes: "6001,600110,6051", op: "+" },
            { name: "减：营业成本", codes: "6401,6402", op: "-" },
            { name: "营业税金及附加", codes: "640301", op: "-" },
            { name: "销售费用", codes: "6601", op: "-" },
            { name: "管理费用", codes: "6602", op: "-" },
            { name: "财务费用", codes: "6603", op: "-" },
            { name: "资产减值损失", codes: "6701", op: "-" },
            { name: "加：其他收益", codes: "", op: "+" },
            { name: "加：公允价值变动收益（损失以“-”号填列）", codes: "6101", op: "+" },
            { name: "投资收益（损失以“-”号填列）", codes: "6111", op: "+" },
            { name: "其中：对联营企业和合营企业的投资收益", codes: "", op: "+" },
            { name: "汇兑收益（损失以“-”号填列）", codes: "", op: "+" },
            { name: "二、营业利润（亏损以“-”号填列）", codes: "", op: "+" },
            { name: "加：营业外收入", codes: "6301", op: "+" },
            { name: "减：营业外支出", codes: "6711", op: "-" },
            { name: "其中：非流动资产处置损失", codes: "", op: "-" },
            { name: "三、利润总额（亏损总额以“-”号填列）", codes: "", op: "+" },
            { name: "减：所得税费用", codes: "6801", op: "-" },
            { name: "四、净利润（净亏损以“-”号填列）", codes: "", op: "+" },
            { name: "归属于公司所有者的净利润", codes: "", op: "+" },
            { name: "少数股东损益", codes: "", op: "+" },
            { name: "五、每股收益：", codes: "", op: "+" },
            { name: "（一）基本每股收益", codes: "", op: "+" },
            { name: "（二）稀释每股收益", codes: "", op: "+" }
        ]).map((item) => {
            const codes = parseCodes(item.codes);
            const amount = codes.length ? calcTemplateAmount(codes, item.op || "+") : 0;
            return { label: item.name || item.label || "", amount };
        });

        const bodyRows = rows.map((row, idx) => {
            const lineNo = idx + 1;
            const amount = row.amount === "" ? "" : fmt(row.amount || 0);
            const ytd = row.amount === "" ? "" : amount;
            const firstMonth = row.amount === "" ? "" : amount;
            return `
                <tr>
                    <td class="is-row-no">${lineNo}</td>
                    <td class="is-check"><input type="checkbox"></td>
                    <td class="is-item">${row.label}</td>
                    <td class="is-line">${lineNo}</td>
                    <td class="is-num">${ytd}</td>
                    ${monthLabels.map((_, i) => `<td class="is-num">${i === 0 ? firstMonth : ""}</td>`).join("")}
                    <td class="is-num">${amount}</td>
                </tr>
            `;
        }).join("");

        contentHTML += `
            <div class="income-sheet-page">
                <div class="income-sheet-toolbar">
                    <div class="income-sheet-field">
                        <label>账套</label>
                        <select>
                            <option>测试账套</option>
                            <option>正式账套</option>
                        </select>
                    </div>
                    <div class="income-sheet-field">
                        <label>会计年度</label>
                        <select>
                            <option>${currentYear}</option>
                            <option>${currentYear - 1}</option>
                        </select>
                    </div>
                    <div class="income-sheet-field">
                        <label>过账状态</label>
                        <select>
                            <option>已过账</option>
                            <option>未过账</option>
                        </select>
                    </div>
                    <button class="btn-primary income-sheet-search">查询</button>
                </div>

                <div class="income-sheet-actions">
                    <div class="income-sheet-action-buttons">
                        <button class="btn-primary btn-ghost">导出</button>
                        <button class="btn-primary btn-ghost">打印</button>
                        <button class="btn-primary btn-ghost">设置</button>
                    </div>
                </div>

                <div class="income-sheet-table-wrap">
                    <table class="income-sheet-table">
                        <thead>
                            <tr>
                                <th style="width:48px;"></th>
                                <th style="width:48px;"></th>
                                <th>项目</th>
                                <th style="width:80px;">行次</th>
                                <th style="width:110px;">本年累计</th>
                                ${monthLabels.map(label => `<th style="width:110px;">${label}</th>`).join("")}
                                <th style="width:110px;">余额</th>
                            </tr>
                            <tr class="income-sheet-filter-row">
                                <th>筛选</th>
                                <th></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                ${monthLabels.map(() => `<th><input type="text" placeholder=""></th>`).join("")}
                                <th><input type="text" placeholder=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bodyRows || '<tr><td colspan="18" style="text-align:center; padding:20px; color:#94a3b8;">暂无数据</td></tr>'}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2">合计</td>
                                <td></td>
                                <td></td>
                                <td class="is-num">${fmt(netProfit)}</td>
                                ${monthLabels.map((_, i) => `<td class="is-num">${i === 0 ? fmt(netProfit) : ""}</td>`).join("")}
                                <td class="is-num">${fmt(netProfit)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // 47. 现金流量表 (ReportCashFlow) - [自动分析版]
    // =========================================================================
    else if (moduleCode === "ReportCashFlow") {
        let cashFlows = [];
        let totalIn = 0;
        let totalOut = 0;

        const vouchers = JSON.parse(
            sessionStorage.getItem("ManualVouchers") || "[]"
        );

        vouchers.forEach((v) => {
            if (v.status === "已审核" || v.status === "已记账") {
                if (!v.lines) return;

                // 检查这张凭证里有没有涉及资金 (1001 或 1002)
                const cashLine = v.lines.find(
                    (l) => l.account.startsWith("1001") || l.account.startsWith("1002")
                );

                if (cashLine) {
                    // 找到了资金行，开始分析
                    const isDebit = parseFloat(cashLine.debit) > 0; // 借方表示钱增加了(流入)
                    const amount = isDebit
                        ? parseFloat(cashLine.debit)
                        : parseFloat(cashLine.credit);

                    // 找对方科目 (简单逻辑：找分录里第一行不是资金的科目)
                    const otherLine = v.lines.find(
                        (l) =>
                            !l.account.startsWith("1001") && !l.account.startsWith("1002")
                    ) || { account: "未知", summary: "未说明" };
                    const otherCode = otherLine.account.split(" ")[0];

                    // 判定类型
                    let type = "经营活动"; // 默认为经营
                    let item = "支付/收到其他款项";

                    if (isDebit) {
                        totalIn += amount;
                        if (otherCode.startsWith("60") || otherCode.startsWith("1122"))
                            item = "销售商品、提供劳务收到的现金";
                        else if (otherCode.startsWith("20") || otherCode.startsWith("25")) {
                            type = "筹资活动";
                            item = "取得借款收到的现金";
                        }
                    } else {
                        totalOut += amount;
                        if (otherCode.startsWith("64") || otherCode.startsWith("2202"))
                            item = "购买商品、接受劳务支付的现金";
                        else if (
                            otherCode.startsWith("6602") &&
                            otherLine.account.includes("工资")
                        )
                            item = "支付给职工以及为职工支付的现金";
                        else if (otherCode.startsWith("16")) {
                            type = "投资活动";
                            item = "购建固定资产支付的现金";
                        }
                    }

                    cashFlows.push({
                        date: v.date,
                        type: type,
                        item: item,
                        direction: isDebit ? "流入 (+)" : "流出 (-)",
                        amount: amount,
                        summary: v.lines[0].summary, // 取凭证摘要
                    });
                }
            }
        });

        const cashflowTemplate = typeof window.getCashflowTemplate === "function"
            ? window.getCashflowTemplate()
            : [];
        const cashflowLabels = cashflowTemplate && cashflowTemplate.length
            ? cashflowTemplate.map(item => item.name)
            : [
                "一、经营活动产生的现金流量",
                "销售商品、提供劳务收到的现金",
                "收到的税费返还",
                "收到其他与经营活动有关的现金",
                "经营活动现金流入小计",
                "购买商品、接受劳务支付的现金",
                "支付给职工以及为职工支付的现金",
                "支付的各项税费",
                "支付其他与经营活动有关的现金",
                "经营活动现金流出小计",
                "经营活动产生的现金流量净额",
                "二、投资活动产生的现金流量",
                "收回投资收到的现金",
                "取得投资收益收到的现金",
                "处置固定资产、无形资产和其他长期资产收回的现金净额",
                "处置子公司及其他营业单位收到的现金净额",
                "收到其他与投资活动有关的现金",
                "投资活动现金流入小计",
                "购建固定资产、无形资产和其他长期资产支付的现金",
                "投资支付的现金",
                "取得子公司及其他营业单位支付的现金净额",
                "支付其他与投资活动有关的现金",
                "投资活动现金流出小计",
                "投资活动产生的现金流量净额",
                "三、筹资活动产生的现金流量",
                "吸收投资收到的现金",
                "取得借款收到的现金",
                "收到其他与筹资活动有关的现金",
                "筹资活动现金流入小计",
                "偿还债务支付的现金",
                "分配股利、利润或偿付利息支付的现金",
                "支付其他与筹资活动有关的现金",
                "筹资活动现金流出小计",
                "筹资活动产生的现金流量净额",
                "四、汇率变动对现金及现金等价物的影响",
                "五、现金及现金等价物净增加额",
                "加：期初现金及现金等价物余额",
                "六、期末现金及现金等价物余额"
            ];

        const cashflowMap = {};
        cashFlows.forEach(item => {
            if (!item.item) return;
            const sign = item.direction.includes("+") ? 1 : -1;
            cashflowMap[item.item] = (cashflowMap[item.item] || 0) + item.amount * sign;
        });

        const resolveCashflowValue = (label) => {
            if (cashflowMap[label] !== undefined) return cashflowMap[label];
            if (label.includes("流入小计")) return totalIn;
            if (label.includes("流出小计")) return totalOut;
            if (label.includes("净额")) return totalIn - totalOut;
            return "";
        };

        const rowsHTML = cashflowLabels.map((label, idx) => {
            const lineNo = idx + 1;
            const value = resolveCashflowValue(label);
            const current = value === "" ? "" : value;
            const ytd = value === "" ? "" : value;
            return `
                <tr>
                    <td class="cf-row-no">${lineNo}</td>
                    <td class="cf-check"><input type="checkbox"></td>
                    <td class="cf-item">${label}</td>
                    <td class="cf-line">${lineNo}</td>
                    <td class="cf-num">${current !== "" ? current.toLocaleString("en-US", { minimumFractionDigits: 2 }) : ""}</td>
                    <td class="cf-num">${ytd !== "" ? ytd.toLocaleString("en-US", { minimumFractionDigits: 2 }) : ""}</td>
                </tr>
            `;
        }).join("");

        contentHTML += `
            <div class="cashflow-sheet-page">
                <div class="cashflow-sheet-toolbar">
                    <div class="cashflow-sheet-field">
                        <label>账套</label>
                        <select>
                            <option>测试账套</option>
                            <option>正式账套</option>
                        </select>
                    </div>
                    <div class="cashflow-sheet-field">
                        <label>会计期间</label>
                        <select>
                            <option>${new Date().toISOString().slice(0, 7)}</option>
                            <option>2025-12</option>
                            <option>2025-11</option>
                        </select>
                    </div>
                    <div class="cashflow-sheet-field">
                        <label>过账状态</label>
                        <select>
                            <option>已过账</option>
                            <option>未过账</option>
                        </select>
                    </div>
                    <button class="btn-primary cashflow-sheet-search">查询</button>
                </div>

                <div class="cashflow-sheet-actions">
                    <div class="cashflow-sheet-action-buttons">
                        <button class="btn-primary btn-ghost">导出</button>
                        <button class="btn-primary btn-ghost">打印</button>
                    </div>
                </div>

                <div class="cashflow-sheet-table-wrap">
                    <table class="cashflow-sheet-table">
                        <thead>
                            <tr>
                                <th style="width:48px;"></th>
                                <th style="width:48px;"></th>
                                <th>项目</th>
                                <th style="width:80px;">行次</th>
                                <th style="width:110px;">本期金额</th>
                                <th style="width:110px;">本年累计</th>
                            </tr>
                            <tr class="cashflow-sheet-filter-row">
                                <th>筛选</th>
                                <th></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                                <th><input type="text" placeholder=""></th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHTML || '<tr><td colspan="6" style="text-align:center; padding:20px; color:#94a3b8;">暂无数据</td></tr>'}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="2">合计</td>
                                <td></td>
                                <td></td>
                                <td class="cf-num">${(totalIn - totalOut).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                                <td class="cf-num">${(totalIn - totalOut).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
    }


    // =========================================================================
    // 49. 单车线路盈亏分析 (ReportVehicleProfit)
    // =========================================================================
    else if (moduleCode === "ReportVehicleProfit") {
        const parseNumber = (value) => {
            if (value === null || value === undefined) return 0;
            const num = parseFloat(value.toString().replace(/,/g, ""));
            return Number.isFinite(num) ? num : 0;
        };
        const parseDateOnly = (value) => {
            if (!value) return null;
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return null;
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        };
        const formatMoney = (value) => {
            const num = parseNumber(value);
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };
        const formatPercent = (value) => {
            if (!Number.isFinite(value)) return "-";
            return `${(value * 100).toFixed(1)}%`;
        };
        const normalizeSourceType = (value) => {
            const text = (value || "").toString().trim().toLowerCase();
            if (!text) return "";
            if (["waybill", "运单", "yd", "ship"].includes(text)) return "运单";
            if (["batch", "批次", "pc"].includes(text)) return "批次";
            if (["reimbursement", "报销", "expense"].includes(text)) return "报销";
            return text;
        };
        const splitSourceIds = (raw) => {
            return (raw || "")
                .toString()
                .split(/[,，;\n]/)
                .map((val) => val.trim())
                .filter(Boolean);
        };
        const uniqueList = (list) => Array.from(new Set(list.filter(Boolean)));
        const getProjectList = () => {
            const raw = sessionStorage.getItem("AuxiliaryData:project") || localStorage.getItem("AuxiliaryData:project");
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                } catch (error) {
                    // fallback
                }
            }
            return [{ code: "P01", name: "华南项目", enabled: true }];
        };
        const getDefaultProjectValue = () => "all";
        const parseProjectFilter = (value) => {
            if (!value || value === "all") return null;
            const parts = value.split("|||");
            return {
                code: (parts[0] || "").trim(),
                name: (parts[1] || "").trim()
            };
        };
        const extractWaybillIdsFromText = (value) => {
            const text = (value || "").toString();
            if (!text) return [];
            const ids = [];
            const regex = /\bYD\d{4,}(?:[-_]\d+)?\b/gi;
            let match;
            while ((match = regex.exec(text)) !== null) {
                const id = match[0];
                if (id && !ids.includes(id)) ids.push(id);
            }
            return ids;
        };
        const getVoucherWaybillIds = (voucher) => {
            if (!voucher) return [];
            const ids = [];
            if (Array.isArray(voucher.relatedDocs) && voucher.relatedDocs.length) {
                voucher.relatedDocs.forEach((doc) => {
                    const type = normalizeSourceType(doc.type || doc.category || doc.sourceType);
                    const id = (doc.id || doc.no || doc.code || "").toString().trim();
                    if (type === "waybill" && id) ids.push(id);
                    if (type !== "waybill" && id) {
                        ids.push(...extractWaybillIdsFromText(id));
                    }
                });
                if (ids.length) return uniqueList(ids);
            }
            if (Array.isArray(voucher.sourceDocs) && voucher.sourceDocs.length) {
                const type = normalizeSourceType(voucher.sourceDocType || voucher.sourceType || "waybill");
                if (!type || type === "waybill") {
                    ids.push(...voucher.sourceDocs.map((doc) => doc.toString().trim()).filter(Boolean));
                }
                if (ids.length) return uniqueList(ids);
            }
            if (voucher.sourceType && (voucher.sourceNo || voucher.sourceId)) {
                const type = normalizeSourceType(voucher.sourceType);
                const raw = voucher.sourceNo || voucher.sourceId;
                const list = splitSourceIds(raw);
                if (type === "waybill") return uniqueList(list);
                if (list.length && list.every((id) => /^YD/i.test(id))) return uniqueList(list);
            }
            if (voucher.sourceNo || voucher.sourceId) {
                const list = splitSourceIds(voucher.sourceNo || voucher.sourceId);
                if (list.length && list.every((id) => /^YD/i.test(id))) {
                    return uniqueList(list);
                }
            }
            const direct = voucher.waybillNo || voucher.waybill || voucher.orderNo;
            if (direct) return uniqueList([direct]);
            const fromSummary = extractWaybillIdsFromText(voucher.summary);
            if (fromSummary.length) return uniqueList(fromSummary);
            const lines = Array.isArray(voucher.lines) ? voucher.lines : [];
            for (const line of lines) {
                const lineText = line.summary || line.digest || line.zy || "";
                const lineIds = extractWaybillIdsFromText(lineText);
                if (lineIds.length) return uniqueList(lineIds);
            }
            return [];
        };
        const buildSubjectMap = () => {
            let list = [];
            const raw = sessionStorage.getItem("AcctSubjects") || localStorage.getItem("AcctSubjects");
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) list = parsed;
                } catch (error) {
                    // fallback to templates
                }
            }
            const fallback = [
                ...(ACCOUNTING_STANDARD_TEMPLATES.small || []),
                ...(ACCOUNTING_STANDARD_TEMPLATES.enterprise || [])
            ];
            const useList = list.length ? list : fallback;
            const map = {};
            useList.forEach(item => {
                if (item && item.code) map[item.code] = item;
            });
            return map;
        };
        const parseAccount = (line) => {
            const code = (line.accountCode || "").toString().trim();
            const name = (line.accountName || "").toString().trim();
            if (code || name) return { code, name };
            const raw = (line.account || "").toString().trim();
            if (!raw) return { code: "", name: "" };
            const parts = raw.split(/\s+/);
            return { code: parts.shift() || "", name: parts.join(" ") };
        };
        const classifyLine = (line, subjectMap) => {
            const { code, name } = parseAccount(line || {});
            const subject = subjectMap[code] || null;
            const subjectType = subject ? (subject.type || "") : "";
            const subjectName = subject ? (subject.name || "") : "";
            const label = `${name} ${subjectName}`.trim();
            const codeDigits = (code || "").toString().replace(/\D/g, "");
            const prefix1 = codeDigits.slice(0, 1);
            const prefix2 = codeDigits.slice(0, 2);
            const looksIncome = /收入|收益/.test(label) || prefix2 === "60";
            const looksCost = /成本|费用/.test(label) || prefix1 === "5" || ["64", "66", "67"].includes(prefix2);
            if (subjectType === "成本") return "cost";
            if (subjectType === "损益") {
                if (looksIncome) return "income";
                if (looksCost) return "cost";
                if (prefix2 === "60") return "income";
                return "cost";
            }
            if (!subjectType) {
                if (prefix2 === "60") return "income";
                if (prefix1 === "5" || ["64", "66", "67"].includes(prefix2)) return "cost";
            }
            return null;
        };
        const matchesProject = (line, projectFilter) => {
            if (!projectFilter) return true;
            const auxType = (line.auxType || "").toString().trim();
            const auxCode = (line.auxCode || "").toString().trim();
            const auxName = (line.auxName || "").toString().trim();
            const auxText = [
                auxCode,
                auxName,
                (line.aux || "").toString().trim(),
                (line.auxiliary || "").toString().trim()
            ].filter(Boolean).join(" ");
            if (auxType && auxType !== "project" && !auxText) return false;
            if (projectFilter.code && auxCode === projectFilter.code) return true;
            if (projectFilter.name && auxName === projectFilter.name) return true;
            if (projectFilter.name && auxText.includes(projectFilter.name)) return true;
            if (projectFilter.code && auxText.includes(projectFilter.code)) return true;
            return false;
        };
        const buildVehicleProfitData = (filters) => {
            const vouchers = window.getManualVouchers
                ? window.getManualVouchers()
                : JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
            const waybills = JSON.parse(sessionStorage.getItem("BizWaybills") || "[]");
            const waybillMap = new Map();
            waybills.forEach((wb) => {
                if (wb && wb.id) waybillMap.set(wb.id, wb);
                if (wb && wb.orderNo) waybillMap.set(wb.orderNo, wb);
            });
            const subjectMap = buildSubjectMap();
            const projectFilter = parseProjectFilter(filters.project || "");
            const dateStart = parseDateOnly(filters.startDate);
            const dateEnd = parseDateOnly(filters.endDate);
            const search = (filters.search || "").trim().toLowerCase();
            const statusMode = filters.status || "audited";
            const statusSet = new Set();
            if (statusMode === "posted") {
                statusSet.add("已记账");
                statusSet.add("已过账");
            } else if (statusMode === "all") {
                // no filter
            } else {
                statusSet.add("已审核");
                statusSet.add("已记账");
                statusSet.add("已过账");
            }

            const bucket = new Map();
            const usedVouchers = new Set();
            let lineCount = 0;
            const stats = {
                excludedByStatus: 0,
                excludedByDate: 0,
                missingWaybill: 0
            };

            vouchers.forEach(voucher => {
                if (!voucher) return;
                const statusOk = !statusSet.size || statusSet.has(voucher.status || "待审核");
                let dateOk = true;
                if (dateStart || dateEnd) {
                    const vDate = parseDateOnly(voucher.date);
                    dateOk = !!vDate;
                    if (dateOk && dateStart && vDate < dateStart) dateOk = false;
                    if (dateOk && dateEnd && vDate > dateEnd) dateOk = false;
                }
                const waybillIds = getVoucherWaybillIds(voucher);
                const lines = Array.isArray(voucher.lines) && voucher.lines.length
                    ? voucher.lines
                    : [];
                const eligibleLines = [];
                lines.forEach(line => {
                    if (!matchesProject(line || {}, projectFilter)) return;
                    const category = classifyLine(line || {}, subjectMap);
                    if (!category) return;
                    const debit = parseNumber(line.debit);
                    const credit = parseNumber(line.credit);
                    let amount = 0;
                    if (category === "income") {
                        if (credit > 0 && debit === 0) amount = credit;
                        else if (debit > 0 && credit === 0) amount = debit;
                        else amount = credit - debit;
                    }
                    if (category === "cost") {
                        if (debit > 0 && credit === 0) amount = debit;
                        else if (credit > 0 && debit === 0) amount = credit;
                        else amount = debit - credit;
                    }
                    if (!amount) return;
                    eligibleLines.push({ line, category, amount });
                });
                if (!eligibleLines.length) return;
                if (!waybillIds.length) {
                    stats.missingWaybill += 1;
                    return;
                }
                if (!statusOk) {
                    stats.excludedByStatus += 1;
                    return;
                }
                if (!dateOk) {
                    stats.excludedByDate += 1;
                    return;
                }
                const shareCount = waybillIds.length;
                eligibleLines.forEach(item => {
                    const share = item.amount / shareCount;
                    waybillIds.forEach(id => {
                        const wb = waybillMap.get(id) || {};
                        const plate = wb.plate || wb.vehicleNo || "-";
                        const origin = wb.origin || wb.from || "";
                        const destination = wb.destination || wb.to || "";
                        const route = origin && destination ? `${origin} -> ${destination}` : (wb.route || "-");
                        const key = `${plate}||${route}`;
                        const existing = bucket.get(key) || {
                            plate,
                            route,
                            income: 0,
                            cost: 0,
                            waybillIds: new Set(),
                            drivers: new Set()
                        };
                        if (item.category === "income") existing.income += share;
                        if (item.category === "cost") existing.cost += share;
                        if (id) existing.waybillIds.add(id);
                        if (wb.driver) existing.drivers.add(wb.driver);
                        if (wb.driverName) existing.drivers.add(wb.driverName);
                        bucket.set(key, existing);
                    });
                    usedVouchers.add(voucher.id);
                    lineCount += 1;
                });
            });

            let rows = Array.from(bucket.values()).map(row => {
                const income = row.income;
                const cost = row.cost;
                const profit = income - cost;
                const margin = income ? profit / income : 0;
                return {
                    plate: row.plate,
                    route: row.route,
                    income,
                    cost,
                    profit,
                    margin,
                    waybillIds: Array.from(row.waybillIds),
                    driver: Array.from(row.drivers).join(" / ")
                };
            });

            if (search) {
                rows = rows.filter(row => {
                    const hay = [
                        row.plate,
                        row.route,
                        row.driver,
                        row.waybillIds.join(" ")
                    ].join(" ").toLowerCase();
                    return hay.includes(search);
                });
            }

            const sortKey = filters.sort || "profitDesc";
            const sorters = {
                profitDesc: (a, b) => b.profit - a.profit,
                marginDesc: (a, b) => b.margin - a.margin,
                incomeDesc: (a, b) => b.income - a.income,
                costDesc: (a, b) => b.cost - a.cost,
                waybillDesc: (a, b) => b.waybillIds.length - a.waybillIds.length
            };
            rows.sort(sorters[sortKey] || sorters.profitDesc);

            const totals = rows.reduce((acc, row) => {
                acc.income += row.income;
                acc.cost += row.cost;
                acc.profit += row.profit;
                row.waybillIds.forEach(id => acc.waybillSet.add(id));
                return acc;
            }, { income: 0, cost: 0, profit: 0, waybillSet: new Set() });

            totals.margin = totals.income ? totals.profit / totals.income : 0;

            return {
                rows,
                totals: {
                    income: totals.income,
                    cost: totals.cost,
                    profit: totals.profit,
                    margin: totals.margin,
                    waybillCount: totals.waybillSet.size,
                    vehicleCount: rows.length
                },
                meta: {
                    voucherCount: usedVouchers.size,
                    lineCount,
                    stats
                },
                projectFilter
            };
        };

        const projectList = getProjectList();
        const defaultProject = getDefaultProjectValue(projectList);
        if (!window._vehicleProfitFilters) {
            window._vehicleProfitFilters = {
                project: defaultProject,
                startDate: "",
                endDate: "",
                search: "",
                sort: "profitDesc",
                status: "all"
            };
        }
        if (!window._vehicleProfitFilters.project && defaultProject) {
            window._vehicleProfitFilters.project = defaultProject;
        }

        window.applyVehicleProfitFilters = function () {
            const project = document.getElementById("vehicle-profit-project")?.value || "";
            const startDate = document.getElementById("vehicle-profit-start")?.value || "";
            const endDate = document.getElementById("vehicle-profit-end")?.value || "";
            const search = document.getElementById("vehicle-profit-search")?.value || "";
            const sort = document.getElementById("vehicle-profit-sort")?.value || "profitDesc";
            const status = document.getElementById("vehicle-profit-status")?.value || "audited";
            window._vehicleProfitFilters = { project, startDate, endDate, search, sort, status };
            loadContent("ReportVehicleProfit");
        };

        window.resetVehicleProfitFilters = function () {
            window._vehicleProfitFilters = {
                project: defaultProject,
                startDate: "",
                endDate: "",
                search: "",
                sort: "profitDesc",
                status: "all"
            };
            loadContent("ReportVehicleProfit");
        };

        const filters = window._vehicleProfitFilters || {};
        const report = buildVehicleProfitData(filters);
        const projectDisplay = report.projectFilter
            ? [report.projectFilter.code, report.projectFilter.name].filter(Boolean).join(" ")
            : "全部项目";
        const projectOptions = [
            `<option value="all" ${filters.project === "all" ? "selected" : ""}>全部项目</option>`,
            ...projectList.map(item => {
                const value = `${item.code}|||${item.name}`;
                const selected = filters.project === value ? "selected" : "";
                return `<option value="${value}" ${selected}>${item.code} ${item.name}</option>`;
            })
        ].join("");

        const renderWaybillTags = (list) => {
            if (!list || list.length === 0) return `<span class="waybill-tag is-empty">-</span>`;
            const max = 3;
            const shown = list.slice(0, max).map(id => `<span class="waybill-tag">${id}</span>`).join("");
            if (list.length <= max) return shown;
            return `${shown}<span class="waybill-tag is-more">+${list.length - max}</span>`;
        };

        const rowsHtml = report.rows.map((row, index) => {
            const profitClass = row.profit >= 0 ? "profit-positive" : "profit-negative";
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${row.plate || "-"}</td>
                    <td>${row.route || "-"}</td>
                    <td style="text-align:right;">${row.waybillIds.length}</td>
                    <td class="amount-cell">${formatMoney(row.income)}</td>
                    <td class="amount-cell">${formatMoney(row.cost)}</td>
                    <td class="amount-cell ${profitClass}">${formatMoney(row.profit)}</td>
                    <td class="amount-cell">${formatPercent(row.margin)}</td>
                    <td><div class="report-vehicle-profit__waybills">${renderWaybillTags(row.waybillIds)}</div></td>
                </tr>
            `;
        }).join("") || `<tr><td colspan="9" style="text-align:center; padding:20px; color:#94a3b8;">暂无符合条件的数据</td></tr>`;

        contentHTML += `
            <div class="report-vehicle-profit">
                <div class="report-vehicle-profit__header">
                    <div>
                        <h2>单车盈亏报表</h2>
                        <div class="report-vehicle-profit__subtitle">按车辆 + 线路聚合，基于凭证辅助核算和关联运单生成</div>
                    </div>
                    <div class="report-vehicle-profit__header-actions">
                        <button class="btn-primary btn-ghost" onclick="loadContent('FinanceVoucherAudit')">查看凭证</button>
                    </div>
                </div>

                <div class="report-vehicle-profit__filters">
                    <div class="filter-item">
                        <label>核算项目</label>
                        <select id="vehicle-profit-project">${projectOptions}</select>
                    </div>
                    <div class="filter-item">
                        <label>凭证日期 (起)</label>
                        <input id="vehicle-profit-start" type="date" value="${filters.startDate || ""}">
                    </div>
                    <div class="filter-item">
                        <label>凭证日期 (止)</label>
                        <input id="vehicle-profit-end" type="date" value="${filters.endDate || ""}">
                    </div>
                    <div class="filter-item">
                        <label>模糊筛选</label>
                        <input id="vehicle-profit-search" type="text" placeholder="车牌 / 线路 / 运单号" value="${filters.search || ""}">
                    </div>
                    <div class="filter-item">
                        <label>排序</label>
                        <select id="vehicle-profit-sort">
                            <option value="profitDesc" ${filters.sort === "profitDesc" ? "selected" : ""}>毛利降序</option>
                            <option value="marginDesc" ${filters.sort === "marginDesc" ? "selected" : ""}>毛利率降序</option>
                            <option value="incomeDesc" ${filters.sort === "incomeDesc" ? "selected" : ""}>收入降序</option>
                            <option value="costDesc" ${filters.sort === "costDesc" ? "selected" : ""}>成本降序</option>
                            <option value="waybillDesc" ${filters.sort === "waybillDesc" ? "selected" : ""}>运单数降序</option>
                        </select>
                    </div>
                    <div class="filter-item">
                        <label>凭证状态</label>
                        <select id="vehicle-profit-status">
                            <option value="audited" ${filters.status === "audited" ? "selected" : ""}>已审核/已记账</option>
                            <option value="posted" ${filters.status === "posted" ? "selected" : ""}>仅已记账</option>
                            <option value="all" ${filters.status === "all" ? "selected" : ""}>全部状态</option>
                        </select>
                    </div>
                    <div class="report-vehicle-profit__actions">
                        <button class="btn-primary" onclick="applyVehicleProfitFilters()">生成分析</button>
                        <button class="btn-primary btn-ghost" onclick="resetVehicleProfitFilters()">重置</button>
                    </div>
                </div>

                <div class="report-vehicle-profit__kpis">
                    <div class="kpi-card report-vehicle-profit__kpi">
                        <div class="kpi-title">当前项目</div>
                        <div class="kpi-value" style="font-size:20px; color:#1f2937;">${projectDisplay || "-"}</div>
                        <div class="kpi-trend">涉及凭证 ${report.meta.voucherCount} 张</div>
                    </div>
                    <div class="kpi-card report-vehicle-profit__kpi">
                        <div class="kpi-title">总收入</div>
                        <div class="kpi-value">${formatMoney(report.totals.income)}</div>
                        <div class="kpi-trend">运单数 ${report.totals.waybillCount}</div>
                    </div>
                    <div class="kpi-card report-vehicle-profit__kpi">
                        <div class="kpi-title">总成本</div>
                        <div class="kpi-value" style="color:#ef4444;">${formatMoney(report.totals.cost)}</div>
                        <div class="kpi-trend">车辆/线路 ${report.totals.vehicleCount} 条</div>
                    </div>
                    <div class="kpi-card report-vehicle-profit__kpi">
                        <div class="kpi-title">总毛利</div>
                        <div class="kpi-value" style="color:${report.totals.profit >= 0 ? "#16a34a" : "#dc2626"};">${formatMoney(report.totals.profit)}</div>
                        <div class="kpi-trend">毛利率 ${formatPercent(report.totals.margin)}</div>
                    </div>
                </div>

                <div class="report-vehicle-profit__table">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width:60px;">序号</th>
                                <th style="width:140px;">车牌</th>
                                <th>线路</th>
                                <th style="width:100px; text-align:right;">运单数</th>
                                <th style="text-align:right;">收入 (RMB)</th>
                                <th style="text-align:right;">成本 (RMB)</th>
                                <th style="text-align:right;">毛利 (RMB)</th>
                                <th style="text-align:right;">毛利率</th>
                                <th style="width:240px;">关联运单</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="4">合计</td>
                                <td class="amount-cell">${formatMoney(report.totals.income)}</td>
                                <td class="amount-cell">${formatMoney(report.totals.cost)}</td>
                                <td class="amount-cell">${formatMoney(report.totals.profit)}</td>
                                <td class="amount-cell">${formatPercent(report.totals.margin)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="report-vehicle-profit__note">
                    数据来自凭证审核中心，按辅助核算项目筛选并汇总到关联运单。当前覆盖分录 ${report.meta.lineCount} 行。
                    ${report.meta.stats && (report.meta.stats.excludedByStatus || report.meta.stats.excludedByDate || report.meta.stats.missingWaybill)
                        ? `<span style="margin-left:8px; color:#dc2626;">提示：有 ${report.meta.stats.excludedByStatus} 张凭证未满足状态筛选，${report.meta.stats.excludedByDate} 张不在日期范围，${report.meta.stats.missingWaybill} 张缺少运单关联。</span>`
                        : ""
                    }
                </div>
            </div>
        `;
    }
    // =========================================================================
    // 50. 客户毛利分析 (ReportCustomerProfit)
    // =========================================================================
    else if (moduleCode === "ReportCustomerProfit") {
        contentHTML += `
                    <h2>客户毛利分析 👥</h2>
                    <p style="color: #7f8c8d;">按客户维度分析收入贡献、服务成本和毛利，识别高价值客户和低效服务项目。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">报告期间</option>
                                <option>2025年11月</option>
                                <option>2025年Q4</option>
                            </select>
                            <input type="text" placeholder="客户名称 / 客户组" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">毛利率范围</option>
                                <option>低于 10%</option>
                                <option>高于 30%</option>
                            </select>
                            <button class="btn-primary" style="background-color: #3498db;">生成分析</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">导出 Excel</button>
                        <button class="btn-primary" style="background-color: #f39c12;">查看毛利图谱</button>
                    </div>

                    <h3>客户毛利明细 (2025年11月)</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>客户名称</th>
                                <th style="text-align: right;">收入总额 (RMB)</th>
                                <th style="text-align: right;">总服务成本 (RMB)</th>
                                <th style="text-align: right;">毛利 (RMB)</th>
                                <th style="text-align: right;">毛利率 (%)</th>
                                <th>订单数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>A. 电子科技集团</td>
                                <td style="text-align: right;">500,000.00</td>
                                <td style="text-align: right;">300,000.00</td>
                                <td style="text-align: right;">200,000.00</td>
                                <td style="text-align: right;"><strong style="color: #27ae60;">40.0%</strong></td>
                                <td>150</td>
                            </tr>
                            <tr>
                                <td>B. 传统制造有限公司</td>
                                <td style="text-align: right;">120,000.00</td>
                                <td style="text-align: right;">115,000.00</td>
                                <td style="text-align: right;"><span style="color: #e74c3c;">5,000.00</span></td>
                                <td style="text-align: right;"><strong style="color: #e74c3c;">4.2%</strong></td>
                                <td>60</td>
                            </tr>
                            <tr>
                                <td>**客户总计**</td>
                                <td style="text-align: right; font-weight: bold;">4,500,000.00</td>
                                <td style="text-align: right; font-weight: bold;">3,000,000.00</td>
                                <td style="text-align: right; font-weight: bold; color: #2980b9;">1,500,000.00</td>
                                <td style="text-align: right; font-weight: bold; color: #2980b9;">33.3%</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }
    // =========================================================================
    // 51. 应收应付账龄分析 (ReportARAPAge)
    // =========================================================================
    else if (moduleCode === "ReportARAPAge") {
        contentHTML += `
                    <h2>应收应付账龄分析 ⏳</h2>
                    <p style="color: #7f8c8d;">分析应收/应付账款的账期分布，评估资金周转和坏账风险。按客户/供应商进行明细划分。</p>
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">分析对象</option>
                                <option>应收账款 (A/R)</option>
                                <option>应付账款 (A/P)</option>
                            </select>
                            <input type="date" placeholder="截止日期" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 150px;">
                            <button class="btn-primary" style="background-color: #3498db;">生成分析</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;">导出 Excel</button>
                        <button class="btn-primary" style="background-color: #34495e;">查看账龄图表</button>
                    </div>

                    <h3>应收账款账龄分布 (截止 2025-11-30)</h3>
                    <table class="data-table">
                        <thead>
                            <tr style="background-color: #ecf0f1;">
                                <th>客户/供应商</th>
                                <th style="text-align: right;">总余额 (RMB)</th>
                                <th style="text-align: right;">< 30天 (RMB)</th>
                                <th style="text-align: right;">30-90天 (RMB)</th>
                                <th style="text-align: right;">91-180天 (RMB)</th>
                                <th style="text-align: right;">> 180天 (RMB)</th>
                                <th>催收状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>客户 C - 华南分部</td>
                                <td style="text-align: right;">250,000.00</td>
                                <td style="text-align: right;">180,000.00</td>
                                <td style="text-align: right;">50,000.00</td>
                                <td style="text-align: right;">15,000.00</td>
                                <td style="text-align: right;"><strong style="color: #e74c3c;">5,000.00</strong></td>
                                <td>需催收</td>
                            </tr>
                            <tr>
                                <td>客户 D - 华东分部</td>
                                <td style="text-align: right;">80,000.00</td>
                                <td style="text-align: right;">80,000.00</td>
                                <td style="text-align: right;">0.00</td>
                                <td style="text-align: right;">0.00</td>
                                <td style="text-align: right;">0.00</td>
                                <td>正常</td>
                            </tr>
                            <tr>
                                <td>**总计**</td>
                                <td style="text-align: right; font-weight: bold;">5,000,000.00</td>
                                <td style="text-align: right; font-weight: bold;">3,500,000.00</td>
                                <td style="text-align: right; font-weight: bold;">1,000,000.00</td>
                                <td style="text-align: right; font-weight: bold;">350,000.00</td>
                                <td style="text-align: right; font-weight: bold; color: #e74c3c;">150,000.00</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 40. 科目明细账 (AcctSubjectDetail) - [修复版：智能识别借贷方向]
    // =========================================================================
    else if (moduleCode === "AcctSubjectDetail") {
        const targetCode = sessionStorage.getItem("CurrentSubjectCode") || "1002";
        const targetName =
            sessionStorage.getItem("CurrentSubjectName") || "银行存款";
        const vouchers = JSON.parse(
            sessionStorage.getItem("ManualVouchers") || "[]"
        );

        // 1. ★★★ 核心修复：定义科目的“默认方向” ★★★
        // 资产/成本/费用类 (1xxx, 5xxx, 6xxx) -> 默认 "借"
        // 负债/权益/收入类 (2xxx, 3xxx, 4xxx) -> 默认 "贷"
        const firstDigit = targetCode.charAt(0);
        const defaultDir = ["2", "3", "4", "60"].some((prefix) =>
            targetCode.startsWith(prefix)
        )
            ? "贷"
            : "借";

        // 2. 设置期初余额 (模拟)
        // 假设：银行存款有期初，应付账款期初为0
        let currentBalance = targetCode === "1002" ? 800000 : 0;

        // 3. 生成“期初余额”行
        // 如果余额为0，方向显示“平”，否则显示默认方向
        const startDirText = currentBalance === 0 ? "平" : defaultDir;

        let tableHTML = `
                    <tr style="background-color:#fdfdfd; color:#999;">
                        <td>2025-11-01</td>
                        <td>-</td>
                        <td>期初余额</td>
                        <td>-</td>
                        <td>-</td>
                        <td>${startDirText}</td>
                        <td style="text-align:right;">${currentBalance.toLocaleString(
            "en-US",
            { minimumFractionDigits: 2 }
        )}</td>
                    </tr>
                `;

        // 4. 遍历凭证计算
        const sortedVouchers = [...vouchers].reverse(); // 按时间顺序

        sortedVouchers.forEach((v) => {
            if (v.status === "已审核" || v.status === "已记账") {
                if (v.lines) {
                    v.lines.forEach((line) => {
                        if (line.account.startsWith(targetCode)) {
                            const debit = parseFloat(line.debit) || 0;
                            const credit = parseFloat(line.credit) || 0;

                            // ★★★ 核心修复：根据方向计算余额 ★★★
                            if (defaultDir === "借") {
                                // 资产类：余额 = 上次余额 + 借 - 贷
                                currentBalance = currentBalance + debit - credit;
                            } else {
                                // 负债类(如应付账款)：余额 = 上次余额 + 贷 - 借
                                currentBalance = currentBalance + credit - debit;
                            }

                            // 计算当前行的方向文字
                            let dirText = "平";
                            if (currentBalance > 0) dirText = defaultDir; // 还是欠钱/有钱
                            else if (currentBalance < 0)
                                dirText = defaultDir === "借" ? "贷" : "借"; // 变成反方向了(比如银行透支)

                            tableHTML += `
                                        <tr>
                                            <td>${v.date}</td>
                                            <td><a href="#" onclick="openVoucherDetail(this)" class="val-id" style="color:#3498db;">${v.id
                                }</a></td>
                                            <td>${line.summary}</td>
                                            <td style="text-align:right;">${debit
                                    ? debit.toLocaleString(
                                        "en-US",
                                        { minimumFractionDigits: 2 }
                                    )
                                    : ""
                                }</td>
                                            <td style="text-align:right;">${credit
                                    ? credit.toLocaleString(
                                        "en-US",
                                        { minimumFractionDigits: 2 }
                                    )
                                    : ""
                                }</td>
                                            <td>${dirText}</td>
                                            <td style="text-align:right; font-weight:bold;">${Math.abs(
                                    currentBalance
                                ).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                })}</td>
                                        </tr>
                                    `;
                        }
                    });
                }
            }
        });

        contentHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                        <h2>科目明细账：<span style="color:#2980b9;">${targetCode} ${targetName}</span></h2>
                        <button class="btn-primary" style="background-color: #95a5a6;" onclick="loadContent('AcctSubjectSummary')"> < 返回汇总表</button>
                    </div>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items:center;">
                            <input type="date" value="2025-11-01" style="padding:8px; border:1px solid #ccc;">
                            <span>至</span>
                            <input type="date" value="2025-11-30" style="padding:8px; border:1px solid #ccc;">
                            <input type="text" placeholder="摘要关键词" style="padding:8px; border:1px solid #ccc;">
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>日期</th>
                                <th>凭证号</th>
                                <th style="width:30%;">摘要</th>
                                <th style="text-align:right;">借方金额</th>
                                <th style="text-align:right;">贷方金额</th>
                                <th>方向</th>
                                <th style="text-align:right;">余额</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableHTML}
                        </tbody>
                    </table>
                    
                    <div style="margin-top:10px; font-size:12px; color:#7f8c8d;">
                        * 注：${targetCode} 属于 <strong>${defaultDir}方科目</strong>，${defaultDir === "借"
                ? "借方表示增加，贷方表示减少"
                : "贷方表示增加，借方表示减少"
            }。
                    </div>
                `;
    }

    // =========================================================================
    // 50. 员工花名册 (HREmployee) - [人员基础库]
    // =========================================================================
    else if (moduleCode === "HREmployee") {
        // 1. 读取员工数据
        let employees = JSON.parse(sessionStorage.getItem("HREmployees"));
        if (!employees) {
            employees = [
                {
                    id: "EMP001",
                    name: "张三",
                    dept: "运输部",
                    position: "车队长",
                    bankAccount: "6222021001...",
                    status: "在职",
                    salaryBase: 5000,
                },
                {
                    id: "EMP002",
                    name: "李四",
                    dept: "财务部",
                    position: "会计",
                    bankAccount: "6222021002...",
                    status: "在职",
                    salaryBase: 8000,
                },
                {
                    id: "EMP003",
                    name: "王五",
                    dept: "销售部",
                    position: "销售经理",
                    bankAccount: "6222021003...",
                    status: "离职",
                    salaryBase: 0,
                },
            ];
            sessionStorage.setItem("HREmployees", JSON.stringify(employees));
        }

        const rows = employees
            .map(
                (e) => `
                    <tr style="${e.status === "离职"
                        ? "color:#999; background:#f5f5f5;"
                        : ""
                    }">
                        <td>${e.id}</td>
                        <td><strong>${e.name}</strong></td>
                        <td>${e.dept}</td>
                        <td>${e.position}</td>
                        <td>${e.bankAccount}</td>
                        <td><span style="color:${e.status === "在职" ? "#27ae60" : "#999"
                    }">${e.status}</span></td>
                        <td>
                            <a href="javascript:void(0)" onclick="editEmployee('${e.id
                    }')" style="color:#3498db;">编辑</a>
                        </td>
                    </tr>
                `
            )
            .join("");

        contentHTML += `
                    <h2>员工花名册 </h2>
                    <p style="color: #7f8c8d;">维护公司全员档案。财务发工资、报销打款时，将直接调用此处的【银行卡号】。</p>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;" onclick="addEmployee()">+ 新增员工</button>
                        <button class="btn-primary" style="background-color: #3498db;">同步钉钉/企微数据</button>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>工号</th>
                                <th>姓名</th>
                                <th>部门</th>
                                <th>职位</th>
                                <th>银行卡号 (发薪用)</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 51. 薪酬核算与发放 (HRSalary) - [与财务核心联动]
    // =========================================================================
    else if (moduleCode === "HRSalary") {
        // 1. 读取薪资单
        let payrolls = JSON.parse(sessionStorage.getItem("HRPayrolls") || "[]");

        const rows = payrolls
            .map((p) => {
                let statusHtml = "";
                let actionHtml = "";

                if (p.status === "待发放") {
                    statusHtml = `<span style="color: #f39c12; font-weight:bold;">待发放</span>`;
                    // ★★★ 核心联动按钮：点击后调用财务发钱 ★★★
                    actionHtml = `<button class="btn-primary" style="padding:4px 10px;" onclick="paySalary('${p.id}')">执行发薪</button>`;
                } else {
                    statusHtml = `<span style="color: #27ae60; font-weight:bold;">已发放</span>`;
                    actionHtml = `<span style="color:#ccc">凭证: ${p.voucherId || "-"
                        }</span>`;
                }

                return `
                <tr>
                    <td>${p.period}</td>
                    <td>${p.dept}</td>
                    <td>
                        <a href="javascript:void(0)" onclick="viewPayrollDetail('${p.id}')" style="color:#3498db; font-weight:bold;">
                            ${p.count} 人 (查看明细)
                        </a>
                    </td>
                    <td style="text-align:right; font-weight:bold;">${p.totalAmount}</td>
                    <td>${statusHtml}</td>
                    <td>${actionHtml}</td>
                </tr>
            `;
            })
            .join("");

        contentHTML += `
                    <h2>薪酬核算与发放</h2>
                    <p style="color: #7f8c8d;">每月核算各部门工资。点击“执行发薪”将自动调用资金模块进行打款，并生成财务凭证。</p>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;" onclick="createMonthlyPayroll()">+ 核算本月工资</button>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>工资月份</th>
                                <th>部门</th>
                                <th>发薪人数</th>
                                <th style="text-align:right;">实发总额 (RMB)</th>
                                <th>状态</th>
                                <th>操作 (财务联动)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.length > 0
                ? rows
                : '<tr><td colspan="6" style="text-align:center; padding:20px; color:#ccc;">暂无工资单</td></tr>'
            }
                        </tbody>
                    </table>
                `;
    }

    // =========================================================================
    // 52. 薪资明细详情页 (HRSalaryDetail) - [修复版：补全 fmt 函数定义]
    // =========================================================================
    else if (moduleCode === "HRSalaryDetail") {
        const payroll = window.g_currentPayrollView || { period: "-", details: [] };

        // ★★★★★ 核心修复点：必须先定义这两个函数，下面才能用！ ★★★★★
        // v(val): 如果数据是空的(undefined)，就当成 0 处理
        const v = (val) => (typeof val === "number" ? val : 0);

        // fmt(val): 把数字变成 "1,234.56" 这种好看的格式
        const fmt = (val) =>
            v(val).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        // ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★

        const rows = payroll.details
            .map(
                (d, i) => `
                    <tr>
                        <td style="background:#fff; position:sticky; left:0; z-index:1; border-right:2px solid #eee;">
                            <strong>${d.name}</strong>
                        </td>
                        
                        <td style="color:#666;">${fmt(d.base)}</td>
                        <td style="color:#666;">${fmt(d.perfSalary)}</td>
                        <td style="color:#27ae60; font-weight:bold; background:#f9fff9;">${fmt(
                    d.gross
                )}</td>
                        
                        <td style="color:#999;">${fmt(d.ssBase)}</td>
                        <td style="color:#666;">${fmt(d.p_pension)}</td>
                        <td style="color:#666;">${fmt(d.p_med)}</td>
                        <td style="color:#666;">${fmt(d.p_unemp)}</td>
                        <td style="color:#999; background:#f0f5ff;">${fmt(
                    d.fundBase
                )}</td>
                        <td style="color:#1890ff; background:#f0f5ff; font-weight:bold;">${fmt(
                    d.p_fund
                )}</td>
                        <td style="color:#c0392b; font-weight:bold; background:#fff5f5;">-${fmt(
                    d.p_total
                )}</td>
                        
                        <td style="color:#999;">${fmt(d.taxable)}</td>
                        <td style="color:#c0392b; font-weight:bold;">-${fmt(
                    d.tax
                )}</td>
                        
                        <td style="background:#e6f7ff; font-weight:bold; color:#1890ff; font-size:15px; border-left:2px solid #1890ff; border-right:2px solid #1890ff;">
                            ${fmt(d.net)}
                        </td>
                        
                        <td style="border-left:2px solid #eee; color:#666;">${fmt(
                    d.c_pension
                )}</td>
                        <td style="color:#666;">${fmt(d.c_med)}</td>
                        <td style="color:#666;">${fmt(d.c_unemp)}</td>
                        <td style="color:#666;">${fmt(d.c_injury)}</td>
                        <td style="color:#666;">${fmt(d.c_birth)}</td>
                        <td style="color:#1890ff; font-weight:bold;">${fmt(
                    d.c_fund
                )}</td>
                        <td style="font-weight:bold; color:#555;">${fmt(
                    d.c_total
                )}</td>
                    </tr>
                `
            )
            .join("");

        // 统计行计算 (也加上防崩逻辑)
        const sumGross = payroll.details.reduce((a, b) => a + v(b.gross), 0);
        const sumDeduct = payroll.details.reduce(
            (a, b) => a + v(b.p_total) + v(b.tax),
            0
        );

        contentHTML += `
                    <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                        <div style="display:flex; gap:10px;">
                            <button class="btn-primary" style="background-color: #95a5a6;" onclick="loadContent('HRSalary')"> < 返回列表</button>
                            <h2>${payroll.period} 全员薪资核对表</h2>
                        </div>
                        <button class="btn-primary" style="background-color: #27ae60;">导出 Excel</button>
                    </div>

                    <div style="background:#fff; padding:15px; border:1px solid #ddd; border-radius:6px; margin-bottom:15px; display:flex; gap:40px; align-items:center;">
                        <div>
                            <span style="color:#666; font-size:12px;">应发总额</span><br>
                            <span style="font-size:18px; font-weight:bold; color:#27ae60;">${fmt(
            sumGross
        )}</span>
                        </div>
                        <div style="font-size:20px; color:#ddd;">-</div>
                        <div>
                            <span style="color:#666; font-size:12px;">个人扣款+个税</span><br>
                            <span style="font-size:18px; font-weight:bold; color:#e74c3c;">${fmt(
            sumDeduct
        )}</span>
                        </div>
                        <div style="font-size:20px; color:#ddd;">=</div>
                        <div>
                            <span style="color:#666; font-size:12px;">实发总额 (打卡)</span><br>
                            <span style="font-size:22px; font-weight:bold; color:#1890ff;">${payroll.totalAmount
            }</span>
                        </div>
                        <div style="margin-left:auto; text-align:right;">
                            <span style="color:#666; font-size:12px;">公司总成本</span><br>
                            <span style="font-size:16px; font-weight:bold; color:#555;">${payroll.totalCost
            }</span>
                        </div>
                    </div>

                    <div style="overflow-x: auto; white-space: nowrap; border: 1px solid #ccc; max-height: 600px; background:#fff;">
                        <table class="data-table" style="margin:0; border-collapse: collapse;">
                            <thead>
                                <tr style="background:#f7f9fa; color:#333;">
                                    <th rowspan="2" style="position:sticky; left:0; z-index:2; background:#f7f9fa; border-right:2px solid #ddd; min-width:80px;">姓名</th>
                                    <th colspan="3" style="text-align:center; border-bottom:3px solid #27ae60; color:#27ae60; background:#f0fdf4;">收入</th>
                                    <th colspan="7" style="text-align:center; border-bottom:3px solid #e74c3c; color:#e74c3c; background:#fff5f5;">个人代扣</th>
                                    <th colspan="2" style="text-align:center; border-bottom:3px solid #c0392b; color:#c0392b;">个税</th>
                                    <th rowspan="2" style="min-width:100px; background:#e6f7ff; color:#1890ff; border-left:2px solid #1890ff; border-right:2px solid #1890ff; text-align:center;">实发工资</th>
                                    <th colspan="7" style="text-align:center; border-bottom:3px solid #999; color:#666; background:#f5f5f5; border-left:2px solid #eee;">公司承担</th>
                                </tr>
                                <tr style="background:#f7f9fa; color:#555; font-size:13px;">
                                    <th style="min-width:80px; background:#f0fdf4;">基本工资</th>
                                    <th style="min-width:80px; background:#f0fdf4;">绩效工资</th>
                                    <th style="min-width:90px; background:#f0fdf4; color:#27ae60; font-weight:bold;">应发合计</th>
                                    
                                    <th style="min-width:80px; background:#fff5f5;">社保基数</th>
                                    <th style="background:#fff5f5;">养老</th>
                                    <th style="background:#fff5f5;">医疗</th>
                                    <th style="background:#fff5f5;">失业</th>
                                    <th style="min-width:80px; background:#fff5f5;">公积金基数</th>
                                    <th style="background:#fff5f5;">公积金</th>
                                    <th style="color:#e74c3c; background:#fff5f5; font-weight:bold;">扣款小计</th>
                                    
                                    <th>应纳税额</th>
                                    <th style="color:#c0392b; font-weight:bold;">个税</th>

                                    <th style="border-left:2px solid #eee; background:#f5f5f5;">养老</th>
                                    <th style="background:#f5f5f5;">医疗</th>
                                    <th style="background:#f5f5f5;">失业</th>
                                    <th style="background:#f5f5f5;">工伤</th>
                                    <th style="background:#f5f5f5;">生育</th>
                                    <th style="background:#f5f5f5;">公积金</th>
                                    <th style="background:#f5f5f5;">成本小计</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                `;
    }

    // =========================================================================
    // 53. 薪酬规则配置 (HRSalaryConfig) - [新增：社保/个税设置]
    // =========================================================================
    else if (moduleCode === "HRSalaryConfig") {
        // 1. 读取配置 (如果没有就读取默认值)
        // 这里的 initSocialSecurityConfig 来自 config.js
        if (typeof window.initSocialSecurityConfig === "function")
            window.initSocialSecurityConfig();
        const conf = JSON.parse(sessionStorage.getItem("HR_SS_Config"));

        // ... 在 HRSalaryConfig 模块内 ...

        contentHTML += `
                    <h2>薪酬规则配置  ⚙️</h2>
                    <p style="color: #7f8c8d;">设置企业社保公积金缴纳比例、基数上下限及个税起征点。</p>

                    <div style="background:white; padding:30px; border-radius:8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); max-width: 900px;">
                        
                        <h3 style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:20px; color:#2980b9;">1. 五险一金缴纳比例 (%)</h3>
                        <table class="data-table" style="margin-bottom:20px;">
                            <thead>
                                <tr>
                                    <th width="25%">险种</th>
                                    <th width="25%">个人承担比例</th>
                                    <th width="25%">公司承担比例</th>
                                    <th>说明</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>养老保险</td>
                                    <td><input type="number" id="conf-pension-pers" value="${conf.pension.pers * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td><input type="number" id="conf-pension-comp" value="${conf.pension.comp * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td style="color:#999; font-size:12px;"></td>
                                </tr>
                                <tr>
                                    <td>医疗保险</td>
                                    <td><input type="number" id="conf-medical-pers" value="${conf.medical.pers * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td><input type="number" id="conf-medical-comp" value="${conf.medical.comp * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td style="color:#999; font-size:12px;">含大病医保</td>
                                </tr>
                                <tr>
                                    <td>失业保险</td>
                                    <td><input type="number" id="conf-unemp-pers" value="${conf.unemp.pers * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td><input type="number" id="conf-unemp-comp" value="${conf.unemp.comp * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td style="color:#999; font-size:12px;"></td>
                                </tr>
                                <tr>
                                    <td>工伤保险</td>
                                    <td><input type="number" value="0" disabled style="width:60px; background:#f5f5f5; text-align:center; border:1px solid #ddd;"> %</td>
                                    <td><input type="number" id="conf-injury-comp" value="${conf.injury.comp * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td style="color:#999; font-size:12px;">个人无需缴纳</td>
                                </tr>
                                <tr>
                                    <td>生育保险</td>
                                    <td><input type="number" value="0" disabled style="width:60px; background:#f5f5f5; text-align:center; border:1px solid #ddd;"> %</td>
                                    <td><input type="number" id="conf-birth-comp" value="${conf.birth.comp * 100
            }" style="width:60px; text-align:center;"> %</td>
                                    <td style="color:#999; font-size:12px;">个人无需缴纳</td>
                                </tr>
                                <tr style="background-color:#e6f7ff;">
                                    <td>住房公积金</td>
                                    <td><input type="number" id="conf-fund-pers" value="${conf.fund.pers * 100
            }" style="width:60px; text-align:center; font-weight:bold;"> %</td>
                                    <td><input type="number" id="conf-fund-comp" value="${conf.fund.comp * 100
            }" style="width:60px; text-align:center; font-weight:bold;"> %</td>
                                    <td style="color:#1890ff; font-size:12px;">独立基数</td>
                                </tr>
                            </tbody>
                        </table>

                        <h3 style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:20px; color:#2980b9;">2. 缴纳基数范围 (上下限)</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom:30px;">
                            <div style="background:#f9f9f9; padding:15px; border-radius:4px;">
                                <h4 style="margin-top:0;">🅰️ 社保基数 (Social Security)</h4>
                                <div style="margin-bottom:10px;">
                                    <label>下限 (Floor):</label>
                                    <input type="number" id="conf-ss-min" value="${conf.limits.min
            }" style="width:100px; padding:5px;">
                                </div>
                                <div>
                                    <label>上限 (Ceiling):</label>
                                    <input type="number" id="conf-ss-max" value="${conf.limits.max
            }" style="width:100px; padding:5px;">
                                </div>
                            </div>
                            <div style="background:#e6f7ff; padding:15px; border-radius:4px;">
                                <h4 style="margin-top:0; color:#0050b3;">🅱️ 公积金基数 (Provident Fund)</h4>
                                <div style="margin-bottom:10px;">
                                    <label>下限 (Floor):</label>
                                    <input type="number" id="conf-fund-min" value="${conf.fundLimits
                ? conf.fundLimits.min
                : 2490
            }" style="width:100px; padding:5px;">
                                </div>
                                <div>
                                    <label>上限 (Ceiling):</label>
                                    <input type="number" id="conf-fund-max" value="${conf.fundLimits
                ? conf.fundLimits.max
                : 36549
            }" style="width:100px; padding:5px;">
                                </div>
                            </div>
                        </div>
                        
                        <h3 style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:20px; color:#2980b9;">3. 个税计算规则</h3>
                        <div style="margin-top:30px; text-align:center;">
                            <button class="btn-primary" style="background-color: #27ae60; padding: 10px 40px; font-size:16px;" onclick="saveHRConfig()">💾 保存配置</button>
                        </div>
                    </div>
                `;
    }

    // =========================================================================
    // 50-B. 员工档案编辑页 (HREmployeeEdit) - [新增：表单式编辑]
    // =========================================================================
    else if (moduleCode === "HREmployeeEdit") {
        const emp = window.g_currentEmployee || {};

        contentHTML += `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                        <h2>编辑员工档案：<span style="color:#2980b9;">${emp.name
            }</span></h2>
                        <button class="btn-primary" style="background-color: #95a5a6;" onclick="loadContent('HREmployee')"> < 返回列表</button>
                    </div>

                    <div style="background:white; padding:30px; border-radius:8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); max-width: 800px; margin: 0 auto;">
                        
                        <h3 style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:20px; color:#555;">👤 基础信息</h3>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">工号 (不可改)</label>
                                <input type="text" id="emp-id" value="${emp.id
            }" disabled style="width:100%; padding:8px; background:#f5f5f5; border:1px solid #ddd;">
                            </div>
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">姓名</label>
                                <input type="text" id="emp-name" value="${emp.name
            }" style="width:100%; padding:8px; border:1px solid #ccc;">
                            </div>
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">部门</label>
                                <input type="text" id="emp-dept" value="${emp.dept
            }" style="width:100%; padding:8px; border:1px solid #ccc;">
                            </div>
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">职位</label>
                                <input type="text" id="emp-pos" value="${emp.position
            }" style="width:100%; padding:8px; border:1px solid #ccc;">
                            </div>
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">入职日期</label>
                                <input type="date" value="${emp.joinDate || ""
            }" disabled style="width:100%; padding:8px; background:#f5f5f5; border:1px solid #ddd;">
                            </div>
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">在职状态</label>
                                <select id="emp-status" style="width:100%; padding:8px; border:1px solid #ccc;">
                                    <option value="在职" ${emp.status === "在职" ? "selected" : ""
            }>在职</option>
                                    <option value="离职" ${emp.status === "离职" ? "selected" : ""
            }>离职</option>
                                    <option value="休假" ${emp.status === "休假" ? "selected" : ""
            }>休假</option>
                                </select>
                            </div>
                        </div>

                        <h3 style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:20px; color:#555;">💰 财务与薪酬 (敏感信息)</h3>
                        <div style="margin-bottom: 20px;">
                            <label style="display:block; color:#666; margin-bottom:5px;">银行卡号 (发薪/报销用)</label>
                            <input type="text" id="emp-bank" value="${emp.bankAccount
            }" style="width:100%; padding:8px; border:1px solid #ccc; background:#fffbe6;">
                        </div>

                        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">基本工资 (固定)</label>
                                <input type="number" id="emp-salary-base" value="${emp.salaryBase
            }" style="width:100%; padding:8px; border:1px solid #ccc; font-weight:bold;">
                            </div>
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">绩效基数 (浮动满分值)</label>
                                <input type="number" id="emp-salary-perf" value="${emp.salaryPerformance
            }" style="width:100%; padding:8px; border:1px solid #ccc;">
                                <div style="font-size:12px; color:#999; margin-top:3px;">* 实发 = 基数 × 考核系数</div>
                            </div>
                            <div>
                                <label style="display:block; color:#666; margin-bottom:5px;">社保缴纳基数</label>
                                <input type="number" id="emp-ss-base" value="${emp.socialSecurityBase
            }" style="width:100%; padding:8px; border:1px solid #ccc;">
                            </div>

                            <div>
                                <label style="display:block; color:#2980b9; font-weight:bold; margin-bottom:5px;">公积金基数</label>
                                <input type="number" id="emp-fund-base" value="${emp.providentFundBase !== undefined
                ? emp.providentFundBase
                : emp.socialSecurityBase
            }" style="width:100%; padding:8px; border:1px solid #2980b9; background:#e6f7ff;">
                                <div style="font-size:12px; color:#999; margin-top:3px;">* 可与社保基数不同</div>
                            </div>
                        </div>
                        <div style="margin-top: 40px; text-align: right; padding-top: 20px; border-top: 1px solid #eee;">
                            <button class="btn-primary" style="background-color: #e74c3c; float:left;" onclick="alert('删除功能暂略')">删除档案</button>
                            <button class="btn-primary" style="background-color: #95a5a6; margin-right:10px;" onclick="loadContent('HREmployee')">取消</button>
                            <button class="btn-primary" style="background-color: #27ae60; padding: 8px 30px;" onclick="saveEmployeeDetail()">💾 保存更改</button>
                        </div>
                    </div>
                `;
    }


    // =========================================================================
    // 54. 绩效考核 (HRPerformance) - [新增]
    // =========================================================================
    else if (moduleCode === "HRPerformance") {
        // 动态加载数据行
        const rows =
            typeof window.loadPerformanceData === "function"
                ? window.loadPerformanceData()
                : '<tr><td colspan="7">加载中...</td></tr>';

        contentHTML += `
                    <h2>绩效考核 📊</h2>
                    <p style="color: #7f8c8d;">录入员工月度考核分数。该分数将直接决定工资中的“绩效工资”实发金额。</p>

                    <div class="filter-area" style="background:white; padding:15px; margin-bottom:20px; border-radius:6px;">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <span style="font-weight:bold;">考核月份：</span>
                            <select id="kpi-month" style="padding:8px; border:1px solid #ccc; border-radius:4px;">
                                <option value="2025-11">2025年11月</option>
                                <option value="2025-10">2025年10月</option>
                            </select>
                            <button class="btn-primary" onclick="loadContent('HRPerformance')">刷新列表</button>
                        </div>
                    </div>

                    <div class="action-bar" style="margin-bottom: 15px; text-align:right;">
                        <button class="btn-primary" style="background-color: #f39c12;">导入 Excel 评分</button>
                        <button class="btn-primary" style="background-color: #27ae60; padding: 8px 30px;" onclick="savePerformance()">💾 保存考核结果</button>
                    </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>工号</th>
                                <th>姓名</th>
                                <th>部门</th>
                                <th>绩效基数 (RMB)</th>
                                <th style="width:100px;">本月得分</th>
                                <th>折算系数</th>
                                <th>实发绩效 (预览)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                    
                    <p style="font-size:12px; color:#999; margin-top:10px;">
                        * 说明：100分为标准系数1.0；低于100分按比例扣减；高于100分按 2% 累加奖励。
                    </p>
                `;
    }

    // =========================================================================
    // 55. 考勤管理 (HRAttendance) - [新增]
    // =========================================================================
    else if (moduleCode === "HRAttendance") {
        const rows =
            typeof window.loadAttendanceData === "function"
                ? window.loadAttendanceData()
                : "";

        contentHTML += `
                    <h2>考勤管理 📅</h2>
                    <p style="color: #7f8c8d;">录入员工月度请假和加班情况。事假/病假将扣款，加班将增加工资。</p>

                    <div class="filter-area" style="background:white; padding:15px; margin-bottom:20px; border-radius:6px;">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <span style="font-weight:bold;">考勤月份：</span>
                            <select id="att-month" style="padding:8px; border:1px solid #ccc; border-radius:4px;">
                                <option value="2025-11">2025年11月</option>
                                <option value="2025-10">2025年10月</option>
                            </select>
                            <button class="btn-primary" onclick="loadContent('HRAttendance')">刷新列表</button>
                        </div>
                    </div>

            
            <div class="action-bar" style="margin-bottom: 15px; text-align:right;">
                 <button class="btn-primary" style="background-color: #3498db;" onclick="importDingTalkData()">📂 导入钉钉考勤 Excel</button>
                 <button class="btn-primary" style="background-color: #27ae60; padding: 8px 30px;" onclick="saveAttendance()">💾 保存考勤记录</button>
            </div>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>工号</th>
                                <th>姓名</th>
                                <th>部门</th>
                                <th style="background:#fff1f0; color:#c0392b;">事假 (天)</th>
                                <th style="background:#fff7e6; color:#d46b08;">病假 (天)</th>
                                <th style="background:#f6ffed; color:#389e0d;">加班 (小时)</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                    
                    <p style="font-size:12px; color:#999; margin-top:10px;">
                        * 规则说明：月计薪天数按 21.75天 计算。<br>
                        * 事假扣除：日工资 × 天数；病假扣除：日工资 × 40% × 天数；加班费：时薪 × 1.5 × 小时数。
                    </p>
                `;
    }

    // =========================================================================
    // ★★★ [新增模块] 会计准则基础设置 (AccountingStandardSetting) ★★★
    // =========================================================================
    else if (moduleCode === "AccountingStandardSetting") {
        const { standard, locked } = getAccountingStandardState();
        const taxLocked = localStorage.getItem("TaxAccrualLocked") === "true";
        const subjectSetting = getSubjectCodeSetting();
        const summaryTemplates = getVoucherSummaryTemplates();
        const defaultIncomeTemplate = [
            { name: "一、营业总收入", codes: "6001,600110,6051", op: "+" },
            { name: "减：营业成本", codes: "6401,6402", op: "-" },
            { name: "营业税金及附加", codes: "640301", op: "-" },
            { name: "销售费用", codes: "6601", op: "-" },
            { name: "管理费用", codes: "6602", op: "-" },
            { name: "财务费用", codes: "6603", op: "-" },
            { name: "资产减值损失", codes: "6701", op: "-" },
            { name: "加：其他收益", codes: "", op: "+" },
            { name: "加：公允价值变动收益（损失以“-”号填列）", codes: "6101", op: "+" },
            { name: "投资收益（损失以“-”号填列）", codes: "6111", op: "+" },
            { name: "其中：对联营企业和合营企业的投资收益", codes: "", op: "+" },
            { name: "汇兑收益（损失以“-”号填列）", codes: "", op: "+" },
            { name: "二、营业利润（亏损以“-”号填列）", codes: "", op: "+" },
            { name: "加：营业外收入", codes: "6301", op: "+" },
            { name: "减：营业外支出", codes: "6711", op: "-" },
            { name: "其中：非流动资产处置损失", codes: "", op: "-" },
            { name: "三、利润总额（亏损总额以“-”号填列）", codes: "", op: "+" },
            { name: "减：所得税费用", codes: "6801", op: "-" },
            { name: "四、净利润（净亏损以“-”号填列）", codes: "", op: "+" },
            { name: "归属于公司所有者的净利润", codes: "", op: "+" },
            { name: "少数股东损益", codes: "", op: "+" },
            { name: "五、每股收益：", codes: "", op: "+" },
            { name: "（一）基本每股收益", codes: "", op: "+" },
            { name: "（二）稀释每股收益", codes: "", op: "+" }
        ];
        const defaultCashflowTemplate = [
            { name: "一、经营活动产生的现金流量", method: "自定义公式" },
            { name: "销售商品、提供劳务收到的现金", method: "自定义公式" },
            { name: "收到的税费返还", method: "自定义公式" },
            { name: "收到其他与经营活动有关的现金", method: "自定义公式" },
            { name: "经营活动现金流入小计", method: "自定义公式" },
            { name: "购买商品、接受劳务支付的现金", method: "自定义公式" },
            { name: "支付给职工以及为职工支付的现金", method: "自定义公式" },
            { name: "支付的各项税费", method: "自定义公式" },
            { name: "支付其他与经营活动有关的现金", method: "自定义公式" },
            { name: "经营活动现金流出小计", method: "自定义公式" },
            { name: "经营活动产生的现金流量净额", method: "自定义公式" },
            { name: "二、投资活动产生的现金流量", method: "自定义公式" },
            { name: "收回投资收到的现金", method: "自定义公式" },
            { name: "取得投资收益收到的现金", method: "自定义公式" },
            { name: "处置固定资产、无形资产和其他长期资产收回的现金净额", method: "自定义公式" },
            { name: "处置子公司及其他营业单位收到的现金净额", method: "自定义公式" },
            { name: "收到其他与投资活动有关的现金", method: "自定义公式" },
            { name: "投资活动现金流入小计", method: "自定义公式" },
            { name: "购建固定资产、无形资产和其他长期资产支付的现金", method: "自定义公式" },
            { name: "投资支付的现金", method: "自定义公式" },
            { name: "取得子公司及其他营业单位支付的现金净额", method: "自定义公式" },
            { name: "支付其他与投资活动有关的现金", method: "自定义公式" },
            { name: "投资活动现金流出小计", method: "自定义公式" },
            { name: "投资活动产生的现金流量净额", method: "自定义公式" },
            { name: "三、筹资活动产生的现金流量", method: "自定义公式" },
            { name: "吸收投资收到的现金", method: "自定义公式" },
            { name: "取得借款收到的现金", method: "自定义公式" },
            { name: "收到其他与筹资活动有关的现金", method: "自定义公式" },
            { name: "筹资活动现金流入小计", method: "自定义公式" },
            { name: "偿还债务支付的现金", method: "自定义公式" },
            { name: "分配股利、利润或偿付利息支付的现金", method: "自定义公式" },
            { name: "支付其他与筹资活动有关的现金", method: "自定义公式" },
            { name: "筹资活动现金流出小计", method: "自定义公式" },
            { name: "筹资活动产生的现金流量净额", method: "自定义公式" },
            { name: "四、汇率变动对现金及现金等价物的影响", method: "自定义公式" },
            { name: "五、现金及现金等价物净增加额", method: "自定义公式" },
            { name: "加：期初现金及现金等价物余额", method: "自定义公式" },
            { name: "六、期末现金及现金等价物余额", method: "自定义公式" }
        ];
        const defaultBalanceTemplate = [
            { name: "流动资产：", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "货币资金", type: "流动资产", codesA: "1001,1002,1012", opA: "+", codesB: "", opB: "+" },
            { name: "交易性金融资产", type: "流动资产", codesA: "1101", opA: "+", codesB: "", opB: "+" },
            { name: "应收票据", type: "流动资产", codesA: "1121", opA: "+", codesB: "", opB: "+" },
            { name: "应收账款", type: "流动资产", codesA: "1122", opA: "+", codesB: "", opB: "+" },
            { name: "预付款项", type: "流动资产", codesA: "1123", opA: "+", codesB: "", opB: "+" },
            { name: "应收利息", type: "流动资产", codesA: "1132", opA: "+", codesB: "", opB: "+" },
            { name: "应收股利", type: "流动资产", codesA: "1131", opA: "+", codesB: "", opB: "+" },
            { name: "其他应收款", type: "流动资产", codesA: "1221", opA: "+", codesB: "", opB: "+" },
            { name: "存货", type: "流动资产", codesA: "1403,1405", opA: "+", codesB: "", opB: "+" },
            { name: "一年内到期的非流动资产", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "其他流动资产", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "流动资产合计", type: "流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "非流动资产：", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期应收款", type: "非流动资产", codesA: "1531", opA: "+", codesB: "", opB: "+" },
            { name: "长期股权投资", type: "非流动资产", codesA: "1511", opA: "+", codesB: "", opB: "+" },
            { name: "投资性房地产", type: "非流动资产", codesA: "1521", opA: "+", codesB: "", opB: "+" },
            { name: "固定资产", type: "非流动资产", codesA: "1601", opA: "+", codesB: "", opB: "+" },
            { name: "在建工程", type: "非流动资产", codesA: "1604", opA: "+", codesB: "", opB: "+" },
            { name: "工程物资", type: "非流动资产", codesA: "1605", opA: "+", codesB: "", opB: "+" },
            { name: "固定资产清理", type: "非流动资产", codesA: "1606", opA: "+", codesB: "", opB: "+" },
            { name: "生产性生物资产", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "油气资产", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "无形资产", type: "非流动资产", codesA: "1701", opA: "+", codesB: "", opB: "+" },
            { name: "开发支出", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "商誉", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期待摊费用", type: "非流动资产", codesA: "1801", opA: "+", codesB: "", opB: "+" },
            { name: "递延所得税资产", type: "非流动资产", codesA: "1811", opA: "+", codesB: "", opB: "+" },
            { name: "其他非流动资产", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "非流动资产合计", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "资产总计", type: "非流动资产", codesA: "", opA: "+", codesB: "", opB: "+" },

            { name: "流动负债：", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "短期借款", type: "流动负债", codesA: "2001", opA: "+", codesB: "", opB: "+" },
            { name: "交易性金融负债", type: "流动负债", codesA: "2101", opA: "+", codesB: "", opB: "+" },
            { name: "应付票据", type: "流动负债", codesA: "2201", opA: "+", codesB: "", opB: "+" },
            { name: "应付账款", type: "流动负债", codesA: "2202", opA: "+", codesB: "", opB: "+" },
            { name: "预收款项", type: "流动负债", codesA: "2203", opA: "+", codesB: "", opB: "+" },
            { name: "应付职工薪酬", type: "流动负债", codesA: "2211", opA: "+", codesB: "", opB: "+" },
            { name: "应交税费", type: "流动负债", codesA: "2221", opA: "+", codesB: "", opB: "+" },
            { name: "应付利息", type: "流动负债", codesA: "2231", opA: "+", codesB: "", opB: "+" },
            { name: "应付股利", type: "流动负债", codesA: "2232", opA: "+", codesB: "", opB: "+" },
            { name: "其他应付款", type: "流动负债", codesA: "2241", opA: "+", codesB: "", opB: "+" },
            { name: "一年内到期的非流动负债", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "其他流动负债", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "流动负债合计", type: "流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "非流动负债：", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期借款", type: "非流动负债", codesA: "2501", opA: "+", codesB: "", opB: "+" },
            { name: "应付债券", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "长期应付款", type: "非流动负债", codesA: "2701", opA: "+", codesB: "", opB: "+" },
            { name: "专项应付款", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "预计负债", type: "非流动负债", codesA: "2801", opA: "+", codesB: "", opB: "+" },
            { name: "递延所得税负债", type: "非流动负债", codesA: "2901", opA: "+", codesB: "", opB: "+" },
            { name: "其他非流动负债", type: "非流动负债", codesA: "2401", opA: "+", codesB: "", opB: "+" },
            { name: "负债合计", type: "非流动负债", codesA: "", opA: "+", codesB: "", opB: "+" },

            { name: "所有者权益（或股东权益）：", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "实收资本（或股本）", type: "所有者权益", codesA: "4001", opA: "+", codesB: "", opB: "+" },
            { name: "资本公积", type: "所有者权益", codesA: "4002", opA: "+", codesB: "", opB: "+" },
            { name: "减：库存股", type: "所有者权益", codesA: "", opA: "-", codesB: "", opB: "+" },
            { name: "盈余公积", type: "所有者权益", codesA: "4101", opA: "+", codesB: "", opB: "+" },
            { name: "一般风险准备", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "未分配利润", type: "所有者权益", codesA: "4103,4104", opA: "+", codesB: "", opB: "+" },
            { name: "归属于母公司所有者权益合计", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "少数股东权益", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "所有者权益合计", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" },
            { name: "负债及所有者权益总计", type: "所有者权益", codesA: "", opA: "+", codesB: "", opB: "+" }
        ];
        const allSubjects = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]")
            .filter(item => item && item.status !== "停用")
            .sort((a, b) => (a.code || "").localeCompare(b.code || ""));
        const parseSubjectCodes = (value) => (value || "")
            .toString()
            .split(/[,，]/)
            .map(item => item.trim())
            .filter(Boolean);
        const renderSubjectMultiSelect = (value = "") => {
            const selected = new Set(parseSubjectCodes(value));
            const options = allSubjects.length
                ? allSubjects.map(item => `
                    <label class="subject-option">
                        <input type="checkbox" value="${item.code}" ${selected.has(item.code) ? "checked" : ""}>
                        <span class="code">${item.code}</span>
                        <span class="name">${item.name || ""}</span>
                    </label>
                `).join("")
                : `<div class="subject-multi-empty">暂无科目</div>`;
            return `
                <div class="subject-multi-select" onclick="openSubjectMultiSelect(event, this)">
                    <input type="text" class="subject-multi-input" readonly value="${value || ""}" placeholder="请选择科目">
                    <span class="subject-multi-arrow">▾</span>
                    <div class="subject-multi-panel" onclick="event.stopPropagation()">
                        <div class="subject-multi-header">
                            <span class="col-check"></span>
                            <span class="col-code">科目代码</span>
                            <span class="col-name">科目名称</span>
                        </div>
                        <div class="subject-multi-list">${options}</div>
                        <div class="subject-multi-actions">
                            <button class="btn-primary btn-ghost" onclick="confirmSubjectMultiSelect(this)">确定</button>
                            <button class="btn-primary btn-ghost" onclick="cancelSubjectMultiSelect(this)">取消</button>
                        </div>
                    </div>
                </div>
            `;
        };

        const renderSubjectSelect = (value = "", className = "", id = "", disabled = false) => {
            const selected = (value || "").toString().trim();
            const options = allSubjects.length
                ? allSubjects.map(item => {
                    const code = (item.code || "").toString().trim();
                    if (!code) return "";
                    const name = (item.name || "").toString().trim();
                    const label = name ? `${code} ${name}` : code;
                    const isSelected = code === selected ? "selected" : "";
                    return `<option value="${code}" ${isSelected}>${label}</option>`;
                }).join("")
                : `<option value="">暂无科目</option>`;
            const idAttr = id ? `id="${id}"` : "";
            const disabledAttr = disabled ? "disabled" : "";
            return `<select ${idAttr} class="${className}" ${disabledAttr}><option value="">-请选择-</option>${options}</select>`;
        };

        const TAX_ACCRUAL_RULE_KEY = "TaxAccrualRules";
        const loadTaxAccrualRules = () => {
            try {
                const stored = JSON.parse(sessionStorage.getItem(TAX_ACCRUAL_RULE_KEY) || "[]");
                if (Array.isArray(stored) && stored.length) return stored;
            } catch (error) {
                // ignore
            }
            return [
                {
                    taxName: "城市维护建设税",
                    baseCodes: "2221",
                    direction: "贷方发生额",
                    rate: "7",
                    debitCode: "640301",
                    creditCode: "2221",
                    aux: "部门"
                }
            ];
        };

        const buildTaxAccrualRow = (row = {}, index = 0) => `
            <tr data-index="${index}">
                <td><input type="text" class="tax-name-input" value="${row.taxName || ""}" placeholder="税种名称" ${taxLocked ? "disabled" : ""} oninput="refreshTaxAccrualPreview()"></td>
                <td>${taxLocked ? `<div style="pointer-events:none; opacity:0.6;">${renderSubjectMultiSelect(row.baseCodes || "")}</div>` : renderSubjectMultiSelect(row.baseCodes || "")}</td>
                <td>
                    <div class="tax-direction-group">
                        <label><input type="radio" name="tax-direction-${index}" value="贷方发生额" ${row.direction === "贷方发生额" ? "checked" : ""} ${taxLocked ? "disabled" : ""} onchange="refreshTaxAccrualPreview()">贷方发生额</label>
                        <label><input type="radio" name="tax-direction-${index}" value="贷方净额" ${row.direction === "贷方净额" ? "checked" : ""} ${taxLocked ? "disabled" : ""} onchange="refreshTaxAccrualPreview()">贷方净额</label>
                    </div>
                </td>
                <td><input type="number" min="0" step="0.01" value="${row.rate || ""}" placeholder="%" ${taxLocked ? "disabled" : ""} oninput="refreshTaxAccrualPreview()"></td>
                <td>${renderSubjectSelect(row.debitCode || "", "tax-debit-select", "", taxLocked)}</td>
                <td>${renderSubjectSelect(row.creditCode || "", "tax-credit-select", "", taxLocked)}</td>
                <td><input type="text" class="tax-aux-input" value="${row.aux || ""}" placeholder="部门/项目" ${taxLocked ? "disabled" : ""}></td>
                <td>
                    <button class="btn-primary btn-ghost" onclick="removeTaxAccrualRuleRow(this)" ${taxLocked ? "disabled" : ""}>删除</button>
                </td>
            </tr>
        `;

        const taxAccrualRules = loadTaxAccrualRules();
        const taxAccrualRowsHtml = taxAccrualRules.map((row, index) => buildTaxAccrualRow(row, index)).join("");

        window.addTaxAccrualRuleRow = function() {
            if (taxLocked) return;
            const tbody = document.getElementById("tax-accrual-body");
            if (!tbody) return;
            const index = tbody.querySelectorAll("tr").length;
            tbody.insertAdjacentHTML("beforeend", buildTaxAccrualRow({}, index));
            refreshTaxAccrualPreview();
        };

        window.removeTaxAccrualRuleRow = function(btn) {
            if (taxLocked) return;
            const row = btn ? btn.closest("tr") : null;
            if (row) row.remove();
            refreshTaxAccrualPreview();
        };

        window.saveTaxAccrualRules = function() {
            if (taxLocked) return;
            const rows = Array.from(document.querySelectorAll("#tax-accrual-body tr"));
            const data = rows.map((row, idx) => ({
                taxName: row.querySelector(".tax-name-input")?.value || "",
                baseCodes: row.querySelector(".subject-multi-input")?.value || "",
                direction: row.querySelector(`input[name='tax-direction-${idx}']:checked`)?.value || "贷方发生额",
                rate: row.querySelector("input[type='number']")?.value || "",
                debitCode: row.querySelector(".tax-debit-select")?.value || "",
                creditCode: row.querySelector(".tax-credit-select")?.value || "",
                aux: row.querySelector(".tax-aux-input")?.value || ""
            }));
            sessionStorage.setItem(TAX_ACCRUAL_RULE_KEY, JSON.stringify(data));
            alert("✅ 计提税金及附加设置已保存。");
        };

        window.toggleTaxAccrualLock = function(input) {
            const next = !!(input && input.checked);
            localStorage.setItem("TaxAccrualLocked", next ? "true" : "false");
            loadContent("AccountingStandardSetting");
        };

        window.validateTaxAccrualRules = function() {
            const row = document.querySelector("#tax-accrual-body tr");
            if (!row) return;
            const rate = parseFloat(row.querySelector("input[type='number']")?.value || "0");
            const baseAmount = 100000;
            const tax = baseAmount * (rate / 100);
            alert(`✅ 公式验证（模拟）\n\n计提税金 = (贷方发生额 - 借方发生额) × 计提比例\n\n基数：${baseAmount.toLocaleString()}\n比例：${rate || 0}%\n税额：${tax.toFixed(2)}`);
        };

        window.refreshTaxAccrualPreview = function() {
            const row = document.querySelector("#tax-accrual-body tr");
            const debit = row ? row.querySelector(".tax-debit-select")?.selectedOptions?.[0]?.textContent : "";
            const credit = row ? row.querySelector(".tax-credit-select")?.selectedOptions?.[0]?.textContent : "";
            const debitBox = document.getElementById("tax-preview-debit");
            const creditBox = document.getElementById("tax-preview-credit");
            if (debitBox) debitBox.textContent = debit || "税金及附加（损益类科目）";
            if (creditBox) creditBox.textContent = credit || "应交税费-各明细税种";
        };

        window.openSubjectMultiSelect = function(event, container) {
            if (event) event.stopPropagation();
            if (!container) return;
            if (typeof window.closeAllSubjectMultiSelect === "function") {
                window.closeAllSubjectMultiSelect();
            }
            const panel = container.querySelector(".subject-multi-panel");
            if (panel) {
                panel.classList.add("is-open");
                container.classList.add("is-open");
                const input = container.querySelector(".subject-multi-input");
                container.dataset.prev = input ? input.value : "";
                requestAnimationFrame(() => {
                    const anchor = input || container;
                    const rect = anchor.getBoundingClientRect();
                    const panelRect = panel.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;
                    const viewportWidth = window.innerWidth;
                    const preferredWidth = Math.max(rect.width, 320);
                    let left = rect.left;
                    if (left + preferredWidth > viewportWidth - 8) {
                        left = Math.max(8, viewportWidth - preferredWidth - 8);
                    }
                    let top = rect.bottom + 6;
                    if (top + panelRect.height > viewportHeight - 8) {
                        top = Math.max(8, rect.top - panelRect.height - 6);
                    }
                    panel.style.position = "fixed";
                    panel.style.left = `${left}px`;
                    panel.style.top = `${top}px`;
                    panel.style.width = `${preferredWidth}px`;
                    panel.style.zIndex = "3000";
                });
            }
        };

        window.closeAllSubjectMultiSelect = function() {
            document.querySelectorAll(".subject-multi-select.is-open").forEach(el => {
                el.classList.remove("is-open");
            });
            document.querySelectorAll(".subject-multi-panel.is-open").forEach(panel => {
                panel.classList.remove("is-open");
                panel.style.position = "";
                panel.style.left = "";
                panel.style.top = "";
                panel.style.width = "";
                panel.style.zIndex = "";
            });
        };

        window.confirmSubjectMultiSelect = function(btn) {
            const panel = btn.closest(".subject-multi-panel");
            if (!panel) return;
            const container = panel.closest(".subject-multi-select");
            const selected = Array.from(panel.querySelectorAll("input[type='checkbox']:checked"))
                .map(cb => cb.value);
            const input = container ? container.querySelector(".subject-multi-input") : null;
            if (input) input.value = selected.join(",");
            if (container) container.dataset.prev = input ? input.value : "";
            if (typeof window.closeAllSubjectMultiSelect === "function") {
                window.closeAllSubjectMultiSelect();
            }
        };

        window.cancelSubjectMultiSelect = function(btn) {
            const panel = btn.closest(".subject-multi-panel");
            const container = panel ? panel.closest(".subject-multi-select") : null;
            if (container) {
                const input = container.querySelector(".subject-multi-input");
                const prev = container.dataset.prev || "";
                if (input) input.value = prev;
            }
            if (typeof window.closeAllSubjectMultiSelect === "function") {
                window.closeAllSubjectMultiSelect();
            }
        };

        if (!window._subjectMultiSelectBound) {
            document.addEventListener("click", (event) => {
                if (!event.target.closest(".subject-multi-select")) {
                    if (typeof window.closeAllSubjectMultiSelect === "function") {
                        window.closeAllSubjectMultiSelect();
                    }
                }
            });
            window._subjectMultiSelectBound = true;
        }

        window.getIncomeStatementTemplate = function() {
            const raw = sessionStorage.getItem("IncomeStatementTemplate");
            if (!raw) return defaultIncomeTemplate.map(item => ({ ...item }));
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) && parsed.length ? parsed : defaultIncomeTemplate.map(item => ({ ...item }));
            } catch (error) {
                return defaultIncomeTemplate.map(item => ({ ...item }));
            }
        };

        window.getCashflowTemplate = function() {
            const raw = sessionStorage.getItem("CashflowTemplate");
            if (!raw) return defaultCashflowTemplate.map(item => ({ ...item }));
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) && parsed.length ? parsed : defaultCashflowTemplate.map(item => ({ ...item }));
            } catch (error) {
                return defaultCashflowTemplate.map(item => ({ ...item }));
            }
        };

        window.getBalanceSheetTemplate = function() {
            const raw = sessionStorage.getItem("BalanceSheetTemplate");
            if (!raw) return defaultBalanceTemplate.map(item => ({ ...item }));
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) && parsed.length ? parsed : defaultBalanceTemplate.map(item => ({ ...item }));
            } catch (error) {
                return defaultBalanceTemplate.map(item => ({ ...item }));
            }
        };

        window.addIncomeTemplateRow = function() {
            const tbody = document.getElementById("income-template-body");
            if (!tbody) return;
            const index = tbody.querySelectorAll("tr").length + 1;
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${index}</td>
                    <td><button class="btn-primary template-row-btn" onclick="removeIncomeTemplateRow(this)">-</button></td>
                    <td><input type="text" placeholder="项目名称"></td>
                    <td>${renderSubjectMultiSelect("")}</td>
                    <td>
                        <select>
                            <option value="+">+</option>
                            <option value="-">-</option>
                        </select>
                    </td>
                    <td><input type="text" placeholder=""></td>
                    <td><label class="template-checkbox"><input type="checkbox"><span>启用</span></label></td>
                    <td><label class="template-checkbox"><input type="checkbox"><span>启用</span></label></td>
                    <td><label class="template-checkbox"><input type="checkbox"><span>启用</span></label></td>
                    <td><input type="text" placeholder=""></td>
                </tr>
            `);
        };

        window.removeIncomeTemplateRow = function(btn) {
            const row = btn.closest("tr");
            if (row) row.remove();
        };

        window.saveIncomeStatementTemplate = function() {
            const rows = Array.from(document.querySelectorAll("#income-template-body tr"));
            const list = rows.map((row, index) => {
                const cells = row.querySelectorAll("td");
                const name = cells[2]?.querySelector("input")?.value?.trim() || "";
                const codes = cells[3]?.querySelector(".subject-multi-input")?.value?.trim() || "";
                const op = cells[4]?.querySelector("select")?.value || "+";
                const order = cells[5]?.querySelector("input")?.value?.trim() || `${index + 1}`;
                return { name, codes, op, order };
            }).filter(item => item.name);
            sessionStorage.setItem("IncomeStatementTemplate", JSON.stringify(list));
            alert("✅ 利润表模板已保存！");
        };

        window.addCashflowTemplateRow = function() {
            const tbody = document.getElementById("cashflow-template-body");
            if (!tbody) return;
            const index = tbody.querySelectorAll("tr").length + 1;
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${index}</td>
                    <td><button class="btn-primary template-row-btn" onclick="removeCashflowTemplateRow(this)">-</button></td>
                    <td><input type="text" placeholder="项目名称"></td>
                    <td>
                        <select>
                            <option>自定义公式</option>
                            <option>系统规则</option>
                        </select>
                    </td>
                </tr>
            `);
        };

        window.removeCashflowTemplateRow = function(btn) {
            const row = btn.closest("tr");
            if (row) row.remove();
        };

        window.saveCashflowTemplate = function() {
            const rows = Array.from(document.querySelectorAll("#cashflow-template-body tr"));
            const list = rows.map(row => {
                const cells = row.querySelectorAll("td");
                const name = cells[2]?.querySelector("input")?.value?.trim() || "";
                const method = cells[3]?.querySelector("select")?.value || "自定义公式";
                return { name, method };
            }).filter(item => item.name);
            sessionStorage.setItem("CashflowTemplate", JSON.stringify(list));
            alert("✅ 现金流量表模板已保存！");
        };

        window.addBalanceTemplateRow = function() {
            const tbody = document.getElementById("balance-template-body");
            if (!tbody) return;
            const index = tbody.querySelectorAll("tr").length + 1;
            tbody.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${index}</td>
                    <td><button class="btn-primary template-row-btn" onclick="removeBalanceTemplateRow(this)">-</button></td>
                    <td><input type="text" placeholder="项目名称"></td>
                    <td>
                        <select>
                            <option>流动资产</option>
                            <option>非流动资产</option>
                            <option>流动负债</option>
                            <option>非流动负债</option>
                            <option>所有者权益</option>
                        </select>
                    </td>
                    <td>${renderSubjectMultiSelect("")}</td>
                    <td>
                        <select>
                            <option value="+">+</option>
                            <option value="-">-</option>
                        </select>
                    </td>
                    <td>${renderSubjectMultiSelect("")}</td>
                    <td>
                        <select>
                            <option value="+">+</option>
                            <option value="-">-</option>
                        </select>
                    </td>
                </tr>
            `);
        };

        window.removeBalanceTemplateRow = function(btn) {
            const row = btn.closest("tr");
            if (row) row.remove();
        };

        window.saveBalanceSheetTemplate = function() {
            const rows = Array.from(document.querySelectorAll("#balance-template-body tr"));
            const list = rows.map((row, index) => {
                const cells = row.querySelectorAll("td");
                const name = cells[2]?.querySelector("input")?.value?.trim() || "";
                const type = cells[3]?.querySelector("select")?.value || "";
                const codesA = cells[4]?.querySelector(".subject-multi-input")?.value?.trim() || "";
                const opA = cells[5]?.querySelector("select")?.value || "+";
                const codesB = cells[6]?.querySelector(".subject-multi-input")?.value?.trim() || "";
                const opB = cells[7]?.querySelector("select")?.value || "+";
                return { name, type, codesA, opA, codesB, opB, order: index + 1 };
            }).filter(item => item.name);
            sessionStorage.setItem("BalanceSheetTemplate", JSON.stringify(list));
            alert("✅ 资产负债表模板已保存！");
        };

        const incomeTemplate = window.getIncomeStatementTemplate();
        const cashflowTemplate = window.getCashflowTemplate();
        const balanceTemplate = window.getBalanceSheetTemplate();

        const standardText = standard === "enterprise"
            ? "企业会计准则"
            : standard === "small"
                ? "小企业会计准则"
                : "未选择";
        const lockTag = locked
            ? `<span class="acct-standard-tag">🔒 已锁定</span>`
            : `<span class="acct-standard-tag">⚙️ 可编辑</span>`;
        const summaryTemplateRows = summaryTemplates.map(item => `
            <tr>
                <td><input type="text" value="${item.code || ""}" placeholder="编号"></td>
                <td><input type="text" value="${item.summary || ""}" placeholder="摘要"></td>
                <td><input type="text" value="${item.mnemonic || ""}" placeholder="助记码"></td>
                <td><input type="text" value="${item.category || ""}" placeholder="类别"></td>
                <td><button class="btn-primary summary-template-action" onclick="removeVoucherSummaryTemplateRow(this)">删除</button></td>
            </tr>
        `).join("");

        const incomeTemplateRows = incomeTemplate.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><button class="btn-primary template-row-btn" onclick="removeIncomeTemplateRow(this)">-</button></td>
                <td><input type="text" value="${item.name || ""}"></td>
                <td>${renderSubjectMultiSelect(item.codes || "")}</td>
                <td>
                    <select>
                        <option value="+" ${item.op === "+" ? "selected" : ""}>+</option>
                        <option value="-" ${item.op === "-" ? "selected" : ""}>-</option>
                    </select>
                </td>
                <td><input type="text" value="${item.order || index + 1}"></td>
                <td><label class="template-checkbox"><input type="checkbox"><span>启用</span></label></td>
                <td><label class="template-checkbox"><input type="checkbox"><span>启用</span></label></td>
                <td><label class="template-checkbox"><input type="checkbox"><span>启用</span></label></td>
                <td><input type="text" value="${item.base || ""}"></td>
            </tr>
        `).join("");

        const cashflowTemplateRows = cashflowTemplate.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><button class="btn-primary template-row-btn" onclick="removeCashflowTemplateRow(this)">-</button></td>
                <td><input type="text" value="${item.name || ""}"></td>
                <td>
                    <select>
                        <option ${item.method === "自定义公式" ? "selected" : ""}>自定义公式</option>
                        <option ${item.method === "系统规则" ? "selected" : ""}>系统规则</option>
                    </select>
                </td>
            </tr>
        `).join("");

        const balanceTemplateRows = balanceTemplate.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><button class="btn-primary template-row-btn" onclick="removeBalanceTemplateRow(this)">-</button></td>
                <td><input type="text" value="${item.name || ""}"></td>
                <td>
                    <select>
                        <option ${item.type === "流动资产" ? "selected" : ""}>流动资产</option>
                        <option ${item.type === "非流动资产" ? "selected" : ""}>非流动资产</option>
                        <option ${item.type === "流动负债" ? "selected" : ""}>流动负债</option>
                        <option ${item.type === "非流动负债" ? "selected" : ""}>非流动负债</option>
                        <option ${item.type === "所有者权益" ? "selected" : ""}>所有者权益</option>
                    </select>
                </td>
                <td>${renderSubjectMultiSelect(item.codesA || "")}</td>
                <td>
                    <select>
                        <option value="+" ${item.opA === "+" ? "selected" : ""}>+</option>
                        <option value="-" ${item.opA === "-" ? "selected" : ""}>-</option>
                    </select>
                </td>
                <td>${renderSubjectMultiSelect(item.codesB || "")}</td>
                <td>
                    <select>
                        <option value="+" ${item.opB === "+" ? "selected" : ""}>+</option>
                        <option value="-" ${item.opB === "-" ? "selected" : ""}>-</option>
                    </select>
                </td>
            </tr>
        `).join("");

        const closingTemplates = typeof window.getPeriodEndClosingTemplates === "function"
            ? window.getPeriodEndClosingTemplates()
            : { templates: [] };

        let closingBooks = window.getAccountBooks ? window.getAccountBooks() : [];
        if (closingBooks.length === 0) {
            closingBooks = [
                { id: "1", code: "001", name: "集团总账套", status: "已启用" }
            ];
            sessionStorage.setItem("FinanceAccountBooks", JSON.stringify(closingBooks));
        }
        const renderBookSelect = (value = "", className = "", disabled = false) => {
            const selected = (value || "").toString().trim();
            const options = closingBooks.length
                ? closingBooks.map(b => `<option value="${b.id}" ${b.id === selected ? "selected" : ""}>${b.name}</option>`).join("")
                : `<option value="">暂无账套</option>`;
            return `<select class="${className}" ${disabled ? "disabled" : ""}><option value="">-请选择-</option>${options}</select>`;
        };

        const createClosingTemplate = (type, index) => {
            const base = {
                id: "",
                type,
                priority: index + 1,
                voucherWord: "结",
                bookId: "",
                status: "启用"
            };
            if (type === "tax") {
                return {
                    ...base,
                    name: `计提税金及附加-模板${index + 1}`,
                    vatBaseCodes: [],
                    taxExpenseCode: "",
                    taxItems: []
                };
            }
            if (type === "income") {
                return {
                    ...base,
                    name: `结转收入-模板${index + 1}`,
                    sourceCodes: [],
                    targetCode: "4103"
                };
            }
            return {
                ...base,
                name: `结转成本费用-模板${index + 1}`,
                sourceCodes: [],
                targetCode: "4103"
            };
        };

        const closingTaxTemplates = closingTemplates.templates.filter(t => t.type === "tax");
        const closingIncomeTemplates = closingTemplates.templates.filter(t => t.type === "income");
        const closingCostTemplates = closingTemplates.templates.filter(t => t.type === "cost");
        if (closingTaxTemplates.length === 0) closingTaxTemplates.push(createClosingTemplate("tax", 0));
        if (closingIncomeTemplates.length === 0) closingIncomeTemplates.push(createClosingTemplate("income", 0));
        if (closingCostTemplates.length === 0) closingCostTemplates.push(createClosingTemplate("cost", 0));

        const buildClosingCard = (tpl, type, index) => {
            const cardTitle = type === "tax"
                ? `计提税金及附加 · 模板${index + 1}`
                : type === "income"
                    ? `结转收入 · 模板${index + 1}`
                    : `结转成本费用 · 模板${index + 1}`;
            const vatCodes = (tpl.vatBaseCodes || []).join(",");
            const sourceCodes = (tpl.sourceCodes || []).join(",");
            const wordVal = tpl.voucherWord || "结";
            return `
                <div class="closing-template-card" data-type="${type}" data-template-id="${tpl.id || ""}">
                    <div class="closing-card-header">
                        <h4>${cardTitle}</h4>
                        <button class="btn-primary btn-ghost closing-template-remove" onclick="removeClosingTemplate(this)">删除</button>
                    </div>
                    <div class="closing-field">
                        <label>账套</label>
                        ${renderBookSelect(tpl.bookId || "", "closing-book-select")}
                    </div>
                    ${type === "tax" ? `
                        <div class="closing-field">
                            <label>增值税科目</label>
                            <div class="closing-tax-vat-codes">${renderSubjectMultiSelect(vatCodes)}</div>
                        </div>
                        <div class="closing-field">
                            <label>税金及附加科目</label>
                            ${renderSubjectSelect(tpl.taxExpenseCode || "", "closing-tax-expense-select")}
                        </div>
                    ` : `
                        <div class="closing-field">
                            <label>${type === "income" ? "收入科目范围" : "成本费用科目范围"}</label>
                            <div class="closing-source-codes">${renderSubjectMultiSelect(sourceCodes)}</div>
                        </div>
                        <div class="closing-field">
                            <label>转入科目</label>
                            ${renderSubjectSelect(tpl.targetCode || "4103", "closing-target-select")}
                        </div>
                    `}
                    <div class="closing-field">
                        <label>凭证字</label>
                        <input type="text" class="closing-word-input" value="${wordVal}" placeholder="凭证字">
                    </div>
                </div>
            `;
        };

        window.addClosingTemplate = function(type) {
            const container = document.getElementById(`closing-template-${type}`);
            if (!container) return;
            const count = container.querySelectorAll(".closing-template-card").length;
            const tpl = createClosingTemplate(type, count);
            container.insertAdjacentHTML("beforeend", buildClosingCard(tpl, type, count));
        };

        window.removeClosingTemplate = function(btn) {
            const card = btn ? btn.closest(".closing-template-card") : null;
            if (!card) return;
            const container = card.parentElement;
            if (container && container.querySelectorAll(".closing-template-card").length <= 1) {
                alert("每个类别至少保留一张模板。");
                return;
            }
            card.remove();
        };

        contentHTML += `
        <div class="acct-standard-panel">
            <div class="acct-standard-header">
                <div>
                    <h2 style="margin:0; color:#2c3e50;">基础设置 · 会计准则</h2>
                    <p style="margin:6px 0 0 0; color:#7f8c8d; font-size:13px;">
                        首次启用财务模块需确认会计准则，系统会自动写入一级科目与常用二级科目模板。
                    </p>
                </div>
                ${lockTag}
            </div>
            <div class="acct-standard-status">当前准则：<strong>${standardText}</strong></div>

            <div class="acct-standard-group" style="margin-top:16px;">
                <input type="radio" id="standard-small" name="acct-standard" value="small" ${standard === "small" ? "checked" : ""} ${locked ? "disabled" : ""}>
                <label class="acct-standard-card" for="standard-small">
                    <h4>《小企业会计准则》</h4>
                    <p>适合大多数中小型物流/货运企业，科目数量精简，上手更快。</p>
                    <div class="acct-standard-badge">推荐 · 轻量级科目体系</div>
                </label>

                <input type="radio" id="standard-enterprise" name="acct-standard" value="enterprise" ${standard === "enterprise" ? "checked" : ""} ${locked ? "disabled" : ""}>
                <label class="acct-standard-card" for="standard-enterprise">
                    <h4>《企业会计准则》</h4>
                    <p>适合大型集团，科目体系更全面且严谨，支持复杂核算场景。</p>
                    <div class="acct-standard-badge">全面 · 扩展性强</div>
                </label>
            </div>

            <div style="margin-top:18px; display:flex; align-items:center; gap:12px;">
                <button class="btn-primary" style="padding:8px 24px;" onclick="applyAccountingStandardSetting()" ${locked ? "disabled" : ""}>保存设置</button>
                <span style="font-size:12px; color:#95a5a6;">提示：一旦产生凭证数据，将锁定准则，不可更改。</span>
            </div>

            <div class="subject-code-setting">
                <div style="font-weight:bold; color:#2c3e50;">科目编码级次设置</div>
                <div class="setting-row">
                    <label>设置科目级次</label>
                    <select id="subject-level-count" onchange="updateSubjectCodeInputs()">
                        <option value="2" ${subjectSetting.levels === 2 ? "selected" : ""}>2</option>
                        <option value="3" ${subjectSetting.levels === 3 ? "selected" : ""}>3</option>
                        <option value="4" ${subjectSetting.levels === 4 ? "selected" : ""}>4</option>
                        <option value="5" ${subjectSetting.levels === 5 ? "selected" : ""}>5</option>
                    </select>
                    <label>设置科目编码长度</label>
                    <input id="subject-length-1" type="number" min="1" value="${subjectSetting.lengths[0] || 4}">
                    <input id="subject-length-2" type="number" min="1" value="${subjectSetting.lengths[1] || 2}">
                    <input id="subject-length-3" type="number" min="1" value="${subjectSetting.lengths[2] || 2}">
                    <input id="subject-length-4" type="number" min="1" value="${subjectSetting.lengths[3] || 2}">
                    <input id="subject-length-5" type="number" min="1" value="${subjectSetting.lengths[4] || 2}">
                    <button class="btn-primary" onclick="saveSubjectCodeSetting()">保存设置</button>
                </div>
                <div id="subject-code-example" style="margin-top:8px; font-size:12px; color:#95a5a6;">
                    示例：级次=3，长度=4/2/2，对应 1001 → 100101 → 10010101。
                </div>
            </div>

            <div class="summary-template-panel">
                <div class="summary-template-header">
                    <div>
                        <div class="summary-template-title">凭证摘要模板设置中心</div>
                        <div class="summary-template-tip">维护常用摘要，凭证录入时可快速选择。</div>
                    </div>
                    <div class="summary-template-actions">
                        <button class="btn-primary summary-template-action" onclick="addVoucherSummaryTemplateRow()">+ 新增模板</button>
                        <button class="btn-primary summary-template-action" onclick="resetVoucherSummaryTemplates()">恢复默认</button>
                        <button class="btn-primary summary-template-action summary-template-save" onclick="saveVoucherSummaryTemplates()">保存设置</button>
                    </div>
                </div>
                <div class="summary-template-table-wrap">
                    <table class="data-table summary-template-table">
                        <thead>
                            <tr>
                                <th style="width:90px;">编号</th>
                                <th>常用摘要</th>
                                <th style="width:90px;">助记码</th>
                                <th style="width:90px;">类别</th>
                                <th style="width:70px;">操作</th>
                            </tr>
                        </thead>
                        <tbody id="summary-template-body">${summaryTemplateRows}</tbody>
                    </table>
                </div>
                <div class="summary-template-note">提示：凭证录入的摘要输入框支持下拉提示。</div>
            </div>

            <div class="report-template-panel closing-template-panel">
                <div class="report-template-header">
                    <div>
                        <div class="report-template-title">期末结转凭证模板设置</div>
                        <div class="report-template-tip">配置税金、收入、成本费用三类模板，结转时按优先级自动生成凭证。</div>
                    </div>
                    <div class="report-template-actions">
                        <button class="btn-primary" onclick="resetClosingTemplates()">恢复默认</button>
                        <button class="btn-primary" onclick="saveClosingTemplates()">保存设置</button>
                    </div>
                </div>
                <div style="margin-top:20px;">
                    <div class="tax-accrual-panel">
                        <div class="tax-accrual-header">
                            <div class="tax-accrual-title">计提税金及附加设置</div>
                            ${taxLocked ? `<div class="tax-accrual-lock">期间已结账 · 设置只读</div>` : ""}
                        </div>
                        <div class="tax-accrual-desc">
                            模块概述：本模块用于预设每月期末处理时“税金及附加”的计算规则。系统将根据此处配置的比例、基数科目，在期末自动计算税额并生成会计凭证。
                        </div>

                        <div class="tax-info-grid">
                            <div class="tax-info-item">
                                <label>账套名称</label>
                                ${renderBookSelect(closingTaxTemplates[0]?.bookId || "", "tax-book-select", taxLocked)}
                            </div>
                            <div class="tax-info-item">
                                <label>模板名称</label>
                                <input type="text" value="${closingTaxTemplates[0]?.name || "计提税金及附加-模板1"}" ${taxLocked ? "disabled" : ""} placeholder="模板名称">
                            </div>
                            <div class="tax-info-item">
                                <label>凭证字</label>
                                <select ${taxLocked ? "disabled" : ""}>
                                    <option value="记">记</option>
                                    <option value="结">结</option>
                                </select>
                            </div>
                        </div>

                        <div class="tax-rule-card">
                            <div class="tax-rule-header">
                                <div style="font-weight:600; color:#374151;">核心规则配置</div>
                                <div class="tax-rule-actions">
                                    <label style="font-size:12px; color:#6b7280; display:flex; align-items:center; gap:6px;">
                                        <input type="checkbox" ${taxLocked ? "checked" : ""} onchange="toggleTaxAccrualLock(this)">
                                        反结转锁定
                                    </label>
                                    <button class="btn-primary btn-ghost" onclick="addTaxAccrualRuleRow()" ${taxLocked ? "disabled" : ""}>+ 新增行</button>
                                    <button class="btn-primary btn-ghost" onclick="validateTaxAccrualRules()">公式验证</button>
                                </div>
                            </div>
                            <table class="tax-rule-table">
                                <thead>
                                    <tr>
                                        <th>税种名称</th>
                                        <th>计算基数科目</th>
                                        <th>取数方向</th>
                                        <th>计提比例(%)</th>
                                        <th>借方科目</th>
                                        <th>贷方科目</th>
                                        <th>辅助核算项</th>
                                        <th style="width:70px;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="tax-accrual-body">
                                    ${taxAccrualRowsHtml || ""}
                                </tbody>
                            </table>
                            <div class="tax-rule-footer">
                                <button class="btn-primary" onclick="saveTaxAccrualRules()" ${taxLocked ? "disabled" : ""}>保存设置</button>
                            </div>
                        </div>

                        <div class="tax-preview">
                            <div class="tax-preview-title">凭证预览</div>
                            <div class="tax-preview-grid">
                                <div class="tax-preview-box">
                                    <div style="font-weight:600; margin-bottom:6px;">借方</div>
                                    <div id="tax-preview-debit">税金及附加（损益类科目）</div>
                                </div>
                                <div class="tax-preview-box">
                                    <div style="font-weight:600; margin-bottom:6px;">贷方</div>
                                    <div id="tax-preview-credit">应交税费-各明细税种</div>
                                </div>
                            </div>
                            <div class="tax-preview-note">
                                计算公式：计提税金 = （基数科目贷方发生额 - 基数科目借方发生额） × 计提比例
                                <br>取数引擎：系统读取会计期间内指定增值税科目（如 2221）的累计发生额。
                                <br>凭证分录：借：税金及附加；贷：应交税费-各明细税种。
                            </div>
                        </div>
                    </div>
                </div>
                <div class="closing-template-group">
                    <div class="closing-template-group-header">
                        <div class="closing-template-group-title">② 结转收入</div>
                        <button class="btn-primary template-row-btn" onclick="addClosingTemplate('income')">+ 新增模板</button>
                    </div>
                    <div class="closing-template-grid" id="closing-template-income">
                        ${closingIncomeTemplates.map((tpl, idx) => buildClosingCard(tpl, "income", idx)).join("")}
                    </div>
                </div>
                <div class="closing-template-group">
                    <div class="closing-template-group-header">
                        <div class="closing-template-group-title">③ 结转成本费用</div>
                        <button class="btn-primary template-row-btn" onclick="addClosingTemplate('cost')">+ 新增模板</button>
                    </div>
                    <div class="closing-template-grid" id="closing-template-cost">
                        ${closingCostTemplates.map((tpl, idx) => buildClosingCard(tpl, "cost", idx)).join("")}
                    </div>
                </div>
            </div>

            <div class="report-template-panel">
                <div class="report-template-header">
                    <div>
                        <div class="report-template-title">利润表设置</div>
                        <div class="report-template-tip">配置利润损益表的项目与科目组成，保存后联动报表展示。</div>
                    </div>
                    <div class="report-template-actions">
                        <button class="btn-primary template-row-btn" onclick="addIncomeTemplateRow()">+</button>
                        <button class="btn-primary" onclick="saveIncomeStatementTemplate()">保存设置</button>
                    </div>
                </div>
                <div class="report-template-table-wrap">
                    <table class="data-table report-template-table report-template-table--income">
                        <thead>
                            <tr>
                                <th style="width:60px;">序号</th>
                                <th style="width:60px;">操作</th>
                                <th style="min-width:180px;">项目名称</th>
                                <th style="width:200px;">科目组成</th>
                                <th style="width:90px;">运算符号</th>
                                <th style="width:90px;">顺序</th>
                                <th style="width:110px;">单吨平均值</th>
                                <th style="width:110px;">单方平均值</th>
                                <th style="width:110px;">单车平均值</th>
                                <th style="width:110px;">占比基数</th>
                            </tr>
                        </thead>
                        <tbody id="income-template-body">${incomeTemplateRows}</tbody>
                    </table>
                </div>
            </div>

            <div class="report-template-panel">
                <div class="report-template-header">
                    <div>
                        <div class="report-template-title">现金流量表设置</div>
                        <div class="report-template-tip">配置现金流量表项目，保存后联动报表展示。</div>
                    </div>
                    <div class="report-template-actions">
                        <button class="btn-primary template-row-btn" onclick="addCashflowTemplateRow()">+</button>
                        <button class="btn-primary" onclick="saveCashflowTemplate()">保存设置</button>
                    </div>
                </div>
                <div class="report-template-table-wrap">
                    <table class="data-table report-template-table">
                        <thead>
                            <tr>
                                <th style="width:60px;">序号</th>
                                <th style="width:60px;">操作</th>
                                <th>项目名称</th>
                                <th style="width:180px;">计算方式</th>
                            </tr>
                        </thead>
                        <tbody id="cashflow-template-body">${cashflowTemplateRows}</tbody>
                    </table>
                </div>
            </div>

            <div class="report-template-panel">
                <div class="report-template-header">
                    <div>
                        <div class="report-template-title">资产负债表设置</div>
                        <div class="report-template-tip">配置资产负债表项目及科目组成，保存后联动报表展示。</div>
                    </div>
                    <div class="report-template-actions">
                        <button class="btn-primary template-row-btn" onclick="addBalanceTemplateRow()">+</button>
                        <button class="btn-primary" onclick="saveBalanceSheetTemplate()">保存设置</button>
                    </div>
                </div>
                <div class="report-template-table-wrap">
                    <table class="data-table report-template-table">
                        <thead>
                            <tr>
                                <th style="width:60px;">序号</th>
                                <th style="width:60px;">操作</th>
                                <th>项目名称</th>
                                <th style="width:140px;">类型</th>
                                <th style="width:160px;">科目组成</th>
                                <th style="width:90px;">运算符号</th>
                                <th style="width:160px;">科目组成</th>
                                <th style="width:90px;">运算符号</th>
                            </tr>
                        </thead>
                        <tbody id="balance-template-body">${balanceTemplateRows}</tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
        setTimeout(() => {
            if (typeof window.updateSubjectCodeInputs === "function") {
                window.updateSubjectCodeInputs(subjectSetting.levels, subjectSetting.lengths);
            }
        }, 0);
    }

    // =========================================================================
    // ★★★ [新增模块] 收支方式配置 (PaymentMethodConfig) ★★★
    // =========================================================================
    else if (moduleCode === "PaymentMethodConfig") {

        // 1. 初始化数据 (如果缓存为空)
        let list = JSON.parse(sessionStorage.getItem('ConfigPaymentMethods') || "[]");
        if (list.length === 0) {
            list = [
                { id: "PM001", name: "银行转账", type: "银行账户", status: "启用" },
                { id: "PM002", name: "微信支付", type: "第三方平台", status: "启用" },
                { id: "PM003", name: "支付宝", type: "第三方平台", status: "启用" },
                { id: "PM004", name: "现金/支票", type: "线下", status: "停用" }
            ];
            sessionStorage.setItem('ConfigPaymentMethods', JSON.stringify(list));
        }

        // 2. 渲染表格行
        const subjects = JSON.parse(sessionStorage.getItem('AcctSubjects') || "[]");
        const subjectOptions = subjects.length
            ? subjects.filter(s => s.status !== "停用").map(s => `<option value="${s.code}|||${s.name}">${s.code} ${s.name}</option>`).join("")
            : `<option value="">暂无科目，请先维护会计科目</option>`;

        const rows = list.map(item => {
            let statusTag = item.status === '启用'
                ? `<span style="color:#27ae60; background:#eafaf1; padding:2px 6px; border-radius:4px;">✔ 启用</span>`
                : `<span style="color:#999; background:#eee; padding:2px 6px; border-radius:4px;">⛔ 停用</span>`;

            let actionBtn = item.status === '启用'
                ? `<button class="btn-primary" style="background:#e74c3c; padding:2px 8px; font-size:12px;" onclick="toggleMethodStatus('${item.id}')">停用</button>`
                : `<button class="btn-primary" style="background:#27ae60; padding:2px 8px; font-size:12px;" onclick="toggleMethodStatus('${item.id}')">启用</button>`;

            const subjectText = item.subjectCode && item.subjectName
                ? `${item.subjectCode} ${item.subjectName}`
                : "-";

            return `
            <tr>
                <td>${item.id}</td>
                <td><b>${item.name}</b></td>
                <td>${item.type}</td>
                <td>${subjectText}</td>
                <td>${statusTag}</td>
                <td>
                    <button class="btn-primary" style="background:#3498db; padding:2px 8px; font-size:12px;" onclick="editPaymentMethod('${item.id}')">编辑</button>
                    ${actionBtn}
                    <button class="btn-primary" style="background:#c0392b; padding:2px 8px; font-size:12px; margin-left:5px;" onclick="deleteMethod('${item.id}')">删除</button>
                </td>
            </tr>
        `;
        }).join('');

        // 3. 拼接页面 HTML
        contentHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid #eee;">
            <div>
                <h2 style="margin:0; color:#2c3e50;">💳 收支方式配置 (Payment Methods)</h2>
                <p style="margin:5px 0 0 0; color:#7f8c8d; font-size:13px;">定义系统支持的付款和收款渠道，如银行卡、支付宝等。</p>
            </div>
            <div>
                <button class="btn-primary" onclick="openPaymentMethodModal()">+ 新增方式</button>
            </div>
        </div>

        <div style="background:white; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.05); padding:15px;">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>编号</th><th>方式名称</th><th>类型</th><th>科目类别</th><th>状态</th><th>操作</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>

        <div id="pmModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:999;">
            <div style="position:absolute; top:20%; left:50%; transform:translateX(-50%); width:400px; background:white; border-radius:8px; box-shadow:0 5px 25px rgba(0,0,0,0.2); padding:20px;">
                <h3 style="margin-top:0; color:#2980b9;">新增收支方式</h3>
                
                <div style="margin-bottom:15px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">方式名称：</label>
                    <input type="text" id="pm_name" placeholder="例如：招商银行9527" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                </div>

                <div style="margin-bottom:15px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">渠道类型：</label>
                    <select id="pm_type" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                        <option value="银行账户">🏦 银行账户</option>
                        <option value="第三方平台">📱 第三方平台 (微信/支付宝)</option>
                        <option value="线下">💵 线下 (现金/支票)</option>
                    </select>
                </div>
                
                <div style="margin-bottom:15px;">
                    <label style="display:block; font-weight:bold; margin-bottom:5px;">科目类别：</label>
                    <select id="pm_subject" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:4px;">
                        <option value="">请选择科目</option>
                        ${subjectOptions}
                    </select>
                </div>

                <div style="text-align:right; margin-top:20px;">
                    <button onclick="document.getElementById('pmModal').style.display='none'" style="padding:8px 15px; margin-right:10px; background:white; border:1px solid #ccc; border-radius:4px; cursor:pointer;">取消</button>
                    <button class="btn-primary" onclick="savePaymentMethod()">确认保存</button>
                </div>
            </div>
        </div>
    `;
    }

    // =========================================================================
    // 90. 客户档案 (BaseCustomer) - [支持新增字段 & 数据持久化]
    // =========================================================================
    else if (moduleCode === "BaseCustomer") {
        // 1. 定义默认数据 (写死在代码里的老数据)
        const defaultCustomers = [
            {
                id: "CUST-8812",
                name: "张三 (个人)",
                taxId: "-",
                type: "现结",
                limit: "0.00",
                days: "0",
                status: "正常",
            },
            {
                id: "CUST-9001",
                name: "风险贸易商贸",
                taxId: "91310000MA3...",
                type: "月结",
                limit: "50,000.00",
                days: "60",
                status: "已冻结",
            },
        ];

        // 2. 读取新增数据 (从 SessionStorage 读取刚才添加的)
        const addedCustomers = JSON.parse(
            sessionStorage.getItem("AddedCustomers") || "[]"
        );

        // 3. 合并数据 (新数据排在前面)
        const allCustomers = [...addedCustomers, ...defaultCustomers];

        // 4. 动态生成表格 HTML
        const rowsHTML = allCustomers
            .map((c) => {
                // 样式处理
                const typeBadge =
                    c.type === "现结"
                        ? '<span style="background:#f6ffed; color:#52c41a; padding:2px 6px; border-radius:4px; font-size:12px;">现结</span>'
                        : '<span style="background:#e6f7ff; color:#1890ff; padding:2px 6px; border-radius:4px; font-size:12px;">月结</span>';

                const statusHtml =
                    c.status === "正常"
                        ? '<span style="color: #27ae60;">正常</span>'
                        : '<span style="color: #e74c3c; font-weight:bold;">已冻结</span>';

                const rowStyle =
                    c.status === "已冻结" ? "background-color: #fff1f0;" : "";

                // 冻结按钮逻辑
                const freezeAction =
                    c.status === "正常"
                        ? `<a href="javascript:void(0)" onclick="toggleFreeze(this, '${c.id}', '${c.name}')" style="color:#e74c3c;">冻结</a>`
                        : `<a href="javascript:void(0)" onclick="toggleFreeze(this, '${c.id}', '${c.name}')" style="color:#3498db;">申请解冻</a>`;

                return `
                        <tr style="${rowStyle}">
                            <td>${c.id}</td>
                            <td class="val-name">${c.name}</td>
                            <td>${c.taxId}</td>
                            <td>${typeBadge}</td>
                            <td><strong>${c.limit}</strong></td>
                            <td>${c.days}</td>
                            <td>${statusHtml}</td>
                            <td>
                                <a href="javascript:void(0)" onclick="editCustomerInfo(this, '${c.id}')" style="color:#3498db;">修改资料</a> | 
                                ${freezeAction}
                            </td>
                        </tr>
                    `;
            })
            .join("");

        contentHTML += `
                    <h2>客户档案 </h2>
                    <p style="color: #7f8c8d;">管理客户的财务基础信息（开票信息、银行账户）及信用控制策略。</p>
                    
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input type="text" placeholder="客户编码 / 名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                            <select style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="">客户类别</option>
                                <option>企业客户</option>
                            </select>
                            <button class="btn-primary">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 15px;">
                        <button class="btn-primary" style="background-color: #27ae60;" onclick="addCustomer()">+ 新增客户</button>
                        <button class="btn-primary" style="background-color: #3498db;">同步 CRM 数据</button>
                        <button class="btn-primary" style="background-color: #f39c12;">批量设置额度</button>
                    </div>

                    <h3>客户列表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>客户编码</th>
                                <th>客户名称</th>
                                <th>纳税人识别号</th>
                                <th>结算方式</th>
                                <th>信用额度 (RMB)</th>
                                <th>账期 (天)</th>
                                <th>状态</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHTML}
                        </tbody>
                    </table>
                `;
    }

    // --------------------------------------------------------------------------
    // 模块：期初余额录入 (FinanceOpeningBalance)
    // 功能：录入科目期初数据，支持辅助核算录入，实时试算平衡校验
    // --------------------------------------------------------------------------
    else if (moduleCode === "FinanceOpeningBalance") {
        // 1. 初始化页面结构
        // 使用 Flex 布局：顶部操作栏 + 中间滚动表格 + 底部固定试算平衡条
        contentHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; background-color: #f0f2f5;">
                <div style="padding: 16px; background: #fff; border-bottom: 1px solid #e8e8e8; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 16px; font-weight: bold; color: #333;">期初余额录入</div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn-secondary" id="btn-import">📥 Excel导入</button>
                        <button class="btn-primary" id="btn-save">💾 保存数据</button>
                        <button class="btn-danger" id="btn-enable" disabled>🚀 启用账套</button> </div>
                </div>

                <div style="flex: 1; overflow: auto; padding: 16px;">
                    <div style="background: #fff; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <thead style="background: #fafafa; position: sticky; top: 0; z-index: 10;">
                                <tr style="height: 40px; border-bottom: 1px solid #e8e8e8;">
                                    <th style="text-align: left; padding-left: 16px; width: 150px;">科目编码</th>
                                    <th style="text-align: left; padding-left: 16px;">科目名称</th>
                                    <th style="text-align: center; width: 80px;">方向</th>
                                    <th style="text-align: center; width: 60px;">辅助</th> <th style="text-align: right; padding-right: 16px; width: 150px;">期初余额</th>
                                    <th style="text-align: right; padding-right: 16px; width: 150px;">年初余额</th> <th style="text-align: center; width: 100px;">操作</th>
                                </tr>
                            </thead>
                            <tbody id="opening-balance-tbody">
                                <tr><td colspan="7" style="text-align:center; padding: 20px;">正在加载科目表...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style="background: #fff; border-top: 1px solid #e8e8e8; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; font-family: monospace;">
                    <div style="display: flex; gap: 30px;">
                        <div>
                            <span style="color: #666;">资产总额(借):</span>
                            <span id="total-debit" style="font-weight: bold; font-size: 16px; color: #333;">0.00</span>
                        </div>
                        <div>
                            <span style="color: #666;">负债权益(贷):</span>
                            <span id="total-credit" style="font-weight: bold; font-size: 16px; color: #333;">0.00</span>
                        </div>
                    </div>
                    <div id="balance-status" style="padding: 6px 16px; border-radius: 4px; font-weight: bold; background: #ffebee; color: #d32f2f;">
                        ⚠️ 试算不平衡 | 差额: <span id="diff-amount">0.00</span>
                    </div>
                </div>
            </div>
        `;

        setTimeout(() => {
        // 2. 模拟后端数据 (真实场景请用 fetch 从 API 获取)
        // 数据结构说明: isLeaf=是否末级, hasAux=是否有辅助核算
        const openingStorageKey = "OpeningBalances";
        const mockSubjects = [
            { code: "1001", name: "库存现金", direction: "借", isLeaf: true, hasAux: false, balance: 0 },
            { code: "1002", name: "银行存款", direction: "借", isLeaf: true, hasAux: false, balance: 0 },
            { code: "1122", name: "应收账款", direction: "借", isLeaf: true, hasAux: true, balance: 0 }, // 带辅助
            { code: "1221", name: "其他应收款", direction: "借", isLeaf: false, hasAux: false, balance: 0 },
            { code: "122101", name: "备用金", direction: "借", isLeaf: true, hasAux: true, balance: 0 }, // 带辅助
            { code: "2202", name: "应付账款", direction: "贷", isLeaf: true, hasAux: true, balance: 0 }, // 贷方科目
            { code: "4001", name: "实收资本", direction: "贷", isLeaf: true, hasAux: false, balance: 0 },
            { code: "6602", name: "管理费用", direction: "借", isLeaf: true, hasAux: true, balance: 0 }
        ];

        function loadOpeningBalances() {
            try {
                const stored = JSON.parse(sessionStorage.getItem(openingStorageKey) || "[]");
                return Array.isArray(stored) ? stored : [];
            } catch (error) {
                return [];
            }
        }

        function persistOpeningBalances() {
            const payload = mockSubjects.map(item => ({
                code: item.code,
                name: item.name,
                direction: item.direction,
                balance: parseFloat(item.balance) || 0
            }));
            sessionStorage.setItem(openingStorageKey, JSON.stringify(payload));
        }

        const storedOpening = loadOpeningBalances();
        if (storedOpening.length) {
            const openingMap = new Map(storedOpening.map(item => [item.code, item]));
            mockSubjects.forEach(sub => {
                const saved = openingMap.get(sub.code);
                if (saved && saved.balance !== undefined) {
                    sub.balance = parseFloat(saved.balance) || 0;
                }
            });
        }

        const tbody = document.getElementById("opening-balance-tbody");
        const totalDebitEl = document.getElementById("total-debit");
        const totalCreditEl = document.getElementById("total-credit");
        const diffAmountEl = document.getElementById("diff-amount");
        const statusBox = document.getElementById("balance-status");
        const btnEnable = document.getElementById("btn-enable");

        // 3. 渲染表格函数
        function renderTable() {
            let html = "";
            mockSubjects.forEach((sub, index) => {
                const isEditable = sub.isLeaf && !sub.hasAux; // 只有末级且无辅助核算才可以直接输
                const inputStyle = isEditable 
                    ? "border: 1px solid #d9d9d9; border-radius: 3px; padding: 4px 8px; width: 100%; text-align: right;" 
                    : "border: 1px solid #f0f0f0; background: #f5f5f5; color: #999; padding: 4px 8px; width: 100%; text-align: right; cursor: not-allowed;";
                
                // 辅助核算按钮逻辑
                let actionBtn = "";
                if (sub.hasAux) {
                    actionBtn = `<a href="javascript:void(0)" class="btn-aux-edit" data-index="${index}" style="color: #1890ff; text-decoration: none;">📋 录入明细</a>`;
                }

                html += `
                    <tr style="border-bottom: 1px solid #f0f0f0; height: 45px;">
                        <td style="padding-left: 16px;">${sub.code}</td>
                        <td style="padding-left: 16px;">${sub.name}</td>
                        <td style="text-align: center;">
                            <span style="padding: 2px 6px; border-radius: 2px; font-size: 12px; background: ${sub.direction==='借'?'#e6f7ff':'#fff1f0'}; color: ${sub.direction==='借'?'#1890ff':'#f5222d'};">
                                ${sub.direction}
                            </span>
                        </td>
                        <td style="text-align: center;">${sub.hasAux ? '✅' : '-'}</td>
                        
                        <td style="padding-right: 16px;">
                            <input type="number" class="balance-input" data-index="${index}" data-dir="${sub.direction}" 
                                value="${sub.balance || ''}" placeholder="0.00" 
                                ${isEditable ? '' : 'readonly'} style="${inputStyle}">
                        </td>
                        
                        <td style="padding-right: 16px;">
                            <input type="number" readonly style="border: none; background: transparent; width: 100%; text-align: right; color: #bbb;" value="0.00">
                        </td>
                        
                        <td style="text-align: center;">
                            ${actionBtn}
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;

            // 重新绑定事件
            bindEvents();
            calculateTrialBalance(); // 初始计算一次
        }

        // 4. 核心逻辑：试算平衡计算器
        function calculateTrialBalance() {
            let debitTotal = 0;
            let creditTotal = 0;

            mockSubjects.forEach(sub => {
                const val = parseFloat(sub.balance) || 0;
                // 这里简单处理：实际逻辑应该根据科目属性累加
                // 注意：非末级科目金额应该由下级汇总，这里假设数据源已经是平铺且包含金额
                if (sub.direction === "借") {
                    debitTotal += val;
                } else {
                    creditTotal += val;
                }
            });

            // 更新UI
            totalDebitEl.innerText = debitTotal.toLocaleString('zh-CN', {minimumFractionDigits: 2});
            totalCreditEl.innerText = creditTotal.toLocaleString('zh-CN', {minimumFractionDigits: 2});
            
            const diff = debitTotal - creditTotal;
            diffAmountEl.innerText = Math.abs(diff).toLocaleString('zh-CN', {minimumFractionDigits: 2});

            // 状态判断
            if (Math.abs(diff) < 0.01 && (debitTotal > 0 || creditTotal > 0)) {
                // 平衡
                statusBox.style.background = "#f6ffed";
                statusBox.style.color = "#52c41a";
                statusBox.innerHTML = `✅ 试算平衡 | 可以启用`;
                btnEnable.disabled = false;
                btnEnable.className = "btn-success"; // 假设你有这个样式类
                btnEnable.style.background = "#52c41a";
                btnEnable.style.color = "#fff";
                btnEnable.style.cursor = "pointer";
            } else {
                // 不平衡
                statusBox.style.background = "#ffebee";
                statusBox.style.color = "#d32f2f";
                statusBox.innerHTML = `⚠️ 试算不平衡 | 差额: ${diff.toFixed(2)}`;
                btnEnable.disabled = true;
                btnEnable.style.background = "#ccc";
                btnEnable.style.cursor = "not-allowed";
            }
        }

        // 5. 事件绑定
        function bindEvents() {
            // 输入框变更事件
            document.querySelectorAll('.balance-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const idx = e.target.dataset.index;
                    mockSubjects[idx].balance = e.target.value; // 更新数据模型
                    persistOpeningBalances();
                    calculateTrialBalance(); // 触发重算
                });
            });

            // 辅助核算点击事件
            document.querySelectorAll('.btn-aux-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.dataset.index;
                    const sub = mockSubjects[idx];
                    // 这里应该弹出一个 Modal，为了演示简单，用 prompt 代替
                    const amount = prompt(`【模拟弹窗】\n请输入 ${sub.name} 的明细总额：\n(真实开发请替换为明细录入表格)`, sub.balance || 0);
                    if (amount !== null) {
                        mockSubjects[idx].balance = parseFloat(amount);
                        persistOpeningBalances();
                        // 刷新表格显示新金额
                        renderTable();
                    }
                });
            });

            // 启用按钮
            btnEnable.onclick = () => {
                if(!btnEnable.disabled) {
                    alert("🎉 账套启用成功！\n系统现在将锁定期初余额，并开启凭证录入权限。");
                    // 这里调用后端 API: POST /api/finance/enable
                }
            };
            
            // 保存按钮
            document.getElementById('btn-save').onclick = () => {
                persistOpeningBalances();
                alert("数据已暂存");
                // 这里调用后端 API: POST /api/finance/opening-balance/save
            };
        }

        // 初始化运行
        renderTable();
        }, 0);
    }


    // =========================================================================
    // [2.0 版本] 会计引擎配置 - 树形导航 + 搜索
    // =========================================================================
    // ★★★ 请将以下代码块插入到 view_manager.js 中 ★★★
    else if (moduleCode === 'SettlementEngineConfig') {
        /** 渲染会计引擎账套管理界面 */
        window.renderSettlementEngineConfig = function () {
            let books = window.getAccountBooks();
            let html = `
        <div style="padding:15px; background:#fff; border-radius:4px;">
            <div style="margin-bottom:15px; display:flex; justify-content:space-between;">
                <h3 style="margin:0;">会计引擎账套管理</h3>
                <button onclick="window.addAccountBook()" style="padding:6px 12px; background:#1890ff; color:#fff; border:none; border-radius:4px; cursor:pointer;">+ 新增账套</button>
            </div>
            <table class="grid-table" style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="background:#fafafa; text-align:left;">
                        <th style="padding:12px; border-bottom:1px solid #eee;">账套编码</th>
                        <th style="padding:12px; border-bottom:1px solid #eee;">账套名称</th>
                        <th style="padding:12px; border-bottom:1px solid #eee;">状态</th>
                        <th style="padding:12px; border-bottom:1px solid #eee;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${books.map(b => `
                        <tr style="border-bottom:1px solid #f0f0f0;">
                            <td style="padding:12px;">${b.code}</td>
                            <td style="padding:12px;">${b.name}</td>
                            <td style="padding:12px;"><span style="color:${b.status === '已审核' ? 'green' : 'orange'}">${b.status}</span></td>
                            <td style="padding:12px;">
                                <a href="javascript:;" onclick="window.editAccountBook('${b.id}')">编辑</a> | 
                                <a href="javascript:;" onclick="window.copyAccountBook('${b.id}')">复制</a> | 
                                <a href="javascript:;" onclick="window.deleteAccountBook('${b.id}')" style="color:red;">删除</a>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
            document.getElementById('main_content').innerHTML = html;
        };
        // 1. 检查 engine_config.js 是否已加载
        if (typeof renderEngineTree === 'undefined') {
            contentHTML += `
            <div style="padding: 20px; color: red;">
                错误：engine_config.js 未加载或 renderEngineTree 函数未定义。<br>
                请检查 index.html 底部是否引入了 <script src="js/core/modules/finance/engine_config.js"></script>
            </div>`;
        }
        else {
            // 2. 渲染左右分栏布局
            contentHTML += `
            <style>
                .engine-container { display: flex; height: calc(100vh - 140px); border: 1px solid #ddd; background: #fff; }
                .engine-sidebar { width: 300px; background: #f8f9fa; border-right: 1px solid #ddd; overflow-y: auto; padding: 10px; }
                .engine-content { flex: 1; padding: 20px; overflow-y: auto; }
                .tree-node { cursor: pointer; padding: 6px 8px; border-radius: 4px; font-size: 13px; color: #333; display:flex; align-items:center; justify-content:space-between; gap:8px; }
                .tree-node:hover { background-color: #e9ecef; }
                .tree-node.active { background-color: #007bff; color: #fff; }
                .level-1 { font-weight: bold; margin-top: 10px; font-size: 14px; }
                .level-2 { margin-left: 15px; font-weight: bold; color: #555; margin-top: 5px; }
                .level-3 { margin-left: 30px; font-weight: normal; border-left: 1px solid #eee; justify-content: flex-start; gap: 6px; }
                .engine-category { margin-left: 4px; }
                .engine-subcategory { margin-left: 4px; }
                .engine-toggle-icon { margin-left: auto; color: #7f8c8d; font-size: 12px; }
                .config-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .config-table th, .config-table td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
                .config-table th { background-color: #f1f1f1; font-weight: bold; }
                .badge-debit { color: green; font-weight: bold; }
                .badge-credit { color: red; font-weight: bold; }
            </style>

            <div class="engine-container">
                <div class="engine-sidebar">
                    ${renderEngineTree()} 
                </div>
                
                <div class="engine-content" id="engine-content-area">
                    <div style="text-align:center; margin-top: 100px; color:#999;">
                        <p>⬅️ 请在左侧选择具体的费用类型</p>
                        <p>以配置其会计分录生成规则</p>
                    </div>
                </div>
            </div>
        `;
        }
    }

    // =========================================================================
    // 核心页面逻辑结束
    // =========================================================================

    contentArea.innerHTML = contentHTML;

    if (moduleCode === "AccountingStandardSetting") {
        setTimeout(() => {
            if (typeof window.refreshTaxAccrualPreview === "function") {
                const panel = document.querySelector(".tax-accrual-panel");
                if (panel && !panel.dataset.bound) {
                    panel.dataset.bound = "1";
                    panel.addEventListener("change", () => window.refreshTaxAccrualPreview());
                    panel.addEventListener("input", () => window.refreshTaxAccrualPreview());
                }
                window.refreshTaxAccrualPreview();
            }
        }, 0);
    }

    if (moduleCode === "ExpenseDaily") {
        setTimeout(() => {
            if (typeof window.initExpenseDailyModule === "function") {
                window.initExpenseDailyModule();
            }
        }, 0);
    }


    // ============================================================
    //  以下是新增的“全流程联动控制台”逻辑
    // ============================================================

    /**
     * 1. 渲染联动演示界面
     * (替代之前的 renderLinkageDemo 类方法)
     */
    window.renderLinkageDemo = function () {
        // 获取主内容容器 (根据你之前的代码，通常是 main-content 或 app)
        // 这里尝试获取你代码中常用的容器 ID，如果你的容器 ID 不叫 'content-area'，请修改这里
        const container = document.querySelector('.main-content') || document.getElementById('content-area') || document.body;

        const html = `
        <div class="demo-container" style="padding: 20px; display: flex; gap: 20px; font-family: 'Segoe UI', sans-serif;">
            
            <div class="panel" style="flex: 1; border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9;">
                <h3 style="margin-top:0; border-bottom: 2px solid #1890ff; padding-bottom: 10px;">Step 1: 模拟业务发生</h3>
                <p style="color:#666; font-size:12px;">尝试修改下方单据信息，观察右侧变化</p>
                
                <div class="form-group" style="margin-bottom:10px;">
                    <label>单据类型：</label>
                    <input type="text" value="运单" disabled style="width:100px; background:#eee; border:1px solid #ccc;">
                </div>

                <div class="form-group" style="margin-bottom:10px;">
                    <label>运单号：</label>
                    <input type="text" id="demo_waybillNo" value="YD2025001" style="border:1px solid #1890ff; padding: 4px;">
                    <div style="font-size:12px; color:green; margin-top:2px;">(影响摘要映射)</div>
                </div>

                <div class="form-group" style="margin-bottom:10px;">
                    <label>支付方式：</label>
                    <select id="demo_paymentType" style="border:1px solid #1890ff; padding: 4px;">
                        <option value="现付">现付</option>
                        <option value="月结">月结</option>
                    </select>
                    <div style="font-size:12px; color:red; margin-top:2px;">(影响记账规则)</div>
                </div>

                <div class="form-group" style="margin-bottom:10px;">
                    <label>单据状态：</label>
                    <select id="demo_status" style="border:1px solid #1890ff; padding: 4px;" onchange="window.toggleSettlementOption()">
                        <option value="运输中">运输中</option>
                        <option value="已签收">已签收 (触发挂账)</option>
                        <option value="已挂帐">已挂帐 (触发挂帐)</option>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom:10px;">
                    <label>客户名称：</label>
                    <input type="text" id="demo_clientName" value="顺丰速运" style="border:1px solid #1890ff; padding: 4px;">
                    <div style="font-size:12px; color:blue; margin-top:2px;">(影响辅助核算)</div>
                </div>

                <div class="form-group" style="margin-bottom:10px;">
                    <label>金额：</label>
                    <input type="number" id="demo_amount" value="500" style="padding: 4px;">
                </div>

                <hr>
                <div id="settlement_option" style="display:none; background:#fffbe6; padding:10px; border:1px solid #ffe58f;">
                    <label>🔴 挂帐收支方式：</label>
                    <select id="demo_pmId" style="padding: 4px;">
                        <option value="pm_wx">微信支付</option>
                        <option value="pm_cash">现金</option>
                    </select>
                    <div style="font-size:12px; color:#d48806;">(仅当触发挂帐规则时有效)</div>
                </div>

                <button onclick="window.runEngineDemo()" style="width:100%; margin-top:15px; background:#1890ff; color:white; border:none; padding:10px; cursor:pointer; font-size:16px; border-radius:4px;">🚀 生成凭证 (Run Engine)</button>
            </div>

            <div class="panel" style="flex: 1.2; border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #fff;">
                <h3 style="margin-top:0; border-bottom: 2px solid #52c41a; padding-bottom: 10px;">Step 2: 引擎执行过程</h3>
                
                <div id="engine_logs" style="background:#2b2b2b; color:#00ff00; padding:10px; font-family:monospace; height:200px; overflow-y:auto; border-radius:4px; font-size:12px; margin-bottom:15px;">
                    Waiting for execution...
                </div>

                <h3 style="margin-top:0; border-bottom: 2px solid #faad14; padding-bottom: 10px;">Step 3: 最终生成凭证</h3>
                <div id="voucher_result">
                    <div style="text-align:center; color:#999; padding:20px;">暂无凭证数据</div>
                </div>
            </div>
        </div>
    `;

        container.innerHTML = html;
    };

    /**
     * 2. 辅助函数：切换挂帐选项显示状态
     */
    window.toggleSettlementOption = function () {
        const status = document.getElementById('demo_status').value;
        const isSettle = status === '已挂帐';
        document.getElementById('settlement_option').style.display = isSettle ? 'block' : 'none';
    };

    /**
     * 3. 执行联动演示 (点击按钮触发)
     */
    window.runEngineDemo = function () {
        // 1. 收集表单数据
        const doc = {
            type: '运单',
            waybillNo: document.getElementById('demo_waybillNo').value,
            paymentType: document.getElementById('demo_paymentType').value,
            status: document.getElementById('demo_status').value,
            clientName: document.getElementById('demo_clientName').value,
            orgName: '上海分公司',
            amount: parseFloat(document.getElementById('demo_amount').value)
        };
        const pmId = document.getElementById('demo_pmId').value;

        // 2. 确保引擎已加载
        // 这里的 window.settlementSystem 需要在 settlement.js 里初始化
        if (!window.settlementSystem || !window.settlementSystem.generateVoucherChain) {
            // 如果找不到实例，尝试临时创建一个（为了防止报错卡住）
            if (typeof SettlementSystem !== 'undefined') {
                window.settlementSystem = new SettlementSystem();
            } else {
                alert("❌ 错误：settlement.js 中的引擎未加载，请确保 settlement.js 已引入页面。");
                return;
            }
        }

        // 3. 调用引擎
        const result = window.settlementSystem.generateVoucherChain(doc, pmId);

        // 4. 渲染日志
        const logContainer = document.getElementById('engine_logs');
        logContainer.innerHTML = result.logs.map(log => `<div>${log}</div>`).join('');

        // 5. 渲染凭证结果
        const voucherContainer = document.getElementById('voucher_result');
        if (result.error) {
            voucherContainer.innerHTML = `<div style="color:red; font-weight:bold; padding:10px; background:#fff1f0; border:1px solid #ffa39e;">${result.error}</div>`;
        } else {
            const entries = result.voucher.entries;
            voucherContainer.innerHTML = `
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead style="background:#f0f2f5;">
                    <tr><th>摘要</th><th>科目</th><th>辅助核算</th><th>借方</th><th>贷方</th></tr>
                </thead>
                <tbody>
                    ${entries.map(e => `
                        <tr style="border-bottom:1px solid #eee;">
                            <td style="padding:8px;">${e.digest}</td>
                            <td style="padding:8px;">${e.code}<br><span style="color:#999;font-size:10px;">${e.name}</span></td>
                            <td style="padding:8px; color:blue;">${e.aux || '-'}</td>
                            <td style="padding:8px; font-weight:bold; color:${e.debit ? 'green' : ''}">${e.debit || ''}</td>
                            <td style="padding:8px; font-weight:bold; color:${e.credit ? 'red' : ''}">${e.credit || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        }
    };

    // ============================================================
    // 结转损益 - 执行/冲回/查看凭证
    // ============================================================
    window.executeTransfer = function (periodText) {
        if (typeof window.requestPeriodEndClosing === "function") {
            window.requestPeriodEndClosing(periodText);
        } else {
            alert("系统未加载期末结转模块。");
        }
    };

    window.reverseTransfer = function (periodText) {
        if (typeof window.reversePeriodEndClosing === "function") {
            window.reversePeriodEndClosing(periodText);
        } else {
            alert("系统未加载期末结转模块。");
        }
    };

    window.viewPLVoucher = function (voucherId) {
        if (!voucherId) return alert("未找到结转凭证号");
        if (typeof openVoucherDetail === "function") {
            openVoucherDetail(voucherId);
        } else if (typeof loadContent === "function") {
            window.g_currentVoucher = { id: voucherId };
            loadContent("VoucherDetail");
        }
    };

    function parseProfitPeriod(periodText) {
        const match = (periodText || "").match(/(\d{4})年(\d+)期/);
        if (!match) return null;
        const year = match[1];
        const periodNo = parseInt(match[2], 10);
        return {
            year,
            periodNo,
            periodKey: `${year}-${periodNo}`,
            periodLabel: `${year}年${periodNo}期`
        };
    }

    function getCurrentPeriodMeta() {
        return { year: "2026", periodNo: 1, label: "2026年1期", key: "2026-1" };
    }

    function getCurrentPeriodString(meta) {
        if (!meta) return "";
        return `${meta.year}-${String(meta.periodNo).padStart(2, "0")}`;
    }

    window.syncAccountPeriodStatusByMeta = function (status) {
        if (typeof window.getAccountPeriods !== "function" || typeof window.saveAccountPeriods !== "function") {
            return false;
        }
        const meta = getCurrentPeriodMeta();
        const periodStr = getCurrentPeriodString(meta);
        if (!periodStr) return false;
        const list = window.getAccountPeriods();
        let changed = false;
        list.forEach(item => {
            if (item.period === periodStr) {
                item.status = status;
                changed = true;
            }
        });
        if (changed) {
            window.saveAccountPeriods(list);
        }
        return changed;
    };

    window.refreshClosingCheck = function () {
        const meta = getCurrentPeriodMeta();
        const periodStr = getCurrentPeriodString(meta);
        const vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const targetVouchers = vouchers.filter(v => !periodStr || !v.date || v.date.startsWith(periodStr));
        const profitTransferred = sessionStorage.getItem(`${meta.key}-ProfitTransferred`) === "true";

        const isVoidStatus = (status) => ["已作废", "已冲销", "作废"].includes(status);
        const isAuditedStatus = (status) => ["已审核", "已记账", "已过账"].includes(status);
        const isPostedStatus = (status) => ["已记账", "已过账"].includes(status);
        const toNumber = (value) => parseFloat((value || "0").toString().replace(/,/g, "")) || 0;

        const pendingAuditCount = targetVouchers.filter(v => !isVoidStatus(v.status) && !isAuditedStatus(v.status)).length;
        const unpostedCount = targetVouchers.filter(v => !isVoidStatus(v.status) && isAuditedStatus(v.status) && !isPostedStatus(v.status)).length;
        const cashierUnsignedCount = targetVouchers.filter(v => !isVoidStatus(v.status) && isAuditedStatus(v.status) && !v.cashierUser).length;
        const voidCount = targetVouchers.filter(v => isVoidStatus(v.status)).length;

        let totalDebit = 0;
        let totalCredit = 0;
        targetVouchers.forEach(v => {
            if (isVoidStatus(v.status)) return;
            if (!isAuditedStatus(v.status)) return;
            if (!Array.isArray(v.lines)) return;
            v.lines.forEach(line => {
                totalDebit += toNumber(line.debit || line.jf);
                totalCredit += toNumber(line.credit || line.df);
            });
        });
        const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

        const dataIssueIds = [];
        const dataIssues = [];
        targetVouchers.forEach(v => {
            if (isVoidStatus(v.status)) return;
            if (!Array.isArray(v.lines) || !v.lines.length) {
                const vid = v.id || "未知凭证";
                dataIssueIds.push(vid);
                dataIssues.push({ id: vid, reason: "无分录明细" });
                return;
            }
            let vDebit = 0;
            let vCredit = 0;
            v.lines.forEach(line => {
                vDebit += toNumber(line.debit || line.jf);
                vCredit += toNumber(line.credit || line.df);
            });
            const lineBalanced = Math.abs(vDebit - vCredit) < 0.01;
            if (!lineBalanced) {
                const vid = v.id || "未知凭证";
                dataIssueIds.push(vid);
                const reasons = [];
                if (!lineBalanced) reasons.push("借贷不平衡");
                dataIssues.push({ id: vid, reason: reasons.join("；") || "数据异常" });
            }
        });
        window._dataIssueList = dataIssues;

        window.openDataIssueModal = function() {
            const list = window._dataIssueList || [];
            if (!list.length) return;
            if (document.getElementById("data-issue-modal")) return;
            const modal = document.createElement("div");
            modal.id = "data-issue-modal";
            modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.45); display:flex; align-items:center; justify-content:center; z-index:9999;";
            const rows = list.slice(0, 200).map(item => `
                <tr>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.id}</td>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.reason}</td>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:right;">
                        <button class="btn-primary btn-ghost" onclick="(typeof openVoucherDetail === 'function' ? openVoucherDetail('${item.id}') : loadContent('FinanceVoucherAudit'))">查看</button>
                    </td>
                </tr>
            `).join("");
            modal.innerHTML = `
                <div style="background:#fff; padding:18px 20px; border-radius:12px; width:min(860px, 90vw); max-height:80vh; overflow:auto; box-shadow:0 12px 32px rgba(15,23,42,0.18);">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                        <div style="font-size:16px; font-weight:600;">数据核算异常明细</div>
                        <button class="btn-primary btn-ghost" onclick="closeDataIssueModal()">关闭</button>
                    </div>
                    <div style="color:#64748b; font-size:12px; margin-bottom:10px;">仅展示前 200 条异常记录。</div>
                    <table style="width:100%; border-collapse:collapse; font-size:13px;">
                        <thead>
                            <tr style="background:#f8fafc;">
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:180px;">凭证号</th>
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0;">异常原因</th>
                                <th style="text-align:right; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:90px;">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || `<tr><td colspan="3" style="text-align:center; padding:16px; color:#94a3b8;">暂无异常数据</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;
            document.body.appendChild(modal);
        };

        window.closeDataIssueModal = function() {
            const modal = document.getElementById("data-issue-modal");
            if (modal) modal.remove();
        };

        const parseVoucherSeq = (id) => {
            if (!id) return null;
            const match = id.toString().match(/(\d+)(?!.*\d)/);
            if (!match) return null;
            const num = parseInt(match[1], 10);
            return Number.isFinite(num) ? num : null;
        };

        const seqList = targetVouchers
            .filter(v => !isVoidStatus(v.status))
            .map(v => ({ id: v.id || "", date: v.date || "", seq: parseVoucherSeq(v.id) }))
            .filter(item => item.seq !== null);

        seqList.sort((a, b) => a.seq - b.seq);
        let gapCount = 0;
        const gapSamples = [];
        const gapDetails = [];
        for (let i = 1; i < seqList.length; i += 1) {
            const diff = seqList[i].seq - seqList[i - 1].seq;
            if (diff > 1) {
                gapCount += diff - 1;
                if (gapSamples.length < 3) {
                    const start = seqList[i - 1].seq + 1;
                    const end = seqList[i].seq - 1;
                    gapSamples.push(start === end ? `${start}` : `${start}-${end}`);
                }
                gapDetails.push({
                    start: seqList[i - 1].seq + 1,
                    end: seqList[i].seq - 1,
                    prevId: seqList[i - 1].id || "-",
                    prevDate: seqList[i - 1].date || "-",
                    nextId: seqList[i].id || "-",
                    nextDate: seqList[i].date || "-"
                });
            }
        }

        const seqByDate = seqList
            .filter(item => item.date)
            .sort((a, b) => a.date.localeCompare(b.date) || a.seq - b.seq);
        let orderIssueCount = 0;
        const orderSamples = [];
        const orderDetails = [];
        let maxSeq = -Infinity;
        let maxItem = null;
        seqByDate.forEach(item => {
            if (item.seq < maxSeq) {
                orderIssueCount += 1;
                if (orderSamples.length < 3) orderSamples.push(item.id || `${item.seq}`);
                orderDetails.push({
                    id: item.id || "-",
                    date: item.date || "-",
                    seq: item.seq,
                    refId: maxItem ? maxItem.id || "-" : "-",
                    refDate: maxItem ? maxItem.date || "-" : "-",
                    refSeq: maxSeq
                });
            }
            if (item.seq > maxSeq) {
                maxSeq = item.seq;
                maxItem = item;
            }
        });

        window._gapIssueList = gapDetails;
        window._orderIssueList = orderDetails;

        window.openGapIssueModal = function() {
            const list = window._gapIssueList || [];
            if (!list.length) return;
            if (document.getElementById("gap-issue-modal")) return;
            const modal = document.createElement("div");
            modal.id = "gap-issue-modal";
            modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.45); display:flex; align-items:center; justify-content:center; z-index:9999;";
            const rows = list.slice(0, 200).map(item => {
                const rangeText = item.start === item.end ? `${item.start}` : `${item.start}-${item.end}`;
                return `
                    <tr>
                        <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${rangeText}</td>
                        <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.prevId} (${item.prevDate})</td>
                        <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.nextId} (${item.nextDate})</td>
                        <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:right;">
                            <button class="btn-primary btn-ghost" onclick="(typeof openVoucherDetail === 'function' ? openVoucherDetail('${item.prevId}') : loadContent('FinanceVoucherAudit'))">前一张</button>
                            <button class="btn-primary btn-ghost" onclick="(typeof openVoucherDetail === 'function' ? openVoucherDetail('${item.nextId}') : loadContent('FinanceVoucherAudit'))">后一张</button>
                        </td>
                    </tr>
                `;
            }).join("");
            modal.innerHTML = `
                <div style="background:#fff; padding:18px 20px; border-radius:12px; width:min(920px, 92vw); max-height:80vh; overflow:auto; box-shadow:0 12px 32px rgba(15,23,42,0.18);">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                        <div style="font-size:16px; font-weight:600;">断号明细</div>
                        <button class="btn-primary btn-ghost" onclick="closeGapIssueModal()">关闭</button>
                    </div>
                    <div style="color:#64748b; font-size:12px; margin-bottom:10px;">仅展示前 200 条断号记录。</div>
                    <table style="width:100%; border-collapse:collapse; font-size:13px;">
                        <thead>
                            <tr style="background:#f8fafc;">
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:140px;">缺失号段</th>
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0;">前一张凭证</th>
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0;">后一张凭证</th>
                                <th style="text-align:right; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:160px;">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || `<tr><td colspan="4" style="text-align:center; padding:16px; color:#94a3b8;">暂无断号数据</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;
            document.body.appendChild(modal);
        };

        window.closeGapIssueModal = function() {
            const modal = document.getElementById("gap-issue-modal");
            if (modal) modal.remove();
        };

        window.openOrderIssueModal = function() {
            const list = window._orderIssueList || [];
            if (!list.length) return;
            if (document.getElementById("order-issue-modal")) return;
            const modal = document.createElement("div");
            modal.id = "order-issue-modal";
            modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.45); display:flex; align-items:center; justify-content:center; z-index:9999;";
            const rows = list.slice(0, 200).map(item => `
                <tr>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.id}</td>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.date}</td>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.seq}</td>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0;">${item.refId} (${item.refDate}) / ${item.refSeq}</td>
                    <td style="padding:8px 10px; border-bottom:1px solid #e2e8f0; text-align:right;">
                        <button class="btn-primary btn-ghost" onclick="(typeof openVoucherDetail === 'function' ? openVoucherDetail('${item.id}') : loadContent('FinanceVoucherAudit'))">查看</button>
                    </td>
                </tr>
            `).join("");
            modal.innerHTML = `
                <div style="background:#fff; padding:18px 20px; border-radius:12px; width:min(920px, 92vw); max-height:80vh; overflow:auto; box-shadow:0 12px 32px rgba(15,23,42,0.18);">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                        <div style="font-size:16px; font-weight:600;">序时异常明细</div>
                        <button class="btn-primary btn-ghost" onclick="closeOrderIssueModal()">关闭</button>
                    </div>
                    <div style="color:#64748b; font-size:12px; margin-bottom:10px;">仅展示前 200 条序时异常记录。</div>
                    <table style="width:100%; border-collapse:collapse; font-size:13px;">
                        <thead>
                            <tr style="background:#f8fafc;">
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:160px;">凭证号</th>
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:140px;">日期</th>
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:120px;">序号</th>
                                <th style="text-align:left; padding:8px 10px; border-bottom:1px solid #e2e8f0;">参考凭证（最大号）</th>
                                <th style="text-align:right; padding:8px 10px; border-bottom:1px solid #e2e8f0; width:90px;">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows || `<tr><td colspan="5" style="text-align:center; padding:16px; color:#94a3b8;">暂无序时异常</td></tr>`}
                        </tbody>
                    </table>
                </div>
            `;
            document.body.appendChild(modal);
        };

        window.closeOrderIssueModal = function() {
            const modal = document.getElementById("order-issue-modal");
            if (modal) modal.remove();
        };

        const auxKeys = ["dept", "customer", "vendor", "employee", "project", "inventory"];
        const auxSet = new Set();
        const readAuxList = (key) => {
            const raw = sessionStorage.getItem(`AuxiliaryData:${key}`) || localStorage.getItem(`AuxiliaryData:${key}`);
            if (!raw) return [];
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        };
        auxKeys.forEach(key => {
            const list = readAuxList(key);
            list.forEach(item => {
                if (item && item.enabled === false) return;
                const code = (item.code || "").toString().trim();
                const name = (item.name || "").toString().trim();
                if (code) auxSet.add(code);
                if (name) auxSet.add(name);
                if (code && name) auxSet.add(`${code} ${name}`.trim());
                if (item.id) auxSet.add(item.id.toString().trim());
            });
        });

        const auxIssueIds = new Set();
        let auxTokenCount = 0;
        const splitAux = (value) => (value || "")
            .toString()
            .split(/[,，、\\/]/)
            .map(item => item.trim())
            .filter(Boolean);
        const auxTokenValid = (token) => {
            if (!token) return true;
            if (auxSet.has(token)) return true;
            const parts = token.split(/\s+/).filter(Boolean);
            if (parts.length > 1 && parts.every(part => auxSet.has(part))) return true;
            return false;
        };
        targetVouchers.forEach(v => {
            if (isVoidStatus(v.status)) return;
            if (!Array.isArray(v.lines)) return;
            v.lines.forEach(line => {
                const tokens = []
                    .concat(splitAux(line.auxCode))
                    .concat(splitAux(line.auxName))
                    .concat(splitAux(line.aux))
                    .concat(splitAux(line.auxiliary));
                tokens.forEach(token => {
                    auxTokenCount += 1;
                    if (!auxTokenValid(token)) {
                        auxIssueIds.add(v.id || "未知凭证");
                    }
                });
            });
        });

        const checks = [
            {
                title: "未审核凭证",
                status: pendingAuditCount ? "fail" : "pass",
                message: pendingAuditCount ? `存在 ${pendingAuditCount} 张未审核凭证。` : "无未审核凭证。",
                action: pendingAuditCount ? `<a href="javascript:void(0)" onclick="loadContent('FinanceVoucherAudit')" style="color:#3498db;">去处理</a>` : "-"
            },
            {
                title: "未记账凭证",
                status: unpostedCount ? "fail" : "pass",
                message: unpostedCount ? `存在 ${unpostedCount} 张已审核未记账凭证。` : "无未记账凭证。",
                action: unpostedCount ? `<a href="javascript:void(0)" onclick="loadContent('FinanceVoucherAudit')" style="color:#3498db;">去处理</a>` : "-"
            },
            {
                title: "未出纳签字凭证",
                status: cashierUnsignedCount ? "fail" : "pass",
                message: cashierUnsignedCount ? `存在 ${cashierUnsignedCount} 张未完成出纳签字的凭证。` : "无未出纳签字凭证。",
                action: cashierUnsignedCount ? `<a href="javascript:void(0)" onclick="loadContent('FinanceVoucherAudit')" style="color:#3498db;">去处理</a>` : "-"
            },
            {
                title: "作废凭证",
                status: voidCount ? "warn" : "pass",
                message: voidCount ? `发现 ${voidCount} 张作废/冲销凭证，请确认已归档。` : "无作废凭证。",
                action: voidCount ? `<a href="javascript:void(0)" onclick="loadContent('FinanceVoucherAudit')" style="color:#3498db;">查看</a>` : "-"
            },
            {
                title: "数据核算检查",
                status: dataIssueIds.length ? "fail" : "pass",
                message: dataIssueIds.length
                    ? `发现 ${dataIssueIds.length} 张凭证借贷不平衡（例如：${dataIssueIds.slice(0, 6).join("，")}${dataIssueIds.length > 6 ? "…" : ""}）。`
                    : "凭证借贷平衡。",
                action: dataIssueIds.length ? `<a href="javascript:void(0)" onclick="openDataIssueModal()" style="color:#3498db;">查看明细</a>` : "-"
            },
            {
                title: "凭证断号检查",
                status: gapCount ? "fail" : "pass",
                message: gapCount ? `检测到断号 ${gapCount} 处（例如：${gapSamples.join("，")}）` : "凭证号连续。",
                action: gapCount ? `<a href="javascript:void(0)" onclick="openGapIssueModal()" style="color:#3498db;">查看明细</a>` : "-"
            },
            {
                title: "凭证序时检查",
                status: orderIssueCount ? "fail" : "pass",
                message: orderIssueCount ? `发现 ${orderIssueCount} 条序时异常（例如：${orderSamples.join("，")}）` : "序时正常。",
                action: orderIssueCount ? `<a href="javascript:void(0)" onclick="openOrderIssueModal()" style="color:#3498db;">查看明细</a>` : "-"
            },
            {
                title: "辅助核算项历史检查",
                status: auxIssueIds.size ? "fail" : (auxTokenCount && auxSet.size === 0 ? "warn" : "pass"),
                message: auxIssueIds.size
                    ? `发现 ${auxIssueIds.size} 张凭证的辅助核算项不在历史档案中。`
                    : (auxTokenCount && auxSet.size === 0 ? "未维护辅助核算基础数据，本次仅提示。"
                        : "辅助核算项均在历史档案中。"),
                action: auxIssueIds.size || auxTokenCount
                    ? `<a href="javascript:void(0)" onclick="loadContent('AcctAuxiliary')" style="color:#3498db;">去维护</a>`
                    : "-"
            },
            {
                title: "损益类科目结转",
                status: profitTransferred ? "pass" : "fail",
                message: profitTransferred ? `${meta.label} 已完成损益结转。` : "损益类科目有余额，请先执行结转。",
                action: profitTransferred ? "-" : `<a href="javascript:void(0)" onclick="loadContent('PeriodEndProfit')" style="color:#3498db;">去处理</a>`
            },
            {
                title: "试算平衡检查",
                status: isBalanced ? "pass" : "fail",
                message: isBalanced ? "借贷平衡。" : `借贷不平衡（借:${totalDebit.toFixed(2)} 贷:${totalCredit.toFixed(2)}）`,
                action: isBalanced ? "-" : `<a href="javascript:void(0)" onclick="loadContent('AcctSubjectBalance')" style="color:#3498db;">去查看</a>`
            }
        ];

        const renderStatus = (status) => {
            if (status === "pass") return '<span style="color:#27ae60;">✅ 通过</span>';
            if (status === "warn") return '<span style="color:#f39c12;">⚠️ 提醒</span>';
            return '<span style="color:#e74c3c;">❌ 失败</span>';
        };

        const rowsHtml = checks.map(item => `
            <tr>
                <td>${item.title}</td>
                <td>${renderStatus(item.status)}</td>
                <td>${item.message}</td>
                <td>${item.action}</td>
            </tr>
        `).join("");

        const listBody = document.getElementById("checkListBody");
        if (listBody) listBody.innerHTML = rowsHtml;

        const allPassed = checks.every(item => item.status !== "fail");
        const closeBtn = document.getElementById("btnExecuteClose");
        if (closeBtn) {
            closeBtn.disabled = !allPassed;
            closeBtn.style.cursor = allPassed ? "pointer" : "not-allowed";
            closeBtn.style.backgroundColor = allPassed ? "#27ae60" : "#95a5a6";
        }

        window._monthCloseReady = allPassed;
    };

    window.executeMonthEndClose = function () {
        if (!window._monthCloseReady) {
            return alert("❌ 仍有未通过的结账检查项，请先处理。");
        }
        const meta = getCurrentPeriodMeta();
        sessionStorage.setItem(`${meta.key}-MonthClosed`, "true");
        window.syncAccountPeriodStatusByMeta("已关闭");
        alert(`✅ ${meta.label} 已完成月末结账。`);
        if (typeof loadContent === "function") loadContent("PeriodEndClose");
    };

    window.executeReOpen = function () {
        const meta = getCurrentPeriodMeta();
        sessionStorage.setItem(`${meta.key}-MonthClosed`, "false");
        window.syncAccountPeriodStatusByMeta("已开启");
        alert(`✅ ${meta.label} 已反结账。`);
        if (typeof loadContent === "function") loadContent("PeriodEndClose");
    };

    window.toggleAcctPeriodStatus = function (inputEl, periodLabel) {
        const row = inputEl && inputEl.closest ? inputEl.closest("tr") : null;
        if (!row) return;
        const statusCell = row.querySelector(".period-status");
        if (!statusCell) return;

        const dot = statusCell.querySelector(".period-dot");
        if (inputEl.checked) {
            statusCell.dataset.state = "进行中";
            statusCell.innerHTML = `${dot ? dot.outerHTML : '<span class="period-dot"></span>'}进行中`;
        } else {
            statusCell.dataset.state = "未开启";
            statusCell.innerHTML = `${dot ? dot.outerHTML : '<span class="period-dot"></span>'}未开启`;
        }

        const updatedDot = statusCell.querySelector(".period-dot");
        if (updatedDot) {
            updatedDot.style.display = "inline-block";
            updatedDot.style.width = "8px";
            updatedDot.style.height = "8px";
            updatedDot.style.borderRadius = "50%";
            updatedDot.style.marginRight = "5px";
            updatedDot.style.background = inputEl.checked ? "#27ae60" : "gray";
        }

        if (periodLabel) {
            const message = inputEl.checked ? "已开启" : "已关闭";
            console.log(`会计期间 ${periodLabel} ${message}`);
        }
    };

    window.filterAcctPeriods = function () {
        const bookId = document.getElementById("period-filter-book")?.value || "";
        const period = document.getElementById("period-filter-period")?.value || "";
        const status = document.getElementById("period-filter-status")?.value || "";
        const rows = document.querySelectorAll("#acct-period-body tr");
        rows.forEach(row => {
            const matchBook = !bookId || row.dataset.book === bookId;
            const matchPeriod = !period || row.dataset.period === period;
            const matchStatus = !status || row.dataset.status === status;
            row.style.display = matchBook && matchPeriod && matchStatus ? "" : "none";
        });
    };

    window.toggleAllPeriods = function (checked) {
        document.querySelectorAll(".period-select").forEach(cb => {
            cb.checked = checked;
        });
    };

    window.setPeriodStatusBulk = function (status) {
        const ids = Array.from(document.querySelectorAll(".period-select:checked")).map(cb => cb.dataset.id);
        if (ids.length === 0) {
            alert("请先勾选会计期间。");
            return;
        }
        if (status === "未开启") {
            const meta = getCurrentPeriodMeta();
            const currentPeriod = getCurrentPeriodString(meta);
            const selectedRows = Array.from(document.querySelectorAll(".period-select:checked"))
                .map(cb => cb.closest("tr"))
                .filter(Boolean);
            const hasCurrent = selectedRows.some(row => row.dataset.period === currentPeriod);
            if (hasCurrent) {
                if (!confirm("系统将进行期末检查，检查通过后自动结账并关闭期间，是否继续？")) {
                    return;
                }
                if (typeof window.refreshClosingCheck === "function") {
                    window.refreshClosingCheck();
                }
                if (!window._monthCloseReady) {
                    alert("期末检查未通过，无法关闭当前期间。");
                    return;
                }
                const metaKey = meta.key;
                sessionStorage.setItem(`${metaKey}-MonthClosed`, "true");
                window.syncAccountPeriodStatusByMeta("已关闭");
            }
            if (typeof window.setAccountPeriodsStatus === "function") {
                window.setAccountPeriodsStatus(ids, "未开启");
            }
            loadContent("AcctPeriod");
            return;
        }
        if (typeof window.setAccountPeriodsStatus === "function") {
            window.setAccountPeriodsStatus(ids, status);
        }
        loadContent("AcctPeriod");
    };

    window.createNextYearPeriods = function () {
        const bookId = document.getElementById("period-filter-book")?.value || "";
        if (!bookId) {
            alert("请选择账套后再新增期间。");
            return;
        }
        const books = window.getAccountBooks ? window.getAccountBooks() : [];
        const book = books.find(b => b.id === bookId);
        if (!book) return;
        const year = new Date().getFullYear() + 1;
        if (typeof window.ensureAccountPeriodsForBook === "function") {
            window.ensureAccountPeriodsForBook(book, year);
        }
        loadContent("AcctPeriod");
    };

    window.getTrialBalanceData = function (filters = {}) {
        const subjects = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]");
        const vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const period = filters.period || "";
        const activeStatuses = ["已审核", "已记账", "已过账"];
        const openingList = getOpeningBalanceStore();
        const openingMap = buildOpeningBalanceMap(openingList);
        const baseSubjects = subjects.length
            ? subjects
            : openingList.map(item => ({
                code: normalizeSubjectCode(item.code),
                name: item.name || `科目 ${normalizeSubjectCode(item.code)}`
            }));

        const voucherList = period
            ? vouchers.filter(v => v.date && v.date.startsWith(period) && activeStatuses.includes(v.status))
            : vouchers.filter(v => activeStatuses.includes(v.status));

        const sums = {};
        voucherList.forEach(v => {
            (v.lines || []).forEach(line => {
                const raw = line.account || "";
                const codeMatch = raw.match(/^\d+/);
                const code = codeMatch ? codeMatch[0] : raw.split(" ")[0];
                if (!code) return;
                if (!sums[code]) sums[code] = { debit: 0, credit: 0 };
                sums[code].debit += parseFloat(line.debit) || 0;
                sums[code].credit += parseFloat(line.credit) || 0;
            });
        });

        const rows = baseSubjects.map(subject => {
            const total = sums[subject.code] || { debit: 0, credit: 0 };
            const opening = openingMap[subject.code];
            const openingBalance = opening ? Math.abs(opening.balance) : 0;
            const openingDebit = opening && opening.direction === "借" ? openingBalance : 0;
            const openingCredit = opening && opening.direction === "贷" ? openingBalance : 0;
            const periodDebit = total.debit;
            const periodCredit = total.credit;
            const net = (openingDebit - openingCredit) + (periodDebit - periodCredit);
            const endingDebit = net > 0 ? net : 0;
            const endingCredit = net < 0 ? Math.abs(net) : 0;
            return {
                code: subject.code,
                name: subject.name,
                openingDebit,
                openingCredit,
                periodDebit,
                periodCredit,
                endingDebit,
                endingCredit
            };
        });

        const totals = rows.reduce((acc, row) => {
            acc.openingDebit += row.openingDebit;
            acc.openingCredit += row.openingCredit;
            acc.periodDebit += row.periodDebit;
            acc.periodCredit += row.periodCredit;
            acc.endingDebit += row.endingDebit;
            acc.endingCredit += row.endingCredit;
            return acc;
        }, {
            openingDebit: 0,
            openingCredit: 0,
            periodDebit: 0,
            periodCredit: 0,
            endingDebit: 0,
            endingCredit: 0
        });

        return { rows, totals };
    };

    window.renderTrialBalance = function (filters = {}) {
        const body = document.getElementById("trial-balance-body");
        const result = document.getElementById("trial-balance-result");
        if (!body) return;
        const data = window.getTrialBalanceData(filters);
        body.innerHTML = data.rows.map(item => `
            <tr>
                <td class="trial-col-code">${item.code}</td>
                <td class="trial-col-name">${item.name}</td>
                <td class="trial-num">${item.openingDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td class="trial-num">${item.openingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td class="trial-num">${item.periodDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td class="trial-num">${item.periodCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td class="trial-num">${item.endingDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td class="trial-num">${item.endingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
        `).join("");

        const balanceOk = Math.abs(data.totals.endingDebit - data.totals.endingCredit) < 0.01;
        if (result) {
            result.value = balanceOk ? "试算结果平衡" : "试算结果不平衡";
        }

        const footer = document.getElementById("trial-balance-foot");
        if (footer) {
            footer.innerHTML = `
                <tr style="font-weight:bold; background:#fafafa;">
                    <td colspan="2" style="text-align:center;">合计</td>
                    <td class="trial-num">${data.totals.openingDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td class="trial-num">${data.totals.openingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td class="trial-num">${data.totals.periodDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td class="trial-num">${data.totals.periodCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td class="trial-num">${data.totals.endingDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td class="trial-num">${data.totals.endingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
            `;
        }
    };

    window.filterTrialBalance = function () {
        const period = document.getElementById("trial-filter-period")?.value || "";
        window.renderTrialBalance({ period });
    };

    window.openVerifyModal = function (type, billId, amount, counterparty) {
        const modal = document.getElementById("verifyModal");
        if (!modal) return;
        const today = new Date().toISOString().split("T")[0];

        document.getElementById("verify_type").value = type || "AR";
        document.getElementById("verify_bill_id").value = billId || "";
        document.getElementById("verify_counterparty").value = counterparty || "";
        document.getElementById("verify_amount").value = parseFloat((amount || "0").toString().replace(/,/g, "")) || 0;
        document.getElementById("verify_date").value = today;
        document.getElementById("verify_ref").value = "";
        document.getElementById("verify_remark").value = `${counterparty || ""} 结算`;

        const methodSelect = document.getElementById("verify_method");
        const methods = JSON.parse(sessionStorage.getItem("ConfigPaymentMethods") || "[]");
        const options = methods.length
            ? methods.map(m => {
                const label = m.name || m.id;
                return `<option value="${m.id}">${label}</option>`;
            }).join("")
            : `<option value="">暂无收支方式</option>`;
        methodSelect.innerHTML = options;

        modal.style.display = "block";
    };

    window.closeVerifyModal = function () {
        const modal = document.getElementById("verifyModal");
        if (modal) modal.style.display = "none";
    };

    window.confirmVerify = function () {
        const type = document.getElementById("verify_type").value;
        const billId = document.getElementById("verify_bill_id").value;
        const counterparty = document.getElementById("verify_counterparty").value;
        const amount = parseFloat(document.getElementById("verify_amount").value) || 0;
        const date = document.getElementById("verify_date").value;
        const remark = document.getElementById("verify_remark").value;
        const methodId = document.getElementById("verify_method").value;
        const methods = JSON.parse(sessionStorage.getItem("ConfigPaymentMethods") || "[]");
        const method = methods.find(m => m.id === methodId);

        if (!method || !method.subjectCode || !method.subjectName) {
            return alert("❌ 收支方式未配置科目类别，请先维护收支方式科目。");
        }
        if (amount <= 0) return alert("❌ 结算金额必须大于 0。");

        if (type === "AR") {
            const arList = JSON.parse(sessionStorage.getItem("ARStatements") || "[]");
            const target = arList.find(i => i.id === billId);
            if (target) {
                const verified = parseFloat((target.verified || "0").toString().replace(/,/g, "")) || 0;
                const unverified = parseFloat((target.unverified || "0").toString().replace(/,/g, "")) || 0;
                const newVerified = verified + amount;
                const newUnverified = Math.max(unverified - amount, 0);
                target.verified = newVerified.toFixed(2);
                target.unverified = newUnverified.toFixed(2);
                target.status = newUnverified <= 0 ? "已结算" : "部分结算";
                sessionStorage.setItem("ARStatements", JSON.stringify(arList));
            }
        }

        const summary = remark || `${counterparty || ""} 结算`;
        const voucherId = "收" + new Date().getFullYear() + Math.floor(Math.random() * 10000 + 1000);
        const lines = type === "AR"
            ? [
                { summary, account: `${method.subjectCode} ${method.subjectName}`, debit: amount.toFixed(2), credit: "" },
                { summary, account: "1122 应收账款", debit: "", credit: amount.toFixed(2) }
            ]
            : [
                { summary, account: "2202 应付账款", debit: amount.toFixed(2), credit: "" },
                { summary, account: `${method.subjectCode} ${method.subjectName}`, debit: "", credit: amount.toFixed(2) }
            ];

        let vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        vouchers.unshift({
            id: voucherId,
            date: date || new Date().toISOString().split("T")[0],
            amount: amount.toFixed(2),
            summary: summary,
            user: "结算确认",
            status: "已记账",
            lines: lines
        });
        sessionStorage.setItem("ManualVouchers", JSON.stringify(vouchers));

        alert("✅ 结算完成，已生成凭证。");
        window.closeVerifyModal();
        if (typeof loadContent === "function") {
            loadContent(type === "AR" ? "ARCollectionVerify" : "APTrunkBatchSettlement");
        }
    };

    function normalizeSubjectCode(code) {
        return (code || "").toString().trim();
    }

    function getOpeningBalanceStore() {
        try {
            const stored = JSON.parse(sessionStorage.getItem("OpeningBalances") || "[]");
            return Array.isArray(stored) ? stored : [];
        } catch (error) {
            return [];
        }
    }

    function buildOpeningBalanceMap(items) {
        const map = {};
        items.forEach(item => {
            const code = normalizeSubjectCode(item.code);
            if (!code) return;
            map[code] = {
                balance: parseFloat(item.balance) || 0,
                direction: item.direction || ""
            };
        });
        return map;
    }

    function parseYearMonth(dateStr) {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        if (parts.length < 2) return "";
        return `${parts[0]}-${parts[1]}`;
    }

    function buildSubjectBalanceStore() {
        const vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const balanceRows = [];

        vouchers.forEach(v => {
            if (!v.lines) return;
            const period = parseYearMonth(v.date || "");
            v.lines.forEach(line => {
                const accountStr = (line.account || "").trim();
                const codeMatch = accountStr.match(/^(\d+)/);
                const code = normalizeSubjectCode(codeMatch ? codeMatch[1] : accountStr.split(" ")[0]);
                const name = accountStr.replace(code, "").trim() || accountStr || "未知科目";
                const debit = parseFloat((line.debit || "0").toString().replace(/,/g, "")) || 0;
                const credit = parseFloat((line.credit || "0").toString().replace(/,/g, "")) || 0;
                if (!period || !code) return;
                balanceRows.push({
                    period,
                    code,
                    name,
                    open: 0,
                    debit,
                    credit
                });
            });
        });

        sessionStorage.setItem("t_subject_balance", JSON.stringify(balanceRows));
        return balanceRows;
    }

    function getSubjectBalanceStore() {
        const stored = JSON.parse(sessionStorage.getItem("t_subject_balance") || "[]");
        if (stored.length) return stored;
        return buildSubjectBalanceStore();
    }

    function getAccountDirection(code, name) {
        const text = name || "";
        if (code.startsWith("1") || text.includes("成本") || text.includes("费用")) {
            return "借";
        }
        if (code.startsWith("5")) {
            return "借";
        }
        return "贷";
    }

    window.renderGeneralLedgerTable = function () {
        const periodStart = document.getElementById("gl_period_start")?.value || "";
        const periodEnd = document.getElementById("gl_period_end")?.value || "";
        const subjectStart = normalizeSubjectCode(document.getElementById("gl_subject_start")?.value || "");
        const subjectEnd = normalizeSubjectCode(document.getElementById("gl_subject_end")?.value || "");
        const levelMode = document.getElementById("gl_subject_level")?.value || "level1";

        const balanceRows = getSubjectBalanceStore();
        const filtered = balanceRows.filter(row => {
            if (periodStart && row.period < periodStart) return false;
            if (periodEnd && row.period > periodEnd) return false;
            if (subjectStart && row.code < subjectStart) return false;
            if (subjectEnd && row.code > subjectEnd) return false;
            if (levelMode === "level1" && row.code.length > 4) return false;
            return true;
        });

        const periodMap = {};
        filtered.forEach(row => {
            if (!periodMap[row.period]) periodMap[row.period] = [];
            periodMap[row.period].push(row);
        });

        const periods = Object.keys(periodMap).sort();
        const body = document.getElementById("gl_table_body");
        if (!body) return;

        if (periods.length === 0) {
            body.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#999;">暂无匹配数据。</td></tr>`;
            return;
        }

        let cumulativeDebit = 0;
        let cumulativeCredit = 0;
        let cumulativeBalance = 0;

        const rowsHtml = periods.map(period => {
            const entries = periodMap[period];
            let totalDebit = 0;
            let totalCredit = 0;
            let netBalance = 0;

            entries.forEach(item => {
                totalDebit += item.debit;
                totalCredit += item.credit;
                const dir = getAccountDirection(item.code, item.name);
                if (dir === "借") {
                    netBalance += (item.open + item.debit - item.credit);
                } else {
                    netBalance -= (item.open + item.credit - item.debit);
                }
            });

            const dirText = netBalance >= 0 ? "借" : "贷";
            const balanceText = Math.abs(netBalance).toLocaleString("en-US", { minimumFractionDigits: 2 });

            const openingBalanceText = Math.abs(cumulativeBalance).toLocaleString("en-US", { minimumFractionDigits: 2 });
            const openingDirText = cumulativeBalance >= 0 ? "借" : "贷";

            cumulativeDebit += totalDebit;
            cumulativeCredit += totalCredit;
            cumulativeBalance += netBalance;

            const ytdDirText = cumulativeBalance >= 0 ? "借" : "贷";
            const ytdBalanceText = Math.abs(cumulativeBalance).toLocaleString("en-US", { minimumFractionDigits: 2 });

            return `
                <tr>
                    <td>${period}</td>
                    <td>-</td>
                    <td>期初余额</td>
                    <td style="text-align:right;">-</td>
                    <td style="text-align:right;">-</td>
                    <td>${openingDirText}</td>
                    <td style="text-align:right; font-weight:bold;">${openingBalanceText}</td>
                </tr>
                <tr>
                    <td>${period}</td>
                    <td>-</td>
                    <td>本期合计</td>
                    <td style="text-align:right;">${totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td style="text-align:right;">${totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td>${dirText}</td>
                    <td style="text-align:right; font-weight:bold;">${balanceText}</td>
                </tr>
                <tr>
                    <td>${period}</td>
                    <td>-</td>
                    <td>本年累计</td>
                    <td style="text-align:right;">${cumulativeDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td style="text-align:right;">${cumulativeCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                    <td>${ytdDirText}</td>
                    <td style="text-align:right; font-weight:bold;">${ytdBalanceText}</td>
                </tr>
            `;
        }).join("");
        body.innerHTML = rowsHtml;
    };

    // ============================================================
    // 日常费用报销 - OA 联动
    // ============================================================
    function getExpenseDailyConfig() {
        const rawBase = (window.OA_BASE_URL || "").toString().trim();
        const host = window.location.hostname || "127.0.0.1";
        const defaultPort = (window.OA_BACKEND_PORT || "18080").toString();
        const baseUrl = rawBase
            ? rawBase.replace(/\/$/, "")
            : `http://${host}:${defaultPort}`;
        let apiPrefix = (window.OA_API_PREFIX || "/public/v1").toString().trim();
        if (!apiPrefix.startsWith("/")) apiPrefix = `/${apiPrefix}`;
        const templateId = Number(window.OA_EXPENSE_TEMPLATE_ID || 1) || 1;
        const mockUserId = (window.OA_MOCK_USER_ID || "10").toString();
        return { baseUrl, apiPrefix, templateId, mockUserId };
    }

    function normalizeOAStatus(status) {
        if (!status) return "";
        if (typeof status === "object" && status.value) return String(status.value);
        return String(status);
    }

    function formatExpenseAmount(value) {
        const num = Number(value);
        if (!Number.isFinite(num)) return "-";
        return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatExpenseDate(value) {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    function buildExpenseBillNoByInstance(instance) {
        const createdAt = instance && instance.created_at ? new Date(instance.created_at) : new Date();
        const yy = String(createdAt.getFullYear()).slice(-2);
        const mm = String(createdAt.getMonth() + 1).padStart(2, "0");
        const dd = String(createdAt.getDate()).padStart(2, "0");
        const seq = String(instance && instance.id ? instance.id : 1).padStart(4, "0");
        return `BX${yy}${mm}${dd}${seq}`;
    }

    function parseExpenseDescription(desc) {
        const info = { applicant: "", department: "", reason: "" };
        if (!desc) return info;
        const parts = String(desc).split(/[;；]/).map(part => part.trim()).filter(Boolean);
        parts.forEach(part => {
            if (part.startsWith("申请人：")) info.applicant = part.replace("申请人：", "").trim();
            if (part.startsWith("所属部门：")) info.department = part.replace("所属部门：", "").trim();
            if (part.startsWith("申请理由：")) info.reason = part.replace("申请理由：", "").trim();
        });
        return info;
    }

    function getExpenseStatusMeta(status) {
        const raw = normalizeOAStatus(status);
        const key = raw.toLowerCase();
        if (key === "pending") return { label: "审批中", tone: "warning" };
        if (key === "approved") return { label: "审批通过", tone: "success" };
        if (key === "rejected") return { label: "已拒绝", tone: "danger" };
        if (key === "cancelled") return { label: "已撤销", tone: "neutral" };
        if (key === "local_only") return { label: "未同步", tone: "info" };
        return { label: raw || "未知", tone: "neutral" };
    }

    function getPaymentStatusMeta(status) {
        if (status === "已付款") return { label: "已付款", tone: "success" };
        if (status === "待付款") return { label: "待付款", tone: "warning" };
        if (status === "无付款") return { label: "无付款", tone: "neutral" };
        return { label: status || "-", tone: "neutral" };
    }

    function getExpenseDailyList() {
        const raw = sessionStorage.getItem("ExpenseDailyReimbursements") || "[]";
        try {
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
        } catch (error) {
            return [];
        }
    }

    function saveExpenseDailyList(list) {
        sessionStorage.setItem("ExpenseDailyReimbursements", JSON.stringify(list || []));
    }

    function seedExpenseDailyList() {
        return getExpenseDailyList();
    }

    function updateExpenseDailySyncLabel() {
        const label = document.getElementById("expense-daily-last-sync");
        if (!label) return;
        const last = sessionStorage.getItem("ExpenseDailyLastSync");
        label.textContent = last ? `上次同步：${last}` : "上次同步：-";
    }

    window.initExpenseDailyModule = function () {
        if (!localStorage.getItem("ExpenseDailyCacheCleared")) {
            sessionStorage.removeItem("ExpenseDailyReimbursements");
            sessionStorage.removeItem("ExpenseDailyLastSync");
            localStorage.setItem("ExpenseDailyCacheCleared", "1");
        }
        seedExpenseDailyList();
        updateExpenseDailyPayable();
        renderExpenseDailyList();
        updateExpenseDailySyncLabel();
        syncExpenseDailyFromOA({ silent: true });
    };

    window.resetExpenseDailyFilters = function () {
        const keyword = document.getElementById("expense-daily-filter-keyword");
        const typeFilter = document.getElementById("expense-daily-filter-type");
        const statusFilter = document.getElementById("expense-daily-filter-status");
        if (keyword) keyword.value = "";
        if (typeFilter) typeFilter.value = "";
        if (statusFilter) statusFilter.value = "";
        renderExpenseDailyList();
    };

    window.openExpenseDailyModal = function () {
        const modal = document.getElementById("expense-daily-modal");
        if (modal) modal.classList.add("is-visible");
        const applicant = document.getElementById("expense_daily_applicant");
        if (applicant && !applicant.value) {
            applicant.value = sessionStorage.getItem("CurrentUserName") || localStorage.getItem("CurrentUserName") || "孙强";
        }
        const department = document.getElementById("expense_daily_department");
        if (department && !department.value) {
            department.value = "技术部";
        }
        updateExpenseDailyPayable();
    };

    window.closeExpenseDailyModal = function () {
        const modal = document.getElementById("expense-daily-modal");
        if (modal) modal.classList.remove("is-visible");
    };

    window.updateExpenseDailyPayable = function () {
        const amountInput = document.getElementById("expense_daily_amount");
        const offsetToggle = document.getElementById("expense_daily_offset_toggle");
        const offsetInput = document.getElementById("expense_daily_offset_amount");
        const offsetRow = document.getElementById("expense-daily-offset-row");
        const display = document.getElementById("expense-daily-payable");

        const amount = Number(amountInput ? amountInput.value : 0) || 0;
        const offsetEnabled = offsetToggle ? offsetToggle.checked : false;
        const offsetAmount = offsetEnabled ? Number(offsetInput ? offsetInput.value : 0) || 0 : 0;
        const payable = Math.max(amount - offsetAmount, 0);

        if (offsetRow) {
            offsetRow.style.display = offsetEnabled ? "flex" : "none";
        }
        if (display) display.textContent = formatExpenseAmount(payable);
    };

    window.openExpenseDailyDetail = function (id) {
        const list = getExpenseDailyList();
        const item = list.find(it => it.id === id || it.bill_no === id || it.external_ref_id === id);
        if (!item) return alert("未找到该报销单");
        window.currentExpenseDailyBill = item;
        renderExpenseDailyDetail(item);
        const modal = document.getElementById("expense-daily-detail-modal");
        if (modal) modal.classList.add("is-visible");
    };

    window.closeExpenseDailyDetail = function () {
        const modal = document.getElementById("expense-daily-detail-modal");
        if (modal) modal.classList.remove("is-visible");
    };

    function renderExpenseDailyDetail(item) {
        const container = document.getElementById("expense-daily-detail-content");
        if (!container) return;
        const displayId = item.bill_no || item.id || "-";
        const oaMeta = getExpenseStatusMeta(item.oa_status);
        const payMeta = getPaymentStatusMeta(item.payment_status);
        const amountText = formatExpenseAmount(item.amount);
        const payableText = formatExpenseAmount(item.payable_amount || item.amount);
        const createdText = formatExpenseDate(item.created_at);
        const invoiceCount = Number(item.invoice_count) || 0;
        const voucherId = item.voucher_id || "-";
        const paymentTime = item.payment_time ? formatExpenseDate(item.payment_time) : "-";
        const paymentMethod = item.payment_method || "银行转账";

        const payDisabled = normalizeOAStatus(item.oa_status).toLowerCase() !== "approved" || item.payment_status === "已付款";
        const payDisabledAttr = payDisabled ? "disabled" : "";

        container.innerHTML = `
            <div class="expense-daily-detail__top">
                <div>
                    <div class="expense-daily-detail__billno">${displayId}</div>
                    <div class="expense-daily-detail__badges">
                        <span class="status-tag status-tag--${oaMeta.tone}">${oaMeta.label}</span>
                        <span class="status-tag status-tag--${payMeta.tone}">${payMeta.label}</span>
                    </div>
                </div>
                <div class="expense-daily-detail__amount">
                    <div class="expense-daily-detail__amount-label">报销金额</div>
                    <div class="expense-daily-detail__amount-value">${amountText}</div>
                    <div class="expense-daily-detail__amount-sub">应付金额 ${payableText}</div>
                </div>
            </div>

            <div class="expense-daily-detail__grid">
                <div class="expense-daily-detail__section">
                    <div class="expense-daily-detail__section-title">单据基础信息</div>
                    <div class="expense-daily-detail__kv">
                        <div><span>申请人</span><strong>${item.applicant || "-"}</strong></div>
                        <div><span>所属部门</span><strong>${item.department || "-"}</strong></div>
                        <div><span>费用类型</span><strong>${item.expense_type || "-"}</strong></div>
                        <div><span>提交日期</span><strong>${createdText}</strong></div>
                        <div><span>发票数量</span><strong>${invoiceCount} 张</strong></div>
                        <div><span>冲销借款</span><strong>${Number(item.offset_amount) ? `是 (${formatExpenseAmount(item.offset_amount)})` : "否"}</strong></div>
                        <div><span>运单号</span><strong>${item.waybill_no || "-"}</strong></div>
                        <div><span>线路/项目</span><strong>${item.project_name || "-"}</strong></div>
                    </div>
                    <div class="expense-daily-detail__note">
                        <div class="expense-daily-detail__note-label">报销说明</div>
                        <div class="expense-daily-detail__note-body">${item.reason || "-"}</div>
                    </div>
                </div>

                <div class="expense-daily-detail__section">
                    <div class="expense-daily-detail__section-title">审批与付款信息</div>
                    <div class="expense-daily-detail__kv">
                        <div><span>OA 审批状态</span><strong>${oaMeta.label}</strong></div>
                        <div><span>当前节点</span><strong>${item.current_node_name || "-"}</strong></div>
                        <div><span>付款状态</span><strong>${payMeta.label}</strong></div>
                        <div><span>付款方式</span><strong>${paymentMethod}</strong></div>
                        <div><span>付款时间</span><strong>${paymentTime}</strong></div>
                        <div><span>凭证号</span><strong>${voucherId}</strong></div>
                    </div>
                    <div class="expense-daily-detail__payment">
                        <div class="expense-daily-detail__payment-title">出纳支付操作</div>
                        <div class="expense-daily-detail__payment-row">
                            <label>付款方式</label>
                            <select id="expense-daily-pay-method">
                                <option value="银行转账">银行转账</option>
                                <option value="现金">现金</option>
                                <option value="对公付款">对公付款</option>
                            </select>
                        </div>
                        <div class="expense-daily-detail__payment-row">
                            <label>备注</label>
                            <input id="expense-daily-pay-note" type="text" placeholder="付款备注(可选)">
                        </div>
                        <div class="expense-daily-detail__payment-actions">
                            <button class="btn-primary" ${payDisabledAttr} onclick="confirmExpenseDailyPayment('${item.id || ""}')">确认支付</button>
                            <button class="btn-ghost" onclick="openVoucherDetailFromExpense('${item.id || ""}')">查看凭证</button>
                        </div>
                        <div class="expense-daily-detail__payment-tip">
                            ${payDisabled ? "审批未通过或已付款，无法再次付款。" : "确认支付后自动生成凭证，进入凭证审核中心（待审核）。"}
                        </div>
                    </div>
                </div>
            </div>

            <div class="expense-daily-detail__section">
                <div class="expense-daily-detail__section-title">审批轨迹</div>
                <div class="expense-daily-detail__timeline">
                    <div class="expense-daily-detail__timeline-item">
                        <span>提交申请</span>
                        <em>${createdText}</em>
                    </div>
                    <div class="expense-daily-detail__timeline-item">
                        <span>${item.current_node_name || "审批流转中"}</span>
                        <em>${oaMeta.label}</em>
                    </div>
                    <div class="expense-daily-detail__timeline-item">
                        <span>出纳打款</span>
                        <em>${payMeta.label}</em>
                    </div>
                </div>
            </div>
        `;
    }

    window.confirmExpenseDailyPayment = async function (id) {
        const list = getExpenseDailyList();
        const item = list.find(it => it.id === id || it.bill_no === id || it.external_ref_id === id) || window.currentExpenseDailyBill;
        if (!item) return alert("未找到该报销单");
        if (normalizeOAStatus(item.oa_status).toLowerCase() !== "approved") {
            return alert("该单据尚未审批通过，无法付款");
        }
        if (item.payment_status === "已付款") return alert("该单据已完成付款");

        const methodInput = document.getElementById("expense-daily-pay-method");
        const noteInput = document.getElementById("expense-daily-pay-note");
        const paymentMethod = methodInput ? methodInput.value : "银行转账";
        const paymentNote = noteInput ? noteInput.value : "";

        const voucherId = createExpenseVoucher(item, paymentMethod);
        const config = getExpenseDailyConfig();

        const useRemotePay = !String(config.apiPrefix || "").startsWith("/public/v1");
        if (useRemotePay) {
            try {
                const res = await fetch(`${config.baseUrl}${config.apiPrefix}/finance/bills/pay`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Mock-User-Id": config.mockUserId
                    },
                    body: JSON.stringify({
                        bill_no: item.bill_no || item.id,
                        external_ref_id: item.external_ref_id,
                        workflow_instance_id: item.oa_instance_id,
                        payment_method: paymentMethod,
                        payment_note: paymentNote,
                        voucher_id: voucherId
                    })
                });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || `付款接口返回 ${res.status}`);
                }
            } catch (error) {
                alert(`付款失败：${error.message || error}`);
                return;
            }
        }

        const now = new Date().toISOString();
        const updated = {
            ...item,
            payment_status: "已付款",
            current_node_name: "已打款",
            payment_method: paymentMethod,
            payment_time: now,
            voucher_id: voucherId,
            voucher_status: "CREATED"
        };

        const index = list.findIndex(it => it.id === item.id);
        if (index >= 0) list[index] = updated;
        saveExpenseDailyList(list);
        window.currentExpenseDailyBill = updated;
        renderExpenseDailyList();
        renderExpenseDailyDetail(updated);
        alert(`已完成付款，凭证号：${voucherId}`);
    };

    window.openVoucherDetailFromExpense = function (id) {
        const list = getExpenseDailyList();
        const item = list.find(it => it.id === id) || window.currentExpenseDailyBill;
        if (!item || !item.voucher_id) {
            return alert("暂无凭证记录");
        }
        if (typeof openVoucherDetail === "function") {
            openVoucherDetail(item.voucher_id);
        } else if (typeof loadContent === "function") {
            window.g_currentVoucher = { id: item.voucher_id };
            loadContent("VoucherDetail");
        }
    };

    function createExpenseVoucher(item, paymentMethod) {
        const getVoucherId = window.generateSequentialVoucherId || ((word) => `${word || "记"}-${Date.now()}`);
        const voucherId = getVoucherId("记");
        const amount = Number(item.amount) || 0;
        const expenseSubjectMap = {
            "办公费": { code: "6601-01", name: "管理费用-办公" },
            "差旅费": { code: "6601-02", name: "管理费用-差旅" },
            "业务招待费": { code: "6602-01", name: "销售费用-招待" },
            "通讯费": { code: "6601-03", name: "管理费用-通讯" },
            "培训费": { code: "6601-04", name: "管理费用-培训" }
        };
        const expenseSubject = expenseSubjectMap[item.expense_type] || { code: "6601", name: "管理费用" };
        const paySubject = paymentMethod === "现金"
            ? { code: "1001", name: "库存现金" }
            : { code: "1002", name: "银行存款" };

        const summary = `报销付款-${item.expense_type || "费用"}-${item.applicant || ""}`;
        const sourceNo = item.bill_no || item.id;
        const voucher = {
            id: voucherId,
            date: new Date().toISOString().split('T')[0],
            summary,
            amount: amount.toFixed(2),
            user: "出纳",
            status: "待审核",
            sourceType: "reimbursement",
            sourceDocType: "reimbursement",
            sourceNo,
            sourceId: sourceNo,
            sourceDocs: sourceNo ? [sourceNo] : [],
            lines: [
                { summary, account: `${expenseSubject.code} ${expenseSubject.name}`, debit: amount.toFixed(2), credit: "" },
                { summary, account: `${paySubject.code} ${paySubject.name}`, debit: "", credit: amount.toFixed(2) }
            ]
        };

        const vouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        vouchers.unshift(voucher);
        sessionStorage.setItem("ManualVouchers", JSON.stringify(vouchers));

        return voucherId;
    }

    window.submitExpenseDailyForm = async function () {
        const applicant = document.getElementById("expense_daily_applicant");
        const department = document.getElementById("expense_daily_department");
        const type = document.getElementById("expense_daily_type");
        const amountInput = document.getElementById("expense_daily_amount");
        const invoiceInput = document.getElementById("expense_daily_invoice");
        const offsetToggle = document.getElementById("expense_daily_offset_toggle");
        const offsetInput = document.getElementById("expense_daily_offset_amount");
        const reasonInput = document.getElementById("expense_daily_reason");

        const amount = Number(amountInput ? amountInput.value : 0);
        if (!Number.isFinite(amount) || amount <= 0) {
            alert("请输入有效的报销金额");
            return;
        }

        const offsetEnabled = offsetToggle ? offsetToggle.checked : false;
        const offsetAmount = offsetEnabled ? Number(offsetInput ? offsetInput.value : 0) || 0 : 0;
        const payable = Math.max(amount - offsetAmount, 0);

        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const dateStr = `${yy}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
        const list = getExpenseDailyList();
        const prefix = `BX${dateStr}`;
        const maxSeq = list.reduce((max, item) => {
            if (!item.id || typeof item.id !== "string") return max;
            if (!item.id.startsWith(prefix)) return max;
            const match = item.id.match(new RegExp(`^${prefix}-?(\\d{3,4})$`));
            if (!match) return max;
            const seq = Number(match[1]);
            return Number.isFinite(seq) && seq > max ? seq : max;
        }, 0);
        const newId = `${prefix}${String(maxSeq + 1).padStart(4, "0")}`;

        const payload = {
            fms_id: newId,
            type: "日常报销",
            expense_type: type ? type.value : "办公费",
            amount,
            reason: reasonInput ? reasonInput.value.trim() : "",
            applicant: applicant ? applicant.value.trim() : "",
            department: department ? department.value.trim() : "",
            invoice_count: Number(invoiceInput ? invoiceInput.value : 0) || 0,
            offset_amount: offsetAmount,
            payable_amount: payable,
            created_at: now.toISOString(),
            source: "FMSDemo"
        };

        const config = getExpenseDailyConfig();
        const url = `${config.baseUrl}${config.apiPrefix}/workflow/start`;

        let oaInstance = null;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Mock-User-Id": config.mockUserId
                },
                body: JSON.stringify({
                    template_id: config.templateId,
                    form_data: payload
                })
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `OA 接口返回 ${res.status}`);
            }
            oaInstance = await res.json();
        } catch (error) {
            alert(`提交 OA 审批失败：${error.message || error}`);
            return;
        }

        const oaStatus = normalizeOAStatus(oaInstance && oaInstance.status) || "pending";
        const record = {
            id: newId,
            applicant: payload.applicant || "未命名",
            department: payload.department || "-",
            expense_type: payload.expense_type || "-",
            amount: payload.amount,
            offset_amount: payload.offset_amount || 0,
            payable_amount: payload.payable_amount || payload.amount,
            invoice_count: payload.invoice_count || 0,
            reason: payload.reason || "-",
            oa_instance_id: oaInstance ? oaInstance.id : null,
            oa_status: oaStatus,
            current_node_name: oaInstance && oaInstance.current_node_name ? oaInstance.current_node_name : "待审批",
            payment_status: oaStatus.toLowerCase() === "approved" ? "待付款" : "无付款",
            created_at: oaInstance && oaInstance.created_at ? oaInstance.created_at : payload.created_at
        };

        list.unshift(record);
        saveExpenseDailyList(list);
        renderExpenseDailyList();
        closeExpenseDailyModal();
        alert(`已提交 OA 审批，单号 ${newId}`);
    };

    window.syncExpenseDailyFromOA = async function (options = {}) {
        const config = getExpenseDailyConfig();
        const url = `${config.baseUrl}${config.apiPrefix}/approvals?type=expense`;

        try {
            const res = await fetch(url);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `OA 接口返回 ${res.status}`);
            }
            const payload = await res.json();
            const items = (payload && payload.data && payload.data.items) || payload.items || [];

            const localList = getExpenseDailyList();
            const localMap = new Map();
            localList.forEach(item => {
                if (item.id) localMap.set(String(item.id), item);
            });

            const mapped = (items || []).map(ticket => {
                const info = parseExpenseDescription(ticket.description || "");
                const rawStatus = normalizeOAStatus(ticket.status);
                const statusKey = rawStatus.toLowerCase();
                const expenseType = (ticket.title || "").replace(/报销$/, "") || "办公费";
                const currentNode = statusKey === "approved" ? "出纳打款" : statusKey === "rejected" ? "已拒绝" : "待审批";
                const paymentStatus = statusKey === "approved" ? "待付款" : "无付款";
                return {
                    id: String(ticket.id || ""),
                    bill_no: ticket.id ? `BX${String(ticket.id).padStart(4, "0")}` : undefined,
                    external_ref_id: ticket.id ? `ticket:${ticket.id}` : undefined,
                    applicant: info.applicant || "-",
                    department: info.department || "-",
                    expense_type: expenseType || "-",
                    amount: Number(ticket.amount) || 0,
                    offset_amount: 0,
                    payable_amount: Number(ticket.amount) || 0,
                    invoice_count: 0,
                    reason: info.reason || ticket.description || "-",
                    oa_instance_id: ticket.id || null,
                    oa_status: rawStatus || "pending",
                    current_node_name: currentNode,
                    payment_status: paymentStatus,
                    created_at: ticket.created_at || ""
                };
            });

            const mergedMap = new Map();
            mapped.forEach(item => mergedMap.set(item.id, item));
            localList.forEach(item => {
                if (!item.id || mergedMap.has(String(item.id))) return;
                mergedMap.set(String(item.id), { ...item, oa_status: "local_only" });
            });

            const mergedList = Array.from(mergedMap.values());
            mergedList.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
            saveExpenseDailyList(mergedList);
            const now = new Date().toLocaleString();
            sessionStorage.setItem("ExpenseDailyLastSync", now);
            updateExpenseDailySyncLabel();
            renderExpenseDailyList();
            if (!options.silent) {
                alert("OA 审批已同步");
            }
        } catch (error) {
            if (!options.silent) {
                alert(`同步失败：${error.message || error}`);
            }
        }
    };

    window.renderExpenseDailyList = function () {
        const tbody = document.getElementById("expense-daily-tbody");
        if (!tbody) return;
        const list = getExpenseDailyList();

        const keyword = (document.getElementById("expense-daily-filter-keyword") || {}).value || "";
        const typeFilter = (document.getElementById("expense-daily-filter-type") || {}).value || "";
        const statusFilter = (document.getElementById("expense-daily-filter-status") || {}).value || "";

        const filtered = list.filter(item => {
            const text = `${item.id || ""} ${item.bill_no || ""} ${item.applicant || ""}`.toLowerCase();
            if (keyword && !text.includes(keyword.trim().toLowerCase())) return false;
            if (typeFilter && item.expense_type !== typeFilter) return false;
            if (statusFilter) {
                const oaStatus = normalizeOAStatus(item.oa_status).toLowerCase();
                if (statusFilter === "审批中" && oaStatus !== "pending") return false;
                if (statusFilter === "审批通过" && oaStatus !== "approved") return false;
                if (statusFilter === "已拒绝" && oaStatus !== "rejected") return false;
                if (statusFilter === "待付款" && item.payment_status !== "待付款") return false;
                if (statusFilter === "已付款" && item.payment_status !== "已付款") return false;
                if (statusFilter === "未同步" && oaStatus !== "local_only") return false;
            }
            return true;
        });

        const rows = filtered.map(item => {
            const displayId = item.bill_no || item.id || "-";
            const statusMeta = getExpenseStatusMeta(item.oa_status);
            const payMeta = getPaymentStatusMeta(item.payment_status);
            const node = item.current_node_name || "-";
            const amountText = formatExpenseAmount(item.amount);
            const dateText = formatExpenseDate(item.created_at);
            const payAction = item.payment_status === "待付款"
                ? `<button class="btn-primary btn-ghost expense-daily__action-btn" onclick="confirmExpenseDailyPayment('${item.id || ""}')">确认支付</button>`
                : "";
            return `
                <tr>
                    <td>${displayId}</td>
                    <td>${item.applicant || "-"}</td>
                    <td>${item.expense_type || "-"}</td>
                    <td style="text-align:right;">${amountText}</td>
                    <td><span class="status-tag status-tag--${statusMeta.tone}">${statusMeta.label}</span></td>
                    <td>${node}</td>
                    <td><span class="status-tag status-tag--${payMeta.tone}">${payMeta.label}</span></td>
                    <td>${dateText}</td>
                    <td>
                        <div class="expense-daily__actions">
                            <button class="btn-primary btn-ghost expense-daily__action-btn" onclick="openExpenseDailyDetail('${item.id || ""}')">查看</button>
                            ${payAction}
                            <button class="btn-primary btn-ghost expense-daily__action-btn expense-daily__action-btn--danger" onclick="deleteExpenseDailyItem('${item.id || ""}')">删除</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        tbody.innerHTML = rows || `<tr><td colspan="9" style="text-align:center; color:#999;">暂无数据</td></tr>`;

        const pendingCount = list.filter(item => normalizeOAStatus(item.oa_status).toLowerCase() === "pending").length;
        const approvedCount = list.filter(item => normalizeOAStatus(item.oa_status).toLowerCase() === "approved").length;
        const rejectedCount = list.filter(item => normalizeOAStatus(item.oa_status).toLowerCase() === "rejected").length;
        const paidCount = list.filter(item => item.payment_status === "已付款").length;

        const pendingEl = document.getElementById("expense-kpi-pending");
        const approvedEl = document.getElementById("expense-kpi-approved");
        const rejectedEl = document.getElementById("expense-kpi-rejected");
        const paidEl = document.getElementById("expense-kpi-paid");

        if (pendingEl) pendingEl.textContent = String(pendingCount);
        if (approvedEl) approvedEl.textContent = String(approvedCount);
        if (rejectedEl) rejectedEl.textContent = String(rejectedCount);
        if (paidEl) paidEl.textContent = String(paidCount);

        // 已移除审批进度看板与待办提醒
    };

    window.deleteExpenseDailyItem = async function (id) {
        const list = getExpenseDailyList();
        const item = list.find(it => it.id === id || it.bill_no === id || it.external_ref_id === id);
        if (!item) return;
        const config = getExpenseDailyConfig();
        const useRemoteDelete = !String(config.apiPrefix || "").startsWith("/public/v1");
        if (useRemoteDelete) {
            try {
                const res = await fetch(`${config.baseUrl}${config.apiPrefix}/finance/bills/delete`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Mock-User-Id": config.mockUserId
                    },
                    body: JSON.stringify({
                        bill_no: item.bill_no,
                        external_ref_id: item.external_ref_id,
                        workflow_instance_id: item.oa_instance_id
                    })
                });
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || `删除接口返回 ${res.status}`);
                }
            } catch (error) {
                alert(`删除失败：${error.message || error}`);
                return;
            }
        }

        const next = list.filter(row => row.id !== id && row.bill_no !== id && row.external_ref_id !== id);
        saveExpenseDailyList(next);
        renderExpenseDailyList();
    };

}
