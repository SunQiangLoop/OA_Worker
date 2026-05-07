// js/core/modules/asset/asset_depr.js
// 固定资产模块：AssetDepreciation — 折旧管理

;(function () {

// ═══════════════════════════════════════════════════════
// 共享样式（与 asset_card.js 保持一致，首次注入后跳过）
// ═══════════════════════════════════════════════════════
var DEPR_CSS = `<style id="fa-depr-styles">
.fa-wrap{padding:20px;font-size:13px;color:#333;min-height:400px}
.fa-card{background:#fff;border-radius:6px;border:1px solid #e5e7eb;margin-bottom:16px;overflow:hidden}
.fa-card-hdr{padding:12px 16px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;background:#fafafa}
.fa-card-title{font-size:14px;font-weight:600;color:#1a1a1a}
.fa-btn{padding:6px 14px;border-radius:4px;border:1px solid #d1d5db;background:#fff;font-size:13px;cursor:pointer;white-space:nowrap}
.fa-btn:hover{background:#f3f4f6}
.fa-btn-primary{background:#2563eb;color:#fff;border-color:#2563eb}
.fa-btn-primary:hover{background:#1d4ed8}
.fa-btn-success{background:#16a34a;color:#fff;border-color:#16a34a}
.fa-btn-success:hover{background:#15803d}
.fa-btn-success:disabled{background:#d1fae5;border-color:#6ee7b7;color:#6b7280;cursor:not-allowed}
.fa-input,.fa-select{padding:6px 10px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;background:#fff;outline:none;color:#333}
.fa-select:focus{border-color:#2563eb}
.fa-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:500;border:1px solid;white-space:nowrap}
.fa-s-active{background:#f0fdf4;color:#16a34a;border-color:#86efac}
.fa-s-pending-depr{background:#fff7ed;color:#ea580c;border-color:#fdba74}
.fa-s-done-depr{background:#f0fdf4;color:#16a34a;border-color:#86efac}
.fa-table{width:100%;border-collapse:collapse;font-size:13px}
.fa-table th{padding:10px 12px;text-align:left;font-size:12px;font-weight:500;color:#6b7280;background:#f9fafb;border-bottom:1px solid #e5e7eb;white-space:nowrap}
.fa-table th.r{text-align:right}
.fa-table td{padding:10px 12px;border-bottom:1px solid #f0f0f0;vertical-align:middle}
.fa-table td.r{text-align:right}
.fa-table tbody tr:hover td{background:#f9fafb}
.fa-table tfoot td{background:#fafafa;font-weight:600;padding:10px 12px;border-top:2px solid #e5e7eb}
.fa-table tfoot td.r{text-align:right}
.fa-link{color:#2563eb;cursor:pointer;background:none;border:none;font-size:13px;padding:0;text-decoration:none}
.fa-link:hover{text-decoration:underline}
.fa-pager{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-size:12px;color:#6b7280;border-top:1px solid #f0f0f0}
.fa-page-btns{display:flex;gap:4px}
.fa-page-btn{padding:4px 10px;border:1px solid #d1d5db;border-radius:3px;background:#fff;cursor:pointer;font-size:12px}
.fa-page-btn.active{background:#2563eb;color:#fff;border-color:#2563eb}
.fa-page-btn:disabled{color:#d1d5db;cursor:not-allowed}
.fa-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;align-items:center;justify-content:center}
.fa-modal.show{display:flex}
.fa-modal-box{background:#fff;border-radius:8px;width:420px;max-width:92%;box-shadow:0 8px 32px rgba(0,0,0,.2)}
.fa-modal-hdr{padding:14px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center}
.fa-modal-title{font-size:15px;font-weight:600}
.fa-modal-close{border:none;background:none;font-size:22px;color:#9ca3af;cursor:pointer;line-height:1}
.fa-modal-bdy{padding:20px;font-size:14px;color:#374151;line-height:1.8}
.fa-modal-ftr{padding:12px 20px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:8px}

/* 折旧管理专用样式 */
.fa-depr-alert{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#fffbeb;border:1px solid #fcd34d;border-radius:6px;margin-bottom:16px;font-size:13px;color:#92400e}
.fa-depr-alert.hidden{display:none}
.fa-depr-alert strong{color:#b45309}
.fa-period-bar{background:#fff;border-radius:6px;border:1px solid #e5e7eb;padding:14px 16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
.fa-period-left{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.fa-period-label{font-size:14px;font-weight:500;color:#374151;white-space:nowrap}
.fa-stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
.fa-stat-card{background:#fff;border-radius:6px;border:1px solid #e5e7eb;padding:16px 20px}
.fa-stat-label{font-size:12px;color:#6b7280;margin-bottom:6px}
.fa-stat-value{font-size:22px;font-weight:700}
.fa-stat-value.blue{color:#2563eb}
.fa-stat-value.orange{color:#ea580c}
.fa-stat-value.green{color:#16a34a}
.fa-stat-value.red{color:#dc2626}
.fa-history-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
.fa-history-item{padding:11px 8px;border:1px solid #e5e7eb;border-radius:6px;text-align:center;cursor:pointer;transition:border-color .15s}
.fa-history-item:hover{border-color:#2563eb}
.fa-history-item.hd{border-color:#86efac;background:#f0fdf4}
.fa-history-item.hc{border-color:#fcd34d;background:#fffbeb}
.fa-history-item.hf{background:#f9fafb;cursor:default}
.fa-history-item .hm{font-size:13px;font-weight:500;color:#374151;margin-bottom:3px}
.fa-history-item .ha{font-size:11px;color:#6b7280;margin-bottom:3px}
.fa-history-item .hs{font-size:10px}
.fa-history-item.hd .hs{color:#16a34a}
.fa-history-item.hc .hs{color:#ea580c}
.fa-history-item.hf .hs{color:#9ca3af}
.fa-depr-red{color:#dc2626;font-weight:600}
</style>`;

// ═══════════════════════════════════════════════════════
// 工具函数
// ═══════════════════════════════════════════════════════
function _faGetList() {
    var raw = sessionStorage.getItem('FA_Assets');
    if (raw) { try { return JSON.parse(raw); } catch(e) {} }
    return [];
}
function _faSaveList(list) {
    sessionStorage.setItem('FA_Assets', JSON.stringify(list));
}
function _faMonthlyDepr(a) {
    return (a.origVal * (1 - a.residualRate / 100)) / a.usefulLife;
}
function _faNetVal(a) {
    return Math.max(0, a.origVal - a.accumDepr);
}
function _faFmt(v) {
    return '¥' + Number(v).toLocaleString('zh-CN', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function _faGetHistory() {
    var raw = sessionStorage.getItem('FA_Depr_History');
    if (raw) { try { return JSON.parse(raw); } catch(e) {} }
    var seed = [
        {year:2026, month:1, totalDepr:362480.00, assetCount:5, executedAt:'2026-01-31'},
        {year:2026, month:2, totalDepr:365120.00, assetCount:6, executedAt:'2026-02-28'},
        {year:2026, month:3, totalDepr:378560.00, assetCount:7, executedAt:'2026-03-31'}
    ];
    sessionStorage.setItem('FA_Depr_History', JSON.stringify(seed));
    return seed;
}
function _faSaveHistory(list) {
    sessionStorage.setItem('FA_Depr_History', JSON.stringify(list));
}
function _faDeprAssets(list) {
    // 应计提资产：在用/闲置/维修中（不含待报废/已报废）
    return list.filter(function(a){ return a.assetType !== 'low' && ['active','idle','repair'].indexOf(a.status) >= 0; });
}

// ═══════════════════════════════════════════════════════
// 模块：AssetDepreciation — 折旧管理
// ═══════════════════════════════════════════════════════
window.VM_MODULES = window.VM_MODULES || {};
window.VM_MODULES['AssetDepreciation'] = function(contentArea) {

    var PAGE_SIZE = 5;
    window._faDeprPage = window._faDeprPage || 1;
    window._faDeprYear = window._faDeprYear || new Date().getFullYear();
    window._faDeprMonth = window._faDeprMonth || (new Date().getMonth() + 1);

    // ── 计算统计数据 ──────────────────────────────────────
    function calcStats(year, month) {
        var list = _faGetList();
        var hist = _faGetHistory();
        var targets = _faDeprAssets(list);
        var totalMonthlyDepr = 0;
        targets.forEach(function(a){ totalMonthlyDepr += _faMonthlyDepr(a); });

        var isExecuted = hist.some(function(h){ return h.year === year && h.month === month; });

        // 本年累计折旧
        var ytdDepr = 0;
        hist.filter(function(h){ return h.year === year; }).forEach(function(h){ ytdDepr += h.totalDepr; });
        if (isExecuted) {
            // 当前期已计提，不再重复加
        } else {
            // 预计加上本月（显示值不含当月）
        }

        // 本月新增应折旧资产（当月入账资产）
        var yyyymm = year + '-' + String(month).padStart(2, '0');
        var newCount = list.filter(function(a){
            return a.entryDate && a.entryDate.startsWith(yyyymm) &&
                   ['active','idle','repair'].indexOf(a.status) >= 0;
        }).length;

        return {
            count: targets.length,
            monthlyDepr: totalMonthlyDepr,
            ytdDepr: ytdDepr,
            newCount: newCount,
            isExecuted: isExecuted
        };
    }

    // ── 生成折旧预览行数据 ─────────────────────────────────
    function buildPreviewRows(list) {
        var targets = _faDeprAssets(list);
        return targets.map(function(a){
            var monthDepr  = _faMonthlyDepr(a);
            var netOpen    = _faNetVal(a);
            var accumAfter = a.accumDepr + monthDepr;
            var netClose   = Math.max(0, a.origVal - accumAfter);
            return {
                id: a.id,
                code: a.code, name: a.name, category: a.category,
                dept: a.dept, deprMethod: a.deprMethod || '年限平均法',
                origVal: a.origVal, netOpen: netOpen,
                monthDepr: monthDepr, accumAfter: accumAfter, netClose: netClose
            };
        });
    }

    // ── 渲染整个页面 ──────────────────────────────────────
    function render() {
        var year  = window._faDeprYear;
        var month = window._faDeprMonth;
        var stats = calcStats(year, month);
        var list  = _faGetList();
        var hist  = _faGetHistory();
        var rows  = buildPreviewRows(list);
        var page  = window._faDeprPage;
        var total = rows.length;
        var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        if (page > totalPages) { page = 1; window._faDeprPage = 1; }
        var pageRows = rows.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

        // 年份选项
        var yearOpts = '';
        for (var y = 2023; y <= new Date().getFullYear(); y++) {
            yearOpts += '<option value="'+y+'"'+(y===year?' selected':'')+'>'+y+'年</option>';
        }
        // 月份选项（当年不超过当月）
        var maxMonth = (year === new Date().getFullYear()) ? (new Date().getMonth()+1) : 12;
        var monthOpts = '';
        for (var m = maxMonth; m >= 1; m--) {
            monthOpts += '<option value="'+m+'"'+(m===month?' selected':'')+'>'+m+'月</option>';
        }

        // 告警横幅
        var alertHtml = stats.isExecuted ? '' :
            '<div class="fa-depr-alert" id="fa-depr-alert">' +
            '&#9888; ' + year + '年' + month + '月折旧尚未计提，应计提资产 ' +
            '<strong>' + stats.count + '</strong> 件，预计折旧总额 ' +
            '<strong>' + _faFmt(stats.monthlyDepr) + '</strong>' +
            '</div>';

        // 历史记录格子（12个月）
        var historyItems = '';
        for (var mi = 1; mi <= 12; mi++) {
            var hRec = hist.find(function(h){ return h.year===year && h.month===mi; });
            var isNow = (mi === month);
            var isFuture = !hRec && mi > month;
            var cls = hRec ? 'hd' : (isNow && !stats.isExecuted ? 'hc' : (isFuture ? 'hf' : 'hd'));
            var amt  = hRec ? _faFmt(hRec.totalDepr).replace('¥','¥') : (isFuture ? '—' : _faFmt(stats.monthlyDepr));
            var dot  = hRec ? '&#10003; 已计提' : (isFuture ? '&#9675; 未到期' : '&#9679; 待计提');
            historyItems +=
                '<div class="fa-history-item '+cls+'" onclick="window.faDeprSelectMonth('+mi+')" title="'+year+'年'+mi+'月">' +
                '<div class="hm">'+mi+'月</div>' +
                '<div class="ha">'+amt+'</div>' +
                '<div class="hs">'+dot+'</div>' +
                '</div>';
        }

        // 预览表格行
        var tbodyHtml = '';
        if (pageRows.length === 0) {
            tbodyHtml = '<tr><td colspan="10" style="text-align:center;padding:40px;color:#9ca3af;">暂无应计提资产数据</td></tr>';
        } else {
            pageRows.forEach(function(r){
                tbodyHtml +=
                    '<tr>' +
                    '<td><button class="fa-link" onclick="window._faDetailId='+r.id+';loadContent(\'AssetDetail\')">'+r.code+'</button></td>' +
                    '<td>'+r.name+'</td>' +
                    '<td>'+r.category+'</td>' +
                    '<td>'+(r.dept||'—')+'</td>' +
                    '<td>'+r.deprMethod+'</td>' +
                    '<td class="r">'+_faFmt(r.origVal)+'</td>' +
                    '<td class="r">'+_faFmt(r.netOpen)+'</td>' +
                    '<td class="r fa-depr-red">'+_faFmt(r.monthDepr)+'</td>' +
                    '<td class="r">'+_faFmt(r.accumAfter)+'</td>' +
                    '<td class="r">'+_faFmt(r.netClose)+'</td>' +
                    '</tr>';
            });
        }

        // 合计行
        var sumOrigVal=0, sumNetOpen=0, sumMonthDepr=0, sumAccum=0, sumNetClose=0;
        rows.forEach(function(r){
            sumOrigVal+=r.origVal; sumNetOpen+=r.netOpen;
            sumMonthDepr+=r.monthDepr; sumAccum+=r.accumAfter; sumNetClose+=r.netClose;
        });

        // 分页按钮
        var pagerBtns = '';
        if (page > 1) pagerBtns += '<button class="fa-page-btn" onclick="window.faDeprPage('+(page-1)+')">&#8249;</button>';
        for (var pi = 1; pi <= totalPages; pi++) {
            pagerBtns += '<button class="fa-page-btn'+(pi===page?' active':'')+'" onclick="window.faDeprPage('+pi+')">'+pi+'</button>';
        }
        if (page < totalPages) pagerBtns += '<button class="fa-page-btn" onclick="window.faDeprPage('+(page+1)+')">&#8250;</button>';

        var executeDisabled = stats.isExecuted ? ' disabled' : '';
        var executeTip = stats.isExecuted ? '本期已计提' : '执行本月折旧计提';
        var statusBadge = stats.isExecuted
            ? '<span class="fa-badge fa-s-done-depr">已计提</span>'
            : '<span class="fa-badge fa-s-pending-depr">未计提</span>';

        var cssTag = document.getElementById('fa-depr-styles') ? '' : DEPR_CSS;

        var html = cssTag + '<div class="fa-wrap">' +

            alertHtml +

            // 期间选择栏
            '<div class="fa-period-bar">' +
              '<div class="fa-period-left">' +
                '<span class="fa-period-label">折旧期间：</span>' +
                '<select class="fa-select" id="fa-depr-year" onchange="window.faDeprYearChange(this.value)">' + yearOpts + '</select>' +
                '<select class="fa-select" id="fa-depr-month" onchange="window.faDeprMonthChange(this.value)">' + monthOpts + '</select>' +
                statusBadge +
              '</div>' +
              '<button class="fa-btn fa-btn-success" id="fa-depr-exec-btn"'+executeDisabled+
                ' onclick="window.faDeprExecute()">&#9654; ' + executeTip + '</button>' +
            '</div>' +

            // 统计卡片
            '<div class="fa-stats-row">' +
              '<div class="fa-stat-card"><div class="fa-stat-label">应计提资产数</div><div class="fa-stat-value blue">'+stats.count+'</div></div>' +
              '<div class="fa-stat-card"><div class="fa-stat-label">本月预计折旧总额</div><div class="fa-stat-value orange">'+_faFmt(stats.monthlyDepr).replace('.00','')+'</div></div>' +
              '<div class="fa-stat-card"><div class="fa-stat-label">本年累计折旧</div><div class="fa-stat-value green">'+_faFmt(stats.ytdDepr).replace('.00','')+'</div></div>' +
              '<div class="fa-stat-card"><div class="fa-stat-label">本月新增应折旧资产</div><div class="fa-stat-value red">'+(stats.newCount||0)+'</div></div>' +
            '</div>' +

            // 历史记录
            '<div class="fa-card">' +
              '<div class="fa-card-hdr"><span class="fa-card-title">'+year+'年折旧计提记录</span></div>' +
              '<div style="padding:16px"><div class="fa-history-grid">'+historyItems+'</div></div>' +
            '</div>' +

            // 折旧预览表
            '<div class="fa-card">' +
              '<div class="fa-card-hdr">' +
                '<span class="fa-card-title">本月折旧预览（'+year+'年'+month+'月）</span>' +
                '<div style="display:flex;gap:8px">' +
                  '<button class="fa-btn" onclick="window.faDeprGroupBy(\'dept\')">按部门汇总</button>' +
                  '<button class="fa-btn" onclick="window.faDeprGroupBy(\'cat\')">按分类汇总</button>' +
                  '<button class="fa-btn" onclick="window.faDeprExport()">&#128228; 导出明细</button>' +
                '</div>' +
              '</div>' +
              '<table class="fa-table">' +
                '<thead><tr>' +
                  '<th>资产编号</th><th>资产名称</th><th>分类</th><th>部门</th><th>折旧方法</th>' +
                  '<th class="r">原值</th><th class="r">期初净值</th>' +
                  '<th class="r">本月折旧</th><th class="r">累计折旧</th><th class="r">期末净值</th>' +
                '</tr></thead>' +
                '<tbody>'+tbodyHtml+'</tbody>' +
                '<tfoot><tr>' +
                  '<td colspan="5">合计（共 '+total+' 条）</td>' +
                  '<td class="r">'+_faFmt(sumOrigVal)+'</td>' +
                  '<td class="r">'+_faFmt(sumNetOpen)+'</td>' +
                  '<td class="r fa-depr-red">'+_faFmt(sumMonthDepr)+'</td>' +
                  '<td class="r">'+_faFmt(sumAccum)+'</td>' +
                  '<td class="r">'+_faFmt(sumNetClose)+'</td>' +
                '</tr></tfoot>' +
              '</table>' +
              '<div class="fa-pager">' +
                '<span>共 '+total+' 条 | 本月折旧总计：<strong class="fa-depr-red" style="font-size:15px">'+_faFmt(sumMonthDepr)+'</strong></span>' +
                '<div class="fa-page-btns">'+pagerBtns+'</div>' +
              '</div>' +
            '</div>' +

            // 执行确认弹窗
            '<div class="fa-modal" id="fa-depr-modal">' +
              '<div class="fa-modal-box">' +
                '<div class="fa-modal-hdr">' +
                  '<span class="fa-modal-title">执行折旧计提确认</span>' +
                  '<button class="fa-modal-close" onclick="window.faDeprModalClose()">&#215;</button>' +
                '</div>' +
                '<div class="fa-modal-bdy" id="fa-depr-modal-body"></div>' +
                '<div class="fa-modal-ftr">' +
                  '<button class="fa-btn" onclick="window.faDeprModalClose()">取消</button>' +
                  '<button class="fa-btn fa-btn-success" onclick="window.faDeprConfirm()">确认执行</button>' +
                '</div>' +
              '</div>' +
            '</div>' +

        '</div>';

        contentArea.innerHTML = html;
    }

    // ── 事件处理 ──────────────────────────────────────────
    window.faDeprYearChange = function(val) {
        window._faDeprYear  = parseInt(val, 10);
        window._faDeprMonth = 1;
        window._faDeprPage  = 1;
        // 重新渲染月份后，将月份限制在合理范围
        if (window._faDeprYear === new Date().getFullYear()) {
            window._faDeprMonth = new Date().getMonth() + 1;
        }
        render();
    };

    window.faDeprMonthChange = function(val) {
        window._faDeprMonth = parseInt(val, 10);
        window._faDeprPage  = 1;
        render();
    };

    window.faDeprSelectMonth = function(month) {
        window._faDeprMonth = month;
        window._faDeprPage  = 1;
        render();
    };

    window.faDeprPage = function(p) {
        window._faDeprPage = p;
        render();
    };

    window.faDeprGroupBy = function(mode) {
        var list = _faGetList();
        var rows = buildPreviewRows(list);
        var grouped = {};
        rows.forEach(function(r){
            var key = mode === 'dept' ? (r.dept||'未分配部门') : r.category;
            if (!grouped[key]) grouped[key] = {origVal:0,netOpen:0,monthDepr:0,accumAfter:0,netClose:0,count:0};
            grouped[key].origVal    += r.origVal;
            grouped[key].netOpen    += r.netOpen;
            grouped[key].monthDepr  += r.monthDepr;
            grouped[key].accumAfter += r.accumAfter;
            grouped[key].netClose   += r.netClose;
            grouped[key].count++;
        });
        var title = mode === 'dept' ? '按部门汇总（本月折旧）' : '按分类汇总（本月折旧）';
        var trs = '';
        var sumD = 0;
        Object.keys(grouped).forEach(function(k){
            var g = grouped[k];
            sumD += g.monthDepr;
            trs += '<tr><td>'+k+'</td><td class="r">'+g.count+'件</td>' +
                   '<td class="r">'+_faFmt(g.origVal)+'</td>' +
                   '<td class="r fa-depr-red">'+_faFmt(g.monthDepr)+'</td>' +
                   '<td class="r">'+_faFmt(g.netClose)+'</td></tr>';
        });
        var modal = document.getElementById('fa-depr-modal');
        var body  = document.getElementById('fa-depr-modal-body');
        if (!modal || !body) return;
        body.innerHTML =
            '<strong>'+title+'</strong>' +
            '<table class="fa-table" style="margin-top:12px">' +
            '<thead><tr><th>'+(mode==='dept'?'部门':'分类')+'</th><th class="r">资产数</th><th class="r">原值合计</th><th class="r">本月折旧</th><th class="r">期末净值</th></tr></thead>' +
            '<tbody>'+trs+'</tbody>' +
            '<tfoot><tr><td colspan="3">合计</td><td class="r fa-depr-red">'+_faFmt(sumD)+'</td><td></td></tr></tfoot>' +
            '</table>';
        // 隐藏确认按钮，只显示关闭
        modal.querySelector('.fa-modal-ftr').innerHTML =
            '<button class="fa-btn fa-btn-primary" onclick="window.faDeprModalClose()">关闭</button>';
        modal.classList.add('show');
    };

    window.faDeprExport = function() {
        alert('导出功能：实际项目中将生成 Excel 折旧明细表并下载。（演示版本）');
    };

    window.faDeprExecute = function() {
        var year  = window._faDeprYear;
        var month = window._faDeprMonth;
        var list  = _faGetList();
        var rows  = buildPreviewRows(list);
        var total = 0;
        rows.forEach(function(r){ total += r.monthDepr; });

        var modal = document.getElementById('fa-depr-modal');
        var body  = document.getElementById('fa-depr-modal-body');
        if (!modal || !body) return;

        body.innerHTML =
            '<p>即将对 <strong>'+year+'年'+month+'月</strong> 执行折旧计提操作。</p>' +
            '<div style="margin:12px 0;padding:12px;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb">' +
              '<div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
                '<span style="color:#6b7280">涉及资产数量</span><strong>'+rows.length+' 件</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between">' +
                '<span style="color:#6b7280">本月折旧总额</span>' +
                '<strong class="fa-depr-red">'+_faFmt(total)+'</strong>' +
              '</div>' +
            '</div>' +
            '<p style="color:#92400e;font-size:12px">&#9888; 执行后将更新资产累计折旧，操作不可撤销，请确认无误后继续。</p>';

        // 恢复弹窗底部按钮
        modal.querySelector('.fa-modal-ftr').innerHTML =
            '<button class="fa-btn" onclick="window.faDeprModalClose()">取消</button>' +
            '<button class="fa-btn fa-btn-success" onclick="window.faDeprConfirm()">确认执行</button>';

        modal.classList.add('show');
    };

    window.faDeprConfirm = function() {
        var year  = window._faDeprYear;
        var month = window._faDeprMonth;
        var list  = _faGetList();
        var rows  = buildPreviewRows(list);
        var total = 0;

        // 更新各资产累计折旧
        list.forEach(function(a){
            if (['active','idle','repair'].indexOf(a.status) < 0) return;
            var depr = _faMonthlyDepr(a);
            a.accumDepr = Math.round((a.accumDepr + depr) * 100) / 100;
            total += depr;
        });
        _faSaveList(list);

        // 写入历史
        var hist = _faGetHistory();
        hist.push({year:year, month:month, totalDepr:total, assetCount:rows.length, executedAt:new Date().toISOString().split('T')[0]});
        _faSaveHistory(hist);

        window.faDeprModalClose();
        render();
    };

    window.faDeprModalClose = function() {
        var modal = document.getElementById('fa-depr-modal');
        if (modal) modal.classList.remove('show');
    };

    // 初始渲染
    render();
};

})();
