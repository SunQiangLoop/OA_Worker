        /** 队列开票：已上传图片后确认开票，直接生成已开票发票记录 */
        window.generateInvoiceFromQueue = function (sourceId, client, amountStr, index) {
            // 必须先上传图片才能开票
            const imgBase64 = sessionStorage.getItem('_PendingImg_' + sourceId);
            if (!imgBase64) return alert('请先上传发票图片后再开票。');

            if (!confirm(`确认对来源单据【${sourceId}】完成开票？\n客户：${client}\n价税合计：¥${amountStr}`)) return;

            // 1. 取出待办队列项（在 splice 前先取，保留 waybillIds）
            let queue = JSON.parse(sessionStorage.getItem('PendingInvoiceQueue') || "[]");
            const queueItem = queue[index] || {};
            const linkedIds = Array.isArray(queueItem.waybillIds) ? queueItem.waybillIds : [];
            queue.splice(index, 1);
            sessionStorage.setItem('PendingInvoiceQueue', JSON.stringify(queue));
            // 清理临时图片缓存
            sessionStorage.removeItem('_PendingImg_' + sourceId);

            // 2. 含税倒算
            const totalNum = parseFloat(amountStr.replace(/,/g, ''));
            const amountNum = totalNum / 1.09;
            const taxNum = totalNum - amountNum;
            const totalStr = totalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const amountFinalStr = amountNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const taxStr = taxNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const today = new Date().toISOString().slice(0, 10);

            // 3. 生成发票记录（发票号取上传时存储的 FP+时间戳，状态设为待审核）
            const fpNo = sessionStorage.getItem('_PendingFP_' + sourceId) || ('FP' + Date.now());
            sessionStorage.removeItem('_PendingFP_' + sourceId);
            const newInvoice = {
                no: fpNo,
                client: client,
                amount: amountFinalStr,
                tax: taxStr,
                total: totalStr,
                date: today,
                status: "待审核",
                remark: sourceId,
                waybillIds: linkedIds,
                imgBase64: imgBase64,
                uploadTime: new Date().toISOString()
            };
            let invoices = JSON.parse(sessionStorage.getItem('OutputInvoices') || "[]");
            invoices.unshift(newInvoice);
            sessionStorage.setItem('OutputInvoices', JSON.stringify(invoices));

            // 4. 回写关联运单开票状态
            let waybills = JSON.parse(sessionStorage.getItem('BizWaybills') || "[]");
            let wbUpdated = 0;
            waybills.forEach(w => {
                if (linkedIds.includes(w.id) || w.reconId === sourceId) {
                    w.invoiceStatus = '已开票';
                    w.invoiceNo = newInvoice.no;
                    wbUpdated++;
                }
            });
            if (wbUpdated > 0) sessionStorage.setItem('BizWaybills', JSON.stringify(waybills));

            // 5. 回写对账单状态
            let recons = JSON.parse(sessionStorage.getItem('CustomerRecons') || "[]");
            let reconItem = recons.find(r => r.id === sourceId);
            if (reconItem) {
                reconItem.status = '已开票';
                sessionStorage.setItem('CustomerRecons', JSON.stringify(recons));
            }

            alert(`✅ 开票申请已提交！\n发票号：${newInvoice.no}\n客户：${client}\n价税合计：¥${totalStr}\n\n请在【销项发票台账】点击【通过】审核后，再前往【应收核销】操作。`);
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