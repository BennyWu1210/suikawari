
'''
1. OpenCV to capture the video from the webcam
2. Apply object detection with YOLOv8
3. Pass detected objects (e.g., "car, 80% confidence") to an LLM (via OpenAI API or similar) to generate text descriptions.
4. Every 30 seconds, also pass image to vision API to describe the whole scene (e.g., "a beautiful sunset over the ocean")
5. Send real-time text responses back to the frontend.
'''


from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# To store WebRTC signaling data temporarily
cameraSID = None

@app.route('/')
def index():
    # Endpoint to serve the camera streaming page
    return render_template('index.html')

@app.route('/viewer')
def viewer():
    # Endpoint to serve the viewer page
    return render_template('viewer.html')

@socketio.on('connect')
def handle_connect():
    # Event handler for new WebSocket connections
    # if the client is a camera, store its SID
    # if the client is a viewer, send the camera SID
    if cameraSID is not None:
        emit("requestForOffer", request.sid, to=cameraSID)
        print("Requesting offer from camera")

@socketio.on('iamcamera')
def handle_camera():
    # Event handler for camera identification
    # store the camera SID
    global cameraSID
    cameraSID = request.sid
    print("Camera connected")

@socketio.on('offer')
def handle_offer(data):
    # Event handler for WebRTC offer messages
    # data['viewer'] is the SID of the viewer

    # send the offer to the viewer
    emit("requestForAnswerPlOffer", data['offer'], to=data['viewer'])
    print("Got offer. Requesting answer from viewer and sending offer")

@socketio.on('answer')
def handle_answer(data):
    # Event handler for WebRTC answer messages
    # data['camera'] is the SID of the camera

    # store the answer data for the camera
    # send the answer to the camera
    emit("answerFromViewer", {"answer": data['answer'], "viewer": request.sid}, to=cameraSID)
    print("Got answer from viewer and sending it to camera")

if __name__ == '__main__':
    socketio.run(app, debug=True)