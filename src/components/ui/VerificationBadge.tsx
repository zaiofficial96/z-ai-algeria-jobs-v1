import { useI18n } from '@/i18n';
import type { VerificationStatus } from '@/types';
import { cn } from '@/utils/cn';

interface VerificationBadgeProps {
  status: VerificationStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  VerificationStatus,
  { color: string; bg: string; icon: string }
> = {
  verified: { color: 'text-success-700', bg: 'bg-success-50 border-success-200', icon: 'text-success-600' },
  sourceConfirmed: { color: 'text-primary-700', bg: 'bg-primary-50 border-primary-200', icon: 'text-primary-600' },
  recentlyChecked: { color: 'text-ink-600', bg: 'bg-ink-50 border-ink-200', icon: 'text-ink-500' },
  unverified: { color: 'text-warning-700', bg: 'bg-warning-50 border-warning-200', icon: 'text-warning-600' },
};

export function VerificationBadge({ status, showLabel = true, size = 'sm' }: VerificationBadgeProps) {
  const { t } = useI18n();
  const config = statusConfig[status];
  const label = t(`verify.${status}` as never);
  const tip = t(`verify.${status}Tip` as never);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      title={tip}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        config.bg,
        config.color,
        sizeClass
      )}
    >
      {status === 'verified' && (
        <svg className={cn('h-3.5 w-3.5', config.icon)} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {status === 'sourceConfirmed' && (
        <svg className={cn('h-3.5 w-3.5', config.icon)} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541.445a1 1 0 00-1.414-1.414L9 7.172 7.707 5.879a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      {status === 'recentlyChecked' && (
        <svg className={cn('h-3.5 w-3.5', config.icon)} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
        </svg>
      )}
      {status === 'unverified' && (
        <svg className={cn('h-3.5 w-3.5', config.icon)} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      )}
      {showLabel && <span>{label}</span>}
    </span>
  );
}
