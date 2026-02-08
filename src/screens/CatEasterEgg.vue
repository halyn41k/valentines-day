<template>
  <!-- котик -->
  <div
    class="cat-wrapper"
    :class="{ run: isRunning }"
    @click="handleClick"
  >
    <img src="/cat.gif" alt="cat" class="cat" />
  </div>

  <!-- пасхалка -->
  <transition name="fade">
    <div v-if="open" class="egg">
      <p v-html="currentText"></p>

      <button class="pixel-btn ghost small" @click="close">
        закрити
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { playClick } from '../lib/audio'

const open = ref(false)
const isRunning = ref(false)
const hasRunOnce = ref(false)

/* 🐱 фрази пасхалки */
const texts = [
  'я тут просто гріюсь 🐾<br/><b>і ти мій улюблений дім 💗</b>',
  'мяу… я знаю твій секрет 😼<br/><b>вона дуже тебе любить</b>',
  'ти знайшов котика 🐱<br/><b>це значить, що ти уважний</b>',
  'я тут випадково…<br/><b>але тепер не піду 💞</b>',
  'давай ти зможеш я вірю в тебе!!!</b>',
]

const currentText = ref(texts[0])

/* мурчання */
const meow = new Audio('audio/meow.mp3')
meow.volume = 0.6

function handleClick() {
  playClick()
  meow.currentTime = 0
  meow.play().catch(() => {})

  // перший клік — тікає
  if (!hasRunOnce.value) {
    hasRunOnce.value = true
    runAway()
    return
  }

  // далі — пасхалка
  currentText.value = texts[Math.floor(Math.random() * texts.length)]
  open.value = !open.value
}

function runAway() {
  isRunning.value = true
  setTimeout(() => {
    isRunning.value = false
  }, 700)
}

function close() {
  playClick()
  open.value = false
}
</script>

<style scoped>
/* котик */
.cat-wrapper {
  position: fixed;
  right: 16px;
  bottom: 24px;
  z-index: 10;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.cat-wrapper.run {
  transform: translateX(120px) translateY(40px) rotate(8deg);
}

.cat {
  width: 72px;
  opacity: 0.8;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.cat-wrapper:hover .cat {
  transform: scale(1.05);
  opacity: 1;
}

/* пасхалка */
.egg {
  position: fixed;
  right: 110px;
  bottom: 40px;
  max-width: 220px;

  background: #fff0f6;
  border: 3px solid #ff7dbd;
  border-radius: 14px;
  padding: 12px;

  font-size: 12px;
  line-height: 1.4;
  z-index: 11;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.small {
  margin-top: 8px;
  font-size: 11px;
}

/* анімація */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
