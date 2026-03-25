/**
 * 期末处理模块组 (Period End Processing Modules) - 终极修复版
 */

(function() {
    if (!window.VM_MODULES) window.VM_MODULES = {};

    // ── 工具函数 ──────────────────────────────────────────────────
    const lsGet = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch(e){return null;} };
    const lsSet = (k,v) => { localStorage.setItem(k, JSON.stringify(v)); };
    const fmt = (n) => (parseFloat(n) || 0).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});

    // 默认方案数据 (防止页面显示为空)
    function getFactoryDefaultSchemes() {
        return [
            { 
                id: 's-1', name: '计提税金及附加', ledger: '总账', word: '转', status: '启用', lastPeriod: '-', 
                summary: '计提本期城建税、教育费附加、地方教育附加',
                lines: [
                    { digest: '城市维护建设税', baseCode: '2221', ratio: 7, debitName: '6403 税金及附加', creditName: '222102 应交城市维护建设税', aux: '项目' },
                    { digest: '教育附加',       baseCode: '2221', ratio: 3, debitName: '6403 税金及附加', creditName: '222103 应交教育费附加', aux: '项目' },
                    { digest: '地方教育附加',   baseCode: '2221', ratio: 2, debitName: '6403 税金及附加', creditName: '222104 应交地方教育附加', aux: '项目' }
                ]
            },
            {
                id: 's-2', name: '管理费用期末结转', ledger: '管理账', word: '转', status: '禁用', lastPeriod: '-',
                summary: '管理费用月末结转',
                lines: [
                    { digest: '结转管理费用', baseCode: '6602', ratio: 100, debitName: '本年利润', creditName: '管理费用', aux: '' }
                ]
            }
        ];
    }

    // 核心数据抓取：解决 file:// 协议隔离
    function fetchAllVouchers() {
        let list = [];
        try {
            if (typeof window.getManualVouchers === 'function') list = window.getManualVouchers();
            else if (window.parent && typeof window.parent.getManualVouchers === 'function') list = window.parent.getManualVouchers();
            else list = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        } catch(e) { console.error("数据读取失败:", e); }
        return Array.isArray(list) ? list : [];
    }

    function getStepDone(period, key) {
        const doneMap = lsGet('QM_StepsDone') || {};
        return !!(doneMap[period] && doneMap[period][key]);
    }

    // =========================================================================
    // 1. 期末处理中心
    // =========================================================================
    window.VM_MODULES['PeriodEndCenter'] = function(contentArea) {
        const period = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0,7);
        const STEPS = [
            { key: 'autoTransfer', label: '自动转账', icon: '🔄', desc: '自定义计提/转账方案，批量生成凭证', url: 'AutoTransferTax' },
            { key: 'amort',        label: '凭证摊销', icon: '📉', desc: '根据预摊销计划，自动生成本期摊销凭证', url: '#' },
            { key: 'accrue',       label: '凭证预提', icon: '📋', desc: '执行月度预提方案，计提本期各项费用', url: '#' },
            { key: 'adjust',       label: '账务调整', icon: '🔀', desc: '期末往来对冲、重分类、坏账准备计提', url: '#' },
            { key: 'profit',       label: '结转损益', icon: '⚖️', desc: '将损益科目余额结转至本年利润科目', url: 'ClosingWizardProfit' },
            { key: 'close',        label: '总账结账', icon: '🔒', desc: '完成最终结账，锁定本期账务数据', url: 'ClosingWizardClose' },
        ];
        let currentIdx = STEPS.findIndex(s => !getStepDone(period, s.key));
        if (currentIdx === -1) currentIdx = STEPS.length;

        contentArea.innerHTML = `
        <div style="padding:30px; max-width:1200px; margin:0 auto; font-family:sans-serif;">
            <div style="background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:30px; display:flex; justify-content:space-between; align-items:center;">
                <h2 style="font-size:20px; font-weight:800; border-left:5px solid #3182ce; padding-left:15px;">期末结账工作台</h2>
                <span style="background:#3182ce; color:#fff; padding:5px 15px; border-radius:20px; font-size:13px; font-weight:700;">期间: ${period}</span>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:25px;">
                ${STEPS.map((s, i) => {
                    const isDone = getStepDone(period, s.key);
                    return `
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:25px; cursor:pointer;" onclick="loadContent('${s.url}')">
                        <div style="font-size:36px; margin-bottom:15px;">${s.icon}</div>
                        <h3 style="font-size:17px; margin-bottom:10px;">${s.label}</h3>
                        <p style="font-size:13px; color:#718096; line-height:1.5;">${s.desc}</p>
                        <div style="margin-top:20px; text-align:right;">
                            <button style="background:${isDone?'#48bb78':'#3182ce'}; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-weight:700; cursor:pointer;">${isDone?'查看':'进入'} →</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </div>`;
    };

    // =========================================================================
    // 2. 自动转账 - 修复方案丢失问题
    // =========================================================================
    window.VM_MODULES['AutoTransferTax'] = function(contentArea) {
        // 始终以本机当前年月为准，避免 QM_CurrentPeriod 停留在历史期间导致余额读取为0
        const nowPeriod = new Date().toISOString().slice(0, 7); // "YYYY-MM"
        const storedPeriod = lsGet('QM_CurrentPeriod');
        // 若存储值比当前月更旧或缺失，则更新为当前月
        const period = (storedPeriod && storedPeriod >= nowPeriod) ? storedPeriod : nowPeriod;
        if (period !== storedPeriod) lsSet('QM_CurrentPeriod', period);
        // 如果读不到数据，则初始化默认方案；同时迁移旧版方案（debitName 缺少科目代码）
        let schemes = lsGet('QM_AdvancedSchemes');
        if (!schemes || schemes.length === 0) {
            schemes = getFactoryDefaultSchemes();
            lsSet('QM_AdvancedSchemes', schemes);
        } else {
            // 迁移：旧版 debitName 没有科目代码，补充 6403
            let migrated = false;
            schemes.forEach(s => {
                (s.lines || []).forEach(l => {
                    if (l.debitName === '税金及附加') { l.debitName = '6403 税金及附加'; migrated = true; }
                    if (l.baseCode === '222101') { l.baseCode = '2221'; migrated = true; }
                });
            });
            if (migrated) lsSet('QM_AdvancedSchemes', schemes);
        }
        const editingId = lsGet('QM_At_EditingId') || null;

        function getBal(baseCode, filterPeriod) {
            const allV = fetchAllVouchers();
            const prefix = baseCode.toString().replace(/\D/g, '');
            if (!prefix) return { net: 0 };

            const validStatuses = ['已记账', '已过账', '已审核', '待审核'];

            function calcNet(vList) {
                let d = 0, c = 0;
                vList.forEach(v => {
                    if (!validStatuses.includes(v.status)) return;
                    (v.lines||[]).forEach(l => {
                        const raw = (l.accountCode || l.account || '').toString().trim().split(/[\s\u3000]/)[0];
                        const lCode = raw.replace(/\D/g, '');
                        if (!lCode) return;
                        // 双向匹配：子科目 或 父科目（≥4位防过宽）
                        const isMatch = lCode.startsWith(prefix) || (lCode.length >= 4 && prefix.startsWith(lCode));
                        if (isMatch) {
                            d += parseFloat((l.debit||'0').toString().replace(/,/g,'')) || 0;
                            c += parseFloat((l.credit||'0').toString().replace(/,/g,'')) || 0;
                        }
                    });
                });
                return Math.max(c - d, 0);
            }

            // 先按期间过滤
            const targetPeriod = filterPeriod || period;
            const periodV = allV.filter(v => {
                const vP = (v.period || (v.date||'').substring(0,7) || '').substring(0,7);
                return vP === targetPeriod;
            });
            const netWithPeriod = calcNet(periodV);
            if (netWithPeriod > 0) return { net: netWithPeriod };

            // 回退：不限期间（防止期间标记不一致导致永远找不到）
            const netAll = calcNet(allV);
            return { net: netAll };
        }

        // 从 "222102 应交城市维护建设税" 中提取科目代码（首段纯数字）
        function extractAcctCode(nameStr) {
            const first = (nameStr || '').toString().trim().split(/\s+/)[0];
            return /^\d+$/.test(first) ? first : '';
        }

        contentArea.innerHTML = `
        <style>
            .at-main { padding:24px; background:#f8fafc; min-height:100%; font-family:sans-serif; }
            .btn-at { padding:8px 16px; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer; border:1px solid #dcdfe6; background:#fff; margin-right:8px; }
            .at-input { border:1px solid #dcdfe6; border-radius:4px; padding:6px 10px; font-size:13px; }
            .at-table { width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.05); }
            .at-table th { background:#f5f7fa; padding:12px; text-align:left; color:#909399; font-size:13px; border-bottom:1px solid #ebeef5; }
            .at-table td { padding:12px; border-bottom:1px solid #ebeef5; font-size:13px; color:#606266; }
        </style>
        <div class="at-main">
            <div style="margin-bottom:15px; display:flex; align-items:center; gap:16px;">
                <button onclick="loadContent('PeriodEndCenter')" style="background:none; border:none; color:#409eff; cursor:pointer; font-weight:700;">← 返回工作台</button>
                <span style="background:#e6f1fc; color:#3182ce; padding:4px 14px; border-radius:20px; font-size:13px; font-weight:700;">当前期间: ${period}</span>
            </div>
            <div style="margin-bottom:20px;">
                <button class="btn-at" style="background:#409eff; color:#fff;" onclick="window.atAddScheme()">+ 新增方案</button>
                <button class="btn-at" style="background:#67c23a; color:#fff;" onclick="window.atRunBatch()">▶ 执行方案</button>
                <button class="btn-at" onclick="window.atToggleStatus()">禁/启用</button>
                <button class="btn-at" style="color:#f56c6c;" onclick="window.atDelSelected()">删除</button>
            </div>
            <table class="at-table">
                <thead>
                    <tr>
                        <th style="width:40px;"><input type="checkbox" id="at-master-cb" onclick="window.atCheckAll(this.checked)"></th>
                        <th>方案名称</th><th style="width:100px;">账簿</th><th style="width:80px;">凭证字</th><th style="width:80px;">状态</th><th style="width:120px;">上次执行</th><th style="width:100px;">操作</th>
                    </tr>
                </thead>
                <tbody>
                    ${schemes.map(s => {
                        const active = editingId === s.id;
                        return `
                        <tr>
                            <td><input type="checkbox" class="at-cb" data-id="${s.id}"></td>
                            <td style="color:#409eff; font-weight:700; cursor:pointer;" onclick="window.atEdit('${s.id}')">${s.name} ${active?'▲':'▼'}</td>
                            <td>${s.ledger || '总账'}</td><td>${s.word || '转'}</td>
                            <td><span style="color:${s.status==='启用'?'#67c23a':'#f56c6c'}">${s.status || '启用'}</span></td>
                            <td>${s.lastPeriod || '-'}</td>
                            <td><a href="javascript:;" onclick="window.atEdit('${s.id}')" style="color:#409eff;">编辑</a></td>
                        </tr>
                        ${active ? `
                        <tr>
                            <td colspan="7" style="background:#f0f7ff; padding:25px;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                                    <div style="font-weight:800; color:#409eff; border-left:3px solid #409eff; padding-left:12px;">方案配置 — ${s.name}</div>
                                    <div style="display:flex; gap:10px;">
                                        <button class="btn-at" onclick="window.atAddLine()">+ 添加分录</button>
                                        <button class="btn-at" onclick="window.atEdit(null)">取消</button>
                                        <button class="btn-at" style="background:#409eff; color:#fff; border:none;" onclick="window.atSave('${s.id}')">💾 保存配置</button>
                                    </div>
                                </div>
                                <div style="display:flex; gap:35px; margin-bottom:20px; align-items:center;">
                                    <div style="display:flex; align-items:center; gap:8px;"><span style="font-size:13px; color:#606266;">名称:</span><input class="at-input" id="cfg-name" value="${s.name}" style="width:160px;"></div>
                                    <div style="display:flex; align-items:center; gap:8px; flex:1;"><span style="font-size:13px; color:#606266;">摘要:</span><input class="at-input" id="cfg-sum" value="${s.summary || ''}" style="width:100%; max-width:400px;"></div>
                                    <div style="display:flex; align-items:center; gap:8px;"><span style="font-size:13px; color:#606266;">账簿:</span><select class="at-input" id="cfg-led"><option value="总账" ${s.ledger==='总账'?'selected':''}>总账</option><option value="税务账" ${s.ledger==='税务账'?'selected':''}>税务账</option></select></div>
                                    <div style="display:flex; align-items:center; gap:8px;"><span style="font-size:13px; color:#606266;">字:</span><select class="at-input" id="cfg-word"><option value="转">转</option><option value="记">记</option></select></div>
                                </div>
                                <table class="at-table" style="box-shadow:none; border:1px solid #d9ecff;">
                                    <thead><tr style="background:#e6f1fc;"><th>摘要名称</th><th style="width:180px;">计算基数科目</th><th style="width:80px;">比例(%)</th><th style="width:180px;">借方科目</th><th style="width:180px;">贷方科目</th><th>辅助项</th><th style="width:40px;"></th></tr></thead>
                                    <tbody id="cfg-body">
                                        ${(s.lines||[]).map(l => {
                                            const bal = getBal(l.baseCode);
                                            return `
                                            <tr>
                                                <td><input class="at-input" style="width:100%;" name="l-digest" value="${l.digest}"></td>
                                                <td><input class="at-input" style="width:100%;" name="l-base" value="${l.baseCode}" title="当前余额: ¥${fmt(bal.net)}"></td>
                                                <td><input class="at-input" style="width:100%;" name="l-ratio" type="number" value="${l.ratio}"></td>
                                                <td><input class="at-input" style="width:100%;" name="l-debit" value="${l.debitName || ''}"></td>
                                                <td><input class="at-input" style="width:100%;" name="l-credit" value="${l.creditName || ''}"></td>
                                                <td><input class="at-input" style="width:100%;" name="l-aux" value="${l.aux||''}"></td>
                                                <td><button onclick="this.closest('tr').remove()" style="color:#f56c6c; border:none; background:none; cursor:pointer;">×</button></td>
                                            </tr>`;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </td>
                        </tr>` : ''}
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>`;

        // ── 交互函数 ──
        window.atEdit = (id) => { lsSet('QM_At_EditingId', id); loadContent('AutoTransferTax'); };
        window.atCheckAll = (c) => document.querySelectorAll('.at-cb').forEach(x => x.checked = c);
        
        window.atAddScheme = () => {
            const list = lsGet('QM_AdvancedSchemes') || [];
            const newS = { id: 's-'+Date.now(), name:'新方案', status:'启用', ledger:'总账', word:'转', lines:[] };
            list.push(newS); lsSet('QM_AdvancedSchemes', list); window.atEdit(newS.id);
        };

        window.atSave = (id) => {
            const list = lsGet('QM_AdvancedSchemes') || [];
            const s = list.find(x => x.id === id);
            if(!s) return;
            s.name = document.getElementById('cfg-name').value;
            s.summary = document.getElementById('cfg-sum').value;
            s.ledger = document.getElementById('cfg-led').value;
            s.word = document.getElementById('cfg-word').value;
            const rows = document.querySelectorAll('#cfg-body tr');
            s.lines = Array.from(rows).map(r => ({
                digest: r.querySelector('[name="l-digest"]').value,
                baseCode: r.querySelector('[name="l-base"]').value,
                ratio: parseFloat(r.querySelector('[name="l-ratio"]').value) || 0,
                debitName: r.querySelector('[name="l-debit"]').value,
                creditName: r.querySelector('[name="l-credit"]').value,
                aux: r.querySelector('[name="l-aux"]').value
            }));
            lsSet('QM_AdvancedSchemes', list); alert('✅ 保存成功'); window.atEdit(null);
        };

        window.atRunBatch = () => {
            const ids = Array.from(document.querySelectorAll('.at-cb:checked')).map(cb => cb.dataset.id);
            if(!ids.length) return alert('请先勾选方案');
            const list = lsGet('QM_AdvancedSchemes') || [];
            const currentVouchers = fetchAllVouchers();
            let count = 0;

            ids.forEach(id => {
                const s = list.find(x => x.id === id);
                if(!s || s.status === '禁用') return;
                // 借方合并：相同科目代码只生成一行（一借多贷）
                const debitMerge = new Map(); // accountCode → { name, total }
                const creditLines = [];
                let total = 0;
                s.lines.forEach(l => {
                    const bal = getBal(l.baseCode);
                    const amt = Math.round(bal.net * (l.ratio / 100) * 100) / 100;
                    if(amt <= 0) return;
                    total += amt;
                    // 借方
                    const dCode = extractAcctCode(l.debitName);
                    const dKey = dCode || ('__' + l.debitName);
                    if(!debitMerge.has(dKey)) debitMerge.set(dKey, { code: dCode, name: l.debitName, total: 0 });
                    debitMerge.get(dKey).total += amt;
                    // 贷方
                    const cCode = extractAcctCode(l.creditName);
                    const cDisplay = cCode ? l.creditName : l.creditName; // 保留原始名称
                    creditLines.push({
                        summary: l.digest,
                        accountCode: cCode,
                        account: l.creditName,
                        debit: '', credit: amt.toFixed(2)
                    });
                });
                if(total <= 0) return;
                const vLines = [];
                debitMerge.forEach(v => {
                    vLines.push({ summary: '计提税金及附加', accountCode: v.code, account: v.name, debit: v.total.toFixed(2), credit: '' });
                });
                creditLines.forEach(l => vLines.push(l));

                const max = Math.max(0, ...currentVouchers.filter(v => v.id?.startsWith('转-')).map(v => parseInt(v.id.split('-')[1]) || 0));
                const newId = '转-' + String(max + 1).padStart(4, '0');
                currentVouchers.unshift({
                    id: newId, date: period + '-28', period: period, amount: total.toFixed(2),
                    summary: s.summary || s.name, user: '系统自动转账', status: '待审核', lines: vLines
                });
                s.lastPeriod = period; count++;
            });

            if(count > 0) {
                // 优先用工具函数写入，确保主页面 sessionStorage 同步
                if (typeof window.saveManualVouchers === 'function') {
                    window.saveManualVouchers(currentVouchers);
                } else {
                    sessionStorage.setItem("ManualVouchers", JSON.stringify(currentVouchers));
                }
                lsSet('QM_AdvancedSchemes', list);
                const steps = lsGet('QM_StepsDone') || {};
                if (!steps[period]) steps[period] = {};
                steps[period].autoTransfer = true; lsSet('QM_StepsDone', steps);
                alert(`🎉 成功生成 ${count} 笔凭证！`); loadContent('AutoTransferTax');
            } else alert('⚠️ 选中方案余额为 0，未生成凭证。');
        };

        window.atToggleStatus = () => {
            const ids = Array.from(document.querySelectorAll('.at-cb:checked')).map(cb => cb.dataset.id);
            if(!ids.length) return alert('请勾选');
            const list = lsGet('QM_AdvancedSchemes') || [];
            list.forEach(s => { if(ids.includes(s.id)) s.status = (s.status==='启用'?'禁用':'启用'); });
            lsSet('QM_AdvancedSchemes', list); loadContent('AutoTransferTax');
        };

        window.atDelSelected = () => {
            const ids = Array.from(document.querySelectorAll('.at-cb:checked')).map(cb => cb.dataset.id);
            if(!ids.length || !confirm('确定删除？')) return;
            const list = (lsGet('QM_AdvancedSchemes') || []).filter(s => !ids.includes(s.id));
            lsSet('QM_AdvancedSchemes', list); loadContent('AutoTransferTax');
        };

        window.atAddLine = () => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td><input class="at-input" style="width:100%;" name="l-digest"></td><td><input class="at-input" style="width:100%;" name="l-base" value="222101"></td><td><input class="at-input" style="width:100%;" name="l-ratio" value="100"></td><td><input class="at-input" style="width:100%;" name="l-debit"></td><td><input class="at-input" style="width:100%;" name="l-credit"></td><td><input class="at-input" style="width:100%;" name="l-aux"></td><td><button onclick="this.closest('tr').remove()" style="color:#f56c6c; border:none; background:none; cursor:pointer;">×</button></td>`;
            document.getElementById('cfg-body').appendChild(tr);
        };
    };

    // =========================================================================
    // 3. 结转损益向导 (ClosingWizardProfit)
    // =========================================================================
    window.VM_MODULES['ClosingWizardProfit'] = function(contentArea) {
        const period = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0,7);

        // 获取会计准则，决定"本年利润"科目代码
        const std = (localStorage.getItem('AccountingStandard') || 'enterprise');
        const profitCode = std === 'enterprise' ? '4103' : '3103';

        // 默认模板：收入科目 & 成本费用科目
        function getDefaultTpl() {
            return {
                income: [{ id: 'i1', ledger: '', codes: '5001,6001,6002,6051,6101,6111,6301,6302', targetCode: profitCode, word: '转' }],
                cost:   [{ id: 'c1', ledger: '', codes: '6401,6402,6403,6601,6602,6603,6701,6711,6801', targetCode: profitCode, word: '转' }]
            };
        }
        let tpl = lsGet('QM_ProfitTpl') || getDefaultTpl();
        if (!tpl.income) tpl.income = getDefaultTpl().income;
        if (!tpl.cost)   tpl.cost   = getDefaultTpl().cost;

        // 从 sessionStorage 读取科目名称，找不到时从已有凭证行中反查
        function getSubjectName(code) {
            const codeStr = code.toString().trim();
            try {
                const subjects = JSON.parse(sessionStorage.getItem('AcctSubjects') || '[]');
                const found = subjects.find(s => (s.code||'').toString().trim() === codeStr);
                if (found && found.name) return found.name;
            } catch(e) {}
            // 兜底：从已有凭证行的 account 字段中反查名称
            try {
                for (const v of fetchAllVouchers()) {
                    for (const l of (v.lines || [])) {
                        const lc = (l.accountCode || '').toString().trim();
                        if (lc === codeStr) {
                            const parts = (l.account || '').toString().trim().split(/\s+/);
                            if (parts.length >= 2) return parts.slice(1).join(' ');
                        }
                    }
                }
            } catch(e) {}
            return '';
        }

        // 计算某科目本期净余额（debit方向或credit方向）
        function getPeriodBalance(code) {
            const allV = fetchAllVouchers();
            let d = 0, c = 0;
            const prefix = code.toString().trim().replace(/\D/g, '');
            allV.forEach(v => {
                const vP = v.period || (v.date||'').substring(0,7);
                if (vP !== period) return;
                if (!['已记账','已过账','已审核','待审核'].includes(v.status)) return;
                (v.lines||[]).forEach(l => {
                    const raw = (l.accountCode||l.account||'').toString().trim().split(/[\s\u3000]/)[0].replace(/\D/g,'');
                    if (!raw) return;
                    if (raw.startsWith(prefix) || (raw.length >= 4 && prefix.startsWith(raw))) {
                        d += parseFloat((l.debit||'0').toString().replace(/,/g,'')) || 0;
                        c += parseFloat((l.credit||'0').toString().replace(/,/g,'')) || 0;
                    }
                });
            });
            return { debit: d, credit: c, netCredit: c - d, netDebit: d - c };
        }

        // 渲染模板行
        function renderRows(arr, type) {
            if (!arr.length) return `<tr><td colspan="6" style="text-align:center;color:#aaa;padding:12px;">暂无配置，点击"+ 新增"添加</td></tr>`;
            return arr.map((r, i) => `
            <tr data-id="${r.id}" data-type="${type}">
                <td style="text-align:center;">${i+1}</td>
                <td><select class="cw-sel" onchange="window.cwUpdateField('${type}','${r.id}','ledger',this.value)">
                    <option value="">-请选择-</option>
                    <option value="总账" ${r.ledger==='总账'?'selected':''}>总账</option>
                </select></td>
                <td><input class="cw-inp" style="width:100%;" value="${r.codes}" onchange="window.cwUpdateField('${type}','${r.id}','codes',this.value)" placeholder="如: 6001,6002,6301"></td>
                <td><select class="cw-sel" onchange="window.cwUpdateField('${type}','${r.id}','targetCode',this.value)">
                    <option value="">-请选择-</option>
                    <option value="4103" ${r.targetCode==='4103'?'selected':''}>4103 本年利润</option>
                    <option value="3103" ${r.targetCode==='3103'?'selected':''}>3103 本年利润</option>
                </select></td>
                <td><select class="cw-sel" onchange="window.cwUpdateField('${type}','${r.id}','word',this.value)">
                    <option value="转" ${r.word==='转'?'selected':''}>转</option>
                    <option value="记" ${r.word==='记'?'selected':''}>记</option>
                </select></td>
                <td><button onclick="window.cwDelRow('${type}','${r.id}')" style="color:#ef4444;background:none;border:none;cursor:pointer;font-weight:700;">删除</button></td>
            </tr>`).join('');
        }

        contentArea.innerHTML = `
        <style>
            .cw-wrap { padding:24px; background:#f8fafc; min-height:100%; font-family:sans-serif; }
            .cw-card { background:#fff; border-radius:10px; border:1px solid #e5e7eb; margin-bottom:20px; overflow:hidden; }
            .cw-card-head { padding:14px 20px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center; background:#f9fafb; }
            .cw-card-head h3 { font-size:14px; font-weight:700; color:#111827; }
            .cw-table { width:100%; border-collapse:collapse; font-size:13px; }
            .cw-table th { padding:10px 12px; text-align:left; background:#f9fafb; color:#6b7280; font-weight:600; border-bottom:1px solid #e5e7eb; white-space:nowrap; }
            .cw-table td { padding:10px 12px; border-bottom:1px solid #f3f4f6; vertical-align:middle; }
            .cw-table tr:last-child td { border-bottom:none; }
            .cw-inp { border:1px solid #d1d5db; border-radius:5px; padding:6px 8px; font-size:13px; }
            .cw-sel { border:1px solid #d1d5db; border-radius:5px; padding:6px 8px; font-size:13px; }
            .cw-btn { padding:7px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; border:none; }
        </style>
        <div class="cw-wrap">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div>
                    <button onclick="loadContent('PeriodEndCenter')" style="background:none;border:none;color:#3b82f6;cursor:pointer;font-size:13px;">← 返回工作台</button>
                    <span style="font-size:18px; font-weight:800; color:#111827; margin-left:12px;">结转损益配置</span>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <span style="background:#dbeafe;color:#1d4ed8;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:700;">期间: ${period}</span>
                    <button class="cw-btn" style="background:#2563eb;color:#fff;" onclick="window.cwExecute()">▶ 执行损益结转</button>
                </div>
            </div>

            <!-- 结转收入 -->
            <div class="cw-card">
                <div class="cw-card-head">
                    <h3>② 结转收入</h3>
                    <div style="display:flex;gap:8px;">
                        <button class="cw-btn" style="background:#fff;border:1px solid #d1d5db;" onclick="window.cwSave()">保存</button>
                        <button class="cw-btn" style="background:#2563eb;color:#fff;" onclick="window.cwAddRow('income')">+ 新增</button>
                    </div>
                </div>
                <table class="cw-table">
                    <thead><tr><th style="width:50px;">序号</th><th style="width:110px;">账套</th><th>收入科目范围</th><th style="width:160px;">转入科目</th><th style="width:70px;">凭证字</th><th style="width:60px;">操作</th></tr></thead>
                    <tbody id="cw-income-body">${renderRows(tpl.income, 'income')}</tbody>
                </table>
            </div>

            <!-- 结转成本费用 -->
            <div class="cw-card">
                <div class="cw-card-head">
                    <h3>③ 结转成本费用</h3>
                    <div style="display:flex;gap:8px;">
                        <button class="cw-btn" style="background:#fff;border:1px solid #d1d5db;" onclick="window.cwSave()">保存</button>
                        <button class="cw-btn" style="background:#2563eb;color:#fff;" onclick="window.cwAddRow('cost')">+ 新增</button>
                    </div>
                </div>
                <table class="cw-table">
                    <thead><tr><th style="width:50px;">序号</th><th style="width:110px;">账套</th><th>成本费用科目范围</th><th style="width:160px;">转入科目</th><th style="width:70px;">凭证字</th><th style="width:60px;">操作</th></tr></thead>
                    <tbody id="cw-cost-body">${renderRows(tpl.cost, 'cost')}</tbody>
                </table>
            </div>

            <!-- 执行预览区 -->
            <div class="cw-card" id="cw-preview-card" style="display:none;">
                <div class="cw-card-head"><h3>④ 待生成凭证预览</h3></div>
                <div id="cw-preview-body" style="padding:16px;"></div>
            </div>
        </div>`;

        // ── 更新字段 ──
        window.cwUpdateField = function(type, id, field, val) {
            const arr = type === 'income' ? tpl.income : tpl.cost;
            const row = arr.find(r => r.id === id);
            if (row) row[field] = val;
        };

        // ── 新增行 ──
        window.cwAddRow = function(type) {
            const newId = (type==='income'?'i':'c') + Date.now();
            const arr = type === 'income' ? tpl.income : tpl.cost;
            arr.push({ id: newId, ledger: '', codes: '', targetCode: profitCode, word: '转' });
            lsSet('QM_ProfitTpl', tpl);
            loadContent('ClosingWizardProfit');
        };

        // ── 删除行 ──
        window.cwDelRow = function(type, id) {
            if (type === 'income') tpl.income = tpl.income.filter(r => r.id !== id);
            else tpl.cost = tpl.cost.filter(r => r.id !== id);
            lsSet('QM_ProfitTpl', tpl);
            loadContent('ClosingWizardProfit');
        };

        // ── 保存模板 ──
        window.cwSave = function() {
            lsSet('QM_ProfitTpl', tpl);
            alert('✅ 模板已保存');
        };

        // ── 执行损益结转 ──
        window.cwExecute = function() {
            lsSet('QM_ProfitTpl', tpl);
            const allVouchers = fetchAllVouchers();
            const maxSeq = Math.max(0, ...allVouchers.filter(v => (v.id||'').startsWith('转-')).map(v => parseInt((v.id||'').split('-')[1])||0));
            let nextSeq = maxSeq;
            const newVouchers = [];
            const previewLines = [];

            // ── 处理收入结转（借：收入科目，贷：本年利润）──
            tpl.income.forEach(row => {
                if (!row.codes || !row.targetCode) return;
                const codes = row.codes.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean);
                const entryLines = [];
                let total = 0;
                codes.forEach(code => {
                    const bal = getPeriodBalance(code);
                    const amt = Math.round(bal.netCredit * 100) / 100;
                    if (amt <= 0) return;
                    const name = getSubjectName(code);
                    entryLines.push({ summary: `结转${name||code}`, accountCode: code, account: name ? `${code} ${name}` : code, debit: amt.toFixed(2), credit: '' });
                    previewLines.push({ summary: `结转${name||code}`, code, name, debit: amt.toFixed(2), credit: '' });
                    total += amt;
                });
                if (entryLines.length > 0) {
                    const tName = getSubjectName(row.targetCode);
                    entryLines.push({ summary: '结转本期收入', accountCode: row.targetCode, account: tName ? `${row.targetCode} ${tName}` : row.targetCode, debit: '', credit: total.toFixed(2) });
                    previewLines.push({ summary: '结转本期收入', code: row.targetCode, name: tName, debit: '', credit: total.toFixed(2) });
                    nextSeq++;
                    newVouchers.push({ id: `转-${String(nextSeq).padStart(4,'0')}`, date: `${period}-28`, period, amount: total.toFixed(2), summary: '结转本期收入', user: '期末结转(系统)', status: '待审核', lines: entryLines });
                }
            });

            // ── 处理成本费用结转（借：本年利润，贷：成本费用科目）──
            tpl.cost.forEach(row => {
                if (!row.codes || !row.targetCode) return;
                const codes = row.codes.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean);
                const entryLines = [];
                let total = 0;
                codes.forEach(code => {
                    const bal = getPeriodBalance(code);
                    const amt = Math.round(bal.netDebit * 100) / 100;
                    if (amt <= 0) return;
                    const name = getSubjectName(code);
                    entryLines.push({ summary: `结转${name||code}`, accountCode: code, account: name ? `${code} ${name}` : code, debit: '', credit: amt.toFixed(2) });
                    previewLines.push({ summary: `结转${name||code}`, code, name, debit: '', credit: amt.toFixed(2) });
                    total += amt;
                });
                if (entryLines.length > 0) {
                    const tName = getSubjectName(row.targetCode);
                    entryLines.unshift({ summary: '结转本期成本费用', accountCode: row.targetCode, account: tName ? `${row.targetCode} ${tName}` : row.targetCode, debit: total.toFixed(2), credit: '' });
                    previewLines.unshift({ summary: '结转本期成本费用', code: row.targetCode, name: tName, debit: total.toFixed(2), credit: '' });
                    nextSeq++;
                    newVouchers.push({ id: `转-${String(nextSeq).padStart(4,'0')}`, date: `${period}-28`, period, amount: total.toFixed(2), summary: '结转本期成本费用', user: '期末结转(系统)', status: '待审核', lines: entryLines });
                }
            });

            if (newVouchers.length === 0) {
                // 显示预览区说明没有余额
                document.getElementById('cw-preview-card').style.display = '';
                document.getElementById('cw-preview-body').innerHTML = `<div style="color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px;">⚠️ 本期（${period}）各科目余额均为 0，未生成凭证。请确认凭证已录入并记账。</div>`;
                return;
            }

            // 显示预览
            document.getElementById('cw-preview-card').style.display = '';
            document.getElementById('cw-preview-body').innerHTML = `
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <thead><tr style="background:#f9fafb;"><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #e5e7eb;">摘要</th><th style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">科目</th><th style="padding:8px 12px;text-align:right;border-bottom:1px solid #e5e7eb;">借方</th><th style="padding:8px 12px;text-align:right;border-bottom:1px solid #e5e7eb;">贷方</th></tr></thead>
                    <tbody>${previewLines.map(l=>`<tr><td style="padding:8px 12px;">${l.summary}</td><td style="padding:8px 12px;font-family:monospace;">${l.code} ${l.name||''}</td><td style="padding:8px 12px;text-align:right;color:${l.debit?'#1d4ed8':'#9ca3af'};">${l.debit?'¥'+l.debit:'-'}</td><td style="padding:8px 12px;text-align:right;color:${l.credit?'#dc2626':'#9ca3af'};">${l.credit?'¥'+l.credit:'-'}</td></tr>`).join('')}</tbody>
                </table>
                <div style="margin-top:16px; display:flex; justify-content:flex-end; gap:12px; align-items:center;">
                    <span style="font-size:12px;color:#6b7280;">共 ${newVouchers.length} 张凭证</span>
                    <button class="cw-btn" style="background:#059669;color:#fff;" onclick="window.cwConfirmExecute()">确认生成凭证</button>
                </div>`;

            // 暂存待确认的凭证
            window._cwPendingVouchers = newVouchers;
        };

        // ── 确认写入凭证 ──
        window.cwConfirmExecute = function() {
            const pending = window._cwPendingVouchers || [];
            if (!pending.length) return;
            const allVouchers = fetchAllVouchers();
            // 先删除本期已有的结转凭证（防止重复）
            const filtered = allVouchers.filter(v => !(v.period === period && v.user === '期末结转(系统)' && ['结转本期收入','结转本期成本费用'].includes(v.summary)));
            const merged = [...pending, ...filtered];
            if (typeof window.saveManualVouchers === 'function') {
                window.saveManualVouchers(merged);
            } else {
                sessionStorage.setItem('ManualVouchers', JSON.stringify(merged));
            }
            const steps = lsGet('QM_StepsDone') || {};
            if (!steps[period]) steps[period] = {};
            steps[period].profit = true;
            lsSet('QM_StepsDone', steps);
            window._cwPendingVouchers = null;
            alert(`✅ 已生成 ${pending.length} 张结转凭证，请前往凭证审核中心处理。`);
            loadContent('ClosingWizardProfit');
        };
    };

    // =========================================================================
    // 4. 期末结账向导 (ClosingWizardClose)
    // =========================================================================
    window.VM_MODULES['ClosingWizardClose'] = function(contentArea) {
        const period = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0,7);
        const status = lsGet('QM_ClosingStatus') || { closed: false };
        const isDone = !!status.closed;
        contentArea.innerHTML = `
        <div style="padding:40px; text-align:center;">
            <div style="background:#fff; border-radius:16px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.05); max-width:600px; margin:0 auto;">
                <div style="font-size:60px; margin-bottom:20px;">🔒</div>
                <h2 style="font-size:24px; margin-bottom:15px;">期末总结账</h2>
                <p style="color:#718096; margin-bottom:30px;">目标期间: ${period}</p>
                ${isDone
                    ? '<div style="color:#48bb78;font-weight:700;font-size:16px;">✅ 已完成结账</div>'
                    : `<button style="background:#3182ce;color:#fff;border:none;padding:12px 40px;border-radius:10px;font-weight:700;cursor:pointer;font-size:15px;" onclick="window.doCloseMonth()">执行结账</button>`}
                <div style="margin-top:20px;">
                    <button onclick="loadContent('PeriodEndCenter')" style="background:none;border:none;color:#3182ce;cursor:pointer;">← 返回工作台</button>
                </div>
            </div>
        </div>`;
        window.doCloseMonth = function() {
            if (!confirm(`确认对【${period}】执行结账？结账后本期将锁定。`)) return;
            const cur = lsGet('QM_ClosingStatus') || {};
            cur.closed = true;
            lsSet('QM_ClosingStatus', cur);
            alert('✅ 结账成功');
            loadContent('ClosingWizardClose');
        };
    };
})();
