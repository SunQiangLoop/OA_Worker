import { defineStore } from 'pinia'
import { authApi, clearTokens, getTokens, setTokens } from '../services/api'

// 初始化时从 localStorage 读取 token
const initialTokens = getTokens()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
    // 将 token 存储在响应式 state 中，使 isAuthenticated 成为响应式
    accessToken: initialTokens.access || null,
  }),
  getters: {
    isAuthenticated: (state) => {
      return Boolean(state.accessToken)
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
  },
})
