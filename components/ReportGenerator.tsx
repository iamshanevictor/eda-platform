'use client';

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTemplate } from '@/components/ReportTemplate';
import { generateReportData, ReportData } from '@/app/actions/generateReport';
import { FileText, Printer, Loader2, Eye, X } from 'lucide-react';
import { AccessibleModal } from '@/components/ui/accessible-modal';

interface ReportGeneratorProps {
  datasetId: number;
  datasetName: string;
}

export function ReportGenerator({ datasetId, datasetName }: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const data = await generateReportData(datasetId);
      setReportData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `EDA_Report_${datasetName}_${new Date().toISOString().split('T')[0]}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 0.5in;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `,
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <FileText className="h-5 w-5" />
            Report Generation Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/40">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <Button 
              onClick={handleGenerateReport} 
              className="mt-3"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Report Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate a comprehensive report, then print it or use your browser&apos;s Print to PDF for searchable, selectable output.
            </p>
            
            {!reportData ? (
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button 
                  onClick={handlePrint}
                  disabled={isGenerating}
                  variant="outline"
                  className="flex-1"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print or Save as PDF
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              Report Preview
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Full Report
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <ReportTemplate ref={reportRef} reportData={reportData} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This is a preview of your report. Print it or save it as a PDF from the browser print dialog, or open the full preview.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Full Report Modal */}
      {reportData && (
        <AccessibleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          labelledBy="report-preview-title"
          describedBy="report-preview-description"
          panelClassName="flex h-[min(90dvh,900px)] max-w-6xl flex-col"
        >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-4 dark:border-gray-700 sm:p-6">
              <h2 id="report-preview-title" className="break-all text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
                Full Report Preview - {datasetName}
              </h2>
              <Button
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="Close full report preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6">
              <div className="max-w-none">
                <ReportTemplate reportData={reportData} />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p id="report-preview-description" className="text-sm text-gray-600 dark:text-gray-400">
                Print this report or save it as a PDF from the browser print dialog.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                >
                  Close
                </Button>
                <Button
                  onClick={handlePrint}
                  disabled={isGenerating}
                  variant="outline"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
        </AccessibleModal>
      )}
    </div>
  );
}
