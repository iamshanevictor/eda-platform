'use client';

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportTemplate } from '@/components/ReportTemplate';
import { generateReportData, ReportData } from '@/app/actions/generateReport';
import { FileText, Printer, Loader2, Eye, X } from 'lucide-react';

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
          <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
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
              <div className="flex gap-2">
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
            <CardTitle className="flex items-center justify-between">
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
      {isModalOpen && reportData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="report-preview-title">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 id="report-preview-title" className="text-xl font-semibold text-gray-900 dark:text-white">
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
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-none">
                <ReportTemplate reportData={reportData} />
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Print this report or save it as a PDF from the browser print dialog.
              </p>
              <div className="flex gap-2">
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
          </div>
        </div>
      )}
    </div>
  );
}
