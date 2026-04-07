// js/core/modules/finance/view_voucher_mgmt.js
// 凭证录入、凭证审核中心、凭证详情
window.VM_MODULES = window.VM_MODULES || {};

// =========================================================================
// VoucherEntryReview
// =========================================================================
window.VM_MODULES['VoucherEntryReview'] = function(contentArea, contentHTML, moduleCode) {
        var veWordMode = getVoucherWordSetting();
        var veWordOptions = veWordMode === "ji"
            ? '<option value="记" selected>记</option>'
            : '<option value="收">收</option><option value="付">付</option><option value="转" selected>转</option>';
        var veSessionSubjects = JSON.parse(sessionStorage.getItem("AcctSubjects") || "[]");
        var veLocalSubjects = JSON.parse(localStorage.getItem("AcctSubjects") || "[]");
        var veSubjectList = (Array.isArray(veSessionSubjects) && veSessionSubjects.length > 1) ? veSessionSubjects
            : ((Array.isArray(veLocalSubjects) && veLocalSubjects.length > 1) ? veLocalSubjects : []);
        if (!veSubjectList.length && typeof ACCOUNTING_STANDARD_TEMPLATES !== "undefined") {
            var standardKey = localStorage.getItem("AccountingStandard") || sessionStorage.getItem("AccountingStandard") || "enterprise";
            veSubjectList = (ACCOUNTING_STANDARD_TEMPLATES[standardKey] || ACCOUNTING_STANDARD_TEMPLATES.enterprise || []);
        }
        // 迁移：确保现金类科目包含"现金流量项目"辅助核算（修正旧数据中的"银行账户"或空值）
        var _cashAuxCodes = {'1001':1,'1002':1,'1012':1,'100201':1,'100202':1,'100203':1,'101201':1,'101202':1};
        var _needSave = false;
        veSubjectList.forEach(function(s) {
            if (_cashAuxCodes[s.code]) {
                var a = (s.aux || '').trim();
                if (!a || a === '无' || a === '银行账户') {
                    s.aux = '现金流量项目'; _needSave = true;
                } else if (a.indexOf('现金流量项目') === -1) {
                    s.aux = a + ',现金流量项目'; _needSave = true;
                }
            }
        });
        if (_needSave) {
            sessionStorage.setItem('AcctSubjects', JSON.stringify(veSubjectList));
            localStorage.setItem('AcctSubjects', JSON.stringify(veSubjectList));
        }
        window._veSubjectList = veSubjectList;
        var veSummaryTpls = (typeof getVoucherSummaryTemplates === 'function') ? getVoucherSummaryTemplates() : [];
        var veTodayDate = new Date().toISOString().split('T')[0];

        contentHTML += `
        <style>
            .ve-container { background:#fff; border-radius:4px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
            .ve-page-header { display:flex; justify-content:space-between; align-items:center; padding:14px 20px; border-bottom:1px solid #e8e8e8; background:#fafafa; }
            .ve-page-title { font-size:15px; font-weight:600; color:#1a1a1a; }
            .ve-header-actions { display:flex; gap:8px; align-items:center; }
            .ve-btn { padding:6px 14px; border:1px solid #d9d9d9; border-radius:3px; background:#fff; color:#333; font-size:13px; cursor:pointer; transition:border-color 0.2s,background 0.2s; white-space:nowrap; }
            .ve-btn:hover { border-color:#aaa; }
            .ve-btn-primary { background:#1890ff; border-color:#1890ff; color:#fff; }
            .ve-btn-primary:hover { background:#40a9ff; border-color:#40a9ff; }
            .ve-btn-default { background:#fff; border-color:#d9d9d9; color:#333; }
            .ve-btn-danger { background:#fff; border-color:#d9d9d9; color:#ff4d4f; }
            .ve-btn-danger:hover { border-color:#ff4d4f; }
            .ve-btn:disabled,.ve-btn[disabled] { background:#f5f5f5; border-color:#d9d9d9; color:#bbb; cursor:not-allowed; }
            .ve-split-btn-group { display:inline-flex; border:1px solid #d9d9d9; border-radius:3px; overflow:visible; position:relative; }
            .ve-split-btn-main { padding:6px 12px; border:none; background:#fff; color:#333; font-size:13px; cursor:pointer; border-right:1px solid #d9d9d9; }
            .ve-split-btn-main:hover { background:#f5f5f5; }
            .ve-split-btn-arrow { padding:6px 8px; border:none; background:#fff; color:#666; font-size:11px; cursor:pointer; }
            .ve-split-btn-arrow:hover { background:#f5f5f5; }
            .ve-split-dropdown { display:none; position:absolute; top:calc(100% + 2px); left:0; min-width:140px; background:#fff; border:1px solid #d9d9d9; border-radius:3px; box-shadow:0 4px 12px rgba(0,0,0,0.12); z-index:1000; }
            .ve-split-dropdown.show { display:block; }
            .ve-split-dropdown-item { padding:8px 14px; cursor:pointer; font-size:13px; color:#333; display:block; white-space:nowrap; }
            .ve-split-dropdown-item:hover { background:#f5f5f5; }
            .ve-split-dropdown-item.ve-active { background:#e6f7ff; color:#1890ff; }
            .ve-voucher-content { padding:20px; }
            .ve-voucher-center-title { text-align:center; font-size:16px; font-weight:600; padding:12px 0 16px; border-bottom:1px solid #e8e8e8; margin-bottom:16px; }
            .ve-header-info { display:flex; flex-wrap:wrap; gap:16px 24px; padding:12px 0 16px; border-bottom:1px solid #e8e8e8; margin-bottom:16px; align-items:flex-start; }
            .ve-form-field { display:flex; align-items:center; gap:8px; }
            .ve-form-field label { font-size:13px; color:#666; white-space:nowrap; }
            .ve-required-star { color:#ff4d4f; margin-right:2px; }
            .ve-form-field input,.ve-form-field select { padding:5px 10px; border:1px solid #d9d9d9; border-radius:3px; font-size:13px; color:#333; }
            .ve-form-field input:focus,.ve-form-field select:focus { outline:none; border-color:#40a9ff; }
            .ve-input-sm { width:140px; }
            .ve-input-xs { width:80px; }
            .ve-input-readonly { background:#fafafa; color:#666; cursor:not-allowed; }
            .ve-detail-header { display:flex; justify-content:space-between; align-items:center; padding:10px 0 8px; margin-bottom:8px; }
            .ve-detail-title { font-size:14px; font-weight:600; }
            .ve-detail-actions { display:flex; gap:8px; }
            .ve-entry-table-wrap { overflow-x:auto; }
            .ve-entry-table { width:100%; min-width:900px; border-collapse:collapse; border:1px solid #e0e0e0; }
            .ve-entry-table th,.ve-entry-table td { border:1px solid #e0e0e0; padding:7px 10px; text-align:left; font-size:13px; }
            .ve-entry-table th { background:#fafafa; font-weight:600; color:#555; white-space:nowrap; }
            .ve-entry-table td { vertical-align:middle; }
            .ve-col-seq { width:36px; text-align:center; padding:0 !important; }
            .ve-seq-cell { display:flex; align-items:center; justify-content:center; height:100%; min-height:30px; cursor:pointer; user-select:none; }
            .ve-seq-num  { font-size:12px; color:#aaa; }
            .ve-seq-gear { display:none; font-size:15px; color:#666; }
            .ve-seq-cell:hover .ve-seq-num  { display:none; }
            .ve-seq-cell:hover .ve-seq-gear { display:inline; }
            .ve-col-summary { min-width:140px; }
            .ve-col-subject { min-width:160px; }
            .ve-col-auxiliary { width:160px; }
            .ve-aux-trigger { width:100%; text-align:left; border:1px solid transparent; border-radius:3px; background:transparent; font-size:13px; padding:2px 6px; color:#333; cursor:pointer; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; display:block; }
            .ve-aux-trigger:hover { background:#f0f5ff; }
            .ve-aux-trigger.has-value { color:#1890ff; border-color:transparent; }
            .ve-aux-trigger.needs-aux { color:#d97706; border:1px dashed #fcd34d; background:#fffbeb; font-weight:500; }
            .ve-aux-trigger.needs-aux:hover { background:#fff3cd; }
            .ve-row-menu-item { padding:7px 16px; font-size:13px; color:#333; cursor:pointer; white-space:nowrap; }
            .ve-row-menu-item:hover { background:#f0f5ff; color:#1890ff; }
            .ve-row-menu-danger { color:#ff4d4f; }
            .ve-row-menu-danger:hover { background:#fff1f0; color:#ff4d4f; }
            .ve-row-menu-sep { height:1px; background:#f0f0f0; margin:3px 0; }
            .ve-col-amount { width:110px; }
            .ve-entry-table tbody tr:hover { background:#fafafa; }
            .ve-entry-table tbody tr.ve-row-checked { background:#e6f7ff !important; }
            .ve-total-row td { background:#fafafa; font-weight:600; }
            .ve-total-label { text-align:right; color:#555; }
            .ve-entry-input { width:100%; border:none; background:transparent; font-size:13px; padding:2px 4px; color:#333; }
            .ve-entry-input:focus { outline:1px solid #40a9ff; border-radius:2px; }
            .ve-entry-select { border:1px solid #e8e8e8; background:#fff; font-size:12px; color:#333; width:100%; border-radius:3px; padding:2px; }
            .ve-entry-select:focus { outline:none; border-color:#40a9ff; }
            .ve-amount-input { width:100%; border:none; background:transparent; font-size:13px; padding:2px 4px; color:#333; text-align:right; }
            .ve-amount-input:focus { outline:1px solid #40a9ff; border-radius:2px; }
            .ve-modal-overlay { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.45); z-index:900; align-items:center; justify-content:center; }
            .ve-modal-overlay.show { display:flex; }
            .ve-modal { background:#fff; border-radius:4px; box-shadow:0 8px 32px rgba(0,0,0,0.18); display:flex; flex-direction:column; max-height:80vh; }
            .ve-modal-header { display:flex; justify-content:space-between; align-items:center; padding:14px 20px; border-bottom:1px solid #e8e8e8; }
            .ve-modal-title { font-size:15px; font-weight:600; }
            .ve-modal-close { width:28px; height:28px; border:none; background:none; font-size:18px; cursor:pointer; color:#999; border-radius:50%; line-height:28px; text-align:center; }
            .ve-modal-close:hover { background:#f5f5f5; color:#333; }
            .ve-modal-body { padding:16px 20px; overflow-y:auto; flex:1; }
            .ve-modal-footer { padding:12px 20px; border-top:1px solid #e8e8e8; display:flex; justify-content:flex-end; gap:8px; }
            .ve-modal-common { width:820px; }
            .ve-filter-bar { display:flex; gap:8px; align-items:center; padding-bottom:12px; border-bottom:1px solid #f0f0f0; margin-bottom:12px; flex-wrap:wrap; }
            .ve-filter-bar select,.ve-filter-bar input[type="text"] { padding:5px 10px; border:1px solid #d9d9d9; border-radius:3px; font-size:13px; }
            .ve-checkbox-label { display:flex; align-items:center; gap:4px; font-size:13px; color:#555; cursor:pointer; }
            .ve-common-table { width:100%; border-collapse:collapse; }
            .ve-common-table th,.ve-common-table td { border:1px solid #e0e0e0; padding:7px 10px; font-size:13px; }
            .ve-common-table th { background:#fafafa; font-weight:600; color:#555; }
            .ve-common-table tbody tr { cursor:pointer; }
            .ve-common-table tbody tr:hover { background:#e6f7ff; }
            .ve-common-table tbody tr.ve-selected { background:#bae7ff; }
            .ve-modal-bottom-info { padding-top:10px; font-size:12px; color:#888; }
            .ve-modal-draft { width:720px; }
            .ve-draft-table { width:100%; border-collapse:collapse; }
            .ve-draft-table th,.ve-draft-table td { border:1px solid #e0e0e0; padding:7px 10px; font-size:13px; }
            .ve-draft-table th { background:#fafafa; font-weight:600; color:#555; }
            .ve-draft-empty { text-align:center; padding:40px; color:#bbb; font-size:13px; }
            .ve-modal-save-template { width:480px; }
            .ve-form-row { display:flex; align-items:center; margin-bottom:16px; gap:8px; }
            .ve-form-row label { width:90px; text-align:right; font-size:13px; color:#555; flex-shrink:0; }
            .ve-form-row input,.ve-form-row select { flex:1; padding:6px 10px; border:1px solid #d9d9d9; border-radius:3px; font-size:13px; }
            .ve-form-row input:focus,.ve-form-row select:focus { outline:none; border-color:#40a9ff; }
            .ve-readonly-field { flex:1; padding:6px 10px; background:#fafafa; color:#888; border:1px solid #e8e8e8; border-radius:3px; font-size:13px; }
            .ve-modal-confirm { width:360px; }
            .ve-confirm-content { font-size:14px; color:#333; padding:8px 0; }
            .ve-toast-container { position:fixed; top:24px; left:50%; transform:translateX(-50%); z-index:9999; display:flex; flex-direction:column; gap:8px; pointer-events:none; }
            .ve-toast { background:#333; color:#fff; padding:10px 20px; border-radius:4px; font-size:13px; box-shadow:0 4px 12px rgba(0,0,0,0.2); animation:veToastIn 0.25s ease; }
            .ve-toast.success { background:#52c41a; }
            .ve-toast.error { background:#ff4d4f; }
            .ve-toast.warning { background:#faad14; }
            @keyframes veToastIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
            .ve-ac-item { padding:7px 12px; font-size:13px; cursor:pointer; white-space:nowrap; line-height:1.5; }
            .ve-ac-item:hover { background:#e6f7ff; color:#1890ff; }
            .ve-ac-code { color:#aaa; margin-right:6px; font-size:12px; font-family:monospace; }
            .ve-ac-empty { padding:10px 14px; font-size:12px; color:#bbb; }
        </style>

        <div class="ve-container">
            <div class="ve-page-header">
                <span class="ve-page-title">&#9679; 新增凭证</span>
                <div class="ve-header-actions">
                    <button class="ve-btn ve-btn-default" onclick="veConfirmClear()">清空</button>
                    <div class="ve-split-btn-group">
                        <button class="ve-split-btn-main" onclick="veDoNewVoucher()">新增</button>
                        <button class="ve-split-btn-arrow" onclick="veToggleDropdown('veAddDropdown',event)">&#9662;</button>
                        <div class="ve-split-dropdown" id="veAddDropdown">
                            <span class="ve-split-dropdown-item ve-active" onclick="veDoNewVoucher();veCloseDropdown('veAddDropdown')">新增</span>
                            <span class="ve-split-dropdown-item" onclick="veOpenCommonVoucher();veCloseDropdown('veAddDropdown')">引入常用凭证</span>
                            <span class="ve-split-dropdown-item" onclick="veOpenDraft();veCloseDropdown('veAddDropdown')">引入草稿凭证</span>
                        </div>
                    </div>
                    <div class="ve-split-btn-group">
                        <button class="ve-split-btn-main" style="background:#1890ff;color:#fff;border-right:1px solid rgba(255,255,255,0.3);" onclick="veDoSave()">保存</button>
                        <button class="ve-split-btn-arrow" style="background:#1890ff;color:#fff;" onclick="veToggleDropdown('veSaveDropdown',event)">&#9662;</button>
                        <div class="ve-split-dropdown" id="veSaveDropdown">
                            <span class="ve-split-dropdown-item" onclick="veDoSave();veCloseDropdown('veSaveDropdown')">保存</span>
                            <span class="ve-split-dropdown-item" onclick="veDoSaveNew();veCloseDropdown('veSaveDropdown')">保存新增</span>
                            <span class="ve-split-dropdown-item" onclick="veDoSaveDraft();veCloseDropdown('veSaveDropdown')">保存为草稿</span>
                            <span class="ve-split-dropdown-item" onclick="veOpenSaveTemplate();veCloseDropdown('veSaveDropdown')">保存为常用凭证</span>
                        </div>
                    </div>
                    <button class="ve-btn ve-btn-primary" onclick="veDoSubmit()">提交</button>
                </div>
            </div>

            <div class="ve-voucher-content">
                <div class="ve-voucher-center-title" id="veVoucherTitle">转账凭证</div>
                <div class="ve-header-info">
                    <div class="ve-form-field">
                        <label><span class="ve-required-star">*</span>日期</label>
                        <input type="date" class="ve-input-sm" id="veDateInput" value="${veTodayDate}">
                    </div>
                    <div class="ve-form-field">
                        <label><span class="ve-required-star">*</span>凭证字</label>
                        <select class="ve-input-xs" id="veVoucherWord" onchange="veUpdateVoucherNo()">
                            ${veWordOptions}
                        </select>
                    </div>
                    <div class="ve-form-field">
                        <label>凭证号</label>
                        <input type="text" class="ve-input-xs" id="veVoucherNo" maxlength="4" placeholder="0001" style="width:72px;font-family:monospace;letter-spacing:1px;" oninput="this.value=this.value.replace(/\D/g,'').slice(0,4)">
                    </div>
                    <div class="ve-form-field">
                        <label>附件数</label>
                        <input type="number" class="ve-input-xs" id="veAttachCount" value="0" min="0">
                    </div>
                </div>

                <div>
                    <div class="ve-detail-header">
                        <span class="ve-detail-title">分录明细</span>
                        <div class="ve-detail-actions"></div>
                    </div>
                    <div class="ve-entry-table-wrap">
                        <table class="ve-entry-table">
                            <thead>
                                <tr>
                                    <th class="ve-col-seq" style="font-size:12px;color:#888;">序号</th>
                                    <th class="ve-col-summary">摘要</th>
                                    <th class="ve-col-subject">科目名称</th>
                                    <th class="ve-col-auxiliary">辅助核算项目</th>
                                    <th class="ve-col-amount">借方金额</th>
                                    <th class="ve-col-amount">贷方金额</th>
                                </tr>
                            </thead>
                            <tbody id="veEntryBody"></tbody>
                            <tfoot>
                                <tr class="ve-total-row">
                                    <td colspan="4" class="ve-total-label">合计</td>
                                    <td class="ve-col-amount" style="text-align:right;" id="veTotalDebit">0.00</td>
                                    <td class="ve-col-amount" style="text-align:right;" id="veTotalCredit">0.00</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- 弹窗1：常用凭证参照 -->
        <div class="ve-modal-overlay" id="veModalCommon">
            <div class="ve-modal ve-modal-common">
                <div class="ve-modal-header">
                    <span class="ve-modal-title">常用凭证参照</span>
                    <button class="ve-modal-close" onclick="veCloseModal('veModalCommon')">&#215;</button>
                </div>
                <div class="ve-modal-body">
                    <div class="ve-filter-bar">
                        <select id="veCommonQueryType">
                            <option>名称编码规格型号</option>
                            <option>编码</option>
                            <option>说明</option>
                        </select>
                        <input type="text" placeholder="请输入关键字" style="width:180px;" id="veCommonKeyword">
                        <button class="ve-btn ve-btn-default" style="font-size:13px;padding:5px 12px;" onclick="veFilterCommon()">过滤</button>
                        <label class="ve-checkbox-label">
                            <input type="checkbox" id="veChkFilterInResult"> 结果中过滤
                        </label>
                        <button class="ve-btn ve-btn-default" style="font-size:13px;padding:5px 12px;" onclick="veShowToast('栏目设置功能待实现')">栏目</button>
                    </div>
                    <table class="ve-common-table">
                        <thead>
                            <tr>
                                <th style="width:50px;">序号</th>
                                <th style="width:80px;">编码</th>
                                <th>说明</th>
                                <th style="width:100px;">凭证类别</th>
                                <th style="width:80px;">附单据数</th>
                                <th style="width:80px;">所属分类</th>
                            </tr>
                        </thead>
                        <tbody id="veCommonBody"></tbody>
                    </table>
                    <div class="ve-modal-bottom-info" id="veCommonInfo">共0条记录</div>
                </div>
                <div class="ve-modal-footer">
                    <button class="ve-btn ve-btn-primary" onclick="veDoImportCommon()">确定</button>
                    <button class="ve-btn ve-btn-default" onclick="veCloseModal('veModalCommon')">取消</button>
                </div>
            </div>
        </div>

        <!-- 弹窗2：草稿 -->
        <div class="ve-modal-overlay" id="veModalDraft">
            <div class="ve-modal ve-modal-draft">
                <div class="ve-modal-header">
                    <span class="ve-modal-title">草稿</span>
                    <button class="ve-modal-close" onclick="veCloseModal('veModalDraft')">&#215;</button>
                </div>
                <div class="ve-modal-body">
                    <table class="ve-draft-table">
                        <thead>
                            <tr>
                                <th style="width:50px;">序号</th>
                                <th style="width:40px;"><input type="checkbox" id="veChkDraftAll" onchange="veToggleAllDraft(this)"></th>
                                <th>单据编号</th>
                                <th style="width:100px;">凭证类别</th>
                                <th style="width:110px;">制单日期</th>
                                <th style="width:80px;">附单据数</th>
                            </tr>
                        </thead>
                        <tbody id="veDraftBody">
                            <tr><td colspan="6" class="ve-draft-empty">暂无草稿凭证</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="ve-modal-footer">
                    <button class="ve-btn ve-btn-danger" id="veBtnDeleteDraft" disabled onclick="veShowToast('请先选择要删除的草稿','warning')">删除</button>
                    <button class="ve-btn ve-btn-primary" onclick="veDoImportDraft()">确定</button>
                    <button class="ve-btn ve-btn-default" onclick="veCloseModal('veModalDraft')">取消</button>
                </div>
            </div>
        </div>

        <!-- 弹窗3：保存为常用凭证 -->
        <div class="ve-modal-overlay" id="veModalSaveTemplate">
            <div class="ve-modal ve-modal-save-template">
                <div class="ve-modal-header">
                    <span class="ve-modal-title">保存为常用凭证</span>
                    <button class="ve-modal-close" onclick="veCloseModal('veModalSaveTemplate')">&#215;</button>
                </div>
                <div class="ve-modal-body">
                    <div class="ve-form-row">
                        <label><span style="color:#ff4d4f">*</span> 编码</label>
                        <input type="text" id="veTmplCode" placeholder="请输入4位数字编码，如 2006" maxlength="10">
                    </div>
                    <div class="ve-form-row">
                        <label><span style="color:#ff4d4f">*</span> 说明</label>
                        <input type="text" id="veTmplDesc" placeholder="不超过50字符" maxlength="50">
                    </div>
                    <div class="ve-form-row">
                        <label><span style="color:#ff4d4f">*</span> 所属分类</label>
                        <select id="veTmplCategory">
                            <option value="">请选择</option>
                            <option>销售</option>
                            <option>采购</option>
                            <option>费用</option>
                            <option>薪资</option>
                            <option>其他</option>
                        </select>
                    </div>
                    <div class="ve-form-row">
                        <label>凭证类别</label>
                        <div class="ve-readonly-field">转账凭证</div>
                    </div>
                </div>
                <div class="ve-modal-footer">
                    <button class="ve-btn ve-btn-default" onclick="veCloseModal('veModalSaveTemplate')">取消</button>
                    <button class="ve-btn ve-btn-primary" onclick="veDoSaveTemplate()">确定</button>
                </div>
            </div>
        </div>

        <!-- 通用确认弹窗 -->
        <div class="ve-modal-overlay" id="veModalConfirm">
            <div class="ve-modal ve-modal-confirm">
                <div class="ve-modal-header">
                    <span class="ve-modal-title" id="veConfirmTitle">确认</span>
                    <button class="ve-modal-close" onclick="veCloseModal('veModalConfirm')">&#215;</button>
                </div>
                <div class="ve-modal-body">
                    <p class="ve-confirm-content" id="veConfirmMsg"></p>
                </div>
                <div class="ve-modal-footer">
                    <button class="ve-btn ve-btn-primary" id="veConfirmOkBtn">确定</button>
                    <button class="ve-btn ve-btn-default" onclick="veCloseModal('veModalConfirm')">取消</button>
                </div>
            </div>
        </div>

        <div class="ve-toast-container" id="veToastContainer"></div>
        `;

        setTimeout(function () {
            // ── 状态变量 ──
            window.veRows = [];
            for (var _vi = 1; _vi <= 10; _vi++) {
                window.veRows.push({ id: _vi, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 });
            }
            window.veNextId = 11;
            window.veCheckedSet = new Set();
            window.veSelectedCommonIdx = -1;
            window.veCommonVouchers = [
                { seq:1,  code:'1001', name:'现金销售',               type:'转账凭证', attach:'-', category:'销售' },
                { seq:2,  code:'1002', name:'预售商品',               type:'转账凭证', attach:'-', category:'销售' },
                { seq:3,  code:'1003', name:'销售商品（已预付部分款）', type:'转账凭证', attach:'-', category:'销售' },
                { seq:4,  code:'1004', name:'赊账销售商品',            type:'转账凭证', attach:'-', category:'销售' },
                { seq:5,  code:'1005', name:'销售收回货款',            type:'转账凭证', attach:'-', category:'销售' },
                { seq:6,  code:'1006', name:'现金折扣销售收款',         type:'转账凭证', attach:'-', category:'销售' },
                { seq:7,  code:'1007', name:'销售商品退回',            type:'转账凭证', attach:'-', category:'销售' },
                { seq:8,  code:'1008', name:'坏账发生',               type:'转账凭证', attach:'-', category:'销售' },
                { seq:9,  code:'1009', name:'收回坏账损失',            type:'转账凭证', attach:'-', category:'销售' },
                { seq:10, code:'2001', name:'现金进货',               type:'转账凭证', attach:'-', category:'采购' },
                { seq:11, code:'2002', name:'预付货款',               type:'转账凭证', attach:'-', category:'采购' },
                { seq:12, code:'2003', name:'预付退回',               type:'转账凭证', attach:'-', category:'采购' },
                { seq:13, code:'2004', name:'用预付款支付货款',         type:'转账凭证', attach:'-', category:'采购' },
                { seq:14, code:'2005', name:'预付坏账',               type:'转账凭证', attach:'-', category:'采购' }
            ];
            window.veFilteredVouchers = window.veCommonVouchers.slice();
            window.veConfirmCallback = null;

            // ── 构建多选辅助核算选项 ──
            window.veBuildAuxMulti = function(auxString, currentAux) {
                var labels = window.parseAuxLabels ? window.parseAuxLabels(auxString) : [];
                if (!labels.length) return '<option value="">无辅助核算</option>';
                var html = '';
                labels.forEach(function(label) {
                    var key = window.mapAuxLabelToKey ? window.mapAuxLabelToKey(label) : null;
                    if (!key) return;
                    var list = window.getAuxiliaryDataByKey ? window.getAuxiliaryDataByKey(key).filter(function(i) { return i.enabled !== false; }) : [];
                    if (!list.length) return;
                    html += '<optgroup label="' + label + '">';
                    list.forEach(function(item) {
                        var val = key + '|||' + item.code + '|||' + item.name;
                        var sel = (currentAux || []).indexOf(val) >= 0 ? ' selected' : '';
                        html += '<option value="' + val + '"' + sel + '>' + item.code + ' ' + item.name + '</option>';
                    });
                    html += '</optgroup>';
                });
                return html || '<option value="">无</option>';
            };

            // ── 渲染分录表格 ──
            window.veRenderEntryTable = function () {
                var tbody = document.getElementById('veEntryBody');
                if (!tbody) return;
                var html = '';
                var chkSet = window.veCheckedSet || new Set();
                window.veRows.forEach(function (row, idx) {
                    var rowId = row.id;
                    var isChecked = chkSet.has(rowId);
                    // 规范化 auxiliary 为数组
                    var currentAux = Array.isArray(row.auxiliary) ? row.auxiliary
                        : (row.auxiliary && row.auxiliary !== '无' && row.auxiliary !== '' ? [row.auxiliary] : []);
                    // 根据已选科目动态构建辅助核算选项
                    var subjectCode = (row.subject || '').split(' ')[0];
                    var subjectObj = subjectCode ? (window._veSubjectList || []).find(function(s) { return s.code === subjectCode; }) : null;
                    var auxHtml = subjectObj && subjectObj.aux
                        ? window.veBuildAuxMulti(subjectObj.aux, currentAux)
                        : '<option value="">无</option>';
                    var sumVal = (row.summary || '').replace(/"/g, '&quot;');
                    var subjVal = (row.subject || '').replace(/"/g, '&quot;');
                    html +=
                        '<tr id="veRow_' + rowId + '" class="' + (isChecked ? 've-row-checked' : '') + '">' +
                        '<td class="ve-col-seq">' +
                        '<div class="ve-seq-cell" onclick="veShowRowMenu(event,' + idx + ')">' +
                        '<span class="ve-seq-num">' + (idx + 1) + '</span>' +
                        '<span class="ve-seq-gear">&#9881;</span>' +
                        '</div>' +
                        '</td>' +
                        '<td class="ve-col-summary">' +
                            '<input class="ve-entry-input" type="text" id="veSumInput_' + idx + '" placeholder="输入摘要" value="' + sumVal + '" autocomplete="off"' +
                            ' oninput="window.veRows[' + idx + '].summary=this.value;veShowSummaryAC(' + idx + ',this.value,false)"' +
                            ' onfocus="veShowSummaryAC(' + idx + ',this.value,true)"' +
                            ' onblur="setTimeout(function(){veHideAC(\'veSumAC\')},200)">' +
                        '</td>' +
                        '<td class="ve-col-subject">' +
                            '<input class="ve-entry-input" type="text" id="veSubjInput_' + idx + '" placeholder="输入科目名称/编码" value="' + subjVal + '" autocomplete="off"' +
                            ' oninput="window.veRows[' + idx + '].subject=this.value;veShowSubjectAC(' + idx + ',this.value,false)"' +
                            ' onfocus="veShowSubjectAC(' + idx + ',this.value,true)"' +
                            ' onblur="setTimeout(function(){veHideAC(\'veSubjAC\')},200)">' +
                        '</td>' +
                        '<td class="ve-col-auxiliary">' + (function(){
                            var hasAuxCfg = subjectObj && subjectObj.aux && subjectObj.aux !== '无' && subjectObj.aux.trim() !== '';
                            var btnCls = currentAux.length ? ' has-value' : (hasAuxCfg ? ' needs-aux' : '');
                            var btnTxt = currentAux.length ? veGetAuxDisplayText(currentAux) : (hasAuxCfg ? '⚑ 需选辅助项' : '请选择...');
                            return '<button class="ve-aux-trigger' + btnCls + '" id="veAuxBtn_' + idx + '" onclick="veShowAuxAC(' + idx + ',this)">' + btnTxt + '</button>';
                        })() +
                        '</td>' +
                        '<td class="ve-col-amount"><input class="ve-amount-input" type="number" step="0.01" min="0" value="' + (row.debit || 0) + '" oninput="window.veRows[' + idx + '].debit=parseFloat(this.value)||0;veUpdateTotals()"></td>' +
                        '<td class="ve-col-amount"><input class="ve-amount-input" type="number" step="0.01" min="0" value="' + (row.credit || 0) + '" oninput="window.veRows[' + idx + '].credit=parseFloat(this.value)||0;veUpdateTotals()"></td>' +
                    '</tr>';
                });
                tbody.innerHTML = html;
                veUpdateTotals();
                // 同步全选框状态
                var allChk = document.getElementById('veChkAll');
                if (allChk) {
                    allChk.checked = chkSet.size > 0 && chkSet.size === window.veRows.length;
                    allChk.indeterminate = chkSet.size > 0 && chkSet.size < window.veRows.length;
                }
            };

            // ── 辅助核算显示文本 ──
            function veGetAuxDisplayText(auxArr) {
                if (!auxArr || !auxArr.length) return '请选择...';
                var names = auxArr.map(function(v) {
                    if (v && v.indexOf('|||') !== -1) { var p = v.split('|||'); return p[2] || p[1]; }
                    return v || '';
                }).filter(Boolean);
                if (!names.length) return '请选择...';
                return names.length === 1 ? names[0] : '已选 ' + names.length + ' 项';
            }

            // ── 自定义 Autocomplete（共享浮层，position:fixed 避免被overflow裁剪）──
            (function() {
                function ensureLayer(id, extraStyle) {
                    var el = document.getElementById(id);
                    if (!el) {
                        el = document.createElement('div');
                        el.id = id;
                        el.className = 've-ac-dropdown';
                        el.style.cssText = extraStyle || 'position:fixed;z-index:99999;display:none;min-width:240px;max-height:280px;overflow-y:auto;background:#fff;border:1px solid #d9d9d9;border-radius:3px;box-shadow:0 4px 16px rgba(0,0,0,0.18);';
                        document.body.appendChild(el);
                    }
                    return el;
                }
                ensureLayer('veSubjAC');
                ensureLayer('veSumAC');
                ensureLayer('veAuxAC', 'position:fixed;z-index:99999;display:none;min-width:220px;max-height:320px;overflow-y:auto;background:#fff;border:1px solid #d9d9d9;border-radius:4px;box-shadow:0 6px 20px rgba(0,0,0,0.15);');
                ensureLayer('veRowMenuAC', 'position:fixed;z-index:99999;display:none;min-width:88px;background:#fff;border:1px solid #d9d9d9;border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:4px 0;');
            })();

            // ── 辅助核算浮层操作 ──
            window._veAuxIdx = -1;

            window.veShowAuxAC = function(idx, triggerEl) {
                var dropdown = document.getElementById('veAuxAC');
                if (!dropdown) return;
                if (dropdown.style.display !== 'none' && window._veAuxIdx === idx) {
                    dropdown.style.display = 'none'; window._veAuxIdx = -1; return;
                }
                window._veAuxIdx = idx;
                var row = window.veRows[idx];
                if (!row) { dropdown.style.display = 'none'; return; }
                var currentAux = Array.isArray(row.auxiliary) ? row.auxiliary : [];
                var subjectCode = (row.subject || '').split(' ')[0];
                var subjectObj = subjectCode ? (window._veSubjectList || []).find(function(s) { return s.code === subjectCode; }) : null;
                if (!subjectObj || !subjectObj.aux) {
                    dropdown.innerHTML = '<div style="padding:14px 16px;color:#bbb;font-size:13px;">该科目无辅助核算配置</div>';
                } else {
                    var labels = window.parseAuxLabels ? window.parseAuxLabels(subjectObj.aux) : [];
                    if (!labels.length) {
                        dropdown.innerHTML = '<div style="padding:14px 16px;color:#bbb;font-size:13px;">无辅助核算项</div>';
                    } else {
                        var html = '<div style="padding:8px 12px 6px;border-bottom:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;">' +
                            '<span style="font-size:12px;color:#888;font-weight:600;">辅助核算</span>' +
                            '<span style="font-size:12px;color:#1890ff;cursor:pointer;" onmousedown="event.preventDefault();window.veRows[' + idx + '].auxiliary=[];veUpdateAuxBtn(' + idx + ')">清除全部</span>' +
                            '</div>';
                        labels.forEach(function(label) {
                            var key = window.mapAuxLabelToKey ? window.mapAuxLabelToKey(label) : null;
                            if (!key) return;
                            var list = window.getAuxiliaryDataByKey ? window.getAuxiliaryDataByKey(key).filter(function(i) { return i.enabled !== false; }) : [];
                            if (!list.length) return;
                            html += '<div style="padding:5px 12px 2px;font-size:11px;color:#aaa;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;">' + label + '</div>';
                            list.forEach(function(item) {
                                var val = key + '|||' + item.code + '|||' + item.name;
                                var chk = currentAux.indexOf(val) >= 0 ? ' checked' : '';
                                html += '<label style="display:flex;align-items:center;gap:8px;padding:6px 12px;cursor:pointer;font-size:13px;" ' +
                                    'onmouseover="this.style.background=\'#f0f5ff\'" onmouseout="this.style.background=\'\'">' +
                                    '<input type="checkbox" value="' + val + '"' + chk + ' onchange="veToggleAuxItem(' + idx + ',this.value,this.checked)">' +
                                    '<span style="color:#666;font-size:12px;font-family:monospace;">' + item.code + '</span>' +
                                    '<span style="color:#333;">' + item.name + '</span>' +
                                    '</label>';
                            });
                        });
                        dropdown.innerHTML = html;
                    }
                }
                var rect = triggerEl.getBoundingClientRect();
                dropdown.style.left = rect.left + 'px';
                dropdown.style.top  = (rect.bottom + 2) + 'px';
                dropdown.style.minWidth = Math.max(rect.width, 220) + 'px';
                dropdown.style.display = 'block';
            };

            window.veHideAuxAC = function() {
                var el = document.getElementById('veAuxAC');
                if (el) el.style.display = 'none';
                window._veAuxIdx = -1;
            };

            // ── 行右键菜单 ──
            window._veRowMenuIdx = -1;

            window.veShowRowMenu = function(e, idx) {
                e.stopPropagation();
                var dropdown = document.getElementById('veRowMenuAC');
                if (!dropdown) return;
                if (dropdown.style.display !== 'none' && window._veRowMenuIdx === idx) {
                    dropdown.style.display = 'none'; window._veRowMenuIdx = -1; return;
                }
                window._veRowMenuIdx = idx;
                dropdown.innerHTML =
                    '<div class="ve-row-menu-item" onmousedown="event.preventDefault();veRowAddBelow(' + idx + ');veHideRowMenu()">增行</div>' +
                    '<div class="ve-row-menu-item" onmousedown="event.preventDefault();veRowInsertBelow(' + idx + ');veHideRowMenu()">插行</div>' +
                    '<div class="ve-row-menu-item" onmousedown="event.preventDefault();veRowCopyToNextEmpty(' + idx + ');veHideRowMenu()">复制行</div>' +
                    '<div class="ve-row-menu-sep"></div>' +
                    '<div class="ve-row-menu-item ve-row-menu-danger" onmousedown="event.preventDefault();veRowDelete(' + idx + ');veHideRowMenu()">删行</div>';
                var rect = e.currentTarget.getBoundingClientRect();
                dropdown.style.left = (rect.right + 4) + 'px';
                dropdown.style.top  = rect.top + 'px';
                dropdown.style.display = 'block';
            };

            window.veHideRowMenu = function() {
                var el = document.getElementById('veRowMenuAC');
                if (el) el.style.display = 'none';
                window._veRowMenuIdx = -1;
            };

            // 增行：在末尾追加一条空白行
            window.veRowAddBelow = function(idx) {
                window.veRows.push({ id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 });
                veRenderEntryTable();
            };

            // 插行：在当前行下方插入一条空白行（原有内容下移）
            window.veRowInsertBelow = function(idx) {
                var newRow = { id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 };
                window.veRows.splice(idx + 1, 0, newRow);
                veRenderEntryTable();
            };

            window.veRowCopyToNextEmpty = function(idx) {
                var src = window.veRows[idx];
                if (!src) return;
                // 找当前行之后第一个空白行（摘要/科目/借贷均为空）
                for (var i = idx + 1; i < window.veRows.length; i++) {
                    var r = window.veRows[i];
                    if (!r.summary && !r.subject && r.debit === 0 && r.credit === 0) {
                        r.summary   = src.summary;
                        r.subject   = src.subject;
                        r.auxiliary = (src.auxiliary || []).slice();
                        r.debit     = src.debit;
                        r.credit    = src.credit;
                        veRenderEntryTable();
                        veShowToast('已复制到第 ' + (i + 1) + ' 行', 'success');
                        return;
                    }
                }
                // 下方无空行，在当前行后直接插入
                var newRow = { id: window.veNextId++, summary: src.summary, subject: src.subject, auxiliary: (src.auxiliary || []).slice(), debit: src.debit, credit: src.credit };
                window.veRows.splice(idx + 1, 0, newRow);
                veRenderEntryTable();
                veShowToast('下方无空行，已在当前行后新增', 'success');
            };

            window.veRowDelete = function(idx) {
                window.veRows.splice(idx, 1);
                if (window.veRows.length === 0) {
                    window.veRows.push({ id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 });
                }
                if (window.veCheckedSet) window.veCheckedSet.clear();
                veRenderEntryTable();
            };

            window.veToggleAuxItem = function(idx, val, checked) {
                var row = window.veRows[idx];
                if (!row) return;
                if (!Array.isArray(row.auxiliary)) row.auxiliary = [];
                var pos = row.auxiliary.indexOf(val);
                if (checked && pos === -1) row.auxiliary.push(val);
                else if (!checked && pos !== -1) row.auxiliary.splice(pos, 1);
                veUpdateAuxBtn(idx);
            };

            window.veUpdateAuxBtn = function(idx) {
                var row = window.veRows[idx];
                if (!row) return;
                var btn = document.getElementById('veAuxBtn_' + idx);
                if (!btn) return;
                var auxArr = Array.isArray(row.auxiliary) ? row.auxiliary : [];
                if (auxArr.length) {
                    btn.textContent = veGetAuxDisplayText(auxArr);
                    btn.classList.add('has-value');
                    btn.classList.remove('needs-aux');
                } else {
                    // 检查该科目是否有辅助核算配置
                    var subjCode = (row.subject || '').split(' ')[0];
                    var subjObj = subjCode ? (window._veSubjectList || []).find(function(s){ return s.code === subjCode; }) : null;
                    var hasAuxCfg = subjObj && subjObj.aux && subjObj.aux !== '无' && subjObj.aux.trim() !== '';
                    btn.textContent = hasAuxCfg ? '⚑ 需选辅助项' : '请选择...';
                    btn.classList.remove('has-value');
                    btn.classList.toggle('needs-aux', !!hasAuxCfg);
                }
            };

            window.veHideAC = function(id) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            };

            function vePositionAC(dropdown, inputEl) {
                var rect = inputEl.getBoundingClientRect();
                dropdown.style.top  = (rect.bottom + 2) + 'px';
                dropdown.style.left = rect.left + 'px';
                dropdown.style.width = Math.max(rect.width, 240) + 'px';
                dropdown.style.display = 'block';
            }

            window.veShowSubjectAC = function(idx, val, showAll) {
                var input = document.getElementById('veSubjInput_' + idx);
                var dropdown = document.getElementById('veSubjAC');
                if (!input || !dropdown) return;
                dropdown._veType = 'subj';
                dropdown._veIdx = idx;
                var q = (val || '').trim().toLowerCase();
                var list = window._veSubjectList || [];
                var matches;
                if (!q || showAll) {
                    matches = list.slice(0, 80);
                } else {
                    matches = list.filter(function(s) {
                        var code = (s.code || '').toString().toLowerCase();
                        var name = (s.name || '').toLowerCase();
                        return code.indexOf(q) === 0 || name.indexOf(q) === 0;
                    }).slice(0, 50);
                }
                if (!matches.length) {
                    dropdown.innerHTML = '<div class="ve-ac-empty">无匹配科目</div>';
                } else {
                    dropdown.innerHTML = matches.map(function(s) {
                        var display = s.code + ' ' + s.name;
                        var safeDisplay = display.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
                        return '<div class="ve-ac-item" onmousedown="veSelectSubject(' + idx + ',\'' + safeDisplay + '\')">' +
                            '<span class="ve-ac-code">' + s.code + '</span>' + s.name + '</div>';
                    }).join('');
                }
                vePositionAC(dropdown, input);
            };

            window.veSelectSubject = function(idx, val) {
                window.veRows[idx].subject = val;
                window.veRows[idx].auxiliary = [];
                var input = document.getElementById('veSubjInput_' + idx);
                if (input) { input.value = val; input.focus(); }
                veHideAC('veSubjAC');
                // 根据新选科目刷新辅助核算按钮状态
                var code = val.split(' ')[0];
                var subj = (window._veSubjectList || []).find(function(s) { return s.code === code; });
                var hasAuxCfg = subj && subj.aux && subj.aux !== '无' && subj.aux.trim() !== '';
                var btn = document.getElementById('veAuxBtn_' + idx);
                if (btn) {
                    btn.textContent = hasAuxCfg ? '⚑ 需选辅助项' : '请选择...';
                    btn.classList.remove('has-value');
                    btn.classList.toggle('needs-aux', !!hasAuxCfg);
                }
            };

            window.veShowSummaryAC = function(idx, val, showAll) {
                var input = document.getElementById('veSumInput_' + idx);
                var dropdown = document.getElementById('veSumAC');
                if (!input || !dropdown) return;
                dropdown._veType = 'sum';
                dropdown._veIdx = idx;
                var q = (val || '').trim().toLowerCase();
                var tpls = (typeof getVoucherSummaryTemplates === 'function') ? getVoucherSummaryTemplates() : [];
                var matches;
                if (!q || showAll) {
                    matches = tpls.slice(0, 60);
                } else {
                    matches = tpls.filter(function(t) {
                        return (t.summary || '').toLowerCase().indexOf(q) === 0;
                    }).slice(0, 30);
                }
                if (!matches.length) { veHideAC('veSumAC'); return; }
                dropdown.innerHTML = matches.map(function(t) {
                    var s = (t.summary || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
                    return '<div class="ve-ac-item" onmousedown="veSelectSummary(' + idx + ',\'' + s + '\')">' + (t.summary || '') + '</div>';
                }).join('');
                vePositionAC(dropdown, input);
            };

            window.veSelectSummary = function(idx, val) {
                window.veRows[idx].summary = val;
                var input = document.getElementById('veSumInput_' + idx);
                if (input) { input.value = val; input.focus(); }
                veHideAC('veSumAC');
            };

            // 点击其他区域关闭浮层
            document.addEventListener('mousedown', function(e) {
                var sAC = document.getElementById('veSubjAC');
                var mAC = document.getElementById('veSumAC');
                var aAC = document.getElementById('veAuxAC');
                if (sAC && !sAC.contains(e.target)) veHideAC('veSubjAC');
                if (mAC && !mAC.contains(e.target)) veHideAC('veSumAC');
                // 辅助核算浮层：点击触发按钮本身由 veShowAuxAC 处理 toggle，其他区域关闭
                if (aAC && !aAC.contains(e.target) && !(e.target.classList && e.target.classList.contains('ve-aux-trigger'))) {
                    window.veHideAuxAC();
                }
                var rMC = document.getElementById('veRowMenuAC');
                if (rMC && !rMC.contains(e.target) && !(e.target.closest && e.target.closest('.ve-seq-cell'))) {
                    window.veHideRowMenu && window.veHideRowMenu();
                }
            }, true);

            window.veUpdateTotals = function () {
                var debit = 0, credit = 0;
                window.veRows.forEach(function (r) { debit += r.debit; credit += r.credit; });
                var td = document.getElementById('veTotalDebit');
                var tc = document.getElementById('veTotalCredit');
                if (td) td.textContent = debit.toFixed(2);
                if (tc) tc.textContent = credit.toFixed(2);
            };

            window.veAddRow = function () {
                window.veRows.push({ id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 });
                veRenderEntryTable();
            };

            // ── 复选框操作 ──
            window.veToggleRowCheck = function(rowId, checked) {
                window.veCheckedSet = window.veCheckedSet || new Set();
                if (checked) window.veCheckedSet.add(rowId);
                else window.veCheckedSet.delete(rowId);
                var row = document.getElementById('veRow_' + rowId);
                if (row) { if (checked) row.classList.add('ve-row-checked'); else row.classList.remove('ve-row-checked'); }
                var allChk = document.getElementById('veChkAll');
                if (allChk) {
                    allChk.checked = window.veCheckedSet.size === window.veRows.length && window.veRows.length > 0;
                    allChk.indeterminate = window.veCheckedSet.size > 0 && window.veCheckedSet.size < window.veRows.length;
                }
            };

            window.veToggleAllCheck = function(checked) {
                window.veCheckedSet = new Set();
                if (checked) window.veRows.forEach(function(r) { window.veCheckedSet.add(r.id); });
                veRenderEntryTable();
            };

            window.veClearCheckedRows = function() {
                if (!window.veCheckedSet || window.veCheckedSet.size === 0) { veShowToast('请先勾选要清空的行', 'warning'); return; }
                window.veRows = window.veRows.filter(function(r) { return !window.veCheckedSet.has(r.id); });
                if (window.veRows.length < 2) {
                    while (window.veRows.length < 2) window.veRows.push({ id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 });
                }
                window.veCheckedSet.clear();
                veRenderEntryTable();
                veShowToast('已清空选中行', 'success');
            };

            window.veInsertBelowChecked = function() {
                if (!window.veCheckedSet || window.veCheckedSet.size === 0) { veAddRow(); return; }
                var lastIdx = -1;
                window.veRows.forEach(function(r, i) { if (window.veCheckedSet.has(r.id)) lastIdx = i; });
                if (lastIdx === -1) { veAddRow(); return; }
                var src = window.veRows[lastIdx];
                var newRow = { id: window.veNextId++, summary: src.summary, subject: src.subject, auxiliary: (src.auxiliary || []).slice(), debit: 0, credit: 0 };
                window.veRows.splice(lastIdx + 1, 0, newRow);
                window.veCheckedSet.clear();
                veRenderEntryTable();
                veShowToast('已在选中行下方插入一行（复制摘要/科目）', 'success');
            };

            window.veCopyCheckedRow = function() {
                if (!window.veCheckedSet || window.veCheckedSet.size === 0) { veShowToast('请先勾选要复制的行', 'warning'); return; }
                var toCopy = window.veRows.filter(function(r) { return window.veCheckedSet.has(r.id); });
                toCopy.forEach(function(r) {
                    window.veRows.push({ id: window.veNextId++, summary: r.summary, subject: r.subject, auxiliary: (r.auxiliary || []).slice(), debit: r.debit, credit: r.credit });
                });
                window.veCheckedSet.clear();
                veRenderEntryTable();
                veShowToast('已复制 ' + toCopy.length + ' 行到末尾', 'success');
            };

            window.veDeleteEmptyRows = function () {
                var before = window.veRows.length;
                var filtered = window.veRows.filter(function (r) { return r.debit !== 0 || r.credit !== 0; });
                if (filtered.length >= 2) {
                    window.veRows = filtered;
                } else if (filtered.length === 1) {
                    window.veRows = filtered.concat([{ id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 }]);
                } else {
                    window.veRows = [
                        { id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 },
                        { id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 }
                    ];
                }
                var deleted = before - window.veRows.length;
                window.veCheckedSet.clear();
                veRenderEntryTable();
                veShowToast(deleted > 0 ? ('已删除 ' + deleted + ' 行空白分录') : '没有可删除的空白行', deleted > 0 ? 'success' : 'warning');
            };

            // ── 凭证号生成（纯四位数字，不带前缀）──
            window.veGenerateNextId = function () {
                var existing = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
                var maxNum = 0;
                existing.forEach(function (v) {
                    // 兼容旧格式 "转-0001" 和新格式 "0001"
                    var numStr = (v.id || '').replace(/^[^\d]*/, '').replace(/\D/g, '');
                    var num = parseInt(numStr) || 0;
                    if (num > maxNum) maxNum = num;
                });
                var s = String(maxNum + 1);
                while (s.length < 4) s = '0' + s;
                return s;
            };

            window.veUpdateVoucherNo = function () {
                var el = document.getElementById('veVoucherNo');
                if (el && !el.value) el.value = veGenerateNextId();
                var word = (document.getElementById('veVoucherWord') || {}).value || '转';
                var titleEl = document.getElementById('veVoucherTitle');
                if (titleEl) {
                    var typeMap = { '收': '收款凭证', '付': '付款凭证', '转': '转账凭证' };
                    titleEl.textContent = typeMap[word] || '转账凭证';
                }
            };

            // ── 分裂按钮下拉 ──
            window.veToggleDropdown = function (id, e) {
                e.stopPropagation();
                var el = document.getElementById(id);
                if (!el) return;
                var isShow = el.classList.contains('show');
                document.querySelectorAll('.ve-split-dropdown').forEach(function (d) { d.classList.remove('show'); });
                if (!isShow) el.classList.add('show');
            };

            window.veCloseDropdown = function (id) {
                var el = document.getElementById(id);
                if (el) el.classList.remove('show');
            };

            // ── 重置表单 ──
            window.veResetForm = function () {
                window.veRows = [
                    { id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 },
                    { id: window.veNextId++, summary: '', subject: '', auxiliary: [], debit: 0, credit: 0 }
                ];
                window.veCheckedSet = new Set();
                var noEl = document.getElementById('veVoucherNo');
                if (noEl) noEl.value = '';  // 清空后重新自动生成
                veRenderEntryTable();
                veUpdateVoucherNo();
            };

            // ── 工具栏操作 ──
            window.veDoNewVoucher = function () {
                veShowConfirm('新增凭证', '将清空当前表单内容，进入新建凭证状态，是否继续？', function () {
                    veResetForm();
                    veShowToast('已新建凭证', 'success');
                });
            };

            window.veConfirmClear = function () {
                veShowConfirm('清空确认', '确定要清空当前凭证内容吗？', function () {
                    veResetForm();
                    veShowToast('已清空', 'success');
                });
            };

            // 核心保存逻辑（不弹 Toast）
            window.veSaveVoucher = function () {
                var word   = (document.getElementById('veVoucherWord')  || {}).value || '转';
                var date   = (document.getElementById('veDateInput')    || {}).value || new Date().toISOString().split('T')[0];
                var attach = parseInt((document.getElementById('veAttachCount') || {}).value) || 0;
                // 凭证号：优先用输入框中用户填写的值，否则自动生成
                var noEl   = document.getElementById('veVoucherNo');
                var noVal  = (noEl ? noEl.value : '').replace(/\D/g, '');
                if (!noVal) noVal = veGenerateNextId();
                while (noVal.length < 4) noVal = '0' + noVal;
                var voucherId = word + '-' + noVal;   // 保留凭证字前缀，如"转-0006"
                var totalDebit = 0;
                // 只保存有实际内容的分录行（摘要/科目/金额任一非空）
                var lines = window.veRows.filter(function(r) {
                    return (r.summary && r.summary.trim()) || (r.subject && r.subject.trim()) || r.debit !== 0 || r.credit !== 0;
                }).map(function (r) {
                    totalDebit += r.debit;
                    // 规范化 auxiliary 为数组
                    var auxArr = Array.isArray(r.auxiliary) ? r.auxiliary
                        : (r.auxiliary && r.auxiliary !== '无' && r.auxiliary !== '' ? [r.auxiliary] : []);
                    var auxType = '', auxCode = '', auxName = '';
                    var auxDisplayArr = auxArr.filter(function(v) { return v && v !== '无'; }).map(function(v) {
                        if (v.indexOf('|||') !== -1) {
                            var p = v.split('|||');
                            if (!auxType) { auxType = p[0]||''; auxCode = p[1]||''; auxName = p[2]||''; }
                            return p[2] || p[1] || '';
                        }
                        return v;
                    });
                    var auxDisplay = auxDisplayArr.join(', ');
                    return {
                        summary: r.summary, subject: r.subject, account: r.subject,
                        auxiliary: auxDisplay, aux: auxDisplay,
                        auxType: auxType, auxCode: auxCode, auxName: auxName,
                        debit: r.debit, credit: r.credit
                    };
                });
                var voucher = {
                    id: voucherId,
                    date: date,
                    summary: (window.veRows[0] && window.veRows[0].summary) || '',
                    amount: totalDebit.toFixed(2),
                    user: sessionStorage.getItem('currentUser') || 'system',
                    status: '待审核',
                    attachCount: attach,
                    lines: lines
                };
                var existing = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
                existing.push(voucher);
                sessionStorage.setItem('ManualVouchers', JSON.stringify(existing));
                if (noEl) noEl.value = voucherId;
                return voucherId;
            };

            window.veDoSave = function () {
                var id = veSaveVoucher();
                veShowToast('凭证 ' + id + ' 已保存，状态：待审核', 'success');
            };

            window.veDoSaveNew = function () {
                veSaveVoucher();
                veShowToast('保存成功，已进入下一张新凭证', 'success');
                setTimeout(veResetForm, 600);
            };

            window.veDoSaveDraft = function () {
                veShowToast('已保存为草稿，可从「引入草稿凭证」找回', 'success');
            };

            window.veDoSubmit = function () {
                var debit = 0, credit = 0;
                window.veRows.forEach(function (r) { debit += r.debit; credit += r.credit; });
                var validRows = window.veRows.filter(function (r) { return r.subject.trim() !== ''; });
                if (validRows.length < 2) { veShowToast('至少需要2行有效分录', 'error'); return; }
                if (Math.abs(debit - credit) > 0.001) { veShowToast('借贷不平衡，请检查分录金额', 'error'); return; }
                veSaveVoucher();
                veShowToast('凭证已提交，进入审核流程', 'success');
            };

            // ── 常用凭证弹窗 ──
            window.veOpenCommonVoucher = function () {
                window.veSelectedCommonIdx = -1;
                window.veFilteredVouchers = window.veCommonVouchers.slice();
                veRenderCommonTable();
                veOpenModal('veModalCommon');
            };

            window.veRenderCommonTable = function () {
                var tbody = document.getElementById('veCommonBody');
                var info  = document.getElementById('veCommonInfo');
                if (!tbody) return;
                var html = '';
                window.veFilteredVouchers.forEach(function (v, idx) {
                    var sel = idx === window.veSelectedCommonIdx ? ' ve-selected' : '';
                    html += '<tr class="' + sel + '" onclick="window.veSelectedCommonIdx=' + idx + ';veRenderCommonTable()" ondblclick="window.veSelectedCommonIdx=' + idx + ';veDoImportCommon()">' +
                        '<td style="text-align:center;">' + v.seq + '</td>' +
                        '<td>' + v.code + '</td>' +
                        '<td>' + v.name + '</td>' +
                        '<td>' + v.type + '</td>' +
                        '<td style="text-align:center;">' + v.attach + '</td>' +
                        '<td>' + v.category + '</td>' +
                    '</tr>';
                });
                tbody.innerHTML = html;
                if (info) info.textContent = '共' + window.veFilteredVouchers.length + '条记录';
            };

            window.veFilterCommon = function () {
                var kw = ((document.getElementById('veCommonKeyword') || {}).value || '').trim().toLowerCase();
                if (!kw) {
                    window.veFilteredVouchers = window.veCommonVouchers.slice();
                } else {
                    window.veFilteredVouchers = window.veCommonVouchers.filter(function (v) {
                        return v.code.toLowerCase().indexOf(kw) >= 0 || v.name.toLowerCase().indexOf(kw) >= 0 || v.category.toLowerCase().indexOf(kw) >= 0;
                    });
                }
                window.veSelectedCommonIdx = -1;
                veRenderCommonTable();
            };

            window.veDoImportCommon = function () {
                if (window.veSelectedCommonIdx < 0) { veShowToast('请先选择一条常用凭证', 'warning'); return; }
                var selected = window.veFilteredVouchers[window.veSelectedCommonIdx];
                var hasContent = window.veRows.some(function (r) { return r.subject.trim() !== '' || r.debit !== 0 || r.credit !== 0; });
                if (hasContent) {
                    veShowConfirm('引入确认', '引入「' + selected.name + '」将覆盖当前分录内容，是否继续？', function () {
                        veImportTemplate(selected);
                    });
                } else {
                    veImportTemplate(selected);
                }
                veCloseModal('veModalCommon');
            };

            window.veImportTemplate = function (v) {
                window.veRows = [
                    { id: window.veNextId++, summary: v.name, subject: '（请选择科目）', auxiliary: '无', debit: 0, credit: 0 },
                    { id: window.veNextId++, summary: v.name, subject: '（请选择科目）', auxiliary: '无', debit: 0, credit: 0 }
                ];
                veRenderEntryTable();
                veShowToast('已引入「' + v.name + '」的分录模板，请填写金额', 'success');
            };

            // ── 草稿弹窗 ──
            window.veOpenDraft = function () { veOpenModal('veModalDraft'); };

            window.veToggleAllDraft = function (chk) {
                document.querySelectorAll('#veDraftBody input[type=checkbox]').forEach(function (c) { c.checked = chk.checked; });
                veUpdateDraftDeleteBtn();
            };

            window.veUpdateDraftDeleteBtn = function () {
                var any = document.querySelectorAll('#veDraftBody input[type=checkbox]:checked').length > 0;
                var btn = document.getElementById('veBtnDeleteDraft');
                if (btn) btn.disabled = !any;
            };

            window.veDoImportDraft = function () {
                veShowToast('草稿列表为空，无可引入内容', 'warning');
                veCloseModal('veModalDraft');
            };

            // ── 保存为常用凭证弹窗 ──
            window.veOpenSaveTemplate = function () {
                ['veTmplCode', 'veTmplDesc'].forEach(function (id) {
                    var el = document.getElementById(id); if (el) el.value = '';
                });
                var cat = document.getElementById('veTmplCategory'); if (cat) cat.value = '';
                veOpenModal('veModalSaveTemplate');
            };

            window.veDoSaveTemplate = function () {
                var code = ((document.getElementById('veTmplCode') || {}).value || '').trim();
                var desc = ((document.getElementById('veTmplDesc') || {}).value || '').trim();
                var cat  = ((document.getElementById('veTmplCategory') || {}).value || '');
                if (!code) { veShowToast('请填写编码', 'warning'); return; }
                if (!desc) { veShowToast('请填写说明', 'warning'); return; }
                if (!cat)  { veShowToast('请选择所属分类', 'warning'); return; }
                veCloseModal('veModalSaveTemplate');
                veShowToast('已保存为常用凭证', 'success');
            };

            // ── 弹窗工具 ──
            window.veOpenModal = function (id) {
                var el = document.getElementById(id); if (el) el.classList.add('show');
            };

            window.veCloseModal = function (id) {
                var el = document.getElementById(id); if (el) el.classList.remove('show');
            };

            window.veShowConfirm = function (title, msg, cb) {
                var tEl = document.getElementById('veConfirmTitle');
                var mEl = document.getElementById('veConfirmMsg');
                var ok  = document.getElementById('veConfirmOkBtn');
                if (tEl) tEl.textContent = title;
                if (mEl) mEl.textContent = msg;
                window.veConfirmCallback = cb;
                if (ok) ok.onclick = function () {
                    veCloseModal('veModalConfirm');
                    if (window.veConfirmCallback) window.veConfirmCallback();
                };
                veOpenModal('veModalConfirm');
            };

            // ── Toast ──
            window.veShowToast = function (msg, type) {
                type = type || 'default';
                var container = document.getElementById('veToastContainer');
                if (!container) return;
                var toast = document.createElement('div');
                toast.className = 've-toast' + (type !== 'default' ? ' ' + type : '');
                toast.textContent = msg;
                container.appendChild(toast);
                setTimeout(function () {
                    toast.style.opacity = '0';
                    toast.style.transition = 'opacity 0.3s';
                    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
                }, 2500);
            };

            // 遮罩点击关闭弹窗
            document.querySelectorAll('.ve-modal-overlay').forEach(function (overlay) {
                overlay.addEventListener('click', function (e) {
                    if (e.target === overlay) overlay.classList.remove('show');
                });
            });

            // 全局点击关闭下拉
            document.addEventListener('click', function () {
                document.querySelectorAll('.ve-split-dropdown').forEach(function (d) { d.classList.remove('show'); });
            });

            // ── 编辑模式：从凭证审核中心跳转进来时预填数据 ──────────────
            if (window._voucherEditId) {
                var editId = window._voucherEditId;
                window._voucherEditId = null;
                var allV = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
                var editV = allV.find(function(v) { return v.id === editId; });
                if (editV) {
                    // 回填凭证字
                    var wordMatch = editId.match(/^([^\d-]+)/);
                    var editWord = wordMatch ? wordMatch[1] : '转';
                    var wordEl2 = document.getElementById('veVoucherWord');
                    if (wordEl2) wordEl2.value = editWord;
                    // 回填日期
                    var dateEl2 = document.getElementById('veDateInput');
                    if (dateEl2 && editV.date) dateEl2.value = editV.date;
                    // 显示凭证号（只读）
                    var noEl2 = document.getElementById('veVoucherNo');
                    if (noEl2) { noEl2.value = editId; noEl2.readOnly = true; }
                    // 回填分录行
                    var nextRowId = 0;
                    window.veRows = (editV.lines || []).map(function(ln) {
                        nextRowId++;
                        var subj = ln.subject || ln.account || '';
                        return { id: nextRowId, summary: ln.summary || '', subject: subj, auxiliary: ln.auxiliary || '无', debit: parseFloat(ln.debit) || 0, credit: parseFloat(ln.credit) || 0 };
                    });
                    while (window.veRows.length < 2) { window.veRows.push({ id: ++nextRowId, summary: '', subject: '', auxiliary: '无', debit: 0, credit: 0 }); }
                    window.veNextId = nextRowId + 1;
                    // 覆盖保存逻辑 → 更新已有凭证而不是新增
                    window.veSaveVoucher = function() {
                        var w  = (document.getElementById('veVoucherWord') || {}).value || editWord;
                        var d  = (document.getElementById('veDateInput')   || {}).value || editV.date;
                        var att = parseInt((document.getElementById('veAttachCount') || {}).value) || 0;
                        var totalD = 0;
                        var ls = window.veRows.map(function(r) {
                            totalD += r.debit;
                            return { summary: r.summary, subject: r.subject, account: r.subject, auxiliary: r.auxiliary, debit: r.debit, credit: r.credit };
                        });
                        var store = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
                        var i = store.findIndex(function(v) { return v.id === editId; });
                        if (i !== -1) {
                            // 凭证字变更时同步更新 ID（保留原序号，如 转-0009 → 付-0009）
                            var savedId = editId;
                            if (w && w !== editWord) {
                                var seqPart = editId.replace(/^[^\d]*/, '');
                                savedId = w + '-' + seqPart;
                                store[i].id = savedId;
                                store[i].type = w === '收' ? '收款凭证' : w === '付' ? '付款凭证' : '转账凭证';
                            }
                            store[i].date        = d;
                            store[i].attachCount = att;
                            store[i].amount      = totalD.toFixed(2);
                            store[i].summary     = (window.veRows[0] && window.veRows[0].summary) || store[i].summary;
                            store[i].lines       = ls;
                            sessionStorage.setItem('ManualVouchers', JSON.stringify(store));
                        }
                        return savedId || editId;
                    };
                    // 提示
                    setTimeout(function() { veShowToast('已载入凭证 ' + editId + '，修改后点击保存', 'success'); }, 100);
                }
            }

            // 初始化
            veUpdateVoucherNo();
            veRenderEntryTable();
        }, 0);

    contentArea.innerHTML = contentHTML;

};

// =========================================================================
// FinanceVoucherAudit
// =========================================================================
window.VM_MODULES['FinanceVoucherAudit'] = function(contentArea, contentHTML, moduleCode) {
    const allVouchers = window.getManualVouchers
        ? window.getManualVouchers()
        : JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
    const statusWeight = { "待审核": 1, "已审核": 2, "已过账": 3, "已记账": 3, "已驳回": 4, "已冲销": 5, "已作废": 6 };
    allVouchers.sort((a, b) => (statusWeight[a.status] || 9) - (statusWeight[b.status] || 9));

    window.getCurrentLoginName = function() {
        return sessionStorage.getItem("CurrentUserName")
            || localStorage.getItem("CurrentUserName")
            || "当前用户";
    };

    window.getSelectedVoucherIds = function() {
        const ids = Array.from(document.querySelectorAll(".voucher-select:checked"))
            .map(cb => cb.dataset.voucherId)
            .filter(Boolean);
        return Array.from(new Set(ids));
    };

    // ── 凭证打印 ──────────────────────────────────────────────────────────────
    window.printSelectedVouchers = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) { alert("请先勾选要打印的凭证。"); return; }

        const all = window.getManualVouchers();
        const selected = ids.map(id => all.find(v => v.id === id)).filter(Boolean);
        if (!selected.length) { alert("未找到对应凭证数据。"); return; }

        const BUILTIN = {
            "1001":"库存现金","1002":"银行存款","1012":"其他货币资金",
            "1101":"短期投资","1121":"应收票据","1122":"应收账款",
            "1123":"预付账款","1131":"应收股利","1132":"应收利息",
            "1221":"其他应收款","1231":"坏账准备","1401":"物资采购",
            "1402":"在途物资","1403":"原材料","1405":"库存商品",
            "2001":"短期借款","2201":"应付票据","2202":"应付账款",
            "2203":"预收账款","2211":"应付职工薪酬","2221":"应交税费",
            "222101":"应交增值税","222102":"应交城市维建税",
            "222103":"应交教育费附加","222104":"应交地方教育附加",
            "222105":"应交个人所得税","2231":"应付利息",
            "2241":"其他应付款","2501":"长期借款",
            "3001":"实收资本","3002":"资本公积",
            "3103":"本年利润","3104":"利润分配",
            "4001":"实收资本","4002":"资本公积",
            "4103":"本年利润","4104":"利润分配",
            "5001":"主营业务收入","5101":"其他业务收入",
            "5201":"营业外收入","5301":"主营业务成本","5401":"主营业务成本",
            "5403":"税金及附加","5601":"管理费用","5701":"财务费用",
            "6001":"主营业务收入","6002":"其他业务收入",
            "6051":"利息收入","6111":"投资收益","6301":"营业外收入",
            "6401":"主营业务成本","6402":"其他业务成本",
            "6403":"税金及附加","6601":"销售费用","6602":"管理费用",
            "6603":"财务费用","6701":"资产减值损失",
            "6711":"营业外支出","6801":"所得税费用"
        };
        const storedSubjects = (() => { try { return JSON.parse(sessionStorage.getItem('AcctSubjects') || '[]'); } catch(e) { return []; } })();
        function resolveSubjectName(code, accountStr) {
            let name = '';
            const s = storedSubjects.find(s => (s.code||'').toString().trim() === code);
            if (s && s.name) name = s.name;
            if (!name) {
                if (BUILTIN[code]) name = BUILTIN[code];
                else {
                    const pk = Object.keys(BUILTIN).find(k => code.startsWith(k) && k.length >= 4);
                    if (pk) name = BUILTIN[pk];
                }
            }
            if (!name && accountStr) {
                const m = accountStr.match(/^[0-9-]+\s+(.+)$/);
                if (m) name = m[1].trim();
            }
            return name;
        }

        function buildVoucherBox(v) {
            const dateParts = (v.date || '').split('-');
            const y = dateParts[0] || '', m = dateParts[1] || '', d = dateParts[2] || '';
            const firstChar = (v.id || '').charAt(0);
            const wordText = firstChar ? firstChar + '字' : '';
            const seqNum = (v.id || '').replace(/\D/g,'');
            const titleText = v.isRed ? '红字记账凭证' : '记账凭证';
            const minRows = 5;
            const loopCount = Math.max((v.lines||[]).length, minRows);
            let linesHTML = '';
            let totalDebit = 0, totalCredit = 0;

            for (let i = 0; i < loopCount; i++) {
                const line = (v.lines || [])[i] || {};
                const rawSummary = line.summary || line.zy || '';
                const accountStr = line.account || line.subject || '';
                let code = (line.accountCode || '').toString().trim();
                let name = (line.accountName || '').toString().trim();
                if (!code || !name) {
                    const m2 = accountStr.match(/^([0-9-]+)\s*(.*)$/);
                    if (m2) { if (!code) code = m2[1]; if (!name) name = m2[2].trim(); }
                    else if (/^[0-9-]+$/.test(accountStr)) { if (!code) code = accountStr; }
                }
                if (!name && code) name = resolveSubjectName(code, accountStr);
                const auxDisplay = line.auxCode ? `${line.auxCode} ${line.auxName||''}`.trim()
                    : (line.aux || line.auxiliary || '');
                const debitVal  = (line.debit  || line.jf || '').toString().replace(/,/g, '');
                const creditVal = (line.credit || line.df || '').toString().replace(/,/g, '');
                totalDebit  += parseFloat(debitVal)  || 0;
                totalCredit += parseFloat(creditVal) || 0;
                const rowStyle = v.isRed ? 'color:red;' : '';
                const subjectCell = [code, name].filter(s => s && s !== '-').join(' ') || '-';
                linesHTML += `
                <tr style="${rowStyle}">
                    <td style="padding:0 8px;">${rawSummary}</td>
                    <td style="padding:0 8px;">${subjectCell}</td>
                    <td style="padding:4px 8px;white-space:normal;word-break:break-all;">${auxDisplay || '-'}</td>
                    <td class="money-grid-bg">${debitVal}</td>
                    <td class="money-grid-bg">${creditVal}</td>
                </tr>`;
            }
            const fmt = n => n === 0 ? '' : n.toFixed(2);
            return `
            <div class="voucher-box" style="${v.isRed ? 'border:2px solid #e74c3c;' : ''}">
                <div class="v-title-container">
                    <div class="v-title">${titleText}</div>
                    <div style="position:absolute;right:10px;top:10px;font-size:14px;">${wordText}第 ${seqNum} 号</div>
                </div>
                <div class="v-header-info">
                    <div style="visibility:hidden;">占位</div>
                    <div class="v-date-group"><span>${y}</span>年<span>${m}</span>月<span>${d}</span>日</div>
                    <div style="visibility:hidden;">占位</div>
                </div>
                <table class="v-table">
                    <thead>
                        <tr>
                            <th rowspan="2" style="width:15%;">摘 要</th>
                            <th rowspan="2" style="width:25%;">科目名称</th>
                            <th rowspan="2" style="width:20%;">辅助项</th>
                            <th style="width:20%;">借 方 金 额</th>
                            <th style="width:20%;">贷 方 金 额</th>
                        </tr>
                        <tr class="money-header-row">
                            <th style="padding:0;"><div style="border:none;"><span>千</span><span>百</span><span>十</span><span>万</span><span>千</span><span>百</span><span>十</span><span>元</span><span>角</span><span>分</span></div></th>
                            <th style="padding:0;"><div style="border:none;"><span>千</span><span>百</span><span>十</span><span>万</span><span>千</span><span>百</span><span>十</span><span>元</span><span>角</span><span>分</span></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${linesHTML}
                        <tr style="${v.isRed ? 'color:red;' : ''}">
                            <td colspan="2" style="text-align:left;padding-left:20px;font-weight:bold;">合　　计</td>
                            <td></td>
                            <td class="money-grid-bg"><span style="float:left;font-size:12px;margin-top:3px;margin-left:5px;">¥</span>${fmt(totalDebit)}</td>
                            <td class="money-grid-bg"><span style="float:left;font-size:12px;margin-top:3px;margin-left:5px;">¥</span>${fmt(totalCredit)}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="attachment-side">附<br>单<br>据<br><br><strong>1</strong><br><br>张</div>
                <div class="v-footer">
                    <div>财务主管：<span>___________</span></div>
                    <div>记账：<span>${v.bookkeeperUser || ''}</span></div>
                    <div>出纳：<span>${v.cashierUser || ''}</span></div>
                    <div>审核：<span>${v.auditUser || ''}</span></div>
                    <div>制单：<span>${v.user || ''}</span></div>
                </div>
            </div>`;
        }

        const printCss = `
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #f5f5f5; padding: 20px; font-family: "SimSun","Songti SC",serif; }
            .voucher-box {
                font-family: "SimSun","Songti SC",serif; color: #333;
                width: 980px; margin: 0 auto 40px; padding: 30px;
                background: #fff; position: relative;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1); border: 1px solid #ddd;
                page-break-after: always;
            }
            .voucher-box:last-child { page-break-after: avoid; }
            .v-title-container { text-align:center; margin-bottom:10px; position:relative; }
            .v-title { font-size:36px; font-weight:bold; letter-spacing:15px; display:inline-block;
                border-bottom:3px double #333; padding-bottom:5px; margin-bottom:5px; text-shadow:0.5px 0 0 #333; }
            .v-header-info { display:flex; justify-content:space-between; align-items:flex-end;
                margin-bottom:5px; font-size:15px; padding:0 5px; }
            .v-date-group span { display:inline-block; border-bottom:1px solid #333;
                width:50px; text-align:center; margin:0 2px; font-family:Arial; }
            .v-table { width:100%; border-collapse:collapse; border:2px solid #333; }
            .v-table th, .v-table td { border:1px solid #333; height:40px; vertical-align:middle; font-size:15px; }
            .v-table th { text-align:center; font-weight:bold; padding:5px; }
            .money-grid-bg {
                background-image: linear-gradient(to right, transparent 95%, #ddd 95%);
                background-size: 9.09% 100%;
                font-family:'Courier New',monospace; font-size:18px; font-weight:bold;
                letter-spacing:6px; text-align:right; padding-right:3px; overflow:hidden;
            }
            .money-header-row div { display:flex; justify-content:space-between; padding:0 2px;
                color:#666; font-weight:normal; transform:scale(0.95); font-size:12px; }
            .money-header-row span { flex:1; text-align:center; border-right:1px solid #eee; }
            .money-header-row span:last-child { border:0; }
            .v-footer { margin-top:15px; display:flex; justify-content:space-between; font-size:14px; padding:0 10px; }
            .v-footer span { display:inline-block; width:70px; border-bottom:1px solid #333; height:20px; text-align:center; }
            .attachment-side { position:absolute; right:-25px; top:110px; width:20px; font-size:13px; line-height:1.2; text-align:center; }
            @media print {
                body { background:#fff; padding:0; }
                .voucher-box { box-shadow:none; border:1px solid #333; margin:0 auto 0; }
                .no-print { display:none !important; }
            }
        </style>`;

        const vouchersHTML = selected.map(buildVoucherBox).join('');
        const company = (window.CURRENT_SESSION || {}).company || '财务管理系统';
        const html = `<!DOCTYPE html>
<html lang="zh-CN"><head>
<meta charset="UTF-8">
<title>凭证打印 - ${company}</title>
${printCss}
</head><body>
<div class="no-print" style="text-align:center;margin-bottom:20px;">
    <button onclick="window.print()" style="padding:8px 24px;font-size:14px;background:#3498db;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-right:12px;">🖨 打印</button>
    <button onclick="window.close()" style="padding:8px 24px;font-size:14px;background:#95a5a6;color:#fff;border:none;border-radius:4px;cursor:pointer;">关闭</button>
    <span style="margin-left:20px;color:#666;font-size:13px;">共 ${selected.length} 张凭证</span>
</div>
${vouchersHTML}
</body></html>`;

        const win = window.open('', '_blank', 'width=1100,height=800,scrollbars=yes');
        if (!win) { alert('弹出窗口被浏览器拦截，请允许此网站的弹出窗口后重试。'); return; }
        win.document.write(html);
        win.document.close();
    };

    window.updateVoucherActionButtons = function() {
        const hasSelection = window.getSelectedVoucherIds().length > 0;
        document.querySelectorAll(".voucher-center__action").forEach(btn => {
            btn.disabled = !hasSelection;
        });
    };

    window.toggleVoucherGroupSelection = function(checkbox) {
        if (!checkbox) return;
        const voucherId = checkbox.dataset.voucherId;
        if (!voucherId) return;
        document.querySelectorAll(`.voucher-select[data-voucher-id="${voucherId}"]`).forEach(cb => {
            cb.checked = checkbox.checked;
        });
        window.updateVoucherActionButtons();
    };

    window.toggleAllVoucherSelection = function(checked) {
        document.querySelectorAll(".voucher-select").forEach(cb => {
            cb.checked = checked;
        });
        window.updateVoucherActionButtons();
    };

    window.applyVoucherAction = function(action) {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            alert("请先选择凭证。");
            return;
        }
        const actionMap = {
            audit: "审核",
            unaudit: "反审",
            post: "记账",
            reverse: "冲销",
            void: "作废"
        };
        const actionLabel = actionMap[action] || "操作";
        if (!confirm(`确认对选中凭证执行${actionLabel}吗？`)) return;

        let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        const idSet = new Set(ids);

        if (action === "audit") {
            list.forEach(item => {
                if (idSet.has(item.id)) {
                    if (item.status === "已作废" || item.status === "已冲销") return;
                    item.status = "已审核";
                }
            });
        } else if (action === "unaudit") {
            list.forEach(item => {
                if (idSet.has(item.id)) {
                    if (item.status === "已作废" || item.status === "已冲销") return;
                    item.status = "待审核";
                }
            });
        } else if (action === "post") {
            list.forEach(item => {
                if (idSet.has(item.id)) {
                    if (item.status === "已作废" || item.status === "已冲销") return;
                    item.status = "已记账";
                }
            });
        } else if (action === "reverse") {
            const stripRevSuffix = (id) => (id || "").toString().replace(/-REV.*$/i, "");
            const parseIdParts = (id) => {
                const base = stripRevSuffix(id);
                const match = base.match(/^(.*?)(\d+)\s*$/);
                if (!match) return { base, prefix: base, num: null, width: 0 };
                return {
                    base,
                    prefix: match[1],
                    num: parseInt(match[2], 10),
                    width: match[2].length
                };
            };
            const buildReverseSummary = (voucher) => {
                const { num } = parseIdParts(voucher.id);
                const dateText = (voucher.date || "").toString();
                let month = "";
                let day = "";
                const date = new Date(dateText);
                if (!Number.isNaN(date.getTime())) {
                    month = `${date.getMonth() + 1}`;
                    day = `${date.getDate()}`;
                } else if (dateText.includes("-")) {
                    const parts = dateText.split("-");
                    if (parts.length >= 3) {
                        month = `${parseInt(parts[1], 10) || ""}`;
                        day = `${parseInt(parts[2], 10) || ""}`;
                    }
                }
                const seqText = num !== null ? `${num}` : (stripRevSuffix(voucher.id) || "");
                const datePart = month && day ? `${month} 月 ${day} 日` : "";
                const rawSummary = (voucher.summary || (voucher.lines && voucher.lines[0] && (voucher.lines[0].summary || voucher.lines[0].digest)) || "").toString();
                const cleanSummary = rawSummary.replace(/^冲销[:：]?\s*/i, "").trim();
                const suffix = cleanSummary ? `：${cleanSummary}` : "";
                if (datePart && seqText) return `冲销 ${datePart}第 ${seqText} 号凭证${suffix}`;
                if (seqText) return `冲销 第 ${seqText} 号凭证${suffix}`;
                return "冲销凭证";
            };
            const generateReverseId = (list, originalId) => {
                const parts = parseIdParts(originalId);
                if (!parts.width) return stripRevSuffix(originalId) || originalId;
                let maxSeq = parts.num || 0;
                list.forEach(item => {
                    const base = stripRevSuffix(item.id);
                    if (!base.startsWith(parts.prefix)) return;
                    const match = base.match(/^(.*?)(\d+)\s*$/);
                    if (!match) return;
                    if (match[1] !== parts.prefix) return;
                    const num = parseInt(match[2], 10);
                    if (Number.isFinite(num) && num > maxSeq) maxSeq = num;
                });
                const nextSeq = maxSeq + 1;
                const padded = String(nextSeq).padStart(parts.width, "0");
                return `${parts.prefix}${padded}`;
            };
            const newVouchers = [];
            list.forEach(item => {
                if (!idSet.has(item.id)) return;
                if (item.status === "已冲销" || item.status === "已作废") return;
                item.status = "已冲销";
                const redVoucher = JSON.parse(JSON.stringify(item));
                redVoucher.id = generateReverseId(list, item.id);
                redVoucher.date = new Date().toISOString().split('T')[0];
                redVoucher.status = "已记账";
                redVoucher.amount = -Math.abs(item.amount);
                redVoucher.summary = buildReverseSummary(item);
                redVoucher.isRed = true;
                redVoucher.reverseOf = item.id;
                if (redVoucher.lines) {
                    redVoucher.lines.forEach(line => {
                        if (line.debit) line.debit = -Math.abs(line.debit);
                        if (line.credit) line.credit = -Math.abs(line.credit);
                        if (line.summary !== undefined) line.summary = redVoucher.summary;
                        if (line.digest !== undefined) line.digest = redVoucher.summary;
                    });
                }
                newVouchers.push(redVoucher);
            });
            if (newVouchers.length) {
                list = [...newVouchers, ...list];
            }
        } else if (action === "void") {
            list.forEach(item => {
                if (!idSet.has(item.id)) return;
                if (item.status === "已作废" || item.status === "已冲销") return;
                item.voidedAt = new Date().toISOString();
                item.voidedBy = window.getCurrentLoginName ? window.getCurrentLoginName() : "系统";
                item.voidBackup = item.voidBackup || {
                    amount: item.amount,
                    lines: item.lines ? JSON.parse(JSON.stringify(item.lines)) : []
                };
                item.status = "已作废";
                item.amount = "0.00";
                if (item.lines) {
                    item.lines.forEach(line => {
                        line.debit = 0;
                        line.credit = 0;
                    });
                }
            });
        }

        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        loadContent('FinanceVoucherAudit');
    };

    window.deleteSelectedVouchers = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            alert("请先选择凭证。");
            return;
        }
        if (!confirm(`确认删除选中的 ${ids.length} 张凭证吗？此操作不可恢复。`)) return;
        const idSet = new Set(ids);
        const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        const next = list.filter(item => !idSet.has(item.id));
        if (next.length === list.length) {
            alert("未删除任何凭证。");
            return;
        }
        sessionStorage.setItem('ManualVouchers', JSON.stringify(next));
        loadContent('FinanceVoucherAudit');
    };

    window.openCashierReviewModal = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            alert("请先选择凭证。");
            return;
        }
        if (document.getElementById("cashier-review-modal")) return;
        const modal = document.createElement("div");
        modal.id = "cashier-review-modal";
        modal.style.cssText = "position:fixed; inset:0; background:rgba(15,23,42,0.45); display:flex; align-items:center; justify-content:center; z-index:9999;";
        modal.innerHTML = `
            <div style="background:#fff; padding:20px 24px; border-radius:12px; min-width:320px; box-shadow:0 12px 32px rgba(15,23,42,0.18);">
                <div style="font-size:16px; font-weight:600; margin-bottom:8px;">出纳复核</div>
                <div style="color:#475569; font-size:13px;">确认进行出纳签字吗？</div>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                    <button class="btn-primary btn-ghost" onclick="closeCashierReviewModal()">取消</button>
                    <button class="btn-primary" onclick="confirmCashierReview()">确认</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    };

    window.closeCashierReviewModal = function() {
        const modal = document.getElementById("cashier-review-modal");
        if (modal) modal.remove();
    };

    window.confirmCashierReview = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            window.closeCashierReviewModal();
            return;
        }
        const currentUser = window.getCurrentLoginName();
        let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        const idSet = new Set(ids);
        list.forEach(item => {
            if (!idSet.has(item.id)) return;
            item.cashierUser = currentUser;
            item.status = "已复核";
        });
        sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
        window.closeCashierReviewModal();
        loadContent('FinanceVoucherAudit');
    };

    // ── 推送选中凭证至外账帐套 ──
    window.pushSelectedVouchersToExternal = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) { alert('请先选择要推送的凭证。'); return; }

        const currentCode = sessionStorage.getItem('CurrentAcctSetCode');
        if (!currentCode) { alert('当前未选择帐套，请先在帐套管理中启用并切换帐套。'); return; }

        // 找到当前帐套在树中的节点，获取子帐套列表
        const treeData = JSON.parse(sessionStorage.getItem('AcctSetTree') || '[]');
        function findNode(nodes, code) {
            for (const n of nodes) {
                if (n.code === code) return n;
                if (n.children) { const r = findNode(n.children, code); if (r) return r; }
            }
            return null;
        }
        const sourceNode = findNode(treeData, currentCode);
        const children = (sourceNode && sourceNode.children || []).filter(c => c.status === 'enabled');
        if (!children.length) {
            alert('当前帐套「' + currentCode + '」没有已启用的子帐套，无法推送。\n请先在账套管理中创建并启用外账帐套。');
            return;
        }

        // 若有多个子帐套，弹出选择（当前仅 1 个时自动选择）
        let targetCode;
        if (children.length === 1) {
            targetCode = children[0].code;
        } else {
            const options = children.map((c, i) => `${i + 1}. ${c.name}（${c.code}）`).join('\n');
            const sel = prompt('请选择目标外账帐套（输入编号）：\n' + options, '1');
            const idx = parseInt(sel) - 1;
            if (isNaN(idx) || idx < 0 || idx >= children.length) { alert('取消推送。'); return; }
            targetCode = children[idx].code;
        }

        const targetSnapRaw = sessionStorage.getItem('AcctSetData_' + targetCode);
        if (!targetSnapRaw) {
            alert('目标帐套「' + targetCode + '」快照不存在，请先启用该帐套。');
            return;
        }

        // 读取推送模板（可选，无模板则全量复制选中凭证）
        const tplRaw = sessionStorage.getItem('PushTemplate_' + targetCode);
        const tpl = tplRaw ? JSON.parse(tplRaw) : null;

        // 获取选中凭证
        const allVouchers = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
        const idSet = new Set(ids);
        let selected = allVouchers.filter(v => idSet.has(v.id));

        // 应用模板规则（若有）
        if (tpl) {
            const statusSet = new Set(tpl.statusFilter || []);
            const excludePrefixes = (tpl.excludeAccountPrefixes || '').split(/[,，]/).map(s => s.trim()).filter(Boolean);
            selected = selected
                .filter(v => {
                    if (statusSet.size && !statusSet.has(v.status)) return false;
                    if (tpl.excludeSystemVouchers) {
                        if ((v.user || '').includes('期末结转') || (v.summary || '').includes('期末结转')) return false;
                    }
                    return true;
                })
                .map(v => {
                    if (!excludePrefixes.length) return JSON.parse(JSON.stringify(v));
                    const filteredLines = (v.lines || []).filter(line => {
                        const code = (line.accountCode || line.account || '').toString().trim().split(/\s+/)[0];
                        return !excludePrefixes.some(p => code.startsWith(p));
                    });
                    return Object.assign({}, v, { lines: filteredLines });
                })
                .filter(v => (v.lines || []).length > 0);
        } else {
            selected = selected.map(v => JSON.parse(JSON.stringify(v))); // 深拷贝
        }

        if (!selected.length) {
            alert('选中凭证经模板规则过滤后为空，无凭证可推送。\n请检查凭证状态或模板配置。');
            return;
        }

        if (!confirm(`确认将 ${selected.length} 张凭证推送至外账「${targetCode}」？\n（将追加/更新到目标帐套，不会删除目标已有的其他凭证）`)) return;

        // 追加到目标帐套（不覆盖，按 ID 去重更新）
        const targetSnap = JSON.parse(targetSnapRaw);
        const targetVouchers = JSON.parse(targetSnap.ManualVouchers || '[]');
        const targetIdMap = {};
        targetVouchers.forEach(v => { targetIdMap[v.id] = v; });
        let added = 0, updated = 0;
        selected.forEach(v => {
            if (targetIdMap[v.id]) { targetIdMap[v.id] = v; updated++; }
            else { targetIdMap[v.id] = v; added++; }
        });
        targetSnap.ManualVouchers = JSON.stringify(Object.values(targetIdMap));
        sessionStorage.setItem('AcctSetData_' + targetCode, JSON.stringify(targetSnap));

        const now = new Date().toLocaleString('zh-CN');
        sessionStorage.setItem('PushLog_' + targetCode, now);

        alert(`✅ 推送完成！\n新增：${added} 张  更新：${updated} 张\n目标帐套：${targetCode}（${now}）`);
    };

    window.exportSelectedVouchers = function() {
        const ids = window.getSelectedVoucherIds();
        if (!ids.length) {
            alert("请先选择凭证。");
            return;
        }
        const list = JSON.parse(sessionStorage.getItem('ManualVouchers') || "[]");
        const idSet = new Set(ids);
        const payload = list.filter(item => idSet.has(item.id));
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `vouchers_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const SOURCE_TYPE_LABELS = {
        waybill: "运单号",
        batch: "批次号",
        reimbursement: "报销单号",
        manual: "原单",
        mixed: "原单"
    };

    const normalizeSourceType = (value) => {
        const text = (value || "").toString().trim().toLowerCase();
        if (!text) return "";
        if (["waybill", "运单", "yd", "ship"].includes(text)) return "waybill";
        if (["batch", "批次", "pc"].includes(text)) return "batch";
        if (["reimbursement", "报销", "expense"].includes(text)) return "reimbursement";
        if (["none", "manual", "人工", "手工"].includes(text)) return "manual";
        return text;
    };

    const extractDocIdsFromSummary = (summary) => {
        const text = (summary || "").toString();
        if (!text) return { reimbursement: [], waybill: [], batch: [] };
        const pushUnique = (list, value) => {
            if (!value) return;
            if (!list.includes(value)) list.push(value);
        };
        const ids = {
            reimbursement: [],
            waybill: [],
            batch: []
        };
        const patterns = [
            { type: "reimbursement", regex: /\bBX\d{6,}(?:[-_]\d+)?\b/gi },
            { type: "waybill", regex: /\bYD\d{4,}(?:[-_]\d+)?\b/gi },
            { type: "batch", regex: /\b(?:PC|APC|ASH)\d{3,}(?:[-_]\d+)?\b/gi }
        ];
        patterns.forEach(({ type, regex }) => {
            let match;
            while ((match = regex.exec(text)) !== null) {
                pushUnique(ids[type], match[0]);
            }
        });
        return ids;
    };

    const inferDocsFromSummary = (voucher) => {
        const summary = (voucher.summary || "").toString();
        if (!summary) return null;
        const docMap = extractDocIdsFromSummary(summary);
        const entries = Object.entries(docMap).filter(([, ids]) => ids.length);
        if (!entries.length) return null;
        if (entries.length === 1) {
            const [type, ids] = entries[0];
            return { type, ids };
        }
        const mixedIds = entries.flatMap(([type, ids]) => {
            const label = SOURCE_TYPE_LABELS[type] || type;
            return ids.map((id) => `${label}: ${id}`);
        });
        return { type: "mixed", ids: mixedIds };
    };

    const extractDriverFromSummary = (summary) => {
        const text = (summary || "").toString().trim();
        if (!text) return "";
        let match = text.match(/司机[:：\s]*([A-Za-z0-9\u4e00-\u9fa5·]{1,20})/);
        if (match && match[1]) return match[1];
        match = text.match(/驾驶员[:：\s]*([A-Za-z0-9\u4e00-\u9fa5·]{1,20})/);
        if (match && match[1]) return match[1];
        const tokens = text
            .split(/[-—–~|/]/)
            .map((item) => item.trim())
            .filter(Boolean);
        if (tokens.length > 1) {
            const tail = tokens[tokens.length - 1];
            if (tail && !/\d/.test(tail) && tail.length <= 12) return tail;
        }
        return "";
    };

    const calcVoucherAmountFromLines = (voucher) => {
        if (!voucher) return 0;
        let debit = 0;
        let credit = 0;
        const lines = Array.isArray(voucher.lines) ? voucher.lines : [];
        lines.forEach((line) => {
            const d = parseFloat((line.debit || line.jf || "0").toString().replace(/,/g, ""));
            const c = parseFloat((line.credit || line.df || "0").toString().replace(/,/g, ""));
            if (Number.isFinite(d)) debit += d;
            if (Number.isFinite(c)) credit += c;
        });
        const total = Math.max(Math.abs(debit), Math.abs(credit));
        if (total > 0) return total;
        const fallback = parseFloat((voucher.amount || "0").toString().replace(/,/g, ""));
        return Number.isFinite(fallback) ? Math.abs(fallback) : 0;
    };

    const resolveRelatedDocs = (voucher) => {
        if (!voucher) return null;
        if (Array.isArray(voucher.relatedDocs) && voucher.relatedDocs.length) {
            const normalized = voucher.relatedDocs
                .map((doc) => {
                    const type = normalizeSourceType(doc.type || doc.category || doc.sourceType);
                    const id = (doc.id || doc.no || doc.code || "").toString().trim();
                    return type && id ? { type, id } : null;
                })
                .filter(Boolean);
            if (!normalized.length) return null;
            const typeSet = new Set(normalized.map((doc) => doc.type));
            if (typeSet.size === 1) {
                const type = normalized[0].type;
                const ids = normalized.map((doc) => doc.id);
                return { type, ids };
            }
            return { type: "mixed", ids: normalized.map((doc) => `${SOURCE_TYPE_LABELS[doc.type] || doc.type}: ${doc.id}`) };
        }
        if (Array.isArray(voucher.sourceDocs) && voucher.sourceDocs.length) {
            const type = normalizeSourceType(voucher.sourceDocType || voucher.sourceType || "waybill");
            const ids = voucher.sourceDocs.map((doc) => doc.toString().trim()).filter(Boolean);
            return ids.length ? { type, ids } : null;
        }
        if (voucher.sourceType && (voucher.sourceNo || voucher.sourceId)) {
            const type = normalizeSourceType(voucher.sourceType);
            const raw = (voucher.sourceNo || voucher.sourceId || "").toString().trim();
            if (!type || !raw) return null;
            const ids = raw
                .split(/[,，;\n]/)
                .map((val) => val.trim())
                .filter(Boolean);
            if (!ids.length) return null;
            if (!["waybill", "batch", "reimbursement", "manual", "mixed"].includes(type)) {
                const allWaybill = ids.every((id) => /^YD/i.test(id));
                const allBatch = ids.every((id) => /^PC/i.test(id));
                if (allWaybill) return { type: "waybill", ids };
                if (allBatch) return { type: "batch", ids };
            }
            return { type, ids };
        }
        const inferred = inferDocsFromSummary(voucher);
        if (inferred) return inferred;
        if (voucher.sourceType === "none") {
            return { type: "manual", ids: [] };
        }
        return null;
    };

    const parseMixedDocItem = (text) => {
        const raw = (text || "").toString().trim();
        if (!raw) return null;
        const match = raw.match(/^(运单号|批次号|报销单号)\s*[:：]\s*(.+)$/);
        if (!match) return null;
        const typeMap = { "运单号": "waybill", "批次号": "batch", "报销单号": "reimbursement" };
        const type = typeMap[match[1]];
        const id = (match[2] || "").toString().trim();
        if (!type || !id) return null;
        return { type, id };
    };

    const collectVoucherDocIds = (voucher, typeFilter = "") => {
        const info = resolveRelatedDocs(voucher);
        if (!info || !Array.isArray(info.ids) || !info.ids.length) return [];
        const normalizedType = normalizeSourceType(typeFilter);
        const ids = [];
        const pushUnique = (value) => {
            const raw = (value || "").toString().trim();
            if (!raw) return;
            if (!ids.includes(raw)) ids.push(raw);
        };
        const infoType = normalizeSourceType(info.type || "");
        if (["waybill", "batch", "reimbursement"].includes(infoType)) {
            if (normalizedType && normalizedType !== infoType) return [];
            info.ids.forEach(pushUnique);
            return ids;
        }
        info.ids.forEach((item) => {
            const mixed = parseMixedDocItem(item);
            if (!mixed) return;
            if (normalizedType && mixed.type !== normalizedType) return;
            pushUnique(mixed.id);
        });
        return ids;
    };

    window.refreshVoucherDocNoOptions = function (keepCurrent = false) {
        const typeEl = document.getElementById("voucher-doc-type");
        const noEl = document.getElementById("voucher-doc-no");
        if (!typeEl || !noEl) return;
        const type = normalizeSourceType(typeEl.value || "");
        const placeholderMap = {
            waybill: "所有运单号（可输入筛选）",
            batch: "所有批次号（可输入筛选）",
            reimbursement: "所有报销单号（可输入筛选）"
        };
        const nextPlaceholder = placeholderMap[type] || "所有单号（可输入筛选）";
        const current = (noEl.value || "").trim();
        if (!keepCurrent || /^所有(运单号|批次号|报销单号|单号)/.test(current)) {
            noEl.value = "";
        }
        noEl.placeholder = nextPlaceholder;
    };

    window.handleVoucherDocTypeChange = function () {
        window.refreshVoucherDocNoOptions(false);
    };

    window.openRelatedDocDrawer = function(trigger) {
        if (!trigger) return;
        const typeKey = trigger.dataset.docType || "";
        const ids = (trigger.dataset.docIds || "").split(",").map(s => s.trim()).filter(Boolean);
        const voucherId = trigger.dataset.voucherId || "-";
        const displayType = SOURCE_TYPE_LABELS[typeKey] || typeKey || "关联单";

        // ── 读取数据源 ──────────────────────────────────────────
        const waybills = JSON.parse(sessionStorage.getItem("BizWaybills") || "[]");
        const settlements = JSON.parse(sessionStorage.getItem("SettlementRecords") || "[]");
        const rcvList = JSON.parse(sessionStorage.getItem("ReceiptVouchers") || "[]");
        const vouchers = window.getManualVouchers ? window.getManualVouchers()
            : JSON.parse(sessionStorage.getItem("ManualVouchers") || "[]");
        const voucher = vouchers.find(item => item.id === voucherId);
        const fallbackAmount = calcVoucherAmountFromLines(voucher);

        const fmtAmt = (val) => {
            const n = parseFloat((val || "0").toString().replace(/,/g, ""));
            return isNaN(n) || n === 0 ? "-" : n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        };

        // ── 收集明细行 ───────────────────────────────────────────
        // 格式：[{no, date, route, amount, driver, status}]
        let detailRows = [];

        // 1. 对账单 SET-* / RCV-*：展开下属运单明细
        const primaryId = ids[0] || "";
        if (/^SET-/i.test(primaryId)) {
            // 从 SettlementRecords 查找
            const setRec = settlements.find(s => s.id === primaryId || s.settleNo === primaryId);
            if (setRec && Array.isArray(setRec.details) && setRec.details.length) {
                detailRows = setRec.details.map(d => ({
                    no: d.waybillNo || d.id || "-",
                    date: d.date || d.waybillDate || "-",
                    route: d.route || d.destination || "-",
                    amount: fmtAmt(d.amount || d.freightAmount || d.totalAmount),
                    driver: d.driver || d.driverName || "-",
                    status: d.status || "已结算"
                }));
            }
            // 兜底：从 BizWaybills 中找 settlementId 匹配的
            if (!detailRows.length) {
                const matched = waybills.filter(wb =>
                    wb.settlementId === primaryId || wb.settleNo === primaryId || wb.setId === primaryId
                );
                if (matched.length) {
                    detailRows = matched.map(wb => ({
                        no: wb.id || wb.orderNo || "-",
                        date: wb.date || wb.shipDate || "-",
                        route: (wb.origin || "") + (wb.destination ? " → " + wb.destination : ""),
                        amount: fmtAmt(wb.totalAmount || wb.freightAmount || wb.amount),
                        driver: wb.driver || wb.driverName || "-",
                        status: wb.status || "-"
                    }));
                }
            }
        } else if (/^RCV-/i.test(primaryId)) {
            const rcvRec = rcvList.find(r => r.id === primaryId);
            if (rcvRec && Array.isArray(rcvRec.details) && rcvRec.details.length) {
                detailRows = rcvRec.details.map(d => ({
                    no: d.waybillNo || d.id || "-",
                    date: d.date || "-",
                    route: d.route || "-",
                    amount: fmtAmt(d.amount || d.freightAmount),
                    driver: d.driver || d.driverName || "-",
                    status: d.status || "已收款"
                }));
            }
        }

        // 2. 若仍无明细，直接展示 ids 列表（运单号直查）
        if (!detailRows.length) {
            detailRows = ids.map(id => {
                const wb = waybills.find(w => w.id === id || w.orderNo === id);
                return {
                    no: id,
                    date: wb ? (wb.date || wb.shipDate || "-") : "-",
                    route: wb ? ((wb.origin || "") + (wb.destination ? " → " + wb.destination : "")) : "-",
                    amount: fmtAmt(wb ? (wb.totalAmount || wb.freightAmount || wb.amount) : fallbackAmount),
                    driver: wb ? (wb.driver || wb.driverName || "-") : "-",
                    status: wb ? (wb.status || "-") : "-"
                };
            });
        }

        // ── 构建表格行 ────────────────────────────────────────────
        const tbodyHtml = detailRows.length
            ? detailRows.map((r, i) => `
                <tr>
                    <td style="text-align:center;color:#94a3b8;">${i + 1}</td>
                    <td><a href="javascript:void(0)" style="color:#1d4ed8;text-decoration:none;">${r.no}</a></td>
                    <td>${r.date}</td>
                    <td>${r.route || "-"}</td>
                    <td class="num">${r.amount}</td>
                    <td>${r.driver}</td>
                    <td>${r.status}</td>
                </tr>`).join("")
            : `<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px;">暂无关联明细</td></tr>`;

        // ── 渲染居中弹窗 ──────────────────────────────────────────
        let overlay = document.getElementById("sdoc-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "sdoc-overlay";
            overlay.className = "sdoc-overlay";
            overlay.onclick = function(e) { if (e.target === overlay) window.closeRelatedDocDrawer(); };
            document.body.appendChild(overlay);
        }
        overlay.innerHTML = `
            <div class="sdoc-box" role="dialog" aria-modal="true">
                <div class="sdoc-hdr">
                    <div>
                        <div class="sdoc-title">关联原单明细</div>
                        <div class="sdoc-sub">凭证号：${voucherId} · ${displayType} · 共 ${detailRows.length} 条</div>
                    </div>
                    <button class="sdoc-close" onclick="closeRelatedDocDrawer()">关闭</button>
                </div>
                <div class="sdoc-body">
                    <div class="sdoc-section-lbl">明细清单</div>
                    <table class="sdoc-tbl">
                        <thead>
                            <tr>
                                <th style="width:40px;">序号</th>
                                <th>单号</th>
                                <th style="width:90px;">日期</th>
                                <th>线路/货物</th>
                                <th class="num" style="width:100px;">金额</th>
                                <th style="width:80px;">司机/相关人</th>
                                <th style="width:70px;">状态</th>
                            </tr>
                        </thead>
                        <tbody>${tbodyHtml}</tbody>
                    </table>
                    <div class="sdoc-hint">点击单号可跳转至对应业务单据详情（示意）。</div>
                </div>
            </div>`;
        overlay.classList.add("show");
    };

    window.closeRelatedDocDrawer = function() {
        const el = document.getElementById("sdoc-overlay");
        if (el) el.classList.remove("show");
    };

    const parseAccount = (text) => {
        const cleaned = (text || "").toString().trim();
        if (!cleaned) return { code: "-", name: "-" };
        const match = cleaned.match(/^([0-9-]+)\s*(.*)$/);
        if (match) {
            const code = match[1] || "-";
            const name = (match[2] || "").trim() || "-";
            return { code, name };
        }
        return { code: "-", name: cleaned };
    };

    const formatAmount = (value) => {
        const num = parseFloat((value || "0").toString().replace(/,/g, ""));
        if (isNaN(num) || num === 0) return "";
        return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // 辅助：渲染带颜色的金额（黑正红负）
    const renderColoredAmount = (val) => {
        const num = parseFloat((val || "0").toString().replace(/,/g, ""));
        if (isNaN(num) || num === 0) return "";
        const formatted = Math.abs(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const color = num < 0 ? "#e74c3c" : "#333"; 
        return `<span style="color:${color}; font-weight:500;">${formatted}</span>`;
    };

    const rowsData = [];
    allVouchers.forEach(v => {
        const lines = Array.isArray(v.lines) && v.lines.length
            ? v.lines
            : [{ summary: v.summary || "", account: "", debit: v.amount || "", credit: "" }];
        const lineCount = lines.length;
        lines.forEach((line, idx) => rowsData.push({ voucher: v, line, lineIndex: idx, lineCount }));
    });

    window._voucherAuditAllRows = rowsData;
    window._voucherAuditRowsData = rowsData;
    window._voucherAuditFilter = { tab: "all" };
    window._voucherAuditSearch = window._voucherAuditSearch || {
        docType: "",
        docNo: "",
        voucherType: "",
        subjectCode: "",
        summary: "",
        amountMin: "",
        amountMax: "",
        timeMode: "date",
        dateStart: "",
        dateEnd: "",
        periodStart: "",
        periodEnd: ""
    };

    const normalizeAmountNumber = (value) => {
        if (value === null || value === undefined) return null;
        const text = value.toString().trim();
        if (!text) return null;
        const num = parseFloat(text.replace(/,/g, ""));
        return Number.isFinite(num) ? num : null;
    };

    const getVoucherTypeLabel = (voucher) => {
        const explicit = (voucher.type || voucher.voucherType || "").toString().trim();
        if (explicit) return explicit;
        const prefix = (voucher.id || "").toString().trim().charAt(0);
        if (prefix === "收") return "收款凭证";
        if (prefix === "付") return "付款凭证";
        if (prefix === "转") return "转账凭证";
        return "转账凭证";
    };

    const getVoucherAmountNumber = (voucher) => {
        const amount = normalizeAmountNumber(voucher.amount);
        if (amount !== null) return amount;
        const fallback = normalizeAmountNumber(calcVoucherAmountFromLines(voucher));
        return fallback === null ? 0 : fallback;
    };

    const getDateKey = (value) => {
        const text = (value || "").toString().trim();
        if (!text) return null;
        const normalized = text.replace(/\//g, "-");
        const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (match) {
            const y = parseInt(match[1], 10);
            const m = parseInt(match[2], 10);
            const d = parseInt(match[3], 10);
            if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
                return y * 10000 + m * 100 + d;
            }
        }
        const parsed = new Date(normalized);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed.getFullYear() * 10000 + (parsed.getMonth() + 1) * 100 + parsed.getDate();
    };

    const getPeriodKey = (value) => {
        const text = (value || "").toString().trim();
        if (!text) return null;
        const match = text.replace("/", ".").match(/^(\d{4})[.\-](\d{1,2})$/);
        if (!match) return null;
        const y = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        if (m < 1 || m > 12) return null;
        return y * 100 + m;
    };

    const getVoucherPeriodKey = (voucher) => {
        const explicit = (voucher.period || voucher.acctPeriod || voucher.accountingPeriod || "").toString().trim();
        if (explicit) {
            const periodKey = getPeriodKey(explicit);
            if (periodKey !== null) return periodKey;
        }
        const dateText = (voucher.date || "").toString().trim();
        if (!dateText) return null;
        const normalized = dateText.replace(/\//g, "-");
        const match = normalized.match(/^(\d{4})-(\d{1,2})/);
        if (!match) return null;
        const y = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        if (m < 1 || m > 12) return null;
        return y * 100 + m;
    };

    const matchVoucherTimeRange = (voucher, search) => {
        const mode = ((search.timeMode || "date").toString().trim() || "date").toLowerCase();
        if (mode === "period") {
            const start = getPeriodKey(search.periodStart);
            const end = getPeriodKey(search.periodEnd);
            if (start === null && end === null) return true;
            const voucherPeriod = getVoucherPeriodKey(voucher);
            if (voucherPeriod === null) return false;
            if (start !== null && voucherPeriod < start) return false;
            if (end !== null && voucherPeriod > end) return false;
            return true;
        }
        const start = getDateKey(search.dateStart);
        const end = getDateKey(search.dateEnd);
        if (start === null && end === null) return true;
        const voucherDate = getDateKey(voucher.date);
        if (voucherDate === null) return false;
        if (start !== null && voucherDate < start) return false;
        if (end !== null && voucherDate > end) return false;
        return true;
    };

    const matchVoucherDocSearch = (voucher) => {
        const search = window._voucherAuditSearch || {};
        const docType = (search.docType || "").toString().trim().toLowerCase();
        const docNo = (search.docNo || "").toString().trim().toLowerCase();
        const voucherType = (search.voucherType || "").toString().trim().toLowerCase();
        const subjectCode = (search.subjectCode || "").toString().trim().toLowerCase();
        const summary = (search.summary || "").toString().trim().toLowerCase();
        const amountMin = normalizeAmountNumber(search.amountMin);
        const amountMax = normalizeAmountNumber(search.amountMax);

        if (voucherType) {
            const typeLabel = getVoucherTypeLabel(voucher).toLowerCase();
            if (!typeLabel.includes(voucherType)) return false;
        }

        if (subjectCode) {
            const lines = Array.isArray(voucher.lines) ? voucher.lines : [];
            const matched = lines.some((line) => {
                const parsed = parseAccount(line.account || line.subject || "");
                const code = (line.accountCode || parsed.code || "").toString().toLowerCase();
                return code.includes(subjectCode);
            });
            if (!matched) return false;
        }

        if (summary) {
            const summaryPool = [
                voucher.summary || "",
                ...(Array.isArray(voucher.lines) ? voucher.lines.map(line => line.summary || line.digest || "") : [])
            ].join(" ").toLowerCase();
            if (!summaryPool.includes(summary)) return false;
        }

        if (amountMin !== null || amountMax !== null) {
            const amount = getVoucherAmountNumber(voucher);
            if (amountMin !== null && amount < amountMin) return false;
            if (amountMax !== null && amount > amountMax) return false;
        }

        if (!matchVoucherTimeRange(voucher, search)) return false;

        if (!docType && !docNo) return true;
        const info = resolveRelatedDocs(voucher);
        if (!info || !Array.isArray(info.ids) || info.ids.length === 0) return false;
        const normalizedType = normalizeSourceType(info.type || "");
        if (docType && normalizeSourceType(docType) !== normalizedType) return false;
        if (!docNo) return true;
        return info.ids.some((id) => id.toString().toLowerCase().includes(docNo));
    };

    window.applyVoucherAuditFilter = function() {
        const filter = window._voucherAuditFilter || { tab: "all" };
        const allRows = window._voucherAuditAllRows || [];
        const normalized = (status) => (status || "待审核").toString().trim();
        const filtered = allRows.filter(item => {
            const v = item.voucher || {};
            const status = normalized(v.status);
            if (!matchVoucherDocSearch(v)) return false;
            if (filter.tab === "pending") {
                // 待审核
                return status === "待审核";
            }
            if (filter.tab === "cashier") {
                // 待出纳复核：新状态"待复核"，兼容旧数据（已审核且无cashierUser）
                return status === "待复核" || (status === "已审核" && !v.cashierUser);
            }
            if (filter.tab === "post") {
                // 待记账：新状态"已复核"/"待记账"，兼容旧数据（已审核且有cashierUser）
                return status === "已复核" || status === "待记账" || (status === "已审核" && !!v.cashierUser);
            }
            if (filter.tab === "diff") {
                // 差异凭证：已冲销、已作废
                return ["已冲销", "已作废"].includes(status);
            }
            return true;
        });
        window._voucherAuditRowsData = filtered;
    };

    window.vaSmartSearchHint = function(input) {
        const val = (input.value || "").trim().toUpperCase();
        const hintEl = document.getElementById("va-smart-type-hint");
        if (!hintEl) return;
        if (!val) { hintEl.textContent = ""; return; }
        if (/^YD/i.test(val))  { hintEl.textContent = "→ 运单"; return; }
        if (/^BX/i.test(val))  { hintEl.textContent = "→ 报销单"; return; }
        if (/^(PC|APC|ASH)/i.test(val)) { hintEl.textContent = "→ 批次"; return; }
        hintEl.textContent = "→ 全类型匹配";
    };

    window.applyVoucherAuditSearch = function() {
        const timeModeEl = document.querySelector('input[name="va-time-mode"]:checked');
        const smartEl = document.getElementById("voucher-smart-search");
        const voucherTypeEl = document.getElementById("voucher-type-keyword");
        const subjectCodeEl = document.getElementById("voucher-subject-code");
        const summaryEl = document.getElementById("voucher-filter-summary");
        const amountMinEl = document.getElementById("voucher-amount-min");
        const amountMaxEl = document.getElementById("voucher-amount-max");
        const dateStartEl = document.getElementById("vaDateStart");
        const dateEndEl = document.getElementById("vaDateEnd");
        const periodStartEl = document.getElementById("vaPeriodStart");
        const periodEndEl = document.getElementById("vaPeriodEnd");

        // Smart-detect doc type from prefix
        const rawSearch = smartEl ? (smartEl.value || "").trim() : "";
        let detectedType = "";
        if (/^YD/i.test(rawSearch))  detectedType = "waybill";
        else if (/^BX/i.test(rawSearch))  detectedType = "reimbursement";
        else if (/^(PC|APC|ASH)/i.test(rawSearch)) detectedType = "batch";

        window._voucherAuditSearch = {
            docType: detectedType,
            docNo: rawSearch,
            voucherType: voucherTypeEl ? voucherTypeEl.value : "",
            subjectCode: subjectCodeEl ? subjectCodeEl.value : "",
            summary: summaryEl ? summaryEl.value : "",
            amountMin: amountMinEl ? amountMinEl.value : "",
            amountMax: amountMaxEl ? amountMaxEl.value : "",
            timeMode: timeModeEl ? timeModeEl.value : "date",
            dateStart: dateStartEl ? dateStartEl.value : "",
            dateEnd: dateEndEl ? dateEndEl.value : "",
            periodStart: periodStartEl ? periodStartEl.value : "",
            periodEnd: periodEndEl ? periodEndEl.value : ""
        };
        window.applyVoucherAuditFilter();
        window.renderVoucherAuditPage(1);
    };

    window.setVoucherAuditTab = function(tab) {
        window._voucherAuditFilter = { tab: tab || "all" };
        document.querySelectorAll(".voucher-center__tab").forEach(btn => {
            btn.classList.remove("is-active");
        });
        const active = document.querySelector(`.voucher-center__tab[data-tab="${tab}"]`);
        if (active) active.classList.add("is-active");
        window.applyVoucherAuditFilter();
        window.renderVoucherAuditPage(1);
    };

    window.renderVoucherAuditPage = function(page = 1) {
        const perPage = 30;
        const total = window._voucherAuditRowsData.length;
        const totalPages = Math.max(1, Math.ceil(total / perPage));
        const current = Math.min(Math.max(page, 1), totalPages);
        const start = (current - 1) * perPage;
        const slice = window._voucherAuditRowsData.slice(start, start + perPage);
        const tbody = document.getElementById("voucher-center-body");
        const pager = document.getElementById("voucher-center-pagination");
        if (!tbody || !pager) return;

        const renderStatus = (status) => {
            const value = (status || "待审核").toString().trim();
            const MAP = {
                "待审核":  ["is-pending",   "待审核"],
                "已审核":  ["is-audited",   "已审核"],
                "待复核":  ["is-reviewing", "待复核"],
                "已复核":  ["is-reviewed",  "已复核"],
                "待记账":  ["is-to-post",   "待记账"],
                "已记账":  ["is-posted",    "已记账"],
                "已过账":  ["is-posted",    "已记账"],
                "已冲销":  ["is-void",      "已冲销"],
                "已作废":  ["is-void",      "已作废"],
            };
            const [cls, label] = MAP[value] || ["is-pending", value];
            return `<span class="voucher-status ${cls}">${label}</span>`;
        };

        const SOURCE_DOC_ICONS = {
            waybill: "🚛",
            batch: "📦",
            reimbursement: "🧾",
            mixed: "📄",
            manual: "📄"
        };

        const buildRelatedDocsHtml = (voucher) => {
            // ── 特殊处理：核销凭证 WriteOff → 展示已核销的运单号 ────────
            if (voucher.sourceType === 'WriteOff' && voucher.waybillNo) {
                const wbNos = voucher.waybillNo.split(/[,，;]/).map(s => s.trim()).filter(Boolean);
                if (wbNos.length) {
                    const showNos = wbNos.slice(0, 3);
                    const moreN = wbNos.length - showNos.length;
                    const wbLinks = showNos.map(no =>
                        `<a href="javascript:void(0)"
                            class="doc-no-link doc-no-link--waybill"
                            data-doc-type="waybill"
                            data-doc-ids="${wbNos.join(',')}"
                            data-voucher-id="${voucher.id || ''}"
                            onclick="openRelatedDocDrawer(this)"
                            style="color:#1d4ed8;text-decoration:none;margin-right:4px;font-size:11px;white-space:nowrap;"
                            title="运单">${no}</a>`
                    ).join("");
                    const moreHtml = moreN > 0 ? `<span style="color:#94a3b8;font-size:11px;">+${moreN}</span>` : "";
                    return wbLinks + moreHtml;
                }
            }
            // ── 特殊处理：收款单 RCV-* → 展示关联运单号 ────────────────
            const rcvId = voucher.sourceId || voucher.sourceNo || "";
            if (/^RCV-/i.test(rcvId)) {
                const rcvList = JSON.parse(sessionStorage.getItem('ReceiptVouchers') || '[]');
                const rcvRec = rcvList.find(r => r.id === rcvId);
                if (rcvRec && Array.isArray(rcvRec.details) && rcvRec.details.length) {
                    const wbNos = rcvRec.details.map(d => d.waybillNo).filter(Boolean);
                    if (wbNos.length) {
                        const showNos = wbNos.slice(0, 3);
                        const moreN = wbNos.length - showNos.length;
                        const wbLinks = showNos.map(no =>
                            `<a href="javascript:void(0)"
                                class="doc-no-link doc-no-link--waybill"
                                data-doc-type="waybill"
                                data-doc-ids="${wbNos.join(',')}"
                                data-voucher-id="${voucher.id || ''}"
                                onclick="openRelatedDocDrawer(this)"
                                style="color:#1d4ed8;text-decoration:none;margin-right:4px;font-size:11px;white-space:nowrap;"
                                title="运单">${no}</a>`
                        ).join("");
                        const moreHtml2 = moreN > 0 ? `<span style="color:#94a3b8;font-size:11px;">+${moreN}</span>` : "";
                        return wbLinks + moreHtml2;
                    }
                }
                // 没有明细时退回显示 RCV ID
                return `<span style="color:#64748b;font-size:11px;">${rcvId}</span>`;
            }
            // ── 通用逻辑 ─────────────────────────────────────────────────
            const info = resolveRelatedDocs(voucher);
            if (!info || !Array.isArray(info.ids) || info.ids.length === 0) return "";
            const typeKey = info.type || "manual";
            const ids = info.ids;
            const allIdsStr = ids.join(",");
            const vId = voucher.id || "";
            // 最多展示3个，超出显示 +N
            const showIds = ids.slice(0, 3);
            const moreCount = ids.length - showIds.length;
            const links = showIds.map(id =>
                `<a href="javascript:void(0)"
                    class="doc-no-link doc-no-link--${typeKey}"
                    data-doc-type="${typeKey}"
                    data-doc-ids="${allIdsStr}"
                    data-voucher-id="${vId}"
                    onclick="openRelatedDocDrawer(this)"
                    style="color:#1d4ed8;text-decoration:none;margin-right:4px;font-size:11px;white-space:nowrap;"
                    title="${typeKey === 'waybill' ? '运单' : typeKey === 'reimbursement' ? '报销单' : '批次'}">${id}</a>`
            ).join("");
            const moreHtml = moreCount > 0
                ? `<span style="color:#94a3b8;font-size:11px;">+${moreCount}</span>` : "";
            return links + moreHtml;
        };

        tbody.innerHTML = slice.map((item, index) => {
            const v = item.voucher || {};
            const line = item.line || {};
            const { code, name } = parseAccount(line.account || line.subject);
            const auxCode = line.auxCode || "";
            const auxName = line.auxName || "";
            // 优先使用完整多选结果（保存时用 ', ' 拼接），降级到单条 auxCode+auxName
            const aux = (line.aux || line.auxiliary)
                || ([auxCode, auxName].filter(Boolean).join(" "))
                || "-";
            const summary = line.summary || line.digest || v.summary || "-";
            const auditUser = v.auditUser || (["已审核", "已记账", "已复核", "待记账"].includes(v.status) ? "系统审核" : "-");
            const maker = v.user || "system";
            const statusTag = renderStatus(v.status);
            const relatedDocs = item.lineIndex === 0 ? buildRelatedDocsHtml(v) : "";
            return `
                <tr>
                    <td style="text-align:center;">
                        <input type="checkbox" class="voucher-select" data-voucher-id="${v.id}" onchange="toggleVoucherGroupSelection(this)">
                    </td>
                    <td>${start + index + 1}</td>
                    <td>${v.date || "-"}</td>
                    <td><a href="javascript:void(0)" onclick="openVoucherForEdit('${v.id}')" class="voucher-link" title="点击编辑此凭证">${v.id || "-"}</a></td>
                    <td style="text-align:right; font-weight:bold;">${formatAmount(v.amount)}</td>
                    <td>${auditUser}</td>
                    <td>${maker}</td>
                    <td class="summary-cell">${summary}</td>
                    <td style="text-align:center;">${relatedDocs}</td>
                    <td>${statusTag}</td>
                    <td>${code}</td>
                    <td>${name || "-"}</td>
                    <td>${aux || "-"}</td>
                    <td style="text-align:right;">${renderColoredAmount(line.debit)}</td>
                    <td style="text-align:right;">${renderColoredAmount(line.credit)}</td>
                </tr>
            `;
        }).join("") || `<tr><td colspan="15" class="empty-row">暂无数据</td></tr>`;

        const maxButtons = 5;
        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        window._voucherAuditPager = { totalPages, current };
        let pagerHtml = `
            <button ${current === 1 ? "disabled" : ""} onclick="renderVoucherAuditPage(1)">首页</button>
            <button ${current === 1 ? "disabled" : ""} onclick="renderVoucherAuditPage(${current - 1})">上一页</button>
        `;
        for (let i = startPage; i <= endPage; i += 1) {
            pagerHtml += `<button class="${i === current ? "is-active" : ""}" onclick="renderVoucherAuditPage(${i})">${i}</button>`;
        }
        pagerHtml += `
            <button ${current === totalPages ? "disabled" : ""} onclick="renderVoucherAuditPage(${current + 1})">下一页</button>
            <button ${current === totalPages ? "disabled" : ""} onclick="renderVoucherAuditPage(${totalPages})">末页</button>
            <span style="margin-left:8px; color:#94a3b8;">跳至</span>
            <input id="voucher-page-input" type="number" min="1" max="${totalPages}" value="${current}" style="width:70px; margin:0 6px; padding:4px 6px; border:1px solid #e2e8f0; border-radius:6px;">
            <button onclick="jumpVoucherAuditPage()">GO</button>
            <span style="margin-left:6px; color:#94a3b8;">/ ${totalPages} 页</span>
        `;
        pager.innerHTML = pagerHtml;

        const input = document.getElementById("voucher-page-input");
        if (input && !input.dataset.bound) {
            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    window.jumpVoucherAuditPage();
                }
            });
            input.dataset.bound = "1";
        }

        if (typeof window.updateVoucherActionButtons === "function") {
            window.updateVoucherActionButtons();
        }
    };

    window.jumpVoucherAuditPage = function() {
        const input = document.getElementById("voucher-page-input");
        const totalPages = window._voucherAuditPager ? window._voucherAuditPager.totalPages : 1;
        if (!input) return;
        const raw = parseInt(input.value, 10);
        if (!Number.isFinite(raw)) return;
        const target = Math.min(Math.max(raw, 1), totalPages);
        window.renderVoucherAuditPage(target);
    };

    // 点击凭证字号 → 跳转凭证录入页面编辑
    window.openVoucherForEdit = function(voucherId) {
        window._voucherEditId = voucherId;
        loadContent('VoucherEntryReview');
    };

    contentHTML += `
        <style>
            .va-toolbar{height:36px;background:#f8f8f8;border-bottom:1px solid #ddd;display:flex;align-items:center;padding:0 10px;gap:6px;position:relative;}
            .va-btn{height:26px;padding:0 10px;background:#fff;border:1px solid #a9a9a9;border-radius:2px;cursor:pointer;font-size:12px;color:#333;display:inline-flex;align-items:center;gap:3px;}
            .va-btn:hover{background:#e8f4fd;border-color:#72a3dd;}
            .va-btn[disabled]{opacity:.5;cursor:default;pointer-events:none;}
            .va-dropdown-wrap{position:relative;}
            .va-dropdown-menu{position:absolute;top:100%;left:0;margin-top:2px;background:#fff;border:1px solid #a9a9a9;border-radius:2px;box-shadow:0 4px 12px rgba(0,0,0,.15);min-width:130px;display:none;z-index:1000;}
            .va-dropdown-menu.show{display:block;}
            .va-dropdown-item{padding:7px 14px;cursor:pointer;font-size:12px;color:#333;border-bottom:1px solid #f0f0f0;}
            .va-dropdown-item:last-child{border-bottom:none;}
            .va-dropdown-item:hover{background:#e8f4fd;}
            .va-dropdown-item.danger{color:#c83c3c;}
            .va-sep{width:1px;height:20px;background:#ddd;margin:0 2px;}
            .va-filter-section{padding:6px 12px;background:#fff;border-bottom:1px solid #ddd;overflow-x:auto;}
            .va-filter-row{display:grid;grid-template-columns:240px 355px 200px 235px auto;column-gap:6px;row-gap:0;margin-bottom:6px;align-items:center;}
            .va-filter-row:last-child{margin-bottom:0;}
            .va-fi{display:flex;align-items:center;gap:4px;font-size:12px;min-height:28px;}
            .va-fi label{white-space:nowrap;color:#333;}
            .va-fi__label{display:inline-block;width:66px;text-align:right;}
            .va-fi--field input[type="text"], .va-fi--field select{width:160px;}
            .va-fi--time input[type="date"], .va-fi--period select{width:auto;}
            .va-fi--meta input[type="text"]{width:120px;}
            .va-fi--meta select{width:96px;}
            .va-fi--doc input[type="text"]{width:150px;}
            .va-fi--amount input[type="number"]{width:72px;}
            .va-fi--time input[type="radio"]{margin-right:2px;}
            .va-fi.is-disabled{opacity:.45;}
            .va-fi--action{justify-self:start;}
            .va-fi input[type="date"],.va-fi select{height:24px;border:1px solid #a9a9a9;padding:0 4px;font-size:12px;}
            .va-fi input[type="text"]{height:24px;width:120px;border:1px solid #a9a9a9;padding:0 6px;font-size:12px;}
            .va-fi input[type="number"]{height:24px;width:72px;border:1px solid #a9a9a9;padding:0 6px;font-size:12px;}
            .va-fi select{width:90px;}
            @media (max-width: 1400px){
                .va-filter-row{grid-template-columns:240px 355px 200px 235px;}
                .va-fi--action{grid-column:4;justify-self:end;}
            }
            .va-tab-bar{display:flex;gap:2px;padding:8px 15px 0;border-bottom:2px solid #4a90e2;}
            .va-tab{padding:5px 14px;background:#f0f0f0;border:1px solid #ddd;border-bottom:none;border-radius:4px 4px 0 0;cursor:pointer;color:#666;font-size:12px;}
            .va-tab.is-active{background:#4a90e2;color:#fff;border-color:#4a90e2;}
            .va-tab:hover:not(.is-active){background:#e8e8e8;}
            .va-tc{padding:10px 15px;overflow-x:auto;overflow-y:auto;max-height:calc(100vh - 270px);}
            .va-table{width:max-content;min-width:100%;border-collapse:collapse;border:1px solid #ddd;background:#fff;font-size:12px;}
            .va-table th,.va-table td{border:1px solid #ddd;padding:5px 7px;text-align:left;font-size:12px;white-space:nowrap;}
            .va-table th{background:#f0f0f0;font-weight:normal;color:#333;height:28px;white-space:nowrap;position:sticky;top:0;z-index:5;}
            .va-table td{height:26px;}
            .va-table tbody tr:hover{background:#f1f6fc;}
            .va-table tbody tr.selected{background:#fffca8;}
            .va-footer{padding:8px 15px;background:#f8f8f8;border-top:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;font-size:12px;}
            .va-pager{display:flex;gap:4px;align-items:center;}
            .va-pager button{min-width:26px;height:24px;padding:0 5px;background:#fff;border:1px solid #a9a9a9;border-radius:2px;cursor:pointer;font-size:12px;}
            .va-pager button:hover{background:#e8f4fd;border-color:#4a90e2;}
            .va-pager button.is-active{background:#4a90e2;color:#fff;border-color:#4a90e2;}
            .va-pager button[disabled]{opacity:.4;cursor:default;}
            /* 栏目设置弹窗 */
            .va-dlg-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9998;justify-content:center;align-items:center;}
            .va-dlg-overlay.show{display:flex;}
            .va-dlg-box{width:600px;max-height:90vh;background:#fff;border:1px solid #aaa;border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,.2);display:flex;flex-direction:column;overflow:hidden;z-index:9999;}
            .va-dlg-hdr{height:32px;background:#f8f8f8;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;padding:0 10px;user-select:none;}
            .va-dlg-hdr .va-dlg-title{font-size:14px;font-weight:bold;color:#333;}
            .va-dlg-hdr .va-dlg-ctrl{display:flex;gap:8px;color:#666;font-size:16px;cursor:pointer;}
            .va-dlg-hdr .va-dlg-ctrl span:hover{color:#000;}
            .va-dlg-body{padding:10px 15px;display:flex;flex-direction:column;gap:10px;flex:1;overflow-y:auto;}
            .va-dlg-tb{display:flex;gap:5px;align-items:center;}
            .va-dlg-tb input[type="text"]{width:120px;height:22px;border:1px solid #a9a9a9;padding:0 4px;font-size:12px;}
            .va-sys-btn{height:22px;padding:0 10px;background:#f0f0f0;border:1px solid #a9a9a9;border-radius:2px;cursor:pointer;font-size:12px;color:#333;}
            .va-sys-btn:hover{background:#e8e8e8;}
            .va-grid{display:flex;gap:10px;align-items:flex-start;}
            .va-col-wrap{width:480px;height:380px;border:1px solid #a9a9a9;overflow-y:auto;}
            .va-col-tbl{width:100%;border-collapse:collapse;table-layout:fixed;}
            .va-col-tbl th,.va-col-tbl td{border-right:1px solid #ddd;border-bottom:1px solid #ddd;height:28px;vertical-align:middle;text-align:center;font-size:12px;}
            .va-col-tbl th{background:#eaeaea;font-weight:normal;position:sticky;top:0;z-index:10;border-bottom:1px solid #a9a9a9;}
            .va-col-tbl th:last-child,.va-col-tbl td:last-child{border-right:none;}
            .va-col-tbl td.cname{text-align:left;padding-left:8px;}
            .va-col-tbl tr.active{background:#fffca8;}
            .va-col-tbl tr:not(.active):hover{background:#f1f6fc;}
            .va-icon-btns{display:flex;flex-direction:column;gap:8px;margin-top:50px;}
            .va-icon-btn{width:24px;height:22px;background:linear-gradient(to bottom,#fff,#d8e5f8);border:1px solid #7a9cd3;border-radius:2px;cursor:pointer;display:flex;justify-content:center;align-items:center;}
            .va-icon-btn:hover{background:linear-gradient(to bottom,#fff,#c2d5f2);}
            .va-icon-btn svg{width:12px;height:12px;stroke:#0d3c7a;stroke-width:1.5;fill:none;}
            .va-bottom-ctrl{display:flex;flex-direction:column;gap:8px;margin-top:5px;}
            .va-cb-group{display:flex;gap:15px;align-items:center;}
            .va-cb-group label{display:flex;align-items:center;gap:4px;cursor:pointer;}
            .va-act-row{display:flex;justify-content:space-between;align-items:center;}
            .va-note{color:#d32f2f;font-size:11px;}
            .va-dlg-ftr{border-top:1px solid #ddd;padding:10px 15px;display:flex;justify-content:flex-end;gap:8px;background:#fff;}
            .va-dlg-ftr .va-sys-btn{width:65px;height:26px;}
            /* 状态标签 */
            .voucher-status{border-radius:3px;padding:1px 6px;font-size:11px;white-space:nowrap;}
            .voucher-status.is-void{background:#fee2e2;color:#dc2626;}
            .voucher-status.is-posted{background:#dcfce7;color:#16a34a;}
            .voucher-status.is-audited{background:#dbeafe;color:#2563eb;}
            .voucher-status.is-pending{background:#fef9c3;color:#a16207;}
            .voucher-status.is-reviewing{background:#fff7ed;color:#c2410c;}
            .voucher-status.is-reviewed{background:#ecfeff;color:#0e7490;}
            .voucher-status.is-to-post{background:#f5f3ff;color:#7c3aed;}
            /* 关联单 */
            .source-badge{display:inline-flex;align-items:center;gap:2px;padding:0 6px;height:18px;border:1px solid #d1d5db;border-radius:9px;cursor:pointer;font-size:11px;background:#fff;}
            .source-badge--waybill{border-color:#3b82f6;color:#1d4ed8;}
            .source-badge--batch{border-color:#f59e0b;color:#d97706;}
            .source-badge--reimbursement{border-color:#10b981;color:#047857;}
            .source-badge--mixed,.source-badge--manual{border-color:#6b7280;color:#374151;}
            .voucher-link{color:#1d4ed8;text-decoration:none;}
            .voucher-link:hover{text-decoration:underline;}
            /* 原单明细弹窗（居中） */
            .sdoc-overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:9900;display:none;align-items:center;justify-content:center;}
            .sdoc-overlay.show{display:flex;}
            .sdoc-box{background:#fff;border-radius:10px;box-shadow:0 12px 40px rgba(15,23,42,.2);width:700px;max-width:92vw;max-height:80vh;display:flex;flex-direction:column;overflow:hidden;}
            .sdoc-hdr{display:flex;justify-content:space-between;align-items:flex-start;padding:16px 20px;border-bottom:1px solid #e2e8f0;flex-shrink:0;}
            .sdoc-title{font-size:15px;font-weight:700;color:#0f172a;}
            .sdoc-sub{font-size:12px;color:#64748b;margin-top:4px;}
            .sdoc-close{padding:4px 14px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;font-size:13px;color:#475569;flex-shrink:0;margin-top:2px;}
            .sdoc-close:hover{background:#f1f5f9;}
            .sdoc-body{flex:1;overflow-y:auto;padding:16px 20px;}
            .sdoc-section-lbl{font-size:12px;color:#64748b;font-weight:700;margin-bottom:10px;}
            .sdoc-tbl{width:100%;border-collapse:collapse;font-size:12px;}
            .sdoc-tbl th{background:#f8fafc;border:1px solid #e2e8f0;padding:7px 10px;color:#64748b;font-weight:600;text-align:left;white-space:nowrap;}
            .sdoc-tbl td{border:1px solid #e2e8f0;padding:7px 10px;color:#334155;vertical-align:top;}
            .sdoc-tbl tbody tr:hover{background:#f8fafc;}
            .sdoc-tbl .num{text-align:right;}
            .sdoc-hint{font-size:11px;color:#94a3b8;margin-top:10px;}
            .empty-row{text-align:center;color:#94a3b8;padding:20px;}
        </style>
        <div id="vaWrap" style="background:#fff;border:1px solid #ddd;border-radius:4px;">
            <!-- 工具栏 -->
            <div class="va-toolbar">
                <button class="va-btn voucher-center__action" onclick="applyVoucherAction('unaudit')" disabled>反审核</button>
                <button class="va-btn voucher-center__action" onclick="applyVoucherAction('audit')" disabled>审核</button>
                <button class="va-btn voucher-center__action" onclick="openCashierReviewModal()" disabled>出纳复核</button>
                <button class="va-btn voucher-center__action" onclick="vaCancelCashierReview()" disabled>取消复核</button>
                <button class="va-btn voucher-center__action" onclick="applyVoucherAction('post')" disabled>记账</button>
                <button class="va-btn voucher-center__action" onclick="applyVoucherAction('unpost')" disabled>取消记账</button>
                <button class="va-btn voucher-center__action" onclick="deleteSelectedVouchers()" disabled>删除</button>
                <div class="va-dropdown-wrap">
                    <button class="va-btn" id="vaOpBtn" onclick="vaToggleOpMenu(event)">操作 ▼</button>
                    <div class="va-dropdown-menu" id="vaOpMenu">
                        <div class="va-dropdown-item danger" onclick="applyVoucherAction('void');document.getElementById('vaOpMenu').classList.remove('show')">作废</div>
                        <div class="va-dropdown-item" onclick="vaAlert('取消作废')">取消作废</div>
                        <div class="va-dropdown-item danger" onclick="applyVoucherAction('reverse');document.getElementById('vaOpMenu').classList.remove('show')">冲销</div>
                        <div class="va-dropdown-item danger" onclick="vaAlert('标错')">标错</div>
                        <div class="va-dropdown-item" onclick="vaAlert('取消标错')">取消标错</div>
                    </div>
                </div>
                <button class="va-btn" onclick="vaOpenColDlg()">栏目</button>
                <div class="va-sep"></div>
                <button class="va-btn voucher-center__action" onclick="exportSelectedVouchers()" disabled>导出</button>
                <button class="va-btn voucher-center__action" style="color:#e67e22;border-color:#e67e22;"
                    onclick="pushSelectedVouchersToExternal()" disabled title="将选中凭证推送到外账帐套">推送</button>
                <button class="va-btn voucher-center__action" onclick="printSelectedVouchers()" disabled title="打印选中凭证">🖨</button>
            </div>
            <!-- 筛选区 -->
            <div class="va-filter-section">
                <div class="va-filter-row">
                    <div class="va-fi va-fi--field">
                        <label class="va-fi__label">凭证类别:</label>
                        <input type="text" id="voucher-type-keyword" placeholder="输入凭证类别">
                    </div>
                    <div class="va-fi va-fi--time" id="va-date-filter">
                        <label style="display:flex;align-items:center;gap:3px;cursor:pointer;"><input type="radio" name="va-time-mode" value="date" checked onchange="vaHandleTimeModeChange(this.value)"></label>
                        <label class="va-fi__label"><span style="color:#d32f2f;">* </span>制单日期:</label>
                        <input type="date" id="vaDateStart" value="2026-01-01">
                        <span>-</span>
                        <input type="date" id="vaDateEnd" value="2026-12-31">
                    </div>
                    <div class="va-fi va-fi--meta">
                        <label class="va-fi__label">摘要:</label>
                        <input type="text" id="voucher-filter-summary" placeholder="输入摘要关键词">
                    </div>
                    <div class="va-fi va-fi--tail va-fi--amount">
                        <label class="va-fi__label">金额:</label>
                        <input type="number" id="voucher-amount-min" placeholder="最小值">
                        <span>-</span>
                        <input type="number" id="voucher-amount-max" placeholder="最大值">
                    </div>
                </div>
                <div class="va-filter-row">
                    <div class="va-fi va-fi--field">
                        <label class="va-fi__label">科目编码:</label>
                        <input type="text" id="voucher-subject-code" placeholder="输入科目编码">
                    </div>
                    <div class="va-fi va-fi--time va-fi--period" id="va-period-filter">
                        <label style="display:flex;align-items:center;gap:3px;cursor:pointer;"><input type="radio" name="va-time-mode" value="period" onchange="vaHandleTimeModeChange(this.value)"></label>
                        <label class="va-fi__label"><span style="color:#d32f2f;">* </span>会计期间:</label>
                        <select id="vaPeriodStart"><option>2022.06</option><option>2025.09</option><option selected>2026.01</option></select>
                        <span>-</span>
                        <select id="vaPeriodEnd"><option>2026.01</option><option selected>2026.12</option></select>
                    </div>
                    <div class="va-fi va-fi--doc" style="grid-column:span 2;">
                        <label class="va-fi__label">单号:</label>
                        <input type="text" id="voucher-smart-search"
                            placeholder="输入单号智能查询：YD运单 / BX报销 / PC批次..."
                            style="width:260px;"
                            oninput="vaSmartSearchHint(this)"
                            onkeydown="if(event.key==='Enter')applyVoucherAuditSearch()">
                        <span id="va-smart-type-hint" style="font-size:11px;color:#64748b;margin-left:6px;"></span>
                    </div>
                    <div class="va-fi va-fi--action">
                        <button class="va-btn" style="background:#4a90e2;color:#fff;border-color:#4a90e2;" onclick="applyVoucherAuditSearch()">查询</button>
                    </div>
                </div>
            </div>
            <!-- 标签页 -->
            <div class="va-tab-bar">
                <div class="va-tab is-active voucher-center__tab" data-tab="all" onclick="setVoucherAuditTab('all')">全部凭证</div>
                <div class="va-tab voucher-center__tab" data-tab="pending" onclick="setVoucherAuditTab('pending')">待审核</div>
                <div class="va-tab voucher-center__tab" data-tab="cashier" onclick="setVoucherAuditTab('cashier')">待出纳复核</div>
                <div class="va-tab voucher-center__tab" data-tab="post" onclick="setVoucherAuditTab('post')">待记账</div>
                <div class="va-tab voucher-center__tab" data-tab="diff" onclick="setVoucherAuditTab('diff')">差异凭证</div>
            </div>
            <!-- 数据表格 -->
            <div class="va-tc">
                <table class="va-table">
                    <thead>
                        <tr>
                            <th style="width:36px;text-align:center;"><input type="checkbox" onclick="toggleAllVoucherSelection(this.checked)"></th>
                            <th style="width:50px;">序号</th>
                            <th style="width:90px;">制单日期 ▲</th>
                            <th style="width:80px;">凭证字号 ▲</th>
                            <th style="width:100px;text-align:right;">凭证总金额</th>
                            <th style="width:70px;">审核人</th>
                            <th style="width:70px;">制单人</th>
                            <th>摘要</th>
                            <th style="width:60px;text-align:center;">外部系统数据单号</th>
                            <th style="width:80px;">状态</th>
                            <th style="width:80px;">科目编码</th>
                            <th style="width:170px;">科目名称</th>
                            <th style="width:120px;">辅助项</th>
                            <th style="width:90px;text-align:right;">借方</th>
                            <th style="width:90px;text-align:right;">贷方</th>
                        </tr>
                    </thead>
                    <tbody id="voucher-center-body">
                        <tr><td colspan="15" class="empty-row">暂无数据</td></tr>
                    </tbody>
                </table>
            </div>
            <!-- 底部分页 -->
            <div class="va-footer">
                <label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;"><input type="checkbox"> 未取已签合计</label>
                <div id="voucher-center-pagination" class="va-pager"></div>
            </div>
        </div>
        <!-- 栏目设置弹窗 -->
        <div class="va-dlg-overlay" id="vaColDlg">
            <div class="va-dlg-box">
                <div class="va-dlg-hdr">
                    <div class="va-dlg-title">栏目设置</div>
                    <div class="va-dlg-ctrl">
                        <span title="帮助">❓</span>
                        <span title="关闭" onclick="vaCloseColDlg()">✖</span>
                    </div>
                </div>
                <div class="va-dlg-body">
                    <div class="va-dlg-tb">
                        <input type="text" placeholder="请输入栏目名称">
                        <button class="va-sys-btn">定位</button>
                    </div>
                    <div class="va-grid">
                        <div class="va-col-wrap">
                            <table class="va-col-tbl">
                                <thead>
                                    <tr>
                                        <th style="width:40px;">序号</th>
                                        <th style="width:50px;">显示<input type="checkbox" style="margin-left:2px;"></th>
                                        <th style="width:50px;">固定列</th>
                                        <th style="width:140px;text-align:center;">栏目名称</th>
                                        <th style="width:50px;">类型</th>
                                        <th style="width:60px;">排序</th>
                                        <th style="width:30px;">合计</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>1</td><td><input type="checkbox" checked></td><td><input type="checkbox" checked></td><td class="cname">制单日期</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr class="active"><td>2</td><td><input type="checkbox" checked></td><td><input type="checkbox" checked></td><td class="cname">凭证字号</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>3</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">附单据数</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>4</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">来源类型</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>5</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">差异凭证</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>6</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">错误</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>7</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">作废</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>8</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">凭证总金额</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>9</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">现金流量分配</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>10</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">记账人</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>11</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">审核人</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>12</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">出纳</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>13</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">制单人</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>14</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">打印次数</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>15</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">附件数</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>16</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">摘要</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>17</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">科目编码</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>18</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">科目名称</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>19</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">辅助项</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>20</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">计量单位</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>21</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">数量</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>22</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">单价</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>23</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">借方</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>24</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">贷方</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>25</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">来源类型备注</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>26</td><td><input type="checkbox"></td><td><input type="checkbox"></td><td class="cname">来源类型</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr style="background:#f0f5ff;"><td>27</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">外部系统数据单号</td><td style="color:#2563eb;">明细</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                    <tr><td>28</td><td><input type="checkbox" checked></td><td><input type="checkbox"></td><td class="cname">状态</td><td>表头</td><td>无排序</td><td><input type="checkbox"></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="va-icon-btns">
                            <button class="va-icon-btn" title="置顶"><svg viewBox="0 0 10 10"><path d="M 1 1 L 9 1 M 5 9 L 5 3 M 2 6 L 5 3 L 8 6"/></svg></button>
                            <button class="va-icon-btn" title="上移"><svg viewBox="0 0 10 10"><path d="M 5 9 L 5 1 M 2 4 L 5 1 L 8 4"/></svg></button>
                            <button class="va-icon-btn" title="下移"><svg viewBox="0 0 10 10"><path d="M 5 1 L 5 9 M 2 6 L 5 9 L 8 6"/></svg></button>
                            <button class="va-icon-btn" title="置底"><svg viewBox="0 0 10 10"><path d="M 1 9 L 9 9 M 5 1 L 5 7 M 2 4 L 5 7 L 8 4"/></svg></button>
                        </div>
                    </div>
                    <div class="va-bottom-ctrl">
                        <div class="va-cb-group">
                            <label><input type="checkbox" checked> 显示明细</label>
                            <label><input type="checkbox"> 只显示第一行明细</label>
                        </div>
                        <div class="va-act-row">
                            <button class="va-sys-btn">恢复默认</button>
                            <div style="display:flex;align-items:center;gap:5px;">
                                <span style="font-size:12px;">移动到</span>
                                <input type="text" style="width:50px;height:22px;border:1px solid #a9a9a9;text-align:center;">
                                <button class="va-sys-btn">确定</button>
                            </div>
                        </div>
                        <div class="va-note">注：调整内容只应用于当前用户。</div>
                    </div>
                </div>
                <div class="va-dlg-ftr">
                    <button class="va-sys-btn" onclick="vaCloseColDlg()">确定</button>
                    <button class="va-sys-btn" onclick="vaCloseColDlg()">取消</button>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        window.vaToggleOpMenu = function(e) {
            e.stopPropagation();
            const menu = document.getElementById('vaOpMenu');
            if (menu) menu.classList.toggle('show');
        };
        document.addEventListener('click', function vaDocClick() {
            const menu = document.getElementById('vaOpMenu');
            if (menu) menu.classList.remove('show');
        });
        window.vaOpenColDlg = function() {
            const el = document.getElementById('vaColDlg');
            if (el) el.classList.add('show');
        };
        window.vaCloseColDlg = function() {
            const el = document.getElementById('vaColDlg');
            if (el) el.classList.remove('show');
        };
        window.vaCancelCashierReview = function() {
            const ids = window.getSelectedVoucherIds ? window.getSelectedVoucherIds() : [];
            if (!ids.length) { alert('请先选择凭证'); return; }
            if (!confirm('确认取消出纳复核？')) return;
            let list = JSON.parse(sessionStorage.getItem('ManualVouchers') || '[]');
            const idSet = new Set(ids);
            list.forEach(item => {
                if (!idSet.has(item.id)) return;
                delete item.cashierUser;
                if (item.status === '已记账') item.status = '已审核';
            });
            sessionStorage.setItem('ManualVouchers', JSON.stringify(list));
            loadContent('FinanceVoucherAudit');
        };
        window.vaAlert = function(msg) { alert(msg + '：功能待开发'); };
        window.vaHandleTimeModeChange = function(mode) {
            const current = mode === "period" ? "period" : "date";
            const dateIds = ["vaDateStart", "vaDateEnd"];
            const periodIds = ["vaPeriodStart", "vaPeriodEnd"];
            const dateWrap = document.getElementById("va-date-filter");
            const periodWrap = document.getElementById("va-period-filter");

            dateIds.forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.disabled = current !== "date";
            });
            periodIds.forEach((id) => {
                const el = document.getElementById(id);
                if (el) el.disabled = current !== "period";
            });

            if (dateWrap) dateWrap.classList.toggle("is-disabled", current !== "date");
            if (periodWrap) periodWrap.classList.toggle("is-disabled", current !== "period");

            document.querySelectorAll('input[name="va-time-mode"]').forEach((radio) => {
                radio.checked = radio.value === current;
            });
        };
        if (typeof window.updateVoucherActionButtons === "function") {
            window.updateVoucherActionButtons();
        }
        if (typeof window.refreshVoucherDocNoOptions === "function") {
            window.refreshVoucherDocNoOptions(true);
        }
        const initialTimeMode = (document.querySelector('input[name="va-time-mode"]:checked') || {}).value || "date";
        if (typeof window.vaHandleTimeModeChange === "function") {
            window.vaHandleTimeModeChange(initialTimeMode);
        }
        if (typeof window.applyVoucherAuditFilter === "function") {
            window.applyVoucherAuditFilter();
        }
        if (typeof window.renderVoucherAuditPage === "function") {
            window.renderVoucherAuditPage(1);
        }
    }, 0);

    contentArea.innerHTML = contentHTML;

};

// =========================================================================
// VoucherDetail
// =========================================================================
window.VM_MODULES['VoucherDetail'] = function(contentArea, contentHTML, moduleCode) {
        // 1. 尝试获取传递的基础信息
        let v = g_currentVoucher || { id: "无数据" };

        // 自动回捞完整数据
        if (v.id) {
            const allVouchers = JSON.parse(
                sessionStorage.getItem("ManualVouchers") || "[]"
            );
            const fullData = allVouchers.find((item) => item.id === v.id);
            if (fullData) v = fullData;
        }

        // 数据兜底
        if (!v.lines) v.lines = [];

        // ★★★ 核心修复：现场重新计算合计金额 (不再依赖 v.debit) ★★★
        let calcDebit = 0;
        let calcCredit = 0;

        v.lines.forEach((line) => {
            // 兼容不同字段名并去逗号
            const dStr = (line.jf || line.debit || "0").toString().replace(/,/g, "");
            const cStr = (line.df || line.credit || "0").toString().replace(/,/g, "");

            calcDebit += parseFloat(dStr) || 0;
            calcCredit += parseFloat(cStr) || 0;
        });

        // 格式化为字符串 (保留2位小数)
        const totalDebitStr = calcDebit.toFixed(2);
        const totalCreditStr = calcCredit.toFixed(2);
        // ★★★ 修复结束 ★★★

        // 解析日期
        const dateVal = v.date || new Date().toISOString().slice(0, 10);
        const dateObj = new Date(dateVal);
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        // ============================================================
        // ★★★ 核心修复：根据凭证号首字判断大标题 ★★★
        // ============================================================
        let titleText = "转 账 凭 证"; // 默认兜底
        let wordText = "转";         // 默认字号

        // 获取凭证号的第一个字 (例如 "收2025..." -> "收")
        const firstChar = v.id ? v.id.charAt(0) : "转";

        if (firstChar === '收') {
            titleText = "收 款 凭 证";
            wordText = "收";
        } else if (firstChar === '付') {
            titleText = "付 款 凭 证";
            wordText = "付";
        } else if (firstChar === '转') {
            titleText = "转 账 凭 证";
            wordText = "转";
        } else {
            // 其他凭证字（记、结等）统一显示为转账凭证，字号保留原始字
            titleText = "转 账 凭 证";
            wordText = firstChar;
        }

        // 凭证字 (右上角显示用)
        const voucherWord = firstChar;
        // 样式保持不变
        const voucherStyle = `
                    <style>
                        .voucher-box {
                            font-family: "SimSun", "Songti SC", serif;
                            color: #333;
                            width: 1000px;
                            margin: 0 auto;
                            padding: 30px;
                            background: #fff;
                            position: relative;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                            border: 1px solid #ddd;
                        }
                        .v-title-container { text-align: center; margin-bottom: 10px; position: relative; }
                        .v-title {
                            font-size: 36px; font-weight: bold; letter-spacing: 15px;
                            display: inline-block; border-bottom: 3px double #333;
                            padding-bottom: 5px; margin-bottom: 5px; text-shadow: 0.5px 0 0 #333;
                        }
                        .v-header-info {
                            display: flex; justify-content: space-between; align-items: flex-end;
                            margin-bottom: 5px; font-size: 15px; padding: 0 5px;
                        }
                        .v-date-group span {
                            display: inline-block; border-bottom: 1px solid #333;
                            width: 50px; text-align: center; margin: 0 2px; font-family: Arial;
                        }
                        .v-table { width: 100%; border-collapse: collapse; border: 2px solid #333; }
                        .v-table th, .v-table td {
                            border: 1px solid #333; height: 40px; vertical-align: middle; font-size: 15px;
                        }
                        .v-table th { text-align: center; font-weight: bold; padding: 5px; }
                        
                        /* 金额网格背景 */
                        .money-grid-bg {
                            background-image: linear-gradient(to right, transparent 95%, #ddd 95%);
                            background-size: 9.09% 100%; 
                            font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold;
                            letter-spacing: 6px; text-align: right; padding-right: 3px; overflow: hidden;
                        }
                        .money-header-row div {
                            display: flex; justify-content: space-between; padding: 0 2px;
                            color: #666; font-weight: normal; transform: scale(0.95); font-size: 12px;
                        }
                        .money-header-row span { flex: 1; text-align: center; border-right: 1px solid #eee; }
                        .money-header-row span:last-child { border: 0; }
                        .v-footer {
                            margin-top: 15px; display: flex; justify-content: space-between; font-size: 14px; padding: 0 10px;
                        }
                        .v-footer span {
                            display: inline-block; width: 70px; border-bottom: 1px solid #333; height: 20px; text-align: center;
                        }
                        .attachment-side { position: absolute; right: -25px; top: 110px; width: 20px; font-size: 13px; line-height: 1.2; text-align: center; }
                    </style>
                `;

        // 动态生成分录行
        const waybills = JSON.parse(sessionStorage.getItem("BizWaybills") || "[]");
        const sourceId = v.sourceNo || v.sourceId || v.waybillNo || v.bill_no;
        const matchedWaybill = sourceId ? waybills.find(w => w.id === sourceId) : null;
        const companyName = v.clientName || (matchedWaybill && matchedWaybill.client) || "";
        let linesHTML = "";
        const minRows = 5;
        const loopCount = Math.max(v.lines.length, minRows);

        for (let i = 0; i < loopCount; i++) {
            const line = v.lines[i] || {};

            const rawSummary = line.summary || line.zy || "";
            const summary = rawSummary && companyName
                ? (rawSummary.includes(companyName) ? rawSummary : `${rawSummary} - ${companyName}`)
                : rawSummary;
            const accountStr = line.account || line.subject || line.km || "";
            let debit = line.debit || line.jf || "";
            let credit = line.credit || line.df || "";

            let subjectCode = (line.accountCode || "").toString().trim();
            let subjectName = (line.accountName || "").toString().trim();

            if (!subjectCode || !subjectName) {
                let fallbackName = accountStr;
                let fallbackCode = subjectCode;
                const match = accountStr.match(/^([0-9-]+)\s*(.*)$/);
                if (match) {
                    fallbackCode = match[1];
                    fallbackName = match[2].trim();
                } else if (/^[0-9-]+$/.test(accountStr)) {
                    fallbackCode = accountStr;
                    fallbackName = "";
                }
                if (!subjectCode) subjectCode = fallbackCode || "";
                if (!subjectName) subjectName = fallbackName || "";
            }
            // 如果名称仍为空，查 AcctSubjects 补充
            if (!subjectName && subjectCode) {
                try {
                    const _subs = JSON.parse(sessionStorage.getItem('AcctSubjects') || '[]');
                    const _found = _subs.find(s => (s.code || '').toString().trim() === subjectCode);
                    if (_found && _found.name) subjectName = _found.name;
                } catch(e) {}
            }
            // 最终兜底：内置常用科目名称（防止科目表缺失时显示"-"）
            if (!subjectName && subjectCode) {
                const _BUILTIN = {
                    "1001":"库存现金","1002":"银行存款","1012":"其他货币资金",
                    "1101":"短期投资","1121":"应收票据","1122":"应收账款",
                    "1123":"预付账款","1131":"应收股利","1132":"应收利息",
                    "1221":"其他应收款","1231":"坏账准备","1401":"物资采购",
                    "1402":"在途物资","1403":"原材料","1405":"库存商品",
                    "2001":"短期借款","2201":"应付票据","2202":"应付账款",
                    "2203":"预收账款","2211":"应付职工薪酬","2221":"应交税费",
                    "222101":"应交增值税","222102":"应交城市维建税",
                    "222103":"应交教育费附加","222104":"应交地方教育附加",
                    "222105":"应交个人所得税","2231":"应付利息",
                    "2241":"其他应付款","2501":"长期借款",
                    "3001":"实收资本","3002":"资本公积",
                    "3101":"实收资本","3102":"资本公积",
                    "3103":"本年利润","3104":"利润分配",
                    "4001":"实收资本","4002":"资本公积",
                    "4101":"实收资本","4102":"资本公积",
                    "4103":"本年利润","4104":"利润分配",
                    "5001":"主营业务收入","5101":"其他业务收入",
                    "5201":"营业外收入",
                    "5301":"主营业务成本","5401":"主营业务成本",
                    "5403":"税金及附加","5601":"管理费用","5701":"财务费用",
                    "6001":"主营业务收入","6002":"其他业务收入",
                    "6051":"利息收入","6111":"投资收益","6301":"营业外收入",
                    "6401":"主营业务成本","6402":"其他业务成本",
                    "6403":"税金及附加","6601":"销售费用","6602":"管理费用",
                    "6603":"财务费用","6701":"资产减值损失",
                    "6711":"营业外支出","6801":"所得税费用"
                };
                // 先精确匹配，再前缀匹配（处理 640101 等子科目）
                if (_BUILTIN[subjectCode]) {
                    subjectName = _BUILTIN[subjectCode];
                } else {
                    const parentCode = Object.keys(_BUILTIN).find(k => subjectCode.startsWith(k) && k.length >= 4);
                    if (parentCode) subjectName = _BUILTIN[parentCode];
                }
            }

            const auxCode = line.auxCode || "";
            const auxName = line.auxName || "";
            let auxDisplay = "";
            if (auxCode || auxName) {
                auxDisplay = [auxCode, auxName].filter(Boolean).join(" ");
            } else if (line.aux) {
                auxDisplay = line.aux;
            } else if (line.auxiliary) {
                auxDisplay = line.auxiliary;
            }

            const debitVal = debit ? debit.toString().replace(/,/g, "") : "";
            const creditVal = credit ? credit.toString().replace(/,/g, "") : "";
            const rowColor = v.isRed ? "color: red;" : "";

            linesHTML += `
                        <tr style="${rowColor}">
                            <td style="padding:0 8px;">${summary}</td>
                            <td style="padding:0 8px;">${subjectName || "-"}</td>
                            <td style="padding:0 8px; text-align:center;">${subjectCode || "-"}</td>
                            <td style="text-align:center;">${auxDisplay || "-"
                }</td>
                            <td class="money-grid-bg">${debitVal}</td>
                            <td class="money-grid-bg">${creditVal}</td>
                        </tr>
                    `;
        }

        contentHTML += `
        ${voucherStyle}
        
        <div style="margin-bottom:20px; display:flex; justify-content:space-between;">
            <button class="btn-primary" style="background-color: #95a5a6;" onclick="loadContent('FinanceVoucherAudit')"> < 返回列表</button>
            <div>
                <button class="btn-primary" style="background-color: #3498db;" onclick="window.print()">🖨 打印凭证</button>
            </div>
        </div>

        <div class="voucher-box">
            <div class="v-title-container">
                <div class="v-title">${titleText}</div>
                
                <div style="position:absolute; right:10px; top:10px; font-size:14px;">${wordText}字第 ${v.id.replace(/\D/g, "")} 号</div>
            </div>

            <div class="v-header-info">
                <div style="visibility:hidden;">占位</div>
                <div class="v-date-group">
                    <span>${y}</span>年<span>${m}</span>月<span>${d}</span>日
                </div>
                <div style="visibility:hidden;">占位</div>
            </div>

            <table class="v-table">
                <thead>
                    <tr>
                        <th rowspan="2" style="width: 15%;">摘 要</th>
                        <th rowspan="2" style="width: 15%;">总账科目</th>
                        <th rowspan="2" style="width: 15%;">明细科目</th>
                        <th rowspan="2" style="width: 15%;">辅助项</th>
                        <th style="width: 20%;">借 方 金 额</th>
                        <th style="width: 20%;">贷 方 金 额</th>
                    </tr>
                    <tr class="money-header-row">
                        <th style="padding:0;">
                            <div style="border:none;">
                                <span>千</span><span>百</span><span>十</span><span>万</span><span>千</span><span>百</span><span>十</span><span>元</span><span>角</span><span>分</span>
                            </div>
                        </th>
                        <th style="padding:0;">
                            <div style="border:none;">
                                <span>千</span><span>百</span><span>十</span><span>万</span><span>千</span><span>百</span><span>十</span><span>元</span><span>角</span><span>分</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${linesHTML}
                    <tr style="${v.isRed ? "color:red;" : ""}">
                        <td colspan="3" style="text-align: left; padding-left: 20px; font-weight: bold;">合　　计</td>
                        <td></td>
                        <td class="money-grid-bg">
                            <span style="float:left; font-size:12px; margin-top:3px; margin-left:5px;">¥</span>
                            ${totalDebitStr}
                        </td>
                        <td class="money-grid-bg">
                            <span style="float:left; font-size:12px; margin-top:3px; margin-left:5px;">¥</span>
                            ${totalCreditStr}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="attachment-side">附<br>单<br>据<br><br><strong>1</strong><br><br>张</div>

            <div class="v-footer">
                <div>财务主管：<span>___________</span></div>
                <div>记账：<span>${v.bookkeeperUser || ""}</span></div>
                <div>出纳：<span>${v.cashierUser || ""}</span></div>
                <div>审核：<span>${v.auditUser || "张三"}</span></div>
                <div>制单：<span>${v.user || "系统引擎"}</span></div>
            </div>
        </div>
    `;

    contentArea.innerHTML = contentHTML;

};
