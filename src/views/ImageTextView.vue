<template>
  <div class="image-text-view">
    <ParticleEffect />
    <LogoHeader />
    <BottomNavbar />
    
    <!-- 筛选和搜索区域 -->
    <div class="filter-section">
      <div class="filter-container">
        <div class="filter-left">
          <div class="type-select-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="select-icon">
              <path d="M3 5H21L13 12V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V12L3 5Z" fill="currentColor"/>
            </svg>
            <select v-model="selectedType" @change="loadImages" class="type-select">
              <option value="">全部类型</option>
              <option v-for="type in types" :key="type.id" :value="type.type">
                {{ type.type }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="filter-right">
          <div class="search-box">
            <span class="search-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </span>
            <input
              v-model="keyword"
              @input="debounceSearch"
              type="text"
              class="search-input"
              placeholder="搜索图片组名..."
            />
            <button v-if="keyword" class="clear-btn" @click="clearSearch" title="清空">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">
            <span class="title-icon">📸</span>
            安全讲堂
          </h1>
          <p class="page-subtitle">图文并茂的安全知识讲解</p>
        </div>
        <div class="header-right">
          <span class="image-count-badge">
            <span class="count-dot"></span>
            {{ imageList.length }} 个图文
          </span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载图文内容...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="imageList.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p>暂无图文内容</p>
      </div>
      
      <!-- 图片列表 -->
      <div v-else class="image-grid">
        <div 
          v-for="image in imageList" 
          :key="image.id" 
          class="image-card" 
          @click="viewImageDetail(image)"
        >
          <div class="card-glow"></div>
          <div class="image-wrapper">
            <img 
              :src="getFullUrl(image.coverPath)" 
              :alt="image.description" 
              @error="handleImageError"
              loading="lazy"
            />
            <div class="image-overlay">
              <span class="view-text">查看详情</span>
            </div>
          </div>
          <div class="image-info">
            <h4>{{ image.imageGroup }}</h4>
            <p>{{ image.description || '暂无描述' }}</p>
            <div class="image-meta">
              <span class="image-type">{{ image.imageType }}</span>
              <span class="image-date">{{ formatDate(image.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 详情弹窗 -->
    <div v-if="showDetail" class="detail-modal" @click.self="closeDetail">
      <div class="detail-content">
        <button class="close-btn" @click="closeDetail" title="关闭">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div v-if="detailLoading" class="detail-loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>
        
        <div v-else-if="currentImage" class="detail-body">
          <div class="detail-image-wrapper">
            <img 
              :src="getFullUrl(currentImage.imagePath)" 
              :alt="currentImage.description"
              @error="handleImageError"
            />
          </div>
          
          <div class="detail-info">
            <h2>{{ currentImage.imageGroup }}</h2>
            <div class="detail-meta">
              <span class="detail-type">{{ currentImage.imageType }}</span>
              <span class="detail-date">{{ formatDate(currentImage.created_at) }}</span>
            </div>
            <div 
              class="detail-description markdown-body" 
              v-html="renderedDescription"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import ParticleEffect from '@/components/ParticleEffect.vue'
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import { getImageTextTypes, getImageTextList, getImageTextDetail } from '@/api'

// 数据状态
const types = ref<any[]>([])
const imageList = ref<any[]>([])
const selectedType = ref('')
const keyword = ref('')
const loading = ref(false)
const searchTimer = ref<number | null>(null)

// 详情弹窗状态
const showDetail = ref(false)
const currentImage = ref<any>(null)
const detailLoading = ref(false)

// 配置 marked 启用代码高亮
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }: { text: string; lang?: string }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  try {
    const highlighted = hljs.highlight(text, { language }).value
    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
  } catch (err) {
    console.error('代码高亮失败:', err)
    return `<pre><code class="hljs">${text}</code></pre>`
  }
}

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer,
  async: false
})

// 渲染Markdown描述内容
const renderedDescription = computed(() => {
  if (!currentImage.value?.description) {
    return '<p>暂无描述</p>'
  }
  
  try {
    const html = marked.parse(currentImage.value.description, { async: false })
    return html as string
  } catch (err) {
    console.error('Markdown 渲染失败:', err)
    return String(currentImage.value.description)
  }
})

// 获取完整URL
function getFullUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const baseUrl = 'http://127.0.0.1:8000'
  return baseUrl + '/' + path
}

// 格式化日期
function formatDate(dateString: string) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 处理图片加载错误
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaXoOazleS/oeaYr+S7tjwvdGV4dD48L3N2Zz4='
}

// 加载图片类型
async function loadTypes() {
  try {
    types.value = await getImageTextTypes()
  } catch (error) {
    console.error('❌ 加载类型失败:', error)
  }
}

// 加载图片列表
async function loadImages() {
  loading.value = true
  
  try {
    const list = await getImageTextList(keyword.value, selectedType.value)
    imageList.value = list
  } catch (error) {
    console.error('❌ 加载图片失败:', error)
    imageList.value = []
  } finally {
    loading.value = false
  }
}

// 防抖搜索
function debounceSearch() {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  
  searchTimer.value = window.setTimeout(() => {
    loadImages()
  }, 300)
}

// 清空搜索
function clearSearch() {
  keyword.value = ''
  loadImages()
}

// 查看图片详情
async function viewImageDetail(image: any) {
  showDetail.value = true
  detailLoading.value = true
  
  try {
    const detail = await getImageTextDetail(image.id)
    currentImage.value = detail
  } catch (error) {
    console.error('❌ 加载详情失败:', error)
    currentImage.value = image
  } finally {
    detailLoading.value = false
  }
}

// 关闭详情弹窗
function closeDetail() {
  showDetail.value = false
  currentImage.value = null
}

// 组件挂载时加载数据
onMounted(() => {
  loadTypes()
  loadImages()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
})
</script>

<style scoped>
.image-text-view {
  min-height: 100vh;
  background: var(--bg-color);
  display: flex;
  flex-direction: column;
}

/* ========== 筛选区域 ========== */
.filter-section {
  padding: 16px 32px;
  background: var(--bg-overlay);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  transition: all var(--transition-base);
}

.filter-container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.filter-left {
  flex: 0 0 auto;
}

.filter-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

/* 类型选择 */
.type-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.select-icon {
  position: absolute;
  left: 12px;
  color: var(--text-tertiary);
  pointer-events: none;
  z-index: 1;
}

.type-select {
  padding: 10px 40px 10px 36px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: all var(--transition-base);
  min-width: 160px;
  appearance: none;
  box-shadow: var(--shadow-xs);
}

.type-select:hover {
  border-color: var(--primary-color);
}

.type-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

/* 搜索框 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 320px;
}

.search-icon-wrapper {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  display: flex;
  align-items: center;
  transition: color var(--transition-base);
}

.search-input {
  width: 100%;
  height: 42px;
  padding: 0 36px 0 42px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-card);
  outline: none;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.clear-btn {
  position: absolute;
  right: 36px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: var(--danger-50);
  color: var(--danger-color);
}

/* ========== 内容区域 ========== */
.content-area {
  flex: 1;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 24px 32px 120px;
  width: 100%;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0;
  font-weight: 400;
}

.header-right {
  display: flex;
  align-items: center;
}

.image-count-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--primary-50);
  border: 1px solid var(--primary-100);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  color: var(--primary-color);
}

body.dark-mode .image-count-badge {
  background: var(--primary-900);
  border-color: var(--primary-800);
}

.count-dot {
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.8); }
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

/* ========== 图片网格 ========== */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.image-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.card-glow {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.08) 0%, transparent 60%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

.image-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.image-card:hover .card-glow {
  opacity: 1;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--bg-secondary);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover .image-wrapper img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.6));
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.view-text {
  color: white;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.image-info {
  padding: 18px;
}

.image-info h4 {
  margin: 0 0 8px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.image-info p {
  margin: 0 0 12px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.image-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.image-type {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
  color: white;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
}

.image-date {
  color: var(--text-tertiary);
  font-size: 12px;
}

/* ========== 详情弹窗 ========== */
.detail-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.detail-content {
  position: relative;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: var(--radius-xl);
  background: var(--bg-card);
  box-shadow: var(--shadow-2xl);
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: rotate(90deg);
}

.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 60px 20px;
  gap: 16px;
}

.detail-loading p {
  color: var(--text-secondary);
}

.detail-body {
  display: flex;
  flex-direction: column;
}

.detail-image-wrapper {
  width: 100%;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
}

.detail-image-wrapper img {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  display: block;
}

.detail-info {
  padding: 28px 32px;
}

.detail-info h2 {
  margin: 0 0 16px;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 700;
}

.detail-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.detail-type {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
  color: white;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
}

.detail-date {
  color: var(--text-tertiary);
  font-size: 13px;
}

.detail-description {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.8;
  margin: 0;
}

/* Markdown 内容样式 */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin: 20px 0 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-body :deep(p) {
  margin: 12px 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin: 6px 0;
}

.markdown-body :deep(code) {
  padding: 2px 6px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  margin: 16px 0;
  padding: 16px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

.markdown-body :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border-left: 4px solid var(--primary-color);
  border-radius: var(--radius-sm);
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .filter-section {
    padding: 12px 20px;
  }
  
  .filter-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .filter-left,
  .filter-right {
    width: 100%;
  }
  
  .type-select {
    width: 100%;
  }
  
  .search-box {
    width: 100%;
  }
  
  .content-area {
    padding: 20px 20px 120px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .detail-info {
    padding: 20px;
  }
  
  .detail-info h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .filter-section {
    padding: 10px 16px;
  }
  
  .content-area {
    padding: 16px 16px 120px;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-modal {
    padding: 12px;
  }
  
  .detail-image-wrapper {
    min-height: 250px;
  }
  
  .detail-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
