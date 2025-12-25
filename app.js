// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "impostor-online-11805.firebaseapp.com",
  projectId: "impostor-online-11805",
  storageBucket: "impostor-online-11805.appspot.com",
  messagingSenderId: "409319191950",
  appId: "1:409319191950:web:...",
  measurementId: "G-...",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// --- CONSTANTES ---
const TIME_DISCUSSION = 15 * 60; // 15 minutos en segundos
const TIME_VOTING = 2 * 60;      // 2 minutos en segundos

const CATEGORIES = {
    // --- CLÁSICOS ---
    "Juguetes": { words: ["Muñeca", "Oso peluche", "Coche RC", "Robot"], impostorWords: ["Soldado", "Action Man", "Tren", "Barco pirata"] },
    "Animales Domésticos": { words: ["Gato", "Perro", "Hámster", "Loro"], impostorWords: ["Conejo", "Zorro", "Hurón", "Tortuga"] },
    "Comida Rápida": { words: ["Hamburguesa", "Perrito", "Pizza", "Kebab"], impostorWords: ["Taco", "Sandwich", "Burrito", "Nuggets"] },
    "Deportes": { words: ["Fútbol", "Baloncesto", "Tenis", "Voleibol"], impostorWords: ["Rugby", "Balonmano", "Pádel", "Béisbol"] },
    "Oficina": { words: ["Ordenador", "Teclado", "Ratón", "Impresora"], impostorWords: ["Tablet", "Máquina escribir", "Escáner", "Fax"] },

    // --- ALIMENTACIÓN ---
    "Frutas": { words: ["Manzana", "Pera", "Plátano", "Naranja"], impostorWords: ["Melocotón", "Mango", "Piña", "Kiwi"] },
    "Verduras": { words: ["Lechuga", "Tomate", "Zanahoria", "Pepino"], impostorWords: ["Espinaca", "Pimiento", "Calabacín", "Berenjena"] },
    "Desayuno": { words: ["Café", "Tostada", "Cereales", "Zumo"], impostorWords: ["Té", "Croissant", "Galletas", "Leche"] },
    "Postres": { words: ["Helado", "Tarta", "Flan", "Yogur"], impostorWords: ["Brownie", "Natillas", "Gelatina", "Crepes"] },
    "Bebidas": { words: ["Coca-Cola", "Fanta", "Agua", "Sprite"], impostorWords: ["Pepsi", "Aquarius", "Gaseosa", "7 Up"] },
    "Alcohol": { words: ["Cerveza", "Vino", "Whisky", "Vodka"], impostorWords: ["Sidra", "Champán", "Ron", "Ginebra"] },

    // --- LUGARES ---
    "Ciudad": { words: ["Parque", "Cine", "Biblioteca", "Museo"], impostorWords: ["Plaza", "Teatro", "Librería", "Galería"] },
    "Escuela": { words: ["Pizarra", "Pupitre", "Profesor", "Examen"], impostorWords: ["Proyector", "Silla", "Director", "Deberes"] },
    "Casa": { words: ["Salón", "Cocina", "Baño", "Dormitorio"], impostorWords: ["Comedor", "Despensa", "Aseo", "Desván"] },
    "Verano": { words: ["Playa", "Piscina", "Arena", "Mar"], impostorWords: ["Río", "Lago", "Tierra", "Océano"] },
    "Transporte": { words: ["Coche", "Moto", "Autobús", "Camión"], impostorWords: ["Bici", "Patinete", "Tren", "Furgoneta"] },
    "Países Europa": { words: ["España", "Francia", "Italia", "Alemania"], impostorWords: ["Portugal", "Bélgica", "Grecia", "Holanda"] },

    // --- OBJETOS Y TECNOLOGÍA ---
    "Ropa Invierno": { words: ["Abrigo", "Bufanda", "Guantes", "Gorro"], impostorWords: ["Chaqueta", "Pañuelo", "Manoplas", "Sombrero"] },
    "Ropa Verano": { words: ["Camiseta", "Pantalón corto", "Bikini", "Chanclas"], impostorWords: ["Tirantes", "Bermudas", "Bañador", "Sandalias"] },
    "Baño": { words: ["Cepillo dientes", "Pasta", "Jabón", "Toalla"], impostorWords: ["Hilo dental", "Enjuague", "Gel", "Albornoz"] },
    "Herramientas": { words: ["Martillo", "Destornillador", "Taladro", "Sierra"], impostorWords: ["Mazo", "Llave inglesa", "Lijadora", "Hacha"] },
    "Cocina": { words: ["Sartén", "Olla", "Cuchillo", "Tenedor"], impostorWords: ["Wok", "Cazuela", "Tijeras", "Cuchara"] },
    "Redes Sociales": { words: ["Instagram", "TikTok", "Twitter", "Facebook"], impostorWords: ["Snapchat", "YouTube", "LinkedIn", "WhatsApp"] },
    "Consolas": { words: ["PlayStation", "Xbox", "Nintendo Switch", "PC Gamer"], impostorWords: ["Wii", "Game Boy", "PSP", "Tablet"] },

    // --- NATURALEZA Y CIENCIA ---
    "Insectos": { words: ["Mosca", "Mosquito", "Abeja", "Hormiga"], impostorWords: ["Avispa", "Polilla", "Escarabajo", "Araña"] },
    "Animales Salvajes": { words: ["León", "Tigre", "Elefante", "Jirafa"], impostorWords: ["Leopardo", "Pantera", "Rinoceronte", "Cebra"] },
    "Clima": { words: ["Lluvia", "Nieve", "Viento", "Tormenta"], impostorWords: ["Granizo", "Niebla", "Huracán", "Trueno"] },
    "Cuerpo Humano": { words: ["Mano", "Pie", "Ojo", "Boca"], impostorWords: ["Brazo", "Pierna", "Oreja", "Nariz"] },
    "Universo": { words: ["Sol", "Luna", "Estrella", "Planeta"], impostorWords: ["Cometa", "Satélite", "Galaxia", "Asteroide"] },

    // --- PROFESIONES Y HOBBIES ---
    "Música": { words: ["Guitarra", "Piano", "Batería", "Violín"], impostorWords: ["Bajo", "Teclado", "Tambor", "Violonchelo"] },
    "Profesiones Salud": { words: ["Médico", "Enfermero", "Dentista", "Cirujano"], impostorWords: ["Veterinario", "Farmacéutico", "Psicólogo", "Fisioterapeuta"] },
    "Profesiones Uniforme": { words: ["Policía", "Bombero", "Militar", "Piloto"], impostorWords: ["Guardia Civil", "Rescatista", "Marinero", "Azafata"] },
    "Arte": { words: ["Pintar", "Dibujar", "Esculpir", "Fotografiar"], impostorWords: ["Colorear", "Trazar", "Modelar", "Grabar"] },

    // --- CULTURA POP ---
    "Superhéroes DC": { words: ["Batman", "Superman", "Wonder Woman", "Flash"], impostorWords: ["Robin", "Aquaman", "Supergirl", "Linterna Verde"] },
    "Superhéroes Marvel": { words: ["Spiderman", "Iron Man", "Thor", "Hulk"], impostorWords: ["Capitán América", "Black Panther", "Doctor Strange", "Ant-Man"] },
    "Fantasía": { words: ["Dragón", "Mago", "Elfo", "Orco"], impostorWords: ["Grifo", "Brujo", "Enano", "Troll"] },
    "Terror": { words: ["Fantasma", "Vampiro", "Zombi", "Hombre Lobo"], impostorWords: ["Espectro", "Drácula", "Momia", "Monstruo"] },
    "Cine": { words: ["Actor", "Director", "Película", "Palomitas"], impostorWords: ["Extra", "Guionista", "Serie", "Refresco"] },
    
    // --- COLORES Y FORMAS ---
    "Colores": { words: ["Rojo", "Azul", "Verde", "Amarillo"], impostorWords: ["Naranja", "Violeta", "Turquesa", "Rosa"] },
    "Formas": { words: ["Cuadrado", "Círculo", "Triángulo", "Rectángulo"], impostorWords: ["Rombo", "Óvalo", "Pirámide", "Cubo"] }
};

// --- ESTADO ---
let state = {
    roomCode: null,
    playerId: null,
    playerName: null,
    isHost: false,
    role: null, 
    isDead: false,
    unsubRoom: null,
    unsubPlayers: null,
    timerInterval: null, 
    hostTimer: null,     
    playersCache: [],
    processingVotes: false // <--- NUEVO: EL CANDADO DE SEGURIDAD
};

const $ = (id) => document.getElementById(id);

// --- UTILIDADES ---
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $(id).classList.add('active');
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    if (tab === 'join') {
        document.querySelector('button[onclick="switchTab(\'join\')"]').classList.add('active');
        $('tab-join').classList.add('active');
    } else {
        document.querySelector('button[onclick="switchTab(\'create\')"]').classList.add('active');
        $('tab-create').classList.add('active');
    }
}

function toggleCard() {
    // Si el jugador está muerto, no dejamos girar la carta (opcional)
    if (state.isDead) return;

    const card = document.getElementById('cardInner');
    // Esto añade o quita la clase .flipped definida en el CSS
    card.classList.toggle('flipped');
}

// Formato MM:SS
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0'+s : s}`;
}

// --- CREACIÓN / UNIÓN ---
$('btnCreate').addEventListener('click', async () => {
    const name = $('usernameInput').value.trim();
    const code = $('createCodeInput').value.trim().toUpperCase();
    if (!name || code.length < 4) return alert("Nombre y código (mín 4) requeridos.");

    // Verificar y borrar si existe (limpieza sucia de hosts desconectados)
    const ref = db.collection("rooms").doc(code);
    const snap = await ref.get();
    if (snap.exists) {
        if(!confirm("Esa sala existe. Si eres el dueño anterior y se quedó colgada, acepta para reiniciarla. Si no, cancela y usa otro código.")) return;
        await cleanRoom(code); // Limpiar sala previa
    }

    $('btnCreate').innerText = "Creando...";
    
    await ref.set({
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "lobby", 
        hostName: name,
        round: 1,
        aliveCount: 1,
        timerEnd: null // Timestamp para sincronizar relojes
    });

    const pRef = await ref.collection("players").add({
        name, isHost: true, isDead: false, joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    setupGame(code, pRef.id, name, true);
});

$('btnJoin').addEventListener('click', async () => {
    const name = $('usernameInput').value.trim();
    const code = $('joinCodeInput').value.trim().toUpperCase();
    if (!name || !code) return alert("Faltan datos.");

    const ref = db.collection("rooms").doc(code);
    const snap = await ref.get();
    if (!snap.exists) return alert("Sala no existe.");
    if (snap.data().status !== 'lobby') return alert("Partida en curso.");

    const pRef = await ref.collection("players").add({
        name, isHost: false, isDead: false, joinedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    setupGame(code, pRef.id, name, false);
});

function setupGame(code, pid, name, isHost) {
    state.roomCode = code;
    state.playerId = pid;
    state.playerName = name;
    state.isHost = isHost;
    state.isDead = false;

    window.addEventListener('beforeunload', handleExit);
    
    // Listeners
    state.unsubRoom = db.collection("rooms").doc(code).onSnapshot(handleRoomUpdate);
    state.unsubPlayers = db.collection("rooms").doc(code).collection("players")
        .orderBy("joinedAt").onSnapshot(handlePlayersUpdate);

    enterLobby();
}

// --- MANEJO DE ESTADOS (CORE) ---
function handleRoomUpdate(snap) {
    if (!snap.exists) return exitGame(true);
    const room = snap.data();

    // Resetear candado si volvemos al lobby o empieza discusión
    if (room.status === 'lobby' || room.status === 'discussion') {
        state.processingVotes = false;
    }

    // ... resto de tu código updateTimerUI, roundDisplay, etc ...
    updateTimerUI(room.timerEnd);
    $('roundDisplay').innerText = room.round;
    if (room.status !== 'lobby') $('roundBadge').style.display = 'inline-block';
    
    // LIMPIEZA DE TIMERS
    if (state.isHost && state.hostTimer && room.status !== 'voting' && room.status !== 'discussion') {
        clearInterval(state.hostTimer);
        state.hostTimer = null;
    }

    switch (room.status) {
        // ... tus casos switch ...
        case 'lobby':
            showScreen('view-lobby');
            $('timerContainer').style.display = 'none';
            break;
        case 'discussion':
            setupGameScreen(room);
            showScreen('view-game');
            $('timerContainer').style.display = 'block';
            $('gameStatusText').innerText = "¡DISCUSIÓN! Debate quién miente.";
            if (state.isHost) checkTimerEnd(room.timerEnd, () => startVotingPhase());
            break;
        case 'voting':
            showScreen('view-voting');
            setupVotingScreen();
            $('timerContainer').style.display = 'block';
            $('voteStatus').innerText = "Elige sabiamente...";
            if (state.isHost) checkTimerEnd(room.timerEnd, () => endVotingPhase());
            break;
        case 'elimination':
            $('timerContainer').style.display = 'none';
            showScreen('view-elimination'); // <--- ESTA LÍNEA FALTABA
            showEliminationScreen(room);
            break;
        case 'gameover':
            $('timerContainer').style.display = 'none';
            showScreen('view-gameover');    // <--- ESTA LÍNEA FALTABA
            showGameOver(room);
            break;
    }
}

function handlePlayersUpdate(qs) {
    // ... tu código de pintar la lista de jugadores ...
    const list = $('lobbyPlayerList');
    list.innerHTML = "";
    state.playersCache = [];
    $('lobbyCount').innerText = qs.size;

    qs.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;
        state.playersCache.push(p);

        if (p.id === state.playerId) {
            state.isDead = p.isDead;
            if (state.isDead) document.body.classList.add('is-dead');
        }

        const div = document.createElement("div");
        div.className = "player-pill " + (p.isDead ? "dead" : "");
        div.innerHTML = `<i class="fas fa-user${p.isHost?'-tie':''}"></i> ${p.name}`;
        list.appendChild(div);
    });

    // LÓGICA DE DETECCIÓN DE TODOS LOS VOTOS
    // Agregamos: !state.processingVotes
    if (state.isHost && qs.size > 0 && isVotingActive() && !state.processingVotes) {
        const alive = state.playersCache.filter(p => !p.isDead);
        const votes = alive.filter(p => p.votedFor);
        
        // Si todos los vivos han votado, terminamos YA.
        if (votes.length === alive.length && alive.length > 0) {
            console.log("Todos han votado. Cerrando votación...");
            endVotingPhase(); 
        }
    }
}

function isVotingActive() {
    return $('view-voting').classList.contains('active');
}

// --- HOST: CONTROL DEL JUEGO ---
$('btnStartGame').addEventListener('click', async () => {
    if (state.playersCache.length < 3) return alert("Mínimo 3 jugadores.");
    startNewRound(true); // true = First round (assign roles)
});

async function startNewRound(firstRound = false) {
    const code = state.roomCode;
    const players = state.playersCache;
    
    let updates = {
        status: "discussion",
        timerEnd: Date.now() + (TIME_DISCUSSION * 1000)
    };

    if (firstRound) {
        // Asignar Impostor
        const impostor = players[Math.floor(Math.random() * players.length)];
        updates.impostorPlayerId = impostor.id;
        updates.round = 1;
        updates.aliveCount = players.length;
    } else {
        updates.round = firebase.firestore.FieldValue.increment(1);
    }

    // Elegir nuevas palabras (siempre nuevas para refrescar)
    const catKeys = Object.keys(CATEGORIES);
    const cat = catKeys[Math.floor(Math.random() * catKeys.length)];
    updates.category = cat;
    updates.victimWord = CATEGORIES[cat].words[Math.floor(Math.random() * CATEGORIES[cat].words.length)];
    updates.impostorWord = CATEGORIES[cat].impostorWords[Math.floor(Math.random() * CATEGORIES[cat].impostorWords.length)];

    // Limpiar votos
    const batch = db.batch();
    players.forEach(p => {
        batch.update(db.collection("rooms").doc(code).collection("players").doc(p.id), { votedFor: null });
    });
    batch.update(db.collection("rooms").doc(code), updates);
    await batch.commit();
}

$('btnForceVote').addEventListener('click', startVotingPhase);

async function startVotingPhase() {
    await db.collection("rooms").doc(state.roomCode).update({
        status: "voting",
        timerEnd: Date.now() + (TIME_VOTING * 1000)
    });
}

async function endVotingPhase() {
    // 1. Candado de seguridad
    if (state.processingVotes) return;
    state.processingVotes = true;

    // 2. Limpiar Timer
    if (state.hostTimer) clearInterval(state.hostTimer);
    state.hostTimer = null;

    // 3. Feedback Visual
    if (state.isHost) {
        $('voteStatus').innerText = "⏳ Confirmando resultados...";
        $('voteStatus').className = "status-text warning-text";
    }

    try {
        const roomRef = db.collection("rooms").doc(state.roomCode);
        const playersRef = roomRef.collection("players");
        
        const [roomSnap, playersSnap] = await Promise.all([roomRef.get(), playersRef.get()]);

        if (!roomSnap.exists) throw new Error("Sala no existe");

        const room = roomSnap.data();
        const players = playersSnap.docs.map(d => ({...d.data(), id: d.id}));
        const alivePlayers = players.filter(p => !p.isDead);

        // 4. Conteo de votos
        let votes = {};
        alivePlayers.forEach(p => {
            if (p.votedFor) votes[p.votedFor] = (votes[p.votedFor] || 0) + 1;
        });

        let maxVotes = 0;
        let eliminatedId = null;
        let isTie = false;

        for (const [pid, count] of Object.entries(votes)) {
            if (count > maxVotes) {
                maxVotes = count;
                eliminatedId = pid;
                isTie = false;
            } else if (count === maxVotes) {
                isTie = true;
                eliminatedId = null;
            }
        }

        if (maxVotes === 0) eliminatedId = null;

        // 5. Preparar datos (Asegurando que nada sea undefined)
        let nextStatus = 'elimination';
        let winner = null;
        // Default reason 'timeout' si no hay votos, 'tie' si empate, 'vote' si hay eliminado
        let reason = (maxVotes === 0) ? 'timeout' : (isTie ? 'tie' : 'vote');

        if (eliminatedId) {
            await playersRef.doc(eliminatedId).update({ isDead: true });
            
            // Lógica de victoria
            if (eliminatedId === room.impostorPlayerId) {
                nextStatus = 'gameover';
                winner = 'civilians';
            } else {
                const remaining = alivePlayers.length - 1;
                if (remaining <= 2) {
                    nextStatus = 'gameover';
                    winner = 'impostor';
                }
            }
        }

        console.log("Actualizando sala:", { nextStatus, eliminatedId, reason, winner });

        // 6. Actualizar BD
        await roomRef.update({
            status: nextStatus,
            lastEliminated: eliminatedId || null, // Asegurar null si es falso
            eliminationReason: reason,
            winner: winner || null, // Asegurar null si es falso
            timerEnd: null
        });
        
        // Liberar candado
        state.processingVotes = false;

    } catch (error) {
        console.error("Error FATAL en votación:", error);
        alert("Hubo un error calculando los votos. Revisa la consola (F12).");
        state.processingVotes = false;
        $('voteStatus').innerText = "Error. Inténtalo de nuevo.";
    }
}

$('btnNextRound').addEventListener('click', () => startNewRound(false));

// --- VISTAS Y TEMPORIZADOR ---
function updateTimerUI(endTime) {
    if (state.timerInterval) clearInterval(state.timerInterval);
    if (!endTime) return;

    state.timerInterval = setInterval(() => {
        const now = Date.now();
        const diff = Math.ceil((endTime - now) / 1000);
        
        if (diff <= 0) {
            $('timerDisplay').innerText = "00:00";
            $('timerContainer').classList.remove('urgent');
            
            // --- NUEVO: INVALIDAR VOTACIÓN LOCAL ---
            // Si estamos en la pantalla de votación y se acaba el tiempo, bloqueamos todo
            const voteBtns = document.querySelectorAll('.vote-btn');
            if (voteBtns.length > 0) {
                voteBtns.forEach(btn => {
                    btn.disabled = true; // Desactivar botón
                    btn.style.opacity = "0.5";
                    btn.style.cursor = "not-allowed";
                });
                
                // Si el usuario no había votado, le avisamos
                if ($('voteStatus').innerText !== "Voto enviado.") {
                    $('voteStatus').innerText = "Tiempo agotado. Voto anulado.";
                    $('voteStatus').classList.add('danger-text');
                }
            }
            // ----------------------------------------

            clearInterval(state.timerInterval);
        } else {
            $('timerDisplay').innerText = formatTime(diff);
            // Parpadeo rojo si quedan menos de 10 segundos
            if(diff <= 10) $('timerContainer').classList.add('urgent');
            else $('timerContainer').classList.remove('urgent');
        }
    }, 1000);
}

function checkTimerEnd(endTime, callback) {
    if (!endTime) return;
    
    // 1. Limpiamos cualquier temporizador previo para no duplicar
    if (state.hostTimer) clearInterval(state.hostTimer);

    // 2. Creamos uno nuevo
    state.hostTimer = setInterval(() => {
        const now = Date.now();
        
        // Si ya pasó el tiempo
        if (now >= endTime) {
            clearInterval(state.hostTimer);
            state.hostTimer = null; // Limpiar referencia
            
            // Feedback visual inmediato antes de procesar
            $('voteStatus').innerText = "Calculando resultados...";
            $('voteStatus').classList.add('warning-text');
            
            callback();
        }
    }, 1000);
}

function setupGameScreen(room) {
    const isImpostor = (state.playerId === room.impostorPlayerId);
    
    // UI del Rol
    document.body.className = isImpostor ? 'impostor-theme' : 'civilian-theme';
    $('roleTitle').innerText = isImpostor ? "Impostor" : "Civil";
    $('roleIcon').innerHTML = isImpostor ? '<i class="fas fa-user-secret"></i>' : '<i class="fas fa-user"></i>';
    $('categoryDisplay').innerText = room.category;
    $('secretWord').innerText = isImpostor ? room.impostorWord : room.victimWord;
    $('roleInstruction').innerText = isImpostor ? "Engaña a todos con tu palabra similar." : "Busca al que no encaja.";

    // Botones Host
    if (state.isHost) $('btnForceVote').style.display = 'inline-block';

    // MODO ESPECTADOR (Si estoy muerto)
    if (state.isDead) {
        document.body.classList.add('is-dead');
        $('spectatorBanner').style.display = 'block';
        $('cardInner').style.display = 'none'; // Ocultar mi carta
        $('gameStatusText').innerText = "Eres un fantasma. Observa.";
        
        // Mostrar info privilegiada
        $('spectatorInfoBox').style.display = 'block';
        const impName = state.playersCache.find(p => p.id === room.impostorPlayerId)?.name || "???";
        $('specImpostorName').innerText = impName;
        $('specCivilWord').innerText = room.victimWord;
        $('specImpostorWord').innerText = room.impostorWord;
    } else {
        $('spectatorBanner').style.display = 'none';
        $('spectatorInfoBox').style.display = 'none';
        $('cardInner').style.display = 'block';
    }
}

function setupVotingScreen() {
    const list = $('votingList');
    list.innerHTML = "";
    
    // Si estoy muerto, solo veo, no toco
    if (state.isDead) {
        $('voteStatus').innerText = "Los vivos están votando...";
        return;
    }

    state.playersCache.forEach(p => {
        if (p.isDead || p.id === state.playerId) return; // No votar muertos ni a mí mismo

        const btn = document.createElement("button");
        btn.className = "vote-btn";
        btn.innerHTML = `<span>${p.name}</span> <i class="far fa-circle"></i>`;
        
        btn.onclick = async () => {
            // UI Optimizada
            document.querySelectorAll('.vote-btn').forEach(b => { b.disabled = true; b.classList.remove('selected'); });
            btn.classList.add('selected');
            btn.querySelector('i').className = "fas fa-check-circle";
            $('voteStatus').innerText = "Voto enviado.";
            
            await db.collection("rooms").doc(state.roomCode).collection("players").doc(state.playerId).update({ votedFor: p.id });
        };
        list.appendChild(btn);
    });
}

function showEliminationScreen(room) {
    // PROTECCIÓN CONTRA CRASH:
    // Si lastEliminated es null o el jugador no está en caché, evitamos el error.
    let killedName = "Desconocido";
    if (room.lastEliminated) {
        const killedPlayer = state.playersCache.find(p => p.id === room.lastEliminated);
        if (killedPlayer) {
            killedName = killedPlayer.name;
        }
    }

    const icon = document.querySelector('.result-card i');
    const title = document.querySelector('.result-card h2');
    const nameDisplay = $('eliminatedName');
    const subtitle = document.querySelector('.result-card .subtitle');
    const reveal = $('eliminationReveal');

    // Resetear clases por defecto
    icon.className = "icon-big"; 
    nameDisplay.className = "big-name";

    // CASO 1: ALGUIEN FUE ELIMINADO
    if (room.lastEliminated && room.eliminationReason === 'vote') {
        icon.classList.add('fas', 'fa-skull-crossbones', 'danger-text');
        title.innerText = "Jugador Eliminado";
        nameDisplay.innerText = killedName; // Usamos la variable segura
        subtitle.innerText = "¿Era el impostor?";
        reveal.innerText = "Sus labios están sellados para siempre.";
    } 
    // CASO 2: EMPATE
    else if (room.eliminationReason === 'tie') {
        icon.classList.add('fas', 'fa-balance-scale', 'warning-text');
        title.innerText = "¡Empate!";
        nameDisplay.innerText = "Nadie eliminado";
        nameDisplay.style.fontSize = "1.5rem";
        subtitle.innerText = "Los votos estuvieron divididos.";
        reveal.innerText = "El juego continúa sin bajas.";
    }
    // CASO 3: TIEMPO AGOTADO / SIN VOTOS
    else {
        icon.classList.add('fas', 'fa-hourglass-end', 'safe-text');
        title.innerText = "Tiempo Agotado";
        nameDisplay.innerText = "Votación Anulada";
        nameDisplay.style.fontSize = "1.5rem";
        subtitle.innerText = "Nadie recibió votos suficientes.";
        reveal.innerText = "Tenéis otra oportunidad.";
    }
    
    // Solo el host ve el botón de siguiente ronda
    if (state.isHost) $('btnNextRound').style.display = 'inline-block';
}

function showGameOver(room) {
    const banner = $('gameOverBanner');
    const impName = state.playersCache.find(p => p.id === room.impostorPlayerId)?.name || "???";
    
    if (room.winner === 'civilians') {
        banner.className = "result-banner win-civilian";
        $('gameOverTitle').innerText = "¡VICTORIA CIVIL!";
        $('gameOverSubtitle').innerText = "El impostor ha sido expulsado.";
    } else {
        banner.className = "result-banner win-impostor";
        $('gameOverTitle').innerText = "¡VICTORIA IMPOSTORA!";
        $('gameOverSubtitle').innerText = "Los impostores dominan la nave.";
    }

    $('finalImpostorName').innerText = impName;
    $('finalWinners').innerText = room.winner === 'civilians' ? "El Pueblo" : "El Impostor";
}

function enterLobby() {
    showScreen('view-lobby');
    $('lobbyRoomCode').innerText = state.roomCode;
    $('lobbyStatus').innerText = state.isHost ? "Esperando jugadores..." : "Esperando al host...";
    if (state.isHost) $('btnStartGame').style.display = 'inline-block';
}

// --- LIMPIEZA ---
async function cleanRoom(code) {
    const rRef = db.collection("rooms").doc(code);
    const pSnaps = await rRef.collection("players").get();
    const batch = db.batch();
    pSnaps.forEach(d => batch.delete(d.ref));
    batch.delete(rRef);
    await batch.commit();
}

async function handleExit() {
    if (state.isHost && state.roomCode) {
        await cleanRoom(state.roomCode);
    }
}

async function exitGame(forced) {
    if (state.isHost && !forced) {
        if(!confirm("Cerrarás la sala para todos. ¿Seguro?")) return;
        await handleExit();
    }
    window.location.reload();
}