<template>
  <div class="home-view">
    <LogoHeader />

    <!-- 底部菜单栏 -->
    <BottomNavbar />

    <!-- 标题：电梯安全科普平台 -->
    <div class="platform-title">
      <div class="title-card">
        <h1>电梯安全科普平台</h1>
      </div>
    </div>

    <!-- 轮播器区域 - 在标题下方 -->
    <div class="carousel-section">
      <!-- 卡片容器 -->
      <div class="carousel-card">
        <div class="carousel-container" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
          <img
            :key="currentIndex"
            :src="images[currentIndex]"
            class="carousel-slide"
            alt="轮播图片"
            @error="handleImageError"
          />

          <!-- 指示器 -->
          <div class="carousel-indicators">
            <span
              v-for="(image, index) in images"
              :key="index"
              class="indicator"
              :class="{ active: currentIndex === index }"
              @click="goToSlide(index)"
            ></span>
          </div>

          <!-- 左右箭头 -->
          <button class="carousel-arrow prev" @click="prevSlide" title="上一张">‹</button>
          <button class="carousel-arrow next" @click="nextSlide" title="下一张">›</button>

          <!-- 安全术语 -->
          <div class="term-overlay">
            <p class="term-text">{{ safetyTerms[currentIndex] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'

// 三张轮播图片 - 使用 public 目录的相对路径
const images = [
  '/carousel-1.jpg',
  '/carousel-2.jpg',
  '/carousel-3.jpg'
]

// 电梯安全术语
const safetyTerms = [
  '请先下后上，有序乘梯，避免拥堵',
  '电梯超载时，请最后进入的乘客主动退出，确保运行安全',
  '请勿倚靠或拍打电梯门，防止意外开门或导致故障'
]

const currentIndex = ref(0)
let autoPlayTimer: number | null = null
const AUTO_PLAY_INTERVAL = 3000 // 3秒

// 处理图片加载错误
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  // 如果图片加载失败，使用占位图
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7nl6DmkrDmu5Y8L3RleHQ+PC9zdmc+'
}

// 切换到指定幻灯片
function goToSlide(index: number) {
  if (index < 0 || index >= images.length) return
  currentIndex.value = index
}

// 下一张
function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

// 上一张
function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
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
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  position: relative;
  background: transparent;
  display: flex;
  flex-direction: column;
}

.carousel-section {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px 40px;
}

/* 平台标题 */
.platform-title {
  text-align: center;
  padding: 24px 40px;
  margin: 0;
}

/* 标题透明卡片 */
.title-card {
  display: inline-block;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(232, 240, 254, 0.5) 100%);
  border-radius: 12px;
  border: 1px solid rgba(26, 115, 232, 0.2);
  padding: 18px 56px;
  transition: all 0.3s ease;
}

.title-card:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(232, 240, 254, 0.6) 100%);
  transform: translateY(-2px);
}

.platform-title h1 {
  background: linear-gradient(135deg, #1a73e8 0%, #4a9af5 50%, #1a73e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 38px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 6px;
  text-shadow: none;
  filter: drop-shadow(0 2px 4px rgba(26, 115, 232, 0.2));
}

/* 深色模式下的标题卡片 */
body.dark-mode .title-card {
  background: linear-gradient(135deg, rgba(40, 50, 65, 0.85) 0%, rgba(35, 45, 60, 0.80) 100%);
  border: 1px solid rgba(74, 154, 245, 0.2);
}

body.dark-mode .title-card:hover {
  background: linear-gradient(135deg, rgba(45, 55, 70, 0.90) 0%, rgba(40, 50, 65, 0.85) 100%);
}

/* 深色模式下的标题 */
body.dark-mode .platform-title h1 {
  background: linear-gradient(135deg, #4a9af5 0%, #6bb3f7 50%, #4a9af5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(74, 154, 245, 0.3));
}

/* 卡片容器 */
.carousel-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 255, 0.92) 100%);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(102, 126, 234, 0.1), 0 2px 10px rgba(102, 126, 234, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.12);
}

.carousel-card:hover {
  box-shadow: 0 12px 50px rgba(102, 126, 234, 0.18), 0 4px 15px rgba(102, 126, 234, 0.08);
  transform: translateY(-2px);
}

/* 深色模式下的卡片 */
body.dark-mode .carousel-card {
  background: linear-gradient(135deg, rgba(30, 40, 55, 0.95) 0%, rgba(25, 35, 60, 0.92) 100%);
  box-shadow: 0 8px 40px rgba(74, 154, 245, 0.15), 0 2px 10px rgba(74, 154, 245, 0.08);
  border: 1px solid rgba(74, 154, 245, 0.15);
}

body.dark-mode .carousel-card:hover {
  box-shadow: 0 12px 50px rgba(74, 154, 245, 0.22), 0 4px 15px rgba(74, 154, 245, 0.12);
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
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
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 28px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.carousel-arrow:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: translateY(-50%) scale(1.1);
}

.carousel-arrow.prev {
  left: 20px;
}

.carousel-arrow.next {
  right: 20px;
}

/* 安全术语 */
.term-overlay {
  position: absolute;
  bottom: 30px;
  left: 30px;
  z-index: 10;
}

.term-text {
  color: #fff;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 1px;
  margin: 0;
  text-align: left;
  white-space: nowrap;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .carousel-section {
    padding: 15px 20px 20px;
  }

  .carousel-container {
    height: 300px;
  }

  .carousel-arrow {
    width: 36px;
    height: 36px;
    font-size: 22px;
  }

  .carousel-arrow.prev {
    left: 10px;
  }

  .carousel-arrow.next {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 200px;
  }
}
</style>