import asyncio
import cv2
import socketio
import base64
import numpy as np
import time
import base64
import os
from ultralytics import YOLO
from tts.generate import generate_description
from tts.coqui import generate_audio


# Socket.IO client
sio = socketio.AsyncClient()
model = YOLO("yolov8n.pt")  # Replace with your model path

@sio.on('connect')
async def on_connect():
    print('Connected to the signaling server')
    await sio.emit('processingServer')
    print('Sent the processing server message')

@sio.on('image')
async def handle_offer(data):
    # load the image using cv2 and show it using cv2.imshow
    try:
        # Extract and decode the base64 image string
        image_data = data['image'].split(",")[1]  # Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        binary_image = base64.b64decode(image_data)

        # Convert binary data to a NumPy array
        np_array = np.frombuffer(binary_image, dtype=np.uint8)
        
        
        # REMOVE ME: For testing purposes, we limit the incoming frame processing rate
        if round(time.time()) % 3 != 0:
            return

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
        sio.emit('processResult', {
            'result': description,
            'viewer': data['viewer'],
            # 'audio': audio_base64
        })

        # cv2.imshow("Received Image", img)
        # print("Image displayed")
        # cv2.waitKey(1)  # Wait for a short time to refresh the display
    except Exception as e:
        print(f"Error handling image: {e}")

    # send the response as text to processResult socket
    # await sio.emit('processResult', {'result': 'no result sent this time', 'viewer': data['viewer']})


async def main():
    # Connect to the signaling server
    await sio.connect('https://suikawari.photo')
    # await sio.connect('http://localhost:8000')
    await sio.wait()

# Run the event loop
loop = asyncio.get_event_loop()
try:
    loop.run_until_complete(main())
except KeyboardInterrupt:
    pass