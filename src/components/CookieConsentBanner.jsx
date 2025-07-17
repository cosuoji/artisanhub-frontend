import { useEffect, useState } from 'react';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between z-50">
      <span>
        This site uses cookies to improve user experience. By using our site, you accept cookies.
      </span>
      <button onClick={acceptCookies} className="ml-4 bg-green-600 px-4 py-2 rounded">
        Accept
      </button>
    </div>
  );
}
