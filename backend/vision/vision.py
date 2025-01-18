from ultralytics import YOLO
import cv2

def get_coordinates(video_source=0):
    """
    Continuously detect objects and yield their coordinates and labels.
    """
    # Load YOLOv8 model
    model = YOLO("yolov8n.pt")

    # Open video source (0 for webcam)
    cap = cv2.VideoCapture(video_source)

    try:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Run YOLOv8 prediction on the current frame
            results = model.predict(frame, verbose=False)

            # Extract coordinates and labels
            frame_objects = []
            for box in results[0].boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
                cls = int(box.cls[0])  # Class index
                label = model.names[cls]  # Class label
                frame_objects.append({"label": label, "coordinates": (x1, y1, x2, y2)})

            # Yield results for the current frame
            yield frame_objects

            # (Optional) Display the frame with bounding boxes for debugging
            for obj in frame_objects:
                x1, y1, x2, y2 = obj["coordinates"]
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, obj["label"], (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            cv2.imshow("YOLOv8 Detection", frame)

            # Break the loop on 'q' key press
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    finally:
        # Release resources
        cap.release()
        cv2.destroyAllWindows()

import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tts.generate import generate_description, speak_text

if __name__ == "__main__":
    for detected_objects in get_coordinates():
        # Extract object labels
        object_labels = [f'label: {obj["label"]} coordinates: {obj["coordinates"]}' for obj in detected_objects]

        if object_labels:
            # Generate and speak description
            description = generate_description(object_labels)
            print(f"Description: {description}")
            speak_text(description)