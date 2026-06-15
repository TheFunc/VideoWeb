<template>
  <header class="logo-header">
    <!-- 顶部导航栏 -->
    <div class="header-top">
      <div class="logo-left">
        <div class="logo-icon">
          <img src="@/assets/logo.png" alt="Logo" class="logo-img" />
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
          <span class="theme-label">{{ isDarkMode ? 'Light' : 'Dark' }}</span>
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
    return '电梯安全运维在线平台'
  } else if (path === '/regulations') {
    return '法规天地'
  } else if (path === '/image-text') {
    return '安全讲堂'
  } else if (path === '/video-warning') {
    return '视频警示'
  } else if (route.name === 'play') {
    return '视频播放'
  } else {
    return '电梯安全教育'
  }
})

// 根据当前路由动态生成副标题
const pageSubtitle = computed(() => {
  const path = route.path
  
  if (path === '/' || path === '/home') {
    return 'Elevator Safety Education Platform'
  } else if (path === '/regulations') {
    return 'Regulations & Standards'
  } else if (path === '/image-text') {
    return 'Safety Knowledge'
  } else if (path === '/video-warning') {
    return 'Warning Education'
  } else if (route.name === 'play') {
    return 'Video Player'
  } else {
    return 'Elevator Safety'
  }
})
</script>

<style scoped>
.logo-header {
  position: relative;
  z-index: 100;
  width: 100%;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(59, 130, 246, 0.03) 100%),
              var(--bg-overlay);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

/* 顶部导航栏 */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 32px;
  min-height: 68px;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
}

/* 背景渐变装饰 */
.header-top::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--primary-color) 20%, 
    var(--primary-light) 50%, 
    var(--primary-color) 80%, 
    transparent 100%
  );
  opacity: 0.3;
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
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.logo-icon:hover {
  background: var(--primary-50);
  transform: scale(1.02);
}

body.dark-mode .logo-icon:hover {
  background: var(--primary-900);
}

.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  transition: transform var(--transition-spring);
}

.logo-icon:hover .logo-img {
  transform: scale(1.05);
}

.logo-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.logo-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-400) 50%, var(--primary-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 100%;
  animation: gradientShift 4s ease-in-out infinite;
  line-height: 1.3;
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.logo-subtitle {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  font-weight: 500;
  transition: color var(--transition-base);
}

/* 主题切换按钮 */
.theme-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: 14px;
  color: var(--text-secondary);
  box-shadow: var(--shadow-xs);
}

.theme-toggle-btn:hover {
  border-color: var(--primary-color);
  background: var(--primary-50);
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

body.dark-mode .theme-toggle-btn:hover {
  background: var(--primary-900);
  color: var(--primary-light);
}

.theme-icon {
  font-size: 18px;
  line-height: 1;
  transition: transform var(--transition-spring);
}

.theme-toggle-btn:hover .theme-icon {
  transform: rotate(180deg) scale(1.1);
}

.theme-label {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-top {
    padding: 10px 20px;
    min-height: 60px;
  }
  
  .logo-img {
    height: 36px;
  }
  
  .logo-title {
    font-size: 18px;
    letter-spacing: 1px;
  }
  
  .logo-subtitle {
    font-size: 9px;
    letter-spacing: 2px;
  }
  
  .theme-label {
    display: none;
  }
  
  .theme-toggle-btn {
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .header-top {
    padding: 8px 16px;
    min-height: 54px;
  }
  
  .logo-img {
    height: 32px;
  }
  
  .logo-title {
    font-size: 16px;
  }
  
  .logo-subtitle {
    display: none;
  }
}
</style>