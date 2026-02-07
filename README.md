# Valentine Pixel Gift (Vue 3 + Vite)

Милий pixel-art сайт-подарунок до Дня Валентина українською мовою.

## Запуск

```bash
yarn
yarn dev
```

## Що всередині

- Vue 3 + Vite (JavaScript)
- `howler` для кліку та фонової музики
- Навігація екранів через state в `App.vue`
- Екрани: Intro → Distance → Game → Final

## Структура

- `src/screens/IntroScreen.vue`
- `src/screens/DistanceScreen.vue`
- `src/screens/GameScreen.vue`
- `src/screens/FinalScreen.vue`
- `src/lib/audio.js`
- `src/assets/styles/fonts.css`
- `src/assets/styles/global.css`

## Заміна ресурсів

### Піксельний шрифт (кирилиця)

Заміни файл:

- `src/assets/fonts/PixelUA.woff2`

Після цього `@font-face` у `src/assets/styles/fonts.css` підхопить новий шрифт автоматично.

### Аудіо

Заміни placeholder-файли:

- `public/audio/click.mp3`
- `public/audio/bgm.mp3`

`bgm.mp3` програється в циклі з тихою гучністю після ручного увімкнення звуку кнопкою.
