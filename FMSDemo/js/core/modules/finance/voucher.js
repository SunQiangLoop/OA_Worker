        // ==========================================================
        // 凭证录入与审核 - 业务逻辑函数
        // ==========================================================

        /** 1. 自动计算合计金额 */
        window.calculateTotals = function () {
            let totalDebit = 0;
            let totalCredit = 0;

            document.querySelectorAll('.input-debit').forEach(input => {
                const val = parseFloat(input.value);
                if (!isNaN(val)) totalDebit += val;
            });

            document.querySelectorAll('.input-credit').forEach(input => {
                const val = parseFloat(input.value);
                if (!isNaN(val)) totalCredit += val;
            });

            const dEl = document.getElementById('total-debit-display');
            const cEl = document.getElementById('total-credit-display');

            if (dEl && cEl) {
                dEl.innerText = totalDebit.toFixed(2);
                cEl.innerText = totalCredit.toFixed(2);

                const isBalanced = totalDebit.toFixed(2) === totalCredit.toFixed(2) && totalDebit > 0;
                const color = isBalanced ? "#27ae60" : "#e74c3c";
                dEl.style.color = color;
                cEl.style.color = color;
            }
        }

        /** 2. 动态添加分录行 (支持回填参数) */
        window.addEntryRow = function (data = null) {
            const tbody = document.getElementById('entry-table-body');
            if (!tbody) return;

            // 读取传入的 data 对象
            const summary = data ? data.summary : '';
            const account = data ? data.account : '';
            const debit = data ? data.debit : '';
            const credit = data ? data.credit : '';

            const newRow = `
            <tr>
                <td>
                    <div style="display:flex; align-items:center;">
                        <a href="javascript:void(0)" onclick="removeEntryRow(this)" style="color:#ccc; margin-right:5px; text-decoration:none; font-size:16px;">✕</a>
                        <input type="text" class="input-summary" list="voucher-summary-templates" value="${summary}" placeholder="摘要" style="width: 90%;">
                    </div>
                </td>
                <td><input type="text" class="input-account" value="${account}" list="acct-list" placeholder="科目" style="width: 95%;"></td>
                <td><input type="number" class="input-debit" value="${debit}" oninput="calculateTotals()" placeholder="0.00" style="width: 95%; text-align: right;"></td>
                <td><input type="number" class="input-credit" value="${credit}" oninput="calculateTotals()" placeholder="0.00" style="width: 95%; text-align: right;"></td>
            </tr>
        `;
            tbody.insertAdjacentHTML('beforeend', newRow);
        }

        /** 3. 删除行 */
        window.removeEntryRow = function (btn) {
            const row = btn.closest('tr');
            const tbody = document.getElementById('entry-table-body');
            if (tbody.rows.length > 1) {
                row.remove();
                calculateTotals();
            } else {
                alert("至少保留一行。");
            }
        }

        /** 4. 重置表单 (新建模式) */
        window.resetVoucherForm = function () {
            const tbody = document.getElementById('entry-table-body');
            if (!tbody) return;
            tbody.innerHTML = '';

            addEntryRow();
            addEntryRow();

            const wordEl = document.getElementById('voucher-word');
            const word = wordEl ? wordEl.value : "记";
            const nextSeq = window.getNextVoucherSeq ? window.getNextVoucherSeq(word) : 1;
            const newId = window.formatVoucherId ? window.formatVoucherId(word, nextSeq) : `${word}-${String(nextSeq).padStart(4, "0")}`;
            document.getElementById('current-v-id').innerText = newId;
            document.getElementById('v-date').value = new Date().toISOString().split('T')[0];

            calculateTotals();
        }

        /** * 5.  保存/提交凭证 (含引擎校验 + 修复重复ID问题) */
        window.saveVoucher = function (status) {
            // --- 1. 引擎校验  ---
            const mappings = JSON.parse(sessionStorage.getItem('EngineMappings') || "[]");
            // 如果没有启用的规则，拦截 (模拟强管控)
            if (!mappings.some(m => m.status === '启用')) return alert("⛔ 【拦截】会计引擎已关闭，禁止录入！");

            // --- 2. 获取数据 ---
            // ★★★ 核心修复：加 trim() 去除可能的空格 ★★★
            const vId = document.getElementById('current-v-id').innerText.trim();
            const vDate = document.getElementById('v-date').value;

            const lines = [];
            const rows = document.querySelectorAll('#entry-table-body tr');
            let totalDebit = 0;
            let totalCredit = 0;

            rows.forEach(row => {
                const summary = row.querySelector('.input-summary').value;
                const account = row.querySelector('.input-account').value;
                const debit = parseFloat(row.querySelector('.input-debit').value) || 0;
                const credit = parseFloat(row.querySelector('.input-credit').value) || 0;

                // 跳过空行
                if (!summary && !account && debit === 0 && credit === 0) return;

                totalDebit += debit;
                totalCredit += credit;

                lines.push({
                    summary: summary,
                    account: account,
                    debit: debit === 0 ? '' : debit.toFixed(2),
                    credit: credit === 0 ? '' : credit.toFixed(2)
                });
            });

            // 校验借贷平衡
            if (totalDebit === 0 || Math.abs(totalDebit - totalCredit) > 0.01) {
                alert("❌ 借贷不平衡或金额为0，无法保存！");
                return;
            }

            const voucherSummary = lines.find(line => line.summary)?.summary || '';

            // 构造新凭证对象
            const newVoucher = {
                id: vId,
                date: vDate,
                amount: totalDebit.toFixed(2),
                summary: voucherSummary,
                user: '当前用户',
                status: status, // '草稿' 或 '待审核'
                lines: lines
            };

            // --- 3. 存入 Session (修复覆盖逻辑) ---
            let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");

            // ★★★ 核心修复：查找旧数据索引，原地替换或置顶 ★★★
            const existingIndex = list.findIndex(v => v.id === vId);

            if (existingIndex > -1) {
                // 找到了旧的：删除旧的，把新的放最前面 (方便用户看到变化)
                list.splice(existingIndex, 1);
                list.unshift(newVoucher);
            } else {
                // 没找到：直接新增
                list.unshift(newVoucher);
            }

            sessionStorage.setItem('ManualVouchers', JSON.stringify(list));

            // --- 4. 记日志 ---
            if (typeof addAuditLog === 'function') {
                addAuditLog({
                    level: '中风险',
                    time: new Date().toLocaleString(),
                    user: '当前用户',
                    ip: '127.0.0.1',
                    module: '凭证录入',
                    action: status === '草稿' ? '保存/修改草稿' : '提交审核',
                    detail: `凭证:${vId}, 状态:${status}, 金额:${totalDebit.toFixed(2)}`
                });
            }

            alert(`✅ 凭证【${vId}】已保存！\n当前状态：${status}`);
            loadContent('VoucherEntryReview'); // 刷新页面
        }


        /** 6.  编辑凭证 (真实回填数据) */
        window.editVoucher = function (id) {
            // 1. 读取数据
            const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
            const voucher = list.find(v => v.id === id);

            if (!voucher) {
                alert("❌ 未找到该凭证数据。");
                return;
            }

            // 状态校验
            if (voucher.status === '已审核' || voucher.status === '已记账') {
                alert("⚠️ 已审核的凭证不可修改。");
                return;
            }

            // 2. 回填表头
            const idEl = document.getElementById('current-v-id');
            const dateEl = document.getElementById('v-date');

            if (idEl) idEl.innerText = voucher.id;
            if (dateEl) dateEl.value = voucher.date;

            // 3. 回填分录行 (关键)
            const tbody = document.getElementById('entry-table-body');
            if (tbody) {
                tbody.innerHTML = ''; // 先清空

                if (voucher.lines && voucher.lines.length > 0) {
                    // 逐行回填
                    voucher.lines.forEach(line => {
                        addEntryRow(line);
                    });
                } else {
                    // 兼容旧数据
                    addEntryRow({ summary: '数据恢复', account: '待确认科目', debit: voucher.amount, credit: '' });
                    addEntryRow({ summary: '数据恢复', account: '1002 银行存款', debit: '', credit: voucher.amount });
                }
            }

            // 4. 重新计算合计 & 滚回顶部
            calculateTotals();
            const contentArea = document.getElementById('content-area');
            if (contentArea) contentArea.scrollTop = 0;
        }

        /** 7. 删除凭证 */
        window.deleteVoucher = function (btn, id) {
            if (!confirm(`确认删除凭证【${id}】吗？`)) return;

            let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
            list = list.filter(v => v.id !== id);
            sessionStorage.setItem('ManualVouchers', JSON.stringify(list));

            btn.closest('tr').remove();
        }


        /**
         * 2. 审核凭证 (Change Status)
         */
        window.auditVoucher = function (btn, id) {
            if (!confirm(`确认审核通过凭证【${id}】吗？\n审核后凭证将生效并可查询。`)) return;

            // 1. 读取数据
            let voucherList = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");

            // 2. 找到对应凭证并修改状态
            const target = voucherList.find(v => v.id === id);
            if (target) {
                target.status = "已审核"; // 或者 "已记账"

                // 3. 保存回 Session
                sessionStorage.setItem('ManualVouchers', JSON.stringify(voucherList));

                // 4. 刷新页面
                alert("✅ 审核通过！");
                loadContent('VoucherEntryReview');
            }
        }

        // 会计：审核通过
        window.auditPass = function (id) {
            if (!confirm(`确认审核通过凭证【${id}】吗？`)) return;

            // 更新 Session 数据
            let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
            const target = list.find(v => v.id === id);
            if (target) target.status = "已记账";
            sessionStorage.setItem('ManualVouchers', JSON.stringify(list));

            alert("✅ 审核通过！凭证已正式记账。");
            loadContent('VoucherQueryPrint'); // 刷新
        }

        // 会计：驳回
        window.auditReject = function (id) {
            const reason = prompt(`请输入驳回凭证【${id}】的原因：`, "金额有误，请核对");
            if (reason) {
                // 更新 Session 数据
                let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
                const target = list.find(v => v.id === id);
                if (target) target.status = "已驳回";
                sessionStorage.setItem('ManualVouchers', JSON.stringify(list));

                alert(`⛔ 凭证已驳回给制单人。\n原因：${reason}`);
                loadContent('VoucherQueryPrint'); // 刷新
            }
        }


        // ==========================================================
// ★★★ 智能凭证录入逻辑 (Smart Entry) ★★★
// ==========================================================

/**
 * 核心：更新右侧预览 (响应式)
 */
window.updateSmartPreview = function() {
    const tbody = document.getElementById('preview-tbody');
    const tag = document.getElementById('preview-tag');
    const totalD = document.getElementById('preview-total-debit');
    const totalC = document.getElementById('preview-total-credit');
    const entryTotalD = document.getElementById('entry-total-debit');
    const entryTotalC = document.getElementById('entry-total-credit');
    const voucherWord = document.getElementById("voucher-word")?.value || "记";
    const voucherType = window.getVoucherTypeByWord ? window.getVoucherTypeByWord(voucherWord) : "记账凭证";

    const lines = window.collectVoucherLines ? window.collectVoucherLines() : [];
    if (!lines.length) {
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#ccc;">等待录入数据...</td></tr>`;
        }
        if (totalD) totalD.innerText = "0.00";
        if (totalC) totalC.innerText = "0.00";
        if (tag) {
            tag.innerText = voucherType;
            tag.style.background = "#7f8c8d";
        }
        window._tempSmartVoucher = { amount: "0.00", lines: [], type: voucherType, totalDebit: 0, totalCredit: 0 };
        return;
    }

    let totalDebit = 0;
    let totalCredit = 0;
    lines.forEach(line => {
        totalDebit += parseFloat(line.debit || "0") || 0;
        totalCredit += parseFloat(line.credit || "0") || 0;
    });

    if (tbody) {
        tbody.innerHTML = lines.map(line => `
            <tr>
                <td style="border:1px solid #eee; padding:5px;">${line.summary}</td>
                <td style="border:1px solid #eee; padding:5px;">${line.account}</td>
                <td style="border:1px solid #eee; padding:5px; text-align:right;">${line.debit}</td>
                <td style="border:1px solid #eee; padding:5px; text-align:right;">${line.credit}</td>
            </tr>
        `).join("");
    }

    if (totalD) totalD.innerText = totalDebit.toFixed(2);
    if (totalC) totalC.innerText = totalCredit.toFixed(2);
    if (entryTotalD) entryTotalD.innerText = totalDebit.toFixed(2);
    if (entryTotalC) entryTotalC.innerText = totalCredit.toFixed(2);
    if (tag) {
        tag.innerText = voucherType;
        tag.style.background = "#7f8c8d";
    }

    window._tempSmartVoucher = {
        amount: Math.max(totalDebit, totalCredit).toFixed(2),
        lines: lines,
        type: voucherType,
        totalDebit: totalDebit,
        totalCredit: totalCredit
    };
};

window.addVoucherLineRow = function(line = {}) {
    const tbody = document.getElementById("entry-lines-body");
    if (!tbody) return;
    const normalizeCode = window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, ""));
    const defaultSummary = line.summary || window._selectedSummaryTemplate || "";
    const rowHtml = `
        <tr class="entry-line-row">
            <td class="entry-index">1</td>
            <td><input class="entry-summary" type="text" list="voucher-summary-templates" oninput="updateSmartPreview()" placeholder="摘要" value="${defaultSummary}" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;"></td>
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
            <td><input class="entry-debit" type="number" oninput="updateSmartPreview()" placeholder="0.00" value="${line.debit || ""}" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;"></td>
            <td><input class="entry-credit" type="number" oninput="updateSmartPreview()" placeholder="0.00" value="${line.credit || ""}" style="width:100%; padding:6px 8px; border:1px solid #ccc; border-radius:4px;"></td>
            <td style="text-align:center;"><button class="btn-primary" style="background:#e74c3c; padding:2px 6px;" onclick="removeVoucherLineRow(this)">-</button></td>
        </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", rowHtml);
    const row = tbody.lastElementChild;
    if (row) {
        const input = row.querySelector(".entry-subject");
        const rawSubject = line.account || "";
        const accountCode = line.accountCode ? (normalizeCode(line.accountCode) || line.accountCode) : "";
        const accountName = line.accountName || "";
        const resolved = window.resolveSubjectInput ? window.resolveSubjectInput(rawSubject) : { subject: window.getSubjectByValue(rawSubject) };
        let displayValue = "";
        if (accountCode || accountName) {
            displayValue = window.formatSubjectDisplayValue
                ? window.formatSubjectDisplayValue(accountCode, accountName)
                : `${accountCode} ${accountName}`.trim();
        } else if (resolved && resolved.subject) {
            const resolvedCode = normalizeCode(resolved.subject.code) || resolved.subject.code || "";
            displayValue = window.formatSubjectDisplayValue
                ? window.formatSubjectDisplayValue(resolvedCode, resolved.subject.name)
                : `${resolvedCode} ${resolved.subject.name}`.trim();
        } else if (rawSubject) {
            displayValue = rawSubject;
        }
        if (input && displayValue) input.value = displayValue;
    }
    if (row) {
        const subjectValue = row.querySelector(".entry-subject")?.value || "";
        window.updateAuxiliaryOptionsForRow(row, subjectValue, line);
        window.updateSubjectNameForRow(row, subjectValue);
    }
    window.updateEntryRowIndex();
    updateSmartPreview();
};

window.updateEntryRowIndex = function() {
    document.querySelectorAll(".entry-line-row").forEach((row, index) => {
        const cell = row.querySelector(".entry-index");
        if (cell) cell.textContent = String(index + 1);
    });
};

window.getAuxiliaryDataByKey = function(key) {
    try {
        const raw = sessionStorage.getItem(`AuxiliaryData:${key}`) || localStorage.getItem(`AuxiliaryData:${key}`);
        const parsed = JSON.parse(raw || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

window.parseAuxLabels = function(aux) {
    if (!aux || aux === "无") return [];
    return aux
        .toString()
        .split(/[,，、/]/)
        .map(item => item.trim())
        .filter(Boolean);
};

window.mapAuxLabelToKey = function(label) {
    const map = {
        "部门": "dept",
        "客户": "customer",
        "供应商": "vendor",
        "职员": "employee",
        "员工": "employee",
        "项目": "project",
        "存货": "inventory",
        "车辆": "inventory",
        "往来单位": "customer"
    };
    return map[label] || "";
};

window.formatSubjectDisplayValue = function(code, name) {
    const cleanCode = (code || "").toString().trim();
    const cleanName = (name || "").toString().trim();
    if (cleanCode && cleanName) return `${cleanCode} ${cleanName}`;
    return cleanCode || cleanName || "";
};

window.escapeSubjectHtml = function(value) {
    return (value || "").toString()
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
};

window.closeAllSubjectDropdowns = function() {
    document.querySelectorAll(".subject-dropdown.is-open").forEach(dropdown => {
        dropdown.classList.remove("is-open");
    });
    const globalDropdown = document.getElementById("subject-global-dropdown");
    if (globalDropdown) {
        globalDropdown.classList.remove("is-open");
    }
    window._activeSubjectInput = null;
};

window.bindSubjectDropdownClose = function() {
    if (window._subjectDropdownBound) return;
    document.addEventListener("click", (event) => {
        if (!event.target.closest(".subject-picker") && !event.target.closest("#subject-global-dropdown")) {
            window.closeAllSubjectDropdowns();
        }
    });
    window.addEventListener("scroll", (event) => {
        const target = event.target;
        if (target && target.closest) {
            if (target.closest("#subject-global-dropdown") || target.closest(".subject-picker")) {
                return;
            }
        }
        window.closeAllSubjectDropdowns();
    }, true);
    window._subjectDropdownBound = true;
};

window.getSubjectDropdownContainer = function() {
    let container = document.getElementById("subject-global-dropdown");
    if (!container) {
        container = document.createElement("div");
        container.id = "subject-global-dropdown";
        container.className = "subject-dropdown subject-dropdown-global";
        container.addEventListener("mousedown", (event) => {
            const option = event.target.closest(".subject-option");
            if (option && !option.classList.contains("is-empty")) {
                window.selectSubjectOption(option);
                event.preventDefault();
            }
        });
        document.body.appendChild(container);
    }
    return container;
};

window.updateSubjectDropdown = function(input, options = {}) {
    if (!input) return;
    const dropdown = window.getSubjectDropdownContainer();

    const { showAll = false, openDropdown = true } = options;
    const list = window._voucherSubjectList || [];
    const normalize = window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, ""));
    const query = (input.value || "").trim();
    const keyword = normalize(query);
    const keywordLower = query.toLowerCase();

    if (!showAll && !query) {
        dropdown.innerHTML = "";
        dropdown.classList.remove("is-open");
        return;
    }

    const hasLetters = /[A-Za-z\u4e00-\u9fa5]/.test(query);
    const filtered = showAll
        ? list
        : query
            ? list.filter(item => {
                const rawCode = (item.code || "").toString().trim();
                const code = normalize(rawCode);
                const name = (item.name || "").toLowerCase();
                const codeMatch = keyword && (code.startsWith(keyword) || rawCode.startsWith(query));
                const nameMatch = keywordLower && name.startsWith(keywordLower);
                if (!hasLetters) return !!codeMatch;
                return !!(codeMatch || nameMatch);
            })
            : [];

    const html = filtered.length
        ? filtered.map(item => {
            const normalized = normalize(item.code);
            const code = normalized || item.code || "";
            const name = item.name || "";
            const displayValue = window.formatSubjectDisplayValue
                ? window.formatSubjectDisplayValue(code, name)
                : `${code} ${name}`.trim();
            if (!displayValue) return "";
            const escapedDisplay = window.escapeSubjectHtml(displayValue);
            const escapedCode = window.escapeSubjectHtml(code);
            const escapedName = window.escapeSubjectHtml(name);
            return `<button type="button" class="subject-option" data-code="${escapedCode}" data-name="${escapedName}" data-display="${escapedDisplay}" onmousedown="selectSubjectOption(this)">${escapedDisplay}</button>`;
        }).join("")
        : `<div class="subject-option is-empty">无匹配科目</div>`;

    dropdown.innerHTML = html;
    window._activeSubjectInput = input;
    const rect = input.getBoundingClientRect();
    dropdown.style.width = `${rect.width}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.top = `${rect.bottom + window.scrollY + 2}px`;
    if (openDropdown && (showAll || query)) {
        dropdown.classList.add("is-open");
    } else {
        dropdown.classList.remove("is-open");
    }
    window.bindSubjectDropdownClose();
};

window.toggleSubjectDropdown = function(btn) {
    const picker = btn && btn.closest ? btn.closest(".subject-picker") : null;
    if (!picker) return;
    const input = picker.querySelector(".entry-subject");
    if (!input) return;
    const dropdown = document.getElementById("subject-global-dropdown");
    const willOpen = !dropdown || !dropdown.classList.contains("is-open");
    window.closeAllSubjectDropdowns();
    if (willOpen) {
        window.updateSubjectDropdown(input, { showAll: true, openDropdown: true });
        input.focus();
    }
};

window.selectSubjectOption = function(btn) {
    const input = window._activeSubjectInput;
    if (!input) return;
    const display = btn.dataset.display || btn.textContent || "";
    input.value = display;
    window.closeAllSubjectDropdowns();
    window.handleSubjectChange(input);
    input.focus();
};

window.resolveSubjectInput = function(value) {
    const raw = (value || "").toString().trim();
    const normalize = window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, ""));
    const normalized = normalize(raw);
    const list = window._voucherSubjectList || [];
    let subject = null;

    if (window._voucherSubjectMap) {
        if (raw && window._voucherSubjectMap[raw]) subject = window._voucherSubjectMap[raw];
        if (!subject && normalized && window._voucherSubjectMap[normalized]) subject = window._voucherSubjectMap[normalized];
        if (!subject && raw) {
            const firstToken = raw.split(/\s+/)[0];
            const tokenNormalized = normalize(firstToken);
            if (firstToken && window._voucherSubjectMap[firstToken]) subject = window._voucherSubjectMap[firstToken];
            if (!subject && tokenNormalized && window._voucherSubjectMap[tokenNormalized]) subject = window._voucherSubjectMap[tokenNormalized];
        }
    }

    if (!subject && raw) {
        const lower = raw.toLowerCase();
        subject = list.find(item => (item.name || "").toLowerCase() === lower);
    }

    const code = subject ? (normalize(subject.code) || subject.code || "") : (normalized || "");
    let name = "";
    if (subject && subject.name) {
        name = subject.name;
    } else if (raw) {
        const parts = raw.split(/\s+/);
        if (normalized && parts.length > 1) {
            name = parts.slice(1).join(" ");
        } else if (!normalized) {
            name = raw;
        }
    }

    return { subject, code, name };
};

window.buildAuxOptions = function(labels) {
    if (!labels.length) return `<option value="">无</option>`;
    let html = `<option value="">请选择辅助核算项目</option>`;
    labels.forEach(label => {
        const key = window.mapAuxLabelToKey(label);
        if (!key) return;
        const list = window.getAuxiliaryDataByKey(key).filter(item => item.enabled !== false);
        if (!list.length) return;
        html += `<optgroup label="${label}">`;
        html += list.map(item => {
            const value = `${key}|||${item.code}|||${item.name}`;
            return `<option value="${value}">${item.code} ${item.name}</option>`;
        }).join("");
        html += `</optgroup>`;
    });
    return html;
};

window.getSubjectByValue = function(value) {
    const val = (value || "").trim();
    const normalized = (window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, "")))(val);
    if (window._voucherSubjectMap && window._voucherSubjectMap[val]) {
        return window._voucherSubjectMap[val];
    }
    if (window._voucherSubjectMap && normalized && window._voucherSubjectMap[normalized]) {
        return window._voucherSubjectMap[normalized];
    }
    const code = val.split(" ")[0];
    if (window._voucherSubjectMap && window._voucherSubjectMap[code]) {
        return window._voucherSubjectMap[code];
    }
    if (val) {
        const list = window._voucherSubjectList || [];
        const lower = val.toLowerCase();
        const exact = list.find(item => (item.name || "").toLowerCase() === lower);
        if (exact) return exact;
    }
    return null;
};

window.updateAuxiliaryOptionsForRow = function(row, subjectValue, line = {}) {
    if (!row) return;
    const select = row.querySelector(".entry-aux");
    if (!select) return;
    const resolved = window.resolveSubjectInput ? window.resolveSubjectInput(subjectValue) : { subject: window.getSubjectByValue(subjectValue) };
    const subject = resolved.subject;
    const labels = window.parseAuxLabels(subject ? subject.aux : "");
    select.innerHTML = window.buildAuxOptions(labels);
    if (line.auxType && line.auxCode) {
        const name = line.auxName || "";
        const value = `${line.auxType}|||${line.auxCode}|||${name}`;
        select.value = value;
    } else if (line.aux) {
        const match = Array.from(select.options).find(opt => opt.textContent.includes(line.aux));
        if (match) select.value = match.value;
    }
};

window.handleSubjectChange = function(select) {
    const row = select && select.closest ? select.closest(".entry-line-row") : null;
    if (row) {
        window.updateAuxiliaryOptionsForRow(row, select.value);
        window.updateSubjectNameForRow(row, select.value);
    }
    updateSmartPreview();
};

window.matchSubjectByInput = function(value) {
    const raw = (value || "").trim();
    const normalize = window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, ""));
    const normalized = normalize(raw);
    const list = window._voucherSubjectList || [];
    if (!raw && !normalized) return null;
    if (normalized) {
        const exactCode = list.find(item => normalize(item.code) === normalized);
        if (exactCode) return exactCode;
    }
    const lower = raw.toLowerCase();
    const exactName = list.find(item => (item.name || "").toLowerCase() === lower);
    if (exactName) return exactName;
    return null;
};

window.updateSubjectDatalist = function(target) {
    const input = target && target.classList && target.classList.contains("entry-subject")
        ? target
        : (document.activeElement && document.activeElement.classList && document.activeElement.classList.contains("entry-subject")
            ? document.activeElement
            : null);
    if (!input) return;
    window.updateSubjectDropdown(input, { showAll: false, openDropdown: true });
};

window.handleSubjectInputChange = function(input, silent = false) {
    if (!input) return;
    const normalize = window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, ""));
    const raw = (input.value || "").trim();
    const hasLetters = /[A-Za-z\u4e00-\u9fa5]/.test(raw);
    if (!hasLetters) {
        const sanitized = normalize(raw);
        if (sanitized && sanitized !== raw) {
            input.value = sanitized;
        }
    }
    window.updateSubjectDropdown(input, { showAll: false, openDropdown: !silent });
    if (!raw) {
        window.closeAllSubjectDropdowns();
        window.handleSubjectChange(input);
        return;
    }
    updateSmartPreview();
};

window.handleSubjectBlur = function(input) {
    if (!input) return;
    window.closeAllSubjectDropdowns();
    const row = input.closest ? input.closest(".entry-line-row") : null;
    if (row) {
        window.updateAuxiliaryOptionsForRow(row, input.value);
    }
    updateSmartPreview();
};

window.updateSubjectNameForRow = function(row, subjectValue) {
    if (!row) return;
    const input = row.querySelector(".entry-subject");
    if (!input) return;
    const resolved = window.resolveSubjectInput ? window.resolveSubjectInput(subjectValue) : { subject: window.getSubjectByValue(subjectValue) };
    const subject = resolved.subject;
    if (subject) {
        const normalize = window.normalizeVoucherSubjectCode || ((code) => (code || "").toString().replace(/\D/g, ""));
        const code = normalize(subject.code) || subject.code || "";
        const raw = (subjectValue || "").trim();
        const normalized = normalize(raw);
        const isExactName = raw && subject.name && raw.toLowerCase() === subject.name.toLowerCase();
        const isCodeMatch = normalized && code && normalized === normalize(code);
        const hasCodePrefix = code && raw.startsWith(code);
        if (!isExactName && !isCodeMatch && !hasCodePrefix) {
            return;
        }
        const displayValue = window.formatSubjectDisplayValue
            ? window.formatSubjectDisplayValue(code, subject.name)
            : `${code} ${subject.name}`.trim();
        if (displayValue && input.value !== displayValue) {
            input.value = displayValue;
        }
        return;
    }
    if (!subjectValue) {
        input.value = "";
    }
};

window.getVoucherTypeByWord = function(word) {
    switch (word) {
        case "收":
            return "收款凭证";
        case "付":
            return "付款凭证";
        case "转":
            return "转账凭证";
        default:
            return "记账凭证";
    }
};

window.parseVoucherSeq = function(id) {
    const text = (id || "").toString().trim();
    const match = text.match(/(\d+)\s*$/);
    if (!match) return null;
    const num = parseInt(match[1], 10);
    return Number.isFinite(num) ? num : null;
};

window.getNextVoucherSeq = function(word) {
    const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const prefix = (word || "记").toString();
    let maxSeq = 0;
    list.forEach(v => {
        const id = (v.id || "").toString().trim();
        if (!id.startsWith(prefix)) return;
        const seq = window.parseVoucherSeq(id);
        if (Number.isFinite(seq) && seq > maxSeq) maxSeq = seq;
    });
    return maxSeq + 1;
};

window.formatVoucherId = function(word, seq) {
    const prefix = (word || "记").toString();
    const num = Number.isFinite(seq) ? seq : 1;
    return `${prefix}-${String(num).padStart(4, "0")}`;
};

window.syncVoucherWord = function() {
    const wordEl = document.getElementById("voucher-word");
    const idEl = document.getElementById("current-v-id");
    const word = wordEl ? wordEl.value : "记";
    const type = window.getVoucherTypeByWord ? window.getVoucherTypeByWord(word) : "记账凭证";
    if (idEl) {
        if (window._editingVoucherId) {
            // 编辑模式不改凭证号
        } else {
            const current = (idEl.innerText || "").toString().trim();
            const currentSeq = window.parseVoucherSeq ? window.parseVoucherSeq(current) : null;
            const nextSeq = Number.isFinite(currentSeq) ? currentSeq : (window.getNextVoucherSeq ? window.getNextVoucherSeq(word) : 1);
            idEl.innerText = window.formatVoucherId ? window.formatVoucherId(word, nextSeq) : `${word}-${String(nextSeq).padStart(4, "0")}`;
        }
    }
    const titleEl = document.getElementById("voucher-entry-title");
    if (titleEl) titleEl.innerText = type;
    updateSmartPreview();
};

window.getVoucherWordFromType = function(type) {
    switch ((type || "").trim()) {
        case "收款凭证":
            return "收";
        case "付款凭证":
            return "付";
        case "转账凭证":
            return "转";
        default:
            return "记";
    }
};

window.loadVoucherForEdit = function(id) {
    const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const voucher = list.find(v => v.id === id);
    if (!voucher) return alert("未找到凭证数据！");
    if (voucher.status === "已记账" || voucher.status === "已过账") {
        return alert("已过账凭证不可修改，请走补录流程。");
    }
    if (window.g_currentModule !== "VoucherEntryReview") {
        loadContent('VoucherEntryReview');
        setTimeout(() => window.loadVoucherForEdit(id), 120);
        return;
    }

    window._editingVoucherId = id;
    const idEl = document.getElementById('current-v-id');
    const dateEl = document.getElementById('voucher-date');
    const wordEl = document.getElementById('voucher-word');

    if (idEl) idEl.innerText = voucher.id;
    if (dateEl && voucher.date) dateEl.value = voucher.date;
    if (wordEl) wordEl.value = window.getVoucherWordFromType(voucher.type || "");

    const tbody = document.getElementById("entry-lines-body");
    if (tbody) tbody.innerHTML = "";

    const lines = Array.isArray(voucher.lines) ? voucher.lines : [];
    if (lines.length) {
        lines.forEach(line => {
            const summary = line.summary || line.digest || voucher.summary || "";
            window.addVoucherLineRow({
                summary: summary,
                account: line.account || "",
                accountCode: line.accountCode || "",
                debit: line.debit || "",
                credit: line.credit || "",
                auxType: line.auxType || "",
                auxCode: line.auxCode || "",
                auxName: line.auxName || "",
                aux: line.aux || line.auxiliary || ""
            });
        });
    } else {
        window.addVoucherLineRow({
            summary: voucher.summary || "",
            debit: voucher.amount || "",
            credit: ""
        });
    }

    if (typeof window.updateEntryRowIndex === "function") {
        window.updateEntryRowIndex();
    }
    if (typeof window.syncVoucherWord === "function") {
        window.syncVoucherWord();
    } else {
        updateSmartPreview();
    }
};

window.applySummaryTemplateToLines = function(template) {
    const summary = (template || "").trim();
    if (!summary) {
        window._selectedSummaryTemplate = "";
        return;
    }
    window._selectedSummaryTemplate = summary;
    document.querySelectorAll(".entry-line-row .entry-summary").forEach(input => {
        input.value = summary;
    });
    updateSmartPreview();
};

window.removeVoucherLineRow = function(btn) {
    const row = btn && btn.closest ? btn.closest("tr") : null;
    if (!row) return;
    const tbody = row.parentElement;
    row.remove();
    if (tbody && !tbody.children.length) {
        window.addVoucherLineRow();
    } else {
        updateSmartPreview();
    }
    window.updateEntryRowIndex();
};

window.removeLastVoucherLineRow = function() {
    const rows = document.querySelectorAll(".entry-line-row");
    const last = rows[rows.length - 1];
    if (!last) return;
    last.remove();
    if (document.querySelectorAll(".entry-line-row").length === 0) {
        window.addVoucherLineRow();
    }
    updateSmartPreview();
    window.updateEntryRowIndex();
};

window.collectVoucherLines = function() {
    const rows = document.querySelectorAll(".entry-line-row");
    const lines = [];
    rows.forEach(row => {
        const summary = row.querySelector(".entry-summary")?.value.trim() || "";
        const subjectValue = row.querySelector(".entry-subject")?.value || "";
        const resolved = window.resolveSubjectInput ? window.resolveSubjectInput(subjectValue) : { subject: window.getSubjectByValue(subjectValue), code: "", name: "" };
        const accountCode = resolved.code || "";
        const accountName = resolved.subject ? (resolved.subject.name || resolved.name || "") : (resolved.name || "");
        const account = window.formatSubjectDisplayValue
            ? window.formatSubjectDisplayValue(accountCode, accountName)
            : `${accountCode} ${accountName}`.trim();
        const auxVal = row.querySelector(".entry-aux")?.value || "";
        let auxType = "";
        let auxCode = "";
        let auxName = "";
        if (auxVal) {
            const parts = auxVal.split("|||");
            auxType = parts[0] || "";
            auxCode = parts[1] || "";
            auxName = parts[2] || "";
        }
        const debitVal = row.querySelector(".entry-debit")?.value || "";
        const creditVal = row.querySelector(".entry-credit")?.value || "";
        const debit = debitVal ? parseFloat(debitVal).toFixed(2) : "";
        const credit = creditVal ? parseFloat(creditVal).toFixed(2) : "";
        if (!summary && !accountCode && !debit && !credit) return;
        lines.push({
            summary: summary || "-",
            account: account || accountCode || "-",
            accountCode: accountCode,
            accountName: accountName,
            auxType: auxType,
            auxCode: auxCode,
            auxName: auxName,
            debit: debit,
            credit: credit
        });
    });
    return lines;
};

window.applyScenarioToLines = function() {
    const scenarioEl = document.getElementById('biz-scenario');
    const summaryInput = document.getElementById('biz-summary')?.value.trim() || "";
    const amountVal = parseFloat(document.getElementById('biz-amount')?.value) || 0;
    const accountEl = document.getElementById('settlement-account');
    if (!scenarioEl || !accountEl) return;

    const selectedBiz = scenarioEl.options[scenarioEl.selectedIndex];
    const selectedAcct = accountEl.options[accountEl.selectedIndex];
    const bizSubject = selectedBiz.getAttribute('data-subject');
    const bizDefaultDir = selectedBiz.getAttribute('data-dir');
    const fundSubject = selectedAcct.getAttribute('data-subject');
    const bizName = selectedBiz.text;
    const finalSummary = summaryInput ? `${bizName}-${summaryInput}` : bizName;
    const amtStr = amountVal ? amountVal.toFixed(2) : "";

    const tbody = document.getElementById("entry-lines-body");
    if (tbody) tbody.innerHTML = "";

    if (bizDefaultDir === 'credit') {
        window.addVoucherLineRow({ summary: finalSummary, account: fundSubject, debit: amtStr, credit: "" });
        window.addVoucherLineRow({ summary: finalSummary, account: bizSubject, debit: "", credit: amtStr });
    } else {
        window.addVoucherLineRow({ summary: finalSummary, account: bizSubject, debit: amtStr, credit: "" });
        window.addVoucherLineRow({ summary: finalSummary, account: fundSubject, debit: "", credit: amtStr });
    }
    updateSmartPreview();
};

/**
 * 保存智能凭证
 */
window.saveSmartVoucher = function() {
    const data = window._tempSmartVoucher;
    
    // 校验
    if (!data || !data.lines || data.lines.length === 0) {
        alert("❌ 请先录入分录行！");
        return;
    }
    if (Math.abs((data.totalDebit || 0) - (data.totalCredit || 0)) > 0.0001) {
        alert("❌ 借贷不平衡，请检查分录金额。");
        return;
    }
    if (parseFloat(data.amount) <= 0) {
        alert("❌ 请输入有效的金额！");
        return;
    }

    const vId = document.getElementById('current-v-id').innerText;
    const vDate = document.getElementById('voucher-date')?.value || new Date().toISOString().split('T')[0];
    const scenarioEl = document.getElementById('biz-scenario');
    const summaryInputEl = document.getElementById('biz-summary');
    const accountEl = document.getElementById('settlement-account');

    const voucherSummary = data.lines && data.lines.length ? data.lines[0].summary : '';
    const scenarioKey = scenarioEl ? scenarioEl.value : '';
    const summaryInput = summaryInputEl ? summaryInputEl.value.trim() : '';
    const settlementAccount = accountEl ? accountEl.value : '';

    // 保存到 Session
    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const editingId = window._editingVoucherId;
    if (editingId) {
        const item = list.find(v => v.id === editingId);
        if (!item) {
            alert("未找到要修改的凭证，已按新凭证保存。");
            window._editingVoucherId = null;
        } else {
            item.amount = data.amount;
            item.summary = voucherSummary;
            item.status = '待审核';
            item.type = data.type;
            item.lines = data.lines;
            item.scenarioKey = scenarioKey;
            item.summaryInput = summaryInput;
            item.settlementAccount = settlementAccount;
            delete item.rejectReason;
            sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
            window._editingVoucherId = null;
            alert(`✅ 已更新凭证并重新提交审核！\n\n凭证号：${item.id}`);
            loadContent('VoucherEntryReview');
            return;
        }
    }

    const newVoucher = {
        id: vId,
        date: vDate,
        amount: data.amount,
        summary: voucherSummary,
        user: '当前用户',
        status: '待审核', // 设为“待审核”
        type: data.type,  // 保存自动推导的类型
        lines: data.lines,
        scenarioKey: scenarioKey,
        summaryInput: summaryInput,
        settlementAccount: settlementAccount
    };

    list.unshift(newVoucher);
    sessionStorage.setItem('ManualVouchers', JSON.stringify(list));

    // 记日志
    if (typeof addAuditLog === 'function') {
        addAuditLog({
            level: '低风险', time: new Date().toLocaleString(), user: '当前用户', 
            module: '智能凭证', action: '新增凭证', detail: `${vId} (${data.type})`
        });
    }

    alert(`✅ 凭证保存成功！\n\n凭证号：${vId}\n类型：${data.type}`);
    loadContent('VoucherEntryReview'); // 刷新页面重置
}

/**
 * 重置表单
 */
window.resetSmartForm = function() {
    window._editingVoucherId = null;
    loadContent('VoucherEntryReview');
}

/**
 * 驳回凭证修改入口
 */
window.editRejectedVoucher = function(id) {
    const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const voucher = list.find(v => v.id === id);
    if (!voucher) return alert("未找到凭证数据！");
    if (voucher.status !== "已驳回") {
        return alert("只有已驳回的凭证可以修改。");
    }
    window.loadVoucherForEdit(id);
}

window.renderVoucherRecordPage = function(page = 1) {
    const perPage = 10;
    const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const total = list.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const current = Math.min(Math.max(page, 1), totalPages);
    window._voucherRecordPage = current;

    const tbody = document.getElementById("voucher-records-body");
    const countEl = document.getElementById("voucher-record-count");
    if (countEl) countEl.textContent = String(total);
    if (!tbody) return;

    const start = (current - 1) * perPage;
    const pageItems = list.slice(start, start + perPage);
    const statusMap = {
        "待审核": "status-wait",
        "已审核": "status-pass",
        "已记账": "status-done",
        "已过账": "status-done",
        "已驳回": "status-reject",
        "已冲销": "status-cancel",
        "已作废": "status-cancel"
    };

    tbody.innerHTML = pageItems.map((v, idx) => {
        const status = v.status || "待审核";
        const summary =
            v.summary ||
            (v.lines && v.lines[0] && (v.lines[0].summary || v.lines[0].digest)) ||
            "-";
        const amount = parseFloat((v.amount || "0").toString().replace(/,/g, "")) || 0;
        const statusClass = statusMap[status] || "status-wait";
        let editBtn = "";
        if (["待审核", "已驳回"].includes(status)) {
            editBtn = `
                <button class="btn-primary btn-ghost" onclick="loadVoucherForEdit('${v.id}')">编辑</button>
                <button class="btn-primary btn-ghost" style="margin-left:6px;" onclick="deleteVoucher('${v.id}')">删除</button>
            `;
        } else {
            editBtn = `<button class="btn-primary btn-ghost" onclick="openVoucherDetail('${v.id}')">查看</button>`;
        }
        return `
            <tr>
                <td>${start + idx + 1}</td>
                <td><a href="javascript:void(0)" onclick="openVoucherDetail('${v.id}')" class="voucher-link">${v.id || "-"}</a></td>
                <td>${v.date || "-"}</td>
                <td>${v.type || "记账凭证"}</td>
                <td class="summary-cell">${summary}</td>
                <td class="amount-cell">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td><span class="voucher-record-status ${statusClass}">${status}</span></td>
                <td>${editBtn}</td>
            </tr>
        `;
    }).join("") || `<tr><td colspan="8" style="text-align:center; padding:16px;">暂无凭证记录</td></tr>`;

    const pager = document.getElementById("voucher-records-pagination");
    if (!pager) return;
    const maxButtons = 5;
    let startPage = Math.max(1, current - 2);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    let pagerHtml = `
        <button ${current === 1 ? "disabled" : ""} onclick="renderVoucherRecordPage(${current - 1})">上一页</button>
    `;
    for (let i = startPage; i <= endPage; i += 1) {
        pagerHtml += `<button class="${i === current ? "is-active" : ""}" onclick="renderVoucherRecordPage(${i})">${i}</button>`;
    }
    pagerHtml += `
        <button ${current === totalPages ? "disabled" : ""} onclick="renderVoucherRecordPage(${current + 1})">下一页</button>
    `;
    pager.innerHTML = pagerHtml;
};


// // ============================================
// // 凭证状态流转逻辑 (Audit & Post)
// // ============================================

// /**
//  * 1. 审核凭证
//  * 作用：确认凭证无误，锁定修改权限
//  */
// window.auditVoucher = function(id) {
//     if (!confirm(`确认审核通过凭证【${id}】吗？`)) return;

//     let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
//     let item = list.find(v => v.id === id);

//     if (item) {
//         item.status = "已审核"; // 改变状态
//         item.auditUser = "管理员"; // 记录审核人
//         item.auditTime = new Date().toLocaleString();
        
//         sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        
//         alert("✅ 审核通过！状态已更为【已审核】。");
//         // 刷新当前页面
//         if(typeof loadContent === 'function') loadContent('FinanceVoucherEntry');
//     }
// }

// /**
//  * 2. 凭证过账
//  * 作用：将凭证数据正式写入总账/余额表 (这里模拟修改状态)
//  */
// window.postVoucher = function(id) {
//     if (!confirm(`确认对凭证【${id}】进行过账吗？\n过账后数据将计入报表，且不可再修改。`)) return;

//     let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
//     let item = list.find(v => v.id === id);

//     if (item) {
//         item.status = "已过账"; // 改变状态
//         item.postTime = new Date().toLocaleString();
        
//         // ★★★ 这里未来可以加逻辑：把数据写入 'GeneralLedger' (总账表) ★★★
        
//         sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        
//         alert("✅ 过账成功！数据已计入科目余额表。");
//         // 刷新当前页面
//         if(typeof loadContent === 'function') loadContent('FinanceVoucherEntry');
//     }
// }

// /**
//  * 3. 删除凭证 (仅限待审核状态)
//  */
// window.deleteVoucher = function(id) {
//     if (!confirm(`确定删除凭证【${id}】吗？`)) return;
    
//     let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
//     // 过滤掉这就条
//     let newList = list.filter(v => v.id !== id);
    
//     sessionStorage.setItem('ManualVouchers', JSON.stringify(newList));
//     alert("🗑️ 删除成功");
//     if(typeof loadContent === 'function') loadContent('FinanceVoucherEntry');
// }


// ============================================
// 凭证审核与过账逻辑 (Added Logic)
// ============================================

// 1. 审核凭证
window.auditVoucher = function(id) {
    if (!confirm(`确认审核通过凭证【${id}】吗？`)) return;

    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    let item = list.find(v => v.id === id);

    if (item) {
        item.status = "已审核";
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        alert("✅ 审核通过！可以进行过账操作。");
        // 刷新页面
        loadContent('VoucherEntryReview');
    }
}

// 2. 过账 (记账)
window.postVoucher = function(id) {
    if (!confirm(`确认对凭证【${id}】进行过账吗？\n过账后数据将计入总账，且不可直接修改。`)) return;

    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    let item = list.find(v => v.id === id);

    if (item) {
        item.status = "已记账";
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        alert("✅ 过账成功！");
        if (window.g_currentModule === 'FinanceVoucherAudit') {
            loadContent('FinanceVoucherAudit');
        } else {
            loadContent('VoucherEntryReview');
        }
    }
}

// 3. 冲销 (红冲)
window.reverseVoucher = function(id) {
    if (!confirm(`⚠️ 确定要冲销凭证【${id}】吗？\n系统将自动生成一张红字凭证。`)) return;

    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    let item = list.find(v => v.id === id);

    if (item) {
        const stripRevSuffix = (value) => (value || "").toString().replace(/-REV.*$/i, "");
        const parseIdParts = (value) => {
            const base = stripRevSuffix(value);
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
        const generateReverseId = (listData, originalId) => {
            const parts = parseIdParts(originalId);
            if (!parts.width) return stripRevSuffix(originalId) || originalId;
            let maxSeq = parts.num || 0;
            listData.forEach(entry => {
                const base = stripRevSuffix(entry.id);
                if (!base.startsWith(parts.prefix)) return;
                const match = base.match(/^(.*?)(\d+)\s*$/);
                if (!match || match[1] !== parts.prefix) return;
                const num = parseInt(match[2], 10);
                if (Number.isFinite(num) && num > maxSeq) maxSeq = num;
            });
            const nextSeq = maxSeq + 1;
            const padded = String(nextSeq).padStart(parts.width, "0");
            return `${parts.prefix}${padded}`;
        };

        // 3.1 标记原凭证为已冲销
        item.status = "已冲销";

        // 3.2 生成红字凭证 (金额取反)
        let redVoucher = JSON.parse(JSON.stringify(item)); // 深拷贝
        redVoucher.id = generateReverseId(list, id);
        redVoucher.date = new Date().toISOString().split('T')[0];
        redVoucher.status = "已记账"; // 红冲凭证直接生效
        redVoucher.amount = -Math.abs(item.amount); // 负数金额
        redVoucher.summary = buildReverseSummary(item);
        redVoucher.isRed = true;
        redVoucher.reverseOf = id;
        
        // 处理分录中的金额取反
        if (redVoucher.lines) {
            redVoucher.lines.forEach(line => {
                if (line.debit) line.debit = -Math.abs(line.debit);
                if (line.credit) line.credit = -Math.abs(line.credit);
                if (line.summary !== undefined) line.summary = redVoucher.summary;
                if (line.digest !== undefined) line.digest = redVoucher.summary;
            });
        }

        list.unshift(redVoucher); // 插入到最前面
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));

        alert("✅ 冲销成功！已生成红字凭证。");
        loadContent('VoucherEntryReview');
    }
}

// 4. 反审核 (可选辅助功能)
window.unAuditVoucher = function(id) {
    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    let item = list.find(v => v.id === id);
    if (item) {
        item.status = "待审核";
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        loadContent('VoucherEntryReview');
    }
}

// 5. 删除凭证 (仅限待审核)
window.deleteVoucher = function(id) {
    if (!confirm("确定删除该凭证吗？")) return;
    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const newList = list.filter(v => v.id !== id);
    sessionStorage.setItem('ManualVouchers', JSON.stringify(newList));
    loadContent('VoucherEntryReview');
}


// ==========================================================
// 凭证审核与详情 - 修复版 (追加到 voucher.js 末尾)
// ==========================================================

/**
 * 1. 打开审核/详情弹窗 (修复了金额不显示的问题)
 */
window.openAuditModal = function(id) {
    const vouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const voucher = vouchers.find(v => v.id === id);
    
    if (!voucher) return alert("未找到凭证数据！");

    // A. 填充头部基本信息
    document.getElementById('modal_v_id').innerText = voucher.id;
    document.getElementById('modal_v_date').innerText = voucher.date;
    document.getElementById('modal_v_user').innerText = voucher.user || '录入员';
    
    // ★★★ 关键修复：把 ID 存入隐藏域，供按钮使用 ★★★
    document.getElementById('modal_current_id').value = voucher.id; 

    // B. 填充中间的分录表格 (Lines)
    const tbody = document.getElementById('modal_lines_tbody');
    let rowsHtml = '';
    let totalD = 0;
    let totalC = 0;

    // 优先读取 lines 数组，如果没有则尝试读取单行 amount
    let lines = voucher.lines || [];
    
    // 兼容逻辑：如果lines为空，但有总金额，说明是简易录入，自动构造一行
    if (lines.length === 0 && voucher.amount) {
        lines = [
            { digest: voucher.summary, account: "暂无科目明细", debit: voucher.amount, credit: 0 },
            { digest: voucher.summary, account: "自动平衡科目", debit: 0, credit: voucher.amount }
        ];
    }

    lines.forEach(line => {
        const d = parseFloat(line.debit || 0);
        const c = parseFloat(line.credit || 0);
        totalD += d;
        totalC += c;

        rowsHtml += `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:8px;">${line.digest || line.summary || voucher.summary || '-'}</td>
                <td style="padding:8px;">${line.account || line.subject || '未指定科目'}</td>
                <td style="padding:8px; text-align:right; font-weight:bold; color:${d>0?'#27ae60':'#ccc'}">${d > 0 ? d.toLocaleString() : ''}</td>
                <td style="padding:8px; text-align:right; font-weight:bold; color:${c>0?'#e74c3c':'#ccc'}">${c > 0 ? c.toLocaleString() : ''}</td>
            </tr>
        `;
    });

    tbody.innerHTML = rowsHtml;
    
    // C. 更新底部合计
    document.getElementById('modal_total_debit').innerText = totalD.toLocaleString();
    document.getElementById('modal_total_credit').innerText = totalC.toLocaleString();

    // D. 控制按钮显示 (如果已经审核过了，就隐藏审核按钮)
    const btnGroup = document.getElementById('audit-btn-group');
    if (btnGroup) {
        if (voucher.status === '待审核') {
            btnGroup.style.display = 'block'; // 显示审核按钮
        } else {
            btnGroup.style.display = 'none';  // 纯查看模式
        }
    }

    // 显示弹窗
    document.getElementById('auditDetailModal').style.display = 'block';
}

/**
 * 2. 执行审核通过 (修复了点击没反应的问题)
 */
window.performAuditPass = function() {
    // 获取隐藏域里的 ID
    const id = document.getElementById('modal_current_id').value;
    if(!id) return alert("系统错误：无法获取凭证ID");

    if(!confirm("确认审核通过吗？\n状态将变更为【已审核】。")) return;

    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    let item = list.find(v => v.id === id);
    
    if(item) {
        item.status = "已审核"; // 变更状态
        item.auditTime = new Date().toLocaleString();
        
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        
        alert("✅ 审核成功！");
        document.getElementById('auditDetailModal').style.display = 'none';
        
        // ★★★ 强制刷新列表 ★★★
        if(typeof loadContent === 'function') {
            loadContent('FinanceVoucherAudit'); 
        } else {
            location.reload();
        }
    } else {
        alert("未找到该凭证，可能已被删除。");
    }
}

/**
 * 3. 执行驳回
 */
window.performAuditReject = function() {
    const id = document.getElementById('modal_current_id').value;
    const reason = prompt("请输入驳回原因：");
    if(!reason) return;

    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    let item = list.find(v => v.id === id);
    
    if(item) {
        item.status = "已驳回"; // 状态变更
        item.rejectReason = reason;
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        
        alert("🚫 已驳回。");
        document.getElementById('auditDetailModal').style.display = 'none';
        loadContent('FinanceVoucherAudit');
    }
}

// 4. 冲销 (Reverse/Red-Ink) - 生成红字凭证
window.reverseVoucher = function(id) {
    if(!confirm(`⚠️ 确定要冲销凭证【${id}】吗？\n\n系统将：\n1. 将原凭证标记为“已冲销”\n2. 自动生成一张负数金额的红字凭证`)) return;

    let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    let item = list.find(v => v.id === id);

    if (item) {
        const stripRevSuffix = (value) => (value || "").toString().replace(/-REV.*$/i, "");
        const parseIdParts = (value) => {
            const base = stripRevSuffix(value);
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
        const generateReverseId = (listData, originalId) => {
            const parts = parseIdParts(originalId);
            if (!parts.width) return stripRevSuffix(originalId) || originalId;
            let maxSeq = parts.num || 0;
            listData.forEach(entry => {
                const base = stripRevSuffix(entry.id);
                if (!base.startsWith(parts.prefix)) return;
                const match = base.match(/^(.*?)(\d+)\s*$/);
                if (!match || match[1] !== parts.prefix) return;
                const num = parseInt(match[2], 10);
                if (Number.isFinite(num) && num > maxSeq) maxSeq = num;
            });
            const nextSeq = maxSeq + 1;
            const padded = String(nextSeq).padStart(parts.width, "0");
            return `${parts.prefix}${padded}`;
        };

        // 1. 标记旧凭证
        item.status = "已冲销";
        
        // 2. 生成红字凭证 (完全复制，金额取反)
        let redVoucher = JSON.parse(JSON.stringify(item)); // 深拷贝
        redVoucher.id = generateReverseId(list, id);
        redVoucher.date = new Date().toISOString().split('T')[0];
        redVoucher.status = "已过账"; // 红字凭证直接生效
        redVoucher.summary = buildReverseSummary(item);
        redVoucher.amount = -Math.abs(item.amount); // 总金额变负数
        redVoucher.isRed = true;
        redVoucher.reverseOf = id;
        
        // 分录金额也要变负数
        if(redVoucher.lines) {
            redVoucher.lines.forEach(line => {
                if(line.debit) line.debit = -Math.abs(line.debit);
                if(line.credit) line.credit = -Math.abs(line.credit);
                if (line.summary !== undefined) line.summary = redVoucher.summary;
                if (line.digest !== undefined) line.digest = redVoucher.summary;
            });
        }

        // 插入新数据
        list.unshift(redVoucher);
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));

        alert("✅ 冲销成功！");
        loadContent('FinanceVoucherAudit'); // 刷新列表，你会看到旧的变灰，新的变红
    }
}


// ============================================
// ★★★ 全局跳转函数：打开凭证详情页 ★★★
// ============================================
window.openVoucherDetail = function(id) {
    // 1. 设置全局变量，告诉详情页我们要看哪张单子
    window.g_currentVoucher = { id: id };
    
    // 2. 存入 SessionStorage 作为备份 (防止刷新页面后数据丢失)
    // 这是一个优化，防止用户在详情页按 F5 刷新后变空白
    sessionStorage.setItem('CurrentVoucherId', id);

    // 3. 切换页面
    if (typeof loadContent === 'function') {
        loadContent('VoucherDetail');
    } else {
        alert("系统错误：loadContent 函数未定义");
    }
}
// 优先读全局变量，读不到就读 Session 缓存
let currentId = (window.g_currentVoucher && window.g_currentVoucher.id) 
                || sessionStorage.getItem('CurrentVoucherId');

let v = { id: currentId || "无数据" };
