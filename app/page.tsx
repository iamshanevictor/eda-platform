import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, ShieldCheck, Upload } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl py-12 text-center sm:py-16" aria-labelledby="hero-title">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
          Private, session-isolated analysis
        </p>
        <h1 id="hero-title" className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          Understand your CSV in minutes
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl">
          Upload a bounded CSV to explore summary statistics, missing values,
          correlations, and visualizations without sending your dataset to an AI provider.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/upload">
              Upload a CSV
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/data">
              View my analyses
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-6 py-10 md:grid-cols-3" aria-label="Platform features">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              Bounded upload
            </CardTitle>
            <CardDescription>
              Upload files up to 2 MiB and get immediate, actionable validation feedback.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
              Focused EDA
            </CardTitle>
            <CardDescription>
              Explore statistics, correlations, distributions, scatter plots, and data-quality signals.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              Private by default
            </CardTitle>
            <CardDescription>
              Keep data isolated to your anonymous session with automatic 24-hour expiry.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 py-8 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Shane Victor Bato-on. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
