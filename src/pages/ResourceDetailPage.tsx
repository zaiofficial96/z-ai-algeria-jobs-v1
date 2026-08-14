import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { ResourceService } from '@/services';
import { useLocalizedText } from '@/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/States';
import { Skeleton } from '@/components/ui/Skeleton';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import type { ResourceArticle } from '@/types';

export function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, locale } = useI18n();
  const lt = useLocalizedText();
  const [resource, setResource] = useState<ResourceArticle | null>(null);
  const [related, setRelated] = useState<ResourceArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    ResourceService.getBySlug(id).then((r) => {
      if (r) {
        setResource(r);
        setLoading(false);
        ResourceService.getAll().then((all) => {
          setRelated(all.filter((x) => x.slug !== r.slug && x.category === r.category).slice(0, 3));
        });
      } else {
        setNotFound(true);
        setLoading(false);
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="container-page py-8 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (notFound || !resource) {
    return (
      <div className="container-page py-16">
        <ErrorState onBack={() => window.history.back()} />
      </div>
    );
  }

  const categoryLabel = t(`resources.${resource.category}` as never);

  return (
    <div className="container-page py-6">
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: t('nav.home'), to: '/' },
            { label: t('resources.title'), to: '/resources' },
            { label: lt(resource.title) },
          ]}
          className="mb-5"
        />

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="primary">{categoryLabel}</Badge>
          <span className="inline-flex items-center gap-1 text-sm text-ink-400">
            <Clock className="h-4 w-4" />
            {t('resources.readingTime').replace('{count}', String(resource.readingTime))}
          </span>
          {resource.isDemo && <Badge variant="neutral">{t('common.demoData')}</Badge>}
        </div>

        <h1 className="text-3xl font-bold text-ink-900 mb-4">{lt(resource.title)}</h1>
        <p className="text-lg text-ink-600 leading-relaxed mb-8">{lt(resource.excerpt)}</p>

        <div className="rounded-2xl border border-ink-200 bg-white p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-ink-900">{t('resources.readMore')}</h2>
          </div>
          <p className="text-ink-600 leading-relaxed">{lt(resource.excerpt)}</p>
          <p className="text-ink-600 leading-relaxed mt-4">{t('resources.comingSoonDesc')}</p>
        </div>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-ink-900 mb-4">{t('resources.title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/resources/${r.slug}`}
                  className="group rounded-xl border border-ink-200 bg-white p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-medium text-ink-900 group-hover:text-primary-700 transition-colors line-clamp-2">{lt(r.title)}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm text-primary-600">
                    {t('resources.readMore')}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
