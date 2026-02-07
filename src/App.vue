<template>
  <main class="app-shell">
    <component :is="currentScreen" @next="nextStep" @restart="restart" />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import IntroScreen from './screens/IntroScreen.vue'
import DistanceScreen from './screens/DistanceScreen.vue'
import GameScreen from './screens/GameScreen.vue'
import FinalScreen from './screens/FinalScreen.vue'

const step = ref(1)

const currentScreen = computed(() => {
  if (step.value === 1) return IntroScreen
  if (step.value === 2) return DistanceScreen
  if (step.value === 3) return GameScreen
  return FinalScreen
})

function nextStep() {
  if (step.value < 4) {
    step.value += 1
  }
}

function restart() {
  step.value = 1
}
</script>
