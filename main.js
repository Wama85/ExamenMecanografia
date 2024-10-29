let inicioTiempo;
let palabrasCorrectas = 0;
let textoOriginal = "Una de las lecciones más importantes que aprendes después de años tratando con personas adictas es que puedes darle la espalda a alguien que necesita ayuda, pero nunca debes darle la espalda a la droga. La razón es simple: la droga no tiene amigos y no conoce límites. Es especialmente peligroso cuando quien la consume sostiene un cuchillo afilado frente a tus ojos, o peor aún, cuando ni siquiera puedes ver lo que esconde en sus manos. Nunca subestimes el poder de la adicción, ya que puede transformar a cualquier persona en alguien irreconocible, alguien que ya no controla sus propios actos y que está dispuesto a hacer lo impensable solo por una dosis más. Por eso, tratar con adicciones no es solo ayudar; también es ser consciente de que puedes estar enfrentándote a un enemigo invisible, uno que nunca descansa y siempre está buscando una oportunidad para controlar y dominar.";
document.getElementById("textoOriginal").value = textoOriginal;
const palabrasOriginales = textoOriginal.split(/\s+/);
let tiempoLimite = 120;
let temporizador;
let testIniciado = false;

document.getElementById("textoOriginal").oncopy = bloquearPagina;
document.getElementById("textoOriginal").onselectstart = (e) => e.preventDefault();



function bloquearPagina() {
    document.getElementById("testForm").innerHTML = "<p class='text-center text-danger fw-bold'>La página ha sido bloqueada por intento de copia.</p>";
}

function bloquearCtrlV(e) {
    if (e.ctrlKey && e.key === "v") {
        e.preventDefault();
        alert("No se permite pegar texto en este campo.");
    }
}

function evaluarTexto() {
    if (!testIniciado) {
        iniciarTest();
        testIniciado = true;
    }

    const textoUsuario = document.getElementById('textoUsuario').value.trim();
    const palabrasUsuario = textoUsuario.split(/\s+/);

    palabrasCorrectas = 0;
    palabrasUsuario.forEach((palabra, index) => {
        if (palabra && palabra === palabrasOriginales[index]) {
            palabrasCorrectas++;
        }
    });

    const tiempoTranscurrido = (new Date() - inicioTiempo) / 60000;
    const palabrasPorMinuto = Math.round(palabrasUsuario.length / tiempoTranscurrido);

    document.getElementById('contadorPalabras').innerText = `Palabras correctas: ${palabrasCorrectas} | WPM: ${palabrasPorMinuto}`;
}

function iniciarTest() {
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
    document.getElementById('tiempoRestante').innerText = `Tiempo restante: ${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
}

function terminarTest() {
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;

    if (nombre && apellido) {
        clearInterval(temporizador);
        const tiempoTotal = (new Date() - inicioTiempo) / 60000;
        const wpmFinal = Math.round(palabrasCorrectas / tiempoTotal);
        const precision = ((palabrasCorrectas / palabrasOriginales.length) * 100).toFixed(2);

        document.getElementById('resultado').innerText = `Gracias, ${nombre} ${apellido}. Has escrito ${palabrasCorrectas} palabras correctas con una precisión del ${precision}%. Tu velocidad final es de ${wpmFinal} palabras por minuto.`;
        document.getElementById('textoUsuario').readOnly = true;
    } else {
        alert("Por favor, completa todos los campos.");
    }
}