import {
  ACHIEVEMENTS,
  LEVELS,
  MYSTERIES,
  SETS,
  SET_ORDER,
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

function dealBoard(items, mode, setId, pool) {
  let cards = pool || shuffle(items)
  if (sameOrder(cards, expectedOrder(items, mode), 'id')) cards = shuffle(items)
  return {
    mode,
    setId,
    items,
    pool: cards,
    picked: [],
    startedAt: Date.now(),
    checked: false,
  }
}

export function dealDezena(setId) {
  return dealBoard(mysteriesOf(setId), 'dezena', setId)
}

export function dealDaily(setId, dateKey) {
  const items = mysteriesOf(setId)
  const pool = seedShuffle(items, dateSeed(dateKey) + 17)
  return dealBoard(items, 'daily', setId, pool)
}

export function dealRosary() {
  const items = [...MYSTERIES].sort((a, b) => a.chrono - b.chrono)
  return dealBoard(items, 'rosary', null)
}

export const TIMELINE_COUNT = 8

export function dealTimeline() {
  const picked = shuffle(MYSTERIES).slice(0, TIMELINE_COUNT)
  const items = [...picked].sort((a, b) => a.chrono - b.chrono)
  return dealBoard(items, 'timeline', null)
}

function sameOrder(a, b, key) {
  return a.length === b.length && a.every((item, i) => item[key] === b[i][key])
}

function expectedOrder(items, mode) {
  if (mode === 'rosary' || mode === 'timeline') {
    return [...items].sort((a, b) => a.chrono - b.chrono)
  }
  return [...items].sort((a, b) => a.order - b.order)
}

export function evaluateSort(game) {
  const expected = expectedOrder(game.items, game.mode)
  return expected.map((m, i) => {
    const placedId = game.picked[i]
    if (!placedId) return { ok: false, empty: true, expected: m }
    return { ok: placedId === m.id, empty: false, expected: m }
  })
}

export function scoreSort(results, seconds, daily) {
  const total = results.length
  const filled = results.filter((r) => !r.empty).length
  const correct = results.filter((r) => r.ok).length
  const perfect = correct === total && filled === total
  const per = total >= 20 ? 10 : total > 5 ? 14 : 22
  const bonus = perfect ? (total >= 20 ? 120 : total > 5 ? 80 : 70) : 0
  const cap = total >= 20 ? 150 : total > 5 ? 80 : 40
  const timeBonus = perfect ? Math.max(0, cap - Math.floor(seconds)) : 0
  let xp = correct * per + bonus + timeBonus
  if (daily) xp = Math.round(xp * 1.45)
  xp = Math.max(filled ? 8 : 0, xp)
  return { correct, total, perfect, xp, timeBonus, seconds: Math.floor(seconds) }
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
  if (game.mode === 'rosary') {
    next.completedSets = { ...next.completedSets, ...Object.fromEntries(SET_ORDER.map((id) => [id, true])) }
  } else if (game.setId) {
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

  while (questions.length < 10) {
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
  if ((progress.quizBest || 0) >= 8) grant('relampago')
  if (ctx.kind === 'sort' && ctx.game.mode === 'rosary' && ctx.tally.perfect) grant('cronista')
  if (ctx.kind === 'sort' && ctx.game.mode === 'timeline' && ctx.tally.perfect) grant('linha-tempo')
  if (progress.rosaries >= 1 || progress.beads + progress.rosaries * 20 >= 20) grant('vinte-contas')
  if ((progress.perfectsBySet.gozosos || 0) >= 3) grant('mestre-gozoso')
  if ((progress.perfectsBySet.luminosos || 0) >= 3) grant('mestre-luminoso')
  if ((progress.perfectsBySet.dolorosos || 0) >= 3) grant('mestre-doloroso')
  if ((progress.perfectsBySet.gloriosos || 0) >= 3) grant('mestre-glorioso')
  const lvl = LEVELS.filter((l) => progress.xp >= l.min).at(-1)
  if (lvl && lvl.min >= 400) grant('peregrino')

  return [...have]
}

