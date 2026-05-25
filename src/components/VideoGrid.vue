<template>
  <div class="video-grid" ref="gridRef">
    <div class="section-header">
      <h2 class="section-title">
        <span class="title-bar"></span>
        {{ categoryName }}
      </h2>
      <span class="section-count">{{ videoGroups.length }} 个视频组</span>
    </div>

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else-if="videoGroups.length === 0" class="empty-state">
      <svg viewBox="0 0 80 80" width="80" height="80">
        <rect x="10" y="15" width="60" height="45" rx="6" fill="none" stroke="rgba(26,115,232,0.3)" stroke-width="2"/>
        <polygon points="35,25 35,50 55,37.5" fill="rgba(26,115,232,0.3)"/>
      </svg>
      <p>暂无视频数据</p>
    </div>

    <div v-else class="grid-container">
      <div
        v-for="(group, index) in videoGroups"
        :key="group.groupName"
        class="grid-item"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <VideoCard :video="group" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoGroup, Category } from '@/stores/videoStore'
import VideoCard from './VideoCard.vue'
import { computed } from 'vue'

const props = defineProps<{
  videoGroups: VideoGroup[]
  categories: Category[]
  activeId: number | null
  loading: boolean
}>()

const categoryName = computed(() => {
  const cat = props.categories.find(c => c.id === props.activeId)
  return cat?.type || '全部视频'
})
</script>

<style scoped>
.video-grid {
  position: relative;
  z-index: 10;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 40px 60px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.title-bar {
  display: inline-block;
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, var(--primary-light), var(--primary-color));
  border-radius: 2px;
}

.section-count {
  font-size: 14px;
  color: var(--text-secondary);
}

.loading-state {
  padding: 40px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 20px;
  color: var(--text-secondary);
}

.empty-state p {
  font-size: 16px;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.grid-item {
  flex: 0 0 auto;
  animation: fadeInUp 0.5s ease both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>