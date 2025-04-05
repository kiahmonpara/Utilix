"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, FileJson } from "lucide-react"

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function JsonValidatorTool() {
    const [json, setJson] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null)
    const [formatted, setFormatted] = useState<string | null>(null)
    const [indent, setIndent] = useState(2)

    const handleValidate = async () => {
        if (!json) {
            setError("Please enter some JSON to validate")
            return
        }

        setLoading(true)
        setError(null)
        setValidationResult(null)

        try {
            // Call FastAPI endpoint
            const response = await fetch(`${API_BASE_URL}/json-validator`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ json, action: "validate" }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `Server error: ${response.status}`)
            }

            const data = await response.json()

            if (data.error && !data.hasOwnProperty("valid")) {
                throw new Error(data.error)
            }

            setValidationResult(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleFormat = async () => {
        if (!json) {
            setError("Please enter some JSON to format")
            return
        }

        setLoading(true)
        setError(null)
        setFormatted(null)

        try {
            // Call FastAPI endpoint
            const response = await fetch(`${API_BASE_URL}/json-validator`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ json, action: "format", indent }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.detail || `Server error: ${response.status}`)
            }

            const data = await response.json()

            if (data.error && !data.formatted) {
                throw new Error(data.error)
            }

            if (data.formatted) {
                setFormatted(data.formatted)
            } else if (data.error) {
                setError(data.error)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
            setLoading(false)
        }
    }

    const applyFormatted = () => {
        if (formatted) {
            setJson(formatted)
            setFormatted(null)
        }
    }

    return (
        <div className="tool-ui">
            <div className="tool-ui-header">
                <div className="tool-ui-icon">{"{ }"}</div>
                <h1 className="text-2xl font-bold">JSON Validator</h1>
            </div>
            <div className="tool-ui-description">Validate and format JSON documents.</div>

            <Card className="p-6">
                <Textarea
                    value={json}
                    onChange={(e) => setJson(e.target.value)}
                    placeholder="Enter your JSON here..."
                    className="min-h-[300px] font-mono mb-4"
                />

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex flex-1 gap-2">
                        <Button onClick={handleValidate} disabled={loading} className="flex-1">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Validate
                        </Button>

                        <Button onClick={handleFormat} disabled={loading} variant="outline" className="flex-1">
                            <FileJson className="mr-2 h-4 w-4" />
                            Format
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="indent" className="whitespace-nowrap">Indent spaces:</Label>
                        <Input
                            id="indent"
                            type="number"
                            min={0}
                            max={8}
                            value={indent}
                            onChange={(e) => setIndent(parseInt(e.target.value) || 2)}
                            className="w-20"
                        />
                    </div>
                </div>

                {error && <div className="text-destructive mb-4">Error: {error}</div>}

                {validationResult && (
                    <div
                        className={`mb-4 p-3 rounded ${validationResult.valid ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
                    >
                        {validationResult.valid ? (
                            <div className="flex items-center">
                                <Check className="mr-2 h-5 w-5" />
                                JSON is valid!
                            </div>
                        ) : (
                            <div>
                                <div className="font-semibold mb-1">JSON is invalid:</div>
                                <div className="font-mono text-sm">{validationResult.error}</div>
                            </div>
                        )}
                    </div>
                )}

                {formatted && (
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Formatted JSON:</div>
                        <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-auto max-h-[300px] whitespace-pre">
                            {formatted}
                        </div>
                        <Button onClick={applyFormatted} className="mt-2" size="sm">
                            Apply Formatted JSON
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
}