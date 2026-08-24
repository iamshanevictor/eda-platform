'use server';

import { createClient } from '@/lib/supabase/server';
import { requireDatasetId, requirePage, requirePageSize } from '@/lib/security/identifiers';
import { deterministicSampleIndexes } from '@/lib/analysis/sampling';

export interface DatasetDataResponse {
  data: Record<string, unknown>[];
  totalRows: number;
  hasMore: boolean;
}

export async function getDatasetData(
  datasetId: number, 
  page: number = 1, 
  pageSize: number = 1000
): Promise<DatasetDataResponse> {
  requireDatasetId(datasetId);
  requirePage(page);
  requirePageSize(pageSize);

  const supabase = await createClient();
  
  try {
    const { data: dataset, error } = await supabase
      .from('datasets')
      .select('row_count')
      .eq('id', datasetId)
      .single();

    if (error) {
      throw new Error('Dataset data is unavailable');
    }

    if (!dataset) {
      throw new Error('No data found for this dataset');
    }

    const totalRows = dataset.row_count;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRows);
    let paginatedData: Record<string, unknown>[] = [];

    if (startIndex < totalRows) {
      const { data: rows, error: rowsError } = await supabase
        .from('dataset_rows')
        .select('row_data')
        .eq('dataset_id', datasetId)
        .order('row_index', { ascending: true })
        .range(startIndex, endIndex - 1);

      if (rowsError) {
        throw new Error('Dataset data is unavailable');
      }

      paginatedData = (rows ?? []).map(row => row.row_data as Record<string, unknown>);
    }

    return {
      data: paginatedData,
      totalRows,
      hasMore: endIndex < totalRows
    };
  } catch (error) {
    console.error('Error fetching dataset data');
    throw error instanceof Error ? error : new Error('Dataset data is unavailable');
  }
}

export async function getDatasetSample(
  datasetId: number, 
  sampleSize: number = 1000
): Promise<Record<string, unknown>[]> {
  requireDatasetId(datasetId);
  requirePageSize(sampleSize);

  const supabase = await createClient();
  
  try {
    const { data: dataset, error } = await supabase
      .from('datasets')
      .select('row_count')
      .eq('id', datasetId)
      .single();

    if (error) {
      throw new Error('Dataset sample is unavailable');
    }

    if (!dataset) {
      throw new Error('No data found for this dataset');
    }

    const indexes = deterministicSampleIndexes(dataset.row_count, sampleSize);
    if (indexes.length === 0) {
      return [];
    }

    const { data: rows, error: rowsError } = await supabase
      .from('dataset_rows')
      .select('row_index, row_data')
      .eq('dataset_id', datasetId)
      .in('row_index', indexes)
      .order('row_index', { ascending: true });

    if (rowsError) {
      throw new Error('Dataset sample is unavailable');
    }

    return (rows ?? []).map(row => row.row_data as Record<string, unknown>);
  } catch (error) {
    console.error('Error fetching dataset sample');
    throw error instanceof Error ? error : new Error('Dataset sample is unavailable');
  }
}
