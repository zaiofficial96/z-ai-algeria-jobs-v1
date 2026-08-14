import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { CompanyService } from '@/services';
import { useLocalizedText } from '@/utils';
import { getWilayaByCode } from '@/data/wilayas';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmptyState } from '@/components/ui/States';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import type { Company } from '@/types';
import { Building2, MapPin, Briefcase, Search } from 'lucide-react';

export function CompaniesPage() {
  const { t, locale } = useI18n();
  const lt = useLocalizedText();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filtered, setFiltered] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [wilayaFilter, setWilayaFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');

  useEffect(() => {
    CompanyService.getAll().then((c) => {
      setCompanies(c);
      setFiltered(c);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = companies;
    if (search) result = result.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
    if (wilayaFilter) result = result.filter((c) => c.wilaya === wilayaFilter);
    if (industryFilter) result = result.filter((c) => c.industry === industryFilter);
    setFiltered(result);
  }, [search, wilayaFilter, industryFilter, companies]);

  const wilayasWithCompanies = [...new Set(companies.map((c) => c.wilaya).filter(Boolean))] as string[];
  const industriesWithCompanies = [...new Set(companies.map((c) => c.industry))] as string[];

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('companies.title') }]} className="mb-4" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">{t('companies.title')}</h1>
        <p className="mt-1 text-ink-500">{t('companies.subtitle')}</p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder={t('filter.company')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
        <Select value={wilayaFilter} onChange={(e) => setWilayaFilter(e.target.value)}>
          <option value="">{t('filter.allWilayas')}</option>
          {wilayasWithCompanies.map((w) => {
            const wilaya = getWilayaByCode(parseInt(w, 10));
            return <option key={w} value={w}>{wilaya?.name[locale]}</option>;
          })}
        </Select>
        <Select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
          <option value="">{t('filter.allCategories')}</option>
          {industriesWithCompanies.map((ind) => {
            const cat = categories.find((c) => c.slug === ind);
            return <option key={ind} value={ind}>{cat?.name[locale] ?? ind}</option>;
          })}
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-ink-200 bg-white p-5">
              <Skeleton className="h-12 w-12 rounded-xl mb-3" />
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t('companies.noData')}
          description={t('companies.noDataDesc')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => {
            const wilaya = company.wilaya ? getWilayaByCode(parseInt(company.wilaya, 10)) : null;
            const cat = categories.find((c) => c.slug === company.industry);
            return (
              <Link
                key={company.id}
                to={`/companies/${company.slug}`}
                className="group rounded-xl border border-ink-200 bg-white p-5 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 shrink-0">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-ink-900 group-hover:text-primary-700 transition-colors truncate">
                      {company.name}
                    </h3>
                    <p className="text-sm text-ink-500">{cat?.name[locale] ?? company.industry}</p>
                  </div>
                </div>
                {company.description && (
                  <p className="text-sm text-ink-500 line-clamp-2 mb-3">{lt(company.description)}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-ink-500">
                    {wilaya && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-ink-400" />
                        {wilaya.name[locale]}
                      </span>
                    )}
                  </div>
                  <Badge variant="primary">
                    <Briefcase className="h-3 w-3" />
                    {t('companies.activeJobs').replace('{count}', String(company.activeJobs))}
                  </Badge>
                </div>
                {company.isDemo && (
                  <div className="mt-3">
                    <Badge variant="neutral">{t('common.demoData')}</Badge>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
