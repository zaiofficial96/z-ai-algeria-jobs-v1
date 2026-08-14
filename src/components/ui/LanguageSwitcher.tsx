import { useI18n } from '@/i18n';
import type { Locale } from '@/types';
import { cn } from '@/utils/cn';

const languages: { code: Locale; label: string; native: string }[] = [
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'en', label: 'English', native: 'English' },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={cn('flex items-center gap-1 rounded-lg bg-ink-100 p-0.5', compact && 'text-xs')}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            locale === lang.code
              ? 'bg-white text-primary-700 shadow-sm'
              : 'text-ink-500 hover:text-ink-700'
          )}
          aria-label={`Switch to ${lang.label}`}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
}
