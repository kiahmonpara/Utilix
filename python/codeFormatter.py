import jsbeautifier
import cssutils
import subprocess
import tempfile

def format_code(code: str, language: str) -> str:
    language = language.lower()

    if language == "javascript" or language == "html":
        return jsbeautifier.beautify(code)

    elif language == "css":
        # cssutils outputs warnings to console; we suppress them
        cssutils.log.setLevel("FATAL")
        sheet = cssutils.parseString(code)
        return sheet.cssText.decode("utf-8")

    elif language == "python":
        # Use black to format Python code via subprocess
        with tempfile.NamedTemporaryFile("w+", suffix=".py", delete=False) as tmp_file:
            tmp_file.write(code)
            tmp_file.flush()
            subprocess.run(["black", tmp_file.name, "--quiet"])
            tmp_file.seek(0)
            return tmp_file.read()

    else:
        return "❌ Language not supported for formatting."

# Example usage
if __name__ == "__main__":
    print("🎯 Code Formatter")
    sample_code = input("Paste your code:\n")
    lang = input("Enter the language (html, css, javascript, python): ").strip()
    formatted = format_code(sample_code, lang)
    print("\n✅ Formatted Code:\n")
    print(formatted)
