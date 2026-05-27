/**
 * game.js — Lógica principal del Ahorcado web.
 * Traduce ahorcado.py a JavaScript puro (sin frameworks).
 */

import { PALABRAS } from './palabras.js';

// ── Constantes ────────────────────────────────────────────────────
const MAX_ERRORES = 6;

/** Monigote ASCII: índice = número de errores cometidos */
const MONIGOTE = [
  "  +---+\n  |   |\n      |\n      |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n      |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n  |   |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|   |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n      |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n /    |\n      |\n=========",
  "  +---+\n  |   |\n  O   |\n /|\\  |\n / \\  |\n      |\n=========",
];

// ── Estado del juego ──────────────────────────────────────────────
const estado = {
  palabra:    '',   // versión normalizada (sin tildes, mayúsculas)
  original:   '',   // versión con tildes para mostrar al final
  pista:      '',
  categoria:  '',
  adivinadas: new Set(),
  errores:    0,
  pistaMostrada: false,
  gameOver:   false,
  victorias:  0,
  derrotas:   0,
};

// ── Utilidades ────────────────────────────────────────────────────

/** Elimina tildes y devuelve mayúsculas. */
function normalizar(str) {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .replace(/[^A-Z]/g, '');
}

/** Selecciona un elemento del DOM (con cache inline). */
const q = (id) => document.getElementById(id);

// ── Núcleo del juego ──────────────────────────────────────────────

function nuevaPartida() {
  const entrada     = PALABRAS[Math.floor(Math.random() * PALABRAS.length)];
  estado.original   = entrada.palabra.toUpperCase();
  estado.palabra    = normalizar(entrada.palabra);
  estado.pista      = entrada.pista;
  estado.categoria  = entrada.categoria;
  estado.adivinadas = new Set();
  estado.errores    = 0;
  estado.pistaMostrada = false;
  estado.gameOver   = false;

  ocultarMensaje();
  renderizar();
  activarTeclado();
}

function adivinar(letra) {
  if (estado.gameOver)                  return;
  if (estado.adivinadas.has(letra))     return;

  estado.adivinadas.add(letra);

  if (!estado.palabra.includes(letra)) {
    estado.errores++;
  }

  renderizar();

  // ¿Victoria?
  if ([...estado.palabra].every(l => estado.adivinadas.has(l))) {
    estado.gameOver = true;
    estado.victorias++;
    desactivarTeclado();
    setTimeout(() => mostrarMensaje('victoria'), 350);
    return;
  }

  // ¿Derrota?
  if (estado.errores >= MAX_ERRORES) {
    estado.gameOver = true;
    estado.derrotas++;
    desactivarTeclado();
    setTimeout(() => mostrarMensaje('derrota'), 500);
  }
}

function mostrarPista() {
  estado.pistaMostrada = true;
  renderizarPista();
}

// ── Renderizado ───────────────────────────────────────────────────

function renderizar() {
  renderizarMonigote();
  renderizarPalabra();
  renderizarInfo();
  renderizarTeclado();
  renderizarMarcador();
  renderizarVidas();
  renderizarPista();
}

function renderizarMonigote() {
  const el = q('monigote');
  el.textContent = MONIGOTE[Math.min(estado.errores, MAX_ERRORES)];
  el.className = estado.errores >= MAX_ERRORES ? 'muerto' : '';
}

function renderizarPalabra() {
  const contenedor = q('palabra-display');
  contenedor.innerHTML = '';

  for (const letra of estado.palabra) {
    const caja = document.createElement('span');
    caja.className = 'caja-letra';

    if (estado.adivinadas.has(letra)) {
      caja.textContent = letra;
      caja.classList.add('revelada');
    }
    contenedor.appendChild(caja);
  }
}

function renderizarInfo() {
  q('categoria-display').textContent = estado.categoria;
  q('longitud-display').textContent  = `${estado.palabra.length} letras`;
}

function renderizarPista() {
  const area = q('pista-area');
  if (estado.pistaMostrada) {
    area.innerHTML = `<p class="pista-texto">💡 ${estado.pista}</p>`;
  } else {
    area.innerHTML = `<button id="btn-pista" class="btn-pista">? Ver pista</button>`;
    q('btn-pista').addEventListener('click', mostrarPista);
  }
}

function renderizarTeclado() {
  const contenedor = q('teclado');
  contenedor.innerHTML = '';

  for (let i = 65; i <= 90; i++) {
    const letra = String.fromCharCode(i);
    const btn   = document.createElement('button');
    btn.textContent = letra;
    btn.className   = 'tecla';
    btn.setAttribute('aria-label', `Letra ${letra}`);

    if (estado.adivinadas.has(letra)) {
      btn.classList.add(estado.palabra.includes(letra) ? 'correcta' : 'incorrecta');
      btn.disabled = true;
    }

    btn.addEventListener('click', () => adivinar(letra));
    contenedor.appendChild(btn);
  }
}

function renderizarMarcador() {
  q('victorias').textContent = estado.victorias;
  q('derrotas').textContent  = estado.derrotas;
}

function renderizarVidas() {
  const restantes = MAX_ERRORES - estado.errores;
  q('vidas-bar').innerHTML = Array.from({ length: MAX_ERRORES }, (_, i) =>
    `<span class="vida ${i < restantes ? 'viva' : 'perdida'}">♥</span>`
  ).join('');
}

// ── Mensajes fin de partida ───────────────────────────────────────

function mostrarMensaje(tipo) {
  const overlay = q('mensaje-overlay');
  const titulo  = q('mensaje-titulo');
  const texto   = q('mensaje-texto');

  if (tipo === 'victoria') {
    titulo.textContent = '🎉 ¡GANASTE!';
    titulo.className   = 'victoria';
    texto.textContent  = `La palabra era: ${estado.original}`;
  } else {
    titulo.textContent = '💀 ¡PERDISTE!';
    titulo.className   = 'derrota';
    texto.innerHTML    = `La palabra era: <strong>${estado.original}</strong><br><em>${estado.pista}</em>`;
  }

  overlay.hidden = false;
}

function ocultarMensaje() {
  q('mensaje-overlay').hidden = true;
}

// ── Teclado físico ────────────────────────────────────────────────

function manejarTecla(e) {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const letra = normalizar(e.key);
  if (letra.length === 1 && /[A-Z]/.test(letra)) {
    adivinar(letra);
  }
}

function activarTeclado()   { document.addEventListener('keydown', manejarTecla); }
function desactivarTeclado() { document.removeEventListener('keydown', manejarTecla); }

// ── Inicio ────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  q('btn-reiniciar').addEventListener('click', nuevaPartida);
  nuevaPartida();
});
