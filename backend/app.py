from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# To store WebRTC signaling data temporarily
cameraSID = None
otherCameras = []
prossessingServer = None

@app.route('/')
def index():
    # Endpoint to serve the camera streaming page
    return render_template('index.html')

@app.route('/viewer')
def viewer():
    # Endpoint to serve the viewer page
    return render_template('viewer.html')

@app.route('/apex')
def apex():
    # Endpoint to serve the viewer page
    return render_template('page.tsx')

@socketio.on('connect')
def handle_connect():
    # Event handler for new WebSocket connections
    # if the client is a camera, store its SID
    # if the client is a viewer, send the camera SID
    if cameraSID is not None:
        emit("requestForOffer", request.sid, to=cameraSID)
        print("Requesting offer from camera", request.sid)

@socketio.on('iamcamera')
def handle_camera():
    # Event handler for camera identification
    # store the camera SID
    global cameraSID
    global otherCameras
    otherCameras.append(request.sid)
    print("Camera is ", request.sid)

@socketio.on('apexCamera')
def handle_apex_camera():
    global cameraSID
    cameraSID = request.sid
    print("Apex camera is ", cameraSID)

@socketio.on('processingServer')
def handle_processing_server():
    global prossessingServer
    prossessingServer = request.sid
    print("Processing server is ", prossessingServer)

@socketio.on('processResult')
def process_result(data):
    print("PROCESSING APP.PY 59")
    emit("processResult", data, to=data['viewer'])
    print("Sending process result")

@socketio.on('disconnect')
def handle_disconnect():
    global cameraSID
    if request.sid == cameraSID:
        cameraSID = None
    elif request.sid in otherCameras:
        otherCameras.remove(request.sid)


@socketio.on('offer')
def handle_offer(data):
    # Event handler for WebRTC offer messages
    # data['viewer'] is the SID of the viewer

    # send the offer to the viewer
    emit("requestForAnswerPlOffer", {"offer": data['offer'], "camera": cameraSID}, to=data['viewer'])
    print("Got offer. Requesting answer from viewer and sending offer, offer: ", data['offer'])

@socketio.on('answer')
def handle_answer(data):
    # Event handler for WebRTC answer messages
    # data['camera'] is the SID of the camera

    # store the answer data for the camera
    # send the answer to the camera
    emit("answerFromViewer", {"answer": data['answer'], "viewer": request.sid}, to=cameraSID)
    print("Got answer from viewer and sending it to camera. Answer:", data['answer'])


@socketio.on('ice-candidate')
def handle_ice_candidate(data):
    emit('ice-candidate', data, to=data['to'])

@socketio.on('image')
def handle_image(data):
    # emit the image to the processing server
    print("Got image from camera, sending it to processing server")
    emit('image', {"image": data['image'], "viewer": request.sid}, to=prossessingServer)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=8000)