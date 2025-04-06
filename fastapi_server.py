import os
import uuid
import shutil
from pathlib import Path
from datetime import datetime  # Add this import
from bs4 import BeautifulSoup
import requests
from pydantic import BaseModel

from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Query, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Optional,List,Dict, Any
from fastapi import Body

# Import the service functions
from python.llm import generate  # LLM service
from python.imageGraphics.bgRemover import remove_background
from python.imageGraphics.barcodeGenerator import generate_barcode  # Barcode generator service
from python.textValidators.markdown_editor import validate_markdown, fix_markdown, markdown_to_html  # Markdown services
from python.imageGraphics.qrGenerator import generate_qr  # QR code generator service
from python.imageGraphics.imageGenerator import generate_image  # QR code generator service
from python.textValidators.yaml_validator import validate_yaml, get_yaml_error, format_yaml  # YAML validator service
from python.textValidators.json_validator import validate_json, get_json_error, format_json  # JSON validator service
from python.textValidators.xml_validator import validate_xml, get_xml_error, format_xml   # JSON validator service
from python.pdfs.pdfMerge import merge_pdfs  # PDF merger service
from python.imageGraphics.colorPicker import hex_to_rgb, rgb_to_hex, generate_shades_and_tints
from python.restApiClient import send_request  # REST API client service
from python.UserFeedback import load_requests, save_request
from python.imageGraphics.imageConvertor import convert_image  # Image conversion service
from python.randomGenerator import (
    random_color,
    random_number,
    random_float,
    random_name,
    random_word,
    random_sentence,
    random_emoji,
    random_password,
)
from python.palette_service import (
    generate_random_palette,
    generate_harmony_palette,
    generate_ai_palette,
    create_gradient_css
)
BASE_DIR = Path(os.getcwd())
UPLOAD_DIR = BASE_DIR / "public" / "uploads"
OUTPUT_DIR = BASE_DIR / "public" / "results"

# Ensure the directories exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Innovatrix Services API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002", "http://localhost:3001"],  # Allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def save_binary_file(file_name, data):
    try:
        with open(file_name, "wb") as f:
            f.write(data)
        print(f"File saved successfully: {file_name}")
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        raise
@app.post("/generate2")
async def generate_tool_recommendation(request: Dict[str, Any] = Body(...)):
    query = request.get("query")
    if not query:
        raise HTTPException(status_code=400, detail="Missing 'query' in request body.")

    try:
        # Call the generate function with the user query
        response_text = generate(query)

        # Parse the response text into JSON if it's in JSON format
        if response_text.startswith("```json") and response_text.endswith("```"):
            response_text = response_text.strip("```json").strip("```")
        try:
            response_json = eval(response_text)  # Use json.loads if safer input is ensured
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid JSON response: {str(e)}")

        return response_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendation: {str(e)}")
from python.llm1 import generate  # Import the generate function from llm1.py

@app.post("/web-preview")
async def web_preview_endpoint(request: Dict[str, Any] = Body(...)):
    query = request.get("query")
    if not query:
        raise HTTPException(status_code=400, detail="Missing 'query' in request body.")

    try:
        # Call the generate function with the user query
        response_text = generate(query)

        # Parse the response text into JSON if it's in JSON format
        if response_text.startswith("```json") and response_text.endswith("```"):
            response_text = response_text.strip("```json").strip("```")
        try:
            response_json = eval(response_text)  # Use json.loads if safer input is ensured
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid JSON response: {str(e)}")

        return response_json
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating web preview: {str(e)}")
    
@app.post("/ColorPaletteGenerator")
async def color_palette_generator_endpoint(request: Dict[str, Any] = Body(...)):
    try:
        prompt = request.get("prompt")
        base_color = request.get("baseColor")
        harmony_type = request.get("harmonyType")
        count = min(max(request.get("count", 5), 1), 10)  # Limit between 1-10 colors
        
        # Method 1: AI-generated palette from prompt
        if prompt:
            colors = await generate_ai_palette(prompt, count)
            gradient_css = create_gradient_css(colors)
            return {"palette": colors, "gradientCss": gradient_css}
        
        # Method 2: Harmony-based palette from base color
        elif base_color and harmony_type:
            colors = generate_harmony_palette(
                base_color, 
                harmony_type,
                count
            )
            gradient_css = create_gradient_css(colors)
            return {"palette": colors, "gradientCss": gradient_css}
        
        # Method 3: Random palette (default)
        else:
            colors = generate_random_palette(count)
            gradient_css = create_gradient_css(colors)
            return {"palette": colors, "gradientCss": gradient_css}
            
    except Exception as e:
        # Fallback to a default palette if anything fails
        colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][:count]
        return {
            "palette": colors,
            "gradientCss": create_gradient_css(colors),
            "error": str(e)
        }


@app.post("/convert-image")
async def convert_image_endpoint(
    file: UploadFile = File(...),
    format: str = Form(...),
    quality: Optional[int] = Form(95),
    resize: Optional[float] = Form(None)
):
    # Validate file type
    supported_formats = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.ico']
    if not any(file.filename.lower().endswith(ext) for ext in supported_formats):
        raise HTTPException(status_code=400, detail=f"Invalid file type. Supported formats: {', '.join(supported_formats)}")
    
    # Create a unique filename for the uploaded file
    unique_id = str(uuid.uuid4())
    file_ext = file.filename.split('.')[-1]
    input_filename = f"{unique_id}.{file_ext}"
    input_path = UPLOAD_DIR / input_filename

    # Save the uploaded file to disk
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Define the output filename and path
    output_filename = f"{unique_id}.{format.lower()}"
    output_path = OUTPUT_DIR / output_filename

    # Process quality (make sure it's within valid range)
    quality_value = min(max(quality, 1), 100) if quality is not None else 95
    
    # Process resize parameter
    resize_value = float(resize) if resize is not None else None
    
    # Call the convert_image function
    result = convert_image(
        input_path=str(input_path),
        output_path=str(output_path),
        output_format=format.upper(),
        quality=quality_value,
        resize=resize_value
    )
    
    if result is None:
        # Clean up the input file
        try:
            os.remove(input_path)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail="Image conversion failed")

    # Clean up the input file after processing
    try:
        os.remove(input_path)
    except Exception:
        pass

    # Return the resulting file as a response
    return FileResponse(
        path=str(output_path), 
        filename=f"{os.path.splitext(file.filename)[0]}.{format.lower()}",
        media_type=f"image/{format.lower()}"
    )
@app.post("/remove-background")
async def remove_background_endpoint(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
        raise HTTPException(status_code=400, detail="Invalid file type. Supported formats: png, jpg, jpeg, webp")
    
    unique_id = str(uuid.uuid4())
    file_ext = file.filename.split('.')[-1]
    input_filename = f"{unique_id}.{file_ext}"
    input_path = UPLOAD_DIR / input_filename

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    output_filename = f"{unique_id}_no_bg.png"
    output_path = OUTPUT_DIR / output_filename

    result = remove_background(str(input_path), str(output_path))
    if result is None:
        raise HTTPException(status_code=500, detail="Background removal failed from the service.")

    try:
        os.remove(input_path)
    except Exception:
        pass

    return FileResponse(path=str(output_path), filename=output_filename)

@app.post("/barcode-generator")
async def barcode_generator_endpoint(
    data: str = Form(...),
    symbology: str = Form("code128"),
    color: str = Form("#000000"),
    bgColor: str = Form("#FFFFFF"),
    transparent: bool = Form(False),
    textShow: bool = Form(True),
    borderStyle: Optional[str] = Form(None),
    borderWidth: int = Form(4),
    borderColor: Optional[str] = Form(None),
    width: int = Form(300),
    height: int = Form(100),
    quietZone: bool = Form(True)
):
    if not data:
        raise HTTPException(status_code=400, detail="Data is required to generate a barcode")
    
    unique_id = str(uuid.uuid4())
    output_filename = f"barcode_{unique_id}.png"
    output_path = OUTPUT_DIR / output_filename
    
    barcode_color = color.lstrip('#') if color.startswith('#') else color
    bg_color = bgColor.lstrip('#') if bgColor.startswith('#') else bgColor
    border_color = borderColor.lstrip('#') if borderColor and borderColor.startswith('#') else borderColor
    
    result = generate_barcode(
        data=data,
        symbology=symbology,
        filename=str(output_path),
        text_show=textShow,
        color=barcode_color,
        bg_color=bg_color,
        transparent=transparent,
        border_style=borderStyle,
        border_width=borderWidth,
        border_color=border_color,
        width=width,
        height=height,
        quiet_zone=quietZone
    )
    
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to generate barcode")
    
    return FileResponse(path=str(output_path), filename=output_filename)

@app.post("/markdown-validator")
async def markdown_validator(request: Request):
    try:
        payload = await request.json()
        md = payload.get("markdown", "")
        action = payload.get("action", "")
        if not md or not action:
            raise HTTPException(status_code=400, detail="Missing 'markdown' or 'action' in request body")
        
        if action == "validate":
            valid = validate_markdown(md)
            message = "Markdown looks valid!" if valid else "No valid Markdown syntax detected."
            return JSONResponse({"message": message})
        elif action == "format":
            formatted = fix_markdown(md)
            return JSONResponse({"formatted": formatted})
        elif action == "preview":
            html = markdown_to_html(md)
            return JSONResponse({"html": html})
        else:
            raise HTTPException(status_code=400, detail="Invalid action specified")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/qr-generator")
async def qr_generator_endpoint(
    data: str = Form(...),
    color: str = Form("#000000"),
    bgColor: str = Form("#FFFFFF"),
    transparent: bool = Form(False),
    rounded: bool = Form(False),
    boxSize: int = Form(10),
    quietZone: int = Form(4),
    borderStyle: Optional[str] = Form(None),
    borderWidth: int = Form(4),
    borderColor: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None)
):
    if not data:
        raise HTTPException(status_code=400, detail="Data is required to generate a QR code")
    
    # Create a unique filename
    unique_id = str(uuid.uuid4())
    output_filename = f"qrcode_{unique_id}.png"
    output_path = OUTPUT_DIR / output_filename
    
    # Handle logo upload if provided
    logo_path = None
    if logo:
        logo_ext = logo.filename.split('.')[-1]
        logo_filename = f"logo_{unique_id}.{logo_ext}"
        logo_path = UPLOAD_DIR / logo_filename
        
        # Save the uploaded logo
        with open(logo_path, "wb") as buffer:
            shutil.copyfileobj(logo.file, buffer)
        
        logo_path = str(logo_path)
    
    # Process color values
    qr_color = color.lstrip('#') if color.startswith('#') else color
    bg_color = bgColor.lstrip('#') if bgColor.startswith('#') else bgColor
    border_color = borderColor.lstrip('#') if borderColor and borderColor.startswith('#') else borderColor
    
    try:
        # Generate the QR code
        result = generate_qr(
        data=data,
        filename=str(output_path),
        logo=logo_path,
        color=color,  # Pass the original color value
        bg_color=bgColor,  # Pass the original bg_color value
        transparent=transparent,
        border_style=borderStyle,
        border_width=borderWidth,
        border_color=borderColor,  # Pass the original border_color value
        box_size=boxSize,
        rounded=rounded,
        quiet_zone=quietZone
    )
        
        # Clean up the logo file if it was uploaded
        if logo_path and os.path.exists(logo_path):
            try:
                os.remove(logo_path)
            except Exception:
                pass
        
        # Return the resulting QR code file
        return FileResponse(path=str(output_path), filename=output_filename)
    
    except Exception as e:
        # Clean up any files in case of error
        if logo_path and os.path.exists(logo_path):
            try:
                os.remove(logo_path)
            except Exception:
                pass
        
        raise HTTPException(status_code=500, detail=f"Failed to generate QR code: {str(e)}")

@app.post("/generate-image/")
async def generate_image_endpoint(prompt: str = Form(...)):
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    try:
        output_path = generate_image(prompt)
        if not output_path or not os.path.exists(output_path):
            raise HTTPException(status_code=500, detail="Failed to generate image")
        image_url = f"/results/{os.path.basename(output_path)}"
        return JSONResponse({"image_url": image_url, "message": "Image generated successfully!"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")
@app.post("/json-validator")
async def json_validator_endpoint(request: Request):
    try:
        payload = await request.json()
        json_content = payload.get("json", "")
        action = payload.get("action", "")
        
        if not json_content:
            raise HTTPException(status_code=400, detail="Missing JSON content in request body")
        
        if action == "validate":
            is_valid = validate_json(json_content)
            if is_valid:
                return JSONResponse({"valid": True})
            else:
                error_info = get_json_error(json_content)
                error_message = f"Line {error_info[0]}: {error_info[1]}" if error_info else "Invalid JSON format"
                return JSONResponse({"valid": False, "error": error_message})
        
        elif action == "format":
            # First check if the JSON is valid before attempting to format
            if not validate_json(json_content):
                error_info = get_json_error(json_content)
                error_message = f"Line {error_info[0]}: {error_info[1]}" if error_info else "Invalid JSON format"
                # Return a 200 status with an error message instead of a 400 error
                return JSONResponse({
                    "formatted": None,
                    "error": f"Cannot format invalid JSON. {error_message}"
                })
            
            try:
                # Get optional indent parameter and ensure it's an integer
                indent = int(payload.get("indent", 2))
                formatted = format_json(json_content, indent=indent)
                return JSONResponse({"formatted": formatted})
            except ValueError as e:
                # This should rarely happen since we already validated the JSON
                return JSONResponse({"error": str(e), "formatted": None})
        else:
            raise HTTPException(status_code=400, detail="Invalid action specified. Use 'validate' or 'format'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/color-picker/")
async def color_picker_endpoint(color: str = Form(...)):
    """
    Process a color (hex or RGB) and return its shades, tints, and converted formats.
    """
    try:
        if color.startswith("#"):  # Hex color
            rgb = hex_to_rgb(color)
        elif color.startswith("rgb"):  # RGB color
            rgb = tuple(map(int, re.findall(r"\d+", color)))
        else:
            raise HTTPException(status_code=400, detail="Invalid color format. Use #hex or rgb(r,g,b).")

        # Generate shades and tints
        shades, tints = generate_shades_and_tints(rgb)

        return JSONResponse({
            "hex": rgb_to_hex(rgb),
            "rgb": rgb,
            "shades": [rgb_to_hex(shade) for shade in shades],
            "tints": [rgb_to_hex(tint) for tint in tints]
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process color: {str(e)}")

@app.post("/xml-validator")
async def xml_validator_endpoint(request: Request):
    try:
        payload = await request.json()
        xml_content = payload.get("xml", "")
        action = payload.get("action", "")
        
        if not xml_content:
            raise HTTPException(status_code=400, detail="Missing XML content in request body")
        
        if action == "validate":
            is_valid = validate_xml(xml_content)
            if is_valid:
                return JSONResponse({"valid": True})
            else:
                error_info = get_xml_error(xml_content)
                error_message = f"Line {error_info[0]}: {error_info[1]}" if error_info else "Invalid XML format"
                return JSONResponse({"valid": False, "error": error_message})
        
        elif action == "format":
            if not validate_xml(xml_content):
                error_info = get_xml_error(xml_content)
                error_message = f"Line {error_info[0]}: {error_info[1]}" if error_info else "Invalid XML format"
                # Return a 200 status with an error message instead of a 400 error
                return JSONResponse({
                    "formatted": None,
                    "error": f"Cannot format invalid XML. {error_message}"
                })
            try:
                # Get optional indent parameter or use default (2)
                indent = payload.get("indent", 2)
                formatted = format_xml(xml_content, indent=indent)
                return JSONResponse({"formatted": formatted})
            except ValueError as e:
                return JSONResponse({"error": str(e)}, status_code=400)
        else:
            raise HTTPException(status_code=400, detail="Invalid action specified. Use 'validate' or 'format'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
@app.post("/pdf-merger")
async def pdf_merger_endpoint(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No PDF files provided")
    
    # Create a unique session ID for this batch of files
    session_id = str(uuid.uuid4())
    session_dir = UPLOAD_DIR / session_id
    session_dir.mkdir(parents=True, exist_ok=True)
    
    pdf_paths = []
    
    try:
        # Save uploaded PDF files to the temporary directory
        for file in files:
            if not file.filename.lower().endswith('.pdf'):
                raise HTTPException(status_code=400, detail=f"File {file.filename} is not a PDF")
            
            file_path = session_dir / file.filename
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            pdf_paths.append(str(file_path))
        
        # Create the output filename
        output_filename = f"merged_{session_id}.pdf"
        output_path = OUTPUT_DIR / output_filename
        
        # Merge the PDFs
        merge_pdfs(pdf_paths, str(output_path))
        
        # Return the merged PDF file
        return FileResponse(
            path=str(output_path), 
            filename=output_filename,
            media_type="application/pdf"
        )
    
    finally:
        # Clean up temporary files
        try:
            if session_dir.exists():
                shutil.rmtree(session_dir)
        except Exception as e:
            print(f"Error cleaning up temporary files: {e}")
@app.post("/yaml-validator")
async def yaml_validator_endpoint(request: Request):
    try:
        payload = await request.json()
        yaml_content = payload.get("yaml", "")
        action = payload.get("action", "")
        
        if not yaml_content:
            raise HTTPException(status_code=400, detail="Missing YAML content in request body")
        
        if action == "validate":
            is_valid = validate_yaml(yaml_content)
            if is_valid:
                return JSONResponse({"valid": True})
            else:
                error_info = get_yaml_error(yaml_content)
                error_message = error_info[1] if error_info else "Invalid YAML format"
                return JSONResponse({"valid": False, "error": error_message})
        
        elif action == "format":
            try:
                formatted = format_yaml(yaml_content)
                return JSONResponse({"formatted": formatted})
            except ValueError as e:
                return JSONResponse({"error": str(e)}, status_code=400)
        else:
            raise HTTPException(status_code=400, detail="Invalid action specified. Use 'validate' or 'format'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api-client")
async def api_client_endpoint(request: Request):
    print("Hello")
    try:
        data = await request.json()
        
        # Extract request parameters
        method = data.get("method")
        url = data.get("url")
        
        if not method or not url:
            raise HTTPException(status_code=400, detail="Method and URL are required")
        
        # Optional parameters
        headers = data.get("headers")
        params = data.get("params")
        body_type = data.get("bodyType")
        body_content = data.get("bodyContent")
        auth_type = data.get("authType")
        auth_params = data.get("authParams")
        timeout = data.get("timeout", 30)
        verify_ssl = data.get("verifySSL", True)
        follow_redirects = data.get("followRedirects", True)
        
        # Send the request
        result = send_request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            body_type=body_type,
            body_content=body_content,
            auth_type=auth_type,
            auth_params=auth_params,
            timeout=timeout,
            verify_ssl=verify_ssl,
            follow_redirects=follow_redirects
        )
        
        return JSONResponse(result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@app.post("/user-feedback/submit")
async def submit_feedback(request: Request):
    """
    Endpoint to submit user feedback.
    """
    try:
        payload = await request.json()
        print("Received Payload:", payload)  # Debugging
        name = payload.get("name", "Anonymous")
        feature = payload.get("feature", "")

        if not feature:
            raise HTTPException(status_code=400, detail="Feature description is required.")

        request_data = {
            "name": name,
            "feature": feature,
            "timestamp": datetime.now().isoformat()
        }

        save_request(request_data)
        print("Feedback Saved:", request_data)  # Debugging
        return JSONResponse({"message": "Feedback submitted successfully!"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {str(e)}")
    
@app.get("/user-feedback/view")
async def view_feedback():
    """
    Endpoint to retrieve all user feedback.
    """
    try:
        feedback_list = load_requests()
        print("Feedback List:", feedback_list)  # Debugging
        return JSONResponse({"feedback": feedback_list})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve feedback: {str(e)}")
@app.post("/random-generator")
async def random_generator_endpoint(request: Request):
    """
    Endpoint to generate random values based on the type.
    """
    try:
        payload = await request.json()
        random_type = payload.get("type", "")

        if random_type == "color":
            result = random_color()
        elif random_type == "number":
            start = payload.get("start", 1)
            end = payload.get("end", 100)
            result = random_number(start, end)
        elif random_type == "float":
            start = payload.get("start", 0.0)
            end = payload.get("end", 1.0)
            result = random_float(start, end)
        elif random_type == "name":
            result = random_name()
        elif random_type == "word":
            result = random_word()
        elif random_type == "sentence":
            result = random_sentence()
        elif random_type == "emoji":
            result = random_emoji()
        elif random_type == "password":
            length = payload.get("length", 10)
            result = random_password(length)
        else:
            raise HTTPException(status_code=400, detail="Invalid random type specified.")

        return JSONResponse({"result": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate random value: {str(e)}")
    
from python.randomUUID import generate_uuid

@app.post("/random-uuid")
async def random_uuid_endpoint():
    """
    Endpoint to generate a random UUID (version 4).
    """
    try:
        result = generate_uuid()
        return JSONResponse({"uuid": result})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate UUID: {str(e)}")

from python.network import ip_lookup, dns_lookup, ping_host

@app.post("/network-tool")
async def network_tool_endpoint(request: Request):
    """
    Endpoint to perform network operations like ping, traceroute, and IP lookup.
    """
    try:
        payload = await request.json()
        host = payload.get("host", "")
        action = payload.get("action", "")
        
        if not host:
            raise HTTPException(status_code=400, detail="Host is required.")
        
        if action == "ping":
            result = ping_host(host)
            return JSONResponse({"result": "\n".join(result)})
        
        elif action == "ip-lookup":
            result = ip_lookup(host)
            return JSONResponse({"result": result})
        
        elif action == "dns-lookup":
            result = dns_lookup(host)
            return JSONResponse({"result": result})
        
        else:
            raise HTTPException(status_code=400, detail="Invalid action specified.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to perform network operation: {str(e)}")


@app.post("/format-code")
async def format_code_endpoint(request: Request):
    """
    Endpoint to format code based on the provided language.
    """
    try:
        payload = await request.json()
        code = payload.get("code", "")
        language = payload.get("language", "")

        if not code or not language:
            raise HTTPException(status_code=400, detail="Code and language are required.")

        # Call the format_code function from codeFormatter.py
        from python.codeFormatter import format_code
        formatted_code = format_code(code, language)

        return JSONResponse({"formatted_code": formatted_code})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to format code: {str(e)}")


@app.post("/web-scraper")
async def web_scraper_endpoint(url: str = Form(...), element: Optional[str] = Form(None)):
    """
    Scrape a webpage and return the content of a specific HTML element.
    """
    try:
        # Fetch the webpage
        response = requests.get(url, timeout=10)
        response.raise_for_status()  # Raise an error for bad status codes

        # Parse the HTML content
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract the specified element or return the entire page content
        if element:
            elements = soup.select(element)  # Use CSS selectors
            if not elements:
                raise HTTPException(status_code=404, detail=f"No elements found for selector: {element}")
            return {"elements": [str(el) for el in elements]}
        else:
            return {"html": soup.prettify()}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch the webpage: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

class UploadResponse(BaseModel):
    fileId: str
    webViewLink: str
    previewLink: Optional[str] = None

class ErrorResponse(BaseModel):
    error: str

    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
    #