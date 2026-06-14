<template>
  <div class="home-view">
    <LogoHeader />

    <!-- 顶部菜单栏 -->
    <BottomNavbar />

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 平台标题区域 -->
      <div class="platform-hero">
        <div class="hero-bg-effects">
          <div class="hero-glow hero-glow-1"></div>
          <div class="hero-glow hero-glow-2"></div>
          <div class="hero-glow hero-glow-3"></div>
        </div>
        <div class="platform-title">
          <h1 class="title-main">电梯安全运维在线平台</h1>
        </div>
      </div>

      <!-- 轮播器区域 -->
      <div class="carousel-section">
        <div class="carousel-card">
          <div class="carousel-container">
            <div class="slide-wrapper">
              <Transition :name="slideTransitionName" mode="out-in">
                <img
                  :key="currentIndex"
                  :src="images[currentIndex]"
                  class="carousel-slide"
                  alt="轮播图片"
                  @error="handleImageError"
                />
              </Transition>
              <div class="slide-shine"></div>
              <div class="slide-vignette"></div>
            </div>

            <!-- 安全术语 -->
            <Transition name="term-fade" mode="out-in">
              <div class="term-overlay" :key="currentIndex">
                <div class="term-badge">
                  <span class="badge-icon">🛡️</span>
                  <span class="badge-label">安全提示</span>
                </div>
                <p class="term-text">{{ safetyTerms[currentIndex] }}</p>
              </div>
            </Transition>

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
          <div class="feature-card card-regulations">
            <div class="card-glow"></div>
            <div class="card-image-wrapper">
              <img src="/card-regulations.png" alt="法规天地" class="card-image" />
              <div class="card-overlay">
                <span class="card-badge">法规天地</span>
              </div>
            </div>
            <div class="card-content">
              <div class="card-header">
                <div class="card-icon-wrapper">
                  <span class="card-icon">📋</span>
                </div>
                <h3 class="card-title">法规天地</h3>
              </div>
              <p class="card-description">了解电梯相关法规标准，掌握安全规范</p>
              <router-link to="/regulations" class="card-button">
                <span class="button-text">查看更多</span>
                <span class="button-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </router-link>
              <div class="card-tips">
                <p v-for="(tip, index) in regulationsTips" :key="index" class="tip-item">
                  <span class="tip-dot"></span>
                  {{ tip }}
                </p>
              </div>
            </div>
          </div>

          <!-- 安全讲堂卡片 -->
          <div class="feature-card card-safety">
            <div class="card-glow"></div>
            <div class="card-image-wrapper">
              <img src="/card-safety.png" alt="安全讲堂" class="card-image" />
              <div class="card-overlay">
                <span class="card-badge">安全讲堂</span>
              </div>
            </div>
            <div class="card-content">
              <div class="card-header">
                <div class="card-icon-wrapper">
                  <span class="card-icon">📖</span>
                </div>
                <h3 class="card-title">安全讲堂</h3>
              </div>
              <p class="card-description">学习电梯安全使用知识，提高安全意识</p>
              <router-link to="/image-text" class="card-button">
                <span class="button-text">查看更多</span>
                <span class="button-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </router-link>
              <div class="card-tips">
                <p v-for="(tip, index) in safetyTips" :key="index" class="tip-item">
                  <span class="tip-dot"></span>
                  {{ tip }}
                </p>
              </div>
            </div>
          </div>

          <!-- 视频警示卡片 -->
          <div class="feature-card card-video">
            <div class="card-glow"></div>
            <div class="card-image-wrapper">
              <img src="/card-video.png" alt="视频警示" class="card-image" />
              <div class="card-overlay">
                <span class="card-badge">视频警示</span>
              </div>
            </div>
            <div class="card-content">
              <div class="card-header">
                <div class="card-icon-wrapper">
                  <span class="card-icon">🎬</span>
                </div>
                <h3 class="card-title">视频警示</h3>
              </div>
              <p class="card-description">观看电梯安全警示教育，增强应急能力</p>
              <router-link to="/video-warning" class="card-button">
                <span class="button-text">查看更多</span>
                <span class="button-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </router-link>
              <div class="card-tips">
                <p v-for="(tip, index) in videoTips" :key="index" class="tip-item">
                  <span class="tip-dot"></span>
                  {{ tip }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'

const images = [
  '/carousel-banner.jpg',
  '/carousel-1.jpg',
  '/carousel-2.jpg',
  '/carousel-3.jpg'
]

const safetyTerms = [
  '电梯安全运维，定期检查保养，防患于未然',
  '请先下后上，有序乘梯，避免拥堵',
  '电梯超载时，请最后进入的乘客主动退出，确保运行安全',
  '请勿倚靠或拍打电梯门，防止意外开门或导致故障'
]

const regulationsTips = [
  '遵守电梯安全管理规定',
  '严禁超载运行',
  '站在黄色安全线内等待',
  '严禁强行扒门',
  '乘梯时不要蹦跳打闹'
]

const safetyTips = [
  '请先下后上，有序乘梯',
  '礼让老人、儿童和残障人士',
  '注意脚下安全',
  '不要遮挡警报器',
  '发现异常立即按警铃'
]

const videoTips = [
  '安全预防为主，综合治理',
  '熟读安全乘梯须知',
  '故障时按警铃求助',
  '参加安全应急演练',
  '共同维护运行环境'
]

const slideTransitionName = ref('slide-fade')
const currentIndex = ref(0)

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
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  position: relative;
  background: transparent;
  display: flex;
  flex-direction: column;
}

/* ========== 主内容区域 ========== */
.main-content {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding);
  position: relative;
  z-index: 1;
}

/* ========== 平台主页区域 ========== */
.platform-hero {
  position: relative;
  padding: 48px 0 36px;
  text-align: center;
  overflow: hidden;
}

/* 背景光效 */
.hero-bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}

.hero-glow-1 {
  width: 300px;
  height: 300px;
  background: var(--primary-200);
  top: -100px;
  left: -50px;
  animation: floatGlow 12s ease-in-out infinite;
}

.hero-glow-2 {
  width: 250px;
  height: 250px;
  background: var(--primary-300);
  top: -50px;
  right: -30px;
  animation: floatGlow 15s ease-in-out infinite reverse;
}

.hero-glow-3 {
  width: 200px;
  height: 200px;
  background: var(--primary-100);
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  animation: floatGlow 10s ease-in-out infinite;
}

body.dark-mode .hero-glow {
  opacity: 0.2;
}

@keyframes floatGlow {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
}

/* 主标题 */
.title-main {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 3px;
  margin: 0 0 12px;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-500) 40%, var(--primary-400) 60%, var(--primary-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 100%;
  animation: gradientShift 5s ease-in-out infinite, fadeInUp 0.7s ease-out;
  line-height: 1.3;
  filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.15));
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* ========== 轮播器区域 ========== */
.carousel-section {
  width: 100%;
  margin-bottom: 40px;
}

.carousel-card {
  background: var(--bg-card);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  transition: all var(--transition-slow);
}

.carousel-card:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-2px);
}

/* 轮播容器 */
.carousel-container {
  position: relative;
  width: 100%;
  height: 520px;
}

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
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);
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
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
  transform: skewX(-20deg);
  transition: left 1.2s ease;
  pointer-events: none;
  z-index: 2;
}

.carousel-container:hover .slide-shine {
  left: 150%;
}

/* ========== 轮播图片切换过渡效果 ========== */
/* 滑动淡入淡出效果 */
.slide-fade-enter-active {
  transition: all 0.65s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}

.slide-fade-leave-active {
  transition: all 0.45s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.98);
  filter: blur(4px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.98);
  filter: blur(4px);
}

/* 安全术语淡入淡出过渡 */
.term-fade-enter-active,
.term-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.term-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.term-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* 暗角效果 */
.slide-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.3));
  pointer-events: none;
  z-index: 1;
}

/* 安全术语 */
.term-overlay {
  position: absolute;
  bottom: 20px;
  left: 24px;
  z-index: 3;
}

.term-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(220, 38, 38, 0.9);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-full);
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.badge-icon {
  font-size: 12px;
}

.badge-label {
  font-size: 11px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}

.term-text {
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  margin: 8px 0 0;
  text-align: left;
  white-space: nowrap;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  line-height: 1.4;
}

/* 指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  position: relative;
  display: block;
  width: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  cursor: pointer;
  overflow: hidden;
  transition: all var(--transition-base);
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
  transition: transform var(--transition-slow);
  border-radius: var(--radius-full);
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.indicator.active {
  background: rgba(255, 255, 255, 0.85);
  height: 5px;
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.3);
}

.indicator.active .indicator-dot {
  transform: scaleX(1);
}

/* 箭头按钮 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
  z-index: 10;
  opacity: 0;
}

.carousel-container:hover .carousel-arrow {
  opacity: 1;
}

.carousel-arrow:hover {
  background: rgba(37, 99, 235, 0.7);
  transform: translateY(-50%) scale(1.05);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.4);
}

.carousel-arrow:active {
  transform: translateY(-50%) scale(0.95);
}

.carousel-arrow.prev {
  left: 16px;
}

.carousel-arrow.next {
  right: 16px;
}

/* ========== 功能卡片区域 ========== */
.cards-section {
  width: 100%;
  padding: 0 0 20px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.feature-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-slow);
  position: relative;
}

.card-glow {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
  opacity: 0;
  transition: opacity var(--transition-slow);
  pointer-events: none;
}

.card-regulations .card-glow {
  background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 60%);
}

.card-safety .card-glow {
  background: radial-gradient(circle at 50% 0%, rgba(5, 150, 105, 0.1) 0%, transparent 60%);
}

.card-video .card-glow {
  background: radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.1) 0%, transparent 60%);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: transparent;
}

.feature-card:hover .card-glow {
  opacity: 1;
}

.feature-card:hover {
  border-color: var(--primary-color);
}

.card-regulations:hover {
  border-color: #2563eb;
}

.card-safety:hover {
  border-color: #059669;
}

.card-video:hover {
  border-color: #dc2626;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-card:hover .card-image {
  transform: scale(1.06);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.4));
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 16px;
}

.card-badge {
  padding: 5px 14px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: white;
  backdrop-filter: blur(10px);
  background: rgba(0, 0, 0, 0.4);
  letter-spacing: 0.5px;
}

/* 卡片内容 */
.card-content {
  padding: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
}

.card-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
  flex-shrink: 0;
}

body.dark-mode .card-icon-wrapper {
  background: linear-gradient(135deg, var(--primary-900), var(--primary-800));
}

.card-icon {
  font-size: 22px;
}

.card-regulations .card-icon-wrapper {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
}

.card-safety .card-icon-wrapper {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
}

.card-video .card-icon-wrapper {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 0.3px;
}

.card-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 20px;
  line-height: 1.6;
}

.card-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.card-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.card-button:hover::before {
  opacity: 1;
}

.card-regulations .card-button {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.card-safety .card-button {
  background: linear-gradient(135deg, #059669, #10b981);
}

.card-video .card-button {
  background: linear-gradient(135deg, #dc2626, #ef4444);
}

.card-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.button-arrow {
  display: flex;
  align-items: center;
  transition: transform var(--transition-base);
}

.card-button:hover .button-arrow {
  transform: translateX(4px);
}

/* 安全提示 */
.card-tips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.5;
}

.tip-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--text-tertiary);
  flex-shrink: 0;
  margin-top: 5px;
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
  .cards-container {
    gap: 20px;
  }
  
  .title-main {
    font-size: 36px;
  }
  
  .carousel-container {
    height: 440px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 16px;
  }
  
  .platform-hero {
    padding: 32px 0 24px;
  }
  
  .title-main {
    font-size: 28px;
    letter-spacing: 1px;
  }
  
  
  .carousel-container {
    height: 360px;
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
  
  
  .cards-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .card-image-wrapper {
    height: 180px;
  }
  
  .card-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .platform-hero {
    padding: 24px 0 20px;
  }
  
  .title-main {
    font-size: 24px;
  }
  
  
  .carousel-container {
    height: 280px;
  }
  
  .term-overlay {
    display: none;
  }
  
  .carousel-indicators {
    bottom: 16px;
    right: 16px;
  }
  
  .indicator {
    width: 32px;
    height: 3px;
  }
  
  .carousel-arrow {
    width: 34px;
    height: 34px;
  }
  
  
  .card-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .card-icon {
    font-size: 20px;
  }
  
  .card-title {
    font-size: 18px;
  }
}
</style>