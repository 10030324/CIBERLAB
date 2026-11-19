/**
 * Lógica principal de CYBERLAB EDU 360
 * Gestiona la navegación, estado en localStorage, simuladores y evaluación.
 */

// Estado inicial del estudiante
const ESTADO_INICIAL = {
  leccionesCompletadas: [], // Array de IDs de lecciones
  phishingCompletado: false,
  phishingMejorPuntaje: 0,
  contrasenasProbadas: false,
  quizCompletado: false,
  quizPuntaje: 0
};

let estadoUsuario = cargarProgreso();

// Variables de control para el simulador de phishing
let indiceCorreoActual = 0;
let aciertosPhishing = 0;

// Inicialización al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  configurarNavegacion();
  renderizarLecciones();
  cargarCasoPhishing(0);
  configurarMedidorContrasenas();
  renderizarCuestionario();
  actualizarUIProgreso();

  // Botón para reiniciar progreso
  document.getElementById("btn-reset-progress").addEventListener("click", () => {
    if (confirm("¿Seguro que deseas borrar todo tu progreso guardado?")) {
      localStorage.removeItem("cyberlab_edu_360_progreso");
      estadoUsuario = JSON.parse(JSON.stringify(ESTADO_INICIAL));
      location.reload();
    }
  });
});

/* =========================================================
   1. GESTIÓN DE PROGRESO (localStorage)
   ========================================================= */
function cargarProgreso() {
  const guardado = localStorage.getItem("cyberlab_edu_360_progreso");
  if (guardado) {
    try {
      return { ...ESTADO_INICIAL, ...JSON.parse(guardado) };
    } catch (e) {
      console.error("Error leyendo progreso local:", e);
    }
  }
  return JSON.parse(JSON.stringify(ESTADO_INICIAL));
}

function guardarProgreso() {
  localStorage.setItem("cyberlab_edu_360_progreso", JSON.stringify(estadoUsuario));
  actualizarUIProgreso();
}

function actualizarUIProgreso() {
  // Cálculo ponderado de avance (4 módulos principales = 25% cada uno)
  let porcentaje = 0;

  // 1. Lecciones (hasta 25%)
  const ratioLecciones = estadoUsuario.leccionesCompletadas.length / LECCIONES_DATA.length;
  porcentaje += Math.round(ratioLecciones * 25);

  // 2. Simulador Phishing (25%)
  if (estadoUsuario.phishingCompletado) porcentaje += 25;

  // 3. Medidor de Contraseñas (25%)
  if (estadoUsuario.contrasenasProbadas) porcentaje += 25;

  // 4. Cuestionario Final (25%)
  if (estadoUsuario.quizCompletado) porcentaje += 25;

  // Actualizar barra superior
  document.getElementById("progress-text").textContent = `Progreso: ${porcentaje}%`;
  document.getElementById("progress-fill").style.width = `${porcentaje}%`;

  // Actualizar etiquetas en las tarjetas de Inicio
  actualizarBadge("badge-lecciones", estadoUsuario.leccionesCompletadas.length === LECCIONES_DATA.length, 
    `${estadoUsuario.leccionesCompletadas.length}/${LECCIONES_DATA.length} leídas`);
  actualizarBadge("badge-phishing", estadoUsuario.phishingCompletado, "Completado");
  actualizarBadge("badge-contrasenas", estadoUsuario.contrasenasProbadas, "Completado");
  actualizarBadge("badge-cuestionario", estadoUsuario.quizCompletado, `Nota: ${estadoUsuario.quizPuntaje}/${QUIZ_PREGUNTAS.length}`);
}

function actualizarBadge(elementId, completado, textoCompletado) {
  const el = document.getElementById(elementId);
  if (!el) return;
  if (completado) {
    el.textContent = `✓ ${textoCompletado}`;
    el.classList.add("completed");
  } else {
    el.textContent = textoCompletado.includes("/") ? textoCompletado : "Pendiente";
    el.classList.remove("completed");
  }
}

/* =========================================================
   2. NAVEGACIÓN ENTRE VISTAS
   ========================================================= */
function configurarNavegacion() {
  const botones = document.querySelectorAll(".nav-btn");
  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const destino = btn.getAttribute("data-target");
      navegarA(destino);
    });
  });
}

function navegarA(vistaId) {
  // Ocultar todas las vistas
  document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
  // Desactivar botones
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

  // Mostrar vista seleccionada
  const vistaObjetivo = document.getElementById(`view-${vistaId}`);
  if (vistaObjetivo) vistaObjetivo.classList.add("active");

  // Activar botón correspondiente
  const btnObjetivo = document.querySelector(`.nav-btn[data-target="${vistaId}"]`);
  if (btnObjetivo) btnObjetivo.classList.add("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================
   3. MÓDULO EDUCATIVO (LECCIONES)
   ========================================================= */
function renderizarLecciones() {
  const contenedor = document.getElementById("lessons-container");
  contenedor.innerHTML = "";

  LECCIONES_DATA.forEach(lec => {
    const estaCompletada = estadoUsuario.leccionesCompletadas.includes(lec.id);
    const card = document.createElement("article");
    card.className = `lesson-card ${estaCompletada ? "done" : ""}`;

    card.innerHTML = `
      <div>
        <h3>${lec.titulo}</h3>
        <p>${lec.descripcion}</p>
        <div class="lesson-tip">
          <strong>💡 Consejo práctico:</strong> ${lec.consejo}
        </div>
      </div>
      <button class="btn ${estaCompletada ? "btn-outline" : "btn-primary"}" onclick="alternarLeccion('${lec.id}')">
        ${estaCompletada ? "✓ Lección Completada" : "Marcar como Leída"}
      </button>
    `;
    contenedor.appendChild(card);
  });
}

function alternarLeccion(id) {
  const index = estadoUsuario.leccionesCompletadas.indexOf(id);
  if (index === -1) {
    estadoUsuario.leccionesCompletadas.push(id);
  } else {
    estadoUsuario.leccionesCompletadas.splice(index, 1);
  }
  guardarProgreso();
  renderizarLecciones();
}

/* =========================================================
   4. SIMULADOR DE PHISHING
   ========================================================= */
function cargarCasoPhishing(indice) {
  const visor = document.getElementById("email-viewer");
  const feedback = document.getElementById("phishing-feedback");
  const controles = document.getElementById("phishing-controls");

  feedback.classList.add("hidden");
  controles.classList.remove("hidden");

  // Si ya terminó todos los correos
  if (indice >= PHISHING_CASOS.length) {
    estadoUsuario.phishingCompletado = true;
    if (aciertosPhishing > estadoUsuario.phishingMejorPuntaje) {
      estadoUsuario.phishingMejorPuntaje = aciertosPhishing;
    }
    guardarProgreso();

    visor.innerHTML = `
      <div style="text-align:center; padding: 1.5rem;">
        <h3>🎉 ¡Simulación Finalizada!</h3>
        <p style="margin: 1rem 0;">Lograste identificar correctamente <strong>${aciertosPhishing} de ${PHISHING_CASOS.length}</strong> correos.</p>
        <button class="btn btn-primary" onclick="reiniciarSimuladorPhishing()">Practicar de Nuevo</button>
      </div>
    `;
    controles.classList.add("hidden");
    return;
  }

  const caso = PHISHING_CASOS[indice];
  document.getElementById("phishing-counter").textContent = `Correo ${indice + 1} de ${PHISHING_CASOS.length}`;
  document.getElementById("phishing-score").textContent = `Aciertos: ${aciertosPhishing}`;

  visor.innerHTML = `
    <div class="email-meta">
      <div><strong>De:</strong> ${escaparHTML(caso.remitente)}</div>
      <div><strong>Asunto:</strong> ${escaparHTML(caso.asunto)}</div>
    </div>
    <div class="email-body">
      <p>${escaparHTML(caso.cuerpo)}</p>
      <a href="javascript:void(0)" class="email-fake-link" title="Destino real: ${escaparHTML(caso.urlVisible)}">
        ${escaparHTML(caso.textoBoton)}
      </a>
      <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
        🔍 Vista previa del enlace: <code>${escaparHTML(caso.urlVisible)}</code>
      </p>
    </div>
  `;
}

function evaluarCorreo(usuarioDiceEsPhishing) {
  const caso = PHISHING_CASOS[indiceCorreoActual];
  const esCorrecto = (usuarioDiceEsPhishing === caso.esPhishing);

  if (esCorrecto) aciertosPhishing++;

  const feedback = document.getElementById("phishing-feedback");
  const controles = document.getElementById("phishing-controls");

  controles.classList.add("hidden");
  feedback.classList.remove("hidden", "correct", "incorrect");
  feedback.classList.add(esCorrecto ? "correct" : "incorrect");

  feedback.innerHTML = `
    <h4>${esCorrecto ? "✅ ¡Excelente deducción!" : "❌ ¡Cuidado! Caíste en la trampa"}</h4>
    <p style="margin: 0.75rem 0;">${caso.explicacion}</p>
    <button class="btn btn-primary" onclick="siguienteCorreo()">Siguiente Correo ➔</button>
  `;
}

function siguienteCorreo() {
  indiceCorreoActual++;
  cargarCasoPhishing(indiceCorreoActual);
}

function reiniciarSimuladorPhishing() {
  indiceCorreoActual = 0;
  aciertosPhishing = 0;
  cargarCasoPhishing(0);
}

/* =========================================================
   5. MEDIDOR DE FORTALEZA DE CONTRASEÑAS
   ========================================================= */
function configurarMedidorContrasenas() {
  const input = document.getElementById("pwd-input");
  const btnToggle = document.getElementById("btn-toggle-pwd");

  btnToggle.addEventListener("click", () => {
    if (input.type === "text") {
      input.type = "password";
      btnToggle.textContent = "Mostrar";
    } else {
      input.type = "text";
      btnToggle.textContent = "Ocultar";
    }
  });

  input.addEventListener("input", () => {
    const val = input.value;
    evaluarFortalezaPassword(val);

    // Registrar progreso si el alumno prueba una contraseña robusta
    if (val.length >= 12 && !estadoUsuario.contrasenasProbadas) {
      estadoUsuario.contrasenasProbadas = true;
      guardarProgreso();
    }
  });
}

function evaluarFortalezaPassword(pwd) {
  const tieneLongitud = pwd.length >= 12;
  const tieneMayus = /[A-Z]/.test(pwd);
  const tieneMinus = /[a-z]/.test(pwd);
  const tieneNumero = /[0-9]/.test(pwd);
  const tieneSimbolo = /[^A-Za-z0-9]/.test(pwd);
  const patronesComunes = /(1234|password|contraseña|admin|qwerty|1111|abc)/i;
  const sinPatrones = pwd.length > 0 && !patronesComunes.test(pwd);

  actualizarCriterio("crit-length", tieneLongitud, "Mínimo 12 caracteres de longitud");
  actualizarCriterio("crit-upper", tieneMayus, "Al menos una letra mayúscula (A-Z)");
  actualizarCriterio("crit-lower", tieneMinus, "Al menos una letra minúscula (a-z)");
  actualizarCriterio("crit-number", tieneNumero, "Al menos un número (0-9)");
  actualizarCriterio("crit-symbol", tieneSimbolo, "Al menos un símbolo especial (!@#$%^&*)");
  actualizarCriterio("crit-common", sinPatrones, "Sin palabras o patrones obvios (1234, admin, password)");

  // Calcular puntaje
  let puntos = 0;
  if (tieneLongitud) puntos += 2;
  else if (pwd.length >= 8) puntos += 1;
  if (tieneMayus) puntos++;
  if (tieneMinus) puntos++;
  if (tieneNumero) puntos++;
  if (tieneSimbolo) puntos++;
  if (!sinPatrones && pwd.length > 0) puntos = Math.max(1, puntos - 2);

  const barra = document.getElementById("strength-bar-fill");
  const etiqueta = document.getElementById("strength-label");
  const tiempo = document.getElementById("crack-time-estimate");

  if (pwd.length === 0) {
    barra.style.width = "0%";
    etiqueta.textContent = "Sin evaluar";
    etiqueta.style.color = "var(--text-primary)";
    tiempo.textContent = "Ingresa caracteres para calcular resistencia.";
    return;
  }

  if (puntos <= 2) {
    barra.style.width = "25%";
    barra.style.backgroundColor = "var(--accent-red)";
    etiqueta.textContent = "Muy Débil";
    etiqueta.style.color = "var(--accent-red)";
    tiempo.textContent = "⏱️ Tiempo estimado de descifrado: Menos de 1 segundo.";
  } else if (puntos <= 4) {
    barra.style.width = "55%";
    barra.style.backgroundColor = "var(--accent-amber)";
    etiqueta.textContent = "Aceptable (Mejorable)";
    etiqueta.style.color = "var(--accent-amber)";
    tiempo.textContent = "⏱️ Tiempo estimado de descifrado: Unas cuantas horas o días.";
  } else if (puntos === 5) {
    barra.style.width = "80%";
    barra.style.backgroundColor = "var(--accent-cyan)";
    etiqueta.textContent = "Fuerte";
    etiqueta.style.color = "var(--accent-cyan)";
    tiempo.textContent = "⏱️ Tiempo estimado de descifrado: Varios años.";
  } else {
    barra.style.width = "100%";
    barra.style.backgroundColor = "var(--accent-green)";
    etiqueta.textContent = "Muy Fuerte (Excelente)";
    etiqueta.style.color = "var(--accent-green)";
    tiempo.textContent = "🛡️ Tiempo estimado de descifrado: Siglos con computadoras actuales.";
  }
}

function actualizarCriterio(id, cumple, texto) {
  const el = document.getElementById(id);
  if (cumple) {
    el.classList.add("valid");
    el.textContent = `✅ ${texto}`;
  } else {
    el.classList.remove("valid");
    el.textContent = `❌ ${texto}`;
  }
}

/* =========================================================
   6. CUESTIONARIO FINAL
   ========================================================= */
function renderizarCuestionario() {
  const contenedor = document.getElementById("quiz-container");
  const resultados = document.getElementById("quiz-results");
  
  contenedor.classList.remove("hidden");
  resultados.classList.add("hidden");
  contenedor.innerHTML = "";

  QUIZ_PREGUNTAS.forEach((item, idx) => {
    const bloque = document.createElement("div");
    bloque.className = "question-block";

    let opcionesHTML = "";
    item.opciones.forEach((op, opIdx) => {
      opcionesHTML += `
        <label class="option-label">
          <input type="radio" name="preg-${idx}" value="${opIdx}">
          ${escaparHTML(op)}
        </label>
      `;
    });

    bloque.innerHTML = `
      <h4>${idx + 1}. ${escaparHTML(item.pregunta)}</h4>
      ${opcionesHTML}
    `;
    contenedor.appendChild(bloque);
  });

  const btnEnviar = document.createElement("button");
  btnEnviar.className = "btn btn-primary";
  btnEnviar.textContent = "Calificar Evaluación";
  btnEnviar.onclick = calificarCuestionario;
  contenedor.appendChild(btnEnviar);
}

function calificarCuestionario() {
  let aciertos = 0;
  let faltanRespuestas = false;
  let retroalimentacionHTML = "";

  QUIZ_PREGUNTAS.forEach((item, idx) => {
    const seleccionada = document.querySelector(`input[name="preg-${idx}"]:checked`);
    if (!seleccionada) {
      faltanRespuestas = true;
      return;
    }

    const valor = parseInt(seleccionada.value, 10);
    const esCorrecta = (valor === item.correcta);
    if (esCorrecta) aciertos++;

    retroalimentacionHTML += `
      <div style="text-align:left; margin-bottom:1rem; padding:0.75rem; background:var(--bg-input); border-radius:6px; border-left: 4px solid ${esCorrecta ? "var(--accent-green)" : "var(--accent-red)"};">
        <strong>${idx + 1}. ${escaparHTML(item.pregunta)}</strong><br>
        <span style="font-size:0.9rem; color:var(--text-secondary);">${esCorrecta ? "✅ Correcto:" : "❌ Incorrecto:"} ${escaparHTML(item.explicacion)}</span>
      </div>
    `;
  });

  if (faltanRespuestas) {
    alert("Por favor responde todas las preguntas antes de calificar.");
    return;
  }

  // Guardar en localStorage
  estadoUsuario.quizCompletado = true;
  estadoUsuario.quizPuntaje = aciertos;
  guardarProgreso();

  // Mostrar resultados
  const contenedor = document.getElementById("quiz-container");
  const resultados = document.getElementById("quiz-results");
  contenedor.classList.add("hidden");
  resultados.classList.remove("hidden");

  const aprobado = aciertos >= 4;
  resultados.innerHTML = `
    <h3>${aprobado ? "🎉 ¡Felicidades, Agente de Ciberseguridad!" : "📚 Buen intento, sigue repasando"}</h3>
    <div class="score-circle">${aciertos} / ${QUIZ_PREGUNTAS.length}</div>
    <p style="margin-bottom:1.5rem; color:var(--text-secondary);">
      ${aprobado 
        ? "Has demostrado tener las bases necesarias para proteger tu información en línea." 
        : "Te recomendamos volver a leer las lecciones y practicar en los simuladores para reforzar los conceptos."}
    </p>
    <div style="margin-bottom:1.5rem;">
      ${retroalimentacionHTML}
    </div>
    <button class="btn btn-outline" onclick="renderizarCuestionario()">Intentar de Nuevo</button>
  `;
}

/* Utilidad para evitar inyección de HTML al renderizar textos */
function escaparHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}