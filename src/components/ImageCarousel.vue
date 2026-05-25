<template>
  <div class="image-carousel">
    <h2 class="section-title">图文精选</h2>
    <div class="carousel-container">
      <div 
        v-if="images.length > 0"
        class="carousel-wrapper"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
      >
        <!-- 图片项 -->
        <transition-group name="carousel-fade" tag="div" class="carousel-slides">
          <div 
            v-for="(image, index) in images" 
            :key="image.id"
            v-show="currentIndex === index"
            class="carousel-slide"
          >
            <img 
              :src="getFullUrl(image.coverPath)" 
              :alt="image.groupName || '图文封面'"
              @error="handleImageError"
            />
            <div class="slide-overlay">
              <div class="slide-info">
                <h3 class="slide-title">{{ image.groupName }}</h3>
                <p class="slide-description">{{ image.description }}</p>
              </div>
            </div>
          </div>
        </transition-group>

        <!-- 指示器 -->
        <div class="carousel-indicators">
          <span 
            v-for="(image, index) in images" 
            :key="`indicator-${index}`"
            class="indicator"
            :class="{ active: currentIndex === index }"
            @click="goToSlide(index)"
          ></span>
        </div>

        <!-- 左右箭头 -->
        <button class="carousel-arrow prev" @click="prevSlide" title="上一张">
          ‹
        </button>
        <button class="carousel-arrow next" @click="nextSlide" title="下一张">
          ›
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-else-if="loading" class="carousel-loading">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else class="carousel-empty">
        <div class="empty-icon">🖼️</div>
        <p>暂无图文内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getImageTextList } from '@/api/index'

interface ImageItem {
  id: number
  coverPath: string
  groupName: string
  description: string
}

const images = ref<ImageItem[]>([])
const loading = ref(false)
const currentIndex = ref(0)
let autoPlayTimer: number | null = null
const AUTO_PLAY_INTERVAL = 1500 // 1.5秒

// 获取完整URL
function getFullUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const baseUrl = 'http://127.0.0.1:8000'
  return baseUrl + '/' + path
}

// 处理图片加载错误
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuaXoOazleS/oeaYr+S7tjwvdGV4dD48L3N2Zz4='
}

// 加载前3张图文
async function loadImages() {
  loading.value = true
  try {
    const list = await getImageTextList()
    // 只取前3张
    images.value = list.slice(0, 3).map((item: any) => ({
      id: item.id,
      coverPath: item.coverPath,
      groupName: item.groupName,
      description: item.description
    }))
    console.log('✅ 轮播器图片加载成功:', images.value)
  } catch (error) {
    console.error('❌ 加载轮播图片失败:', error)
    images.value = []
  } finally {
    loading.value = false
  }
}

// 切换到指定幻灯片
function goToSlide(index: number) {
  if (index < 0 || index >= images.value.length) return
  currentIndex.value = index
}

// 下一张
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

// 上一张
function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
}

// 开始自动播放
function startAutoPlay() {
  stopAutoPlay()
  autoPlayTimer = window.setInterval(() => {
    nextSlide()
  }, AUTO_PLAY_INTERVAL)
}

// 停止自动播放
function stopAutoPlay() {
  if (autoPlayTimer !== null) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 暂停自动播放(鼠标悬停时)
function pauseAutoPlay() {
  stopAutoPlay()
}

// 恢复自动播放(鼠标离开时)
function resumeAutoPlay() {
  startAutoPlay()
}

onMounted(() => {
  loadImages().then(() => {
    if (images.value.length > 0) {
      startAutoPlay()
    }
  })
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.image-carousel {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 30px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-left: 12px;
  border-left: 4px solid var(--primary-color);
}

.carousel-container {
  position: relative;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.carousel-slides {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 40px 30px 30px;
  color: white;
}

.slide-info {
  max-width: 600px;
}

.slide-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.slide-description {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.6;
}

/* 过渡动画 */
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 0.5s ease;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

.indicator.active {
  background: white;
  width: 24px;
  border-radius: 5px;
}

/* 箭头按钮 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
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

.carousel-arrow:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-50%) scale(1.1);
}

.carousel-arrow.prev {
  left: 20px;
}

.carousel-arrow.next {
  right: 20px;
}

/* 加载状态 */
.carousel-loading {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
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

.carousel-loading p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* 空状态 */
.carousel-empty {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.carousel-empty p {
  color: var(--text-secondary);
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-carousel {
    padding: 0 20px 20px;
  }
  
  .carousel-wrapper {
    height: 300px;
  }
  
  .slide-title {
    font-size: 18px;
  }
  
  .slide-description {
    font-size: 12px;
  }
  
  .carousel-arrow {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }
  
  .carousel-arrow.prev {
    left: 10px;
  }
  
  .carousel-arrow.next {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .carousel-wrapper {
    height: 250px;
  }
  
  .slide-overlay {
    padding: 20px 15px 15px;
  }
  
  .slide-title {
    font-size: 16px;
  }
  
  .slide-description {
    display: none;
  }
}
</style>
