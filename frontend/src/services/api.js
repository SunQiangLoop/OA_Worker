import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const tokenKeys = {
  access: 'oa_access_token',
  refresh: 'oa_refresh_token',
}

const api = axios.create({
  baseURL,
  timeout: 15000,
})

const raw = axios.create({
  baseURL,
  timeout: 15000,
})

const tokenStore = {
  getAccess() {
    return localStorage.getItem(tokenKeys.access)
  },
  getRefresh() {
    return localStorage.getItem(tokenKeys.refresh)
  },
  set(access, refresh) {
    if (access) localStorage.setItem(tokenKeys.access, access)
    if (refresh) localStorage.setItem(tokenKeys.refresh, refresh)
  },
  clear() {
    localStorage.removeItem(tokenKeys.access)
    localStorage.removeItem(tokenKeys.refresh)
  },
}

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      const refreshToken = tokenStore.getRefresh()
      if (!refreshToken) {
        tokenStore.clear()
        return Promise.reject(error)
      }

      original._retry = true
      try {
        if (!refreshPromise) {
          refreshPromise = raw.post('/api/v1/auth/refresh', {
            refresh_token: refreshToken,
          })
        }
        const resp = await refreshPromise
        refreshPromise = null

        const payload = unwrap(resp)
        tokenStore.set(payload.access_token, payload.refresh_token)
        original.headers.Authorization = `Bearer ${payload.access_token}`
        return api(original)
      } catch (err) {
        refreshPromise = null
        tokenStore.clear()
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

function unwrap(resp) {
  if (resp?.data?.data) return resp.data.data
  return resp.data
}

export const authApi = {
  sliderVerify(payload) {
    return raw.post('/api/v1/auth/slider/verify', payload).then(unwrap)
  },
  login(payload) {
    return api.post('/api/v1/auth/login', payload).then(unwrap)
  },
  refresh(payload) {
    return api.post('/api/v1/auth/refresh', payload).then(unwrap)
  },
  logout(payload) {
    return api.post('/api/v1/auth/logout', payload).then(unwrap)
  },
  me() {
    return api.get('/api/v1/users/me').then(unwrap)
  },
}

export const approvalApi = {
  list(params) {
    return api.get('/api/v1/tickets', { params }).then(unwrap)
  },
  get(id) {
    return api.get(`/api/v1/tickets/${id}`).then(unwrap)
  },
  create(payload) {
    return api.post('/api/v1/tickets', payload).then(unwrap)
  },
  update(id, payload) {
    return api.patch(`/api/v1/tickets/${id}`, payload).then(unwrap)
  },
  approve(id, payload) {
    return api.patch(`/api/v1/tickets/${id}`, { status: 'approved', ...payload }).then(unwrap)
  },
  reject(id, payload) {
    return api.patch(`/api/v1/tickets/${id}`, { status: 'rejected', ...payload }).then(unwrap)
  },
  revoke(id) {
    return api.patch(`/api/v1/tickets/${id}`, { status: 'pending' }).then(unwrap)
  },
}

// 保留旧的 ticketApi 以兼容
export const ticketApi = approvalApi

// 组织架构 API
export const orgApi = {
  getDepartments() {
    return api.get('/api/v1/departments').then(unwrap)
  },
  getDepartmentUsers(deptId) {
    return api.get(`/api/v1/departments/${deptId}/users`).then(unwrap)
  },
  getUsers(params) {
    return api.get('/api/v1/users', { params }).then(unwrap)
  },
  createDepartment(payload) {
    return api.post('/api/v1/departments', payload).then(unwrap)
  },
  updateDepartment(id, payload) {
    return api.patch(`/api/v1/departments/${id}`, payload).then(unwrap)
  },
  deleteDepartment(id) {
    return api.delete(`/api/v1/departments/${id}`).then(unwrap)
  },
  createUser(payload) {
    return api.post('/api/v1/users', payload).then(unwrap)
  },
  updateUser(id, payload) {
    return api.patch(`/api/v1/users/${id}`, payload).then(unwrap)
  },
  deleteUser(id) {
    return api.delete(`/api/v1/users/${id}`).then(unwrap)
  },
}

export function setTokens(access, refresh) {
  tokenStore.set(access, refresh)
}

export function clearTokens() {
  tokenStore.clear()
}

export function getTokens() {
  return {
    access: tokenStore.getAccess(),
    refresh: tokenStore.getRefresh(),
  }
}
