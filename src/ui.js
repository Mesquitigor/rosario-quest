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

export function tercoIcon(className = 'h-7 w-7', alt = 'Terço') {
  return `<img src="/terco.png" alt="${alt}" class="terco-icon ${className}" draggable="false" />`
}

function mark(value, className = 'inline-block h-6 w-6 align-middle') {
  return value === '📿' ? tercoIcon(className) : value
}

export function shell(progress, inner) {
  const lvl = levelFor(progress.xp)
  const mute = progress.mute ? '🔇' : '🔔'
  return `
    <div class="sky"></div>
    <div class="stars"></div>
    <div class="blob blob-gold"></div>
    <div class="blob blob-rose"></div>
    <div class="blob blob-blue"></div>
    <div class="grain"></div>
    <div class="relative mx-auto min-h-dvh max-w-5xl px-4 pb-16 pt-5 sm:px-6">
      <header class="mb-6 flex items-center justify-between gap-3">
        <button data-action="home" class="flex items-center gap-3 text-left">
          ${tercoIcon('h-14 w-14 drop-shadow-[0_0_14px_rgba(232,197,71,.45)]', 'Rosário Quest')}
          <span>
            <span class="font-display block text-2xl leading-none text-gold">Rosário Quest</span>
            <span class="text-xs tracking-wide text-ink/60">os mistérios em ordem</span>
          </span>
        </button>
        <div class="flex items-center gap-2">
          <button data-action="toggle-mute" class="glass grid h-10 w-10 place-items-center rounded-full text-lg" title="Som">${mute}</button>
          <button data-action="achievements" class="glass flex items-center gap-2 rounded-full px-3 py-2 text-sm">
            <span>🏅</span><span>${progress.achievements.length}/${ACHIEVEMENTS.length}</span>
          </button>
        </div>
      </header>
      ${inner}
    </div>
  `
}

export function onboarding() {
  return `
    <section class="mx-auto mt-8 max-w-lg rise glass rounded-[2rem] p-8 text-center">
      ${tercoIcon('mx-auto h-24 w-24 drop-shadow-[0_0_18px_rgba(232,197,71,.4)]')}
      <h1 class="font-display mt-3 text-4xl text-gold">Ave, peregrino.</h1>
      <p class="mt-3 text-ink/75">Uma brincadeira católica para aprender a ordem dos mistérios do Santo Rosário. Sem conta, sem senha — só o terço e um pouco de jogo.</p>
      <label class="mt-6 block text-left text-sm text-ink/70">Como te chamamos?</label>
      <input id="name-input" maxlength="24" placeholder="Maria, Pedro, Ana..." class="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none ring-gold/40 placeholder:text-ink/30 focus:ring-2" />
      <button data-action="start-journey" class="btn-gold mt-6 w-full rounded-2xl px-5 py-3.5 text-lg font-extrabold">Começar a jornada</button>
      <p class="mt-4 text-xs text-ink/45">O progresso fica só neste aparelho.</p>
    </section>
  `
}

export function hub(progress) {
  const lvl = levelFor(progress.xp)
  const today = SETS[todaySetId()]
  const dailyDone = progress.daily?.completed && isToday(progress.daily.date)
  const pct = Math.round(lvl.progress * 100)
  const name = progress.name || 'Peregrino'

  return `
    <section class="rise">
      <div class="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <p class="text-sm text-gold/80">Ave, ${escapeHtml(name)}</p>
        <h1 class="font-display mt-1 max-w-xl text-4xl leading-tight sm:text-5xl">Organize os mistérios.<br><span class="italic text-gold">Reze brincando.</span></h1>
        <p class="mt-3 max-w-lg text-ink/70">Arraste as contas, acerte a ordem da vida de Jesus e de Maria, ganhe pontos, mantenha a chama acesa. Feito para jovens — e para quem quer o terço no coração.</p>
        <div class="mt-6 flex flex-wrap items-center gap-3">
          <button data-action="play-daily" class="btn-gold rounded-2xl px-5 py-3 font-extrabold">
            ${dailyDone ? 'Rever o desafio de hoje' : 'Desafio de hoje'} · ${today.emoji} ${today.name}
          </button>
          <button data-action="how" class="rounded-2xl border border-white/15 px-4 py-3 text-sm">Como jogar</button>
        </div>
        <div class="mt-6">
          <div class="mb-2 flex justify-between text-xs text-ink/60">
            <span>${lvl.current.name} · ${progress.xp} XP</span>
            <span>${lvl.next ? `próximo: ${lvl.next.name}` : 'Rainha coroada'}</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-white/10">
            <div class="xp-fill h-full rounded-full" style="width:${pct}%"></div>
          </div>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-3 gap-3">
        ${stat('🔥', progress.streak, 'dias seguidos')}
        ${stat('📿', progress.beads, 'contas de luz')}
        ${stat('💎', progress.perfects, 'dezenas perfeitas')}
      </div>

      <h2 class="font-display mt-8 text-2xl text-gold">Modos de jogo</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        ${modeCard('play-daily', today.emoji, 'Desafio de hoje', `${today.title} · ${today.days}`, dailyDone ? 'Já jogou hoje — pode repetir.' : 'Vale mais XP. É o terço do dia.')}
        ${modeCard('choose-set', '📿', 'Ordenar a dezena', 'Os 5 mistérios de um conjunto', 'O clássico: coloque 1º ao 5º no lugar.')}
        ${modeCard('play-timeline', '📜', 'Linha do tempo', 'Cinco cenas da vida de Cristo', 'Do Natal à coroa — misturado, cronológico.')}
        ${modeCard('play-quiz', '⚡', 'Quiz relâmpago', 'Conjunto, sequência, primeiro mistério', 'Resposta rápida. Cabe no intervalo da aula.')}
      </div>

      <h2 class="font-display mt-8 text-2xl text-gold">Os quatro terços</h2>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        ${SET_ORDER.map((id, i) => setTile(SETS[id], progress, i)).join('')}
      </div>

      <div class="mt-8 flex flex-wrap gap-3">
        <button data-action="learn" class="glass rounded-2xl px-4 py-3">📚 Aprender os mistérios</button>
        <button data-action="achievements" class="glass rounded-2xl px-4 py-3">🏅 Conquistas</button>
      </div>
      <p class="mt-8 text-center text-xs text-ink/40">Feito com fé · Ave Maria</p>
    </section>
  `
}

function isToday(date) {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return date === `${y}-${m}-${d}`
}

function stat(emoji, value, label) {
  return `
    <div class="glass rounded-2xl px-3 py-4 text-center">
      <div class="flex min-h-11 items-center justify-center text-xl">${mark(emoji, 'h-11 w-11')}</div>
      <div class="font-display text-2xl text-gold">${value}</div>
      <div class="text-[11px] uppercase tracking-wide text-ink/50">${label}</div>
    </div>
  `
}

function modeCard(action, emoji, title, sub, blurb) {
  return `
    <button data-action="${action}" class="glass rounded-[1.6rem] p-5 text-left transition hover:-translate-y-0.5">
      <div class="flex h-14 items-center text-2xl">${mark(emoji, 'h-14 w-14')}</div>
      <h3 class="font-display mt-2 text-2xl">${title}</h3>
      <p class="text-sm text-gold/80">${sub}</p>
      <p class="mt-2 text-sm text-ink/65">${blurb}</p>
    </button>
  `
}

function setTile(set, progress, i) {
  const best = progress.bestBySet?.[set.id] || 0
  const done = progress.completedSets?.[set.id]
  return `
    <button data-action="play-set" data-set="${set.id}" class="mystery-card ${accentClass[set.accent]} rise rise-${i + 1} rounded-[1.5rem] p-5 text-left">
      <div class="flex items-start justify-between">
        <span class="text-3xl">${set.emoji}</span>
        <span class="rounded-full bg-black/20 px-2 py-1 text-[11px] uppercase tracking-wide">${set.days}</span>
      </div>
      <h3 class="font-display mt-3 text-2xl">${set.title}</h3>
      <p class="text-sm text-ink/70">${set.mood}</p>
      <p class="mt-3 text-xs text-ink/50">${done ? `Já jogou · melhor ${best} XP` : 'Ainda não jogou esta dezena'}</p>
    </button>
  `
}

export function chooseSet(progress) {
  return `
    <section class="rise">
      ${backRow('Qual dezena você quer ordenar?')}
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        ${SET_ORDER.map((id, i) => setTile(SETS[id], progress, i)).join('')}
      </div>
    </section>
  `
}

export function playSort(game) {
  const set = game.setId ? SETS[game.setId] : null
  const title = game.mode === 'timeline'
    ? 'Linha do tempo'
    : game.mode === 'daily'
      ? `Desafio de hoje · ${set.title}`
      : set.title
  const subtitle = game.mode === 'timeline'
    ? 'Coloque as cinco cenas na ordem da história da salvação.'
    : 'Toque numa carta e depois no espaço da conta. Ou arraste.'
  const results = game.results || []

  return `
    <section class="rise">
      ${backRow(title)}
      <p class="mt-1 text-sm text-ink/65">${subtitle}</p>
      <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span class="glass rounded-full px-3 py-1">💡 dicas: ${game.hintsUsed}</span>
        ${set ? `<span class="glass rounded-full px-3 py-1">${set.emoji} ${set.days}</span>` : '<span class="glass rounded-full px-3 py-1">📜 do Natal à Glória</span>'}
      </div>

      <div class="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div class="rosary-thread space-y-3 pl-1">
          ${game.slots.map((slot, i) => slotRow(slot, i, results[i], game)).join('')}
        </div>
        <div>
          <p class="mb-3 text-xs uppercase tracking-[0.2em] text-ink/45">Contas embaralhadas</p>
          <div class="grid gap-3 sm:grid-cols-1">
            ${game.pool.length
              ? game.pool.map((m) => mysteryCard(m, game.selectedId === m.id, game.setId)).join('')
              : '<p class="glass rounded-2xl p-4 text-sm text-ink/60">Todas as contas estão no terço. Confira a ordem.</p>'}
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap gap-3">
        <button data-action="check-order" class="btn-gold rounded-2xl px-5 py-3 font-extrabold" ${game.slots.some((s) => !s) ? 'disabled style="opacity:.45"' : ''}>Conferir ordem</button>
        <button data-action="hint" class="glass rounded-2xl px-4 py-3">Dica (−12 XP)</button>
        <button data-action="reset-board" class="glass rounded-2xl px-4 py-3">Embaralhar de novo</button>
      </div>
    </section>
  `
}

function slotRow(slot, i, result, game) {
  const state = result ? (result.ok ? 'is-ok' : 'is-bad') : ''
  const label = game.mode === 'timeline' ? `${i + 1}º na história` : `${i + 1}º mistério`
  return `
    <div class="flex items-stretch gap-3">
      <div class="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-deep font-display text-lg text-[#3a2208] shadow-[0_0_18px_rgba(232,197,71,.35)]">${i + 1}</div>
      <div class="slot flex-1 p-2 ${state}" data-action="pick-slot" data-slot="${i}">
        ${slot
          ? mysteryCard(slot, game.selectedId === slot.id, slot.set, true)
          : `<button type="button" data-action="pick-slot" data-slot="${i}" class="flex h-full min-h-[72px] w-full items-center justify-center text-sm text-ink/35">${label}</button>`}
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
        <span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/20 text-xl">${m.emoji}</span>
        <span class="min-w-0">
          <span class="block font-bold leading-tight">${m.title}</span>
          <span class="block truncate text-xs text-ink/60">${compact ? set.name : m.short}</span>
        </span>
      </div>
    </button>
  `
}

export function resultSort(game, tally, progress, unlocked) {
  const perfect = tally.perfect
  const praise = perfect ? PRAISES[Math.floor(Math.random() * PRAISES.length)] : NUDGES[Math.floor(Math.random() * NUDGES.length)]
  const lvl = levelFor(progress.xp)
  return `
    <section class="rise mx-auto max-w-xl text-center">
      ${perfect ? `<div class="seal mx-auto pop font-display text-xl leading-tight"><span>Dezena</span><span>perfeita</span></div>` : `<div class="pop mx-auto w-fit">${tercoIcon('h-24 w-24')}</div>`}
      <h1 class="font-display mt-5 text-4xl text-gold">${perfect ? 'Ordem celeste!' : `${tally.correct} de 5`}</h1>
      <p class="mt-2 text-ink/75">${praise}</p>
      <div class="mt-6 grid grid-cols-3 gap-3">
        ${stat('✨', `+${tally.xp}`, 'XP')}
        ${stat('⏱️', `${tally.seconds}s`, 'tempo')}
        ${stat('🔥', progress.streak, 'sequência')}
      </div>
      <p class="mt-4 text-sm text-ink/55">${lvl.current.name} · ${progress.xp} XP</p>
      ${unlocked.length ? `<div class="mt-4 space-y-2">${unlocked.map((a) => `<p class="glass rounded-2xl px-4 py-3">🏅 Nova conquista: <b class="inline-flex items-center gap-1">${mark(a.emoji, 'h-5 w-5')} ${a.name}</b></p>`).join('')}</div>` : ''}
      <div class="mt-6 space-y-2 text-left">
        ${game.slots.map((m, i) => {
          const ok = game.results[i]?.ok
          const expected = game.results[i]?.expected
          return `<div class="glass flex items-center gap-3 rounded-2xl px-3 py-2 ${ok ? '' : 'opacity-90'}">
            <span class="w-6 text-center">${ok ? '✅' : '❌'}</span>
            <span class="text-sm"><b>${i + 1}.</b> ${ok ? m.title : expected.title}</span>
          </div>`
        }).join('')}
      </div>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button data-action="replay" class="btn-gold rounded-2xl px-5 py-3 font-extrabold">Jogar de novo</button>
        <button data-action="home" class="glass rounded-2xl px-5 py-3">Voltar ao início</button>
        <button data-action="learn" class="glass rounded-2xl px-5 py-3">Estudar os mistérios</button>
      </div>
    </section>
  `
}

export function playQuiz(quiz) {
  const q = quiz.questions[quiz.index]
  const set = q.mystery ? SETS[q.mystery.set] : null
  return `
    <section class="rise mx-auto max-w-xl">
      ${backRow('Quiz relâmpago')}
      <div class="mt-2 flex items-center justify-between text-xs text-ink/50">
        <span>Pergunta ${quiz.index + 1} de ${quiz.questions.length}</span>
        <span>${quiz.answers.filter((a) => a.ok).length} ${quiz.answers.filter((a) => a.ok).length === 1 ? 'acerto' : 'acertos'}</span>
      </div>
      <div class="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div class="xp-fill h-full" style="width:${((quiz.index) / quiz.questions.length) * 100}%"></div>
      </div>
      ${q.mystery ? `
        <div class="mystery-card ${accentClass[set.accent]} mt-6 rounded-[1.6rem] p-5">
          <div class="text-3xl">${q.mystery.emoji}</div>
          <h2 class="font-display mt-2 text-3xl">${q.mystery.title}</h2>
          <p class="text-sm text-ink/65">${q.mystery.short}</p>
        </div>
      ` : `<div class="glass mt-6 rounded-[1.6rem] p-5 text-4xl">⚡</div>`}
      <h3 class="mt-5 text-lg font-bold">${q.prompt}</h3>
      <div class="mt-4 grid gap-3">
        ${q.options.map((opt) => `
          <button data-action="quiz-answer" data-id="${opt.id}" class="glass rounded-2xl px-4 py-3 text-left transition hover:-translate-y-0.5">
            <span class="mr-2">${opt.emoji || '•'}</span> ${opt.label}
          </button>
        `).join('')}
      </div>
    </section>
  `
}

export function resultQuiz(tally, progress, unlocked) {
  return `
    <section class="rise mx-auto max-w-xl text-center">
      <div class="text-5xl pop">⚡</div>
      <h1 class="font-display mt-4 text-4xl text-gold">${tally.correct}/${tally.total}</h1>
      <p class="mt-2 text-ink/75">${tally.perfect ? 'Relâmpago santo. Você manda no terço.' : 'Cada erro é uma Ave Maria a mais para lembrar.'}</p>
      <div class="mt-6 grid grid-cols-3 gap-3">
        ${stat('✨', `+${tally.xp}`, 'XP')}
        ${stat('🔥', progress.streak, 'sequência')}
        ${stat('📿', progress.beads, 'contas')}
      </div>
      ${unlocked.length ? `<div class="mt-4 space-y-2">${unlocked.map((a) => `<p class="glass flex items-center justify-center gap-2 rounded-2xl px-4 py-3">🏅 ${mark(a.emoji, 'h-5 w-5')} ${a.name}</p>`).join('')}</div>` : ''}
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button data-action="play-quiz" class="btn-gold rounded-2xl px-5 py-3 font-extrabold">Outra rodada</button>
        <button data-action="home" class="glass rounded-2xl px-5 py-3">Início</button>
      </div>
    </section>
  `
}

export function learn() {
  return `
    <section class="rise">
      ${backRow('Aprenda, depois jogue')}
      <p class="mt-2 max-w-xl text-sm text-ink/70">A ordem da vida de Cristo: Gozosos, Luminosos, Dolorosos, Gloriosos. Toque um conjunto para ver as cinco contas.</p>
      <div class="mt-5 grid gap-3">
        ${SET_ORDER.map((id) => {
          const set = SETS[id]
          return `
            <button data-action="learn-set" data-set="${id}" class="mystery-card ${accentClass[set.accent]} rounded-[1.5rem] p-5 text-left">
              <div class="flex items-center justify-between">
                <h3 class="font-display text-2xl">${set.emoji} ${set.title}</h3>
                <span class="text-xs text-ink/50">${set.days}</span>
              </div>
              <p class="mt-1 text-sm text-ink/70">${set.mood}</p>
            </button>
          `
        }).join('')}
      </div>
    </section>
  `
}

export function learnSet(setId) {
  const set = SETS[setId]
  const list = mysteriesOf(setId)
  return `
    <section class="rise">
      ${backRow(set.title, 'learn')}
      <p class="text-sm text-ink/65">${set.days} · fruto: ${set.fruit}</p>
      <div class="mt-5 space-y-4">
        ${list.map((m, i) => `
          <article class="mystery-card ${accentClass[set.accent]} rise rise-${i + 1} rounded-[1.5rem] p-5">
            <div class="flex items-center gap-3">
              <span class="grid h-10 w-10 place-items-center rounded-full bg-black/25 font-display text-lg">${m.order}</span>
              <div>
                <h3 class="font-display text-2xl">${m.emoji} ${m.title}</h3>
                <p class="text-sm text-ink/65">${m.short}</p>
              </div>
            </div>
            <p class="mt-3 text-sm italic text-gold/90">“${m.verse}”</p>
            <p class="text-xs text-ink/45">${m.verseRef} · fruto: ${m.fruit}</p>
          </article>
        `).join('')}
      </div>
      <button data-action="play-set" data-set="${setId}" class="btn-gold mt-6 w-full rounded-2xl px-5 py-3 font-extrabold">Praticar esta dezena</button>
    </section>
  `
}

export function how() {
  return `
    <section class="rise mx-auto max-w-2xl">
      ${backRow('Como jogar')}
      <div class="mt-4 space-y-4">
        ${howStep('1', 'Escolha um modo', 'O desafio de hoje segue o terço da Igreja: segunda e sábado gozosos, terça e sexta dolorosos, quarta e domingo gloriosos, quinta luminosos.')}
        ${howStep('2', 'Monte a dezena', 'Toque uma carta embaralhada e depois o espaço da conta (1 a 5). Toque de novo para tirar. Também dá para arrastar.')}
        ${howStep('3', 'Ganhe XP e contas', 'Cada posição certa vale pontos. Dezena perfeita ganha bônus. Jogar todo dia acende a chama.')}
        ${howStep('4', 'Sem login', 'Seu nome e seu recorde ficam neste navegador. Pode hospedar na Vercel e mandar o link para a catequese.')}
      </div>
      <div class="glass mt-6 rounded-[1.5rem] p-5">
        <h3 class="font-display text-2xl text-gold">A ordem da vida de Cristo</h3>
        <ol class="mt-3 space-y-2 text-sm text-ink/75">
          <li>1. Gozosos — infância</li>
          <li>2. Luminosos — vida pública</li>
          <li>3. Dolorosos — Paixão</li>
          <li>4. Gloriosos — Páscoa e glória de Maria</li>
        </ol>
      </div>
    </section>
  `
}

function howStep(n, title, text) {
  return `
    <div class="glass flex gap-4 rounded-[1.4rem] p-4">
      <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-[#3a2208] font-display text-xl">${n}</div>
      <div>
        <h3 class="font-bold">${title}</h3>
        <p class="text-sm text-ink/70">${text}</p>
      </div>
    </div>
  `
}

export function achievements(progress) {
  const have = new Set(progress.achievements)
  return `
    <section class="rise">
      ${backRow('Conquistas')}
      <p class="text-sm text-ink/65">${have.size} de ${ACHIEVEMENTS.length} selos. Continue jogando — o terço ama persistência.</p>
      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        ${ACHIEVEMENTS.map((a) => `
          <div class="glass rounded-[1.4rem] p-4 ${have.has(a.id) ? '' : 'opacity-40'}">
            <div class="flex h-12 items-center text-2xl">${mark(a.emoji, 'h-12 w-12')}</div>
            <h3 class="mt-1 font-bold">${a.name}</h3>
            <p class="text-sm text-ink/65">${a.desc}</p>
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
      <h1 class="font-display text-3xl text-gold">${title}</h1>
    </div>
  `
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
    el.style.background = colors[i % colors.length]
    el.style.animationDuration = `${1.6 + Math.random() * 1.4}s`
    el.style.transform = `rotate(${Math.random() * 180}deg)`
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 3200)
  }
}
