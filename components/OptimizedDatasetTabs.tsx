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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState<DatasetWithAnalysis | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const activeDataset = datasets.find(d => d.id === activeDatasetId);

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
        const updatedDatasets = datasets.filter(d => d.id !== datasetToDelete.id);
        if (updatedDatasets.length > 0) {
          setActiveDatasetId(updatedDatasets[0].id);
        } else {
          setActiveDatasetId(null);
        }
        setDeleteDialogOpen(false);
        setDatasetToDelete(null);
      } else {
        setDeleteError(`Failed to delete dataset: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
      setDeleteError('An error occurred while deleting the dataset');
    } finally {
      setIsDeleting(false);
    }
  };

  if (datasets.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No datasets uploaded yet. Go to the Upload page to add your first dataset.
          </p>
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
      <div role="tablist" aria-label="Uploaded datasets" className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {datasets.map((dataset) => (
          <Button
            key={dataset.id}
            variant={activeDatasetId === dataset.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveDatasetId(dataset.id)}
            className="flex items-center gap-2"
            role="tab"
            aria-selected={activeDatasetId === dataset.id}
            aria-controls={`dataset-panel-${dataset.id}`}
          >
            <span className="truncate max-w-32">{dataset.file_name}</span>
            <span className="text-xs opacity-70">({(dataset.file_size / 1024).toFixed(0)}KB)</span>
            {dataset.analysis && (
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </Button>
        ))}
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
        setDatasetData(page.data);
        setSampleData(sample);
        setTotalRows(page.totalRows);
        setHasMoreData(page.hasMore);
      } catch {
        setDataError('Dataset rows are unavailable or have expired.');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
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
      aria-busy={isLoadingData}
      className="space-y-4"
    >
      {/* Dataset Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="truncate">{dataset.file_name}</span>
            <div className="flex items-center space-x-2">
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
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Uploaded: {new Date(dataset.created_at).toLocaleString()} | 
            Size: {(dataset.file_size / 1024).toFixed(2)} KB | 
            Records: {totalRows.toLocaleString()}
          </div>
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
            <div className="flex items-center gap-2">
              {totalRows > 0 && (
                <span className="text-sm text-gray-500">
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
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-4 overflow-auto max-h-64">
              <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
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
