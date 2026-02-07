<template>
  <section class="screen-card final">
    <p class="love-text">
      Ми не поруч фізично.<br />
      Але я завжди поруч серцем.<br />
      І я обираю тебе — кожного дня.<br />
      У кожному часовому поясі, у кожному ранку.
    </p>

    <div class="pulse-heart">💖</div>

    <button class="pixel-btn" @click="restart">Переграти ще раз</button>
    <small>З Днем Валентина 💝</small>
  </section>
</template>

<script setup>
import { playClick } from '../lib/audio'

const emit = defineEmits(['restart'])

function restart() {
  playClick()
  emit('restart')
}
</script>
