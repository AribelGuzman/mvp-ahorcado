/**
 * palabras.js — Banco de 100 palabras en español con pistas y categorías.
 *
 * Categorías definitivas:
 *   Animales · Naturaleza · Lugares · Objetos · Comida
 *   Arte · Deportes · Tecnología · Profesiones · Ciencia
 *
 * Niveles de dificultad (longitud normalizada sin tildes):
 *   Fácil   → ≤ 6 letras
 *   Normal  → 7 – 9 letras
 *   Difícil → ≥ 10 letras
 */
export const PALABRAS = [

  // ── ANIMALES ───────────────────────────────────────────────────
  { palabra: "MARIPOSA",   pista: "Insecto con alas coloridas que nace de una oruga",              categoria: "Animales"  },
  { palabra: "ELEFANTE",   pista: "El animal terrestre más grande; tiene trompa",                   categoria: "Animales"  },
  { palabra: "DELFIN",     pista: "Mamífero marino muy inteligente y saltarín",                     categoria: "Animales"  },
  { palabra: "COCODRILO",  pista: "Reptil de gran tamaño con mandíbulas muy poderosas",             categoria: "Animales"  },
  { palabra: "MURCIELAGO", pista: "Único mamífero volador que caza de noche con ecolocalización",   categoria: "Animales"  },
  { palabra: "PINGUINO",   pista: "Ave que no puede volar y vive en zonas muy frías",               categoria: "Animales"  },
  { palabra: "JIRAFA",     pista: "Animal africano con el cuello más largo del mundo",              categoria: "Animales"  },
  { palabra: "KOALA",      pista: "Marsupial australiano que vive en árboles de eucalipto",         categoria: "Animales"  },
  { palabra: "PULPO",      pista: "Animal marino con ocho tentáculos y gran inteligencia",          categoria: "Animales"  },
  { palabra: "ZORRO",      pista: "Animal astuto de orejas puntiagudas y cola peluda",              categoria: "Animales"  },
  { palabra: "CAMALEON",   pista: "Reptil que cambia de color para camuflarse",                     categoria: "Animales"  },
  { palabra: "TIBURON",    pista: "Gran pez depredador con hileras de dientes afilados",            categoria: "Animales"  },
  { palabra: "FLAMENCO",   pista: "Ave zancuda de plumaje rosa que vive en lagunas",                categoria: "Animales"  },
  { palabra: "PANGOLIN",   pista: "Mamífero cubierto de escamas que se enrolla en bola",            categoria: "Animales"  },
  { palabra: "CAPIBARA",   pista: "El roedor más grande del mundo, semiacuático",                   categoria: "Animales"  },

  // ── NATURALEZA ─────────────────────────────────────────────────
  { palabra: "VOLCAN",     pista: "Montaña que puede expulsar lava y ceniza",                       categoria: "Naturaleza"},
  { palabra: "ARCOIRIS",   pista: "Arco de siete colores que aparece tras la lluvia",               categoria: "Naturaleza"},
  { palabra: "TSUNAMI",    pista: "Ola gigante causada por un terremoto submarino",                  categoria: "Naturaleza"},
  { palabra: "HURACAN",    pista: "Tormenta tropical de vientos violentos en espiral",              categoria: "Naturaleza"},
  { palabra: "TORNADO",    pista: "Columna de aire giratoria y muy destructiva",                    categoria: "Naturaleza"},
  { palabra: "TERREMOTO",  pista: "Temblor de tierra por movimientos de placas tectónicas",         categoria: "Naturaleza"},
  { palabra: "ECLIPSE",    pista: "Fenómeno en el que un astro tapa la luz de otro",                categoria: "Naturaleza"},
  { palabra: "GLACIAR",    pista: "Masa de hielo que avanza lentamente por una montaña",            categoria: "Naturaleza"},
  { palabra: "TIFON",      pista: "Ciclón tropical propio del océano Pacífico",                     categoria: "Naturaleza"},
  { palabra: "AVALANCHA",  pista: "Masa de nieve o rocas que cae por una montaña",                  categoria: "Naturaleza"},
  { palabra: "ORQUIDEA",   pista: "Flor exótica y elegante de formas muy llamativas",               categoria: "Naturaleza"},
  { palabra: "GIRASOL",    pista: "Flor amarilla gigante que siempre mira hacia el sol",            categoria: "Naturaleza"},
  { palabra: "CACTUS",     pista: "Planta del desierto que almacena agua y tiene espinas",          categoria: "Naturaleza"},
  { palabra: "MANGLAR",    pista: "Bosque de raíces entrelazadas que crece en zonas costeras",      categoria: "Naturaleza"},
  { palabra: "ESTALACTITA",pista: "Formación mineral que cuelga del techo de una cueva",            categoria: "Naturaleza"},

  // ── LUGARES ────────────────────────────────────────────────────
  { palabra: "BIBLIOTECA", pista: "Lugar donde puedes leer y pedir prestados libros",               categoria: "Lugares"   },
  { palabra: "CASTILLO",   pista: "Construcción medieval de piedra con torres y almenas",           categoria: "Lugares"   },
  { palabra: "PIRAMIDE",   pista: "Construcción antigua con base cuadrada y forma triangular",      categoria: "Lugares"   },
  { palabra: "LABERINTO",  pista: "Red de caminos difíciles de los que cuesta salir",               categoria: "Lugares"   },
  { palabra: "METROPOLI",  pista: "Ciudad enorme con millones de habitantes",                       categoria: "Lugares"   },
  { palabra: "ACUARIO",    pista: "Lugar donde se exhiben animales marinos en grandes tanques",     categoria: "Lugares"   },
  { palabra: "PLANETARIO", pista: "Edificio con cúpula donde se proyectan las estrellas",           categoria: "Lugares"   },
  { palabra: "CATEDRAL",   pista: "Iglesia principal de una diócesis, de gran tamaño",              categoria: "Lugares"   },
  { palabra: "ANFITEATRO", pista: "Recinto circular romano donde se celebraban espectáculos",       categoria: "Lugares"   },
  { palabra: "FARO",       pista: "Torre luminosa que guía a los barcos en la costa",               categoria: "Lugares"   },
  { palabra: "ACROPOLIS",  pista: "Ciudad alta de la antigua Grecia; la más famosa está en Atenas", categoria: "Lugares"   },
  { palabra: "COLISEO",    pista: "Anfiteatro romano donde luchaban los gladiadores",               categoria: "Lugares"   },
  { palabra: "MEZQUITA",   pista: "Templo de culto islámico con minaretes y cúpula",                categoria: "Lugares"   },
  { palabra: "MAUSOLEO",   pista: "Tumba monumental construida en honor a una persona importante",  categoria: "Lugares"   },
  { palabra: "ACUEDUCTO",  pista: "Construcción romana para transportar agua desde lejos",          categoria: "Lugares"   },

  // ── OBJETOS ────────────────────────────────────────────────────
  { palabra: "PARAGUAS",   pista: "Lo abres para protegerte cuando llueve",                         categoria: "Objetos"   },
  { palabra: "BRUJULA",    pista: "Instrumento de navegación que siempre apunta al norte",          categoria: "Objetos"   },
  { palabra: "ESPEJO",     pista: "Superficie pulida que refleja tu imagen",                        categoria: "Objetos"   },
  { palabra: "MALETA",     pista: "Bolsa rígida con ruedas que llevas de viaje",                    categoria: "Objetos"   },
  { palabra: "TELESCOPIO", pista: "Instrumento óptico que permite ver objetos muy lejanos",         categoria: "Objetos"   },
  { palabra: "MICROSCOPIO",pista: "Instrumento óptico que amplía objetos muy pequeños",             categoria: "Objetos"   },
  { palabra: "HELICOPTERO",pista: "Aeronave que vuela gracias a grandes aspas giratorias",          categoria: "Objetos"   },
  { palabra: "SUBMARINO",  pista: "Vehículo naval que puede navegar bajo el agua",                  categoria: "Objetos"   },
  { palabra: "PARACAIDAS", pista: "Dispositivo en forma de tela que frena la caída libre",          categoria: "Objetos"   },
  { palabra: "XILOFONO",   pista: "Instrumento de percusión con barras de madera de colores",       categoria: "Objetos"   },

  // ── COMIDA ────────────────────────────────────────────────────
  { palabra: "CHOCOLATE",  pista: "Dulce oscuro elaborado con semillas de cacao",                   categoria: "Comida"    },
  { palabra: "MERMELADA",  pista: "Conserva dulce elaborada con fruta cocida y azúcar",             categoria: "Comida"    },
  { palabra: "AGUACATE",   pista: "Fruta tropical de pulpa cremosa y color verde",                  categoria: "Comida"    },
  { palabra: "ALCACHOFA",  pista: "Verdura con forma de flor y hojas terminadas en punta",          categoria: "Comida"    },
  { palabra: "ALMENDRA",   pista: "Fruto seco de cáscara dura muy usado en repostería",             categoria: "Comida"    },
  { palabra: "CANGREJO",   pista: "Crustáceo con pinzas que camina de lado",                        categoria: "Comida"    },
  { palabra: "ESPINACA",   pista: "Verdura de hojas verdes oscuras muy valorada por su hierro",     categoria: "Comida"    },
  { palabra: "MANZANA",    pista: "Fruta redonda que puede ser roja, verde o amarilla",             categoria: "Comida"    },
  { palabra: "FRAMBUESA",  pista: "Pequeña fruta roja formada por múltiples gránulos",              categoria: "Comida"    },
  { palabra: "SANDIA",     pista: "Fruta enorme de corteza verde e interior rojo y dulce",          categoria: "Comida"    },
  { palabra: "PIMIENTA",   pista: "Especia picante que se usa en granos negros o molida",           categoria: "Comida"    },

  // ── ARTE ──────────────────────────────────────────────────────
  { palabra: "FOTOGRAFIA", pista: "Imagen capturada con una cámara en un instante",                 categoria: "Arte"      },
  { palabra: "ROMPECABEZAS",pista:"Juego de piezas encajables para formar una imagen",              categoria: "Arte"      },
  { palabra: "ESCULTURA",  pista: "Arte de crear formas tridimensionales en piedra, metal o madera",categoria: "Arte"      },
  { palabra: "ACUARELA",   pista: "Técnica pictórica con pigmentos diluidos en agua",               categoria: "Arte"      },
  { palabra: "CERAMICA",   pista: "Arte de modelar objetos con arcilla y cocerlos en horno",        categoria: "Arte"      },
  { palabra: "ORIGAMI",    pista: "Arte japonés de crear figuras doblando papel sin cortar",        categoria: "Arte"      },
  { palabra: "MOSAICO",    pista: "Decoración artística elaborada con pequeñas piezas de colores",  categoria: "Arte"      },
  { palabra: "NOVELA",     pista: "Obra literaria de ficción en prosa de gran extensión",           categoria: "Arte"      },
  { palabra: "SINFONIA",   pista: "Gran composición musical para orquesta completa",                categoria: "Arte"      },
  { palabra: "BALLET",     pista: "Danza clásica de movimientos elegantes y precisos",              categoria: "Arte"      },
  { palabra: "CARICATURA", pista: "Dibujo que exagera los rasgos de alguien con humor",             categoria: "Arte"      },
  { palabra: "TATUAJE",    pista: "Diseño permanente dibujado bajo la piel con tinta",              categoria: "Arte"      },

  // ── DEPORTES ─────────────────────────────────────────────────
  { palabra: "FUTBOL",     pista: "El deporte de equipo más popular del mundo",                     categoria: "Deportes"  },
  { palabra: "NATACION",   pista: "Deporte acuático que ejercita todo el cuerpo",                   categoria: "Deportes"  },
  { palabra: "ESCALADA",   pista: "Deporte de ascender paredes de roca o artificiales",             categoria: "Deportes"  },
  { palabra: "CICLISMO",   pista: "Deporte de competición que se practica sobre una bicicleta",     categoria: "Deportes"  },
  { palabra: "AJEDREZ",    pista: "Juego de estrategia con 32 piezas en un tablero de 64 casillas", categoria: "Deportes"  },
  { palabra: "ATLETISMO",  pista: "Disciplinas de carreras, saltos y lanzamientos",                 categoria: "Deportes"  },
  { palabra: "ESGRIMA",    pista: "Deporte de combate con espadas, floretes o sables",              categoria: "Deportes"  },
  { palabra: "BALONCESTO", pista: "Deporte donde se encesta un balón en una canasta elevada",       categoria: "Deportes"  },
  { palabra: "PARAPENTE",  pista: "Deporte de vuelo libre planeando con una vela alar",             categoria: "Deportes"  },
  { palabra: "PATINAJE",   pista: "Deporte que se practica deslizándose sobre ruedas o hielo",     categoria: "Deportes"  },

  // ── TECNOLOGÍA ───────────────────────────────────────────────
  { palabra: "ORDENADOR",  pista: "Máquina electrónica de procesamiento de datos e información",    categoria: "Tecnología"},
  { palabra: "INTERNET",   pista: "Red mundial que conecta millones de ordenadores",                categoria: "Tecnología"},
  { palabra: "SATELITE",   pista: "Objeto artificial que orbita la Tierra y transmite señales",     categoria: "Tecnología"},
  { palabra: "ROBOT",      pista: "Máquina programada para realizar tareas de forma autónoma",      categoria: "Tecnología"},
  { palabra: "COHETE",     pista: "Vehículo de propulsión que puede llegar al espacio exterior",    categoria: "Tecnología"},
  { palabra: "ALGORITMO",  pista: "Conjunto de pasos lógicos y ordenados para resolver un problema",categoria: "Tecnología"},
  { palabra: "PANTALLA",   pista: "Superficie donde se visualizan imágenes en un dispositivo",      categoria: "Tecnología"},
  { palabra: "IMPRESORA",  pista: "Periférico que transfiere documentos digitales al papel",        categoria: "Tecnología"},
  { palabra: "BATERIA",    pista: "Dispositivo que almacena y suministra energía eléctrica",        categoria: "Tecnología"},
  { palabra: "VIDEOJUEGO", pista: "Entretenimiento interactivo que se experimenta en una pantalla", categoria: "Tecnología"},

  // ── PROFESIONES ──────────────────────────────────────────────
  { palabra: "ARQUITECTO", pista: "Profesional que diseña edificios y planifica espacios urbanos",  categoria: "Profesiones"},
  { palabra: "VETERINARIO",pista: "Médico especializado en la salud y tratamiento de animales",     categoria: "Profesiones"},
  { palabra: "APICULTOR",  pista: "Persona que cuida colmenas y extrae miel de abejas",             categoria: "Profesiones"},
  { palabra: "ASTRONOMO",  pista: "Científico que estudia los astros, planetas y el universo",      categoria: "Profesiones"},
  { palabra: "BOMBERO",    pista: "Profesional que combate incendios y rescata personas en peligro",categoria: "Profesiones"},
  { palabra: "CIRUJANO",   pista: "Médico especializado en realizar operaciones quirúrgicas",       categoria: "Profesiones"},
  { palabra: "GEOLOGO",    pista: "Científico que estudia la composición y estructura de la Tierra",categoria: "Profesiones"},
  { palabra: "MARINERO",   pista: "Persona que trabaja a bordo de un barco en alta mar",            categoria: "Profesiones"},
  { palabra: "CARTOGRAFO", pista: "Especialista que elabora mapas y representaciones del territorio",categoria: "Profesiones"},
  { palabra: "LINGUISTA",  pista: "Científico que estudia los idiomas y su estructura formal",      categoria: "Profesiones"},

  // ── CIENCIA ───────────────────────────────────────────────────
  { palabra: "DINOSAURIO", pista: "Animal prehistórico extinto hace 66 millones de años",           categoria: "Ciencia"   },
  { palabra: "ASTRONAUTA", pista: "Persona entrenada para viajar y trabajar en el espacio",         categoria: "Ciencia"   },
  { palabra: "UNIVERSO",   pista: "Todo lo que existe: galaxias, estrellas y planetas",             categoria: "Ciencia"   },
  { palabra: "GRAVEDAD",   pista: "Fuerza que atrae los cuerpos hacia el centro de la Tierra",      categoria: "Ciencia"   },
  { palabra: "MOLECULA",   pista: "Agrupación de átomos que forma la unidad básica de una sustancia",categoria: "Ciencia"  },
  { palabra: "EVOLUCION",  pista: "Proceso por el que las especies cambian a lo largo del tiempo",  categoria: "Ciencia"   },
  { palabra: "QUASAR",     pista: "Núcleo galáctico muy luminoso situado a miles de millones de años luz", categoria: "Ciencia" },
  { palabra: "CROMOSOMA",  pista: "Estructura celular que contiene el material genético",           categoria: "Ciencia"   },
  { palabra: "AGUJERO",    pista: "Región del espacio con gravedad tan intensa que nada escapa",    categoria: "Ciencia"   }, // AGUJERO NEGRO — too complex, use AGUJERO
  { palabra: "NEUTRINO",   pista: "Partícula subatómica con masa casi nula que atraviesa la materia",categoria: "Ciencia"  },

];
