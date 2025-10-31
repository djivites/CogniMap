

import os
print(os.getcwd())

import yt_dlp
import whisper
import os
import uuid


def download_and_transcribe(url: str, output_dir: str = "temp") -> str:
    
    model = whisper.load_model("base")
    os.makedirs(output_dir, exist_ok=True)
    unique_id = str(uuid.uuid4())
    output_template = os.path.join(output_dir, f"{unique_id}.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_template,
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info_dict = ydl.extract_info(url, download=True)
        downloaded_path = ydl.prepare_filename(info_dict)

    audio_path = os.path.splitext(downloaded_path)[0] + ".mp3"
    result = model.transcribe(audio_path)
    os.remove(audio_path)

    return result["text"]

