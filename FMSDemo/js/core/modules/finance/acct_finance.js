// js/core/modules/finance/acct_finance.js
// 会计科目、账套、期间、辅助核算模块
window.VM_MODULES = window.VM_MODULES || {};

// =========================================================================
// AcctSubject
// =========================================================================
window.VM_MODULES['AcctSubject'] = function(contentArea, contentHTML, moduleCode) {
        // 1. 读取存储的科目数据 (如果没有则使用默认的全量数据)
        let storedAccounts = JSON.parse(sessionStorage.getItem("AcctSubjects"));

        // 优先从 localStorage 恢复（跨会话持久化）
        if (!storedAccounts) {
            storedAccounts = JSON.parse(localStorage.getItem("AcctSubjects"));
            if (storedAccounts) sessionStorage.setItem("AcctSubjects", JSON.stringify(storedAccounts));
        }

        // 按当前会计准则加载模板
        if (!storedAccounts) {
            const _std = localStorage.getItem("AccountingStandard") || "enterprise";
            const _tpl = ACCOUNTING_STANDARD_TEMPLATES[_std];
            if (_tpl && _tpl.length > 0) {
                storedAccounts = _tpl;
                sessionStorage.setItem("AcctSubjects", JSON.stringify(storedAccounts));
                localStorage.setItem("AcctSubjects", JSON.stringify(storedAccounts));
            }
        }

        if (!storedAccounts) {
            // ★★★ 初始化全量科目数据 (企业会计准则默认) ★★★
            storedAccounts = [
                // --- 资产类 (1) ---
                {
                    code: "1001",
                    name: "库存现金",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "企业的库存现金",
                },
                {
                    code: "1002",
                    name: "银行存款",
                    type: "资产",
                    direction: "借",
                    aux: "银行账户",
                    status: "启用",
                    remark: "企业存入银行或其他金融机构的各种款项",
                },
                {
                    code: "1012",
                    name: "其他货币资金",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "银行汇票、本票、信用卡存款等",
                },
                {
                    code: "1101",
                    name: "交易性金融资产",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "短期持有的股票、债券、基金等",
                },
                {
                    code: "1121",
                    name: "应收票据",
                    type: "资产",
                    direction: "借",
                    aux: "客户",
                    status: "启用",
                    remark: "商业汇票",
                },
                {
                    code: "1122",
                    name: "应收账款",
                    type: "资产",
                    direction: "借",
                    aux: "客户",
                    status: "启用",
                    remark: "因销售商品、提供劳务应收取的款项",
                },
                {
                    code: "1123",
                    name: "预付账款",
                    type: "资产",
                    direction: "借",
                    aux: "供应商",
                    status: "启用",
                    remark: "预付给供应商的款项",
                },
                {
                    code: "1131",
                    name: "应收股利",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "应收取的现金股利",
                },
                {
                    code: "1132",
                    name: "应收利息",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "应收取的利息",
                },
                {
                    code: "1221",
                    name: "其他应收款",
                    type: "资产",
                    direction: "借",
                    aux: "往来单位,员工",
                    status: "启用",
                    remark: "除应收账款外的其他各种应收暂付款项",
                },
                {
                    code: "122101",
                    name: "押金",
                    type: "资产",
                    direction: "借",
                    aux: "往来单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "122102",
                    name: "保证金",
                    type: "资产",
                    direction: "借",
                    aux: "往来单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "122103",
                    name: "员工借款",
                    type: "资产",
                    direction: "借",
                    aux: "员工",
                    status: "启用",
                    remark: "备用金等",
                },
                {
                    code: "1231",
                    name: "坏账准备",
                    type: "资产",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "应收款项的备抵科目",
                },
                {
                    code: "1511",
                    name: "长期股权投资",
                    type: "资产",
                    direction: "借",
                    aux: "被投资单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1521",
                    name: "投资性房地产",
                    type: "资产",
                    direction: "借",
                    aux: "项目",
                    status: "启用",
                    remark: "为赚取租金或资本增值而持有的房地产",
                },
                {
                    code: "1531",
                    name: "长期应收款",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1601",
                    name: "固定资产",
                    type: "资产",
                    direction: "借",
                    aux: "资产类别",
                    status: "启用",
                    remark: "使用寿命超过一年的有形资产",
                },
                {
                    code: "160101",
                    name: "房屋及建筑物",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "160102",
                    name: "交通运输设备",
                    type: "资产",
                    direction: "借",
                    aux: "车辆",
                    status: "启用",
                    remark: "物流车辆",
                },
                {
                    code: "160103",
                    name: "办公家具及设备",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "160104",
                    name: "电子设备",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "电脑、打印机等",
                },
                {
                    code: "1602",
                    name: "累计折旧",
                    type: "资产",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "固定资产的备抵科目",
                },
                {
                    code: "1604",
                    name: "在建工程",
                    type: "资产",
                    direction: "借",
                    aux: "项目",
                    status: "启用",
                    remark: "正在建设中的资产",
                },
                {
                    code: "1605",
                    name: "工程物资",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1606",
                    name: "固定资产清理",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1701",
                    name: "无形资产",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "专利权、软件著作权等",
                },
                {
                    code: "1702",
                    name: "累计摊销",
                    type: "资产",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "无形资产的备抵科目",
                },
                {
                    code: "1801",
                    name: "长期待摊费用",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "摊销期在一年以上的费用",
                },
                {
                    code: "1811",
                    name: "递延所得税资产",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "1901",
                    name: "待处理财产损溢",
                    type: "资产",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "盘盈盘亏处理",
                },

                // --- 负债类 (2) ---
                {
                    code: "2001",
                    name: "短期借款",
                    type: "负债",
                    direction: "贷",
                    aux: "银行",
                    status: "启用",
                    remark: "1年内的借款",
                },
                {
                    code: "2101",
                    name: "交易性金融负债",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2201",
                    name: "应付票据",
                    type: "负债",
                    direction: "贷",
                    aux: "供应商",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2202",
                    name: "应付账款",
                    type: "负债",
                    direction: "贷",
                    aux: "供应商",
                    status: "启用",
                    remark: "购买材料、接受劳务应付的款项",
                },
                {
                    code: "2203",
                    name: "预收账款",
                    type: "负债",
                    direction: "贷",
                    aux: "客户",
                    status: "启用",
                    remark: "预收的运费等",
                },
                {
                    code: "2211",
                    name: "应付职工薪酬",
                    type: "负债",
                    direction: "贷",
                    aux: "部门",
                    status: "启用",
                    remark: "工资、奖金、社保等",
                },
                {
                    code: "2221",
                    name: "应交税费",
                    type: "负债",
                    direction: "贷",
                    aux: "税种",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222101",
                    name: "应交增值税",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222102",
                    name: "应交企业所得税",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222103",
                    name: "应交城建税",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "222104",
                    name: "应交教育费附加",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2231",
                    name: "应付利息",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2232",
                    name: "应付股利",
                    type: "负债",
                    direction: "贷",
                    aux: "股东",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2241",
                    name: "其他应付款",
                    type: "负债",
                    direction: "贷",
                    aux: "往来单位",
                    status: "启用",
                    remark: "除主营业务外的应付暂收款项",
                },
                {
                    code: "224101",
                    name: "代收货款",
                    type: "负债",
                    direction: "贷",
                    aux: "客户",
                    status: "启用",
                    remark: "物流代收款",
                },
                {
                    code: "224102",
                    name: "保证金",
                    type: "负债",
                    direction: "贷",
                    aux: "往来单位",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2401",
                    name: "递延收益",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2501",
                    name: "长期借款",
                    type: "负债",
                    direction: "贷",
                    aux: "银行",
                    status: "启用",
                    remark: "1年以上的借款",
                },
                {
                    code: "2701",
                    name: "长期应付款",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2801",
                    name: "预计负债",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "2901",
                    name: "递延所得税负债",
                    type: "负债",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },

                // --- 权益类 (4) ---
                {
                    code: "4001",
                    name: "实收资本",
                    type: "权益",
                    direction: "贷",
                    aux: "股东",
                    status: "启用",
                    remark: "投资者投入资本",
                },
                {
                    code: "4002",
                    name: "资本公积",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "4101",
                    name: "盈余公积",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "从净利润中提取的公积金",
                },
                {
                    code: "4103",
                    name: "本年利润",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "当期实现的净利润或亏损",
                },
                {
                    code: "4104",
                    name: "利润分配",
                    type: "权益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "利润分配及历年亏损弥补",
                },

                // --- 损益类 (6) ---
                {
                    code: "6001",
                    name: "主营业务收入",
                    type: "损益",
                    direction: "贷",
                    aux: "客户,项目",
                    status: "启用",
                    remark: "运输服务收入",
                },
                {
                    code: "600110",
                    name: "其他营业收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6051",
                    name: "其他业务收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "原材料销售、租金收入等",
                },
                {
                    code: "6101",
                    name: "公允价值变动损益",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6111",
                    name: "投资收益",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6301",
                    name: "营业外收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "与经营无直接关系的收入",
                },
                {
                    code: "6401",
                    name: "主营业务成本",
                    type: "损益",
                    direction: "借",
                    aux: "项目",
                    status: "启用",
                    remark: "运输成本、燃油费等",
                },
                {
                    code: "6402",
                    name: "其他业务成本",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "640301",
                    name: "税金及附加",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "城建税、教育费附加等",
                },
                {
                    code: "6601",
                    name: "销售费用",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "销售过程中发生的费用",
                },
                {
                    code: "6602",
                    name: "管理费用",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "管理部门发生的费用",
                },
                {
                    code: "660201",
                    name: "工资",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660202",
                    name: "社保费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660203",
                    name: "办公费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660204",
                    name: "保险费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660205",
                    name: "房租费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660206",
                    name: "水电费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660207",
                    name: "物业费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660208",
                    name: "招待费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660209",
                    name: "差旅费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660210",
                    name: "交通费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660211",
                    name: "通讯费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660212",
                    name: "修缮费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660213",
                    name: "招聘费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660214",
                    name: "固定资产折旧费",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660215",
                    name: "低值易耗品",
                    type: "损益",
                    direction: "借",
                    aux: "部门",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6603",
                    name: "财务费用",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "利息支出、手续费等",
                },
                {
                    code: "660301",
                    name: "汇款手续费",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660302",
                    name: "代收手续费",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "660303",
                    name: "利息收入",
                    type: "损益",
                    direction: "贷",
                    aux: "无",
                    status: "启用",
                    remark: "注意：利息收入记财务费用贷方",
                },
                {
                    code: "6701",
                    name: "资产减值损失",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6711",
                    name: "营业外支出",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "与经营无直接关系的支出",
                },
                {
                    code: "6801",
                    name: "所得税费用",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
                {
                    code: "6901",
                    name: "以前年度损益调整",
                    type: "损益",
                    direction: "借",
                    aux: "无",
                    status: "启用",
                    remark: "",
                },
            ];
            sessionStorage.setItem("AcctSubjects", JSON.stringify(storedAccounts));
        }

        // 2. 排序：按科目编码排序，保证父子顺序
        storedAccounts.sort((a, b) => a.code.localeCompare(b.code));

        // Bug 3 Fix：检测科目编码重复（同一编码对应多条记录或多个名称）
        const _dupCodeMap = {};
        storedAccounts.forEach(s => {
            if (!s.code) return;
            if (!_dupCodeMap[s.code]) _dupCodeMap[s.code] = [];
            _dupCodeMap[s.code].push(s.name || '(无名称)');
        });
        const _dupCodes = Object.entries(_dupCodeMap).filter(([, names]) => names.length > 1);

        // 3. 生成表格 HTML
        const subjectSetting = getSubjectCodeSetting();
        const getSubjectLevelByCode = (code) => {
            let total = 0;
            for (let i = 0; i < subjectSetting.levels; i++) {
                total += subjectSetting.lengths[i] || 0;
                if (code.length === total) return i + 1;
            }
            return 1;
        };

        // 从两套准则模板构建兜底名称映射，防止孤立条目显示空名
        const _subjFallbackMap = {};
        try {
            (ACCOUNTING_STANDARD_TEMPLATES.small || [])
                .concat(ACCOUNTING_STANDARD_TEMPLATES.enterprise || [])
                .forEach(s => { if (s.code && s.name && !_subjFallbackMap[s.code]) _subjFallbackMap[s.code] = s.name; });
        } catch(e) {}

        const buildSubjectRows = (list) => list.map((item) => {
            const statusClass = item.status === "启用" ? "status-enabled" : "status-disabled";
            const controlDirection = item.controlDirection || "否";
            const displayName = item.name || _subjFallbackMap[item.code] || '';
            return `
                        <tr id="row-${item.code}" data-code="${item.code}" data-name="${displayName}" data-type="${item.type}">
                            <td style="text-align:center;">
                                <input type="checkbox" class="subject-select" data-code="${item.code}">
                            </td>
                            <td class="val-code"><strong>${item.code}</strong></td>
                            <td class="val-name">${displayName}</td>
                            <td>${item.type}</td>
                            <td>${item.aux || "-"}</td>
                            <td class="val-dir">${item.direction}</td>
                            <td class="val-status">
                                <span class="status-pill ${statusClass}">${item.status}</span>
                            </td>
                            <td class="val-remark" style="color:#777; font-size:12px;">${item.remark || "-"
                }</td>
                            <td class="val-control">${controlDirection}</td>
                        </tr>
                    `;
        }).join("");

        const typeOrder = ["资产", "负债", "权益", "成本", "损益"];
        const typeLabels = {
            "资产": "资产",
            "负债": "负债",
            "权益": "权益",
            "成本": "成本",
            "损益": "损益"
        };
        const levelLengths = [];
        let lengthTotal = 0;
        for (let i = 0; i < subjectSetting.levels; i++) {
            lengthTotal += subjectSetting.lengths[i] || 0;
            if (lengthTotal) levelLengths.push(lengthTotal);
        }
        const level1Len = levelLengths[0] || 4;
        const level2Len = levelLengths[1] || (level1Len + 2);

        const renderTreeLeaf = (item, levelClass) => `
            <div class="subject-tree-leaf ${levelClass}">
                <button type="button" class="subject-tree-link" data-prefix="${item.code}" data-type="${item.type}" onclick="event.stopPropagation(); filterSubjectTree('${item.code}', '${item.type}', this)">
                    ${item.code} ${item.name}
                </button>
            </div>
        `;

        const renderTreeLevel2 = (list, parent) => {
            const children = list.filter(it => it.code.startsWith(parent.code) && it.code.length > parent.code.length);
            const level2Nodes = children.filter(it => it.code.length <= level2Len);
            if (!level2Nodes.length) {
                const leafNodes = children.length ? children.map(it => renderTreeLeaf(it, "level-2")).join("") : "";
                return leafNodes ? `<div class="subject-tree-children">${leafNodes}</div>` : "";
            }
            return `
                <div class="subject-tree-children">
                    ${level2Nodes.map(level2 => {
                        const descendants = children.filter(it => it.code.startsWith(level2.code) && it.code.length > level2.code.length);
                        const descendantHtml = descendants.length
                            ? `<div class="subject-tree-children">${descendants.map(it => renderTreeLeaf(it, "level-3")).join("")}</div>`
                            : "";
                        return `
                            <details class="subject-tree-section">
                                <summary>
                                    <span class="subject-tree-caret"></span>
                                    <button type="button" class="subject-tree-link" data-prefix="${level2.code}" data-type="${level2.type}" onclick="event.stopPropagation(); filterSubjectTree('${level2.code}', '${level2.type}', this)">
                                        ${level2.code} ${level2.name}
                                    </button>
                                </summary>
                                ${descendantHtml}
                            </details>
                        `;
                    }).join("")}
                </div>
            `;
        };

        const renderTreeByType = (type) => {
            const list = storedAccounts.filter(item => item.type === type);
            const level1Nodes = list.filter(item => item.code.length <= level1Len);
            if (!level1Nodes.length) return "";
            return level1Nodes.map(level1 => `
                <details class="subject-tree-section" open>
                    <summary>
                        <span class="subject-tree-caret"></span>
                        <button type="button" class="subject-tree-link" data-prefix="${level1.code}" data-type="${level1.type}" onclick="event.stopPropagation(); filterSubjectTree('${level1.code}', '${level1.type}', this)">
                            ${level1.code} ${level1.name}
                        </button>
                    </summary>
                    ${renderTreeLevel2(list, level1)}
                </details>
            `).join("");
        };

        const subjectTreeHtml = typeOrder.map(type => `
            <details class="subject-tree-section subject-tree-type" open>
                <summary>
                    <span class="subject-tree-caret"></span>
                    <button type="button" class="subject-tree-link subject-tree-type-link" data-prefix="" data-type="${type}" onclick="event.stopPropagation(); filterSubjectTree('', '${type}', this)">
                        ${typeLabels[type]}
                    </button>
                </summary>
                <div class="subject-tree-children">
                    ${renderTreeByType(type)}
                </div>
            </details>
        `).join("");

        window.filterSubjectTree = function (prefix, type, el) {
            window._subjectTreeFilterPrefix = prefix || "";
            window._subjectTreeFilterType = type || "";
            document.querySelectorAll(".subject-tree-link").forEach(node => node.classList.remove("is-active"));
            if (el && el.classList) el.classList.add("is-active");
            sessionStorage.setItem("SubjectTreeFilter", JSON.stringify({
                prefix: window._subjectTreeFilterPrefix,
                type: window._subjectTreeFilterType
            }));
            if (typeof window.renderSubjectTablePage === "function") {
                window.renderSubjectTablePage(1);
            }
        };

        const savedFilterRaw = sessionStorage.getItem("SubjectTreeFilter") || "{}";
        let savedFilter = {};
        try {
            savedFilter = JSON.parse(savedFilterRaw) || {};
        } catch (error) {
            savedFilter = {};
        }
        window._subjectTreeFilterPrefix = savedFilter.prefix || "";
        window._subjectTreeFilterType = savedFilter.type || "";
        window._subjectList = storedAccounts;
        window._subjectPageSize = 50;
        window._subjectCurrentPage = 1;

        const getFilteredSubjectList = () => {
            const input = document.getElementById("subject-search-input");
            const query = input ? input.value.trim().toLowerCase() : "";
            const prefix = window._subjectTreeFilterPrefix || "";
            const type = window._subjectTreeFilterType || "";
            return storedAccounts.filter(item => {
                const code = (item.code || "").toLowerCase();
                const name = (item.name || "").toLowerCase();
                const matched = !query || code.includes(query) || name.includes(query);
                const prefixMatched = !prefix || item.code.startsWith(prefix);
                const typeMatched = !type || item.type === type;
                return matched && prefixMatched && typeMatched;
            });
        };

        window.renderSubjectTablePage = function (page = 1) {
            const list = getFilteredSubjectList();
            const pageSize = window._subjectPageSize || 50;
            const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
            const nextPage = Math.min(Math.max(1, page), totalPages);
            window._subjectCurrentPage = nextPage;
            const start = (nextPage - 1) * pageSize;
            const slice = list.slice(start, start + pageSize);
            const tbody = document.getElementById("subject-table-body");
            if (tbody) {
                tbody.innerHTML = slice.length
                    ? buildSubjectRows(slice)
                    : `<tr><td colspan="9" style="text-align:center; padding:20px;">暂无数据</td></tr>`;
            }
            if (typeof window.updateSubjectPagination === "function") {
                window.updateSubjectPagination(list.length, nextPage, pageSize);
            }
        };

        window.updateSubjectPagination = function (total, page, pageSize) {
            const wrap = document.getElementById("subject-pagination");
            if (!wrap) return;
            const totalPages = Math.max(1, Math.ceil(total / pageSize));
            const maxButtons = 5;
            let start = Math.max(1, page - 2);
            let end = Math.min(totalPages, start + maxButtons - 1);
            if (end - start < maxButtons - 1) {
                start = Math.max(1, end - maxButtons + 1);
            }
            let buttons = "";
            for (let i = start; i <= end; i++) {
                buttons += `<button class="page-btn ${i === page ? "is-active" : ""}" onclick="renderSubjectTablePage(${i})">${i}</button>`;
            }
            wrap.innerHTML = `
                <div class="subject-pagination-left">共 ${total} 条，每页 ${pageSize} 条</div>
                <div class="subject-pagination-right">
                    <button class="page-btn" ${page === 1 ? "disabled" : ""} onclick="renderSubjectTablePage(${page - 1})">上一页</button>
                    ${buttons}
                    <button class="page-btn" ${page === totalPages ? "disabled" : ""} onclick="renderSubjectTablePage(${page + 1})">下一页</button>
                    <span class="page-jump">跳至</span>
                    <input id="subject-page-input" type="number" min="1" max="${totalPages}" value="${page}">
                    <button class="page-btn" onclick="jumpSubjectPage()">确定</button>
                </div>
            `;
        };

        window.jumpSubjectPage = function () {
            const input = document.getElementById("subject-page-input");
            const totalPages = Math.max(1, Math.ceil((getFilteredSubjectList().length || 0) / (window._subjectPageSize || 50)));
            const page = input ? parseInt(input.value || "1", 10) : 1;
            window.renderSubjectTablePage(Math.min(Math.max(1, page), totalPages));
        };

        contentHTML += `
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 20px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <input id="subject-search-input" type="text" placeholder="科目编码 / 名称" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;" onkeyup="searchSubjects(event)">
                            <button class="btn-primary" onclick="searchSubjects()">查询</button>
                        </div>
                    </div>

                    ${_dupCodes.length > 0 ? `
                    <div id="subj-dup-alert" style="background:#fef2f2;border:2px solid #ef4444;border-radius:8px;padding:14px 18px;margin-bottom:16px;display:flex;gap:14px;align-items:flex-start;">
                        <span style="font-size:24px;line-height:1.3;flex-shrink:0;">⚠️</span>
                        <div style="flex:1;">
                            <div style="font-weight:700;color:#b91c1c;margin-bottom:6px;">
                                检测到 ${_dupCodes.length} 个科目编码重复 —— 可能导致凭证科目引用混乱！
                            </div>
                            <div style="font-size:13px;color:#dc2626;line-height:2;margin-bottom:8px;">
                                ${_dupCodes.map(([code, names]) =>
                                    `<span style="background:#fff1f2;border:1px solid #fecaca;border-radius:4px;padding:2px 8px;margin:2px 4px;display:inline-block;">
                                        <b>${code}</b>：${names.join(' / ')}
                                    </span>`
                                ).join('')}
                            </div>
                            <button class="btn-primary btn-danger" style="font-size:12px;" onclick="window.deduplicateSubjects()">
                                一键去重（每个编码保留最后一条）
                            </button>
                        </div>
                    </div>` : ''}

                    <div class="subject-toolbar">
                        <button class="btn-primary" onclick="addSubject()">+ 添加</button>
                        <button class="btn-primary" onclick="addSubjectSameLevel()">+ 添加同级</button>
                        <button class="btn-primary" onclick="addSubjectChild()">+ 添加下级</button>
                        <button class="btn-primary" onclick="editSelectedSubject()">✎ 修改</button>
                        <button class="btn-primary btn-danger" onclick="deleteSelectedSubjects()">🗑 删除</button>
                        <button class="btn-primary btn-success" onclick="setSubjectStatusBulk('启用')">✔ 启用</button>
                        <button class="btn-primary btn-warning" onclick="setSubjectStatusBulk('停用')">⛔ 禁用</button>
                        <button class="btn-primary" onclick="triggerImportSubjects()">⬇ 导入</button>
                        <button class="btn-primary" onclick="exportSubjectsToCSV()">⬆ 导出</button>
                        <input id="subject-import-input" type="file" accept=".csv" style="display:none;" onchange="importSubjectsFromCSV(this)">
                    </div>

                    <div class="subject-layout">
                        <div class="subject-tree-panel">
                            <div class="subject-tree-header">
                                <button type="button" class="subject-tree-link subject-tree-root is-active" data-prefix="" data-type="" onclick="filterSubjectTree('', '', this)">会计科目</button>
                            </div>
                            <div class="subject-tree-body">
                                ${subjectTreeHtml}
                            </div>
                        </div>
                        <div class="subject-table-panel">
                            <div class="subject-table-wrap">
                                <table class="data-table subject-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 42px; text-align:center;">
                                                <input type="checkbox" onclick="toggleAllSubjects(this.checked)">
                                            </th>
                                            <th style="width: 120px;">科目编码</th>
                                            <th>科目名称</th>
                                            <th style="width: 90px;">科目类型</th>
                                            <th style="width: 120px;">辅助核算</th>
                                            <th style="width: 90px;">余额方向</th>
                                            <th style="width: 90px;">状态</th>
                                            <th>备注</th>
                                            <th style="width: 110px;">控制发生方向</th>
                                        </tr>
                                    </thead>
                                    <tbody id="subject-table-body">
                                        ${buildSubjectRows(storedAccounts.slice(0, 50))}
                                    </tbody>
                                </table>
                            </div>
                            <div class="subject-pagination" id="subject-pagination"></div>
                        </div>
                    </div>

                    <div class="subject-modal" id="subject-form-modal">
                        <div class="subject-modal-mask" onclick="closeSubjectForm()"></div>
                        <div class="subject-form-panel" id="subject-form-panel" data-code="">
                            <div class="subject-form-header">修改</div>
                            <div class="subject-form-body">
                                <div>
                                    <label>科目编码</label>
                                    <input id="subject-form-code" type="text" disabled>
                                </div>
                                <div>
                                    <label>科目名称</label>
                                    <input id="subject-form-name" type="text">
                                </div>
                                <div>
                                    <label>科目类别</label>
                                    <select id="subject-form-type">
                                        <option value="资产">资产</option>
                                        <option value="负债">负债</option>
                                        <option value="权益">权益</option>
                                        <option value="成本">成本</option>
                                        <option value="损益">损益</option>
                                    </select>
                                </div>
                                <div>
                                    <label>余额方向</label>
                                    <div class="subject-form-inline">
                                        <label><input type="radio" name="subject-form-direction" value="借">借</label>
                                        <label><input type="radio" name="subject-form-direction" value="贷">贷</label>
                                    </div>
                                </div>
                                <div>
                                    <label>控制发生方向</label>
                                    <div class="subject-form-inline">
                                        <label><input type="radio" name="subject-form-control" value="否">否</label>
                                        <label><input type="radio" name="subject-form-control" value="是">是</label>
                                    </div>
                                </div>
                                <div>
                                    <label>备注</label>
                                    <textarea id="subject-form-remark"></textarea>
                                </div>
                                <div>
                                    <label>辅助核算</label>
                                    <div class="subject-form-inline">
                                        <label><input type="checkbox" name="subject-form-aux" value="客户">客户</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="供应商">供应商</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="部门">部门</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="员工">员工</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="项目">项目</label>
                                        <label><input type="checkbox" name="subject-form-aux" value="车辆">车辆</label>
                                    </div>
                                </div>
                            </div>
                            <div class="subject-form-footer">
                                <button class="btn-primary" onclick="saveSubjectForm()">确定</button>
                                <button class="btn-primary" style="background:#95a5a6;" onclick="closeSubjectForm()">取消</button>
                            </div>
                        </div>
                    </div>
                `;

        setTimeout(() => {
            const prefix = window._subjectTreeFilterPrefix || "";
            const type = window._subjectTreeFilterType || "";
            const selector = `.subject-tree-link[data-prefix="${prefix}"][data-type="${type}"]`;
            const link = document.querySelector(selector) || document.querySelector(".subject-tree-root");
            if (typeof window.filterSubjectTree === "function") {
                window.filterSubjectTree(prefix, type, link);
            } else if (typeof window.renderSubjectTablePage === "function") {
                window.renderSubjectTablePage(1);
            }
        }, 0);

        // Bug 3 Fix：一键去重——每个科目编码只保留最后一条（后来者优先）
        window.deduplicateSubjects = function () {
            if (!confirm('将对科目列表执行去重：每个编码只保留最后一条记录，重复条目将被删除。确认继续？')) return;
            let accounts = [];
            try { accounts = JSON.parse(sessionStorage.getItem('AcctSubjects') || '[]'); } catch(e) {}
            const seen = {};
            // 从后往前遍历，保留最后一条
            for (let i = accounts.length - 1; i >= 0; i--) {
                if (seen[accounts[i].code]) {
                    accounts.splice(i, 1);
                } else {
                    seen[accounts[i].code] = true;
                }
            }
            sessionStorage.setItem('AcctSubjects', JSON.stringify(accounts));
            localStorage.setItem('AcctSubjects', JSON.stringify(accounts));
            if (typeof loadContent === 'function') loadContent('AcctSubject');
        };

    contentArea.innerHTML = contentHTML;

};

// =========================================================================
// AcctSet
// =========================================================================
window.VM_MODULES['AcctSet'] = function(contentArea, contentHTML, moduleCode) {
        contentHTML += `
        <style>
            .acct-tree-table { width:100%; border-collapse:collapse; font-size:13px; }
            .acct-tree-table th, .acct-tree-table td { padding:10px 12px; text-align:left; border-bottom:1px solid #f0f0f0; }
            .acct-tree-table thead th { background:#fafafa; font-weight:500; color:#666; border-bottom:1px solid #e0e0e0; }
            .acct-tree-table tbody tr:hover { background:#fafafa; }
            .badge-type-merge { display:inline-block; padding:2px 8px; border-radius:3px; font-size:12px; background:#e6f0ff; color:#2563eb; border:1px solid #bfdbfe; }
            .badge-type-calc { display:inline-block; padding:2px 8px; border-radius:3px; font-size:12px; background:#f1f5f9; color:#475569; border:1px solid #e2e8f0; }
            .badge-acct-enabled { display:inline-block; padding:2px 8px; border-radius:3px; font-size:12px; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
            .badge-acct-init { display:inline-block; padding:2px 8px; border-radius:3px; font-size:12px; background:#fff7ed; color:#ea580c; border:1px solid #fed7aa; }
            .badge-acct-disabled { display:inline-block; padding:2px 8px; border-radius:3px; font-size:12px; background:#fef2f2; color:#dc2626; border:1px solid #fecaca; }
            .acct-action-link { color:#2563eb; text-decoration:none; cursor:pointer; border:none; background:none; font-size:13px; padding:0; margin-right:12px; }
            .acct-action-link:hover { text-decoration:underline; }
            .acct-action-link.danger { color:#dc2626; }
            .acct-toggle-btn { cursor:pointer; user-select:none; margin-right:4px; font-size:11px; }
            #acctAddModal, #acctDisableModal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; align-items:center; justify-content:center; }
            #acctAddModal.show, #acctDisableModal.show { display:flex; }
            #acctPushModal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:2000; align-items:center; justify-content:center; }
            #acctPushModal.show { display:flex; }
            .push-target-card { border:1px solid #e5e7eb; border-radius:8px; padding:16px 18px; margin-bottom:12px; background:#fafafa; }
            .push-target-card:last-child { margin-bottom:0; }
            .push-rule-row { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
            .push-rule-label { font-size:13px; color:#555; width:110px; flex-shrink:0; }
            .push-cbx-item { display:flex; align-items:center; gap:4px; font-size:13px; cursor:pointer; user-select:none; }
            .push-last-time { font-size:12px; color:#9ca3af; margin-top:8px; padding-top:8px; border-top:1px dashed #e5e7eb; }
            .acct-modal-box { background:#fff; border-radius:4px; width:480px; box-shadow:0 4px 20px rgba(0,0,0,0.2); }
            .acct-modal-hdr { padding:16px 20px; border-bottom:1px solid #e0e0e0; display:flex; justify-content:space-between; align-items:center; }
            .acct-modal-bdy { padding:20px; }
            .acct-modal-ftr { padding:12px 20px; border-top:1px solid #e0e0e0; display:flex; justify-content:flex-end; gap:8px; }
            .acct-fgroup { margin-bottom:16px; }
            .acct-flabel { display:block; margin-bottom:6px; font-size:13px; color:#666; }
            .acct-finput, .acct-fselect { width:100%; padding:8px 12px; border:1px solid #ddd; border-radius:3px; font-size:13px; }
            .acct-sbtn { padding:7px 16px; border:1px solid #ddd; background:#fff; border-radius:3px; cursor:pointer; font-size:13px; }
            .acct-sbtn:hover { background:#f5f5f5; }
            .acct-sbtn-primary { background:#333; color:#fff; border-color:#333; }
            .acct-sbtn-primary:hover { background:#555; }
        </style>

        <div style="padding:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h2 style="margin:0; font-size:18px; color:#1a1a1a;">多级会计账套体系 <span style="font-size:14px;font-weight:400;color:#888;">(平行分类账架构)</span></h2>
                <div style="display:flex;align-items:center;gap:10px;">
                    <!-- ★ 当前帐套标签 + 下拉选择器（分开显示） -->
                    <span style="font-size:13px;color:#374151;font-weight:500;white-space:nowrap;">当前账套</span>
                    <select id="global-acct-set-select"
                        style="border:1.5px solid #a8c4e8;border-radius:6px;padding:5px 10px;background:#f0f7ff;color:#1d4ed8;font-size:13px;font-weight:600;cursor:pointer;min-width:100px;max-width:180px;outline:none;"
                        onchange="window.switchAcctSet && window.switchAcctSet(this.value, this.options[this.selectedIndex].text)">
                        <option value="" disabled selected>-- 请启用帐套 --</option>
                    </select>
                    <!-- 帐套导入（仅 UI，功能待开发） -->
                    <button class="acct-sbtn" onclick="alert('帐套导入功能开发中，敬请期待。')"
                        style="color:#2563eb;border-color:#2563eb;">帐套导入</button>
                    <!-- 帐套备份（仅 UI，功能待开发） -->
                    <button class="acct-sbtn" onclick="alert('帐套备份功能开发中，敬请期待。')"
                        style="color:#2563eb;border-color:#2563eb;">帐套备份</button>
                    <button class="acct-sbtn acct-sbtn-primary" onclick="window.acctOpenAddModal()">+ 新增组织/账套</button>
                </div>
            </div>
            <div style="background:#fff; border:1px solid #e0e0e0; border-radius:4px; overflow:hidden;">
                <table class="acct-tree-table">
                    <thead>
                        <tr>
                            <th style="width:220px;">账套名称</th>
                            <th style="width:120px;">账套编码</th>
                            <th style="width:100px;">账套类型</th>
                            <th style="width:110px;">关联源</th>
                            <th style="width:160px;">核算准则</th>
                            <th style="width:110px;">当前状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="acctTreeBody"></tbody>
                </table>
            </div>
        </div>

        <!-- 新增账套弹窗 -->
        <div id="acctAddModal">
            <div class="acct-modal-box">
                <div class="acct-modal-hdr">
                    <span style="font-size:16px;font-weight:500;">新增账套</span>
                    <button onclick="window.acctCloseAddModal()" style="border:none;background:none;font-size:20px;cursor:pointer;color:#999;">×</button>
                </div>
                <div class="acct-modal-bdy">
                    <div class="acct-fgroup">
                        <label class="acct-flabel">上级账套</label>
                        <select class="acct-fselect" id="acctFormParent"><option value="">（顶级账套，无上级）</option></select>
                    </div>
                    <div class="acct-fgroup">
                        <label class="acct-flabel">账套名称 <span style="color:#c00;">*</span></label>
                        <input type="text" class="acct-finput" id="acctFormName" placeholder="请输入账套名称">
                    </div>
                    <div class="acct-fgroup">
                        <label class="acct-flabel">账套编码 <span style="color:#c00;">*</span></label>
                        <input type="text" class="acct-finput" id="acctFormCode" placeholder="请输入账套编码">
                    </div>
                    <div class="acct-fgroup">
                        <label class="acct-flabel">账套类型 <span style="color:#c00;">*</span></label>
                        <select class="acct-fselect" id="acctFormType">
                            <option value="merge">合并账套</option>
                            <option value="calc" selected>核算账套</option>
                        </select>
                    </div>
                    <div class="acct-fgroup">
                        <label class="acct-flabel">会计准则</label>
                        <select class="acct-fselect" id="acctFormPrinciple">
                            <option value="企业准则">企业会计准则</option>
                            <option value="小企业准则">小企业会计准则</option>
                        </select>
                        <div style="font-size:12px;color:#999;margin-top:4px;">顶级合并账套统一设定，子账套自动继承</div>
                    </div>
                </div>
                <div class="acct-modal-ftr">
                    <button class="acct-sbtn" onclick="window.acctCloseAddModal()">取消</button>
                    <button class="acct-sbtn acct-sbtn-primary" onclick="window.acctHandleAddSubmit()">确定</button>
                </div>
            </div>
        </div>

        <!-- 推送模板引擎弹窗 -->
        <div id="acctPushModal">
            <div class="acct-modal-box" style="width:600px;max-height:85vh;display:flex;flex-direction:column;">
                <div class="acct-modal-hdr">
                    <span style="font-size:16px;font-weight:500;">📤 推送模板引擎</span>
                    <button onclick="window.acctClosePushModal()" style="border:none;background:none;font-size:20px;cursor:pointer;color:#999;">×</button>
                </div>
                <div class="acct-modal-bdy" id="acctPushModalBody" style="flex:1;overflow-y:auto;max-height:60vh;"></div>
                <div class="acct-modal-ftr" style="justify-content:space-between;align-items:center;">
                    <span id="acctPushModalStatus" style="font-size:13px;color:#16a34a;"></span>
                    <button class="acct-sbtn" onclick="window.acctClosePushModal()">关闭</button>
                </div>
            </div>
        </div>

        <!-- 停用确认弹窗 -->
        <div id="acctDisableModal">
            <div class="acct-modal-box" style="width:380px;">
                <div class="acct-modal-hdr">
                    <span style="font-size:16px;font-weight:500;">停用确认</span>
                    <button onclick="window.acctCloseDisableModal()" style="border:none;background:none;font-size:20px;cursor:pointer;color:#999;">×</button>
                </div>
                <div class="acct-modal-bdy">
                    <p style="color:#555;line-height:1.6;">确定要停用 <strong id="acctDisableName"></strong> 吗？</p>
                    <p style="color:#e74c3c;font-size:13px;margin-top:8px;">⚠ 停用后该账套将无法录入新凭证，下级核算账套也将同步停用。</p>
                </div>
                <div class="acct-modal-ftr">
                    <button class="acct-sbtn" onclick="window.acctCloseDisableModal()">取消</button>
                    <button class="acct-sbtn" style="background:#e74c3c;color:#fff;border-color:#e74c3c;" onclick="window.acctHandleDisableConfirm()">确认停用</button>
                </div>
            </div>
        </div>
        `;

        setTimeout(() => {
            let treeData = JSON.parse(sessionStorage.getItem('AcctSetTree') || 'null');
            if (!treeData) {
                // 默认所有账套状态为 disabled，需手动启用
                treeData = [{
                    id: 1, name: '集团总账套', code: 'ZJKZ', type: 'merge',
                    principle: '企业准则', status: 'disabled', principleInherited: false, expanded: true,
                    children: [
                        {id: 3, name: '分公司-华东', code: 'FJBD', type: 'calc', principle: '企业准则', status: 'disabled', principleInherited: true, expanded: true, children: [
                            {id: 5, name: '子公司-上海', code: 'ZJSH', type: 'calc', principle: '企业准则', status: 'disabled', principleInherited: true, expanded: false, children: []}
                        ]}
                    ]
                }];
                sessionStorage.setItem('AcctSetTree', JSON.stringify(treeData));
            }
            window._acctTreeData = treeData;
            window._acctDisablingId = null;

            // 将已启用账套同步到 FinanceAccountBooks，供会计期间识别
            window.acctSyncToFinanceBooks = function() {
                const books = [];
                function collect(nodes) {
                    nodes.forEach(n => {
                        if (n.status === 'enabled') {
                            books.push({ id: String(n.id), code: n.code, name: n.name, site: n.name, status: '已启用' });
                        }
                        if (n.children) collect(n.children);
                    });
                }
                collect(window._acctTreeData);
                sessionStorage.setItem('FinanceAccountBooks', JSON.stringify(books));
            };

            window.acctFindNode = function(nodes, id) {
                for (const n of nodes) {
                    if (n.id === id) return n;
                    if (n.children) { const f = window.acctFindNode(n.children, id); if (f) return f; }
                }
                return null;
            };

            window.acctRenderTree = function() {
                const tbody = document.getElementById('acctTreeBody');
                if (!tbody) return;
                const rows = [];
                function renderNodes(nodes, level, parentNode) {
                    nodes.forEach(node => {
                        const indent = level * 22;
                        const hasChildren = node.children && node.children.length > 0;
                        const typeClass = node.type === 'merge' ? 'badge-type-merge' : 'badge-type-calc';
                        const typeText = node.type === 'merge' ? '合并账套' : '核算账套';

                        // 关联源：二级及以下节点显示父账套编码
                        const linkedSource = (level >= 2 && parentNode)
                            ? `<span style="color:#555;font-size:13px;">🔗 ${parentNode.code}</span>`
                            : '–';

                        // 状态：dot + text 样式
                        let statusText = '';
                        if (node.status === 'enabled') {
                            statusText = '<span style="color:#16a34a;font-weight:500;">● 已启用</span>';
                        } else {
                            statusText = '<span style="color:#dc2626;font-weight:500;">● 已停用</span>';
                        }

                        const principleText = node.principle || '企业准则';

                        // 操作按钮（按截图规则）
                        let actions = '';
                        if (node.status === 'enabled') {
                            actions += `<button class="acct-action-link" onclick="loadContent('SettlementEngineConfig')">引擎配置</button>`;
                            // 核算账套且有子账套：显示"推送模板引擎"
                            if (node.type === 'calc' && hasChildren) {
                                actions += `<button class="acct-action-link" style="color:#e67e22;" onclick="window.acctPushTemplate(${node.id})">推送模板引擎</button>`;
                            }
                            // 非合并账套才显示"复制"
                            if (node.type !== 'merge') {
                                actions += `<button class="acct-action-link" onclick="window.acctHandleCopy(${node.id})">复制</button>`;
                            }
                            actions += `<button class="acct-action-link danger" onclick="window.acctOpenDisable(${node.id})">停用</button>`;
                        } else {
                            actions += `<button class="acct-action-link" style="color:#27ae60;" onclick="window.acctHandleEnable(${node.id})">启用</button>`;
                        }

                        const toggleBtn = hasChildren
                            ? `<span class="acct-toggle-btn" onclick="window.acctToggleNode(${node.id})">${node.expanded ? '▼' : '▶'}</span>`
                            : '<span style="display:inline-block;width:18px;"></span>';
                        const childPrefix = level > 0
                            ? `<span style="color:#bbb;margin-right:2px;font-size:12px;">└─</span>`
                            : '';

                        rows.push(`<tr>
                            <td><span style="padding-left:${indent}px;">${toggleBtn}${childPrefix}${node.name}</span></td>
                            <td style="color:#555;">${node.code}</td>
                            <td><span class="${typeClass}">${typeText}</span></td>
                            <td>${linkedSource}</td>
                            <td style="color:#444;">${principleText}</td>
                            <td>${statusText}</td>
                            <td>${actions}</td>
                        </tr>`);
                        if (hasChildren && node.expanded) renderNodes(node.children, level + 1, node);
                    });
                }
                renderNodes(window._acctTreeData, 0, null);
                tbody.innerHTML = rows.join('');
                const parentSelect = document.getElementById('acctFormParent');
                if (parentSelect) {
                    const opts = ['<option value="">（顶级账套，无上级）</option>'];
                    function collectOpts(nodes, prefix) { nodes.forEach(n => { opts.push(`<option value="${n.id}">${prefix}${n.name}</option>`); if (n.children && n.children.length) collectOpts(n.children, prefix + '　'); }); }
                    collectOpts(window._acctTreeData, '');
                    parentSelect.innerHTML = opts.join('');
                }
            };

            // ── 推送模板引擎：打开配置弹窗 ──
            window.acctPushTemplate = function(id) {
                const node = window.acctFindNode(window._acctTreeData, id);
                if (!node) return;

                const children = node.children || [];
                if (!children.length) {
                    alert('该账套下没有子账套，无法推送。');
                    return;
                }

                const statuses = ['待审核', '已审核', '已记账', '已过账'];

                let bodyHTML = `
                    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:12px 16px;margin-bottom:16px;">
                        <div style="font-size:13px;color:#1d4ed8;font-weight:600;">源帐套：${node.name}（${node.code}）</div>
                        <div style="font-size:12px;color:#3b82f6;margin-top:4px;">全量推送将用源帐套凭证（按模板规则过滤后）<strong>覆盖</strong>目标帐套的凭证数据。</div>
                    </div>`;

                children.forEach(child => {
                    const tplRaw = sessionStorage.getItem('PushTemplate_' + child.code);
                    const tpl = tplRaw ? JSON.parse(tplRaw) : {
                        sourceCode: node.code,
                        targetCode: child.code,
                        statusFilter: ['已审核', '已记账', '已过账'],
                        excludeSystemVouchers: false,
                        excludeAccountPrefixes: ''
                    };
                    const lastPush = sessionStorage.getItem('PushLog_' + child.code) || '';
                    const hasSnapshot = !!sessionStorage.getItem('AcctSetData_' + child.code);
                    const statusDot = child.status === 'enabled'
                        ? '<span style="color:#16a34a;font-size:12px;">● 已启用</span>'
                        : '<span style="color:#dc2626;font-size:12px;">● 已停用</span>';

                    const statusCbx = statuses.map(s =>
                        `<label class="push-cbx-item">
                            <input type="checkbox" class="ptpl-status" data-target="${child.code}" value="${s}"
                                ${(tpl.statusFilter || []).includes(s) ? 'checked' : ''}>
                            ${s}
                        </label>`
                    ).join('');

                    bodyHTML += `
                    <div class="push-target-card">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
                            <div>
                                <span style="font-size:14px;font-weight:600;">目标：${child.name}</span>
                                <span style="font-size:12px;color:#6b7280;margin-left:6px;">(${child.code})</span>
                                <span style="margin-left:8px;">${statusDot}</span>
                            </div>
                            ${!hasSnapshot ? '<span style="font-size:12px;color:#dc2626;">⚠ 未初始化，请先启用该帐套</span>' : ''}
                        </div>
                        <div class="push-rule-row">
                            <span class="push-rule-label">推送凭证状态</span>
                            <div style="display:flex;gap:12px;flex-wrap:wrap;">${statusCbx}</div>
                        </div>
                        <div class="push-rule-row">
                            <span class="push-rule-label">排除系统凭证</span>
                            <label class="push-cbx-item">
                                <input type="checkbox" class="ptpl-exsys" data-target="${child.code}"
                                    ${tpl.excludeSystemVouchers ? 'checked' : ''}>
                                排除期末结转凭证（系统自动生成）
                            </label>
                        </div>
                        <div class="push-rule-row">
                            <span class="push-rule-label">排除科目编码</span>
                            <input type="text" class="acct-finput ptpl-excodes" data-target="${child.code}"
                                style="flex:1;max-width:320px;"
                                placeholder="科目编码前缀，逗号分隔（如: 99,9999）"
                                value="${tpl.excludeAccountPrefixes || ''}">
                        </div>
                        <div style="display:flex;gap:8px;margin-top:14px;">
                            <button class="acct-sbtn" style="font-size:13px;"
                                onclick="window.savePushTemplate('${node.code}','${child.code}')">
                                💾 保存模板
                            </button>
                            <button class="acct-sbtn" style="font-size:13px;background:#e67e22;color:#fff;border-color:#e67e22;"
                                onclick="window.executePushToTarget('${node.code}','${child.code}')">
                                📤 立即推送
                            </button>
                        </div>
                        ${lastPush ? `<div class="push-last-time">🕐 上次推送：${lastPush}</div>` : ''}
                    </div>`;
                });

                document.getElementById('acctPushModalBody').innerHTML = bodyHTML;
                document.getElementById('acctPushModalStatus').textContent = '';
                document.getElementById('acctPushModal').classList.add('show');
            };

            window.acctClosePushModal = function() {
                document.getElementById('acctPushModal').classList.remove('show');
            };

            // 保存单个目标的推送模板配置
            window.savePushTemplate = function(sourceCode, targetCode) {
                const statusInputs = document.querySelectorAll(`.ptpl-status[data-target="${targetCode}"]:checked`);
                const statusFilter = Array.from(statusInputs).map(cb => cb.value);
                const exSys = document.querySelector(`.ptpl-exsys[data-target="${targetCode}"]`)?.checked || false;
                const exCodes = document.querySelector(`.ptpl-excodes[data-target="${targetCode}"]`)?.value || '';
                const tpl = { sourceCode, targetCode, statusFilter, excludeSystemVouchers: exSys, excludeAccountPrefixes: exCodes };
                sessionStorage.setItem('PushTemplate_' + targetCode, JSON.stringify(tpl));
                const statusEl = document.getElementById('acctPushModalStatus');
                if (statusEl) {
                    statusEl.textContent = `✓ 「${targetCode}」模板已保存`;
                    setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 2500);
                }
            };

            // 执行全量推送（先自动保存模板，再推送）
            window.executePushToTarget = function(sourceCode, targetCode) {
                window.savePushTemplate(sourceCode, targetCode);

                const tplRaw = sessionStorage.getItem('PushTemplate_' + targetCode);
                if (!tplRaw) { alert('请先保存模板配置'); return; }
                const tpl = JSON.parse(tplRaw);

                const targetSnapRaw = sessionStorage.getItem('AcctSetData_' + targetCode);
                if (!targetSnapRaw) {
                    alert('目标帐套「' + targetCode + '」快照不存在，请先在账套管理中启用该账套。');
                    return;
                }

                // 保存当前帐套状态
                const currentCode = sessionStorage.getItem('CurrentAcctSetCode');
                if (currentCode) window.saveCurrentAcctSetSnapshot();

                // 读取源帐套凭证
                let sourceVouchers;
                if (currentCode === sourceCode) {
                    sourceVouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
                } else {
                    const sourceSnapRaw = sessionStorage.getItem('AcctSetData_' + sourceCode);
                    if (!sourceSnapRaw) { alert('源帐套数据快照不存在'); return; }
                    sourceVouchers = JSON.parse(JSON.parse(sourceSnapRaw).ManualVouchers || '[]');
                }

                // 应用过滤规则
                const statusSet = new Set(tpl.statusFilter || []);
                const excludePrefixes = (tpl.excludeAccountPrefixes || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);

                const filtered = sourceVouchers
                    .filter(v => {
                        if (statusSet.size && !statusSet.has(v.status)) return false;
                        if (tpl.excludeSystemVouchers) {
                            if ((v.user || '').includes('期末结转') || (v.summary || '').includes('期末结转')) return false;
                        }
                        return true;
                    })
                    .map(v => {
                        if (!excludePrefixes.length) return JSON.parse(JSON.stringify(v)); // 深拷贝
                        const filteredLines = (v.lines || []).filter(line => {
                            const code = (line.accountCode || line.account || '').toString().trim().split(/\s+/)[0];
                            return !excludePrefixes.some(p => code.startsWith(p));
                        });
                        return Object.assign({}, v, { lines: filteredLines });
                    })
                    .filter(v => (v.lines || []).length > 0);

                // 写入目标帐套快照（覆盖 ManualVouchers）
                const targetSnap = JSON.parse(targetSnapRaw);
                targetSnap.ManualVouchers = JSON.stringify(filtered);
                sessionStorage.setItem('AcctSetData_' + targetCode, JSON.stringify(targetSnap));

                // 若当前正在查看目标帐套，同步刷新全局数据
                if (currentCode === targetCode) {
                    sessionStorage.setItem('ManualVouchers', JSON.stringify(filtered));
                }

                // 记录推送时间
                const now = new Date().toLocaleString('zh-CN');
                sessionStorage.setItem('PushLog_' + targetCode, now);

                // 刷新弹窗内的"上次推送"时间
                const card = document.querySelector(`.push-target-card [data-target="${targetCode}"]`)
                    ?.closest('.push-target-card');
                if (card) {
                    let logEl = card.querySelector('.push-last-time');
                    if (!logEl) {
                        logEl = document.createElement('div');
                        logEl.className = 'push-last-time';
                        card.appendChild(logEl);
                    }
                    logEl.textContent = `🕐 上次推送：${now}`;
                }

                const statusEl = document.getElementById('acctPushModalStatus');
                if (statusEl) statusEl.textContent = `✅ 推送完成：${filtered.length} 张凭证 → 「${targetCode}」（共 ${sourceVouchers.length} 张中筛出 ${filtered.length} 张）`;
            };

            window.acctToggleNode = function(id) {
                const node = window.acctFindNode(window._acctTreeData, id);
                if (node) { node.expanded = !node.expanded; sessionStorage.setItem('AcctSetTree', JSON.stringify(window._acctTreeData)); window.acctRenderTree(); }
            };
            window.acctOpenAddModal = function(parentId) {
                document.getElementById('acctFormName').value = '';
                document.getElementById('acctFormCode').value = '';
                document.getElementById('acctFormType').value = 'calc';
                if (parentId) document.getElementById('acctFormParent').value = parentId;
                document.getElementById('acctAddModal').classList.add('show');
            };
            window.acctCloseAddModal = function() { document.getElementById('acctAddModal').classList.remove('show'); };
            window.acctHandleAddSubmit = function() {
                const name = document.getElementById('acctFormName').value.trim();
                const code = document.getElementById('acctFormCode').value.trim();
                if (!name || !code) { alert('请填写账套名称和编码'); return; }
                // 新增账套默认禁用，需手动启用
                const newNode = { id: Date.now(), name, code, type: document.getElementById('acctFormType').value, principle: document.getElementById('acctFormPrinciple').value, status: 'disabled', principleInherited: true, expanded: false, children: [] };
                const parentId = Number(document.getElementById('acctFormParent').value) || null;
                if (parentId) { const parent = window.acctFindNode(window._acctTreeData, parentId); if (parent) parent.children.push(newNode); } else { window._acctTreeData.push(newNode); }
                sessionStorage.setItem('AcctSetTree', JSON.stringify(window._acctTreeData));
                window.acctCloseAddModal(); window.acctRenderTree();
            };
            window.acctHandleCopy = function(id) {
                const src = window.acctFindNode(window._acctTreeData, id);
                if (!src) return;
                const copyName = prompt('复制帐套，请输入新帐套名称：', src.name + '-副本');
                if (!copyName) return;
                const copyCode = prompt('请输入新帐套编码（不能与已有编码重复）：', src.code + '2');
                if (!copyCode) return;

                const newNode = {
                    id: Date.now(), name: copyName, code: copyCode,
                    type: src.type, principle: src.principle,
                    status: 'disabled', principleInherited: src.principleInherited,
                    expanded: false, children: []
                };

                // ★ 复制源帐套的数据快照（保留全部凭证、科目等）
                const srcSnap = sessionStorage.getItem('AcctSetData_' + src.code);
                if (srcSnap) {
                    sessionStorage.setItem('AcctSetData_' + copyCode, srcSnap);
                } else {
                    // 源帐套无快照，用初始化数据代替
                    if (typeof window.initAcctSetData === 'function') {
                        window.initAcctSetData(copyCode, src.principle || '企业准则');
                    }
                }

                // 插入到同级（紧跟在源帐套之后）
                function findParentAndInsert(nodes, targetId) {
                    for (let i = 0; i < nodes.length; i++) {
                        if (nodes[i].id === targetId) { nodes.splice(i + 1, 0, newNode); return true; }
                        if (nodes[i].children && findParentAndInsert(nodes[i].children, targetId)) return true;
                    }
                    return false;
                }
                if (!findParentAndInsert(window._acctTreeData, id)) window._acctTreeData.push(newNode);
                sessionStorage.setItem('AcctSetTree', JSON.stringify(window._acctTreeData));
                window.acctRenderTree();
                alert('帐套「' + copyName + '」已复制（含原帐套数据），当前状态为"已停用"，可手动启用。');
            };
            window.acctOpenDisable = function(id) {
                const node = window.acctFindNode(window._acctTreeData, id);
                if (!node) return;
                window._acctDisablingId = id;
                document.getElementById('acctDisableName').textContent = node.name;
                document.getElementById('acctDisableModal').classList.add('show');
            };
            window.acctCloseDisableModal = function() { document.getElementById('acctDisableModal').classList.remove('show'); };
            window.acctHandleDisableConfirm = function() {
                const node = window.acctFindNode(window._acctTreeData, window._acctDisablingId);
                if (node) {
                    function dis(n) { n.status = 'disabled'; if (n.children) n.children.forEach(dis); }
                    dis(node);
                    sessionStorage.setItem('AcctSetTree', JSON.stringify(window._acctTreeData));
                    // 同步移除已停用账套的会计期间数据
                    if (typeof window.removeAccountPeriodsForBook === 'function') {
                        window.removeAccountPeriodsForBook(String(node.id));
                    }
                    window.acctSyncToFinanceBooks();
                }
                window.acctCloseDisableModal(); window.acctRenderTree();
            };
            window.acctHandleEnable = function(id) {
                const node = window.acctFindNode(window._acctTreeData, id);
                if (!node) return;

                node.status = 'enabled';
                sessionStorage.setItem('AcctSetTree', JSON.stringify(window._acctTreeData));

                // ★ 若该帐套还没有数据快照，则初始化默认数据（科目体系 + 空凭证）
                const snapKey = 'AcctSetData_' + node.code;
                if (!sessionStorage.getItem(snapKey)) {
                    if (typeof window.initAcctSetData === 'function') {
                        window.initAcctSetData(node.code, node.principle || '企业准则');
                    }
                }

                // 同步到 FinanceAccountBooks，并初始化当年期间
                window.acctSyncToFinanceBooks();
                if (typeof window.ensureAccountPeriodsForBook === 'function') {
                    window.ensureAccountPeriodsForBook(
                        { id: String(node.id), code: node.code, name: node.name },
                        new Date().getFullYear()
                    );
                }

                // ★ 更新 header 帐套选择器
                if (typeof window.updateGlobalAcctSetSelector === 'function') {
                    window.updateGlobalAcctSetSelector();
                }
                // ★ 刷新页面内当前帐套标签
                window._acctRefreshCurrentLabel && window._acctRefreshCurrentLabel();

                // ★ 询问是否切换到该帐套（切换后留在本页，不跳首页）
                if (confirm('帐套「' + node.name + '」已启用并完成初始化。\n是否立即切换到该帐套？')) {
                    if (typeof window.switchAcctSet === 'function') {
                        window.switchAcctSet(node.code, node.name);
                    }
                }
                // 无论是否切换，都留在帐套页刷新列表
                window.acctRenderTree();
            };
            // 刷新页面内的帐套选择器（updateGlobalAcctSetSelector 统一处理）
            window._acctRefreshCurrentLabel = function() {
                window.updateGlobalAcctSetSelector && window.updateGlobalAcctSetSelector();
            };

            // 初始同步一次（页面加载时保证 FinanceAccountBooks 与树状态一致）
            window.acctSyncToFinanceBooks();
            window.acctRenderTree();
            window._acctRefreshCurrentLabel();
        }, 0);

    contentArea.innerHTML = contentHTML;

};

// =========================================================================
// AcctPeriod
// =========================================================================
window.VM_MODULES['AcctPeriod'] = function(contentArea, contentHTML, moduleCode) {
        const books = window.getAccountBooks ? window.getAccountBooks() : [];
        const currentYear = new Date().getFullYear();
        const incomeTemplate = typeof window.getIncomeStatementTemplate === "function"
            ? window.getIncomeStatementTemplate()
            : [];
        const parseCodes = (value) => (value || "")
            .toString()
            .split(/[,，]/)
            .map(item => item.trim())
            .filter(Boolean);
        const matchCode = (code, codes) => codes.some(prefix => code.startsWith(prefix));
        const calcTemplateAmount = (codes, op) => {
            if (!codes.length) return 0;
            let total = 0;
            vouchers.forEach((v) => {
                if (v.status === "已审核" || v.status === "已记账" || v.status === "已过账") {
                    if (!v.lines) return;
                    v.lines.forEach((line) => {
                        const account = line.account ? line.account.trim() : "";
                        const code = account.split(" ")[0];
                        if (!code || !matchCode(code, codes)) return;
                        const debit = parseFloat(line.debit) || 0;
                        const credit = parseFloat(line.credit) || 0;
                        if (op === "-") {
                            total += debit - credit;
                        } else {
                            total += credit - debit;
                        }
                    });
                }
            });
            return total;
        };
        if (window.ensureAccountPeriodsForBook) {
            books.forEach(book => window.ensureAccountPeriodsForBook(book, currentYear));
        }
        const periods = window.getAccountPeriods ? window.getAccountPeriods() : [];
        const bookOptions = books.map(b => `<option value="${b.id}">${b.name}</option>`).join("");
        const periodOptions = Array.from(new Set(periods.map(p => p.period)))
            .sort()
            .map(p => `<option value="${p}">${p}</option>`).join("");

        const rows = periods
            .sort((a, b) => {
                const bookA = a.bookName || "";
                const bookB = b.bookName || "";
                if (bookA !== bookB) {
                    return bookA.localeCompare(bookB, "zh-Hans-CN");
                }
                return a.period.localeCompare(b.period);
            })
            .map((item, idx) => {
                const statusColor = item.status === "已开启" ? "#27ae60" : item.status === "已关闭" ? "#e67e22" : "#f39c12";
                return `
                    <tr data-book="${item.bookId}" data-period="${item.period}" data-status="${item.status}">
                        <td style="text-align:center;"><input type="checkbox" class="period-select" data-id="${item.id}"></td>
                        <td>${item.site || "-"}</td>
                        <td>${item.period}</td>
                        <td><span style="color:${statusColor}; font-weight:600;">● ${item.status}</span></td>
                    </tr>
                `;
            }).join("");

        contentHTML += `
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 16px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
                            <label style="color:#666;">会计期间</label>
                            <select id="period-filter-period" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 160px;">
                                <option value="">全部</option>
                                ${periodOptions}
                            </select>
                            <label style="color:#666;">状态</label>
                            <select id="period-filter-status" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 140px;">
                                <option value="">全部</option>
                                <option value="已开启">已开启</option>
                                <option value="未开启">未开启</option>
                                <option value="已关闭">已关闭</option>
                            </select>
                            <button class="btn-primary" onclick="filterAcctPeriods()">查询</button>
                        </div>
                    </div>
                    
                    <div class="action-bar" style="margin-bottom: 8px;">
                        <button class="btn-primary" onclick="createNextYearPeriods()">➕ 新增期间</button>
                        <button class="btn-primary" onclick="setPeriodStatusBulk('已开启')">✅ 开启期间</button>
                    </div>
                    <p style="color:#e67e22; font-size:13px; margin-bottom:12px; padding:8px 12px; background:#fff8e1; border-radius:4px; border-left:3px solid #f39c12;">
                        ⚠️ 期间关闭请通过「月末结账」流程执行，系统完成结账检查后自动关闭期间。如需管理员强制操作，请联系系统管理员。
                    </p>

                    <table class="data-table">
                        <thead>
                            <tr>
                                <th style="width:40px; text-align:center;"><input type="checkbox" onclick="toggleAllPeriods(this.checked)"></th>
                                <th>网点</th>
                                <th>会计期间</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody id="acct-period-body">
                            ${rows}
                        </tbody>
                    </table>
                `;

    contentArea.innerHTML = contentHTML;

};

// =========================================================================
// AcctAuxiliary — 全局默认数据（文件加载时即注册，凭证录入可直接读取）
// =========================================================================
window._AUX_GLOBAL_DEFAULTS = {
    dept: [
        { code: "001", name: "人事行政", remark: "", enabled: true },
        { code: "002", name: "财务部", remark: "", enabled: true },
        { code: "003", name: "股东/董事会", remark: "", enabled: true },
        { code: "004", name: "技术部", remark: "", enabled: true },
        { code: "005", name: "数据中心", remark: "", enabled: true },
        { code: "006", name: "运营部", remark: "", enabled: true },
        { code: "007", name: "销售部", remark: "", enabled: true },
        { code: "008", name: "销售部", remark: "", enabled: true },
        { code: "009", name: "新媒体部", remark: "", enabled: true },
        { code: "011", name: "总经理", remark: "", enabled: true },
        { code: "012", name: "市场推广部", remark: "", enabled: true }
    ],
    customer: [
        { code: "001", name: "上海远通物流有限公司", remark: "", enabled: true },
        { code: "002", name: "北京华泰货运代理有限公司", remark: "", enabled: true },
        { code: "003", name: "广州跨境电商科技有限公司", remark: "", enabled: true },
        { code: "004", name: "中铁快运股份有限公司", remark: "", enabled: true },
        { code: "005", name: "顺丰速运有限公司", remark: "", enabled: true }

    ],
    vendor: [
        { code: "V01", name: "供应商1", remark: "", enabled: true },
        { code: "V02", name: "供应商2", remark: "", enabled: true },
        { code: "V03", name: "供应商3", remark: "", enabled: true },
        { code: "V04", name: "供应商4", remark: "", enabled: true }
    ],
    employee: [
        { code: "E01", name: "张三", remark: "", enabled: true },
        { code: "E02", name: "李四", remark: "", enabled: true },
        { code: "E03", name: "王五", remark: "", enabled: true },
        { code: "E04", name: "赵六", remark: "", enabled: true }
    ],
    project: [
        { code: "P04", name: "地方项目", remark: "", enabled: true },
        { code: "P03", name: "食品项目", remark: "", enabled: true },
        { code: "P02", name: "华东项目", remark: "", enabled: true },
        { code: "P01", name: "华南项目", remark: "", enabled: true }
    ],
    inventory: [
        { code: "S01", name: "存货A", remark: "", enabled: true },
        { code: "S02", name: "存货B", remark: "", enabled: true },
        { code: "S03", name: "存货C", remark: "", enabled: true },
        { code: "S04", name: "存货D", remark: "", enabled: true }
    ],
    cashflow: [
        { code: "CF01", name: "一、经营活动产生的现金流量", remark: "大类标题", enabled: true },
        { code: "CF02", name: "销售商品、提供劳务收到的现金", remark: "经营流入", enabled: true },
        { code: "CF03", name: "收到的税费返还", remark: "经营流入", enabled: true },
        { code: "CF04", name: "收到其他与经营活动有关的现金", remark: "经营流入", enabled: true },
        { code: "CF05", name: "经营活动现金流入小计", remark: "小计", enabled: true },
        { code: "CF06", name: "购买商品、接受劳务支付的现金", remark: "经营流出", enabled: true },
        { code: "CF07", name: "支付给职工以及为职工支付的现金", remark: "经营流出", enabled: true },
        { code: "CF08", name: "支付的各项税费", remark: "经营流出", enabled: true },
        { code: "CF09", name: "支付其他与经营活动有关的现金", remark: "经营流出", enabled: true },
        { code: "CF10", name: "经营活动现金流出小计", remark: "小计", enabled: true },
        { code: "CF11", name: "经营活动产生的现金流量净额", remark: "净额", enabled: true },
        { code: "CF12", name: "二、投资活动产生的现金流量", remark: "大类标题", enabled: true },
        { code: "CF13", name: "收回投资收到的现金", remark: "投资流入", enabled: true },
        { code: "CF14", name: "取得投资收益收到的现金", remark: "投资流入", enabled: true },
        { code: "CF15", name: "处置固定资产、无形资产和其他长期资产收回的现金净额", remark: "投资流入", enabled: true },
        { code: "CF16", name: "处置子公司及其他营业单位收到的现金净额", remark: "投资流入", enabled: true },
        { code: "CF17", name: "收到其他与投资活动有关的现金", remark: "投资流入", enabled: true },
        { code: "CF18", name: "投资活动现金流入小计", remark: "小计", enabled: true },
        { code: "CF19", name: "购建固定资产、无形资产和其他长期资产支付的现金", remark: "投资流出", enabled: true },
        { code: "CF20", name: "投资支付的现金", remark: "投资流出", enabled: true },
        { code: "CF21", name: "取得子公司及其他营业单位支付的现金净额", remark: "投资流出", enabled: true },
        { code: "CF22", name: "支付其他与投资活动有关的现金", remark: "投资流出", enabled: true },
        { code: "CF23", name: "投资活动现金流出小计", remark: "小计", enabled: true },
        { code: "CF24", name: "投资活动产生的现金流量净额", remark: "净额", enabled: true },
        { code: "CF25", name: "三、筹资活动产生的现金流量", remark: "大类标题", enabled: true },
        { code: "CF26", name: "吸收投资收到的现金", remark: "筹资流入", enabled: true },
        { code: "CF27", name: "取得借款收到的现金", remark: "筹资流入", enabled: true },
        { code: "CF28", name: "收到其他与筹资活动有关的现金", remark: "筹资流入", enabled: true },
        { code: "CF29", name: "筹资活动现金流入小计", remark: "小计", enabled: true },
        { code: "CF30", name: "偿还债务支付的现金", remark: "筹资流出", enabled: true },
        { code: "CF31", name: "分配股利、利润或偿付利息支付的现金", remark: "筹资流出", enabled: true },
        { code: "CF32", name: "支付其他与筹资活动有关的现金", remark: "筹资流出", enabled: true },
        { code: "CF33", name: "筹资活动现金流出小计", remark: "小计", enabled: true },
        { code: "CF34", name: "筹资活动产生的现金流量净额", remark: "净额", enabled: true },
        { code: "CF35", name: "四、汇率变动对现金及现金等价物的影响", remark: "汇率影响", enabled: true },
        { code: "CF36", name: "五、现金及现金等价物净增加额", remark: "净增加", enabled: true },
        { code: "CF37", name: "加：期初现金及现金等价物余额", remark: "期初余额", enabled: true },
        { code: "CF38", name: "六、期末现金及现金等价物余额", remark: "期末余额", enabled: true }
    ]
};

// =========================================================================
// AcctAuxiliary
// =========================================================================
window.VM_MODULES['AcctAuxiliary'] = function(contentArea, contentHTML, moduleCode) {
        const AUX_TYPES = [
            { key: "dept", label: "部门", en: "Department" },
            { key: "customer", label: "客户", en: "Customer" },
            { key: "vendor", label: "供应商", en: "Supplier" },
            { key: "employee", label: "职员", en: "Employee" },
            { key: "project", label: "项目", en: "Project" },
            { key: "inventory", label: "存货", en: "Inventory" },
            { key: "cashflow", label: "现金流量项目", en: "CashFlow" }
        ];

        const AUX_GUIDE = {
            dept: {
                title: "部门 (Department)",
                accounts: [
                    "6602 管理费用（行政、财务、人事部的支出）",
                    "6601 销售费用（销售部的支出）",
                    "5001 运输成本（车队/调度部的支出）"
                ],
                remark: "用于费用归集与绩效考核。将费用科目开启\"部门\"核算后，可统计各部门每月的经费支出（如办公费、差旅费），支持部门预算管理。"
            },
            customer: {
                title: "客户 (Customer)",
                accounts: [
                    "1122 应收账款（最核心）",
                    "2203 预收账款（或合同负债）",
                    "6001 主营业务收入"
                ],
                remark: "用于往来对账与收入分析。挂载在应收账款时，可按客户查看\"谁欠我多少运费\"及账龄分析；挂载在收入科目时，可统计各客户的业绩贡献。"
            },
            vendor: {
                title: "供应商 (Supplier)",
                accounts: [
                    "2202 应付账款（核心：付给外协车队或司机的钱）",
                    "1123 预付账款（预付油卡或定金）",
                    "6401 主营业务成本（外协运费成本）"
                ],
                remark: "用于应付账款管理与成本归集。在物流场景下，供应商不仅指卖东西的公司，也包含外协车队和个体司机。用于核算欠供应商多少运费，以及统计采购成本。"
            },
            employee: {
                title: "职员 (Employee)",
                accounts: [
                    "1221 其他应收款（核心：员工借款/备用金）",
                    "2241 其他应付款（员工垫付未报销款）"
                ],
                remark: "用于个人往来核算。主要用于管理员工的备用金借支（如司机借支路费）、出差借款，以及工资核算辅助。"
            },
            project: {
                title: "项目 (Project)",
                accounts: [
                    "5001 / 6401 运输成本",
                    "6001 主营业务收入"
                ],
                remark: "用于独立盈亏核算。在物流行业，项目通常对应\"运输线路\"（如：上海-北京专线）或\"大型合同项目\"。开启后可生成该项目的独立利润表，分析该项目赚不赚钱。"
            },
            inventory: {
                title: "存货 (Inventory)",
                accounts: [
                    "1403 原材料（油品、轮胎、尿素）",
                    "1405 低值易耗品"
                ],
                remark: "用于物资进销存管理。物流企业主要用于管理油料、轮胎、零配件的入库与领用，精确核算车辆的物料消耗成本。"
            },
            cashflow: {
                title: "现金流量项目 (CashFlow)",
                accounts: [
                    "1001 库存现金",
                    "1002 银行存款",
                    "1012 其他货币资金"
                ],
                remark: "用于现金流量表编制辅助。在记录现金收付凭证时，标注该笔资金对应的现金流量表项目（如销售商品收到的现金,）,系统可据此自动归集生成现金流量表。"
            }
        };

        // 引用全局默认数据（文件加载时已注册）
        const AUX_DEFAULTS = window._AUX_GLOBAL_DEFAULTS;

        const getAuxStorageKey = (type) => `AuxiliaryData:${type}`;
        const ensureAuxList = (type) => {
            const key = getAuxStorageKey(type);
            const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) return parsed;
                } catch (error) {
                    // fallback to defaults
                }
            }
            const seeded = (AUX_DEFAULTS[type] || []).map(item => ({ ...item }));
            sessionStorage.setItem(key, JSON.stringify(seeded));
            localStorage.setItem(key, JSON.stringify(seeded));
            return seeded;
        };
        const saveAuxList = (type, list) => {
            sessionStorage.setItem(getAuxStorageKey(type), JSON.stringify(list));
            localStorage.setItem(getAuxStorageKey(type), JSON.stringify(list));
        };

        let currentType = sessionStorage.getItem("AuxCurrentType") || "dept";
        if (!AUX_TYPES.some(item => item.key === currentType)) currentType = "dept";
        window._auxCurrentType = currentType;

        window.renderAuxiliaryList = function () {
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type);
            const query = (document.getElementById("aux-search-input")?.value || "").trim().toLowerCase();
            const filtered = list.filter(item => {
                if (!query) return true;
                return (item.code || "").toLowerCase().includes(query) || (item.name || "").toLowerCase().includes(query);
            });
            const tbody = document.getElementById("aux-table-body");
            if (!tbody) return;
            tbody.innerHTML = filtered.map(item => `
                <tr>
                    <td style="text-align:center;"><input type="checkbox" class="aux-select" data-code="${item.code}"></td>
                    <td class="aux-actions-cell">
                        <button class="aux-icon-btn" onclick="editAuxiliaryItem('${item.code}')">✎</button>
                        <button class="aux-icon-btn danger" onclick="deleteAuxiliaryItem('${item.code}')">🗑</button>
                    </td>
                    <td>${item.code}</td>
                    <td>${item.name}</td>
                    <td>${item.remark || "-"}</td>
                    <td>
                        <button class="aux-toggle ${item.enabled ? "is-on" : "is-off"}" onclick="toggleAuxiliaryStatus('${item.code}')">
                            ${item.enabled ? "已启用" : "未启用"}
                        </button>
                    </td>
                </tr>
            `).join("") || `<tr><td colspan="6" style="text-align:center; padding:20px;">暂无数据</td></tr>`;
        };

        window.renderAuxiliaryGuide = function () {
            const type = window._auxCurrentType || "dept";
            const guide = AUX_GUIDE[type] || { title: "", accounts: [], remark: "" };
            const panel = document.getElementById("aux-guide");
            if (!panel) return;
            const accountsHtml = (guide.accounts || []).map(item => `<li>${item}</li>`).join("");
            panel.innerHTML = `
                <div class="aux-guide-block">
                    <div class="aux-guide-title">${guide.title || ""}</div>
                    <div class="aux-guide-subtitle">推荐挂载科目：</div>
                    <ul class="aux-guide-list">${accountsHtml || "<li>暂无</li>"}</ul>
                </div>
                <div class="aux-guide-block">
                    <div class="aux-guide-subtitle">备注</div>
                    <div class="aux-guide-remark">${guide.remark || "暂无"}</div>
                </div>
            `;
        };

        window.setAuxiliaryType = function (type, btn) {
            window._auxCurrentType = type;
            sessionStorage.setItem("AuxCurrentType", type);
            document.querySelectorAll(".aux-tab").forEach(tab => tab.classList.remove("is-active"));
            if (btn && btn.classList) btn.classList.add("is-active");
            document.getElementById("aux-search-input").value = "";
            window.renderAuxiliaryList();
            window.renderAuxiliaryGuide();
        };

        window.searchAuxiliary = function (event) {
            if (event && event.key && event.key !== "Enter") return;
            window.renderAuxiliaryList();
        };

        window.resetAuxiliarySearch = function () {
            const input = document.getElementById("aux-search-input");
            if (input) input.value = "";
            window.renderAuxiliaryList();
        };

        window.toggleAuxiliaryQuickAdd = function () {
            const panel = document.getElementById("aux-quick-add");
            if (!panel) return;
            panel.classList.toggle("is-visible");
        };

        window.saveAuxiliaryQuickAdd = function () {
            const type = window._auxCurrentType || "dept";
            const codeInput = document.getElementById("aux-code-input");
            const nameInput = document.getElementById("aux-name-input");
            const remarkInput = document.getElementById("aux-remark-input");
            const code = codeInput ? codeInput.value.trim() : "";
            const name = nameInput ? nameInput.value.trim() : "";
            if (!code || !name) {
                alert("请填写编码与名称。");
                return;
            }
            const list = ensureAuxList(type);
            if (list.some(item => item.code === code)) {
                alert("编码已存在，请更换。");
                return;
            }
            list.unshift({
                code,
                name,
                remark: remarkInput ? remarkInput.value.trim() : "",
                enabled: true
            });
            saveAuxList(type, list);
            if (codeInput) codeInput.value = "";
            if (nameInput) nameInput.value = "";
            if (remarkInput) remarkInput.value = "";
            window.renderAuxiliaryList();
        };

        window.toggleAuxiliaryStatus = function (code) {
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type);
            const item = list.find(row => row.code === code);
            if (!item) return;
            item.enabled = !item.enabled;
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.editAuxiliaryItem = function (code) {
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type);
            const item = list.find(row => row.code === code);
            if (!item) return;
            const name = prompt("请输入名称：", item.name || "");
            if (name === null) return;
            const remark = prompt("请输入备注：", item.remark || "");
            if (remark === null) return;
            item.name = name.trim() || item.name;
            item.remark = remark.trim();
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.deleteAuxiliaryItem = function (code) {
            if (!confirm("确认删除该辅助项吗？")) return;
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type).filter(row => row.code !== code);
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.deleteSelectedAuxiliary = function () {
            const selected = Array.from(document.querySelectorAll(".aux-select:checked")).map(cb => cb.dataset.code);
            if (!selected.length) {
                alert("请先勾选要删除的行。");
                return;
            }
            if (!confirm("确认删除选中的辅助项吗？")) return;
            const type = window._auxCurrentType || "dept";
            const list = ensureAuxList(type).filter(row => !selected.includes(row.code));
            saveAuxList(type, list);
            window.renderAuxiliaryList();
        };

        window.toggleAllAuxiliary = function (checked) {
            document.querySelectorAll(".aux-select").forEach(cb => {
                cb.checked = checked;
            });
        };

        const tabButtons = AUX_TYPES.map(item => `
            <button class="aux-tab ${item.key === currentType ? "is-active" : ""}" onclick="setAuxiliaryType('${item.key}', this)">${item.label}</button>
        `).join("");

        contentHTML += `
                    <div class="auxiliary-panel">
                        <div class="aux-tabs">${tabButtons}</div>
                        <div class="aux-toolbar">
                            <div class="aux-search">
                                <input id="aux-search-input" type="text" placeholder="搜索编码/名称" onkeyup="searchAuxiliary(event)">
                                <button class="aux-icon-btn" onclick="searchAuxiliary()">🔍</button>
                                <button class="aux-icon-btn" onclick="resetAuxiliarySearch()">↻</button>
                            </div>
                            <div class="aux-actions">
                                <button class="btn-primary" onclick="toggleAuxiliaryQuickAdd()">新增</button>
                                <button class="btn-primary btn-danger" onclick="deleteSelectedAuxiliary()">删除</button>
                                <button class="btn-primary">导入</button>
                                <button class="btn-primary">导出</button>
                            </div>
                        </div>
                        <div class="aux-guide" id="aux-guide"></div>
                        <div class="aux-quick-add" id="aux-quick-add">
                            <input id="aux-code-input" type="text" placeholder="编码">
                            <input id="aux-name-input" type="text" placeholder="名称">
                            <input id="aux-remark-input" type="text" placeholder="备注">
                            <button class="btn-primary" onclick="saveAuxiliaryQuickAdd()">保存</button>
                        </div>
                        <div class="aux-table-wrap">
                            <table class="data-table aux-table">
                                <thead>
                                    <tr>
                                        <th style="width:40px; text-align:center;"><input type="checkbox" onclick="toggleAllAuxiliary(this.checked)"></th>
                                        <th style="width:90px;">操作</th>
                                        <th style="width:120px;">编码</th>
                                        <th>名称</th>
                                        <th>备注</th>
                                        <th style="width:120px;">启用状态</th>
                                    </tr>
                                </thead>
                                <tbody id="aux-table-body"></tbody>
                            </table>
                        </div>
                    </div>
                `;

        setTimeout(() => {
            window.renderAuxiliaryList();
            window.renderAuxiliaryGuide();
        }, 0);

    contentArea.innerHTML = contentHTML;

};

// =========================================================================
// 总账 (AcctGeneralLedger) — 标准三行格式
// =========================================================================
window.VM_MODULES['AcctGeneralLedger'] = function(contentArea, contentHTML, moduleCode) {
    const allSubjects  = JSON.parse(sessionStorage.getItem("AcctSubjects")    || "[]");
    const allVouchers  = JSON.parse(sessionStorage.getItem("ManualVouchers")  || "[]");
    const openingList  = JSON.parse(sessionStorage.getItem("OpeningBalances") || "[]");
    const openingMap   = {};
    openingList.forEach(s => { openingMap[s.code] = parseFloat(s.balance) || 0; });

    const glPF   = sessionStorage.getItem("GLPeriodFrom") || "";
    const glPT   = sessionStorage.getItem("GLPeriodTo")   || "";
    const glCode = sessionStorage.getItem("GLSubjCode")   || "";

    const subjInfoMap = {};
    allSubjects.forEach(s => { subjInfoMap[s.code] = s; });

    const normVP = v => {
        const raw = ((v.date || v.period || "").toString().trim()).replace(/\//g, "-");
        if (!raw) return "";
        const parts = raw.split("-");
        return (parts.length >= 2 && parts[0].length === 4)
            ? `${parts[0]}-${parts[1].padStart(2,"0")}` : raw.slice(0,7);
    };

    const allPeriods = Array.from(new Set(allVouchers.map(v => normVP(v)).filter(Boolean))).sort();
    const mkPOpts = sel =>
        `<option value="">-- 全部 --</option>` +
        allPeriods.map(p => `<option value="${p}" ${sel===p?"selected":""}>${p.replace("-",".")}</option>`).join("");
    const subjOpts = `<option value="">全部科目</option>` +
        allSubjects.map(s => `<option value="${s.code}" ${s.code===glCode?"selected":""}>${s.code} ${s.name}</option>`).join("");

    // 所有凭证（含范围前，用于算年初余额）
    const validStatuses = new Set(["已记账","已审核","已提交","待审核",""]);
    const validVouchers = allVouchers.filter(v => validStatuses.has(v.status || ""));

    // 活跃期间（查询范围内）
    const activePeriods = allPeriods.filter(p =>
        (!glPF || p >= glPF) && (!glPT || p <= glPT)
    );

    // 按科目 → 按期间 汇总借贷（全量，用于算年初）
    const acctAllMap = {};   // code → period → {debit, credit}
    validVouchers.forEach(v => {
        const period = normVP(v);
        if (!v.lines) return;
        v.lines.forEach(line => {
            const rawAcct = (line.account || line.subject || (line.accountCode ? String(line.accountCode) : "") || "").trim();
            const code = rawAcct.split(/\s+/)[0] || rawAcct;
            if (!code) return;
            if (glCode && !code.startsWith(glCode)) return;
            if (!acctAllMap[code]) acctAllMap[code] = {};
            if (!acctAllMap[code][period]) acctAllMap[code][period] = { debit:0, credit:0 };
            acctAllMap[code][period].debit  += parseFloat(line.debit  || 0);
            acctAllMap[code][period].credit += parseFloat(line.credit || 0);
        });
    });

    const fmt = n => n === 0 ? "" : (Math.abs(n)||0).toLocaleString("en-US", { minimumFractionDigits: 2 });
    const fmtBal = n => (Math.abs(n)||0).toLocaleString("en-US", { minimumFractionDigits: 2 });
    const sortedCodes = Object.keys(acctAllMap).sort();

    // 公司名
    const companyName = sessionStorage.getItem("CompanyName") || localStorage.getItem("CompanyName") || "本公司账簿";
    const periodLabel = glPF || glPT
        ? `${(glPF||"").replace("-",".") || "--"}  --  ${(glPT||"").replace("-",".") || "--"}`
        : "全部期间";

    // ── 生成表格行 ──────────────────────────────────────────────
    let bodyRows = "";
    let hasAnyData = false;

    sortedCodes.forEach((code, codeIdx) => {
        const si  = subjInfoMap[code];
        const name = si ? si.name : "";
        const dir  = si ? (si.direction === "贷" ? "贷" : "借")
                       : (["2","3","4","5"].some(p => code.startsWith(p)) ? "贷" : "借");

        const periodData = acctAllMap[code] || {};

        // 期初余额：openingMap 中的初始值 + 查询期间之前所有凭证
        let openBal = openingMap[code] || 0;
        allPeriods.forEach(p => {
            if (glPF && p >= glPF) return;          // 只累加范围前的期间
            const pd = periodData[p];
            if (!pd) return;
            openBal = dir === "借" ? openBal + pd.debit - pd.credit
                                   : openBal + pd.credit - pd.debit;
        });

        // 当前期间范围内的汇总
        let periodDebit = 0, periodCredit = 0;
        activePeriods.forEach(p => {
            const pd = periodData[p];
            if (!pd) return;
            periodDebit  += pd.debit;
            periodCredit += pd.credit;
        });

        // 年初余额（当年 1 月之前的累计）
        const firstYear = (glPT || glPF || activePeriods[0] || "").slice(0,4);
        let ytdOpenBal = openingMap[code] || 0;
        allPeriods.forEach(p => {
            if (p.slice(0,4) >= firstYear) return;   // 只累加年初前
            const pd = periodData[p];
            if (!pd) return;
            ytdOpenBal = dir === "借" ? ytdOpenBal + pd.debit - pd.credit
                                      : ytdOpenBal + pd.credit - pd.debit;
        });

        // 本年累计借贷：从年初到查询期间结束
        let ytdDebit = 0, ytdCredit = 0;
        allPeriods.forEach(p => {
            if (p.slice(0,4) !== firstYear) return;
            if (glPT && p > glPT) return;
            const pd = periodData[p];
            if (!pd) return;
            ytdDebit  += pd.debit;
            ytdCredit += pd.credit;
        });

        const endBal  = dir === "借" ? openBal + periodDebit - periodCredit
                                     : openBal + periodCredit - periodDebit;
        const ytdEndBal = dir === "借" ? ytdOpenBal + ytdDebit - ytdCredit
                                       : ytdOpenBal + ytdCredit - ytdDebit;

        const dirText  = (n) => n === 0 ? "平" : (n > 0 ? dir : (dir === "借" ? "贷" : "借"));
        const openDir  = dirText(openBal);
        const endDir   = dirText(endBal);
        const ytdDir   = dirText(ytdEndBal);

        // 最后一个活跃期间的年份/月份
        const lastPeriod = activePeriods.length ? activePeriods[activePeriods.length-1] : (glPT || glPF || "");
        const [yr, mo]   = lastPeriod ? lastPeriod.split("-") : ["", ""];
        const moNum      = mo ? parseInt(mo, 10) : "";

        // 跳过完全无数据的科目（无期初也无发生额）
        if (openBal === 0 && periodDebit === 0 && periodCredit === 0 && ytdDebit === 0 && ytdCredit === 0) return;
        hasAnyData = true;

        // 行1：期初余额（淡黄）
        bodyRows += `<tr class="gl3-open">
            <td class="gl3-code"><span class="gl3-arrow">▶</span>${code}</td>
            <td class="gl3-name">${name}</td>
            <td class="gl3-cnum">${yr}</td>
            <td class="gl3-cnum">${moNum}</td>
            <td class="gl3-label">期初余额</td>
            <td class="gl3-amt"></td>
            <td class="gl3-amt"></td>
            <td class="gl3-dir">${openDir}</td>
            <td class="gl3-amt gl3-bold">${fmtBal(openBal)}</td>
        </tr>`;

        // 行2：本期合计（白）
        bodyRows += `<tr class="gl3-period">
            <td></td><td></td>
            <td class="gl3-cnum">${yr}</td>
            <td class="gl3-cnum">${moNum}</td>
            <td class="gl3-label">本期合计</td>
            <td class="gl3-amt">${fmt(periodDebit)}</td>
            <td class="gl3-amt">${fmt(periodCredit)}</td>
            <td class="gl3-dir">${endDir}</td>
            <td class="gl3-amt gl3-bold">${fmtBal(endBal)}</td>
        </tr>`;

        // 行3：本年累计（浅青）
        bodyRows += `<tr class="gl3-ytd">
            <td></td><td></td>
            <td class="gl3-cnum">${yr}</td>
            <td class="gl3-cnum">${moNum}</td>
            <td class="gl3-label">本年累计</td>
            <td class="gl3-amt">${fmt(ytdDebit)}</td>
            <td class="gl3-amt">${fmt(ytdCredit)}</td>
            <td class="gl3-dir">${ytdDir}</td>
            <td class="gl3-amt gl3-bold">${fmtBal(ytdEndBal)}</td>
        </tr>`;
    });

    if (!hasAnyData) {
        bodyRows = `<tr><td colspan="9" style="text-align:center;padding:40px;color:#aaa;">暂无符合条件的凭证数据</td></tr>`;
    }

    contentHTML += `
    <style>
        /* ── 总账标准格式样式 ── */
        .gl3-wrap{font-family:'Microsoft YaHei',Arial,sans-serif;font-size:13px;}
        .gl3-infobar{display:flex;align-items:center;gap:0;background:#fff;border:1px solid #d9d9d9;border-radius:0;margin-bottom:6px;overflow:hidden;}
        .gl3-infobar .gl3-ifield{display:flex;align-items:center;padding:8px 16px;gap:8px;border-right:1px solid #d9d9d9;flex:1;}
        .gl3-infobar .gl3-ifield:last-child{border-right:none;}
        .gl3-infobar label{font-size:13px;color:#555;white-space:nowrap;margin-right:4px;}
        .gl3-infobar input[type=text]{border:1px solid #c8c8c8;border-radius:2px;padding:3px 8px;font-size:13px;min-width:160px;background:#fffff0;}
        .gl3-filter{background:#fff;border:1px solid #d9d9d9;padding:8px 12px;margin-bottom:6px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .gl3-filter label{font-size:13px;color:#555;}
        .gl3-filter select{padding:3px 6px;border:1px solid #c8c8c8;border-radius:2px;font-size:13px;}
        .gl3-table-wrap{border:1px solid #c8c8c8;overflow-x:auto;}
        .gl3-tbl{width:100%;border-collapse:collapse;font-size:13px;}
        .gl3-tbl th{padding:6px 10px;background:#e8e8e8;border:1px solid #c8c8c8;font-weight:600;color:#333;text-align:center;white-space:nowrap;}
        .gl3-tbl td{padding:5px 10px;border-right:1px solid #e0e0e0;border-bottom:1px solid #e8e8e8;white-space:nowrap;}
        .gl3-tbl td.gl3-amt{text-align:right;font-variant-numeric:tabular-nums;min-width:100px;}
        .gl3-tbl td.gl3-cnum{text-align:center;width:56px;}
        .gl3-tbl td.gl3-dir{text-align:center;width:40px;}
        .gl3-tbl td.gl3-label{text-align:center;width:70px;}
        .gl3-tbl td.gl3-code{width:110px;padding-left:6px;}
        .gl3-tbl td.gl3-name{min-width:120px;max-width:200px;overflow:hidden;text-overflow:ellipsis;}
        .gl3-tbl td.gl3-bold{font-weight:600;}
        .gl3-tbl tr.gl3-open {background:#fffff0;}
        .gl3-tbl tr.gl3-period{background:#ffffff;}
        .gl3-tbl tr.gl3-ytd  {background:#e8f8f5;}
        .gl3-tbl tr.gl3-open td.gl3-code{font-weight:bold;}
        .gl3-arrow{color:#1890ff;font-size:9px;margin-right:3px;}
    </style>

    <div class="gl3-wrap">
        <!-- 信息栏 -->
        <div class="gl3-infobar">
            <div class="gl3-ifield">
                <label>账簿</label>
                <input type="text" value="${companyName}" readonly style="min-width:180px;">
            </div>
            <div class="gl3-ifield">
                <label>期间</label>
                <input type="text" value="${periodLabel}" readonly style="min-width:200px;">
            </div>
            <div class="gl3-ifield">
                <label>币别</label>
                <input type="text" value="人民币" readonly style="min-width:80px;">
            </div>
        </div>

        <!-- 筛选栏 -->
        <div class="gl3-filter">
            <label>期间</label>
            <select id="gl-pf">${mkPOpts(glPF)}</select>
            <span style="color:#aaa;font-size:12px;">—</span>
            <select id="gl-pt">${mkPOpts(glPT)}</select>
            <label style="margin-left:12px;">科目</label>
            <select id="gl-subj" style="min-width:220px;">${subjOpts}</select>
            <button class="btn-primary" style="margin-left:8px;" onclick="window.glQuery&&window.glQuery()">查询</button>
            <button onclick="window.glReset&&window.glReset()"
                style="padding:4px 14px;border:1px solid #d9d9d9;border-radius:3px;background:#fff;font-size:13px;cursor:pointer;">重置</button>
        </div>

        <!-- 主表格 -->
        <div class="gl3-table-wrap">
            <table class="gl3-tbl">
                <thead>
                    <tr>
                        <th style="width:110px;">科目编码</th>
                        <th>科目名称</th>
                        <th style="width:60px;">会计年度</th>
                        <th style="width:44px;">期间</th>
                        <th style="width:70px;">摘要</th>
                        <th style="width:120px;text-align:right;">借方</th>
                        <th style="width:120px;text-align:right;">贷方</th>
                        <th style="width:44px;">方向</th>
                        <th style="width:130px;text-align:right;">余额</th>
                    </tr>
                </thead>
                <tbody>${bodyRows}</tbody>
            </table>
        </div>
    </div>
    `;

    contentArea.innerHTML = contentHTML;

    setTimeout(() => {
        window.glQuery = function() {
            sessionStorage.setItem("GLPeriodFrom", document.getElementById("gl-pf").value);
            sessionStorage.setItem("GLPeriodTo",   document.getElementById("gl-pt").value);
            sessionStorage.setItem("GLSubjCode",   document.getElementById("gl-subj").value);
            loadContent("AcctGeneralLedger");
        };
        window.glReset = function() {
            ["GLPeriodFrom","GLPeriodTo","GLSubjCode"].forEach(k => sessionStorage.removeItem(k));
            loadContent("AcctGeneralLedger");
        };
    }, 0);
};

// =========================================================================
// 辅助核算表 (AcctAuxLedger)
// =========================================================================
window.VM_MODULES['AcctAuxLedger'] = function(contentArea, contentHTML, moduleCode) {
    const AUX_TYPES = [
        { key:"dept",     label:"部门",   accounts:["6602","6601","6401","6711"] },
        { key:"customer", label:"客户",   accounts:["1122","2203","6001"] },
        { key:"vendor",   label:"供应商", accounts:["2202","1123","6401"] },
        { key:"employee", label:"职员",   accounts:["1221","2241"] },
        { key:"project",  label:"项目",   accounts:["6401","6001"] }
    ];
    const AUX_DEFAULTS = {
        dept:     [{code:"001",name:"人事行政"},{code:"002",name:"财务部"},{code:"003",name:"股东/董事会"},
                   {code:"004",name:"技术部"},{code:"005",name:"数据中心"},{code:"006",name:"滁州运营部"},
                   {code:"007",name:"滁州销售部"},{code:"008",name:"销售部"},{code:"009",name:"新媒体部"},
                   {code:"011",name:"总经理"},{code:"012",name:"市场推广部"},{code:"013",name:"中山大区"},
                   {code:"014",name:"滁州办公室"}],
        customer: [{code:"C001",name:"客户1"},{code:"C002",name:"客户2"},{code:"C003",name:"客户3"}],
        vendor:   [{code:"V01",name:"供应商1"},{code:"V02",name:"供应商2"}],
        employee: [{code:"E01",name:"张三"},{code:"E02",name:"李四"}],
        project:  [{code:"P01",name:"华南项目"},{code:"P02",name:"华东项目"},
                   {code:"P03",name:"食品项目"},{code:"P04",name:"地方项目"}]
    };

    const activeTab = sessionStorage.getItem("AuxLedgerTab") || "dept";
    const auxPF     = sessionStorage.getItem("AuxLedgerPF")  || "";
    const auxPT     = sessionStorage.getItem("AuxLedgerPT")  || "";

    const allVouchers = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
    const allSubjects = JSON.parse(sessionStorage.getItem("AcctSubjects")   || "[]");
    const openingList = JSON.parse(sessionStorage.getItem("OpeningBalances")|| "[]");
    const openingMap  = {};
    openingList.forEach(s => { openingMap[s.code] = parseFloat(s.balance) || 0; });

    const normVP = v => {
        const raw = ((v.date||v.period||"").toString().trim()).replace(/\//g,"-");
        if (!raw) return "";
        const parts = raw.split("-");
        return (parts.length>=2&&parts[0].length===4) ? `${parts[0]}-${parts[1].padStart(2,"0")}` : raw.slice(0,7);
    };
    const allPeriods = Array.from(new Set(allVouchers.map(v=>normVP(v)).filter(Boolean))).sort();
    const mkPOpts = sel =>
        `<option value="">-- 全部 --</option>` +
        allPeriods.map(p=>`<option value="${p}" ${sel===p?"selected":""}>${p.replace("-",".")}</option>`).join("");

    const curType   = AUX_TYPES.find(t => t.key===activeTab) || AUX_TYPES[0];
    const auxStorage= JSON.parse(sessionStorage.getItem("AuxiliaryItems") || "{}");
    const items     = (auxStorage[activeTab] || AUX_DEFAULTS[activeTab] || []).filter(i => i.enabled!==false);
    const subjInfoMap = {};
    allSubjects.forEach(s=>{ subjInfoMap[s.code]=s; });

    // 核算科目标签
    const acctLabels = curType.accounts.map(code => {
        const s = allSubjects.find(s=>s.code===code);
        return s ? `${code} ${s.name}` : code;
    }).join("、");

    // 筛选凭证
    const filteredVouchers = allVouchers.filter(v => {
        const p = normVP(v);
        if (auxPF && p < auxPF) return false;
        if (auxPT && p > auxPT) return false;
        const s = v.status || "";
        return !s || ["已记账","已审核","已提交","待审核"].includes(s);
    });

    // 按核算科目累计借贷（无辅助维度标签，按账户层面汇总，用于展示"总量"参考）
    let totalDebit = 0, totalCredit = 0;
    filteredVouchers.forEach(v => {
        if (!v.lines) return;
        v.lines.forEach(line => {
            const rawAcct = (line.account||line.subject||(line.accountCode?String(line.accountCode):"")||"").trim();
            const code = rawAcct.split(/\s+/)[0] || rawAcct;
            if (curType.accounts.some(ta => code.startsWith(ta))) {
                totalDebit  += parseFloat(line.debit  || 0);
                totalCredit += parseFloat(line.credit || 0);
            }
        });
    });

    const fmt = n => (Math.abs(n)||0).toLocaleString("en-US",{minimumFractionDigits:2});

    // 辅助核算行（因凭证分录无辅助维度，显示"-"，加说明）
    const tableRows = items.map(item => `
        <tr>
            <td style="font-family:monospace;color:#555;">${item.code}</td>
            <td>${item.name}</td>
            <td style="text-align:right;color:#ccc;">-</td>
            <td style="text-align:right;color:#ccc;">-</td>
            <td style="text-align:right;color:#ccc;">-</td>
            <td style="text-align:right;color:#ccc;">-</td>
            <td style="text-align:right;color:#ccc;">-</td>
            <td style="text-align:right;color:#ccc;">-</td>
        </tr>
    `).join("");

    // 标签页
    const tabsHTML = AUX_TYPES.map(t =>
        `<button class="aux-tab${t.key===activeTab?" on":""}"
            onclick="sessionStorage.setItem('AuxLedgerTab','${t.key}');loadContent('AcctAuxLedger')">${t.label}</button>`
    ).join("");

    const periodLabel = (auxPF||auxPT)
        ? `${(auxPF||"--").replace("-",".")} - ${(auxPT||"--").replace("-",".")}`
        : "全部期间";

    contentHTML += `
    <style>
        .aux-fcard{background:#fff;border-radius:8px;box-shadow:0 1px 6px rgba(0,0,0,.08);padding:0 0 4px;margin-bottom:12px;}
        .aux-frow{display:flex;align-items:center;padding:10px 16px;gap:10px;border-bottom:1px solid #f0f0f0;flex-wrap:wrap;}
        .aux-frow:last-child{border-bottom:none;}
        .aux-frow select{padding:5px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:14px;}
        .aux-frow label{font-size:14px;color:#555;min-width:60px;}
        .aux-actions{padding:10px 16px;display:flex;gap:8px;justify-content:flex-end;}
        .aux-tabs{display:flex;border:1px solid #d9d9d9;border-radius:4px;overflow:hidden;margin-bottom:12px;width:fit-content;}
        .aux-tab{padding:7px 22px;border:none;font-size:14px;cursor:pointer;background:#fff;color:#555;transition:all .15s;}
        .aux-tab.on{background:#1890ff;color:#fff;}
        .aux-tab:not(.on):hover{background:#f5f5f5;}
        .aux-card{background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,.08);overflow:hidden;}
        .aux-card-title{text-align:center;font-size:20px;font-weight:bold;padding:20px 0 4px;color:#222;}
        .aux-card-period{text-align:center;font-size:13px;color:#888;padding:0 0 14px;}
        .aux-card-accts{text-align:center;font-size:12px;color:#1890ff;padding:0 0 14px;}
        .aux-tbl{width:100%;border-collapse:collapse;font-size:14px;}
        .aux-tbl th{padding:9px 12px;font-weight:500;color:#444;background:#f5f6f8;border-bottom:1px solid #e8e8e8;white-space:nowrap;text-align:center;}
        .aux-tbl td{padding:9px 12px;border-bottom:1px solid #f0f0f0;white-space:nowrap;}
        .aux-tbl tbody tr:hover{background:#f9fbff;}
        .aux-tbl tfoot tr{background:#f5f6f8;font-weight:bold;}
        .aux-note{margin:12px 16px;padding:10px 14px;background:#fffbe6;border:1px solid #ffe58f;border-radius:4px;font-size:13px;color:#7c5a00;line-height:1.6;}
        .aux-stat{display:flex;gap:24px;padding:10px 16px 0;flex-wrap:wrap;}
        .aux-stat-item{background:#f0f5ff;border-radius:6px;padding:10px 20px;text-align:center;flex:1;}
        .aux-stat-label{font-size:12px;color:#888;margin-bottom:4px;}
        .aux-stat-val{font-size:18px;font-weight:bold;color:#1890ff;}
    </style>

    <div class="aux-tabs">${tabsHTML}</div>

    <div class="aux-fcard">
        <div class="aux-frow">
            <label>期间</label>
            <select id="aux-pf">${mkPOpts(auxPF)}</select>
            <span style="color:#999;">-</span>
            <select id="aux-pt">${mkPOpts(auxPT)}</select>
        </div>
        <div class="aux-actions">
            <button onclick="window.auxReset&&window.auxReset()"
                style="padding:6px 18px;border:1px solid #d9d9d9;border-radius:4px;background:#fff;font-size:14px;cursor:pointer;">重置</button>
            <button class="btn-primary" onclick="window.auxQuery&&window.auxQuery()">查询</button>
        </div>
    </div>

    <div class="aux-card">
        <div class="aux-card-title">辅助核算表</div>
        <div class="aux-card-period">
            ${curType.label}核算 &nbsp;|&nbsp; 期间：${periodLabel}
        </div>
        <div class="aux-card-accts">核算科目：${acctLabels||"未配置"}</div>

        <div class="aux-stat">
            <div class="aux-stat-item">
                <div class="aux-stat-label">核算科目本期借方合计</div>
                <div class="aux-stat-val">${fmt(totalDebit)}</div>
            </div>
            <div class="aux-stat-item">
                <div class="aux-stat-label">核算科目本期贷方合计</div>
                <div class="aux-stat-val">${fmt(totalCredit)}</div>
            </div>
            <div class="aux-stat-item">
                <div class="aux-stat-label">${curType.label}数量</div>
                <div class="aux-stat-val">${items.length}</div>
            </div>
        </div>

        <table class="aux-tbl" style="margin-top:12px;">
            <thead>
                <tr>
                    <th rowspan="2" style="width:80px;text-align:left;padding-left:16px;">编码</th>
                    <th rowspan="2" style="text-align:left;">名称</th>
                    <th colspan="2" style="border-left:1px solid #e0e0e0;">期初余额</th>
                    <th colspan="2" style="border-left:1px solid #e0e0e0;">本期发生额</th>
                    <th colspan="2" style="border-left:1px solid #e0e0e0;">期末余额</th>
                </tr>
                <tr>
                    <th style="border-left:1px solid #e0e0e0;width:110px;">借方</th>
                    <th style="width:110px;">贷方</th>
                    <th style="border-left:1px solid #e0e0e0;width:110px;">借方</th>
                    <th style="width:110px;">贷方</th>
                    <th style="border-left:1px solid #e0e0e0;width:110px;">借方</th>
                    <th style="width:110px;">贷方</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows || '<tr><td colspan="8" style="text-align:center;color:#999;padding:30px;">暂无辅助核算项目</td></tr>'}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" style="text-align:center;padding:9px 12px;">合计</td>
                    <td style="text-align:right;padding:9px 12px;color:#ccc;">-</td>
                    <td style="text-align:right;padding:9px 12px;color:#ccc;">-</td>
                    <td style="text-align:right;padding:9px 12px;color:#ccc;">-</td>
                    <td style="text-align:right;padding:9px 12px;color:#ccc;">-</td>
                    <td style="text-align:right;padding:9px 12px;color:#ccc;">-</td>
                    <td style="text-align:right;padding:9px 12px;color:#ccc;">-</td>
                </tr>
            </tfoot>
        </table>

        <div class="aux-note">
            ℹ &nbsp;<strong>如何使用辅助核算表：</strong>
            在<strong>凭证录入</strong>时，为涉及「${acctLabels}」等科目的每笔分录选择对应的
            <strong>${curType.label}</strong>维度，系统将自动在本表中按${curType.label}汇总期初余额、本期发生额和期末余额。
            当前演示凭证数据暂未录入辅助维度信息，故明细列显示为"-"。
            核算科目本期借贷合计（上方统计卡）已基于现有凭证数据计算。
        </div>
    </div>
    `;

    contentArea.innerHTML = contentHTML;

    setTimeout(() => {
        window.auxQuery = function() {
            sessionStorage.setItem("AuxLedgerPF", document.getElementById("aux-pf").value);
            sessionStorage.setItem("AuxLedgerPT", document.getElementById("aux-pt").value);
            loadContent("AcctAuxLedger");
        };
        window.auxReset = function() {
            ["AuxLedgerPF","AuxLedgerPT"].forEach(k => sessionStorage.removeItem(k));
            loadContent("AcctAuxLedger");
        };
    }, 0);
};
