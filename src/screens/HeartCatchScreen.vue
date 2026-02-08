<template>
  <section class="screen-card heart-game">
    <h2>Злови сердечка 💗</h2>

    <!-- HP -->
    <div class="hp-row" aria-label="hp">
      <img
        v-for="i in maxHp"
        :key="i"
        src="/photos/hp.png"
        class="hp"
        :class="{ lost: hp < i }"
        alt=""
      />
    </div>

    <!-- поле гри -->
    <div class="game-area" ref="area">
      <img
        v-for="heart in hearts"
        :key="heart.id"
        src="/photos/heart.png"
        class="heart"
        :style="{ left: heart.x + 'px', top: heart.y + 'px' }"
        @click="catchHeart(heart.id)"
        alt=""
      />
    </div>

    <p class="counter">
      Зловлено: {{ caught }} / {{ goal }}
      <span class="lvl">• Рівень: {{ levelLabel }}</span>
    </p>

    <div class="actions">
      <button class="pixel-btn ghost" @click="restartGame">Заново 🔁</button>
      <button v-if="finished" class="pixel-btn" @click="goNext">Далі 💖</button>
    </div>

    <p v-if="lostAll" class="note">Ай 😼 життя закінчились, але ти молодець!</p>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { playSound } from '../lib/audio'

const emit = defineEmits(['next'])

const area = ref(null)

const maxHp = 3
const hp = ref(3)

const goal = 222
const caught = ref(0)

const hearts = ref([])
const finished = ref(false)
const lostAll = ref(false)

let nextId = 1
let rafId = null
let lastSpawnAt = 0

function sfxCatch() {
  playSound('audio/pop.mp3', { volume: 0.6 })
}
function sfxMiss() {
  playSound('audio/fail.mp3', { volume: 0.7 })
}

/* --------- DIFFICULTY CURVE ---------
   progress: 0..1
   spawnInterval: з 650ms → до ~220ms
   ttl: з 1300ms → до ~520ms
------------------------------------- */
const progress = computed(() => Math.min(1, caught.value / goal))

const spawnIntervalMs = computed(() => {
  // плавно прискорюємо
  const min = 220
  const max = 650
  return Math.round(max - (max - min) * progress.value)
})

const ttlMs = computed(() => {
  const min = 520
  const max = 1300
  return Math.round(max - (max - min) * progress.value)
})

const maxOnScreen = computed(() => {
  // щоб не було “каші” і лагів
  // на початку мало, потім трохи більше
  if (progress.value < 0.25) return 6
  if (progress.value < 0.6) return 8
  return 10
})

const levelLabel = computed(() => {
  if (progress.value < 0.25) return 'Легко 😼'
  if (progress.value < 0.6) return 'Норм 👀'
  if (progress.value < 0.85) return 'Важко 🔥'
  return 'ХАРДКОР 💀💗'
})

function spawnHeart() {
  if (!area.value || finished.value) return
  if (hearts.value.length >= maxOnScreen.value) return

  const pad = 40
  const w = Math.max(0, area.value.clientWidth - pad)
  const h = Math.max(0, area.value.clientHeight - pad)

  const heartId = nextId++
  const heart = {
    id: heartId,
    x: Math.random() * w,
    y: Math.random() * h,
  }

  hearts.value.push(heart)

  // якщо не впіймали за TTL — мінус HP
  const localTtl = ttlMs.value
  setTimeout(() => {
    const idx = hearts.value.findIndex((x) => x.id === heartId)
    if (idx !== -1 && !finished.value) {
      hearts.value.splice(idx, 1)
      hp.value -= 1
      sfxMiss()

      if (hp.value <= 0) {
        lostAll.value = true
        endGame()
      }
    }
  }, localTtl)
}

function catchHeart(heartId) {
  if (finished.value) return
  const idx = hearts.value.findIndex((x) => x.id === heartId)
  if (idx !== -1) hearts.value.splice(idx, 1)

  caught.value += 1
  sfxCatch()

  if (caught.value >= goal) {
    endGame()
  }
}

function endGame() {
  finished.value = true
  hearts.value = []
}

function restartGame() {
  hp.value = maxHp
  caught.value = 0
  finished.value = false
  lostAll.value = false
  hearts.value = []
  lastSpawnAt = 0
}

function goNext() {
  emit('next')
}

/* --------- GAME LOOP (requestAnimationFrame) ---------
   Спавнимо по часу, щоб інтервал можна було міняти “на льоту”
------------------------------------------------------- */
function loop(ts) {
  if (!finished.value) {
    if (ts - lastSpawnAt >= spawnIntervalMs.value) {
      lastSpawnAt = ts
      spawnHeart()
    }
  }
  rafId = requestAnimationFrame(loop)
}

onMounted(() => {
  rafId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.heart-game {
  text-align: center;
}

.hp-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 8px 0 6px;
}

.hp {
  width: 22px;
}
.hp.lost {
  filter: grayscale(1) opacity(0.25);
}

.game-area {
  position: relative;
  width: min(360px, 100%);
  height: min(360px, 60vh);
  margin: 12px auto 8px;
  border-radius: 16px;
  background: rgba(255, 240, 246, 0.88);
  border: 3px solid #ff7dbd;
  overflow: hidden;
}

.heart {
  position: absolute;
  width: 34px;
  cursor: pointer;
  animation: pop 0.18s ease;
  user-select: none;
}

@keyframes pop {
  from { transform: scale(0.7); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.counter {
  font-size: 12px;
  margin: 6px 0 10px;
}

.lvl {
  opacity: 0.85;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.note {
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.9;
}
</style>
