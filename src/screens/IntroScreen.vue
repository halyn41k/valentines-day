<template>
  <section class="screen-card">
    <h1>Привіт 💗</h1>

    <!-- СТАН 1 -->
    <template v-if="stage === 'question'">
      <p>Цей сайт призначений тільки для однієї людини. Ти — Віталік?</p>

      <div class="row-buttons">
        <button class="pixel-btn" @click="chooseVitalik">Так 😼</button>
        <button class="pixel-btn ghost" @click="chooseStranger">А хто питає? 👀</button>
      </div>

      <button class="pixel-btn audio" @click="activateAudio">
        {{ audioButtonText }}
      </button>
    </template>

    <!-- СТАН 2: ПАРОЛЬ -->
    <template v-else-if="stage === 'password'">
      <h2 class="sub">Окей, тоді пароль 😼</h2>

      <p class="hint">
        Підказка: <b>спільний пароль, який стоїть у нас на телефоні</b>
      </p>

      <div class="pass-row">
        <input
          v-model="password"
          class="pixel-input"
          type="password"
          inputmode="numeric"
          placeholder="Введи 4 цифри"
          @keydown.enter="submit"
        />
      </div>

      <!-- КНОПКА-ВТІКАЧ -->
      <button
        class="pixel-btn runaway"
        :class="{ jiggle: jiggle }"
        :style="buttonStyle"
        @click="submit"
      >
        {{ buttonText }}
      </button>

      <p v-if="error" class="error">Нєє 😈 Неправильно. Спробуй ще раз.</p>

      <div class="row-buttons">
        <button class="pixel-btn ghost" @click="backToQuestion">← Назад</button>
      </div>
    </template>

    <!-- СТАН 3 -->
    <template v-else>
      <p class="go-away">Виходи звідси 🖕</p>
      <button class="pixel-btn ghost" @click="backToQuestion">← Я пожартував</button>
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { playClick, toggleAudio, isAudioEnabled } from '../lib/audio'

const emit = defineEmits(['next'])

const audioEnabled = ref(isAudioEnabled())
const stage = ref('question')

const password = ref('')
const error = ref(false)

/* 🔥 втечі */
const escapeCount = ref(0)
const maxEscapes = 3

const offset = ref({ x: 0, y: 0, r: 0 })
const jiggle = ref(false)

/* 💨 fart */
const fart = new Audio('audio/fart.mp3')
fart.volume = 0.7

const positions = [
  { x: 170, y: -80, r: 8 },
  { x: -160, y: -20, r: -10 },
  { x: 120, y: 95, r: 12 },
]

const audioButtonText = computed(() =>
  audioEnabled.value ? 'Вимкнути звук 🔇' : 'Увімкнути звук 🔊'
)

const buttonText = computed(() => {
  if (escapeCount.value === 0) return 'Увійти →'
  if (escapeCount.value === 1) return 'хі-хі 😼'
  if (escapeCount.value === 2) return 'майже 👀'
  if (escapeCount.value === 3) return 'ну ладно… 💗'
  return 'Увійти →'
})

const buttonStyle = computed(() => ({
  transform: `translate(${offset.value.x}px, ${offset.value.y}px) rotate(${offset.value.r}deg)`,
  transition: 'transform 0.22s cubic-bezier(.2,1.4,.4,1)',
}))

function activateAudio() {
  audioEnabled.value = toggleAudio()
  playClick()
}

function chooseVitalik() {
  playClick()
  stage.value = 'password'
  reset()
}

function chooseStranger() {
  playClick()
  stage.value = 'stranger'
}

function backToQuestion() {
  playClick()
  stage.value = 'question'
  reset()
}

function reset() {
  escapeCount.value = 0
  offset.value = { x: 0, y: 0, r: 0 }
  password.value = ''
  error.value = false
  jiggle.value = false
}

function doJiggle() {
  jiggle.value = false
  requestAnimationFrame(() => {
    jiggle.value = true
    setTimeout(() => (jiggle.value = false), 260)
  })
}

function runAway() {
  const pos = positions[Math.min(escapeCount.value, positions.length - 1)]
  offset.value = pos
  doJiggle()
}

function returnHome() {
  offset.value = { x: 0, y: 0, r: 0 }
  doJiggle()
}

function submit() {
  playClick()

  // 🏃‍♂️ 3 втечі
  if (escapeCount.value < maxEscapes) {
    escapeCount.value += 1
    runAway()

    // 💨 НА ТРЕТІЙ ВТЕЧІ — FART
    if (escapeCount.value === maxEscapes) {
      fart.currentTime = 0
      fart.play().catch(() => {})
    }

    return
  }

  // після 3 втечі — повертається і перевіряє пароль
  returnHome()

  if (password.value.trim() === '5322') {
    emit('next')
    return
  }

  error.value = true
  password.value = ''
}
</script>

<style scoped>
.row-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 12px;
}

.sub {
  margin-bottom: 8px;
}

.hint {
  font-size: 12px;
  margin-bottom: 14px;
  line-height: 1.5;
}

.pass-row {
  margin-bottom: 8px;
}

.pixel-input {
  font-family: "PixelUA", system-ui, sans-serif;
  background: #fff0f6;
  border: 3px solid #ff7dbd;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  width: min(280px, 100%);
  outline: none;
}

.runaway {
  position: relative;
  margin-top: 12px;
  will-change: transform;
}

/* веселий трус */
.jiggle {
  animation: jiggle 0.22s ease;
}

@keyframes jiggle {
  0%   { transform: scale(1); }
  35%  { transform: scale(1.06); }
  70%  { transform: scale(0.98); }
  100% { transform: scale(1); }
}

.error {
  margin-top: 10px;
  font-size: 12px;
  color: #7a144b;
  font-weight: 700;
}

.go-away {
  font-size: 18px;
  margin: 10px 0 14px;
}
</style>
