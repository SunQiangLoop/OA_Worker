/**
 * 会计引擎预置模板 (按准则分类)
 * 包含：enterprise (企业会计准则), small (小企业会计准则)
 */
const SYSTEM_ENGINE_TEMPLATES_MAP = {
    // =========================================================
    // 企业会计准则 Enterprise
    // =========================================================
    enterprise: [
        // =====================================================
        // 1. 运单收入：运单应收结算 - 含税
        // 借：应收账款
        // 贷：主营业务收入
        // 贷：应交税费-应交增值税-销项税额
        // =====================================================
        {
            id: 'E0001',
            code: 'F0001',
            name: '运单应收结算-含税',
            sourceSystem: 'TMS',
            feeType: '应收单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单结算' },
                { dimension: '销项税额', operator: '>', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1122',
                    subjectName: '应收账款',
                    assistant: 'client',
                    summary: '确认运单应收款'
                },
                {
                    dir: '贷',
                    subjectCode: '6001',
                    subjectName: '主营业务收入',
                    assistant: '',
                    summary: '确认运输服务收入'
                },
                {
                    dir: '贷',
                    subjectCode: '22210107',
                    subjectName: '应交税费-应交增值税-销项税额',
                    assistant: '',
                    summary: '确认销项税额'
                }
            ]
        },

        // =====================================================
        // 2. 运单收入：运单应收结算 - 不含税
        // 借：应收账款
        // 贷：主营业务收入
        // =====================================================
        {
            id: 'E0002',
            code: 'F0002',
            name: '运单应收结算-不含税',
            sourceSystem: 'TMS',
            feeType: '应收单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单结算' },
                { dimension: '销项税额', operator: '=', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1122',
                    subjectName: '应收账款',
                    assistant: 'client',
                    summary: '确认运单应收款'
                },
                {
                    dir: '贷',
                    subjectCode: '6001',
                    subjectName: '主营业务收入',
                    assistant: '',
                    summary: '确认运输服务收入'
                }
            ]
        },

        // =====================================================
        // 3. 应收回款：应收核销
        // 借：银行存款
        // 贷：应收账款
        // =====================================================
        {
            id: 'E0003',
            code: 'F0003',
            name: '应收核销',
            sourceSystem: 'TMS',
            feeType: '收款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '应收核销' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '收到客户款项'
                },
                {
                    dir: '贷',
                    subjectCode: '1122',
                    subjectName: '应收账款',
                    assistant: 'client',
                    summary: '冲销客户应收账款'
                }
            ]
        },

        // =====================================================
        // 4. 运输成本：运单应付成本结算 - 有进项税
        // 借：主营业务成本
        // 借：应交税费-应交增值税-进项税额
        // 贷：应付账款
        // =====================================================
        {
            id: 'E0004',
            code: 'F0004',
            name: '运单应付成本结算-有进项税',
            sourceSystem: 'TMS',
            feeType: '应付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单成本结算' },
                { dimension: '可抵扣进项税额', operator: '>', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '6401',
                    subjectName: '主营业务成本',
                    assistant: '',
                    summary: '确认运输成本'
                },
                {
                    dir: '借',
                    subjectCode: '22210101',
                    subjectName: '应交税费-应交增值税-进项税额',
                    assistant: '',
                    summary: '确认可抵扣进项税额'
                },
                {
                    dir: '贷',
                    subjectCode: '2202',
                    subjectName: '应付账款',
                    assistant: 'client',
                    summary: '确认应付承运成本'
                }
            ]
        },

        // =====================================================
        // 5. 运输成本：运单应付成本结算 - 无进项税
        // 借：主营业务成本
        // 贷：应付账款
        // =====================================================
        {
            id: 'E0005',
            code: 'F0005',
            name: '运单应付成本结算-无进项税',
            sourceSystem: 'TMS',
            feeType: '应付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单成本结算' },
                { dimension: '可抵扣进项税额', operator: '=', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '6401',
                    subjectName: '主营业务成本',
                    assistant: '',
                    summary: '确认运输成本'
                },
                {
                    dir: '贷',
                    subjectCode: '2202',
                    subjectName: '应付账款',
                    assistant: 'client',
                    summary: '确认应付承运成本'
                }
            ]
        },

        // =====================================================
        // 6. 应付付款：应付核销
        // 借：应付账款
        // 贷：银行存款
        // =====================================================
        {
            id: 'E0006',
            code: 'F0006',
            name: '应付核销',
            sourceSystem: 'TMS',
            feeType: '付款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '应付核销' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '2202',
                    subjectName: '应付账款',
                    assistant: 'client',
                    summary: '冲销应付账款'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付承运成本'
                }
            ]
        },

        // =====================================================
        // 7. OA报销：OA报销支付 - 有进项税
        // 借：管理费用
        // 借：应交税费-应交增值税-进项税额
        // 贷：银行存款
        // =====================================================
        {
            id: 'E0007',
            code: 'F0007',
            name: 'OA报销支付-有进项税',
            sourceSystem: 'OA',
            feeType: '报销支付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '报销支付完成' },
                { dimension: '可抵扣进项税额', operator: '>', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '6602',
                    subjectName: '管理费用',
                    assistant: 'dept',
                    summary: '确认报销费用'
                },
                {
                    dir: '借',
                    subjectCode: '22210101',
                    subjectName: '应交税费-应交增值税-进项税额',
                    assistant: '',
                    summary: '确认报销进项税额'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付员工报销款'
                }
            ]
        },

        // =====================================================
        // 8. OA报销：OA报销支付 - 无进项税
        // 借：管理费用
        // 贷：银行存款
        // =====================================================
        {
            id: 'E0008',
            code: 'F0008',
            name: 'OA报销支付-无进项税',
            sourceSystem: 'OA',
            feeType: '报销支付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '报销支付完成' },
                { dimension: '可抵扣进项税额', operator: '=', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '6602',
                    subjectName: '管理费用',
                    assistant: 'dept',
                    summary: '确认报销费用'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付员工报销款'
                }
            ]
        },

        // =====================================================
        // 9. 人事：薪资计提
        // 借：管理费用-管理人员职工薪酬
        // 贷：应付职工薪酬-应付职工工资
        // =====================================================
        {
            id: 'E0009',
            code: 'F0009',
            name: '薪资计提',
            sourceSystem: 'HRMS',
            feeType: '工资单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '薪酬核算完成' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '660201',
                    subjectName: '管理费用-管理人员职工薪酬',
                    assistant: 'dept',
                    summary: '计提本月薪资'
                },
                {
                    dir: '贷',
                    subjectCode: '221101',
                    subjectName: '应付职工薪酬-应付职工工资',
                    assistant: '',
                    summary: '计提本月薪资'
                }
            ]
        },

        // =====================================================
        // 10. 特殊往来：代收货款收取
        // 借：银行存款
        // 贷：其他应付款-代收货款
        // =====================================================
        {
            id: 'E0010',
            code: 'F0010',
            name: '代收货款收取',
            sourceSystem: 'TMS',
            feeType: '代收货款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '代收货款收取' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '收到代收货款'
                },
                {
                    dir: '贷',
                    subjectCode: '224101',
                    subjectName: '其他应付款-代收货款',
                    assistant: 'client',
                    summary: '确认待发放代收货款'
                }
            ]
        },

        // =====================================================
        // 11. 特殊往来：代收货款发放
        // 借：其他应付款-代收货款
        // 贷：银行存款
        // =====================================================
        {
            id: 'E0011',
            code: 'F0011',
            name: '代收货款发放',
            sourceSystem: 'TMS',
            feeType: '代收货款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '代收货款发放' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '224101',
                    subjectName: '其他应付款-代收货款',
                    assistant: 'client',
                    summary: '冲销待发放代收货款'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '发放代收货款'
                }
            ]
        },

        // =====================================================
        // 12. 特殊往来：垫付费支付
        // 借：其他应收款-垫付费
        // 贷：银行存款
        // =====================================================
        {
            id: 'E0012',
            code: 'F0012',
            name: '垫付费支付',
            sourceSystem: 'TMS',
            feeType: '垫付费单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '垫付费支付' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '122101',
                    subjectName: '其他应收款-垫付费',
                    assistant: 'client',
                    summary: '确认代垫款项'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付垫付费用'
                }
            ]
        },

        // =====================================================
        // 13. 特殊往来：垫付费回收
        // 借：银行存款
        // 贷：其他应收款-垫付费
        // =====================================================
        {
            id: 'E0013',
            code: 'F0013',
            name: '垫付费回收',
            sourceSystem: 'TMS',
            feeType: '垫付费单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '垫付费回收' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '收回垫付款'
                },
                {
                    dir: '贷',
                    subjectCode: '122101',
                    subjectName: '其他应收款-垫付费',
                    assistant: 'client',
                    summary: '冲销代垫款项'
                }
            ]
        }
    ],

    // =========================================================
    // 小企业会计准则 Small
    // =========================================================
    small: [
        // =====================================================
        // 1. 运单收入：运单应收结算 - 含税
        // 借：应收账款
        // 贷：主营业务收入
        // 贷：应交税费-应交增值税-销项税额
        // =====================================================
        {
            id: 'S0001',
            code: 'F0001',
            name: '运单应收结算-含税',
            sourceSystem: 'TMS',
            feeType: '应收单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单结算' },
                { dimension: '销项税额', operator: '>', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1122',
                    subjectName: '应收账款',
                    assistant: 'client',
                    summary: '确认运单应收款'
                },
                {
                    dir: '贷',
                    subjectCode: '5001',
                    subjectName: '主营业务收入',
                    assistant: '',
                    summary: '确认运输服务收入'
                },
                {
                    dir: '贷',
                    subjectCode: '22210107',
                    subjectName: '应交税费-应交增值税-销项税额',
                    assistant: '',
                    summary: '确认销项税额'
                }
            ]
        },

        // =====================================================
        // 2. 运单收入：运单应收结算 - 不含税
        // 借：应收账款
        // 贷：主营业务收入
        // =====================================================
        {
            id: 'S0002',
            code: 'F0002',
            name: '运单应收结算-不含税',
            sourceSystem: 'TMS',
            feeType: '应收单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单结算' },
                { dimension: '销项税额', operator: '=', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1122',
                    subjectName: '应收账款',
                    assistant: 'client',
                    summary: '确认运单应收款'
                },
                {
                    dir: '贷',
                    subjectCode: '5001',
                    subjectName: '主营业务收入',
                    assistant: '',
                    summary: '确认运输服务收入'
                }
            ]
        },

        // =====================================================
        // 3. 应收回款：应收核销
        // 借：银行存款
        // 贷：应收账款
        // =====================================================
        {
            id: 'S0003',
            code: 'F0003',
            name: '应收核销',
            sourceSystem: 'TMS',
            feeType: '收款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '应收核销' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '收到客户款项'
                },
                {
                    dir: '贷',
                    subjectCode: '1122',
                    subjectName: '应收账款',
                    assistant: 'client',
                    summary: '冲销客户应收账款'
                }
            ]
        },

        // =====================================================
        // 4. 运输成本：运单应付成本结算 - 有进项税
        // 借：主营业务成本
        // 借：应交税费-应交增值税-进项税额
        // 贷：应付账款
        // =====================================================
        {
            id: 'S0004',
            code: 'F0004',
            name: '运单应付成本结算-有进项税',
            sourceSystem: 'TMS',
            feeType: '应付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单成本结算' },
                { dimension: '可抵扣进项税额', operator: '>', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '5401',
                    subjectName: '主营业务成本',
                    assistant: '',
                    summary: '确认运输成本'
                },
                {
                    dir: '借',
                    subjectCode: '22210101',
                    subjectName: '应交税费-应交增值税-进项税额',
                    assistant: '',
                    summary: '确认可抵扣进项税额'
                },
                {
                    dir: '贷',
                    subjectCode: '2202',
                    subjectName: '应付账款',
                    assistant: 'client',
                    summary: '确认应付承运成本'
                }
            ]
        },

        // =====================================================
        // 5. 运输成本：运单应付成本结算 - 无进项税
        // 借：主营业务成本
        // 贷：应付账款
        // =====================================================
        {
            id: 'S0005',
            code: 'F0005',
            name: '运单应付成本结算-无进项税',
            sourceSystem: 'TMS',
            feeType: '应付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '运单成本结算' },
                { dimension: '可抵扣进项税额', operator: '=', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '5401',
                    subjectName: '主营业务成本',
                    assistant: '',
                    summary: '确认运输成本'
                },
                {
                    dir: '贷',
                    subjectCode: '2202',
                    subjectName: '应付账款',
                    assistant: 'client',
                    summary: '确认应付承运成本'
                }
            ]
        },

        // =====================================================
        // 6. 应付付款：应付核销
        // 借：应付账款
        // 贷：银行存款
        // =====================================================
        {
            id: 'S0006',
            code: 'F0006',
            name: '应付核销',
            sourceSystem: 'TMS',
            feeType: '付款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '应付核销' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '2202',
                    subjectName: '应付账款',
                    assistant: 'client',
                    summary: '冲销应付账款'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付承运成本'
                }
            ]
        },

        // =====================================================
        // 7. OA报销：OA报销支付 - 有进项税
        // 借：管理费用
        // 借：应交税费-应交增值税-进项税额
        // 贷：银行存款
        // =====================================================
        {
            id: 'S0007',
            code: 'F0007',
            name: 'OA报销支付-有进项税',
            sourceSystem: 'OA',
            feeType: '报销支付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '报销支付完成' },
                { dimension: '可抵扣进项税额', operator: '>', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '5602',
                    subjectName: '管理费用',
                    assistant: 'dept',
                    summary: '确认报销费用'
                },
                {
                    dir: '借',
                    subjectCode: '22210101',
                    subjectName: '应交税费-应交增值税-进项税额',
                    assistant: '',
                    summary: '确认报销进项税额'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付员工报销款'
                }
            ]
        },

        // =====================================================
        // 8. OA报销：OA报销支付 - 无进项税
        // 借：管理费用
        // 贷：银行存款
        // =====================================================
        {
            id: 'S0008',
            code: 'F0008',
            name: 'OA报销支付-无进项税',
            sourceSystem: 'OA',
            feeType: '报销支付单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '报销支付完成' },
                { dimension: '可抵扣进项税额', operator: '=', value: '0' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '5602',
                    subjectName: '管理费用',
                    assistant: 'dept',
                    summary: '确认报销费用'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付员工报销款'
                }
            ]
        },

        // =====================================================
        // 9. 人事：薪资计提
        // 借：管理费用-管理人员职工薪酬
        // 贷：应付职工薪酬-应付职工工资
        // =====================================================
        {
            id: 'S0009',
            code: 'F0009',
            name: '薪资计提',
            sourceSystem: 'HRMS',
            feeType: '工资单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '薪酬核算完成' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '560201',
                    subjectName: '管理费用-管理人员职工薪酬',
                    assistant: 'dept',
                    summary: '计提本月薪资'
                },
                {
                    dir: '贷',
                    subjectCode: '221101',
                    subjectName: '应付职工薪酬-应付职工工资',
                    assistant: '',
                    summary: '计提本月薪资'
                }
            ]
        },

        // =====================================================
        // 10. 特殊往来：代收货款收取
        // 借：银行存款
        // 贷：其他应付款-代收货款
        // =====================================================
        {
            id: 'S0010',
            code: 'F0010',
            name: '代收货款收取',
            sourceSystem: 'TMS',
            feeType: '代收货款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '代收货款收取' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '收到代收货款'
                },
                {
                    dir: '贷',
                    subjectCode: '224101',
                    subjectName: '其他应付款-代收货款',
                    assistant: 'client',
                    summary: '确认待发放代收货款'
                }
            ]
        },

        // =====================================================
        // 11. 特殊往来：代收货款发放
        // 借：其他应付款-代收货款
        // 贷：银行存款
        // =====================================================
        {
            id: 'S0011',
            code: 'F0011',
            name: '代收货款发放',
            sourceSystem: 'TMS',
            feeType: '代收货款单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '代收货款发放' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '224101',
                    subjectName: '其他应付款-代收货款',
                    assistant: 'client',
                    summary: '冲销待发放代收货款'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '发放代收货款'
                }
            ]
        },

        // =====================================================
        // 12. 特殊往来：垫付费支付
        // 借：其他应收款-垫付费
        // 贷：银行存款
        // =====================================================
        {
            id: 'S0012',
            code: 'F0012',
            name: '垫付费支付',
            sourceSystem: 'TMS',
            feeType: '垫付费单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '垫付费支付' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '122101',
                    subjectName: '其他应收款-垫付费',
                    assistant: 'client',
                    summary: '确认代垫款项'
                },
                {
                    dir: '贷',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '支付垫付费用'
                }
            ]
        },

        // =====================================================
        // 13. 特殊往来：垫付费回收
        // 借：银行存款
        // 贷：其他应收款-垫付费
        // =====================================================
        {
            id: 'S0013',
            code: 'F0013',
            name: '垫付费回收',
            sourceSystem: 'TMS',
            feeType: '垫付费单',
            isSystem: true,
            status: '启用',
            conditions: [
                { dimension: '业务环节', operator: '=', value: '垫付费回收' }
            ],
            entries: [
                {
                    dir: '借',
                    subjectCode: '1002',
                    subjectName: '银行存款',
                    assistant: '',
                    summary: '收回垫付款'
                },
                {
                    dir: '贷',
                    subjectCode: '122101',
                    subjectName: '其他应收款-垫付费',
                    assistant: 'client',
                    summary: '冲销代垫款项'
                }
            ]
        }
    ]
};

// 导出方法：获取当前准则下的模板
window.getSystemEngineTemplatesByStandard = function() {
    var std = localStorage.getItem("AccountingStandard") || "enterprise";
    return SYSTEM_ENGINE_TEMPLATES_MAP[std] || SYSTEM_ENGINE_TEMPLATES_MAP["enterprise"];
};

// 兼容旧代码
window.SYSTEM_ENGINE_TEMPLATES = window.getSystemEngineTemplatesByStandard();

