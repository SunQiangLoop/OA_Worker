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
                voucherWord: "转",
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
                voucherWord: "转",
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
                voucherWord: "转",
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

    // ─────────────────────────────────────────────────────────────────────────
    // 从 localStorage / sessionStorage 读取基础设置中的计提税金规则
    // 数据结构：[{ taxName, baseCodes, direction, rate, debitCode, creditCode, aux }]
    // ─────────────────────────────────────────────────────────────────────────
    function loadTaxAccrualRulesFromStorage() {
        try {
            const raw = localStorage.getItem("TaxAccrualRules")
                     || sessionStorage.getItem("TaxAccrualRules")
                     || "[]";
            const stored = JSON.parse(raw);
            if (Array.isArray(stored) && stored.length > 0) {
                // 自动迁移：旧版用 "222101" 作为基数科目，新版统一用 "2221"
                // 原因：会计引擎生成凭证时用父级科目 "2221"，而 "2221".startsWith("222101") = false 导致基数为零
                // 改为 "2221" 后，"2221" 和 "222101" 均能被 startsWith 命中
                return stored.map(rule => {
                    const codes = parseCodes(rule.baseCodes || "");
                    const migrated = codes.map(c => (c === "222101" || c === "222102" || c === "222103" || c === "222104") ? "2221" : c);
                    // 去重
                    const unique = Array.from(new Set(migrated));
                    return Object.assign({}, rule, { baseCodes: unique.join(",") });
                });
            }
        } catch (e) { /* 解析失败忽略，使用默认值 */ }
        // 兜底默认规则：baseCodes 使用父级科目 "2221"，同时兼容 "2221" 和 "222101" 两种录入方式
        const std = localStorage.getItem("AccountingStandard") || "enterprise";
        const taxDebitCode = std === "enterprise" ? "6403" : "5403";
        return [
            { taxName: "城市维护建设税", baseCodes: "2221", direction: "贷方净额", rate: "7",  debitCode: taxDebitCode, creditCode: "222102" },
            { taxName: "教育附加",       baseCodes: "2221", direction: "贷方净额", rate: "3",  debitCode: taxDebitCode, creditCode: "222103" },
            { taxName: "地方教育附加",   baseCodes: "2221", direction: "贷方净额", rate: "2",  debitCode: taxDebitCode, creditCode: "222104" }
        ];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 步骤①：计提税金及附加
    //
    // 核心逻辑：
    //   1. 逐条读取 TaxAccrualRules 规则
    //   2. 按取数方向（贷方净额 / 贷方发生额）计算基数
    //   3. 零值/负数拦截：基数 ≤ 0 则跳过该行
    //   4. 金额 = 基数 × 比例，四舍五入保留两位小数
    //   5. 按借方科目合并（一借多贷）
    // ─────────────────────────────────────────────────────────────────────────
    function buildTaxVoucherLines(periodLabel, _template, lines, subjectMap) {
        const rules = loadTaxAccrualRulesFromStorage();
        const summary = `${periodLabel}计提税金及附加`;

        // 借方合并 Map：debitCode → 合计金额（分录合并核心）
        const debitMergeMap = new Map();
        // 贷方明细行
        const creditLines = [];

        rules.forEach(rule => {
            const baseCodes = parseCodes(rule.baseCodes || "");
            const direction  = (rule.direction || "贷方净额").toString().trim();
            const rate       = parseFloat(rule.rate) / 100;          // 如 7 → 0.07
            const debitCode  = (rule.debitCode  || "").toString().trim();
            const creditCode = (rule.creditCode || "").toString().trim();

            // 规则不完整时跳过
            if (!baseCodes.length || !debitCode || !creditCode || !(rate > 0)) return;

            // ── 基数提取 ──
            const matcher = buildMatcher(baseCodes);
            let baseCredit = 0;
            let baseDebit  = 0;
            lines.forEach(line => {
                if (matcher(line.accountCode)) {
                    baseCredit += line.credit;
                    baseDebit  += line.debit;
                }
            });

            // 取数方向：贷方净额 = 贷方发生额 − 借方发生额；贷方发生额 = 仅取贷方
            const calcBase = direction === "贷方净额"
                ? baseCredit - baseDebit
                : baseCredit;

            // ── 零值/负数拦截 ──
            if (calcBase <= 0) return;

            // ── 四舍五入保留两位（精确到分）──
            const amount = Math.round(calcBase * rate * 100) / 100;
            if (amount < 0.005) return;

            // ── 借方合并 ──
            debitMergeMap.set(debitCode, (debitMergeMap.get(debitCode) || 0) + amount);

            // ── 贷方明细 ──
            creditLines.push({
                summary,
                accountCode: creditCode,
                accountName: subjectMap.get(creditCode) || "",
                account:     resolveAccountDisplay(creditCode, subjectMap),
                debit:  "",
                credit: amount.toFixed(2)
            });
        });

        // 所有明细均为 0 → 本张凭证不生成
        if (creditLines.length === 0) return { entries: [], taxTotal: 0, vatAmount: 0 };

        // ── 生成借方合并行（排在贷方之前，形成"一借多贷"） ──
        const debitLines = [];
        let totalTax = 0;
        debitMergeMap.forEach((amount, code) => {
            totalTax += amount;
            debitLines.push({
                summary,
                accountCode: code,
                accountName: subjectMap.get(code) || "",
                account:     resolveAccountDisplay(code, subjectMap),
                debit:  amount.toFixed(2),
                credit: ""
            });
        });

        // 分录顺序：借方在前，贷方在后（一借多贷标准格式）
        return { entries: [...debitLines, ...creditLines], taxTotal: totalTax, vatAmount: totalTax };
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 前置校验：检查当前期间是否存在未记账的日常凭证
    // 返回未记账凭证数量（0 表示校验通过）
    // ─────────────────────────────────────────────────────────────────────────
    function countUnpostedVouchers(periodStr) {
        const allVouchers = typeof window.getManualVouchers === "function"
            ? window.getManualVouchers()
            : JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        // 系统自动生成的结转凭证以"期末"命名，不列入拦截范围
        const unpostedStatuses = new Set(["待审核", "未审核"]);
        return allVouchers.filter(v => {
            if (!v || !v.date) return false;
            if (!v.date.toString().startsWith(periodStr)) return false;
            if ((v.user || "").includes("系统")) return false; // 排除系统凭证
            return unpostedStatuses.has(v.status);
        }).length;
    }

    function formatVoucherId(word, seq) {
        if (typeof window.formatVoucherId === "function") {
            return window.formatVoucherId(word, seq);
        }
        return `${word}-${String(seq).padStart(4, "0")}`;
    }

    function buildVoucherObject(template, date, summary, entries, idOverride) {
        const rawWord = (template.voucherWord || "转").toString().trim() || "转";
        const word = typeof window.resolveVoucherWord === "function" ? window.resolveVoucherWord(rawWord) : rawWord;
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
            status: "待审核",
            bookId: template.bookId || "",
            lines: entries
        };
    }

    window.getPeriodEndClosingTemplates = function () {
        const raw = sessionStorage.getItem(TEMPLATE_STORAGE_KEY);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.templates)) {
                    // 检查是否包含收入和成本两种模板，若缺失说明是旧版数据，自动补全
                    const types = new Set(parsed.templates.map(t => t.type));
                    if (types.has("income") && types.has("cost")) {
                        return parsed;
                    }
                    // 旧版仅有 tax 模板 → 补充 income 和 cost 默认模板后合并保存
                    const defaults = cloneJSON(DEFAULT_TEMPLATES);
                    const missing = defaults.templates.filter(t => !types.has(t.type));
                    parsed.templates = [...parsed.templates, ...missing];
                    sessionStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(parsed));
                    return parsed;
                }
            } catch (e) { /* 解析失败，重置 */ }
        }
        // 首次加载或数据损坏：写入完整默认模板
        const defaults = cloneJSON(DEFAULT_TEMPLATES);
        sessionStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(defaults));
        return defaults;
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
            const voucherWord = card.querySelector(".closing-word-input")?.value || "转";
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

        // ════════════════════════════════════════════════════════════
        // 前置校验：当前期间存在未记账日常凭证时，强制拦截
        // ════════════════════════════════════════════════════════════
        const unpostedCount = countUnpostedVouchers(periodStr);
        if (unpostedCount > 0) {
            return {
                success: false,
                message: `当前会计期间存在 ${unpostedCount} 张未记账的日常凭证，为保证计提基数准确，请先完成记账操作。`
            };
        }

        const monthClosed = sessionStorage.getItem(`${periodKey}-MonthClosed`) === "true";
        if (monthClosed) {
            return { success: false, message: "当前期间已结账锁定，禁止重复结转。" };
        }

        const history = window.getPeriodEndClosingHistory();
        if (history.some(item => item.period === periodStr && item.status === "done")) {
            return { success: false, message: "该期间已完成期末结转，请勿重复操作。" };
        }

        // ── 读取结转模板（收入/成本配置）──
        const templates = window.getPeriodEndClosingTemplates();
        const rawTemplates = Array.isArray(templates.templates) ? templates.templates : [];
        const bookId = payload && payload.bookId ? payload.bookId.toString().trim() : "";
        const filteredTemplates = bookId
            ? rawTemplates.filter(t => (t.bookId || "") === bookId)
            : rawTemplates;
        // 税金模板至少需要一条占位（实际计算读 TaxAccrualRules），收入/成本必须配置
        const taxTemplates    = filteredTemplates.filter(t => t.type === "tax");
        const incomeTemplates = filteredTemplates.filter(t => t.type === "income");
        const costTemplates   = filteredTemplates.filter(t => t.type === "cost");
        if (!incomeTemplates.length || !costTemplates.length) {
            return { success: false, message: "模板配置不完整，请在基础设置中配置结转收入和成本费用模板。" };
        }
        // 税金模板不足时补一个默认占位（实际分录由 TaxAccrualRules 驱动）
        const effectiveTaxTemplates = taxTemplates.length ? taxTemplates : [{
            type: "tax", priority: 1, name: "计提税金及附加",
            voucherWord: "转", bookId: ""
        }];

        const subjectMap = getSubjectMap();
        // 本期已记账凭证的所有分录（步骤①②③的计算基础）
        const lines = collectLinesForPeriod(periodStr);

        const voucherDate = `${periodStr}-28`;

        const seqMap = {};
        const nextVoucherId = (word) => {
            const key = (word || "转").toString().trim() || "转";
            if (!seqMap[key]) {
                seqMap[key] = typeof window.getNextVoucherSeqStrict === "function"
                    ? window.getNextVoucherSeqStrict(key)
                    : 1;
            }
            const id = formatVoucherId(key, seqMap[key]);
            seqMap[key] += 1;
            return id;
        };

        // ════════════════════════════════════════════════════════════
        // 步骤①：计提税金及附加
        // 读取 TaxAccrualRules，按"贷方净额/贷方发生额"计算基数，
        // 零值/负数自动剔除，借方相同科目合并（一借多贷）
        // ════════════════════════════════════════════════════════════
        const taxResults = effectiveTaxTemplates.map(tpl => ({
            template: tpl,
            result: buildTaxVoucherLines(periodLabel, tpl, lines, subjectMap)
        }));

        // 仅保留有实际分录的税金凭证
        const taxVouchers = taxResults
            .filter(item => item.result.entries.length > 0)
            .map(item => buildVoucherObject(
                item.template,
                voucherDate,
                `${periodLabel}计提税金及附加`,
                item.result.entries,
                nextVoucherId(item.template.voucherWord)
            ));

        // ════════════════════════════════════════════════════════════
        // 步骤①→步骤③联动：
        // 将步骤①生成的税金凭证分录（如 6403 借方）追加到 lines 中，
        // 确保步骤③能正确结转本期新计提的税金及附加。
        // ════════════════════════════════════════════════════════════
        const linesWithTax = lines.slice(); // 浅拷贝，避免污染原始数据
        taxVouchers.forEach(voucher => {
            (voucher.lines || []).forEach(vLine => {
                const accountCode = extractAccountCode(vLine);
                if (!accountCode) return;
                linesWithTax.push({
                    accountCode,
                    debit:  toNumber(vLine.debit),
                    credit: toNumber(vLine.credit)
                });
            });
        });

        // ════════════════════════════════════════════════════════════
        // 步骤②：结转本期各项收入（用 linesWithTax，包含步骤①新增分录）
        // ════════════════════════════════════════════════════════════
        const incomeResults = incomeTemplates.map(tpl => ({
            template: tpl,
            result: buildIncomeVoucherLines(periodLabel, tpl, linesWithTax, subjectMap)
        }));

        // ════════════════════════════════════════════════════════════
        // 步骤③：结转本期成本、费用及税金
        // 使用 linesWithTax，必然包含步骤①新计提的 6403 借方余额
        // ════════════════════════════════════════════════════════════
        const costResults = costTemplates.map(tpl => ({
            template: tpl,
            result: buildCostVoucherLines(periodLabel, tpl, linesWithTax, subjectMap)
        }));

        // ── 有实际分录才生成凭证（空 entries 跳过，避免产生无效凭证）──
        const incomeVouchers = incomeResults
            .filter(item => item.result.entries.length > 0)
            .map(item => buildVoucherObject(
                item.template,
                voucherDate,
                `${periodLabel}结转收入`,
                item.result.entries,
                nextVoucherId(item.template.voucherWord)
            ));
        const costVouchers = costResults
            .filter(item => item.result.entries.length > 0)
            .map(item => buildVoucherObject(
                item.template,
                voucherDate,
                `${periodLabel}结转成本费用`,
                item.result.entries,
                nextVoucherId(item.template.voucherWord)
            ));

        // ── 三步均无凭证 → 提示用户本期无损益数据 ──
        if (taxVouchers.length === 0 && incomeVouchers.length === 0 && costVouchers.length === 0) {
            return { success: false, message: "本期未找到可结转的损益数据，请确认已有已记账的收入/成本凭证。" };
        }

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
        // totalCost 已包含步骤①转入的税金科目（6403），无需再减 totalTax
        const profitAmount = totalIncome - totalCost;
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
        const message = `确认对【${periodLabel}】执行一键结转吗？\n\n执行顺序：\n① 计提税金及附加（读取基础设置规则）\n② 结转本期各项收入 → 本年利润\n③ 结转本期成本费用及税金 → 本年利润\n\n生成的凭证状态为"待审核"，需完成审核后方可执行月末结账。`;
        if (!confirm(message)) return;
        const result = window.apiPostPeriodEndClosing({ period: periodStr });
        if (!result.success) {
            alert(`❌ ${result.message || "结转失败"}`);
            return;
        }
        const toList = (value) => Array.isArray(value) ? value : (value ? [value] : []);
        const taxList    = toList(result.vouchers.tax);
        const incomeList = toList(result.vouchers.income);
        const costList   = toList(result.vouchers.cost);
        const fmtAmt = (n) => (typeof n === "number" ? n.toFixed(2) : "-");
        const amounts = result.amounts || {};
        alert(
            `✅ 【${periodLabel}】一键结转完成！\n\n` +
            `① 税金凭证：${taxList.join("、") || "（无需计提）"}  金额：${fmtAmt(amounts.tax)}\n` +
            `② 收入凭证：${incomeList.join("、") || "-"}  净额：${fmtAmt(amounts.income)}\n` +
            `③ 成本凭证：${costList.join("、") || "-"}  净额：${fmtAmt(amounts.cost)}\n\n` +
            `本期损益净额：${fmtAmt(amounts.profit)}`
        );
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
