"use client";
import { useState } from "react";
import CSai from "@/components/CSai"; // Import the CSai component
import Sidebar from "@/components/sidebar";

export default function AiToolFinder() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${sidebarOpen ? "ml-[280px]" : "ml-0"}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Tool Finder</h1>
          <p className="text-muted-foreground">
            Discover the best AI tools tailored to your needs. Simply ask, and we'll recommend the most suitable tools.
          </p>
        </div>

        <div className="mt-6">
          <CSai /> {/* Render the CSai component */}
        </div>
      </main>
    </div>
  );
}