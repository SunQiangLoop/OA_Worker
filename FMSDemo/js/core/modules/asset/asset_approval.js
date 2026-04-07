// js/core/modules/asset/asset_approval.js
// 审批中心（固定资产）：待我审批 / 我经办的 / 抄送我的

;(function () {

// ═══════════════════════════════════════════════════════
// 样式
// ═══════════════════════════════════════════════════════
var AP_CSS = `<style id="ap-styles">
.ap-wrap{padding:20px;font-size:13px;color:#333;min-height:400px}

/* 统计卡片 */
.ap-stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px}
.ap-stat-card{background:#fff;border-radius:6px;border:2px solid #e5e7eb;padding:14px 16px;cursor:pointer;transition:border-color .15s}
.ap-stat-card:hover{border-color:#2563eb}
.ap-stat-card.ap-stat-urgent{border-color:#fca5a5;background:#fff5f5}
.ap-stat-card.ap-stat-acc-alert{border-color:#fdba74;background:#fff8f0}
.ap-stat-label{font-size:12px;color:#6b7280;margin-bottom:6px}
.ap-stat-value{font-size:26px;font-weight:700;line-height:1.1}
.ap-stat-hint{font-size:11px;color:#9ca3af;margin-top:3px}

/* Tab 栏 */
.ap-tabs{display:flex;background:#fff;border-radius:6px 6px 0 0;border:1px solid #e5e7eb;border-bottom:none;padding:0 16px}
.ap-tab{padding:12px 16px;cursor:pointer;border-bottom:2px solid transparent;font-size:13px;color:#6b7280;margin-bottom:-1px;display:flex;align-items:center;gap:6px}
.ap-tab:hover{color:#374151}
.ap-tab.active{color:#2563eb;border-bottom-color:#2563eb;font-weight:500}
.ap-tab-count{display:inline-block;padding:1px 7px;border-radius:10px;font-size:11px;background:#f3f4f6;color:#6b7280;font-weight:400}
.ap-tab-count.urgent{background:#fef2f2;color:#dc2626;font-weight:600}

/* 筛选栏 */
.ap-filter-bar{background:#fff;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;padding:12px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.ap-filter-label{font-size:12px;color:#6b7280;white-space:nowrap}
.ap-input,.ap-select{padding:5px 10px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;background:#fff;outline:none;color:#333}
.ap-input:focus,.ap-select:focus{border-color:#2563eb}
.ap-btn{padding:5px 12px;border-radius:4px;border:1px solid #d1d5db;background:#fff;font-size:13px;cursor:pointer;white-space:nowrap}
.ap-btn:hover{background:#f3f4f6}
.ap-btn-primary{background:#2563eb;color:#fff;border-color:#2563eb}
.ap-btn-primary:hover{background:#1d4ed8}
.ap-btn-ghost{color:#6b7280}
.ap-btn-warn{background:#ea580c;color:#fff;border-color:#ea580c;font-size:12px;padding:3px 10px}
.ap-btn-warn:hover{background:#c2410c}

/* 面板容器 */
.ap-panel{background:#fff;border:1px solid #e5e7eb;border-radius:0 0 6px 6px;overflow:hidden}
.ap-panel.ap-hidden{display:none}
.ap-table-wrap{overflow-x:auto}

/* 预警横幅 */
.ap-warn-banner{display:flex;align-items:flex-start;gap:12px;background:#fff8ee;border-bottom:1px solid #fcd34d;padding:12px 16px;font-size:13px;color:#78350f}
.ap-warn-icon{font-size:16px;flex-shrink:0;margin-top:1px;color:#d97706}
.ap-warn-body{flex:1;line-height:1.7}
.ap-warn-body strong{color:#b45309}
.ap-warn-cta{flex-shrink:0;display:flex;flex-direction:column;justify-content:center}

/* 表格 */
.ap-table{width:100%;border-collapse:collapse;font-size:13px}
.ap-table th{padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:#6b7280;background:#f9fafb;border-bottom:1px solid #e5e7eb;white-space:nowrap}
.ap-table th.r{text-align:right}
.ap-table td{padding:10px 12px;border-bottom:1px solid #f0f0f0;vertical-align:middle}
.ap-table td.r{text-align:right}
.ap-table tbody tr:hover td{background:#fafaf9}
.ap-table tbody tr.ap-row-warn td{background:#fffbf0}

/* 单元格内容 */
.ap-order-no{font-size:12px;color:#6b7280;font-family:monospace}
.ap-order-reason{font-size:11px;color:#9ca3af;margin-top:2px;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ap-asset-code{font-size:12px;color:#6b7280;margin-bottom:2px}
.ap-asset-name{font-size:13px;font-weight:500;color:#111}
.ap-vehicle-row{display:flex;gap:4px;margin-top:4px;flex-wrap:wrap}
.ap-vehicle-tag{display:inline-block;padding:2px 7px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:3px;font-size:11px;font-weight:500}
.ap-applicant{font-size:13px;color:#374151}
.ap-time{font-size:11px;color:#9ca3af;margin-top:2px}
.ap-reject-reason{font-size:11px;color:#dc2626;margin-top:3px;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* 类型 Tag */
.ap-type-tag{display:inline-block;padding:2px 9px;border-radius:3px;font-size:11px;font-weight:500;border:1px solid;white-space:nowrap}
.ap-type-transfer{background:#eff6ff;color:#1d4ed8;border-color:#93c5fd}
.ap-type-repair{background:#f0f9ff;color:#0369a1;border-color:#7dd3fc}
.ap-type-scrap{background:#fff1f2;color:#be123c;border-color:#fda4af}
.ap-type-dispose{background:#fff7ed;color:#c2410c;border-color:#fdba74}
.ap-type-loss{background:#faf5ff;color:#7e22ce;border-color:#d8b4fe}

/* 状态 Tag */
.ap-status-tag{display:inline-block;padding:2px 9px;border-radius:3px;font-size:11px;font-weight:500;border:1px solid;white-space:nowrap}
.ap-s-pending{background:#fffbeb;color:#d97706;border-color:#fcd34d}
.ap-s-approved{background:#f0fdf4;color:#15803d;border-color:#86efac}
.ap-s-rejected{background:#fff1f2;color:#be123c;border-color:#fda4af}

/* 入账状态 */
.ap-acc-badge{display:inline-block;padding:2px 9px;border-radius:3px;font-size:11px;font-weight:500;border:1px solid;white-space:nowrap}
.ap-acc-pending{background:#fff7ed;color:#c2410c;border-color:#fdba74}
.ap-acc-done{background:#f0fdf4;color:#15803d;border-color:#86efac}

/* 进度 */
.ap-progress{min-width:120px}
.ap-progress-header{display:flex;align-items:center;gap:6px;margin-bottom:3px}
.ap-progress-step{font-size:11px;color:#9ca3af;white-space:nowrap;flex-shrink:0}
.ap-progress-bar{flex:1;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden}
.ap-progress-fill{height:100%;border-radius:2px;background:#2563eb;transition:width .3s}
.ap-progress-node{font-size:12px;color:#ea580c;font-weight:500}
.ap-progress-node.done{color:#15803d}

/* 风险标签 */
.ap-risk-tag{font-size:11px;color:#dc2626;font-weight:600;margin-top:2px}

/* 分页 */
.ap-pager{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-size:12px;color:#6b7280;border-top:1px solid #f0f0f0}
</style>`;

// ═══════════════════════════════════════════════════════
// 静态数据
// ═══════════════════════════════════════════════════════

// 待我审批（财务经理视角，当前节点=财务经理）
var AP_TODO = [
    {
        id:'OA-FA-BF-2026-0042', type:'scrap', typeLabel:'报废申请',
        assetCode:'SC-2022-0034', assetName:'数控车床 CK6140',
        acctPeriod:'2026-04', costCenter:'生产部',
        origVal:235000, amount:null,
        steps:5, currentStep:4, currentNode:'财务经理',
        applicant:'李强', submitTime:'2026-04-06 09:15',
        reason:'设备使用年限到期，主轴磨损严重，多次维修后精度仍不达标'
    },
    {
        id:'OA-FA-WX-2026-0166', type:'repair', typeLabel:'维修申请',
        assetCode:'SC-2026-0078', assetName:'激光切割机 LX-500',
        acctPeriod:'2026-04', costCenter:'生产部',
        origVal:186000, amount:102000, repairRatio:0.548,
        steps:4, currentStep:3, currentNode:'财务经理',
        applicant:'赵雷', submitTime:'2026-04-06 10:30',
        reason:'激光头及导轨严重磨损，需整体更换核心部件，预估停产 12 天'
    },
    {
        id:'OA-FA-WX-2026-0157', type:'repair', typeLabel:'维修申请',
        assetCode:'CL-2026-0012', assetName:'丰田卡罗拉 2026款',
        isVehicle:true, plateNo:'沪A·88261', mileage:'45,200 km',
        acctPeriod:'2026-04', costCenter:'销售部',
        origVal:128800, amount:3800,
        steps:4, currentStep:3, currentNode:'财务经理',
        applicant:'赵刚', submitTime:'2026-04-05 16:22',
        reason:'4S店 5000 公里常规保养 + 刹车片更换'
    }
];

// 我经办的（本月历史）
var AP_HANDLED = [
    {
        id:'OA-FA-DB-2026-0089', type:'transfer', typeLabel:'资产调拨',
        assetCode:'DZ-2026-0286', assetName:'MacBook Pro 16" M4',
        acctPeriod:'2026-04', costCenter:'研发部',
        origVal:24999, amount:null,
        result:'approved', accountingStatus:'pending',
        handledTime:'2026-04-06 14:20'
    },
    {
        id:'OA-FA-CZ-2026-0031', type:'dispose', typeLabel:'处置申请',
        assetCode:'SC-2024-0045', assetName:'数控铣床 VMC850',
        acctPeriod:'2026-04', costCenter:'生产部',
        origVal:320000, amount:85000,
        result:'approved', accountingStatus:'pending',
        handledTime:'2026-04-04 15:45'
    },
    {
        id:'OA-FA-BF-2026-0038', type:'scrap', typeLabel:'报废申请',
        assetCode:'DZ-2021-0112', assetName:'ThinkPad X1 Carbon Gen 9',
        acctPeriod:'2026-04', costCenter:'研发部',
        origVal:12999, amount:null,
        result:'rejected', accountingStatus:null,
        rejectReason:'资产净值超 4000 元且使用未满 3 年，建议先送修评估',
        handledTime:'2026-04-01 11:30'
    },
    {
        id:'OA-FA-CZ-2026-0019', type:'dispose', typeLabel:'处置申请',
        assetCode:'DZ-2020-0034', assetName:'激光打印机 LaserJet P3015',
        acctPeriod:'2026-03', costCenter:'行政部',
        origVal:5800, amount:380,
        result:'approved', accountingStatus:'done', voucherNo:'转-0089',
        handledTime:'2026-03-28 10:15'
    }
];

// 抄送我的
var AP_CC = [
    {
        id:'OA-FA-DB-2026-0086', type:'transfer', typeLabel:'资产调拨',
        assetCode:'DZ-2026-0285', assetName:'Dell U2723QE 显示器',
        acctPeriod:'2026-04', costCenter:'行政部 → 设计部',
        origVal:4299, amount:null,
        steps:5, currentStep:3, currentNode:'目标部门',
        applicant:'王明', submitTime:'2026-04-02 09:30'
    },
    {
        id:'OA-FA-BF-2026-0035', type:'scrap', typeLabel:'报废申请',
        assetCode:'BG-2023-0089', assetName:'实木会议桌 3.6m',
        acctPeriod:'2026-04', costCenter:'行政部',
        origVal:8600, amount:null,
        steps:4, currentStep:2, currentNode:'资产管理员',
        applicant:'林小燕', submitTime:'2026-04-03 14:00'
    },
    {
        id:'OA-FA-WX-2026-0149', type:'repair', typeLabel:'维修申请',
        assetCode:'DZ-2025-0198', assetName:'HP LaserJet Pro M404dn',
        acctPeriod:'2026-03', costCenter:'财务部',
        origVal:2899, amount:450,
        steps:4, currentStep:4, currentNode:'已完成',
        applicant:'周小梅', submitTime:'2026-03-30 10:15'
    }
];

// ═══════════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════════
function apFmt(v) {
    if (v === null || v === undefined) return '—';
    return '¥' + Number(v).toLocaleString('zh-CN', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function apTypeBadge(r) {
    var cls = {transfer:'ap-type-transfer', repair:'ap-type-repair', scrap:'ap-type-scrap', dispose:'ap-type-dispose', loss:'ap-type-loss'}[r.type] || '';
    return '<span class="ap-type-tag ' + cls + '">' + r.typeLabel + '</span>';
}
function apStatusBadge(result) {
    if (result === 'approved') return '<span class="ap-status-tag ap-s-approved">&#10003; 已通过</span>';
    if (result === 'rejected') return '<span class="ap-status-tag ap-s-rejected">&#10007; 已驳回</span>';
    return '<span class="ap-status-tag ap-s-pending">&#9203; 审批中</span>';
}
function apAccBadge(status, voucherNo) {
    if (!status) return '<span style="color:#9ca3af">—</span>';
    if (status === 'pending') return '<span class="ap-acc-badge ap-acc-pending">&#9679; 待入账</span>';
    if (status === 'done') return '<span class="ap-acc-badge ap-acc-done">&#10003; 已入账</span>' +
        (voucherNo ? '<div class="ap-time" style="margin-top:2px">' + voucherNo + '</div>' : '');
    return '—';
}
function apProgress(steps, current, node) {
    var isDone = (node === '已完成');
    var pct = Math.min(100, Math.round((current / steps) * 100));
    return '<div class="ap-progress">' +
        '<div class="ap-progress-header">' +
            '<span class="ap-progress-step">' + current + '/' + steps + '</span>' +
            '<div class="ap-progress-bar"><div class="ap-progress-fill" style="width:' + pct + '%' +
                (isDone ? ';background:#16a34a' : '') + '"></div></div>' +
        '</div>' +
        '<div class="ap-progress-node' + (isDone ? ' done' : '') + '">' +
            (isDone ? '&#10003; 已完成' : '待&#xFF1A;' + node) +
        '</div>' +
    '</div>';
}

// ── 预警横幅（维修费 > 原值 50%）────────────────────────
function apWarnBanners(items) {
    var html = '';
    items.forEach(function(r) {
        if (!r.repairRatio || r.repairRatio <= 0.5) return;
        var pct = Math.round(r.repairRatio * 100);
        html +=
            '<div class="ap-warn-banner">' +
                '<div class="ap-warn-icon">&#9888;</div>' +
                '<div class="ap-warn-body">' +
                    '<strong>维修费用超阈值预警</strong> &nbsp;|&nbsp; ' +
                    '<span class="ap-order-no" style="font-size:13px">' + r.id + '</span> &nbsp;' + r.assetName + '<br>' +
                    '预估维修费 <strong>' + apFmt(r.amount) + '</strong>，' +
                    '占资产原值 ' + apFmt(r.origVal) + ' 的 <strong style="color:#c2410c">' + pct + '%</strong>，' +
                    '超过建议报废阈值（原值 50%）。建议驳回本次维修申请，直接发起报废流程，可减少额外损耗。' +
                '</div>' +
                '<div class="ap-warn-cta">' +
                    '<button class="ap-btn ap-btn-warn" onclick="alert(\'已创建报废申请草稿，请在资产台账中完善并提交\')">&#43; 发起报废申请</button>' +
                '</div>' +
            '</div>';
    });
    return html;
}

// ── 渲染：待我审批 ────────────────────────────────────
function renderTodo(items) {
    var rows = items.map(function(r) {
        var isWarn = r.repairRatio && r.repairRatio > 0.5;
        var amtHtml = r.amount === null ? '—' :
            (isWarn ?
                '<strong style="color:#dc2626">' + apFmt(r.amount) + '</strong>' +
                '<div class="ap-risk-tag">&#9888; 超50%阈值</div>' :
                apFmt(r.amount));

        var assetHtml =
            '<div class="ap-asset-code">' + r.assetCode + '</div>' +
            '<div class="ap-asset-name">' + r.assetName + '</div>';
        if (r.isVehicle) {
            assetHtml +=
                '<div class="ap-vehicle-row">' +
                    '<span class="ap-vehicle-tag">&#x1F697; ' + r.plateNo + '</span>' +
                    '<span class="ap-vehicle-tag">&#128204; ' + r.mileage + '</span>' +
                '</div>';
        }

        return '<tr' + (isWarn ? ' class="ap-row-warn"' : '') + '>' +
            '<td><div class="ap-order-no">' + r.id + '</div>' +
                '<div class="ap-order-reason" title="' + r.reason + '">' + r.reason + '</div></td>' +
            '<td>' + apTypeBadge(r) + '</td>' +
            '<td>' + assetHtml + '</td>' +
            '<td>' + r.acctPeriod + '</td>' +
            '<td>' + r.costCenter + '</td>' +
            '<td class="r">' + apFmt(r.origVal) + '</td>' +
            '<td class="r">' + amtHtml + '</td>' +
            '<td>' + apProgress(r.steps, r.currentStep, r.currentNode) + '</td>' +
            '<td><div class="ap-applicant">' + r.applicant + '</div>' +
                '<div class="ap-time">' + r.submitTime + '</div></td>' +
            '<td style="white-space:nowrap">' +
                '<button class="ap-btn ap-btn-primary" style="margin-bottom:4px" ' +
                    'onclick="alert(\'审批弹窗 · ' + r.id + '\')">审批</button><br>' +
                '<button class="ap-btn ap-btn-ghost" onclick="alert(\'查看详情 · ' + r.id + '\')">详情</button>' +
            '</td>' +
        '</tr>';
    }).join('');

    return '<table class="ap-table">' +
        '<thead><tr>' +
            '<th style="min-width:130px">申请单号 / 摘要</th>' +
            '<th>业务类型</th>' +
            '<th style="min-width:160px">资产信息</th>' +
            '<th>会计期间</th>' +
            '<th>成本中心</th>' +
            '<th class="r" style="min-width:90px">关联资产原值</th>' +
            '<th class="r" style="min-width:100px">申请金额</th>' +
            '<th style="min-width:130px">审批进度</th>' +
            '<th style="min-width:100px">申请人 / 时间</th>' +
            '<th style="min-width:90px">操作</th>' +
        '</tr></thead>' +
        '<tbody>' + (rows || '<tr><td colspan="10" style="text-align:center;padding:40px;color:#9ca3af">暂无待审批单据</td></tr>') + '</tbody>' +
    '</table>';
}

// ── 渲染：我经办的 ────────────────────────────────────
function renderHandled(items) {
    var rows = items.map(function(r) {
        var accCell = apAccBadge(r.accountingStatus, r.voucherNo);
        // 已通过但待入账：显示"生成凭证"按钮
        if (r.accountingStatus === 'pending') {
            accCell += '<div style="margin-top:5px">' +
                '<button class="ap-btn ap-btn-warn" onclick="loadContent(\'ManualVoucher\')">生成凭证</button>' +
                '</div>';
        }
        var rejectCell = r.rejectReason ?
            '<div class="ap-reject-reason" title="' + r.rejectReason + '">驳回：' + r.rejectReason + '</div>' : '';

        return '<tr>' +
            '<td><div class="ap-order-no">' + r.id + '</div></td>' +
            '<td>' + apTypeBadge(r) + '</td>' +
            '<td><div class="ap-asset-code">' + r.assetCode + '</div>' +
                '<div class="ap-asset-name">' + r.assetName + '</div></td>' +
            '<td>' + r.acctPeriod + '</td>' +
            '<td>' + r.costCenter + '</td>' +
            '<td class="r">' + apFmt(r.origVal) + '</td>' +
            '<td class="r">' + apFmt(r.amount) + '</td>' +
            '<td>' + apStatusBadge(r.result) + rejectCell + '</td>' +
            '<td>' + accCell + '</td>' +
            '<td><div class="ap-time">' + r.handledTime + '</div></td>' +
            '<td><button class="ap-btn ap-btn-ghost" onclick="alert(\'查看详情 · ' + r.id + '\')">查看</button></td>' +
        '</tr>';
    }).join('');

    return '<table class="ap-table">' +
        '<thead><tr>' +
            '<th style="min-width:130px">申请单号</th>' +
            '<th>业务类型</th>' +
            '<th style="min-width:160px">资产信息</th>' +
            '<th>会计期间</th>' +
            '<th>成本中心</th>' +
            '<th class="r" style="min-width:90px">关联资产原值</th>' +
            '<th class="r" style="min-width:80px">金额</th>' +
            '<th style="min-width:90px">经办结果</th>' +
            '<th style="min-width:90px">入账状态</th>' +
            '<th style="min-width:120px">经办时间</th>' +
            '<th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
    '</table>';
}

// ── 渲染：抄送我的 ────────────────────────────────────
function renderCC(items) {
    var rows = items.map(function(r) {
        return '<tr>' +
            '<td><div class="ap-order-no">' + r.id + '</div></td>' +
            '<td>' + apTypeBadge(r) + '</td>' +
            '<td><div class="ap-asset-code">' + r.assetCode + '</div>' +
                '<div class="ap-asset-name">' + r.assetName + '</div></td>' +
            '<td>' + r.acctPeriod + '</td>' +
            '<td>' + r.costCenter + '</td>' +
            '<td class="r">' + apFmt(r.origVal) +
                (r.amount ? '<br><small style="color:#9ca3af">申请: ' + apFmt(r.amount) + '</small>' : '') + '</td>' +
            '<td>' + apProgress(r.steps, r.currentStep, r.currentNode) + '</td>' +
            '<td><div class="ap-applicant">' + r.applicant + '</div>' +
                '<div class="ap-time">' + r.submitTime + '</div></td>' +
            '<td><button class="ap-btn ap-btn-ghost" onclick="alert(\'查看详情 · ' + r.id + '\')">查看</button></td>' +
        '</tr>';
    }).join('');

    return '<table class="ap-table">' +
        '<thead><tr>' +
            '<th style="min-width:130px">申请单号</th>' +
            '<th>业务类型</th>' +
            '<th style="min-width:160px">资产信息</th>' +
            '<th>会计期间</th>' +
            '<th>成本中心</th>' +
            '<th class="r" style="min-width:90px">关联资产原值</th>' +
            '<th style="min-width:130px">当前进度</th>' +
            '<th style="min-width:100px">申请人 / 时间</th>' +
            '<th>操作</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
    '</table>';
}

// ═══════════════════════════════════════════════════════
// 模块注册
// ═══════════════════════════════════════════════════════
window.VM_MODULES = window.VM_MODULES || {};
window.VM_MODULES['AssetApproval'] = function(contentArea) {

    var pendingAccCnt = AP_HANDLED.filter(function(r){ return r.accountingStatus === 'pending'; }).length;
    var approvedCnt   = AP_HANDLED.filter(function(r){ return r.result === 'approved'; }).length;
    var rejectedCnt   = AP_HANDLED.filter(function(r){ return r.result === 'rejected'; }).length;

    var cssTag = document.getElementById('ap-styles') ? '' : AP_CSS;

    var html = cssTag +
    '<div class="ap-wrap">' +

    // 统计卡片
    '<div class="ap-stats-row">' +
      '<div class="ap-stat-card ap-stat-urgent" onclick="window.apTab(\'todo\')">' +
        '<div class="ap-stat-label">&#9203; 待我审批</div>' +
        '<div class="ap-stat-value" style="color:#dc2626">' + AP_TODO.length + '</div>' +
        '<div class="ap-stat-hint">需本人处理</div>' +
      '</div>' +
      '<div class="ap-stat-card" onclick="window.apTab(\'handled\')">' +
        '<div class="ap-stat-label">&#128203; 本月经办</div>' +
        '<div class="ap-stat-value" style="color:#2563eb">' + AP_HANDLED.length + '</div>' +
        '<div class="ap-stat-hint">件历史记录</div>' +
      '</div>' +
      '<div class="ap-stat-card" onclick="window.apTab(\'handled\')">' +
        '<div class="ap-stat-label">&#10003; 已通过</div>' +
        '<div class="ap-stat-value" style="color:#16a34a">' + approvedCnt + '</div>' +
        '<div class="ap-stat-hint">本月累计</div>' +
      '</div>' +
      '<div class="ap-stat-card" onclick="window.apTab(\'handled\')">' +
        '<div class="ap-stat-label">&#10007; 已驳回</div>' +
        '<div class="ap-stat-value" style="color:#dc2626">' + rejectedCnt + '</div>' +
        '<div class="ap-stat-hint">本月累计</div>' +
      '</div>' +
      '<div class="ap-stat-card' + (pendingAccCnt > 0 ? ' ap-stat-acc-alert' : '') + '" onclick="window.apTab(\'handled\')">' +
        '<div class="ap-stat-label">&#129534; 待入账</div>' +
        '<div class="ap-stat-value" style="color:#ea580c">' + pendingAccCnt + '</div>' +
        '<div class="ap-stat-hint">需生成凭证</div>' +
      '</div>' +
    '</div>' +

    // Tab 栏
    '<div class="ap-tabs">' +
      '<div class="ap-tab active" id="ap-tab-btn-todo" onclick="window.apTab(\'todo\')">' +
        '待我审批 <span class="ap-tab-count urgent">' + AP_TODO.length + '</span></div>' +
      '<div class="ap-tab" id="ap-tab-btn-handled" onclick="window.apTab(\'handled\')">' +
        '我经办的 <span class="ap-tab-count">' + AP_HANDLED.length + '</span></div>' +
      '<div class="ap-tab" id="ap-tab-btn-cc" onclick="window.apTab(\'cc\')">' +
        '抄送我的 <span class="ap-tab-count">' + AP_CC.length + '</span></div>' +
    '</div>' +

    // 筛选栏
    '<div class="ap-filter-bar">' +
      '<input class="ap-input" style="width:190px" placeholder="单号 / 资产编号 / 名称">' +
      '<select class="ap-select"><option>全部类型</option><option>资产调拨</option><option>维修申请</option><option>报废申请</option><option>处置申请</option></select>' +
      '<span class="ap-filter-label">会计期间</span>' +
      '<select class="ap-select"><option>全部</option><option>2026-04</option><option>2026-03</option><option>2026-02</option><option>2026-01</option></select>' +
      '<span class="ap-filter-label">成本中心</span>' +
      '<select class="ap-select"><option>全部</option><option>生产部</option><option>销售部</option><option>研发部</option><option>行政部</option><option>财务部</option></select>' +
      '<button class="ap-btn ap-btn-primary">&#128269; 搜索</button>' +
      '<button class="ap-btn">重置</button>' +
    '</div>' +

    // 面板：待我审批
    '<div class="ap-panel" id="ap-panel-todo">' +
      apWarnBanners(AP_TODO) +
      '<div class="ap-table-wrap">' + renderTodo(AP_TODO) + '</div>' +
      '<div class="ap-pager"><span>共 ' + AP_TODO.length + ' 条</span></div>' +
    '</div>' +

    // 面板：我经办的
    '<div class="ap-panel ap-hidden" id="ap-panel-handled">' +
      '<div class="ap-table-wrap">' + renderHandled(AP_HANDLED) + '</div>' +
      '<div class="ap-pager"><span>共 ' + AP_HANDLED.length + ' 条</span></div>' +
    '</div>' +

    // 面板：抄送我的
    '<div class="ap-panel ap-hidden" id="ap-panel-cc">' +
      '<div class="ap-table-wrap">' + renderCC(AP_CC) + '</div>' +
      '<div class="ap-pager"><span>共 ' + AP_CC.length + ' 条</span></div>' +
    '</div>' +

    '</div>';  // ap-wrap

    contentArea.innerHTML = html;

    // Tab 切换
    window.apTab = function(tab) {
        ['todo','handled','cc'].forEach(function(t) {
            var btn   = document.getElementById('ap-tab-btn-' + t);
            var panel = document.getElementById('ap-panel-' + t);
            if (btn)   btn.classList.toggle('active', t === tab);
            if (panel) panel.classList.toggle('ap-hidden', t !== tab);
        });
    };
};

})();
