export const SETS = {
  gozosos: {
    id: 'gozosos',
    name: 'Gozosos',
    title: 'Mistérios Gozosos',
    days: 'Segunda e sábado',
    mood: 'A infância de Jesus, o sim de Maria.',
    fruit: 'Alegria',
    emoji: '🌟',
    accent: 'joy',
  },
  luminosos: {
    id: 'luminosos',
    name: 'Luminosos',
    title: 'Mistérios Luminosos',
    days: 'Quinta-feira',
    mood: 'A vida pública de Cristo, a Luz do mundo.',
    fruit: 'Luz',
    emoji: '✨',
    accent: 'light',
  },
  dolorosos: {
    id: 'dolorosos',
    name: 'Dolorosos',
    title: 'Mistérios Dolorosos',
    days: 'Terça e sexta',
    mood: 'A Paixão, o amor que entrega tudo.',
    fruit: 'Coragem',
    emoji: '✝️',
    accent: 'sorrow',
  },
  gloriosos: {
    id: 'gloriosos',
    name: 'Gloriosos',
    title: 'Mistérios Gloriosos',
    days: 'Quarta e domingo',
    mood: 'A vitória da Páscoa até a coroa de Maria.',
    fruit: 'Esperança',
    emoji: '👑',
    accent: 'glory',
  },
}

export const SET_ORDER = ['gozosos', 'luminosos', 'dolorosos', 'gloriosos']

export const MYSTERIES = [
  {
    id: 'g1',
    set: 'gozosos',
    order: 1,
    chrono: 1,
    emoji: '👼',
    title: 'A Anunciação',
    short: 'O Anjo Gabriel visita Maria',
    fruit: 'Humildade',
    verse: 'Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra.',
    verseRef: 'Lc 1,38',
    hint: 'Em Nazaré, um anjo pede um sim.',
  },
  {
    id: 'g2',
    set: 'gozosos',
    order: 2,
    chrono: 2,
    emoji: '🏃‍♀️',
    title: 'A Visitação',
    short: 'Maria visita sua prima Isabel',
    fruit: 'Caridade',
    verse: 'Bendita és tu entre as mulheres e bendito é o fruto do teu ventre.',
    verseRef: 'Lc 1,42',
    hint: 'Maria parte depressa para a casa de Isabel.',
  },
  {
    id: 'g3',
    set: 'gozosos',
    order: 3,
    chrono: 3,
    emoji: '🌟',
    title: 'O Nascimento de Jesus',
    short: 'O Verbo se faz carne em Belém',
    fruit: 'Pobreza de espírito',
    verse: 'Deu à luz o seu filho primogênito, envolveu-o em panos e reclinou-o numa manjedoura.',
    verseRef: 'Lc 2,7',
    hint: 'Uma estrela, uma manjedoura, a noite de Belém.',
  },
  {
    id: 'g4',
    set: 'gozosos',
    order: 4,
    chrono: 4,
    emoji: '🕊️',
    title: 'A Apresentação no Templo',
    short: 'Jesus é apresentado a Deus',
    fruit: 'Obediência',
    verse: 'Meus olhos viram a tua salvação, que preparaste diante de todos os povos.',
    verseRef: 'Lc 2,30-31',
    hint: 'Simeão espera no Templo, com os braços abertos.',
  },
  {
    id: 'g5',
    set: 'gozosos',
    order: 5,
    chrono: 5,
    emoji: '📖',
    title: 'O Encontro no Templo',
    short: 'Maria e José encontram Jesus entre os doutores',
    fruit: 'Buscar a Jesus',
    verse: 'Não sabíeis que eu devo estar na casa de meu Pai?',
    verseRef: 'Lc 2,49',
    hint: 'Três dias perdidos, e o menino ensina no Templo.',
  },
  {
    id: 'l1',
    set: 'luminosos',
    order: 1,
    chrono: 6,
    emoji: '💧',
    title: 'O Batismo no Jordão',
    short: 'João batiza Jesus nas águas',
    fruit: 'Abertura ao Espírito',
    verse: 'Este é o meu Filho amado, em quem me comprazo.',
    verseRef: 'Mt 3,17',
    hint: 'O céu se abre sobre o rio Jordão.',
  },
  {
    id: 'l2',
    set: 'luminosos',
    order: 2,
    chrono: 7,
    emoji: '🍷',
    title: 'As Bodas de Caná',
    short: 'O primeiro sinal, a pedido de Maria',
    fruit: 'Confiança em Maria',
    verse: 'Fazei o que ele vos disser.',
    verseRef: 'Jo 2,5',
    hint: 'A água vira vinho numa festa de casamento.',
  },
  {
    id: 'l3',
    set: 'luminosos',
    order: 3,
    chrono: 8,
    emoji: '📣',
    title: 'O Anúncio do Reino',
    short: 'Jesus proclama o Evangelho e chama à conversão',
    fruit: 'Conversão',
    verse: 'O tempo se cumpriu e o Reino de Deus está próximo. Convertei-vos.',
    verseRef: 'Mc 1,15',
    hint: 'A Luz prega: convertei-vos e crede.',
  },
  {
    id: 'l4',
    set: 'luminosos',
    order: 4,
    chrono: 9,
    emoji: '⛰️',
    title: 'A Transfiguração',
    short: 'Jesus revela sua glória no Tabor',
    fruit: 'Desejo de santidade',
    verse: 'Seu rosto brilhou como o sol e suas vestes tornaram-se brancas como a luz.',
    verseRef: 'Mt 17,2',
    hint: 'No monte, Moisés e Elias conversam com Ele.',
  },
  {
    id: 'l5',
    set: 'luminosos',
    order: 5,
    chrono: 10,
    emoji: '🍞',
    title: 'A Instituição da Eucaristia',
    short: 'O pão e o vinho se tornam seu Corpo e Sangue',
    fruit: 'Amor à Eucaristia',
    verse: 'Isto é o meu corpo, que é dado por vós. Fazei isto em memória de mim.',
    verseRef: 'Lc 22,19',
    hint: 'Na Última Ceia, Ele se entrega no pão.',
  },
  {
    id: 'd1',
    set: 'dolorosos',
    order: 1,
    chrono: 11,
    emoji: '🌸',
    title: 'A Agonia no Horto',
    short: 'Jesus reza no Getsêmani',
    fruit: 'Contrição',
    verse: 'Pai, se queres, afasta de mim este cálice; contudo, não a minha vontade, mas a tua.',
    verseRef: 'Lc 22,42',
    hint: 'Entre oliveiras, o cálice da Paixão.',
  },
  {
    id: 'd2',
    set: 'dolorosos',
    order: 2,
    chrono: 12,
    emoji: '🪢',
    title: 'A Flagelação',
    short: 'Jesus é açoitado na coluna',
    fruit: 'Mortificação',
    verse: 'Pilatos mandou então flagelar Jesus.',
    verseRef: 'Jo 19,1',
    hint: 'Preso à coluna, Ele sofre pelos nossos pecados.',
  },
  {
    id: 'd3',
    set: 'dolorosos',
    order: 3,
    chrono: 13,
    emoji: '🌿',
    title: 'A Coroação de Espinhos',
    short: 'O Rei dos reis recebe uma coroa cruel',
    fruit: 'Coragem moral',
    verse: 'Teceram uma coroa de espinhos, puseram-na na sua cabeça.',
    verseRef: 'Mt 27,29',
    hint: 'Uma coroa que fere, e mesmo assim Ele é Rei.',
  },
  {
    id: 'd4',
    set: 'dolorosos',
    order: 4,
    chrono: 14,
    emoji: '✝️',
    title: 'Jesus carrega a Cruz',
    short: 'O caminho do Calvário',
    fruit: 'Paciência',
    verse: 'Carregando a sua cruz, saiu para o lugar chamado Calvário.',
    verseRef: 'Jo 19,17',
    hint: 'A Via-Sacra começa: Ele sobe com a cruz.',
  },
  {
    id: 'd5',
    set: 'dolorosos',
    order: 5,
    chrono: 15,
    emoji: '💔',
    title: 'A Crucifixão e Morte',
    short: 'Jesus entrega o espírito no Calvário',
    fruit: 'Perdão',
    verse: 'Pai, em tuas mãos entrego o meu espírito.',
    verseRef: 'Lc 23,46',
    hint: 'No alto da cruz, o amor chega ao fim — e ao começo.',
  },
  {
    id: 'gl1',
    set: 'gloriosos',
    order: 1,
    chrono: 16,
    emoji: '🌅',
    title: 'A Ressurreição',
    short: 'Cristo vence a morte no terceiro dia',
    fruit: 'Fé',
    verse: 'Não está aqui; ressuscitou.',
    verseRef: 'Lc 24,6',
    hint: 'O sepulcro está vazio na madrugada de Páscoa.',
  },
  {
    id: 'gl2',
    set: 'gloriosos',
    order: 2,
    chrono: 17,
    emoji: '☁️',
    title: 'A Ascensão',
    short: 'Jesus sobe ao céu e senta-se à direita do Pai',
    fruit: 'Esperança',
    verse: 'Foi elevado à vista deles, e uma nuvem o ocultou a seus olhos.',
    verseRef: 'At 1,9',
    hint: 'Uma nuvem o esconde, e a missão começa.',
  },
  {
    id: 'gl3',
    set: 'gloriosos',
    order: 3,
    chrono: 18,
    emoji: '🔥',
    title: 'A Vinda do Espírito Santo',
    short: 'Pentecostes desce sobre Maria e os apóstolos',
    fruit: 'Amor ao Espírito',
    verse: 'Todos ficaram cheios do Espírito Santo.',
    verseRef: 'At 2,4',
    hint: 'Línguas de fogo no Cenáculo.',
  },
  {
    id: 'gl4',
    set: 'gloriosos',
    order: 4,
    chrono: 19,
    emoji: '🌹',
    title: 'A Assunção de Maria',
    short: 'Maria é elevada ao céu em corpo e alma',
    fruit: 'Graça de uma boa morte',
    verse: 'Uma grande mulher, vestida de sol, com a lua debaixo dos pés.',
    verseRef: 'Ap 12,1',
    hint: 'O Filho não deixa a Mãe conhecer a corrupção.',
  },
  {
    id: 'gl5',
    set: 'gloriosos',
    order: 5,
    chrono: 20,
    emoji: '👑',
    title: 'A Coroação de Maria',
    short: 'Maria é coroada Rainha do céu e da terra',
    fruit: 'Confiança na intercessão de Maria',
    verse: 'Sobre a sua cabeça, uma coroa de doze estrelas.',
    verseRef: 'Ap 12,1',
    hint: 'A serva de Nazaré agora é Rainha.',
  },
]

export const LEVELS = [
  { min: 0, name: 'Semente', blurb: 'Tudo começa com um sim.' },
  { min: 80, name: 'Coroinha', blurb: 'Já ajuda a preparar o altar.' },
  { min: 200, name: 'Acólito', blurb: 'Serve com atenção e alegria.' },
  { min: 400, name: 'Peregrino', blurb: 'Caminha com o terço na mão.' },
  { min: 700, name: 'Discípulo', blurb: 'A ordem dos mistérios já mora no coração.' },
  { min: 1100, name: 'Cavaleiro de Maria', blurb: 'Defende a Rainha com o terço.' },
  { min: 1600, name: 'Apóstolo do Terço', blurb: 'Ensina os mistérios brincando.' },
  { min: 2400, name: 'Guardião do Rosário', blurb: 'Vinte contas, uma só fé.' },
  { min: 3400, name: 'Servo da Rainha', blurb: 'Ave Maria, cheia de graça.' },
]

export const ACHIEVEMENTS = [
  { id: 'primeiro-passo', name: 'Primeira Ave', desc: 'Termine o primeiro jogo.', emoji: '🌱' },
  { id: 'dezena-perfeita', name: 'Dezena perfeita', desc: 'Acerte a ordem das 5 contas.', emoji: '💎' },
  { id: 'quatro-luzes', name: 'Quatro coroas', desc: 'Complete os quatro conjuntos ao menos uma vez.', emoji: '💠' },
  { id: 'chama-sete', name: 'Chama de sete dias', desc: 'Mantenha uma sequência de 7 dias.', emoji: '🔥' },
  { id: 'relampago', name: 'Relâmpago', desc: 'Acerte 5 perguntas no quiz.', emoji: '⚡' },
  { id: 'cronista', name: 'Cronista do Evangelho', desc: 'Acerte a linha do tempo.', emoji: '📜' },
  { id: 'vinte-contas', name: 'Rosário completo', desc: 'Junte 20 contas de luz.', emoji: '📿' },
  { id: 'mestre-gozoso', name: 'Mestre gozoso', desc: 'Três dezenas perfeitas dos Gozosos.', emoji: '🌟' },
  { id: 'mestre-luminoso', name: 'Mestre luminoso', desc: 'Três dezenas perfeitas dos Luminosos.', emoji: '✨' },
  { id: 'mestre-doloroso', name: 'Mestre doloroso', desc: 'Três dezenas perfeitas dos Dolorosos.', emoji: '✝️' },
  { id: 'mestre-glorioso', name: 'Mestre glorioso', desc: 'Três dezenas perfeitas dos Gloriosos.', emoji: '👑' },
  { id: 'peregrino', name: 'Caminho aberto', desc: 'Alcance o nível Peregrino.', emoji: '🚶' },
]

export function mysteriesOf(setId) {
  return MYSTERIES.filter((m) => m.set === setId).sort((a, b) => a.order - b.order)
}

export function mysteryById(id) {
  return MYSTERIES.find((m) => m.id === id)
}

export function todaySetId(date = new Date()) {
  const map = {
    0: 'gloriosos',
    1: 'gozosos',
    2: 'dolorosos',
    3: 'gloriosos',
    4: 'luminosos',
    5: 'dolorosos',
    6: 'gozosos',
  }
  return map[date.getDay()]
}

export function localDateKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function levelFor(xp) {
  let current = LEVELS[0]
  let next = LEVELS[1]
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (xp >= LEVELS[i].min) {
      current = LEVELS[i]
      next = LEVELS[i + 1] || null
    }
  }
  const span = next ? next.min - current.min : 1
  const into = xp - current.min
  const progress = next ? Math.min(1, into / span) : 1
  return { current, next, progress, xp }
}

export const PRAISES = [
  'Ave, peregrino! A ordem ficou linda.',
  'Nossa Senhora sorri com essa dezena.',
  'Contas no lugar, coração em paz.',
  'É assim que se reza brincando.',
  'O terço agradece. Joga de novo?',
]

export const NUDGES = [
  'Quase lá — duas contas ainda trocadas.',
  'Respira. Lembra da vida de Jesus, do começo ao fim.',
  'Uma dica: o primeiro mistério abre a história.',
  'Não desanima. O terço também se aprende errando.',
]
