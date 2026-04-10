<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusPill from '../components/StatusPill.vue'
import PriorityPill from '../components/PriorityPill.vue'
import FlowStepper from '../components/FlowStepper.vue'
import { approvalApi } from '../services/api'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const approval = ref(null)
const loading = ref(false)
const error = ref('')
const updating = ref(false)
const comment = ref('')

const approvalTypes = {
  expense: '费用报销',
  leave: '请假申请',
  purchase: '采购申请',
  other: '其他',
}

// 工作流步骤与角色映射
const stepRoleMap = {
  dept_approve: 'dept_manager',
  finance_approve: 'finance',
  gm_approve: 'gm',
}

const stepLabelMap = {
  dept_approve: '部门经理',
  finance_approve: '财务',
  gm_approve: '总经理',
}

// 步骤推进顺序
const nextStepMap = {
  dept_approve: 'finance_approve',
  finance_approve: 'gm_approve',
  gm_approve: 'completed',
}

// 解析审批记录
const approvalRecords = computed(() => {
  if (!approval.value?.approval_records) return []
  try {
    return JSON.parse(approval.value.approval_records)
  } catch {
    return []
  }
})

async function fetchApproval() {
  loading.value = true
  error.value = ''
  try {
    approval.value = await approvalApi.get(route.params.id)
    if (!approval.value.current_step) {
      if (approval.value.status === 'approved') {
        approval.value.current_step = 'completed'
      } else {
        approval.value.current_step = 'dept_approve'
      }
    }
  } catch {
    error.value = '加载审批详情失败'
  } finally {
    loading.value = false
  }
}

function parseDescription(desc) {
  const info = { applicant: '', department: '', reason: '', raw: desc || '' }
  if (!desc) return info
  const parts = desc.split(/[;；]/).map((part) => part.trim()).filter(Boolean)
  parts.forEach((part) => {
    if (part.startsWith('申请人：')) info.applicant = part.replace('申请人：', '')
    if (part.startsWith('所属部门：')) info.department = part.replace('所属部门：', '')
    if (part.startsWith('申请理由：')) info.reason = part.replace('申请理由：', '')
  })
  return info
}

const detailInfo = computed(() => parseDescription(approval.value?.description || ''))

const canApprove = computed(() => {
  if (!approval.value) return false
  const status = approval.value.status
  const step = approval.value.current_step
  if (status === 'approved' || status === 'rejected') return false
  const requiredRole = stepRoleMap[step]
  return auth.currentRole === requiredRole
})

const canRevoke = computed(() => {
  if (!approval.value) return false
  return auth.currentRole === 'applicant' && approval.value.status === 'pending'
})

const requiredRoleLabel = computed(() => {
  if (!approval.value) return ''
  return stepLabelMap[approval.value.current_step] || ''
})

async function handleApprove() {
  if (!approval.value) return
  updating.value = true
  error.value = ''
  try {
    const step = approval.value.current_step
    const nextStep = nextStepMap[step]
    if (nextStep === 'completed') {
      await approvalApi.update(approval.value.id, {
        status: 'approved',
        current_step: 'completed',
        comment: comment.value,
        role: auth.currentRole,
      })
    } else {
      await approvalApi.update(approval.value.id, {
        status: 'reviewing',
        current_step: nextStep,
        comment: comment.value,
        role: auth.currentRole,
      })
    }
    comment.value = ''
    await fetchApproval()
  } catch {
    error.value = '审批操作失败'
  } finally {
    updating.value = false
  }
}

async function handleReject() {
  if (!approval.value) return
  if (!comment.value) {
    error.value = '驳回时请填写理由'
    return
  }
  updating.value = true
  error.value = ''
  try {
    await approvalApi.update(approval.value.id, {
      status: 'rejected',
      comment: comment.value,
      role: auth.currentRole,
    })
    comment.value = ''
    await fetchApproval()
  } catch {
    error.value = '审批操作失败'
  } finally {
    updating.value = false
  }
}

async function handleRevoke() {
  if (!approval.value) return
  updating.value = true
  error.value = ''
  try {
    await approvalApi.update(approval.value.id, {
      status: 'pending',
      current_step: 'dept_approve',
      role: auth.currentRole,
    })
    await fetchApproval()
  } catch {
    error.value = '撤回操作失败'
  } finally {
    updating.value = false
  }
}

function recordTitle(record) {
  if (record.action === 'submit') return '审批发起'
  if (record.action === 'completed') return '审批完成'
  const label = record.role_label || stepLabelMap[record.step] || ''
  if (record.action === 'approve') return `${label}审批 · 已通过`
  if (record.action === 'reject') return `${label}审批 · 已驳回`
  return label
}

function recordDesc(record) {
  if (record.action === 'submit') return `${record.time} · 系统自动生成`
  if (record.action === 'completed') return record.time
  // 优先显示审批意见，没有意见则显示默认文字
  if (record.comment) return record.comment
  if (record.action === 'approve') return `${record.role_label || ''}已审批通过`
  if (record.action === 'reject') return `${record.role_label || ''}已驳回`
  return ''
}

function recordDotClass(record) {
  if (record.action === 'reject') return 'error'
  return 'done'
}

watch(
  () => route.params.id,
  () => fetchApproval()
)

onMounted(fetchApproval)
</script>

<template>
  <div class="page approval-detail-page">
    <div class="workflow-header">
      <button class="btn btn-ghost" @click="router.push('/approvals')">返回列表</button>
      <div>
        <h2>{{ approval?.title || approvalTypes[approval?.type] || '审批详情' }}</h2>
        <p class="page-subtitle">配置审批表单与流程节点，支持多条件分支。</p>
      </div>
      <div class="workflow-meta">
        <StatusPill v-if="approval" :status="approval.status" />
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="empty">加载中...</div>

    <div v-else-if="approval" class="workflow-grid">
      <section class="panel info-panel">
        <div class="panel-header">
          <div class="panel-title">审批概览</div>
        </div>
        <div class="panel-body">
          <div class="info-grid">
            <div class="info-item">
              <span>审批编号</span>
              <strong>#{{ approval.id }}</strong>
            </div>
            <div class="info-item">
              <span>审批类型</span>
              <strong>{{ approvalTypes[approval.type] || approval.type }}</strong>
            </div>
            <div class="info-item">
              <span>发起人</span>
              <strong>{{ approval.created_by || '—' }}</strong>
            </div>
            <div class="info-item">
              <span>创建日期</span>
              <strong>{{ approval.created_at?.slice(0, 10) }}</strong>
            </div>
          </div>
          <div class="info-desc">
            申请人：{{ detailInfo.applicant || '—' }}；所属部门：{{ detailInfo.department || '—' }}；申请理由：{{
              detailInfo.reason || '—'
            }}
          </div>
          <div class="info-tags">
            <PriorityPill :priority="approval.priority" />
            <div class="muted" v-if="approval.amount">金额：¥{{ approval.amount?.toLocaleString() }}</div>
          </div>
          <div class="panel-divider"></div>
          <div class="section-title">审批进度</div>
          <FlowStepper :current="approval.status" :currentStep="approval.current_step" />
        </div>
      </section>

      <section class="canvas-panel">
        <div class="canvas-title">审批表单预览</div>
        <div class="device-frame">
          <div class="device-header">费用报销申请</div>
          <div class="device-body">
            <div class="device-field">
              <span>报销类型</span>
              <strong>{{ approvalTypes[approval.type] || '费用报销' }}</strong>
            </div>
            <div class="device-field">
              <span>报销事由</span>
              <div class="muted">{{ detailInfo.reason || detailInfo.raw || '请输入内容' }}</div>
            </div>
            <div class="device-field">
              <span>费用汇总</span>
              <strong>¥{{ approval.amount?.toLocaleString() || '0.00' }}</strong>
            </div>
            <div class="device-field">
              <span>明细</span>
              <div class="device-chip">内容 · 日期 · 金额</div>
            </div>
            <div class="device-field">
              <span>审批流程</span>
              <div class="device-chip">发起 → 部门经理审批 → 财务审核 → 总经理审批 → 完成</div>
            </div>
          </div>
        </div>
      </section>

      <aside class="panel settings-panel">
        <div class="panel-header">
          <div class="panel-title">审批处理</div>
        </div>
        <div class="panel-body">
          <div class="status-block">
            <div class="muted">当前状态</div>
            <StatusPill :status="approval.status" />
          </div>

          <div class="role-hint" v-if="approval.status !== 'approved' && approval.status !== 'rejected'">
            <div class="role-hint-label">当前等待</div>
            <div class="role-hint-value">{{ requiredRoleLabel }} 审批</div>
            <div class="role-hint-tip" v-if="!canApprove">
              请切换到「{{ requiredRoleLabel }}」角色进行审批
            </div>
          </div>

          <label class="field" v-if="canApprove || canRevoke">
            <span>审批意见</span>
            <textarea v-model="comment" rows="3" placeholder="输入审批意见（驳回时必填）"></textarea>
          </label>
          <div class="action-row" v-if="canApprove">
            <button class="btn btn-primary" :disabled="updating" @click="handleApprove">
              {{ updating ? '处理中...' : '同意' }}
            </button>
            <button class="btn btn-danger" :disabled="updating" @click="handleReject">
              {{ updating ? '处理中...' : '驳回' }}
            </button>
          </div>
          <div class="action-row" v-if="canRevoke">
            <button class="btn btn-ghost" :disabled="updating" @click="handleRevoke">
              撤回申请
            </button>
          </div>
          <div v-if="!canApprove && !canRevoke && (approval.status === 'pending' || approval.status === 'reviewing')" class="status-badge muted-badge">
            等待{{ requiredRoleLabel }}审批中
          </div>
          <div v-if="approval.status === 'approved'" class="status-badge success">审批已通过</div>
          <div v-if="approval.status === 'rejected'" class="status-badge error">审批已驳回</div>

          <div class="panel-divider"></div>
          <div class="section-title">审批记录</div>
          <div class="timeline">
            <template v-if="approvalRecords.length > 0">
              <div class="timeline-item" v-for="(record, idx) in approvalRecords" :key="idx">
                <div class="timeline-dot" :class="recordDotClass(record)"></div>
                <div>
                  <div class="timeline-title">{{ recordTitle(record) }}</div>
                  <div class="muted">{{ recordDesc(record) }}</div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="timeline-item">
                <div class="timeline-dot done"></div>
                <div>
                  <div class="timeline-title">审批发起</div>
                  <div class="muted">{{ approval.created_at?.slice(0, 16).replace('T', ' ') }} · 系统自动生成</div>
                </div>
              </div>
            </template>
            <template v-if="approval.status !== 'approved' && approval.status !== 'rejected'">
              <div class="timeline-item" v-if="approval.current_step === 'dept_approve'">
                <div class="timeline-dot active"></div>
                <div>
                  <div class="timeline-title">部门经理审批</div>
                  <div class="muted">等待部门经理处理</div>
                </div>
              </div>
              <div class="timeline-item" v-if="approval.current_step === 'finance_approve'">
                <div class="timeline-dot active"></div>
                <div>
                  <div class="timeline-title">财务审核</div>
                  <div class="muted">等待财务处理</div>
                </div>
              </div>
              <div class="timeline-item" v-if="approval.current_step === 'gm_approve'">
                <div class="timeline-dot active"></div>
                <div>
                  <div class="timeline-title">总经理审批</div>
                  <div class="muted">等待总经理处理</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
