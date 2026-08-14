import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Logo } from '@/components/Logo';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { Menu, X } from 'lucide-react';

const navItems = [
  { to: '/jobs', key: 'nav.jobs' },
  { to: '/companies', key: 'nav.companies' },
  { to: '/locations', key: 'nav.locations' },
  { to: '/categories', key: 'nav.categories' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/about', key: 'nav.about' },
] as const;

export function Header() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur-sm">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo size="md" />
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.to)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
                  )}
                >
                  {t(item.key as never)}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <Link to="/login" className="hidden sm:block">
              <Button variant="tertiary" size="sm">{t('nav.signIn')}</Button>
            </Link>
            <Link to="/register" className="hidden sm:block">
              <Button variant="primary" size="sm">{t('nav.createAccount')}</Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg text-ink-600 hover:bg-ink-100 transition-colors"
              aria-label={t('nav.menu')}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-ink-200 bg-white animate-slide-down">
          <div className="container-page py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.to)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-ink-700 hover:bg-ink-50'
                )}
              >
                {t(item.key as never)}
              </Link>
            ))}
            <div className="pt-3 border-t border-ink-100 space-y-2">
              <LanguageSwitcher />
              <div className="flex gap-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="secondary" size="sm" fullWidth>{t('nav.signIn')}</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                  <Button variant="primary" size="sm" fullWidth>{t('nav.createAccount')}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
