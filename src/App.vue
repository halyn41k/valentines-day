<template>
  <div class="bg-wrapper">
    <!-- GIF фон -->
    <div class="gif-bg"></div>

    <!-- Контент -->
    <main class="app-shell">
      <component
        :is="currentScreen"
        @next="nextStep"
        @restart="restart"
      />
    </main>

    <!-- 🐱 котик пасхалка -->
    <CatEasterEgg />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

import IntroScreen from './screens/IntroScreen.vue'
import DistanceScreen from './screens/DistanceScreen.vue'
import GameScreen from './screens/GameScreen.vue'
import HeartCatchScreen from './screens/HeartCatchScreen.vue'
import WishScreen from './screens/WishScreen.vue'
import FinalScreen from './screens/FinalScreen.vue'

import CatEasterEgg from './screens/CatEasterEgg.vue'

const step = ref(1)

const currentScreen = computed(() => {
  if (step.value === 1) return IntroScreen
  if (step.value === 2) return DistanceScreen
  if (step.value === 3) return GameScreen          // memory
  if (step.value === 4) return HeartCatchScreen    // 💗 ловимо сердечка
  if (step.value === 5) return WishScreen          // 😼 драматичний вибір
  return FinalScreen                               // фінал
})

function nextStep() {
  if (step.value < 6) step.value += 1
}

function restart() {
  step.value = 1
}
</script>

<style>
/* ---------- BACKGROUND ---------- */

.bg-wrapper {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* сам GIF */
.gif-bg {
  position: fixed;
  inset: 0;

  background-image: url('/videos/ezgif-6a070fd1287e6532.gif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  filter: blur(6px) brightness(0.9) saturate(1.1);
  transform: scale(1.08);
  z-index: -2;
}

/* легке рожеве затемнення поверх гіфки */
.gif-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 200, 220, 0.25);
}

/* ---------- CONTENT ---------- */

.app-shell {
  position: relative;
  z-index: 1;

  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
}
</style>
