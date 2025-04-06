"use client"
import { useState } from "react"
import type React from "react"

import "../../../styles/suite-page.css"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Sidebar from "@/components/sidebar"
import ToolCard from "@/components/tool-card"
import BgRemoverTool from "@/components/bg-remover-tool"
import ImageConverterTool from "@/components/image-converter-tool"
import MarkdownEditorTool from "@/components/markdown-editor-tool"
import PdfMergerTool from "@/components/pdf-merger-tool"
import UserFeedbackTool from "@/components/user-feedback-tool"; // Import User Feedback Tool
import RandomGeneratorTool from "@/components/random-generator-tool"; // Import Random Generator Tool
import ProductivityTools from "@/components/ProductivityTools" // Import Productivity Tools

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
      id: "bg-remover",
      name: "Background Remover",
      icon: "🖼️",
      description: "Remove backgrounds from images with AI precision",
      component: <BgRemoverTool />,
      pro: true,
    },
    {
      id: "image-converter",
      name: "Image Converter",
      icon: "🔄",
      description: "Convert images between different formats",
      component: <ImageConverterTool />,
      pro: false,
    },
    {
      id: "markdown-editor",
      name: "Markdown Editor",
      icon: "📝",
      description: "Edit, validate and preview Markdown",
      component: <MarkdownEditorTool />,
      pro: true,
    },
    {
      id: "pdf-merger",
      name: "PDF Merger",
      icon: "📑",
      description: "Combine multiple PDF files into one document",
      component: <PdfMergerTool />,
      pro: false,
    },
    {
      id: "user-feedback",
      name: "User Feedback",
      icon: "💬",
      description: "Provide feedback messages to users.",
      component: <UserFeedbackTool />,
      pro: false,
    },
    {
      id: "random-generator",
      name: "Random Generator",
      icon: "🎲",
      description: "Generate random numbers, strings, colors, and more.",
      component: <RandomGeneratorTool />,
      pro: false,
    },
    {
      id: "productivity-tools",
      name: "Productivity Tools",
      icon: "⚙️",
      description: "Enhance your productivity with various tools.",
      component: <ProductivityTools />,
      pro: false,
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
          <h1 className="text-3xl font-bold mb-2">
      Student Suite
          </h1>
          <p className="text-muted-foreground">
          A handy mix of formatters, calculators, and learning aids designed to simplify academic tasks and projects.          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
{tools.map((tool) => (
  <div key={tool.id} className="tool-card">
    {tool.pro && <div className="pro-ribbon">Pro</div>} {/* Render only if tool.pro is true */}
    <div className="tool-icon">{tool.icon}</div>
    <div className="tool-name">{tool.name}</div>
    <div className="tool-description">{tool.description}</div>
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

