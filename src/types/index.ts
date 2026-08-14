export type Locale = 'ar' | 'fr' | 'en';

export type ContractType =
  | 'CDI'
  | 'CDD'
  | 'Freelance'
  | 'Internship'
  | 'Temporary'
  | 'PartTime'
  | 'FullTime'
  | 'Apprenticeship'
  | 'Remote';

export type ExperienceLevel =
  | 'none'
  | 'internship'
  | 'entry'
  | '1to2'
  | '3to5'
  | '5plus'
  | 'senior'
  | 'manager';

export type EducationLevel =
  | 'formation'
  | 'bts'
  | 'licence'
  | 'master'
  | 'ingenieur'
  | 'doctorat'
  | 'technicien'
  | 'technicienSup';

export type VerificationStatus =
  | 'verified'
  | 'sourceConfirmed'
  | 'recentlyChecked'
  | 'unverified';

export type JobFreshness = 'fresh' | 'aging' | 'potentiallyExpired' | 'expired';

export type SourceType =
  | 'officialCompanySite'
  | 'governmentSource'
  | 'externalPlatform'
  | 'employerListing'
  | 'communitySource';

export type RemoteStatus = 'remote' | 'hybrid' | 'onsite' | 'unknown';

export type LocalizedString = Record<Locale, string>;

export interface JobSource {
  name: LocalizedString;
  type: SourceType;
  url?: string;
}

export interface Salary {
  min?: number;
  max?: number;
  currency: 'DZD';
  period: 'monthly' | 'annual' | 'hourly';
}

export interface Job {
  id: string;
  slug: string;
  title: LocalizedString;
  company: string;
  companyId?: string;
  category: string;
  wilaya: string;
  commune?: string;
  contract: ContractType;
  experience?: ExperienceLevel;
  education?: EducationLevel;
  salary?: Salary;
  skills: string[];
  description: LocalizedString;
  requirements: LocalizedString[];
  remote: RemoteStatus;
  source: JobSource;
  verification: VerificationStatus;
  freshness: JobFreshness;
  publishedAt: string;
  lastCheckedAt: string;
  applyUrl?: string;
  isDemo: boolean;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  industry: string;
  wilaya?: string;
  description?: LocalizedString;
  website?: string;
  activeJobs: number;
  isDemo: boolean;
}

export interface Wilaya {
  code: number;
  name: LocalizedString;
  popular?: boolean;
}

export interface Category {
  slug: string;
  name: LocalizedString;
  icon: string;
}

export interface ResourceArticle {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  category: string;
  readingTime: number;
  isDemo: boolean;
}
