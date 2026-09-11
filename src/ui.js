import {
  ACHIEVEMENTS,
  NUDGES,
  PRAISES,
  SETS,
  SET_ORDER,
  levelFor,
  mysteriesOf,
  todaySetId,
} from './data.js'

const accentClass = {
  joy: 'card-joy',
  light: 'card-light',
  sorrow: 'card-sorrow',
  glory: 'card-glory',
}

const NAV_SCREENS = new Set(['hub', 'play-hub', 'learn', 'achievements'])

export function tercoIcon(className = 'h-7 w-7', alt = 'Terço') {
  return `<img src="/terco.png" alt="${alt}" class="terco-icon ${className}" draggable="false" />`
}

function mark(value, className = 'inline-block h-6 w-6 align-middle') {
  return value === '📿' ? tercoIcon(className) : value
}

export function shell(progress, inner, screen = 'hub') {
  const lvl = levelFor(progress.xp)
  const mute = progress.mute ? '🔇' : '🔔'
  const showNav = NAV_SCREENS.has(screen)
  const showHeader = !['onboard', 'play', 'quiz', 'ready', 'result', 'quiz-result'].includes(screen)
  const header = showHeader ? `
      <header class="mb-4 flex items-center justify-between gap-3">
        <button data-action="home" class="flex min-w-0 items-center gap-2 text-left">
          ${tercoIcon('h-11 w-11 drop-shadow-[0_0_12px_rgba(232,197,71,.4)]', 'Rosário Quest')}
          <span class="min-w-0">
            <span class="type-card block truncate text-gold">Ave, ${escapeHtml(progress.name || 'peregrino')}</span>
            <span class="type-meta text-ink/55">${lvl.current.name}</span>
          </span>
        </button>
        <div class="flex shrink-0 items-center gap-2">
          <span class="chip">🔥 ${progress.streak}</span>
          <span class="chip">✨ ${progress.xp}</span>
          <button data-action="toggle-mute" class="glass grid h-10 w-10 place-items-center rounded-full text-lg" title="Som">${mute}</button>
        </div>
      </header>` : ''
  return `
    <div class="sky"></div>
    <div class="stars"></div>
    <div class="blob blob-gold"></div>
    <div class="blob blob-rose"></div>
    <div class="blob blob-blue"></div>
    <div class="grain"></div>
    <div class="relative mx-auto min-h-dvh max-w-lg px-4 pt-4 sm:max-w-xl sm:px-6 ${showNav ? 'pb-28' : 'pb-10'}">
      ${header}
      ${inner}
      ${showNav ? bottomNav(screen) : ''}
    </div>
  `
}

function bottomNav(screen) {
  const item = (action, label, icon, id) => `
    <button data-action="${action}" class="nav-item ${screen === id ? 'is-on' : ''}">
      <span class="text-xl">${icon}</span>
      <span>${label}</span>
    </button>
  `
  return `
    <nav class="bottom-nav">
      ${item('home', 'Início', '🏠', 'hub')}
      ${item('play-hub', 'Jogar', '▶️', 'play-hub')}
      ${item('learn', 'Aprender', '📖', 'learn')}
      ${item('achievements', 'Selos', '🏅', 'achievements')}
    </nav>
  `
}

export function onboarding() {
  return `
    <section class="rise mx-auto mt-6 max-w-md text-center">
      ${tercoIcon('mx-auto h-36 w-36 drop-shadow-[0_0_24px_rgba(232,197,71,.45)]')}
      <p class="type-kicker mt-6 text-gold/80">Rosário Quest</p>
      <h1 class="type-title mt-2 text-gold">Vamos jogar</h1>
      <p class="type-body mt-2 text-ink/70">Aprenda a ordem dos mistérios brincando.</p>
      <input id="name-input" maxlength="24" placeholder="Seu nome" class="type-body mt-8 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-center outline-none ring-gold/40 placeholder:text-ink/30 focus:ring-2" />
      <button data-action="start-journey" class="btn-gold mt-4 w-full rounded-full px-5 py-4 text-lg">Começar</button>
      <p class="type-meta mt-4 text-ink/40">Sem conta. O progresso fica neste aparelho.</p>
    </section>
  `
}

export function hub(progress) {
  const today = SETS[todaySetId()]
  const dailyDone = progress.daily?.completed && isToday(progress.daily.date)
  const lvl = levelFor(progress.xp)
  const pct = Math.round(lvl.progress * 100)

  return `
    <section class="rise text-center">
      ${tercoIcon('mx-auto h-40 w-40 drop-shadow-[0_0_28px_rgba(232,197,71,.35)]')}
      <p class="type-kicker mt-4 text-ink/55">Desafio de hoje</p>
      <h1 class="type-title mt-1">${today.emoji} ${today.name}</h1>
      <p class="type-meta mt-1 text-gold/80">${today.days}</p>
      <button data-action="ready-daily" class="btn-gold mt-6 w-full rounded-full px-5 py-4 text-lg">
        ${dailyDone ? 'Jogar de novo' : 'Jogar agora'}
      </button>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div class="xp-fill h-full rounded-full" style="width:${pct}%"></div>
      </div>
      <p class="type-meta mt-2 text-ink/45">${lvl.next ? `${lvl.current.name} → ${lvl.next.name}` : lvl.current.name}</p>

      <h2 class="type-kicker mt-8 text-left text-ink/45">Categorias</h2>
      <div class="mt-3 grid grid-cols-2 gap-3">
        ${SET_ORDER.map((id, i) => categoryTile(SETS[id], progress, i)).join('')}
      </div>
    </section>
  `
}

function categoryTile(set, progress, i) {
  const done = progress.completedSets?.[set.id]
  return `
    <button data-action="ready-set" data-set="${set.id}" class="cat-tile ${accentClass[set.accent]} rise rise-${i + 1}">
      <span class="text-3xl">${set.emoji}</span>
      <span class="type-card mt-2 block">${set.name}</span>
      <span class="type-meta mt-1 block text-ink/50">${done ? '✓ jogado' : set.days}</span>
    </button>
  `
}

export function playHub(progress) {
  const today = SETS[todaySetId()]
  const dailyDone = progress.daily?.completed && isToday(progress.daily.date)
  return `
    <section class="rise">
      <h1 class="type-title text-gold">Vamos jogar</h1>
      <p class="type-body mt-1 text-ink/60">Escolha um modo. Um de cada vez.</p>
      <div class="mt-5 space-y-3">
        ${levelCard('ready-daily', '1', today.emoji, 'Desafio de hoje', today.name, dailyDone, 'card-glory')}
        ${levelCard('choose-set', '2', '📿', 'Ordenar a dezena', 'Os 4 conjuntos', Object.keys(progress.completedSets || {}).length >= 4, 'card-joy')}
        ${levelCard('ready-timeline', '3', '📜', 'Linha do tempo', 'A vida de Cristo', false, 'card-light')}
        ${levelCard('ready-quiz', '4', '⚡', 'Quiz relâmpago', '6 perguntas rápidas', (progress.quizBest || 0) >= 5, 'card-sorrow')}
      </div>
      <button data-action="how" class="type-meta mt-5 w-full text-ink/50">Como jogar?</button>
    </section>
  `
}

function levelCard(action, n, emoji, title, sub, done, accent) {
  return `
    <button data-action="${action}" class="level-card ${accent}">
      <span class="level-badge">${done ? '✓' : n}</span>
      <span class="min-w-0 flex-1 text-left">
        <span class="type-kicker block text-ink/45">Nível ${n}</span>
        <span class="type-card mt-0.5 block">${title}</span>
        <span class="type-meta mt-0.5 block text-ink/65">${sub}</span>
      </span>
      <span class="text-3xl">${mark(emoji, 'h-12 w-12')}</span>
    </button>
  `
}

export function ready(pending) {
  const copy = readyCopy(pending)
  return `
    <section class="rise mx-auto max-w-md text-center">
      <button data-action="${copy.back}" data-set="${pending?.setId || ''}" class="glass ml-0 mr-auto grid h-10 w-10 place-items-center rounded-full">✕</button>
      ${copy.hero}
      <p class="type-kicker mt-2 text-ink/45">${copy.kicker}</p>
      <h1 class="type-title mt-2 text-gold">${copy.title}</h1>
      <p class="type-body mt-2 text-ink/70">${copy.blurb}</p>
      <button data-action="start-ready" class="btn-gold mt-8 w-full rounded-full px-5 py-4 text-lg">Jogar</button>
    </section>
  `
}

function readyCopy(pending) {
  if (pending?.kind === 'daily') {
    const set = SETS[todaySetId()]
    return {
      back: 'home',
      kicker: 'Desafio de hoje',
      title: set.title,
      blurb: 'Coloque as 5 contas na ordem certa.',
      hero: tercoIcon('mx-auto mt-6 h-36 w-36 drop-shadow-[0_0_22px_rgba(232,197,71,.4)]'),
    }
  }
  if (pending?.kind === 'dezena') {
    const set = SETS[pending.setId]
    return {
      back: pending.from || 'choose-set',
      kicker: `Nível · ${set.name}`,
      title: set.title,
      blurb: set.mood,
      hero: `<div class="mt-6 text-6xl">${set.emoji}</div>`,
    }
  }
  if (pending?.kind === 'timeline') {
    return {
      back: 'play-hub',
      kicker: 'Nível 3',
      title: 'Linha do tempo',
      blurb: 'Cinco cenas da história da salvação, misturadas.',
      hero: '<div class="mt-6 text-6xl">📜</div>',
    }
  }
  return {
    back: 'play-hub',
    kicker: 'Nível 4',
    title: 'Quiz relâmpago',
    blurb: 'Conjunto, sequência e o primeiro mistério.',
    hero: '<div class="mt-6 text-6xl">⚡</div>',
  }
}

export function chooseSet(progress) {
  return `
    <section class="rise">
      ${backRow('Escolha o conjunto', 'play-hub')}
      <div class="mt-5 grid grid-cols-2 gap-3">
        ${SET_ORDER.map((id, i) => categoryTile(SETS[id], progress, i)).join('')}
      </div>
    </section>
  `
}

export function playSort(game) {
  const set = game.setId ? SETS[game.setId] : null
  const title = game.mode === 'timeline' ? 'Linha do tempo' : set?.name || 'Dezena'
  const filled = game.slots.filter(Boolean).length
  const results = game.results || []

  return `
    <section class="rise">
      ${backRow(title, game.mode === 'daily' ? 'home' : 'play-hub')}
      <div class="mt-3 flex items-center justify-between type-meta text-ink/50">
        <span>${filled}/5 no terço</span>
        <span>💡 ${game.hintsUsed}</span>
      </div>
      <div class="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div class="xp-fill h-full" style="width:${(filled / 5) * 100}%"></div>
      </div>

      <div class="mt-5 space-y-3">
        ${game.slots.map((slot, i) => slotRow(slot, i, results[i], game)).join('')}
      </div>

      <p class="type-kicker mt-6 text-ink/40">Contas</p>
      <div class="mt-2 grid gap-2">
        ${game.pool.length
          ? game.pool.map((m) => mysteryCard(m, game.selectedId === m.id, game.setId)).join('')
          : '<p class="glass type-body rounded-2xl p-4 text-center text-ink/60">Tudo no terço. Confira.</p>'}
      </div>

      <div class="mt-6 grid grid-cols-2 gap-3">
        <button data-action="hint" class="glass type-body rounded-full px-4 py-3">Dica</button>
        <button data-action="reset-board" class="glass type-body rounded-full px-4 py-3">Embaralhar</button>
      </div>
      <button data-action="check-order" class="btn-gold mt-3 w-full rounded-full px-5 py-4" ${game.slots.some((s) => !s) ? 'disabled style="opacity:.45"' : ''}>Conferir</button>
    </section>
  `
}

function slotRow(slot, i, result, game) {
  const state = result ? (result.ok ? 'is-ok' : 'is-bad') : ''
  const label = game.mode === 'timeline' ? `${i + 1}º` : `${i + 1}º mistério`
  return `
    <div class="flex items-stretch gap-3">
      <div class="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-deep type-num text-lg text-[#3a2208]">${i + 1}</div>
      <div class="slot flex-1 p-2 ${state}" data-action="pick-slot" data-slot="${i}">
        ${slot
          ? mysteryCard(slot, game.selectedId === slot.id, slot.set, true)
          : `<button type="button" data-action="pick-slot" data-slot="${i}" class="type-meta flex h-full min-h-[64px] w-full items-center justify-center text-ink/35">${label}</button>`}
      </div>
    </div>
  `
}

function mysteryCard(m, selected, setId, compact = false) {
  const set = SETS[m.set]
  return `
    <button
      type="button"
      draggable="true"
      data-action="pick-card"
      data-id="${m.id}"
      class="mystery-card ${accentClass[set.accent]} w-full rounded-2xl p-3 text-left ${selected ? 'is-selected' : ''}"
    >
      <div class="flex items-center gap-3">
        <span class="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-black/20 text-xl">${m.emoji}</span>
        <span class="min-w-0">
          <span class="type-item block">${m.title}</span>
          <span class="type-meta block truncate text-ink/60">${compact ? set.name : m.short}</span>
        </span>
      </div>
    </button>
  `
}

export function resultSort(game, tally, progress, unlocked, reviewOpen = false) {
  const perfect = tally.perfect
  const praise = perfect ? PRAISES[Math.floor(Math.random() * PRAISES.length)] : NUDGES[Math.floor(Math.random() * NUDGES.length)]
  return `
    <section class="rise mx-auto max-w-md text-center">
      ${perfect
        ? `<div class="seal mx-auto pop"><span>Dezena</span><span>perfeita</span></div>`
        : `<div class="pop mx-auto w-fit">${tercoIcon('h-28 w-28')}</div>`}
      <h1 class="type-title mt-5 text-gold">${perfect ? 'Mandou bem!' : `${tally.correct} de 5`}</h1>
      <p class="type-body mt-2 text-ink/70">${praise}</p>
      <p class="type-score mt-4 text-gold">+${tally.xp} XP</p>
      <p class="type-meta text-ink/50">🔥 ${progress.streak} dias · ${tercoIcon('inline-block h-4 w-4')} ${progress.beads} contas</p>
      ${unlocked.length ? `<div class="mt-4 space-y-2">${unlocked.map((a) => `<p class="glass type-body rounded-2xl px-4 py-3">🏅 ${mark(a.emoji, 'inline-block h-5 w-5')} ${a.name}</p>`).join('')}</div>` : ''}
      <button data-action="toggle-review" class="type-meta mt-5 text-ink/50">${reviewOpen ? 'Ocultar ordem' : 'Ver ordem'}</button>
      ${reviewOpen ? `<div class="mt-3 space-y-2 text-left">${game.slots.map((m, i) => {
        const ok = game.results[i]?.ok
        const expected = game.results[i]?.expected
        return `<div class="glass flex items-center gap-3 rounded-2xl px-3 py-2">
          <span class="w-6 text-center">${ok ? '✅' : '❌'}</span>
          <span class="type-body"><b>${i + 1}.</b> ${ok ? m.title : expected.title}</span>
        </div>`
      }).join('')}</div>` : ''}
      <button data-action="replay" class="btn-gold mt-6 w-full rounded-full px-5 py-4">Jogar de novo</button>
      <button data-action="home" class="type-body mt-3 w-full rounded-full px-5 py-3 text-ink/70">Início</button>
    </section>
  `
}

export function playQuiz(quiz) {
  const q = quiz.questions[quiz.index]
  const n = quiz.index + 1
  return `
    <section class="rise mx-auto max-w-md">
      <div class="flex items-center justify-between">
        <button data-action="play-hub" class="glass grid h-10 w-10 place-items-center rounded-full">✕</button>
        <span class="type-num grid h-12 w-12 place-items-center rounded-full border-2 border-gold text-lg text-gold">${String(n).padStart(2, '0')}</span>
        <span class="type-meta text-ink/50">${quiz.answers.filter((a) => a.ok).length}★</span>
      </div>
      <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div class="xp-fill h-full" style="width:${(quiz.index / quiz.questions.length) * 100}%"></div>
      </div>
      ${q.mystery ? `<p class="mt-8 text-center text-5xl">${q.mystery.emoji}</p>` : `<p class="mt-8 text-center text-5xl">⚡</p>`}
      <p class="type-kicker mt-4 text-center text-ink/45">Pergunta ${n} de ${quiz.questions.length}</p>
      <h2 class="type-heading mt-2 text-center">${q.prompt}</h2>
      ${q.mystery ? `<p class="type-body mt-2 text-center text-ink/60">${q.mystery.title}</p>` : ''}
      <div class="mt-6 grid gap-3">
        ${q.options.map((opt) => `
          <button data-action="quiz-answer" data-id="${opt.id}" class="answer-btn">
            <span>${opt.emoji || '•'}</span>
            <span>${opt.label}</span>
          </button>
        `).join('')}
      </div>
    </section>
  `
}

export function resultQuiz(tally, progress, unlocked) {
  return `
    <section class="rise mx-auto max-w-md text-center">
      ${tercoIcon('mx-auto h-28 w-28 pop')}
      <h1 class="type-title mt-4 text-gold">${tally.perfect ? 'Quiz perfeito!' : `${tally.correct}/${tally.total}`}</h1>
      <p class="type-body mt-2 text-ink/70">${tally.perfect ? 'Você manda no terço.' : 'Cada erro vira uma Ave Maria a mais.'}</p>
      <p class="type-score mt-4 text-gold">+${tally.xp} XP</p>
      ${unlocked.length ? `<div class="mt-4 space-y-2">${unlocked.map((a) => `<p class="glass type-body rounded-2xl px-4 py-3">🏅 ${mark(a.emoji, 'inline-block h-5 w-5')} ${a.name}</p>`).join('')}</div>` : ''}
      <button data-action="play-quiz" class="btn-gold mt-6 w-full rounded-full px-5 py-4">Outra rodada</button>
      <button data-action="home" class="type-body mt-3 w-full rounded-full px-5 py-3 text-ink/70">Início</button>
    </section>
  `
}

export function learn() {
  return `
    <section class="rise">
      <h1 class="type-title text-gold">Aprender</h1>
      <p class="type-body mt-1 text-ink/60">Veja a ordem, depois pratique.</p>
      <div class="mt-5 grid grid-cols-2 gap-3">
        ${SET_ORDER.map((id, i) => {
          const set = SETS[id]
          return `
            <button data-action="learn-set" data-set="${id}" class="cat-tile ${accentClass[set.accent]} rise rise-${i + 1}">
              <span class="text-3xl">${set.emoji}</span>
              <span class="type-card mt-2 block">${set.name}</span>
              <span class="type-meta mt-1 block text-ink/50">${set.days}</span>
            </button>
          `
        }).join('')}
      </div>
    </section>
  `
}

export function learnSet(setId) {
  const set = SETS[setId]
  if (!set) return learn()
  const list = mysteriesOf(setId)
  return `
    <section class="rise">
      ${backRow(set.name, 'learn')}
      <div class="mt-5 space-y-3">
        ${list.map((m, i) => `
          <article class="mystery-card ${accentClass[set.accent]} rise rise-${i + 1} rounded-[1.4rem] p-4">
            <div class="flex items-center gap-3">
              <span class="type-num grid h-9 w-9 place-items-center rounded-full bg-black/25">${m.order}</span>
              <div>
                <h3 class="type-item">${m.emoji} ${m.title}</h3>
                <p class="type-meta text-ink/55">${m.verseRef} · ${m.fruit}</p>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
      <button data-action="ready-set" data-set="${setId}" class="btn-gold mt-6 w-full rounded-full px-5 py-4">Praticar</button>
    </section>
  `
}

export function how() {
  return `
    <section class="rise mx-auto max-w-md">
      ${backRow('Como jogar', 'play-hub')}
      <div class="mt-5 space-y-3">
        ${howStep('1', 'Escolha', 'O desafio de hoje segue o terço da Igreja.')}
        ${howStep('2', 'Monte', 'Toque uma conta e depois o espaço 1 a 5.')}
        ${howStep('3', 'Ganhe', 'Ordem certa vale XP. Jogar todo dia acende a chama.')}
      </div>
    </section>
  `
}

function howStep(n, title, text) {
  return `
    <div class="glass flex gap-3 rounded-[1.3rem] p-4">
      <div class="type-num grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-xl text-[#3a2208]">${n}</div>
      <div>
        <h3 class="type-card">${title}</h3>
        <p class="type-body text-ink/70">${text}</p>
      </div>
    </div>
  `
}

export function achievements(progress) {
  const have = new Set(progress.achievements)
  const lvl = levelFor(progress.xp)
  return `
    <section class="rise">
      <h1 class="type-title text-gold">Selos</h1>
      <div class="podium mt-5">
        <div class="podium-col">
          <div class="text-2xl">🔥</div>
          <div class="type-score text-gold">${progress.streak}</div>
          <div class="type-kicker mt-1 text-ink/45">dias</div>
        </div>
        <div class="podium-col is-first">
          <div class="text-2xl">✨</div>
          <div class="type-score text-gold">${progress.xp}</div>
          <div class="type-kicker mt-1 text-ink/45">${lvl.current.name}</div>
        </div>
        <div class="podium-col">
          <div class="text-2xl">💎</div>
          <div class="type-score text-gold">${progress.perfects}</div>
          <div class="type-kicker mt-1 text-ink/45">perfeitas</div>
        </div>
      </div>
      <p class="type-meta mt-6 text-ink/55">${have.size} de ${ACHIEVEMENTS.length} selos</p>
      <div class="mt-3 grid grid-cols-2 gap-3">
        ${ACHIEVEMENTS.map((a) => `
          <div class="glass rounded-[1.3rem] p-4 ${have.has(a.id) ? '' : 'opacity-35'}">
            <div class="flex h-10 items-center">${mark(a.emoji, 'h-10 w-10')}</div>
            <h3 class="type-item mt-1">${a.name}</h3>
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function backRow(title, action = 'home') {
  return `
    <div class="flex items-center gap-3">
      <button data-action="${action}" class="glass grid h-10 w-10 place-items-center rounded-full">←</button>
      <h1 class="type-heading text-gold">${title}</h1>
    </div>
  `
}

function isToday(date) {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return date === `${y}-${m}-${d}`
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function burstConfetti() {
  const colors = ['#e8c547', '#f0a6b8', '#7ec8e3', '#f5c542', '#ffffff']
  for (let i = 0; i < 36; i += 1) {
    const el = document.createElement('i')
    el.className = 'confetti'
    el.style.left = `${Math.random() * 100}vw`
    el.style.animationDuration = `${1.6 + Math.random() * 1.4}s`
    el.style.background = colors[i % colors.length]
    el.style.transform = `rotate(${Math.random() * 180}deg)`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 3200)
  }
}
