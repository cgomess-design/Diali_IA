/**
 * Práctica 2 - Análisis de Sistemas 2
 * Estudiante: Celeste María Gómez Sandoval (Carné: 3490-22-20396)
 * Catedrático: Ing. Valesca Samayoa
 * 
 * Archivo: diali-engine.js
 * Funcionalidad interactiva del prototipo Diali IA
 */

// Base de datos simulada en JavaScript
var baseConocimiento = [
  {
    pregunta: "crédito",
    respuesta: "La política de crédito para clientes corporativos otorga hasta 45 días de plazo y un 3% de descuento por pronto pago en los primeros 10 días.",
    fuente: "Manual_Politicas_Credito_2026.pdf (Pág. 14)"
  },
  {
    pregunta: "fuga",
    respuesta: "Protocolo de Churn: Clientes con riesgo de fuga mayor al 75% deben ser contactados en menos de 24 horas por el Gerente Comercial con una oferta de retención.",
    fuente: "Matriz_Riesgo_Retencion_Clientes.pdf (Pág. 6)"
  },
  {
    pregunta: "factura",
    respuesta: "Factura F-9041 de Textiles Guatemala S.A. por valor total de Q 6,200.00 (con 12% de IVA incluido). Lista para sincronizar al ERP.",
    fuente: "Factura_F-9041_TextilesGT.pdf (Pág. 1)"
  },
  {
    pregunta: "penalización",
    respuesta: "Cláusula 11: Se penaliza con 2.5% por cada 15 días hábiles de retraso en la entrega de suministros, con un tope máximo del 10%.",
    fuente: "Contrato_San_Rafael.pdf (Pág. 22)"
  }
];

// Documentos de prueba para OCR
var documentosEjemplo = {
  factura_9041: {
    tipo: "Factura Comercial",
    folio: "F-9041",
    fecha: "2026-02-15",
    emisor: "Textiles Guatemala S.A.",
    receptor: "Corporación Diali Internacional",
    total: "Q 6,200.00",
    clausula: "Pago a 30 días hábiles. Mora mensual aplicable del 3%.",
    pii: "Datos personales anonimizados con AES-256 (GDPR)",
    confianza: "98.7% Confianza",
    archivo: "Factura_F-9041_TextilesGT.pdf"
  },
  contrato_farmaceutica: {
    tipo: "Contrato Marco",
    folio: "CTR-2026-088",
    fecha: "2026-01-05",
    emisor: "Farmacéutica del Valle S.A.",
    receptor: "Corporación Diali Internacional",
    total: "Q 3,100.00",
    clausula: "Rescisión de contrato si hay inactividad de más de 120 días.",
    pii: "Firmas y datos de apoderados cifrados",
    confianza: "96.2% Confianza",
    archivo: "Contrato_Suministros_Farmaceutica.pdf"
  },
  reporte_q2: {
    tipo: "Reporte Financiero",
    folio: "REP-FIN-Q2",
    fecha: "2026-06-30",
    emisor: "Dirección de Finanzas",
    receptor: "Junta Directiva",
    total: "Q 350,000.00",
    clausula: "Auditoría interna aprobada según normas contables IFRS.",
    pii: "Sin datos confidenciales detectados",
    confianza: "99.4% Confianza",
    archivo: "Reporte_Financiero_Q2.pdf"
  }
};

// Datos de clientes para la analítica de Churn
var clientesDatos = {
  'CLI-01': {
    nombre: "Farmacéutica del Valle",
    churn: "95.0%",
    motivo: "Inactividad de más de 8 meses sin órdenes y 2 reclamos pendientes.",
    accion: "Llamada urgente de la Dirección Comercial y condonar penalizaciones de mora."
  },
  'CLI-02': {
    nombre: "Textiles Guatemala S.A.",
    churn: "85.5%",
    motivo: "Disminución del 60% en compras por cambio de jefatura de compras.",
    accion: "Ofrecer 12% de descuento en el próximo pedido y ampliar crédito a 45 días."
  },
  'CLI-03': {
    nombre: "Comercial San Rafael",
    churn: "78.2%",
    motivo: "Retrasos recurrentes en pagos y solicitud de cotizaciones externas.",
    accion: "Aplicar bono de fidelización y reunión de seguimiento operativo."
  },
  'CLI-04': {
    nombre: "Distribuidora El Faro",
    churn: "15.0%",
    motivo: "Cliente frecuente con buena calificación en encuestas de satisfacción.",
    accion: "Enviar catálogo de nuevos productos corporativos."
  },
  'CLI-05': {
    nombre: "Grupo Industrial Andes",
    churn: "12.5%",
    motivo: "Contrato renovado a dos años con pagos puntuales.",
    accion: "Mantener seguimiento regular de servicio."
  },
  'CLI-06': {
    nombre: "Logística Rápida GT",
    churn: "5.0%",
    motivo: "Cliente platino integrado directamente con nuestra API.",
    accion: "Monitoreo continuo de pedidos."
  }
};

var docSeleccionado = null;
var contadorDocs = 1420;

// 0. Autenticación simulada del prototipo (Clase Usuario: autenticar())
function iniciarSesion(event) {
  if (event) event.preventDefault();
  document.getElementById('pantalla-login').classList.add('d-none');
  document.getElementById('pantalla-sistema').classList.remove('d-none');
  mostrarSeccion('dashboard');
}

function cerrarSesion() {
  document.getElementById('pantalla-sistema').classList.add('d-none');
  document.getElementById('pantalla-login').classList.remove('d-none');
}

// 1. Navegación entre secciones
function mostrarSeccion(seccion) {
  // Ocultar todas las secciones
  document.getElementById('seccion-dashboard').classList.add('d-none');
  document.getElementById('seccion-asistente').classList.add('d-none');
  document.getElementById('seccion-documentos').classList.add('d-none');
  document.getElementById('seccion-analitica').classList.add('d-none');

  // Mostrar la sección seleccionada
  document.getElementById('seccion-' + seccion).classList.remove('d-none');

  // Actualizar enlaces del menú
  var links = document.querySelectorAll('.sidebar .nav-link');
  links.forEach(function(l) { l.classList.remove('active'); });

  // Cambiar título superior
  var titulos = {
    dashboard: ["Panel Operativo", "Métricas en tiempo real de Diali IA"],
    asistente: ["Asistente Diali IA", "Conversación asistida por base de conocimiento (RAG)"],
    documentos: ["Documentos", "Extracción inteligente y sincronización con ERP/CRM"],
    analitica: ["Analítica Predictiva", "Churn rate, anomalías y recomendaciones estratégicas"]
  };

  document.getElementById('titulo-seccion').innerText = titulos[seccion][0];
  document.getElementById('subtitulo-seccion').innerText = titulos[seccion][1];

  // Marcar enlace activo
  var evento = window.event;
  if (evento && evento.target) {
    evento.target.classList.add('active');
  }
}

// 2. Chatbot con RAG y Voz (RF-01)
function teclaEnter(e) {
  if (e.key === 'Enter') {
    enviarMensaje();
  }
}

function preguntar(texto) {
  document.getElementById('campo-chat').value = texto;
  enviarMensaje();
}

function enviarMensaje() {
  var campo = document.getElementById('campo-chat');
  var texto = campo.value.trim();
  if (texto === "") return;

  var chat = document.getElementById('caja-mensajes');

  // Agregar mensaje de usuario
  var divUser = document.createElement('div');
  divUser.className = 'msg-user';
  divUser.innerHTML = '<strong>Usuario:</strong><br>' + texto;
  chat.appendChild(divUser);
  campo.value = "";

  // Simular búsqueda en la base de conocimientos RAG
  setTimeout(function() {
    var respuesta = "He consultado la base de conocimiento corporativa. Para esta consulta específica, por favor consultar con la Gerencia de Operaciones.";
    var fuente = "Manual_General_Operaciones.pdf (Pág. 1)";

    var tMin = texto.toLowerCase();
    for (var i = 0; i < baseConocimiento.length; i++) {
      if (tMin.indexOf(baseConocimiento[i].pregunta) !== -1) {
        respuesta = baseConocimiento[i].respuesta;
        fuente = baseConocimiento[i].fuente;
        break;
      }
    }

    var divBot = document.createElement('div');
    divBot.className = 'msg-bot';
    divBot.innerHTML = '<strong>Diali IA:</strong><br>' + respuesta + 
                       '<br><small class="text-muted border-top d-block mt-1 pt-1"><strong>Fuente RAG:</strong> ' + fuente + '</small>';
    chat.appendChild(divBot);
    chat.scrollTop = chat.scrollHeight;
  }, 600);

  chat.scrollTop = chat.scrollHeight;
}

function alternarMicrofono() {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var btn = document.getElementById('btn-mic');

  if (SpeechRecognition) {
    var recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    btn.classList.add('btn-danger');
    btn.classList.remove('btn-outline-secondary');

    recognition.onresult = function(event) {
      document.getElementById('campo-chat').value = event.results[0][0].transcript;
      enviarMensaje();
    };

    recognition.onend = function() {
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-outline-secondary');
    };

    recognition.start();
  } else {
    // Simulación si el navegador no tiene soporte directo
    btn.classList.add('btn-danger');
    setTimeout(function() {
      btn.classList.remove('btn-danger');
      document.getElementById('campo-chat').value = "¿Qué clientes tienen riesgo de fuga alto?";
      enviarMensaje();
    }, 1000);
  }
}

// 3. Documentos y OCR (RF-02, RF-03)
function archivoCargado(input) {
  if (input.files && input.files[0]) {
    var nombre = input.files[0].name.toLowerCase();
    if (nombre.indexOf('contrato') !== -1) {
      cargarEjemplo(null, 'contrato_farmaceutica');
    } else if (nombre.indexOf('reporte') !== -1) {
      cargarEjemplo(null, 'reporte_q2');
    } else {
      cargarEjemplo(null, 'factura_9041');
    }
  }
}

function cargarEjemplo(e, clave) {
  if (e) e.stopPropagation();

  var data = documentosEjemplo[clave];
  if (!data) return;

  docSeleccionado = data;

  var caja = document.getElementById('caja-ocr');
  var barra = document.getElementById('ocr-barra-progreso');
  var datos = document.getElementById('ocr-datos');

  caja.classList.remove('d-none');
  barra.classList.remove('d-none');
  datos.classList.add('d-none');
  document.getElementById('ocr-titulo').innerText = "Leyendo archivo: " + data.archivo;

  setTimeout(function() {
    barra.classList.add('d-none');
    datos.classList.remove('d-none');

    document.getElementById('ocr-titulo').innerText = "Datos extraídos de " + data.archivo;
    document.getElementById('ocr-confianza').innerText = data.confianza;
    document.getElementById('d-tipo').innerText = data.tipo;
    document.getElementById('d-folio').innerText = data.folio;
    document.getElementById('d-fecha').innerText = data.fecha;
    document.getElementById('d-total').innerText = data.total;
    document.getElementById('d-emisor').innerText = data.emisor;
    document.getElementById('d-receptor').innerText = data.receptor;
    document.getElementById('d-clausula').innerText = data.clausula;
    document.getElementById('d-pii').innerText = data.pii;

    // Aumentar contador de documentos procesados
    contadorDocs++;
    document.getElementById('kpi-docs').innerText = contadorDocs.toLocaleString();
  }, 900);
}

function sincronizarERP() {
  if (!docSeleccionado) return;

  var tabla = document.getElementById('tabla-historial');
  var fila = document.createElement('tr');
  fila.innerHTML = '<td><strong>' + docSeleccionado.folio + '</strong></td>' +
                   '<td>' + docSeleccionado.archivo + '</td>' +
                   '<td>' + docSeleccionado.tipo + '</td>' +
                   '<td>' + docSeleccionado.fecha + '</td>' +
                   '<td>' + docSeleccionado.total + '</td>' +
                   '<td><span class="badge bg-success">Sincronizado SAP</span></td>';

  tabla.insertBefore(fila, tabla.firstChild);
  alert("¡Éxito! Los datos fueron enviados y sincronizados con SAP y Salesforce por la API.");
}

function verJson() {
  var doc = docSeleccionado || documentosEjemplo.factura_9041;
  var payload = {
    transaccionId: "TX-" + Math.floor(100000 + Math.random() * 900000),
    folio: doc.folio,
    tipo: doc.tipo,
    monto: doc.total,
    emisor: doc.emisor,
    erpDestino: "SAP S/4HANA (FI/CO)",
    crmDestino: "Salesforce CRM",
    seguridad: "AES-256 / TLS 1.3",
    fecha: new Date().toLocaleDateString()
  };

  document.getElementById('json-texto').innerText = JSON.stringify(payload, null, 2);
  document.getElementById('modal-json').style.display = 'block';
}

// 4. Analítica Predictiva (RF-04)
function ejecutarCalculo() {
  var btn = document.getElementById('btn-calc-churn');
  btn.disabled = true;
  btn.innerText = "Calculando...";

  setTimeout(function() {
    btn.disabled = false;
    btn.innerText = "⚡ Ejecutar analítica";
    alert("Analítica actualizada: Se confirmaron 3 clientes en riesgo alto de fuga.");
  }, 1000);
}

function abrirPrescripcion(id) {
  var cliente = clientesDatos[id];
  if (!cliente) return;

  document.getElementById('p-cliente').innerText = cliente.nombre;
  document.getElementById('p-churn').innerText = cliente.churn + " Churn";
  document.getElementById('p-motivo').innerText = cliente.motivo;
  document.getElementById('p-accion').innerText = cliente.accion;

  document.getElementById('modal-prescripcion').style.display = 'block';
}

function guardarPrescripcion() {
  cerrarModales();
  alert("Acción comercial guardada correctamente en el CRM.");
}

function cerrarModales() {
  document.getElementById('modal-json').style.display = 'none';
  document.getElementById('modal-prescripcion').style.display = 'none';
}
