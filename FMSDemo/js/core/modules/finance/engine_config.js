/**
 * 会计引擎配置数据源
 * 根据你提供的列表整理成的树形结构
 */
const ENGINE_DATA = [
    // =========================================================
    // 运单结算模板（对应运单结算页面凭证1 + 应收核销凭证2）
    // =========================================================
    {
        name: "运单结算",
        children: [
            {
                name: "应收结算",
                items: [
                    "运单结算",
                    "应收核销"
                ]
            }
        ]
    },
    {
        // 该模块暂不提供预设模板，用户可根据需要自行配置
        // name: "挂帐",
        // children: [
        //     {
        //         name: "运单",
        //         items: [
        //             "现付挂帐",
        //             "现返挂帐",
        //             "网点中转现返挂帐",
        //             "单票提货费已付挂帐",
        //             "单票提货费未付挂帐",
        //             "欠付挂帐",
        //             "欠返挂帐",
        //             "网点中转欠返挂帐",
        //             "月结挂帐",
        //             "回付挂帐",
        //             "货到打卡挂帐",
        //             "货款扣挂帐",
        //             "税费挂帐",
        //             "货款手续费挂帐",
        //             "中转费挂帐",
        //             "回扣挂帐",
        //             "开单进仓费挂帐",
        //             "到站进仓费挂帐",
        //             "员工中转费挂帐",
        //             "总部代收货款挂帐",
        //             "出发网点代收货款挂帐",
        //             "目的网点代收货款挂帐",
        //             "途径网点代收货款挂帐",
        //             "出发网点到付挂帐",
        //             "途径网点到付挂帐",
        //             "目的网点到付挂帐",
        //             "总部货款扣挂帐",
        //             "总部货款手续费挂帐",
        //             "单票送货费挂帐",
        //             "单票送货上楼费挂帐",
        //             "单票送货装卸费挂帐",
        //             "单票送货进仓费挂帐",
        //             "出发网点垫付费已付挂帐",
        //             "出发网点垫付费未付挂帐",
        //             "目的网点垫付费挂帐",
        //             "途径网点垫付费挂帐",
        //             "总部代收运费挂帐",
        //             "出发网点代收运费挂帐",
        //             "目的网点代收运费挂帐",
        //             "途径网点代收运费挂帐",
        //             "总部垫付费挂帐",
        //             "网点中转费合计挂帐",
        //             "发站单票装车费挂帐",
        //             "发站单票其他费挂帐",
        //             "到站单票卸车费挂帐",
        //             "到站单票其他费挂帐",
        //             "发站落地中转费挂帐",
        //             "到站落地中转费挂帐",
        //             "发站落地中转费异动挂帐",
        //             "到站落地中转费异动挂帐",
        //             "发站落地送货费挂帐",
        //             "到站落地送货费挂帐",
        //             "发站落地送货异动费挂帐",
        //             "到站落地送货费异动挂帐",
        //             "发站平台服务费挂帐",
        //             "到站平台服务费挂帐",
        //             "平台增值费挂帐"
        //         ]
        //     },
        //     {
        //         name: "异动",
        //         items: [
        //             "现返异动增款挂帐",
        //             "欠返异动增款挂帐",
        //             "回扣异动增款挂帐",
        //             "现付异动增款挂帐",
        //             "出发网点到付异动增款挂帐",
        //             "途径网点到付异动增款挂帐",
        //             "目的网点到付异动增款挂帐",
        //             "欠付异动增款挂帐",
        //             "月结异动增款挂帐",
        //             "回付异动增款挂帐",
        //             "货款扣异动增款挂帐",
        //             "货到打卡异动增款挂帐",
        //             "现返异动减款挂帐",
        //             "欠返异动减款挂帐",
        //             "回扣异动减款挂帐",
        //             "现付异动减款挂帐",
        //             "出发网点到付异动减款挂帐",
        //             "途径网点到付异动减款挂帐",
        //             "目的网点到付异动减款挂帐",
        //             "欠付异动减款挂帐",
        //             "月结异动减款挂帐",
        //             "回付异动减款挂帐",
        //             "货款扣异动减款挂帐",
        //             "货到打卡异动减款挂帐",
        //             "总部代收货款异动挂帐",
        //             "出发网点代收货款异动挂帐",
        //             "目的网点代收货款异动挂帐",
        //             "途径网点代收货款异动挂帐",
        //             "总部垫付费异动挂帐",
        //             "出发网点垫付费异动挂帐",
        //             "目的网点垫付费异动挂帐",
        //             "途径网点垫付费异动挂帐",
        //             "货款手续费异动挂帐",
        //             "总部货款手续费异动挂帐"
        //         ]
        //     },
        //     {
        //         name: "干线",
        //         items: [
        //             "现付运输费挂帐",
        //             "到付运输费挂帐",
        //             "回付运输费挂帐",
        //             "现付油卡费挂帐",
        //             "整车保险费挂帐",
        //             "发站装车费挂帐",
        //             "发站其它费挂帐",
        //             "到站卸车费挂帐",
        //             "到站其它费挂帐",
        //             "整车信息费挂帐",
        //             "发站落地费挂帐",
        //             "到站落地费挂帐",
        //             "发站落货费挂帐",
        //             "到站落货费挂帐",
        //             "挂车使用费挂帐",
        //             "应付到付挂帐",
        //             "应付现付挂帐",
        //             "应付油卡挂帐",
        //             "应付回付挂帐",
        //             "应付保险费挂帐",
        //             "应收到付挂帐",
        //             "应收现付挂帐",
        //             "应收油卡挂帐",
        //             "应收回付挂帐",
        //             "应收其他挂帐",
        //             "应收信息费挂帐"
        //         ]
        //     },
        //     {
        //         name: "送货",
        //         items: [
        //             "送货费挂帐",
        //             "应付到付挂帐",
        //             "应付现付挂帐",
        //             "应付油卡挂帐",
        //             "应付回付挂帐",
        //             "应收到付挂帐",
        //             "应收现付挂帐",
        //             "应收油卡挂帐",
        //             "应收回付挂帐",
        //             "应收其他挂帐"
        //         ]
        //     },
        //     {
        //         name: "短驳",
        //         items: [
        //             "短驳费挂帐",
        //             "应付到付挂帐",
        //             "应付现付挂帐",
        //             "应付油卡挂帐",
        //             "应付回付挂帐",
        //             "应收到付挂帐",
        //             "应收现付挂帐",
        //             "应收油卡挂帐",
        //             "应收回付挂帐",
        //             "应收其他挂帐"
        //         ]
        //     },
        //     {
        //         name: "应收挂帐",
        //         items: [
        //             "到付应收挂帐",
        //             "代收货款应收挂帐",
        //             "成本中转费应收挂帐",
        //             "成本操作费应收挂帐",
        //             "成本送货费应收挂帐",
        //             "成本保险费应收挂帐",
        //             "成本回单费应收挂帐",
        //             "成本标签费应收挂帐",
        //             "成本管理费应收挂帐",
        //             "成本运单费应收挂帐",
        //             "成本到付手续费应收挂帐",
        //             "成本货款手续费应收挂帐",
        //             "货款手续费应收挂帐",
        //             "成本返货费应收挂帐",
        //             "核定外部中转费应收挂帐",
        //             "核定内部中转费应收挂帐",
        //             "核定送货费应收挂帐",
        //             "实际外部中转费应收挂帐",
        //             "实际内部中转费应收挂帐",
        //             "实际送货费应收挂帐",
        //             "短信费应收挂帐",
        //             "货款扣应收挂帐",
        //             "货款扣异动应收挂帐",
        //             "网点中转费合计应收挂帐",
        //             "实际外部中转送货费应收挂帐",
        //             "到付异动应收挂帐",
        //             "代收货款异动应收挂帐",
        //             "垫付费异动应收挂帐",
        //             "货款手续费异动应收挂帐",
        //             "网点中转送货费应收挂帐",
        //             "网点中转提货费应收挂帐",
        //             "网点中转费应收挂帐",
        //             "网点中转装卸费应收挂帐",
        //             "标准网点中转送货费应收挂帐",
        //             "标准网点中转提货费应收挂帐",
        //             "标准网点中转费应收挂帐",
        //             "标准网点中转装卸费应收挂帐",
        //             "网点中转费异动应收挂帐",
        //             "网点中转送货费异动应收挂帐",
        //             "控货费应收挂帐",
        //             "改单费应收挂帐",
        //             "配安费应收挂帐",
        //             "单票提货费应收挂帐",
        //             "单票送货费应收挂帐",
        //             "现付运输费应收挂帐",
        //             "到付运输费应收挂帐"
        //         ]
        //     },
        //     {
        //         name: "应付挂帐",
        //         items: [
        //             "到付应付挂帐",
        //             "代收货款应付挂帐",
        //             "成本中转费应付挂帐",
        //             "成本操作费应付挂帐",
        //             "成本送货费应付挂帐",
        //             "成本保险费应付挂帐",
        //             "成本回单费应付挂帐",
        //             "成本标签费应付挂帐",
        //             "成本管理费应付挂帐",
        //             "成本运单费应付挂帐",
        //             "成本到付手续费应付挂帐",
        //             "成本货款手续费应付挂帐",
        //             "货款手续费应付挂帐",
        //             "成本返货费应付挂帐",
        //             "核定外部中转费应付挂帐",
        //             "核定内部中转费应付挂帐",
        //             "核定送货费应付挂帐",
        //             "实际外部中转费应付挂帐",
        //             "实际内部中转费应付挂帐",
        //             "实际送货费应付挂帐",
        //             "短信费应付挂帐",
        //             "货款扣应付挂帐",
        //             "货款扣异动应付挂帐",
        //             "网点中转费合计应付挂帐",
        //             "实际外部中转送货费应付挂帐",
        //             "到付异动应付挂帐",
        //             "代收货款异动应付挂帐",
        //             "垫付费异动应付挂帐",
        //             "货款手续费异动应付挂帐",
        //             "网点中转送货费应付挂帐",
        //             "网点中转提货费应付挂帐",
        //             "网点中转费应付挂帐",
        //             "网点中转装卸费应付挂帐",
        //             "标准网点中转送货费应付挂帐",
        //             "标准网点中转提货费应付挂帐",
        //             "标准网点中转费应付挂帐",
        //             "标准网点中转装卸费应付挂帐",
        //             "网点中转费异动应付挂帐",
        //             "网点中转送货费异动应付挂帐",
        //             "控货费应付挂帐",
        //             "改单费应付挂帐",
        //             "配安费应付挂帐",
        //             "单票提货费应付挂帐",
        //             "单票送货费应付挂帐",
        //             "现付运输费应付挂帐",
        //             "到付运输费应付挂帐"
        //         ]
        //     },
        //     {
        //         name: "提货",
        //         items: [
        //             "提货费挂帐",
        //             "应付到付挂帐",
        //             "应付现付挂帐",
        //             "应付油卡挂帐",
        //             "应付回付挂帐",
        //             "应收到付挂帐",
        //             "应收现付挂帐",
        //             "应收油卡挂帐",
        //             "应收回付挂帐",
        //             "应收其他挂帐"
        //         ]
        //     }
        // ]
    },
    {
        name: "结算",
        children: [
            {
                name: "测试",
                items: ["测试应收", "测试应付", "测试内部报销"]
            },
            {
                name: "运单",
                items: [
                    "现付结算",
                    "现返结算",
                    "单票提货费已付结算",
                    "单票提货费未付结算",
                    "欠付结算",
                    "欠返结算",
                    "到付结算",
                    "月结结算",
                    "回付结算",
                    "货到打卡结算",
                    "货款扣结算",
                    "代收货款回收",
                    "代收货款汇款",
                    "代收货款到账",
                    "代收货款发放",
                    "到付汇款",
                    "到付到账",
                    "到付异动汇款",
                    "到付异动到账",
                    "税费结算",
                    "配安费结算",
                    "货款手续费结算",
                    "中转费结算",
                    "回扣结算",
                    "到站进仓费结算",
                    "垫付费回收",
                    "垫付费汇款",
                    "垫付费到账",
                    "垫付费已付发放",
                    "垫付费未付发放",
                    "代收运费回收",
                    "代收运费汇款",
                    "代收运费到账",
                    "代收运费发放",
                    "单票送货费结算",
                    "单票送货上楼费结算",
                    "单票送货装卸费结算",
                    "单票送货进仓费结算",
                    "网点中转费结算",
                    "现返异动增款结算",
                    "欠返异动增款结算",
                    "回扣异动增款结算",
                    "现付异动增款结算",
                    "到付异动增款结算",
                    "欠付异动增款结算",
                    "月结异动增款结算",
                    "回付异动增款结算",
                    "货款扣异动增款结算",
                    "货到打卡异动增款结算",
                    "现返异动减款结算",
                    "欠返异动减款结算",
                    "回扣异动减款结算",
                    "现付异动减款结算",
                    "到付异动减款结算",
                    "欠付异动减款结算",
                    "月结异动减款结算",
                    "回付异动减款结算",
                    "货款扣异动减款结算",
                    "货到打卡异动减款结算",
                    "发站单票装车费",
                    "发站单票其他费",
                    "到站单票卸车费",
                    "到站单票其他费",
                    "开单进仓费",
                    "代收货款异动回收",
                    "代收货款异动发放",
                    "代收货款异动汇款",
                    "代收货款异动到账",
                    "垫付费异动发放",
                    "货款手续费异动结算",
                    "发站落地中转费结算",
                    "到站落地中转费结算",
                    "发站落地中转费异动结算",
                    "到站落地中转费异动结算",
                    "发站落地送货费结算",
                    "到站落地送货费结算",
                    "发站落地送货异动费结算",
                    "到站落地送货费异动结算",
                    "发站平台服务费结算",
                    "到站平台服务费结算",
                    "平台增值费结算"
                ]
            },
            {
                name: "干线",
                items: [
                    "现付运输费结算",
                    "到付运输费结算",
                    "回付运输费结算",
                    "现付油卡费结算",
                    "整车保险费结算",
                    "发站装车费结算",
                    "发站其它费结算",
                    "到站卸车费结算",
                    "到站其它费结算",
                    "整车信息费结算",
                    "挂车使用费结算",
                    "发站落地费结算",
                    "到站落地费结算",
                    "发站落货费结算",
                    "到站落货费结算",
                    "应付到付结算",
                    "应付现付结算",
                    "应付油卡结算",
                    "应付回付结算",
                    "应付保险费结算",
                    "应收到付结算",
                    "应收现付结算",
                    "应收油卡结算",
                    "应收回付结算",
                    "应收其他结算",
                    "应收信息费结算",
                    "司机定金收入结算",
                    "司机定金支出结算",
                    "现付运输费异动增款结算",
                    "现付运输费异动减款结算"
                ]
            },
            {
                name: "送货",
                items: [
                    "送货费结算",
                    "司机定金收入结算",
                    "司机定金支出结算",
                    "送货费异动增款结算",
                    "送货费异动减款结算"
                ]
            },
            {
                name: "短驳",
                items: [
                    "短驳费结算",
                    "网点对账结算",
                    "发站网点对账结算",
                    "到站网点对账结算"
                ]
            },
            {
                name: "提货",
                items: [
                    "提货费结算",
                    "司机定金收入结算",
                    "司机定金支出结算",
                    "提货费异动增款结算",
                    "提货费异动减款结算"
                ]
            }
        ]
    },
    {
        name: "核销",
        children: [
            {
                name: "测试",
                items: ["测试应收1", "测试应付1"]
            }
        ]
    },
    {
        name: "账户结算",
        children: [
            {
                name: "账户收款（网点间交易）",
                items: [
                    "到付出发网点收款",
                    "到付途径网点收款",
                    "货款出发网点收款",
                    "货款途径网点收款",
                    "货款总部收款",
                    "成本中转费收款",
                    "成本操作费收款",
                    "成本送货费收款",
                    "异常罚款收款",
                    "成本保险费收款",
                    "成本回单费收款",
                    "成本标签费收款",
                    "成本管理费收款",
                    "成本运单费收款",
                    "成本到付手续费收款",
                    "成本货款手续费收款",
                    "货款手续费收款",
                    "成本返货费收款",
                    "核定外部中转费收款",
                    "核定内部中转费收款",
                    "核定送货费收款",
                    "实际外部中转费收款",
                    "实际内部中转费收款",
                    "实际送货费收款",
                    "货款扣收款",
                    "货款扣异动收款",
                    "网点中转费合计收款",
                    "实际外部中转送货费收款",
                    "到付异动增款出发网点收款",
                    "到付异动增款途径网点收款",
                    "到付异动增款目的网点收款",
                    "到付异动减款出发网点收款",
                    "到付异动减款途径网点收款",
                    "到付异动减款目的网点收款",
                    "改单费收款",
                    "控货费收款",
                    "代收货款异动出发网点收款",
                    "代收货款异动途径网点收款",
                    "代收货款异动目的网点收款",
                    "代收货款异动总部收款",
                    "垫付费异动出发网点收款",
                    "垫付费异动途径网点收款",
                    "垫付费异动目的网点收款",
                    "垫付费异动总部收款",
                    "货款手续费异动收款",
                    "网点中转送货费收款",
                    "网点中转提货费收款",
                    "网点中转费收款",
                    "网点中转装卸费收款",
                    "标准网点中转送货费收款",
                    "标准网点中转提货费收款",
                    "标准网点中转费收款",
                    "标准网点中转装卸费收款",
                    "网点中转费异动收款",
                    "网点中转送货费异动收款",
                    "短信费收款",
                    "配安费收款",
                    "单票提货费收款",
                    "单票送货费收款",
                    "现付运输费收款",
                    "到付运输费收款"
                ]
            },
            {
                name: "账户扣款（网点间交易）",
                items: [
                    "到付目的网点付款",
                    "到付途径网点付款",
                    "货款目的网点付款",
                    "货款途径网点付款",
                    "货款总部付款",
                    "成本中转费付款",
                    "成本操作费付款",
                    "成本送货费付款",
                    "异常罚款付款",
                    "成本保险费付款",
                    "成本回单费付款",
                    "成本标签费付款",
                    "成本管理费付款",
                    "成本运单费付款",
                    "成本到付手续费付款",
                    "成本货款手续费付款",
                    "货款手续费付款",
                    "成本返货费付款",
                    "核定外部中转费付款",
                    "核定内部中转费付款",
                    "核定送货费付款",
                    "实际外部中转费付款",
                    "实际内部中转费付款",
                    "实际送货费付款",
                    "货款扣付款",
                    "货款扣异动付款",
                    "网点中转费合计付款",
                    "实际外部中转送货费付款",
                    "到付异动增款目的网点付款",
                    "到付异动增款途径网点付款",
                    "到付异动增款出发网点付款",
                    "到付异动减款目的网点付款",
                    "到付异动减款途径网点付款",
                    "到付异动减款出发网点付款",
                    "改单费付款",
                    "控货费付款",
                    "代收货款异动出发网点付款",
                    "代收货款异动途径网点付款",
                    "代收货款异动目的网点付款",
                    "代收货款异动总部付款",
                    "垫付费异动出发网点付款",
                    "垫付费异动途径网点付款",
                    "垫付费异动目的网点付款",
                    "垫付费异动总部付款",
                    "货款手续费异动付款",
                    "网点中转送货费付款",
                    "网点中转提货费付款",
                    "网点中转费付款",
                    "网点中转装卸费付款",
                    "标准网点中转送货费付款",
                    "标准网点中转提货费付款",
                    "标准网点中转费付款",
                    "标准网点中转装卸费付款",
                    "网点中转费异动付款",
                    "网点中转送货费异动付款",
                    "短信费付款",
                    "配安费付款",
                    "单票提货费付款",
                    "单票送货费付款",
                    "现付运输费付款",
                    "到付运输费付款"
                ]
            },
            {
                name: "利息账户",
                items: ["利息收入", "利息支出"]
            }
        ]
    },
    {
        name: "账户管理",
        children: [
            {
                name: "充值管理",
                items: [
                    "账户充值",
                    "充值入金手续费",
                    "充值预收手续费",
                    "账户充值（自定义收支方式）"
                ]
            },
            {
                name: "提现管理",
                items: [
                    "账户提现",
                    "提现手续费"
                ]
            },
            {
                name: "扫码收款",
                items: [
                    "现付入金手续费",
                    "到付入金手续费",
                    "货款入金手续费",
                    "现付预收手续费",
                    "到付预收手续费",
                    "货款预收手续费"
                ]
            },
            {
                name: "在线打款",
                items: [
                    "在线打款",
                    "在线打款手续费"
                ]
            }
        ]
    },
    {
        name: "在线账户管理",
        children: [
            {
                name: "充值管理",
                items: [
                    "账户充值",
                    "充值入金手续费",
                    "充值预收手续费",
                    "后台充值",
                    "后台充值手续费"
                ]
            },
            {
                name: "提现管理",
                items: [
                    "账户提现",
                    "提现手续费",
                    "后台提现",
                    "后台提现手续费"
                ]
            },
            {
                name: "扫码收款",
                items: [
                    "现付入金手续费",
                    "到付入金手续费",
                    "货款入金手续费",
                    "现付预收手续费",
                    "到付预收手续费",
                    "货款预收手续费"
                ]
            },
            {
                name: "收支方式",
                items: [
                    "现付",
                    "到付",
                    "现返",
                    "代收货款",
                    "现付异动",
                    "到付异动",
                    "现返异动",
                    "代收货款异动"
                ]
            },
            {
                name: "在线打款",
                items: [
                    "在线打款",
                    "在线打款手续费",
                    "在线打款运输费"
                ]
            }
        ]
    }
    ,{
        name: "对账",
        children: [
            {
                name: "客户对账",
                items: [
                    "客户对账确认",
                    "客户对账结算",
                    "客户对账差异处理"
                ]
            },
            {
                name: "网点对账",
                items: [
                    "网点对账结算",
                    "网点对账差异处理"
                ]
            },
            {
                name: "承运商对账",
                items: [
                    "承运商对账结算",
                    "承运商对账差异处理"
                ]
            }
        ]
    }
];

const ENGINE_TEMPLATE_STORAGE_KEY = "EngineVoucherTemplates";
const DEFAULT_PAYMENT_METHOD_SUBJECTS = [
    { id: "pm_wx", name: "微信", subjectCode: "1012.01", subjectName: "其他货币资金-微信" },
    { id: "pm_cash", name: "现金", subjectCode: "1001", subjectName: "库存现金" },
    { id: "pm_bank", name: "银行卡", subjectCode: "1002.01", subjectName: "银行存款-基本户" }
];

// ─── 自定义模板数据管理 ───────────────────────────────────────────
const ENGINE_CUSTOM_KEY = "EngineCustomData";

function loadCustomData() {
    try {
        return JSON.parse(localStorage.getItem(ENGINE_CUSTOM_KEY) || '{"categories":[],"aliases":{}}');
    } catch(e) { return { categories: [], aliases: {} }; }
}

function saveCustomData(data) {
    localStorage.setItem(ENGINE_CUSTOM_KEY, JSON.stringify(data));
}

// 获取 item 的显示名称（优先 alias）
function getDisplayName(originalName) {
    const data = loadCustomData();
    return (data.aliases && data.aliases[originalName]) || originalName;
}

// 获取所有树数据（内置 + 自定义）
function getAllTreeData() {
    const custom = loadCustomData();
    const customCats = (custom.categories || []).map(cat => ({ ...cat, _custom: true }));
    return [...ENGINE_DATA, ...customCats];
}

// 系统预置初始模板（仅在对应 key 不存在时生效，用户保存后以用户数据为准）
const ENGINE_DEFAULT_TEMPLATES = {
    // ── 凭证1：运单结算时确认债权 ──────────────────────────────
    // 借：应收账款（含税全额）= 贷：主营业务收入（不含税）+ 贷：应交税费（税额9%）
    "运单结算": {
        name: "运单结算", category: "运单结算", group: "应收结算",
        voucherWord: "转", summaryTemplate: "运单结算-{clientName}", remark: "",
        taxRate: 0.09,
        entries: [
            { dir: "借", subjectCode: "1122", subjectName: "应收账款",     summary: "确认应收债权", amountType: "gross", usePaymentMethod: false },
            { dir: "贷", subjectCode: "5001", subjectName: "主营业务收入", summary: "确认运输收入", amountType: "net",   usePaymentMethod: false },
            { dir: "贷", subjectCode: "2221", subjectName: "应交税费",     summary: "确认销项税额", amountType: "tax",   usePaymentMethod: false }
        ]
    },
    // ── 凭证2：应收核销时冲抵债权 ──────────────────────────────
    // 借：银行存款（实收全额）= 贷：应收账款（冲销债权全额）
    "应收核销": {
        name: "应收核销", category: "运单结算", group: "应收结算",
        voucherWord: "收", summaryTemplate: "收款核销-{counterparty}", remark: "",
        taxRate: 0,
        entries: [
            { dir: "借", subjectCode: "1002", subjectName: "银行存款",   summary: "收到客户款项", amountType: "gross", usePaymentMethod: false },
            { dir: "贷", subjectCode: "1122", subjectName: "应收账款",   summary: "冲销应收账款", amountType: "gross", usePaymentMethod: false }
        ]
    },
    "应付核销": {
        name: "应付核销", category: "核销", group: "应付",
        voucherWord: "付", summaryTemplate: "", remark: "",
        entries: [
            { dir: "借", subjectCode: "2202", subjectName: "应付账款",   summary: "", usePaymentMethod: false },
            { dir: "贷", subjectCode: "1002", subjectName: "银行存款",   summary: "", usePaymentMethod: false }
        ]
    },
    // ── 测试模板：结算-测试应收 ─────────────────────────────────────
    // 借：应收账款（含税9%） = 贷：主营业务收入（不含税）+ 贷：应交税费（税额）
    "测试应收": {
        name: "测试应收", category: "结算", group: "测试",
        voucherWord: "收", summaryTemplate: "确认应收-{clientName}", remark: "确认应收账款（含税9%）",
        taxRate: 0.09,
        entries: [
            { dir: "借", subjectCode: "1122", subjectName: "应收账款",     summary: "确认应收债权", amountType: "gross", usePaymentMethod: false },
            { dir: "贷", subjectCode: "5001", subjectName: "主营业务收入", summary: "确认运输收入", amountType: "net",   usePaymentMethod: false },
            { dir: "贷", subjectCode: "2221", subjectName: "应交税费",     summary: "确认销项税额", amountType: "tax",   usePaymentMethod: false }
        ]
    },
    // ── 测试模板：结算-测试应付（网络货运3%简易计税进项税）──────────
    // 借：运输成本（不含税）+ 借：应交税费进项（3%）= 贷：应付账款（含税）
    "测试应付": {
        name: "测试应付", category: "结算", group: "测试",
        voucherWord: "付", summaryTemplate: "司机运费-{clientName}", remark: "网络货运司机成本（3%简易计税进项税）",
        taxRate: 0.03,
        entries: [
            { dir: "借", subjectCode: "640101", subjectName: "运输成本",   summary: "运费成本（不含税）", amountType: "net",   usePaymentMethod: false },
            { dir: "借", subjectCode: "2221",   subjectName: "应交税费",   summary: "进项税额（3%）",     amountType: "tax",   usePaymentMethod: false },
            { dir: "贷", subjectCode: "2202",   subjectName: "应付账款",   summary: "应付司机款",          amountType: "gross", usePaymentMethod: false }
        ]
    },
    // ── 测试模板：结算-测试内部报销 ───────────────────────────────────
    "测试内部报销": {
        name: "测试内部报销", category: "结算", group: "测试",
        voucherWord: "付", summaryTemplate: "费用报销-{clientName}", remark: "内部员工费用报销",
        taxRate: 0,
        entries: [
            { dir: "借", subjectCode: "6602", subjectName: "管理费用", summary: "报销费用", amountType: "gross", usePaymentMethod: false },
            { dir: "贷", subjectCode: "1002", subjectName: "银行存款", summary: "报销支出", amountType: "gross", usePaymentMethod: false }
        ]
    },
    // ── 测试模板：核销-测试应收1 ─────────────────────────────────────
    // 借：银行存款 = 贷：应收账款
    "测试应收1": {
        name: "测试应收1", category: "核销", group: "运单",
        voucherWord: "收", summaryTemplate: "收款核销-{clientName}", remark: "收款冲销应收账款",
        taxRate: 0,
        entries: [
            { dir: "借", subjectCode: "1002", subjectName: "银行存款", summary: "收到客户款项", amountType: "gross", usePaymentMethod: false },
            { dir: "贷", subjectCode: "1122", subjectName: "应收账款", summary: "冲销应收账款", amountType: "gross", usePaymentMethod: false }
        ]
    },
    // ── 测试模板：核销-测试应付1（付款代扣个税1%）───────────────────
    // 借：应付账款 = 贷：应交个税（1% 平率代扣）+ 贷：银行存款（余额）
    "测试应付1": {
        name: "测试应付1", category: "核销", group: "运单",
        voucherWord: "付", summaryTemplate: "付款核销-{clientName}", remark: "付款核销应付账款（代扣个税1%）",
        taxRate: 0,
        entries: [
            { dir: "借", subjectCode: "2202",   subjectName: "应付账款",       summary: "核销应付账款",   amountType: "gross",         usePaymentMethod: false },
            { dir: "贷", subjectCode: "222105", subjectName: "应交个人所得税", summary: "代扣个税（1%）", amountType: "flatRate",        flatRate: 0.01, usePaymentMethod: false },
            { dir: "贷", subjectCode: "1002",   subjectName: "银行存款",       summary: "实付司机款",     amountType: "flatComplement",  flatRate: 0.01, usePaymentMethod: false }
        ]
    }
};

function loadEngineTemplateStore() {
    // 始终优先读 localStorage（持久化数据），sessionStorage 作为本次会话缓存
    const lsData = localStorage.getItem(ENGINE_TEMPLATE_STORAGE_KEY);
    let store = lsData ? JSON.parse(lsData) : null;
    if (!store) {
        // localStorage 没有时，降级到 sessionStorage
        store = JSON.parse(sessionStorage.getItem(ENGINE_TEMPLATE_STORAGE_KEY) || "null");
    }
    if (!store) store = {};
    // 注入预置模板：key 不存在，或 entries 里没有任何已填科目码（空模板），则用预置值覆盖
    // 用户通过「保存模板」后 entries 会有 subjectCode，此后不再覆盖
    const hasConfiguredEntries = (tpl) =>
        tpl && Array.isArray(tpl.entries) && tpl.entries.some(e => (e.subjectCode || '').trim());
    let dirty = false;
    // 清理已废弃的 key（旧版本遗留）
    const obsoleteKeys = ['收款单', '付款单'];
    obsoleteKeys.forEach(k => { if (store[k]) { delete store[k]; dirty = true; } });
    // 修正"应收核销"：若旧模板借方是应收账款（错误方向），强制用预置值覆盖
    if (store['应收核销']) {
        const oldDebit = (store['应收核销'].entries || []).find(e => e.dir === '借');
        if (oldDebit && (oldDebit.subjectCode || '').startsWith('1122')) {
            delete store['应收核销'];
            dirty = true;
        }
    }
    // "运单结算"：若旧模板缺少 amountType 字段则强制重建（保证借贷平衡）
    if (store['运单结算']) {
        const missingAmtType = (store['运单结算'].entries || []).some(e => !e.amountType);
        if (missingAmtType) { delete store['运单结算']; dirty = true; }
    }
    // 注入/修正预置模板（key 不存在则用预置值）
    for (const [key, tpl] of Object.entries(ENGINE_DEFAULT_TEMPLATES)) {
        if (!hasConfiguredEntries(store[key])) {
            store[key] = tpl;
            dirty = true;
        }
    }
    if (dirty) {
        sessionStorage.setItem(ENGINE_TEMPLATE_STORAGE_KEY, JSON.stringify(store));
        try { localStorage.setItem(ENGINE_TEMPLATE_STORAGE_KEY, JSON.stringify(store)); } catch(e) {}
    }
    return store;
}

function saveEngineTemplateStore(store) {
    sessionStorage.setItem(ENGINE_TEMPLATE_STORAGE_KEY, JSON.stringify(store));
    try { localStorage.setItem(ENGINE_TEMPLATE_STORAGE_KEY, JSON.stringify(store)); } catch(e) {}
}

function findEngineCategory(itemName) {
    for (const category of getAllTreeData()) {
        if (!category.children) continue;
        for (const child of category.children) {
            if (!child.items) continue;
            if (child.items.includes(itemName)) {
                return { category: category.name, group: child.name };
            }
        }
    }
    return { category: "自定义", group: "-" };
}

function buildEmptyTemplate(itemName, categoryInfo) {
    return {
        name: itemName,
        category: categoryInfo.category,
        group: categoryInfo.group,
        voucherWord: "转",
        summaryTemplate: "",
        remark: "",
        entries: [
            { dir: "借", subjectCode: "", subjectName: "", summary: "", usePaymentMethod: false },
            { dir: "贷", subjectCode: "", subjectName: "", summary: "", usePaymentMethod: false }
        ]
    };
}

function getEngineTemplate(itemName, categoryInfo) {
    const store = loadEngineTemplateStore();
    if (!store[itemName]) {
        store[itemName] = buildEmptyTemplate(itemName, categoryInfo);
        saveEngineTemplateStore(store);
    }
    return store[itemName];
}

function setEngineTemplate(itemName, template) {
    const store = loadEngineTemplateStore();
    store[itemName] = template;
    saveEngineTemplateStore(store);
}

function resolvePaymentMethodSubject(pmId) {
    if (!pmId) return null;
    const list = JSON.parse(sessionStorage.getItem("ConfigPaymentMethods") || "[]");
    const match = list.find(m => m.id === pmId && m.subjectCode && m.subjectName);
    if (match) {
        return { subjectCode: match.subjectCode, subjectName: match.subjectName };
    }
    return DEFAULT_PAYMENT_METHOD_SUBJECTS.find(m => m.id === pmId) || null;
}

function renderTemplatePlaceholder(templateText, doc) {
    if (!templateText) return "";
    return templateText.replace(/\{(\w+)\}/g, (_, key) => {
        const val = doc && doc[key];
        return val === undefined || val === null ? "" : val;
    });
}

function parseAmountValue(value) {
    if (value === null || value === undefined) return 0;
    const num = parseFloat(value.toString().replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
}

window.generateVoucherFromEngineTemplate = function(itemName, doc, options) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    if (!template || !template.entries || template.entries.length === 0) {
        return { success: false, error: "未配置任何分录" };
    }

    const voucherWord = template.voucherWord || "转";
    const amountTotal = parseAmountValue(doc.amount || doc.totalAmount);
    const taxRate = parseFloat(template.taxRate) || 0;

    // 按 taxRate 预计算含税/不含税/税额，保证借贷平衡
    // tax = round(amount × rate / (1+rate), 2)，net = amount - tax，避免浮点累计误差
    const taxAmt  = taxRate > 0 ? parseFloat((amountTotal * taxRate / (1 + taxRate)).toFixed(2)) : 0;
    const netAmt  = taxRate > 0 ? parseFloat((amountTotal - taxAmt).toFixed(2)) : amountTotal;

    const resolveEntryAmount = (entry) => {
        const t = entry.amountType || 'gross';
        if (t === 'tax') return taxAmt;
        if (t === 'net') return netAmt;
        // 支持平率代扣（如1%个人所得税）: amount × flatRate
        if (t === 'flatRate' && typeof entry.flatRate === 'number') {
            return parseFloat((amountTotal * entry.flatRate).toFixed(2));
        }
        // 支持平率余额（配合flatRate使用）: amount × (1 - flatRate)
        if (t === 'flatComplement' && typeof entry.flatRate === 'number') {
            const deducted = parseFloat((amountTotal * entry.flatRate).toFixed(2));
            return parseFloat((amountTotal - deducted).toFixed(2));
        }
        return amountTotal; // 'gross' 或未设置
    };

    const lines = [];

    for (const entry of template.entries) {
        let subjectCode = entry.subjectCode;
        let subjectName = entry.subjectName;
        if (entry.usePaymentMethod) {
            const pm = resolvePaymentMethodSubject(options && options.paymentMethodId);
            if (!pm) {
                return { success: false, error: "未找到收支方式科目" };
            }
            subjectCode = pm.subjectCode;
            subjectName = pm.subjectName;
        }

        if (!subjectCode || !subjectName) {
            return { success: false, error: "科目未填写完整" };
        }

        const entryAmount = resolveEntryAmount(entry);
        const digest = renderTemplatePlaceholder(entry.summary || template.summaryTemplate || itemName, doc);
        lines.push({
            summary: digest,
            account: `${subjectCode} ${subjectName}`.trim(),
            debit: entry.dir === "借" ? entryAmount.toFixed(2) : "",
            credit: entry.dir === "贷" ? entryAmount.toFixed(2) : ""
        });
    }

    const voucherId = typeof window.generateSequentialVoucherId === "function"
        ? window.generateSequentialVoucherId(voucherWord)
        : `${voucherWord}-${String(Math.floor(Math.random() * 9999 + 1)).padStart(4, "0")}`;
    const voucher = {
        id: voucherId,
        date: doc.date || new Date().toISOString().split("T")[0],
        amount: amountTotal.toFixed(2),
        summary: renderTemplatePlaceholder(template.summaryTemplate || itemName, doc),
        user: "会计引擎(模板)",
        status: "待审核",
        sourceType: doc.type || "",
        sourceId: doc.waybillNo || doc.bill_no || doc.id || "",
        clientName: doc.clientName || doc.client || "",
        lines: lines
    };

    const vList = JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
    vList.unshift(voucher);
    sessionStorage.setItem("ManualVouchers", JSON.stringify(vList));

    return { success: true, voucherId, voucher };
};

/**
 * 渲染左侧树形菜单 HTML（含新增/重命名/删除按钮）
 */
function renderEngineTree() {
    const customData = loadCustomData();
    const allData = getAllTreeData();
    let html = `
        <div style="padding:8px 10px 4px; border-bottom:1px solid #eee; margin-bottom:4px;">
            <button onclick="window.showAddEngineModal()" style="width:100%; padding:6px 0; background:#2980b9; color:#fff; border:none; border-radius:5px; font-size:12px; cursor:pointer;">＋ 新增模板</button>
        </div>
    `;

    allData.forEach((category, index) => {
        const categoryId = `engine-cat-${index}`;
        const isCustomCat = !!category._custom;
        const catName = getDisplayName(category.name);
        html += `
            <div class="tree-node level-1" style="display:flex; justify-content:space-between; align-items:center;">
                <span onclick="window.toggleEngineCategory('${categoryId}')" style="flex:1; cursor:pointer;">${catName}</span>
                <span style="display:flex; gap:4px; flex-shrink:0;">
                    <span class="engine-toggle-icon" data-target="${categoryId}" onclick="window.toggleEngineCategory('${categoryId}')" style="cursor:pointer;">▾</span>
                    ${isCustomCat ? `<span onclick="window.deleteCategoryEngine('${category.name}')" title="删除分类" style="color:#e74c3c;cursor:pointer;font-size:11px;padding:0 2px;">✕</span>` : ''}
                </span>
            </div>
        `;

        if (category.children) {
            html += `<div id="${categoryId}" class="engine-category">`;
            category.children.forEach((sub, subIndex) => {
                const subId = `${categoryId}-sub-${subIndex}`;
                const subName = getDisplayName(`${category.name}::${sub.name}`) || sub.name;
                html += `
                    <div class="tree-node level-2" style="display:flex; justify-content:space-between; align-items:center;">
                        <span onclick="window.toggleEngineSubCategory('${subId}')" style="flex:1; cursor:pointer;">${subName}</span>
                        <span class="engine-toggle-icon" data-target="${subId}" onclick="window.toggleEngineSubCategory('${subId}')" style="cursor:pointer;">▾</span>
                    </div>
                `;

                if (sub.items) {
                    html += `<div id="${subId}" class="engine-subcategory">`;
                    sub.items.forEach(item => {
                        const displayItem = getDisplayName(item);
                        const isCustomItem = isCustomCat;
                        html += `
                            <div class="tree-node level-3" style="display:flex; justify-content:space-between; align-items:center; padding-right:6px;">
                                <span onclick="loadEngineConfig('${item}')" style="flex:1; cursor:pointer; overflow:hidden; text-overflow:ellipsis;" title="${displayItem}">${displayItem}</span>
                                <span style="display:flex; gap:3px; flex-shrink:0; opacity:0.6;">
                                    <span onclick="window.renameEngineItem('${item}')" title="重命名" style="cursor:pointer; font-size:11px; color:#2980b9;">✎</span>
                                    ${isCustomItem ? `<span onclick="window.deleteCustomEngineItem('${item}', '${category.name}')" title="删除" style="cursor:pointer; font-size:11px; color:#e74c3c;">✕</span>` : ''}
                                </span>
                            </div>`;
                    });
                    html += `</div>`;
                }
            });
            html += `</div>`;
        }
    });

    // 新增模板弹窗（隐藏）
    html += `
        <div id="engine-add-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.45); z-index:9999;">
            <div style="position:absolute; top:15%; left:50%; transform:translateX(-50%); width:440px; background:#fff; border-radius:8px; padding:24px; box-shadow:0 8px 32px rgba(0,0,0,0.15);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:16px;">新增模板配置</h3>
                    <span onclick="document.getElementById('engine-add-modal').style.display='none'" style="cursor:pointer; font-size:18px; color:#999;">✕</span>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">模板名称 <span style="color:red;">*</span></label>
                    <input id="engine-new-name" type="text" placeholder="例如：月结客户对账结算" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:5px; box-sizing:border-box;">
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">所属大类（可新建）</label>
                    <input id="engine-new-category" type="text" placeholder="例如：对账 或 自定义" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:5px; box-sizing:border-box;" list="engine-cat-list">
                    <datalist id="engine-cat-list">
                        ${getAllTreeData().map(c => `<option value="${c.name}">`).join('')}
                    </datalist>
                </div>
                <div style="margin-bottom:16px;">
                    <label style="font-size:12px; color:#666; display:block; margin-bottom:4px;">子分类（可新建）</label>
                    <input id="engine-new-group" type="text" placeholder="例如：客户对账" style="width:100%; padding:8px; border:1px solid #ddd; border-radius:5px; box-sizing:border-box;">
                </div>
                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button onclick="document.getElementById('engine-add-modal').style.display='none'" style="padding:7px 16px; border:1px solid #ddd; border-radius:5px; background:#f5f5f5; cursor:pointer;">取消</button>
                    <button onclick="window.submitNewEngineTemplate()" style="padding:7px 16px; border:none; border-radius:5px; background:#2980b9; color:#fff; cursor:pointer;">确认新增</button>
                </div>
            </div>
        </div>
    `;

    return html;
}

/**
 * 核心：点击左侧菜单，加载右侧配置界面 (智能双模式版)
 * @param {string} itemName 费用名称
 */
window.loadEngineConfig = function(itemName) {
    // 1. 高亮左侧菜单
    if (event && event.target) {
        document.querySelectorAll('.tree-node').forEach(el => el.classList.remove('active'));
        event.target.classList.add('active');
    }

    const categoryInfo = findEngineCategory(itemName);
    const isWriteOff = categoryInfo.category === "结算";
    const template = getEngineTemplate(itemName, categoryInfo);
    const subjectOptions = window.getEngineSubjectOptions();

    const amtTypeLabel = { gross: '含税全额', net: '不含税', tax: '税额(9%)' };
    const entryRowsHtml = (template.entries || []).map((entry, index) => {
        const curAmtType = entry.amountType || 'gross';
        return `
        <tr data-row-index="${index}">
            <td>
                <select class="engine-dir" style="width:100%; padding:6px;">
                    <option value="借" ${entry.dir === "借" ? "selected" : ""}>借</option>
                    <option value="贷" ${entry.dir === "贷" ? "selected" : ""}>贷</option>
                </select>
            </td>
            <td>
                <select class="engine-subject" style="width:100%; padding:6px;" ${entry.usePaymentMethod ? "disabled" : ""}>
                    <option value="" ${entry.subjectCode ? "" : "selected"}>请选择科目</option>
                    ${subjectOptions.map(subject => {
                        const value = `${subject.code}|||${subject.name}`;
                        const selected = subject.code === entry.subjectCode ? "selected" : "";
                        return `<option value="${value}" ${selected}>${subject.code} ${subject.name}</option>`;
                    }).join("")}
                </select>
            </td>
            <td>
                <select class="engine-amt-type" style="width:100%; padding:6px;">
                    <option value="gross" ${curAmtType === 'gross' ? 'selected' : ''}>含税全额</option>
                    <option value="net"   ${curAmtType === 'net'   ? 'selected' : ''}>不含税</option>
                    <option value="tax"   ${curAmtType === 'tax'   ? 'selected' : ''}>税额(9%)</option>
                </select>
            </td>
            <td><input class="engine-summary" type="text" value="${entry.summary || ""}" placeholder="摘要模板"></td>
            ${isWriteOff ? `<td style="text-align:center;"><input class="engine-pm" type="checkbox" ${entry.usePaymentMethod ? "checked" : ""} onchange="window.togglePaymentMethodSubject(this)"></td>` : ""}
            <td style="text-align:center;">
                <button class="btn-remove" onclick="window.removeEngineEntry('${itemName}', ${index})">删除</button>
            </td>
        </tr>
    `}).join("");

    const topTipHTML = isWriteOff
        ? `<div style="color:#c0392b; font-size:12px; line-height:1.6;">
             * 结算类凭证可选择从收支方式读取科目，挂帐类不允许。
           </div>`
        : `<div style="color:#2c3e50; font-size:12px; line-height:1.6;">
             * 请手动配置分录科目，系统将按模板生成凭证。
           </div>`;

    const rightHTML = `
        <div style="font-family: 'Segoe UI', sans-serif; color:#2c3e50;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <div>
                    <h2 style="margin:0; font-size:20px;">${itemName}</h2>
                    <div style="margin-top:6px; font-size:12px; color:#7f8c8d;">
                        分类：${categoryInfo.category} / ${categoryInfo.group}
                    </div>
                </div>
                <div style="font-size:12px; color:#95a5a6;">模板配置</div>
            </div>

            ${topTipHTML}

            <div style="margin-top:16px; display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div>
                    <label style="font-size:12px; color:#7f8c8d;">凭证字</label>
                    <select id="engine-voucher-word" style="width:100%; padding:8px; border:1px solid #dfe6e9; border-radius:6px;">
                        <option value="转" ${template.voucherWord === "转" ? "selected" : ""}>转</option>
                        <option value="收" ${template.voucherWord === "收" ? "selected" : ""}>收</option>
                        <option value="付" ${template.voucherWord === "付" ? "selected" : ""}>付</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:12px; color:#7f8c8d;">摘要模板</label>
                    <input id="engine-summary-template" type="text" value="${(template.summaryTemplate || '').replace(/"/g, '&quot;')}" placeholder="例如：{clientName}-{id}" style="width:100%; padding:8px; border:1px solid #dfe6e9; border-radius:6px; box-sizing:border-box;">
                </div>
            </div>

            <div style="margin-top:16px;">
                <label style="font-size:12px; color:#7f8c8d;">备注</label>
                <input id="engine-remark" type="text" value="${template.remark || ""}" placeholder="规则备注"
                    style="width:100%; padding:8px; border:1px solid #dfe6e9; border-radius:6px;">
            </div>

            <div style="margin-top:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="margin:0; font-size:16px;">分录配置</h3>
                    <button onclick="window.addEngineEntry('${itemName}')" style="padding:6px 12px; border:1px solid #3498db; color:#3498db; background:#fff; border-radius:6px; cursor:pointer;">+ 添加分录</button>
                </div>
                <table style="width:100%; border-collapse:collapse; margin-top:12px; font-size:13px;">
                    <thead>
                        <tr style="background:#f4f6f8; text-align:left;">
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">方向</th>
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">会计科目</th>
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">金额类型</th>
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">摘要</th>
                            ${isWriteOff ? `<th style="padding:8px; border-bottom:1px solid #e1e5ea;">收支方式</th>` : ""}
                            <th style="padding:8px; border-bottom:1px solid #e1e5ea;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="engine-entries-body">
                        ${entryRowsHtml || ""}
                    </tbody>
                </table>
            </div>

            <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
                <button onclick="window.resetEngineTemplate('${itemName}')" style="padding:6px 14px; border:1px solid #dcdde1; background:#f5f6fa; border-radius:6px; cursor:pointer;">清空科目</button>
                <button onclick="window.saveEngineTemplate('${itemName}', ${isWriteOff})" style="padding:6px 16px; border:none; background:#27ae60; color:#fff; border-radius:6px; cursor:pointer;">保存模板</button>
            </div>
        </div>
    `;

    // 5. 渲染
    const contentArea = document.getElementById('configPanel') || document.getElementById('engine-content-area');
    if (contentArea) {
        contentArea.style.display = 'block';
        contentArea.innerHTML = rightHTML;
        const emptyState = document.getElementById('emptyState');
        if(emptyState) emptyState.style.display = 'none';
        const titleEl = document.getElementById('currentScenarioTitle');
        if(titleEl) titleEl.innerText = itemName;
    }
};

window.toggleEngineCategory = function(categoryId) {
    const container = document.getElementById(categoryId);
    const icon = document.querySelector(`.engine-toggle-icon[data-target="${categoryId}"]`);
    if (!container) return;
    const isHidden = container.style.display === "none";
    container.style.display = isHidden ? "block" : "none";
    if (icon) icon.textContent = isHidden ? "▾" : "▸";
};

window.toggleEngineSubCategory = function(subId) {
    const container = document.getElementById(subId);
    const icon = document.querySelector(`.engine-toggle-icon[data-target="${subId}"]`);
    if (!container) return;
    const isHidden = container.style.display === "none";
    container.style.display = isHidden ? "block" : "none";
    if (icon) icon.textContent = isHidden ? "▾" : "▸";
};

window.getEngineSubjectOptions = function() {
    // 1. 读取用户已维护的科目（sessionStorage → localStorage）
    let stored = JSON.parse(sessionStorage.getItem("AcctSubjects") || "null");
    if (!stored) stored = JSON.parse(localStorage.getItem("AcctSubjects") || "null");

    // 2. 读取当前准则的模板科目作为基础
    const std = localStorage.getItem("AccountingStandard") || "enterprise";
    const tplList = (window.ACCOUNTING_STANDARD_TEMPLATES && window.ACCOUNTING_STANDARD_TEMPLATES[std]) || [];

    // 3. 合并：以用户维护的科目为主，模板科目补充不足（按 code 去重）
    const map = new Map();
    tplList.forEach(s => map.set(String(s.code), s));
    (stored || []).forEach(s => map.set(String(s.code), s));  // 用户数据覆盖模板

    const merged = Array.from(map.values()).filter(s => s.status !== "停用");
    merged.sort((a, b) => String(a.code).localeCompare(String(b.code)));

    if (!merged.length) {
        return [{ code: "", name: "暂无科目，请先维护会计科目" }];
    }
    return merged.map(s => ({ code: s.code || "", name: s.name || "" }));
};

window.addEngineEntry = function(itemName) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    template.entries.push({ dir: "借", subjectCode: "", subjectName: "", summary: "", amountType: "gross", usePaymentMethod: false });
    setEngineTemplate(itemName, template);
    window.loadEngineConfig(itemName);
};

window.togglePaymentMethodSubject = function(inputEl) {
    const row = inputEl && inputEl.closest ? inputEl.closest("tr") : null;
    if (!row) return;
    const subjectSelect = row.querySelector(".engine-subject");
    if (!subjectSelect) return;
    subjectSelect.disabled = !!inputEl.checked;
    if (inputEl.checked) {
        subjectSelect.value = "";
    }
};

window.removeEngineEntry = function(itemName, index) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    template.entries.splice(index, 1);
    setEngineTemplate(itemName, template);
    window.loadEngineConfig(itemName);
};

window.resetEngineTemplate = function(itemName) {
    const categoryInfo = findEngineCategory(itemName);
    const template = buildEmptyTemplate(itemName, categoryInfo);
    setEngineTemplate(itemName, template);
    window.loadEngineConfig(itemName);
};

window.saveEngineTemplate = function(itemName, isWriteOff) {
    const categoryInfo = findEngineCategory(itemName);
    const template = getEngineTemplate(itemName, categoryInfo);
    const rows = Array.from(document.querySelectorAll("#engine-entries-body tr"));
    if (rows.length === 0) {
        return alert("请至少配置一条分录。");
    }

    const entries = rows.map(row => {
        const subjectValue = row.querySelector(".engine-subject")?.value || "";
        const [subjectCode, subjectName] = subjectValue.split("|||");
        return {
            dir: row.querySelector(".engine-dir")?.value || "借",
            subjectCode: (subjectCode || "").trim(),
            subjectName: (subjectName || "").trim(),
            amountType: row.querySelector(".engine-amt-type")?.value || "gross",
            summary: row.querySelector(".engine-summary")?.value.trim() || "",
            usePaymentMethod: isWriteOff ? !!row.querySelector(".engine-pm")?.checked : false
        };
    });

    const invalidRow = entries.find(entry => !entry.usePaymentMethod && (!entry.subjectCode || !entry.subjectName));
    if (invalidRow) {
        return alert("科目代码和名称不能为空。");
    }

    template.voucherWord = document.getElementById("engine-voucher-word")?.value || "转";
    template.summaryTemplate = document.getElementById("engine-summary-template")?.value.trim() || "";
    template.remark = document.getElementById("engine-remark")?.value.trim() || "";
    template.entries = entries;
    setEngineTemplate(itemName, template);

    alert("✅ 模板已保存并生效。");
};

// ─── 新增模板 ────────────────────────────────────────────────────
window.showAddEngineModal = function() {
    const modal = document.getElementById('engine-add-modal');
    if (modal) {
        modal.style.display = 'block';
        const nameEl = document.getElementById('engine-new-name');
        if (nameEl) nameEl.value = '';
        const catEl = document.getElementById('engine-new-category');
        if (catEl) catEl.value = '';
        const grpEl = document.getElementById('engine-new-group');
        if (grpEl) grpEl.value = '';
    }
};

window.submitNewEngineTemplate = function() {
    const name = (document.getElementById('engine-new-name')?.value || '').trim();
    const category = (document.getElementById('engine-new-category')?.value || '').trim() || '自定义';
    const group = (document.getElementById('engine-new-group')?.value || '').trim() || '默认';

    if (!name) return alert('请填写模板名称。');

    const allItems = [];
    getAllTreeData().forEach(cat => (cat.children || []).forEach(sub => (sub.items || []).forEach(i => allItems.push(i))));
    if (allItems.includes(name)) return alert('该模板名称已存在，请换一个名称。');

    const data = loadCustomData();
    let cat = data.categories.find(c => c.name === category);
    if (!cat) {
        cat = { name: category, children: [] };
        data.categories.push(cat);
    }
    let grp = cat.children.find(g => g.name === group);
    if (!grp) {
        grp = { name: group, items: [] };
        cat.children.push(grp);
    }
    grp.items.push(name);
    saveCustomData(data);

    // 初始化一个空模板
    const categoryInfo = { category, group };
    const tpl = buildEmptyTemplate(name, categoryInfo);
    setEngineTemplate(name, tpl);

    document.getElementById('engine-add-modal').style.display = 'none';

    // 重新渲染左侧树
    const treeEl = document.getElementById('engineTreeContainer') || document.getElementById('engine-tree');
    if (treeEl) treeEl.innerHTML = renderEngineTree();

    // 自动打开新模板
    loadEngineConfig(name);
    alert(`✅ 模板「${name}」已新增，请配置分录后保存。`);
};

// ─── 重命名 ──────────────────────────────────────────────────────
window.renameEngineItem = function(originalName) {
    const currentDisplay = getDisplayName(originalName);
    const newName = prompt(`重命名模板「${currentDisplay}」：`, currentDisplay);
    if (!newName || newName.trim() === currentDisplay) return;
    const data = loadCustomData();
    if (!data.aliases) data.aliases = {};
    data.aliases[originalName] = newName.trim();
    saveCustomData(data);

    // 重新渲染左侧树
    const treeEl = document.getElementById('engineTreeContainer') || document.getElementById('engine-tree');
    if (treeEl) treeEl.innerHTML = renderEngineTree();
};

// ─── 删除自定义模板 ───────────────────────────────────────────────
window.deleteCustomEngineItem = function(itemName, categoryName) {
    const displayName = getDisplayName(itemName);
    if (!confirm(`确认删除自定义模板「${displayName}」吗？\n相关模板配置也将一并删除。`)) return;

    // 从自定义数据中移除
    const data = loadCustomData();
    (data.categories || []).forEach(cat => {
        if (cat.name !== categoryName) return;
        (cat.children || []).forEach(grp => {
            grp.items = (grp.items || []).filter(i => i !== itemName);
        });
    });
    // 清空空分组/分类
    data.categories = data.categories.map(cat => ({
        ...cat,
        children: (cat.children || []).filter(grp => grp.items && grp.items.length > 0)
    })).filter(cat => cat.children && cat.children.length > 0);
    if (data.aliases) delete data.aliases[itemName];
    saveCustomData(data);

    // 从模板存储中删除
    const store = loadEngineTemplateStore();
    delete store[itemName];
    saveEngineTemplateStore(store);

    // 重新渲染
    const treeEl = document.getElementById('engineTreeContainer') || document.getElementById('engine-tree');
    if (treeEl) treeEl.innerHTML = renderEngineTree();

    // 清空右侧面板
    const contentArea = document.getElementById('configPanel') || document.getElementById('engine-content-area');
    if (contentArea) contentArea.innerHTML = '<div style="padding:40px; color:#999; text-align:center;">请从左侧选择模板进行配置</div>';
};

// ─── 删除自定义分类 ───────────────────────────────────────────────
window.deleteCategoryEngine = function(categoryName) {
    if (!confirm(`确认删除整个分类「${categoryName}」及其所有模板吗？`)) return;
    const data = loadCustomData();
    data.categories = (data.categories || []).filter(c => c.name !== categoryName);
    saveCustomData(data);

    const treeEl = document.getElementById('engineTreeContainer') || document.getElementById('engine-tree');
    if (treeEl) treeEl.innerHTML = renderEngineTree();
};
