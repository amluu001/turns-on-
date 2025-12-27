// Card categories
const cards = {
  spicy: [
    "Tell your partner what you like most about them",
    "Send a flirty look for 10 seconds",
    "Describe your favorite memory together"
  ],
  hot: [
    "Whisper something bold",
    "Hold eye contact for 10 seconds",
    "Describe a fantasy in one sentence"
  ],
  wild: [
    "Create a rule for the next round",
    "Switch who draws the next card",
    "Both stay silent for 15 seconds"
  ]
};

// PeerJS variables
let peer, conn;

function createRoom() {
  const roomCode = Math.random().toString(36).substring(2, 8); // random 6-char code
  setupPeer(roomCode, true);
  alert("Room created! Share this code with your partner: " + roomCode);
}

function joinRoom() {
  const roomCode = document.getElementById("roomCode").value;
  if (!roomCode) { alert("Enter a room code"); return; }
  setupPeer(roomCode, false);
}

function setupPeer(roomCode, isHost) {
  peer = new Peer(roomCode, { debug: 2 });
  peer.on('open', id => {
    console.log("Connected with ID:", id);
    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    // Embed Jitsi
    document.getElementById("jitsi").src = "https://meet.jit.si/" + roomCode;
  });

  if (isHost) {
    peer.on('connection', connection => {
      conn = connection;
      conn.on('data', data => {
        document.getElementById("cardText").innerText = data;
      });
    });
  } else {
    conn = peer.connect(roomCode);
    conn.on('open', () => {
      conn.on('data', data => {
        document.getElementById("cardText").innerText = data;
      });
    });
  }
}

function drawCard(category) {
  const list = cards[category];
  const random = Math.floor(Math.random() * list.length);
  const cardText = list[random];
  document.getElementById("cardText").innerText = cardText;
  // send to partner
  if (conn && conn.open) { conn.send(cardText); }
}
