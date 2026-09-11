const KEY = 'rosario-quest-v1'

const empty = () => ({
  name: '',
  xp: 0,
  beads: 0,
  rosaries: 0,
  streak: 0,
  lastPlayDate: '',
  games: 0,
  perfects: 0,
  quizBest: 0,
  mute: false,
  completedSets: {},
  perfectsBySet: { gozosos: 0, luminosos: 0, dolorosos: 0, gloriosos: 0 },
  bestBySet: { gozosos: 0, luminosos: 0, dolorosos: 0, gloriosos: 0 },
  daily: { date: '', completed: false, score: 0 },
  achievements: [],
  seenOnboarding: false,
})

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty()
    return { ...empty(), ...JSON.parse(raw) }
  } catch {
    return empty()
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress))
  return progress
}

export function resetProgress() {
  const next = empty()
  saveProgress(next)
  return next
}
