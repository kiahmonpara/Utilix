from PIL import Image
import os

def compress_jpg(input_path, output_path, quality=60, resize_factor=1.0):
    """
    Compress a JPG image by reducing quality and size.

    Args:
        input_path: Path to the input JPG file
        output_path: Path to save compressed image
        quality: JPEG quality (1–95)
        resize_factor: Scale down image size (e.g. 0.5 = 50%)
    """
    img = Image.open(input_path)

    if resize_factor < 1.0:
        new_size = (int(img.width * resize_factor), int(img.height * resize_factor))
        img = img.resize(new_size, resample=Image.Resampling.LANCZOS)

    img.save(output_path, "JPEG", quality=quality, optimize=True)
    print(f"✅ Compressed image saved as: {output_path}")

# Example usage
if __name__ == "__main__":
    input_file = input("Enter path to JPG file: ").strip()
    output_file = "compressed_" + os.path.basename(input_file)
    compress_jpg(input_file, output_file, quality=50, resize_factor=0.7)
