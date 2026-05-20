import { useInstallPrompt } from '@/hooks/useInstallPrompt';

/**
 * Subtle fixed bottom banner offering a native "Add to Home Screen" install.
 * Only visible when the browser fires a `beforeinstallprompt` event.
 */
export default function InstallPrompt() {
  const { canInstall, install, dismiss } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <div
      role="complementary"
      aria-label="Install app prompt"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-slate-800 border border-slate-600 shadow-xl rounded-2xl px-4 py-3 max-w-sm w-[calc(100%-2rem)]"
    >
      {/* App icon */}
      <img
        src="/icons/icon.svg"
        alt=""
        aria-hidden="true"
        className="w-10 h-10 rounded-xl shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">Untung Utuh</p>
        <p className="text-xs text-slate-400">Pasang di layar utama</p>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={dismiss}
          aria-label="Tutup"
          className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Nanti
        </button>
        <button
          onClick={install}
          className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors"
        >
          Pasang
        </button>
      </div>
    </div>
  );
}
