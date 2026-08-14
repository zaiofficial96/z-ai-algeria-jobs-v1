import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { cn } from '@/utils/cn';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSuffix?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showSuffix = true, className }: LogoProps) {
  const { t } = useI18n();

  const sizes = {
    sm: { box: 'h-8 w-8', text: 'text-base', suffix: 'text-xs' },
    md: { box: 'h-9 w-9', text: 'text-lg', suffix: 'text-sm' },
    lg: { box: 'h-12 w-12', text: 'text-2xl', suffix: 'text-base' },
  };
  const s = sizes[size];

  return (
    <Link to="/" className={cn('flex items-center gap-2.5 group', className)} aria-label={t('brand.full')}>
      <div className={cn(
        'flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold shadow-sm transition-transform group-hover:scale-105',
        s.box
      )}>
        <span className={cn('leading-none', s.text)}>Z</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className={cn('font-bold text-ink-900', s.text)}>
          Z AI
        </span>
        {showSuffix && (
          <span className={cn('text-ink-500 font-medium', s.suffix)}>
            {t('brand.suffix')}
          </span>
        )}
      </div>
    </Link>
  );
}
