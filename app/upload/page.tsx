"use client";

import { TurnstileWidget } from "@/components/TurnstileWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UploadValidationError,
  validateCsvFileMetadata,
} from "@/lib/security/upload-limits";
import Link from "next/link";
import { FileSpreadsheet, Loader2, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UploadResponse {
  datasetId?: number;
  expiresAt?: string;
  error?: string;
}

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [uploadedDatasetId, setUploadedDatasetId] = useState<number | null>(null);

  const handleToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError("");
    setUploadedDatasetId(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    try {
      validateCsvFileMetadata(file);
      setSelectedFile(file);
    } catch (validationError) {
      setSelectedFile(null);
      event.target.value = "";
      setError(
        validationError instanceof UploadValidationError
          ? validationError.message
          : "Please select a valid CSV file.",
      );
    }
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!selectedFile || !turnstileToken) {
      setError("Select a CSV file and complete the security challenge.");
      return;
    }

    setIsUploading(true);
    setError("");
    setStatus("Uploading, validating, and analyzing your CSV...");

    try {
      const formData = new FormData();
      formData.set("file", selectedFile);
      formData.set("turnstileToken", turnstileToken);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const result = (await response.json()) as UploadResponse;

      if (!response.ok || !result.datasetId) {
        throw new Error(result.error || "The upload could not be completed.");
      }

      setUploadedDatasetId(result.datasetId);
      setStatus(
        result.expiresAt
          ? `Analysis complete. This dataset expires ${new Date(result.expiresAt).toLocaleString()}. Opening your analysis...`
          : "Analysis complete. This dataset expires within 24 hours. Opening your analysis...",
      );
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      window.location.assign("/data");
    } catch (uploadError) {
      setStatus("");
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The upload could not be completed.",
      );
    } finally {
      setIsUploading(false);
      setTurnstileResetKey((value) => value + 1);
    }
  }, [selectedFile, turnstileToken]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">New analysis</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Upload CSV</h1>
        <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          Upload a bounded CSV for private, session-isolated exploratory analysis.
        </p>
      </header>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            CSV file upload and analysis
          </CardTitle>
          <CardDescription>
            Select one CSV, complete the security check, and start the analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="mb-3 text-sm font-medium text-foreground">Upload limits</p>
              <ul id="upload-limits" className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>Up to 2 MiB and 10,000 rows</li>
                <li>Up to 100 columns and 500,000 cells</li>
                <li>Five attempts per rolling hour</li>
                <li>At least 30 seconds between attempts</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Failed processing attempts count toward the limit. Data is removed automatically after 24 hours.</p>
            </div>

            <div>
              <label
                htmlFor="csv-upload"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Choose CSV file
              </label>
              <input
                ref={fileInputRef}
                id="csv-upload"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                disabled={isUploading}
                aria-describedby="upload-limits"
                className="block min-h-11 w-full rounded-md border border-input bg-background p-2 text-sm text-muted-foreground outline-none transition-shadow file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:file:bg-blue-950 dark:file:text-blue-300"
              />
            </div>

            {selectedFile && (
              <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-200" aria-live="polite">
                <p className="break-all"><strong>Name:</strong> {selectedFile.name}</p>
                <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KiB</p>
              </div>
            )}

            <TurnstileWidget onToken={handleToken} resetKey={turnstileResetKey} />

            {error && (
              <p ref={errorRef} tabIndex={-1} className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 outline-none focus-visible:ring-2 focus-visible:ring-red-600 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
                {error}
              </p>
            )}

            {status && (
              <div role="status" className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200" aria-live="polite">
                <p>{status}</p>
                {uploadedDatasetId && (
                  <Link
                    href="/data"
                    prefetch={false}
                    className="mt-2 inline-block font-medium underline"
                  >
                    View your analysis
                  </Link>
                )}
              </div>
            )}

            <Button
              onClick={handleFileUpload}
              disabled={!selectedFile || !turnstileToken || isUploading}
              className="h-11 w-full"
            >
              {isUploading && <Loader2 className="animate-spin" aria-hidden="true" />}
              {isUploading ? "Uploading and analyzing…" : "Upload and analyze CSV"}
            </Button>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                <span>
                Your CSV is processed on the application server and stored only in your
                anonymous browser session. Dataset content is not sent to an AI provider.
                Clearing browser data removes your ability to access the session before
                automatic deletion.
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
