import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { JobService } from '@/services';
import { getWilayaByCode } from '@/data/wilayas';
import { categories } from '@/data/categories';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Badge';
import type { Job } from '@/types';
import { MapPin } from 'lucide-react';

export function LocationDetailPage() {
  const { wilaya: wilayaCode } = useParams<{ wilaya: string }>();
  const { t, locale } = useI18n();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const code = parseInt(wilayaCode ?? '0', 10);
  const wilaya = getWilayaByCode(code);

  useEffect(() => {
    if (!wilayaCode) return;
    setLoading(true);
    setError(false);
    JobService.getByWilaya(wilayaCode)
      .then((j) => {
        setJobs(j);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [wilayaCode]);

  if (!wilaya) {
    return (
      <div className="container-page py-16">
        <ErrorState onBack={() => window.history.back()} />
      </div>
    );
  }

  // Count categories in this location
  const categoryCounts = jobs.reduce((acc, j) => {
    acc[j.category] = (acc[j.category] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container-page py-6">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), to: '/' },
          { label: t('locations.title'), to: '/locations' },
          { label: wilaya.name[locale] },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{t('locations.jobsIn').replace('{wilaya}', wilaya.name[locale])}</h1>
          <p className="text-sm text-ink-500">{wilaya.name.fr} · {wilaya.name.en}</p>
        </div>
      </div>

      {/* Category chips */}
      {Object.keys(categoryCounts).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(categoryCounts).map(([slug, count]) => {
            const cat = categories.find((c) => c.slug === slug);
            return (
              <Link
                key={slug}
                to={`/categories/${slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                {cat?.name[locale] ?? slug}
                <Badge variant="neutral">{count}</Badge>
              </Link>
            );
          })}
        </div>
      )}

      {loading ? (
        <JobListSkeleton count={3} />
      ) : error ? (
        <ErrorState onRetry={() => window.location.reload()} />
      ) : jobs.length === 0 ? (
        <EmptyState
          actionLabel={t('jobs.clearFilters')}
          onAction={() => window.history.back()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
