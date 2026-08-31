'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AdvancedCharts } from '@/components/AdvancedCharts';
import { ReportGenerator } from '@/components/ReportGenerator';
import { DeleteConfirmationDialog } from '@/components/DeleteConfirmationDialog';
import { deleteDataset } from '@/app/actions/deleteDataset';
import { getDatasetData, getDatasetSample } from '@/app/actions/getDatasetData';
import { Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Dataset {
  id: number;
  file_name: string;
  file_size: number;
  created_at: string;
  row_count: number;
}

interface Analysis {
  summary_stats: Record<string, Record<string, number | string | { value: string; count: number }[]>>;
  missing_values: Record<string, number>;
  column_types: Record<string, string>;
  correlation_matrix: Record<string, Record<string, number>>;
}

interface DatasetWithAnalysis extends Dataset {
  analysis?: Analysis | null;
}

interface OptimizedDatasetTabsProps {
  datasets: DatasetWithAnalysis[];
}

export function OptimizedDatasetTabs({ datasets }: OptimizedDatasetTabsProps) {
  const [activeDatasetId, setActiveDatasetId] = useState<number | null>(
    datasets.length > 0 ? datasets[0].id : null
  );
  const [visibleDatasets, setVisibleDatasets] = useState(datasets);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState<DatasetWithAnalysis | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const activeDataset = visibleDatasets.find(d => d.id === activeDatasetId);

  const handleDeleteClick = (dataset: DatasetWithAnalysis) => {
    setDeleteError(null);
    setDatasetToDelete(dataset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDatasetToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!datasetToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteDataset(datasetToDelete.id);
      if (result.success) {
        // Remove from local state
        const updatedDatasets = visibleDatasets.filter(d => d.id !== datasetToDelete.id);
        setVisibleDatasets(updatedDatasets);
        if (updatedDatasets.length > 0) {
          setActiveDatasetId(updatedDatasets[0].id);
        } else {
          setActiveDatasetId(null);
        }
        setDeleteDialogOpen(false);
        setDatasetToDelete(null);
      } else {
        setDeleteError(`Failed to delete dataset: ${result.message}`);
        setDeleteDialogOpen(false);
        setDatasetToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
      setDeleteError('An error occurred while deleting the dataset');
      setDeleteDialogOpen(false);
      setDatasetToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    const lastIndex = visibleDatasets.length - 1;
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? lastIndex
        : event.key === 'ArrowRight'
          ? (index + 1) % visibleDatasets.length
          : (index - 1 + visibleDatasets.length) % visibleDatasets.length;
    const nextDataset = visibleDatasets[nextIndex];
    setActiveDatasetId(nextDataset.id);
    document.getElementById(`dataset-tab-${nextDataset.id}`)?.focus();
  };

  if (visibleDatasets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center px-6 py-12 text-center">
          <div className="mb-4 rounded-full bg-blue-50 p-3 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            <span className="text-xl" aria-hidden="true">↗</span>
          </div>
          <h2 className="text-xl font-semibold">No datasets yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Upload a CSV to generate summary statistics, visualizations, and a printable report.
          </p>
          <Button asChild className="mt-6">
            <Link href="/upload">Upload your first CSV</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dataset Tabs */}
      {deleteError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          {deleteError}
        </div>
      )}
      <div className="overflow-x-auto border-b border-border pb-2">
        <div role="tablist" aria-label="Uploaded datasets" className="flex min-w-max gap-2">
        {visibleDatasets.map((dataset, index) => (
          <Button
            key={dataset.id}
            id={`dataset-tab-${dataset.id}`}
            variant={activeDatasetId === dataset.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveDatasetId(dataset.id)}
            className="flex items-center gap-2"
            role="tab"
            aria-selected={activeDatasetId === dataset.id}
            aria-controls={`dataset-panel-${dataset.id}`}
            tabIndex={activeDatasetId === dataset.id ? 0 : -1}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            <span className="max-w-48 truncate">{dataset.file_name}</span>
            <span className="text-xs opacity-70">({(dataset.file_size / 1024).toFixed(0)}KB)</span>
            {dataset.analysis && (
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true"></span>
            )}
          </Button>
        ))}
        </div>
      </div>

      {/* Active Dataset Content */}
      {activeDataset && (
        <OptimizedDatasetContent 
          dataset={activeDataset} 
          onDeleteClick={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        datasetName={datasetToDelete?.file_name || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}

// Optimized dataset content component with lazy loading
function OptimizedDatasetContent({ 
  dataset, 
  onDeleteClick 
}: { 
  dataset: DatasetWithAnalysis;
  onDeleteClick: (dataset: DatasetWithAnalysis) => void;
}) {
  const [datasetData, setDatasetData] = useState<Record<string, unknown>[] | null>(null);
  const [sampleData, setSampleData] = useState<Record<string, unknown>[] | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataPage, setDataPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [totalRows, setTotalRows] = useState(dataset.row_count);
  const [dataError, setDataError] = useState<string | null>(null);
  const pageSize = 100;

  // Load data lazily when component mounts or dataset changes
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setIsLoadingData(true);
      setDataError(null);
      setDatasetData(null);
      setSampleData(null);
      setDataPage(1);
      try {
        const [page, sample] = await Promise.all([
          getDatasetData(dataset.id, 1, pageSize),
          getDatasetSample(dataset.id, 1000),
        ]);
        if (!cancelled) {
          setDatasetData(page.data);
          setSampleData(sample);
          setTotalRows(page.totalRows);
          setHasMoreData(page.hasMore);
        }
      } catch {
        if (!cancelled) setDataError('Dataset rows are unavailable or have expired.');
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [dataset.id, dataset.row_count]);

  const loadDataPage = async (nextPage: number) => {
    if (nextPage < 1) return;
    setIsLoadingData(true);
    setDataError(null);
    try {
      const result = await getDatasetData(dataset.id, nextPage, pageSize);
      setDatasetData(result.data);
      setDataPage(nextPage);
      setHasMoreData(result.hasMore);
      setTotalRows(result.totalRows);
    } catch {
      setDataError('Unable to load that data page.');
    } finally {
      setIsLoadingData(false);
    }
  };

  const firstVisibleRow = totalRows === 0 ? 0 : (dataPage - 1) * pageSize + 1;
  const lastVisibleRow = Math.min(dataPage * pageSize, totalRows);

  return (
    <div
      id={`dataset-panel-${dataset.id}`}
      role="tabpanel"
      aria-labelledby={`dataset-tab-${dataset.id}`}
      aria-busy={isLoadingData}
      className="space-y-4"
    >
      {/* Dataset Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="break-all">{dataset.file_name}</span>
            <div className="flex flex-wrap items-center gap-2">
              {dataset.analysis && (
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-full">
                  Analyzed
                </span>
              )}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ID: {dataset.id}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteClick(dataset)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                aria-label={`Delete ${dataset.file_name}`}
                title={`Delete ${dataset.file_name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
          <dl className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <div><dt className="inline font-medium text-foreground">Uploaded:</dt> <dd className="inline">{new Date(dataset.created_at).toLocaleString()}</dd></div>
            <div><dt className="inline font-medium text-foreground">Size:</dt> <dd className="inline">{(dataset.file_size / 1024).toFixed(2)} KB</dd></div>
            <div><dt className="inline font-medium text-foreground">Records:</dt> <dd className="inline">{totalRows.toLocaleString()}</dd></div>
          </dl>
        </CardHeader>
      </Card>

      {/* Detailed Analysis Results */}
      {dataset.analysis ? (
        <AnalysisResults analysis={dataset.analysis} totalRows={totalRows} />
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                No analysis available for this dataset. Re-upload the file to generate analysis and visualizations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Charts - Only render if we have data */}
      {dataset.analysis && sampleData && (
        <AdvancedCharts data={sampleData} totalRows={totalRows} analysis={dataset.analysis} />
      )}

      {/* Report Generator */}
      {dataset.analysis && (
        <ReportGenerator 
          datasetId={dataset.id} 
          datasetName={dataset.file_name} 
        />
      )}
      
      {/* Raw Data Preview with Pagination */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>Data Preview</span>
            <div className="flex flex-wrap items-center gap-2">
              {totalRows > 0 && (
                <span className="text-sm text-muted-foreground" aria-live="polite">
                  Showing {firstVisibleRow.toLocaleString()}–{lastVisibleRow.toLocaleString()} of {totalRows.toLocaleString()} records
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDataPage(dataPage - 1)}
                disabled={isLoadingData || dataPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDataPage(dataPage + 1)}
                disabled={isLoadingData || !hasMoreData}
              >
                {isLoadingData ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dataError ? (
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
              {dataError}
            </div>
          ) : isLoadingData && !datasetData ? (
            <div role="status" aria-live="polite" className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading data...</span>
            </div>
          ) : (
            <div id="data-preview" role="region" aria-label={`Data page ${dataPage}`} tabIndex={0} className="max-h-80 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-4 focus-visible:ring-2 focus-visible:ring-ring dark:border-gray-700 dark:bg-gray-900">
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-800 dark:text-gray-200">
                {JSON.stringify(datasetData ?? [], null, 2)}
              </pre>
            </div>
          )}
              {totalRows > pageSize && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Use Previous and Next to move through bounded pages of {pageSize} records.
                </p>
              )}
        </CardContent>
      </Card>
    </div>
  );
}
