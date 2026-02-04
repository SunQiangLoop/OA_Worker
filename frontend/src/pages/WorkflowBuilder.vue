<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const steps = [
  { key: 'basic', label: '基础设置' },
  { key: 'form', label: '表单设计' },
  { key: 'flow', label: '流程设计' },
  { key: 'advanced', label: '高级设置' },
]

const activeStep = ref('basic')
const stepCompleted = reactive({
  basic: false,
  form: false,
  flow: false,
  advanced: false,
})

const basicForm = reactive({
  name: '费用报销',
  desc: '差旅费、团建费等各类报销',
  category: '财务',
  submitterScope: '全员',
  showOnDashboard: true,
  admin: 'importnew',
})

const formDesigned = ref(false)
const flowDesigned = ref(false)

const canEnterStep = () => true

const canPublish = computed(() => {
  return stepCompleted.basic && stepCompleted.form && stepCompleted.flow && stepCompleted.advanced
})

function goToStep(key) {
  activeStep.value = key
}

function completeBasic() {
  stepCompleted.basic = isBasicValid.value
}

function completeForm() {
  stepCompleted.form = isFormValid.value
}

function completeFlow() {
  stepCompleted.flow = isFlowValid.value
}

function completeAdvanced() {
  stepCompleted.advanced = isAdvancedValid.value
}

function publishFlow() {
  completeBasic()
  completeForm()
  completeFlow()
  completeAdvanced()
  if (!canPublish.value) {
    const missing = []
    if (!stepCompleted.basic) missing.push('基础设置')
    if (!stepCompleted.form) missing.push('表单设计')
    if (!stepCompleted.flow) missing.push('流程设计')
    if (!stepCompleted.advanced) missing.push('高级设置')
    alert(`还有未完成项：${missing.join('、')}`)
    return
  }
  const raw = localStorage.getItem('oa_workflow_templates')
  const list = raw ? JSON.parse(raw) : []
  const payload = {
    id: Date.now(),
    name: basicForm.name,
    category: basicForm.category,
    desc: basicForm.desc,
    icon: '¥',
    color: '#22c55e',
  }
  list.unshift(payload)
  localStorage.setItem('oa_workflow_templates', JSON.stringify(list))
  router.push('/approvals/apply')
}

const guideCards = [
  {
    title: '创建审批流程',
    desc: '快速创建一个简单的审批流程',
  },
  {
    title: '设置分支条件',
    desc: '不同条件适用不同审批路线',
  },
  {
    title: '设置多人审批',
    desc: '可设置会签、或签模式',
  },
  {
    title: '审批人去重',
    desc: '同一审批人多次出现可自动去重',
  },
]

const toolBlocks = [
  {
    title: '角色组件',
    items: ['审批人', '抄送人', '办理人', '条件分支'],
  },
  {
    title: '流程操作',
    items: ['条件判断', '并行分支', '结束节点'],
  },
  {
    title: '常用模板',
    items: ['费用报销', '请假申请', '采购审批'],
  },
]

const formGroups = [
  { title: '文本', items: ['单行文本', '多行文本', '说明'] },
  { title: '数值', items: ['数字', '金额', '计算公式'] },
  { title: '选项', items: ['单选', '多选'] },
  { title: '日期', items: ['日期', '日期区间'] },
  { title: '其他', items: ['明细/表格', '图片', '附件', '部门', '联系人'] },
]


const approverOptions = [
  { label: '上级', value: 'leader' },
  { label: '用户组', value: 'group' },
  { label: '提交人本人', value: 'self' },
  { label: '指定成员', value: 'member' },
]

const formFields = ref([])
const selectedFieldId = ref('')

const fieldMetaByType = {
  单行文本: { label: '单行文本', placeholder: '请输入内容', unit: '', min: '' },
  多行文本: { label: '多行文本', placeholder: '请输入内容', unit: '', min: '' },
  说明: { label: '说明', placeholder: '请输入内容', unit: '', min: '' },
  数字: { label: '数字', placeholder: '请输入', unit: '', min: '0' },
  金额: { label: '金额', placeholder: '0.00', unit: '元', min: '0' },
  计算公式: { label: '计算公式', placeholder: '输入公式', unit: '', min: '' },
  单选: { label: '单选', placeholder: '请选择', unit: '', min: '' },
  多选: { label: '多选', placeholder: '请选择', unit: '', min: '' },
  日期: { label: '日期', placeholder: '请选择日期', unit: '', min: '' },
  日期区间: { label: '日期区间', placeholder: '请选择日期', unit: '', min: '' },
  '明细/表格': { label: '明细', placeholder: '添加明细', unit: '', min: '' },
  图片: { label: '图片', placeholder: '上传图片', unit: '', min: '' },
  附件: { label: '附件', placeholder: '上传文件', unit: '', min: '' },
  部门: { label: '部门', placeholder: '请选择部门', unit: '', min: '' },
  联系人: { label: '联系人', placeholder: '请选择联系人', unit: '', min: '' },
}

function createField(type) {
  const meta = fieldMetaByType[type] || { label: type, placeholder: '请输入', unit: '', min: '' }
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    label: meta.label,
    placeholder: meta.placeholder,
    unit: meta.unit,
    min: meta.min,
  }
}

function addField(type) {
  const field = createField(type)
  formFields.value.push(field)
  selectedFieldId.value = field.id
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

const selectedField = computed(() => {
  return formFields.value.find((field) => field.id === selectedFieldId.value) || null
})

const isBasicValid = computed(() => {
  return Boolean(
    basicForm.name &&
      basicForm.category &&
      basicForm.submitterScope &&
      basicForm.admin
  )
})

const isFormValid = computed(() => formDesigned.value && formFields.value.length > 0)

const isFlowValid = computed(() => flowDesigned.value)

const isAdvancedValid = computed(() => true)

const flowStageRef = ref(null)
const menuOpen = ref(false)
const menuPos = ref({ top: 0, left: 0 })
const menuLine = ref({ top: 0, left: 0, width: 0 })
const insertTarget = ref({ scope: 'main', index: 0, conditionId: '', branchId: '' })

const flowNodes = ref([
  { id: 'approval-1', type: 'approval', title: '审批人', body: '发起人自选', removable: true },
  { id: 'cc-1', type: 'cc', title: '抄送人', body: '发起人自选', removable: true },
])

const flowMenuGroups = [
  {
    title: '主节点',
    items: [
      { label: '审批人', icon: '👤', type: 'approval' },
      { label: '抄送人', icon: '📣', type: 'cc' },
      { label: '办理人', icon: '🧭', type: 'handler' },
    ],
  },
  {
    title: '分支节点',
    items: [
      { label: '条件分支', icon: '🌿', type: 'condition' },
      { label: '并行分支', icon: '🔀', type: 'parallel' },
    ],
  },
  {
    title: '自动化',
    items: [
      { label: '自动化', icon: '⚙️', type: 'automation' },
      { label: '连接器', icon: '🔗', type: 'connector' },
    ],
  },
  {
    title: '套件',
    items: [
      { label: '付款人', icon: '💳', type: 'payer' },
    ],
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
    if (insertTarget.value.scope !== 'main') {
      return
    }
    const conditionNode = createConditionNode()
    flowNodes.value.splice(insertTarget.value.index, 0, conditionNode)
    selectedConditionId.value = conditionNode.id
    selectedBranchId.value = conditionNode.branches[0]?.id || ''
    closeFlowMenu()
    return
  }
  if (item.type === 'parallel') {
    return
  }
  const node = createSimpleNode(item.type, item.label)
  if (insertTarget.value.scope === 'branch') {
    const condition = flowNodes.value.find((n) => n.id === insertTarget.value.conditionId)
    const branch = condition?.branches?.find((b) => b.id === insertTarget.value.branchId)
    if (branch) {
      branch.nodes.splice(insertTarget.value.index, 0, node)
    }
  } else {
    flowNodes.value.splice(insertTarget.value.index, 0, node)
  }
  closeFlowMenu()
}

function removeFlowNode(id) {
  flowNodes.value = flowNodes.value.filter((node) => node.id !== id)
}

function removeBranchNode(conditionId, branchId, nodeId) {
  const condition = flowNodes.value.find((n) => n.id === conditionId)
  const branch = condition?.branches?.find((b) => b.id === branchId)
  if (!branch) return
  branch.nodes = branch.nodes.filter((n) => n.id !== nodeId)
}

function createSimpleNode(type, label) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    title: label,
    body: type === 'handler' ? '请选择办理人' : '发起人自选',
    removable: true,
  }
}

function createConditionNode() {
  const id = `condition-${Date.now()}`
  return {
    id,
    type: 'condition',
    title: '添加条件',
    branches: [
      {
        id: `${id}-a`,
        title: '条件1',
        hint: '请设置条件',
        nodes: [],
        removable: true,
      },
      {
        id: `${id}-default`,
        title: '默认条件',
        hint: '其他条件进入此流程',
        nodes: [],
        removable: false,
        isDefault: true,
      },
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

const selectedConditionId = ref('')
const selectedBranchId = ref('')

const selectedCondition = computed(() => {
  return flowNodes.value.find((node) => node.id === selectedConditionId.value && node.type === 'condition') || null
})

const selectedBranch = computed(() => {
  return selectedCondition.value?.branches?.find((b) => b.id === selectedBranchId.value) || null
})

function selectConditionBranch(conditionId, branchId) {
  selectedConditionId.value = conditionId
  selectedBranchId.value = branchId
}

function closeConditionPanel() {
  selectedConditionId.value = ''
  selectedBranchId.value = ''
}
</script>

<template>
  <div class="page workflow-builder workflow-v2">
    <div class="workflow-topbar">
      <button class="icon-btn" type="button" @click="router.push('/approvals')">‹</button>
      <div class="topbar-title">
        <div class="title">未命名审批</div>
        <div class="muted">将自动保存编辑的内容</div>
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
        <button class="btn btn-ghost" type="button">帮助</button>
        <button class="btn btn-ghost" type="button">预览</button>
        <button class="btn btn-primary" type="button" :disabled="!canPublish" @click="publishFlow">发布</button>
      </div>
    </div>

    <div v-if="activeStep === 'basic'" class="basic-grid">
      <section class="panel basic-card v2-basic">
        <div class="basic-avatar-block">
          <div class="avatar-circle">✦</div>
          <button class="btn btn-ghost" type="button">更换图标</button>
        </div>
        <div class="basic-fields">
          <label class="field required">
            <span>表单名称</span>
            <input v-model="basicForm.name" type="text" placeholder="请输入" />
            <em>0 / 50</em>
          </label>
          <label class="field required">
            <span>所在分组</span>
            <select v-model="basicForm.category">
              <option>财务</option>
              <option>行政</option>
              <option>人事</option>
            </select>
          </label>
          <label class="field">
            <span>表单说明</span>
            <textarea v-model="basicForm.desc" rows="4" placeholder="请输入"></textarea>
            <em>0 / 100</em>
          </label>
          <div class="radio-row">
            <span class="label required">谁可以发起</span>
            <label><input v-model="basicForm.submitterScope" type="radio" value="全员" /> 全部</label>
            <label><input v-model="basicForm.submitterScope" type="radio" value="指定成员" /> 指定成员</label>
          </div>
          <div class="radio-row">
            <span class="label required">表单管理员</span>
            <label><input type="radio" checked /> 全部「OA审批」管理员</label>
            <label><input type="radio" /> 指定「OA审批」管理员</label>
          </div>
        </div>
      </section>
    </div>

    <div v-else-if="activeStep === 'form'" class="form-grid">
      <section class="panel form-toolbox v2-toolbox">
        <div class="panel-header">
          <div class="panel-title">控件</div>
        </div>
        <div class="panel-body">
          <div v-for="group in formGroups" :key="group.title" class="tool-group">
            <div class="tool-title">{{ group.title }}</div>
            <div class="tool-items tool-grid">
              <div
                v-for="item in group.items"
                :key="item"
                class="tool-tile"
                draggable="true"
                @dragstart="onDragStart(item, $event)"
                @click="addField(item)"
              >
                <span class="tool-icon">Aa</span>
                <span class="tool-label">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="panel form-preview v2-preview">
        <div class="preview-toolbar">
          <div class="toolbar-tabs">
            <button class="chip active" type="button">表单</button>
            <button class="chip" type="button">手机</button>
          </div>
          <div class="toolbar-actions">
            <button class="btn btn-ghost" type="button">自定义打印模板</button>
            <button class="btn btn-ghost" type="button">高级功能</button>
          </div>
        </div>
        <div class="preview-body">
          <div class="phone-frame">
            <div class="phone-header">未命名审批</div>
            <div class="phone-body" @drop="onDrop" @dragover="onDragOver">
              <div class="phone-drop">点击或拖拽左侧控件至此处</div>
              <div v-if="formFields.length === 0" class="empty">暂无字段</div>
              <div
                v-for="field in formFields"
                :key="field.id"
                class="phone-field"
                :class="{ active: field.id === selectedFieldId }"
                @click="selectedFieldId = field.id"
              >
                <div class="field-title">{{ field.label }}</div>
                <div class="field-input">{{ field.placeholder }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="panel form-settings v2-settings">
        <div class="panel-header">
          <div class="panel-title">字段设置</div>
          <div class="muted">当前选中：{{ selectedField?.label || '未选择' }}</div>
        </div>
        <div class="panel-body">
          <div v-if="selectedField">
            <label class="field">
              <span>标题</span>
              <input v-model="selectedField.label" type="text" />
            </label>
            <label class="field">
              <span>提示文字</span>
              <input v-model="selectedField.placeholder" type="text" />
            </label>
            <label class="field">
              <span>默认值</span>
              <input type="text" placeholder="自定义" />
            </label>
            <div class="toggle-row">
              <span>必填</span>
              <label class="switch">
                <input type="checkbox" />
                <span></span>
              </label>
            </div>
            <div class="toggle-row">
              <span>扫码</span>
              <label class="switch">
                <input type="checkbox" />
                <span></span>
              </label>
            </div>
          </div>
          <div v-else class="empty">请选择字段进行配置</div>
        </div>
      </aside>
    </div>

    <div v-else-if="activeStep === 'flow'" class="flow-page">
      <div class="flow-topbar">
        <div class="flow-version">
          未发布版本
          <span class="tag tag--ghost">设计中</span>
        </div>
        <div class="flow-actions">
          <button class="btn btn-ghost" type="button">流程模板</button>
          <button class="btn btn-ghost" type="button">动态流程</button>
          <button class="btn btn-ghost" type="button">导出流程图</button>
          <button class="btn btn-ghost" type="button">限时审批</button>
        </div>
        <div class="zoom-control">
          <button class="btn btn-ghost" type="button">-</button>
          <span>100%</span>
          <button class="btn btn-ghost" type="button">+</button>
        </div>
      </div>

      <div class="flow-canvas">
        <div class="flow-stage" ref="flowStageRef" @click="closeFlowMenu">
          <div class="flow-node-card start">
            <div class="node-title">发起人</div>
            <div class="node-body">
              滁州云链物流数字技术有限公司
              <span class="node-arrow">›</span>
            </div>
          </div>
          <button
            class="flow-connector"
            type="button"
            @click="openFlowMenu($event, { scope: 'main', index: 0, conditionId: '', branchId: '' })"
          >
            +
          </button>
          <template v-for="(node, idx) in flowNodes" :key="node.id">
            <template v-if="node.type !== 'condition'">
              <div class="flow-node-card" :class="nodeTypeClass(node.type)">
                <div class="node-title">
                  <span>{{ node.title }}</span>
                  <button
                    v-if="node.removable"
                    class="node-remove"
                    type="button"
                    @click.stop="removeFlowNode(node.id)"
                  >
                    ×
                  </button>
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
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <div class="condition-card-body">{{ branch.hint }}</div>
                    </div>
                    <button
                      class="flow-connector branch"
                      type="button"
                      @click="
                        openFlowMenu($event, {
                          scope: 'branch',
                          index: branch.nodes.length,
                          conditionId: node.id,
                          branchId: branch.id,
                        })
                      "
                    >
                      +
                    </button>
                    <div v-if="branch.nodes.length" class="branch-nodes">
                      <div
                        v-for="child in branch.nodes"
                        :key="child.id"
                        class="flow-node-card"
                        :class="nodeTypeClass(child.type)"
                      >
                        <div class="node-title">
                          <span>{{ child.title }}</span>
                          <button
                            v-if="child.removable"
                            class="node-remove"
                            type="button"
                            @click.stop="removeBranchNode(node.id, branch.id, child.id)"
                          >
                            ×
                          </button>
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
            >
              +
            </button>
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
                  <span class="menu-icon">{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside v-if="selectedCondition" class="condition-panel">
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
    </div>

    <div v-else class="advanced-grid">
      <aside class="panel advanced-menu">
        <div class="menu-item active">权限管理</div>
        <div class="menu-item">表单AI能力配置</div>
        <div class="menu-item">数据标题/摘要</div>
        <div class="menu-item">填写提醒</div>
        <div class="menu-item">打印模板</div>
      </aside>
      <section class="panel advanced-panel">
        <div class="panel-header">
          <div class="panel-title">权限管理</div>
          <div class="muted">包括查看、编辑、导出、删除数据的权限</div>
        </div>
        <div class="panel-body">
          <div class="section-title">默认权限组</div>
          <label class="field">
            <span>权限成员</span>
            <input type="text" value="所有「OA审批」管理员" />
          </label>
          <div class="radio-row">
            <span class="label">管理范围</span>
            <label><input type="radio" checked /> 全公司</label>
            <label><input type="radio" /> 同层级</label>
            <label><input type="radio" /> 下属</label>
            <label><input type="radio" /> 自定义</label>
          </div>
          <div class="checkbox-row">
            <span class="label">操作权限</span>
            <label><input type="checkbox" checked /> 查看</label>
            <label><input type="checkbox" checked /> 导出</label>
            <label><input type="checkbox" checked /> 删除</label>
          </div>
          <button class="btn btn-ghost" type="button">新增权限组</button>
          <div class="panel-divider"></div>
          <div class="section-title">权限组外人员查看权限</div>
          <label><input type="radio" checked /> 组织内所有人员均可查看</label>
          <label><input type="radio" /> 表单流程参与人和被@人可查看</label>
        </div>
      </section>
    </div>
  </div>
</template>
