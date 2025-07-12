import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function ResendVerification() {
  const [email, setEmail] = useState('');
  const {user, resendVerification, loading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await resendVerification(email);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold text-charcoal">Resend Email Verification</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your email address"
          className="w-full border p-2 rounded"
          value={email || user?.email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1E3A8A] text-white py-2 rounded"
        >
          {loading ? 'Sending...' : 'Resend Email'}
        </button>
      </form>
    </div>
  );
}
