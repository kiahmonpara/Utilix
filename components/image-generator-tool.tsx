"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Download, ImageIcon } from "lucide-react"

export default function ImageGeneratorTool() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8000/generate-image/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ prompt }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || "Failed to generate image")
      }

      const data = await response.json()
      setResult(`http://localhost:8000${data.image_url}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      const a = document.createElement("a")
      a.href = result
      a.download = `img.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="tool-ui">
      <div className="tool-ui-header">
        <div className="tool-ui-icon">🖌️</div>
        <h1 className="text-2xl font-bold">AI Image Generator</h1>
      </div>
      <div className="tool-ui-description">Generate images from text descriptions using AI.</div>

      <Card className="p-6">
        <div className="mb-4">
          <Label htmlFor="image-prompt">Prompt</Label>
          <Textarea
            id="image-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="mt-1 min-h-[100px]"
          />
        </div>

        <Button onClick={handleGenerate} disabled={!prompt || loading} className="mb-4 w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>

        {error && <div className="text-destructive mb-4">Error: {error}</div>}

        {result && (
          <div>
            <h3 className="text-lg font-medium mb-2">Preview</h3>
            <div className="border rounded-md overflow-hidden mb-4">
              <img src={result} alt="Generated" className="w-full" />
            </div>
            
            
              <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download 
            </Button>
            
          </div>
        )}
      </Card>
    </div>
  )
}
