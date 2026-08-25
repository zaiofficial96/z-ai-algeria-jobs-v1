import { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import { Layout } from '@/components/layout/Layout';

import { HomePage } from '@/pages/HomePage';
import { JobsPage } from '@/pages/JobsPage';
import { JobDetailPage } from '@/pages/JobDetailPage';

import { CompaniesPage } from '@/pages/CompaniesPage';
import { CompanyDetailPage } from '@/pages/CompanyDetailPage';

import { LocationsPage } from '@/pages/LocationsPage';
import { LocationDetailPage } from '@/pages/LocationDetailPage';

import { CategoriesPage } from '@/pages/CategoriesPage';
import { CategoryDetailPage } from '@/pages/CategoryDetailPage';

import { ResourcesPage } from '@/pages/ResourcesPage';
import { ResourceDetailPage } from '@/pages/ResourceDetailPage';

import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { TrustPage } from '@/pages/TrustPage';

import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';

import { AdminPage } from '@/pages/AdminPage';
import { AdminJobsPage } from '@/pages/AdminJobsPage';
import { AdminNewJobPage } from '@/pages/AdminNewJobPage';

import { NotFoundPage } from '@/pages/NotFoundPage';

import { supabase } from '@/lib/supabase';

function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdminAccess() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (mounted) {
            setAuthorized(false);
            setChecking(false);
          }
          return;
        }

        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error || !adminUser) {
          if (mounted) {
            setAuthorized(false);
            setChecking(false);
          }
          return;
        }

        if (mounted) {
          setAuthorized(true);
          setChecking(false);
        }
      } catch (error) {
        console.error('Admin authorization error:', error);

        if (mounted) {
          setAuthorized(false);
          setChecking(false);
        }
      }
    }

    checkAdminAccess();

    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm font-medium text-primary-600">
            Z AI Algeria Jobs
          </p>

          <p className="mt-2 text-sm text-ink-500">
            Checking administrator access...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },

        {
          path: 'jobs',
          element: <JobsPage />,
        },

        {
          path: 'jobs/:id',
          element: <JobDetailPage />,
        },

        {
          path: 'companies',
          element: <CompaniesPage />,
        },

        {
          path: 'companies/:id',
          element: <CompanyDetailPage />,
        },

        {
          path: 'locations',
          element: <LocationsPage />,
        },

        {
          path: 'locations/:wilaya',
          element: <LocationDetailPage />,
        },

        {
          path: 'categories',
          element: <CategoriesPage />,
        },

        {
          path: 'categories/:category',
          element: <CategoryDetailPage />,
        },

        {
          path: 'resources',
          element: <ResourcesPage />,
        },

        {
          path: 'resources/:id',
          element: <ResourceDetailPage />,
        },

        {
          path: 'about',
          element: <AboutPage />,
        },

        {
          path: 'contact',
          element: <ContactPage />,
        },

        {
          path: 'trust',
          element: <TrustPage />,
        },

        {
          path: 'login',
          element: <LoginPage />,
        },

        {
          path: 'register',
          element: <RegisterPage />,
        },

        {
          path: 'reset-password',
          element: <ResetPasswordPage />,
        },

        {
          path: 'admin',
          element: (
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          ),
        },

        {
          path: 'admin/jobs',
          element: (
            <AdminRoute>
              <AdminJobsPage />
            </AdminRoute>
          ),
        },

        {
          path: 'admin/jobs/new',
          element: (
            <AdminRoute>
              <AdminNewJobPage />
            </AdminRoute>
          ),
        },

        {
          path: '*',
          element: <NotFoundPage />,
        },
      ],
    },
  ],
  {
    basename: '/z-ai-algeria-jobs-v1',
  }
);

export default function App() {
  return <RouterProvider router={router} />;
  }
