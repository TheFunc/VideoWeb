<template>
  <div class="safety-instruction-view">
    <ParticleEffect />
    <header class="page-header">
      <button class="back-button" @click="goBack">
        <span class="back-icon">←</span>
        <span>返回</span>
      </button>
      <h1 class="page-title">电梯使用安全说明</h1>
    </header>
    
    <!-- 底部导航栏 -->
    <BottomNavbar />
    
    <div class="content-container">
      <div class="instruction-card">
        <h2 class="section-title">一、乘梯前注意事项</h2>
        <ul class="instruction-list">
          <li>请勿在电梯门口逗留，以免影响他人通行</li>
          <li>请确认电梯轿厢是否到达本层，避免踏空</li>
          <li>行动不便者乘梯时请寻求协助</li>
          <li>请勿携带易燃、易爆等危险物品乘坐电梯</li>
        </ul>

        <h2 class="section-title">二、乘梯时注意事项</h2>
        <ul class="instruction-list">
          <li>进入电梯后，请按亮所需楼层按钮</li>
          <li>请勿在电梯内跳跃、打闹或倚靠电梯门</li>
          <li>请勿强行扒开电梯门或阻挡电梯门关闭</li>
          <li>如电梯超载报警，最后进入的乘客应主动退出</li>
          <li>请妥善保管随身物品，避免遗落在电梯内</li>
        </ul>

        <h2 class="section-title">三、紧急情况处理</h2>
        <ul class="instruction-list">
          <li>如遇电梯故障被困，请保持冷静，不要惊慌</li>
          <li>请使用电梯内的紧急呼叫按钮或拨打救援电话</li>
          <li>请勿强行扒门或试图从轿厢顶部爬出</li>
          <li>请耐心等待救援人员到来，切勿自行脱困</li>
        </ul>

        <h2 class="section-title">四、禁止行为</h2>
        <ul class="instruction-list">
          <li>严禁在电梯内吸烟、吐痰或乱扔垃圾</li>
          <li>严禁用电梯运送超长、超重物品</li>
          <li>严禁擅自开启电梯检修门或操作控制柜</li>
          <li>严禁在火灾、地震等灾害发生时使用电梯</li>
        </ul>

        <div class="emergency-contact">
          <h3 class="contact-title">紧急联系电话</h3>
          <p class="contact-info">电梯维保热线：<strong>400-XXX-XXXX</strong></p>
          <!-- <p class="contact-info">物业管理处：<strong>XXX-XXXXXXXX</strong></p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import ParticleEffect from '@/components/ParticleEffect.vue'
import BottomNavbar from '@/components/BottomNavbar.vue'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.safety-instruction-view {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  transition: background 0.3s ease;
}

/* 深色模式下的背景 */
body.dark-mode .safety-instruction-view {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
}

.page-header {
  position: relative;
  z-index: 10;
  height: var(--header-height);
  display: flex;
  align-items: center;
  padding: 0 30px;
  background: #ffffff;
  border-bottom: 1px solid var(--border-color);
  gap: 20px;
  transition: all 0.3s ease;
}

/* 深色模式下的页面头部 */
body.dark-mode .page-header {
  background: var(--bg-card);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

body.dark-mode .back-button {
  border-color: #60a5fa;
  color: #60a5fa;
}

body.dark-mode .back-button:hover {
  background: #60a5fa;
  color: #1a1f2e;
}

.back-button:hover {
  background: var(--primary-color);
  color: white;
}

.back-icon {
  font-size: 18px;
  font-weight: bold;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
}

body.dark-mode .page-title {
  color: #e2e8f0;
}

.content-container {
  position: relative;
  z-index: 10;
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
}

.instruction-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* 深色模式下的内容卡片 */
body.dark-mode .instruction-card {
  background: var(--bg-card);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
  margin-top: 30px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--border-color);
  transition: color 0.3s ease, border-color 0.3s ease;
}

body.dark-mode .section-title {
  color: #60a5fa;
  border-bottom-color: #334155;
}

.section-title:first-child {
  margin-top: 0;
}

.instruction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instruction-list li {
  padding: 10px 15px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-left: 3px solid var(--primary-color);
  border-radius: 4px;
  color: var(--text-secondary);
  line-height: 1.6;
  transition: all 0.2s ease;
}

/* 深色模式下的列表项 */
body.dark-mode .instruction-list li {
  background: var(--bg-secondary);
}

body.dark-mode .instruction-list li {
  color: #cbd5e1;
  border-left-color: #60a5fa;
}

.instruction-list li:hover {
  background: #e8f0fe;
  transform: translateX(5px);
}

body.dark-mode .instruction-list li:hover {
  background: #475569;
}

.emergency-contact {
  margin-top: 40px;
  padding: 25px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 8px;
  border: 1px solid #ffc107;
  transition: background 0.3s ease, border-color 0.3s ease;
}

body.dark-mode .emergency-contact {
  background: linear-gradient(135deg, #422006 0%, #713f12 100%);
  border-color: #854d0e;
}

.contact-title {
  font-size: 18px;
  font-weight: 600;
  color: #856404;
  margin: 0 0 15px 0;
  transition: color 0.3s ease;
}

body.dark-mode .contact-title {
  color: #fde68a;
}

.contact-info {
  margin: 8px 0;
  color: #856404;
  font-size: 15px;
  transition: color 0.3s ease;
}

body.dark-mode .contact-info {
  color: #fde68a;
}

.contact-info strong {
  color: #d35400;
  transition: color 0.3s ease;
}

body.dark-mode .contact-info strong {
  color: #fb923c;
}

@media (max-width: 768px) {
  .content-container {
    margin: 20px auto;
  }

  .instruction-card {
    padding: 25px;
  }

  .page-title {
    font-size: 20px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>
