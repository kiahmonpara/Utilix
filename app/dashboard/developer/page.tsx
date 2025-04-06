"use client"
import { useState } from "react"
import type React from "react"

import "../../../styles/suite-page.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Sidebar from "@/components/sidebar"
import ToolCard from "@/components/tool-card"
import MarkdownEditorTool from "@/components/markdown-editor-tool"
import YamlValidatorTool from "@/components/yaml-validator-tool"
import XmlValidatorTool from "@/components/xml-validator-tool"
import JsonValidatorTool from "@/components/json-validator-tool"
import RestApiClientTool from "@/components/rest-api-client-tool"
import CodeFormatterTool from "@/components/code-formatter-tool"
import WebScraperTool from "@/components/web-scraper-tool" // Import Web Scraper Tool

interface Tool {
  id: string
  name: string
  icon: string
  description: string
  component: React.ReactNode
  pro: boolean
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTool, setActiveTool] = useState<Tool | null>(null)

  const tools: Tool[] = [
    {
      id: "markdown-editor",
      name: "Markdown Editor",
      icon: "📝",
      description: "Edit, validate and preview Markdown",
      component: <MarkdownEditorTool />,
      pro: false,
    },
    {
      id: "yaml-validator",
      name: "YAML Validator",
      icon: "📋",
      description: "Validate and format YAML documents",
      component: <YamlValidatorTool />,
      pro: false,
    },
    {
      id: "xml-validator",
      name: "XML Validator",
      icon: "📄",
      description: "Validate and format XML documents",
      component: <XmlValidatorTool />,
      pro: false,
    },
    {
      id: "json-validator",
      name: "JSON Validator",
      icon: "🔍",
      description: "Validate and format JSON documents",
      component: <JsonValidatorTool />,
      pro: false,
    },
    {
      id: "rest-api-client",
      name: "REST API Client",
      icon: "🌐",
      description: "Test and interact with REST APIs",
      component: <RestApiClientTool />,
      pro: true,
    },
    {
      id: "code-formatter",
      name: "Code Formatter",
      icon: "🖋️",
      description: "Format HTML, CSS, Javascript, Python code.",
      component: <CodeFormatterTool />,
      pro: false,
    },
    {
      id: "web-scraper",
      name: "Web Scraper",
      icon: "🌐",
      description: "Scrape content from any webpage by URL and optional CSS selector.",
      component: <WebScraperTool />,
      pro: true,
    },
  ]

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool)
    setSidebarOpen(false)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Developer Suite</h1>
          <p className="text-muted-foreground">
          Essential tools for coders and API testers—format, validate, encrypt, and debug in one streamlined workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
  <div key={tool.id} className="tool-card">
    <div>
      {tool.pro && <div className="pro-ribbon">Pro</div>} {/* Render only if tool.pro is true */}
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
