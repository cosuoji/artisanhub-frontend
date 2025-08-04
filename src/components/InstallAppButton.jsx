import useInstallPrompt from '../hooks/useInstallPrompt';

export default function InstallAppButton() {
  const { isInstallable, promptInstall } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border p-3 shadow-lg rounded-xl z-50">
      <p className="text-gray-700 mb-2">Install Artisan Directory App?</p>
      <button
        onClick={promptInstall}
        className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-500"
      >
        Install
      </button>
    </div>
  );
}
