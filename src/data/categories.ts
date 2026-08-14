import type { Category } from '@/types';

export const categories: Category[] = [
  { slug: 'informatique', name: { ar: 'معلوماتية وتقنية', fr: 'Informatique & IT', en: 'IT & Technology' }, icon: 'Laptop' },
  { slug: 'finance', name: { ar: 'مالية ومحاسبة', fr: 'Finance & Comptabilité', en: 'Finance & Accounting' }, icon: 'Calculator' },
  { slug: 'commerce', name: { ar: 'تجارة ومبيعات', fr: 'Commerce & Vente', en: 'Commerce & Sales' }, icon: 'ShoppingCart' },
  { slug: 'marketing', name: { ar: 'تسويق', fr: 'Marketing', en: 'Marketing' }, icon: 'Megaphone' },
  { slug: 'rh', name: { ar: 'موارد بشرية', fr: 'Ressources Humaines', en: 'Human Resources' }, icon: 'Users' },
  { slug: 'ingenierie', name: { ar: 'هندسة', fr: 'Ingénierie', en: 'Engineering' }, icon: 'Cog' },
  { slug: 'construction', name: { ar: 'بناء', fr: 'Construction', en: 'Construction' }, icon: 'HardHat' },
  { slug: 'transport', name: { ar: 'نقل', fr: 'Transport', en: 'Transport' }, icon: 'Truck' },
  { slug: 'logistique', name: { ar: 'لوجستيك', fr: 'Logistique', en: 'Logistics' }, icon: 'Package' },
  { slug: 'hotellerie', name: { ar: 'فندقة ومطاعم', fr: 'Hôtellerie & Restauration', en: 'Hospitality & Food' }, icon: 'UtensilsCrossed' },
  { slug: 'sante', name: { ar: 'صحة', fr: 'Santé', en: 'Healthcare' }, icon: 'HeartPulse' },
  { slug: 'education', name: { ar: 'تعليم', fr: 'Éducation', en: 'Education' }, icon: 'GraduationCap' },
  { slug: 'securite', name: { ar: 'أمن', fr: 'Sécurité', en: 'Security' }, icon: 'ShieldCheck' },
  { slug: 'administration', name: { ar: 'إدارة', fr: 'Administration', en: 'Administration' }, icon: 'Briefcase' },
  { slug: 'industrie', name: { ar: 'صناعة', fr: 'Industrie', en: 'Industry' }, icon: 'Factory' },
  { slug: 'maintenance', name: { ar: 'صيانة', fr: 'Maintenance', en: 'Maintenance' }, icon: 'Wrench' },
  { slug: 'juridique', name: { ar: 'قانوني', fr: 'Juridique', en: 'Legal' }, icon: 'Scale' },
  { slug: 'design', name: { ar: 'تصميم', fr: 'Design', en: 'Design' }, icon: 'Palette' },
  { slug: 'communication', name: { ar: 'اتصال', fr: 'Communication', en: 'Communication' }, icon: 'MessageSquare' },
  { slug: 'agriculture', name: { ar: 'زراعة', fr: 'Agriculture', en: 'Agriculture' }, icon: 'Wheat' },
  { slug: 'tourisme', name: { ar: 'سياحة', fr: 'Tourisme', en: 'Tourism' }, icon: 'MapPin' },
  { slug: 'teletravail', name: { ar: 'عمل عن بعد', fr: 'Télétravail', en: 'Remote Work' }, icon: 'Globe' },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
