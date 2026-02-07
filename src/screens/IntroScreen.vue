<template>
  <section class="screen-card">
    <h1>Привіт 💗</h1>

    <!-- Стан 1: питання -->
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

    <!-- Стан 2: пароль -->
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
          autocomplete="one-time-code"
          placeholder="Введи 4 цифри"
          @keydown.enter="submitPassword"
        />
        <button class="pixel-btn" @click="submitPassword">
          Увійти →
        </button>
      </div>

      <p v-if="error" class="error">
        Нєє 😈 Неправильно. Спробуй ще раз.
      </p>

      <div class="row-buttons">
        <button class="pixel-btn ghost" @click="backToQuestion">
          ← Назад
        </button>
        <button class="pixel-btn audio" @click="activateAudio">
          {{ audioButtonText }}
        </button>
      </div>
    </template>

    <!-- Стан 3: чужий -->
    <template v-else>
      <p class="go-away">Виходи звідси 🖕</p>
      <button class="pixel-btn ghost" @click="backToQuestion">
        ← Я пожартував
      </button>
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { playClick, toggleAudio, isAudioEnabled } from '../lib/audio'

const emit = defineEmits(['next'])

const audioEnabled = ref(isAudioEnabled())
const stage = ref('question') // 'question' | 'password' | 'stranger'

const password = ref('')
const error = ref(false)

const audioButtonText = computed(() =>
  audioEnabled.value ? 'Вимкнути звук 🔇' : 'Увімкнути звук 🔊'
)

function activateAudio() {
  const state = toggleAudio()
  audioEnabled.value = state
  playClick()
}

function chooseVitalik() {
  playClick()
  stage.value = 'password'
  password.value = ''
  error.value = false
}

function chooseStranger() {
  playClick()
  stage.value = 'stranger'
}

function backToQuestion() {
  playClick()
  stage.value = 'question'
  password.value = ''
  error.value = false
}

function submitPassword() {
  playClick()
  if (password.value.trim() === '5322') {
    error.value = false
    emit('next')
    return
  }
  error.value = true
  password.value = ''
}
</script>

<style scoped>
/* ---------- layout ---------- */

.row-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 12px;
}

.sub {
  margin: 0 0 8px;
}

.hint {
  font-size: 12px;
  opacity: 0.9;
  margin: 0 0 14px;
  line-height: 1.5;
}

.pass-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 10px 0 8px;
}

/* ---------- INPUT: PIXEL FIX ---------- */

.pixel-input {
  /* ШРИФТ — ОЦЕ ГОЛОВНЕ */
  font-family: "PixelUA", system-ui, sans-serif;

  background: #fff0f6;
  border: 3px solid #ff7dbd; /* рожевий бордер */
  border-radius: 12px;

  padding: 10px 12px;
  font-size: 14px;
  letter-spacing: 1px;

  color: var(--text);
  width: min(280px, 100%);
  outline: none;

  /* прибираємо дефолтні стилі браузера */
  appearance: none;
  -webkit-appearance: none;
}

/* піксельний фокус */
.pixel-input:focus {
  background: #ffffff;
  border-color: #ff4fa3;
  box-shadow:
    0 0 0 3px rgba(255, 79, 163, 0.25),
    inset 0 0 0 2px #ffffff;
}

/* placeholder теж піксельний */
.pixel-input::placeholder {
  font-family: "PixelUA", system-ui, sans-serif;
  opacity: 0.7;
}

/* ---------- misc ---------- */

.error {
  margin: 8px 0 0;
  font-size: 12px;
  color: #7a144b;
  font-weight: 700;
}

.go-away {
  font-size: 18px;
  margin: 10px 0 14px;
}

.audio {
  margin-top: 14px;
}
</style>
