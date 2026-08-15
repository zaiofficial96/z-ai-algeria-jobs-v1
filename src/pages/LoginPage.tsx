import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setIsLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (!data.user) {
        setError('Unable to sign in.');
        return;
      }

      const { data: adminUser, error: adminError } =
        await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', data.user.id)
          .maybeSingle();

      if (adminError) {
        console.error('Admin check error:', adminError);
        setError('Unable to verify administrator access.');
        await supabase.auth.signOut();
        return;
      }

      if (!adminUser) {
        setError('You do not have administrator access.');
        await supabase.auth.signOut();
        return;
      }

      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleForgotPassword() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError('Enter your email address first.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo:
              'https://z-ai-algeria-jobs-pl-vtb4.bolt.host/login',
          }
        );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setError('Password reset email sent. Check your inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Unable to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="lg" showSuffix={false} />
        </div>

        <h1 className="text-2xl font-bold text-ink-900 text-center mb-1">
          {t('auth.signIn')}
        </h1>

        <p className="text-center text-ink-500 mb-6 text-sm">
          {t('auth.signInPrompt')}
        </p>

        {error && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-3 mb-5">
            <p className="text-sm text-danger-800 text-center">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('auth.email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="h-5 w-5" />}
            disabled={isLoading}
            required
          />

          <Input
            label={t('auth.password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            disabled={isLoading}
            required
          />

          <div className="text-end">
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              {t('auth.forgotPassword')}
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            {t('auth.signInCta')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>
    </div>
  );
}
