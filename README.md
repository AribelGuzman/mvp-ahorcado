# 🎭 Ahorcado — MVP

Juego clásico del ahorcado en español desplegado en **Cloudflare Workers**.  
Estética de terminal, sin frameworks, sin dependencias de producción.

---

## Stack

| Capa | Tecnología |
|---|---|
| Hosting | Cloudflare Workers + Workers Assets |
| Frontend | HTML + CSS + JavaScript ES Modules (vanilla) |
| CI/CD | GitHub Actions → `wrangler deploy` |
| Prototype CLI | Python 3 (`ahorcado.py`) |

---

## Estructura del proyecto

```
mvp-ahorcado/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← CI/CD: push a main → Cloudflare
├── public/                   ← Archivos estáticos servidos por el Worker
│   ├── index.html
│   ├── style.css
│   ├── game.js               ← Lógica del juego (ES Modules)
│   └── palabras.js           ← Banco de 50 palabras + pistas
├── src/
│   └── worker.js             ← Cloudflare Worker (delega a ASSETS)
├── ahorcado.py               ← Prototipo CLI original (Python)
├── palabras.py               ← Palabras para el CLI
├── wrangler.toml             ← Config de Cloudflare Workers
├── package.json
└── README.md
```

---

## Desarrollo local

```bash
# Instalar Wrangler
npm install

# Servidor local con hot-reload (http://localhost:8787)
npm run dev
```

---

## Deploy a Cloudflare Workers

### 1. Crear el repositorio en GitHub

```bash
git remote add origin https://github.com/<tu-usuario>/mvp-ahorcado.git
git push -u origin main
```

### 2. Añadir los secrets en GitHub

En **Settings → Secrets and variables → Actions** del repo:

| Secret | Dónde obtenerlo |
|---|---|
| `CF_API_TOKEN` | Cloudflare Dashboard → My Profile → API Tokens → *Edit Cloudflare Workers* |
| `CF_ACCOUNT_ID` | Cloudflare Dashboard → lado derecho de la pantalla principal |

### 3. Activar el pipeline

El workflow `deploy.yml` se dispara automáticamente en cada push a `main`.  
También se puede lanzar manualmente desde **Actions → Deploy → Run workflow**.

---

## Mecánicas del juego

- **50 palabras** en español con pistas y categorías (Animales, Naturaleza, Lugares, Objetos, Ciencia…)
- **6 vidas** — cada error añade una parte al monigote ASCII
- **Pista** disponible pulsando `?` (botón o tecla) sin penalización
- **Teclado físico** soportado: escribe la letra directamente
- Tildes normalizadas automáticamente (VOLCÁN → VOLCAN para el juego)
- Marcador de victorias/derrotas por sesión

## Monigote (6 etapas)

```
  +---+      +---+      +---+      +---+      +---+      +---+
  |   |      |   |      |   |      |   |      |   |      |   |
      |      O   |      O   |      O   |      O   |      O   |
      |          |      |   |     /|   |     /|\  |     /|\  |
      |          |          |          |          |     /    |
      |          |          |          |          |          |
=========  =========  =========  =========  =========  =========
  0 err      1 err      2 err      3 err      4 err      5 err

  +---+
  |   |
  O   |
 /|\  |     ← 6 errores = Game Over
 / \  |
      |
=========
```

---

*mvp-ahorcado · v1.0 · Cloudflare Workers · sin dependencias de producción*
