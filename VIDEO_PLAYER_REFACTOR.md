# Video.js 播放器重构说明

## 📦 已完成的更新

### 1. 安装的依赖
- ✅ `video.js` - 核心播放器库
- ✅ `@videojs/http-streaming` - HLS/DASH 流媒体支持

### 2. 新增组件
- ✅ `src/components/VideoPlayer.vue` - Video.js 封装组件

### 3. 更新的视图
- ✅ `src/views/VideoPlayerView.vue` - 使用新的 VideoPlayer 组件

---

## 🎯 新功能特性

### ✨ 核心功能
1. **多格式支持**
   - MP4、WebM、OGG 等常见格式
   - HLS (.m3u8) 流媒体
   - DASH (.mpd) 流媒体

2. **播放控制**
   - 播放/暂停
   - 进度条拖动（支持 seek）
   - 音量调节
   - 全屏切换
   - 倍速播放（0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x）

3. **用户体验**
   - 自动播放下一个视频
   - 加载状态提示
   - 错误处理和重试机制
   - 键盘快捷键支持
   - 响应式设计（移动端适配）

4. **主题适配**
   - 自动适配深色/浅色模式
   - 自定义控制栏样式
   - 与项目 UI 风格统一

---

## 🔧 使用方法

### 基础用法
```vue
<template>
  <VideoPlayer
    :src="videoUrl"
    :poster="coverUrl"
    :autoplay="true"
    @play="onPlay"
    @pause="onPause"
    @error="onError"
  />
</template>

<script setup lang="ts">
import VideoPlayer from '@/components/VideoPlayer.vue'

const videoUrl = 'http://127.0.0.1:8000/storage/videos/test.mp4'
const coverUrl = 'http://127.0.0.1:8000/storage/covers/test.jpg'

function onPlay() {
  console.log('视频开始播放')
}

function onPause() {
  console.log('视频暂停')
}

function onError(error: Error) {
  console.error('播放错误:', error)
}
</script>
```

### Props 参数
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 视频地址（必填） |
| poster | string | - | 封面图地址 |
| autoplay | boolean | false | 是否自动播放 |
| muted | boolean | false | 是否静音 |
| loop | boolean | false | 是否循环播放 |
| playbackRates | number[] | [0.5, 0.75, 1, 1.25, 1.5, 2] | 可选倍速列表 |
| preload | 'auto' \| 'metadata' \| 'none' | 'auto' | 预加载策略 |

### Events 事件
| 事件名 | 参数 | 说明 |
|--------|------|------|
| play | - | 视频开始播放 |
| pause | - | 视频暂停 |
| ended | - | 视频播放结束 |
| error | Error | 播放错误 |
| timeupdate | currentTime, duration | 播放进度更新 |
| loadedmetadata | - | 元数据加载完成 |

### 暴露的方法
通过 `ref` 可以访问播放器实例和方法：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import VideoPlayer from '@/components/VideoPlayer.vue'

const videoPlayerRef = ref<any>(null)

// 播放
function play() {
  videoPlayerRef.value?.play()
}

// 暂停
function pause() {
  videoPlayerRef.value?.pause()
}

// 设置/获取当前时间
function seek(time: number) {
  videoPlayerRef.value?.currentTime(time)
}

// 获取播放器实例
function getPlayer() {
  return videoPlayerRef.value?.player
}
</script>
```

---

## 🎨 自定义样式

Video.js 的样式已经过定制，匹配项目主题。如需进一步自定义，可以在组件中覆盖：

```css
/* 修改播放按钮颜色 */
:deep(.video-js .vjs-big-play-button) {
  background-color: your-color;
}

/* 修改进度条颜色 */
:deep(.video-js .vjs-play-progress) {
  background: your-color;
}

/* 修改控制栏背景 */
:deep(.video-js .vjs-control-bar) {
  background: your-gradient;
}
```

---

## ⚠️ 注意事项

### 1. 后端配置
确保后端服务器支持 HTTP Range 请求，否则进度条拖动可能无法正常工作。

**Nginx 配置示例：**
```nginx
location /storage/ {
    # 确保启用 range 请求
    add_header Accept-Ranges bytes;
}
```

### 2. 跨域问题
如果视频资源在不同域名下，需要配置 CORS：

```nginx
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods "GET, OPTIONS";
add_header Access-Control-Allow-Headers "Range";
```

### 3. 自动播放限制
现代浏览器通常阻止带声音的自动播放。建议：
- 首次播放时使用 `muted` 属性
- 或等待用户交互后再播放

### 4. 内存管理
组件卸载时会自动销毁播放器实例，无需手动清理。

---

## 🐛 常见问题

### Q1: 视频无法播放？
**检查清单：**
1. 视频路径是否正确
2. 后端服务是否运行
3. 浏览器控制台是否有错误信息
4. 视频格式是否支持

### Q2: 进度条拖动无效？
**解决方案：**
1. 确认后端支持 Range 请求
2. 检查视频文件是否损坏
3. 查看 Network 面板中的 Content-Range 响应头

### Q3: 自动播放不生效？
**原因：** 浏览器安全策略限制  
**解决：** 
- 添加 `muted` 属性
- 或在用户点击后触发播放

### Q4: 如何添加字幕？
Video.js 支持 WebVTT 字幕，可以通过以下方式添加：

```vue
<VideoPlayer :src="videoUrl">
  <track
    kind="subtitles"
    src="/path/to/subtitles.vtt"
    srclang="zh"
    label="中文"
    default
  />
</VideoPlayer>
```

---

## 📊 性能优化建议

1. **预加载策略**
   - 列表页使用 `preload="metadata"`
   - 播放页使用 `preload="auto"`

2. **封面图优化**
   - 使用适当尺寸的封面图
   - 考虑使用 WebP 格式

3. **视频编码**
   - 推荐使用 H.264 编码（兼容性最好）
   - 码率控制在合理范围

4. **懒加载**
   - 不在视口中的视频可以不初始化播放器

---

## 🔄 后续扩展方向

1. **画中画（PiP）功能**
2. **弹幕支持**
3. **截图功能**
4. **播放历史记录**
5. **画质切换**（需后端提供多清晰度）
6. **广告插入**
7. **DRM 加密支持**

---

## 📝 技术栈对比

| 特性 | 原生 video | Video.js |
|------|-----------|----------|
| 多格式支持 | ❌ | ✅ |
| HLS/DASH | ❌ | ✅ |
| 倍速播放 | ⚠️ 部分支持 | ✅ |
| 自定义UI | ⚠️ 困难 | ✅ |
| 插件生态 | ❌ | ✅ |
| 响应式 | ⚠️ 需手动 | ✅ |
| 无障碍支持 | ⚠️ 基础 | ✅ |
| 社区支持 | ✅ | ✅✅ |

---

## ✅ 测试清单

- [x] 视频正常播放
- [x] 进度条拖动正常
- [x] 音量控制正常
- [x] 全屏切换正常
- [x] 倍速切换正常
- [x] 自动播放下一个
- [x] 错误处理正常
- [x] 深色/浅色模式适配
- [x] 移动端响应式
- [x] 视频切换流畅

---

**重构完成！** 🎉

如有任何问题，请查看 Video.js 官方文档：https://docs.videojs.com/
