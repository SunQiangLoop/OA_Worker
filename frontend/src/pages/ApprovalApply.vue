<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { workflowApi } from '../services/api'

const router = useRouter()
const keyword = ref('')

const baseCategories = [
  {
    name: '财务',
    items: [
      { name: '费用报销', icon: '¥', color: '#22c55e' },
      { name: '采购申请', icon: '🧾', color: '#3b82f6' },
      { name: '付款申请', icon: '💳', color: '#06b6d4' },
      { name: '备用金申请', icon: '💼', color: '#2563eb' },
    ],
  },
  {
    name: '出勤',
    items: [
      { name: '请假', icon: '🧑‍💼', color: '#2563eb' },
      { name: '加班', icon: '⏱️', color: '#4f46e5' },
      { name: '出差申请', icon: '✈️', color: '#0ea5e9' },
      { name: '外出', icon: '🚗', color: '#38bdf8' },
    ],
  },
  {
    name: '人事',
    items: [
      { name: '离职', icon: '👤', color: '#ef4444' },
      { name: '招聘需求', icon: '🔎', color: '#2563eb' },
    ],
  },
  {
    name: '行政',
    items: [
      { name: '物品领用', icon: '📦', color: '#f97316' },
      { name: '用章申请', icon: '📄', color: '#2563eb' },
    ],
  },
]

const recommended = [
  { name: '费用报销', icon: '¥', color: '#22c55e' },
  { name: '采购申请', icon: '🧾', color: '#3b82f6' },
  { name: '付款申请', icon: '💳', color: '#06b6d4' },
  { name: '请假', icon: '🧑‍💼', color: '#2563eb' },
]

// 从后端加载的模板列表
const remoteTemplates = ref([])

onMounted(async () => {
  try {
    const res = await workflowApi.listTemplates({ active: 'true' })
    remoteTemplates.value = Array.isArray(res?.items) ? res.items : []
  } catch {
    remoteTemplates.value = []
  }
})

const categories = computed(() => {
  const merged = baseCategories.map((cat) => ({ ...cat, items: [...cat.items] }))
  remoteTemplates.value.forEach((tpl) => {
    const target = merged.find((cat) => cat.name === tpl.category)
    const item = { name: tpl.name, icon: tpl.icon || '📋', color: tpl.color || '#6366f1', id: tpl.id }
    if (target) {
      if (!target.items.some((i) => i.name === item.name)) target.items.unshift(item)
    } else {
      const existing = merged.find((cat) => cat.name === (tpl.category || '其他'))
      if (existing) {
        if (!existing.items.some((i) => i.name === item.name)) existing.items.unshift(item)
      } else {
        merged.push({ name: tpl.category || '其他', items: [item] })
      }
    }
  })
  return merged
})

const categoryOptions = computed(() => categories.value.map((c) => c.name))
const activeCategory = ref(categoryOptions.value[0])

const filteredCategories = computed(() => {
  if (!keyword.value) return categories.value
  const kw = keyword.value.trim()
  if (!kw) return categories.value
  return categories.value
    .map((cat) => {
      const items = cat.items.filter((item) => item.name.includes(kw))
      return { ...cat, items }
    })
    .filter((cat) => cat.items.length > 0)
})

const activeCategoryData = computed(() => {
  const found = filteredCategories.value.find((cat) => cat.name === activeCategory.value)
  return found || filteredCategories.value[0]
})

watch(
  categoryOptions,
  (opts) => {
    if (!opts.includes(activeCategory.value)) {
      activeCategory.value = opts[0]
    }
  },
  { immediate: true }
)

function openApply(item) {
  if (!item) return
  // 后端创建的自定义模板，跳到通用表单页
  if (item.id) {
    router.push(`/approvals/apply/template/${item.id}`)
    return
  }
  // 内置审批
  if (item.name === '费用报销') {
    router.push('/approvals/apply/expense')
  }
}
</script>

<template>
  <div class="page apply-page">
    <div class="apply-header">
      <div>
        <h2>发起申请</h2>
        <p class="page-subtitle">选择审批表单并开始申请流程</p>
      </div>
      <div class="apply-search">
        <span class="icon-search"></span>
        <input v-model="keyword" type="text" placeholder="请输入申请名称" />
      </div>
    </div>

    <section class="panel apply-panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">推荐使用</div>
          <div class="muted">高频审批快速入口</div>
        </div>
      </div>
      <div class="panel-body">
        <div class="apply-card-grid">
          <button
            v-for="item in recommended"
            :key="item.name"
            class="apply-card"
            type="button"
            @click="openApply(item)"
          >
            <span class="apply-icon" :style="{ background: item.color }">{{ item.icon }}</span>
            <span class="apply-name">{{ item.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <section class="panel apply-panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">全部申请</div>
          <div class="muted">按分类选择所需审批表单</div>
        </div>
      </div>
      <div class="panel-body apply-body">
        <div class="apply-categories">
          <button
            v-for="cat in categoryOptions"
            :key="cat"
            class="category-item"
            :class="{ active: cat === activeCategory }"
            type="button"
            @click="activeCategory = cat"
          >
            <span>{{ cat }}</span>
            <span class="category-arrow">›</span>
          </button>
        </div>
        <div class="apply-content">
          <div v-if="activeCategoryData" class="apply-section">
            <div class="section-title">{{ activeCategoryData.name }}</div>
            <div class="apply-card-grid">
              <button
                v-for="item in activeCategoryData.items"
                :key="item.name"
                class="apply-card"
                type="button"
                @click="openApply(item)"
              >
                <span class="apply-icon" :style="{ background: item.color }">{{ item.icon }}</span>
                <span class="apply-name">{{ item.name }}</span>
              </button>
            </div>
          </div>
          <div v-else class="empty">暂无匹配的申请</div>
        </div>
      </div>
    </section>
  </div>
</template>
