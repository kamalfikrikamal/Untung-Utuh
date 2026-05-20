import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const SIZES = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
      onClick={(e) => e.target === overlayRef.current && onClose()}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <dialog
        open
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`bg-slate-900 rounded-2xl w-full p-0 ${SIZES[size]} shadow-2xl border border-slate-700 my-4`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <h2 id="modal-title" className="text-lg font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-slate-400 hover:text-white transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-700 text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </dialog>
    </div>,
    document.body
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};
