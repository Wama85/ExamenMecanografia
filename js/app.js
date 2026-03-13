const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwiqDcjb1Q0HzzVIHm-v02IVmzp80z90bSO-5b4bLLxlU2Ay64vw-boIxixdRzjpPqI/exec';
const DOMINIO_PERMITIDO = '@cesanrafael.org';

let usuarioData = {
  correo: '',
  nombre: '',
  apellido: ''
};

let textoOriginal = '';
let palabrasOriginales = [];
let palabrasCorrectas = 0;
let inicioTiempo;
let tiempoLimite = 120;
let temporizador = null;
let testIniciado = false;
let puntuacionFinal = 0;
let wpmFinal = 0;
let precisionFinal = 0;
let testFinalizado = false;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('texto.txt');
    textoOriginal = await response.text();
    palabrasOriginales = textoOriginal.trim().split(/\s+/);
    document.getElementById('textoOriginal').value = textoOriginal;
  } catch (error) {
    console.error('Error al cargar el texto:', error);
    document.getElementById('textoOriginal').value = 'No se pudo cargar el texto.';
  }
});

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

function handleCredentialResponse(response) {
  try {
    const data = parseJwt(response.credential);

    const email = (data.email || '').toLowerCase();
    const nombreCompleto = data.name || '';
    const givenName = data.given_name || '';
    const familyName = data.family_name || '';

    if (!email.endsWith(DOMINIO_PERMITIDO)) {
      document.getElementById('loginMessage').innerHTML =
        '<span class="text-danger">Solo se permiten cuentas institucionales @cesanrafael.org</span>';
      return;
    }

    usuarioData.correo = email;
    usuarioData.nombre = givenName || extraerNombre(nombreCompleto);
    usuarioData.apellido = familyName || extraerApellido(nombreCompleto);

    document.getElementById('correo').value = usuarioData.correo;
    document.getElementById('nombre').value = usuarioData.nombre;
    document.getElementById('apellido').value = usuarioData.apellido;

    document.getElementById('loginScreen').classList.add('d-none');
    document.getElementById('examScreen').classList.remove('d-none');

    document.getElementById('textoUsuario').focus();
  } catch (error) {
    console.error(error);
    document.getElementById('loginMessage').innerHTML =
      '<span class="text-danger">Error al iniciar sesión</span>';
  }
}

function extraerNombre(nombreCompleto) {
  const partes = nombreCompleto.trim().split(/\s+/);
  return partes[0] || '';
}

function extraerApellido(nombreCompleto) {
  const partes = nombreCompleto.trim().split(/\s+/);
  return partes.length >= 2 ? partes.slice(1).join(' ') : '';
}

function limpiarTexto(txt) {
  return txt
    .replace(/[.,;:!?¿¡()"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function evaluarTexto() {
  if (testFinalizado) return;

  if (!testIniciado) {
    iniciarTest();
    testIniciado = true;
  }

  const textoUsuarioRaw = document.getElementById('textoUsuario').value;
  const textoUsuarioLimpio = limpiarTexto(textoUsuarioRaw);
  const palabrasOriginalesLimpias = limpiarTexto(textoOriginal).split(' ').filter(Boolean);
  const palabrasUsuario = textoUsuarioLimpio ? textoUsuarioLimpio.split(' ').filter(Boolean) : [];

  palabrasCorrectas = 0;

  for (let i = 0; i < palabrasUsuario.length; i++) {
    if (palabrasUsuario[i] === palabrasOriginalesLimpias[i]) {
      palabrasCorrectas++;
    }
  }

  const tiempoTranscurrido = (new Date() - inicioTiempo) / 60000;
  const palabrasPorMinuto = tiempoTranscurrido > 0
    ? Math.round(palabrasUsuario.length / tiempoTranscurrido)
    : 0;

  // Precisión: sobre lo que escribió el estudiante
  const precision = palabrasUsuario.length > 0
    ? parseFloat(((palabrasCorrectas / palabrasUsuario.length) * 100).toFixed(2))
    : 0;

  // Puntuación: sobre el total del texto original
  const puntuacion = palabrasOriginalesLimpias.length > 0
    ? parseFloat(((palabrasCorrectas / palabrasOriginalesLimpias.length) * 100).toFixed(2))
    : 0;

  precisionFinal = precision;
  puntuacionFinal = puntuacion;
  wpmFinal = palabrasPorMinuto;

  document.getElementById('contadorPalabras').innerText =
    `Palabras correctas: ${palabrasCorrectas} | WPM: ${palabrasPorMinuto} | Precisión: ${precision}% | Puntuación: ${puntuacion}/100`;
}

function iniciarTest() {
  if (temporizador) return;

  inicioTiempo = new Date();
  temporizador = setInterval(actualizarTiempo, 1000);
}

function actualizarTiempo() {
  if (tiempoLimite <= 0) {
    clearInterval(temporizador);
    terminarTest();
    return;
  }

  tiempoLimite--;

  const minutos = Math.floor(tiempoLimite / 60);
  const segundos = tiempoLimite % 60;

  document.getElementById('tiempoRestante').innerText =
    `Tiempo restante: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

function bloquearCtrlV(e) {
  if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
    e.preventDefault();
    alert('No se permite pegar texto en este campo.');
  }
}

function terminarTest() {
  if (testFinalizado) return;

  testFinalizado = true;

  document.getElementById('textoUsuario').disabled = true;
  document.getElementById('textoUsuario').classList.add('bloqueado');

  evaluarTexto();

  let colorClase = 'bg-danger';
  let mensaje = 'Necesitas mejorar';

  if (puntuacionFinal >= 90) {
    colorClase = 'bg-success';
    mensaje = '¡Excelente!';
  } else if (puntuacionFinal >= 70) {
    colorClase = 'bg-info';
    mensaje = '¡Muy bien!';
  } else if (puntuacionFinal >= 50) {
    colorClase = 'bg-warning';
    mensaje = 'Bien';
  }

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <div class="nota-final ${colorClase} text-white">
      ${mensaje}<br>
      NOTA FINAL: ${puntuacionFinal}/100
    </div>
  `;

  enviarDatos();
}

async function enviarDatos() {
  const datos = {
    correo: usuarioData.correo,
    nombre: usuarioData.nombre,
    apellido: usuarioData.apellido,
    palabrasCorrectas: palabrasCorrectas,
    wpm: wpmFinal,
    nota: puntuacionFinal
  };

  console.log('Datos enviados al Sheet:', datos);

  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    document.getElementById('resultado').innerHTML +=
      '<p class="text-success mt-3">Resultados guardados correctamente</p>';
  } catch (error) {
    console.error('Error al enviar datos:', error);
    document.getElementById('resultado').innerHTML +=
      '<p class="text-danger mt-3">Error al guardar resultados</p>';
  }
}