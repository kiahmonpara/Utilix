"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function UserFeedbackTool() {
  const [name, setName] = useState("");
  const [feature, setFeature] = useState("");
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!feature) {
      setError("Feature description is required.");
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user-feedback/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, feature }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message); // Display success message
      setFeature(""); // Clear the feature input after submission
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  // Function to handle viewing all feedback
  const handleViewFeedback = async () => {
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/user-feedback/view`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setFeedbackList(data.feedback || []); // Set feedback list
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">User Feedback Tool</h1>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Your Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 text-black"
        />
        <Textarea
          placeholder="Describe the tool/feature you'd like to see..."
          value={feature}
          onChange={(e) => setFeature(e.target.value)}
          className="mb-2 text-black"
        />
        <Button
          onClick={handleSubmitFeedback}
          className="mb-2 bg-green-500 text-white hover:bg-green-600"
        >
          Submit Feedback
        </Button>
        <Button
          onClick={handleViewFeedback}
          variant="outline"
          className="mb-2 bg-blue-500 text-white hover:bg-blue-600"
        >
          View All Feedback
        </Button>
      </div>

      {/* Display error message */}
      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      {/* Display success message */}
      {message && <div className="text-green-500 mb-4">{message}</div>}

      {/* Display feedback list */}
      {feedbackList.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">All Feedback</h2>
          <ul className="list-disc pl-5">
            {feedbackList.map((feedback, index) => (
              <li key={index}>
                <strong>{feedback.feature}</strong> (by {feedback.name || "Anonymous"}, on{" "}
                {feedback.timestamp ? new Date(feedback.timestamp).toLocaleString() : "Unknown Date"})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}