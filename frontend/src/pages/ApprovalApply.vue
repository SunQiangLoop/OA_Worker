<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')

const categories = [
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

const categoryOptions = categories.map((c) => c.name)
const activeCategory = ref(categoryOptions[0])

const recommended = [
  { name: '费用报销', icon: '¥', color: '#22c55e' },
  { name: '采购申请', icon: '🧾', color: '#3b82f6' },
  { name: '付款申请', icon: '💳', color: '#06b6d4' },
  { name: '请假', icon: '🧑‍💼', color: '#2563eb' },
]

const filteredCategories = computed(() => {
  if (!keyword.value) return categories
  const kw = keyword.value.trim()
  if (!kw) return categories
  return categories
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

function openApply(item) {
  if (item?.name === '费用报销') {
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
