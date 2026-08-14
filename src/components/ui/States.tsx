import { useI18n } from '@/i18n';
import { Button } from './Button';
import { SearchX, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-100 text-ink-400 mb-4">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-ink-900">{title ?? t('jobs.noResults')}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-500">{description ?? t('jobs.noResultsDesc')}</p>
      {(actionLabel || secondaryLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actionLabel && (
            <Button onClick={onAction} variant="primary">
              {actionLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button onClick={onSecondary} variant="secondary">
              {secondaryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
  onBack,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 text-danger-500 mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-ink-900">{title ?? t('common.error')}</h3>
      <p className="mt-2 max-w-md text-sm text-ink-500">{description ?? t('common.errorDesc')}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <RefreshCw className="h-4 w-4" />
            {t('common.tryAgain')}
          </Button>
        )}
        {onBack && (
          <Button onClick={onBack} variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            {t('common.backToJobs')}
          </Button>
        )}
      </div>
    </div>
  );
}
