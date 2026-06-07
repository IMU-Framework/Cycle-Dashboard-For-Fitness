// Phase data and helpers for the cycle dashboard
window.PHASES = {
  period: {
    key: 'period',
    name: '生理期',
    short: '生理',
    color: '#FFEB6B',
    softColor: '#FFF6B8',
    edge: '#E8D43A',
    textOn: '#5C4A00',
    quote: '補血修復，溫和舒緩',
    explanation: '身體處於代謝低谷、容易疲倦，黃體素與雌激素分泌下降，常伴隨水腫。此階段以休養為主，飲食重在補血修復，運動只做溫和舒緩。',
    timing: '在生理期間對正在進行的節食計畫可緩和些',
    diet: [
      '補鐵與補血：多攝取紅肉（牛肉、豬肝）、深綠色蔬菜（菠菜）以補充流失的鐵質',
      '溫暖子宮：避免生冷食物、冰品及過多甜食，以防加重經痛',
      '消水腫：可補充富含鉀離子的食物（如香蕉、黑豆水）',
    ],
    exercise: '以休息為主，停止高強度訓練。建議進行 15–20 分鐘的溫和伸展、瑜珈或散步，幫助骨盆腔血液循環、舒緩經期不適。',
    body: [
      '腹悶脹痛',
      '體溫較低，手腳容易冰冷',
      '心情抑鬱',
      '膚質敏感或長痘子',
      '體重升容易腹瀉或便秘',
    ],
    advice: '補血修復、避冰冷、消水腫，運動以溫和伸展為主',
    mood: '休養為主，溫和地照顧身體',
  },
  golden: {
    key: 'golden',
    name: '超速期',
    short: '超速',
    color: '#E04A78',
    softColor: '#F8C8D6',
    edge: '#B83056',
    textOn: '#FFFFFF',
    quote: '黃金減脂，高強度燃燒',
    explanation: '雌激素分泌旺盛，新陳代謝與消化功能達到巔峰，精神愉快、食慾好控制，是減重的黃金期。火力全開，搭配高強度運動效果最佳。',
    timing: '此時是最恰當的減肥時機',
    diet: [
      '控制總熱量：執行較嚴格的低 GI（升糖指數）飲食，嚴格避開精緻糖與零食',
      '補充雌激素：可適量攝取山藥、黃豆製品（如豆漿、豆腐）幫助代謝',
      '優質蛋白：確保攝取足夠的瘦肉、魚類與蛋類，維持肌肉量',
    ],
    exercise: '火力全開——這是燃脂的最佳時機！安排一週 3–4 次的有氧運動（如跑步、飛輪、游泳）。搭配重量訓練效果更佳，能加速全身代謝。',
    body: [
      '精神安定心情愉快',
      '膚質細嫩光滑',
      '新陳代謝快',
      '消化功能佳',
    ],
    advice: '黃金減脂期，嚴格低 GI、有氧加重訓 3–4 次／週',
    mood: '能量滿載，最有意志力的時期',
  },
  steady: {
    key: 'steady',
    name: '平快期',
    short: '平快',
    color: '#F5A8B7',
    softColor: '#FBDDE3',
    edge: '#D87A8E',
    textOn: '#6B1F33',
    quote: '維持代謝，燃脂高原期',
    explanation: '濾泡期結束，雌激素下降、黃體素開始上升。代謝速度從極速降為平穩，體重下降幅度會變小，但仍可持續減脂，重點在維持節奏、突破停滯。',
    timing: '此時是最恰當的減肥時機',
    diet: [
      '穩定血糖：多攝取高纖維蔬果及全穀雜糧（如燕麥、地瓜）增加飽足感，避免暴飲暴食',
      '熱量控制：維持清淡飲食，三餐定時定量',
    ],
    exercise: '有氧與重訓交替：維持規律運動習慣，可採取間歇性訓練（HIIT），幫助突破減肥停滯期。',
    body: [
      '體溫逐漸上升，新陳代謝稍緩',
      '食慾漸增，營養吸收好',
      '乳房微微發脹刺痛',
    ],
    advice: '維持代謝、穩定血糖、有氧與重訓交替突破高原',
    mood: '穩定推進，保持節奏感',
  },
  rest: {
    key: 'rest',
    name: '經前休息期',
    short: '休息',
    color: '#DCDCD6',
    softColor: '#ECECE7',
    edge: '#B5B5AE',
    textOn: '#3F3F3A',
    quote: '控制食慾，消解水腫',
    explanation: '黃體素分泌達顛峰，開始出現經前症候群（PMS）：情緒易波動、腸胃蠕動變慢、容易水腫與嘴饞。重點在控制食慾、消解水腫，溫柔對待自己。',
    timing: '此期間調降運動強度，為下一個生理期的減肥計畫作準備',
    diet: [
      '抗水腫與控口慾：飲食要「低油、低鹽、低糖」，以防水分滯留；多吃高鉀食物（如芹菜、冬瓜）',
      '對抗甜食渴望：想吃甜食時，改以低糖水果（如芭樂、蘋果）、原味堅果代替',
    ],
    exercise: '緩和伸展：隨著身體逐漸疲憊，運動強度應逐漸調降。建議多做皮拉提斯、瑜珈或核心訓練，以放鬆緊繃肌肉、穩定情緒為主。',
    body: [
      '情緒不定，暴躁易怒',
      '身體浮腫，體重稍微上升',
      '可能有便秘的情況',
      '皮脂腺分泌旺盛，容易長痘痘',
    ],
    advice: '低油低鹽低糖控水腫、用低糖點心解饞，運動緩和收斂',
    mood: '情緒起伏，溫柔對待自己',
  },
};

window.PHASE_ORDER = ['period', 'golden', 'steady', 'rest'];

// Default phase lengths (days). Sum = cycle length.
window.DEFAULT_PHASE_DAYS = { period: 5, golden: 8, steady: 8, rest: 7 };

// Default anchor: a known Day-1 of a 生理期. May 22 2026 matches the source calendars.
window.DEFAULT_ANCHOR_ISO = '2026-05-22';

window.cycleHelpers = (function () {
  const MS = 1000 * 60 * 60 * 24;

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function isoToDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function dateToIso(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function daysBetween(a, b) {
    return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / MS);
  }

  function cycleLength(phaseDays) {
    return phaseDays.period + phaseDays.golden + phaseDays.steady + phaseDays.rest;
  }

  function getCycleDay(date, anchor, phaseDays) {
    const total = cycleLength(phaseDays);
    const diff = daysBetween(date, anchor);
    return ((diff % total) + total) % total + 1; // 1..total
  }

  function getPhaseForCycleDay(cycleDay, phaseDays) {
    if (cycleDay <= phaseDays.period) return window.PHASES.period;
    if (cycleDay <= phaseDays.period + phaseDays.golden) return window.PHASES.golden;
    if (cycleDay <= phaseDays.period + phaseDays.golden + phaseDays.steady) return window.PHASES.steady;
    return window.PHASES.rest;
  }

  function getPhase(date, anchor, phaseDays) {
    return getPhaseForCycleDay(getCycleDay(date, anchor, phaseDays), phaseDays);
  }

  // Returns the array of phase day-counts in cycle order starting at day 1.
  function phaseSegments(phaseDays) {
    return [
      { key: 'period', name: window.PHASES.period.name, days: phaseDays.period },
      { key: 'golden', name: window.PHASES.golden.name, days: phaseDays.golden },
      { key: 'steady', name: window.PHASES.steady.name, days: phaseDays.steady },
      { key: 'rest',   name: window.PHASES.rest.name,   days: phaseDays.rest },
    ];
  }

  // Find the start date of the cycle (Day 1, period start) containing `date`.
  function cycleStart(date, anchor, phaseDays) {
    const cycleDay = getCycleDay(date, anchor, phaseDays);
    const start = startOfDay(date);
    start.setDate(start.getDate() - (cycleDay - 1));
    return start;
  }

  function nextPhaseStart(date, anchor, phaseDays) {
    const cycleDay = getCycleDay(date, anchor, phaseDays);
    const segs = phaseSegments(phaseDays);
    let acc = 0;
    for (const seg of segs) {
      acc += seg.days;
      if (cycleDay <= acc) {
        const daysUntil = acc - cycleDay + 1;
        const next = startOfDay(date);
        next.setDate(next.getDate() + daysUntil);
        return { date: next, daysUntil };
      }
    }
    return null;
  }

  function monthMatrix(year, month /* 0-indexed */) {
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  function sameDay(a, b) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  function formatDate(d, opts = {}) {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const w = weekdays[d.getDay()];
    if (opts.long) return `${y} 年 ${m} 月 ${day} 日 · ${w}`;
    return `${m}/${day} ${w}`;
  }

  return {
    startOfDay, isoToDate, dateToIso, daysBetween,
    cycleLength, getCycleDay, getPhase, getPhaseForCycleDay,
    phaseSegments, cycleStart, nextPhaseStart,
    monthMatrix, sameDay, formatDate,
  };
})();
