import { io } from "socket.io-client"; // Import io from socket.io-client

let socket; // Declare socket variable outside

export function initializeSocket() {
  if (!socket) {
    socket = io("http://localhost:8000"); // Initialize socket with your backend URL
  }
  return socket;
}

const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "turn:your.turn.server:3478", username: "user", credential: "password" },
  ],
};

export async function setupCamera(videoElement) {
  if (typeof window === "undefined") return; // Ensure this runs only in the browser

  const socket = initializeSocket(); // Ensure socket is initialized
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  videoElement.srcObject = stream;

  const peerConnections = {}; // Map viewer SIDs to their peer connections

  socket.emit("iamcamera");

  socket.on("requestForOffer", async (viewerSID) => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnections[viewerSID] = peerConnection;

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { candidate: event.candidate, to: viewerSID });
      }
    };

    // Add camera's tracks to this connection
    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    // Create and send offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription();
    socket.emit("offer", { offer: peerConnection.localDescription, viewer: viewerSID });
  });

  // Receive viewer's answer
  socket.on("answerFromViewer", (data) => {
    const { viewer, answer } = data;
    const peerConnection = peerConnections[viewer];
    peerConnection.setRemoteDescription(answer);
  });

  // Receive viewer's answer
  socket.on("answerFromViewer", (data) => {
    const { response, to } = data;
    alert("sent");
    console.log(response, to);
  });


  // Receive ICE candidates
  socket.on("ice-candidate", (data) => {
    const peerConnection = peerConnections[data.from];
    peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  });
}

export async function setupViewer(videoElement) {
    if (typeof window === "undefined") return; // Ensure this runs only in the browser

    const socket = initializeSocket();
    const peerConnection = new RTCPeerConnection(servers);

    const localStream = new MediaStream();
    videoElement.srcObject = localStream;

    // Queue for ICE candidates received before remote description is set
    const candidateQueue = [];
    let remoteDescriptionSet = false;

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("ice-candidate", { candidate: event.candidate, to: data.camera });
        }
    };

    peerConnection.ontrack = (event) => {
        localStream.addTrack(event.track);
    };

    socket.on("requestForAnswerPlOffer", async (data) => {
        await peerConnection.setRemoteDescription(data.offer);
        remoteDescriptionSet = true;

        // Process queued ICE candidates
        while (candidateQueue.length > 0) {
            const candidate = candidateQueue.shift();
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit("answer", { answer: peerConnection.localDescription, camera: data.camera });
    });
    
    socket.on("ice-candidate", async (data) => {
        if (!remoteDescriptionSet) {
            // Queue the candidate if remote description is not set
            candidateQueue.push(data.candidate);
        } else {
            // Add the ICE candidate immediately if remote description is set
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    });
}
