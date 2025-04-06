"use client";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import CScode from "@/components/CScode"; // Import the CScode component

export default function WebPreview() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${sidebarOpen ? "ml-[280px]" : "ml-0"}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Web Preview</h1>
          <p className="text-muted-foreground">
            Enter a website URL to extract and summarize its content. Get details like title, description, keywords, and more.
          </p>
        </div>

        <div className="mt-6">
          <CScode /> {/* Render the CScode component */}
        </div>
      </main>
    </div>
  );
}