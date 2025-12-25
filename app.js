const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "impostor-online-11805.firebaseapp.com",
  projectId: "impostor-online-11805",
  storageBucket: "impostor-online-11805.appspot.com",
  messagingSenderId: "409319191950",
  appId: "1:409319191950:web:...",
  measurementId: "G-..."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const WORDS = [
  "Playa","Hospital","Escuela","Aeropuerto","Restaurante,",
  "Cine","Gimnasio","Supermercado","Banco","Discoteca",
  "Hotel","Iglesia","Parque","Estadio","Biblioteca"
];

const $ = (id) => document.getElementById(id);

let myRoomCode = null;
let myPlayerId = null;
let iAmHost = false;
let unsubRoom = null;
let unsubPlayers = null;

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function roomExists(code){
  const snap = await db.collection("rooms").doc(code).get();
  return snap.exists;
}

async function createRoom(){
  $("status").textContent = "Creando sala...";
  let code = genCode();
  while (await roomExists(code)) code = genCode();

  const word = WORDS[Math.floor(Math.random() * WORDS.length)];

  await db.collection("rooms").doc(code).set({
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    status: "lobby", // lobby | started
    word,
    impostorPlayerId: null
  });

  myRoomCode = code;
  iAmHost = true;

  $("hostPanel").style.display = "block";
  $("roomCodeBig").textContent = code;
  $("status").textContent = "Sala creada. Ahora entra como jugador abajo (mismo código).";
}

async function joinRoom(){
  const code = $("roomCodeInput").value.trim().toUpperCase();
  const name = $("nameInput").value.trim();

  if (code.length !== 6) return alert("Código inválido (6 caracteres)");
  if (!name) return alert("Pon tu nombre");

  const roomRef = db.collection("rooms").doc(code);
  const roomSnap = await roomRef.get();
  if (!roomSnap.exists) return alert("Esa sala no existe");

  const playerRef = await roomRef.collection("players").add({
    name,
    joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
    revealed: false
  });

  myRoomCode = code;
  myPlayerId = playerRef.id;

  $("playerPanel").style.display = "block";
  $("roomCodeSmall").textContent = code;
  $("playerName").textContent = name;
  $("status").textContent = "Conectado. Espera a que el host inicie.";

  listenRoom(code);
  listenPlayers(code);
}

function listenRoom(code){
  if (unsubRoom) unsubRoom();
  const roomRef = db.collection("rooms").doc(code);

  unsubRoom = roomRef.onSnapshot((snap) => {
    if (!snap.exists) return;
    const room = snap.data();

    if (room.status === "started") {
      $("revealBtn").disabled = false;
      $("hint").textContent = "Dale a “Ver mi palabra”.";
    }
  });
}

function listenPlayers(code){
  if (unsubPlayers) unsubPlayers();
  const playersRef = db.collection("rooms").doc(code).collection("players").orderBy("joinedAt","asc");

  unsubPlayers = playersRef.onSnapshot((qs) => {
    $("playersCount").textContent = String(qs.size);

    const list = $("playersList");
    if (list) {
      list.innerHTML = "";
      qs.forEach((d) => {
        const p = d.data();
        const el = document.createElement("span");
        el.className = "pill";
        el.textContent = p.name;
        list.appendChild(el);
      });
    }
  });
}

async function startGame(){
  if (!myRoomCode) return alert("No hay sala");
  const roomRef = db.collection("rooms").doc(myRoomCode);
  const playersSnap = await roomRef.collection("players").get();

  if (playersSnap.size < 3) return alert("Mínimo 3 jugadores");

  const ids = playersSnap.docs.map(d => d.id);
  const impostorId = ids[Math.floor(Math.random() * ids.length)];

  await roomRef.update({
    status: "started",
    impostorPlayerId: impostorId
  });

  $("status").textContent = "Juego iniciado ✅";
}

async function revealRole(){
  if (!myRoomCode || !myPlayerId) return;

  const roomRef = db.collection("rooms").doc(myRoomCode);
  const roomSnap = await roomRef.get();
  const room = roomSnap.data();

  const roleBox = $("roleBox");
  roleBox.style.display = "block";

  if (room.impostorPlayerId === myPlayerId) {
    roleBox.textContent = "IMPOSTOR 😈";
  } else {
    roleBox.textContent = room.word;
  }

  // opcional: marcar revelado
  await roomRef.collection("players").doc(myPlayerId).update({ revealed: true });
}

$("createRoomBtn").addEventListener("click", createRoom);
$("joinBtn").addEventListener("click", joinRoom);
$("startBtn").addEventListener("click", startGame);
$("revealBtn").addEventListener("click", revealRole);
