import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/Button';
import { Compass, ArrowRight } from 'lucide-react';

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="container-page py-20">
      <div className="max-w-lg mx-auto text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-6">
          <Compass className="h-10 w-10" />
        </div>
        <p className="text-6xl font-bold text-primary-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">{t('notFound.title')}</h1>
        <p className="text-ink-500 mb-8">{t('notFound.desc')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary">{t('nav.home')}</Button>
          </Link>
          <Link to="/jobs">
            <Button variant="secondary">
              {t('notFound.cta')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
