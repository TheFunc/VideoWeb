<template>
  <div class="image-carousel">
    <div class="section-header">
      <div class="section-badge">
        <span class="badge-dot"></span>
        精选内容
      </div>
      <h2 class="section-title">图文精选</h2>
    </div>
    
    <div class="carousel-container">
      <!-- 装饰背景 -->
      <div class="carousel-glow"></div>
      
      <div 
        class="carousel-stage"
        @mouseenter="pauseAutoPlay"
        @mouseleave="resumeAutoPlay"
      >
        <div class="carousel-track">
          <transition
            name="carousel-3d"
            mode="out-in"
          >
            <div 
              :key="currentIndex"
              class="carousel-slide"
            >
              <!-- 图片容器 -->
              <div class="slide-image-wrapper">
                <img 
                  :src="getFullUrl(images[currentIndex].coverPath)" 
                  :alt="images[currentIndex].groupName || '图文封面'"
                  class="slide-image"
                  @error="handleImageError"
                />
                <!-- 图片光泽扫过效果 -->
                <div class="slide-shine"></div>
                <!-- 装饰边框 -->
                <div class="slide-border"></div>
              </div>
              
              <!-- 内容覆盖层 -->
              <div class="slide-content">
                <div class="slide-number">{{ String(currentIndex + 1).padStart(2, '0') }}
                  <span class="number-total">/{{ String(images.length).padStart(2, '0') }}</span>
                </div>
                <div class="slide-info">
                  <h3 class="slide-title">{{ images[currentIndex].groupName }}</h3>
                  <p class="slide-description">{{ images[currentIndex].description }}</p>
                  <button class="slide-action-btn">
                    查看详情
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- 装饰角标 -->
              <div class="corner-decor top-left"></div>
              <div class="corner-decor top-right"></div>
              <div class="corner-decor bottom-left"></div>
              <div class="corner-decor bottom-right"></div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 自定义指示器 -->
      <div class="carousel-controls">
        <!-- 进度指示 -->
        <div class="carousel-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
          </div>
        </div>
        
        <!-- 指示器点 -->
        <div class="carousel-indicators">
          <span 
            v-for="(image, index) in images" 
            :key="`indicator-${index}`"
            class="indicator"
            :class="{ 
              active: currentIndex === index,
              'indicator-hover': hoverIndex === index
            }"
            @click="goToSlide(index)"
            @mouseenter="hoverIndex = index"
            @mouseleave="hoverIndex = null"
          >
            <span class="indicator-label">{{ image.groupName }}</span>
          </span>
        </div>
        
        <!-- 导航箭头 -->
        <div class="carousel-arrows">
          <button class="nav-arrow prev" @click="prevSlide" title="上一张">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 4L8 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="nav-arrow next" @click="nextSlide" title="下一张">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L12 10L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 蓝色装饰线 -->
      <div class="carousel-divider"></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="carousel-loading">
      <div class="loading-ring">
        <div class="ring-segment" v-for="i in 8" :key="i"></div>
      </div>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && images.length === 0" class="carousel-empty">
      <div class="empty-illustration">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <rect x="10" y="15" width="60" height="45" rx="4" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <circle cx="30" cy="35" r="6" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <path d="M10 55L25 45L40 52L55 40L70 50" stroke="currentColor" stroke-width="2" opacity="0.3"/>
        </svg>
      </div>
      <p>暂无图文内容</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
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
const hoverIndex = ref<number | null>(null)
let autoPlayTimer: number | null = null
let progressTimer: number | null = null
const AUTO_PLAY_INTERVAL = 4000 // 4秒
const progress = ref(0)

// 计算进度宽度
const progressWidth = computed(() => progress.value)

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
    images.value = list.slice(0, 3).map((item: any) => ({
      id: item.id,
      coverPath: item.coverPath,
      groupName: item.groupName,
      description: item.description
    }))
  } catch (error) {
    console.error('加载图文失败:', error)
    images.value = []
  } finally {
    loading.value = false
  }
}

// 切换到指定幻灯片
function goToSlide(index: number) {
  if (index < 0 || index >= images.value.length) return
  currentIndex.value = index
  resetProgress()
}

// 下一张
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
  resetProgress()
}

// 上一张
function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
  resetProgress()
}

// 重置进度
function resetProgress() {
  progress.value = 0
  if (progressTimer) {
    cancelAnimationFrame(progressTimer)
  }
  startProgress()
}

// 开始进度条
function startProgress() {
  const startTime = Date.now()
  function updateProgress() {
    const elapsed = Date.now() - startTime
    progress.value = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100)
    if (progress.value < 100) {
      progressTimer = requestAnimationFrame(updateProgress)
    }
  }
  progressTimer = requestAnimationFrame(updateProgress)
}

// 开始自动播放
function startAutoPlay() {
  stopAutoPlay()
  startProgress()
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
  if (progressTimer) {
    cancelAnimationFrame(progressTimer)
    progressTimer = null
  }
  progress.value = 0
}

// 暂停自动播放(鼠标悬停时)
function pauseAutoPlay() {
  stopAutoPlay()
}

// 恢复自动播放(鼠标离开时)
function resumeAutoPlay() {
  if (images.value.length > 0) {
    startAutoPlay()
  }
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
  padding: 0 40px 40px;
}

/* ========== 区域头部 ========== */
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}

.section-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: linear-gradient(135deg, rgba(26, 115, 232, 0.1) 0%, rgba(74, 154, 245, 0.08) 100%);
  border: 1px solid rgba(26, 115, 232, 0.2);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.badge-dot {
  width: 6px;
  height: 6px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

/* ========== 轮播容器 ========== */
.carousel-container {
  position: relative;
}

/* 背景光晕 */
.carousel-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background: radial-gradient(ellipse at center, rgba(26, 115, 232, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* 轮播舞台 */
.carousel-stage {
  position: relative;
  width: 100%;
  height: 480px;
  perspective: 1200px;
  z-index: 1;
}

/* 轮播轨道 */
.carousel-track {
  width: 100%;
  height: 100%;
  position: relative;
}

/* ========== 幻灯片 ========== */
.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

/* 图片包装器 */
.slide-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-slide:hover .slide-image {
  transform: scale(1.03);
}

/* 光泽扫过效果 */
.slide-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  transition: left 0.8s ease;
  pointer-events: none;
}

.carousel-slide:hover .slide-shine {
  left: 150%;
}

/* 装饰边框 */
.slide-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

/* 装饰角标 */
.corner-decor {
  position: absolute;
  width: 24px;
  height: 24px;
  z-index: 3;
  pointer-events: none;
}

.corner-decor::before,
.corner-decor::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
}

.corner-decor.top-left {
  top: 16px;
  left: 16px;
}
.corner-decor.top-left::before { width: 24px; height: 2px; }
.corner-decor.top-left::after { width: 2px; height: 24px; }

.corner-decor.top-right {
  top: 16px;
  right: 16px;
}
.corner-decor.top-right::before { width: 24px; height: 2px; right: 0; }
.corner-decor.top-right::after { width: 2px; height: 24px; right: 0; }

.corner-decor.bottom-left {
  bottom: 16px;
  left: 16px;
}
.corner-decor.bottom-left::before { bottom: 0; width: 24px; height: 2px; }
.corner-decor.bottom-left::after { bottom: 0; width: 2px; height: 24px; }

.corner-decor.bottom-right {
  bottom: 16px;
  right: 16px;
}
.corner-decor.bottom-right::before { bottom: 0; right: 0; width: 24px; height: 2px; }
.corner-decor.bottom-right::after { bottom: 0; right: 0; width: 2px; height: 24px; }

/* ========== 内容覆盖层 ========== */
.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 80px 48px 48px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    transparent 100%
  );
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 2;
}

.slide-number {
  position: absolute;
  top: 24px;
  left: 32px;
  font-size: 48px;
  font-weight: 800;
  opacity: 0.25;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.number-total {
  font-size: 24px;
  opacity: 0.6;
}

.slide-info {
  max-width: 550px;
}

.slide-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 12px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.3;
}

.slide-description {
  font-size: 15px;
  margin: 0 0 24px 0;
  opacity: 0.9;
  line-height: 1.7;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* 动作按钮 */
.slide-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 28px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 30px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slide-action-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateX(4px);
}

.slide-action-btn svg {
  transition: transform 0.3s ease;
}

.slide-action-btn:hover svg {
  transform: translateX(3px);
}

/* 蓝色装饰线 */
.carousel-divider {
  width: 60%;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary-color), var(--primary-light), var(--primary-color), transparent);
  border-radius: 2px;
  margin: 28px auto 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .carousel-divider {
    width: 80%;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .carousel-divider {
    width: 90%;
    height: 2px;
    margin-top: 16px;
  }
}

/* ========== 控制面板 ========== */
.carousel-controls {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 24px;
  padding: 0 8px;
}

/* 进度条 */
.carousel-progress {
  flex: 0 0 auto;
  width: 120px;
}

.progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(26, 115, 232, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
  border-radius: 2px;
  transition: width 0.1s linear;
}

/* 指示器 */
.carousel-indicators {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.indicator {
  position: relative;
  display: inline-block;
  padding: 8px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.indicator-label {
  position: relative;
  z-index: 1;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  white-space: nowrap;
  transition: color 0.4s ease;
}

.indicator:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.15);
}

.indicator.active {
  border-color: var(--primary-color);
  box-shadow: 0 4px 16px rgba(26, 115, 232, 0.25);
  transform: translateY(-2px);
}

.indicator.active::before {
  opacity: 1;
}

.indicator.active .indicator-label {
  color: white;
}

/* 导航箭头 */
.carousel-arrows {
  display: flex;
  gap: 8px;
}

.nav-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-arrow:hover {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.nav-arrow:active {
  transform: scale(0.98);
}

/* ========== 过渡动画 ========== */
.carousel-3d-enter-active {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-3d-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-3d-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(20px);
  filter: blur(4px);
}

.carousel-3d-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-15px);
  filter: blur(2px);
}

/* ========== 加载状态 ========== */
.carousel-loading {
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  gap: 20px;
}

.loading-ring {
  position: relative;
  width: 60px;
  height: 60px;
}

.ring-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin-ring 1.2s linear infinite;
}

.ring-segment:nth-child(even) {
  border-top-color: var(--primary-light);
  animation-delay: -0.3s;
}

@keyframes spin-ring {
  to { transform: rotate(360deg); }
}

.carousel-loading p {
  color: var(--text-secondary);
  font-size: 14px;
}

/* ========== 空状态 ========== */
.carousel-empty {
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  gap: 16px;
}

.empty-illustration {
  opacity: 0.4;
}

.carousel-empty p {
  color: var(--text-secondary);
  font-size: 16px;
}

/* ========== 深色模式 ========== */
body.dark-mode .section-badge {
  background: linear-gradient(135deg, rgba(74, 154, 245, 0.15) 0%, rgba(107, 179, 247, 0.1) 100%);
  border-color: rgba(74, 154, 245, 0.25);
  color: var(--primary-color);
}

body.dark-mode .slide-number {
  opacity: 0.15;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .image-carousel {
    padding: 0 30px 30px;
  }
  
  .carousel-stage {
    height: 400px;
  }
  
  .slide-title {
    font-size: 26px;
  }
  
  .slide-description {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .image-carousel {
    padding: 0 20px 24px;
  }
  
  .section-title {
    font-size: 22px;
  }
  
  .carousel-stage {
    height: 320px;
  }
  
  .slide-content {
    padding: 50px 24px 28px;
  }
  
  .slide-title {
    font-size: 22px;
    margin-bottom: 8px;
  }
  
  .slide-description {
    font-size: 13px;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .slide-number {
    font-size: 36px;
  }
  
  .carousel-controls {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .carousel-progress {
    width: 80px;
  }
  
  .indicator {
    padding: 6px 14px;
  }
  
  .indicator-label {
    font-size: 12px;
  }
  
  .nav-arrow {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .carousel-stage {
    height: 240px;
  }
  
  .slide-content {
    padding: 30px 16px 20px;
  }
  
  .slide-title {
    font-size: 18px;
  }
  
  .slide-description {
    display: none;
  }
  
  .slide-action-btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .slide-number {
    font-size: 28px;
  }
  
  .number-total {
    font-size: 16px;
  }
  
  .corner-decor {
    width: 16px;
    height: 16px;
  }
  
  .corner-decor::before,
  .corner-decor::after {
    display: none;
  }
}
</style>