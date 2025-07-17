import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useRedirect } from '../hooks/useRedirect';
import { usePasswordValidation } from '../hooks/usePasswordValidation';
import toast from 'react-hot-toast';
// import ReCAPTCHA from 'react-google-recaptcha';


export default function Signup() {
  const navigate = useNavigate();
  const { user, error, signup, loading } = useAuthStore();
  const { redirect } = useRedirect();
  // const [recaptchaToken, setRecaptchaToken] = useState('');


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    checks,
    passwordsMatch,
    passwordIsValid
  } = usePasswordValidation();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  const handleCaptchaChange = (token) => {
  //   setRecaptchaToken(token);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    if (!passwordIsValid) {
      toast.error('Password does not meet strength requirements');
      return;
    }

    try {
      const success = await signup({
        ...formData,
        password,
      });

      if (success) {
        toast.success('Account created!');
        redirect();
      } else {
        toast.error(error || 'Signup failed');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred');
    }
  };

  const getClass = (check) =>
    check ? 'text-green-600 font-medium' : 'text-gray-500';

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-charcoal mb-6 text-center">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
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
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* ✅ Password rules */}
        {password && (
          <div className="text-sm mt-1 space-y-1">
            <p className={getClass(checks.length)}>• At least 8 characters</p>
            <p className={getClass(checks.uppercase)}>• Contains an uppercase letter</p>
            <p className={getClass(checks.symbol)}>• Includes a symbol (!@#$...)</p>
            <p className={getClass(passwordsMatch)}>• Passwords match</p>
          </div>
        )}

        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          className="w-full border p-2 rounded"
        >
          <option value="user">Customer</option>
          <option value="artisan">Artisan</option>
        </select>

        {formData.role === 'artisan' && (
          <p className="text-sm text-gray-500 italic">
            You’ll be able to complete your artisan profile after signing up.
          </p>
        )}

      {/* <ReCAPTCHA
        sitekey="your_public_site_key"
        onChange={handleCaptchaChange}
      /> */}

        <button
          type="submit"
          disabled={
            loading ||
            !formData.name ||
            !formData.email ||
            !passwordIsValid ||
            !passwordsMatch
          }
          className="w-full bg-[#1E3A8A] text-white py-2 rounded hover:bg-blue-800"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
