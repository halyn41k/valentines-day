<template>
  <section class="screen-card">
    <h2>Відстань між нами 🌍</h2>

    <div class="pixel-map" :class="{ glow: animate }">
      <div class="point ua">
        <span>🇺🇦</span>
        <small>Україна</small>
      </div>
      <div class="line-wrap">
        <div class="distance-line"></div>
      </div>
      <div class="point uk">
        <span>🇬🇧</span>
        <small>Лондон</small>
      </div>
    </div>

    <p class="km">Між нами ≈ 2 000 км</p>
    <p class="caption">
      Кілометри — це просто цифри.<br />
      Вони не знають, що таке чекати.
    </p>

    <button class="pixel-btn" @click="goNext">Далі →</button>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { playClick } from '../lib/audio'

const emit = defineEmits(['next'])
const animate = ref(false)

function goNext() {
  playClick()
  emit('next')
}

onMounted(() => {
  setTimeout(() => {
    animate.value = true
  }, 450)
})
</script>
