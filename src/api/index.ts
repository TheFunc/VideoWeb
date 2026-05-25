import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
})

// 响应拦截器 - 提取 data
api.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code === 200) {
      return res.data
    }
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 获取视频分类列表
export function getCategories() {
  return api.get('/video/types')
}

// 获取视频信息列表
export function getVideoList() {
  return api.get('/video/list')
}

// ==================== 图文管理 API ====================

// 获取图片类型列表
export function getImageTextTypes(): Promise<any[]> {
  return api.get('/image-text/types') as Promise<any[]>
}

// 获取图片信息列表（支持关键词搜索和类型筛选）
export function getImageTextList(keyword?: string, imageType?: string): Promise<any[]> {
  const params: Record<string, string> = {}
  if (keyword) params.keyword = keyword
  if (imageType) params.imageType = imageType
  return api.get('/image-text/list', { params }) as Promise<any[]>
}

// 获取图片详情
export function getImageTextDetail(id: number): Promise<any> {
  return api.get(`/image-text/${id}`) as Promise<any>
}

// ==================== 文本管理 API ====================

// 获取文本类型列表
export function getTextTypes(): Promise<any[]> {
  return api.get('/text/types') as Promise<any[]>
}

// 获取文本列表（支持关键词搜索和类型筛选）
export function getTextList(keyword?: string, textType?: string): Promise<any[]> {
  const params: Record<string, string> = {}
  if (keyword) params.keyword = keyword
  if (textType) params.textType = textType
  return api.get('/text/list', { params }) as Promise<any[]>
}

// 获取文本详情
export function getTextDetail(id: number): Promise<any> {
  return api.get(`/text/${id}`) as Promise<any>
}

export default api