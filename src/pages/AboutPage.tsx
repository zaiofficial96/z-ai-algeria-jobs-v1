import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Search, FileText, Sparkles, MapPin, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function AboutPage() {
  const { t } = useI18n();

  const sections = [
    { icon: Search, title: t('about.what'), desc: t('about.whatDesc') },
    { icon: AlertTriangle, title: t('about.why'), desc: t('about.whyDesc') },
    { icon: CheckCircle2, title: t('about.howHelp'), desc: t('about.howHelpDesc') },
    { icon: FileText, title: t('about.sources'), desc: t('about.sourcesDesc') },
    { icon: ShieldCheck, title: t('about.verification'), desc: t('about.verificationDesc') },
    { icon: Sparkles, title: t('about.ai'), desc: t('about.aiDesc') },
    { icon: AlertTriangle, title: t('about.limitations'), desc: t('about.limitationsDesc') },
  ];

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('about.title') }]} className="mb-4" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">{t('about.title')}</h1>
          <p className="mt-2 text-lg text-ink-500">{t('about.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-ink-900 mb-1">{section.title}</h2>
                  <p className="text-ink-600 leading-relaxed">{section.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-primary-50 border border-primary-200 p-6 text-center">
          <MapPin className="mx-auto h-8 w-8 text-primary-500 mb-3" />
          <p className="text-ink-700 font-medium mb-4">{t('about.founder')}</p>
          <Link to="/jobs">
            <Button variant="primary">{t('nav.findJobs')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
