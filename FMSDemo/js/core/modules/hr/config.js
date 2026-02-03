// js/modules/hr/config.js
// [终极合并版] 薪酬配置与算法

// 1. 初始化社保方案 (含南京标准及大病医保)
window.initSocialSecurityConfig = function() {
    let config = JSON.parse(sessionStorage.getItem('HR_SS_Config'));
    
    // 如果配置不存在，或者配置版本过旧(缺少关键字段)，则重置
    if (!config || !config.fundLimits || !config.fixedAdd) {
        config = {
            city: '南京',
            // 社保基数上下限 
            limits: { 
                min: 4952, 
                max: 24762 
            },
            // ★★★ 公积金基数上下限 (独立) ★★★
            fundLimits: { 
                min: 2490, 
                max: 41400 
            },
            // 缴费比例
            pension: { comp: 0.16, pers: 0.08 },    // 养老
            medical: { comp: 0.07, pers: 0.02 },    // 医疗
            unemp:   { comp: 0.005, pers: 0.005 },  // 失业
            injury:  { comp: 0.004, pers: 0 },      // 工伤
            birth:   { comp: 0.008, pers: 0 },      // 生育
            fund:    { comp: 0.08, pers: 0.08 },    // 公积金
            
            // ★★★ 固定附加费 (如南京大病医保 10元) ★★★
            fixedAdd: { comp: 0, pers: 10 } 
        };
        sessionStorage.setItem('HR_SS_Config', JSON.stringify(config));
    }
}

// 2. 社保计算器 (支持比例 + 固定金额)
window.calcSocialSecurity = function(base) {
    // 确保配置已加载
    window.initSocialSecurityConfig();
    const conf = JSON.parse(sessionStorage.getItem('HR_SS_Config'));
    
    const calc = (rate) => parseFloat((base * rate).toFixed(2));

    // 计算个人部分 (比例 + 固定)
    let personalTotal = calc(conf.pension.pers) + 
                        calc(conf.medical.pers) + 
                        calc(conf.unemp.pers) + 
                        calc(conf.fund.pers);
    
    // 加上固定扣款 (如大病医保)
    if (conf.fixedAdd && conf.fixedAdd.pers) {
        personalTotal += conf.fixedAdd.pers;
    }

    // 计算公司部分
    const companyTotal = calc(conf.pension.comp) + 
                         calc(conf.medical.comp) + 
                         calc(conf.unemp.comp) + 
                         calc(conf.injury.comp) + 
                         calc(conf.birth.comp) + 
                         calc(conf.fund.comp);

    return {
        personal: personalTotal, 
        company: companyTotal,
        detail: { ...conf }
    };
}

// 3. 个税计算器 (防止重复扣减起征点)
window.calcIndividualTax = function(taxableIncome) {
    // 传入的 taxableIncome 已经是 (应发 - 社保 - 5000)
    let amount = taxableIncome; 

    if (amount <= 0) return 0;

    // 2024年 个人所得税预扣率表
    if (amount <= 3000) return amount * 0.03;
    else if (amount <= 12000) return amount * 0.1 - 210;
    else if (amount <= 25000) return amount * 0.2 - 1410;
    else if (amount <= 35000) return amount * 0.25 - 2660;
    else if (amount <= 55000) return amount * 0.3 - 4410;
    else if (amount <= 80000) return amount * 0.35 - 7160;
    else return amount * 0.45 - 15160;
}

// 4. 保存配置函数 (完整版：保存所有字段)
window.saveHRConfig = function() {
    const p = (id) => parseFloat(document.getElementById(id).value) / 100;
    const v = (id) => parseFloat(document.getElementById(id).value);

    const newConfig = {
        city: '自定义',
        // 社保上下限
        limits: { 
            min: v('conf-ss-min') || 0, 
            max: v('conf-ss-max') || 99999 
        },
        // 公积金上下限
        fundLimits: { 
            min: v('conf-fund-min') || 0, 
            max: v('conf-fund-max') || 99999 
        },
        // 比例
        pension: { pers: p('conf-pension-pers'), comp: p('conf-pension-comp') },
        medical: { pers: p('conf-medical-pers'), comp: p('conf-medical-comp') },
        unemp:   { pers: p('conf-unemp-pers'), comp: p('conf-unemp-comp') },
        fund:    { pers: p('conf-fund-pers'), comp: p('conf-fund-comp') },
        injury:  { pers: 0, comp: p('conf-injury-comp') },
        birth:   { pers: 0, comp: p('conf-birth-comp') },
        
        // 固定附加费 (界面暂未开放编辑，默认保留)
        fixedAdd: { comp: 0, pers: 10 } 
    };

    sessionStorage.setItem('HR_SS_Config', JSON.stringify(newConfig));
    
    if(typeof addDataChangeLog === 'function') {
        addDataChangeLog({
            time: new Date().toLocaleString(), user: '管理员',
            object: '薪酬配置', objId: 'GLOBAL', field: '参数调整', oldVal: '...', newVal: '更新'
        });
    }
    alert("✅ 配置已保存！请重新执行【薪酬核算】以应用新规则。");
    loadContent('HRSalaryConfig');
}