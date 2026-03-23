// js/core/modules/ops/view_waybill.js
// 运单结算模块
window.VM_MODULES = window.VM_MODULES || {};

// =========================================================================
// SettlementWaybill
// =========================================================================
window.VM_MODULES['SettlementWaybill'] = function(contentArea, contentHTML, moduleCode) {
	        // 1. 初始化数据
	        let waybills = JSON.parse(sessionStorage.getItem("BizWaybills"));

	        // 运单挂账表头字段
	        const accrualColumns = [
	            // ── 基本信息 ──
	            { key: "site",                  label: "网点" },
	            { key: "waybillNo",             label: "运单号",     filter: { id: "wb_f_waybillNos", placeholder: "支持批量搜索" } },
	            { key: "creator",          label: "客户名称" },
	            { key: "goodsNo",               label: "司机单号",   filter: { id: "wb_f_goodsNos", placeholder: "支持批量搜索" } },
	            { key: "createdAt",             label: "开单时间" },
	            { key: "loadAt",                label: "装车时间" },
	            { key: "unloadAt",              label: "卸车时间" },
	            { key: "finishAt",              label: "完成时间" },
	            // ── 路线 ──
	            { key: "originStation",         label: "发站" },
	            { key: "destinationStation",    label: "到站" },
	            { key: "routeLine",             label: "路由" },
	            // ── 货物 ──
	            { key: "chargeType",            label: "计费方式",   align: "center" },
	            { key: "goods",                 label: "货物品名" },
	            { key: "weightVolume",          label: "重量/体积" },
	            // ── 承运 ──
	            { key: "plate",                 label: "车牌号" },
	            { key: "driver",                label: "司机" },
	            // ── 人员 ──
	            { key: "shipper",               label: "发货人" },
	            { key: "consignee",             label: "收货人" },
	            // ── 状态 ──
	            { key: "waybillAccrualStatus",  label: "运单挂账状态", align: "center", filter: { id: "wb_f_waybill_status", type: "select", options: ["", "未挂账", "已挂账", "对账中", "已结算"] } },
	            // ── 费用 ──
	            { key: "cashPay",               label: "现付",       align: "right" },
	            { key: "cashPayAccrualStatus",  label: "现付状态",   align: "center" },
	            { key: "arrivePay",             label: "到付",       align: "right" },
	            { key: "arrivePayAccrualStatus",label: "到付状态",   align: "center" },
	            { key: "monthlyPay",            label: "月结",       align: "right" },
	            { key: "monthlyPayAccrualStatus",label: "月结状态",  align: "center" },
	            { key: "cashReturn",            label: "现返",       align: "right" },
	            { key: "cashReturnAccrualStatus",label: "现返状态",  align: "center" },
	            { key: "debtReturn",            label: "欠返",       align: "right" },
	            { key: "debtReturnAccrualStatus",label: "欠返状态",  align: "center" },
	            { key: "pickupFee",             label: "单票提货费", align: "right" },
	            // ── 税务 ──
	            { key: "taxRate",               label: "税率",       align: "center" },
	            { key: "taxAmount",             label: "税额",       align: "right" },
	            // ── 付款 ──
	            { key: "payStatus",             label: "付款状态",   align: "center" },
	            { key: "paidAmount",            label: "已付金额",   align: "right" },
	            { key: "paidAt",                label: "付款时间" },
	            // ── 其他 ──
	            { key: "remark",                label: "运单备注" },
	            { key: "invoiceStatus",         label: "开票状态",   align: "center" },
	        ];

	        const excelWaybills = [
                        {
                                    "seq": "1",
                                    "orderNo": "YD2601131639000125",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131639000227",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:39:23",
                                    "loadAt": "2026-01-13 18:00:25",
                                    "unloadAt": "2026-01-15 10:38:37",
                                    "finishAt": "2026-01-15 14:26:33",
                                    "freightAmount": "5300",
                                    "taxRate": "6%",
                                    "taxAmount": "338.3",
                                    "driver": "房毛斗/17280055706",
                                    "plate": "豫NN2450",
                                    "goodsPack": "配件/20托",
                                    "weightVolume": "32000.0/120.0",
                                    "chargeType": "按车计费",
                                    "origin": "江苏省 徐州市 铜山区 棠张镇 徐工玖行能源科技有限公司",
                                    "destination": "浙江省 金华市 义乌市 赤岸镇 工业园区18号",
                                    "paidAmount": "5300",
                                    "paidAt": "2026-01-15 17:33:43",
                        },
                        {
                                    "seq": "2",
                                    "orderNo": "YD2601131621000123",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131621000223",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:21:35",
                                    "loadAt": "2026-01-13 16:45:12",
                                    "unloadAt": "2026-01-14 13:42:05",
                                    "finishAt": "2026-01-14 13:45:45",
                                    "freightAmount": "2000",
                                    "taxRate": "6%",
                                    "taxAmount": "127.66",
                                    "driver": "平杰/18755497760",
                                    "plate": "皖CC9056",
                                    "goodsPack": "机械配件/18件",
                                    "weightVolume": "8000.0/18.0",
                                    "chargeType": "按吨计费",
                                    "origin": "安徽省 合肥市 包河区 骆岗街道 安徽卓基工业设备有限公司",
                                    "destination": "江苏省 无锡市 惠山区 玉祁街道 无锡市标准件厂有限公司",
                                    "paidAmount": "2000",
                                    "paidAt": "2026-01-14 17:41:07",
                        },
                        {
                                    "seq": "3",
                                    "orderNo": "YD2601131617000122",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131617000221",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:17:06",
                                    "loadAt": "2026-01-13 16:40:35",
                                    "unloadAt": "2026-01-14 11:52:22",
                                    "finishAt": "2026-01-15 09:57:53",
                                    "freightAmount": "3000",
                                    "taxRate": "6%",
                                    "taxAmount": "191.49",
                                    "driver": "李春阳/18019838831",
                                    "plate": "皖M4C508",
                                    "goodsPack": "饮品/2400件",
                                    "weightVolume": "33.2/0.001",
                                    "chargeType": "按件计费",
                                    "origin": "安徽省 滁州市 天长市 经济开发区 今麦郎饮品(天长)有限公司",
                                    "destination": "江苏省 南京市 浦口区 商贸物流园 倍乐生商贸公司物流中心",
                                    "paidAmount": "3000",
                                    "paidAt": "2026-01-15 15:15:05",
                        },
                        {
                                    "seq": "4",
                                    "orderNo": "YD2601131616000121",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131616000219",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 16:16:03",
                                    "loadAt": "2026-01-13 20:44:32",
                                    "unloadAt": "2026-01-14 13:18:51",
                                    "finishAt": "2026-01-15 09:58:13",
                                    "freightAmount": "2100",
                                    "taxRate": "6%",
                                    "taxAmount": "134.04",
                                    "driver": "杨兆拍/17351883288",
                                    "plate": "苏BY7552",
                                    "goodsPack": "饮品/2400件",
                                    "weightVolume": "33.2/0.001",
                                    "chargeType": "按件计费",
                                    "origin": "安徽省 滁州市 天长市 经济开发区 今麦郎饮品(天长)有限公司",
                                    "destination": "江苏省 无锡市 江阴市 长泾镇 华阳物流园2号库",
                                    "paidAmount": "2100",
                                    "paidAt": "2026-01-15 15:15:06",
                        },
                        {
                                    "seq": "5",
                                    "orderNo": "YD2601131536000117",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131536000211",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 15:36:07",
                                    "loadAt": "2026-01-13 19:10:40",
                                    "unloadAt": "2026-01-14 14:31:53",
                                    "finishAt": "2026-01-16 14:12:00",
                                    "freightAmount": "2000",
                                    "taxRate": "6%",
                                    "taxAmount": "127.66",
                                    "driver": "蔡银刚/18119566359",
                                    "plate": "皖LE8339",
                                    "goodsPack": "家用电器/500件",
                                    "weightVolume": "12000.0/60.0",
                                    "chargeType": "按方计费",
                                    "origin": "安徽省 合肥市 长丰县 岗集镇 合淮路8号中国南山·合肥智慧物流港",
                                    "destination": "江苏省 苏州市 常熟市 东南街道 人和路10号常熟宥望电商智能交付中心",
                                    "paidAmount": "2000",
                                    "paidAt": "2026-01-16 17:28:37",
                        },
                        {
                                    "seq": "6",
                                    "orderNo": "YD2601131535000116",
                                    "creator": "朱树伟/18905693469/合肥诚才物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131535000209",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 15:35:13",
                                    "loadAt": "2026-01-13 19:29:51",
                                    "unloadAt": "2026-01-14 10:03:35",
                                    "finishAt": "2026-01-16 14:12:11",
                                    "freightAmount": "1300",
                                    "taxRate": "6%",
                                    "taxAmount": "82.98",
                                    "driver": "杨占杰/13913942613",
                                    "plate": "苏AF6661",
                                    "goodsPack": "家用电器/500件",
                                    "weightVolume": "12000.0/60.0",
                                    "chargeType": "按方计费",
                                    "origin": "安徽省 合肥市 长丰县 岗集镇 合淮路8号中国南山·合肥智慧物流港",
                                    "destination": "江苏省 南京市 栖霞区 龙潭街道 港城路2号蔚然(南京)动力科技有限公司",
                                    "paidAmount": "1300",
                                    "paidAt": "2026-01-16 17:28:44",
                        },
                        {
                                    "seq": "8",
                                    "orderNo": "YD2601131456000114",
                                    "creator": "王翠娟/18013266866/昆山江南达物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131456000203",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:56:06",
                                    "loadAt": "2026-01-13 17:48:31",
                                    "unloadAt": "2026-01-15 14:00:07",
                                    "finishAt": "2026-01-15 14:16:03",
                                    "freightAmount": "6750",
                                    "taxRate": "6%",
                                    "taxAmount": "430.85",
                                    "driver": "潘庆和/13206345218",
                                    "plate": "鲁AT2888",
                                    "goodsPack": "电子产品/60件",
                                    "weightVolume": "28000.0/0.001",
                                    "chargeType": "按吨计费",
                                    "origin": "四川省 德阳市 旌阳区 京昆高速南服务区(北京方向) 225号",
                                    "destination": "安徽省 铜陵市 铜陵经济技术开发区 金瑞玻纤路288号 安徽金瑞玻纤厂",
                                    "paidAmount": "6750",
                                    "paidAt": "2026-01-15 17:33:13",
                        },
                        {
                                    "seq": "9",
                                    "orderNo": "YD2601131432000111",
                                    "creator": "张延辉/18705157801/江苏速淳物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131432000197",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:32:28",
                                    "loadAt": "2026-01-14 09:12:21",
                                    "unloadAt": "2026-01-15 16:51:12",
                                    "finishAt": "2026-01-16 14:00:42",
                                    "freightAmount": "6650",
                                    "taxRate": "6%",
                                    "taxAmount": "424.47",
                                    "driver": "孔令松/15327502779",
                                    "plate": "鄂H06D10",
                                    "goodsPack": "化肥/整车",
                                    "weightVolume": "28000.0/90.0",
                                    "chargeType": "按车计费",
                                    "origin": "湖北省 荆门市 钟祥市 工业园区 湖北凯龙楚兴化工集团有限公司",
                                    "destination": "浙江省 金华市 金东区 多湖街道 金华瑞尔生物科技有限公司",
                                    "paidAmount": "6650",
                                    "paidAt": "2026-01-16 17:28:48",
                        },
                        {
                                    "seq": "10",
                                    "orderNo": "YD2601131419000109",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131419000193",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:19:17",
                                    "loadAt": "2026-01-13 14:28:51",
                                    "unloadAt": "2026-01-14 10:12:28",
                                    "finishAt": "2026-01-14 12:39:48",
                                    "freightAmount": "1800",
                                    "taxRate": "6%",
                                    "taxAmount": "114.89",
                                    "driver": "王元敏/15056735592",
                                    "plate": "皖LD0889",
                                    "goodsPack": "木托盘/750件",
                                    "weightVolume": "27.0/160.0",
                                    "chargeType": "按方计费",
                                    "origin": "江苏省 常州市 武进区 南夏墅工业区 常州市杰隆工具有限公司",
                                    "destination": "安徽省 合肥市 肥东县 店埠镇 远洋物流四期肥东物流园",
                                    "paidAmount": "1800",
                                    "paidAt": "2026-01-14 17:41:21",
                        },
                        {
                                    "seq": "11",
                                    "orderNo": "YD2601131406000105",
                                    "creator": "胥智芳/17805133633/南京笨鸟物流有限责任公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131406000185",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:06:24",
                                    "loadAt": "2026-01-13 17:38:59",
                                    "unloadAt": "2026-01-14 15:50:57",
                                    "finishAt": "2026-01-14 19:24:01",
                                    "freightAmount": "2000",
                                    "taxRate": "6.3%",
                                    "taxAmount": "134.47",
                                    "driver": "闫爱斌/15562668016",
                                    "plate": "鲁AU6678",
                                    "goodsPack": "消泡剂/28桶",
                                    "weightVolume": "28000.0/40.0",
                                    "chargeType": "按吨计费",
                                    "origin": "江苏省 扬州市 仪征市 化工园区 仪征冠宏化工研究有限公司",
                                    "destination": "山东省 济南市 历城区 港沟街道 济南圣泉环保科技有限公司",
                                    "paidAmount": "2000",
                                    "paidAt": "2026-01-15 15:15:07",
                        },
                        {
                                    "seq": "12",
                                    "orderNo": "YD2601131400000102",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131400000179",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 14:00:42",
                                    "loadAt": "2026-01-13 15:17:24",
                                    "unloadAt": "2026-01-14 16:40:23",
                                    "finishAt": "2026-01-15 09:40:52",
                                    "freightAmount": "3500",
                                    "taxRate": "6%",
                                    "taxAmount": "223.4",
                                    "driver": "谢永化/13979421476",
                                    "plate": "赣FF1760",
                                    "goodsPack": "生物制品/20托",
                                    "weightVolume": "32000.0/120.0",
                                    "chargeType": "按车计费",
                                    "origin": "江西省 吉安市 吉安县 工业园区 江西翼邦生物技术有限公司",
                                    "destination": "广东省 揭阳市 揭阳高新技术产业开发区 空港经济区物流中心",
                                    "paidAmount": "3500",
                                    "paidAt": "2026-01-15 15:15:13",
                        },
                        {
                                    "seq": "13",
                                    "orderNo": "YD2601131357000101",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131357000177",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:57:20",
                                    "loadAt": "2026-01-13 14:02:26",
                                    "unloadAt": "2026-01-13 20:09:40",
                                    "finishAt": "2026-01-14 12:40:04",
                                    "freightAmount": "1800",
                                    "taxRate": "6%",
                                    "taxAmount": "114.89",
                                    "driver": "邓二斯麻乃/15809306991",
                                    "plate": "甘N74881",
                                    "goodsPack": "木托盘/750件",
                                    "weightVolume": "27.0/160.0",
                                    "chargeType": "按方计费",
                                    "origin": "江苏省 常州市 新北区 春江镇 蒲田农场工业园区",
                                    "destination": "安徽省 合肥市 肥东县 店埠镇 远洋物流四期肥东物流园",
                                    "paidAmount": "1800",
                                    "paidAt": "2026-01-14 17:41:23",
                        },
                        {
                                    "seq": "14",
                                    "orderNo": "YD2601131329000094",
                                    "creator": "吴红国/13856606515/池州市姚街老屋运输有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131329000161",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:29:59",
                                    "loadAt": "2026-01-13 13:48:07",
                                    "unloadAt": "2026-01-16 10:11:12",
                                    "finishAt": "2026-01-16 12:44:52",
                                    "freightAmount": "13500",
                                    "taxRate": "6%",
                                    "taxAmount": "861.7",
                                    "driver": "翁伟/15838622789",
                                    "plate": "豫PR9151",
                                    "goodsPack": "海绵卷/135卷",
                                    "weightVolume": "4.8/138.0",
                                    "chargeType": "按方计费",
                                    "origin": "安徽省 合肥市 庐江县 白湖工业区 安徽财纳伽善科技有限公司",
                                    "destination": "广西壮族自治区 桂林市 平乐县 平乐镇 广西中投木业有限责任公司",
                                    "paidAmount": "13500",
                                    "paidAt": "2026-01-16 17:28:53",
                        },
                        {
                                    "seq": "15",
                                    "orderNo": "YD2601131327000092",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131327000159",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:27:04",
                                    "loadAt": "2026-01-13 15:42:37",
                                    "unloadAt": "2026-01-14 12:54:17",
                                    "finishAt": "2026-01-14 21:12:38",
                                    "freightAmount": "1700",
                                    "taxRate": "6%",
                                    "taxAmount": "108.51",
                                    "driver": "徐长奎/15020105580",
                                    "plate": "鲁RV5528",
                                    "goodsPack": "机械配件/18件",
                                    "weightVolume": "10000.0/25.0",
                                    "chargeType": "按吨计费",
                                    "origin": "江苏省 南通市 海安市 工业园区 江苏新众亚智能物流装备制造有限公司",
                                    "destination": "江苏省 南通市 如皋市 长江镇 江苏天成科技集团饲料有限公司",
                                    "paidAmount": "1700",
                                    "paidAt": "2026-01-15 15:16:05",
                        },
                        {
                                    "seq": "16",
                                    "orderNo": "YD2601131324000091",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131324000157",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:24:12",
                                    "loadAt": "2026-01-13 13:26:38",
                                    "unloadAt": "2026-01-14 09:35:52",
                                    "finishAt": "2026-01-14 12:40:22",
                                    "freightAmount": "4500",
                                    "taxRate": "6%",
                                    "taxAmount": "287.23",
                                    "driver": "岳喜友/15855098070",
                                    "plate": "皖M97863",
                                    "goodsPack": "托盘纸/500件",
                                    "weightVolume": "20.0/160.0",
                                    "chargeType": "按方计费",
                                    "origin": "安徽省 合肥市 经济技术开发区 翠庭路 安徽永盛印务科技有限公司南门",
                                    "destination": "安徽省 合肥市 包河区 金寨南路 中国邮政速递合肥转运中心",
                                    "paidAmount": "4500",
                                    "paidAt": "2026-01-14 17:41:27",
                        },
                        {
                                    "seq": "17",
                                    "orderNo": "YD2601131323000090",
                                    "creator": "胥智芳/17805133633/南京笨鸟物流有限责任公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131323000155",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 13:23:48",
                                    "loadAt": "2026-01-13 17:21:38",
                                    "unloadAt": "2026-01-14 10:38:29",
                                    "finishAt": "2026-01-14 11:08:03",
                                    "freightAmount": "1250",
                                    "taxRate": "6.3%",
                                    "taxAmount": "84.04",
                                    "driver": "曹新山/18265821116",
                                    "plate": "鲁RJ5015",
                                    "goodsPack": "消泡剂/28桶",
                                    "weightVolume": "28000.0/75.0",
                                    "chargeType": "按吨计费",
                                    "origin": "江苏省 南京市 栖霞区 经济开发区 江苏巴德聚氨酯股份有限公司",
                                    "destination": "江苏省 扬州市 仪征市 化工园区 仪征冠宏化工研究有限公司",
                                    "paidAmount": "1250",
                                    "paidAt": "2026-01-14 17:41:35",
                        },
                        {
                                    "seq": "18",
                                    "orderNo": "YD2601131236000086",
                                    "creator": "朱树伟/18905693469/合肥诚才物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131236000149",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 12:36:25",
                                    "loadAt": "2026-01-13 18:38:06",
                                    "unloadAt": "2026-01-14 09:34:12",
                                    "finishAt": "2026-01-16 14:11:22",
                                    "freightAmount": "2200",
                                    "taxRate": "6%",
                                    "taxAmount": "140.43",
                                    "driver": "付成勇/13856999596",
                                    "plate": "皖AC1306",
                                    "goodsPack": "家用电器/1000件",
                                    "weightVolume": "30.0/130.0",
                                    "chargeType": "按方计费",
                                    "origin": "安徽省 合肥市 肥西县 桃花工业园 美的安得物流安得智联皖北分公司",
                                    "destination": "江苏省 南京市 栖霞区 龙潭街道 港城路2号蔚然(南京)动力科技有限公司",
                                    "paidAmount": "2200",
                                    "paidAt": "2026-01-16 17:28:54",
                        },
                        {
                                    "seq": "19",
                                    "orderNo": "YD2601131217000084",
                                    "creator": "董长于/15212085999/天长市乐运物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131217000145",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 12:17:32",
                                    "loadAt": "2026-01-13 14:08:47",
                                    "unloadAt": "2026-01-14 02:43:53",
                                    "finishAt": "2026-01-14 11:51:35",
                                    "freightAmount": "3300",
                                    "taxRate": "6%",
                                    "taxAmount": "210.64",
                                    "driver": "王翔/18455058005",
                                    "plate": "苏A4B002",
                                    "goodsPack": "文具配件/1668件",
                                    "weightVolume": "8000.0/53.0",
                                    "chargeType": "按件计费",
                                    "origin": "安徽省 滁州市 天长市 开发区 天长市嘉丰美术用品有限公司",
                                    "destination": "上海市 浦东新区 外高桥保税区 上海剑成供应链科技有限公司",
                                    "paidAmount": "3300",
                                    "paidAt": "2026-01-14 17:41:37",
                        },
                        {
                                    "seq": "20",
                                    "orderNo": "YD2601131202000081",
                                    "creator": "张晓东/15385019101/安徽滁行物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601131202000139",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-13 12:02:17",
                                    "loadAt": "2026-01-13 12:47:45",
                                    "unloadAt": "2026-01-14 16:52:21",
                                    "finishAt": "2026-01-15 15:15:53",
                                    "freightAmount": "3200",
                                    "taxRate": "6%",
                                    "taxAmount": "204.26",
                                    "driver": "曹子柱/13634400808",
                                    "plate": "黑ACM678",
                                    "goodsPack": "木托盘/750件",
                                    "weightVolume": "27.0/160.0",
                                    "chargeType": "按方计费",
                                    "origin": "辽宁省 沈阳市 于洪区 于洪工业区 沈阳惠众环通包装股份有限公司",
                                    "destination": "黑龙江省 哈尔滨市 道里区 工业大道 予智(哈尔滨)供应链管理有限公司",
                                    "paidAmount": "3200",
                                    "paidAt": "2026-01-15 17:34:24",
                        },
                        {
                                    "seq": "21",
                                    "orderNo": "YD2601151024000090",
                                    "creator": "陈萍/13914450625/南京联畅物流股份有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601151024000157",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 10:24:55",
                                    "loadAt": "2026-01-15 10:55:32",
                                    "unloadAt": "2026-01-16 12:59:17",
                                    "finishAt": "2026-01-16 16:14:29",
                                    "freightAmount": "4700",
                                    "taxRate": "6%",
                                    "taxAmount": "300",
                                    "driver": "王广战/18751601622",
                                    "plate": "苏CPG169",
                                    "goodsPack": "电力电缆/10盘",
                                    "weightVolume": "28000.0/70.0",
                                    "chargeType": "按吨计费",
                                    "origin": "江苏省 扬州市 江都区 真武镇 江苏江扬电缆有限公司",
                                    "destination": "安徽省 合肥市 新站综合开发试验区 创园大道物流园区",
                                    "paidAmount": "4700",
                                    "paidAt": "2026-01-16 17:23:54",
                        },
                        {
                                    "seq": "22",
                                    "orderNo": "YD2601151010000087",
                                    "creator": "黄光辉/15016793637/怀化飞鸿物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601151010000153",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 10:10:48",
                                    "loadAt": "2026-01-16 11:42:21",
                                    "unloadAt": "2026-01-17 15:02:27",
                                    "finishAt": "2026-01-17 15:52:53",
                                    "freightAmount": "5075",
                                    "taxRate": "6.5%",
                                    "taxAmount": "352.81",
                                    "driver": "罗香颖/18977821852",
                                    "plate": "桂MF2892",
                                    "goodsPack": "三聚磷酸钠/整车",
                                    "weightVolume": "35000.0/80.0",
                                    "chargeType": "按车计费",
                                    "origin": "广西壮族自治区 来宾市 兴宾区 六塘镇 六塘工业园兴发化工厂",
                                    "destination": "广东省 东莞市 南城区 宏远路 东莞市嘉吉实业有限公司",
                                    "paidAmount": "5075",
                                    "paidAt": "2026-01-17 17:50:26",
                        },
                        {
                                    "seq": "23",
                                    "orderNo": "YD2601150959000082",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150959000143",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:59:13",
                                    "loadAt": "2026-01-15 10:17:44",
                                    "unloadAt": "2026-01-16 11:40:05",
                                    "finishAt": "2026-01-17 13:44:04",
                                    "freightAmount": "5000",
                                    "taxRate": "6%",
                                    "taxAmount": "319.15",
                                    "driver": "王成强/13921777996",
                                    "plate": "苏CV3966",
                                    "goodsPack": "配件/20托",
                                    "weightVolume": "32000.0/120.0",
                                    "chargeType": "按车计费",
                                    "origin": "江苏省 徐州市 铜山区 棠张镇 徐工玖行能源科技有限公司",
                                    "destination": "浙江省 金华市 义乌市 赤岸镇 工业园区18号",
                                    "paidAmount": "5000",
                                    "paidAt": "2026-01-17 17:50:27",
                        },
                        {
                                    "seq": "24",
                                    "orderNo": "YD2601150958000081",
                                    "creator": "余风华/13337717906/镇江天地沃华物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150958000141",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:58:33",
                                    "loadAt": "2026-01-15 10:24:34",
                                    "unloadAt": "2026-01-17 10:42:24",
                                    "finishAt": "2026-01-17 13:43:47",
                                    "freightAmount": "11500",
                                    "taxRate": "6%",
                                    "taxAmount": "734.04",
                                    "driver": "周生/18566580964",
                                    "plate": "渝DB9836",
                                    "goodsPack": "配件/20托",
                                    "weightVolume": "32000.0/120.0",
                                    "chargeType": "按车计费",
                                    "origin": "四川省 德阳市 旌阳区 经济开发区 德阳欣旺达新能源有限公司",
                                    "destination": "广东省 深圳市 龙华区 清湖街道 飞毛腿园区6号楼丰巢快递柜",
                                    "paidAmount": "11500",
                                    "paidAt": "2026-01-17 17:50:32",
                        },
                        {
                                    "seq": "25",
                                    "orderNo": "YD2601150954000080",
                                    "creator": "陈萍/13914450625/南京联畅物流股份有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150954000139",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:54:35",
                                    "loadAt": "2026-01-15 10:06:16",
                                    "unloadAt": "2026-01-16 14:07:52",
                                    "finishAt": "2026-01-16 16:14:43",
                                    "freightAmount": "4700",
                                    "taxRate": "6%",
                                    "taxAmount": "300",
                                    "driver": "刘庆昌/13585382618",
                                    "plate": "苏CLD796",
                                    "goodsPack": "电力电缆/10盘",
                                    "weightVolume": "28000.0/70.0",
                                    "chargeType": "按吨计费",
                                    "origin": "江苏省 扬州市 江都区 真武镇 江苏江扬电缆有限公司",
                                    "destination": "安徽省 合肥市 新站综合开发试验区 创园大道物流园区",
                                    "paidAmount": "4700",
                                    "paidAt": "2026-01-16 17:23:55",
                        },
                        {
                                    "seq": "26",
                                    "orderNo": "YD2601150929000059",
                                    "creator": "杨贵洲/18651837187/镇江市贵邦物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150929000101",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:29:54",
                                    "loadAt": "2026-01-15 17:06:46",
                                    "unloadAt": "2026-01-16 10:16:11",
                                    "finishAt": "2026-01-16 10:16:48",
                                    "freightAmount": "4000",
                                    "taxRate": "6%",
                                    "taxAmount": "255.32",
                                    "driver": "周玉清/13235347968",
                                    "plate": "鲁NE3553",
                                    "goodsPack": "工业品/6000件",
                                    "weightVolume": "28000.0/150.0",
                                    "chargeType": "按方计费",
                                    "origin": "江苏省 苏州市 昆山市 开发区 科冠工业集团有限公司",
                                    "destination": "山东省 济南市 历城区 仙台街道 山东欧曼汽车环保科技有限公司",
                                    "paidAmount": "4000",
                                    "paidAt": "2026-01-16 17:17:35",
                        },
                        {
                                    "seq": "27",
                                    "orderNo": "YD2601150927000056",
                                    "creator": "焦大海/18018079866/南京浦鹏物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150927000099",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:27:15",
                                    "loadAt": "2026-01-15 10:57:18",
                                    "unloadAt": "2026-01-15 14:14:06",
                                    "finishAt": "2026-01-15 17:38:37",
                                    "freightAmount": "500",
                                    "taxRate": "6%",
                                    "taxAmount": "31.91",
                                    "driver": "王东/19855005951",
                                    "plate": "苏AE2028",
                                    "goodsPack": "机械配件/12件",
                                    "weightVolume": "8000.0/25.0",
                                    "chargeType": "按吨计费",
                                    "origin": "安徽省 合肥市 包河区 骆岗街道 安徽卓基工业设备有限公司",
                                    "destination": "江苏省 南京市 江宁区 滨江开发区 南京布雷博制动系统有限公司",
                                    "paidAmount": "500",
                                    "paidAt": "2026-01-16 11:07:10",
                        },
                        {
                                    "seq": "28",
                                    "orderNo": "YD2601150923000052",
                                    "creator": "黄光辉/15016793637/怀化飞鸿物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150923000095",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:23:05",
                                    "loadAt": "2026-01-15 11:45:59",
                                    "unloadAt": "2026-01-16 20:54:38",
                                    "finishAt": "2026-01-16 21:03:20",
                                    "freightAmount": "4930",
                                    "taxRate": "6.5%",
                                    "taxAmount": "342.73",
                                    "driver": "韦远锋/13737952533",
                                    "plate": "桂BL0969",
                                    "goodsPack": "三聚磷酸钠/整车",
                                    "weightVolume": "35000.0/80.0",
                                    "chargeType": "按车计费",
                                    "origin": "广西壮族自治区 来宾市 兴宾区 六塘镇 六塘工业园兴发化工厂",
                                    "destination": "广东省 东莞市 南城区 宏远路 东莞市嘉吉实业有限公司",
                                    "paidAmount": "4930",
                                    "paidAt": "2026-01-17 17:50:29",
                        },
                        {
                                    "seq": "29",
                                    "orderNo": "YD2601150920000050",
                                    "creator": "吴红国/13856606515/池州市姚街老屋运输有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150920000093",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 09:20:36",
                                    "loadAt": "2026-01-15 19:56:10",
                                    "unloadAt": "2026-01-16 13:31:38",
                                    "finishAt": "2026-01-16 15:30:13",
                                    "freightAmount": "5200",
                                    "taxRate": "6%",
                                    "taxAmount": "331.91",
                                    "driver": "权良波/19965556276",
                                    "plate": "皖N73639",
                                    "goodsPack": "海绵卷/135卷",
                                    "weightVolume": "4.8/138.0",
                                    "chargeType": "按方计费",
                                    "origin": "安徽省 合肥市 庐江县 白湖工业区 安徽财纳伽善科技有限公司",
                                    "destination": "浙江省 温州市 龙湾区 永中街道 温州正森环保科技有限公司",
                                    "paidAmount": "5200",
                                    "paidAt": "2026-01-16 17:24:20",
                        },
                        {
                                    "seq": "30",
                                    "orderNo": "YD2601150851000025",
                                    "creator": "张延辉/18705157801/江苏速淳物流有限公司",
                                    "auditInfo": "已到账",
                                    "payStatus": "已到账",
                                    "creatorRole": "货主",
                                    "driverOrderNo": "SJ2601150851000047",
                                    "driverOrderStatus": "已完成",
                                    "payConfirm": "已确认",
                                    "createdAt": "2026-01-15 08:51:29",
                                    "loadAt": "2026-01-15 11:51:40",
                                    "unloadAt": "2026-01-16 10:35:58",
                                    "finishAt": "2026-01-16 14:01:50",
                                    "freightAmount": "2100",
                                    "taxRate": "6%",
                                    "taxAmount": "134.04",
                                    "driver": "张顺民/15056111618",
                                    "plate": "皖M7B225",
                                    "goodsPack": "化肥/整车",
                                    "weightVolume": "28000.0/90.0",
                                    "chargeType": "按车计费",
                                    "origin": "安徽省 合肥市 经济技术开发区 柏堰科技园 锦泰生物科技(安徽)有限公司",
                                    "destination": "江苏省 盐城市 射阳县 临海镇 江苏福齐天生物科技有限公司",
                                    "paidAmount": "2100",
                                    "paidAt": "2026-01-16 17:24:19",
                        },
            ];

        // 强制重置数据以显示乐享模板字段
        const shouldResetWaybills =
            !waybills ||
            !waybills.length ||
            !waybills[0].orderNo ||
            waybills.length !== excelWaybills.length ||
            waybills[0].orderNo !== excelWaybills[0].orderNo;

        if (shouldResetWaybills) {
            waybills = excelWaybills.map((row, index) => {
                const status = "未挂帐";
                const totalAmount = row.freightAmount || row.paidAmount || "0";
                const bizDate = row.createdAt ? row.createdAt.slice(0, 10) : "";
                return {
                    id: row.orderNo,
                    client: row.creator,
                    bizDate,
                    route: `${row.origin} -> ${row.destination}`,
                    goods: row.goodsPack,
                    weight: row.weightVolume,
                    totalAmount,
                    status,
                    details: {},
                    reconId: "",
                    ...row,
                };
            });
            sessionStorage.setItem("BizWaybills", JSON.stringify(waybills));
            sessionStorage.setItem("WaybillPendingReset", "1");
        } else if (!sessionStorage.getItem("WaybillPendingReset") && waybills && waybills.length) {
            waybills = waybills.map((item) => ({
                ...item,
                status: "未挂帐",
                reconId: "",
            }));
            sessionStorage.setItem("BizWaybills", JSON.stringify(waybills));
            sessionStorage.setItem("WaybillPendingReset", "1");
        }

        // 兼容旧状态（待结算/已结算） -> 未挂帐/已挂帐
        if (waybills && waybills.length) {
            let statusChanged = false;
            waybills = waybills.map((item) => {
                let status = item.status;
                if (status === "待结算") {
                    status = "未挂帐";
                    statusChanged = true;
                } else if (status === "已结算") {
                    status = "已挂帐";
                    statusChanged = true;
                }
                return { ...item, status };
            });
            if (statusChanged) {
                sessionStorage.setItem("BizWaybills", JSON.stringify(waybills));
            }
        }

        if (!window.settlementWaybillSetPage) {
            window.settlementWaybillSetPage = function (page) {
                window._settlementWaybillPage = page;
                loadContent("SettlementWaybill");
            };
        }

	        if (!window.settlementWaybillSetPageSize) {
	            window.settlementWaybillSetPageSize = function (size) {
	                window._settlementWaybillPageSize = Number(size) || 10;
	                window._settlementWaybillPage = 1;
	                loadContent("SettlementWaybill");
	            };
	        }

	        if (!window.settlementWaybillApplyFilters) {
	            window.settlementWaybillApplyFilters = function () {
	                const getVal = (id) => {
	                    const el = document.getElementById(id);
	                    return el ? (el.value || "").toString().trim() : "";
	                };
	                window._settlementWaybillFilters = {
	                    site: getVal("wb_q_site"),
	                    dateStart: getVal("wb_q_date_start"),
	                    dateEnd: getVal("wb_q_date_end"),
	                    route: getVal("wb_q_route"),
	                    origin: getVal("wb_q_origin"),
	                    destination: getVal("wb_q_dest"),
	                    waybillNos: getVal("wb_f_waybillNos"),
	                    goodsNos: getVal("wb_f_goodsNos"),
	                    status: getVal("wb_f_waybill_status"),
	                };
	                window._settlementWaybillPage = 1;
	                loadContent("SettlementWaybill");
	            };
	        }

	        if (!window.settlementWaybillResetFilters) {
	            window.settlementWaybillResetFilters = function () {
	                window._settlementWaybillFilters = {};
	                window._settlementWaybillPage = 1;
	                loadContent("SettlementWaybill");
	            };
	        }

	        if (!window.settlementWaybillExport) {
	            window.settlementWaybillExport = function () {
	                const cols = window._settlementWaybillExportColumns || [];
	                const data = window._settlementWaybillExportData || [];
	                if (!cols.length) return alert("未找到可导出的列。");
	                const escapeCsv = (val) => {
	                    const s = (val ?? "").toString();
	                    if (/[\",\\n\\r]/.test(s)) return `\"${s.replace(/\"/g, '\"\"')}\"`;
	                    return s;
	                };
	                const lines = [];
	                lines.push(cols.map((c) => escapeCsv(c.label)).join(","));
	                data.forEach((row) => {
	                    lines.push(cols.map((c) => escapeCsv(row[c.key] ?? "")).join(","));
	                });
	                const blob = new Blob([lines.join("\\n")], { type: "text/csv;charset=utf-8" });
	                const a = document.createElement("a");
	                const url = URL.createObjectURL(blob);
	                a.href = url;
	                a.download = `运单挂账_${new Date().toISOString().slice(0, 10)}.csv`;
	                document.body.appendChild(a);
	                a.click();
	                a.remove();
	                setTimeout(() => URL.revokeObjectURL(url), 500);
	            };
	        }

	        if (!window.settlementWaybillPrint) {
	            window.settlementWaybillPrint = function () {
	                window.print();
	            };
	        }

        if (!window.settlementWaybillToolbarSettle) {
            window.settlementWaybillToolbarSettle = function () {
                const checked = Array.from(document.querySelectorAll(".wb-check:checked"));
                if (!checked.length) return alert("请先勾选需要挂账的运单。");
                const ids = checked.map(cb => cb.value);
                if (typeof window.batchSettleWaybills === "function") {
                    window.batchSettleWaybills(ids);
                } else {
                    alert("未找到挂账逻辑 (batchSettleWaybills)。");
                }
            };
        }

        if (!window.settlementWaybillToolbarCancel) {
            window.settlementWaybillToolbarCancel = function () {
                const checked = Array.from(document.querySelectorAll(".wb-check:checked"));
                if (!checked.length) return alert("请先勾选需要取消挂账的运单。");
                const ids = checked.map(cb => cb.value);
                if (typeof window.batchCancelWaybills === "function") {
                    window.batchCancelWaybills(ids);
                } else {
                    alert("未找到取消挂账逻辑 (batchCancelWaybills)。");
                }
            };
        }

        if (!window.settlementWaybillCreateRecon) {
            window.settlementWaybillCreateRecon = function () {
                const checked = Array.from(document.querySelectorAll(".wb-check:checked"));
                if (!checked.length) return alert("请先勾选需要发起对账的运单。");

                // 读取运单数据
                let waybills = JSON.parse(sessionStorage.getItem("BizWaybills")) || [];
                const checkedIds = new Set(checked.map(cb => cb.value));

                // 检查是否有运单已存在有效对账单（非已取消）
                const alreadyInRecon = waybills.filter(w => checkedIds.has(w.id) && w.reconId && w.reconId !== '');
                if (alreadyInRecon.length > 0) {
                    const ids = alreadyInRecon.map(w => w.id).join('、');
                    return alert(`⚠️ 不可重复生成对账单！\n以下运单已存在对账单，请勿重复操作：\n${ids}\n\n如需重新对账，请先在【客户对账】页面取消原对账单。`);
                }

                // 过滤已挂帐且未对账的运单
                const toRecon = waybills.filter(w => checkedIds.has(w.id) && (w.status === '已挂帐' || w.status === '已挂账'));
                if (!toRecon.length) return alert('勾选的运单中没有状态为【已挂帐】的运单，请先执行挂账操作。');

                // 按客户分组（提取公司名，格式可能是"姓名/手机/公司名"）
                const extractClient = (w) => {
                    const raw = w.client || w.consignee || w.customerName || '未知客户';
                    const parts = raw.split('/');
                    return parts.length >= 3 ? parts[parts.length - 1].trim() : raw.trim();
                };
                const groups = {};
                toRecon.forEach(w => {
                    const clientKey = extractClient(w);
                    if (!groups[clientKey]) groups[clientKey] = [];
                    groups[clientKey].push(w);
                });

                // 生成对账单
                const now = new Date();
                const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
                const timeStr = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');

                let recons = JSON.parse(sessionStorage.getItem("CustomerRecons")) || [];
                const newReconIds = [];
                let reconIdx = recons.length + 1;

                Object.keys(groups).forEach(client => {
                    const items = groups[client];
                    const reconId = `RC${dateStr}${timeStr}${String(reconIdx).padStart(3, '0')}`;
                    reconIdx++;

                    // 计算总金额
                    const total = items.reduce((sum, w) => {
                        const n = parseFloat((w.totalAmount || w.freightAmount || '0').toString().replace(/,/g, ''));
                        return sum + (isFinite(n) ? n : 0);
                    }, 0);
                    const amountStr = '¥' + total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                    recons.push({
                        id: reconId,
                        client: client,
                        period: period,
                        amount: amountStr,
                        waybillCount: items.length,
                        status: '待客户确认',
                        createdAt: now.toISOString().slice(0, 10)
                    });

                    // 更新运单 reconId 并将状态改为"对账中"
                    waybills = waybills.map(w => {
                        if (items.find(it => it.id === w.id)) {
                            return { ...w, reconId: reconId, status: '对账中' };
                        }
                        return w;
                    });

                    newReconIds.push(reconId);
                });

                sessionStorage.setItem("CustomerRecons", JSON.stringify(recons));
                sessionStorage.setItem("BizWaybills", JSON.stringify(waybills));

                alert(`✅ 对账单已生成！\n共创建 ${newReconIds.length} 张对账单：\n${newReconIds.join('\n')}\n\n即将跳转到客户对账页面。`);
                loadContent('ReconCustomer');
            };
        }

		        if (!window.settlementWaybillUpdateSelection) {
		            window.settlementWaybillUpdateSelection = function () {
		                const moneyKeys = Array.isArray(window._settlementWaybillMoneyKeys)
		                    ? window._settlementWaybillMoneyKeys
		                    : [];
		                const rowMap = window._settlementWaybillRowMap || {};
		                const toNumber = (raw) => {
		                    const s = (raw ?? "").toString().replace(/,/g, "").trim();
		                    if (!s) return 0;
		                    const n = Number(s);
		                    return Number.isFinite(n) ? n : 0;
		                };
		                const fmt = (n) => {
		                    if (!n) return "";
		                    return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
		                };

		                const checked = Array.from(document.querySelectorAll(".wb-check:checked"));
		                const ids = checked.map((cb) => cb.value).filter(Boolean);
		                const sums = {};
		                moneyKeys.forEach((k) => { sums[k] = 0; });
		                ids.forEach((id) => {
		                    const row = rowMap[id];
		                    if (!row) return;
		                    moneyKeys.forEach((k) => {
		                        sums[k] += toNumber(row[k]);
		                    });
		                });

		                const countEl = document.getElementById("wb_sel_count");
		                if (countEl) countEl.textContent = `${ids.length}单`;
		                moneyKeys.forEach((k) => {
		                    const el = document.getElementById(`wb_sel_sum_${k}`);
		                    if (!el) return;
		                    el.textContent = fmt(sums[k]);
		                });
		            };
		        }

		        const filters = window._settlementWaybillFilters || {};

	        const esc = (val) => (val ?? "").toString()
	            .replace(/&/g, "&amp;")
	            .replace(/</g, "&lt;")
	            .replace(/>/g, "&gt;")
	            .replace(/\"/g, "&quot;")
	            .replace(/'/g, "&#39;");

	        const parseTokens = (raw) => {
	            const text = (raw || "").toString().trim();
	            if (!text) return [];
	            return text
	                .split(/[\n,，;；\s]+/)
	                .map((t) => t.trim())
	                .filter(Boolean);
	        };

	        const parseDateOnly = (raw) => {
	            const s = (raw || "").toString().trim();
	            if (!s) return null;
	            const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
	            if (!m) return null;
	            const d = new Date(`${m[1]}T00:00:00`);
	            return Number.isNaN(d.getTime()) ? null : d;
	        };

	        const normalizeAccrualStatus = (raw) => {
	            const s = (raw || "").toString().trim();
	            if (!s) return "";
	            // 兼容页面老用词：挂帐 -> 挂账
	            if (s === "未挂帐") return "未挂账";
	            if (s === "已挂帐") return "已挂账";
	            return s.replace(/挂帐/g, "挂账");
	        };

	        const toNumber = (raw) => {
	            const s = (raw ?? "").toString().replace(/,/g, "").trim();
	            if (!s) return 0;
	            const n = Number(s);
	            return Number.isFinite(n) ? n : 0;
	        };

	        const formatMoney = (raw) => {
	            const n = toNumber(raw);
	            if (!n) return "";
	            return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
	        };

	        const decoratedWaybills = (Array.isArray(waybills) ? waybills : []).map((w, idx) => {
	            const site             = w.site || (idx % 2 === 0 ? "专线A" : "专线B");
	            const waybillNo        = w.id || w.orderNo || "";
	            const goodsNo          = w.goodsNo || w.driverOrderNo || "";
	            const createdAt        = w.createdAt || w.bizDate || "";
	            const loadAt           = w.loadAt || "";
	            const unloadAt         = w.unloadAt || "";
	            const finishAt         = w.finishAt || "";
	            const originStation    = w.origin || "";
	            const destinationStation = w.destination || "";
	            const routeLine        = w.routeLine || (originStation && destinationStation ? `${originStation.slice(0,6)} → ${destinationStation.slice(0,6)}` : (site === "专线A" ? "专线A→专线B" : "专线B→专线A"));
	            // 客户名称：从 creator 字段提取公司名（格式：姓名/手机/公司名）
	            const creatorParts     = (w.creator || w.client || "").split("/");
	            const customerName     = creatorParts.length >= 3 ? creatorParts[creatorParts.length - 1].trim() : (w.client || "");
	            const shipper          = w.shipper || creatorParts[0] || "";
	            const consignee        = w.consignee || "";
	            // 货物信息：goodsPack 格式 "品名/数量单位"
	            const goodsPackParts   = (w.goodsPack || "").split("/");
	            const goods            = goodsPackParts[0] || w.goods || "";
	            const weightVolume     = w.weightVolume || "";
	            const plate            = w.plate || "";
	            const driver           = w.driver || "";
	            const taxRate          = w.taxRate || "";
	            const taxAmount        = w.taxAmount ? formatMoney(w.taxAmount) : "";
	            const payStatus        = w.payStatus || w.auditInfo || "";
	            const paidAmount       = w.paidAmount ? formatMoney(w.paidAmount) : "";
	            const paidAt           = w.paidAt || "";
	            const waybillAccrualStatus = normalizeAccrualStatus(w.status || "");
	            const baseAmount       = w.totalAmount || w.freightAmount || w.amount || w.paidAmount || "";
	            const cashPay          = formatMoney(baseAmount);
	            const cashPayAccrualStatus = waybillAccrualStatus;

	            return {
	                ...w,
	                site, waybillNo, goodsNo, createdAt, loadAt, unloadAt, finishAt,
	                originStation, destinationStation, routeLine,
	                customerName, shipper, consignee,
	                goods, weightVolume, plate, driver,
	                taxRate, taxAmount, payStatus, paidAmount, paidAt,
	                waybillAccrualStatus, cashPay, cashPayAccrualStatus,
	                arrivePay: "", arrivePayAccrualStatus: "",
	                monthlyPay: "", monthlyPayAccrualStatus: "",
	                cashReturn: "", cashReturnAccrualStatus: "",
	                debtReturn: "", debtReturnAccrualStatus: "",
	                pickupFee: "",
	                remark: w.remark || "",
	                invoiceStatus: w.invoiceStatus || "",
	            };
	        });

	        const waybillNosFilter = parseTokens(filters.waybillNos);
	        const goodsNosFilter = parseTokens(filters.goodsNos);
	        const statusFilter = (filters.status || "").toString().trim();
	        const siteFilter = (filters.site || "").toString().trim();
	        const routeFilter = (filters.route || "").toString().trim();
	        const originFilter = (filters.origin || "").toString().trim();
	        const destFilter = (filters.destination || "").toString().trim();
	        const dateStart = parseDateOnly(filters.dateStart);
	        const dateEnd = parseDateOnly(filters.dateEnd);

	        const filteredWaybills = decoratedWaybills.filter((w) => {
	            if (siteFilter && w.site !== siteFilter) return false;
	            if (statusFilter && w.waybillAccrualStatus !== statusFilter) return false;
	            if (routeFilter && !(w.routeLine || "").includes(routeFilter)) return false;
	            if (originFilter && !(w.originStation || "").includes(originFilter)) return false;
	            if (destFilter && !(w.destinationStation || "").includes(destFilter)) return false;
	            if (waybillNosFilter.length) {
	                const id = (w.waybillNo || w.id || "").toString();
	                if (waybillNosFilter.length === 1) {
	                    if (!id.includes(waybillNosFilter[0])) return false;
	                } else {
	                    const set = new Set(waybillNosFilter);
	                    if (!set.has(id)) return false;
	                }
	            }
	            if (goodsNosFilter.length) {
	                const id = (w.goodsNo || "").toString();
	                if (goodsNosFilter.length === 1) {
	                    if (!id.includes(goodsNosFilter[0])) return false;
	                } else {
	                    const set = new Set(goodsNosFilter);
	                    if (!set.has(id)) return false;
	                }
	            }
	            if (dateStart || dateEnd) {
	                const d = parseDateOnly(w.createdAt);
	                if (!d) return false;
	                if (dateStart && d < dateStart) return false;
	                if (dateEnd && d > dateEnd) return false;
	            }
	            return true;
	        });

	        const pageSize = window._settlementWaybillPageSize || 10;
	        const totalPages = Math.max(1, Math.ceil(filteredWaybills.length / pageSize));
	        let currentPage = window._settlementWaybillPage || 1;
	        if (currentPage > totalPages) currentPage = totalPages;

	        const pageStart = (currentPage - 1) * pageSize;
		        const pagedWaybills = filteredWaybills.slice(pageStart, pageStart + pageSize);

		        const moneyKeys = accrualColumns
		            .filter((c) => c && c.align === "right" && c.key)
		            .map((c) => c.key);

		        const sumMoney = (list) => {
		            const sums = {};
		            moneyKeys.forEach((k) => { sums[k] = 0; });
		            (Array.isArray(list) ? list : []).forEach((row) => {
		                moneyKeys.forEach((k) => {
		                    sums[k] += toNumber(row[k]);
		                });
		            });
		            return sums;
		        };

		        const totalSums = sumMoney(filteredWaybills);
		        const fmtSum = (n) => {
		            if (!n) return "";
		            return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
		        };

		        // 供导出使用
		        window._settlementWaybillExportColumns = accrualColumns;
		        window._settlementWaybillExportData = filteredWaybills;
		        window._settlementWaybillMoneyKeys = moneyKeys;
		        window._settlementWaybillRowMap = Object.fromEntries(pagedWaybills.map((w) => [w.id, w]));

		        const renderCell = (w, col) => {
		            let value = w[col.key];
		            if (col.key === "waybillNo") {
		                const id = esc(value || w.id || "");
		                return `<a class="wb-link" href="javascript:void(0)">${id}</a>`;
		            }
		            if (col.key === "waybillAccrualStatus") {
		                const s = (value || "").toString();
		                const colorMap = { "已挂账": "#27ae60", "对账中": "#2980b9", "未挂账": "#e67e22", "已结算": "#8e44ad" };
		                const c = colorMap[s] || "#999";
		                return `<span style="color:${c};font-weight:bold;">${esc(s) || "-"}</span>`;
		            }
		            if (col.key === "cashPayAccrualStatus" || col.key === "arrivePayAccrualStatus" || col.key === "monthlyPayAccrualStatus" || col.key === "cashReturnAccrualStatus" || col.key === "debtReturnAccrualStatus") {
		                const s = (value || "").toString();
		                if (!s) return `<span style="color:#bdc3c7;">-</span>`;
		                const c = s === "已挂账" ? "#27ae60" : s === "对账中" ? "#2980b9" : "#e67e22";
		                return `<span style="color:${c};">${esc(s)}</span>`;
		            }
		            if (col.key === "payStatus") {
		                const s = (value || "").toString();
		                if (!s) return `<span style="color:#bdc3c7;">-</span>`;
		                const c = s === "已到账" ? "#27ae60" : s === "未到账" ? "#e74c3c" : "#f39c12";
		                return `<span style="color:${c};font-weight:bold;">${esc(s)}</span>`;
		            }
		            if (col.key === "invoiceStatus") {
		                const s = (value || "").toString();
		                if (s === "已核销") return `<span style="color:#27ae60;font-weight:bold;">已核销</span>`;
		                if (s === "已开票") return `<span style="color:#2980b9;font-weight:bold;">已开票</span>`;
		                if (s === "申请中") return `<span style="color:#f39c12;">申请中</span>`;
		                return `<span style="color:#bdc3c7;">-</span>`;
		            }
		            if (col.align === "right") {
		                const text = esc(value || "");
		                const isPos = toNumber(value) > 0;
		                const isSettled = (w.waybillAccrualStatus || "") === "已挂账";
		                const cls = isSettled ? "is-settled" : (isPos ? "is-pos" : "");
		                return `<span class="wb-money ${cls}">${text}</span>`;
		            }
		            return esc(value || "");
		        };

		        const dataRows = pagedWaybills
		            .map((w, idx) => {
		                const rowNo = pageStart + idx + 1;
		                return `<tr>
		                        <td class="sticky-left-1 wb-rowno">${rowNo}</td>
		                        <td class="sticky-left-2">
		                            <input type="checkbox" class="wb-check" value="${esc(w.id)}" data-client="${esc(w.client || "")}" onchange="settlementWaybillUpdateSelection()">
		                        </td>
		                        ${accrualColumns.map((col) => {
		                            const alignStyle = col.align ? ` style="text-align:${col.align};"` : "";
		                            return `<td${alignStyle}>${renderCell(w, col)}</td>`;
		                        }).join("")}
		                    </tr>`;
		            })
		            .join("");

		        const fillerCount = Math.max(0, pageSize - pagedWaybills.length);
		        const fillerRows = fillerCount
		            ? Array.from({ length: fillerCount }).map(() => {
		                return `<tr class="wb-empty-row">
		                        <td class="sticky-left-1 wb-rowno">&nbsp;</td>
		                        <td class="sticky-left-2">&nbsp;</td>
		                        ${accrualColumns.map((col) => {
		                            const alignStyle = col.align ? ` style="text-align:${col.align};"` : "";
		                            return `<td${alignStyle}>&nbsp;</td>`;
		                        }).join("")}
		                    </tr>`;
		            }).join("")
		            : "";

		        const rows = dataRows + fillerRows;

		        const siteOptions = Array.from(new Set(decoratedWaybills.map((w) => w.site))).sort();
		        const siteSelectHtml = `
		            <option value="">全部</option>
		            ${siteOptions.map((opt) => `<option value="${esc(opt)}" ${filters.site === opt ? "selected" : ""}>${esc(opt)}</option>`).join("")}
		        `;

			        const buildFilterCell = (col) => {
			            if (!col.filter) {
			                return `<th class="sticky-filter"><input class="wb-filter-input wb-filter-input--blank" disabled></th>`;
			            }
		            const f = col.filter;
		            if (f.type === "select") {
		                const opts = Array.isArray(f.options) ? f.options : [""];
		                const current = (filters.status || "").toString();
		                return `<th class="sticky-filter"><select id="${esc(f.id)}" class="wb-filter-select">${opts.map((opt) => {
		                    const label = opt || "全部";
		                    const selected = opt && current === opt ? "selected" : (!opt && !current ? "selected" : "");
		                    return `<option value="${esc(opt)}" ${selected}>${esc(label)}</option>`;
		                }).join("")}</select></th>`;
		            }
		            const val = f.id === "wb_f_waybillNos" ? (filters.waybillNos || "") : (f.id === "wb_f_goodsNos" ? (filters.goodsNos || "") : "");
		            const extraClass = (f.placeholder || "").includes("批量") ? " wb-filter-input--batch" : "";
		            return `<th class="sticky-filter"><input id="${esc(f.id)}" class="wb-filter-input${extraClass}" placeholder="${esc(f.placeholder || "")}" value="${esc(val)}"></th>`;
			        };

		        const buildFooterCells = (mode) => {
		            const isSelected = mode === "sel";
		            const countId = isSelected ? "wb_sel_count" : "wb_total_count";
		            const countText = isSelected ? "0单" : `${filteredWaybills.length}单`;
		            return accrualColumns.map((col) => {
		                const alignStyle = col.align ? ` style="text-align:${col.align};"` : "";
		                if (col.key === "waybillNo") {
		                    return `<td${alignStyle}><span id="${esc(countId)}" class="wb-foot__count">${esc(countText)}</span></td>`;
		                }
		                if (col.align === "right") {
		                    const id = isSelected ? `wb_sel_sum_${col.key}` : `wb_total_sum_${col.key}`;
		                    const val = isSelected ? "" : fmtSum(totalSums[col.key] || 0);
		                    return `<td${alignStyle}><span id="${esc(id)}" class="wb-foot__amt">${esc(val)}</span></td>`;
		                }
		                return `<td${alignStyle}>&nbsp;</td>`;
		            }).join("");
		        };

		        contentHTML += `

	                    <div class="wb-querybar">
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">网点</div>
	                            <select id="wb_q_site" class="wb-q-control">
	                                ${siteSelectHtml}
	                            </select>
	                        </div>
	                        <div class="wb-q-item wb-q-item--date">
	                            <div class="wb-q-label">开单时间</div>
	                            <div class="wb-q-date">
	                                <input id="wb_q_date_start" class="wb-q-control" type="date" value="${esc(filters.dateStart || "")}">
	                                <span class="wb-q-date__sep">~</span>
	                                <input id="wb_q_date_end" class="wb-q-control" type="date" value="${esc(filters.dateEnd || "")}">
	                            </div>
	                        </div>
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">路由</div>
	                            <input id="wb_q_route" class="wb-q-control" type="text" value="${esc(filters.route || "")}">
	                        </div>
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">发站</div>
	                            <input id="wb_q_origin" class="wb-q-control" type="text" value="${esc(filters.origin || "")}">
	                        </div>
	                        <div class="wb-q-item">
	                            <div class="wb-q-label">到站</div>
	                            <input id="wb_q_dest" class="wb-q-control" type="text" value="${esc(filters.destination || "")}">
	                        </div>
	                        <button class="wb-btn wb-btn--primary" onclick="settlementWaybillApplyFilters()">查询</button>
	                        <button class="wb-btn" onclick="settlementWaybillResetFilters()">重置</button>
	                    </div>

		                    <div class="wb-toolbar">
		                        <div class="wb-toolbar__left">
		                            <button class="wb-btn" onclick="settlementWaybillToolbarSettle()">挂账</button>
		                            <button class="wb-btn" onclick="settlementWaybillToolbarCancel()">取消挂账</button>
		                            <button class="wb-btn" style="background:#27ae60; color:#fff; border-color:#27ae60;" onclick="settlementWaybillCreateRecon()">发起对账</button>
		                        </div>
		                        <div class="wb-toolbar__right">
	                            <button class="wb-btn" onclick="settlementWaybillExport()">导出</button>
	                            <button class="wb-btn" onclick="settlementWaybillPrint()">打印</button>
		                            <div class="wb-pager">
	                                <span class="wb-pager__total">共 <strong>${filteredWaybills.length}</strong> 条</span>
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(1)" ${currentPage <= 1 ? "disabled" : ""} title="首页">|◀</button>
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(${Math.max(1, currentPage - 1)})" ${currentPage <= 1 ? "disabled" : ""} title="上一页">◀</button>
	                                ${(() => {
	                                    const btns = [];
	                                    const delta = 2;
	                                    for (let p = 1; p <= totalPages; p++) {
	                                        if (p === 1 || p === totalPages || (p >= currentPage - delta && p <= currentPage + delta)) {
	                                            btns.push(`<button class="wb-pager__btn wb-pager__btn--num${p === currentPage ? ' wb-pager__btn--active' : ''}" onclick="settlementWaybillSetPage(${p})">${p}</button>`);
	                                        } else if (btns[btns.length - 1] !== '…') {
	                                            btns.push('…');
	                                        }
	                                    }
	                                    return btns.map(b => b === '…' ? `<span class="wb-pager__ellipsis">…</span>` : b).join('');
	                                })()}
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(${Math.min(totalPages, currentPage + 1)})" ${currentPage >= totalPages ? "disabled" : ""} title="下一页">▶</button>
	                                <button class="wb-pager__btn" onclick="settlementWaybillSetPage(${totalPages})" ${currentPage >= totalPages ? "disabled" : ""} title="末页">▶|</button>
	                                <span class="wb-pager__jump">跳至 <input type="number" min="1" max="${totalPages}" class="wb-pager__jump-input" onkeydown="if(event.key==='Enter'){const v=parseInt(this.value);if(v>=1&&v<=${totalPages})settlementWaybillSetPage(v);}" placeholder="${currentPage}"> 页</span>
	                                <select class="wb-pager__size" onchange="settlementWaybillSetPageSize(this.value)">
	                                    <option value="10"  ${pageSize === 10  ? "selected" : ""}>10 条/页</option>
	                                    <option value="20"  ${pageSize === 20  ? "selected" : ""}>20 条/页</option>
	                                    <option value="50"  ${pageSize === 50  ? "selected" : ""}>50 条/页</option>
	                                    <option value="100" ${pageSize === 100 ? "selected" : ""}>100 条/页</option>
	                                </select>
		                            </div>
		                        </div>
		                    </div>

		                    <div class="settlement-waybill-table wb-accrual-table" style="--sticky-left-1:46px; --sticky-left-2:46px;">
		                        <table class="data-table" style="white-space:nowrap;">
		                            <thead>
		                                <tr>
		                                    <th class="sticky-header sticky-left-1"><span class="wb-funnel" title="筛选"></span></th>
		                                    <th class="sticky-header sticky-left-2"><input type="checkbox" onclick="toggleAll(this); settlementWaybillUpdateSelection();"></th>
		                                    ${accrualColumns.map((col) => `<th class="sticky-header"${col.align ? ` style="text-align:${col.align};"` : ""}>${esc(col.label)}</th>`).join("")}
		                                </tr>
		                                <tr>
		                                    <th class="sticky-filter sticky-left-1">筛选</th>
		                                    <th class="sticky-filter sticky-left-2"></th>
		                                    ${accrualColumns.map((col) => buildFilterCell(col)).join("")}
		                                </tr>
		                            </thead>
		                            <tbody>${rows || `<tr><td colspan="${accrualColumns.length + 2}" style="text-align:center; color:#999; padding:18px;">暂无数据</td></tr>`}</tbody>
		                            <tfoot>
		                                <tr class="wb-foot wb-foot--sel">
		                                    <td class="sticky-left-1 wb-foot__label">选中</td>
		                                    <td class="sticky-left-2"></td>
		                                    ${buildFooterCells("sel")}
		                                </tr>
		                                <tr class="wb-foot wb-foot--total">
		                                    <td class="sticky-left-1 wb-foot__label">合计</td>
		                                    <td class="sticky-left-2"></td>
		                                    ${buildFooterCells("total")}
		                                </tr>
		                            </tfoot>
		                        </table>
		                    </div>
		                `;

    contentArea.innerHTML = contentHTML;

};
