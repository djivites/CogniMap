# Load the Whisper model
import whisper
model = whisper.load_model("base")

def video_to_text(video_path: str) -> str:
    """
    Transcribes speech from a video file to text using Whisper.
    """
    result = model.transcribe(video_path)

    return result["text"]
