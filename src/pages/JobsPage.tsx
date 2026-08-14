import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { SearchBar } from '@/components/jobs/SearchBar';
import { FilterPanel } from '@/components/jobs/FilterPanel';
import { JobCard } from '@/components/jobs/JobCard';
import { JobListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { Pagination } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { JobService, type JobFilters, type SortOption, type JobSearchResult } from '@/services';
import { useLocalizedText } from '@/utils';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';

export function JobsPage() {
  const { t, locale } = useI18n();
  const lt = useLocalizedText();
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState<JobSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const keyword = searchParams.get('q') ?? '';
  const wilaya = searchParams.get('wilaya') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const sort = (searchParams.get('sort') ?? 'relevant') as SortOption;

  const filters: JobFilters = {
    keyword: keyword || undefined,
    wilaya: wilaya || undefined,
    category: category || undefined,
    contract: (searchParams.get('contract') as JobFilters['contract']) || undefined,
    experience: (searchParams.get('experience') as JobFilters['experience']) || undefined,
    remote: searchParams.get('remote') === 'true' || undefined,
    verification: (searchParams.get('verification') as JobFilters['verification']) || undefined,
    datePosted: (searchParams.get('datePosted') as JobFilters['datePosted']) || undefined,
  };

  const activeFilterCount = [filters.wilaya, filters.category, filters.contract, filters.experience, filters.remote, filters.verification, filters.datePosted].filter(Boolean).length;

  const updateParam = useCallback((key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const handleFiltersChange = (newFilters: JobFilters) => {
    const next = new URLSearchParams(searchParams);
    if (newFilters.wilaya) next.set('wilaya', newFilters.wilaya); else next.delete('wilaya');
    if (newFilters.category) next.set('category', newFilters.category); else next.delete('category');
    if (newFilters.contract) next.set('contract', newFilters.contract); else next.delete('contract');
    if (newFilters.experience) next.set('experience', newFilters.experience); else next.delete('experience');
    if (newFilters.remote) next.set('remote', 'true'); else next.delete('remote');
    if (newFilters.verification) next.set('verification', newFilters.verification); else next.delete('verification');
    if (newFilters.datePosted && newFilters.datePosted !== 'any') next.set('datePosted', newFilters.datePosted); else next.delete('datePosted');
    next.delete('page');
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (keyword) next.set('q', keyword);
    setSearchParams(next);
  };

  const handlePageChange = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setLoading(true);
    setError(false);
    JobService.search({ ...filters, sort, page, pageSize: 10 })
      .then((res) => {
        setResult(res);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [keyword, wilaya, category, page, sort, filters.contract, filters.experience, filters.remote, filters.verification, filters.datePosted]);

  return (
    <div>
      {/* Search header */}
      <section className="bg-white border-b border-ink-200">
        <div className="container-page py-6">
          <h1 className="text-2xl font-bold text-ink-900 mb-4">{t('jobs.title')}</h1>
          <SearchBar variant="inline" initialKeyword={keyword} initialWilaya={wilaya} />
        </div>
      </section>

      <div className="container-page py-6">
        <div className="flex gap-6">
          {/* Desktop filters sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 rounded-xl border border-ink-200 bg-white p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-ink-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t('jobs.filters')}
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    {t('common.clearAll')}
                  </button>
                )}
              </div>
              <FilterPanel filters={filters} onChange={handleFiltersChange} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  <Filter className="h-4 w-4" />
                  {t('jobs.filters')}
                  {activeFilterCount > 0 && (
                    <Badge variant="primary">{activeFilterCount}</Badge>
                  )}
                </button>
                {result && !loading && (
                  <p className="text-sm text-ink-500">
                    {t('jobs.results').replace('{count}', String(result.total))}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="h-9 rounded-lg border border-ink-200 bg-white px-3 text-sm font-medium text-ink-700 focus:outline-none focus:border-primary-500"
                >
                  <option value="relevant">{t('jobs.sort.relevant')}</option>
                  <option value="newest">{t('jobs.sort.newest')}</option>
                  <option value="oldest">{t('jobs.sort.oldest')}</option>
                  <option value="salaryHigh">{t('jobs.sort.salaryHigh')}</option>
                  <option value="salaryLow">{t('jobs.sort.salaryLow')}</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.wilaya && (
                  <FilterChip label={filters.wilaya} onRemove={() => updateParam('wilaya', null)} />
                )}
                {filters.category && (
                  <FilterChip label={filters.category} onRemove={() => updateParam('category', null)} />
                )}
                {filters.contract && (
                  <FilterChip label={t(`contract.${filters.contract}` as never)} onRemove={() => updateParam('contract', null)} />
                )}
                {filters.experience && (
                  <FilterChip label={t(`exp.${filters.experience}` as never)} onRemove={() => updateParam('experience', null)} />
                )}
                {filters.remote && (
                  <FilterChip label={t('filter.remoteOnly')} onRemove={() => updateParam('remote', null)} />
                )}
                {filters.verification && (
                  <FilterChip label={t(`verify.${filters.verification}` as never)} onRemove={() => updateParam('verification', null)} />
                )}
                {filters.datePosted && filters.datePosted !== 'any' && (
                  <FilterChip label={t(`filter.last${filters.datePosted === '24h' ? '24h' : filters.datePosted === '7d' ? '7days' : '30days'}` as never)} onRemove={() => updateParam('datePosted', null)} />
                )}
              </div>
            )}

            {/* Results content */}
            {loading ? (
              <JobListSkeleton count={5} />
            ) : error ? (
              <ErrorState onRetry={() => window.location.reload()} />
            ) : result && result.jobs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {result.jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                {result.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination page={result.page} totalPages={result.totalPages} onPageChange={handlePageChange} />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                actionLabel={t('jobs.clearFilters')}
                onAction={clearFilters}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 inset-x-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-ink-900 text-lg">{t('jobs.filters')}</h2>
              <button onClick={() => setShowMobileFilters(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterPanel filters={filters} onChange={handleFiltersChange} />
            <div className="mt-5 flex gap-3">
              <Button variant="secondary" fullWidth onClick={clearFilters}>{t('common.clearAll')}</Button>
              <Button variant="primary" fullWidth onClick={() => setShowMobileFilters(false)}>{t('jobs.applyFilters')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 px-3 py-1 text-sm font-medium text-primary-700 hover:bg-primary-100 transition-colors"
    >
      {label}
      <X className="h-3.5 w-3.5" />
    </button>
  );
}
