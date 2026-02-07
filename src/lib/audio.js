// src/lib/audio.js
import { Howl } from 'howler'

let enabled = false
let initialized = false

let click = null
let bgm = null

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
