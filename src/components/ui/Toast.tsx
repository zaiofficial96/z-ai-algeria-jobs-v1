import { cn } from '@/utils/cn';

type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant?: ToastVariant;
}

export function Toast({ toast }: { toast: ToastItem }) {
  const variantClasses: Record<ToastVariant, string> = {
    success: 'bg-success-600 text-white',
    error: 'bg-danger-600 text-white',
    info: 'bg-ink-800 text-white',
  };
  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg',
        'animate-slide-up',
        variantClasses[toast.variant ?? 'success']
      )}
      role="status"
    >
      {toast.variant === 'success' && (
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
}
