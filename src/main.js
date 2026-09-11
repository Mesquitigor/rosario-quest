import './style.css'
import { ACHIEVEMENTS, todaySetId, localDateKey } from './data.js'
import { loadProgress, saveProgress } from './storage.js'
import { sfx } from './audio.js'
import {
  applyQuizResult,
  applySortResult,
  dealDaily,
  dealDezena,
  dealQuiz,
  dealTimeline,
  evaluateSort,
  hintSlot,
  scoreQuiz,
  scoreSort,
} from './game.js'
import {
  achievements,
  burstConfetti,
  chooseSet,
  how,
  hub,
  learn,
  learnSet,
  onboarding,
  playQuiz,
  playSort,
  resultQuiz,
  resultSort,
  shell,
} from './ui.js'

const app = document.querySelector('#app')

const state = {
  screen: 'hub',
  progress: loadProgress(),
  game: null,
  quiz: null,
  tally: null,
  unlocked: [],
  learnSetId: null,
  lastSortMode: null,
}

function sound(name) {
  if (state.progress.mute) return
  try {
    sfx[name]()
  } catch {
    /* autoplay quirks */
  }
}

function render() {
  const p = state.progress
  let inner = ''
  if (!p.seenOnboarding) inner = onboarding()
  else if (state.screen === 'hub') inner = hub(p)
  else if (state.screen === 'choose-set') inner = chooseSet(p)
  else if (state.screen === 'play') inner = playSort(state.game)
  else if (state.screen === 'result') inner = resultSort(state.game, state.tally, p, state.unlocked)
  else if (state.screen === 'quiz') inner = playQuiz(state.quiz)
  else if (state.screen === 'quiz-result') inner = resultQuiz(state.tally, p, state.unlocked)
  else if (state.screen === 'learn') inner = learn()
  else if (state.screen === 'learn-set') inner = learnSet(state.learnSetId)
  else if (state.screen === 'how') inner = how()
  else if (state.screen === 'achievements') inner = achievements(p)
  else inner = hub(p)

  app.innerHTML = shell(p, inner)
  bindDrag()
}

function go(screen) {
  state.screen = screen
  render()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function startDezena(setId) {
  state.game = dealDezena(setId)
  state.lastSortMode = { type: 'dezena', setId }
  go('play')
}

function startDaily(practice = false) {
  const setId = todaySetId()
  state.game = practice ? dealDezena(setId) : dealDaily(setId, localDateKey())
  state.lastSortMode = { type: 'daily', setId }
  go('play')
}

function startTimeline() {
  state.game = dealTimeline()
  state.lastSortMode = { type: 'timeline' }
  go('play')
}

function startQuiz() {
  state.quiz = dealQuiz()
  go('quiz')
}

function newUnlocks(before, after) {
  const prev = new Set(before)
  return ACHIEVEMENTS.filter((a) => after.includes(a.id) && !prev.has(a.id))
}

function placeCard(id, slotIndex) {
  const game = state.game
  if (!game || game.checked) return
  const fromPool = game.pool.find((m) => m.id === id)
  const fromSlot = game.slots.findIndex((m) => m?.id === id)
  const occupied = game.slots[slotIndex]
  const slots = [...game.slots]
  const pool = [...game.pool]

  if (fromPool) {
    pool.splice(pool.findIndex((m) => m.id === id), 1)
    if (occupied) pool.push(occupied)
    slots[slotIndex] = fromPool
  } else if (fromSlot >= 0) {
    slots[fromSlot] = occupied
    slots[slotIndex] = game.slots[fromSlot]
  }

  state.game = { ...game, slots, pool, selectedId: null, results: null, checked: false }
  sound('place')
  render()
}

function pickCard(id) {
  const game = state.game
  if (!game || game.checked) return
  if (game.selectedId === id) {
    state.game = { ...game, selectedId: null }
    render()
    return
  }
  if (game.selectedId) {
    const selectedSlot = game.slots.findIndex((m) => m?.id === game.selectedId)
    const targetSlot = game.slots.findIndex((m) => m?.id === id)
    if (selectedSlot >= 0 && targetSlot >= 0) {
      const slots = [...game.slots]
      ;[slots[selectedSlot], slots[targetSlot]] = [slots[targetSlot], slots[selectedSlot]]
      state.game = { ...game, slots, selectedId: null }
      sound('place')
      render()
      return
    }
    if (targetSlot >= 0) {
      placeCard(game.selectedId, targetSlot)
      return
    }
  }
  state.game = { ...game, selectedId: id }
  sound('tap')
  render()
}

function returnToPool(id) {
  const game = state.game
  const slotIndex = game.slots.findIndex((m) => m?.id === id)
  if (slotIndex < 0) return
  const slots = [...game.slots]
  const card = slots[slotIndex]
  slots[slotIndex] = null
  state.game = { ...game, slots, pool: [...game.pool, card], selectedId: null, results: null }
  sound('tap')
  render()
}

function bindDrag() {
  if (state.screen !== 'play' || !state.game) return
  const cards = app.querySelectorAll('[data-action="pick-card"]')
  cards.forEach((card) => {
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', card.dataset.id)
      e.dataTransfer.effectAllowed = 'move'
    })
  })
  app.querySelectorAll('[data-slot]').forEach((slot) => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault()
      slot.classList.add('is-hot')
    })
    slot.addEventListener('dragleave', () => slot.classList.remove('is-hot'))
    slot.addEventListener('drop', (e) => {
      e.preventDefault()
      slot.classList.remove('is-hot')
      const id = e.dataTransfer.getData('text/plain')
      if (id) placeCard(id, Number(slot.dataset.slot))
    })
  })
}

app.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action]')
  if (!btn) return
  const action = btn.dataset.action

  if (action === 'home') go('hub')
  if (action === 'how') go('how')
  if (action === 'learn') go('learn')
  if (action === 'achievements') go('achievements')
  if (action === 'choose-set') go('choose-set')
  if (action === 'play-daily') startDaily()
  if (action === 'play-timeline') startTimeline()
  if (action === 'play-quiz') startQuiz()
  if (action === 'learn-set') {
    state.learnSetId = btn.dataset.set
    go('learn-set')
  }
  if (action === 'play-set') startDezena(btn.dataset.set)

  if (action === 'toggle-mute') {
    state.progress = saveProgress({ ...state.progress, mute: !state.progress.mute })
    sound('tap')
    render()
  }

  if (action === 'start-journey') {
    const name = document.querySelector('#name-input')?.value.trim() || 'Peregrino'
    state.progress = saveProgress({ ...state.progress, name, seenOnboarding: true })
    sound('win')
    go('hub')
  }

  if (action === 'pick-card') {
    const id = btn.dataset.id
    const inSlot = state.game?.slots.some((m) => m?.id === id)
    if (inSlot && state.game.selectedId && state.game.selectedId !== id) {
      const slotIndex = state.game.slots.findIndex((m) => m?.id === id)
      placeCard(state.game.selectedId, slotIndex)
      return
    }
    if (inSlot && state.game.selectedId === id) {
      returnToPool(id)
      return
    }
    pickCard(id)
  }

  if (action === 'pick-slot') {
    if (state.game?.selectedId) placeCard(state.game.selectedId, Number(btn.dataset.slot))
  }

  if (action === 'hint') {
    if (!state.game) return
    state.game = hintSlot(state.game)
    sound('streak')
    render()
  }

  if (action === 'reset-board') {
    if (!state.game) return
    if (state.lastSortMode?.type === 'daily') startDaily(true)
    else if (state.lastSortMode?.type === 'timeline') startTimeline()
    else startDezena(state.lastSortMode?.setId || todaySetId())
  }

  if (action === 'check-order') {
    const game = state.game
    if (!game || game.slots.some((s) => !s)) return
    const results = evaluateSort(game)
    const seconds = (Date.now() - game.startedAt) / 1000
    const tally = scoreSort(results, seconds, game.hintsUsed, game.mode === 'daily')
    const before = [...state.progress.achievements]
    state.progress = saveProgress(applySortResult(state.progress, game, tally))
    state.unlocked = newUnlocks(before, state.progress.achievements)
    state.game = { ...game, results, checked: true }
    state.tally = tally
    if (tally.perfect) {
      sound('win')
      burstConfetti()
    } else {
      sound(tally.correct >= 3 ? 'ok' : 'bad')
    }
    go('result')
  }

  if (action === 'replay') {
    if (state.lastSortMode?.type === 'daily') startDaily(true)
    else if (state.lastSortMode?.type === 'timeline') startTimeline()
    else startDezena(state.lastSortMode?.setId || todaySetId())
  }

  if (action === 'quiz-answer') {
    const quiz = state.quiz
    if (!quiz || quiz.locked) return
    const q = quiz.questions[quiz.index]
    const ok = btn.dataset.id === q.answer
    sound(ok ? 'ok' : 'bad')
    btn.classList.add(ok ? 'is-ok' : 'is-bad')
    if (!ok) {
      const correct = app.querySelector(`[data-action="quiz-answer"][data-id="${CSS.escape(q.answer)}"]`)
      correct?.classList.add('is-ok')
    }
    const answers = [...quiz.answers, { ok, id: btn.dataset.id }]
    quiz.locked = true
    setTimeout(() => {
      if (quiz.index + 1 >= quiz.questions.length) {
        const tally = scoreQuiz(answers)
        const before = [...state.progress.achievements]
        state.progress = saveProgress(applyQuizResult(state.progress, tally))
        state.unlocked = newUnlocks(before, state.progress.achievements)
        state.tally = tally
        if (tally.perfect) burstConfetti()
        go('quiz-result')
      } else {
        state.quiz = { ...quiz, index: quiz.index + 1, answers, locked: false }
        go('quiz')
      }
    }, 420)
  }
})

render()
