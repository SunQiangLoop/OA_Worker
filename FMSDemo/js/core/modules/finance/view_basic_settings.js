// js/core/modules/finance/view_basic_settings.js
// 基础设置（会计准则、凭证字号、税金计提等）
window.VM_MODULES = window.VM_MODULES || {};

// =========================================================================
// AccountingStandardSetting
// =========================================================================
window.VM_MODULES['AccountingStandardSetting'] = function(contentArea, contentHTML, moduleCode) {
        const { standard, locked } = getAccountingStandardState();
        const taxLocked = localStorage.getItem("TaxAccrualLocked") === "true";
        const subjectSetting = getSubjectCodeSetting();
        const wordMode = localStorage.getItem("VoucherWordMode") || "spt";
        const summaryTemplates = getVoucherSummaryTemplates();
        const defaultIncomeTemplate = [
            { name: "一、营业收入",                                    codes: "5001,5051,6001,6011,6051",  op: "+" },
            { name: "减：营业成本",                                    codes: "5401,5402,6401,6402",       op: "-" },
            { name: "税金及附加",                                      codes: "5403,6403",                 op: "-" },
            { name: "其中：消费税",                                    codes: "",                          op: "-" },
            { name: "城市维护建设税",                                  codes: "",                          op: "-" },
            { name: "资源税",                                          codes: "",                          op: "-" },
            { name: "土地增值税",                                      codes: "",                          op: "-" },
            { name: "城镇土地使用税、房产税、车船税、印花税",          codes: "",                          op: "-" },
            { name: "教育费附加、矿产资源补偿费、排污费",              codes: "",                          op: "-" },
            { name: "销售费用",                                        codes: "5601,6601",                 op: "-" },
            { name: "其中：商品维修费",                                codes: "",                          op: "-" },
            { name: "广告费和业务宣传费",                              codes: "",                          op: "-" },
            { name: "管理费用",                                        codes: "5602,6602",                 op: "-" },
            { name: "其中：开办费",                                    codes: "",                          op: "-" },
            { name: "业务招待费",                                      codes: "",                          op: "-" },
            { name: "研究费用",                                        codes: "",                          op: "-" },
            { name: "财务费用",                                        codes: "5603,6603",                 op: "-" },
            { name: "其中：利息费用（收以\"-\"号填列）",               codes: "",                          op: "-" },
            { name: "加：投资收益（损失以\"-\"号填列）",               codes: "5101,6111",                 op: "+" },
            { name: "二、营业利润（亏损以\"-\"号填列）",               codes: "",                          op: "+" },
            { name: "加：营业外收入",                                  codes: "5301,6301",                 op: "+" },
            { name: "其中：政府补助",                                  codes: "",                          op: "+" },
            { name: "减：营业外支出",                                  codes: "5801,6711",                 op: "-" },
            { name: "其中：坏账损失",                                  codes: "",                          op: "-" },
            { name: "无法收回的长期债券投资损失",                      codes: "",                          op: "-" },
            { name: "无法收回的长期股权投资损失",                      codes: "",                          op: "-" },
            { name: "自然灾害等不可抗力因素造成的损失",                codes: "",                          op: "-" },
            { name: "税收滞纳金",                                      codes: "",                          op: "-" },
            { name: "三、利润总额（亏损总额以\"-\"号填列）",           codes: "",                          op: "+" },
            { name: "减：所得税费用",                                  codes: "5901,6801",                 op: "-" },
            { name: "四、净利润（净亏损以\"-\"号填列）",               codes: "",                          op: "+" },
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
        // 借方科目随会计准则变动：小企业准则用 5403，企业准则用 6403
        const TAX_DEBIT_CODE = standard === "enterprise" ? "6403" : "5403";

        const loadTaxAccrualRules = () => {
            try {
                const stored = JSON.parse(
                    localStorage.getItem(TAX_ACCRUAL_RULE_KEY)
                    || sessionStorage.getItem(TAX_ACCRUAL_RULE_KEY)
                    || "[]"
                );
                if (Array.isArray(stored) && stored.length) {
                    // 自动同步借方科目：当会计准则切换时，5403↔6403 自动更新
                    return stored.map(row => ({
                        ...row,
                        debitCode: (row.debitCode === "5403" || row.debitCode === "6403")
                            ? TAX_DEBIT_CODE
                            : row.debitCode
                    }));
                }
            } catch (error) {
                // ignore
            }
            // 3 条初始化默认模板（可修改后保存）
            return [
                { taxName: "城市维护建设税", baseCodes: "222101", direction: "贷方净额", rate: "7",  debitCode: TAX_DEBIT_CODE, creditCode: "222102", aux: "" },
                { taxName: "教育附加",       baseCodes: "222101", direction: "贷方净额", rate: "3",  debitCode: TAX_DEBIT_CODE, creditCode: "222103", aux: "" },
                { taxName: "地方教育附加",   baseCodes: "222101", direction: "贷方净额", rate: "2",  debitCode: TAX_DEBIT_CODE, creditCode: "222104", aux: "" }
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
                <td><input type="text" class="tax-aux-input" value="${row.aux || ""}" placeholder="" ${taxLocked ? "disabled" : ""}></td>
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
            localStorage.setItem(TAX_ACCRUAL_RULE_KEY, JSON.stringify(data));
            sessionStorage.setItem(TAX_ACCRUAL_RULE_KEY, JSON.stringify(data));
            alert("✅ 计提税金及附加设置已保存。");
        };

        window.toggleTaxDirTip = function() {
            // 弹出小提示框显示取数方向举例
            const existing = document.getElementById("tax-dir-tip-popup");
            if (existing) { existing.remove(); return; }
            const popup = document.createElement("div");
            popup.id = "tax-dir-tip-popup";
            popup.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:#fff;border:1px solid #3498db;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.18);padding:20px 24px;max-width:420px;width:90%;";
            popup.innerHTML = `
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <strong style="font-size:14px;color:#2c3e50;">取数方向说明</strong>
                    <span onclick="document.getElementById('tax-dir-tip-popup').remove()" style="cursor:pointer;font-size:18px;color:#999;line-height:1;">✕</span>
                </div>
                <div style="font-size:13px;color:#555;line-height:2;">
                    <div style="margin-bottom:10px;">
                        <strong style="color:#2980b9;">贷方发生额</strong><br>
                        以增值税科目当期贷方发生额整体作为计提基数，不扣减进项。<br>
                        <span style="color:#888;">举例：销项税 10 万，进项抵扣 8 万 → 基数 = <strong>10 万</strong></span>
                    </div>
                    <div>
                        <strong style="color:#27ae60;">贷方净额</strong><br>
                        以贷方发生额减去借方发生额（抵扣进项后）的净值作为基数。<br>
                        <span style="color:#888;">举例：销项 10 万，进项 8 万 → 基数 = <strong>10 − 8 = 2 万</strong></span>
                    </div>
                </div>
            `;
            document.body.appendChild(popup);
            // 点击遮罩外部关闭
            setTimeout(() => {
                document.addEventListener("click", function handler(e) {
                    if (!popup.contains(e.target) && !e.target.closest('[onclick*="toggleTaxDirTip"]')) {
                        popup.remove();
                        document.removeEventListener("click", handler);
                    }
                });
            }, 100);
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
                voucherWord: "转",
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
            const wordVal = tpl.voucherWord || "转";
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

        // 结转收入/成本：横向表格行
        const buildClosingRow = (tpl, type, index) => {
            const sourceCodes = (tpl.sourceCodes || []).join(",");
            const wordVal = tpl.voucherWord || "转";
            const sourceLabel = type === "income" ? "收入科目范围" : "成本费用科目范围";
            return `
                <tr class="closing-template-card" data-type="${type}" data-template-id="${tpl.id || ""}">
                    <td style="text-align:center; color:#999; font-size:12px; width:40px;">${index + 1}</td>
                    <td style="width:130px;">${renderBookSelect(tpl.bookId || "", "closing-book-select")}</td>
                    <td><input type="text" class="closing-source-input" value="${sourceCodes}" placeholder="${sourceLabel}，多个用逗号分隔"></td>
                    <td style="width:150px;">${renderSubjectSelect(tpl.targetCode || "4103", "closing-target-select")}</td>
                    <td style="width:70px;"><input type="text" class="closing-word-input" value="${wordVal}" placeholder="转"></td>
                    <td style="text-align:center; width:60px;"><button class="btn-primary btn-ghost closing-template-remove" style="padding:3px 8px; font-size:12px;" onclick="removeClosingTemplate(this)">删除</button></td>
                </tr>`;
        };

        window.addClosingTemplate = function(type) {
            const container = document.getElementById(`closing-template-${type}`);
            if (!container) return;
            const count = container.querySelectorAll(".closing-template-card").length;
            const tpl = createClosingTemplate(type, count);
            // income/cost 用表格行，tax 用卡片
            if (type === "income" || type === "cost") {
                container.insertAdjacentHTML("beforeend", buildClosingRow(tpl, type, count));
            } else {
                container.insertAdjacentHTML("beforeend", buildClosingCard(tpl, type, count));
            }
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
        <style>
            /* ===== 基础设置页面样式 ===== */
            .proto-content { padding: 20px; width: 100%; box-sizing: border-box; }
            .page-title-bar { font-size: 20px; font-weight: bold; color: #2c3e50; padding: 0 0 10px 0; }
            /* 按钮覆盖 */
            .proto-content .btn-primary { background-color: #3498db; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.2s; }
            .proto-content .btn-primary:hover { background-color: #2980b9; }
            .proto-content .btn-primary:disabled { background-color: #bdc3c7; cursor: not-allowed; }
            .proto-content .btn-ghost { background: #f6f8fa; color: #2c3e50; border: 1px solid #d7dde3; box-shadow: none; padding: 6px 12px; font-size: 12px; }
            .proto-content .btn-ghost:hover { background: #edf1f5; }
            /* 表格 */
            .proto-content .data-table { width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .proto-content .data-table th, .proto-content .data-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ecf0f1; }
            .proto-content .data-table th { background-color: #f7f9fa; font-weight: bold; color: #555; }
            .proto-content .data-table tbody tr:last-child td { border-bottom: none; }
            /* 会计准则面板 */
            .acct-standard-panel { background: #ffffff; border-radius: 12px; padding: 20px; margin-bottom: 0; }
            .acct-standard-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
            .acct-standard-status { font-size: 13px; color: #637382; }
            .acct-standard-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px; font-size: 12px; background: #f0f4f8; color: #5d6e7e; border: 1px solid #d7dde3; white-space: nowrap; }
            .acct-standard-group { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 16px; }
            .acct-standard-group input[type="radio"] { display: none; }
            .acct-standard-card { border: 1px solid #e1e5ea; border-radius: 14px; padding: 18px 20px; cursor: pointer; display: block; transition: all 0.2s; background: #fff; }
            .acct-standard-card:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.08); }
            .acct-standard-group input[type="radio"]:checked + .acct-standard-card { border-color: #2c3e50; box-shadow: 0 10px 24px rgba(44,62,80,0.15); background: #f0f7ff; }
            .acct-standard-card h4 { margin: 0 0 8px 0; font-size: 16px; color: #2c3e50; }
            .acct-standard-card p { margin: 0; font-size: 13px; color: #7f8c8d; line-height: 1.5; }
            .acct-standard-card .acct-standard-badge { display: inline-flex; align-items: center; margin-top: 10px; padding: 3px 10px; border-radius: 999px; font-size: 12px; background: #e6f9f0; color: #1a7a4a; border: 1px solid #b2dfce; }
            /* 科目编码级次设置 */
            .subject-code-setting { margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e6eaf0; }
            .subject-code-setting .setting-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
            .subject-code-setting label { font-size: 13px; color: #4a5a6a; }
            .subject-code-setting select { padding: 6px 10px; border: 1px solid #cfd6dd; border-radius: 5px; font-size: 13px; width: 80px; }
            .subject-code-setting input[type="number"] { padding: 6px 10px; border: 1px solid #cfd6dd; border-radius: 5px; font-size: 13px; width: 70px; }
            /* 凭证摘要模板面板 */
            .summary-template-panel { margin-top: 16px; padding: 14px; background: #fff; border-radius: 8px; border: 1px solid #e6eaf0; }
            .summary-template-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
            .summary-template-title { font-weight: 700; color: #2c3e50; }
            .summary-template-tip { margin-top: 4px; font-size: 12px; color: #95a5a6; }
            .summary-template-actions { display: flex; gap: 8px; flex-shrink: 0; }
            .summary-template-actions .btn-primary { padding: 4px 10px; font-size: 12px; }
            .summary-template-table-wrap { margin-top: 10px; border: 1px solid #eef2f6; border-radius: 6px; overflow: hidden; }
            .summary-template-table { margin: 0; font-size: 12px; }
            .summary-template-table th, .summary-template-table td { padding: 6px 8px; }
            .summary-template-table th { background: #f7f9fb; }
            .summary-template-table input { width: 100%; padding: 4px 6px; border: 1px solid #dce3ea; border-radius: 4px; font-size: 12px; }
            .summary-template-table .summary-template-action { padding: 2px 8px; font-size: 11px; }
            .summary-template-note { margin-top: 8px; font-size: 12px; color: #95a5a6; }
            /* 报表模板面板 */
            .report-template-panel { margin-top: 18px; background: #fff; border-radius: 8px; padding: 16px; border: 1px solid #e6eaf0; }
            .report-template-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
            .report-template-title { font-size: 15px; font-weight: 600; color: #2c3e50; }
            .report-template-tip { font-size: 12px; color: #94a3b8; margin-top: 4px; }
            .report-template-actions { display: flex; gap: 8px; }
            .template-row-btn { padding: 2px 8px; min-width: 30px; }
            .report-template-table-wrap { overflow: auto; max-height: 420px; border: 1px solid #eef2f6; border-radius: 6px; }
            .report-template-table input, .report-template-table select { width: 80%; padding: 4px 6px; border: 1px solid #dce3ea; border-radius: 4px; font-size: 12px; }
            .report-template-table td { padding: 6px; }
            .report-template-table thead th { position: sticky; top: 0; background: #f7f9fa; z-index: 1; }
            .report-template-table { border-collapse: separate; position: relative; }
            .report-template-table--income th, .report-template-table--income td { white-space: nowrap; }
            .report-template-table--income { min-width: 980px; }
            .template-checkbox { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; }
            .template-checkbox input { margin: 0; }
            /* 期末结转模板 */
            .closing-template-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
            .closing-template-group { margin-top: 16px; }
            .closing-template-group-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
            .closing-template-group-title { font-size: 14px; font-weight: 600; color: #2c3e50; }
            .closing-template-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; background: #fafbfc; }
            .closing-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
            .closing-card-header h4 { margin: 0; font-size: 14px; color: #2c3e50; }
            .closing-template-remove { padding: 2px 6px; font-size: 12px; }
            .closing-field { margin-bottom: 10px; }
            .closing-field label { display: block; font-size: 12px; color: #94a3b8; margin-bottom: 4px; }
            .closing-template-card input, .closing-template-card select { box-sizing: border-box; max-width: 100%; width: 100%; padding: 6px 8px; border: 1px solid #dce3ea; border-radius: 4px; font-size: 13px; }
            /* 计提税金附加面板 */
            .tax-accrual-panel { background: #fff; border: 1px solid #e6e8ec; border-radius: 12px; padding: 18px; box-shadow: 0 8px 24px rgba(15,23,42,0.06); }
            .tax-accrual-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
            .tax-accrual-title { font-size: 18px; font-weight: 600; color: #1f2937; }
            .tax-accrual-lock { font-size: 12px; color: #f59e0b; background: #fffbeb; padding: 3px 10px; border-radius: 999px; }
            .tax-accrual-desc { margin-top: 6px; font-size: 13px; color: #6b7280; line-height: 1.6; }
            .tax-info-grid { margin-top: 16px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            .tax-info-item label { display: block; font-size: 12px; color: #6b7280; margin-bottom: 6px; }
            .tax-info-item select, .tax-info-item input { width: 100%; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; }
            .tax-rule-card { margin-top: 18px; border: 1px solid #edf0f4; border-radius: 10px; padding: 14px; background: #f9fafb; }
            .tax-rule-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
            .tax-rule-actions { display: flex; gap: 8px; align-items: center; }
            .tax-rule-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
            .tax-rule-table th, .tax-rule-table td { border-bottom: 1px solid #edf0f4; padding: 10px; text-align: left; }
            .tax-rule-table th { background: #f3f4f6; color: #4b5563; font-weight: 600; }
            .tax-rule-table input[type="text"], .tax-rule-table input[type="number"], .tax-rule-table select { width: 100%; padding: 6px 8px; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; }
            .tax-direction-group { display: flex; flex-direction: column; gap: 4px; }
            .tax-preview { margin-top: 18px; border: 1px dashed #d1d5db; border-radius: 10px; padding: 14px; background: #fff; }
            .tax-preview-title { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px; }
            .tax-preview-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
            .tax-preview-box { background: #f9fafb; border-radius: 10px; padding: 12px; color: #374151; }
            .tax-preview-note { margin-top: 10px; font-size: 12px; color: #6b7280; }
            .tax-rule-footer { margin-top: 12px; display: flex; justify-content: flex-end; }
            hr.section-divider { border: none; border-top: 1px solid #eef2f6; margin: 0; }
            /* 科目多选控件 */
            .subject-multi-select { position: relative; display: inline-block; width: 100%; }
            .subject-multi-input { width: 100%; padding: 4px 24px 4px 6px; border: 1px solid #dce3ea; border-radius: 4px; font-size: 12px; cursor: pointer; box-sizing: border-box; }
            .subject-multi-arrow { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); pointer-events: none; color: #888; font-size: 12px; }
            .subject-multi-panel { display: none; position: fixed; background: #fff; border: 1px solid #d9d9d9; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); z-index: 3000; min-width: 280px; max-height: 320px; flex-direction: column; }
            .subject-multi-panel.is-open { display: flex; }
            .subject-multi-header { display: flex; padding: 6px 8px; background: #fafafa; border-bottom: 1px solid #f0f0f0; font-size: 12px; font-weight: 600; color: #555; }
            .subject-multi-header .col-check { width: 24px; }
            .subject-multi-header .col-code { width: 80px; }
            .subject-multi-header .col-name { flex: 1; }
            .subject-multi-list { flex: 1; overflow-y: auto; padding: 4px 0; }
            .subject-option { display: flex; align-items: center; padding: 5px 8px; cursor: pointer; font-size: 12px; gap: 6px; }
            .subject-option:hover { background: #f5f5f5; }
            .subject-option input[type="checkbox"] { width: 14px; height: 14px; margin: 0; flex-shrink: 0; }
            .subject-option .code { width: 80px; color: #555; }
            .subject-option .name { flex: 1; color: #333; }
            .subject-multi-empty { padding: 12px 8px; font-size: 12px; color: #999; text-align: center; }
            .subject-multi-actions { display: flex; justify-content: flex-end; gap: 8px; padding: 6px 8px; border-top: 1px solid #f0f0f0; }
            /* 结转收入/成本 横向表格布局 */
            .closing-tbl-section { margin-top: 16px; }
            .closing-tbl-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
            .closing-tbl-title { font-size: 14px; font-weight: 600; color: #2c3e50; }
            .closing-tbl-wrap { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
            .closing-tbl { width: 100%; border-collapse: collapse; table-layout: fixed; }
            .closing-tbl thead tr { background: #f7f9fa; }
            .closing-tbl th { padding: 9px 10px; font-size: 12px; font-weight: 600; color: #555; border-bottom: 1px solid #e2e8f0; text-align: left; white-space: nowrap; }
            .closing-tbl tbody { display: block; max-height: 180px; overflow-y: auto; }
            .closing-tbl thead, .closing-tbl tbody tr { display: table; width: 100%; table-layout: fixed; }
            .closing-tbl td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; font-size: 13px; vertical-align: middle; }
            .closing-tbl tbody tr:last-child td { border-bottom: none; }
            .closing-tbl tbody tr:hover { background: #fafbff; }
            .closing-tbl td input, .closing-tbl td select { width: 100%; box-sizing: border-box; padding: 5px 7px; border: 1px solid #dce3ea; border-radius: 4px; font-size: 12px; }
            .closing-tbl td input:focus, .closing-tbl td select:focus { outline: none; border-color: #3498db; }
        </style>

        <div class="proto-content">

            <!-- ============ 1. 会计准则 + 科目编码 + 凭证摘要 + 期末结转 ============ -->
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

                <div class="acct-standard-group">
                    <input type="radio" id="standard-small" name="acct-standard" value="small" ${standard === "small" || !standard ? "checked" : ""} ${locked ? "disabled" : ""} onchange="acsmOnStandardChange(this)">
                    <label class="acct-standard-card" for="standard-small">
                        <h4>《小企业会计准则》</h4>
                        <p>适合大多数中小型物流/货运企业，科目数量精简，上手更快。</p>
                        <div class="acct-standard-badge">推荐 · 轻量级科目体系</div>
                    </label>

                    <input type="radio" id="standard-enterprise" name="acct-standard" value="enterprise" ${standard === "enterprise" ? "checked" : ""} ${locked ? "disabled" : ""} onchange="acsmOnStandardChange(this)">
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

                <!-- ============ 2. 科目编码级次设置 + 凭证字号设置 ============ -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px;">

                    <!-- 科目编码级次设置 -->
                    <div class="subject-code-setting" style="margin-top:0;">
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
                            <input type="number" id="subject-length-1" value="${subjectSetting.lengths[0] || 4}" min="1">
                            <input type="number" id="subject-length-2" value="${subjectSetting.lengths[1] || 2}" min="1">
                            <input type="number" id="subject-length-3" value="${subjectSetting.lengths[2] || 2}" min="1" style="${subjectSetting.levels < 3 ? "display:none;" : ""}">
                            <input type="number" id="subject-length-4" value="${subjectSetting.lengths[3] || 2}" min="1" style="${subjectSetting.levels < 4 ? "display:none;" : ""}">
                            <input type="number" id="subject-length-5" value="${subjectSetting.lengths[4] || 2}" min="1" style="${subjectSetting.levels < 5 ? "display:none;" : ""}">
                            <button class="btn-primary" onclick="saveSubjectCodeSetting()">保存设置</button>
                        </div>
                        <div id="subject-code-example" style="margin-top:8px; font-size:12px; color:#95a5a6;">
                            示例：级次=3，长度=4/2/2，对应 1000 → 100001 → 10000101。
                        </div>
                    </div>

                    <!-- 凭证字号设置 -->
                    <div class="subject-code-setting" style="margin-top:0;">
                        <div style="font-weight:bold; color:#2c3e50; margin-bottom:6px;">凭证字号设置</div>
                        <p style="font-size:12px; color:#95a5a6; margin:0 0 12px;">设置凭证字号方式，全局生效，影响凭证录入、会计引擎及期末结转。</p>
                        <div style="display:flex; flex-direction:column; gap:10px;">
                            <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px 12px; border-radius:6px; border:1px solid ${wordMode === 'ji' ? '#3498db' : '#e6eaf0'}; background:${wordMode === 'ji' ? '#f0f7ff' : '#fff'}; transition:all 0.15s;">
                                <input type="radio" name="voucher-word-mode" value="ji" ${wordMode === 'ji' ? 'checked' : ''} style="margin-top:3px; flex-shrink:0;">
                                <div>
                                    <div style="font-size:13px; font-weight:600; color:#2c3e50;">记 — 统一字号</div>
                                    <div style="font-size:12px; color:#7f8c8d; margin-top:2px;">所有凭证统一使用"记"字，适合不区分凭证类别的场景。</div>
                                </div>
                            </label>
                            <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px 12px; border-radius:6px; border:1px solid ${wordMode !== 'ji' ? '#3498db' : '#e6eaf0'}; background:${wordMode !== 'ji' ? '#f0f7ff' : '#fff'}; transition:all 0.15s;">
                                <input type="radio" name="voucher-word-mode" value="spt" ${wordMode !== 'ji' ? 'checked' : ''} style="margin-top:3px; flex-shrink:0;">
                                <div>
                                    <div style="font-size:13px; font-weight:600; color:#2c3e50;">收 / 付 / 转 — 分类字号</div>
                                    <div style="font-size:12px; color:#7f8c8d; margin-top:2px;">收款用"收"，付款用"付"，转账及其他用"转"。</div>
                                </div>
                            </label>
                        </div>
                        <div style="margin-top:14px; display:flex; align-items:center; gap:10px;">
                            <button class="btn-primary" onclick="saveVoucherWordSetting()">保存设置</button>
                            <span id="voucher-word-save-tip" style="font-size:12px; color:#27ae60; display:none;">✅ 已保存</span>
                        </div>
                    </div>

                </div><!-- end 两列设置网格 -->

                <!-- ============ 3. 凭证摘要模板设置中心 ============ -->
                <div class="summary-template-panel">
                    <div class="summary-template-header">
                        <div>
                            <div class="summary-template-title">凭证摘要模板设置中心</div>
                            <div class="summary-template-tip">维护常用摘要，凭证录入时可快速选择。</div>
                        </div>
                        <div class="summary-template-actions">
                            <button class="btn-primary summary-template-action" onclick="addVoucherSummaryTemplateRow()">+ 新增模板</button>
                            <button class="btn-primary summary-template-action btn-ghost" onclick="resetVoucherSummaryTemplates()">恢复默认</button>
                            <button class="btn-primary summary-template-action" onclick="saveVoucherSummaryTemplates()">保存设置</button>
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
                            <tbody id="summary-template-body">
                                ${summaryTemplateRows}
                            </tbody>
                        </table>
                    </div>
                    <div class="summary-template-note">提示：凭证录入的摘要输入框支持下拉提示。</div>
                </div>

                <!-- ============ 4. 期末结转凭证模板设置 ============ -->
                <div class="report-template-panel closing-template-panel">
                    <div class="report-template-header">
                        <div>
                            <div class="report-template-title">期末结转凭证模板设置</div>
                            <div class="report-template-tip">配置税金、收入、成本费用三类模板，结转时按优先级自动生成凭证。</div>
                        </div>
                        <div class="report-template-actions">
                        </div>
                    </div>

                    <!-- ① 计提税金及附加 -->
                    <div class="closing-tbl-section tax-accrual-panel">
                        <div class="closing-tbl-header">
                            <span class="closing-tbl-title">① 计提税金及附加设置</span>
                            <div style="display:flex;gap:8px;">
                                <button class="btn-primary btn-ghost" onclick="saveTaxAccrualRules()">保存</button>
                                <button class="btn-primary template-row-btn" onclick="addTaxAccrualRuleRow()">+ 新增</button>
                            </div>
                        </div>
                        <div style="margin-bottom:8px; padding:8px 12px; background:#f0f7ff; border-left:3px solid #3498db; border-radius:0 4px 4px 0; font-size:12px; color:#555; line-height:1.7;">
                            <strong style="color:#2c3e50;">取数方向说明：</strong>
                            <span style="margin-left:8px;">📌 <strong>贷方发生额</strong>：销项全额（含已抵扣进项）&nbsp;&nbsp;|&nbsp;&nbsp; 📌 <strong>贷方净额</strong>：销项 − 进项（已抵扣后的净值）</span>
                        </div>
                        <div class="closing-tbl-wrap">
                            <table class="tax-rule-table">
                                <thead>
                                    <tr>
                                        <th>税种名称</th>
                                        <th>计算基数科目</th>
                                        <th>取数方向 <span onclick="toggleTaxDirTip()" title="点击查看说明" style="cursor:pointer; color:#e74c3c; font-size:15px; font-weight:700; vertical-align:middle;">❓</span></th>
                                        <th>计提比例(%)</th>
                                        <th>借方科目</th>
                                        <th>贷方科目</th>
                                        <th>辅助核算项</th>
                                        <th style="width:70px;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="tax-accrual-body">
                                    ${taxAccrualRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- ② 结转收入（表格形式） -->
                    <div class="closing-tbl-section">
                        <div class="closing-tbl-header">
                            <span class="closing-tbl-title">② 结转收入</span>
                            <div style="display:flex;gap:8px;">
                                <button class="btn-primary btn-ghost" onclick="saveClosingTemplateSettings()">保存</button>
                                <button class="btn-primary template-row-btn" onclick="addClosingTemplate('income')">+ 新增</button>
                            </div>
                        </div>
                        <div class="closing-tbl-wrap">
                            <table class="closing-tbl">
                                <thead>
                                    <tr>
                                        <th style="width:40px;">序号</th>
                                        <th style="width:130px;">账套</th>
                                        <th>收入科目范围</th>
                                        <th style="width:150px;">转入科目</th>
                                        <th style="width:70px;">凭证字</th>
                                        <th style="width:60px;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="closing-template-income">
                                    ${closingIncomeTemplates.map((t, i) => buildClosingRow(t, "income", i)).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- ③ 结转成本费用（表格形式） -->
                    <div class="closing-tbl-section">
                        <div class="closing-tbl-header">
                            <span class="closing-tbl-title">③ 结转成本费用</span>
                            <div style="display:flex;gap:8px;">
                                <button class="btn-primary btn-ghost" onclick="saveClosingTemplateSettings()">保存</button>
                                <button class="btn-primary template-row-btn" onclick="addClosingTemplate('cost')">+ 新增</button>
                            </div>
                        </div>
                        <div class="closing-tbl-wrap">
                            <table class="closing-tbl">
                                <thead>
                                    <tr>
                                        <th style="width:40px;">序号</th>
                                        <th style="width:130px;">账套</th>
                                        <th>成本费用科目范围</th>
                                        <th style="width:150px;">转入科目</th>
                                        <th style="width:70px;">凭证字</th>
                                        <th style="width:60px;">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="closing-template-cost">
                                    ${closingCostTemplates.map((t, i) => buildClosingRow(t, "cost", i)).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div><!-- end closing-template-panel -->

            </div><!-- end acct-standard-panel -->

            <!-- ============ 5. 利润表设置 ============ -->
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
                        <tbody id="income-template-body">
                            ${incomeTemplateRows}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ============ 6. 现金流量表设置 ============ -->
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
                        <tbody id="cashflow-template-body">
                            ${cashflowTemplateRows}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ============ 7. 资产负债表设置 ============ -->
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
                    <table class="data-table report-template-table" style="min-width:900px;">
                        <thead>
                            <tr>
                                <th style="width:50px;">序号</th>
                                <th style="width:50px;">操作</th>
                                <th>项目名称</th>
                                <th style="width:130px;">类型</th>
                                <th style="width:160px;">期末科目组成</th>
                                <th style="width:80px;">运算符</th>
                                <th style="width:160px;">期初科目组成</th>
                                <th style="width:80px;">运算符</th>
                            </tr>
                        </thead>
                        <tbody id="balance-template-body">
                            ${balanceTemplateRows}
                        </tbody>
                    </table>
                </div>
            </div>

        </div><!-- end proto-content -->
        `;
        setTimeout(() => {
            window.acsmOnStandardChange = function(radio) {
                if (!radio) return;
                const isEnterprise = radio.value === 'enterprise';
                const versionEl = document.getElementById('acsm-standard-version');
                const scopeEl = document.getElementById('acsm-standard-scope');
                const diffEl = document.getElementById('acsm-standard-diff');
                if (versionEl) versionEl.textContent = isEnterprise ? '企业会计准则（2006版及后续修订）' : '小企业会计准则（2013版）';
                if (scopeEl) scopeEl.textContent = isEnterprise ? '适用于所有企业，上市公司强制执行' : '适用于符合《中小企业划型标准》规定的小企业';
                if (diffEl) {
                    if (isEnterprise) {
                        diffEl.innerHTML = '<span style="color:#1890ff;font-weight:500;">企业准则关键特征：</span>所有者权益 <b>4xxx</b>（实收资本4001、资本公积4002）&nbsp;·&nbsp;损益类 <b>6xxx</b>（主营收入6001、成本6401、费用6601~6603）&nbsp;·&nbsp;存货分细科目（1403原材料/1405库存商品等）&nbsp;·&nbsp;科目约90个';
                    } else {
                        diffEl.innerHTML = '<span style="color:#52c41a;font-weight:500;">小企业准则关键特征：</span>所有者权益 <b>3xxx</b>（实收资本3001、资本公积3002）&nbsp;·&nbsp;损益类 <b>5xxx</b>（主营收入5001、成本5401、费用5601~5603）&nbsp;·&nbsp;存货合并为 <b>1401存货</b>&nbsp;·&nbsp;科目约55个，简化核算';
                    }
                }
            };
            window.acsmShowStandardInfo = function() {
                const sel = document.querySelector('input[name="acct-standard"]:checked');
                const isEnterprise = sel && sel.value === 'enterprise';
                const html = `
                <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center;" id="acsmInfoModal">
                <div style="background:#fff;border-radius:8px;width:860px;max-width:95vw;max-height:85vh;overflow-y:auto;box-shadow:0 4px 20px rgba(0,0,0,.2);">
                    <div style="padding:16px 24px;border-bottom:1px solid #e8e8e8;display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:16px;font-weight:600;">会计准则对比说明</span>
                        <button onclick="document.getElementById('acsmInfoModal').remove()" style="border:none;background:none;font-size:20px;cursor:pointer;color:#666;">×</button>
                    </div>
                    <div style="padding:24px;">
                        <table style="width:100%;border-collapse:collapse;font-size:13px;">
                            <thead>
                                <tr style="background:#fafafa;">
                                    <th style="padding:10px 12px;border:1px solid #e8e8e8;text-align:left;width:22%;">对比维度</th>
                                    <th style="padding:10px 12px;border:1px solid #e8e8e8;text-align:left;background:#f6ffed;color:#389e0d;">小企业会计准则（2013）</th>
                                    <th style="padding:10px 12px;border:1px solid #e8e8e8;text-align:left;background:#e6f7ff;color:#096dd9;">企业会计准则（2006+）</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">适用对象</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">符合《中小企业划型标准》的小型企业</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">所有企业；上市公司、国有大型企业强制执行</td>
                                </tr>
                                <tr style="background:#fafafa;">
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">科目数量</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">约55个一级科目，简化核算</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">约90个一级科目，覆盖复杂业务</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;color:#e67e22;">⭐ 所有者权益编码</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;"><b style="color:#389e0d;">3xxx</b>（3001实收资本、3002资本公积、3101盈余公积、3103本年利润）</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;"><b style="color:#096dd9;">4xxx</b>（4001实收资本、4002资本公积、4101盈余公积、4103本年利润）</td>
                                </tr>
                                <tr style="background:#fafafa;">
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;color:#e67e22;">⭐ 损益类编码</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;"><b style="color:#389e0d;">5xxx</b>（5001主营业务收入、5401主营业务成本、5602管理费用、5603财务费用）</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;"><b style="color:#096dd9;">6xxx</b>（6001主营业务收入、6401主营业务成本、6602管理费用、6603财务费用）</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">成本类编码</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;"><b>4xxx</b>（4001生产成本、4101制造费用）</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;"><b>5xxx</b>（5001生产成本、5101制造费用、5201劳务成本、5301研发支出）</td>
                                </tr>
                                <tr style="background:#fafafa;">
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">存货核算</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;"><b>1401存货</b>（合并核算，不分原材料/商品等）</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">1401材料采购 / 1403原材料 / 1405库存商品 / 1406发出商品 等分细核算</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">收入科目</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">5001主营业务收入 + 5051其他业务收入（合并简化）</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">6001主营业务收入 + 6051其他业务收入（分开核算）</td>
                                </tr>
                                <tr style="background:#fafafa;">
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">金融工具</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">无交易性金融资产（1101）等复杂金融科目</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">有1101交易性金融资产、1511可供出售金融资产、2002交易性金融负债等</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">所得税</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">5901所得税费用；无递延所得税资产/负债</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">6801所得税费用；有1811递延所得税资产、2701递延所得税负债</td>
                                </tr>
                                <tr style="background:#fafafa;">
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;font-weight:500;">报表要求</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">资产负债表 + 利润表（简化版），无现金流量表要求</td>
                                    <td style="padding:10px 12px;border:1px solid #e8e8e8;">资产负债表 + 利润表 + 现金流量表 + 所有者权益变动表（完整版）</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="margin-top:16px;padding:12px 16px;background:#fffbe6;border:1px solid #ffe58f;border-radius:4px;font-size:13px;color:#614700;">
                            <b>切换注意事项：</b>两套准则的所有者权益和损益科目编码<b>完全不同</b>，切换准则后系统将载入对应的标准科目表。如已有凭证数据，准则将被锁定，不允许再切换。
                        </div>
                    </div>
                </div>
                </div>`;
                document.body.insertAdjacentHTML('beforeend', html);
            };
            window.acsmOpenSummaryModal = function(title) {
                const titleEl = document.getElementById('acsmModalTitle');
                const el = document.getElementById('acsmSummaryModal');
                if (titleEl) titleEl.textContent = title;
                if (el) el.classList.add('active');
            };
            window.acsmCloseSummaryModal = function() {
                const el = document.getElementById('acsmSummaryModal');
                if (el) el.classList.remove('active');
            };
            window.acsmToggleSelect = function(item) {
                if (!item) return;
                item.classList.toggle('selected');
                const cb = item.querySelector('input[type="checkbox"]');
                if (cb) cb.checked = !cb.checked;
            };
            function acsmUpdateRightCount() {
                const rl = document.getElementById('acsmRightList');
                const el = document.getElementById('acsmRightCount');
                if (el && rl) el.textContent = rl.querySelectorAll('.acsm-list-item').length;
            }
            window.acsmMoveToRight = function() {
                const ll = document.getElementById('acsmLeftList');
                const rl = document.getElementById('acsmRightList');
                if (!ll || !rl) return;
                ll.querySelectorAll('.acsm-list-item.selected').forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.remove('selected');
                    clone.querySelector('input').checked = false;
                    clone.setAttribute('draggable', 'true');
                    clone.onclick = function() { window.acsmToggleSelect(this); };
                    rl.appendChild(clone);
                    item.remove();
                });
                acsmUpdateRightCount();
            };
            window.acsmMoveToLeft = function() {
                const ll = document.getElementById('acsmLeftList');
                const rl = document.getElementById('acsmRightList');
                if (!ll || !rl) return;
                rl.querySelectorAll('.acsm-list-item.selected').forEach(item => {
                    const clone = item.cloneNode(true);
                    clone.classList.remove('selected');
                    clone.querySelector('input').checked = false;
                    clone.removeAttribute('draggable');
                    clone.onclick = function() { window.acsmToggleSelect(this); };
                    ll.appendChild(clone);
                    item.remove();
                });
                acsmUpdateRightCount();
            };
            window.acsmSearchLeft = function() {
                const kw = (document.getElementById('acsmLeftSearch')?.value || '').toLowerCase();
                document.getElementById('acsmLeftList')?.querySelectorAll('.acsm-list-item').forEach(item => {
                    item.style.display = item.textContent.toLowerCase().includes(kw) ? 'flex' : 'none';
                });
            };
            window.acsmSearchRight = function() {
                const kw = (document.getElementById('acsmRightSearch')?.value || '').toLowerCase();
                document.getElementById('acsmRightList')?.querySelectorAll('.acsm-list-item').forEach(item => {
                    item.style.display = item.textContent.toLowerCase().includes(kw) ? 'flex' : 'none';
                });
            };
            window.acsmRestoreDefault = function() {
                if (!confirm('确定要恢复默认设置吗？')) return;
                const rl = document.getElementById('acsmRightList');
                if (rl) rl.innerHTML = '';
                acsmUpdateRightCount();
                alert('已恢复默认设置');
            };
            window.acsmConfirmModal = function() {
                const rl = document.getElementById('acsmRightList');
                const items = rl ? rl.querySelectorAll('.acsm-list-item') : [];
                const fields = Array.from(items).map(i => i.textContent.trim());
                alert(fields.length ? '摘要规则已保存：\n' + fields.join(' + ') : '提示：未配置摘要规则，将使用系统默认摘要');
                window.acsmCloseSummaryModal();
            };
            const acsmLeftList = document.getElementById('acsmLeftList');
            if (acsmLeftList) {
                acsmLeftList.addEventListener('dblclick', function(e) {
                    const item = e.target.closest('.acsm-list-item');
                    if (item) { item.classList.add('selected'); const cb = item.querySelector('input'); if(cb) cb.checked=true; window.acsmMoveToRight(); }
                });
            }
            const acsmModal = document.getElementById('acsmSummaryModal');
            if (acsmModal) { acsmModal.addEventListener('click', function(e) { if (e.target === this) window.acsmCloseSummaryModal(); }); }
            window.saveClosingTemplateSettings = function() {
                alert("✅ 期末结转凭证模板设置已保存。");
            };
            if (typeof window.updateSubjectCodeInputs === "function") {
                window.updateSubjectCodeInputs(subjectSetting.levels, subjectSetting.lengths);
            }
        }, 0);

    contentArea.innerHTML = contentHTML;
    setTimeout(function() { if (typeof window.refreshTaxAccrualPreview === "function") { const panel = document.querySelector(".tax-accrual-panel"); if (panel && !panel.dataset.bound) { panel.dataset.bound = "1"; panel.addEventListener("change", () => window.refreshTaxAccrualPreview()); panel.addEventListener("input", () => window.refreshTaxAccrualPreview()); } window.refreshTaxAccrualPreview(); } }, 0);
};
