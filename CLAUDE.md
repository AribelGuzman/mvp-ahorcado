# mvp-ahorcado

Juego del Ahorcado en español desplegado en **Cloudflare Workers**. Frontend en vanilla JS (ES Modules, sin frameworks ni build step). 118 palabras con pistas, selector de categorías y niveles de dificultad.

**Live:** https://mvp-ahorcado.daguzman.workers.dev  
**GitHub:** https://github.com/AribelGuzman/mvp-ahorcado

---

## Comandos

```bash
# Desarrollo local con hot-reload (requiere Node.js ≥ 20 vía nvm)
npm run dev          # → http://localhost:8787

# Despliegue manual a producción (wrangler debe estar autenticado)
npm run deploy

# Wrangler está instalado en:
/home/daguzman/.nvm/versions/node/v24.16.0/bin/wrangler

# Verificar autenticación Cloudflare
wrangler whoami      # cuenta: dianaguzman2009@hotmail.com
gh auth status       # cuenta GitHub: AribelGuzman
```

> No hay transpilación ni bundling. Los archivos de `public/` se sirven directamente.

---

## Arquitectura

```
Cloudflare Worker (src/worker.js)
    └── ASSETS binding → sirve public/ como estáticos

public/
├── index.html     DOM + filtros + SVG hangman (markup)
├── style.css      Design tokens, animaciones, responsive
├── game.js        Toda la lógica (ES Module, ~480 líneas)
└── palabras.js    Banco de 118 palabras (export puro)
```

El Worker es trivial: `env.ASSETS.fetch(request)`. Toda la lógica vive en el cliente. No hay API, base de datos ni estado del servidor.

---

## Estructura de archivos

| Archivo | Propósito |
|---|---|
| `wrangler.toml` | Config Cloudflare: name, main, account_id, [assets] |
| `package.json` | Solo devDependency: wrangler ^3.80 |
| `.github/workflows/deploy.yml` | Push a `master` → `wrangler deploy` automático |
| `src/worker.js` | Entry point del Worker (3 líneas) |
| `public/index.html` | Estructura HTML, fuentes Google, filtros estáticos |
| `public/style.css` | ~725 líneas: tokens, animaciones SVG, responsive |
| `public/game.js` | ~480 líneas: estado, renderizado, audio, filtros |
| `public/palabras.js` | Array `PALABRAS` con `{ palabra, pista, categoria }` |
| `ahorcado.py` / `palabras.py` | Prototipo CLI Python — solo referencia, no se despliega |

---

## Estado del juego (game.js)

Dos objetos de estado globales:

```js
// Filtros — persisten entre partidas, se resetean al recargar
F = { categoria: 'Todas', dificultad: 'todas' }

// Partida activa — se resetea en nuevaPartida()
E = {
  palabra,        // normalizada sin tildes (para lógica)
  original,       // con tildes (para mostrar al final)
  pista, categoria, longitud,
  adivinadas,     // Set de letras adivinadas (mayúsculas)
  errores,        // 0–6 (MAX_ERRORES = 6)
  pistaMostrada, gameOver,
  victorias, derrotas  // acumulan toda la sesión
}
```

**Flujo de llamadas:**
```
nuevaPartida() → filtrarPool() → renderizar(true)
adivinar(letra) → renderizar() → comprobarFin()
comprobarFin()  → mostrarOverlay('victoria' | 'derrota')
```

---

## Palabras y dificultad

```js
// public/palabras.js — estructura de cada entrada
{ palabra: "MURCIELAGO", pista: "Único mamífero volador...", categoria: "Animales" }
```

**Dificultad calculada en tiempo de ejecución** por longitud normalizada — no se almacena en el dato:

| Nivel | Letras | Palabras |
|---|---|---|
| Fácil | ≤ 6 | 18 |
| Normal | 7 – 9 | 81 |
| Difícil | ≥ 10 | 19 |

**10 categorías:** Animales · Arte · Ciencia · Comida · Deportes · Lugares · Naturaleza · Objetos · Profesiones · Tecnología

Para **añadir palabras**: añadir entradas al array `PALABRAS` en `public/palabras.js`. Las categorías nuevas aparecen automáticamente en el selector de pills (auto-generado desde los datos).

---

## SVG Hangman

El monigote es SVG inline con 6 partes (`p-head`, `p-body`, `p-arl`, `p-arr`, `p-legl`, `p-legr`). Cada parte usa `pathLength="100"` + `stroke-dasharray/offset` para la animación de trazo.

```css
/* Parte oculta → visible */
.bp                { opacity:0; stroke-dasharray:100; stroke-dashoffset:100; }
.bp.visible        { opacity:1; stroke-dashoffset:0;  /* transition: 0.45s */ }
#hangman-svg.dead  { /* gallos + figura en rojo + shake */ }
```

JS añade clase `.visible` por cada error:
```js
PARTES_SVG.forEach((id, i) => q(id).classList.toggle('visible', i < E.errores));
```

---

## CSS Design Tokens

```css
:root {
  --bg: #0d1117;  --bg-2: #161b22;  --bg-3: #21262d;  --border: #30363d;
  --tx-1: #e6edf3;  --tx-2: #8b949e;  --tx-3: #484f58;
  --gold: #d29922;  --green: #3fb950;  --red: #f85149;
  --blue: #58a6ff;  --purple: #bc8cff;
  --font-ui:   'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Consolas, monospace;
  --r-sm: 6px;  --r: 10px;  --r-lg: 14px;
}
```

Todas las dimensiones usan `clamp(min, preferred-vw, max)`. No hay media queries de tipografía.

---

## Audio

Web Audio API puro, sin archivos. El contexto se crea *lazy* (primer sonido) para evitar bloqueos de autoplay en móvil.

```js
sfx.correcto()    // 2 tonos ascendentes
sfx.incorrecto()  // sawtooth grave
sfx.victoria()    // fanfarria de 4 notas
sfx.derrota()     // descenso de 4 notas
```

---

## Deploy pipeline (CI/CD)

`.github/workflows/deploy.yml` — se dispara en push a `master` o manualmente:

```
checkout → node 20 → npm ci → wrangler deploy
```

**Secret requerido** (solo uno, `account_id` ya está en `wrangler.toml`):
- `CF_API_TOKEN` → Cloudflare dashboard → API Tokens → *Edit Cloudflare Workers*

Para añadirlo: `gh secret set CF_API_TOKEN --repo AribelGuzman/mvp-ahorcado`

---

## Ramas

| Rama | Estado | Contenido |
|---|---|---|
| `master` | Producción | 50 palabras, UI profesional con SVG |
| `feat/categorias-dificultad` | Pendiente de merge | +68 palabras, selector de categorías, niveles de dificultad |

---

## Decisiones y gotchas

**Sin build step.** `<script type="module">` sirve directo. Requiere HTTP/2 (Cloudflare lo provee). Sin minificación: el archivo más grande es `palabras.js` (~8 KB).

**Normalización dual.** `E.palabra` = sin tildes (lógica de juego), `E.original` = con tildes (mostrar al usuario). `VOLCAN` / `VOLCÁN`.

**Pool vacío.** Si categoría + dificultad produce 0 palabras, se muestra toast y se usa `PALABRAS` completo sin cambiar el filtro activo.

**Teclado virtual vs físico.** El teclado virtual se construye una vez (`construirTeclado()`) y se actualiza con clases CSS. Las teclas físicas disparan además un flash visual de 180 ms (`physical-press`) para confirmar el input al jugador.

**Hint listener sin leak.** `{ once: true }` en el addEventListener del botón de pista. El botón se destruye y recrea en cada render, por lo que no puede acumular listeners.

**Focus trap en overlay.** Tab dentro del modal queda atrapado en `#btn-reiniciar` para usuarios de teclado.

**Python CLI.** `ahorcado.py` y `palabras.py` son el prototipo original. No se ejecutan en producción; solo sirven como referencia del diseño del juego.
