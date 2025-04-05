"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CsvExcelSqlTool() {
  // Text input states
  const [csvData, setCsvData] = useState("");
  const [tableName, setTableName] = useState("my_table");
  const [sqlOutput, setSqlOutput] = useState<string | null>(null);

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileConversionType, setFileConversionType] = useState("csv_to_sql");
  const [fileTableName, setFileTableName] = useState("my_table");
  const [fileOutput, setFileOutput] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTextConversion = async () => {
    setLoading(true);
    setSqlOutput(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("csv_data", csvData);
      formData.append("table_name", tableName);
      formData.append("conversion_type", "csv_to_sql");

      const response = await fetch(`${API_URL}/process_csv`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSqlOutput(data.sql);
      } else {
        setError(`Error: ${data.detail || "Failed to convert data"}`);
      }
    } catch (error) {
      setError(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileConversion = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setFileOutput(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("conversion_type", fileConversionType);
      formData.append("table_name", fileTableName);

      const response = await fetch(`${API_URL}/convert`, {
        method: "POST",
        body: formData,
      });

      if (fileConversionType.endsWith("_to_sql")) {
        // For SQL output (JSON response)
        const data = await response.json();
        if (response.ok) {
          setFileOutput(data.sql);
        } else {
          setError(`Error: ${data.detail || "Failed to convert file"}`);
        }
      } else {
        // For file downloads
        if (response.ok) {
          // Create download link for file conversion results
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download =
            fileConversionType === "csv_to_excel"
              ? "converted.xlsx"
              : "converted.csv";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          setFileOutput(
            "File converted successfully. Download started automatically."
          );
        } else {
          // Try to parse error response
          try {
            const errorData = await response.json();
            setError(`Error: ${errorData.detail || "Failed to convert file"}`);
          } catch {
            setError(`Error: Server returned status ${response.status}`);
          }
        }
      }
    } catch (error) {
      setError(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">CSV/Excel/SQL Conversion Tool</h1>

      <Tabs defaultValue="file" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="text">CSV Text Input</TabsTrigger>
        </TabsList>

        {/* File Upload Tab */}
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>File Conversion</CardTitle>
              <CardDescription>
                Upload files and convert between CSV, Excel and SQL formats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Conversion Type
                  </label>
                  <Select
                    value={fileConversionType}
                    onValueChange={setFileConversionType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select conversion type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv_to_sql">CSV to SQL</SelectItem>
                      <SelectItem value="csv_to_excel">CSV to Excel</SelectItem>
                      <SelectItem value="excel_to_sql">Excel to SQL</SelectItem>
                      <SelectItem value="excel_to_csv">Excel to CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {fileConversionType.endsWith("_to_sql") && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Table Name
                    </label>
                    <Input
                      type="text"
                      value={fileTableName}
                      onChange={(e) => setFileTableName(e.target.value)}
                      placeholder="Enter table name"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Upload File
                  </label>
                  <Input
                    type="file"
                    accept={
                      fileConversionType === "csv_to_sql" ||
                      fileConversionType === "csv_to_excel"
                        ? ".csv"
                        : ".xls,.xlsx"
                    }
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                      }
                    }}
                  />

                  {selectedFile && (
                    <p className="mt-1 text-sm text-gray-500">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleFileConversion}
                  disabled={loading || !selectedFile}
                  className="mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert File"
                  )}
                </Button>

                {fileOutput && (
                  <div className="mt-4 p-4 bg-gray-100 rounded font-mono whitespace-pre overflow-auto border">
                    {fileOutput}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CSV Text Input Tab */}
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>CSV to SQL Conversion</CardTitle>
              <CardDescription>
                Convert CSV data to SQL statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Table Name
                  </label>
                  <Input
                    type="text"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="Enter table name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    CSV Data
                  </label>
                  <Textarea
                    value={csvData}
                    onChange={(e) => setCsvData(e.target.value)}
                    placeholder="id,name,email
1,John Doe,john@example.com
2,Jane Smith,jane@example.com"
                    rows={10}
                  />
                </div>

                <Button
                  onClick={handleTextConversion}
                  disabled={loading || !csvData}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    "Convert to SQL"
                  )}
                </Button>

                {sqlOutput && (
                  <div className="mt-4 p-4 bg-gray-100 rounded font-mono whitespace-pre overflow-auto border">
                    {sqlOutput}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}