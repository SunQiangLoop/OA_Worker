<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { workApi } from '../services/api'

const router = useRouter()
const works = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)

async function fetchWorks() {
  loading.value = true
  try {
    const data = await workApi.list({ page: page.value, size: 12 })
    works.value = data.items || []
    total.value = data.total || 0
  } catch (e) {
    console.error('Failed to load works:', e)
  } finally {
    loading.value = false
  }
}

function openWork(slug) {
  router.push(`/portfolio/${slug}`)
}

function parseTags(tags) {
  if (!tags) return []
  return tags.split(',').map(t => t.trim()).filter(Boolean)
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function copyLink(slug) {
  const url = `${window.location.origin}/portfolio/${slug}`
  navigator.clipboard.writeText(url)
}

onMounted(fetchWorks)
</script>

<template>
  <div class="portfolio-page">
    <div class="portfolio-header">
      <h1>作品集</h1>
      <p class="portfolio-desc">浏览所有已发布的前端作品，点击卡片查看在线预览</p>
    </div>

    <div v-if="loading" class="portfolio-loading">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-else-if="works.length === 0" class="portfolio-empty">
      <div class="empty-icon">📂</div>
      <p>暂无作品</p>
    </div>

    <div v-else class="portfolio-grid">
      <div
        v-for="work in works"
        :key="work.id"
        class="work-card"
        @click="openWork(work.slug)"
      >
        <div class="work-cover">
          <iframe
            v-if="!work.cover_url"
            :src="workApi.previewUrl(work.slug)"
            class="work-thumb"
            sandbox="allow-scripts"
            loading="lazy"
            tabindex="-1"
          ></iframe>
          <img v-else :src="work.cover_url" :alt="work.title" />
          <div class="work-overlay">
            <span class="view-btn">查看作品</span>
          </div>
        </div>
        <div class="work-info">
          <h3 class="work-title">{{ work.title }}</h3>
          <p v-if="work.description" class="work-desc">{{ work.description }}</p>
          <div class="work-meta">
            <div class="work-tags">
              <span v-for="tag in parseTags(work.tags)" :key="tag" class="tag">{{ tag }}</span>
            </div>
            <div class="work-stats">
              <span>{{ work.file_count }} 文件</span>
              <span>{{ formatSize(work.total_size) }}</span>
            </div>
          </div>
          <div class="work-actions">
            <button class="share-btn" @click.stop="copyLink(work.slug)" title="复制链接">
              🔗 分享
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="total > 12" class="portfolio-pagination">
      <button :disabled="page <= 1" @click="page--; fetchWorks()">上一页</button>
      <span>第 {{ page }} 页</span>
      <button :disabled="page * 12 >= total" @click="page++; fetchWorks()">下一页</button>
    </div>
  </div>
</template>

<style scoped>
.portfolio-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}
.portfolio-header {
  margin-bottom: 32px;
}
.portfolio-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
}
.portfolio-desc {
  color: #64748b;
  font-size: 15px;
  margin: 0;
}
.portfolio-loading {
  text-align: center;
  padding: 80px 0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
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
.portfolio-empty {
  text-align: center;
  padding: 80px 0;
  color: #94a3b8;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 960px) {
  .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .portfolio-grid { grid-template-columns: 1fr; }
}

.work-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.work-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.work-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.work-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.work-thumb {
  width: 200%;
  height: 200%;
  transform: scale(0.5);
  transform-origin: top left;
  border: none;
  pointer-events: none;
}
.work-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.work-card:hover .work-overlay {
  opacity: 1;
}
.view-btn {
  color: #fff;
  background: #2563eb;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}
.work-info {
  padding: 16px;
}
.work-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.work-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.work-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}
.work-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}
.tag {
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}
.work-stats {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
}
.work-actions {
  display: flex;
  justify-content: flex-end;
}
.share-btn {
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #64748b;
  transition: border-color 0.2s;
}
.share-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}
.portfolio-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}
.portfolio-pagination button {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}
.portfolio-pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
