"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ClipboardCopy } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function WebScraperTool() {
  const [url, setUrl] = useState("");
  const [element, setElement] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url) {
      setError("Please enter a URL to scrape.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/web-scraper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          url,
          element,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to scrape the webpage.");
      }

      const data = await response.json();
      setResult(data.elements ? data.elements.join("\n\n") : data.html);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Web Scraper Tool</h2>
      <p className="mb-4 text-gray-600">Scrape content from any webpage by URL and optional CSS selector.</p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">URL</label>
        <Input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="bg-white text-black border border-gray-300 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">CSS Selector (Optional)</label>
        <Input
          type="text"
          value={element}
          onChange={(e) => setElement(e.target.value)}
          placeholder=".class-name or #id or tag"
          className="bg-white text-black border border-gray-300 rounded"
        />
      </div>

      <Button
        onClick={handleScrape}
        disabled={loading}
        className="w-full bg-blue-600 text-white hover:bg-blue-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scraping...
          </>
        ) : (
          "Scrape"
        )}
      </Button>

      {error && (
        <div className="mt-4 bg-red-100 text-red-800 px-4 py-3 rounded shadow">
          <p className="font-medium">❌ Error</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 bg-green-100 text-green-800 px-4 py-3 rounded shadow">
          <p className="font-medium">✅ Scrape Successful!</p>
          <Textarea
            value={result}
            readOnly
            className="mt-2 bg-white text-black border border-gray-300 rounded"
            rows={10}
          />
          <Button
            onClick={handleCopyToClipboard}
            className="mt-2 bg-gray-800 text-white hover:bg-gray-900 flex items-center"
          >
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </div>
      )}
    </div>
  );
}