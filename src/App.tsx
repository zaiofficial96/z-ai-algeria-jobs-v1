import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import { NotFoundPage } from '@/pages/NotFoundPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },

        { path: 'jobs', element: <JobsPage /> },
        { path: 'jobs/:id', element: <JobDetailPage /> },

        { path: 'companies', element: <CompaniesPage /> },
        { path: 'companies/:id', element: <CompanyDetailPage /> },

        { path: 'locations', element: <LocationsPage /> },
        { path: 'locations/:wilaya', element: <LocationDetailPage /> },

        { path: 'categories', element: <CategoriesPage /> },
        { path: 'categories/:category', element: <CategoryDetailPage /> },

        { path: 'resources', element: <ResourcesPage /> },
        { path: 'resources/:id', element: <ResourceDetailPage /> },

        { path: 'about', element: <AboutPage /> },
        { path: 'contact', element: <ContactPage /> },
        { path: 'trust', element: <TrustPage /> },

        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },

        { path: '*', element: <NotFoundPage /> },
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
