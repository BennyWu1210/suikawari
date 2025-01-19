import { io } from "socket.io-client";
import { BACKEND_URL } from "./backend";

let socket;

export function initializeSocket() {
  if (!socket) {
    socket = io(BACKEND_URL);
  }
  return socket;
}

const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:your.turn.server:3478",
      username: "user",
      credential: "password",
    },
  ],
};

export async function apex() {
  const socket = initializeSocket();

  if (!socket.connected) {
    await new Promise((resolve) => {
      socket.on("connect", resolve);
    });
  }

  socket.on("processResult", (data) => {
    console.log(data);
    // var msg = new SpeechSynthesisUtterance();
    // msg.text = data.result;
    // window.speechSynthesis.speak(msg);
    var msg = new SpeechSynthesisUtterance();
    msg.rate = 1.1; // Speed of speech
    msg.pitch = 1.2; // Pitch of voice
    msg.volume = 1; // Volume level
    msg.text = data.result;
    window.speechSynthesis.speak(msg);
  });

  socket.emit("apexCamera");
  console.log("Apex camera notified to the server.");
}

export async function setupCamera(videoElement) {
  if (typeof window === "undefined") return;

  const socket = initializeSocket();

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: "environment" } },
    audio: false,
  });
  videoElement.srcObject = stream;

  const peerConnections = {};
  socket.emit("iamcamera");
  socket.on("requestForOffer", async (viewerSID) => {
    const peerConnection = new RTCPeerConnection(servers);
    peerConnections[viewerSID] = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: viewerSID,
        });
      }
    };

    stream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, stream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit("offer", {
      offer: peerConnection.localDescription,
      viewer: viewerSID,
    });
  });

  socket.on("answerFromViewer", (data) => {
    const { viewer, answer } = data;
    const peerConnection = peerConnections[viewer];
    if (peerConnection) {
      peerConnection.setRemoteDescription(answer);
    }
  });

  // Receive viewer's answer
  socket.on("answerFromViewer", (data) => {
    const { response, to } = data;
    console.log(response, to);
  });

  socket.on("ice-candidate", (data) => {
    const peerConnection = peerConnections[data.from];
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  });
}

export async function camera() {
  // Set up the webcam and canvas
  const video = document.getElementById("camera");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const socket = initializeSocket();

  console.log("Camera function called");

  let sema = true; // Semaphore to prevent multiple image captures

  // // on socket.io processResult console log the result
  // socket.on("processResult", (data) => {
  //   console.log(data);
  //   // var msg = new SpeechSynthesisUtterance();
  //   // msg.text = data.result;
  //   // window.speechSynthesis.speak(msg);
  //   var msg = new SpeechSynthesisUtterance();
  //   msg.rate = 1.1; // Speed of speech
  //   msg.pitch = 1.2; // Pitch of voice
  //   msg.volume = 1; // Volume level
  //   msg.text = data.result;
  //   window.speechSynthesis.speak(msg);
  // });

  // Function to initialize the webcam
  async function initWebcam() {
    try {
      video.srcObject = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      video.play();

      // Wait for the video to be ready
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Start capturing and sending images every second
        setInterval(captureAndSendImage, 100); // Call every 1000ms (1 second)
      };
    } catch (error) {
      console.error("Error accessing the webcam:", error);
    }
  }

  // Function to capture an image and send it to the server
  function captureAndSendImage() {
    // Draw the current frame from the video onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas image to a base64-encoded string
    const imageData = canvas.toDataURL("image/jpeg", 0.7); // Adjust quality as needed (0.7 is 70%)

    // Send the image data to the server
    socket.emit("image", { image: imageData });
    if (new Date().getMilliseconds() % 1000 === 0) {
      console.log("Image sent at", new Date().toISOString());
    }
  }

  // Start the process
  await initWebcam();

  return socket;
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
      socket.emit("ice-candidate", {
        candidate: event.candidate,
        to: data.camera,
      });
    }
  };

  peerConnection.ontrack = (event) => {
    localStream.addTrack(event.track);
  };

  peerConnection.oniceconnectionstatechange = function () {
    if (peerConnection.iceConnectionState == "disconnected") {
      location.reload();
    }
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
    socket.emit("answer", {
      answer: peerConnection.localDescription,
      camera: data.camera,
    });
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
