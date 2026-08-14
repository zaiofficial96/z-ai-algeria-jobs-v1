import type { Job, Company, ResourceArticle, ContractType, ExperienceLevel, VerificationStatus, SourceType } from '@/types';
import { demoJobs, demoCompanies, demoResources } from '@/data/demoData';

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

export type SortOption = 'relevant' | 'newest' | 'oldest' | 'salaryHigh' | 'salaryLow';

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

const SIMULATED_DELAY = 200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchesKeyword(job: Job, keyword: string): boolean {
  const k = keyword.toLowerCase().trim();
  if (!k) return true;
  return (
    job.title.en.toLowerCase().includes(k) ||
    job.title.fr.toLowerCase().includes(k) ||
    job.title.ar.includes(keyword) ||
    job.company.toLowerCase().includes(k) ||
    job.skills.some((s) => s.toLowerCase().includes(k))
  );
}

function matchesDatePosted(job: Job, datePosted: JobFilters['datePosted']): boolean {
  if (!datePosted || datePosted === 'any') return true;
  const published = new Date(job.publishedAt).getTime();
  const now = Date.now();
  const diff = now - published;
  if (datePosted === '24h') return diff <= 24 * 60 * 60 * 1000;
  if (datePosted === '7d') return diff <= 7 * 24 * 60 * 60 * 1000;
  if (datePosted === '30d') return diff <= 30 * 24 * 60 * 60 * 1000;
  return true;
}

function sortJobs(jobs: Job[], sort: SortOption): Job[] {
  const sorted = [...jobs];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    case 'salaryHigh':
      return sorted.sort((a, b) => (b.salary?.max ?? 0) - (a.salary?.max ?? 0));
    case 'salaryLow':
      return sorted.sort((a, b) => (a.salary?.min ?? Infinity) - (b.salary?.min ?? Infinity));
    default:
      return sorted.sort((a, b) => {
        const order = { verified: 0, sourceConfirmed: 1, recentlyChecked: 2, unverified: 3 };
        return order[a.verification] - order[b.verification];
      });
  }
}

export const JobService = {
  async search(params: JobSearchParams): Promise<JobSearchResult> {
    await delay(SIMULATED_DELAY);
    let filtered = [...demoJobs];

    if (params.keyword) filtered = filtered.filter((j) => matchesKeyword(j, params.keyword!));
    if (params.wilaya) filtered = filtered.filter((j) => j.wilaya === params.wilaya);
    if (params.category) filtered = filtered.filter((j) => j.category === params.category);
    if (params.contract) filtered = filtered.filter((j) => j.contract === params.contract);
    if (params.experience) filtered = filtered.filter((j) => j.experience === params.experience);
    if (params.remote) filtered = filtered.filter((j) => j.remote === 'remote' || j.remote === 'hybrid');
    if (params.verification) filtered = filtered.filter((j) => j.verification === params.verification);
    if (params.sourceType) filtered = filtered.filter((j) => j.source.type === params.sourceType);
    if (params.datePosted) filtered = filtered.filter((j) => matchesDatePosted(j, params.datePosted));

    const sorted = sortJobs(filtered, params.sort ?? 'relevant');
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const paged = sorted.slice(start, start + pageSize);

    return {
      jobs: paged,
      total: sorted.length,
      page,
      pageSize,
      totalPages: Math.ceil(sorted.length / pageSize),
    };
  },

  async getBySlug(slug: string): Promise<Job | null> {
    await delay(SIMULATED_DELAY);
    return demoJobs.find((j) => j.slug === slug) ?? null;
  },

  async getRelated(slug: string, limit = 4): Promise<Job[]> {
    await delay(SIMULATED_DELAY);
    const job = demoJobs.find((j) => j.slug === slug);
    if (!job) return [];
    return demoJobs
      .filter((j) => j.id !== job.id && (j.category === job.category || j.wilaya === job.wilaya))
      .slice(0, limit);
  },

  async getLatest(limit = 6): Promise<Job[]> {
    await delay(SIMULATED_DELAY);
    return [...demoJobs]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  },

  async getByWilaya(wilayaCode: string, limit?: number): Promise<Job[]> {
    await delay(SIMULATED_DELAY);
    let jobs = demoJobs.filter((j) => j.wilaya === wilayaCode);
    if (limit) jobs = jobs.slice(0, limit);
    return jobs;
  },

  async getByCategory(categorySlug: string, limit?: number): Promise<Job[]> {
    await delay(SIMULATED_DELAY);
    let jobs = demoJobs.filter((j) => j.category === categorySlug);
    if (limit) jobs = jobs.slice(0, limit);
    return jobs;
  },
};

export const CompanyService = {
  async getAll(): Promise<Company[]> {
    await delay(SIMULATED_DELAY);
    return demoCompanies;
  },

  async getBySlug(slug: string): Promise<Company | null> {
    await delay(SIMULATED_DELAY);
    return demoCompanies.find((c) => c.slug === slug) ?? null;
  },

  async getJobs(companyId: string): Promise<Job[]> {
    await delay(SIMULATED_DELAY);
    return demoJobs.filter((j) => j.companyId === companyId);
  },
};

export const ResourceService = {
  async getAll(): Promise<ResourceArticle[]> {
    await delay(SIMULATED_DELAY);
    return demoResources;
  },

  async getBySlug(slug: string): Promise<ResourceArticle | null> {
    await delay(SIMULATED_DELAY);
    return demoResources.find((r) => r.slug === slug) ?? null;
  },
};
