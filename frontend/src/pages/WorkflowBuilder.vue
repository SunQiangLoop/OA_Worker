<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { workflowApi } from '../services/api'

const router = useRouter()

const steps = [
  { key: 'basic', label: '基础设置' },
  { key: 'form', label: '表单设计' },
  { key: 'flow', label: '流程设计' },
  { key: 'advanced', label: '高级设置' },
]

const activeStep = ref('basic')

const basicForm = reactive({
  name: '',
  desc: '',
  category: '财务',
  submitterScope: '全员',
  adminType: 'all_admin',
})

const nameCharCount = computed(() => basicForm.name.length)
const descCharCount = computed(() => basicForm.desc.length)

// ── 表单设计 ─────────────────────────────────────────────────────────────────

const formGroups = [
  { title: '基础控件', items: ['单行输入框', '多行输入框', '数字输入框', '单选框', '多选框', '日期', '日期区间', '说明文字', '身份证', '电话'] },
  { title: '增强控件', items: ['级联/分类', 'AI控件', '图片', '明细/表格', '金额', '附件', '手写签名', '外部联系人', '联系人', '部门', '通讯录部门', '地点', '计算公式', '关联审批单', '省市区', '评分'] },
]

const fieldIconMap = {
  单行输入框: { text: 'Aa', icon: 'text' },
  多行输入框: { text: '', icon: 'lines' },
  数字输入框: { text: '123', icon: 'plain' },
  单选框: { text: '', icon: 'radio' },
  多选框: { text: '', icon: 'check' },
  日期: { text: '', icon: 'calendar' },
  日期区间: { text: '', icon: 'calendar' },
  说明文字: { text: '', icon: 'info' },
  身份证: { text: '', icon: 'idcard' },
  电话: { text: '', icon: 'phone' },
  '级联/分类': { text: '', icon: 'user' },
  AI控件: { text: '', icon: 'ai', badge: '限时免费' },
  图片: { text: '', icon: 'image' },
  '明细/表格': { text: '', icon: 'table' },
  金额: { text: '', icon: 'money' },
  附件: { text: '', icon: 'clip' },
  手写签名: { text: '', icon: 'pen' },
  外部联系人: { text: '', icon: 'link' },
  联系人: { text: '', icon: 'user' },
  部门: { text: '', icon: 'org' },
  通讯录部门: { text: '', icon: 'org' },
  地点: { text: '', icon: 'pin' },
  计算公式: { text: '', icon: 'formula' },
  关联审批单: { text: '', icon: 'chain' },
  省市区: { text: '', icon: 'map' },
  评分: { text: '', icon: 'star' },
}

const fieldMetaByType = {
  单行输入框: { label: '单行输入框', placeholder: '请输入', unit: '', min: '' },
  多行输入框: { label: '多行输入框', placeholder: '请输入内容', unit: '', min: '' },
  说明文字: { label: '说明文字', placeholder: '请输入说明', unit: '', min: '' },
  数字输入框: { label: '数字输入框', placeholder: '请输入', unit: '', min: '0' },
  金额: { label: '金额', placeholder: '0.00', unit: '元', min: '0' },
  计算公式: { label: '计算公式', placeholder: '输入公式', unit: '', min: '' },
  单选: { label: '单选', placeholder: '请选择', unit: '', min: '' },
  多选: { label: '多选', placeholder: '请选择', unit: '', min: '' },
  日期: { label: '日期', placeholder: '请选择日期', unit: '', min: '' },
  日期区间: { label: '日期区间', placeholder: '请选择', unit: '', min: '' },
  '明细/表格': { label: '明细', placeholder: '添加明细', unit: '', min: '' },
  图片: { label: '图片', placeholder: '上传图片', unit: '', min: '' },
  附件: { label: '附件', placeholder: '上传文件', unit: '', min: '' },
  部门: { label: '部门', placeholder: '请选择部门', unit: '', min: '' },
  联系人: { label: '联系人', placeholder: '请选择联系人', unit: '', min: '' },
}

const formFields = ref([
  { id: 'sample-date-range', type: '日期区间', label: '日期区间', placeholder: '请选择', unit: '', min: '', required: false },
  { id: 'sample-phone', type: '电话', label: '电话', placeholder: '请输入', unit: '', min: '', required: false },
  { id: 'sample-ai', type: 'AI控件', label: 'AI控件', placeholder: '无需手动输入，提交后AI自动进行解读并输出内容', unit: '', min: '', required: false },
])
const selectedFieldId = ref('sample-date-range')

const selectedField = computed(
  () => formFields.value.find((f) => f.id === selectedFieldId.value) || null,
)

function createField(type) {
  const meta = fieldMetaByType[type] || { label: type, placeholder: '请输入', unit: '', min: '' }
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    label: meta.label,
    placeholder: meta.placeholder,
    unit: meta.unit,
    min: meta.min,
    required: false,
  }
}

function addField(type) {
  const field = createField(type)
  formFields.value.push(field)
  selectedFieldId.value = field.id
}

function deleteField(id) {
  formFields.value = formFields.value.filter((f) => f.id !== id)
  if (selectedFieldId.value === id) selectedFieldId.value = ''
}

function onDragStart(item, event) {
  event.dataTransfer.setData('text/plain', item)
  event.dataTransfer.effectAllowed = 'copy'
}

function onDrop(event) {
  event.preventDefault()
  const type = event.dataTransfer.getData('text/plain')
  if (type) addField(type)
}

function onDragOver(event) {
  event.preventDefault()
}

// ── 流程设计 ─────────────────────────────────────────────────────────────────

const flowStageRef = ref(null)
const menuOpen = ref(false)
const menuPos = ref({ top: 0, left: 0 })
const menuLine = ref({ top: 0, left: 0, width: 0 })
const insertTarget = ref({ scope: 'main', index: 0, conditionId: '', branchId: '' })

const approverTypeOptions = [
  { value: 'leader', label: '上级' },
  { value: 'member', label: '指定成员' },
  { value: 'role', label: '按角色' },
  { value: 'self', label: '提交人本人' },
]

const approveModeOptions = [
  { value: 'or_sign', label: '或签（任意一人同意即通过）' },
  { value: 'and_sign', label: '会签（所有人同意才通过）' },
  { value: 'sequential', label: '依次审批（按顺序逐人审批）' },
]

const emptyApproverRuleOptions = [
  { value: 'auto_pass', label: '自动通过' },
  { value: 'transfer_admin', label: '转交管理员' },
]

const ccTypeOptions = [
  { value: 'self', label: '发起人自选' },
  { value: 'member', label: '指定成员' },
]

function approverTypeLabel(type) {
  return approverTypeOptions.find((o) => o.value === type)?.label || '上级'
}

function ccTypeLabel(type) {
  return ccTypeOptions.find((o) => o.value === type)?.label || '发起人自选'
}

const flowNodes = ref([
  {
    id: 'approval-1',
    type: 'approval',
    title: '审批人',
    body: '上级',
    removable: true,
    approverType: 'leader',
    approveMode: 'or_sign',
    emptyApproverRule: 'auto_pass',
  },
  {
    id: 'cc-1',
    type: 'cc',
    title: '抄送人',
    body: '发起人自选',
    removable: true,
    ccType: 'self',
  },
])

const flowMenuGroups = [
  {
    title: '人工节点',
    items: [
      { label: '审批人', icon: 'person', color: 'orange', type: 'approval' },
      { label: '抄送人', icon: 'send', color: 'blue', type: 'cc' },
      { label: '办理人', icon: 'doc', color: 'red', type: 'handler' },
    ],
  },
  {
    title: '分支节点',
    items: [
      { label: '条件分支', icon: 'branch', color: 'green', type: 'condition' },
      { label: '并行分支', icon: 'parallel', color: 'cyan', type: 'parallel' },
    ],
  },
  {
    title: '自动化',
    items: [
      { label: '自动化', icon: 'ai', color: 'pink', type: 'automation' },
      { label: '连接器', icon: 'connector', color: 'indigo', type: 'connector' },
    ],
  },
  {
    title: '套件',
    items: [{ label: '付款人', icon: 'pay', color: 'purple', type: 'payer' }],
  },
]

function openFlowMenu(event, target) {
  event.stopPropagation()
  const stage = flowStageRef.value
  if (!stage) return
  const stageRect = stage.getBoundingClientRect()
  const btnRect = event.currentTarget.getBoundingClientRect()
  const left = btnRect.right - stageRect.left + 16
  const top = btnRect.top - stageRect.top - 10
  menuPos.value = { top, left }
  menuLine.value = {
    top: btnRect.top - stageRect.top + btnRect.height / 2,
    left: btnRect.right - stageRect.left,
    width: 16,
  }
  insertTarget.value = target
  menuOpen.value = true
}

function closeFlowMenu() {
  menuOpen.value = false
}

function addFlowNode(item) {
  if (!item || !item.type) return
  if (item.type === 'condition') {
    if (insertTarget.value.scope !== 'main') return
    const conditionNode = createConditionNode()
    flowNodes.value.splice(insertTarget.value.index, 0, conditionNode)
    selectedConditionId.value = conditionNode.id
    selectedBranchId.value = conditionNode.branches[0]?.id || ''
    selectedNodeId.value = ''
    closeFlowMenu()
    return
  }
  if (item.type === 'parallel') return
  const node = createSimpleNode(item.type, item.label)
  if (insertTarget.value.scope === 'branch') {
    const condition = flowNodes.value.find((n) => n.id === insertTarget.value.conditionId)
    const branch = condition?.branches?.find((b) => b.id === insertTarget.value.branchId)
    if (branch) branch.nodes.splice(insertTarget.value.index, 0, node)
  } else {
    flowNodes.value.splice(insertTarget.value.index, 0, node)
  }
  closeFlowMenu()
}

function removeFlowNode(id) {
  flowNodes.value = flowNodes.value.filter((node) => node.id !== id)
  if (selectedNodeId.value === id) selectedNodeId.value = ''
}

function removeBranchNode(conditionId, branchId, nodeId) {
  const condition = flowNodes.value.find((n) => n.id === conditionId)
  const branch = condition?.branches?.find((b) => b.id === branchId)
  if (!branch) return
  branch.nodes = branch.nodes.filter((n) => n.id !== nodeId)
}

function createSimpleNode(type, label) {
  const base = {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    title: label,
    removable: true,
  }
  if (type === 'approval') {
    return { ...base, body: '上级', approverType: 'leader', approveMode: 'or_sign', emptyApproverRule: 'auto_pass' }
  }
  if (type === 'cc') {
    return { ...base, body: '发起人自选', ccType: 'self' }
  }
  return { ...base, body: '请选择办理人' }
}

function createConditionNode() {
  const id = `condition-${Date.now()}`
  return {
    id,
    type: 'condition',
    title: '添加条件',
    branches: [
      { id: `${id}-a`, title: '条件1', hint: '请设置条件', nodes: [], removable: true },
      { id: `${id}-default`, title: '默认条件', hint: '其他条件进入此流程', nodes: [], removable: false, isDefault: true },
    ],
  }
}

const nodeTypeClass = (type) => {
  if (type === 'approval') return 'approval'
  if (type === 'cc') return 'cc'
  if (type === 'handler') return 'handler'
  if (type === 'condition') return 'condition'
  return 'approval'
}

// 节点配置面板
const selectedNodeId = ref('')
const selectedNode = computed(
  () => flowNodes.value.find((n) => n.id === selectedNodeId.value) || null,
)
// 编辑中的临时状态（避免直接改 node 导致 body 不同步）
const editingNode = reactive({
  title: '',
  approverType: 'leader',
  approveMode: 'or_sign',
  emptyApproverRule: 'auto_pass',
  ccType: 'self',
})

function openNodeConfig(node) {
  if (node.type === 'condition') return
  selectedNodeId.value = node.id
  selectedConditionId.value = ''
  selectedBranchId.value = ''
  editingNode.title = node.title
  editingNode.approverType = node.approverType || 'leader'
  editingNode.approveMode = node.approveMode || 'or_sign'
  editingNode.emptyApproverRule = node.emptyApproverRule || 'auto_pass'
  editingNode.ccType = node.ccType || 'self'
}

function saveNodeConfig() {
  const node = flowNodes.value.find((n) => n.id === selectedNodeId.value)
  if (!node) return
  node.title = editingNode.title || node.title
  if (node.type === 'approval') {
    node.approverType = editingNode.approverType
    node.approveMode = editingNode.approveMode
    node.emptyApproverRule = editingNode.emptyApproverRule
    node.body = approverTypeLabel(editingNode.approverType)
  }
  if (node.type === 'cc') {
    node.ccType = editingNode.ccType
    node.body = ccTypeLabel(editingNode.ccType)
  }
  selectedNodeId.value = ''
}

function closeNodeConfig() {
  selectedNodeId.value = ''
}

// 条件分支面板（原有逻辑）
const selectedConditionId = ref('')
const selectedBranchId = ref('')

const selectedCondition = computed(
  () => flowNodes.value.find((node) => node.id === selectedConditionId.value && node.type === 'condition') || null,
)
const selectedBranch = computed(
  () => selectedCondition.value?.branches?.find((b) => b.id === selectedBranchId.value) || null,
)

function selectConditionBranch(conditionId, branchId) {
  selectedConditionId.value = conditionId
  selectedBranchId.value = branchId
  selectedNodeId.value = ''
}

function closeConditionPanel() {
  selectedConditionId.value = ''
  selectedBranchId.value = ''
}

// ── 高级设置 ──────────────────────────────────────────────────────────────────

const advancedForm = reactive({
  visibilityScope: 'all',       // all / participant
  managementScope: 'all',       // all / same_level / subordinate / custom
  permissions: { view: true, export: true, delete: true },
})

// ── 验证与发布 ────────────────────────────────────────────────────────────────

const isBasicValid = computed(() => Boolean(basicForm.name && basicForm.category))
const isFormValid = computed(() => formFields.value.length > 0)
const isFlowValid = computed(() => flowNodes.value.length > 0)
const isAdvancedValid = computed(() => true)

const canPublish = computed(
  () => isBasicValid.value && isFormValid.value && isFlowValid.value && isAdvancedValid.value,
)

const publishing = ref(false)

async function publishFlow() {
  if (!isBasicValid.value) {
    activeStep.value = 'basic'
    alert('请完善基础设置（表单名称和分组为必填）')
    return
  }
  if (!isFormValid.value) {
    activeStep.value = 'form'
    alert('请至少添加一个表单字段')
    return
  }
  if (!isFlowValid.value) {
    activeStep.value = 'flow'
    alert('请配置审批流程节点')
    return
  }

  publishing.value = true
  try {
    const nodes = flowNodes.value.map((node, idx) => {
      const next = flowNodes.value[idx + 1]
      return {
        node_key: node.id,
        node_type: node.type,
        node_name: node.title,
        approve_mode: node.approveMode || 'or_sign',
        empty_approver_rule: node.emptyApproverRule || 'auto_pass',
        assignee_rule: node.type === 'cc'
          ? { type: node.ccType || 'self' }
          : { type: node.approverType || 'leader' },
        condition_rule: null,
        next_node_key: next?.id || '',
      }
    })

    await workflowApi.createTemplate({
      name: basicForm.name,
      description: basicForm.desc,
      category: basicForm.category,
      submitter_scope: basicForm.submitterScope,
      admin_type: basicForm.adminType,
      form_fields: formFields.value,
      visibility_scope: advancedForm.visibilityScope,
      nodes,
    })

    router.push('/approvals/apply')
  } catch (err) {
    alert('发布失败：' + (err?.response?.data?.message || err.message || '请重试'))
  } finally {
    publishing.value = false
  }
}

function goToStep(key) {
  activeStep.value = key
}

function goNextStep() {
  const keys = steps.map((s) => s.key)
  const idx = keys.indexOf(activeStep.value)
  if (idx < keys.length - 1) activeStep.value = keys[idx + 1]
}
</script>

<template>
  <div class="oa-builder">
    <div class="workflow-topbar">
      <div class="builder-titlebar">
        <button class="builder-back" type="button" @click="router.push('/approvals')"></button>
        <span class="approval-logo"><i></i></span>
      </div>
      <div class="topbar-title">
        <div class="title">{{ basicForm.name || '未命名审批' }}</div>
        <div class="draft-line">草稿（保存于1分钟前）<span></span></div>
      </div>
      <div class="topbar-steps">
        <button
          v-for="(step, idx) in steps"
          :key="step.key"
          class="topbar-step"
          :class="{ active: activeStep === step.key }"
          type="button"
          @click="goToStep(step.key)"
        >
          <span class="step-index">{{ idx + 1 }}</span>
          {{ step.label }}
        </button>
      </div>
      <div class="topbar-actions">
        <button class="help-link" type="button"><span>?</span> 帮助</button>
        <button class="preview-btn" type="button">预览</button>
        <button
          class="publish-btn"
          type="button"
          :disabled="publishing"
          @click="publishFlow"
        >
          {{ publishing ? '发布中…' : '发布' }}
        </button>
      </div>
    </div>

    <!-- ①基础设置 -->
    <div v-if="activeStep === 'basic'" class="basic-screen">
      <section class="basic-card">
        <div class="basic-icon-wrap">
          <span class="approval-logo big"><i></i></span>
          <button class="edit-logo" type="button"></button>
        </div>
        <div class="basic-fields">
          <label class="field required">
            <span>表单名称</span>
            <input v-model="basicForm.name" type="text" maxlength="50" placeholder="请输入" />
            <em>{{ nameCharCount }} / 50</em>
          </label>
          <label class="field required">
            <span>所在分组</span>
            <select v-model="basicForm.category">
              <option value="">请选择</option>
              <option>财务</option>
              <option>行政</option>
              <option>人事</option>
              <option>业务</option>
            </select>
          </label>
          <label class="field">
            <span>表单说明</span>
            <textarea v-model="basicForm.desc" rows="4" maxlength="100" placeholder="请输入"></textarea>
            <em>{{ descCharCount }} / 100</em>
          </label>
          <div class="radio-row">
            <span class="label required">谁可以发起</span>
            <label><input v-model="basicForm.submitterScope" type="radio" value="全员" /> 全部</label>
            <label><input v-model="basicForm.submitterScope" type="radio" value="指定成员" /> 指定成员</label>
          </div>
          <div v-if="basicForm.submitterScope === '指定成员'" class="field sub-field">
            <input type="text" placeholder="请选择指定成员（部门/角色/人员）" />
          </div>
          <div class="radio-row">
            <span class="label required">表单管理员</span>
            <label><input v-model="basicForm.adminType" type="radio" value="all_admin" /> 全部「OA审批」管理员</label>
            <label><input v-model="basicForm.adminType" type="radio" value="specified" /> 指定「OA审批」管理员</label>
          </div>
        </div>
      </section>
    </div>

    <!-- ②表单设计 -->
    <div v-else-if="activeStep === 'form'" class="form-designer-screen">
      <section class="form-toolbox">
        <div class="toolbox-title">控件</div>
        <div class="toolbox-body">
          <div v-for="group in formGroups" :key="group.title" class="tool-group">
            <div class="tool-title">{{ group.title }}<span></span></div>
            <div class="tool-items tool-grid">
              <div
                v-for="item in group.items"
                :key="item"
                class="tool-tile"
                draggable="true"
                @dragstart="onDragStart(item, $event)"
                @click="addField(item)"
              >
                <span class="draw-icon small" :class="fieldIconMap[item]?.icon || 'text'">{{ fieldIconMap[item]?.text }}</span>
                <span class="tool-label">{{ item }}</span>
                <em v-if="fieldIconMap[item]?.badge">{{ fieldIconMap[item].badge }}</em>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="form-preview">
        <div class="preview-toolbar">
          <div class="toolbar-tabs">
            <button class="device-btn active" type="button"><span class="pc-icon"></span></button>
            <button class="device-btn" type="button"><span class="phone-icon"></span></button>
            <button class="toolbar-icon undo" type="button"></button>
            <button class="toolbar-icon redo" type="button"></button>
          </div>
          <div class="toolbar-actions">
            <button class="advanced-function" type="button">高级功能<span></span></button>
          </div>
        </div>
        <div class="preview-body">
          <div class="phone-frame">
            <div class="phone-notch"></div>
            <div class="phone-body" @drop="onDrop" @dragover="onDragOver">
              <div class="phone-field compact">
                <div class="field-title">单行输入框</div>
                <div class="field-input">请输入</div>
              </div>
              <div class="phone-drop">
                <span>分栏</span>
                <strong>拖动控件到这里</strong>
              </div>
              <div class="invoice-block">
                <span>发票</span>
                <button type="button"></button>
              </div>
              <div
                v-for="field in formFields"
                :key="field.id"
                class="phone-field"
                :class="{ active: field.id === selectedFieldId }"
                @click="selectedFieldId = field.id"
              >
                <div class="field-row">
                  <div>
                    <div class="field-title">
                      {{ field.label }}
                      <span v-if="field.required" class="required-star">*</span>
                    </div>
                    <div class="field-input">{{ field.placeholder }}</div>
                  </div>
                  <div v-if="field.id === selectedFieldId" class="field-actions">
                    <button class="copy-field" type="button"></button>
                    <button class="trash-field" type="button" @click.stop="deleteField(field.id)"></button>
                  </div>
                  <span v-else-if="field.type === '日期区间'" class="phone-chevron"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="form-settings">
        <div class="settings-title"><span class="draw-icon small calendar"></span>{{ selectedField?.label || '日期区间' }}</div>
        <div class="settings-body">
          <template v-if="selectedField">
            <label class="field">
              <span>标题1</span>
              <input v-model="selectedField.label" type="text" placeholder="开始时间" />
            </label>
            <label class="field">
              <span>标题2</span>
              <input type="text" value="结束时间" />
            </label>
            <label class="field">
              <span>日期类型</span>
              <select><option>年-月-日</option></select>
            </label>
            <label class="field count-field">
              <span>提示文字</span>
              <input v-model="selectedField.placeholder" type="text" maxlength="50" />
              <em>{{ selectedField.placeholder.length }} / 50</em>
            </label>
            <div class="toggle-row"><span>必填</span><label class="switch"><input v-model="selectedField.required" type="checkbox" /><span></span></label></div>
            <div class="toggle-row"><span>自动计算时长</span><label class="switch"><input type="checkbox" /><span></span></label></div>
            <div class="toggle-row"><span>参与打印 <small>如不勾选，打印时不显示该项</small></span><label class="switch"><input type="checkbox" checked /><span></span></label></div>
          </template>
          <div v-else class="empty">请选择字段进行配置</div>
        </div>
      </aside>
    </div>

    <!-- ③流程设计 -->
    <div v-else-if="activeStep === 'flow'" class="flow-page">
      <div class="flow-topbar">
        <div class="flow-version">
          未发布版本
          <span class="design-tag">设计中</span>
        </div>
        <div class="flow-actions">
          <button class="advanced-function" type="button">高级功能<span></span></button>
        </div>
        <div class="zoom-control">
          <button type="button">-</button>
          <span>100%</span>
          <button type="button">+</button>
        </div>
      </div>

      <div class="flow-canvas">
        <div class="flow-stage" ref="flowStageRef" @click="closeFlowMenu">
          <!-- 发起节点 -->
          <div class="flow-node-card start">
            <div class="node-title">发起人</div>
            <div class="node-body">
              团队测试
              <span class="node-arrow">›</span>
            </div>
          </div>
          <button
            class="flow-connector"
            type="button"
            @click="openFlowMenu($event, { scope: 'main', index: 0, conditionId: '', branchId: '' })"
          >+</button>

          <template v-for="(node, idx) in flowNodes" :key="node.id">
            <template v-if="node.type !== 'condition'">
              <div
                class="flow-node-card"
                :class="[nodeTypeClass(node.type), { 'node-selected': selectedNodeId === node.id }]"
                @click.stop="openNodeConfig(node)"
              >
                <div class="node-title">
                  <span><i class="node-mini" :class="node.type"></i>{{ node.title }}</span>
                  <button
                    v-if="node.removable"
                    class="node-remove"
                    type="button"
                    @click.stop="removeFlowNode(node.id)"
                  >×</button>
                </div>
                <div class="node-body">
                  {{ node.body }}
                  <span class="node-arrow">›</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="condition-block">
                <div class="condition-pill">添加条件</div>
                <div class="condition-branches">
                  <div v-for="branch in node.branches" :key="branch.id" class="condition-branch">
                    <div
                      class="condition-card"
                      :class="{ default: branch.isDefault, active: selectedBranchId === branch.id }"
                      @click.stop="selectConditionBranch(node.id, branch.id)"
                    >
                      <div class="condition-card-title">
                        <span>{{ branch.title }}</span>
                        <div class="condition-card-actions">
                          <span v-if="branch.isDefault" class="muted">优先级2</span>
                          <button
                            v-if="branch.removable"
                            class="node-remove"
                            type="button"
                            @click.stop="removeFlowNode(node.id)"
                          >×</button>
                        </div>
                      </div>
                      <div class="condition-card-body">{{ branch.hint }}</div>
                    </div>
                    <button
                      class="flow-connector branch"
                      type="button"
                      @click="openFlowMenu($event, { scope: 'branch', index: branch.nodes.length, conditionId: node.id, branchId: branch.id })"
                    >+</button>
                    <div v-if="branch.nodes.length" class="branch-nodes">
                      <div
                        v-for="child in branch.nodes"
                        :key="child.id"
                        class="flow-node-card"
                        :class="nodeTypeClass(child.type)"
                        @click.stop="openNodeConfig(child)"
                      >
                        <div class="node-title">
                          <span>{{ child.title }}</span>
                          <button
                            v-if="child.removable"
                            class="node-remove"
                            type="button"
                            @click.stop="removeBranchNode(node.id, branch.id, child.id)"
                          >×</button>
                        </div>
                        <div class="node-body">
                          {{ child.body }}
                          <span class="node-arrow">›</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <button
              class="flow-connector"
              type="button"
              @click="openFlowMenu($event, { scope: 'main', index: idx + 1, conditionId: '', branchId: '' })"
            >+</button>
          </template>
          <div class="flow-end">流程结束</div>

          <div
            v-if="menuOpen"
            class="flow-menu-connector"
            :style="{ top: `${menuLine.top}px`, left: `${menuLine.left}px`, width: `${menuLine.width}px` }"
          ></div>
          <div
            v-if="menuOpen"
            class="flow-menu"
            :style="{ top: `${menuPos.top}px`, left: `${menuPos.left}px` }"
            @click.stop
          >
            <div v-for="group in flowMenuGroups" :key="group.title" class="flow-menu-group">
              <div class="flow-menu-title">{{ group.title }}</div>
              <div class="flow-menu-grid">
                <button
                  v-for="item in group.items"
                  :key="item.label"
                  class="flow-menu-item"
                  type="button"
                  @click="addFlowNode(item)"
                >
                  <span class="menu-icon" :class="[item.icon, item.color]"></span>
                  <span>{{ item.label }}</span>
                  <small v-if="item.type === 'payer'">?</small>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 节点配置面板 -->
        <aside v-if="selectedNode" class="condition-panel node-config-panel">
          <div class="condition-panel-header">
            <div class="panel-title">{{ selectedNode.type === 'approval' ? '审批节点设置' : '抄送节点设置' }}</div>
            <button class="btn btn-ghost" type="button" @click="closeNodeConfig">×</button>
          </div>

          <label class="field">
            <span>节点名称</span>
            <input v-model="editingNode.title" type="text" placeholder="请输入节点名称" />
          </label>

          <!-- 审批节点专属配置 -->
          <template v-if="selectedNode.type === 'approval'">
            <div class="config-section">
              <div class="config-section-title">审批人</div>
              <div class="config-options">
                <label
                  v-for="opt in approverTypeOptions"
                  :key="opt.value"
                  class="config-option"
                  :class="{ active: editingNode.approverType === opt.value }"
                >
                  <input v-model="editingNode.approverType" type="radio" :value="opt.value" />
                  {{ opt.label }}
                </label>
              </div>
            </div>

            <div class="config-section">
              <div class="config-section-title">审批方式</div>
              <div class="config-options vertical">
                <label
                  v-for="opt in approveModeOptions"
                  :key="opt.value"
                  class="config-option"
                  :class="{ active: editingNode.approveMode === opt.value }"
                >
                  <input v-model="editingNode.approveMode" type="radio" :value="opt.value" />
                  {{ opt.label }}
                </label>
              </div>
            </div>

            <div class="config-section">
              <div class="config-section-title">审批人为空时</div>
              <div class="config-options vertical">
                <label
                  v-for="opt in emptyApproverRuleOptions"
                  :key="opt.value"
                  class="config-option"
                  :class="{ active: editingNode.emptyApproverRule === opt.value }"
                >
                  <input v-model="editingNode.emptyApproverRule" type="radio" :value="opt.value" />
                  {{ opt.label }}
                </label>
              </div>
            </div>
          </template>

          <!-- 抄送节点专属配置 -->
          <template v-if="selectedNode.type === 'cc'">
            <div class="config-section">
              <div class="config-section-title">抄送人</div>
              <div class="config-options vertical">
                <label
                  v-for="opt in ccTypeOptions"
                  :key="opt.value"
                  class="config-option"
                  :class="{ active: editingNode.ccType === opt.value }"
                >
                  <input v-model="editingNode.ccType" type="radio" :value="opt.value" />
                  {{ opt.label }}
                </label>
              </div>
            </div>
          </template>

          <div class="condition-footer">
            <button class="btn btn-ghost" type="button" @click="closeNodeConfig">取消</button>
            <button class="btn btn-primary" type="button" @click="saveNodeConfig">保存</button>
          </div>
        </aside>

        <!-- 条件分支面板 -->
        <aside v-else-if="selectedCondition" class="condition-panel">
          <div class="condition-panel-header">
            <div class="panel-title">{{ selectedBranch?.title || '条件' }}</div>
            <div class="panel-actions">
              <select>
                <option>优先级1</option>
                <option>优先级2</option>
              </select>
              <button class="btn btn-ghost" type="button" @click="closeConditionPanel">×</button>
            </div>
          </div>
          <div class="condition-tip">
            当前审批单同时满足以下条件时进入此流程
            <span class="link">我知道了</span>
          </div>
          <label class="field">
            <span>发起人</span>
            <input type="text" placeholder="请选择具体人员/角色/部门" />
          </label>
          <div class="condition-actions">
            <button class="btn btn-ghost" type="button">+ 添加条件</button>
            <span class="muted">还有0个可用条件</span>
          </div>
          <button class="btn btn-primary" type="button">+ 添加条件组</button>
          <div class="condition-links">
            <span>如何添加更多条件</span>
          </div>
          <div class="condition-footer">
            <button class="btn btn-ghost" type="button">取消</button>
            <button class="btn btn-primary" type="button">保存</button>
          </div>
        </aside>
      </div>

      <div class="flow-footer">
        <button type="button" :disabled="!isFlowValid" @click="goNextStep">下一步：高级设置</button>
      </div>
    </div>

    <!-- ④高级设置 -->
    <div v-else class="advanced-screen">
      <aside class="advanced-menu">
        <div class="menu-item active"><span class="gear-icon"></span>高级流程设置</div>
      </aside>
      <section class="advanced-panel">
        <h3>发起人设置</h3>
        <div class="advanced-table">
          <div class="adv-row tall">
            <div class="adv-label">撤销设置</div>
            <div class="adv-content">
              <label class="check-line disabled"><input type="checkbox" />允许发起人撤销 <select disabled><option>30</option></select> 天内已通过的审批单</label>
              <label class="check-line"><input type="checkbox" checked />允许提交人撤销审批中的审批单（最多180天）</label>
              <label class="check-line light"><input type="checkbox" checked />允许评论提交人撤销 <select><option>2</option></select> 分钟内的审批评论 <input type="checkbox" /> 允许撤销所有时间提交的评论</label>
            </div>
          </div>
          <div class="adv-row">
            <div class="adv-label">修改设置</div>
            <div class="adv-content">
              <label class="check-line disabled"><input type="checkbox" />允许修改 <select disabled><option>30</option></select> 天内提交并通过的审批，最多只允许修改 <select disabled><option>1</option></select> 次</label>
            </div>
          </div>
          <div class="adv-row">
            <div class="adv-label">提交后选审批人<span>?</span></div>
            <div class="adv-content"><label class="check-line"><input type="checkbox" checked />允许发起人先提交审批单，提交后再指定审批人</label></div>
          </div>
          <div class="adv-row">
            <div class="adv-label">发送到聊天<span>?</span></div>
            <div class="adv-content"><label class="check-line"><input type="checkbox" checked />允许发起人将审批单发送到群聊/私聊</label></div>
          </div>
          <div class="adv-row">
            <div class="adv-label">多部门选项<span>?</span></div>
            <div class="adv-content">
              当发起人属于多个部门时，「所在部门」的默认值为
              <select><option>手动选择</option></select>
              <small>手动选择：「所在部门」字段默认为空</small>
            </div>
          </div>
          <div class="adv-row">
            <div class="adv-label">代他人提交<span>?</span></div>
            <div class="adv-content"><label class="check-line"><input type="checkbox" />允许代他人提交</label></div>
          </div>
        </div>

        <h3>审批人设置</h3>
        <div class="advanced-table approver">
          <div class="adv-row">
            <div class="adv-label">审批人去重</div>
            <div class="adv-content">
              <label class="check-line"><input type="checkbox" />同一审批人在流程中多次出现时，自动去重 <select><option></option></select></label>
              <label class="check-line"><input type="checkbox" />审批人和发起人是同一个人，审批自动通过</label>
            </div>
          </div>
          <div class="adv-row tall">
            <div class="adv-label">审批意见<span>?</span></div>
            <div class="adv-content radio-stack">
              <strong>审批意见填写</strong>
              <label><input type="radio" name="opinion" />必须填写意见，才可以提交审批 <input class="inline-input" placeholder="审批意见填写提示" /><em>0 / 200</em></label>
              <label><input type="radio" name="opinion" />无需填写意见，不显示审批意见页面</label>
              <label><input type="radio" name="opinion" checked />无需填写意见，显示审批意见页面（待办和审批中心可以直接审批，不需要弹出审批意见页面）</label>
              <strong>审批意见可见</strong>
              <label><input type="checkbox" />评论仅管理员和审批人可见</label>
            </div>
          </div>
          <div class="adv-row">
            <div class="adv-label">允许加签<span>?</span></div>
            <div class="adv-content"><label class="check-line"><input type="checkbox" checked />审批过程中，新增临时审批人</label></div>
          </div>
          <div class="adv-row">
            <div class="adv-label">手写签名<span>?</span></div>
            <div class="adv-content"><label class="check-line"><input type="checkbox" />审批人必须添加手写签名，才可以同意审批 <select><option></option></select></label></div>
          </div>
          <div class="adv-row tall">
            <div class="adv-label">消息通知设置</div>
            <div class="adv-content check-list">
              <strong>当审批单被拒绝时，通知以下节点人员：</strong>
              <label><input type="checkbox" checked />拒绝节点前的所有人</label>
              <label><input type="checkbox" checked />或签节点的其他或签审批人</label>
              <label><input type="checkbox" checked />会签节点的其他会签审批人</label>
              <strong>当审批节点被同意时，通知以下节点人员：</strong>
              <label><input type="checkbox" checked />或签节点的其他或签审批人</label>
            </div>
          </div>
          <div class="adv-row">
            <div class="adv-label">退回审批<span>?</span></div>
            <div class="adv-content">退回后再次提交 <select><option>重新开始审批</option></select></div>
          </div>
          <div class="adv-row">
            <div class="adv-label">限时审批<span>?</span></div>
            <div class="adv-content"><label class="check-line"><input type="checkbox" />限时审批</label></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.oa-builder {
  min-height: 100vh;
  background: #f2f3f6;
  color: #1f2933;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  overflow: hidden;
}

.workflow-topbar {
  height: 72px;
  background: #fff;
  border-bottom: 1px solid #e7e9ee;
  display: grid;
  grid-template-columns: 118px 260px 1fr 260px;
  align-items: center;
  padding: 0 22px 0 18px;
  box-shadow: 0 1px 4px rgba(25, 35, 55, 0.06);
}

.builder-titlebar {
  display: flex;
  align-items: center;
  gap: 18px;
}

.builder-back {
  width: 22px;
  height: 22px;
  position: relative;
}

.builder-back::before {
  content: "";
  width: 10px;
  height: 10px;
  border-left: 2px solid #333;
  border-bottom: 2px solid #333;
  position: absolute;
  top: 5px;
  left: 7px;
  transform: rotate(45deg);
}

.approval-logo {
  width: 34px;
  height: 34px;
  border-radius: 7px;
  background: #ffe4aa;
  display: inline-grid;
  place-items: center;
  position: relative;
}

.approval-logo.big {
  width: 56px;
  height: 56px;
  border-radius: 7px;
}

.approval-logo i {
  width: 21px;
  height: 23px;
  border-radius: 3px;
  background: #ff9700;
  display: block;
  position: relative;
  box-shadow: 5px 4px 0 rgba(128, 84, 10, 0.25);
}

.approval-logo i::before,
.approval-logo i::after {
  content: "";
  position: absolute;
  left: 5px;
  right: 5px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
}

.approval-logo i::before { top: 7px; box-shadow: 0 5px 0 #fff; }
.approval-logo i::after { top: 17px; }

.topbar-title .title {
  font-size: 17px;
  font-weight: 700;
  line-height: 22px;
}

.draft-line {
  color: #808894;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.draft-line span {
  width: 8px;
  height: 8px;
  border-right: 1px solid #89919d;
  border-bottom: 1px solid #89919d;
  transform: rotate(45deg) translateY(-3px);
}

.topbar-steps {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 42px;
}

.topbar-step {
  height: 100%;
  color: #303741;
  font-size: 17px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.topbar-step.active {
  color: #1683ff;
}

.topbar-step.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: #1683ff;
}

.step-index {
  width: 22px;
  height: 22px;
  border: 2px solid currentColor;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  font-size: 14px;
  line-height: 1;
}

.topbar-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}

.help-link {
  color: #6f7782;
  font-size: 14px;
}

.help-link span {
  display: inline-grid;
  place-items: center;
  width: 14px;
  height: 14px;
  border: 1px solid #9aa2ad;
  border-radius: 50%;
  font-size: 10px;
  margin-right: 4px;
}

.preview-btn,
.publish-btn {
  height: 36px;
  padding: 0 21px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

.preview-btn {
  border: 1px solid #dde2eb;
  background: #fff;
  color: #2f3742;
}

.publish-btn {
  background: #1683ff;
  color: #fff;
  box-shadow: 0 2px 5px rgba(22, 131, 255, 0.25);
}

.basic-screen {
  min-height: calc(100vh - 72px);
  display: flex;
  justify-content: center;
  padding: 14px 0;
}

.basic-card {
  width: 690px;
  background: #fff;
  border-radius: 7px;
  padding: 30px 24px 28px;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 16px;
}

.basic-icon-wrap {
  position: relative;
  padding-top: 0;
}

.edit-logo {
  width: 18px;
  height: 18px;
  position: absolute;
  right: -2px;
  bottom: -2px;
  border-radius: 2px;
  background: #555;
}

.edit-logo::before {
  content: "";
  position: absolute;
  width: 9px;
  height: 2px;
  background: #fff;
  top: 8px;
  left: 5px;
  transform: rotate(-35deg);
}

.basic-fields {
  display: flex;
  flex-direction: column;
  gap: 19px;
}

.field {
  display: grid;
  gap: 8px;
  position: relative;
  color: #343b46;
  font-size: 14px;
  font-weight: 600;
}

.field.required > span::before,
.label.required::before {
  content: "*";
  color: #f34d43;
  margin-right: 4px;
}

.field input:not([type="radio"]):not([type="checkbox"]),
.field select,
.field textarea {
  height: 32px;
  border: 1px solid #dfe4ec;
  border-radius: 3px;
  background: #fff;
  padding: 0 12px;
  font-size: 14px;
  color: #323b48;
  box-shadow: none;
}

.field textarea {
  height: 78px;
  padding-top: 10px;
}

.field em {
  position: absolute;
  right: 10px;
  bottom: 7px;
  color: #8b929c;
  font-style: normal;
  font-weight: 400;
}

.radio-row {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 14px;
}

.radio-row .label {
  width: 88px;
  font-weight: 600;
}

input[type="radio"],
input[type="checkbox"] {
  accent-color: #1683ff;
}

.form-designer-screen {
  height: calc(100vh - 72px);
  display: grid;
  grid-template-columns: 306px 1fr 304px;
  background: #f2f3f6;
}

.form-toolbox,
.form-settings {
  background: #fff;
  border-right: 1px solid #e6e9ef;
  overflow: auto;
}

.form-settings {
  border-right: 0;
  border-left: 1px solid #e6e9ef;
}

.toolbox-title,
.settings-title {
  height: 45px;
  border-bottom: 1px solid #e7e9ee;
  display: flex;
  align-items: center;
  padding: 0 18px;
  font-size: 14px;
  font-weight: 700;
}

.toolbox-body {
  padding: 16px 10px;
}

.tool-group + .tool-group {
  margin-top: 20px;
}

.tool-title {
  height: 22px;
  color: #343b46;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.tool-title span {
  width: 8px;
  height: 8px;
  border-right: 1px solid #8f98a4;
  border-bottom: 1px solid #8f98a4;
  transform: rotate(225deg);
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 8px;
  margin-top: 8px;
}

.tool-tile {
  height: 40px;
  border: 1px solid #e2e6ed;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  cursor: pointer;
  position: relative;
  background: #fff;
}

.tool-tile:hover {
  border-color: #1683ff;
}

.tool-label {
  font-size: 13px;
  color: #2f3742;
}

.tool-tile em {
  position: absolute;
  right: 5px;
  top: -6px;
  color: #f5a33b;
  border: 1px solid #ffd197;
  background: #fff9f0;
  font-size: 10px;
  font-style: normal;
  border-radius: 2px;
  padding: 0 3px;
}

.draw-icon {
  width: 18px;
  height: 18px;
  display: inline-grid;
  place-items: center;
  color: #2f3a47;
  font-size: 11px;
  font-weight: 700;
  position: relative;
  flex: 0 0 auto;
}

.draw-icon.lines::before,
.draw-icon.lines::after {
  content: "";
  width: 14px;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
  box-shadow: 0 5px 0 currentColor;
}

.draw-icon.lines::after {
  position: absolute;
  width: 9px;
  left: 2px;
  bottom: 3px;
  box-shadow: none;
}

.draw-icon.radio::before,
.draw-icon.check::before {
  content: "";
  width: 13px;
  height: 13px;
  border: 2px solid currentColor;
  border-radius: 50%;
}

.draw-icon.radio::after {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  position: absolute;
}

.draw-icon.check::before {
  border-radius: 50%;
}

.draw-icon.check::after {
  content: "";
  width: 7px;
  height: 4px;
  border-left: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(-45deg);
  position: absolute;
  top: 6px;
}

.draw-icon.calendar::before {
  content: "";
  width: 14px;
  height: 13px;
  border: 2px solid currentColor;
  border-radius: 2px;
}

.draw-icon.calendar::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 2px;
  background: currentColor;
  top: 6px;
}

.draw-icon.phone::before {
  content: "";
  width: 9px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 2px;
}

.draw-icon.image::before {
  content: "";
  width: 15px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 2px;
}

.draw-icon.image::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border-left: 2px solid currentColor;
  border-top: 2px solid currentColor;
  transform: rotate(45deg);
  bottom: 2px;
}

.draw-icon.table::before,
.draw-icon.idcard::before {
  content: "";
  width: 15px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 2px;
}

.draw-icon.table::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 12px;
  background: currentColor;
  box-shadow: 5px 0 0 currentColor, -5px 0 0 currentColor;
}

.draw-icon.money::before {
  content: "￥";
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 50%;
  font-size: 10px;
  display: grid;
  place-items: center;
}

.draw-icon.clip::before {
  content: "";
  width: 8px;
  height: 14px;
  border: 2px solid currentColor;
  border-left-color: transparent;
  border-radius: 8px;
  transform: rotate(45deg);
}

.draw-icon.user::before,
.draw-icon.org::before {
  content: "";
  width: 8px;
  height: 8px;
  border: 2px solid currentColor;
  border-radius: 50%;
  box-shadow: 0 9px 0 -1px currentColor;
}

.draw-icon.pen::before {
  content: "";
  width: 15px;
  height: 3px;
  background: currentColor;
  transform: rotate(-40deg);
  border-radius: 2px;
}

.draw-icon.pin::before {
  content: "";
  width: 12px;
  height: 12px;
  border: 2px solid currentColor;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
}

.draw-icon.star::before {
  content: "☆";
  font-size: 18px;
  line-height: 1;
}

.draw-icon.info::before {
  content: "i";
  width: 15px;
  height: 15px;
  border: 2px solid currentColor;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-style: normal;
}

.draw-icon.ai::before,
.draw-icon.formula::before,
.draw-icon.link::before,
.draw-icon.chain::before,
.draw-icon.map::before {
  content: attr(class);
  font-size: 0;
}

.draw-icon.ai::after { content: "AI"; font-size: 10px; }
.draw-icon.formula::after { content: "+×"; font-size: 13px; }
.draw-icon.link::after,
.draw-icon.chain::after { content: "∞"; font-size: 17px; }
.draw-icon.map::after { content: "⌖"; font-size: 15px; }

.form-preview {
  min-width: 640px;
  display: flex;
  flex-direction: column;
}

.preview-toolbar {
  height: 40px;
  background: #fff;
  border-bottom: 1px solid #e7e9ee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
}

.toolbar-tabs,
.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #f4f6f8;
  display: grid;
  place-items: center;
}

.pc-icon,
.phone-icon {
  width: 14px;
  height: 10px;
  border: 2px solid #354051;
  border-radius: 2px;
  display: block;
}

.phone-icon {
  width: 9px;
  height: 15px;
}

.toolbar-icon {
  width: 22px;
  height: 22px;
  position: relative;
}

.toolbar-icon::before {
  content: "";
  width: 10px;
  height: 10px;
  border-top: 2px solid #8a94a2;
  border-left: 2px solid #8a94a2;
  position: absolute;
  top: 5px;
}

.toolbar-icon.undo::before {
  transform: rotate(-45deg);
  left: 7px;
}

.toolbar-icon.redo::before {
  transform: rotate(135deg);
  left: 4px;
}

.advanced-function {
  height: 28px;
  padding: 0 12px;
  border-radius: 7px;
  background: #f0f2f5;
  color: #495260;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.advanced-function span {
  width: 8px;
  height: 8px;
  border-right: 1px solid #7a8491;
  border-bottom: 1px solid #7a8491;
  transform: rotate(45deg) translateY(-2px);
}

.preview-body {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 32px;
}

.phone-frame {
  width: 362px;
  height: 640px;
  background: #fff;
  border: 10px solid #fff;
  border-radius: 28px;
  box-shadow: 0 0 0 1px #e8eaef, 0 14px 35px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  position: relative;
}

.phone-notch {
  height: 10px;
  background: #eef0f3;
}

.phone-body {
  height: 100%;
  background: #f4f5f7;
  overflow: hidden;
  padding-top: 0;
}

.phone-field,
.invoice-block {
  background: #fff;
  padding: 16px 18px;
  min-height: 74px;
  border-bottom: 1px solid #eef1f5;
  position: relative;
}

.phone-field.compact {
  min-height: 88px;
}

.field-title {
  font-size: 17px;
  font-weight: 700;
  color: #242c36;
  margin-bottom: 8px;
}

.field-input {
  color: #a4abb5;
  font-size: 16px;
  font-weight: 400;
}

.phone-drop {
  height: 102px;
  border: 1px dashed #c9d0d8;
  background: linear-gradient(#fff 0 50%, #dff6fb 50% 100%);
  color: #b9c0c9;
  display: flex;
  flex-direction: column;
}

.phone-drop span {
  padding: 18px 18px 8px;
  font-size: 15px;
  color: #a2aab5;
}

.phone-drop strong {
  flex: 1;
  display: grid;
  place-items: center;
  color: #c8d7da;
  font-weight: 700;
}

.invoice-block {
  height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.invoice-block span {
  font-size: 18px;
  font-weight: 700;
}

.invoice-block button {
  width: 20px;
  height: 20px;
  border: 2px solid #a5adb7;
  border-radius: 50%;
  position: relative;
}

.invoice-block button::before,
.invoice-block button::after {
  content: "";
  position: absolute;
  background: #a5adb7;
  left: 4px;
  right: 4px;
  top: 8px;
  height: 2px;
}

.invoice-block button::after {
  transform: rotate(90deg);
}

.phone-field.active {
  border-left: 3px solid #1683ff;
}

.field-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-actions {
  position: absolute;
  right: 14px;
  top: 10px;
  display: flex;
  gap: 11px;
  background: #f5f6f8;
  border-radius: 12px;
  padding: 4px 8px;
}

.copy-field,
.trash-field {
  width: 14px;
  height: 14px;
  position: relative;
}

.copy-field::before,
.copy-field::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1.5px solid #5c6571;
  border-radius: 2px;
}

.copy-field::before { left: 1px; top: 4px; }
.copy-field::after { left: 5px; top: 1px; background: #f5f6f8; }

.trash-field::before {
  content: "";
  width: 10px;
  height: 9px;
  border: 1.5px solid #5c6571;
  border-top: 0;
  position: absolute;
  left: 2px;
  top: 5px;
}

.trash-field::after {
  content: "";
  width: 12px;
  height: 2px;
  background: #5c6571;
  position: absolute;
  left: 1px;
  top: 2px;
}

.phone-chevron {
  width: 9px;
  height: 9px;
  border-right: 2px solid #b0b7c1;
  border-bottom: 2px solid #b0b7c1;
  transform: rotate(-45deg);
}

.settings-body {
  padding: 15px 14px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-title {
  gap: 8px;
}

.count-field em {
  bottom: 7px;
}

.toggle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #424b57;
}

.toggle-row small {
  color: #a1a8b2;
  font-size: 12px;
  margin-left: 4px;
}

.switch input {
  display: none;
}

.switch span {
  width: 43px;
  height: 24px;
  border-radius: 99px;
  background: #c5c8cc;
  display: block;
  position: relative;
  transition: 0.2s;
}

.switch span::before {
  content: "";
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  left: 2px;
  top: 2px;
  transition: 0.2s;
}

.switch input:checked + span {
  background: #1683ff;
}

.switch input:checked + span::before {
  transform: translateX(19px);
}

.flow-page {
  height: calc(100vh - 72px);
  display: flex;
  flex-direction: column;
}

.flow-topbar {
  height: 41px;
  background: #fff;
  border-bottom: 1px solid #e7e9ee;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.flow-version {
  font-size: 14px;
  font-weight: 600;
  color: #2f3742;
}

.design-tag {
  color: #fa9b22;
  background: #fff4e3;
  border: 1px solid #ffd69a;
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 3px;
  font-size: 12px;
}

.flow-actions {
  margin-left: auto;
  margin-right: 130px;
}

.zoom-control {
  position: absolute;
  right: 20px;
  top: 54px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #3d4652;
}

.zoom-control button {
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 2px 8px rgba(20, 30, 45, 0.1);
  color: #a0a8b3;
  font-size: 22px;
}

.flow-canvas {
  flex: 1;
  position: relative;
  background: #f1f2f5;
  overflow: auto;
}

.flow-stage {
  min-height: 100%;
  padding: 56px 0 72px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
}

.flow-node-card {
  width: 220px;
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 8px rgba(21, 34, 54, 0.12);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.flow-node-card .node-title {
  height: 26px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  background: #ff9f3f;
  font-size: 13px;
  font-weight: 700;
}

.flow-node-card.start .node-title {
  background: #556f9d;
}

.flow-node-card.cc .node-title {
  background: #208df5;
}

.flow-node-card.handler .node-title {
  background: #ff6a64;
}

.node-mini {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  vertical-align: -3px;
  position: relative;
}

.node-mini::before {
  content: "";
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid currentColor;
  color: #fff;
  left: 4px;
  top: 1px;
  transform: translateX(-50%);
}

.node-mini::after {
  content: "";
  position: absolute;
  width: 11px;
  height: 6px;
  border: 2px solid currentColor;
  border-top: 0;
  border-radius: 0 0 10px 10px;
  color: #fff;
  left: 2px;
  bottom: 1px;
}

.node-mini.cc::before {
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-radius: 2px;
  background: transparent;
  clip-path: polygon(1px 6px, 15px 1px, 9px 15px, 6px 9px);
  left: 1px;
  top: 1px;
  transform: none;
}

.node-mini.cc::after {
  display: none;
}

.flow-node-card .node-body {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 16px;
  font-size: 15px;
  font-weight: 600;
  color: #2d3540;
}

.node-arrow {
  color: #a5adb7;
  font-size: 28px;
  font-weight: 300;
}

.node-remove {
  color: #fff;
  font-size: 14px;
}

.flow-connector {
  width: 30px;
  height: 30px;
  background: #fff;
  color: #1683ff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 28px;
  line-height: 28px;
  box-shadow: 0 2px 8px rgba(24, 35, 50, 0.12);
  margin: 35px 0;
  position: relative;
  z-index: 2;
}

.flow-connector::before,
.flow-connector::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 2px;
  height: 35px;
  background: #d7dbe1;
  transform: translateX(-50%);
  z-index: -1;
}

.flow-connector::before { bottom: 100%; }
.flow-connector::after { top: 100%; }

.flow-end {
  padding: 10px 20px;
  color: #a8afb8;
  background: #eceef2;
  border-radius: 20px;
  position: relative;
}

.flow-end::before {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d4d8de;
  left: 50%;
  top: -30px;
  transform: translateX(-50%);
}

.flow-menu {
  width: 370px;
  background: #fff;
  border: 1px solid #dfe3ea;
  border-radius: 7px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.1);
  padding: 16px 20px 18px;
  position: absolute;
  z-index: 10;
}

.flow-menu-connector {
  position: absolute;
  height: 1px;
  background: #d9dde4;
  z-index: 9;
}

.flow-menu-group + .flow-menu-group {
  margin-top: 14px;
}

.flow-menu-title {
  color: #c1c6ce;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 9px;
}

.flow-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 10px;
}

.flow-menu-item {
  height: 48px;
  background: #fbfcfe;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 17px;
  font-size: 15px;
  font-weight: 600;
  color: #2f3742;
}

.menu-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  position: relative;
  color: #fff;
  overflow: hidden;
}

.menu-icon.orange { background: #ff9f3f; }
.menu-icon.blue { background: #4fa3ff; }
.menu-icon.red { background: #ff6a64; }
.menu-icon.green { background: #46cc97; }
.menu-icon.cyan { background: #22b8c6; }
.menu-icon.pink { background: #ea65bb; }
.menu-icon.indigo { background: #4666ff; }
.menu-icon.purple { background: #b35af1; }

.menu-icon.person::before {
  content: "";
  width: 11px;
  height: 11px;
  border: 3px solid currentColor;
  border-radius: 50%;
  transform: translateY(-5px);
}

.menu-icon.person::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 10px;
  border: 3px solid currentColor;
  border-top: 0;
  border-radius: 0 0 16px 16px;
  bottom: 4px;
}

.menu-icon.send::before {
  content: "";
  width: 17px;
  height: 17px;
  border: 3px solid currentColor;
  border-left: 0;
  border-bottom: 0;
  transform: rotate(25deg) skew(-18deg, -18deg);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 43% 58%, 0 100%);
}

.menu-icon.send::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 3px;
  background: currentColor;
  transform: rotate(-35deg);
  left: 10px;
  top: 17px;
}

.menu-icon.doc::before {
  content: "";
  width: 15px;
  height: 18px;
  border: 3px solid currentColor;
  border-radius: 3px;
}

.menu-icon.doc::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border-top: 3px solid currentColor;
  border-right: 3px solid currentColor;
  right: 8px;
  top: 8px;
}

.menu-icon.branch::before {
  content: "";
  width: 18px;
  height: 18px;
  background:
    radial-gradient(circle, currentColor 0 3px, transparent 3.5px) 50% 0 / 18px 18px no-repeat,
    radial-gradient(circle, currentColor 0 3px, transparent 3.5px) 0 100% / 18px 18px no-repeat,
    radial-gradient(circle, currentColor 0 3px, transparent 3.5px) 100% 100% / 18px 18px no-repeat,
    linear-gradient(currentColor, currentColor) 50% 5px / 2.5px 9px no-repeat,
    linear-gradient(currentColor, currentColor) 50% 12px / 16px 2.5px no-repeat;
}

.menu-icon.parallel::before {
  content: "";
  width: 19px;
  height: 20px;
  background:
    linear-gradient(currentColor, currentColor) 3px 1px / 3px 18px no-repeat,
    linear-gradient(currentColor, currentColor) 8px 1px / 3px 18px no-repeat,
    linear-gradient(currentColor, currentColor) 13px 1px / 3px 18px no-repeat;
}

.menu-icon.parallel::after {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22b8c6;
  border: 3px solid currentColor;
  left: 5px;
  top: 6px;
  box-shadow: 8px 8px 0 -3px #22b8c6, 8px 8px 0 0 currentColor;
}

.menu-icon.ai::before {
  content: "AI";
  width: 20px;
  height: 20px;
  border: 3px solid currentColor;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  font-size: 10px;
  display: grid;
  place-items: center;
}

.menu-icon.ai::after {
  content: "";
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  right: 7px;
  top: 7px;
}

.menu-icon.connector::before {
  content: "";
  width: 18px;
  height: 10px;
  border: 3px solid currentColor;
  border-left-color: transparent;
  border-right-color: transparent;
  border-radius: 10px;
  transform: rotate(0deg);
}

.menu-icon.connector::after {
  content: "";
  position: absolute;
  width: 8px;
  height: 3px;
  background: currentColor;
  left: 12px;
  top: 15px;
}

.menu-icon.pay::before {
  content: "";
  width: 16px;
  height: 18px;
  border: 3px solid currentColor;
  border-radius: 3px;
}

.menu-icon.pay::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 3px;
  background: currentColor;
  top: 12px;
  box-shadow: 0 5px 0 currentColor;
}

.flow-footer {
  display: none;
}

.condition-panel {
  position: absolute;
  right: 24px;
  top: 24px;
  width: 360px;
  background: #fff;
  border: 1px solid #e1e5ec;
  border-radius: 8px;
  box-shadow: 0 8px 28px rgba(17, 24, 39, 0.12);
  padding: 16px;
  z-index: 20;
}

.condition-panel-header,
.condition-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.condition-panel .btn {
  border: 1px solid #dfe4ec;
  border-radius: 4px;
  padding: 7px 12px;
}

.condition-panel .btn-primary {
  background: #1683ff;
  color: #fff;
}

.config-section {
  margin: 15px 0;
}

.config-section-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.config-options {
  display: grid;
  gap: 8px;
}

.config-option {
  border: 1px solid #e1e5ec;
  border-radius: 5px;
  padding: 9px;
}

.config-option.active {
  border-color: #1683ff;
  background: #f0f7ff;
}

.advanced-screen {
  height: calc(100vh - 72px);
  display: grid;
  grid-template-columns: 180px minmax(720px, 926px) 1fr;
  justify-content: center;
  padding-top: 16px;
  background: #f2f3f6;
  overflow: auto;
}

.advanced-menu {
  background: #fff;
  border-right: 1px solid #e8ebf0;
  padding: 16px 12px;
}

.menu-item {
  height: 38px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-radius: 4px;
  font-weight: 700;
  color: #3a4350;
}

.menu-item.active {
  background: #dfe3e8;
}

.gear-icon {
  width: 14px;
  height: 14px;
  border: 2px solid #3a4350;
  border-radius: 50%;
  position: relative;
}

.gear-icon::before {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #3a4350;
  left: 3px;
  top: 3px;
}

.advanced-panel {
  background: #fff;
  padding: 16px 20px 40px;
}

.advanced-panel h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.advanced-panel h3 + .advanced-table {
  margin-bottom: 22px;
}

.advanced-table {
  border: 1px solid #e6e9ef;
  border-bottom: 0;
}

.adv-row {
  min-height: 48px;
  display: grid;
  grid-template-columns: 180px 1fr;
  border-bottom: 1px solid #e6e9ef;
}

.adv-row.tall {
  min-height: 92px;
}

.adv-label {
  background: #f7f8fb;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-weight: 700;
}

.adv-label span {
  width: 14px;
  height: 14px;
  border: 1px solid #a8b0bb;
  border-radius: 50%;
  display: inline-grid;
  place-items: center;
  color: #8f98a4;
  font-size: 10px;
  margin-left: 4px;
}

.adv-content {
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
}

.adv-content select,
.inline-input {
  width: auto;
  min-width: 70px;
  height: 30px;
  border: 1px solid #dfe4ec;
  border-radius: 4px;
  padding: 0 10px;
  margin: 0 6px;
  background: #fff;
}

.adv-content small {
  color: #a6adb7;
  display: block;
}

.check-line,
.radio-stack label,
.check-list label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #27313d;
}

.check-line.disabled {
  color: #a8b0bb;
}

.check-line.light {
  color: #68717d;
}

.radio-stack,
.check-list {
  align-items: flex-start;
}

.radio-stack strong,
.check-list strong {
  margin-top: 4px;
}

.radio-stack em {
  color: #8f98a4;
  font-style: normal;
  margin-left: auto;
}

@media (max-width: 1180px) {
  .workflow-topbar {
    grid-template-columns: 100px 210px 1fr 210px;
  }

  .topbar-steps {
    gap: 18px;
  }

  .form-designer-screen {
    grid-template-columns: 260px 1fr 280px;
  }
}
</style>
