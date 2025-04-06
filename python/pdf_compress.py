import fitz  # PyMuPDF
import os

def compress_pdf(input_path, output_path, zoom_x=0.5, zoom_y=0.5):
    """
    Compress a PDF by rendering and rewriting each page at lower resolution.
    Args:
        input_path: Original PDF path
        output_path: Compressed PDF path
        zoom_x: Horizontal zoom (0.5 = 50% scale)
        zoom_y: Vertical zoom (0.5 = 50% scale)
    """
    doc = fitz.open(input_path)
    new_doc = fitz.open()

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom_x, zoom_y))
        img_pdf = fitz.open()
        rect = fitz.Rect(0, 0, pix.width, pix.height)
        img_page = img_pdf.new_page(width=pix.width, height=pix.height)
        img_page.insert_image(rect, pixmap=pix)

        new_doc.insert_pdf(img_pdf)

    new_doc.save(output_path, deflate=True, clean=True)
    print(f"✅ Compressed PDF saved as: {output_path}")

# Example usage
if __name__ == "__main__":
    input_pdf = input("Enter path to PDF file: ").strip()
    output_pdf = "compressed_" + os.path.basename(input_pdf)
    compress_pdf(input_pdf, output_pdf)
