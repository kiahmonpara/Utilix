"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState<number>(8);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includeSpecialChars, setIncludeSpecialChars] = useState<boolean>(false);
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const generatePassword = () => {
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) characters += "0123456789";
    if (includeSpecialChars) characters += "!@#$%^&*()_+~`|}{[]:;?><";

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedPassword += characters[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Password Generator Tool</h1>

      <div className="mb-4">
        <label className="block font-medium mb-2">Password Length</label>
        <input
          type="range"
          min={1}
          max={20}
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-1">Length: {length}</div>
      </div>

      <div className="mb-4">
  <label className="block font-medium mb-2 text-black">
    <input
      type="checkbox"
      checked={includeNumbers}
      onChange={() => setIncludeNumbers((prev) => !prev)}
      className="mr-2"
    />
    Include Numbers
  </label>
</div>

<div className="mb-4">
  <label className="block font-medium mb-2 text-black">
    <input
      type="checkbox"
      checked={includeSpecialChars}
      onChange={() => setIncludeSpecialChars((prev) => !prev)}
      className="mr-2"
    />
    Include Special Characters
  </label>
</div>


      <Button
        onClick={generatePassword}
        className="bg-black text-white hover:bg-gray-800"
      >
        Generate Password
      </Button>

      {password && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Generated Password:</h2>
          <div className="flex items-center gap-2">
            <div className="p-4 bg-gray-100 text-black rounded-md">
              {password}
            </div>
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