<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StatusPill from '../components/StatusPill.vue'
import PriorityPill from '../components/PriorityPill.vue'
import { approvalApi } from '../services/api'

const router = useRouter()
const route = useRoute()

const approvals = ref([])
const loading = ref(false)
const error = ref('')
const statusFilter = ref('')
const showModal = ref(false)

const form = reactive({
  title: '',
  type: 'expense',
  amount: '',
  reason: '',
  priority: 'medium',
})

const approvalTypes = [
  { value: 'expense', label: '费用报销' },
  { value: 'leave', label: '请假申请' },
  { value: 'purchase', label: '采购申请' },
  { value: 'other', label: '其他' },
]

const stats = computed(() => {
  const summary = {
    total: approvals.value.length,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
  }
  approvals.value.forEach((item) => {
    if (summary[item.status] !== undefined) {
      summary[item.status] += 1
    }
  })
  return summary
})

const totalAmount = computed(() => {
  return approvals.value.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const featuredApproval = computed(() => approvals.value[0])

async function fetchApprovals() {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    const data = await approvalApi.list(params)
    approvals.value = data.items || []
  } catch (err) {
    error.value = '加载审批列表失败'
  } finally {
    loading.value = false
  }
}

function openApproval(id) {
  router.push(`/approvals/${id}`)
}

function resetForm() {
  form.title = ''
  form.type = 'expense'
  form.amount = ''
  form.reason = ''
  form.priority = 'medium'
}

async function createApproval() {
  if (!form.title) return
  const payload = {
    title: form.title,
    type: form.type,
    amount: form.amount ? Number(form.amount) : 0,
    description: form.reason,
    priority: form.priority,
  }
  try {
    await approvalApi.create(payload)
    showModal.value = false
    resetForm()
    await fetchApprovals()
  } catch {
    error.value = '创建审批单失败'
  }
}

function getTypeLabel(type) {
  const found = approvalTypes.find(t => t.value === type)
  return found ? found.label : type
}

watch(
  () => route.query.status,
  (val) => {
    statusFilter.value = val || ''
    fetchApprovals()
  },
  { immediate: true }
)

watch(statusFilter, () => {
  router.replace({ query: { ...route.query, status: statusFilter.value || undefined } })
})
</script>

<template>
  <div class="page approvals-page">
    <div class="page-header approvals-header">
      <div>
        <div class="page-eyebrow">审批</div>
        <h2>审批中心</h2>
        <p class="page-subtitle">统一审批流转，支持多级审批路由与流程诊断。</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-ghost" type="button" @click="router.push('/approvals/workflow/create')">
          创建审批流程
        </button>
        <button class="btn btn-primary" type="button" @click="showModal = true">
          新建审批单
        </button>
      </div>
    </div>

    <div class="stat-grid approvals-stats">
      <div class="stat-card">
        <div class="stat-label">全部审批</div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-meta">本月累计</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">待审批</div>
        <div class="stat-value">{{ stats.pending }}</div>
        <div class="stat-meta">等待处理</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">审批中</div>
        <div class="stat-value">{{ stats.reviewing }}</div>
        <div class="stat-meta">流转节点中</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">累计金额</div>
        <div class="stat-value">¥{{ totalAmount.toLocaleString() }}</div>
        <div class="stat-meta">含全部报销</div>
      </div>
    </div>

    <div class="page-grid approvals-grid">
      <section class="panel panel-large approvals-list">
        <div class="panel-header approvals-list-header">
          <div>
            <div class="panel-title">审批列表</div>
            <div class="muted">按状态筛选并查看每条审批的流转情况</div>
          </div>
          <div class="filters approvals-filters">
            <button class="chip" :class="{ active: statusFilter === '' }" @click="statusFilter = ''">全部</button>
            <button class="chip" :class="{ active: statusFilter === 'pending' }" @click="statusFilter = 'pending'">
              待审批
            </button>
            <button class="chip" :class="{ active: statusFilter === 'reviewing' }" @click="statusFilter = 'reviewing'">
              审批中
            </button>
            <button class="chip" :class="{ active: statusFilter === 'approved' }" @click="statusFilter = 'approved'">
              已通过
            </button>
            <button class="chip" :class="{ active: statusFilter === 'rejected' }" @click="statusFilter = 'rejected'">
              已拒绝
            </button>
          </div>
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <div class="approval-list" v-if="!loading && approvals.length">
          <div v-for="approval in approvals" :key="approval.id" class="approval-row" @click="openApproval(approval.id)">
            <div class="row-main">
              <div class="row-title">{{ approval.title }}</div>
              <div class="row-meta">
                #{{ approval.id }} · {{ getTypeLabel(approval.type) }} · {{ approval.created_at?.slice(0, 10) || '—' }}
              </div>
              <div class="row-desc">{{ approval.description || '暂无描述' }}</div>
            </div>
            <div class="row-info">
              <PriorityPill :priority="approval.priority" />
              <StatusPill :status="approval.status" />
            </div>
          </div>
        </div>

        <div v-else-if="loading" class="empty">加载中...</div>
        <div v-else class="empty">暂无审批</div>
      </section>

      <aside class="panel panel-side approvals-side">
        <div class="panel-header">
          <div>
            <div class="panel-title">流程概览</div>
            <div class="muted">快速进入审批流程设计</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="step-list">
            <div class="step-item">
              <div class="step-index">1</div>
              <div>
                <div class="step-title">基础信息</div>
                <div class="muted">审批名称、类型与权限</div>
              </div>
            </div>
            <div class="step-item">
              <div class="step-index">2</div>
              <div>
                <div class="step-title">表单设计</div>
                <div class="muted">拖拽字段快速搭建表单</div>
              </div>
            </div>
            <div class="step-item">
              <div class="step-index">3</div>
              <div>
                <div class="step-title">流程设计</div>
                <div class="muted">配置条件分支与审批人</div>
              </div>
            </div>
          </div>

          <div class="panel-divider"></div>

          <div class="featured" v-if="featuredApproval">
            <div class="featured-title">最新审批</div>
            <div class="featured-card">
              <div>
                <div class="featured-name">{{ featuredApproval.title }}</div>
                <div class="featured-meta">
                  {{ getTypeLabel(featuredApproval.type) }} · {{ featuredApproval.created_at?.slice(0, 10) || '—' }}
                </div>
              </div>
              <StatusPill :status="featuredApproval.status" />
            </div>
            <button class="btn btn-ghost" type="button" @click="openApproval(featuredApproval.id)">
              打开审批
            </button>
          </div>
        </div>
      </aside>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <div>
            <div class="modal-title">新建审批单</div>
            <div class="muted">发起审批流程</div>
          </div>
          <button class="btn btn-ghost" @click="showModal = false">关闭</button>
        </div>
        <div class="modal-body">
          <label class="field">
            <span>审批类型</span>
            <select v-model="form.type">
              <option v-for="t in approvalTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </label>
          <label class="field">
            <span>标题</span>
            <input v-model="form.title" type="text" placeholder="例如：项目差旅费用报销" />
          </label>
          <label class="field" v-if="form.type === 'expense' || form.type === 'purchase'">
            <span>金额 (元)</span>
            <input v-model="form.amount" type="number" placeholder="0.00" />
          </label>
          <label class="field">
            <span>申请理由</span>
            <textarea v-model="form.reason" rows="4" placeholder="请描述申请理由"></textarea>
          </label>
          <label class="field">
            <span>优先级</span>
            <select v-model="form.priority">
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
              <option value="urgent">紧急</option>
            </select>
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="createApproval">提交审批</button>
        </div>
      </div>
    </div>
  </div>
</template>
