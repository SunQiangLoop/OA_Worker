<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { approvalApi, workflowApi } from '../services/api'

const route = useRoute()
const router = useRouter()

const template = ref(null)
const loading = ref(true)
const submitting = ref(false)
const error = ref('')
const syncCalendar = ref(false)
const fieldValues = reactive({})

onMounted(async () => {
  try {
    template.value = await workflowApi.getTemplate(route.params.id)
    getFields().forEach((f) => { fieldValues[f.id] = '' })
  } catch {
    error.value = '加载审批模板失败，请返回重试'
  } finally {
    loading.value = false
  }
})

function getFields() {
  const raw = template.value?.form_fields
  if (!raw) return []
  try { return Array.isArray(raw) ? raw : JSON.parse(raw) } catch { return [] }
}

const fields = computed(() => getFields())

function isTextarea(t)  { return t === '多行文本' }
function isExplain(t)   { return t === '说明' }
function isDateRange(t) { return t === '日期区间' }
function isAmount(t)    { return t === '金额' }
function isFile(t)      { return t === '图片' || t === '附件' }
function inputType(t)   { return { 数字: 'number', 金额: 'number', 日期: 'date' }[t] || 'text' }

function nodeSubText(node) {
  if (node.node_type === 'cc') return '请选择抄送人'
  const modeMap = { or_sign: '或签·1人审批', and_sign: '会签·全员审批', sequential: '依次审批' }
  return modeMap[node.approve_mode] || '1人审批'
}

async function submitApproval() {
  if (submitting.value) return
  error.value = ''
  const missing = fields.value.filter((f) => f.required && !fieldValues[f.id])
  if (missing.length) {
    error.value = `请填写必填项：${missing.map((f) => f.label).join('、')}`
    return
  }
  submitting.value = true
  try {
    const desc = fields.value
      .filter((f) => !isExplain(f.type))
      .map((f) => `${f.label}：${fieldValues[f.id] || '—'}`)
      .join('；')
    await approvalApi.create({
      title: template.value?.name || '审批申请',
      type: 'general',
      amount: 0,
      description: desc,
      priority: 'medium',
    })
    router.push('/approvals')
  } catch {
    error.value = '提交失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="page sf-page">

    <div v-if="loading" class="sf-loading">加载中…</div>

    <template v-else-if="template">
      <div class="sf-card">
        <!-- 标题 -->
        <div class="sf-card-header">
          <h2 class="sf-title">{{ template.name }}</h2>
          <div class="sf-submitter">
            <span class="sf-submitter-dot"></span>
            <span class="sf-submitter-name muted">发起人</span>
          </div>
          <div class="sf-divider"></div>
        </div>

        <!-- 表单字段 -->
        <div class="sf-form">
          <template v-for="field in fields" :key="field.id">

            <!-- 说明文字 -->
            <div v-if="isExplain(field.type)" class="sf-explain">
              {{ field.placeholder || field.label }}
            </div>

            <!-- 日期区间 -->
            <div v-else-if="isDateRange(field.type)" class="sf-field">
              <div class="sf-label">
                <span v-if="field.required" class="sf-required">*</span>{{ field.label }}
              </div>
              <div class="sf-date-range">
                <input v-model="fieldValues[field.id + '_start']" class="sf-input" type="date" />
                <span class="sf-date-sep">至</span>
                <input v-model="fieldValues[field.id + '_end']" class="sf-input" type="date" />
              </div>
            </div>

            <!-- 多行文本 -->
            <div v-else-if="isTextarea(field.type)" class="sf-field">
              <div class="sf-label">
                <span v-if="field.required" class="sf-required">*</span>{{ field.label }}
              </div>
              <textarea
                v-model="fieldValues[field.id]"
                class="sf-textarea"
                rows="4"
                :placeholder="field.placeholder"
              ></textarea>
            </div>

            <!-- 金额 -->
            <div v-else-if="isAmount(field.type)" class="sf-field">
              <div class="sf-label">
                <span v-if="field.required" class="sf-required">*</span>{{ field.label }}
              </div>
              <div class="sf-amount">
                <span class="sf-amount-sym">¥</span>
                <input
                  v-model="fieldValues[field.id]"
                  class="sf-input sf-amount-input"
                  type="number"
                  min="0"
                  step="0.01"
                  :placeholder="field.placeholder || '0.00'"
                />
              </div>
            </div>

            <!-- 文件/图片 -->
            <div v-else-if="isFile(field.type)" class="sf-field">
              <div class="sf-label">
                <span v-if="field.required" class="sf-required">*</span>{{ field.label }}
              </div>
              <label class="sf-upload">
                <input type="file" :accept="field.type === '图片' ? 'image/*' : '*'" style="display:none" />
                <span class="sf-upload-btn">＋ 添加</span>
              </label>
            </div>

            <!-- 通用：文本 / 数字 / 日期 等 -->
            <div v-else class="sf-field">
              <div class="sf-label">
                <span v-if="field.required" class="sf-required">*</span>{{ field.label }}
              </div>
              <input
                v-model="fieldValues[field.id]"
                class="sf-input"
                :type="inputType(field.type)"
                :placeholder="field.placeholder"
              />
            </div>
          </template>

          <!-- 无字段提示 -->
          <div v-if="fields.length === 0" class="sf-explain">
            该审批模板暂未配置表单字段，直接提交即可。
          </div>
        </div>

        <!-- 流程节点 -->
        <div v-if="template.nodes && template.nodes.length" class="sf-flow">
          <div class="sf-flow-title">流程</div>
          <div
            v-for="(node, idx) in template.nodes"
            :key="node.id || idx"
            class="sf-flow-node"
            :class="{ 'sf-flow-node--approval': node.node_type === 'approval', 'sf-flow-node--cc': node.node_type === 'cc', 'sf-flow-node--active': idx === 0 }"
          >
            <div class="sf-flow-dot-wrap">
              <span class="sf-flow-dot" :class="node.node_type === 'cc' ? 'dot-cc' : 'dot-approval'"></span>
              <span v-if="idx < template.nodes.length - 1" class="sf-flow-line"></span>
            </div>
            <div class="sf-flow-node-body">
              <div class="sf-flow-node-inner" :class="{ active: idx === 0 }">
                <div class="sf-flow-node-info">
                  <span class="sf-flow-node-name">{{ node.node_name || (node.node_type === 'cc' ? '抄送人' : '审批人') }}</span>
                  <span class="sf-flow-node-sub">{{ nodeSubText(node) }}</span>
                </div>
                <div class="sf-flow-node-actions">
                  <div v-if="node.node_type === 'approval'" class="sf-flow-avatar">
                    <span>👤</span>
                  </div>
                  <button class="sf-flow-plus" type="button">＋</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="sf-error">{{ error }}</div>

        <!-- 底部操作 -->
        <div class="sf-actions">
          <button class="sf-submit-btn" type="button" :disabled="submitting" @click="submitApproval">
            {{ submitting ? '提交中…' : '提交' }}
          </button>
          <button class="sf-draft-btn" type="button" @click="router.back()">保存草稿</button>
          <label class="sf-sync-label">
            <input v-model="syncCalendar" type="checkbox" class="sf-sync-check" />
            通过后同步到我的日历
          </label>
        </div>
      </div>
    </template>

    <div v-else class="sf-loading">{{ error || '模板不存在' }}</div>
  </div>
</template>
