#!/usr/bin/env python3
"""
╔══════════════════════════════════════════╗
║   🎭  J U E G O  D E L  A H O R C A D O ║
║        Versión 1.0 — MVP                ║
╚══════════════════════════════════════════╝

Clásico juego del ahorcado con palabras en español.
  · 50 palabras con pistas y categorías
  · Monigote ASCII animado (6 errores)
  · Puntuación acumulada por sesión
  · Escribe '?' para ver la pista
"""

import os
import sys
import random

from palabras import PALABRAS

# ── Paleta de colores ANSI ───────────────────────────────────────
R   = "\033[91m"   # Rojo
G   = "\033[92m"   # Verde
Y   = "\033[93m"   # Amarillo
B   = "\033[94m"   # Azul
M   = "\033[95m"   # Magenta
C   = "\033[96m"   # Cian
W   = "\033[97m"   # Blanco brillante
BLD = "\033[1m"
DIM = "\033[2m"
RST = "\033[0m"

MAX_ERRORES = 6

# ── Monigote del ahorcado ────────────────────────────────────────
# Cada entrada representa el estado del ahorcado tras N errores.
# La ñ se usa como marcador de posición para el backslash literal.
_ETAPAS = [
    # 0 — solo la horca
    [
        "  +---+",
        "  |   |",
        "      |",
        "      |",
        "      |",
        "      |",
        "=========",
    ],
    # 1 — cabeza
    [
        "  +---+",
        "  |   |",
        "  O   |",
        "      |",
        "      |",
        "      |",
        "=========",
    ],
    # 2 — cuerpo
    [
        "  +---+",
        "  |   |",
        "  O   |",
        "  |   |",
        "      |",
        "      |",
        "=========",
    ],
    # 3 — brazo izquierdo
    [
        "  +---+",
        "  |   |",
        "  O   |",
        " /|   |",
        "      |",
        "      |",
        "=========",
    ],
    # 4 — ambos brazos
    [
        "  +---+",
        "  |   |",
        "  O   |",
        " /|\\  |",
        "      |",
        "      |",
        "=========",
    ],
    # 5 — pierna izquierda
    [
        "  +---+",
        "  |   |",
        "  O   |",
        " /|\\  |",
        " /    |",
        "      |",
        "=========",
    ],
    # 6 — muerto (ambas piernas)
    [
        "  +---+",
        "  |   |",
        "  O   |",
        " /|\\  |",
        " / \\  |",
        "      |",
        "=========",
    ],
]

# Partes del cuerpo que se van añadiendo en cada error
_PARTES = ["", "cabeza", "cuerpo", "brazo izquierdo", "brazo derecho",
           "pierna izquierda", "pierna derecha"]


def get_figura(errores: int) -> str:
    """Devuelve la figura del ahorcado coloreada según el estado."""
    lineas = _ETAPAS[min(errores, MAX_ERRORES)]
    if errores >= MAX_ERRORES:
        return "\n".join(f"  {R}{linea}{RST}" for linea in lineas)
    else:
        # Horca en amarillo, monigote (líneas 2-5) en blanco
        resultado = []
        for i, linea in enumerate(lineas):
            if i in (0, 1, 6):          # estructura de la horca
                resultado.append(f"  {Y}{linea}{RST}")
            else:                        # partes del monigote
                resultado.append(f"  {W}{linea}{RST}")
        return "\n".join(resultado)


# ── Normalización ────────────────────────────────────────────────
_TILDES = str.maketrans("ÁÉÍÓÚÜáéíóúü", "AEIOUUaeiouu")

def normalizar(texto: str) -> str:
    """Elimina tildes y convierte a mayúsculas para la comparación."""
    return texto.translate(_TILDES).upper()


# ── Pantalla ─────────────────────────────────────────────────────
def limpiar():
    os.system("cls" if os.name == "nt" else "clear")


def titulo():
    print(f"""
{M}{BLD}╔══════════════════════════════════════════╗
║   🎭  J U E G O  D E L  A H O R C A D O ║
╚══════════════════════════════════════════╝{RST}""")


def mostrar_tablero(
    errores: int,
    palabra: str,
    letras_usadas: set,
    pista_visible: bool,
    pista: str,
    categoria: str,
    puntos: dict,
) -> None:
    limpiar()
    titulo()

    # Marcador
    print(
        f"  {G}✔ Victorias: {puntos['v']}{RST}  "
        f"{R}✘ Derrotas: {puntos['d']}{RST}  "
        f"{Y}↺ Ronda: {puntos['v'] + puntos['d'] + 1}{RST}"
    )
    print()

    # Monigote
    print(get_figura(errores))
    print()

    # Categoría
    print(f"  {DIM}Categoría: {categoria}{RST}")

    # Palabra oculta
    mostrada = "  ".join(
        f"{G}{BLD}{l}{RST}" if l in letras_usadas else f"{C}_  {RST}"
        for l in palabra
    )
    print(f"\n  {mostrada}")
    print(f"\n  {DIM}({len(palabra)} letras){RST}")

    # Pista
    if pista_visible:
        print(f"\n  {M}💡 Pista: {W}{pista}{RST}")
    else:
        print(f"\n  {B}[Escribe  ?  para revelar la pista]{RST}")

    # Letras usadas
    print()
    aciertos  = sorted(l for l in letras_usadas if l in palabra)
    fallos    = sorted(l for l in letras_usadas if l not in palabra)
    if aciertos:
        print(f"  {G}✔ Aciertos : {' '.join(aciertos)}{RST}")
    if fallos:
        print(f"  {R}✘ Fallos   : {' '.join(fallos)}{RST}")

    # Barra de vida
    vida = MAX_ERRORES - errores
    barra = f"{G}{'█' * vida}{R}{'░' * errores}{RST}"
    print(f"\n  Vidas: {barra}  {Y}{errores}/{MAX_ERRORES} errores{RST}")
    print(f"\n{'─' * 46}")


# ── Bucle de una partida ─────────────────────────────────────────
def jugar(puntos: dict) -> None:
    entrada     = random.choice(PALABRAS)
    original    = entrada["palabra"].upper()
    pista       = entrada["pista"]
    categoria   = entrada["categoria"]

    # Versión sin tildes para el juego
    palabra     = normalizar(original)

    letras_usadas: set = set()
    errores             = 0
    pista_visible       = False

    while True:
        mostrar_tablero(errores, palabra, letras_usadas,
                        pista_visible, pista, categoria, puntos)

        # ── ¿Victoria? ──────────────────────────────────────────
        if all(l in letras_usadas for l in palabra):
            print(f"\n  {G}{BLD}🎉 ¡CORRECTO!  La palabra era: {original}{RST}")
            if pista_visible:
                print(f"  {DIM}(Con pista){RST}")
            puntos["v"] += 1
            _pausa()
            return

        # ── ¿Derrota? ────────────────────────────────────────────
        if errores >= MAX_ERRORES:
            print(f"\n  {R}{BLD}💀 ¡GAME OVER!  La palabra era: {original}{RST}")
            print(f"  {M}Pista: {pista}{RST}")
            puntos["d"] += 1
            _pausa()
            return

        # ── Entrada del jugador ──────────────────────────────────
        try:
            raw = input(f"\n  {W}Letra (o '?' para pista): {RST}").strip()
        except (KeyboardInterrupt, EOFError):
            _salir()

        if not raw:
            continue

        if raw == "?":
            pista_visible = True
            continue

        letra = normalizar(raw[0])

        if not letra.isalpha():
            _aviso("Por favor, introduce una letra del alfabeto.")
            continue

        if letra in letras_usadas:
            _aviso(f"Ya usaste la letra  '{letra}'  antes.")
            continue

        letras_usadas.add(letra)

        if letra not in palabra:
            errores += 1
            parte = _PARTES[errores] if errores <= len(_PARTES) - 1 else ""
            print(f"  {R}✘ '{letra}' no está en la palabra.  +1 error  [{parte}]{RST}")
            _micro_pausa()


# ── Utilidades de UI ─────────────────────────────────────────────
def _aviso(msg: str) -> None:
    print(f"  {Y}⚠  {msg}{RST}")
    _micro_pausa()


def _micro_pausa() -> None:
    """Pausa breve para que el jugador lea el mensaje."""
    import time
    time.sleep(0.8)


def _pausa() -> None:
    try:
        input(f"\n  {DIM}Pulsa Enter para continuar...{RST}")
    except (KeyboardInterrupt, EOFError):
        _salir()


def _salir() -> None:
    limpiar()
    titulo()
    print(f"\n  {M}¡Hasta la próxima!  👋{RST}\n")
    sys.exit(0)


def preguntar_reinicio() -> bool:
    while True:
        try:
            r = input(f"\n  {C}¿Otra ronda? (s / n): {RST}").strip().lower()
        except (KeyboardInterrupt, EOFError):
            return False
        if r in ("s", "si", "sí", "y", "yes"):
            return True
        if r in ("n", "no"):
            return False
        print(f"  {Y}Responde  s  o  n.{RST}")


# ── Punto de entrada ─────────────────────────────────────────────
def main() -> None:
    limpiar()
    titulo()
    print(f"""
  {C}Bienvenido al juego del Ahorcado en español.{RST}

  {W}·{RST} Adivina la palabra letra a letra.
  {W}·{RST} Tienes {BLD}{MAX_ERRORES}{RST} errores antes de perder.
  {W}·{RST} Escribe  {M}?{RST}  para revelar la pista.
  {W}·{RST} Ctrl+C para salir en cualquier momento.
""")
    try:
        input(f"  {Y}Pulsa Enter para empezar... {RST}")
    except (KeyboardInterrupt, EOFError):
        _salir()

    puntos = {"v": 0, "d": 0}

    while True:
        jugar(puntos)
        if not preguntar_reinicio():
            break

    limpiar()
    titulo()
    total = puntos["v"] + puntos["d"]
    pct   = round(puntos["v"] / total * 100) if total else 0
    print(f"""
  {BLD}── Resumen de sesión ──{RST}

  {G}Victorias : {puntos['v']}{RST}
  {R}Derrotas  : {puntos['d']}{RST}
  {Y}Precisión : {pct} %{RST}

  {M}¡Gracias por jugar!  👋{RST}
""")


if __name__ == "__main__":
    main()
