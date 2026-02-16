<script setup>
import { ref, onMounted } from 'vue'
import { workApi } from '../services/api'

const works = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)
const showUpload = ref(false)

// Upload form state
const form = ref({ title: '', description: '', tags: '' })
const zipFile = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')

async function fetchWorks() {
  loading.value = true
  try {
    const data = await workApi.list({ page: page.value, size: 20 })
    works.value = data.items || []
    total.value = data.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function onFileSelect(e) {
  const file = e.target.files?.[0]
  if (file) zipFile.value = file
}

function onDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (file && file.name.endsWith('.zip')) {
    zipFile.value = file
  }
}

async function handleUpload() {
  if (!form.value.title || !zipFile.value) return
  uploading.value = true
  uploadError.value = ''
  uploadProgress.value = 0

  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('description', form.value.description)
  fd.append('tags', form.value.tags)
  fd.append('file', zipFile.value)

  try {
    await workApi.upload(fd, (e) => {
      if (e.total) uploadProgress.value = Math.round((e.loaded / e.total) * 100)
    })
    showUpload.value = false
    form.value = { title: '', description: '', tags: '' }
    zipFile.value = null
    uploadProgress.value = 0
    fetchWorks()
  } catch (e) {
    uploadError.value = e.response?.data?.message || '上传失败'
  } finally {
    uploading.value = false
  }
}

async function handleDelete(id) {
  if (!confirm('确定要删除这个作品吗？相关文件将被永久删除。')) return
  try {
    await workApi.delete(id)
    fetchWorks()
  } catch (e) {
    alert('删除失败: ' + (e.response?.data?.message || e.message))
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('zh-CN')
}

onMounted(fetchWorks)
</script>

<template>
  <div class="admin-works">
    <div class="page-header">
      <h1>作品管理</h1>
      <button class="btn btn-primary" @click="showUpload = true">上传作品</button>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>

    <table v-else class="works-table">
      <thead>
        <tr>
          <th>标题</th>
          <th>Slug</th>
          <th>文件数</th>
          <th>大小</th>
          <th>日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="works.length === 0">
          <td colspan="6" class="empty-row">暂无作品</td>
        </tr>
        <tr v-for="w in works" :key="w.id">
          <td class="title-cell">{{ w.title }}</td>
          <td><code>{{ w.slug }}</code></td>
          <td>{{ w.file_count }}</td>
          <td>{{ formatSize(w.total_size) }}</td>
          <td>{{ formatDate(w.created_at) }}</td>
          <td>
            <a :href="'/portfolio/' + w.slug" target="_blank" class="action-link">预览</a>
            <button class="action-delete" @click="handleDelete(w.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Upload Dialog -->
    <div v-if="showUpload" class="modal-backdrop" @click.self="showUpload = false">
      <div class="modal">
        <div class="modal-header">
          <h2>上传作品</h2>
          <button class="close-btn" @click="showUpload = false">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>标题 *</label>
            <input v-model="form.title" type="text" placeholder="作品标题" />
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="form.description" rows="3" placeholder="简短描述"></textarea>
          </div>
          <div class="form-group">
            <label>标签（逗号分隔）</label>
            <input v-model="form.tags" type="text" placeholder="HTML, CSS, JavaScript" />
          </div>
          <div
            class="drop-zone"
            :class="{ 'has-file': zipFile }"
            @dragover.prevent
            @drop="onDrop"
          >
            <div v-if="zipFile" class="file-info">
              <span>{{ zipFile.name }}</span>
              <span class="file-size">{{ formatSize(zipFile.size) }}</span>
              <button class="remove-file" @click="zipFile = null">&times;</button>
            </div>
            <div v-else class="drop-hint">
              <p>拖拽 ZIP 文件到此处，或</p>
              <label class="file-label">
                选择文件
                <input type="file" accept=".zip" @change="onFileSelect" hidden />
              </label>
            </div>
          </div>
          <div v-if="uploading" class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            <span class="progress-text">{{ uploadProgress }}%</span>
          </div>
          <div v-if="uploadError" class="error-msg">{{ uploadError }}</div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" @click="showUpload = false">取消</button>
          <button
            class="btn btn-primary"
            :disabled="!form.title || !zipFile || uploading"
            @click="handleUpload"
          >
            {{ uploading ? '上传中...' : '上传' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-works {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
}
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}
.btn {
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-primary:hover {
  background: #1d4ed8;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: default;
}
.btn-ghost {
  background: none;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.works-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.works-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}
.works-table td {
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid #f1f5f9;
}
.title-cell {
  font-weight: 500;
}
.empty-row {
  text-align: center;
  color: #94a3b8;
  padding: 40px 16px !important;
}
code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.action-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 13px;
  margin-right: 12px;
}
.action-delete {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  border-radius: 16px;
  width: 520px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}
.modal-header h2 {
  font-size: 18px;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #94a3b8;
  line-height: 1;
}
.modal-body {
  padding: 20px 24px;
}
.modal-footer {
  padding: 0 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 6px;
}
.form-group input, .form-group textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
}
.form-group textarea {
  resize: vertical;
}

.drop-zone {
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: border-color 0.2s;
  margin-bottom: 16px;
}
.drop-zone:hover, .drop-zone.has-file {
  border-color: #2563eb;
}
.drop-hint p {
  color: #94a3b8;
  margin: 0 0 8px;
}
.file-label {
  color: #2563eb;
  cursor: pointer;
  font-weight: 500;
}
.file-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.file-size {
  color: #94a3b8;
  font-size: 13px;
}
.remove-file {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 18px;
  cursor: pointer;
}

.progress-bar {
  position: relative;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}
.progress-fill {
  height: 100%;
  background: #2563eb;
  transition: width 0.3s;
  border-radius: 4px;
}
.progress-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: #64748b;
}
.error-msg {
  color: #ef4444;
  font-size: 13px;
}
</style>
