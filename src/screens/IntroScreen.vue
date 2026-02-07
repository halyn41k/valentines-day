<template>
  <section class="screen-card">
    <h1>Привіт 💗</h1>
    <p>Цей сайт призначений тільки для однієї людини. Ти — Віталік?</p>
    <div class="row-buttons">
      <button class="pixel-btn" @click="goNext">Так 😼</button>
      <button class="pixel-btn ghost" @click="goNext">А хто питає? 👀</button>
    </div>
    <button class="pixel-btn audio" @click="activateAudio">{{ audioButtonText }}</button>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { playClick, toggleAudio } from '../lib/audio'

const emit = defineEmits(['next'])
const audioEnabled = ref(false)

const audioButtonText = computed(() => (audioEnabled.value ? 'Вимкнути звук 🔇' : 'Увімкнути звук 🔊'))

function goNext() {
  playClick()
  emit('next')
}

function activateAudio() {
  const state = toggleAudio()
  audioEnabled.value = state
}
</script>
