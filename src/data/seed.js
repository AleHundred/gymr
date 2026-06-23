import { STORAGE_VERSION } from '../lib/storage.js'

// Progression defaults shared by every seeded exercise. Stack model: hold weight,
// climb reps to REP_HIGH on all sets, then earn +STACK_INCREMENT and rebuild from
// REP_RESET. REP_START is the baseline target for a brand-new exercise (no history).
// STACK_INCREMENT is per-exercise editable for machines with non-5kg real stacks.
const REP_START = 10
const REP_HIGH = 12
const REP_RESET = 8
const STACK_INCREMENT = 5

// The template, final per spec §3. `note` + `svg` lifted from the prototype.
const TEMPLATE = [
  {
    id: 'row', name: 'Rowing warmup', german: 'Rudergerät', section: 'Warmup', isWarmup: true,
    startWeight: 0, week8Target: '', videoUrl: '',
    note: 'Easy conversational pace, 5 min, damper 4–5. Legs, then back, then arms.'
  },
  {
    id: 'legpress', name: 'Leg press', german: 'Beinpresse', section: 'Legs', isWarmup: false,
    startWeight: 30, week8Target: '50–60kg', videoUrl: 'https://youtu.be/p5dCqF7wWUw',
    note: "Feet shoulder-width. Lower until knees ~90°. Don't lock at top."
  },
  {
    id: 'legcurl', name: 'Leg curl', german: 'Beinbeuger', section: 'Legs', isWarmup: false,
    startWeight: 15, week8Target: '25–30kg', videoUrl: 'https://youtu.be/mMvQmjN-EBs',
    note: 'Thighs under pad, ankles behind roller. Curl heels down. Slow return.'
  },
  {
    id: 'chestpress', name: 'Chest press', german: 'Brustpresse', section: 'Upper body', isWarmup: false,
    startWeight: 15, week8Target: '25–30kg', videoUrl: 'https://youtu.be/sqNwDkUU_Ps',
    note: "Handles at mid-chest. Push forward, don't lock elbows."
  },
  {
    id: 'chestfly', name: 'Chest fly', german: 'Butterfly', section: 'Upper body', isWarmup: false,
    startWeight: 10, week8Target: '15–20kg', videoUrl: 'https://youtu.be/Z57CtFmRMxA',
    note: 'Back on pad. Bring arms together in a hug. Slow return.'
  },
  {
    id: 'seatedrow', name: 'Seated row', german: 'Rudermaschine', section: 'Upper body', isWarmup: false,
    startWeight: 20, week8Target: '30–35kg', videoUrl: 'https://youtu.be/TeFo51Q_Nsc',
    note: 'Chest on pad, pull to ribs, squeeze blades. Not the cardio rower.'
  },
  {
    id: 'shoulder', name: 'Shoulder press', german: 'Schulterpresse', section: 'Upper body', isWarmup: false,
    startWeight: 10, week8Target: '15–20kg', videoUrl: 'https://youtu.be/TnhIyp4kmO8',
    note: 'Handles at shoulder height, press up. Core tight, no back arch.'
  },
  {
    id: 'lat', name: 'Lat pulldown', german: 'Latzug', section: 'Upper body', isWarmup: false,
    startWeight: 20, week8Target: '30–35kg', videoUrl: 'https://youtu.be/AOpi-p0cJkc',
    note: "Grip wide, pull to upper chest. Don't lean back much."
  }
]

export function seedExercises() {
  return TEMPLATE.map((ex, i) => ({
    ...ex,
    repStart: REP_START,
    repHigh: REP_HIGH,
    repReset: REP_RESET,
    stackIncrement: STACK_INCREMENT,
    active: true,
    order: i
  }))
}

export const DEFAULT_SETTINGS = {
  setsPerExercise: 3,
  gymName: 'Holmes Place',
  unit: 'kg'
}

export function initialState() {
  return {
    version: STORAGE_VERSION,
    exercises: seedExercises(),
    sessions: [],
    measurements: [],
    settings: { ...DEFAULT_SETTINGS },
    draft: { entries: {}, skipped: {} }
  }
}
