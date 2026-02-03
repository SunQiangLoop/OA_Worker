/**
 * 会计引擎配置数据源
 * 根据你提供的列表整理成的树形结构
 */
const ENGINE_DATA = [
    {
        name: "结算",
        children: [
            {
                name: "运单",
                items: ["现付结算", "现返结算", "网点中转现返结算", "单票提货费已付结算", "单票提货费未付结算", "欠付结算", "欠返结算", "网点中转欠返结算", "月结结算", "回付结算", "货到打卡结算", "货款扣结算", "税费结算", "货款手续费结算", "中转费结算", "回扣结算", "开单进仓费结算", "到站进仓费结算", "员工中转费结算", "总部代收货款结算", "出发网点代收货款结算", "目的网点代收货款结算", "途径网点代收货款挂帐", "出发网点到付结算", "途径网点到付结算", "目的网点到付结算", "总部货款扣结算", "总部货款手续费结算", "单票送货费结算", "单票送货上楼费结算", "单票送货装卸费结算", "单票送货进仓费结算", "出发网点垫付费已付结算", "出发网点垫付费未付结算", "目的网点垫付费结算", "途径网点垫付费挂帐", "总部代收运费结算", "出发网点代收运费结算", "目的网点代收运费结算", "途径网点代收运费挂帐", "总部垫付费结算", "网点中转费合计结算", "发站单票装车费结算", "发站单票其他费结算", "到站单票卸车费结算", "到站单票其他费结算", "发站落地中转费结算", "到站落地中转费结算", "发站落地中转费异动结算", "到站落地中转费异动结算", "发站落地送货费结算", "到站落地送货费结算", "发站落地送货异动费结算", "到站落地送货费异动结算", "发站平台服务费结算", "到站平台服务费结算", "平台增值费结算"]
            },
            {
                name: "异动",
                items: ["现返异动增款结算", "欠返异动增款结算", "回扣异动增款结算", "现付异动增款结算", "出发网点到付异动增款结算", "途径网点到付异动增款结算", "目的网点到付异动增款结算", "欠付异动增款结算", "月结异动增款结算", "回付异动增款结算", "货款扣异动增款结算", "货到打卡异动增款结算", "现返异动减款结算", "欠返异动减款结算", "回扣异动减款结算", "现付异动减款结算", "出发网点到付异动减款结算", "途径网点到付异动减款结算", "目的网点到付异动减款结算", "欠付异动减款结算", "月结异动减款结算", "回付异动减款结算", "货款扣异动减款结算", "货到打卡异动减款结算", "总部代收货款异动结算", "出发网点代收货款异动结算", "目的网点代收货款异动结算", "途径网点代收货款异动挂帐", "总部垫付费异动结算", "出发网点垫付费异动结算", "目的网点垫付费异动结算", "途径网点垫付费异动挂帐", "货款手续费异动结算", "总部货款手续费异动结算"]
            },
            {
                name: "干线",
                items: ["现付运输费结算", "到付运输费结算", "回付运输费结算", "现付油卡费结算", "整车保险费结算", "发站装车费结算", "发站其它费结算", "到站卸车费结算", "到站其它费结算", "整车信息费结算", "发站落地费结算", "到站落地费结算", "发站落货费结算", "到站落货费结算", "挂车使用费结算"]
            },
            {
                name: "应付结算",
                items: ["应付到付结算", "应付现付结算", "应付油卡结算", "应付回付结算", "应付保险费结算"]
            },
            {
                name: "应收结算",
                items: ["应收到付结算", "应收现付结算", "应收油卡结算", "应收回付结算", "应收其他结算", "应收信息费结算"]
            }
            // ... (篇幅原因省略部分，你需要将所有分类按此结构填入) ...
        ]
    },
    {
        name: "核销",
        children: [
            {
                name: "运单",
                items: ["现付核销", "现返核销", "单票提货费已付核销", "单票提货费未付核销", "欠付核销", "欠返核销", "到付核销", "月结核销", "回付核销", "货到打卡核销", "货款扣核销", "代收货款回收", "代收货款汇款", "代收货款到账", "代收货款发放", "到付汇款", "到付到账", "到付异动汇款", "到付异动到账", "税费核销", "配安费核销", "货款手续费核销", "中转费核销", "回扣核销", "到站进仓费核销", "垫付费回收", "垫付费汇款", "垫付费到账", "垫付费已付发放", "垫付费未付发放", "代收运费回收", "代收运费汇款", "代收运费到账", "代收运费发放"]
            }
            // ... 其他核销类目 ...
        ]
    },
    {
        name: "账户结算",
        children: [
            {
                 name: "账户收款（网点间交易）",
                 items: ["到付出发网点收款", "到付途径网点收款", "货款出发网点收款", "货款途径网点收款", "货款总部收款", "成本中转费收款"] 
            },
            {
                 name: "账户扣款（网点间交易）",
                 items: ["到付目的网点付款", "到付途径网点付款", "货款目的网点付款", "货款途径网点付款", "货款总部付款", "成本中转费付款"]
            }
        ]
    }
    // ... 账户管理、在线账户管理等 ...
];

const ENGINE_TEMPLATE_STORAGE_KEY = "EngineVoucherTemplates";
const DEFAULT_PAYMENT_METHOD_SUBJECTS = [
    { id: "pm_wx", name: "微信", subjectCode: "1012.01", subjectName: "其他货币资金-微信" },
    { id: "pm_cash", name: "现金", subjectCode: "1001", subjectName: "库存现金" },
    { id: "pm_bank", name: "银行卡", subjectCode: "1002.01", subjectName: "银行存款-基本户" }
];

function loadEngineTemplateStore() {
    return JSON.parse(sessionStorage.getItem(ENGINE_TEMPLATE_STORAGE_KEY) || "{}");
}

function saveEngineTemplateStore(store) {
    sessionStorage.setItem(ENGINE_TEMPLATE_STORAGE_KEY, JSON.stringify(store));
}

function findEngineCategory(itemName) {
    for (const category of ENGINE_DATA) {
        if (!category.children) continue;
        for (const child of category.children) {
            if (!child.items) continue;
            if (child.items.includes(itemName)) {
                return { category: category.name, group: child.name };
            }
        }
    }
    return { category: "未分类", group: "-" };
}

function buildEmptyTemplate(itemName, categoryInfo) {
    return {
        name: itemName,
        category: categoryInfo.category,
        group: categoryInfo.group,
        voucherWord: "转",
        summaryTemplate: "",
        remark: "",
        entries: [
            { dir: "借", subjectCode: "", subjectName: "", summary: "", usePaymentMethod: false },
            { dir: "贷", subjectCode: "", subjectName: "", summary: "", usePaymentMethod: false }
        ]
    };
}

function getEngineTemplate(itemName, categoryInfo) {
    const store = loadEngineTemplateStore();
    if (!store[itemName]) {
        store[itemName] = buildEmptyTemplate(itemName, categoryInfo);
        saveEngineTemplateStore(store);
    }
    return store[itemName];
}

function setEngineTemplate(itemName, template) {
    const store = loadEngineTemplateStore();
    store[itemName] = template;
    saveEngineTemplateStore(store);
}

function resolvePaymentMethodSubject(pmId) {
    if (!pmId) return null;
    const list = JSON.parse(sessionStorage.getItem("ConfigPaymentMethods") || "[]");
    const match = list.find(m => m.id === pmId && m.subjectCode && m.subjectName);
    if (match) {
        return { subjectCode: match.subjectCode, subjectName: match.subjectName };
    }
    return DEFAULT_PAYMENT_METHOD_SUBJECTS.find(m => m.id === pmId) || null;
}

function renderTemplatePlaceholder(templateText, doc) {
    if (!templateText) return "";
    return templateText.replace(/\{(\w+)\}/g, (_, key) => {
        const val = doc && doc[key];
        return val === undefined || val === null ? "" : val;
    });
}

function parseAmountValue(value) {
    if (value === null || value === undefined) return 0;
    const num = parseFloat(value.toString().replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
}

window.generateVoucherFromEngineTemplate = function(itemName, doc, options) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    if (!template || !template.entries || template.entries.length === 0) {
        return { success: false, error: "未配置任何分录" };
    }

    const voucherWord = template.voucherWord || "转";
    const amountTotal = parseAmountValue(doc.amount || doc.totalAmount);
    const lines = [];

    for (const entry of template.entries) {
        const entryAmount = amountTotal;
        let subjectCode = entry.subjectCode;
        let subjectName = entry.subjectName;
        if (entry.usePaymentMethod) {
            const pm = resolvePaymentMethodSubject(options && options.paymentMethodId);
            if (!pm) {
                return { success: false, error: "未找到收支方式科目" };
            }
            subjectCode = pm.subjectCode;
            subjectName = pm.subjectName;
        }

        if (!subjectCode || !subjectName) {
            return { success: false, error: "科目未填写完整" };
        }

        const digest = renderTemplatePlaceholder(entry.summary || template.summaryTemplate || itemName, doc);
        lines.push({
            summary: digest,
            account: `${subjectCode} ${subjectName}`.trim(),
            debit: entry.dir === "借" ? entryAmount.toFixed(2) : "",
            credit: entry.dir === "贷" ? entryAmount.toFixed(2) : ""
        });
    }

    const voucherId = typeof window.generateSequentialVoucherId === "function"
        ? window.generateSequentialVoucherId(voucherWord)
        : `${voucherWord}-${String(Math.floor(Math.random() * 9999 + 1)).padStart(4, "0")}`;
    const voucher = {
        id: voucherId,
        date: doc.date || new Date().toISOString().split("T")[0],
        amount: amountTotal.toFixed(2),
        summary: renderTemplatePlaceholder(template.summaryTemplate || itemName, doc),
        user: "会计引擎(模板)",
        status: "待审核",
        sourceType: doc.type || "",
        sourceId: doc.waybillNo || doc.bill_no || doc.id || "",
        clientName: doc.clientName || doc.client || "",
        lines: lines
    };

    const vList = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
    vList.unshift(voucher);
    sessionStorage.setItem("ManualVouchers", JSON.stringify(vList));

    return { success: true, voucherId, voucher };
};

/**
 * 渲染左侧树形菜单 HTML
 */
function renderEngineTree() {
    let html = '';
    ENGINE_DATA.forEach((category, index) => {
        const categoryId = `engine-cat-${index}`;
        // Level 1: 结算, 结算...
        html += `
            <div class="tree-node level-1" onclick="window.toggleEngineCategory('${categoryId}')">
                <span>${category.name}</span>
                <span class="engine-toggle-icon" data-target="${categoryId}">▾</span>
            </div>
        `;
        
        if (category.children) {
            html += `<div id="${categoryId}" class="engine-category">`;
            category.children.forEach(sub => {
                // Level 2: 运单, 异动...
                html += `<div class="tree-node level-2">${sub.name}</div>`;
                
                if (sub.items) {
                    sub.items.forEach(item => {
                        // Level 3: 具体费用 (点击触发右侧加载)
                        html += `<div class="tree-node level-3" onclick="loadEngineConfig('${item}')">
                                    <i class="icon-file-text"></i> ${item}
                                 </div>`;
                    });
                }
            });
            html += `</div>`;
        }
    });
    return html;
}

/**
 * 核心：点击左侧菜单，加载右侧配置界面 (智能双模式版)
 * @param {string} itemName 费用名称
 */
window.loadEngineConfig = function(itemName) {
    // 1. 高亮左侧菜单
    if (event && event.target) {
        document.querySelectorAll('.tree-node').forEach(el => el.classList.remove('active'));
        event.target.classList.add('active');
    }

    const categoryInfo = findEngineCategory(itemName);
    const isWriteOff = categoryInfo.category === "核销" || itemName.includes("核销");
    const template = getEngineTemplate(itemName, categoryInfo);
    const subjectOptions = window.getEngineSubjectOptions();

    const entryRowsHtml = (template.entries || []).map((entry, index) => `
        <tr data-row-index="${index}">
            <td>
                <select class="engine-dir" style="width:100%; padding:6px;">
                    <option value="借" ${entry.dir === "借" ? "selected" : ""}>借</option>
                    <option value="贷" ${entry.dir === "贷" ? "selected" : ""}>贷</option>
                </select>
            </td>
            <td>
                <select class="engine-subject" style="width:100%; padding:6px;" ${entry.usePaymentMethod ? "disabled" : ""}>
                    <option value="" ${entry.subjectCode ? "" : "selected"}>请选择科目</option>
                    ${subjectOptions.map(subject => {
                        const value = `${subject.code}|||${subject.name}`;
                        const selected = subject.code === entry.subjectCode ? "selected" : "";
                        return `<option value="${value}" ${selected}>${subject.code} ${subject.name}</option>`;
                    }).join("")}
                </select>
            </td>
            <td><input class="engine-summary" type="text" value="${entry.summary || ""}" placeholder="摘要模板"></td>
            ${isWriteOff ? `<td style="text-align:center;"><input class="engine-pm" type="checkbox" ${entry.usePaymentMethod ? "checked" : ""} onchange="window.togglePaymentMethodSubject(this)"></td>` : ""}
            <td style="text-align:center;">
                <button class="btn-remove" onclick="window.removeEngineEntry('${itemName}', ${index})">删除</button>
            </td>
        </tr>
    `).join("");

    const topTipHTML = isWriteOff
        ? `<div style="color:#c0392b; font-size:12px; line-height:1.6;">
             * 核销类凭证可选择从收支方式读取科目，结算类不允许。
           </div>`
        : `<div style="color:#2c3e50; font-size:12px; line-height:1.6;">
             * 请手动配置分录科目，系统将按模板生成凭证。
           </div>`;

    const rightHTML = `
        <div style="font-family: 'Segoe UI', sans-serif; color:#2c3e50;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div>
                    <h2 style="margin:0; font-size:20px;">${itemName}</h2>
                    <div style="margin-top:6px; font-size:12px; color:#7f8c8d;">
                        分类：${categoryInfo.category} / ${categoryInfo.group}
                    </div>
                </div>
                <div style="font-size:12px; color:#95a5a6;">模板配置</div>
            </div>

            ${topTipHTML}

            <div style="margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div>
                    <label style="font-size:12px; color:#7f8c8d;">凭证字</label>
                    <select id="engine-voucher-word" style="width:100%; padding:8px; border:1px solid #dfe6e9; border-radius:6px;">
                        <option value="转" ${template.voucherWord === "转" ? "selected" : ""}>转</option>
                        <option value="收" ${template.voucherWord === "收" ? "selected" : ""}>收</option>
                        <option value="付" ${template.voucherWord === "付" ? "selected" : ""}>付</option>
                        <option value="记" ${template.voucherWord === "记" ? "selected" : ""}>记</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:12px; color:#7f8c8d;">摘要模板</label>
                    <input id="engine-summary-template" type="text" value="${template.summaryTemplate || ""}" placeholder="例如：收运单{waybillNo}运费"
                        style="width:100%; padding:8px; border:1px solid #dfe6e9; border-radius:6px;">
                </div>
            </div>

            <div style="margin-top:16px;">
                <label style="font-size:12px; color:#7f8c8d;">备注</label>
                <input id="engine-remark" type="text" value="${template.remark || ""}" placeholder="规则备注"
                    style="width:100%; padding:8px; border:1px solid #dfe6e9; border-radius:6px;">
            </div>

            <div style="margin-top:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="margin:0; font-size:16px;">分录配置</h3>
                    <button onclick="window.addEngineEntry('${itemName}')" style="padding:6px 12px; border:1px solid #3498db; color:#3498db; background:#fff; border-radius:6px; cursor:pointer;">+ 添加分录</button>
                </div>
                <table style="width:100%; border-collapse:collapse; margin-top:12px; font-size:13px;">
                    <thead>
                        <tr style="background:#f4f6f8; text-align:left;">
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">方向</th>
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">会计科目</th>
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">摘要</th>
                            ${isWriteOff ? `<th style="padding:8px; border-bottom:1px solid #e1e5ea;">收支方式</th>` : ""}
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="engine-entries-body">
                        ${entryRowsHtml || ""}
                    </tbody>
                </table>
            </div>

            <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
                <button onclick="window.resetEngineTemplate('${itemName}')" style="padding:6px 14px; border:1px solid #dcdde1; background:#f5f6fa; border-radius:6px; cursor:pointer;">清空科目</button>
                <button onclick="window.saveEngineTemplate('${itemName}', ${isWriteOff})" style="padding:6px 16px; border:none; background:#27ae60; color:#fff; border-radius:6px; cursor:pointer;">保存模板</button>
            </div>
        </div>
    `;

    // 5. 渲染
    const contentArea = document.getElementById('configPanel') || document.getElementById('engine-content-area');
    if (contentArea) {
        contentArea.style.display = 'block';
        contentArea.innerHTML = rightHTML;
        const emptyState = document.getElementById('emptyState');
        if(emptyState) emptyState.style.display = 'none';
        const titleEl = document.getElementById('currentScenarioTitle');
        if(titleEl) titleEl.innerText = itemName;
    }
};

window.toggleEngineCategory = function(categoryId) {
    const container = document.getElementById(categoryId);
    const icon = document.querySelector(`.engine-toggle-icon[data-target="${categoryId}"]`);
    if (!container) return;
    const isHidden = container.style.display === "none";
    container.style.display = isHidden ? "block" : "none";
    if (icon) icon.textContent = isHidden ? "▾" : "▸";
};

window.getEngineSubjectOptions = function() {
    const subjects = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]");
    if (!subjects.length) {
        return [{ code: "", name: "暂无科目，请先维护会计科目" }];
    }
    return subjects.filter(s => s.status !== "停用").map(s => ({
        code: s.code || "",
        name: s.name || ""
    }));
};

window.addEngineEntry = function(itemName) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    template.entries.push({ dir: "借", subjectCode: "", subjectName: "", summary: "", usePaymentMethod: false });
    setEngineTemplate(itemName, template);
    window.loadEngineConfig(itemName);
};

window.togglePaymentMethodSubject = function(inputEl) {
    const row = inputEl && inputEl.closest ? inputEl.closest("tr") : null;
    if (!row) return;
    const subjectSelect = row.querySelector(".engine-subject");
    if (!subjectSelect) return;
    subjectSelect.disabled = !!inputEl.checked;
    if (inputEl.checked) {
        subjectSelect.value = "";
    }
};

window.removeEngineEntry = function(itemName, index) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    template.entries.splice(index, 1);
    setEngineTemplate(itemName, template);
    window.loadEngineConfig(itemName);
};

window.resetEngineTemplate = function(itemName) {
    const categoryInfo = findEngineCategory(itemName);
    const template = buildEmptyTemplate(itemName, categoryInfo);
    setEngineTemplate(itemName, template);
    window.loadEngineConfig(itemName);
};

window.saveEngineTemplate = function(itemName, isWriteOff) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    const rows = Array.from(document.querySelectorAll("#engine-entries-body tr"));
    if (rows.length === 0) {
        return alert("请至少配置一条分录。");
    }

    const entries = rows.map(row => {
        const subjectValue = row.querySelector(".engine-subject")?.value || "";
        const [subjectCode, subjectName] = subjectValue.split("|||");
        return {
            dir: row.querySelector(".engine-dir")?.value || "借",
            subjectCode: (subjectCode || "").trim(),
            subjectName: (subjectName || "").trim(),
            summary: row.querySelector(".engine-summary")?.value.trim() || "",
            usePaymentMethod: isWriteOff ? !!row.querySelector(".engine-pm")?.checked : false
        };
    });

    const invalidRow = entries.find(entry => !entry.usePaymentMethod && (!entry.subjectCode || !entry.subjectName));
    if (invalidRow) {
        return alert("科目代码和名称不能为空。");
    }

    template.voucherWord = document.getElementById("engine-voucher-word")?.value || "转";
    template.summaryTemplate = document.getElementById("engine-summary-template")?.value.trim() || "";
    template.remark = document.getElementById("engine-remark")?.value.trim() || "";
    template.entries = entries;
    setEngineTemplate(itemName, template);

    alert("✅ 模板已保存并生效。");
};
