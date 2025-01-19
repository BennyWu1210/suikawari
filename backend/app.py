from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, send, emit
import asyncio
import cv2
import socketio
import base64
import numpy as np
import time
import os
from ultralytics import YOLO
from tts.generate import generate_description
from tts.coqui import generate_audio

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
model = YOLO("yolov8n.pt")  # Replace with your model path

# To store WebRTC signaling data temporarily
cameraSID = None
otherCameras = []
prossessingServer = None
comments = []

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

# @socketio.on('processResult')
# def process_result(data):
#     print("PROCESSING APP.PY 59")
#     emit("processResult", data, to=data['viewer'])
#     print("Sending process result")

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

    

count = time.time()

@socketio.on('image')
def handle_image(data):
    global count
    # emit the image to the processing server
    image_data = data['image'].split(",")[1]  # Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
    binary_image = base64.b64decode(image_data)

    # Convert binary data to a NumPy array
    np_array = np.frombuffer(binary_image, dtype=np.uint8)
    
    print(count, time.time() + 100)
    

    if count > time.time() - 8:
        return
        
    count = time.time()

    print("STARTED")
    
    # Decode the image into a usable OpenCV format
    img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    if img is None:
        print("Failed to decode image")
        return

    print("STARTED")

    # YOLOv8 Inference
    results = model.predict(img, verbose=False)

    # Extract coordinates and labels
    frame_objects = []
    for box in results[0].boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
        cls = int(box.cls[0])  # Class index
        label = model.names[cls]  # Class label
        frame_objects.append({"label": label, "coordinates": (x1, y1, x2, y2)})

    
    # Parse it into a list of strings
    object_labels = [f'label: {obj["label"]} coordinates: {obj["coordinates"]}' for obj in frame_objects]

    # Generate a natural language description
    description = generate_description(object_labels)

    print(description)

    # TODO: Audio 
    # generate_audio(description, output_path="output.wav")

    # Read the generated audio file and encode it as Base64
    # with open("output.wav", "rb") as audio_file:
    #     audio_base64 = base64.b64encode(audio_file.read()).decode('utf-8')

    # Send detection results and audio data back
    emit('processResult', {
        'result': description}, to=request.sid,
        # 'audio': audio_base64
    )


@socketio.on('comment')
def handle_comment(data):
    comments.append(data)
    emit('comment', data, broadcast=True)

# This needs something like
# socket.on('comment', (data) => {
#     CODE THAT ADDS THE COMMENT TO THE UI
#})

@socketio.on('getComments')
def get_comments():
    emit('comments', comments)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=8000)