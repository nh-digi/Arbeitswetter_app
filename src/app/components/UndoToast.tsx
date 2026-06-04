import { useEffect } from 'react';
import { X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export default function UndoToast({ message, onUndo, onDismiss, duration = 5000 }: UndoToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <div
        className="flex items-center gap-4 px-4 py-3 rounded-lg shadow-lg"
        style={{
          backgroundColor: 'var(--neutral-950)',
          border: '1px solid var(--neutral-800)',
        }}
      >
        <p
          className="text-sm flex-1"
          style={{
            color: 'white',
            fontFamily: 'var(--font-family)',
          }}
        >
          {message}
        </p>

        <button
          onClick={onUndo}
          className="px-3 py-1.5 rounded-md hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            fontFamily: 'var(--font-family)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Rückgängig
        </button>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <X className="w-4 h-4" style={{ color: 'var(--neutral-500)' }} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
