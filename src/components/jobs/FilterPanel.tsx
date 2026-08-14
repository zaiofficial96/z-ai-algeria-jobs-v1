import { useI18n } from '@/i18n';
import { wilayas } from '@/data/wilayas';
import { categories } from '@/data/categories';
import type { ContractType, ExperienceLevel, VerificationStatus } from '@/types';
import type { JobFilters } from '@/services';
import { Select } from '@/components/ui/Input';
import { cn } from '@/utils/cn';

interface FilterPanelProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  className?: string;
}

const contracts: ContractType[] = ['CDI', 'CDD', 'Freelance', 'Internship', 'Temporary', 'PartTime', 'FullTime', 'Apprenticeship'];
const experiences: ExperienceLevel[] = ['none', 'internship', 'entry', '1to2', '3to5', '5plus', 'senior', 'manager'];
const verifications: VerificationStatus[] = ['verified', 'sourceConfirmed', 'recentlyChecked', 'unverified'];

export function FilterPanel({ filters, onChange, className }: FilterPanelProps) {
  const { t } = useI18n();
  const { locale } = useI18n();

  const set = (patch: Partial<JobFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className={cn('space-y-4', className)}>
      <Select
        label={t('filter.wilaya')}
        value={filters.wilaya ?? ''}
        onChange={(e) => set({ wilaya: e.target.value || undefined })}
      >
        <option value="">{t('filter.allWilayas')}</option>
        {wilayas.map((w) => (
          <option key={w.code} value={String(w.code)}>{w.name[locale]}</option>
        ))}
      </Select>

      <Select
        label={t('filter.category')}
        value={filters.category ?? ''}
        onChange={(e) => set({ category: e.target.value || undefined })}
      >
        <option value="">{t('filter.allCategories')}</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>{c.name[locale]}</option>
        ))}
      </Select>

      <Select
        label={t('filter.contract')}
        value={filters.contract ?? ''}
        onChange={(e) => set({ contract: (e.target.value || undefined) as ContractType | undefined })}
      >
        <option value="">{t('filter.allContracts')}</option>
        {contracts.map((c) => (
          <option key={c} value={c}>{t(`contract.${c}` as never)}</option>
        ))}
      </Select>

      <Select
        label={t('filter.experience')}
        value={filters.experience ?? ''}
        onChange={(e) => set({ experience: (e.target.value || undefined) as ExperienceLevel | undefined })}
      >
        <option value="">{t('filter.allExperience')}</option>
        {experiences.map((exp) => (
          <option key={exp} value={exp}>{t(`exp.${exp}` as never)}</option>
        ))}
      </Select>

      <Select
        label={t('filter.verification')}
        value={filters.verification ?? ''}
        onChange={(e) => set({ verification: (e.target.value || undefined) as VerificationStatus | undefined })}
      >
        <option value="">{t('filter.allVerifications')}</option>
        {verifications.map((v) => (
          <option key={v} value={v}>{t(`verify.${v}` as never)}</option>
        ))}
      </Select>

      <Select
        label={t('filter.datePosted')}
        value={filters.datePosted ?? 'any'}
        onChange={(e) => set({ datePosted: (e.target.value || 'any') as JobFilters['datePosted'] })}
      >
        <option value="any">{t('filter.anyTime')}</option>
        <option value="24h">{t('filter.last24h')}</option>
        <option value="7d">{t('filter.last7days')}</option>
        <option value="30d">{t('filter.last30days')}</option>
      </Select>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.remote ?? false}
          onChange={(e) => set({ remote: e.target.checked || undefined })}
          className="h-4 w-4 rounded border-ink-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="text-sm font-medium text-ink-700">{t('filter.remoteOnly')}</span>
      </label>
    </div>
  );
}
