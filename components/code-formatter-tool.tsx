"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CodeFormatterTool() {
  const [code, setCode] = useState("");
  const [formattedCode, setFormattedCode] = useState<string | null>(null);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(code);
      setFormattedCode(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setFormattedCode("Invalid JSON format.");
    }
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Code Formatter Tool</h1>
      <Textarea
        placeholder="Enter your JSON code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleFormat}>Format Code</Button>
      {formattedCode && (
        <div className="mt-4 p-4 bg-gray-200 rounded font-mono whitespace-pre overflow-auto">
          {formattedCode}
        </div>
      )}
    </div>
  );
}