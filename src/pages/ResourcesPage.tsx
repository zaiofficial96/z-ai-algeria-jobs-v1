import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { demoResources } from '@/data/demoData';
import { useLocalizedText } from '@/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export function ResourcesPage() {
  const { t, locale } = useI18n();
  const lt = useLocalizedText();

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('resources.title') }]} className="mb-4" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">{t('resources.title')}</h1>
        <p className="mt-1 text-ink-500">{t('resources.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {demoResources.map((resource) => (
          <Link
            key={resource.slug}
            to={`/resources/${resource.slug}`}
            className="group flex flex-col rounded-xl border border-ink-200 bg-white p-5 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-ink-900 group-hover:text-primary-700 transition-colors mb-2">
              {lt(resource.title)}
            </h3>
            <p className="text-sm text-ink-500 line-clamp-2 mb-4 flex-1">{lt(resource.excerpt)}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1 text-ink-400">
                <Clock className="h-4 w-4" />
                {t('resources.readingTime').replace('{count}', String(resource.readingTime))}
              </span>
              <span className="inline-flex items-center gap-1 text-primary-600 font-medium">
                {t('resources.readMore')}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </span>
            </div>
            {resource.isDemo && (
              <div className="mt-3">
                <Badge variant="neutral">{t('common.demoData')}</Badge>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
