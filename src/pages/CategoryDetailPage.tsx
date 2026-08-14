import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { JobService } from '@/services';
import { getCategoryBySlug } from '@/data/categories';
import { getWilayaByCode } from '@/data/wilayas';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JobCard } from '@/components/jobs/JobCard';
import { JobListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Badge } from '@/components/ui/Badge';
import type { Job } from '@/types';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { MapPin } from 'lucide-react';

export function CategoryDetailPage() {
  const { category: slug } = useParams<{ category: string }>();
  const { t, locale } = useI18n();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const category = getCategoryBySlug(slug ?? '');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    JobService.getByCategory(slug)
      .then((j) => {
        setJobs(j);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (!category) {
    return (
      <div className="container-page py-16">
        <ErrorState onBack={() => window.history.back()} />
      </div>
    );
  }

  const Icon = (Icons[category.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Briefcase;

  // Count wilayas in this category
  const wilayaCounts = jobs.reduce((acc, j) => {
    acc[j.wilaya] = (acc[j.wilaya] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container-page py-6">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.categories'), to: '/categories' },
          { label: category.name[locale] },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink-900">{category.name[locale]}</h1>
          <p className="text-sm text-ink-500">{category.name.fr} · {category.name.en}</p>
        </div>
      </div>

      {/* Wilaya chips */}
      {Object.keys(wilayaCounts).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(wilayaCounts).map(([wCode, count]) => {
            const w = getWilayaByCode(parseInt(wCode, 10));
            return (
              <Link
                key={wCode}
                to={`/locations/${wCode}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm hover:border-primary-300 hover:text-primary-700 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-ink-400" />
                {w?.name[locale] ?? wCode}
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
