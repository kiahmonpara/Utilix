import os
from PyPDF2 import PdfMerger

def merge_pdfs(pdf_paths, output_path="merged_output.pdf"):
    merger = PdfMerger()

    for path in pdf_paths:
        if os.path.exists(path) and path.endswith(".pdf"):
            print(f"📄 Adding: {path}")
            merger.append(path)
        else:
            print(f"❌ Skipped (invalid or not found): {path}")

    if merger.pages:
        merger.write(output_path)
        merger.close()
        print(f"\n✅ Merged PDF saved as: {output_path}")
    else:
        print("⚠️ No valid PDFs were provided to merge.")

if __name__ == "__main__":
    print("=== PDF Merger ===")
    file_input = input("Enter full paths to PDF files (comma-separated):\n> ").strip()
    pdf_paths = [f.strip() for f in file_input.split(',') if f.strip()]

    output_file = input("Enter output filename (default: merged_output.pdf): ").strip()
    output_file = output_file if output_file else "merged_output.pdf"

    merge_pdfs(pdf_paths, output_file)
