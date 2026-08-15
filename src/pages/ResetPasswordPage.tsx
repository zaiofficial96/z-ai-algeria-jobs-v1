import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/Logo';
import { Lock } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess('تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      console.error('Password update error:', err);
      setError('حدث خطأ أثناء تغيير كلمة المرور.');
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

        <h1 className="text-2xl font-bold text-ink-900 text-center mb-2">
          إعادة تعيين كلمة المرور
        </h1>

        <p className="text-center text-ink-500 mb-6 text-sm">
          أدخل كلمة المرور الجديدة لحسابك.
        </p>

        {error && (
          <div className="rounded-xl border border-danger-200 bg-danger-50 p-3 mb-5">
            <p className="text-sm text-danger-800 text-center">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-success-200 bg-success-50 p-3 mb-5">
            <p className="text-sm text-success-800 text-center">
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="كلمة المرور الجديدة"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            disabled={isLoading}
            required
            minLength={8}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="h-5 w-5" />}
            disabled={isLoading}
            required
            minLength={8}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            تغيير كلمة المرور
          </Button>
        </form>
      </div>
    </div>
  );
  }
