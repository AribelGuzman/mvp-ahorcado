/**
 * game.js — Ahorcado Web · Lógica principal
 *
 * Arquitectura:
 *  · Estado inmutable en el objeto `E`
 *  · render() se llama tras cada cambio de estado
 *  · El teclado virtual se construye una vez; sólo se actualizan clases
 *  · SVG hangman: pathLength=100 + stroke-dashoffset para animación de dibujo
 *  · Web Audio API para feedback sonoro sin archivos externos
 */

import { PALABRAS } from './palabras.js';

// ────────────────────────────────────────────────────────────────
//  Constantes
// ────────────────────────────────────────────────────────────────

const MAX_ERRORES = 6;

/** IDs de los elementos SVG del monigote, en orden de aparición. */
const PARTES_SVG = ['p-head', 'p-body', 'p-arl', 'p-arr', 'p-legl', 'p-legr'];

// ────────────────────────────────────────────────────────────────
//  Estado
// ────────────────────────────────────────────────────────────────

const E = {
  palabra:       '',   // normalizada (sin tildes, mayúsculas)
  original:      '',   // con tildes para mostrar al final
  pista:         '',
  categoria:     '',
  adivinadas:    new Set(),
  errores:       0,
  pistaMostrada: false,
  gameOver:      false,
  victorias:     0,
  derrotas:      0,
};

// ────────────────────────────────────────────────────────────────
//  Utilidades DOM
// ────────────────────────────────────────────────────────────────

const q = id => document.getElementById(id);

// ────────────────────────────────────────────────────────────────
//  Normalización
// ────────────────────────────────────────────────────────────────

function normalizar(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')   // elimina diacríticos
    .replace(/[^A-Z]/g, '');
}

// ────────────────────────────────────────────────────────────────
//  Audio (Web Audio API — sin archivos externos)
// ────────────────────────────────────────────────────────────────

let _actx = null;

function actx() {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  return _actx;
}

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
  } catch (_) { /* silently degrade if Web Audio not available */ }
}

const sfx = {
  correcto:   () => { tone(880, 0.09); setTimeout(() => tone(1108, 0.12), 75); },
  incorrecto: () => tone(160, 0.22, 'sawtooth', 0.07),
  victoria:   () => {
    [[523,0],[659,100],[784,200],[1047,320]].forEach(([f,d]) =>
      setTimeout(() => tone(f, 0.18), d));
  },
  derrota:    () => {
    [[440,0],[349,200],[294,400],[220,650]].forEach(([f,d]) =>
      setTimeout(() => tone(f, 0.28, 'square', 0.07), d));
  },
};

// ────────────────────────────────────────────────────────────────
//  Lógica del juego
// ────────────────────────────────────────────────────────────────

function nuevaPartida() {
  const entry     = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
  E.original      = entry.palabra.toUpperCase();
  E.palabra       = normalizar(entry.palabra);
  E.pista         = entry.pista;
  E.categoria     = entry.categoria;
  E.adivinadas    = new Set();
  E.errores       = 0;
  E.pistaMostrada = false;
  E.gameOver      = false;

  ocultarOverlay();
  resetTeclado();
  renderizar(true /* nueva partida */);
  activarTeclado();
}

function adivinar(letra) {
  if (E.gameOver)              return;
  if (E.adivinadas.has(letra)) return;

  E.adivinadas.add(letra);

  if (E.palabra.includes(letra)) {
    sfx.correcto();
  } else {
    E.errores++;
    sfx.incorrecto();
    // Shake the word row on wrong guess
    const wd = q('palabra-display');
    wd.classList.remove('wrong-shake');
    void wd.offsetWidth; // force reflow to restart animation
    wd.classList.add('wrong-shake');
  }

  renderizar();
  comprobarFin();
}

function comprobarFin() {
  const ganado  = [...E.palabra].every(l => E.adivinadas.has(l));
  const perdido = E.errores >= MAX_ERRORES;

  if (ganado) {
    E.gameOver = true;
    E.victorias++;
    desactivarTeclado();
    sfx.victoria();
    setTimeout(() => mostrarOverlay('victoria'), 420);
  } else if (perdido) {
    E.gameOver = true;
    E.derrotas++;
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
}

/* SVG Hangman ---------------------------------------------------- */
function renderizarSVG() {
  const svg   = q('hangman-svg');
  const frame = svg.closest('.horca-frame');

  PARTES_SVG.forEach((id, i) => {
    q(id).classList.toggle('visible', i < E.errores);
  });

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

  // Stagger entrance animation on new game
  if (esNuevaPartida) {
    c.classList.add('entering');
    const slots = c.querySelectorAll('.caja-letra');
    slots.forEach((el, i) => {
      el.style.animationDelay = `${i * 35}ms`;
    });
    c.addEventListener('animationend', () => {
      c.classList.remove('entering');
      slots.forEach(el => { el.style.animationDelay = ''; });
    }, { once: true });
  }
}

/* Category + length --------------------------------------------- */
function renderizarMeta() {
  q('categoria-display').textContent = E.categoria;
  q('longitud-display').textContent  = `${E.palabra.length} letras`;
}

/* Hint area ------------------------------------------------------ */
function renderizarPista() {
  const area = q('pista-area');

  if (E.pistaMostrada) {
    // Remove old listener if any
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

function _pistaCb() {
  E.pistaMostrada = true;
  renderizarPista();
}

/* Score ---------------------------------------------------------- */
function renderizarMarcador() {
  q('victorias').textContent = E.victorias;
  q('derrotas').textContent  = E.derrotas;
}

/* Lives ---------------------------------------------------------- */
function renderizarVidas() {
  const restantes = MAX_ERRORES - E.errores;
  q('vidas-bar').innerHTML = Array.from({ length: MAX_ERRORES }, (_, i) => {
    const isLast    = i === restantes - 1 && restantes === 1;
    const cls       = i < restantes
      ? (isLast ? 'vida danger-pip' : 'vida viva')
      : 'vida perdida';
    const ariaLabel = `vida ${i + 1} de ${MAX_ERRORES}: ${i < restantes ? 'activa' : 'perdida'}`;
    return `<span class="${cls}" aria-label="${ariaLabel}"></span>`;
  }).join('');
}

/* Accessibility -------------------------------------------------- */
function renderizarAccesibilidad() {
  const restantes = MAX_ERRORES - E.errores;
  const reveladas = [...E.palabra].filter(l => E.adivinadas.has(l)).length;
  q('sr-estado').textContent =
    `Errores: ${E.errores} de ${MAX_ERRORES}. ` +
    `Letras reveladas: ${reveladas} de ${E.palabra.length}. ` +
    `Vidas restantes: ${restantes}.`;
}

// ────────────────────────────────────────────────────────────────
//  Teclado virtual
// ────────────────────────────────────────────────────────────────

/** Construye el teclado una sola vez en DOMContentLoaded. */
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

/** Actualiza sólo las clases/disabled de cada tecla (sin reconstruir). */
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
      usada
        ? `Letra ${l} — ${correcta ? 'correcta' : 'incorrecta'}`
        : `Letra ${l}`
    );
  }
}

/** Resetea todas las teclas a estado inicial (nueva partida). */
function resetTeclado() {
  for (let i = 65; i <= 90; i++) {
    const btn = q(`key-${String.fromCharCode(i)}`);
    if (!btn) continue;
    btn.className = 'tecla';
    btn.disabled  = false;
    btn.setAttribute('aria-label', `Letra ${String.fromCharCode(i)}`);
  }
}

// ────────────────────────────────────────────────────────────────
//  Overlay resultado
// ────────────────────────────────────────────────────────────────

function mostrarOverlay(tipo) {
  const card = q('overlay-card');

  q('overlay-emoji').textContent  = tipo === 'victoria' ? '🎉' : '💀';
  q('overlay-titulo').textContent = tipo === 'victoria' ? '¡Ganaste!' : '¡Game Over!';
  q('overlay-palabra').textContent = E.original;
  q('overlay-pista').textContent   = tipo === 'derrota' ? E.pista : '';

  card.className = `overlay-card ${tipo === 'victoria' ? 'win-card' : 'lose-card'}`;
  q('overlay').hidden = false;

  // Trap focus inside overlay
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

  // Flash the virtual key for visual feedback
  const btn = q(`key-${letra}`);
  if (btn && !btn.disabled) {
    btn.classList.add('physical-press');
    setTimeout(() => btn.classList.remove('physical-press'), 180);
  }

  adivinar(letra);
}

function activarTeclado()    { document.addEventListener('keydown', onKeyDown); }
function desactivarTeclado() { document.removeEventListener('keydown', onKeyDown); }

// ────────────────────────────────────────────────────────────────
//  Focus trap in overlay (Tab + Shift+Tab stay inside)
// ────────────────────────────────────────────────────────────────

function onOverlayKeyDown(e) {
  if (e.key !== 'Tab') return;
  // Only one focusable element (btn-reiniciar), so just cancel tab
  e.preventDefault();
  q('btn-reiniciar').focus();
}

// ────────────────────────────────────────────────────────────────
//  Bootstrap
// ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  construirTeclado();
  q('btn-reiniciar').addEventListener('click', nuevaPartida);
  q('overlay').addEventListener('keydown', onOverlayKeyDown);
  nuevaPartida();
});
