


def transcribe_audio(audio_path: str) -> str:
    import whisper
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    return result["text"]