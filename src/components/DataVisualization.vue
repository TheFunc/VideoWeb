<template>
  <div class="data-visualization">
    <h2 class="section-title">数据统计</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card video-stat">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">🎬</div>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ videoCount }}</div>
          <div class="stat-label">教学视频</div>
        </div>
      </div>
      
      <div class="stat-card category-stat">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">📂</div>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ categoryCount }}</div>
          <div class="stat-label">视频分类</div>
        </div>
      </div>
      
      <div class="stat-card image-stat">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">🖼️</div>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ imageCount }}</div>
          <div class="stat-label">图文总数</div>
        </div>
      </div>
      
      <div class="stat-card type-stat">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">🏷️</div>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ imageTypeCount }}</div>
          <div class="stat-label">图文类型</div>
        </div>
      </div>
      
      <div class="stat-card regulation-stat">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">📚</div>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ regulationCount }}</div>
          <div class="stat-label">法规总数</div>
        </div>
      </div>
      
      <div class="stat-card regulation-type-stat">
        <div class="stat-icon-wrapper">
          <div class="stat-icon">📑</div>
        </div>
        <div class="stat-info">
          <div class="stat-number">{{ regulationTypeCount }}</div>
          <div class="stat-label">法规分类</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoStore } from '@/stores/videoStore'
import { getImageTextTypes, getImageTextList, getTextList, getTextTypes } from '@/api/index'

const videoStore = useVideoStore()

// 统计数据
const videoCount = ref(0)
const categoryCount = ref(0)
const imageCount = ref(0)
const imageTypeCount = ref(0)

// 法规统计数据
const regulationCount = ref(0)
const regulationTypeCount = ref(0)

// 更新统计数据
function updateStats() {
  videoCount.value = videoStore.allVideos.length
  categoryCount.value = videoStore.categories.length
}

// 加载图文统计数据
async function loadImageStats() {
  try {
    const types = await getImageTextTypes()
    imageTypeCount.value = types.length

    const list = await getImageTextList()
    imageCount.value = list.length
  } catch (error) {
    console.error('加载图文统计失败:', error)
  }
}

// 加载法规统计数据
async function loadRegulationStats() {
  try {
    const types = await getTextTypes()
    regulationTypeCount.value = types.length

    const list = await getTextList()
    regulationCount.value = list.length
  } catch (error) {
    console.error('加载法规统计失败:', error)
  }
}

onMounted(async () => {
  // 确保分类数据已加载
  if (videoStore.categories.length === 0) {
    await videoStore.fetchCategories()
  }
  
  // 等待视频数据加载
  await videoStore.fetchAllVideos()
  
  // 更新统计
  updateStats()
  
  // 加载图文统计
  await loadImageStats()
  
  // 加载法规统计
  await loadRegulationStats()
})
</script>

<style scoped>
.data-visualization {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-left: 12px;
  border-left: 4px solid var(--primary-color);
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
}

body.dark-mode .stat-card {
  background: var(--bg-card);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon {
  font-size: 40px;
  line-height: 1;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-visualization {
    padding: 20px;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-card {
    padding: 16px;
  }
  
  .stat-icon-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .stat-icon {
    font-size: 32px;
  }
  
  .stat-number {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
}
</style>
