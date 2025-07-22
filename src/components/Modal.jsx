import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FocusScope, useFocusManager } from '@react-aria/focus';

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div
          className="bg-white rounded shadow-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </FocusScope>
    </div>,
    document.body
  );
}