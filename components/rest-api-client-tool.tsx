"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Send, Plus, Trash, Globe, Clock, Database, FileJson, FileText } from "lucide-react"

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface KeyValuePair {
    key: string
    value: string
}

interface ApiResponse {
    status_code: number
    success: boolean
    headers: Record<string, string>
    content_type: string
    body: any
    time_ms: number
    size_bytes: number
    error?: string
}

export default function RestApiClientTool() {
    // Basic request settings
    const [method, setMethod] = useState<string>("GET")
    const [url, setUrl] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    // Headers, params, and authentication
    const [headers, setHeaders] = useState<KeyValuePair[]>([{ key: "", value: "" }])
    const [params, setParams] = useState<KeyValuePair[]>([{ key: "", value: "" }])
    const [authType, setAuthType] = useState<string>("none")
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [bearerToken, setBearerToken] = useState<string>("")
    const [apiKeyName, setApiKeyName] = useState<string>("")
    const [apiKeyValue, setApiKeyValue] = useState<string>("")
    const [apiKeyLocation, setApiKeyLocation] = useState<string>("header")

    // Request body
    const [bodyType, setBodyType] = useState<string>("none")
    const [bodyContent, setBodyContent] = useState<string>("")

    // Additional options
    const [timeout, setTimeout] = useState<number>(30)
    const [verifySSL, setVerifySSL] = useState<boolean>(true)
    const [followRedirects, setFollowRedirects] = useState<boolean>(true)

    // Response
    const [response, setResponse] = useState<ApiResponse | null>(null)
    const [activeResponseTab, setActiveResponseTab] = useState<string>("body")

    // Helper functions for header and param manipulation
    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "" }])
    }

    const updateHeader = (index: number, key: string, value: string) => {
        const newHeaders = [...headers]
        newHeaders[index] = { key, value }
        setHeaders(newHeaders)
    }

    const removeHeader = (index: number) => {
        const newHeaders = [...headers]
        newHeaders.splice(index, 1)
        setHeaders(newHeaders.length ? newHeaders : [{ key: "", value: "" }])
    }

    const addParam = () => {
        setParams([...params, { key: "", value: "" }])
    }

    const updateParam = (index: number, key: string, value: string) => {
        const newParams = [...params]
        newParams[index] = { key, value }
        setParams(newParams)
    }

    const removeParam = (index: number) => {
        const newParams = [...params]
        newParams.splice(index, 1)
        setParams(newParams.length ? newParams : [{ key: "", value: "" }])
    }

    const prepareAuthParams = () => {
        switch (authType) {
            case "basic":
                return { username, password }
            case "bearer":
                return { token: bearerToken }
            case "api_key":
                return { key: apiKeyName, value: apiKeyValue, in_header: apiKeyLocation === "header" }
            default:
                return null
        }
    }

    const prepareHeaders = () => {
        const result: Record<string, string> = {}
        headers.forEach(h => {
            if (h.key.trim()) {
                result[h.key] = h.value
            }
        })
        return Object.keys(result).length > 0 ? result : undefined
    }

    const prepareParams = () => {
        const result: Record<string, string> = {}
        params.forEach(p => {
            if (p.key.trim()) {
                result[p.key] = p.value
            }
        })
        return Object.keys(result).length > 0 ? result : undefined
    }

    const sendRequest = async () => {
        if (!url) {
            return
        }

        setLoading(true)
        setResponse(null)

        try {
            const requestData = {
                method,
                url,
                headers: prepareHeaders(),
                params: prepareParams(),
                bodyType: bodyType === "none" ? undefined : bodyType,
                bodyContent: bodyType === "none" ? undefined : bodyContent,
                authType: authType === "none" ? undefined : authType,
                authParams: prepareAuthParams(),
                timeout,
                verifySSL,
                followRedirects
            }

            const response = await fetch(`${API_BASE_URL}/api-client`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            })

            const data = await response.json()
            setResponse(data)
        } catch (error) {
            setResponse({
                status_code: 0,
                success: false,
                headers: {},
                content_type: "text/plain",
                body: `Error sending request: ${error instanceof Error ? error.message : String(error)}`,
                time_ms: 0,
                size_bytes: 0
            })
        } finally {
            setLoading(false)
        }
    }

    // Format the response body for display
    const formatResponseBody = () => {
        if (!response) return ""

        if (typeof response.body === "object") {
            return JSON.stringify(response.body, null, 2)
        }

        return response.body
    }

    return (
        <div className="tool-ui">
            <div className="tool-ui-header">
                <div className="tool-ui-icon">🌐</div>
                <h1 className="text-2xl font-bold">REST API Client</h1>
            </div>
            <div className="tool-ui-description">Test and debug REST APIs with a comprehensive client.</div>

            <Card className="p-6">
                {/* Request URL and method */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="w-full md:w-1/4">
                        <Label htmlFor="method">Method</Label>
                        <Select value={method} onValueChange={setMethod}>
                            <SelectTrigger id="method">
                                <SelectValue placeholder="HTTP Method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                                <SelectItem value="PATCH">PATCH</SelectItem>
                                <SelectItem value="HEAD">HEAD</SelectItem>
                                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-3/4">
                        <Label htmlFor="url">URL</Label>
                        <Input id="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/endpoint" />
                    </div>
                </div>

                {/* Request configuration tabs */}
                <Tabs defaultValue="params" className="mb-6">
                    <TabsList>
                        <TabsTrigger value="params">Parameters</TabsTrigger>
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                        <TabsTrigger value="auth">Auth</TabsTrigger>
                        <TabsTrigger value="body">Body</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="params" className="space-y-4 pt-4">
                        {params.map((param, index) => (
                            <div key={index} className="flex flex-row gap-2 items-center">
                                <Input
                                    placeholder="Parameter name"
                                    value={param.key}
                                    onChange={e => updateParam(index, e.target.value, param.value)}
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Value"
                                    value={param.value}
                                    onChange={e => updateParam(index, param.key, e.target.value)}
                                    className="flex-1"
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeParam(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addParam}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Parameter
                        </Button>
                    </TabsContent>

                    <TabsContent value="headers" className="space-y-4 pt-4">
                        {headers.map((header, index) => (
                            <div key={index} className="flex flex-row gap-2 items-center">
                                <Input
                                    placeholder="Header name"
                                    value={header.key}
                                    onChange={e => updateHeader(index, e.target.value, header.value)}
                                    className="flex-1"
                                />
                                <Input
                                    placeholder="Value"
                                    value={header.value}
                                    onChange={e => updateHeader(index, header.key, e.target.value)}
                                    className="flex-1"
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeHeader(index)}>
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" onClick={addHeader}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Header
                        </Button>
                    </TabsContent>

                    <TabsContent value="auth" className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="auth-type">Authentication Type</Label>
                            <Select value={authType} onValueChange={setAuthType}>
                                <SelectTrigger id="auth-type">
                                    <SelectValue placeholder="Auth Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="basic">Basic Auth</SelectItem>
                                    <SelectItem value="bearer">Bearer Token</SelectItem>
                                    <SelectItem value="api_key">API Key</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {authType === "basic" && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" value={username} onChange={e => setUsername(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {authType === "bearer" && (
                            <div>
                                <Label htmlFor="token">Bearer Token</Label>
                                <Input id="token" value={bearerToken} onChange={e => setBearerToken(e.target.value)} />
                            </div>
                        )}

                        {authType === "api_key" && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="api-key-name">Key Name</Label>
                                    <Input id="api-key-name" value={apiKeyName} onChange={e => setApiKeyName(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="api-key-value">Key Value</Label>
                                    <Input id="api-key-value" value={apiKeyValue} onChange={e => setApiKeyValue(e.target.value)} />
                                </div>
                                <div>
                                    <Label htmlFor="api-key-location">Add to</Label>
                                    <Select value={apiKeyLocation} onValueChange={setApiKeyLocation}>
                                        <SelectTrigger id="api-key-location">
                                            <SelectValue placeholder="Location" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="header">Header</SelectItem>
                                            <SelectItem value="query">Query Parameter</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="body" className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="body-type">Body Type</Label>
                            <Select value={bodyType} onValueChange={setBodyType}>
                                <SelectTrigger id="body-type">
                                    <SelectValue placeholder="Body Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                    <SelectItem value="form">Form URL Encoded</SelectItem>
                                    <SelectItem value="text">Raw Text</SelectItem>
                                    <SelectItem value="xml">XML</SelectItem>
                                    <SelectItem value="html">HTML</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {bodyType !== "none" && (
                            <div>
                                <Label htmlFor="body-content">Request Body</Label>
                                <Textarea
                                    id="body-content"
                                    value={bodyContent}
                                    onChange={e => setBodyContent(e.target.value)}
                                    placeholder={
                                        bodyType === "json" ? '{\n  "key": "value"\n}' :
                                            bodyType === "form" ? 'key1=value1&key2=value2' :
                                                bodyType === "xml" ? '<root>\n  <element>value</element>\n</root>' :
                                                    'Enter request body'
                                    }
                                    className="font-mono min-h-[200px]"
                                />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="timeout">Timeout (seconds)</Label>
                            <Input
                                id="timeout"
                                type="number"
                                min={1}
                                max={120}
                                value={timeout}
                                onChange={e => setTimeout(parseInt(e.target.value) || 30)}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="verify-ssl" checked={verifySSL} onCheckedChange={setVerifySSL} />
                            <Label htmlFor="verify-ssl">Verify SSL Certificates</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="follow-redirects" checked={followRedirects} onCheckedChange={setFollowRedirects} />
                            <Label htmlFor="follow-redirects">Follow Redirects</Label>
                        </div>
                    </TabsContent>
                </Tabs>

                <Button
                    onClick={sendRequest}
                    disabled={!url || loading}
                    className="w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Request
                        </>
                    )}
                </Button>

                {response && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">Response</h3>
                            <div className={`px-4 py-1 rounded-full text-sm font-medium ${response.status_code >= 200 && response.status_code < 300 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                response.status_code >= 300 && response.status_code < 400 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    response.status_code >= 400 && response.status_code < 500 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                {response.status_code || "Error"}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {response.time_ms}ms
                            </div>
                            <div className="flex items-center">
                                <Database className="mr-1 h-3 w-3" />
                                {(response.size_bytes / 1024).toFixed(1)}KB
                            </div>
                            <div className="flex items-center">
                                {response.content_type?.includes("json") ? (
                                    <FileJson className="mr-1 h-3 w-3" />
                                ) : (
                                    <FileText className="mr-1 h-3 w-3" />
                                )}
                                {response.content_type || "unknown"}
                            </div>
                        </div>

                        <Tabs value={activeResponseTab} onValueChange={setActiveResponseTab}>
                            <TabsList>
                                <TabsTrigger value="body">Body</TabsTrigger>
                                <TabsTrigger value="headers">Headers</TabsTrigger>
                            </TabsList>

                            <TabsContent value="body" className="pt-4">
                                {response.error ? (
                                    <div className="text-destructive">{response.error}</div>
                                ) : (
                                    <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre overflow-auto max-h-[400px]">
                                        {formatResponseBody()}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="headers" className="pt-4">
                                <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 font-medium">Header</th>
                                                <th className="text-left py-2 font-medium">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {response.headers && Object.entries(response.headers).map(([key, value]) => (
                                                <tr key={key} className="border-b border-muted-foreground/20">
                                                    <td className="py-2 font-mono">{key}</td>
                                                    <td className="py-2 font-mono break-all">{value as string}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </Card>
        </div>
    )
}