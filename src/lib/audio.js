// src/lib/audio.js
import { Howl } from 'howler'

let enabled = false
let initialized = false

let click = null
let bgm = null

// кеш для одноразових звуків (pop/fail/meow/fart)
const sfxCache = new Map()

function initIfNeeded() {
  if (initialized) return
  initialized = true

  click = new Howl({
    src: ['/audio/click.mp3'],
    volume: 0.35,
  })

  bgm = new Howl({
    src: ['/audio/bgm.mp3'],
    loop: true,
    volume: 0.0,
  })

  // не валимо додаток, якщо файлів немає/не грузиться
  click.on('loaderror', () => {})
  bgm.on('loaderror', () => {})
}

export function toggleAudio() {
  initIfNeeded()
  enabled = !enabled

  if (enabled) {
    if (!bgm.playing()) bgm.play()
    bgm.fade(bgm.volume(), 0.22, 600)
  } else {
    try {
      bgm.fade(bgm.volume(), 0.0, 300)
      setTimeout(() => {
        if (bgm && bgm.playing()) bgm.stop()
      }, 350)
    } catch (_) {}
  }

  return enabled
}

export function playClick() {
  if (!enabled) return
  initIfNeeded()
  try {
    click.stop()
    click.play()
  } catch (_) {}
}

export function isAudioEnabled() {
  return enabled
}

/**
 * Універсальний SFX (pop/fail/meow/fart і тд)
 * path приклад: '/audio/pop.mp3'
 */
export function playSound(path, opts = {}) {
  if (!enabled) return
  initIfNeeded()

  const volume = typeof opts.volume === 'number' ? opts.volume : 0.6

  try {
    let sfx = sfxCache.get(path)
    if (!sfx) {
      sfx = new Howl({
        src: [path],
        volume,
      })
      sfx.on('loaderror', () => {})
      sfxCache.set(path, sfx)
    } else {
      sfx.volume(volume)
    }

    // щоб один і той самий звук можна було "тик-тик"
    sfx.stop()
    sfx.play()
  } catch (_) {}
}
