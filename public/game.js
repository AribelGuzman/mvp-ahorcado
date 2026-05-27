/**
 * game.js — Ahorcado Web · v2.0
 *
 * Novedades:
 *  · Selector de categorías (generado dinámicamente desde PALABRAS)
 *  · Niveles de dificultad: Fácil ≤6 · Normal 7-9 · Difícil ≥10
 *  · Pool filtrado en tiempo real; badge de palabras disponibles
 *  · Badge de dificultad in-game junto a la categoría
 *  · Toast notification cuando el filtro no produce palabras
 */

import { PALABRAS } from './palabras.js';

// ────────────────────────────────────────────────────────────────
//  Constantes
// ────────────────────────────────────────────────────────────────

const MAX_ERRORES = 6;
const PARTES_SVG  = ['p-head', 'p-body', 'p-arl', 'p-arr', 'p-legl', 'p-legr'];

/** Definición de niveles de dificultad por longitud normalizada. */
const DIFICULTAD = {
  todas:   { label: 'Todas',   test: ()           => true     },
  facil:   { label: 'Fácil',   test: len => len  <= 6         },
  normal:  { label: 'Normal',  test: len => len  >= 7 && len <= 9 },
  dificil: { label: 'Difícil', test: len => len  >= 10        },
};

// ────────────────────────────────────────────────────────────────
//  Estado
// ────────────────────────────────────────────────────────────────

/** Filtros activos — persisten entre partidas. */
const F = {
  categoria: 'Todas',
  dificultad: 'todas',
};

/** Estado de la partida activa. */
const E = {
  palabra:       '',
  original:      '',
  pista:         '',
  categoria:     '',
  longitud:      0,
  adivinadas:    new Set(),
  errores:       0,
  pistaMostrada: false,
  gameOver:      false,
  victorias:     0,
  derrotas:      0,
};

// ────────────────────────────────────────────────────────────────
//  Utilidades
// ────────────────────────────────────────────────────────────────

const q = id => document.getElementById(id);

function normalizar(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^A-Z]/g, '');
}

/** Devuelve el nivel de dificultad de una palabra normalizada. */
function nivelDePalabra(normalised) {
  const len = normalised.length;
  if (len <= 6)  return 'facil';
  if (len <= 9)  return 'normal';
  return 'dificil';
}

// ────────────────────────────────────────────────────────────────
//  Pool filtrado
// ────────────────────────────────────────────────────────────────

function filtrarPool() {
  const difFn = DIFICULTAD[F.dificultad].test;
  return PALABRAS.filter(p => {
    const matchCat = F.categoria === 'Todas' || p.categoria === F.categoria;
    const matchDif = difFn(normalizar(p.palabra).length);
    return matchCat && matchDif;
  });
}

// ────────────────────────────────────────────────────────────────
//  Audio
// ────────────────────────────────────────────────────────────────

let _actx = null;
const actx = () => {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  return _actx;
};

function tone(freq, dur, type = 'sine', vol = 0.1) {
  try {
    const ctx  = actx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur);
  } catch (_) {}
}

const sfx = {
  correcto:   () => { tone(880, 0.09); setTimeout(() => tone(1108, 0.12), 75); },
  incorrecto: () => tone(160, 0.22, 'sawtooth', 0.07),
  victoria:   () => [[523,0],[659,100],[784,200],[1047,320]].forEach(([f,d]) => setTimeout(() => tone(f, 0.18), d)),
  derrota:    () => [[440,0],[349,200],[294,400],[220,650]].forEach(([f,d]) => setTimeout(() => tone(f, 0.28, 'square', 0.07), d)),
};

// ────────────────────────────────────────────────────────────────
//  Toast
// ────────────────────────────────────────────────────────────────

let _toastTimer = null;

function toast(msg) {
  const el = q('toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('visible'), 2800);
}

// ────────────────────────────────────────────────────────────────
//  Lógica del juego
// ────────────────────────────────────────────────────────────────

function nuevaPartida() {
  let pool = filtrarPool();

  if (pool.length === 0) {
    toast(`Sin palabras para "${DIFICULTAD[F.dificultad].label}" en "${F.categoria}" — mostrando todas`);
    pool = PALABRAS;
  }

  const entry     = pool[Math.floor(Math.random() * pool.length)];
  E.original      = entry.palabra.toUpperCase();
  E.palabra       = normalizar(entry.palabra);
  E.pista         = entry.pista;
  E.categoria     = entry.categoria;
  E.longitud      = E.palabra.length;
  E.adivinadas    = new Set();
  E.errores       = 0;
  E.pistaMostrada = false;
  E.gameOver      = false;

  ocultarOverlay();
  resetTeclado();
  renderizar(true);
  activarTeclado();
}

function adivinar(letra) {
  if (E.gameOver || E.adivinadas.has(letra)) return;
  E.adivinadas.add(letra);

  if (E.palabra.includes(letra)) {
    sfx.correcto();
  } else {
    E.errores++;
    sfx.incorrecto();
    const wd = q('palabra-display');
    wd.classList.remove('wrong-shake');
    void wd.offsetWidth;
    wd.classList.add('wrong-shake');
  }

  renderizar();
  comprobarFin();
}

function comprobarFin() {
  const ganado  = [...E.palabra].every(l => E.adivinadas.has(l));
  const perdido = E.errores >= MAX_ERRORES;
  if (ganado) {
    E.gameOver = true; E.victorias++;
    desactivarTeclado();
    sfx.victoria();
    setTimeout(() => mostrarOverlay('victoria'), 420);
  } else if (perdido) {
    E.gameOver = true; E.derrotas++;
    desactivarTeclado();
    sfx.derrota();
    setTimeout(() => mostrarOverlay('derrota'), 600);
  }
}

// ────────────────────────────────────────────────────────────────
//  Render
// ────────────────────────────────────────────────────────────────

function renderizar(esNuevaPartida = false) {
  renderizarSVG();
  renderizarPalabra(esNuevaPartida);
  renderizarMeta();
  renderizarTecladoEstado();
  renderizarMarcador();
  renderizarVidas();
  renderizarPista();
  renderizarAccesibilidad();
  renderizarPoolCount();
}

/* SVG Hangman ---------------------------------------------------- */
function renderizarSVG() {
  const svg   = q('hangman-svg');
  const frame = svg.closest('.horca-frame');
  PARTES_SVG.forEach((id, i) => q(id).classList.toggle('visible', i < E.errores));
  const muerto  = E.errores >= MAX_ERRORES;
  const peligro = (MAX_ERRORES - E.errores) === 1 && !muerto;
  svg.classList.toggle('dead', muerto);
  frame.classList.toggle('danger', peligro);
}

/* Word display --------------------------------------------------- */
function renderizarPalabra(esNuevaPartida = false) {
  const c = q('palabra-display');
  c.innerHTML = '';
  for (const l of E.palabra) {
    const span = document.createElement('span');
    span.className = 'caja-letra';
    if (E.adivinadas.has(l)) {
      span.textContent = l;
      span.classList.add('revelada');
    }
    c.appendChild(span);
  }
  if (esNuevaPartida) {
    c.classList.add('entering');
    const slots = c.querySelectorAll('.caja-letra');
    slots.forEach((el, i) => { el.style.animationDelay = `${i * 35}ms`; });
    c.addEventListener('animationend', () => {
      c.classList.remove('entering');
      slots.forEach(el => { el.style.animationDelay = ''; });
    }, { once: true });
  }
}

/* Category + difficulty badge + length --------------------------- */
function renderizarMeta() {
  q('categoria-display').textContent = E.categoria;

  const nivel = nivelDePalabra(E.palabra);
  const badge = q('dificultad-display');
  badge.textContent = DIFICULTAD[nivel].label;
  badge.className   = `badge-dificultad ${nivel}`;

  q('longitud-display').textContent = `${E.longitud} letras`;
}

/* Hint ----------------------------------------------------------- */
function renderizarPista() {
  const area = q('pista-area');
  if (E.pistaMostrada) {
    const old = q('btn-pista');
    if (old) old.removeEventListener('click', _pistaCb);
    area.innerHTML = `<p class="pista-texto" role="status" aria-live="polite">${E.pista}</p>`;
  } else {
    area.innerHTML = `<button id="btn-pista" class="btn-pista"
                        aria-label="Mostrar pista para la palabra actual">
                        💡&ensp;Ver pista
                      </button>`;
    q('btn-pista').addEventListener('click', _pistaCb, { once: true });
  }
}
function _pistaCb() { E.pistaMostrada = true; renderizarPista(); }

/* Score ---------------------------------------------------------- */
function renderizarMarcador() {
  q('victorias').textContent = E.victorias;
  q('derrotas').textContent  = E.derrotas;
}

/* Lives ---------------------------------------------------------- */
function renderizarVidas() {
  const restantes = MAX_ERRORES - E.errores;
  q('vidas-bar').innerHTML = Array.from({ length: MAX_ERRORES }, (_, i) => {
    const isLast = i === restantes - 1 && restantes === 1;
    const cls    = i < restantes ? (isLast ? 'vida danger-pip' : 'vida viva') : 'vida perdida';
    return `<span class="${cls}" aria-label="vida ${i+1} de ${MAX_ERRORES}: ${i<restantes?'activa':'perdida'}"></span>`;
  }).join('');
}

/* Accessibility live region ------------------------------------- */
function renderizarAccesibilidad() {
  const restantes = MAX_ERRORES - E.errores;
  const reveladas = [...E.palabra].filter(l => E.adivinadas.has(l)).length;
  q('sr-estado').textContent =
    `Errores: ${E.errores} de ${MAX_ERRORES}. ` +
    `Letras reveladas: ${reveladas} de ${E.palabra.length}. ` +
    `Vidas restantes: ${restantes}.`;
}

/* Pool count label ----------------------------------------------- */
function renderizarPoolCount() {
  const n   = filtrarPool().length;
  const total = PALABRAS.length;
  const el  = q('pool-count');

  if (F.categoria === 'Todas' && F.dificultad === 'todas') {
    el.textContent = '';
  } else {
    el.innerHTML = `<span>${n}</span> de ${total} palabras con estos filtros`;
    if (n === 0) el.innerHTML += ' — <em>se mostrarán todas</em>';
  }
}

// ────────────────────────────────────────────────────────────────
//  Teclado virtual
// ────────────────────────────────────────────────────────────────

function construirTeclado() {
  const c = q('teclado');
  for (let i = 65; i <= 90; i++) {
    const l   = String.fromCharCode(i);
    const btn = document.createElement('button');
    btn.id          = `key-${l}`;
    btn.textContent = l;
    btn.className   = 'tecla';
    btn.setAttribute('aria-label', `Letra ${l}`);
    btn.addEventListener('click', () => adivinar(l));
    c.appendChild(btn);
  }
}

function renderizarTecladoEstado() {
  for (let i = 65; i <= 90; i++) {
    const l   = String.fromCharCode(i);
    const btn = q(`key-${l}`);
    if (!btn) continue;
    const usada    = E.adivinadas.has(l);
    const correcta = usada && E.palabra.includes(l);
    btn.disabled  = usada;
    btn.className = 'tecla' + (usada ? (correcta ? ' correcta' : ' incorrecta') : '');
    btn.setAttribute('aria-label',
      usada ? `Letra ${l} — ${correcta ? 'correcta' : 'incorrecta'}` : `Letra ${l}`);
  }
}

function resetTeclado() {
  for (let i = 65; i <= 90; i++) {
    const l   = String.fromCharCode(i);
    const btn = q(`key-${l}`);
    if (!btn) continue;
    btn.className = 'tecla';
    btn.disabled  = false;
    btn.setAttribute('aria-label', `Letra ${l}`);
  }
}

// ────────────────────────────────────────────────────────────────
//  Filtros
// ────────────────────────────────────────────────────────────────

/** Construye los pills de categoría a partir de las categorías presentes en PALABRAS. */
function construirFiltroCategorias() {
  const categorias = ['Todas', ...new Set(PALABRAS.map(p => p.categoria)).values()].sort(
    (a, b) => a === 'Todas' ? -1 : b === 'Todas' ? 1 : a.localeCompare(b, 'es')
  );

  const c = q('filtro-cat');
  for (const cat of categorias) {
    const btn = document.createElement('button');
    btn.className   = 'pill' + (cat === F.categoria ? ' active' : '');
    btn.textContent = cat;
    btn.setAttribute('aria-pressed', String(cat === F.categoria));
    btn.addEventListener('click', () => seleccionarCategoria(cat));
    c.appendChild(btn);
  }
}

function seleccionarCategoria(cat) {
  if (F.categoria === cat) return;
  F.categoria = cat;
  _sincronizarPillsCat();
  renderizarPoolCount();
  nuevaPartida();
}

function _sincronizarPillsCat() {
  q('filtro-cat').querySelectorAll('.pill').forEach(btn => {
    const activa = btn.textContent === F.categoria;
    btn.classList.toggle('active', activa);
    btn.setAttribute('aria-pressed', String(activa));
  });
}

function seleccionarDificultad(dif) {
  if (F.dificultad === dif) return;
  F.dificultad = dif;
  _sincronizarPillsDif();
  renderizarPoolCount();
  nuevaPartida();
}

function _sincronizarPillsDif() {
  q('filtro-dif').querySelectorAll('.pill').forEach(btn => {
    const activa = btn.dataset.dif === F.dificultad;
    btn.classList.toggle('active', activa);
    btn.setAttribute('aria-pressed', String(activa));
  });
}

// ────────────────────────────────────────────────────────────────
//  Overlay resultado
// ────────────────────────────────────────────────────────────────

function mostrarOverlay(tipo) {
  const card = q('overlay-card');
  q('overlay-emoji').textContent   = tipo === 'victoria' ? '🎉' : '💀';
  q('overlay-titulo').textContent  = tipo === 'victoria' ? '¡Ganaste!' : '¡Game Over!';
  q('overlay-palabra').textContent = E.original;
  q('overlay-pista').textContent   = tipo === 'derrota' ? E.pista : '';
  card.className = `overlay-card ${tipo === 'victoria' ? 'win-card' : 'lose-card'}`;
  q('overlay').hidden = false;
  q('btn-reiniciar').focus();
}

function ocultarOverlay() {
  q('overlay').hidden = true;
}

// ────────────────────────────────────────────────────────────────
//  Teclado físico
// ────────────────────────────────────────────────────────────────

function onKeyDown(e) {
  if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
  const letra = normalizar(e.key);
  if (letra.length !== 1 || !/[A-Z]/.test(letra)) return;
  const btn = q(`key-${letra}`);
  if (btn && !btn.disabled) {
    btn.classList.add('physical-press');
    setTimeout(() => btn.classList.remove('physical-press'), 180);
  }
  adivinar(letra);
}

function activarTeclado()    { document.addEventListener('keydown', onKeyDown); }
function desactivarTeclado() { document.removeEventListener('keydown', onKeyDown); }

function onOverlayKeyDown(e) {
  if (e.key === 'Tab') { e.preventDefault(); q('btn-reiniciar').focus(); }
}

// ────────────────────────────────────────────────────────────────
//  Bootstrap
// ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Build static elements
  construirTeclado();
  construirFiltroCategorias();

  // Wire difficulty pills (static in HTML)
  q('filtro-dif').querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => seleccionarDificultad(btn.dataset.dif));
  });

  // Wire overlay
  q('btn-reiniciar').addEventListener('click', nuevaPartida);
  q('overlay').addEventListener('keydown', onOverlayKeyDown);

  // Start
  nuevaPartida();
});
