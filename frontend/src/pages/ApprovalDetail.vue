<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusPill from '../components/StatusPill.vue'
import PriorityPill from '../components/PriorityPill.vue'
import FlowStepper from '../components/FlowStepper.vue'
import { approvalApi } from '../services/api'

const route = useRoute()
const router = useRouter()

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

async function fetchApproval() {
  loading.value = true
  error.value = ''
  try {
    approval.value = await approvalApi.get(route.params.id)
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

async function handleApprove() {
  if (!approval.value) return
  updating.value = true
  try {
    await approvalApi.approve(approval.value.id, { comment: comment.value })
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
    error.value = '拒绝时请填写理由'
    return
  }
  updating.value = true
  try {
    await approvalApi.reject(approval.value.id, { comment: comment.value })
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
  try {
    await approvalApi.revoke(approval.value.id)
    await fetchApproval()
  } catch {
    error.value = '撤回操作失败'
  } finally {
    updating.value = false
  }
}

const canApprove = computed(() => {
  return approval.value?.status === 'pending' || approval.value?.status === 'reviewing'
})

const canRevoke = computed(() => {
  return approval.value?.status === 'pending'
})

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
          <FlowStepper :current="approval.status" />
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
              <div class="device-chip">发起 → 审批 → 完成</div>
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
          <label class="field">
            <span>审批意见</span>
            <textarea v-model="comment" rows="3" placeholder="输入审批意见（拒绝时必填）"></textarea>
          </label>
          <div class="action-row" v-if="canApprove">
            <button class="btn btn-primary" :disabled="updating" @click="handleApprove">
              {{ updating ? '处理中...' : '同意' }}
            </button>
            <button class="btn btn-danger" :disabled="updating" @click="handleReject">
              {{ updating ? '处理中...' : '拒绝' }}
            </button>
            <button v-if="canRevoke" class="btn btn-ghost" :disabled="updating" @click="handleRevoke">
              撤回
            </button>
          </div>
          <div v-else-if="approval.status === 'approved'" class="status-badge success">审批已通过</div>
          <div v-else-if="approval.status === 'rejected'" class="status-badge error">审批已拒绝</div>

          <div class="panel-divider"></div>
          <div class="section-title">审批记录</div>
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div>
                <div class="timeline-title">审批发起</div>
                <div class="muted">{{ approval.created_at?.slice(0, 16).replace('T', ' ') }} · 系统自动生成</div>
              </div>
            </div>
            <div class="timeline-item" v-if="approval.status === 'reviewing'">
              <div class="timeline-dot active"></div>
              <div>
                <div class="timeline-title">审批中</div>
                <div class="muted">等待审批人处理</div>
              </div>
            </div>
            <div class="timeline-item" v-if="approval.status === 'approved'">
              <div class="timeline-dot done"></div>
              <div>
                <div class="timeline-title">审批通过</div>
                <div class="muted">{{ approval.updated_at?.slice(0, 16).replace('T', ' ') }}</div>
              </div>
            </div>
            <div class="timeline-item" v-if="approval.status === 'rejected'">
              <div class="timeline-dot error"></div>
              <div>
                <div class="timeline-title">审批拒绝</div>
                <div class="muted">{{ approval.updated_at?.slice(0, 16).replace('T', ' ') }}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
