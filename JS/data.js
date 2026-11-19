/**
 * Banco de datos educativos para CYBERLAB EDU 360.
 * Contiene las lecciones, los escenarios simulados de phishing y el cuestionario final.
 */

const LECCIONES_DATA = [
  {
    id: "lec-passwords",
    titulo: "1. Contraseñas Seguras y Autenticación",
    descripcion: "Una contraseña es la llave principal de tu identidad digital. Usar fechas de nacimiento o palabras cortas permite que programas automatizados la adivinen en segundos.",
    consejo: "Usa frases largas (más de 12 caracteres) combinando palabras inesperadas, números y símbolos. Activa siempre la verificación en dos pasos (2FA)."
  },
  {
    id: "lec-phishing",
    titulo: "2. Phishing e Ingeniería Social",
    descripcion: "El phishing es un engaño donde los atacantes se hacen pasar por instituciones conocidas (bancos, escuelas, redes sociales) para robar tus claves mediante mensajes urgentes.",
    consejo: "Desconfía de mensajes que exigen actuar 'de inmediato' o amenazan con bloquear tu cuenta. Revisa siempre la dirección real del remitente."
  },
  {
    id: "lec-malware",
    titulo: "3. Malware y Descargas Seguras",
    descripcion: "El malware (software malicioso) incluye virus, troyanos y ransomware que dañan o secuestran tus archivos. Suele esconderse en programas piratas o adjuntos sospechosos.",
    consejo: "Descarga aplicaciones únicamente desde tiendas oficiales y mantén actualizado tu sistema operativo y antivirus."
  },
  {
    id: "lec-navegacion",
    titulo: "4. Navegación Segura y Redes Wi-Fi",
    descripcion: "Al conectarte a redes Wi-Fi públicas (plazas, cafeterías), otras personas en la misma red podrían interceptar información si los sitios no están cifrados.",
    consejo: "Verifica que las páginas web inicien con HTTPS y muestren el candado de seguridad antes de escribir datos personales o contraseñas."
  },
  {
    id: "lec-privacidad",
    titulo: "5. Privacidad Digital y Huella en Línea",
    descripcion: "Todo lo que publicas en redes sociales forma tu huella digital. Compartir ubicación en tiempo real, credenciales escolares o datos familiares te expone a riesgos.",
    consejo: "Configura tus perfiles como privados y piensa dos veces antes de subir fotografías que muestren documentos, uniformes o direcciones."
  },
  {
    id: "lec-buenas-practicas",
    titulo: "6. Buenas Prácticas y Respaldos",
    descripcion: "Incluso los usuarios más cuidadosos pueden sufrir fallos técnicos o ataques. Tener copias de seguridad evita que pierdas tareas, proyectos y recuerdos importantes.",
    consejo: "Aplica la regla 3-2-1: guarda copias de tus archivos importantes en tu computadora, en una memoria externa y en la nube."
  }
];

const PHISHING_CASOS = [
  {
    remitente: "Soporte Técnico Escolar <soporte@prepa-sistema-edu.com>",
    asunto: "Mantenimiento programado de la plataforma este fin de semana",
    cuerpo: "Hola estudiante. Te informamos que el sábado de 22:00 a 23:00 hrs realizaremos mantenimiento en el portal de calificaciones. No necesitas realizar ninguna acción.",
    textoBoton: "Consultar calendario oficial",
    urlVisible: "https://portal.prepa-sistema-edu.com/avisos",
    esPhishing: false,
    explicacion: "Es un correo legítimo. Es meramente informativo, no pide contraseñas ni datos personales, no mete presión de urgencia y el dominio coincide con la institución."
  },
  {
    remitente: "Seguridad Cuenta <alertas@seguridad-verificacion-cuenta99.xyz>",
    asunto: "¡URGENTE! Tu cuenta será suspendida en 2 horas",
    cuerpo: "Detectamos un inicio de sesión sospechoso. Si no confirmas tu contraseña y número de teléfono ahora mismo, perderás acceso a todas tus fotos y archivos para siempre.",
    textoBoton: "Verificar mi cuenta ahora",
    urlVisible: "http://login-seguro-validar.xyz/acceso",
    esPhishing: true,
    explicacion: "¡Es Phishing! Fíjate en tres señales claras: 1) El remitente usa un dominio extraño (.xyz), 2) Usa amenazas y urgencia extrema para que no pienses, y 3) El enlace no usa HTTPS ni pertenece a un servicio oficial."
  },
  {
    remitente: "Notificaciones Streaming <no-reply@streamplus-oficial.com>",
    asunto: "Problema con tu último pago mensual",
    cuerpo: "Estimado cliente, no pudimos procesar tu renovación. Actualiza los datos de tu tarjeta bancaria en el siguiente enlace para evitar la cancelación del servicio.",
    textoBoton: "Actualizar método de pago",
    urlVisible: "http://streamplus-pagos-rapidos.net/tarjeta",
    esPhishing: true,
    explicacion: "¡Es Phishing! Aunque el remitente parece creíble, el botón dirige a un dominio completamente distinto (.net en lugar de .com) y sin cifrado HTTPS para robar datos bancarios."
  },
  {
    remitente: "Biblioteca Digital <biblioteca@universidad-nacional.edu.mx>",
    asunto: "Recordatorio: Devolución de libro digital",
    cuerpo: "Tu préstamo del libro 'Introducción a las Redes' vence mañana. El sistema lo devolverá automáticamente, o puedes renovarlo ingresando directamente desde la app oficial.",
    textoBoton: "Ir a la Biblioteca",
    urlVisible: "https://biblioteca.universidad-nacional.edu.mx",
    esPhishing: false,
    explicacion: "Es un correo legítimo. Usa un dominio educativo oficial (.edu.mx), utiliza HTTPS y no te pide que envíes contraseñas por correo."
  },
  {
    remitente: "Premios y Sorteos <ganador@regalos-instantaneos-hoy.com>",
    asunto: "¡Felicidades! Ganaste un teléfono nuevo en el sorteo estudiantil",
    cuerpo: "Has sido seleccionado al azar para recibir un smartphone de última generación. Solo debes llenar este formulario con tu CURP, dirección y pagar el envío.",
    textoBoton: "Reclamar mi premio",
    urlVisible: "http://reclama-tu-premio-gratis.com",
    esPhishing: true,
    explicacion: "¡Es Phishing! Si nunca participaste en un sorteo, no puedes ganarlo. Buscan robar tu identidad (CURP y dirección) y tu dinero mediante el pretexto de un falso envío."
  }
];

const QUIZ_PREGUNTAS = [
  {
    pregunta: "¿Cuál de las siguientes opciones representa la contraseña más segura?",
    opciones: [
      "JuanPerez2008",
      "1234567890",
      "TacosDeCanasta!2026#",
      "password123"
    ],
    correcta: 2,
    explicacion: "'TacosDeCanasta!2026#' supera los 12 caracteres y combina mayúsculas, minúsculas, números y símbolos sin usar datos personales obvios."
  },
  {
    pregunta: "¿Qué es el 'Phishing'?",
    opciones: [
      "Un programa para acelerar la conexión Wi-Fi.",
      "Una técnica de engaño mediante mensajes falsos para robar contraseñas o datos personales.",
      "Una copia de seguridad automática en la nube.",
      "Un tipo de cable de red de alta velocidad."
    ],
    correcta: 1,
    explicacion: "El phishing suplanta la identidad de empresas o personas de confianza para engañar a la víctima y obtener información confidencial."
  },
  {
    pregunta: "¿Qué debes verificar en la barra de direcciones antes de ingresar datos personales en un sitio web?",
    opciones: [
      "Que la página tenga muchos colores y animaciones.",
      "Que la dirección comience con HTTPS y muestre el ícono del candado.",
      "Que el sitio tenga ventanas emergentes de publicidad.",
      "No es necesario revisar nada si el enlace llegó por correo."
    ],
    correcta: 1,
    explicacion: "HTTPS garantiza que la comunicación entre tu navegador y el sitio web viaja cifrada."
  },
  {
    pregunta: "¿Para qué sirve la autenticación en dos pasos (2FA)?",
    opciones: [
      "Para escribir la contraseña dos veces seguidas.",
      "Para añadir una segunda capa de protección (como un código temporal en tu celular) además de tu contraseña.",
      "Para compartir tu cuenta con dos amigos al mismo tiempo.",
      "Para eliminar virus automáticamente de la computadora."
    ],
    correcta: 1,
    explicacion: "Con 2FA, aunque alguien descubra tu contraseña, no podrá entrar a tu cuenta sin el segundo factor de verificación."
  },
  {
    pregunta: "Si recibes un correo urgente diciendo que tu cuenta será borrada si no haces clic en un enlace, ¿qué debes hacer?",
    opciones: [
      "Hacer clic rápido e ingresar tu contraseña antes de que la borren.",
      "Reenviar el correo a todos tus contactos para advertirles.",
      "No hacer clic en el enlace; abrir el navegador y entrar directamente al sitio oficial para verificar.",
      "Responder al correo enviando tu usuario y clave para que confirmen que eres tú."
    ],
    correcta: 2,
    explicacion: "Nunca uses los enlaces de correos sospechosos. Ingresa siempre por tu cuenta desde la página oficial o aplicación."
  }
];