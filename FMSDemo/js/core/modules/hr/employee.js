// js/modules/hr/employee.js

// [新版] 编辑员工：跳转到详情页，而不是弹窗
window.editEmployee = function(id) {
    let list = JSON.parse(sessionStorage.getItem('HREmployees') || "[]");
    let emp = list.find(e => e.id === id);
    
    if (!emp) return alert("❌ 未找到该员工档案。");

    // 1. 将当前要编辑的员工存入全局变量，供页面读取
    window.g_currentEmployee = emp;
    
    // 2. 跳转到编辑页面
    loadContent('HREmployeeEdit');
}

// [新版] 保存员工信息 (在详情页点击保存时调用)
window.saveEmployeeDetail = function() {
    const empId = document.getElementById('emp-id').value;
    
    let list = JSON.parse(sessionStorage.getItem('HREmployees') || "[]");
    let index = list.findIndex(e => e.id === empId);
    
    if (index === -1) return alert("保存失败：员工不存在");
    
    const oldData = list[index];

    // 构造新数据
    const newEmp = {
        ...oldData,
        name: document.getElementById('emp-name').value,
        dept: document.getElementById('emp-dept').value,
        position: document.getElementById('emp-pos').value,
        bankAccount: document.getElementById('emp-bank').value,
        status: document.getElementById('emp-status').value,
        
        // 薪资部分
        salaryBase: parseFloat(document.getElementById('emp-salary-base').value) || 0,
        salaryPerformance: parseFloat(document.getElementById('emp-salary-perf').value) || 0,
        socialSecurityBase: parseFloat(document.getElementById('emp-ss-base').value) || 0,

        // ★★★★★ 核心修复：加上这一行！否则永远存不进去！ ★★★★★
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