import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function AdminPage() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    let mounted = true;

    async function checkAdminAccess() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login', { replace: true });
        return;
      }

      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !adminUser) {
        await supabase.auth.signOut();
        navigate('/login', { replace: true });
        return;
      }

      if (mounted) {
        setEmail(user.email ?? '');
        setAuthorized(true);
        setChecking(false);
      }
    }

    checkAdminAccess();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  }

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <p className="text-ink-500">Checking administrator access...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-600">
              Z AI Algeria Jobs
            </p>

            <h1 className="mt-1 text-3xl font-bold text-ink-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Logged in as {email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-ink-900">
              Jobs
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Manage job listings.
            </p>
          </div>

          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-ink-900">
              Companies
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Manage companies.
            </p>
          </div>

          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-ink-900">
              Resources
            </h2>
            <p className="mt-2 text-sm text-ink-500">
              Manage resources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
      }
