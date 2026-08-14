import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Logo } from '@/components/Logo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const sections = [
    {
      title: t('footer.product'),
      links: [
        { label: t('nav.jobs'), to: '/jobs' },
        { label: t('nav.companies'), to: '/companies' },
        { label: t('nav.locations'), to: '/locations' },
        { label: t('nav.categories'), to: '/categories' },
        { label: t('footer.jobAlerts'), to: '/jobs' },
      ],
    },
    {
      title: t('footer.resources'),
      links: [
        { label: t('nav.resources'), to: '/resources' },
        { label: t('footer.cvTips'), to: '/resources' },
        { label: t('footer.interviewTips'), to: '/resources' },
        { label: t('footer.jobSearchGuide'), to: '/resources' },
      ],
    },
    {
      title: t('footer.company'),
      links: [
        { label: t('footer.about'), to: '/about' },
        { label: t('footer.contact'), to: '/contact' },
        { label: t('footer.trust'), to: '/trust' },
        { label: t('footer.privacy'), to: '/about' },
        { label: t('footer.terms'), to: '/about' },
      ],
    },
  ];

  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-sm text-ink-500">{t('footer.disclaimer')}</p>
            <p className="mt-2 text-sm text-ink-400">{t('footer.foundedBy')}</p>
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-ink-900 mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <Link to={link.to} className="text-sm text-ink-500 hover:text-primary-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-ink-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ink-400">© {year} Z AI Algeria Jobs. {t('footer.rights')}</p>
          <p className="text-xs text-ink-400">{t('about.founder')}</p>
        </div>
      </div>
    </footer>
  );
}
