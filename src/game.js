import {
  ACHIEVEMENTS,
  LEVELS,
  MYSTERIES,
  SETS,
  localDateKey,
  mysteriesOf,
} from './data.js'

export function shuffle(list) {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function seedShuffle(list, seed) {
  const next = [...list]
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function dateSeed(key) {
  return [...key].reduce((acc, ch) => acc + ch.charCodeAt(0) * 13, 11)
}

export function dealDezena(setId) {
  const items = mysteriesOf(setId)
  let pool = shuffle(items)
  if (pool.every((m, i) => m.order === i + 1)) pool = shuffle(items)
  return {
    mode: 'dezena',
    setId,
    items,
    pool,
    slots: [null, null, null, null, null],
    selectedId: null,
    startedAt: Date.now(),
    hintsUsed: 0,
    checked: false,
    reveal: false,
  }
}

export function dealDaily(setId, dateKey) {
  const game = dealDezena(setId)
  game.mode = 'daily'
  game.pool = seedShuffle(mysteriesOf(setId), dateSeed(dateKey) + 17)
  if (game.pool.every((m, i) => m.order === i + 1)) {
    game.pool = seedShuffle(mysteriesOf(setId), dateSeed(dateKey) + 91)
  }
  return game
}

export function dealTimeline() {
  const picked = shuffle(MYSTERIES).slice(0, 5)
  const sorted = [...picked].sort((a, b) => a.chrono - b.chrono)
  let pool = shuffle(picked)
  if (sameOrder(pool, sorted, 'id')) pool = shuffle(picked)
  return {
    mode: 'timeline',
    setId: null,
    items: sorted,
    pool,
    slots: [null, null, null, null, null],
    selectedId: null,
    startedAt: Date.now(),
    hintsUsed: 0,
    checked: false,
    reveal: false,
  }
}

function sameOrder(a, b, key) {
  return a.length === b.length && a.every((item, i) => item[key] === b[i][key])
}

export function evaluateSort(game) {
  const expected = game.mode === 'timeline'
    ? game.items
    : [...game.items].sort((a, b) => a.order - b.order)

  return game.slots.map((slot, i) => {
    if (!slot) return { ok: false, empty: true, expected: expected[i] }
    return {
      ok: slot.id === expected[i].id,
      empty: false,
      expected: expected[i],
    }
  })
}

export function scoreSort(results, seconds, hintsUsed, daily) {
  const filled = results.filter((r) => !r.empty).length
  const correct = results.filter((r) => r.ok).length
  const perfect = correct === 5
  const timeBonus = perfect ? Math.max(0, 35 - Math.floor(seconds)) : 0
  const hintPenalty = hintsUsed * 12
  let xp = correct * 22 + (perfect ? 70 : 0) + timeBonus - hintPenalty
  if (daily) xp = Math.round(xp * 1.45)
  xp = Math.max(filled ? 8 : 0, xp)
  return { correct, perfect, xp, timeBonus, seconds: Math.floor(seconds) }
}

export function applySortResult(progress, game, tally) {
  const next = { ...progress }
  const today = localDateKey()
  next.xp += tally.xp
  next.games += 1
  next.beads += tally.correct
  if (next.beads >= 20) {
    next.rosaries += Math.floor(next.beads / 20)
    next.beads %= 20
  }
  if (tally.perfect) {
    next.perfects += 1
    if (game.setId) {
      next.perfectsBySet = {
        ...next.perfectsBySet,
        [game.setId]: (next.perfectsBySet[game.setId] || 0) + 1,
      }
    }
  }
  if (game.setId) {
    next.completedSets = { ...next.completedSets, [game.setId]: true }
    next.bestBySet = {
      ...next.bestBySet,
      [game.setId]: Math.max(next.bestBySet[game.setId] || 0, tally.xp),
    }
  }
  if (game.mode === 'daily') {
    next.daily = { date: today, completed: true, score: tally.xp }
  }
  if (next.lastPlayDate !== today) {
    const yesterday = localDateKey(new Date(Date.now() - 86400000))
    next.streak = next.lastPlayDate === yesterday ? next.streak + 1 : 1
    next.lastPlayDate = today
  }
  next.achievements = unlockAchievements(next, { kind: 'sort', game, tally })
  return next
}

export function dealQuiz() {
  const questions = []
  const used = new Set()

  while (questions.length < 6) {
    const type = questions.length % 3
    if (type === 0) {
      const m = pickUnused(MYSTERIES, used)
      used.add(m.id)
      questions.push({
        type: 'set',
        mystery: m,
        prompt: `A qual conjunto pertence este mistério?`,
        options: shuffle(Object.values(SETS).map((s) => ({ id: s.id, label: s.title, emoji: s.emoji }))),
        answer: m.set,
      })
    } else if (type === 1) {
      const m = pickUnused(MYSTERIES.filter((x) => x.order < 5), used)
      used.add(m.id)
      const nextM = MYSTERIES.find((x) => x.set === m.set && x.order === m.order + 1)
      const decoys = shuffle(MYSTERIES.filter((x) => x.id !== nextM.id)).slice(0, 3)
      questions.push({
        type: 'next',
        mystery: m,
        prompt: `O que vem depois de “${m.title}”?`,
        options: shuffle([nextM, ...decoys]).map((x) => ({ id: x.id, label: x.title, emoji: x.emoji })),
        answer: nextM.id,
      })
    } else {
      const set = SETS[Object.keys(SETS)[Math.floor(Math.random() * 4)]]
      const correct = mysteriesOf(set.id).find((x) => x.order === 1)
      const decoys = shuffle(MYSTERIES.filter((x) => x.id !== correct.id && x.order === 1)).slice(0, 3)
      questions.push({
        type: 'first',
        mystery: null,
        prompt: `Qual é o 1º mistério ${set.name.toLowerCase()}?`,
        options: shuffle([correct, ...decoys]).map((x) => ({ id: x.id, label: x.title, emoji: x.emoji })),
        answer: correct.id,
      })
    }
  }

  return {
    mode: 'quiz',
    index: 0,
    questions,
    answers: [],
    startedAt: Date.now(),
    locked: false,
  }
}

function pickUnused(list, used) {
  const open = list.filter((m) => !used.has(m.id))
  return open[Math.floor(Math.random() * open.length)] || list[Math.floor(Math.random() * list.length)]
}

export function scoreQuiz(answers) {
  const correct = answers.filter((a) => a.ok).length
  const perfect = correct === answers.length
  const xp = correct * 18 + (perfect ? 60 : 0)
  return { correct, total: answers.length, perfect, xp }
}

export function applyQuizResult(progress, tally) {
  const next = { ...progress }
  const today = localDateKey()
  next.xp += tally.xp
  next.games += 1
  next.beads += tally.correct
  if (next.beads >= 20) {
    next.rosaries += Math.floor(next.beads / 20)
    next.beads %= 20
  }
  next.quizBest = Math.max(next.quizBest || 0, tally.correct)
  if (next.lastPlayDate !== today) {
    const yesterday = localDateKey(new Date(Date.now() - 86400000))
    next.streak = next.lastPlayDate === yesterday ? next.streak + 1 : 1
    next.lastPlayDate = today
  }
  next.achievements = unlockAchievements(next, { kind: 'quiz', tally })
  return next
}

function unlockAchievements(progress, ctx) {
  const have = new Set(progress.achievements)
  const grant = (id) => have.add(id)

  if (progress.games >= 1) grant('primeiro-passo')
  if (progress.perfects >= 1) grant('dezena-perfeita')
  if (Object.keys(progress.completedSets).length >= 4) grant('quatro-luzes')
  if (progress.streak >= 7) grant('chama-sete')
  if ((progress.quizBest || 0) >= 5) grant('relampago')
  if (ctx.kind === 'sort' && ctx.game.mode === 'timeline' && ctx.tally.perfect) grant('cronista')
  if (progress.rosaries >= 1 || progress.beads + progress.rosaries * 20 >= 20) grant('vinte-contas')
  if ((progress.perfectsBySet.gozosos || 0) >= 3) grant('mestre-gozoso')
  if ((progress.perfectsBySet.luminosos || 0) >= 3) grant('mestre-luminoso')
  if ((progress.perfectsBySet.dolorosos || 0) >= 3) grant('mestre-doloroso')
  if ((progress.perfectsBySet.gloriosos || 0) >= 3) grant('mestre-glorioso')
  const lvl = LEVELS.filter((l) => progress.xp >= l.min).at(-1)
  if (lvl && lvl.min >= 400) grant('peregrino')

  return [...have]
}

export function hintSlot(game) {
  const expected = game.mode === 'timeline'
    ? game.items
    : [...game.items].sort((a, b) => a.order - b.order)

  const wrongIndex = game.slots.findIndex((slot, i) => !slot || slot.id !== expected[i].id)
  if (wrongIndex < 0) return game

  const need = expected[wrongIndex]
  const slots = [...game.slots]
  const pool = [...game.pool]
  const fromSlot = slots.findIndex((s) => s?.id === need.id)
  const occupied = slots[wrongIndex]

  if (fromSlot >= 0) {
    slots[fromSlot] = occupied
    slots[wrongIndex] = need
  } else {
    const poolIndex = pool.findIndex((s) => s.id === need.id)
    if (poolIndex >= 0) pool.splice(poolIndex, 1)
    if (occupied) pool.push(occupied)
    slots[wrongIndex] = need
  }

  return { ...game, slots, pool, hintsUsed: game.hintsUsed + 1, selectedId: null }
}
