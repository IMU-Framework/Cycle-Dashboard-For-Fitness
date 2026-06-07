// Mobile (iOS) version of the Cycle Dashboard.
// Three screens — Today, Calendar, Reference — switched via bottom tab bar.

const { useState: useStateM, useMemo: useMemoM, useEffect: useEffectM } = React;

const M_DEFAULTS = /*EDITMODE-BEGIN*/{
  "anchorIso": "2026-05-22",
  "periodDays": 5,
  "goldenDays": 8,
  "steadyDays": 8,
  "restDays": 7,
  "useRealToday": true,
  "simulatedTodayIso": "2026-05-21"
} /*EDITMODE-END*/;

function MobileApp() {
  const [tw, setTweak] = window.useTweaks(M_DEFAULTS);
  const anchor = useMemoM(() => window.cycleHelpers.isoToDate(tw.anchorIso), [tw.anchorIso]);
  const phaseDays = useMemoM(() => ({
    period: tw.periodDays, golden: tw.goldenDays,
    steady: tw.steadyDays, rest: tw.restDays
  }), [tw.periodDays, tw.goldenDays, tw.steadyDays, tw.restDays]);
  const today = useMemoM(() => {
    if (tw.useRealToday) return window.cycleHelpers.startOfDay(new Date());
    return window.cycleHelpers.isoToDate(tw.simulatedTodayIso);
  }, [tw.useRealToday, tw.simulatedTodayIso]);

  const [tab, setTab] = useStateM('today');
  const [selected, setSelected] = useStateM(today);
  useEffectM(() => {setSelected(today);}, [today]);

  const phase = window.cycleHelpers.getPhase(selected, anchor, phaseDays);
  const cycleDay = window.cycleHelpers.getCycleDay(selected, anchor, phaseDays);
  const cycleLen = window.cycleHelpers.cycleLength(phaseDays);
  const cycleStart = window.cycleHelpers.cycleStart(selected, anchor, phaseDays);
  const nextPhase = window.cycleHelpers.nextPhaseStart(selected, anchor, phaseDays);
  const isToday = window.cycleHelpers.sameDay(selected, today);

  const stepDay = (delta) => {
    const d = new Date(selected);
    d.setDate(d.getDate() + delta);
    setSelected(d);
  };

  const isStandalone = true;

  const screen =
  <div className={'m-screen' + (isStandalone ? ' is-standalone' : '')} data-screen-label={`02 Mobile · ${tab}`}>
      <div className="m-screen__scroll">
        {tab === 'today' &&
      <TodayScreen
        today={today} selected={selected} phase={phase}
        cycleDay={cycleDay} cycleLen={cycleLen} cycleStart={cycleStart}
        nextPhase={nextPhase} isToday={isToday}
        phaseDays={phaseDays}
        onPrev={() => stepDay(-1)} onNext={() => stepDay(1)}
        onJumpToday={() => setSelected(today)} />

      }
        {tab === 'calendar' &&
      <CalendarScreen
        today={today} selected={selected} setSelected={(d) => {setSelected(d);setTab('today');}}
        anchor={anchor} phaseDays={phaseDays} />

      }
        {tab === 'reference' && <ReferenceScreen currentKey={phase.key} />}
      </div>
      <TabBar tab={tab} setTab={setTab} standalone={isStandalone} />
    </div>;


  return (
    <div className="m-app m-app--standalone">
      {screen}
      <window.TweaksPanel title="設定">
        <window.TweakSection label="今天">
          <window.TweakToggle label="使用真實今天"
          value={tw.useRealToday} onChange={(v) => setTweak('useRealToday', v)} />
          {!tw.useRealToday &&
          <window.TweakText label="模擬今天" value={tw.simulatedTodayIso}
          onChange={(v) => setTweak('simulatedTodayIso', v)} />
          }
        </window.TweakSection>
        <window.TweakSection label="週期錨點">
          <window.TweakText label="最近一次生理期 D1" value={tw.anchorIso}
          onChange={(v) => setTweak('anchorIso', v)} />
        </window.TweakSection>
        <window.TweakSection label={`各階段天數（合計 ${cycleLen}）`}>
          <window.TweakSlider label="生理期" value={tw.periodDays} min={2} max={10} unit=" 天"
          onChange={(v) => setTweak('periodDays', v)} />
          <window.TweakSlider label="超速期" value={tw.goldenDays} min={3} max={14} unit=" 天"
          onChange={(v) => setTweak('goldenDays', v)} />
          <window.TweakSlider label="平快期" value={tw.steadyDays} min={3} max={12} unit=" 天"
          onChange={(v) => setTweak('steadyDays', v)} />
          <window.TweakSlider label="經前休息期" value={tw.restDays} min={2} max={10} unit=" 天"
          onChange={(v) => setTweak('restDays', v)} />
        </window.TweakSection>
      </window.TweaksPanel>
    </div>);

}

// ─── Today screen ────────────────────────────────────────────────────────
function TodayScreen({
  today, selected, phase, cycleDay, cycleLen, cycleStart, nextPhase, isToday,
  phaseDays, onPrev, onNext, onJumpToday
}) {
  const fmt = window.cycleHelpers.formatDate;
  const dateLong = fmt(selected, { long: true });
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setDate(cycleEnd.getDate() + cycleLen - 1);

  // Use the dark text variant for low-contrast phase backgrounds
  const quoteColor = phase.textOn === '#FFFFFF' ? phase.edge : phase.textOn;

  return (
    <div className="m-today">
      <div className="m-today__topbar">
        <button className="m-today__settings" onClick={openTweaks} aria-label="設定">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
        <div className="m-today__brand">週期儀表板</div>
        <button className="m-today__settings m-today__settings--ghost" aria-hidden="true" />
      </div>

      <div className="m-today__dateline" style={{ margin: "0px 0px 6px" }}>
        <button className="m-today__navbtn" onClick={onPrev} aria-label="前一天">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="m-today__date">
          <div className="m-today__date-main">{dateLong}</div>
          {!isToday &&
          <button className="m-today__back" onClick={onJumpToday}>回到今天</button>
          }
        </div>
        <button className="m-today__navbtn" onClick={onNext} aria-label="後一天">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <CycleRing phase={phase} cycleDay={cycleDay} cycleLen={cycleLen} phaseDays={phaseDays} />

      <div className="m-card m-card--quote" style={{ background: phase.softColor, borderColor: phase.edge, padding: "10px 18px", margin: "0px 0px 10px" }}>
        <div className="m-card__quote" style={{ color: quoteColor, letterSpacing: "1px", textAlign: "center" }}>
          {phase.quote}
        </div>
      </div>

      <div className="m-card m-card--explain">
        <p className="m-card__text" style={{ fontSize: "14px", letterSpacing: "0.3px", lineHeight: "1.65" }}>{phase.explanation}</p>
        {phase.exercise &&
        <div className="m-card__exercise" style={{ borderColor: phase.edge }}>
          <div className="m-card__exercise-label">運動策略</div>
          <p className="m-card__exercise-text">{phase.exercise}</p>
        </div>}
      </div>

      <div className="m-stats">
        <Stat label="本週期開始" value={fmt(cycleStart)} />
        <Stat label="本週期結束" value={fmt(cycleEnd)} />
        {nextPhase ?
        <Stat label="下一階段" value={`${nextPhase.daysUntil} 天後`} sub={fmt(nextPhase.date)} /> :

        <Stat label="週期長度" value={`${cycleLen} 天`} />
        }
      </div>
    </div>);

}

function Stat({ label, value, sub }) {
  return (
    <div className="m-stat">
      <div className="m-stat__label">{label}</div>
      <div className="m-stat__value">{value}</div>
      {sub && <div className="m-stat__sub">{sub}</div>}
    </div>);

}

// ─── Circular cycle ring (SVG donut) ─────────────────────────────────────
function CycleRing({ phase, cycleDay, cycleLen, phaseDays }) {
  const size = 260;
  const stroke = 26;
  const r = (size - stroke) / 2;
  const cx = size / 2,cy = size / 2;
  const circ = 2 * Math.PI * r;

  const segs = window.cycleHelpers.phaseSegments(phaseDays);
  // We'll start the cycle at the top of the ring (12 o'clock).
  let accDays = 0;
  const arcs = segs.map((seg) => {
    const startFrac = accDays / cycleLen;
    accDays += seg.days;
    const endFrac = accDays / cycleLen;
    return {
      key: seg.key,
      color: window.PHASES[seg.key].color,
      edge: window.PHASES[seg.key].edge,
      dashStart: startFrac * circ,
      dashLen: (endFrac - startFrac) * circ - 2 // small gap
    };
  });

  // Marker angle (day 1 at top, going clockwise)
  const markerFrac = (cycleDay - 0.5) / cycleLen;
  const angle = markerFrac * 2 * Math.PI - Math.PI / 2;
  const mx = cx + r * Math.cos(angle);
  const my = cy + r * Math.sin(angle);

  return (
    <div className="m-ring">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ width: "240px" }}>
        {/* Rotate to start at 12 o'clock */}
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {arcs.map((a) =>
          <circle
            key={a.key}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={stroke}
            strokeDasharray={`${a.dashLen} ${circ - a.dashLen}`}
            strokeDashoffset={-a.dashStart}
            strokeLinecap="butt" />

          )}
        </g>
        {/* Day marker */}
        <circle cx={mx} cy={my} r={stroke / 2 + 4} fill="#FFFFFF" />
        <circle cx={mx} cy={my} r={stroke / 2 - 2} fill={phase.edge} />
      </svg>
      <div className="m-ring__center">
        <div className="m-ring__chip" style={{ background: phase.color, color: phase.textOn, borderColor: phase.edge }}>
          <span className="m-ring__dot" style={{ background: 'currentColor' }} />
          {phase.name}
        </div>
        <div className="m-ring__day">D{cycleDay}<span className="m-ring__day-total"> / {cycleLen}</span></div>
      </div>
    </div>);

}

// ─── Calendar screen ─────────────────────────────────────────────────────
function CalendarScreen({ today, selected, setSelected, anchor, phaseDays }) {
  const [monthOffset, setMonthOffset] = useStateM(0);
  // Anchor month = today's month + offset
  const base = useMemoM(() => new Date(today.getFullYear(), today.getMonth() + monthOffset, 1), [today, monthOffset]);
  const year = base.getFullYear();
  const month = base.getMonth();
  const cells = useMemoM(() => window.cycleHelpers.monthMatrix(year, month), [year, month]);
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="m-cal">
      <div className="m-cal__nav">
        <button className="m-cal__navbtn" onClick={() => setMonthOffset(monthOffset - 1)} aria-label="上個月">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="m-cal__monthlabel">{year} 年 {month + 1} 月</div>
        <button className="m-cal__navbtn" onClick={() => setMonthOffset(monthOffset + 1)} aria-label="下個月">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="m-cal__legend">
        {window.PHASE_ORDER.map((k) => {
          const p = window.PHASES[k];
          return (
            <div key={k} className="m-cal__legend-item">
              <span className="m-cal__legend-swatch" style={{ background: p.color, borderColor: p.edge }} />
              {p.name}
            </div>);

        })}
      </div>

      <div className="m-cal__weekrow">
        {weekdays.map((w) => <div key={w} className="m-cal__weekday">{w}</div>)}
      </div>
      <div className="m-cal__grid">
        {cells.map((d, i) => {
          if (!d) return <div key={'e' + i} className="m-cal__cell m-cal__cell--empty" />;
          const phase = window.cycleHelpers.getPhase(d, anchor, phaseDays);
          const cycleDay = window.cycleHelpers.getCycleDay(d, anchor, phaseDays);
          const isToday = window.cycleHelpers.sameDay(d, today);
          const isSelected = window.cycleHelpers.sameDay(d, selected);
          const isPeriodStart = cycleDay === 1;
          return (
            <button
              key={'c' + i}
              className={
              'm-cal__cell' + (
              isToday ? ' is-today' : '') + (
              isSelected ? ' is-selected' : '')
              }
              style={{ background: phase.color, color: phase.textOn }}
              onClick={() => setSelected(d)}>
              <span className="m-cal__num">{d.getDate()}</span>
              {isPeriodStart && <span className="m-cal__dot" aria-hidden="true">●</span>}
            </button>);

        })}
      </div>

      <p className="m-cal__hint">點選任一天 → 回到「今日」檢視 ｜ ● 表示生理期起始</p>
    </div>);

}

// ─── Reference screen ────────────────────────────────────────────────────
function ReferenceScreen({ currentKey }) {
  // Rotate the cycle so the current phase is first, then the rest follow in
  // the order they will actually occur (wrapping around — this app is a loop).
  const order = window.PHASE_ORDER;
  const startIdx = Math.max(0, order.indexOf(currentKey));
  const orderedKeys = order.map((_, i) => order[(startIdx + i) % order.length]);
  return (
    <div className="m-ref">
      <div className="m-ref__head">
        <h1 className="m-ref__title">週期策略</h1>
        <p className="m-ref__sub">四個階段的特性與建議</p>
      </div>
      {orderedKeys.map((k) => {
        const p = window.PHASES[k];
        const isCur = k === currentKey;
        const dark = p.textOn === '#FFFFFF' ? p.edge : p.textOn;
        return (
          <div
            key={k}
            className={'m-ref__card' + (isCur ? ' is-current' : '')}
            style={{ borderColor: p.edge }}>
            <div className="m-ref__cardhead" style={{ background: p.color, color: p.textOn }}>
              <div className="m-ref__cardtitle">
                <span className="m-ref__dot" style={{ background: 'currentColor' }} />
                {p.name}
              </div>
              {isCur && <span className="m-ref__nowtag">當前</span>}
            </div>
            <div className="m-ref__cardbody">
              <div className="m-ref__quote" style={{ color: dark }}>
                「{p.quote}」
              </div>
              <p className="m-ref__explain">{p.explanation}</p>
              <div className="m-ref__lists">
                <div className="m-ref__list">
                  <div className="m-ref__listlabel">飲食策略</div>
                  <ol>{p.diet.map((d, i) => <li key={i}>{d}</li>)}</ol>
                </div>
                <div className="m-ref__list">
                  <div className="m-ref__listlabel">運動策略</div>
                  <p className="m-ref__exercise">{p.exercise}</p>
                </div>
                <div className="m-ref__list">
                  <div className="m-ref__listlabel">身體狀況</div>
                  <ol>{p.body.map((b, i) => <li key={i}>{b}</li>)}</ol>
                </div>
              </div>
            </div>
          </div>);

      })}
    </div>);

}

// ─── Bottom tab bar ──────────────────────────────────────────────────────
function TabBar({ tab, setTab, standalone }) {
  const items = [
  { id: 'today', label: '今日', icon:
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  },
  { id: 'calendar', label: '月曆', icon:
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>
  },
  { id: 'reference', label: '策略', icon:
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M9 4v16" /></svg>
  }];

  return (
    <div className={'m-tabbar' + (standalone ? ' m-tabbar--standalone' : '')}>
      {items.map((it) =>
      <button
        key={it.id}
        className={'m-tab' + (tab === it.id ? ' is-on' : '')}
        onClick={() => setTab(it.id)}>
          <span className="m-tab__icon">{it.icon}</span>
          <span className="m-tab__label">{it.label}</span>
        </button>
      )}
    </div>);

}

// ─── Helper: open tweaks ─────────────────────────────────────────────────
function openTweaks() {
  window.postMessage({ type: '__activate_edit_mode' }, '*');
}

window.MobileApp = MobileApp;