import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { CompanyService, JobService } from '@/services';
import { useLocalizedText } from '@/utils';
import { getWilayaByCode } from '@/data/wilayas';
import { categories } from '@/data/categories';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/States';
import { JobCard } from '@/components/jobs/JobCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Company, Job } from '@/types';
import { Building2, MapPin, ExternalLink, Briefcase } from 'lucide-react';

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const lt = useLocalizedText();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    CompanyService.getBySlug(id).then((c) => {
      if (c) {
        setCompany(c);
        CompanyService.getJobs(c.id).then(setJobs);
        setLoading(false);
      } else {
        setNotFound(true);
        setLoading(false);
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="container-page py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (notFound || !company) {
    return (
      <div className="container-page py-16">
        <ErrorState onBack={() => window.history.back()} />
      </div>
    );
  }

  const wilaya = company.wilaya ? getWilayaByCode(parseInt(company.wilaya, 10)) : null;
  const cat = categories.find((c) => c.slug === company.industry);

  return (
    <div className="container-page py-6">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs
          items={[
            { label: t('nav.home'), to: '/' },
            { label: t('companies.title'), to: '/companies' },
            { label: company.name },
          ]}
          className="mb-5"
        />

        {/* Company header */}
        <div className="rounded-2xl border border-ink-200 bg-white p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 shrink-0">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-ink-900">{company.name}</h1>
                {company.isDemo && <Badge variant="neutral">{t('common.demoData')}</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
                {cat && <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" />{cat.name[locale]}</span>}
                {wilaya && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{wilaya.name[locale]}</span>}
              </div>
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            )}
          </div>

          {company.description && (
            <p className="mt-5 text-ink-600 leading-relaxed">{lt(company.description)}</p>
          )}
        </div>

        {/* Active jobs */}
        <div>
          <h2 className="text-lg font-semibold text-ink-900 mb-4">
            {t('companies.activeJobs').replace('{count}', String(jobs.length))}
          </h2>
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-ink-200 bg-white p-8 text-center text-ink-500">
              {t('companies.noDataDesc')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
