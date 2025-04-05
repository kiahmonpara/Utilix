"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NetworkTool() {
  const [host, setHost] = useState("");
  const [action, setAction] = useState("ping"); // Default action is "ping"
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNetworkAction = async () => {
    if (!host) {
      setError("Please enter a valid hostname or IP address.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/network-tool`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ host, action }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.result || "No result returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Network Tool</h1>
      <p className="mb-4">Perform network operations like ping and traceroute.</p>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Enter hostname or IP address"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="mb-2"
        />
        <div className="flex gap-2 mb-2">
          <Button
            variant={action === "ping" ? "default" : "outline"}
            onClick={() => setAction("ping")}
          >
            Ping
          </Button>
          <Button
            variant={action === "traceroute" ? "default" : "outline"}
            onClick={() => setAction("traceroute")}
          >
            Traceroute
          </Button>
        </div>
        <Button onClick={handleNetworkAction} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Run"}
        </Button>
      </div>

      {error && <div className="text-destructive mb-4">Error: {error}</div>}

      {result && (
        <Textarea
          value={result}
          readOnly
          className="mt-4 font-mono text-sm bg-gray-100 dark:bg-gray-800"
          rows={10}
        />
      )}
    </div>
  );
}