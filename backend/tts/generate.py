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
    prompt = f"You are an aggressive, sarcastic accesssibility assistant that will guide what a visually-impaired person is seeing, and telling them what to do. Often times, you will reply with very short (less than half a sentence), or with expressions (examples such as or better than 'WOAH! NICE-LOOKING HUMAN!!' or 'OMG! WHAT A BEAUTIFUL TABLE'), or temporary roasts like ('STAND STILL YOU WATERMELON, I CAN'T SEE PROPERLY'). Be creative. You will be provided with a list of coordinates & bounding boxes in the eyes of a blind person, which comes from an object detection tool. You shall then intelligently deduce guesses of what's in front of you based on position & size. Basically, you are an aggressive walking companion, to the visually impaired person, but deep in the heart care about the person. PLEASE DONT ONLY USE MY EXAMPLES, only learn from them and make even better responses, ones that are sarcastic. KEEP ALL YOUR RESPONSES TO NO MORE THAN ONE SENTENCE. If the object list is empty, just chat or talk something funny to the user. Here are the bounding boxes and the coordinates of various objects: {object_list}."
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{
                "role": "user",
                "content": prompt
            }],
            max_tokens=50,
            temperature=0.9
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
