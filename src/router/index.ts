import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    transition?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '电梯视频',
        transition: 'page-fade',
      },
    },
    {
      path: '/play/:groupName',
      name: 'play',
      component: () => import('@/views/VideoPlayerView.vue'),
      meta: {
        title: '视频播放',
        transition: 'page-fade',
      },
    },
    {
      path: '/safety-instruction',
      name: 'safety-instruction',
      component: () => import('@/views/SafetyInstructionView.vue'),
      meta: {
        title: '电梯使用安全说明',
        transition: 'page-fade',
      },
    },
    {
      path: '/image-text',
      name: 'image-text',
      component: () => import('@/views/ImageTextView.vue'),
      meta: {
        title: '电梯图文说明',
        transition: 'page-fade',
      },
    },
    {
      path: '/regulations',
      name: 'regulations',
      component: () => import('@/views/RegulationsView.vue'),
      meta: {
        title: '法规天地',
        transition: 'page-fade',
      },
    },
    {
      path: '/video-warning',
      name: 'video-warning',
      component: () => import('@/views/VideoWarningView.vue'),
      meta: {
        title: '视频警示',
        transition: 'page-fade',
      },
    },
    {
      path: '/text-detail/:id',
      name: 'text-detail',
      component: () => import('@/views/TextDetailView.vue'),
      meta: {
        title: '文本详情',
        transition: 'page-fade',
      },
    },
  ],
})

export default router