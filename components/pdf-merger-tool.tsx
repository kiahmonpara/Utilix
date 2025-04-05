"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Upload, Download, FileX, FileText, MoveUp, MoveDown, Trash2 } from "lucide-react"

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function PdfMergerTool() {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // Filter only PDF files
            const pdfFiles = Array.from(e.target.files).filter(file =>
                file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
            )

            if (pdfFiles.length === 0) {
                setError("Please select PDF files only")
                return
            }

            setFiles(prev => [...prev, ...pdfFiles])
            setError(null)

            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
        setMergedPdfUrl(null)
    }

    const moveFile = (index: number, direction: 'up' | 'down') => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === files.length - 1)
        ) {
            return
        }

        const newFiles = [...files]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
        const temp = newFiles[targetIndex]
        newFiles[targetIndex] = newFiles[index]
        newFiles[index] = temp

        setFiles(newFiles)
        setMergedPdfUrl(null)
    }

    const handleMergePdfs = async () => {
        if (files.length < 2) {
            setError("Please select at least 2 PDF files to merge")
            return
        }

        setLoading(true)
        setError(null)
        setMergedPdfUrl(null)

        const formData = new FormData()
        files.forEach(file => {
            formData.append('files', file)
        })

        try {
            const response = await fetch(`${API_BASE_URL}/pdf-merger`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                let errorMessage = "Failed to merge PDF files"
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.detail || errorData.error || errorMessage
                } catch (e) {
                    errorMessage = `Server error: ${response.status}`
                }
                throw new Error(errorMessage)
            }

            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setMergedPdfUrl(url)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred")
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (mergedPdfUrl) {
            const a = document.createElement('a')
            a.href = mergedPdfUrl
            a.download = 'merged_document.pdf'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }
    }

    return (
        <div className="tool-ui">
            <div className="tool-ui-header">
                <div className="tool-ui-icon">📑</div>
                <h1 className="text-2xl font-bold">PDF Merger</h1>
            </div>
            <div className="tool-ui-description">Combine multiple PDF files into a single document.</div>

            <Card className="p-6">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full sm:w-auto"
                            variant="outline"
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Add PDF Files
                        </Button>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,application/pdf"
                            multiple
                            className="hidden"
                        />

                        <Button
                            onClick={handleMergePdfs}
                            disabled={loading || files.length < 2}
                            className="w-full sm:w-auto"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Merging...
                                </>
                            ) : (
                                <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Merge PDFs
                                </>
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="text-destructive mt-4">{error}</div>
                    )}
                </div>

                {files.length > 0 && (
                    <div className="border rounded-md overflow-hidden mb-6">
                        <table className="w-full">
                            <thead className="bg-muted">
                                <tr>
                                    <th className="py-2 px-4 text-left">Order</th>
                                    <th className="py-2 px-4 text-left">File Name</th>
                                    <th className="py-2 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((file, index) => (
                                    <tr key={index} className="border-t">
                                        <td className="py-2 px-4">{index + 1}</td>
                                        <td className="py-2 px-4 font-medium truncate max-w-[300px]">
                                            {file.name}
                                        </td>
                                        <td className="py-2 px-4 text-right">
                                            <div className="flex justify-end items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => moveFile(index, 'up')}
                                                    disabled={index === 0}
                                                    title="Move Up"
                                                >
                                                    <MoveUp className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => moveFile(index, 'down')}
                                                    disabled={index === files.length - 1}
                                                    title="Move Down"
                                                >
                                                    <MoveDown className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFile(index)}
                                                    className="text-destructive"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {mergedPdfUrl && (
                    <div className="mb-4 bg-muted/30 p-4 rounded-md border">
                        <h3 className="font-medium mb-3">PDF Successfully Merged!</h3>
                        <Button onClick={handleDownload}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Merged PDF
                        </Button>
                    </div>
                )}

                {files.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <FileX className="h-12 w-12 mb-2" />
                        <p className="text-center">No PDF files selected.</p>
                        <p className="text-center text-sm">Upload at least two PDF files to merge them.</p>
                    </div>
                )}
            </Card>
        </div>
    )
}