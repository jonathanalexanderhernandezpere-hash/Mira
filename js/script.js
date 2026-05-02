// =============================================
// ⚙️ CONFIGURACIÓN
// =============================================

const FECHA_OBJETIVO = new Date("2026-05-02T00:00:00").getTime();
const TOTAL_CARTAS = 3;

// 🎵 VIDEO DE YOUTUBE PARA MÚSICA DE FONDO
// Cambia este ID por el de tu video
const YOUTUBE_VIDEO_ID = "K5Ni6Zh6MCY"; // lofi hip hop radio

// =============================================
// 🌸 1. PÉTALOS DE CEREZO
// =============================================

function crearPetalos() {
    const contenedor = document.getElementById('contenedor-petalos');
    if (!contenedor) return;
    
    const cantidadPetalos = 35;
    
    for (let i = 0; i < cantidadPetalos; i++) {
        const petalo = document.createElement('div');
        petalo.className = 'petalo';
        
        petalo.style.left = Math.random() * 100 + '%';
        
        const escala = 0.5 + Math.random() * 1.2;
        petalo.style.transform = `scale(${escala})`;
        
        const duracion = 8 + Math.random() * 15;
        petalo.style.animationDuration = duracion + 's';
        
        const delay = Math.random() * 15;
        petalo.style.animationDelay = delay + 's';
        
        contenedor.appendChild(petalo);
    }
}

// =============================================
// ✨ 2. PARTÍCULAS DE LUZ
// =============================================

function crearParticulasLuz() {
    const contenedor = document.getElementById('particulas-luz');
    if (!contenedor) return;
    
    const cantidadParticulas = 25;
    
    for (let i = 0; i < cantidadParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula-luz';
        
        particula.style.left = Math.random() * 100 + '%';
        particula.style.top = (30 + Math.random() * 70) + '%';
        
        const duracion = 3 + Math.random() * 7;
        particula.style.animationDuration = duracion + 's';
        particula.style.animationDelay = Math.random() * 5 + 's';
        
        const tamano = 1 + Math.random() * 3;
        particula.style.width = tamano + 'px';
        particula.style.height = tamano + 'px';
        
        contenedor.appendChild(particula);
    }
}

// =============================================
// 🎵 3. REPRODUCTOR DE YOUTUBE
// =============================================

let youtubePlayer = null;
let musicaIniciada = false;
let musicaPausada = false;

function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('youtube-player', {
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            volume: 30
        },
        events: {
            onReady: onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    console.log('🎵 Reproductor listo');
}

function iniciarMusica() {
    if (!musicaIniciada && youtubePlayer && youtubePlayer.playVideo) {
        youtubePlayer.playVideo();
        youtubePlayer.setVolume(30);
        musicaIniciada = true;
        const instruccion = document.getElementById('instruccion-audio');
        if (instruccion) instruccion.style.display = 'none';
    }
}

function toggleMusica() {
    if (!youtubePlayer) return;
    
    const btnTexto = document.getElementById('texto-musica');
    
    if (musicaPausada) {
        youtubePlayer.playVideo();
        if (btnTexto) btnTexto.textContent = 'Pausar música';
        musicaPausada = false;
    } else {
        youtubePlayer.pauseVideo();
        if (btnTexto) btnTexto.textContent = 'Reanudar música';
        musicaPausada = true;
    }
}
window.toggleMusica = toggleMusica;

// =============================================
// ⏱️ 4. CUENTA ATRÁS
// =============================================

function actualizarContador() {
    const ahora = new Date().getTime();
    const diferencia = FECHA_OBJETIVO - ahora;
    
    if (diferencia <= 0) {
        const contenido = document.querySelector('.contenido-central');
        if (contenido) {
            contenido.style.opacity = '0';
            contenido.style.transition = 'opacity 1.5s';
        }
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1500);
        return;
    }
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    
    const elDias = document.getElementById("dias");
    if (elDias) {
        elDias.textContent = String(dias).padStart(2, '0');
        document.getElementById("horas").textContent = String(horas).padStart(2, '0');
        document.getElementById("minutos").textContent = String(minutos).padStart(2, '0');
        document.getElementById("segundos").textContent = String(segundos).padStart(2, '0');
    }
}

// =============================================
// 5. INICIALIZACIÓN CUANDO CARGA LA PÁGINA
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Si estamos en index.html ---
    if (document.getElementById('contenedor-petalos')) {
        crearPetalos();
        crearParticulasLuz();
        actualizarContador();
        setInterval(actualizarContador, 1000);
        
        // Activar música al primer clic/toque
        document.body.addEventListener('click', function iniciarAudio() {
            iniciarMusica();
            document.body.removeEventListener('click', iniciarAudio);
        }, { once: true });
        
        document.addEventListener('keydown', function iniciarAudioTecla() {
            iniciarMusica();
            document.removeEventListener('keydown', iniciarAudioTecla);
        }, { once: true });
    }
    
    // --- Si estamos en home.html ---
    if (document.getElementById('grid-cartas')) {
        inicializarHome();
    }
    
});

// =============================================
// 📁 6. SISTEMA DE CARTAS (localStorage)
// =============================================

const STORAGE_KEY = 'cartas_desbloqueadas';

function obtenerCartasDesbloqueadas() {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [1]; // Carta 1 siempre desbloqueada
}

function desbloquearCarta(numeroCarta) {
    const desbloqueadas = obtenerCartasDesbloqueadas();
    if (!desbloqueadas.includes(numeroCarta)) {
        desbloqueadas.push(numeroCarta);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(desbloqueadas));
        console.log(`✅ Carta ${numeroCarta} desbloqueada`);
    }
}

function marcarCartaLeida(numeroCarta) {
    let leidas = JSON.parse(localStorage.getItem('cartas_leidas') || '[]');
    if (!leidas.includes(numeroCarta)) {
        leidas.push(numeroCarta);
        localStorage.setItem('cartas_leidas', JSON.stringify(leidas));
    }
}

function estaDesbloqueada(numeroCarta) {
    return obtenerCartasDesbloqueadas().includes(numeroCarta);
}

// Exponer globalmente
window.desbloquearCarta = desbloquearCarta;
window.marcarCartaLeida = marcarCartaLeida;

// =============================================
// 🏠 7. INTERFAZ DE HOME
// =============================================

function inicializarHome() {
    const grid = document.getElementById('grid-cartas');
    const menuLeidas = document.getElementById('menu-leidas');
    
    if (!grid) return;
    
    const desbloqueadas = obtenerCartasDesbloqueadas();
    const leidas = JSON.parse(localStorage.getItem('cartas_leidas') || '[]');
    
    grid.innerHTML = '';
    if (menuLeidas) menuLeidas.innerHTML = '';
    
    for (let i = 1; i <= TOTAL_CARTAS; i++) {
        const bloqueada = !desbloqueadas.includes(i);
        
        const tarjeta = document.createElement('div');
        tarjeta.className = `tarjeta-carta ${bloqueada ? 'bloqueada' : ''}`;
        
        if (bloqueada) {
            tarjeta.innerHTML = `
                <div class="icono-carta">
                    <span class="candado">🔒</span>
                    <p>Carta ${i}</p>
                    <small>Aún no disponible</small>
                </div>
            `;
            tarjeta.style.opacity = '0.5';
            tarjeta.style.cursor = 'not-allowed';
        } else {
            tarjeta.innerHTML = `
                <a href="cartas/carta${i}.html" class="icono-carta">
                    <span class="sobre">💌</span>
                    <p>Carta ${i}</p>
                    <small>${leidas.includes(i) ? '✓ Leída' : '📖 Por leer'}</small>
                </a>
            `;
        }
        
        grid.appendChild(tarjeta);
        
        if (leidas.includes(i) && menuLeidas) {
            const enlaceMenu = document.createElement('a');
            enlaceMenu.href = `cartas/carta${i}.html`;
            enlaceMenu.textContent = `📜 Carta ${i}`;
            enlaceMenu.className = 'item-menu';
            menuLeidas.appendChild(enlaceMenu);
        }
    }
    
    if (leidas.length === 0 && menuLeidas) {
        menuLeidas.innerHTML = '<span class="item-menu-vacio">Aún no has leído ninguna carta</span>';
    }
}

// =============================================
// 🔄 8. REINICIO (para pruebas)
// =============================================

function reiniciarProgreso() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('cartas_leidas');
    window.location.reload();
}
window.reiniciarProgreso = reiniciarProgreso;
