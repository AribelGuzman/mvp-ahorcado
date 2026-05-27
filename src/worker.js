/**
 * worker.js — Cloudflare Worker
 *
 * Delega todas las peticiones al binding ASSETS, que sirve
 * los archivos estáticos de /public de forma automática.
 * Aquí se puede añadir lógica API en el futuro (p. ej. highscores).
 */
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
