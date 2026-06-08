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
      <div class="carousel-card">
        <div class="carousel-container" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
          <div class="slide-wrapper">
            <img
              :key="currentIndex"
              :src="images[currentIndex]"
              class="carousel-slide"
              alt="轮播图片"
              @error="handleImageError"
            />
            <div class="slide-shine"></div>
          </div>

          <!-- 安全术语 -->
          <div class="term-overlay">
            <div class="term-badge">
              <span class="badge-icon"></span>
              安全提示
            </div>
            <p class="term-text">{{ safetyTerms[currentIndex] }}</p>
          </div>

          <!-- 左右箭头 -->
          <button class="carousel-arrow prev" @click="prevSlide" title="上一张">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="carousel-arrow next" @click="nextSlide" title="下一张">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- 指示器 -->
          <div class="carousel-indicators">
            <span
              v-for="(image, index) in images"
              :key="index"
              class="indicator"
              :class="{ active: currentIndex === index }"
              @click="goToSlide(index)"
            >
              <span class="indicator-dot"></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 三个功能卡片区域 -->
    <div class="cards-section">
      <div class="cards-container">
        <!-- 法规天地卡片 -->
        <div class="feature-card">
          <div class="card-image-wrapper">
            <img src="/card-regulations.png" alt="法规天地" class="card-image" />
            <div class="card-overlay">
              <span class="card-badge regulations-badge">法规天地</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">法规天地</h3>
            <p class="card-description">了解电梯相关法规标准</p>
            <router-link to="/regulations" class="card-button regulations-btn">
              查看更多
              <span class="button-arrow">→</span>
            </router-link>
            <div class="card-slogan">
              <p>一、遵守电梯安全管理规定</p>
              <p>二、严禁超载运行，注意载重限额</p>
              <p>三、等待电梯时请站在黄色安全线内</p>
              <p>四、电梯未到位严禁强行扒门</p>
              <p>五、乘梯过程中严禁蹦跳打闹</p>
            </div>
          </div>
        </div>

        <!-- 安全讲堂卡片 -->
        <div class="feature-card">
          <div class="card-image-wrapper">
            <img src="/card-safety.png" alt="安全讲堂" class="card-image" />
            <div class="card-overlay">
              <span class="card-badge safety-badge">安全讲堂</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">安全讲堂</h3>
            <p class="card-description">学习电梯安全使用知识</p>
            <router-link to="/image-text" class="card-button safety-btn">
              查看更多
              <span class="button-arrow">→</span>
            </router-link>
            <div class="card-slogan">
              <p>一、请先下后上，有序乘梯</p>
              <p>二、主动礼让老人、儿童和残障人士</p>
              <p>三、乘坐电梯时注意脚下安全</p>
              <p>四、携带物品时注意不要遮挡警报器</p>
              <p>五、发现电梯异常请立即按警铃求助</p>
            </div>
          </div>
        </div>

        <!-- 视频警示卡片 -->
        <div class="feature-card">
          <div class="card-image-wrapper">
            <img src="/card-video.png" alt="视频警示" class="card-image" />
            <div class="card-overlay">
              <span class="card-badge video-badge">视频警示</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">视频警示</h3>
            <p class="card-description">观看电梯安全警示教育</p>
            <router-link to="/video-warning" class="card-button video-btn">
              查看更多
              <span class="button-arrow">→</span>
            </router-link>
            <div class="card-slogan">
              <p>一、安全乘梯，预防为主，综合治理</p>
              <p>二、熟读并使用电梯安全乘梯须知</p>
              <p>三、一旦发生故障请不要惊慌按警铃</p>
              <p>四、定期参加电梯安全应急演练活动</p>
              <p>五、共同维护电梯安全运行环境</p>
            </div>
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

const images = [
  '/carousel-1.jpg',
  '/carousel-2.jpg',
  '/carousel-3.jpg'
]

const safetyTerms = [
  '请先下后上，有序乘梯，避免拥堵',
  '电梯超载时，请最后进入的乘客主动退出，确保运行安全',
  '请勿倚靠或拍打电梯门，防止意外开门或导致故障'
]

const currentIndex = ref(0)
let autoPlayTimer: number | null = null
const AUTO_PLAY_INTERVAL = 3000

function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQwMCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7nl6DmkrDmu5Y8L3RleHQ+PC9zdmc+'
}

function goToSlide(index: number) {
  if (index < 0 || index >= images.length) return
  currentIndex.value = index
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

function prevSlide() {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

function startAutoPlay() {
  stopAutoPlay()
  autoPlayTimer = window.setInterval(() => {
    nextSlide()
  }, AUTO_PLAY_INTERVAL)
}

function stopAutoPlay() {
  if (autoPlayTimer !== null) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

function pauseAutoPlay() {
  stopAutoPlay()
}

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
  padding: 20px 40px 30px;
}

/* 平台标题 */
.platform-title {
  text-align: center;
  padding: 24px 40px;
  margin: 0;
}

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

body.dark-mode .title-card {
  background: linear-gradient(135deg, rgba(40, 50, 65, 0.85) 0%, rgba(35, 45, 60, 0.80) 100%);
  border: 1px solid rgba(74, 154, 245, 0.2);
}

body.dark-mode .title-card:hover {
  background: linear-gradient(135deg, rgba(45, 55, 70, 0.90) 0%, rgba(40, 50, 65, 0.85) 100%);
}

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

body.dark-mode .carousel-card {
  background: linear-gradient(135deg, rgba(30, 40, 55, 0.95) 0%, rgba(25, 35, 60, 0.92) 100%);
  box-shadow: 0 8px 40px rgba(74, 154, 245, 0.15), 0 2px 10px rgba(74, 154, 245, 0.08);
  border: 1px solid rgba(74, 154, 245, 0.15);
}

body.dark-mode .carousel-card:hover {
  box-shadow: 0 12px 50px rgba(74, 154, 245, 0.22), 0 4px 15px rgba(74, 154, 245, 0.12);
}

/* 轮播容器 */
.carousel-container {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
}

/* 图片包装器 */
.slide-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.carousel-container:hover .carousel-slide {
  transform: scale(1.02);
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
    rgba(255, 255, 255, 0.12) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  transition: left 1s ease;
  pointer-events: none;
  z-index: 2;
}

.carousel-container:hover .slide-shine {
  left: 150%;
}

/* 安全术语 */
.term-overlay {
  position: absolute;
  bottom: 18px;
  left: 22px;
  z-index: 3;
}

.term-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 11px;
  background: rgba(239, 68, 68, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.badge-icon {
  width: 6px;
  height: 6px;
  background: #fca5a5;
  border-radius: 50%;
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.term-text {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin: 0;
  text-align: left;
  white-space: nowrap;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  right: 24px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  position: relative;
  display: block;
  width: 34px;
  height: 3px;
  background: rgba(255, 255, 255, 0.35);
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
}

.indicator-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
  border-radius: 2px;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.55);
  transform: translateY(-1px);
}

.indicator.active {
  background: rgba(255, 255, 255, 0.9);
  height: 4px;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.indicator.active .indicator-dot {
  transform: scaleX(1);
}

/* 箭头按钮 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 42px;
  border: none;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  color: white;
  cursor: pointer;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.carousel-arrow:hover {
  background: rgba(26, 115, 232, 0.7);
  transform: translateY(-50%) scale(1.08);
  box-shadow: 0 4px 16px rgba(26, 115, 232, 0.35);
}

.carousel-arrow:active {
  transform: translateY(-50%) scale(0.96);
}

.carousel-arrow.prev {
  left: 14px;
}

.carousel-arrow.next {
  right: 14px;
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
    width: 38px;
    height: 38px;
  }

  .carousel-arrow.prev {
    left: 10px;
  }

  .carousel-arrow.next {
    right: 10px;
  }

  .term-overlay {
    left: 16px;
    bottom: 16px;
  }

  .term-text {
    font-size: 13px;
    white-space: normal;
  }

  .carousel-indicators {
    right: 16px;
    bottom: 16px;
  }

  .indicator {
    width: 28px;
    height: 3px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    height: 220px;
  }

  .term-overlay {
    display: none;
  }

  .carousel-indicators {
    bottom: 12px;
    right: 12px;
  }

  .carousel-arrow {
    width: 34px;
    height: 34px;
  }

  .carousel-arrow.prev {
    left: 8px;
  }

  .carousel-arrow.next {
    right: 8px;
  }
}

/* ========== 功能卡片区域 ========== */
.cards-section {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px 60px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.feature-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 255, 0.92) 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(102, 126, 234, 0.12);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 50px rgba(102, 126, 234, 0.2);
}

body.dark-mode .feature-card {
  background: linear-gradient(135deg, rgba(30, 40, 55, 0.95) 0%, rgba(25, 35, 60, 0.92) 100%);
  box-shadow: 0 8px 30px rgba(74, 154, 245, 0.12);
  border: 1px solid rgba(74, 154, 245, 0.15);
}

body.dark-mode .feature-card:hover {
  box-shadow: 0 16px 50px rgba(74, 154, 245, 0.2);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.feature-card:hover .card-image {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.4));
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 15px;
}

.card-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  backdrop-filter: blur(10px);
}

.regulations-badge {
  background: rgba(26, 115, 232, 0.8);
}

.safety-badge {
  background: rgba(34, 197, 94, 0.8);
}

.video-badge {
  background: rgba(239, 68, 68, 0.8);
}

.card-content {
  padding: 24px;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 10px 0;
  text-align: center;
}

body.dark-mode .card-title {
  color: #f0f0f0;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  text-align: center;
}

body.dark-mode .card-description {
  color: #a0a0a0;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  margin-bottom: 16px;
}

.regulations-btn {
  background: linear-gradient(135deg, #1a73e8 0%, #4a9af5 100%);
}

.regulations-btn:hover {
  background: linear-gradient(135deg, #1557b0 0%, #3584e4 100%);
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(26, 115, 232, 0.4);
}

.safety-btn {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
}

.safety-btn:hover {
  background: linear-gradient(135deg, #16a34a 0%, #16b46a 100%);
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
}

.video-btn {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
}

.video-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #ea5656 100%);
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
}

.button-arrow {
  transition: transform 0.3s ease;
}

.card-button:hover .button-arrow {
  transform: translateX(4px);
}

.card-slogan {
  font-size: 12px;
  color: #888;
  margin: 0;
  text-align: center;
  line-height: 1.6;
}

.card-slogan p {
  margin: 4px 0;
  font-style: italic;
}

body.dark-mode .card-slogan {
  color: #808080;
}

@media (max-width: 1024px) {
  .cards-container {
    gap: 20px;
  }

  .card-image-wrapper {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .cards-section {
    padding: 20px 20px 40px;
  }

  .cards-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .card-image-wrapper {
    height: 200px;
  }

  .card-content {
    padding: 20px;
  }
}
</style>