"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Copy } from "lucide-react";

export default function RestApiClientTool() {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [formattedCode, setFormattedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const formatCode = async () => {
    setLoading(true);
    setFormattedCode(null);

    try {
      const response = await fetch("http://localhost:8000/format-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();
      if (response.ok) {
        setFormattedCode(data.formatted_code);
      } else {
        setFormattedCode(`Error: ${data.detail}`);
      }
    } catch (error) {
      setFormattedCode(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (formattedCode) {
      navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Code Formatter Tool</h1>

      <div className="mb-4">
        <label htmlFor="language" className="block font-medium mb-2">
          Select Language
        </label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full bg-white text-black border border-gray-400">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Enter your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mb-4 bg-white text-black placeholder-gray-500 border border-gray-400"
        rows={10}
      />

      <Button
        onClick={formatCode}
        disabled={loading}
        className="bg-black text-white hover:bg-gray-900"
      >
        {loading ? "Formatting..." : "Format Code"}
      </Button>

      {formattedCode && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Formatted Code:</span>
            <Button
              variant="outline"
              className="text-sm flex items-center gap-1 px-2 py-1 h-auto bg-black"
              onClick={handleCopy}
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="p-4 bg-gray-100 text-black rounded font-mono whitespace-pre overflow-auto border border-gray-400">
            {formattedCode}
          </div>
        </div>
      )}
    </div>
  );
}
