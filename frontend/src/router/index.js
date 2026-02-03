import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', redirect: '/approvals' },
  // 旧路由兼容重定向
  { path: '/tickets', redirect: '/approvals' },
  { path: '/tickets/:id', redirect: to => `/approvals/${to.params.id}` },
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/Login.vue'),
    meta: { layout: 'auth' },
  },
  {
    path: '/approvals',
    name: 'approvals',
    component: () => import('../pages/Approvals.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/approvals/apply',
    name: 'approval-apply',
    component: () => import('../pages/ApprovalApply.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/approvals/apply/expense',
    name: 'approval-apply-expense',
    component: () => import('../pages/ApprovalExpense.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/approvals/workflow/create',
    name: 'approval-workflow-create',
    component: () => import('../pages/WorkflowBuilder.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/approvals/:id',
    name: 'approval-detail',
    component: () => import('../pages/ApprovalDetail.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/organization',
    name: 'organization',
    component: () => import('../pages/Organization.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../pages/NotFound.vue'),
    meta: { layout: 'auth' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const isAuthed = auth.isAuthenticated

  if (to.path === '/approvals' && to.query.tab === 'apply') {
    return { name: 'approval-apply' }
  }

  if (to.meta.requiresAuth && !isAuthed) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && isAuthed) {
    return { name: 'approvals' }
  }
})

export default router
