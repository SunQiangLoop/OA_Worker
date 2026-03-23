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

        const buildSubjectRows = (list) => list.map((item) => {
            const statusClass = item.status === "启用" ? "status-enabled" : "status-disabled";
            const controlDirection = item.controlDirection || "否";
            return `
                        <tr id="row-${item.code}" data-code="${item.code}" data-name="${item.name}" data-type="${item.type}">
                            <td style="text-align:center;">
                                <input type="checkbox" class="subject-select" data-code="${item.code}">
                            </td>
                            <td class="val-code"><strong>${item.code}</strong></td>
                            <td class="val-name">${item.name}</td>
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
                <h2 style="margin:0; font-size:18px; color:#1a1a1a;">多级会计账套体系</h2>
                <button class="acct-sbtn acct-sbtn-primary" onclick="window.acctOpenAddModal()">+ 新增账套</button>
            </div>
            <div style="background:#fff; border:1px solid #e0e0e0; border-radius:4px; overflow:hidden;">
                <table class="acct-tree-table">
                    <thead>
                        <tr>
                            <th style="width:220px;">账套名称</th>
                            <th style="width:120px;">账套编码</th>
                            <th style="width:100px;">账套类型</th>
                            <th style="width:130px;">会计准则</th>
                            <th style="width:120px;">当前状态</th>
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
                        {id: 2, name: '分公司-华北', code: 'FJBN', type: 'calc', principle: '企业准则', status: 'disabled', principleInherited: true, expanded: false, children: []},
                        {id: 3, name: '分公司-华东', code: 'FJBD', type: 'calc', principle: '企业准则', status: 'disabled', principleInherited: true, expanded: true, children: [
                            {id: 5, name: '子公司-上海', code: 'ZJSH', type: 'calc', principle: '企业准则', status: 'disabled', principleInherited: true, expanded: false, children: []}
                        ]},
                        {id: 4, name: '分公司-华南', code: 'FJHN', type: 'calc', principle: '企业准则', status: 'disabled', principleInherited: true, expanded: false, children: []}
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
                function renderNodes(nodes, level) {
                    nodes.forEach(node => {
                        const indent = level * 22;
                        const hasChildren = node.children && node.children.length > 0;
                        const typeClass = node.type === 'merge' ? 'badge-type-merge' : 'badge-type-calc';
                        const typeText = node.type === 'merge' ? '合并账套' : '核算账套';
                        let statusBadge = '';
                        if (node.status === 'enabled') statusBadge = '<span class="badge-acct-enabled">已启用</span>';
                        else if (node.status === 'init') statusBadge = '<span class="badge-acct-init">待初始化</span>';
                        else statusBadge = '<span class="badge-acct-disabled">已停用</span>';
                        const principleText = node.principleInherited
                            ? node.principle + ' <span style="color:#999;font-size:12px;">(继承)</span>'
                            : node.principle;
                        // 所有账套都显示：新增子账套、引擎配置、复制
                        let actions = '';
                        actions += `<button class="acct-action-link" onclick="window.acctOpenAddModal(${node.id})">新增子账套</button>`;
                        actions += `<button class="acct-action-link" onclick="loadContent('SettlementEngineConfig')">引擎配置</button>`;
                        actions += `<button class="acct-action-link" onclick="window.acctHandleCopy(${node.id})">复制</button>`;
                        if (node.status === 'disabled') {
                            actions += `<button class="acct-action-link" style="color:#27ae60;" onclick="window.acctHandleEnable(${node.id})">启用</button>`;
                        } else {
                            actions += `<button class="acct-action-link danger" onclick="window.acctOpenDisable(${node.id})">停用</button>`;
                        }
                        const toggleBtn = hasChildren
                            ? `<span class="acct-toggle-btn" onclick="window.acctToggleNode(${node.id})">${node.expanded ? '▼' : '▶'}</span>`
                            : '<span style="display:inline-block;width:18px;"></span>';
                        rows.push(`<tr><td><span style="padding-left:${indent}px;">${toggleBtn}${node.name}</span></td><td style="color:#666;">${node.code}</td><td><span class="${typeClass}">${typeText}</span></td><td>${principleText}</td><td>${statusBadge}</td><td>${actions}</td></tr>`);
                        if (hasChildren && node.expanded) renderNodes(node.children, level + 1);
                    });
                }
                renderNodes(window._acctTreeData, 0);
                tbody.innerHTML = rows.join('');
                const parentSelect = document.getElementById('acctFormParent');
                if (parentSelect) {
                    const opts = ['<option value="">（顶级账套，无上级）</option>'];
                    function collectOpts(nodes, prefix) { nodes.forEach(n => { opts.push(`<option value="${n.id}">${prefix}${n.name}</option>`); if (n.children && n.children.length) collectOpts(n.children, prefix + '　'); }); }
                    collectOpts(window._acctTreeData, '');
                    parentSelect.innerHTML = opts.join('');
                }
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
                const copyName = prompt('复制账套，请输入新账套名称：', src.name + '-副本');
                if (!copyName) return;
                const copyCode = prompt('请输入新账套编码：', src.code + '2');
                if (!copyCode) return;
                const newNode = { id: Date.now(), name: copyName, code: copyCode, type: src.type, principle: src.principle, status: 'disabled', principleInherited: src.principleInherited, expanded: false, children: [] };
                // 复制到同级（找父节点）
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
                if (node) {
                    node.status = 'enabled';
                    sessionStorage.setItem('AcctSetTree', JSON.stringify(window._acctTreeData));
                    // 同步到 FinanceAccountBooks，并初始化当年期间
                    window.acctSyncToFinanceBooks();
                    if (typeof window.ensureAccountPeriodsForBook === 'function') {
                        window.ensureAccountPeriodsForBook({ id: String(node.id), code: node.code, name: node.name }, new Date().getFullYear());
                    }
                    window.acctRenderTree();
                }
            };
            // 初始同步一次（页面加载时保证 FinanceAccountBooks 与树状态一致）
            window.acctSyncToFinanceBooks();
            window.acctRenderTree();
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
                        <td>${item.bookName || "-"}</td>
                        <td>${item.period}</td>
                        <td><span style="color:${statusColor}; font-weight:600;">● ${item.status}</span></td>
                    </tr>
                `;
            }).join("");

        contentHTML += `
                    <div class="filter-area" style="background-color: white; padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); margin-bottom: 16px;">
                        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
                            <label style="color:#666;">账套名称</label>
                            <select id="period-filter-book" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 200px;">
                                <option value="">全部</option>
                                ${bookOptions}
                            </select>
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
                                <th>账套名称</th>
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
// AcctAuxiliary
// =========================================================================
window.VM_MODULES['AcctAuxiliary'] = function(contentArea, contentHTML, moduleCode) {
        const AUX_TYPES = [
            { key: "dept", label: "部门", en: "Department" },
            { key: "customer", label: "客户", en: "Customer" },
            { key: "vendor", label: "供应商", en: "Supplier" },
            { key: "employee", label: "职员", en: "Employee" },
            { key: "project", label: "项目", en: "Project" },
            { key: "inventory", label: "存货", en: "Inventory" }
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
            }
        };

        const AUX_DEFAULTS = {
            dept: [
                { code: "001", name: "人事行政", remark: "", enabled: true },
                { code: "002", name: "财务部", remark: "", enabled: true },
                { code: "003", name: "股东/董事会", remark: "", enabled: true },
                { code: "004", name: "技术部", remark: "", enabled: true },
                { code: "005", name: "数据中心", remark: "", enabled: true },
                { code: "006", name: "滁州运营部", remark: "", enabled: true },
                { code: "007", name: "滁州销售部", remark: "", enabled: true },
                { code: "008", name: "销售部", remark: "", enabled: true },
                { code: "009", name: "新媒体部", remark: "", enabled: true },
                { code: "011", name: "总经理", remark: "", enabled: true },
                { code: "012", name: "市场推广部", remark: "", enabled: true },
                { code: "013", name: "中山大区", remark: "", enabled: true },
                { code: "014", name: "滁州办公室", remark: "", enabled: true }
            ],
            customer: [
                { code: "001", name: "客户1", remark: "", enabled: true },
                { code: "002", name: "客户2", remark: "", enabled: true },
                { code: "003", name: "客户3", remark: "", enabled: true }
            ],
            vendor: [
                { code: "V01", name: "供应商1", remark: "", enabled: true },
                { code: "V02", name: "供应商2", remark: "", enabled: true }
            ],
            employee: [
                { code: "E01", name: "张三", remark: "", enabled: true },
                { code: "E02", name: "李四", remark: "", enabled: true }
            ],
            project: [
                { code: "P04", name: "地方项目", remark: "", enabled: true },
                { code: "P03", name: "食品项目", remark: "", enabled: true },
                { code: "P02", name: "华东项目", remark: "", enabled: true },
                { code: "P01", name: "华南项目", remark: "", enabled: true }
            ],
            inventory: [
                { code: "S01", name: "存货A", remark: "", enabled: true },
                { code: "S02", name: "存货B", remark: "", enabled: true }
            ]
        };

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
