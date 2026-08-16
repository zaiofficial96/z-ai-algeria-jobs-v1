import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { wilayas } from '@/data/wilayas';
import { categories } from '@/data/categories';

export function AdminNewJobPage() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title_ar: '',
    title_fr: '',
    title_en: '',
    company_name: '',
    wilaya: '',
    city: '',
    category: '',
    contract_type: 'CDI',
    experience_level: 'entry',
    remote_type: 'onsite',
    description_ar: '',
    description_fr: '',
    description_en: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'DZD',
    source_url: '',
    source_name: '',
    source_type: 'externalPlatform',
    verification_status: 'unverified',
    published_at: '',
    expires_at: '',
    is_active: true,
  });

  function updateField(key: string, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError('');

    if (!form.title_ar.trim()) {
      setError('Arabic job title is required.');
      setSaving(false);
      return;
    }

    if (!form.wilaya) {
      setError('Please select a wilaya.');
      setSaving(false);
      return;
    }

    if (!form.category) {
      setError('Please select a category.');
      setSaving(false);
      return;
    }

    const slugSource =
      form.title_en ||
      form.title_fr ||
      form.title_ar;

    const cleanSlug = slugSource
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06ff]+/gi, '-')
      .replace(/^-+|-+$/g, '');

    const finalSlug =
      `${cleanSlug || 'job'}-${Date.now()}`;

    const { error: insertError } = await supabase
      .from('jobs')
      .insert({
        slug: finalSlug,

        title_ar: form.title_ar.trim(),
        title_fr: form.title_fr.trim() || null,
        title_en: form.title_en.trim() || null,

        company_name:
          form.company_name.trim() || null,

        // Store the Wilaya code, not the Wilaya name.
        wilaya: form.wilaya,

        city: form.city.trim() || null,

        // Store the category slug.
        category: form.category,

        contract_type:
          form.contract_type || null,

        experience_level:
          form.experience_level || null,

        remote_type:
          form.remote_type || null,

        description_ar:
          form.description_ar.trim() || null,

        description_fr:
          form.description_fr.trim() || null,

        description_en:
          form.description_en.trim() || null,

        salary_min:
          form.salary_min
            ? Number(form.salary_min)
            : null,

        salary_max:
          form.salary_max
            ? Number(form.salary_max)
            : null,

        salary_currency:
          form.salary_currency || 'DZD',

        source_url:
          form.source_url.trim() || null,

        source_name:
          form.source_name.trim() || null,

        source_type:
          form.source_type || null,

        verification_status:
          form.verification_status || null,

        published_at:
          form.published_at ||
          new Date().toISOString(),

        expires_at:
          form.expires_at || null,

        is_active: form.is_active,
      });

    if (insertError) {
      console.error(
        'Create job error:',
        insertError
      );

      setError(insertError.message);
      setSaving(false);
      return;
    }

    navigate('/admin/jobs');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary-600">
            Z AI Algeria Jobs
          </p>

          <h1 className="mt-1 text-3xl font-bold text-ink-900">
            Add New Job
          </h1>

          <p className="mt-2 text-sm text-ink-500">
            Create a new job listing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-ink-900">
              Basic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Arabic title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Title Arabic *
                </label>

                <input
                  required
                  value={form.title_ar}
                  onChange={(e) =>
                    updateField(
                      'title_ar',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                  placeholder="مثال: مساعد طباخ"
                />
              </div>

              {/* French title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Title French
                </label>

                <input
                  value={form.title_fr}
                  onChange={(e) =>
                    updateField(
                      'title_fr',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                  placeholder="Aide cuisine"
                />
              </div>

              {/* English title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Title English
                </label>

                <input
                  value={form.title_en}
                  onChange={(e) =>
                    updateField(
                      'title_en',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                  placeholder="Kitchen Assistant"
                />
              </div>

              {/* Company */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Company
                </label>

                <input
                  value={form.company_name}
                  onChange={(e) =>
                    updateField(
                      'company_name',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                  placeholder="Company name"
                />
              </div>

              {/* Wilaya */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Wilaya *
                </label>

                <select
                  required
                  value={form.wilaya}
                  onChange={(e) =>
                    updateField(
                      'wilaya',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
                >
                  <option value="">
                    Select wilaya
                  </option>

                  {wilayas.map((wilaya) => (
                    <option
                      key={wilaya.code}
                      value={String(wilaya.code)}
                    >
                      {wilaya.name.ar} —{' '}
                      {wilaya.name.fr}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  City / Commune
                </label>

                <input
                  value={form.city}
                  onChange={(e) =>
                    updateField(
                      'city',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                  placeholder="مثال: بسكرة"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Category *
                </label>

                <select
                  required
                  value={form.category}
                  onChange={(e) =>
                    updateField(
                      'category',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.slug}
                      value={category.slug}
                    >
                      {category.name.ar} —{' '}
                      {category.name.fr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-ink-900">
              Job Details
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              {/* Contract */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Contract
                </label>

                <select
                  value={form.contract_type}
                  onChange={(e) =>
                    updateField(
                      'contract_type',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Freelance">
                    Freelance
                  </option>
                  <option value="Internship">
                    Internship
                  </option>
                  <option value="Temporary">
                    Temporary
                  </option>
                  <option value="PartTime">
                    Part Time
                  </option>
                  <option value="FullTime">
                    Full Time
                  </option>
                  <option value="Apprenticeship">
                    Apprenticeship
                  </option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Experience
                </label>

                <select
                  value={form.experience_level}
                  onChange={(e) =>
                    updateField(
                      'experience_level',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
                >
                  <option value="none">
                    No experience
                  </option>
                  <option value="internship">
                    Internship
                  </option>
                  <option value="entry">
                    Entry level
                  </option>
                  <option value="1to2">
                    1-2 years
                  </option>
                  <option value="3to5">
                    3-5 years
                  </option>
                  <option value="5plus">
                    5+ years
                  </option>
                  <option value="senior">
                    Senior
                  </option>
                  <option value="manager">
                    Manager
                  </option>
                </select>
              </div>

              {/* Work type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-ink-700">
                  Work Type
                </label>

                <select
                  value={form.remote_type}
                  onChange={(e) =>
                    updateField(
                      'remote_type',
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
                >
                  <option value="onsite">
                    On-site
                  </option>
                  <option value="hybrid">
                    Hybrid
                  </option>
                  <option value="remote">
                    Remote
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-ink-900">
              Description
            </h2>

            <div className="space-y-5">
              <textarea
                value={form.description_ar}
                onChange={(e) =>
                  updateField(
                    'description_ar',
                    e.target.value
                  )
                }
                className="min-h-32 w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                placeholder="وصف الوظيفة بالعربية"
              />

              <textarea
                value={form.description_fr}
                onChange={(e) =>
                  updateField(
                    'description_fr',
                    e.target.value
                  )
                }
                className="min-h-32 w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                placeholder="Description du poste"
              />

              <textarea
                value={form.description_en}
                onChange={(e) =>
                  updateField(
                    'description_en',
                    e.target.value
                  )
                }
                className="min-h-32 w-full rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                placeholder="Job description"
              />
            </div>
          </div>

          {/* Salary */}
          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-ink-900">
              Salary
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <input
                type="number"
                min="0"
                value={form.salary_min}
                onChange={(e) =>
                  updateField(
                    'salary_min',
                    e.target.value
                  )
                }
                className="rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                placeholder="Minimum salary"
              />

              <input
                type="number"
                min="0"
                value={form.salary_max}
                onChange={(e) =>
                  updateField(
                    'salary_max',
                    e.target.value
                  )
                }
                className="rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                placeholder="Maximum salary"
              />

              <select
                value={form.salary_currency}
                onChange={(e) =>
                  updateField(
                    'salary_currency',
                    e.target.value
                  )
                }
                className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
              >
                <option value="DZD">DZD</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Source & Verification */}
          <div className="rounded-xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-ink-900">
              Source & Verification
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                value={form.source_name}
                onChange={(e) =>
                  updateField(
                    'source_name',
                    e.target.value
                  )
                }
                className="rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                placeholder="Source name"
              />

              <input
                type="url"
                value={form.source_url}
                onChange={(e) =>
                  updateField(
                    'source_url',
                    e.target.value
                  )
                }
                className="rounded-lg border border-ink-200 px-3 py-2.5 outline-none focus:border-primary-500"
                placeholder="https://..."
              />

              <select
                value={form.source_type}
                onChange={(e) =>
                  updateField(
                    'source_type',
                    e.target.value
                  )
                }
                className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
              >
                <option value="officialCompanySite">
                  Official company site
                </option>

                <option value="governmentSource">
                  Government source
                </option>

                <option value="externalPlatform">
                  External platform
                </option>

                <option value="employerListing">
                  Employer listing
                </option>

                <option value="communitySource">
                  Community source
                </option>
              </select>

              <select
                value={form.verification_status}
                onChange={(e) =>
                  updateField(
                    'verification_status',
                    e.target.value
                  )
                }
                className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 outline-none focus:border-primary-500"
              >
                <option value="unverified">
                  Unverified
                </option>

                <option value="recentlyChecked">
                  Recently checked
                </option>

                <option value="sourceConfirmed">
                  Source confirmed
                </option>

                <option value="verified">
                  Verified
                </option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                navigate('/admin/jobs')
              }
              className="rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : 'Publish Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
