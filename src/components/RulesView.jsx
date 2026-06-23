// Static Rules tab, ported from the prototype: my operating system behind the app.
export default function RulesView() {
  return (
    <>
      <header className="header">
        <div className="eyebrow">
          <span><span className="dot" />Operating system</span>
          <span>v1.0</span>
        </div>
        <h1>My <em>rules</em></h1>
      </header>

      <div className="rule-block">
        <h2>Strength</h2>
        <div className="rule"><span className="rule-num">RULE 01 · EARN THE JUMP</span>Hold the weight. +1 rep/session until 12 on all sets. Then <b>earn +5kg and rebuild from ~8</b>. Stacks have no microplates, so jumps are big. Every session has a target.</div>
        <div className="rule"><span className="rule-num">RULE 02 · BEAT THE LOGBOOK</span>Beat last session on <b>something</b>. One rep, one set, one earned stack. Beat nothing = a flag, not a failure.</div>
        <div className="rule"><span className="rule-num">RULE 03 · LAST 2 REPS HARD</span>Could do 15? Too light, earn the jump now. Can't reach 8? Down a stack. Ego costs progress both ways.</div>
        <div className="rule"><span className="rule-num">RULE 04 · 3×/WEEK (2 FLOOR)</span>48h between sessions. Leave home by <b>19:00</b>. Every missed session was a late departure, not low motivation.</div>
        <div className="rule"><span className="rule-num">RULE 05 · DON'T CHANGE BEFORE WK 8</span>Same template, more weight. Program-hopping keeps beginners weak. Boring is correct.</div>
      </div>

      <div className="rule-block">
        <h2>Belly fat</h2>
        <div className="rule"><span className="rule-num">LEVER 01 · DEFICIT</span>~300 kcal under maintenance. Not 500+. First: <b>track 14 days</b> to find my real intake. The plateau means actual ≈ maintenance.</div>
        <div className="rule"><span className="rule-num">LEVER 02 · SLEEP</span>Fragmented sleep stores belly fat via cortisol. Fixing sleep ≈ 200 kcal/day. It's fat-loss work.</div>
        <div className="rule"><span className="rule-num">LEVER 03 · PROTEIN 130–150g</span>Highest satiety + thermic effect, protects muscle in the deficit.</div>
        <div className="rule"><span className="rule-num">NO SPOT REDUCTION</span>No ab exercise burns belly fat. Total body fat drops → belly follows, last. The tape moves before the scale.</div>
        <div className="rule"><span className="rule-num">ZONE 2</span>2–3× 30–45 min sustained (cycle/walk/row). Counts only if continuous. Add on non-lifting days.</div>
      </div>

      <div className="rule-block">
        <h2>Sleep</h2>
        <div className="rule"><span className="rule-num">ANCHOR THE WAKE</span>Fixed alarm 11:00–11:30 daily, weekends too. <b>Kill the back-to-bed</b>. Phone outside the room.</div>
        <div className="rule"><span className="rule-num">CONSISTENCY FIRST</span>Stabilize 03:30 bed / 11:00 wake. Only after 2 stable weeks, shift earlier 15 min every 2–3 days.</div>
        <div className="rule"><span className="rule-num">MELATONIN</span>0.3–0.5mg, 60–90 min before bed. A signal, not a sedative. More = morning grog.</div>
        <div className="rule"><span className="rule-num">7h MINIMUM</span>11:00 wake needs 03:30 bed. 6h is a deficit night. My data proves it.</div>
      </div>

      <div className="rule-block">
        <h2>Creatine</h2>
        <div className="rule"><span className="rule-num">DOSE</span><b>3–5g monohydrate daily</b>, any time, forever. No loading. Creapure or any reputable brand.</div>
        <div className="rule"><span className="rule-num">THE WATER WEIGHT</span>+1–2kg scale in weeks 1–4 = water inside muscle, NOT fat. Use the tape this window.</div>
      </div>

      <div className="rule-block">
        <h2>Anti-stuck</h2>
        <div className="rule"><span className="rule-num">PLATEAU = DATA</span>Stalled 2+ wks? Check in order: 1) intake crept 2) sleep slipped 3) stimulus stale 4) life load. All fixable in 1–2 wks.</div>
        <div className="rule"><span className="rule-num">MINIMUM VIABLE WEEK</span>1 home band session + wake anchor held = a successful week in a crisis. Bar stays on the floor.</div>
        <div className="rule"><span className="rule-num">NEVER ASSESS ON A BAD WEEK</span>Review monthly on data: logbook trend, tape trend. Not motivation, not the mirror.</div>
      </div>
    </>
  )
}
