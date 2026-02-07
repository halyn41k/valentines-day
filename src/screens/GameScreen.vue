<template>
  <section class="screen-card game">
    <h2>Знайди наші пари 💘</h2>
    <p class="attempts">Спроб: {{ attempts }}</p>

    <div class="grid">
      <button
        v-for="card in cards"
        :key="card.uid"
        class="memory-card"
        :class="{ flipped: card.flipped || card.matched }"
        @click="flipCard(card)"
      >
        <span v-if="card.flipped || card.matched">{{ card.value }}</span>
        <span v-else>💗</span>
      </button>
    </div>

    <button v-if="finished" class="pixel-btn" @click="goNext">Далі 💖</button>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { playClick } from '../lib/audio'

const emit = defineEmits(['next'])
const baseValues = ['Обійми', 'Кава', 'Лондон', 'Україна', 'Ти + Я', 'Дім']

function shuffledDeck() {
  return [...baseValues, ...baseValues]
    .map((value, index) => ({ uid: `${value}-${index}-${Math.random()}`, value, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5)
}

const cards = ref(shuffledDeck())
const opened = ref([])
const attempts = ref(0)
const lock = ref(false)
const finished = ref(false)

function flipCard(card) {
  if (lock.value || card.flipped || card.matched || opened.value.length === 2) return

  playClick()
  card.flipped = true
  opened.value.push(card)

  if (opened.value.length === 2) {
    attempts.value += 1
    const [first, second] = opened.value

    if (first.value === second.value) {
      first.matched = true
      second.matched = true
      opened.value = []
      finished.value = cards.value.every((entry) => entry.matched)
      return
    }

    lock.value = true
    setTimeout(() => {
      first.flipped = false
      second.flipped = false
      opened.value = []
      lock.value = false
    }, 700)
  }
}

function goNext() {
  playClick()
  emit('next')
}
</script>
