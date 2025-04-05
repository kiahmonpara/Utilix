"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Loader2, RefreshCw, Download, Clipboard, Check } from "lucide-react"

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function PaletteGeneratorTool() {
  const [prompt, setPrompt] = useState("")
  const [baseColor, setBaseColor] = useState("#3B82F6")
  const [harmonyType, setHarmonyType] = useState("analogous")
  const [mode, setMode] = useState<"prompt" | "harmony" | "random">("prompt")
  const [palette, setPalette] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (mode === "prompt" && !prompt) {
      setError("Please enter a prompt for the palette")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const requestBody: any = { count: 5 }
      
      if (mode === "prompt") {
        requestBody.prompt = prompt
      } else if (mode === "harmony") {
        requestBody.baseColor = baseColor
        requestBody.harmonyType = harmonyType
      }

      const response = await fetch(`${API_BASE_URL}/ColorPaletteGenerator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to generate palette: ${response.status}`)
      }

      const data = await response.json()
      setPalette(data.palette || [])
    } catch (err) {
      console.error("Palette generation failed:", err)
      setError(err instanceof Error ? err.message : "Failed to generate palette")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopied(color)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownloadPalette = () => {
    if (palette.length === 0) return

    const paletteCSV = palette.join(",")
    const blob = new Blob([paletteCSV], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "color-palette.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="tool-container">
      <Card className="p-6">
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <Button 
              variant={mode === "prompt" ? "default" : "outline"} 
              onClick={() => setMode("prompt")}>
              AI Prompt
            </Button>
            <Button 
              variant={mode === "harmony" ? "default" : "outline"} 
              onClick={() => setMode("harmony")}>
              Color Harmony
            </Button>
            <Button 
              variant={mode === "random" ? "default" : "outline"} 
              onClick={() => setMode("random")}>
              Random
            </Button>
          </div>

          {mode === "prompt" && (
            <div>
              <Label htmlFor="palette-prompt" className="block mb-2">Color Palette Prompt</Label>
              <Input
                id="palette-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a description for your color palette (e.g., 'ocean sunset')"
                className="mb-4"
              />
            </div>
          )}

          {mode === "harmony" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="base-color">Base Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="base-color"
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input 
                    value={baseColor} 
                    onChange={(e) => setBaseColor(e.target.value)} 
                    className="flex-1" 
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="harmony-type">Harmony Type</Label>
                <Select value={harmonyType} onValueChange={setHarmonyType}>
                  <SelectTrigger id="harmony-type">
                    <SelectValue placeholder="Select harmony type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complementary">Complementary</SelectItem>
                    <SelectItem value="triadic">Triadic</SelectItem>
                    <SelectItem value="analogous">Analogous</SelectItem>
                    <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Palette
              </>
            )}
          </Button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>

        {palette.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Generated Palette</h3>
            
            <div className="grid grid-cols-5 gap-2 h-20 mb-4 rounded-md overflow-hidden">
              {palette.map((color, index) => (
                <div
                  key={index}
                  className="flex items-end justify-center cursor-pointer relative"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopyColor(color)}
                >
                  <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 mb-2 rounded">
                    {copied === color ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      color
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="h-16 rounded-md mb-4" 
              style={{ 
                background: `linear-gradient(to right, ${palette.join(', ')})`,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={handleDownloadPalette}>
                <Download className="mr-2 h-4 w-4" />
                Download Palette
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}