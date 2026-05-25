<template>
  <div class="particle-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animationId: number | null = null
let particles: Particle[] = []
let mouseX = -1000
let mouseY = -1000

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
}

const PARTICLE_COUNT = 30
const MOUSE_RADIUS = 120

function initParticles(width: number, height: number) {
  particles = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      life: 1,
      maxLife: 1,
    })
  }
}

function drawParticles(width: number, height: number) {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)

  // 更新粒子位置
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy

    if (p.x < 0 || p.x > width) p.vx *= -1
    if (p.y < 0 || p.y > height) p.vy *= -1
  }

  // 鼠标交互
  for (const p of particles) {
    if (!p) continue
    const dx = p.x - mouseX
    const dy = p.y - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < MOUSE_RADIUS) {
      p.vx += (mouseX - p.x) * 0.0001
      p.vy += (mouseY - p.y) * 0.0001

      // 鼠标到粒子的连线
      ctx.beginPath()
      ctx.strokeStyle = `rgba(26, 115, 232, ${(1 - dist / MOUSE_RADIUS) * 0.3})`
      ctx.lineWidth = 0.8
      ctx.moveTo(mouseX, mouseY)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }

    // 绘制粒子
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(26, 115, 232, 0.2)'
    ctx.fill()
  }

  // 处理点击产生的粒子（带生命周期）
  for (let i = particles.length - 1; i >= PARTICLE_COUNT; i--) {
    const p = particles[i]
    if (!p) continue
    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.98
    p.vy *= 0.98
    p.life -= 0.02

    if (p.life <= 0) {
      particles.splice(i, 1)
      continue
    }

    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(26, 115, 232, ${p.life * 0.5})`
    ctx.fill()
  }

  animationId = requestAnimationFrame(() => drawParticles(width, height))
}

function handleMouseMove(e: MouseEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (rect) {
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }
}

function handleClick(e: MouseEvent) {
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect || !ctx) return

  const clickX = e.clientX - rect.left
  const clickY = e.clientY - rect.top

  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12
    const speed = Math.random() * 2 + 0.5
    particles.push({
      x: clickX,
      y: clickY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 3 + 1,
      life: 1,
      maxLife: 1,
    })
  }

  if (particles.length > 150) {
    particles = [...particles.slice(0, PARTICLE_COUNT), ...particles.slice(-100)]
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initParticles(canvas.width, canvas.height)
  }

  ctx = canvas.getContext('2d')
  resize()
  drawParticles(canvas.width, canvas.height)

  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('click', handleClick)

  onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('click', handleClick)
  })
})
</script>

<style scoped>
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>