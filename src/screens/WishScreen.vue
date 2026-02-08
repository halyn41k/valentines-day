<template>
  <section class="screen-card wish">
    <h2>Скажи чесно 😼</h2>
    <p class="sub">Чого тобі хочеться найбільше прямо зараз?</p>

    <!-- ВИБІР -->
    <div v-if="!picked" class="choices">
      <button class="pixel-btn choice" @click="pick('hug')">Обійняти тебе 🫂</button>
      <button class="pixel-btn choice" @click="pick('kiss')">Поцілунок 😽</button>
      <button class="pixel-btn choice" @click="pick('walk')">Просто погуляти разом 🚶‍♂️💗🚶‍♀️</button>
      <button class="pixel-btn choice" @click="pick('sleep')">Заснути поряд 😴</button>
      <button class="pixel-btn ghost choice" @click="pick('all')">Все одразу 😳💞</button>
    </div>

    <!-- ВІДПОВІДЬ -->
    <transition name="fade">
      <div v-if="picked" class="answer">
        <div class="big-heart">💗</div>
        <p class="text" v-html="answerHtml"></p>

        <button class="pixel-btn" @click="goNext">Далі →</button>
        <button class="pixel-btn ghost" @click="reset">Перевибрати</button>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { playClick, playSound } from '../lib/audio'

const emit = defineEmits(['next'])

const picked = ref('') // '' | hug | kiss | walk | sleep | all

function pick(val) {
  playClick()
  picked.value = val

  // базовий "дзинь"
  playSound('/audio/pop.mp3', { volume: 0.45 })

  // спец-звук під вибір
  if (val === 'kiss') {
    playSound('audio/kiss.mp3', { volume: 0.7 })
  }
  if (val === 'sleep') {
    playSound('audio/sleep.mp3', { volume: 0.7 })
  }
}

function reset() {
  playClick()
  picked.value = ''
}

function goNext() {
  playClick()
  emit('next')
}

const answerHtml = computed(() => {
  if (picked.value === 'hug') {
    return `Я б теж зараз тільки цього 😿<br/>Але навіть на відстані — <b>я обіймаю тебе думками</b> щосекунди.`
  }
  if (picked.value === 'kiss') {
    return `Ох 😼<br/>Тоді тримай <b>віртуальний поцілунок</b> 😽💗<br/>І ще один. І ще один.`
  }
  if (picked.value === 'walk') {
    return `Мрія…<br/>Я би взяла тебе за руку і ми б просто йшли,<br/>ніби <b>ніяких кілометрів не існує</b>.`
  }
  if (picked.value === 'sleep') {
    return `Це найсолодше 😴<br/>Я хочу, щоб ти заснув спокійно,<br/>з думкою що <b>тебе люблять</b>.`
  }
  if (picked.value === 'all') {
    return `ХАХАХА, правильно <br/>Окей, тоді план такий:<br/><b>обійми → поцілунок → прогулянка → сон</b><br/>і ніяких заперечень 😼`
  }
  return ''
})
</script>

<style scoped>
.wish {
  text-align: center;
}

.sub {
  font-size: 12px;
  opacity: 0.9;
  margin: 6px 0 14px;
  line-height: 1.4;
}

.choices {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.choice {
  width: min(420px, 100%);
  margin: 0 auto;
}

.answer {
  margin-top: 8px;
  padding-top: 6px;
}

.big-heart {
  font-size: 32px;
  animation: pulse 0.9s ease-in-out infinite;
  margin-bottom: 6px;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.12); }
  100% { transform: scale(1); }
}

.text {
  font-size: 12px;
  line-height: 1.55;
  margin: 10px auto 14px;
  max-width: 420px;
}

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
