<template>
  <div class="regulations-view">
    <ParticleEffect />
    <LogoHeader />
    <BottomNavbar />
    
    <div class="regulations-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
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
          </h2>
          
          <div class="text-list">
            <div 
              v-for="item in texts" 
              :key="item.id"
              class="text-card"
              @click="viewDetail(item)"
            >
              <div class="card-header">
                <span class="type-tag">{{ item.TextType }}</span>
                <span class="date">{{ formatDate(item.created_at) }}</span>
              </div>
              <h3 class="card-title">{{ getFirstLine(item.TextContent) }}</h3>
              <p class="card-preview">{{ truncateText(item.TextContent, 120) }}</p>
              <div class="card-footer">
                <span class="read-more">阅读全文 →</span>
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
  // 移除Markdown标记
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
    // 获取所有文本
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px 40px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border-color);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 36px;
}

.page-subtitle {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
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

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 18px;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.empty-hint {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 文本分组 */
.text-groups {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.text-group {
  margin-bottom: 20px;
}

.group-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  padding-left: 12px;
  border-left: 4px solid var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-icon {
  font-size: 24px;
}

/* 文本列表 - 从上到下排列 */
.text-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 246, 255, 0.90) 100%);
  border: 1px solid rgba(155, 139, 230, 0.2);
  border-radius: 12px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.08);
}

.text-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.4);
}

body.dark-mode .text-card {
  background: linear-gradient(135deg, rgba(35, 30, 50, 0.95) 0%, rgba(40, 35, 60, 0.90) 100%);
  border: 1px solid rgba(167, 139, 250, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.type-tag {
  padding: 4px 12px;
  background: var(--primary-light);
  color: var(--primary-color);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.date {
  font-size: 13px;
  color: var(--text-secondary);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.card-preview {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  font-size: 14px;
  color: var(--primary-color);
  font-weight: 500;
  transition: all 0.3s ease;
}

.text-card:hover .read-more {
  transform: translateX(4px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .regulations-content {
    padding: 20px 20px 30px;
  }
  
  .page-title {
    font-size: 26px;
  }
  
  .title-icon {
    font-size: 28px;
  }
  
  .group-title {
    font-size: 20px;
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
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
