import { ref, onMounted } from 'vue'

const THEME_KEY = 'elevator-video-theme'

export function useTheme() {
  const isDarkMode = ref(false)

  // 初始化主题
  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme === 'dark') {
      isDarkMode.value = true
      document.body.classList.add('dark-mode')
    } else {
      // 检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark && !savedTheme) {
        isDarkMode.value = true
        document.body.classList.add('dark-mode')
      }
    }
  })

  // 切换主题
  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    
    if (isDarkMode.value) {
      document.body.classList.add('dark-mode')
      localStorage.setItem(THEME_KEY, 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      localStorage.setItem(THEME_KEY, 'light')
    }
  }

  // 设置为深色模式
  function setDarkMode() {
    isDarkMode.value = true
    document.body.classList.add('dark-mode')
    localStorage.setItem(THEME_KEY, 'dark')
  }

  // 设置为浅色模式
  function setLightMode() {
    isDarkMode.value = false
    document.body.classList.remove('dark-mode')
    localStorage.setItem(THEME_KEY, 'light')
  }

  return {
    isDarkMode,
    toggleTheme,
    setDarkMode,
    setLightMode,
  }
}
