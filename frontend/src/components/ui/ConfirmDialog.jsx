import PropTypes from 'prop-types';
import Modal from './Modal';

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Delete',
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-slate-300 mb-6 leading-relaxed">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 transition-colors min-w-[80px]"
        >
          {loading ? 'Processing…' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  loading: PropTypes.bool,
};
