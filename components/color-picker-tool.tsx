"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Palette, ClipboardCopy } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ColorPickerTool() {
  const [color, setColor] = useState("#000000");
  const [shades, setShades] = useState<string[]>([]);
  const [tints, setTints] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleColorChange = async () => {
    if (!color) {
      setError("Please select or enter a valid color.");
      return;
    }

    setLoading(true);
    setError(null);
    setShades([]);
    setTints([]);

    try {
      const response = await fetch(`${API_BASE_URL}/color-picker/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ color }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setShades(data.shades || []);
      setTints(data.tints || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000); // Reset the copied state after 2 seconds
    });
  };

  return (
    <div className="tool-ui">
      <div className="tool-ui-header">
        <div className="tool-ui-icon">
          <Palette />
        </div>
        <h1 className="text-2xl font-bold">Color Picker</h1>
      </div>
      <div className="tool-ui-description">
        Generate shades and tints for a given color in HEX or RGB format.
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex flex-1 gap-2 items-center">
            <Label htmlFor="color" className="whitespace-nowrap">
              Select Color:
            </Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-16 p-0 border-none"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#HexCode or rgb(r,g,b)"
              className="flex-1"
            />
          </div>
          <Button onClick={handleColorChange} disabled={loading} className="flex-1">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />}
            Generate
          </Button>
        </div>

        {error && <div className="text-destructive mb-4">Error: {error}</div>}

        {shades.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-bold">Shades</h3>
            <div className="flex gap-2 mt-2">
              {shades.map((shade, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-md"
                    style={{ backgroundColor: shade }}
                    title={shade}
                  ></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(shade)}
                    className="mt-1"
                  >
                    <ClipboardCopy className="h-4 w-4 mr-1" />
                    {copied === shade ? "Copied!" : "Copy"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tints.length > 0 && (
          <div>
            <h3 className="text-lg font-bold">Tints</h3>
            <div className="flex gap-2 mt-2">
              {tints.map((tint, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-md"
                    style={{ backgroundColor: tint }}
                    title={tint}
                  ></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(tint)}
                    className="mt-1"
                  >
                    <ClipboardCopy className="h-4 w-4 mr-1" />
                    {copied === tint ? "Copied!" : "Copy"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}