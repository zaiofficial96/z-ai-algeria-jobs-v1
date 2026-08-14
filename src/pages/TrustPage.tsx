import { useI18n } from '@/i18n';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ShieldCheck, FileText, Clock, AlertTriangle, Flag, RefreshCw } from 'lucide-react';

export function TrustPage() {
  const { t } = useI18n();

  const sections = [
    { icon: FileText, title: t('trustCenter.sources'), desc: t('trustCenter.sourcesDesc') },
    { icon: ShieldCheck, title: t('trustCenter.verification'), desc: t('trustCenter.verificationDesc') },
    { icon: Clock, title: t('trustCenter.freshness'), desc: t('trustCenter.freshnessDesc') },
    { icon: AlertTriangle, title: t('trustCenter.suspicious'), desc: t('trustCenter.suspiciousDesc') },
    { icon: Flag, title: t('trustCenter.reports'), desc: t('trustCenter.reportsDesc') },
  ];

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('trustCenter.title') }]} className="mb-4" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-600 mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-ink-900">{t('trustCenter.title')}</h1>
          <p className="mt-2 text-lg text-ink-500">{t('trustCenter.subtitle')}</p>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div key={idx} className="rounded-2xl border border-ink-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-50 text-success-600 shrink-0">
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
      </div>
    </div>
  );
}
