// js/core/modules/hr/employee.js
// ========================================================
// 员工花名册模块 — 列表页 + 编辑页（通过 VM_MODULES 注册）
// ========================================================

// ── 数据标准化 ──────────────────────────────────────────
window.normalizeHREmployee = function(emp, index) {
    index = index || 0;
    const s = emp || {};
    return {
        id:               s.id               || `EMP${String(index + 1).padStart(3, '0')}`,
        name:             s.name             || '',
        gender:           s.gender           || '',
        phone:            s.phone            || '',
        email:            s.email            || '',
        idCard:           s.idCard           || '',
        birthDate:        s.birthDate        || '',
        contractEntity:   s.contractEntity   || '',
        dept1:            s.dept1            || s.dept || '',
        dept2:            s.dept2            || '',
        position:         s.position         || '',
        level:            s.level            || '',
        supervisor:       s.supervisor       || '',
        empType:          s.empType          || '正式员工',
        joinDate:         s.joinDate         || '',
        status:           s.status           || '在职',
        bankAccount:      s.bankAccount      || '',
        salaryBase:       parseFloat(s.salaryBase)        || 0,
        positionSalary:   parseFloat(s.positionSalary)    || 0,
        salaryPerformance:parseFloat(s.salaryPerformance) || 0,
        socialSecurityBase:  parseFloat(s.socialSecurityBase)   || 0,
        providentFundBase:   parseFloat(s.providentFundBase)    || 0,
        // 兼容旧字段
        dept: s.dept1 || s.dept || ''
    };
};

window.getHREmployees = function() {
    const raw = sessionStorage.getItem('HREmployees');
    if (!raw) return [];
    return JSON.parse(raw).map((item, i) => window.normalizeHREmployee(item, i));
};

window._hrInitSeed = function() {
    if (sessionStorage.getItem('HREmployees')) return;
    const seed = [
        { id:'EMP001', name:'王建国', gender:'男', phone:'13800000001', email:'wangjg@lxzy.com', contractEntity:'乐享智运（南京）有限公司', dept1:'运营部', dept2:'干线运营组', position:'运营总监', level:'M3', supervisor:'张总', empType:'正式员工', joinDate:'2022-03-01', status:'在职', bankAccount:'6222 0210 0100 0001', salaryBase:18000, positionSalary:5000, salaryPerformance:8000, socialSecurityBase:18000, providentFundBase:18000 },
        { id:'EMP002', name:'刘晓燕', gender:'女', phone:'13800000002', email:'liuxy@lxzy.com', contractEntity:'乐享智运（南京）有限公司', dept1:'财务部', dept2:'', position:'财务经理', level:'M2', supervisor:'王建国', empType:'正式员工', joinDate:'2022-05-15', status:'在职', bankAccount:'6222 0210 0100 0002', salaryBase:12000, positionSalary:3000, salaryPerformance:4000, socialSecurityBase:12000, providentFundBase:12000 },
        { id:'EMP003', name:'陈志远', gender:'男', phone:'13800000003', email:'chenzhy@lxzy.com', contractEntity:'乐享智运（南京）有限公司', dept1:'技术部', dept2:'研发组', position:'高级工程师', level:'P5', supervisor:'王建国', empType:'正式员工', joinDate:'2023-01-10', status:'在职', bankAccount:'6222 0210 0100 0003', salaryBase:20000, positionSalary:4000, salaryPerformance:6000, socialSecurityBase:20000, providentFundBase:20000 },
        { id:'EMP004', name:'赵梦洁', gender:'女', phone:'13800000004', email:'zhaomj@lxzy.com', contractEntity:'乐享智运（南京）有限公司', dept1:'销售部', dept2:'华东区', position:'销售主管', level:'P4', supervisor:'王建国', empType:'正式员工', joinDate:'2023-06-01', status:'在职', bankAccount:'6222 0210 0100 0004', salaryBase:9000, positionSalary:2000, salaryPerformance:5000, socialSecurityBase:9000, providentFundBase:9000 },
        { id:'EMP005', name:'孙磊', gender:'男', phone:'13800000005', email:'sunl@lxzy.com', contractEntity:'乐享智运（南京）有限公司', dept1:'运营部', dept2:'短驳组', position:'调度专员', level:'P2', supervisor:'王建国', empType:'正式员工', joinDate:'2024-03-15', status:'在职', bankAccount:'6222 0210 0100 0005', salaryBase:7000, positionSalary:1000, salaryPerformance:2000, socialSecurityBase:7000, providentFundBase:7000 },
        { id:'EMP006', name:'李婷', gender:'女', phone:'13800000006', email:'lit@lxzy.com', contractEntity:'乐享智运（南京）有限公司', dept1:'人事行政部', dept2:'', position:'HR专员', level:'P2', supervisor:'刘晓燕', empType:'试用期', joinDate:'2026-04-01', status:'在职', bankAccount:'6222 0210 0100 0006', salaryBase:6000, positionSalary:0, salaryPerformance:1500, socialSecurityBase:6000, providentFundBase:6000 },
        { id:'EMP007', name:'张伟', gender:'男', phone:'13800000007', email:'zhangw@lxzy.com', contractEntity:'乐享智运（南京）有限公司', dept1:'销售部', dept2:'华东区', position:'业务员', level:'P1', supervisor:'赵梦洁', empType:'正式员工', joinDate:'2023-09-01', status:'离职', bankAccount:'6222 0210 0100 0007', salaryBase:0, positionSalary:0, salaryPerformance:0, socialSecurityBase:0, providentFundBase:0 }
    ];
    sessionStorage.setItem('HREmployees', JSON.stringify(seed));
};

// ── 增删改 ───────────────────────────────────────────────
window.editEmployee = function(id) {
    const list = window.getHREmployees();
    const emp  = list.find(e => e.id === id);
    if (!emp) { alert('未找到该员工档案'); return; }
    window.g_currentEmployee = emp;
    loadContent('HREmployeeEdit');
};

window.addEmployee = function() {
    const list = window.getHREmployees();
    const maxNo = list.reduce((m, e) => {
        const n = parseInt((e.id || '').replace(/\D/g, ''), 10);
        return isNaN(n) ? m : Math.max(m, n);
    }, 0);
    const newEmp = window.normalizeHREmployee({
        id: `EMP${String(maxNo + 1).padStart(3, '0')}`,
        name: '新员工',
        status: '在职',
        empType: '试用期',
        joinDate: new Date().toISOString().slice(0, 10)
    }, list.length);
    list.unshift(newEmp);
    sessionStorage.setItem('HREmployees', JSON.stringify(list));
    window.g_currentEmployee = newEmp;
    loadContent('HREmployeeEdit');
};

window.deleteEmployee = function(id) {
    if (!confirm('确认删除该员工档案？此操作不可恢复。')) return;
    let list = window.getHREmployees();
    list = list.filter(e => e.id !== id);
    sessionStorage.setItem('HREmployees', JSON.stringify(list));
    loadContent('HREmployee');
};

window.saveEmployeeDetail = function() {
    const empId = document.getElementById('emp-id').value;
    let list  = window.getHREmployees();
    let index = list.findIndex(e => e.id === empId);
    if (index === -1) { alert('保存失败：员工不存在'); return; }

    const g = id => (document.getElementById(id) || {}).value || '';
    list[index] = {
        ...list[index],
        name:             g('emp-name'),
        gender:           g('emp-gender'),
        phone:            g('emp-phone'),
        email:            g('emp-email'),
        status:           g('emp-status'),
        contractEntity:   g('emp-contract'),
        dept1:            g('emp-dept1'),
        dept2:            g('emp-dept2'),
        position:         g('emp-position'),
        level:            g('emp-level'),
        supervisor:       g('emp-supervisor'),
        empType:          g('emp-emptype'),
        bankAccount:      g('emp-bank'),
        salaryBase:           parseFloat(g('emp-salary-base'))   || 0,
        positionSalary:       parseFloat(g('emp-pos-salary'))    || 0,
        salaryPerformance:    parseFloat(g('emp-salary-perf'))   || 0,
        socialSecurityBase:   parseFloat(g('emp-ss-base'))       || 0,
        providentFundBase:    parseFloat(g('emp-fund-base'))     || 0,
        dept: g('emp-dept1')
    };
    sessionStorage.setItem('HREmployees', JSON.stringify(list));

    if (typeof addDataChangeLog === 'function') {
        addDataChangeLog({ time: new Date().toLocaleString(), user: '管理员', object: '员工档案', objId: empId, field: '信息更新', oldVal: '-', newVal: '-' });
    }
    alert('✅ 保存成功！');
    loadContent('HREmployee');
};

// ── 列表页筛选 ──────────────────────────────────────────
window.hrEmpRenderTable = function() {
    const kw    = (document.getElementById('hr-kw')     || {}).value || '';
    const dept  = (document.getElementById('hr-dept')   || {}).value || '';
    const etype = (document.getElementById('hr-etype')  || {}).value || '';
    const st    = (document.getElementById('hr-status') || {}).value || '';
    const list  = window.getHREmployees();

    const filtered = list.filter(e => {
        if (kw && !`${e.name}${e.id}${e.phone}`.includes(kw)) return false;
        if (dept  && e.dept1 !== dept)  return false;
        if (etype && e.empType !== etype) return false;
        if (st    && e.status !== st)   return false;
        return true;
    });

    const STATUS_STYLE = {
        '在职':  'color:#27ae60; background:#f0fdf4; border:1px solid #d1fae5;',
        '离职':  'color:#999;    background:#f5f5f5; border:1px solid #e5e5e5;',
        '试用期':'color:#f39c12; background:#fffbeb; border:1px solid #fde68a;',
        '休假':  'color:#3498db; background:#eff6ff; border:1px solid #bfdbfe;'
    };
    const LEVEL_COLOR = { M: '#7c3aed', P: '#2563eb', T: '#0891b2' };

    const rows = filtered.map(e => {
        const sStyle = STATUS_STYLE[e.status] || 'color:#999;';
        const lvPrefix = (e.level || '').charAt(0);
        const lvColor  = LEVEL_COLOR[lvPrefix] || '#555';
        const joinYear = (e.joinDate || '').slice(0, 4);
        const thisYear = String(new Date().getFullYear());
        const isNew    = joinYear === thisYear;
        return `<tr style="${e.status === '离职' ? 'color:#aaa;' : ''}">
            <td style="font-family:monospace; color:#666; font-size:12px;">${e.id}</td>
            <td><strong style="color:${e.status === '离职' ? '#bbb' : '#2c3e50'};">${e.name}</strong>${isNew ? ' <span style="font-size:11px;background:#fee2e2;color:#dc2626;border-radius:3px;padding:1px 5px;">新</span>' : ''}</td>
            <td style="color:#666;">${e.gender || '—'}</td>
            <td>${e.dept1 || '—'}${e.dept2 ? `<br><span style="font-size:11px;color:#999;">${e.dept2}</span>` : ''}</td>
            <td>${e.position || '—'}</td>
            <td><span style="font-size:12px;font-weight:bold;color:${lvColor};">${e.level || '—'}</span></td>
            <td><span style="font-size:12px;color:#666;">${e.empType || '—'}</span></td>
            <td style="font-size:12px;color:#888;">${e.joinDate || '—'}</td>
            <td style="font-size:12px;">${e.phone || '—'}</td>
            <td><span style="padding:2px 8px;border-radius:20px;font-size:12px;${sStyle}">${e.status}</span></td>
            <td>
                <a href="javascript:void(0)" onclick="editEmployee('${e.id}')" style="color:#3498db;font-size:13px;">编辑</a>
                ${e.status === '离职' ? `<span style="color:#ddd;margin:0 4px;">|</span><a href="javascript:void(0)" onclick="deleteEmployee('${e.id}')" style="color:#e74c3c;font-size:13px;">删除</a>` : ''}
            </td>
        </tr>`;
    }).join('');

    const tbody = document.getElementById('hr-tbody');
    const empty = document.getElementById('hr-empty');
    const count = document.getElementById('hr-count');
    if (tbody) tbody.innerHTML = rows || '';
    if (empty) empty.style.display = filtered.length ? 'none' : 'block';
    if (count) count.textContent = `共 ${filtered.length} 人`;
};

window.hrEmpReset = function() {
    ['hr-kw','hr-dept','hr-etype','hr-status'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    window.hrEmpRenderTable();
};

// ══════════════════════════════════════════════════════════
// VM_MODULES 注册 — 列表页 (HREmployee)
// ══════════════════════════════════════════════════════════
window.VM_MODULES = window.VM_MODULES || {};

window.VM_MODULES['HREmployee'] = function(contentArea) {
    window._hrInitSeed();
    const list = window.getHREmployees();

    // ── 统计 ──
    const now       = new Date();
    const thisYear  = now.getFullYear();
    const thisMonth = `${thisYear}-${String(now.getMonth()+1).padStart(2,'0')}`;

    const activeList  = list.filter(e => e.status !== '离职');
    const depts       = [...new Set(activeList.map(e => e.dept1).filter(Boolean))];
    const newThisYear = list.filter(e => (e.joinDate||'').startsWith(String(thisYear)));
    const probation   = activeList.filter(e => e.empType === '试用期');

    // ── 部门/类型选项 ──
    const deptOpts  = depts.map(d => `<option value="${d}">${d}</option>`).join('');
    const etypeOpts = ['正式员工','试用期','实习生','劳务派遣','外包'].map(t =>
        `<option value="${t}">${t}</option>`).join('');

    const html = `
<div style="font-size:13px;color:#999;margin-bottom:16px;">人事中心 / 员工花名册</div>

<!-- 统计卡片 -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;">
    ${[
        { label:'在职员工', val: activeList.length,   unit:'人', color:'#27ae60', bg:'#f0fdf4' },
        { label:'部门数量', val: depts.length,         unit:'个', color:'#3498db', bg:'#eff6ff' },
        { label:'今年入职', val: newThisYear.length,   unit:'人', color:'#f39c12', bg:'#fffbeb' },
        { label:'试用期中', val: probation.length,     unit:'人', color:'#e74c3c', bg:'#fff5f5' }
    ].map(c => `
        <div style="background:#fff;border-radius:10px;padding:18px 20px;box-shadow:0 2px 8px rgba(0,0,0,0.06);border-left:4px solid ${c.color};">
            <div style="font-size:12px;color:#999;margin-bottom:6px;">${c.label}</div>
            <div style="font-size:28px;font-weight:700;color:${c.color};">${c.val}<span style="font-size:14px;font-weight:400;margin-left:2px;">${c.unit}</span></div>
        </div>`).join('')}
</div>

<!-- 工具栏 -->
<div style="background:#fff;border-radius:10px;padding:14px 16px;box-shadow:0 2px 5px rgba(0,0,0,0.05);margin-bottom:14px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
    <input id="hr-kw" type="text" placeholder="搜索姓名 / 工号 / 手机" oninput="hrEmpRenderTable()"
        style="padding:7px 12px;border:1px solid #ddd;border-radius:6px;font-size:13px;width:200px;outline:none;">
    <select id="hr-dept" onchange="hrEmpRenderTable()"
        style="padding:7px 10px;border:1px solid #ddd;border-radius:6px;font-size:13px;color:#555;">
        <option value="">全部部门</option>${deptOpts}
    </select>
    <select id="hr-etype" onchange="hrEmpRenderTable()"
        style="padding:7px 10px;border:1px solid #ddd;border-radius:6px;font-size:13px;color:#555;">
        <option value="">全部类型</option>${etypeOpts}
    </select>
    <select id="hr-status" onchange="hrEmpRenderTable()"
        style="padding:7px 10px;border:1px solid #ddd;border-radius:6px;font-size:13px;color:#555;">
        <option value="">全部状态</option>
        <option value="在职">在职</option>
        <option value="离职">离职</option>
        <option value="休假">休假</option>
    </select>
    <button onclick="hrEmpReset()" style="padding:7px 14px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;font-size:13px;cursor:pointer;">重置</button>
    <span id="hr-count" style="color:#999;font-size:12px;margin-left:4px;"></span>
    <div style="margin-left:auto;display:flex;gap:8px;">
        <button class="btn-primary" style="background:#27ae60;padding:7px 16px;font-size:13px;" onclick="addEmployee()">+ 新增员工</button>
    </div>
</div>

<!-- 表格 -->
<div style="background:#fff;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.05);overflow:hidden;">
    <table class="data-table" style="box-shadow:none;border-radius:0;">
        <thead>
            <tr>
                <th style="width:80px;">工号</th>
                <th>姓名</th>
                <th style="width:50px;">性别</th>
                <th>部门</th>
                <th>岗位</th>
                <th style="width:60px;">职级</th>
                <th>人员类别</th>
                <th style="width:100px;">入职日期</th>
                <th style="width:110px;">手机号</th>
                <th style="width:70px;">状态</th>
                <th style="width:80px;">操作</th>
            </tr>
        </thead>
        <tbody id="hr-tbody"></tbody>
    </table>
    <div id="hr-empty" style="display:none;text-align:center;padding:40px;color:#ccc;font-size:14px;">暂无符合条件的员工数据</div>
</div>`;

    contentArea.innerHTML = html;
    window.hrEmpRenderTable();
};

// ══════════════════════════════════════════════════════════
// VM_MODULES 注册 — 编辑页 (HREmployeeEdit)
// ══════════════════════════════════════════════════════════
window.VM_MODULES['HREmployeeEdit'] = function(contentArea) {
    const emp = window.g_currentEmployee || {};
    const isNew = !emp.joinDate;

    const field = (label, id, val, type, opts) => {
        type = type || 'text';
        if (type === 'select') {
            const options = (opts || []).map(o =>
                `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('');
            return `<div>
                <label style="display:block;font-size:12px;color:#888;margin-bottom:5px;">${label}</label>
                <select id="${id}" style="width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:6px;font-size:13px;outline:none;">
                    <option value="">—请选择—</option>${options}
                </select>
            </div>`;
        }
        const readonly = type === 'readonly';
        return `<div>
            <label style="display:block;font-size:12px;color:#888;margin-bottom:5px;">${label}</label>
            <input type="${readonly ? 'text' : type}" id="${id}" value="${val || ''}"
                ${readonly ? 'disabled' : ''}
                style="width:100%;padding:8px 10px;border:1px solid ${readonly ? '#eee' : '#ddd'};border-radius:6px;font-size:13px;box-sizing:border-box;${readonly ? 'background:#f9f9f9;color:#aaa;' : ''}outline:none;">
        </div>`;
    };

    const card = (title, color, body) => `
        <div style="background:#fff;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.06);margin-bottom:20px;overflow:hidden;">
            <div style="padding:14px 20px;border-bottom:1px solid #f0f0f0;border-top:3px solid ${color};display:flex;align-items:center;gap:8px;">
                <span style="font-size:15px;font-weight:600;color:#2c3e50;">${title}</span>
            </div>
            <div style="padding:20px;">${body}</div>
        </div>`;

    const grid = (cols, items) =>
        `<div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:16px;">${items.join('')}</div>`;

    const html = `
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
    <div style="display:flex;align-items:center;gap:10px;">
        <button onclick="loadContent('HREmployee')" style="padding:7px 14px;border:1px solid #ddd;border-radius:6px;background:#f5f5f5;font-size:13px;cursor:pointer;">← 返回列表</button>
        <h2 style="margin:0;font-size:17px;color:#2c3e50;">${emp.name ? `编辑员工：<span style="color:#3498db;">${emp.name}</span>` : '新增员工'}</h2>
    </div>
    <div style="display:flex;gap:10px;">
        ${emp.id && emp.status === '离职' ? `<button onclick="deleteEmployee('${emp.id}')" style="padding:7px 16px;border:1px solid #e74c3c;border-radius:6px;background:#fff;color:#e74c3c;font-size:13px;cursor:pointer;">删除档案</button>` : ''}
        <button class="btn-primary" style="background:#27ae60;padding:7px 22px;" onclick="saveEmployeeDetail()">💾 保存更改</button>
    </div>
</div>

<div style="max-width:900px;">

${card('基本信息', '#3498db', grid(3, [
    field('工号（不可修改）',    'emp-id',     emp.id,      'readonly'),
    field('姓名',               'emp-name',   emp.name,    'text'),
    field('性别',               'emp-gender', emp.gender,  'select', ['男','女']),
    field('手机号码',           'emp-phone',  emp.phone,   'text'),
    field('邮箱',               'emp-email',  emp.email,   'text'),
    field('在职状态',           'emp-status', emp.status,  'select', ['在职','离职','休假']),
]))}

${card('岗位与职级', '#e74c3c', `
${grid(3, [
    field('合同主体',   'emp-contract',   emp.contractEntity,  'text'),
    field('一级部门',   'emp-dept1',      emp.dept1,           'text'),
    field('二级部门',   'emp-dept2',      emp.dept2,           'text'),
    field('岗位',       'emp-position',   emp.position,        'text'),
    field('职级',       'emp-level',      emp.level,           'select', ['P1','P2','P3','P4','P5','P6','M1','M2','M3','M4','T1','T2','T3']),
    field('上级主管',   'emp-supervisor', emp.supervisor,      'text'),
    field('人员类别',   'emp-emptype',    emp.empType,         'select', ['正式员工','试用期','实习生','劳务派遣','外包']),
    field('入职日期',   'emp-joindate',   emp.joinDate,        'readonly'),
    `<div></div>`
])}
<div style="margin-top:12px;padding:10px 14px;background:#fff5f5;border:1px solid #fee2e2;border-radius:6px;font-size:12px;color:#b91c1c;">
    ⚠️ 岗位、职级变更后请同步确认薪酬设置是否需要调整
</div>`)}

${card('薪酬设置', '#f39c12', `
${grid(3, [
    field('基本工资（元/月）',     'emp-salary-base',  emp.salaryBase,          'number'),
    field('岗位工资（元/月）',     'emp-pos-salary',   emp.positionSalary,      'number'),
    field('绩效基数（元/月）',     'emp-salary-perf',  emp.salaryPerformance,   'number'),
    field('社保缴纳基数',          'emp-ss-base',      emp.socialSecurityBase,  'number'),
    field('公积金缴纳基数',        'emp-fund-base',    emp.providentFundBase,   'number'),
    field('银行卡号（发薪用）',    'emp-bank',         emp.bankAccount,         'text'),
])}
<div style="margin-top:16px;padding:12px 16px;background:#f8fafc;border-radius:6px;font-size:13px;color:#555;">
    💰 综合薪资预览：
    <strong style="color:#27ae60;font-size:16px;margin-left:8px;">
        ¥${((emp.salaryBase||0)+(emp.positionSalary||0)+(emp.salaryPerformance||0)).toLocaleString()}
    </strong>
    <span style="color:#999;font-size:12px;margin-left:6px;">（固定 + 岗位 + 绩效满额）</span>
</div>`)}

</div>`;

    contentArea.innerHTML = html;
};
