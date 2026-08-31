'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HistogramChart } from './charts/HistogramChart';
import { ScatterPlot } from './charts/ScatterPlot';
import { CorrelationHeatmap } from './charts/CorrelationHeatmap';
import { MissingValuesChart } from './charts/MissingValuesChart';
import { BarChart2, ScatterChart as ScatterIcon, Grid, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface AdvancedChartsProps {
  data: Record<string, unknown>[];
  totalRows: number;
  analysis: {
    summary_stats: Record<string, Record<string, number | string | { value: string; count: number }[]>>;
    missing_values: Record<string, number>;
    column_types: Record<string, string>;
    correlation_matrix: Record<string, Record<string, number>>;
  };
}

export function AdvancedCharts({ data, totalRows, analysis }: AdvancedChartsProps) {
  const [visibleCharts, setVisibleCharts] = useState({
    histogram: true,
    scatter: true,
    correlation: true,
    missing: true
  });

  // Fixed layout: 2 columns for Distribution/Relationship, 1 column for Correlation/Quality
  
  // Single chart selection states
  const [selectedHistogramColumn, setSelectedHistogramColumn] = useState<string>('');
  const [selectedScatterXColumn, setSelectedScatterXColumn] = useState<string>('');
  const [selectedScatterYColumn, setSelectedScatterYColumn] = useState<string>('');

  const numericColumns = useMemo(
    () => Object.keys(analysis.column_types).filter(
      col => analysis.column_types[col] === 'numeric'
    ),
    [analysis.column_types],
  );

  const toggleChart = (chartType: keyof typeof visibleCharts) => {
    setVisibleCharts(prev => ({
      ...prev,
      [chartType]: !prev[chartType]
    }));
  };

  const chartButtons = [
    { key: 'histogram', label: 'Histograms', icon: BarChart2, activeClass: 'bg-blue-600 hover:bg-blue-700' },
    { key: 'scatter', label: 'Scatter Plots', icon: ScatterIcon, activeClass: 'bg-green-600 hover:bg-green-700' },
    { key: 'correlation', label: 'Correlation', icon: Grid, activeClass: 'bg-purple-600 hover:bg-purple-700' },
    { key: 'missing', label: 'Missing Values', icon: AlertTriangle, activeClass: 'bg-red-600 hover:bg-red-700' }
  ] as const;

  // Removed hasManyNumericColumns as we now always show dropdowns for single chart selection

  // Initialize selected columns for single chart display
  const getSelectedHistogramColumn = () => {
    if (!selectedHistogramColumn && numericColumns.length > 0) {
      return numericColumns[0];
    }
    return selectedHistogramColumn;
  };

  const getSelectedScatterColumns = () => {
    if (!selectedScatterXColumn && numericColumns.length > 0) {
      return { x: numericColumns[0], y: numericColumns[1] || numericColumns[0] };
    }
    if (!selectedScatterYColumn && numericColumns.length > 1) {
      return { x: selectedScatterXColumn, y: numericColumns[1] };
    }
    return { x: selectedScatterXColumn, y: selectedScatterYColumn };
  };

  return (
    <div className="space-y-4">
      {/* Compact Chart Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Advanced Visualizations
          </CardTitle>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Deterministic sample: {data.length.toLocaleString()} of {totalRows.toLocaleString()} records • {Object.keys(analysis.column_types).length} columns • {numericColumns.length} numeric
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Chart Toggle Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            {chartButtons.map(({ key, label, icon: Icon, activeClass }) => (
              <Button
                key={key}
                variant={visibleCharts[key] ? "default" : "outline"}
                size="sm"
                onClick={() => toggleChart(key)}
                aria-pressed={visibleCharts[key]}
                className={visibleCharts[key] ? `${activeClass} text-white` : ''}
              >
                {visibleCharts[key] ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                <Icon className="h-3 w-3" />
                {label}
              </Button>
            ))}
          </div>

        </CardContent>
      </Card>

      {/* All Analysis Types Display */}
      <div className="space-y-4">
        {/* Distribution and Relationship Analysis - 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Histogram Charts */}
        {visibleCharts.histogram && (
          <Card className="flex min-h-[420px] h-full flex-col sm:min-h-[500px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Distribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              {numericColumns.length > 0 ? (
                <div className="space-y-4">
                  {/* Column Selection for Single Histogram */}
                  <div>
                    <label id="histogram-column-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Column to Display:
                    </label>
                    <Select 
                      value={getSelectedHistogramColumn()} 
                      onValueChange={(value) => setSelectedHistogramColumn(value)}
                    >
                      <SelectTrigger className="w-full" aria-labelledby="histogram-column-label">
                        <SelectValue placeholder="Select a column" />
                      </SelectTrigger>
                      <SelectContent>
                        {numericColumns.map((col) => (
                          <SelectItem key={col} value={col}>
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <HistogramChart 
                    data={data} 
                    numericColumns={[getSelectedHistogramColumn()]} 
                    maxColumns={1}
                  />
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                  No numeric columns available for histogram analysis
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Scatter Plots */}
        {visibleCharts.scatter && (
          <Card className="flex min-h-[420px] h-full flex-col sm:min-h-[500px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ScatterIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                Relationship Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 flex-1">
              {numericColumns.length >= 2 ? (
                <div className="space-y-4">
                  {/* Column Selection for Single Scatter Plot */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label id="scatter-x-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        X-Axis Column:
                      </label>
                      <Select 
                        value={getSelectedScatterColumns().x} 
                        onValueChange={(value) => setSelectedScatterXColumn(value)}
                      >
                        <SelectTrigger className="w-full" aria-labelledby="scatter-x-label">
                          <SelectValue placeholder="Select X column" />
                        </SelectTrigger>
                        <SelectContent>
                          {numericColumns.map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label id="scatter-y-label" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Y-Axis Column:
                      </label>
                      <Select 
                        value={getSelectedScatterColumns().y} 
                        onValueChange={(value) => setSelectedScatterYColumn(value)}
                      >
                        <SelectTrigger className="w-full" aria-labelledby="scatter-y-label">
                          <SelectValue placeholder="Select Y column" />
                        </SelectTrigger>
                        <SelectContent>
                          {numericColumns.map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <ScatterPlot 
                    data={data} 
                    numericColumns={numericColumns} 
                    singlePlot={{
                      xColumn: getSelectedScatterColumns().x,
                      yColumn: getSelectedScatterColumns().y
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                  Need at least 2 numeric columns for scatter plot analysis
                </div>
              )}
            </CardContent>
          </Card>
        )}


        </div>

        {/* Correlation Matrix and Data Quality Analysis - 1 Column Layout */}
        <div className="space-y-4">
          {/* Correlation Heatmap */}
          {visibleCharts.correlation && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Grid className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Correlation Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {numericColumns.length > 1 ? (
                  <CorrelationHeatmap 
                    correlationMatrix={analysis.correlation_matrix} 
                    numericColumns={numericColumns}
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    Need at least 2 numeric columns for correlation analysis
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Missing Values Chart */}
          {visibleCharts.missing && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  Data Quality Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <MissingValuesChart 
                  missingValues={analysis.missing_values} 
                  totalRecords={totalRows}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* No Charts Visible Message */}
      {!Object.values(visibleCharts).some(Boolean) && (
        <Card>
          <CardContent className="text-center py-8">
            <EyeOff className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              All Charts Hidden
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Use the toggle buttons above to show specific visualizations
            </p>
            <Button 
              size="sm"
              onClick={() => setVisibleCharts({
                histogram: true,
                scatter: true,
                correlation: true,
                missing: true
              })}
            >
              Show All Charts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
