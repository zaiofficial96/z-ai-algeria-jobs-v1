import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import type { Job } from '@/types';
import { useJobDisplay, timeAgo } from '@/utils';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import { Badge } from '@/components/ui/Badge';
import { Bookmark, MapPin, Building2, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

interface JobCardProps {
  job: Job;
  saved?: boolean;
  onSaveToggle?: (jobId: string) => void;
  variant?: 'default' | 'compact';
}

export function JobCard({ job, saved = false, onSaveToggle, variant = 'default' }: JobCardProps) {
  const { locale, t } = useI18n();
  const { lt, wilayaName, contractLabel, salaryText, remoteLabel, freshnessColor } = useJobDisplay();

  return (
    <article className="group rounded-xl border border-ink-200 bg-white p-5 transition-all hover:border-primary-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {job.isDemo && (
              <Badge variant="neutral" className="shrink-0">
                {t('common.demoData')}
              </Badge>
            )}
            <Link to={`/jobs/${job.slug}`} className="text-lg font-semibold text-ink-900 hover:text-primary-700 transition-colors line-clamp-1">
              {lt(job.title)}
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600">
            <Building2 className="h-4 w-4 shrink-0 text-ink-400" />
            <span className="truncate">{job.company}</span>
          </div>
        </div>
        <button
          onClick={() => onSaveToggle?.(job.id)}
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors',
            saved
              ? 'border-primary-200 bg-primary-50 text-primary-600'
              : 'border-ink-200 text-ink-400 hover:text-primary-600 hover:border-primary-200'
          )}
          aria-label={saved ? t('home.saved') : t('home.save')}
        >
          <Bookmark className={cn('h-4 w-4', saved && 'fill-current')} />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="inline-flex items-center gap-1 text-ink-600">
          <MapPin className="h-4 w-4 text-ink-400" />
          {wilayaName(job.wilaya)}
          {job.commune && <span className="text-ink-400"> · {job.commune}</span>}
        </span>
        <span className="text-ink-300">·</span>
        <span className="text-ink-600">{contractLabel(job.contract)}</span>
        {job.remote !== 'onsite' && job.remote !== 'unknown' && (
          <>
            <span className="text-ink-300">·</span>
            <Badge variant="info">{remoteLabel(job.remote)}</Badge>
          </>
        )}
      </div>

      {variant === 'default' && job.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="rounded-md bg-ink-100 px-2 py-0.5 text-xs text-ink-600">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink-100 pt-3">
        <div className="flex items-center gap-3 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span className={freshnessColor(job.freshness)}>{timeAgo(job.publishedAt, locale)}</span>
          </span>
          <VerificationBadge status={job.verification} size="sm" />
        </div>
        <div className="flex items-center gap-2">
          {job.salary ? (
            <span className="text-sm font-semibold text-ink-900">{salaryText(job.salary)}</span>
          ) : (
            <span className="text-xs text-ink-400">{t('job.salaryNotSpecified')}</span>
          )}
        </div>
      </div>
    </article>
  );
}
