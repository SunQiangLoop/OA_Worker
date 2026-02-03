// js/modules/hr/performance.js

// 1. 初始化/加载绩效数据
window.loadPerformanceData = function() {
    const employees = JSON.parse(sessionStorage.getItem('HREmployees') || "[]");
    const month = '2025-11'; // 默认当前月
    
    // 读取已保存的分数 (Key格式: HR_KPI_2025-11)
    let scores = JSON.parse(sessionStorage.getItem(`HR_KPI_${month}`) || "{}");

    const rows = employees.filter(e => e.status === '在职').map(e => {
        const score = scores[e.id] !== undefined ? scores[e.id] : 100; // 默认100分
        // 计算系数：100分=1.0，每降1分扣0.01 (示例规则)
        let coeff = (score / 100).toFixed(2);
        if(score > 100) coeff = (1 + (score-100)*0.02).toFixed(2); // 比如110分=1.2系数
        
        const perfMoney = (e.salaryPerformance || 0) * coeff;

        return `
            <tr>
                <td>${e.id}</td>
                <td><strong>${e.name}</strong></td>
                <td>${e.dept}</td>
                <td>${e.salaryPerformance}</td>
                <td>
                    <input type="number" class="kpi-input" data-id="${e.id}" value="${score}" 
                           oninput="updateKpiRow(this, ${e.salaryPerformance})"
                           style="width:60px; text-align:center; border:1px solid #ccc; padding:5px;">
                </td>
                <td class="kpi-coeff">${coeff}</td>
                <td class="kpi-money" style="font-weight:bold; color:#2980b9;">${perfMoney.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
    
    return rows;
}

// 2. 前端动态计算 (不存库，只为了显示)
window.updateKpiRow = function(input, base) {
    const score = parseFloat(input.value) || 0;
    const row = input.closest('tr');
    let coeff = score / 100;
    if(score > 100) coeff = 1 + (score-100)*0.02;
    
    row.querySelector('.kpi-coeff').innerText = coeff.toFixed(2);
    row.querySelector('.kpi-money').innerText = (base * coeff).toFixed(2);
}

// 3. 保存绩效 (供算薪使用)
window.savePerformance = function() {
    const month = document.getElementById('kpi-month').value; // '2025-11'
    let scores = {};
    
    document.querySelectorAll('.kpi-input').forEach(input => {
        scores[input.getAttribute('data-id')] = parseFloat(input.value);
    });

    sessionStorage.setItem(`HR_KPI_${month}`, JSON.stringify(scores));
    
    // 记日志
    if(typeof addDataChangeLog === 'function') {
        addDataChangeLog({
            time: new Date().toLocaleString(), user: 'HR经理',
            object: '绩效考核', objId: month, field: '月度打分', oldVal: '-', newVal: '更新'
        });
    }

    alert(`✅ ${month} 绩效考核已保存！\n\n现在您可以去【薪酬核算】模块计算工资了，系统将自动应用这些系数。`);
}

// 4. [供外部调用] 获取系数接口 (Salary.js 会调用这个)
window.getKpiCoefficient = function(month, empId) {
    let scores = JSON.parse(sessionStorage.getItem(`HR_KPI_${month}`) || "{}");
    // 如果没打分，默认 1.0 (100分)
    if (scores[empId] === undefined) return 1.0;
    
    const score = scores[empId];
    let coeff = score / 100;
    if(score > 100) coeff = 1 + (score-100)*0.02;
    
    return coeff;
}