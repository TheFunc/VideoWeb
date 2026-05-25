<template>
  <nav class="bottom-navbar">
    <div 
      v-for="item in menuItems" 
      :key="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      @click="handleNavClick(item)"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-text">{{ item.label }}</span>
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
    label: '电梯资料管理',
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
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  padding: 8px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

/* 深色模式 */
body.dark-mode .bottom-navbar {
  background: var(--bg-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 0 4px;
}

.nav-item:hover {
  background: var(--bg-secondary);
  transform: translateY(-2px);
}

.nav-item.active {
  color: var(--primary-color);
  background: rgba(26, 115, 232, 0.08);
}

.nav-icon {
  font-size: 22px;
  line-height: 1;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.nav-item.active .nav-text {
  color: var(--primary-color);
  font-weight: 600;
}

.nav-item:hover .nav-text {
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bottom-navbar {
    padding: 6px 0;
  }
  
  .nav-item {
    padding: 6px 8px;
    margin: 0 2px;
  }
  
  .nav-icon {
    font-size: 20px;
  }
  
  .nav-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .nav-text {
    display: none;
  }
  
  .nav-item {
    padding: 8px;
  }
  
  .nav-icon {
    font-size: 24px;
  }
}
</style>
