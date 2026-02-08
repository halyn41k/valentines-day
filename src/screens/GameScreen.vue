<template>
  <section class="screen-card game">
    <div class="top">
      <h2>Знайди наші пари 💘</h2>
      <p class="attempts">Спроб: {{ attempts }}</p>
    </div>

    <div class="grid">
      <button
        v-for="card in cards"
        :key="card.uid"
        class="memory-card"
        :class="{ flipped: card.flipped || card.matched }"
        @click="flipCard(card)"
      >
        <template v-if="card.flipped || card.matched">
          <!-- Фото вантажимо ТІЛЬКИ коли відкрито/вгадано -->
          <img
            v-if="card.type === 'img'"
            class="photo"
            :src="card.img"
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span v-else class="label">{{ card.text }}</span>
        </template>

        <span v-else class="back">💗</span>
      </button>
    </div>

    <div class="actions">
      <button class="pixel-btn ghost" @click="reshuffle">Перемішати 🔁</button>
      <button v-if="finished" class="pixel-btn" @click="goNext">Далі 💖</button>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { playClick } from '../lib/audio'

const emit = defineEmits(['next'])

// 8 пар = 16 карток
const pairs = [
  { id: 1, img: '/photos/photo1.webp', text: 'Перше спільне фото' },
  { id: 2, img: '/photos/photo2.webp', text: 'Перше фото перед першим спільним фото' },
  { id: 3, img: '/photos/photo3.webp', text: 'Ми щасливі разом' },
  { id: 4, img: '/photos/photo4.webp', text: 'Останнє спільне фото' },
  { id: 5, img: '/photos/photo5.webp', text: '2 місяці разом' },
  { id: 6, img: '/photos/photo6.webp', text: 'Влітку' },
  { id: 7, img: '/photos/photo7.webp', text: 'Випускний' },
  { id: 8, img: '/photos/photo8.webp', text: 'Лабубик' },
]

function buildDeck() {
  const deck = []
  for (const p of pairs) {
    deck.push({
      uid: `img-${p.id}-${Math.random()}`,
      pairId: p.id,
      type: 'img',
      img: p.img,
      flipped: false,
      matched: false,
    })
    deck.push({
      uid: `txt-${p.id}-${Math.random()}`,
      pairId: p.id,
      type: 'text',
      text: p.text,
      flipped: false,
      matched: false,
    })
  }
  return deck.sort(() => Math.random() - 0.5)
}

const cards = ref(buildDeck())
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
    const [a, b] = opened.value
    const isMatch = a.pairId === b.pairId && a.type !== b.type

    if (isMatch) {
      a.matched = true
      b.matched = true
      opened.value = []
      finished.value = cards.value.every((c) => c.matched)
      return
    }

    lock.value = true
    setTimeout(() => {
      a.flipped = false
      b.flipped = false
      opened.value = []
      lock.value = false
    }, 700)
  }
}

function goNext() {
  playClick()
  emit('next')
}

function reshuffle() {
  playClick()
  cards.value = buildDeck()
  opened.value = []
  attempts.value = 0
  lock.value = false
  finished.value = false
}

/* ✅ Preload фоток у фоні (щоб при перевертанні не чекати) */
function preloadImages(urls) {
  for (const url of urls) {
    const img = new Image()
    img.decoding = 'async'
    img.loading = 'lazy'
    img.src = url
  }
}

onMounted(() => {
  const urls = pairs.map((p) => p.img)

  // щоб не лагало — у "вільний" час
  const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 250))
  ric(() => preloadImages(urls))
})
</script>

<style scoped>
.screen-card.game {
  max-height: calc(100vh - 120px);
  overflow: auto;
  padding-bottom: 14px;
}

.top h2 {
  margin: 0 0 6px;
}
.attempts {
  margin: 0 0 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(8px, 1.2vw, 12px);
  margin: 10px 0 12px;
}

.memory-card {
  aspect-ratio: 1 / 1;
  border: 3px solid var(--border);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(5px, 0.8vw, 8px);
  overflow: hidden;
  min-height: clamp(74px, 9.5vh, 118px);
}

.memory-card:not(.flipped) {
  background: linear-gradient(180deg, #ffe0ef 0%, #ffd2e8 100%);
}

.back {
  font-size: clamp(16px, 2vw, 20px);
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.label {
  font-size: clamp(10px, 1.15vw, 12px);
  line-height: 1.25;
  text-align: center;
  padding: 6px;
}

.actions {
  position: sticky;
  bottom: 0;
  padding-top: 10px;
  background: linear-gradient(
    180deg,
    rgba(255, 241, 246, 0) 0%,
    rgba(255, 241, 246, 0.92) 35%,
    rgba(255, 241, 246, 1) 100%
  );
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
