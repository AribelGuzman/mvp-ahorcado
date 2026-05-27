"""
palabras.py — Banco de 50 palabras en español con pistas
para el juego del Ahorcado (mvp-ahorcado).
"""

PALABRAS = [
    # ── Animales ───────────────────────────────────────────────────
    {"palabra": "MARIPOSA",     "pista": "Insecto con alas coloridas que nace de una oruga",        "categoria": "Animales"},
    {"palabra": "ELEFANTE",     "pista": "El animal terrestre más grande; tiene trompa",             "categoria": "Animales"},
    {"palabra": "DELFIN",       "pista": "Mamífero marino muy inteligente y saltarín",               "categoria": "Animales"},
    {"palabra": "COCODRILO",    "pista": "Reptil de gran tamaño con mandíbulas muy poderosas",       "categoria": "Animales"},
    {"palabra": "MURCIELAGO",   "pista": "Único mamífero volador que caza de noche con ecolocalización","categoria": "Animales"},
    {"palabra": "PINGUINO",     "pista": "Ave que no puede volar y vive en zonas muy frías",         "categoria": "Animales"},
    {"palabra": "JIRAFA",       "pista": "Animal africano con el cuello más largo del mundo",        "categoria": "Animales"},
    {"palabra": "KOALA",        "pista": "Marsupial australiano que vive en árboles de eucalipto",   "categoria": "Animales"},
    {"palabra": "PULPO",        "pista": "Animal marino con ocho tentáculos y gran inteligencia",    "categoria": "Animales"},
    {"palabra": "ZORRO",        "pista": "Animal astuto de orejas puntiagudas y cola peluda",        "categoria": "Animales"},

    # ── Naturaleza y fenómenos ─────────────────────────────────────
    {"palabra": "VOLCAN",       "pista": "Montaña que puede expulsar lava y ceniza",                 "categoria": "Naturaleza"},
    {"palabra": "ARCOIRIS",     "pista": "Arco de siete colores que aparece tras la lluvia",         "categoria": "Naturaleza"},
    {"palabra": "TSUNAMI",      "pista": "Ola gigante causada por un terremoto submarino",           "categoria": "Naturaleza"},
    {"palabra": "HURACAN",      "pista": "Tormenta tropical de vientos violentos en espiral",        "categoria": "Naturaleza"},
    {"palabra": "TORNADO",      "pista": "Columna de aire giratoria y muy destructiva",              "categoria": "Naturaleza"},
    {"palabra": "TERREMOTO",    "pista": "Temblor de tierra por movimientos de placas tectónicas",   "categoria": "Naturaleza"},
    {"palabra": "ECLIPSE",      "pista": "Fenómeno en el que un astro tapa la luz de otro",          "categoria": "Naturaleza"},
    {"palabra": "GLACIAR",      "pista": "Masa de hielo que avanza lentamente por una montaña",      "categoria": "Naturaleza"},
    {"palabra": "TIFON",        "pista": "Ciclón tropical propio del océano Pacífico",               "categoria": "Naturaleza"},
    {"palabra": "AVALANCHA",    "pista": "Masa de nieve o rocas que cae por una montaña",            "categoria": "Naturaleza"},

    # ── Lugares y construcciones ───────────────────────────────────
    {"palabra": "BIBLIOTECA",   "pista": "Lugar donde puedes leer y pedir prestados libros",         "categoria": "Lugares"},
    {"palabra": "CASTILLO",     "pista": "Construcción medieval de piedra con torres y almenas",     "categoria": "Lugares"},
    {"palabra": "PIRAMIDE",     "pista": "Construcción antigua con base cuadrada y forma triangular","categoria": "Lugares"},
    {"palabra": "LABERINTO",    "pista": "Red de caminos difíciles de los que cuesta salir",         "categoria": "Lugares"},
    {"palabra": "METROPOLI",    "pista": "Ciudad enorme con millones de habitantes",                 "categoria": "Lugares"},
    {"palabra": "ACUARIO",      "pista": "Lugar donde se exhiben animales marinos en grandes tanques","categoria": "Lugares"},
    {"palabra": "PLANETARIO",   "pista": "Edificio con cúpula donde se proyectan las estrellas",     "categoria": "Lugares"},
    {"palabra": "CATEDRAL",     "pista": "Iglesia principal de una diócesis, de gran tamaño",        "categoria": "Lugares"},
    {"palabra": "ANFITEATRO",   "pista": "Recinto circular romano donde se celebraban espectáculos", "categoria": "Lugares"},
    {"palabra": "FARO",         "pista": "Torre luminosa que guía a los barcos en la costa",         "categoria": "Lugares"},

    # ── Objetos cotidianos y tecnología ───────────────────────────
    {"palabra": "PARAGUAS",     "pista": "Lo abres para protegerte cuando llueve",                   "categoria": "Objetos"},
    {"palabra": "BRUJULA",      "pista": "Instrumento de navegación que siempre apunta al norte",    "categoria": "Objetos"},
    {"palabra": "ESPEJO",       "pista": "Superficie pulida que refleja tu imagen",                  "categoria": "Objetos"},
    {"palabra": "MALETA",       "pista": "Bolsa rígida con ruedas que llevas de viaje",              "categoria": "Objetos"},
    {"palabra": "TELESCOPIO",   "pista": "Instrumento óptico que permite ver objetos muy lejanos",   "categoria": "Objetos"},
    {"palabra": "MICROSCOPIO",  "pista": "Instrumento óptico que amplía objetos muy pequeños",       "categoria": "Objetos"},
    {"palabra": "HELICOPTERO",  "pista": "Aeronave que vuela gracias a grandes aspas giratorias",    "categoria": "Objetos"},
    {"palabra": "SUBMARINO",    "pista": "Vehículo naval que puede navegar bajo el agua",            "categoria": "Objetos"},
    {"palabra": "PARACAIDAS",   "pista": "Dispositivo en forma de tela que frena la caída libre",    "categoria": "Objetos"},
    {"palabra": "XILOFONO",     "pista": "Instrumento de percusión con barras de madera de colores", "categoria": "Objetos"},

    # ── Ciencia, cultura y más ─────────────────────────────────────
    {"palabra": "DINOSAURIO",   "pista": "Animal prehistórico extinto hace 66 millones de años",     "categoria": "Ciencia"},
    {"palabra": "ASTRONAUTA",   "pista": "Persona entrenada para viajar y trabajar en el espacio",   "categoria": "Ciencia"},
    {"palabra": "UNIVERSO",     "pista": "Todo lo que existe: galaxias, estrellas y planetas",       "categoria": "Ciencia"},
    {"palabra": "ROMPECABEZAS", "pista": "Juego de piezas encajables para formar una imagen",        "categoria": "Juegos"},
    {"palabra": "CHOCOLATE",    "pista": "Dulce oscuro elaborado con semillas de cacao",             "categoria": "Comida"},
    {"palabra": "ORQUIDEA",     "pista": "Flor exótica y elegante de formas muy llamativas",         "categoria": "Plantas"},
    {"palabra": "GIRASOL",      "pista": "Flor amarilla gigante que siempre mira hacia el sol",      "categoria": "Plantas"},
    {"palabra": "CACTUS",       "pista": "Planta del desierto que almacena agua y tiene espinas",    "categoria": "Plantas"},
    {"palabra": "FLAMENCO",     "pista": "Baile español típico de Andalucía con palmas y tacones",   "categoria": "Cultura"},
    {"palabra": "FOTOGRAFIA",   "pista": "Imagen capturada con una cámara en un instante",           "categoria": "Arte"},
]
