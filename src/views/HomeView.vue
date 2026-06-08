<template>
  <div class="home-view">
    <LogoHeader />
    <BottomNavbar />
    <!-- 首页内容区域，待设计 -->
  </div>
</template>

<script setup lang="ts">
import LogoHeader from '@/components/LogoHeader.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  position: relative;
  background: transparent;
}
</style>
