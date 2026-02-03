        /** [修复版] 队列开票 (改为含税价逻辑：总额不变，倒算税额) */
        window.generateInvoiceFromQueue = function (sourceId, client, amountStr, index) {
            if (!confirm(`确认对源单据【${sourceId}】开票吗？`)) return;

            // 1. 移除待办 (保持不变)
            let queue = JSON.parse(sessionStorage.getItem('PendingInvoiceQueue') || "[]");
            queue.splice(index, 1);
            sessionStorage.setItem('PendingInvoiceQueue', JSON.stringify(queue));

            let invoices = JSON.parse(sessionStorage.getItem('OutputInvoices') || "[]");

            // ============================================================
            // ★★★ 核心修改区：含税倒算逻辑 ★★★
            // ============================================================
            // 1. 获取总金额 (这就是对账单金额 2300)
            const totalNum = parseFloat(amountStr.replace(/,/g, ''));

            // 2. 倒算不含税金额 (总额 / 1.09)
            const amountNum = totalNum / 1.09;

            // 3. 计算税额 (总额 - 不含税)
            const taxNum = totalNum - amountNum;

            // 4. 格式化字符串
            const totalStr = totalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const amountFinalStr = amountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const taxStr = taxNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            // ============================================================

            const newInvoice = {
                no: "13000" + Math.floor(Math.random() * 90000),
                client: client,
                amount: amountFinalStr, // 显示不含税金额 (约 2110.09)
                tax: taxStr,           // 显示税额 (约 189.91)
                total: totalStr,       // 显示总额 (2300.00) -> 保持和对账一致！
                date: new Date().toISOString().slice(0, 10),
                status: "正常",
                remark: sourceId
            };

            // ... (后续保存、生成凭证代码保持不变) ...
            invoices.unshift(newInvoice);
            sessionStorage.setItem('OutputInvoices', JSON.stringify(invoices));

            // 生成凭证时，记得也要传 totalNum
            if (typeof runAccountingEngine === 'function') {
                runAccountingEngine('发票开具', { client: client, amount: totalStr });
            }

            // ... (后续状态回写保持不变) ...
            let recons = JSON.parse(sessionStorage.getItem('CustomerRecons') || "[]");
            let reconItem = recons.find(r => r.id === sourceId);
            if (reconItem) {
                reconItem.status = '已开票';
                sessionStorage.setItem('CustomerRecons', JSON.stringify(recons));
            }

            let waybills = JSON.parse(sessionStorage.getItem('BizWaybills') || "[]");
            let wbUpdated = false;
            waybills.forEach(w => {
                if (w.reconId === sourceId) { w.status = '已开票'; wbUpdated = true; }
            });
            if (wbUpdated) sessionStorage.setItem('BizWaybills', JSON.stringify(waybills));

            alert(`🎉 开票成功！\n\n发票总额：${totalStr} (与对账一致)\n其中税额：${taxStr}`);
            loadContent('TaxOutputInvoice');
        }


               // ==========================================================
        // ★★★ 核心修复：跳转发票详情的函数 (请确保这段代码在 script 标签的底部) ★★★
        // ==========================================================
        window.viewInvoiceDetail = function (invNo) {
            console.log("🔍 [调试] 查看发票:", invNo);

            const list = JSON.parse(sessionStorage.getItem('OutputInvoices') || "[]");
            let inv = list.find(i => i.no === invNo);

            if (!inv) {
                console.warn("⚠️ 未找到发票");
                return alert("发票数据丢失，请刷新页面");
            }

            // ⭐ 传递完整数据
            window.g_currentInvoice = {
                no: inv.no,
                clientName: inv.client,
                clientTaxId: '9132xxxxxxxx',
                sellerName: '乐享物流有限公司',
                sellerTaxId: '9131xxxxxxxx',
                amount: inv.amount,      // 已格式化的金额
                tax: inv.tax,
                total: inv.total,
                taxRate: '9%',
                date: inv.date
            };

            console.log("✅ [调试] 数据已准备:", window.g_currentInvoice);
            loadContent('InvoiceDetail');
        }



               // 3. 功能：红冲发票 (Red Dash Invoice)
        window.handleInvoiceRedDash = function (btn) {
            const row = btn.closest('tr');
            const invNo = row.querySelector('.val-inv-no').innerText;

            const reason = prompt(`⚠️ 警告：正在对发票【${invNo}】进行红字冲销！\n此操作将作废原发票并生成红字发票。\n\n请输入冲红原因：`);

            if (reason) {
                // 1. 原行变灰，状态变冲红
                row.style.color = "#999";
                row.style.backgroundColor = "#f9f9f9";
                row.querySelector('.status-cell').innerHTML = '<span style="color: #e74c3c; text-decoration: line-through;">已冲红</span>';

                // 禁用按钮
                const parentTd = btn.parentElement;
                parentTd.innerHTML = '<span style="color:#ccc;">已作废</span>';

                // 2. 插入红字行
                // 获取原数据
                const client = row.querySelector('.val-client').innerText;
                const amount = row.querySelector('.val-amount').innerText;
                const tax = row.querySelector('.val-tax').innerText;
                const total = row.querySelector('.val-total').innerText;
                const date = row.querySelector('.val-date').innerText;

                const redRow = `
                    <tr style="background-color: #fff0f0; color: #e74c3c;">
                        <td class="val-inv-no">红-${invNo}</td>
                        <td class="val-client">${client}</td>
                        <td class="val-amount">-${amount}</td>
                        <td class="val-tax">-${tax}</td>
                        <td class="val-total">-${total}</td>
                        <td class="val-date">${date}</td>
                        <td class="status-cell"><span style="color: #e74c3c;">红字发票</span></td>
                        <td>
                            <a href="javascript:void(0)" onclick="viewInvoiceDetail(this)" style="color:#e74c3c;">查看红票</a>
                        </td>
                    </tr>
                `;
                row.insertAdjacentHTML('afterend', redRow);

                alert("✅ 红冲操作完成，红字发票已生成。");
            }
        }