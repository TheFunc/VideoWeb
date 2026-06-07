<template>
  <div class="category-menu-wrapper">
    <div class="category-menu">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="category-item"
        :class="{ active: cat.id === activeId }"
        @click="handleSelect(cat.id)"
      >
        <span class="category-dot"></span>
        <span class="category-name">{{ cat.type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/stores/videoStore'

defineProps<{
  categories: Category[]
  activeId: number | null
}>()

const emit = defineEmits<{
  select: [id: number]
}>()

function handleSelect(id: number) {
  emit('select', id)
}
</script>

<style scoped>
.category-menu-wrapper {
  position: relative;
  z-index: 10;
  height: var(--menu-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8f2ff 50%, #f0f4ff 100%);
  border-bottom: 1px solid rgba(26, 115, 232, 0.15);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.05);
}

/* 深色模式下菜单背景 */
body.dark-mode .category-menu-wrapper {
  background: linear-gradient(135deg, #1a2535 0%, #1e2d45 50%, #1a2535 100%);
  border-bottom: 1px solid rgba(74, 154, 245, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.category-menu {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: var(--bg-secondary);
  border-radius: 12px;
  overflow-x: auto;
  max-width: 100%;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
  position: relative;
}

.category-item:hover {
  background: rgba(26, 115, 232, 0.08);
}

.category-item.active {
  background: var(--primary-bg);
  box-shadow: 0 1px 4px rgba(26, 115, 232, 0.15);
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-secondary);
  transition: all 0.3s ease;
}

.category-item.active .category-dot {
  background: var(--primary-color);
}

.category-name {
  font-size: 14px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
  font-weight: 500;
}

.category-item.active .category-name {
  color: var(--primary-color);
}
</style>