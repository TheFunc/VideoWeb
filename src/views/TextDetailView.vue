<template>
  <div class="text-detail-view">
    <ParticleEffect />
    <LogoHeader />
    
    <div class="detail-content">
      <!-- 顶部导航 -->
      <div class="detail-header">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </button>
        <h1 v-if="textData" class="detail-title">{{ getFirstLine(textData.TextContent) }}</h1>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
        <button class="retry-btn" @click="loadTextDetail">重试</button>
      </div>

      <!-- 文本内容 -->
      <article v-else-if="textData" class="markdown-article">
        <div class="article-meta">
          <span class="meta-tag">{{ textData.TextType }}</span>
          <span class="meta-date">{{ formatDate(textData.created_at) }}</span>
        </div>
        
        <!-- 调试信息 - 开发时可见 -->
        <div v-if="false" class="debug-info">
          <p><strong>调试信息:</strong></p>
          <p>TextContent 类型: {{ typeof textData.TextContent }}</p>
          <p>TextContent 长度: {{ textData.TextContent?.length }}</p>
          <p>TextContent 前100字符: {{ textData.TextContent?.substring(0, 100) }}</p>
          <p>渲染后 HTML 长度: {{ renderedContent?.length }}</p>
        </div>
        
        <div 
          class="markdown-body" 
          v-html="renderedContent"
        ></div>

        <!-- 底部操作栏 -->
        <div class="article-footer">
          <button class="action-btn" @click="goBack">
            <span>← 返回</span>
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { getTextDetail } from '@/api/index'
import ParticleEffect from '@/components/ParticleEffect.vue'
import LogoHeader from '@/components/LogoHeader.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const textData = ref<any>(null)

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

// 在组件初始化时配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer,
  async: false  // 确保同步渲染
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!textData.value?.TextContent) {
    console.warn('⚠️ TextContent 为空或不存在')
    return ''
  }
  
  try {
    // marked.parse 可能返回 Promise，需要同步调用
    const html = marked.parse(textData.value.TextContent, { async: false })
    console.log('✅ Markdown 渲染成功')
    return html as string
  } catch (err) {
    console.error('❌ Markdown 渲染失败:', err)
    // 如果渲染失败，直接返回原始文本
    return String(textData.value.TextContent)
  }
})

// 获取第一行作为标题
function getFirstLine(content: string): string {
  if (!content) return '无标题'
  const lines = content.split('\n')
  return lines[0] ? lines[0].replace(/^#+\s*/, '') : '无标题'
}

// 格式化日期
function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 加载文本详情
async function loadTextDetail() {
  const id = Number(route.params.id)
  if (!id) {
    error.value = '无效的文本ID'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    textData.value = await getTextDetail(id)
    console.log('📄 文本详情数据:', textData.value)
    console.log('📝 TextContent 内容:', textData.value?.TextContent)
    console.log('🔍 所有字段:', Object.keys(textData.value || {}))
  } catch (err) {
    console.error('加载文本详情失败:', err)
    error.value = '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 返回上一页
function goBack() {
  router.back()
}

onMounted(() => {
  loadTextDetail()
})
</script>

<style scoped>
.text-detail-view {
  min-height: 100vh;
  position: relative;
}

.detail-content {
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 40px 60px;
}

/* 顶部导航 */
.detail-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--border-color);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

body.dark-mode .back-btn {
  background: rgba(30, 35, 48, 0.85);
}

.back-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateX(-4px);
}

.back-icon {
  font-size: 18px;
  font-weight: bold;
}

.detail-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
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
  font-size: 16px;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.error-message {
  color: var(--text-secondary);
  font-size: 16px;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 24px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Markdown文章样式 */
.markdown-article {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

body.dark-mode .markdown-article {
  background: rgba(30, 35, 48, 0.85);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.meta-tag {
  padding: 6px 16px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.meta-date {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 调试信息样式 */
.debug-info {
  padding: 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #856404;
}

.debug-info p {
  margin: 4px 0;
}

/* Markdown内容样式 */
.markdown-body {
  line-height: 1.8;
  color: var(--text-primary);
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.markdown-body :deep(h1) {
  font-size: 32px;
  font-weight: 700;
  margin: 32px 0 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color);
  letter-spacing: 0.5px;
}

.markdown-body :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  margin: 28px 0 14px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--border-color);
  letter-spacing: 0.3px;
}

.markdown-body :deep(h3) {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px;
}

.markdown-body :deep(h4) {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 10px;
}

.markdown-body :deep(p) {
  margin: 12px 0;
  line-height: 1.9;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 12px 0;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin: 6px 0;
}

.markdown-body :deep(blockquote) {
  margin: 16px 0;
  padding: 12px 20px;
  background: var(--bg-secondary);
  border-left: 4px solid var(--primary-color);
  border-radius: 4px;
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
  border: 2px solid var(--border-color);
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
  border-bottom: 2px solid var(--border-color);
}

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

.markdown-body :deep(a) {
  color: var(--primary-color);
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

/* 底部操作栏 */
.article-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.action-btn {
  flex: 1;
  max-width: 200px;
  padding: 12px 24px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: var(--border-color);
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-content {
    padding: 20px 20px 40px;
  }
  
  .detail-title {
    font-size: 22px;
  }
  
  .markdown-article {
    padding: 24px;
  }
  
  .markdown-body :deep(h1) {
    font-size: 26px;
  }
  
  .markdown-body :deep(h2) {
    font-size: 20px;
  }
  
  .markdown-body :deep(h3) {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .back-text {
    display: none;
  }
  
  .detail-title {
    font-size: 20px;
  }
  
  .markdown-article {
    padding: 20px;
  }
}

/* 打印样式 */
@media print {
  .back-btn {
    display: none;
  }
  
  .markdown-article {
    box-shadow: none;
    border: none;
  }
}
</style>
