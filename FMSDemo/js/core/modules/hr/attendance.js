// js/modules/hr/attendance.js
// [修复版] 考勤管理逻辑 - 确保数据可见

// 1. 加载考勤数据 (核心渲染函数)
window.loadAttendanceData = function() {
    const employees = JSON.parse(sessionStorage.getItem('HREmployees') || "[]");
    const month = '2025-11'; // 默认当前月

    // A. 读取考勤记录
    let records = JSON.parse(sessionStorage.getItem(`HR_ATT_${month}`));

    // B. 如果没记录，根据员工名单初始化一份 (确保不为空)
    if (!records) {
        console.log("⏳ 初始化默认考勤数据...");
        records = {};
        employees.forEach(e => {
            if (e.status === '在职') {
                // 默认全勤 (0请假)
                records[e.id] = { personalLeave: 0, sickLeave: 0, overtime: 0, remarks: '' };
            }
        });
        // 预埋几个测试数据 (方便您看效果)
        if(records['EMP001']) records['EMP001'].overtime = 10; // 张三加班10小时
        if(records['EMP002']) records['EMP002'].personalLeave = 2; // 李四事假2天
        
        sessionStorage.setItem(`HR_ATT_${month}`, JSON.stringify(records));
    }

    // C. 生成 HTML 表格行
    const rows = employees.filter(e => e.status === '在职').map(e => {
        // 获取该员工记录 (双重保险，防止新员工没记录)
        const rec = records[e.id] || { personalLeave: 0, sickLeave: 0, overtime: 0, remarks: '' }; 
        
        // 样式逻辑：有异动的行高亮显示
        const isAbnormal = rec.personalLeave > 0 || rec.sickLeave > 0 || rec.overtime > 0;
        const bgStyle = isAbnormal ? 'background-color: #f9fff0;' : '';
        const highlightClass = isAbnormal ? 'font-weight:bold; color:#e67e22;' : 'color:#999;';

        return `
            <tr style="${bgStyle}">
                <td>${e.id}</td>
                <td><strong>${e.name}</strong></td>
                <td>${e.dept}</td>
                
                <td>
                    <input type="number" class="att-input" data-id="${e.id}" data-field="personalLeave" 
                           value="${rec.personalLeave}" min="0"
                           style="width:60px; text-align:center; border:1px solid #ddd; padding:5px; ${rec.personalLeave>0?'color:red; font-weight:bold;':''}">
                </td>
                
                <td>
                    <input type="number" class="att-input" data-id="${e.id}" data-field="sickLeave" 
                           value="${rec.sickLeave}" min="0"
                           style="width:60px; text-align:center; border:1px solid #ddd; padding:5px; ${rec.sickLeave>0?'color:orange; font-weight:bold;':''}">
                </td>
                
                <td>
                    <input type="number" class="att-input" data-id="${e.id}" data-field="overtime" 
                           value="${rec.overtime}" min="0"
                           style="width:60px; text-align:center; border:1px solid #ddd; padding:5px; ${rec.overtime>0?'color:green; font-weight:bold;':''}">
                </td>
                
                <td>
                    <input type="text" class="att-input" data-id="${e.id}" data-field="remarks" 
                           value="${rec.remarks || ''}" placeholder="-" 
                           style="width:100%; border:none; background:transparent; color:#666;">
                </td>
            </tr>
        `;
    }).join('');
    
    return rows || '<tr><td colspan="7" style="text-align:center; padding:20px; color:#999;">暂无在职员工，请先去【员工花名册】添加人员。</td></tr>';
}

// 2. 保存考勤数据 (修改后提交)
window.saveAttendance = function() {
    const month = document.getElementById('att-month').value || '2025-11';
    
    // 读取旧数据作为底板
    let records = JSON.parse(sessionStorage.getItem(`HR_ATT_${month}`) || "{}");
    let count = 0;

    // 遍历页面上的所有输入框，更新数据
    // 逻辑：找到所有带 att-input 类的元素，按 data-id 分组存储
    const inputs = document.querySelectorAll('.att-input');
    
    if(inputs.length === 0) return alert("⚠️ 页面无数据，无法保存。");

    inputs.forEach(input => {
        const empId = input.getAttribute('data-id');
        const field = input.getAttribute('data-field'); // personalLeave, sickLeave...
        
        // 数值转换
        let val = input.value;
        if (field !== 'remarks') {
            val = parseFloat(val) || 0;
        }

        if (!records[empId]) records[empId] = {};
        records[empId][field] = val;
        count++;
    });

    // 写入存储
    sessionStorage.setItem(`HR_ATT_${month}`, JSON.stringify(records));
    
    // 记日志
    if(typeof addDataChangeLog === 'function') {
        addDataChangeLog({
            time: new Date().toLocaleString(), user: 'HR', 
            object: '考勤管理', objId: month, field: '全员更新', oldVal: '-', newVal: '保存成功'
        });
    }
    
    alert(`✅ 考勤数据已保存！\n\n数据已同步，现在去【薪酬核算】模块计算工资，系统将自动应用这些扣款和补贴。`);
    
    // 刷新一下页面，让高亮样式生效
    loadContent('HRAttendance');
}

// 3. [接口] 供 Salary.js 调用
window.getAttendanceData = function(month, empId) {
    let records = JSON.parse(sessionStorage.getItem(`HR_ATT_${month}`) || "{}");
    return records[empId] || { personalLeave: 0, sickLeave: 0, overtime: 0 };
}

// 4. 模拟导入 (暂时留空或简单提示)
window.importDingTalkData = function() {
    alert("功能开发中：支持上传钉钉/企业微信导出的 Excel 文件。");
}