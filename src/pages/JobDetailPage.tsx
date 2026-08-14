import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { JobService } from '@/services';
import { useJobDisplay, useLocalizedText, formatDate, timeAgo } from '@/utils';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/States';
import { JobCard } from '@/components/jobs/JobCard';
import { getWilayaByCode } from '@/data/wilayas';
import { getCategoryBySlug } from '@/data/categories';
import type { Job } from '@/types';
import { MapPin, Building2, Clock, Briefcase, GraduationCap, ExternalLink, Bookmark, Share2, AlertTriangle, CheckCircle2, Calendar, FileText } from 'lucide-react';

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const lt = useLocalizedText();
  const { wilayaName, contractLabel, experienceLabel, salaryText, remoteLabel, freshnessColor } = useJobDisplay();
  const [job, setJob] = useState<Job | null>(null);
  const [related, setRelated] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    JobService.getBySlug(id).then((j) => {
      if (j) {
        setJob(j);
        setLoading(false);
        JobService.getRelated(id).then(setRelated);
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
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="container-page py-16">
        <ErrorState
          title={t('job.noLongerAvailable')}
          onBack={() => window.history.back()}
        />
      </div>
    );
  }

  const wilaya = getWilayaByCode(parseInt(job.wilaya, 10));
  const category = getCategoryBySlug(job.category);

  return (
    <div className="container-page py-6">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs
          items={[
            { label: t('nav.home'), to: '/' },
            { label: t('nav.jobs'), to: '/jobs' },
            ...(category ? [{ label: category.name[locale], to: `/categories/${category.slug}` }] : []),
            { label: lt(job.title) },
          ]}
          className="mb-5"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {job.isDemo && <Badge variant="neutral">{t('common.demoData')}</Badge>}
                    {job.freshness === 'expired' && <Badge variant="danger">{t('job.noLongerAvailable')}</Badge>}
                  </div>
                  <h1 className="text-2xl font-bold text-ink-900">{lt(job.title)}</h1>
                  <div className="mt-2 flex items-center gap-2 text-ink-600">
                    <Building2 className="h-4 w-4 text-ink-400" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${saved ? 'border-primary-200 bg-primary-50 text-primary-600' : 'border-ink-200 text-ink-400 hover:text-primary-600 hover:border-primary-200'}`}
                    aria-label={t('home.save')}
                  >
                    <Bookmark className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-400 hover:text-primary-600 hover:border-primary-200 transition-colors"
                    aria-label={t('job.share')}
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Key details */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                <DetailItem icon={MapPin} label={t('job.location')} value={wilayaName(job.wilaya) + (job.commune ? ` · ${job.commune}` : '')} />
                <DetailItem icon={Briefcase} label={t('job.contract')} value={contractLabel(job.contract)} />
                <DetailItem icon={Clock} label={t('job.experience')} value={experienceLabel(job.experience)} />
                {job.education && <DetailItem icon={GraduationCap} label={t('filter.education')} value={t(`edu.${job.education}` as never)} />}
                <DetailItem icon={Briefcase} label={t('job.salary')} value={salaryText(job.salary)} />
                <DetailItem icon={MapPin} label={t('filter.remote')} value={remoteLabel(job.remote)} />
              </div>

              {/* Verification + freshness */}
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-4">
                <VerificationBadge status={job.verification} size="md" />
                <span className="inline-flex items-center gap-1.5 text-sm text-ink-500">
                  <Calendar className="h-4 w-4 text-ink-400" />
                  {t('job.published')} {formatDate(job.publishedAt, locale)}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-sm ${freshnessColor(job.freshness)}`}>
                  <Clock className="h-4 w-4" />
                  {timeAgo(job.lastCheckedAt, locale)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-ink-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-ink-900 mb-3">{t('job.description')}</h2>
              <p className="text-ink-600 leading-relaxed">{lt(job.description)}</p>
            </div>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-ink-900 mb-3">{t('job.requirements')}</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-ink-600">
                      <CheckCircle2 className="h-5 w-5 text-success-500 shrink-0 mt-0.5" />
                      <span>{lt(req)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="rounded-2xl border border-ink-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-ink-900 mb-3">{t('job.skills')}</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="rounded-lg bg-ink-100 px-3 py-1.5 text-sm font-medium text-ink-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Source info */}
            <div className="rounded-2xl border border-ink-200 bg-ink-50 p-6">
              <h2 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">{t('job.source')}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-ink-700">
                  <FileText className="h-4 w-4 text-ink-400" />
                  <span>{lt(job.source.name)}</span>
                </div>
                <div className="flex items-center gap-2 text-ink-500">
                  <Clock className="h-4 w-4 text-ink-400" />
                  <span>{t('trust.lastChecked')}: {formatDate(job.lastCheckedAt, locale)}</span>
                </div>
              </div>
              {job.source.url && (
                <a
                  href={job.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  {t('job.viewOriginal')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Report */}
            <div className="flex items-center gap-2 text-sm text-ink-400">
              <AlertTriangle className="h-4 w-4" />
              <button className="hover:text-danger-600 transition-colors">{t('job.reportJob')}</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Apply card */}
              <div className="rounded-2xl border border-ink-200 bg-white p-6">
                <h3 className="font-semibold text-ink-900 mb-1">{lt(job.title)}</h3>
                <p className="text-sm text-ink-500 mb-4">{job.company}</p>
                {job.applyUrl ? (
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="primary" fullWidth>
                      <ExternalLink className="h-4 w-4" />
                      {t('job.apply')}
                    </Button>
                  </a>
                ) : (
                  <div>
                    <Button variant="primary" fullWidth disabled>
                      {t('job.apply')}
                    </Button>
                    <p className="mt-2 text-xs text-ink-400 text-center">
                      {t('job.notSpecified')}
                    </p>
                  </div>
                )}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">{t('job.published')}</span>
                    <span className="text-ink-700">{timeAgo(job.publishedAt, locale)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-500">{t('trust.verificationStatus')}</span>
                    <VerificationBadge status={job.verification} showLabel={true} size="sm" />
                  </div>
                </div>
              </div>

              {/* AI disclaimer */}
              <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
                <p className="text-xs text-ink-500 leading-relaxed">{t('ai.disclaimer')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related jobs */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-ink-900 mb-4">{t('job.relatedJobs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-5 w-5 text-ink-400 shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm font-medium text-ink-800 truncate">{value}</p>
      </div>
    </div>
  );
}
