import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OptimizedDatasetTabs } from '@/components/OptimizedDatasetTabs';
import { getAnalysis } from '@/app/actions/analyzeData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

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

export default async function DataPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  let datasets: Dataset[] = [];
  let loadFailed = false;

  // A visitor receives an anonymous identity only after completing Turnstile
  // at the upload boundary. Until then, render an empty private workspace
  // instead of querying tables that intentionally deny the public anon role.
  if (authData.user?.is_anonymous) {
    const result = await supabase
      .from('datasets')
      .select('id, file_name, file_size, created_at, row_count')
      .order('created_at', { ascending: false })
      .limit(50);

    datasets = result.data ?? [];
    loadFailed = Boolean(result.error);
  }

  if (loadFailed) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Data Viewer & EDA Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View uploaded CSV datasets with automated EDA analysis
          </p>
        </header>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error Loading Data</CardTitle>
            <CardDescription>
              There was an error fetching the datasets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/40">
              <p className="text-red-800 dark:text-red-200">
                Your datasets could not be loaded. Please refresh and try again.
              </p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/data">Try again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch analysis data for each dataset (optimized with parallel processing)
  const datasetsWithAnalysis: DatasetWithAnalysis[] = await Promise.all(
    datasets.map(async (dataset) => {
      try {
        const analysis = await getAnalysis(dataset.id);
        return { ...dataset, analysis };
      } catch {
        console.error('Error fetching dataset analysis');
        return { ...dataset, analysis: null };
      }
    })
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Private workspace</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Data Viewer & EDA Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {datasetsWithAnalysis.length === 0
            ? 'Upload a CSV to create your first analysis.'
            : `${datasetsWithAnalysis.length} ${datasetsWithAnalysis.length === 1 ? 'dataset' : 'datasets'} available in this browser session.`}
        </p>
      </header>

      <OptimizedDatasetTabs datasets={datasetsWithAnalysis} />
    </div>
  );
}
