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
      className="fixed left-3 right-3 sm:left-1/2 sm:right-auto sm:w-auto sm:-translate-x-1/2 md:left-[calc(50%+8rem)] bottom-[84px] md:bottom-6 z-50 animate-slide-up"
    >
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl shadow-lg"
        style={{
          backgroundColor: 'var(--neutral-950)',
          border: '1px solid var(--neutral-800)',
        }}
      >
        <p
          className="text-sm flex-1 whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            color: 'white',
            fontFamily: 'var(--font-family)',
          }}
        >
          {message}
        </p>

        <button
          onClick={onUndo}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'white',
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--type-size-body-sm)',
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Rückgängig
        </button>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:opacity-80 transition-opacity"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <X className="w-3.5 h-3.5" style={{ color: 'var(--neutral-400)' }} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
