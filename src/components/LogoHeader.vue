<template>
  <header class="logo-header">
    <!-- 第一行：Logo 和标题 -->
    <div class="header-top">
      <div class="logo-left">
        <div class="logo-icon">
          <img src="@/assets/logo.png" alt="校徽" class="logo-img" />
        </div>
      </div>
      <div class="logo-center">
        <div class="logo-text">
          <span class="logo-title">{{ pageTitle }}</span>
          <span class="logo-subtitle">{{ pageSubtitle }}</span>
        </div>
      </div>
      <div class="logo-right-spacer"></div>
    </div>
    
    <!-- 第二行：主题切换和安全说明 -->
    <div class="header-bottom">
      <div class="header-left">
        <button class="theme-toggle-btn" @click="toggleTheme" :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'">
          <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
        </button>
      </div>
      
      <div class="header-right">
        <button class="safety-btn" @click="goToSafety">
          <span class="btn-icon">📋</span>
          <span class="btn-text">安全说明</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const route = useRoute()
const { isDarkMode, toggleTheme } = useTheme()

// 判断是否在播放页面
const isPlayPage = computed(() => {
  return route.name === 'play'
})

function goToSafety() {
  router.push('/safety-instruction')
}

// 根据当前路由动态生成页面标题
const pageTitle = computed(() => {
  const path = route.path
  
  if (path === '/' || path === '/home') {
    return '首页'
  } else if (path === '/regulations') {
    return '法规天地'
  } else if (path === '/image-text') {
    return '安全讲堂'
  } else if (path === '/video-warning') {
    return '视频警示'
  } else if (path === '/safety-instruction') {
    return '安全说明'
  } else if (route.name === 'play') {
    return '电梯视频'
  } else {
    return '电梯视频' // 默认标题
  }
})

// 根据当前路由动态生成副标题
const pageSubtitle = computed(() => {
  const path = route.path
  
  if (path === '/' || path === '/home') {
    return 'Home'
  } else if (path === '/regulations') {
    return 'Regulations'
  } else if (path === '/image-text') {
    return 'Safety Class'
  } else if (path === '/video-warning') {
    return 'Video Warning'
  } else if (path === '/safety-instruction') {
    return 'Safety Instructions'
  } else if (route.name === 'play') {
    return 'Elevator Video'
  } else {
    return 'Elevator Video' // 默认副标题
  }
})
</script>

<style scoped>
.logo-header {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

/* 深色模式下 header 背景 */
body.dark-mode .logo-header {
  background: var(--bg-card);
}

/* 第一行：Logo 和标题 */
.header-top {
  display: flex;
  align-items: center;
  padding: 16px 30px;
  min-height: 80px;
}

.logo-left {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.logo-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-right-spacer {
  flex: 0 0 auto;
  width: 40px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  height: 56px;
  width: auto;
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #4a9af5, #1a73e8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.logo-subtitle {
  font-size: 11px;
  color: var(--text-secondary);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-top: 4px;
}

/* 第二行：操作按钮区域 */
.header-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 30px;
  min-height: 50px;
  border-top: 1px solid var(--border-color);
}

.header-left {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
}

/* 主题切换按钮 */
.theme-toggle-btn {
  width: 38px;
  height: 38px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 18px;
}

.theme-toggle-btn:hover {
  background: var(--primary-bg);
  border-color: var(--primary-color);
  transform: rotate(180deg);
}

.safety-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #4a9af5, #1a73e8);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.2);
  white-space: nowrap;
}

.safety-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
  background: linear-gradient(135deg, #5aa5f6, #2a83f8);
}

.safety-btn:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 16px;
}

.btn-text {
  white-space: nowrap;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-top {
    padding: 12px 20px;
    min-height: 70px;
  }
  
  .header-bottom {
    padding: 10px 20px;
    gap: 12px;
  }
  
  .logo-img {
    height: 48px;
  }
  
  .logo-title {
    font-size: 20px;
  }
  
  .safety-btn .btn-text {
    display: none;
  }
  
  .safety-btn {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .header-bottom {
    gap: 8px;
  }
}

</style>