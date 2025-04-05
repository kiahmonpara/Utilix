"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CsvExcelSqlPgTool() {
  const [csvData, setCsvData] = useState("");
  const [sqlOutput, setSqlOutput] = useState<string | null>(null);

  const handleConvertToSQL = () => {
    try {
      const rows = csvData.split("\n").map((row) => row.split(","));
      const columns = rows[0];
      const values = rows.slice(1);
      const tableName = "my_table";

      const sql = `
        CREATE TABLE ${tableName} (${columns.map((col) => `${col} TEXT`).join(", ")});
        ${values
          .map(
            (row) =>
              `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${row
                .map((val) => `'${val.trim()}'`)
                .join(", ")});`
          )
          .join("\n")}
      `;
      setSqlOutput(sql);
    } catch (error) {
      setSqlOutput("Error converting CSV to SQL.");
    }
  };

  return (
    <div className="tool-ui">
      <h1 className="text-2xl font-bold mb-4">CSV/Excel/SQL Tool</h1>
      <Input
        type="text"
        placeholder="Paste your CSV data here..."
        value={csvData}
        onChange={(e) => setCsvData(e.target.value)}
        className="mb-4"
      />
      <Button onClick={handleConvertToSQL}>Convert to SQL</Button>
      {sqlOutput && (
        <div className="mt-4 p-4 bg-gray-200 rounded font-mono whitespace-pre overflow-auto">
          {sqlOutput}
        </div>
      )}
    </div>
  );
}