import type { Job, Company, ResourceArticle, ContractType, ExperienceLevel, VerificationStatus, SourceType } from '@/types';
import { demoJobs, demoCompanies, demoResources } from '@/data/demoData';
import { supabase } from '@/lib/supabase';
import { mapJobRow, mapCompanyRow, mapResourceRow, type JobRow, type CompanyRow, type ResourceRow } from '@/lib/dbMapper';

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

// ---- Client-side filtering helpers ----

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

function applyFilters(jobs: Job[], params: JobSearchParams): Job[] {
  let filtered = jobs;
  if (params.keyword) filtered = filtered.filter((j) => matchesKeyword(j, params.keyword!));
  if (params.wilaya) filtered = filtered.filter((j) => j.wilaya === params.wilaya);
  if (params.category) filtered = filtered.filter((j) => j.category === params.category);
  if (params.contract) filtered = filtered.filter((j) => j.contract === params.contract);
  if (params.experience) filtered = filtered.filter((j) => j.experience === params.experience);
  if (params.remote) filtered = filtered.filter((j) => j.remote === 'remote' || j.remote === 'hybrid');
  if (params.verification) filtered = filtered.filter((j) => j.verification === params.verification);
  if (params.sourceType) filtered = filtered.filter((j) => j.source.type === params.sourceType);
  if (params.datePosted) filtered = filtered.filter((j) => matchesDatePosted(j, params.datePosted));
  return filtered;
}

// ---- Supabase fetch helpers ----

async function fetchAllActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];
  return (data as JobRow[]).map(mapJobRow);
}

async function fetchJobBySlug(slug: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapJobRow(data as JobRow);
}

async function fetchAllCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  if (!data || data.length === 0) return [];
  return (data as CompanyRow[]).map((row) => mapCompanyRow(row, 0));
}

async function fetchCompanyBySlug(slug: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapCompanyRow(data as CompanyRow, 0);
}

async function fetchAllResources(): Promise<ResourceArticle[]> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];
  return (data as ResourceRow[]).map(mapResourceRow);
}

async function fetchResourceBySlug(slug: string): Promise<ResourceArticle | null> {
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapResourceRow(data as ResourceRow);
}

// ---- JobService ----

export const JobService = {
  async search(params: JobSearchParams): Promise<JobSearchResult> {
    let dbJobs: Job[] = [];
    try {
      dbJobs = await fetchAllActiveJobs();
    } catch {
      dbJobs = [];
    }

    const source = dbJobs.length > 0 ? dbJobs : demoJobs;
    const filtered = applyFilters(source, params);
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
    try {
      const job = await fetchJobBySlug(slug);
      if (job) return job;
    } catch {
      // fall through to demo
    }
    return demoJobs.find((j) => j.slug === slug) ?? null;
  },

  async getRelated(slug: string, limit = 4): Promise<Job[]> {
    let allJobs: Job[] = [];
    try {
      allJobs = await fetchAllActiveJobs();
    } catch {
      allJobs = demoJobs;
    }
    if (allJobs.length === 0) allJobs = demoJobs;

    const job = allJobs.find((j) => j.slug === slug) ?? demoJobs.find((j) => j.slug === slug);
    if (!job) return [];
    return allJobs
      .filter((j) => j.id !== job.id && (j.category === job.category || j.wilaya === job.wilaya))
      .slice(0, limit);
  },

  async getLatest(limit = 6): Promise<Job[]> {
    let dbJobs: Job[] = [];
    try {
      dbJobs = await fetchAllActiveJobs();
    } catch {
      dbJobs = [];
    }

    if (dbJobs.length > 0) {
      return dbJobs.slice(0, limit);
    }
    return [...demoJobs]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  },

  async getByWilaya(wilayaCode: string, limit?: number): Promise<Job[]> {
    let dbJobs: Job[] = [];
    try {
      dbJobs = await fetchAllActiveJobs();
    } catch {
      dbJobs = [];
    }

    const source = dbJobs.length > 0 ? dbJobs : demoJobs;
    let jobs = source.filter((j) => j.wilaya === wilayaCode);
    if (limit) jobs = jobs.slice(0, limit);
    return jobs;
  },

  async getByCategory(categorySlug: string, limit?: number): Promise<Job[]> {
    let dbJobs: Job[] = [];
    try {
      dbJobs = await fetchAllActiveJobs();
    } catch {
      dbJobs = [];
    }

    const source = dbJobs.length > 0 ? dbJobs : demoJobs;
    let jobs = source.filter((j) => j.category === categorySlug);
    if (limit) jobs = jobs.slice(0, limit);
    return jobs;
  },
};

// ---- CompanyService ----

export const CompanyService = {
  async getAll(): Promise<Company[]> {
    try {
      const companies = await fetchAllCompanies();
      if (companies.length > 0) {
        // Count active jobs per company
        let dbJobs: Job[] = [];
        try {
          dbJobs = await fetchAllActiveJobs();
        } catch {
          // ignore
        }
        return companies.map((c) => ({
          ...c,
          activeJobs: dbJobs.filter((j) => j.companyId === c.id).length,
        }));
      }
    } catch {
      // fall through to demo
    }
    return demoCompanies;
  },

  async getBySlug(slug: string): Promise<Company | null> {
    try {
      const company = await fetchCompanyBySlug(slug);
      if (company) {
        let dbJobs: Job[] = [];
        try {
          dbJobs = await fetchAllActiveJobs();
        } catch {
          // ignore
        }
        return { ...company, activeJobs: dbJobs.filter((j) => j.companyId === company.id).length };
      }
    } catch {
      // fall through to demo
    }
    return demoCompanies.find((c) => c.slug === slug) ?? null;
  },

  async getJobs(companyId: string): Promise<Job[]> {
    let dbJobs: Job[] = [];
    try {
      dbJobs = await fetchAllActiveJobs();
    } catch {
      dbJobs = [];
    }

    const source = dbJobs.length > 0 ? dbJobs : demoJobs;
    return source.filter((j) => j.companyId === companyId);
  },
};

// ---- ResourceService ----

export const ResourceService = {
  async getAll(): Promise<ResourceArticle[]> {
    try {
      const resources = await fetchAllResources();
      if (resources.length > 0) return resources;
    } catch {
      // fall through to demo
    }
    return demoResources;
  },

  async getBySlug(slug: string): Promise<ResourceArticle | null> {
    try {
      const resource = await fetchResourceBySlug(slug);
      if (resource) return resource;
    } catch {
      // fall through to demo
    }
    return demoResources.find((r) => r.slug === slug) ?? null;
  },
};
