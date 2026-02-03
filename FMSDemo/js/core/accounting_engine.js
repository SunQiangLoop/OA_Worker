// js/core/accounting_engine.js

// js/core/accounting_engine.js

// 1. 定义全局分录模板

const GLOBAL_TEMPLATES = [
    // ---------------------------------------------------------
    // 场景 A：月结客户 (先对账确认收入)
    // ---------------------------------------------------------
    {
        id: 'TPL_MONTHLY_CONFIRM',
        name: '月结收入确认',
        voucherWord: '转',
        // 触发条件：对账单确认 (且不是预收冲抵)
        trigger: '对账单确认', 
        entries: [
            { dir: '借', subject: '1002 银行存款', valType: 'total' },
            { dir: '贷', subject: '1122 应收账款', valType: 'total' }
        ],
        status: '启用'
    },
    {
        id: 'TPL_MONTHLY_RECEIPT',
        name: '月结收款',
        voucherWord: '收',
        trigger: '收款核销',
        entries: [
            { dir: '借', subject: '1122 应收账款', valType: 'total' },
            { dir: '贷', subject: '6001 主营业务收入', valType: 'noTax' },
            { dir: '贷', subject: '2221 应交税费-应交增值税(销项)', valType: 'tax' }
        ],
        status: '启用'
    },

    // ---------------------------------------------------------
    // 场景 B：现付/预付客户 (先收款，后确认收入)
    // ---------------------------------------------------------
    {
        id: 'TPL_PREPAY_RECEIPT',
        name: '现付/预收款',
        voucherWord: '收',
        // 触发条件：预收款单确认
        trigger: '预收款确认', 
        entries: [
            { dir: '借', subject: '1002 银行存款', valType: 'total' },
            { dir: '贷', subject: '2203 预收账款', valType: 'total' }
        ],
        status: '启用'
    },
    {
        id: 'TPL_PREPAY_INVOICE',
        name: '现付开票/冲预收',
        voucherWord: '转',
        // 触发条件：现付开票
        trigger: '现付开票', 
        entries: [
            // ★★★ 纠正后的分录 ★★★
            { dir: '借', subject: '2203 预收账款', valType: 'total' }, // 冲减预收
            { dir: '贷', subject: '6001 主营业务收入', valType: 'noTax' },
            { dir: '贷', subject: '2221 应交税费-应交增值税(销项)', valType: 'tax' }
        ],
        status: '启用'
    }
];

const DEFAULT_AUTO_TEMPLATES = [
    {
        id: "TPL_REV_AIR",
        name: "陆运出口收入确认模板",
        voucherWord: "转",
        trigger: "结算确认",
        matchRule: { bizType: "陆运" },
        entries: [
            { dir: "借", subject: "1122 应收账款", amountType: "价税合计" },
            { dir: "贷", subject: "6001 主营业务收入", amountType: "价税合计" }
        ],
        status: "启用"
    },
    {
        id: "TPL_COST_TRUNK",
        name: "供应商运费应付模板",
        voucherWord: "记",
        trigger: "对账审批",
        matchRule: { bizType: "干线" },
        entries: [
            { dir: "借", subject: "6401 主营业务成本", amountType: "价税合计" },
            { dir: "贷", subject: "2202 应付账款", amountType: "价税合计" }
        ],
        status: "启用"
    }
];

function ensureAutoTemplates() {
    const templates = JSON.parse(sessionStorage.getItem("AutoVoucherTemplates") || "[]");
    const ids = new Set(templates.map(t => t.id));
    let changed = false;
    DEFAULT_AUTO_TEMPLATES.forEach(tpl => {
        if (!ids.has(tpl.id)) {
            templates.push(tpl);
            changed = true;
        }
    });
    if (changed) {
        sessionStorage.setItem("AutoVoucherTemplates", JSON.stringify(templates));
    }
    return templates;
}


// 2. 会计引擎执行函数
window.runAccountingEngine = function(triggerName, context) {
    console.log(`[会计引擎] 启动: ${triggerName}, 金额: ${context.amount}`);

    const tpl = GLOBAL_TEMPLATES.find(t => t.trigger === triggerName);
    if (!tpl) return null;

    // 计算金额 (9% 税率)
    const total = parseFloat(context.amount.toString().replace(/,/g, ''));
    const noTax = total / 1.09;
    const tax = total - noTax;

    const lines = tpl.entries.map(rule => {
        let val = 0;
        if (rule.valType === 'total') val = total;
        if (rule.valType === 'noTax') val = noTax;
        if (rule.valType === 'tax')   val = tax;

        return {
            summary: `${triggerName} - ${context.client}`,
            account: rule.subject,
            debit: rule.dir === '借' ? val.toFixed(2) : '',
            credit: rule.dir === '贷' ? val.toFixed(2) : ''
        };
    });

    const newVoucher = {
        id: tpl.voucherWord + new Date().getFullYear() + Math.floor(Math.random()*10000 + 1000),
        date: new Date().toISOString().split('T')[0],
        amount: (lines[0].debit || lines[0].credit), 
        user: '会计引擎(自动)',
        status: '已记账',
        lines: lines
    };

    let vList = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    vList.unshift(newVoucher);
    sessionStorage.setItem('ManualVouchers', JSON.stringify(vList));

    return newVoucher.id;
}

// ==========================================================
// 业务单据映射 -> 自动生成凭证 (与 EngineMapping 配合)
// ==========================================================

const ENGINE_CONDITION_FIELDS = {
    "业务线": "bizLine",
    "状态": "status",
    "客户": "client",
    "客户名称": "client",
    "单据类型": "type",
    "源单据类型": "type"
};

function normalizeValue(val) {
    if (val === null || val === undefined) return "";
    return val.toString().trim();
}

function parseAmount(value) {
    if (value === null || value === undefined) return 0;
    const num = parseFloat(value.toString().replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
}

function evaluateMappingCondition(condition, doc) {
    if (!condition) return true;
    const parts = condition.split(/且|并且|&&/);
    return parts.every(part => {
        const seg = part.trim();
        if (!seg) return true;
        const [left, right] = seg.split("=");
        if (!left || right === undefined) return false;
        const key = left.trim();
        const expected = normalizeValue(right);
        const docKey = ENGINE_CONDITION_FIELDS[key] || key;
        const actual = normalizeValue(doc[docKey]);
        return actual === expected;
    });
}

function resolveTemplateAmount(amountType, doc, totalAmount) {
    const type = normalizeValue(amountType);
    const docTotal = totalAmount || 0;
    if (type.includes("价税合计") || type.includes("总额") || type.includes("业务发生额") || type.includes("核销金额")) {
        return docTotal;
    }
    if (type.includes("不含税")) {
        if (doc.noTaxAmount) return parseAmount(doc.noTaxAmount);
        if (doc.taxRate) return docTotal / (1 + parseAmount(doc.taxRate));
        return docTotal;
    }
    if (type.includes("税额")) {
        if (doc.taxAmount) return parseAmount(doc.taxAmount);
        if (doc.taxRate) return docTotal - docTotal / (1 + parseAmount(doc.taxRate));
        return 0;
    }
    return docTotal;
}

function findEngineTemplate(templateId) {
    const templates = ensureAutoTemplates();
    const fromConfig = templates.find(t => t.id === templateId);
    if (fromConfig) return fromConfig;
    const fromGlobal = GLOBAL_TEMPLATES.find(t => t.id === templateId);
    return fromGlobal || null;
}

window.applyEngineMapping = function(doc) {
    const mappings = JSON.parse(sessionStorage.getItem("EngineMappings") || "[]");
    const enabledMappings = mappings.filter(m => m.status === "启用");
    if (enabledMappings.length === 0) {
        return { success: false, reason: "未启用任何映射规则" };
    }

    const matched = enabledMappings.find(m => {
        const typeOk = !m.type || normalizeValue(m.type) === normalizeValue(doc.type);
        const conditionOk = evaluateMappingCondition(m.condition, doc);
        return typeOk && conditionOk;
    });

    if (!matched) {
        return { success: false, reason: "未匹配到映射规则" };
    }

    const tpl = findEngineTemplate(matched.template);
    if (!tpl) {
        return { success: false, reason: `未找到模板：${matched.template}` };
    }

    const totalAmount = parseAmount(doc.amount);
    const summaryText = doc.summary || matched.name || doc.type || "自动生成凭证";

    const lines = (tpl.entries || []).map(rule => {
        const amountType = rule.valType || rule.amountType || "价税合计";
        const amountVal = resolveTemplateAmount(amountType, doc, totalAmount);
        return {
            summary: summaryText,
            account: rule.subject,
            debit: rule.dir === "借" ? amountVal.toFixed(2) : "",
            credit: rule.dir === "贷" ? amountVal.toFixed(2) : ""
        };
    });

    const voucherId = (tpl.voucherWord || "记") + new Date().getFullYear() + Math.floor(Math.random() * 10000 + 1000);
    const newVoucher = {
        id: voucherId,
        date: doc.date || new Date().toISOString().split("T")[0],
        amount: totalAmount.toFixed(2),
        summary: summaryText,
        user: "会计引擎(映射)",
        status: "待审核",
        lines: lines
    };

    const vList = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
    vList.unshift(newVoucher);
    sessionStorage.setItem("ManualVouchers", JSON.stringify(vList));

    return { success: true, voucherId: voucherId, mapping: matched, template: tpl, voucher: newVoucher };
};


        // ==========================================================
        // 会计科目管理 - 业务逻辑
        // ==========================================================

        /**
         * 1. 新增科目 (支持添加子级)
         */
        function getSubjectsList() {
            return JSON.parse(sessionStorage.getItem('AcctSubjects') || "[]");
        }

        function getSubjectCodeSettingLocal() {
            const raw = localStorage.getItem("SubjectCodeSetting") || sessionStorage.getItem("SubjectCodeSetting");
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

        function getLevelByCode(code, setting) {
            let total = 0;
            for (let i = 0; i < setting.levels; i++) {
                total += setting.lengths[i] || 0;
                if (code.length === total) return i + 1;
            }
            return -1;
        }

        function getChildLength(parentLevel, setting) {
            return setting.lengths[parentLevel] || 0;
        }

        function getParentCodeBySetting(code, setting) {
            const level = getLevelByCode(code, setting);
            if (level <= 1) return "";
            let parentLen = 0;
            for (let i = 0; i < level - 1; i++) {
                parentLen += setting.lengths[i] || 0;
            }
            return code.slice(0, parentLen);
        }

        function generateNextSubjectCode(parentCode, list, setting) {
            const prefix = parentCode || "";
            let segmentLen = 0;
            if (parentCode) {
                const parentLevel = getLevelByCode(parentCode, setting);
                if (parentLevel < 1) {
                    alert("上级科目编码长度与设置不匹配。");
                    return "";
                }
                segmentLen = getChildLength(parentLevel, setting);
                if (!segmentLen) {
                    alert("已达最大级次，无法继续新增下级。");
                    return "";
                }
            } else {
                segmentLen = setting.lengths[0] || 0;
            }

            const targetLen = prefix.length + segmentLen;
            let maxSuffix = 0;
            list.forEach(item => {
                if (item.code && item.code.startsWith(prefix) && item.code.length === targetLen) {
                    const suffix = item.code.slice(prefix.length);
                    if (/^\d+$/.test(suffix)) {
                        maxSuffix = Math.max(maxSuffix, parseInt(suffix, 10));
                    }
                }
            });

            const next = maxSuffix + 1;
            const maxAllowed = Math.pow(10, segmentLen) - 1;
            if (next > maxAllowed) {
                alert("当前级次编码已满，请调整编码长度或清理科目。");
                return "";
            }
            return prefix + String(next).padStart(segmentLen, "0");
        }

        function validateSubjectCode(code, parentCode, list, setting) {
            if (!/^\d+$/.test(code)) {
                alert("科目编码只能包含数字。");
                return false;
            }
            if (list.some(item => item.code === code)) {
                alert("科目编码已存在，请更换。");
                return false;
            }

            if (parentCode) {
                const parentLevel = getLevelByCode(parentCode, setting);
                if (parentLevel < 1) {
                    alert("上级科目编码长度与设置不匹配。");
                    return false;
                }
                const childLen = getChildLength(parentLevel, setting);
                if (!childLen) {
                    alert("已达最大级次，无法新增。");
                    return false;
                }
                if (!code.startsWith(parentCode) || code.length !== parentCode.length + childLen) {
                    alert("科目编码必须以父级编码开头，并符合级次长度设置。");
                    return false;
                }
            } else {
                const rootLen = setting.lengths[0] || 0;
                if (code.length !== rootLen) {
                    alert("一级科目编码长度不符合设置。");
                    return false;
                }
            }
            return true;
        }

        function persistSubjectsList(list) {
            sessionStorage.setItem('AcctSubjects', JSON.stringify(list));
            localStorage.setItem('AcctSubjects', JSON.stringify(list));
        }

        function rememberSubjectTreeFilter() {
            sessionStorage.setItem("SubjectTreeFilter", JSON.stringify({
                prefix: window._subjectTreeFilterPrefix || "",
                type: window._subjectTreeFilterType || ""
            }));
        }

        window.addSubject = function (parentOverride = "") {
            const parentCode = parentOverride || "";
            openSubjectCreateForm(parentCode);
        }

        window.addSubjectSameLevel = function () {
            const selected = window.getSelectedSubjectCodes();
            if (selected.length !== 1) {
                alert("请选择一条科目进行同级新增。");
                return;
            }
            const code = selected[0];
            const setting = getSubjectCodeSettingLocal();
            const parentCode = getParentCodeBySetting(code, setting);
            openSubjectCreateForm(parentCode);
        }

        window.addSubjectChild = function (code = "") {
            const selected = code ? [code] : window.getSelectedSubjectCodes();
            if (selected.length !== 1) {
                alert("请选择一条科目进行下级新增。");
                return;
            }
            openSubjectCreateForm(selected[0]);
        }

        /**
         * 2. 编辑科目
         */
        window.editSubject = function (code) {
            openSubjectForm(code);
        }

        window.editSelectedSubject = function () {
            const selected = window.getSelectedSubjectCodes();
            if (selected.length !== 1) {
                alert("请选择一条科目进行修改。");
                return;
            }
            window.editSubject(selected[0]);
        }

        function parseAuxList(value) {
            if (!value || value === "无") return [];
            return value.split(/[,，、]/).map(item => item.trim()).filter(Boolean);
        }

        window.openSubjectForm = function (code) {
            const list = getSubjectsList();
            const subject = list.find(item => item.code === code);
            if (!subject) return;
            const panel = document.getElementById("subject-form-panel");
            const modal = document.getElementById("subject-form-modal");
            if (!panel || !modal) return;

            panel.dataset.code = code;
            panel.dataset.mode = "edit";
            panel.dataset.parent = "";
            const header = panel.querySelector(".subject-form-header");
            if (header) header.textContent = "修改";
            const codeInput = document.getElementById("subject-form-code");
            const nameInput = document.getElementById("subject-form-name");
            const typeSelect = document.getElementById("subject-form-type");
            const remarkInput = document.getElementById("subject-form-remark");

            if (codeInput) {
                codeInput.value = subject.code || "";
                codeInput.disabled = true;
            }
            if (nameInput) nameInput.value = subject.name || "";
            if (typeSelect) typeSelect.value = subject.type || "资产";
            if (remarkInput) remarkInput.value = subject.remark || "";

            const dirRadios = document.querySelectorAll('input[name="subject-form-direction"]');
            dirRadios.forEach(radio => {
                radio.checked = radio.value === (subject.direction || "借");
            });

            const controlRadios = document.querySelectorAll('input[name="subject-form-control"]');
            controlRadios.forEach(radio => {
                radio.checked = radio.value === (subject.controlDirection || "否");
            });

            const auxList = parseAuxList(subject.aux);
            document.querySelectorAll('input[name="subject-form-aux"]').forEach(cb => {
                cb.checked = auxList.includes(cb.value);
            });

            modal.classList.add("is-visible");
        }

        window.openSubjectCreateForm = function (parentCode = "") {
            const panel = document.getElementById("subject-form-panel");
            const modal = document.getElementById("subject-form-modal");
            if (!panel || !modal) return;
            const list = getSubjectsList();
            const setting = getSubjectCodeSettingLocal();
            const header = panel.querySelector(".subject-form-header");
            if (header) header.textContent = "新增";

            panel.dataset.code = "";
            panel.dataset.mode = "create";
            panel.dataset.parent = parentCode || "";

            let defaultType = "资产";
            let defaultDirection = "借";
            if (parentCode) {
                const parent = list.find(item => item.code === parentCode);
                if (parent) {
                    defaultType = parent.type || defaultType;
                    defaultDirection = parent.direction || defaultDirection;
                }
            }

            const codeInput = document.getElementById("subject-form-code");
            const nameInput = document.getElementById("subject-form-name");
            const typeSelect = document.getElementById("subject-form-type");
            const remarkInput = document.getElementById("subject-form-remark");

            const suggestedCode = generateNextSubjectCode(parentCode, list, setting);
            if (codeInput) {
                codeInput.disabled = false;
                codeInput.value = suggestedCode || "";
            }
            if (nameInput) nameInput.value = "";
            if (typeSelect) typeSelect.value = defaultType;
            if (remarkInput) remarkInput.value = "";

            document.querySelectorAll('input[name="subject-form-direction"]').forEach(radio => {
                radio.checked = radio.value === defaultDirection;
            });

            document.querySelectorAll('input[name="subject-form-control"]').forEach(radio => {
                radio.checked = radio.value === "否";
            });

            document.querySelectorAll('input[name="subject-form-aux"]').forEach(cb => {
                cb.checked = false;
            });

            modal.classList.add("is-visible");
        }

        window.closeSubjectForm = function () {
            const panel = document.getElementById("subject-form-panel");
            const modal = document.getElementById("subject-form-modal");
            if (panel) panel.dataset.code = "";
            if (modal) modal.classList.remove("is-visible");
        }

        window.saveSubjectForm = function () {
            const panel = document.getElementById("subject-form-panel");
            if (!panel) return;
            const mode = panel.dataset.mode || "edit";
            const parentCode = panel.dataset.parent || "";
            let list = getSubjectsList();

            const codeInput = document.getElementById("subject-form-code");
            const nameInput = document.getElementById("subject-form-name");
            const typeSelect = document.getElementById("subject-form-type");
            const remarkInput = document.getElementById("subject-form-remark");

            const dirRadio = document.querySelector('input[name="subject-form-direction"]:checked');
            const controlRadio = document.querySelector('input[name="subject-form-control"]:checked');

            const auxValues = Array.from(document.querySelectorAll('input[name="subject-form-aux"]:checked'))
                .map(cb => cb.value);
            const auxValue = auxValues.length ? auxValues.join(",") : "无";
            const code = codeInput ? codeInput.value.trim() : panel.dataset.code;

            if (mode === "create") {
                const setting = getSubjectCodeSettingLocal();
                if (!code) {
                    alert("请填写科目编码。");
                    return;
                }
                if (!validateSubjectCode(code, parentCode, list, setting)) return;
                const name = nameInput ? nameInput.value.trim() : "";
                if (!name) {
                    alert("请填写科目名称。");
                    return;
                }

                const newSubject = {
                    code: code,
                    name: name,
                    type: typeSelect ? typeSelect.value : "资产",
                    aux: auxValue,
                    direction: dirRadio ? dirRadio.value : "借",
                    controlDirection: controlRadio ? controlRadio.value : "否",
                    status: "启用",
                    remark: remarkInput ? remarkInput.value.trim() : ""
                };
                list.push(newSubject);
                persistSubjectsList(list);

                if (typeof addDataChangeLog === 'function') {
                    addDataChangeLog({
                        time: new Date().toLocaleString(),
                        user: '当前用户',
                        object: '会计科目',
                        objId: code,
                        field: '新增',
                        oldVal: '-',
                        newVal: name
                    });
                }
            } else {
                if (!panel.dataset.code) {
                    alert("请先选择要修改的科目。");
                    return;
                }
                const subject = list.find(item => item.code === panel.dataset.code);
                if (!subject) return;

                subject.name = nameInput ? nameInput.value.trim() : subject.name;
                subject.type = typeSelect ? typeSelect.value : subject.type;
                subject.remark = remarkInput ? remarkInput.value.trim() : subject.remark;
                subject.direction = dirRadio ? dirRadio.value : subject.direction;
                subject.controlDirection = controlRadio ? controlRadio.value : subject.controlDirection || "否";
                subject.aux = auxValue;

                persistSubjectsList(list);

                if (typeof addDataChangeLog === 'function') {
                    addDataChangeLog({
                        time: new Date().toLocaleString(),
                        user: '当前用户',
                        object: '会计科目',
                        objId: subject.code,
                        field: '属性修改',
                        oldVal: '...',
                        newVal: `${subject.name} / ${subject.direction}`
                    });
                }
            }

            rememberSubjectTreeFilter();
            loadContent('AcctSubject');
            window.closeSubjectForm();
        }

        /**
         * 3. 启用/停用切换
         */
        window.toggleSubjectStatus = function (code) {
            let list = getSubjectsList();
            const subject = list.find(s => s.code === code);
            if (!subject) return;

            if (!confirm(`确认${subject.status === '启用' ? '停用' : '启用'}科目【${subject.name}】吗？`)) return;

            subject.status = subject.status === '启用' ? '停用' : '启用';
            persistSubjectsList(list);
            rememberSubjectTreeFilter();
            loadContent('AcctSubject');
        }

        window.setSubjectStatusBulk = function (status) {
            const selected = window.getSelectedSubjectCodes();
            if (selected.length === 0) {
                alert("请先勾选科目。");
                return;
            }
            let list = getSubjectsList();
            list.forEach(item => {
                if (selected.includes(item.code)) {
                    item.status = status;
                }
            });
            persistSubjectsList(list);
            rememberSubjectTreeFilter();
            loadContent('AcctSubject');
        }

        window.deleteSubject = function (code) {
            if (!confirm("确认删除该科目吗？")) return;
            let list = getSubjectsList();
            const next = list.filter(item => item.code !== code);
            persistSubjectsList(next);
            rememberSubjectTreeFilter();
            loadContent('AcctSubject');
        }

        window.deleteSelectedSubjects = function () {
            const selected = window.getSelectedSubjectCodes();
            if (selected.length === 0) {
                alert("请先勾选科目。");
                return;
            }
            if (!confirm("确认删除选中的科目吗？")) return;
            let list = getSubjectsList();
            const next = list.filter(item => !selected.includes(item.code));
            persistSubjectsList(next);
            rememberSubjectTreeFilter();
            loadContent('AcctSubject');
        }

        window.toggleAllSubjects = function (checked) {
            document.querySelectorAll('.subject-select').forEach(cb => {
                cb.checked = checked;
            });
        }

        window.getSelectedSubjectCodes = function () {
            return Array.from(document.querySelectorAll('.subject-select:checked'))
                .map(cb => cb.dataset.code);
        }

        window.triggerImportSubjects = function () {
            const input = document.getElementById('subject-import-input');
            if (input) input.click();
        }

        window.importSubjectsFromCSV = function (input) {
            const file = input.files && input.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function () {
                const text = reader.result;
                const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
                if (lines.length === 0) return;
                let startIndex = 0;
                const header = lines[0].toLowerCase();
                if (header.includes("code") || header.includes("科目编码")) {
                    startIndex = 1;
                }
                const list = getSubjectsList();
                for (let i = startIndex; i < lines.length; i++) {
                    const parts = lines[i].split(",");
                    if (parts.length < 2) continue;
                    const [code, name, type, aux, direction, status, controlDirection, remark] = parts.map(p => p.trim());
                    if (!code || !name) continue;
                    const exists = list.find(item => item.code === code);
                    const subject = {
                        code: code,
                        name: name,
                        type: type || "资产",
                        aux: aux || "无",
                        direction: direction || "借",
                        status: status || "启用",
                        controlDirection: controlDirection || "否",
                        remark: remark || ""
                    };
                    if (exists) {
                        Object.assign(exists, subject);
                    } else {
                        list.push(subject);
                    }
                }
                persistSubjectsList(list);
                input.value = "";
                alert("✅ 科目表已导入。");
                loadContent('AcctSubject');
            };
            reader.readAsText(file);
        }

        window.exportSubjectsToCSV = function () {
            const list = getSubjectsList();
            const header = ["科目编码", "科目名称", "科目类型", "辅助核算", "余额方向", "状态", "控制发生方向", "备注"];
            const rows = list.map(item => [
                item.code,
                item.name,
                item.type,
                item.aux || "",
                item.direction,
                item.status,
                item.controlDirection || "否",
                item.remark || ""
            ]);
            const csv = [header, ...rows].map(row => row.join(",")).join("\n");
            const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "account_subjects.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        window.searchSubjects = function (event) {
            if (event && event.key && event.key !== "Enter") return;
            if (typeof window.renderSubjectTablePage === "function") {
                window.renderSubjectTablePage(1);
                return;
            }
            const input = document.getElementById("subject-search-input");
            const query = input ? input.value.trim().toLowerCase() : "";
            const treePrefix = window._subjectTreeFilterPrefix || "";
            const treeType = window._subjectTreeFilterType || "";
            const rows = document.querySelectorAll(".subject-table tbody tr");
            rows.forEach(row => {
                const code = (row.dataset.code || "").toLowerCase();
                const name = (row.dataset.name || "").toLowerCase();
                const matched = !query || code.includes(query) || name.includes(query);
                const prefixMatched = !treePrefix || (row.dataset.code || "").startsWith(treePrefix);
                const typeMatched = !treeType || (row.dataset.type || "") === treeType;
                row.style.display = matched && prefixMatched && typeMatched ? "" : "none";
            });
        }

        window.updateSubjectDirectionControl = function (code, value) {
            let list = getSubjectsList();
            const subject = list.find(item => item.code === code);
            if (!subject) return;
            subject.controlDirection = value === "是" ? "是" : "否";
            persistSubjectsList(list);
        }


                // ==========================================================
        // 1. 新增客户 (修复版：补全字段 + 保存到 Session)
        // ==========================================================
        window.addCustomer = function () {
            // 1. 收集信息 (补全了纳税号和账期)
            const name = prompt("请输入客户名称：", "新客户公司");
            if (!name) return;

            const taxId = prompt("请输入纳税人识别号：", "91310000..."); // 新增
            const type = prompt("请输入结算方式 (月结/现结)：", "月结");
            const limit = prompt("请输入信用额度 (RMB)：", "50000.00");
            const days = prompt("请输入账期 (天)：", "30"); // 新增

            // 2. 构造数据对象
            const newId = "CUST-" + Math.floor(Math.random() * 9000 + 1000);
            const newCustomerObj = {
                id: newId,
                name: name,
                taxId: taxId || "-", // 如果没填显示 -
                type: type,
                limit: parseFloat(limit).toFixed(2),
                days: days || "0",
                status: "正常"
            };

            // 3. ★★★ 保存到 Session (持久化) ★★★
            // 读取已有列表 -> 追加新项 -> 存回去
            let addedList = JSON.parse(sessionStorage.getItem('AddedCustomers') || "[]");
            addedList.unshift(newCustomerObj); // 加到最前面
            sessionStorage.setItem('AddedCustomers', JSON.stringify(addedList));

            // 4. 记录审计日志 (保持不变)
            if (typeof addDataChangeLog === 'function') {
                addDataChangeLog({
                    time: new Date().toLocaleString(),
                    user: '当前用户',
                    object: '客户档案',
                    objId: newId,
                    field: '新建记录',
                    oldVal: '-',
                    newVal: `名称:${name}, 税号:${taxId}, 账期:${days}天`
                });
            }

            alert(`✅ 客户【${name}】创建成功！\n已保存到系统。`);

            // 5. 刷新当前页面 (让 loadContent 重新读取数据并渲染)
            loadContent('BaseCustomer');
        }

                // ==========================================================
        // 3. 修改客户资料 (修复版：支持修改 结算方式/额度/账期)
        // ==========================================================
        window.editCustomerInfo = function (btn, id) {
            const row = btn.closest('tr');
            const name = row.querySelector('.val-name').innerText;

            // 1. 获取当前界面上的旧值 (根据列的索引位置)
            // 第4列(index 3): 结算方式 (里面包了span)
            const typeCell = row.cells[3];
            const oldType = typeCell.innerText.trim();

            // 第5列(index 4): 信用额度 (里面包了strong)
            const limitCell = row.cells[4];
            const oldLimit = limitCell.innerText.replace(/,/g, '').trim();

            // 第6列(index 5): 账期
            const daysCell = row.cells[5];
            const oldDays = daysCell.innerText.trim();

            // 2. 依次弹出输入框 (用户点击取消则保留原值)
            const newType = prompt(`正在修改【${name}】\n\n1/3 请输入结算方式 (月结/现结)：`, oldType);
            if (newType === null) return; // 如果点击取消，则终止后续操作

            const newLimit = prompt(`正在修改【${name}】\n\n2/3 请输入信用额度 (RMB)：`, oldLimit);
            if (newLimit === null) return;

            const newDays = prompt(`正在修改【${name}】\n\n3/3 请输入账期 (天数)：`, oldDays);
            if (newDays === null) return;

            // 3. 变更检测与更新 (哪个变了改哪个，并记日志)
            let hasChange = false;

            // --- A. 处理结算方式变更 ---
            if (newType && newType !== oldType) {
                const badgeStyle = newType === '现结'
                    ? 'background:#f6ffed; color:#52c41a;'
                    : 'background:#e6f7ff; color:#1890ff;';

                typeCell.innerHTML = `<span style="${badgeStyle} padding:2px 6px; border-radius:4px; font-size:12px;">${newType}</span>`;

                // 写入日志
                _recordChange(id, '结算方式', oldType, newType);
                hasChange = true;
            }

            // --- B. 处理信用额度变更 ---
            if (newLimit && parseFloat(newLimit) !== parseFloat(oldLimit)) {
                limitCell.innerHTML = `<strong style="color:#e74c3c">${parseFloat(newLimit).toFixed(2)}</strong>`;

                // 写入日志
                _recordChange(id, '信用额度', parseFloat(oldLimit).toFixed(2), parseFloat(newLimit).toFixed(2));
                hasChange = true;
            }

            // --- C. 处理账期变更 ---
            if (newDays && newDays !== oldDays) {
                daysCell.innerText = newDays;
                daysCell.style.color = "#e74c3c"; // 变红提示
                daysCell.style.fontWeight = "bold";

                // 写入日志
                _recordChange(id, '账期(天)', oldDays, newDays);
                hasChange = true;
            }

            // 4. 完成提示
            if (hasChange) {
                alert(`✅ 客户【${name}】资料修改成功！\n变更项已逐条记录到审计模块。`);
            } else {
                alert("⚠️ 未检测到数据变更。");
            }
        }


                /**
         * 2. 冻结/解冻客户 (Freeze/Unfreeze)
         */
        window.toggleFreeze = function (btn, id, name) {
            const row = btn.closest('tr');
            const statusCell = row.cells[6]; // 状态列
            const isFrozen = btn.innerText === '申请解冻';

            const action = isFrozen ? "解冻" : "冻结";
            const confirmMsg = isFrozen
                ? `⚠️ 确认要申请解冻客户【${name}】吗？\n需要风控审批。`
                : `⚠️ 警告：确认要冻结客户【${name}】吗？\n冻结后该客户将无法下单和开票。`;

            if (!confirm(confirmMsg)) return;

            // 1. 更新界面状态
            if (isFrozen) {
                // 执行解冻
                statusCell.innerHTML = '<span style="color: #27ae60;">正常</span>';
                btn.innerText = "冻结";
                btn.style.color = "#e74c3c";
                row.style.backgroundColor = "#fff";
                alert(`✅ 申请已提交！\n\n客户【${name}】状态已恢复正常。`);
            } else {
                // 执行冻结
                statusCell.innerHTML = '<span style="color: #e74c3c; font-weight:bold;">已冻结</span>';
                btn.innerText = "申请解冻";
                btn.style.color = "#3498db";
                row.style.backgroundColor = "#fff1f0"; // 变红背景
                alert(`⛔ 客户【${name}】已冻结！\n业务权限已暂停。`);
            }

            // 2. ★★★ 记录[数据变更明细] (状态变更) ★★★
            if (typeof addDataChangeLog === 'function') {
                addDataChangeLog({
                    time: new Date().toLocaleString(),
                    user: '当前用户',
                    object: '客户档案',
                    objId: id,
                    field: '客户状态',
                    oldVal: isFrozen ? '已冻结' : '正常',
                    newVal: isFrozen ? '正常' : '已冻结'
                });
            }
        }
