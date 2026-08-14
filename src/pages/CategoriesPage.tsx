import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { categories } from '@/data/categories';
import { demoJobs } from '@/data/demoData';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

export function CategoriesPage() {
  const { t, locale } = useI18n();

  const getJobCount = (slug: string) => demoJobs.filter((j) => j.category === slug).length;

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.categories') }]} className="mb-4" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">{t('nav.categories')}</h1>
        <p className="mt-1 text-ink-500">{t('home.jobCategories')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] as LucideIcon) ?? Icons.Briefcase;
          const count = getJobCount(cat.slug);
          return (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-5 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shrink-0 group-hover:bg-primary-100 transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink-900 group-hover:text-primary-700 transition-colors">{cat.name[locale]}</h3>
                <p className="text-sm text-ink-500">{cat.name.fr}</p>
              </div>
              {count > 0 && (
                <Badge variant="primary">{count}</Badge>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
