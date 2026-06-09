<template>
  <div class="regulations-view">
    <ParticleEffect />
    <LogoHeader />
    <BottomNavbar />
    
    <div class="regulations-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">
            <span class="title-icon">📋</span>
            法规天地
          </h1>
          <p class="page-subtitle">电梯安全法规与标准规范</p>
        </div>
        <div class="header-right">
          <span class="text-count-badge">
            <span class="count-dot"></span>
            {{ Object.keys(groupedTexts).length }} 个分类
          </span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载法规内容...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="Object.keys(groupedTexts).length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">暂无法规内容</p>
        <p class="empty-hint">敬请期待后续更新</p>
      </div>

      <!-- 按类型分组展示 -->
      <div v-else class="text-groups">
        <div 
          v-for="(texts, textType) in groupedTexts" 
          :key="textType"
          class="text-group"
        >
          <h2 class="group-title">
            <span class="group-icon">📖</span>
            {{ textType }}
            <span class="group-count">{{ texts.length }}</span>
          </h2>
          
          <div class="text-list">
            <div 
              v-for="item in texts" 
              :key="item.id"
              class="text-card"
              @click="viewDetail(item)"
            >
              <div class="card-glow"></div>
              <div class="card-header">
                <div class="card-meta">
                  <span class="type-tag">{{ item.TextType }}</span>
                  <span class="date">{{ formatDate(item.created_at) }}</span>
                </div>
              </div>
              <h3 class="card-title">{{ getFirstLine(item.TextContent) }}</h3>
              <p class="card-preview">{{ truncateText(item.TextContent, 100) }}</p>
              <div class="card-footer">
                <span class="read-more">
                  阅读全文
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTextTypes, getTextList } from '@/api/index'
import ParticleEffect from '@/components/ParticleEffect.vue'
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'

const router = useRouter()
const loading = ref(false)
const allTexts = ref<any[]>([])

// 按TextType分组
const groupedTexts = computed(() => {
  const groups: Record<string, any[]> = {}
  
  allTexts.value.forEach(item => {
    const type = item.TextType || '未分类'
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(item)
  })
  
  return groups
})

// 获取第一行作为标题
function getFirstLine(content: string): string {
  if (!content) return '无标题'
  const lines = content.split('\n')
  return lines[0] ? lines[0].replace(/^#+\s*/, '') : '无标题'
}

// 截断文本预览
function truncateText(text: string, length: number): string {
  if (!text) return ''
  const plainText = text.replace(/[#*_`\[\]]/g, '').replace(/\n/g, ' ')
  return plainText.length > length 
    ? plainText.substring(0, length) + '...' 
    : plainText
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

// 查看详情
function viewDetail(item: any) {
  router.push(`/text-detail/${item.id}`)
}

// 加载数据
async function loadData() {
  loading.value = true
  
  try {
    allTexts.value = await getTextList()
    console.log('✅ 文本列表加载成功:', allTexts.value.length, '条')
  } catch (error) {
    console.error('❌ 加载文本列表失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.regulations-view {
  min-height: 100vh;
  position: relative;
}

.regulations-content {
  position: relative;
  z-index: 10;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 28px 32px 100px;
}

/* ========== 页面头部 ========== */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border-color);
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 30px;
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

.text-count-badge {
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

body.dark-mode .text-count-badge {
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

/* ========== 加载状态 ========== */
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

/* ========== 空状态 ========== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-text {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0 0 8px;
  font-weight: 500;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-tertiary);
  margin: 0;
}

/* ========== 文本分组 ========== */
.text-groups {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.text-group {
  margin-bottom: 20px;
}

.group-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px;
  padding-left: 16px;
  border-left: 4px solid var(--primary-color);
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  font-size: 22px;
}

.group-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  background: var(--primary-50);
  border: 1px solid var(--primary-100);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  margin-left: auto;
}

body.dark-mode .group-count {
  background: var(--primary-900);
  border-color: var(--primary-800);
}

/* ========== 文本列表 ========== */
.text-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
}

.card-glow {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  background: radial-gradient(circle at 0% 50%, var(--primary-100) 0%, transparent 50%);
  opacity: 0;
  transition: opacity var(--transition-base);
  pointer-events: none;
}

body.dark-mode .card-glow {
  background: radial-gradient(circle at 0% 50%, var(--primary-900) 0%, transparent 50%);
}

.text-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.text-card:hover .card-glow {
  opacity: 1;
}

.card-header {
  margin-bottom: 10px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-tag {
  padding: 4px 12px;
  background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

body.dark-mode .type-tag {
  background: linear-gradient(135deg, var(--primary-900), var(--primary-800));
}

.date {
  font-size: 13px;
  color: var(--text-tertiary);
}

.card-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
  line-height: 1.5;
  transition: color var(--transition-fast);
}

.text-card:hover .card-title {
  color: var(--primary-color);
}

.card-preview {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  font-size: 13px;
  color: var(--primary-color);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: gap var(--transition-base);
}

.text-card:hover .read-more {
  gap: 8px;
}

.read-more svg {
  transition: transform var(--transition-base);
}

.text-card:hover .read-more svg {
  transform: translateX(4px);
}

/* ========== 响应式设计 ========== */
@media (max-width: 768px) {
  .regulations-content {
    padding: 20px 20px 100px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .group-title {
    font-size: 20px;
    padding-left: 12px;
  }
  
  .text-card {
    padding: 16px 20px;
  }
  
  .card-title {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 22px;
  }
  
  .card-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>