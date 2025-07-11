import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import axiosInstance from '../api/axios';
import { toast } from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

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
    if (!passwordIsValid) return;

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        password,
      });
      toast.success(res.data.message || 'Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-charcoal">
      <h2 className="text-xl font-semibold mb-4 text-center text-deepblue">Reset Your Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>

        {/* Password Rules */}
        <div className="text-sm text-gray-600 space-y-1">
          <p className={checks.length ? 'text-green-600' : 'text-red-600'}>
            • At least 8 characters
          </p>
          <p className={checks.uppercase ? 'text-green-600' : 'text-red-600'}>
            • At least one uppercase letter
          </p>
          <p className={checks.symbol ? 'text-green-600' : 'text-red-600'}>
            • At least one symbol
          </p>
          <p className={passwordsMatch ? 'text-green-600' : 'text-red-600'}>
            • Passwords match
          </p>
        </div>

        <button
          type="submit"
          disabled={!passwordIsValid || submitting}
          className={`w-full py-2 px-4 rounded bg-[#1E3A8A] text-white font-semibold ${
            !passwordIsValid || submitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
