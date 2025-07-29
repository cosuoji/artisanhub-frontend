import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

export default function ReferralCard() {
  const [code, setCode] = useState('');
  const [stats, setStats] = useState({});

  useEffect(() => {
    axiosInstance.get('/referral/code').then(res => setCode(res.data.code));
    axiosInstance.get('/referral/stats').then(res => setStats(res.data));
  }, []);

  const copy = () => navigator.clipboard.writeText(`${window.location.origin}?ref=${code}`);

  return (
    <div className="border p-4 rounded shadow">
      <p className="font-bold">Your referral code:</p>
      <p className="text-blue-600 text-xl">{code}</p>
      <button onClick={copy} className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Copy</button>
      <p className="mt-2">Referrals: {stats.count}</p>
    </div>
  );
}