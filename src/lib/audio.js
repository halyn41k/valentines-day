import { Howl } from 'howler'

let enabled = false

const clickSound = new Howl({
  src: ['/audio/click.mp3'],
  volume: 0.6,
  preload: true
})

const bgmSound = new Howl({
  src: ['/audio/bgm.mp3'],
  volume: 0,
  loop: true,
  preload: true
})

function fadeInBgm() {
  if (!bgmSound.playing()) {
    bgmSound.play()
  }
  bgmSound.fade(bgmSound.volume(), 0.2, 1200)
}

function fadeOutBgm() {
  bgmSound.fade(bgmSound.volume(), 0, 600)
  setTimeout(() => {
    if (!enabled) {
      bgmSound.pause()
    }
  }, 620)
}

export function enableAudio() {
  if (enabled) return
  enabled = true
  fadeInBgm()
}

export function toggleAudio() {
  enabled = !enabled
  if (enabled) {
    fadeInBgm()
  } else {
    fadeOutBgm()
  }
  return enabled
}

export function playClick() {
  if (!enabled) return
  clickSound.play()
}

export function isAudioEnabled() {
  return enabled
}
