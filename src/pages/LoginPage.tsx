import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { Mail, Lock } from 'lucide-react';

export function LoginPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showSuffix={false} />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 text-center mb-1">{t('auth.signIn')}</h1>
        <p className="text-center text-ink-500 mb-6 text-sm">{t('auth.signInPrompt')}</p>

        <div className="rounded-xl border border-warning-200 bg-warning-50 p-3 mb-5">
          <p className="text-sm text-warning-800 text-center">{t('auth.comingSoon')}</p>
          <p className="text-xs text-warning-700 text-center mt-1">{t('auth.comingSoonDesc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            disabled
          />
          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            disabled
          />
          <div className="text-end">
            <button type="button" className="text-sm text-primary-600 hover:text-primary-700" disabled>
              {t('auth.forgotPassword')}
            </button>
          </div>
          <Button type="submit" variant="primary" fullWidth disabled>
            {t('auth.signInCta')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>
    </div>
  );
}
