<template>
  <nav class="bottom-navbar">
    <div class="navbar-container">
      <div 
        v-for="item in menuItems" 
        :key="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="handleNavClick(item)"
      >
        <div class="nav-item-bg">
          <span class="nav-glow"></span>
        </div>
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text">{{ item.label }}</span>
        <span class="nav-indicator"></span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface MenuItem {
  label: string
  icon: string
  path: string
  external?: boolean
}

const route = useRoute()
const router = useRouter()

const menuItems: MenuItem[] = [
  {
    label: '首页',
    icon: '🏠',
    path: '/'
  },
  {
    label: '法规天地',
    icon: '📚',
    path: '/regulations'
  },
  {
    label: '安全讲堂',
    icon: '🎓',
    path: '/image-text'
  },
  {
    label: '视频警示',
    icon: '⚠️',
    path: '/video-warning'
  },
  {
    label: '电梯资料',
    icon: '📁',
    path: 'http://127.0.0.1:8000/login',
    external: true
  }
]

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/' && !route.path.startsWith('/play')
  }
  if (path === '/video-warning') {
    return route.path === '/video-warning' || route.path.startsWith('/play')
  }
  return route.path === path
}

function handleNavClick(item: MenuItem) {
  if (item.external) {
    window.open(item.path, '_blank')
  } else {
    router.push(item.path)
  }
}
</script>

<style scoped>
.bottom-navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
  display: flex;
  justify-content: center;
  padding: 8px 16px;
  background: var(--bg-overlay);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all var(--transition-base);
}

/* 底部渐变装饰线 */
.bottom-navbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--primary-color) 15%,
    var(--primary-light) 50%,
    var(--primary-color) 85%,
    transparent 100%
  );
  opacity: 0.4;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  max-width: 800px;
  gap: 4px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 8px 6px;
  cursor: pointer;
  position: relative;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

/* 导航项背景 */
.nav-item-bg {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  opacity: 0;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  transition: opacity var(--transition-base);
}

body.dark-mode .nav-item-bg {
  background: linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%);
}

.nav-item:hover .nav-item-bg {
  opacity: 1;
}

.nav-item.active .nav-item-bg {
  opacity: 1;
}

/* 发光效果 */
.nav-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, -50%);
  border-radius: var(--radius-full);
  background: radial-gradient(circle, var(--primary-200) 0%, transparent 70%);
  opacity: 0;
  transition: opacity var(--transition-base);
}

body.dark-mode .nav-glow {
  background: radial-gradient(circle, var(--primary-800) 0%, transparent 70%);
}

.nav-item:hover .nav-glow {
  opacity: 0.5;
}

.nav-item.active .nav-glow {
  opacity: 1;
}

/* 图标 */
.nav-icon {
  position: relative;
  z-index: 1;
  font-size: 22px;
  line-height: 1;
  transition: all var(--transition-spring);
  filter: grayscale(20%);
  opacity: 0.7;
}

.nav-item:hover .nav-icon {
  transform: translateY(-2px);
  filter: grayscale(0%);
  opacity: 1;
}

.nav-item.active .nav-icon {
  transform: translateY(-3px) scale(1.1);
  filter: grayscale(0%);
  opacity: 1;
}

/* 文字 */
.nav-text {
  position: relative;
  z-index: 1;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  color: var(--text-tertiary);
  transition: all var(--transition-base);
  letter-spacing: 0.3px;
}

.nav-item:hover .nav-text {
  color: var(--text-secondary);
  transform: translateY(-1px);
}

.nav-item.active .nav-text {
  color: var(--primary-color);
  font-weight: 600;
  transform: translateY(-1px);
}

/* 底部指示器 */
.nav-indicator {
  position: relative;
  z-index: 1;
  height: 3px;
  width: 0;
  border-radius: var(--radius-full);
  background: linear-gradient(90deg, var(--primary-500), var(--primary-400));
  transition: all var(--transition-spring);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}

.nav-item.active .nav-indicator {
  width: 24px;
  animation: indicatorPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes indicatorPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bottom-navbar {
    padding: 0 8px 6px;
  }
  
  .navbar-container {
    gap: 2px;
  }
  
  .nav-item {
    padding: 6px 6px 4px;
  }
  
  .nav-icon {
    font-size: 20px;
  }
  
  .nav-text {
    font-size: 10px;
  }
}

@media (max-width: 480px) {
  .nav-text {
    display: none;
  }
  
  .nav-item {
    padding: 10px;
  }
  
  .nav-icon {
    font-size: 24px;
  }
  
  .nav-indicator {
    height: 4px;
  }
}
</style>