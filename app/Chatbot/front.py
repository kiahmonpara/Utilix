import base64
import os
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/generate3', methods=['POST'])
def generate_endpoint():
    # Ensure a JSON payload with a 'query' key is provided.
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({'error': 'Missing "query" parameter in JSON payload.'}), 400

    user_query = data['query']

    # Initialize the Gemini client with the API key from environment variable.
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash"

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=user_query),
            ],
        ),
    ]
    tools = [
        types.Tool(google_search=types.GoogleSearch())
    ]

    # Read the system prompt from an external file.
    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        return jsonify({'error': 'System prompt file not found.'}), 500

    generate_content_config = types.GenerateContentConfig(
        temperature=2,
        top_p=0.95,
        top_k=40,
        max_output_tokens=8192,
        tools=tools,
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text=system_prompt_text)
        ],
    )

    # Collect the response from the stream.
    response_text = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        response_text += chunk.text

    # Remove code block markers if present
    if response_text.startswith("```json") and response_text.endswith("```"):
        response_text = response_text.strip("```json").strip("```")

    try:
        # Parse the JSON string
        response_json = eval(response_text)  # Use json.loads if safer input is ensured
    except Exception as e:
        return jsonify({'error': f"Invalid JSON response: {str(e)}"}), 500

    return jsonify(response_json)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
