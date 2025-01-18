const socket = io();

const servers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:your.turn.server:3478', username: 'user', credential: 'password' }
    ]
};

async function apex() {
    socket.emit('apexCamera');
}

async function camera() {
    socket.emit('iamcamera');
}

async function setupCamera() {
    const videoElement = document.getElementById('camera');
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    videoElement.srcObject = stream;

    const peerConnections = {}; // Map viewer SIDs to their peer connections

    socket.on('requestForOffer', async (viewerSID) => {
        const peerConnection = new RTCPeerConnection(servers);
        peerConnections[viewerSID] = peerConnection;

        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('ice-candidate', { candidate: event.candidate, to: viewerSID });
            }
        };

        // Add camera's tracks to this connection
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        // Create and send offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription();
        socket.emit('offer', { offer: peerConnection.localDescription, viewer: viewerSID });
    });

    // Receive viewer's answer
    socket.on('answerFromViewer', (data) => {
        const { viewer, answer } = data;
        const peerConnection = peerConnections[viewer];
        peerConnection.setRemoteDescription(answer);
    });

    // Receive ICE candidates
    socket.on('ice-candidate', (data) => {
        const peerConnection = peerConnections[data.from];
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });


}

async function setupViewer() {
    const videoElement = document.getElementById('viewer');
    const peerConnection = new RTCPeerConnection(servers);

    videoElement.autoplay = true;
    videoElement.muted = true;

    // Listen for an offer from the camera
    socket.on('requestForAnswerPlOffer', async (data) => {
        // Handle ICE candidates
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('ice-candidate', {candidate: event.candidate, to: data.camera, from: socket.id});
            }
        };

        // Handle incoming tracks
        const localStream = new MediaStream();
        peerConnection.ontrack = event => {
            localStream.addTrack(event.track);
        };
        videoElement.srcObject = localStream;

        // Set remote description and create answer
        await peerConnection.setRemoteDescription(data.offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription();
        socket.emit('answer', {answer: peerConnection.localDescription});
    });

        // Receive ICE candidates
    socket.on('ice-candidate', (data) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

}
