<script setup>
import { ref, onMounted } from 'vue'
import { orgApi } from '../services/api'

const departments = ref([])
const selectedDept = ref(null)
const users = ref([])
const loading = ref(true)
const loadingUsers = ref(false)
const expandedDepts = ref(new Set())

onMounted(async () => {
  await loadDepartments()
})

async function loadDepartments() {
  loading.value = true
  try {
    departments.value = await orgApi.getDepartments()
    if (departments.value.length > 0) {
      selectDepartment(departments.value[0])
      departments.value.forEach(d => expandedDepts.value.add(d.id))
    }
  } catch (err) {
    console.error('加载部门失败:', err)
  } finally {
    loading.value = false
  }
}

async function selectDepartment(dept) {
  selectedDept.value = dept
  loadingUsers.value = true
  try {
    users.value = await orgApi.getDepartmentUsers(dept.id)
  } catch (err) {
    console.error('加载人员失败:', err)
    users.value = []
  } finally {
    loadingUsers.value = false
  }
}

function toggleExpand(deptId) {
  if (expandedDepts.value.has(deptId)) {
    expandedDepts.value.delete(deptId)
  } else {
    expandedDepts.value.add(deptId)
  }
}

function isExpanded(deptId) {
  return expandedDepts.value.has(deptId)
}

function getPositionClass(position) {
  if (position === '总经理') return 'position-gm'
  if (position === '部门经理') return 'position-manager'
  if (position === '会计' || position === '出纳') return 'position-finance'
  return 'position-staff'
}

function getAvatar(username) {
  return username ? username.charAt(0) : '?'
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <div>
        <div class="page-eyebrow">组织</div>
        <h2>组织架构</h2>
        <p class="page-subtitle">公司部门和人员信息，用于审批流程中选择审批人。</p>
      </div>
    </div>

    <div class="org-grid" v-if="!loading">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">部门列表</div>
            <div class="muted">{{ departments.length }} 个部门</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="tree">
            <div v-for="dept in departments" :key="dept.id" class="tree-node">
              <div
                class="tree-item"
                :class="{ active: selectedDept?.id === dept.id }"
                @click="selectDepartment(dept)"
              >
                <button
                  class="tree-toggle"
                  :class="{ expanded: isExpanded(dept.id) }"
                  @click.stop="toggleExpand(dept.id)"
                  v-if="dept.children && dept.children.length > 0"
                  type="button"
                >
                  <span></span>
                </button>
                <span class="tree-label">{{ dept.name }}</span>
                <span class="tree-meta" v-if="dept.manager">{{ dept.manager.username }}</span>
              </div>
              <div
                v-if="dept.children && dept.children.length > 0 && isExpanded(dept.id)"
                class="tree-children"
              >
                <div
                  v-for="child in dept.children"
                  :key="child.id"
                  class="tree-item child"
                  :class="{ active: selectedDept?.id === child.id }"
                  @click="selectDepartment(child)"
                >
                  <span class="tree-label">{{ child.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="panel panel-large">
        <div class="panel-header" v-if="selectedDept">
          <div>
            <div class="panel-title">{{ selectedDept.name }}</div>
            <div class="muted">{{ users.length }} 位成员</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="user-list" v-if="!loadingUsers">
            <div v-for="user in users" :key="user.id" class="user-card">
              <div class="user-avatar" :class="getPositionClass(user.position)">
                {{ getAvatar(user.username) }}
              </div>
              <div class="user-info">
                <div class="user-name">{{ user.username }}</div>
                <div class="user-position">{{ user.position || '员工' }}</div>
              </div>
              <div class="user-email">{{ user.email }}</div>
            </div>

            <div v-if="users.length === 0" class="empty">该部门暂无成员</div>
          </div>

          <div v-else class="loading-inline">
            <div class="spinner"></div>
            <p>加载中...</p>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="empty">加载组织架构...</div>
  </div>
</template>

<style scoped>
.org-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.tree {
  display: grid;
  gap: 8px;
}

.tree-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tree-item:hover {
  background: var(--shell-primary-soft);
}

.tree-item.active {
  background: var(--shell-primary);
  color: #fff;
}

.tree-item.active .tree-meta {
  color: rgba(255, 255, 255, 0.8);
}

.tree-label {
  flex: 1;
  font-weight: 600;
}

.tree-meta {
  font-size: 12px;
  color: var(--shell-muted);
}

.tree-children {
  margin-left: 18px;
  padding-left: 12px;
  border-left: 1px solid var(--shell-border);
  display: grid;
  gap: 6px;
}

.tree-item.child {
  padding-left: 16px;
}

.tree-toggle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--shell-border);
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.tree-toggle span {
  width: 6px;
  height: 6px;
  border-right: 2px solid var(--shell-muted);
  border-bottom: 2px solid var(--shell-muted);
  transform: rotate(-45deg);
  transition: transform 0.2s ease;
}

.tree-toggle.expanded span {
  transform: rotate(45deg);
}

.user-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.user-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8f9fb;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-weight: 700;
  color: #fff;
}

.position-gm {
  background: #f59e0b;
}

.position-manager {
  background: #3b82f6;
}

.position-finance {
  background: #10b981;
}

.position-staff {
  background: #6366f1;
}

.user-name {
  font-weight: 600;
}

.user-position {
  font-size: 12px;
  color: var(--shell-muted);
}

.user-email {
  font-size: 12px;
  color: var(--shell-muted);
}

.loading-inline {
  display: grid;
  place-items: center;
  gap: 8px;
}

@media (max-width: 1024px) {
  .org-grid {
    grid-template-columns: 1fr;
  }
}
</style>
