// MiniCalendar component — renders one month card matching the source style.
const { useMemo: useMemoCal } = React;

function MiniCalendar({ year, month, anchor, phaseDays, today, selected, onSelectDay }) {
  const cells = useMemoCal(
    () => window.cycleHelpers.monthMatrix(year, month),
    [year, month]
  );

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="mini-cal">
      <div className="mini-cal__title">
        <span>{year} 年 {month + 1} 月</span>
      </div>
      <div className="mini-cal__grid">
        {weekdays.map((w, i) => (
          <div key={'w' + i} className="mini-cal__weekday">{w}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={'e' + i} className="mini-cal__cell mini-cal__cell--empty" />;
          const phase = window.cycleHelpers.getPhase(d, anchor, phaseDays);
          const cycleDay = window.cycleHelpers.getCycleDay(d, anchor, phaseDays);
          const isToday = window.cycleHelpers.sameDay(d, today);
          const isSelected = window.cycleHelpers.sameDay(d, selected);
          const isPeriodStart = cycleDay === 1;
          return (
            <button
              key={'c' + i}
              className={
                'mini-cal__cell' +
                (isToday ? ' is-today' : '') +
                (isSelected ? ' is-selected' : '')
              }
              style={{
                background: phase.color,
                color: phase.textOn,
              }}
              onClick={() => onSelectDay(d)}
              title={`${d.getMonth() + 1}/${d.getDate()} · ${phase.name} · 週期 D${cycleDay}`}
            >
              <span className="mini-cal__num">{d.getDate()}</span>
              {isPeriodStart && <span className="mini-cal__dot" aria-hidden="true">●</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

window.MiniCalendar = MiniCalendar;
