// src/components/ChangePasswordForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import { useAuthStore } from '../store/useAuthStore';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore(); // 💡 call store logout

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    checks,
    passwordsMatch,
    passwordIsValid,
  } = usePasswordValidation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordIsValid) {
      toast.error('Password does not meet the requirements');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.patch('/auth/change-password', {
        currentPassword,
        newPassword: password,
      });

      toast.success(res.data.message || 'Password changed successfully');

      // ✅ Force logout
      await logout();
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Password */}
      <div>
        <label className="block font-medium text-charcoal">Current Password</label>
        <input
          type="password"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>

      {/* New Password */}
      <div>
        <label className="block font-medium text-charcoal">New Password</label>
        <input
          type="password"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <ul className="text-sm mt-2 ml-2 text-gray-600 space-y-1">
          <li className={checks.length ? 'text-green-600' : ''}>• At least 8 characters</li>
          <li className={checks.uppercase ? 'text-green-600' : ''}>• At least one uppercase letter</li>
          <li className={checks.symbol ? 'text-green-600' : ''}>• At least one symbol</li>
        </ul>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block font-medium text-charcoal">Confirm New Password</label>
        <input
          type="password"
          className="mt-1 block w-full border rounded px-3 py-2"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {!passwordsMatch && confirmPassword && (
          <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? 'Updating...' : 'Change Password'}
      </button>
    </form>
  );
}
