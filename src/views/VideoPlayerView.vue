<template>
  <div class="video-player-view">
    <ParticleEffect />
    <LogoHeader />
    <BottomNavbar />
    <div class="player-content">
      <div class="player-header">
        <el-button class="back-btn" @click="goBack" :icon="ArrowLeft" text>
          返回首页
        </el-button>
        <h2 class="player-title">{{ groupName }}</h2>
        <span class="video-count">{{ groupVideos.length }} 个视频</span>
      </div>

      <div v-if="loading" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="groupVideos.length === 0" class="empty-state">
        <p>暂无视频数据</p>
      </div>

      <div v-else class="player-layout">
        <!-- 左侧：视频播放区域 -->
        <div class="player-main">
          <div class="video-player-wrapper">
            <VideoPlayer
              v-if="currentVideoUrl"
              ref="videoPlayerRef"
              :src="currentVideoUrl"
              :poster="currentVideo?.coverPath ? getFullUrl(currentVideo.coverPath) : ''"
              :autoplay="true"
              :playback-rates="[0.5, 0.75, 1, 1.25, 1.5, 2]"
              preload="auto"
              @play="handlePlay"
              @pause="handlePause"
              @ended="handleEnded"
              @error="handleVideoError"
              @loadedmetadata="handleLoadedMetadata"
              @timeupdate="handleTimeUpdate"
            />
            <div v-else class="player-placeholder">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(26,115,232,0.3)" stroke-width="3"/>
                <polygon points="32,22 32,58 58,40" fill="rgba(26,115,232,0.3)"/>
              </svg>
              <p>请选择一个视频播放</p>
            </div>
          </div>
          <div class="video-info-bar">
            <div class="video-info-left">
              <span class="current-video-label">正在播放</span>
              <span class="current-video-title">{{ currentVideo?.description || '未选择视频' }}</span>
            </div>
            <div class="video-info-right">
              <span class="video-type-tag">{{ currentVideo?.videoType || '' }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：视频列表（无封面） -->
        <div class="player-sidebar">
          <div class="sidebar-header">
            <svg viewBox="0 0 24 24" width="18" height="18" class="sidebar-icon">
              <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
              <polygon points="10,8 10,16 16,12" fill="currentColor"/>
            </svg>
            <span>播放列表</span>
          </div>
          <div class="sidebar-list">
            <div
              v-for="(video, index) in groupVideos"
              :key="video.id"
              class="sidebar-item"
              :class="{ active: currentVideo?.id === video.id }"
              @click="selectVideo(video)"
            >
              <span class="item-index" :class="{ 'active-index': currentVideo?.id === video.id }">
                {{ currentVideo?.id === video.id ? '▶' : index + 1 }}
              </span>
              <div class="item-info">
                <span class="item-title">{{ getVideoName(video) }}</span>
                <span class="item-meta">{{ video.videoType }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/videoStore'
import type { VideoItem } from '@/stores/videoStore'
import { ArrowLeft } from '@element-plus/icons-vue'
import ParticleEffect from '@/components/ParticleEffect.vue'
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()
const loading = ref(false)
const videoPlayerRef = ref<any>(null)
const currentVideo = ref<VideoItem | null>(null)

const groupName = computed(() => {
  return decodeURIComponent(route.params.groupName as string)
})

const groupVideos = computed(() => {
  return videoStore.allVideos.filter(v => v.videoGroup === groupName.value)
})

const currentVideoUrl = computed(() => {
  if (!currentVideo.value?.videoPath) return ''
  return videoStore.getVideoFullPath(currentVideo.value.videoPath)
})

// 获取完整URL的工具函数
function getFullUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const baseUrl = 'http://127.0.0.1:8000'
  return baseUrl + '/' + path
}

function getVideoName(video: VideoItem): string {
  // 从 videoPath 中提取文件名，去除 .mp4 后缀和时间戳前缀
  // 例如 "storage/videos/光速逃亡/1776175973_查看硬件温度.mp4" → "查看硬件温度"
  const path = video.videoPath
  if (!path) return video.description || '未知视频'
  // 提取文件名（最后一段）
  const fileName = path.split('/').pop() || path
  // 去除扩展名
  const nameWithoutExt = fileName.replace(/\.\w+$/, '')
  // 去除开头的时间戳 "xxxx_"
  return nameWithoutExt.replace(/^\d+_/, '')
}

function goBack() {
  router.push('/')
}

function selectVideo(video: VideoItem) {
  if (currentVideo.value?.id === video.id) return
  currentVideo.value = video
}

// Video.js 事件处理
function handlePlay() {
  console.log('视频开始播放')
}

function handlePause() {
  console.log('视频暂停')
}

function handleEnded() {
  console.log('视频播放结束')
  // 自动播放下一个
  const currentIndex = groupVideos.value.findIndex(v => v.id === currentVideo.value?.id)
  if (currentIndex >= 0 && currentIndex < groupVideos.value.length - 1) {
    const nextVideo = groupVideos.value[currentIndex + 1]
    if (nextVideo) {
      selectVideo(nextVideo)
    }
  }
}

function handleVideoError(error: Error) {
  console.error('视频加载失败:', error)
}

function handleLoadedMetadata() {
  console.log('视频元数据加载完成')
}

function handleTimeUpdate(currentTime: number, duration: number) {
  // 可以在这里实现播放进度记录等功能
  // console.log(`播放进度: ${currentTime}/${duration}`)
}

onMounted(async () => {
  if (videoStore.allVideos.length === 0) {
    loading.value = true
    await videoStore.fetchAllVideos()
    loading.value = false
  }
  // 默认选中第一个视频
  if (groupVideos.value.length > 0 && !currentVideo.value) {
    currentVideo.value = groupVideos.value[0] ?? null
  }
})

// 当 groupVideos 变化时，如果当前选中的视频不在列表中，重置为第一个
watch(groupVideos, (newVideos) => {
  if (newVideos.length > 0 && currentVideo.value) {
    const currentId = currentVideo.value.id
    const stillExists = newVideos.some(v => v.id === currentId)
    // 只有当当前视频确实不存在时才重置
    if (!stillExists) {
      currentVideo.value = newVideos[0] ?? null
    }
  } else if (newVideos.length > 0 && !currentVideo.value) {
    // 只有在没有选中视频时才设置默认值
    currentVideo.value = newVideos[0] ?? null
  }
}, { deep: false })
</script>

<style scoped>
.video-player-view {
  min-height: 100vh;
  position: relative;
  background: var(--bg-color);
  transition: background-color 0.3s ease;
}

.player-content {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 40px 60px;
}

/* 深色模式下的播放器内容 */
body.dark-mode .video-info-bar,
body.dark-mode .player-sidebar {
  background: var(--bg-card);
}

.player-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  font-size: 14px;
}

.player-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}

.video-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.loading-state,
.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-secondary);
}

/* ===== 播放器布局 ===== */
.player-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 左侧主播放区域 */
.player-main {
  flex: 1;
  min-width: 0;
}

.video-player-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.video-player {
  width: 100%;
  height: 100%;
  display: block;
  outline: none;
}

.player-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: rgba(255, 255, 255, 0.6);
}

.player-placeholder p {
  font-size: 16px;
}

/* 视频信息栏 */
.video-info-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.video-info-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.current-video-label {
  font-size: 12px;
  color: #fff;
  background: var(--primary-color);
  padding: 2px 10px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.current-video-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-info-right {
  flex-shrink: 0;
}

.video-type-tag {
  font-size: 12px;
  color: var(--primary-color);
  background: rgba(26, 115, 232, 0.08);
  padding: 2px 10px;
  border-radius: 4px;
}

/* ===== 右侧播放列表 ===== */
.player-sidebar {
  width: 320px;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 200px);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 18px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.sidebar-icon {
  color: var(--primary-color);
  flex-shrink: 0;
}

.sidebar-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.sidebar-list::-webkit-scrollbar {
  width: 4px;
}

.sidebar-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.sidebar-item:hover {
  background: var(--bg-secondary);
}

.sidebar-item.active {
  background: rgba(26, 115, 232, 0.08);
  border: 1px solid rgba(26, 115, 232, 0.2);
}

.item-index {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-secondary);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.item-index.active-index {
  background: var(--primary-color);
  color: #fff;
  font-size: 11px;
}

.item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-item.active .item-title {
  color: var(--primary-color);
  font-weight: 600;
}

.item-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .player-layout {
    flex-direction: column;
  }

  .player-sidebar {
    width: 100%;
    max-height: 300px;
  }

  .player-content {
    padding: 16px 20px 40px;
  }
}
</style>