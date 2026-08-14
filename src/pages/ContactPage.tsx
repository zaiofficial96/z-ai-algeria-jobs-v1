import { useState, type FormEvent } from 'react';
import { useI18n } from '@/i18n';
import { useToast } from '@/components/ui/ToastProvider';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, MessageSquare, Briefcase, AlertCircle } from 'lucide-react';

export function ContactPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      showToast(t('contact.sent'), 'success');
    }, 800);
  };

  const contactTypes = [
    { icon: Mail, label: t('contact.support') },
    { icon: Briefcase, label: t('contact.business') },
    { icon: AlertCircle, label: t('contact.employer') },
    { icon: MessageSquare, label: t('contact.report') },
  ];

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: t('nav.home'), to: '/' }, { label: t('contact.title') }]} className="mb-4" />

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-ink-900">{t('contact.title')}</h1>
          <p className="mt-1 text-ink-500">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-200 bg-white p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t('contact.name')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label={t('contact.email')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Input
                label={t('contact.subject')}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
              <Textarea
                label={t('contact.message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
              <Button type="submit" variant="primary" isLoading={sending}>
                {t('contact.send')}
              </Button>
            </form>
          </div>

          <div className="space-y-3">
            {contactTypes.map((type, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 shrink-0">
                  <type.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-ink-700">{type.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
