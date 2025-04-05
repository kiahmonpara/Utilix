"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RandomGeneratorTool() {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [randomString, setRandomString] = useState<string | null>(null);

  const generateRandomNumber = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1); // Random number between 1 and 100
  };

  const generateRandomString = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    setRandomString(
      Array.from({ length: 8 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("")
    );
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Random Generator Tool</h1>
      <div className="mb-4">
        <Button onClick={generateRandomNumber} className="mr-2">Generate Random Number</Button>
        <Button onClick={generateRandomString}>Generate Random String</Button>
      </div>
      {randomNumber !== null && <div className="mt-4">Random Number: {randomNumber}</div>}
      {randomString && <div className="mt-4">Random String: {randomString}</div>}
    </div>
  );
}