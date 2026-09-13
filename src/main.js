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
  dealRosary,
  dealTimeline,
  evaluateSort,
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
  playHub,
  playQuiz,
  playSort,
  ready,
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
  pending: null,
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
  const screen = p.seenOnboarding ? state.screen : 'onboard'
  if (!p.seenOnboarding) inner = onboarding()
  else if (state.screen === 'hub') inner = hub(p)
  else if (state.screen === 'play-hub') inner = playHub(p)
  else if (state.screen === 'ready') inner = ready(state.pending)
  else if (state.screen === 'choose-set') inner = chooseSet(p)
  else if (state.screen === 'play') inner = playSort(state.game)
  else if (state.screen === 'result') inner = resultSort(state.game, state.tally, p, state.unlocked)
  else if (state.screen === 'quiz') inner = playQuiz(state.quiz)
  else if (state.screen === 'quiz-result') inner = resultQuiz(state.tally, p, state.unlocked, state.quiz)
  else if (state.screen === 'learn') inner = learn()
  else if (state.screen === 'learn-set') inner = learnSet(state.learnSetId)
  else if (state.screen === 'how') inner = how()
  else if (state.screen === 'achievements') inner = achievements(p)
  else inner = hub(p)

  app.innerHTML = shell(p, inner, screen)
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

function startRosary() {
  state.game = dealRosary()
  state.lastSortMode = { type: 'rosary' }
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

function startPending() {
  const pending = state.pending
  if (!pending) return
  if (pending.kind === 'daily') startDaily()
  else if (pending.kind === 'rosary') startRosary()
  else if (pending.kind === 'timeline') startTimeline()
  else if (pending.kind === 'quiz') startQuiz()
  else if (pending.kind === 'dezena') startDezena(pending.setId)
}

function restartLast() {
  const last = state.lastSortMode
  if (!last) return
  if (last.type === 'daily') startDaily(true)
  else if (last.type === 'rosary') startRosary()
  else if (last.type === 'timeline') startTimeline()
  else startDezena(last.setId || todaySetId())
}

function newUnlocks(before, after) {
  const prev = new Set(before)
  return ACHIEVEMENTS.filter((a) => after.includes(a.id) && !prev.has(a.id))
}

function toggleRank(id) {
  const game = state.game
  if (!game || game.checked) return
  const picked = [...game.picked]
  const idx = picked.indexOf(id)
  if (idx >= 0) {
    picked.splice(idx, 1)
    sound('tap')
  } else {
    if (picked.length >= game.items.length) return
    picked.push(id)
    sound('place')
  }
  state.game = { ...game, picked, results: null }
  render()
}

function clearRanks() {
  const game = state.game
  if (!game || game.checked || !game.picked.length) return
  state.game = { ...game, picked: [], results: null }
  sound('tap')
  render()
}

app.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-action]')
  if (!btn) return
  const action = btn.dataset.action

  if (action === 'home') go('hub')
  if (action === 'play-hub') go('play-hub')
  if (action === 'how') go('how')
  if (action === 'learn') go('learn')
  if (action === 'achievements') go('achievements')
  if (action === 'choose-set') go('choose-set')
  if (action === 'play-daily') startDaily()
  if (action === 'play-quiz') startQuiz()
  if (action === 'ready-daily') {
    state.pending = { kind: 'daily' }
    go('ready')
  }
  if (action === 'ready-rosary') {
    state.pending = { kind: 'rosary' }
    go('ready')
  }
  if (action === 'ready-timeline') {
    state.pending = { kind: 'timeline' }
    go('ready')
  }
  if (action === 'ready-quiz') {
    state.pending = { kind: 'quiz' }
    go('ready')
  }
  if (action === 'ready-set') {
    state.pending = { kind: 'dezena', setId: btn.dataset.set, from: state.screen }
    go('ready')
  }
  if (action === 'start-ready') startPending()
  if (action === 'learn-set') {
    state.learnSetId = btn.dataset.set || state.learnSetId
    go(state.learnSetId ? 'learn-set' : 'learn')
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

  if (action === 'pick-card') toggleRank(btn.dataset.id)

  if (action === 'reset-board') clearRanks()

  if (action === 'check-order') {
    const game = state.game
    if (!game || game.picked.length !== game.items.length) return
    const results = evaluateSort(game)
    const seconds = (Date.now() - game.startedAt) / 1000
    const tally = scoreSort(results, seconds, game.mode === 'daily')
    const before = [...state.progress.achievements]
    state.progress = saveProgress(applySortResult(state.progress, game, tally))
    state.unlocked = newUnlocks(before, state.progress.achievements)
    state.game = { ...game, results, checked: true }
    state.tally = tally
    if (tally.perfect) {
      sound('win')
      burstConfetti()
    } else {
      sound(tally.correct >= Math.ceil(game.items.length / 2) ? 'ok' : 'bad')
    }
    go('result')
  }

  if (action === 'replay') restartLast()
  if (action === 'choose-other') go('choose-set')

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
    const chosen = q.options.find((o) => o.id === btn.dataset.id)
    const expected = q.options.find((o) => o.id === q.answer)
    const answers = [...quiz.answers, {
      ok,
      id: btn.dataset.id,
      prompt: q.prompt,
      detail: q.mystery?.title || '',
      chosen: chosen?.label || '',
      expected: expected?.label || '',
    }]
    quiz.locked = true
    setTimeout(() => {
      if (quiz.index + 1 >= quiz.questions.length) {
        const tally = scoreQuiz(answers)
        const before = [...state.progress.achievements]
        state.progress = saveProgress(applyQuizResult(state.progress, tally))
        state.unlocked = newUnlocks(before, state.progress.achievements)
        state.quiz = { ...quiz, answers, locked: true }
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
