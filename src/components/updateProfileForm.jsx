import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export default function UpdateProfileForm() {
  const { user, updateProfile } = useAuthStore();
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateProfile({ phone, address });
    setLoading(false);
    if (success) {
      // Optionally clear fields or show confirmation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal">Phone Number</label>
        <input
          type="text"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal">Address</label>
        <textarea
          className="mt-1 block w-full border rounded px-3 py-2"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}
