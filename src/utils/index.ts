import type { Locale } from '@/types';
import { useI18n } from '@/i18n';
import type { Job, VerificationStatus, JobFreshness, RemoteStatus, ContractType, ExperienceLevel } from '@/types';
import { getWilayaByCode } from '@/data/wilayas';

export function useLocale(): Locale {
  const { locale } = useI18n();
  return locale;
}

export function useLocalizedText(): (text: Record<Locale, string>) => string {
  const { locale } = useI18n();
  return (text) => text[locale] ?? text.en;
}

export function useJobDisplay() {
  const { locale, t } = useI18n();
  const lt = (text: Record<Locale, string>) => text[locale] ?? text.en;

  const wilayaName = (code: string): string => {
    const w = getWilayaByCode(parseInt(code, 10));
    return w ? w.name[locale] : '';
  };

  const contractLabel = (contract: ContractType): string => t(`contract.${contract}` as never);
  const experienceLabel = (exp?: ExperienceLevel): string => exp ? t(`exp.${exp}` as never) : t('job.experienceNotSpecified');
  const verificationLabel = (status: VerificationStatus): string => t(`verify.${status}` as never);

  const freshnessColor = (freshness: JobFreshness): string => {
    switch (freshness) {
      case 'fresh': return 'text-success-600';
      case 'aging': return 'text-warning-600';
      case 'potentiallyExpired': return 'text-warning-700';
      case 'expired': return 'text-danger-600';
    }
  };

  const remoteLabel = (remote: RemoteStatus): string => {
    switch (remote) {
      case 'remote': return locale === 'ar' ? 'عن بعد' : locale === 'fr' ? 'À distance' : 'Remote';
      case 'hybrid': return locale === 'ar' ? 'هجين' : locale === 'fr' ? 'Hybride' : 'Hybrid';
      case 'onsite': return locale === 'ar' ? 'حضوري' : locale === 'fr' ? 'Sur site' : 'On-site';
      default: return locale === 'ar' ? 'غير معروف' : locale === 'fr' ? 'Inconnu' : 'Unknown';
    }
  };

  const salaryText = (salary?: Job['salary']): string => {
    if (!salary) return t('job.salaryNotSpecified');
    const fmt = (n: number) => n.toLocaleString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ');
    if (salary.min && salary.max) return `${fmt(salary.min)} – ${fmt(salary.max)} DZD`;
    if (salary.min) return `${fmt(salary.min)} DZD+`;
    if (salary.max) return `≤ ${fmt(salary.max)} DZD`;
    return t('job.salaryNotSpecified');
  };

  return { lt, wilayaName, contractLabel, experienceLabel, verificationLabel, freshnessColor, remoteLabel, salaryText };
}

export function timeAgo(isoDate: string, locale: Locale): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / (60 * 1000));
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  const replace = (template: string) => template.replace('{count}', String(n));

  let n: number;
  if (minutes < 1) return locale === 'ar' ? 'الآن' : locale === 'fr' ? "À l'instant" : 'Just now';
  if (hours < 1) { n = minutes; return replace(locale === 'ar' ? 'منذ {count} دقيقة' : locale === 'fr' ? 'Il y a {count} min' : '{count} min ago'); }
  if (days < 1) { n = hours; return replace(locale === 'ar' ? 'منذ {count} ساعة' : locale === 'fr' ? 'Il y a {count} h' : '{count}h ago'); }
  if (weeks < 1) { n = days; return replace(locale === 'ar' ? 'منذ {count} يوم' : locale === 'fr' ? 'Il y a {count} jours' : '{count} days ago'); }
  if (months < 1) { n = weeks; return replace(locale === 'ar' ? 'منذ {count} أسبوع' : locale === 'fr' ? 'Il y a {count} sem' : '{count}w ago'); }
  n = months;
  return replace(locale === 'ar' ? 'منذ {count} شهر' : locale === 'fr' ? 'Il y a {count} mois' : '{count}mo ago');
}

export function formatDate(isoDate: string, locale: Locale): string {
  return new Date(isoDate).toLocaleDateString(
    locale === 'ar' ? 'ar-DZ' : locale === 'fr' ? 'fr-DZ' : 'en-GB',
    { year: 'numeric', month: 'short', day: 'numeric' }
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
