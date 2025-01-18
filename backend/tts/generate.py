from openai import OpenAI
import pyttsx3
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=api_key)

# Initialize Text-to-Speech engine
tts_engine = pyttsx3.init()
tts_engine.setProperty("rate", 150)  # Adjust speaking rate if needed

def generate_description(objects):
    """
    Generate a natural language description of detected objects using OpenAI API.
    """
    object_list = ", ".join(objects)
    prompt = f"Describe the following objects & what's in front of you based on coordinate and size. {object_list}."
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": prompt
            }],
            max_tokens=50
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error with OpenAI API: {e}")
        return "Unable to generate a description."

def speak_text(text):
    """
    Convert text to speech using pyttsx3.
    """
    tts_engine.say(text)
    tts_engine.runAndWait()

if __name__ == "__main__":
    # Example usage
    detected_objects = ["person", "car", "dog"]
    description = generate_description(detected_objects)
    print(f"Description: {description}")
    speak_text(description)
