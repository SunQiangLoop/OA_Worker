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
        const std = localStorage.getItem('AccountingStandard') || 'enterprise';
        const taxCode = std === 'enterprise' ? '6403' : '5403';
        return [
            {
                id: 's-1', name: '计提税金及附加', ledger: '总账', word: '转', status: '启用', lastPeriod: '-',
                summary: '计提本期城建税、教育费附加、地方教育附加',
                lines: [
                    // 计税基数 = (22210107 销项税额 - 22210101 进项税额) × 比率
                    { digest: '城市维护建设税', baseCode: '22210107', deductCode: '22210101', ratio: 7, debitName: `${taxCode} 税金及附加`, creditName: '222115 应交城市维护建设税', aux: '项目' },
                    { digest: '教育附加',       baseCode: '22210107', deductCode: '22210101', ratio: 3, debitName: `${taxCode} 税金及附加`, creditName: '222120 应交教育费附加',      aux: '项目' },
                    { digest: '地方教育附加',   baseCode: '22210107', deductCode: '22210101', ratio: 2, debitName: `${taxCode} 税金及附加`, creditName: '222125 应交地方教育附加税', aux: '项目' }
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
        // 构建可用期间列表（从凭证最早年份到当前月）
        function buildPeriodOptions() {
            const vouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
            const now = new Date();
            const curYM = now.toISOString().slice(0, 7); // "YYYY-MM"
            let minYear = now.getFullYear();
            vouchers.forEach(v => {
                const d = v.date || v.period || '';
                const y = parseInt(d.slice(0, 4));
                if (y > 2000 && y < minYear) minYear = y;
            });
            const periods = [];
            for (let y = minYear; y <= now.getFullYear(); y++) {
                const maxM = (y === now.getFullYear()) ? now.getMonth() + 1 : 12;
                for (let m = 1; m <= maxM; m++) {
                    periods.push(`${y}-${String(m).padStart(2, '0')}`);
                }
            }
            return periods;
        }

        const periods = buildPeriodOptions();
        const defaultPeriod = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0, 7);
        // 若存储值不在列表里，补进去
        if (!periods.includes(defaultPeriod)) periods.push(defaultPeriod);
        let period = defaultPeriod;

        const STEPS = [
            { key: 'autoTransfer', label: '自动转账', icon: '🔄', desc: '自定义计提/转账方案，批量生成凭证', url: 'AutoTransferTax' },
            { key: 'amort',        label: '凭证摊销', icon: '📉', desc: '根据预摊销计划，自动生成本期摊销凭证', url: '#' },
            { key: 'accrue',       label: '凭证预提', icon: '📋', desc: '执行月度预提方案，计提本期各项费用', url: '#' },
            { key: 'adjust',       label: '账务调整', icon: '🔀', desc: '期末往来对冲、重分类、坏账准备计提', url: '#' },
            { key: 'profit',       label: '结转损益', icon: '⚖️', desc: '将损益科目余额结转至本年利润科目', url: 'ClosingWizardProfit' },
            { key: 'close',        label: '总账结账', icon: '🔒', desc: '完成最终结账，锁定本期账务数据', url: 'ClosingWizardClose' },
        ];

        function renderCards(p) {
            return STEPS.map(s => {
                const isDone = getStepDone(p, s.key);
                const isWip = s.url === '#';
                const clickAttr = isWip
                    ? `onclick="alert('「${s.label}」功能正在建设中，敬请期待。')"`
                    : `onclick="loadContent('${s.url}')"`;
                const cardStyle = isWip
                    ? 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; padding:25px; cursor:default; opacity:0.75;'
                    : 'background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:25px; cursor:pointer;';
                const btnStyle = isWip
                    ? 'background:#a0aec0; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-weight:700; cursor:not-allowed;'
                    : `background:${isDone?'#48bb78':'#3182ce'}; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-weight:700; cursor:pointer;`;
                const btnLabel = isWip ? '开发中' : (isDone ? '查看 →' : '进入 →');
                return `
                <div style="${cardStyle}" ${clickAttr}>
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                        <div style="font-size:36px; margin-bottom:15px;">${s.icon}</div>
                        ${isWip ? '<span style="font-size:11px;background:#e2e8f0;color:#718096;padding:2px 8px;border-radius:10px;height:fit-content;">建设中</span>' : ''}
                    </div>
                    <h3 style="font-size:17px; margin-bottom:10px;">${s.label}</h3>
                    <p style="font-size:13px; color:#718096; line-height:1.5;">${s.desc}</p>
                    <div style="margin-top:20px; text-align:right;">
                        <button style="${btnStyle}" ${isWip ? 'disabled' : ''}>${btnLabel}</button>
                    </div>
                </div>`;
            }).join('');
        }

        const periodOpts = periods.map(p =>
            `<option value="${p}" ${p === period ? 'selected' : ''}>${p}</option>`
        ).join('');

        contentArea.innerHTML = `
        <div style="padding:30px; max-width:1200px; margin:0 auto; font-family:sans-serif;">
            <div style="background:#fff; border-radius:12px; padding:24px; box-shadow:0 2px 10px rgba(0,0,0,0.05); margin-bottom:30px; display:flex; justify-content:space-between; align-items:center;">
                <h2 style="font-size:20px; font-weight:800; border-left:5px solid #3182ce; padding-left:15px;">期末结账工作台</h2>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:13px; color:#718096;">会计期间：</span>
                    <select id="pec-period-sel" onchange="window.pecChangePeriod(this.value)"
                        style="background:#3182ce; color:#fff; padding:5px 12px; border-radius:20px; font-size:13px; font-weight:700; border:none; cursor:pointer; appearance:none; -webkit-appearance:none;">
                        ${periodOpts}
                    </select>
                </div>
            </div>
            <div id="pec-cards" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:25px;">
                ${renderCards(period)}
            </div>
        </div>`;

        window.pecChangePeriod = function(val) {
            lsSet('QM_CurrentPeriod', val);
            const cards = document.getElementById('pec-cards');
            if (cards) cards.innerHTML = renderCards(val);
        };
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

        // ── 封帐状态检查 ──
        const atPeriodKey = period.replace(/-0?(\d+)$/, (_, m) => '-' + parseInt(m));
        const atMonthClosed = sessionStorage.getItem(atPeriodKey + '-MonthClosed') === 'true';
        const atSteps = lsGet('QM_StepsDone') || {};
        const atAlreadyDone = !!(atSteps[period] && atSteps[period].autoTransfer);

        // 如果读不到数据，则初始化默认方案；同时迁移旧版方案（debitName 缺少科目代码）
        let schemes = lsGet('QM_AdvancedSchemes');
        if (!schemes || schemes.length === 0) {
            schemes = getFactoryDefaultSchemes();
            lsSet('QM_AdvancedSchemes', schemes);
        } else {
            let migrated = false;
            const stdM = localStorage.getItem('AccountingStandard') || 'enterprise';
            const taxCodeM = stdM === 'enterprise' ? '6403' : '5403';

            // ── 全量迁移：所有方案 ──
            schemes.forEach(s => {
                (s.lines || []).forEach(l => {
                    // 旧版 debitName 没有科目代码
                    if (l.debitName === '税金及附加') { l.debitName = `${taxCodeM} 税金及附加`; migrated = true; }
                    // 补充缺失的 deductCode 字段
                    if (!('deductCode' in l)) { l.deductCode = ''; migrated = true; }
                });
            });

            // ── s-1 专项迁移：升级到正确科目体系 ──
            const s1 = schemes.find(s => s.id === 's-1');
            if (s1) {
                (s1.lines || []).forEach(l => {
                    // 基数科目：旧 2221 / 222101 → 22210107 应交增值税-销项税额
                    if (l.baseCode === '2221' || l.baseCode === '222101') { l.baseCode = '22210107'; migrated = true; }
                    // 扣减科目：空 → 22210101 应交增值税-进项税额
                    if (!l.deductCode) { l.deductCode = '22210101'; migrated = true; }
                    // 贷方科目：旧编码 → 正确编码
                    if (l.creditName === '222102 应交城市维护建设税') { l.creditName = '222115 应交城市维护建设税'; migrated = true; }
                    if (l.creditName === '222103 应交教育费附加')     { l.creditName = '222120 应交教育费附加';      migrated = true; }
                    if (l.creditName === '222104 应交地方教育附加')   { l.creditName = '222125 应交地方教育附加税'; migrated = true; }
                    // 借方科目：同步当前会计准则
                    if (l.debitName === '6403 税金及附加' || l.debitName === '5403 税金及附加') {
                        l.debitName = `${taxCodeM} 税金及附加`; migrated = true;
                    }
                });
            }

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
                return { net: Math.max(c - d, 0), netDebit: Math.max(d - c, 0) };
            }

            // 先按期间过滤
            const targetPeriod = filterPeriod || period;
            const periodV = allV.filter(v => {
                const vP = (v.period || (v.date||'').substring(0,7) || '').substring(0,7);
                return vP === targetPeriod;
            });
            const resWithPeriod = calcNet(periodV);
            if (resWithPeriod.net > 0 || resWithPeriod.netDebit > 0) return resWithPeriod;

            // 回退：不限期间（防止期间标记不一致导致永远找不到）
            return calcNet(allV);
        }

        // 从 "222102 应交城市维护建设税" 中提取科目代码（首段纯数字）
        function extractAcctCode(nameStr) {
            const first = (nameStr || '').toString().trim().split(/\s+/)[0];
            return /^\d+$/.test(first) ? first : '';
        }

        // ── 科目选择辅助 ──
        function getAllSubjects() {
            try { return JSON.parse(sessionStorage.getItem('AcctSubjects') || '[]'); } catch(e) { return []; }
        }
        // 用于计算基数科目：value = 纯科目编码
        function buildBaseOpts(selCode) {
            return `<option value="">-- 选科目 --</option>` +
                getAllSubjects().map(s => `<option value="${s.code}" ${s.code===selCode?'selected':''}>${s.code} ${s.name}</option>`).join('');
        }
        // 用于借方/贷方科目：value = "编码 名称" 格式
        function buildNameOpts(selVal) {
            return `<option value="">-- 选科目 --</option>` +
                getAllSubjects().map(s => {
                    const v = `${s.code} ${s.name}`;
                    return `<option value="${v}" ${v===selVal?'selected':''}>${v}</option>`;
                }).join('');
        }
        // 辅助项类型
        function buildAuxTypeOpts(selVal) {
            return ['','部门','客户','供应商','员工','项目','存货','现金流量项目']
                .map(t => `<option value="${t}" ${t===selVal?'selected':''}>${t||'-- 辅助项 --'}</option>`).join('');
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
            ${atMonthClosed ? `
            <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:8px;padding:12px 18px;margin-bottom:16px;display:flex;align-items:center;gap:10px;">
                <span style="font-size:18px;">🔒</span>
                <span style="color:#b91c1c;font-weight:700;">本期已封帐，禁止执行计提操作。如需重新计提，请先在【期末处理 → 总账结账】中执行反结账。</span>
            </div>` : atAlreadyDone ? `
            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 18px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;">
                <span style="color:#92400e;font-weight:700;">✅ 本期已完成自动转账计提。如凭证有误需重做，请点击重新计提（将删除本期系统自动转账凭证）。</span>
                <button class="btn-at" style="background:#f59e0b;color:#fff;border:none;white-space:nowrap;" onclick="window.atReRun()">🔄 重新计提</button>
            </div>` : ''}
            <div style="margin-bottom:20px;">
                <button class="btn-at" style="background:#409eff; color:#fff;" onclick="window.atAddScheme()">+ 新增方案</button>
                <button class="btn-at" style="background:#67c23a; color:#fff; ${atMonthClosed?'opacity:.4;cursor:not-allowed;':''}" onclick="${atMonthClosed?'alert(\'本期已封帐，请先反结账\')':'window.atRunBatch()'}">▶ 执行方案</button>
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
                                    <thead><tr style="background:#e6f1fc;"><th>摘要名称</th><th style="width:160px;">计算基数科目</th><th style="width:160px;">基数扣减科目(-)</th><th style="width:70px;">比例(%)</th><th style="width:160px;">借方科目</th><th style="width:160px;">贷方科目</th><th>辅助项</th><th style="width:40px;"></th></tr></thead>
                                    <tbody id="cfg-body">
                                        ${(s.lines||[]).map(l => {
                                            const bal = getBal(l.baseCode);
                                            const deductBal = l.deductCode ? getBal(l.deductCode) : { net: 0, netDebit: 0 };
                                            // 扣减科目取借方余额（进项税本质是借方），避免和基数贷方双重计算
                                            const deductAmt = deductBal.netDebit || 0;
                                            const netBase = Math.max(bal.net - deductAmt, 0);
                                            return `
                                            <tr>
                                                <td><input class="at-input" style="width:100%;" name="l-digest" value="${l.digest}"></td>
                                                <td title="发生额: ¥${fmt(bal.net)}"><select class="at-input" style="width:100%;" name="l-base">${buildBaseOpts(l.baseCode)}</select></td>
                                                <td title="扣减额: ¥${fmt(deductAmt)}  计税基数: ¥${fmt(netBase)}"><select class="at-input" style="width:100%;" name="l-deduct">${buildBaseOpts(l.deductCode||'')}</select></td>
                                                <td><input class="at-input" style="width:100%;" name="l-ratio" type="number" value="${l.ratio}"></td>
                                                <td><select class="at-input" style="width:100%;" name="l-debit">${buildNameOpts(l.debitName||'')}</select></td>
                                                <td><select class="at-input" style="width:100%;" name="l-credit">${buildNameOpts(l.creditName||'')}</select></td>
                                                <td><select class="at-input" style="width:100%;" name="l-aux">${buildAuxTypeOpts(l.aux||'')}</select></td>
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
                digest:     r.querySelector('[name="l-digest"]').value,
                baseCode:   r.querySelector('[name="l-base"]').value,
                deductCode: r.querySelector('[name="l-deduct"]').value,
                ratio:      parseFloat(r.querySelector('[name="l-ratio"]').value) || 0,
                debitName:  r.querySelector('[name="l-debit"]').value,
                creditName: r.querySelector('[name="l-credit"]').value,
                aux:        r.querySelector('[name="l-aux"]').value
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
                    // 基数扣减：(基数发生额 - 扣减科目发生额) × 比例
                    let netBase = bal.net;
                    if (l.deductCode) {
                        const deductBal = getBal(l.deductCode);
                        // 扣减科目只取借方余额（进项税），不取贷方，防止父科目双向命中导致互相抵消为0
                        const deductAmt = deductBal.netDebit || 0;
                        netBase = Math.max(netBase - deductAmt, 0);
                    }
                    const amt = Math.round(netBase * (l.ratio / 100) * 100) / 100;
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

        // ── 重新计提：删除本期系统自动转账凭证，清除步骤标记，刷新页面 ──
        window.atReRun = () => {
            if (!confirm('重新计提将删除本期由【系统自动转账】生成的所有凭证，然后刷新页面，请重新勾选方案执行。确认继续？')) return;
            let vouchers = fetchAllVouchers();
            vouchers = vouchers.filter(v => {
                const isAutoTax = (v.user || '').includes('系统自动转账');
                const inPeriod = (v.period || (v.date||'').substring(0,7)) === period;
                return !(isAutoTax && inPeriod);
            });
            sessionStorage.setItem('ManualVouchers', JSON.stringify(vouchers));
            const steps = lsGet('QM_StepsDone') || {};
            if (steps[period]) { delete steps[period].autoTransfer; }
            lsSet('QM_StepsDone', steps);
            if (typeof addAuditLog === 'function') addAuditLog({ time: new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'), user: '管理员', module: '自动转账', action: '重新计提', detail: `期间 ${period} 重新计提，旧凭证已删除` });
            alert('✅ 已删除本期自动转账凭证，请重新勾选方案执行。');
            loadContent('AutoTransferTax');
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
            tr.innerHTML = `
                <td><input class="at-input" style="width:100%;" name="l-digest"></td>
                <td><select class="at-input" style="width:100%;" name="l-base">${buildBaseOpts('')}</select></td>
                <td><select class="at-input" style="width:100%;" name="l-deduct">${buildBaseOpts('')}</select></td>
                <td><input class="at-input" style="width:100%;" name="l-ratio" type="number" value="100"></td>
                <td><select class="at-input" style="width:100%;" name="l-debit">${buildNameOpts('')}</select></td>
                <td><select class="at-input" style="width:100%;" name="l-credit">${buildNameOpts('')}</select></td>
                <td><select class="at-input" style="width:100%;" name="l-aux">${buildAuxTypeOpts('')}</select></td>
                <td><button onclick="this.closest('tr').remove()" style="color:#f56c6c; border:none; background:none; cursor:pointer;">×</button></td>`;
            document.getElementById('cfg-body').appendChild(tr);
        };
    };

    // =========================================================================
    // 3. 结转损益向导 (ClosingWizardProfit)
    // =========================================================================
    window.VM_MODULES['ClosingWizardProfit'] = function(contentArea) {
        const period = lsGet('QM_CurrentPeriod') || new Date().toISOString().slice(0,7);

        // ── 封帐 & 已结转 状态检查 ──
        const cwPeriodKey = period.replace(/-0?(\d+)$/, (_, m) => '-' + parseInt(m));
        const cwMonthClosed = sessionStorage.getItem(cwPeriodKey + '-MonthClosed') === 'true';
        const cwSteps = lsGet('QM_StepsDone') || {};
        const cwAlreadyDone = !!(cwSteps[period] && cwSteps[period].profit);

        // 获取会计准则，决定"本年利润"科目代码
        const std = (localStorage.getItem('AccountingStandard') || 'enterprise');
        const profitCode = std === 'enterprise' ? '4103' : '3103';

        // 默认模板：兼容小企业准则(5xxx)和企业准则(6xxx)两套科目
        // 执行时余额为0的科目会被自动跳过，无需按准则分别配置
        function getDefaultTpl() {
            return {
                income: [{ id: 'i1', ledger: '总账',
                    codes: '5001,5051,5101,5201,5301,6001,6002,6051,6101,6111,6301,6302',
                    targetCode: profitCode, word: '转' }],
                cost:   [{ id: 'c1', ledger: '总账',
                    codes: '5401,5402,5403,5601,5602,5603,5701,5801,5901,6401,6402,6403,6601,6602,6603,6701,6711,6801',
                    targetCode: profitCode, word: '转' }]
            };
        }
        let tpl = lsGet('QM_ProfitTpl') || getDefaultTpl();
        if (!tpl.income) tpl.income = getDefaultTpl().income;
        if (!tpl.cost)   tpl.cost   = getDefaultTpl().cost;

        // ── 迁移：将旧模板中遗漏的损益科目自动补入 ──
        (function migrateTpl() {
            const defIncomeCodes = getDefaultTpl().income[0].codes.split(',');
            const defCostCodes   = getDefaultTpl().cost[0].codes.split(',');
            let changed = false;
            tpl.income.forEach(row => {
                const cur = (row.codes||'').split(',').map(c=>c.trim()).filter(Boolean);
                defIncomeCodes.forEach(c => { if (!cur.includes(c)) { cur.push(c); changed = true; } });
                row.codes = cur.join(',');
            });
            tpl.cost.forEach(row => {
                const cur = (row.codes||'').split(',').map(c=>c.trim()).filter(Boolean);
                defCostCodes.forEach(c => { if (!cur.includes(c)) { cur.push(c); changed = true; } });
                row.codes = cur.join(',');
            });
            if (changed) lsSet('QM_ProfitTpl', tpl);
        })();

        // 从 sessionStorage 读取科目名称，找不到时从已有凭证行中反查
        // 常用科目硬编码兜底，防止 AcctSubjects 未初始化时显示"-"
        const BUILTIN_NAMES = {
            '3103': '本年利润', '4103': '本年利润',
            '5001': '生产成本', '5401': '主营业务成本',
            '5403': '税金及附加', '6001': '主营业务收入',
            '6401': '主营业务成本', '6402': '其他业务成本',
            '6403': '税金及附加', '6601': '销售费用',
            '6602': '管理费用', '6603': '财务费用',
            '6711': '营业外支出', '6801': '所得税费用',
        };
        function getSubjectName(code) {
            const codeStr = code.toString().trim();
            // 1. 先查 AcctSubjects
            try {
                const subjects = JSON.parse(sessionStorage.getItem('AcctSubjects') || '[]');
                const found = subjects.find(s => (s.code||'').toString().trim() === codeStr);
                if (found && found.name) return found.name;
            } catch(e) {}
            // 2. 从已有凭证行的 account 字段反查
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
            // 3. 硬编码兜底
            return BUILTIN_NAMES[codeStr] || '';
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

        // Bug 2 Fix：按实际凭证末级编码汇总本期余额（仅向下前缀匹配，避免父级反向汇总）
        // 返回 { realCode: {debit, credit}, ... }，每个 key 是凭证中真实使用的科目编码
        function getLeafPeriodBalances(templateCode) {
            const allV = fetchAllVouchers();
            const prefix = templateCode.toString().trim().replace(/\D/g, '');
            const leafMap = {};
            allV.forEach(v => {
                const vP = v.period || (v.date || '').substring(0, 7);
                if (vP !== period) return;
                if (!['已记账', '已过账', '已审核', '待审核'].includes(v.status)) return;
                (v.lines || []).forEach(l => {
                    const raw = (l.accountCode || l.account || '').toString().trim()
                        .split(/[\s\u3000]/)[0].replace(/\D/g, '');
                    if (!raw) return;
                    // 仅向下匹配：凭证科目以模板科目编码开头（含完全相等），不做反向父级汇总
                    if (!raw.startsWith(prefix)) return;
                    if (!leafMap[raw]) leafMap[raw] = { debit: 0, credit: 0 };
                    leafMap[raw].debit  += parseFloat((l.debit  || '0').toString().replace(/,/g, '')) || 0;
                    leafMap[raw].credit += parseFloat((l.credit || '0').toString().replace(/,/g, '')) || 0;
                });
            });
            return leafMap;
        }

        // 获取所有科目（用于 picker）
        function getAllSubj() {
            try { return JSON.parse(sessionStorage.getItem('AcctSubjects') || '[]'); } catch(e) { return []; }
        }

        // 构建科目多选 picker 内容
        function buildSubPicker(rowId, codes, type) {
            const selectedCodes = (codes||'').split(',').map(c=>c.trim()).filter(Boolean);
            const subjects = getAllSubj();
            if (!subjects.length) return '<div style="padding:8px;color:#aaa;font-size:12px;">暂无科目数据</div>';
            return subjects.map(s => `
                <label style="display:flex;align-items:center;gap:6px;padding:3px 6px;cursor:pointer;border-radius:3px;font-size:12px;">
                    <input type="checkbox" ${selectedCodes.includes(s.code)?'checked':''}
                        onchange="window.cwPickerChange('${type}','${rowId}','${s.code}',this.checked)">
                    <span style="font-family:monospace;color:#555;">${s.code}</span>
                    <span>${s.name}</span>
                </label>`).join('');
        }

        // 构建转入科目 options（覆盖所有科目）
        function buildTargetOpts(selVal) {
            const subjects = getAllSubj();
            const baseOpts = [
                `<option value="4103" ${selVal==='4103'?'selected':''}>4103 本年利润</option>`,
                `<option value="3103" ${selVal==='3103'?'selected':''}>3103 本年利润</option>`
            ].join('');
            const subjOpts = subjects
                .filter(s => !['4103','3103'].includes(s.code))
                .map(s => `<option value="${s.code}" ${selVal===s.code?'selected':''}>${s.code} ${s.name}</option>`)
                .join('');
            return `<option value="">-请选择-</option>${baseOpts}${subjOpts}`;
        }

        // ── 标签选择器：渲染 wrap 内的 tags ──
        function buildTagsHtml(rowId, type_, selectedCodes) {
            const subjects = getAllSubj();
            if (!selectedCodes.length) return `<span class="cw-tag-ph">点击选择科目...</span>`;
            return selectedCodes.map(code => {
                const s = subjects.find(s => s.code === code);
                const label = s ? `${s.code} ${s.name}` : code;
                return `<span class="cw-tag">${label}<i class="cw-tag-x" onclick="window.cwTagRemove('${type_}','${rowId}','${code}',event)">×</i></span>`;
            }).join('');
        }

        // ── 标签选择器：渲染下拉面板的 checkbox 列表 ──
        function buildDropItems(rowId, type_, selectedCodes) {
            const subjects = getAllSubj();
            // 损益/成本类排最前，其余类型置后
            const sorted = [...subjects].sort((a, b) => {
                const apl = (a.type === '损益' || a.type === '成本') ? 0 : 1;
                const bpl = (b.type === '损益' || b.type === '成本') ? 0 : 1;
                return apl - bpl || (a.code||'').localeCompare(b.code||'');
            });
            let lastGroup = '';
            return sorted.map(s => {
                const isPL = s.type === '损益' || s.type === '成本';
                const group = isPL ? '损益/成本类' : '其他科目';
                let header = '';
                if (group !== lastGroup) {
                    lastGroup = group;
                    header = `<div style="font-size:11px;color:#9ca3af;padding:4px 4px 2px;font-weight:600;letter-spacing:.5px;">${group}</div>`;
                }
                const chk = selectedCodes.includes(s.code) ? 'checked' : '';
                const color = isPL ? '#111827' : '#6b7280';
                return `${header}<label class="cw-di" style="color:${color};">
                    <input type="checkbox" ${chk} onchange="window.cwTagCheck('${type_}','${rowId}','${s.code}',this.checked)">
                    <span>${s.code} ${s.name}</span>
                </label>`;
            }).join('');
        }

        // 渲染模板行
        function renderRows(arr, type) {
            if (!arr.length) return `<tr><td colspan="6" style="text-align:center;color:#aaa;padding:12px;">暂无配置，点击"+ 新增"添加</td></tr>`;
            return arr.map((r, i) => {
                const selectedCodes = (r.codes||'').split(',').map(c=>c.trim()).filter(Boolean);
                return `
            <tr data-id="${r.id}" data-type="${type}">
                <td style="text-align:center;">${i+1}</td>
                <td><select class="cw-sel" onchange="window.cwUpdateField('${type}','${r.id}','ledger',this.value)">
                    <option value="">-请选择-</option>
                    <option value="总账" ${r.ledger==='总账'?'selected':''}>总账</option>
                </select></td>
                <td style="position:relative;min-width:280px;">
                    <div class="cw-tag-wrap" id="tw-${r.id}" onclick="window.cwTagOpen('${r.id}',event)">
                        ${buildTagsHtml(r.id, type, selectedCodes)}
                        <i class="cw-tag-arrow">▾</i>
                    </div>
                    <div class="cw-tag-drop" id="td-${r.id}">
                        <div style="padding:6px 6px 4px;">
                            <input type="text" class="cw-inp" placeholder="搜索科目编码或名称..."
                                style="width:100%;font-size:12px;"
                                oninput="window.cwTagFilter('${r.id}',this.value)"
                                onclick="event.stopPropagation()">
                        </div>
                        <div id="tl-${r.id}" style="max-height:220px;overflow-y:auto;padding:0 6px 6px;">
                            ${buildDropItems(r.id, type, selectedCodes)}
                        </div>
                    </div>
                </td>
                <td><select class="cw-sel" onchange="window.cwUpdateField('${type}','${r.id}','targetCode',this.value)">${buildTargetOpts(r.targetCode)}</select></td>
                <td><select class="cw-sel" onchange="window.cwUpdateField('${type}','${r.id}','word',this.value)">
                    <option value="转" ${r.word==='转'?'selected':''}>转</option>
                    <option value="记" ${r.word==='记'?'selected':''}>记</option>
                </select></td>
                <td><button onclick="window.cwDelRow('${type}','${r.id}')" style="color:#ef4444;background:none;border:none;cursor:pointer;font-weight:700;">删除</button></td>
            </tr>`;
            }).join('');
        }

        contentArea.innerHTML = `
        <style>
            .cw-wrap { padding:24px; background:#f8fafc; min-height:100%; font-family:sans-serif; }
            .cw-card { background:#fff; border-radius:10px; border:1px solid #e5e7eb; margin-bottom:20px; overflow:visible; }
            .cw-card-head { border-radius:10px 10px 0 0; }
            .cw-card-head { padding:14px 20px; border-bottom:1px solid #f3f4f6; display:flex; justify-content:space-between; align-items:center; background:#f9fafb; }
            .cw-card-head h3 { font-size:14px; font-weight:700; color:#111827; }
            .cw-table { width:100%; border-collapse:collapse; font-size:13px; }
            .cw-table th { padding:10px 12px; text-align:left; background:#f9fafb; color:#6b7280; font-weight:600; border-bottom:1px solid #e5e7eb; white-space:nowrap; }
            .cw-table td { padding:10px 12px; border-bottom:1px solid #f3f4f6; vertical-align:middle; }
            .cw-table tr:last-child td { border-bottom:none; }
            .cw-inp { border:1px solid #d1d5db; border-radius:5px; padding:6px 8px; font-size:13px; }
            .cw-sel { border:1px solid #d1d5db; border-radius:5px; padding:6px 8px; font-size:13px; }
            .cw-btn { padding:7px 16px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer; border:none; }
            /* ── 标签选择器 ── */
            .cw-tag-wrap {
                min-height:36px; padding:4px 28px 4px 6px; border:1px solid #d1d5db; border-radius:5px;
                background:#fff; cursor:pointer; display:flex; flex-wrap:wrap; gap:4px; align-items:center;
                position:relative; user-select:none;
            }
            .cw-tag-wrap:hover { border-color:#6366f1; }
            .cw-tag-arrow { position:absolute; right:8px; top:50%; transform:translateY(-50%); color:#9ca3af; font-style:normal; font-size:11px; pointer-events:none; }
            .cw-tag-ph { color:#aaa; font-size:12px; }
            .cw-tag {
                display:inline-flex; align-items:center; gap:3px; background:#eff6ff; color:#1d4ed8;
                border:1px solid #bfdbfe; border-radius:3px; padding:2px 5px; font-size:12px; line-height:1.4;
            }
            .cw-tag-x { cursor:pointer; color:#93c5fd; font-style:normal; font-size:14px; line-height:1; margin-left:1px; }
            .cw-tag-x:hover { color:#ef4444; }
            .cw-tag-drop {
                display:none; position:absolute; z-index:9999; left:0; top:calc(100% + 3px);
                width:320px; background:#fff; border:1px solid #d1d5db; border-radius:6px;
                box-shadow:0 8px 24px rgba(0,0,0,0.12);
            }
            .cw-tag-drop.open { display:block; }
            .cw-di {
                display:flex; align-items:center; gap:6px; padding:5px 6px; font-size:12px;
                cursor:pointer; border-radius:3px;
            }
            .cw-di:hover { background:#f0f9ff; }
            .cw-di input[type=checkbox] { flex-shrink:0; cursor:pointer; accent-color:#6366f1; }
        </style>
        <div class="cw-wrap">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <div>
                    <button onclick="loadContent('PeriodEndCenter')" style="background:none;border:none;color:#3b82f6;cursor:pointer;font-size:13px;">← 返回工作台</button>
                    <span style="font-size:18px; font-weight:800; color:#111827; margin-left:12px;">结转损益配置</span>
                </div>
                <div style="display:flex; gap:10px; align-items:center;">
                    <span style="background:#dbeafe;color:#1d4ed8;padding:4px 12px;border-radius:12px;font-size:12px;font-weight:700;">期间: ${period}</span>
                    ${cwMonthClosed
                        ? `<span style="background:#fee2e2;color:#b91c1c;padding:4px 14px;border-radius:12px;font-size:12px;font-weight:700;">🔒 已封帐 · 请先反结账</span>`
                        : cwAlreadyDone
                            ? `<span style="color:#16a34a;font-size:12px;font-weight:700;margin-right:4px;">✓ 已结转</span>
                               <button class="cw-btn" style="background:#f59e0b;color:#fff;" onclick="window.cwReExecute()">🔄 重新结转</button>`
                            : `<button class="cw-btn" style="background:#2563eb;color:#fff;" onclick="window.cwExecute()">▶ 执行损益结转</button>`
                    }
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
                    <thead><tr><th style="width:50px;">序号</th><th style="width:110px;">账套</th><th>借方 （收入科目范围）</th><th style="width:160px;">贷方 （转入科目）</th><th style="width:70px;">凭证字</th><th style="width:60px;">操作</th></tr></thead>
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
                    <thead><tr><th style="width:50px;">序号</th><th style="width:110px;">账套</th><th>贷方 （成本费用科目范围）</th><th style="width:160px;">借方 （转入科目）</th><th style="width:70px;">凭证字</th><th style="width:60px;">操作</th></tr></thead>
                    <tbody id="cw-cost-body">${renderRows(tpl.cost, 'cost')}</tbody>
                </table>
            </div>

            <!-- 本年利润说明 -->
            <div style="padding:12px 18px;background:#fafafa;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:20px;line-height:1.9;color:#8c8c8c;font-size:12px;">
                经过上面两张凭证的对冲，"本年利润"科目就会自动计算出差额：<br>
                如果<strong style="color:#aaa;">贷方总额 &gt; 借方总额</strong>：余额在贷方，代表本期盈利（净利润）。<br>
                如果<strong style="color:#aaa;">借方总额 &gt; 贷方总额</strong>：余额在借方，代表本期亏损（净亏损）。
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

        // ── 科目 picker 展开/收起 ──
        window.cwPickerToggle = function(rowId) {
            const el = document.getElementById('spk-' + rowId);
            if (!el) return;
            // 关闭其他所有 picker
            document.querySelectorAll('[id^="spk-"]').forEach(p => {
                if (p.id !== 'spk-' + rowId) p.style.display = 'none';
            });
            el.style.display = el.style.display === 'none' ? 'block' : 'none';
        };

        // ── 标签选择器：展开/收起下拉 ──
        window.cwTagOpen = function(rowId, event) {
            event.stopPropagation();
            const drop = document.getElementById('td-' + rowId);
            if (!drop) return;
            const isOpen = drop.classList.contains('open');
            // 关闭其他所有下拉
            document.querySelectorAll('.cw-tag-drop.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) {
                drop.classList.add('open');
                // 自动聚焦搜索框
                const inp = drop.querySelector('input[type=text]');
                if (inp) setTimeout(() => inp.focus(), 30);
            }
        };

        // ── 标签选择器：搜索过滤 ──
        window.cwTagFilter = function(rowId, query) {
            const list = document.getElementById('tl-' + rowId);
            if (!list) return;
            const q = (query || '').toLowerCase();
            list.querySelectorAll('.cw-di').forEach(el => {
                const text = el.textContent.toLowerCase();
                el.style.display = (!q || text.includes(q)) ? '' : 'none';
            });
            // 分组 header：如该组下所有 cw-di 都隐藏则也隐藏 header
            list.querySelectorAll('div').forEach(header => {
                if (!header.classList.contains('cw-di')) {
                    let next = header.nextElementSibling;
                    let allHidden = true;
                    while (next && !next.tagName.match(/^DIV$/i)) { next = next.nextElementSibling; }
                    // 简单处理：有查询词时隐藏分组标签避免干扰
                    header.style.display = q ? 'none' : '';
                }
            });
        };

        // ── 标签选择器：checkbox 勾选/取消 ──
        window.cwTagCheck = function(type, id, code, checked) {
            const arr = type === 'income' ? tpl.income : tpl.cost;
            const row = arr.find(r => r.id === id);
            if (!row) return;
            let codes = (row.codes||'').split(',').map(c=>c.trim()).filter(Boolean);
            if (checked) { if (!codes.includes(code)) codes.push(code); }
            else codes = codes.filter(c => c !== code);
            row.codes = codes.join(',');
            window.cwTagRefreshWrap(type, id);
        };

        // ── 标签选择器：点 × 移除标签 ──
        window.cwTagRemove = function(type, id, code, event) {
            event.stopPropagation();
            // 同步取消 dropdown 中的 checkbox
            const list = document.getElementById('tl-' + id);
            if (list) {
                list.querySelectorAll('.cw-di input[type=checkbox]').forEach(cb => {
                    const span = cb.nextElementSibling;
                    if (span && span.textContent.trim().startsWith(code + ' ') ||
                        (span && span.textContent.trim() === code)) cb.checked = false;
                });
            }
            window.cwTagCheck(type, id, code, false);
        };

        // ── 标签选择器：刷新 wrap 显示 ──
        window.cwTagRefreshWrap = function(type, id) {
            const wrap = document.getElementById('tw-' + id);
            if (!wrap) return;
            const arr = type === 'income' ? tpl.income : tpl.cost;
            const row = arr.find(r => r.id === id);
            if (!row) return;
            const subjects = getAllSubj();
            const selectedCodes = (row.codes||'').split(',').map(c=>c.trim()).filter(Boolean);
            let html = '';
            if (!selectedCodes.length) {
                html = '<span class="cw-tag-ph">点击选择科目...</span>';
            } else {
                html = selectedCodes.map(code => {
                    const s = subjects.find(s => s.code === code);
                    const label = s ? `${s.code} ${s.name}` : code;
                    return `<span class="cw-tag">${label}<i class="cw-tag-x" onclick="window.cwTagRemove('${type}','${id}','${code}',event)">×</i></span>`;
                }).join('');
            }
            wrap.innerHTML = html + '<i class="cw-tag-arrow">▾</i>';
        };

        // ── 点击页面其他区域关闭所有下拉 ──
        if (!window._cwTagDocListener) {
            window._cwTagDocListener = true;
            document.addEventListener('click', function() {
                document.querySelectorAll('.cw-tag-drop.open').forEach(el => el.classList.remove('open'));
            });
        }

        // ── 重新结转：删除本期期末结转凭证，清除历史记录和标记，重新执行 ──
        window.cwReExecute = function() {
            if (!confirm('重新结转将删除本期【期末结转】凭证并清除结转记录，然后重新执行。确认继续？')) return;
            // 1. 删除本期期末结转凭证
            let vouchers = fetchAllVouchers();
            vouchers = vouchers.filter(v => {
                const isClosing = (v.user||'').includes('期末结转') || (v.summary||'').includes('期末结转');
                const inPeriod = (v.period||(v.date||'').substring(0,7)) === period || (v.date||'').startsWith(period);
                return !(isClosing && inPeriod);
            });
            sessionStorage.setItem('ManualVouchers', JSON.stringify(vouchers));
            // 2. 清除 PeriodEndClosingHistory 中本期记录
            const hist = JSON.parse(sessionStorage.getItem('PeriodEndClosingHistory')||'[]');
            sessionStorage.setItem('PeriodEndClosingHistory', JSON.stringify(hist.filter(h => h.period !== period)));
            // 3. 清除封帐相关标志
            sessionStorage.setItem(cwPeriodKey + '-ProfitTransferred', 'false');
            // 4. 清除步骤标记
            const steps = lsGet('QM_StepsDone') || {};
            if (steps[period]) { delete steps[period].profit; }
            lsSet('QM_StepsDone', steps);
            if (typeof addAuditLog === 'function') addAuditLog({ time: new Date().toLocaleString('zh-CN',{hour12:false}).replace(/\//g,'-'), user: '管理员', module: '结转损益', action: '重新结转', detail: `期间 ${period} 重新结转，旧凭证已删除` });
            // 5. 重新执行
            window.cwExecute();
        };

        // ── 执行损益结转 ──
        window.cwExecute = function() {
            lsSet('QM_ProfitTpl', tpl);
            const allVouchers = fetchAllVouchers();
            const maxSeq = Math.max(0, ...allVouchers.filter(v => (v.id||'').startsWith('转-')).map(v => parseInt((v.id||'').split('-')[1])||0));
            let nextSeq = maxSeq;
            const newVouchers = [];
            const previewLines = [];

            // ── 处理收入结转（借：收入科目末级，贷：本年利润）──
            tpl.income.forEach(row => {
                if (!row.codes || !row.targetCode) return;
                const codes = row.codes.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean);
                const entryLines = [];
                let total = 0;
                // Bug 2 Fix：使用 getLeafPeriodBalances 按末级实际编码取数，防止父级汇总重复计量
                const seenIncome = new Set();
                codes.forEach(code => {
                    const leafMap = getLeafPeriodBalances(code);
                    Object.entries(leafMap).forEach(([realCode, bal]) => {
                        if (seenIncome.has(realCode)) return; // 防止多个模板科目涵盖同一末级重复处理
                        seenIncome.add(realCode);
                        const amt = Math.round((bal.credit - bal.debit) * 100) / 100;
                        if (amt <= 0) return;
                        const name = getSubjectName(realCode);
                        entryLines.push({ summary: `结转${name||realCode}`, accountCode: realCode, account: name ? `${realCode} ${name}` : realCode, debit: amt.toFixed(2), credit: '' });
                        previewLines.push({ summary: `结转${name||realCode}`, code: realCode, name, debit: amt.toFixed(2), credit: '' });
                        total += amt;
                    });
                });
                if (entryLines.length > 0) {
                    const tName = getSubjectName(row.targetCode);
                    entryLines.push({ summary: '结转本期收入', accountCode: row.targetCode, account: tName ? `${row.targetCode} ${tName}` : row.targetCode, debit: '', credit: total.toFixed(2) });
                    previewLines.push({ summary: '结转本期收入', code: row.targetCode, name: tName, debit: '', credit: total.toFixed(2) });
                    nextSeq++;
                    newVouchers.push({ id: `转-${String(nextSeq).padStart(4,'0')}`, date: `${period}-28`, period, amount: total.toFixed(2), summary: '结转本期收入', user: '期末结转(系统)', status: '待审核', lines: entryLines });
                }
            });

            // ── 处理成本费用结转（借：本年利润，贷：成本费用科目末级）──
            tpl.cost.forEach(row => {
                if (!row.codes || !row.targetCode) return;
                const codes = row.codes.split(/[,，\s]+/).map(s => s.trim()).filter(Boolean);
                const entryLines = [];
                let total = 0;
                // Bug 2 Fix：使用 getLeafPeriodBalances 按末级实际编码取数
                const seenCost = new Set();
                codes.forEach(code => {
                    const leafMap = getLeafPeriodBalances(code);
                    Object.entries(leafMap).forEach(([realCode, bal]) => {
                        if (seenCost.has(realCode)) return;
                        seenCost.add(realCode);
                        const amt = Math.round((bal.debit - bal.credit) * 100) / 100;
                        if (amt <= 0) return;
                        const name = getSubjectName(realCode);
                        entryLines.push({ summary: `结转${name||realCode}`, accountCode: realCode, account: name ? `${realCode} ${name}` : realCode, debit: '', credit: amt.toFixed(2) });
                        previewLines.push({ summary: `结转${name||realCode}`, code: realCode, name, debit: '', credit: amt.toFixed(2) });
                        total += amt;
                    });
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
        // 期间key：2026-03 → 2026-3（MonthClosed 用无补零格式）
        const periodKey = period.replace(/-0?(\d+)$/, (_, m) => '-' + parseInt(m));
        const isDone = sessionStorage.getItem(periodKey + '-MonthClosed') === 'true';

        contentArea.innerHTML = `
        <div style="padding:40px; text-align:center;">
            <div style="background:#fff; border-radius:16px; padding:40px; box-shadow:0 10px 30px rgba(0,0,0,0.05); max-width:600px; margin:0 auto;">
                <div style="font-size:60px; margin-bottom:20px;">🔒</div>
                <h2 style="font-size:24px; margin-bottom:15px;">期末总结账</h2>
                <p style="color:#718096; margin-bottom:30px;">目标期间: ${period}</p>
                ${isDone ? `
                    <div style="color:#48bb78;font-weight:700;font-size:16px;margin-bottom:20px;">✅ 已完成结账</div>
                    <button onclick="window.doReOpen()" style="background:#e53e3e;color:#fff;border:none;padding:10px 32px;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px;">🔓 反结账</button>
                ` : `
                    <button onclick="window.doCloseMonth()" style="background:#3182ce;color:#fff;border:none;padding:12px 40px;border-radius:10px;font-weight:700;cursor:pointer;font-size:15px;">执行结账</button>
                `}
                <div style="margin-top:20px;">
                    <button onclick="loadContent('PeriodEndCenter')" style="background:none;border:none;color:#3182ce;cursor:pointer;">← 返回工作台</button>
                </div>
            </div>
        </div>`;

        window.doCloseMonth = function() {
            if (!confirm(`确认对【${period}】执行结账？结账后本期将锁定。`)) return;
            // 同时写入 MonthClosed 和 QM_ClosingStatus，保持双向兼容
            sessionStorage.setItem(periodKey + '-MonthClosed', 'true');
            sessionStorage.setItem(periodKey + '-MonthClosedTime', new Date().toLocaleString());
            const cur = lsGet('QM_ClosingStatus') || {};
            cur.closed = true;
            lsSet('QM_ClosingStatus', cur);
            // 更新步骤状态
            const steps = lsGet('QM_StepsDone') || {};
            if (!steps[period]) steps[period] = {};
            steps[period].close = true;
            lsSet('QM_StepsDone', steps);
            alert('✅ 结账成功，本期已锁定。');
            loadContent('ClosingWizardClose');
        };

        window.doReOpen = function() {
            if (typeof executeReOpen === 'function') {
                executeReOpen(periodKey);
            } else {
                if (!confirm(`确认对【${period}】执行反结账？解锁后可重新修改凭证。`)) return;
                sessionStorage.setItem(periodKey + '-MonthClosed', 'false');
                sessionStorage.removeItem(periodKey + '-MonthClosedTime');
                // 清除结账步骤状态
                const steps = lsGet('QM_StepsDone') || {};
                if (steps[period]) delete steps[period].close;
                lsSet('QM_StepsDone', steps);
                const cur = lsGet('QM_ClosingStatus') || {};
                cur.closed = false;
                lsSet('QM_ClosingStatus', cur);
                alert(`✅ ${period} 已反结账，期间已解锁。`);
                loadContent('ClosingWizardClose');
            }
        };
    };
})();
