import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { SearchBar } from '@/components/jobs/SearchBar';
import { JobCard } from '@/components/jobs/JobCard';
import { JobListSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { JobService } from '@/services';
import { popularSearches } from '@/data/demoData';
import { categories } from '@/data/categories';
import { wilayas } from '@/data/wilayas';
import { useLocalizedText } from '@/utils';
import type { Job } from '@/types';
import { Search, MapPin, ShieldCheck, FileText, Bell, Sparkles, ArrowRight, CheckCircle2, Clock, ExternalLink, BookOpen } from 'lucide-react';

export function HomePage() {
  const { t, locale } = useI18n();
  const lt = useLocalizedText();
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    JobService.getLatest(6).then((jobs) => {
      setLatestJobs(jobs);
      setLoading(false);
    });
  }, []);

  const popularWilayas = wilayas.filter((w) => w.popular);
  const savedJobs: string[] = [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-ink-50">
        <div className="container-page py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700 mb-6">
              <Sparkles className="h-4 w-4" />
              {t('brand.full')}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="mt-4 text-lg text-ink-600 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>
          <div className="mt-8 max-w-4xl mx-auto">
            <SearchBar variant="hero" />
          </div>
        </div>
      </section>

      {/* Popular searches */}
      <section className="container-page py-8">
        <h2 className="text-sm font-semibold text-ink-500 uppercase tracking-wide mb-3">{t('home.popularSearches')}</h2>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((search, idx) => (
            <Link
              key={idx}
              to={`/jobs?q=${encodeURIComponent(search[locale])}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm text-ink-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition-colors"
            >
              <Search className="h-3.5 w-3.5 text-ink-400" />
              {search[locale]}
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-ink-900">{t('home.jobCategories')}</h2>
          <Link to="/categories" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
            {t('home.viewAll')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.slice(0, 12).map((cat) => (
            <Link
              key={cat.slug}
              to={`/categories/${cat.slug}`}
              className="group flex flex-col items-center justify-center rounded-xl border border-ink-200 bg-white p-4 text-center hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <span className="text-sm font-medium text-ink-700 group-hover:text-primary-700">{cat.name[locale]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section className="container-page py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-ink-900">{t('home.algerianLocations')}</h2>
          <Link to="/locations" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
            {t('home.viewAll')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularWilayas.map((w) => (
            <Link
              key={w.code}
              to={`/locations/${w.code}`}
              className="group flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <MapPin className="h-4 w-4 text-ink-400 group-hover:text-primary-600" />
              <span className="text-sm font-medium text-ink-700 group-hover:text-primary-700">{w.name[locale]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest jobs */}
      <section className="container-page py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-ink-900">{t('home.latestOpportunities')}</h2>
          <Link to="/jobs" className="text-sm font-medium text-primary-600 hover:text-primary-700 inline-flex items-center gap-1">
            {t('home.viewAll')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
        {loading ? (
          <JobListSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} saved={savedJobs.includes(job.id)} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-ink-200 py-14">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-ink-900 text-center mb-8">{t('home.howItWorks')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: t('how.step1.title'), desc: t('how.step1.desc') },
              { icon: CheckCircle2, title: t('how.step2.title'), desc: t('how.step2.desc') },
              { icon: ExternalLink, title: t('how.step3.title'), desc: t('how.step3.desc') },
              { icon: Sparkles, title: t('how.step4.title'), desc: t('how.step4.desc') },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-4">
                  <step.icon className="h-7 w-7" />
                </div>
                <div className="text-sm font-semibold text-primary-600 mb-1">{idx + 1}</div>
                <h3 className="font-semibold text-ink-900 mb-1">{step.title}</h3>
                <p className="text-sm text-ink-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="container-page py-14">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 text-success-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900">{t('home.trustSection')}</h2>
          </div>
          <p className="text-ink-600 mb-6">{t('home.trustDesc')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: ExternalLink, label: t('trust.originalSource') },
              { icon: ShieldCheck, label: t('trust.verificationStatus') },
              { icon: Clock, label: t('trust.lastChecked') },
              { icon: FileText, label: t('trust.publishedDate') },
              { icon: CheckCircle2, label: t('trust.applicationMethod') },
              { icon: MapPin, label: t('trust.sourceType') },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-4">
                <item.icon className="h-5 w-5 text-ink-400 shrink-0" />
                <span className="text-sm font-medium text-ink-700">{item.label}</span>
              </div>
            ))}
          </div>
          <Link to="/trust" className="mt-6 inline-block">
            <Button variant="tertiary" size="sm">
              {t('trust.learnMore')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </section>

      {/* AI Career */}
      <section className="bg-white border-y border-ink-200 py-14">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 mb-4">
                <Sparkles className="h-4 w-4" />
                AI
              </div>
              <h2 className="text-2xl font-bold text-ink-900 mb-3">{t('home.aiCareer')}</h2>
              <p className="text-ink-600 mb-4">{t('home.aiCareerDesc')}</p>
              <p className="text-sm text-ink-500 mb-6">{t('ai.matchDesc')}</p>
              <Button variant="primary">{t('home.aiCareerCTA')}</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Search, label: t('nav.jobs') },
                { icon: FileText, label: t('home.cvBuilder') },
                { icon: BookOpen, label: t('home.coverLetter') },
                { icon: CheckCircle2, label: t('ai.matchScore') },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center rounded-xl border border-ink-200 bg-ink-50 p-6 text-center">
                  <item.icon className="h-8 w-8 text-primary-500 mb-2" />
                  <span className="text-sm font-medium text-ink-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CV Builder + Alerts */}
      <section className="container-page py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-ink-200 bg-white p-8">
            <FileText className="h-8 w-8 text-primary-500 mb-4" />
            <h2 className="text-xl font-bold text-ink-900 mb-2">{t('home.cvBuilder')}</h2>
            <p className="text-ink-500 mb-5">{t('home.cvBuilderDesc')}</p>
            <Button variant="secondary">{t('home.cvBuilderCTA')}</Button>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-white p-8">
            <Bell className="h-8 w-8 text-primary-500 mb-4" />
            <h2 className="text-xl font-bold text-ink-900 mb-2">{t('home.jobAlerts')}</h2>
            <p className="text-ink-500 mb-5">{t('home.jobAlertsDesc')}</p>
            <Button variant="secondary">{t('home.jobAlertsCTA')}</Button>
          </div>
        </div>
      </section>

      {/* Career resources */}
      <section className="bg-white border-y border-ink-200 py-14">
        <div className="container-page">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-6 w-6 text-primary-500" />
            <h2 className="text-2xl font-bold text-ink-900">{t('home.careerResources')}</h2>
          </div>
          <p className="text-ink-600 mb-6">{t('home.careerResourcesDesc')}</p>
          <Link to="/resources">
            <Button variant="tertiary">
              {t('common.viewAll')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
