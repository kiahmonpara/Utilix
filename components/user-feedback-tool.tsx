"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function UserFeedbackTool() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleFeedback = () => {
    setFeedback(`${type.toUpperCase()}: ${message}`);
    setTimeout(() => setFeedback(null), 3000); // Clear feedback after 3 seconds
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">User Feedback Tool</h1>
      <div className="mb-4">
        <Textarea
          placeholder="Enter your feedback message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Type (info, success, error)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handleFeedback}>Submit Feedback</Button>
      </div>
      {feedback && <div className="mt-4 p-4 bg-gray-200 rounded">{feedback}</div>}
    </div>
  );
}