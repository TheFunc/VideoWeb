<template>
  <header class="logo-header">
    <!-- 顶部导航栏：Logo、标题和主题切换 -->
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
      <div class="logo-right">
        <button class="theme-toggle-btn" @click="toggleTheme" :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'">
          <span class="theme-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { isDarkMode, toggleTheme } = useTheme()

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
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

/* 顶部导航栏：Logo、标题和主题切换 */
.header-top {
  display: flex;
  align-items: center;
  padding: 16px 30px;
  min-height: 80px;
  background: url('/background.jpg') center center / cover no-repeat;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 深色模式下 header-top 背景 */
body.dark-mode .header-top {
  background: url('/background.jpg') center center / cover no-repeat;
  opacity: 0.9;
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

.logo-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  margin-left: 20px;
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
  color: #1a73e8;
  letter-spacing: 2px;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.9), -1px -1px 2px rgba(255, 255, 255, 0.9);
}

.logo-subtitle {
  font-size: 11px;
  color: #444;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-top: 4px;
  text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.9), -1px -1px 1px rgba(255, 255, 255, 0.9);
}

body.dark-mode .logo-title {
  color: #4a9af5;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.9), -1px -1px 2px rgba(0, 0, 0, 0.9);
}

body.dark-mode .logo-subtitle {
  color: #9aa5b4;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.9), -1px -1px 1px rgba(0, 0, 0, 0.9);
}

/* 主题切换按钮 - 与背景融合的风格 */
.theme-toggle-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 20px;
}

.theme-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: rotate(180deg);
}

body.dark-mode .theme-toggle-btn {
  background: rgba(0, 0, 0, 0.2);
}

body.dark-mode .theme-toggle-btn:hover {
  background: rgba(0, 0, 0, 0.35);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-top {
    padding: 12px 20px;
    min-height: 70px;
  }
  
  .logo-img {
    height: 48px;
  }
  
  .logo-title {
    font-size: 20px;
  }
}

</style>
