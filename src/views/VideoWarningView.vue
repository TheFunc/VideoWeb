<template>
  <div class="video-warning-view">
    <ParticleEffect />
    <LogoHeader />
    <BottomNavbar />
    
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-box" :class="{ 'active': videoStore.isSearching }">
        <input
          v-model="searchInput"
          type="text"
          class="search-input"
          placeholder="搜索视频..."
          @keyup.enter="handleSearch"
          @keyup.esc="handleClearSearch"
        />
        <button v-if="searchInput" class="clear-btn" @click="handleClearSearch" title="清空">
          ×
        </button>
        <button class="search-btn" @click="handleSearch" title="搜索">
          🔍
        </button>
      </div>
    </div>
    
    <div class="warning-content">
      <!-- <div class="page-header">
        <h1 class="page-title">
          <span class="title-icon">⚠️</span>
          视频警示
        </h1>
        <p class="page-subtitle">电梯安全事故案例与警示教育</p>
      </div> -->

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="displayGroups.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">{{ videoStore.isSearching ? '未找到相关视频' : '暂无警示视频' }}</p>
        <p class="empty-hint">{{ videoStore.isSearching ? '请尝试其他关键词' : '敬请期待后续更新' }}</p>
      </div>

      <!-- 视频列表 -->
      <div v-else class="video-grid">
        <VideoCard 
          v-for="group in displayGroups" 
          :key="group.groupName"
          :video="group"
          @click="playVideo(group)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/videoStore'
import ParticleEffect from '@/components/ParticleEffect.vue'
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import VideoCard from '@/components/VideoCard.vue'

const router = useRouter()
const videoStore = useVideoStore()
const loading = ref(false)
const searchInput = ref(videoStore.searchKeyword)

// 监听 store 中的搜索词变化，同步到输入框
watch(() => videoStore.searchKeyword, (newVal) => {
  searchInput.value = newVal
})

function handleSearch() {
  videoStore.setSearchKeyword(searchInput.value)
}

function handleClearSearch() {
  searchInput.value = ''
  videoStore.clearSearch()
}

// 根据搜索状态显示不同的数据
const displayGroups = computed(() => {
  if (videoStore.isSearching) {
    // 如果有搜索关键词，按分组聚合搜索结果
    const searchResults = videoStore.searchResults
    const groups: Record<string, any[]> = {}
    
    searchResults.forEach(video => {
      if (!groups[video.videoGroup]) {
        groups[video.videoGroup] = []
      }
      const group = groups[video.videoGroup]
      if (group) {
        group.push(video)
      }
    })
    
    return Object.entries(groups).map(([groupName, videos]) => ({
      groupName,
      cover: videos[0]?.coverPath ? `http://127.0.0.1:8000/${videos[0].coverPath}` : '',
      description: videos[0]?.description || '',
      videos,
    }))
  } else {
    // 否则显示全部分组
    return videoStore.videoGroups
  }
})

// 播放视频
function playVideo(group: any) {
  const groupName = encodeURIComponent(group.groupName)
  router.push(`/play/${groupName}`)
}

// 加载数据
async function loadData() {
  loading.value = true
  
  try {
    // 获取分类和视频列表
    await videoStore.fetchCategories()
    await videoStore.fetchAllVideos()
    console.log('✅ 警示视频加载成功:', videoStore.videoGroups.length, '个分组')
  } catch (error) {
    console.error('❌ 加载警示视频失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.video-warning-view {
  min-height: 100vh;
  position: relative;
}

/* 搜索区域 */
.search-section {
  display: flex;
  justify-content: center;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.75);
  border-bottom: 1px solid var(--border-color);
}

/* 深色模式下搜索区域背景 */
body.dark-mode .search-section {
  background: rgba(30, 30, 30, 0.75);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600px;
  transition: all 0.3s ease;
}

.search-box.active {
  max-width: 700px;
}

.search-input {
  width: 100%;
  height: 44px;
  padding: 0 85px 0 20px;
  border: 2px solid var(--border-color);
  border-radius: 22px;
  font-size: 16px;
  color: var(--text-primary);
  background: var(--bg-secondary);
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
}

body.dark-mode .search-input:focus {
  background: var(--bg-card);
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.clear-btn {
  position: absolute;
  right: 56px;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 24px;
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

.search-btn {
  position: absolute;
  right: 6px;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--primary-color);
  color: white;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background: var(--primary-dark);
  transform: scale(1.05);
}

.warning-content {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px 120px;
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

/* 视频网格 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-section {
    padding: 16px 20px;
  }
  
  .search-input {
    height: 40px;
    font-size: 15px;
    padding: 0 75px 0 16px;
  }
  
  .clear-btn {
    right: 48px;
    width: 24px;
    height: 24px;
    font-size: 20px;
  }
  
  .search-btn {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .warning-content {
    padding: 20px 20px 120px;
  }
  
  .page-title {
    font-size: 26px;
  }
  
  .title-icon {
    font-size: 28px;
  }
  
  .video-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 12px 16px;
  }
  
  .search-input {
    height: 38px;
    font-size: 14px;
    padding: 0 65px 0 14px;
  }
  
  .clear-btn {
    right: 42px;
    width: 22px;
    height: 22px;
    font-size: 18px;
  }
  
  .search-btn {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>
