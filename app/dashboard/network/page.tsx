"use client"
import { useState } from "react"
import type React from "react"

import "../../../styles/suite-page.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Sidebar from "@/components/sidebar"
import ToolCard from "@/components/tool-card"
import RestApiClientTool from "@/components/rest-api-client-tool"
import RandomUUIDGeneratorTool from "@/components/random-uuid-generator-tool"; // Import Random UUID Generator Tool
import NetworkTool from "@/components/network-tool"; // Import CSV/Excel/SQL Tool
import PasswordGeneratorTool from "@/components/password-tool";
import AESEncryption from "@/components/aes-encryption-tool"; // Import User Feedback Tool
import SEOTools from "@/components/SEOTools";
import WebScraperTool from "@/components/web-scraper-tool"; // Import Random Generator Tool

// Import Password Generator Tool
interface Tool {
  id: string  
  name: string
  icon: string
  description: string
  component: React.ReactNode
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTool, setActiveTool] = useState<Tool | null>(null)

  const tools: Tool[] = [
    {
      id: "rest-api-client",
      name: "REST API Client",
      icon: "🌐",
      description: "Test and interact with REST APIs",
      component: <RestApiClientTool />,
    },
    {
      id: "random-uuid-generator",
      name: "Random UUID Generator",
      icon: "🔑",
      description: "Generate random UUIDs (version 4).",
      component: <RandomUUIDGeneratorTool />,
    },
    {
      id: "network-tool",
      name: "Network Tool",
      icon: "🌐",
      description: "Perform network-related operations like ping, traceroute, and more.",
      component: <NetworkTool />, // Add the corresponding component
    },
    {
      id: "password-generator",
      name: "Password Generator",
      icon: "🔒",
      description: "Generate secure random passwords.",
      component: <PasswordGeneratorTool />,
    },
    {
      id: "aes-encryption",
      name: "AES Encryption Tool",
      icon: "🔒",
      description: "Encrypt and decrypt data using AES encryption.",
      component: <AESEncryption />,
    },
    {
      id: "SEO-tools",
      name: "SEO Tools",
      icon: "🔍",
      description: "Analyze keyword density and generate meta tags.",
      component: <SEOTools />,
    },
    {
      id: "web-scraper",
      name: "Web Scraper",
      icon: "🌐",
      description: "Scrape content from any webpage by URL and optional CSS selector.",
      component: <WebScraperTool />, // Add the corresponding component
    },
  ]

// In each page.tsx file
const handleToolClick = (tool: Tool) => {
  setActiveTool(tool) 
  setSidebarOpen(false) // This is the key change to auto-collapse the sidebar
}


  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Python Tools Dashboard</h1>
          <p className="text-muted-foreground">
            A collection of powerful Python tools integrated into your Next.js application.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div key={tool.id} className="tool-card">
              <div>
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-name">{tool.name}</div>
                <div className="tool-description">{tool.description}</div>
              </div>
              <button className="use-tool-button" onClick={() => handleToolClick(tool)}>
                Open Tool
              </button>
            </div>
          ))}
        </div>
      </main>

      <Dialog open={!!activeTool} onOpenChange={(open) => !open && setActiveTool(null)}>
  <DialogContent className="max-w-5xl p-0 h-[90vh] overflow-hidden">
    {activeTool && (
      <>
        <DialogHeader className="border-b p-4 flex flex-row items-start gap-3">
          <div className="tool-icon text-4xl">{activeTool.icon}</div>
          <div className="flex flex-col items-start">
            <DialogTitle className="text-xl font-bold text-black dark:text-white">
              {activeTool.name}
            </DialogTitle>
            <DialogDescription className="text-sm mt-1 text-left text-gray-700 dark:text-gray-300">
              {activeTool.description}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="p-5 overflow-y-auto" style={{ height: 'calc(90vh - 80px)' }}>
          {activeTool.component}
        </div>
      </>
    )}
  </DialogContent>
</Dialog>
    </div>
  )
}

