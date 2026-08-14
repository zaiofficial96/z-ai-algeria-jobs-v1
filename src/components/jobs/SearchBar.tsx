import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { wilayas } from '@/data/wilayas';
import { Search, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  variant?: 'hero' | 'inline';
  initialKeyword?: string;
  initialWilaya?: string;
  className?: string;
}

export function SearchBar({ variant = 'hero', initialKeyword = '', initialWilaya = '', className }: SearchBarProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [wilaya, setWilaya] = useState(initialWilaya);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (wilaya) params.set('wilaya', wilaya);
    navigate(`/jobs?${params.toString()}`);
  };

  const isHero = variant === 'hero';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex flex-col gap-2 rounded-2xl bg-white p-2',
        isHero ? 'shadow-xl border border-ink-100 sm:flex-row sm:items-center sm:gap-0' : 'border border-ink-200 sm:flex-row sm:items-center sm:gap-0',
        className
      )}
    >
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 pointer-events-none" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('hero.searchPlaceholder')}
          className="w-full h-12 rounded-xl bg-transparent ps-10 pe-3 text-ink-900 placeholder-ink-400 focus:outline-none"
          aria-label={t('hero.searchPlaceholder')}
        />
      </div>
      <div className="relative sm:border-s sm:border-ink-200">
        <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-400 pointer-events-none" />
        <select
          value={wilaya}
          onChange={(e) => setWilaya(e.target.value)}
          className="w-full h-12 rounded-xl bg-transparent ps-10 pe-8 text-ink-900 focus:outline-none cursor-pointer appearance-none"
          aria-label={t('hero.locationPlaceholder')}
        >
          <option value="">{t('hero.allAlgeria')}</option>
          {wilayas.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name.en} — {w.name.fr}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className={cn(
          'inline-flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-medium text-white transition-colors',
          'bg-primary-600 hover:bg-primary-700 active:bg-primary-800',
          isHero ? 'sm:rounded-s-xl' : ''
        )}
      >
        <Search className="h-5 w-5" />
        {t('hero.searchButton')}
      </button>
    </form>
  );
}
