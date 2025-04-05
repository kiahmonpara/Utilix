"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RandomUUIDGeneratorTool() {
  const [uuid, setUuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const generateUUID = async () => {
    setError(null);
    setUuid(null);
    setCopied(false);

    try {
      const response = await fetch(`${API_BASE_URL}/random-uuid`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setUuid(data.uuid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  const copyToClipboard = async () => {
    if (uuid) {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    }
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Random UUID Generator Tool</h1>

      <Button onClick={generateUUID} className="bg-black text-white hover:bg-gray-800">
        Generate UUID
      </Button>

      {error && <div className="text-red-500 mt-4">Error: {error}</div>}

      {uuid && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2 ">Generated UUID:</h2>
          <div className="flex items-center gap-2">
            <div className="p-4 bg-gray-100 text-black rounded-md">{uuid}</div>
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-gray-200 text-sm"
                            onClick={copyToClipboard}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
