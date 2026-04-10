import { defineStore } from 'pinia'
import { authApi, clearTokens, getTokens, setTokens } from '../services/api'

// 初始化时从 localStorage 读取 token
const initialTokens = getTokens()

// 可切换的工作流角色
const workflowRoles = [
  { key: 'applicant', label: '发起人', desc: '提交审批申请' },
  { key: 'dept_manager', label: '部门经理', desc: '部门级审批' },
  { key: 'finance', label: '财务', desc: '财务审核' },
  { key: 'gm', label: '总经理', desc: '最终审批' },
]

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    // 将 token 存储在响应式 state 中，使 isAuthenticated 成为响应式
    accessToken: initialTokens.access || null,
    // 当前模拟角色
    currentRole: localStorage.getItem('oa_current_role') || 'applicant',
  }),
  getters: {
    isAuthenticated: (state) => {
      return Boolean(state.accessToken)
    },
    isAdmin: (state) => {
      if (!state.user) return false
      if (state.user.is_admin) return true
      if (state.user.username === 'admin') return true
      const roles = state.user.roles || []
      return roles.includes('admin')
    },
    workflowRoles: () => workflowRoles,
    currentRoleInfo: (state) => {
      return workflowRoles.find((r) => r.key === state.currentRole) || workflowRoles[0]
    },
  },
  actions: {
    async login(payload) {
      this.loading = true
      this.error = null
      try {
        const data = await authApi.login(payload)
        setTokens(data.access_token, data.refresh_token)
        // 同步更新响应式 state
        this.accessToken = data.access_token
        await this.fetchMe()
        return data
      } catch (err) {
        this.error = err?.response?.data?.message || '登录失败'
        throw err
      } finally {
        this.loading = false
      }
    },
    async fetchMe() {
      try {
        this.user = await authApi.me()
      } catch {
        this.user = null
      }
    },
    async logout() {
      try {
        const { refresh } = getTokens()
        if (refresh) {
          await authApi.logout({ refresh_token: refresh })
        }
      } finally {
        clearTokens()
        this.user = null
        // 同步更新响应式 state
        this.accessToken = null
      }
    },
    switchRole(roleKey) {
      this.currentRole = roleKey
      localStorage.setItem('oa_current_role', roleKey)
    },
  },
})
