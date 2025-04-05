import os
import mimetypes
from google import genai
from google.genai import types

# Define the output directory for generated images
OUTPUT_DIR = os.path.join(os.getcwd(), "public", "results")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_binary_file(file_name, data):
    with open(file_name, "wb") as f:
        f.write(data)

def generate_image(prompt):
    """
    Generate an image based on the provided prompt,preview it on the screen and save it to the output directory.
    Returns the file path of the generated image.
    """
    client = genai.Client(
        api_key='AIzaSyDVFjlgmZdy9a7bmmg3-FVA2eE_V3qp2tM',
    )

    model = "gemini-2.0-flash-exp-image-generation"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=f"""you are an image generation model, I will give you a prompt as input. Generate an image of it as closely and accurately as possible: {prompt}"""),
            ],
        ),
        types.Content(
            role="model",
            parts=[
                types.Part.from_text(text="""Understood. Please provide your prompt, and I will do my best to generate an image that accurately reflects it."""),
            ],
        ),
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_modalities=[
            "image",
            "text",
        ],
        response_mime_type="text/plain",
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        if not chunk.candidates or not chunk.candidates[0].content or not chunk.candidates[0].content.parts:
            continue
        if chunk.candidates[0].content.parts[0].inline_data:
            # Generate a unique filename
            file_name = f"generated_image_{os.urandom(4).hex()}"
            inline_data = chunk.candidates[0].content.parts[0].inline_data
            file_extension = mimetypes.guess_extension(inline_data.mime_type)
            if not file_extension:
                file_extension = ".png"  # Default to PNG if the mime type is unknown
            output_path = os.path.join(OUTPUT_DIR, f"{file_name}{file_extension}")
            
            # Save the binary data to the output path
            save_binary_file(output_path, inline_data.data)
            print(f"File of mime type {inline_data.mime_type} saved to: {output_path}")
            return output_path  # Return the file path of the generated image
        else:
            print(chunk.text)

    raise Exception("Failed to generate image. No valid data received.")

if __name__ == "__main__":
    prompt = input("Enter your prompt: ")
    try:
        output_path = generate_image(prompt)
        print(f"Image generated and saved to: {output_path}")
    except Exception as e:
        print(f"Error: {e}")