"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function RandomUUIDGeneratorTool() {
  const [uuid, setUuid] = useState<string | null>(null);

  const generateUUID = () => {
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    setUuid(uuid);
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Random UUID Generator Tool</h1>
      <Button onClick={generateUUID}>Generate UUID</Button>
      {uuid && <div className="mt-4">Generated UUID: {uuid}</div>}
    </div>
  );
}