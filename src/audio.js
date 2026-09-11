let ctx

function context() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq, duration, type = 'sine', gain = 0.05, delay = 0) {
  const audio = context()
  const osc = audio.createOscillator()
  const amp = audio.createGain()
  osc.type = type
  osc.frequency.value = freq
  amp.gain.value = 0
  osc.connect(amp)
  amp.connect(audio.destination)
  const t = audio.currentTime + delay
  amp.gain.setValueAtTime(0, t)
  amp.gain.linearRampToValueAtTime(gain, t + 0.02)
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export const sfx = {
  tap() {
    tone(620, 0.08, 'triangle', 0.03)
  },
  place() {
    tone(520, 0.12, 'sine', 0.04)
    tone(780, 0.16, 'triangle', 0.025, 0.04)
  },
  ok() {
    tone(523, 0.12, 'sine', 0.05)
    tone(659, 0.14, 'sine', 0.045, 0.07)
    tone(784, 0.2, 'sine', 0.04, 0.14)
  },
  bad() {
    tone(196, 0.18, 'sawtooth', 0.03)
    tone(164, 0.22, 'triangle', 0.025, 0.05)
  },
  win() {
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'sine', 0.045, i * 0.08))
  },
  streak() {
    tone(880, 0.1, 'triangle', 0.04)
    tone(1320, 0.18, 'sine', 0.035, 0.08)
  },
}
