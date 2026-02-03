// js/core/modules/finance/closing.js
// Period-end closing templates + one-click closing flow (frontend mock)

(function () {
    const TEMPLATE_STORAGE_KEY = "PeriodEndClosingTemplates";
    const HISTORY_STORAGE_KEY = "PeriodEndClosingHistory";

    // Backend table reference (for implementation alignment)
    // period_end_closing_template:
    // - id (pk) | type (tax/income/cost) | priority | name | voucher_word
    // - config_json (vat_base_codes, source_codes, target_code, tax_items[{code, rate}])
    // - status | created_at | updated_at
    // period_end_closing_history:
    // - id (pk) | period (YYYY-MM) | vouchers_json | amounts_json | status | created_at | created_by

    const DEFAULT_TEMPLATES = {
        version: 1,
        templates: [
            {
                type: "tax",
                priority: 1,
                name: "计提税金及附加",
                voucherWord: "结",
                bookId: "",
                vatBaseCodes: ["22210106"],
                taxExpenseCode: "6403",
                taxItems: [
                    { code: "22210101", rate: 0.07 },
                    { code: "22210102", rate: 0.03 },
                    { code: "22210103", rate: 0.02 },
                    { code: "22210108", rate: 0.01 }
                ],
                status: "启用"
            },
            {
                type: "income",
                priority: 2,
                name: "结转收入",
                voucherWord: "结",
                bookId: "",
                sourceCodes: [
                    "5001",
                    "6001",
                    "6002",
                    "6051",
                    "6101",
                    "6111",
                    "6301",
                    "6302"
                ],
                targetCode: "4103",
                status: "启用"
            },
            {
                type: "cost",
                priority: 3,
                name: "结转成本费用",
                voucherWord: "结",
                bookId: "",
                sourceCodes: [
                    "6401",
                    "6402",
                    "6403",
                    "6601",
                    "6602",
                    "6603",
                    "6701",
                    "6711",
                    "6801"
                ],
                targetCode: "4103",
                status: "启用"
            }
        ]
    };

    const DEFAULT_TAX_ITEMS = [
        { code: "22210101", rate: 0.07 },
        { code: "22210102", rate: 0.03 },
        { code: "22210103", rate: 0.02 },
        { code: "22210108", rate: 0.01 }
    ];

    function cloneJSON(value) {
        return JSON.parse(JSON.stringify(value || {}));
    }

    function parseCodes(value) {
        if (Array.isArray(value)) return value.filter(Boolean).map(v => v.toString().trim()).filter(Boolean);
        if (!value) return [];
        return value
            .toString()
            .split(/[,，]/)
            .map(item => item.trim())
            .filter(Boolean);
    }

    function toNumber(value) {
        if (value === null || value === undefined) return 0;
        const text = value.toString().replace(/,/g, "").trim();
        const num = parseFloat(text);
        return Number.isFinite(num) ? num : 0;
    }

    function getSubjectMap() {
        const subjects = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]");
        const map = new Map();
        subjects.forEach(item => {
            const code = (item.code || "").toString().trim();
            if (!code) return;
            map.set(code, item.name || "");
        });
        return map;
    }

    function resolveAccountDisplay(code, subjectMap) {
        const name = subjectMap.get(code) || "";
        return name ? `${code} ${name}` : code;
    }

    function extractAccountCode(line) {
        const raw = (line.accountCode || line.account || "").toString().trim();
        if (!raw) return "";
        const first = raw.split(/\s+/)[0];
        return first || "";
    }

    function matchesAny(code, patterns) {
        return patterns.some(prefix => code.startsWith(prefix));
    }

    function buildMatcher(codes) {
        const normalized = Array.from(new Set(parseCodes(codes)));
        normalized.sort((a, b) => b.length - a.length);
        return function (code) {
            for (let i = 0; i < normalized.length; i += 1) {
                if (code.startsWith(normalized[i])) return normalized[i];
            }
            return "";
        };
    }

    function normalizePeriodInput(input) {
        if (!input) return null;
        const text = input.toString().trim();
        if (!text) return null;
        if (/^\d{4}-\d{2}$/.test(text)) {
            const [year, month] = text.split("-");
            const monthNo = parseInt(month, 10);
            return {
                periodStr: `${year}-${month}`,
                periodKey: `${year}-${monthNo}`,
                periodLabel: `${year}年${monthNo}期`
            };
        }
        const match = text.match(/(\d{4})年(\d{1,2})期/);
        if (!match) return null;
        const year = match[1];
        const monthNo = parseInt(match[2], 10);
        const monthText = String(monthNo).padStart(2, "0");
        return {
            periodStr: `${year}-${monthText}`,
            periodKey: `${year}-${monthNo}`,
            periodLabel: `${year}年${monthNo}期`
        };
    }

    function getValidVouchersForPeriod(periodStr) {
        const list = typeof window.getManualVouchers === "function"
            ? window.getManualVouchers()
            : JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const validStatuses = new Set(["已审核", "已记账", "已过账"]);
        return list.filter(v => {
            if (!v || !v.date) return false;
            if (!v.date.toString().startsWith(periodStr)) return false;
            return validStatuses.has(v.status);
        });
    }

    function collectLinesForPeriod(periodStr) {
        const vouchers = getValidVouchersForPeriod(periodStr);
        const lines = [];
        vouchers.forEach(v => {
            (v.lines || []).forEach(line => {
                const accountCode = extractAccountCode(line);
                if (!accountCode) return;
                lines.push({
                    accountCode,
                    debit: toNumber(line.debit),
                    credit: toNumber(line.credit)
                });
            });
        });
        return lines;
    }

    function resolveSourceCodes(templateCodes, lines, fallbackPrefixes) {
        const codes = parseCodes(templateCodes);
        if (codes.length) return codes;
        const derived = new Set();
        lines.forEach(line => {
            if (matchesAny(line.accountCode, fallbackPrefixes)) {
                derived.add(line.accountCode);
            }
        });
        return Array.from(derived);
    }

    function buildIncomeVoucherLines(periodLabel, template, lines, subjectMap) {
        const sourceCodes = resolveSourceCodes(template.sourceCodes, lines, ["5001", "60", "61", "63"]);
        const matcher = buildMatcher(sourceCodes);
        const buckets = new Map();
        lines.forEach(line => {
            const match = matcher(line.accountCode);
            if (!match) return;
            const entry = buckets.get(match) || { debit: 0, credit: 0 };
            entry.debit += line.debit;
            entry.credit += line.credit;
            buckets.set(match, entry);
        });

        const summary = `${periodLabel}结转收入`;
        const entries = [];
        let debitTotal = 0;
        let creditTotal = 0;

        buckets.forEach((val, code) => {
            const balance = val.credit - val.debit;
            if (Math.abs(balance) < 0.0001) return;
            if (balance > 0) {
                debitTotal += balance;
                entries.push({
                    summary,
                    accountCode: code,
                    accountName: subjectMap.get(code) || "",
                    account: resolveAccountDisplay(code, subjectMap),
                    debit: balance.toFixed(2),
                    credit: ""
                });
            } else {
                const amount = Math.abs(balance);
                creditTotal += amount;
                entries.push({
                    summary,
                    accountCode: code,
                    accountName: subjectMap.get(code) || "",
                    account: resolveAccountDisplay(code, subjectMap),
                    debit: "",
                    credit: amount.toFixed(2)
                });
            }
        });

        const net = debitTotal - creditTotal;
        const targetCode = (template.targetCode || "4103").toString().trim();
        if (Math.abs(net) > 0.0001) {
            if (net > 0) {
                entries.push({
                    summary,
                    accountCode: targetCode,
                    accountName: subjectMap.get(targetCode) || "",
                    account: resolveAccountDisplay(targetCode, subjectMap),
                    debit: "",
                    credit: net.toFixed(2)
                });
            } else {
                entries.push({
                    summary,
                    accountCode: targetCode,
                    accountName: subjectMap.get(targetCode) || "",
                    account: resolveAccountDisplay(targetCode, subjectMap),
                    debit: Math.abs(net).toFixed(2),
                    credit: ""
                });
            }
        }

        return { entries, incomeNet: net };
    }

    function buildCostVoucherLines(periodLabel, template, lines, subjectMap) {
        const sourceCodes = resolveSourceCodes(template.sourceCodes, lines, ["64", "66", "67", "68"]);
        const matcher = buildMatcher(sourceCodes);
        const buckets = new Map();
        lines.forEach(line => {
            const match = matcher(line.accountCode);
            if (!match) return;
            const entry = buckets.get(match) || { debit: 0, credit: 0 };
            entry.debit += line.debit;
            entry.credit += line.credit;
            buckets.set(match, entry);
        });

        const summary = `${periodLabel}结转成本费用`;
        const entries = [];
        let debitTotal = 0;
        let creditTotal = 0;

        buckets.forEach((val, code) => {
            const balance = val.debit - val.credit;
            if (Math.abs(balance) < 0.0001) return;
            if (balance > 0) {
                creditTotal += balance;
                entries.push({
                    summary,
                    accountCode: code,
                    accountName: subjectMap.get(code) || "",
                    account: resolveAccountDisplay(code, subjectMap),
                    debit: "",
                    credit: balance.toFixed(2)
                });
            } else {
                const amount = Math.abs(balance);
                debitTotal += amount;
                entries.push({
                    summary,
                    accountCode: code,
                    accountName: subjectMap.get(code) || "",
                    account: resolveAccountDisplay(code, subjectMap),
                    debit: amount.toFixed(2),
                    credit: ""
                });
            }
        });

        const net = creditTotal - debitTotal;
        const targetCode = (template.targetCode || "4103").toString().trim();
        if (Math.abs(net) > 0.0001) {
            if (net > 0) {
                entries.push({
                    summary,
                    accountCode: targetCode,
                    accountName: subjectMap.get(targetCode) || "",
                    account: resolveAccountDisplay(targetCode, subjectMap),
                    debit: net.toFixed(2),
                    credit: ""
                });
            } else {
                entries.push({
                    summary,
                    accountCode: targetCode,
                    accountName: subjectMap.get(targetCode) || "",
                    account: resolveAccountDisplay(targetCode, subjectMap),
                    debit: "",
                    credit: Math.abs(net).toFixed(2)
                });
            }
        }

        return { entries, costNet: net };
    }

    function buildTaxVoucherLines(periodLabel, template, lines, subjectMap) {
        const vatBaseCodes = parseCodes(template.vatBaseCodes);
        const vatMatcher = buildMatcher(vatBaseCodes.length ? vatBaseCodes : ["222101"]);
        let vatCredit = 0;
        let vatDebit = 0;

        lines.forEach(line => {
            const match = vatMatcher(line.accountCode);
            if (!match) return;
            vatCredit += line.credit;
            vatDebit += line.debit;
        });

        const vatAmount = Math.max(0, vatCredit - vatDebit);
        const summary = `${periodLabel}计提税金及附加`;
        const expenseCode = (template.taxExpenseCode || "6403").toString().trim();
        const taxItems = Array.isArray(template.taxItems) ? template.taxItems : [];

        const entries = [];
        let totalTax = 0;

        taxItems.forEach(item => {
            const code = (item.code || "").toString().trim();
            const rate = toNumber(item.rate);
            if (!code || rate <= 0) return;
            const amount = vatAmount * rate;
            if (amount <= 0.0001) return;
            totalTax += amount;
            entries.push({
                summary,
                accountCode: code,
                accountName: subjectMap.get(code) || "",
                account: resolveAccountDisplay(code, subjectMap),
                debit: "",
                credit: amount.toFixed(2)
            });
        });

        if (totalTax > 0.0001) {
            entries.unshift({
                summary,
                accountCode: expenseCode,
                accountName: subjectMap.get(expenseCode) || "",
                account: resolveAccountDisplay(expenseCode, subjectMap),
                debit: totalTax.toFixed(2),
                credit: ""
            });
        } else {
            entries.push({
                summary,
                accountCode: expenseCode,
                accountName: subjectMap.get(expenseCode) || "",
                account: resolveAccountDisplay(expenseCode, subjectMap),
                debit: "0.00",
                credit: "0.00"
            });
        }

        return { entries, taxTotal: totalTax, vatAmount };
    }

    function formatVoucherId(word, seq) {
        if (typeof window.formatVoucherId === "function") {
            return window.formatVoucherId(word, seq);
        }
        return `${word}-${String(seq).padStart(4, "0")}`;
    }

    function buildVoucherObject(template, date, summary, entries, idOverride) {
        const word = (template.voucherWord || "结").toString().trim() || "结";
        const id = idOverride || (typeof window.generateSequentialVoucherId === "function"
            ? window.generateSequentialVoucherId(word)
            : `${word}-${Date.now()}`);
        const debitTotal = entries.reduce((sum, line) => sum + toNumber(line.debit), 0);
        const creditTotal = entries.reduce((sum, line) => sum + toNumber(line.credit), 0);
        const amount = Math.max(debitTotal, creditTotal);
        return {
            id,
            date: date,
            amount: amount.toFixed(2),
            summary,
            user: "期末结转(系统)",
            status: "已记账",
            bookId: template.bookId || "",
            lines: entries
        };
    }

    window.getPeriodEndClosingTemplates = function () {
        const raw = sessionStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (!raw) {
            const defaults = cloneJSON(DEFAULT_TEMPLATES);
            sessionStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(defaults));
            return defaults;
        }
        try {
            const parsed = JSON.parse(raw);
            if (!parsed || !Array.isArray(parsed.templates)) {
                throw new Error("invalid template");
            }
            return parsed;
        } catch (error) {
            const defaults = cloneJSON(DEFAULT_TEMPLATES);
            sessionStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(defaults));
            return defaults;
        }
    };

    window.savePeriodEndClosingTemplates = function (config) {
        if (!config || !Array.isArray(config.templates)) return false;
        sessionStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(config));
        return true;
    };

    window.resetPeriodEndClosingTemplates = function () {
        const defaults = cloneJSON(DEFAULT_TEMPLATES);
        sessionStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
    };

    window.getPeriodEndClosingHistory = function () {
        const raw = sessionStorage.getItem(HISTORY_STORAGE_KEY) || "[]";
        try {
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
        } catch (error) {
            return [];
        }
    };

    window.getPeriodEndClosingStatus = function (periodStr) {
        if (!periodStr) return null;
        const list = window.getPeriodEndClosingHistory();
        return list.find(item => item.period === periodStr) || null;
    };

    window.getClosingSubjectOptionsHtml = function (selectedCode) {
        const subjects = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]");
        const selected = (selectedCode || "").toString().trim();
        const options = subjects.map(item => {
            const code = (item.code || "").toString().trim();
            if (!code) return "";
            const name = (item.name || "").toString().trim();
            const label = name ? `${code} ${name}` : code;
            return `<option value="${code}" ${code === selected ? "selected" : ""}>${label}</option>`;
        }).join("");
        return `<option value="">-请选择-</option>${options}`;
    };

    window.getClosingTemplateBookId = function () {
        return sessionStorage.getItem("ClosingTemplateBookId") || "";
    };

    window.setClosingTemplateBookId = function (bookId) {
        const next = (bookId || "").toString().trim();
        sessionStorage.setItem("ClosingTemplateBookId", next);
    };

    window.addClosingTaxItemRow = function () {
        const tbody = document.getElementById("closing-tax-items-body");
        if (!tbody) return;
        const optionsHtml = window.getClosingSubjectOptionsHtml ? window.getClosingSubjectOptionsHtml("") : "";
        tbody.insertAdjacentHTML("beforeend", `
            <tr>
                <td><select class="closing-tax-item-code">${optionsHtml}</select></td>
                <td><input type="number" class="closing-tax-item-rate" step="0.0001" placeholder="税率"></td>
                <td><button class="btn-primary template-row-btn" onclick="removeClosingTaxItemRow(this)">-</button></td>
            </tr>
        `);
    };

    window.removeClosingTaxItemRow = function (btn) {
        const row = btn ? btn.closest("tr") : null;
        if (row) row.remove();
    };

    window.saveClosingTemplates = function () {
        const config = window.getPeriodEndClosingTemplates();
        const cards = Array.from(document.querySelectorAll(".closing-template-card[data-type]"));
        if (!cards.length) {
            alert("请至少配置一张模板。");
            return;
        }
        const typeCounters = { tax: 0, income: 0, cost: 0 };
        const existingMap = new Map((config.templates || []).map(t => [t.id, t]));
        const templates = cards.map((card, idx) => {
            const type = card.dataset.type || "income";
            typeCounters[type] = (typeCounters[type] || 0) + 1;
            const priority = typeCounters[type];
            const templateId = card.dataset.templateId || `${type}-${Date.now()}-${priority}`;
            const bookId = card.querySelector(".closing-book-select")?.value || "";
            const voucherWord = card.querySelector(".closing-word-input")?.value || "结";
            const multiInput = (selector) => {
                const input = card.querySelector(`${selector} .subject-multi-input`);
                return parseCodes(input ? input.value : "");
            };
            if (type === "tax") {
                const existing = existingMap.get(templateId);
                const taxItems = existing && Array.isArray(existing.taxItems) && existing.taxItems.length
                    ? existing.taxItems
                    : DEFAULT_TAX_ITEMS;
                return {
                    id: templateId,
                    type: "tax",
                    priority,
                    name: `计提税金及附加-模板${priority}`,
                    voucherWord,
                    bookId,
                    vatBaseCodes: multiInput(".closing-tax-vat-codes"),
                    taxExpenseCode: card.querySelector(".closing-tax-expense-select")?.value || "",
                    taxItems,
                    status: "启用"
                };
            }
            if (type === "cost") {
                return {
                    id: templateId,
                    type: "cost",
                    priority,
                    name: `结转成本费用-模板${priority}`,
                    voucherWord,
                    bookId,
                    sourceCodes: multiInput(".closing-source-codes"),
                    targetCode: card.querySelector(".closing-target-select")?.value || "4103",
                    status: "启用"
                };
            }
            return {
                id: templateId,
                type: "income",
                priority,
                name: `结转收入-模板${priority}`,
                voucherWord,
                bookId,
                sourceCodes: multiInput(".closing-source-codes"),
                targetCode: card.querySelector(".closing-target-select")?.value || "4103",
                status: "启用"
            };
        });

        config.templates = templates;
        window.savePeriodEndClosingTemplates(config);
        alert("✅ 期末结转凭证模板已保存！");
    };

    window.resetClosingTemplates = function () {
        if (!confirm("确认恢复默认的期末结转凭证模板？")) return;
        window.resetPeriodEndClosingTemplates();
        if (typeof loadContent === "function") {
            loadContent("AccountingStandardSetting");
        }
    };

    window.apiPostPeriodEndClosing = function (payload) {
        const parsed = normalizePeriodInput(payload ? payload.period : "");
        if (!parsed) return { success: false, message: "期间格式不正确" };

        const { periodStr, periodKey, periodLabel } = parsed;
        const monthClosed = sessionStorage.getItem(`${periodKey}-MonthClosed`) === "true";
        if (monthClosed) {
            return { success: false, message: "当前期间已结账锁定，禁止重复结转。" };
        }

        const history = window.getPeriodEndClosingHistory();
        if (history.some(item => item.period === periodStr && item.status === "done")) {
            return { success: false, message: "该期间已完成期末结转，请勿重复操作。" };
        }

        const templates = window.getPeriodEndClosingTemplates();
        const rawTemplates = Array.isArray(templates.templates) ? templates.templates : [];
        const bookId = payload && payload.bookId ? payload.bookId.toString().trim() : "";
        const filteredTemplates = bookId
            ? rawTemplates.filter(t => (t.bookId || "") === bookId)
            : rawTemplates;
        const taxTemplates = filteredTemplates.filter(t => t.type === "tax");
        const incomeTemplates = filteredTemplates.filter(t => t.type === "income");
        const costTemplates = filteredTemplates.filter(t => t.type === "cost");
        if (!taxTemplates.length || !incomeTemplates.length || !costTemplates.length) {
            return { success: false, message: "模板配置不完整，请检查税金/收入/成本模板。" };
        }

        const subjectMap = getSubjectMap();
        const lines = collectLinesForPeriod(periodStr);

        const voucherDate = `${periodStr}-28`;

        const seqMap = {};
        const nextVoucherId = (word) => {
            const key = (word || "结").toString().trim() || "结";
            if (!seqMap[key]) {
                seqMap[key] = typeof window.getNextVoucherSeqStrict === "function"
                    ? window.getNextVoucherSeqStrict(key)
                    : 1;
            }
            const id = formatVoucherId(key, seqMap[key]);
            seqMap[key] += 1;
            return id;
        };

        const taxResults = taxTemplates.map(tpl => ({
            template: tpl,
            result: buildTaxVoucherLines(periodLabel, tpl, lines, subjectMap)
        }));
        const incomeResults = incomeTemplates.map(tpl => ({
            template: tpl,
            result: buildIncomeVoucherLines(periodLabel, tpl, lines, subjectMap)
        }));
        const costResults = costTemplates.map(tpl => ({
            template: tpl,
            result: buildCostVoucherLines(periodLabel, tpl, lines, subjectMap)
        }));

        const taxVouchers = taxResults.map(item => buildVoucherObject(
            item.template,
            voucherDate,
            `${periodLabel}计提税金及附加`,
            item.result.entries,
            nextVoucherId(item.template.voucherWord)
        ));
        const incomeVouchers = incomeResults.map(item => buildVoucherObject(
            item.template,
            voucherDate,
            `${periodLabel}结转收入`,
            item.result.entries,
            nextVoucherId(item.template.voucherWord)
        ));
        const costVouchers = costResults.map(item => buildVoucherObject(
            item.template,
            voucherDate,
            `${periodLabel}结转成本费用`,
            item.result.entries,
            nextVoucherId(item.template.voucherWord)
        ));

        const vouchers = typeof window.getManualVouchers === "function"
            ? window.getManualVouchers()
            : JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const nextList = vouchers.slice();
        costVouchers.forEach(v => nextList.unshift(v));
        incomeVouchers.forEach(v => nextList.unshift(v));
        taxVouchers.forEach(v => nextList.unshift(v));
        if (typeof window.saveManualVouchers === "function") {
            window.saveManualVouchers(nextList);
        } else {
            sessionStorage.setItem("ManualVouchers", JSON.stringify(nextList));
        }

        const totalIncome = incomeResults.reduce((sum, item) => sum + (item.result.incomeNet || 0), 0);
        const totalCost = costResults.reduce((sum, item) => sum + (item.result.costNet || 0), 0);
        const totalTax = taxResults.reduce((sum, item) => sum + (item.result.taxTotal || 0), 0);
        const profitAmount = totalIncome - totalCost - totalTax;
        const record = {
            period: periodStr,
            periodLabel: periodLabel,
            status: "done",
            time: new Date().toLocaleString(),
            vouchers: {
                tax: taxVouchers.map(v => v.id),
                income: incomeVouchers.map(v => v.id),
                cost: costVouchers.map(v => v.id)
            },
            amounts: {
                tax: totalTax,
                income: totalIncome,
                cost: totalCost,
                profit: profitAmount
            }
        };
        history.unshift(record);
        sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

        sessionStorage.setItem(`${periodKey}-ProfitTransferred`, "true");
        sessionStorage.setItem(`${periodKey}-ProfitAmount`, profitAmount.toFixed(2));
        const firstIncomeId = incomeVouchers[0] ? incomeVouchers[0].id : "";
        if (firstIncomeId) {
            sessionStorage.setItem(`${periodKey}-ProfitVoucher`, firstIncomeId);
        }

        if (typeof addAuditLog === "function") {
            addAuditLog({
                level: "中风险",
                time: new Date().toLocaleString(),
                user: "系统",
                module: "期末结转",
                action: "一键结转",
                detail: `${periodLabel} 生成凭证：${[...taxVouchers, ...incomeVouchers, ...costVouchers].map(v => v.id).join("/")}`
            });
        }

        return {
            success: true,
            period: periodStr,
            vouchers: record.vouchers,
            amounts: record.amounts
        };
    };

    window.api = window.api || {};
    window.api["POST /api/v1/closing"] = window.apiPostPeriodEndClosing;

    window.requestPeriodEndClosing = function (periodText) {
        const parsed = normalizePeriodInput(periodText);
        if (!parsed) return alert("期间格式不正确");
        const { periodStr, periodLabel } = parsed;
        const message = `确认对【${periodLabel}】执行一键结转吗？\n\n系统将按模板自动生成凭证。`;
        if (!confirm(message)) return;
        const result = window.apiPostPeriodEndClosing({ period: periodStr });
        if (!result.success) {
            alert(`❌ ${result.message || "结转失败"}`);
            return;
        }
        const list = (value) => Array.isArray(value) ? value : (value ? [value] : []);
        const taxList = list(result.vouchers.tax);
        const incomeList = list(result.vouchers.income);
        const costList = list(result.vouchers.cost);
        alert(`✅ 一键结转完成！\n\n税金凭证：${taxList.join("、") || "-"}\n收入凭证：${incomeList.join("、") || "-"}\n成本凭证：${costList.join("、") || "-"}`);
        if (typeof loadContent === "function") loadContent("PeriodEndProfit");
    };

    window.reversePeriodEndClosing = function (periodText) {
        const parsed = normalizePeriodInput(periodText);
        if (!parsed) return alert("期间格式不正确");
        const { periodStr, periodKey, periodLabel } = parsed;
        const monthClosed = sessionStorage.getItem(`${periodKey}-MonthClosed`) === "true";
        if (monthClosed) {
            return alert("当前期间已结账锁定，禁止反结转。");
        }
        const history = window.getPeriodEndClosingHistory();
        const record = history.find(item => item.period === periodStr);
        if (!record) {
            alert("未找到该期间的结转记录。");
            return;
        }
        if (!confirm(`确认冲回【${periodLabel}】期末结转吗？\n将删除对应凭证。`)) return;

        const toList = (value) => Array.isArray(value) ? value : (value ? [value] : []);
        const ids = [
            ...toList(record.vouchers.tax),
            ...toList(record.vouchers.income),
            ...toList(record.vouchers.cost)
        ].filter(Boolean);
        let list = typeof window.getManualVouchers === "function"
            ? window.getManualVouchers()
            : JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        list = list.filter(v => !ids.includes(v.id));
        if (typeof window.saveManualVouchers === "function") {
            window.saveManualVouchers(list);
        } else {
            sessionStorage.setItem("ManualVouchers", JSON.stringify(list));
        }

        const nextHistory = history.filter(item => item.period !== periodStr);
        sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));

        sessionStorage.setItem(`${periodKey}-ProfitTransferred`, "false");
        sessionStorage.removeItem(`${periodKey}-ProfitAmount`);
        sessionStorage.removeItem(`${periodKey}-ProfitVoucher`);

        if (typeof addAuditLog === "function") {
            addAuditLog({
                level: "高危",
                time: new Date().toLocaleString(),
                user: "系统",
                module: "期末结转",
                action: "冲回结转",
                detail: `${periodLabel} 撤销凭证：${ids.join("/")}`
            });
        }

        alert("✅ 已冲回结转凭证。");
        if (typeof loadContent === "function") loadContent("PeriodEndProfit");
    };
})();
