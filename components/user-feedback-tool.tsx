"use client";

import { useState, useEffect } from "react";
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
  const [view, setView] = useState<"form" | "feedback">("form");

  const handleSubmitFeedback = async () => {
    if (!feature.trim()) {
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
      setMessage(data.message);
      setFeature(""); // Clear input
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  const loadFeedback = async () => {
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user-feedback/view`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setFeedbackList(data.feedback || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    }
  };

  // Load feedback automatically when view switches
  useEffect(() => {
    if (view === "feedback") loadFeedback();
  }, [view]);

  return (
    <div className="tool-ui p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      {view === "form" && (
        <>
          <h1 className="text-2xl font-bold">User Feedback Tool</h1>

          <Input
            type="text"
            placeholder="Your Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-black"
          />
          <Textarea
            placeholder="Describe the tool/feature you'd like to see..."
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            className="text-black"
          />

          <div className="flex gap-4">
            <Button
              onClick={handleSubmitFeedback}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              Submit Feedback
            </Button>
            <Button
              onClick={() => setView("feedback")}
              variant="outline"
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              View All Feedback
            </Button>
          </div>

          {error && <div className="text-red-500">❌ {error}</div>}
          {message && <div className="text-green-600">✅ {message}</div>}
        </>
      )}

      {view === "feedback" && (
        <>
          <h1 className="text-2xl font-bold mb-4">All Feedback</h1>
          {feedbackList.length === 0 ? (
            <p className="text-gray-500">No feedback available.</p>
          ) : (
            <ul className="list-disc pl-5 text-black space-y-2">
              {feedbackList.map((feedback, index) => (
                <li key={index}>
                  <strong>{feedback.feature}</strong> (by {feedback.name || "Anonymous"}, on{" "}
                  {new Date(feedback.timestamp).toLocaleString()})
                </li>
              ))}
            </ul>
          )}
          <Button
            onClick={() => setView("form")}
            className="mt-4 bg-gray-500 text-white hover:bg-gray-600"
          >
            Back to Feedback Form
          </Button>
        </>
      )}
    </div>
  );
}
