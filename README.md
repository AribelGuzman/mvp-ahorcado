# 🎭 Ahorcado — MVP

Juego clásico del ahorcado en la terminal, con palabras en español.

## Características

| Característica | Detalle |
|---|---|
| Palabras | 50 palabras en español con pistas y categorías |
| Errores | 6 intentos antes de perder |
| Monigote | ASCII animado con 6 etapas (cabeza → piernas) |
| Pistas | Disponibles bajo demanda (`?`) |
| Colores | Interfaz ANSI en color (terminales compatibles) |
| Puntuación | Victorias / Derrotas acumuladas por sesión |

## Instalación y ejecución

Sólo necesitas **Python 3.7+**, sin dependencias externas.

```bash
# Clonar / entrar al directorio
cd mvp-ahorcado

# Ejecutar
python3 ahorcado.py
```

## Cómo jugar

1. Se muestra la categoría y la longitud de la palabra oculta.
2. Escribe una letra y pulsa **Enter**.
3. Si la letra está en la palabra, se revela en su posición.
4. Si no está, se añade una parte al monigote.
5. Escribe **`?`** para ver la pista (no cuenta como error).
6. Ganas si adivinas la palabra antes de los 6 errores.

## Estructura del proyecto

```
mvp-ahorcado/
├── ahorcado.py      # Lógica principal del juego
├── palabras.py      # Banco de 50 palabras con pistas
└── README.md
```

## Categorías de palabras

- 🐾 Animales (10)
- 🌋 Naturaleza y fenómenos (10)
- 🏰 Lugares y construcciones (10)
- 🔭 Objetos y tecnología (10)
- 🧬 Ciencia, cultura y más (10)

## Capturas ASCII

```
  +---+
  |   |
  O   |
 /|\  |
 /    |        P _ L P _ _ _ _ _
      |
=========      5 letras  ·  Animales
               💡 Pista: Animal marino con ocho tentáculos
```

---

*mvp-ahorcado · v1.0 · Python 3 · sin dependencias*
