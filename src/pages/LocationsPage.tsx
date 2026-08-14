import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { wilayas } from '@/data/wilayas';
import { demoJobs } from '@/data/demoData';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Search, Globe } from 'lucide-react';

export function LocationsPage() {
  const { t, locale } = useI18n();
  const [search, setSearch] = useState('');

  const filtered = wilayas.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return w.name.en.toLowerCase().includes(q) || w.name.fr.toLowerCase().includes(q) || w.name.ar.includes(search);
  });

  const getJobCount = (code: number) => demoJobs.filter((j) => j.wilaya === String(code)).length;

  // Group by first letter (French)
  const grouped = filtered.reduce((acc, w) => {
    const letter = w.name.fr[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(w);
    return acc;
  }, {} as Record<string, typeof wilayas>);

  const letters = Object.keys(grouped).sort();

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('locations.title') }]} className="mb-4" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">{t('locations.title')}</h1>
        <p className="mt-1 text-ink-500">{t('locations.subtitle')}</p>
      </div>

      <div className="mb-6 max-w-md">
        <Input
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </div>

      {/* Remote link */}
      <Link
        to="/jobs?remote=true"
        className="mb-6 flex items-center gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4 hover:bg-primary-100 transition-colors"
      >
        <Globe className="h-6 w-6 text-primary-600" />
        <div>
          <p className="font-medium text-primary-800">{t('locations.remote')}</p>
          <p className="text-sm text-primary-600">{t('filter.remoteOnly')}</p>
        </div>
      </Link>

      <div className="space-y-6">
        {letters.map((letter) => (
          <div key={letter}>
            <h2 className="text-lg font-semibold text-ink-900 mb-3 sticky top-16 bg-ink-50 py-1">{letter}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {grouped[letter].map((w) => {
                const count = getJobCount(w.code);
                return (
                  <Link
                    key={w.code}
                    to={`/locations/${w.code}`}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-ink-200 bg-white p-4 hover:border-primary-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-5 w-5 text-ink-400 group-hover:text-primary-600" />
                      <div>
                        <p className="font-medium text-ink-800 group-hover:text-primary-700">{w.name[locale]}</p>
                        <p className="text-xs text-ink-400">{w.name.fr} · {w.name.en}</p>
                      </div>
                    </div>
                    {count > 0 && (
                      <Badge variant="primary">{count} {t('common.jobs')}</Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
