import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type JobRow = {
  id: string;
  slug: string;
  title_ar: string;
  title_fr: string | null;
  title_en: string | null;
  company_name: string | null;
  wilaya: string | null;
  category: string | null;
  contract_type: string | null;
  verification_status: string | null;
  is_active: boolean | null;
  created_at: string;
};

export function AdminJobsPage() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadJobs() {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('jobs')
      .select(
        'id, slug, title_ar, title_fr, title_en, company_name, wilaya, category, contract_type, verification_status, is_active, created_at'
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin jobs error:', error);
      setError(error.message);
      setJobs([]);
    } else {
      setJobs((data ?? []) as JobRow[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-600">
              Z AI Algeria Jobs
            </p>

            <h1 className="mt-1 text-3xl font-bold text-ink-900">
              Manage Jobs
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              View and manage job listings.
            </p>
          </div>

          <div className="flex gap-3">
              <button
  type="button"
  onClick={() => navigate('/admin/jobs/new')}
  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
>
  + Add Job
</button>
              type="button"
              onClick={() => navigate('/admin')}
              className="rounded-lg border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              Back to Dashboard
            </button>

            <button
              type="button"
              onClick={() => loadJobs()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white shadow-sm">
          <div className="border-b border-ink-200 px-6 py-4">
            <h2 className="font-semibold text-ink-900">
              Jobs ({jobs.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-ink-500">
              Loading jobs...
            </div>
          ) : error ? (
            <div className="p-6">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-ink-900">
                No jobs found.
              </p>

              <p className="mt-2 text-sm text-ink-500">
                Your jobs table is currently empty.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-ink-200">
                <thead className="bg-ink-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Job
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Company
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Wilaya
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Category
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-ink-200 bg-white">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-ink-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-ink-900">
                          {job.title_ar}
                        </div>

                        <div className="mt-1 text-xs text-ink-400">
                          {job.slug}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-ink-700">
                        {job.company_name || '—'}
                      </td>

                      <td className="px-6 py-4 text-sm text-ink-700">
                        {job.wilaya || '—'}
                      </td>

                      <td className="px-6 py-4 text-sm text-ink-700">
                        {job.category || '—'}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            job.is_active
                              ? 'rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700'
                              : 'rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-500'
                          }
                        >
                          {job.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
