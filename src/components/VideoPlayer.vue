<template>
  <div class="video-player-container" ref="containerRef">
    <video
      ref="videoElement"
      class="video-js vjs-big-play-centered"
      :poster="poster"
    ></video>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="player-loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="hasError" class="player-error">
      <svg viewBox="0 0 24 24" width="48" height="48">
        <circle cx="12" cy="12" r="10" fill="none" stroke="#ff4444" stroke-width="2"/>
        <path d="M12 8v4M12 16h.01" stroke="#ff4444" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p>{{ errorMessage }}</p>
      <button class="retry-btn" @click="handleRetry">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import '@videojs/http-streaming'

// 导入中文语言包
import 'video.js/dist/lang/zh-CN.json'

interface Props {
  src: string
  poster?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  playbackRates?: number[]
  preload?: 'auto' | 'metadata' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  muted: false,
  loop: false,
  playbackRates: () => [0.5, 0.75, 1, 1.25, 1.5, 2],
  preload: 'auto'
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  error: [error: Error]
  timeupdate: [currentTime: number, duration: number]
  loadedmetadata: []
}>()

const containerRef = ref<HTMLDivElement | null>(null)
const videoElement = ref<HTMLVideoElement | null>(null)
const player = ref<any>(null)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('视频加载失败')

let playerInstance: any = null

// 初始化播放器
const initPlayer = () => {
  if (!videoElement.value) return

  const options = {
    controls: true,
    autoplay: props.autoplay,
    muted: props.muted,
    loop: props.loop,
    preload: props.preload,
    playbackRates: props.playbackRates,
    fluid: true, // 响应式
    language: 'zh-CN',
    controlBar: {
      children: [
        'playToggle',
        'volumePanel',
        'currentTimeDisplay',
        'timeDivider',
        'durationDisplay',
        'progressControl',
        'playbackRateMenuButton',
        'fullscreenToggle'
      ]
    },
    html5: {
      hls: {
        overrideNative: true
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false
    }
  }

  try {
    playerInstance = videojs(videoElement.value, options, () => {
      console.log('Video.js 播放器初始化成功')
      
      // 设置视频源
      if (props.src) {
        playerInstance.src({
          src: props.src,
          type: getVideoType(props.src)
        })
      }

      // 绑定事件
      bindEvents()
      
      isLoading.value = false
    })

    player.value = playerInstance
  } catch (error) {
    console.error('Video.js 初始化失败:', error)
    handleError(error as Error)
  }
}

// 获取视频类型
const getVideoType = (url: string): string => {
  if (url.includes('.m3u8')) return 'application/x-mpegURL'
  if (url.includes('.mpd')) return 'application/dash+xml'
  if (url.includes('.webm')) return 'video/webm'
  if (url.includes('.ogg')) return 'video/ogg'
  return 'video/mp4'
}

// 绑定事件
const bindEvents = () => {
  if (!playerInstance) return

  playerInstance.on('play', () => {
    emit('play')
  })

  playerInstance.on('pause', () => {
    emit('pause')
  })

  playerInstance.on('ended', () => {
    emit('ended')
  })

  playerInstance.on('error', () => {
    const error = playerInstance.error()
    handleError(error || new Error('未知错误'))
  })

  playerInstance.on('timeupdate', () => {
    const currentTime = playerInstance.currentTime()
    const duration = playerInstance.duration()
    emit('timeupdate', currentTime, duration)
  })

  playerInstance.on('loadedmetadata', () => {
    emit('loadedmetadata')
    isLoading.value = false
    hasError.value = false
  })

  playerInstance.on('waiting', () => {
    isLoading.value = true
  })

  playerInstance.on('canplay', () => {
    isLoading.value = false
  })
}

// 处理错误
const handleError = (error: Error) => {
  console.error('视频播放错误:', error)
  hasError.value = true
  isLoading.value = false
  
  // 根据错误类型设置提示信息
  if (error.message?.includes('404')) {
    errorMessage.value = '视频文件不存在'
  } else if (error.message?.includes('403')) {
    errorMessage.value = '无权访问该视频'
  } else {
    errorMessage.value = '视频加载失败，请检查网络连接'
  }
  
  emit('error', error)
}

// 重试
const handleRetry = () => {
  hasError.value = false
  isLoading.value = true
  
  if (playerInstance && props.src) {
    playerInstance.src({
      src: props.src,
      type: getVideoType(props.src)
    })
    playerInstance.load()
    playerInstance.play().catch(() => {
      // 自动播放可能被阻止
    })
  }
}

// 监听 src 变化
watch(() => props.src, (newSrc) => {
  if (playerInstance && newSrc) {
    hasError.value = false
    isLoading.value = true
    
    playerInstance.src({
      src: newSrc,
      type: getVideoType(newSrc)
    })
    playerInstance.load()
    
    if (props.autoplay) {
      playerInstance.play().catch(() => {
        // 自动播放可能被阻止
      })
    }
  }
})

// 监听 autoplay 变化
watch(() => props.autoplay, (newAutoplay) => {
  if (playerInstance) {
    playerInstance.autoplay(newAutoplay ? 'play' : false)
  }
})

onMounted(() => {
  initPlayer()
})

onBeforeUnmount(() => {
  if (playerInstance) {
    playerInstance.dispose()
    playerInstance = null
    player.value = null
  }
})

// 暴露方法给父组件
defineExpose({
  player: player,
  play: () => playerInstance?.play(),
  pause: () => playerInstance?.pause(),
  currentTime: (time?: number) => {
    if (time !== undefined) {
      playerInstance?.currentTime(time)
    }
    return playerInstance?.currentTime()
  }
})
</script>

<style scoped>
.video-player-container {
  position: relative;
  width: 100%;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

/* Video.js 自定义样式 - 匹配项目主题 */
:deep(.video-js) {
  width: 100%;
  height: 100%;
  font-family: inherit;
}

:deep(.video-js .vjs-big-play-button) {
  background-color: rgba(26, 115, 232, 0.8);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  line-height: 80px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

:deep(.video-js .vjs-big-play-button:hover) {
  background-color: rgba(26, 115, 232, 1);
  transform: translate(-50%, -50%) scale(1.1);
}

:deep(.video-js .vjs-control-bar) {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  height: 50px;
}

:deep(.video-js .vjs-slider) {
  background-color: rgba(255, 255, 255, 0.3);
}

:deep(.video-js .vjs-load-progress div) {
  background: rgba(26, 115, 232, 0.5);
}

:deep(.video-js .vjs-play-progress) {
  background: var(--primary-color, #1a73e8);
}

:deep(.video-js .vjs-volume-level) {
  background: var(--primary-color, #1a73e8);
}

:deep(.video-js .vjs-control) {
  color: #fff;
}

:deep(.video-js .vjs-control:hover) {
  color: var(--primary-color, #1a73e8);
}

/* 加载状态 */
.player-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--primary-color, #1a73e8);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.player-loading p {
  color: #fff;
  font-size: 14px;
}

/* 错误状态 */
.player-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  padding: 20px;
}

.player-error p {
  color: #fff;
  font-size: 16px;
  text-align: center;
}

.retry-btn {
  padding: 10px 24px;
  background: var(--primary-color, #1a73e8);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #1557b0;
  transform: translateY(-2px);
}

/* 深色模式适配 */
body.dark-mode :deep(.video-js .vjs-control-bar) {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
}
</style>
