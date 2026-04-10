<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const userLabel = computed(() => auth.user?.username || '未登录')
const showRoleMenu = ref(false)

function toggleRoleMenu() {
  showRoleMenu.value = !showRoleMenu.value
}

function selectRole(roleKey) {
  auth.switchRole(roleKey)
  showRoleMenu.value = false
}

function closeRoleMenu(e) {
  if (showRoleMenu.value) {
    showRoleMenu.value = false
  }
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

onMounted(() => {
  if (auth.isAuthenticated && !auth.user) {
    auth.fetchMe()
  }
  document.addEventListener('click', closeRoleMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeRoleMenu)
})

const navGroups = computed(() => {
  const base = [
    {
      title: '审批',
      items: [
        { name: '发起申请', to: '/approvals/apply' },
        { name: '审批中心', to: '/approvals' },
      ],
    },
  ]
  if (auth.isAdmin) {
    base.push({
      title: '管理后台',
      items: [
        { name: '组织架构', to: '/organization' },
      ],
    })
  }
  return base
})

function isActive(item) {
  const [base, query] = item.to.split('?')
  if (query) {
    if (!route.path.startsWith(base)) return false
  } else if (route.path !== base) {
    return false
  }
  if (!query) return !route.query.tab
  const params = new URLSearchParams(query)
  if (params.has('tab')) {
    return route.query.tab === params.get('tab')
  }
  return true
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">
          <span class="brand-icon"></span>
        </div>
        <div>
          <div class="brand-name">WorkFlow</div>
          <div class="brand-sub">OA 审批平台</div>
        </div>
      </div>

      <nav class="nav">
        <div v-for="group in navGroups" :key="group.title" class="nav-group">
          <div class="nav-title">{{ group.title }}</div>
          <RouterLink
            v-for="item in group.items"
            :key="item.name"
            class="nav-link"
            :class="{ active: isActive(item) }"
            :to="item.to"
          >
            <span class="nav-icon"></span>
            <span>{{ item.name }}</span>
          </RouterLink>
        </div>
      </nav>

      <div class="sidebar-foot">
        <div class="badge">v2.1</div>
        <div class="muted">安全 · 可靠 · 可扩展</div>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="topbar-left">
          <button class="icon-btn" type="button" aria-label="menu">
            <span class="icon-bars"><span></span></span>
          </button>
          <div class="search">
            <span class="icon-search"></span>
            <input type="text" placeholder="输入要搜索内容" />
          </div>
        </div>
        <div class="topbar-actions">
          <div class="role-switcher" @click.stop>
            <button class="role-switcher-btn" @click="toggleRoleMenu" title="切换角色">
              <span class="role-switcher-icon">&#8645;</span>
              <span class="role-switcher-label">{{ auth.currentRoleInfo.label }}</span>
            </button>
            <div v-if="showRoleMenu" class="role-menu">
              <div class="role-menu-title">切换审批角色</div>
              <button
                v-for="role in auth.workflowRoles"
                :key="role.key"
                class="role-menu-item"
                :class="{ active: auth.currentRole === role.key }"
                @click="selectRole(role.key)"
              >
                <span class="role-menu-dot" :class="'role-' + role.key"></span>
                <div>
                  <div class="role-menu-name">{{ role.label }}</div>
                  <div class="role-menu-desc">{{ role.desc }}</div>
                </div>
                <span v-if="auth.currentRole === role.key" class="role-menu-check">&#10003;</span>
              </button>
            </div>
          </div>
          <button class="icon-btn" type="button" aria-label="help">
            <span class="icon-help"></span>
          </button>
          <div class="user-chip">
            <span class="user-dot"></span>
            <div>
              <div class="user-name">{{ userLabel }}</div>
              <div class="user-role">{{ auth.currentRoleInfo.label }}</div>
            </div>
          </div>
          <button class="btn btn-ghost" type="button" @click="handleLogout">
            退出
          </button>
        </div>
      </header>

      <main class="content">
        <slot />
      </main>
    </div>
  </div>
</template>
