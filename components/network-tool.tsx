"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, ChevronDown } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function NetworkTool() {
  const [host, setHost] = useState("");
  const [action, setAction] = useState("ping");
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

  const actionLabels = {
    "ping": "Ping",
    "ip-lookup": "IP Lookup",
    "dns-lookup": "DNS Lookup"
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">Network Tool</h1>
      <p className="mb-4">Perform network operations like ping, traceroute, and IP lookup.</p>

      <div className="mb-4">
        <Input
          type="text"
          placeholder={`Enter hostname or IP address for ${actionLabels[action as keyof typeof actionLabels]}`}
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="mb-2 bg-black text-white placeholder-gray-400"
        />
        
        <div className="relative mb-2">
          <Select onValueChange={(value) => setAction(value)} value={action}>
            <SelectTrigger className="w-full bg-white border-2 border-gray-300 shadow-sm p-3 text-black font-medium rounded-md flex justify-between items-center">
              <SelectValue placeholder="Select an action" />
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-300 shadow-lg rounded-md overflow-hidden">
              <SelectItem value="ping" className="hover:bg-gray-800">Ping</SelectItem>
              <SelectItem value="ip-lookup" className="hover:bg-gray-800">IP Lookup</SelectItem>
              <SelectItem value="dns-lookup" className="hover:bg-gray-800">DNS Lookup</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleNetworkAction} 
          disabled={loading} 
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : `Run ${actionLabels[action as keyof typeof actionLabels]}`}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      {result && (
        <Textarea
          value={result}
          readOnly
          className="mt-4 font-mono text-sm bg-gray-800 text-white placeholder-gray-400 w-full rounded border border-gray-700"
          rows={10}
        />
      )}
    </div>
  );
}