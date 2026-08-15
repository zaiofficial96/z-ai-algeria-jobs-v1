import type {
  Job,
  Company,
  ResourceArticle,
  ContractType,
  ExperienceLevel,
  VerificationStatus,
  SourceType,
} from '@/types';

import { supabase } from '@/lib/supabase';

export interface JobFilters {
  keyword?: string;
  wilaya?: string;
  category?: string;
  contract?: ContractType | '';
  experience?: ExperienceLevel | '';
  remote?: boolean;
  verification?: VerificationStatus | '';
  sourceType?: SourceType | '';
  datePosted?: 'any' | '24h' | '7d' | '30d';
}

export type SortOption =
  | 'relevant'
  | 'newest'
  | 'oldest'
  | 'salaryHigh'
  | 'salaryLow';

export interface JobSearchParams extends JobFilters {
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type JobRow = {
  id: string;
  slug: string;
  title_ar: string | null;
  title_fr: string | null;
  title_en: string | null;
  company_id: string | null;
  company_name: string | null;
  wilaya: string | null;
  city: string | null;
  category: string | null;
  contract_type: string | null;
  experience_level: string | null;
  remote_type: string | null;
  description_ar: string | null;
  description_fr: string | null;
  description_en: string | null;
  requirements: unknown;
  skills: unknown;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  source_url: string | null;
  source_name: string | null;
  source_type: string | null;
  verification_status: string | null;
  published_at: string | null;
  expires_at: string | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is string => typeof item === 'string'
        );
      }
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function toLocalizedRequirements(value: unknown): Record<string, string>[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, string> =>
        typeof item === 'object' && item !== null
    );
  }

  return [];
}

function normalizeContract(value: string | null): ContractType {
  const map: Record<string, ContractType> = {
    CDI: 'CDI',
    CDD: 'CDD',
    Freelance: 'Freelance',
    Internship: 'Internship',
    Temporary: 'Temporary',
    PartTime: 'PartTime',
    FullTime: 'FullTime',
    Apprenticeship: 'Apprenticeship',
    Remote: 'Remote',
  };

  return map[value ?? ''] ?? 'FullTime';
}

function normalizeExperience(value: string | null): ExperienceLevel | undefined {
  const allowed: ExperienceLevel[] = [
    'none',
    'internship',
    'entry',
    '1to2',
    '3to5',
    '5plus',
    'senior',
    'manager',
  ];

  return allowed.includes(value as ExperienceLevel)
    ? (value as ExperienceLevel)
    : undefined;
}

function normalizeRemote(
  value: string | null
): 'remote' | 'hybrid' | 'onsite' | 'unknown' {
  if (value === 'remote' || value === 'hybrid' || value === 'onsite') {
    return value;
  }

  return 'unknown';
}

function normalizeVerification(
  value: string | null
): VerificationStatus {
  const allowed: VerificationStatus[] = [
    'verified',
    'sourceConfirmed',
    'recentlyChecked',
    'unverified',
  ];

  return allowed.includes(value as VerificationStatus)
    ? (value as VerificationStatus)
    : 'unverified';
}

function normalizeSourceType(value: string | null): SourceType {
  const allowed: SourceType[] = [
    'officialCompanySite',
    'governmentSource',
    'externalPlatform',
    'employerListing',
    'communitySource',
  ];

  return allowed.includes(value as SourceType)
    ? (value as SourceType)
    : 'externalPlatform';
}

function calculateFreshness(
  publishedAt: string | null,
  expiresAt: string | null
): Job['freshness'] {
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
    return 'expired';
  }

  if (!publishedAt) return 'aging';

  const age =
    Date.now() - new Date(publishedAt).getTime();

  const days = age / (1000 * 60 * 60 * 24);

  if (days <= 3) return 'fresh';
  if (days <= 14) return 'aging';
  if (days <= 30) return 'potentiallyExpired';

  return 'expired';
}

function mapJob(row: JobRow): Job {
  const requirements = toLocalizedRequirements(row.requirements);

  return {
    id: row.id,
    slug: row.slug,

    title: {
      ar: row.title_ar ?? '',
      fr: row.title_fr ?? row.title_ar ?? '',
      en: row.title_en ?? row.title_fr ?? row.title_ar ?? '',
    },

    company: row.company_name ?? 'Unknown Company',
    companyId: row.company_id ?? undefined,

    category: row.category ?? '',
    wilaya: row.wilaya ?? '',
    commune: row.city ?? undefined,

    contract: normalizeContract(row.contract_type),
    experience: normalizeExperience(row.experience_level),

    salary:
      row.salary_min !== null ||
      row.salary_max !== null
        ? {
            min: row.salary_min ?? undefined,
            max: row.salary_max ?? undefined,
            currency: 'DZD',
            period: 'monthly',
          }
        : undefined,

    skills: toStringArray(row.skills),

    description: {
      ar: row.description_ar ?? '',
      fr: row.description_fr ?? row.description_ar ?? '',
      en: row.description_en ?? row.description_fr ?? row.description_ar ?? '',
    },

    requirements: requirements.map((item) => ({
      ar: item.ar ?? item.text ?? '',
      fr: item.fr ?? item.ar ?? item.text ?? '',
      en: item.en ?? item.fr ?? item.ar ?? item.text ?? '',
    })),

    remote: normalizeRemote(row.remote_type),

    source: {
      name: {
        ar: row.source_name ?? '',
        fr: row.source_name ?? '',
        en: row.source_name ?? '',
      },
      type: normalizeSourceType(row.source_type),
      url: row.source_url ?? undefined,
    },

    verification: normalizeVerification(row.verification_status),

    freshness: calculateFreshness(
      row.published_at,
      row.expires_at
    ),

    publishedAt: row.published_at ?? row.created_at,
    lastCheckedAt: row.updated_at,

    applyUrl: row.source_url ?? undefined,

    isDemo: false,
  };
}

function matchesKeyword(job: Job, keyword: string): boolean {
  const k = keyword.toLowerCase().trim();

  if (!k) return true;

  return (
    job.title.en.toLowerCase().includes(k) ||
    job.title.fr.toLowerCase().includes(k) ||
    job.title.ar.toLowerCase().includes(k) ||
    job.company.toLowerCase().includes(k) ||
    job.skills.some((skill) =>
      skill.toLowerCase().includes(k)
    )
  );
}

function matchesDatePosted(
  job: Job,
  datePosted: JobFilters['datePosted']
): boolean {
  if (!datePosted || datePosted === 'any') return true;

  const published = new Date(job.publishedAt).getTime();

  if (Number.isNaN(published)) return false;

  const diff = Date.now() - published;

  if (datePosted === '24h') {
    return diff <= 24 * 60 * 60 * 1000;
  }

  if (datePosted === '7d') {
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }

  if (datePosted === '30d') {
    return diff <= 30 * 24 * 60 * 60 * 1000;
  }

  return true;
}

function sortJobs(
  jobs: Job[],
  sort: SortOption
): Job[] {
  const sorted = [...jobs];

  switch (sort) {
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );

    case 'oldest':
      return sorted.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() -
          new Date(b.publishedAt).getTime()
      );

    case 'salaryHigh':
      return sorted.sort(
        (a, b) =>
          (b.salary?.max ?? 0) -
          (a.salary?.max ?? 0)
      );

    case 'salaryLow':
      return sorted.sort(
        (a, b) =>
          (a.salary?.min ?? Infinity) -
          (b.salary?.min ?? Infinity)
      );

    default: {
      const order: Record<VerificationStatus, number> = {
        verified: 0,
        sourceConfirmed: 1,
        recentlyChecked: 2,
        unverified: 3,
      };

      return sorted.sort(
        (a, b) =>
          order[a.verification] -
          order[b.verification]
      );
    }
  }
}

async function fetchJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('Supabase jobs error:', error);
    throw error;
  }

  return (data as JobRow[]).map(mapJob);
}

export const JobService = {
  async search(
    params: JobSearchParams
  ): Promise<JobSearchResult> {
    let filtered = await fetchJobs();

    if (params.keyword) {
      filtered = filtered.filter((job) =>
        matchesKeyword(job, params.keyword!)
      );
    }

    if (params.wilaya) {
      filtered = filtered.filter(
        (job) => job.wilaya === params.wilaya
      );
    }

    if (params.category) {
      filtered = filtered.filter(
        (job) => job.category === params.category
      );
    }

    if (params.contract) {
      filtered = filtered.filter(
        (job) => job.contract === params.contract
      );
    }

    if (params.experience) {
      filtered = filtered.filter(
        (job) => job.experience === params.experience
      );
    }

    if (params.remote) {
      filtered = filtered.filter(
        (job) =>
          job.remote === 'remote' ||
          job.remote === 'hybrid'
      );
    }

    if (params.verification) {
      filtered = filtered.filter(
        (job) =>
          job.verification === params.verification
      );
    }

    if (params.sourceType) {
      filtered = filtered.filter(
        (job) =>
          job.source.type === params.sourceType
      );
    }

    if (params.datePosted) {
      filtered = filtered.filter((job) =>
        matchesDatePosted(
          job,
          params.datePosted
        )
      );
    }

    const sorted = sortJobs(
      filtered,
      params.sort ?? 'relevant'
    );

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    const start = (page - 1) * pageSize;

    const paged = sorted.slice(
      start,
      start + pageSize
    );

    return {
      jobs: paged,
      total: sorted.length,
      page,
      pageSize,
      totalPages: Math.ceil(
        sorted.length / pageSize
      ),
    };
  },

  async getBySlug(
    slug: string
  ): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Supabase job error:', error);
      return null;
    }

    return data
      ? mapJob(data as JobRow)
      : null;
  },

  async getRelated(
    slug: string,
    limit = 4
  ): Promise<Job[]> {
    const current = await this.getBySlug(slug);

    if (!current) return [];

    const jobs = await fetchJobs();

    return jobs
      .filter(
        (job) =>
          job.id !== current.id &&
          (job.category === current.category ||
            job.wilaya === current.wilaya)
      )
      .slice(0, limit);
  },

  async getLatest(
    limit = 6
  ): Promise<Job[]> {
    const jobs = await fetchJobs();

    return jobs
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  },

  async getByWilaya(
    wilayaCode: string,
    limit?: number
  ): Promise<Job[]> {
    const jobs = await fetchJobs();

    const filtered = jobs.filter(
      (job) => job.wilaya === wilayaCode
    );

    return limit
      ? filtered.slice(0, limit)
      : filtered;
  },

  async getByCategory(
    categorySlug: string,
    limit?: number
  ): Promise<Job[]> {
    const jobs = await fetchJobs();

    const filtered = jobs.filter(
      (job) => job.category === categorySlug
    );

    return limit
      ? filtered.slice(0, limit)
      : filtered;
  },
};

export const CompanyService = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*');

    if (error) {
      console.error('Supabase companies error:', error);
      return [];
    }

    return (data ?? []).map((company: any) => ({
      id: company.id,
      slug: company.slug,
      name: company.name ?? '',
      industry: company.industry ?? '',
      wilaya: company.wilaya ?? undefined,
      description: {
        ar: company.description_ar ?? '',
        fr: company.description_fr ?? '',
        en: company.description_en ?? '',
      },
      website: company.website ?? undefined,
      activeJobs: company.active_jobs ?? 0,
      isDemo: false,
    }));
  },

  async getBySlug(
    slug: string
  ): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;

    const company: any = data;

    return {
      id: company.id,
      slug: company.slug,
      name: company.name ?? '',
      industry: company.industry ?? '',
      wilaya: company.wilaya ?? undefined,
      description: {
        ar: company.description_ar ?? '',
        fr: company.description_fr ?? '',
        en: company.description_en ?? '',
      },
      website: company.website ?? undefined,
      activeJobs: company.active_jobs ?? 0,
      isDemo: false,
    };
  },

  async getJobs(
    companyId: string
  ): Promise<Job[]> {
    const jobs = await fetchJobs();

    return jobs.filter(
      (job) => job.companyId === companyId
    );
  },
};

export const ResourceService = {
  async getAll(): Promise<ResourceArticle[]> {
    const { data, error } = await supabase
      .from('resources')
      .select('*');

    if (error) {
      console.error('Supabase resources error:', error);
      return [];
    }

    return (data ?? []).map((resource: any) => ({
      slug: resource.slug,
      title: {
        ar: resource.title_ar ?? '',
        fr: resource.title_fr ?? '',
        en: resource.title_en ?? '',
      },
      excerpt: {
        ar: resource.excerpt_ar ?? '',
        fr: resource.excerpt_fr ?? '',
        en: resource.excerpt_en ?? '',
      },
      category: resource.category ?? '',
      readingTime: resource.reading_time ?? 0,
      isDemo: false,
    }));
  },

  async getBySlug(
    slug: string
  ): Promise<ResourceArticle | null> {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;

    const resource: any = data;

    return {
      slug: resource.slug,
      title: {
        ar: resource.title_ar ?? '',
        fr: resource.title_fr ?? '',
        en: resource.title_en ?? '',
      },
      excerpt: {
        ar: resource.excerpt_ar ?? '',
        fr: resource.excerpt_fr ?? '',
        en: resource.excerpt_en ?? '',
      },
      category: resource.category ?? '',
      readingTime: resource.reading_time ?? 0,
      isDemo: false,
    };
  },
};
