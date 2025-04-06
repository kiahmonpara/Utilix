from fastapi import FastAPI, Body, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import random
import colorsys
import re
import os
import json
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Configure Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyAFOkJWkkSvplrmT5bBdQyXNSUrKfyKUhQ")
genai.configure(api_key=GEMINI_API_KEY)

# Helper functions (keeping the same ones from your original code)
def random_color() -> str:
    """Generate a random hex color."""
    return f"#{random.randint(0, 0xFFFFFF):06x}"

def hex_to_rgb(hex_code: str) -> tuple:
    """Convert hex color to RGB tuple."""
    hex_code = hex_code.lstrip("#")
    return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb: tuple) -> str:
    """Convert RGB tuple to hex color."""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"

def rotate_hue(rgb: tuple, angle: float) -> tuple:
    """Rotate the hue of an RGB color by a given angle (0-1)."""
    r, g, b = [x/255.0 for x in rgb]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    h = (h + angle) % 1.0
    r, g, b = colorsys.hls_to_rgb(h, l, s)
    return (int(r*255), int(g*255), int(b*255))

# Input/Output models
class PaletteRequest(BaseModel):
    prompt: Optional[str] = None
    base_color: Optional[str] = None
    count: Optional[int] = 5
    harmony_type: Optional[str] = None

class PaletteResponse(BaseModel):
    colors: List[str]
    gradient_css: Optional[str] = None
    error: Optional[str] = None

# Palette generation functions
def generate_random_palette(count: int = 5) -> List[str]:
    """Generate a random color palette."""
    return [random_color() for _ in range(count)]

def generate_harmony_palette(base_color: str, harmony_type: str = "complementary", count: int = 5) -> List[str]:
    """Generate a color palette based on color harmony rules."""
    base_rgb = hex_to_rgb(base_color)
    result = [rgb_to_hex(base_rgb)]  # Start with the base color
    
    if harmony_type == "complementary":
        # Add complementary color
        comp = rotate_hue(base_rgb, 0.5)
        result.append(rgb_to_hex(comp))
        
    elif harmony_type == "triadic":
        # Add triadic colors
        triad1 = rotate_hue(base_rgb, 1/3)
        triad2 = rotate_hue(base_rgb, 2/3)
        result.extend([rgb_to_hex(triad1), rgb_to_hex(triad2)])
        
    elif harmony_type == "analogous":
        # Add analogous colors
        for i in range(1, count):
            angle = (i / count) * 0.25  # Limit to 90 degrees total
            analogous = rotate_hue(base_rgb, angle)
            result.append(rgb_to_hex(analogous))
    
    elif harmony_type == "monochromatic":
        # Generate shades and tints
        base_r, base_g, base_b = base_rgb
        for i in range(1, count):
            # Alternate between darker and lighter
            if i % 2 == 0:
                # Darker shade
                factor = 1.0 - (0.2 * (i // 2))
                shade = (
                    int(base_r * factor),
                    int(base_g * factor),
                    int(base_b * factor)
                )
                result.append(rgb_to_hex(shade))
            else:
                # Lighter tint
                factor = (0.2 * ((i // 2) + 1))
                tint = (
                    int(base_r + (255 - base_r) * factor),
                    int(base_g + (255 - base_g) * factor),
                    int(base_b + (255 - base_b) * factor)
                )
                result.append(rgb_to_hex(tint))
    
    # Fill remaining slots with random variations if needed
    while len(result) < count:
        variation = rotate_hue(base_rgb, random.random())
        result.append(rgb_to_hex(variation))
    
    return result[:count]  # Ensure we don't exceed the requested count

async def generate_ai_palette(prompt: str, count: int = 5) -> List[str]:
    """Generate a color palette using AI based on the prompt."""
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = await model.generate_content_async(
            f"Generate {count} aesthetic hex color codes for this theme: {prompt}. "
            f"Just return them as a list of hex codes."
        )
        
        # Extract hex codes from the response
        codes = re.findall(r"#(?:[0-9a-fA-F]{6})", response.text)
        
        if codes:
            return codes[:count]
        else:
            # Fallback to random if no valid hex codes found
            return generate_random_palette(count)
    except Exception as e:
        print(f"Error generating AI palette: {str(e)}")
        # Fallback to random palette on error
        return generate_random_palette(count)

def create_gradient_css(colors: List[str]) -> str:
    """Create a CSS gradient string from the palette."""
    if not colors:
        return ""
    
    if len(colors) == 1:
        return colors[0]
    
    color_stops = ", ".join(colors)
    return f"linear-gradient(to right, {color_stops})"

# FastAPI app
app = FastAPI(title="Color Palette Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-palette", response_model=PaletteResponse)
async def generate_palette(request: PaletteRequest):
    """Generate a color palette based on various methods."""
    count = min(max(request.count or 5, 1), 10)  # Limit between 1-10 colors
    
    try:
        # Method 1: AI-generated palette from prompt
        if request.prompt:
            colors = await generate_ai_palette(request.prompt, count)
            gradient_css = create_gradient_css(colors)
            return {"colors": colors, "gradient_css": gradient_css}
        
        # Method 2: Harmony-based palette from base color
        elif request.base_color and request.harmony_type:
            colors = generate_harmony_palette(
                request.base_color, 
                request.harmony_type,
                count
            )
            gradient_css = create_gradient_css(colors)
            return {"colors": colors, "gradient_css": gradient_css}
        
        # Method 3: Random palette (default)
        else:
            colors = generate_random_palette(count)
            gradient_css = create_gradient_css(colors)
            return {"colors": colors, "gradient_css": gradient_css}
            
    except Exception as e:
        # Fallback to a default palette if anything fails
        colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"][:count]
        return {
            "colors": colors,
            "gradient_css": create_gradient_css(colors),
            "error": str(e)
        }

@app.get("/harmony-types")
def get_harmony_types():
    """Get available color harmony types."""
    return {
        "harmony_types": [
            {"id": "complementary", "name": "Complementary"},
            {"id": "triadic", "name": "Triadic"},
            {"id": "analogous", "name": "Analogous"},
            {"id": "monochromatic", "name": "Monochromatic"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)