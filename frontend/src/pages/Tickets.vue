<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import StatusPill from '../components/StatusPill.vue'
import PriorityPill from '../components/PriorityPill.vue'
import { ticketApi } from '../services/api'

const router = useRouter()
const route = useRoute()

const tickets = ref([])
const loading = ref(false)
const error = ref('')
const statusFilter = ref('')
const showModal = ref(false)

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  assignee_id: '',
})

const stats = computed(() => {
  const summary = { total: tickets.value.length, open: 0, in_progress: 0, resolved: 0, closed: 0 }
  tickets.value.forEach((item) => {
    if (summary[item.status] !== undefined) summary[item.status] += 1
  })
  return summary
})

async function fetchTickets() {
  loading.value = true
  error.value = ''
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    const data = await ticketApi.list(params)
    tickets.value = data.items || []
  } catch (err) {
    error.value = '加载工单失败'
  } finally {
    loading.value = false
  }
}

function openTicket(id) {
  router.push(`/tickets/${id}`)
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.priority = 'medium'
  form.assignee_id = ''
}

async function createTicket() {
  if (!form.title) return
  const payload = {
    title: form.title,
    description: form.description,
    priority: form.priority,
  }
  if (form.assignee_id) {
    payload.assignee_id = Number(form.assignee_id)
  }
  try {
    await ticketApi.create(payload)
    showModal.value = false
    resetForm()
    await fetchTickets()
  } catch {
    error.value = '创建工单失败'
  }
}

watch(
  () => route.query.status,
  (val) => {
    statusFilter.value = val || ''
    fetchTickets()
  },
  { immediate: true }
)

watch(statusFilter, () => {
  router.replace({ query: { ...route.query, status: statusFilter.value || undefined } })
})
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-eyebrow">工单</div>
        <h2>工单中心</h2>
        <p class="page-subtitle">统一工单流转，支持外部系统接入。</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-primary" type="button" @click="showModal = true">
          新建工单
        </button>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">全部工单</div>
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-meta">本月累计</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">待处理</div>
        <div class="stat-value">{{ stats.open }}</div>
        <div class="stat-meta">等待分配</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">处理中</div>
        <div class="stat-value">{{ stats.in_progress }}</div>
        <div class="stat-meta">处理中</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已解决</div>
        <div class="stat-value">{{ stats.resolved }}</div>
        <div class="stat-meta">已完成</div>
      </div>
    </div>

    <section class="panel panel-large">
      <div class="panel-header">
        <div>
          <div class="panel-title">工单列表</div>
          <div class="muted">查看工单进度与处理负责人</div>
        </div>
        <div class="filters">
          <button class="chip" :class="{ active: statusFilter === '' }" @click="statusFilter = ''">全部</button>
          <button class="chip" :class="{ active: statusFilter === 'open' }" @click="statusFilter = 'open'">待处理</button>
          <button class="chip" :class="{ active: statusFilter === 'in_progress' }" @click="statusFilter = 'in_progress'">处理中</button>
          <button class="chip" :class="{ active: statusFilter === 'resolved' }" @click="statusFilter = 'resolved'">已解决</button>
          <button class="chip" :class="{ active: statusFilter === 'closed' }" @click="statusFilter = 'closed'">已关闭</button>
        </div>
      </div>

      <div v-if="error" class="error">{{ error }}</div>

      <div class="approval-list" v-if="!loading && tickets.length">
        <div v-for="ticket in tickets" :key="ticket.id" class="approval-row" @click="openTicket(ticket.id)">
          <div class="row-main">
            <div class="row-title">{{ ticket.title }}</div>
            <div class="row-meta">#{{ ticket.id }} · {{ ticket.created_at?.slice(0, 10) || '—' }}</div>
            <div class="row-desc">{{ ticket.description || '暂无描述' }}</div>
          </div>
          <div class="row-info">
            <div class="row-amount">负责人：{{ ticket.assignee_id || '未分配' }}</div>
            <PriorityPill :priority="ticket.priority" />
            <StatusPill :status="ticket.status" />
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="empty">加载中...</div>
      <div v-else class="empty">暂无工单</div>
    </section>

    <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <div>
            <div class="modal-title">新建工单</div>
            <div class="muted">快速创建，支持后续流转</div>
          </div>
          <button class="btn btn-ghost" @click="showModal = false">关闭</button>
        </div>
        <div class="modal-body">
          <label class="field">
            <span>标题</span>
            <input v-model="form.title" type="text" placeholder="例如：VPN 无法连接" />
          </label>
          <label class="field">
            <span>描述</span>
            <textarea v-model="form.description" rows="4" placeholder="请描述问题背景"></textarea>
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
          <label class="field">
            <span>负责人 ID</span>
            <input v-model="form.assignee_id" type="number" placeholder="可选" />
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn btn-ghost" @click="showModal = false">取消</button>
          <button class="btn btn-primary" @click="createTicket">创建</button>
        </div>
      </div>
    </div>
  </div>
</template>
