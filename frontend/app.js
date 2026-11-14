// ===== AulaReserva: lógica del frontend =====

const API_URL = '';

// Aulas cargadas desde la API (las usamos para mostrar el nombre en la tabla)
let aulas = [];

// ---------- Utilidades ----------

// Hace una petición a la API y devuelve el JSON.
// Si la respuesta no es correcta (400, 404, 409...) lanza un Error con el mensaje del servidor.
async function peticion(ruta, opciones = {}) {
  const response = await fetch(API_URL + ruta, opciones);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error inesperado');
  }
  return data;
}

// Evita que un texto escrito por el usuario se interprete como HTML
function escapaHtml(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Muestra un mensaje en el formulario. tipo: 'ok' o 'error'
function muestraMensaje(texto, tipo) {
  const mensaje = document.getElementById('mensajeFormulario');
  mensaje.textContent = texto;
  mensaje.className = 'mensaje ' + tipo;
}

// ---------- Entorno (Desarrollo / Producción) ----------

function muestraEntorno() {
  const etiqueta = document.getElementById('entorno-app');
  const config = window.APP_CONFIG || {};
  const entorno = config.entorno === 'production' ? 'production' : 'development';

  etiqueta.textContent = entorno === 'production' ? 'Producción' : 'Desarrollo';
  etiqueta.className = 'entorno-' + entorno;

  if (config.nombre) {
    document.title = config.nombre;
  }
}

// ---------- Aulas ----------

async function getAulas() {
  try {
    aulas = await peticion('/api/aulas');
    muestraAulas(aulas);
    rellenaSelectAulas(aulas);
  } catch (error) {
    document.getElementById('listadoAulas').innerHTML =
      `<p class="mensaje error">No se pudieron cargar las aulas: ${escapaHtml(error.message)}</p>`;
  }
}

function muestraAulas(aulas) {
  document.getElementById('listadoAulas').innerHTML = aulas
    .map(aula => `
      <div class="recuadros">
        <h3>${escapaHtml(aula.nombre)}</h3>
        <p>Capacidad: ${aula.capacidad} personas</p>
        <p>${escapaHtml(aula.ubicacion)}</p>
      </div>`)
    .join('');
}

function rellenaSelectAulas(aulas) {
  const select = document.getElementById('aula');

  aulas.forEach(aula => {
    const opcion = document.createElement('option');
    opcion.value = aula.id;
    opcion.textContent = aula.nombre;
    select.appendChild(opcion);
  });
}

// ---------- Reservas ----------

async function getReservas() {
  try {
    const reservas = await peticion('/api/reservas');
    muestraReservas(reservas);
  } catch (error) {
    muestraMensaje('No se pudieron cargar las reservas: ' + error.message, 'error');
  }
}

function nombreAula(id) {
  const aula = aulas.find(a => a.id === id);
  return aula ? aula.nombre : 'Aula ' + id;
}

// Dibuja la tabla, actualiza el contador y muestra/oculta el aviso "sin reservas"
function muestraReservas(reservas) {
  document.getElementById('contadorReservas').textContent = reservas.length;
  document.getElementById('sinReservas').hidden = reservas.length > 0;

  document.getElementById('cuerpoReservas').innerHTML = reservas
    .map(reserva => `
      <tr>
        <td>${escapaHtml(nombreAula(reserva.aula_id))}</td>
        <td>${escapaHtml(reserva.fecha)}</td>
        <td>${escapaHtml(reserva.hora)}</td>
        <td>${escapaHtml(reserva.responsable)}</td>
        <td><button type="button" data-id="${reserva.id}">Cancelar</button></td>
      </tr>`)
    .join('');
}

async function enviarReserva(evento) {
  evento.preventDefault();

  const aula = document.getElementById('aula').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const responsable = document.getElementById('responsable').value.trim();

  if (aula === '' || fecha === '' || hora === '' || responsable === '') {
    muestraMensaje('Todos los campos son obligatorios.', 'error');
    return;
  }

  const reserva = { aula_id: Number(aula), fecha, hora, responsable };

  try {
    const data = await peticion('/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reserva)
    });

    muestraMensaje(data.mensaje, 'ok');
    document.getElementById('formReserva').reset();
    await getReservas();
  } catch (error) {
    muestraMensaje(error.message, 'error');
  }
}

async function cancelarReserva(id) {
  if (!confirm('¿Seguro que quieres cancelar esta reserva?')) {
    return;
  }

  try {
    const data = await peticion('/api/reservas/' + id, { method: 'DELETE' });
    muestraMensaje(data.mensaje, 'ok');
    await getReservas();
  } catch (error) {
    muestraMensaje(error.message, 'error');
  }
}

// Un solo listener para toda la tabla (funciona también con las filas nuevas)
function clickTabla(evento) {
  const boton = evento.target.closest('button[data-id]');
  if (boton) {
    cancelarReserva(boton.dataset.id);
  }
}

// ---------- Inicio ----------

async function iniciar() {
  muestraEntorno();

  // No se puede reservar en el pasado
  document.getElementById('fecha').min = new Date().toISOString().split('T')[0];

  document.getElementById('formReserva').addEventListener('submit', enviarReserva);
  document.getElementById('cuerpoReservas').addEventListener('click', clickTabla);

  // Primero las aulas, para que la tabla pueda mostrar su nombre
  await getAulas();
  await getReservas();
}

iniciar();