import base64
import os
import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
import uvicorn

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Gemini API Server")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Define request model
class QueryRequest(BaseModel):
    query: str

# Initialize Gemini client
def get_gemini_client():
    return genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
    )

@app.post("/generate3")
async def generate_endpoint(request: QueryRequest, client=Depends(get_gemini_client)):
    user_query = request.query
    
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

    # Read the system prompt from an external file
    try:
        with open("systemprompt.txt", "r", encoding="utf-8") as sp:
            system_prompt_text = sp.read()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="System prompt file not found.")

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

    # Collect the response from the stream
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
        # Parse the JSON string - using json.loads instead of eval for safety
        response_json = json.loads(response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid JSON response: {str(e)}")

    return response_json

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
