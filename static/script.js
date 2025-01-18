const socket = io();

async function setupCamera() {
    const videoElement = document.getElementById('camera');

    // Access the camera stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    videoElement.srcObject = stream;

    const peerConnection = new RTCPeerConnection();
    stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

    socket.emit('iamcamera');

    socket.on('requestForOffer', async (viewerSID) => {
        // Generate an offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send the offer to the viewer
        socket.emit('offer', { offer: offer, viewer: viewerSID });
    });

    // Listen for an answer from the viewer
    socket.on('answerFromViewer', async (answer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });
}

async function setupViewer() {
    const videoElement = document.getElementById('viewer');

    const peerConnection = new RTCPeerConnection();
    peerConnection.ontrack = (event) => {
        videoElement.srcObject = event.streams[0];
    };

    // Listen for an offer from the camera
    socket.on('requestForAnswerPlOffer', async (offer) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        // Generate an answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Send the answer back to the camera
        socket.emit('answer', { answer:answer});
    });
}
