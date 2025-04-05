"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function RandomGeneratorTool() {
  const [randomType, setRandomType] = useState("number");
  const [result, setResult] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/random-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: randomType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  // Get the display name for the selected type
  const getDisplayName = (type: string) => {
    switch (type) {
      case "number": return "Random Number";
      case "float": return "Random Float";
      case "color": return "Random Color";
      case "name": return "Random Name";
      case "word": return "Random Word";
      case "sentence": return "Random Sentence";
      case "emoji": return "Random Emoji";
      case "password": return "Random Password";
      default: return "Select a random type";
    }
  };

  // Render the result with special handling for colors
  const renderResult = () => {
    if (!result) return null;
    
    if (randomType === "color" && typeof result === "string" && result.startsWith("#")) {
      return (
        <div className="mt-4">
          <h2 className="text-lg font-bold text-black mb-2">Generated Color:</h2>
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-md border border-gray-300 shadow-sm" 
              style={{ backgroundColor: result }}
            ></div>
            <div className="p-4 bg-gray-100 border border-gray-300 rounded-md text-black font-medium shadow-sm">
              {result}
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <h2 className="text-lg font-bold text-black mb-2">Generated Value:</h2>
        <div className="p-4 bg-gray-100 border border-gray-300 rounded-md text-black font-medium shadow-sm">{result}</div>
      </div>
    );
  };

  return (
    <div className="tool-ui p-6">
      <h1 className="text-2xl font-bold mb-4 text-black">Random Generator Tool</h1>
      <div className="mb-4">
        <label className="block text-black mb-2 font-medium">Select Type:</label>
        <Select 
          onValueChange={(value) => setRandomType(value)} 
          value={randomType}
          defaultValue="number"
        >
          <SelectTrigger className="w-full bg-white border-2 border-gray-300 shadow-sm p-3 text-black font-medium rounded-md flex justify-between items-center">
            <SelectValue>
              {getDisplayName(randomType)}
            </SelectValue>
            {/* Down arrow icon */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
            <SelectItem value="number" className="text-black p-3 hover:bg-blue-50">Random Number</SelectItem>
            <SelectItem value="float" className="text-black p-3 hover:bg-blue-50">Random Float</SelectItem>
            <SelectItem value="color" className="text-black p-3 hover:bg-blue-50">Random Color</SelectItem>
            <SelectItem value="name" className="text-black p-3 hover:bg-blue-50">Random Name</SelectItem>
            <SelectItem value="word" className="text-black p-3 hover:bg-blue-50">Random Word</SelectItem>
            <SelectItem value="sentence" className="text-black p-3 hover:bg-blue-50">Random Sentence</SelectItem>
            <SelectItem value="emoji" className="text-black p-3 hover:bg-blue-50">Random Emoji</SelectItem>
            <SelectItem value="password" className="text-black p-3 hover:bg-blue-50">Random Password</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={handleGenerate} 
          className="bg-black text-white hover:bg-gray-800 mt-4 p-3 font-medium rounded-md shadow-md w-full sm:w-auto"
        >
          Generate
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4 font-medium p-3 bg-red-50 border border-red-200 rounded-md">{error}</div>}
      {renderResult()}
    </div>
  );
}