
import re
from bs4 import BeautifulSoup

def clean_text(text: str) -> str:
    """
    Cleans input text by removing HTML tags, URLs, special characters, and extra spaces.
    """
    text = BeautifulSoup(text, "html.parser").get_text()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"[^a-zA-Z0-9.,!?;:()\-\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

