import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <>
      <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl animate-popIn pointer-events-auto">
          {title && (
            <div className="flex items-start justify-between p-5">
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Close" title="Close">✕</button>
            </div>
          )}
          <div className="p-5">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
}
