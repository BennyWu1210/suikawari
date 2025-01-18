import asyncio
import cv2
import socketio
import base64
import numpy as np


# Socket.IO client
sio = socketio.AsyncClient()

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

        # Decode the image into a usable OpenCV format
        img = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

        if img is None:
            print("Failed to decode image")
            return

        # Process the image (example: display it)
        cv2.imshow("Received Image", img)
        print("Image displayed")
        cv2.waitKey(1)  # Wait for a short time to refresh the display
    except Exception as e:
        print(f"Error handling image: {e}")

    # send the response as text to processResult socket
    await sio.emit('processResult', {'result': 'result received', 'viewer': data['viewer']})


async def main():
    # Connect to the signaling server
    await sio.connect('http://localhost:8000')
    await sio.wait()

# Run the event loop
loop = asyncio.get_event_loop()
try:
    loop.run_until_complete(main())
except KeyboardInterrupt:
    pass
