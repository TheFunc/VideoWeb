<template>
  <div class="video-warning-view">
    <ParticleEffect />
    <LogoHeader />
    <BottomNavbar />
    
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-box" :class="{ 'active': videoStore.isSearching }">
          <span class="search-icon-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
          <input
            v-model="searchInput"
            type="text"
            class="search-input"
            placeholder="搜索警示视频..."
            @keyup.enter="handleSearch"
            @keyup.esc="handleClearSearch"
          />
          <button v-if="searchInput" class="clear-btn" @click="handleClearSearch" title="清空">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="search-btn" @click="handleSearch" title="搜索">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div v-if="videoStore.searchKeyword" class="search-hint">
          <span>搜索: "{{ videoStore.searchKeyword }}"</span>
          <button @click="handleClearSearch" class="clear-search-link">清空搜索</button>
        </div>
      </div>
    </div>
    
    <div class="warning-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">
            <span class="title-icon">⚠️</span>
            视频警示
          </h1>
          <p class="page-subtitle">电梯安全事故案例与警示教育</p>
        </div>
        <div class="header-right">
          <span class="video-count-badge">
            <span class="count-dot"></span>
            {{ displayGroups.length }} 个分类
          </span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载警示视频...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="displayGroups.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-text">{{ videoStore.isSearching ? '未找到相关视频' : '暂无警示视频' }}</p>
        <p class="empty-hint">{{ videoStore.isSearching ? '请尝试其他关键词' : '敬请期待后续更新' }}</p>
      </div>

      <!-- 视频卡片列表 -->
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
  display: flex;
  flex-direction: column;
}

/* ========== 搜索区域 ========== */
.search-section {
  display: flex;
  justify-content: center;
  padding: 20px 32px;
  background: var(--bg-overlay);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-color);
  transition: all var(--transition-base);
}

.search-container {
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  transition: all var(--transition-base);
}

.search-box.active {
  max-width: 720px;
}

.search-icon-wrapper {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
  transition: color var(--transition-base);
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 110px 0 50px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-xl);
  font-size: 15px;
  color: var(--text-primary);
  background: var(--bg-card);
  outline: none;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.search-input:focus {
  border-color: var(--primary-color);
  background: var(--bg-card);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1), var(--shadow-md);
}

.search-input:focus + .clear-btn,
.search-input:focus ~ .search-btn,
.search-box:focus-within .search-icon-wrapper {
  color: var(--primary-color);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.clear-btn {
  position: absolute;
  right: 96px;
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  font-size: 18px;
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

body.dark-mode .clear-btn:hover {
  background: var(--danger-900);
}

.search-btn {
  position: absolute;
  right: 8px;
  width: 36px;
  height: 36px;
  border: none;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  color: white;
  cursor: pointer;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
}

.search-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}

.search-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--primary-50);
  border: 1px solid var(--primary-100);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--primary-color);
}

body.dark-mode .search-hint {
  background: var(--primary-900);
  border-color: var(--primary-800);
}

.clear-search-link {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-decoration: underline;
  transition: opacity var(--transition-fast);
}

.clear-search-link:hover {
  opacity: 0.8;
}

/* ========== 主内容区域 ========== */
.warning-content {
  position: relative;
  z-index: 10;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 28px 32px 120px;
  width: 100%;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
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
  animation: shake 3s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(-10deg); }
  20%, 40% { transform: rotate(10deg); }
  50% { transform: rotate(0deg); }
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

.video-count-badge {
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

body.dark-mode .video-count-badge {
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
  text-align: center;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 2px dashed var(--border-color);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.6;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
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

/* 视频网格 - 4列居中布局 */
.video-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1120px;
  margin: 0 auto;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .video-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .search-section {
    padding: 16px 20px;
  }
  
  .search-input {
    height: 44px;
    font-size: 14px;
    padding: 0 100px 0 44px;
  }
  
  .warning-content {
    padding: 20px 20px 120px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .title-icon {
    font-size: 26px;
  }
  
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 12px 16px;
  }
  
  .search-input {
    height: 42px;
    font-size: 14px;
    padding: 0 95px 0 42px;
  }
  
  .clear-btn {
    right: 86px;
    width: 28px;
    height: 28px;
  }
  
  .search-btn {
    width: 34px;
    height: 34px;
  }
  
  .search-hint {
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }
  
  .warning-content {
    padding: 16px 16px 120px;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>