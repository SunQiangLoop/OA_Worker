<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authApi } from '../services/api'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = reactive({
  username: '',
  password: '',
})
const error = ref('')
const sliderValue = ref(0)
const sliderToken = ref('')
const sliderLoading = ref(false)

const sliderVerified = computed(() => Boolean(sliderToken.value))
const sliderText = computed(() => {
  if (sliderLoading.value) return '验证中...'
  return sliderVerified.value ? '验证通过' : '向右滑动完成验证'
})
const sliderStyle = computed(() => ({ '--slider-percent': `${sliderValue.value}%` }))

function resetSlider() {
  sliderValue.value = 0
  sliderToken.value = ''
}

async function handleSliderCommit() {
  const value = Number(sliderValue.value)
  if (value < 98) {
    resetSlider()
    return
  }
  if (sliderVerified.value) return
  sliderLoading.value = true
  error.value = ''
  try {
    const data = await authApi.sliderVerify({ value: 100 })
    sliderToken.value = data.slider_token
    sliderValue.value = 100
  } catch (err) {
    error.value = '滑块验证失败，请重试'
    resetSlider()
  } finally {
    sliderLoading.value = false
  }
}

function handleSliderInput() {
  if (sliderVerified.value) return
  if (sliderValue.value < 100) {
    sliderToken.value = ''
  }
}

async function submit() {
  error.value = ''
  if (!sliderVerified.value) {
    error.value = '请先完成滑块验证'
    return
  }
  try {
    await auth.login({ ...form, slider_token: sliderToken.value })
    const redirect = route.query.redirect || '/approvals'
    router.push(redirect)
  } catch (err) {
    error.value = auth.error || '登录失败，请检查账号密码'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-brand">
        <div class="brand-mark">
          <span class="brand-dot"></span>
        </div>
        <div>
          <div class="brand-name">WorkFlow</div>
          <div class="brand-sub">OA 审批平台</div>
        </div>
      </div>
      <div class="auth-hero">
        <div class="hero-pill">统一审批入口</div>
        <h1>让流程更清晰、更可靠</h1>
        <p>
          统一登录与审批流转，支持多业务流程接入，
          让协作更有序、更高效。
        </p>
        <div class="hero-grid">
          <div class="hero-card">
            <div class="hero-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3l7 4v5c0 4.4-3 7.4-7 9-4-1.6-7-4.6-7-9V7l7-4z" stroke="currentColor" stroke-width="1.6" />
                <path d="M9.5 12.5l2 2 3.5-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <div class="hero-card-title">安全访问</div>
              <div class="muted">多因子校验与权限隔离</div>
            </div>
          </div>
          <div class="hero-card">
            <div class="hero-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.6" />
                <rect x="14" y="4" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.6" />
                <rect x="3" y="13" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.6" />
                <rect x="14" y="13" width="7" height="7" rx="2" stroke="currentColor" stroke-width="1.6" />
              </svg>
            </div>
            <div>
              <div class="hero-card-title">流程扩展</div>
              <div class="muted">模块化能力快速编排</div>
            </div>
          </div>
          <div class="hero-card">
            <div class="hero-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 15c2.5-1.7 5.5-2.2 8.2-1.4 2 .6 3.6 2 5.8 3.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
                <path d="M4 8c2-1.2 4.5-1.5 6.8-.7 1.4.5 2.6 1.4 3.8 2.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </div>
            <div>
              <div class="hero-card-title">运行可视</div>
              <div class="muted">可观测与告警体系</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <form class="auth-card" @submit.prevent="submit">
        <div class="auth-title">登录</div>
        <div class="auth-sub">输入账号与密码进入系统</div>

        <label class="field">
          <span>账号</span>
          <input v-model="form.username" type="text" placeholder="admin" required />
        </label>

        <label class="field">
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="••••••" required />
        </label>

        <div class="slider-block" :class="{ verified: sliderVerified }" :style="sliderStyle">
          <div class="slider-label">滑块验证</div>
          <div class="slider-track">
            <div class="slider-text">{{ sliderText }}</div>
            <input
              class="slider-input"
              type="range"
              min="0"
              max="100"
              step="1"
              v-model.number="sliderValue"
              :disabled="sliderVerified || sliderLoading"
              @input="handleSliderInput"
              @change="handleSliderCommit"
              aria-label="滑块验证"
            />
          </div>
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <button class="btn btn-primary" type="submit" :disabled="auth.loading || !sliderVerified">
          {{ auth.loading ? '登录中...' : '登录' }}
        </button>

        <div class="muted auth-tip">默认管理员：admin / admin123</div>
      </form>
    </div>
  </div>
</template>
