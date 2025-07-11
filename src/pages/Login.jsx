import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useRedirect } from '../hooks/useRedirect';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login, user, error, loading } = useAuthStore();
  const { redirect } = useRedirect();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const success = await login(formData);

        if (success) {
          toast.success('Welcome Back!');
          redirect();
        }
      } catch (err) {
        toast.error(err.message || 'An error occurred');
      }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-[#1F2937] mb-6 text-center">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1E3A8A] text-white py-2 rounded hover:bg-blue-800"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="text-sm text-center mt-4">
        Don’t have an account?{' '}
        <a href="/signup" className="text-[#1E3A8A] hover:underline">
          Sign up
        </a>
      </div>
    </div>
  );
}
