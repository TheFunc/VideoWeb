<template>
  <div class="video-card" @click="handleClick">
    <div class="card-cover">
      <img :src="video.cover" :alt="video.groupName" loading="lazy" />
      <div class="card-overlay">
        <div class="play-icon">
          <svg viewBox="0 0 24 24" width="48" height="48">
            <circle cx="12" cy="12" r="11" fill="rgba(26,115,232,0.8)" />
            <polygon points="10,7 10,17 18,12" fill="#fff" />
          </svg>
        </div>
        <span class="video-count">{{ video.videos.length }} 个视频</span>
      </div>
    </div>
    <div class="card-info">
      <h3 class="card-title">{{ video.groupName }}</h3>
      <p class="card-desc">{{ video.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { VideoGroup } from '@/stores/videoStore'

const props = defineProps<{
  video: VideoGroup
}>()

const router = useRouter()

function handleClick() {
  router.push(`/play/${encodeURIComponent(props.video.groupName)}`)
}
</script>

<style scoped>
.video-card {
  width: 280px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.80);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

/* 深色模式下卡片背景 */
body.dark-mode .video-card {
  background: rgba(30, 30, 30, 0.80);
}

.video-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary-color);
  box-shadow: 0 8px 25px rgba(26, 115, 232, 0.12);
}

.card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.video-card:hover .card-cover img {
  transform: scale(1.08);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .card-overlay {
  opacity: 1;
}

.play-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.video-count {
  font-size: 13px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 12px;
  border-radius: 20px;
}

.card-info {
  padding: 14px 16px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-desc {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>