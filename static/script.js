const socket = io();

const servers = {
    iceServers: [
        {
            urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
        },
    ],
    iceCandidatePoolSize: 20,
}

async function setupCamera() {
    const videoElement = document.getElementById('camera');
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    videoElement.srcObject = stream;

    const peerConnections = {}; // Map viewer SIDs to their peer connections

    socket.emit('iamcamera');

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
        await peerConnection.setLocalDescription(offer);
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
        await peerConnection.setLocalDescription(answer);
        socket.emit('answer', {answer: peerConnection.localDescription});
    });

        // Receive ICE candidates
    socket.on('ice-candidate', (data) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

}
