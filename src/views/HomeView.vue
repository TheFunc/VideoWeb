<template>
  <div class="home-view">
    <ParticleEffect />
    <LogoHeader />
    <BottomNavbar />
    
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="banner-title">欢迎使用电梯视频管理系统</h1>
        <p class="banner-subtitle">安全乘梯 · 规范操作 · 文明使用</p>
        <div class="banner-stats">
          <div class="stat-item">
            <span class="stat-number">{{ videoStore.allVideos.length }}</span>
            <span class="stat-label">教学视频</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ videoStore.categories.length }}</span>
            <span class="stat-label">视频分类</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ imageCount }}</span>
            <span class="stat-label">图文总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ imageTypeCount }}</span>
            <span class="stat-label">图文类型</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ regulationCount }}</span>
            <span class="stat-label">法规总数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ regulationTypeCount }}</span>
            <span class="stat-label">法规分类</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="main-content">
      <!-- 数据可视化 -->
      <DataVisualization />
      
      <!-- 图文轮播器 -->
      <ImageCarousel />
      
      <!-- 快速导航区域 -->
      <div class="quick-nav">
        <h2 class="section-title">快速导航</h2>
        <div class="nav-cards">
          <div class="nav-card" @click="goToRegulations">
            <div class="card-icon">📚</div>
            <h3 class="card-title">法规天地</h3>
            <p class="card-desc">了解电梯相关法律法规</p>
          </div>
          <div class="nav-card" @click="goToImageText">
            <div class="card-icon">🎓</div>
            <h3 class="card-title">安全讲堂</h3>
            <p class="card-desc">图文讲解安全知识</p>
          </div>
          <div class="nav-card" @click="goToSafety">
            <div class="card-icon">📋</div>
            <h3 class="card-title">安全说明</h3>
            <p class="card-desc">查看电梯使用说明</p>
          </div>
          <div class="nav-card" @click="openManagement">
            <div class="card-icon">📁</div>
            <h3 class="card-title">资料管理</h3>
            <p class="card-desc">进入后台管理系统</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/videoStore'
import { getImageTextTypes, getImageTextList, getTextList, getTextTypes } from '@/api/index'
import ParticleEffect from '@/components/ParticleEffect.vue'
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import DataVisualization from '@/components/DataVisualization.vue'
import ImageCarousel from '@/components/ImageCarousel.vue'

const router = useRouter()
const videoStore = useVideoStore()

// 图文统计数据
const imageCount = ref(0)
const imageTypeCount = ref(0)

// 法规统计数据
const regulationCount = ref(0)
const regulationTypeCount = ref(0)

function goToRegulations() {
  router.push('/regulations')
}

function goToImageText() {
  router.push('/image-text')
}

function goToSafety() {
  router.push('/safety-instruction')
}

function openManagement() {
  window.open('http://127.0.0.1:8000/login', '_blank')
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
    const list = await getTextList()
    regulationCount.value = list.length

    const types = await getTextTypes()
    regulationTypeCount.value = types.length
  } catch (error) {
    console.error('加载法规统计失败:', error)
  }
}

onMounted(async () => {
  await videoStore.fetchCategories()
  videoStore.fetchAllVideos()
  
  // 加载图文统计
  await loadImageStats()

  // 加载法规统计
  await loadRegulationStats()
})
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  position: relative;
}

/* 欢迎横幅 */
.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 40px 30px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.welcome-banner::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
}

.banner-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: 1px;
}

.banner-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 24px 0;
}

.banner-stats {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
  margin-top: 4px;
}

.main-content {
  position: relative;
  z-index: 10;
}

/* 快速导航区域 */
.quick-nav {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px 40px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 4px solid var(--primary-color);
}

.nav-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.nav-card {
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
}

body.dark-mode .nav-card {
  background: var(--bg-card);
}

.card-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .welcome-banner {
    padding: 30px 20px 24px;
  }
  
  .banner-title {
    font-size: 22px;
  }
  
  .banner-subtitle {
    font-size: 14px;
  }
  
  .banner-stats {
    gap: 20px;
    justify-content: center;
  }
  
  .stat-item {
    min-width: 100px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .quick-nav {
    padding: 20px 20px 30px;
  }
  
  .nav-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .banner-stats {
    gap: 15px;
  }
  
  .stat-item {
    min-width: 80px;
  }
  
  .stat-number {
    font-size: 20px;
  }
  
  .stat-label {
    font-size: 12px;
  }
}
</style>