/* ===========================
   CALCULATOR — script.js
=========================== */

const display     = document.getElementById('display');
const expression  = document.getElementById('expression');

// ── State ──────────────────────────────────────────────
const state = {
  current:     '0',
  previous:    null,
  operator:    null,
  justEvaled:  false,
  expression:  '',
};

// ── Helpers ────────────────────────────────────────────
function formatNumber(raw) {
  const str = String(raw);
  if (str === 'Infinity' || str === '-Infinity') return 'Erro';
  if (isNaN(raw)) return 'Erro';

  const [int, dec] = str.split('.');
  const formatted = Number(int).toLocaleString('pt-BR');
  return dec !== undefined ? `${formatted},${dec}` : formatted;
}

function clampDisplay(value) {
  // Limit digits shown to avoid overflow
  if (String(value).replace(/[^0-9]/g, '').length > 12) {
    return parseFloat(value).toExponential(5);
  }
  return value;
}

function setDisplay(value, isError = false) {
  const el = display;
  el.classList.toggle('error', isError);

  if (isError) {
    el.textContent = value;
    return;
  }

  const clamped = clampDisplay(value);
  el.textContent = formatNumber(clamped);

  // pop animation
  el.classList.remove('pop');
  void el.offsetWidth; // reflow
  el.classList.add('pop');
}

function setExpression(text) {
  expression.textContent = text || '\u00A0';
}

function resetActiveOp() {
  document.querySelectorAll('.btn-op.active').forEach(b => b.classList.remove('active'));
}

function setActiveOp(btn) {
  resetActiveOp();
  if (btn) btn.classList.add('active');
}

// ── Core logic ─────────────────────────────────────────
function calculate(a, b, op) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷': return b === 0 ? 'Erro' : a / b;
    default:  return b;
  }
}

const opSymbols = {
  add:      '+',
  subtract: '−',
  multiply: '×',
  divide:   '÷',
};

// ── Actions ────────────────────────────────────────────
function inputDigit(digit) {
  resetActiveOp();

  if (state.justEvaled) {
    state.current    = digit;
    state.justEvaled = false;
    setExpression('');
  } else if (state.current === '0' && digit !== '.') {
    state.current = digit;
  } else if (state.current.length >= 14) {
    return; // max digits
  } else {
    state.current += digit;
  }

  setDisplay(state.current);
}

function inputDecimal() {
  resetActiveOp();

  if (state.justEvaled) {
    state.current    = '0.';
    state.justEvaled = false;
    setExpression('');
  } else if (!state.current.includes('.')) {
    state.current += '.';
  }

  setDisplay(state.current);
}

function inputOperator(action, btn) {
  const symbol = opSymbols[action];

  if (state.operator && !state.justEvaled) {
    // Chain: compute immediately
    const result = calculate(state.previous, state.current, state.operator);
    if (result === 'Erro') { inputClear(); setDisplay('Erro', true); return; }
    state.previous = String(result);
    state.current  = String(result);
  } else {
    state.previous = state.current;
  }

  state.operator   = symbol;
  state.justEvaled = false;

  setExpression(`${formatNumber(clampDisplay(state.previous))} ${symbol}`);
  setActiveOp(btn);

  // Next digit will replace current
  state._pendingOp = true;
}

// Override inputDigit slightly to handle operator chain
const _origInputDigit = inputDigit;
function inputDigitWrapped(digit) {
  if (state._pendingOp) {
    state.current   = digit === '.' ? '0.' : digit;
    state._pendingOp = false;
    setDisplay(state.current);
  } else {
    _origInputDigit(digit);
  }
}

function inputEquals() {
  if (!state.operator || state.previous === null) return;
  resetActiveOp();

  const a      = state.previous;
  const b      = state._pendingOp ? state.previous : state.current;
  const result = calculate(a, b, state.operator);

  const exprText = `${formatNumber(clampDisplay(a))} ${state.operator} ${formatNumber(clampDisplay(b))} =`;
  setExpression(exprText);

  if (result === 'Erro') {
    setDisplay('Erro', true);
    state.current    = '0';
    state.previous   = null;
    state.operator   = null;
    state.justEvaled = false;
    return;
  }

  state.current    = String(result);
  state.previous   = String(result);
  state.justEvaled = true;
  state._pendingOp = false;

  setDisplay(state.current);
}

function inputClear() {
  state.current    = '0';
  state.previous   = null;
  state.operator   = null;
  state.justEvaled = false;
  state._pendingOp = false;
  resetActiveOp();
  setDisplay('0');
  setExpression('');
}

function inputSign() {
  if (state.current === '0') return;
  state.current = String(parseFloat(state.current) * -1);
  setDisplay(state.current);
}

function inputPercent() {
  const val = parseFloat(state.current) / 100;
  state.current = String(val);
  setDisplay(state.current);
}

// ── Event delegation ───────────────────────────────────
document.querySelector('.keypad').addEventListener('click', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const value  = btn.dataset.value;
  const action = btn.dataset.action;

  if (value !== undefined) {
    inputDigitWrapped(value);
    return;
  }

  switch (action) {
    case 'decimal':  inputDecimal(); break;
    case 'clear':    inputClear();   break;
    case 'sign':     inputSign();    break;
    case 'percent':  inputPercent(); break;
    case 'equals':   inputEquals();  break;
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
      inputOperator(action, btn);
      break;
  }
});

// ── Keyboard support ───────────────────────────────────
const keyMap = {
  '0':'0','1':'1','2':'2','3':'3','4':'4',
  '5':'5','6':'6','7':'7','8':'8','9':'9',
  '.': 'decimal',   ',': 'decimal',
  '+': 'add',       '-': 'subtract',
  '*': 'multiply',  '/': 'divide',
  'x': 'multiply',  'X': 'multiply',
  'Enter': 'equals','=': 'equals',
  'Backspace': 'backspace',
  'Escape': 'clear', 'Delete': 'clear',
  '%': 'percent',
};

document.addEventListener('keydown', e => {
  const mapped = keyMap[e.key];
  if (!mapped) return;
  e.preventDefault();

  if (/^\d$/.test(mapped)) { inputDigitWrapped(mapped); return; }

  switch (mapped) {
    case 'decimal':  inputDecimal(); break;
    case 'add':      inputOperator('add',      findOpBtn('add'));      break;
    case 'subtract': inputOperator('subtract', findOpBtn('subtract')); break;
    case 'multiply': inputOperator('multiply', findOpBtn('multiply')); break;
    case 'divide':   inputOperator('divide',   findOpBtn('divide'));   break;
    case 'equals':   inputEquals(); break;
    case 'clear':    inputClear();  break;
    case 'percent':  inputPercent(); break;
    case 'backspace': handleBackspace(); break;
  }
});

function findOpBtn(action) {
  return document.querySelector(`[data-action="${action}"]`);
}

function handleBackspace() {
  if (state.justEvaled || state.current.length <= 1) {
    state.current = '0';
  } else {
    state.current = state.current.slice(0, -1) || '0';
  }
  setDisplay(state.current);
}