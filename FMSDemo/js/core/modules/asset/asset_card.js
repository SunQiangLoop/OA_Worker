// js/core/modules/asset/asset_card.js
// 固定资产模块：AssetList（资产台账）/ AssetRegister（资产登记）/ AssetDetail（资产详情）

;(function () {

// ═══════════════════════════════════════════════════════
// 共享 CSS（所有模块复用，前缀 fa- 防止污染全局样式）
// ═══════════════════════════════════════════════════════
var FA_CSS = `<style>
.fa-wrap{padding:20px;font-size:13px;color:#333;min-height:400px}
.fa-card{background:#fff;border-radius:6px;border:1px solid #e5e7eb;margin-bottom:16px;overflow:hidden}
.fa-card-hdr{padding:12px 16px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;background:#fafafa}
.fa-card-title{font-size:14px;font-weight:600;color:#1a1a1a}

/* 按钮 */
.fa-btn{padding:6px 14px;border-radius:4px;border:1px solid #d1d5db;background:#fff;font-size:13px;cursor:pointer;white-space:nowrap}
.fa-btn:hover{background:#f3f4f6}
.fa-btn-primary{background:#2563eb;color:#fff;border-color:#2563eb}
.fa-btn-primary:hover{background:#1d4ed8}
.fa-btn-success{background:#16a34a;color:#fff;border-color:#16a34a}
.fa-btn-success:hover{background:#15803d}
.fa-btn-danger{color:#dc2626;border-color:#dc2626}
.fa-btn-danger:hover{background:#fef2f2}
.fa-btn-warn{background:#ea580c;color:#fff;border-color:#ea580c}

/* 输入/选择框 */
.fa-input,.fa-select,.fa-finput,.fa-fselect{padding:6px 10px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;background:#fff;outline:none;color:#333}
.fa-input:focus,.fa-finput:focus{border-color:#2563eb;box-shadow:0 0 0 2px rgba(37,99,235,.1)}
.fa-select:focus,.fa-fselect:focus{border-color:#2563eb}
.fa-finput:disabled,.fa-fselect:disabled{background:#f5f5f5;color:#9ca3af;cursor:not-allowed}
.fa-ftextarea{padding:8px 10px;border:1px solid #d1d5db;border-radius:4px;font-size:13px;min-height:80px;resize:vertical;outline:none;font-family:inherit;width:100%}
.fa-ftextarea:focus{border-color:#2563eb}
.fa-upload-area{border:2px dashed #d1d5db;border-radius:4px;padding:20px;text-align:center;cursor:pointer;color:#9ca3af;font-size:12px}
.fa-upload-area:hover{border-color:#2563eb;color:#2563eb}

/* 状态 badge */
.fa-badge{display:inline-block;padding:2px 8px;border-radius:3px;font-size:11px;font-weight:500;border:1px solid;white-space:nowrap}
.fa-s-active{background:#f0fdf4;color:#16a34a;border-color:#86efac}
.fa-s-idle{background:#fffbeb;color:#d97706;border-color:#fcd34d}
.fa-s-repair{background:#eff6ff;color:#2563eb;border-color:#93c5fd}
.fa-s-pending{background:#fff7ed;color:#ea580c;border-color:#fdba74}
.fa-s-retired{background:#f5f5f5;color:#9ca3af;border-color:#d1d5db}

/* 台账筛选区 */
.fa-filters{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:12px 16px}
.fa-filter-spacer{flex:1}
.fa-tabs{display:flex;border-bottom:1px solid #e5e7eb;padding:0 16px;background:#fff}
.fa-tab{padding:10px 14px;cursor:pointer;border:none;background:none;font-size:13px;color:#6b7280;border-bottom:2px solid transparent;margin-bottom:-1px}
.fa-tab:hover{color:#374151}
.fa-tab.active{color:#2563eb;border-bottom-color:#2563eb;font-weight:500}

/* 表格 */
.fa-table{width:100%;border-collapse:collapse;font-size:13px}
.fa-table th{padding:10px 12px;text-align:left;font-size:12px;font-weight:500;color:#6b7280;background:#f9fafb;border-bottom:1px solid #e5e7eb;white-space:nowrap}
.fa-table td{padding:10px 12px;border-bottom:1px solid #f0f0f0;vertical-align:middle}
.fa-table tbody tr:hover td{background:#f9fafb}
.fa-link{color:#2563eb;cursor:pointer;background:none;border:none;font-size:13px;padding:0;text-decoration:none}
.fa-link:hover{text-decoration:underline}
.fa-link-gray{color:#6b7280}

/* 分页 */
.fa-pager{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;font-size:12px;color:#6b7280;border-top:1px solid #f0f0f0}
.fa-page-btns{display:flex;gap:4px}
.fa-page-btn{padding:4px 10px;border:1px solid #d1d5db;border-radius:3px;background:#fff;cursor:pointer;font-size:12px}
.fa-page-btn.active{background:#2563eb;color:#fff;border-color:#2563eb}
.fa-page-btn:disabled{color:#d1d5db;cursor:not-allowed}

/* 登记表单 */
.fa-form-hdr{padding:16px 20px;border-bottom:1px solid #e5e7eb;background:#fafafa;display:flex;justify-content:space-between;align-items:center}
.fa-form-tabs{display:flex;gap:0;border-bottom:1px solid #e5e7eb}
.fa-form-tab{padding:10px 20px;cursor:pointer;border:none;background:#f9fafb;font-size:13px;color:#6b7280;border-bottom:2px solid transparent;border-right:1px solid #e5e7eb}
.fa-form-tab:last-child{border-right:none}
.fa-form-tab.active{background:#fff;color:#2563eb;border-bottom-color:#2563eb}
.fa-section{padding:16px 20px;border-bottom:1px solid #f0f0f0}
.fa-section-title{font-size:13px;font-weight:600;color:#374151;margin-bottom:14px;display:flex;align-items:center;gap:8px}
.fa-section-bar{display:inline-block;width:3px;height:14px;background:#2563eb;border-radius:2px;flex-shrink:0}
.fa-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px 24px}
.fa-full{grid-column:1/-1}
.fa-field{display:flex;flex-direction:column;gap:4px}
.fa-flabel{font-size:12px;color:#6b7280}
.fa-req{color:#dc2626}
.fa-help{font-size:11px;color:#9ca3af;margin-top:2px}
.fa-form-footer{padding:16px 20px;display:flex;gap:10px;background:#fafafa;border-top:1px solid #e5e7eb}

/* 详情页 */
.fa-detail-top{padding:16px 20px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.fa-detail-name{font-size:18px;font-weight:600;color:#111;margin-bottom:6px}
.fa-detail-badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}
.fa-detail-meta{font-size:12px;color:#6b7280;display:flex;gap:16px;flex-wrap:wrap}
.fa-detail-actions{display:flex;gap:8px;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end}
.fa-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 16px 16px}
.fa-info-card{border:1px solid #e5e7eb;border-radius:6px;overflow:hidden}
.fa-info-card-title{font-size:12px;font-weight:600;color:#6b7280;padding:8px 12px;background:#f9fafb;border-bottom:1px solid #f0f0f0}
.fa-info-row{display:flex;justify-content:space-between;padding:7px 12px;border-bottom:1px solid #f9f9f9;font-size:13px}
.fa-info-row:last-child{border-bottom:none}
.fa-info-lbl{color:#6b7280}
.fa-info-val{color:#111;font-weight:500;text-align:right}
.fa-info-val.blue{color:#2563eb;font-weight:600}

/* 时间线 */
.fa-timeline{padding:0 20px 16px}
.fa-tl-item{display:flex;gap:12px;margin-bottom:12px;position:relative}
.fa-tl-item:not(:last-child)::before{content:'';position:absolute;left:5px;top:14px;bottom:-12px;width:2px;background:#e5e7eb}
.fa-tl-dot{width:12px;height:12px;border-radius:50%;border:2px solid #2563eb;background:#fff;flex-shrink:0;margin-top:3px;position:relative;z-index:1}
.fa-tl-dot.filled{background:#2563eb}
.fa-tl-content{flex:1}
.fa-tl-time{font-size:11px;color:#9ca3af}
.fa-tl-title{font-size:13px;font-weight:500;color:#374151;margin:2px 0}
.fa-tl-desc{font-size:12px;color:#6b7280;background:#f9fafb;padding:6px 10px;border-radius:4px;border-left:3px solid #e5e7eb;margin-top:4px}

/* 折旧明细表 */
.fa-depr-table{width:100%;border-collapse:collapse;font-size:12px}
.fa-depr-table th{padding:8px 10px;background:#f9fafb;color:#6b7280;font-size:11px;font-weight:500;border-bottom:1px solid #e5e7eb;text-align:right;white-space:nowrap}
.fa-depr-table th:first-child{text-align:left}
.fa-depr-table td{padding:7px 10px;border-bottom:1px solid #f5f5f5;text-align:right;color:#374151}
.fa-depr-table td:first-child{text-align:left}
.fa-depr-table tr.fa-pending td{color:#9ca3af}
.fa-depr-table tr.fa-entry-month td{color:#9ca3af;font-style:italic}

/* 弹窗 */
.fa-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;align-items:center;justify-content:center}
.fa-modal.show{display:flex}
.fa-modal-box{background:#fff;border-radius:8px;width:480px;max-width:92%;box-shadow:0 8px 32px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto}
.fa-modal-hdr{padding:14px 20px;border-bottom:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:#fff;z-index:1}
.fa-modal-title{font-size:15px;font-weight:600}
.fa-modal-close{border:none;background:none;font-size:22px;color:#9ca3af;cursor:pointer;line-height:1}
.fa-modal-close:hover{color:#374151}
.fa-modal-bdy{padding:20px}
.fa-modal-ftr{padding:12px 20px;border-top:1px solid #e5e7eb;display:flex;justify-content:flex-end;gap:8px;position:sticky;bottom:0;background:#fff}

/* 详情子 Tab */
.fa-sub-tabs{display:flex;border-bottom:1px solid #e5e7eb;padding:0 20px;background:#fff}
.fa-sub-tab{padding:9px 14px;cursor:pointer;border:none;background:none;font-size:13px;color:#6b7280;border-bottom:2px solid transparent;margin-bottom:-1px}
.fa-sub-tab:hover{color:#374151}
.fa-sub-tab.active{color:#2563eb;border-bottom-color:#2563eb;font-weight:500}
.fa-sub-panel{display:none}
.fa-sub-panel.active{display:block}

/* 空状态 */
.fa-empty{text-align:center;padding:40px;color:#9ca3af;font-size:13px}
</style>`;

// ═══════════════════════════════════════════════════════
// 种子数据（8条演示资产）
// ═══════════════════════════════════════════════════════
var FA_SEED = [
    {id:1,code:'DZ-2026-0286',name:'MacBook Pro 16" M4',category:'电子设备',subCat:'笔记本电脑',brand:'Apple',model:'M4 Max 36GB/1TB',serialNo:'C02YN3JKLVCG',origVal:24999,accumDepr:0,dept:'研发部',user:'陈明',location:'A栋3楼-工位A12',status:'active',entryDate:'2026-04-03',deprMethod:'年限平均法',usefulLife:36,residualRate:5,supplier:'Apple Store 官方',invoiceNo:'SH-2026-88456',purchaseDate:'2026-03-28',warrantyEnd:'2027-03-28',remark:''},
    {id:2,code:'DZ-2026-0285',name:'Dell U2723QE 显示器',category:'电子设备',subCat:'显示器',brand:'Dell',model:'U2723QE',serialNo:'MXP2TK3',origVal:4299,accumDepr:286,dept:'设计部',user:'张雪',location:'B栋2楼-工位B08',status:'idle',entryDate:'2026-03-30',deprMethod:'年限平均法',usefulLife:36,residualRate:5,supplier:'京东企业购',invoiceNo:'JD-2026-33901',purchaseDate:'2026-03-25',warrantyEnd:'2029-03-25',remark:''},
    {id:3,code:'BG-2026-0145',name:'人体工学办公椅 Herman Miller',category:'办公家具',subCat:'座椅',brand:'Herman Miller',model:'Aeron B',serialNo:'',origVal:5200,accumDepr:347,dept:'行政部',user:'王芳',location:'A栋1楼-前台',status:'active',entryDate:'2026-04-02',deprMethod:'年限平均法',usefulLife:60,residualRate:5,supplier:'官方旗舰店',invoiceNo:'HM-2026-0012',purchaseDate:'2026-03-30',warrantyEnd:'2028-03-30',remark:''},
    {id:4,code:'SC-2026-0078',name:'激光切割机 LX-500',category:'生产设备',subCat:'加工设备',brand:'LX',model:'LX-500',serialNo:'LX500-88231',origVal:186000,accumDepr:15500,dept:'生产部',user:'李强',location:'C栋1楼-车间A',status:'active',entryDate:'2026-04-01',deprMethod:'年限平均法',usefulLife:120,residualRate:10,supplier:'联强机械',invoiceNo:'LQ-2026-0078',purchaseDate:'2026-03-20',warrantyEnd:'2027-03-20',remark:''},
    {id:5,code:'CL-2026-0012',name:'丰田卡罗拉 2026款',category:'车辆',subCat:'轿车',brand:'丰田',model:'卡罗拉 2026',serialNo:'LSVNB4182P2051688',origVal:128800,accumDepr:23600,dept:'销售部',user:'赵刚',location:'地下车库-B2-066',status:'repair',entryDate:'2026-03-28',deprMethod:'年限平均法',usefulLife:60,residualRate:5,supplier:'丰田4S店',invoiceNo:'TY-2026-0012',purchaseDate:'2026-03-15',warrantyEnd:'2028-03-15',remark:''},
    {id:6,code:'DZ-2025-0198',name:'HP LaserJet Pro M404dn',category:'电子设备',subCat:'打印机',brand:'HP',model:'LaserJet Pro M404dn',serialNo:'VNB3K21094',origVal:2899,accumDepr:804,dept:'财务部',user:'',location:'A栋2楼-财务室',status:'active',entryDate:'2025-08-10',deprMethod:'年限平均法',usefulLife:36,residualRate:5,supplier:'京东企业购',invoiceNo:'JD-2025-88102',purchaseDate:'2025-08-05',warrantyEnd:'2027-08-05',remark:''},
    {id:7,code:'BG-2023-0089',name:'实木会议桌 3.6m',category:'办公家具',subCat:'桌椅',brand:'曲美',model:'3.6m实木',serialNo:'',origVal:8600,accumDepr:3010,dept:'行政部',user:'',location:'A栋3楼-大会议室',status:'pending',entryDate:'2023-06-01',deprMethod:'年限平均法',usefulLife:60,residualRate:5,supplier:'曲美家居',invoiceNo:'QM-2023-0089',purchaseDate:'2023-05-25',warrantyEnd:'2025-05-25',remark:'已超保修期，建议报废'},
    {id:8,code:'SC-2024-0045',name:'数控铣床 VMC850',category:'生产设备',subCat:'加工设备',brand:'海德曼',model:'VMC850',serialNo:'VMC850-22045',origVal:320000,accumDepr:103200,dept:'生产部',user:'刘强',location:'C栋1楼-车间B',status:'active',entryDate:'2024-03-01',deprMethod:'年限平均法',usefulLife:120,residualRate:10,supplier:'海德曼数控',invoiceNo:'HDM-2024-0045',purchaseDate:'2024-02-20',warrantyEnd:'2025-02-20',remark:''}
];

// ═══════════════════════════════════════════════════════
// 共享工具函数
// ═══════════════════════════════════════════════════════
function faGetList() {
    var raw = sessionStorage.getItem('FA_Assets');
    if (raw) { try { return JSON.parse(raw); } catch(e) {} }
    var seed = FA_SEED.map(function(a){ return Object.assign({}, a); });
    sessionStorage.setItem('FA_Assets', JSON.stringify(seed));
    return seed;
}
function faSaveList(list) {
    sessionStorage.setItem('FA_Assets', JSON.stringify(list));
}
function faNetVal(a) {
    return Math.max(0, a.origVal - a.accumDepr);
}
function faMonthlyDepr(a) {
    return (a.origVal * (1 - a.residualRate / 100)) / a.usefulLife;
}
function faFmt(v) {
    return '¥' + Number(v).toLocaleString('zh-CN', {minimumFractionDigits:2, maximumFractionDigits:2});
}
var FA_STATUS_MAP = {
    active:  {label:'在用',  cls:'fa-s-active'},
    idle:    {label:'闲置',  cls:'fa-s-idle'},
    repair:  {label:'维修中',cls:'fa-s-repair'},
    pending: {label:'待报废',cls:'fa-s-pending'},
    retired: {label:'已报废',cls:'fa-s-retired'}
};
function faStatusBadge(status) {
    var m = FA_STATUS_MAP[status] || {label:status, cls:'fa-s-retired'};
    return '<span class="fa-badge ' + m.cls + '">' + m.label + '</span>';
}
function faNextCode(category) {
    var prefix = {电子设备:'DZ', 办公家具:'BG', 生产设备:'SC', 车辆:'CL'}[category] || 'FA';
    var year = new Date().getFullYear();
    var list = faGetList();
    var max = 0;
    list.forEach(function(a){
        var m = a.code.match(/-(\d{4})$/);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + '-' + year + '-' + String(max + 1).padStart(4, '0');
}

// ═══════════════════════════════════════════════════════
// 模块 1：AssetList — 资产台账
// ═══════════════════════════════════════════════════════
window.VM_MODULES['AssetList'] = function(contentArea, contentHTML, moduleCode) {

    window._faListTab = window._faListTab || 'all';
    window._faListPage = 1;
    var PAGE_SIZE = 10;

    window.faListTab = function(status, el) {
        window._faListTab = status;
        window._faListPage = 1;
        document.querySelectorAll('.fa-tab').forEach(function(t){ t.classList.remove('active'); });
        if (el) el.classList.add('active');
        window.faRenderTable();
    };
    window.faListSearch = function() {
        window._faListPage = 1;
        window.faRenderTable();
    };
    window.faListReset = function() {
        document.getElementById('faSearchInput').value = '';
        document.getElementById('faCatFilter').value = '';
        document.getElementById('faDeptFilter').value = '';
        document.getElementById('faStatusFilter').value = '';
        window._faListTab = 'all';
        document.querySelectorAll('.fa-tab').forEach(function(t){ t.classList.remove('active'); });
        var allTab = document.querySelector('.fa-tab[data-status="all"]');
        if (allTab) allTab.classList.add('active');
        window._faListPage = 1;
        window.faRenderTable();
    };
    window.faListGoDetail = function(id) {
        window._faDetailId = id;
        loadContent('AssetDetail');
    };
    window.faListPage = function(p) {
        window._faListPage = p;
        window.faRenderTable();
    };
    window.faRenderTable = function() {
        var list = faGetList();
        var q = (document.getElementById('faSearchInput') ? document.getElementById('faSearchInput').value : '').toLowerCase();
        var cat = document.getElementById('faCatFilter') ? document.getElementById('faCatFilter').value : '';
        var dept = document.getElementById('faDeptFilter') ? document.getElementById('faDeptFilter').value : '';
        var sf = document.getElementById('faStatusFilter') ? document.getElementById('faStatusFilter').value : '';
        var tabStatus = window._faListTab;

        var filtered = list.filter(function(a) {
            if (tabStatus && tabStatus !== 'all' && a.status !== tabStatus) return false;
            if (sf && a.status !== sf) return false;
            if (cat && a.category !== cat) return false;
            if (dept && a.dept !== dept) return false;
            if (q && !(a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || (a.serialNo || '').toLowerCase().includes(q))) return false;
            return true;
        });

        var total = filtered.length;
        var totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        var p = Math.min(window._faListPage, totalPages);
        var page = filtered.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

        var tbody = document.getElementById('faTableBody');
        if (!tbody) return;
        if (!page.length) {
            tbody.innerHTML = '<tr><td colspan="12" class="fa-empty">暂无数据</td></tr>';
        } else {
            tbody.innerHTML = page.map(function(a) {
                var net = faNetVal(a);
                return '<tr>' +
                    '<td><input type="checkbox" class="fa-row-cb" data-id="' + a.id + '"></td>' +
                    '<td><button class="fa-link" onclick="faListGoDetail(' + a.id + ')">' + a.code + '</button></td>' +
                    '<td>' + a.name + '</td>' +
                    '<td>' + a.category + (a.subCat ? '-' + a.subCat : '') + '</td>' +
                    '<td style="text-align:right">' + faFmt(a.origVal) + '</td>' +
                    '<td style="text-align:right">' + faFmt(net) + '</td>' +
                    '<td>' + a.dept + '</td>' +
                    '<td>' + (a.user || '–') + '</td>' +
                    '<td>' + (a.location || '–') + '</td>' +
                    '<td>' + faStatusBadge(a.status) + '</td>' +
                    '<td>' + a.entryDate + '</td>' +
                    '<td><button class="fa-link" onclick="faListGoDetail(' + a.id + ')">详情</button></td>' +
                '</tr>';
            }).join('');
        }

        // 分页
        var pager = document.getElementById('faPager');
        if (pager) {
            var btns = '';
            for (var i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= p - 1 && i <= p + 1)) {
                    btns += '<button class="fa-page-btn' + (i === p ? ' active' : '') + '" onclick="faListPage(' + i + ')">' + i + '</button>';
                } else if (i === p - 2 || i === p + 2) {
                    btns += '<button class="fa-page-btn" disabled>…</button>';
                }
            }
            pager.innerHTML =
                '<span>共 ' + total + ' 条记录，每页 ' + PAGE_SIZE + ' 条，第 ' + p + '/' + totalPages + ' 页</span>' +
                '<div class="fa-page-btns">' +
                    '<button class="fa-page-btn" onclick="faListPage(' + (p-1) + ')" ' + (p<=1?'disabled':'') + '>上一页</button>' +
                    btns +
                    '<button class="fa-page-btn" onclick="faListPage(' + (p+1) + ')" ' + (p>=totalPages?'disabled':'') + '>下一页</button>' +
                '</div>';
        }

        // 更新 Tab 数量
        var counts = {all:0, active:0, idle:0, repair:0, pending:0, retired:0};
        list.forEach(function(a) { counts.all++; if (counts[a.status] !== undefined) counts[a.status]++; });
        document.querySelectorAll('.fa-tab[data-status]').forEach(function(t) {
            var s = t.dataset.status;
            var m = t.textContent.match(/^[^(]+/);
            t.textContent = (m ? m[0].trim() : s) + ' (' + (counts[s] || 0) + ')';
        });
    };

    contentHTML += FA_CSS + `
    <div class="fa-wrap">
      <!-- 筛选区 -->
      <div class="fa-card">
        <div class="fa-filters">
          <input id="faSearchInput" class="fa-input" style="width:220px" placeholder="输入资产名称、编号或序列号..." onkeyup="if(event.key==='Enter') faListSearch()">
          <select id="faCatFilter" class="fa-select">
            <option value="">全部分类</option>
            <option>电子设备</option><option>办公家具</option><option>生产设备</option><option>车辆</option>
          </select>
          <select id="faDeptFilter" class="fa-select">
            <option value="">全部部门</option>
            <option>研发部</option><option>生产部</option><option>行政部</option>
            <option>销售部</option><option>财务部</option><option>IT部</option><option>设计部</option>
          </select>
          <select id="faStatusFilter" class="fa-select">
            <option value="">全部状态</option>
            <option value="active">在用</option><option value="idle">闲置</option>
            <option value="repair">维修中</option><option value="pending">待报废</option><option value="retired">已报废</option>
          </select>
          <button class="fa-btn fa-btn-primary" onclick="faListSearch()">🔍 搜索</button>
          <button class="fa-btn" onclick="faListReset()">重置</button>
          <div class="fa-filter-spacer"></div>
          <button class="fa-btn fa-btn-primary" onclick="loadContent('AssetRegister')">＋ 登记资产</button>
          <button class="fa-btn" onclick="alert('批量导入功能开发中')">批量导入</button>
          <button class="fa-btn" onclick="alert('导出功能开发中')">导出 Excel</button>
        </div>
      </div>

      <!-- Tab + 表格 -->
      <div class="fa-card">
        <div class="fa-tabs">
          <button class="fa-tab active" data-status="all" onclick="faListTab('all',this)">全部</button>
          <button class="fa-tab" data-status="active" onclick="faListTab('active',this)">在用</button>
          <button class="fa-tab" data-status="idle" onclick="faListTab('idle',this)">闲置</button>
          <button class="fa-tab" data-status="repair" onclick="faListTab('repair',this)">维修中</button>
          <button class="fa-tab" data-status="pending" onclick="faListTab('pending',this)">待报废</button>
          <button class="fa-tab" data-status="retired" onclick="faListTab('retired',this)">已报废</button>
        </div>
        <div style="overflow-x:auto">
          <table class="fa-table">
            <thead><tr>
              <th style="width:36px"><input type="checkbox" id="faSelectAll" onclick="document.querySelectorAll('.fa-row-cb').forEach(c=>c.checked=this.checked)"></th>
              <th>资产编号 ↑</th><th>资产名称</th><th>分类</th>
              <th style="text-align:right">原值</th><th style="text-align:right">净值</th>
              <th>使用部门</th><th>使用人</th><th>存放地点</th>
              <th>状态</th><th>入账日期</th><th>操作</th>
            </tr></thead>
            <tbody id="faTableBody"></tbody>
          </table>
        </div>
        <div class="fa-pager" id="faPager"></div>
      </div>
    </div>`;

    setTimeout(function() { window.faRenderTable(); }, 0);
    contentArea.innerHTML = contentHTML;
};

// ═══════════════════════════════════════════════════════
// 模块 2：AssetRegister — 资产登记
// ═══════════════════════════════════════════════════════
window.VM_MODULES['AssetRegister'] = function(contentArea, contentHTML, moduleCode) {

    window.faRegisterAutoCode = function() {
        var cat = document.getElementById('faRegCat').value;
        document.getElementById('faRegCode').value = cat ? faNextCode(cat) : '';
    };
    window.faRegisterReset = function() {
        document.getElementById('faRegForm').reset();
        window.faRegisterAutoCode();
    };
    window.faRegisterSubmit = function(isDraft) {
        var name = document.getElementById('faRegName').value.trim();
        var cat  = document.getElementById('faRegCat').value;
        var origVal = parseFloat(document.getElementById('faRegOrigVal').value) || 0;
        var entryDate = document.getElementById('faRegEntryDate').value;
        var dept = document.getElementById('faRegDept').value;
        var location = document.getElementById('faRegLocation').value.trim();
        var usefulLife = parseInt(document.getElementById('faRegLife').value) || 36;
        var residualRate = parseFloat(document.getElementById('faRegResidual').value) || 5;

        if (!isDraft && (!name || !cat || origVal <= 0 || !entryDate || !dept || !location)) {
            alert('请填写所有必填字段（标 * 的字段）'); return;
        }
        var list = faGetList();
        var maxId = list.reduce(function(m,a){ return Math.max(m,a.id); }, 0);
        var newAsset = {
            id: maxId + 1,
            code: document.getElementById('faRegCode').value || faNextCode(cat),
            name: name || '草稿',
            category: cat, subCat: '',
            brand: document.getElementById('faRegBrand').value.trim(),
            model: document.getElementById('faRegModel').value.trim(),
            serialNo: document.getElementById('faRegSerial').value.trim(),
            origVal: origVal, accumDepr: 0,
            dept: dept,
            user: document.getElementById('faRegUser').value,
            location: location,
            status: isDraft ? 'idle' : 'active',
            entryDate: entryDate || new Date().toISOString().slice(0,10),
            deprMethod: document.getElementById('faRegDeprMethod').value || '年限平均法',
            usefulLife: usefulLife, residualRate: residualRate,
            supplier: document.getElementById('faRegSupplier').value,
            invoiceNo: document.getElementById('faRegInvoice').value.trim(),
            purchaseDate: document.getElementById('faRegPurchaseDate').value,
            warrantyEnd: document.getElementById('faRegWarranty').value,
            remark: document.getElementById('faRegRemark').value.trim()
        };
        list.unshift(newAsset);
        faSaveList(list);
        alert(isDraft ? '草稿已保存！' : '✅ 资产【' + newAsset.name + '】登记成功！\n资产编号：' + newAsset.code);
        loadContent('AssetList');
    };

    var today = new Date().toISOString().slice(0,10);
    var initCode = faNextCode('电子设备');

    contentHTML += FA_CSS + `
    <div class="fa-wrap">
      <div class="fa-card">
        <div class="fa-form-hdr">
          <span style="font-size:15px;font-weight:600">新增固定资产</span>
          <button class="fa-btn" onclick="loadContent('AssetList')">← 返回台账</button>
        </div>

        <div class="fa-form-tabs">
          <button class="fa-form-tab active">单件录入</button>
          <button class="fa-form-tab" onclick="alert('批量导入功能开发中')">批量导入</button>
        </div>

        <form id="faRegForm" onsubmit="return false">

        <!-- 基本信息 -->
        <div class="fa-section">
          <div class="fa-section-title"><span class="fa-section-bar"></span>基本信息</div>
          <div class="fa-grid2">
            <div class="fa-field">
              <label class="fa-flabel">资产编号</label>
              <input id="faRegCode" class="fa-finput" disabled value="${initCode}">
              <div class="fa-help">系统自动生成，选择分类后更新</div>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">资产名称 <span class="fa-req">*</span></label>
              <input id="faRegName" class="fa-finput" placeholder="如：ThinkPad X1 Carbon">
            </div>
            <div class="fa-field">
              <label class="fa-flabel">资产分类 <span class="fa-req">*</span></label>
              <select id="faRegCat" class="fa-fselect" onchange="faRegisterAutoCode()">
                <option value="">请选择分类</option>
                <option>电子设备</option><option>办公家具</option><option>生产设备</option><option>车辆</option>
              </select>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">品牌</label>
              <input id="faRegBrand" class="fa-finput" placeholder="请输入品牌">
            </div>
            <div class="fa-field">
              <label class="fa-flabel">型号规格</label>
              <input id="faRegModel" class="fa-finput" placeholder="请输入型号规格">
            </div>
            <div class="fa-field">
              <label class="fa-flabel">序列号</label>
              <input id="faRegSerial" class="fa-finput" placeholder="请输入设备序列号">
            </div>
          </div>
        </div>

        <!-- 财务信息 -->
        <div class="fa-section">
          <div class="fa-section-title"><span class="fa-section-bar"></span>财务信息</div>
          <div class="fa-grid2">
            <div class="fa-field">
              <label class="fa-flabel">资产原值（元）<span class="fa-req">*</span></label>
              <input id="faRegOrigVal" class="fa-finput" type="number" min="0" step="0.01" placeholder="0.00">
              <div class="fa-help">固定资产确认标准：¥5,000.00</div>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">入账日期 <span class="fa-req">*</span></label>
              <input id="faRegEntryDate" class="fa-finput" type="date" value="${today}">
            </div>
            <div class="fa-field">
              <label class="fa-flabel">折旧方法 <span class="fa-req">*</span></label>
              <select id="faRegDeprMethod" class="fa-fselect">
                <option>年限平均法</option>
                <option>双倍余额递减法</option>
                <option>年数总和法</option>
                <option>工作量法</option>
                <option>一次性折旧</option>
              </select>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">预计使用年限（月）<span class="fa-req">*</span></label>
              <input id="faRegLife" class="fa-finput" type="number" min="1" value="36">
              <div class="fa-help">根据分类自动填充，可手动修改</div>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">残值率（%）</label>
              <input id="faRegResidual" class="fa-finput" type="number" min="0" max="100" step="0.1" value="5">
            </div>
          </div>
        </div>

        <!-- 使用信息 -->
        <div class="fa-section">
          <div class="fa-section-title"><span class="fa-section-bar"></span>使用信息</div>
          <div class="fa-grid2">
            <div class="fa-field">
              <label class="fa-flabel">使用部门 <span class="fa-req">*</span></label>
              <select id="faRegDept" class="fa-fselect">
                <option value="">请选择部门</option>
                <option>研发部</option><option>生产部</option><option>行政部</option>
                <option>销售部</option><option>财务部</option><option>IT部</option>
                <option>设计部</option><option>人力资源部</option>
              </select>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">使用人</label>
              <select id="faRegUser" class="fa-fselect">
                <option value="">请选择使用人</option>
                <option>陈明</option><option>张雪</option><option>王芳</option>
                <option>李强</option><option>赵刚</option><option>刘强</option>
              </select>
              <div class="fa-help">选择部门后显示部门下的人员</div>
            </div>
            <div class="fa-field fa-full">
              <label class="fa-flabel">存放地点 <span class="fa-req">*</span></label>
              <input id="faRegLocation" class="fa-finput" placeholder="如：A栋3楼-工位A12">
            </div>
          </div>
        </div>

        <!-- 采购信息 -->
        <div class="fa-section">
          <div class="fa-section-title"><span class="fa-section-bar"></span>采购信息</div>
          <div class="fa-grid2">
            <div class="fa-field">
              <label class="fa-flabel">供应商</label>
              <select id="faRegSupplier" class="fa-fselect">
                <option value="">请选择供应商</option>
                <option>Apple Store 官方</option><option>京东企业购</option>
                <option>联想官方商城</option><option>其他</option>
              </select>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">发票号</label>
              <input id="faRegInvoice" class="fa-finput" placeholder="请输入发票号">
            </div>
            <div class="fa-field">
              <label class="fa-flabel">采购日期</label>
              <input id="faRegPurchaseDate" class="fa-finput" type="date">
            </div>
            <div class="fa-field">
              <label class="fa-flabel">保修截止日</label>
              <input id="faRegWarranty" class="fa-finput" type="date">
            </div>
          </div>
        </div>

        <!-- 附件 -->
        <div class="fa-section">
          <div class="fa-section-title"><span class="fa-section-bar"></span>附件</div>
          <div class="fa-upload-area" onclick="alert('文件上传功能开发中')">
            📄 点击或拖拽上传文件<br>
            <span style="font-size:11px">支持 jpg、png、pdf，单文件不超过 10MB</span>
          </div>
        </div>

        <!-- 备注 -->
        <div class="fa-section">
          <div class="fa-section-title"><span class="fa-section-bar"></span>备注</div>
          <textarea id="faRegRemark" class="fa-ftextarea" placeholder="请输入备注信息（选填）"></textarea>
        </div>

        </form>

        <div class="fa-form-footer">
          <button class="fa-btn fa-btn-primary" onclick="faRegisterSubmit(false)">✓ 提交登记</button>
          <button class="fa-btn" onclick="faRegisterSubmit(true)">保存草稿</button>
          <button class="fa-btn" onclick="faRegisterReset()">重置</button>
        </div>
      </div>
    </div>`;

    contentArea.innerHTML = contentHTML;
};

// ═══════════════════════════════════════════════════════
// 模块 3：AssetDetail — 资产详情
// ═══════════════════════════════════════════════════════
window.VM_MODULES['AssetDetail'] = function(contentArea, contentHTML, moduleCode) {

    window.faDetailSubTab = function(name, el) {
        document.querySelectorAll('.fa-sub-tab').forEach(function(t){ t.classList.remove('active'); });
        document.querySelectorAll('.fa-sub-panel').forEach(function(p){ p.classList.remove('active'); });
        if (el) el.classList.add('active');
        var panel = document.getElementById('faPanel_' + name);
        if (panel) panel.classList.add('active');
    };

    window.faOpenActionModal = function(type) {
        var labels = {transfer:'资产调拨',repair:'送修申请',scrap:'报废申请'};
        document.getElementById('faActionModalTitle').textContent = labels[type] || type;
        document.getElementById('faActionType').value = type;
        document.getElementById('faActionModal').classList.add('show');
    };
    window.faCloseActionModal = function() {
        document.getElementById('faActionModal').classList.remove('show');
    };
    window.faSubmitAction = function() {
        var type = document.getElementById('faActionType').value;
        var reason = document.getElementById('faActionReason').value.trim();
        if (!reason) { alert('请填写操作原因'); return; }
        var id = window._faDetailId;
        var list = faGetList();
        var asset = list.find(function(a){ return a.id === id; });
        if (asset) {
            if (type === 'scrap') asset.status = 'pending';
            if (type === 'repair') asset.status = 'repair';
            if (type === 'transfer') {
                var newDept = document.getElementById('faTransferDept').value;
                var newUser = document.getElementById('faTransferUser').value;
                if (newDept) asset.dept = newDept;
                if (newUser) asset.user = newUser;
            }
            faSaveList(list);
        }
        window.faCloseActionModal();
        alert('✅ 申请已提交！');
        loadContent('AssetDetail');
    };

    contentHTML += FA_CSS;

    var id = window._faDetailId;
    var list = faGetList();
    var asset = list.find(function(a){ return a.id === id; });

    if (!asset) {
        contentArea.innerHTML = contentHTML + '<div class="fa-wrap"><div class="fa-empty">未找到资产记录，请返回台账列表。<br><br><button class="fa-btn fa-btn-primary" onclick="loadContent(\'AssetList\')">← 返回台账</button></div></div>';
        return;
    }

    var net = faNetVal(asset);
    var monthly = faMonthlyDepr(asset);
    var statusInfo = FA_STATUS_MAP[asset.status] || {label:asset.status, cls:'fa-s-retired'};

    // 折旧明细（最近12个月 + 入账月）
    var deprRows = '';
    var entryParts = asset.entryDate.split('-');
    var entryY = parseInt(entryParts[0]), entryM = parseInt(entryParts[1]);
    var accum = 0;
    var curDate = new Date();
    var curY = curDate.getFullYear(), curM = curDate.getMonth() + 1;
    for (var mi = 0; mi < Math.min(asset.usefulLife + 1, 13); mi++) {
        var y = entryY, m = entryM + mi;
        while (m > 12) { m -= 12; y++; }
        var isEntry = mi === 0;
        var isFuture = (y > curY) || (y === curY && m > curM);
        var deprAmt = isEntry ? 0 : monthly;
        var prevNet = asset.origVal - accum;
        accum += deprAmt;
        var endNet = asset.origVal - accum;
        var cls = isEntry ? 'fa-entry-month' : (isFuture ? 'fa-pending' : '');
        deprRows += '<tr class="' + cls + '">' +
            '<td>' + y + '-' + String(m).padStart(2,'0') + (isEntry ? '（入账月，不计提）' : isFuture ? '（待计提）' : '') + '</td>' +
            '<td>' + faFmt(prevNet) + '</td>' +
            '<td>' + faFmt(deprAmt) + '</td>' +
            '<td>' + faFmt(accum) + '</td>' +
            '<td>' + faFmt(endNet) + '</td>' +
        '</tr>';
    }

    contentHTML += `
    <div class="fa-wrap">
      <!-- 顶部卡片 -->
      <div class="fa-card">
        <div class="fa-detail-top">
          <div style="flex:1">
            <div class="fa-detail-name">${asset.name}</div>
            <div class="fa-detail-badges">${faStatusBadge(asset.status)}</div>
            <div class="fa-detail-meta">
              <span>资产编号：<strong>${asset.code}</strong></span>
              <span>分类：${asset.category}${asset.subCat ? ' - ' + asset.subCat : ''}</span>
              <span>入账日期：${asset.entryDate}</span>
            </div>
          </div>
          <div class="fa-detail-actions">
            <button class="fa-btn fa-btn-primary" onclick="loadContent('AssetRegister')">编辑</button>
            <button class="fa-btn" onclick="faOpenActionModal('transfer')">调拨</button>
            <button class="fa-btn" onclick="faOpenActionModal('repair')">送修</button>
            <button class="fa-btn fa-btn-danger" onclick="faOpenActionModal('scrap')">报废</button>
            <button class="fa-btn" onclick="loadContent('AssetList')">← 返回列表</button>
          </div>
        </div>
      </div>

      <!-- 信息卡片网格 -->
      <div class="fa-info-grid">
        <div class="fa-info-card">
          <div class="fa-info-card-title">基本信息</div>
          <div class="fa-info-row"><span class="fa-info-lbl">资产名称</span><span class="fa-info-val">${asset.name}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">资产编号</span><span class="fa-info-val">${asset.code}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">资产分类</span><span class="fa-info-val">${asset.category}${asset.subCat ? ' > ' + asset.subCat : ''}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">品牌</span><span class="fa-info-val">${asset.brand || '–'}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">型号</span><span class="fa-info-val">${asset.model || '–'}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">序列号</span><span class="fa-info-val">${asset.serialNo || '–'}</span></div>
        </div>
        <div class="fa-info-card">
          <div class="fa-info-card-title">财务信息</div>
          <div class="fa-info-row"><span class="fa-info-lbl">资产原值</span><span class="fa-info-val blue">${faFmt(asset.origVal)}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">累计折旧</span><span class="fa-info-val">${faFmt(asset.accumDepr)}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">资产净值</span><span class="fa-info-val blue">${faFmt(net)}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">折旧方法</span><span class="fa-info-val">${asset.deprMethod}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">预计使用</span><span class="fa-info-val">${asset.usefulLife} 个月（${Math.round(asset.usefulLife/12*10)/10} 年）</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">月折旧额</span><span class="fa-info-val">${faFmt(monthly)}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">残值率</span><span class="fa-info-val">${asset.residualRate}%</span></div>
        </div>
        <div class="fa-info-card">
          <div class="fa-info-card-title">使用信息</div>
          <div class="fa-info-row"><span class="fa-info-lbl">使用部门</span><span class="fa-info-val">${asset.dept}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">使用人</span><span class="fa-info-val">${asset.user || '–'}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">存放地点</span><span class="fa-info-val">${asset.location || '–'}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">使用状态</span><span class="fa-info-val">${faStatusBadge(asset.status)}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">备注</span><span class="fa-info-val">${asset.remark || '–'}</span></div>
        </div>
        <div class="fa-info-card">
          <div class="fa-info-card-title">采购信息</div>
          <div class="fa-info-row"><span class="fa-info-lbl">供应商</span><span class="fa-info-val">${asset.supplier || '–'}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">发票号</span><span class="fa-info-val">${asset.invoiceNo || '–'}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">采购日期</span><span class="fa-info-val">${asset.purchaseDate || '–'}</span></div>
          <div class="fa-info-row"><span class="fa-info-lbl">保修截止</span><span class="fa-info-val">${asset.warrantyEnd || '–'}</span></div>
        </div>
      </div>

      <!-- 折旧明细 & 变动记录 -->
      <div class="fa-card">
        <div class="fa-sub-tabs">
          <button class="fa-sub-tab active" onclick="faDetailSubTab('depr',this)">折旧明细</button>
          <button class="fa-sub-tab" onclick="faDetailSubTab('log',this)">变动记录</button>
        </div>

        <!-- 折旧明细 -->
        <div id="faPanel_depr" class="fa-sub-panel active" style="padding:16px;overflow-x:auto">
          <table class="fa-depr-table">
            <thead><tr>
              <th style="text-align:left">月份</th>
              <th>期初净值</th><th>本月折旧</th><th>累计折旧</th><th>期末净值</th>
            </tr></thead>
            <tbody>${deprRows}</tbody>
          </table>
          <div style="font-size:11px;color:#9ca3af;margin-top:8px">* 灰色行为待计提；入账月当月不计提折旧</div>
        </div>

        <!-- 变动记录时间线 -->
        <div id="faPanel_log" class="fa-sub-panel" style="padding:16px 20px">
          <div class="fa-timeline">
            <div class="fa-tl-item">
              <div class="fa-tl-dot filled"></div>
              <div class="fa-tl-content">
                <div class="fa-tl-time">${asset.entryDate} 14:30</div>
                <div class="fa-tl-title">资产登记</div>
                <div class="fa-tl-desc">新购入 ${asset.name}，分配给 ${asset.dept}${asset.user ? ' / ' + asset.user : ''} 使用，存放于 ${asset.location || '–'}</div>
              </div>
            </div>
            <div class="fa-tl-item">
              <div class="fa-tl-dot"></div>
              <div class="fa-tl-content">
                <div class="fa-tl-time">${asset.entryDate} 15:00</div>
                <div class="fa-tl-title">标签打印</div>
                <div class="fa-tl-desc">已打印资产标签，编号：${asset.code}</div>
              </div>
            </div>
            ${asset.status === 'repair' ? `<div class="fa-tl-item">
              <div class="fa-tl-dot"></div>
              <div class="fa-tl-content">
                <div class="fa-tl-time">送修中</div>
                <div class="fa-tl-title">送修申请</div>
                <div class="fa-tl-desc">资产已送修，等待返回</div>
              </div>
            </div>` : ''}
            ${asset.status === 'pending' ? `<div class="fa-tl-item">
              <div class="fa-tl-dot"></div>
              <div class="fa-tl-content">
                <div class="fa-tl-time">待处理</div>
                <div class="fa-tl-title">报废申请</div>
                <div class="fa-tl-desc">已提交报废申请，等待审批</div>
              </div>
            </div>` : ''}
          </div>
        </div>
      </div>
    </div>

    <!-- 操作申请弹窗 -->
    <div id="faActionModal" class="fa-modal">
      <div class="fa-modal-box">
        <div class="fa-modal-hdr">
          <span class="fa-modal-title" id="faActionModalTitle">资产调拨</span>
          <button class="fa-modal-close" onclick="faCloseActionModal()">×</button>
        </div>
        <div class="fa-modal-bdy">
          <input type="hidden" id="faActionType">
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;padding:10px 14px;margin-bottom:16px;font-size:12px;color:#1e40af">
            <strong>${asset.code}</strong> ${asset.name} | ${asset.dept}${asset.user ? ' / ' + asset.user : ''}
          </div>
          <div id="faTransferFields" class="fa-grid2" style="margin-bottom:14px">
            <div class="fa-field">
              <label class="fa-flabel">目标部门</label>
              <select id="faTransferDept" class="fa-fselect">
                <option value="">请选择</option>
                <option>研发部</option><option>生产部</option><option>行政部</option>
                <option>销售部</option><option>财务部</option><option>IT部</option><option>设计部</option>
              </select>
            </div>
            <div class="fa-field">
              <label class="fa-flabel">目标使用人</label>
              <select id="faTransferUser" class="fa-fselect">
                <option value="">请选择</option>
                <option>陈明</option><option>张雪</option><option>王芳</option>
                <option>李强</option><option>赵刚</option><option>刘强</option>
              </select>
            </div>
          </div>
          <div class="fa-field">
            <label class="fa-flabel">操作原因 <span class="fa-req">*</span></label>
            <textarea id="faActionReason" class="fa-ftextarea" placeholder="请填写操作原因..." style="min-height:80px"></textarea>
          </div>
        </div>
        <div class="fa-modal-ftr">
          <button class="fa-btn" onclick="faCloseActionModal()">取消</button>
          <button class="fa-btn fa-btn-primary" onclick="faSubmitAction()">确认提交</button>
        </div>
      </div>
    </div>`;

    // 遮罩点击关闭弹窗
    setTimeout(function() {
        var modal = document.getElementById('faActionModal');
        if (modal) {
            modal.addEventListener('click', function(e){ if(e.target===modal) window.faCloseActionModal(); });
        }
    }, 0);

    contentArea.innerHTML = contentHTML;
};

})(); // end IIFE
