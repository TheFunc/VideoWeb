import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCategories, getVideoList } from '@/api'

export interface Category {
  id: number
  type: string
}

export interface VideoItem {
  id: number
  coverPath: string
  videoPath: string
  videoType: string
  videoGroup: string
  description: string
}

export interface VideoGroup {
  groupName: string
  cover: string
  description: string
  videos: VideoItem[]
}

const MEDIA_BASE = 'http://127.0.0.1:8000'

export const useVideoStore = defineStore('video', () => {
  const categories = ref<Category[]>([])
  const currentCategoryId = ref<number | null>(null)
  const allVideos = ref<VideoItem[]>([])
  const loading = ref(false)
  const searchKeyword = ref<string>('')

  // 根据当前分类过滤后的视频
  const filteredVideos = computed(() => {
    const currentCategory = categories.value.find(c => c.id === currentCategoryId.value)
    if (!currentCategory) return []
    return allVideos.value.filter(v => v.videoType === currentCategory.type)
  })

  // 按 videoGroup 分组
  const videoGroups = computed(() => {
    const groups: Record<string, VideoItem[]> = {}
    filteredVideos.value.forEach(v => {
      if (!groups[v.videoGroup]) {
        groups[v.videoGroup] = []
      }
      const group = groups[v.videoGroup]
      if (group) {
        group.push(v)
      }
    })
    return Object.entries(groups).map(([groupName, videos]) => ({
      groupName,
      cover: videos[0]?.coverPath ? `${MEDIA_BASE}/${videos[0].coverPath}` : '',
      description: videos[0]?.description || '',
      videos,
    }))
  })

  // 搜索结果
  const searchResults = computed(() => {
    if (!searchKeyword.value.trim()) return []
    
    const keyword = searchKeyword.value.toLowerCase().trim()
    const results: VideoItem[] = []
    
    allVideos.value.forEach(video => {
      const matchName = video.description?.toLowerCase().includes(keyword)
      const matchGroup = video.videoGroup?.toLowerCase().includes(keyword)
      const matchType = video.videoType?.toLowerCase().includes(keyword)
      
      if (matchName || matchGroup || matchType) {
        results.push(video)
      }
    })
    
    return results
  })

  // 是否有搜索内容
  const isSearching = computed(() => {
    return searchKeyword.value.trim().length > 0
  })

  // 获取分类列表
  async function fetchCategories() {
    try {
      const data = await getCategories()
      if (Array.isArray(data) && data.length > 0) {
        categories.value = data as Category[]
      } else {
        throw new Error('Empty data')
      }
    } catch (error) {
      console.warn('获取分类失败:', error)
    }
    if (categories.value.length > 0 && currentCategoryId.value === null) {
      currentCategoryId.value = categories.value[0]!.id
    }
  }

  // 获取所有视频
  async function fetchAllVideos() {
    loading.value = true
    try {
      const data = await getVideoList()
      if (Array.isArray(data) && data.length > 0) {
        allVideos.value = data as VideoItem[]
      } else {
        throw new Error('Empty data')
      }
    } catch (error) {
      console.warn('获取视频列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 切换分类
  function switchCategory(categoryId: number) {
    if (categoryId === currentCategoryId.value) return
    currentCategoryId.value = categoryId
  }

  // 设置搜索关键词
  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  // 清空搜索
  function clearSearch() {
    searchKeyword.value = ''
  }

  // 获取视频完整路径 - 使用流式传输接口支持 Range 请求
  function getVideoFullPath(videoPath: string): string {
    const encodedPath = encodeURIComponent(videoPath)
    return `${MEDIA_BASE}/api/v1/video/stream/${encodedPath}`
  }

  return {
    categories,
    currentCategoryId,
    videoGroups,
    allVideos,
    loading,
    searchKeyword,
    searchResults,
    isSearching,
    fetchCategories,
    fetchAllVideos,
    switchCategory,
    setSearchKeyword,
    clearSearch,
    getVideoFullPath,
  }
})