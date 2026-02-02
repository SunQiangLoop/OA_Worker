<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusPill from '../components/StatusPill.vue'
import PriorityPill from '../components/PriorityPill.vue'
import FlowStepper from '../components/FlowStepper.vue'
import { ticketApi } from '../services/api'

const route = useRoute()
const router = useRouter()

const ticket = ref(null)
const loading = ref(false)
const error = ref('')
const updating = ref(false)

const statusActions = {
  open: { label: '开始处理', next: 'in_progress' },
  in_progress: { label: '标记已解决', next: 'resolved' },
  resolved: { label: '关闭工单', next: 'closed' },
}

const action = computed(() => statusActions[ticket.value?.status])

async function fetchTicket() {
  loading.value = true
  error.value = ''
  try {
    ticket.value = await ticketApi.get(route.params.id)
  } catch {
    error.value = '加载工单失败'
  } finally {
    loading.value = false
  }
}

async function updateStatus(next) {
  if (!ticket.value) return
  updating.value = true
  try {
    await ticketApi.update(ticket.value.id, { status: next })
    await fetchTicket()
  } catch {
    error.value = '更新状态失败'
  } finally {
    updating.value = false
  }
}

async function updatePriority(event) {
  if (!ticket.value) return
  const value = event.target.value
  updating.value = true
  try {
    await ticketApi.update(ticket.value.id, { priority: value })
    await fetchTicket()
  } catch {
    error.value = '更新优先级失败'
  } finally {
    updating.value = false
  }
}

watch(
  () => route.params.id,
  () => fetchTicket()
)

onMounted(fetchTicket)
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <button class="btn btn-ghost" @click="router.push('/tickets')">返回列表</button>
        <h2>工单详情</h2>
        <p class="page-subtitle">查看处理进度与流转状态</p>
      </div>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="empty">加载中...</div>

    <div v-else-if="ticket" class="page-grid">
      <section class="panel panel-large">
        <div class="panel-header">
          <div>
            <div class="panel-title">工单信息</div>
            <div class="muted">#{{ ticket.id }} · 创建人 {{ ticket.created_by || '系统' }}</div>
          </div>
          <StatusPill :status="ticket.status" />
        </div>
        <div class="panel-body">
          <div class="row-title">{{ ticket.title }}</div>
          <div class="row-desc">{{ ticket.description || '暂无描述' }}</div>
          <div class="info-tags">
            <PriorityPill :priority="ticket.priority" />
            <div class="muted">负责人：{{ ticket.assignee_id || '未分配' }}</div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">流转进度</div>
            <div class="muted">按照流程更新处理状态</div>
          </div>
          <div class="inline">
            <label class="field-inline">
              <span>优先级</span>
              <select :value="ticket.priority" @change="updatePriority">
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
                <option value="urgent">紧急</option>
              </select>
            </label>
          </div>
        </div>
        <div class="panel-body">
          <FlowStepper :current="ticket.status" />
          <div class="action-row" v-if="action">
            <button class="btn btn-primary" :disabled="updating" @click="updateStatus(action.next)">
              {{ updating ? '处理中...' : action.label }}
            </button>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div class="panel-title">处理记录</div>
        </div>
        <div class="panel-body">
          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div>
                <div class="timeline-title">工单创建</div>
                <div class="muted">系统自动生成</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div>
                <div class="timeline-title">处理中</div>
                <div class="muted">等待更新处理节点</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
