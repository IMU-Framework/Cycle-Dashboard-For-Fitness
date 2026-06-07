// Main App — Cycle Dashboard
const { useState, useEffect, useMemo } = React;

const APP_DEFAULTS = /*EDITMODE-BEGIN*/{
  "anchorIso": "2026-05-22",
  "periodDays": 5,
  "goldenDays": 8,
  "steadyDays": 8,
  "restDays": 7,
  "showTodayBanner": true,
  "useRealToday": true,
  "simulatedTodayIso": "2026-05-21"
} /*EDITMODE-END*/;

function App() {
  const [tw, setTweak] = window.useTweaks(APP_DEFAULTS);

  const anchor = useMemo(
    () => window.cycleHelpers.isoToDate(tw.anchorIso || '2026-05-22'),
    [tw.anchorIso]
  );
  const phaseDays = useMemo(() => ({
    period: tw.periodDays,
    golden: tw.goldenDays,
    steady: tw.steadyDays,
    rest: tw.restDays
  }), [tw.periodDays, tw.goldenDays, tw.steadyDays, tw.restDays]);

  const today = useMemo(() => {
    if (tw.useRealToday) return window.cycleHelpers.startOfDay(new Date());
    return window.cycleHelpers.isoToDate(tw.simulatedTodayIso || '2026-05-20');
  }, [tw.useRealToday, tw.simulatedTodayIso]);

  const [selected, setSelected] = useState(today);
  useEffect(() => {setSelected(today);}, [today]);

  const selectedPhase = window.cycleHelpers.getPhase(selected, anchor, phaseDays);
  const selectedCycleDay = window.cycleHelpers.getCycleDay(selected, anchor, phaseDays);
  const cycleLen = window.cycleHelpers.cycleLength(phaseDays);
  const cycleStart = window.cycleHelpers.cycleStart(selected, anchor, phaseDays);
  const nextPhase = window.cycleHelpers.nextPhaseStart(selected, anchor, phaseDays);

  const isToday = window.cycleHelpers.sameDay(selected, today);

  // 8 months: May 2026 → Dec 2026
  const months = [
  [2026, 4], [2026, 5], [2026, 6], [2026, 7],
  [2026, 8], [2026, 9], [2026, 10], [2026, 11]];


  return (
    <div className="app" data-screen-label="01 Cycle Dashboard">
      <Header today={today} todayPhase={window.cycleHelpers.getPhase(today, anchor, phaseDays)} />

      <TodayHero
        today={today}
        anchor={anchor}
        phaseDays={phaseDays}
        onJumpToday={() => setSelected(today)}
        onPrevDay={() => {
          const d = new Date(selected);
          d.setDate(d.getDate() - 1);
          setSelected(d);
        }}
        onNextDay={() => {
          const d = new Date(selected);
          d.setDate(d.getDate() + 1);
          setSelected(d);
        }}
        isViewingToday={isToday}
        selected={selected}
        selectedPhase={selectedPhase}
        selectedCycleDay={selectedCycleDay}
        cycleLen={cycleLen}
        cycleStart={cycleStart}
        nextPhase={nextPhase} />
      

      <Tabs
        items={[
        {
          id: 'calendar',
          label: '週期月曆',
          render: () =>
          <section className="section section--in-tab">
                <Legend hint="2026 年 5 月 – 12 月 · 點任一天可查看當天策略 · ● 表示生理期起始日" />
                <div className="cal-grid">
                  {months.map(([y, m]) =>
              <window.MiniCalendar
                key={`${y}-${m}`}
                year={y}
                month={m}
                anchor={anchor}
                phaseDays={phaseDays}
                today={today}
                selected={selected}
                onSelectDay={setSelected} />

              )}
                </div>
              </section>

        },
        {
          id: 'reference',
          label: '週期策略對照表',
          render: () =>
          <section className="section section--in-tab">
                <ReferenceTable highlightKey={selectedPhase.key} onPickPhase={(k) => {
              // Jump selected to next occurrence of that phase from today
              const segs = window.cycleHelpers.phaseSegments(phaseDays);
              let acc = 0;
              let startDay = 1;
              for (const seg of segs) {
                if (seg.key === k) {startDay = acc + 1;break;}
                acc += seg.days;
              }
              const todayCycleDay = window.cycleHelpers.getCycleDay(today, anchor, phaseDays);
              let delta = startDay - todayCycleDay;
              if (delta < 0) delta += cycleLen;
              const d = new Date(today);
              d.setDate(d.getDate() + delta);
              setSelected(d);
            }} />
              </section>

        }]
        } />
      

      <Footer />

      <TweaksPanelContainer tw={tw} setTweak={setTweak} />
    </div>);

}

// ────────────────────────────────────────────────────────────────────────────
function Header({ today, todayPhase }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <div className="topbar__logo" aria-hidden="true">
          <span style={{ background: window.PHASES.period.color }} />
          <span style={{ background: window.PHASES.golden.color }} />
          <span style={{ background: window.PHASES.steady.color }} />
          <span style={{ background: window.PHASES.rest.color }} />
        </div>
        <div>
          <div className="topbar__title">週期瘦身儀表板</div>
          <div className="topbar__sub">依生理週期推薦的減脂策略</div>
        </div>
      </div>
      <button
        id="tweaks-trigger"
        className="topbar__tweaks"
        type="button"
        aria-label="開啟設定">
        <span className="topbar__tweaks-icon" aria-hidden="true">⚙</span>
        <span className="topbar__tweaks-label">設定</span>
      </button>
    </header>);

}

// ────────────────────────────────────────────────────────────────────────────
function TodayHero({
  today, anchor, phaseDays, isViewingToday, onJumpToday, onPrevDay, onNextDay,
  selected, selectedPhase, selectedCycleDay, cycleLen, cycleStart, nextPhase
}) {
  const segs = window.cycleHelpers.phaseSegments(phaseDays);
  const segTotal = cycleLen;

  const [collapsed, setCollapsed] = React.useState(
    () => localStorage.getItem('heroCollapsed') === '1'
  );
  const toggleCollapsed = () => setCollapsed((c) => {
    const next = !c;
    localStorage.setItem('heroCollapsed', next ? '1' : '0');
    return next;
  });

  // Calculate where the selected day sits on the cycle bar (0..1),
  // clamped slightly inside the edges so the pin/label don't get clipped.
  const rawPct = cycleLen > 1 ? (selectedCycleDay - 1) / (cycleLen - 1) * 100 : 0;
  const positionPct = Math.max(1, Math.min(99, rawPct));

  const cycleEnd = new Date(cycleStart);
  cycleEnd.setDate(cycleEnd.getDate() + cycleLen - 1);

  // Keyboard arrows on the hero card
  React.useEffect(() => {
    const onKey = (e) => {
      // Ignore when user is typing in an input/textarea
      const tag = document.activeElement && document.activeElement.tagName || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {e.preventDefault();onPrevDay();} else
      if (e.key === 'ArrowRight') {e.preventDefault();onNextDay();}
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPrevDay, onNextDay]);

  return (
    <section className={"hero" + (collapsed ? " hero--collapsed" : "")}>
      <div className="hero__top">
        <div className="hero__top-main">
          <div className="hero__date-row">
            <button className="hero__nav" onClick={onPrevDay} aria-label="前一天" title="前一天 (←)">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <div className="hero__date">
              {window.cycleHelpers.formatDate(selected, { long: true })}
              {!isViewingToday && <span className="hero__date-flag">檢視中</span>}
            </div>
            <button className="hero__nav" onClick={onNextDay} aria-label="後一天" title="後一天 (→)">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            {!isViewingToday &&
            <button className="hero__today-btn" onClick={onJumpToday}>回到今天</button>
            }
          </div>
          <h1 className="hero__phase" style={{ color: selectedPhase.edge }}>
            <span
              className="hero__phase-chip"
              style={{ background: selectedPhase.color, color: selectedPhase.textOn, borderColor: selectedPhase.edge }}>
              
              {selectedPhase.name}
            </span>
            <span className="hero__phase-day">D{selectedCycleDay} / {cycleLen}</span>
          </h1>
          <p className="hero__advice" data-comment-anchor="75ec47a4b1-p-185-11">{selectedPhase.advice}</p>
        </div>
        <button
          className="hero__collapse"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          title={collapsed ? "展開今日儀表板" : "收合今日儀表板"}>
          <span className="hero__collapse-text">{collapsed ? "展開" : "收合"}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div className="cycle-bar" style={{ padding: "0px 0px 26px" }}>
        <div className="cycle-bar__track">
          {segs.map((seg) =>
          <div
            key={seg.key}
            className="cycle-bar__seg"
            style={{
              flex: seg.days,
              background: window.PHASES[seg.key].color
            }}>
            
              <span className="cycle-bar__seg-label" style={{ color: window.PHASES[seg.key].textOn }}>
                {window.PHASES[seg.key].short || window.PHASES[seg.key].name}
              </span>
              <span className="cycle-bar__seg-days" style={{ color: window.PHASES[seg.key].textOn }}>
                {seg.days} 天
              </span>
            </div>
          )}
        </div>
        <div className="cycle-bar__marker" style={{ left: `calc(${positionPct}% - 1px)` }}>
          <div className="cycle-bar__marker-pin" />
          <div className="cycle-bar__marker-label">D{selectedCycleDay}</div>
        </div>
      </div>

      {!collapsed && <React.Fragment>
      <div className="hero__meta">
        <Stat label="本週期開始" value={window.cycleHelpers.formatDate(cycleStart)} />
        <Stat label="本週期結束" value={window.cycleHelpers.formatDate(cycleEnd)} />
        {nextPhase &&
        <Stat
          label="下一階段"
          value={`${nextPhase.daysUntil} 天後`}
          sub={window.cycleHelpers.formatDate(nextPhase.date)} />

        }
        <Stat label="週期長度" value={`${cycleLen} 天`} />
      </div>

      <div className="hero__strategy" style={{ borderColor: selectedPhase.edge }}>
        <div className="hero__strategy-body">
          <div
            className="hero__strategy-quote"
            style={{
              borderColor: selectedPhase.edge,
              color: selectedPhase.textOn === '#FFFFFF' ? selectedPhase.edge : selectedPhase.textOn,
              opacity: "1", width: "360px"
            }}>
            
            <span className="hero__strategy-quote-text">{selectedPhase.quote}</span>
          </div>
          <div className="hero__strategy-explain">
            <p className="hero__strategy-explain-text">{selectedPhase.explanation}</p>
            {selectedPhase.exercise &&
            <div className="hero__strategy-exercise" style={{ borderColor: selectedPhase.edge }}>
              <div className="hero__strategy-exercise-label">運動策略</div>
              <p className="hero__strategy-exercise-text">{selectedPhase.exercise}</p>
            </div>}
          </div>
        </div>
      </div>

      <AskAi phase={selectedPhase} cycleDay={selectedCycleDay} cycleLen={cycleLen} selected={selected} />
      </React.Fragment>}
    </section>);

}

function Stat({ label, value, sub }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
      {sub && <div className="stat__sub">{sub}</div>}
    </div>);

}

// ────────────────────────────────────────────────────────────────────────────
// AskAi — small chat box that takes the current phase context and asks Claude
function AskAi({ phase, cycleDay, cycleLen, selected }) {
  const [q, setQ] = useState('');
  const [a, setA] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasKey, setHasKey] = useState(
    () => !!(localStorage.getItem('claude-api-key') || '').trim()
  );

  useEffect(() => {
    const handler = () => setHasKey(!!(localStorage.getItem('claude-api-key') || '').trim());
    window.addEventListener('claude-api-key-changed', handler);
    return () => window.removeEventListener('claude-api-key-changed', handler);
  }, []);

  const suggestions = [
    '今天適合吃什麼當早餐？',
    '可以做什麼運動，30 分鐘內？',
    '心情低落怎麼辦？',
    '為什麼今天會比較容易餓？',
  ];

  const ask = async (text) => {
    const query = (text != null ? text : q).trim();
    if (!query || loading) return;
    setLoading(true);
    setError('');
    setA('');
    const dateStr = window.cycleHelpers.formatDate(selected, { long: true });
    const prompt = `你是一位專業的女性週期減脂顧問。
使用者目前狀態：
- 日期：${dateStr}
- 週期階段：${phase.name}（第 ${cycleDay} 天 / 共 ${cycleLen} 天）
- 當期策略口號：「${phase.quote}」
- 階段說明：${phase.explanation}
- 運動策略：${phase.exercise}

請根據上述狀態，用繁體中文、口語、簡短（最多 4-6 句、80-150 字）回答使用者的問題。直接給可行建議，不要重複前述狀態。若問題與週期/減脂/運動/飲食/情緒無關，禮貌引導回主題。

使用者問題：${query}`;
    try {
      const res = await window.claude.complete(prompt);
      setA(res || '');
    } catch (e) {
      setError(e.message || '無法連線，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  if (!hasKey) return null;

  return (
    <div className="askai">
      <div className="askai__head">
        <div className="askai__title">
          <span className="askai__sparkle" aria-hidden="true">✦</span>
          問問你的週期顧問
        </div>
        <div className="askai__hint">針對「{phase.name}」量身回答</div>
      </div>

      <form
        className="askai__form"
        onSubmit={(e) => { e.preventDefault(); ask(); }}>
        <input
          className="askai__input"
          type="text"
          placeholder="例：今天可以吃甜點嗎？"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={loading} />
        <button
          className="askai__submit"
          type="submit"
          disabled={loading || !q.trim()}
          style={{ background: phase.edge, color: '#fff', borderColor: phase.edge }}>
          {loading ? '思考中…' : '送出'}
        </button>
      </form>

      {!a && !loading && !error && (
        <div className="askai__suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="askai__chip"
              onClick={() => { setQ(s); ask(s); }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="askai__loading">
          <span className="askai__dot" />
          <span className="askai__dot" />
          <span className="askai__dot" />
        </div>
      )}

      {error && <div className="askai__error">{error}</div>}

      {a && !loading && (
        <div className="askai__answer">
          <div className="askai__answer-label">建議</div>
          <p className="askai__answer-text">{a}</p>
          <div className="askai__answer-actions">
            <button
              type="button"
              className="askai__ghost"
              onClick={() => { setA(''); setQ(''); }}>
              再問一題
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ApiKeyInput — stores Claude API key in localStorage for the AI advisor
function ApiKeyInput() {
  const [key, setKey] = React.useState(
    () => localStorage.getItem('claude-api-key') || ''
  );
  const [show, setShow] = React.useState(false);
  const save = (v) => {
    setKey(v);
    localStorage.setItem('claude-api-key', v.trim());
    window.dispatchEvent(new Event('claude-api-key-changed'));
  };
  return (
    <div className="twk-row">
      <div className="twk-lbl"><span>Claude API Key</span></div>
      <div style={{ display: 'flex', gap: 4 }}>
        <input
          className="twk-field"
          type={show ? 'text' : 'password'}
          placeholder="sk-ant-api03-..."
          value={key}
          onChange={(e) => save(e.target.value)}
          style={{ flex: 1, minWidth: 0 }}
        />
        <button
          type="button"
          className="twk-btn secondary"
          style={{ padding: '0 8px', flexShrink: 0, fontSize: '11px' }}
          onClick={() => setShow(s => !s)}
        >{show ? '隱藏' : '顯示'}</button>
      </div>
      {key.trim()
        ? <div style={{ fontSize: '10.5px', color: 'rgba(41,38,27,.45)', marginTop: 3 }}>已設定 — AI 顧問已啟用</div>
        : <div style={{ fontSize: '10.5px', color: 'rgba(41,38,27,.45)', marginTop: 3 }}>未設定 — AI 顧問功能已隱藏</div>
      }
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
function Legend({ hint }) {
  return (
    <div className="legend">
      <div className="legend__items">
        {window.PHASE_ORDER.map((k) => {
          const p = window.PHASES[k];
          return (
            <div key={k} className="legend__item">
              <span className="legend__swatch" style={{ background: p.color, borderColor: p.edge }} />
              <span className="legend__name">{p.name}</span>
            </div>);

        })}
      </div>
      {hint && <p className="legend__hint">{hint}</p>}
    </div>);

}

// ────────────────────────────────────────────────────────────────────────────
function ReferenceTable({ highlightKey, onPickPhase }) {
  const rows = [
  {
    label: '瘦身時機',
    get: (p) => p.timing
  },
  {
    label: '飲食策略',
    get: (p) => p.diet
  },
  {
    label: '運動策略',
    get: (p) => p.exercise
  },
  {
    label: '身體狀況',
    get: (p) => p.body
  }];


  return (
    <div className="table-wrap">
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            {window.PHASE_ORDER.map((k) => {
              const p = window.PHASES[k];
              const isHi = k === highlightKey;
              return (
                <th
                  key={k}
                  className={isHi ? 'is-hi' : ''}
                  style={{ '--phase-color': p.color, '--phase-edge': p.edge }}>
                  
                  <button className="ref-table__header-btn" onClick={() => onPickPhase(k)}>
                    <span className="ref-table__swatch" style={{ background: p.color, borderColor: p.edge }} />
                    {p.name}
                  </button>
                </th>);

            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) =>
          <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {window.PHASE_ORDER.map((k) => {
              const p = window.PHASES[k];
              const v = r.get(p);
              const isHi = k === highlightKey;
              return (
                <td key={k} className={isHi ? 'is-hi' : ''}>
                    {Array.isArray(v) ?
                  <ol className="ref-table__list">
                        {v.map((item, i) => <li key={i}>{item}</li>)}
                      </ol> :
                  v}
                  </td>);

            })}
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}

// ────────────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <p>
        週期長度、階段天數與錨點日期可在右上方「⚙ 設定」中調整。
        本工具僅為一般保健建議與行為提醒，不取代專業醫療意見。
      </p>
    </footer>);

}

// ────────────────────────────────────────────────────────────────────────────
function TweaksPanelContainer({ tw, setTweak }) {
  const TP = window.TweaksPanel;
  const Section = window.TweakSection;
  const Slider = window.TweakSlider;
  const Toggle = window.TweakToggle;
  const Text = window.TweakText;
  const Button = window.TweakButton;
  if (!TP) return null;

  const cycleLen = (tw.periodDays || 0) + (tw.goldenDays || 0) + (tw.steadyDays || 0) + (tw.restDays || 0);

  return (
    <TP title="Tweaks">
      <Section label="模擬日期">
        <Toggle
          label="使用真實今天"
          value={tw.useRealToday}
          onChange={(v) => setTweak('useRealToday', v)} />
        
        {!tw.useRealToday &&
        <Text
          label="模擬今天 (YYYY-MM-DD)"
          value={tw.simulatedTodayIso}
          onChange={(v) => setTweak('simulatedTodayIso', v)} />

        }
      </Section>
      <Section label="週期錨點">
        <Text
          label="最近一次生理期開始日 (YYYY-MM-DD)"
          value={tw.anchorIso}
          onChange={(v) => setTweak('anchorIso', v)} />
        
      </Section>
      <Section label={`各階段天數（合計 ${cycleLen} 天）`}>
        <Slider label="生理期" value={tw.periodDays} min={2} max={10} step={1} unit=" 天"
        onChange={(v) => setTweak('periodDays', v)} />
        <Slider label="超速期" value={tw.goldenDays} min={3} max={14} step={1} unit=" 天"
        onChange={(v) => setTweak('goldenDays', v)} />
        <Slider label="平快期" value={tw.steadyDays} min={3} max={12} step={1} unit=" 天"
        onChange={(v) => setTweak('steadyDays', v)} />
        <Slider label="經前休息期" value={tw.restDays} min={2} max={10} step={1} unit=" 天"
        onChange={(v) => setTweak('restDays', v)} />
        <Button label="還原預設 5 / 8 / 8 / 7" onClick={() => {
          setTweak({ periodDays: 5, goldenDays: 8, steadyDays: 8, restDays: 7 });
        }} />
      </Section>
      <Section label="AI 顧問">
        <ApiKeyInput />
      </Section>
    </TP>);

}

window.App = App;

// ────────────────────────────────────────────────────────────────────────────
// Tabs — segmented control + body
function Tabs({ items, initialId }) {
  const [active, setActive] = useState(initialId || items[0]?.id);
  const current = items.find((t) => t.id === active) || items[0];
  return (
    <div className="tabs">
      <div className="tabs__bar" role="tablist">
        {items.map((it) => {
          const isOn = it.id === active;
          return (
            <button
              key={it.id}
              role="tab"
              aria-selected={isOn}
              className={'tabs__btn' + (isOn ? ' is-on' : '')}
              onClick={() => setActive(it.id)}
              type="button">
              
              {it.label}
            </button>);

        })}
      </div>
      <div className="tabs__body" role="tabpanel">
        {current && current.render()}
      </div>
    </div>);

}