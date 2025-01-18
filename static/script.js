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
    // Set up the webcam and canvas
    const video = document.getElementById('camera');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    console.log("Camera function called");

    let sema = true; // Semaphore to prevent multiple image captures

    // on socket.io processResult console log the result
    socket.on('processResult', (data) => {
        console.log(data);
    });

    // Function to initialize the webcam
    async function initWebcam() {
        try {
            video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
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
        const imageData = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality as needed (0.7 is 70%)

        // Send the image data to the server
        socket.emit('image', { image: imageData });
        console.log("Image sent at", new Date().toISOString());
    }

    // Start the process
    await initWebcam();
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
