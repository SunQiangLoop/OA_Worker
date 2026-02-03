
        // 1. 智能计算利润 (支持中文科目 + 状态过滤)
        window.calculateRealProfit = function () {
            const vouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
            let totalIncome = 0;
            let totalCost = 0;
            let validCount = 0;

            console.log("开始计算利润...");

            vouchers.forEach(v => {
                // 只有“已审核”或“已记账”的凭证才参与计算
                if (v.status === '已审核' || v.status === '已记账' || v.status === '已过账') {
                    validCount++;
                    let voucherIncome = 0;
                    let voucherCost = 0;
                    if (v.lines) {
                        v.lines.forEach(line => {
                            // 兼容处理：提取科目代码和名称
                            const acctStr = line.account ? line.account.trim() : '';
                            const codeMatch = acctStr.match(/^(\d+)/);
                            const code = codeMatch ? codeMatch[1] : '';
                            const debit = parseFloat((line.debit || "0").toString().replace(/,/g, "")) || 0;
                            const credit = parseFloat((line.credit || "0").toString().replace(/,/g, "")) || 0;

                            // --- 智能匹配逻辑 ---

                            // A. 收入类 (贷方)：代码以 60/61/63 开头，或名称含“收入”
                            if (code.startsWith('60') || code.startsWith('61') || code.startsWith('63') || acctStr.includes('收入')) {
                                voucherIncome += credit;
                            }

                            // B. 成本费用类 (借方)：代码以 64/66/67/68 开头，或名称含“成本”、“费用”、“工资”、“运费”
                            else if (code.startsWith('64') || code.startsWith('66') || code.startsWith('67') || code.startsWith('68') ||
                                acctStr.includes('成本') || acctStr.includes('费用') || acctStr.includes('工资') || acctStr.includes('运费')) {
                                voucherCost += debit;
                            }
                        });
                    }

                    if (voucherIncome === 0 && voucherCost === 0) {
                        const amount = parseFloat((v.amount || "0").toString().replace(/,/g, "")) || 0;
                        const summaryText = (v.summary || (v.lines && v.lines[0] && (v.lines[0].summary || v.lines[0].digest)) || "").toString();
                        if (summaryText.includes('成本') || summaryText.includes('费用')) {
                            voucherCost = Math.abs(amount);
                        } else if (summaryText.includes('收入') || summaryText.includes('运费') || summaryText.includes('结算')) {
                            voucherIncome = Math.abs(amount);
                        }
                    }

                    totalIncome += voucherIncome;
                    totalCost += voucherCost;
                }
            });

            console.log(`计算完成：有效凭证${validCount}张，收入${totalIncome}，成本${totalCost}`);

            return {
                income: totalIncome,
                cost: totalCost,
                profit: totalIncome - totalCost,
                count: validCount
            };
        }
