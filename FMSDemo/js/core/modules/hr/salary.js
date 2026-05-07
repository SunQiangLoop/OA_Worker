// js/modules/hr/salary.js

// 1. 核心算薪逻辑 (修复版：内置默认标准，无需先保存配置)
window.calculateMonthlySalary = function() {
    try {
        const employees = typeof window.getHREmployees === 'function'
            ? window.getHREmployees()
            : JSON.parse(sessionStorage.getItem('HREmployees') || "[]");
        const month = '2025-11';
        
        // ============================================================
        // ★★★ 1. 智能配置加载 (核心修复点) ★★★
        // ============================================================
        let conf = JSON.parse(sessionStorage.getItem('HR_SS_Config'));

        // 如果发现没配置，或者配置是不完整的，立刻应用“南京标准默认值”
        if (!conf || !conf.limits || !conf.fundLimits || !conf.pension) {
            console.log("检测到未配置薪酬规则，正在应用默认标准(南京2024)...");
            
            // 定义默认标准配置
            conf = {
                city: '南京 (默认)',
                // 基数上下限
                limits: { min: 4952, max: 24762 },
                fundLimits: { min: 2490, max: 41400 },
                // 比例
                pension: { pers: 0.08, comp: 0.16 },
                medical: { pers: 0.02, comp: 0.07 },
                unemp:   { pers: 0.005, comp: 0.005 },
                injury:  { pers: 0, comp: 0.004 },
                birth:   { pers: 0, comp: 0.008 },
                fund:    { pers: 0.08, comp: 0.08 },
                // 固定附加 (大病)
                fixedAdd: { pers: 10, comp: 0 }
            };

            // ★ 马上存入缓存！这样下次进配置页也能看到这些默认值了
            sessionStorage.setItem('HR_SS_Config', JSON.stringify(conf));
        }
        // ============================================================

        // 安全读取配置参数
        const ssMin = conf.limits.min;
        const ssMax = conf.limits.max;
        const fundMin = conf.fundLimits ? conf.fundLimits.min : ssMin;
        const fundMax = conf.fundLimits ? conf.fundLimits.max : ssMax;

        const calc = (base, rate) => parseFloat((base * (rate || 0)).toFixed(2));

        let payrollDetails = [];
        let totalGrossPay = 0;
        let totalPositionPay = 0;
        let totalDeduction = 0;
        let totalNetPay = 0; 
        let totalCompanyCost = 0; 

        // --- 2. 遍历计算 ---
        employees.forEach(e => {
            if (e.status !== '在职') return;

            const baseSalary = parseFloat(e.salaryBase) || 0;
            const positionSalary = parseFloat(e.positionSalary) || 0;
            
            // A. 绩效
            let kpiCoeff = 1.0;
            if (typeof getKpiCoefficient === 'function') {
                kpiCoeff = getKpiCoefficient(month, e.id);
            }
            const actualPerf = (parseFloat(e.salaryPerformance) || 0) * kpiCoeff;

            // B. 考勤
            let attTotal = 0;
            if (typeof getAttendanceData === 'function') {
                 const att = getAttendanceData(month, e.id);
                 const dailyRate = baseSalary / 21.75;
                 const hourlyRate = dailyRate / 8;
                 attTotal = (hourlyRate * 1.5 * att.overtime) - (dailyRate * att.personalLeave) - (dailyRate * 0.4 * att.sickLeave);
            }

            const grossPay = baseSalary + positionSalary + actualPerf + attTotal;

            // C. 基数处理
            let rawSS = parseFloat(e.socialSecurityBase) || baseSalary;
            let baseSS = rawSS < ssMin ? ssMin : (rawSS > ssMax ? ssMax : rawSS);

            let rawFund = parseFloat(e.providentFundBase) || rawSS;
            let baseFund = rawFund < fundMin ? fundMin : (rawFund > fundMax ? fundMax : rawFund);

            // D. 个人扣款
            const p_pension = calc(baseSS, conf.pension?.pers);
            const p_medical = calc(baseSS, conf.medical?.pers) + (conf.fixedAdd?.pers || 0);
            const p_unemp = calc(baseSS, conf.unemp?.pers);
            const p_fund = calc(baseFund, conf.fund?.pers);
            const totalPersDed = p_pension + p_medical + p_unemp + p_fund;

            // E. 公司成本
            const c_pension = calc(baseSS, conf.pension?.comp);
            const c_medical = calc(baseSS, conf.medical?.comp);
            const c_unemp = calc(baseSS, conf.unemp?.comp);
            const c_injury = calc(baseSS, conf.injury?.comp);
            const c_birth = calc(baseSS, conf.birth?.comp);
            const c_fund = calc(baseFund, conf.fund?.comp);
            
            const totalCompAdd = c_pension + c_medical + c_unemp + c_injury + c_birth + c_fund;

            // F. 个税与实发
            let taxable = grossPay - totalPersDed - 5000;
            let tax = 0;
            if (typeof calcIndividualTax === 'function') {
                tax = calcIndividualTax(taxable);
            }
            const netPay = grossPay - totalPersDed - tax;

            // G. 存入明细 (含公司部分)
            payrollDetails.push({
                id: e.id, name: e.name, dept: e.dept,
                position: e.position || '',
                level: e.level || '',
                base: baseSalary,
                positionSalary: positionSalary,
                kpiBase: parseFloat(e.salaryPerformance) || 0,
                kpiRate: kpiCoeff,
                perfSalary: actualPerf,
                attAmount: attTotal,
                gross: grossPay,
                ssBase: baseSS, fundBase: baseFund,
                
                // 个人部分
                p_pension, p_med: p_medical, p_unemp, p_fund, p_total: totalPersDed,
                
                taxable: taxable > 0 ? taxable : 0, tax: tax, net: netPay,
                
                // 公司部分
                c_pension: c_pension,
                c_med: c_medical,
                c_unemp: c_unemp,
                c_injury: c_injury,
                c_birth: c_birth,
                c_fund: c_fund,
                c_total: totalCompAdd
            });
            
            totalGrossPay += grossPay;
            totalPositionPay += positionSalary;
            totalDeduction += (totalPersDed + tax);
            totalNetPay += netPay;
            totalCompanyCost += (grossPay + totalCompAdd);
        });

        // --- 3. 保存结果 ---
        const payrollRecord = {
            id: 'GZ-' + month + '-' + Math.floor(Math.random()*1000),
            period: month,
            dept: '全公司',
            count: payrollDetails.length,
            totalGrossAmount: totalGrossPay.toFixed(2),
            totalPositionAmount: totalPositionPay.toFixed(2),
            totalDeductionAmount: totalDeduction.toFixed(2),
            totalAmount: totalNetPay.toFixed(2),
            totalCost: totalCompanyCost.toFixed(2),
            status: '待发放',
            details: payrollDetails
        };

        sessionStorage.setItem('CurrentPayroll', JSON.stringify(payrollRecord));

        let list = JSON.parse(sessionStorage.getItem('HRPayrolls') || "[]");
        const existingIdx = list.findIndex(p => p.period === month);
        
        if (existingIdx > -1) {
            if (list[existingIdx].status === '已发放') {
                alert(`⛔ 操作被拦截！本月工资已发放。`);
                return;
            }
            if (!confirm(`⚠️ 是否覆盖【${month}】的旧工资单？`)) return;
            list[existingIdx] = payrollRecord;
        } else {
            list.unshift(payrollRecord);
        }
        
        sessionStorage.setItem('HRPayrolls', JSON.stringify(list));

        alert(`✅ 核算完成！\n(已自动应用默认社保配置)\n\n实发总额：${totalNetPay.toFixed(2)}`);
        loadContent('HRSalary');

    } catch (error) {
        console.error("算薪错误:", error);
        alert("❌ 核算失败: " + error.message);
    }
}

// 暴露给全局
window.createMonthlyPayroll = window.calculateMonthlySalary;

// js/modules/hr/salary.js

// ... (上面的 calculateMonthlySalary 函数保持不变) ...

// 2. [修复版] 发放工资 (自动生成多借多贷凭证)
window.paySalary = function (payrollId) {
  // 1. 读取数据
  let list = JSON.parse(sessionStorage.getItem("HRPayrolls") || "[]");
  let item = list.find((p) => p.id === payrollId);

  if (!item) return alert("❌ 未找到该工资单数据");
  if (item.status === "已发放")
    return alert("⚠️ 该工资单已发放，请勿重复操作。");

  if (
    !confirm(
      `确认发放【${item.period}】工资吗？\n\n系统将根据工资明细自动生成：\n借：应付职工薪酬 (应发)\n贷：银行存款 (实发)\n贷：税费/社保 (代扣)`
    )
  )
    return;

  // 2. ★★★ 核心：计算分录金额 (遍历明细求和) ★★★
  // 之前报错是因为这里没写求和逻辑
  let totalGross = 0; // 应发总额 (借方 2211)
  let totalNet = 0; // 实发总额 (贷方 1002)
  let totalTax = 0; // 个税总额 (贷方 2221)
  let totalDed = 0; // 社保个人部分 (贷方 2241)

  if (item.details && item.details.length > 0) {
    item.details.forEach((d) => {
      totalGross += d.gross || 0;
      totalNet += d.net || 0;
      totalTax += d.tax || 0;
      // 兼容不同版本的字段名 (p_total 是最新版，ssPersonal 是旧版)
      totalDed += d.p_total || d.ssPersonal || 0;
    });
  } else {
    // 兜底：如果没明细，直接用总额 (这种情况下只能生成简单凭证)
    totalNet = parseFloat(item.totalAmount);
    totalGross = totalNet;
  }

  // 3. 构造分录行 (Lines)
  const lines = [
    // 借：应付职工薪酬 (冲销负债) - 金额是应发工资
    {
      summary: `${item.period} 工资发放`,
      account: "2211 应付职工薪酬",
      debit: totalGross.toFixed(2),
      credit: "",
    },
    // 贷：银行存款 (资金流出) - 金额是实发工资
    {
      summary: `${item.period} 工资实发`,
      account: "1002 银行存款",
      debit: "",
      credit: totalNet.toFixed(2),
    },
  ];

  // 如果有个税，加一行贷方
  if (totalTax > 0) {
    lines.push({
      summary: "代扣个人所得税",
      account: "2221 应交税费-个税",
      debit: "",
      credit: totalTax.toFixed(2),
    });
  }

  // 如果有社保代扣，加一行贷方
  if (totalDed > 0) {
    lines.push({
      summary: "代扣个人社保公积金",
      account: "2241 其他应付款-社保",
      debit: "",
      credit: totalDed.toFixed(2),
    });
  }

  // 4. 生成凭证对象
  const vId =
    "付" + new Date().getFullYear() + Math.floor(Math.random() * 10000);
  const newVoucher = {
    id: vId,
    date: new Date().toISOString().split("T")[0],
    amount: totalGross.toFixed(2), // 凭证总额按借方显示
    user: "HR系统联动",
    status: "已记账",
    lines: lines,
  };

  // 5. 存入凭证库
  let vList = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
  vList.unshift(newVoucher);
  sessionStorage.setItem("ManualVouchers", JSON.stringify(vList));

  // 6. 更新工资单状态
  item.status = "已发放";
  item.voucherId = vId; // 回写凭证号
  sessionStorage.setItem("HRPayrolls", JSON.stringify(list));

  // 7. 记日志
  if (typeof addAuditLog === "function") {
    addAuditLog({
      level: "高危",
      time: new Date().toLocaleString(),
      user: "财务/HR",
      module: "薪酬管理",
      action: "发放工资",
      detail: `实发:${totalNet.toFixed(2)}, 凭证:${vId}`,
    });
  }

  alert(
    `🎉 发薪成功！\n\n凭证已生成：${vId}\n\n借：应付职工薪酬 ${totalGross.toFixed(
      2
    )}\n贷：银行存款 ${totalNet.toFixed(2)}\n贷：税费/社保 ${(
      totalTax + totalDed
    ).toFixed(2)}`
  );
  loadContent("HRSalary");
};

// ============================================================
// ★★★ 补全缺失的跳转函数 (请粘贴到 salary.js 最底部) ★★★
// ============================================================

/** 3. 查看工资单明细 (跳转详情页) */
window.viewPayrollDetail = function (id) {
  // 1. 读取历史列表
  const list = JSON.parse(sessionStorage.getItem("HRPayrolls") || "[]");

  // 2. 找到对应的那条记录
  const item = list.find((p) => p.id === id);

  if (!item) {
    alert("❌ 未找到该工资单数据，请尝试重新核算。");
    return;
  }

  // 3. 存入全局变量，供详情页读取
  window.g_currentPayrollView = item;

  // 4. 跳转到详情页模块
  loadContent("HRSalaryDetail");
};
