# from TTS.api import TTS

# def generate_audio(text: str, output_path: str = "output.wav", model_name: str = "tts_models/en/ljspeech/tacotron2-DDC"):
#     """
#     Generate audio from text using Coqui TTS.

#     Args:
#         text (str): The text to convert to speech.
#         output_path (str): The path to save the output audio file.
#         model_name (str): The name of the pretrained TTS model to use.

#     Returns:
#         str: The path of the generated audio file.
#     """
#     try:
#         # Initialize the TTS model
#         tts = TTS(model_name=model_name)
        
#         # Generate audio
#         tts.tts_to_file(text=text, file_path=output_path)
        
#         print(f"Audio generated successfully! File saved at: {output_path}")
#         return output_path
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return None

# # Example usage
# if __name__ == "__main__":
#     # Sample text
#     sample_text = "Hello, this is a test of Coqui TTS."
    
#     # Output audio file
#     audio_file = "sample_output.wav"
    
#     # Generate the audio
#     generate_audio(sample_text, output_path=audio_file)


import torch
from TTS.api import TTS

# Get device
device = "cuda" if torch.cuda.is_available() else "cpu"

# List available 🐸TTS models
print(TTS().list_models())

# Initialize TTS
tts = TTS("tts_models/en/ljspeech/tacotron2-DDC").to(device)

# List speakers
# print(tts.speakers)

# Run TTS
# ❗ XTTS supports both, but many models allow only one of the `speaker` and
# `speaker_wav` arguments

# TTS with list of amplitude values as output, clone the voice from `speaker_wav`
# wav = tts.tts(
#   text="Hello, this is some text!",
#   speaker_wav="my/cloning/output.wav",
# )

# TTS to a file, use a preset speaker

def generate_audio(text: str, output_path: str = "output.wav", model_name: str = "tts_models/en/ljspeech/tacotron2-DDC"):
    """
    Generate audio from text using Coqui TTS.

    Args:
        text (str): The text to convert to speech.
        output_path (str): The path to save the output audio file.
        model_name (str): The name of the pretrained TTS model to use.

    Returns:
        str: The path of the generated audio file.
    """
    try:      
        # Generate audio
        print("Generating audio...")
        tts.tts_to_file(text=text, file_path=output_path)
        
        print(f"Audio generated successfully! File saved at: {output_path}")
        return output_path
    except Exception as e:
        print(f"An error occurred: {e}")
        return None