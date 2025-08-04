import { useState, useEffect } from 'react';
import useInstallPrompt from '../hooks/useInstallPrompt';
import { X } from 'lucide-react'; // If you're not using lucide, see note below

export default function InstallAppButton() {
  const { isInstallable, promptInstall } = useInstallPrompt();

  // Check localStorage on mount
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem('hideInstallPrompt');
  });

  useEffect(() => {
    if (!isInstallable) setVisible(false);
  }, [isInstallable]);

  const handleClose = () => {
    localStorage.setItem('hideInstallPrompt', 'true');
    setVisible(false);
  };

  if (!isInstallable || !visible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border p-3 shadow-lg rounded-xl z-50 w-[280px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-700 text-sm mb-2">Install Artisan Directory App?</p>
          <button
            onClick={promptInstall}
            className="bg-yellow-400 text-black text-sm px-3 py-1 rounded hover:bg-yellow-500"
          >
            Install
          </button>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 ml-2"
          aria-label="Close install prompt"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
