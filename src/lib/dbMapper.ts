import type {
  Job,
  Company,
  ResourceArticle,
  ContractType,
  ExperienceLevel,
  VerificationStatus,
  SourceType,
  RemoteStatus,
  JobFreshness,
  LocalizedString,
} from '@/types';

// ---- Raw DB row types (match confirmed public.jobs schema) ----

export interface JobRow {
  id: string;
  title_ar: string | null;
  title_fr: string | null;
  title_en: string | null;
  slug: string | null;
  city: string | null;
  category: string | null;
  contract_type: string | null;
  company_id: string | null;
  company_name: string | null;
  wilaya: string | null;
  description_ar: string | null;
  description_fr: string | null;
  description_en: string | null;
  requirements: unknown;
  job_type: string | null;
  experience_level: string | null;
  remote_type: string | null;
  skills: unknown;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  source_url: string | null;
  source_name: string | null;
  source_type: string | null;
  verification_status: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
  expires_at: string | null;
}

export interface CompanyRow {
  id: string;
  slug: string | null;
  name: string | null;
  industry: string | null;
  wilaya: string | null;
  description_ar: string | null;
  description_fr: string | null;
  description_en: string | null;
  website: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ResourceRow {
  id: string;
  slug: string | null;
  title_ar: string | null;
  title_fr: string | null;
  title_en: string | null;
  excerpt_ar: string | null;
  excerpt_fr: string | null;
  excerpt_en: string | null;
  content_ar: string | null;
  content_fr: string | null;
  content_en: string | null;
  category: string | null;
  reading_time: number | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

// ---- Normalization helpers ----

const VALID_CONTRACTS: ContractType[] = [
  'CDI', 'CDD', 'Freelance', 'Internship', 'Temporary',
  'PartTime', 'FullTime', 'Apprenticeship', 'Remote',
];

const VALID_EXPERIENCES: ExperienceLevel[] = [
  'none', 'internship', 'entry', '1to2', '3to5', '5plus', 'senior', 'manager',
];

const VALID_VERIFICATIONS: VerificationStatus[] = [
  'verified', 'sourceConfirmed', 'recentlyChecked', 'unverified',
];

const VALID_SOURCE_TYPES: SourceType[] = [
  'officialCompanySite', 'governmentSource', 'externalPlatform',
  'employerListing', 'communitySource',
];

const VALID_REMOTE: RemoteStatus[] = ['remote', 'hybrid', 'onsite'];

export function normalizeContract(value: string | null): ContractType {
  if (!value) return 'CDI';
  const v = value.trim();
  // Try exact match first
  if (VALID_CONTRACTS.includes(v as ContractType)) return v as ContractType;
  // Try case-insensitive
  const lower = v.toLowerCase();
  const match = VALID_CONTRACTS.find((c) => c.toLowerCase() === lower);
  if (match) return match;
  // Common aliases
  if (lower === 'cdi' || lower === 'permanent' || lower === 'indéterminé') return 'CDI';
  if (lower === 'cdd' || lower === 'fixed-term' || lower === 'déterminé') return 'CDD';
  if (lower === 'stage' || lower === 'intern') return 'Internship';
  if (lower === 'freelance' || lower === 'auto-entrepreneur') return 'Freelance';
  if (lower === 'temporaire' || lower === 'temp') return 'Temporary';
  if (lower === 'temps partiel' || lower === 'part-time') return 'PartTime';
  if (lower === 'temps plein' || lower === 'full-time') return 'FullTime';
  if (lower === 'alternance' || lower === 'apprentissage') return 'Apprenticeship';
  if (lower === 'remote' || lower === 'télétravail' || lower === 'عن بعد') return 'Remote';
  return 'CDI';
}

export function normalizeExperience(value: string | null): ExperienceLevel | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  if (VALID_EXPERIENCES.includes(v as ExperienceLevel)) return v as ExperienceLevel;
  if (v === '0' || v === 'no experience' || v === 'sans expérience' || v === 'بدون خبرة') return 'none';
  if (v === 'stage' || v === 'intern' || v === 'تدريب') return 'internship';
  if (v === 'débutant' || v === 'entry' || v === 'junior' || v === 'مبتدئ') return 'entry';
  if (v === '1-2' || v === '1-2 ans' || v === '1-2 years') return '1to2';
  if (v === '3-5' || v === '3-5 ans' || v === '3-5 years') return '3to5';
  if (v === '5+' || v === '5+ ans' || v === '5+ years' || v === 'senior') return '5plus';
  if (v === 'lead' || v === 'expert' || v === 'خبير') return 'senior';
  if (v === 'manager' || v === 'directeur' || v === 'مدير') return 'manager';
  return undefined;
}

export function normalizeVerification(value: string | null): VerificationStatus {
  if (!value) return 'unverified';
  const v = value.trim().toLowerCase();
  if (VALID_VERIFICATIONS.includes(v as VerificationStatus)) return v as VerificationStatus;
  if (v === 'verified' || v === 'موثّق') return 'verified';
  if (v === 'source_confirmed' || v === 'sourceconfirmed' || v === 'confirmed') return 'sourceConfirmed';
  if (v === 'recently_checked' || v === 'recentlychecked' || v === 'recent') return 'recentlyChecked';
  return 'unverified';
}

export function normalizeSourceType(value: string | null): SourceType {
  if (!value) return 'externalPlatform';
  const v = value.trim().toLowerCase();
  if (VALID_SOURCE_TYPES.includes(v as SourceType)) return v as SourceType;
  if (v === 'official' || v === 'company_site' || v === 'official_site') return 'officialCompanySite';
  if (v === 'government' || v === 'gov') return 'governmentSource';
  if (v === 'external' || v === 'platform') return 'externalPlatform';
  if (v === 'employer' || v === 'listing') return 'employerListing';
  if (v === 'community') return 'communitySource';
  return 'externalPlatform';
}

export function normalizeRemote(value: string | null): RemoteStatus {
  if (!value) return 'unknown';
  const v = value.trim().toLowerCase();
  if (VALID_REMOTE.includes(v as RemoteStatus)) return v as RemoteStatus;
  if (v === 'remote' || v === 'télétravail' || v === 'عن بعد' || v === 'full_remote') return 'remote';
  if (v === 'hybrid' || v === 'hybride' || v === 'هجين') return 'hybrid';
  if (v === 'onsite' || v === 'on-site' || v === 'sur site' || v === 'حضوري') return 'onsite';
  return 'unknown';
}

export function normalizeJsonArray(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === 'string');
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
      if (typeof parsed === 'string') return [parsed];
    } catch {
      return raw.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export function normalizeJsonLocalizedArray(raw: unknown): LocalizedString[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter((item): item is LocalizedString =>
      typeof item === 'object' && item !== null && 'ar' in item && 'fr' in item && 'en' in item
    );
  }
  return [];
}

export function computeFreshness(
  publishedAt: string | null,
  expiresAt: string | null,
  updatedAt: string | null,
): JobFreshness {
  const now = Date.now();

  if (expiresAt) {
    const exp = new Date(expiresAt).getTime();
    if (!isNaN(exp) && exp < now) return 'expired';
  }

  const ref = publishedAt ?? updatedAt;
  if (!ref) return 'aging';

  const pub = new Date(ref).getTime();
  if (isNaN(pub)) return 'aging';

  const diffDays = (now - pub) / (24 * 60 * 60 * 1000);

  if (diffDays <= 3) return 'fresh';
  if (diffDays <= 14) return 'aging';
  if (diffDays <= 30) return 'potentiallyExpired';
  return 'expired';
}

// ---- Mappers ----

export function mapJobRow(row: JobRow): Job {
  const title: LocalizedString = {
    ar: row.title_ar || row.title_fr || row.title_en || '',
    fr: row.title_fr || row.title_en || row.title_ar || '',
    en: row.title_en || row.title_fr || row.title_ar || '',
  };

  const description: LocalizedString = {
    ar: row.description_ar || row.description_fr || row.description_en || '',
    fr: row.description_fr || row.description_en || row.description_ar || '',
    en: row.description_en || row.description_fr || row.description_ar || '',
  };

  const requirements = normalizeJsonLocalizedArray(row.requirements);
  const skills = normalizeJsonArray(row.skills);

  const salary = (row.salary_min != null || row.salary_max != null)
    ? {
        min: row.salary_min != null ? Number(row.salary_min) : undefined,
        max: row.salary_max != null ? Number(row.salary_max) : undefined,
        currency: (row.salary_currency || 'DZD') as 'DZD',
        period: 'monthly' as const,
      }
    : undefined;

  return {
    id: row.id,
    slug: row.slug || row.id,
    title,
    company: row.company_name || '',
    companyId: row.company_id || undefined,
    category: row.category || '',
    wilaya: row.wilaya || '',
    commune: row.city || undefined,
    contract: normalizeContract(row.contract_type),
    experience: normalizeExperience(row.experience_level),
    skills,
    description,
    requirements,
    remote: normalizeRemote(row.remote_type),
    source: {
      name: {
        ar: row.source_name || '',
        fr: row.source_name || '',
        en: row.source_name || '',
      },
      type: normalizeSourceType(row.source_type),
      url: row.source_url || undefined,
    },
    verification: normalizeVerification(row.verification_status),
    freshness: computeFreshness(row.published_at, row.expires_at, row.updated_at),
    publishedAt: row.published_at || row.created_at || new Date().toISOString(),
    lastCheckedAt: row.updated_at || row.created_at || new Date().toISOString(),
    applyUrl: row.source_url || undefined,
    isDemo: false,
  };
}

export function mapCompanyRow(row: CompanyRow, activeJobs: number = 0): Company {
  const description: LocalizedString | undefined =
    (row.description_ar || row.description_fr || row.description_en)
      ? {
          ar: row.description_ar || '',
          fr: row.description_fr || '',
          en: row.description_en || '',
        }
      : undefined;

  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name || '',
    industry: row.industry || '',
    wilaya: row.wilaya || undefined,
    description,
    website: row.website || undefined,
    activeJobs,
    isDemo: false,
  };
}

export function mapResourceRow(row: ResourceRow): ResourceArticle {
  const title: LocalizedString = {
    ar: row.title_ar || row.title_fr || row.title_en || '',
    fr: row.title_fr || row.title_en || row.title_ar || '',
    en: row.title_en || row.title_fr || row.title_ar || '',
  };

  const excerpt: LocalizedString = {
    ar: row.excerpt_ar || row.excerpt_fr || row.excerpt_en || '',
    fr: row.excerpt_fr || row.excerpt_en || row.excerpt_ar || '',
    en: row.excerpt_en || row.excerpt_fr || row.excerpt_ar || '',
  };

  return {
    slug: row.slug || row.id,
    title,
    excerpt,
    category: row.category || '',
    readingTime: row.reading_time || 5,
    isDemo: false,
  };
}
