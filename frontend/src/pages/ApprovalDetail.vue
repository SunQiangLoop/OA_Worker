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

const tabs = [
  { key: 'basic', label: '基础信息' },
  { key: 'form', label: '表单设计' },
  { key: 'flow', label: '流程设计' },
  { key: 'more', label: '更多设置' },
]

const activeTab = ref('basic')

const approvalTypes = {
  expense: '费用报销',
  leave: '请假申请',
  purchase: '采购申请',
  other: '其他',
}

const controlGroups = [
  { title: '文本', items: ['单行文本', '多行文本', '说明'] },
  { title: '数值', items: ['数字', '金额', '计算公式'] },
  { title: '选项', items: ['单选', '多选'] },
  { title: '日期', items: ['日期', '日期区间'] },
  { title: '其他', items: ['明细/表格', '附件', '部门', '联系人'] },
]

const guideCards = [
  { title: '创建审批流程', desc: '快速创建一个简单的审批流程' },
  { title: '设置分支条件', desc: '不同条件适配不同审批路线' },
  { title: '设置多人审批', desc: '可设置会签或或签模式' },
  { title: '审批人去重', desc: '同一审批人多次出现时自动去重' },
]

const fieldSettings = [
  { label: '标题', value: '数字' },
  { label: '默认提示', value: '请输入' },
  { label: '单位', value: '元' },
  { label: '最小值', value: '0' },
]

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
  <div class="page workflow-page">
    <div class="workflow-header">
      <button class="btn btn-ghost" @click="router.push('/approvals')">返回列表</button>
      <div>
        <h2>费用报销</h2>
        <p class="page-subtitle">配置审批表单与流程节点，支持多条件分支。</p>
      </div>
      <div class="workflow-meta">
        <StatusPill v-if="approval" :status="approval.status" />
        <div class="meta-chip">3 项不完善</div>
      </div>
    </div>

    <div class="workflow-steps">
      <button
        v-for="(tab, idx) in tabs"
        :key="tab.key"
        class="workflow-step"
        :class="{ active: activeTab === tab.key }"
        type="button"
        @click="activeTab = tab.key"
      >
        <span class="step-number">{{ idx + 1 }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="loading" class="empty">加载中...</div>

    <div v-else-if="approval">
      <div v-if="activeTab === 'basic'" class="workflow-grid">
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
            <div class="info-desc">{{ approval.description || '暂无描述' }}</div>
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
                <div class="muted">{{ approval.description || '请输入内容' }}</div>
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

      <div v-else-if="activeTab === 'form'" class="workflow-grid">
        <section class="panel toolbox-panel">
          <div class="panel-header">
            <div class="panel-title">控件</div>
          </div>
          <div class="panel-body">
            <div v-for="group in controlGroups" :key="group.title" class="tool-group">
              <div class="tool-title">{{ group.title }}</div>
              <div class="tool-items">
                <div v-for="item in group.items" :key="item" class="tool-item">{{ item }}</div>
              </div>
            </div>
          </div>
        </section>

        <section class="canvas-panel">
          <div class="canvas-title">表单设计预览</div>
          <div class="device-frame">
            <div class="device-header">未命名审批</div>
            <div class="device-body">
              <div class="device-drop">点击或拖拽左侧控件至此处</div>
              <div class="device-field">
                <span>数字</span>
                <div class="device-chip">请输入</div>
              </div>
              <div class="device-field">
                <span>金额</span>
                <div class="device-chip">0.00</div>
              </div>
            </div>
          </div>
        </section>

        <aside class="panel settings-panel">
          <div class="panel-header">
            <div class="panel-title">字段设置</div>
          </div>
          <div class="panel-body">
            <button class="btn btn-primary" type="button">基础设置</button>
            <div class="field-group">
              <label v-for="setting in fieldSettings" :key="setting.label" class="field">
                <span>{{ setting.label }}</span>
                <input type="text" :value="setting.value" />
              </label>
            </div>
          </div>
        </aside>
      </div>

      <div v-else-if="activeTab === 'flow'" class="workflow-grid">
        <section class="panel guide-panel">
          <div class="panel-header">
            <div class="panel-title">流程设计指南</div>
          </div>
          <div class="panel-body">
            <div v-for="card in guideCards" :key="card.title" class="guide-card">
              <div class="guide-title">{{ card.title }}</div>
              <div class="muted">{{ card.desc }}</div>
            </div>
          </div>
        </section>

        <section class="flow-canvas">
          <div class="flow-node start">提交</div>
          <div class="flow-plus">+</div>
          <div class="flow-node condition">+ 添加条件</div>
          <div class="flow-branches">
            <div class="flow-branch">
              <div class="branch-title">优先级 1</div>
              <div class="branch-node">审批人：提交人自选</div>
            </div>
            <div class="flow-branch">
              <div class="branch-title">优先级 2</div>
              <div class="branch-node">审批人：部门负责人</div>
            </div>
            <div class="flow-branch">
              <div class="branch-title">默认条件</div>
              <div class="branch-node">审批人：财务复核</div>
            </div>
          </div>
          <div class="flow-plus">+</div>
          <div class="flow-node end">完成</div>
        </section>

        <aside class="panel settings-panel">
          <div class="panel-header">
            <div class="panel-title">发起设置</div>
          </div>
          <div class="panel-body">
            <div class="setting-block">
              <div class="setting-title">谁可以提交该审批</div>
              <div class="muted">全员</div>
            </div>
            <div class="setting-block">
              <div class="setting-title">抄送人设置</div>
              <div class="setting-list">
                <label class="radio">
                  <input type="radio" checked />
                  <span>上级</span>
                </label>
                <label class="radio">
                  <input type="radio" />
                  <span>用户组</span>
                </label>
                <label class="radio">
                  <input type="radio" />
                  <span>提交人本人</span>
                </label>
              </div>
            </div>
            <button class="btn btn-ghost" type="button">+ 添加抄送人</button>
          </div>
        </aside>
      </div>

      <section v-else class="panel panel-large">
        <div class="panel-header">
          <div class="panel-title">更多设置</div>
        </div>
        <div class="panel-body">
          <div class="empty">更多配置项正在准备中</div>
        </div>
      </section>
    </div>
  </div>
</template>
