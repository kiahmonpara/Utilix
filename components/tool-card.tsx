"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ToolCardProps {
  name: string
  description: string
  icon: string
  onClick: () => void
  pro?: boolean // Add a prop to indicate if the tool is "Pro"
}

export default function ToolCard({ name, description, icon, onClick, pro }: ToolCardProps) {
  return (
    <Card className="tool-card hover:shadow-md transition-all cursor-pointer relative" onClick={onClick}>
      {/* Pro Ribbon */}
      {pro && (
        <div className="pro-ribbon">
          🏆Pro
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="tool-icon text-4xl mb-2">{icon}</div>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Open Tool
        </Button>
      </CardFooter>
    </Card>
  )
}