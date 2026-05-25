<template>
  <div class="image-text-view">
    <ParticleEffect />
    <LogoHeader />
    
    <!-- 底部导航栏 -->
    <BottomNavbar />
    
    <!-- 筛选和搜索区域 -->
    <div class="filter-section">
      <div class="filter-left">
        <select v-model="selectedType" @change="loadImages" class="type-select">
          <option value="">全部类型</option>
          <option v-for="type in types" :key="type.id" :value="type.type">
            {{ type.type }}
          </option>
        </select>
      </div>
      
      <div class="filter-right">
        <div class="search-box">
          <input
            v-model="keyword"
            @input="debounceSearch"
            type="text"
            class="search-input"
            placeholder="搜索图片组名..."
          />
          <button v-if="keyword" class="clear-btn" @click="clearSearch" title="清空">
            ×
          </button>
          <span class="search-icon">🔍</span>
        </div>
      </div>
    </div>
    
    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
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
          <div class="image-wrapper">
            <img 
              :src="getFullUrl(image.coverPath)" 
              :alt="image.description" 
              @error="handleImageError"
              loading="lazy"
            />
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
          <span>✕</span>
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

// 获取完整URL - 使用后端API的基础URL
function getFullUrl(path: string) {
  if (!path) return ''
  // 如果已经是完整URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  // 拼接后端服务器地址
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
    console.log('✅ 图片类型列表:', types.value)
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
    console.log('✅ 图片列表:', list)
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
    // 获取完整的图片详情
    const detail = await getImageTextDetail(image.id)
    currentImage.value = detail
    console.log('✅ 图片详情:', detail)
  } catch (error) {
    console.error('❌ 加载详情失败:', error)
    // 如果获取详情失败，使用列表中的数据
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
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

/* 筛选区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  gap: 20px;
}

.filter-left {
  flex: 0 0 auto;
}

.filter-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.type-select {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
  min-width: 150px;
}

.type-select:hover {
  border-color: var(--primary-color);
}

.type-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

/* 搜索框 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 300px;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
}

body.dark-mode .search-input:focus {
  background: var(--bg-card);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.clear-btn {
  position: absolute;
  right: 36px;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.search-icon {
  position: absolute;
  right: 12px;
  font-size: 16px;
  pointer-events: none;
}

/* 内容区域 */
.content-area {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 60px 20px;
  background: var(--bg-card);
  border-radius: 12px;
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

/* 图片网格 */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.image-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.image-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
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
  transition: transform 0.3s ease;
}

.image-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.image-info {
  padding: 16px;
}

.image-info h4 {
  margin: 0 0 8px 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.image-info p {
  margin: 0 0 12px 0;
  color: var(--text-secondary);
  font-size: 14px;
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
}

.image-type {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #4a9af5, #1a73e8);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.image-date {
  color: var(--text-secondary);
  font-size: 12px;
}

/* 详情弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.detail-content {
  background: var(--bg-card);
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: rotate(90deg);
}

.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 60px 20px;
}

.detail-body {
  padding: 0;
}

.detail-image-wrapper {
  width: 100%;
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.detail-image-wrapper img {
  width: 100%;
  max-height: 60vh;
  object-fit: contain;
  display: block;
}

.detail-info {
  padding: 30px;
}

.detail-info h2 {
  margin: 0 0 16px 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
}

.detail-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}

.detail-type {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, #4a9af5, #1a73e8);
  color: white;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.detail-date {
  color: var(--text-secondary);
  font-size: 14px;
}

.detail-description {
  color: var(--text-primary);
  font-size: 16px;
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

.markdown-body :deep(h3) {
  font-size: 18px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 6px;
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
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-body :deep(pre) {
  margin: 16px 0;
  padding: 16px;
  background: #f6f8fa;
  border-radius: 8px;
  overflow-x: auto;
}

body.dark-mode .markdown-body :deep(pre) {
  background: #2d2d2d;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  color: inherit;
}

/* highlight.js 代码高亮样式覆盖 */
.markdown-body :deep(.hljs) {
  background: transparent !important;
  padding: 0 !important;
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 16px 0;
  border-collapse: collapse;
  border: 1px solid var(--border-color);
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 10px 14px;
  border: 1px solid var(--border-color);
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--bg-secondary);
  font-weight: 600;
}

.markdown-body :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border-left: 4px solid var(--primary-color);
  border-radius: 4px;
}

.markdown-body :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}

.markdown-body :deep(em) {
  font-style: italic;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    padding: 16px 20px;
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
    padding: 20px;
  }
  
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .detail-modal {
    padding: 10px;
  }
  
  .detail-content {
    max-height: 95vh;
  }
  
  .detail-info {
    padding: 20px;
  }
  
  .detail-info h2 {
    font-size: 20px;
  }
  
  .detail-description {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .filter-section {
    padding: 12px 16px;
  }
  
  .content-area {
    padding: 16px;
  }
  
  .image-grid {
    grid-template-columns: 1fr;
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
