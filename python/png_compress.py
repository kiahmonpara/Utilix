from PIL import Image
import os

def compress_png(input_path, output_path, resize_factor=1.0, optimize=True):
    """
    Compress a PNG image by resizing and optimizing.
    
    Args:
        input_path: Path to input PNG file
        output_path: Path to save compressed PNG
        resize_factor: Scale down image size (e.g. 0.5 = 50%)
        optimize: Use Pillow's PNG optimizer
    """
    img = Image.open(input_path)

    if resize_factor < 1.0:
        new_size = (int(img.width * resize_factor), int(img.height * resize_factor))
        img = img.resize(new_size, resample=Image.Resampling.LANCZOS)

    img.save(output_path, "PNG", optimize=optimize)
    print(f"✅ Compressed PNG saved as: {output_path}")

# Example usage
if __name__ == "__main__":
    input_file = input("Enter path to PNG file: ").strip()
    output_file = "compressed_" + os.path.basename(input_file)
    compress_png(input_file, output_file, resize_factor=0.7)
