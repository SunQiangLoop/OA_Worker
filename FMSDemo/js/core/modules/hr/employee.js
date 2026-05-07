// js/modules/hr/employee.js

window.normalizeHREmployee = function(emp, index = 0) {
    const safe = emp || {};
    return {
        id: safe.id || `EMP${String(index + 1).padStart(3, '0')}`,
        name: safe.name || '',
        dept: safe.dept || '',
        position: safe.position || '',
        level: safe.level || 'P1',
        bankAccount: safe.bankAccount || '',
        status: safe.status || '在职',
        joinDate: safe.joinDate || '',
        salaryBase: parseFloat(safe.salaryBase) || 0,
        positionSalary: parseFloat(safe.positionSalary) || 0,
        salaryPerformance: parseFloat(safe.salaryPerformance) || 0,
        socialSecurityBase: parseFloat(safe.socialSecurityBase) || 0,
        providentFundBase: parseFloat(safe.providentFundBase) || 0
    };
};

window.getHREmployees = function() {
    const list = JSON.parse(sessionStorage.getItem('HREmployees') || "[]");
    return list.map((item, index) => window.normalizeHREmployee(item, index));
};

// [新版] 编辑员工：跳转到详情页，而不是弹窗
window.editEmployee = function(id) {
    let list = window.getHREmployees();
    let emp = list.find(e => e.id === id);
    
    if (!emp) return alert("❌ 未找到该员工档案。");

    // 1. 将当前要编辑的员工存入全局变量，供页面读取
    window.g_currentEmployee = emp;
    
    // 2. 跳转到编辑页面
    loadContent('HREmployeeEdit');
}

window.addEmployee = function() {
    const list = window.getHREmployees();
    const nextNo = list.reduce((max, item) => {
        const num = parseInt(String(item.id || '').replace(/\D/g, ''), 10);
        return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0) + 1;

    const newEmp = window.normalizeHREmployee({
        id: `EMP${String(nextNo).padStart(3, '0')}`,
        name: '新员工',
        dept: '待分配',
        position: '待定岗',
        level: 'P1',
        status: '在职',
        joinDate: new Date().toISOString().slice(0, 10),
        bankAccount: '',
        salaryBase: 0,
        positionSalary: 0,
        salaryPerformance: 0,
        socialSecurityBase: 0,
        providentFundBase: 0
    }, list.length);

    list.unshift(newEmp);
    sessionStorage.setItem('HREmployees', JSON.stringify(list));
    window.g_currentEmployee = newEmp;
    loadContent('HREmployeeEdit');
};

// [新版] 保存员工信息 (在详情页点击保存时调用)
window.saveEmployeeDetail = function() {
    const empId = document.getElementById('emp-id').value;
    
    let list = window.getHREmployees();
    let index = list.findIndex(e => e.id === empId);
    
    if (index === -1) return alert("保存失败：员工不存在");
    
    const oldData = list[index];

    // 构造新数据
    const newEmp = {
        ...oldData,
        name: document.getElementById('emp-name').value,
        dept: document.getElementById('emp-dept').value,
        position: document.getElementById('emp-pos').value,
        level: document.getElementById('emp-level').value,
        bankAccount: document.getElementById('emp-bank').value,
        status: document.getElementById('emp-status').value,
        
        // 薪资部分
        salaryBase: parseFloat(document.getElementById('emp-salary-base').value) || 0,
        positionSalary: parseFloat(document.getElementById('emp-position-salary').value) || 0,
        salaryPerformance: parseFloat(document.getElementById('emp-salary-perf').value) || 0,
        socialSecurityBase: parseFloat(document.getElementById('emp-ss-base').value) || 0,
        providentFundBase: parseFloat(document.getElementById('emp-fund-base').value) || 0 
    };

    // 更新列表
    list[index] = newEmp;
    sessionStorage.setItem('HREmployees', JSON.stringify(list));

    // 记日志
    if (typeof addDataChangeLog === 'function') {
        addDataChangeLog({
            time: new Date().toLocaleString(),
            user: '当前用户',
            object: '员工档案',
            objId: empId,
            field: '全量更新',
            oldVal: '查看详情',
            newVal: '查看详情'
        });
    }

    alert("✅ 保存成功！");
    loadContent('HREmployee'); // 返回列表页
}
