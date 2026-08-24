import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { Mail, ArrowLeft } from 'lucide-react';

export function ResetPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showSuffix={false} />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 text-center mb-1">{t('auth.forgotPassword')}</h1>
        <p className="text-center text-ink-500 mb-6 text-sm">{t('auth.signInPrompt')}</p>

        {sent ? (
          <div className="rounded-xl border border-success-200 bg-success-50 p-4 text-center">
            <p className="text-sm text-success-800 font-medium">{t('contact.sent')}</p>
            <p className="text-xs text-success-700 mt-1">{t('contact.sentDesc')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-danger-200 bg-danger-50 p-3">
                <p className="text-sm text-danger-700 text-center">{error}</p>
              </div>
            )}
            <Input
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" />}
              required
            />
            <Button type="submit" variant="primary" fullWidth isLoading={sending}>
              {t('auth.forgotPassword')}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('auth.signInCta')}
          </Link>
        </p>
      </div>
    </div>
  );
}
