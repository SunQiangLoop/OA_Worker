<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { workApi } from '../services/api'

const route = useRoute()
const router = useRouter()
const work = ref(null)
const loading = ref(true)
const isFullscreen = ref(false)

const slug = computed(() => route.params.slug)
const previewUrl = computed(() => workApi.previewUrl(slug.value))

async function fetchWork() {
  try {
    work.value = await workApi.get(slug.value)
  } catch (e) {
    console.error('Failed to load work:', e)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/portfolio')
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
}

onMounted(fetchWork)
</script>

<template>
  <div class="preview-page" :class="{ fullscreen: isFullscreen }">
    <div class="preview-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn" @click="goBack" title="返回">
          ← 返回
        </button>
        <h2 v-if="work" class="toolbar-title">{{ work.title }}</h2>
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn" @click="copyLink" title="复制链接">
          🔗 分享
        </button>
        <button class="toolbar-btn" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="preview-loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <iframe
      v-else
      :src="previewUrl"
      class="preview-frame"
      sandbox="allow-scripts allow-same-origin"
      allow="fullscreen"
    ></iframe>
  </div>
</template>

<style scoped>
.preview-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  background: #f1f5f9;
}
.preview-page.fullscreen {
  position: fixed;
  inset: 0;
  z-index: 1000;
  height: 100vh;
  background: #fff;
}
.preview-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  min-height: 48px;
  flex-shrink: 0;
}
.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.toolbar-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}
.toolbar-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  color: #475569;
  transition: all 0.15s;
  white-space: nowrap;
}
.toolbar-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}
.preview-loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #94a3b8;
}
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.preview-frame {
  flex: 1;
  border: none;
  width: 100%;
  background: #fff;
}
</style>
