
# processors/meeting_llm.py
import os
import json
import re
import google.generativeai as genai

# Configure Gemini AI
genai.configure(api_key="AIzaSyDFfTdQnF1eKZ2PYcm_GwzhX74vqljRnWY")


def extract_meeting_minutes(transcribed_text: str) -> dict:
   

    prompt = f"""
You are an assistant that extracts structured meeting notes from messy, conversational meeting transcripts.

Transcript:
{transcribed_text}

Your job:
- Identify clear DECISIONS made during the meeting
- List ACTION ITEMS with responsible person (if mentioned)
- List FOLLOW-UPS or things to check in future

Return ONLY valid JSON.
Format exactly like this schema:
{{
  "decisions": ["string"],
  "action_items": ["string"],
  "follow_ups": ["string"]
}}
"""

    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)

    # Extract raw candidate text
    raw_output = response.candidates[0].content.parts[0].text.strip()

    # Clean output: remove extra characters before/after JSON
    json_match = re.search(r"\{.*\}", raw_output, re.DOTALL)
    if json_match:
        raw_output = json_match.group(0)

    # Try parsing JSON safely
    try:
        notes = json.loads(raw_output)
    except json.JSONDecodeError:
        notes = {}

    # Ensure all keys exist and are lists
    return {
        "decisions": notes.get("decisions", []) if isinstance(notes.get("decisions", []), list) else [],
        "action_items": notes.get("action_items", []) if isinstance(notes.get("action_items", []), list) else [],
        "follow_ups": notes.get("follow_ups", []) if isinstance(notes.get("follow_ups", []), list) else []
    }




